/* Copy · frame 3 (8.0 → 13.2 s): AND, OF COURSE, / ENHERTU IS ALWAYS swipe in (v1's clip swipe), and the PTP campaign art
   in its holding frame (v1's placeholder picture, assets/copy/ptp-inset.jpg; its PUSHING THE PARADIGM is part of the art).
   · Two layers: the lines on a card well in front of the sphere (three quarters of its depth), the picture on a card just
     in front of the set's front shapes (1 unit behind the sphere), so the camera's truck into hold 3 and its drift out
     show them apart.
   · Everything builds as the camera lands on hold 3 (9.9 s): the lines at 9.35 / 9.55, the picture at 9.7 with v1's
     animation (scales up from 0.4 with a small overshoot, the logo ring glows in pulses). (Review, 2026-09-29: 0.5 s
     later than approved, in the same order and spacing, so they start only once frame 2's lines have been carried off
     the bottom, g1.js's G1.T.b2Off; frame 3 reads 3.0 s, approved 3.5, still the longest of the three.)
   · No exit (user, 2026-09-28 00:30: "I want to remove that punch forward of the graphic because it's awkward. When that
     graphic comes in and floats, just continue that float until the gradient transition, and I want to leave the text up
     there because we can use the gradient wipe as the transition"): the lines and the picture stay up, floating, until the
     L→R gradient wipe (12.7, the cut at 13.2, drawn over the copy layer) sweeps them away. Gone: the lines' fade (12.1),
     v1's logo pulse (the card swelling, the ring flaring), the push toward the camera and the art's gathering push-in.
     The ring's glow breathes once more instead of flaring, and is at rest when the wipe arrives.
   · Never still (user, 21:50): the camera drifts through board 3 without stopping, and both lines and the picture hover
     (c01's hover()), each in place at the key instant.
   · The tilt (user, 2026-09-29, question A3, g1.js): the camera tilts up between boards 2 and 3 and carries frame 2's
     lines off the bottom. The lines and the picture are laid out in hold 3's approved view and turned with the camera's
     tilt (c01's inTilt()), so they look exactly as approved (the tilt is complete by ~9.95, and from board 3's key
     instant they stay in the world).
   Every time is read from hold 3 (slow window 9.9–12.1, key 11.0) and the cut. */
import { line, hover, contentFor, inTilt } from './c01.js';
import { G1 } from '../groups/g1.js';
import { watchPic } from './content.js';

export default V => {
  const { copy, copyTL, holds } = V;
  const h3 = G1.base[3], CUT = V.CUTS.G2;                          // hold 3's approved view (the copy is laid out in it)
  const D = G1.T.b2Off - (h3.t0 - 1.05);                            // the build starts once frame 2's lines are gone (0.5 s later than approved)
  const TX = contentFor(V, 3);                                      // frame 3's words and picture (content/copy.json)
  const ed = (i, md) => { const r = TX.line('lines', i, md); return r.edited ? { ...r, maxR: 1450 } : undefined; };   // (an edit may run to the picture's right edge)
  const P = TX.pic('art', { src: 'assets/copy/ptp-inset.jpg', fit: 'cover' });
  // an edited picture covers (or fits in) the frame, centred or at its focus; the logo ring's glow belongs to the PTP art, so it's off
  const imgCss = P.edited ? `width:100%;height:100%;object-fit:${P.fit};object-position:${P.focus};display:block` : 'width:100%;height:100%;object-fit:cover;object-position:39.8% 50%;display:block';

  /* ---- AND, OF COURSE, / ENHERTU IS ALWAYS ---- */
  const card = inTilt(V, copy(3, { depth: h3.depth * 0.75 }), h3, h3.tk).show(h3.t0 - 1.5 + D, CUT);   // stays up: the wipe is the transition
  const l1 = line(V, card.el, 488.3, 161.8, 73.3, 'l', 'AND, OF COURSE,', { ls: 0.5, edit: ed(0, 'AND, OF COURSE,') });   // fitted to board 3 (v1: 490, 165, 80)
  const l2 = line(V, card.el, 487.8, 247.6, 71.5, 'b', 'ENHERTU IS ALWAYS', { wt: 700, ls: 1.7, edit: ed(1, '**ENHERTU IS ALWAYS**') });   // the board's bold is Bold, not ExtraBold (v1: 490, 250, 80)
  [[l1, h3.t0 - 1.05 + D], [l2, h3.t0 - 0.85 + D]].forEach(([s, t]) => copyTL.fromTo(s, { clipPath: 'inset(0% 100% 0% 0%)', x: -60 }, { clipPath: 'inset(0% 0% 0% 0%)', x: 0, duration: 0.7, ease: 'power3.out' }, t));
  hover(V, l1.parentElement, h3.tk, { seed: 5 }); hover(V, l2.parentElement, h3.tk, { seed: 6 });

  /* ---- the PTP picture: v1's #b-inset (its picture, glow and animations), laid on board 3's card: x 258–1450, y 312–912,
     r 80 (v1: 265–1450, 315–910, r 52), and the board's frame, orange down the sides and violet across the middle of the
     top and bottom (a horizontal gradient; v1 had it plain orange). The picture (a crop of the board's art) shows at 1:1
     as on the board, so the frame is 17–19 px (the board's band is 14–16, with its art running a few px under it) ---- */
  const pic = inTilt(V, copy(3, { depth: h3.depth + 1 }), h3, h3.tk).show(h3.t0 - 0.9 + D, CUT);
  pic.el.innerHTML = `<div style="position:absolute;left:0;top:0;width:1920px;height:1080px"><div class="img" style="position:absolute;left:258px;top:312px;width:1192px;height:600px;border:solid transparent;border-width:18.5px 17px 18.5px 19px;border-radius:80px;overflow:hidden;background:linear-gradient(#fff,#fff) padding-box,linear-gradient(90deg,#fb7418 0%,#f47324 4%,#c9524c 9%,#9d396f 15%,#74209a 22%,#6a1b9e 30%,#621aa4 50%,#5310b4 66%,#4d05b8 76%,#7c238d 82%,#a44269 89%,#e27030 97%,#e8722a 100%) border-box">
    <div style="position:absolute;inset:0;transform-origin:39.8% 49.4%"><img src="${P.src}" alt="" style="${imgCss}">
      <div style="position:absolute;left:39.8%;top:49.4%;width:340px;height:340px;margin:-170px 0 0 -170px;border-radius:50%;opacity:0;mix-blend-mode:screen;background:radial-gradient(circle, rgba(255,255,255,.95) 0, rgba(255,210,150,.6) 30%, rgba(255,122,0,0) 68%)"></div></div></div></div>`;
  // (the outer full-stage div is the hover's wrapper: the box's own transform is v1's scale-in and pulse)
  const wrap = pic.el.firstElementChild, box = wrap.firstElementChild, art = box.firstElementChild, glow = art.lastElementChild;
  watchPic(V, art.firstElementChild, P);
  if (P.edited) glow.style.display = 'none';
  hover(V, wrap, h3.tk, { seed: 7, amp: 0.8, origin: '854px 612px' });   // tilts about the picture's centre
  V.waitFor(art.firstElementChild.decode().catch(() => {}));          // the first render waits for the picture
  copyTL.fromTo(box, { scale: 0.4, autoAlpha: 0, transformOrigin: '50% 50%' }, { scale: 1, autoAlpha: 1, duration: 0.9, ease: 'back.out(1.3)' }, h3.t0 - 0.7 + D)
    // the logo ring glows in pulses (v1), breathing out again at the end (10.3 → 12.7; shifted 0.35 s) instead of flaring: at rest when
    // the wipe comes. (No push-in of the art, no pulse of the card, no push toward the camera: the picture just floats.)
    .fromTo(glow, { opacity: 0, scale: 1 }, { opacity: 0.9, scale: 1.2, duration: 0.6, ease: 'sine.inOut', repeat: 3, yoyo: true }, h3.t0 + 0.05 + Math.min(D, 0.35));   // (its last pulse ends as the wipe arrives)
};
