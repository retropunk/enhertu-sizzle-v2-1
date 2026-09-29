/* Copy · frame 15 (61.95 s → the cut at 66.85): the holding shape KOLs: / ACTIVATED (top left), JULY 2025 / 3 KOL VIDEOS
   SHOT / BACK-TO-BACK on the left (the board's line breaks; v1 broke it 3 KOL VIDEOS / SHOT BACK-TO-BACK), and the three KOL
   stills along the bottom in their frames. v1's wording, styles and moves (index.html, frame 15: the holding shape wipes open,
   its lines swipe in, the left lines swipe in, the stills rise in 80 px with back.out, staggered), placed in 3D in hold 15's
   view and timed from the hold (every time below is read from V.holds[15]).
   The camera (G3 since the user's 21:50 rule "never stop"): hold 15 is a pass-through, slow window 64.1–65.2, key 64.6.
   Frame 14's ramp curves round into frame 15: the camera comes round the bend with the sphere, still turning ~55°/s at
   63.5 and ~30°/s at 64.0, eases to ~2.7 u/s and almost no turn at the key, then pushes on straight toward the doorway
   (3–7 u/s) until the full-screen gradient wipe (66.35, left to right) and the cut (66.85).
   · Fitted to board 15 (measured at 1920 px): each line's ink left edge, cap centre and width (sized by the kit from the
     width); the holding shape is board 15's own: 603.6 × 304.2 centred on (367.15, 232.45), an 8 px frame and 82 px corners
     (c07's HOLD, refit 2026-09-29, polish backlog "holding-shape outer edges sit 2–4 px inside the boards"; it was 596 × 300
     centred on (366, 232) with a 6 px frame and 70 px corners, its edges 0.5–4.8 px inside the board's), in c07's holdBg,
     flowing, locked to the board at the key instant. It still clears the left edge until the wipe covers it (~19 px at
     66.5). The stills' frames sit on the board's outer edges (x 63–644.5, 678.5–1259.5, 1279–1860.5; y
     695.5–1023.5), 8 px, radius 80, in the same orange / violet frame gradient. The pictures are v1's placeholders, 1:1
     crops of the board, laid where the board has them and grown ~2% about their own centres so they fill the frames.
   · Depth ("lines in layers"): three layers between the sphere (13.7 from hold 15's camera) and the wall's front reliefs:
     the holding shape nearest (sphere + 2.8), the left lines (+ 3.8), the stills (+ 4.8).
   · Build, left to right as in v1 (the holding shape, then the left lines, then the stills, left to right), as the camera
     comes round the bend and slows onto the board:
       the holding shape wipes open at key − 1.3 (its lines swipe in from + 0.15, 0.1 apart);
       the left lines swipe in from key − 1.05 (0.1 apart; at rest by key − 0.25);
       the stills rise in from key − 0.9, 0.08 apart (0.55 s), each coming forward out of the wall as it rises (3 units:
       frame 15's one Z moment).
     All are in and at rest by the key instant (the board's layout there).
   · They float (c13's float3d(): a slow hover in 3D, zero at the key instant). While the camera comes round, their place
     rides most of the way in the camera's view (0.95, the rest of the world's motion still showing) and part of its turn
     (0.5 → 0.3, so they're seen in perspective as the camera turns), and they keep 80 % of the key's lens (c13's
     lensHold(): the lens narrows ~35° → 28° over the build, a 1.26× zoom in): so they build where the board has them
     instead of sweeping ~350 px left and swelling while the lines swipe in (now ~185 px over 1.3 s). After the key the
     camera pushes on toward the doorway, drifting the world left: the words keep riding (0.97) and the stills (0.96), so
     they drift only a little and the holding shape's and the first still's rims stay clear of the left edge until the
     wipe covers them; the stills stay a clean row across the bottom.
   · Exit, as v1: the words and the stills stay for the wipe (66.35, left to right, above the copy; its edge enters the
     frame ~66.5) to sweep off together, so the words read from ~64.3 until then (~2 s). They're gone just before the cut
     (66.85), under the wipe. Nothing lasts past it. */
import { liveFill, kit, holdBg, HOLD_FRAME, contentFor, grow, watchPic, picCss, HOLD, holdCss, holdClip } from './c07.js';
import { float3d, ramp, lensHold } from './c13.js';

// board 15 (1920 px). Lines: ink left L, cap centre cy, ink width W.
// The holding shape's layer is centred on BOX.c (the shape's old centre); the shape sits on board 15's measured shape,
// centred on SHAPE (outer edges), in c07's refit outline HOLD (603.6 × 304.2; it was 596 × 300 centred on BOX.c).
const BOX = { c: [366, 232] }, SHAPE = [367.15, 232.45];
const HOLD_LINES = [{ text: 'KOLs:', w: 'l', L: 162, cy: 181.5, W: 209 }, { text: 'ACTIVATED', w: 'b', L: 155, cy: 278.5, W: 457 }];
const LEFT_LINES = [{ text: 'JULY 2025', w: 'l', L: 93, cy: 451.5, W: 291 }, { text: '3 KOL VIDEOS SHOT', w: 'b', L: 95, cy: 521, W: 657 },
  { text: 'BACK-TO-BACK', w: 'b', L: 96, cy: 599, W: 505 }];
// the stills: the frame's outer x edges, and where each picture (a 1:1 crop of the board) sits on the board [x, y, w, h]
const PICS = [{ src: 'kol1.jpg', x: [63, 644.5], img: [77, 707, 555, 307] }, { src: 'kol2.jpg', x: [678.5, 1259.5], img: [687, 707, 562, 307] },
  { src: 'kol3.jpg', x: [1279, 1860.5], img: [1292, 707, 550, 307] }];
const PY = [695.5, 1023.5], FW = 8, FRAD = 80;

export default V => {
  const { holds, copyTL, anim } = V;
  const h = holds[15], CUT = V.CUTS.G4;
  if (!h) throw new Error('c15: frame 15 needs a hold');
  const K = kit(V), TX = contentFor(V, 15), tk = h.tk, RI = 0.95, RW = 0.97, RS = 0.96, LW = 0.8;   // the ride in; the words' / stills' ride after the key; the lens held
  const DH = h.depth + 2.8, DL = h.depth + 3.8, DP = h.depth + 4.8;   // holding shape · left lines · stills

  /* --- the holding shape (its lines are siblings of the shape, so the Layers switch can hide the shape and keep the text) --- */
  const bx = [BOX.c[0] - 330, BOX.c[1] - 180, 660, 360];
  const badge = K.layer(15, bx, DH); badge.el.dataset.cp = 'c15-badge';
  const panel = document.createElement('div'); panel.className = 'hold box';
  panel.style.cssText = holdCss(SHAPE[0] - HOLD.w / 2 - bx[0], SHAPE[1] - HOLD.h / 2 - bx[1]);
  badge.el.appendChild(panel);
  const hLines = HOLD_LINES.map((s, i) => K.line(badge, TX.spec('panel', i, s)));
  grow(K.ready, { el: panel, box: [SHAPE[0] - HOLD.w / 2, SHAPE[1] - HOLD.h / 2, HOLD.w, HOLD.h], lines: hLines, refit: K.refit });

  /* --- the left lines, one layer --- */
  const left = K.layer(15, [60, 405, 760, 240], DL); left.el.dataset.cp = 'c15-left';
  const lLines = LEFT_LINES.map((s, i) => K.line(left, TX.spec('lines', i, s)));

  /* --- the stills, one layer each (so each can come forward on its own) --- */
  const stills = PICS.map((p, k) => {
    const [x0, x1] = p.x, w = x1 - x0, hgt = PY[1] - PY[0];
    const L = K.layer(15, [x0, PY[0], w, hgt], DP); L.el.dataset.cp = `c15-still${k + 1}`;
    const fr = document.createElement('div'); fr.className = 'img';
    fr.style.cssText = `position:absolute;left:0;top:0;width:${w}px;height:${hgt}px;border:${FW}px solid transparent;border-radius:${FRAD}px;overflow:hidden;background:linear-gradient(#111,#111) padding-box,${HOLD_FRAME}`;
    // the picture at its board place, grown about its own centre just enough to fill the frame's opening
    const [ix, iy, iw, ih] = p.img, cx = ix + iw / 2, cy = iy + ih / 2, inL = x0 + FW, inT = PY[0] + FW, inR = x1 - FW, inB = PY[1] - FW;
    const kk = Math.max((cx - inL) / (iw / 2), (inR - cx) / (iw / 2), (cy - inT) / (ih / 2), (inB - cy) / (ih / 2)) + 0.002;
    const P = TX.pic(`kol${k + 1}`, { src: `assets/copy/${p.src}`, fit: 'cover' });
    const im = document.createElement('img'); im.src = P.src; im.alt = ''; watchPic(V, im, P);
    im.style.cssText = P.edited ? picCss(P) : `position:absolute;display:block;max-width:none;left:${(cx - kk * iw / 2 - inL).toFixed(2)}px;top:${(cy - kk * ih / 2 - inT).toFixed(2)}px;width:${(kk * iw).toFixed(2)}px;height:${(kk * ih).toFixed(2)}px`;
    fr.appendChild(im); L.el.appendChild(fr);
    V.waitFor(im.decode().catch(() => {}));                           // the first render waits for the picture
    return Object.assign(L, { fr });
  });

  /* --- timing, from the key instant: left to right, every entrance at rest by the key --- */
  const TB = tk - 1.3;                                              // the holding shape (0.7 s wipe); its lines from + 0.15
  const TL = tk - 1.05;                                             // the left lines (0.6 s, 0.1 apart: at rest by key − 0.25)
  const TS = tk - 0.9, SS = 0.08, SD = 0.55;                        // the stills (at rest by key − 0.19)
  gsap.set(panel, { autoAlpha: 0 });
  copyTL.set(panel, { autoAlpha: 1 }, TB)                           // v1's holdIn: a set, so it survives seeking back and forth
    .fromTo(panel, { clipPath: holdClip(100) }, { clipPath: holdClip(0), duration: 0.7, ease: 'expo.out', immediateRender: false }, TB);
  K.swipe(hLines, TB + 0.15, 0.1, 0.6);
  K.swipe(lLines, TL, 0.1, 0.6);
  // the stills rise in (v1: y 80 → 0, back.out, after the words) and come forward out of the wall as they rise
  gsap.set(stills.map(s => s.fr), { autoAlpha: 0, y: 80 });
  stills.forEach((s, i) => {
    const t = TS + SS * i;
    copyTL.fromTo(s.fr, { autoAlpha: 0, y: 80 }, { autoAlpha: 1, y: 0, duration: SD, ease: 'back.out(1.3)', immediateRender: false }, t)
      .fromTo(s, { dz: 3 }, { dz: 0, duration: SD, ease: 'power3.out', immediateRender: false }, t);
  });

  // living gradient on the holding shape's fill, board 15's at the key instant
  anim(t => { panel.style.background = holdBg(liveFill(t, tk, 5, 9)); });

  // exit: as v1, the words and the stills stay for the wipe (66.35, left to right, above the copy) to sweep off; they're
  // gone just before the cut, under the wipe
  [badge, left].forEach(o => o.show(TB - 0.05, CUT - 1e-3));
  stills.forEach(o => o.show(TS - 0.05, CUT - 1e-3));                // (not at the cut itself: G4's camera would place them far off)

  /* --- the float: riding most of the way in the camera's view as it comes round, then through the push --- */
  const turn = ramp([[TB, 0.5], [tk, 0.3]]);
  const ride = ramp([[TB, RI], [tk - 0.3, RI], [tk + 0.3, RW]]);
  float3d(V, [badge], { tk, seed: 51, amp: 5, tilt: 0.9, ride, rideQ: turn });
  float3d(V, [left], { tk, seed: 52, amp: 5, tilt: 0.8, ride, rideQ: turn });
  float3d(V, stills, { tk, seed: 53, amp: 4, tilt: 0.7, ride: ramp([[TB, RI], [tk - 0.3, RI], [tk + 0.4, RS]]), rideQ: turn });
  // the lens narrows ~35° → 28° as the camera comes round (a 1.26× zoom in): they keep most of the key's lens as they build
  lensHold(V, [badge, left, ...stills], { tanK: h.tanV, w: ramp([[TB, LW], [tk, LW], [tk + 0.4, 0]]) });
};
