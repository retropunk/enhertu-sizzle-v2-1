/* Copy · frame 18 (77.95 → 83.35 s): the holding shape PAN ENHERTU AND / PATIENT EXPERIENCE: / ACTIVATED (top right), the
   lilac glass pill with WORKSTREAMS / COMMENCED ACROSS / US/GLOBAL, and the nausea and vomiting documents (v1's placeholder
   picture, assets/copy/nausea-docs.jpg) below it. v1's wording, styles and moves (index.html, frame 18), placed in 3D in
   hold 18's view. Every time is read from hold 18. Hold 18 is an ease-through: the camera cranes down the swirl at ~8 u/s,
   slows to ~2 u/s through board 18's view at the key instant, then sinks on after the sphere (5 u/s at the slow window's
   end, turning ~11°/s) and drops to floor level as the sphere comes off the swirl toward it.
   · Fitted to board 18 (measured at 1920 px): each line's ink left edge, cap centre and ink width (the kit sizes a line
     from its width at the face's own spacing). COMMENCED ACROSS is one line in two weights (v1: COMMENCED <span class="l">
     ACROSS</span>), so it is one mask and one swipe, each word on its board place (g4lib's mixedLine).
   · The shapes are the board's: the holding shape 558 × 283 at 963.5, 19.5, r 88 (smaller and rounder than boards
     7–11's; the same fill and frame: c07's holdBg); the glass pill 893 × 340 at 872, 268 (round top corners, r 155,
     tighter bottom ones), a 45° lilac ramp fitted to the board (violet at the bottom left to pale lilac at the top right);
     the documents in a 10 px frame (orange down the sides, violet across the top and bottom: c07's HOLD_FRAME), 1160 × 444
     at 700, 607, r 34, the pages registered to the board's.
   · Build, as the camera cranes down onto the board, in v1's order and rhythm (v1: holding shape f18 + 0.3, its lines
     + 0.6, glass + 0.8, its lines + 1.1, documents + 1.8; a little tighter here), from the slow window's start − 1.25
     (0.2 s before frame 18's start; it was − 1.05 until the reading-time pass below): the holding shape wipes open at
     + 0.22 (TH), its lines swipe in 0.12 later; the glass grows from its top right (v1: 0.9 → 1, back.out) at + 0.3, its
     lines swipe in at + 0.45; the documents rise (v1: 90 px, back.out) at + 0.75. The words are all in by the slow
     window's start − 0.13 (the holding shape's by − 0.33).
     Why + 0.22 (review, 2026-09-29): once the build moved 0.2 s earlier, the holding shape (at + 0) wiped open flush
     against the sphere as it rolls down the swirl beside it; its outline touched the sphere for ~0.1 s, so the sphere
     seemed to bump it open. It now opens just after the sphere has rolled past its left edge: first seen at ~77.98,
     ~60 px clear and widening ~11 px a frame (a sphere-to-box gap probe at 1920 px; 207 px before the reading-time pass,
     when it opened later still). The glass pill (unchanged) stays ≥ 94 px clear.
   · 3D: "lines in layers". The holding shape is nearest (13 units in front of the sphere), the glass's lines 0.6 in front
     of the glass (10.5), the documents between, so the crane shows them apart. The whole block sits 8 units nearer the
     camera than the first pass put it (review, 2026-09-28): at the key instant each layer still covers its board place
     exactly (layers are sized for their depth), but the camera's sink after the key now gives it more parallax, so the
     move carries it off within a second instead of leaving it cut at the edges (below). Frame 18's one Z moment: the
     documents come forward out of the depth (6 units) as they rise. v1's slow push into the page starts at the key
     instant (at rest on the board there).
   · Hovering: the copy rides 75 % of the camera's move (c25.js's rideCam), on the way in as well as through the key (on the
     way in it rode half until the reading-time pass below), so it hovers near its board place as the crane lands and
     keeps it through the slow window; after the key its lag behind its place in the world is capped at 400 px (rideCam's
     cap, as c21.js's hover): as the camera sinks and turns away the copy stops lagging further and moves with the swirl,
     at the set's own speed and parallax, never faster.
   · READING TIME (2026-09-29; the user: "add about ½ second where it's under ~1.3 s (e.g. 24, 25), borrowing time from the
     travel between frames so the piece stays 2:27"): the glass, its lines and the documents build 0.2 s earlier (the
     holding shape, after the review above, opens where it did before, 0.02 s later) and the copy rides 75 % (was 50 %) on
     the way in, so it has settled by the time its last line is in (the crane swept it across at ~600 px/s until ~79.3), and
     g4.js keeps the camera's sink after the key slow a little longer (warp18). Measured (the reading-time probe): all six
     lines readable together 78.87–80.17, 1.30 s (was 79.30–80.03, 0.73 s).
   · No exit (user, 2026-09-28 00:30: "it's not necessary for the text, the text panel, or the images to alpha out or move
     away because the camera … hides them"). No fade: whole until about the slow window's end (the holding shape, 19.5 px
     from the top edge on the board, to − 0.4; the documents − 0.15; the pill and its lines + 0.05), then the camera
     sinking and swinging round the swirl carries it all up and off the top and right edges (since the reading-time pass
     it stays whole ~0.15 s longer, and leaves as quickly): the holding shape by + 0.15,
     the pill and its lines by + 0.55, the documents by + 0.95 (the first pass, in the world at its old depth, left the
     pill's lines cut at the right edge for ~2 s and the documents hanging at the top right until the sphere swallowed
     them at ~82.6; the review asked for it to leave within about a second). The sphere comes round the back of the swirl
     behind them, which is right, and they are gone before it runs at the camera, so no cut-out is needed. Their life
     ends at + 1.05, off screen (probed to 84.75: they never come back into view over the drop or the U-turn, where the
     copy, drawn over the sets, used to reappear). */
import { flowFill, kit, holdBg, HOLD_FRAME, contentFor, grow, watchPic, picCss } from './c07.js';
import { mixedLine, tag } from './g4lib.js';
import { rideCam } from './c25.js';                             // (the capped ride; G6's helper file)

/* ---------- the copy shapes' colours (fitted to board 18) ---------- */
const stops = (S, d = 0) => S.map(([p, c]) => `${c} ${(p + d).toFixed(2)}%`).join(',');
// the glass pill: a 45° ramp (violet at the bottom left → pale lilac at the top right), mean error ~5 on 0–255
const PILL = [[0, '#4e0cb6'], [6, '#520dbb'], [29, '#5e14de'], [38.6, '#6717eb'], [53, '#7622fc'], [63, '#8a41ff'], [69.4, '#9b5bff'],
  [77.5, '#b183ff'], [88, '#d6bdff'], [92, '#dcc7fb'], [100, '#e6d6fb']];
const pillBg = d => `linear-gradient(45deg,${stops(PILL, d)})`;

export default V => {
  const { holds, copyTL, anim } = V;
  const h = holds[18];
  if (!h) throw new Error('c18: frame 18 needs a hold');
  const K = kit(V), TX = contentFor(V, 18);                          // (TX: frame 18's words and picture from content/copy.json)
  const D = h.depth - 8;                                              // the sphere's depth from hold 18's camera, less 8 (see above)

  /* --- the holding shape (top right) --- */
  const BX = [963.5, 19.5, 558, 283], R = 88, PAD = 30;
  const badge = K.layer(18, [BX[0] - PAD, BX[1] - PAD, BX[2] + 2 * PAD, BX[3] + 2 * PAD], D - 5);
  const panel = document.createElement('div'); panel.className = 'hold box';
  panel.style.cssText = `left:${PAD}px;top:${PAD}px;width:${BX[2]}px;height:${BX[3]}px;border-radius:${R}px;background:${holdBg(0)}`;
  badge.el.appendChild(panel);
  const hPan = [
    K.line(badge, TX.spec('panel', 0, { text: 'PAN ENHERTU AND', w: 'l', L: 1030.5, cy: 91.6, W: 384.5 })),
    K.line(badge, TX.spec('panel', 1, { text: 'PATIENT EXPERIENCE:', w: 'l', L: 1031, cy: 142.6, W: 425 })),
    K.line(badge, TX.spec('panel', 2, { text: 'ACTIVATED', w: 'b', L: 1027, cy: 206.6, W: 382.5 }))];
  grow(K.ready, { el: panel, box: BX, lines: hPan, refit: K.refit });

  /* --- the glass pill and its lines (a layer 0.6 units in front of it) --- */
  const GB = [872, 268, 893, 340];
  const glass = K.layer(18, GB, D - 2.5);
  const gEl = document.createElement('div'); gEl.className = 'glass box';
  gEl.style.cssText = `left:0;top:0;width:${GB[2]}px;height:${GB[3]}px;border-radius:155px 155px 60px 60px/155px 155px 90px 90px;background:${pillBg(0)}`;
  glass.el.appendChild(gEl);
  const words = K.layer(18, [930, 320, 830, 270], D - 3.1);
  // (the middle line is two weights, each word on its board spot; an edited one is one kit line at COMMENCED's size)
  const s2 = TX.spec('card', 1, { text: 'COMMENCED', w: 'b', L: 972, cy: 455.5, W: 450 }, '**COMMENCED** ACROSS');
  const l18 = [
    K.line(words, TX.spec('card', 0, { text: 'WORKSTREAMS', w: 'b', L: 971, cy: 377, W: 538.5 })),
    s2.edit ? K.line(words, s2) : mixedLine(V, words, { cy: 455.5, parts: [{ text: 'COMMENCED', w: 'b', L: 972, W: 450 }, { text: 'ACROSS', w: 'l', L: 1444, W: 254 }] }),
    K.line(words, TX.spec('card', 2, { text: 'US/GLOBAL', w: 'l', L: 976, cy: 534.6, W: 369.5 }))];
  grow(K.ready, { el: gEl, box: GB, lines: l18, side: 'right', refit: K.refit });

  /* --- the documents (v1's #doc18) --- */
  const PB = [700, 607, 1160, 444], RIM = 10;
  const P = TX.pic('documents', { src: 'assets/copy/nausea-docs.jpg', fit: 'cover' });
  const doc = K.layer(18, PB, D - 3.6);
  doc.el.innerHTML = `<div class="img" style="position:absolute;left:0;top:0;width:${PB[2]}px;height:${PB[3]}px;border:${RIM}px solid transparent;border-radius:34px;overflow:hidden;background:linear-gradient(#fff,#fff) padding-box,${HOLD_FRAME}">` +
    // the picture (1130 × 458: the two pages, then a strip of the board's background) registered to the board's pages
    // (best fit: scale 0.995, top left at 716, 624), on the page's white
    (P.edited ? `<img src="${P.src}" alt="" style="${picCss(P, 'transform-origin:50% 40%')}"></div>`
      : `<img src="assets/copy/nausea-docs.jpg" alt="" style="position:absolute;left:6px;top:7px;width:1124.4px;height:455.7px;max-width:none;display:block;transform-origin:50% 40%"></div>`);
  const frame = doc.el.firstElementChild, art = frame.firstElementChild;
  watchPic(V, art, P);
  V.waitFor(art.decode().catch(() => {}));

  /* --- timing, from the hold --- */
  const TB = h.t0 - 1.25, TG = TB + 0.3, TL = TB + 0.45, TD = TB + 0.75;
  const TH = TB + 0.22;                                               // the holding shape: after the sphere has rolled past its left edge (see above)
  const X = h.t1 + 1.05;                                              // the end of its life: off screen (no exit)
  gsap.set(panel, { autoAlpha: 0 });
  copyTL.set(panel, { autoAlpha: 1 }, TH)                             // v1's holdIn (a set, so it survives seeking)
    .fromTo(panel, { clipPath: `inset(0% 100% 0% 0% round ${R}px)` }, { clipPath: `inset(0% 0% 0% 0% round ${R}px)`, duration: 0.65, ease: 'expo.out', immediateRender: false }, TH);
  K.swipe(hPan, TH + 0.12, 0.1, 0.6);
  gsap.set(gEl, { autoAlpha: 0, scale: 0.9, transformOrigin: '100% 0%' });
  copyTL.fromTo(gEl, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'back.out(1.3)', immediateRender: false }, TG);
  K.swipe(l18, TL, 0.12, 0.65);
  gsap.set(frame, { autoAlpha: 0, y: 90 }); gsap.set(doc, { dz: 6 });
  copyTL.fromTo(frame, { autoAlpha: 0, y: 90 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'back.out(1.2)', immediateRender: false }, TD)
    .fromTo(doc, { dz: 6 }, { dz: 0, duration: 0.9, ease: 'power3.out', immediateRender: false }, TD)     // forward out of the depth
    .fromTo(art, { scale: 1 }, { scale: 1.05, duration: X - h.tk, ease: 'sine.in', immediateRender: false }, h.tk);
  const all = [badge, glass, words, doc];
  rideCam(V, all, h, 0.75, 400);                                     // hovers, then the sink carries it off with the set
  badge.show(TH - 0.05, X); glass.show(TG - 0.05, X); words.show(TL - 0.05, X); doc.show(TD - 0.05, X);
  tag(18, all);

  // living gradients, locked to board 18 at the key instant
  anim(t => {
    const k = flowFill(), w = 6.2832 * (t - h.tk) * k.s;
    panel.style.background = holdBg(k.a * 5 * Math.sin(w / 9));
    gEl.style.background = pillBg(k.a * 4 * Math.sin(w / 7));
  });
};
