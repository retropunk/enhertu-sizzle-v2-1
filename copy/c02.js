/* Copy · frame 2 (4.95 → 9.35 s): ENHERTU HAS BEEN stays; PUSHING WHAT'S POSSIBLE / FOR PATIENTS swipe in (v1's clip swipe).
   · ENHERTU HAS BEEN (c01.js's layer) glides from its board-1 place to its board-2 place while the camera moves 1 → 2
     (~8 units forward, between the two boards' key instants: the camera never stops now), trailing the camera well
     behind: the camera first moves toward the letters (they swell ~15 %, the user's "camera moves towards the text") and
     then they pull back in Z as it lands, settling exactly on board 2 (frame 2's Z moment). The glide is tied to the
     camera's own progress along that move (read from the approved camera path, g1.js's G1.camBase), so it trails it the
     same way whatever its pace.
   · The new lines sit on hold 2's card, a little in front of the sphere, and swipe in as the camera arrives (from 4.95,
     once PUSHING BOUNDARIES has gone); seen from the approaching camera they grow into place. They hover (c01's hover()),
     in place at board 2's key instant.
   · No exit: the camera carries them off (user, 2026-09-29, question A3: "Add a gentle camera move so the text leaves the
     frame the way it does everywhere else, which matches your 'no exits' note"; on frame 8, the same day: "it should stay
     in 3D space place"). The old swipe-out to the right (8.2–8.77) is gone. All three lines are laid out in hold 2's
     approved view and turned with the camera's tilt up to board 2's key instant (c01's inTilt()), so their build, glide
     and read are the approved ones; from that key instant they stay where they are in the world, and the camera's second
     tilt (g1.js) carries them off the bottom of the frame, easing into it from the key instant and then sinking steadily
     at ~305 px/s plus the approved sideways drift (under 355 px/s even while leaving), with no growth. They read for
     2.53 s (5.67 → 8.20; approved 2.67), are gone by G1.T.b2Off (9.35 s, just as frame 3's lines swipe in at the top)
     and are switched off then (the camera never brings them back). The review of 2026-09-29 replaced the earlier way
     (they rode the camera through the slow window, then came to rest 11 units from the lens and swept off at up to
     880 px/s, growing, still on screen as frame 3's lines came in).
   Every time is read from the holds. */
import { line, shared, hover, contentFor, inTilt } from './c01.js';
import { G1 } from '../groups/g1.js';

export default V => {
  const { copy, copyTL, holds } = V;
  const h1 = holds[1], h2 = G1.base[2];                              // hold 2's approved view (the copy is laid out in it)
  const { E, mv, P1 } = shared;
  const TX = contentFor(V, 2);                                      // frame 2's words (content/copy.json); both lines are centred on the board
  const ed = (i, md) => { const r = TX.line('lines', i, md); return r.edited ? { ...r, align: 'center' } : undefined; };

  /* ---- ENHERTU HAS BEEN: the carry to board 2 ----
     Over the camera's own move between the two key instants, on a delayed copy of its progress, so the line trails the
     camera well behind and arrives with it: the camera closes in on it first (it swells ~15 % around two thirds of the
     way), then it pulls back in depth as the camera lands; no overshoot, no wobble. The camera's progress c is its place
     along the chord from board 1's framing to board 2's (read from the approved camera path, 1/240 s table); the line's
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
      const v = G1.camBase(T0 + DUR * i / N).pos, c = (AB.x * (v.x - A.x) + AB.y * (v.y - A.y) + AB.z * (v.z - A.z)) / L2;
      const q = ssInv(c); m = Math.max(m, ss(q * q * q)); a[i] = m;                           // made monotonic: never backs up
    }
    a[0] = 0; a[N] = 1; return a;
  };
  const lag = p => { if (p <= 0) return 0; if (p >= 1) return 1;
    if (!tab) tab = build();
    const f = p * (tab.length - 1), i = Math.floor(f); return tab[i] + (tab[i + 1] - tab[i]) * (f - i); };
  copyTL.fromTo(E, { dz: P1.dz }, { dz: 0, duration: DUR, ease: lag, immediateRender: false }, T0)
    .fromTo(mv, { x: P1.x, y: P1.y, rotationY: P1.ry, rotationX: P1.rx }, { x: 0, y: 0, rotationY: 0, rotationX: 0, duration: DUR, ease: lag, immediateRender: false }, T0);

  /* ---- PUSHING WHAT'S POSSIBLE / FOR PATIENTS: hold 2's card (in the world from board 2's key instant) ---- */
  const card2 = inTilt(V, copy(2, { depth: h2.depth - 3 }), h2, h2.tk).show(h1.t1 + 0.5, G1.T.b2Off);
  E.show(0, G1.T.b2Off);                                             // (c01.js made ENHERTU HAS BEEN's layer and sets this same end)
  const pwp = line(V, card2.el, 357.0, 540.6, 104.1, 'l', 'PUSHING WHAT’S POSSIBLE', { ls: -3.2, edit: ed(0, 'PUSHING WHAT’S POSSIBLE') });   // fitted to board 2 (v1: 363, 560, 104)
  const fp = line(V, card2.el, 715.7, 654.6, 103.4, 'l', 'FOR PATIENTS', { ls: -3.2, edit: ed(1, 'FOR PATIENTS') });   // (v1: 717, 675, 104)
  [[pwp, h2.t0 - 0.75], [fp, h2.t0 - 0.5]].forEach(([s, t]) => copyTL.fromTo(s, { clipPath: 'inset(0% 100% 0% 0%)', x: -60 }, { clipPath: 'inset(0% 0% 0% 0%)', x: 0, duration: 0.7, ease: 'power3.out' }, t));
  hover(V, pwp.parentElement, h2.tk, { seed: 3 }); hover(V, fp.parentElement, h2.tk, { seed: 4 });
};
