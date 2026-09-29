/* G3 · frames 11–15 (41.4 → 66.85 s). All five are built (batch 3): each frame's real set is in groups/g3/f11.js … f15.js;
   this file keeps the journey (key moments, the sphere's path and timing, camera curves, captions).
   REVISION (user, 2026-09-27 21:50): the camera never stops. Every key moment is a pass-through: the camera slows to about a
   quarter of its cruise at the key instant (the board's framing) and carries on; the slow window round it is the copy's
   reading time. The sphere never stops either, except on frame 14's ramp, where it stops on purpose.
   10 → 11: one chase out of frame 10. The camera comes out of the cut inside the exit tunnel, ~3 behind the sphere, both
       running into the screen at ~9 u/s. It speeds up and overtakes it over its top left, turning to keep it in frame (it
       orbits round it and flips to face it), comes out of the ring first, and pulls back to watch the sphere come out of the
       tunnel (~42.85) and drop over the lip (~43.1) as board 11's shapes arrive, easing onto frame 11's framing.
   11 → 12: the sphere passes the camera on its right; the camera orbits round behind it, onto the road, and lets it roll on,
       creeping after it through frame 12's long slow window (the copy's reading time) before the doorway takes it.
   12 → 13: the sphere rolls into the dark doorway; the camera cranes up and over the tunnel and finds it coming out of the
       far end into a cut-open pipe; it tilts down to the aerial view of the U-bend (its rims stay visible throughout).
   13 → 14: round the bend, out along the right leg and off its end in a leap onto the hill; the camera drops in front of it
       and tilts up; the sphere comes from the top right down the hill and slows to a stop mid-ramp (the camera creeps on).
   14 → 15: it "decides", and rolls down to the left along the band (board 14's diagonal) to the hill's foot, where the ramp
       carries on and curves round into frame 15's ledge. The camera follows it left, rises over the ramp's bend and comes
       round behind it onto the doorway wall; it turns into the doorway. Full-screen gradient wipe, left to right; cut 66.85.
   The camera is ONE smooth curve from 41.4 to the cut (quintic, laid as dense keys; see move()); the moves between keys are
   re-timed on an even ramp–cruise–ramp profile (retime()). Poses are placed relative to where the sphere is, so it stays
   framed.
   (polish 2026-09-29: board 12's sphere spot (958, 628, d 257) now lives in v2.js BOARD; this file no longer overrides it at
   runtime, and the hold solves exactly as before. Frame 11's tunnel ribs are filtered (f11.js) and frame 12's backdrop is
   extended (f12.js); the journey here is unchanged.) */
import f11 from './g3/f11.js';
import f12 from './g3/f12.js';
import f13 from './g3/f13.js';
import f14 from './g3/f14.js';
import f15 from './g3/f15.js';

export default V => {
  const { THREE, hold, key, runSegs, seg, note, wipe, anim, o, mat, add, ext, ring, arch } = V;
  const up = new THREE.Vector3(0, 1, 0);
  const T = f => Math.tan(f * Math.PI / 360);
  const dep = (n, fov) => 540 / (V.BOARD[n].d / 2 * T(fov));            // camera-to-sphere depth for the board's size
  const P = (x, y, z) => o(x, y, z);                                   // region-local point → world
  const W = (x, y, z) => new THREE.Vector3(x, y, z);                    // world offset / point
  const rad = d => d * Math.PI / 180;

  /* ================= key moments (pass-throughs: the camera passes each board's framing at tk without stopping) =================
     t: [t0, t1] is the slow window round the key instant tk (the copy's reading time); the camera is slowest at tk. */
  // 11: frontal on the wall, long lens; the wall 6 u behind the sphere so the tunnel mouth is a real place
  const F11 = 28, W11 = dep(11, F11) + 6;
  const h11 = hold(11, { pass: true, t: [44.3, 45.4], tk: 44.825, mark: P(0, 0, 0), dir: [0, 0, -1], fov: F11, plate: { depth: W11, in: [42.3, 43.9], fly: 0 } });
  // 12: level on the road axis, looking into the arched tunnel (+z)
  // (board 12's sphere spot is (958, 628), d 257: its painted sphere spans x 828–1087, y 498–756 on assets/board/f12.jpg, and
  //  f12.js is built for it. It used to be corrected here at runtime (the engine's table had 965, 580, d 220); since the
  //  2026-09-29 polish pass it lives in v2.js BOARD itself, so the hold solves exactly as before.)
  const M12 = P(13, -4, 37);
  // (revision: a long slow window, 48.9–51.2, and the sphere rolls on down the road more slowly (~7 u/s), reaching the doorway
  //  at ~52.85 (was ~52.3), so frame 12's words and pictures can come in sooner and be read before it disappears)
  const h12 = hold(12, { pass: true, t: [48.9, 51.2], tk: 49.85, mark: M12, dir: [0, 0, 1], fov: 30, plate: { depth: 40, in: [47.7, 48.85], out: [51.9, 52.5] } });
  // 13: aerial on the cut-open U-bend (pitch −85°, screen-up = +z). The crest is the mark; the key instant comes early in the
  // window so the sphere enters from the bottom left, crosses the crest, and leaves at the bottom right.
  const ZA = 78.4, RU = 4.2, XL = 13 - 2 * RU;                         // bend starts at z = ZA; bend radius; right-leg x
  const CU = P(13 - RU, -4, ZA), crest = CU.clone().add(W(0, 0, RU));
  const h13 = hold(13, { pass: true, t: [54.9, 55.9], tk: 55.35, mark: crest, dir: [0, -Math.sin(rad(85)), Math.cos(rad(85))], fov: 30, plate: { in: [53.7, 54.85] } });
  // 14: low, looking up the hill (+z, pitched up 12°); the sphere comes down toward the camera and stops on the band
  const legEnd = P(XL, -4, ZA - 3.5), land = P(XL, -9.5, ZA - 11.5), a20 = rad(20), LH = 19.2;
  const M14 = land.clone().add(W(0, -LH * Math.sin(a20), -LH * Math.cos(a20)));
  // the sphere's stop (revision, user: it "slow[s] to a stop in the middle of the ramp and then decide[s] to go down to the left
  // on the ramp"): it arrives a hair past its board spot at STOP0, rocks back onto it and sits still to GO; the key instant is
  // in that still moment; the camera keeps drifting through it
  // (review fix: the still is 0.5 s now (was 0.2), so the "decides" beat reads; the camera backs straight away from it along
  //  its line of sight through the stop, so it keeps its board spot on screen instead of sliding ~300 px)
  const STOP0 = 60.45, SETTLE = 60.62, STILL0 = 60.75, GO = 61.25;
  const h14 = hold(14, { pass: true, t: [60.35, 61.4], tk: 60.95, mark: M14, dir: [0, Math.sin(rad(12)), Math.cos(rad(12))], fov: 30, plate: { depth: 34, in: [57.7, 59.4] } });
  const C14 = h14.pos, drop14 = M14.y - (C14.y - 1) + 1;                  // (f14's floor level: the old hill foot)
  const foot = M14.clone().add(W(0, -drop14, -drop14 / Math.tan(a20)));
  // 14 → 15, the ramp (revision, user: "The bottom of the ramp will be the entrance to frame 15. The ramp should go down and
  // curve around to connect to what would be the hill ramp inside of frame 15 … keep it there so it makes sense"). The sphere
  // leaves the stop down-left along the band: in f14's hill plane Q (banked 30°, rising to the camera's right), along board
  // 14's diagonals (e1: at a constant depth from camera 14, so on screen it runs parallel to the band's edges). At the hill's
  // foot (the concave crease where the hill meets the floor) it runs onto frame 15's ledge, which carries straight on, then
  // curves round to the left (radius RR) into frame 15's doorway. Frame 15's set is built round its key camera, so it sits
  // where this ramp takes it: the camera looks −z at the doorway wall (it looked −x before the revision).
  const n0 = W(0, Math.cos(a20), -Math.sin(a20)), dUp = W(0, Math.sin(a20), Math.cos(a20)), BANK = rad(-30);
  const nQ = n0.clone().multiplyScalar(Math.cos(BANK)).add(new THREE.Vector3().crossVectors(dUp, n0).multiplyScalar(Math.sin(BANK)));
  const dOut = new THREE.Vector3().crossVectors(h14.fwd, nQ).normalize().negate();      // down-left along the band (f14's −e1)
  const FLOOR = foot.y - 1, kK0 = (FLOOR + 1 - M14.y) / dOut.y;                         // the crease: centre 1 over the floor
  const K0 = M14.clone().addScaledVector(dOut, kK0);
  const hh = W(dOut.x, 0, dOut.z).normalize(), psi0 = Math.atan2(-hh.z, hh.x);
  const hd = a => W(Math.cos(a), 0, -Math.sin(a)), lf = a => W(-Math.sin(a), 0, -Math.cos(a));   // heading a (0 = +x; left turns +)
  const L1R = 3, RR = 8, L2R = 3, PSI = rad(63);
  const S1 = K0.clone().addScaledVector(hh, L1R), KC = S1.clone().addScaledVector(lf(psi0), RR);
  const onArc = a => KC.clone().add(W(RR * Math.sin(a), 0, RR * Math.cos(a)));
  const dirIn = hd(PSI), M15 = onArc(PSI).addScaledVector(dirIn, L2R);                 // the way in: away and to the right
  // 15: frontal on the doorway wall (looking −z); the sphere comes in from the left round the ramp's bend and turns into the door
  const F15 = 28, D15 = dep(15, F15);
  const h15 = hold(15, { pass: true, t: [64.1, 65.2], tk: 64.6, mark: M15, dir: [0, 0, -1], fov: F15, plate: { depth: D15 + 8, in: [61.7, 63.6] } });

  /* ================= the sphere's path: one smooth curve through the whole group ================= */
  const px11 = 2 * W11 * h11.tanV / 1080, RC = h11.at(1095, 410, W11), RO = 270 * px11, RI = 137 * px11;
  const floor11 = RC.clone().add(W(0, -(RI - 1), 0));                   // sphere centre on the tunnel floor at the mouth
  const pts = [], at = {};
  const push = (name, p) => { if (name) at[name] = pts.length; pts.push(p.clone()); };
  // 11: tunnel floor → out of the mouth → down the stem → S-bend → the ribbon, toward the camera
  push('t0', floor11.clone().add(W(0, 0, -13)));
  push(null, floor11.clone().add(W(0, 0, -4)));
  // (batch 3, f11's builder: the S is board 11's ribbon: over the hole's rounded lip, down the chute, then its switchback,
  //  laid as contact points in board px, 1 above the ribbon's face; f11.js's ribbon is solved around this path)
  push('mouth', floor11.clone().add(W(0, 0, 0.1)));                       // on the hole's rounded bottom edge
  // (chute fix: straight down the chute, no sideways drift (the points had x −0.04 … −0.1 … +0.02: on screen the chute's
  //  contact line wandered ~7 px left and back, so its straight board edges needed widths that swelled and shrank))
  for (const a of [18, 36, 54, 72]) push(null, floor11.clone().add(W(0, -1.35 * (1 - Math.cos(a * Math.PI / 180)), 0.1 + 1.35 * Math.sin(a * Math.PI / 180))));   // over the edge (radius 1.35), down the chute
  push(null, floor11.clone().add(W(0, -1.14, 1.45)));                    // the chute's foot curves forward
  push('chute', floor11.clone().add(W(0, -1.38, 1.72)));                // (its foot: the elbow's corner)
  for (const [px, py, dz, nm] of [[1132, 626, 1.7], [1162, 634, 1.73], [1195, 645, 1.8], [1228, 655, 2.0], [1244, 664, 2.3, 'hp1'], [1232, 673, 2.65], [1205, 681, 2.85], [1165, 689, 3.0], [1125, 697, 3.1], [1085, 708, 3.25], [1048, 722, 3.4], [1025, 740, 3.75], [1022, 758, 4.15, 'hp2'], [1040, 777, 4.45], [1080, 795, 4.65], [1160, 815, 4.85], [1260, 862, 5.25]])
    push(nm || null, h11.at(px, py, W11 - dz).add(W(0, 1, 0)));          // board 11's switchback: contact points (board px) + 1 up
  push('m11', h11.mark);
  push(null, h11.at(1760, 1010, h11.depth - 4.5));
  // 11 → 12: sweeps out to the right past the camera, then straightens onto the road (+z)
  push(null, P(10, -3.5, 13));
  push(null, P(13, -4, 24));
  push('m12', M12);
  push('door', P(13, -4, 58.7));
  push('roof', P(13, -4, 62.2));
  push('bend', P(13, -4, ZA));
  for (let a = 15; a < 180; a += 15) push(a === 90 ? 'crest' : null, CU.clone().add(W(RU * Math.cos(rad(a)), 0, RU * Math.sin(rad(a)))));
  push('leg', P(XL, -4, ZA));
  // 13 → 14: along the right leg, off its end in a leap, onto the hill
  push('legEnd', legEnd);
  for (let k = 1; k < 5; k++) { const f = k / 5; push(null, legEnd.clone().add(W(0, -5.5 * f * f, -8 * f))); }
  push('land', land);
  push(null, land.clone().add(W(0, -LH * 0.5 * Math.sin(a20), -LH * 0.5 * Math.cos(a20))));
  // down the hill to the stop; then, from the stop, down-left along the band (the corner is tight: it turns while stopped)
  push(null, M14.clone().addScaledVector(dUp, 0.4));
  push('m14', M14);
  push(null, M14.clone().addScaledVector(dOut, 0.4));
  for (const k of [3, 6, 9, kK0 - 0.5]) push(null, M14.clone().addScaledVector(dOut, k));
  // the hill's foot: onto frame 15's ledge (it starts here), straight on, round the bend, into the doorway
  push('foot', K0);
  push(null, K0.clone().addScaledVector(hh, 0.5));
  push('ramp', S1);
  for (let i = 1; i < 5; i++) push(null, onArc(psi0 + (PSI - psi0) * i / 5));
  push('arcEnd', onArc(PSI));
  push('m15', M15);
  push('in', M15.clone().addScaledVector(dirIn, 9));
  push('end', M15.clone().addScaledVector(dirIn, 17));
  // (chute fix, user 2026-09-28: frame 11's chute "is not very smooth … kind of crooked". The hand-placed points from the
  //  tunnel's mouth to key 11 made the centripetal curve's bend jump at every point (to ~6/u between them), which kinked the
  //  sphere's run and, through the path's frame, every edge, side wall and twist of f11's ribbon. From `pre` u before knot i0
  //  to knot i1 the path is now one smooth spline: a cubic B-spline least-squares fit to the old curve (knots every h u of
  //  arc) with a third-difference penalty, so its bend changes evenly; held to the old curve at both ends (heavy weights) and
  //  blended into it over the last `bl` u, so it leaves the tunnel floor and passes key 11 exactly as before. Elsewhere the
  //  curve is the centripetal Catmull-Rom through the points, as before (the same parameter t). It keeps within ~0.09 u of
  //  the old path (≈ 4 px at the key). `firm` holds a stretch [knot a, knot b − back] to the old curve with weight w.)
  const smoothCurve = (P0, i0, i1, ND, { pre = 1, h = 0.2, lam = 0.05, bl = 0.5, hold = 0.3, firm = null } = {}) => {
    const C0 = new THREE.CatmullRomCurve3(P0, false, 'centripetal'); C0.arcLengthDivisions = ND;
    const Lz = C0.getLengths(), L0 = Lz[ND], nz = P0.length - 1, sT = t => { const x = Math.min(1, Math.max(0, t)) * ND, k = Math.min(ND - 1, Math.floor(x)), f = x - k; return Lz[k] + (Lz[k + 1] - Lz[k]) * f; };
    const sA = sT(i0 / nz) - pre, sB = sT(i1 / nz), lo = sA - 1, hi = sB + 0.8, k0 = lo - 3 * h, nb = Math.ceil((hi - lo) / h) + 3;
    const bs = x => { const u = (x - k0) / h, j = Math.floor(u), f = u - j, g = 1 - f;       // (the four cubic B-spline weights at x)
      return [[j - 3, g * g * g / 6], [j - 2, (3 * f * f * f - 6 * f * f + 4) / 6], [j - 1, (-3 * f * f * f + 3 * f * f + 3 * f + 1) / 6], [j, f * f * f / 6]]; };
    const M = Array.from({ length: nb }, () => new Float64Array(nb + 3)), p = new THREE.Vector3();
    for (let i = 0, n = Math.round((hi - lo) / 0.01); i <= n; i++) { const s = lo + (hi - lo) * i / n, w = s < sA + hold || s > sB - hold ? 1e4 : firm && s > sT(firm[0] / nz) && s < sT(firm[1] / nz) - firm[2] ? firm[3] : 1, b = bs(s);
      C0.getPointAt(Math.min(1, Math.max(0, s / L0)), p);
      for (const [j, a] of b) { if (j < 0 || j >= nb) continue; for (const [k, c] of b) if (k >= 0 && k < nb) M[j][k] += w * a * c; M[j][nb] += w * a * p.x; M[j][nb + 1] += w * a * p.y; M[j][nb + 2] += w * a * p.z; } }
    const pen = lam / h ** 5;                                                    // (third differences of the control points)
    for (let r = 0; r + 3 < nb; r++) { const d = [[r, -1], [r + 1, 3], [r + 2, -3], [r + 3, 1]]; for (const [j, a] of d) for (const [k, c] of d) M[j][k] += pen * a * c; }
    for (let c = 0; c < nb; c++) { let pv = c; for (let r = c + 1; r < nb; r++) if (Math.abs(M[r][c]) > Math.abs(M[pv][c])) pv = r; [M[c], M[pv]] = [M[pv], M[c]];
      for (let r = 0; r < nb; r++) if (r !== c && M[r][c]) { const k = M[r][c] / M[c][c]; for (let q = c; q < nb + 3; q++) M[r][q] -= k * M[c][q]; } }
    const cp = M.map((row, j) => new THREE.Vector3(row[nb] / row[j], row[nb + 1] / row[j], row[nb + 2] / row[j]));
    const fit = (s, o) => bs(s).reduce((a, [j, w]) => a.addScaledVector(cp[Math.min(nb - 1, Math.max(0, j))], w), o.set(0, 0, 0));
    const sm5 = x => { x = Math.min(1, Math.max(0, x)); return x * x * x * (10 - 15 * x + 6 * x * x); }, tmp = new THREE.Vector3();
    const C = new THREE.Curve();
    C.getPoint = (t, o = new THREE.Vector3()) => { C0.getPoint(t, o); const s = sT(t); if (s <= sA || s >= sB) return o;
      return o.lerp(fit(s, tmp), sm5((s - sA) / bl) * sm5((sB - s) / bl)); };
    C.arcLengthDivisions = ND;
    C.idxAt = s => C0.getUtoTmapping(s / L0) * nz;                             // (the point-list index at old arc s: for naming a spot)
    C.apex = (s0, r = 1) => { let best = s0, bk = -1; const q = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()], e = 0.02;   // (the fit's sharpest turn near old arc s0)
      for (let s = s0 - r; s <= s0 + r; s += 0.01) { fit(s - e, q[0]); fit(s, q[1]); fit(s + e, q[2]); const k = q[0].add(q[2]).addScaledVector(q[1], -2).length() / (e * e); if (k > bk) { bk = k; best = s; } } return best; };
    C.sOld = i => sT(i / nz);
    return C; };
  // (the lip and the chute, straight down to 0.3 u short of its foot, are held firmly (weight 50), so the fit's rounding of the
  //  elbow can't ripple back up into them as a sideways wobble)
  const C = smoothCurve(pts, at.mouth, at.m11, 8000, { firm: [at.mouth, at.chute, 0.3, 50] });
  for (const n of ['hp1', 'hp2']) at[n] = C.idxAt(C.apex(C.sOld(at[n])));   // (the hairpins' slow stretches centre on the smooth turns' apexes)
  const Ls = C.getLengths(), L = Ls[8000], np = pts.length - 1;
  const sOf = name => { const x = at[name] / np * 8000, i = Math.floor(x), f = x - i; return Ls[i] + (Ls[Math.min(8000, i + 1)] - Ls[i]) * f; };
  const airA = sOf('legEnd'), airB = sOf('land');
  const sFt = sOf('foot');                                               // (never below rolling height just past the hill's foot)
  const piece = (s0, s1) => u => { const s = s0 + (s1 - s0) * u, p = C.getPointAt(s / L); if (s > sFt - 0.3 && s < sFt + 3) p.y = Math.max(p.y, FLOOR + 1);
    return { p, c: s > airA + 0.2 && s < airB - 0.2 ? 0 : 1, tan: C.getTangentAt(s / L) }; };
  // timing: knots [t, arc length] run as consecutive segs with no speed jumps (runSegs); the marks land on their key instants;
  // big-sphere frames (12, 14, 15) ease to ~6–7 u/s. TIM mirrors every piece so camera poses can be placed on the sphere.
  const TIM = [];
  const run = (kn, v0, v1) => { const pcs = kn.slice(1).map((k, i) => [kn[i][0], k[0], k[1] - kn[i][1], kn[i][1]]);
    const vk = runSegs(pcs.map(([a, b, Lp, s0]) => [a, b, Lp, piece(s0, s0 + Lp)]), v0, v1);
    pcs.forEach(([a, b, Lp, s0], i) => { const d = Lp / (b - a); let m0 = vk[i] / d, m1 = vk[i + 1] / d; const r = Math.hypot(m0, m1) / 3; if (r > 1) { m0 /= r; m1 /= r; }
      TIM.push({ a, b, s0, s1: s0 + Lp, e: V.easeH(m0, m1) }); }); };
  const ease0 = V.easeH(0, 0);                                          // from rest to rest
  const still = (a, b, s0, s1) => { seg(a, b, ease0, piece(s0, s1)); TIM.push({ a, b, s0, s1, e: ease0 }); };
  const sM14 = sOf('m14');
  // (review fix: the switchback's two hairpins (hp1, hp2) are tighter than the sphere: at a steady ~9.7 u/s it turned each
  //  almost instantly and read as ricocheting between walls. It now eases to ~5.5 u/s round each (a short slow stretch, 2·HW
  //  long, at VC on average) and picks up again between them; the mouth (42.95) and key 11 keep their times.)
  const sMo = sOf('mouth'), sH1 = sOf('hp1'), sH2 = sOf('hp2'), sK11 = sOf('m11'), HW = 0.9, VC = 6.5;
  const tCn = 2 * HW / VC, vRn = (sK11 - sMo - 4 * HW) / (h11.tk - 42.95 - 2 * tCn);
  const tH1 = 42.95 + (sH1 - HW - sMo) / vRn, tH2 = tH1 + tCn + (sH2 - sH1 - 2 * HW) / vRn;
  // 41.4 → the stop on frame 14's ramp
  run([
    [41.4, sOf('t0')], [42.95, sMo], [tH1, sH1 - HW], [tH1 + tCn, sH1 + HW], [tH2, sH2 - HW], [tH2 + tCn, sH2 + HW], [h11.tk, sK11],
    [h12.tk - 0.6, sOf('m12') - 4.4], [h12.tk, sOf('m12')], [h12.tk + 0.6, sOf('m12') + 4.4],
    [52.85, sOf('door')],                                                // (revision: rolls on at ~7 u/s; into the doorway at ~52.85)
    // (batch 3 integration: ~7.3 u/s through key 13, so the sphere is still in frame, low right, as the camera moves off;
    //  fix pass 2: a little slower after the crest (4.2 in 0.6 s), so the camera's yaw catches it as it moves off)
    [h13.tk - 0.6, sOf('crest') - 4.4], [h13.tk, sOf('crest')], [h13.tk + 0.6, sOf('crest') + 4.2],
    [57.78, sOf('land')],
    [STOP0, sM14 + 0.07],                                                // slows to a stop a hair past its spot…
  ], 8.5, 0);
  still(STOP0, SETTLE, sM14 + 0.07, sM14 - 0.015);                      // …rocks back a touch…
  still(SETTLE, STILL0, sM14 - 0.015, sM14);                             // …settles on it…
  still(STILL0, GO, sM14, sM14);                                         // …and sits still (the key instant is in here)
  // then down-left along the band from rest, onto the ledge, round the bend, into the doorway
  run([
    [GO, sM14], [62.6, sOf('foot')],
    [h15.tk - 0.6, sOf('m15') - 3.8], [h15.tk, sOf('m15')], [h15.tk + 0.6, sOf('m15') + 3.8],
    [66.9, sOf('end')],
  ], 0, 7.5);
  // the same timing, mirrored here so camera keys can be placed relative to where the sphere really is at time t
  const bAt = t => { let q = TIM.find(x => t <= x.b); if (!q) q = TIM[TIM.length - 1];
    const u = Math.min(1, Math.max(0, (t - q.a) / (q.b - q.a))); return C.getPointAt((q.s0 + (q.s1 - q.s0) * q.e(u)) / L); };

  /* ================= stand-in props ================= */
  // fade helper: windows [in0, in1, out0, out1] → opacity (max over windows)
  const fades = (m, wins) => anim(t => {
    let a = 0;
    for (const [a0, a1, b0, b1] of wins) { const k = Math.min(Math.min(1, Math.max(0, (t - a0) / Math.max(1e-3, a1 - a0))), 1 - Math.min(1, Math.max(0, (t - b0) / Math.max(1e-3, b1 - b0)))); a = Math.max(a, k * k * (3 - 2 * k)); }
    m.visible = a > 0.002; m.material.uniforms.op.value = a;
  });
  const showIf = (m, t0, t1) => anim(t => { m.visible = t >= t0 && t <= t1; });
  // the track under the sphere: a swept cross-section along the path (profile points [side, up] from the ball centre)
  const sweep = (s0, s1, prof, cols, mo = {}) => {
    const n = Math.max(8, Math.ceil((s1 - s0) / 0.3)), pos = [], ind = [];
    let m = 0;
    for (let i = 0; i <= n; i++) {
      const s = s0 + (s1 - s0) * i / n, u = s / L, p = C.getPointAt(u), t = C.getTangentAt(u);
      const side = new THREE.Vector3().crossVectors(t, up).normalize(), nr = new THREE.Vector3().crossVectors(side, t).normalize();
      const pr = prof(s); m = pr.length;
      for (const [a, b] of pr) pos.push(p.x + side.x * a + nr.x * b, p.y + side.y * a + nr.y * b, p.z + side.z * a + nr.z * b);
    }
    for (let i = 0; i < n; i++) for (let k = 0; k < m - 1; k++) { const a = i * m + k, b = a + m; ind.push(a, b, a + 1, a + 1, b, b + 1); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(ind); g.computeVertexNormals();
    const mesh = add(g, mat(cols, { side: THREE.DoubleSide, ...mo }));
    mesh.renderOrder = mo.order ?? 2;
    return mesh;
  };
  const sm = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
  const slab = (w, th = 0.9) => [[-w / 2, -1 - th], [-w / 2, -1], [w / 2, -1], [w / 2, -1 - th]];
  const semi = (rp, lip = 0.35, k = 14) => { const out = [[-rp - lip, rp - 1 - 0.25], [-rp - lip, rp - 1]]; for (let i = 0; i <= k; i++) { const f = Math.PI * i / k; out.push([-rp * Math.cos(f), rp - 1 - rp * Math.sin(f)]); } out.push([rp + lip, rp - 1], [rp + lip, rp - 1 - 0.25]); return out; };
  const archP = (w = 7.5, h = 8.6, k = 20) => { const r = w / 2, wall = h - r, out = [[-r, -1], [-r, -1 + wall]]; for (let i = 1; i < k; i++) { const f = Math.PI - Math.PI * i / k; out.push([r * Math.cos(f), -1 + wall + r * Math.sin(f)]); } out.push([r, -1 + wall], [r, -1], [-r, -1]); return out; };
  const zAx = (a, b) => ({ axis: [0, 0, 1], lo: a, hi: b });
  const s11 = sOf('m11'), s12 = sOf('m12');
  // frames 11–15: each frame's set lives in its own file (groups/g3/f11.js … f15.js), called here in frame order with the shared
  // context (key moments, the sphere's path, helpers). The journey (key moments, the path and its timing, camera, captions)
  // stays here.
  { const G = { V, THREE, up, T, dep, P, W, rad, h11, h12, h13, h14, h15, F11, W11, M12, ZA, RU, XL, CU, crest, legEnd, land, a20, LH, M14, C14, foot, dirIn, M15, F15, D15,
      nQ, dOut, K0, S1, KC, RR, onArc, psi0, PSI, STOP0, STILL0, GO,
      px11, RC, RO, RI, floor11, C, L, sOf, airA, airB, bAt, fades, showIf, sweep, sm, slab, semi, archP, zAx, s11, s12 };
    for (const f of [f11, f12, f13, f14, f15]) f(V, G); }


  /* ================= camera: ONE smooth curve from the cut in to the cut out, laid as dense keys =================
     As g2.js: a quintic Hermite through the poses (position, view direction, look distance, look-follow and lens are
     continuous up to acceleration), laid as keys every 0.025 s. The look-follow is baked into the keys toward the sphere
     averaged over ±0.2 s (bAt, the path's own timing), so the view doesn't bump.
     (revision: never stop) each key moment is a pose of its own at a low speed (sp, about a quarter of the cruise), not a
     still hold, and the whole group is ONE move, so the camera is never at rest between 41.4 and 66.85. */
  const Vec = THREE.Vector3, DTK = 0.025;
  const PV = (pos, look, f, fov) => [...pos.toArray(), ...look.toArray(), f, fov];
  const Kp = (t, pos, look, f, fov, o = {}) => ({ t, v: PV(pos, look, f, fov), ...o });
  // the key moment itself: the board's framing at tk (the engine's own pass key sits there), passed at speed sp (along the
  // chord of its neighbours, or along vel if given)
  const Kk = (h, sp, vel) => ({ t: h.tk, v: PV(h.pos, h.look, 0, h.fov), own: true, sp, ...(vel ? { vel: vel.clone().normalize().multiplyScalar(sp) } : {}) });
  // a pose relative to the sphere at t (the old ck): offsets for the camera and its look target
  const kR = (t, off, lookOff, f, fov, o) => { const b = bAt(t); return Kp(t, b.clone().add(off), b.clone().add(lookOff), f, fov, { lo: lookOff.clone(), ...o }); };
  // a look from pos that shows the sphere (at b) at screen spot (sx, sy)
  const aimLook = (pos, b, sx, sy, fov) => { const u = b.clone().sub(pos).normalize(), rt = new Vec().crossVectors(u, up).normalize(), uv = new Vec().crossVectors(rt, u);
    const tv = T(fov), d = u.clone().addScaledVector(rt, -(sx - 960) / 540 * tv).addScaledVector(uv, -(540 - sy) / 540 * tv).normalize();
    return pos.clone().addScaledVector(d, pos.distanceTo(b)); };
  // a pose at pos, aimed so the sphere shows at (sx, sy); kS: the same with pos given relative to the sphere (the old ckS)
  const kA = (t, pos, sx, sy, fov, o) => Kp(t, pos, aimLook(pos, bAt(t), sx, sy, fov), 0, fov, { aim: [sx, sy], ...o });
  const kS = (t, off, sx, sy, fov, o) => kA(t, bAt(t).add(off), sx, sy, fov, o);
  const ballS = (t, w = 0.2) => { const S = new Vec(); let Wt = 0;
    for (let i = -8; i <= 8; i++) { const k = 0.5 + 0.5 * Math.cos(Math.PI * i / 9); S.addScaledVector(bAt(t + w * i / 8), k); Wt += k; } return S.multiplyScalar(1 / Wt); };
  const q5 = (p0, v0, a0, p1, v1, a1, h, u) => { const u2 = u * u, u3 = u2 * u, u4 = u3 * u, u5 = u4 * u;
    return p0 * (1 - 10 * u3 + 15 * u4 - 6 * u5) + h * v0 * (u - 6 * u3 + 8 * u4 - 3 * u5) + h * h * a0 * (0.5 * u2 - 1.5 * u3 + 1.5 * u4 - 0.5 * u5)
      + h * h * a1 * (0.5 * u3 - u4 + 0.5 * u5) + h * v1 * (-4 * u3 + 7 * u4 - 3 * u5) + p1 * (10 * u3 - 15 * u4 + 6 * u5); };
  // (review fix) a ramp–cruise–ramp profile, 0 → 1 over u ∈ [0, 1]: its rate starts at m0 and eases (smoothstep, so with no
  // jolt) up to an even cruise over the first r1, then down to m1 over the last r2. Its peak rate is lower than a cubic's.
  const ramp = (m0, m1, r1, r2) => { const c = (1 - m0 * r1 / 2 - m1 * r2 / 2) / (1 - r1 / 2 - r2 / 2), IS = x => x * x * x - x * x * x * x / 2;   // (∫ smoothstep)
    const A = r1 * (m0 + c) / 2, B = A + c * (1 - r1 - r2), Dn = r2 * (m1 + c) / 2;
    return u => { u = Math.min(1, Math.max(0, u)); if (u <= r1) return m0 * u + (c - m0) * r1 * IS(u / r1);
      if (u <= 1 - r2) return A + c * (u - r1); const w = 1 - u; return B + Dn - (m1 * w + (c - m1) * r2 * IS(w / r2)); }; };
  const toW = v => { const w = new Vec(v[3] - v[0], v[4] - v[1], v[5] - v[2]), Lw = w.length(); w.multiplyScalar(1 / Lw); return [v[0], v[1], v[2], w.x, w.y, w.z, Lw, v[6], v[7]]; };
  const fromW = w => { const d = new Vec(w[3], w[4], w[5]).normalize(); return [w[0], w[1], w[2], w[0] + d.x * w[6], w[1] + d.y * w[6], w[2] + d.z * w[6], w[7], w[8]]; };
  // P: poses { t, v, still?, own?, sp? (own camera speed), vend? (a free end's speed factor) }. A free first / last pose (not
  // a still hold) moves along the chord to its neighbour (× vend), with no acceleration.
  const move = P => { const n = P.length, Z = () => new Array(9).fill(0);
    for (const p of P) p.w = toW(p.v);
    const d3 = (p, q, j) => Math.hypot(p.w[j] - q.w[j], p.w[j + 1] - q.w[j + 1], p.w[j + 2] - q.w[j + 2]);
    const tang = (m, d) => { const k = m[3] * d[3] + m[4] * d[4] + m[5] * d[5]; for (let q = 3; q < 6; q++) m[q] -= k * d[q]; return m; };
    for (let i = 0; i < n; i++) { const p = P[i]; if (p.dw) continue;
      if (p.still) { p.dw = Z(); continue; }
      if (i === 0 || i === n - 1) { const A = P[i === 0 ? 0 : i - 1], B = P[i === 0 ? 1 : i];
        p.dw = tang(A.w.map((_, j) => (B.w[j] - A.w[j]) / (B.t - A.t) * (p.vend ?? 1)), p.w); continue; }
      const A = P[i - 1], B = P[i + 1], m = tang(p.w.map((_, j) => (B.w[j] - A.w[j]) / (B.t - A.t)), p.w);
      for (const j of [0, 3]) { const Lm = Math.hypot(m[j], m[j + 1], m[j + 2]), want = j === 0 && p.sp != null ? p.sp : (d3(A, p, j) / (p.t - A.t) + d3(p, B, j) / (B.t - p.t)) / 2;
        if (Lm > 1e-6) for (let q = j; q < j + 3; q++) m[q] *= want / Lm; }
      if (p.vel) { m[0] = p.vel.x; m[1] = p.vel.y; m[2] = p.vel.z; }          // (a given velocity: the key moments' drift)
      if (p.turn != null) for (let q = 3; q < 6; q++) m[q] *= p.turn;          // (a key moment's view turns slowly through it)
      p.dw = m; }
    for (let i = 0; i < n; i++) if (!P[i].aw) { if (P[i].still || i === 0 || i === n - 1) { P[i].aw = Z(); continue; }
      const A = P[i - 1], C = P[i], B = P[i + 1], hA = C.t - A.t, hB = B.t - C.t;
      P[i].aw = C.w.map((_, j) => ((6 * (A.w[j] - C.w[j]) + 2 * hA * A.dw[j] + 4 * hA * C.dw[j]) / (hA * hA) + (6 * (B.w[j] - C.w[j]) - 4 * hB * C.dw[j] - 2 * hB * B.dw[j]) / (hB * hB)) / 2); }
    const at = t => { let i = 0; while (i < n - 2 && t > P[i + 1].t) i++;
      const A = P[i], B = P[i + 1], h = B.t - A.t, u = Math.min(1, Math.max(0, (t - A.t) / h));
      return fromW(A.w.map((_, j) => q5(A.w[j], A.dw[j], A.aw[j], B.w[j], B.dw[j], B.aw[j], h, u))); };
    // the dense keys are sampled first (S), so the picture's spin can be smoothed over them (rollSmooth) before they are laid
    const S = [];
    const sample = (t, own) => { const v = at(t), f = Math.min(1, Math.max(0, v[6]));
      S.push({ t, own, pos: new Vec(v[0], v[1], v[2]), look: new Vec(v[3], v[4], v[5]).lerp(ballS(t), f), fov: v[7], roll: 0 }); };
    const t0 = P[0].t, t1 = P[n - 1].t, NK = Math.round((t1 - t0) / DTK);
    for (let k = 0; k <= NK; k++) { const t = t0 + (t1 - t0) * k / NK;             // (evenly spaced: an odd last gap kinks the key Hermite)
      sample(t, P.some(p => p.own && Math.abs(p.t - t) < 0.01)); }
    // a move that starts / ends free (a shot's first / last key, at a cut): the engine holds the camera still on a shot's first
    // and last key, so one more key 0.5 ms inside each keeps the full speed through every shown frame; the stop falls between
    // the cut and the first / last shown frame
    if (!P[0].still) sample(t0 + 5e-4, false);
    if (!P[n - 1].still) sample(t1 - 5e-4, false);
    for (const p of P) if (p.own) sample(p.t, true);                                 // (the key moments: laid by the engine's hold())
    S.sort((a, b) => a.t - b.t);
    rollSmooth(S);
    for (const s of S) if (!s.own) key(s.t, s.pos, s.look, { f: 0, fov: s.fov, roll: s.roll }); };
  // (review fix) the picture's spin about the view axis. Looking steeply down, a small change in the view's heading spins the
  // whole picture (the lookAt keeps world-up): the flip over the sphere spun it at up to ~600°/s, and key 13's aerial at up to
  // ~190°/s right from the key instant. In each window the spin is re-timed by rolling the camera: the picture turns through
  // the same total angle, but evenly (a Hermite from the natural rate at the window's start to its rate at the end), and at
  // each anchor (a key moment) it holds still, with the roll exactly 0 there so the key framing is untouched. Outside the
  // windows the roll is 0 (and it meets them with matching rates, so there is no step).
  const ROLLW = [{ a: 41.45, b: 42.8, an: [] }, { a: 54.25, b: 57.1, an: [h13.tk] }];
  const rollSmooth = S => {
    const R = S.map(s => { const f = s.look.clone().sub(s.pos).normalize(); return { f, r: new Vec().crossVectors(f, up).normalize() }; });
    const phi = [0];                                                              // the natural spin, accumulated (°)
    for (let i = 1; i < S.length; i++) { const a = R[i - 1].r, b = R[i].r; phi.push(phi[i - 1] + Math.atan2(new Vec().crossVectors(a, b).dot(R[i].f), a.dot(b)) * 180 / Math.PI); }
    const phiAt = t => { let i = S.findIndex(s => s.t >= t); if (i <= 0) return phi[Math.max(0, i)]; const u = (t - S[i - 1].t) / (S[i].t - S[i - 1].t); return phi[i - 1] + (phi[i] - phi[i - 1]) * u; };
    const rate = t => (phiAt(t + 0.02) - phiAt(t - 0.02)) / 0.04;
    for (const Wn of ROLLW) {
      const kn = [Wn.a, ...Wn.an, Wn.b].map((t, i, A) => ({ t, p: phiAt(t), m: i === 0 || i === A.length - 1 ? rate(t) : 0 }));
      S.forEach((s, i) => { if (s.t <= Wn.a || s.t >= Wn.b) return; let j = 0; while (j < kn.length - 2 && s.t > kn[j + 1].t) j++;
        const A = kn[j], B = kn[j + 1], h = B.t - A.t, u = (s.t - A.t) / h, u2 = u * u, u3 = u2 * u;
        const want = (2 * u3 - 3 * u2 + 1) * A.p + (u3 - 2 * u2 + u) * h * A.m + (-2 * u3 + 3 * u2) * B.p + (u3 - u2) * h * B.m;
        s.roll = phi[i] - want; }); } };

  // re-time a stretch of poses (the first and last are key moments, kept) so the camera runs its path (the poses' places, in
  // order) on one even profile: from vA u/s at the start, ramping to a steady cruise over r0 s, and ramping to vB u/s over the
  // last r1 s. Each inner pose keeps its place; a pose placed on the sphere (kR) or aimed at it (kA / kS) keeps looking at the
  // sphere where it is at its new time.
  const retime = (P, vA, vB, r0 = 0.7, r1 = 0.7) => { const n = P.length, t0 = P[0].t, Tm = P[n - 1].t - t0, cum = [0];
    for (let i = 1; i < n; i++) cum.push(cum[i - 1] + Math.hypot(...[0, 1, 2].map(j => P[i].v[j] - P[i - 1].v[j])));
    const S = cum[n - 1], v = (S - vA * r0 / 2 - vB * r1 / 2) / (Tm - r0 / 2 - r1 / 2), aA = (v - vA) / r0, aB = (v - vB) / r1;
    const dA = (vA + v) / 2 * r0, dB = S - (v + vB) / 2 * r1;
    const tq = (v0, a, d) => Math.abs(a) > 1e-9 ? (-v0 + Math.sqrt(Math.max(0, v0 * v0 + 2 * a * d))) / a : d / v0;   // time to cover d from v0 at a
    const tOf = d => d <= dA ? tq(vA, aA, d) : d <= dB ? r0 + (d - dA) / v : Tm - tq(vB, aB, S - d);
    for (let i = 1; i < n - 1; i++) { const p = P[i], tt = tOf(cum[i]); p.t = t0 + tt;
      p.sp = tt <= r0 ? vA + aA * tt : tt <= Tm - r1 ? v : vB + aB * (Tm - tt);
      const b = bAt(p.t);
      if (p.lo) { const lk = b.clone().add(p.lo); p.v[3] = lk.x; p.v[4] = lk.y; p.v[5] = lk.z; }
      if (p.aim) { const lk = aimLook(new Vec(p.v[0], p.v[1], p.v[2]), b, p.aim[0], p.aim[1], p.v[7]); p.v[3] = lk.x; p.v[4] = lk.y; p.v[5] = lk.z; } }
    return P; };
  const inner = P => P.slice(1, -1);
  const CAM = [];

  // 10 → 11, the chase (revision, user: "the camera will follow the ball from behind and then speed ahead … as it keeps the
  // sphere in its frame. The camera passes through the tunnel to the other side first, and the camera orbits around and flips
  // so it can watch. It pulls back so it can watch the ball come out of the tunnel … around 42.9"). Contract at 41.4 (G2 → G3):
  // inside the tunnel ~3 behind the sphere, both running into the screen (+z here) at ~9 u/s, the sphere centred (G2 ends at
  // fov 50, looking ~5° down at it: the first pose matches). From there
  // the camera gathers speed and passes over the sphere's top left (it has 2.7 u of tube to do it in), looking at it all the
  // way, so it orbits round it and ends up facing it; it leaves the ring first (~42.45) and pulls back as the sphere comes out
  // of the tunnel (its front at the mouth ~42.85) and drops over the lip (~43.1). Offsets are from the sphere (x right, y up,
  // z out of the wall); the look is the sphere itself (follow 1).
  // (review fix: the pass over the top is a little wider (1.4 u to the left at the top, was 0.85), and the framing breathes:
  //  while the camera overtakes, the view aims up to ~0.5 u ahead of the sphere instead of pinning it dead centre, settling
  //  back on it as the camera turns to face it (~42.46). The picture's spin about the view axis over the top (the flip) is
  //  spread evenly over 41.45–42.8 by the roll smoother in move(): it peaked at ~600°/s, ~20° per frame.)
  for (const [t, x, y, z, fov, ld] of [[41.4, 0, 0.25, -3.0, 50, 0], [41.6, 0, 0.6, -2.75, 56, 0.35], [41.78, -0.3, 1.45, -2.1, 63, 0.7],
      [41.93, -0.65, 2.35, -1.1, 67, 0.8], [42.05, -0.85, 2.85, 0.0, 68, 0.7], [42.17, -0.8, 2.8, 1.2, 67, 0.5], [42.3, -0.5, 2.45, 2.5, 64, 0.25],
      [42.46, -0.2, 2.05, 4.0, 58, 0], [42.66, 0.05, 1.8, 6.1, 50, 0], [42.9, 0.2, 1.6, 9.0, 44, 0]]) {
    const b = bAt(t); CAM.push(Kp(t, b.clone().add(W(x, y, z)), b.clone().add(W(0, 0, 2.5 * ld)), 0.75, fov)); }
  // …then straight back to frame 11's framing, the sphere easing from the centre to its board spot as the lens narrows.
  // (review fix: the slow window round key 11 was a sharp V: under 8 u/s for only ~0.4 s. The pull-back now carries the chase's
  //  speed on a little (to ~25 u/s) and eases out on a quintic, so its last ~0.35 s are under 8 u/s, and the orbit after the
  //  key ramps in gently (below): under ~8 u/s from ~44.5 to ~45.3. Poses every 0.25 s carry their own speed. They are laid
  //  once the key's own velocity is known, from the orbit.)
  const iPB = CAM.length;
  const K11 = Kk(h11, 5); CAM.push(K11);                                   // (its velocity is the orbit's own, below)

  // 11 → 12: from the key the camera orbits round the sphere's left side as it comes on and passes: from the key's own angle to
  // 180° (right behind it) on an ease-in-out, closing in on it (at the key it backs away a little slower than the sphere comes
  // on: ~5 u/s), lifting ~4 u mid-orbit so it looks down onto the road; the sphere drifts from its board spot to the centre.
  // The orbit ends at 48.95 right behind the sphere, moving with it on the line of frame 12's view; the camera slows to 4 u/s at
  // the key instant as the sphere pulls away down the road.
  // (review fix: the orbit's turn ramps in over its first ~1.2 s (it reached ~50°/s within 0.6 s of the key), cruises evenly
  //  (a ramp–cruise–ramp profile: its peak is ~1.3× its mean, was 1.5×) and ends at 48.95 (was 48.7), so the view turns
  //  more gently all the way round)
  { const tS = h11.tk, tE = 48.95, v12 = 4.0, vS = bAt(tE + 0.01).sub(bAt(tE - 0.01)).length() / 0.02;
    const pp = h12.pos.clone().addScaledVector(h12.fwd, -(vS + v12) / 2 * (h12.tk - tE)), pre = Kp(tE, pp, pp.clone().addScaledVector(h12.fwd, 10), 0, h12.fov, { sp: vS });
    const o0 = h11.pos.clone().sub(bAt(tS)), r0 = Math.hypot(o0.x, o0.z), th0 = Math.atan2(-o0.x, o0.z), y0 = o0.y;
    const rel = pp.clone().sub(bAt(tE)), rEnd = Math.hypot(rel.x, rel.z), yEnd = rel.y, TT = tE - tS;
    // the orbit's radius and angle start with the rates that leave the camera backing away at ~4 u/s at the key instant (the
    // sphere comes on and across; the orbit's first turn takes up its sideways motion)
    const vb = bAt(tS + 0.01).sub(bAt(tS - 0.01)).multiplyScalar(50), rd = W(-Math.sin(th0), 0, Math.cos(th0)), tg = W(-Math.cos(th0), 0, -Math.sin(th0));
    const want = rd.clone().multiplyScalar(4).sub(W(vb.x, 0, vb.z)), mR = want.dot(rd) * TT / (rEnd - r0), mT = Math.max(0, want.dot(tg) * TT / (r0 * (Math.PI - th0)));
    const eT = ramp(mT, 0, 0.25, 0.22);                                                 // the turn: 0 → 1, rate mT at the start
    // (integration: mid-orbit the sphere drifts left of centre (lead room: it is heading for screen right) so the view looks
    //  ahead to frame 12's arches rising, not back at frame 11's leaving wall, and the lens widens more (fov 41 at the middle))
    // (review fix: the sphere's screen spot ends where the pose after the orbit shows it (it dipped ~85 px at 48.7–48.9), and
    //  the orbit's angle is solved so that the VIEW's heading, not the orbit, follows the even profile: the sphere's drift
    //  across the screen had added ~15°/s to the turn in the orbit's first half)
    const tvP = T(h12.fov), dP = bAt(tE).sub(pp), zP = dP.dot(h12.fwd), sE = [960 + dP.dot(h12.right) / zP / tvP * 540, 540 - dP.dot(h12.upv) / zP / tvP * 540];
    const spot = u => { const e2 = Math.min(1, u / 0.8), sc = e2 * e2 * (3 - 2 * e2), ld = Math.sin(Math.PI * eT(u));
      return [1417 + (sE[0] - 1417) * sc - 330 * ld * ld, 878 + (sE[1] - 878) * sc, 28 + 2 * u + 13 * ld]; };
    const dlt = u => { const [sx, , fv] = spot(u); return Math.atan((sx - 960) / 540 * T(fv)); }, d0 = dlt(0), d1 = dlt(1);
    const thAt = u => Math.PI + dlt(u) - ((Math.PI - th0 + d0) * (1 - eT(u)) + d1 * eT(u));   // (th0 at 0, π at 1)
    const offAt = u => { const uu = Math.min(1, Math.max(0, u)), e = eT(uu), er = q5(0, mR, 0, 1, 0, 0, 1, uu), ld = Math.sin(Math.PI * e);
      const th = thAt(uu), r = r0 + (rEnd - r0) * er; return W(-r * Math.sin(th), y0 + (yEnd - y0) * uu * uu * (3 - 2 * uu) + 4 * ld * ld, r * Math.cos(th)); };
    const camAt = t => bAt(t).add(offAt((t - tS) / (tE - tS)));
    K11.vel = camAt(tS + 0.01).sub(camAt(tS)).multiplyScalar(100); K11.sp = K11.vel.length();   // (one-sided: the orbit starts here)
    const vAt = t => camAt(t + 0.005).sub(camAt(t - 0.005)).multiplyScalar(100);                // (each pose moves as the orbit does)
    for (let k = 1; k < 16; k++) { const u = k / 16, t = tS + (tE - tS) * u, [sx, sy, fv] = spot(u); CAM.push(kS(t, offAt(u), sx, sy, fv, { vel: vAt(t) })); }
    CAM.push(pre); }
  // the pull-back to key 11 (see above): a quintic in distance along the line, from the chase's 21 u/s (still gathering) to
  // key 11's own speed; the aim eases the sphere from the centre onto its board spot and the lens narrows 44 → 28
  // (it bends gently onto the orbit's own direction at the key (a quadratic Bézier, walked by arc length), so the camera's
  //  heading doesn't turn 12° in the last 0.2 s before the key)
  { const A0 = CAM[iPB - 1], pA = new Vec(...A0.v.slice(0, 3)), pK = h11.pos, T0 = A0.t, HH = h11.tk - T0, v0 = 21;
    const pC = pK.clone().addScaledVector(K11.vel.clone().normalize(), -0.35 * pK.distanceTo(pA));
    const bz = s => pA.clone().multiplyScalar((1 - s) * (1 - s)).addScaledVector(pC, 2 * (1 - s) * s).addScaledVector(pK, s * s);
    const NB = 400, cl = [0]; for (let i = 1; i <= NB; i++) cl.push(cl[i - 1] + bz(i / NB).distanceTo(bz((i - 1) / NB)));
    const Dk = cl[NB], atLen = d => { let i = 1; while (i < NB && cl[i] < d) i++; return bz((i - 1 + (d - cl[i - 1]) / Math.max(1e-9, cl[i] - cl[i - 1])) / NB); };
    A0.sp = v0;
    const dAt = u => q5(0, v0, 15, Dk, K11.sp, 0, HH, u), vAt = u => (dAt(Math.min(1, u + 1e-4)) - dAt(Math.max(0, u - 1e-4))) / (Math.min(1, u + 1e-4) - Math.max(0, u - 1e-4)) / HH;
    const PB = [];
    for (let t = T0 + 0.2; t < h11.tk - 0.15; t += 0.25) { const u = (t - T0) / HH, e = u * u * (3 - 2 * u), ef = 1 - (1 - u) * (1 - u);
      PB.push(kA(t, atLen(dAt(u)), 960 + 457 * e, 540 + 338 * e, 44 - 16 * ef, { sp: vAt(u) })); }
    CAM.splice(iPB, 0, ...PB); }
  const K12 = Kk(h12, 4.0); CAM.push(K12);

  // 12 → 13: frame 12's long slow window: the camera creeps after the sphere down the road (3 u/s at the key, still only ~4–5
  // by 51) while it rolls on into the dark doorway; then it cranes up and over the tunnel, tilting down to find it coming out
  // of the far end into the cut-open pipe and round into the U-bend.
  // (fix pass: 52.2–53.1 showed almost nothing but the flat violet tops of frame 12's far arches and the tunnel roof, with the
  //  sphere hidden in the tunnel. The crane rises higher and further forward and looks ahead over the tunnel, to frame 13's
  //  pipe laying itself out and its tiles rising, and picks the sphere up as it comes out.)
  { const d = (4.0 + 5.5) / 2 * (51.2 - h12.tk), p = h12.pos.clone().addScaledVector(h12.fwd, d).add(W(0, 0.15, 0)), P51 = Kp(51.2, p, p.clone().add(h12.look.clone().sub(h12.pos)).add(W(0, 0.25, 0)), 0, h12.fov + 0.6, { sp: 5.5 });
    CAM.push(P51);
    // (revision: the sphere is slower down the road now, so the crane is no longer placed on it until it is up: first it runs on
    //  low, through the backdrop wall's ∩ notch under the peach arch's crown (y < −1 at z 31–33.5; a pose placed on the slower
    //  sphere took it through the wall above the notch at 51.8), then rises toward the violet frame as that sinks away)
    const E12 = (d, h) => h12.pos.clone().addScaledVector(h12.fwd, d).add(W(0, h, 0)), lk12 = (p, dn) => p.clone().add(W(0, -dn, 10));
    const pN = E12(12.6, 1.5), pR = E12(19.5, 6.5);
  CAM.push(...inner(retime([P51,
    Kp(51.75, pN, lk12(pN, 1.6), 0.15, 33),
    Kp(52.3, pR, lk12(pR, 3.2), 0.12, 36),
    // (review fix: 53.2–54.2 was half a frame of flat violet (the copy panel) with board 13's tiles still out of frame: the
    //  crane now looks further ahead (pitch ~−47° at 53.6, was −62°) (the lens held ~40°: widening it as the crane pushed on cancelled the motion, a dolly-zoom), so the U-bend and the tile mosaic rising
    //  share the frame with the sphere from ~53.3; it tilts down onto the aerial from there)
    kR(52.8, W(0, 15, -8.5), W(0, -5, 11), 0.18, 39),
    kR(53.6, W(0.3, 16.5, -8.5), W(0, -3, 12), 0.25, 41),
    kR(54.3, W(0.6, 18, -6.5), W(0, -1, 4.5), 0.45, 36),
    Kk(h13, 3.0)], 5.5, 3.0, 0.8, 1.3))); }
  // (review fix: key 13 is eased like the others now: 3 u/s at the key (was 4; looking straight down from ~20 u, every unit of
  //  travel slides the whole picture), longer ramps in and out, and its view's turn damped through the key)
  const K13 = { ...Kk(h13, 3.0), turn: 0.35 }; CAM.push(K13);

  // 13 → 14: swoop down in front of it as it leaps off the leg onto the hill, tilting up the slope (pitch −85° → +12°), then
  // back away down the hill ahead of it, slower and slower, as it slows to its stop; the camera keeps drifting through the
  // stop (~3.5 u/s: it turns to drift left round the sphere, the way the sphere will go).
  // (the key's own velocity comes from the 14 → 15 orbit below, so the swoop is re-timed onto it after that is set up)
  const SWOOP = [K13,
    kR(56.9, W(6, 15, -2.5), W(0, -1, 4), 0, 34),
    kR(57.6, W(4, 7, -9), W(0, 0, 1), 0.4, 38),
    kR(58.3, W(2.5, 0, -13), W(0, 0.3, 1), 0.6, 36),
    // (review fix: aimed so the sphere is already near its board spot (1255, 308) as the camera settles onto key 14's view:
    //  it swung ~370 px across the screen in the last second before the stop, up to ~940 px/s)
    kS(58.95, W(1.8, -3.6, -14.2), 1130, 410, 32)];
  const iSw = CAM.length;
  // (review fix: through the stop the camera backs slowly away from the sphere along its line of sight (vD u/s) while orbiting
  //  it gently toward its left, the way it will go (W0 °/s), the view turning with the orbit, so the stopped sphere keeps its
  //  board spot on screen while the set drifts past it; the swing round to its left only gathers once it sets off (GO). It used
  //  to pan the resting sphere ~300 px right through the stop and whip back left (35–44°/s) just as it left: the one moment
  //  meant to be calm was busier than the approach. (Backing away alone left the picture nearly still: change 0.5–0.9.))
  const vD = 3.0, W0 = rad(6), ray = h14.pos.clone().sub(M14).normalize(), dl14 = h14.look.clone().sub(h14.pos), hr = Math.hypot(ray.x, ray.z);
  const rotY = (v, a) => W(v.x * Math.cos(a) + v.z * Math.sin(a), v.y, -v.x * Math.sin(a) + v.z * Math.cos(a));   // (about the vertical)
  // a pose moving at vel, its view direction turning about the vertical at wv rad/s (no acceleration): the stop's steady drift
  const steady = (p, vel, wv) => { const d = new Vec(...p.v.slice(3, 6)).sub(new Vec(...p.v.slice(0, 3))).normalize(), dr = W(d.z, 0, -d.x).multiplyScalar(wv);
    p.vel = vel.clone(); p.sp = vel.length(); p.dw = [vel.x, vel.y, vel.z, dr.x, dr.y, dr.z, 0, 0, 0]; p.aw = new Array(9).fill(0); return p; };
  const K14 = Kk(h14, vD), K15v = Kk(h15, 3.2); CAM.push(K14);
  let P14a;

  // 14 → 15: it rolls off down-left along the band; the camera orbits round it the other way (to its left, over the ramp's
  // path ahead of it, lifting ~5 u so it looks down onto the band's foot and the ramp's bend), keeping ~11 u from it, and
  // comes round behind it onto frame 15's framing as it heads for the doorway. At the start the sphere is still, and the camera
  // drifts round it slowly (W0) while backing away along its line of sight (vD); the orbit's turn gathers from there (a
  // ramp–cruise–ramp profile, so the pan only builds once the sphere is rolling); at the end the sphere pulls away (~3 u/s).
  { const tA = h14.tk, tB = h15.tk, TT = tB - tA, oA = h14.pos.clone().sub(M14), oB = h15.pos.clone().sub(M15);
    const rA = Math.hypot(oA.x, oA.z), rB = Math.hypot(oB.x, oB.z), fA = Math.atan2(oA.x, oA.z);
    let fB = Math.atan2(oB.x, oB.z); while (fB > fA) fB -= 2 * Math.PI;                  // round by the sphere's left (+x, west)
    const eF = ramp(W0 * TT / (fA - fB), 0, 0.26, 0.22);
    const offAt = u => { const uu = Math.min(1, Math.max(0, u)), e = eF(uu), f = fA + (fB - fA) * e, ld = Math.sin(Math.PI * e);
      const r = q5(rA, vD * hr * TT, 0, rB, 3.5 * TT, 0, 1, uu), y = q5(oA.y, vD * ray.y * TT, 0, oB.y, 0, 0, 1, uu) + 5 * ld * ld;
      return W(r * Math.sin(f), y, r * Math.cos(f)); };
    const camAt = t => bAt(t).add(offAt((t - tA) / TT));
    steady(K14, camAt(tA + 0.01).sub(camAt(tA)).multiplyScalar(100), -W0);          // (one-sided: the orbit starts here)
    // before the key the same drift, run back to 60.3 round the stop point M14 (the sphere rolls into its spot at 60.45)
    { const tP = 60.3, a = W0 * (tA - tP), dr = vD * (tA - tP), off = rotY(W(oA.x, 0, oA.z).normalize().multiplyScalar(rA - dr * hr), a);
      const pP = M14.clone().add(off).setY(M14.y + oA.y - dr * ray.y);
      P14a = steady(Kp(tP, pP, pP.clone().add(rotY(dl14, a)), 0, h14.fov), rotY(K14.vel, a), -W0); }
    const sA = [1255, 308], sB = [1368, 488];
    const vAt = t => camAt(t + 0.005).sub(camAt(t - 0.005)).multiplyScalar(100);
    for (let k = 1; k < 12; k++) { const u = k / 12, e = eF(u), ld = Math.sin(Math.PI * e), sx = sA[0] + (sB[0] - sA[0]) * e, sy = sA[1] + (sB[1] - sA[1]) * e;
      CAM.push(kS(tA + TT * u, offAt(u), sx + (960 - sx) * 0.6 * ld, sy + (560 - sy) * 0.6 * ld, 30 + (28 - 30) * e + 7 * ld, { vel: vAt(tA + TT * u) })); }
    K15v.vel = camAt(tB).sub(camAt(tB - 0.01)).multiplyScalar(100); K15v.sp = K15v.vel.length(); }
  CAM.splice(iSw, 0, ...inner(retime([...SWOOP, P14a], 3.0, P14a.sp, 1.6, 1.5)), P14a);
  CAM.push(K15v);

  // after 15: push in toward the doorway as the wipe comes across, still moving at the cut
  // (fix pass: the push alone was near-still (picture change 0.6–1.2 from 65.3 to the wipe): it also trucks right toward the
  //  doorway and cranes up a little, so the wall and the copy slide past while the sphere rolls into the dark)
  { const at = (f, r, u) => h15.pos.clone().addScaledVector(h15.fwd, f).addScaledVector(h15.right, r).addScaledVector(h15.upv, u), dl = h15.look.clone().sub(h15.pos);
    // (revision: from the key instant, a little stronger: it gathers from ~3 to ~6 u/s by the wipe)
    // (review fix: it still drifted into the wipe (3.2 → 6.7 u/s; the calmest stretch of the section, picture change ~1.3):
    //  it now picks up after the slow window like the other keys, ~9 u/s by the wipe's start (66.35), pushing on toward the
    //  doorway and trucking right, so the wall's reliefs and the portal's jambs slide past as the sphere rolls into the dark)
    const m = at(4.0, 1.7, 0.35), e = at(15.5, 6.2, 1.4);
    CAM.push(Kp(65.45, m, m.clone().add(dl), 0, F15, { sp: 6.0 }), Kp(66.849, e, e.clone().add(dl), 0, F15, { vend: 1.15 })); }
  // (the key poses' copies used as retime ends are the same poses; keep one of each, in time order)
  move(CAM);
  wipe(66.35, 'lr');

  /* ================= captions ================= */
  note(41.4, 42.5, '10 → 11 · the same chase: in the tunnel behind the sphere, the camera speeds up, passes over it and turns to keep it in frame (it orbits round and flips to face it, the picture rolling evenly through the flip), and comes out of the ring first');
  note(42.5, 44.3, '10 → 11 · it pulls back as the sphere comes out of the tunnel (~42.85) and drops over the lip (~43.1), down the chute and round the switchback\'s two bends (it slows into each), while board 11\'s shapes fly in');
  note(44.3, 45.4, '11 · passing frame 11 (key 44.83), slowly: the sphere runs the switchback toward the camera');
  note(45.4, 48.9, '11 → 12 · it passes on the camera\'s right onto the road; the camera orbits round behind it as frame 11\'s shapes leave; frame 12\'s wall rises, wrapping round the road\'s side, and the arches ahead');
  note(48.9, 51.2, '12 · passing frame 12 (key 49.85), creeping after the sphere down the road: the long slow window for the copy; it reaches the doorway ~52.85');
  note(51.2, 52.9, '12 → 13 · it rolls into the doorway and fades evenly into the dark (~52.0–52.5); the camera runs on low under the peach arch, then cranes up over the arches and the tunnel');
  note(52.9, 54.9, '12 → 13 · it comes out of the far end into a pipe that lays itself out, cut open, ahead of it; the tiles rise below; tilt down to the aerial view of the U-bend');
  note(54.9, 55.9, '13 · passing frame 13 (key 55.35), aerial: the sphere rolls round the cut-open U-bend; its rims stay lit; the picture holds its angle through the key, then turns slowly into the swoop');
  note(55.9, 60.35, '13 → 14 · off the U\'s right leg in a leap onto the lane at the top of the hill; it rolls down through the arch onto the band as the camera drops in front and tilts up; it slows…');
  note(60.35, 61.4, '14 · …and stops in the middle of the ramp (arrives 60.45, a small settle, still 60.75–61.25; key 60.95) while the camera backs slowly away, then "decides": down to the left');
  note(61.4, 64.1, '14 → 15 · down-left along the band to the hill\'s foot, onto frame 15\'s ramp, round its bend; the camera follows, rises over the bend and comes round behind it');
  note(64.1, 65.2, '15 · passing frame 15 (key 64.6): the slats slide back into the jamb and the sphere turns into the doorway');
  note(65.2, 66.85, '15 → 16 · the camera picks up again (~9 u/s by the wipe), pushing in and trucking right after it as it fades into the doorway\'s dark; full-screen gradient wipe, left to right');
};
