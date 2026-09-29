/* Copy · frame 17 (72.55 → 77.95 s): the holding shape NPP MODE: ACTIVATED (top right), the orange card with AUGUST
   2025 / A DIGITAL REDESIGN / TAKES SHAPE, and the web-redesign picture in its frame below (v1's placeholder,
   assets/copy/web-redesign.jpg). v1's styles and moves (index.html, frame 17: the holding shape wipes open and its lines
   swipe in; the card grows in from its left edge with a small overshoot and its lines swipe in; the picture rises in with a
   small overshoot and slowly pushes in), placed in 3D in hold 17's view.
   Fitted to board 17:
   · the lines (ink left, cap centre, ink width; c07.js's kit); the holding shape is the shared one (596 × 300, c07.js's
     holdBg colours), centred on board 17's box (1556, 195);
   · the card: left 668.5, top 243.5, right 1556, round top corners r 230 (v1: 700, 252, 1300 wide off the right edge); it
     ends at 643.5, hidden by the picture. Its colours: a 90° ramp orange → pink under a violet pool low in the middle
     (mean error 3 on 0–255), flowing, locked to the board at the key instant. Board 17's magenta circle (a set shape, lower
     right) sits in front of the card's right end, so the card is masked there, by the disc's outline as the camera sees
     it (see the end of the file);
   · the picture: frame 598–1857 × 567–1016, r 45, an 11.5 px frame that is the holding shape's (orange down the sides,
     violet across the middle of the top and bottom), with the screenshot at the board's scale (0.995) and place.
   Timing, all read from hold 17. Hold 17 is an ease-through: the camera cranes down onto board 17's view, slowing from
   ~12 u/s (the slow window's start − 0.75) through 7.5 (its start) to 2.65 at the key instant, then speeds up again down
   after the ricochets (~5 u/s at the window's end, turning ~9°/s). The copy builds as the camera slows, in v1's order and
   rhythm (v1: holding shape f17 + 0.3, its lines + 0.6, card + 0.9, its lines + 1.2, picture + 1.9; here from the slow
   window's start − 0.75, once frame 17's world is in):
   · the holding shape wipes open at − 0.75, its lines 0.15 later;
   · the card grows at − 0.55 and its lines swipe in from − 0.35, 0.08 apart; the picture rises at − 0.05. All in by the
     key instant.
   3D: layers in front of the discs (hold 17's depth D): the holding shape D − 4.2, the picture D − 3.6, the card's lines
   D − 3, the card D − 2.4 (so the holding shape and the picture overlap the card as on the board). Frame 17's one Z moment:
   the card's lines settle onto the card from the camera side as they swipe in.
   Hovering: on the way in the copy rides half of the camera's move (c25.js's rideCam), so the landing still slides and
   turns it into place in perspective; across the key instant the ride rises to 85 %, so it keeps its place through the
   slow window, and after the key its lag behind its place in the world is capped at 250 px (rideCam's cap, as c21.js's
   hover): as the crane speeds up the copy stops lagging further and moves with the discs, at their own speed and
   parallax, never faster (review, 2026-09-28: handing it straight back to the world at the key cropped the badge
   from ~0.65 s before the slow window's end).
   No exit (user, 2026-09-28 00:30: "it's not necessary for the text, the text panel, or the images to alpha out or move
   away because the camera … hides them"). No fade: whole until ~the slow window's end (the badge − 0.25, the card
   + 0.15), then the crane down after the ricochets carries it all up off the top edge, the picture with the magenta disc
   and the lilac bar behind it (out of frame by + 1.1, ~1.6 s before frame 18's copy starts). Its life ends just after
   that (+ 1.2), off screen, so it can't show through the later sets (the copy is drawn over them). */
import { flowFill, liveFill, kit, holdBg, HOLD_FRAME, contentFor, grow, watchPic, picCss } from './c07.js';
import { rideBeta, tag } from './g4lib.js';
import { rideCam } from './c25.js';                             // (the capped ride; G6's helper file)

const stops = (S, d = 0) => S.map(([p, c]) => `${c} ${(p + d).toFixed(2)}%`).join(',');
// board 17's card: the ramp (90°, stops in % of the card's width) and the violet pool (rgb 55 4 255, an ellipse 519 × 416
// centred at 569, 448 in the card, fading as (1 − r)^1.675)
const RAMP = [[13.17, '#fd8701'], [23.9, '#ff8c00'], [34.62, '#fb7a26'], [45.35, '#f16c55'], [56.08, '#eb6574'], [66.8, '#ef6287'], [77.53, '#fa5480'], [88.26, '#f34884'], [98.98, '#e94490']];
const POOL = [[0, 1], [25, 0.618], [50, 0.313], [75, 0.098], [100, 0]].map(([p, a]) => `rgba(55,4,255,${a}) ${p}%`).join(',');
const cardBg = (d, dx, dy) => `radial-gradient(518.75px 415.63px at ${(569 + dx).toFixed(1)}px ${(447.75 + dy).toFixed(1)}px,${POOL}),linear-gradient(90deg,${stops(RAMP, d)})`;

export default V => {
  const { holds, copyTL, anim } = V;
  const h = holds[17];
  if (!h) throw new Error('c17: frame 17 needs a hold');
  const K = kit(V), TX = contentFor(V, 17);                          // (TX: frame 17's words and picture from content/copy.json)
  const D = h.depth - 3;

  /* --- the holding shape (v1's #hold-npp), on board 17's box --- */
  const BOX = [1556, 195], BW = 596, BH = 300, PW = 660, PH = 360;
  const badge = K.layer(17, [BOX[0] - PW / 2, BOX[1] - PH / 2, PW, PH], D - 1.2);
  const panel = document.createElement('div'); panel.className = 'hold box';
  panel.style.cssText = `left:${(PW - BW) / 2}px;top:${(PH - BH) / 2}px;width:${BW}px;height:${BH}px;background:${holdBg(0)}`;
  badge.el.appendChild(panel);
  const hNpp = [K.line(badge, TX.spec('panel', 0, { text: 'NPP MODE:', w: 'l', L: 1326, cy: 145, W: 441 })),
    K.line(badge, TX.spec('panel', 1, { text: 'ACTIVATED', w: 'b', L: 1320, cy: 241.5, W: 454 }))];
  grow(K.ready, { el: panel, box: [BOX[0] - BW / 2, BOX[1] - BH / 2, BW, BH], lines: hNpp, limit: [1180, 1880], refit: K.refit });   // (it may grow left only a little: the card's first line is under it)

  /* --- the card (v1's #c17) and its lines, a layer in front of it --- */
  const cBox = [668.5, 243.5, 887.5, 400];                         // (ends at 643.5, under the picture: its violet pool's heart stays hidden while the picture rises)
  const card = K.layer(17, cBox, D + 0.6);
  const cardEl = document.createElement('div'); cardEl.className = 'card box';
  const hole = 'radial-gradient(circle 311px at 1064.1px 500.6px,transparent 310px,#000 311.5px)';   // board 17's magenta circle
  cardEl.style.cssText = `left:0;top:0;width:${cBox[2]}px;height:${cBox[3]}px;border-radius:230px 230px 40px 40px;background:${cardBg(0, 0, 0)};-webkit-mask-image:${hole};mask-image:${hole}`;
  card.el.appendChild(cardEl);
  const cardTx = K.layer(17, [760, 310, 740, 230], D);
  const l17 = [K.line(cardTx, TX.spec('card', 0, { text: 'AUGUST 2025', w: 'l', L: 789, cy: 350, W: 363 }, undefined, { maxR: 1160 })),   // (clear of the holding shape above it)
    K.line(cardTx, TX.spec('card', 1, { text: 'A DIGITAL REDESIGN', w: 'b', L: 787, cy: 420, W: 677 })),
    K.line(cardTx, TX.spec('card', 2, { text: 'TAKES SHAPE', w: 'b', L: 787, cy: 492, W: 453 }))];
  grow(K.ready, { el: cardEl, box: cBox, lines: l17, side: 'right', margin: 90, refit: K.refit });   // (the card's text sits in its round top: an inset like the left one)

  /* --- the picture (v1's #web17), in the holding shape's frame --- */
  const pBox = [598, 567, 1259, 449], BWD = 11.5;
  const picL = K.layer(17, pBox, D - 0.6);
  const pic = document.createElement('div'); pic.className = 'img';
  pic.style.cssText = `position:absolute;left:0;top:0;width:${pBox[2]}px;height:${pBox[3]}px;border:${BWD}px solid transparent;border-radius:45px;overflow:hidden;box-shadow:0 12px 40px rgba(20,0,60,.35);` +
    `background:linear-gradient(100deg,#e8e0f8 0%,#ebe1f5 45%,#f8e6e0 80%,#fae8da 100%) padding-box,${HOLD_FRAME}`;
  const P = TX.pic('website', { src: 'assets/copy/web-redesign.jpg', fit: 'cover' });
  pic.innerHTML = P.edited ? `<div style="position:absolute;inset:0;transform-origin:50% 50%"><img src="${P.src}" alt="" style="${picCss(P)}"></div>`
    : `<div style="position:absolute;inset:0;transform-origin:50% 50%"><img src="assets/copy/web-redesign.jpg" alt="" style="position:absolute;left:${617 - 598 - BWD}px;top:${584 - 567 - BWD}px;width:1221px;height:408px;display:block"></div>`;
  picL.el.appendChild(pic);
  const art = pic.firstElementChild;
  watchPic(V, art.firstElementChild, P);
  V.waitFor(art.firstElementChild.decode().catch(() => {}));          // the first render waits for the picture

  /* --- timing, from the hold (v1's order and rhythm; see above) --- */
  const T = h.t0 - 0.75, X = h.t1 + 1.2;                            // X: the end of its life, off screen (no exit)
  gsap.set(panel, { autoAlpha: 0 });
  copyTL.set(panel, { autoAlpha: 1 }, T)                             // v1's holdIn (a set, so it survives seeking)
    .fromTo(panel, { clipPath: 'inset(0% 100% 0% 0% round 70px)' }, { clipPath: 'inset(0% 0% 0% 0% round 70px)', duration: 0.7, ease: 'expo.out', immediateRender: false }, T);
  K.swipe(hNpp, T + 0.15, 0.1);
  gsap.set(cardEl, { scale: 0.85, autoAlpha: 0, transformOrigin: '0% 50%' });
  copyTL.fromTo(cardEl, { scale: 0.85, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.8, ease: 'back.out(1.2)', immediateRender: false }, T + 0.2);
  K.swipe(l17, T + 0.4, 0.08, 0.6);
  gsap.set(cardTx, { dz: -1.6 });
  copyTL.fromTo(cardTx, { dz: -1.6 }, { dz: 0, duration: 0.9, ease: 'power3.out', immediateRender: false }, T + 0.4);   // settle onto the card
  gsap.set(pic, { autoAlpha: 0, y: 90 });
  copyTL.fromTo(pic, { autoAlpha: 0, y: 90 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'back.out(1.2)', immediateRender: false }, T + 0.7);
  // v1's slow push into the picture (1.02 → 1.08): here at rest (the board's picture) until just before the key instant,
  // then on until the crane has carried it out of frame
  copyTL.fromTo(art, { scale: 1 }, { scale: 1.05, duration: X - (h.tk - 0.2), ease: 'sine.in', immediateRender: false }, h.tk - 0.2);

  // living gradients, locked to board 17 at the key instant
  anim(t => {
    panel.style.background = holdBg(liveFill(t, h.tk, 5, 9));
    const k = flowFill(), w = 6.2832 * (t - h.tk) * k.s;
    cardEl.style.background = cardBg(k.a * 4 * Math.sin(w / 7), k.a * 35 * Math.sin(w / 9), k.a * 12 * Math.sin(w / 11));
  });

  /* --- hovering, then carried off with the set: no exit; the crane down takes it off the top edge (by + 1.1) --- */
  const all = [badge, card, cardTx, picL];
  rideCam(V, all, h, rideBeta(h.tk, 0.5, 0.85), 250);
  all.forEach(o => o.show(T - 0.05, X));
  tag(17, all);

  /* --- the card's cut-out follows board 17's magenta disc ---
     The disc is a set piece in the world (groups/g4/f17.js: centre 1732.6, 744.1, r 311, 45.5 from hold 17's camera); the
     card rides part of the camera's move and the disc doesn't, so a fixed cut-out would open a dark crescent between them
     while the camera moves. Each render the disc's outline is cast through the camera onto the card's plane (as g4lib's
     sphereFront does for the sphere) and the card wears it as its mask; at the key instant it is exactly the board's
     circle (the static mask above). The card's own grow (it scales about its left middle) is undone in the mask's px. */
  {
    const { THREE } = V, Vec = THREE.Vector3, DISC = { at: [1732.6, 744.1], r: 311, depth: 45.5 };
    const S0 = h.at(DISC.at[0], DISC.at[1], DISC.depth), rw = DISC.r * DISC.depth * h.tanV / 540;
    const SR = S0.clone().addScaledVector(h.right, rw), SU = S0.clone().addScaledVector(h.upv, rw);
    const C = new Vec(), P = new Vec(), N = new Vec(), Rt = new Vec(), Up = new Vec(), Dv = new Vec(), Q = new Vec();
    const hit = Y => {                                                // the camera's ray through Y meets the card's plane: px from its centre
      Dv.copy(Y).sub(C); const den = Dv.dot(N); if (Math.abs(den) < 1e-6) return null;
      const lam = Q.copy(P).sub(C).dot(N) / den; if (lam <= 0) return null;
      Q.copy(C).addScaledVector(Dv, lam).sub(P); return [Q.dot(Rt) / card.k, -Q.dot(Up) / card.k];
    };
    let now = 0, last = '';
    anim(t => { now = t; });
    const prev = V.scene.onBeforeRender;
    V.scene.onBeforeRender = function (r, sc, cam, ...rest) {
      if (prev) prev.call(this, r, sc, cam, ...rest);                 // (the ride has posed the card's hold)
      if (now < T - 0.1 || now > X + 0.05) return;
      copyTL.time(Math.max(0, now), true);                            // (the card's scale and dz at this moment; renderCopy seeks again, a no-op)
      cam.getWorldPosition(C);
      const H = card.H; P.copy(H.at(card.at[0], card.at[1], card.depth)).addScaledVector(H.fwd, card.dz);
      N.copy(H.fwd); Rt.set(1, 0, 0).applyQuaternion(H.q); Up.set(0, 1, 0).applyQuaternion(H.q);
      const c = hit(S0), a = hit(SR), u = hit(SU); if (!c || !a || !u) return;
      const sc0 = +gsap.getProperty(cardEl, 'scale') || 1, W = cBox[2], HH = cBox[3];
      const rx = Math.hypot(a[0] - c[0], a[1] - c[1]) / sc0, ry = Math.hypot(u[0] - c[0], u[1] - c[1]) / sc0;
      const x = (c[0] + W / 2) / sc0, y = c[1] / sc0 + HH / 2, f = 75 / Math.max(4, rx);   // (a ~1.5 px soft edge, as the static one)
      const m = `radial-gradient(${rx.toFixed(1)}px ${ry.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px,transparent ${(100 - f).toFixed(2)}%,#000 ${(100 + f).toFixed(2)}%)`;
      if (m !== last) { last = m; cardEl.style.webkitMaskImage = m; cardEl.style.maskImage = m; }
    };
  }
};
