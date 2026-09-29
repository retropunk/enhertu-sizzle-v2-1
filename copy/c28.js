/* Copy · frame 28 (125.95 → 132.55 s): MORE OPPORTUNITIES. (top left, light), MORE / GAME-CHANGING / OUTCOMES. (the
   bold block) and MORE TOMORROWS / SET IN MOTION. (light, under it). v1's wording and moves (index.html, frames 28–31):
   the light lines are revealed right to left (a clip, linear, as the sphere rolled past them in v1), the bold block
   swipes in (clip + 60 px slide, 0.7 s power3.out, 0.12 s apart). Sizes and places are fitted to board 28's type
   (c07.js's kit: ink left edge, cap centre and ink width, measured on the board at 1920 px).
   Timing, all from hold 28 (an ease-through, 126.8–128.15, key 127.1: the camera trucks left from frame 27, passes board
   28's pose at the key at ~1.7 u/s drifting left and starting down, then cranes down after the dropping sphere). The
   reveals start 0.25–0.4 s earlier than they did (user, 2026-09-29, question A2: "add about ½ second where it's under
   ~1.3 s (e.g. 24, 25), borrowing time from the travel between frames so the piece stays 2:27"): they now run during the
   truck left, in the wake of frame 27's words as the truck carries those off to the right (the light lines reveal from
   their right ends as 27's words leave them behind; the bold block from its left edge once 27's words are on the right
   third; the two never overlap, viewed at 0.05 s steps), and all are in by ~126.57:
   · MORE OPPORTUNITIES. at hold start − 1.05 (it was − 0.8), as the sphere starts rolling in from the right along the
     block's top;
   · the bold block at hold start − 0.85 (it was − 0.6), 0.08 s apart (it was 0.12);
   · MORE TOMORROWS / SET IN MOTION. at hold start − 0.95 (it was − 0.45): one sweep edge crosses both lines right to left
     at a steady pace (both share their left edge, so they finish together).
   The three reveals run at one speed (860 px/s), so they read as one leftward motion with the sphere and the truck.
   Reading time (all the words built and still, ≤ 350 px/s; probed): 1.40 s, 126.57–127.97 (it was 0.90 s,
   127.07–127.97). It ends when the sphere, rolling round the block's corner after the key, covers the E of MORE (the
   sphere in front, below).
   3D: two layers in hold 28's view, a little in front of the sphere (the set's front shapes): the light lines at
   depth − 3 and the bold block 2 units nearer, so the truck shows them apart; the bold block settles back 2 units as it
   swipes in (a small settle: frame 27's TO PUSH FOR has just made the frame's big Z move).
   · Hover: through the build and the slow window both layers ride 65 % of the camera's movement (c25's rideCam), so the
     block hovers near its board place (~60–110 px/s of drift instead of 300–500) while it is read; exactly on the board at
     the key.
   · The sphere passes in front: after the key it rolls round the block's corner and drops straight down through the copy
     column (behind MORE, GAME-CHANGING, OUTCOMES. and SET IN MOTION.). Decision 5a ("it would be fun to see the sphere
     pass in front for a transition"): the copy is cut away round the sphere's outline (c25's sphereFront), so the drop
     reads in front of the headline instead of disappearing behind it.
   No exit (user, 2026-09-28 00:30: no transition-outs; the camera move hides the copy): after the slow window the ride
   lets go (hold end − 0.1 → + 0.3) and the camera craning down after the sphere carries the copy up and out of the top
   of the frame, whole (nearer than the set, so it leaves first; out by ~hold end + 0.8). There is no fade; the layers
   are dropped at hold end + 0.9, once they are out and before the camera could bring them back.
   Timed from the hold, so a retimed hold carries the copy. */
import { kit, contentFor } from './c07.js';
import { rideCam, sphereFront } from './c25.js';

const RIDE = 0.65;
const LEAD = { opp: 1.05, blk: 0.85, tom: 0.95 };                    // each reveal starts this long before hold start
const STAG = 0.08;                                                   // the bold block's lines swipe in this far apart
const GONE = 0.9;                                                    // the layers are dropped this long after hold end (out by ~0.8)

export default V => {
  const { holds, copyTL: tl } = V;
  const h = holds[28];
  if (!h) throw new Error('c28: frame 28 needs a hold');
  const [f28] = V.win(28);
  const K = kit(V), TX = contentFor(V, 28);                          // (TX: frame 28's words from content/copy.json)
  const D = h.depth - 3;                                             // the light lines: a little in front of the sphere
  const lite = K.layer(28, [180, 320, 1110, 580], D);
  const bold = K.layer(28, [590, 400, 920, 340], D - 2);             // the bold block, nearer

  // the board's type (ink left edge L, cap centre cy, ink width W; board 28 at 1920 px). Each mask wears its text's weight,
  // so its strut is the same face as its text and the line sits exactly on its fitted place
  let li = 0;                                                        // (the lines in reading order: content/copy.json's frame 28 "lines")
  const ln = (host, s, o) => { const sp = K.line(host, TX.spec('lines', li++, s, undefined, o)); sp.parentElement.style.fontWeight = s.w === 'b' ? 800 : 300; return sp; };
  const S = { maxR: 1010 };                                           // (these two edited lines stay clear of the sphere, right of them)
  const opp = ln(lite, { text: 'MORE OPPORTUNITIES.', w: 'l', L: 219, cy: 364, W: 690 }, S);
  const blk = [ln(bold, { text: 'MORE', w: 'b', L: 628, cy: 459.5, W: 280 }, S),
    ln(bold, { text: 'GAME-CHANGING', w: 'b', L: 628, cy: 570, W: 842 }),
    ln(bold, { text: 'OUTCOMES.', w: 'b', L: 628, cy: 681, W: 570 })];
  const tom = [{ sp: ln(lite, { text: 'MORE TOMORROWS', w: 'l', L: 628, cy: 783, W: 617 }), R: 1244 },
    { sp: ln(lite, { text: 'SET IN MOTION.', w: 'l', L: 628, cy: 855, W: 477 }), R: 1104 }];

  // v1's right-to-left reveal: the clip opens from the right edge, linear (a steady sweep edge)
  const VS = 860;                                                    // sweep speed, stage px/s
  const reveal = (sp, t, dur) => {
    gsap.set(sp, { clipPath: 'inset(0% 0% 0% 100%)' });
    tl.fromTo(sp, { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: dur, ease: 'none', immediateRender: false }, t);
  };

  /* --- timing, from the hold --- */
  const TO = Math.max(f28 - 0.2, h.t0 - LEAD.opp), TB = h.t0 - LEAD.blk, TT = h.t0 - LEAD.tom;
  reveal(opp, TO, 690 / VS);
  K.swipe(blk, TB, STAG);
  tl.fromTo(bold, { dz: 2 }, { dz: 0, duration: 0.9, ease: 'power3.out', immediateRender: false }, TB);   // a small settle
  const RT = tom[0].R;                                               // one edge across both lines, from the longer line's right end
  for (const { sp, R } of tom) reveal(sp, TT + (RT - R) / VS, (R - 628) / VS);

  // hover: ride the camera through the build and the slow window, let go as the crane down begins
  const ss = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
  const R0 = h.t1 - 0.1, R1 = h.t1 + 0.3;
  rideCam(V, [lite, bold], h, t => RIDE * (1 - ss((t - R0) / (R1 - R0))));

  // no exit (user, 00:30): the crane down after the slow window carries the copy up and out of the top of the frame, whole
  // (no fade); the layers are dropped once they are above it
  const X = h.t1 + GONE;
  lite.show(TO - 0.05, X); bold.show(TB - 0.05, X);
  sphereFront(V, [bold, lite], [h.tk, X]);                           // the sphere drops in front of the copy
};
