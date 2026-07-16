/*
 * Direct adaptation of Asteroid's MotifCanvas hero scene.
 * Reused with permission from the owner for the Wexpro Labs surface.
 * The scene architecture, timing, high-DPI handling, and isometric geometry
 * remain intentionally faithful; only the connected-system labels are Wexpro's.
 */
(() => {
  const TAU = Math.PI * 2;
  const lerp = (from, to, amount) => from + ((to - from) * amount);
  const clamp = (value, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));
  const smooth = (value) => { const bounded = clamp(value); return bounded * bounded * (3 - (2 * bounded)); };
  const ink = (alpha = 1) => `rgba(44,44,48,${alpha})`;
  const purple = (alpha = 1) => `rgba(105,47,255,${alpha})`;
  const green = (alpha = 1) => `rgba(23,125,88,${alpha})`;

  const roundRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  };

  const dotGrid = (ctx, width, height, centerX, centerY, options = {}) => {
    const pitch = options.pitch ?? Math.max(20, Math.min(width, height) * .085);
    const radius = options.radius ?? Math.max(width, height) * .52;
    const alpha = options.alpha ?? .26;
    ctx.save();
    ctx.fillStyle = ink(1);
    for (let y = pitch / 2; y < height; y += pitch) for (let x = pitch / 2; x < width; x += pitch) {
      const distance = Math.hypot(x - centerX, y - centerY) / radius;
      if (distance >= 1) continue;
      const opacity = alpha * (1 - distance) * (1 - distance);
      if (opacity < .012) continue;
      ctx.globalAlpha = opacity;
      ctx.fillRect(x - .6, y - .6, 1.2, 1.2);
    }
    ctx.restore();
  };

  const crosshair = (ctx, x, y, radius, alpha = .14) => {
    ctx.save();
    ctx.strokeStyle = ink(alpha);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - radius, y); ctx.lineTo(x + radius, y);
    ctx.moveTo(x, y - radius); ctx.lineTo(x, y + radius);
    ctx.stroke();
    ctx.restore();
  };

  const shadowPoint = (x, y, dx, dy) => [x + dx - dy, y + .5 * (dx + dy)];
  const shadow = (ctx, x, y, width, height, alpha) => {
    if (alpha <= .004) return;
    const sx = x - (width * .1);
    const sy = y + (height * .12);
    for (const [scale, opacity] of [[1.18, .03], [1, .045]]) {
      const points = [
        shadowPoint(sx, sy, -width * .5 * scale, -height * .5 * scale),
        shadowPoint(sx, sy, width * .5 * scale, -height * .5 * scale),
        shadowPoint(sx, sy, width * .5 * scale, height * .5 * scale),
        shadowPoint(sx, sy, -width * .5 * scale, height * .5 * scale),
      ];
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let index = 1; index < points.length; index += 1) ctx.lineTo(points[index][0], points[index][1]);
      ctx.closePath();
      ctx.fillStyle = ink(opacity * alpha);
      ctx.fill();
    }
  };

  const isoSurface = (ctx, x, y, width, height, depth, options = {}) => {
    const alpha = clamp(options.alpha ?? 1);
    const lit = clamp(options.lit ?? 0);
    if (alpha <= .004) return;
    const topLeft = shadowPoint(x, y, -width / 2, -height / 2);
    const topRight = shadowPoint(x, y, width / 2, -height / 2);
    const bottomRight = shadowPoint(x, y, width / 2, height / 2);
    const bottomLeft = shadowPoint(x, y, -width / 2, height / 2);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.lineJoin = "round";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(topLeft[0], topLeft[1]); ctx.lineTo(topRight[0], topRight[1]); ctx.lineTo(bottomRight[0], bottomRight[1]); ctx.lineTo(bottomLeft[0], bottomLeft[1]); ctx.closePath();
    ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = ink(.3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(topRight[0], topRight[1]); ctx.lineTo(bottomRight[0], bottomRight[1]); ctx.lineTo(bottomRight[0], bottomRight[1] + depth); ctx.lineTo(topRight[0], topRight[1] + depth); ctx.closePath();
    ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.fillStyle = ink(.045); ctx.fill(); ctx.strokeStyle = ink(.26); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bottomRight[0], bottomRight[1]); ctx.lineTo(bottomLeft[0], bottomLeft[1]); ctx.lineTo(bottomLeft[0], bottomLeft[1] + depth); ctx.lineTo(bottomRight[0], bottomRight[1] + depth); ctx.closePath();
    ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.fillStyle = ink(.085); ctx.fill(); ctx.strokeStyle = ink(.26); ctx.stroke();
    if (lit > .02) { ctx.strokeStyle = purple(.65 * lit); ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(topRight[0], topRight[1] + depth); ctx.lineTo(bottomRight[0], bottomRight[1] + depth); ctx.lineTo(bottomLeft[0], bottomLeft[1] + depth); ctx.stroke(); }
    ctx.restore();
  };

  const icon = (ctx, kind, x, y, size, alpha = .6) => {
    const unit = size / 24;
    ctx.save(); ctx.translate(x - (size / 2), y - (size / 2)); ctx.scale(unit, unit);
    ctx.strokeStyle = ink(alpha); ctx.fillStyle = ink(alpha); ctx.lineWidth = 1.3 / unit; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.beginPath();
    if (kind === "browser") {
      roundRect(ctx, 2.5, 4, 19, 16, 2.5); ctx.moveTo(2.5, 9); ctx.lineTo(21.5, 9); ctx.stroke(); ctx.beginPath(); ctx.arc(5.5, 6.5, .9, 0, TAU); ctx.fill();
    } else if (kind === "desktop") {
      roundRect(ctx, 3, 3.5, 18, 12.5, 2); ctx.moveTo(12, 16); ctx.lineTo(12, 19.5); ctx.moveTo(8, 20.5); ctx.lineTo(16, 20.5); ctx.stroke();
    } else if (kind === "review") {
      roundRect(ctx, 4.5, 3, 15, 18, 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(7, 13.5); ctx.lineTo(10, 13.5); ctx.lineTo(11.6, 9.5); ctx.lineTo(13.6, 16.5); ctx.lineTo(15.2, 13.5); ctx.lineTo(17, 13.5); ctx.stroke();
    } else if (kind === "api") {
      ctx.moveTo(8.5, 6.5); ctx.lineTo(3.5, 12); ctx.lineTo(8.5, 17.5); ctx.moveTo(15.5, 6.5); ctx.lineTo(20.5, 12); ctx.lineTo(15.5, 17.5); ctx.moveTo(13.4, 4.5); ctx.lineTo(10.6, 19.5); ctx.stroke();
    } else {
      roundRect(ctx, 2.5, 6.5, 19, 12, 2); ctx.moveTo(5.2, 15.3); ctx.lineTo(9, 15.3); ctx.moveTo(10.6, 15.3); ctx.lineTo(14.4, 15.3); ctx.moveTo(16, 15.3); ctx.lineTo(18.8, 15.3); ctx.stroke();
    }
    ctx.restore();
  };

  const screen = (ctx, time, x, y, size, options = {}) => {
    const alpha = clamp(options.alpha ?? 1);
    const rise = smooth(clamp(options.rise ?? 1));
    const active = clamp(options.active ?? 0);
    const status = clamp(options.status ?? 0);
    const seal = clamp(options.seal ?? 0);
    if (alpha <= .004 || rise <= .004) return;
    const height = size * (options.aspect ?? .68);
    const offset = (1 - rise) * size * .18;
    shadow(ctx, x, y, size * 1.05, size * .34, alpha * rise * rise);
    ctx.save(); ctx.globalAlpha = alpha * rise;
    isoSurface(ctx, x, y - (offset * .5), size * 1.02, size * .26, size * .045, { alpha: alpha * rise, lit: active });
    const startX = x - (size / 2); const startY = y - height - (size * .3) - offset; const skew = size * .075;
    const origin = (dx, dy) => [startX + dx, startY + (.5 * dx) + dy];
    const topLeft = origin(0, 0); const topRight = origin(size, 0); const bottomRight = origin(size, height);
    ctx.lineJoin = "round"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(topLeft[0], topLeft[1]); ctx.lineTo(topRight[0], topRight[1]); ctx.lineTo(topRight[0] + skew, topRight[1] - (.5 * skew)); ctx.lineTo(topLeft[0] + skew, topLeft[1] - (.5 * skew)); ctx.closePath(); ctx.fillStyle = ink(.04); ctx.fill(); ctx.strokeStyle = ink(.28); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(topRight[0], topRight[1]); ctx.lineTo(bottomRight[0], bottomRight[1]); ctx.lineTo(bottomRight[0] + skew, bottomRight[1] - (.5 * skew)); ctx.lineTo(topRight[0] + skew, topRight[1] - (.5 * skew)); ctx.closePath(); ctx.fillStyle = ink(.08); ctx.fill(); ctx.stroke();
    const stand = origin(size * .5, height); ctx.beginPath(); ctx.moveTo(stand[0] - (size * .035), stand[1]); ctx.lineTo(stand[0] - (size * .035), stand[1] + (size * .08)); ctx.moveTo(stand[0] + (size * .035), stand[1]); ctx.lineTo(stand[0] + (size * .035), stand[1] + (size * .08)); ctx.strokeStyle = ink(.3); ctx.stroke();
    ctx.transform(1, .5, 0, 1, startX, startY); roundRect(ctx, 0, 0, size, height, Math.min(4, size * .045)); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = ink(.34); ctx.stroke();
    const head = height * .18; ctx.strokeStyle = ink(.1); ctx.beginPath(); ctx.moveTo(1, head); ctx.lineTo(size - 1, head); ctx.stroke();
    let indicator = ink(.16 + (.24 * active));
    if (status > .4) indicator = green(.5 + (.45 * status)); else if (active > .02) indicator = purple(.3 + (.6 * active * (.6 + (.4 * Math.sin(time * 6)))));
    ctx.beginPath(); ctx.arc(size - (size * .08), head / 2, Math.max(1.4, head * .15), 0, TAU); ctx.fillStyle = indicator; ctx.fill();
    icon(ctx, options.kind ?? "browser", size * .5, height * .57, size * .36, .48);
    if (seal > .01) { const radius = size * .05; ctx.beginPath(); ctx.arc(size - (size * .11), height - (height * .15), radius, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = green(.7); ctx.stroke(); ctx.strokeStyle = green(.9); ctx.lineWidth = Math.max(1.2, radius * .3); ctx.beginPath(); ctx.moveTo(size - (size * .11) - (radius * .5), height - (height * .15) + (radius * .05)); ctx.lineTo(size - (size * .11) - (radius * .1), height - (height * .15) + (radius * .42)); ctx.lineTo(size - (size * .11) + (radius * .55), height - (height * .15) - (radius * .38)); ctx.stroke(); }
    ctx.restore();
  };

  const module = (ctx, time, x, y, size, options = {}) => {
    const alpha = clamp(options.alpha ?? 1); const rise = smooth(clamp(options.rise ?? 1)); const active = clamp(options.active ?? 0); const seal = clamp(options.seal ?? 0);
    if (alpha <= .004 || rise <= .004) return;
    const depth = size * .6; const offset = (1 - rise) * size * .25;
    shadow(ctx, x, y, size * 1.15, size * 1.15, alpha * rise * rise); ctx.save(); ctx.globalAlpha = alpha * rise;
    isoSurface(ctx, x, y - depth - offset, size, size, depth, { alpha: 1, lit: active, vent: true });
    const node = shadowPoint(x, y - depth - offset, -size / 2, size / 2); ctx.transform(1, .5, 0, 1, node[0], node[1]);
    icon(ctx, "api", size * .5, depth * .48, size * .42, .5);
    if (seal > .01) { ctx.beginPath(); ctx.arc(size * .84, depth * .78, size * .085, 0, TAU); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = green(.7); ctx.stroke(); }
    ctx.restore();
  };

  const stackMetrics = (size, layers = 5) => {
    const thickness = size * .21; const gap = size * .12; const lid = size * .1; const step = thickness + gap;
    const top = (baseY, index) => baseY - thickness - ((layers - 1 - index) * step);
    return { thickness, gap, lid, top, lidTop: (baseY) => top(baseY, 0) - gap - lid };
  };

  const stack = (ctx, x, y, size, options = {}) => {
    const layers = Math.max(2, options.layers ?? 5); const metrics = stackMetrics(size, layers); const active = options.active ?? -1; const engage = clamp(options.engage ?? 0); const glow = clamp(options.glow ?? 0); const assemble = clamp(options.assemble ?? 1); const yaw = options.yaw ?? false;
    shadow(ctx, x, y + (size * .05), size * 2.05, size * 1.1, assemble * assemble);
    if (assemble > .65) { const opacity = (assemble - .65) * 2.8; ctx.save(); ctx.setLineDash([2, 4]); ctx.strokeStyle = ink(.15 * opacity); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - size, y); ctx.lineTo(x - size, metrics.lidTop(y) + metrics.lid); ctx.moveTo(x + size, y); ctx.lineTo(x + size, metrics.lidTop(y) + metrics.lid); ctx.stroke(); ctx.restore(); }
    const plate = (cx, cy, height, alpha, outline, lit, rotation = 0) => {
      const cos = Math.cos(rotation); const sin = Math.sin(rotation); const point = (px, py) => { const tx = (px * cos) - (py * sin); const ty = (px * sin) + (py * cos); return [cx + ((tx + ty) * size), cy + ((tx - ty) * size * .5)]; };
      const points = [point(-.5,.5), point(.5,.5), point(.5,-.5), point(-.5,-.5)]; ctx.save(); ctx.globalAlpha = alpha; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]); for (let index = 1; index < points.length; index += 1) ctx.lineTo(points[index][0], points[index][1]); ctx.closePath(); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = ink(outline + (.28 * lit)); ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(points[1][0], points[1][1]); ctx.lineTo(points[2][0], points[2][1]); ctx.lineTo(points[2][0], points[2][1] + height); ctx.lineTo(points[1][0], points[1][1] + height); ctx.closePath(); ctx.fillStyle = ink(.045); ctx.fill();
      ctx.beginPath(); ctx.moveTo(points[2][0], points[2][1]); ctx.lineTo(points[3][0], points[3][1]); ctx.lineTo(points[3][0], points[3][1] + height); ctx.lineTo(points[2][0], points[2][1] + height); ctx.closePath(); ctx.fillStyle = ink(.075); ctx.fill();
      if (lit > .02) { ctx.strokeStyle = purple(.55 * lit); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]); for (let index = 1; index < points.length; index += 1) ctx.lineTo(points[index][0], points[index][1]); ctx.closePath(); ctx.stroke(); }
      ctx.restore();
    };
    for (let index = layers - 1; index >= 0; index -= 1) { const reveal = smooth(clamp((assemble - ((layers - 1 - index) * .08)) / .5)); if (reveal <= .004) continue; const current = index === active; const lift = current && !yaw ? engage * metrics.gap * .55 : 0; plate(x, metrics.top(y, index) - lift - ((1 - reveal) * size * .55), metrics.thickness, reveal, .26 + (.1 * (1 - (index / Math.max(1, layers - 1)))), current ? glow : 0, current && yaw ? engage * Math.PI : 0); }
    const lidReveal = smooth(clamp((assemble - (layers * .08)) / .5)); if (lidReveal > .004) plate(x, metrics.lidTop(y) - ((1 - lidReveal) * size * .55), metrics.lid, lidReveal, .4, 0);
  };

  const packet = (ctx, x, y, size, type, options = {}) => {
    const alpha = clamp(options.alpha ?? 1); if (alpha <= .004) return; const scale = options.scale ?? 1; const width = size * .78 * scale; const height = size * scale; const cut = size * .18 * scale; const radius = size * .05 * scale;
    if (options.shadow) shadow(ctx, x, y, width * .9, height * .9, alpha * .8);
    ctx.save(); ctx.globalAlpha = alpha; ctx.transform(1,.5,-1,.5,x,y); const left = -width / 2; const top = -height / 2;
    ctx.beginPath(); ctx.moveTo(left + radius, top); ctx.lineTo(left + width - cut, top); ctx.lineTo(left + width, top + cut); ctx.arcTo(left + width, top + height, left, top + height, radius); ctx.arcTo(left, top + height, left, top, radius); ctx.arcTo(left, top, left + width, top, radius); ctx.closePath(); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = ink(.24); ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(left + width - cut, top); ctx.lineTo(left + width - cut, top + cut); ctx.lineTo(left + width, top + cut); ctx.closePath(); ctx.fillStyle = ink(.05); ctx.fill(); ctx.strokeStyle = ink(.16); ctx.stroke();
    const mark = size * .085 * scale; roundRect(ctx,left + (width*.1),top + (height*.09),mark,mark,mark*.3); ctx.fillStyle = type === "audio" ? "rgba(110,126,116,.85)" : "rgba(105,47,255,.85)"; ctx.fill(); ctx.lineCap = "round"; ctx.strokeStyle = ink(.36); ctx.lineWidth = Math.max(1,size*.03*scale); ctx.beginPath(); ctx.moveTo(left+(width*.16),top+(height*.68)); ctx.lineTo(left+(width*.38),top+(height*.5)); ctx.lineTo(left+(width*.55),top+(height*.58)); ctx.lineTo(left+(width*.82),top+(height*.38)); ctx.stroke(); ctx.restore();
  };

  const label = (ctx, x, y, text, options = {}) => {
    const reveal = clamp(options.reveal ?? 1); if (reveal <= .004) return; const direction = (options.dir ?? "dr") === "dr" ? 1 : -1; const leg = options.leg ?? 26; const land = options.land ?? 14; const size = options.size ?? 10; const alpha = options.alpha ?? .5; const first = smooth(clamp(reveal / .55)); const second = smooth(clamp((reveal - .3) / .45)); const third = clamp((reveal - .55) / .45);
    ctx.save(); ctx.beginPath(); ctx.arc(x,y,1.5,0,TAU); ctx.fillStyle = ink(.6*alpha*first); ctx.fill(); const elbowX = x + (direction * leg * first); const elbowY = y + (.5 * leg * first); ctx.strokeStyle = ink(.5*alpha); ctx.lineWidth = 1; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(elbowX,elbowY); if (second > .01) ctx.lineTo(elbowX+(direction*land*second),elbowY); ctx.stroke();
    if (third > .01) { ctx.font = `500 ${size}px "IBM Plex Mono", monospace`; ctx.fillStyle = ink(alpha*third); const labelWidth = ctx.measureText(text.toUpperCase()).width; const padding = size*.5; const tx = direction > 0 ? elbowX + land + padding : elbowX - land - padding - labelWidth; ctx.textBaseline = "middle"; ctx.fillText(text.toUpperCase(),tx,elbowY); if (options.index) { ctx.fillStyle = ink(.62*alpha*third); ctx.fillText(options.index,tx,elbowY-(size*1.45)); } if (options.sub) { ctx.font = `500 ${size*.82}px "IBM Plex Mono", monospace`; ctx.fillStyle = ink(.55*alpha*third); ctx.fillText(options.sub.toUpperCase(),tx,elbowY+(size*1.4)); } }
    ctx.restore();
  };

  const route = (ctx, pointAt, progress, tail, color = purple, width = 1.6) => {
    const amount = clamp(progress); if (amount <= 0) return; const steps = 14; ctx.save(); ctx.lineCap = "round"; for (let index = 0; index < steps; index += 1) { const end = amount - ((index / steps) * tail); if (end <= 0) break; const start = Math.max(0, amount - (((index + 1) / steps) * tail)); const fade = 1 - (index / steps); const from = pointAt(start); const to = pointAt(end); ctx.strokeStyle = color(.55 * fade * fade); ctx.lineWidth = width * (.45 + (.55 * fade)); ctx.beginPath(); ctx.moveTo(from[0],from[1]); ctx.lineTo(to[0],to[1]); ctx.stroke(); } const point = pointAt(amount); ctx.fillStyle = color(.13); ctx.beginPath(); ctx.arc(point[0],point[1],width*3.2,0,TAU); ctx.fill(); ctx.fillStyle = color(.95); ctx.beginPath(); ctx.arc(point[0],point[1],width*1.05,0,TAU); ctx.fill(); ctx.restore();
  };

  const ring = (ctx,x,y,start,end,progress,color=purple) => { if (progress <= 0 || progress >= 1) return; const eased=smooth(progress); ctx.save(); ctx.beginPath(); ctx.ellipse(x,y,lerp(start,end,eased),lerp(start,end,eased)*.5,0,0,TAU); ctx.strokeStyle=color(.45*(1-eased)); ctx.lineWidth=1; ctx.stroke(); ctx.restore(); };
  const curve = (fromX,fromY,toX,toY,late=false) => { const dx=toX-fromX; const dy=toY-fromY; if ((2*dy)>=dx) { const span=(dx+(2*dy))/2; return [[fromX,fromY],[fromX+span,fromY+(.5*span)],[toX,toY]]; } const primary=(dx-(2*dy))/2; const alternate=(dx+(2*dy))/2; return [[fromX,fromY],late?[fromX+alternate,fromY+(.5*alternate)]:[fromX+primary,fromY-(.5*primary)],[toX,toY]]; };
  const pathAt = (points, amount) => { let total=0; for(let index=1;index<points.length;index+=1) total+=Math.hypot(points[index][0]-points[index-1][0],points[index][1]-points[index-1][1]); let distance=clamp(amount)*total; for(let index=1;index<points.length;index+=1){ const from=points[index-1]; const to=points[index]; const segment=Math.hypot(to[0]-from[0],to[1]-from[1]); if(distance<=segment||index===points.length-1){ const ratio=segment?clamp(distance/segment):1; return [lerp(from[0],to[0],ratio),lerp(from[1],to[1],ratio)]; } distance-=segment; } return points[points.length-1]; };

  const systems = [
    { type:"screen", kind:"browser", x:.80, y:.285, size:.115, alpha:.72, dir:"dl", label:"Inbox", env:"Browser" },
    { type:"module", kind:"api", x:.665, y:.595, size:.08, alpha:.85, dir:"dl", label:"Workflow", env:"Wexpro plan" },
    { type:"screen", kind:"desktop", x:.915, y:.51, size:.15, alpha:.88, aspect:.52, dir:"dl", label:"CRM", env:"Desktop app" },
    { type:"screen", kind:"review", x:.815, y:.78, size:.16, alpha:1, late:true, dir:"dr", leg:.6, label:"Review", env:"Approval" },
    { type:"screen", kind:"browser", x:.60, y:.895, size:.175, alpha:1, dir:"dl", label:"Schedule", env:"Routine run" },
  ];
  const phases={handoff:[0,.04],send:[.04,.105],scan:[.12,.20],railOut:[.26,.345],laneOut:[.345,.46],work:[.47,.61],landFresh:.53,seal:.615,laneBack:[.66,.76],railBack:[.76,.835],home:[.885,.95],absorb:.95,melt:.965};
  const packetTypes=["doc","data","audio","doc"];
  const freshTypes=["doc","audio","data"];
  const progress=(time,start,end)=>clamp((time-start)/(end-start));

  const drawHeroScene = ({ctx,width,height,time,elapsed}) => {
    const smallest=Math.min(width,height); const fade=smooth(progress(elapsed,.1,1.3)); const cycle=((Math.max(0,elapsed-1.6)%13)/13); const iteration=Math.floor(Math.max(0,elapsed-1.6)/13); const melt=1-(cycle>phases.melt?smooth((cycle-phases.melt)/(1-phases.melt)):0); const active=[4,3,1,2,0][iteration%5];
    dotGrid(ctx,width,height,width*.5,height*.52,{radius:Math.max(width,height)*.55,pitch:smallest*.1,alpha:.16}); crosshair(ctx,width*.04,height*.93,smallest*.014,.14*fade); crosshair(ctx,width*.96,height*.93,smallest*.014,.14*fade);
    const coreSize=smallest*.155; const coreX=width*.415; const coreY=height*.63; const metrics=stackMetrics(coreSize,5); const left=[coreX-coreSize,coreY]; const right=[coreX+coreSize,coreY]; const packetSize=smallest*.095; const home=[width*.148,coreY+((left[0]-(width*.148))/2)]; const homeX=home[0]-(packetSize*.9); const homeY=home[1]+(packetSize*.45); const sourceRoutes=systems.map((system)=>curve(right[0],right[1],system.x*width,(system.y*height)+((system.size*smallest)*.16),system.late));
    const send=progress(cycle,...phases.send); const scan=progress(cycle,...phases.scan); const out=progress(cycle,...phases.railOut); const work=progress(cycle,...phases.work); const back=progress(cycle,...phases.laneBack); const railBack=progress(cycle,...phases.railBack); const returnHome=progress(cycle,...phases.home); const engage=clamp(smooth(out)-smooth(railBack)); const layerTop=metrics.top(coreY,active); const layerBottom=layerTop+metrics.thickness; const exit=[coreX+coreSize,layerBottom]; const entry=[coreX-coreSize,layerBottom]; const homeLine=[homeX,homeY];
    const initial=smooth(progress(elapsed,.9,1.5)); if(initial>.01){ ctx.save(); ctx.lineWidth=1; ctx.lineJoin="round"; ctx.strokeStyle=ink(.1*initial); ctx.beginPath(); ctx.moveTo(home[0],home[1]); ctx.lineTo(left[0],left[1]); ctx.stroke(); sourceRoutes.forEach((points,index)=>{ctx.strokeStyle=ink(.07*initial);ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);ctx.lineTo(points[1][0],points[1][1]);ctx.lineTo(points[2][0],points[2][1]);ctx.stroke();const end=points[2];ctx.beginPath();ctx.arc(end[0],end[1],Math.max(1.5,smallest*.004),0,TAU);ctx.strokeStyle=ink(.18*initial);ctx.stroke();if(index===active&&engage>.02){ctx.strokeStyle=purple(.16*engage*initial);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);ctx.lineTo(points[1][0],points[1][1]);ctx.lineTo(points[2][0],points[2][1]);ctx.stroke();ctx.lineWidth=1;}});crosshair(ctx,left[0],left[1],Math.max(2,smallest*.006),.32*initial);crosshair(ctx,right[0],right[1],Math.max(2,smallest*.006),.32*initial);crosshair(ctx,home[0],home[1],Math.max(2,smallest*.005),.28*initial);ctx.restore();}
    if(send>0&&send<1) route(ctx,(amount)=>[lerp(home[0],left[0],amount),lerp(home[1],left[1],amount)],smooth(send),.3,purple,Math.max(1.4,smallest*.0042)); ring(ctx,left[0],left[1],smallest*.018,smallest*.08,(cycle-phases.send[1])/.06); const routeOut=progress(cycle,...phases.laneOut); if(routeOut>0&&routeOut<1) route(ctx,(amount)=>pathAt([exit,...sourceRoutes[active]],amount),smooth(routeOut),.26,purple,Math.max(1.4,smallest*.004)); ring(ctx,right[0],right[1],smallest*.014,smallest*.06,(cycle-phases.railOut[1])/.05); if(back>0&&back<1) route(ctx,(amount)=>pathAt([...sourceRoutes[active].slice().reverse(),exit],amount),smooth(back),.26,green,Math.max(1.4,smallest*.004)); if(returnHome>0&&returnHome<1) route(ctx,(amount)=>pathAt([entry,left,home],amount),smooth(returnHome),.3,green,Math.max(1.4,smallest*.0042)); ring(ctx,homeX,homeY,smallest*.018,smallest*.075,(cycle-phases.absorb)/.07,green);
    const upper=systems.map((_,index)=>index).sort((a,b)=>systems[a].y-systems[b].y).filter((index)=>systems[index].y<=(coreY/height)); const lower=systems.map((_,index)=>index).sort((a,b)=>systems[a].y-systems[b].y).filter((index)=>systems[index].y>(coreY/height)); const drawSystem=(index)=>{const system=systems[index];const reveal=smooth(progress(elapsed,.35+(index*.07),.85+(index*.07)));if(reveal<=.004)return;const selected=index===active;const systemSize=system.size*smallest;const seal=smooth(progress(cycle,phases.seal,.655))*melt;ctx.save();if(system.type==="screen")screen(ctx,time,system.x*width,system.y*height,systemSize,{alpha:system.alpha,rise:reveal,kind:system.kind,aspect:system.aspect,active:selected?work*(1-progress(cycle,phases.seal-.01,phases.seal+.01)):0,status:selected?seal:0,seal:selected?seal:0});else module(ctx,time,system.x*width,system.y*height,systemSize,{alpha:system.alpha,rise:reveal,active:selected?work:0,seal:selected?seal:0});if(reveal>.5){const point=system.type==="module"?[system.x*width+(system.dir==="dr"?systemSize:-systemSize),system.y*height]:system.dir==="dr"?[system.x*width+(systemSize*.64),system.y*height+(systemSize*.235)]:[system.x*width-(systemSize*.64),system.y*height-(systemSize*.145)];label(ctx,point[0],point[1],system.label,{dir:system.dir,index:String(index+1).padStart(2,"0"),sub:system.env,size:Math.max(8,smallest*.026),leg:smallest*.045*(system.leg??1),land:smallest*.026,alpha:.52,reveal:(reveal-.5)*2});}ctx.restore();}; upper.forEach(drawSystem); stack(ctx,coreX,coreY,coreSize,{layers:5,active,engage,yaw:true,glow:engage,assemble:smooth(progress(elapsed,.3,1.4))}); if(scan>0&&scan<1)route(ctx,(amount)=>[coreX-coreSize,lerp(metrics.lidTop(coreY)+metrics.lid,layerBottom,amount)],scan,.3,purple,Math.max(1.4,smallest*.0042)); if(out>0&&out<1){const radians=smooth(out)*Math.PI;const px=coreX+((-0.5*Math.cos(radians)+0.5*Math.sin(radians))+(-.5*Math.sin(radians)-.5*Math.cos(radians)))*coreSize;const py=layerTop+(((-.5*Math.cos(radians)+0.5*Math.sin(radians))-(-.5*Math.sin(radians)-.5*Math.cos(radians)))*coreSize*.5)+metrics.thickness;route(ctx,()=>[px,py],1,.02,purple,Math.max(1.4,smallest*.0042));} lower.forEach(drawSystem);
    const packetReveal=smooth(progress(elapsed,.25,.75)); for(let index=0;index<4;index+=1)packet(ctx,homeX+((index%2?1.5:-1.5)),homeY-(packetSize*.14*index),packetSize,packetTypes[index],{alpha:(.55+(.12*index))*packetReveal,shadow:index===0}); const handoff=progress(cycle,...phases.handoff); if(handoff<1){const amount=smooth(handoff);packet(ctx,lerp(homeX,home[0],amount),lerp(homeY-(packetSize*.56),home[1],amount),packetSize,freshTypes[(iteration+2)%3],{alpha:(handoff>.75?1-((handoff-.75)/.25):1)*packetReveal});} if(cycle>=phases.landFresh){const amount=clamp((cycle-phases.landFresh)/.05);packet(ctx,homeX,homeY-(packetSize*.56)-((1-smooth(amount))*packetSize*.9),packetSize,freshTypes[iteration%3],{alpha:Math.min(1,amount*3)*packetReveal});} label(ctx,homeX,homeY+(packetSize*.5),"Incoming work",{dir:"dr",size:Math.max(8,smallest*.026),leg:smallest*.04,land:smallest*.026,alpha:.52,reveal:(packetReveal-.5)*2});
  };

  const mount = (canvas) => {
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    let width = 0; let height = 0; let frame = 0; let active = false; let firstFrame = null; let lastFrame = null; let lastTime = 0; let lastElapsed = 0;
    const resize = () => { const ratio=Math.min(window.devicePixelRatio||1,3); width=canvas.parentElement?.getBoundingClientRect().width||320; height=Math.round(width/2.1); canvas.width=Math.round(width*ratio); canvas.height=Math.round(height*ratio); canvas.style.width=`${canvas.width/ratio}px`; canvas.style.height=`${canvas.height/ratio}px`; draw(lastTime,lastElapsed); };
    const draw = (time,elapsed) => { lastTime=time;lastElapsed=elapsed;const ratio=Math.min(window.devicePixelRatio||1,3);ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,width,height);drawHeroScene({ctx,width,height,time,elapsed}); };
    const tick = (timestamp) => { if(firstFrame===null)firstFrame=timestamp;const elapsed=reduced?4:(timestamp-firstFrame)/1000;draw(timestamp/1000,elapsed);if(reduced){frame=0;return;}frame=requestAnimationFrame(tick); };
    const start = () => { if(!frame){firstFrame=null;frame=requestAnimationFrame(tick);} };
    const observer=new IntersectionObserver((entries)=>{const entry=entries[0];if(!entry)return;active=entry.isIntersecting;if(active)start();else{cancelAnimationFrame(frame);frame=0;}},{threshold:.35,rootMargin:"0px 0px -12% 0px"});
    const resizeObserver=new ResizeObserver(resize); resizeObserver.observe(canvas.parentElement); resize(); observer.observe(canvas);
  };

  document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll("canvas[data-asteroid-hero]").forEach(mount);},{once:true});
})();
