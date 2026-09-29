/* Copy · frame 13 (52.45 → 56.85 s): AND THE / MOMENTUM / KEPT / ROLLING on the left, built line by line.
   v1 (index.html, frame 13): four New Hero ExtraBold lines, each rising out of its own mask (yPercent 115 → 0, power3.out,
   staggered), gone with a fade before frame 14 (here: no fade; the swoop carries it off). Placed in 3D in hold 13's view (the aerial over the cut-open U-bend) and
   timed from the hold: every time below is read from V.holds[13].
   The camera (G3 since the user's 21:50 rule "never stop"): hold 13 is a pass-through, slow window 54.9–55.9, key 55.35.
   It cranes down onto the aerial at ~17 u/s until ~54.5, slows to ~3.7 u/s at the key, then speeds up again (~10 u/s by
   56.1) and yaws ~20°/s into the 13 → 14 swoop, so the aerial turns on screen. Words fixed in the world would only read
   for ~0.5 s around the key (they come down from above ~800 px and are carried off, turning, ~400 px/0.25 s after it).
   · Fitted to board 13 (measured at 1920 px): each line's ink left edge, cap centre and ink width; the kit sizes each from
     its width (~91.2 px, the board's own spacing, so no tracking), one size for the block.
   · "Lines in layers": each line is its own layer, stepped back from the lens a line at a time (AND THE nearest at depth − 7,
     ROLLING deepest at depth − 2.5; all in front of the pipe at the sphere's depth and of the violet panel behind the copy).
   · They float (float3d(), below: a slow hover in 3D, zero at the key instant, so at 55.35 they sit on the board's
     lettering), riding most of the way in the camera's view (RIDE of its place and its turn): the block keeps a fifth of
     the world's motion on the way in, so it settles down onto the board as the camera lands, and stays readable through
     the whole slow window. The steps in depth still part the lines a little.
   · Build, as the camera comes down onto the aerial: the lines rise out of their masks from key − 1.48, 0.16 s apart (0.7 s
     each), the last at rest 0.3 s before the key instant (reading time, below; they rose from key − 1.18 before).
   · Frame 13's one Z moment: ROLLING rolls forward out of the depth (5 units) as it rises, the last word landing last (its
     push runs on to the key instant).
   · Out: none (user, 00:30: "it's not necessary for the text … to alpha out or move away because the camera … hides them").
     The ride holds at 0.8 to key + 0.6 (it was key + 0.3), then the block comes to rest in the world where it is
     (leaveInWorld(), below: it rides a stand-in camera that slows to a stop over 0.6 s, so no jump), so it reads whole
     through the slow window and on into the swoop, which carries it off the left edge at full strength, turning with the
     aerial and parting a little in depth (the lettering is off by ~56.8; the release at key + 0.3 had it off by ~56.6;
     before that, the lines faded out by ~56.35). The layers end at key + 1.9 (57.25), off screen (measured every 1/30 s:
     nothing comes back before then).
   · Reading time (user, 2026-09-29, question A2: "add about ½ second where it's under ~1.3 s (e.g. 24, 25), borrowing time
     from the travel between frames so the piece stays 2:27"): all four lines readable at once for 1.57 s, 54.6–56.17 (was
     1.00 s, 54.9–55.9; the reading-time probe: every line fully risen, none moving faster than 350 px/s, none leaving;
     1.10 s when each rise must also have fully ended, was 0.53). Two changes, both in this file: the rises start 0.3 s
     earlier, while the crane comes down onto the aerial (the block rides the camera 0.8, so it settles onto the board as
     before), and the ride after the key lasts 0.3 s longer. The camera, the sphere and the key instant are unchanged; the
     time comes from the crane before the key and the start of the swoop after it (the copy is read through what was
     travel), so the piece keeps its length. (A gentler start to the swoop (g3.js retime ramp 1.6 → 2.4 s) was tried and
     measured: no gain, because a place fixed in the world already moves faster than 350 px/s at the key's own camera
     speed (3 u/s, looking down from ~20 u), so the ride is what keeps the words readable.)
   Also exports float3d() (the float + ride) and ramp(), shared with c14.js and c15.js, lensHold() (copy that keeps most of
   its hold's lens while the camera zooms onto the key), used by c12.js and c15.js, and leaveInWorld() (copy that rides part
   of the camera's move comes to rest in the world where it is), used by c11.js, c12.js, c13.js and c14.js. */
import { kit, contentFor } from './c07.js';

// board 13 (1920 px): ink left edge L, cap centre cy, ink width W (New Hero ExtraBold)
const LINES = [
  { text: 'AND THE', L: 131, cy: 332.2, W: 418.7 },
  { text: 'MOMENTUM', L: 134, cy: 441.1, W: 601 },
  { text: 'KEPT', L: 137, cy: 552.6, W: 236 },
  { text: 'ROLLING', L: 137.2, cy: 661.4, W: 407.7 },
];

/* ---------- shared: the float (a hover that can ride part of the way in the camera's view) ---------- */
const D2R = Math.PI / 180, cl = x => Math.min(1, Math.max(0, x)), sm = x => { x = cl(x); return x * x * (3 - 2 * x); };
// ramp([[t, v], …]) → t ↦ v, smoothstepped between the knots, held before the first and after the last
export const ramp = K => t => {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) return K[i - 1][1] + (K[i][1] - K[i - 1][1]) * sm((t - K[i - 1][0]) / (K[i][0] - K[i - 1][0]));
  return K.at(-1)[1];
};
// the live camera (read as the scene renders: place, turn and its inverse, lens as 1 / tan(half the vertical fov)) and the time
const LIVE = { C: null, Q: null, Qi: null, f: 1, t: 0 };
function hookLive(V) {
  if (LIVE.C) return;
  LIVE.C = new V.THREE.Vector3(); LIVE.Q = new V.THREE.Quaternion(); LIVE.Qi = new V.THREE.Quaternion();
  V.anim(t => { LIVE.t = t; });
  const prev = V.scene.onBeforeRender;                                  // runs once this frame's camera is set, before the copy is placed
  V.scene.onBeforeRender = function (r, sc, cam, ...rest) {
    if (prev) prev.call(this, r, sc, cam, ...rest);
    cam.getWorldPosition(LIVE.C); cam.getWorldQuaternion(LIVE.Q); LIVE.Qi.copy(LIVE.Q).invert();
    LIVE.f = cam.projectionMatrix.elements[5];
  };
}
/* lensHold(V, layers, { tanK, w }): the copy keeps a share w(t) (0–1) of its hold's lens while the live camera's lens differs
   (tanK: the hold's tan(half the vertical fov), h.tanV). In the live camera's view each layer's place is spread from the
   view's centre line, and its size scaled, by (tan live / tanK)^w: a lens narrowing onto the key (the camera zooming in as
   it comes round) then zooms the copy only (1 − w) as much while it builds, instead of carrying it across the screen and
   swelling it while it's being read. At the key instant the lens is the hold's, so it changes nothing there. Wraps the
   layers' holds as they are (call it after float3d() or c07's hover()); leaves the layer's own k as it was when w is 0. */
export function lensHold(V, layers, { tanK, w }) {
  hookLive(V);
  const v = new V.THREE.Vector3();
  for (const o of layers) {
    const H0 = o.H, H = Object.create(H0), k0 = o.k;
    H.at = (x, y, d) => {
      const P = H0.at(x, y, d), s = Math.pow(1 / (LIVE.f * tanK), cl(w(LIVE.t)));
      o.k = k0 * s;
      if (Math.abs(s - 1) < 1e-7) return P;
      v.copy(P).sub(LIVE.C).applyQuaternion(LIVE.Qi); v.x *= s; v.y *= s;
      return P.copy(v.applyQuaternion(LIVE.Q).add(LIVE.C));
    };
    o.H = H;
  }
}
/* leaveInWorld(V, layers, { h, ta, T, b, bq }): copy that rides part of the camera's move comes to rest in the world where it is,
   so the camera's next move carries it off (user, 00:30: no transition-outs; "the camera move will hide them").
   From ta the layer rides, with the same share b (0–1: its ride at ta), a stand-in for the camera that slows to a stop
   over T (its clock s(t) runs at the camera's pace at ta and eases to a halt at ta + T / 2), so the copy slows into the
   world with no jump and no kink in its motion, then stays put there while the real camera moves on. bq (optional, for
   float3d()'s rideQ): the share of the stand-in's turn it keeps, the same way. h: the hold whose view the layers are laid
   out in. Wrap last (after c07's hover() or float3d(), and lensHold()), and give the inner ride (and rideQ) 0 from ta (its
   place and turn must be the world's from then on).
   The stand-in is live(t) · keys(t)⁻¹ · keys(s): keys(x) is the engine's camera at x rebuilt from its keys and the sphere
   (as pose() builds it, before the per-frame edits), live(t) the camera actually rendering (edits included). So it is
   the live camera exactly at ta (no jump at the release, even with an Edit-mode camera edit on the frame: orbit, tilt,
   push, pan, roll), and exactly keys(s) while the edits are neutral (as now); with an edit it only differs by how much
   the edit's own weight changes between s and t, which is slow and smooth (review, 01:30).
   Camera moments (frames/moments.json) change fast (a blend of 0.3–2 s), so they are kept out of live(t) and put back at
   the stand-in's own clock: the stand-in is M(s) · base(t) · keys(t)⁻¹ · keys(s), where base(t) is the camera without
   the moments (v2.camBase(t); the live camera itself when no moment is active at t) and M(s) = live(s) · base(s)⁻¹ is the
   moments' change at s (none when no moment is active at s). So it's still the live camera exactly at ta, with the same
   speed there (s runs at the camera's pace at ta), it comes to rest with the moment as it was at ta + T / 2, and after
   that a moment moves this copy exactly as it moves the set (before, live(t) carried the moment into the stand-in and
   cancelled most of it on screen: the words slid against the set and split from the pictures; review, 09-29). */
let CAM = null;
function camPoseAt(V, t, out) {
  const v = V.camAt(t), b = window.v2 && window.v2.ballAt(t);
  if (!v || !b) return false;
  const cam = CAM || (CAM = new V.THREE.PerspectiveCamera());
  cam.position.set(v[0] + b[0] * v[8], v[1] + b[1] * v[8], v[2] + b[2] * v[8]);
  const look = new V.THREE.Vector3(v[3] + b[0] * v[8], v[4] + b[1] * v[8], v[5] + b[2] * v[8]).lerp(new V.THREE.Vector3(b[0], b[1], b[2]), v[6]);
  cam.up.set(0, 1, 0); cam.lookAt(look);
  if (v[9]) cam.rotateZ(v[9] * D2R);
  out.C.copy(cam.position); out.Q.copy(cam.quaternion);
  return true;
}
export function leaveInWorld(V, layers, { h, ta, T = 0.5, b = 0.9, bq = 0 }) {
  hookLive(V);
  const { THREE } = V, hqi = h.q.clone().invert(), R = new THREE.Quaternion(), cf = new THREE.Vector3(), I = new THREE.Quaternion();
  const X = new THREE.Vector3(1, 0, 0), Y = new THREE.Vector3(0, 1, 0);
  const pose = { C: new THREE.Vector3(), Q: new THREE.Quaternion(), s: NaN, ok: false };          // keys(s)
  const now = { C: new THREE.Vector3(), Q: new THREE.Quaternion(), s: NaN, ok: false };           // keys(t)
  const SC = new THREE.Vector3(), SQ = new THREE.Quaternion(), Qd = new THREE.Quaternion();       // the stand-in
  const sOf = t => { const U = cl((t - ta) / T); return ta + T * (U - U ** 3 + U ** 4 / 2); };   // s' = 1 − smoothstep
  // base(t): the camera without the moments (the live one when none is active at t); M(s): the moments' change at s
  // (cached by time and the engine's momentsRev, which changes whenever the moments or the frame edits under them do)
  const base = { C: new THREE.Vector3(), Q: new THREE.Quaternion(), t: NaN, rev: -1, live: true };
  const mom = { Q: new THREE.Quaternion(), D: new THREE.Vector3(), s: NaN, rev: -1, on: false };  // M(s): x ↦ Q x + D
  const cbOf = (t, withMoments) => { const f = window.v2 && window.v2.camBase; return typeof f === 'function' ? f(t, withMoments) : null; };
  const qTmp = new THREE.Quaternion(), vTmp = new THREE.Vector3();
  for (const o of layers) {
    const H1 = o.H, H = Object.create(H1), q = new THREE.Quaternion(), Rq = new THREE.Quaternion(), rt = new THREE.Vector3(), uv = new THREE.Vector3();
    let turned = false;
    H.at = (x, y, d) => {
      const P = H1.at(x, y, d), t = LIVE.t;
      turned = false;
      if (t < ta) return P;
      const s = sOf(t);
      if (s !== pose.s) { pose.ok = camPoseAt(V, s, pose); pose.s = s; }
      if (t !== now.s) { now.ok = camPoseAt(V, t, now); now.s = t; }
      if (!pose.ok || !now.ok) return P;
      const rev = window.v2 ? window.v2.momentsRev : 0;
      if (t !== base.t || rev !== base.rev) {                         // base(t)
        const b0 = cbOf(t, false); base.t = t; base.rev = rev; base.live = !b0;
        if (b0) { base.C.fromArray(b0.C); base.Q.fromArray(b0.Q); }
      }
      if (s !== mom.s || rev !== mom.rev) {                           // M(s) = live(s) · base(s)⁻¹, as a move of the world
        const m1 = cbOf(s, true), m0 = m1 && cbOf(s, false); mom.s = s; mom.rev = rev; mom.on = !!(m1 && m0);
        if (mom.on) { mom.Q.fromArray(m1.Q).multiply(qTmp.fromArray(m0.Q).invert()); mom.D.fromArray(m0.C).applyQuaternion(mom.Q).negate().add(vTmp.fromArray(m1.C)); }
      }
      const BC = base.live ? LIVE.C : base.C, BQ = base.live ? LIVE.Q : base.Q;
      Qd.copy(now.Q).invert().premultiply(BQ);                        // base(t) · keys(t)⁻¹ (identity while the edits are neutral)
      SQ.copy(Qd).multiply(pose.Q); SC.copy(pose.C).sub(now.C).applyQuaternion(Qd).add(BC);   // … · keys(s)
      if (mom.on) { SQ.premultiply(mom.Q); SC.applyQuaternion(mom.Q).add(mom.D); }            // M(s) · …
      R.copy(SQ).multiply(hqi);                                       // hold view → the stand-in camera's view
      cf.copy(P).sub(h.pos).applyQuaternion(R).add(SC);
      if (bq > 0) {                                                   // (its turn: bq of the stand-in's, on top of the layer's own)
        q.copy(H1.q).premultiply(Rq.copy(I).slerp(R, bq)); rt.copy(X).applyQuaternion(q); uv.copy(Y).applyQuaternion(q); turned = true;
      }
      return P.lerp(cf, b);
    };
    Object.defineProperty(H, 'q', { get: () => turned ? q : H1.q });
    Object.defineProperty(H, 'right', { get: () => turned ? rt : H1.right });
    Object.defineProperty(H, 'upv', { get: () => turned ? uv : H1.upv });
    o.H = H;
  }
}
/* float3d(V, layers, { tk, seed, amp, tilt, zAmp, per, st, ride, rideQ }): c07's hover(), plus a ride that also turns.
   · The float: x / y in board px (amp, amp × 0.8), a push along the view (zAmp × the layer's depth) and tilts about the
     layer's own centre (tilt × 0.8 about x, tilt about y, degrees), each sin(2π (t − tk) / P) on its own period (per scales
     them, ~5–8 s; seed varies periods and directions): exactly on the board place at the key instant tk and moving through
     it. Layers given together share one float.
   · st (optional): an object tweened on copyTL with { x, y (board px), z (world units along the view), rx, ry (degrees) }.
   · ride(t) (optional, 0–1): blends the layer's place toward where it would sit riding in the live camera's view (the same
     screen spot at the same distance); rideQ(t) (0–1) blends its turn the same way (0 keeps facing the hold's view, so a
     turning camera shows it in perspective; 1 turns with the camera, so a yawing aerial doesn't spin it on screen). The
     camera is on the hold's exact pose at tk, so neither changes anything there.
   The wrapped hold also answers right / upv / fwd for the layer as placed (for anything that projects onto the layer;
   c14's sphere cut-out used them until 2026-09-29, when its picture moved in front of the sphere). */
export function float3d(V, layers, { tk, seed = 0, amp = 5, tilt = 0.9, zAmp = 0.012, per = 1, st = null, ride = null, rideQ = null } = {}) {
  hookLive(V);
  const { THREE } = V, rnd = k => { const x = Math.sin(seed * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const T = [[amp, 6.1], [amp * 0.8, 4.7], [zAmp, 7.3], [tilt * 0.8, 5.3], [tilt, 8.1]].map(([a, p], k) => [a, p * per * (0.85 + 0.3 * rnd(k)), rnd(k + 7) < 0.5 ? -1 : 1]);
  const e = new THREE.Euler(), qr = new THREE.Quaternion(), R = new THREE.Quaternion(), Rb = new THREE.Quaternion(), Rq = new THREE.Quaternion(), I = new THREE.Quaternion();
  const cf = new THREE.Vector3(), X = new THREE.Vector3(1, 0, 0), Y = new THREE.Vector3(0, 1, 0);
  for (const o of layers) {
    const H0 = o.H, H = Object.create(H0), hqi = H0.q.clone().invert();
    const q = H0.q.clone(), fw = H0.fwd.clone(), rt = H0.right.clone(), uv = H0.upv.clone();
    H.at = (x, y, d) => {
      const t = LIVE.t, s = t - tk, v = T.map(([A, P, sg]) => sg * A * Math.sin(6.2832 * s / P));
      const ox = v[0] + (st ? st.x || 0 : 0), oy = v[1] + (st ? st.y || 0 : 0), oz = v[2] * o.depth + (st ? st.z || 0 : 0);
      const rx = v[3] + (st ? st.rx || 0 : 0), ry = v[4] + (st ? st.ry || 0 : 0);
      const P = H0.at(x + ox, y + oy, d).addScaledVector(H0.fwd, oz);
      q.copy(H0.q).multiply(qr.setFromEuler(e.set(rx * D2R, ry * D2R, 0)));
      const b = ride ? cl(ride(t)) : 0, bq = rideQ ? cl(rideQ(t)) : 0;
      R.copy(LIVE.Q).multiply(hqi);                                     // hold view → the live camera's view
      Rb.copy(I).slerp(R, b); Rq.copy(I).slerp(R, bq);
      if (b > 0) { cf.copy(P).sub(H0.pos).applyQuaternion(R).add(LIVE.C); P.lerp(cf, b); }
      q.premultiply(Rq);
      fw.copy(H0.fwd).applyQuaternion(Rb);                              // pushes (dz) run along the view it rides in
      rt.copy(X).applyQuaternion(q); uv.copy(Y).applyQuaternion(q);
      return P;
    };
    Object.defineProperty(H, 'q', { get: () => q });
    Object.defineProperty(H, 'fwd', { get: () => fw });
    Object.defineProperty(H, 'right', { get: () => rt });
    Object.defineProperty(H, 'upv', { get: () => uv });
    o.H = H;
  }
}

/* ---------- frame 13 ---------- */
export default V => {
  const { holds, copyTL } = V;
  const h = holds[13];
  if (!h) throw new Error('c13: frame 13 needs a hold');
  const K = kit(V), tk = h.tk, TX = contentFor(V, 13);               // (TX: frame 13's words from content/copy.json)

  /* --- the lines, each its own layer, stepped back a line at a time --- */
  const D = h.depth, DEP = [D - 7, D - 5.5, D - 4, D - 2.5];
  const lines = LINES.map((s, i) => {
    const lay = K.layer(13, [100, s.cy - 75, 700, 150], DEP[i]);
    lay.el.dataset.cp = `c13-${i}`;
    return { lay, sp: K.line(lay, TX.spec('lines', i, { ...s, w: 'b' })) };
  });
  const spans = lines.map(l => l.sp), lays = lines.map(l => l.lay);

  /* --- timing, from the hold --- */
  const ST = 0.16, DUR = 0.7, T = tk - 3 * ST - DUR - 0.3;            // the rises (from 53.87): the last at rest by key − 0.3
  gsap.set(spans, { yPercent: 115 });
  spans.forEach((sp, i) => copyTL.fromTo(sp, { yPercent: 115 }, { yPercent: 0, duration: DUR, ease: 'power3.out', immediateRender: false }, T + ST * i));
  // ROLLING rolls forward out of the depth as it rises (frame 13's Z moment), done at the key instant
  const TZ = T + ST * 3 - 0.05;
  copyTL.fromTo(lays[3], { dz: 5 }, { dz: 0, duration: tk - TZ, ease: 'expo.out', immediateRender: false }, TZ);

  // no exit (user, 00:30): from key + 0.6 the block comes to rest in the world where it is (leaveInWorld: it rides a stand-in
  // camera that slows to a stop over 0.6 s), so it reads whole through the slow window and on into the swoop (reading time,
  // user 2026-09-29: "add about ½ second"; it was key + 0.3), then the swoop carries it off the left edge, turning with the
  // aerial and parting a little in depth (the lines' lettering is off by ~56.8); the layers end at GONE, while all are off
  // screen (nothing brings them back before frame 14's copy)
  const TR = tk + 0.6, GONE = tk + 1.9;                               // 55.95 · 57.25
  lays.forEach(l => l.show(T - 0.1, GONE));

  /* --- the float: one block, riding most of the way in the camera's view (its place and its turn) --- */
  const RIDE = t => t < TR ? 0.8 : 0;
  float3d(V, lays, { tk, seed: 13, amp: 5, tilt: 0.8, ride: RIDE, rideQ: RIDE });
  leaveInWorld(V, lays, { h, ta: TR, T: 0.6, b: 0.8, bq: 0.8 });
};
