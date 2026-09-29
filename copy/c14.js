/* Copy · frame 14 (56.85 → 61.95 s): the holding shape IMMERSIVE MODE / ACTIVATED: (top left), JUNE 2025 / 2 PATIENT CASES
   / CAME TO LIFE / WITH APPLE / VISION PRO on the left (the board's line breaks; v1 stopped at CAME TO LIFE), and the Apple
   Vision Pro creative at the lower right in its frame. v1's wording, styles and moves (index.html, frame 14: the holding
   shape wipes open, its lines swipe in, the left lines swipe in, the picture scales up from 0.7 about its bottom-right
   corner with back.out and then pushes in slowly), placed in 3D in hold 14's view and timed from the hold: every time
   below is read from V.holds[14].
   The camera (G3 since the user's 21:50 rule "never stop"): hold 14 is a pass-through, slow window 60.35–61.4, key 60.95.
   It swings in fast (~12 u/s, turning up to ~50°/s at 59.5), slows to ~2.6 u/s at the key while the sphere stops on its
   spot (60.45–61.05), then orbits off round the sphere's left (turning 40–70°/s) as it rolls down to the left.
   · Fitted to board 14 (measured at 1920 px): each line's ink left edge, cap centre and ink width (the kit sizes the bold
     lines from their width; the two Light lines from their cap height, with a little tracking to their width). ACTIVATED
     is ExtraBold and its colon Regular (the board's dots are 10 px). The holding shape is board 14's own: 603.6 × 304.2
     centred on (362.35, 191), an 8 px frame and 82 px corners (c07's HOLD, refit 2026-09-29, polish backlog "holding-shape
     outer edges sit 2–4 px inside the boards"; it was 596 × 296 centred on (362, 190.4) with a 6 px frame and 70 px
     corners, its edges 3–5 px inside the board's), in c07's holdBg, flowing, locked to the board at the key instant. The picture's frame sits on the board's outer edges
     (958–1859.5 × 558.5–1045.5; radius 88, a 13 px frame) in the same orange / violet frame gradient; the picture is v1's
     placeholder (assets/copy/vision-pro.jpg), grown ~2.5% to cover the frame.
   · Depth ("lines in layers"): three layers from hold 14's camera. The picture is the nearest, at 3: IN FRONT of the
     sphere (11.45), of the band the sphere rolls down (its near edge is at 8) and of the hill under it (which runs from
     depth ~13 at the picture's top left to ~3.7 at the frame's bottom right), so the sphere is behind it (user, 2026-09-29,
     the last point below). The holding shape (17.5) and the left lines (20) sit behind the sphere, in front of the set's
     shapes behind the copy. Each layer's scale follows its depth, so from the key camera it is the board's at any depth.
     (It was at 5 until the review of 2026-09-29: see Out.)
   · The user (21:50): "when the text and images come in, we want to stagger the animations from left to right. So the text
     panel, then the lower-left text, and then the images on the right." Build, as the camera swings in and slows, each a
     beat after the last and each pushing forward out of the depth as it builds (the words 3 units, the picture 0.6: the
     same 20 % of its depth, so it builds on screen exactly as it did at 15):
       the holding shape wipes open at key − 1.8 (its lines swipe in from + 0.1, 0.1 apart);
       the left lines swipe in from key − 1.45 (0.08 apart);
       the picture scales up from key − 1.1 (0.75 s).
     (Each 0.3 s earlier than before the reading-time pass below: key − 1.5, − 1.15, − 0.8.) The words are readable from
     ~60.2 and all are at rest by the key instant (the board's layout there, within a px or two).
   · They float (c13's float3d(): a slow hover in 3D, zero at the key instant). While the camera swings in, their place
     rides most of the way in the camera's view (0.92 to key − 0.3; the picture 0.95, as at its nearer depth the world's
     share moves it more on screen) and half their turn (so the swing shows them in perspective, turning flat as it lands):
     in a pure world place the holding shape would still be 400–700 px off the left edge as it wipes open. After the key
     the words keep riding (0.88) through the stop, so they read on, and the picture rides even more (0.98) into the start
     of the orbit (to key + 0.7), so it stays put on screen beside them (under ~100 px/s to 61.75) instead of drifting off
     alone; it keeps 0.3 of the camera's turn at the key, 0.5 from key + 0.7 (it follows the camera a little, so the orbit
     never shows it edge-on).
   · Out: none (user, 00:30: no transition-outs; the camera move hides the copy). 0.3 s after the camera's GO (hold end
     + 0.15, 61.55; it was at GO, 61.25, before the reading-time pass below) the words come to rest in the world where
     they are (c13's leaveInWorld(): they ride a stand-in camera that slows to a stop over 0.4 s, so no jump), and the
     orbit carries them up and off the top left at full strength (the holding shape by ~62.4, the left lines by ~63.07;
     measured every 1/30 s). The orbit would later bring them back past the lens (~64), so their layers end at key + 2.55
     (63.5), off screen, before frame 15's copy (from 63.33, at the top left) is in view.
     The picture, nearer than the sphere the orbit turns round, goes the other way: the orbit carries it off the RIGHT
     edge, and it leaves WITH the words, at about their pace. It comes to rest in the world from key + 0.7 (61.65) through
     the same leaveInWorld() as the words, over a longer 2 s (its stand-in camera eases to a stop by 62.65), so the orbit
     takes it gradually: it starts to go ~61.75, keeps to the words' speed until ~62.1 (e.g. 670 px/s at 62.0 against
     their 720–760), holds ~1000–1055 px/s over 62.15–62.45 (theirs 660–810 then; the last lines reach ~990–1020 as
     they leave, ~63.0) and is off by ~62.6. As the camera comes on round the sphere its place would swing back into view edge-on at the top right (from
     ~63.0), so its layer ends at key + 1.85 (62.8), in the middle of the ~0.4 s it is off screen. (Measured every 1/60 s.)
     Why this place (review, 2026-09-29: at depth 5, let go of the camera over the half second after the key, it whipped
     off alone at up to 2283 px/s, 61.3–61.65, while the words beside it were still; before today it peaked ~1090): in
     this orbit a picture in front of the sphere can only leave by the right edge, and a place fixed in the world comes
     back into view by ~62.6–63.0, so it has to be off before then. Deeper (8–10, just in front of the sphere, as the
     review suggested) it never leaves: near the point the camera orbits round, it swings across the top of the frame,
     edge-on, into frame 15's copy (~63.3–63.7). At 5–7 let go at the words' release it still whips off at 2000–2500 px/s.
     Nearer (3), riding the camera longer and letting go slowly is what brings its exit down to the words' pace.
     (History: at 15, behind the sphere, it turned edge-on and hung as a thin sliver at the top of the frame; at 20 it went
     off the top left with the words, and the sphere rolled over it through a cut-out, ~61.65–62.35: the user's note.)
   · Reading time (user, 2026-09-29, question A2: "add about ½ second where it's under ~1.3 s (e.g. 24, 25), borrowing time
     from the travel between frames so the piece stays 2:27"): all seven lines readable at once for 1.60 s, 60.2–61.8 (was
     1.03 s, 60.5–61.53; the reading-time probe: every line fully built, none moving faster than 350 px/s, none leaving;
     1.37 s when each swipe must also have fully ended, was 0.80). Two changes, both in this file: the build starts 0.3 s
     earlier (the left-to-right stagger unchanged; they ride the camera 0.92 on the way in, so they settle onto the board
     as before), and the words ride through the stop 0.3 s longer, into the start of the orbit. The camera, the sphere and
     its stop and the key instant are unchanged (the picture's exit was changed later, see Out); the time comes from the
     swing in before the key and the start of the 14 → 15 orbit after it (the copy is read through what was travel), so the
     piece keeps its length.
     (A gentler start to the orbit's turn was tried in g3.js and measured: no gain, because the camera also follows the
     sphere as it rolls away, and a place fixed in the world moves faster than 350 px/s as soon as the camera does; the
     ride is what keeps the words readable.)
   · The sphere passes BEHIND the picture (user, 2026-09-29: "on Frame 14 i notice the Sphere passes the image weirdly,
     can we have it so the sphere passes behind the image? is that possible? right now it seems to roll over the image
     and breaks the space illusion"). It used to pass in front (decision 5a): the picture sat behind the sphere in 3D and
     the sphere's silhouette was cut out of it each frame. That cut-out is gone. The geometry agrees instead: the picture
     is nearer than the sphere, so the page drawing it over the 3D scene is right from every camera angle. The sphere
     does not cross the picture, though: it rolls away down-left while the orbit takes the picture off to the right. They
     only meet at the picture's top-left corner, ~61.85–62.0, as the picture starts to go: the sphere skims just past the
     corner and its shadow slides behind it (checked every 1/60 s, 59.8–63.3: the sphere's circle touches the picture's
     box only then, and the sphere is always the farther of the two). The words keep their relationship to the sphere
     (user: "keep as is"). */
import { liveFill, kit, holdBg, HOLD_FRAME, contentFor, grow, watchPic, picCss, HOLD, holdCss, holdClip } from './c07.js';
import { float3d, ramp, leaveInWorld } from './c13.js';

// board 14 (1920 px). Lines: ink left L, cap centre cy, ink width W; the two Light lines also their cap height H (the board
// sets them ~3–5% smaller than New Hero's own spacing would, with a little tracking, so the kit sizes them by H).
// The holding shape: board 14's measured shape, centred on SHAPE (outer edges), in c07's refit outline HOLD (603.6 ×
// 304.2, as every board draws it; it was 596 × 296 centred on (362, 190.4)). Its layer keeps its old place and size (BX).
const SHAPE = [362.35, 191];
const BX = [32, 10.4, 660, 360];                                     // the layer (the old box, 32 px round it)
const HOLD_LINES = [{ text: 'IMMERSIVE MODE', w: 'l', L: 132, cy: 150, W: 440, H: 35.6 }, { text: 'ACTIVATED', w: 'b', L: 127.1, cy: 234, W: 466.1 }];
const LEFT_LINES = [{ text: 'JUNE 2025', w: 'l', L: 72.5, cy: 433.1, W: 314, H: 44.55 }, { text: '2 PATIENT CASES', w: 'b', L: 73.1, cy: 503.9, W: 579.8 },
  { text: 'CAME TO LIFE', w: 'b', L: 73, cy: 576.6, W: 471.3 }, { text: 'WITH APPLE', w: 'b', L: 71.3, cy: 650.8, W: 428.6 },
  { text: 'VISION PRO', w: 'b', L: 70.4, cy: 725.9, W: 408.3 }];
// the picture's frame: outer edges, frame width, outer corner radius
const PIC = { x: [958, 1859.5], y: [558.5, 1045.5], fw: 13, r: 88, src: 'assets/copy/vision-pro.jpg' };

export default V => {
  const { holds, copyTL, anim } = V;
  const h = holds[14];
  if (!h) throw new Error('c14: frame 14 needs a hold');
  const K = kit(V), tk = h.tk, TX = contentFor(V, 14);              // (TX: frame 14's words and picture from content/copy.json)
  V.waitFor(document.fonts.load('400 100px "new-hero"'));           // (the colon's weight)
  // picture 3 (nearer than the sphere, 11.45, and than anything of the set under it: see the header) · holding shape 17.5 ·
  // left lines 20
  const D = h.depth, DP = 3, DB = D + 6, DL = D + 8.5;

  /* --- the holding shape (its box and lines in one layer) --- */
  const badge = K.layer(14, BX, DB); badge.el.dataset.cp = 'c14-badge';
  const panel = document.createElement('div'); panel.className = 'hold box';
  panel.style.cssText = holdCss(SHAPE[0] - HOLD.w / 2 - BX[0], SHAPE[1] - HOLD.h / 2 - BX[1]);
  badge.el.appendChild(panel);
  const hS = HOLD_LINES.map((s, i) => TX.spec('panel', i, s, i === 1 ? '**ACTIVATED**:' : undefined));
  const hImm = hS.map(s => K.line(badge, s));
  if (!hS[1].edit) {
    const colon = document.createElement('span'); colon.style.fontWeight = '400'; colon.textContent = ':';
    hImm[1].appendChild(colon);                                       // ACTIVATED's colon, Regular, right after the D (no tracking)
  } else for (const k of hImm[1].children) if (k.textContent === ':') k.style.fontWeight = '400';   // (an edited line: a lone colon stays Regular)
  grow(K.ready, { el: panel, box: [SHAPE[0] - HOLD.w / 2, SHAPE[1] - HOLD.h / 2, HOLD.w, HOLD.h], lines: hImm, refit: K.refit });

  /* --- the left lines, one layer --- */
  const left = K.layer(14, [40, 380, 700, 400], DL); left.el.dataset.cp = 'c14-left';
  const l14 = LEFT_LINES.map((s, i) => K.line(left, TX.spec('lines', i, s)));

  /* --- the picture, the nearest layer (in front of the sphere) --- */
  const [px0, px1] = PIC.x, [py0, py1] = PIC.y, pw = px1 - px0, ph = py1 - py0;
  const pic = K.layer(14, [px0, py0, pw, ph], DP); pic.el.dataset.cp = 'c14-pic';
  const frame = document.createElement('div'); frame.className = 'img';
  frame.style.cssText = `position:absolute;left:0;top:0;width:${pw}px;height:${ph}px;border:${PIC.fw}px solid transparent;border-radius:${PIC.r}px;overflow:hidden;background:linear-gradient(#140a2e,#140a2e) padding-box,${HOLD_FRAME}`;
  const P = TX.pic('vision-pro', { src: PIC.src, fit: 'cover' });
  const img = document.createElement('img'); img.src = P.src; img.alt = ''; watchPic(V, img, P);
  img.style.cssText = P.edited ? `width:100%;height:100%;object-fit:${P.fit};object-position:${P.focus};display:block` : 'width:100%;height:100%;object-fit:cover;object-position:50% 50%;display:block';
  frame.appendChild(img); pic.el.appendChild(frame);
  V.waitFor(img.decode().catch(() => {}));                            // the first render waits for the picture

  /* --- timing, from the key instant: left to right (the user), every entrance at rest by the key --- */
  const TB = tk - 1.8;                                                // the holding shape's wipe (0.6 s); its lines from + 0.1
  const TL = tk - 1.45;                                               // the left lines (0.6 s, 0.08 apart: at rest by key − 0.53)
  const TP = tk - 1.1;                                                // the picture (0.75 s)
  // (reading time, user 2026-09-29: "add about ½ second": the three starts are each 0.3 s earlier than they were, key − 1.5,
  //  − 1.15, − 0.8, and the words' release (TR) is 0.3 s later, hold end + 0.15 (it was hold end − 0.15, the camera's GO))
  // no exit (user, 00:30): from TR the words come to rest in the world where they are (c13's leaveInWorld: they ride a
  // stand-in camera that slows to a stop over TRD) and the orbit carries them up and off the top left (the holding shape
  // by ~62.4, the left lines by ~63.07). Later the orbit would bring them back past the lens (~64),
  // so their layers end at GONE, while they are off screen. The picture rides the camera through the stop and the start of
  // the orbit (0.98) and comes to rest in the world from TRP, over a long TRPD (leaveInWorld again: its stand-in camera
  // eases to a stop by TRP + TRPD / 2, 62.65), so the orbit carries it off the RIGHT edge at about the words' pace (it is
  // nearer than the sphere the orbit turns round, so it goes the other way): it starts to go ~61.75 and is off by ~62.6. As
  // the camera comes round, its place would swing back into view edge-on at the top right (from ~63.0), so its layer ends
  // at PGONE (62.8), in the middle of the ~0.4 s it is off screen.
  const TR = h.t1 + 0.15, TRD = 0.4, GONE = tk + 2.55;                // 61.55 · 63.5
  const TRP = tk + 0.7, TRPD = 2.0, PGONE = tk + 1.85;                // 61.65 · 62.8
  badge.show(TB - 0.05, GONE); left.show(TL - 0.05, GONE); pic.show(TP - 0.05, PGONE);

  gsap.set(panel, { autoAlpha: 0 });
  copyTL.set(panel, { autoAlpha: 1 }, TB)                            // v1's holdIn (a set, so it survives seeking)
    .fromTo(panel, { clipPath: holdClip(100) }, { clipPath: holdClip(0), duration: 0.6, ease: 'expo.out', immediateRender: false }, TB);
  K.swipe(hImm, TB + 0.1, 0.1, 0.6);
  K.swipe(l14, TL, 0.08, 0.6);
  gsap.set(frame, { autoAlpha: 0, scale: 0.7, transformOrigin: '100% 100%' });
  copyTL.fromTo(frame, { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.75, ease: 'back.out(1.2)', immediateRender: false }, TP)
    // v1's slow push into the art, from just before the key instant (so the art is the board's there), gathering pace
    .fromTo(img, { scale: 1 }, { scale: 1.06, duration: GONE - (tk - 0.3), ease: 'sine.in', immediateRender: false }, tk - 0.3);
  // each pushes forward out of the depth as it builds: the words 3 units; the picture 0.6 (3 × its depth / 15: the same 20 %
  // of its depth as its old push from 18 to 15, so it builds on screen exactly as before)
  [[badge, TB, 3], [left, TL, 3], [pic, TP, 3 * DP / 15]].forEach(([o, t, z]) => copyTL.fromTo(o, { dz: z }, { dz: 0, duration: tk - t, ease: 'power3.out', immediateRender: false }, t));

  // living gradient on the holding shape: the fill drifts ±5 %, board 14's colours at the key instant
  anim(t => { panel.style.background = holdBg(liveFill(t, tk, 5, 9)); });

  /* --- the float: on the way in they ride most of the way in the camera's view; after the key the words keep riding
     (0.88) to TR, and the picture more (0.98) to TRP, then each comes to rest in the world (leaveInWorld). The picture keeps
     half the camera's turn from TRP (0.3 at the key), live, so the orbit shows it in perspective but never edge-on --- */
  const rideW0 = ramp([[TB, 0.92], [tk - 0.3, 0.92], [tk + 0.3, 0.88]]);
  // (the picture rides 0.95 on the way in, not the words' 0.92: at depth 3 the world's share moves it more on screen, and
  //  0.95 builds it with the same small drift it had at depth 5 (~40–80 px/s after 60.2, within ~6 px of the old place))
  const rideP0 = ramp([[TB, 0.95], [tk - 0.3, 0.95], [tk + 0.3, 0.98]]);
  const turnW0 = ramp([[TB, 0.6], [tk, 0.3]]), turnP = ramp([[TB, 0.6], [tk, 0.3], [TRP, 0.5]]);
  const rideW = t => t < TR ? rideW0(t) : 0, turnW = t => t < TR ? turnW0(t) : 0, rideP = t => t < TRP ? rideP0(t) : 0;
  float3d(V, [badge], { tk, seed: 41, amp: 5, tilt: 0.9, ride: rideW, rideQ: turnW });
  float3d(V, [left], { tk, seed: 42, amp: 5, tilt: 0.8, ride: rideW, rideQ: turnW });
  leaveInWorld(V, [badge, left], { h, ta: TR, T: TRD, b: rideW0(TR), bq: turnW0(TR) });
  float3d(V, [pic], { tk, seed: 43, amp: 6, tilt: 1.0, ride: rideP, rideQ: turnP });
  leaveInWorld(V, [pic], { h, ta: TRP, T: TRPD, b: rideP0(TRP) });    // (its turn stays float3d's live share, turnP)
  // the picture keeps one depth (DP, 3) all the way: nearer than the sphere (11.45) and than anything of the set under it
  // (the hill's near slope comes to ~3.7), so the page, which draws the copy over the 3D scene, is right in depth too. There
  // is no cut-out: the sphere is behind the picture from every camera angle (user, 2026-09-29: "can we have it so the sphere
  // passes behind the image?").
};
