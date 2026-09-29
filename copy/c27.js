/* Copy · frame 27 (121.15 → 125.95 s): AND THERE’S STILL SO MUCH MORE / TO PUSH FOR, and the tail art (v1's placeholder
   picture of the ENHERTU arrow in its ring, which is the logo board 27 shows) in its frame below them. v1's wording,
   weights and entrances (the lines swipe in 0.3 s apart; the picture pops in, scale 0.85 → 1 with a small overshoot, and
   the art pushes slowly in; v1's fades out are gone: the camera carries the copy off), fitted to board 27 (measured at
   1920 px) and placed in 3D in hold 27's view.
   · Lines: AND THERE’S STILL SO MUCH MORE is Light, cap height 45 px, from x 111; TO PUSH FOR ExtraBold, cap height
     98 px, from x 467 (sizes from the cap heights, tracking from the ink widths).
   · The picture sits on board 27's frame: 947 × 475 at 467.5, 542, corner radius 89, a 13.5 px frame that is orange down
     the sides and violet across the middle of the top and bottom (c07.js's HOLD_FRAME, the boards' shared frame). v1's
     art (assets/copy/tail-art.jpg, 913 × 407) registers on the board's picture at 1:1, but the board's frame shows a little
     more art above and below, so it is shown 1.105× about the opening's centre (v1 itself ran it 1.02 → 1.1): it just
     covers the opening, and the ring, near the centre, moves ~2–7 px.
   · 3D: three layers floating near the lens, well in front of the set (the sphere's plane is 36.8 from camera 27), each
     at its own depth so they part a little as the camera passes them (layered parallax, a depth cue): the first line
     5.75 units from camera 27, TO PUSH FOR 7, the picture 7.5 (each is sized for its depth, so at the key it is exactly
     on the board; until 2026-09-29 they sat 3 units in front of the sphere, where no gentle camera move could separate
     them from the set; then 4.7 / 5.5 / 6, moved back the same day, see "No exit"). Frame 27's depth moment: TO PUSH FOR
     pushes forward out of the depth as it swipes in (the push the line is about; its start distance is scaled with the
     layer, so it looks as before). Frame 27 is an ease-through (hold 123.85–125.2, key 124.5): the crane up from 25
     slows into a truck left and passes board 27's pose at ~1.5 u/s. Up to the key the layers ride 91 % of the camera's
     movement (c25's rideCam), the same hover as before (the old half-ride at 33.8 units: ~32 px per unit of camera
     travel), so the build isn't dragged in across the frame edge by the crane and the copy doesn't sweep while it's
     read; exactly on the board at the key.
   · Timing, anchored on the key instant (the sphere lands in the window then): the first line swipes in at key − 1.4, as
     the crane slows (the sphere is still off the top of the frame, about to drop back down the lane), TO PUSH FOR 0.3 s
     later, the picture pops in 0.45 s after the first line; all in by ~key − 0.4. The art is at rest (the board's picture)
     until the pop has settled and the key is near (key − 0.25), then pushes gently in toward the ring, gathering pace
     until it has left the frame.
   · No exit (user, 2026-09-29, question A3: the camera carries it off; COPY RULE, 2026-09-28 00:30: "it's not necessary
     for the text, the text panel, or the images to alpha out or move away because the camera or the gradient
     left-to-right transition hides them"). After the key the ride's lag behind the world is capped (rideCam's cap,
     475 px): the copy stays near its board place through the slow window (~50 px of drift by 125.0, ~95 by 125.2) and
     then moves with the world, whole, at its own depth's parallax (~90 % of it at the truck's peak; with the old 700 px
     cap it was still catching up there, ~70 %, slower than its depth implies, which read as a slide). g6.js's truck left
     after the slow window (slow to ~125.1, then ~5.6 u/s at ~125.8, easing into 28) carries it off to the right, passing
     in front of the sphere. Review, 2026-09-29 (it must read as the camera passing the words, not a slide-off): the truck
     is now held level and facing ahead (g6.js's level28: no rise, no tilt-up, no back-off), so the words cross the frame
     level (their centres stay within ~25 px of their height; they used to sink 85–160 px, a diagonal swipe) and at full
     size (they used to shrink 12–15 % as the camera backed off), while the set behind travels with the camera (~5 %
     faster than before). Probed (display s): out of the frame by ~126.37 (the first line and TO PUSH FOR) and ~126.52
     (the picture); peak speeds ~2130 / 1710 / 1590 px/s (were ~1940 / 1640 / 1510), ~4.5–5.7× the set's. That ratio is
     the geometry: the truck is only ~7 u, ~37 u from the set, so anything it carries out of the frame must sit this near
     the lens (modelled: farther layers leave too late, over 28's words or crawling along the right edge). Frame 28's copy reveals in its wake from ~125.75 (c28.js, 2026-09-29, question A2: more reading time
     for 28): its light lines open from their right ends as these words leave them behind, its bold block from its left
     edge once these are on the right third; the two never overlap (≥ ~19 px apart, viewed at 0.05 s steps). The layers
     are dropped at 28's key instant − 0.35 (126.75), once they are out, so they can't come back. No fade, no slide of
     their own. Reading time (all the words built and still, ≤ 350 px/s; probed): 1.37 s, 123.87–125.23 (1.40 s with the
     700 px cap; 1.33 s before 2026-09-29, ended by the fade). */
import { kit, HOLD_FRAME, contentFor, watchPic, picCss } from './c07.js';
import { rideCam } from './c25.js';

// 3D: the three layers float near the lens (distance from camera 27 at the key instant), nearest first, so the truck left
// after the slow window carries them off to the right by parallax (see the header). At the key each is exactly on the
// board whatever its distance (a layer is sized for its depth)
const NEAR = { top: 5.75, push: 7.0, pic: 7.5 };
const RIDE = 0.91;                                                   // how much of the camera's movement the copy rides (up to the key)
const CAP = 475;                                                     // after the key: its lag behind its place in the world, capped (px)
const ART = { w: 913, h: 407, s: 1.105 };                            // v1's tail art and its scale in the frame's opening

export default V => {
  const { holds, copyTL } = V;
  const h = holds[27];
  if (!h) throw new Error('c27: frame 27 needs a hold');
  const K = kit(V), TX = contentFor(V, 27);                          // (TX: frame 27's words and picture from content/copy.json)

  // the lines: each on its own layer (so TO PUSH FOR can push in depth). Each mask wears its text's weight, so its strut
  // is the same face as its text and the line sits exactly on its fitted place (with the page's default weight a big
  // bold line sits ~2 px low)
  const top = K.layer(27, [80, 280, 1140, 110], NEAR.top);
  const push = K.layer(27, [440, 370, 960, 160], NEAR.push);
  const l1 = K.line(top, TX.spec('lines', 0, { text: 'AND THERE’S STILL SO MUCH MORE', w: 'l', L: 111, W: 1079, cy: 332.5, H: 44 }));
  const l2 = K.line(push, TX.spec('lines', 1, { text: 'TO PUSH FOR', w: 'b', L: 467, W: 908, cy: 447, H: 98 }));
  l1.parentElement.style.fontWeight = 300; l2.parentElement.style.fontWeight = 800;

  // the picture (v1's #tail27) on board 27's frame: the opening is 920 × 448 from (481, 555.5); the art covers it, centred
  const PB = [447, 523, 987, 512];                                   // the layer's box (stage px), with room for the pop's overshoot
  const pic = K.layer(27, PB, NEAR.pic);
  const aw = ART.w * ART.s, ah = ART.h * ART.s;
  const P = TX.pic('art', { src: 'assets/copy/tail-art.jpg', fit: 'cover' });
  pic.el.innerHTML = `<div class="img" style="position:absolute;left:${467.5 - PB[0]}px;top:${542 - PB[1]}px;width:947px;height:475px;box-sizing:border-box;border:13.5px solid transparent;border-radius:89px;overflow:hidden;background:linear-gradient(#fff,#fff) padding-box,${HOLD_FRAME}">
    <img src="${P.src}" alt="" style="${P.edited ? picCss(P, 'transform-origin:50% 50%') : `position:absolute;left:${((920 - aw) / 2).toFixed(2)}px;top:${((448 - ah) / 2).toFixed(2)}px;width:${aw.toFixed(2)}px;height:${ah.toFixed(2)}px;display:block;transform-origin:50.7% 49.4%`}"></div>`;
  const frame = pic.el.firstElementChild, art = frame.firstElementChild;
  watchPic(V, art, P);
  V.waitFor(art.decode().catch(() => {}));                          // the first render waits for the picture
  // the hover up to the key, then the capped lag: it stays through the slow window and the truck carries it off, whole
  rideCam(V, [top, push, pic], h, RIDE, CAP);

  /* --- timing, from the key instant (v1: lines at f27 + 0.5 and + 0.8, the picture at + 1.1) --- */
  const T = h.tk - 1.4;
  const TA = Math.max(h.tk - 0.25, T + 0.45 + 0.7);                  // the art's push: once the pop has settled
  // no exit (user, 2026-09-28 00:30 and 2026-09-29 A3): the layers are dropped only once the truck has carried them out
  // of the frame (probed; before frame 28's key instant)
  const h28 = holds[28], OUT = h28 ? h28.tk - 0.35 : h.t1 + 1.5;
  K.swipe([l1], T);
  K.swipe([l2], T + 0.3);
  // TO PUSH FOR comes forward out of the depth (the same look as before: it starts as far again behind as 10 units were
  // behind the old 33.8)
  copyTL.fromTo(push, { dz: 10 * NEAR.push / (h.depth - 3) }, { dz: 0, duration: 1.0, ease: 'power3.out', immediateRender: false }, T + 0.3);
  gsap.set(frame, { autoAlpha: 0, scale: 0.85, transformOrigin: '50% 50%' });
  copyTL.fromTo(frame, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'back.out(1.2)', immediateRender: false }, T + 0.45)
    // v1's slow push into the art (1.02 → 1.1): here from rest, gathering pace until it has left the frame
    .fromTo(art, { scale: 1 }, { scale: 1.07, duration: OUT - TA, ease: 'sine.in', immediateRender: false }, TA);
  [top, push, pic].forEach(o => o.show(T - 0.1, OUT));
};
