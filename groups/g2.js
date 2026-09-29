/* G2 · frames 4–10 (13.2 → 41.4 s): READY? LET'S GO → the pipes → the funnel → the stepped path → the pegs → the corkscrew → the tunnel.
   Starts under G1's left-to-right wipe on frame 4 and ends in frame 10's ring tunnel (dip at 41.4).
   Built (batch 1): frames 4 and 5 are real 3D sets (pieces + New Hero letters traced into extruded 3D type), and the
   5 → 6 move runs over real 3D pipes in board 6's style. Frames 6–10 are built too (batch 2): each frame's real set is in
   groups/g2/f06.js … f10.js; this file keeps the journey (holds, sphere routes, camera curves, captions). Every move from
   20.0 on is one smooth camera curve (see move()), which interpolates the view direction, so no turn bunches up at a key.
   The sphere is plain (no symbol).
   Revision (user, 2026-09-27 21:50, after the first look at 1–15): NEVER STOP. Every frame (4–10) is an ease-through: the
   camera passes the board's pose at its key instant at a drift speed and never stops (PASS, retime()). 4 → 5 is the user's
   new move: the O comes at the camera with the sphere in its hole, the letters follow like a tail, the O and sphere slam
   back to board 5 and the letters whip off to the left. Frame 9's shadow is the sphere's own size. The end is one chase:
   the camera follows the sphere into frame 10's tunnel and hands over to G3 at 41.4 sitting 3 behind it (the 41.4 contract).
   Reading time (user, 2026-09-29, question A2: "add about ½ second where it's under ~1.3 s (e.g. 24, 25), borrowing time
   from the travel between frames so the piece stays 2:27"): frames 7 and 8 read 0.33 s and 0.87 s (reading-time probe, the
   untouched piece), so the camera is RE-PACED round those two keys (repace(), PACE and FLANKS, above move()): the same
   path, poses, looks and lenses, but it LINGERS near its own key speed for longer either side of the key (3 u/s at 7, 4.5
   at 8: never slower than before; review, 2026-09-29: the first re-pace halved the speed through both keys, below the
   never-stop band: "longer, not slower"), settling a little earlier and leaving a little later. The time is borrowed from
   the travel between (at most × 1.16: the 6 → 7 crane, the 7 → 8 swing), and after 8 the rise starts a little quicker
   (× 1.3, as the left copy crosses the frame's edge) and then climbs a little gentler (× 0.91), so its top speed stays
   under the old. Each move keeps its length and time: every key pose at its key instant, the sphere (on its own clock)
   and the cuts are unchanged. With the copy built earlier (c07.js, c08.js), frame 7 reads 0.93 s and frame 8 1.47 s.
   Polish (2026-09-29, the backlog's "Moving from the first frame of a reveal: … G2's at the 13.2 reveal. Give [it] a
   non-zero start velocity"): the camera now leaves the 13.2 cut already moving, at V0 (2.7 u/s) along the push into
   LET'S GO, the direction it is about to go. Its curve (cam45) always started at V0, but the engine starts a shot's first
   key from rest, so the first 0.025 s surged to catch up (0 → 3.6 → 2.7 u/s); the first keys are now laid finer
   (START_DT, at the camera keys), so the rest lasts half a millisecond and no frame shows it. Only 13.2–13.25 changed:
   a 30 fps frame moved 0.00003 units, and the 24 and 60 fps frames that fell in the old surge (13.208, 13.217) moved
   0.01 and 0.005 units onto the curve, all under G1's wipe; from 13.25 on the camera is exactly as before.
   Polish (2026-09-29, the backlog's "G2's sphere path runs ~0.12 s past the 41.4 cut … (under the dip)"): the segs already
   ended at 41.4, but the engine gave the cut instant itself to G2's sphere while the camera there is G3's, so the frame on
   exactly 41.4 (every 25, 30 and 60 fps export has one) drew no sphere in a 3D plate export (no dip). The engine's copy of
   the last seg now ends half a table step early (CUT_OUT, at seg()), so 41.4 is G3's sphere; nothing else in the picture
   changes (THE 41.4 CONTRACT has the numbers and the one leftover). */
import f06 from './g2/f06.js';
import f07 from './g2/f07.js';
import f08 from './g2/f08.js';
import f09 from './g2/f09.js';
import f10 from './g2/f10.js';

export default V => {
  const { THREE, hold, key, note, dip, bgKey, anim, add, mat, o, BOARD } = V;
  // the sphere's segs, also kept here (TRACK) so the camera curves can follow a smoothed sphere (see move()); runSegs is
  // the engine's own (same knot speeds and eases), laid through this seg. The engine's copy of the seg that ends at the
  // 41.4 cut ends CUT_EPS (1/480 s, half a sphere-table step) early, its easing rescaled so the motion up to there is the
  // same: the cut instant goes to G3 (see THE 41.4 CONTRACT). TRACK keeps the seg whole, so the camera curves don't change.
  const TRACK = [], CUT_OUT = 41.4, CUT_EPS = 1 / 480;
  const seg = (t0, t1, ease, fn) => {
    const e = typeof ease === 'function' ? ease : gsap.parseEase(ease); TRACK.push({ t0, t1, e, fn });
    if (t1 < CUT_OUT - 1e-9) return V.seg(t0, t1, e, fn);
    const tc = CUT_OUT - CUT_EPS, k = (tc - t0) / (t1 - t0); return V.seg(t0, tc, u => e(u * k), fn); };
  const runSegs = (list, v0, v1) => {
    const d = list.map(([a, b, Ln]) => Ln / (b - a)), h = list.map(([a, b]) => b - a), v = [v0 ?? d[0]];
    for (let k = 1; k < list.length; k++) { const w1 = 2 * h[k] + h[k - 1], w2 = h[k] + 2 * h[k - 1]; v.push((w1 + w2) / (w1 / d[k - 1] + w2 / d[k])); }
    v.push(v1 ?? d.at(-1));
    list.forEach(([a, b, , fn], k) => { let m0 = v[k] / d[k], m1 = v[k + 1] / d[k]; const r = Math.hypot(m0, m1) / 3; if (r > 1) { m0 /= r; m1 /= r; } seg(a, b, V.easeH(m0, m1), fn); });
    return v; };
  const Vec = THREE.Vector3, UP = new Vec(0, 1, 0);
  const L = (x, y, z) => o(x, y, z);
  const tv = f => Math.tan(f * Math.PI / 360);
  const depthFor = (n, f) => 1080 / (BOARD[n].d * tv(f));
  const basis = d => { const f = new Vec(...d).normalize(), r = f.clone().cross(UP).normalize(); return { f, r, u: r.clone().cross(f) }; };
  const ray = (B, f, px, py) => B.f.clone().addScaledVector(B.r, (px - 960) / 540 * tv(f)).addScaledVector(B.u, (540 - py) / 540 * tv(f));
  function sm(x) { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); }
  const add3 = (p, x, y, z) => p.clone().add(new Vec(x, y, z));

  /* ---------- routes: arc-length curves, split at named points, timed with runSegs ---------- */
  const path = pts => {
    const C = new THREE.CatmullRomCurve3(pts.map(p => p.clone()), false, 'centripetal'); C.arcLengthDivisions = 4000;
    const Lh = C.getLength(), cl = s => Math.min(1, Math.max(0, s / Lh));
    const P = { C, L: Lh, at: s => C.getPointAt(cl(s)), tan: s => C.getTangentAt(cl(s)) };
    P.sOf = Q => { let b = 0, bd = Infinity; for (let i = 0; i <= 6000; i++) { const s = Lh * i / 6000, d = P.at(s).distanceToSquared(Q); if (d < bd) { bd = d; b = s; } } return b; };
    P.pts = (s0, s1, n) => Array.from({ length: n + 1 }, (_, i) => P.at(s0 + (s1 - s0) * i / n));
    return P;
  };
  const piece = (P, s0, s1, c = 1, extra) => u => { const s = s0 + u * (s1 - s0), r = { p: P.at(s), c, tan: P.tan(s) }; if (extra) Object.assign(r, extra(s, u)); return r; };
  // marks: [{ s, t }] along P → consecutive pieces with no speed jumps at the knots
  const run = (P, marks, v0, v1, extra) => runSegs(marks.slice(1).map((m, i) => [marks[i].t, m.t, m.s - marks[i].s, piece(P, marks[i].s, m.s, 1, extra)]), v0, v1);
  // a ballistic hop A(tA) → B(tB) under gravity g (x, z linear in time; y parabolic)
  const hop = (A, tA, B, tB, g) => { const T = tB - tA, vy = (B.y - A.y + 0.5 * g * T * T) / T;
    seg(tA, tB, 'none', u => { const tt = u * T; return { p: new Vec(A.x + (B.x - A.x) * u, A.y + vy * tt - 0.5 * g * tt * tt, A.z + (B.z - A.z) * u), c: 0 }; }); };
  // a hop A → B that passes M at tM (fits the parabola through the three)
  const hop3 = (A, tA, M, tM, B, tB) => { const T = tB - tA, k = (tM - tA) / T, a = B.y - A.y, m = M.y - A.y;
    const bb = (m - a * k) / (k * k - k), aa = a - bb;          // y = A.y + aa·u + bb·u²
    seg(tA, tB, 'none', u => ({ p: new Vec(A.x + (B.x - A.x) * u, A.y + aa * u + bb * u * u, A.z + (B.z - A.z) * u), c: 0 })); };

  /* ---------- props: simple stand-ins that fade in and out around the holds ---------- */
  const fades = [];
  const prop = (list, ...ws) => { fades.push({ list, ws }); return list; };      // windows [in0, in1, out0, out1]; several allowed
  anim(t => {
    for (const { list, ws } of fades) {
      const a = Math.max(...ws.map(w => Math.min(sm((t - w[0]) / (w[1] - w[0])), 1 - sm((t - w[2]) / (w[3] - w[2])))));
      for (const me of list) { me.visible = a > 0.01; const m = me.material; m.uniforms.op.value = a; m.transparent = a < 0.995; m.depthWrite = a >= 0.995; }
    }
  });
  const gm = (cols, a, b, extra = {}) => { const ax = b.clone().sub(a).normalize(); return mat(cols, { axis: ax.toArray(), lo: a.dot(ax), hi: b.dot(ax), side: THREE.DoubleSide, ...extra }); };
  const mesh = (geo, m) => { const me = new THREE.Mesh(geo, m); V.scene.add(me); return me; };
  // sweep cross-section polylines [[s, y], …] along a route (s across it, y up); frames keep the section upright
  const frames = pts => { const F = []; let S0 = new Vec(0, 0, 1);
    for (let i = 0; i < pts.length; i++) { const T = pts[Math.min(i + 1, pts.length - 1)].clone().sub(pts[Math.max(i - 1, 0)]).normalize();
      let S = T.clone().cross(UP); S = S.length() < 1e-3 ? S0.clone() : S.normalize(); S0 = S; F.push({ T, S, Y: S.clone().cross(T) }); }
    return F; };
  // (a poly's p can also be a function of the point index returning the polyline there: a section that changes along the path)
  const sweep = (pts, polys, wFn) => { const F = frames(pts), pos = [], idx = [];
    for (const { p: poly0, closed } of polys) { const polyAt = typeof poly0 === 'function' ? poly0 : () => poly0, n0 = polyAt(0).length, ne = closed ? n0 : n0 - 1;
      for (let e = 0; e < ne; e++) { const base = pos.length / 3;
        pts.forEach((P, i) => { const w = wFn ? wFn(i / (pts.length - 1)) : 1, poly = polyAt(i), qa = poly[e], qb = poly[(e + 1) % n0];
          for (const q of [qa, qb]) { const X = P.clone().addScaledVector(F[i].S, q[0] * w).addScaledVector(F[i].Y, q[1]); pos.push(X.x, X.y, X.z); } });
        for (let i = 0; i < pts.length - 1; i++) { const k = base + 2 * i; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); } } }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g; };
  // a flat shape placed across a route end (its x along S, y along Y)
  const capAt = (pts, i, shape) => { const F = frames(pts)[i], g = new THREE.ShapeGeometry(shape, 24);
    g.applyMatrix4(new THREE.Matrix4().makeBasis(F.S, F.Y, F.T).setPosition(pts[i])); return g; };
  const rectShape = (x0, y0, x1, y1, holes = []) => { const s = new THREE.Shape(); s.moveTo(x0, y0); s.lineTo(x1, y0); s.lineTo(x1, y1); s.lineTo(x0, y1); s.lineTo(x0, y0);
    for (const [a, b, c, d] of holes) { const h = new THREE.Path(); h.moveTo(a, b); h.lineTo(a, d); h.lineTo(c, d); h.lineTo(c, b); h.lineTo(a, b); s.holes.push(h); } return s; };

  bgKey(13.2, '#1a0a4a', '#220c5e', '#3f0aa8');
  bgKey(13.21, '#2a0a52', '#4a1470', '#6a1a70');
  bgKey(14.3, '#1e0e50', '#23105c', '#3c10a4');                           // the pill's indigo behind the push (hides plate seams)
  bgKey(16.2, '#1e0e50', '#23105c', '#3c10a4');
  bgKey(17.0, '#160a40', '#24105a', '#3a148a');
  bgKey(26.0, '#2a0c78', '#5a1aa0', '#8a2ab0');
  bgKey(34.0, '#2a0c78', '#4b10b0', '#7a20c0');
  bgKey(41.39, '#1e0c50', '#2a0c78', '#4b10a0');

  /* =================== the holds (cameras; marks where the sphere matches its board) =================== */
  // the board images carry a 1–2 px light border on the left, right and top; trim it off this group's plates so no bright
  // seam shows when a plate edge crosses the frame mid-move (under 1.5 px of shift; the plate is the last thing hold() adds)
  const trim = h => { const m = V.scene.children.at(-1); if (m && m.material && m.material.map) { m.material.map.repeat.set(957 / 960, 538 / 540); m.material.map.offset.set(1 / 960, 1 / 540); } return h; };
  // frame 5 at the origin; frame 4 is placed so that frame 5's sphere sits exactly behind the O of GO (board 4: O at 1680,470)
  const M5 = L(0, 0, 0), F45 = 26, B45 = basis([0, 0, -1]);
  const d4 = 1080 / (132 * tv(F45));
  const c4 = M5.clone().addScaledVector(ray(B45, F45, 1680, 470), -d4);
  // frames 4 and 5 are built (real 3D sets below): no plates. NEVER STOP (user, 2026-09-27 21:50: "ease into that keyframe and
  // then ease back out … so you're never actually stopping"): frame 4 is an ease-through now. The camera passes board 4's exact
  // pose at 14.2 still pushing in on LET'S GO (V4 u/s, about a quarter of the push's cruise); frame 5 already was one.
  const h4 = hold(4, { t: [13.95, 14.45], tk: 14.2, pos: c4, look: c4.clone().addScaledVector(B45.f, 10), fov: F45, plate: false, pass: true });
  const h5 = hold(5, { t: [15.78, 16.02], tk: 15.9, mark: M5, dir: [0, 0, -1], fov: F45, plate: false, pass: true });   // drift-through: no stop (user: the O → sphere moment "sort of pauses")
  const P4c = h4.pos, Dv45 = h5.pos.clone().sub(P4c), S45 = Dv45.length(), Dn45 = Dv45.clone().normalize();
  // (the approved batch-1 push, from rest at 14.4: kept only to place S0 exactly where it was. Route A (and so the channel, the
  //  aerial pipes and frame 6's pipe) is built through S0, so S0 must not move.)
  const pushOld = t => { const T = 15.9 - 14.4, u = Math.min(1, Math.max(0, (t - 14.4) / T)), u2 = u * u, u3 = u2 * u; return P4c.clone().addScaledVector(Dn45, (-2 * u3 + 3 * u2) * S45 + (u3 - u2) * T * 7.5); };
  // a quintic Hermite (position, velocity, acceleration at both ends); scalar and vector
  const q5 = (p0, v0, a0, p1, v1, a1, h, u) => { const u2 = u * u, u3 = u2 * u, u4 = u3 * u, u5 = u4 * u;
    return p0 * (1 - 10 * u3 + 15 * u4 - 6 * u5) + h * v0 * (u - 6 * u3 + 8 * u4 - 3 * u5) + h * h * a0 * (0.5 * u2 - 1.5 * u3 + 1.5 * u4 - 0.5 * u5)
      + h * h * a1 * (0.5 * u3 - u4 + 0.5 * u5) + h * v1 * (-4 * u3 + 7 * u4 - 3 * u5) + p1 * (10 * u3 - 15 * u4 + 6 * u5); };
  const q5v = (p0, v0, a0, p1, v1, a1, h, u) => new Vec(...['x', 'y', 'z'].map(c => q5(p0[c], v0[c], a0[c], p1[c], v1[c], a1[c], h, u)));
  const hermS = (a, ma, b, mb, u, T) => { const u2 = u * u, u3 = u2 * u; return a * (2 * u3 - 3 * u2 + 1) + ma * T * (u3 - 2 * u2 + u) + b * (-2 * u3 + 3 * u2) + mb * T * (u3 - u2); };
  const hermV = (a, ma, b, mb, u, T) => new Vec(...['x', 'y', 'z'].map(c => hermS(a[c], ma[c], b[c], mb[c], u, T)));
  /* ---- the camera 13.2 → 16.55 as ONE analytic curve (the O's flight and the sphere ride it, so it exists before the keys) ----
     13.2 → 14.2: from V0 under G1's wipe, gathering and easing to V4 along the push line (camera 4 → camera 5) as it passes board 4's pose;
     14.2 → 15.9: the push in on LET'S GO, a quintic arriving at board 5's pose at V5 u/s with the acceleration the approved curve
     on to the crane key (16.55) starts with, so the join is smooth to the second derivative; 15.9 → 16.55: that Hermite. The
     keys below are laid densely along it. */
  // (XA: the run-up before board 4; longer than V4 × 1 s, so out of the wipe the camera gathers to ~6.5 u/s and eases down
  //  into board 4 at V4, then picks up again: it slows into the keyframe instead of creeping up to it)
  // (review fix: the camera started from rest at 13.2 and was still gathering speed as the wipe's trailing edge revealed frame
  //  4, while G1 goes into the wipe pushing at ~2.7 u/s; it now starts at V0 along the push, so the push reads continuous)
  const V4 = 4.5, V5 = 5.5, XA = 5.2, V0 = 2.7, Z3 = new Vec();
  const K1 = { t: 16.55, pos: add3(h5.pos, 3.2, 4.6, -1.5), look: L(5, -2.0, 0.5), f: 0.5, fov: 34 }, K2 = { t: 17.2, pos: L(8, 12.5, 10.5), look: L(12, -3, -1), f: 0.4, fov: 38 };
  const TH5 = K1.t - h5.tk, dK = K2.t - K1.t, v0v = Dn45.clone().multiplyScalar(V0), v4v = Dn45.clone().multiplyScalar(V4), v5v = Dn45.clone().multiplyScalar(V5), look5 = h5.pos.clone().addScaledVector(B45.f, 10);
  const vK = K2.pos.clone().sub(K1.pos).multiplyScalar(1 / dK), lK = K2.look.clone().sub(K1.look).multiplyScalar(1 / dK);
  const aH = (p0, m0, p1, m1, T) => p1.clone().sub(p0).multiplyScalar(6 / (T * T)).addScaledVector(m0, -4 / T).addScaledVector(m1, -2 / T);   // a cubic Hermite's start acceleration
  const a5 = aH(h5.pos, v5v, K1.pos, vK, TH5), aL5 = aH(look5, v5v, K1.look, lK, TH5);
  const cam45 = t => {                                                      // { p: position, l: look point, f: look-follow, fov }
    if (t <= h4.tk) { const h = h4.tk - 13.2, u = Math.min(1, Math.max(0, (t - 13.2) / h)), p = q5v(c4.clone().addScaledVector(Dn45, -XA), v0v, Z3, c4, v4v, Z3, h, u);
      return { p, l: p.clone().addScaledVector(B45.f, 10), f: 0, fov: F45 }; }
    if (t <= h5.tk) { const h = h5.tk - h4.tk, u = (t - h4.tk) / h; return { p: q5v(c4, v4v, Z3, h5.pos, v5v, a5, h, u), l: q5v(h4.look, v4v, Z3, look5, v5v, aL5, h, u), f: 0, fov: F45 }; }
    const u = Math.min(1, (t - h5.tk) / TH5);
    return { p: hermV(h5.pos, v5v, K1.pos, vK, u, TH5), l: hermV(look5, v5v, K1.look, lK, u, TH5), f: hermS(0, 0, K1.f, (K2.f - K1.f) / dK, u, TH5), fov: hermS(F45, 0, K1.fov, (K2.fov - K1.fov) / dK, u, TH5) }; };
  // its view basis, and board px ↔ world for it (sx, sy: stage px; z: depth along the view)
  const camB = t => { const c = cam45(t), f = c.l.clone().sub(c.p).normalize(), r = f.clone().cross(UP).normalize(); return { p: c.p, f, r, u: r.clone().cross(f), tv: tv(c.fov) }; };
  const proj = (B, P) => { const d = P.clone().sub(B.p), z = d.dot(B.f); return [960 + d.dot(B.r) / (z * B.tv) * 540, 540 - d.dot(B.u) / (z * B.tv) * 540, z]; };
  const unproj = (B, sx, sy, z) => B.p.clone().addScaledVector(B.f, z).addScaledVector(B.r, (sx - 960) / 540 * B.tv * z).addScaledVector(B.u, (540 - sy) / 540 * B.tv * z);

  // frame 7 (35° down on the stepped path); frame 6's mark sits straight above where the sphere lands on frame 7's first slab
  const F7 = 28, D7 = depthFor(7, F7), M7 = L(54, -21.5, 2.5);
  const h7 = trim(hold(7, { t: [22.8, 23.8], tk: 23.3, pass: true, mark: M7, dir: [0.15, -0.57, -0.81], fov: F7, plate: { depth: D7 + 2.5, in: [21.25, 22.35], out: [26.1, 26.9] } }));
  const r7 = (px, py) => h7.at(px, py, D7);
  // (batch 2: the last two points lowered, [1550, 840] → 855 and [1920, 875] → 915, so the route runs on board 7's slab 4
  //  instead of up to 30 px behind its back edge; M7, the frame 7 key and E7b (hence frame 8) are unchanged)
  const route7 = [[-550, 225], [-150, 330], [100, 400], [330, 445], [664, 580], [800, 650], [1000, 705], [1237, 790], [1550, 855], [1920, 915], [2400, 935]].map(([x, y]) => r7(x, y));
  const Lp = route7[0];
  const F6 = 28, D6 = depthFor(6, F6), M6 = Lp.clone().add(new Vec(0, 10.7, 0));
  // frame 6 is a quick frame: a drift-through (batch 2; the camera used to stop dead 20.4–20.85, which read as a pause). The
  // camera passes board 6's exact pose at 20.65 on one smooth curve (see the camera keys); its set is built (f06.js, no plate)
  const h6 = trim(hold(6, { t: [20.4, 20.85], tk: 20.65, mark: M6, dir: [0, (676 - 540) / 540 * tv(F6), -1], fov: F6, pass: true, plate: { depth: D6 + 9, in: [20.26, 20.38], out: [20.9, 21.25] } }));

  // frame 8: frontal on the peg wall; the pegs from the board (peg centres, px) and the hop chain
  const F8 = 26, D8 = depthFor(8, F8);
  const PEGS = [[162, 42], [305, 53], [199, 170], [337, 152], [471, 162], [580, 132], [415, 278], [540, 255], [672, 255], [781, 226], [616, 372], [740, 350], [868, 338], [974, 312],
    [812, 456], [936, 433], [1059, 424], [1168, 395], [1006, 539], [1130, 517], [1254, 509], [1362, 481], [1200, 626], [1324, 603], [1449, 593], [1545, 572], [1392, 712],
    [1510, 698], [1649, 705], [1755, 676], [1585, 828], [1712, 806], [1835, 790], [1780, 912], [1900, 905]];
  const E7b = route7.at(-1);
  const M8 = add3(E7b, 6 + 19.15, -3 - 6.63, 0); M8.z = E7b.z - 6;       // the leap lands on the top-left pegs
  const h8 = trim(hold(8, { t: [28.25, 29.25], tk: 28.75, pass: true, mark: M8, dir: [0, 0, -1], fov: F8, plate: { depth: D8 + 2, in: [25.25, 26.35], out: [29.8, 30.5] } }));
  const onPeg = (px, py) => h8.at(px, py - 58, D8);                          // sphere resting on top of a peg

  /* =================== frames 4–5: the real sets =================== */
  // Both hold cameras look straight down -z; camera 5 is camera 4 pushed 18.49 in and trucked 10.5 right (the approved move).
  // Depths (from camera 4) are chosen so that move reproduces both boards in true 3D: the letter plane at 34.65 scales
  // 2.145× (board 4 → 5 letters land within ~6 px with no cheating); the decor sits between the letters and the pill, so
  // the push sweeps it out of frame by parallax; the pill is far back (84.3: it scales 1.28× like the boards) and only
  // needs a small sideways glide (carry) to reach its board 5 pose.
  const SH = V.S, DZ45 = h4.pos.z - h5.pos.z;
  const hexV3 = h => { const n = parseInt(h.slice(1), 16); return new Vec((n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255); };
  const still = pc => { const u = pc.mesh.material.uniforms; for (const k of ['0', '1', '2']) u['p' + k].value.copy(u['c' + k].value); u.bi.value.set(-1, -1, -1); return pc; };   // no living colour shift (white type)
  // living gradients stay, but each colour drifts at most ~25% toward its partner (the engine allows 50%), so the held
  // frames keep the board's colours (user: "smooth beats extra colour variety")
  const calm = (pc, a = 0.5) => { const u = pc.mesh.material.uniforms; if (u.p0) for (const k of ['0', '1', '2']) u['p' + k].value.lerp(u['c' + k].value, 1 - a); return pc; };
  // flat at the hold: the back face is pushed out along the hold camera's view rays, so the sides are edge-on (invisible)
  // from that camera and open up as soon as it moves ("flat at the hold, chunky sides when the camera moves").
  // pose: the hold whose view it's flat for, its anchor px, depth and px scale (a carried piece can be flat for its later pose)
  const flatGeo = (g, n, at, d, s = 1) => { const p = g.attributes.position; g.computeBoundingBox(); const zb = g.boundingBox.min.z; if (zb > -1e-6) return g;
    const t = -zb * d * HH[n].tanV / 540 * s;                            // the extrusion in world units at that pose
    for (let i = 0; i < p.count; i++) if (p.getZ(i) < zb / 2) { const x = p.getX(i), y = p.getY(i); p.setXY(i, x + (at[0] - 960 + s * x) / s * t / d, y + (540 - at[1] + s * y) / s * t / d); }
    p.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingBox(); return g; };
  const flatFor = (pc, n, at, d, s = 1) => { flatGeo(pc.mesh.geometry, n, at, d, s); return pc; };
  const HH = { 4: h4, 5: h5 };
  // phase-lock a piece's living gradient so it sits exactly on its authored (board) colours at its hold's key instant and
  // flows everywhere else: the partner mix is sin²(π·t / 0.8·per) (zero when t/0.8·per is whole) and the slide is
  // sin(2π·t/per + ph) − sin(ph) (zero when ph = (π − 2π·t/per) / 2)
  const lock = (pc, tk, k = 2) => { const u = pc.mesh.material.uniforms; if (!u.per) return pc; u.per.value = tk / (0.8 * k); u.ph.value = (Math.PI - 2 * Math.PI * tk / u.per.value) / 2; return pc; };
  const PC = spec => { const pc = lock(calm(V.piece(spec)), spec.lockT ?? HH[spec.hold].tk, spec.lockK ?? 2); return spec.flat === false ? pc : flatFor(pc, spec.hold, spec.at || [960, 540], spec.depth); };
  // soft glow: a piece whose material fades radially from gc (local board px) over gr px (gk stretches it into an ellipse:
  // gr·gk[0] across, gr·gk[1] up); it shares the piece's op and time. Its base piece must not drift (drift 0), or the glow
  // slides off the base's edge and bares a strip of it (the thin dark line the review found along the pill at frame 5).
  const GLV = '#include <common>\n#include <logdepthbuf_pars_vertex>\nvarying vec3 vO;\nvoid main() { vO = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}';
  const GLF = 'uniform vec3 col; uniform vec2 gc, gk; uniform float gr, ga, op, t, ph, flow, spd;\nvarying vec3 vO;\n#include <logdepthbuf_pars_fragment>\nvoid main() { float d = length((vO.xy - gc) / gk) / gr; float k = 1.0 - smoothstep(0.0, 1.0, d);\n  gl_FragColor = vec4(col, ga * op * k * k * (3.0 - 2.0 * k) * (0.9 + 0.1 * min(flow, 1.6) * sin(t * spd * 0.7 + ph)));\n#include <logdepthbuf_fragment>\n}';
  let glowN = 0;
  const glow = (spec, col, gc, gr, ga, gk = [1, 1]) => { const pc = PC({ drift: 0, thick: 0, ...spec }), o0 = pc.mesh.material;
    pc.mesh.material = new THREE.ShaderMaterial({ uniforms: { col: { value: hexV3(col) }, gc: { value: new THREE.Vector2(...gc) }, gk: { value: new THREE.Vector2(...gk) }, gr: { value: gr }, ga: { value: ga }, op: o0.uniforms.op, t: o0.uniforms.t, flow: o0.uniforms.flow, spd: o0.uniforms.spd, ph: { value: 1.7 * glowN++ } },
      vertexShader: GLV, fragmentShader: GLF, transparent: true, depthWrite: false });
    return pc; };
  const stadium = (len, r) => { const s = new THREE.Shape(); s.moveTo(0, -r); s.lineTo(len, -r); s.absarc(len, 0, r, -Math.PI / 2, Math.PI / 2, false); s.lineTo(0, r); s.absarc(0, 0, r, Math.PI / 2, 1.5 * Math.PI, false); return s; };
  const fadeOut = (a, b) => ({ type: 'fade', t: [a, b], ease: 'sine.inOut' });   // smooth (the preset's default power3.in jumps at the end)
  const T45 = [h4.t1, h5.tk];                                                // the push (14.45 → 15.9: the pill's glide into its frame 5 pose)
  // (revision: the old "flat at BOTH holds" blend (T'S G and the pill switched between a frame-4-flat and a frame-5-flat back
  //  face over the push) is gone: the new rule keeps the 3D depth visible, never blending a piece to a flat form by time. The
  //  pill is flat for camera 4 (plain geometry, like every piece); the letters are plain extrusions.)

  // ---- board 4: backdrop (brick → mauve → plum; its own multi-stop shader, drifting slowly), and the pill, carried into frame 5
  const BGF = 'uniform vec3 cs[6]; uniform float ys[6]; uniform float op, t, flow, spd;\nvarying vec3 vO;\n#include <logdepthbuf_pars_fragment>\nvoid main() { float y = 540.0 - vO.y + 18.0 * min(flow, 1.6) * sin(t * spd * 0.31);\n  vec3 c = cs[0]; for (int i = 0; i < 5; i++) c = mix(c, cs[i + 1], clamp((y - ys[i]) / (ys[i + 1] - ys[i]), 0.0, 1.0));\n  gl_FragColor = vec4(c, op);\n#include <logdepthbuf_fragment>\n}';
  { const bgp = PC({ hold: 4, shape: SH.rr(5200, 3400, 0), at: [960, 540], depth: 110, thick: 0, drift: 0, out: fadeOut(16.3, 16.85) }), o0 = bgp.mesh.material;
    bgp.mesh.material = new THREE.ShaderMaterial({ uniforms: { cs: { value: ['#d0603c', '#cd5b3e', '#b34747', '#7a2b5c', '#681a5f', '#480f5c'].map(hexV3) }, ys: { value: [-300, 30, 250, 620, 800, 1050] }, op: o0.uniforms.op, t: o0.uniforms.t, flow: o0.uniforms.flow, spd: o0.uniforms.spd },
      vertexShader: GLV, fragmentShader: BGF, transparent: true });             // (transparent so its fade-out blends)
    bgp.mesh.renderOrder = -3; }                                           // drawn first: its glows sit only ~0.2 in front, and by-distance sorting
                                                                           // flipped them behind it once the camera moved (board 5's violet popped off at 16.2)
  glow({ hold: 4, shape: SH.disc(560), at: [1880, 40], depth: 109.9, out: fadeOut(16.3, 16.85) }, '#d64e66', [0, 0], 560, 0.55).mesh.renderOrder = -2;     // pinker at the top right
  // board 5's bright violet low left, below the pill (builds in during the push, so board 4 keeps its plum)
  glow({ hold: 5, shape: SH.disc(1100), at: [120, 1040], depth: 91.3, in: { type: 'fade', t: [14.7, 15.5] }, out: fadeOut(16.3, 16.85) }, '#a012e0', [0, 0], 1100, 0.95).mesh.renderOrder = -2;
  const PILL_OUT = { y: [[15.98, 0], [16.48, -980, 'power2.in']], op: [[16.48, 1], [16.5, 0]] };   // after frame 5 the pill lifts out of the top like a curtain
  const PILL = d => ({ shape: stadium(2600, 278), at: [434, 458], depth: d, carry: [{ hold: 5, at: [222, 464], depth: d - DZ45, s: 1.281, t: T45, ease: 'sine.inOut' }] });
  // the pill (flat for camera 4, like every piece); no drift, so its glow stays on it
  PC({ hold: 4, ...PILL(84.3), thick: 0.8, drift: 0, lockT: 15.9, lockK: 1, grad: { cols: ['#5206b0', '#34087e', '#22095a'], c: [1920, 180], r: 800 }, in: { type: 'fly', t: [13.05, 13.6], dz: 20 }, keys: PILL_OUT });
  // board 5's violet glow: a low, wide band along the pill's bottom-left edge (board 5: strongest at y 800, gone by y 620,
  // x 0–800); in the pill's local px at its frame 5 pose (anchor 222,464, ×1.281). Builds in during the push.
  glow({ hold: 4, ...PILL(84.0), in: { type: 'fade', t: [14.7, 15.5] }, keys: PILL_OUT }, '#5a12cc', [123, -293], 195, 0.9, [3.3, 1]);
  // board 4 decor: in front of the pill, behind or beside the letters; the push sweeps it all out of frame (then it's hidden)
  const DEC = (spec, d, i) => PC({ hold: 4, depth: d, thick: 0.9, in: { type: 'fly', t: [13.1 + 0.05 * i, 13.7 + 0.05 * i], dz: 14 }, keys: { op: [[15.62, 1], [15.66, 0]] }, ...spec });
  DEC({ shape: SH.disc(365), at: [55, -170], grad: { cols: ['#ee6456', '#e45a5e', '#da5068'], from: [150, 0], to: [60, 195] } }, 60, 0);            // pink disc, top left
  DEC({ shape: SH.disc(708), at: [-560, 740], grad: { cols: ['#dd5650', '#b83b6e', '#8e2489'], from: [60, 380], to: [60, 1060] } }, 60.2, 1);       // coral → violet arc, left edge
  DEC({ shape: SH.disc(588), at: [1122, -261], grad: { cols: ['#ff8a06', '#ff7433', '#fb5872'], from: [600, 0], to: [1640, 0] } }, 26, 2);         // big orange disc, top
  DEC({ shape: SH.disc(738), at: [1548, 1547], grad: { cols: ['#d80bff', '#bf0ef2', '#b010d4'], from: [1600, 810], to: [1250, 1080] } }, 38, 3);  // magenta disc, bottom right
  DEC({ shape: SH.arch(686, 489, 226.5), at: [432, 1150], grad: { cols: ['#eb7120', '#f4582b', '#ff3d34'], from: [89, 0], to: [775, 0] } }, 38.1, 4);   // orange → red arch
  DEC({ shape: SH.archFill(245, 268), at: [432.5, 1150], grad: { cols: ['#900be0', '#830fbc', '#740cab'], from: [316, 0], to: [549, 0] } }, 38.3, 4); // its violet opening
  // the two "quote marks": each a top quarter-disc (curve top left) over a bottom one (curve bottom right)
  DEC({ shape: SH.qdisc(137, 'tl'), at: [765, 735], grad: { cols: ['#ef6c28', '#f25a2a', '#fc452d'], from: [628, 0], to: [765, 0] } }, 36, 5);
  DEC({ shape: SH.qdisc(137, 'br'), at: [628, 735], grad: { cols: ['#f87a08', '#a0409c', '#4410ff'], from: [640, 737], to: [640, 845] } }, 36.05, 5);
  DEC({ shape: SH.qdisc(137, 'tl'), at: [903, 735], grad: { cols: ['#f4c400', '#ff7b1c', '#4108e5'], c: [770, 770], r: 165 } }, 36, 6);   // least-squares fit to board 4 (mean error 97 → 36)
  DEC({ shape: SH.qdisc(137, 'br'), at: [765, 735], grad: { cols: ['#e9721e', '#ef6526', '#fb4432'], from: [765, 0], to: [903, 0] } }, 36.05, 6);

  // ---- READY? LET'S GO: New Hero ExtraBold as extruded 3D letters, each at its measured board 4 place (ink centre)
  const WD = 34.65, TH = 0.2, FB = 157.5;                                  // letter plane depth (camera 4), thickness, font px on board 4
  const GL = [['R', 388, 470.5], ['E', 488.5, 470.5], ['A', 599, 470.5], ['D', 723.9, 470.5], ['Y', 830.5, 470.5], ['?', 933.5, 469.5],
    ['L', 1066.5, 470.5], ['E', 1159.5, 470.5], ['T', 1260, 470.5], ['’', 1335, 436.5], ['S', 1406.5, 470], ['G', 1551, 470.5], ['O', 1679.5, 470.5]];
  /* ---- 4 → 5, the user's move (2026-09-27 21:50, confirmed): the O comes AT the camera with the sphere filling its hole ("Keep
     the sphere the same size as the inside of the O, so it pulls closer and closer to the camera and gets really big"), until
     they nearly fill the frame; the other letters "pull forward the same way the O does, but in a staggering motion, almost as
     if the words and letters are part of a tail that pulls forward, so they all feel connected"; then the O and sphere "slam
     back down to its previous original position" and "the letters of the words go flying left, almost like a whip being
     whipped off the screen". The camera keeps pushing in on LET'S GO the whole time and no longer flies through the O.
     · pO(t), the flight: 0 at rest, 1 at the peak (D_PK in front of the lens, near the frame's centre). It rises on a sine ease
       (T_UP), hangs for an instant, slams back accelerating (T_SL, like a drop), overshoots deeper and settles on a damped
       spring whose second zero is frame 5's key instant (15.9), so T'S G● reads as board 5 there.
     · flyO(): the O's depth from the (moving) camera shrinks geometrically with p (a steady zoom) while it swells rightward
       (about a point BETA of the way to its left edge) and rises toward the frame's middle; at p = 0 it is exactly at rest.
     · the O and the sphere are one object: the sphere sits in the O's counter at the counter's size (SC_C), at the O's
       mid-thickness. On the slam's impact the sphere swells to its full size and swallows the ring (board 5 draws the sphere
       as the O: T'S G●), and the O switches off inside it.
     · the tail: each letter follows the letter ahead of it (the O first, then G, S, ’, T, E, L, ?, Y, D, A, E, R) with a delay
       and a smaller swing, as a chain trailing off to the O's left: a whip-like wave through the words, forward and back.
     · the whip: after frame 5, T'S G fly off to the left one after another (T first, the G last and fastest, like a whip's
       tip), rising and turning as the wave passes, as the camera carries on to the pipes. */
  const kW = WD * tv(F45) / 540, Oc = h4.at(1679.5, 470.5, WD);
  const T_UP = [14.3, 15.28], T_SL = [15.28, 15.58], SL_K = 2.6, W_SP = 2 * Math.PI / 0.32, S_SP = 18, V_IMP = SL_K / (T_SL[1] - T_SL[0]);
  const pO = t => t <= T_UP[0] ? 0 : t < T_UP[1] ? 0.5 - 0.5 * Math.cos(Math.PI * (t - T_UP[0]) / (T_UP[1] - T_UP[0]))
    : t < T_SL[1] ? 1 - ((t - T_SL[0]) / (T_SL[1] - T_SL[0])) ** SL_K : -(V_IMP / W_SP) * Math.exp(-S_SP * (t - T_SL[1])) * Math.sin(W_SP * (t - T_SL[1]));
  // (review fix, 2026-09-28: the O used to slide left to the frame's centre as it came at the camera while the G and S, spreading
  //  out from the centre, went right: it crossed them ("LET'S●G"), and its white face merged with the white S and G behind it.
  //  Now the O swells about a point BETA of the way to its left edge (it grows rightward, clear of the G) and rises to the
  //  frame's middle height (PK_Y); at the peak it sits right of centre, nearly filling the frame's height, with the tail
  //  streaming off to its left (see "the tail" below).)
  const D_PK = 4.5, PK_Y = 520, BETA = 0.4, HW_O = 66;                     // HW_O: the O's half width on board 4 (px)
  const hwScr = (B, hw, z) => hw * kW / (z * B.tv) * 540;                   // a board-4 half width → screen px at depth z
  const flyO = (t, R, p) => { const B = camB(t), [sx, sy, z] = proj(B, R), k = Math.pow(z / D_PK, p);
    return unproj(B, sx + BETA * (k - 1) * hwScr(B, HW_O, z), sy + (PK_Y - sy) * p, z / k); };
  // the sphere (and the O's mid-thickness): rests in the O (Omid) until the flight carries it; from 15.75 its rest point runs
  // on along route A (sDr: from rest at 15.75, through M5 at 15.9 at V5B u/s), so it never stops once the spring settles
  const Omid = Oc.clone().addScaledVector(B45.f, TH / 2), V5B = 3.0, sDr = t => sA.M5 + V5B * (t - 15.9) + 0.5 * (V5B / 0.15) * (t - 15.9) ** 2;
  const restRef = t => t >= 15.75 ? A.at(sDr(t)) : Omid.clone().lerp(A.at(sDr(15.75)), sm((t - 14.9) / 0.5));
  const oQ = t => flyO(t, restRef(t), pO(t));                              // the O's mid-thickness
  // the sphere rides in the O's counter; it arrives there from behind the O (review: it used to scale up from nothing in place):
  // it rushes forward through the hole from POP_D deeper, along the ray through the O, as it grows to the counter's size
  const POP_D = 5, popE3 = u => 1 - (1 - u) ** 3;
  const ballQ = t => { const q = oQ(t), u = (t - T_POP[0]) / (T_POP[1] - T_POP[0] + 0.08); if (u >= 1) return q;
    const B = camB(t); return q.addScaledVector(q.clone().sub(B.p).normalize(), POP_D * (1 - popE3(Math.max(0, u)))); };
  // its size: pops into the counter just after frame 4's key, then swells to full size on the slam's impact (it swallows the ring)
  const SC_C = 0.445, T_POP = [14.2, 14.46], T_SW = [T_SL[1] + 0.005, T_SL[1] + 0.19];
  const popE = gsap.parseEase('back.out(1.3)'), swE = gsap.parseEase('power2.out'), cl01 = x => Math.min(1, Math.max(0, x));
  const ballSc = t => t < T_SW[0] ? SC_C * Math.max(0.001, popE(cl01((t - T_POP[0]) / (T_POP[1] - T_POP[0])))) : SC_C + (1 - SC_C) * swE(cl01((t - T_SW[0]) / (T_SW[1] - T_SW[0])));
  // the O fades as the sphere swells over it (review: its rim showed for ~2 frames as a thin white halo round the growing
  // sphere at 15.63); by O_OFF[1] the sphere is ~0.87 of its full size and covers where the O was
  const O_OFF = [T_SL[1] + 0.005, T_SL[1] + 0.1];
  // (review fix: more leftward travel, a flatter rise and a sharper final snap, so it reads as a whip cracking off to the left
  //  rather than "up and away" under the camera's crane)
  const WH = { 8: [15.93, 0.42, 1500], 9: [15.96, 0.4, 1600], 10: [15.99, 0.38, 1750], 11: [16.02, 0.36, 1900] };   // the whip: start, duration, px left
  const whip = i => { const [a, d, w] = WH[i], b = a + d; return { x: [[a, 0], [b, -w, 'power4.in']], y: [[a, 0], [a + 0.45 * d, -55, 'sine.inOut'], [b, 15, 'sine.inOut']], r: [[a, 0], [a + 0.45 * d, 12, 'sine.inOut'], [b, 38, 'power2.in']], op: [[b - 0.03, 1], [b, 0]] }; };
  const letterKeys = i => i <= 7 ? { op: [[15.98, 1], [16.0, 0]] }       // READY? LE: switched off once the push has carried them out of frame
    : i <= 10 ? whip(i)
    : i === 11 ? { ...whip(11), op: [[15.8, 1], [15.88, 0]] }              // the white G hands over to its tinted twin (which whips)
    : { op: [[O_OFF[0], 1], [O_OFF[1], 0]] };                              // the O: flown below
  const letters = GL.map(([ch, x, y], i) => ({ ch, at: [x, y], c: 12 - i, pc: still(PC({ hold: 4, shape: SH.rr(2, 2, 0), at: [x, y], depth: WD, thick: TH, grad: '#ffffff', drift: 0, flat: false,
    in: { type: 'fly', t: [13.25 + 0.025 * i, 13.8 + 0.025 * i], dz: 12 }, keys: letterKeys(i) })) }));
  // board 5's G fades from white (left) to violet (right): a tinted twin just in front fades in once the G has landed from the
  // tail; the white G then hides (white at its left edge, fading to a translucent lavender at its right so the smear shows through)
  const gTwin = PC({ hold: 4, shape: SH.rr(2, 2, 0), at: [1551, 470.5], depth: WD - 0.03, thick: TH, drift: 0, flat: false, keys: { ...whip(11), op: [[15.62, 0], [15.8, 1], ...whip(11).op] } });
  // (review fix: it turned a washed-out translucent grey as it whipped off; it now firms up to opaque lavender as the whip starts)
  const gSolid = { value: 0 };
  gTwin.mesh.material = new THREE.ShaderMaterial({ uniforms: { op: gTwin.mesh.material.uniforms.op, solid: gSolid }, transparent: true, depthWrite: false, vertexShader: GLV,
    fragmentShader: 'uniform float op, solid;\nvarying vec3 vO;\n#include <logdepthbuf_pars_fragment>\nvoid main() { float k = smoothstep(-70.0, 30.0, vO.x); gl_FragColor = vec4(mix(vec3(1.0), vec3(0.8, 0.68, 1.0), k), op * mix(1.0, mix(0.22, 1.0, solid), k));\n#include <logdepthbuf_fragment>\n}' });
  anim(t => { gSolid.value = sm((t - WH[11][0]) / 0.12); });
  letters.push({ ch: 'G', at: [1551, 470.5], c: 1, pc: gTwin });
  // board 5's smear behind G-O (the O turning into the sphere): orange → pink → violet, behind the sphere; shows as the O lands
  const SMEAR = { hold: 5, shape: SH.rr(549, 275, 137.5), at: [878.5, 453.5], in: { type: 'fade', t: [T_SL[1] - 0.03, T_SL[1] + 0.17] }, out: { type: 'fade', t: [15.98, 16.2] } };
  // (depth 23.2, was 20: the slam's overshoot carries the O and the sphere up to ~4 units deeper than their rest, and they must
  //  stay in front of it; it still covers board 5's smear exactly at the key, and sits just in front of the gate bars' depth)
  PC({ ...SMEAR, depth: 23.2, thick: 0, drift: 0, grad: { cols: ['#3c12bc', '#b43ca8', '#ec4a8b'], from: [720, 453], to: [940, 453] } });   // violet → magenta → pink
  glow({ ...SMEAR, depth: 23.15 }, '#ff8a06', [870 - 878.5, 453.5 - 330], 190, 1.0);                                                    // orange along its top right
  // fly the O and the tail. A letter's anchor is its front face (the body runs back TH·sz along its own −z), so the flight
  // point is its mid-thickness; the letters thicken as they come (sz), and turn a little on the way, face-on at rest and at the peak
  // (review fix, 2026-09-28, the tail: each letter used to come straight at the lens, spreading out from the frame's centre, so
  //  the G and S went right while the O went left, and the stagger was hard to tell from the camera's push. Now the words are a
  //  CHAIN behind the O: each letter keeps its rest gap to the letter ahead of it (on its right), the gap and both letters
  //  growing with their own zoom, so the line never crosses or piles up and trails off to the O's left as it comes; each
  //  letter follows the one ahead DEL later with a smaller swing (AMP), and the O's rise runs down the chain, fading (LAM),
  //  so the tail bends like a whip. A letter's zoom is its depth: z / zz, as for the O. The letters behind the O take a faint
  //  lilac tint the further they sit behind it (TINT at most), so its white face stays separate from theirs.)
  { const qx = new THREE.Quaternion(), qy = new THREE.Quaternion(), Xax = new Vec(1, 0, 0), Yax = new Vec(0, 1, 0), zL = new Vec(), zB = new Vec();
    const AMP = c => 0.5 * Math.pow(0.82, c - 1), DEL = c => 0.07 * c, LIFT = 45, LAM = 0.72, TINT = 0.16, LILAC = new Vec(0.66, 0.55, 1.0), WHITE = new Vec(1, 1, 1);
    const pose = (me, Q, p, a, turn) => { const sz = 1 + 2.2 * Math.max(0, p), k = Math.sin(Math.PI * Math.min(1, Math.max(0, p / a)));
      me.quaternion.multiply(qy.setFromAxisAngle(Yax, turn * k)).multiply(qx.setFromAxisAngle(Xax, -0.12 * k));
      me.scale.z *= sz; zL.set(0, 0, 1).applyQuaternion(me.quaternion);
      me.position.copy(Q).addScaledVector(zL, TH * sz / 2); };
    const byC = []; for (const Lt of letters) if (!byC[Lt.c]) byC[Lt.c] = Lt;  // one per link (the G's twin shares the white G's place)
    const hwOf = c => { if (c === 0) return HW_O; const g = byC[c].pc.mesh.geometry; if (!g.boundingBox) g.computeBoundingBox(); return (g.boundingBox.max.x - g.boundingBox.min.x) / 2; };
    const restOf = (c, t) => { if (c === 0) return restRef(t); const ps = byC[c].pc.poseAt(t); return ps.p.clone().addScaledVector(zB.set(0, 0, -1).applyQuaternion(ps.q), TH / 2); };
    const tintOf = (Lt, a) => { const u = Lt.pc.mesh.material.uniforms; if (!u.c0) return; const col = WHITE.clone().lerp(LILAC, a);
      for (const k of ['0', '1', '2']) { u['c' + k].value.copy(col); u['p' + k].value.copy(col); } Lt.tint = a; };
    const NC = 12, S = [], K = [], P = [], X = [], Y = [];
    anim(t => { if (t <= T_UP[0] || t >= 16.3) { for (const Lt of letters) if (Lt.tint) tintOf(Lt, 0); return; }
      const B = camB(t);
      for (let c = 0; c <= NC; c++) { S[c] = proj(B, restOf(c, t)); P[c] = c === 0 ? pO(t) : AMP(c) * pO(t - DEL(c)); K[c] = Math.pow(S[c][2] / D_PK, P[c]); }
      const hs = c => hwScr(B, hwOf(c), S[c][2]);
      X[0] = S[0][0] + BETA * (K[0] - 1) * hs(0); Y[0] = S[0][1] + (PK_Y - S[0][1]) * P[0];   // (= flyO: the O)
      for (let c = 1; c <= NC; c++) { const gap = (S[c - 1][0] - hs(c - 1)) - (S[c][0] + hs(c));
        X[c] = X[c - 1] - hs(c - 1) * K[c - 1] - gap * (K[c - 1] + K[c]) / 2 - hs(c) * K[c];
        Y[c] = S[c][1] + (Y[0] - S[0][1]) * Math.pow(LAM, c) - LIFT * P[c] / AMP(c); }
      for (const Lt of letters) { const me = Lt.pc.mesh; if (!me.visible) continue; const c = Lt.c;
        if (c === 0) { if (t < O_OFF[1]) pose(me, oQ(t), P[0], 1, 0.33); continue; }
        tintOf(Lt, TINT * Math.min(1, Math.max(0, 1 - K[c] / K[0])));
        if (Math.abs(P[c]) < 1e-5 && Math.abs(X[c] - S[c][0]) < 0.05) continue;
        pose(me, unproj(B, X[c], Y[c], S[c][2] / K[c]), P[c], AMP(c), -0.28); } }); }
  // trace each glyph from a canvas (marching squares on alpha, iso 0.5) into THREE.Shapes with holes, then extrude it
  const traceGlyph = (ch, fam) => {
    const F = 420, k = FB / F, pad = 6, c = document.createElement('canvas'), g = c.getContext('2d', { willReadFrequently: true }), font = `800 ${F}px ${fam}`;
    g.font = font; const m = g.measureText(ch);
    const W = Math.ceil(m.actualBoundingBoxLeft + m.actualBoundingBoxRight) + 2 * pad, H = Math.ceil(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) + 2 * pad;
    c.width = W; c.height = H; g.font = font; g.fillStyle = '#fff'; g.textBaseline = 'alphabetic';
    g.fillText(ch, pad + m.actualBoundingBoxLeft, pad + m.actualBoundingBoxAscent);
    const d = g.getImageData(0, 0, W, H).data, a = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) a[i] = d[i * 4 + 3] / 255;
    const pt = new Map(), link = new Map(), segs = [];
    const ep = (key, x0, y0, x1, y1) => { if (!pt.has(key)) { const v0 = a[y0 * W + x0], v1 = a[y1 * W + x1], t = (0.5 - v0) / (v1 - v0); pt.set(key, [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]); } return key; };
    const sg = (p, q) => { const i = segs.length; segs.push([p, q]); for (const e of [p, q]) { const l = link.get(e); if (l) l.push(i); else link.set(e, [i]); } };
    for (let y = 0; y < H - 1; y++) for (let x = 0; x < W - 1; x++) {
      const vtl = a[y * W + x], vtr = a[y * W + x + 1], vbr = a[(y + 1) * W + x + 1], vbl = a[(y + 1) * W + x];
      const cs = (vtl >= 0.5) * 8 + (vtr >= 0.5) * 4 + (vbr >= 0.5) * 2 + (vbl >= 0.5);
      if (cs === 0 || cs === 15) continue;
      const T = () => ep(2 * (y * W + x), x, y, x + 1, y), B = () => ep(2 * ((y + 1) * W + x), x, y + 1, x + 1, y + 1),
        Lf = () => ep(2 * (y * W + x) + 1, x, y, x, y + 1), R = () => ep(2 * (y * W + x + 1) + 1, x + 1, y, x + 1, y + 1);
      const mid = (vtl + vtr + vbr + vbl) / 4 >= 0.5;
      switch (cs) {
        case 1: case 14: sg(Lf(), B()); break;
        case 2: case 13: sg(B(), R()); break;
        case 3: case 12: sg(Lf(), R()); break;
        case 4: case 11: sg(T(), R()); break;
        case 6: case 9: sg(T(), B()); break;
        case 7: case 8: sg(Lf(), T()); break;
        case 5: if (mid) { sg(Lf(), T()); sg(B(), R()); } else { sg(Lf(), B()); sg(T(), R()); } break;
        case 10: if (mid) { sg(T(), R()); sg(Lf(), B()); } else { sg(Lf(), T()); sg(B(), R()); } break;
      }
    }
    const used = new Uint8Array(segs.length), loops = [];
    for (let s0 = 0; s0 < segs.length; s0++) {
      if (used[s0]) continue;
      const loop = []; let s = s0, from = segs[s0][0];
      for (;;) { used[s] = 1; const [p, q] = segs[s], to = p === from ? q : p; loop.push(pt.get(to)); const nx = link.get(to).find(i => i !== s && !used[i]); if (nx === undefined) break; s = nx; from = to; }
      if (loop.length > 8) loops.push(loop);
    }
    // simplify (Ramer–Douglas–Peucker, split at the point farthest from the start), then board px around the ink centre, y up
    const rdp = (P, eps) => { if (P.length < 3) return P; const [x0, y0] = P[0], [x1, y1] = P.at(-1), dx = x1 - x0, dy = y1 - y0, Ln = Math.hypot(dx, dy) || 1e-9; let dm = 0, im = 0;
      for (let i = 1; i < P.length - 1; i++) { const dd = Math.abs(dy * P[i][0] - dx * P[i][1] + x1 * y0 - y1 * x0) / Ln; if (dd > dm) { dm = dd; im = i; } }
      return dm > eps ? [...rdp(P.slice(0, im + 1), eps).slice(0, -1), ...rdp(P.slice(im), eps)] : [P[0], P.at(-1)]; };
    let bx0 = 1e9, by0 = 1e9, bx1 = -1e9, by1 = -1e9;
    for (const lp of loops) for (const [x, y] of lp) { bx0 = Math.min(bx0, x); bx1 = Math.max(bx1, x); by0 = Math.min(by0, y); by1 = Math.max(by1, y); }
    const cx = (bx0 + bx1) / 2, cy = (by0 + by1) / 2;
    const polys = loops.map(lp => { let far = 0, fd = 0; lp.forEach(([x, y], i) => { const dd = (x - lp[0][0]) ** 2 + (y - lp[0][1]) ** 2; if (dd > fd) { fd = dd; far = i; } });
      const P = [...rdp(lp.slice(0, far + 1), 0.3).slice(0, -1), ...rdp([...lp.slice(far), lp[0]], 0.3).slice(0, -1)];
      return P.map(([x, y]) => new THREE.Vector2((x - cx) * k, (cy - y) * k)); });
    // nesting: even depth = outline, odd = hole of the smallest outline around it
    const inside = (p, P) => { let r = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) if ((P[i].y > p.y) !== (P[j].y > p.y) && p.x < (P[j].x - P[i].x) * (p.y - P[i].y) / (P[j].y - P[i].y) + P[i].x) r = !r; return r; };
    const area = P => Math.abs(THREE.ShapeUtils.area(P));
    const depth = polys.map((P, i) => polys.filter((Q, j) => j !== i && inside(P[0], Q)).length);
    const shapes = new Map();
    polys.forEach((P, i) => { if (depth[i] % 2 === 0) shapes.set(i, new THREE.Shape(P)); });
    polys.forEach((P, i) => { if (depth[i] % 2 === 1) { const par = [...shapes.keys()].filter(j => depth[j] === depth[i] - 1 && inside(P[0], polys[j])).sort((u, v) => area(polys[u]) - area(polys[v]))[0]; if (par !== undefined) shapes.get(par).holes.push(new THREE.Path(P)); } });
    return [...shapes.values()];
  };
  V.waitFor(document.fonts.load(`800 200px "new-hero"`).then(() => {
    const fam = document.fonts.check(`800 200px "new-hero"`) ? '"new-hero"' : '"Open Sans", sans-serif';
    if (!fam.includes('hero')) console.warn('G2: New Hero did not load; the 3D letters use a fallback face');
    const thickPx = TH / kW, cache = new Map();
    // plain extrusions (revision: no per-hold flattening; they fly, so their sides show as 3D letters). Same letter, same geometry.
    for (const { ch, pc } of letters) {
      let geo = cache.get(ch);
      if (!geo) { geo = new THREE.ExtrudeGeometry(traceGlyph(ch, fam), { depth: thickPx, bevelEnabled: false, curveSegments: 1 }); geo.translate(0, 0, -thickPx); geo.computeBoundingBox(); cache.set(ch, geo); }
      pc.mesh.geometry.dispose(); pc.mesh.geometry = geo;
    }
  }));

  // ---- board 5: the gate (four thin bars fading into the pill) and the lit panel at the right; they build in during the push
  const D5 = 24;                                                           // from camera 5 (the sphere is at 16.95, the letters at 16.16)
  [0, 1, 2, 3].forEach(i => PC({ hold: 5, shape: SH.rr(31, 570, 0), at: [1412.5 + 67.7 * i, 441], depth: D5, thick: 0.25, grad: { cols: ['#e8702c', '#4c04b8', '#26085b'], from: [1412, 160], to: [1412, 720] },
    in: { type: 'slide', from: 'top', t: [15.0 + 0.04 * i, 15.5 + 0.04 * i] }, out: { type: 'slide', from: 'top', t: [15.95 + 0.04 * i, 16.35 + 0.04 * i] } }));
  const PANEL = { hold: 5, shape: SH.rr(560, 576, 0), at: [1969, 443], keys: { x: [[14.95, 700], [15.5, 0, 'expo.out'], [15.95, 0], [16.45, 1300, 'power3.in']], op: [[16.45, 1], [16.47, 0]] } };   // (fully out of frame before it switches off)
  PC({ ...PANEL, depth: D5 + 0.4, thick: 0.5, drift: 0, grad: { cols: ['#8a30aa', '#a33a88', '#c65052'], from: [1690, 443], to: [1920, 443] } });   // no drift: its glows stay on it
  glow({ ...PANEL, depth: D5 + 0.36 }, '#4800ff', [1715 - 1969, 0], 170, 0.95);     // blue glow, left middle
  glow({ ...PANEL, depth: D5 + 0.34 }, '#ff7600', [1920 - 1969, 3], 200, 1.0);      // orange glow, right edge

  /* =================== 4 → 5 → 6: the sphere comes out of the O, turns right, runs the pipes, drops out of the mouth =================== */
  const s6 = 2 * D6 * tv(F6) / 1080, X6 = h6.right.clone();
  const P6 = (px, py) => M6.clone().addScaledVector(X6, (px - 1004) * s6).addScaledVector(UP, (556 - py) * s6);   // board-6 px in the pipe plane
  // (S0: where the sphere used to wait behind the O. The sphere no longer passes it (it rides the O now), but route A starts
  //  there, so it is kept exactly as it was)
  const S0 = (() => { const C = pushOld(14.8), Oc0 = h4.at(1679.5, 470.5, 34.65), z = Oc0.z - 3.2;
    return C.clone().add(Oc0.clone().sub(C).multiplyScalar((C.z - z) / (C.z - Oc0.z))); })();
  const x0 = P6(-150, 178).x - o(0, 0, 0).x;                                 // where the channel joins the frame-6 straight (local x)
  const TR = [L(9, -2.2, 1.2), L(9 + (x0 - 9) * 0.22, -2.3, -0.6), L(9 + (x0 - 9) * 0.48, -2.35, -4.4), L(9 + (x0 - 9) * 0.75, -2.2, -5.6)];
  // (fix pass: the S's corners at TR[3] and at the join with the straight turned tighter (plan radius 1.4–2.0) than the open
  //  channel is wide (half-width 2.75), so the channel's inner wall folded over itself into spikes under the bends (review:
  //  "an orange dagger and thin blue blades" at 18.0–18.9). The route's plan is now smoothed between TR[0] and the straight
  //  (Gaussian, σ 3 units of arc, faded in and out), so its tightest bend is ~4.1; M5, TR[0] and the frame 6 pipe points
  //  stay on it (≤ 0.005 off).)
  const A = (() => { const A0 = path([S0, M5, L(0.35, 0, 1.0), L(1.6, -0.1, 1.8), L(3.6, -0.5, 2.1), L(6.2, -1.4, 1.9), ...TR, P6(-150, 178), P6(150, 178), P6(700, 178), P6(830, 181), P6(935, 232), P6(992, 325), P6(1004, 432), M6]);
    const ds = 0.1, N = Math.round(A0.L / ds), SS = Array.from({ length: N + 1 }, (_, i) => A0.at(A0.L * i / N)), sig = 3, KR = Math.ceil(3 * sig / ds);
    const out = SS.map((p, i) => { const s = A0.L * i / N, w = Math.min(sm((s - 13) / 3), 1 - sm((s - 38) / 2.5)); if (w <= 0) return p.clone();
      let X = 0, Z = 0, W = 0; for (let k = -KR; k <= KR; k++) { const j = Math.min(N, Math.max(0, i + k)), g = Math.exp(-0.5 * (k * ds / sig) ** 2); X += SS[j].x * g; Z += SS[j].z * g; W += g; }
      return new Vec(p.x + (X / W - p.x) * w, p.y, p.z + (Z / W - p.z) * w); });
    return path(out.filter((_, i) => i % 4 === 0 || i === N)); })();
  const sA = { M5: A.sOf(M5), T: A.sOf(TR[0]), J: A.sOf(P6(150, 178)), C: A.sOf(P6(700, 178)) };
  // the sphere: hidden until it pops into the O's counter just after frame 4's key; rides the O at the camera and back (ballQ,
  // ballSc); from 15.75 it runs on along route A, through board 5's spot at 15.9, and from T_HAND on it is route A's run.
  // It floats (no spin) until it lands in the channel; inside the closed bend it is out of sight and reappears in board 6's
  // painted bore just before it drops out of the mouth
  const T_REV = T_POP[0], T_HAND = 16.0;
  seg(13.2, T_REV, 'none', () => ({ p: Omid.clone(), c: 0, h: 1 }));
  seg(T_REV, T_HAND, 'none', u => { const t = T_REV + u * (T_HAND - T_REV); return { p: ballQ(t), c: 0, sc: ballSc(t) }; });
  const sBore = A.sOf(P6(1004, 385));
  // after frame 5 the channel rises into place under the sphere (see the props): it lands in the channel's shallow scoop at
  // sCt (≈16.42) and rolls, spinning, from there. The channel starts 1.5 units before the landing point.
  const sCt = A.sOf(L(2.9, -0.33, 2.06)), sC0 = sCt - 1.5;
  run(A, [{ s: sDr(T_HAND), t: T_HAND }, { s: sA.T, t: 17.0 }, { s: sA.J, t: 19.05 }, { s: sA.C, t: 19.95 }, { s: A.L, t: 20.65 }], V5B * (1 + (T_HAND - 15.9) / 0.15), 10,
    s => { const r = {}; if (s < sCt) r.c = 0; if (s > sA.C + 1.2 && s < sBore) r.h = 1; return r; });
  // drops out of the mouth, through the funnel and stem, onto frame 7's first slab
  const g6 = 22, v6 = 10, tLand = 20.65 + (-v6 + Math.sqrt(v6 * v6 + 2 * g6 * 10.7)) / g6;
  seg(20.65, tLand, 'none', u => { const tt = u * (tLand - 20.65); return { p: add3(M6, 0, -(v6 * tt + 0.5 * g6 * tt * tt), 0), c: 0 }; });
  // frame 7: rolls down the stepped path
  const B7 = path(route7);
  run(B7, [{ s: 0, t: tLand }, { s: B7.sOf(M7), t: 23.3 }, { s: B7.L, t: 25.9 }], 6.5, 8.5);

  /* =================== 7 → 8 → 9: the leap onto the pegs, the hops, the corkscrew, the ramp =================== */
  const chainIn = [[162, 42, 26.7], [305, 53, 27.08], [471, 162, 27.47], [580, 132, 27.87], [781, 226, 28.27], [868, 338, 28.666]];
  const chainOut = [[974, 312, 29.066], [1059, 424, 29.43], [1130, 517, 29.78], [1200, 626, 30.13], [1392, 712, 30.58], [1585, 828, 31.03], [1780, 912, 31.48]];
  hop(E7b, 25.9, onPeg(162, 42), 26.7, 16);
  chainIn.slice(1).forEach(([x, y, t], i) => hop(onPeg(chainIn[i][0], chainIn[i][1]), chainIn[i][2], onPeg(x, y), t, 40));
  hop3(onPeg(868, 338), 28.666, M8, 28.75, onPeg(974, 312), 29.066);         // frame 8's sphere: mid-bounce over the pegs
  chainOut.slice(1).forEach(([x, y, t], i) => hop(onPeg(chainOut[i][0], chainOut[i][1]), chainOut[i][2], onPeg(x, y), t, 40));
  const lastPeg = onPeg(1780, 912);

  // corkscrew: one turn around a post in front of the wall's bottom-right, then out onto the ramp heading D9h
  // (follow-up: the helix turns the other way (ph rises as the sphere descends), so frame 9's coil (f09.js, the same
  //  handedness) slants like board 9's slats instead of their mirror. Its post is mirrored across the exit tangent, 5.6 to
  //  the camera's left of where it was: the exit Hx and the top HX[0] (one turn straight above it) are unchanged, so the hop
  //  in, hold 9's camera solve, the ramp and everything from frame 9 on are exactly as before)
  const D9h = new Vec(0.3, 0, 1).normalize(), slope9 = Math.tan(9 * Math.PI / 180);
  const D9 = D9h.clone().addScaledVector(UP, -slope9).normalize();
  const Rh = 2.8, yTop = lastPeg.y - 2.6, yBot = yTop - 5.5;
  const phiX = Math.atan2(-D9h.x, D9h.z);                                   // exit angle: the helix tangent there is D9h
  const post0 = add3(lastPeg, 4.6, 0, 3.2);                                 // (the post before the follow-up, on the other side)
  const post = post0.clone().add(new Vec(Math.cos(phiX), 0, Math.sin(phiX)).multiplyScalar(-2 * Rh));
  const helixAt = k => { const ph = phiX - 2 * Math.PI * (1 - k); return new Vec(post.x + Rh * Math.cos(ph), yTop + (yBot - yTop) * k, post.z + Rh * Math.sin(ph)); };
  const HX = Array.from({ length: 61 }, (_, i) => helixAt(i / 60));
  const Hx = HX.at(-1);
  hop(lastPeg, 31.48, HX[0], 31.85, 30);

  // frame 9: the camera sits left of the ramp looking back up it; solve its direction so the ramp top lands on board 9's apex
  const F9 = 34, D9d = depthFor(9, F9), Lr = 17;
  const M9 = Hx.clone().addScaledVector(D9, Lr);
  const project = (pos, B, f, P) => { const d = P.clone().sub(pos), z = d.dot(B.f); return [960 + d.dot(B.r) / z / tv(f) * 540, 540 - d.dot(B.u) / z / tv(f) * 540]; };
  const cam9For = (yaw, pitch) => { const d = [Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch)], B = basis(d);
    return { d, B, pos: M9.clone().addScaledVector(ray(B, F9, 620, 670), -D9d) }; };
  let yaw = Math.atan2(-D9h.x, -D9h.z) + 0.3, pitch = 0.05;
  const apex = Hx.clone().addScaledVector(UP, -1);
  for (let it = 0; it < 30; it++) {
    const f0 = (y, p) => { const c = cam9For(y, p); return project(c.pos, c.B, F9, apex); };
    const [a, b] = f0(yaw, pitch), e = 1e-4, [ay, by] = f0(yaw + e, pitch), [ap, bp] = f0(yaw, pitch + e);
    const J = [[(ay - a) / e, (ap - a) / e], [(by - b) / e, (bp - b) / e]], ra = 255 - a, rb = 522 - b, det = J[0][0] * J[1][1] - J[0][1] * J[1][0];
    yaw += (J[1][1] * ra - J[0][1] * rb) / det * 0.7; pitch += (-J[1][0] * ra + J[0][0] * rb) / det * 0.7;
  }
  const sol9 = cam9For(yaw, pitch);
  const h9 = trim(hold(9, { t: [34.55, 35.5], tk: 35.15, pass: true, mark: M9, dir: sol9.d, fov: F9, plate: { depth: Lr + D9d + 6, in: [32.9, 33.8] } }));

  /* =================== 9 → 10: past the lens, the whip round, the long path into the ring tunnel =================== */
  // closest approach to the camera along the ramp line, then the path levels off toward the tunnel wall
  const kPass = h9.pos.clone().sub(M9).dot(D9), Pp = M9.clone().addScaledVector(D9, kPass);
  const Pv = Pp.clone().addScaledVector(D9, 4);                             // the ramp flattens out here
  const F10 = 30, D10 = depthFor(10, F10), B10 = basis(D9h.toArray());
  const lvl = Pv.y - 0.6;                                                  // path height (sphere centre)
  // put camera 10 a couple of units down-path of camera 9 (a whip round, then a short follow)
  const off10 = ray(B10, F10, 910, 874).multiplyScalar(-D10);               // camera 10 relative to its mark
  const along = h9.pos.clone().sub(Pv).dot(D9h) + 1.0;                     // camera 10's along-path position (from Pv)
  const M10 = Pv.clone().addScaledVector(D9h, along - off10.dot(D9h)); M10.y = lvl;
  const side10 = off10.dot(B10.r);
  M10.addScaledVector(B10.r, -side10 - (Pv.clone().sub(M10).dot(B10.r)));   // camera 10 straight above the path line
  // (revision: an ease-through at 39.9 (was a still hold 39.45–40.45, key 40.35). The key comes 0.45 s earlier so the chase
  //  into the tunnel after it has time to reach the 41.4 hand-over (see "10 → 11" below); the camera glides into frame 10's
  //  pose pushing gently toward the tunnel and never stops)
  const h10 = trim(hold(10, { t: [39.45, 40.25], tk: 39.9, pass: true, mark: M10, dir: D9h.toArray(), fov: F10, plate: { depth: D10 + 1.6, in: [36.55, 37.5] } }));

  // (revision: the route runs on straight into the tunnel, 24 past M10 (was 10), so the sphere rolls on in the tube to the cut)
  const C9 = path([Hx, M9, Pp, Pv, add3(Pv, 0, 0, 0).addScaledVector(D9h, 6).setY(lvl + 0.05), M10.clone().addScaledVector(D9h, -12), M10, M10.clone().addScaledVector(D9h, 10), M10.clone().addScaledVector(D9h, 24)]);
  const helixP = path(HX);
  run(helixP, [{ s: 0, t: 31.85 }, { s: helixP.L, t: 33.25 }], 9, 10.5);
  // THE 41.4 CONTRACT (G2 → G3): the sphere is never hidden now. It rolls through board 10's spot at the key and on into the
  // ring's tunnel, lit against its dark, arriving at 41.4 S_END past M10 at V_END u/s, straight along the tunnel's axis
  // (camera 10's view, D9h); the camera follows it in and sits 3 behind it (see "10 → 11" below). Its segs end at the cut.
  // (polish, 2026-09-29: the backlog's "G2's sphere path runs ~0.12 s past the 41.4 cut" no longer reproduced: the sphere
  //  table was G3's from its first sample after 41.4 (41.404). But the cut instant itself was G2's, because the engine
  //  gives the instant at a seg's end to that seg (v2.js: segs.find(s => t <= s.t1)) while the camera there is G3's: one
  //  240 Hz sample, in the dip's full dark (41.25–41.55), yet every 25/30/60 fps plate export (no dip) has a frame on
  //  exactly 41.4, and it showed no sphere. seg() above now ends the engine's copy of this last seg CUT_EPS before 41.4,
  //  eased so every earlier sample is the same, so 41.4 is G3's (its sphere 3 in front of G3's camera). The engine carries
  //  the plain roll across the cut, so that roll comes out 0.65° different from 41.4 on; the face-at-the-keys pass (v2.js
  //  faceKeys) refits the drawn orientation at every key after this hidden cut, so the drawn sphere after 41.4 is the same
  //  (a few millionths of a degree). Without faceKeys this hand-over would turn the sphere's bands 0.65° for the rest of
  //  the piece. The leftover: across a jump the engine draws the nearest table sample, so for half a table step on one side
  //  of the cut the sphere and the camera belong to different groups. That half step is now 41.3979–41.4 (G2's camera,
  //  G3's sphere) instead of 41.4–41.4021, so it no longer holds the cut instant. No 1× export frame falls in it; a handful
  //  of 24 fps exports at ¼, 1¼ or 1¾ speed land one frame on 41.3979 exactly (the dip covers it in a full video). Ending
  //  it needs v2.js (ballAt choosing the side of a jump by the cut time, as camAt does).)
  const S_END = 14.2, V_END = 9.3;
  run(C9, [{ s: 0, t: 33.25 }, { s: C9.sOf(M9), t: 35.15 }, { s: C9.sOf(Pp), t: 36.15 }, { s: C9.sOf(M10), t: h10.tk }, { s: C9.sOf(M10) + S_END, t: 41.4 }], 10.5, V_END);

  /* =================== props =================== */
  let pipe6 = null;
  // 5 → 6 · the aerial pipes, in board 6's pipe style: a chamfered square section whose sides carry board 6's three bands
  // (a coral → orange → violet top lip, a body running violet → pink → orange → mauve → violet along its length, a pink →
  // violet bottom lip); the lip colour runs over the chamfers and rims, so from above each pipe is an orange-edged band.
  // The sphere's channel is open on top (seen from the crane). It starts in a shallow, flared scoop and rises into place
  // under the sphere right after frame 5, so the sphere lands in it and rolls; it runs into a closed pipe through a dark
  // mouth (the "entrance to the pipe" the camera orbits to reveal) that bends down to board 6's mouth, lined up with the
  // painted pipe so the frame 6 plate takes over cleanly. Three more pipes cross at other heights.
  {
    const W = 2.75, b = 1.15, top = 1.5, bot = -4.0, fl = -1.0, ct = 1.09, cbv = 0.97;
    // colours spaced so they cycle violet → pink → orange along the aerial run and land in board 6's order at the plate hand-off;
    // locked to the hand-off instant, and calmed (partner drift ≤ 25%) so the pipes stay vivid
    const lockM = (m, tk, k = 2) => { const u = m.uniforms; u.per.value = tk / (0.8 * k); u.ph.value = (Math.PI - 2 * Math.PI * tk / u.per.value) / 2; for (const c of ['0', '1', '2']) u['p' + c].value.lerp(u['c' + c].value, 0.5); return m; };
    const back = (a, bb, n) => [a.clone().addScaledVector(X6, -2 * n * a.distanceTo(bb)), a.clone().addScaledVector(X6, -(2 * n - 1) * a.distanceTo(bb))];   // the same colours, n whole cycles earlier (world gradients clamp before their start)
    const mBody = lockM(gm(['#6a08f8', '#e44a93', '#f7701c'], ...back(P6(60, 263), P6(480, 263), 3)), 20.3);   // (cycles reach back past the scoop)
    const mLipT = lockM(gm(['#ff5c4b', '#ff8a10', '#a040b0'], ...back(P6(80, 112), P6(720, 112), 2)), 20.3);
    const mLipB = lockM(gm(['#ff4e72', '#c040b0', '#6617fe'], ...back(P6(60, 417), P6(780, 417), 2)), 20.3);
    const mBend = lockM(gm(['#ffa300', '#ef5a70', '#4401ff'], P6(880, 100), P6(1190, 520)), 20.3);
    const mIn = gm(['#1c0a52', '#3a0cb0'], L(8, 0, 0), P6(700, 263)), mDark = mat(['#0c0424'], { flat: true, side: THREE.DoubleSide });
    // the open channel (section relative to the sphere's path: its floor is 1 below the sphere's centre). Its first SCOOP
    // units are a shallow, flared scoop (lips at the sphere's middle, a wider slot) that deepens to board 6's section, so
    // the sphere is seen landing in it from the low camera just after frame 5
    const SCOOP = 11, cp = A.pts(sC0, sA.C, 240), dS = (sA.C - sC0) / (cp.length - 1);
    const sec = i => { const m = 1 - sm(i * dS / SCOOP); return { W: W + 0.35 * m, b: b + 0.45 * m, top: top - 1.9 * m }; };
    const sp = f => i => f(sec(i));
    // (every outline runs counter-clockwise in the section's across/up plane, so the faces' normals point outward)
    const chan = [mesh(sweep(cp, [{ p: sp(q => [[-q.W, q.top - ct], [-q.W, bot + cbv]]) }, { p: sp(q => [[q.W, bot + cbv], [q.W, q.top - ct]]) }]), mBody),
      mesh(sweep(cp, [{ p: sp(q => [[-q.b, q.top], [-(q.W - ct), q.top], [-q.W, q.top - ct]]) }, { p: sp(q => [[q.W, q.top - ct], [q.W - ct, q.top], [q.b, q.top]]) }]), mLipT),
      mesh(sweep(cp, [{ p: sp(q => [[-q.W, bot + cbv], [-(q.W - cbv), bot], [q.W - cbv, bot], [q.W, bot + cbv]]) }]), mLipB),
      mesh(sweep(cp, [{ p: sp(q => [[q.b, q.top], [q.b, fl], [-q.b, fl], [-q.b, q.top]]) }]), mIn)];
    // its start cap in the lip colours (orange rim → pink → violet base), not one flat body colour
    { const q = sec(0), uCap = new THREE.Shape(), F0 = frames(cp)[0];
      [[-q.W, bot + cbv], [-q.W, q.top - ct], [-(q.W - ct), q.top], [-q.b, q.top], [-q.b, fl], [q.b, fl], [q.b, q.top], [q.W - ct, q.top], [q.W, q.top - ct], [q.W, bot + cbv], [q.W - cbv, bot], [-(q.W - cbv), bot]]
        .forEach(([x, y], i) => i ? uCap.lineTo(x, y) : uCap.moveTo(x, y));
      chan.push(mesh(capAt(cp, 0, uCap), gm(['#ff8a10', '#ff4f7b', '#6a08f8'], cp[0].clone().addScaledVector(F0.Y, q.top), cp[0].clone().addScaledVector(F0.Y, bot)))); }
    // the pipe entrance: a dark mouth where the open channel runs into the closed pipe (the sphere rolls into it)
    chan.push(mesh(capAt(cp, cp.length - 1, rectShape(-b - 0.02, fl - 0.02, b + 0.02, top + 0.02)), mDark));
    // the closed pipe on its centreline: straight → quarter bend → down to board 6's flat mouth
    const Bc = P6(820, 447), rC = 184 * s6, cl = [P6(700, 263)];               // the arc's top (Bc + rC·up) is level with the straight: no crack at the joint
    for (let i = 0; i <= 24; i++) { const a = Math.PI / 2 * i / 24; cl.push(Bc.clone().addScaledVector(X6, rC * Math.sin(a)).addScaledVector(UP, rC * Math.cos(a))); }
    cl.push(P6(1004, 520), P6(1004, 550));
    const clP = path(cl), cpts = clP.pts(0, clP.L, 90);
    const oct = (w, h, t1, t2) => ({ sides: [{ p: [[-w, h - t1], [-w, -h + t2]] }, { p: [[w, -h + t2], [w, h - t1]] }], lipT: [{ p: [[w, h - t1], [w - t1, h], [-w + t1, h], [-w, h - t1]] }],
      lipB: [{ p: [[-w, -h + t2], [-w + t2, -h], [w - t2, -h], [w, -h + t2]] }],
      shape: hole => { const sh = new THREE.Shape(); [[-w, -h + t2], [-w, h - t1], [-w + t1, h], [w - t1, h], [w, h - t1], [w, -h + t2], [w - t2, -h], [-w + t2, -h]].forEach(([x, y], i) => i ? sh.lineTo(x, y) : sh.moveTo(x, y));
        if (hole) { const hp = new THREE.Path(); hp.moveTo(-hole, -hole); hp.lineTo(-hole, hole); hp.lineTo(hole, hole); hp.lineTo(hole, -hole); hp.lineTo(-hole, -hole); sh.holes.push(hp); } return sh; } });
    const O6 = oct(W, W, ct, cbv);
    // its walls and underside start 0.25 back inside the channel's (same materials, so the overlap can't flicker): no hairline
    // seam at the joint; its top (a different colour from the channel's lips) starts exactly at the joint
    const cptsO = [cpts[0].clone().addScaledVector(X6, -0.25), ...cpts];
    chan.push(mesh(sweep(cptsO, O6.sides), mBody), mesh(sweep(cpts, O6.lipT), mBend), mesh(sweep(cptsO, O6.lipB), mLipB));
    const mouth = [mesh(capAt(cpts, cpts.length - 1, O6.shape(b)), mLipB), mesh(capAt(cpts.map(q => q.clone().add(new Vec(0, 0.35, 0))), cpts.length - 1, rectShape(-b, -b, b, b)), mDark)];
    prop([...chan, ...mouth], [15.0, 15.1, 20.28, 20.42]);                   // solid before it rises into view; the painted pipe takes over at the hold
    // right after frame 5 it rises into place from below (well out of frame until then) and settles just before the sphere lands
    { const e = gsap.parseEase('power2.out'), RC = [16.0, 16.4];            // (at 16.1 it is still ≥ 2.6 below frame 5's bottom edge)
      anim(t => { const dy = -11 * (1 - e(Math.min(1, Math.max(0, (t - RC[0]) / (RC[1] - RC[0]))))); for (const me of [...chan, ...mouth]) me.position.y = dy; }); }
    // three more pipes in the same style, at other heights (parallax from the crane); gone before the orbit to frame 6
    // (fix pass: their legs run down to y −150; from the steep aerial they converged to bright points, which read as spikes
    //  hanging under the channel (review: "an orange dagger and thin blue blades", 18.0–18.9). Below its run each pipe now
    //  fades out into the background over ~12 units, so the legs read as dropping away into the dark. The pipes are drawn
    //  as transparent for that (their fade in and out is handled below, not by prop(), which makes them opaque when full).)
    const sink = (m, yRun) => { m.uniforms.sinkY = { value: new THREE.Vector2(yRun - 1.5, yRun - 13) };
      const fs = m.fragmentShader.replace('void main()', 'uniform vec2 sinkY;\nvoid main()').replace('gl_FragColor = vec4(col * shade, op);', 'gl_FragColor = vec4(col * shade, op * smoothstep(sinkY.y, sinkY.x, vO.y));');
      if (!fs.includes('uniform vec2 sinkY') || !fs.includes('op * smoothstep(sinkY.y')) throw new Error('G2: engine shader changed; the pipe legs could not be faded'); m.fragmentShader = fs; m.needsUpdate = true; return m; };
    const pipe = (pts, w, t1, t2, cols, a0, a1) => { const P = path(pts), q = P.pts(0, P.L, Math.ceil(P.L * 6)), S = oct(w, w, t1, t2), yRun = Math.max(...pts.map(p => p.y));
      const mm = [sink(lockM(gm(cols.body, a0, a1), 18.2), yRun), sink(lockM(gm(cols.lipT, a0, a1), 18.2), yRun), sink(lockM(gm(cols.lipB, a0, a1), 18.2), yRun)];
      return [mesh(sweep(q, S.sides), mm[0]), mesh(sweep(q, S.lipT), mm[1]), mesh(sweep(q, S.lipB), mm[2]), mesh(capAt(q, 0, S.shape()), mm[0]), mesh(capAt(q, q.length - 1, S.shape()), mm[0])]; };
    const bendPts = (a, c, bb, n = 10) => { const out = []; for (let i = 0; i <= n; i++) { const k = i / n, u1 = a.clone().lerp(c, k), u2 = c.clone().lerp(bb, k); out.push(u1.lerp(u2, k)); } return out; };   // rounded corner a → (c) → b
    const decoSets = [
      // a sibling run behind the channel that turns down into the dark
      pipe([L(-8, -3.4, -13), L(24, -3.4, -13), ...bendPts(L(28, -3.4, -13), L(33, -3.4, -13), L(33, -8.4, -13)), L(33, -150, -13)], 1.9, 0.75, 0.65,
        { body: ['#d10cf0', '#ff4f7b', '#7b2bf9'], lipT: ['#ffa800', '#ff5c4b', '#ff7a00'], lipB: ['#ff4e72', '#b52bf0', '#6617fe'] }, L(0, 0, -13), L(14, 0, -13)),
      // a pipe crossing under the channel (it rises from below, runs across, and drops away again)
      pipe([L(14.5, -150, 17), ...bendPts(L(14.5, -13, 17), L(14.5, -8.6, 17), L(14.5, -8.6, 12.6)), ...bendPts(L(14.5, -8.6, -16), L(14.5, -8.6, -20.4), L(14.5, -13, -20.4)), L(14.5, -150, -20.4)], 1.6, 0.6, 0.55,
        { body: ['#ff7a00', '#ff4f7b', '#d10cf0'], lipT: ['#ffa300', '#ff9a1a', '#ff4f7b'], lipB: ['#ff4f7b', '#d10cf0', '#7b2bf9'] }, L(14.5, -8, 12), L(14.5, -8, -4)),
      // a bridge the sphere rolls under
      pipe([L(17.5, -150, 1.2), ...bendPts(L(17.5, -1.5, 1.2), L(17.5, 1.7, 1.2), L(17.5, 1.7, -2.0)), ...bendPts(L(17.5, 1.7, -7.8), L(17.5, 1.7, -11), L(17.5, -1.5, -11)), L(17.5, -150, -11)], 1.2, 0.45, 0.4,
        { body: ['#7b2bf9', '#d10cf0', '#ff4f7b'], lipT: ['#ff7a00', '#ffa800', '#ff5c4b'], lipB: ['#b52bf0', '#6617fe', '#4b00ff'] }, L(17.5, 0, 2.5), L(17.5, 0, -12.5)),   // (gradient along its span: a vertical one striped its long legs)
    ];
    // they rise into place from below as frame 5's set leaves (the next builds in while the old leaves)
    const rise = gsap.parseEase('power3.out'), RISE = [[16.15, 16.8], [16.25, 16.9], [16.35, 17.0]];
    anim(t => decoSets.forEach((set, i) => { const [a, bb] = RISE[i], dy = -26 * (1 - rise(Math.min(1, Math.max(0, (t - a) / (bb - a))))); for (const me of set) me.position.y = dy; }));
    anim(t => { const a = Math.min(sm((t - 15.0) / 0.1), 1 - sm((t - 19.0) / 0.5));   // (was prop(…, [15.0, 15.1, 19.0, 19.5]))
      for (const me of decoSets.flat()) { me.visible = a > 0.01; const m = me.material; m.uniforms.op.value = a; m.transparent = true; m.depthWrite = a >= 0.995; } });
    pipe6 = { meshes: [...chan, ...mouth], fade: fades.find(f => f.list.includes(mouth[0])), mats: { mBody, mLipT, mLipB, mBend, mIn, mDark }, oct, O6, dims: { W, b, top, bot, fl, ct, cbv }, cpts };   // frame 6's closed pipe and mouth (f06 may take them over)
  }
  // frames 6–10: each frame's set lives in its own file (groups/g2/f06.js … f10.js), called here in frame order with the shared
  // context (holds, marks, routes, helpers). The journey (holds, sphere routes, camera keys, captions) stays in this file.
  { Object.assign(HH, { 6: h6, 7: h7, 8: h8, 9: h9, 10: h10 });
    const C = { V, THREE, Vec, UP, L, tv, sm, add3, path, frames, sweep, capAt, rectShape, gm, mesh, prop, fades, PC, flatFor, flatGeo, lock, calm, glow, still, hexV3, SH, HH,
      h4, h5, h6, h7, h8, h9, h10, M5, M6, M7, M8, M9, M10, F6, D6, F7, D7, F8, D8, F9, D9d, F10, D10,
      P6, s6, X6, pipe6, A, sA, route7, r7, B7, E7b, PEGS, onPeg, lastPeg, post, Rh, yTop, yBot, HX, Hx, helixP, D9h, D9, apex, Pp, Pv, lvl, B10, C9 };
    for (const f of [f06, f07, f08, f09, f10]) f(V, C); }

  /* =================== camera keys between the holds =================== */
  const c5 = h5.pos, c6 = h6.pos, c7 = h7.pos, c8 = h8.pos, c9 = h9.pos, c10 = h10.pos;
  // 13.2 → 4 → 5 → the crane: ONE smooth camera curve (cam45), no stop at frame 4 or 5, laid as dense keys every 0.025 s
  // (frames 4's and 5's own pass-through keys sit at 14.2 and 15.9).
  // MOVING FROM THE REVEAL (polish, 2026-09-29: "Moving from the first frame of a reveal … Give [it] a non-zero start
  // velocity"): cam45 leaves 13.2 already pushing at V0 along the push line, but the engine gives the first key of a shot
  // no velocity (v2.js, the shots' tangents: j === 0), so the first 0.025 s span still started from rest and caught up with
  // a surge (camprobe: 0 → 3.6 → 2.7 u/s over 13.2–13.225). START_DT lays extra keys on the same curve, finely spaced at
  // the start (0.5, 1, 2, 4 ms apart, then the 0.025 s grid), so that rest lasts half a millisecond: from the first frame
  // after the cut the camera is on cam45, moving at V0 in the direction it is about to go. Every key is still ON cam45.
  const START_DT = [0.0005, 0.0015, 0.0035, 0.0075];
  for (const t of [...START_DT.map(d => 13.2 + d), ...Array.from({ length: Math.ceil((K1.t - 0.02 - 13.2) / 0.025) }, (_, k) => +(13.2 + 0.025 * k).toFixed(4))].sort((a, b) => a - b)) {
    if (t >= K1.t - 0.02 || Math.abs(t - h4.tk) < 0.01 || Math.abs(t - h5.tk) < 0.01) continue;
    const c = cam45(t); key(t, c.p, c.l, { f: c.f, fov: c.fov }); }
  // 5 → 6: truck right with the sphere, swing in behind it and crane up over the pipes, then descend and orbit to the side
  // (review: the aerial was a close, 65° shot of a tangle of pipes; it now climbs to a steep ~75° aerial high enough to read
  // the layout, drifts there for half a second, then descends to the sphere and orbits to the pipe's entrance)
  key(16.55, add3(c5, 3.2, 4.6, -1.5), L(5, -2.0, 0.5), { f: 0.5, fov: 34 });
  key(17.2, L(8, 12.5, 10.5), L(12, -3, -1), { f: 0.4, fov: 38 });
  key(17.9, L(16.5, 27, 5), L(20, -4, -4.5), { f: 0.25, fov: 44 });
  const K1845 = { t: 18.45, v: [...L(21, 26.5, 3.5).toArray(), ...L(24.5, -4, -4).toArray(), 0.3, 44] };
  const K1945 = { t: 19.45, v: [...add3(M6, -19, 12, 14).toArray(), ...add3(M6, -5, 2, 0).toArray(), 0.35, 38] };
  for (const k of [K1845, K1945]) key(k.t, new Vec(...k.v.slice(0, 3)), new Vec(...k.v.slice(3, 6)), { f: k.v[6], fov: k.v[7] });

  /* ---- batch 2 integration: every move from 20.0 to hold 10 is ONE smooth curve, laid as dense keys every 0.025 s ----
     A quintic Hermite through the move's poses: position, look, look-follow and lens are continuous up to acceleration.
     At a still hold it eases from / to rest with zero acceleration (the plain key Hermite starts and stops with an
     acceleration step: camprobe showed a jolt at every hold, up to ~220 u/s² at hold 8's release). Inner poses take their
     velocity and acceleration from their neighbours (like the engine's own keys) unless given. A drift-through hold (frame 6)
     is an inner pose with its own velocity; its key belongs to the engine, so no dense key is laid on it. A curve that starts
     at an ordinary key (20.0) starts with that key's backward chord as its velocity: that is the tangent the engine then
     computes there, so the join is smooth. */
  const PV = (pos, look, f, fov) => [...pos.toArray(), ...look.toArray(), f, fov];
  const H0 = h => ({ t: h.t0, v: PV(h.pos, h.look, 0, h.fov), still: true, own: true }), H1 = h => ({ ...H0(h), t: h.t1 });
  const Kp = (t, pos, look, f, fov, o = {}) => ({ t, v: PV(pos, look, f, fov), ...o });
  // look-follow on a smoothed sphere: the engine turns the view toward the sphere itself (look = key look → sphere by f), so
  // every landing and bounce jerked the view (camprobe: view-turn steps of 10–17°/s at 21.28, 30.13–31.48, 31.85). From
  // `follow` on, a curve bakes that follow into its keys instead (f = 0), toward the sphere averaged over ±0.2 s (a Hann
  // window over g2's own copy of its path): the camera tracks the run's flow, like an operator, without the bumps.
  let TS = null;
  const ballG2 = t => { if (!TS) TS = TRACK.slice().sort((a, b) => a.t0 - b.t0);
    const s = TS.find(q => t <= q.t1) || TS.at(-1); return s.fn(s.e(Math.min(1, Math.max(0, (t - s.t0) / (s.t1 - s.t0))))).p; };
  const ballS = (t, w = 0.2) => { const P = new Vec(); let W = 0;
    for (let i = -8; i <= 8; i++) { const k = 0.5 + 0.5 * Math.cos(Math.PI * i / 9); P.addScaledVector(ballG2(t + w * i / 8), k); W += k; } return P.multiplyScalar(1 / W); };
  const DTK = 0.025;                                                          // key spacing (0.05 left ~40 u/s² steps where holds ease out)
  // (fix pass: a curve now interpolates the VIEW DIRECTION (a unit vector) and the look distance, not the look point. Holds
  //  look 10 units ahead while the poses between them look 20–50 ahead, so interpolating look points bunched the turn at the
  //  end of each move as the point closed in on the camera: 4.1° of the last 5° into hold 10 came in its last 0.3 s (the
  //  "late tilt"), and the pans into holds 7 and 9 were back-loaded the same way. The poses themselves are unchanged.)
  const toW = v => { const w = new Vec(v[3] - v[0], v[4] - v[1], v[5] - v[2]), Lw = w.length(); w.multiplyScalar(1 / Lw); return [v[0], v[1], v[2], w.x, w.y, w.z, Lw, v[6], v[7]]; };
  const fromW = w => { const d = new Vec(w[3], w[4], w[5]).normalize(); return [w[0], w[1], w[2], w[0] + d.x * w[6], w[1] + d.y * w[6], w[2] + d.z * w[6], w[7], w[8]]; };
  /* ---- READING TIME (user, 2026-09-29, question A2: "add about ½ second where it's under ~1.3 s (e.g. 24, 25), borrowing
     time from the travel between frames so the piece stays 2:27"). Frames 7 and 8 read for 0.33 s and 0.87 s: the copy is
     all in only just before the key, and the camera's pick-up after it carries it off or moves it too fast to read. So the
     camera is RE-PACED along its SAME path (every pose, look and lens as approved; only when it gets there changes): it
     LINGERS round keys 7 and 8 at its own key speed instead of speeding away (review, 2026-09-29: the first re-pace halved
     the speed through both keys, below the never-stop band; "longer, not slower"). Per move, its speed along the path is
       S(t) = v(t) + (V − v(t))·K((t − tk) / W) + v(t)·Σ a·F(t)
     v: the path's own speed (the approved pacing); V: the path's speed at the key instant, so S = V = v there (φ' = 1);
     K(x) = (1 − x²)³ on the key's own side of the move, W its reach (PACE: before, after tk); F: smooth boxes or bumps on the
     travel that pay the time back (FLANKS: one per move has its amplitude a solved so the move keeps its length, the others
     are given). The camera is where the path has run σ(t) = s(t) + ∫(S − v) (s: the path's length so far), φ(t) = s⁻¹(σ(t)):
     φ = t wherever S = v and at both ends of every move, so every key pose is reached at its key instant (the key frames,
     the sphere's key match and the cuts are unchanged; the sphere runs on its own clock and is untouched). Near a key S
     stays between V and v, so the camera is never slower than its key speed (3 u/s at 7, 4.5 at 8) or the path's own
     (where the path dipped below V, ~3.8 u/s at 28.5, S is lifted to V). ---- */
  const PACE = [{ tk: h7.tk, W: [1.2, 0.8] }, { tk: h8.tk, W: [1.8, 1.0] }];
  // the flanks: [from, to, ramp] smooth boxes or [centre, half width] bumps (× (1 + a) at their peak)
  const FLANKS = [
    { box: [20.8, 22.35, 0.4] },                                             // 6 → 7: the crane up onto the path (after frame 6's pass)
    { box: [23.8, 27.3, 0.6] },                                              // 7 → 8: the pull back and swing toward the pegs
    { box: [29.15, 30.3, 0.35], a: 0.3 },                                    // 8 → 9: a quicker start to the rise, across the left edge
    { box: [30.4, 32.4, 0.5] }];                                             //        then a gentler rise over the hops (pays it back)
  const K3 = x => Math.abs(x) >= 1 ? 0 : (1 - x * x) ** 3, sm5 = x => { x = Math.min(1, Math.max(0, x)); return x * x * x * (x * (6 * x - 15) + 10); };
  const flankF = q => q.box ? (t => sm5((t - q.box[0]) / q.box[2]) * sm5((q.box[1] - t) / q.box[2])) : (t => K3((t - q.bump[0]) / q.bump[1]));
  const flankSpan = q => q.box ? [q.box[0], q.box[1]] : [q.bump[0] - q.bump[1], q.bump[0] + q.bump[1]];
  // one move's re-pacing: its path `at` over [t0, t1] → φ (identity for a move with no lingering key at either end)
  const repace = (at, t0, t1) => {
    const sh = PACE.flatMap(q => Math.abs(q.tk - t0) < 1e-6 ? [{ tk: t0, W: q.W[1], side: 1 }] : Math.abs(q.tk - t1) < 1e-6 ? [{ tk: t1, W: q.W[0], side: -1 }] : []);
    if (!sh.length) return null;
    const fl = FLANKS.filter(q => { const [a, b] = flankSpan(q); return a > t0 && b < t1; }), free = fl.filter(q => q.a == null);
    if (free.length !== 1) throw new Error('G2: a lingering move needs exactly one flank to pay its time back');
    const N = Math.ceil((t1 - t0) / 0.002), T = Array.from({ length: N + 1 }, (_, i) => t0 + (t1 - t0) * i / N), s = [0];
    for (let i = 1, p0 = at(t0); i <= N; i++) { const p = at(T[i]); s.push(s[i - 1] + Math.hypot(p[0] - p0[0], p[1] - p0[1], p[2] - p0[2])); p0 = p; }
    const v = T.map((_, i) => { const a = Math.max(0, i - 1), b = Math.min(N, i + 1); return (s[b] - s[a]) / (T[b] - T[a]); });
    for (const q of sh) q.V = q.side > 0 ? v[0] : v[N];
    const Df = T.map((t, i) => sh.reduce((acc, q) => acc + ((t - q.tk) * q.side >= 0 ? (q.V - v[i]) * K3((t - q.tk) / q.W) : 0), 0)
      + v[i] * fl.reduce((acc, q) => acc + (q.a != null ? q.a * flankF(q)(t) : 0), 0));      // S − v, less the free flank
    const G = T.map((t, i) => v[i] * flankF(free[0])(t));
    const trap = Y => { let r = 0; for (let i = 1; i <= N; i++) r += (Y[i] + Y[i - 1]) / 2 * (T[i] - T[i - 1]); return r; };
    const a = -trap(Df) / trap(G), S = T.map((_, i) => v[i] + Df[i] + a * G[i]);
    if (Math.min(...S) < 0.5) throw new Error('G2: a re-paced move nearly stops');
    const invS = x => { let lo = 0, hi = N; if (x <= 0) return t0; if (x >= s[N]) return t1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (s[m] <= x) lo = m; else hi = m; }
      return T[lo] + (x - s[lo]) / (s[hi] - s[lo]) * (T[hi] - T[lo]); };
    const phi = [t0]; for (let i = 1, dl = 0; i <= N; i++) { dl += (S[i] - v[i] + S[i - 1] - v[i - 1]) / 2 * (T[i] - T[i - 1]); phi.push(invS(s[i] + dl)); }
    phi[N] = t1;
    const warp = t => { const x = (t - t0) / (t1 - t0) * N, i = Math.min(N - 1, Math.max(0, Math.floor(x))), u = x - i; return t <= t0 ? t : t >= t1 ? t : phi[i] + (phi[i + 1] - phi[i]) * u; };
    return warp; };
  const move = (P, follow = -Infinity) => { const n = P.length, Z = () => new Array(9).fill(0);
    for (const p of P) p.w = toW(p.v);
    // a pose given a velocity (and acceleration) in look-point terms (a curve starting at an ordinary engine key): converted
    for (const p of P) if (p.dv && !p.dw) { const hh = 1e-3, ev = s => toW(p.v.map((x, j) => x + p.dv[j] * s + 0.5 * (p.a ? p.a[j] : 0) * s * s)), m0 = ev(-hh), c0 = ev(0), q0 = ev(hh);
      p.dw = c0.map((_, j) => (q0[j] - m0[j]) / (2 * hh)); p.aw = c0.map((_, j) => (q0[j] - 2 * c0[j] + m0[j]) / (hh * hh)); }
    // inner poses: the neighbours' direction (as the engine's keys), but for position and view direction the speed is the mean
    // of the two spans' average speeds (the plain chord ran well under both where the path turns, e.g. at 30.35: the camera
    // surged 0 → 67 → 28 → 54 → 28 u/s over 29.45–30.95). sp: a pose's own camera speed (u/s); vp: its own velocity (u/s)
    const d3 = (p, q, j) => Math.hypot(p.w[j] - q.w[j], p.w[j + 1] - q.w[j + 1], p.w[j + 2] - q.w[j + 2]);
    for (let i = 0; i < n; i++) if (!P[i].dw) { if (P[i].still) { P[i].dw = Z(); continue; }
      const A = P[i - 1], B = P[i + 1], m = P[i].w.map((_, j) => (B.w[j] - A.w[j]) / (B.t - A.t));
      { const d = P[i].w, k = m[3] * d[3] + m[4] * d[4] + m[5] * d[5]; for (let q = 3; q < 6; q++) m[q] -= k * d[q]; }   // (tangent to the unit sphere)
      for (const j of [0, 3]) { const Lm = Math.hypot(m[j], m[j + 1], m[j + 2]), want = j === 0 && P[i].sp != null ? P[i].sp : (d3(A, P[i], j) / (P[i].t - A.t) + d3(P[i], B, j) / (B.t - P[i].t)) / 2;
        if (Lm > 1e-6) for (let q = j; q < j + 3; q++) m[q] *= want / Lm; }
      if (P[i].vp) for (let q = 0; q < 3; q++) m[q] = P[i].vp[q];
      P[i].dw = m; }
    // inner accelerations: the mean of the two neighbouring cubic spans' accelerations at the pose (consistent with the
    // positions and velocities above, so the quintic spans don't fight them)
    for (let i = 0; i < n; i++) if (!P[i].aw) { if (P[i].still || i === 0 || i === n - 1) { P[i].aw = Z(); continue; }
      const A = P[i - 1], C = P[i], B = P[i + 1], hA = C.t - A.t, hB = B.t - C.t;
      P[i].aw = C.w.map((_, j) => ((6 * (A.w[j] - C.w[j]) + 2 * hA * A.dw[j] + 4 * hA * C.dw[j]) / (hA * hA) + (6 * (B.w[j] - C.w[j]) - 4 * hB * C.dw[j] - 2 * hB * B.dw[j]) / (hB * hB)) / 2); }
    const at = t => { let i = 0; while (i < n - 2 && t > P[i + 1].t) i++;
      const A = P[i], B = P[i + 1], h = B.t - A.t, u = Math.min(1, Math.max(0, (t - A.t) / h));
      return fromW(A.w.map((_, j) => q5(A.w[j], A.dw[j], A.aw[j], B.w[j], B.dw[j], B.aw[j], h, u))); };
    const warp = repace(at, P[0].t, P[n - 1].t) || (t => t);                 // (READING TIME: the re-pacing, above)
    for (let t = P[0].t; t <= P[n - 1].t + 1e-6; t = +(t + DTK).toFixed(4)) {
      if (P.some(p => p.own && Math.abs(p.t - t) < 0.01)) continue;
      // (re-paced: the pose is the curve's at warp(t); the look-follow still aims at the sphere where it really is at t)
      const v = at(warp(t)), f = Math.min(1, Math.max(0, v[6])), lk = new Vec(v[3], v[4], v[5]);
      if (t > follow + 1e-6) key(t, new Vec(v[0], v[1], v[2]), lk.lerp(ballS(t), f), { f: 0, fov: v[7] });
      else key(t, new Vec(v[0], v[1], v[2]), lk, { f, fov: v[7] }); } };

  /* ---- NEVER STOP (user, 2026-09-27 21:50: "ease into that keyframe and then ease back out from the keyframe, so you're never
     actually stopping. You're just slowing down to that moment, and then you continue"). Frames 7–10 are ease-throughs now,
     like 4, 5 and 6: each old still hold is a pose the camera passes at its key instant at a drift speed (about a quarter of the
     move's cruise, along its line of travel, the view steady for that instant: PASS). The poses between keep their places;
     retime() re-spaces their times so the camera runs the same path at the same relative pace (the old speeds, scaled) but
     reaches each key on time without dipping below the drift. ---- */
  const posOf = k => new Vec(k.v[0], k.v[1], k.v[2]), chord = (a, b) => posOf(b).sub(posOf(a)).normalize();
  // a pass pose at the start or end of a move: board n's exact pose at its key instant, moving at v u/s along dir (its look
  // point moves with it, so the view doesn't turn at that instant); no acceleration there
  const PASS = (h, dir, v) => { const p = Kp(h.tk, h.pos, h.look, 0, h.fov, { own: true }), w = dir.clone().multiplyScalar(v).toArray(); p.dv = [...w, ...w, 0, 0]; p.speed = v; return p; };
  // P: [start key pose, inner poses (their authored times give the old pace), end key pose]; tA, tB: the old times of the ends
  const retime = (P, tA, tB) => { const n = P.length, d = [];
    for (let i = 1; i < n; i++) d.push(posOf(P[i]).distanceTo(posOf(P[i - 1])));
    const tOld = [tA, ...P.slice(1, -1).map(p => p.t), tB], w = [P[0].speed];
    for (let i = 1; i < n - 1; i++) w.push(P[i].sp ?? (d[i - 1] / (tOld[i] - tOld[i - 1]) + d[i] / (tOld[i + 1] - tOld[i])) / 2);
    w.push(P[n - 1].speed);
    const T = P[n - 1].t - P[0].t, v = lam => w.map((x, i) => i === 0 || i === n - 1 ? x : lam * x);
    const tot = lam => { const vv = v(lam); let s = 0; for (let i = 0; i < n - 1; i++) s += d[i] / ((vv[i] + vv[i + 1]) / 2); return s; };
    let lo = 1e-3, hi = 20; for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; if (tot(m) > T) lo = m; else hi = m; }
    const vv = v((lo + hi) / 2); let t = P[0].t;
    for (let i = 1; i < n - 1; i++) { t += d[i - 1] / ((vv[i - 1] + vv[i]) / 2); P[i].t = +t.toFixed(4); P[i].sp = vv[i]; }
    return P; };
  const V7 = 3.0, V8 = 4.5, V9 = 2.5;                                        // u/s through boards 7, 8, 9 on the curves (10: see V10F below);
                                                                              // re-paced for reading, 7 and 8 linger near this speed (see repace())
  const p3285 = c9.clone().addScaledVector(h9.fwd, 1.6).add(new Vec(0, 0.9, 0));
  // the poses (places and looks as approved; see the history notes in each move below)
  const K20 = Kp(20.0, add3(c6, -8, 5.8, -6.6), add3(M6, -1, 1, 0), 0.2, 32);
  { const T19 = K20.v.map((x, j) => (x - K1845.v[j]) / (20.0 - 18.45));                 // the engine's tangent at 19.45 (its neighbours)
    K20.dv = K20.v.map((x, j) => (x - K1945.v[j]) / (20.0 - 19.45));                    // backward chord: the tangent the engine then computes at 20.0
    K20.a = K20.dv.map((m, j) => 2 * (T19[j] - m) / (20.0 - 19.45)); }                  // = the end acceleration of the 19.45 → 20.0 span
  const vP6 = [5.5, -3.5, 0];                                                           // u/s through board 6's pose (truck right, descending)
  const KP6 = Kp(h6.tk, h6.pos, h6.look, 0, h6.fov, { own: true, vp: vP6 }); KP6.speed = Math.hypot(...vP6);
  const K212 = Kp(21.2, add3(c6, 3.5, -3.0, -3), add3(M6, 1, -8.5, 0), 0.45, 36);
  const K2175 = Kp(21.75, c7.clone().lerp(add3(Lp, 3, 1, 21), 0.6), c7.clone().addScaledVector(h7.fwd, 12).lerp(Lp, 0.2), 0.4, 34, { sp: 19 });
  const K2485 = Kp(24.85, add3(c7, 4, 0.5, 5.5), add3(M7, 9, -3, 2), 0.45, 32);
  const K258 = Kp(25.8, c7.clone().lerp(c8, 0.4).add(new Vec(0, 9.5, 0)), add3(M8, -12, 1, 0), 0.3, 33);
  const K2675 = Kp(26.75, c8.clone().lerp(c7, 0.16).add(new Vec(0, 7, 0)), M8.clone().add(new Vec(-6, -3, 0)), 0.3, 29);
  const K304 = Kp(30.4, add3(M8, 7, 5, 33), add3(M8, 9, -6, 0), 0.55, 34, { sp: 40 });
  const K3095 = Kp(30.95, add3(lastPeg, -6, 9, 22), add3(lastPeg, 0, -4, 0), 0.55, 36, { sp: 32 });
  const K3175 = Kp(31.75, c9.clone().lerp(post0, 0.25).add(new Vec(0, 4, 0)), add3(post0, 0, -2, 0), 0.55, 38);
  const K3285 = Kp(32.85, p3285, p3285.clone().addScaledVector(h9.fwd.clone().lerp(Hx.clone().sub(p3285).normalize(), 0.25).normalize(), 30), 0.12, 35, { sp: 3.6 });
  // the drift directions at the keys: 7 and 8 along the chord between the poses either side; 9 trucks right (and a little back)
  // as the sphere rolls down at it, into the whip round; 10 pushes toward the tunnel while craning down and a little left (the
  // wall is ~50 away, so a push alone barely changes the picture (measured: 0.4, a pause); the crane's parallax on the path
  // in the foreground keeps it moving). V10F, V10R, V10U: u/s forward, right, up at frame 10's key instant
  const V10F = 4.5, V10R = -2.2, V10U = -2.2, V10 = Math.hypot(V10F, V10R, V10U);
  const dir7 = chord(K2175, K2485), dir8 = chord(K2675, K304), dir9 = h9.right.clone().addScaledVector(h9.fwd, -0.3).setY(0).normalize();
  const dir10 = h10.fwd.clone().multiplyScalar(V10F).addScaledVector(h10.right, V10R).addScaledVector(h10.upv, V10U).normalize();
  const rel10 = (a, r, u) => c10.clone().addScaledVector(h10.fwd, a).addScaledVector(h10.right, r).addScaledVector(h10.upv, u);   // camera-10 coordinates
  // 5 → 6 → 7 · descend and come round level with the funnel's rim; DRIFT THROUGH frame 6 (trucking right and descending at
  // ~6.5 u/s as the sphere drops out of the mouth); tilt down after the drop, then crane up to 35° as the sphere rolls onto the
  // stepped path and ease through frame 7
  // (fix pass (batch 2): the pass at 6 read as a pause when the camera braked to 1.1 u/s there; board 6's pose sits on a
  //  rightward truck, so the camera passes it trucking right and descending; 20.0 sits a little higher and nearer so the approach
  //  decelerates smoothly into that speed. Revision: 7 is a pass too, so 21.2 and 21.75 are re-timed onto it.)
  move([K20, ...retime([KP6, K212, K2175, PASS(h7, dir7, V7)], h6.tk, 22.5)], h6.tk);
  // 7 → 8: pull back and swing square to the peg wall as the sphere leaps onto it
  // (fix pass, user note on 8: "seen from an angle, looking down" like v1: the camera stays 7–8 units higher over the leap and
  //  the first hops, looking down on the pegs, and cranes down to the head-on pose in one smooth slow-down)
  move(retime([PASS(h7, dir7, V7), K2485, K258, K2675, PASS(h8, dir8, V8)], 24.1, 28.05), h7.tk);
  // 8 → 9: rise and angle down on the pegs, follow the hops, then drop in left of the ramp as the sphere spirals down
  // (batch 2: the rise is about half as high as the builder's, at 30.4, so both spans run at a similar pace round a ~70° corner;
  //  follow-up: 31.75 keeps the corkscrew's old post position (post0), the look-follow keeps the sphere framed; fix pass: 32.85
  //  sits just in front of frame 9's pose on the line the camera arrives along, so it settles into frame 9 in one slow-down)
  move(retime([PASS(h8, dir8, V8), K304, K3095, K3175, K3285, PASS(h9, dir9, V9)], 29.45, 33.9), h8.tk);
  // 9 → 10: the sphere passes the lens, the camera whips round behind it, cranes up and lets it roll on toward the tunnel, then
  // glides forward and down, easing through frame 10 as it pushes gently toward the tunnel (Q10: along D9h from M10, right, up)
  // (fix pass (batch 2): the crane rises and backs away as frame 10's wall builds in, then glides forward; the view tilts up
  //  steadily through it (−17°, −9°, −3°, level at frame 10). Revision: 9 drifts right into the whip, so the whip poses sit a
  //  little further along that drift, and the glide into 10 starts further back so it reaches frame 10's pose at V10.)
  const R10 = D9h.clone().cross(UP).normalize(), Q10 = (a, r, u) => M10.clone().addScaledVector(D9h, a).addScaledVector(R10, r).addScaledVector(UP, u);
  const pitchLook = (p, deg) => { const r = deg * Math.PI / 180; return p.clone().addScaledVector(D9h, 30 * Math.cos(r)).addScaledVector(UP, 30 * Math.sin(r)); };
  move([PASS(h9, dir9, V9),
    Kp(35.8, c9.clone().addScaledVector(dir9, 1.35), c9.clone().addScaledVector(dir9, 1.35).addScaledVector(h9.fwd, 10), 0.55, 36),
    Kp(36.25, add3(c9, 0, 0.8, 0).addScaledVector(dir9, 2.0), Pp.clone(), 1, 40),
    Kp(36.7, c9.clone().lerp(c10, 0.25).add(new Vec(0, 0.3, 0)).addScaledVector(dir9, 1.6), Pp.clone().addScaledVector(D9h, 10).add(new Vec(0, -1, 0)), 0.8, 40),
    Kp(37.4, Q10(-53.0, 3.4, 6.6), pitchLook(Q10(-53.0, 3.4, 6.6), -17), 0.2, 37),
    Kp(38.2, rel10(-5.9, 2.9, 2.6), pitchLook(rel10(-5.9, 2.9, 2.6), -9), 0.1, 33),
    Kp(38.95, rel10(-4.05, 2.0, 2.0), pitchLook(rel10(-4.05, 2.0, 2.0), -3), 0, 30.4),
    PASS(h10, dir10, V10)], h9.tk);
  /* ---- 10 → 11 · THE 41.4 CONTRACT (G2 → G3, both sides must match; user: frame 11 must "keep following the ball from frame 10,
     so it feels like the same chase"). From frame 10's pose (V10 u/s along the tunnel's axis, the view steady) the camera
     swoops forward and down after the sphere, through the ring into the tunnel, and settles GAP behind it on its line, both
     running straight into the screen at V_END u/s, the sphere centred and lit against the tunnel's dark; the cut hides in the
     dip at 41.4. One smooth curve (a quintic along the axis; the drop onto the sphere's line is done by 42 units in, well
     before the ring at ~51), laid as dense keys. The view eases from frame 10's straight onto the sphere; the lens opens
     from 30° to FOV_END. The engine stops a shot's camera on its last key, so the last key is 0.5 ms before the cut (as G3
     does at its cuts): the stop falls after the last frame shown. ---- */
  { const T0 = h10.tk, T1 = 41.4, Tt = T1 - T0, GAP = 3, UP_END = 0.25, FOV_END = 50;
    const loc = p => { const d = p.clone().sub(c10); return [d.dot(h10.right), d.dot(h10.upv), d.dot(h10.fwd)]; };
    const bE = loc(ballG2(T1 - 1e-4)), FE = bE[2] - GAP, RE = bE[0], UE = bE[1] + UP_END;
    const sm5 = x => { x = Math.min(1, Math.max(0, x)); return x * x * x * (x * (6 * x - 15) + 10); };
    // (review fix, 2026-09-28: the chase launched with a lurch right at frame 10's key (view-turn 1 → 25°/s in ~0.03 s, the
    //  sphere's screen motion 4 → 35 px/frame, motion.mjs 1.2 → 10.5): the view was blended onto the travel direction, ~35° off
    //  frame 10's view because of the crane's drift, and the along-axis quintic started with a large jerk. Now:
    //  · along the axis, a 6th-degree curve from frame 10's drift (V10F, no acceleration and no jerk: the push builds from
    //    nothing) to V_END with no acceleration at TB; the brake is done by TB, inside the full dark, and the last 0.1 s before
    //    the cut is a steady V_END, level with the sphere (review: it was still braking at the cut). (A 7th-degree curve with no
    //    jerk at TB either, or TB at 41.2, pushed the swoop's peak from ~72 to 87–93 u/s; this one peaks at ~84.)
    //  · the view eases straight from frame 10's onto the sphere (sm5 over T0 → TW: no angular velocity or acceleration at the
    //    key), so the sphere drifts up toward the centre through the swoop instead of being locked there early.)
    const TB = 41.3, TW = 41.1, fB = FE - V_END * (T1 - TB), hB = TB - T0;
    // a polynomial on u ∈ [0, 1] from constraints [u, derivative order, value] (as many coefficients as constraints)
    const polyFit = cons => { const n = cons.length, dk = (k, d) => { let r = 1; for (let i = 0; i < d; i++) r *= k - i; return r; };
      const M = cons.map(([u, d, v]) => [...Array.from({ length: n }, (_, k) => k < d ? 0 : dk(k, d) * u ** (k - d)), v]);
      for (let i = 0; i < n; i++) { let m = i; for (let k = i + 1; k < n; k++) if (Math.abs(M[k][i]) > Math.abs(M[m][i])) m = k; [M[i], M[m]] = [M[m], M[i]];
        const pv = M[i][i]; for (let j = i; j <= n; j++) M[i][j] /= pv; for (let k = 0; k < n; k++) if (k !== i) { const f = M[k][i]; for (let j = i; j <= n; j++) M[k][j] -= f * M[i][j]; } }
      const C = M.map(r => r[n]); return u => C.reduce((acc, c, k) => acc + c * u ** k, 0); };
    const ease6 = (v0, p1, v1) => polyFit([[0, 0, 0], [0, 1, v0 * hB], [0, 2, 0], [0, 3, 0], [1, 0, p1], [1, 1, v1 * hB], [1, 2, 0]]);
    const fAx = ease6(V10F, fB, V_END), fR = ease6(V10R, 0, 0), fU = ease6(V10U, 0, 0);
    // (frame 10's sideways and downward drift fades out over the chase: no acceleration or jerk at the key, none at TB)
    const posAt = t => { const u = Math.min(1, Math.max(0, (t - T0) / hB)), f = t <= TB ? fAx(u) : fB + V_END * (t - TB), k = sm5(f / 42);
      return c10.clone().addScaledVector(h10.fwd, f).addScaledVector(h10.right, RE * k + fR(u)).addScaledVector(h10.upv, UE * k + fU(u)); };
    const NK = Math.round(Tt / DTK), ts = [...Array.from({ length: NK - 1 }, (_, i) => T0 + Tt * (i + 1) / NK), T1 - 5e-4];
    for (const t of ts) { const p = posAt(t), u = (t - T0) / Tt, w = sm5((t - T0) / (TW - T0));
      const dir = h10.fwd.clone().lerp(ballG2(t).sub(p).normalize(), w).normalize();
      key(+t.toFixed(4), p, p.clone().addScaledVector(dir, 10), { f: 0, fov: F10 + (FOV_END - F10) * sm5(u) }); } }
  dip(41.4, 0.4);

  /* =================== captions =================== */
  note(13.2, 14.2, '3 → 4 · out of the wipe, frame 4\'s set flies in from the depth and READY? LET\'S GO builds in; the camera pushes in and eases through board 4 without stopping');
  note(14.2, 15.28, '4 → 5 · the sphere pops into the O\'s hole; the O comes at the camera with it, the other letters swelling forward after it one by one like a tail, until the O nearly fills the frame');
  note(15.28, 15.9, 'the O and the sphere slam back to their place, overshoot and settle; the sphere swells and swallows the O, and T\'S G● lands as board 5 (the camera still pushing in)');
  note(15.9, 17.18, '5 → 6 · T\'S G whip off to the left one after another; the gate lifts, the pill rises out; the channel rises under the sphere, which lands in its scoop and rolls');
  note(17.2, 18.58, 'crane up to a high aerial over the pipes: the sphere runs its open channel, under a bridge, over a crossing pipe');
  note(18.6, 20.4, 'descend to the sphere and come round level with the funnel\'s rim as board 6\'s shapes slide in: it rolls into the pipe\'s entrance, round the bend and down to the mouth');
  note(20.4, 20.85, 'frame 6 · the camera trucks right and down past board 6 without stopping, as the sphere drops out of the mouth');
  note(20.85, 22.8, '6 → 7 · the sphere drops through the funnel and stem onto a diamond pad; the camera tilts down after it, then cranes up to 35° as frame 7\'s path and backdrop build in');
  note(22.8, 23.8, 'frame 7 · the camera eases through board 7 (~3 u/s, lingering near that pace for the reading) as the sphere rolls down the stepped path');
  note(23.8, 26.0, '7 → 8 · the camera pulls back and swings toward the peg wall; the sphere leaps off the path onto the top pegs, which sprout from the wall ahead of it');
  note(26.0, 28.25, 'we watch the first hops from above, then the camera cranes down to the pegs head-on');
  note(28.25, 29.25, 'frame 8 · the camera eases through board 8 head-on (~4.5 u/s, lingering near that pace for the reading) as the sphere hops over the pegs');
  note(29.25, 31.8, '8 → 9 · the camera rises and angles down on the pegs, following the hops; each peg flexes as the sphere lands, and they slide back into the wall behind it');
  note(31.8, 34.55, 'the sphere drops in between the corkscrew\'s turns and spirals down; the camera settles toward frame 9\'s view as it leaves the corkscrew at the top left and rolls down the ramp at us');
  note(34.55, 35.5, 'frame 9 · the camera eases through board 9, drifting right (~2.5 u/s) as the sphere rolls down the ramp toward it, growing; its contact shadow is its own size');
  note(35.5, 37.0, '9 → 10 · it passes the lens; the camera whips round behind it as frame 9\'s shapes slide away and the tunnel wall fades in');
  note(37.0, 39.45, 'the sphere runs on down the path toward the ring tunnel; the camera cranes up and back as the wall\'s shapes fly in, then glides forward and down toward frame 10');
  note(39.45, 40.25, 'frame 10 · the camera eases through board 10, craning down and pushing toward the tunnel, then swoops after the sphere');
  note(40.25, 41.4, '10 → 11 · the camera chases the sphere into the ring\'s tunnel and settles 3 behind it, both running straight in at ~9 u/s, the sphere lit against the dark (the cut to 11 hides in the dark at 41.4; G3 carries on the same chase)');

};
