/* G4 · frames 16–20 (66.85 → 93.25 s): meander → floating discs → soft-serve swirl → U-turn from above → chute into a hole.
   Starts under G3's left-to-right gradient wipe (cut 66.85) on frame 16. Ends in frame 20's dark hole: the sphere drops in,
   the camera dives after it, dip(93.25) hides the cut to G5.
   NEVER STOP (user, 21:50: "ease into that keyframe and then ease back out from the keyframe, so you're never actually
   stopping"). All five holds are ease-throughs (hold(n, { pass: true })): the camera passes each board's exact pose at its
   key instant still moving (16: 3.1, 17: 2.65, 18: 2.0, 19: ~5.9, 20: 4.2 u/s, about a fifth to a third of the moves'
   cruise either side), slowest there, and speeds up again. t0–t1 is each hold's slow window (the copy reads in it). The
   shot from the wipe to the dark hole is one smooth camera curve with no still moment.
   The journey:
   16  (rebuilt 2026-09-28: the rollercoaster, then, at the user's word, the bounce) the meander is a thick 3D track with
       plain rounded arches; out of the wipe the sphere drops in from above onto its left end and bounces across it, arch
       to arch in an even rhythm (the left end, the first arch, the tall "i" arch's crown, the last arch; the band is
       springy); the camera rides with it low and angled, swings round to board 16's frontal view as it bounces on top of
       the tall arch (the key, 70.2: the dot of the "i"), then chases it as it bounces on to the last arch and pops off.
   →17 it drops onto a floating disc (B) and ricochets disc to disc (user: "lean into that"); the camera cranes down with it
       while frame 17's world (navy, the glow, its discs and shapes) arrives below frame 16's set, which stays in the world.
   17  the camera eases down past board 17's view (key 74.35); the sphere ricochets D1 → D2 → D3 (at the key) → D4 (the
       discs swing like paddles to send it on) with the board's motion trail as ghost rings.
   →18 two more discs, then it lands on the tip of the soft-serve swirl and rolls round its coils as the camera cranes down.
   18  still sinking, the camera passes board 18's view, looking down 7° (key 79.55); the sphere rides the groove round the
       front of the fat upper coils, then round the back.
   →19 the camera drops to floor level as it comes round the back and off the swirl onto the U's upper arm; it runs at the
       camera until it fills the frame; inside the fill the camera swings over the top of the sphere, then rises straight up
       to look down on the U-turn as frame 19's shapes grow out of the floor (one continuous move).
   19  the rise eases out as the camera passes board 19's top-down view (key 85.6; screen-right = world +z, screen-up =
       world +x), sliding screen-left after the sphere as it rounds the bend; the view doesn't turn there.
   →20 along the lower arm, round a corner and over the platform's edge; the camera tilts and cranes down 90° about the
       edge (screen-right stays +z) as the sphere drops down the rail chute on the wall, whose reliefs push out.
   20  still craning down, the camera passes board 20's view of the wall (key 90.7); the sphere comes down the chute to the
       lip of the dark hole and drops in; the camera dives after it into the dark tunnel.
   All five hold cameras use fov 26; at each key instant the sphere is on its board spot at its size.
   This file is the JOURNEY: the holds, the sphere's route and timing, the camera, the captions, the background keys and
   the dip. Each frame's set is built (real 3D, no board picture) in its own file, groups/g4/f16.js … f20.js, called below
   in frame order with the shared context G (holds, marks, the route's anchors and times, and helpers). A set builder edits
   only its fNN.js; a journey change is described in the report and made here.
   Integration (batch 4): the swirl's helix is wider (RK 3.0; f18's request, so the real coils match board 18); hold 18 looks
   down 7° (the board's viewpoint); the camera is one smooth curve laid as dense keys (no eased keys: the 83.85 and 92.2
   jolts are gone). Then the never-stop rule: every hold became an ease-through (the camera section); frame 17's world
   comes in 0.3 s earlier (no bare screen after frame 16 leaves); frame 16's ledge has a lit lip (it is in view whenever the
   camera is off the key pose, and side-shaded it read as a groove).
   Fix pass (after the three reviews; the cut states at 66.85 and 93.24–93.249 are unchanged, checked against the backup):
   · 16: (superseded 2026-09-28 by the rollercoaster, then the same day by the bounce and its fix pass: bounce16 and the
     frame 16 block below).
   · 18: the helix is tilted (the creases rise to the right, as board 18's) and bulges out on the left/back, with the
     exit point pinned (frames 19 and 20 don't move) and the exit time kept; the landing on the tip moves up a little
     (f17's last hop lands there); the ride starts at 9 u/s so it stays under ~13 u/s.
   · 18 → 19: the drop to floor level comes 0.35 s earlier (the flattest stretch was the sphere behind the swirl while the
     camera sank slowly); inside the fill the sphere's drawn pattern follows the camera's swing (one gradient instead of
     five colours in 0.65 s), carried afterwards as a fixed offset on the sphere's body; the rise into 19 is front-loaded
     (peak ~24 u/s, was ~31) and passes board 19 at ~5.9 u/s, still rising slowly.
   Reading time (2026-09-29; the user: "add about ½ second where it's under ~1.3 s (e.g. 24, 25), borrowing time from the
   travel between frames so the piece stays 2:27"): after keys 16, 18, 19 and 20 the camera stays slow a little longer
   before it carries the copy off, and makes the time up in the travel after (the camera section: CHW, warpOut on the
   18 → 19 stretch, and the retimes of the 19 → 20 move and the dive); c16, c18, c19 and c20 build in earlier / hover longer. Measured with the
   reading-time probe: 16 0.97 → 1.47 s, 18 0.73 → 1.30, 19 0.17 → 0.83, 20 0.87 → 1.37 (17 unchanged, 1.30).
   Moving from the first frame of the reveal (polish, 2026-09-29; the backlog: "G4's camera starts from rest at the 66.85
   wipe reveal … Give [it] a non-zero start velocity"): out of G3's wipe the camera is already drifting on its way at its
   curve's own ~4.9 u/s from the first shown frame (the engine's start from rest now falls inside the cut's first half
   millisecond: emit() in the camera section). Frame 16's rollercoaster and bounce, every key and every later pose are
   unchanged. */
// The frame files load one by one (like the groups in v2.js), so a builder's file that doesn't parse, or throws, only loses
// its own set: the journey and the other four sets still render. The reason shows as a "console:" line in dev/check.mjs.
const FRAME_FILES = await Promise.all([16, 17, 18, 19, 20].map(n => import(`./g4/f${n}.js`).catch(e => { console.error(`G4 f${n}.js failed to load: ${e.message}`); return {}; })));
const setFor = (n, name = 'default') => (V, G) => { const f = FRAME_FILES[n - 16][name]; if (!f) return; try { f(V, G); } catch (e) { console.error(`G4 f${n}.js${name === 'default' ? '' : ' ' + name}: ${e.message}`); } };

/* Frame 16's bounce as physics, in the track's plane (units u: x right, y up; the origin is board 16's painted sphere
   spot (1250, 625), the hold's mark; 65 board px = 1 u at the sphere's depth, so the ball's radius is 1). Pure maths.
   (2026-09-28, the user after the rollercoaster build: "I see how you are matching frame 16 perfectly so you've created a
   scoop/cup in the band. Unfortunately it makes the journey of the sphere weird. Can you remove that scoop/cup and make
   the cup into an arch to match the other sections so the sphere simply bounces across?")
   · The ball flies exact ballistic arcs under ONE gravity g (frame 17's disc hops use the same, G.GD = 12) between
     contacts on the band's REAL surfaces: the left end's flat top, then the three arches' round crowns (ball centre at
     crown centre + (RO + R)·n, n the contact normal at angle a from straight up, + = right). Each arc is fixed by its two
     ends and its duration, so the velocity in and out of every contact follows, and with it the bounce's restitution e
     (normal speed out / in) and tangential retention f (friction), reported in ev for the review.
   · The drop-in: the arc into the first contact is run backward from it with restitution e0 (it comes down steeply from
     above the frame, as if frame 15's doorway fed it down a chute).
   · (fix pass after the two reviews: "the rhythm is lopsided and floaty", "the key bounce is a skim") The band is
     SPRINGY (a cartoon bounce, the rollercoaster brief's "the band springs it out"): the chain is an even cadence
     (flights 1.38 / 1.23 / 1.02 s) instead of one honest ~2 s lob. The drop-in lands on the left end and bounces
     (e 0.85), the first arch springs it up and over (e 1.6: the one contact that adds energy; the band dips under the
     ball there, see DIP), it comes down steeply (44°) onto the tall crown at the key and rebounds (e 0.86, a 0.7 u hop),
     then the last arch (e 0.41, keeping its forward speed, f ~1.0) pops it off toward disc B. Designed with a small search
     (scratch v2f16/setsfix/explore.mjs). The last arch can't be livelier while frame 17's first disc D1 keeps its time and
     place: disc B has to catch the long fall and redirect it gently onto D1 (a livelier pop off the last arch would reach
     B too late or send D1 an impossible hit). Every arc clears the band by at least 0.15 u between contacts. */
function bounce16(P) {
  const g = P.g, R = 1, RB = 201 / 65 + R;
  const U = (px, py) => [(px - 1250) / 65, (625 - py) / 65];
  const YF = U(0, 877)[1] + R;                                                   // the left end's flat top: ball-centre height
  const O = { a1: U(768, 877), tall: U(1241, 749), a3: U(1716, 877) };         // the crowns' centres
  const C = P.contacts.map(c => { if (c.on === 'end') return { ...c, p: [c.x, YF], n: [0, 1] };
    const q = c.a * Math.PI / 180, n = [Math.sin(q), Math.cos(q)], o = O[c.on]; return { ...c, p: [o[0] + RB * n[0], o[1] + RB * n[1]], n }; });
  const ends = [...C, { t: P.end.t, p: P.end.p }];
  // arcs: { t0, t1, p (position at t0), v (velocity at t0), c (the contact it leaves from, or null) }
  const arcs = C.map((a, i) => { const b = ends[i + 1], T = b.t - a.t; return { t0: a.t, t1: b.t, p: a.p, v: [(b.p[0] - a.p[0]) / T, (b.p[1] - a.p[1]) / T + g * T / 2], c: a }; });
  const vAt = (A, t) => [A.v[0], A.v[1] - g * (t - A.t0)];
  const pAt = (A, t) => { const s = t - A.t0; return [A.p[0] + A.v[0] * s, A.p[1] + A.v[1] * s - g * s * s / 2]; };
  // the drop-in, run backward from the first contact: it comes in with the first arc's forward speed and falls fast
  const C0 = C[0], vIn0 = [arcs[0].v[0], -arcs[0].v[1] / P.e0], DT = C0.t - P.t0;
  const drop = { t0: P.t0, t1: C0.t, p: [C0.p[0] - vIn0[0] * DT, C0.p[1] - vIn0[1] * DT - g * DT * DT / 2], v: [vIn0[0], vIn0[1] + g * DT], c: null };
  arcs.unshift(drop);
  // each contact: velocity in and out, restitution e and tangential retention f
  C.forEach((c, i) => { c.vIn = vAt(arcs[i], c.t); c.vOut = arcs[i + 1].v; const n = c.n, tn = [n[1], -n[0]], dot = (a, b) => a[0] * b[0] + a[1] * b[1];
    c.e = -dot(c.vOut, n) / dot(c.vIn, n); c.f = dot(c.vOut, tn) / dot(c.vIn, tn); });
  const arcOf = t => arcs.find(A => t < A.t1) || arcs.at(-1);
  // (fix pass, the band's spring) each contact dips the band under the ball and back (DIP.w s either side of it, a smooth
  // compact bump), by an amount that grows with the bounce's impulse; the ball rides the dip, so it stays touching
  const DIP = { w: 0.07, k: 0.006, max: 0.13 };
  C.forEach(c => { const vn = a => Math.abs(a[0] * c.n[0] + a[1] * c.n[1]); c.dip = Math.min(DIP.max, DIP.k * (vn(c.vIn) + vn(c.vOut))); });
  const dipAt = t => { for (const c of C) { const x = Math.abs(t - c.t) / DIP.w; if (x < 1) return { c, D: c.dip * (1 - x * x) ** 2 }; } return null; };
  return { g, R, RB, YF, O, C, arcs, pAt, vAt, arcOf, dipAt, DIP, end: P.end, vEnd: vAt(arcs.at(-1), P.end.t) };
}

export default V => {
  const { THREE, BOARD, hold, key, seg, easeH, note, bgKey, dip, anim, mat, scene, o } = V;
  const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
  const DEG = Math.PI / 180, FOV = 26, TAN = Math.tan(FOV / 2 * DEG);
  const depthOf = n => 540 / (BOARD[n].d / 2 * TAN);            // camera-to-sphere depth that shows board n's sphere at its size
  const GRAV = 26, GD = 12;                                      // gravity for falls, and a softer one for the disc hops (u/s²)

  /* a copy of every sphere seg, so camera keys and props can ask where the sphere is at any time */
  const SG = [];
  const mseg = (t0, t1, ease, fn) => { const e = typeof ease === 'function' ? ease : gsap.parseEase(ease); SG.push({ t0, t1, e, fn }); seg(t0, t1, e, fn); };
  const mrun = (list, v0, v1) => {                               // the engine's runSegs (no speed jumps at the knots), recorded
    const d = list.map(([a, b, L]) => L / (b - a)), h = list.map(([a, b]) => b - a), v = [v0 ?? d[0]];
    for (let k = 1; k < list.length; k++) { const w1 = 2 * h[k] + h[k - 1], w2 = h[k] + 2 * h[k - 1]; v.push((w1 + w2) / (w1 / d[k - 1] + w2 / d[k])); }
    v.push(v1 ?? d.at(-1));
    list.forEach(([a, b, , fn], k) => { let m0 = v[k] / d[k], m1 = v[k + 1] / d[k]; const r = Math.hypot(m0, m1) / 3; if (r > 1) { m0 /= r; m1 /= r; } mseg(a, b, easeH(m0, m1), fn); });
  };
  const ballAt = t => { const s = SG.find(q => t <= q.t1) || SG.at(-1); return s.fn(s.e(Math.min(1, Math.max(0, (t - s.t0) / (s.t1 - s.t0))))).p.clone(); };
  const path = (pts, c = 1) => { const C = new THREE.CatmullRomCurve3(pts, false, 'centripetal'); C.arcLengthDivisions = 4000; const f = u => ({ p: C.getPointAt(Math.min(1, Math.max(0, u))), c }); f.L = C.getLength(); f.C = C; return f; };
  const sub = (f, a, b) => { const g = u => f(a + (b - a) * u); g.L = f.L * (b - a); return g; };
  const uNear = (f, P) => { let best = 0, bd = Infinity; for (let i = 0; i <= 6000; i++) { const d = f.C.getPointAt(i / 6000).distanceToSquared(P); if (d < bd) { bd = d; best = i / 6000; } } return best; };
  const toss = (pA, v0, g = GRAV) => s => pA.clone().addScaledVector(v0, s).add(V3(0, -0.5 * g * s * s, 0));   // ballistic; s = seconds
  const aim = (pA, pB, T, g = GRAV) => pB.clone().sub(pA).divideScalar(T).add(V3(0, 0.5 * g * T, 0));         // launch velocity pA → pB in T s
  const hopSeg = (t0, T, fs) => mseg(t0, t0 + T, 'none', u => ({ p: fs(u * T), c: 0 }));
  // a hold camera's basis before hold() is called (same maths as the engine), to lay out a set from board px
  const tmpCam = new THREE.PerspectiveCamera(FOV, 16 / 9, 0.05, 2000);
  const basis = dir => { tmpCam.position.set(0, 0, 0); tmpCam.up.set(0, 1, 0); tmpCam.lookAt(dir[0], dir[1], dir[2]); tmpCam.updateMatrixWorld(); const e = tmpCam.matrixWorld.elements; return { right: V3(e[0], e[1], e[2]), upv: V3(e[4], e[5], e[6]), fwd: V3(-e[8], -e[9], -e[10]) }; };
  const rayOf = (B, px, py) => B.fwd.clone().addScaledVector(B.right, (px - 960) / 540 * TAN).addScaledVector(B.upv, (540 - py) / 540 * TAN);
  // flat ribbon (a track band) along floor points, width w, lying on the plane y = const
  const ribbon = (pts, w, m) => {
    const C = new THREE.CatmullRomCurve3(pts, false, 'centripetal'), N = Math.max(8, Math.round(C.getLength() * 4)), pos = [], idx = [];
    for (let i = 0; i <= N; i++) { const p = C.getPointAt(i / N), t = C.getTangentAt(i / N), s = V3(-t.z, 0, t.x).normalize().multiplyScalar(w / 2); pos.push(...p.clone().add(s).toArray(), ...p.clone().sub(s).toArray()); if (i) idx.push(2 * i - 2, 2 * i - 1, 2 * i, 2 * i - 1, 2 * i + 1, 2 * i); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    const mesh = new THREE.Mesh(g, m); scene.add(mesh); return mesh;
  };
  const smooth = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };

  bgKey(66.85, '#2a0c8a', '#4b10e0', '#8a3ae8');                 // frame 16's violet
  bgKey(71.6, '#2a0c8a', '#4b10e0', '#8a3ae8');
  bgKey(73.0, '#140a3a', '#1e1060', '#3a1490');                  // 17–18: dark navy
  bgKey(82.6, '#140a3a', '#1e1060', '#3a1490');
  bgKey(83.6, '#2a0ca0', '#4b00ff', '#8a2bf0');                  // 19: blue-violet
  bgKey(87.4, '#2a0ca0', '#4b00ff', '#8a2bf0');
  bgKey(88.6, '#12083a', '#1e0e5a', '#2a1070');                  // 20: navy
  bgKey(93.25, '#0c0626', '#140a3a', '#1e0e5a');

  /* ================= frame 16 · the meander: the sphere bounces across it ================= */
  /* (2026-09-28, the user on the rollercoaster build: "so so close - looks great! … I see how you are matching frame 16
     perfectly so you've created a scoop/cup in the band. Unfortunately it makes the journey of the sphere weird. Can you
     remove that scoop/cup and make the cup into an arch to match the other sections so the sphere simply bounces
     across?") The meander is a thick 3D track (f16.js) whose tall "i" arch now has a plain rounded crown like the other
     arches, and the sphere BOUNCES ACROSS it (bounce16 above: exact ballistic arcs under frame 17's gravity, contacts on
     the real crowns): out of G3's wipe it drops in steeply from above onto the left end's flat top (67.59) and bounces up
     and over onto the first arch (68.97), whose spring sends it up and over onto the tall arch's crown (the key instant,
     70.2: it comes down steeply and touches the top of the "i", the dot sitting right on it, then rebounds), bounces on
     to the last arch (71.22), which pops it up and off, and it falls past the band's end onto frame 17's first disc (the
     stand-in disc B, 72.95; disc A is gone). An even rhythm (fix pass 2: it was one ~2 s lob, then quick hops).
     No cup, no roll, no kick. Board 16's painted sphere sits INSIDE the crown's outline (its centre 77 px below the crown's
     top), which a ball bouncing on the crown can't reach: at the key the sphere sits on the crown's top (riding the band's
     small dip), at board (1260, 488), ~137 px above the painted spot (the user chose the bounce over that match). The
     camera and the whole set still pass exactly through board 16's view at the key. */
  const D16 = depthOf(16), TK16 = 70.2;
  // (t0–t1: the camera's slow window, under ~8 u/s round its 3.1 u/s pass through the key: the copy reads in it)
  const h16 = hold(16, { pass: true, t: [TK16 - 0.35, TK16 + 0.55], tk: TK16, mark: o(0, 0, 0), dir: [0, 0, -1], fov: FOV, plate: { depth: D16 + 1.5, in: [66.8, 66.85], out: [71.15, 71.95] } });
  const w16 = (px, py) => h16.at(px, py, D16);
  // (the animatic's route: only its length is kept, because frame 17's clock (tA0 and every later time) hangs on it)
  const rest16 = (top, x) => { let y = Infinity; for (let s = -65; s <= 65; s++) { const yt = top(x + s); if (yt < Infinity) y = Math.min(y, yt - Math.sqrt(65 * 65 - s * s)); } return y; };
  const top16a = x => { let y = Infinity; if (x >= 334 && x <= 507) y = 877; for (const [cx, cy] of [[776, 877], [1250, 755], [1717, 877]]) { const dx = x - cx; if (Math.abs(dx) <= 205) y = Math.min(y, cy - Math.sqrt(205 * 205 - dx * dx)); } return y; };
  const roll16a = []; for (let x = 450; x <= 1970; x += 40) roll16a.push(w16(x, rest16(top16a, x) + 140));
  roll16a.push(w16(1987, 1017));
  const P16a = path(roll16a), uK16a = uNear(P16a, h16.mark);
  const E0 = w16(1987, 1017), A0 = E0.clone().add(V3(0, -2.6, 0));      // the old disc A: frame 17's world is laid out from it
  const tA0 = TK16 + P16a.L * (1 - uK16a) / 8.6 + 0.27;                  // (72.246: the old landing on disc A)
  // (fix pass: the landing on disc B moves 0.15 s later (72.95) so the last arch can pop the ball up rather than drop it;
  //  frame 17's first disc hit, tD1, keeps its time (the B → D1 hop is 0.15 s shorter), and D1 onward is unchanged)
  const tD1fix = tA0 + 1.15, tB = 72.95;                                 // (tD1fix: the old tA0 + 0.55 + 0.6)
  const hops = [tB - tA0, tD1fix - tB, 0.5, 0.45];                       // (A→B, gone), B→D1, D1→D2, D2→key
  // the bounces (track plane: world = the mark + (x, y, z); the hold camera looks along −z, so its x/y are the track's).
  // Contacts: the left end's flat top at x; the arches' crowns at angle a from the top (+ = right). Disc B (0.3 behind the
  // track's plane) moves 1.4 u right and 0.09 u down: the last arch's pop keeps its forward speed (f ~1.0), the fall
  // passes the band's right end with ~0.8 u to spare (it grazed it before: "looks stuck to it"), and B ricochets it
  // (e ~0.57, was a dead catch) onto D1, whose hit turns ~6° (f17's paddle re-solves itself from the real velocities).
  const G16 = GD, BXY = [15.3, -10.53];
  const RD = bounce16({ g: G16, t0: 66.85, e0: 0.85, end: { t: tB, p: BXY }, contacts: [   // (e0 0.85: the drop starts just above the frame, so it falls into view as the wipe opens)
    { on: 'end', t: 67.59, x: -13.85 },                                  // the drop-in lands on the left end's flat top
    { on: 'a1', t: 68.97, a: 3.0 },                                      // the first arch, on its top (it springs the ball up)
    { on: 'tall', t: TK16, a: 4.0 },                                     // the key: on top of the tall "i" arch (board 1260, 484)
    { on: 'a3', t: 71.22, a: -7.0 }] });                                 // the last arch, just left of its top
  const trk = (x, y, z = 0) => h16.mark.clone().add(V3(x, y, z));
  const tLast16 = RD.C.at(-1).t;                                          // (off the last arch: the flight to disc B)
  const zOf = t => t <= tLast16 ? 0 : -0.3 * smooth((t - tLast16) / (tB - tLast16));   // (disc B sits 0.3 behind the track's plane)
  // (the spin, fix pass: the engine sets the roll from the whole step while c = 1 and keeps it through the arc, so the old
  //  0.025 s contact window spun the ball with its bounce (normal) speed too: ~2 rev/s over a slow lob. Now each contact is
  //  2 table steps (1/120 s, invisible) in which the ball only slides along the surface at its outgoing tangential speed,
  //  as a real bounce does while in contact: the roll it keeps through the arc matches its forward motion.)
  const SPINW = 2 / 240 + 1e-6;
  for (const A of RD.arcs) mseg(A.t0, A.t1, 'none', u => { const t = A.t0 + u * (A.t1 - A.t0), c = A.c, on = !!c && t - A.t0 <= SPINW;
    let p;
    if (on) { const tn = [c.n[1], -c.n[0]], vt = c.vOut[0] * tn[0] + c.vOut[1] * tn[1], s = t - A.t0; p = [c.p[0] + tn[0] * vt * s, c.p[1] + tn[1] * vt * s]; }
    else p = RD.pAt(A, t);
    const dp = RD.dipAt(t); if (dp) p = [p[0] - dp.c.n[0] * dp.D, p[1] - dp.c.n[1] * dp.D];        // (riding the band's dip)
    return { p: trk(p[0], p[1], zOf(t)), c: on ? 1 : 0, ...(on ? { n: V3(c.n[0], c.n[1], 0) } : {}) }; });
  // the band's dip for f16's track shader: the contact point on the band's surface (world), its normal and the depth now
  const dip16 = t => { const dp = RD.dipAt(t); if (!dp) return null; const c = dp.c; return { P: trk(c.p[0] - c.n[0], c.p[1] - c.n[1]), n: V3(c.n[0], c.n[1], 0), D: dp.D }; };
  const tDet16 = tLast16;
  const B_ = trk(BXY[0], BXY[1], -0.3);
  const vinB = B_.clone().sub(ballAt(tB - 1e-3)).multiplyScalar(1e3);
  const T16 = { drop: 66.85, hit: RD.C[0].t, a1: RD.C[1].t, key: TK16, a3: RD.C[3].t, B: tB,
    apex: RD.arcs.map(A => { const s = Math.min(A.t1 - A.t0, Math.max(0, A.v[1] / G16)); return A.t0 + s; }).filter((t, i) => i > 0) };

  /* ================= frame 17 · floating discs ================= */
  // the disc set sits below the meander's far end; the ball flies onto disc B (a stand-in above frame 17)
  const D17 = depthOf(17), PX17 = 64;                            // 128 px sphere = 2 u
  const M17 = A0.clone().sub(V3((330 - 214) / PX17, (516 + 230) / PX17, 0));
  const tA = tA0, tD1 = tB + hops[1], tD2 = tD1 + hops[2], TK17 = tD2 + hops[3];
  const A = A0;                                                  // (f17's ambient discs are still laid out round it)
  const h17 = hold(17, { pass: true, t: [TK17 - 0.8, TK17 + 0.8], tk: TK17, mark: M17, dir: [0, 0, -1], fov: FOV, plate: { depth: D17 + 1.5, in: [72.45, 73.3], out: [75.55, 76.3] } });
  const w17 = (px, py, dz = 0) => h17.at(px, py, D17 + dz);
  const D1 = w17(250, 175, 0.6), D2 = w17(350, 392, 0.2);
  const tD3 = TK17 + 0.05, D4 = w17(372, 775, -0.6), E1 = w17(190, 1170, -0.3), E2 = w17(430, 1520, 0);
  const tD4 = tD3 + 0.5, tE1 = tD4 + 0.55, tE2 = tE1 + 0.55;
  // the landing on the swirl's top coil
  let Lp = w17(300, 1880, 1.0); const tLand = tE2 + 0.6;       // (the landing: the helix is solved through here; the frame 18 block moves it to the tilted helix's top)
  const vAB = vinB.clone().add(V3(0, GD * hops[0], 0)), vBD1 = aim(B_, D1, hops[1], GD), vD12 = aim(D1, D2, hops[2], GD), vD2K = aim(D2, M17, hops[3], GD);
  const fD2K = toss(D2, vD2K, GD), D3 = fD2K(tD3 - tD2);
  const vD34 = aim(D3, D4, tD4 - tD3, GD), vD4E1 = aim(D4, E1, tE1 - tD4, GD), vE12 = aim(E1, E2, tE2 - tE1, GD); let vE2L;
  hopSeg(tB, hops[1], toss(B_, vBD1, GD)); hopSeg(tD1, hops[2], toss(D1, vD12, GD));
  hopSeg(tD2, tD3 - tD2, fD2K); hopSeg(tD3, tD4 - tD3, toss(D3, vD34, GD)); hopSeg(tD4, tE1 - tD4, toss(D4, vD4E1, GD));
  hopSeg(tE1, tE2 - tE1, toss(E1, vE12, GD));                   // (the last hop, E2 → the swirl's tip, is in the frame 18 block)

  /* ================= frame 18 · the soft-serve swirl ================= */
  // ball-centre helix round a vertical axis; θ = 0 is the front (toward the camera), 90° the right; it winds DOWN as θ falls
  // (integration, f18's request: the helix is wider round the key, RK 3.0 at 31.6°, so the real swirl's fat coils match
  //  board 18's; the key's mark stays where the animatic had it (the sphere stays on board 18's spot) and the landing stays
  //  on f17's Lp. The animatic's helix was RK 2.0 at 47.8°, pitch 2.9, which only fits a slim swirl.)
  const MK18 = (() => { const t0 = 47.8 * DEG, tl = 820 * DEG, r = th => 2.0 - (th - t0) / (2 * Math.PI) * 0.35;
    return V3(Lp.x - r(tl) * Math.sin(tl) + 2.0 * Math.sin(t0), Lp.y - (tl - t0) / (2 * Math.PI) * 2.9, Lp.z - r(tl) * Math.cos(tl) + 2.0 * Math.cos(t0)); })();
  const THK = 31.6 * DEG, RK = 3.0, THE = -270 * DEG;
  const ax = MK18.x - RK * Math.sin(THK), az = MK18.z - RK * Math.cos(THK), yK = MK18.y;
  let THL = Math.atan2(Lp.x - ax, Lp.z - az); while (THL < THK || (Lp.y - yK) / ((THL - THK) / (2 * Math.PI)) > 3.5) THL += 2 * Math.PI;
  const PITCH = (Lp.y - yK) / ((THL - THK) / (2 * Math.PI)), DRAD = (RK - Math.hypot(Lp.x - ax, Lp.z - az)) / ((THL - THK) / (2 * Math.PI));
  const rOf0 = th => RK - (th - THK) / (2 * Math.PI) * DRAD;
  const helix0 = th => V3(ax + rOf0(th) * Math.sin(th), yK + (th - THK) / (2 * Math.PI) * PITCH, az + rOf0(th) * Math.cos(th));
  // (fix pass, the look review: board 18's coils are fatter on the left and their creases rise to the right, ~20°; the
  //  helix's own slope gave ~9° and the swirl was ~1.1 u narrow on the left.) Two shape terms, both periodic in θ (the
  //  same on every turn, so the coil above the sphere keeps its place relative to it and the groove fit holds):
  //  · TILT: each turn is tilted (higher on the right): + TIL·(sin θ − sin THK), zero at the key. Below the key it is
  //    eased back (CORE) so the exit point PE, and everything after it (frames 19 and 20), stay exactly where they were;
  //    above it the landing point moves up a little (f17's last hop lands there).
  //  · BULGE: the left/back of every turn swings out by BUL (a smooth window over θ ≡ 130°…370°, peak at 250°, zero at the
  //    key (31.6°), at the landing (≡ 53°) and at the exit (≡ 90°)).
  const TIL = 0.5, BUL = 1.15, wrap = a => ((a % 360) + 360) % 360;
  const bulge = th => { const d = wrap(th / DEG - 130); return d < 240 ? Math.sin(Math.PI * d / 240) ** 2 : 0; };
  // (the tilt scales with the turn's radius: full on the key's coil, gentler on the narrow turns near the tip, where a
  //  steeper path would thin the tube's cross-section under the sphere)
  const tilt = th => TIL * Math.min(1.2, rOf0(th) / RK) * Math.sin(th), tiltK = tilt(THK);
  const offE = tilt(THE) - tiltK;
  const coreE = th => th >= THK ? 0 : (u => (u = Math.min(1, (THK - th) / (THK - THE)), u * u * (3 - 2 * u)))() * offE;
  const yH = th => yK + (th - THK) / (2 * Math.PI) * PITCH + tilt(th) - tiltK - coreE(th);
  const rOf = th => rOf0(th) + BUL * Math.min(1, (rOf0(th) / RK) ** 1.5) * bulge(th);   // (less on the narrow turns near the tip: a shorter ride there)
  const helix = th => V3(ax + rOf(th) * Math.sin(th), yH(th), az + rOf(th) * Math.cos(th));
  const M18 = helix(THK), D18 = depthOf(18), TK18 = 79.55;
  // the landing on the swirl's tip is the tilted helix's top: f17's last hop (E2 → Lp) goes there
  const Lp0 = Lp; Lp = helix(THL);
  vE2L = aim(E2, Lp, tLand - tE2, GD);
  hopSeg(tE2, tLand - tE2, toss(E2, vE2L, GD));
  // (integration: the slow window ends at 80.25 (the copy reads in 79.0–80.25); the camera passes the board's view at 79.55
  //  still sinking and carries on down to floor level as the sphere goes round the back of the swirl)
  const h18 = hold(18, { pass: true, t: [TK18 - 0.55, TK18 + 0.7], tk: TK18, mark: M18, dir: [0, -Math.sin(7 * DEG), -Math.cos(7 * DEG)], fov: FOV, plate: { depth: D18 + RK * Math.cos(THK), in: [77.35, 78.45], out: [82.75, 82.95] } });
  const hpts = (a, b) => { const n = Math.ceil(Math.abs(b - a) / (8 * DEG)), p = []; for (let i = 0; i <= n; i++) p.push(helix(a + (b - a) * i / n)); return path(p); };
  // (the exit time is the untouched helix's: frames 19 and 20 hang on it)
  const H1 = hpts(THL, THK), H2 = hpts(THK, THE), tExit = TK18 + (() => { const p = []; for (let i = 0, n = Math.ceil(Math.abs(THE - THK) / (8 * DEG)); i <= n; i++) p.push(helix0(THK + (THE - THK) * i / n)); return path(p).L; })() / 8.0;
  mrun([[tLand, TK18, H1.L, H1], [TK18, tExit, H2.L, H2]], 9.0, 8.0);   // (fix pass: starts at 9 (was 6.5), so the fatter turns don't push the middle of the ride past ~13 u/s)

  /* ================= 18 → 19 · off the swirl, at the camera, fill, rise ================= */
  const PE = helix(THE), vExit = V3(0, 1.0, 8.0);
  const yF = yK - 8.5;                                            // the U's floor: ball-centre height
  const sLand = (vExit.y + Math.sqrt(vExit.y ** 2 + 2 * GRAV * (PE.y - yF))) / GRAV, tOn = tExit + sLand;
  const PL = toss(PE, vExit)(sLand);
  hopSeg(tExit, sLand, toss(PE, vExit));

  /* ================= frame 19 · the U-turn from above ================= */
  const DIR19 = [Math.sin(5 * DEG), -Math.cos(5 * DEG), 0], B19 = basis(DIR19), D19 = depthOf(19), TK19 = 85.6;
  const pos0 = rayOf(B19, 868, 488).multiplyScalar(-D19);       // hold camera relative to the mark (mark at the origin)
  const floor0 = (px, py) => { const r = rayOf(B19, px, py); return pos0.clone().addScaledVector(r, -pos0.y / r.y); };   // board px → the floor plane y = 0
  // the arm length follows from the timing: the sphere lands on the upper arm at tOn and passes the bend's 3 o'clock at TK19
  const bendQ = floor0(655, 256).distanceTo(floor0(868, 488)) * 1.1;
  const armLen = (TK19 - tOn) * 8.3 - bendQ;
  const M19 = V3(PL.x - floor0(655, 256).x, yF, PL.z + armLen - floor0(655, 256).z);
  const h19 = hold(19, { pass: true, t: [TK19 - 0.8, TK19 + 0.8], tk: TK19, mark: M19, dir: DIR19, fov: FOV, plate: { depth: D19 + 1.0, in: [83.4, 84.4], out: [88.4, 89.3] } });
  const fl = (px, py) => floor0(px, py).add(M19);
  // the U in board px: upper arm y 256, bend round (655, 470) r 213.8, lower arm y 684 (through the board's sphere)
  const u19 = [PL.clone(), PL.clone().lerp(fl(0, 256), 0.5), fl(0, 256), fl(330, 256)];
  for (let a = -90; a <= 90; a += 15) u19.push(fl(655 + 213.8 * Math.cos(a * DEG), 470 + 213.8 * Math.sin(a * DEG)));
  const bendIdx = u19.length;
  u19.push(fl(330, 684), fl(0, 684));
  // off the frame: on along the lower arm, a quarter turn toward the platform's edge (-x), over the lip, down the chute
  const la0 = fl(0, 684), zTurn = la0.z - 11.2, xLa = la0.x, RT = 3.0;
  u19.push(V3(xLa, yF, (la0.z + zTurn) / 2), V3(xLa, yF, zTurn));
  for (let a = 15; a <= 90; a += 15) u19.push(V3(xLa - RT + RT * Math.cos(a * DEG), yF, zTurn - RT * Math.sin(a * DEG)));
  const z20 = zTurn - RT, xEdge = xLa - RT - 3.5;
  u19.push(V3(xEdge + 1.2, yF, z20), V3(xEdge, yF, z20));
  for (let a = 30; a <= 90; a += 30) u19.push(V3(xEdge - Math.sin(a * DEG), yF - 1 + Math.cos(a * DEG), z20));
  const CHUTE = 12.0, M20 = V3(xEdge - 1, yF - 1 - CHUTE, z20);
  u19.push(V3(xEdge - 1, yF - 1 - CHUTE * 0.5, z20), M20.clone());
  // below the key: on down past the hole's lip, then into the hole (+x, away from the camera) and along the dark tunnel
  u19.push(V3(xEdge - 1, M20.y - 1.2, z20), V3(xEdge - 0.4, M20.y - 2.0, z20), V3(xEdge + 1.2, M20.y - 2.3, z20), V3(xEdge + 5, M20.y - 2.4, z20), V3(xEdge + 22, M20.y - 2.6, z20));
  const PU = path(u19), uK19 = uNear(PU, M19), uLip = uNear(PU, V3(xEdge, yF, z20)), uK20 = uNear(PU, M20), uIn = uNear(PU, V3(xEdge + 1.2, M20.y - 2.3, z20));
  const TK20 = 90.7, tLip = TK20 - PU.L * (uK20 - uLip) / 9.5, tIn = TK20 + PU.L * (uIn - uK20) / 8.5;
  mrun([[tOn, TK19, PU.L * uK19, sub(PU, 0, uK19)], [TK19, tLip, PU.L * (uLip - uK19), sub(PU, uK19, uLip)],
        [tLip, TK20, PU.L * (uK20 - uLip), sub(PU, uLip, uK20)], [TK20, tIn, PU.L * (uIn - uK20), sub(PU, uK20, uIn)],
        [tIn, 93.25, PU.L * (1 - uIn), sub(PU, uIn, 1)]], undefined, 7.0);

  /* ================= the fill: the sphere's pattern holds still while it fills the screen ================= */
  /* (fix pass, the motion review: inside the fill the screen swept five colours in ~0.65 s: the roll spun the pattern past
     the lens at 8 rad/s while the camera swung 80° over the top half a unit from the surface.) While the sphere fills the
     frame its drawn pattern turns WITH the camera's swing instead of rolling (it keeps rolling toward the camera at full
     pace; only the pattern is held), so the patch facing the lens stays put and the fill holds one gradient, like v1's
     30 → 31 fill; it eases in before and back out after. The engine's sphere table can't be told this, so the drawn
     orientation is overridden: in the window it is the table's, turned back about the rolling axis (world +x on this
     straight run) by the accumulated lag; afterwards the lag stays as a fixed offset on the sphere's body
     (q(t) · C, C = q(W1)⁻¹ · Rx(−LAG) · q(W1)), where q(W1) is recovered from the current orientation by undoing the roll
     since W1, replayed exactly as the engine integrates it. No jump anywhere: from then on it simply rolls. */
  {
    const W0 = 82.55, Wa = 82.85, Wb = 83.3, W1 = 84.3, DTs = 1 / 240;
    // EXTRA: a little more lag, eased in as the camera rises out of the sphere (83.3–84.3), so the sphere's own pattern
    // shows a face close to the boards' at keys 19 and 20 (chosen by a scan)
    const EXTRA = 2.4;
    // (0.85: the pattern follows the swing a little short of fully, so the fill drifts slowly between two hues, never frozen)
    const wOf = t => 0.85 * smooth((t - W0) / (Wa - W0)) * (1 - smooth((t - Wb) / (83.62 - Wb)));
    const i0 = Math.round(W0 / DTs), i1 = Math.round(W1 / DTs), iE = Math.ceil(93.25 / DTs) + 2;
    const pAt = i => ballAt(i * DTs), Xa = V3(1, 0, 0), UP = V3(0, 1, 0);
    let lagT = null, LAG = 0, steps = null, Minv = null;
    const build = () => {                                          // (lazily: the camera keys exist once the whole file has run)
      const phi = i => { const c = V.camAt(i * DTs), b = pAt(i); return Math.atan2(c[1] - b.y, c[2] - b.z); };
      lagT = [0]; let ph0 = phi(i0);
      for (let i = i0 + 1; i <= i1; i++) { const ph = phi(i); let dp = ph - ph0; ph0 = ph; if (dp > Math.PI) dp -= 2 * Math.PI; if (dp < -Math.PI) dp += 2 * Math.PI;
        lagT.push(lagT.at(-1) + wOf(i * DTs) * (pAt(i).distanceTo(pAt(i - 1)) + dp) + EXTRA * (smooth((i * DTs - Wb) / (W1 - Wb)) - smooth(((i - 1) * DTs - Wb) / (W1 - Wb)))); }
      LAG = lagT.at(-1);
      // the engine's roll, step by step from W1: Minv[j] undoes steps i1+1 … i1+j (a prefix product of inverse rotations)
      steps = []; Minv = [new THREE.Quaternion()];
      let axis = Xa.clone(), rate = 0, prev = pAt(i1);
      for (let i = i1 + 1; i <= iE; i++) { const p = pAt(i), d = p.clone().sub(prev); prev = p;
        if (d.lengthSq() > 1e-10 && d.lengthSq() < 4) { const ax = new THREE.Vector3().crossVectors(UP, d); if (ax.lengthSq() > 1e-14) { axis = ax.normalize(); rate = d.length(); } }
        const r = new THREE.Quaternion().setFromAxisAngle(axis, rate); steps.push(r); Minv.push(Minv.at(-1).clone().multiply(r.clone().invert())); }
    };
    let sph = null; const qa = new THREE.Quaternion(), qW = new THREE.Quaternion(), qC = new THREE.Quaternion();
    anim((t, b) => {
      if (t < W0 || t >= 93.25 || !b || !b.q) return;
      sph ||= scene.children.find(o => o.isMesh && o.material && o.material.uniforms && o.material.uniforms.ring && o.material.uniforms.avg);
      if (!sph) return;
      if (!lagT) build();
      if (t <= i1 * DTs) { const f = Math.min(lagT.length - 1.0001, Math.max(0, t / DTs - i0)), j = Math.floor(f), l = lagT[j] + (lagT[j + 1] - lagT[j]) * (f - j);
        sph.quaternion.copy(qa.setFromAxisAngle(Xa, -l).multiply(b.q)); return; }
      const f = Math.max(0, t / DTs - i1), j = Math.min(steps.length - 1, Math.floor(f)), k = Math.min(1, f - j);
      // b.q = step(j+1)^k · steps j … 1 · q(W1)  →  q(W1) = Minv[j] · step(j+1)^-k · b.q
      qW.copy(Minv[j]).multiply(qa.identity().slerp(steps[j], k).invert()).multiply(b.q).normalize();
      qC.copy(qW).invert().multiply(qa.setFromAxisAngle(Xa, -LAG)).multiply(qW);
      sph.quaternion.copy(b.q).multiply(qC);
    });
  }

  /* ================= frame 20 · the chute and the dark hole ================= */
  const D20 = depthOf(20);
  // (integration: the slow window is 89.9–91.3 (the sphere is inside the hole from ~91.1); the camera passes the board's
  //  view at 90.7 still craning down and then dives after the sphere)
  const h20 = hold(20, { pass: true, t: [TK20 - 0.8, TK20 + 0.6], tk: TK20, mark: M20, dir: [1, 0, 0], fov: FOV, plate: { depth: D20 + 4.0, in: [88.6, 89.8], out: [92.0, 92.5] } });

  /* ================= set-building helpers for the frame files (as in g2.js; nothing here builds anything) ================= */
  const SH = V.S, HH = { 16: h16, 17: h17, 18: h18, 19: h19, 20: h20 };
  const hexV3 = h => { const n = parseInt(h.slice(1), 16); return V3((n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255); };
  // no living colour shift (white shapes)
  const still = pc => { const u = pc.mesh.material.uniforms; for (const k of ['0', '1', '2']) u['p' + k].value.copy(u['c' + k].value); u.bi.value.set(-1, -1, -1); return pc; };
  // living gradients stay, but each colour drifts at most ~25% toward its partner, so the held frames keep the board's colours
  const calm = (pc, a = 0.5) => { const u = pc.mesh.material.uniforms; if (u.p0) for (const k of ['0', '1', '2']) u['p' + k].value.lerp(u['c' + k].value, 1 - a); return pc; };
  // flat at the hold: the back face is pushed out along the hold camera's view rays, so the sides are edge-on from that
  // camera and open up as soon as it moves ("flat at the hold, chunky sides when the camera moves")
  const flatGeo = (g, n, at, d, s = 1) => { const p = g.attributes.position; g.computeBoundingBox(); const zb = g.boundingBox.min.z; if (zb > -1e-6) return g;
    const t = -zb * d * HH[n].tanV / 540 * s;
    for (let i = 0; i < p.count; i++) if (p.getZ(i) < zb / 2) { const x = p.getX(i), y = p.getY(i); p.setXY(i, x + (at[0] - 960 + s * x) / s * t / d, y + (540 - at[1] + s * y) / s * t / d); }
    p.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingBox(); return g; };
  const flatFor = (pc, n, at, d, s = 1) => { flatGeo(pc.mesh.geometry, n, at, d, s); return pc; };
  // phase-lock a piece's living gradient so it sits exactly on its board colours at its hold's key instant and flows elsewhere
  const lock = (pc, tk, k = 2) => { const u = pc.mesh.material.uniforms; if (!u.per) return pc; u.per.value = tk / (0.8 * k); u.ph.value = (Math.PI - 2 * Math.PI * tk / u.per.value) / 2; return pc; };
  // a board piece: V.piece, calmed, colour-locked to its hold's key instant (lockT to override) and flat at its hold
  const PC = spec => { const pc = lock(calm(V.piece(spec)), spec.lockT ?? HH[spec.hold].tk, spec.lockK ?? 2); return spec.flat === false ? pc : flatFor(pc, spec.hold, spec.at || [960, 540], spec.depth); };
  // opacity windows [in0, in1, out0, out1] (several allowed) for a mesh with an engine material (uniform op)
  const fades = (m, wins) => anim(t => {
    let a = 0;
    for (const [a0, a1, b0, b1] of wins) { const k = Math.min(Math.min(1, Math.max(0, (t - a0) / Math.max(1e-3, a1 - a0))), 1 - Math.min(1, Math.max(0, (t - b0) / Math.max(1e-3, b1 - b0)))); a = Math.max(a, k * k * (3 - 2 * k)); }
    m.visible = a > 0.002; m.material.uniforms.op.value = a;
  });
  const showIf = (m, t0, t1) => anim(t => { m.visible = t >= t0 && t <= t1; });

  /* ================= the sets: groups/g4/f16.js … f20.js ================= */
  // Each is export default (V, G) => { … }. f17's ambient discs are a second export, built after f18 only so that every
  // material keeps its creation order (the engine seeds each material's living-gradient phase from a global counter); that
  // kept this split pixel-identical. A builder may fold them into f17's default export (ambient is called only if it exists).
  {
    const G = { V, THREE, V3, DEG, FOV, TAN, depthOf, GRAV, GD, ballAt, path, sub, uNear, toss, aim, basis, rayOf, ribbon, smooth, sm: smooth,
      SH, HH, hexV3, still, calm, flatGeo, flatFor, lock, PC, fades, showIf,
      h16, h17, h18, h19, h20,
      // 16: the meander, bounced across (RD: the bounces' physics in the track plane (contacts, arcs); trk: track plane →
      // world; T16: its moments; tDet16: the last contact, off the last arch; dip16(t): the band's dip under a contact),
      // and the flight onto disc B
      D16, TK16, w16, RD, trk, T16, G16, tDet16, dip16, A, A0, tA, vinB, noDiscA: true,
      // 17: the disc ricochets (B above the board, D1–D4 on it, E1 and E2 below it), then the landing on the swirl's tip
      D17, PX17, M17, TK17, hops, w17, B_, D1, D2, D3, D4, E1, E2, Lp, tB, tD1, tD2, tD3, tD4, tE1, tE2, tLand,
      vAB, vBD1, vD12, vD2K, vD34, vD4E1, vE12, vE2L,
      // 18: the swirl's ball-centre helix (axis ax, az; θ = THK at the key, THL at the landing, THE at the exit)
      THK, RK, PITCH, DRAD, THL, THE, rOf, ax, az, yK, helix, hpts, M18, D18, TK18, H1, H2, tExit, yH, rOf0, helix0, TIL, BUL, bulge, coreE, Lp0,
      // 18 → 19: off the swirl toward the camera, down onto the U's upper arm
      PE, vExit, yF, sLand, tOn, PL,
      // 19: the U seen from above (fl: board 19 px → the floor plane), and on to the edge, the chute and the hole
      DIR19, B19, D19, TK19, pos0, floor0, fl, bendQ, armLen, M19, u19, bendIdx, la0, zTurn, xLa, RT, z20, xEdge, CHUTE, M20,
      PU, uK19, uLip, uK20, uIn, TK20, tLip, tIn,
      // 20: the wall with the chute, and the dark hole
      D20 };
    setFor(16)(V, G); setFor(17)(V, G); setFor(18)(V, G); setFor(17, 'ambient')(V, G); setFor(19)(V, G); setFor(20)(V, G);
  }
  dip(93.25);

  /* ================= camera ================= */
  /* NEVER STOP (user, 21:50: "ease into that keyframe and then ease back out from the keyframe, so you're never actually
     stopping"). Every hold is an ease-through (hold(n, { pass: true })): the camera passes each board's exact pose at its
     key instant still moving, slowed to about a quarter of the neighbouring moves' cruise, and never stops anywhere from
     the wipe to the dark hole.
     The whole shot is ONE smooth camera curve: a quintic Hermite through poses (position, view direction, look distance,
     look-follow and lens are continuous up to acceleration), laid as keys every 0.025 s. Each key instant is a pose with a
     set velocity (the pass speed, along the path) and no acceleration, so it is the slowest moment of a smooth dip, not a
     kink. Between two key instants the poses are re-timed on one speed profile: the pass speed, a gentle rise through the
     hold's slow window (t0–t1, which the copy reads in), a smoothstep ramp to a steady cruise, and back down. The look-follow
     is baked in toward the sphere averaged over ±0.2 s, so the ricochets and the hard landing on the U don't jerk the view.
     READING TIME (2026-09-29, the user: "add about ½ second where it's under ~1.3 s (e.g. 24, 25), borrowing time from the
     travel between frames so the piece stays 2:27"). The camera keeps its slow pass a little longer after keys 16, 18, 19
     and 20 before it carries the copy off, and makes the time up in the travel that follows (every key instant, key pose,
     pass speed, sphere mark and cut is unchanged; the copy files build in a little earlier too):
     · 16: the chase blends in more slowly (CHW, below): ~3.1–3.8 u/s to ~70.8, then one steady climb to the crane;
     · 18: the stretch to the drop to floor level is time-warped (warpOut): ~2–2.5 u/s to ~79.8, peak 11.2 u/s (was 9.4);
     · 19: the move to 20 re-times with a 0.7 s slow stretch after the key (was 0.45): cruise 19.6 u/s (was 18.6); its
       one long first segment dips to ~5.1 u/s ~0.3 s after the 5.9 u/s pass (it dipped to ~5.7 before), ~26 % of cruise;
     · 20: the dive re-times with a 0.6 s slow stretch (was 0.45) on dense poses (densify): it never drops below the pass,
       peak 23.9 u/s (was 21.9), the same hand-over at 93.24.
     No new jolt (camprobe's largest jumps are the cuts' and the fill's, as before).
     THE START (polish, 2026-09-29): the shot's first key sits at the cut (66.85, under G3's wipe) and the engine starts a
     shot's camera from rest on it; one more key 0.5 ms after it (emit) gives the camera its speed at once, so it moves at
     a steady ~4.9 u/s from the first shown frame instead of rising from 0 and overshooting to ~6.4 u/s by 66.875. */
  const Vec = THREE.Vector3, DTK = 0.025, FW = V3(0, 0, -1);
  const PV = (pos, look, f, fov) => [...pos.toArray(), ...look.toArray(), f, fov];
  const Kp = (t, pos, look, f, fov, o = {}) => ({ t, v: PV(pos, look, f, fov), ...o });
  const ballS = (t, w = 0.2) => { const S = new Vec(); let Wt = 0;
    for (let i = -8; i <= 8; i++) { const k = 0.5 + 0.5 * Math.cos(Math.PI * i / 9); S.addScaledVector(ballAt(t + w * i / 8), k); Wt += k; } return S.multiplyScalar(1 / Wt); };
  const q5 = (p0, v0, a0, p1, v1, a1, h, u) => { const u2 = u * u, u3 = u2 * u, u4 = u3 * u, u5 = u4 * u;
    return p0 * (1 - 10 * u3 + 15 * u4 - 6 * u5) + h * v0 * (u - 6 * u3 + 8 * u4 - 3 * u5) + h * h * a0 * (0.5 * u2 - 1.5 * u3 + 1.5 * u4 - 0.5 * u5)
      + h * h * a1 * (0.5 * u3 - u4 + 0.5 * u5) + h * v1 * (-4 * u3 + 7 * u4 - 3 * u5) + p1 * (10 * u3 - 15 * u4 + 6 * u5); };
  const toW = v => { const w = new Vec(v[3] - v[0], v[4] - v[1], v[5] - v[2]), Lw = w.length(); w.multiplyScalar(1 / Lw); return [v[0], v[1], v[2], w.x, w.y, w.z, Lw, v[6], v[7]]; };
  const fromW = w => { const d = new Vec(w[3], w[4], w[5]).normalize(); return [w[0], w[1], w[2], w[0] + d.x * w[6], w[1] + d.y * w[6], w[2] + d.z * w[6], w[7], w[8]]; };
  const Z9 = () => new Array(9).fill(0);
  const tang = (m, d) => { const k = m[3] * d[3] + m[4] * d[4] + m[5] * d[5]; for (let q = 3; q < 6; q++) m[q] -= k * d[q]; return m; };
  const moves = [];
  // P: poses { t, v, still?, own? (an engine key sits there: the pass), sp? (camera speed there), dw?/aw? (preset velocity /
  // acceleration in the curve's channels), vend? (a free end's speed factor) }. A free first / last pose moves along the
  // chord to its neighbour (× vend), with no acceleration. Returns the curve; emit() lays its keys.
  const move = P => { const n = P.length;
    for (const p of P) p.w = toW(p.v);
    const d3 = (p, q, j) => Math.hypot(p.w[j] - q.w[j], p.w[j + 1] - q.w[j + 1], p.w[j + 2] - q.w[j + 2]);
    for (let i = 0; i < n; i++) { const p = P[i]; if (p.dw) continue;
      if (p.still) { p.dw = Z9(); continue; }
      if (i === 0 || i === n - 1) { const A = P[i === 0 ? 0 : i - 1], B = P[i === 0 ? 1 : i];
        p.dw = tang(A.w.map((_, j) => (B.w[j] - A.w[j]) / (B.t - A.t) * (p.vend ?? 1)), p.w);
        if (p.sp != null) { const L = Math.hypot(p.dw[0], p.dw[1], p.dw[2]); for (let j = 0; j < 3; j++) p.dw[j] *= p.sp / L; }   // a free end at a set speed
        continue; }
      const A = P[i - 1], B = P[i + 1], m = tang(p.w.map((_, j) => (B.w[j] - A.w[j]) / (B.t - A.t)), p.w);
      for (const j of [0, 3]) { const Lm = Math.hypot(m[j], m[j + 1], m[j + 2]), want = j === 0 && p.sp != null ? p.sp : (d3(A, p, j) / (p.t - A.t) + d3(p, B, j) / (B.t - p.t)) / 2;
        if (Lm > 1e-6) for (let q = j; q < j + 3; q++) m[q] *= want / Lm; }
      p.dw = m; }
    for (let i = 0; i < n; i++) if (!P[i].aw) { if (P[i].still || i === 0 || i === n - 1) { P[i].aw = Z9(); continue; }
      const A = P[i - 1], C = P[i], B = P[i + 1], hA = C.t - A.t, hB = B.t - C.t;
      P[i].aw = C.w.map((_, j) => ((6 * (A.w[j] - C.w[j]) + 2 * hA * A.dw[j] + 4 * hA * C.dw[j]) / (hA * hA) + (6 * (B.w[j] - C.w[j]) - 4 * hB * C.dw[j] - 2 * hB * B.dw[j]) / (hB * hB)) / 2); }
    const at = t => { let i = 0; while (i < n - 2 && t > P[i + 1].t) i++;
      const A = P[i], B = P[i + 1], h = B.t - A.t, u = Math.min(1, Math.max(0, (t - A.t) / h));
      return fromW(A.w.map((_, j) => q5(A.w[j], A.dw[j], A.aw[j], B.w[j], B.dw[j], B.aw[j], h, u))); };
    const M = { P, at, t0: P[0].t, t1: P[n - 1].t }; moves.push(M); return M; };
  const emit = M => { const { P, at, t0, t1 } = M, NK = Math.round((t1 - t0) / DTK), n = P.length;
    for (let k = 0; k <= NK; k++) { const t = t0 + (t1 - t0) * k / NK;             // (evenly spaced: an odd last gap kinks the key Hermite)
      if (P.some(p => p.own && Math.abs(p.t - t) < 0.01)) continue;               // the pass's own engine key sits there
      if (k === 0 && moves.indexOf(M) > 0) continue;                               // the previous move's last key
      const v = at(t), f = Math.min(1, Math.max(0, v[6]));
      key(t, new Vec(v[0], v[1], v[2]), new Vec(v[3], v[4], v[5]).lerp(ballS(t), f), { f: 0, fov: v[7] }); }
    // (polish, 2026-09-29: "G4's camera starts from rest at the 66.85 wipe reveal … give it a non-zero start velocity") a
    // move that starts free (the shot's first key, at the cut): the engine starts the camera from rest on a shot's first
    // key, so it set off from 0 at 66.85 and overshot to ~6.4 u/s by 66.866 (the first 30 fps frame) before it settled on
    // the curve's own ~4.9 u/s at 66.875. One more key 0.5 ms after it (as g3.js does at its cuts) gives the camera its
    // speed and direction at once: the start from rest falls inside the cut's first half millisecond, under the wipe, so
    // every shown frame (and every 120 Hz probe sample) sees it already drifting on its way
    if (moves.indexOf(M) === 0 && !P[0].still) { const t = t0 + 5e-4, v = at(t), f = Math.min(1, Math.max(0, v[6]));
      key(t, new Vec(v[0], v[1], v[2]), new Vec(v[3], v[4], v[5]).lerp(ballS(t), f), { f: 0, fov: v[7] }); }
    // a move that ends free (the shot's last key, at the cut): the engine stops the camera on a shot's last key, so one more
    // key 0.5 ms before it keeps the full speed through the last shown frame
    if (!P[n - 1].still && !P[n - 1].own) { const t = t1 - 5e-4, v = at(t), f = Math.min(1, Math.max(0, v[6]));
      key(t, new Vec(v[0], v[1], v[2]), new Vec(v[3], v[4], v[5]).lerp(ballS(t), f), { f: 0, fov: v[7] }); } };
  // a pose following the sphere at t from `dist` in front (the animatic's follow keys), offset (dx, dy)
  const fP = (t, dist, dx = 0, dy = 0, f = 0.35, fov = 28) => { const b = ballAt(t), p = b.clone().add(V3(dx, dy, 0)).addScaledVector(FW, -dist); return Kp(t, p, p.clone().addScaledVector(FW, dist), f, fov, { lo: V3(dx, dy, 0) }); };
  // a hold's pass pose: its exact board camera at tk, passing at sp u/s (along dir if given, else along the path)
  const hP = (h, sp, o = {}) => ({ t: h.tk, v: PV(h.pos, h.look, 0, h.fov), own: true, pass: true, sp, ...o });
  // the pass's velocity in every channel: the chord between its neighbours (the moves either side), slowed so the camera
  // passes at sp; no acceleration (the slowest moment of the dip). turn0: the view doesn't turn at the key
  const passDW = (p, A, B) => { for (const q of [A, p, B]) q.w = toW(q.v);
    const m = tang(p.w.map((_, j) => (B.w[j] - A.w[j]) / (B.t - A.t)), p.w), L = Math.hypot(m[0], m[1], m[2]);
    for (let j = 0; j < 9; j++) m[j] *= p.sp / L;
    if (p.dir) { const d = V3(...p.dir).normalize(); m[0] = d.x * p.sp; m[1] = d.y * p.sp; m[2] = d.z * p.sp; }
    if (p.turn0) for (let j = 3; j < 9; j++) m[j] = 0;
    p.dw = m; p.aw = Z9(); };
  // re-time a move so the camera runs its path (the poses' places, in order) on one smooth speed profile: vA at the first
  // pose, rising g× over the slow window (wA s), a smoothstep ramp (rA s) to a steady cruise, and back down to vB (a still
  // end: from / to rest). Each pose keeps its place; a pose placed relative to the sphere (lo) keeps looking at the sphere
  // where it is at its new time. Returns the cruise speed.
  const retimeV = (P, vA, vB, { wA = 0.45, rA = 0.8, wB = 0.45, rB = 0.8, g = 1.15 } = {}) => {
    const n = P.length, T = P[n - 1].t - P[0].t, cum = [0];
    for (let i = 1; i < n; i++) cum.push(cum[i - 1] + Math.hypot(...[0, 1, 2].map(j => P[i].v[j] - P[i - 1].v[j])));
    if (!vA) wA = 0; if (!vB) wB = 0;
    const sc = Math.min(1, 0.9 * T / (wA + rA + wB + rB)); wA *= sc; rA *= sc; wB *= sc; rB *= sc;
    const K = [[0, vA, 0], [wA, vA * g, 0], [wA + rA, 0, 1], [T - wB - rB, 0, 1], [T - wB, vB * g, 0], [T, vB, 0]];
    let c0 = 0, c1 = 0; for (let i = 0; i < 5; i++) { const h = K[i + 1][0] - K[i][0]; c0 += h * (K[i][1] + K[i + 1][1]) / 2; c1 += h * (K[i][2] + K[i + 1][2]) / 2; }
    const vc = (cum[n - 1] - c0) / c1, vel = K.map(k => k[1] + k[2] * vc);
    const D = t => { let d = 0; for (let i = 0; i < 5; i++) { const a = K[i][0], b = K[i + 1][0]; if (t <= a || b <= a) continue; const h = b - a, x = Math.min(1, (t - a) / h);
      d += h * (vel[i] * x + (vel[i + 1] - vel[i]) * (x ** 3 - x ** 4 / 2)); } return d; };
    const vOf = t => { for (let i = 0; i < 5; i++) { const a = K[i][0], b = K[i + 1][0]; if (t <= b && b > a) { const x = Math.max(0, (t - a) / (b - a)); return vel[i] + (vel[i + 1] - vel[i]) * x * x * (3 - 2 * x); } } return vB; };
    for (let i = 1; i < n - 1; i++) { let lo = 0, hi = T; for (let k = 0; k < 50; k++) { const m = (lo + hi) / 2; if (D(m) < cum[i]) lo = m; else hi = m; }
      const p = P[i]; p.t = P[0].t + (lo + hi) / 2; p.sp = vOf((lo + hi) / 2);
      if (p.lo) { const lk = ballAt(p.t).add(p.lo); p.v[3] = lk.x; p.v[4] = lk.y; p.v[5] = lk.z; } }
    return vc; };
  // an analytic stretch of the curve: poses every dt with their exact velocity and acceleration (numerical), so the quintic
  // reproduces the function between them
  // (e: the finite-difference step; frame 16's bounce passes 0.012, so a pose never takes its acceleration off a kink)
  const anaPoses = (fn, a, b, dt = 0.06, e = 1e-3) => { const out = [], n = Math.max(1, Math.round((b - a) / dt));
    for (let k = 0; k <= n; k++) { const t = a + (b - a) * k / n, w0 = toW(fn(t)), wm = toW(fn(t - e)), wp = toW(fn(t + e));
      out.push({ t, v: fn(t), dw: w0.map((_, j) => (wp[j] - wm[j]) / (2 * e)), aw: w0.map((_, j) => (wp[j] - 2 * w0[j] + wm[j]) / (e * e)) }); }
    return out; };

  // pass speeds at the key instants (u/s): ~20–30% of the moves' cruise either side (16's approach out of the wipe is a slow
  // drift throughout, so 16 passes at about its own drift speed); 19 passes sideways with the view not turning
  const Q17 = hP(h17, 2.65), Q18 = hP(h18, 2.0), Q19 = hP(h19, 3.8, { dir: [-0.35, 0, -1], turn0: true }), Q20 = hP(h20, 4.2);

  /* start → 16 → the flight to disc B: the rollercoaster camera (2026-09-28; re-aimed at the bounces the same day), one
     analytic curve sampled as poses with their exact velocity and acceleration (anaPoses), so the quintic reproduces it:
     · the ride (66.85 →): LOW AND ANGLED, behind and in front of the sphere (a chase from its front-left, a little above
       the track, looking along it), riding its ups and downs: it follows a reference that is the sphere smoothed over
       ±0.3 s, with the drop replaced by the track under it (the ball drops INTO a steady frame) and only KY of the
       bounces' height (so the ball climbs and drops in the frame); the view tilts with the sphere's height (KL of it,
       smoothed ±0.15 s) so the hops stay in frame;
     · the swing (from SW0): it blends onto a slow drift through board 16's exact pose at the key instant (a smootherstep,
       flat at both ends, so the camera arrives on the drift's own velocity VK: an ease-through, never a stop): the
       position blends and the view direction turns (slerp) from the chase's to the board's, the lens closes to 26°;
     · the chase (after the key): from the drift it blends onto a follow that rides FOL of the sphere's sideways move and
       FY of its fall (the bounce on to the last arch, the pop off it, the fall onto disc B), turning part-way toward it
       and leaning toward disc B; the crane down to board 17 takes over from T3a. */
  const s5 = x => { x = Math.min(1, Math.max(0, x)); return x * x * x * (10 - 15 * x + 6 * x * x); };
  // (fix pass, the reviews: "the lob reads as a hovering ball with the world moving under it": the camera now takes only
  //  KY 0.15 of the bounces' height (was 0.45) and tilts with KL 0.1 (was 0.25), so the ball visibly climbs and drops)
  const C0 = RD.C[0], vx0 = RD.arcs[1].v[0], KY = 0.15, KL = 0.1;
  const ref16 = t => t < C0.t ? trk(C0.p[0] + vx0 * (t - C0.t), RD.YF) : ballAt(t);            // (the drop replaced by the track under it)
  const refR = t => { const b = ref16(t); b.y = h16.mark.y + RD.YF + KY * (b.y - h16.mark.y - RD.YF); return b; };   // (KY of the height)
  // (a raised-cosine average; 61 taps, because the bounces are sharp velocity changes and each tap crossing one steps the
  //  camera's acceleration)
  const smo = (f, t, w, N = 30) => { const S = new Vec(); let Wt = 0; for (let i = -N; i <= N; i++) { const k = 0.5 + 0.5 * Math.cos(Math.PI * i / (N + 1)); S.addScaledVector(f(t + w * i / N), k); Wt += k; } return S.multiplyScalar(1 / Wt); };
  const refS = (t, w) => smo(ref16, t, w);
  // Catmull-Rom (non-uniform) through [t, [values]] keys, flat outside
  const crK = K => t => { if (t <= K[0][0]) return K[0][1].slice(); if (t >= K.at(-1)[0]) return K.at(-1)[1].slice();
    let i = 0; while (t > K[i + 1][0]) i++;
    const [t0, a] = K[i], [t1, b] = K[i + 1], h = t1 - t0, u = (t - t0) / h, u2 = u * u, u3 = u2 * u;
    const m = (j, k) => { const P = K[Math.max(0, j - 1)], N = K[Math.min(K.length - 1, j + 1)]; return (N[1][k] - P[1][k]) / (N[0] - P[0]) * (j === 0 || j === K.length - 1 ? 0.5 : 1); };
    return a.map((v, k) => (2 * u3 - 3 * u2 + 1) * v + (u3 - 2 * u2 + u) * h * m(i, k) + (-2 * u3 + 3 * u2) * b[k] + (u3 - u2) * h * m(i + 1, k)); };
  // the chase: camera offset from the reference [dx, dy, dz], look offset [lx, ly, lz], lens
  // (the bounce: from the landing on the left end it pulls back, so the first hop reads as a bounce over onto the first
  //  arch with the track in view; fix pass 2: the drop now lands at 67.59, so the pull-back starts there and frames the
  //  left end and the first arch together at the first hop's top, ~68.3)
  const CH = crK([
    [66.85, [-6.6, 1.5, 6.4, 4.2, -0.5, -1.2, 46]],
    [67.6, [-6.6, 1.6, 7.6, 4.0, 0.0, -1.1, 45]],
    [68.25, [-7.0, 2.1, 11.5, 3.2, 0.5, -1.0, 43]],
    [68.8, [-7.0, 2.0, 14.0, 2.6, 0.6, -0.8, 40]],
    [69.3, [-7.0, 1.8, 16.0, 2.2, 0.6, -0.6, 38]],
    [69.8, [-7.0, 1.6, 17.0, 2.0, 0.6, -0.5, 36]],
    [70.4, [-7.0, 1.6, 18.0, 2.0, 0.6, -0.5, 34]]]);
  const SW0 = 67.95, DT16 = 0.3, VK = V3(2.9, 0.1, 1.2);                     // the swing's start; the drift's velocity through the key
  const keyP = t => h16.pos.clone().addScaledVector(VK, t - TK16), FWD16 = V3(0, 0, -1);
  // (the chase pushes in and edges right, so the track's depth shows. Fix pass 2: it pushes in less (-6.5, was -9) so disc B
  //  fits in, and the crane down to board 17 (from T3a) starts earlier (71.6, was 72.35), so the camera takes the fall
  //  onto B and the ricochet in one steady descent: 2.7–17.8 u/s (was a slow 4.5 at 72.1, then a 28 u/s whoosh))
  const T3a = 71.6, PUSH = V3(2.6, 0.4, -6.5);
  // (reading time, 2026-09-29, the user: "add about ½ second where it's under ~1.3 s …, borrowing time from the travel
  //  between frames so the piece stays 2:27") The chase takes over from the drift through the key more slowly: it blends
  //  in over CHW = 2.2 s from key + CH0 = 0.1 (was 1.1 s from the key) and the push-in starts at key + 0.3 (was + 0.1), so
  //  the camera stays at about the pass speed (3.1–3.8 u/s) to ~70.8 instead of reaching 8.9 u/s there. It makes the time up
  //  in one steady climb to the crane (12.6 u/s at ~71.7, where it used to dip to 6.6 between the chase and the crane).
  const CH0 = 0.1, CHW = 2.2;
  // (fix pass, the motion review: "the chase parks the sphere on screen … the world sliding up behind a ball hanging
  //  mid-frame", the camera locked to the sphere. The chase now rides most of the sphere's sideways move (FOL) but hardly
  //  any of its fall (FY: 0.8 → 0.1 as it pops off the last arch; the crane to board 17 carries the camera down), and the
  //  view leans toward disc B (LB) with a slightly wider lens (FW16), so B is in frame from ~71.75 as the fall's target:
  //  the sphere pops up ~260 px off the last arch and drops onto B as B rises to meet it.)
  const FOL = 0.8, FY = t => 0.8 - 0.7 * s5((t - 70.95) / 0.45);
  // (FY applies to the sphere's vertical VELOCITY, integrated (a table at 240 Hz), not to its displacement: easing FY down
  //  then never gives back height the camera already followed, which pushed the camera up at ~71.1)
  const YI = (() => { const dt = 1 / 240, n = Math.ceil((TK17 + 0.5 - TK16) / dt), a = new Float64Array(n + 1); let prev = refS(TK16, 0.25).y;
    for (let i = 1; i <= n; i++) { const y = refS(TK16 + i * dt, 0.25).y; a[i] = a[i - 1] + FY(TK16 + (i - 0.5) * dt) * (y - prev); prev = y; }
    return t => { const f = Math.min(n, Math.max(0, (t - TK16) / dt)), i = Math.min(n - 1, Math.floor(f)); return a[i] + (a[i + 1] - a[i]) * (f - i); }; })();
  const LB = t => 0.9 * s5((t - 71.25) / 0.75) * (1 - s5((t - 72.95) / 0.6)), FW16 = 4.5;   // (FW16: the chase's extra lens, deg)
  // (the drift through board 17's pose: its pass speed Q17.sp, toward the next move's first pose; the view doesn't turn there)
  const C17 = fP(75.75, 32.0, 5.0, 0.5, 0.3), VK17 = V3(C17.v[0], C17.v[1], C17.v[2]).sub(h17.pos).normalize().multiplyScalar(Q17.sp);
  const key17P = t => h17.pos.clone().addScaledVector(VK17, t - TK17);
  const turnTo = (a, b, w) => a.clone().applyQuaternion(new THREE.Quaternion().slerp(new THREE.Quaternion().setFromUnitVectors(a, b), w)).normalize();
  const cam16 = t => {
    let P, D, fov;
    if (t <= TK16) {
      const r = smo(refR, t, 0.3), c = CH(t), Pc = r.clone().add(V3(c[0], c[1], c[2])), Lk = r.clone().add(V3(c[3], c[4], c[5]));
      Lk.y += KL * (smo(ref16, t, 0.15).y + c[4] - Lk.y);                                     // (the view tilts with the sphere's height)
      const Dc = Lk.sub(Pc).normalize();
      const w = s5((t - SW0) / (TK16 - SW0));
      // (the view finishes turning DT16 s before the position arrives: at the end of the swing a turn would cancel the
      //  drift on screen and the picture would stand still for a moment)
      P = Pc.lerp(keyP(t), w); D = turnTo(Dc, FWD16, s5((t - SW0) / (TK16 - DT16 - SW0))); fov = c[6] + (FOV - c[6]) * w;
    } else {
      const w = s5((t - TK16 - CH0) / CHW), w3 = s5((t - T3a) / (TK17 - T3a)), r = refS(t, 0.25), r0 = refS(TK16, 0.25), dr = r.clone().sub(r0);
      const Pf = h16.pos.clone().add(V3(FOL * dr.x, YI(t), FOL * dr.z)).add(PUSH.clone().multiplyScalar(s5((t - TK16 - 0.3) / 1.9)));
      const Pc = keyP(t).lerp(Pf, w), Dc = Pc.clone().addScaledVector(FWD16, 36).lerp(r.clone().lerp(B_, LB(t)), 0.5 * w).sub(Pc).normalize();
      P = Pc.lerp(key17P(t), w3); D = turnTo(Dc, FWD16, w3); fov = (FOV + FW16 * w) * (1 - w3) + FOV * w3;
    }
    return PV(P, P.clone().addScaledVector(D, 10), 0, fov);
  };
  const mA = anaPoses(cam16, 66.85, TK16, 0.05, 0.012);
  const Q16a = mA.at(-1); Object.assign(Q16a, { own: true, pass: true });   // (the hold's own key sits at the key instant)
  // 16 → 17: one curve on to board 17's pose (its own key sits at the key instant too)
  const mB = [Q16a, ...anaPoses(cam16, TK16, TK17, 0.05, 0.012).slice(1)];
  Object.assign(mB.at(-1), { own: true, pass: true, sp: Q17.sp });
  // 17 → 18: crane down with the ricochets onto the swirl, easing closer, then round the coils
  const mC = [mB.at(-1), C17, fP(76.7, 27.0, 3.2, -1.6, 0.3, 27), Q18];
  // 18 → 19: down to the sphere's level as it comes off the swirl; it runs into the lens (fill); inside the fill the camera
  // swings over the top of it, then rises straight up looking down (the view direction fixed: the screen never turns),
  // lifting on an even zoom (the height grows exponentially, eased) and drifting onto hold 19's pose, which it passes
  // sliding sideways after the sphere (screen left and down), still rising to a halt
  const d19 = V3(...DIR19), mD = [Q18];
  // (fix pass, the motion review: the sphere is behind the swirl ~80.7–81.4 while the camera sank slowly over it, the
  //  flattest stretch in G4; the drop to floor level now comes 0.35 s earlier, so a clear descent carries that moment)
  { const b = ballAt(81.25), p = V3(b.x, yF + 1.0, PL.z + 14.5); mD.push(Kp(81.25, p, p.clone().add(V3(0, -0.8, -12)), 0.35, 32)); }
  { const b = ballS(82.35), p = V3(b.x, yF + 0.4, b.z + 7.2); mD.push(Kp(82.35, p, b, 0.6, 38)); }   // (7.2, was 6.0: the camera's turn-back happens inside the fill, so it never stands still where it can be seen)
  { const b = ballS(82.9); mD.push(Kp(82.9, b.clone().add(V3(0, 0.28, 1.5)), b, 1, 40)); }
  { const b = ballS(83.12); mD.push(Kp(83.12, b.clone().add(V3(-0.08, 1.12, 1.08)), b, 1, 40)); }
  // (fix pass, the motion review: the rise whooshed to 30.7 u/s and braked to the 3.8 u/s pass in its last 0.6 s. The zoom
  //  is now front-loaded (the fastest climb comes earlier and it eases out over the last second) and keeps a little of
  //  its climb through the key (a small linear part), so it peaks at ~20 u/s and passes board 19 at ~5 u/s, still rising
  //  slowly and sliding after the sphere; hold 19's pass takes the rise's own velocity there, so the join is exact)
  { const T0 = 83.36, T1 = TK19, HB = 1.56, s5 = s => { s = Math.min(1, Math.max(0, s)); return s * s * s * (10 - 15 * s + 6 * s * s); };
    const eR = s => 0.87 * s5(Math.pow(Math.min(1, Math.max(0, s)), 0.55)) + 0.13 * s;
    const DA = (h19.pos.y - yF) / -d19.y, aim19 = h19.pos.clone().addScaledVector(d19, DA), dv = V3(...Q19.dir).normalize().multiplyScalar(Q19.sp);
    const rise = t => { const s = (t - T0) / (T1 - T0), e = eR(s), H = HB * Math.pow(DA / HB, e), b = ballS(t);
      const C = b.clone().addScaledVector(b.clone().sub(aim19), -e * H / DA).addScaledVector(dv, (t - T1) * smooth(s));
      return PV(C.clone().addScaledVector(d19, -H), C, 0, 40 - (40 - FOV) * s5(s)); };
    mD.push(...anaPoses(rise, T0, T1 - 0.1, 0.08));
    const vR = V3(...rise(T1).slice(0, 3)).sub(V3(...rise(T1 - 1e-3).slice(0, 3))).multiplyScalar(1e3);
    Q19.dir = vR.toArray(); Q19.sp = vR.length(); }
  mD.push(Q19);
  // 19 → 20: a pure tilt about world z (screen-right stays +z) while craning down past the edge, centred on the sphere
  const tiltP = (t, pitch, dist, lead = 0, fov = 30) => { const b = ballAt(t), d = V3(Math.cos(pitch * DEG), Math.sin(pitch * DEG), 0), p = b.clone().addScaledVector(d, -dist).add(V3(0, 0, lead)); return Kp(t, p, p.clone().addScaledVector(d, dist), 0, fov, { lo: V3(0, 0, lead) }); };
  const mE = [Q19, tiltP(87.2, -76, 26, -1.0, 29), tiltP(88.0, -58, 25, -1.5, 30), tiltP(88.8, -34, 25.5, -1.2, 30), tiltP(89.4, -14, 26.5, 1.0, 28), Q20];
  // 20: dive into the hole after the sphere (the 93.24 pose is the hand-over: inside the dark tunnel, at the dip)
  const hole = h20.at(190, 1000, D20 + 4.0), fx = V3(1, -0.03, 0);
  const p1 = h20.pos.clone().lerp(hole, 0.5), p2 = hole.clone().add(V3(-2.0, 0, 0)), p3 = V3(xEdge + 8.0, M20.y - 2.3, z20 + 0.3);
  const mF = [Q20, Kp(92.2, p1, p1.clone().addScaledVector(fx, 12), 0.1, 30), Kp(92.75, p2, p2.clone().addScaledVector(fx, 10), 0.25, 38),
    Kp(93.24, p3, p3.clone().addScaledVector(fx, 10), 0.4, 40, { sp: 14 })];

  retimeV(mC, Q17.sp, Q18.sp);
  retimeV(mE, Q19.sp, Q20.sp, { wA: 0.7 });                            // (reading time: 19's slow stretch 0.7 s, was 0.45)
  retimeV(mF, Q20.sp, mF.at(-1).sp, { wB: 0, rB: 0.3 });
  passDW(Q18, mC.at(-2), mD[1]); passDW(Q19, mD.at(-2), mE[1]); passDW(Q20, mE.at(-2), mF[1]);
  // (reading time, 2026-09-29) 18: re-time the stretch from hold 18's pass to the next pose (81.25): the same path, slower for
  // longer after the key and quicker later (peak 11.2 u/s, was 9.4), by a time-warp t → t − K·u³(1−u)^N (u across the
  // stretch; the camera runs up to W = 0.1 s behind its old timing, most of it ~0.4 s after the key). C2 at both ends, so
  // the pass and the curve from the next pose on are untouched (that pose keeps the velocity and acceleration it had).
  const warpOut = (P, W, N = 4) => { if (!(W > 0)) return P;
    const tmp = move(P.map(p => ({ ...p, v: p.v.slice() }))); moves.pop();
    const a = P[0].t, b = P[1].t, T = b - a, g = u => u ** 3 * (1 - u) ** N, K = W / g(3 / (3 + N));
    const wt = t => { const u = (t - a) / T; return u <= 0 || u >= 1 ? t : t - K * g(u); };
    P[1].dw = tmp.P[1].dw; P[1].aw = tmp.P[1].aw;
    return [P[0], ...anaPoses(t => tmp.at(wt(t)), a, b, 0.05).slice(1, -1), ...P.slice(1)]; };
  // (reading time) 20: the dive's first stretch (the pass to the next pose) is laid as dense poses along its own path, then
  // the whole dive is re-timed with a 0.6 s slow stretch after the key (was 0.45), so the camera follows the new speed
  // profile exactly: it never drops below its 4.2 u/s pass (re-timing the sparse poses with a longer slow stretch made the
  // one long first segment undershoot to ~3.6 u/s; a time-warp like 18's nearly stopped it), and it makes the time up in
  // the dive (peak 23.9 u/s, was 21.9). The rest of the dive keeps its sparse poses, so its brake into the tunnel is as
  // smooth as before, and the hand-over pose at 93.24 is unchanged.
  const densify = (P, dt = 0.1) => { const tmp = move(P.map(p => ({ ...p, v: p.v.slice() }))); moves.pop();
    const out = [P[0]], n = Math.round((P[1].t - P[0].t) / dt); for (let k = 1; k < n; k++) { const t = P[0].t + (P[1].t - P[0].t) * k / n; out.push({ t, v: tmp.at(t) }); }
    return [...out, ...P.slice(1)]; };
  const mF2 = densify(mF); retimeV(mF2, Q20.sp, mF.at(-1).sp, { wA: 0.6, wB: 0, rB: 0.3 });
  for (const P of [mA, mB, mC, warpOut(mD, 0.1), mE, mF2]) emit(move(P));

  /* ================= captions ================= */
  note(66.85, T16.a1, '16 · out of the wipe the sphere drops in from above onto the meander\'s left end and bounces up and over onto the first arch; the camera rides with it, low and angled, and swings round to the front');
  note(T16.a1, h16.t1, '16 · no stop: the springy arch sends it up and over; it comes down on top of the tall "i" arch and bounces off its crown (the dot of the "i") as the camera eases through board 16\'s view');
  note(h16.t1, TK17 - 0.8, '16 → 17 · it bounces on to the last arch, pops off it and falls past the band\'s end onto frame 17\'s first disc, which ricochets it on; the camera follows it across, then cranes down as frame 17\'s world arrives (frame 16\'s set stays behind, above)');
  note(TK17 - 0.8, TK17 + 0.8, '17 · easing down past board 17\'s view with the ricochets; the painted discs swing like paddles to send it on (the board\'s motion trail as ghost rings)');
  note(TK17 + 0.8, TK18 - 0.55, '17 → 18 · two more discs, then onto the tip of the soft-serve swirl; it rolls round the coils as the camera cranes down with it');
  note(TK18 - 0.55, TK18 + 0.7, '18 · still sinking slowly past board 18\'s view: riding the groove round the front of the upper coil, then round the back');
  note(TK18 + 0.7, 83.3, '18 → 19 · the camera drops to floor level as it comes off the swirl onto the U\'s upper arm; it runs at the camera until it fills the frame…');
  note(83.3, TK19 - 0.8, '… inside the sphere the camera turns over it, then rises straight up to look down on the U-turn as frame 19\'s shapes grow out of the floor (one continuous move)');
  note(TK19 - 0.8, TK19 + 0.8, '19 · the rise eases out through board 19\'s top-down view, the camera sliding after the sphere as it rounds the bend');
  note(TK19 + 0.8, TK20 - 0.8, '19 → 20 · along the lower arm and over the platform\'s edge; the camera tilts and cranes down 90° as it drops down the rail chute and the wall\'s reliefs push out');
  note(TK20 - 0.8, TK20 + 0.6, '20 · still craning down slowly past board 20\'s view: down the chute to the lip of the dark hole, and in');
  note(TK20 + 0.6, 93.25, '20 → 21 · the camera dives into the hole after it and finds it in the dark tunnel (dark cut)');
};
