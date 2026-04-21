import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// ═════════════════════════════════════════════════════════════════════════════
// claude-proxy — Anthropic API proxy for Hey Otis
//
// Why this exists:
//   The Anthropic API key must NEVER live in the client bundle. Every
//   Anthropic request from the app hits this function instead, which holds
//   the key in its own Deno.env and injects the `x-api-key` header
//   server-side.
//
// Auth model:
//   - verify_jwt: true at the platform layer rejects anonymous callers.
//   - Only callers with a valid Supabase anon-role JWT (i.e. signed-in
//     users) get past the gateway.
//
// What this function deliberately does NOT do:
//   - Does not log request bodies (user message content is private).
//   - Does not echo raw error text back to the client — that could leak
//     upstream auth headers or API keys in pathological cases.
// ═════════════════════════════════════════════════════════════════════════════

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
};

function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS, ...extraHeaders },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) {
    // Server misconfiguration — caller cannot fix this. Emit a generic 500
    // without hinting which env var is missing.
    console.error('ANTHROPIC_API_KEY is not configured in function secrets');
    return json({ error: 'Service temporarily unavailable' }, 503);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  try {
    const upstream = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    // Stream upstream response back as-is. Anthropic's own error shape
    // (e.g. { type: 'error', error: { type, message } }) is safe to pass
    // through — it describes the caller's request, not our credentials.
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
        ...CORS_HEADERS,
      },
    });
  } catch (error) {
    // NEVER echo `error` / `String(error)` to the client — it can include
    // header values from the failing fetch in some runtime errors. Log
    // server-side; return a generic message to the caller.
    console.error('claude-proxy upstream error:', error);
    return json({ error: 'Upstream request failed' }, 502);
  }
});
