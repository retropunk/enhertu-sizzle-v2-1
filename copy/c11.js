/* Copy · frame 11 (41.4 → ~46 s): the holding shape ASCO: ACTIVATED (top right), HER2+ / UNBRANDED / CAMPAIGN / WENT LIVE
   (left) and the HER2+ Unbranded campaign picture (bottom left, v1's placeholder, assets/copy/her2-unbranded.jpg). v1's
   wording, styles and text moves (index.html, frame 11), placed in 3D in hold 11's view and fitted to board 11 (the lines
   by their ink; the picture frame 935.5 × 472.5 at 39.5, 567).
   The camera (G3, since the user's 21:50 rule "never stop"): one chase out of frame 10's ring: it overtakes the sphere in
   the tunnel, comes out of the ring backwards (~42.45) and pulls straight back (along −z, the lens narrowing 44 → 28) as the
   sphere comes out of the tunnel and drops over the lip (42.95–43.25), passing board 11's exact framing at the key instant
   44.825 (~5 u/s; slow window 44.3–45.4); then it orbits round the sphere's left onto frame 12's road.
   The user (21:50): "Just as the ball drops in, the 'ASCO activated' panel animates in from screen right around 43.2, and
   then the other panel comes in from screen left in a similar staggered animation" … "leave the 'ASCO activated' panel in
   place, and when we need to reintroduce it in the next frame 12 we can have it come in from off screen left."
   · In, staggered, as the sphere drops in and the camera pulls back (every time from hold 11's key instant):
     - key − 1.7 (43.125): the holding shape slides in from off screen right (crossing the edge at ~43.18; swinging round
       to face the view and pushing forward out of the depth as it comes), its two lines swiping in (v1's clip swipe) as it
       lands;
     - 0.35 s later HER2+ … WENT LIVE slide in from off screen left (on screen from ~43.68), their lines swiping in from
       as the block reaches the screen (0.55 s each, 0.05 apart: all readable by ~44.2; they were 0.7 s, 0.06 apart,
       readable by ~44.33, before the reading-time pass below);
     - 0.25 s after that the picture slides in from the left too (on screen from ~43.8), growing from its bottom-left
       corner (v1's #i-img: 0.7 → 1, back.out) and pushing forward out of the depth (frame 11's Z moment).
     All are in by ~44.7 and at rest by the key instant.
     The user (00:30): "Check the text and image panels as they animate in. I see some flickering of elements. They appear
     before they were supposed to." Dense 60 fps scans on the settled camera (seeked, and live playback) show every piece
     entering from off screen, once, with no pop; the likely cause was the camera changing under the copy (G3 was being
     re-cut 00:22–00:41): the holding shape's start offset then put its first frame on screen, so it popped into view before
     its slide. Every start is now well off screen (margins ~175–500 px), and the words' lines no longer start swiping
     while the block is still off screen (fragments of half-swiped letters used to pop in at the left edge).
   · On the way in (the camera backing out fast, the lens narrowing) a world place a little in front of the sphere would
     sit beyond the right / left edge until ~43.9 and fly in 2–4× too big; so their place is blended most of the way (0.9;
     the holding shape 0.93) toward riding in the camera's view up to the key instant (c07's hover(), as c10.js does),
     which leaves a mild parallax and a small settle onto the board. They hover (a slow float in 3D, zero at the key
     instant). At the key instant every piece is on board 11 (0–2 px). After it all three keep riding (0.9; the holding
     shape 0.93) to key + 0.85, then come to rest in the world where they are (c13's leaveInWorld(): a stand-in camera that
     slows to a stop over 0.6 s, so no jump), so they read on past the slow window (review, 01:30, "the user wants the copy
     on screen for longer").
   · Reading time (user, 2026-09-29, question A2: "add about ½ second where it's under ~1.3 s (e.g. 24, 25), borrowing time
     from the travel between frames so the piece stays 2:27"): all six lines readable at once for 1.70 s, 44.2–45.9 (was
     1.20 s, 44.33–45.53; the reading-time probe: every line fully built, none moving faster than 350 px/s, none leaving;
     1.50 s when each line's swipe must also have fully ended, was 0.93). Two changes, both in this file: the words' swipes
     are shorter (above), and the ride after the key lasts to key + 0.85 (was + 0.5), so the orbit carries the copy off
     ~0.35 s later. The camera, the sphere, the key instant and the build's start times are unchanged; the time comes from
     the start of the 11 → 12 orbit (the copy is read through what was travel), so the piece keeps its length. (A gentler
     start to the orbit's turn was tried in g3.js and measured: it added only ~0.03 s, because a place fixed in the world
     already moves faster than 350 px/s at the key's own camera speed, so the ride is what keeps the words readable.)
   · Out: none (user, 00:30: "the text panel and image can stay. They don't need an animate out. They don't need to animate
     off screen, and they don't need the alpha out because the camera move will hide them"). Nothing travels to frame 12
     (c12.js brings in frame 12's own ASCO: ACTIVATED from the left). Everything stays at full strength, comes to rest in
     the world, and the orbit carries it off with the set:
     - the words and the picture (a little in front of the sphere) slide off the left edge (the words by ~46.53, the
       picture by ~46.77); the orbit then swings the camera through their place (~47.1: they would sweep across the lens,
       hugely), so they end at GONE (key + 2.1, 46.925), while off screen (~0.16 s each side; measured every 1/30 s);
     - the holding shape is treated exactly like the picture (user, 02:20: "The ASCO panel looks weird because it goes
       flying off the screen. Can't we just leave it there the way the image panel is on the left?"). It used to be pulled
       toward the lens after the key, so the orbit flung it off the right edge. Now it rests in the world at the words'
       depth, top right, and the orbit carries it across the wall and off the top (~47.35, measured); it ends at GONE_A
       (key + 2.6, 47.425), off screen, before frame 12's own panel appears at the left (47.45);
     - on its way off, the holding shape turns a little with the camera: its turn follows the live camera's from 0 at the
       key to 0.3 by the release (key + 0.85), and keeps that 0.3, as c14's picture does (review, 2026-09-29). With the
       longer ride (the reading-time pass above) its world place is further round the orbit, and facing hold 11's view
       alone it turned edge-on and hung as a thin sliver near the top centre (~46.8–47.2), the look the 01:30 review
       rejected on frame 14. Now it goes off the top facing the camera in perspective, like the words and the picture.
   · The holding shape's outline is the boards' own (refit 2026-09-29, polish backlog: "holding-shape outer edges sit 2–4
     px inside the boards (refit 7–15 together)"): c07's HOLD, 603.6 × 304.2 with an 8 px frame and 82 px corners, centred
     on board 11's shape (1613, 246.5) and board 12's (395.95, 257.1). It was 596 × 300 on (1612, 246) and (395.2, 256.55),
     a 6 px frame and 70 px corners. The words and the layers are where they were. Board 11's shape runs to 5 px from the
     frame's right edge, so as it settles onto the board (~44.3–44.75, 1.9 % big and ~13 px right of its key place) its
     right rim is off the edge for a moment (up to ~7 px past it; the old, smaller shape went up to ~2.4 px past).
   Also exports helpers c12.js imports: ASCO11 (the holding shape's board 11 / board 12 places), ascoShape() (it, built in any
   hold's view) and depth12. */
import { liveFill, kit, holdBg, HOLD_FRAME, hover, contentFor, grow, watchPic, HOLD, holdCss } from './c07.js';
import { leaveInWorld, float3d, ramp } from './c13.js';

// board 11's holding shape (596 × 300; its text fitted to board 11's lettering) and its board 12 place (the text and box
// shift by the same (−1217, +10.5) px: board 12 measures ASCO: at 166.5 / 208.2 and ACTIVATED at 166 / 290.9). The
// lines' ink centres on board 11 are 197.3 and 280.7; the kit seats a cap centre, which for these round-lettered words
// sits 1.2 px above / 1.6 px below the ink centre, so cy is given +1.2 / −1.6 (measured on renders of holds 11 and 12)
// The shape itself (refit 2026-09-29, c07's HOLD: 603.6 × 304.2, an 8 px frame, 82 px corners) sits on each board's
// measured shape: shape11 / shape12 are its centres on boards 11 and 12 (outer edges); box, the layer's centre and the
// lines' reference, stays where it was (the shape was 596 × 300 centred on box and box + to12).
export const ASCO11 = { box: [1612, 246], w: HOLD.w, h: HOLD.h, pad: [660, 360], to12: [-1216.8, 10.55], shape11: [1613, 246.5], shape12: [395.95, 257.1],
  lines: [{ text: 'ASCO:', w: 'l', L: 1383.6, cy: 198.5, W: 238.4 }, { text: 'ACTIVATED', w: 'b', L: 1382.5, cy: 279.1, W: 457.5 }] };

/* ASCO: ACTIVATED laid out in hold n's view at `depth`, its layer centred at board px `box` (the lines keep their place:
   board 11's fit, moved by the same offset) and the shape centred at board px `shape` (default: box). Returns { lay (the
   layer), panel (the shape), lines (spans) }. TX (content.js's contentFor(V, n)): its words come from content/copy.json
   (frame n's "panel"); it grows with edited words. */
export function ascoShape(V, K, n, box, depth, TX, shape = box) {
  const A = ASCO11, [PW, PH] = A.pad, dx = box[0] - A.box[0], dy = box[1] - A.box[1];
  const lay = K.layer(n, [box[0] - PW / 2, box[1] - PH / 2, PW, PH], depth);
  const panel = document.createElement('div'); panel.className = 'hold box';
  panel.style.cssText = holdCss(PW / 2 + shape[0] - box[0] - A.w / 2, PH / 2 + shape[1] - box[1] - A.h / 2);
  lay.el.appendChild(panel);
  const lines = A.lines.map((s, i) => { const sp = { ...s, L: s.L + dx, cy: s.cy + dy }; return K.line(lay, TX ? TX.spec('panel', i, sp) : sp); });
  if (TX) grow(K.ready, { el: panel, box: [shape[0] - A.w / 2, shape[1] - A.h / 2, A.w, A.h], lines, refit: K.refit });
  return { lay, panel, lines };
}

// frame 12's copy depth from hold 12's camera: a little in front of its front shapes (the peach arch and the backdrop
// wall's shapes are at 10–11; the sphere at ~16)
export const depth12 = h12 => Math.min(8.5, h12.depth - 3);


export default V => {
  const { holds, copyTL, anim } = V;
  const h11 = holds[11];
  if (!h11) throw new Error('c11: frame 11 needs a hold');
  const K = kit(V), tk = h11.tk, TX = contentFor(V, 11);            // (TX: frame 11's words and picture from content/copy.json)

  /* ---------- the layers (hold 11's view) ---------- */
  const DF = h11.depth - 4;                                            // a little in front of the sphere (the wall's shapes are behind it)
  // the holding shape
  const { lay: badge, panel, lines: aLines } = ascoShape(V, K, 11, ASCO11.box, DF, TX, ASCO11.shape11);
  // the words
  const words = K.layer(11, [80, 190, 600, 360], DF);
  const wLines = [
    { text: 'HER2+', L: 130.0, cy: 250.7, W: 246.0 },
    { text: 'UNBRANDED', L: 129.6, cy: 331.7, W: 488.4 },
    { text: 'CAMPAIGN', L: 127.0, cy: 411.0, W: 417.0 },
    { text: 'WENT LIVE', L: 125.8, cy: 491.4, W: 422.2 }].map((s, i) => K.line(words, TX.spec('lines', i, { ...s, w: 'b' })));
  // the picture: board 11's frame (outer edge), a 12.5 px rim orange down the sides and violet across the middle of the top
  // and bottom (the holding shape's rim); the art fills the opening (object-fit cover, as v1). Its own layer 1 unit behind
  // the words ("lines in layers")
  const PB = [39.5, 567, 935.5, 472.5];
  const pic = K.layer(11, PB, DF + 1);
  const P = TX.pic('campaign', { src: 'assets/copy/her2-unbranded.jpg', fit: 'cover' });
  pic.el.innerHTML = `<div class="img" style="position:absolute;left:0;top:0;width:${PB[2]}px;height:${PB[3]}px;border:12.5px solid transparent;border-radius:62px;overflow:hidden;background:linear-gradient(#111,#111) padding-box,${HOLD_FRAME}">` +
    (P.edited ? `<img src="${P.src}" alt="" style="width:100%;height:100%;object-fit:${P.fit};object-position:${P.focus};display:block"></div>`
      : '<img src="assets/copy/her2-unbranded.jpg" alt="" style="width:100%;height:100%;object-fit:cover;display:block"></div>');
  const frame = pic.el.firstElementChild, art = frame.firstElementChild;
  watchPic(V, art, P);
  V.waitFor(art.decode().catch(() => {}));

  /* ---------- timing (from the key instant; G3: the sphere drops over the lip 42.95–43.25) ---------- */
  const TA = tk - 1.7;                                                 // 43.125: the holding shape, from the right (crossing the edge at ~43.2)
  const TW = TA + 0.35, TP = TW + 0.25;                                // the words, then the picture, from the left
  const SL = 0.95;                                                     // slide time (power3.out: most of it in the first half)
  // no exit (user, 00:30: "They don't need an animate out … the camera move will hide them"): each stays in the world and
  // the orbit carries it off (the words off the left edge by ~46.53 and the picture by ~46.77). The orbit then swings the
  // camera through the words' and picture's place (~47.1, where they would sweep across the lens hugely), so both layers
  // end at GONE, while they are off screen (~0.16 s each side; measured every 1/30 s after the reading-time pass).
  const GONE = tk + 2.1;                                               // 46.925 (was key + 1.87 with the release at key + 0.5)
  // the holding shape rests in the world like the picture (user, 02:20), top right, so the orbit carries it across the wall
  // and off the top by ~47.33 (measured): it ends then, while off screen and before frame 12's own appears (47.45)
  const GONE_A = tk + 2.6;                                             // 47.425 (was key + 2.37)
  // all three ride to TR, then rest in the world (reading time, user 2026-09-29: "add about ½ second"; TR was key + 0.5)
  const TR = tk + 0.85, TRD = 0.6;                                     // 45.675

  // entrance offsets (board px in hold 11's view): each starts well beyond its screen edge at the wide lens of the moment
  // (the holding shape ~175 px, the words ~500 px, the picture ~100 px), so its first frame is off screen and it slides in,
  // even if the camera is retimed a little (on the 00:40 camera the holding shape's 1290 started ~14 px off; before that its
  // 1150 put its first frame on screen: the user's "they appear before they were supposed to"). The holding shape now
  // crosses the right edge at ~43.2, the words the left edge at ~43.7, the picture at ~43.82.
  const A0 = { x: 1600, ry: -32, z: 5 }, W0 = { x: -1100, ry: 26, z: 4 }, P0 = { x: -1450, ry: 22, z: 6 };
  const stA = { y: 0, rx: 0, ...A0 }, stW = { y: 0, rx: 0, ...W0 }, stP = { y: 0, rx: 0, ...P0 };   // (start where they come from)
  copyTL.fromTo(stA, A0, { x: 0, ry: 0, z: 0, duration: SL, ease: 'power3.out', immediateRender: false }, TA)
    .fromTo(stW, W0, { x: 0, ry: 0, z: 0, duration: SL, ease: 'power3.out', immediateRender: false }, TW)
    .fromTo(stP, P0, { x: 0, ry: 0, z: 0, duration: SL, ease: 'power3.out', immediateRender: false }, TP);
  K.swipe(aLines, TA + 0.3, 0.1);                                      // the holding shape's lines as it lands
  K.swipe(wLines, TW + 0.22, 0.05, 0.55);                             // 0.55 s swipes, 0.05 apart (v1: 0.7 s, 0.1 apart; tighter so
                                                                       // the block reads sooner: readable by ~44.2, was ~44.33 with
                                                                       // 0.7 s, 0.06 apart). From as the block reaches the screen,
                                                                       // so no line is half-swiped by the time it's seen
  gsap.set(frame, { scale: 0.7, transformOrigin: '0% 100%' });
  copyTL.fromTo(frame, { scale: 0.7 }, { scale: 1, duration: 0.75, ease: 'back.out(1.2)', immediateRender: false }, TP + 0.1)
    .fromTo(art, { scale: 1 }, { scale: 1.06, duration: GONE - tk, ease: 'sine.in', immediateRender: false }, tk);   // v1's slow push into the art

  /* ---------- place: hover, blended toward the camera's view on the way in ---------- */
  // most of the way toward riding in the camera's view up to the key instant (so the world's share is a small settle that
  // shrinks to nothing as the camera reaches the board's pose; the camera is on the board's exact pose at the key instant,
  // so the blend changes nothing there). G3's pull-back keeps its speed longer now: at 0.8 the words settled ~75 px and the
  // holding shape arrived ~4 % big, its rim ~40 px past the right edge (44.0–44.7), so 0.9 (the holding shape, next to the
  // edge, 0.93). After the key all three ride on to TR, then leaveInWorld() rests them in the world where they are.
  // The holding shape is treated exactly like the picture (user, 02:20: "The ASCO panel looks weird because it goes flying
  // off the screen. Can't we just leave it there the way the image panel is on the left?"): it rides to TR too, then
  // leaveInWorld() rests it in the world at the words' depth, and the orbit carries it off with the set. (It used to be
  // handed to the world at the key and pulled toward the lens, so the orbit flung it off the right edge.)
  const beta = t => t < TR ? 0.9 : 0, betaA = t => t < TR ? 0.93 : 0;
  // The holding shape also turns a little with the camera after the key (review, 2026-09-29): with the ride to key + 0.85
  // its world place is further round the orbit, and facing hold 11's view alone it turned edge-on as the orbit carried it
  // off (a thin sliver near the top centre, ~46.8–47.2). So its turn follows the live camera's, 0 at the key (the camera
  // is on the board's pose there, so nothing changes up to it) easing to 0.3 by TR and kept (as c14's picture): its place
  // still rests in the world (leaveInWorld below), and the orbit carries it off the top facing the camera in perspective.
  const turnA = ramp([[tk, 0], [TR, 0.3]]);
  float3d(V, [badge], { tk, seed: 41, amp: 6, tilt: 1.2, per: 0.9, st: stA, ride: betaA, rideQ: turnA });   // (c07's hover() + the turn)
  hover(V, [words], { tk, seed: 42, amp: 6, tilt: 1.1, per: 0.9, st: stW, beta });
  hover(V, [pic], { tk, seed: 42, amp: 6, tilt: 1.1, per: 0.9, st: stP, beta });   // (the same float as the words: one block)
  leaveInWorld(V, [words, pic], { h: h11, ta: TR, T: TRD, b: 0.9 });
  leaveInWorld(V, [badge], { h: h11, ta: TR, T: TRD, b: 0.93 });

  /* ---------- living fill (board 11's colours at the key instant) ---------- */
  anim(t => { panel.style.background = holdBg(liveFill(t, tk, 5, 9)); });

  /* ---------- out: none; each stays in the world until it's off screen (see GONE) ---------- */
  gsap.set(panel, { autoAlpha: 1 });
  badge.show(TA - 0.05, GONE_A); words.show(TW - 0.05, GONE); pic.show(TP - 0.05, GONE);
};
