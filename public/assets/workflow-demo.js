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
  const requestedWorkflow = params.get("workflow");
  const workflow = requestedWorkflow && allowedWorkflows[requestedWorkflow] ? requestedWorkflow : "workflow-mapping";
  const workflowLabel = allowedWorkflows[workflow];
  const campaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];
  let storedAttribution = {};
  try { storedAttribution = JSON.parse(window.sessionStorage.getItem("wexpro_attribution_v1") || "{}"); } catch { /* storage is optional */ }
  const attribution = {};
  campaignKeys.forEach((key) => {
    const value = params.get(key) || (typeof storedAttribution[key] === "string" ? storedAttribution[key] : "");
    if (value) attribution[key] = value.slice(0, 160);
  });
  const landingPath = params.get("landing_path") || (typeof storedAttribution.landing_path === "string" ? storedAttribution.landing_path : "");
  if (landingPath.startsWith("/")) attribution.landing_path = landingPath.split(/[?#]/, 1)[0].slice(0, 240);
  const referrerHost = params.get("referrer_host") || (typeof storedAttribution.referrer_host === "string" ? storedAttribution.referrer_host : "");
  if (/^[a-z0-9.-]+(?::\d+)?$/i.test(referrerHost)) attribution.referrer_host = referrerHost.slice(0, 160);
  const cta = (params.get("cta") || "unknown").slice(0, 80);
  const context = document.querySelector("[data-booking-context]");
  if (context) context.textContent = `Bring ${workflowLabel.toLowerCase()}. We’ll map what you demonstrate, what Wexpro would draft, what should stay under review, and whether it fits a controlled pilot.`;
  const recordEvent = (event, details = {}) => {
    if (typeof window.wexproTrack === "function") {
      window.wexproTrack(event, details);
      return;
    }
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
  cal("on", { action: "bookingSuccessfulV2", callback: (event) => {
    const data = event?.detail?.data || {};
    recordEvent("booking_complete", {
      workflow,
      cta,
      page_path: window.location.pathname,
      booking_status: typeof data.status === "string" ? data.status.slice(0, 40) : "created",
      is_recurring: Boolean(data.isRecurring),
    });
  } });
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
