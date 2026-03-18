function jsonResponse(payload, status) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Cache-Control": "no-store"
    }
  });
}

function methodNotAllowed() {
  return new Response(JSON.stringify({ ok: false, error: "Method not allowed." }), {
    status: 405,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Cache-Control": "no-store",
      "Allow": "POST"
    }
  });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizePayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {};
  }
  return payload;
}

function readStringField(payload, key, required = false) {
  const value = payload[key];
  if (value === undefined || value === null) {
    if (required) {
      return { ok: false, message: "Enter a valid work email." };
    }
    return { ok: true, value: "" };
  }
  if (typeof value !== "string") {
    return { ok: false, message: "Invalid request fields." };
  }
  return { ok: true, value: value.trim() };
}

async function readPayload(request) {
  const contentType = (request.headers.get("content-type") || "").toLowerCase();

  if (contentType.includes("application/json")) {
    try {
      return { ok: true, payload: normalizePayload(await request.json()) };
    } catch {
      return { ok: false };
    }
  }

  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    try {
      const form = await request.formData();
      return {
        ok: true,
        payload: normalizePayload({
          email: form.get("email"),
          building: form.get("building"),
          website: form.get("website")
        })
      };
    } catch {
      return { ok: false };
    }
  }

  try {
    return { ok: true, payload: normalizePayload(await request.json()) };
  } catch {
    return { ok: false };
  }
}

async function handlePost(context) {
  // Set WEB3FORMS_ACCESS_KEY in Cloudflare Pages project environment variables.
  // The access key should be bound to the samin@wexprolabs.com inbox in Web3Forms.
  const accessKey = context.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    return jsonResponse({ ok: false, error: "Server configuration missing." }, 500);
  }

  const parsed = await readPayload(context.request);
  if (!parsed.ok) {
    return jsonResponse({ ok: false, error: "Invalid request body." }, 400);
  }
  const payload = parsed.payload;

  const emailField = readStringField(payload, "email", true);
  if (!emailField.ok) {
    return jsonResponse({ ok: false, error: emailField.message }, 400);
  }
  const buildingField = readStringField(payload, "building");
  if (!buildingField.ok) {
    return jsonResponse({ ok: false, error: buildingField.message }, 400);
  }
  const websiteField = readStringField(payload, "website");
  if (!websiteField.ok) {
    return jsonResponse({ ok: false, error: websiteField.message }, 400);
  }

  const email = emailField.value;
  const building = buildingField.value;
  const website = websiteField.value;

  // Honeypot field. Quietly accept to avoid signaling bot detection.
  if (website) {
    return jsonResponse({ ok: true }, 200);
  }

  if (!isValidEmail(email)) {
    return jsonResponse({ ok: false, error: "Enter a valid work email." }, 400);
  }

  if (building.length > 1200) {
    return jsonResponse({ ok: false, error: "Please shorten your message." }, 400);
  }

  const formData = new URLSearchParams();
  formData.set("access_key", accessKey);
  formData.set("subject", "Agent Connect Beta Request");
  formData.set("from_name", "Agent Connect Beta");
  formData.set("replyto", email);
  formData.set("email", email);
  // CC copy for the Wexpro inbox; Web3Forms still uses the access key for primary delivery.
  formData.set("ccemail", "samin@wexprolabs.com");
  if (building) formData.set("building", building);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
      signal: controller.signal
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.success) {
      return jsonResponse({ ok: false, error: "Submission failed. Please try again." }, 502);
    }

    return jsonResponse({ ok: true }, 200);
  } catch (error) {
    if (error && error.name === "AbortError") {
      return jsonResponse({ ok: false, error: "Request timed out. Please try again." }, 504);
    }
    return jsonResponse({ ok: false, error: "Network error. Please try again." }, 502);
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function onRequest(context) {
  try {
    if (context.request.method !== "POST") {
      return methodNotAllowed();
    }
    return await handlePost(context);
  } catch {
    return jsonResponse({ ok: false, error: "Internal server error." }, 500);
  }
}
