/* Copy · frame 19 (83.35 → 88.35 s): the holding shape 1L MODE: ACTIVATED (top left) and the glass box DECEMBER 2025 /
   FDA APPROVAL / IN 1L HER2+ mBC (right). v1's wording, styles and moves (index.html, frames 19–20), placed in 3D in
   hold 19's view; the board adds DECEMBER 2025 above v1's two lines (v1 left it out), so it is here, in v1's light date
   style (frames 7 and 10). Every time is read from hold 19. Hold 19 is an ease-through: the camera comes out of the sphere
   and rises straight up to look down on the U-turn (fast: ~30 u/s at the slow window's start + 0.1), eases through board
   19's top-down view at ~4 u/s at the key instant, then slides left after the sphere (~10 u/s by the window's end) toward
   the 90° crane over the platform's edge.
   · Fitted to board 19 (measured at 1920 px): each line's ink left edge, cap centre and ink width. IN 1L HER2+ mBC is one
     line in two weights (v1: <span class="l">IN</span> 1L HER2+ mBC): one mask and one swipe (g4lib's mixedLine).
   · The shapes are the board's: the holding shape 600 × 302 at 60, 76.5, r 84 (rounder than boards 7–11's; c07's holdBg
     fill and frame); the glass box from 1045, 101 to 614 high, r 170, running off the right edge as on the board, a
     left-to-right blue → violet → magenta ramp fitted to the board (it is nearly opaque there).
   · Build, in v1's order (v1: holding shape f19 + 0.5, its lines + 0.8, glass + 1.1, its lines + 1.4; compressed here),
     as the rise eases out: the holding shape wipes open at the slow window's start + 0.1, its lines swipe in 0.1 later;
     the glass box grows from its top right (v1: 0.9 → 1, back.out) at + 0.2, its lines swipe in from + 0.25, 0.08 apart.
     All in, and settled in depth, by the key instant.
   · The rise brings the sphere up out of the bottom left, across the holding shape's lower right corner, to its board spot
     beside it; while the shape opens (the slow window's start − 0.1 → the key instant − 0.1) the sphere passes in front of
     it (g4lib's sphereFront, decision 5a), so the copy never hides the sphere.
   · 3D: the holding shape is nearest (4.5 units above the sphere, which rolls on the floor), the glass box's lines 0.7 in
     front of the box. Frame 19's one Z moment: the glass box and its lines come up out of the depth toward the camera
     (6 units) as the box grows, as if lifting off the floor to meet the camera that has just risen above it.
   · Hovering: on the way in all of it rides most of the camera's move (c25.js's rideCam, 85 %), so it hovers near its
     board place (a little larger while the camera is still rising) instead of being pushed off the edges. After the key
     instant the glass box and its lines keep that 85 % ride, with their lag behind their place in the world capped at
     350 px (rideCam's cap, as c21.js's hover): they keep their place through the slow window (their text ends 67 px from
     the right edge on the board, so in the world the slide left cropped it ~0.3 s after it had swiped in: review,
     2026-09-28), then move with the floor, at the set's own speed and parallax, never faster. The holding shape (top
     left) now does the same through the slow window (85 %, lag capped at 350 px), then eases back into the world over
     1.3 s from the slow window's end − 0.1 (it used to hand back across the key instant, 0 % from ~ + 0.3, which moved it
     at ~370 px/s from + 0.07, while the camera was at its slowest). The release is slow on purpose: it catches up with its
     place in the world at no more than ~1.2× the floor's own speed (a 0.6 s release reached ~1.9×, a slide-off), and
     without it the capped shape crawled along the top edge and never left before the crane brought it back.
   · READING TIME (2026-09-29; the user: "add about ½ second where it's under ~1.3 s (e.g. 24, 25), borrowing time from the
     travel between frames so the piece stays 2:27"): the holding shape was the bottleneck (the glass box's lines read
     0.77–0.97 s on their own). With it hovering with the glass box, and g4.js keeping the camera slow a little longer after
     the key (the 19 → 20 move's slow stretch 0.7 s, was 0.45), all five lines read together 85.50–86.33, 0.83 s (was
     85.50–85.67, 0.17 s; the reading-time probe).
   · No carry. The user asked that a holding shape not cross the screen to be reused (frames 7 → 8, 10 → 11: "cheesy"), so
     frame 19's 1L MODE: ACTIVATED leaves with the glass box, and c20.js builds frame 20's own as the camera lands on the
     wall (as frame 12's ASCO: ACTIVATED comes in again).
   · No exit (user, 2026-09-28 00:30: "it's not necessary for the text, the text panel, or the images to alpha out or move
     away because the camera … hides them"). No fade: the glass box's text reads whole until ~the slow window's end − 0.1
     and the holding shape until then too; then the camera sliding left after the sphere and turning toward the platform's
     edge carries it all up and off the top and right edges, tilting with the floor (the holding shape out by + 1.05,
     the glass box's text by + 0.8 and its last rounded corner by + 1.2, ~1.7 s before frame 20's copy). Their lives end
     at + 1.3, off screen (checked to + 1.8: nothing shows again); left in the world, the holding shape would come back in
     at the top right during the crane down (from ~ + 1.5), drawn over the sets. */
import { flowFill, kit, holdBg, contentFor, grow } from './c07.js';
import { mixedLine, sphereFront, tag, MODE } from './g4lib.js';
import { rideCam } from './c25.js';                             // (the capped ride; G6's helper file)

const stops = (S, d = 0) => S.map(([p, c]) => `${c} ${(p + d).toFixed(2)}%`).join(',');
// the glass box: blue → violet → magenta, left to right over 1045 → 1990 px (mean error ~4 on 0–255)
const GLASS = [[0, '#3a31f6'], [7.9, '#422cf9'], [14.3, '#472cf7'], [20.6, '#4f29f6'], [27, '#5727f5'], [33.3, '#5f25f5'], [39.7, '#6925f8'],
  [46, '#7323f8'], [52.4, '#8021f8'], [58.7, '#8c1cfa'], [65.1, '#991bfb'], [71.4, '#a518fd'], [77.8, '#b413fd'], [84.1, '#c110ff'],
  [90.5, '#cd0efe'], [100, '#dc0aff']];
const glassBg = d => `linear-gradient(90deg,${stops(GLASS, d)})`;
const sm = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };

export default V => {
  const { holds, copyTL, anim } = V;
  const h = holds[19];
  if (!h) throw new Error('c19: frame 19 needs a hold');
  const K = kit(V), TX = contentFor(V, 19);                          // (TX: frame 19's words from content/copy.json)
  const D = h.depth;                                                  // the sphere's depth from hold 19's camera

  /* ---------- the glass box and its lines (right) ---------- */
  const GB = [1045, 101, 945, 513];
  const glass = K.layer(19, GB, D - 2.5);
  const gEl = document.createElement('div'); gEl.className = 'glass box';
  gEl.style.cssText = `left:0;top:0;width:${GB[2]}px;height:${GB[3]}px;border-radius:170px;opacity:.96;background:${glassBg(0)}`;
  glass.el.appendChild(gEl);
  const words = K.layer(19, [1100, 200, 800, 300], D - 3.2);
  // (the last line is two weights, each on its board spot, sized by 1L HER2+ mBC; an edited one is one kit line at that size)
  const s2 = TX.spec('card', 2, { text: '1L HER2+ mBC', w: 'b', L: 1149, cy: 443, W: 596 }, 'IN **1L HER2+ mBC**');
  const l19 = [
    K.line(words, TX.spec('card', 0, { text: 'DECEMBER 2025', w: 'l', L: 1145, cy: 254, W: 432 })),
    K.line(words, TX.spec('card', 1, { text: 'FDA APPROVAL', w: 'b', L: 1147.5, cy: 343, W: 671 })),
    s2.edit ? K.line(words, s2) : mixedLine(V, words, { cy: 443, ref: 1, parts: [{ text: 'IN', w: 'l', L: 1149, W: 75.5 }, { text: '1L HER2+ mBC', w: 'b', L: 1257, W: 596 }] })];
  grow(K.ready, { el: gEl, box: GB, lines: l19, limit: [990, 1880], refit: K.refit });   // (it may not grow over the sphere)

  /* ---------- the holding shape (top left) ---------- */
  const M = MODE, PAD = 30;
  const badge = K.layer(19, [M.tl19[0] - PAD, M.tl19[1] - PAD, M.w + 2 * PAD, M.h + 2 * PAD], D - 4.5);
  const panel = document.createElement('div'); panel.className = 'hold box';
  panel.style.cssText = `left:${PAD}px;top:${PAD}px;width:${M.w}px;height:${M.h}px;border-radius:${M.r}px;background:${holdBg(0)}`;
  badge.el.appendChild(panel);
  const hMode = M.lines.map((l, i) => K.line(badge, TX.spec('panel', i, { text: l.text, w: l.w, L: M.tl19[0] + l.dx, cy: M.tl19[1] + l.cy, W: l.W })));
  grow(K.ready, { el: panel, box: [M.tl19[0], M.tl19[1], M.w, M.h], lines: hMode, refit: K.refit });

  /* ---------- timing, from the hold ---------- */
  const TB = h.t0 + 0.1, TG = h.t0 + 0.2, TL = h.t0 + 0.25;
  const XB = h.t1 + 1.3, XG = h.t1 + 1.3;                             // the ends of their lives (holding shape, glass box), off screen (no exit)
  const ZD = Math.max(0.4, h.tk - TG);                                 // the rise out of the depth: settled at the key instant
  gsap.set(panel, { autoAlpha: 0 });
  copyTL.set(panel, { autoAlpha: 1 }, TB)                             // v1's holdIn (a set, so it survives seeking)
    .fromTo(panel, { clipPath: `inset(0% 100% 0% 0% round ${M.r}px)` }, { clipPath: `inset(0% 0% 0% 0% round ${M.r}px)`, duration: 0.6, ease: 'expo.out', immediateRender: false }, TB);
  K.swipe(hMode, TB + 0.1, 0.1, 0.5);
  gsap.set(gEl, { autoAlpha: 0, scale: 0.9, transformOrigin: '100% 0%' }); gsap.set([glass, words], { dz: 6 });
  copyTL.fromTo(gEl, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 0.96, scale: 1, duration: ZD, ease: 'back.out(1.3)', immediateRender: false }, TG)
    .fromTo([glass, words], { dz: 6 }, { dz: 0, duration: ZD, ease: 'power3.out', immediateRender: false }, TG);   // up out of the depth
  K.swipe(l19, TL, 0.08, 0.45);
  const all = [badge, glass, words];
  rideCam(V, [glass, words], h, 0.85, 350);                          // hovers, then moves with the floor (lag capped)
  rideCam(V, [badge], h, t => 0.85 * (1 - sm((t - (h.t1 - 0.1)) / 1.3)), 350);   // hovers with the glass box, then eases back into the world
  sphereFront(V, [badge], [h.t0 - 0.1, h.tk - 0.1]);                  // the rising sphere crosses the opening shape's corner
  badge.show(TB - 0.05, XB); glass.show(TG - 0.05, XG); words.show(TG - 0.05, XG);
  tag(19, all);

  // living gradients, locked to board 19 at the key instant
  anim(t => {
    const k = flowFill(), w = 6.2832 * (t - h.tk) * k.s;
    panel.style.background = holdBg(k.a * 5 * Math.sin(w / 9));
    gEl.style.background = glassBg(k.a * 4 * Math.sin(w / 7));
  });
};
