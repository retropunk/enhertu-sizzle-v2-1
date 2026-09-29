/* Copy · frame 16 (67.25 → 72.55 s): the holding shape BTD: ACTIVATED (top left) and the super JULY 2025 / FDA
   BREAKTHROUGH / GRANTED THERAPY / DESIGNATION / IN 1L HER2+ mBC (bottom left). v1's styles and moves (index.html,
   frame 16: the holding shape wipes open, its lines swipe in, then the super's lines swipe in one after another), placed
   in 3D in hold 16's view. Wording and line breaks are the BOARD's (five lines, with GRANTED; v1 set four lines without
   it). Every line is fitted to board 16's type (ink left, cap centre, ink width; c07.js's kit) and the holding shape is the
   shared one (596 × 300, c07.js's holdBg colours), centred on board 16's box (347, 203).
   3D: three layers in front of the set (the track and the sphere are at hold 16's depth D): the holding shape at D − 4.2,
   the super at D − 3. Frame 16's one Z moment: the four bold lines push forward out of the depth (a layer of their own,
   5 units back) as they swipe in.
   RE-TIMED FOR THE BOUNCE (2026-09-28; g4.js's bounce16 and cam16, as fixed after the reviews). The user, on the
   rollercoaster build: "remove that scoop/cup and make the cup into an arch to match the other sections so the sphere
   simply bounces across". The sphere now drops in from above onto the band's left end (67.59), bounces up and over
   (apex ~68.47) onto the first arch (68.97), which springs it up and over onto the tall "i" arch's crown (the key, 70.2:
   the dot on the "i"), then on to the last arch (71.22) and down onto frame 17's first disc (72.95). The camera rides
   low and angled out of the wipe, swings round to board 16's frontal view (pulling back and turning; the lens 46° → 26°,
   peak ~21 u/s at ~69.0), passes board 16's pose at the key instant (~3.2 u/s; slow window 69.85–70.75), then chases
   the sphere. Measured (dev: a render with the copy against one without it, the difference being the copy's pixels;
   and the rects probe):
   · until ~68.8 the copy's place in the world is mostly above the frame (the camera looks low along the track); from
     ~69.5 to the key it sits within ~80 px of its board place (the camera arrives square on);
   · on its way down onto the first arch (68.3–68.9) the sphere, big (~160–200 px across), passes right down the holding
     shape's right edge: at key − 1.7 the holding shape wiped open straight into it and, the copy being drawn over the
     set, sliced up to ~12 px off the sphere's left side (review, 2026-09-28, at 68.70–68.80 on the first bounce build).
   So nothing is shown during the ride and the first bounce, and the copy builds as the sphere lands on the first arch:
   · the holding shape wipes open at key − 1.3 (68.9), just behind the sphere, its lines 0.2 s later (69.1);
   · the super's lines swipe in from key − 1.3 (68.9), 0.08 s apart, top to bottom, while the sphere bounces off the
     first arch, to their right;
   · no copy pixel touches the sphere at any moment of the copy's life (every 1/60 s over 68.8–71.95): the closest pass
     is ~220 px of clear air at ~69.12, as it springs off the first arch. All readable by ~69.67, and whole through the
     slow window.
   READING TIME (2026-09-29; the user: "add about ½ second where it's under ~1.3 s (e.g. 24, 25), borrowing time from the
   travel between frames so the piece stays 2:27"). The build is tighter (the super's lines 0.08 s apart, were 0.12; the
   holding shape's lines at + 0.2, were + 0.3), so everything reads ~0.16 s sooner, and g4.js's chase now keeps the camera
   at about its pass speed to ~70.8 before it speeds up, so the copy holds its place ~0.3 s longer. Measured (the
   reading-time probe): all seven lines readable together 69.67–71.13, 1.47 s (was 69.83–70.80, 0.97 s). The sphere's
   clearance from the copy is unchanged (re-measured every 1/60 s over 68.8–72.2, before and after, the same closest pass).
   Ride (c25.js's rideCam, plus a facing blend of our own): on the way in the copy's PLACE rides 90 % of the camera's move
   while its place in the world is still off the frame (as c10/c11 do), easing to 45 % by key − 0.5 as the world place
   comes into frame; its FACING stays board 16's (it does not turn with the camera) until key − 0.9, so the swinging camera
   sees the holding shape and the lines in perspective, turning flat as it comes round (like the set's own shapes).
   Across the key instant the place ride rises to 80 % (rideBeta's blend), and after it the lag behind the world is
   capped (rideCam's cap, as c17): as the chase speeds up the copy stops lagging and moves with the set, never faster.
   No exit (user, 2026-09-28 00:30: "it's not necessary for the text, the text panel, or the images to alpha out or move
   away because the camera or the gradient left-to-right transition hides them"). No fade, no push-out: everything is
   whole on screen from ~69.67 to ~71.1 (measured), then the chase carries it all off the left edge, whole (the last of
   it leaves at ~71.85; it never comes back, probed to 72.4). The capped lag lets the last line (… mBC) drift onto the
   first hump's shoulder as the camera pushes in (white on orange, still readable; a lower cap, 100–170 px, cropped the
   super's left edge inside the slow window). Its life ends at key + 2.0 (72.2; was + 1.7, before the slower chase),
   off screen, so it can't show through frame 17's world later (the copy is drawn over the sets; frame 17's copy starts
   at ~72.8). */
import { liveFill, kit, holdBg, contentFor, grow } from './c07.js';
import { tag } from './g4lib.js';
import { rideCam } from './c25.js';                             // (the capped ride; G6's helper file)

const sm = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };

export default V => {
  const { holds, copyTL, anim, THREE } = V;
  const h = holds[16];
  if (!h) throw new Error('c16: frame 16 needs a hold');
  const K = kit(V), TX = contentFor(V, 16);                          // (TX: frame 16's words from content/copy.json)
  const tk = h.tk;
  const D = h.depth - 3, DB = D - 1.2;                               // the super / the holding shape (nearer)

  /* --- the holding shape (v1's #hold-btd), on board 16's box --- */
  const BOX = [347, 203], BW = 596, BH = 300, PW = 660, PH = 360;
  const badge = K.layer(16, [BOX[0] - PW / 2, BOX[1] - PH / 2, PW, PH], DB);
  const panel = document.createElement('div'); panel.className = 'hold box';
  panel.style.cssText = `left:${(PW - BW) / 2}px;top:${(PH - BH) / 2}px;width:${BW}px;height:${BH}px;background:${holdBg(0)}`;
  badge.el.appendChild(panel);
  const hBtd = [K.line(badge, TX.spec('panel', 0, { text: 'BTD:', w: 'l', L: 132, cy: 153, W: 166 })),
    K.line(badge, TX.spec('panel', 1, { text: 'ACTIVATED', w: 'b', L: 125, cy: 249.5, W: 457 }))];
  grow(K.ready, { el: panel, box: [BOX[0] - BW / 2, BOX[1] - BH / 2, BW, BH], lines: hBtd, refit: K.refit });

  /* --- the super (v1's #t16): the date line, and the four bold lines as their own layer (the Z moment) --- */
  const date = K.layer(16, [30, 390, 340, 70], D);
  const block = K.layer(16, [30, 455, 760, 290], D);
  const l16 = [K.line(date, TX.spec('lines', 0, { text: 'JULY 2025', w: 'l', L: 63, cy: 422.5, W: 268 }, undefined, { maxR: 790 })),   // (an edited date may run as wide as the block)
    K.line(block, TX.spec('lines', 1, { text: 'FDA BREAKTHROUGH', w: 'b', L: 65, cy: 489.5, W: 673 })),
    K.line(block, TX.spec('lines', 2, { text: 'GRANTED THERAPY', w: 'b', L: 63, cy: 563.5, W: 618 })),
    K.line(block, TX.spec('lines', 3, { text: 'DESIGNATION', w: 'b', L: 65, cy: 637.5, W: 434 })),
    K.line(block, TX.spec('lines', 4, { text: 'IN 1L HER2+ mBC', w: 'b', L: 65, cy: 712, W: 524 }))];

  /* --- timing, from the key instant (see the header) --- */
  const TB = tk - 1.3, TS = tk - 1.3;                               // (the holding shape was − 1.7: it wiped into the lobbing sphere)
  gsap.set(panel, { autoAlpha: 0 });
  copyTL.set(panel, { autoAlpha: 1 }, TB)                            // v1's holdIn (a set, so it survives seeking)
    .fromTo(panel, { clipPath: 'inset(0% 100% 0% 0% round 70px)' }, { clipPath: 'inset(0% 0% 0% 0% round 70px)', duration: 0.7, ease: 'expo.out', immediateRender: false }, TB);
  K.swipe(hBtd, TB + 0.2, 0.1);                                     // (reading time: + 0.2, was + 0.3)
  K.swipe(l16, TS, 0.08);                                           // (reading time: 0.08 apart, was 0.12)
  gsap.set(block, { dz: 5 });
  copyTL.fromTo(block, { dz: 5 }, { dz: 0, duration: 1.1, ease: 'power3.out', immediateRender: false }, TS + 0.1);   // out of the depth

  // living fill on the holding shape, board 16's at the key instant
  anim(t => { panel.style.background = holdBg(liveFill(t, tk, 5, 9)); });

  /* --- the ride: place (rideCam, capped after the key) and facing (ours, before the key) --- */
  const all = [badge, date, block];
  const bIn = t => 0.9 - 0.45 * sm((t - (tk - 1.1)) / 0.6);          // 0.9 while the world place is beside the lens → 0.45
  const bPos = t => { const a = bIn(t); return a + (0.8 - a) * sm((t - tk + 0.3) / 0.6); };   // → 0.8 across the key
  const MH = rideCam(V, all, h, bPos, 250);
  {                                                                   // the facing: board 16's until key − 0.9, then joins the ride
    const cq = new THREE.Quaternion(), bTurn = t => bPos(t) * sm((t - (tk - 0.9)) / 0.9);
    let now = 0;
    anim(t => { now = t; });
    const prev = V.scene.onBeforeRender;
    V.scene.onBeforeRender = function (r, sc, cam, ...rest) {
      if (prev) prev.call(this, r, sc, cam, ...rest);                 // (rideCam's hook has posed MH for this moment)
      if (now >= tk) return;                                          // (after the key: rideCam's own, capped)
      cam.getWorldQuaternion(cq);
      MH.q.copy(h.q).slerp(cq, bTurn(now));
      MH.fwd.set(0, 0, -1).applyQuaternion(MH.q);
    };
  }

  /* --- no exit: the chase carries it off the left edge; its life ends once it is off screen --- */
  const X = tk + 2.0;                                                // (was + 1.7: the slower chase carries it off later)
  all.forEach(o => o.show(TB - 0.05, X));
  tag(16, all);
};
