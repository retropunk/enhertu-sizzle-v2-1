/* Copy · frame 22: MAY 2026 / eBC LAUNCH / MODE: / ACTIVATED (top left) and the eBC "Early Edition" picture on the TV
   screen (v1's placeholder, assets/copy/ebc-early-edition.jpg). The sphere drops in from the top between the rails and
   passes BEHIND the screen: the copy layer draws over the 3D, so the picture hides the sphere wherever it covers it.
   v1 (index.html, frame 22): the screen scales up (0.85 → 1, 0.6 s back.out) at f22 + 0.05, "up before the sphere drops
   behind it", and pushes slowly into its art (1.02 → 1.08 over 5 s); the lines swipe in (v1's clip swipe, 0.18 s apart) at
   f22 + 0.7; everything fades (0.4 s) at f23 − 0.6.
   · The picture sits in board 22's frame: 1004 × 578 at 548, 238 (outer edge, r 98), a 12–15 px border wearing the
     boards' frame gradient (c07.js's HOLD_FRAME: orange down the sides, violet across the middle of the top and bottom,
     as board 22 draws it), the art at the board's scale (979 × 548 from 561, 256; fitted to the board, mean error 4/255).
   · The lines are fitted to board 22's lettering (ink left, cap centre, ink width and cap height; Light, ACTIVATED
     ExtraBold) with c07.js's kit.
   · Timing, all from hold 22, an ease-through (the NEW RULE: the camera never stops; it cranes down the wall after the
    sphere, slows to ~4 u/s through the key instant tk easing back, down and a little right as the sphere falls behind the
    screen, then speeds up trucking right along the band): the picture builds from slow window start − 0.45 as the crane
    slows, so it is whole (full size, opaque) by the key instant, before the sphere reaches its top edge. The lines swipe
    in with the crane, from slow window start − 0.55 (0.08 apart), so they are all in by the key instant (it comes only
    0.25 s after the window starts). The art rests at the board's scale until the key instant, then pushes in slowly
    (v1's move) until it leaves.
  · 3D: the picture stands in the world in front of the sphere's drop (1.5 units nearer than the sphere at the hold,
    exactly on the set's TV screen, g5/f22.js, which is why it never hovers: it must stay on the screen), the lines a
    little further forward (3 units in front of the sphere), so the crane down and the truck right show them apart.
    Frame 22's one depth moment is "lines in layers": ACTIVATED, the payoff, is its own layer 5 units nearer still, so it
    rises into place faster than the lines above it as the camera cranes down onto the board (it sits exactly on the
    board at the key instant; no tween in depth, which would still be settling at the early key instant).
    The lines HOVER a little (c21.js's hover(): 40% of the camera's motion on the way in, 35% after the key instant,
    the lag capped at 250 px), so through the slow window they drift gently (≤ ~130 px/s).
  · NO EXIT (the COPY RULE, user 2026-09-28 00:30: the copy doesn't "alpha out or move away because the camera … hides
    them"; the last pass faded the lines at the slow window's end and the picture at window end + 1.05): both stay in
    the world and the truck right along the band carries them off. The lines (their lag capped, so they move with the
    set, never faster) go over the top left: whole to ~101.4, gone by ~102.5, before the dark pill under them slides away
    (102.6). The picture stays on the TV (it never hovers) and rides off the left edge with the set: gone by ~103.9. The
    set's slab powers off (shrinks, f22.js) at 103.35–103.85 while the last quarter of the picture is still in view, but
    the picture covers the slab entirely, so that shrink is not seen. v1's slow push into the art runs from the key
    instant until the picture leaves. The layers exist until the slow window's end + 1.6 s (lines) and + 2.9 s (picture).
   Timed from the holds, so a retimed hold carries the copy. */
import { kit, HOLD_FRAME, contentFor, watchPic, picCss } from './c07.js';
import { hover, hoverBeta } from './c21.js';

export default V => {
  const { holds, copyTL } = V;
  const h = holds[22];
  if (!h) throw new Error('c22: frame 22 needs a hold');
  const K = kit(V), TX = contentFor(V, 22);                          // (TX: frame 22's words and picture from content/copy.json)
  V.waitFor(Promise.all([document.fonts.load('800 100px "new-hero"'), document.fonts.load('300 100px "new-hero"')]));
  const DS = Math.max(6, h.depth - 1.5), DL = Math.max(5, h.depth - 3);   // the screen (in front of the sphere's drop), the lines

  /* ---- the screen: the eBC picture in board 22's frame ---- */
  const FR = { x: 548, y: 238, w: 1004, h: 578 };
  const scr = document.createElement('div');
  scr.style.cssText = `width:${FR.w}px;height:${FR.h}px`;
  const P = TX.pic('screen', { src: 'assets/copy/ebc-early-edition.jpg', fit: 'cover' });
  scr.innerHTML = `<div class="img" style="position:absolute;left:0;top:0;width:${FR.w}px;height:${FR.h}px;border:solid transparent;border-width:15px 14px 12px 14px;border-radius:98px;overflow:hidden;background:linear-gradient(#fff,#fff) padding-box,${HOLD_FRAME}">
    <img src="${P.src}" alt="" style="${P.edited ? picCss(P, 'transform-origin:50% 50%') : 'position:absolute;left:-1px;top:3px;width:979px;height:548px;display:block;transform-origin:50% 50%'}"></div>`;
  const pic = V.copyLayer(22, scr, { at: [FR.x + FR.w / 2, FR.y + FR.h / 2], depth: DS });
  const box = scr.firstElementChild, art = box.firstElementChild;
  watchPic(V, art, P);
  V.waitFor(art.decode().catch(() => {}));                           // the first render waits for the picture

  /* ---- the lines (board 22, measured at 1920 px: ink left L, cap centre cy, ink width W, cap height H) ---- */
  const blk = K.layer(22, [50, 85, 520, 230], DL);                    // MAY 2026 / eBC LAUNCH / MODE:
  const act = K.layer(22, [50, 300, 480, 90], Math.max(4, DL - 5));   // ACTIVATED (its own, nearer layer: lines in layers)
  const A = { maxR: 520 };                                            // (an edited line stays clear of the screen)
  const lines = [
    K.line(blk, TX.spec('lines', 0, { text: 'MAY 2026', w: 'l', L: 90, cy: 124, W: 266, H: 39 }, undefined, A)),
    K.line(blk, TX.spec('lines', 1, { text: 'eBC LAUNCH', w: 'l', L: 90, cy: 193.5, W: 410, H: 48 }, undefined, A)),
    K.line(blk, TX.spec('lines', 2, { text: 'MODE:', w: 'l', L: 90, cy: 266, W: 214, H: 47 }, undefined, A)),
    K.line(act, TX.spec('lines', 3, { text: 'ACTIVATED', w: 'b', L: 88, cy: 339.5, W: 376, H: 48 }, undefined, A)),
  ];

  /* ---- timing ---- */
  const TP = Math.min(h.t0 - 0.45, h.tk - 0.7);                       // the screen: whole before the sphere reaches it
  const TL = Math.min(h.t0 - 0.55, h.tk - 0.8);                       // the lines, with the crane: all in by the key instant
  // no exit (COPY RULE): the truck right carries them off, the lines by ~102.5 and the picture (on the TV) by ~103.9
  const EP = h.t1 + 2.9, EL = h.t1 + 1.6;                            // the layers' ends (out of view by then)
  gsap.set(box, { autoAlpha: 0, scale: 0.85, transformOrigin: '50% 50%' });
  copyTL.fromTo(box, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power2.out', immediateRender: false }, TP)
    .fromTo(box, { scale: 0.85 }, { scale: 1, duration: 0.6, ease: 'back.out(1.3)', immediateRender: false }, TP)
    // v1's slow push into the art, from the key instant (the board's picture until then) until it leaves
    .fromTo(art, { scale: 1 }, { scale: 1.05, duration: Math.max(0.5, EP - h.tk), ease: 'none', immediateRender: false }, h.tk);
  K.swipe(lines, TL, 0.08);
  pic.show(TP - 0.05, EP);
  const SL = [TL - 0.05, EL];
  [blk, act].forEach(o => o.show(...SL));
  hover(V, [blk, act], h, hoverBeta(h.tk, 0.4, 0.35), SL, 250);     // the lines hover a little (not the picture: it is on the TV)
};
