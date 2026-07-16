(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("js");

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
      rail.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: reduceMotion ? "auto" : "smooth" });
    };
    previous.addEventListener("click", () => moveRail(-1));
    next.addEventListener("click", () => moveRail(1));
    rail.addEventListener("scroll", updateRailControls, { passive: true });
    window.addEventListener("resize", updateRailControls, { passive: true });
    updateRailControls();
  }

  const revealNodes = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
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
