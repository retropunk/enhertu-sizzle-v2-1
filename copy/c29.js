/* Copy · frame 29 (132.55 → 136.05 s): THERE IS SO / MUCH MORE TO / ENHERTU (right). v1's wording and move (index.html,
   frames 28–31: the three lines swipe in, clip + 60 px slide, 0.7 s power3.out, 0.2 s apart). Sizes and places are
   fitted to board 29's type (c07.js's kit: ink left edge, cap centre and ink width, measured on the board at 1920 px).
   Timing, all from hold 29 (133.85–134.35, key 134.1: a quick drift-through, passed at ~4 u/s). The camera follows the
   sphere down the ramp toward the ring and slows onto the board's pose; the text zone is in view the whole way, so the
   copy builds in the approach (hold start − 1.55, 0.15 apart; it was − 1.1: user, 2026-09-29, question A2: "add about ½
   second where it's under ~1.3 s (e.g. 24, 25), borrowing time from the travel between frames so the piece stays
   2:27") and is fully in by ~133.07 (hold start − 0.78): it reads across the last of the approach and the slow window.
   Reading time (all the words built and still, ≤ 350 px/s; probed): 1.27 s, 133.07–134.33 (it was 0.63 s,
   133.70–134.33: in the world on the approach, the lines moved 380–640 px/s until ~133.7).
   3D: "lines in layers" in hold 29's view, a little in front of the sphere: the two light lines at depth − 3, ENHERTU
   one unit nearer. The approach is a push straight toward the text (the camera travels ~12 units while it builds), so
   the letters grow and open out in depth as the camera comes in (gently: they ride part of it, below); no extra Z move
   on the entrance (the camera is it).
   Hover: on the approach they ride 60 % of the camera's movement (c25.js's rideCam; they were in the world), so they
   grow into place at readable speed (≤ ~300 px/s once built), then across the key instant they ride 85 % of the camera's
   movement, so they keep their place through the slow window as the orbit starts, with their lag
   behind their place in the world capped at 400 px (rideCam's cap): as the orbit speeds up they stop lagging further
   and move with the set, at its own speed, never faster (review, 2026-09-28: straight in the world they were whole for
   only ~0.5 s after the swipes).
   No exit (user, 2026-09-28 00:30: no transition-outs; the camera move hides the copy): whole to ~hold end + 0.1, then
   the orbit round the ring to its front carries them off the right edge, whole, gathering pace with the orbit as the
   set does (out by ~hold end + 0.5; the pass before this one rode 85 % and faded). The layers are dropped at hold end
   + 0.6, once they are out (they never come back into view), well before frame 30's copy (~136.05). */
import { kit, contentFor } from './c07.js';
import { rideCam } from './c25.js';

const GONE = 0.6;                                                    // the layers are dropped this long after hold end (out by ~0.5)
const LEAD = 1.55;                                                   // the swipes start this long before hold start
const RIDE_IN = 0.6, RIDE = 0.85, CAP = 400;                         // the ride on the approach, and across the key (its lag capped, px)

export default V => {
  const { holds } = V;
  const h = holds[29];
  if (!h) throw new Error('c29: frame 29 needs a hold');
  const [f29] = V.win(29);
  const K = kit(V), TX = contentFor(V, 29);                          // (TX: frame 29's words from content/copy.json)
  const D = h.depth - 3;
  const lite = K.layer(29, [940, 240, 880, 230], D);
  const big = K.layer(29, [940, 480, 880, 160], D - 1);              // ENHERTU, nearer

  // the board's type (ink left edge L, cap centre cy, ink width W and cap height H; board 29 at 1920 px: it sets these a
  // touch wider than New Hero's own spacing, so the size comes from the height and the tracking from the width). Each mask
  // wears its text's weight, so its strut is the same face as its text and the line sits exactly on its fitted place
  let li = 0;                                                        // (the lines in reading order: content/copy.json's frame 29 "lines")
  const line = (host, s) => { const sp = K.line(host, TX.spec('lines', li++, s)); sp.parentElement.style.fontWeight = s.w === 'b' ? 800 : 300; return sp; };
  const ln = [line(lite, { text: 'THERE IS SO', w: 'l', L: 981, cy: 291.5, W: 581, H: 72 }),
    line(lite, { text: 'MUCH MORE TO', w: 'l', L: 984, cy: 409.5, W: 787, H: 72 })];
  const enh = line(big, { text: 'ENHERTU', w: 'b', L: 976, cy: 556.5, W: 791, H: 122 });   // (cy re-seated for the mask's weight: +3 px)

  /* --- timing, from the hold --- */
  const T = Math.max(f29 - 0.3, h.t0 - LEAD);
  K.swipe([...ln, enh], T, 0.15);

  // hover: 60 % of the camera on the approach, 85 % through the slow window (from the key), the lag capped at 400 px; no
  // exit (user, 00:30): the orbit round the ring then sweeps them off the right edge with the set, whole (no fade, no
  // recede); dropped once out of frame
  const ss = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
  rideCam(V, [lite, big], h, t => RIDE_IN + (RIDE - RIDE_IN) * ss((t - h.tk + 0.25) / 0.45), CAP);
  const X = h.t1 + GONE;
  lite.show(T - 0.05, X); big.show(T - 0.05, X);
};
