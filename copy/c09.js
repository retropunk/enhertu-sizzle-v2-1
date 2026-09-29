/* Copy for frame 09 · AND FROM THERE, / THE MOMENTUM / PICKED UP
   v1: a statement built line by line. Each line rises out of its own mask (yPercent 115 → 0, 0.8 s power3.out, 0.35 s
   apart, from frame start + 0.5 s), New Hero ExtraBold. Size and place are fitted to board 9's type (v1's 95.71 px was
   5% small and sat 5–17 px off): 100.5 px, letters' left edges 650 · 918 · 929, line tops 221.6 · 330.1 · 437.6.
   3D ("lines in layers"): each line is its own layer at its own depth from hold 9's camera (18 · 25 · 32 units, all in
   front of the right-hand chains they sit over, at 33.6–36.8), so the camera's moves show them part in depth.
   Timing, from hold 9, an ease-through since the user's 21:50 rule ("never stop"): its slow window is 34.55–35.5 and the
   camera passes board 9's exact pose at the key instant 35.15 (~2.5 u/s, trucking right into the 9 → 10 whip), after
   following the sphere's drop off the corkscrew. The rises start at key − 1.9, − 1.5 and − 1.15 (33.25 · 33.65 · 34.0;
   review: from key − 1.6 the whole statement was up for only ~0.8 s), so all three are up by ~34.3 and the statement
   reads through the slow window and on until the whip carries it off (~1.6 s whole, was ~1.15 with the old fade).
   · They hover (c07's hover(): a slow float in 3D, zero at the key instant, so at 35.15 every line is on its board px),
     the three as one block (one seed, one float). On the way in the camera's approach would carry them in from beyond the
     right edge (THE MOMENTUM is clipped by it until ~34.75), so their place is blended most of the way toward riding in
     the camera's view, which keeps each rise inside the frame: 0.78 for AND FROM THERE, and PICKED UP, 0.92 for THE
     MOMENTUM, the widest line, which rises nearest the right edge (review: at 0.78 its end touched the edge at 34.0–34.1;
     now it stays ≥ ~60 px clear). They still show the approach in perspective and part in depth, and the blend hands back
     to the world across the key instant (it changes nothing there).
   · No exit animation (user, 2026-09-28 00:30: "Once the text comes in and it's floating around, you can just leave it.
     No need to transition out because where it sits in 3D space, it'll eventually disappear because of the camera
     movement"): the lines keep floating in the world and the 9 → 10 whip carries them off (they sweep up off the top edge
     over ~35.6–35.95). Gone: the fade and the push toward the lens. They switch off at hold end + 0.6 (36.1), while off
     screen: the whip swings the camera round through their plane at ~36.35, where CSS would draw a stretched sliver.
   Timed from the hold, so a retimed hold carries the copy. */
import { hover, contentFor } from './c07.js';
import { fillRuns, inkRuns, shrinkK, capOf, fontsIn, WT, EDGE } from './content.js';
const FACE = 'font-family:"new-hero","Open Sans",sans-serif;color:#fff;white-space:nowrap;line-height:1';
const sm = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };

// one v1 super line as its own 3D layer. x = left edge of the letters, top = v1's line top (stage px), fs = font px,
// w = 'b' | 'l', width = the letters' width (v1, measured) so the layer centres on the line. The layer is v1's .line box
// (padding .1em .12em .14em, overflow hidden: the mask the span rises out of). edit (content.js): edited words; the layer
// is re-sized to them once the face is in, at the size as built, shrunk only if they'd run past maxR (its cap centre kept).
function lineLayer(V, n, { x, top, fs, w, text, width, depth, edit }) {
  const el = document.createElement('div');
  const W = Math.ceil(width + 0.24 * fs + 40), H = 1.24 * fs;               // 40 px slack on the right (a fallback face)
  el.style.cssText = `width:${W}px;height:${H.toFixed(2)}px;padding:${(0.1 * fs).toFixed(2)}px ${(0.12 * fs).toFixed(2)}px ${(0.14 * fs).toFixed(2)}px;overflow:hidden;font-size:${fs}px;${FACE}`;
  el.innerHTML = `<span class="${w} txt" style="display:inline-block">${text}</span>`;
  if (edit) fillRuns(el.firstElementChild, edit.runs);
  const L = V.copyLayer(n, el, { at: [x - 0.12 * fs + W / 2, top - 0.1 * fs + H / 2], depth });
  L.span = el.firstElementChild;
  if (edit) V.waitFor(fontsIn().then(() => {
    const f = fs * shrinkK(edit.runs, fs, 0, { L: x, maxR: edit.maxR ?? EDGE[1], entry: edit.entry }), m = inkRuns(edit.runs, f, 0);
    const W2 = Math.ceil(m.adv + 0.24 * f + 40), H2 = 1.24 * f, top2 = top + capOf(WT[w]).cc * (fs - f);
    Object.assign(el.style, { width: `${W2}px`, height: `${H2.toFixed(2)}px`, padding: `${(0.1 * f).toFixed(2)}px ${(0.12 * f).toFixed(2)}px ${(0.14 * f).toFixed(2)}px`, fontSize: `${f}px` });
    L.at[0] = x - 0.12 * f + W2 / 2; L.at[1] = top2 - 0.1 * f + H2 / 2;
  }));
  return L;
}

export default V => {
  const h = V.holds[9], [f9] = V.win(9), tl = V.copyTL;
  if (!h) throw new Error('c09: frame 9 needs a hold');
  const tk = h.tk;
  V.waitFor(document.fonts.load('800 100px "new-hero"'));
  const FS = 100.5;                                       // widths: v1's measured letters × 100.5 / 95.71
  const TX = contentFor(V, 9);                            // frame 9's words (content/copy.json)
  const ed = (i, md) => { const r = TX.line('lines', i, md); return r.edited ? r : undefined; };
  const lines = [
    lineLayer(V, 9, { x: 650, top: 221.6, fs: FS, w: 'b', text: 'AND FROM THERE,', width: 958, depth: 18, edit: ed(0, '**AND FROM THERE,**') }),
    lineLayer(V, 9, { x: 917.9, top: 330.1, fs: FS, w: 'b', text: 'THE MOMENTUM', width: 900, depth: 25, edit: ed(1, '**THE MOMENTUM**') }),
    lineLayer(V, 9, { x: 928.6, top: 437.6, fs: FS, w: 'b', text: 'PICKED UP', width: 549, depth: 32, edit: ed(2, '**PICKED UP**') }),
  ];
  const T = Math.max(f9 + 0.3, tk - 1.9);                 // v1's build (f9 + 0.5): the camera is coming off the corkscrew
  const OFF = h.t1 + 0.6;                                 // no exit: off once the whip has carried them off screen (see the header)
  for (const L of lines) L.show(T - 0.05, OFF);
  gsap.set(lines.map(L => L.span), { yPercent: 115 });
  [0, 0.4, 0.75].forEach((d, i) => tl.fromTo(lines[i].span, { yPercent: 115 }, { yPercent: 0, duration: 0.8, ease: 'power3.out', immediateRender: false }, T + d));
  // hover: the three as one block (the same seed gives the same float), blended toward the camera's view on the way in,
  // THE MOMENTUM a little more (see the header)
  const bIn = k => t => k * (1 - sm((t - tk + 0.3) / 0.6));
  hover(V, [lines[0], lines[2]], { tk, seed: 41, amp: 5, tilt: 0.8, beta: bIn(0.78) });
  hover(V, [lines[1]], { tk, seed: 41, amp: 5, tilt: 0.8, beta: bIn(0.92) });
};
