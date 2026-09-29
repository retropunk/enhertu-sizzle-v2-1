/* G6 · frames 25, 27, 28, 29, 30 (115.15 → the cut at 139.35, where the sphere fills the frame). Built: real sets, no plates
   (each frame's set is in groups/g6/f25.js … f30.js; this file keeps the journey: holds, the sphere's path, the camera,
   the background keys and the captions). One continuous shot from the cut to the cut, and the camera NEVER stops (the
   user, 21:50: "could we never actually stop? … you're just slowing down to that moment, and then you continue"): every
   board is an ease-through (hold(n, { pass: true })), the camera passing the board's exact pose at the key instant at its
   slowest, then speeding back up. The only still moment is the very start, at the 115.15 cut under G5's dip.
   25: out of G5's dark doorway (the cut at 115.15, under G5's dip): the camera pulls fast back out of frame 25's dark
     tunnel as board 25's shapes slide in, and the sphere rolls out after it along the tunnel's floor (~9.5 u/s, with a
     soft contact shadow) and hops up out of the mouth onto the three stacked pills (group C polish, 2026-09-29: "frame
     25's entry: the sphere sails out of the upper tunnel instead of rolling on the floor and hopping onto the pills"),
     which work like a pinball plunger (three bounces drifting slowly right across the top pill, a deep compression, then
     it fires). The pull-out looks a little down at the rolling sphere and keeps low, cranes up with its hop, and slows
     and bends upward into board 25's framing: the camera passes it at 117.93 at ~2 u/s (drifting back and up), and cranes
     on up after the fired sphere.
   25 → 27 (user: "like a pinball machine … the shapes on screen move and spin like puzzle pieces"): the plunger fires the
     sphere up and out to the right (a 1 s shot that skims the orange disc, which rolls away); board 25's shapes scatter
     (pills, disc, arch, panel) and the 2×2 quarter-disc tiles (the same grid is on both boards) break loose and tumble up
     with the camera while the sphere ricochets off them (every ~0.9 s). The camera cranes up
     (~5 u/s, pulling back 3.5 u mid-way so the pinball reads) through frame 27 assembling round it; the sphere leaves the
     top (its turn-round, K[6], is well above the frame), the four lilac bars slide down into the dome (the lane forms) and
     it drops back "out of nowhere" down the lane into the window (falling in from ~123.6 as the crane slows) as the tiles
     re-form as 27's grid, bounces on the ledge there and hops onto the board spot. The crane turns into a truck left: 27 is passed at 124.5 at ~1.5 u/s, already drifting left.
   27 → 28: carry; the camera trucks left through the shared set (the shapes both boards share glide into board 28's places
     on the camera's own progress, ctx.carryE) while the sphere hops, settles and rolls out along a ledge onto the block;
     28 is passed at 127.1 at ~1.7 u/s, drifting left and starting down. The truck carries frame 27's copy off (user,
     2026-09-29, question A3: the camera carries it off; COPY RULE, 2026-09-28 00:30: "the camera or the gradient
     left-to-right transition hides them"): its clock is warped (warp28, below: the same path, the same passes through 27
     and 28) so the camera stays slow through 27's slow window (~1.4–1.6 u/s to ~125.1), then trucks left decisively
     (peak ~5.6 u/s at ~125.8, was ~3.6) and eases into 28 at ~1.7 u/s from ~126.5; and it is held level and facing ahead
     (level28, below; review, 2026-09-29: it must read as the camera passing the words, not a slide-off: no rise, tilt-up
     or back-off, which sank and shrank the words as they left). c27.js's copy floats near the lens, so this truck
     carries it off to the right, level and whole, by ~126.4–126.5, clear of 28's copy, which reveals in its wake (from
     ~125.75, never overlapping it: c28.js).
   28 → 29: the sphere rolls over the block's rounded corner (board 28's own corner: the arc is solved against the board)
     and drops; the camera cranes down after it and swoops in close behind it on the long ramp, then runs a little slower
     than it, so the sphere rolls away from the camera toward the ring; frame 28's shapes fly back and board 29's backdrop
     flies in out of the depth.
   29 → 30 ("the same ring from two sides"): one straight ramp runs through one ring (solved so it lands on both boards).
     29 is passed at 134.1 at ~4 u/s, following the sphere as it rolls away into the ring's dark back; the camera orbits
     round the ring's +x side (the sphere passes through it) to the front: 30 is passed at 137.2 at ~4 u/s, swinging on
     toward −x and starting down and back; the sphere comes out toward the camera and the camera zooms all the way into it
     (plain, no symbol) for the cut into 31 (contract with G7: the last key, 139.349, pf 1, pos [0, 0.3, 1.45], look
     [0, 0, 0], f 1, fov 40).
   The camera is ONE smooth curve from cut to cut (a quintic Hermite through its poses, laid as dense keys every 0.025 s,
   as g2.js / g3.js; the ease-through poses carry a set velocity, Hv), so acceleration is continuous everywhere (no
   jolts). The look-follow is baked into the keys toward the sphere (smoothed over ±0.2 s through the pinball, exact from
   the orbit on), and before the final zoom the keys turn smoothly sphere-relative (pf 0 → 1, 137.6–138.6), so the last
   frames before the cut are the contract's exactly.
   Frontal sets (25, 27, 28) are seen by cameras looking along -x (screen right = -z), with the sphere in the plane x = 0. */
import f25 from './g6/f25.js';
import f27 from './g6/f27.js';
import f28 from './g6/f28.js';
import f29 from './g6/f29.js';
import f30 from './g6/f30.js';

export default V => {
  const { THREE, hold, key, easeH, note, bgKey, o } = V;
  const Vec = THREE.Vector3, v3 = (x, y, z) => new Vec(x, y, z), rad = d => d * Math.PI / 180;
  const smooth = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
  const smoother = x => { x = Math.min(1, Math.max(0, x)); return x * x * x * (10 + x * (6 * x - 15)); };
  const fadeIO = (t, i, u) => Math.min(smooth((t - i[0]) / (i[1] - i[0])), u ? 1 - smooth((t - u[0]) / (u[1] - u[0])) : 1);
  const G = 30;                                                        // pinball gravity (u/s²)

  // the sphere's path is registered with the engine AND recorded here (bAt), so the camera can be baked against it
  const SEGS = [];
  const seg = (t0, t1, ease, fn) => { SEGS.push({ t0, t1, e: typeof ease === 'function' ? ease : gsap.parseEase(ease), fn }); V.seg(t0, t1, ease, fn); };
  const runSegs = (list, v0, v1) => {                                  // the engine's runSegs, through the recording seg
    const d = list.map(([a, b, L]) => L / (b - a)), h = list.map(([a, b]) => b - a), v = [v0 ?? d[0]];
    for (let k = 1; k < list.length; k++) { const w1 = 2 * h[k] + h[k - 1], w2 = h[k] + 2 * h[k - 1]; v.push((w1 + w2) / (w1 / d[k - 1] + w2 / d[k])); }
    v.push(v1 ?? d.at(-1));
    list.forEach(([a, b, , fn], k) => { let m0 = v[k] / d[k], m1 = v[k + 1] / d[k]; const r = Math.hypot(m0, m1) / 3; if (r > 1) { m0 /= r; m1 /= r; } seg(a, b, easeH(m0, m1), fn); });
    return v;
  };
  const bAt = t => { const sg = SEGS.find(s => t <= s.t1) || SEGS.at(-1);    // as the engine's table (segs are added in time order)
    return sg.fn(sg.e(Math.min(1, Math.max(0, (t - sg.t0) / (sg.t1 - sg.t0))))).p.clone(); };

  /* ================= layout ================= */
  // frames 29–30: one straight ramp, 11° down toward +z, through one ring; the sphere's centre line passes through the ring centre C
  const AL = rad(11), D = v3(0, -Math.sin(AL), Math.cos(AL)), N = v3(0, Math.cos(AL), Math.sin(AL));
  const C = o(0, 0, 0), P = s => C.clone().addScaledVector(D, s);
  const S29 = -12.5, S30 = 10;                                         // ramp stations at the two key instants (solved against both boards)
  // frame 28: the sphere rolls over the block's rounded corner and drops onto the ramp's top end. (ARC_R0 / ARC_DY0 / GF0 /
  // TF0 are the animatic's corner, kept only to place Z28 and Y, so nothing else moves; the real corner, solved against
  // board 28, is below with the sphere's path)
  const K28 = 62.5, ARC_R0 = 322 / K28, ARC_DY0 = (742 - 420) / K28, VC = 7, PHI1 = rad(150);
  const GF0 = 20, TF0 = 1.0, S_LAND = -56.5;
  const eT = [Math.sin(PHI1), Math.cos(PHI1)];                         // leaving the corner: direction (dz, dy)
  const zl = Math.cos(AL) * S_LAND, yl = -Math.sin(AL) * S_LAND;
  const z0 = zl - VC * eT[0] * TF0, y0 = yl - VC * eT[1] * TF0 + GF0 * TF0 * TF0 / 2;
  const Z28 = z0 + ARC_R0 * Math.cos(PHI1), Y = y0 + ARC_DY0 - ARC_R0 * Math.sin(PHI1);
  // 27 sits 14.7 u up-screen-right of 28 at the same height (the sphere rolls flat from the window onto the block);
  // 25 is below 27 (the camera cranes up 13 u), lined up so the tile grid rises straight up into 27's grid
  const Z27 = Z28 - 14.7, RISE = 13;
  const Y25 = Y - (540 - 415) / 63.5 - RISE - (760 - 540) / 92.5, Z25 = Z27 + 6.77;
  const M25 = o(0, Y25, Z25), M27 = o(0, Y, Z27), M28 = o(0, Y, Z28);
  const FWD = [-1, 0, 0];
  // 25's plunger: the painted sphere floats 12.5 px above the top pill, so it bounces off BASE (touching the pill) and the
  // hold's key instant is just after the third landing, when it passes the painted spot
  const LAND = [116.9, 117.45, 117.9, 118.25], FIRE = 118.4, COMP = 0.3, GAP = 12.5 / 92.5, BASE = M25.clone().add(v3(0, -GAP, 0));
  const TK25 = (() => { const T = LAND[3] - LAND[2], hh = G * T * T / 8; return LAND[2] + T * (1 - Math.sqrt(1 - GAP / hh)) / 2; })();
  // the plunger's wind-up (LAND[3] → FIRE): the sphere is still sinking when it fires (f25's pills squash on the same curve)
  const CK = 0.85, compAt = u => COMP * Math.sin(u * Math.PI / 2 * CK) / Math.sin(Math.PI / 2 * CK);

  /* ================= holds ================= */
  // every frame is built (no board plates: plate false). Every hold is an ease-through (the user, 21:50: "could we never
  // actually stop? … you're just slowing down to that moment, and then you continue"): the camera passes the board's exact
  // pose at tk, slowed to its slowest (see the camera below); t0–t1 is the slow window the copy reads
  const dirYP = (yaw, pitch, base) => v3(-base * Math.cos(rad(pitch)) * Math.sin(rad(yaw)), -Math.sin(rad(pitch)), base * Math.cos(rad(pitch)) * Math.cos(rad(yaw))).normalize();
  const camOf = (mark, dir, fov, n) => {                               // where the engine puts the hold camera (same rule as hold())
    const B = V.BOARD[n], tanV = Math.tan(rad(fov / 2)), fwd = dir.clone(), right = fwd.clone().cross(v3(0, 1, 0)).normalize(), upv = right.clone().cross(fwd);
    const ray = fwd.clone().addScaledVector(right, (B.px - 960) / 540 * tanV).addScaledVector(upv, (540 - B.py) / 540 * tanV);
    const pos = mark.clone().addScaledVector(ray, -540 / (B.d / 2 * tanV));
    return { pos, fwd, depthOf: p => p.clone().sub(pos).dot(fwd) };
  };
  const d29 = dirYP(30.5, 32.5, 1), d30 = dirYP(-3, 12.25, -1);
  const c30 = camOf(P(S30), d30, 26, 30);
  const h25 = hold(25, { t: [117.1, 118.85], tk: TK25, mark: M25, dir: FWD, fov: 26, pass: true, plate: false });
  const h27 = hold(27, { t: [123.85, 125.2], tk: 124.5, mark: M27, dir: FWD, fov: 26, pass: true, plate: false });   // the crane turns into the truck as the sphere drops back in
  const h28 = hold(28, { t: [126.8, 128.15], tk: 127.1, mark: M28, dir: FWD, fov: 26, pass: true, plate: false });   // the truck turns into the crane down as the sphere rolls off the corner
  const h29 = hold(29, { t: [133.85, 134.35], tk: 134.1, mark: P(S29), dir: d29, fov: 34, pass: true, plate: false });
  const h30 = hold(30, { t: [136.95, 137.45], tk: 137.2, mark: P(S30), dir: d30, fov: 26, pass: true, plate: false });
  const RO = 390 / 540 * c30.depthOf(C) * h30.tanV;                   // ring outer radius (board 30: r ≈ 390 px)

  /* ================= the sphere ================= */
  const arcs = [];
  const arc = (t0, p0, t1, p1, g = G) => {                             // ballistic hop from p0 (t0) to p1 (t1)
    const T = t1 - t0, vy = (p1.y - p0.y) / T + g * T / 2;
    seg(t0, t1, 'none', u => { const t = u * T; return { p: v3(p0.x + (p1.x - p0.x) * u, p0.y + vy * t - g * t * t / 2, p0.z + (p1.z - p0.z) * u), c: 0 }; });
    const r = { a: v3((p1.x - p0.x) / T, vy, (p1.z - p0.z) / T), b: v3((p1.x - p0.x) / T, vy - g * T, (p1.z - p0.z) / T) };
    arcs.push(r); return r;
  };
  // the plunger's bounces drift slowly screen-right across the top pill (DR u/s, through the board spot at the key
  // instant), so the sphere never hangs dead still at a bounce apex
  const DR = 0.45, zDr = t => -DR * (t - TK25);
  // 25: out of the dark tunnel ROLLING ON ITS FLOOR, then one hop up onto the top pill (group C polish, 2026-09-29: "frame
  // 25's entry: the sphere sails out of the upper tunnel instead of rolling on the floor and hopping onto the pills"; it
  // used to float in 4.8 u above the floor, entering the frame big from the top). It rolls toward the camera at a steady
  // VR (≈ 9.5 u/s; the user's range is 6–12) along f25's tunnel floor, from ~12.6 u inside the mouth (so it shows ~260–360
  // px across, not filling the frame), takes off 4 u inside the mouth and lands on the top pill at LAND[0] (unchanged, so
  // the plunger, the key instant and everything after are as before). The hop is one ballistic arc (gravity G) with the
  // rolling pace carried through: it clears the mouth's arch by ~0.22 u and the top pill's back edge by ~0.46 u, peaks
  // ~1.25 u above the pill and comes down at ~8.7 u/s, about the pace the pills throw it back up (the first bounce leaves
  // at 8.25 u/s). (The engine keeps a sphere's last rolling spin in the air, so from here to its next roll, ~125.05, the
  // sphere spins as this floor roll left it; the face at each key is still turned to the board's.)
  const WALL25 = 29.4, FLOOR25 = M25.y - 4.6;                          // f25's tunnel: its mouth at hold-25 depth 29.4, its floor 4.6 u below the mark
  const T_HOP = 0.85, T_OFF = LAND[0] - T_HOP, LANDP = BASE.clone().add(v3(0, 0, zDr(LAND[0])));
  const TOFF = LANDP.clone().addScaledVector(h25.fwd, WALL25 - h25.depth + 4.0); TOFF.y = FLOOR25 + (V.R || 1);
  const VR = LANDP.distanceTo(v3(TOFF.x, LANDP.y, TOFF.z)) / T_HOP, VY = (LANDP.y - TOFF.y) / T_HOP + G * T_HOP / 2;
  const E0 = TOFF.clone().addScaledVector(h25.fwd, VR * (T_OFF - 115.15)), ROLL = h25.fwd.clone().negate();
  seg(115.15, T_OFF, 'none', u => ({ p: E0.clone().lerp(TOFF, u), c: 1, tan: ROLL.clone() }));
  seg(T_OFF, LAND[0], 'none', u => { const t = u * T_HOP, p = TOFF.clone().lerp(LANDP, u); p.y = TOFF.y + VY * t - G * t * t / 2; return { p, c: 0 }; });
  // the plunger: three bounces on the pills (each squashes them), a deep compression, then it fires
  for (let i = 0; i < 3; i++) { const T = LAND[i + 1] - LAND[i], hh = G * T * T / 8; seg(LAND[i], LAND[i + 1], 'none', u => ({ p: BASE.clone().add(v3(0, 4 * hh * u * (1 - u), zDr(LAND[i] + u * T))), c: 0 })); }
  seg(LAND[3], FIRE, 'none', u => ({ p: BASE.clone().add(v3(0, -compAt(u), zDr(LAND[3] + u * (FIRE - LAND[3])))), c: 0 }));
  // pinball: up and out, back down onto the tumbling tiles (four ricochets), out of the top, a hidden bounce just above
  // frame 27's top edge (K[6]: the camera is still craning up), down 27's lane into the window, where it bounces once on
  // f27's ledge (K[7]) and hops onto the board spot at the key instant (K[8] = M27). f25 uses K[1…4] (the tile hits) and
  // arcs[0…4] only.
  const rel = (b, dy, dz) => b.clone().add(v3(0, dy, dz));
  // (the launch is a 1.0 s shot up and out to the right, so it never hangs at its apex (it crosses the frame at ~6 u/s
  // there), meeting tile 1 near its rest place; the ricochets come every ~0.9 s; K[6], the hidden bounce, is 9.2 u above
  // 27's spot so the whole turn-round happens above the frame)
  const K = [[FIRE, rel(BASE, -COMP, zDr(FIRE))], [119.4, rel(M25, 8.23, -6.0)], [120.3, rel(M25, 10.53, 3.45)], [121.2, rel(M25, 12.93, -3.25)],
    [122.1, rel(M25, 15.83, 0.75)], [122.95, rel(M25, 26.73, 4.85)], [123.35, rel(M27, 9.2, 0.1)], [124.05, rel(M27, 0, -0.6)], [124.5, M27]];
  for (let i = 0; i + 1 < K.length; i++) arc(K[i][0], K[i][1], K[i + 1][0], K[i + 1][1]);
  // 27: two settling hops leftward in the window, then it rolls left along the ledge, out of the window and onto 28's block top
  const H1 = rel(M27, 0, 1.0), H2 = rel(H1, 0, 0.8);
  const hop = (a, b, T) => u => ({ p: a.clone().lerp(b, u).add(v3(0, G * T * T / 2 * u * (1 - u), 0)), c: 0 });
  seg(124.5, 124.85, 'none', hop(M27, H1, 0.35));
  seg(124.85, 125.05, 'none', hop(H1, H2, 0.2));
  // 28's corner, solved against board 28: the block's rounded corner there is r ≈ 363 px about (1189.5, 836.5) on its front
  // face (1.2 u in front of the sphere's plane); the ball-centre arc is concentric with it and passes through M28, so at the
  // key instant the sphere is ~12° round the corner, as the board draws it. The arc's top is EA (≈ 0.15 u) above the window's
  // sill: the block's top rises gently to it from its right end (ZB, board x 1655 on the front face). f28 builds the block on
  // this arc and rise
  const XF28 = 1.2, kF28 = (h28.depth - XF28) * h28.tanV / 540, cC = h28.at(1189.5, 836.5, h28.depth - XF28);
  const arcC = v3(M28.x, cC.y, cC.z), ARC_R = Math.hypot(M28.y - arcC.y, M28.z - arcC.z), ARC_DY = ARC_R;
  const PH0 = Math.atan2(M28.y - arcC.y, -(M28.z - arcC.z)), EA = arcC.y + ARC_R - Y, ZB = h28.pos.z - (1655 - 960) * kF28;
  const TC = (PHI1 - PH0) * ARC_R / VC;
  const X0 = arcC.clone().addScaledVector(v3(0, Math.sin(PHI1), -Math.cos(PHI1)), ARC_R), LP = P(S_LAND);
  const TF = (LP.z - X0.z) / (VC * eT[0]), GF = 2 * (X0.y + VC * eT[1] * TF - LP.y) / (TF * TF), TL = 127.1 + TC + TF;   // the flight still lands on S_LAND
  // 27 → 28: the roll from the window along the ledge (flat), up the block's gentle rise to the arc's top and round the corner
  // to M28 at the key instant (one run, by arclength, easing up to the corner's pace VC)
  { const B0 = v3(M28.x, Y, ZB), T0 = v3(M28.x, Y + EA, arcC.z), L1 = ZB - H2.z, L2 = B0.distanceTo(T0), L3 = ARC_R * (PH0 - Math.PI / 2), L = L1 + L2 + L3;
    const dB = T0.clone().sub(B0).normalize(), T = 127.1 - 125.05, avg = L / T;
    seg(125.05, 127.1, easeH(4 / avg, VC / avg), u => { const q = u * L;
      if (q <= L1) return { p: H2.clone().add(v3(0, 0, q)), c: 1, tan: v3(0, 0, 1) };
      if (q <= L1 + L2) return { p: B0.clone().addScaledVector(dB, q - L1), c: 1, tan: dB.clone() };
      const ph = Math.PI / 2 + (q - L1 - L2) / ARC_R, d = v3(0, Math.sin(ph), -Math.cos(ph));
      return { p: arcC.clone().addScaledVector(d, ARC_R), n: d, tan: v3(0, Math.cos(ph), Math.sin(ph)), c: 1 }; }); }
  // 28: on round the corner, then off it and down onto the ramp's top end, one hop, then down the ramp
  seg(127.1, 127.1 + TC, 'none', u => { const ph = PH0 + (PHI1 - PH0) * u, d = v3(0, Math.sin(ph), -Math.cos(ph)); return { p: arcC.clone().addScaledVector(d, ARC_R), n: d, tan: v3(0, Math.cos(ph), Math.sin(ph)), c: 1 }; });
  seg(127.1 + TC, TL, 'none', u => { const t = u * TF; return { p: X0.clone().add(v3(0, VC * eT[1] * t - GF * t * t / 2, VC * eT[0] * t)), c: 0 }; });
  const SB = S_LAND + 5.3, TB = TL + 0.63;
  seg(TL, TB, 'none', u => ({ p: P(S_LAND + 5.3 * u).addScaledVector(N, 4 * 1.0 * u * (1 - u)), c: 0 }));
  const S_END = S30 + 2.15 * 7.8;
  const down = (a, b) => u => ({ p: P(a + (b - a) * u), c: 1, tan: D.clone() });
  runSegs([[TB, 134.1, S29 - SB, down(SB, S29)], [134.1, 137.2, S30 - S29, down(S29, S30)], [137.2, 139.35, S_END - S30, down(S30, S_END)]], 8.4, 7.8);

  /* ================= helpers for the frame files ================= */
  // keyed tracks [t, [values], still?] → cubic Hermite (Catmull-Rom tangents; zero at the ends and at still keys)
  const track = Ks => t => {
    if (t <= Ks[0][0]) return Ks[0][1].slice();
    if (t >= Ks.at(-1)[0]) return Ks.at(-1)[1].slice();
    let i = 0; while (t > Ks[i + 1][0]) i++;
    const tan = j => (j === 0 || j === Ks.length - 1 || Ks[j][2]) ? Ks[j][1].map(() => 0) : Ks[j][1].map((_, m) => (Ks[j + 1][1][m] - Ks[j - 1][1][m]) / (Ks[j + 1][0] - Ks[j - 1][0]));
    const [ta, a] = Ks[i], [tb, b] = Ks[i + 1], h = tb - ta, u = (t - ta) / h, u2 = u * u, u3 = u2 * u, ma = tan(i), mb = tan(i + 1);
    return a.map((_, m) => (2 * u3 - 3 * u2 + 1) * a[m] + (u3 - 2 * u2 + u) * h * ma[m] + (-2 * u3 + 3 * u2) * b[m] + (u3 - u2) * h * mb[m]);
  };
  const wpt = (h, px, py) => h.at(px, py, h.depth);                     // board px → the sphere's plane (x = 0) for that hold
  // PC(spec) is V.piece(spec), calmed (its living colours drift at most ~25% toward their partners), phase-locked so it sits
  // exactly on its board colours at its hold's key instant (spec.lockT, default HH[spec.hold].tk), and flat at its hold (the
  // back face pushed out along that camera's view rays, so the sides are edge-on at the hold and open up as the camera
  // moves; spec.flat === false skips this)
  const HH = { 25: h25, 27: h27, 28: h28, 29: h29, 30: h30 };
  const hexV3 = h => { const n = parseInt(h.slice(1), 16); return new Vec((n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255); };
  const still = pc => { const u = pc.mesh.material.uniforms; for (const k of ['0', '1', '2']) u['p' + k].value.copy(u['c' + k].value); u.bi.value.set(-1, -1, -1); return pc; };   // no living colour shift
  const calm = (pc, a = 0.5) => { const u = pc.mesh.material.uniforms; if (u.p0) for (const k of ['0', '1', '2']) u['p' + k].value.lerp(u['c' + k].value, 1 - a); return pc; };
  const flatGeo = (g, n, at, d, s = 1) => { const p = g.attributes.position; g.computeBoundingBox(); const zb = g.boundingBox.min.z; if (zb > -1e-6) return g;
    const t = -zb * d * HH[n].tanV / 540 * s;                            // the extrusion in world units at that pose
    for (let i = 0; i < p.count; i++) if (p.getZ(i) < zb / 2) { const x = p.getX(i), y = p.getY(i); p.setXY(i, x + (at[0] - 960 + s * x) / s * t / d, y + (540 - at[1] + s * y) / s * t / d); }
    p.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingBox(); return g; };
  const flatFor = (pc, n, at, d, s = 1) => { flatGeo(pc.mesh.geometry, n, at, d, s); return pc; };
  const lock = (pc, tk, k = 2) => { const u = pc.mesh.material.uniforms; if (!u.per) return pc; u.per.value = tk / (0.8 * k); u.ph.value = (Math.PI - 2 * Math.PI * tk / u.per.value) / 2; return pc; };
  const PC = spec => { const pc = lock(calm(V.piece(spec)), spec.lockT ?? HH[spec.hold].tk, spec.lockK ?? 2); return spec.flat === false ? pc : flatFor(pc, spec.hold, spec.at || [960, 540], spec.depth); };
  // board px ↔ world for a hold: proj(h, p) → [px, py, depth] of world point p in hold h's view; kpx(h, d) = world units per
  // board px at depth d (h.at(px, py, d) goes the other way)
  const proj = (h, p) => { const d = p.clone().sub(h.pos), z = d.dot(h.fwd); return [960 + d.dot(h.right) / z / h.tanV * 540, 540 - d.dot(h.upv) / z / h.tanV * 540, z]; };
  const kpx = (h, d) => d * h.tanV / 540;

  // frames 25–30: each frame's set lives in its own file (groups/g6/f25.js … f30.js), called here in frame order with the
  // shared context (holds, layout anchors, the sphere's path, helpers). The journey stays in this file.
  // ctx.carryE (set once the camera is built, below): the 27 → 28 carry's progress 0 → 1, on the camera's own truck
  const ctx = { V, THREE, v3, rad, smooth, smoother, fadeIO, GRAV: G, carryE: null,
      AL, D, N, C, P, S29, S30, K28, ARC_R, ARC_DY, VC, PHI1, TC, GF, TF, S_LAND, eT, Z28, Y, Z27, RISE, Y25, Z25, M25, M27, M28, FWD,
      LAND, FIRE, COMP, compAt, GAP, BASE, TK25, WALL25, FLOOR25, T_OFF, h25, h27, h28, h29, h30, HH, dirYP, camOf, d29, d30, c30, RO,
      arcs, K, rel, H1, H2, arcC, X0, TL, SB, TB, S_END, bAt, PH0, EA, ZB, XF28,
      track, wpt, Vec, hexV3, still, calm, flatGeo, flatFor, lock, PC, proj, kpx };
  for (const f of [f25, f27, f28, f29, f30]) f(V, ctx);

  /* ================= camera: ONE smooth curve per move, laid as dense keys =================
     As g2.js / g3.js: a quintic Hermite through each move's poses (position, view direction, look distance, look-follow,
     lens and roll are continuous up to acceleration), from / to rest with zero acceleration at a still hold, laid as keys
     every 0.025 s on a grid from the move's start (the drift-through poses fall on it). The look-follow is baked into the
     keys toward the sphere (ballS: averaged over ±0.2 s through the pinball, so the view doesn't bump on the ricochets;
     exact from the orbit on, where the sphere rolls smoothly and the last keys must look straight at it). A still or
     drift-through hold pose is `own`: the engine's own hold key is used there. From 137.6 to 138.6 the keys turn
     sphere-relative (pf 0 → 1: each key's position and look are stored minus pf × the sphere), so the final zoom rides on
     the sphere exactly as the contract key does. Between 27's and 28's key instants the keys are laid on a warped clock
   (warp28: the 27 → 28 truck, see above) and held level (level28); outside that span both are exactly nothing, so every
   other key is unchanged. */
  const DTK = 0.025, T_END = 139.349;
  const PF = [137.6, 138.6], pfOf = t => smoother((t - PF[0]) / (PF[1] - PF[0]));
  const ballS = t => { const w = 0.2 * (1 - smooth((t - 134.4) / 1.2)); if (w < 1e-3) return bAt(t);
    const S = new Vec(); let Wt = 0;
    for (let i = -8; i <= 8; i++) { const k = 0.5 + 0.5 * Math.cos(Math.PI * i / 9); S.addScaledVector(bAt(Math.min(T_END, t + w * i / 8)), k); Wt += k; } return S.multiplyScalar(1 / Wt); };
  const q5 = (p0, v0, a0, p1, v1, a1, h, u) => { const u2 = u * u, u3 = u2 * u, u4 = u3 * u, u5 = u4 * u;
    return p0 * (1 - 10 * u3 + 15 * u4 - 6 * u5) + h * v0 * (u - 6 * u3 + 8 * u4 - 3 * u5) + h * h * a0 * (0.5 * u2 - 1.5 * u3 + 1.5 * u4 - 0.5 * u5)
      + h * h * a1 * (0.5 * u3 - u4 + 0.5 * u5) + h * v1 * (-4 * u3 + 7 * u4 - 3 * u5) + p1 * (10 * u3 - 15 * u4 + 6 * u5); };
  // a pose: w = [pos 3, view dir 3 (unit), look distance, look-follow f, fov, roll]
  const Wv = (pos, look, f, fov, roll = 0) => { const d = look.clone().sub(pos), L = d.length(); d.multiplyScalar(1 / L); return [pos.x, pos.y, pos.z, d.x, d.y, d.z, L, f, fov, roll]; };
  const Kp = (t, pos, look, f, fov, roll = 0, x = {}) => ({ t, w: Wv(pos, look, f, fov, roll), ...x });
  const Hp = (h, t, x = {}) => ({ t, w: Wv(h.pos, h.look, 0, h.fov, h.roll || 0), own: true, ...x });   // a hold's own pose
  // P: poses { t, w, still?, own?, sp? (own camera speed, u/s), dw? / aw? (explicit derivatives) }; warp (optional): the
  // clock the curve is laid on (a time warp τ(t), identity outside its span: see the 27 → 28 truck below); adj (optional):
  // adj(t, pos, look, fov) → fov, a last touch to each laid key (it may move pos / look in place; zero outside its span:
  // see level28 below)
  // derivs(P): each pose's velocity (dw) and acceleration (aw), unless given (move() lays the curve through them; the
  // frame-25 entry below runs it on the pre-polish poses too, to pin the pull-out's end exactly as it was)
  const derivs = P => {
    const n = P.length, Z = () => new Array(10).fill(0);
    const d3 = (p, q, j) => Math.hypot(p.w[j] - q.w[j], p.w[j + 1] - q.w[j + 1], p.w[j + 2] - q.w[j + 2]);
    const tang = (m, w) => { const k = m[3] * w[3] + m[4] * w[4] + m[5] * w[5]; for (let q = 3; q < 6; q++) m[q] -= k * w[q]; return m; };
    for (let i = 0; i < n; i++) { const p = P[i]; if (p.dw) continue;
      if (p.still) { p.dw = Z(); continue; }
      if (i === 0 || i === n - 1) { const A = P[i === 0 ? 0 : i - 1], B = P[i === 0 ? 1 : i]; p.dw = tang(A.w.map((_, j) => (B.w[j] - A.w[j]) / (B.t - A.t)), p.w); continue; }
      const A = P[i - 1], B = P[i + 1], m = tang(p.w.map((_, j) => (B.w[j] - A.w[j]) / (B.t - A.t)), p.w);
      for (const j of [0, 3]) { const Lm = Math.hypot(m[j], m[j + 1], m[j + 2]), want = j === 0 && p.sp != null ? p.sp : (d3(A, p, j) / (p.t - A.t) + d3(p, B, j) / (B.t - p.t)) / 2;
        if (Lm > 1e-6) for (let q = j; q < j + 3; q++) m[q] *= want / Lm; }
      // an ease-through pose (vel): the camera passes it with exactly this velocity (u/s); look distance, look-follow, lens
      // and roll are stationary there (it is the board's pose, the slowest moment of the move)
      if (p.vel) { m[0] = p.vel[0]; m[1] = p.vel[1]; m[2] = p.vel[2]; m[6] = m[7] = m[8] = m[9] = 0; }
      p.dw = m; }
    for (let i = 0; i < n; i++) if (!P[i].aw) { if (P[i].still || i === 0 || i === n - 1) { P[i].aw = Z(); continue; }
      const A = P[i - 1], Cc = P[i], B = P[i + 1], hA = Cc.t - A.t, hB = B.t - Cc.t;
      P[i].aw = Cc.w.map((_, j) => ((6 * (A.w[j] - Cc.w[j]) + 2 * hA * A.dw[j] + 4 * hA * Cc.dw[j]) / (hA * hA) + (6 * (B.w[j] - Cc.w[j]) - 4 * hB * Cc.dw[j] - 2 * hB * B.dw[j]) / (hB * hB)) / 2); }
    return P;
  };
  const move = (P, warp = t => t, adj = null) => {
    const n = P.length;
    derivs(P);
    const at = t => { let i = 0; while (i < n - 2 && t > P[i + 1].t) i++;
      const A = P[i], B = P[i + 1], h = B.t - A.t, u = Math.min(1, Math.max(0, (t - A.t) / h));
      return A.w.map((_, j) => q5(A.w[j], A.dw[j], A.aw[j], B.w[j], B.dw[j], B.aw[j], h, u)); };
    const t0 = P[0].t, t1 = P[n - 1].t;
    for (let k = 0; ; k++) { const t = t0 + k * DTK; if (t > t1 + 1e-6) break;
      if (P.some(p => p.own && Math.abs(p.t - t) < 0.01)) continue;
      const v = at(warp(t)), pos = v3(v[0], v[1], v[2]), dir = v3(v[3], v[4], v[5]).normalize(), f = Math.min(1, Math.max(0, v[7]));
      const look = pos.clone().addScaledVector(dir, v[6]).lerp(ballS(t), f), pf = pfOf(t);
      const fov = adj ? adj(t, pos, look, v[8]) : v[8];
      if (pf > 0) { const b = bAt(t); pos.addScaledVector(b, -pf); look.addScaledVector(b, -pf); }
      key(t, pos, look, { f: 0, fov, roll: v[9], pf }); }
    return t => at(warp(t));
  };

  // ONE move from the cut to the cut. It never stops (the user, 21:50): it slows into each board's exact pose at the key
  // instant and passes it still moving (Hv: the hold's own pose with a set velocity, u/s), then speeds back up.
  const Hv = (h, vel, x = {}) => Hp(h, h.tk, { vel, ...x });
  // 25: from the cut (at rest, under G5's dip), inside the dark tunnel, pulling fast straight back out of it; slowing, it
  // bends up into board 25's framing (passed at ~2 u/s, drifting back and up as the plunger winds up) and cranes on up.
  // Group C polish (2026-09-29, the sphere now rolls out along the tunnel floor and hops onto the pills): the pull-out
  // starts where it did (CAM_H0 above the floor: the old start to ~1 cm) but looks a little down toward the rolling sphere (look-follow F_IN,
  // ~6° at first), stays low while it backs away in front of it (CAM_HM at T_MID, ~0.9 u lower than before, so the sphere
  // keeps to the lower middle of the frame, ~260–360 px across), then cranes up with its hop onto the pills into p1
  // (116.7), the view levelling as it goes (≤ 12°/s). p1 and everything after it are exactly as before: p1's velocity and
  // acceleration are pinned to the pre-polish curve's (P1PIN, below), so the curve from p1 into board 25's pose and on is
  // unchanged (probed: the camera from 116.7 on matches the untouched copy to the mm)
  const start0 = h25.at(932, 820, h25.depth + Math.max(3, 0.3 * h25.depth)).addScaledVector(h25.fwd, -1.0);   // (the pre-polish start)
  const p1 = h25.pos.clone().addScaledVector(h25.pos.clone().sub(start0).normalize(), -6.2);
  const CAM_H0 = 3.05, CAM_HM = 3.2, T_MID = 115.9, F_IN = [0.45, 0.3];
  const start = start0.clone(); start.y = FLOOR25 + CAM_H0;
  const pMid = start0.clone().lerp(p1, 0.345); pMid.y = FLOOR25 + CAM_HM;
  const V25 = [1.7, 1.0, 0.15], V27 = [0.12, 0.35, 1.45], V28 = [-0.55, -0.85, 1.35];
  // 25 → 27: crane up (and back, a little further back mid-way so the pinball reads) through the tumbling tiles as frame 27
  // assembles; a little roll, look-follow on the ricochets. The path is one quintic from 25's pose and velocity to 27's,
  // sampled as poses; it turns from rising to trucking left as it passes 27 (the sphere drops back in and hops left)
  const qp = (t, a, b, ta, tb, va, vb) => { const h = tb - ta, u = (t - ta) / h; return q5(a, va, 0, b, vb, 0, h, u); };
  const crane = t => { const s = (t - h25.tk) / (h27.tk - h25.tk), bump = 3.5 * Math.sin(Math.PI * s) ** 2;
    return v3(qp(t, h25.pos.x, h27.pos.x, h25.tk, h27.tk, V25[0], V27[0]) + bump, qp(t, h25.pos.y, h27.pos.y, h25.tk, h27.tk, V25[1], V27[1]),
      qp(t, h25.pos.z, h27.pos.z, h25.tk, h27.tk, V25[2], V27[2])); };
  const ck = (t, lift, f, roll) => { const p = crane(t); return Kp(t, p, p.clone().add(v3(-10, lift, 0)), f, 26, roll); };
  // 28 → 29 → 30 → the cut: crane down after the drop, swinging round behind the sphere and down the ramp after it; drift
  // through 29 (following it into the ring's dark back); orbit round the ring by its +x side to its front; drift through 30
  // and on down and back as the sphere comes at the camera; zoom all the way into it
  const bEnd = bAt(T_END), vEnd = bAt(T_END).sub(bAt(T_END - 0.01)).multiplyScalar(100);
  const b138 = bAt(138.45);
  // 27 → 28: the truck's clock (user, 2026-09-29, A3: the camera carries frame 27's copy off). The camera keeps its path
  // (the same poses, the same curve) but runs it on a warped clock between the two key instants, τ(t) = t + Σ A·∫sin²
  // (each window's sin² bump starts and ends flat, so τ = t with τ' = 1 and τ'' = 0 at both keys: the passes through 27
  // and 28, their velocities and accelerations, and every key outside 124.5–127.1 are exactly as before). Slower through
  // 27's slow window (~1.4–1.6 u/s to ~125.1, was 1.5 → 2.8), then a gentle, decisive truck left (peak ~5.7 u/s at ~125.8,
  // was ~3.6; smooth, ≤ 9 u/s²), easing into 28 at ~1.7 u/s from ~126.5 while 28's copy builds. The slowest moment is
  // ~1.4 u/s, 25 % of the peak (the NEW RULE's 20–35 %). c27.js's copy floats near the lens, so this truck carries it off
  // to the right, whole, before 28's copy swipes in (c27.js's header has the numbers); the carry (ctx.carryE) rides the
  // same clock.
  const warp28 = (() => {
    const a = h27.tk, b = h28.tk;
    const W = [[-0.4, a, a + 1.05], [0.6, a + 0.75, a + 1.9], [0, b - 0.95, b]];                  // [A, from, to]
    W[2][0] = -(W[0][0] * (W[0][2] - W[0][1]) + W[1][0] * (W[1][2] - W[1][1])) / (W[2][2] - W[2][1]);   // ∫(τ' − 1) = 0: τ(b) = b
    const Ii = (t, s, e) => { if (t <= s) return 0; const L = e - s, y = Math.min(t, e) - s; return y / 2 - L * Math.sin(2 * Math.PI * y / L) / (4 * Math.PI); };
    const rate = t => 1 + W.reduce((s, [A, s0, e0]) => s + (t > s0 && t < e0 ? A * Math.sin(Math.PI * (t - s0) / (e0 - s0)) ** 2 : 0), 0);
    for (let t = a; t <= b; t += 0.01) if (rate(t) < 0.5) throw new Error('g6: the 27 → 28 clock nearly stops');   // (never stop)
    return t => t <= a || t >= b ? t : t + W.reduce((s, [A, s0, e0]) => s + A * Ii(t, s0, e0), 0);
  })();
  // 27 → 28: the truck held level and facing ahead (review, 2026-09-29: frame 27's words must read as the camera passing
  // them, not as a slide-off; user, A3: "the camera carries it off"; COPY RULE, 2026-09-28 00:30: no transition-outs).
  // On the plain curve the camera, between the two key instants, backs off ~0.9 u, rises ~0.3 u and tilts ~1.65° up
  // (its ease into the crane down after 28), and its lens widens 26 → 26.5; near the lens that sank 27's words 85–160 px
  // and shrank them 12–15 % as they left, like a swipe down and away. Here each laid key gets (all three are exactly zero,
  // with zero velocity and acceleration, at 124.5 and 127.1, so the passes through 27 and 28 and every key outside are
  // as before; the clock, warp28, is unchanged):
  //  · a forward drift along 27's view (1.2 u at ~126.2, smootherstep in and out): it cancels the back-off, so the words
  //    keep their size as they pass, and 28's pose is still met exactly;
  //  · a lowered height (0.35 u at ~126.0, from key + 0.3): the rise is taken out through the carry (it comes back after
  //    the words are gone, a ~0.16 u lift at ~126.8, and meets 28's pose and velocity);
  //  · the tilt and the lens held level (ramping in over key + 0.5 → + 0.9, after 27's slowest moment, so the slow window
  //    keeps its gentle original drift and is no quieter than before; held to 28's key − 0.7; ramping out over the last
  //    0.7 s): the view keeps its turn toward the sphere (so the set keeps travelling into 28, ≥ ~210 px/s, no hitch) but
  //    not its tilt; the tilt comes back after the words are gone, as a ~0.6° nod into the crane down.
  // Probed (display s; c27.js has the words' numbers): 27's words cross the frame level (centres within ~25 px of their
  // height) and at full size, and leave it to the right by ~126.37 (the picture ~126.52); the set moves ~5 % faster
  // than before at the peak; camera 1.4–5.6 u/s, ≤ 10 u/s² (at ~126.9), no jumps; motion.mjs's quietest moment in the
  // group is 0.48 (was 0.46), in 27's slow window.
  const level28 = (() => {
    const a = h27.tk, b = h28.tk;
    const bump = (s, p) => t => t <= s || t >= b ? 0 : t < p ? smoother((t - s) / (p - s)) : 1 - smoother((t - p) / (b - p));
    const FWD = [1.2, bump(a, 126.2)], LOW = [0.35, bump(a + 0.3, 126.0)], LEVEL = [a + 0.5, a + 0.9, b - 0.7];
    const wLevel = t => t <= LEVEL[0] || t >= b ? 0 : t < LEVEL[1] ? smoother((t - LEVEL[0]) / (LEVEL[1] - LEVEL[0])) : t > LEVEL[2] ? 1 - smoother((t - LEVEL[2]) / (b - LEVEL[2])) : 1;
    const S = new Vec(), Dr = new Vec(), Hz = new Vec();
    return (t, pos, look, fov) => {
      if (t <= a || t >= b) return fov;
      S.copy(h27.fwd).multiplyScalar(FWD[0] * FWD[1](t)); S.y -= LOW[0] * LOW[1](t);
      pos.add(S); look.add(S);                                           // (a pure move: the view's direction is unchanged)
      const w = wLevel(t); if (w <= 0) return fov;
      Dr.copy(look).sub(pos); const L = Dr.length(); Dr.multiplyScalar(1 / L);
      const pit = Math.asin(Math.max(-1, Math.min(1, Dr.y))) * (1 - w);   // the tilt, scaled; the turn is kept
      Hz.set(Dr.x, 0, Dr.z).normalize();
      look.copy(pos).addScaledVector(Hz, L * Math.cos(pit)); look.y += L * Math.sin(pit);
      return fov + (h27.fov - fov) * w;
    };
  })();
  // (P1PIN: p1's velocity and acceleration on the pre-polish curve, from the pre-polish start, so the curve from p1 on is
  // unchanged by the new, lower start)
  const P1 = () => Kp(116.7, p1, p1.clone().addScaledVector(h25.fwd, 10), 0, 27, 0, { sp: 9.5 });
  const P1PIN = derivs([Kp(115.15, start0, start0.clone().addScaledVector(h25.fwd, 10), 0, 40, 0, { still: true }), P1(), Hv(h25, V25), ck(119.0, 0.3, 0.12, -1.2)])[1];
  const cam6 = move([Kp(115.15, start, start.clone().addScaledVector(h25.fwd, 10), F_IN[0], 40, 0, { still: true }),
    Kp(T_MID, pMid, pMid.clone().addScaledVector(h25.fwd, 10), F_IN[1], 35, 0, { sp: 24 }),
    { ...P1(), dw: P1PIN.dw, aw: P1PIN.aw },
    Hv(h25, V25),
    ck(119.0, 0.3, 0.12, -1.2), ck(120.2, 0.3, 0.15, 1.2), ck(121.4, 0.2, 0.12, 1.0), ck(122.6, 0.08, 0.06, 0.4), ck(123.6, 0.02, 0.02, 0.1),
    // 27 → 28: the carry (the camera trucks left; f27's shared shapes glide on its progress, ctx.carryE)
    Hv(h27, V27),
    Hv(h28, V28),
    Kp(129.0, o(33, 21.5, Z28 + 4.0), o(0, 12, Z28 + 9), 0.35, 34),
    Kp(129.9, o(20, 17, -58.5), o(-2, 5, -34), 0.35, 38),
    // (the chase: it swoops in close behind the sphere by 131.2, then runs a little slower than it, so the sphere rolls away
    // from the camera toward the ring instead of sitting still in frame)
    Kp(131.2, o(5.5, 12.2, -42.5), o(-1.5, 4.5, -27.5), 0.4, 38),
    Kp(132.6, o(4.8, 10.9, -31.8), o(-2.2, 3, -17), 0.35, 36),
    Hp(h29, h29.tk, { sp: 4 }),
    Kp(135.0, o(10.5, 9.5, -16), o(0, 0.5, -1), 0.3, 34),
    Kp(135.7, o(17, 6, 0.5), o(0, -0.3, 1.5), 0.35, 36),
    Kp(136.35, o(11, 3.5, 15.5), o(0, -0.5, 2), 0.25, 30),
    Hp(h30, h30.tk, { sp: 4 }),
    Kp(138.45, b138.clone().add(v3(0, 1.4, 6.45)), b138, 1, 26),
    { ...Kp(T_END, bEnd.clone().add(v3(0, 0.3, 1.45)), bEnd, 1, 40), own: true, dw: [vEnd.x, vEnd.y, vEnd.z, 0, 0, 0, 0, 0, 0, 0], aw: new Array(10).fill(0) }], warp28, level28);
  key(T_END, [0, 0.3, 1.45], [0, 0, 0], { pf: 1, f: 1, fov: 40 });   // = the contract key at 139.35 (a key AT 139.35 would fall in G7's shot)
  // the 27 → 28 carry follows the camera's truck: 0 at 27's pose, 1 at 28's (its z progress, eased so it starts and ends gently)
  ctx.carryE = t => smoother((cam6(t)[2] - h27.pos.z) / (h28.pos.z - h27.pos.z));

  /* ================= background + captions ================= */
  bgKey(115.15, '#2a0ab8', '#5a18d8', '#a04aa0');
  bgKey(120.5, '#1e0a6a', '#3a10a8', '#6a14ff');
  bgKey(126.5, '#1e0b5e', '#3010a0', '#5a14e0');
  bgKey(130.5, '#120830', '#1e0b55', '#2e0c78');
  bgKey(139.3, '#120830', '#1e0b55', '#2e0c78');
  note(115.15, 117.1, 'Out of the dark: the camera pulls fast back out of frame 25\'s tunnel as its shapes slide in; the sphere rolls out after it along the tunnel floor and hops up onto the pills as they rise; the camera slows into board 25 (it never stops)');
  note(117.1, 118.4, '25 · easing through board 25, drifting back and up: the three pills are a pinball plunger; the sphere bounces on them, drifting across the top pill, they squash, then fire');
  note(118.4, 119.6, '25 → 27 · the plunger shoots the sphere up and out to the right; it skims the orange disc, which rolls away; the pills, the arch and the panel scatter, and the four quarter-disc tiles break loose');
  note(119.6, 122.7, '25 → 27 · the camera cranes up after it, pulling back a little to watch the pinball, as frame 27 assembles round it like puzzle pieces; the sphere ricochets off the tumbling tiles, which spin and find their way back together as frame 27\'s tile grid');
  note(122.7, 124.5, '27 · it shoots out of the top; the four lilac bars slide down into the dome, the lane forms, and the sphere drops back down it out of nowhere as the crane slows and turns left, bouncing into the window');
  note(124.5, 125.2, '27 · easing through board 27, already drifting left: it hops along a ledge in the window and settles, and a path runs out of the window ahead of it');
  note(125.2, 126.8, '27 → 28 · carry: the camera trucks left and carries frame 27\'s words and picture off to the right as the shared shapes glide into board 28\'s places with it; the sphere rolls out along the ledge onto the block');
  note(126.8, 128.15, '28 · easing through board 28, drifting left and starting down: the sphere rolls over the block\'s rounded corner and drops off');
  note(128.15, 130.2, '28 → 29 · the camera cranes down after it as frame 28\'s shapes fly back; it lands on a long ramp below');
  note(130.2, 133.85, 'frame 29\'s backdrop flies in out of the depth; the camera swoops in close behind the sphere, then eases off, and the sphere rolls away from it down the ramp toward the ring');
  note(133.85, 134.35, '29 · easing past the dark side of the ring: the sphere rolls away from us into the back of the ring');
  note(134.35, 136.95, '29 → 30 · the camera orbits round the ring to its front; the ramp beyond the ring lays itself out ahead of the sphere, it passes through, and the ramp behind it rolls up into the ring');
  note(136.95, 137.45, '30 · easing past the front of the ring, still swinging: the sphere comes out toward us, down the ramp');
  note(137.45, 139.35, '30 → 31 · it keeps coming; the camera zooms all the way into it until it fills the frame (cut into 31)');
};
