/* Copy · frame 12 (~47.4 → 52 s): the holding shape ASCO: ACTIVATED (top left, frame 12's own), DESTINY-GASTRIC04 / DATA
   RELEASED / WITH MATERIALS APPROVED / AND PRINTED WITHIN 24 HOURS (centred low) and the DG04 document art (right; v1's
   placeholder cut-out, assets/copy/docs-dg04.png). v1's wording, styles and text moves (index.html, frame 12), placed in 3D
   in hold 12's view and fitted to board 12 (every line by its ink; the last line is one line of two weights as the board
   sets it; the art is the board's crop at 1:1 on its place, 1227, 76, 645 × 827).
   The camera (G3, since the user's 21:50 rule "never stop"): from frame 11 it orbits round the sphere's left onto the road
   (still turned ~30° from board 12's view at 47.5, ~12° at 48.0, on it by ~48.6), creeps after the sphere down the road
   through a long slow window (48.9–51.2; board 12's exact framing at the key instant 49.85, ~4 u/s) and speeds up after it,
   running low under the peach arch (~51.8) after the sphere as it rolls into the doorway, then cranes up (~52.2).
   The user (21:50): "when we need to reintroduce it in the next frame 12 we can have it come in from off screen left. And
   then we see the other images and text for Frame 12, which also need to come in sooner so they have time to be read before
   the ball disappears through the tunnel as we're leaving Frame 12."
   · In (every time from hold 12's key instant), as the camera comes round onto the road:
     - key − 2.35 (47.5): frame 12's own holding shape slides in from off screen left (swinging round to face the view),
       its two lines swiping in as it lands (nothing carries over from frame 11: that one is left behind on the right);
     - key − 1.95 (47.9): the four lines swipe in (v1's clip swipe, 0.55 s, 0.08 apart), pushing forward a little out of
       the depth (1.2 units); all in by ~48.7;
     - key − 1.6 (48.25): the document art pops in (v1: fade up, scale 0.85 → 1, a 3° tilt out, back.out) and turns in from
       24° about its upright into the board's plane (frame 12's Z moment); settled by ~49.05.
     So by the slow window's start (48.9) everything is in, and it reads at full strength until the camera carries it off
     (~51.75–52.0): the holding shape ~3.4 s, the lines ~3 s, the documents ~2.9 s.
   · The holding shape's outline is board 12's own (c07's HOLD, refit 2026-09-29: 603.6 × 304.2, an 8 px frame, 82 px
     corners, centred on board 12's shape at (395.95, 257.1), ASCO11.shape12; it was 596 × 300 on (395.2, 256.55), its
     edges 1.2–4.7 px inside the board's). Its words are where they were.
   · Place: all three are in hold 12's view a little in front of frame 12's front shapes (depth 8.5; the holding shape half
     a unit nearer, the art half a unit further). The camera creeps ~15 units forward between the key and the sphere's
     disappearance, so a pure world place would be passed within a second of the key; instead the copy rides most of the
     camera's move (c07's hover(): 0.95 toward riding in its view for the lines and the art, whose board places run almost
     edge to edge: ~0.97× at the slow window's start, 1× at the key, ~1.01× at its end). The holding shape has room on the
     left, so it rides 0.9 through the slow window: it swells ~0.93× → 1× → 1.075× and drifts ~25 px/s toward its corner,
     a slow parallax against the lines, so the depth shows. All three hover (a slow float in 3D, ~2° of tilt, zero at the
     key instant, when the camera is on the board's exact pose and every blend changes nothing).
   · The lens narrows 40° → 30° as the camera comes round onto the road (a 1.3× zoom in): the copy keeps 85 % of the key's
     lens meanwhile (c13's lensHold(), easing off over the 0.8 s after the key), so it builds near its final size (the lines
     grow ~1.3× while they're revealed, from their own push and the camera's approach; they grew ~1.7× before).
   · Out: none (user, 00:30: no transition-outs; the camera move hides the copy). At the slow window's end (51.2) the copy
     stops riding: over 0.5 s it slows to rest in the world where it is (c13's leaveInWorld(): it rides, with the same
     share, a stand-in for the camera that eases to a stop, so there is no jump and no kink), and the camera, speeding up
     toward the doorway, runs past it at full strength, as it does past frame 10's copy: the lines swell and go off the
     bottom (~51.75), the holding shape off the top left (~51.9), the documents off the right (~52.0). The camera then
     cranes up through the documents' place (~52.18, where they would sweep across the lens, hugely), so the layers end at
     GONE (key + 2.25, 52.1), while all three are off screen. */
import { liveFill, kit, holdBg, hover, contentFor, watchPic, picCss } from './c07.js';
import { ASCO11, ascoShape, depth12 } from './c11.js';
import { lensHold, ramp, leaveInWorld } from './c13.js';

/* A super line in two weights (one size, the board's): parts [[text, 'l' | 'b'], …] in one mask, so it swipes as one line.
   Fitted like c07's kit lines: ink left edge L, cap centre cy, ink width W (board px), by canvas metrics once the face is in. */
function mixedLine(V, host, { parts, L, cy, W }) {
  const d = document.createElement('div'); d.className = 'txt line';                 // (index.html's .line: the mask's style)
  const sp = document.createElement('span');
  for (const [text, w] of parts) { const s = document.createElement('span'); s.className = w; s.textContent = text; sp.appendChild(s); }
  d.appendChild(sp); host.el.appendChild(d);
  const face = wt => `${wt} 100px "new-hero", "Open Sans", sans-serif`;
  const fit = () => {
    const c = document.createElement('canvas').getContext('2d'); c.letterSpacing = '0px';
    c.font = face(300); const mH = c.measureText('H');
    const base = (100 - (mH.fontBoundingBoxAscent + mH.fontBoundingBoxDescent)) / 2 + mH.fontBoundingBoxAscent, cc = (base - mH.actualBoundingBoxAscent / 2) / 100;
    let x = 0, inkL = 0, inkR = 0;
    parts.forEach(([text, w], i) => {
      c.font = face(w === 'b' ? 800 : 300); const m = c.measureText(text);
      if (i === 0) inkL = m.actualBoundingBoxLeft;
      if (i === parts.length - 1) inkR = x + m.actualBoundingBoxRight;
      x += m.width;
    });
    const fs = 100 * W / (inkL + inkR);
    Object.assign(d.style, { left: `${(L + inkL * fs / 100 - host.ox).toFixed(2)}px`, top: `${(cy - cc * fs - host.oy).toFixed(2)}px`, fontSize: `${fs.toFixed(2)}px` });
  };
  V.waitFor(Promise.all([300, 800].map(w => document.fonts.load(face(w)))).then(fit));
  return sp;
}

export default V => {
  const { holds, copyTL, anim } = V;
  const h12 = holds[12];
  if (!h12) throw new Error('c12: frame 12 needs a hold');
  const K = kit(V), tk = h12.tk, TX = contentFor(V, 12);            // (TX: frame 12's words and picture from content/copy.json)
  const D = depth12(h12);

  /* --- frame 12's own holding shape (board 12's place: board 11's fit moved by (−1216.8, +10.55)) --- */
  const { lay: badge, panel, lines: aLines } = ascoShape(V, K, 12, [ASCO11.box[0] + ASCO11.to12[0], ASCO11.box[1] + ASCO11.to12[1]], D - 0.5, TX, ASCO11.shape12);

  /* --- the words (board 12's lettering, measured at 1920 px) --- */
  const words = K.layer(12, [600, 780, 740, 290], D);
  // (board 12 centres these lines: an edited one keeps its centre; the last is one line of two weights as the board sets it)
  const C = { align: 'center' }, s4 = TX.spec('lines', 3, { text: 'AND PRINTED WITHIN 24 HOURS', w: 'l', L: 648.0, cy: 1012.8, W: 640.2 }, 'AND PRINTED **WITHIN 24 HOURS**', { ...C, mixed: true });
  const lines = [
    K.line(words, TX.spec('lines', 0, { text: 'DESTINY-GASTRIC04', w: 'b', L: 712.0, cy: 848.0, W: 503.4 }, undefined, C)),
    K.line(words, TX.spec('lines', 1, { text: 'DATA RELEASED', w: 'b', L: 776.6, cy: 905.5, W: 385.1 }, undefined, C)),
    K.line(words, TX.spec('lines', 2, { text: 'WITH MATERIALS APPROVED', w: 'l', L: 687.4, cy: 963.1, W: 550.6 }, undefined, C)),
    s4.edit ? K.line(words, s4) : mixedLine(V, words, { parts: [['AND PRINTED ', 'l'], ['WITHIN 24 HOURS', 'b']], L: 648.0, cy: 1012.8, W: 640.2 })];

  /* --- the document art (v1's #d12) --- */
  const DB = [1227, 76, 645, 827];
  const doc = K.layer(12, DB, D + 0.5);
  const P = TX.pic('documents', { src: 'assets/copy/docs-dg04.png', fit: 'contain' });   // (a cut-out: a new one fits whole)
  doc.el.innerHTML = P.edited ? `<img class="img" src="${P.src}" alt="" style="${picCss(P)};width:${DB[2]}px;height:${DB[3]}px">`
    : `<img class="img" src="assets/copy/docs-dg04.png" alt="" style="position:absolute;left:0;top:0;width:${DB[2]}px;height:${DB[3]}px;display:block">`;
  const art = doc.el.firstElementChild;
  watchPic(V, art, P);
  V.waitFor(art.decode().catch(() => {}));

  /* --- timing (from the key instant) --- */
  const TA = tk - 2.35, TW = tk - 1.95, TD = tk - 1.6;
  // no exit (user, 00:30): from the slow window's end the copy comes to rest in the world where it is (c13's leaveInWorld:
  // it rides a stand-in camera that slows to a stop over TRD), and the camera, speeding up toward the doorway, runs past
  // it: the holding shape goes off the top left (~51.9), the lines off the bottom (~51.75), the documents off the right
  // (~52.0). Then it cranes up through the documents' place (~52.18, where they would sweep across the lens), so the
  // layers end at GONE, while everything is off screen.
  const TR = h12.t1, TRD = 0.5, GONE = tk + 2.25;                     // 51.2 · 52.1
  const A0 = { x: -2000, ry: 30, z: 3 };
  const stA = { y: 0, rx: 0, ...A0 }, stW = { x: 0, y: 0, z: 1.2, rx: 0, ry: 0 }, stD = { x: 0, y: 0, z: 0, rx: 0, ry: 0 };
  // the holding shape: in from off screen left (its right edge starts beyond the left edge at the wide lens of the moment)
  copyTL.fromTo(stA, A0, { x: 0, ry: 0, z: 0, duration: 1.0, ease: 'power3.out', immediateRender: false }, TA);
  K.swipe(aLines, TA + 0.35, 0.1);
  // the lines: v1's swipe, pushing forward a little out of the depth as they come (1.2 units: at depth 8.5 more would swell
  // them ~30 % while they're being revealed)
  K.swipe(lines, TW, 0.08, 0.55);
  copyTL.fromTo(stW, { z: 1.2 }, { z: 0, duration: 1.0, ease: 'power3.out', immediateRender: false }, TW);
  // the art: v1's pop, turning into the board's plane
  gsap.set(art, { autoAlpha: 0, scale: 0.85, rotation: 3, rotationY: 24, transformOrigin: '50% 40%' });
  copyTL.fromTo(art, { autoAlpha: 0, scale: 0.85, rotation: 3, rotationY: 24 }, { autoAlpha: 1, scale: 1, rotation: 0, rotationY: 0, duration: 0.8, ease: 'back.out(1.4)', immediateRender: false }, TD);

  /* --- place: hover, riding most of the camera's move (see the header) --- */
  // (0.95 while the camera comes round and its lens narrows, so they arrive near full size, and on through the slow window:
  //  board 12's copy runs almost edge to edge, so the camera's creep may bring it only ~5 % nearer before the exit (at 0.85
  //  AND PRINTED WITHIN 24 HOURS went off the bottom from ~51.0 and the art off the right); then leaveInWorld() takes over
  //  at TR, holding the same share while the stand-in camera stops, so the inner ride is 0 from TR)
  //  The holding shape has room on the left, so through the slow window it rides less (0.9): it keeps a little more of the
  //  camera's creep (a slow swell and parallax against the lines) and the depth shows. All three hover with ~2° of tilt on a
  //  shorter period (per 0.75: ~3.5–6.5 s), so they turn visibly in 3D without growing toward the edges.)
  const beta = t => t < TR ? 0.95 : 0;
  const betaA0 = ramp([[TA + 1.0, 0.95], [h12.t0, 0.9]]), betaA = t => t < TR ? betaA0(t) : 0;
  hover(V, [badge], { tk, seed: 51, amp: 6, tilt: 2.0, per: 0.75, st: stA, beta: betaA });
  hover(V, [words], { tk, seed: 52, amp: 5, tilt: 1.6, per: 0.75, st: stW, beta });
  hover(V, [doc], { tk, seed: 53, amp: 6, tilt: 2.0, per: 0.75, st: stD, beta });
  // as the camera comes round onto the road its lens narrows 40° → 30° (a 1.3× zoom in, ~47.4–48.9): the copy keeps most of
  // the key's lens meanwhile, so it builds near its final size instead of swelling while it's being revealed
  lensHold(V, [badge, words, doc], { tanK: h12.tanV, w: ramp([[tk, 0.85], [tk + 0.8, 0]]) });
  leaveInWorld(V, [words, doc], { h: h12, ta: TR, T: TRD, b: 0.95 });
  leaveInWorld(V, [badge], { h: h12, ta: TR, T: TRD, b: betaA0(TR) });

  /* --- living fill (board 12's colours at the key instant) --- */
  anim(t => { panel.style.background = holdBg(liveFill(t, tk, 5, 9)); });

  badge.show(TA - 0.05, GONE); words.show(TW - 0.05, GONE); doc.show(TD - 0.05, GONE);
};
