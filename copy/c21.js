/* Copy · frame 21: AND THEN WE / AIMED EVEN / EARLIER... (right of centre, over the gradient; no holding shape).
   v1 (index.html, frame 21): three New Hero ExtraBold lines, tracked out as the board sets them, swipe in (v1's clip swipe:
   each wipes open left to right while sliding in 60 px, 0.7 s power3.out, 0.2 s apart) at f21 + 0.8, and fade (0.4 s) at
   f22 − 0.6. Here each line is fitted to board 21's lettering (ink left, cap centre, ink width and cap height, measured
   from the board; c07.js's kit sets the size from the height and the tracking from the width).
   · Timing, all from hold 21, an ease-through (the NEW RULE: the camera never stops; it swings round onto the board,
     slows to ~3.3 u/s through the key instant tk trucking left with the sphere, lingers a moment after it (still slow and
     frontal, easing back, to ~97.6), then speeds up and cranes down the wall toward 22): the swipes start as the swing
     slows (slow window start − 0.4, 0.12 apart), so the lines are all in by ~window start + 0.3 (96.33), before the key
     instant, and read through the rest of the slow window: all three together ~1.47 s (96.33–97.8, readprobe; was 0.90).
     (Reading time, the user 2026-09-29, A2: "add about ½ second where it's under ~1.3 s …, borrowing time from the travel
     between frames so the piece stays 2:27". g5.js widened 21's slow window to 96.05–97.85, which starts the swipes
     0.25 s earlier, and added the linger; this file's timing follows the hold, so its code is unchanged.)
   · 3D: the lines sit a little in front of the sphere (the set's front shapes), so the landing and the leave show them
     against the set. They HOVER (hover() below): their world place is blended part of the way toward riding in the
     camera's view, a little on the way in and most of the way after the key instant, so they drift gently while the set
     slides behind them. The blend is zero at the key instant (the camera is on the board's exact pose there), so the key
     still matches the board. Frame 21's one Z moment: EARLIER... is its own layer and, as it swipes in, it drifts back
     into place from the lens side ("even earlier": the line steps back in depth), settling before the key instant.
   · NO EXIT (the COPY RULE, user 2026-09-28 00:30: "it's not necessary for the text … to alpha out or move away because
     the camera … hides them"; v1 and the last pass faded them at f22 − 0.75): they stay in the world. After the key the
     hover's lag is capped (cap 250 px), so as the camera speeds up into the crane down the wall they settle into the
     set's own motion (never faster than it) and the crane carries them off over the top right with the panel behind
     them: whole to ~98.2, half out ~98.6, gone by ~99.1 (the crane after the linger is a little quicker, so they leave a
     little faster), before frame 22's lines (99.2, top left) and picture (99.3, from the bottom) build. The layers exist
     until the slow window's end + 1.75 s (99.6; out of view by then).
   Timed from the hold, so a retimed hold carries the copy.
   Also exports hover() and hoverBeta() (shared with c22.js, c23.js and c24.js). */
import { kit, contentFor } from './c07.js';

const sm = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };

/* hover(V, layers, h, beta, [a, z], cap): copy that hovers through an ease-through. Each layer's world place is blended
   toward where it would sit if it rode in the camera's view (the same screen spot at the same distance), by beta(t) (0 = in
   the world, 1 = fixed to the lens), while t is inside [a, z]. The camera passes hold h's exact pose at the key instant, so
   the blend changes nothing there; around it the copy keeps (1 − beta) of the world's motion on screen. Only the place is
   blended (a dz push / pull in depth goes along the blended view axis): each layer keeps facing hold h's view, so a turning
   camera still shows it in perspective. The layers must be laid out in hold h's view (V.copyLayer / kit layers of frame
   h.n). Returns its state { b, C (the camera's position), R (the turn from hold h's view to the camera's), on }, updated
   every render before the copy is placed (other anims registered after it can read it).
   cap (optional, px at the layer's hold scale; for copy that STAYS, the COPY RULE "no transition-outs"): after the key
   instant each layer's lag behind its world place (beta × the ride − world offset) is softly capped at `cap` (tanh), so
   as the camera speeds up away from the board the copy stops lagging further and moves with the set, at the set's own
   speed and parallax (never faster: a plain beta release made it catch up at 1.4–1.9× the set's speed, a slide-off).
   The camera's move then carries it off; the window [a, z] should end once it is out of view. Without cap: as before. */
export function hover(V, layers, h, beta, [a, z], cap = 0) {
  const { THREE } = V;
  const cam = new THREE.PerspectiveCamera(), lk = new THREE.Vector3(), tmp = new THREE.Vector3(), rd = new THREE.Vector3();
  const qi = h.q.clone().invert();
  const st = { b: 0, C: h.pos.clone(), R: new THREE.Quaternion(), on: false };
  const L = layers.map(o => {
    const H0 = o.H, H = Object.create(H0), r = { o, H0, H, b: 0 };
    H.fwd = H0.fwd.clone();
    H.at = (x, y, d) => { const P = H0.at(x, y, d); return r.b > 0 ? P.lerp(tmp.copy(P).sub(h.pos).applyQuaternion(st.R).add(st.C), r.b) : P; };
    o.H = H;
    return r;
  });
  V.anim((t, ball) => {
    st.on = t >= a && t <= z;
    const v = st.on ? V.camAt(t) : null;
    st.b = v ? Math.min(1, Math.max(0, beta(t))) : 0;
    if (v) {
      const pf = v[8] || 0;
      st.C.set(v[0], v[1], v[2]).addScaledVector(ball.p, pf);
      lk.set(v[3], v[4], v[5]).addScaledVector(ball.p, pf).lerp(ball.p, v[6] || 0);
      cam.position.copy(st.C); cam.up.set(0, 1, 0); cam.lookAt(lk);
      if (v[9]) cam.rotateZ(v[9] * Math.PI / 180);
      st.R.copy(cam.quaternion).multiply(qi);                        // hold h's view → the camera's view now
    }
    for (const r of L) {
      r.b = st.b;
      if (cap > 0 && r.b > 0 && t > h.tk) {                          // the lag behind the world, softly capped (see above)
        const P = r.H0.at(r.o.at[0], r.o.at[1], r.o.depth), m = r.b * rd.copy(P).sub(h.pos).applyQuaternion(st.R).add(st.C).distanceTo(P);
        const Lw = cap * r.o.k;
        if (m > 1e-9) r.b *= Lw * Math.tanh(m / Lw) / m;
      }
      r.H.fwd.copy(r.H0.fwd);
      if (r.b > 0) r.H.fwd.lerp(rd.copy(r.H0.fwd).applyQuaternion(st.R), r.b);
    }
  });
  return st;
}
// beta(t) for hover(): bIn on the way in, easing to bOut across the key instant tk (±w s). The blend is zero at tk whatever
// beta is there, so the change of beta around tk is invisible.
export const hoverBeta = (tk, bIn, bOut, w = 0.3) => t => bIn + (bOut - bIn) * sm((t - tk + w) / (2 * w));

export default V => {
  const { holds, copyTL } = V;
  const h = holds[21];
  if (!h) throw new Error('c21: frame 21 needs a hold');
  const [f22] = V.win(22), K = kit(V), TX = contentFor(V, 21);       // (TX: frame 21's words from content/copy.json)
  V.waitFor(document.fonts.load('800 100px "new-hero"'));
  const D = Math.max(6, h.depth - 3);                                   // a little in front of the sphere (the row it joins)

  // the board's type (board 21, measured at 1920 px): ink left edge L, cap centre cy, ink width W, cap height H
  const top = K.layer(21, [900, 395, 820, 220], D);                   // AND THEN WE / AIMED EVEN
  const ear = K.layer(21, [900, 600, 620, 115], D);                   // EARLIER... (its own layer: the Z moment)
  const A = { maxR: 1720 };                                           // (an edited line may run as wide as the block's area)
  const lines = [
    K.line(top, TX.spec('lines', 0, { text: 'AND THEN WE', w: 'b', L: 944, cy: 455.5, W: 665, H: 64 }, undefined, A)),
    K.line(top, TX.spec('lines', 1, { text: 'AIMED EVEN', w: 'b', L: 943, cy: 555, W: 579, H: 63 }, undefined, A)),
    K.line(ear, TX.spec('lines', 2, { text: 'EARLIER...', w: 'b', L: 949, cy: 653, W: 457, H: 63 }, undefined, A)),
  ];

  const T = h.t0 - 0.4;                                               // as the swing slows onto the board
  K.swipe(lines, T, 0.12);
  copyTL.fromTo(ear, { dz: -3.2 }, { dz: 0, duration: 1.0, ease: 'power3.out', immediateRender: false }, T + 0.24);
  // no exit (COPY RULE): they stay in the world, and the crane down to 22 carries them off (out of view by ~99.0)
  const S = [T - 0.05, Math.min(h.t1 + 1.75, holds[22] ? holds[22].t0 : f22 + 1.2)];
  [top, ear].forEach(o => o.show(...S));
  // they hover: a little on the way in, mostly after the key, the lag capped at 250 px so the crane carries them off
  hover(V, [top, ear], h, hoverBeta(h.tk, 0.4, 0.72), S, 250);
};
