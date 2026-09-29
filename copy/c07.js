/* Copy · frame 7 (21.45 → 27.25 s): the holding shape EXPANDED HER2: ACTIVATED (top left) and the card
   JANUARY 2025 / FDA APPROVAL IN HR+/HER2-LOW & ULTRALOW mBC (right). v1's wording, styles and moves (index.html,
   frames 7–8), placed in 3D in hold 7's view. Every time is read from hold 7, an ease-through since the user's 21:50 rule
   ("never stop"): its slow window is 22.8–23.8 and the camera passes board 7's exact pose at the key instant 23.3 at
   ~3 u/s. It whips in before that, so the world (and the copy in it) is still sliding at ~22.4; the copy is under
   ~350 px/s on screen by ~22.57 and ~150 px/s by 22.9.
   · READING TIME (user, 2026-09-29, question A2: "add about ½ second where it's under ~1.3 s (e.g. 24, 25), borrowing
     time from the travel between frames so the piece stays 2:27"). The reading-time probe read frame 7 for 0.33 s
     (23.13–23.47; STRICT 0.13): the last card line was in only at 23.13, and after the key the camera's drift (~3 u/s,
     the card moving ~310 px/s on screen) plus the card's lift took it past the probe's 350 px/s. Now 0.93 s
     (22.57–23.5; STRICT 0.70), with the camera never slower than before (review, 2026-09-29: an earlier version
     halved its speed through the key): g2.js lets the camera linger near its key speed (3 u/s) for longer either side
     of the key, so it settles onto the board a little earlier (the time borrowed from the crane up before it, at most
     × 1.16); the copy builds 0.55 s earlier than it used to (all in by ~22.57); the holding shape follows the camera a
     little more on the way in (0.75, was 0.6), so it slows under the probe's limit sooner; and the lift starts at the
     key instant (below). The window ends as the card's lift and the camera's drift together pass 350 px/s (~23.5).
   · The holding shape wipes open (v1 holdIn) at key − 1.45 and its lines swipe in; the card grows in from its left edge
     (v1: scale 0.85 → 1, back.out) at key − 1.4 and its lines swipe in (0.6 s, 0.06 apart). (Were key − 0.9 / − 0.85
     before the reading-time work.) Both build as the camera slows onto the board and are all in by ~22.57, so they read
     through the slow window. The card's lines are their own layer 0.6 units in front of the card ("lines in layers")
     and settle back onto it as they swipe (frame 7's Z moment).
     While they build, the whip still carries the world fast, so on the way in their place is blended partway (the card
     0.6, the holding shape 0.75, both gone by the key instant) toward riding in the camera's view (review: v1's swipes
     barely read on a card sliding that fast), and they still show the whip.
   · They hover (hover(), below): a slow float in 3D (a few px, a little in depth, under a degree of tilt), zero at the
     key instant, so at 23.3 they sit on their board places (0–2 px) and are never dead still around it. From the key
     instant the card lifts 62 px over 0.47 s (key → key + 0.47, a smootherstep: nothing at the key, at most ~250 px/s,
     done by 23.77) as the camera pulls back, so its lower-left corner clears the sphere (review: it cut up to ~35 px
     into the sphere at 23.6–23.95). It clears it by ≥ 14.7 px (at 23.73).
   · The copy shapes wear the board's colours: the card's gradient is fitted to board 7 (orange at the left, violet in
     the middle, pink at the right, a blue pool low in the middle) and the holding shape's fill and frame to boards 7, 8,
     10 and 11 (a 110° blue-violet fill; a frame that is orange down the sides and violet across the middle of the top and
     bottom). Both keep flowing ("living gradients"), locked so they show the board's colours at the key instant.
   · No exit animation (user, 2026-09-28 00:30: no transition-outs, "the camera … hides them"; and 21:50: the left panel
     should "move the same way the right panel does, off screen", not cross the screen to be reused): both simply stay in
     the world, floating, and as the camera pulls back and swings right after the slow window they slide away off the
     left edge with parallax (the nearer holding shape first, gone by ~24.9; the card and its lines by ~25.6). No
     recede, no fade any more. They switch off at hold end + 2.0 (25.8), once off screen, before frame 8's copy
     (from 26.8). Nothing carries to frame 8: c08.js builds its own holding shape, in from the right.
   · The holding shape's outline is the boards' own (refit 2026-09-29, polish backlog: "holding-shape outer edges sit 2–4
     px inside the boards (refit 7–15 together)"): 603.6 × 304.2 with an 8 px frame and 82 px corners, on each board's
     measured place (HOLD, below; it was 596 × 300, a 6 px frame, 70 px corners, 0.5–5 px inside the boards' edges). Its
     words keep their size and place; at the key instants of 7, 8, 10, 11, 12, 14 and 15 every outer edge now sits within
     ~0.6 px of its board's.
   Also exports the helpers the other copy files share (kit): v1's type metrics, lines fitted to the board's type, the
   swipe, the counting numbers, the holding shape's colours (holdBg, HOLD_FRAME) and outline (HOLD, holdCss(), holdClip()),
   holdingShape() and hover(). */

/* ---------- the kit ---------- */
// (the words and pictures come from content/copy.json through content.js; an edited line or number is drawn by fitEdit()
// and fitNum() with auto-fit; one as built takes exactly the path it always did)
import { contentFor, grow, inkRuns, fillRuns, shrinkK, noteFit, EDGE, watchPic, picCss } from './content.js';
export { contentFor, grow, watchPic, picCss };
// v1's type metrics: FONT.cc[w] is where the cap centre sits in a line-height-1 box, FONT.base[w] the baseline
// (measured once the face has loaded)
export const FONT = { cc: { b: 0.52, l: 0.52 }, cap: { b: 0.714, l: 0.714 }, base: { b: 0.86, l: 0.86 } };
const WT = { b: 800, l: 300 };
const LINES = [], NUMS = [];
let ctx = null;
const inkOf = (text, w, fs, ls) => {                                 // the ink box of a line of text (canvas metrics)
  ctx.font = `${WT[w]} ${fs}px "new-hero", "Open Sans", sans-serif`; ctx.letterSpacing = `${ls}px`;
  const m = ctx.measureText(text); return { l: m.actualBoundingBoxLeft, r: m.actualBoundingBoxRight, a: m.actualBoundingBoxAscent, d: m.actualBoundingBoxDescent };
};
function measure() {
  ctx = document.createElement('canvas').getContext('2d');
  for (const w of ['b', 'l']) {
    ctx.font = `${WT[w]} 100px "new-hero"`; ctx.letterSpacing = '0px';
    const m = ctx.measureText('H'), base = (100 - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
    FONT.cc[w] = (base - m.actualBoundingBoxAscent / 2) / 100; FONT.cap[w] = m.actualBoundingBoxAscent / 100; FONT.base[w] = base / 100;
  }
}
/* Fit a line to the board's type (measured from the board at 1920 px): L = the ink's left edge, cy = its cap centre,
   W = the ink width, and optionally H = its height (cap height, or the digits' full height for a number: Hk 'ink').
   Without H the size is fitted to the width (the board's tracking matches New Hero's); with H the size comes from the
   height and the tracking from the width (the board sets its DB-06 lines tighter than the face). */
function fit(Ln) {
  if (Ln.s.edit) return fitEdit(Ln);
  const s = Ln.s, n = [...s.text].length, L = typeof s.L === 'function' ? s.L() : s.L;
  let fs, ls = 0;
  if (s.H) {
    const m = inkOf(s.text, s.w, 100, 0);
    fs = s.Hk === 'ink' ? 100 * s.H / (m.a + m.d) : s.H / FONT.cap[s.w];
    if (s.lsEm != null) ls = s.lsEm * fs;
    else { const m2 = inkOf(s.text, s.w, fs, 0); ls = (s.W - (m2.l + m2.r)) / (n - 1); }
  } else { const m = inkOf(s.text, s.w, 100, 0); fs = 100 * s.W / (m.l + m.r); }
  const m = inkOf(s.text, s.w, fs, ls);
  Ln.fs = fs; Ln.ls = ls; Ln.inkR = L + m.l + m.r;
  Object.assign(Ln.d.style, { left: `${(L + m.l - Ln.host.ox).toFixed(2)}px`, top: `${(s.cy - FONT.cc[s.w] * fs - Ln.host.oy).toFixed(2)}px`, fontSize: `${fs.toFixed(2)}px` });
  Object.assign(Ln.sp.style, { letterSpacing: `${ls.toFixed(2)}px`, paddingRight: `${Math.max(0, -ls).toFixed(2)}px` });   // (so a tight last glyph isn't clipped)
}
/* An edited line (content/copy.json): the size and tracking the line has as built (from its text as built, exactly as
   fit() works them out, or s.fs for a v1-style line), the edited words at that size, shrunk only if they would run past
   the edge of the line's area (s.edit.maxR: its holding shape's or card's inside, else its layer's box), keeping its left
   edge, or its centre for a line the board centres (s.edit.align). s.org: L is the text box's left (a v1-style line),
   not the ink's; s.top: the v1-style line box top at the size as built (its cap centre is kept). s.ref [{ text, w, W }]: a
   line the board sets word by word (each word fitted to its own box: tight letters, wide gaps): the letters take the words'
   average tracking, and the word gaps are fitted so the line as built spans W. */
function fitEdit(Ln) {
  const s = Ln.s, e = s.edit, L = typeof s.L === 'function' ? s.L() : s.L, R0 = e.sizeRuns, n0 = R0.reduce((k, u) => k + [...u.text].length, 0);
  let fs, ls = 0, ws = 0;
  if (s.fs) fs = s.fs;
  else if (s.H) {
    fs = s.H / FONT.cap[s.w];
    if (s.ref) {
      let d = 0, n = 0;
      for (const r of s.ref) { const k = [...r.text].length; if (k > 1) { d += r.W - inkRuns([{ text: r.text, w: r.w || s.w }], fs, 0).w; n += k - 1; } }
      const sp = R0.reduce((k, u) => k + (u.text.match(/ /g) || []).length, 0);
      ls = n ? d / n : 0;
      if (sp) ws = (s.W - inkRuns(R0, fs, ls).w) / sp;
    } else ls = s.lsEm != null ? s.lsEm * fs : (s.W - inkRuns(R0, fs, 0).w) / Math.max(1, n0 - 1);
  } else fs = 100 * s.W / inkRuns(R0, 100, 0).w;
  const fs0 = fs, host = Ln.host, c = L + (s.W || 0) / 2;
  const k = shrinkK(e.runs, fs, ls, { L, maxR: e.maxR ?? (host.ow != null ? Math.min(EDGE[1], host.ox + host.ow) : EDGE[1]), minL: e.minL ?? host.ox, align: e.align, c, ws, entry: e.entry });
  fs *= k; ls *= k; ws *= k;
  if (ws) Ln.sp.style.wordSpacing = `${ws.toFixed(2)}px`;
  const m = inkRuns(e.runs, fs, ls, undefined, ws), inkL = e.align === 'center' ? c - m.w / 2 : s.org ? L - m.l : L;
  const top = s.top != null ? s.top + FONT.cc[s.w] * (fs0 - fs) : s.cy - FONT.cc[s.w] * fs;
  Ln.fs = fs; Ln.ls = ls; Ln.inkR = inkL + m.w;
  Object.assign(Ln.d.style, { left: `${(inkL + m.l - host.ox + (Ln.dx || 0)).toFixed(2)}px`, top: `${(top - host.oy).toFixed(2)}px`, fontSize: `${fs.toFixed(2)}px` });
  Object.assign(Ln.sp.style, { letterSpacing: `${ls.toFixed(2)}px`, paddingRight: `${Math.max(0, -ls).toFixed(2)}px` });
}
/* Fit a counting number (board 8's 90+ / 150+): New Hero ExtraBold digits sized so the final value's digits run from ink
   top `top` to baseline `base` (board px), their ink starting at L, tracked lsEm; then the board's small, low plus (plusEm
   of the digits' size, sitting on the baseline, `gap` px after the last digit's ink). The digits are right-aligned in a
   box exactly as wide as the final value's, so the plus never moves while the number counts (a wider value, e.g. 100,
   spills a few px to the left instead of pushing into the next line). */
function fitNum(N, k = 1) {
  // (an edited number, s.edit from content.js: its own digits and suffix at the size as built, shrunk by k if they'd run
  // past the edge of its area; the digits' height is the same whatever they are)
  const s = N.s, e = s.edit, dig = e ? e.digits : s.digits, fs = k * 100 * (s.base - s.top) / inkOf(s.digits, 'b', 100, 0).a, ls = s.lsEm * fs;
  const probe = document.createElement('span');                     // the digits' box width, as CSS lays them out
  probe.style.cssText = `position:absolute;left:-9999px;top:0;visibility:hidden;white-space:nowrap;font:800 ${fs}px "new-hero","Open Sans",sans-serif;letter-spacing:${ls}px`;
  probe.textContent = dig; document.body.appendChild(probe); const W = probe.getBoundingClientRect().width; probe.remove();
  const m = inkOf(dig, 'b', fs, ls), left = s.L + m.l, pm = inkOf(e ? e.suffix : '+', 'b', fs * s.plusEm, 0);
  const inkR = left + m.r;                                           // the last digit's ink right edge
  Object.assign(N.dg.style, { width: `${W.toFixed(2)}px`, letterSpacing: `${ls.toFixed(2)}px` });
  Object.assign(N.pl.style, { fontSize: `${s.plusEm}em`, marginLeft: `${(inkR + k * s.gap - (left + W) + pm.l).toFixed(2)}px` });
  // where CSS puts the digits' baseline in this very structure (the mask's own strut sits it ~0.025 em lower than the
  // face's line-height-1 box alone): a copy of the number, off screen, with a zero-height mark on the baseline
  const host = document.createElement('div'); host.className = 'super'; host.style.cssText = 'left:-9999px;top:0;visibility:hidden';
  const cp = N.d.cloneNode(true); Object.assign(cp.style, { left: '0px', top: '0px', fontSize: `${fs}px` });
  const mk = document.createElement('i'); mk.style.cssText = 'display:inline-block;width:1px;height:0'; cp.firstElementChild.firstElementChild.appendChild(mk);
  host.appendChild(cp); document.body.appendChild(host);
  const B = mk.getBoundingClientRect().top - host.getBoundingClientRect().top; host.remove();
  Object.assign(N.d.style, { left: `${(left - N.host.ox).toFixed(2)}px`, top: `${(s.base - B - N.host.oy).toFixed(2)}px`, fontSize: `${fs.toFixed(2)}px` });
  N.fs = fs; N.inkR = inkR + k * s.gap + pm.l + pm.r;                // (the plus's ink right edge)
  if (e) noteFit(e.entry, k);                                        // (for the report; a shrink below overwrites it)
  if (e && k === 1) {                                                // an edited number that would run past its area's edge
    const maxR = Math.min(EDGE[1], e.maxR ?? (N.host.ow != null ? N.host.ox + N.host.ow : EDGE[1]));
    if (N.inkR > maxR && N.inkR > s.L) fitNum(N, (maxR - s.L) / (N.inkR - s.L));
  }
}
let fontP = null;
export function kit(V) {
  // (400 too: a number's mask is in the page's default weight, and fitNum() measures where CSS puts its baseline, which
  // depends on that face; measured while it was still loading, frame 8's 90+ / 150+ came out 4–5 px low on some loads)
  if (!fontP) V.waitFor(fontP = Promise.all([800, 300, 400].map(w => document.fonts.load(`${w} 100px "new-hero"`))).then(() => { measure(); LINES.forEach(fit); NUMS.forEach(N => fitNum(N)); }));   // (holds the first render until the lines are fitted)
  const K = {
    /* a layer: a box [x, y, w, h] in stage px, laid out in hold n's view at `depth` (see V.copyLayer); its children use
       stage px minus the box origin */
    layer(n, [x, y, w, h], depth) {
      const el = document.createElement('div'); el.className = 'super'; el.style.width = `${w}px`; el.style.height = `${h}px`;
      const o = V.copyLayer(n, el, { at: [x + w / 2, y + h / 2], depth });
      return Object.assign(o, { ox: x, oy: y, ow: w });                // (ow: an edited line's area ends at the layer's right edge by default)
    },
    /* a super line (v1's .line: a mask with the text span inside, the span is what swipes). s.edit (content.js): edited
       words, drawn as runs of bold / light and fitted by fitEdit() */
    line(host, s) {
      const d = document.createElement('div'); d.className = 'txt line';             // (index.html's .line: the mask's style)
      const sp = document.createElement('span'); sp.className = s.w;
      if (s.edit) fillRuns(sp, s.edit.runs); else sp.textContent = s.text;
      d.appendChild(sp); host.el.appendChild(d);
      const Ln = { host, s, d, sp }; LINES.push(Ln); if (ctx) fit(Ln);
      sp.ln = Ln;                                                      // (its fit: fs, ls, inkR)
      return sp;
    },
    /* a counting number (see fitNum): returns the span that swipes, with .set(n) to show a value */
    number(host, s) {
      const d = document.createElement('div'); d.className = 'txt line num';         // (index.html's .line.num: room on the left)
      const sp = document.createElement('span'); sp.className = 'b';
      const e = s.edit;                                                // (an edited number: content.js's num())
      const dg = document.createElement('span'); dg.style.cssText = 'display:inline-block;text-align:right'; dg.textContent = e ? e.digits : s.digits;
      const pl = document.createElement('span'); pl.textContent = e ? e.suffix : '+';
      sp.append(dg, pl); d.appendChild(sp); host.el.appendChild(d);
      const N = { host, s, d, sp, dg, pl }; NUMS.push(N); if (ctx) fitNum(N);
      if (!e) sp.set = n => { const v = String(Math.round(n)); if (dg.textContent !== v) dg.textContent = v; };
      else if (!Number.isFinite(e.value)) sp.set = () => {};           // (not a number: shown as it is, no count)
      else sp.set = n => { const r = Math.round(n), v = e.commas ? r.toLocaleString('en-US') : String(r); if (dg.textContent !== v) dg.textContent = v; };
      sp.to = e ? e.value : +s.digits;                                 // what it counts up to
      sp.num = N;
      return sp;
    },
    /* after the fonts are in and every line is fitted (for grow()), and a line's fit redone (its spec changed) */
    get ready() { return fontP; },
    refit: sp => { if (ctx && sp && sp.ln) fit(sp.ln); },
    /* v1's swipe: each line wipes open left to right while sliding in 60 px */
    swipe(els, t, st = 0.2, dur = 0.7) {
      gsap.set(els, { clipPath: 'inset(0% 100% 0% 0%)', x: -60 });
      V.copyTL.fromTo(els, { clipPath: 'inset(0% 100% 0% 0%)', x: -60 }, { clipPath: 'inset(0% 0% 0% 0%)', x: 0, duration: dur, ease: 'power3.out', stagger: st, immediateRender: false }, t);
    },
    // v1's living gradient on the copy shapes (Medium flow): background-position drifts 5–95%
    osc: (t, per, ph) => 0.5 * (Math.sin((t / per) * 6.2832 + ph) - Math.sin(ph)),
  };
  return K;
}

/* ---------- the copy shapes' colours (fitted to the boards) ---------- */
const stops = (S, d = 0) => S.map(([p, c]) => `${c} ${(p + d).toFixed(2)}%`).join(',');
// The holding shape (boards 7, 8, 10 and 11 draw the same one): a 110° blue-violet fill (mean error 4 on 0–255) inside a
// 6 px frame that is orange down the sides and round the corners, violet across the middle of the top and bottom (the
// same frame as board 3's PTP card, whose stops c03.js fitted). d shifts the fill's stops (the living flow, in %).
export const HOLD_FILL = [[0, '#6000fe'], [12.5, '#5100d6'], [25, '#4203ac'], [37.5, '#31057a'], [50, '#250857'], [62.5, '#27085a'], [75, '#2e086e'], [87.5, '#39068b'], [100, '#4d01c1']];
export const HOLD_FRAME = 'linear-gradient(90deg,#fb7418 0%,#f47324 4%,#c9524c 9%,#9d396f 15%,#74209a 22%,#6a1b9e 30%,#621aa4 50%,#5310b4 66%,#4d05b8 76%,#7c238d 82%,#a44269 89%,#e27030 97%,#e8722a 100%) border-box';
export const holdBg = d => `linear-gradient(110deg,${stops(HOLD_FILL, d)}) padding-box,${HOLD_FRAME}`;
// The living fills and the Gradient flow slider (the player's; user, 2026-09-29, of v1's slider: "yes, add it overnight"):
// the copy's fills follow it as v1's did. flowFill() → { a, s }: a = min(flow, 1) scales how far a fill drifts (Off holds
// the board's fill; they drift no further than at Medium), s is the engine's clock speed (window.v2.flowSpeed: 1 up to
// Bold, faster past it). liveFill(t, tk, A, P) = a · A · sin(2π (t − tk) · s / P): the board's fill at the key instant tk,
// exactly as built at Medium. (The hover, the copy's float in 3D, is motion, not a fill: it never follows the slider.)
export const flowFill = () => { const v = typeof window !== 'undefined' && window.v2, f = v && typeof v.flow === 'number' ? v.flow : 1;
  return { a: Math.min(f, 1), s: v && typeof v.flowSpeed === 'number' ? v.flowSpeed : 1 }; };
export const liveFill = (t, tk, A, P) => { const k = flowFill(); return k.a * A * Math.sin(6.2832 * (t - tk) * k.s / P); };
/* The holding shape's outline (boards 7, 8, 10, 11, 12, 14 and 15 all draw the same one), refit to the boards on
   2026-09-29 (polish backlog: "holding-shape outer edges sit 2–4 px inside the boards (refit 7–15 together)"). Measured
   at 1920 px on storyboard.pdf's own 1920-px rasters, registered to assets/board (to ~0.25 px), at each key instant: every
   board's shape is 603.6 × 304.2 on its outer edge, with a frame 8.4 px wide on every side (the fill's edge 587 × 287.5)
   and outer corners of radius ~82.5 (inner ~72.7). It was 596 × 300 (596 × 296 on 14) with a 6 px frame and 70 px corners
   (index.html's .hold): its outer edges sat 0.5–5 px inside the boards' (median ~3) and its corners were visibly tighter.
   Now: 603.6 × 304.2, an 8 px frame (Chrome draws a border in whole pixels, so the board's 8.4 would come out 8 anyway; the
   fill's edge sits 0.4 px outside the board's) and 82 px corners (the board's outer and inner corners within ~0.5 px).
   The words are not part of the shape and don't move: each file keeps its lines' board places and its layer as it was,
   and places the shape on its board's measured centre inside that layer. holdCss() is the shape's style (left / top in
   its layer's px), holdClip() the wipe-open clip (v1's holdIn) with the shape's own corners (it was round 70px, the old
   radius). grow() is given this outline, so edited words still widen the shape from its new edges. */
export const HOLD = { w: 603.6, h: 304.2, fw: 8, r: 82 };
export const holdCss = (left, top) => `left:${left.toFixed(2)}px;top:${top.toFixed(2)}px;width:${HOLD.w}px;height:${HOLD.h}px;border-width:${HOLD.fw}px;border-radius:${HOLD.r}px;background:${holdBg(0)}`;
export const holdClip = right => `inset(0% ${right}% 0% 0% round ${HOLD.r}px)`;
// Board 7's card (mean error 5): a 90° ramp orange → violet → pink under a blue pool (an ellipse 700 × 350 px centred low
// in the middle of the card, fully blue at its centre, clear at its rim). dx / dy move the pool, d shifts the ramp (in %).
const CARD_RAMP = [[0, '#f87c04'], [12.5, '#f77f05'], [25, '#d5684e'], [37.5, '#9844d1'], [50, '#8833ed'], [62.5, '#a635d8'], [75, '#d946a7'], [87.5, '#fb4f87'], [100, '#ff4e81']];
const cardBg = (d, dx, dy) => `radial-gradient(700px 350px at ${(475 + dx).toFixed(1)}px ${(429 + dy).toFixed(1)}px,rgba(80,0,255,1),rgba(80,0,255,0)),linear-gradient(90deg,${stops(CARD_RAMP, d)})`;

/* ---------- the hover: copy that is never dead still (user, 21:50: it "hovers subtly in 3D") ---------- */
const D2R = Math.PI / 180;
const LIVE = { C: null, Q: null, t: 0 };                               // the live camera (read as the scene renders) and the time
function hookLive(V) {
  if (LIVE.C) return;
  LIVE.C = new V.THREE.Vector3(); LIVE.Q = new V.THREE.Quaternion();
  V.anim(t => { LIVE.t = t; });
  const prev = V.scene.onBeforeRender;                                 // runs after this frame's camera is set, before the copy is placed
  V.scene.onBeforeRender = function (r, sc, cam, ...rest) {
    if (prev) prev.call(this, r, sc, cam, ...rest);
    cam.getWorldPosition(LIVE.C); cam.getWorldQuaternion(LIVE.Q);
  };
}
/* hover(V, layers, { tk, seed, amp, tilt, zAmp, per, st, beta }): each layer's place and turn, worked out as the copy is
   placed every render (after copyTL is seeked, so tweened values are current). The engine reads a layer's hold (o.H: at(),
   fwd, q) each render, so each layer gets its own wrapped hold:
   · a slow float: x / y in board px (amp, amp × 0.8), a push along the view (zAmp × the layer's depth) and tilts about the
     layer's own centre (tilt × 0.8 about x, tilt about y, degrees), each sin(2π (t − tk) / P) on its own period (per scales
     them, ~5–8 s; seed varies periods and directions), so the layer is exactly on its board place at the key instant tk
     and moving through it. Layers given together share one float (a block that hovers as one).
   · st (optional): an object tweened on copyTL with { x, y (board px), z (world units along the view), rx, ry (degrees) }
     added on top, for entrances and exits in 3D.
   · beta(t) (optional): a blend of the layer's world place toward where it would sit riding in the live camera's view (the
     same screen spot at the same distance): 0 = in the world, 1 = fixed to the lens. The camera is on the hold's exact pose
     at tk, so the blend changes nothing there; around it the copy keeps (1 − beta) of the world's motion on screen and
     still faces its hold's view (a turning camera shows it in perspective). Only the place (and the push axis) is blended.
   The layers must be laid out in one hold's view (V.copyLayer / kit layers of that frame). */
export function hover(V, layers, { tk, seed = 0, amp = 6, tilt = 1, zAmp = 0.012, per = 1, st = null, beta = null } = {}) {
  hookLive(V);
  const { THREE } = V, rnd = k => { const x = Math.sin(seed * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const T = [[amp, 6.1], [amp * 0.8, 4.7], [zAmp, 7.3], [tilt * 0.8, 5.3], [tilt, 8.1]].map(([a, p], k) => [a, p * per * (0.85 + 0.3 * rnd(k)), rnd(k + 7) < 0.5 ? -1 : 1]);
  const e = new THREE.Euler(), qr = new THREE.Quaternion(), R = new THREE.Quaternion(), cf = new THREE.Vector3(), f2 = new THREE.Vector3();
  for (const o of layers) {
    const H0 = o.H, H = Object.create(H0), q = H0.q.clone(), fw = H0.fwd.clone(), hqi = H0.q.clone().invert();
    H.at = (x, y, d) => {
      const s = LIVE.t - tk, v = T.map(([A, P, sg]) => sg * A * Math.sin(6.2832 * s / P));
      const ox = v[0] + (st ? st.x || 0 : 0), oy = v[1] + (st ? st.y || 0 : 0), oz = v[2] * o.depth + (st ? st.z || 0 : 0);
      const rx = v[3] + (st ? st.rx || 0 : 0), ry = v[4] + (st ? st.ry || 0 : 0);
      const P = H0.at(x + ox, y + oy, d).addScaledVector(H0.fwd, oz);
      q.copy(H0.q).multiply(qr.setFromEuler(e.set(rx * D2R, ry * D2R, 0)));
      fw.copy(H0.fwd);
      const b = beta ? Math.min(1, Math.max(0, beta(LIVE.t))) : 0;
      if (b > 0) {
        R.copy(LIVE.Q).multiply(hqi);                                  // hold view → the live camera's view
        cf.copy(P).sub(H0.pos).applyQuaternion(R).add(LIVE.C);
        P.lerp(cf, b); fw.lerp(f2.copy(H0.fwd).applyQuaternion(R), b).normalize();
      }
      return P;
    };
    Object.defineProperty(H, 'q', { get: () => q });
    Object.defineProperty(H, 'fwd', { get: () => fw });
    o.H = H;
  }
}

/* ---------- the holding shape (boards 7, 8, 10 and 11 draw the same one) ---------- */
// Its layer is anchored so its TEXT sits on the board's text (c: the lines' place inside the shape differs by a few px
// between boards 7 and 8, and the text wins); the shape itself sits on the board's measured shape (box: its centre,
// board 7's and board 8's, measured on the outer edges; w × h: HOLD, the outline refit 2026-09-29; it was 596 × 300
// centred on (351.5, 187) and (1564, 202)).
export const BADGE = { w: HOLD.w, h: HOLD.h, c7: [349, 184.5], c8: [1563, 203.5], box7: [351.7, 187.75], box8: [1564.55, 202.8], pad: [660, 360],
  lines: [{ text: 'EXPANDED HER2:', w: 'l', dx: -223, dy: -32.5, W: 438 }, { text: 'ACTIVATED', w: 'b', dx: -227, dy: 30, W: 300 }] };
// EXPANDED HER2: ACTIVATED laid out in hold n's view at `depth`: returns { lay (the layer), panel (the shape), lines (spans) }.
// TX (content.js's contentFor(V, n)): its words come from content/copy.json (frame n's "panel"); it grows with edited words
export function holdingShape(V, K, n, c, box, depth, TX) {
  const [PW, PH] = BADGE.pad;
  const lay = K.layer(n, [c[0] - PW / 2, c[1] - PH / 2, PW, PH], depth);
  const panel = document.createElement('div'); panel.className = 'hold box';
  panel.style.cssText = holdCss(PW / 2 + box[0] - c[0] - BADGE.w / 2, PH / 2 + box[1] - c[1] - BADGE.h / 2);
  lay.el.appendChild(panel);
  const lines = BADGE.lines.map((l, i) => { const s = { text: l.text, w: l.w, L: c[0] + l.dx, cy: c[1] + l.dy, W: l.W }; return K.line(lay, TX ? TX.spec('panel', i, s) : s); });
  if (TX) grow(K.ready, { el: panel, box: [box[0] - BADGE.w / 2, box[1] - BADGE.h / 2, BADGE.w, BADGE.h], lines, refit: K.refit });
  return { lay, panel, lines };
}

/* ---------- frame 7 ---------- */
export default V => {
  const { holds, copyTL, anim } = V;
  const h7 = holds[7];
  if (!h7) throw new Error('c07: frame 7 needs a hold');
  const K = kit(V), tk = h7.tk, TX = contentFor(V, 7);                 // (TX: frame 7's words from content/copy.json)
  const D7 = h7.depth - 3;                                           // a little in front of the sphere (the set's front shapes)
  const DB = D7 - 1.2;                                               // the holding shape: nearer than the card and its lines

  /* --- the holding shape --- */
  const { lay: badge, panel, lines: hHer } = holdingShape(V, K, 7, BADGE.c7, BADGE.box7, DB, TX);

  /* --- the card (v1's #e-card) and its lines, a layer in front of it --- */
  const cBox = [905, 196, 775, 450];
  const card = K.layer(7, cBox, D7);
  const cardEl = document.createElement('div'); cardEl.className = 'card box';
  cardEl.style.cssText = `left:0;top:0;width:${cBox[2]}px;height:${cBox[3]}px;background:${cardBg(0, 0, 0)}`;
  card.el.appendChild(cardEl);
  const cardTx = K.layer(7, cBox, D7 - 0.6);
  const eCard = [
    { text: 'JANUARY 2025', w: 'l', L: 973, cy: 293.5, W: 410 },
    { text: 'FDA APPROVAL IN', w: 'b', L: 972, cy: 362, W: 646 },
    { text: 'HR+/HER2-LOW &', w: 'b', L: 972, cy: 446, W: 652 },
    { text: 'ULTRALOW mBC', w: 'b', L: 972, cy: 530, W: 579 }].map((s, i) => K.line(cardTx, TX.spec('card', i, s)));
  grow(K.ready, { el: cardEl, box: cBox, lines: eCard, side: 'right', refit: K.refit });   // (grows with edited words, to the right)

  /* --- in: from the key instant, as the camera slows onto the board (v1: holding shape f7 + 0.4, its lines + 0.8, card
     + 1.4, its lines + 1.7; here both build together, all in by ~22.57 for the reading time: see the header) --- */
  const TB = tk - 1.45, TC = tk - 1.4;                              // (all in by ~22.6; every build is at rest by tk)
  gsap.set(panel, { autoAlpha: 0 });
  copyTL.set(panel, { autoAlpha: 1 }, TB)
    .fromTo(panel, { clipPath: holdClip(100) }, { clipPath: holdClip(0), duration: 0.7, ease: 'expo.out', immediateRender: false }, TB);
  K.swipe(hHer, TB + 0.1, 0.1);
  gsap.set(cardEl, { scale: 0.85, autoAlpha: 0, transformOrigin: '0% 50%' });
  copyTL.fromTo(cardEl, { scale: 0.85, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.8, ease: 'back.out(1.3)', immediateRender: false }, TC);
  K.swipe(eCard, TC + 0.1, 0.06, 0.6);
  copyTL.fromTo(cardTx, { dz: -1.4 }, { dz: 0, duration: 0.9, ease: 'power3.out', immediateRender: false }, TC + 0.1);   // the lines settle onto the card

  /* --- hover: the holding shape and the card (with its lines) float on their own, both on their board places at 23.3;
     on the way in both are blended partway toward the camera's view (bIn: the card 0.6, bInB: the holding shape 0.75),
     and the card lifts after the key to clear the sphere (62 px, key → key + 0.47, smootherstep: see the header) --- */
  const sm = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
  const bIn = t => 0.6 * (1 - sm((t - tk + 0.55) / 0.5)), bInB = t => 0.75 * (1 - sm((t - tk + 0.55) / 0.5));
  const lift = { y: 0 }, smoother = u => u * u * u * (u * (6 * u - 15) + 10);
  copyTL.fromTo(lift, { y: 0 }, { y: -62, duration: 0.47, ease: smoother, immediateRender: false }, tk);
  hover(V, [badge], { tk, seed: 11, amp: 5, tilt: 0.9, beta: bInB });
  hover(V, [card, cardTx], { tk, seed: 12, amp: 6, tilt: 1.1, beta: bIn, st: lift });

  /* --- out: none. Both stay in the world and the camera's pull-back and swing right carry them off the left edge with
     parallax (off screen by ~25.6); they switch off once gone --- */
  const OFF = h7.t1 + 2.0;
  badge.show(TB - 0.05, OFF); card.show(TC - 0.05, OFF); cardTx.show(TC - 0.05, OFF);

  // living gradients, locked to the board at the key instant: the holding shape's fill drifts ±5 %, the card's ramp and
  // pool drift gently
  anim(t => {
    panel.style.background = holdBg(liveFill(t, tk, 5, 9));
    const k = flowFill(), w = 6.2832 * (t - tk) * k.s;
    cardEl.style.background = cardBg(k.a * 4 * Math.sin(w / 7), k.a * 35 * Math.sin(w / 9), k.a * 12 * Math.sin(w / 11));
  });
};
