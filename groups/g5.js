/* G5 · frames 21–24 (93.25 → 115.15 s): the row, the chute, the loop, the arch. All four are BUILT (batch 5): each frame's
   real set is in groups/g5/f21.js … f24.js (no board pictures left); this file keeps the journey.
   NEVER STOPS (the user's rule of 21:50: "ease into that keyframe and then ease back out from the keyframe, so you're never
   actually stopping"): every keyframe is an ease-through, hold(n, { pass: true, t: [t0, t1], tk }). The camera passes board
   n's exact pose at tk slowing to about a fifth to a quarter of the moves' cruise speed (21: 3.3 u/s, 22: 4.2, 23: 3.0,
   24: 3.0), then speeds up again; t0–t1 is the slow window the copy reads in. The whole group is ONE camera curve.
   Out of G4's dark hole: two dark halves part and the camera rides beside the sphere as it rolls LEFT along frame 21's
   striped deck (the stripes are its speed lines and light up in its wake) while 21's shapes fly in from depth; it swings
   round and slows through board 21 trucking left with the sphere, which joins the row as the fifth half-disc, and lingers a
   moment after the key, still slow and frontal, easing back, so 21's words read ~1.5 s (the user, 2026-09-29: "add about ½
   second where it's under ~1.3 s …, borrowing time from the travel between frames so the piece stays 2:27"; the crane
   down to 22 is a little quicker to make up the time; 21's slow window is now 96.05–97.85). The shapes
   react to it (the user: "the other shapes react to its velocity, moving and spinning as it passes"): the ∪ spins and the
   rings sway as it passes under them, then the half-discs flip in its wake, the donut spins, the column and bands push back.
   21 → 22: it rolls on along a ledge off the end of the row and drops into the striped chute, which draws itself down
   ahead of it; 21's shapes lift away as the camera cranes down the wall, 22's slide in and the TV screen switches on.
   22: the camera slows through board 22 easing back, down and a little right as the sphere falls behind the TV screen (the
   copy's picture draws over it); the pull-back keeps 22's copy whole in frame. It comes out underneath, rolling right.
   22 → 23: the camera trucks right with it along the band as the screen powers off and pulls wide as 23's floor slides in,
   the loop flies forward and the tile wall drops into place; the sphere hops down onto the orange floor, and the camera
   pushes in and slows through board 23 trucking right with it as it rolls into the loop hidden behind the wall. The wall
   then breaks apart like puzzle pieces, so the ride plays in the open: the loop is a real track (the sphere rolls up, over
   and down the ring's band between two rails, in one plane) while the camera trucks right and pulls back, nearly frontal.
   The two travels also carry in-between shapes (groups/g5/between.js; the polish pass, 2026-09-29, backlog C: "sparse
   stretches at 22→23 (~102.8–104.8) and ~109.3"): along the floor under the band, a row of shapes rising in from below and
   21's ∪ hanging above; on the right of the loop, deeper in the space, a cluster of three overlapping pieces in board 24's
   colours (a big quarter-disc, a dome, a small dome) rising from behind 23's floor once the tile wall has gone (review fix:
   it replaces copies of the wall's own pieces, which read as a "P" beside the ring's "0" and as pieces bouncing back in).
   They show only between the keys (boards 22, 23, 24 are exactly as before at their key instants and through their slow
   windows).
   23 → 24: 23's floor drops away behind it as the arch grows up out of the floor; it drifts forward along the floor, rolls
   up a kicker on the floor's end and leaps on a ballistic arc that meets the arch's channel tangentially just left of its
   top (no kink, no speed jump), and the camera slows through board 24 pushing in and drifting right as it rides over the
   top and down the right shoulder; it rounds off the channel onto the floor, hooks round in front of the arch into the
   dark doorway, and the camera pushes in after it: dip(115.15).
   This file is the JOURNEY: the holds, the anchors the sphere runs through, the sphere's path and timing, the camera
   curve, the captions and the dip at the cut. Each frame's set lives in its own file (groups/g5/f21.js … f24.js), called
   at the end in frame order, then the in-between shapes (groups/g5/between.js), with the shared context G (the holds, the path, the anchors and the helpers; listed where G
   is built). The animatic's cut-out tool (card, below) stays here, shared, though no built frame uses it any more.
   Cuts (fixed contracts, AUTHORING.md "Where groups meet"): 93.25 in (out of G4's dark hole; G4 draws that dip; the camera
   starts beside the sphere at offA / lookA, moving with it) and 115.15 out (the sphere rolls into frame 24's dark doorway,
   the camera pushes in after it and is still pushing at the cut, through the 115.14 pose; dip(115.15) is drawn here).
   The sphere's path ends AT the 115.15 cut (polish pass 2026-09-29: its last line used to run on to 115.4, under the dip,
   so G6's own sphere only took over at 115.4; see "into the tunnel" below). */
import f21 from './g5/f21.js';
import f22 from './g5/f22.js';
import f23 from './g5/f23.js';
import f24 from './g5/f24.js';
import between from './g5/between.js';

export default V => {
  const { THREE, R, BOARD, hold, key, runSegs, curve, airArc, note, bgKey, anim, mat, add, ext, arch, scene, o, O, dip } = V;
  const vec = (x, y, z) => new THREE.Vector3(x, y, z);
  const cl = x => Math.min(1, Math.max(0, x)), sm = x => { x = cl(x); return x * x * (3 - 2 * x); };
  const E = n => gsap.parseEase(n);
  const depthOf = (n, fov) => R * 540 / (BOARD[n].d / 2 * Math.tan(fov * Math.PI / 360));
  const ACTIVE = t => t > 93.2 && t < 115.2;                        // our props only exist in our own stretch
  const raw = hex => { const n = parseInt(hex.slice(1), 16); return new THREE.Color().setRGB((n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255); };

  bgKey(93.25, '#1c0c4c', '#24105e', '#3a129a');
  bgKey(115.15, '#1c0c4c', '#24105e', '#3a129a');

  /* ---------- helpers ---------- */
  // hold + its plate mesh (hold() adds the plate to the scene last) and the plate's depth
  const H = (n, spec) => { const h = hold(n, spec); h.plate = scene.children.at(-1); h.pd = spec.plate.depth; return h; };
  // path pieces: length for runSegs; a straight piece; an arc in a z-plane (n: 'out' = away from the centre, 'in' = towards it)
  const Lof = fn => { let L = 0, p = fn(0).p; for (let i = 1; i <= 120; i++) { const q = fn(i / 120).p; L += q.distanceTo(p); p = q; } return L; };
  const ln = (a, b, c = 1, n) => { const tan = b.clone().sub(a).normalize(); const f = u => ({ p: a.clone().lerp(b, u), c, tan, ...(n ? { n } : {}) }); f.L = a.distanceTo(b); return f; };
  const arc = (C, r, a0, a1, z, c = 1, side = 'out') => { const f = u => { const a = a0 + (a1 - a0) * u, rad = vec(Math.cos(a), Math.sin(a), 0);
    return { p: vec(C.x + r * rad.x, C.y + r * rad.y, z), c, n: side === 'in' ? rad.clone().negate() : rad }; }; f.L = Math.abs(a1 - a0) * r; return f; };
  // every sphere seg this group registers, with the engine's own easing, so bAt(t) gives the sphere's centre at time t
  // (at build time too; the frame files get it in G). Same knot-speed maths as runSegs in v2.js.
  const route = [];
  const runSegsR = (list, v0, v1) => {
    const v = runSegs(list, v0, v1);
    list.forEach(([a, b, L, fn], k) => { const d = L / (b - a); let m0 = v[k] / d, m1 = v[k + 1] / d; const r = Math.hypot(m0, m1) / 3; if (r > 1) { m0 /= r; m1 /= r; }
      route.push({ t0: a, t1: b, L, fn, e: V.easeH(m0, m1) }); });
    return v;
  };
  const bAt = t => { const s = route.find(q => t <= q.t1) || route.at(-1); return s.fn(s.e(cl((t - s.t0) / (s.t1 - s.t0)))).p.clone(); };
  // chain of pieces [fn, relSpeed] from ta to tb: time shared by length ÷ relative speed, knot speeds matched (no stops)
  const chain = (ta, tb, parts, v0, v1) => {
    const L = parts.map(([fn]) => fn.L ?? Lof(fn)), w = parts.map(([, r = 1], i) => L[i] / r), W = w.reduce((a, b) => a + b, 0);
    let t = ta;
    return runSegsR(parts.map(([fn], i) => { const t1 = i === parts.length - 1 ? tb : t + (tb - ta) * w[i] / W; const r = [t, t1, L[i], fn]; t = t1; return r; }), v0, v1);
  };
  /* board cut-out (the animatic's stand-in tool, used by the frame files): a flat piece of hold h's board, standing on h's
     view at depth d (so from the hold camera it covers exactly that part of the board).
     Shape: { poly: [[px, py] …] } or { grid: [N, M, pos(a, b) → [px, py], uv(a, b) → [px, py]] }.
     o.uv(px, py) remaps where a polygon samples the board (patches stretch a clean strip); o.color makes a flat fill.
     It follows its plate's drift and fade unless given o.op(t, plate); o.move(t, ball, mesh) can animate it.
     NB: it reads its plate's visibility, so with plates=0 (PLATES=0) every cut-out is hidden too; and once a frame is
     unplated (V.unplate) its cut-outs must go as well (they would sample a picture that is no longer drawn). */
  const cards = [];
  function card(h, shape, d, o = {}) {
    const s = d * h.tanV / 540, P = shape.poly;
    const piv = o.pivot || (P ? [P.reduce((a, p) => a + p[0], 0) / P.length, P.reduce((a, p) => a + p[1], 0) / P.length] : shape.grid[2](0.5, 0.5));
    const loc = ([px, py]) => [(px - piv[0]) * s, -(py - piv[1]) * s];
    let geo;
    if (P) {
      geo = new THREE.ShapeGeometry(new THREE.Shape(P.map(p => new THREE.Vector2(...loc(p)))), 24);
      const pa = geo.attributes.position, uv = geo.attributes.uv;
      for (let i = 0; i < pa.count; i++) { let q = [piv[0] + pa.getX(i) / s, piv[1] - pa.getY(i) / s]; if (o.uv) q = o.uv(...q); uv.setXY(i, q[0] / 1920, 1 - q[1] / 1080); }
    } else {                                                          // grid: optional uv (samples the board) and vertex rgba (fills / feathering)
      const [N, M, pf, uf, vf] = shape.grid, pos = [], uvs = [], vcs = [], idx = [];
      for (let j = 0; j <= M; j++) for (let i = 0; i <= N; i++) {
        const a = i / N, b = j / M; pos.push(...loc(pf(a, b)), 0);
        if (uf) { const q = uf(a, b); uvs.push(q[0] / 1920, 1 - q[1] / 1080); }
        if (vf) vcs.push(...vf(a, b));
      }
      for (let j = 0; j < M; j++) for (let i = 0; i < N; i++) { const a = j * (N + 1) + i; idx.push(a, a + 1, a + N + 2, a, a + N + 2, a + N + 1); }
      geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setIndex(idx);
      if (uf) geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      if (vf) geo.setAttribute('color', new THREE.Float32BufferAttribute(vcs, 4));
    }
    const G = shape.grid, texd = !o.color && !(G && !G[3]);
    const m = new THREE.MeshBasicMaterial({ ...(o.color ? { color: raw(o.color) } : texd ? { map: h.plate.material.map } : {}), vertexColors: !!(G && G[4]),
      transparent: true, opacity: 0, depthWrite: true, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geo, m); mesh.quaternion.copy(h.q); mesh.visible = false; scene.add(mesh);
    if (o.under) mesh.renderOrder = -1;                                // a patch: drawn before its plate, which then can't show through it
    const c = { h, mesh, base: h.at(piv[0], piv[1], d), k: d / h.pd, c0: h.pos.clone().addScaledVector(h.fwd, h.pd), op: o.op, move: o.move };
    cards.push(c); return c;
  }
  const rect = (x0, y0, x1, y1) => ({ poly: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] });
  const rrect = (x0, y0, x1, y1, r) => { const p = []; for (const [cx, cy, a0] of [[x1 - r, y0 + r, -90], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, 90], [x0 + r, y0 + r, 180]])
    for (let k = 0; k <= 6; k++) { const a = (a0 + 15 * k) * Math.PI / 180; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return { poly: p }; };
  const stretchX = (x0, x1, s0, s1) => (px, py) => [s0 + (px - x0) / (x1 - x0) * (s1 - s0), py];   // patch: sample the clean strip s0–s1
  const stretchY = (y0, y1, s0, s1) => (px, py) => [px, s0 + (py - y0) / (y1 - y0) * (s1 - s0)];
  // colours sampled from the boards (offline) along the edges of a patch, for fills that blend them across it
  const hexRow = s => s.match(/.{6}/g).map(h => [0, 2, 4].map(k => parseInt(h.slice(k, k + 2), 16) / 255));
  anim((t, b) => {
    for (const c of cards) {
      const P = c.h.plate, a = !ACTIVE(t) ? 0 : c.op ? c.op(t, P) : (P.visible ? P.material.opacity : 0);
      c.mesh.visible = a > 0.001; if (!c.mesh.visible) continue;
      c.mesh.material.opacity = a;
      c.mesh.position.copy(c.base); if (P.visible) c.mesh.position.addScaledVector(P.position.clone().sub(c.c0), c.k);
      c.mesh.quaternion.copy(c.h.q);
      if (c.move) c.move(t, b, c.mesh);
    }
  });

  /* ---------- the holds ---------- */
  // the holds are all ease-throughs (pass: true): tk is the board's exact pose, t0–t1 the slow window around it
  // 21: frontal, level, long lens; the sphere rolls LEFT along the row line (y = 0, z = 0). Its slow window is 96.05–97.85
  // (was 96.3–97.6; widened for 21's reading time: the camera now lingers, slow, to ~97.6 after the key; see "21's linger")
  const F21 = 26, D21 = depthOf(21, F21), tk21 = 96.95;
  const h21 = H(21, { t: [96.05, 97.85], tk: tk21, mark: o(0, 0, 0), dir: [0, 0, -1], fov: F21, pass: true, plate: { depth: D21 + 9, in: [93.4, 94.7], out: [98.4, 99.3] } });
  // 22: frontal, wider (small sphere); the chute is vertical at z = -6, the TV screen a layer in front of it
  const F22 = 30, D22 = depthOf(22, F22);
  const h22 = H(22, { t: [99.75, 101.25], tk: 100.0, mark: o(-12, -9, -6), dir: [0, 0, -1], fov: F22, pass: true, plate: { depth: D22 + 25, in: [97.9, 99.0], out: [104.8, 105.6] } });
  // 23: pitched down ~8° onto the orange floor; the tile wall is a layer in front of the (hidden) loop
  const F23 = 26, D23 = depthOf(23, F23), tk23 = 106.55;
  const h23 = H(23, { t: [105.8, 107.3], tk: tk23, mark: o(28, -26.5, -6), dir: [0, -0.14, -1], fov: F23, pass: true, plate: { depth: D23 + 5, in: [102.6, 104.2], out: [109.9, 110.8] } });
  // 24: frontal, level; the sphere rides the arch's top like a ledge; the plate (with the dark doorway) sits just behind
  const F24 = 26, D24 = depthOf(24, F24), tk24 = 111.95;
  const h24 = H(24, { t: [111.2, 112.7], tk: tk24, mark: o(56, -24, -5), dir: [0, 0, -1], fov: F24, pass: true, plate: { depth: D24 + 3.5, in: [108.0, 109.4] } });
  const m21 = h21.mark, m22 = h22.mark, m23 = h23.mark, m24 = h24.mark;

  /* ---------- anchors the sets and the journey share ---------- */
  // 21's entry: the sphere starts X0 right of its mark on the row line; the chase camera's offset and look (from the sphere)
  const X0 = 26.8, offA = vec(2.8, 0.55, 4.6), lookA = vec(-2.2, 0.15, -1.2);
  // 23's loop-the-loop (review fix: the sphere now rides the ring as a real track). The loop is ONE plane, z = zL (the
  // sphere's depth at the key), and its path is the centre-line of board 23's ring band as the hold camera sees it: the
  // sides at lx / rx (board px 895 / 1304), the top at yTop (py 69) with the band's own corner radius rc (124.5 px), so
  // the rails f23 lays along the band's edges (±rw) carry it all the way round. zX is kept as a name for the exit (= zL).
  const lx = m23.x + 4.3, rx = lx + 4, yTop = m23.y + 6.76, rc = 1.18, rw = 0.645, top = yTop - 2, zL = m23.z, zX = zL;
  // 24 → the doorway: the floor in front of the arch (sphere-centre height floorY + 1 … the sphere rolls at floorY) and
  // the dark doorway (on the plate, board px 867, 931)
  const floorY = m24.y - 2.5, door = h24.at(867, 931, h24.pd);

  /* ---------- the sphere ---------- */
  // 21: out of the dark, rolling left along the stripes, easing from 8.5 to 6 u/s as it joins the row
  runSegsR([[93.25, tk21, X0, ln(m21.clone().add(vec(X0, 0, 0)), m21.clone())]], 8.5, 6);
  // 21 → 22: on along the row line and off its end, down the chute into 22
  const gap = m21.clone().add(vec(-10.5, 0, 0));
  const chute = curve([gap, gap.clone().add(vec(-0.8, -1.0, -0.6)), vec(m22.x + 0.15, gap.y - 3.6, m22.z + 2.4), vec(m22.x, m22.y + 3.0, m22.z + 0.2), vec(m22.x, m22.y + 1.4, m22.z), m22], 0);
  chain(tk21, 100.0, [[ln(m21, gap), 1], [chute, 1.3]], 6, 10);
  // 22 → 23: down the chute behind the screen, round the corner onto the band under it, right along the band,
  // a hop down onto 23's orange floor, and on into the hold
  const cBot = vec(m22.x, m22.y - 13.0, m22.z), cC = vec(m22.x + 1.5, cBot.y, m22.z), band = cBot.y - 1.5;
  const bandEnd = vec(O.x + 13, band, m22.z), land = vec(O.x + 17.5, m23.y, m23.z);
  chain(100.0, tk23, [
    [ln(m22, cBot, 0), 1.5],
    [arc(cC, 1.5, Math.PI, 1.5 * Math.PI, m22.z, 1, 'in'), 1.3],
    [ln(vec(cC.x, band, m22.z), bandEnd), 1.1],
    [airArc(bandEnd, land, 0.9), 1.1],
    [ln(land, m23), 0.9],
  ], 10, 7);
  // 23 → 24: right along the floor behind the tile wall, a loop-the-loop there (up the hidden right side, back over the
  // top and down the purple path on the left, which shows), out along the floor, a leap onto the arch's left shoulder,
  // and over the top to the key on the right shoulder
  const aC = h24.at(866, 935, D24), aR = h24.at(866 + 249, 935, D24).distanceTo(aC);      // the arch: centre and centre-line radius
  const a24 = Math.atan2(m24.y - aC.y, m24.x - aC.x);
  // a piece sampled from a point function g(s), s in [0, 1], re-laid by arc length (so the speeds runSegs matches at the knots
  // are the sphere's real speeds: no jump where pieces meet); c: contact
  const byLen = (g, c, N = 240) => { const P = [], S = [0]; for (let i = 0; i <= N; i++) { P.push(g(i / N)); if (i) S.push(S[i - 1] + P[i].distanceTo(P[i - 1])); }
    const L = S[N], f = u => { const s = cl(u) * L; let a = 0, b = N; while (b - a > 1) { const m = (a + b) >> 1; if (S[m] < s) a = m; else b = m; }
      return { p: P[a].clone().lerp(P[b], (s - S[a]) / Math.max(1e-9, S[b] - S[a])), c, tan: P[b].clone().sub(P[a]).normalize() }; }; f.L = L; return f; };
  // 23 → 24 (review fix: the old air arc jumped the sphere's speed at the kick and landed with a 78° kink). Out of the loop
  // the sphere drifts forward on the floor to zRun (1.05 in front of the arch's face, so its leap clears the arch's lips),
  // rolls up a kicker on the floor's end (f23 builds it from G.kicker) and leaps on a true ballistic arc that meets the
  // arch's channel TANGENTIALLY just left of its top (thL), settling back into the channel (z → the face) as it lands; then
  // it rides the channel over the top to the key.
  const yF = m23.y, zRun = m24.z + 1.05, thL = 1.65, rk = 2.5, xL = O.x + 47.5;
  const Tl = vec(aC.x + aR * Math.cos(thL), aC.y + aR * Math.sin(thL), m24.z), sT = -Math.cos(thL) / Math.sin(thL);
  let yL = yF, kP = 0, al = 0;                                   // the lip's height, the arc's curvature, the launch angle
  for (let i = 0; i < 16; i++) { const D = Tl.x - xL; kP = (Tl.y - yL - sT * D) / (D * D); al = Math.atan(sT + 2 * kP * D); yL = yF + rk * (1 - Math.cos(al)); }
  const kC = vec(xL - rk * Math.sin(al), yF + rk, zRun), kick = vec(xL, yL, zRun), land24 = Tl.clone();
  // (the settle back into the channel runs over the leap's last 2.5 units of path, keeping the sphere clear of the arch's
  // outer lip until it is inside the channel's width: the lip's clearance needs ~1 in front while over it, 0 once inside)
  const flight = (() => { const N = 240, P = [];
    for (let i = 0; i <= N; i++) { const x = xL + (Tl.x - xL) * i / N; P.push(vec(x, yL + Math.tan(al) * (x - xL) - kP * (x - xL) ** 2, 0)); }
    let d = 0; for (let i = N; i >= 0; i--) { if (i < N) d += Math.hypot(P[i].x - P[i + 1].x, P[i].y - P[i + 1].y); P[i].z = m24.z + (zRun - m24.z) * sm(d / 2.5); }
    return byLen(s => { const f = s * N, i = Math.min(N - 1, Math.floor(f)); return P[i].clone().lerp(P[i + 1], f - i); }, 0); })();
  const run = byLen(s => { const x = lx + 1 + (kC.x - lx - 1) * s; return vec(x, yF, zL + (zRun - zL) * sm((x - rx - 0.8) / 7)); }, 1);
  chain(tk23, tk24, [
    [ln(m23, vec(rx - 1, yF, zL)), 1],
    [arc(vec(rx - 1, yF + 1, 0), 1, -Math.PI / 2, 0, zL, 1, 'in'), 0.95],                     // up into the ring
    [ln(vec(rx, yF + 1, zL), vec(rx, yTop - rc, zL), 1, vec(-1, 0, 0)), 0.85],                 // up the right side (behind the tiles at the key)
    [arc(vec(rx - rc, yTop - rc, 0), rc, 0, Math.PI / 2, zL, 1, 'in'), 0.78],
    [ln(vec(rx - rc, yTop, zL), vec(lx + rc, yTop, zL), 1, vec(0, -1, 0)), 0.75],              // over the top
    [arc(vec(lx + rc, yTop - rc, 0), rc, Math.PI / 2, Math.PI, zL, 1, 'in'), 0.8],
    [ln(vec(lx, yTop - rc, zL), vec(lx, yF + 1, zL), 1, vec(1, 0, 0)), 0.9],                   // down the purple path the board shows
    [arc(vec(lx + 1, yF + 1, 0), 1, Math.PI, 1.5 * Math.PI, zL, 1, 'in'), 1],
    [run, 1.05],                                                                             // out along the floor, drifting forward
    [arc(vec(kC.x, kC.y, 0), rk, -Math.PI / 2, -Math.PI / 2 + al, zRun, 1, 'in'), 1.05],       // up the kicker
    [flight, 1.0],                                                                           // the leap
    [arc(aC, aR, thL, a24, m24.z), 0.8],                                                     // in the arch's channel, to the key
  ], 7, 6.5);
  // 24 → the doorway: down the shoulder, off the front of the ledge, a short hook round in front of the arch, into the dark
  const aOff = 0.15, offLedge = vec(aC.x + aR * Math.cos(aOff), aC.y + aR * Math.sin(aOff), m24.z);   // (review pass: rides a little lower before it rolls out, so the drop to the floor is short and round)
  // (it leaves the channel along the channel's own direction and rounds onto the floor on a quarter circle of radius rOff:
  // no kink where the arc meets the hook, no sharp turn as it reaches the floor)
  const dOff = vec(Math.sin(aOff), -Math.cos(aOff), 0), fOff = vec(0.3, 0, 1).normalize(), rOff = (offLedge.y - floorY) / Math.cos(aOff);
  const offArc = [1, 2, 3, 4, 5, 6].map(k => { const ph = Math.PI / 2 * k / 6; return offLedge.clone().addScaledVector(dOff, rOff * Math.sin(ph)).addScaledVector(fOff, rOff * (1 - Math.cos(ph))); });
  const hook = curve([offLedge, ...offArc, vec(m24.x + 2.6, floorY, m24.z + 3.8), vec(m24.x + 1.2, floorY, m24.z + 5.2),
    vec(m24.x - 1.0, floorY, m24.z + 5.0), vec(door.x - 0.6, floorY, m24.z + 3.2), vec(door.x, floorY, m24.z + 1.0), vec(door.x, floorY, door.z)], 1);
  const hookL = byLen(u => hook.curve.getPoint(u), 1, 1200);        // (re-laid by true arc length: the curve's own table is too coarse for its dense start)
  chain(tk24, 114.55, [[arc(aC, aR, a24, aOff, m24.z), 0.9], [hookL, 1.1]], 6.5, 8);
  // into the tunnel at 8 u/s, ending AT the cut (polish pass 2026-09-29: it used to run on to 115.4, past the 115.15 cut,
  // under the dip, which kept G6's own sphere from taking over until 115.4). The same line and speed: every position up
  // to the cut is as it was. The line's old last 0.25 s stays in `route` only (not an engine seg), so bAt, and with it the
  // camera's look-follow smoothing (ballS, ±0.2 s), reads exactly what it did.
  { const d0 = vec(door.x, floorY, door.z), d1 = vec(door.x, floorY, door.z - 4.8), d2 = vec(door.x, floorY, door.z - 6.8);
    runSegsR([[114.55, 115.15, 4.8, ln(d0, d1)]], 8, 8);
    route.push({ t0: 115.15, t1: 115.4, L: 2.0, fn: ln(d1, d2), e: u => u }); }

  /* ---------- the camera: ONE smooth curve for the whole group, laid as dense keys (the method of g2.js / g3.js) ----------
     A quintic Hermite through the poses (position, view direction, look distance, look-follow and lens are continuous up to
     acceleration), laid as keys every 0.025 s. Every keyframe is an ease-through (PASS below): the engine's own key at tk is
     the board's exact pose, and the curve passes it at a set velocity with its view turning slowly, so it slows down into
     each board and continues (no still span anywhere; camprobe's largest acceleration step is ~6 u/s² at the key instants).
     The look-follow is baked into the keys toward the sphere averaged over ±0.2 s (bAt, this path's own timing), so the view
     tracks the run's flow without the bumps. The poses are the approved animatic moves, re-laid for the ease-throughs. */
  const Vec = THREE.Vector3, DTK = 0.025, upY = new Vec(0, 1, 0);
  const PV = (pos, look, f, fov) => [...pos.toArray(), ...look.toArray(), f, fov];
  const Kp = (t, pos, look, f, fov, op = {}) => ({ t, v: PV(pos, look, f, fov), ...op });
  // a pose relative to the sphere at t: offsets for the camera and its look target (the old pf: 1 keys)
  const kR = (t, off, lookOff, f, fov, op) => { const b = bAt(t); return Kp(t, b.clone().add(off), b.clone().add(lookOff), f, fov, { lo: lookOff.clone(), ...op }); };
  const ballS = (t, w = 0.2) => { const S = new Vec(); let Wt = 0;
    for (let i = -8; i <= 8; i++) { const k = 0.5 + 0.5 * Math.cos(Math.PI * i / 9); S.addScaledVector(bAt(t + w * i / 8), k); Wt += k; } return S.multiplyScalar(1 / Wt); };
  const q5 = (p0, v0, a0, p1, v1, a1, h, u) => { const u2 = u * u, u3 = u2 * u, u4 = u3 * u, u5 = u4 * u;
    return p0 * (1 - 10 * u3 + 15 * u4 - 6 * u5) + h * v0 * (u - 6 * u3 + 8 * u4 - 3 * u5) + h * h * a0 * (0.5 * u2 - 1.5 * u3 + 1.5 * u4 - 0.5 * u5)
      + h * h * a1 * (0.5 * u3 - u4 + 0.5 * u5) + h * v1 * (-4 * u3 + 7 * u4 - 3 * u5) + p1 * (10 * u3 - 15 * u4 + 6 * u5); };
  const toW = v => { const w = new Vec(v[3] - v[0], v[4] - v[1], v[5] - v[2]), Lw = w.length(); w.multiplyScalar(1 / Lw); return [v[0], v[1], v[2], w.x, w.y, w.z, Lw, v[6], v[7]]; };
  const fromW = w => { const d = new Vec(w[3], w[4], w[5]).normalize(); return [w[0], w[1], w[2], w[0] + d.x * w[6], w[1] + d.y * w[6], w[2] + d.z * w[6], w[7], w[8]]; };
  // P: poses { t, v, still?, own? (the engine's own key: no dense key on it), sp? (own camera speed, u/s), vp? (own velocity),
  // dirK? (scales its view-turn rate), dv/a? (velocity / acceleration in look-point terms: a curve that starts moving),
  // vend? (a free last pose's speed factor) }. A free first / last pose moves along the chord to its neighbour.
  const move = P => { const n = P.length, Z = () => new Array(9).fill(0);
    for (const p of P) p.w = toW(p.v);
    for (const p of P) if (p.dv && !p.dw) { const hh = 1e-3, ev = s => toW(p.v.map((x, j) => x + p.dv[j] * s + 0.5 * (p.a ? p.a[j] : 0) * s * s)), m0 = ev(-hh), c0 = ev(0), q0 = ev(hh);
      p.dw = c0.map((_, j) => (q0[j] - m0[j]) / (2 * hh)); p.aw = c0.map((_, j) => (q0[j] - 2 * c0[j] + m0[j]) / (hh * hh)); }
    const d3 = (p, q, j) => Math.hypot(p.w[j] - q.w[j], p.w[j + 1] - q.w[j + 1], p.w[j + 2] - q.w[j + 2]);
    const tang = (m, d) => { const k = m[3] * d[3] + m[4] * d[4] + m[5] * d[5]; for (let q = 3; q < 6; q++) m[q] -= k * d[q]; return m; };
    for (let i = 0; i < n; i++) { const p = P[i]; if (p.dw) continue;
      if (p.still) { p.dw = Z(); continue; }
      if (i === 0 || i === n - 1) { const A = P[i === 0 ? 0 : i - 1], B = P[i === 0 ? 1 : i];
        p.dw = tang(A.w.map((_, j) => (B.w[j] - A.w[j]) / (B.t - A.t) * (p.vend ?? 1)), p.w); continue; }
      const A = P[i - 1], B = P[i + 1], m = tang(p.w.map((_, j) => (B.w[j] - A.w[j]) / (B.t - A.t)), p.w);
      for (const j of [0, 3]) { const Lm = Math.hypot(m[j], m[j + 1], m[j + 2]), want = j === 0 && p.sp != null ? p.sp : (d3(A, p, j) / (p.t - A.t) + d3(p, B, j) / (B.t - p.t)) / 2;
        if (Lm > 1e-6) for (let q = j; q < j + 3; q++) m[q] *= want / Lm; }
      if (p.vp) for (let q = 0; q < 3; q++) m[q] = p.vp[q];
      if (p.dirK != null) for (let q = 3; q < 6; q++) m[q] *= p.dirK;
      if (p.w[7] < 1e-6) m[7] = 0;                                          // a pose with no look-follow: the follow doesn't dip below 0 there (a kink in the view)
      p.dw = m; }
    for (let i = 0; i < n; i++) if (!P[i].aw) { if (P[i].still || i === 0 || i === n - 1) { P[i].aw = Z(); continue; }
      const A = P[i - 1], C = P[i], B = P[i + 1], hA = C.t - A.t, hB = B.t - C.t;
      P[i].aw = C.w.map((_, j) => ((6 * (A.w[j] - C.w[j]) + 2 * hA * A.dw[j] + 4 * hA * C.dw[j]) / (hA * hA) + (6 * (B.w[j] - C.w[j]) - 4 * hB * C.dw[j] - 2 * hB * B.dw[j]) / (hB * hB)) / 2);
      if (C.w[7] < 1e-6) P[i].aw[7] = Math.max(0, P[i].aw[7]); }
    const at = t => { let i = 0; while (i < n - 2 && t > P[i + 1].t) i++;
      const A = P[i], B = P[i + 1], h = B.t - A.t, u = Math.min(1, Math.max(0, (t - A.t) / h));
      return fromW(A.w.map((_, j) => q5(A.w[j], A.dw[j], A.aw[j], B.w[j], B.dw[j], B.aw[j], h, u))); };
    const lay = (t, v = at(t)) => { const f = Math.min(1, Math.max(0, v[6]));
      key(t, new Vec(v[0], v[1], v[2]), new Vec(v[3], v[4], v[5]).lerp(ballS(t), f), { f: 0, fov: v[7] }); };
    const t0 = P[0].t, t1 = P[n - 1].t, NK = Math.round((t1 - t0) / DTK);
    for (let k = 0; k <= NK; k++) { const t = t0 + (t1 - t0) * k / NK;             // (evenly spaced: an odd last gap kinks the key Hermite)
      if (P.some(p => p.own && Math.abs(p.t - t) < 0.01)) continue;
      lay(t); }
    // a move that starts moving at the cut: the engine starts a shot's first key from rest, so one more key 2.5 ms after it
    // gives it its speed at once (under the dip)
    if (P[0].dv) lay(t0 + 0.0025);
    // a move that ends free at the cut: the engine stops the camera on a shot's last key, so the push-in carries on (straight,
    // at its speed) from the last pose to 0.5 ms before the cut, with one more key 0.5 ms before that: the stop falls inside
    // the cut's own last half millisecond, so no frame (and no 120 Hz probe) sees the camera slow (as g3.js at 66.85)
    if (!P[n - 1].still) { const tE = P[n - 1].cut ? P[n - 1].cut - 5e-4 : t1, a1 = at(t1), a0 = at(t1 - 1e-3);
      const ex = t => a1.map((x, j) => x + (x - a0[j]) / 1e-3 * (t - t1));
      if (tE > t1 + 1e-3) { lay((t1 + tE) / 2, ex((t1 + tE) / 2)); lay(tE, ex(tE)); }
      lay(tE - 5e-4, ex(tE - 5e-4)); } };
  // the ease-through at a keyframe (the NEW RULE, user 21:50: "ease into that keyframe and then ease back out from the keyframe,
  // so you're never actually stopping"): the camera passes board n's exact pose at its key instant tk (the engine's own key,
  // hold(n, { pass: true })), moving at vp, about a fifth to a third of the neighbouring moves' cruise speed, its view turning
  // slowly (dirK); the poses on either side carry it in and out, so it slows down to that moment and then continues.
  const PASS = (h, dir, speed, dirK = 0.3) => Kp(h.tk, h.pos, h.look, 0, h.fov, { own: true, vp: vec(...dir).normalize().multiplyScalar(speed).toArray(), dirK });

  // ONE shot, 93.25 → 115.15: out of the dark riding beside the sphere (the cut's pose and the sphere's own speed, as the old
  // pf: 1 keys), swing round to frontal and ease through 21 trucking left with it; crane down the chute and the wall, ease through
  // 22 craning slowly down after it as it drops behind the TV screen; truck right with it along the band and push in, ease
  // through 23 trucking right along the floor; pull back and up to watch the loop, truck right with the leap and ease through 24
  // pushing in; then follow the hook and push into the dark doorway after it, still pushing at the cut (the 115.14 pose is the
  // cut's contract: camera just inside the doorway, looking down the tunnel).
  // 21's linger (reading time, user 2026-09-29, A2: "add about ½ second where it's under ~1.3 s …, borrowing time from the
  // travel between frames so the piece stays 2:27"; 21 read 0.90 s). 21's copy sits close to the lens, so even the key's slow
  // truck left moves it ~350 px/s through the world (its hover holds that down until its lag cap fills), and the old curve
  // began turning the view toward the chute right after the key. Now, after the key, the camera keeps its slow pace (3.3 → 4
  // u/s) and its frontal view to 97.6, bending its truck left into an ease back (a dolly, which barely moves the copy on
  // screen), then cranes down to 22 a little quicker to make up the time (view-turn peak 17°/s, was 11; acceleration 16
  // u/s², was 11; no jolt; the slowest point stays 3.2 u/s, just before the key). With the swipes ~0.25 s earlier (21's slow
  // window now starts at 96.05), 21 reads ~1.47 s (was 0.90; readprobe). The key poses (21, 22) and the cuts are as they
  // were. The move itself changes 96.95–98.8; the poses either side re-derive their tangents, so the approach into 21 shifts
  // by ≤ 0.14 u / 0.5° (95.3–96.8) and the arrival at 22 by ≤ 0.12 u / 0.24° (98.8–99.8), fading to nothing by 101.2.
  const D21P = vec(-0.8, -0.3, 0.5).normalize(), D21B = vec(-0.3, -0.25, 0.92).normalize();
  // (the linger pose: 2.25 units on from the key along the bend, at 97.6 moving 4 u/s: the speed rises steadily from the key)
  const p21L = h21.pos.clone().addScaledVector(D21P.clone().add(D21B).normalize(), 2.25);
  { const b0 = bAt(93.25), vb = bAt(93.26).sub(b0).multiplyScalar(100);
    move([
      Kp(93.25, b0.clone().add(offA), b0.clone().add(lookA), 0, 40, { dv: [...vb.toArray(), ...vb.toArray(), 0, 0] }),
      kR(94.05, vec(3.0, 0.8, 5.4), vec(-2.2, 0.2, -1.2), 0, 38),
      Kp(95.0, m21.clone().add(vec(13.5, 2.2, 13)), m21.clone().add(vec(7, 0.6, -1)), 0.35, 31, { sp: 15 }),
      PASS(h21, D21P, 3.3),                                                           // trucking left with it, craning down a touch, easing back
      // (the linger: still slow, the view still frontal, easing back; then the crane down the wall)
      Kp(97.6, p21L, p21L.clone().add(h21.look.clone().sub(h21.pos)), 0, 26.4, { vp: D21B.clone().multiplyScalar(4.0).toArray(), dirK: 0.3 }),
      Kp(98.8, m21.clone().add(vec(-5.5, -6.5, 25.5)), m21.clone().add(vec(-10.8, -4, -3)), 0.35, 33, { sp: 14.5 }),
      PASS(h22, [0.35, -0.4, 0.85], 4.2),                                             // easing back, down and right as it falls behind the screen
      // (the slow window runs on to 101.25: still easing back, the view barely turning, so 22's copy stays whole in frame)
      Kp(101.2, h22.pos.clone().add(vec(2.3, -1.8, 4.3)), h22.pos.clone().add(vec(2.3, -1.8, 4.3)).addScaledVector(h22.fwd, 10), 0, h22.fov,
        { vp: [3.0, -0.9, 3.2], dirK: 0.3 }),
      Kp(102.3, vec(O.x - 1.0, band + 2.2, m22.z + 40), vec(O.x + 3.5, band + 0.5, m22.z), 0.45, 30),
      // (review fix: leads further right on a wider lens, so 23's floor, loop and tiles build in on screen during the truck)
      Kp(103.7, vec(O.x + 16.5, m23.y + 4.3, m23.z + 32), vec(O.x + 21.5, m23.y + 1.2, m23.z), 0.45, 37),
      Kp(104.8, vec(O.x + 25.5, m23.y + 6.5, m23.z + 31), vec(O.x + 31, m23.y + 2, m23.z), 0.2, 30),   // wide: 23's set building in
      PASS(h23, [0.98, 0.15, -0.1], 3.0),                                             // pushing in, trucking right with it along the floor
      // (review fix: within ~11° of frontal, so the sphere reads on the ring's rails all the way round; far enough from the key
      // pose that the camera picks up speed after the key: it trucks right and pulls back as the sphere rides the loop)
      Kp(108.5, vec(lx + 7, m23.y + 6.2, m23.z + 25.5), vec(lx + 2.2, m23.y + 3.2, zL), 0.3, 30),
      Kp(110.3, vec(O.x + 50, m24.y + 2.5, m24.z + 26.5), vec(O.x + 51.5, m24.y - 1, m24.z), 0.45, 29),
      PASS(h24, [0.35, 0, -0.94], 3.0),                                               // pushing in, drifting a little right (24's copy is edge to edge)
      Kp(113.7, vec(door.x + 2.5, m24.y + 2.4, m24.z + 16), vec(door.x + 1.5, floorY + 0.3, m24.z + 3), 0.45, 36),
      Kp(114.5, vec(door.x + 0.3, floorY + 1.3, door.z + 8), vec(door.x, floorY + 0.5, door.z - 2), 0.25, 36),
      Kp(115.14, vec(door.x, floorY + 0.6, door.z + 1.3), vec(door.x, floorY + 0.6, door.z - 6), 0, 40, { vend: 1, cut: 115.15 })]); }
  dip(115.15);

  /* ---------- captions ---------- */
  note(93.25, 96.05, "Out of the dark: two dark halves part; the camera rides beside the sphere as it rolls left along the striped deck (its speed lines, lighting up in its wake) while 21's shapes fly in, then swings round and slows into 21");
  note(96.05, 97.85, "21 · easing through (never stopping): the camera slows, trucking left with the sphere as it joins the row as the fifth half-disc, then lingers a moment easing back so the words read; the half-discs flip in its wake, the donut spins, the column and bands push back");
  note(97.85, 99.75, "21 → 22 · it rolls on along the ledge and drops into the striped chute as it draws itself down; 21's shapes lift away as the camera speeds up and cranes down the wall, 22's slide in and the TV screen switches on");
  note(99.75, 101.25, "22 · easing through: the camera slows, easing back, down and a little right, as the sphere falls down the chute behind the TV screen and comes out underneath");
  note(101.25, 105.8, "22 → 23 · the camera speeds up and trucks right with it along the band as the screen powers off, and pulls wide (a wider lens) as 23's floor slides in, the loop glides in across the upper right and the tile wall drops into place; along the floor under the band a row of shapes rises in (a quarter-disc, a dome, a quarter-disc) and 21's ∪ drops in above, then lifts away before 23's words; it hops down onto the orange floor");
  note(105.8, 107.3, "23 · easing through: the camera pushes in and slows, trucking right with the sphere as it rolls along the orange floor into the loop hidden behind the tile wall");
  note(107.3, 109.2, "23 · the tile wall breaks apart like puzzle pieces; the sphere rides the ring like a track, between its rails, up, over the top and down the purple path, while the camera trucks right and pulls back; once the wall has gone, on the right, deeper in, a cluster in 24's colours rises from behind the floor (a big coral → orange quarter-disc, a violet dome, a small pink → orange dome)");
  note(109.2, 111.2, "23 → 24 · the camera trucks right; the ring rises away, the cluster sinks back behind the floor, 23's floor drops away behind the sphere as the arch grows up out of the floor with 24's shapes; it rolls up a kicker and leaps, landing tangentially in the arch's channel");
  note(111.2, 112.7, "24 · easing through: the camera slows, pushing in and drifting right, as the sphere rides over the top of the arch in its channel and down the right shoulder");
  note(112.7, 115.15, "24 → 25 · it rounds off the channel onto the floor and hooks round in front of the arch into the dark doorway, dimming as it rolls in; the camera speeds up and pushes in after it (cut in the dark)");

  /* ---------- set-building helpers for the frame files (copied from g2.js / g4.js; nothing here builds anything) ---------- */
  const SH = V.S, HH = { 21: h21, 22: h22, 23: h23, 24: h24 };
  const hexV3 = h => { const n = parseInt(h.slice(1), 16); return vec((n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255); };
  // board px of a world point seen from hold h's camera: [px, py, depth along its view]
  const proj = (h, p) => { const d = p.clone().sub(h.pos), z = d.dot(h.fwd); return [960 + d.dot(h.right) / z / h.tanV * 540, 540 - d.dot(h.upv) / z / h.tanV * 540, z]; };
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

  /* ---------- the sets: one file per frame (groups/g5/f21.js … f24.js), called in frame order with the shared context G ----------
     G holds:
     · the holds h21 … h24 (h.pos, fwd, right, upv, q, tanV, fov, tk, mark, at(px, py, depth), plate = the plate mesh, pd = its
       depth), their lenses F21 … F24, the sphere's depth from each hold camera D21 … D24, the key instants tk21, tk23,
       tk24 (22's is h22.tk = 100.0) and the marks m21 … m24;
     · the anchors: 21's entry (X0, offA, lookA), the row's gap and the 21 → 22 chute curve (chute.curve is its
       CatmullRomCurve3), 22's chute bottom and band (cBot, cC, band, bandEnd, land), 23's loop (the band's centre-line:
       sides lx / rx, top yTop, corner radius rc, rails ±rw from it, all in the plane z = zL; zX = zL is its exit), the
       kicker on 23's floor end (kicker: { c: ball-centre arc centre, r, al: launch angle, z, xL: the lip's x, yF }, kick = the
       lip), the leap (flight) and where it meets the channel (land24, at angle thL), 24's arch and doorway (aC, aR, a24,
       offLedge, hook, floorY, door);
     · the path: route (every sphere seg, { t0, t1, L, fn, e }, plus the tunnel line's old last 0.25 s past the cut, kept for
       bAt only) and bAt(t), the sphere's centre at time t (usable at build time; at run time anim's ball is the same thing);
     · set-building helpers (as in g2.js / g4.js): PC(spec) (V.piece, calmed, colour-locked to its hold's key instant, flat at
       its hold; spec.hold is 21 … 24), lock, calm, still, flatGeo, flatFor, HH (21 … 24 → hold), SH (= V.S shapes), hexV3,
       proj(h, p) (board px and depth of world point p from hold h's camera), fades(mesh, [[in0, in1, out0, out1] …]),
       showIf(mesh, t0, t1);
     · other helpers: vec, cl, sm, E (a gsap ease by name), raw (hex → THREE.Color from the sRGB bytes as they are, as the
       cut-outs use), ACTIVE(t) (true inside G5's stretch), depthOf(n, fov), Lof / ln / arc (path pieces), hexRow, and the
       animatic's cut-out tool (card, cards, rect, rrect, stretchX, stretchY);
     · live: { t, flow }, the engine's clock and flow uniforms, set by f23.js (from its one registered material) for
       between.js, whose shapes flow on them without making a new engine material (that would shift every later
       material's living-gradient phase). */
  { const G = { V, THREE, vec, cl, sm, E, raw, ACTIVE, depthOf, Lof, ln, arc, hexRow, card, cards, rect, rrect, stretchX, stretchY,
      SH, HH, hexV3, proj, still, calm, flatGeo, flatFor, lock, PC, fades, showIf,
      h21, h22, h23, h24, F21, F22, F23, F24, D21, D22, D23, D24, tk21, tk23, tk24, m21, m22, m23, m24,
      X0, offA, lookA, gap, chute, cBot, cC, band, bandEnd, land, lx, rx, top, yTop, rc, rw, zL, zX, kick,
      kicker: { c: kC, r: rk, al, z: zRun, xL, yF }, thL, zRun, flight,
      aC, aR, a24, land24, offLedge, hook, floorY, door, route, bAt };
    for (const f of [f21, f22, f23, f24]) f(V, G);
    between(V, G); }                                                 // the in-between shapes (22 → 23, 23 → 24): after f23, which lends G.live
};
