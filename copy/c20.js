/* Copy · frame 20 (88.35 → 93.55 s; the G4 → G5 cut is at 93.25): the holding shape 1L MODE: ACTIVATED (top left), 80+
   (counts up) DB-09 TACTICS / APPROVED / ON DAYS 0-5, and, on its square, 90+ (counts up) FROM DAY 6+. v1's wording,
   styles and moves (index.html, frame 20: each line swipes in, the numbers count up, the square pops in), placed in 3D in
   hold 20's view. Every time is read from hold 20. Hold 20 is an ease-through: the camera cranes down 90° over the
   platform's edge (~18 u/s, still turning ~12°/s at the slow window's start − 0.5), slows to ~4 u/s through board 20's
   view at the key instant, then dives after the sphere into the dark hole at the bottom left (~8 u/s at the window's end,
   ~20 by + 0.7).
   · The holding shape is frame 20's own: v1 kept frame 19's on screen, gliding to 44, 106, but the user asked that a holding
     shape not cross the screen to be reused (frames 7 → 8, 10 → 11: "cheesy"). So frame 19's leaves with frame 19 and this
     one wipes open (v1's holdIn) as the first beat of frame 20's build, on board 20's place (600 × 302 at 41.75, 102.75;
     c07's holdBg, g4lib's MODE).
   · The numbers are the board's (as c08.js's): New Hero ExtraBold digits at the board's digit height and spacing, and the
     board's small plus (0.6 of the digits' size, low, a few px after the last digit). While counting, the digits are
     right-aligned in a box as wide as the final value's, so the plus stays put. Each number's mask wears the digits'
     weight, so the mask's strut is the same (loaded) face as the digits: the kit places the baseline by a DOM measurement,
     and with the page's default weight the strut face could arrive late and the numbers sat 4–7 px low on some loads.
   · The square is the board's 90+ holder: 323 px at 990, 612.5, navy, with a quarter disc about its top right corner in a
     violet → orange ramp fitted to the board (v1 drew a plain ramp square).
   · Build, as the camera lands on the wall (v1: 80+ f20 + 0.6, its lines + 0.9, the square + 1.7, 90+ + 1.9, FROM DAY 6+
     + 2.2; compressed here), from the slow window's start − 0.8 (− 0.5 until the reading-time pass below), while the
     camera is still craning down onto the wall: the holding shape wipes open and its lines swipe in 0.1 later; 80+ swipes
     in and counts from + 0.1, its lines from + 0.25; the square pops in (v1: 0.6 → 1, back.out) at + 0.4, 90+ at + 0.45,
     FROM DAY 6+ at + 0.6. All in, the counts done, by the slow window's start + 0.23 (~0.6 s before the key instant).
   · READING TIME (2026-09-29; the user: "add about ½ second where it's under ~1.3 s (e.g. 24, 25), borrowing time from the
     travel between frames so the piece stays 2:27"): the build starts 0.3 s earlier (the window used to open only when
     the 90+ count landed, at 90.43), and g4.js keeps the camera slow a little longer before the dive (its slow stretch
     0.6 s, was 0.45; the dive makes the time up). Measured (the reading-time probe): all eight lines readable together
     90.13–91.50, 1.37 s (was 90.43–91.30, 0.87 s).
   · The sphere comes down the rail chute behind the holding shape's place (on the board the rails run under it) and
     passes BEHIND the holding shape (user, 2026-09-28 00:30: "Have the sphere pass behind the text panel"): the copy is
     drawn over the set, so it hides the sphere from ~89.6 until it comes out under the shape's bottom edge (~90.15). (It
     used to pass in front, cut out of the shape by g4lib's sphereFront; that is gone.)
   · 3D, "lines in layers": the numbers are layers in front of their small lines (80+ 2.5 units nearer, 90+ 1 unit nearer
     than the lines and 1.5 in front of its square), the holding shape 1.5 nearer than the lines. Frame 20's one Z moment:
     80+ pushes forward out of the depth as it swipes in and counts.
   · Hovering: on the way in it rides part of the camera's move (c25.js's rideCam: 60 %, so the crane still sweeps it
     into place in perspective); across the key instant the ride rises to 80 %, so it keeps its place through the slow
     window, and after the key its lag behind its place in the world is capped at 350 px (rideCam's cap, as c21.js's
     hover): as the dive speeds up it stops lagging further and moves with the wall, at the set's own speed and
     parallax, never faster (review, 2026-09-28: handing it straight back to the world at the key left it whole for only
     ~0.5 s after the build).
   · No exit (user, 2026-09-28 00:30: "it's not necessary for the text, the text panel, or the images to alpha out or move
     away because the camera … hides them"). No fade: whole until about the slow window's end (the lines + 0.05, 80+
     + 0.35, the square + 0.55; ~0.2 s longer since the reading-time pass), then the camera diving after the sphere into
     the hole at the bottom left carries it all up and off the top and right edges (out of frame by + 1.0, the empty 90+
     square last, ~0.95 s before the dark cut at 93.25). Its life ends after that (+ 1.2), off screen (checked to + 1.6). */
import { flowFill, kit, holdBg, contentFor, grow } from './c07.js';
import { rideBeta, tag, MODE } from './g4lib.js';
import { rideCam } from './c25.js';                             // (the capped ride; G6's helper file)

const stops = (S, d = 0) => S.map(([p, c]) => `${c} ${(p + d).toFixed(2)}%`).join(',');
// the square's quarter disc: a left-to-right ramp over the square's width (mean error ~4 on 0–255)
const RAMP = [[0, '#6f13f3'], [15.5, '#6a13ee'], [27.9, '#600edd'], [40.2, '#5609cb'], [52.6, '#4b03be'], [58.8, '#6011ab'], [65, '#732193'],
  [71.2, '#8a307f'], [77.4, '#a23c71'], [83.6, '#b54f53'], [89.8, '#cb5d41'], [96, '#df6c2e'], [100, '#e97636']];
const rampBg = d => `linear-gradient(90deg,${stops(RAMP, d)})`;

export default V => {
  const { holds, copyTL, anim } = V;
  const h = holds[20];
  if (!h) throw new Error('c20: frame 20 needs a hold');
  const K = kit(V), TX = contentFor(V, 20);                          // (TX: frame 20's words from content/copy.json)
  const DL = h.depth - 3;                                             // the small lines: a little in front of the wall the sphere runs down

  /* --- the holding shape (top left), frame 20's own --- */
  const M = MODE, PAD = 30;
  const badge = K.layer(20, [M.tl20[0] - PAD, M.tl20[1] - PAD, M.w + 2 * PAD, M.h + 2 * PAD], DL - 1.5);
  const panel = document.createElement('div'); panel.className = 'hold box';
  panel.style.cssText = `left:${PAD}px;top:${PAD}px;width:${M.w}px;height:${M.h}px;border-radius:${M.r}px;background:${holdBg(0)}`;
  badge.el.appendChild(panel);
  const hMode = M.lines.map((l, i) => K.line(badge, TX.spec('panel', i, { text: l.text, w: l.w, L: M.tl20[0] + l.dx, cy: M.tl20[1] + l.cy, W: l.W })));
  grow(K.ready, { el: panel, box: [M.tl20[0], M.tl20[1], M.w, M.h], lines: hMode, refit: K.refit });

  // the board's type (measured from board 20 at 1920 px). The numbers: the final value's digit ink (left edge, top) and
  // baseline, their tracking, and the plus (its size as a fraction of the digits' size, its gap after the last digit).
  const n80L = K.layer(20, [820, 300, 540, 280], DL - 2.5);
  const n80 = K.number(n80L, TX.numSpec('numbers', 0, { digits: '80', L: 862, top: 334, base: 545, lsEm: -0.052, plusEm: 0.605, gap: 10 }, undefined, { maxR: 1330 }));   // (clear of the lines)
  const words = K.layer(20, [1320, 300, 580, 490], DL);
  const l20 = [
    K.line(words, TX.spec('lines', 0, { text: 'DB-09 TACTICS', w: 'l', L: 1357, cy: 357.5, W: 483.5 })),
    K.line(words, TX.spec('lines', 1, { text: 'APPROVED', w: 'l', L: 1352, cy: 440, W: 353.5 })),
    K.line(words, TX.spec('lines', 2, { text: 'ON DAYS 0-5', w: 'l', L: 1354.3, cy: 524, W: 422 }))];
  const d20 = K.line(words, TX.spec('lines', 3, { text: 'FROM DAY 6+', w: 'l', L: 1357, cy: 742, W: 420.5 }));
  const SQ = [990, 612.5, 323, 323];
  const sq = K.layer(20, SQ, DL + 0.5);
  sq.el.innerHTML = `<div class="box sq" style="position:absolute;left:0;top:0;width:${SQ[2]}px;height:${SQ[3]}px;background:#28085e">` +
    `<div style="position:absolute;inset:0;border-bottom-left-radius:100%;background:${rampBg(0)}"></div></div>`;
  const sqEl = sq.el.firstElementChild, disc = sqEl.firstElementChild;
  const n90L = K.layer(20, [1020, 630, 320, 170], DL - 1);
  const n90 = K.number(n90L, TX.numSpec('numbers', 1, { digits: '90', L: 1056, top: 658, base: 770.5, lsEm: -0.046, plusEm: 0.595, gap: 6 }));
  // each number's mask in the digits' own weight (see above; set before the kit fits it once the face has loaded)
  for (const n of [n80, n90]) n.num.d.style.fontWeight = '800';

  // the counters (v1: 0 → 80 and 0 → 90, power2.out, from the swipe): the tween drives the number's setter
  const counter = (sp, to, t, dur) => {
    if (!Number.isFinite(to)) return;                                 // (an edited number that isn't one: shown as it is)
    const c = { v: 0, get n() { return this.v; }, set n(x) { this.v = x; sp.set(x); } };
    sp.set(0);
    copyTL.fromTo(c, { n: 0 }, { n: to, duration: dur, ease: 'power2.out', immediateRender: false }, t);
  };

  /* --- timing, from the hold --- */
  const T = h.t0 - 0.8, X = h.t1 + 1.2;                               // X: the end of its life, off screen (no exit)
  gsap.set(panel, { autoAlpha: 0 });
  copyTL.set(panel, { autoAlpha: 1 }, T)                              // v1's holdIn (a set, so it survives seeking)
    .fromTo(panel, { clipPath: `inset(0% 100% 0% 0% round ${M.r}px)` }, { clipPath: `inset(0% 0% 0% 0% round ${M.r}px)`, duration: 0.6, ease: 'expo.out', immediateRender: false }, T);
  K.swipe(hMode, T + 0.1, 0.1, 0.55);
  K.swipe([n80], T + 0.1); counter(n80, n80.to, T + 0.1, 0.9);
  gsap.set(n80L, { dz: 10 });
  copyTL.fromTo(n80L, { dz: 10 }, { dz: 0, duration: 1.0, ease: 'power3.out', immediateRender: false }, T + 0.1);   // forward out of the depth
  K.swipe(l20, T + 0.25, 0.1, 0.6);
  gsap.set(sqEl, { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' });
  copyTL.fromTo(sqEl, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)', immediateRender: false }, T + 0.4);
  K.swipe([n90], T + 0.45); counter(n90, n90.to, T + 0.45, 0.7);
  K.swipe([d20], T + 0.6, 0.1, 0.6);
  const all = [badge, n80L, words, sq, n90L];
  rideCam(V, all, h, rideBeta(h.tk, 0.6, 0.8), 350);                 // hovers, then the dive carries it off with the wall
  all.forEach(o => o.show(T - 0.1, X));
  tag(20, all);

  // living gradients, locked to board 20 at the key instant
  anim(t => {
    const k = flowFill(), w = 6.2832 * (t - h.tk) * k.s;
    panel.style.background = holdBg(k.a * 5 * Math.sin(w / 9));
    disc.style.background = rampBg(k.a * 4 * Math.sin(w / 7));
  });
};
