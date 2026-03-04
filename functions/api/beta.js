function jsonResponse(payload, status) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Cache-Control": "no-store"
    }
  });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function onRequestPost(context) {
  // Set WEB3FORMS_ACCESS_KEY in Cloudflare Pages project environment variables.
  const accessKey = context.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    return jsonResponse({ ok: false, error: "Server configuration missing." }, 500);
  }

  let payload;
  try {
    payload = await context.request.json();
  } catch {
    return jsonResponse({ ok: false, error: "Invalid request body." }, 400);
  }

  const email = (payload.email || "").trim();
  const building = (payload.building || "").trim();
  const website = (payload.website || "").trim();

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
  formData.set("subject", "AgentReach Beta Request");
  formData.set("from_name", "AgentReach Beta");
  formData.set("replyto", email);
  formData.set("email", email);
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
