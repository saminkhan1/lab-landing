import {
  apiMotif,
  browserMotif,
  connectSpec,
  desktopMotif,
  resultMotif,
  reviewMotif,
  runSpec,
  triggerMotif,
} from "./asteroid-runtime/wexpro-motifs.js";
import { scaleSpec } from "./asteroid-runtime/wexpro-scale-motif.js";

const motifs = {
  "connect-main": connectSpec,
  "run-main": runSpec,
  "scale-main": scaleSpec,
  "connect-browser": { draw: browserMotif, aspect: 1.5, settle: 3 },
  "connect-desktop": { draw: desktopMotif, aspect: 1.5, settle: 3 },
  "connect-api": { draw: apiMotif, aspect: 1.5, settle: 3 },
  "run-trigger": { draw: triggerMotif, aspect: 1.5, settle: 3 },
  "run-result": { draw: resultMotif, aspect: 1.5, settle: 3 },
  "run-review": { draw: reviewMotif, aspect: 1.5, settle: 3 },
};

const reducedMotionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
let reducedMotion = reducedMotionQuery?.matches ?? false;
const reducedData = navigator.connection?.saveData ?? false;
const maxPixelRatio = reducedData ? 1 : 2;
const minimumFrameInterval = reducedData ? 1000 / 30 : 0;
const instances = new Set();

let schedulerFrame = 0;

function hasVisibleAnimation() {
  if (document.hidden || reducedMotion) return false;
  for (const instance of instances) {
    if (instance.visible && !instance.failed) return true;
  }
  return false;
}

function schedule() {
  if (!schedulerFrame && hasVisibleAnimation()) {
    schedulerFrame = requestAnimationFrame(tick);
  }
}

function tick(timestamp) {
  schedulerFrame = 0;
  for (const instance of instances) {
    if (instance.visible && !instance.failed) instance.render(timestamp);
  }
  schedule();
}

function mountMotif(canvas) {
  if (canvas.dataset.motifMounted === "true") return;

  const spec = motifs[canvas.dataset.exactMotif];
  if (!spec) return;

  let context = canvas.getContext("2d");
  if (!context) return;

  const instance = {
    canvas,
    context,
    spec,
    visible: false,
    failed: false,
    dirtySize: true,
    width: 320,
    height: Math.round(320 / spec.aspect),
    ratio: 1,
    elapsed: reducedMotion ? spec.settle + 1 : 0,
    lastTimestamp: null,
    lastDrawTimestamp: -Infinity,
    lastTelemetrySecond: -1,

    resize() {
      const bounds = canvas.getBoundingClientRect();
      const parentWidth = canvas.parentElement?.getBoundingClientRect().width;
      const cssWidth = Math.max(1, bounds.width || parentWidth || 320);
      const cssHeight = Math.max(1, Math.round(cssWidth / spec.aspect));
      const ratio = Math.min(window.devicePixelRatio || 1, maxPixelRatio);
      const pixelWidth = Math.round(cssWidth * ratio);
      const pixelHeight = Math.round(cssHeight * ratio);

      this.width = pixelWidth / ratio;
      this.height = pixelHeight / ratio;
      this.ratio = ratio;
      this.dirtySize = false;

      if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
      if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
      canvas.style.width = `${this.width}px`;
      canvas.style.height = `${this.height}px`;
    },

    draw(time, localTime) {
      if (this.dirtySize || this.ratio !== Math.min(window.devicePixelRatio || 1, maxPixelRatio)) {
        this.resize();
      }

      context.setTransform(this.ratio, 0, 0, this.ratio, 0, 0);
      context.clearRect(0, 0, this.width, this.height);
      spec.draw({
        ctx: context,
        w: this.width,
        h: this.height,
        t: time,
        tl: localTime,
        hover: () => 0,
      });
      canvas.dataset.motifReady = "true";
      canvas.dataset.motifState = reducedMotion ? "static" : "running";
      const telemetrySecond = Math.floor(localTime);
      if (telemetrySecond !== this.lastTelemetrySecond) {
        this.lastTelemetrySecond = telemetrySecond;
        canvas.dataset.motifTime = localTime.toFixed(1);
      }
    },

    render(timestamp) {
      if (timestamp - this.lastDrawTimestamp < minimumFrameInterval) return;

      if (this.lastTimestamp !== null) {
        // Visibility changes reset lastTimestamp, so hidden time never jumps the scene.
        this.elapsed += Math.min((timestamp - this.lastTimestamp) / 1000, 0.1);
      }
      this.lastTimestamp = timestamp;
      this.lastDrawTimestamp = timestamp;

      try {
        this.draw(this.elapsed, this.elapsed);
      } catch (error) {
        this.failed = true;
        canvas.dataset.motifState = "error";
        console.error(`Canvas motif failed: ${canvas.dataset.exactMotif}`, error);
      }
    },

    pause() {
      this.lastTimestamp = null;
      canvas.dataset.motifState = reducedMotion ? "static" : "paused";
    },
  };

  canvas.dataset.motifMounted = "true";
  instances.add(instance);

  instance.resize();
  try {
    instance.draw(instance.elapsed, instance.elapsed);
  } catch (error) {
    instance.failed = true;
    canvas.dataset.motifState = "error";
    console.error(`Canvas motif failed during setup: ${canvas.dataset.exactMotif}`, error);
  }

  const intersection = new IntersectionObserver(
    ([entry]) => {
      instance.visible = Boolean(entry?.isIntersecting);
      instance.lastTimestamp = null;
      if (instance.visible) schedule();
      else instance.pause();
    },
    { threshold: 0.08, rootMargin: "120px 0px 120px 0px" },
  );

  const resizeObserver = new ResizeObserver(() => {
    instance.dirtySize = true;
    if (instance.visible && !reducedMotion) schedule();
    else if (!instance.failed) {
      try {
        instance.draw(instance.elapsed, instance.elapsed);
      } catch (error) {
        instance.failed = true;
        canvas.dataset.motifState = "error";
        console.error(`Canvas motif failed after resize: ${canvas.dataset.exactMotif}`, error);
      }
    }
  });

  canvas.addEventListener("contextlost", (event) => {
    event.preventDefault();
    instance.failed = true;
    instance.pause();
  });

  canvas.addEventListener("contextrestored", () => {
    context = canvas.getContext("2d");
    if (!context) return;
    instance.context = context;
    instance.failed = false;
    instance.dirtySize = true;
    instance.lastTimestamp = null;
    schedule();
  });

  intersection.observe(canvas);
  resizeObserver.observe(canvas.parentElement ?? canvas);
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(schedulerFrame);
    schedulerFrame = 0;
    for (const instance of instances) instance.pause();
  } else {
    for (const instance of instances) instance.lastTimestamp = null;
    schedule();
  }
});

reducedMotionQuery?.addEventListener("change", ({ matches }) => {
  reducedMotion = matches;
  cancelAnimationFrame(schedulerFrame);
  schedulerFrame = 0;

  for (const instance of instances) {
    instance.lastTimestamp = null;
    instance.elapsed = matches ? instance.spec.settle + 1 : 0;
    if (!instance.failed) instance.draw(instance.elapsed, instance.elapsed);
  }

  schedule();
});

document.querySelectorAll("canvas[data-exact-motif]").forEach(mountMotif);
