import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// ═════════════════════════════════════════════════════════════════════════════
// claude-proxy — Anthropic API proxy for Hey Otis, with per-user rate limiting
//
// Why this exists:
//   The Anthropic API key must NEVER live in the client bundle. Every
//   Anthropic request from the app hits this function instead, which holds
//   the key in its own Deno.env and injects the `x-api-key` header
//   server-side.
//
// Auth + abuse model:
//   - verify_jwt: true rejects anonymous callers at the platform gateway.
//   - Inside the function, two rate-limit windows are enforced per user:
//       * burst: 20 requests per minute
//       * daily: 200 requests per day
//     Hitting either returns 429 with a `Retry-After` header.
//   - The rate-limit RPC is service_role only, so users cannot manipulate
//     their own buckets.
//
// What this function deliberately does NOT do:
//   - Does not log request bodies (user message content is private).
//   - Does not echo raw error text back to the client (could leak headers).
// ═════════════════════════════════════════════════════════════════════════════

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
};

// Tune these as real abuse / legitimate-use patterns emerge.
const RL_BURST_LIMIT = 20;     // requests per minute
const RL_BURST_WINDOW = 60;    // seconds
const RL_DAILY_LIMIT = 200;    // requests per day
const RL_DAILY_WINDOW = 86400; // seconds

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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  // ── Environment
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!apiKey || !supabaseUrl || !anonKey || !serviceKey) {
    console.error("claude-proxy: missing required environment variables");
    return json({ error: "Service temporarily unavailable" }, 503);
  }

  // ── Identify caller from the verified JWT.
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return json({ error: "Unauthorized" }, 401);
  }
  const userClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) {
    return json({ error: "Unauthorized" }, 401);
  }
  const userId = userData.user.id;

  // ── Rate-limit checks (run in parallel, fail fast on the tighter window).
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

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
      // Fail closed rather than open — reject the request and return 503 so
      // the client retries. Prevents a broken limiter from disabling protection.
      return json({ error: "Service temporarily unavailable" }, 503);
    }

    const burstRow = Array.isArray(burst.data) ? burst.data[0] : burst.data;
    const dailyRow = Array.isArray(daily.data) ? daily.data[0] : daily.data;

    if (burstRow && burstRow.allowed === false) {
      return json(
        { error: "Too many requests. Please wait a moment.", scope: "burst" },
        429,
        { "Retry-After": String(secondsUntil(burstRow.reset_at)) },
      );
    }
    if (dailyRow && dailyRow.allowed === false) {
      return json(
        { error: "Daily limit reached. Please try again tomorrow.", scope: "daily" },
        429,
        { "Retry-After": String(secondsUntil(dailyRow.reset_at)) },
      );
    }
  } catch (e) {
    console.error("claude-proxy: unexpected rate-limit error", e);
    return json({ error: "Service temporarily unavailable" }, 503);
  }

  // ── Body parsing
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  // ── Upstream Anthropic call
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
    return json({ error: "Upstream request failed" }, 502);
  }
});
