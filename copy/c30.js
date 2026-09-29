/* Copy · frame 30 (136.05 → 139.55 s): the pill (top left) and AND SO / MUCH MORE / TO COME on it. v1's wording and moves
   (index.html, frames 28–31: the pill #p30 slides in from 300 px left as it fades up, 0.7 s power3.out; then the lines
   swipe in, clip + 60 px slide, 0.2 s apart). Sizes and places are fitted to board 30: the type with c07.js's kit (ink
   left edge, cap centre and ink width, at 1920 px); the pill measured on its edges (x 34, y 72 → 566, left corners
   radius 142; its dark right end runs under the ring, so it stops at x 672, just short of the ring's outer edge, with
   100 px corners that follow the board's visible top-right curve) and its colours
   sampled along it (magenta at the left, through violet, to the backdrop's dark indigo at the right).
   Timing, all from hold 30 (136.95–137.45, key 137.2: a quick drift-through). The camera is ONE continuous curve here:
   it comes out of the orbit round the ring still turning (~22°/s at the key) and braking, passes board 30's pose at the
   key at ~4 u/s, then tilts down and pushes in until the sphere fills the frame (the cut, 139.35). Placed in the world
   while it builds, the copy would be swept in from off the left edge at 2000–2900 px/s. So up to the key the pill and its
   lines ride 90 % of the camera's movement, its turn as well as its travel (c25's rideCam): exactly on the board at the
   key, and before it they hover with 10 % of the parallax (a gentle 3D drift and a slight swing as the camera turns), so
   v1's slide-in and swipes are actually seen. After the key it keeps that 90 % ride, with its lag behind its place in
   the world capped at 250 px on screen (c25.js's rideCam cap, as c21.js's hover): it keeps its place through the slow
   window, then, as the tilt down speeds up, it stops lagging further and moves with the set at the set's own speed
   (never faster). The cap is 250 because in the world the pill only rises ~230–310 px above the frame before the
   push-in brings its place back toward the top edge: a larger cap left a sliver of it hanging along the top until the
   cut (measured).
   · The pill slides in at hold start − 1.45 (135.5; at the earliest 0.6 s before the frame's start, frame 29's copy is
     long gone), its lines 0.12 later, 0.08 apart: the pill is in by ~136.2 and the lines built by ~136.17 (user,
     2026-09-29, question A2: "add about ½ second where it's under ~1.3 s (e.g. 24, 25), borrowing time from the travel
     between frames so the piece stays 2:27"; it was hold start − 0.9, built by ~136.73). It builds in the dark space at
     the left as the camera comes round the ring's side, while the sphere threads the ring on the right; riding 90 % of
     the orbit, the pill slides in from the left edge as it did, and its words move ≤ ~220 px/s once built. Reading
     time (all the words built and still, ≤ 350 px/s; probed): 1.33 s, 136.17–137.50 (it was 0.77 s, 136.73–137.50;
     review, 2026-09-28: built at hold start − 0.5 and handed straight to the world at the key, the closing line was
     whole for only 0.1–0.4 s).
   · Lines in layers: the lines are a layer 0.6 units in front of the pill and settle back onto it as they swipe
     (frame 30's one Z moment).
   · Living gradient: the pill's stops drift ±3 %, locked to the board at the key instant.
   No exit (user, 2026-09-28 00:30: no transition-outs; the camera move hides the copy): the pill and its lines stay
   whole, and the tilt down and push-in toward the sphere carry them up and out of the top-left of the frame with the
   set (the lines out by ~138.0, the pill by ~138.2; the old fade ended ~138.25); they never come back (probed to the
   cut), and the layers are dropped at hold end + 0.85, long before the camera is inside the sphere (the cut). From
   hold end the sphere, coming at the camera, is drawn in front of them wherever it meets them (c25's sphereFront,
   decision 5a). */
import { liveFill, kit, contentFor, grow } from './c07.js';
import { rideCam, sphereFront } from './c25.js';

// the pill's colours along its length (board 30, sampled above and below the type; % of the pill's width from x 34)
const PILL = [[0, '#bf0ded'], [1.7, '#bc0eea'], [10.3, '#a612db'], [16.6, '#9413d0'], [22.9, '#8315c6'], [29.2, '#7417bc'],
  [35.4, '#6718b3'], [41.7, '#5b19a8'], [48.0, '#4f1a9f'], [54.2, '#451997'], [60.5, '#3c188e'], [66.8, '#361787'],
  [73.0, '#30167e'], [79.3, '#2a1577'], [85.6, '#281372'], [91.8, '#25116a'], [100, '#250c60']];
const pillBg = d => `linear-gradient(90deg,${PILL.map(([p, c]) => `${c} ${(p + d).toFixed(2)}%`).join(',')})`;
const RIDE = 0.9;
const CAP = 250;                                                     // after the key the lag behind the world is capped at this (px)
const GONE = 0.85;                                                   // the layers are dropped this long after hold end (out by ~0.75)
const EARLY = 1.45;                                                  // the pill slides in this long before hold start

export default V => {
  const { holds, copyTL: tl } = V;
  const h = holds[30];
  if (!h) throw new Error('c30: frame 30 needs a hold');
  const K = kit(V), TX = contentFor(V, 30);                          // (TX: frame 30's words from content/copy.json)
  const D = h.depth - 3;
  const PB = [34, 72, 638, 494];                                     // the pill: x, y, w, h (stage px)
  const card = K.layer(30, PB, D);
  const pill = document.createElement('div'); pill.className = 'box';
  pill.style.cssText = `position:absolute;left:0;top:0;width:${PB[2]}px;height:${PB[3]}px;border-radius:142px 100px 100px 142px;background:${pillBg(0)}`;
  card.el.appendChild(pill);
  const tx = K.layer(30, PB, D - 0.6);                               // the lines, a layer just in front of the pill

  // the board's type (ink left edge L, cap centre cy, ink width W; board 30 at 1920 px). The light lines are set a touch
  // wider than New Hero's own spacing, so their size comes from the cap height H and their tracking from the width. Each
  // mask wears its text's weight, so its strut is the same face as its text and the line sits exactly on its fitted place
  let li = 0;                                                        // (the lines in reading order: content/copy.json's frame 30 "lines")
  const line = s => { const sp = K.line(tx, TX.spec('lines', li++, s)); sp.parentElement.style.fontWeight = s.w === 'b' ? 800 : 300; return sp; };
  const ln = [line({ text: 'AND SO', w: 'l', L: 112, cy: 189, W: 308, H: 58 }),
    line({ text: 'MUCH MORE', w: 'l', L: 115, cy: 285, W: 507, H: 58 }),
    line({ text: 'TO COME', w: 'b', L: 111, cy: 404.5, W: 538 })];
  grow(K.ready, { el: pill, box: PB, lines: ln, side: 'right', refit: K.refit });   // (the pill grows to the right with edited words)
  // the ride hands over to the world round the key (where the two agree: the camera is on the board's pose), so the pill
  // hovers in while it builds and is read, then stays in the world for the push-in to carry off
  rideCam(V, [card, tx], h, RIDE, CAP);

  /* --- timing, from the hold --- */
  const TP = Math.max(V.win(30)[0] - 0.6, h.t0 - EARLY), TL = TP + 0.12;
  gsap.set(pill, { autoAlpha: 0, x: -300 });
  tl.fromTo(pill, { autoAlpha: 0, x: -300 }, { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power3.out', immediateRender: false }, TP);
  K.swipe(ln, TL, 0.08, 0.6);
  tl.fromTo(tx, { dz: -1.2 }, { dz: 0, duration: 0.8, ease: 'power3.out', immediateRender: false }, TL);   // the lines settle onto the pill

  // living gradient: the stops drift ±3 %, zero at the key instant (the board's colours)
  V.anim(t => { pill.style.background = pillBg(liveFill(t, h.tk, 3, 6)); });

  // no exit (user, 00:30): the push-in toward the sphere carries the pill up and out of the frame, whole (no fade, no
  // swell); the layers are dropped once they are out of it, long before the camera is inside the sphere (the cut)
  const X = Math.min(h.t1 + GONE, V.CUTS.G7 - 0.05);
  card.show(TP - 0.05, X); tx.show(TP - 0.05, X);
  sphereFront(V, [tx, card], [h.t1, X]);
};
