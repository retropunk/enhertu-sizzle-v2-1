/* Frame 12 · level on the road, looking down it into a tunnel of nested ∩ arches; the sphere rolls away into the dark
   doorway (G3, called from g3.js with its context G). Built (batch 3): every board 12 shape is real 3D, the plate is gone.
   Hold camera: E (on the road axis, 1.36 above the road, looking +z, 30° lens). Board px map into its view by depth d
   (world units from E along +z); screen right is world −x.
   · The road: one mesh from 1.5 past hold 11's mark (f11's contract: there it is flat, 6 wide, 0.9 deep, and f11's ribbon
     narrows into it from underneath; it appears at 45.45 (G.handOff) as f11's tail starts to dissolve), orange like board 11's ribbon, narrowing
     and turning violet as it eases off the sphere's curve onto a straight raised road, and on through the tunnel. Board 12's two "banks" are the inner faces
     of low kerbs either side of a 3-wide road (lavender on the left, pink on the right, darkening into the doorway): their
     top edges are fitted to the board's bank lines (they rise 0.0064 per unit, which puts the lines' vanishing point
     where the board draws it). Below the kerbs the road's sides drop into the dark, so everything that stands beside it
     (legs, wall, stadium) is cut along the bank line at the hold, as on the board, and has real feet when the camera moves.
   · The arches are three ∩ frames at staggered depths, nested exactly at the hold: the peach one near (d 10; the crane
     flies through it), the violet and the orange doorway frame far (d 32 and 33.2; the crane passes over them). The dark
     doorway is a real tunnel (a ∩ tube, dark inside, violet → magenta outside, an orange exit face) from the orange frame
     to z 62.2, where f13's closed pipe comes out. Dark fog layers inside its mouth let the sphere fade into the dark.
   · The backdrop wall behind the peach arch carries board 12's colour field and its flat shapes (the stadium ring, the
     peach dot, the two violet → orange bars at the top, the orange ¾ disc, the lavender quarter disc and the magenta
     shape at the top right). The ASCO box, the DG04 documents and the DESTINY text are copy: their areas show what the
     board implies behind them. (polish 2026-09-29: the wall runs on well past the frame, to the right and up (board x 3400,
     y −3200), with the magenta shape running out to its right end and the side wing's corner rising to meet its top, so the
     11 → 12 orbit no longer sees it as a floating card side-on, with its top and right edges and the dark beyond; its left
     end runs on behind the side wing's corner (board x −500) and the wing runs on to just in front of it, so no dark gap
     shows down that join either; at the hold it is unchanged.)
   · The sphere's dark shadow is a long soft ellipse on the road, as the board draws it (it grows from a contact shadow as
     the camera settles).
   · Build: the road is there from the end of hold 11; the wall and its shapes, then the peach arch, then the violet and
     orange frames with the tunnel rise out of the dark as the camera comes round (46.9–48.5). Everything goes at 54.8,
     once the crane has left it behind (frames 13–15 happen below and beyond). */
export default (V, G) => {
  const { THREE, h12, C, L, sOf, sm } = G;
  const { anim } = V;
  const SH = V.S, Vec = THREE.Vector3, UP = new Vec(0, 1, 0);
  const H = h12, TK = H.tk, E = H.pos.clone(), tv = H.tanV;
  const kpx = d => d * tv / 540;                                          // world units per board px at depth d
  V.unplate(12);

  const X0 = E.x, YR = -5, YB = -10.5, FY0 = -6.8, FY1 = -10.2, DK = '#1a0a48';   // road top; bottoms; dark fade (world y)
  const T_OUT = [54.6, 54.8];
  const hexV3 = h => { const n = parseInt(h.slice(1), 16); return new Vec((n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255); };
  const pad = (a, n, f) => { const o = a.slice(0, n); while (o.length < n) o.push(f()); return o; };
  const LOGV = '#include <common>\n#include <logdepthbuf_pars_vertex>\n';
  const mine = [];                                                          // custom meshes (shown 45.2 → 54.8)
  const mesh = (g, m, ro = 0) => { const me = new THREE.Mesh(g, m); me.frustumCulled = false; me.renderOrder = ro; V.scene.add(me); mine.push(me); return me; };
  const base = V.mat(['#7b2bf9'], { flat: true });                         // registered with the engine: its t / flow update

  /* ================= pieces (board shapes laid out in hold 12's view) ================= */
  // skin: a piece material with a multi-stop linear gradient ({ lin: [[g, '#hex'], …], A, B }) or a smooth colour field
  // ({ field: [[px, py, '#hex'], …], kern }); board px. Living: the stops / anchors drift slowly, exactly on the board
  // colours at the key instant. Below world y −6.8 everything darkens into the void. Sides (the extrusion) are shaded darker.
  const GV = LOGV + 'varying vec3 vO; varying vec3 vNv; varying float vY; varying vec3 vVP;\nvoid main() { vO = position; vNv = normalize(normalMatrix * normal); vec4 w = modelMatrix * vec4(position, 1.0); vY = w.y;\n  vec4 mv = viewMatrix * w; vVP = mv.xyz; gl_Position = projectionMatrix * mv;\n#include <logdepthbuf_vertex>\n}';
  const GF = `uniform int mode, ns, na; uniform float op, t, flow, spd, tk, amp, per, ph0, kern, kpw, fy0, fy1;
uniform vec2 A, B; uniform float st[12]; uniform vec3 sc[12]; uniform vec2 ap[40]; uniform vec3 ac[40]; uniform vec3 dk;
varying vec3 vO; varying vec3 vNv; varying float vY; varying vec3 vVP;
#include <logdepthbuf_pars_fragment>
float wob(float k) { return sin(6.2832 * ((t - tk) * spd) / (per * (1.0 + 0.13 * k)) + ph0 + 1.7 * k) - sin(ph0 + 1.7 * k); }
void main() {
  // (sides seen edge-on — all of them at the hold — are dropped: their depth is unstable there and a few samples of them
  //  would win over the face in front, a hairline; they are sub-pixel then anyway, and show as soon as the camera moves)
  if (abs(dot(normalize(vNv), normalize(-vVP))) < 0.02) discard;
  float fl = min(flow, 1.6);
  vec3 col;
  if (mode == 0) { vec2 ax = B - A; float g = dot(vO.xy - A, ax) / dot(ax, ax) + amp * fl * wob(0.0);
    col = sc[0]; for (int i = 1; i < 12; i++) { if (i >= ns) break; col = mix(col, sc[i], clamp((g - st[i - 1]) / max(1e-4, st[i] - st[i - 1]), 0.0, 1.0)); } }
  else { vec3 sum = vec3(0.0); float ws = 0.0;
    for (int i = 0; i < 40; i++) { if (i >= na) break; float k = float(i); vec2 p = ap[i] + amp * fl * vec2(wob(k), wob(k + 0.5)); vec2 d = vO.xy - p;
      float w = pow(1.0 + dot(d, d) / (kern * kern), -kpw); sum += ac[i] * w; ws += w; }
    col = sum / ws; }
  col = mix(col, dk, 1.0 - smoothstep(fy1, fy0, vY));
  vec3 nv = normalize(vNv); float shade = mix(0.72 + 0.12 * nv.y - 0.05 * nv.x, 1.0, smoothstep(0.55, 0.98, abs(nv.z)));
  gl_FragColor = vec4(col * shade, op);
#include <logdepthbuf_fragment>
}`;
  const swaps = [];
  const skin = (pc, g, at) => {
    const o0 = pc.mesh.material, loc = ([x, y]) => new THREE.Vector2(x - at[0], at[1] - y);
    const u = { op: o0.uniforms.op, t: o0.uniforms.t, flow: o0.uniforms.flow, spd: o0.uniforms.spd, tk: { value: TK }, amp: { value: g.amp ?? 0.03 }, per: { value: g.per ?? 10 }, ph0: { value: 1.3 + 0.9 * swaps.length },
      mode: { value: g.lin ? 0 : 2 }, ns: { value: 1 }, na: { value: 0 }, kern: { value: g.kern ?? 150 }, kpw: { value: g.kpw ?? 2 },
      A: { value: new THREE.Vector2() }, B: { value: new THREE.Vector2(1, 0) }, st: { value: pad([], 12, () => 0) }, sc: { value: pad([], 12, () => new Vec()) },
      ap: { value: pad([], 40, () => new THREE.Vector2()) }, ac: { value: pad([], 40, () => new Vec()) }, dk: { value: hexV3(g.dk ?? DK) }, fy0: { value: FY0 }, fy1: { value: FY1 } };
    if (g.lin) { u.A.value = loc(g.A); u.B.value = loc(g.B); u.ns.value = g.lin.length; u.st.value = pad(g.lin.map(q => q[0]), 12, () => 1e5); u.sc.value = pad(g.lin.map(q => hexV3(q[1])), 12, () => hexV3(g.lin.at(-1)[1])); }
    else { u.na.value = g.field.length; u.ap.value = pad(g.field.map(q => loc(q)), 40, () => new THREE.Vector2()); u.ac.value = pad(g.field.map(q => hexV3(q[2])), 40, () => new Vec()); }
    const m = new THREE.ShaderMaterial({ uniforms: u, vertexShader: GV, fragmentShader: GF, side: o0.side });
    pc.mesh.material = m; swaps.push([o0, m]); return pc; };
  anim(() => { for (const [a, b] of swaps) { b.transparent = a.transparent; b.depthWrite = a.depthWrite; } });
  // flat at the hold: the back face is pushed out along hold 12's view rays, so the sides are edge-on from the hold camera
  const flatFor = (pc, at, d) => { const g = pc.mesh.geometry, p = g.attributes.position; g.computeBoundingBox(); const zb = g.boundingBox.min.z; if (zb > -1e-6) return pc;
    const tw = -zb * kpx(d);
    for (let i = 0; i < p.count; i++) if (p.getZ(i) < zb / 2) { const x = p.getX(i), y = p.getY(i); p.setXY(i, x + (at[0] - 960 + x) * tw / d, y + (540 - at[1] + y) * tw / d); }
    p.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingBox(); return pc; };
  // build in: rises out of the dark (4 world units) with a quick fade; out: gone at 54.8
  // (integration: the whole build-in runs RE s earlier than first built, so the set is already rising at the right of frame
  //  as the orbit turns side-on (46.6–47.3 showed only the road against flat violet); the tunnel's rise below follows it)
  const RE = -0.45;
  // (review fix: fk, the fade's share of the rise; the peach arch uses 0.1: with 0.3 it was see-through for a moment, the road
  //  showing through its legs)
  const rise = (a, d, dur = 1.0, dyW = 4, fk = 0.3) => ({ y: [[a + RE, dyW / kpx(d)], [a + RE + dur, 0, 'power3.out']], op: [[a + RE, 0], [a + RE + fk * dur, 1]] });
  const PC = (spec, g) => { const pc = V.piece({ hold: 12, out: { type: 'fade', t: T_OUT, ease: 'none' }, ...spec }); flatFor(pc, spec.at, spec.depth); if (g) skin(pc, g, spec.at); return pc; };
  // a THREE.Shape from absolute board px (y down) around the anchor, with optional holes
  const shp = (P, at, holes = []) => { const s = new THREE.Shape(P.map(([x, y]) => new THREE.Vector2(x - at[0], at[1] - y)));
    for (const Hh of holes) s.holes.push(new THREE.Path(Hh.map(([x, y]) => new THREE.Vector2(x - at[0], at[1] - y)))); return s; };
  // a ∩ frame: outer arc (centre cO, radius RO) and inner arc (cI, RI), legs down to board y yb; one simple outline
  const archPts = (cO, RO, cI, RI, yb, n = 120) => {
    const P = [[cO[0] - RO, yb], [cO[0] - RO, cO[1]]];
    for (let i = 1; i < n; i++) { const a = Math.PI - Math.PI * i / n; P.push([cO[0] + RO * Math.cos(a), cO[1] - RO * Math.sin(a)]); }
    P.push([cO[0] + RO, cO[1]], [cO[0] + RO, yb], [cI[0] + RI, yb], [cI[0] + RI, cI[1]]);
    for (let i = 1; i < n; i++) { const a = Math.PI * i / n; P.push([cI[0] + RI * Math.cos(a), cI[1] - RI * Math.sin(a)]); }
    P.push([cI[0] - RI, cI[1]], [cI[0] - RI, yb]);
    return P; };
  const ybAt = (d, y = YB) => 540 + (E.y - y) / kpx(d);                   // board y of world height y at depth d
  const dedupe = pts => { const o = []; for (const q of pts) if (!o.length || q.distanceToSquared(o.at(-1)) > 1e-6) o.push(q); if (o.length > 2 && o[0].distanceToSquared(o.at(-1)) < 1e-6) o.pop(); return o; };

  /* ---------- the backdrop wall (d 11.2), just behind the peach arch; a ∩ notch where the arch stands ---------- */
  // (polish 2026-09-29, backlog: "frame 12's backdrop panel edge is seen side-on mid-orbit"; the review: it "reads as a floating
  //  card with visible edges and a dark gap behind it as the orbit passes side-on". Mid-orbit (46.45–48.85) the camera is off
  //  the wall's right end and, until ~47.6, above its top: it saw the wall edge-on at first, then its top edge from above and
  //  its right end with the dark beyond. The wall now runs on to board x W_RIGHT and up to board y W_TOP (world y ≈ 17.5),
  //  past everything the orbit sees of that plane (measured: up to board x ≈ 2880 and world y ≈ 13.7 while it rises), so no
  //  edge of it shows. Only the orbit changes: from 48.85 on (the slow window, the creep and the crane through the notch)
  //  nothing beyond the old outline (x 2340, y −300) is ever in view.)
  // (review fix, same day: the left end. The review found "a thin dark edge … at the join between the backdrop's left end and
  //  the side wing": the wing's corner stood 0.3 past the wall's end (board x −420) and 0.1 in front of it, so the orbit saw
  //  the background, and the wall's darker end face, through the gap: a ~15–20 px dark stripe sweeping out of the left edge
  //  at 48.4–48.95, beside the ASCO box, and a full-height hairline down the corner crease at 47.0–48.2. The wall's left end
  //  now runs on to board x W_LEFT = −500 (0.15 past the wing's corner; off-screen at the hold) and the wing's panel runs on
  //  to 0.02 in front of the wall's face (below), so every ray past the wing's edge lands on the wall. The wing stops just
  //  short of the wall rather than passing through it: the crease is then the wing's own edge, which the multisampling
  //  smooths, where a crossing would show 1-px steps (the log depth buffer writes depth per fragment).)
  const D_W = 11.2, W_LEFT = -500, W_RIGHT = 3400, W_TOP = -3200;
  { const yb = ybAt(D_W), P = [[W_LEFT, yb], [W_LEFT, W_TOP], [W_RIGHT, W_TOP], [W_RIGHT, yb], [1520, yb], [1520, 455]];
    for (let i = 1; i < 96; i++) { const a = Math.PI * i / 96; P.push([960 + 560 * Math.cos(a), 455 - 560 * Math.sin(a)]); }
    P.push([400, 455], [400, yb]);
    PC({ shape: shp(P, [960, 540]), at: [960, 540], depth: D_W, thick: 0.5, drift: 0, keys: rise(46.9, D_W) },
      { field: [[20, 20, '#3e0891'], [300, 20, '#3e098f'], [510, 40, '#41098e'], [1420, 20, '#3d098f'], [1650, 20, '#3e098f'], [1850, 22, '#3f088f'], [960, -250, '#3a0785'],
        [20, 100, '#430797'], [300, 90, '#430896'], [20, 200, '#4708a3'], [20, 300, '#5007ad'], [318, 420, '#5507b9'], [318, 560, '#6006c8'], [318, 720, '#6705d6'], [318, 860, '#6e04e8'],
        [102, 560, '#5d06c6'], [102, 820, '#6d04e4'], [1600, 420, '#5507b9'], [1600, 720, '#6705d6'], [1700, 900, '#6b0df0'], [1880, 960, '#6f0af3'], [1800, 468, '#64029a'], [1850, 466, '#6502c0'],
        [1905, 520, '#8f11ee'], [1905, 620, '#7a13ec'], [1905, 720, '#7012eb'], [1905, 820, '#6b0fed'], [1890, 900, '#7104ed'],
        [-300, 150, '#44089c'], [-300, 600, '#6005cc'], [-300, 1000, '#6c05e0'], [2250, 150, '#44089c'], [2250, 600, '#6a0ce0'], [2250, 1000, '#700ae8'], [960, 1500, '#5a08c0']],
        kern: 150, kpw: 2.2, amp: 25, per: 12 }); }
  // the stadium ring at the left (violet at the top, orange down the left side, pink down the right; its foot on the bank line)
  { const at = [101, 667], o = V.rr(350, 674, 175), hole = dedupe(V.rr(116, 438, 58).getPoints(48)); o.holes.push(new THREE.Path(hole.map(p => new THREE.Vector2(p.x + 1, p.y)).reverse()));
    PC({ shape: o, at, depth: 11.0, thick: 0.25, keys: rise(47.0, 11.0) },
      { field: [[22, 420, '#6a05eb'], [22, 500, '#881bbc'], [22, 580, '#b53d73'], [22, 660, '#dc632a'], [22, 740, '#f57810'], [22, 860, '#fc7d1e'], [22, 980, '#f3773e'], [-60, 700, '#e8701c'], [-60, 500, '#7a14cc'],
        [220, 420, '#5c01fc'], [220, 500, '#7509ea'], [220, 580, '#981cc9'], [220, 660, '#ba31ac'], [250, 780, '#db4699'], [220, 860, '#eb5387'], [220, 940, '#f45e76'],
        [60, 960, '#fd7837'], [110, 975, '#fd6f4a'], [160, 960, '#fa6660'], [101, 350, '#5a08d0'], [30, 360, '#5a0ad8'], [180, 360, '#5a06e0']], kern: 60, kpw: 2.5, amp: 12, per: 11 }); }
  // the peach dot
  PC({ shape: SH.disc(52), at: [248, 724], depth: 10.85, thick: 0.15, keys: rise(47.1, 10.85) }, { lin: [[0, '#f7bf7c'], [0.5, '#fabf79'], [1, '#f2bb7d']], A: [196, 724], B: [300, 724] });
  // the two bars at the top edge (violet → orange, left to right), running up out of frame
  for (const x0 of [324, 1440]) PC({ shape: V.rr(165, 610, 82), at: [x0 + 82.5, 20], depth: 11.05, thick: 0.2, keys: rise(47.05, 11.05) },
    { lin: [[0, '#700ee1'], [0.13, '#932aad'], [0.36, '#c8555e'], [0.55, '#ea732b'], [0.7, '#ef7623'], [1, '#ec7725']], A: [x0, 50], B: [x0 + 165, 50] });
  // top right: the orange ¾ disc (its top-right quarter missing), the lavender quarter disc, the magenta shape
  { const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(120, 0); s.absarc(0, 0, 120, 0, Math.PI / 2, true); s.lineTo(0, 0);
    PC({ shape: s, at: [1800, 160], depth: 11.05, thick: 0.2, keys: rise(47.15, 11.05) }, { lin: [[0, '#e96f21'], [0.5, '#ee6524'], [1, '#f5522a']], A: [1680, 200], B: [1920, 200] }); }
  { const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(-116, 0); s.absarc(0, 0, 116, Math.PI, 1.5 * Math.PI, false); s.lineTo(220, -116); s.lineTo(220, 0); s.lineTo(0, 0);
    PC({ shape: s, at: [1920, 44], depth: 10.95, thick: 0.2, keys: rise(47.2, 10.95) }, { lin: [[0, '#a973f8'], [1, '#aa74ff']], A: [1810, 50], B: [1920, 150] }); }
  // (polish: it runs on to the wall's new right end, as it runs out of board 12's frame, so its end doesn't show mid-orbit)
  PC({ shape: shp([[1771, 305], [W_RIGHT - 20, 305], [W_RIGHT - 20, 905], [1886, 905], [1886, 452], [1771, 452]], [1900, 500]), at: [1900, 500], depth: 11.05, thick: 0.2, keys: rise(47.2, 11.05) },
    { field: [[1776, 330, '#c51daf'], [1776, 440, '#b01fa9'], [1800, 380, '#b80ff8'], [1850, 380, '#b80ff8'], [1905, 400, '#af10f5'], [1905, 450, '#a011f2'], [1905, 520, '#8f11ee'],
      [1905, 620, '#7a13ec'], [1905, 720, '#7012eb'], [1905, 820, '#6b0fed'], [1905, 895, '#7104ed'], [2150, 400, '#a812f0'], [2150, 800, '#6e10ea']], kern: 60, kpw: 2.5, amp: 10 });

  /* ---------- (fix pass 2) the wall's wing: mid-orbit (46.5–47.1) the camera looks straight across the road (world +x), with
     frame 11's wall edge-on to its left and this wall edge-on to its right, and saw only background (a whip over nothing).
     The wall now folds forward at its left end (board x −420, world x ≈ 6021) and runs back along the road's right side to
     (6036, z −3): board 12's wall colours (dark violet at the top, brighter low down) with board 12's left motifs on it
     (a stadium ring, the peach dot, two violet → orange bars), so the whip passes a built set. It is outside hold 12's view
     (≥ 2.7 u beyond its left edge), rises with the wall as the orbit starts, and sinks during hold 12, before the crane.
     (review fix 2026-09-29: the corner A and the motifs laid out from it are where they were; only the panel runs on past A
     along the wing, to 0.02 in front of the wall's face, which now runs on behind it (W_LEFT above), so the join is closed
     from every point of the orbit: the camera stays on the road side of the wing, x ≤ 6013.1.) ---------- */
  { const A = new Vec(X0 + (960 + 420) * kpx(D_W) + 0.3, 0, E.z + D_W - 0.1), B = new Vec(X0 + 23, 0, -3);
    // (local frame: u from the far end B toward the corner A, v up, n = u × up toward the road; right-handed, so extrusions
    //  stand out toward the road and keep their front faces)
    const U = A.clone().sub(B).setY(0), Lw = U.length(); U.normalize();
    const Nf = new Vec().crossVectors(U, UP).normalize();
    // (polish 2026-09-29: its top at the corner meets the backdrop's top, which is taller now (board y W_TOP), so no step shows
    //  at the join; it still runs down to 12 at the far end)
    const yTop0 = E.y + (540 - W_TOP) * kpx(D_W), grp = new THREE.Group(); V.scene.add(grp);
    const put = (geo, m, u, v, off = 0.05) => { const me = new THREE.Mesh(geo, m); me.frustumCulled = false;
      me.matrixAutoUpdate = false; me.matrix.makeBasis(U, UP, Nf).setPosition(A.clone().addScaledVector(U, -u).addScaledVector(UP, v).addScaledVector(Nf, off)); grp.add(me); return me; };
    const eIn = (E.z + D_W - 0.02 - A.z) / U.z;   // the panel runs on past A to 0.02 in front of the wall's face (see the note above)
    const panel = new THREE.Shape([[-Lw, -11], [eIn, -11], [eIn, yTop0], [0, yTop0], [-Lw, 12]].map(([x, y]) => new THREE.Vector2(x, y)));   // (A at 0, B at −Lw)
    put(new THREE.ShapeGeometry(panel), V.mat(['#6e04e8', '#5007ad', '#3e098f'], { axis: [0, 1, 0], lo: -11, hi: 12, side: THREE.DoubleSide, flat: true }), 0, 0, 0);
    // the stadium ring (board 12's proportions): orange low, pink, violet at the top
    { const o = V.rr(4.2, 8.1, 2.1); o.holes.push(new THREE.Path(V.rr(1.4, 5.3, 0.7).getPoints(48).reverse()));
      put(V.ext(o, 0.4), V.mat(['#f57810', '#b53d73', '#6a05eb'], { axis: [0, 1, 0], lo: -4, hi: 4, local: true }), 15, -2); }
    put(V.ext(V.disc(1.0), 0.3), V.mat(['#f7bf7c', '#fabf79', '#f2bb7d'], { axis: [1, 0, 0], lo: -1, hi: 1, local: true }), 20.5, -5.6);
    for (const u of [8, 26]) put(V.ext(V.rr(1.9, 10, 0.95), 0.35), V.mat(['#700ee1', '#c8555e', '#ec7725'], { axis: [1, 0, 0], lo: -0.95, hi: 0.95, local: true }), u, 4.5);
    const eUp = gsap.parseEase('power3.out'), eDn = gsap.parseEase('power2.in');
    anim(t => { grp.visible = t > 46.2 && t < 49.85; if (!grp.visible) return;
      grp.position.y = -26 * (1 - eUp(Math.min(1, Math.max(0, (t - 46.2) / 0.55)))) - 26 * eDn(Math.min(1, Math.max(0, (t - 49.2) / 0.6))); }); }

  /* ---------- the three ∩ frames (board arcs measured: peach R600 / 435 about (960, 455); violet → orange edge R268 about (966, 452);
     the doorway R193.5 about (964.5, 451.5)); each back one runs 6 px under its front neighbour, so no seam opens in motion ---------- */
  // (the far frames are anchored in the world (the violet's front at z 50.68, d 32 from today's hold camera), because the crane
  //  that passes over them is: if the hold camera moves, they keep ~2.8 of clearance under it and don't hide the tunnel's far end)
  const D_P = 10.0, D_V = 50.68 - E.z, D_O = D_V + 1.2;
  PC({ shape: shp(archPts([960, 455], 600, [960, 456], 435, ybAt(D_P)), [960, 455]), at: [960, 455], depth: D_P, thick: 0.8, drift: 2, keys: rise(47.25, D_P, 1.0, 4, 0.1) },
    { lin: [[0, '#f99f5d'], [0.4, '#fca25b'], [0.62, '#fea458'], [1, '#fea658']], A: [960, -145], B: [960, 800] });
  // (fix pass: once the sphere is in the doorway the violet frame sinks away below the road (52.0–52.55) as the crane rises over
  //  it: its broad top face used to fill the frame at 52.3–52.5)
  const sinkV = (() => { const k = rise(47.4, D_V, 1.0, 5); k.y.push([52.0, 0], [52.55, 13 / kpx(D_V), 'power2.in']); k.op.push([52.5, 1], [52.55, 0]); return k; })();
  PC({ shape: shp(archPts([960, 456], 441, [966, 452], 268, ybAt(D_V)), [960, 456]), at: [960, 456], depth: D_V, thick: 1.0, drift: 1.5, keys: sinkV },
    { lin: [[0, '#781ae1'], [0.17, '#781ae1'], [0.3, '#8524cc'], [0.58, '#973597'], [0.82, '#b24783'], [0.98, '#c1506c'], [1.1, '#c5536a']], A: [960, 20], B: [960, 720] });
  PC({ shape: shp(archPts([966, 452], 274, [964.5, 451.5], 193.5, ybAt(D_O)), [964.5, 451.5]), at: [964.5, 451.5], depth: D_O, thick: 1.2, drift: 0, keys: rise(47.55, D_O, 1.0, 5) },
    { lin: [[0, '#e8721f'], [0.5, '#ee6324'], [1, '#fc4333']], A: [692, 400], B: [1240, 400] });

  /* ================= the road ================= */
  // stations: along the sphere's path from 1.5 past hold 11's mark, easing onto the straight road (z 13 → 21), then straight
  // to the tunnel's far end
  const s11 = sOf('m11'), sE = s11 + 1.5;
  // (fix pass: the road starts where f11's neck ends (G.neckRoad.s = sE + 4.5), on the neck's last section exactly, instead of
  //  as a straight slab over the neck from sE: its outline showed as cracks and the neck's edges showed past it. sE still
  //  anchors the colour stops and the narrowing, so the road looks as before from there on.)
  const sR = G.neckRoad ? G.neckRoad.s : sE;
  const zRoof = C.getPointAt(sOf('roof') / L).z, ZR1 = zRoof - 0.7;           // the road stops short of f13's pipe
  // road and kerbs sized from the hold camera's eye height hE over the road, so they sit on board 12's lines: the road's edges
  // (slope 0.9 from the vanishing point) and the kerbs' top edges (slope 0.555, rising 0.0065 per unit of depth)
  const hE = E.y - YR, WR = hE / 0.9, XK = WR + 0.12;
  const Z0 = 13, Z1 = 21;
  const kerbH = z => hE - 0.555 * XK + 0.0065 * Math.min(30, Math.max(0, z - E.z));
  // the joint with f11 (its contract): the road starts 1.5 past the mark, flat, 6 wide and 0.9 deep, its top 1 below the
  // sphere; f11's ribbon narrows into that section under it (its neck, 0.015 lower) and its tail dissolves as the road
  // appears (45.5). Past the neck's end (4.5 on) the road narrows into its own kerbed section.
  const NK = sE + 4.5, LT = 9;
  const STN = [];
  const addStn = (p, tn, s) => {
    const w = sm((p.z - Z0) / (Z1 - Z0)), e = sm((s - NK) / LT), k = sm((s - NK - 0.5 * LT) / LT);
    const T = tn.clone().lerp(new Vec(0, 0, 1), w).normalize(), S = new Vec().crossVectors(UP, T).normalize(), U = new Vec().crossVectors(T, S).normalize();
    const S0 = new Vec().crossVectors(UP, tn).normalize(), U0 = new Vec().crossVectors(tn, S0).normalize();
    const c = p.clone().addScaledVector(U0, -1).lerp(new Vec(X0, YR, p.z), w);
    const yb = c.y - 0.9 + (YB - (c.y - 0.9)) * sm((p.z - 12) / 8), bb = (yb - c.y) / U.y;
    const q = { c, S, U, kw: 0.12 * k, hk: kerbH(p.z) * k,
      aL: 3 + (WR - 3) * e, bL: 0, aR: -3 + (3 - WR) * e, bR: 0, o: 0 };
    q.bBL = q.bBR = bb;
    // the section ring: top (right edge → left edge), the +S kerb and side, the underside, the −S side and kerb
    q.ring = [[q.aR, q.bR], [q.aL, q.bL], [q.aL, q.bL + q.hk], [q.aL + q.kw, q.bL + q.hk], [q.aL + q.kw + q.o, q.bBL], [q.aR - q.kw + q.o, q.bBR], [q.aR - q.kw, q.bR + q.hk], [q.aR, q.bR + q.hk]];
    STN.push(q);
  };
  for (let s = sR; ; s += 0.15) { const u = s / L, p = C.getPointAt(u); if (p.z >= Z1 - 0.05) break; addStn(p, C.getTangentAt(u), s); }
  for (let z = Z1; z <= ZR1 + 1e-6; z += 0.5) addStn(new Vec(X0, YR + 1, z), new Vec(0, 0, 1), 1e4);
  {
    const pos = [], fc = [], sd = [], idx = [];
    const P3 = (q, [a, b]) => q.c.clone().addScaledVector(q.S, a).addScaledVector(q.U, b);
    const strip = (i0, i1, face, side) => { const base = pos.length / 3;
      for (const q of STN) for (const i of [i0, i1]) { const P = P3(q, q.ring[i]); pos.push(P.x, P.y, P.z); fc.push(face); sd.push(side); }
      for (let i = 0; i < STN.length - 1; i++) { const k = base + 2 * i; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); } };
    strip(0, 1, 0, 0);                                                                        // road top
    strip(1, 2, 1, 1); strip(2, 3, 2, 1); strip(3, 4, 3, 1);                                  // +S kerb: inner face, top, outer side
    strip(4, 5, 4, 0);                                                                        // underside
    strip(5, 6, 3, -1); strip(6, 7, 2, -1); strip(7, 0, 1, -1);                               // −S: outer side, kerb top, inner face
    // end caps (the start, inside f11's ribbon end, and the far end inside the tunnel)
    // (fix pass: the start cap sits a little inside the road (3% smaller, 0.03 in), so its edges don't draw a hairline across the
    //  joint with f11's neck)
    const fw0 = STN[1].c.clone().sub(STN[0].c).normalize();
    for (const [q, dir] of [[STN[0], -1], [STN.at(-1), 1]]) { const b0 = pos.length / 3, cen = new Vec(); for (const r of q.ring) cen.add(P3(q, r)); cen.multiplyScalar(1 / q.ring.length);
      for (const r of q.ring) { let P = P3(q, r); if (dir < 0) P = cen.clone().lerp(P, 0.97).addScaledVector(fw0, 0.03); pos.push(P.x, P.y, P.z); fc.push(4); sd.push(0); }
      for (let i = 1; i < q.ring.length - 1; i++) dir < 0 ? idx.push(b0, b0 + i + 1, b0 + i) : idx.push(b0, b0 + i, b0 + i + 1); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('fc', new THREE.Float32BufferAttribute(fc, 1));
    g.setAttribute('sd', new THREE.Float32BufferAttribute(sd, 1)); g.setIndex(idx);
    // colours by depth from the hold camera (d = z − E.z; the approach is d < 0): the road (board 12: indigo, darkening into the
    // doorway; the approach runs from f11's orange through pink and magenta), the lavender left kerb, the pink right kerb,
    // the violet sides. Living: the colours slide ±0.5 u along the road, exactly on the board's at the key instant.
    const tab = list => ({ s: pad(list.map(q => q[0]), 16, () => 1e5), c: pad(list.map(q => hexV3(q[1])), 16, () => hexV3(list.at(-1)[1])), n: list.length });
    const zs = E.z - C.getPointAt(sE / L).z;                                // (the road's start in d, ≈ −17.6)
    // (sampled on board 12: the road by its board y, the kerbs by their board x, turned into depths through the hold camera)
    const rd = py => hE * 540 / ((py - 540) * tv), kd = px => WR * 540 / (Math.abs(960 - px) * tv);
    // (integration: the first stops are f11's ribbon's own colours at the hand-off (its builder's samples: #ee5e3f there,
    //  #fc6f22 2 on, #fe7f09 4.5 on; near side #0201b0), so no lighter 'plank' shows behind the sphere as f11's tail dissolves)
    const RD = tab([[-zs, '#ee5e3f'], [-zs + 2, '#fc6f22'], [-zs + 4.5, '#fe7f09'], [-12, '#ff7d34'], [-7.5, '#ff5a64'], [-3.4, '#c02ac0'], [-0.4, '#6a0edc'], [rd(1456), '#4f06c6'], [rd(1068), '#4705b9'], [rd(980), '#3c0595'], [rd(902), '#310775'],
      [rd(800), '#200852'], [rd(760), '#1a0744'], [rd(720), '#120939'], [rd(689), '#0b0a2a'], [rd(665), '#060a21'], [rd(646), '#050a20']]);
    const LK = tab([[-zs, '#ff9a4a'], [-4, '#b060e0'], [0, '#7a62f0'], [kd(120), '#7459f2'], [kd(300), '#7446f1'], [kd(400), '#723af2'], [kd(480), '#712cf2'], [kd(560), '#7020f3'], [kd(640), '#6e13f2'],
      [kd(700), '#5810c4'], [kd(740), '#440f9e'], [kd(770), '#34107c'], [kd(780), '#1d1152'], [kd(780) + 3, '#0c0b28'], [kd(780) + 7, '#050a20']]);
    const RK = tab([[-zs, '#ff7a5a'], [-4, '#e8509a'], [0, '#e2459c'], [kd(1800), '#de439f'], [kd(1700), '#cf3fa8'], [kd(1600), '#c138b2'], [kd(1500), '#ac2fc1'], [kd(1400), '#a228cc'], [kd(1280), '#8a1fdc'],
      [kd(1210), '#7616ec'], [kd(1180), '#7213f0'], [kd(1150), '#5d11cc'], [kd(1140), '#3d1598'], [kd(1140) + 2.2, '#1a0c40'], [kd(1140) + 6.2, '#050a20']]);
    const SD = tab([[-zs, '#0201b0'], [-zs + 4, '#1a06b0'], [-4, '#3a10a8'], [4, '#4c16bc'], [14, '#3e10a6'], [22, '#1c0a4c'], [27, '#0a0826']]);
    const u = { t: base.uniforms.t, flow: base.uniforms.flow, spd: base.uniforms.spd, tk: { value: TK }, ez: { value: E.z }, op: { value: 1 }, fy0: { value: FY0 }, fy1: { value: FY1 }, dk: { value: hexV3(DK) } };
    for (const [k, T] of [['r', RD], ['l', LK], ['q', RK], ['o', SD]]) { u[k + 'S'] = { value: T.s }; u[k + 'C'] = { value: T.c }; u[k + 'N'] = { value: T.n }; }
    const m = new THREE.ShaderMaterial({ uniforms: u, side: THREE.DoubleSide,
      vertexShader: LOGV + 'attribute float fc, sd; varying float vF, vSd, vZ, vY;\nvoid main() { vF = fc; vSd = sd; vZ = position.z; vY = position.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}',
      fragmentShader: `uniform float t, flow, spd, tk, ez, op, fy0, fy1; uniform vec3 dk;
uniform float rS[16], lS[16], qS[16], oS[16]; uniform vec3 rC[16], lC[16], qC[16], oC[16]; uniform int rN, lN, qN, oN;
varying float vF, vSd, vZ, vY;
#include <logdepthbuf_pars_fragment>
vec3 st16(float g, float s[16], vec3 c[16], int n) { vec3 col = c[0]; for (int i = 1; i < 16; i++) { if (i >= n) break; col = mix(col, c[i], clamp((g - s[i - 1]) / max(1e-4, s[i] - s[i - 1]), 0.0, 1.0)); } return col; }
void main() {
  float d = vZ - ez + 0.5 * min(flow, 1.6) * (sin(6.2832 * ((t - tk) * spd) / 11.0 + 0.7) - sin(0.7));
  vec3 col;
  if (vF < 0.5) col = st16(d, rS, rC, rN);
  else if (vF < 2.5) { col = vSd > 0.0 ? st16(d, lS, lC, lN) : st16(d, qS, qC, qN); }
  else if (vF < 3.5) col = st16(d, oS, oC, oN);
  else col = dk;
  col = mix(col, dk, 1.0 - smoothstep(fy1, fy0, vY));
  gl_FragColor = vec4(col, op);
#include <logdepthbuf_fragment>
}` });
    mesh(g, m);
    if (G.neckRoad) { const U = G.neckRoad.u;                               // (f11's neck blends into this road's own colours)
      U.rS.value = RD.s; U.rC.value = RD.c; U.rN.value = RD.n; U.oS.value = SD.s; U.oC.value = SD.c; U.oN.value = SD.n; U.ez.value = E.z; U.tk12.value = TK; }
  }

  /* ================= the tunnel behind the orange frame (the doorway), to f13's pipe ================= */
  const kO = kpx(D_O), TX = X0 - 4.5 * kO, tRi = 193.5 * kO, tRo = tRi + 0.35, tyc = E.y + 88.5 * kO, TF = -5.06;
  const zT0 = E.z + D_O + 0.2, zT1 = zRoof;
  const tubeParts = [];
  {
    const K = 40, outer = [[-tRo, YB], [-tRo, tyc]], inner = [[tRi, TF], [tRi, tyc]];
    for (let i = 1; i < K; i++) { const a = Math.PI - Math.PI * i / K; outer.push([tRo * Math.cos(a), tyc + tRo * Math.sin(a)]); }
    outer.push([tRo, tyc], [tRo, YB]);
    for (let i = 1; i < K; i++) { const a = Math.PI * i / K; inner.push([tRi * Math.cos(a), tyc + tRi * Math.sin(a)]); }
    inner.push([-tRi, tyc], [-tRi, TF], [tRi, TF]);
    const sweepZ = (poly, z0, z1) => { const pos = [], idx = [];
      for (const [a, y] of poly) pos.push(TX + a, y, z0, TX + a, y, z1);
      for (let i = 0; i < poly.length - 1; i++) { const k = 2 * i; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g; };
    const sv = LOGV + 'varying vec3 vW; varying vec3 vN;\nvoid main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w;\n#include <logdepthbuf_vertex>\n}';
    const tubeF = (body) => `uniform float t, flow, spd, tk, op, fy0, fy1, yc, yt; uniform vec3 dk, c0, c1, c2, c3;
varying vec3 vW; varying vec3 vN;
#include <logdepthbuf_pars_fragment>
void main() {
  ${body}
  col = mix(col, dk, 1.0 - smoothstep(fy1, fy0, vW.y));
  gl_FragColor = vec4(col, op);
#include <logdepthbuf_fragment>
}`;
    const U0 = { t: base.uniforms.t, flow: base.uniforms.flow, spd: base.uniforms.spd, tk: { value: TK }, op: { value: 1 }, fy0: { value: FY0 }, fy1: { value: FY1 }, dk: { value: hexV3(DK) }, yc: { value: tyc }, yt: { value: tyc + tRo } };
    // outside: violet over the roof, into magenta down the sides (the violet arch's colours), living along the tunnel
    const mOut = new THREE.ShaderMaterial({ uniforms: { ...U0, c0: { value: hexV3('#781ae1') }, c1: { value: hexV3('#8a28c0') }, c2: { value: hexV3('#a33c98') }, c3: { value: hexV3('#b44a84') } },
      vertexShader: sv, fragmentShader: tubeF(`float h = (vW.y - yc) / (yt - yc) + 0.06 * min(flow, 1.6) * (sin(6.2832 * ((t - tk) * spd) / 9.0 + 0.4 + vW.z * 0.12) - sin(0.4 + vW.z * 0.12));
  vec3 col = h > 0.55 ? mix(c1, c0, smoothstep(0.55, 1.0, h)) : h > 0.0 ? mix(c2, c1, h / 0.55) : mix(c3, c2, clamp(1.0 + h / 1.0, 0.0, 1.0));
  col *= 0.86 + 0.14 * clamp(normalize(vN).y, 0.0, 1.0);`) });
    const mIn = new THREE.ShaderMaterial({ uniforms: { ...U0, c0: { value: hexV3('#050a20') }, c1: { value: new Vec() }, c2: { value: new Vec() }, c3: { value: new Vec() } }, side: THREE.DoubleSide,
      vertexShader: sv, fragmentShader: tubeF('vec3 col = c0;') });
    const mEnd = new THREE.ShaderMaterial({ uniforms: { ...U0, c0: { value: hexV3('#ee6324') }, c1: { value: hexV3('#e8721f') }, c2: { value: new Vec() }, c3: { value: new Vec() } },
      vertexShader: sv, fragmentShader: tubeF('vec3 col = mix(c1, c0, smoothstep(-6.0, 0.0, vW.y));') });
    // (fix pass: the roof is cut away after the first 4.6 u (zC): the rest of the tunnel is an open channel, so the crane over it sees
    //  the sphere roll on through it from ~52.45 (it was hidden 52.1–53.0 under a plain violet bell), and board 13's cut-open pipe
    //  follows on from it (the user's note for 13). The closed part and its (denser) fog keep the doorway board 12's dark.)
    const zC = zT0 + 4.6;
    tubeParts.push(mesh(sweepZ(outer, zT0, zC), mOut), mesh(sweepZ(inner, zT0, zC), mIn));
    // the open channel: its walls (outside violet → magenta, inside the tunnel's colours lit), their flat rims, the floor
    const mInO = new THREE.ShaderMaterial({ uniforms: { ...U0, c0: { value: hexV3('#781ae1') }, c1: { value: hexV3('#8a28c0') }, c2: { value: hexV3('#a33c98') }, c3: { value: hexV3('#b44a84') } }, side: THREE.DoubleSide,
      vertexShader: sv, fragmentShader: tubeF(`float h = (vW.y - yc) / (yt - yc); vec3 col = mix(c3, c2, clamp(1.0 + h / 1.0, 0.0, 1.0)) * (0.62 + 0.18 * smoothstep(${(zC).toFixed(2)}, ${(zC + 4).toFixed(2)}, vW.z));`) });
    // (review fix: seen from the crane at 52.95–53.35 the channel's far end was a dark box flanked by the walls' tall, sharp
    //  top corners (orange left, violet right), with the pipe's start ring floating above it. The walls now slope down from
    //  the roof's cut (their full height) to a low lip at the far end (a smooth S), so the channel runs out onto the floor
    //  and f13's half-pipe, which starts on its floor, carries straight on out of it. Both rims face up.)
    const wTop = z => { const u = Math.min(1, Math.max(0, (z - zC) / (zT1 - zC))); return tyc + (TF + 0.25 - tyc) * u * u * (3 - 2 * u); };
    const sweepZf = (polyAt, z0, z1, N = 24) => { const pos = [], idx = [], m = polyAt(z0).length;
      for (let i = 0; i <= N; i++) { const z = z0 + (z1 - z0) * i / N; for (const [a, y] of polyAt(z)) pos.push(TX + a, y, z); }
      for (let i = 0; i < N; i++) for (let k = 0; k < m - 1; k++) { const A = i * m + k, B = A + m; idx.push(A, B, A + 1, B, B + 1, A + 1); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g; };
    for (const sg of [-1, 1]) {
      tubeParts.push(mesh(sweepZf(z => [[sg * tRo, YB], [sg * tRo, wTop(z)]], zC, zT1), mOut), mesh(sweepZf(z => [[sg * tRi, wTop(z)], [sg * tRi, TF]], zC, zT1), mInO),
        mesh(sweepZf(z => sg > 0 ? [[tRi, wTop(z)], [tRo, wTop(z)]] : [[-tRo, wTop(z)], [-tRi, wTop(z)]], zC, zT1), mEnd)); }
    tubeParts.push(mesh(sweepZ([[-tRi, TF], [tRi, TF]], zC, zT1), mInO));
    // the roof's cut face at zC (a half ring, facing on down the channel: orange, like the doorway frame and the exit)
    { const c = new THREE.Shape(); c.moveTo(tRo, tyc); c.absarc(0, tyc, tRo, 0, Math.PI, false); c.lineTo(-tRi, tyc); c.absarc(0, tyc, tRi, Math.PI, 0, true); c.lineTo(tRo, tyc);
      const gC = new THREE.ShapeGeometry(c, 40); gC.translate(TX, 0, zC); tubeParts.push(mesh(gC, mEnd)); }
    // the end faces: the exit (orange, facing +z, where f13's pipe comes out: a U now, below the cut) and the mouth end (dark,
    // inside the orange frame)
    const s = new THREE.Shape(); s.moveTo(-tRo, YB); s.lineTo(tRo, YB); s.lineTo(tRo, tyc); s.absarc(0, tyc, tRo, 0, Math.PI, false); s.lineTo(-tRo, YB);
    s.holes.push(new THREE.Path(inner.map(([a, y]) => new THREE.Vector2(a, y))));
    const yL = TF + 0.25;                                                   // (the walls' low lip at the far end, see wTop)
    const u = new THREE.Shape(); u.moveTo(-tRo, YB); u.lineTo(tRo, YB); u.lineTo(tRo, yL); u.lineTo(tRi, yL); u.lineTo(tRi, TF); u.lineTo(-tRi, TF); u.lineTo(-tRi, yL); u.lineTo(-tRo, yL); u.lineTo(-tRo, YB);
    const gEnd = new THREE.ShapeGeometry(u, 4); gEnd.translate(TX, 0, zT1);
    const gMouth = new THREE.ShapeGeometry(s, 40); gMouth.rotateY(Math.PI); gMouth.translate(TX, 0, zT0);
    tubeParts.push(mesh(gEnd, mEnd), mesh(gMouth, mIn));
    // dark layers in the mouth (thin, many: no band shows): the sphere fades into the tunnel's dark as it rolls in
    const fogS = new THREE.Shape(inner.slice(0, -1).map(([a, y]) => new THREE.Vector2(a * 0.997, TF + (y - TF) * 0.997)));
    const gFog = new THREE.ShapeGeometry(fogS, 40);
    const fogM = a => new THREE.ShaderMaterial({ uniforms: { op: { value: a } }, transparent: true, depthWrite: false, side: THREE.DoubleSide,
      vertexShader: LOGV + 'void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}',
      fragmentShader: 'uniform float op;\n#include <logdepthbuf_pars_fragment>\nvoid main() { gl_FragColor = vec4(0.0196, 0.0392, 0.1255, op);\n#include <logdepthbuf_fragment>\n}' });
    // (fix pass: the fog was 26 layers 0.25–0.5 apart, and each sliced the sphere at its own depth: concentric 'onion rings' as it
    //  rolled in (51.7–52.1). Now a layer every 0.025 with the same density (0.65 per unit to 4.45 in, 0.575 beyond; the same total
    //  darkness), easing in over the first 0.6: no step shows on the sphere.)
    //  (With the roof open from zC, the fog fills only the closed part, denser: 1.0 per unit, ~1.5% gets through, as dark as before.)
    //  (Thin layers only while the sphere is still bright (to 3.0 in); then layers 0.2 apart, 1.2 per unit: an 8-bit frame can't
    //  darken much further with 2%-layers, whose change rounds away below ~20/255, which left a grey ghost of what's beyond.)
    const fogMs = new Map(), LAYS = [];
    for (let dz = 0.1; dz < 3.0 - 1e-6; dz += 0.025) LAYS.push([dz, 1.0 * sm((dz - 0.1) / 0.6), 0.025]);
    for (let dz = 3.0; dz <= zC - zT0 - 0.1 + 1e-6; dz += 0.2) LAYS.push([dz, 1.2, 0.2]);
    for (const [dz, sg, w] of LAYS) { const a = Math.round((1 - Math.exp(-sg * w)) * 2000) / 2000; if (a <= 0) continue;
      if (!fogMs.has(a)) fogMs.set(a, fogM(a)); const f = mesh(gFog, fogMs.get(a), 2); f.position.set(TX, 0, zT0 + dz); tubeParts.push(f); }
    // (fix pass 2: the layers alone left a grey ghost at 51.85–52.2: the sphere as a flat grey disc, and the lit channel and pipe
    //  beyond showing through dimly (thin layers stop darkening below ~25/255 in an 8-bit frame). Now (a) an opaque cap in the
    //  fog's colour closes the dark section just before the roof's cut, so nothing beyond shows through the doorway, and (b) a
    //  thin shell in the fog's colour round the sphere takes it the rest of the way to the doorway's dark in one blend, from
    //  2.2 u in (where the layers have taken it to ~a third); the shell is cut away past the cap, so the sphere comes out into
    //  the open channel bright.)
    const FOGC = 'vec3(0.0196, 0.0392, 0.1255)';
    const capM = new THREE.ShaderMaterial({ side: THREE.DoubleSide, vertexShader: LOGV + 'void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}',
      fragmentShader: `#include <logdepthbuf_pars_fragment>\nvoid main() { gl_FragColor = vec4(${FOGC}, 1.0);\n#include <logdepthbuf_fragment>\n}` });
    { const cp = mesh(gFog, capM); cp.position.set(TX, 0, zC - 0.05); tubeParts.push(cp); }
    const shM = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { op: { value: 0 }, zc: { value: zC - 0.05 } },
      vertexShader: LOGV + 'varying float vZ;\nvoid main() { vZ = (modelMatrix * vec4(position, 1.0)).z; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}',
      fragmentShader: `uniform float op, zc; varying float vZ;\n#include <logdepthbuf_pars_fragment>\nvoid main() { if (vZ > zc) discard; gl_FragColor = vec4(${FOGC}, op);\n#include <logdepthbuf_fragment>\n}` });
    const shell = new THREE.Mesh(new THREE.SphereGeometry(1.006, 48, 32), shM); shell.renderOrder = 6; shell.frustumCulled = false; V.scene.add(shell);
    anim((t, b) => { const dz = b.p.z - zT0, a = t > 51 && t < 53 && !b.h ? sm((dz - 2.2) / 1.2) : 0;
      shell.visible = a > 0.002 && dz < zC - zT0 + 1.1; if (!shell.visible) return; shell.position.copy(b.p); shell.scale.setScalar(Math.max(0.001, b.sc ?? 1)); shM.uniforms.op.value = a; });
  }

  /* ================= the sphere's shadow on the road ================= */
  // board 12: a near-black ellipse just below and right of the sphere (x 880–1100, y 725–792, centre x 990; its left side
  // softer), laid on the road through the hold camera (≈ 5.4 toward the camera from the contact point, 0.68 across, 1.98
  // each way along). Before the hold it is a contact shadow under the sphere, sliding out into the board's as the camera
  // settles; it fades as the sphere reaches the doorway.
  { const g = new THREE.CircleGeometry(1, 64); g.rotateX(-Math.PI / 2);
    const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { op: { value: 1 } }, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4,
      vertexShader: LOGV + 'varying vec2 vP;\nvoid main() { vP = position.xz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}',
      fragmentShader: `uniform float op; varying vec2 vP;
#include <logdepthbuf_pars_fragment>
void main() { float r = length(vP); float a = (0.55 + 0.45 * (1.0 - smoothstep(-0.7, 0.35, vP.x))) * (1.0 - smoothstep(0.8, 1.0, r));
  gl_FragColor = vec4(0.008, 0.003, 0.03, op * a * 0.97);
#include <logdepthbuf_fragment>
}` });
    const sh = new THREE.Mesh(g, m); sh.frustumCulled = false; sh.renderOrder = 1; V.scene.add(sh);
    const dAt = py => hE * 540 / ((py - 540) * tv), dN = dAt(792), dF = dAt(725), d76 = dAt(760), M = H.mark;
    const AZ = (dF - dN) / 2, AX = 110 * kpx(d76), DZ = M.z - (E.z + (dN + dF) / 2), DX = (X0 - 30 * kpx(d76)) - M.x;
    // (integration: the shadow now starts at the hand-off (45.45, as f11's road-side ribbon dissolves; f11's own contact shadow
    //  lies on its ribbon, which runs under this road from there): on the curved approach (z < Z1) it lies on the road's own
    //  surface (its section frame, STN), then flat on the straight road as before. There was no shadow from ~45.5 to ~47.5.)
    const zS0 = C.getPointAt(sR / L).z, mB = new THREE.Matrix4(), Tq = new Vec();   // (from the road's start, where f11's shadow hands over)
    anim((t, b) => { const on = t > 45.45 && t < T_OUT[1] && !b.h && b.p.z > zS0 - 0.6 && b.p.z < zT0 - 0.4; sh.visible = on; if (!on) return;
      // (fix pass 2: 15% larger at the hold: measured, the board's ellipse reaches ~12 px lower and ~40 px further left (soft))
      const k = sm((t - 48.75) / 0.6), az = 1.1 + (AZ * 1.15 - 1.1) * k, cz = 0.3 + (DZ - 0.3) * k;
      if (b.p.z < Z1) { let q = STN[0], bd = Infinity; for (const r of STN) { if (r.c.z > Z1 + 1) break; const d = r.c.distanceToSquared(b.p); if (d < bd) { bd = d; q = r; } }
        Tq.crossVectors(q.S, q.U); sh.quaternion.setFromRotationMatrix(mB.makeBasis(q.S, q.U, Tq));
        sh.position.copy(b.p).addScaledVector(q.U, -0.98).addScaledVector(Tq, -cz).addScaledVector(q.S, DX * k); }
      else { sh.quaternion.identity(); sh.position.set(b.p.x + DX * k, YR + 0.02, b.p.z - cz); }
      sh.scale.set(0.95 + (AX * 1.15 - 0.95) * k, 1, az);
      m.uniforms.op.value = sm((t - 45.45) / 0.25) * sm((b.p.z - zS0 + 0.6) / 1.0) * (1 - sm((b.p.z - (zT0 - 4)) / 3.6)); }); }

  /* ================= build and visibility of the custom meshes ================= */
  // the tunnel rises with the orange frame (same keys); the road is there from the end of hold 11; all gone at 54.8
  const eRise = gsap.parseEase('power3.out');
  anim(t => {
    const on = t > (G.handOff ?? 45.45) && t < T_OUT[1];                 // (review fix: from the moment f11's tail starts to fade)
    for (const me of mine) me.visible = on;
    const u = Math.min(1, Math.max(0, (t - 47.55 - RE) / 1.0)), dy = -5 * (1 - eRise(u));
    for (const me of tubeParts) me.position.y = dy;
    if (t < 47.55 + RE) for (const me of tubeParts) me.visible = false;
  });
};
