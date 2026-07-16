(() => {
  const bookingRoot = document.querySelector("[data-cal-link]");
  if (!bookingRoot) return;

  const allowedWorkflows = {
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
  const context = document.querySelector("[data-booking-context]");
  if (context) context.textContent = `Bring ${workflowLabel.toLowerCase()}. We’ll map what you demonstrate, what Wexpro would draft, what should stay under review, and whether it fits a controlled pilot.`;

  const calLink = bookingRoot.dataset.calLink?.trim();
  const skeleton = document.querySelector("[data-booking-skeleton]");
  const fallback = document.querySelector(".booking-fallback[data-booking-fallback]");
  const fallbackLink = document.querySelector("[data-booking-fallback-link]");
  const showFallback = () => {
    skeleton?.classList.add("is-hidden");
    fallback?.classList.add("is-visible");
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
  cal("on", { action: "linkReady", callback: () => skeleton?.classList.add("is-hidden") });
  cal("on", { action: "linkFailed", callback: showFallback });
  cal("inline", {
    elementOrSelector: "#wexpro-cal-embed",
    calLink,
    config: {
      layout: "month_view",
      useSlotsViewOnSmallScreen: "true",
      ...(workflow && allowedWorkflows[workflow] ? { "metadata[workflow]": workflow } : {}),
    },
  });
  cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
})();
