/* G1 · frames 1–3 (0 → 13.2 s): the opening collage, built as real 3D sets (batch 1; the plates are gone).
   Every board shape is a piece (V.piece): laid out in its hold's view by board px, at a depth that gives the board's
   layering back to front, extruded away from that camera (flat at the holds, chunky sides while the camera moves).
   Measured from the boards (edge maps + colour samples; board px, 1920×1080).
   · 1: starts on the blank purple; the collage flies in out of the depth, staggered; the quarter-disc tiles turn 90° in
     sequence as they land and hold in the board's orientation.
   · 1 → 2 (carry): shapes shared by boards 1 and 2 glide to their board-2 places (the big blue rect, the top slot ring,
     the orange stadium + dark slot + sphere, the orange pill + capsule → the bottom arch, the gold ring, the orange dot);
     the tiles turn another 90° in sequence, shrink back and fade while the four discs grow in behind them; the ∪, dots,
     magenta arch, split disc and lavender piece leave; the top-left ring drops in.
   · 2 → 3 (carry): the right cluster stays (stadium, slot, sphere, dot, lower ring); the left set slides out and
     board 3's new set slides in from the edges (tall orange rect + capsule from the top, the bottom rect from the left,
     the pink right rect from below, the violet pill from the right, the coral-to-blue back wall from the top).
     Board 3's centre is covered by the PTP image card (copy layer): the big rect sits behind it with its pink foot showing.
   · Leaves through the full-screen gradient wipe, left to right (user: it replaces v1's brand-circle burst), cut at 13.2.
   Living gradients flow at full strength throughout; each piece's flow is phase-locked so it passes through its board
   colours at its hold's key instant (the same method as g2.js), and its colour drift is capped at 25 % (g2.js's calm). */
export default V => {
  const { hold, seg, runSegs, curve, wipe, note, bgKey, o, THREE, S, anim, holds } = V;
  const mine = [];
  bgKey(0, '#1c0848', '#2a0a62', '#4a08a8');
  bgKey(7.6, '#1c0848', '#2a0a62', '#4a08a8');
  bgKey(9.3, '#3a0a70', '#3a0880', '#47079b');
  // frontal camera, long lens (flat at the key instants); the marks sit a little apart so the camera re-frames between boards.
  // Drift-throughs (user, 21:50: "never stop … ease into that keyframe and then ease back out"): the camera passes each
  // board's exact framing at its key instant tk without stopping; t0–t1 is the slow window around it (the copy's timing)
  const h1 = hold(1, { pass: true, t: [1.7, 3.5], tk: 2.6, mark: o(0, 0, 0), dir: [0, 0, -1], fov: 26, plate: false });
  const h2 = hold(2, { pass: true, t: [5.7, 7.4], tk: 6.55, mark: o(1.8, 0.4, 1.0), dir: [0.03, 0, -1], fov: 26, plate: false });
  const h3 = hold(3, { pass: true, t: [9.9, 12.1], tk: 11.0, mark: o(3.4, 0.6, 1.4), dir: [0.06, -0.02, -1], fov: 26, plate: false });
  const HK = { 1: h1, 2: h2, 3: h3 };

  /* ---------------- helpers ---------------- */
  const dp = (n, off) => holds[n].depth + off;                     // depth: the sphere's depth at that hold + offset (back = +)
  const fly = (a, dur = 1.25) => ({ type: 'fly', t: [a, a + dur], dz: 16 });
  const PAL = ['#ffa800', '#ff7a00', '#ff4f7b', '#d10cf0', '#7b2bf9', '#4b00ff'];
  const h2v = h => { const n = parseInt(h.slice(1), 16); return new THREE.Vector3((n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255); };
  const palIdx = h => { const c = h2v(h); if (Math.max(c.x, c.y, c.z) < 140 / 255) return -1; let b = 0; PAL.forEach((p, i) => { if (h2v(p).distanceToSquared(c) < h2v(PAL[b]).distanceToSquared(c)) b = i; }); return b; };
  // living-gradient partner of a colour (as the engine picks it: dark colours → deep violet, else a palette neighbour),
  // calmed: pulled toward the colour itself so it drifts at most a × 50 %
  const partner = (h, k, a) => { const c = h2v(h); let p;
    if (Math.max(c.x, c.y, c.z) < 140 / 255) p = h2v('#3a10a8');
    else { let b = 0; PAL.forEach((q, i) => { if (h2v(q).distanceToSquared(c) < h2v(PAL[b]).distanceToSquared(c)) b = i; }); const j = b + (k % 2 ? 1 : -1); p = h2v(PAL[j < 0 || j >= PAL.length ? b : j]); }
    return c.clone().lerp(p, a); };
  // flat at the hold (g2.js's method): the back face is pushed out along that hold camera's view rays, so the side walls are
  // edge-on (invisible) from it and open up as soon as the camera moves. Pose: the hold, anchor px, depth, scale, rotation.
  const flatGeo = (g, n, at, d, s = 1, rot = 0) => { const p = g.attributes.position; g.computeBoundingBox(); const zb = g.boundingBox.min.z; if (zb > -1e-6) return;
    const t = -zb * d * holds[n].tanV / 540 * s, c = Math.cos(rot * Math.PI / 180), sn = Math.sin(rot * Math.PI / 180), Ax = at[0] - 960, Ay = 540 - at[1];
    for (let i = 0; i < p.count; i++) if (p.getZ(i) < zb / 2) { const x = p.getX(i), y = p.getY(i);
      const ex = ((c * x - sn * y) * s + Ax) * t / d / s, ey = ((sn * x + c * y) * s + Ay) * t / d / s;
      p.setXY(i, x + c * ex + sn * ey, y - sn * ex + c * ey); }
    p.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingBox(); };
  // every G1 piece: calmed partners (spec.calm, default 0.5 as g2.js) and flat at one pose (spec.flat: undefined = its own
  // hold, i = its i-th carry pose, false = none); shared geometry is cloned first
  const piece = spec => {
    const pc = V.piece(spec), u = pc.mesh.material.uniforms, a = spec.calm ?? 0.5;
    ['0', '1', '2'].forEach(k => u['p' + k].value.lerp(u['c' + k].value, 1 - a));
    pc.calmA = a;
    if (spec.flat !== false && (spec.thick ?? 0.4) > 0.06) {
      const P = spec.flat ? { hold: spec.carry[spec.flat - 1].hold, at: spec.carry[spec.flat - 1].at || spec.at, depth: spec.carry[spec.flat - 1].depth ?? spec.depth, s: spec.carry[spec.flat - 1].s ?? spec.s ?? 1, rot: spec.carry[spec.flat - 1].rot ?? spec.rot ?? 0 }
        : { hold: spec.hold, at: spec.at || [960, 540], depth: spec.depth, s: spec.s ?? 1, rot: spec.rot ?? 0 };
      if (spec.shapeKey) pc.mesh.geometry = pc.mesh.geometry.clone();
      flatGeo(pc.mesh.geometry, P.hold, P.at, P.depth, P.s, P.rot);
    }
    mine.push(pc); return pc; };
  // quarter disc with its right-angle corner at (cx, cy) (local px, y up), filling quadrant q from that corner
  const qCell = (r, cx, cy, q) => { const a0 = { tr: 0, tl: Math.PI / 2, bl: Math.PI, br: 1.5 * Math.PI }[q]; const s = new THREE.Shape();
    s.moveTo(cx, cy); s.lineTo(cx + r * Math.cos(a0), cy + r * Math.sin(a0)); s.absarc(cx, cy, r, a0, a0 + Math.PI / 2, false); s.lineTo(cx, cy); return s; };
  // three-quarter disc: the top-right quadrant is missing (board 1's orange disc with the lavender piece in that quadrant)
  const threeQ = r => { const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(0, r); s.absarc(0, 0, r, Math.PI / 2, 2 * Math.PI, false); s.lineTo(0, 0); return s; };
  // rounded rect with a (possibly off-centre) rounded-rect hole. The hole's points are de-duplicated first: a rounded rect
  // whose radius is half its height has zero-length sides, and the repeated points make the triangulation cut a chamfer
  // into the hole (seen on the gold ring's slot; the engine's S.stadiumRing / S.rrRing leave small slivers the same way)
  // rounded rect with its own left and right corner radii (board 1's gold ring: a round left end, tighter right corners)
  const rrLR = (w, h, rl, rr) => { const s = new THREE.Shape(), x = -w / 2, y = -h / 2, H = Math.PI / 2;
    s.moveTo(x + rl, y); s.lineTo(x + w - rr, y); s.absarc(x + w - rr, y + rr, rr, -H, 0); s.lineTo(x + w, y + h - rr); s.absarc(x + w - rr, y + h - rr, rr, 0, H);
    s.lineTo(x + rl, y + h); s.absarc(x + rl, y + h - rl, rl, H, 2 * H); s.lineTo(x, y + rl); s.absarc(x + rl, y + rl, rl, 2 * H, 3 * H); return s; };
  // rect with rounded top corners (tl, tr radii) — board 3's pink rect
  const topRounded = (w, h, rtl, rtr) => { const s = new THREE.Shape(), x0 = -w / 2, x1 = w / 2, y0 = -h / 2, y1 = h / 2, H = Math.PI / 2;
    s.moveTo(x0, y0); s.lineTo(x1, y0); s.lineTo(x1, y1 - rtr); s.absarc(x1 - rtr, y1 - rtr, rtr, 0, H); s.lineTo(x0 + rtl, y1); s.absarc(x0 + rtl, y1 - rtl, rtl, H, 2 * H); s.lineTo(x0, y0); return s; };
  const ringOff = (ow, oh, orad, iw, ih, irad, dx, dy, outer) => { const s = outer || V.rr(ow, oh, orad), i = V.rr(iw, ih, irad), p = new THREE.Path();
    const pts = i.getPoints(64).map(v => new THREE.Vector2(v.x + dx, v.y + dy)).filter((v, k, a) => k === 0 || v.distanceTo(a[k - 1]) > 1e-6);
    if (pts.length > 1 && pts[0].distanceTo(pts.at(-1)) < 1e-6) pts.pop();
    p.setFromPoints(pts.reverse()); s.holes.push(p); return s; };
  // recolour a piece over time: the gradient's three colours (and their calmed living-gradient partners and palette slots),
  // optionally its span along its axis (lo / hi, local px); stages [[t0, t1, cols, { lo, hi, axis, ease }], …]
  // a gradient given in board px at a carried pose (anchor at, scale s) → the piece's local axis and span, for recolor
  const bgrad = (from, to, at, s = 1) => { const L = ([x, y]) => [(x - at[0]) / s, (at[1] - y) / s], A = L(from), B = L(to), d = Math.hypot(B[0] - A[0], B[1] - A[1]), ax = [(B[0] - A[0]) / d, (B[1] - A[1]) / d];
    return { axis: ax, lo: A[0] * ax[0] + A[1] * ax[1], hi: B[0] * ax[0] + B[1] * ax[1] }; };
  const NM = ['c0', 'c1', 'c2', 'p0', 'p1', 'p2'];
  const recolor = (pc, stages) => {
    const u = pc.mesh.material.uniforms; let prev = { c: NM.map(k => u[k].value.clone()), lo: u.lo.value, hi: u.hi.value, ax: u.axis.value.clone(), bi: u.bi.value.clone() };
    const st = stages.map(([a, b, cols, o = {}]) => { const c = cols.length === 1 ? [cols[0], cols[0], cols[0]] : cols.length === 2 ? [cols[0], cols[0], cols[1]] : cols;
      const to = { c: [...c.map(h2v), ...c.map((h, i) => partner(h, i + 1, pc.calmA))], lo: o.lo ?? prev.lo, hi: o.hi ?? prev.hi,
        ax: o.axis ? new THREE.Vector3(...o.axis, 0).normalize() : prev.ax, bi: new THREE.Vector3(...c.map(palIdx)) };
      const s = { a, b, from: prev, to, E: gsap.parseEase(o.ease || 'power2.inOut') }; prev = to; return s; });
    anim(t => { let c = st[0].from.c, lo = st[0].from.lo, hi = st[0].from.hi, ax = st[0].from.ax, bi = st[0].from.bi;
      for (const s of st) { if (t <= s.a) break; const k = s.E(Math.min(1, (t - s.a) / (s.b - s.a)));
        c = s.from.c.map((v, i) => v.clone().lerp(s.to.c[i], k)); lo = s.from.lo + (s.to.lo - s.from.lo) * k; hi = s.from.hi + (s.to.hi - s.from.hi) * k;
        ax = s.from.ax.clone().lerp(s.to.ax, k).normalize(); bi = k < 0.5 ? s.from.bi : s.to.bi; }
      NM.forEach((n, i) => u[n].value.copy(c[i])); u.lo.value = lo; u.hi.value = hi; u.axis.value.copy(ax); u.bi.value.copy(bi); });
  };

  /* ---------------- the back wall (boards 1–2: dark indigo, rising to violet only toward the top-right) ----------------
     Fitted to both boards along a steep axis (board px, up-right): #25085a over most of the frame (between the pill and the
     gold ring, the ring's slot, board 2's field right of the tall rect), #39087e at (1920, 360), #5105ad near (1800, 60). */
  piece({ name: 'back', hold: 1, shape: V.rr(4600, 3000, 0), at: [960, 540], depth: dp(1, 20), thick: 0.05, drift: 0, calm: 0.3,
    grad: { cols: ['#1e0c52', '#26085c', '#5507b0'], from: [-153, 423], to: [221, -611] },
    carry: [{ hold: 2, at: [960, 540], depth: dp(2, 20), t: [3.5, 5.7] }, { hold: 3, at: [960, 540], depth: dp(3, 20), t: [7.4, 9.9] }] });

  /* ---------------- board 1 ---------------- */
  // the big blue rect (x 500–1101, top 68, top-left r 255): blue at the top-right → violet → orange at the lower-left (a diagonal
  // gradient, least-squares fitted to the board's visible parts: mean error ≈ 10). Board 2: the tall centre rect
  // (x 654–1423, top ≈ −129; its gradient held blue to y ≈ 440 and tilted, pinker at the left). Board 3: behind the PTP card, x 780–1400, only its pink foot shows below the card.
  const big = piece({ name: 'bigBlue', hold: 1, shape: S.cornerRect(601, 1400, 255, 'tl'), at: [800.5, 768], depth: dp(1, 9.0), in: fly(0.05), flat: 1,
    grad: { cols: ['#5f00fe', '#8e34e1', '#f57120'], from: [993, 513], to: [697, 799] },
    carry: [{ hold: 2, at: [1038.5, 766.7], depth: dp(2, 9.0), s: 1.2795, t: [3.6, 5.4] },
      { hold: 3, at: [1090, 1052], depth: dp(3, 9.0), s: 1.0316, t: [7.6, 9.5] }] });
  recolor(big, [[3.9, 5.4, ['#5002ff', '#7201eb', '#f87809'], bgrad([1172, 106], [749, 973], [1038.5, 766.7], 1.2795)],   // board 2 (fitted: mean error ≈ 12)
    [8.0, 9.4, ['#e44594', '#e85aa2', '#ff7190'], bgrad([878, 631], [546, 999], [1090, 1052], 1.0316)]]);   // board 3's pink foot below the card (fitted, ≈ 8)
  // the top slot ring (x 900–1380, y 68–320, band 86): blue at its left (merging into the big rect) → magenta right
  const topRing = piece({ name: 'topRing', hold: 1, shape: ringOff(480, 252, 126, 308, 80, 40, 0, 0), at: [1140, 194], depth: dp(1, 8.4), in: fly(0.15), flat: 1,
    grad: { cols: ['#5a0fff', '#9212f4', '#d10cfc'], from: [930, 194], to: [1328, 194] },
    carry: [{ hold: 2, at: [1069, 96], depth: dp(2, 8.4), s: 1.25, t: [3.7, 5.45] }],
    out: { type: 'slide', from: 'top', t: [7.5, 8.3] } });
  recolor(topRing, [[3.7, 5.45, ['#620bfd', '#9b13ff', '#cf0bfe'], bgrad([890, 96], [1254, 96], [1069, 96], 1.25)]]);   // board 2 (fitted, ≈ 4)
  // the orange stadium (left end centre (1362, 391), r 231; top 160): orange → pink, dark below the slot; translucent
  // (its gradient refitted on each board: orange top → magenta → dark underside; board 3's reads violet-magenta at the left end)
  const stad = piece({ name: 'stadium', hold: 1, shape: S.pill(920, 462), at: [1591, 391], depth: dp(1, 7.8), in: fly(0.2), op: 0.92, order: 1, thick: 0.25, flat: 1,
    grad: { cols: ['#ff7f38', '#99276f', '#11005a'], from: [948, 199], to: [965, 695] },
    carry: [{ hold: 2, at: [1839, 340], depth: dp(2, 7.8), s: 1.35, t: [3.65, 5.4] },
      { hold: 3, at: [1835.5, 320], depth: dp(3, 7.8), s: 1.264, t: [7.55, 9.45] }] });
  recolor(stad, [[3.65, 5.4, ['#ff8b19', '#ab2b96', '#2c0859'], bgrad([960, 25], [960, 617], [1839, 340], 1.35)],
    [7.55, 9.45, ['#fd8829', '#cf5750', '#992d93'], bgrad([960, 40], [960, 320], [1835.5, 320], 1.264)]]);
  // the orange pill (x 818–1240, y 293–1095) and its capsule (x 957–1101, y 440–952): board 2's bottom arch and its pink inner
  const pill = piece({ name: 'pill', hold: 1, shape: V.rr(422, 802, 211), at: [1029, 694], depth: dp(1, 7.2), in: fly(0.12), flat: 1,
    grad: { cols: ['#db6540', '#4b04b8', '#2c0869'], from: [1000, 342], to: [1000, 1018] },   // fitted, ≈ 7
    carry: [{ hold: 2, at: [1329.5, 1243.8], depth: dp(2, 7.2), s: 1.254, t: [3.75, 5.5] }],
    out: { type: 'slide', from: 'bottom', t: [7.5, 8.4] } });
  recolor(pill, [[3.75, 5.5, ['#fb7f17', '#c0564d', '#872e82'], bgrad([960, 710], [960, 1050], [1329.5, 1243.8], 1.254)]]);   // board 2's bottom arch (fitted, ≈ 2)
  const caps = piece({ name: 'capsule', hold: 1, shape: V.rr(144, 512, 72), at: [1029, 696], depth: dp(1, 6.8), in: fly(0.3), flat: 1,
    grad: { cols: ['#5a0cfa', '#9a2de0', '#e044a0'], from: [1029, 460], to: [1029, 940] },
    carry: [{ hold: 2, at: [1329.5, 1233.2], depth: dp(2, 6.8), s: 1.243, t: [3.8, 5.5] }],
    out: { type: 'slide', from: 'bottom', t: [7.52, 8.4] } });
  recolor(caps, [[4.2, 5.4, ['#ff6a4d', '#e94d90', '#ba29c6'], bgrad([840, 1104], [911, 771], [1329.5, 1233.2], 1.243)]]);   // the arch's pink inner (fitted, ≈ 3)
  // the quarter-disc tiles: column A (x 0–340) right angle at the cell's top-right, column B (x 340–700) at its
  // bottom-left; r 360. They land turning 90° in sequence and hold in the board's orientation; in 1 → 2 they turn on
  // another 90° in sequence, shrink back a little and fade while the discs grow in behind them. Each tile has its own
  // depth (6.0 … 6.4) so neighbours never share a plane when they overlap mid-turn.
  // (tile gradients least-squares fitted to the board: mean error 2–14 per tile)
  const TILES = [
    { cell: [170, 180], sh: qCell(362, 170, 180, 'bl'), grad: { cols: ['#f97d15', '#7a2cf3', '#3100ff'], from: [1, 301], to: [319, 380] } },
    { cell: [520, 180], sh: qCell(360, -180, -180, 'tr'), grad: { cols: ['#fb7906', '#832ef5', '#2e03ff'], from: [423, 57], to: [748, 349] } },
    { cell: [170, 540], sh: qCell(362, 170, 180, 'bl'), grad: { cols: ['#ea7123', '#f15c27', '#fe3e35'], from: [80, 540], to: [336, 540] } },
    { cell: [520, 540], sh: qCell(360, -180, -180, 'tr'), grad: { cols: ['#fd9901', '#b9485d', '#6d20b2'], from: [537, 210], to: [739, 367] } },
    { cell: [170, 900], sh: qCell(362, 170, 180, 'bl'), grad: { cols: ['#f97d15', '#7a2cf3', '#3200ff'], from: [170, 343], to: [488, 422] } },
    { cell: [520, 900], sh: qCell(360, -180, -180, 'tr'), grad: { cols: ['#e97121', '#f06026', '#fd4134'], from: [418, 540], to: [686, 540] } },
  ];
  const tileKeys = i => ({ r: [[0.35 + 0.1 * i, 90], [1.05 + 0.1 * i, 0, 'power2.inOut'], [3.55 + 0.08 * i, 0], [4.15 + 0.08 * i, -90, 'power2.inOut']],
    z: [[4.0 + 0.08 * i, 0], [4.55 + 0.08 * i, 2.0, 'power2.in']], s: [[4.05 + 0.08 * i, 1], [4.55 + 0.08 * i, 0.6, 'power2.in']] });
  const tileOut = i => ({ type: 'fade', t: [4.1 + 0.08 * i, 4.55 + 0.08 * i], ease: 'power1.in' });
  TILES.forEach((T, i) => piece({ name: 'tile' + i, hold: 1, shape: T.sh, shapeKey: i % 2 ? 'tileB' : 'tileA', at: T.cell, depth: dp(1, 6.0 + 0.08 * i), grad: T.grad, drift: 2 * (i % 2), thick: 0.25,
    in: fly(0.02 + 0.07 * i), out: tileOut(i), keys: tileKeys(i) }));
  // column A's notches (the corner of each cell outside its quarter disc): dark maroon (row 1), dark indigo (row 2),
  // violet (row 3). Each is its tile's whole cell behind the tile: it flies in with the tile but doesn't turn (the tile
  // turns on it), and fades out while the tile turns away in 1 → 2, before the tile itself fades (no ghost squares)
  [[0, '#2c144a', '#2b134c', [20, 250], [20, 360]], [2, '#1e1560', '#2c1278', [20, 620], [20, 715]], [4, '#7008e8', '#7a03f8', [0, 1080], [335, 725]]]
    .forEach(([i, a, b, f, t], k) => piece({ name: 'notch' + i, hold: 1, shape: V.rr(340, 360, 0), shapeKey: 'cell', at: TILES[i].cell, depth: dp(1, 6.6 + 0.06 * k), drift: 0, thick: 0.2,
      grad: { cols: [a, b], from: f, to: t }, in: fly(0.02 + 0.07 * i), out: { type: 'fade', t: [3.65 + 0.08 * i, 4.0 + 0.08 * i], ease: 'power1.in' } }));
  // translucent violet cell over tile 2b (x 490–705, y 358–720)
  piece({ name: 'violetCell', hold: 1, shape: V.rr(215, 362, 2), at: [597.5, 539], depth: dp(1, 5.7), in: fly(0.45), op: 0.5, order: 2, thick: 0.1,
    grad: { cols: ['#b040c0', '#9030d0', '#7020e0'], from: [490, 539], to: [705, 539] }, out: { type: 'fade', t: [3.55, 3.95], ease: 'power1.in' } });
  // magenta ∩ arch (outer r 210 centred (1705, 715), inner r 72), legs to the bottom
  piece({ name: 'magArch', hold: 1, shape: S.arch(420, 595, 138), at: [1705, 1100], depth: dp(1, 5.2), in: fly(0.25),
    grad: { cols: ['#d81ee0', '#8a14d0', '#4a14a0'], from: [1705, 505], to: [1705, 1000] }, out: { type: 'slide', from: 'bottom', t: [3.7, 4.6] } });
  // gold ring (outer x 1198–1690, y 712–1033, a round left end and r ≈ 100 right corners (its top edge reaches (1668, 740));
  // slot x 1240–1600, y 818–928): dark at its left end → brown → gold; translucent,
  // over the magenta arch. Board 2: the lower-right ring (slot x 1586–1920, y 853–989), BEHIND the bottom arch (its left end
  // hides at the arch's edge). Board 3: faint over the pink rect, in front again: invisible at its left end, lifting the
  // violet to mauve toward the right (the board shows it as a soft band).
  const gold = piece({ name: 'goldRing', hold: 1, shape: ringOff(492, 321, 0, 360, 110, 55, -24, -0.5, rrLR(492, 321, 158, 100)), at: [1444, 872.5], depth: dp(1, 4.6), in: fly(0.4), op: 0.8, thick: 0.05, flat: 2,
    grad: { cols: ['#2a0c5a', '#9a6438', '#f4b820'], from: [1200, 870], to: [1690, 870] },
    carry: [{ hold: 2, at: [1838.2, 920.4], depth: dp(2, 7.6), s: 1.236, t: [3.8, 5.5] }, { hold: 3, at: [1838.2, 920.4], depth: dp(3, 4.6), s: 1.236, t: [7.65, 9.5] }],
    // 2 → 3: it has to go from behind the arch to in front of the pink rect, whose plane it crosses at ≈ 8.45 s (camera-space
    // depths 41.7 → 38.0 against the pink rect's 40.8), so it dims through the crossing and settles at 0.5 for board 3
    // (1 → 2 likewise: it passes behind the pill / arch at ≈ 4.9 s, where their edges overlap, so a short dim there too)
    keys: { op: [[4.55, 1], [4.85, 0.55, 'power1.inOut'], [5.2, 1, 'power1.inOut'], [7.7, 1], [8.05, 0.3, 'power1.inOut'], [8.55, 0.3], [9.3, 0.5, 'power2.inOut']] } });
  recolor(gold, [[7.8, 9.3, ['#dc7088', '#b088b8', '#d8ae20'], { hi: 66 }]]);   // hold 3: its gradient ends at x 1920 (local 66)
  // dark slot (x 1290–1892, y 317–482) that holds the sphere
  // (dark indigo, lifting to violet toward its right end: fitted on each board, mean error ≈ 2)
  const slot = piece({ name: 'slot', hold: 1, shape: S.pill(602, 165), at: [1591.5, 399.5], depth: dp(1, 4.2), in: fly(0.3), flat: 1,
    grad: { cols: ['#27085d', '#30086e', '#3c0785'], from: [1154, 252], to: [1331, -10] },
    carry: [{ hold: 2, at: [1792.8, 330.5], depth: dp(2, 4.2), s: 1.23, t: [3.7, 5.4] }, { hold: 3, at: [1825.8, 330.5], depth: dp(3, 4.2), s: 1.23, t: [7.6, 9.5] }] });
  recolor(slot, [[3.7, 5.4, ['#20084e', '#320771', '#4d05a5'], bgrad([1163, 315], [1591, -161], [1792.8, 330.5], 1.23)],
    [7.6, 9.5, ['#2a0863', '#3b0784', '#5304af'], bgrad([1255, 162], [1539, -201], [1825.8, 330.5], 1.23)]]);
  // orange split disc (centre (1742, 915), r 175 (edges measured on the board), its top-right quadrant missing) and the lavender quarter disc in that quadrant
  piece({ name: 'splitDisc', hold: 1, shape: threeQ(175), at: [1742, 915], depth: dp(1, 3.8), in: fly(0.35),
    grad: { cols: ['#ea6f21', '#f25a28', '#fb4332'], from: [1572, 915], to: [1912, 915] }, out: { type: 'slide', from: 'right', t: [3.75, 4.6] } });
  piece({ name: 'lavender', hold: 1, shape: S.qdisc(170, 'bl'), at: [1912, 745], depth: dp(1, 3.4), in: fly(0.5),
    grad: { cols: ['#a974ff', '#a974ff', '#b07cff'], from: [1742, 745], to: [1912, 915] }, out: { type: 'slide', from: 'right', t: [3.7, 4.5] } });
  // orange-to-pink ∪ in front of the slot (outer x 1403–1750, bottom 432; inner gap x 1517–1636). It is an ∩ turned 180°,
  // so its gradient points are mirrored through the anchor (orange lower-left → violet top right)
  piece({ name: 'U', hold: 1, shape: S.arch(347, 492, 114), rot: 180, at: [1576.5, -60], depth: dp(1, 3.0), in: fly(0.28),
    grad: { cols: ['#840be6', '#e95181', '#f87f10'], from: [1306, -301], to: [1665, -447] }, out: { type: 'slide', from: 'top', t: [3.6, 4.4] } });   // fitted (board (1847, 181) violet → (1488, 327) orange), mirrored
  piece({ name: 'peach', hold: 1, shape: S.disc(50), at: [1722, 155], depth: dp(1, 2.6), in: fly(0.45), thick: 0.08,
    grad: { cols: ['#fcc682', '#f9bf79', '#f4b070'], from: [1690, 120], to: [1760, 190] }, out: { type: 'slide', from: 'top', t: [3.65, 4.4] } });
  // small orange dot (1400, 705) d 60 → board 2–3's dot at (1792, 711) d 78; thin, so it reads flat (no coin edge)
  piece({ name: 'dot', hold: 1, shape: S.disc(30), at: [1400, 705], depth: dp(1, 2.6), in: fly(0.5), thick: 0.08, flat: 1,
    grad: { cols: ['#ff7a1a', '#f25a28', '#e8402e'], from: [1375, 680], to: [1425, 730] },
    carry: [{ hold: 2, at: [1793, 711], depth: dp(2, 2.6), s: 1.27, t: [3.85, 5.5] }, { hold: 3, at: [1792, 711], depth: dp(3, 2.6), s: 1.3, t: [7.7, 9.5] }] });

  /* ---------------- board 2 (new) ---------------- */
  // top-left ring (slot x 25–639, left-end centre (110, 27), r 85; outer bottom 273, straight to the tall rect): orange at the left → dark maroon
  piece({ name: 'tlRing', hold: 2, shape: ringOff(1082, 492, 246, 614, 170, 85, -73, 0), at: [405, 27], depth: dp(2, 9.6),
    grad: { cols: ['#e0662e', '#9a394d', '#4a165c'], from: [20, 200], to: [650, 200] },
    in: { type: 'slide', from: 'top', t: [4.3, 5.5] }, out: { type: 'slide', from: 'top', t: [7.42, 8.1] } });
  // the dark maroon inside the top-left ring's slot (maroon at the left → indigo at the right; fitted, mean error ≈ 2):
  // the ring's own outline inset 8 px, behind it, so it slides with the ring and shows only through the slot
  piece({ name: 'tlSlotFill', hold: 2, shape: V.rr(1066, 476, 238), at: [405, 27], depth: dp(2, 9.9), drift: 0, thick: 0.2,
    grad: { cols: ['#5f2132', '#2b104c', '#1c056b'], from: [168, -225], to: [654, 245] },
    in: { type: 'slide', from: 'top', t: [4.3, 5.5] }, out: { type: 'slide', from: 'top', t: [7.42, 8.1] } });
  // the dark violet gap between the four discs (#201460 at the top → #440c9f at the bottom; fitted, mean error ≈ 3). The gap
  // runs from y ≈ 522 to 840 at x 280 and x 170–392 at y 674; this rect (x 150–410, y 500–850) has every edge under a disc.
  // It fades in once the discs are ~90 % grown and out before they slide away, so its edges never show
  piece({ name: 'gap2', hold: 2, shape: V.rr(260, 350, 0), at: [280, 675], depth: dp(2, 11.0), thick: 0.2, drift: 0,
    grad: { cols: ['#201460', '#30107d', '#440c9f'], from: [280, 614], to: [280, 738] },
    in: { type: 'fade', t: [5.0, 5.6] }, out: { type: 'fade', t: [7.5, 7.8] } });
  // four discs r 211 (A over C, D over B; B and D run behind the tall rect); four distinct depths (B, C and D refitted)
  [[72, 487, 10.1, { cols: ['#b84566', '#bb5c74', '#c46a80'], from: [72, 276], to: [72, 698] }, 0.86],
   [490, 488, 10.6, { cols: ['#f77609', '#9f41bd', '#5918ff'], from: [894, 231], to: [953, 505] }, 1],
   [70, 860, 10.7, { cols: ['#3505ff', '#7e2ef1', '#f57815'], from: [933, 734], to: [875, 1142] }, 1],
   [490, 859, 10.2, { cols: ['#ea7020', '#f15f26', '#fa4435'], from: [490, 752], to: [490, 1044] }, 1]]
    .forEach(([x, y, d, g, op], j) => piece({ name: 'disc' + j, hold: 2, shape: S.disc(211), shapeKey: 'disc211', at: [x, y], depth: dp(2, d), grad: g, op,
      in: { type: 'grow', t: [4.25 + 0.12 * j, 5.35 + 0.12 * j] }, out: { type: 'slide', from: 'left', t: [7.42 + 0.05 * j, 8.05 + 0.05 * j] } }));
  // (disc A is translucent but keeps the normal back-to-front order, so the fading tiles in front of it stay in front)

  // violet floor behind discs C and D (shows between them below their tangent and at the bottom-right corner):
  // #7a03fb, darker toward the tall rect (fitted: mean error ≈ 4); fades in and out like the gap above
  piece({ name: 'floor2', hold: 2, shape: V.rr(560, 250, 0), at: [380, 990], depth: dp(2, 11.3), thick: 0.2,
    grad: { cols: ['#7503ef', '#7a03fb', '#4b06a3'], from: [66, 1143], to: [475, 823] },
    in: { type: 'fade', t: [5.0, 5.6] }, out: { type: 'fade', t: [7.5, 7.85] } });

  /* ---------------- board 3 (new: slides in from the edges, overlapping the left set as it leaves) ---------------- */
  // back wall: coral (left) → violet → saturated blue (right), x 380–1420 (its right edge meets the pink rect's)
  piece({ name: 'wall3', hold: 3, shape: V.rr(1040, 1500, 0), at: [900, 450], depth: dp(3, 12), thick: 0.05, drift: 1,
    grad: { cols: ['#e15b37', '#6604fc', '#2400ff'], from: [580, 607], to: [1352, 471] }, in: { type: 'slide', from: 'top', t: [7.9, 9.4] } });   // fitted, ≈ 7
  // tall orange rect (right edge x 457, top just above the frame, top-right corner r 150 from about (415, 0) down to
  // (457, 130)): coral → magenta → violet downward; the dark capsule inside it
  piece({ name: 'tallOrange', hold: 3, shape: S.cornerRect(627, 800, 150, 'tr'), at: [143.5, 380], depth: dp(3, 9.8),
    grad: { cols: ['#d3633b', '#8b3180', '#4603ad'], from: [200, 20], to: [200, 680] }, in: { type: 'slide', from: 'top', t: [7.78, 9.2] } });
  piece({ name: 'capsule3', hold: 3, shape: V.rr(184, 637, 92), at: [193, 386.5], depth: dp(3, 9.3),
    grad: { cols: ['#351446', '#261255', '#281273'], from: [193, 100], to: [193, 690] }, in: { type: 'slide', from: 'top', t: [7.88, 9.3] } });
  // bottom-left rect (x ≤ 780, y ≥ 700): violet → deep violet → orange at its right end
  piece({ name: 'bottomRect', hold: 3, shape: V.rr(920, 470, 0), at: [320, 935], depth: dp(3, 8.8),
    grad: { cols: ['#6f13f2', '#4c05bb', '#eb7626'], from: [40, 900], to: [760, 900] }, in: { type: 'slide', from: 'left', t: [7.92, 9.35] } });
  // pink right rect (x ≥ 1400, y ≥ 432, top-left r 220, top-right r 150: the stadium's dark underside shows above it): hot pink at the left → violet at the right, the iso-lines tilted
  // (fitted to the board along y 460–640); its orange foot is a separate layer that fades in toward the bottom
  // x 1400–1950, top 432; top-right corner from (1800, 432) to (1950, 582). While the camera is still near board 2's view, a
  // piece placed for board 3 sits right of where it lands: the gap between the centre rect's right edge and this rect's left
  // edge measured 176 / 144 / 78 / 29 / 0 px at 8.2 / 8.4 / 8.6 / 8.8 / 9.2 s (the back wall's blue end showed through it),
  // so the rect rises flush against the centre rect and eases into its board place
  const PINK = { shape: topRounded(550, 720, 220, 150), at: [1675, 792],
    keys: { x: [[7.85, -200], [8.2, -186], [8.4, -154], [8.6, -88, 'none'], [8.8, -36, 'none'], [9.2, 0, 'power1.out']] } };
  piece({ name: 'pinkRect', hold: 3, ...PINK, depth: dp(3, 7.4),
    grad: { cols: ['#f0508a', '#c832b0', '#700be9'], from: [1420, 600], to: [1834, 776] }, in: { type: 'slide', from: 'bottom', t: [7.85, 9.4] } });
  // the pink rect's orange foot: same outline, flat; orange at the left → mauve-pink at the right, transparent at the top
  // and opaque at the bottom edge (a smooth vertical blend, no band); rides the same slide-in. It sits in front of the lower
  // ring (behind the violet pill), so the ring shows as the board's soft band across the top and fades out below
  const foot = piece({ name: 'pinkFoot', hold: 3, ...PINK, depth: dp(3, 4.5), thick: 0, flat: false, grad: '#f08034', in: { type: 'slide', from: 'bottom', t: [7.85, 9.4] } });
  {
    const u0 = foot.mesh.material.uniforms;
    foot.mesh.material = new THREE.ShaderMaterial({
      uniforms: { ca: { value: h2v('#f8862e') }, cb: { value: h2v('#c05c6c') }, xa: { value: 1420 - PINK.at[0] }, xb: { value: 1920 - PINK.at[0] }, ya: { value: PINK.at[1] - 700 }, yb: { value: PINK.at[1] - 1075 },
        op: u0.op, t: u0.t, flow: u0.flow, spd: u0.spd },
      vertexShader: '#include <common>\n#include <logdepthbuf_pars_vertex>\nvarying vec3 vO;\nvoid main() { vO = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}',
      fragmentShader: 'uniform vec3 ca, cb; uniform float xa, xb, ya, yb, op, t, flow, spd;\nvarying vec3 vO;\n#include <logdepthbuf_pars_fragment>\n' +
        'void main() { float y = vO.y + min(flow, 1.6) * 14.0 * sin(t * spd * 0.55 + 1.3);\n  float a = clamp((ya - y) / (ya - yb), 0.0, 1.0); a = a * a * (3.0 - 2.0 * a);\n  vec3 c = mix(ca, cb, clamp((vO.x - xa) / (xb - xa), 0.0, 1.0));\n' +
        '  gl_FragColor = vec4(c, op * a);\n#include <logdepthbuf_fragment>\n}',
      transparent: true, depthWrite: false });
  }
  // violet pill filling the lower ring's slot (x 1598+, y 855–989), in front of the ring and the foot (it stays inside the slot)
  piece({ name: 'pill3', hold: 3, shape: S.pill(460, 134), at: [1828, 922], depth: dp(3, 4.4),
    grad: { cols: ['#ce647e', '#9438d6', '#6202fd'], from: [1068, 428], to: [1229, 261] }, in: { type: 'slide', from: 'right', t: [8.2, 9.6] } });   // fitted, mean error ≈ 10

  /* ---------------- living gradients: phase-locked to the holds ----------------
     The engine's living gradient slides each gradient by up to ±14 % of its span (sin(2π·t/per + ph) − sin(ph)) and mixes
     each colour toward a partner (sin²(π·t / 0.8·per), capped by the calm above). Both are zero when the slide's phase is
     symmetric about the instant and t / 0.8·per is whole, so each piece's period and phase are set (as g2.js's lock) to pass
     through its board colours at the key instant of each hold it is seen at, flowing at full strength everywhere else.
     The period is jittered a few % per piece so the pieces don't all breathe in unison. A carried piece seen at several
     holds gets an exact lock for each, and its period and phase blend smoothly during the move between them (it is
     moving and being recoloured then, so the extra slide reads as part of the flow). */
  const ssm = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
  const LK = [];
  mine.forEach((pc, i) => {
    const u = pc.mesh.material.uniforms; if (!u.per) return;
    const hs = [1, 2, 3].filter(n => { const P = pc.poseAt(HK[n].tk); return P.op > 0.05 && P.sc > 1e-5; }).map(n => HK[n]);
    if (!hs.length) return;
    const jit = 1 + 0.05 * Math.sin(i * 2.39 + 0.7);
    const L = hs.map(h => { let k = 1; while (h.tk / (0.8 * (k + 1)) >= 6) k++; const per = h.tk / (0.8 * k) * jit;
      return { per, ph: (Math.PI - 2 * Math.PI * h.tk / per) / 2, t0: h.t0, t1: h.t1 }; });
    u.per.value = L[0].per; u.ph.value = L[0].ph;
    if (L.length > 1) LK.push({ u, L });
  });
  anim(t => { for (const { u, L } of LK) { let per = L[0].per, ph = L[0].ph;
    for (let j = 1; j < L.length; j++) { const k = ssm((t - L[j - 1].t1 - 0.15) / (L[j].t0 - L[j - 1].t1 - 0.3)); if (k <= 0) break; per += (L[j].per - per) * k; ph += (L[j].ph - ph) * k; }
    u.per.value = per; u.ph.value = ph; } });

  /* ---------------- the sphere: never still (user, 21:50). It pops in over the slot's left end in frame 1 and floats on
     through 2 and 3 in a lazy wave at a steady 1.15 u/s: it glides along its slot through each board's spot at the key
     instant (moving right, the slot's direction), then floats up and toward the camera over the carry and settles into the
     next board's spot. The wave's crests are solved so every leg runs at the same pace (no speed-up or slow-down). ---------------- */
  const pop = t => t < 0.9 ? 0.001 : Math.min(1, gsap.parseEase('back.out(2)')((t - 0.9) / 0.5));
  {
    const VS = 1.15, TT = [0, h1.tk, h2.tk, h3.tk, 13.3], M = [h1.mark, h2.mark, h3.mark];
    const LIFT = new THREE.Vector3(0, 0.6, 0.8).normalize();          // crests: up and toward the camera
    const v = (x, y, z) => new THREE.Vector3(x, y, z);
    let k = [1.3, 2, 2.4, 1.1], C = null, L = null, idx = null;
    const build = N => {
      const pts = [M[0].clone().add(v(-2.0, 0.7, 0.45).multiplyScalar(k[0])), M[0].clone().add(v(-1.0, 0.55, 0.25).multiplyScalar(k[0])), M[0],
        M[0].clone().lerp(M[1], 0.5).addScaledVector(LIFT, k[1]), M[1], M[1].clone().lerp(M[2], 0.5).addScaledVector(LIFT, k[2]), M[2],
        M[2].clone().add(v(1.0, 0.55, 0.3).multiplyScalar(k[3])), M[2].clone().add(v(2.1, 0.75, 0.55).multiplyScalar(k[3]))];
      C = new THREE.CatmullRomCurve3(pts, false, 'centripetal'); C.arcLengthDivisions = N;
      L = C.getLengths(N); idx = [0, 2, 4, 6, 8].map(i => L[i / 8 * N]);   // arc length at the start, the three marks, the end
    };
    for (let it = 0; it < 30; it++) { build(1600); for (let i = 0; i < 4; i++) k[i] *= Math.pow(VS * (TT[i + 1] - TT[i]) / (idx[i + 1] - idx[i]), i === 1 || i === 2 ? 1.5 : 1); }
    build(4000);                                                        // N a multiple of 8: each mark is exactly a sample point
    const leg = i => u => { const p = C.getPointAt((idx[i] + u * (idx[i + 1] - idx[i])) / idx[4]), t = TT[i] + u * (TT[i + 1] - TT[i]); return i ? { p, c: 0 } : { p, c: 0, sc: pop(t) }; };
    runSegs([0, 1, 2, 3].map(i => [TT[i], TT[i + 1], idx[i + 1] - idx[i], leg(i)]), VS, VS);
  }

  /* ---------------- the camera: one continuous move through boards 1–3, never still ----------------
     Knots: the start (a push already under way on the blank purple), each board's exact framing at its key instant (the
     drift-through holds' own keys), the apex of the 2 → 3 arc, and the drift into the wipe. The path between knots is one
     smooth curve (Hermite segments, each knot's tangent along the blend of its two chords, sized by the shorter one: no
     hooks) and the pace is designed on its own: it eases down to the knot speed around each key instant, lingering there
     (a sin⁴ bump, flat at both ends, so speed and acceleration are continuous), and cruises in between. Each board is passed
     at ~20–30 % of the moves either side (board 1: 1.0 u/s between 3.4 and 4.2; board 2: 1.0 between 4.2 and 3.2; board 3:
     0.6 between 3.1 and 2.6 into the wipe). Tuned for what the eye sees, the set's motion on screen (a grid on the set's
     plane, from the camera alone): 30–80 px/s throughout, easing to ~30–40 at each key instant, no sudden changes.
     · 1 → 2 is an S: the camera comes in to board 1 drifting left and swings back through the fast push, so it passes
       board 2 already drifting right (the way it goes on to 3). Straight in, the drift reversed right at board 2, where a
       pure push shows little on screen.
     · 2 → 3 is only ~2.9 units apart, too short for a real move between two slow passes, so the camera arcs toward the
       set: it pushes in on from board 2 while board 2's set leaves, pans right at the apex (3.5 units nearer the set), then
       pulls back into board 3's framing as board 3's shapes slide in (a reveal), and pushes in again into the wipe. The
       apex is passed slower (1.2 u/s) than the push and pull either side of it: there the whole move is sideways, which
       shows most on screen, so the motion on screen stays even (at full speed it whipped to 170 px/s).
     · 3 → the wipe: the push in carries a clear drift right (review, 2026-09-28: straight in, it showed only 37–53 px/s for
       ~2.3 s after board 3, so the ease back out barely read); board 3 is passed already leaning into it.
     The view turns from one board's direction to the next with the same progress. Laid down as keys every 1/60 s (the
     engine's Hermite through them reproduces the curve). */
  {
    const mf = h2.fwd.clone().lerp(h3.fwd, 0.5).normalize();
    const CK = [   // lat: a sideways lean added to the knot's tangent; kin: that tangent's length × on the incoming side
      { t: 0, p: h1.pos.clone().addScaledVector(h1.fwd, -5.5).addScaledVector(h1.right, 1.5), d: h1.fwd, v: null },   // v null: solved (no bump)
      { t: h1.tk, p: h1.pos, d: h1.fwd, v: 1.0, lat: [h1.right, -0.3] },
      { t: h2.tk, p: h2.pos, d: h2.fwd, v: 1.0, lat: [h2.right, 0.9], kin: 1.6 },
      { t: (h2.tk + h3.tk) / 2, p: h2.pos.clone().lerp(h3.pos, 0.5).addScaledVector(mf, 3.5), d: mf, v: 1.2 },
      { t: h3.tk, p: h3.pos, d: h3.fwd, v: 0.6, lat: [h3.right, 0.35] },
      { t: 13.2, p: h3.pos.clone().addScaledVector(h3.fwd, 3.4).addScaledVector(h3.right, 2.4), d: h3.fwd, v: null },
    ];
    const n = CK.length, chord = i => CK[i].p.distanceTo(CK[i + 1].p);
    const tg = CK.map((c, i) => { const a = i > 0 ? c.p.clone().sub(CK[i - 1].p).normalize() : null, b = i < n - 1 ? CK[i + 1].p.clone().sub(c.p).normalize() : null;
      const d = (a && b ? a.add(b) : (a || b)).normalize(); if (c.lat) d.addScaledVector(c.lat[0], c.lat[1]).normalize();
      return d.multiplyScalar(i === 0 ? chord(0) : i === n - 1 ? chord(n - 2) : Math.min(chord(i - 1), chord(i))); });
    const SG = CK.slice(0, -1).map((A, i) => { const B = CK[i + 1], ma = tg[i], mb = tg[i + 1].clone().multiplyScalar(B.kin || 1), N = 600, pts = [], cum = [0];
      const P = u => { const u2 = u * u, u3 = u2 * u; return A.p.clone().multiplyScalar(2 * u3 - 3 * u2 + 1).addScaledVector(ma, u3 - 2 * u2 + u).addScaledVector(B.p, -2 * u3 + 3 * u2).addScaledVector(mb, u3 - u2); };
      for (let j = 0; j <= N; j++) pts.push(P(j / N));
      for (let j = 1; j <= N; j++) cum.push(cum[j - 1] + pts[j].distanceTo(pts[j - 1]));
      return { A, B, pts, cum, Lg: cum[N], dt: B.t - A.t, q: new THREE.Quaternion().setFromUnitVectors(A.d, B.d) }; });
    SG[0].A.v = 2 * SG[0].Lg / SG[0].dt - SG[0].B.v;
    SG.at(-1).B.v = 2 * SG.at(-1).Lg / SG.at(-1).dt - SG.at(-1).A.v;
    SG.forEach(s => { s.va = s.A.v; s.vb = s.B.v; s.am = (s.Lg / s.dt - (s.va + s.vb) / 2) / 0.375; });
    // distance along a segment at u: ∫ (va + (vb − va)·smoothstep + am·sin⁴(πu)) dt
    const sOf = (s, u) => s.dt * (s.va * u + (s.vb - s.va) * (u * u * u - u * u * u * u / 2) + s.am * (3 * u / 8 - Math.sin(2 * Math.PI * u) / (4 * Math.PI) + Math.sin(4 * Math.PI * u) / (32 * Math.PI)));
    const camG1 = t => {
      const s = SG.find(x => t <= x.B.t + 1e-9) || SG.at(-1), u = Math.min(1, Math.max(0, (t - s.A.t) / s.dt)), d = Math.min(s.Lg, Math.max(0, sOf(s, u)));
      let lo = 0, hi = s.cum.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (s.cum[m] <= d) lo = m; else hi = m; }
      const f = (d - s.cum[lo]) / Math.max(1e-9, s.cum[hi] - s.cum[lo]), pos = s.pts[lo].clone().lerp(s.pts[hi], f);
      const w = d / s.Lg, dir = s.A.d.clone().applyQuaternion(new THREE.Quaternion().slerp(s.q, w * w * (3 - 2 * w)));
      return { pos, look: pos.clone().addScaledVector(dir, 10) };
    };
    const TKS = [h1.tk, h2.tk, h3.tk];
    for (let i = 0; i / 60 < 13.2 - 0.004; i++) { const t = i / 60; if (TKS.some(x => Math.abs(t - x) < 0.004)) continue; const c = camG1(t); V.key(t, c.pos, c.look, { fov: 26 }); }
    { const c = camG1(13.199); V.key(13.199, c.pos, c.look, { fov: 26 }); }
  }
  wipe(12.7, 'lr');
  note(0, 1.7, 'Frame 1 builds in from the blank purple: the collage flies in out of the depth (the camera already pushing in); the tiles turn 90° as they land');
  note(1.7, 3.5, '1 · the camera eases through board 1 without stopping; the sphere glides along its slot');
  note(3.5, 5.7, '1 → 2 · carry: shared shapes glide to their board-2 places; the tiles turn on and fade back as the discs grow in; the sphere floats up and over into its board-2 spot');
  note(5.7, 7.4, '2 · the camera eases through board 2 without stopping and pushes on in toward the set');
  note(7.4, 9.9, '2 → 3 · carry: the camera arcs in toward the set, then pulls back into board 3 as its new shapes slide in from the edges; the right cluster stays');
  note(9.9, 12.1, '3 · the camera eases through board 3, then pushes in, gathering pace, into the wipe');
  note(12.1, 13.2, '3 → 4 · full-screen gradient wipe, left to right (replaces the brand-circle burst)');
};
