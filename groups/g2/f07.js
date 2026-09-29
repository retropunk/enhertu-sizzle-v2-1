/* Frame 7 · the stepped path over diamond pillars, seen 35° from above (G2, called from g2.js with its context C).
   Built (batch 2): real 3D set, no plate.
   · The track: the sphere's route (C.B7, fixed in g2.js) defines a ruled surface under it (the contact line = centre minus
     the surface normal; cross-lines horizontal and square to the route in plan). Board 7's slabs and diamond caps are laid
     on that surface by back-projecting their board outlines from hold 7's camera, so they cover the board exactly at the
     hold and the sphere truly rolls on them from its landing (~21.28, a pad under the funnel stem) to its leap (~25.9, a
     pad at the route's end). Slabs have thickness along hold 7's view rays (flat at the hold, chunky while moving); the
     pillars under the caps splay a few degrees around the hold so their edges stand upright in hold 7's view, as the board
     draws them (a 35°-down camera would otherwise converge them by up to ~125 px), and stand plumb elsewhere.
     Colours are sampled from the board: the caps use a least-squares-fitted 5 × 5 gradient mesh; slabs, pillars and pieces
     use the engine's living gradients, phase-locked to the board colours at the key instant. Mean colour difference from
     board 7 at the key instant: ~9 (0–441 scale; copy areas and the sphere excluded).
   · The backdrop: board 7's flat shapes as pieces in hold 7's view (stripes, the blob with the violet disc, the pink disc,
     the orange field and blocks, the orange bar, the dark stadium). Copy areas (the HER2 box, the FDA card) show what the
     board shows behind them.
   · The sphere's crisp shadow: a soft penumbra and a black crescent laid on the track (board: lower left of the sphere).
   · Motion: the pillars rise into place left to right ahead of the sphere (the slabs hinge up between them), the backdrop
     builds in over the end of the crane, holds with a 3 px drift, leaves as the camera pulls back, and the path collapses
     behind the sphere (never under it); the launch pad sinks once the sphere has leapt. */
export default (V, C) => {
  const { THREE, Vec, UP, h7, B7, lock, calm, PC, SH, hexV3 } = C, { mat } = V;
  const TK = h7.tk, POS = h7.pos, FWD = h7.fwd, RGT = h7.right, UPV = h7.upv, TV = h7.tanV;
  const dirOf = (px, py) => FWD.clone().addScaledVector(RGT, (px - 960) / 540 * TV).addScaledVector(UPV, (540 - py) / 540 * TV);
  const toPx = X => { const d = X.clone().sub(POS), z = d.dot(FWD); return [960 + d.dot(RGT) / z / TV * 540, 540 - d.dot(UPV) / z / TV * 540]; };
  const lerp2 = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  const cl01 = x => Math.min(1, Math.max(0, x));
  const eOut = u => 1 - (1 - u) ** 3, eIn = u => u * u * u;

  /* ---------- the track surface: a ruled surface under the route ---------- */
  const NS = 1000, TB = [];
  for (let i = 0; i <= NS; i++) { const s = B7.L * i / NS, p = B7.at(s), t = B7.tan(s), n = UP.clone().addScaledVector(t, -t.y).normalize();
    TB.push({ c: p.clone().sub(n), tp: new Vec(t.x, 0, t.z).normalize(), sl: t.y / Math.hypot(t.x, t.z) }); }
  const fAt = (i, x, z) => (x - TB[i].c.x) * TB[i].tp.x + (z - TB[i].c.z) * TB[i].tp.z;
  const hAt = (x, z) => {                                                  // surface height at a plan point (continues the end slopes)
    const f0 = fAt(0, x, z); if (f0 <= 0) return TB[0].c.y + f0 * TB[0].sl;
    const fN = fAt(NS, x, z); if (fN >= 0) return TB[NS].c.y + fN * TB[NS].sl;
    let a = 0, b = NS; while (b - a > 1) { const m = (a + b) >> 1; if (fAt(m, x, z) > 0) a = m; else b = m; }
    const fa = fAt(a, x, z), fb = fAt(b, x, z); return TB[a].c.y + (TB[b].c.y - TB[a].c.y) * fa / (fa - fb); };
  const onSurf = (px, py) => { const d = dirOf(px, py); let a = 4, b = 95;   // board px (hold 7) → where its view ray meets the surface
    const g = k => { const X = POS.clone().addScaledVector(d, k); return X.y - hAt(X.x, X.z); };
    for (let it = 0; it < 44; it++) { const m = (a + b) / 2; if (g(m) > 0) a = m; else b = m; }
    return POS.clone().addScaledVector(d, (a + b) / 2); };
  const CPX = TB.map(e => toPx(e.c));                                     // the route's contact line in hold 7's view
  const contactY = x => { let i = 1; while (i < CPX.length - 1 && CPX[i][0] < x) i++; const a = CPX[i - 1], b = CPX[i]; return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0] || 1); };
  const smin = (a, b, k = 8) => -k * Math.log(Math.exp(-a / k) + Math.exp(-b / k));

  /* ---------- board 7's track, in board px (edge scans of the board, ±2 px) ---------- */
  const CAP = { 1: [[168, 523], [330, 425], [493, 523], [331, 616]], 2: [[612, 745], [771, 650], [935, 745], [775, 840]], 3: [[1075, 880], [1238, 785], [1400, 880], [1238, 978]] };   // L, T, R, B
  const plan = X => new Vec(X.x, 0, X.z);
  // the off-board pads (copies of cap 1): 0 under the funnel stem where the sphere lands, 4 at the route's end where it leaps
  const c1 = CAP[1].map(([x, y]) => onSurf(x, y)), c1m = c1.reduce((a, b) => a.add(plan(b)), new Vec()).multiplyScalar(0.25);
  const padAt = Q => c1.map(X => { const p = plan(X).sub(c1m).add(plan(Q)); p.y = hAt(p.x, p.z); return toPx(p); });
  const contactAt = s => TB[Math.round(cl01(s / B7.L) * NS)].c.clone();
  CAP[0] = padAt(contactAt(0.6));
  CAP[4] = padAt(contactAt(B7.L - 1.1));
  // slab edges: the board's lines. Slab 4's back edge keeps ≥ 12 px outside the route's contact line: the fixed route runs
  // up to ~30 px behind the board's edge near the right frame edge, so the edge bends there (only where it must)
  const top1 = x => 382 + 0.132 * x, bot1 = x => 506 + 0.1 * x;
  const top4b = x => 880 + (x - 1400) * 83 / 520, bot4 = x => 978 + (x - 1238) * 116 / 682;
  // (fix pass: the soft minimum is always a little above both lines, so slab 4 started ~0.6 px outside cap 3's corner and
  //  overlapped the cap along its lower-right edge: a z-fighting stipple. It now starts exactly on the board line at the cap
  //  and blends into the route clearance from x 1400 to 1560)
  const top4 = x => { const b = top4b(x), w = (u => u * u * (3 - 2 * u))(cl01((x - 1400) / 160)); return b + (smin(b, contactY(x) - 12) - b) * w; };
  const XE1 = -80, XE4 = 2000;                                            // where the slabs leave the board's lines (off-frame)
  const quad = (A, B, Cc, D) => ({ top: u => lerp2(A, B, u), bot: u => lerp2(D, Cc, u) });   // ribbon: top/bottom edges (board px), u along it
  const SLABS = [                                                         // up / down: the caps each end rests on
    { ...quad(CAP[0][2], [XE1, top1(XE1)], [XE1, bot1(XE1)], CAP[0][3]), up: 0, dn: 1, g: 0 },
    { ...quad([XE1, top1(XE1)], CAP[1][1], CAP[1][0], [XE1, bot1(XE1)]), up: 0, dn: 1, g: 0 },
    { ...quad(CAP[1][2], CAP[2][1], CAP[2][0], CAP[1][3]), up: 1, dn: 2, g: 1 },
    { ...quad(CAP[2][2], CAP[3][1], CAP[3][0], CAP[2][3]), up: 2, dn: 3, g: 2 },
    { top: u => { const x = 1400 + (XE4 - 1400) * u; return [x, top4(x)]; }, bot: u => { const x = 1238 + (XE4 - 1238) * u; return [x, bot4(x)]; }, up: 3, dn: 4, g: 3 },
    { ...quad([XE4, top4(XE4)], CAP[4][1], CAP[4][0], [XE4, bot4(XE4)]), up: 3, dn: 4, g: 3 },
  ];
  const CAPS = [0, 1, 2, 3, 4].map(i => ({ i, ...quad(CAP[i][0], CAP[i][1], CAP[i][2], CAP[i][3]) }));   // u: SW edge → NE edge, v: NW edge → SE edge
  const capCentre = CAPS.map(R => { const P = CAP[R.i].map(p => onSurf(...p)); return P.reduce((a, b) => a.add(b), new Vec()).multiplyScalar(0.25); });

  /* ---------- motion of the track: each pillar + cap rises into place, and later sinks (dy, world units) ----------
     The sphere lands on pad 0 at ~21.28 and is on: slab 1 until ~22.55, cap 1 ~22.9, slab 2 ~23.35, cap 2 ~23.8, slab 3
     ~24.2, cap 3 ~24.5, slab 4 ~25.5, pad 4 until the leap at 25.9. Each section rises well before the sphere reaches it
     and sinks only after it has left (a slab hinges between its two caps, so neither end may move under the sphere). */
  const DROP = 14, RISE = [[20.75, 21.2], [20.95, 21.45], [21.1, 21.6], [21.25, 21.75], [21.4, 21.9]], SINK = [[24.2, 24.85], [24.35, 25.0], [24.5, 25.15], [25.6, 26.25], [26.0, 26.6]];
  const riseOf = (i, t) => -DROP * (1 - eOut(cl01((t - RISE[i][0]) / (RISE[i][1] - RISE[i][0])))), sinkOf = (i, t) => -DROP * eIn(cl01((t - SINK[i][0]) / (SINK[i][1] - SINK[i][0])));
  const RY = [0, 0, 0, 0, 0], SY = [0, 0, 0, 0, 0];                      // per cap: rise and sink offsets now
  // a slab hinges between its caps as they rise (it swings up into place) and falls away with the cap behind the sphere
  const slabDy = (up, dn, w) => RY[up] + (RY[dn] - RY[up]) * w + SY[up];
  // the pillars' splay (see below) is only needed at the hold: plumb elsewhere, easing in as the camera settles into hold 7
  // and out as it leaves (the camera is moving then, so the few degrees of change don't read)
  const splayAt = t => t < 23.3 ? (u => u * u * (3 - 2 * u))(cl01((t - 21.9) / 0.55)) : 1 - (u => u * u * (3 - 2 * u))(cl01((t - 24.1) / 0.6));

  /* ---------- materials (colours sampled from board 7) ---------- */
  const live = m => { const pc = { mesh: { material: m } }; lock(pc, TK); calm(pc); return m; };   // living gradient, on the board colours at the key instant
  const lmat = (cols, a, b, o = {}) => { const ax = b.clone().sub(a).normalize(); return live(mat(cols, { local: true, axis: ax.toArray(), lo: a.dot(ax), hi: b.dot(ax), flat: true, side: THREE.DoubleSide, ...o })); };
  const shade = (h, k) => '#' + [1, 3, 5].map(i => Math.round(parseInt(h.slice(i, i + 2), 16) * k).toString(16).padStart(2, '0')).join('');

  /* ---------- meshes ---------- */
  const meshOf = (pos, idx, m) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    const me = new THREE.Mesh(g, m); me.frustumCulled = false; V.scene.add(me); return me; };
  const gridOf = (R, nu, nv) => { const P = []; for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) { const u = i / nu, [x, y] = lerp2(R.top(u), R.bot(u), j / nv); P.push(onSurf(x, y)); } return P; };
  const surfMesh = (P, nu, nv, m) => { const pos = P.flatMap(p => [p.x, p.y, p.z]), idx = [];
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) { const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1; idx.push(a, c, b, b, c, d); }
    return meshOf(pos, idx, m); };
  const stripMesh = (A, B, m) => { const pos = [], idx = []; A.forEach((p, i) => pos.push(p.x, p.y, p.z, B[i].x, B[i].y, B[i].z));
    for (let i = 0; i < A.length - 1; i++) { const k = 2 * i; idx.push(k, k + 1, k + 2, k + 2, k + 1, k + 3); } return meshOf(pos, idx, m); };
  const TH = 0.55;                                                         // slab thickness, along hold 7's view rays (flat at the hold)
  const under = p => p.clone().addScaledVector(p.clone().sub(POS).normalize(), TH);
  const sections = [0, 1, 2, 3, 4].map(() => []), hinged = [];
  // slabs: dark indigo → violet → orange along the run (board: every slab alike); gradient ends on each slab's centreline
  // (both halves of slabs 1 and 4 share theirs)
  const SLAB_COLS = ['#2a0868', '#4a05b4', '#e06a30'];
  const SG = [[[-110, 431], [330, 482]], [[330, 532], [771, 734]], [[790, 784], [1238, 843]], [[1260, 920], [1920, 1028]]].map(([a, b]) => [onSurf(...a), onSurf(...b)]);
  SLABS.forEach(R => {
    const nu = 28, nv = 8, P = gridOf(R, nu, nv), [a, b] = SG[R.g];
    const mTop = lmat(SLAB_COLS, a, b), mSide = lmat(SLAB_COLS.map(c => shade(c, 0.55)), a, b);
    const rowT = P.slice(0, nu + 1), rowB = P.slice(nv * (nu + 1));
    const cu = plan(capCentre[R.up]), cd = plan(capCentre[R.dn]), ax = cd.clone().sub(cu), L2 = ax.lengthSq();
    for (const me of [surfMesh(P, nu, nv, mTop), stripMesh(rowT, rowT.map(under), mSide), stripMesh(rowB, rowB.map(under), mSide)]) {
      const p = me.geometry.attributes.position, base = p.array.slice(), w = new Float32Array(p.count);
      for (let i = 0; i < p.count; i++) w[i] = cl01(new Vec(p.getX(i), 0, p.getZ(i)).sub(cu).dot(ax) / L2);
      hinged.push({ me, base, w, up: R.up, dn: R.dn, last: null });
    }
  });
  // caps: a gradient mesh (5 × 5 colours, Catmull-Rom smooth) in each cap's own square: mauve at the left corner, a violet
  // pool along the front-left edge, orange all along the far edge (least-squares fit to board 7's caps: rms 7.7 per channel).
  // Living: the lookup drifts gently and sits exactly on the board colours at the key instant. It follows the player's
  // Gradient flow slider (user, 2026-09-29: "yes, add it overnight") as the engine's gradients do: still at Off, faster past Bold.
  const CAP_MESH = ['#ac4a6e', '#b8525e', '#d8643b', '#eb6e31', '#f37427', '#963e93', '#983ea1', '#a846a8', '#db6352', '#f87715',
    '#6a24da', '#6620f5', '#9138c3', '#e36a2c', '#fc7f04', '#5416f6', '#6a21de', '#ae4c75', '#eb7518', '#fa8506', '#5d1be3', '#8031b4', '#bf5958', '#ed7b16', '#fa8608'];   // rows: NW edge → SE edge; each: SW edge → NE edge
  const capU = { cs: { value: CAP_MESH.map(hexV3) }, dr: { value: new THREE.Vector2() }, op: { value: 1 } };
  const capMat = new THREE.ShaderMaterial({ uniforms: capU, side: THREE.DoubleSide,
    vertexShader: '#include <common>\n#include <logdepthbuf_pars_vertex>\nattribute vec2 cuv; varying vec2 vUV;\nvoid main() { vUV = cuv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}',
    fragmentShader: `uniform vec3 cs[25]; uniform vec2 dr; uniform float op; varying vec2 vUV;
#include <logdepthbuf_pars_fragment>
vec4 crw(float f) { float f2 = f * f, f3 = f2 * f; return vec4(-0.5 * f3 + f2 - 0.5 * f, 1.5 * f3 - 2.5 * f2 + 1.0, -1.5 * f3 + 2.0 * f2 + 0.5 * f, 0.5 * f3 - 0.5 * f2); }
vec3 node(int i, int j) { return cs[clamp(j, 0, 4) * 5 + clamp(i, 0, 4)]; }
void main() {
  vec2 q = clamp(vUV + dr, 0.0, 1.0) * 4.0, cf = min(floor(q), vec2(3.0)), f = q - cf; ivec2 c = ivec2(cf);
  vec4 wu = crw(f.x), wv = crw(f.y); vec3 col = vec3(0.0);
  for (int j = 0; j < 4; j++) { vec3 r = vec3(0.0); for (int i = 0; i < 4; i++) r += wu[i] * node(c.x - 1 + i, c.y - 1 + j); col += wv[j] * r; }
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), op);
#include <logdepthbuf_fragment>
}` });
  CAPS.forEach(R => {
    // (fix pass: lifted 0.006 toward the hold camera, along its view rays (no shift at the hold), so a cap always wins the depth
    //  test where a slab's edge meets it: the two surfaces are sampled differently and z-fought along the joins)
    const nu = 12, nv = 12, me = surfMesh(gridOf(R, nu, nv).map(p => p.addScaledVector(POS.clone().sub(p).normalize(), 0.006)), nu, nv, capMat), uv = [];
    for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) uv.push(i / nu, j / nv);
    me.geometry.setAttribute('cuv', new THREE.Float32BufferAttribute(uv, 2)); sections[R.i].push(me);
  });
  // pillars: square, under each cap. Their edges run "down" along hold 7's screen verticals (flat at the hold: the board
  // draws them upright, which a 35°-down camera only gives if they splay a few degrees); the off-board pads stand plumb.
  // Orange at the top → rose → plum; each on-board pillar reaches the board's colour at the frame's bottom edge.
  const PIL_COLS = ['#ea722e', '#b84d77', '#6a2090'], PIL_H = 16, G_BOT = { 1: 0.5, 2: 0.42, 3: 0.2 }, splayed = [];
  CAPS.forEach(R => {
    const [L, T, Rr, Bq] = CAP[R.i], onBoard = R.i >= 1 && R.i <= 3;
    const downOf = ([px, py]) => { if (!onBoard) return UP.clone().negate(); const n = dirOf(px, py).cross(UPV).normalize(), d = UP.clone().negate(); return d.addScaledVector(n, -d.dot(n)).normalize(); };
    const pts = e => Array.from({ length: 9 }, (_, i) => lerp2(e[0], e[1], i / 8));
    const top = [L, T, Rr, Bq].map(p => onSurf(...p)), yBot = Math.min(...top.map(p => p.y)) - PIL_H;
    // each face's gradient runs down from its top edge and reaches the board's colour where its centre line meets the frame's bottom
    const spanOf = (a, b) => { const m = lerp2(a, b, 0.5), P = onSurf(...m), y0 = P.y + 0.3; if (!onBoard) return [y0, 9];
      const d = downOf(m); let lo = 0, hi = 30; for (let it = 0; it < 40; it++) { const h = (lo + hi) / 2; if (toPx(P.clone().addScaledVector(d, h))[1] < 1064) lo = h; else hi = h; }
      return [y0, (y0 - P.clone().addScaledVector(d, lo).y) / G_BOT[R.i]]; };
    const faces = [[Bq, L, 1.0], [Bq, Rr, 0.98], [T, L, 0.82], [T, Rr, 0.78]];   // SW (front-left), SE (front-right), NW, NE
    for (const [a, b, k] of faces) {
      const e = pts([a, b]), A = e.map(p => onSurf(...p)), B = A.map((p, i) => { const d = downOf(e[i]); return p.clone().addScaledVector(d, (p.y - yBot) / -d.y); });
      const [y0, Lg] = spanOf(a, b);
      const me = stripMesh(A, B, lmat(PIL_COLS.map(c => shade(c, k)), new Vec(0, y0, 0), new Vec(0, y0 - Lg, 0)));
      sections[R.i].push(me); if (onBoard) splayed.push({ me, A, B, last: -1 });
    }
  });
  V.anim(t => {
    for (let i = 0; i < 5; i++) { RY[i] = riseOf(i, t); SY[i] = sinkOf(i, t); const dy = RY[i] + SY[i]; for (const me of sections[i]) { me.position.y = dy; me.visible = dy > -DROP + 0.01; } }
    for (const H of hinged) {
      const key = [RY[H.up], RY[H.dn], SY[H.up]].join(); if (key === H.last) continue; H.last = key;
      const p = H.me.geometry.attributes.position, arr = p.array; let top = -1e9;
      for (let i = 0; i < p.count; i++) { const dy = slabDy(H.up, H.dn, H.w[i]); arr[3 * i + 1] = H.base[3 * i + 1] + dy; top = Math.max(top, dy); }
      p.needsUpdate = true; H.me.visible = top > -DROP + 0.01;
    }
    const k = splayAt(t);
    for (const P of splayed) { if (Math.abs(k - P.last) < 1e-5) continue; P.last = k; const arr = P.me.geometry.attributes.position.array;
      P.A.forEach((a, i) => { const b = P.B[i], j = 6 * i + 3; arr[j] = a.x + (b.x - a.x) * k; arr[j + 1] = b.y; arr[j + 2] = a.z + (b.z - a.z) * k; });
      P.me.geometry.attributes.position.needsUpdate = true; }
    // (the Gradient flow slider: the drift × min(flow, 1.6), so Off holds board 7's caps; its clock at the engine's speed past
    //  Bold, still on the board at the key instant. At Medium both are exactly 1 and the clock is t itself: as built)
    const fv = window.v2, fa = Math.min(fv && typeof fv.flow === 'number' ? fv.flow : 1, 1.6), fs = fv && typeof fv.flowSpeed === 'number' ? fv.flowSpeed : 1, tc = fs === 1 ? t : TK + (t - TK) * fs;
    capU.dr.value.set(fa * 0.05 * (Math.sin(tc * 0.41 + 1.3) - Math.sin(TK * 0.41 + 1.3)), fa * 0.04 * (Math.sin(tc * 0.33 + 4.1) - Math.sin(TK * 0.33 + 4.1)));
  });

  /* ---------- the backdrop: board 7's flat shapes, as pieces laid out in hold 7's view (back to front) ----------
     They build in over the end of the crane (21.7–22.45; from the low landing view they would read as slanted walls) and
     leave as the camera pulls back toward the pegs (24.25–25.15), revealing frame 8's wall behind them.
     (review fix, 7 → 8: the exits were timed for the old stop-go camera. Two pops: the low blocks' slide-out was cancelled on
      screen by the new camera move, so they sat still and were switched off at full opacity; and frame 8's wall, flying in
      through this backdrop, hid it the instant it turned opaque (f08 now keeps that wall behind this set until it has gone).
      Now every exit ends in a fade (endFade: its last ~40%), so nothing is ever switched off on screen; the exits are staggered
      a little later, back to front, so the set leaves in layers instead of evaporating; and each piece has an explicit
      back-to-front draw order (order), so a fading piece (drawn as transparent) can never sort over a nearer one.) */
  const bg = spec => PC({ hold: 7, ...spec });
  const fade = (a, b) => ({ type: 'fade', t: [a, b], ease: 'sine.inOut' });
  const endFade = (a, b) => ({ op: [[a, 1], [b, 0, 'sine.inOut']] });     // an opacity fade to add to a moving exit (a slide, a fly)
  // stripes (right): a dark violet field with light bands, warmer to the left (lilac at the top, mauve-orange at the bottom)
  // (review fix: it flew back by 20 from depth 51 and vanished the instant it passed behind the magenta plane at 53; it now
  //  slides off to the right after its bands and fades as it goes)
  bg({ shape: SH.rr(2200, 2600, 0), at: [2400, 300], depth: 51, thick: 0, grad: '#4607ba', order: -7.5, in: fade(21.75, 22.2), out: { type: 'slide', from: 'right', t: [24.55, 25.1] }, keys: endFade(24.8, 25.1) });
  const BANDS = [[-1000, 148, ['#c74ec1', '#b664ec', '#a77bff'], 1560, 1880], [190, 246, ['#a864ee', '#9959f8', '#935cff'], 1700, 1900], [290, 346, ['#8a4cf4', '#7f44fe', '#7537fc'], 1700, 1900],
    [388, 444, ['#7636f4', '#6d2ffc', '#6a2ded'], 1700, 1900], [488, 544, ['#6a2af4', '#6023fc', '#5f20ed'], 1700, 1900], [586, 642, ['#6a28f0', '#6122f9', '#5d1ef0'], 1700, 1900],
    [684, 740, ['#8535cc', '#7c2eda', '#6b2ae6'], 1760, 1900], [784, 838, ['#a5488f', '#8b39b5', '#8632c6'], 1700, 1900], [882, 938, ['#c56245', '#a8487f', '#923bac'], 1600, 1900], [980, 1036, ['#d06a3a', '#b8527a', '#9a4096'], 1600, 1900]];
  BANDS.forEach(([y0, y1, cols, x0, x1], i) => bg({ shape: SH.rr(2200, y1 - y0, 0), at: [2400, (y0 + y1) / 2], depth: 50, thick: 0.25, grad: { cols, from: [x0, 0], to: [x1, 0] }, order: -7,
    in: { type: 'slide', from: 'right', t: [21.85 + 0.03 * i, 22.4 + 0.03 * i] }, out: { type: 'slide', from: 'right', t: [24.4 + 0.025 * i, 24.9 + 0.025 * i] }, keys: endFade(24.7 + 0.025 * i, 24.9 + 0.025 * i) }));
  // far back: magenta (it shows only in the top-left corner), the orange field low left, and the pink disc over them
  // (review fix: the magenta stays until the pieces in front of it have mostly gone, then dissolves to frame 8's wall behind)
  bg({ shape: SH.rr(6000, 6000, 0), at: [0, 400], depth: 53, thick: 0, grad: '#d939bd', order: -8, in: fade(21.6, 22.0), out: fade(24.6, 25.15) });
  bg({ shape: SH.rr(1100, 1100, 0), at: [-120, 1190], depth: 48.5, thick: 0.4, grad: { cols: ['#fb6a22', '#fd7109', '#fd7603'], from: [0, 700], to: [0, 1064] }, order: -6.5, in: fade(21.6, 22.0), out: fade(24.45, 24.95) });
  bg({ shape: SH.disc(436), at: [348, 439], depth: 47, thick: 0.8, grad: { cols: ['#f75586', '#ee4f90', '#e3479a'], from: [100, 0], to: [540, 0] }, order: -5.5, in: { type: 'grow', t: [21.62, 22.15] }, out: { type: 'grow', t: [24.35, 24.85] }, keys: endFade(24.65, 24.85) });
  bg({ shape: SH.rr(260, 260, 0), at: [550, 900], depth: 47.15, thick: 0.8, grad: { cols: ['#ee4f90', '#e3479a', '#db449f'], from: [320, 0], to: [620, 0] }, order: -6, in: fade(21.8, 22.2), out: fade(24.35, 24.7) });   // (the pink runs on down between pillars 1 and 2)
  // the big blob in front: pink → magenta → violet across the frame, bulging right into the violet disc (its edge measured
  // on the board); its left edge hides under the HER2 box, the stadium and pillar 2, so the pink disc shows left and low.
  // No thickness: a side wall along that hidden seam would draw a line across the pink during the moves.
  // (fix pass: its top-right edge was hand points 50–70 px apart plus the arc in 4.2° steps (visibly polygonal), with a blunt
  //  vertical end at x 1541–1545 where the board has a sharp tip. Now measured column by column on board 7: the wedge's upper
  //  side curves from the frame top (x ≈ 1600) down to the tip (1513, 20.5); from the tip the arc runs up to 10 px above the
  //  ellipse (centre 1429,450, radii 403/427), meeting it by x 1640; then the ellipse, all sampled every 4 px / 2°)
  { const ellY = x => 450 - 427 * Math.sqrt(Math.max(0, 1 - ((x - 1429) / 403) ** 2)), edge = [[1630, -1000], [1620, -12], [1600, 0]], arc = [];
    for (let x = 1596; x > 1513; x -= 4) { const u = (x - 1513) / 87; edge.push([x, 20.5 - 34 * u + 13.5 * u * u]); }
    edge.push([1513, 20.5]);
    for (let x = 1517; x < 1640; x += 4) edge.push([x, ellY(x) - 10 * Math.max(0, 1 - (x - 1520) / 120) ** 1.3]);
    for (let a = -Math.acos(211 / 403) * 180 / Math.PI; a <= 90.01; a += 2) { const r = a * Math.PI / 180; edge.push([1429 + 403 * Math.cos(r), 450 + 427 * Math.sin(r)]); }
    for (let a = -128; a <= -99.9; a += 2) { const r = a * Math.PI / 180; arc.push([348 + 436 * Math.cos(r), 439 + 436 * Math.sin(r)]); }   // along the pink disc's top-left arc
    const pts = [[arc.at(-1)[0], -1000], ...edge, [1400, 877], [1360, 900], [1360, 2000], [660, 2000], [660, 300], [560, 250], [200, 200], ...arc];
    bg({ shape: SH.poly(pts, [960, 540]), at: [960, 540], depth: 45, thick: 0, grad: { cols: ['#f75586', '#a822cf', '#5c00fe'], from: [100, 0], to: [1660, 0] }, order: -5,
      in: fade(22.1, 22.45), out: fade(24.4, 24.95) }); }   // (integration: fades in place, late in the crane: flying in / out off its depth,
                                                            //  or fading in from the low view, showed its hidden left edge, a vertical line just above the
                                                            //  frame at the hold, as a tall pink column)
  // the orange bar at the far left (orange → violet down)
  bg({ shape: SH.rr(140, 164, 0), at: [-30, 200], depth: 36, thick: 0.6, grad: { cols: ['#f07626', '#b8467a', '#6d07e7'], from: [0, 150], to: [0, 278] }, order: -4.5,
    in: { type: 'slide', from: 'left', t: [22.05, 22.45] }, out: { type: 'slide', from: 'left', t: [24.3, 24.7] }, keys: endFade(24.5, 24.7) });
  // the orange blocks low between the pillars (their sides hide behind the pillars and slab 4)
  [[[250, 700], [560, 1260], ['#fe7c00', '#ff7e00', '#ff8000'], 500, 610], [[260, 700], [1005, 1260], ['#ed7016', '#e1692a', '#d4623e'], 950, 1060], [[1400, 700], [2000, 1325], ['#ec7612', '#c85f45', '#a8527a'], 1420, 1780]]
    .forEach(([[w, h], at, cols, x0, x1], i) => bg({ shape: SH.rr(w, h, 0), at, depth: 33.5, thick: 1.2, grad: { cols, from: [x0, 0], to: [x1, 0] }, order: -4,
      in: { type: 'slide', from: 'bottom', t: [21.95 + 0.05 * i, 22.4 + 0.03 * i] }, out: { type: 'slide', from: 'bottom', t: [24.3 + 0.06 * i, 24.8 + 0.06 * i] }, keys: endFade(24.55 + 0.06 * i, 24.8 + 0.06 * i) }));
  // the dark indigo stadium behind the path (its right end hides under the FDA card)
  bg({ shape: SH.rr(1142, 311, 155.5), at: [833.5, 449.5], depth: 31, thick: 1.5, grad: { cols: ['#29095c', '#300572', '#380689'], from: [320, 0], to: [880, 0] }, order: -3.5,
    in: { type: 'slide', from: 'left', t: [21.9, 22.4] }, out: { type: 'slide', from: 'left', t: [24.3, 24.8] }, keys: endFade(24.55, 24.8) });

  /* ---------- the sphere's shadow (board: a soft penumbra at its left, a crisp black crescent at its lower left) ----------
     Laid on the track surface (moving with its sections) and clipped to the track tops. */
  const outlines = [...SLABS, ...CAPS].map(R => { const o = []; for (let i = 0; i <= 16; i++) o.push(onSurf(...R.top(i / 16))); for (let i = 16; i >= 0; i--) o.push(onSurf(...R.bot(i / 16))); return o.map(p => [p.x, p.z]); });
  const regDy = [...SLABS.map(R => (x, z) => { const cu = plan(capCentre[R.up]), cd = plan(capCentre[R.dn]), ax = cd.clone().sub(cu), w = cl01(new Vec(x, 0, z).sub(cu).dot(ax) / ax.lengthSq()); return slabDy(R.up, R.dn, w); }),
    ...CAPS.map(R => () => RY[R.i] + SY[R.i])];
  const inPoly = (P, x, z) => { let r = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) if ((P[i][1] > z) !== (P[j][1] > z) && x < (P[j][0] - P[i][0]) * (z - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0]) r = !r; return r; };
  const regionAt = (x, z) => { for (let k = outlines.length - 1; k >= 0; k--) if (inPoly(outlines[k], x, z)) return k; return -1; };   // (caps first)
  const TOW = FWD.clone().setY(0).normalize().negate(), RH = RGT.clone().setY(0).normalize();
  const planDir = (r, w) => RH.clone().multiplyScalar(r).addScaledVector(TOW, w).normalize();
  const layer = ({ off, a, b, ax, rings, al, peak, order }) => {
    const NR = 32, NQ = rings.length, AX = planDir(...ax), PX = AX.clone().cross(UP).normalize();
    const pos = new Float32Array((NR * NQ + 1) * 3), alv = new Float32Array(NR * NQ + 1), idx = [];
    for (let q = 0; q < NQ; q++) for (let r = 0; r < NR; r++) { const i = 1 + q * NR + r, j = 1 + q * NR + (r + 1) % NR;
      if (q === 0) idx.push(0, i, j); else idx.push(i - NR, i, j, i - NR, j, j - NR); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('al', new THREE.BufferAttribute(alv, 1)); g.setIndex(idx);
    const m = new THREE.ShaderMaterial({ uniforms: { op: { value: 1 } }, transparent: true, depthWrite: false, side: THREE.DoubleSide,
      vertexShader: '#include <common>\n#include <logdepthbuf_pars_vertex>\nattribute float al; varying float vA;\nvoid main() { vA = al; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}',
      fragmentShader: 'uniform float op; varying float vA;\n#include <logdepthbuf_pars_fragment>\nvoid main() { gl_FragColor = vec4(0.05, 0.02, 0.07, op * vA);\n#include <logdepthbuf_fragment>\n}' });
    const me = new THREE.Mesh(g, m); me.frustumCulled = false; me.renderOrder = order; V.scene.add(me);
    return (p, k, op) => { me.visible = op > 0.01; if (!me.visible) return;
      const cx = p.x + (off[0] * RH.x + off[1] * TOW.x) * k, cz = p.z + (off[0] * RH.z + off[1] * TOW.z) * k;
      const set = (i, x, z, v) => { const r = regionAt(x, z); pos[3 * i] = x; pos[3 * i + 1] = hAt(x, z) + (r >= 0 ? regDy[r](x, z) : 0) + 0.012; pos[3 * i + 2] = z; alv[i] = r >= 0 ? v : 0; };
      set(0, cx, cz, al(0));
      rings.forEach((rr, q) => { for (let r = 0; r < NR; r++) { const th = 2 * Math.PI * r / NR, ea = Math.cos(th) * a * k * rr, eb = Math.sin(th) * b * k * rr;
        set(1 + q * NR + r, cx + AX.x * ea + PX.x * eb, cz + AX.z * ea + PX.z * eb, al(rr)); } });
      g.attributes.position.needsUpdate = true; g.attributes.al.needsUpdate = true; m.uniforms.op.value = peak * op; };
  };
  const soft = layer({ off: [-0.95, -0.35], a: 1.6, b: 1.0, ax: [0.35, 0.94], rings: [0.2, 0.4, 0.6, 0.8, 1], al: r => (1 - r * r) ** 2, peak: 0.7, order: 2 });
  const crisp = layer({ off: [-0.32, 0.05], a: 1.25, b: 0.4, ax: [0.56, 0.83], rings: [0.3, 0.6, 0.85, 0.94, 1], al: r => r < 0.94 ? 1 : 0, peak: 0.95, order: 3 });
  V.anim((t, b) => {
    const p = b.p, r = regionAt(p.x, p.z), gy = hAt(p.x, p.z) + (r >= 0 ? regDy[r](p.x, p.z) : 0), hgt = Math.max(0, p.y - 1 - gy);
    const op = (t > 20.6 && t < 26.2 && !b.h ? 1 : 0) * Math.max(0, 1 - hgt / 9), k = 1 + 0.06 * hgt;
    soft(p, k, op); crisp(p, k, op * Math.max(0, 1 - hgt / 3));
  });
  V.unplate(7);
};
