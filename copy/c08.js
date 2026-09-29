/* Copy · frame 8 (27.25 → 32.35 s): 90+ (counts up) DB-06 TACTICS APPROVED / ON DAYS 0-5, and 150+ (counts up)
   FROM DAY 6+, at the left, and the holding shape EXPANDED HER2: ACTIVATED at the top right. v1's wording, styles and
   moves (each line swipes in, the numbers count up), placed in 3D in hold 8's view. Every time is read from hold 8, an
   ease-through since the user's 21:50 rule ("never stop"): its slow window is 28.25–29.25 and the camera passes board 8's
   exact pose at the key instant 28.75 at ~4.5 u/s, craning round from the look down on the pegs onto the wall head-on.
   · READING TIME (user, 2026-09-29, question A2: "add about ½ second where it's under ~1.3 s (e.g. 24, 25), borrowing
     time from the travel between frames so the piece stays 2:27"). The reading-time probe read the untouched frame 8 for
     0.87 s (28.50–29.37; STRICT 0.67), and 0.77 s once the left block stayed in the world (below). Now 1.47 s
     (27.83–29.3; STRICT 1.20), with the camera never slower than its key speed (review, 2026-09-29: an earlier version
     slowed it to ~2.7 u/s through the key): the whole build runs 0.55 s earlier than it did before the reading-time work
     (150+ also starts 0.1 s sooner after 90+), so everything is in by ~27.83, and g2.js lets the camera settle onto the
     wall earlier and linger near 4.5 u/s through the key (the time borrowed from the swing in before it), so the block
     moves under ~250 px/s from 27.83 and 90+ (94 px from the left edge on the board) reaches the edge only at ~29.3.
   · The holding shape is frame 8's own now (user, 21:50: frame 7's panel leaves off screen instead of crossing the screen
     to be reused, "and then, when we build board 8, that expanded her2 activated panel can be built in from the right
     side of the screen"). It flies in from beyond the right edge (key − 1.9, 0.95 s power3.out; was key − 1.35): it
     slides in along its plane, swung 30° away and a little deep, and turns flat to the camera as it lands; its lines
     swipe in as it lands (key − 1.45; was key − 0.85), in by ~27.83. The camera comes round onto the wall from the left,
     so a pure world place would creep in from the right edge over ~1 s; on the way in its place is blended most of the way (0.8)
     toward riding in the camera's view, so the slide lands on its spot and it drifts gently there while the pegs pass
     behind. The blend changes nothing at the key instant (the camera is on board 8's exact pose) and hands back to the
     world across it.
   · The holding shape's outline is board 8's own (c07's HOLD, refit 2026-09-29: 603.6 × 304.2, an 8 px frame, 82 px
     corners, centred on board 8's shape at (1564.55, 202.8); it was 596 × 300 on (1564, 202), its edges 1.5–4.3 px inside
     the board's). Its words are where they were.
   · The count-up "flaked once in a render (not reproduced)" (polish backlog): tried again on 2026-09-29, 18 fresh loads
     of the player stepping 27.2–28.8 every 1/30 s (in order as the exporter does, in shuffled order at the dev tools'
     half size, and backwards): every load showed the same digits, places and pixels (max 1 level). Not reproduced, so
     nothing here changed for it.
   · The numbers are the board's: New Hero ExtraBold digits at the board's digit height and spacing, and the board's
     small, low plus (0.59 / 0.61 em, on the baseline; v1 used a full-size plus, which ran 90+ 33 px long). While
     counting, the digits are right-aligned in a box as wide as the final value's, so the plus stays put and never pushes
     into FROM DAY 6+, which is back on its board place. They build from key − 1.85 (26.9; was key − 1.3), all in by
     ~27.83 (90+ at T, its lines T + 0.2, 150+ T + 0.25 (was + 0.35), FROM DAY 6+ T + 0.5).
   · "Lines in layers": the two numbers are a layer in front of their small lines (the numbers 54.5 world units from hold
     8's camera, the lines 58.5; the peg tips are at ~61, the wall's reliefs at 64–65.6), so the approach shows them apart
     in depth, just in front of the set.
   · Frame 8's one Z moment: 90+ pushes forward out of the depth as it swipes in and counts (dz 12).
   · They hover (c07's hover(): a slow float in 3D, zero at the key instant, so at 28.75 everything sits on its board
     place): the left block as one, the holding shape on its own.
   · No exit animation (user, 2026-09-28 00:30: no transition-outs; "the camera or the gradient left-to-right transition
     hides them"). Nothing fades, slides or pushes: after the key the camera rises and angles down on the pegs, and that
     move carries all of it off. Gone since v1: both recedes and both fades.
     - The left block STAYS IN ITS PLACE IN THE 3D WORLD from the key on (user, 2026-09-29: "check Frame 8 - leaving
       frame 8 the text on the left animates out and it should stay in 3D space place"). It sits 6–10 units in front of
       the wall and moves exactly as the set does (on screen ~1.2× the wall's own pace, the parallax of that gap): the
       rising camera carries it off the left edge with the pegs (90+ gone by ~30.36, 150+ by ~30.43, the lines by
       ~31.1), tilting a little in perspective as the camera looks down. No ride, no let-go, no extra speed.
     - On the way in it follows the camera "somewhat" (the user, of the copy: it "follow[s] the camera somewhat, it's
       really great!"): its place is blended 0.3 toward riding in the camera's view through the build, handed back to
       the world over key − 0.6 → key (28.15–28.75) as the camera eases onto board 8's exact pose, where the blend
       changes nothing. So the build-in moves on screen much as it did (the same swipes, counts and push, now 0.55 s
       earlier for the reading time; 90+ starts its push-in a little higher for the first ~0.3 s of its reveal), and
       the key instant is pixel-identical.
     - What it replaced (the 00:30 review, 2026-09-28): the block at 25 / 27, blended 0.6 toward the camera through the
       slow window and let go over 29.25–29.75. It moved with the pegs, then the let-go threw it off the lower left ~2.4×
       faster than the set: the user saw that as the text animating out. Tried and dropped now: the block at 25 / 27
       purely in the world from the key on (it slides ~2.5× faster than the pegs from the key instant, the same look).
     - The cost, for the user to judge: leaving at the set's pace, the numbers cross the left edge more slowly than the
       old let-go threw them, so for a while they read cut ("0+", "50+"); the let-go had cut that to ~0.2 s. Measured
       (glyph box from first cut to fully off, 120 Hz): 90+ 29.28–30.36 (1.08 s) and 150+ 29.39–30.43 (1.04 s). The
       camera already starts its rise a little quicker across the edge (× 1.3 over ~29.15–30.3 in g2.js, then a gentler
       climb so its top speed stays under the old): without that it is 1.15 / 1.1 s. Only a change to the camera's own
       move (a quicker turn right after the key) could cut it much further; that is the user's call.
     - The left block switches off at hold end + 2.05 (31.3), once off screen (all of it by ~31.17; from ~31.5 the
       numbers' layer nears the camera plane and CSS would draw a stretched sliver). The holding shape rides off the top
       by ~31.4 (its blend is gone by key + 0.3); it switches off at hold end + 2.35 (31.6), once off screen, well before
       frame 9's copy (33.25). */
import { liveFill, kit, holdingShape, BADGE, holdBg, hover, contentFor } from './c07.js';
const sm = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };

export default V => {
  const { holds, copyTL, anim } = V;
  const h8 = holds[8];
  if (!h8) throw new Error('c08: frame 8 needs a hold');
  const K = kit(V), tk = h8.tk, TX = contentFor(V, 8);             // (TX: frame 8's words from content/copy.json)
  const D8 = h8.depth - 3;                                           // the holding shape: just in front of the pegs (58.5)

  // the board's type (measured from board 8 at 1920 px). The numbers: the final value's digit ink (left edge, top,
  // baseline), their tracking (the board's digit gaps: −0.04 em) and the plus (its size as a fraction of the digits' font
  // size, and its gap after the last digit). The small lines: ink left, cap centre, ink width and cap height (the board
  // sets them a little tighter than New Hero's own spacing, so they are fitted by height (size) and width (tracking)).
  const DN = 54.5, DW = 58.5;                                        // the left block's depths: numbers, lines (see the header)
  const n90L = K.layer(8, [40, 380, 460, 220], DN);
  const n150L = K.layer(8, [60, 770, 440, 150], DN);
  const words = K.layer(8, [80, 570, 900, 330], DW);
  const n90 = K.number(n90L, TX.numSpec('numbers', 0, { digits: '90', L: 94, top: 411, base: 562, lsEm: -0.04, plusEm: 0.586, gap: 9 }));
  const n150 = K.number(n150L, TX.numSpec('numbers', 1, { digits: '150', L: 115, top: 783, base: 897, lsEm: -0.04, plusEm: 0.612, gap: 7 }));
  const fL = [K.line(words, TX.spec('lines', 0, { text: 'DB-06 TACTICS APPROVED', w: 'l', L: 104, cy: 617, W: 832, H: 51 })),
    K.line(words, TX.spec('lines', 1, { text: 'ON DAYS 0-5', w: 'l', L: 100, cy: 697, W: 394, H: 51 }))];
  const fDay = K.line(words, TX.spec('lines', 2, { text: 'FROM DAY 6+', w: 'l', L: 458, cy: 867.5, W: 324, H: 39 }));

  /* --- the holding shape: built in from the right side of the screen --- */
  const { lay: badge, panel, lines: hHer } = holdingShape(V, K, 8, BADGE.c8, BADGE.box8, D8, TX);
  const TS = tk - 1.9;                                              // the fly-in (off screen at its start)
  const fly = { x: 820, z: 5, ry: -30 };                             // board px along its plane, world units deeper, degrees (swung away)
  copyTL.fromTo(fly, { x: 820, z: 5, ry: -30 }, { x: 0, z: 0, ry: 0, duration: 0.95, ease: 'power3.out', immediateRender: false }, TS);
  K.swipe(hHer, tk - 1.45, 0.1);

  // the counters (v1: 0 → 90 and 0 → 150, power2.out, from the swipe): the tween drives the number's setter
  const counter = (sp, to, t, dur) => {
    if (!Number.isFinite(to)) return;                                // (an edited number that isn't one: shown as it is)
    const c = { v: 0, get n() { return this.v; }, set n(x) { this.v = x; sp.set(x); } };
    sp.set(0);
    copyTL.fromTo(c, { n: 0 }, { n: to, duration: dur, ease: 'power2.out', immediateRender: false }, t);
  };

  /* --- timing (v1: 90+ at f8 + 0.5, its lines + 0.8, 150+ + 1.7, FROM DAY 6+ + 2.0; here compressed, from the key) --- */
  const T = tk - 1.85;
  K.swipe([n90], T); counter(n90, n90.to, T, 0.9);
  copyTL.fromTo(n90L, { dz: 12 }, { dz: 0, duration: 1.0, ease: 'power3.out', immediateRender: false }, T);   // pushes forward out of the depth
  K.swipe(fL, T + 0.2, 0.1);
  K.swipe([n150], T + 0.25); counter(n150, n150.to, T + 0.25, 0.8);
  K.swipe([fDay], T + 0.5);

  /* --- hover: the left block as one (following the camera 0.3 through the build, handed back to the world over
     key − 0.6 → key, purely in the world from the key on: see the header), the holding shape on its own (with its fly-in
     on top) --- */
  const left = [n90L, n150L, words];
  hover(V, left, { tk, seed: 21, amp: 6, tilt: 0.7, beta: t => 0.3 * (1 - sm((t - tk + 0.6) / 0.6)) });
  hover(V, [badge], { tk, seed: 22, amp: 5, tilt: 0.9, st: fly, beta: t => 0.8 * (1 - sm((t - tk + 0.3) / 0.6)) });

  /* --- out: none. The rising camera carries both off (see the header); they switch off once gone --- */
  left.forEach(o => o.show(T - 0.1, h8.t1 + 2.05));
  badge.show(TS, h8.t1 + 2.35);

  // the holding shape's living fill, locked to board 8's colours at the key instant
  anim(t => { panel.style.background = holdBg(liveFill(t, tk, 5, 9)); });
};
