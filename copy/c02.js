/* Copy · frame 2 (4.2 → 8.0 s): ENHERTU HAS BEEN stays; PUSHING WHAT'S POSSIBLE / FOR PATIENTS swipe in (v1's clip swipe).
   · ENHERTU HAS BEEN (c01.js's layer) glides from its board-1 place to its board-2 place while the camera moves 1 → 2
     (~8 units forward, between the two boards' key instants: the camera never stops now), trailing the camera well
     behind: the camera first moves toward the letters (they swell ~15 %, the user's "camera moves towards the text") and
     then they pull back in Z as it lands, settling exactly on board 2 (frame 2's Z moment). The glide is tied to the
     camera's own progress along that move (read from the camera path), so it trails it the same way whatever its pace.
   · The new lines sit on hold 2's card, a little in front of the sphere, and swipe in as the camera arrives; seen from the
     approaching camera they grow into place. They hover (c01's hover()), in place at board 2's key instant.
   · All three swipe out to the right (v1's exit, staggered 0.06 s) at hold 3's start − 1.7 (8.2 s, gone by ~8.77), just
     before frame 3's AND, OF COURSE swipes in at the top (8.85) and its PTP picture grows in over the middle (9.2), and as
     the camera's truck into board 3 brings ENHERTU HAS BEEN to the left edge (from ~8.2).
     The exit is KEPT under the user's no-transition-outs rule (2026-09-28 00:30), as the rule's exception: the camera
     barely moves between boards 2 and 3 (measured with no exit: the lines stay on screen, sliding ~200 px left by 9.2 s,
     ENHERTU HAS BEEN cut by the left edge), so nothing would hide them, and they would sit under frame 3's picture. They
     now stay ~0.9 s longer (they left at 7.3, 0.7 s before frame 3 began).
   Every time is read from the holds. */
import { line, shared, hover, contentFor } from './c01.js';

export default V => {
  const { copy, copyTL, holds } = V;
  const h1 = holds[1], h2 = holds[2];
  const { E, mv, span: ehb, P1 } = shared;
  const TX = contentFor(V, 2);                                      // frame 2's words (content/copy.json); both lines are centred on the board
  const ed = (i, md) => { const r = TX.line('lines', i, md); return r.edited ? { ...r, align: 'center' } : undefined; };

  /* ---- ENHERTU HAS BEEN: the carry to board 2 ----
     Over the camera's own move between the two key instants, on a delayed copy of its progress, so the line trails the
     camera well behind and arrives with it: the camera closes in on it first (it swells ~15 % around two thirds of the
     way), then it pulls back in depth as the camera lands; no overshoot, no wobble. The camera's progress c is its place
     along the chord from board 1's framing to board 2's (read from the camera path on first use, 1/240 s table); the line's
     is smoothstep(q³) with smoothstep(q) = c, the same relation it had with the old stop-to-stop move (camera smoothstep(q),
     line smoothstep(q³)). */
  const T0 = h1.tk, DUR = h2.tk - h1.tk;
  const ss = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
  const ssInv = c => 0.5 - Math.sin(Math.asin(1 - 2 * Math.min(1, Math.max(0, c))) / 3);   // q with smoothstep(q) = c
  let tab = null;
  const build = () => {
    const A = h1.pos, AB = h2.pos.clone().sub(h1.pos), L2 = AB.lengthSq(), N = Math.ceil(DUR * 240), a = new Float32Array(N + 1);
    let m = 0;
    for (let i = 0; i <= N; i++) {
      const v = V.camAt(T0 + DUR * i / N), c = v ? (AB.x * (v[0] - A.x) + AB.y * (v[1] - A.y) + AB.z * (v[2] - A.z)) / L2 : i / N;
      const q = ssInv(c); m = Math.max(m, ss(q * q * q)); a[i] = m;                           // made monotonic: never backs up
    }
    a[0] = 0; a[N] = 1; return a;
  };
  const lag = p => { if (p <= 0) return 0; if (p >= 1) return 1;
    if (!tab) { try { tab = build(); } catch (e) { const q = p * p * p; return q * q * (3 - 2 * q); } }   // (the camera path isn't built yet: the old curve)
    const f = p * (tab.length - 1), i = Math.floor(f); return tab[i] + (tab[i + 1] - tab[i]) * (f - i); };
  copyTL.fromTo(E, { dz: P1.dz }, { dz: 0, duration: DUR, ease: lag, immediateRender: false }, T0)
    .fromTo(mv, { x: P1.x, y: P1.y, rotationY: P1.ry, rotationX: P1.rx }, { x: 0, y: 0, rotationY: 0, rotationX: 0, duration: DUR, ease: lag, immediateRender: false }, T0);

  /* ---- PUSHING WHAT'S POSSIBLE / FOR PATIENTS: hold 2's card ---- */
  const XO = holds[3].t0 - 1.7;                                      // the exit (see the header)
  const card2 = copy(2, { depth: h2.depth - 3 }).show(h1.t1 + 0.5, XO + 0.8);
  E.show(0, XO + 0.8);                                               // (c01.js made ENHERTU HAS BEEN's layer and sets this same end: keep them equal)
  const pwp = line(V, card2.el, 357.0, 540.6, 104.1, 'l', 'PUSHING WHAT’S POSSIBLE', { ls: -3.2, edit: ed(0, 'PUSHING WHAT’S POSSIBLE') });   // fitted to board 2 (v1: 363, 560, 104)
  const fp = line(V, card2.el, 715.7, 654.6, 103.4, 'l', 'FOR PATIENTS', { ls: -3.2, edit: ed(1, 'FOR PATIENTS') });   // (v1: 717, 675, 104)
  [[pwp, h2.t0 - 0.75], [fp, h2.t0 - 0.5]].forEach(([s, t]) => copyTL.fromTo(s, { clipPath: 'inset(0% 100% 0% 0%)', x: -60 }, { clipPath: 'inset(0% 0% 0% 0%)', x: 0, duration: 0.7, ease: 'power3.out' }, t));
  hover(V, pwp.parentElement, h2.tk, { seed: 3 }); hover(V, fp.parentElement, h2.tk, { seed: 4 });

  /* ---- exit: all three swipe out to the right (kept: see the header) ---- */
  [ehb, pwp, fp].forEach((s, i) => copyTL.fromTo(s, { clipPath: 'inset(0% 0% 0% 0%)', x: 0 }, { clipPath: 'inset(0% 0% 0% 100%)', x: 80, duration: 0.45, ease: 'power2.in', immediateRender: false }, XO + 0.06 * i));
};
