/* Copy · frame 23 (103.75 → 109.35 s): ENHERTU LEVELED UP / WITH A DUAL LAUNCH / IN THE CURATIVE / INTENT SETTING:
   (top left, over the dark wall). v1's wording, weights and move (index.html, frame 23: the four lines swipe in, 0.18 s
   apart, from f23 + 0.6; the block fades at f24 − 0.6), placed in 3D in hold 23's view.
   · Type fitted to board 23 (measured on a 1920 px render of storyboard.pdf, aligned to the board image): each line's
     ink left edge, cap centre, cap height (size) and ink width (tracking); within 0–2 px of the board's lettering at
     the key instant. Line 1 mixes weights (ENHERTU in New Hero Light, LEVELED UP in ExtraBold) and line 2's word spaces
     run ~4 px wider than the face's, so those two lines are built of runs, each fitted to its own ink box, sharing one
     mask, so each still swipes as one line, as v1's did.
   · Timing, all from hold 23, an ease-through (the NEW RULE: the camera never stops; it pushes in and slows to ~3 u/s
     through the key instant tk trucking right with the sphere, then rises and swings round the loop): the lines swipe in
     from slow window start − 0.35, as the landing's sweep settles, 0.12 apart (0.7 s each), so all four are in by the key
     instant and read for ~2 s after it.
   · "Lines in layers": two layers in front of the wall, the bold statement (lines 1–2) at hold 23's sphere depth − 3
     and the light lines (3–4) 0.45 units deeper, so the moves part them a little in depth while the paragraph stays
     flush left (a 1.5 unit gap let lines 3–4 drift up to ~40 px out of line during the rise round the loop; now ≤ 7 px).
     Frame 23's one Z moment: the bold statement pushes forward out of the depth as it swipes in (ENHERTU "levels up"
     toward the camera). The block hovers a little (c21.js's hover(): 30% of the camera's motion on the way in, 45% after
     the key instant, the lag capped at 250 px), which keeps it under ~190 px/s through the slow window.
   · NO EXIT (the COPY RULE, user 2026-09-28 00:30: no "alpha out or move away" where the camera hides the copy; the
     last pass receded it into the depth and faded it at f24 − 1.0): it stays in the world. As the camera pulls back
     and rises round the loop it gets smaller with the set, the sphere passes behind the lines' right ends (~108.8; the
     user wants the sphere behind the copy, as on 20), and the truck right toward 24 carries it off the left edge
     (whole to ~109.3, gone by ~110.1), before frame 24's pills slide in (~110.7). The capped lag keeps it moving with
     the set, never faster (without the cap it would still be a fifth in view at 110.4). The layers exist until the slow
     window's end + 3.2 s (out of view by then).
   Also exports mixedLine (a line built of separately fitted runs, e.g. two weights, that swipes as one line). */
import { kit, contentFor } from './c07.js';
import { hover, hoverBeta } from './c21.js';

/* A line made of runs in different weights: one mask (a wrapper, the element that swipes) holding one fitted kit line
   per run. box = the mask's stage box [x, y, w, h] (generous, so the swipe's clip covers the glyphs' overhang). */
export function mixedLine(K, host, runs, box) {
  const wrap = document.createElement('div');
  wrap.style.cssText = `position:absolute;left:${(box[0] - host.ox).toFixed(2)}px;top:${(box[1] - host.oy).toFixed(2)}px;width:${box[2]}px;height:${box[3]}px`;
  host.el.appendChild(wrap);
  const sub = { el: wrap, ox: box[0], oy: box[1] };
  runs.forEach(s => K.line(sub, s));
  return wrap;
}

export default V => {
  const { holds, copyTL, win } = V;
  const h23 = holds[23], h24 = holds[24];
  if (!h23) throw new Error('c23: frame 23 needs a hold');
  const K = kit(V), TX = contentFor(V, 23);                          // (TX: frame 23's words from content/copy.json)
  const [f23] = win(23), [f24] = win(24);
  const D = h23.depth - 3;                                           // a little in front of the sphere and the wall

  // the board's type (board 23 at 1920 px): L = ink left, cy = cap centre, H = cap height, W = ink width
  const A = K.layer(23, [30, 235, 800, 180], D);                     // lines 1–2 (the bold statement)
  const B = K.layer(23, [30, 405, 640, 160], D + 0.45);              // lines 3–4, a little deeper
  // (lines 1 and 2 are runs, each word fitted to its own board spot; an edited one is one kit line on layer A at the line's
  // cap height, its letters tracked as the board's words on average and its word gaps as the board's)
  const s1 = TX.spec('lines', 0, { text: 'ENHERTU LEVELED UP', w: 'l', L: 68, cy: 287.5, W: 670, H: 47, ref: [{ text: 'ENHERTU', w: 'l', W: 270 }, { text: 'LEVELED UP', w: 'b', W: 373 }] }, 'ENHERTU **LEVELED UP**', { mixed: true });
  const s2 = TX.spec('lines', 1, { text: 'WITH A DUAL LAUNCH', w: 'b', L: 62, cy: 365, W: 709, H: 48, ref: [['WITH', 173], ['A', 48], ['DUAL', 170], ['LAUNCH', 263]].map(([text, W]) => ({ text, W })) }, '**WITH A DUAL LAUNCH**', { mixed: true });
  const l1 = s1.edit ? K.line(A, s1) : mixedLine(K, A, [
    { text: 'ENHERTU', w: 'l', L: 68, cy: 287.5, W: 270, H: 47 },
    { text: 'LEVELED UP', w: 'b', L: 365, cy: 287.5, W: 373, H: 47 }], [50, 250, 720, 76]);
  // (the board sets this line's word spaces ~4 px wider than New Hero's: each word is fitted to its own ink box)
  const l2 = s2.edit ? K.line(A, s2) : mixedLine(K, A, [['WITH', 62, 173], ['A', 253, 48], ['DUAL', 319, 170], ['LAUNCH', 508, 263]]
    .map(([text, L, W]) => ({ text, w: 'b', L, cy: 365, W, H: 48 })), [50, 330, 740, 70]);
  const l3 = K.line(B, TX.spec('lines', 2, { text: 'IN THE CURATIVE', w: 'l', L: 68, cy: 443.5, W: 535, H: 47 }));
  const l4 = K.line(B, TX.spec('lines', 3, { text: 'INTENT SETTING:', w: 'l', L: 68, cy: 520.5, W: 527, H: 47 }));

  /* --- timing, from the holds --- */
  const T = Math.max(f23 + 0.3, h23.t0 - 0.35);                      // as the camera slows into hold 23
  K.swipe([l1, l2, l3, l4], T, 0.12, 0.7);
  copyTL.fromTo(A, { dz: 8 }, { dz: 0, duration: 1.0, ease: 'power3.out', immediateRender: false }, T);   // pushes forward out of the depth
  // no exit (COPY RULE): the pull back round the loop and the truck right to 24 carry it off the left edge (by ~110.1)
  const S = [T - 0.05, Math.min(h23.t1 + 3.2, h24 ? h24.t0 : f24 + 1.8)];
  [A, B].forEach(o => o.show(...S));
  hover(V, [A, B], h23, hoverBeta(h23.tk, 0.3, 0.45), S, 250);
};
