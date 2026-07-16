const colors = {
  ink: "#242126",
  muted: "#746f76",
  quiet: "#9c969e",
  line: "#cfc8d0",
  faint: "rgba(81, 73, 84, 0.13)",
  paper: "#ffffff",
  violet: "#692fff",
  violetSoft: "#eee9ff",
  green: "#177d58",
  greenSoft: "#eaf7f1",
};

const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const ease = (value) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
const phase = (time, start, duration) => ease((time - start) / duration);

function mono(ctx, value, x, y, size, color = colors.muted, align = "left", alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.font = `500 ${size}px "IBM Plex Mono", "SFMono-Regular", monospace`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(value.toUpperCase(), x, y);
  ctx.restore();
}

function text(ctx, value, x, y, size, color = colors.ink, weight = 550, align = "left", alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px InterVariable, Inter, Arial, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(value, x, y);
  ctx.restore();
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke = null) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function diamond(ctx, cx, cy, width, depth, fill, stroke = colors.line) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - depth / 2);
  ctx.lineTo(cx + width / 2, cy);
  ctx.lineTo(cx, cy + depth / 2);
  ctx.lineTo(cx - width / 2, cy);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function dot(ctx, x, y, radius, fill) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function tick(ctx, x, y, size, color = colors.green) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.2, size * 0.16);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(x - size * 0.35, y);
  ctx.lineTo(x - size * 0.08, y + size * 0.24);
  ctx.lineTo(x + size * 0.42, y - size * 0.3);
  ctx.stroke();
  ctx.restore();
}

function lock(ctx, x, y, size, color = colors.green) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, size * 0.11);
  ctx.beginPath();
  ctx.arc(x, y - size * 0.12, size * 0.24, Math.PI, 0);
  ctx.stroke();
  roundRect(ctx, x - size * 0.34, y - size * 0.02, size * 0.68, size * 0.54, size * 0.08, colors.paper, color);
  dot(ctx, x, y + size * 0.2, Math.max(0.9, size * 0.07), color);
  ctx.restore();
}

function routePoint(from, to, amount, bend = 0) {
  const controlX = (from[0] + to[0]) / 2 + bend;
  const controlY = (from[1] + to[1]) / 2 - Math.abs(to[0] - from[0]) * 0.08;
  const t = clamp(amount);
  const one = 1 - t;
  return [
    one * one * from[0] + 2 * one * t * controlX + t * t * to[0],
    one * one * from[1] + 2 * one * t * controlY + t * t * to[1],
  ];
}

function drawRoute(ctx, from, to, color, alpha, bend = 0, width = 1) {
  const controlX = (from[0] + to[0]) / 2 + bend;
  const controlY = (from[1] + to[1]) / 2 - Math.abs(to[0] - from[0]) * 0.08;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(from[0], from[1]);
  ctx.quadraticCurveTo(controlX, controlY, to[0], to[1]);
  ctx.stroke();
  ctx.restore();
}

function drawEngine(ctx, x, y, scale, reveal, activeLayer) {
  const width = scale * 1.28;
  const depth = scale * 0.56;
  const layerGap = scale * 0.31;
  const layers = ["AUTH", "EXECUTE", "OPTIMIZE"];

  ctx.save();
  ctx.globalAlpha = reveal;
  diamond(ctx, x + scale * 0.07, y + scale * 0.75, width * 1.2, depth * 1.4, "rgba(105,47,255,.035)", null);
  for (let index = 0; index < layers.length; index += 1) {
    const layerY = y - index * layerGap;
    const active = index === activeLayer;
    diamond(ctx, x, layerY, width, depth, active ? colors.violetSoft : colors.paper, active ? colors.violet : colors.line);
    ctx.beginPath();
    ctx.moveTo(x - width / 2, layerY);
    ctx.lineTo(x - width / 2, layerY + scale * 0.16);
    ctx.lineTo(x, layerY + depth / 2 + scale * 0.16);
    ctx.lineTo(x + width / 2, layerY + scale * 0.16);
    ctx.lineTo(x + width / 2, layerY);
    ctx.strokeStyle = active ? colors.violet : colors.line;
    ctx.stroke();
    mono(ctx, layers[index], x, layerY + 1, Math.max(5.4, scale * 0.095), active ? colors.violet : colors.quiet, "center");
  }
  diamond(ctx, x, y - layers.length * layerGap, width, depth, colors.paper, colors.ink);
  text(ctx, "W", x, y - layers.length * layerGap, Math.max(11, scale * 0.22), colors.ink, 700, "center");
  ctx.restore();
}

function drawSession(ctx, node, scale, reveal, state) {
  const { x, y, kind } = node;
  const active = state === "running";
  const complete = state === "complete";
  const stateStroke = active ? colors.violet : complete ? "#8bc7af" : colors.line;
  const width = scale * (kind === "desktop" ? 0.92 : 0.78);
  const height = scale * (kind === "api" ? 0.42 : 0.58);

  ctx.save();
  ctx.globalAlpha = reveal;
  diamond(ctx, x, y + height * 0.55, width * 1.2, height * 0.65, active ? "rgba(105,47,255,.06)" : "rgba(23,125,88,.035)", null);
  if (kind === "api") {
    diamond(ctx, x, y, width, height, active ? colors.violetSoft : complete ? colors.greenSoft : colors.paper, stateStroke);
    mono(ctx, "API", x, y, Math.max(5, scale * 0.09), active ? colors.violet : colors.muted, "center");
  } else {
    ctx.beginPath();
    ctx.moveTo(x - width / 2, y - height / 2);
    ctx.lineTo(x + width / 2, y - height * 0.28);
    ctx.lineTo(x + width / 2, y + height / 2);
    ctx.lineTo(x - width / 2, y + height * 0.28);
    ctx.closePath();
    ctx.fillStyle = active ? colors.violetSoft : complete ? colors.greenSoft : colors.paper;
    ctx.fill();
    ctx.strokeStyle = stateStroke;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - width * 0.37, y - height * 0.24);
    ctx.lineTo(x + width * 0.36, y - height * 0.07);
    ctx.strokeStyle = colors.faint;
    ctx.stroke();
    if (kind === "desktop") {
      ctx.beginPath();
      ctx.moveTo(x, y + height * 0.42);
      ctx.lineTo(x, y + height * 0.68);
      ctx.strokeStyle = colors.quiet;
      ctx.stroke();
      diamond(ctx, x, y + height * 0.72, width * 0.42, height * 0.16, colors.paper, colors.line);
    }
  }
  dot(ctx, x + width * 0.34, y - height * 0.16, Math.max(1.5, scale * 0.028), active ? colors.violet : colors.green);
  if (complete) {
    roundRect(ctx, x + width * 0.2, y + height * 0.24, scale * 0.25, scale * 0.25, scale * 0.125, colors.greenSoft, null);
    tick(ctx, x + width * 0.325, y + height * 0.365, scale * 0.13);
  }
  ctx.restore();
}

const nodeLayout = [
  [0.53, 0.70, "browser"], [0.65, 0.74, "desktop"], [0.79, 0.70, "browser"],
  [0.91, 0.65, "desktop"], [0.55, 0.56, "api"], [0.68, 0.57, "browser"],
  [0.81, 0.52, "api"], [0.93, 0.43, "browser"], [0.66, 0.37, "desktop"],
  [0.82, 0.31, "browser"],
];

function drawScale({ ctx, w, h, tl }) {
  ctx.clearRect(0, 0, w, h);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const compact = w < 500;
  const unit = Math.min(w, h);
  const reveal = phase(tl, 0.08, 0.72);
  const approved = phase(tl, 0.7, 0.55);
  const network = phase(tl, 1.0, 0.8);
  const cycleStart = 1.7;
  const cycleDuration = 5.2;
  const cycle = tl < cycleStart ? 0 : ((tl - cycleStart) % cycleDuration) / cycleDuration;

  ctx.save();
  ctx.globalAlpha = reveal * 0.7;
  ctx.fillStyle = "rgba(74, 65, 78, .055)";
  for (let x = w * 0.04; x < w * 0.98; x += Math.max(19, unit * 0.075)) {
    for (let y = h * 0.13; y < h * 0.86; y += Math.max(15, unit * 0.06)) dot(ctx, x, y, 0.65, ctx.fillStyle);
  }
  ctx.restore();

  mono(ctx, "Authenticated fleet", w * 0.055, h * 0.075, compact ? 6.5 : 8.5, colors.muted, "left", reveal);
  dot(ctx, w * 0.055, h * 0.13, Math.max(2.2, unit * 0.009), colors.green);
  text(ctx, "Sessions warm", w * 0.075, h * 0.13, compact ? 7.5 : 9.5, colors.green, 600, "left", reveal);
  mono(ctx, "1,000s / day", w * 0.95, h * 0.075, compact ? 6.5 : 8.5, colors.muted, "right", reveal);

  const engine = [w * 0.34, h * 0.67];
  const engineScale = unit * 0.235;
  const activeLayer = cycle < 0.2 ? 0 : cycle < 0.72 ? 1 : 2;

  const source = [w * 0.095, h * 0.72];
  ctx.save();
  ctx.globalAlpha = approved;
  diamond(ctx, source[0], source[1], unit * 0.21, unit * 0.105, colors.paper, colors.line);
  roundRect(ctx, source[0] - unit * 0.025, source[1] - unit * 0.055, unit * 0.05, unit * 0.05, unit * 0.025, colors.violetSoft, null);
  tick(ctx, source[0], source[1] - unit * 0.03, unit * 0.024, colors.violet);
  mono(ctx, "Approved", source[0], source[1] + unit * 0.025, Math.max(4.8, unit * 0.02), colors.violet, "center");
  mono(ctx, "Workflow", source[0], source[1] + unit * 0.055, Math.max(4.8, unit * 0.02), colors.muted, "center");
  ctx.restore();

  drawRoute(ctx, source, [engine[0] - engineScale * 0.62, engine[1]], colors.line, network, 0, 1);
  const intake = phase(tl, 0.9, 0.8);
  if (intake > 0 && intake < 1) {
    const point = routePoint(source, [engine[0] - engineScale * 0.62, engine[1]], intake);
    dot(ctx, point[0], point[1], Math.max(2.4, unit * 0.01), colors.violet);
  }

  const nodes = nodeLayout.map(([x, y, kind]) => ({ x: w * x, y: h * y, kind }));
  const anchor = [engine[0] + engineScale * 0.62, engine[1] - engineScale * 0.16];
  nodes.forEach((node, index) => {
    const nodeReveal = phase(tl, 1.05 + index * 0.055, 0.45);
    const offset = index * 0.045;
    const outbound = phase(cycle, 0.04 + offset, 0.19);
    const finished = phase(cycle, 0.36 + offset, 0.11);
    const returning = phase(cycle, 0.53 + offset, 0.2);
    const fastRoute = tl > 6.9 && index % 3 === 1;
    const routeColor = fastRoute ? colors.green : colors.line;
    drawRoute(ctx, anchor, [node.x, node.y], routeColor, network * (fastRoute ? 0.72 : 0.92), (index % 2 ? 1 : -1) * unit * 0.025, fastRoute ? 1.35 : 1.15);
    if (outbound > 0 && outbound < 1) {
      const point = routePoint(anchor, [node.x, node.y], outbound, (index % 2 ? 1 : -1) * unit * 0.025);
      dot(ctx, point[0], point[1], Math.max(2, unit * 0.008), colors.violet);
      dot(ctx, point[0], point[1], Math.max(5, unit * 0.02), "rgba(105,47,255,.08)");
    }
    if (returning > 0 && returning < 1) {
      const point = routePoint([node.x, node.y], anchor, returning, (index % 2 ? -1 : 1) * unit * 0.025);
      dot(ctx, point[0], point[1], Math.max(1.8, unit * 0.007), colors.green);
    }
    const state = finished > 0.92 && returning < 0.98 ? "complete" : outbound > 0.1 && finished < 0.92 ? "running" : "warm";
    drawSession(ctx, node, unit * (compact ? 0.125 : 0.14), nodeReveal, state);
  });

  drawEngine(ctx, engine[0], engine[1], engineScale, reveal, activeLayer);

}

export const scaleSpec = { draw: drawScale, aspect: 1.6, settle: 12.1, linger: 1.8 };
