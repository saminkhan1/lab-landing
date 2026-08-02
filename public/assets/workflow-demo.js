(() => {
  const bookingRoot = document.querySelector("[data-cal-link]");
  if (!bookingRoot) return;

  const allowedWorkflows = {
    "workflow-mapping": "one recurring workflow",
    "request-intake": "Request intake → updated record",
    reporting: "Recurring report → checked brief",
    reconciliation: "Invoice or order → reconciled systems",
    onboarding: "Client onboarding → systems ready",
    "account-change": "Account change → verified update",
    "recurring-check": "Recurring check → exception queue",
  };
  const params = new URLSearchParams(window.location.search);
  const workflow = params.get("workflow");
  const workflowLabel = workflow && allowedWorkflows[workflow] ? allowedWorkflows[workflow] : "one recurring workflow";
  const attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "gclid", "msclkid", "landing_path", "referrer_host", "cta_page"];
  let storedAttribution = {};
  try { storedAttribution = JSON.parse(window.sessionStorage.getItem("wexpro_attribution_v1") || "{}"); } catch { /* storage is optional */ }
  const attribution = { ...storedAttribution };
  attributionKeys.forEach((key) => {
    const value = params.get(key);
    if (value) attribution[key] = value.slice(0, 160);
  });
  const cta = params.get("cta") || "unknown";
  const context = document.querySelector("[data-booking-context]");
  if (context) context.textContent = `Bring ${workflowLabel.toLowerCase()}. We’ll map what you demonstrate, what Wexpro would draft, what should stay under review, and whether it fits a controlled pilot.`;
  const recordEvent = (event, details = {}) => {
    try { window.dataLayer = window.dataLayer || []; } catch { /* analytics hooks are optional */ }
    if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event, ...details });
  };

  const calLink = bookingRoot.dataset.calLink?.trim();
  const skeleton = document.querySelector("[data-booking-skeleton]");
  const fallback = document.querySelector(".booking-fallback[data-booking-fallback]");
  const fallbackLink = document.querySelector("[data-booking-fallback-link]");
  const showFallback = () => {
    skeleton?.classList.add("is-hidden");
    fallback?.classList.add("is-visible");
    recordEvent("booking_fallback", { workflow, cta, page_path: window.location.pathname });
  };
  if (!calLink) {
    showFallback();
    return;
  }

  if (fallbackLink) fallbackLink.href = `https://cal.com/${calLink}`;
  ((contextWindow, embedUrl, initCommand) => {
    const enqueue = (api, args) => api.q.push(args);
    const documentRoot = contextWindow.document;
    contextWindow.Cal = contextWindow.Cal || function calEmbed() {
      const cal = contextWindow.Cal;
      const args = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        const script = documentRoot.createElement("script");
        script.src = embedUrl;
        script.async = true;
        script.onerror = showFallback;
        documentRoot.head.appendChild(script);
        cal.loaded = true;
      }
      if (args[0] === initCommand) {
        const api = function namespacedCal() { enqueue(api, arguments); };
        const namespace = args[1];
        api.q = api.q || [];
        if (typeof namespace === "string") {
          cal.ns[namespace] = cal.ns[namespace] || api;
          enqueue(cal.ns[namespace], args);
          enqueue(cal, ["initNamespace", namespace]);
        } else {
          enqueue(cal, args);
        }
        return;
      }
      enqueue(cal, args);
    };
  })(window, "https://app.cal.com/embed/embed.js", "init");

  window.Cal("init", "wexpro-demo", { origin: "https://cal.com" });
  const cal = window.Cal.ns["wexpro-demo"];
  cal("on", { action: "linkReady", callback: () => {
    skeleton?.classList.add("is-hidden");
    recordEvent("booking_widget_ready", { workflow, cta, page_path: window.location.pathname });
  } });
  cal("on", { action: "linkFailed", callback: showFallback });
  const metadata = { workflow, cta, ...attribution, booking_page: window.location.pathname };
  const config = {
    layout: "month_view",
    useSlotsViewOnSmallScreen: "true",
  };
  Object.entries(metadata).forEach(([key, value]) => {
    if (value) config[`metadata[${key}]`] = value;
  });
  cal("inline", {
    elementOrSelector: "#wexpro-cal-embed",
    calLink,
    config,
  });
  cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
})();
