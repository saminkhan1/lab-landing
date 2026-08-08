const ALLOWED_EVENTS = new Set([
  "page_view",
  "cta_click",
  "booking_widget_ready",
  "booking_fallback",
  "booking_complete",
  "deployment_smoke",
]);

const clean = (value, limit = 160) => {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, limit);
};

const pathOnly = (value, limit = 240) => {
  const raw = clean(value, limit);
  if (!raw.startsWith("/") || raw.startsWith("//")) return "";
  try {
    return new URL(raw, "https://wexprolabs.com").pathname.slice(0, limit);
  } catch {
    return "";
  }
};

const response = (status, message = "") => new Response(message, {
  status,
  headers: {
    "Cache-Control": "no-store",
    "Content-Type": "text/plain; charset=utf-8",
  },
});

export async function onRequest({ request, env }) {
  if (request.method !== "POST") return response(405, "Method not allowed");

  const requestUrl = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (requestUrl.hostname !== "wexprolabs.com") return response(403, "Host not allowed");
  if (origin !== requestUrl.origin) return response(403, "Origin not allowed");

  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.toLowerCase().startsWith("application/json")) return response(415, "JSON required");

  const declaredLength = Number(request.headers.get("Content-Length") || 0);
  if (declaredLength > 4096) return response(413, "Payload too large");

  let raw;
  let body;
  try {
    raw = await request.text();
    if (raw.length > 4096) return response(413, "Payload too large");
    body = JSON.parse(raw);
  } catch {
    return response(400, "Invalid JSON");
  }

  const event = clean(body?.event, 48);
  if (!ALLOWED_EVENTS.has(event)) return response(400, "Unknown event");

  const attribution = body?.attribution && typeof body.attribution === "object" ? body.attribution : {};
  const pagePath = pathOnly(body?.page_path);
  if (!pagePath) return response(400, "Invalid page path");

  env.SEO_FUNNEL.writeDataPoint({
    indexes: [clean(body?.session_id, 96) || "anonymous"],
    blobs: [
      event,
      pagePath,
      clean(body?.cta, 80),
      clean(body?.workflow, 80),
      clean(attribution.utm_source, 120),
      clean(attribution.utm_medium, 120),
      clean(attribution.utm_campaign, 160),
      clean(attribution.utm_content, 160),
      clean(attribution.referrer_host, 160),
      pathOnly(attribution.landing_path),
      clean(body?.booking_status, 40),
    ],
    doubles: [Date.now() / 1000, body?.is_recurring === true ? 1 : 0],
  });

  return new Response(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
}
