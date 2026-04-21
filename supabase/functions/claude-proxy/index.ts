import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js@2";

// ═════════════════════════════════════════════════════════════════════════════
// claude-proxy — Anthropic API proxy with per-user rate limits + audit logging
//
// Protects three things:
//   1. The Anthropic API key (lives only in Deno.env; never on the client)
//   2. Our Anthropic spend (20/min + 200/day per authenticated user)
//   3. Observability: every rate-limit rejection, auth failure, and upstream
//      error is appended to public.security_events for post-hoc queries.
//
// The security-event writes are fire-and-forget — they NEVER block or delay
// the caller's response, and failures are swallowed so a broken audit table
// can't take down the endpoint.
// ═════════════════════════════════════════════════════════════════════════════

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
};

const RL_BURST_LIMIT = 20;
const RL_BURST_WINDOW = 60;
const RL_DAILY_LIMIT = 200;
const RL_DAILY_WINDOW = 86400;

const SOURCE = "claude-proxy";

function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS, ...extraHeaders },
  });
}

function secondsUntil(resetAt: string | Date): number {
  const ms = new Date(resetAt).getTime() - Date.now();
  return Math.max(1, Math.ceil(ms / 1000));
}

/**
 * Fire-and-forget security-event logger. The returned promise is NOT awaited
 * by the caller; failures are swallowed so a broken audit table cannot
 * affect request latency or availability.
 */
function logEvent(
  admin: SupabaseClient,
  event: {
    event_type: string;
    severity?: "info" | "warn" | "error" | "critical";
    user_id?: string | null;
    details?: Record<string, unknown>;
  },
): void {
  admin
    .rpc("log_security_event", {
      p_event_type: event.event_type,
      p_severity: event.severity ?? "info",
      p_user_id: event.user_id ?? null,
      p_source: SOURCE,
      p_details: event.details ?? {},
    })
    .then(({ error }) => {
      if (error) console.error("log_security_event failed:", error);
    });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!apiKey || !supabaseUrl || !anonKey || !serviceKey) {
    console.error("claude-proxy: missing required environment variables");
    return json({ error: "Service temporarily unavailable" }, 503);
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // ── Identify caller from the verified JWT
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    logEvent(admin, {
      event_type: "auth.missing_bearer",
      severity: "warn",
      details: { ip: req.headers.get("x-forwarded-for") ?? null },
    });
    return json({ error: "Unauthorized" }, 401);
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) {
    logEvent(admin, {
      event_type: "auth.invalid_jwt",
      severity: "warn",
      details: {
        ip: req.headers.get("x-forwarded-for") ?? null,
        reason: userErr?.message ?? "no user",
      },
    });
    return json({ error: "Unauthorized" }, 401);
  }
  const userId = userData.user.id;

  // ── Rate-limit checks
  try {
    const [burst, daily] = await Promise.all([
      admin.rpc("check_rate_limit", {
        p_key: `claude:burst:${userId}`,
        p_limit: RL_BURST_LIMIT,
        p_window_seconds: RL_BURST_WINDOW,
      }),
      admin.rpc("check_rate_limit", {
        p_key: `claude:daily:${userId}`,
        p_limit: RL_DAILY_LIMIT,
        p_window_seconds: RL_DAILY_WINDOW,
      }),
    ]);

    if (burst.error || daily.error) {
      console.error("claude-proxy: rate limit RPC failed", burst.error || daily.error);
      logEvent(admin, {
        event_type: "rate_limit.rpc_error",
        severity: "error",
        user_id: userId,
        details: { burst_error: burst.error?.message, daily_error: daily.error?.message },
      });
      return json({ error: "Service temporarily unavailable" }, 503);
    }

    const burstRow = Array.isArray(burst.data) ? burst.data[0] : burst.data;
    const dailyRow = Array.isArray(daily.data) ? daily.data[0] : daily.data;

    if (burstRow && burstRow.allowed === false) {
      logEvent(admin, {
        event_type: "rate_limit.burst",
        severity: "warn",
        user_id: userId,
        details: {
          limit: RL_BURST_LIMIT,
          window_seconds: RL_BURST_WINDOW,
          current_count: burstRow.current_count,
        },
      });
      return json(
        { error: "Too many requests. Please wait a moment.", scope: "burst" },
        429,
        { "Retry-After": String(secondsUntil(burstRow.reset_at)) },
      );
    }
    if (dailyRow && dailyRow.allowed === false) {
      logEvent(admin, {
        event_type: "rate_limit.daily",
        severity: "warn",
        user_id: userId,
        details: {
          limit: RL_DAILY_LIMIT,
          window_seconds: RL_DAILY_WINDOW,
          current_count: dailyRow.current_count,
        },
      });
      return json(
        { error: "Daily limit reached. Please try again tomorrow.", scope: "daily" },
        429,
        { "Retry-After": String(secondsUntil(dailyRow.reset_at)) },
      );
    }
  } catch (e) {
    console.error("claude-proxy: unexpected rate-limit error", e);
    logEvent(admin, {
      event_type: "rate_limit.exception",
      severity: "error",
      user_id: userId,
      details: { message: e instanceof Error ? e.message : String(e) },
    });
    return json({ error: "Service temporarily unavailable" }, 503);
  }

  // ── Body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  // ── Upstream Anthropic
  try {
    const upstream = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    // Non-2xx upstream: log it, pass the body through as-is. Anthropic's
    // error shape describes the caller's request, safe to return.
    if (!upstream.ok) {
      logEvent(admin, {
        event_type: "upstream.non_2xx",
        severity: upstream.status >= 500 ? "error" : "warn",
        user_id: userId,
        details: { status: upstream.status },
      });
    }

    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") || "application/json",
        ...CORS_HEADERS,
      },
    });
  } catch (error) {
    console.error("claude-proxy upstream error:", error);
    logEvent(admin, {
      event_type: "upstream.exception",
      severity: "error",
      user_id: userId,
      details: { message: error instanceof Error ? error.message : String(error) },
    });
    return json({ error: "Upstream request failed" }, 502);
  }
});
