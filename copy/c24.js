/* Copy · frame 24 (109.35 → 115.95 s; G5 → G6 cut at 115.15): at the left, two pills running in from the left edge,
   NEOADJUVANT: / DESTINY-BREAST11 (a blue → orange pill) & POST-NEOADJUVANT: / DESTINY-BREAST05 (a deep violet pill in
   front of it), joined by a small gradient disc with an "&"; at the right, two panels, 100+ (counts up) DB-11/05 TACTICS
   / APPROVED ON / DAYS 0-5, and 90+ (counts up) FROM / DAY 6+. v1's wording and moves (index.html, frame 24: the pills
   slide in from the left, the disc pops, the panels grow in from their right edge, every line swipes in, the numbers
   count up), placed in 3D in hold 24's view.
   · Type and shapes fitted to board 24 (measured on a 1920 px render of storyboard.pdf, aligned to the board image):
     every line by its ink left edge, cap centre, cap height and ink width (DB-11/05 TACTICS as three runs: the board sets
     '/0' tighter than New Hero); the numbers by their digits' ink (left, top, baseline, width) and their plus (the
     100+'s is small and low, the 90+'s full size); the shapes by their edges, and their gradients fitted to the board
     by least squares (mean error 0.4–7 on 0–255), flowing gently ("living gradients"), locked to the board at the key
     instant.
       pill A  −41…890 × 128…588, r 170 (only its top shows: pill B covers the rest)   pill B  6…877 × 406…715, r 130
       disc    centre 413.5, 408, r 55.5                                             panel 1  1225…2068 × 83…629, top corners r 260
       panel 2 1060…2000 × 629…862, cut away where board 24's arch stands in front of it (below), so it sits behind the
               arch as the board draws it.
   · Timing, all from hold 24, an ease-through (the NEW RULE: the camera never stops; it trucks in from 23, slows to ~3
     u/s through the key instant tk pushing in and drifting right, then tips down and pushes into the doorway): the build
     starts at slow window start − 0.5, as the landing's sweep slows, and is all in by ~window start + 0.45: the left
     group (pill A, its lines, the disc, pill B, its lines) and, a beat behind, the right group (panel 1, 100+ counting, its
     lines, panel 2, 90+ counting, FROM / DAY 6+). v1 spread the same build over 2.9 s; here it is compressed (swipes
     0.5 s, 0.07–0.08 s apart). It all reads whole to ~113.1 (~2 s), then the push carries it off (below).
   · 3D: the left group is a layer at hold 24's sphere depth − 3; the right panels stand deeper, at the sphere's depth −
     1 (near board 24's arch); the lines float 0.6 units in front of their shapes. "Lines in layers": 100+ is its own layer
     3 units in front of its panel, and frame 24's one Z moment: it pushes forward out of the depth as it swipes in and
     counts. The whole block HOVERS (c21.js's hover()): half of the camera's motion on the way in, three quarters after
     the key instant, with the lag capped at 250 px, so it drifts gently (≤ ~200 px/s) through the slow window instead
     of being swept off the edges by the push within ~0.5 s of the key (the lens is 26°). Panel 2 is cut away where board
     24's arch stands in front of it: the arch's outer circle (fitted to its edge: centre 867, 933, r 374, in the arch's
     face plane at the sphere's depth) is projected from the camera onto the panel every render, so the cut stays on the arch however the
     camera and the hover move.
   · NO EXIT (the COPY RULE, user 2026-09-28 00:30: no "alpha out or move away" where the camera hides the copy; the
     last pass faded the right panels at window end + 0.2 and the left group at + 0.35, so nothing was cropped at an
     edge): it all stays in the world, and the tip down and push into the doorway carry it off, which the user prefers
     to a fade. Its lag is capped, so once the push speeds up it moves and grows with the set (never faster; without
     the cap it would ride the lens into the doorway, still whole at the cut). 100+ leaves over the top first (~113.8),
     then the pills over the top left and the panels over the top right (all gone by ~114.4), then the doorway fills
     the frame and dips to the 115.15 cut (dip()). The layers exist until the slow window's end + 1.95 s (at the latest
     0.3 s before the cut). */
import { liveFill, kit, contentFor, grow } from './c07.js';
import { EDGE, noteFit } from './content.js';
import { hover, hoverBeta } from './c21.js';
import { mixedLine } from './c23.js';

const WT = { b: 800, l: 300 };
let ctx = null;
const inkOf = (text, w, fs, ls) => {
  ctx.font = `${WT[w]} ${fs}px "new-hero", "Open Sans", sans-serif`; ctx.letterSpacing = `${ls}px`;
  const m = ctx.measureText(text); return { l: m.actualBoundingBoxLeft, r: m.actualBoundingBoxRight, a: m.actualBoundingBoxAscent, d: m.actualBoundingBoxDescent };
};

/* A counting number (c08.js's approach, with the plus placed by its own ink box): New Hero ExtraBold digits sized so
   the final value's ink runs from `top` to the baseline `base`, starting at L and W wide (the tracking comes from W);
   the digits are right-aligned in a box as wide as the final value's, so the plus never moves while the number counts.
   The plus: its size from its ink height pH, its ink left at pL and its ink bottom at pB (board px).
   s.edit (content.js's num()): edited digits and suffix, at the size and tracking as built; the suffix keeps its gap
   after the digits, and the whole shrinks (k) only if it would run past its area's edge. */
function number(host, s) {
  const e = s.edit;
  const d = document.createElement('div'); d.className = 'txt line num';             // (index.html's .line.num: the mask's style)
  // (the mask is ExtraBold too, so its line's strut uses the face that is loaded before the fit: with the default
  // weight the strut's face could still be loading, and the measured baseline came out a few px off)
  d.style.fontWeight = '800';
  const sp = document.createElement('span'); sp.className = 'b';
  const dg = document.createElement('span'); dg.style.cssText = 'display:inline-block;text-align:right'; dg.textContent = e ? e.digits : s.digits;
  const pl = document.createElement('span'); pl.style.cssText = 'display:inline-block;position:relative'; pl.textContent = e ? e.suffix : '+';
  sp.append(dg, pl); d.appendChild(sp); host.el.appendChild(d);
  if (!e) sp.set = n => { const v = String(Math.round(n)); if (dg.textContent !== v) dg.textContent = v; };
  else if (!Number.isFinite(e.value)) sp.set = () => {};             // (not a number: shown as it is, no count)
  else sp.set = n => { const r = Math.round(n), v = e.commas ? r.toLocaleString('en-US') : String(r); if (dg.textContent !== v) dg.textContent = v; };
  sp.to = e ? e.value : +s.digits;                                   // what it counts up to
  sp.fit = (k = 1) => {
    const n = [...s.digits].length, fs0 = 100 * (s.base - s.top) / inkOf(s.digits, 'b', 100, 0).a;
    const m0 = inkOf(s.digits, 'b', fs0, 0), ls0 = (s.W - (m0.l + m0.r)) / (n - 1), fs = k === 1 ? fs0 : k * fs0, ls = k === 1 ? ls0 : k * ls0;
    const dig = e ? e.digits : s.digits;
    const probe = document.createElement('span');                   // the digits' box width, as CSS lays them out
    probe.style.cssText = `position:absolute;left:-9999px;top:0;visibility:hidden;white-space:nowrap;font:800 ${fs}px "new-hero","Open Sans",sans-serif;letter-spacing:${ls}px`;
    probe.textContent = dig; document.body.appendChild(probe); const W = probe.getBoundingClientRect().width; probe.remove();
    const m = inkOf(dig, 'b', fs, ls), left = s.L + m.l;             // the digits' origin (ink left at L)
    const p1 = inkOf('+', 'b', 100, 0), pfs = (k === 1 ? 1 : k) * 100 * s.pH / (p1.a + p1.d), pm = inkOf(e ? e.suffix : '+', 'b', pfs, 0);
    // (edited: the suffix keeps its gap after the digits' ink, and its ink bottom's height over the baseline, scaled by k)
    const pL = e ? left + m.r + k * (s.pL - (s.L + s.W)) : s.pL, pB = e ? s.base - k * (s.base - s.pB) : s.pB;
    Object.assign(dg.style, { width: `${W.toFixed(2)}px`, letterSpacing: `${ls.toFixed(2)}px` });
    // the plus's origin goes where its ink starts at pL; vertically it sits on the digits' baseline, moved so its ink
    // bottom lands on pB (its ink bottom is −d below the baseline)
    Object.assign(pl.style, { fontSize: `${(pfs / fs).toFixed(4)}em`, marginLeft: `${(pL - (left + W) + pm.l).toFixed(2)}px`, top: `${(pB - (s.base + pm.d)).toFixed(2)}px` });
    // where CSS puts the digits' baseline in this very structure: a copy of the number off screen, with a zero-height
    // mark on the baseline (c07.js's fitNum does the same)
    const hostC = document.createElement('div'); hostC.className = 'super'; hostC.style.cssText = 'left:-9999px;top:0;visibility:hidden';
    const cp = d.cloneNode(true); Object.assign(cp.style, { left: '0px', top: '0px', fontSize: `${fs}px` });
    const mk = document.createElement('i'); mk.style.cssText = 'display:inline-block;width:1px;height:0'; cp.firstElementChild.firstElementChild.appendChild(mk);
    hostC.appendChild(cp); document.body.appendChild(hostC);
    const B = mk.getBoundingClientRect().top - hostC.getBoundingClientRect().top; hostC.remove();
    Object.assign(d.style, { left: `${(left - host.ox).toFixed(2)}px`, top: `${(s.base - B - host.oy).toFixed(2)}px`, fontSize: `${fs.toFixed(2)}px` });
    if (e) noteFit(e.entry, k);                                      // (for the report; a shrink below overwrites it)
    if (e && k === 1) {                                              // an edited number that would run past its area's edge
      const R = pm.l + pm.r > 0 ? pL + pm.l + pm.r : left + m.r, maxR = Math.min(EDGE[1], e.maxR ?? host.ox + host.ow);
      if (R > maxR && R > s.L) sp.fit((maxR - s.L) / (R - s.L));
    }
  };
  return sp;
}

/* ---------- the copy shapes' colours (fitted to board 24; d shifts the stops, in %: the living flow) ---------- */
const stops = (S, d = 0) => S.map(([p, c]) => `${c} ${(p + d).toFixed(2)}%`).join(',');
const ramp = s => s.split(',').map(x => { const [c, p] = x.trim().split(' '); return [parseFloat(p), c]; });
const PILL_A = ramp('#1200ff 0%,#460dff 12.5%,#5819fe 25%,#7225ff 37.5%,#a03fce 50%,#d35c57 62.5%,#fa8208 75%,#ff9000 87.5%,#fe9602 100%');   // 74°
const PILL_B = ramp('#260858 0%,#2f0770 25%,#380689 50%,#4205a1 75%,#4b04ba 100%');                                                                // 90°
const DISC = ramp('#ff6868 0%,#dc4ca9 25%,#8631e9 50%,#580dff 75%,#2b00ff 100%');                                                                  // 140°
const PANEL1 = ramp('#3a02ff 0%,#4001ff 10%,#4600ff 20%,#5402ff 30%,#6d0bf6 40%,#7a11ea 50%,#8722dd 60%,#a43bab 70%,#cb5455 80%,#ea6a18 90%,#ff8100 100%');   // 140°
const PANEL2 = ramp('#851dff 0%,#7516fa 12.5%,#650fe2 25%,#5d0bd6 37.5%,#5508c9 50%,#4b03bd 62.5%,#6013a4 75%,#822a87 87.5%,#d56536 100%');                // 100°
const grad = (deg, S, d) => `linear-gradient(${deg}deg,${stops(S, d)})`;

export default V => {
  const { holds, copyTL, win, anim } = V;
  const h24 = holds[24];
  if (!h24) throw new Error('c24: frame 24 needs a hold');
  const K = kit(V), TX = contentFor(V, 24);                          // (TX: frame 24's words from content/copy.json)
  const [f24] = win(24);
  const DL = h24.depth - 3, DR = h24.depth - 1;                      // the left group; the right panels (near the arch)

  /* --- the shapes (stage px) --- */
  const shape = (host, [x0, y0, x1, y1], css) => {
    const el = document.createElement('div'); el.className = 'box';
    el.style.cssText = `position:absolute;left:${(x0 - host.ox).toFixed(1)}px;top:${(y0 - host.oy).toFixed(1)}px;width:${x1 - x0}px;height:${y1 - y0}px;${css}`;
    host.el.appendChild(el); return el;
  };
  const LS = K.layer(24, [-60, 110, 960, 620], DL);                  // the pills and the disc
  const pillA = shape(LS, [-41, 128, 890, 588], 'border-radius:170px');
  const pillB = shape(LS, [6, 406, 877, 715], 'border-radius:130px');
  const disc = shape(LS, [358, 352.5, 469, 463.5], 'border-radius:50%');
  const RS = K.layer(24, [1040, 60, 980, 820], DR);                  // the panels (they run off the right edge)
  const pan1 = shape(RS, [1225, 83, 2068, 629], 'border-radius:260px 260px 0 0');
  const cut = `radial-gradient(circle at ${867 - 1060}px ${933 - 629}px,transparent 374px,#000 375px)`;   // board 24's arch, in front of panel 2
  const pan2 = shape(RS, [1060, 629, 2000, 862], `-webkit-mask-image:${cut};mask-image:${cut}`);
  const paint = d => {
    pillA.style.background = grad(74, PILL_A, d); pillB.style.background = grad(90, PILL_B, 0.6 * d); disc.style.background = grad(140, DISC, d);
    pan1.style.background = grad(140, PANEL1, d); pan2.style.background = grad(100, PANEL2, 0.6 * d);
  };
  paint(0);
  const tk = h24.tk;

  /* --- the lines (the board's type at 1920 px: L = ink left, cy = cap centre, W = ink width, H = cap height) --- */
  const LT = K.layer(24, [60, 170, 860, 490], DL - 0.6);
  const lA = [K.line(LT, TX.spec('left', 0, { text: 'NEOADJUVANT:', w: 'l', L: 97, cy: 219, W: 507, H: 49.5 })),
    K.line(LT, TX.spec('left', 1, { text: 'DESTINY-BREAST11', w: 'b', L: 95, cy: 299.5, W: 647, H: 49 }))];
  const amp = K.line(LT, TX.spec('left', 2, { text: '&', w: 'l', L: 394, cy: 406, W: 41 }));
  const lB = [K.line(LT, TX.spec('left', 3, { text: 'POST-NEOADJUVANT:', w: 'l', L: 97, cy: 528, W: 703, H: 49 })),
    K.line(LT, TX.spec('left', 4, { text: 'DESTINY-BREAST05', w: 'b', L: 95, cy: 608.5, W: 676, H: 49 }))];
  // (the pills grow to the right with edited words: their text areas as built are x ≤ 850 and ≤ 837)
  grow(K.ready, { el: pillA, box: [-41, 128, 931, 460], lines: lA, side: 'right', margin: 40, limit: [0, 1010], refit: K.refit });   // (clear of the right panels)
  grow(K.ready, { el: pillB, box: [6, 406, 871, 309], lines: lB, side: 'right', margin: 40, limit: [0, 1010], refit: K.refit });
  const RT = K.layer(24, [1330, 380, 560, 440], DR - 0.6);
  // (the board sets '/0' tighter than New Hero does: the line is three runs, each fitted to its own ink box, swiping as one)
  // (an edited DB-11/05 TACTICS is one kit line at its cap height, its letters tracked as the board's words on average and its word gap as the board's)
  const s1 = TX.spec('right', 0, { text: 'DB-11/05 TACTICS', w: 'l', L: 1367, cy: 421.5, W: 475, H: 43, ref: [['DB-11/', 161], ['05', 65], ['TACTICS', 225]].map(([text, W]) => ({ text, W })) }, undefined, { mixed: true });
  const l1 = [s1.edit ? K.line(RT, s1) : mixedLine(K, RT, [['DB-11/', 1367, 161], ['05', 1531, 65], ['TACTICS', 1617, 225]]
    .map(([text, L, W]) => ({ text, w: 'l', L, cy: 421.5, W, H: 43 })), [1340, 386, 540, 72]),
    K.line(RT, TX.spec('right', 1, { text: 'APPROVED ON', w: 'l', L: 1362, cy: 492.5, W: 409, H: 43 })),
    K.line(RT, TX.spec('right', 2, { text: 'DAYS 0-5', w: 'l', L: 1367, cy: 563, W: 246, H: 44 }))];
  const n90 = number(RT, TX.numSpec('numbers', 1, { digits: '90', L: 1363, top: 677, base: 725, W: 82, pH: 38, pL: 1451, pB: 721 }, undefined, { maxR: 1490 }));   // (clear of FROM)
  const l2 = [K.line(RT, TX.spec('right', 3, { text: 'FROM', w: 'l', L: 1514, cy: 702, W: 179, H: 46 })),
    K.line(RT, TX.spec('right', 4, { text: 'DAY 6+', w: 'l', L: 1368, cy: 778, W: 213, H: 46 }))];
  const NL = K.layer(24, [1330, 180, 540, 220], DR - 3);             // 100+, its own layer in front of panel 1
  const n100 = number(NL, TX.numSpec('numbers', 0, { digits: '100', L: 1368, top: 208, base: 370, W: 372, pH: 77, pL: 1747, pB: 362 }));
  V.waitFor(Promise.all([800, 300].map(w => document.fonts.load(`${w} 100px "new-hero"`))).then(() => {
    ctx = document.createElement('canvas').getContext('2d'); n100.fit(); n90.fit();
  }));

  // the counters (v1: 0 → 100 and 0 → 90, power2.out, from the swipe): the tween drives the number's setter
  const counter = (sp, to, t, dur) => {
    if (!Number.isFinite(to)) return;                                 // (an edited number that isn't one: shown as it is)
    const c = { v: 0, get n() { return this.v; }, set n(x) { this.v = x; sp.set(x); } };
    sp.set(0);
    copyTL.fromTo(c, { n: 0 }, { n: to, duration: dur, ease: 'power2.out', immediateRender: false }, t);
  };

  /* --- timing, from the hold --- */
  // The camera trucks in from 23 and lands on hold 24; the copy's place sweeps across the screen until ~hold start − 0.3,
  // so the build starts as that sweep settles and is compressed to ~1.1 s (v1: 2.9 s) to be all in by ~hold start + 0.6.
  const T = Math.max(f24 + 0.3, h24.t0 - 0.5);
  // left: the pills slide in from the left (v1: x −400, power3.out), the disc pops (back.out), the lines swipe. They start
  // 850 px out (the hover's lag holds the layer ~390 px right of its place while the camera trucks in, so from −400 they
  // never crossed the left edge) and are opaque within 0.15 s, so they slide in solid from the edge instead of showing
  // as translucent ghost boxes mid-frame before their lines arrive (review: the frame 11 "appear before they were
  // supposed to" family)
  const slideIn = (el, t) => {
    copyTL.fromTo(el, { x: -850 }, { x: 0, duration: 0.55, ease: 'power3.out', immediateRender: false }, t)
      .fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15, ease: 'power1.out', immediateRender: false }, t);
  };
  gsap.set([pillA, pillB], { autoAlpha: 0, x: -850 });
  slideIn(pillA, T);
  K.swipe(lA, T + 0.1, 0.08, 0.5);
  slideIn(pillB, T + 0.15);
  gsap.set(disc, { autoAlpha: 0, scale: 0.3, transformOrigin: '50% 50%' });
  gsap.set(amp, { scale: 0, transformOrigin: '50% 55%' });
  copyTL.fromTo(disc, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)', immediateRender: false }, T + 0.2)
    .fromTo(amp, { scale: 0 }, { scale: 1, duration: 0.4, ease: 'back.out(2)', immediateRender: false }, T + 0.25);
  K.swipe(lB, T + 0.25, 0.08, 0.5);
  // right: the panels grow in from their right edge (v1: scale 0.9 → 1, back.out), 100+ and 90+ swipe and count; each is
  // opaque within 0.2 s (no translucent ghost while it grows)
  const growIn = (el, t) => {
    copyTL.fromTo(el, { scale: 0.9 }, { scale: 1, duration: 0.55, ease: 'back.out(1.3)', immediateRender: false }, t)
      .fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: 'power1.out', immediateRender: false }, t);
  };
  gsap.set([pan1, pan2], { autoAlpha: 0, scale: 0.9, transformOrigin: '100% 50%' });
  growIn(pan1, T + 0.05);
  K.swipe([n100], T + 0.15, 0, 0.6); counter(n100, n100.to, T + 0.15, 0.85);
  copyTL.fromTo(NL, { dz: 10 }, { dz: 0, duration: 0.9, ease: 'power3.out', immediateRender: false }, T + 0.15);   // pushes forward out of the depth
  K.swipe(l1, T + 0.3, 0.07, 0.5);
  growIn(pan2, T + 0.3);
  K.swipe([n90], T + 0.45, 0, 0.5); counter(n90, n90.to, T + 0.45, 0.6);
  K.swipe(l2, T + 0.5, 0.08, 0.5);
  // no exit (COPY RULE): the tip down and push into the doorway carry it off (all out of view by ~114.4)
  const all = [LS, RS, LT, RT, NL];
  const S = [T - 0.05, Math.min(h24.t1 + 1.95, V.CUTS.G6 - 0.3)];
  all.forEach(o => o.show(...S));
  // living gradients: ±4 %, the board's at the key instant (painted only while the copy is on)
  anim(t => { if (t >= S[0] - 0.05 && t <= S[1] + 0.05) paint(liveFill(t, tk, 4, 7)); });
  // it hovers (c21.js): a little of the camera's motion on the way in, most of it after the key instant, so it stays whole
  // and readable through the slow window and the start of the push (at this lens the push swept it off the edges in ~0.5 s);
  // the lag is capped at 250 px, so the push then carries it off with the set
  const hv = hover(V, all, h24, hoverBeta(tk, 0.5, 0.75), S, 250);
  // panel 2's cut-away follows board 24's arch: the arch's outer circle (its face is in the sphere's plane, at hold 24's
  // depth) projected from the camera onto the panel's plane, in the panel's own px (the panel keeps facing hold 24's view,
  // so the projection of the circle is a circle)
  const { THREE } = V, DF = h24.depth, Ca = h24.at(867, 933, DF), ra = 374 * DF * h24.tanV / 540, v3 = new THREE.Vector3(), P = new THREE.Vector3();
  let lastCut = '';
  anim(t => {
    if (!hv.on) return;
    P.copy(RS.H.at(RS.at[0], RS.at[1], RS.depth)).addScaledVector(RS.H.fwd, RS.dz);   // the panels' layer centre, as the copy layer places it
    const dC = v3.copy(hv.C).sub(h24.pos).dot(h24.fwd), dP = v3.copy(P).sub(h24.pos).dot(h24.fwd), sc = (dP - dC) / (DF - dC);
    v3.copy(hv.C).lerp(Ca, sc).sub(P);
    const cx = RS.at[0] + v3.dot(h24.right) / RS.k - 1060, cy = RS.at[1] - v3.dot(h24.upv) / RS.k - 629, r = ra * sc / RS.k;
    const m = `radial-gradient(circle at ${cx.toFixed(1)}px ${cy.toFixed(1)}px,transparent ${r.toFixed(1)}px,#000 ${(r + 1).toFixed(1)}px)`;
    if (m !== lastCut) { pan2.style.webkitMaskImage = m; pan2.style.maskImage = m; lastCut = m; }
  });
};
