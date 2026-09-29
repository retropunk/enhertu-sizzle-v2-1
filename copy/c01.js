/* Copy · frame 1 (0 → 4.2 s): ENHERTU HAS BEEN / PUSHING BOUNDARIES, built line by line (v1: each line rises out of its mask).
   · PUSHING BOUNDARIES sits on a card in hold 1's view (a little in front of the sphere), rises out of its mask as v1, and
     swipes out to the right just before frame 2's PUSHING WHAT'S POSSIBLE swipes in on the same spot (from 4.4, gone by
     4.85; the new line starts at 4.95). All times are read from the holds, so a retimed hold carries the copy.
     Its exit is KEPT under the user's no-transition-outs rule (2026-09-28 00:30), as the rule's exception: the camera only
     creeps ~8 units forward between boards 1 and 2 (measured with no exit: the line stays fully on screen, drifting ~20
     px, and sits right on top of PUSHING WHAT'S POSSIBLE, board 2's line at the same height), so nothing would hide it.
     It now stays ~0.85 s longer (it left at 3.55).
   · ENHERTU HAS BEEN is its own layer ("lines in layers", used once here) because it stays into frame 2 and glides to its
     board-2 place (v1: x −56; the boards: 50 px left and 18 px up). It lives in hold 2's view; at hold 1 an offset in its
     plane, a depth and a 1.7° turn put it exactly on board 1's line. Entrance: it rises out of its mask while pushing
     forward out of the depth (frame 1's one Z moment; the camera is pushing in at the same time, so the letters come at
     you). The carry and its exit are in c02.js.
   · Every line is v1's (text, weight, animation) with its size, letter-spacing and place fitted to the board by least
     squares over the glyph edges (v1's type ran 4–7 % wider than the boards' tighter tracking, and board 2's block sits
     18 px higher than v1 put it): each line is within 2 px of its board lettering at the holds.
   · Never still (user, 21:50: the copy "hovers subtly in 3D"): every line floats on its own wrapper (hover(), below), zero
     at the key instants, so it sits on its board place as the camera passes each board and drifts gently around it.
   Also exports the helpers c01–c03 share: v1's type metrics (FONT), the super line (line()) and the hover (hover()). */

/* Type metrics (as v1): the supers' sizes were set for Open Sans from the board's cap heights. FONT.scale keeps those cap
   heights with the brand face, and FONT.cc[weight] is where the cap centre sits in a line-height-1 box (measured once the
   face has loaded). */
import { contentFor, fillRuns, inkRuns, shrinkK } from './content.js';
export { contentFor };
export const FONT = { scale: 1, cc: { 300: 0.52, 700: 0.52, 800: 0.52 } };
const lines = [];
function measure() {
  const c = document.createElement('canvas').getContext('2d');
  for (const wt of [300, 700, 800]) {
    c.font = `${wt} 100px "new-hero", "Open Sans", sans-serif`;
    const m = c.measureText('H'), base = (100 - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
    FONT.cc[wt] = (base - m.actualBoundingBoxAscent / 2) / 100;
    if (wt === 800) FONT.scale = 0.714 / (m.actualBoundingBoxAscent / 100);
  }
}
const seat = L => { const fs = L.k ? L.size * FONT.scale * L.k : L.size * FONT.scale; L.ln.style.fontSize = fs.toFixed(2) + 'px'; L.ln.style.top = (L.cy - FONT.cc[L.wt] * fs - L.oy).toFixed(1) + 'px'; };
let fontsP = null;
const fontsReady = V => fontsP || (fontsP = V.waitFor(Promise.all([300, 700, 800].map(wt => document.fonts.load(`${wt} 100px "new-hero"`)))
  .then(() => { measure(); lines.forEach(L => { if (L.edit) fitEdit(L); seat(L); }); })));
/* An edited line (content/copy.json, content.js): its size and tracking as built, shrunk (L.k) only if the edited words
   would run past its area's edge (edit.maxR); it keeps its left edge, or its ink centre for a line the board centres
   (edit.align 'center'). Bold runs take the line's own bold weight (frame 3's is Bold 700), light runs Light 300. */
function fitEdit(L) {
  const fs = L.size * FONT.scale, e = L.edit, wts = { b: L.w === 'b' ? L.wt : 800, l: 300 };
  const def = inkRuns([{ text: L.text, w: L.w }], fs, L.ls, wts), m = inkRuns(e.runs, fs, L.ls, wts);
  const c = L.x - def.l + def.w / 2;                                  // the ink centre as built
  L.k = shrinkK(e.runs, fs, L.ls, e.align === 'center' ? { align: 'center', c, maxR: e.maxR ?? 1880, entry: e.entry } : { L: L.x - m.l, maxR: e.maxR ?? 1880, entry: e.entry });
  const ls = L.ls * L.k, span = L.ln.firstElementChild;
  span.style.letterSpacing = `${ls}px`;
  if (e.align === 'center') { const m2 = inkRuns(e.runs, fs * L.k, ls, wts); L.ln.style.left = `${(c - m2.w / 2 + m2.l - L.ox).toFixed(1)}px`; }
}

/* One super line, as v1's sup(), fitted to the board: x = left edge, cy = cap-height centre (stage px), size = the Open
   Sans-era size (v1's), w = 'b' (ExtraBold) | 'l' (Light). Options: ls = letter-spacing (px; the boards are tracked
   tighter than the face's default), wt = a weight other than the class's (frame 3's bold is lighter), ox / oy = the
   parent's own offset in stage px (0 on a full-stage card). The .line is v1's mask (overflow hidden, padded so the
   swipe's x offset isn't clipped); its span carries the animation. Returns the span. edit: content.js's line() result
   when content/copy.json changes the words (with align / maxR: see fitEdit); the words as built otherwise. */
export function line(V, parent, x, cy, size, w, text, { ls = 0, wt = w === 'b' ? 800 : 300, ox = 0, oy = 0, edit } = {}) {
  fontsReady(V);
  const ln = document.createElement('div');
  ln.className = 'super line txt';                                   // (index.html's .line: the mask's style)
  ln.style.left = `${(x - ox).toFixed(1)}px`;
  ln.innerHTML = `<span class="${w}" style="font-weight:${wt};letter-spacing:${ls}px">${text}</span>`;
  if (edit) fillRuns(ln.firstElementChild, edit.runs, { b: w === 'b' ? wt : 800, l: 300 });
  parent.appendChild(ln);
  const L = { ln, cy, size, wt, oy }; if (edit) Object.assign(L, { edit, x, ox, ls, w, text }); lines.push(L); seat(L);
  return ln.firstElementChild;
}

/* The hover: copy is never dead still (user, 21:50: it "hovers subtly in 3D"). A slow float on an element's own wrapper
   (one whose transform nothing else animates): a few px in its plane, a little toward / away from the camera and under a
   degree of tilt, each term on its own slow period. Each term is sin(2π (t − tk) / P), so the element is exactly in its
   place at the key instant tk and moving through it. Several key instants (copy seen at two boards): each has its own
   float, handed over smoothly half-way between them, so it is exactly in place at every one. `seed` varies the periods
   and directions between elements, `amp` scales it, `origin` is the tilt's pivot (CSS transform-origin). */
export function hover(V, el, tks, { seed = 0, amp = 1, origin } = {}) {
  tks = [].concat(tks);
  const r = k => { const x = Math.sin(seed * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  // [amplitude (px or degrees), period (s), sign] for x, y, z (CSS px in the card's plane) and the tilts about x and y
  const T = [[4, 6.3], [3, 4.9], [14, 7.7], [0.7, 5.6], [1.1, 8.9]].map(([a, p], k) => [a * amp, p * (0.85 + 0.3 * r(k)), r(k + 7) < 0.5 ? -1 : 1]);
  if (origin) el.style.transformOrigin = origin;
  const ss = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
  V.anim(t => {
    const o = [0, 0, 0, 0, 0];
    tks.forEach((tk, i) => {                                         // partition of unity: switch half-way between key instants
      const a = i ? ss((t - (tks[i - 1] + tk) / 2 + 0.6) / 1.2) : 1, b = i < tks.length - 1 ? ss((t - (tk + tks[i + 1]) / 2 + 0.6) / 1.2) : 0, w = a - b;
      if (w > 0) T.forEach(([A, P, s], k) => { o[k] += w * s * A * Math.sin(2 * Math.PI * (t - tk) / P); });
    });
    el.style.transform = `translate3d(${o[0].toFixed(2)}px,${o[1].toFixed(2)}px,${o[2].toFixed(2)}px) rotateX(${o[3].toFixed(3)}deg) rotateY(${o[4].toFixed(3)}deg)`;
  });
}

export const shared = {};                                             // c01 → c02: the ENHERTU HAS BEEN layer

export default V => {
  const { copy, copyLayer, copyTL, holds } = V;
  const h1 = holds[1], h2 = holds[2];                               // every time is read from the holds (hold 1: 1.7–3.5)
  const TX = contentFor(V, 1);                                      // frame 1's words (content/copy.json); only an edited line is re-fitted
  const ed = (i, md, o) => { const r = TX.line('lines', i, md); return r.edited ? { ...r, ...o } : undefined; };

  /* ---- PUSHING BOUNDARIES: hold 1's card ---- */
  const XO = h2.t0 - 0.75 - 0.55;                                    // its swipe-out: 0.45 s, done 0.1 s before c02's first line swipes in
  const card1 = copy(1, { depth: h1.depth - 3 }).show(0, XO + 0.5);
  const pb = line(V, card1.el, 408.5, 558.1, 105.05, 'l', 'PUSHING BOUNDARIES', { ls: -4.4, edit: ed(1, 'PUSHING BOUNDARIES', { align: 'center' }) });   // fitted to board 1 (v1: 420, 560, 104)
  copyTL.fromTo(pb, { yPercent: 115 }, { yPercent: 0, duration: 0.8, ease: 'power3.out' }, h1.t0 - 0.75)
    .fromTo(pb, { clipPath: 'inset(0% 0% 0% 0%)', x: 0 }, { clipPath: 'inset(0% 0% 0% 100%)', x: 60, duration: 0.45, ease: 'power2.in', immediateRender: false }, XO);
  hover(V, pb.parentElement, h1.tk, { seed: 1 });                   // (the line's mask wrapper: the span's own transform is the rise / swipe)

  /* ---- ENHERTU HAS BEEN: its own layer, in hold 2's view (it ends on board 2) ----
     The layer is a box in board-2 stage px (left BX, top BY, BW × BH) centred on `at`; its inner `mv` is what glides. */
  const BX = 150, BY = 360, BW = 1150, BH = 170, dep = h2.depth - 3;
  const el = document.createElement('div'); el.style.cssText = `width:${BW}px;height:${BH}px`;
  const mv = document.createElement('div'); mv.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;transform-style:preserve-3d';   // (3D: its line hovers in depth)
  el.appendChild(mv);
  const ehb = line(V, mv, 194.9, 423.7, 100.8, 'b', 'ENHERTU HAS BEEN', { ls: -0.8, ox: BX, oy: BY, edit: ed(0, '**ENHERTU HAS BEEN**', { maxR: 1220 }) });   // (an edit stays clear of board 1's sphere)   // board 2's place, fitted (v1: 196, 445, 104)
  const at = [BX + BW / 2, BY + BH / 2];
  const E = copyLayer(2, el, { at, depth: dep }).show(0, holds[3].t0 - 0.9);   // c02.js owns this end (its swipe-out, hold 3 start − 1.7, + 0.8) and sets the same value
  // hold 1's pose: the box 50 px right and 18 px down (board 1's place, measured) on hold 1's view ray, `dep` from that
  // camera (so it shows at 1:1 there), expressed in the layer's plane (mv's x / y, in px) and depth (dz) from its hold-2 place
  const k = dep * h2.tanV / 540, d = h1.at(at[0] + 50, at[1] + 18, dep).sub(h2.at(at[0], at[1], dep));
  const P1 = { dz: d.dot(h2.fwd), x: d.dot(h2.right) / k, y: -d.dot(h2.upv) / k };
  // …and turned to face hold 1's camera there (hold 2 looks 1.7° further right; left square to it, the line's far end
  // would sit 5 px off board 1's): a yaw about the line's own centre, in the layer's CSS frame (y down)
  const f1 = h1.fwd; P1.ry = -Math.atan2(f1.dot(h2.right), f1.dot(h2.fwd)) * 180 / Math.PI; P1.rx = Math.atan2(f1.dot(h2.upv), f1.dot(h2.fwd)) * 180 / Math.PI;
  Object.assign(shared, { E, mv, span: ehb, P1 });                   // c02.js carries it to board 2 and swipes it out
  gsap.set(mv, { x: P1.x, y: P1.y, rotationY: P1.ry, rotationX: P1.rx, transformPerspective: 0, transformOrigin: '50% 50%' });
  // entrance: rises out of its mask (v1: 0.7 s) while it pushes forward out of the depth
  copyTL.fromTo(ehb, { yPercent: 115 }, { yPercent: 0, duration: 0.8, ease: 'power3.out' }, h1.t0 - 1.15)
    .fromTo(E, { dz: P1.dz + 9 }, { dz: P1.dz, duration: 1.4, ease: 'expo.out' }, h1.t0 - 1.25);
  hover(V, ehb.parentElement, [h1.tk, h2.tk], { seed: 2 });         // in place at both boards' key instants
};
