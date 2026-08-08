(() => {
  const root = document.documentElement;
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  root.classList.add("js");

  const attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];
  const attributionStorageKey = "wexpro_attribution_v1";
  const analyticsSessionKey = "wexpro_analytics_session_v1";
  const readStoredAttribution = () => {
    try {
      return JSON.parse(window.sessionStorage.getItem(attributionStorageKey) || "{}");
    } catch {
      return {};
    }
  };
  const currentParams = new URLSearchParams(window.location.search);
  const storedAttribution = readStoredAttribution();
  const attribution = {};
  attributionKeys.forEach((key) => {
    const value = currentParams.get(key) || (typeof storedAttribution[key] === "string" ? storedAttribution[key] : "");
    if (value) attribution[key] = value.slice(0, 160);
  });
  const storedLandingPath = typeof storedAttribution.landing_path === "string" ? storedAttribution.landing_path : "";
  attribution.landing_path = storedLandingPath.startsWith("/")
    ? storedLandingPath.split(/[?#]/, 1)[0].slice(0, 240)
    : window.location.pathname.slice(0, 240);
  const storedReferrerHost = typeof storedAttribution.referrer_host === "string" ? storedAttribution.referrer_host : "";
  if (storedReferrerHost && /^[a-z0-9.-]+(?::\d+)?$/i.test(storedReferrerHost)) {
    attribution.referrer_host = storedReferrerHost.slice(0, 160);
  } else if (document.referrer) {
    try { attribution.referrer_host = new URL(document.referrer).host.slice(0, 160); } catch { /* ignore malformed referrers */ }
  }
  try { window.sessionStorage.setItem(attributionStorageKey, JSON.stringify(attribution)); } catch { /* storage is optional */ }
  window.wexproAttribution = attribution;

  const readAnalyticsSession = () => {
    try {
      const existing = window.sessionStorage.getItem(analyticsSessionKey);
      if (existing) return existing;
      const created = typeof window.crypto?.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
      window.sessionStorage.setItem(analyticsSessionKey, created);
      return created;
    } catch {
      return "session-storage-unavailable";
    }
  };
  const analyticsSession = readAnalyticsSession();

  const persist = (payload) => {
    const body = JSON.stringify({
      ...payload,
      session_id: analyticsSession,
      attribution,
    });
    window.fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      credentials: "same-origin",
    }).catch(() => { /* measurement must never interrupt the visitor */ });
  };

  try { window.dataLayer = window.dataLayer || []; } catch { /* analytics hooks are optional */ }
  const track = (event, details = {}) => {
    const payload = {
      event,
      page_path: window.location.pathname,
      ...details,
    };
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(payload);
    window.dispatchEvent(new CustomEvent("wexpro:analytics", { detail: payload }));
    if (typeof window.gtag === "function") window.gtag("event", event, details);
    persist(payload);
  };
  window.wexproTrack = track;
  track("page_view", { page_title: document.title });

  document.querySelectorAll("[data-cta]").forEach((link) => {
    const cta = link.dataset.cta || "unknown";
    const destination = new URL(link.href, window.location.href);
    if (destination.pathname === "/demo/") {
      if (!destination.searchParams.has("workflow")) destination.searchParams.set("workflow", "workflow-mapping");
      if (!destination.searchParams.has("cta")) destination.searchParams.set("cta", cta);
      attributionKeys.concat(["landing_path", "referrer_host"]).forEach((key) => {
        if (attribution[key] && !destination.searchParams.has(key)) destination.searchParams.set(key, attribution[key]);
      });
      link.href = `${destination.pathname}${destination.search}`;
    }
    link.addEventListener("click", () => track("cta_click", {
      cta,
      destination: destination.pathname,
      workflow: destination.searchParams.get("workflow") || undefined,
    }));
  });

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  if (menuToggle && mobileMenu) {
    const backgroundTargets = [
      document.querySelector("main"),
      document.querySelector("footer"),
      document.querySelector(".site-header .brand"),
      document.querySelector(".site-nav"),
      document.querySelector(".header-cta"),
    ].filter(Boolean);

    const setMenu = (open, returnFocus = false) => {
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.querySelector(".sr-only").textContent = open ? "Close navigation" : "Open navigation";
      mobileMenu.hidden = !open;
      document.body.classList.toggle("menu-open", open);
      backgroundTargets.forEach((target) => {
        if (open) target.setAttribute("inert", "");
        else target.removeAttribute("inert");
      });

      if (open) {
        window.requestAnimationFrame(() => mobileMenu.querySelector("a")?.focus());
      } else if (returnFocus) {
        menuToggle.focus({ preventScroll: true });
      }
    };

    menuToggle.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
    mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false, true)));
    document.addEventListener("keydown", (event) => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      if (!isOpen) return;

      if (event.key === "Escape") {
        setMenu(false, true);
        return;
      }

      if (event.key === "Tab") {
        const focusable = [menuToggle, ...mobileMenu.querySelectorAll("a, button:not([disabled])")];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    const wideViewport = window.matchMedia("(min-width: 1181px)");
    const handleWideViewport = (event) => {
      if (event.matches) setMenu(false);
    };
    if (wideViewport.addEventListener) wideViewport.addEventListener("change", handleWideViewport);
    else wideViewport.addListener(handleWideViewport);
  }

  const rail = document.querySelector("[data-workflow-rail]");
  const previous = document.querySelector("[data-rail-prev]");
  const next = document.querySelector("[data-rail-next]");
  if (rail && previous && next) {
    const updateRailControls = () => {
      const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth - 1);
      const leadingInset = Number.parseFloat(window.getComputedStyle(rail).paddingLeft) || 0;
      previous.disabled = rail.scrollLeft <= leadingInset + 1;
      next.disabled = rail.scrollLeft >= maxScroll;
    };
    const moveRail = (direction) => {
      const card = rail.querySelector(".workflow-card");
      if (!card) return;
      const styles = window.getComputedStyle(rail);
      const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
      rail.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: reducedMotionQuery.matches ? "auto" : "smooth" });
    };
    previous.addEventListener("click", () => moveRail(-1));
    next.addEventListener("click", () => moveRail(1));
    rail.addEventListener("scroll", updateRailControls, { passive: true });
    window.addEventListener("resize", updateRailControls, { passive: true });
    updateRailControls();
  }

  const revealNodes = document.querySelectorAll("[data-reveal]");
  if (reducedMotionQuery.matches || !("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -12% 0px" });
    revealNodes.forEach((node) => observer.observe(node));
  }
})();
