/* Frame 23 · the orange floor, the tile wall and the loop-the-loop behind it (G5, called from g5.js with its context G).
   Built: the real set, no plate. Everything is real geometry solved against the hold camera (h23), so at the key instant
   it lands on board 23; every surface takes its colour from where it sits in the hold view at rest (board colours
   measured off board 23, as smooth stop gradients in board px), so the colours ride with the shapes when they move and
   flow slowly (living), exactly on the board at the key instant (106.55).
   · The floor: a real slab whose top face is the board's orange band (its front and back edges solved to board py 952 and
     750 on the floor plane y = m23.y − 1, where the sphere touches) and whose front face is the violet band below it. It runs
     from x 14.5 (under 22's hop, off the left of the board) to 48.1 (just past G.kick; frame 24's floor, on the same level,
     starts at 47.9 and its violet column at ~48.7), behind the tile wall, in five sections.
     In: it slides in from the right during the 22 → 23 truck (102.55–103.75), well before the sphere's hop. Until the first
     section drops, one seamless top skin covers all five sections (no seam shows at the cuts). On the last section's end
     sits the kicker (G.kicker): a curved ramp the sphere rolls up to leap into frame 24's arch. Out: once the sphere has
     rolled past, each section drops away behind it (the last just after the sphere leaves the kicker's lip).
   · The sphere's shadow: board 23's hard, offset ellipse (black at the contact, thinning to the left: the key light is at
     the upper right), laid on the floor from the board and riding with the sphere while it rolls on the floor.
   · The loop: board 23's tall ring (a rounded-rect ring, magenta at the top to navy at the bottom), a real track: its face
     1.06 behind the sphere's loop (which runs along its band's centre-line, in one plane), two rails along the band's
     edges that the sphere rolls between (lit lips in the band's colours), a soft contact shadow behind the sphere, and a dark
     recessed panel in its hole. At the hold only its left side shows (the rest is behind the tiles). In: it glides in across
     the upper right out of the depth during the 22 → 23 truck (103.0–104.5). Out: once the sphere is out of it, it rises up
     and back out of the frame, whole (109.55–110.25).
   · The tile wall (x1028–1920, a layer in front of the loop and the floor's hidden end): four chunky tiles with their
     shapes in relief: A the two domes, B the four quarter discs (the red-orange star is the tile between them), C the ∪
     and its four stripes, D the half-disc. In: A and B drop in from above, C and D rise from below, then their shapes pop
     out (104.0–105.45). Just after the hold the wall breaks up like puzzle pieces (C drops, A lifts, B and D follow,
     107.05–107.9, starting as the sphere goes behind it), so the ride round the loop plays in the open.
   · A far backdrop with board 23's navy and its violet lift at the lower left, only around the hold (104.4–108.3).
   · It lends G.live (the engine's clock and flow uniforms, from its one registered material) to groups/g5/between.js, the
     in-between shapes of the 22 → 23 and 23 → 24 travels (polish pass, 2026-09-29), so they flow without a new engine
     material. */
export default (V, G) => {
  const { THREE, anim, scene } = V;
  const { h23, m23, bAt, cl, sm, E, ACTIVE, lx, rx, yTop, rc, rw, zL, kicker } = G;
  const Vec = THREE.Vector3;
  const TK = h23.tk, cam = h23.pos.clone(), fwd = h23.fwd.clone(), rgt = h23.right.clone(), upv = h23.upv.clone(), tanV = h23.tanV;
  const Y0 = m23.y - 1;                                                    // the floor's top: the sphere touches it

  /* ---------- the hold camera: rays and projection ---------- */
  const ray = (px, py) => fwd.clone().addScaledVector(rgt, (px - 960) / 540 * tanV).addScaledVector(upv, (540 - py) / 540 * tanV);
  const atD = (px, py, d) => cam.clone().addScaledVector(ray(px, py), d);              // on the view ray, at depth d
  const onZ = (px, py, z) => { const r = ray(px, py); return cam.clone().addScaledVector(r, (z - cam.z) / r.z); };
  const onY = (px, py, y) => { const r = ray(px, py); return cam.clone().addScaledVector(r, (y - cam.y) / r.y); };
  const hc = new THREE.PerspectiveCamera(h23.fov, 16 / 9, 0.05, 2000);
  hc.matrixAutoUpdate = false; hc.matrixWorld.makeBasis(rgt, upv, fwd.clone().negate()).setPosition(cam);
  hc.matrixWorldInverse.copy(hc.matrixWorld).invert(); hc.updateProjectionMatrix();
  const HVP = new THREE.Matrix4().multiplyMatrices(hc.projectionMatrix, hc.matrixWorldInverse);

  /* ---------- board-coloured material ----------
     colour = field(board px of the point's REST position in the hold view + a slow living slide that is zero at the key
     instant). Faces the hold camera sees keep the board colour; faces turned from it (the chunky sides) are shaded. */
  const hexC = h => { const n = parseInt(h.slice(1), 16); return `vec3(${((n >> 16 & 255) / 255).toFixed(4)}, ${((n >> 8 & 255) / 255).toFixed(4)}, ${((n & 255) / 255).toFixed(4)})`; };
  const stops = (name, st) => `vec3 ${name}(float v) { vec3 c = ${hexC(st[0][1])};\n` +
    st.slice(1).map(([v, h], i) => `  c = mix(c, ${hexC(h)}, clamp((v - ${st[i][0].toFixed(1)}) / ${(v - st[i][0]).toFixed(1)}, 0.0, 1.0));`).join('\n') + '\n  return c; }\n';
  const along = (axis, st) => stops('s0', st) + `vec3 fieldCol(vec2 b) { return s0(b.${axis}); }\n`;
  const BV = `#include <common>
#include <logdepthbuf_pars_vertex>
attribute vec3 rp; attribute vec3 rn;
varying vec3 vRp; varying vec3 vRn;
void main() {
  vRp = rp; vRn = rn;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  #include <logdepthbuf_vertex>
}`;
  const BF = field => `uniform mat4 hvp; uniform vec3 hcam; uniform float t, flow, spd, op, bT, bper, bph, mul; uniform vec2 bsl, hid;
varying vec3 vRp; varying vec3 vRn;
#include <logdepthbuf_pars_fragment>
${field}
void main() {
  vec4 hq = hvp * vec4(vRp, 1.0);
  vec2 bp = vec2((hq.x / hq.w * 0.5 + 0.5) * 1920.0, (0.5 - 0.5 * hq.y / hq.w) * 1080.0);
  bp += bsl * min(flow, 1.6) * (sin((t - bT) * spd / bper * 6.2832 + bph) - sin(bph));
  vec3 nb = normalize(vRn);
  float vis = smoothstep(0.0, 0.25, dot(nb, normalize(hcam - vRp)));
  gl_FragColor = vec4(fieldCol(bp) * mul * mix(hid.x + hid.y * nb.y, 1.0, vis), op);
  #include <logdepthbuf_fragment>
}`;
  const base = V.mat(['#7b2bf9'], { flat: true });                         // registered with the engine: t and flow update
  G.live = { t: base.uniforms.t, flow: base.uniforms.flow, spd: base.uniforms.spd };               // (lent to between.js: its shapes flow on the same clock, with no new engine material)
  let nM = 0;
  const bmat = (field, o = {}) => {
    const k = nM++;
    const u = { t: base.uniforms.t, flow: base.uniforms.flow, spd: base.uniforms.spd, hvp: { value: HVP }, hcam: { value: cam.clone() }, op: { value: 1 }, bT: { value: TK },
      bper: { value: 6.4 + (k * 0.77) % 3.1 }, bph: { value: (k * 2.39) % 6.28 }, bsl: { value: new THREE.Vector2(...(o.sl || [0, 22])) },
      hid: { value: new THREE.Vector2(...(o.hid || [0.66, 0.14])) }, mul: { value: o.mul ?? 1 } };
    return new THREE.ShaderMaterial({ uniforms: u, vertexShader: BV, fragmentShader: BF(field), side: o.side ?? THREE.FrontSide });
  };
  const setOp = (mats, a) => { for (const m of mats) { m.uniforms.op.value = a; const tr = a < 0.999; if (m.transparent !== tr) { m.transparent = tr; m.depthWrite = !tr; m.needsUpdate = true; } } };
  // rest attributes (the geometry is built in world coordinates at rest; groups move it)
  const rest = g => { g.computeVertexNormals(); g.setAttribute('rp', g.attributes.position.clone()); g.setAttribute('rn', g.attributes.normal.clone()); return g; };

  /* ---------- board 23's colours (measured, board px) ---------- */
  const F = {
    floorTop: along('x', [[0, '#fb4432'], [150, '#f64e2e'], [350, '#f05e27'], [600, '#ed6823'], [800, '#eb6f21'], [1028, '#e97220']]),
    floorFront: stops('sT', [[0, '#4f08b0'], [150, '#48059b'], [300, '#410690'], [500, '#3b0885'], [700, '#350982'], [900, '#320879'], [1028, '#2c0971']]) +
      stops('sB', [[0, '#5c04c5'], [150, '#5306b8'], [300, '#4f07ac'], [500, '#4807a1'], [700, '#400897'], [900, '#3a0883'], [1028, '#330977']]) +
      'vec3 fieldCol(vec2 b) { return mix(sT(b.x), sB(b.x), clamp((b.y - 960.0) / 100.0, 0.0, 1.0)); }\n',
    ring: along('y', [[10, '#d20cfc'], [60, '#b90ee8'], [140, '#9a12dc'], [200, '#8214cf'], [300, '#6215b9'], [400, '#4a15a5'], [500, '#37138d'], [600, '#2b1476'], [717, '#260f67']]),
    inner: along('y', [[140, '#29085c'], [350, '#2e0a6e'], [480, '#280c64'], [620, '#220f5f']]),
    A: along('y', [[0, '#4404b6'], [100, '#4105a4'], [200, '#3a068d'], [300, '#300771'], [408, '#230a58']]),
    domeT: along('x', [[1115, '#d6449f'], [1150, '#ca3fab'], [1200, '#ae30c2'], [1250, '#9725d5'], [1300, '#831de3'], [1350, '#7315ef'], [1383, '#6b12f4']]),
    domeB: along('x', [[1115, '#fdd068'], [1150, '#fdca64'], [1200, '#ffbd62'], [1250, '#ffb359'], [1300, '#ffa94f'], [1350, '#ff9d43'], [1383, '#ff963e']]),
    B: along('y', [[0, '#fb6c22'], [204, '#f75b32'], [408, '#ec4a4a']]),
    dTL: along('x', [[1472, '#ff9a3f'], [1550, '#ffab52'], [1620, '#ffbe64'], [1694, '#fecf7d']]),
    dTR: along('x', [[1694, '#ff8a86'], [1750, '#ff8583'], [1820, '#fb757d'], [1920, '#ea4a62']]),
    dBL: along('x', [[1472, '#ff8685'], [1550, '#fd8284'], [1620, '#f86c79'], [1694, '#eb4f61']]),
    dBR: along('x', [[1694, '#ffa04c'], [1750, '#ffa550'], [1820, '#ffb65d'], [1920, '#ffcc72']]),
    C: along('y', [[408, '#7115f5'], [700, '#8116e0'], [780, '#8c1fdd'], [840, '#9627d2'], [900, '#a62bc5'], [960, '#b733b8'], [1020, '#c63bae'], [1075, '#dc40a5']]),
    cup: along('y', [[408, '#7014f1'], [450, '#7415ed'], [500, '#7d1ae6'], [600, '#9a26d1'], [700, '#bd36b7'], [780, '#dc449f'], [850, '#e84a98']]),
    stripe: along('y', [[440, '#7214ec'], [500, '#7516e3'], [600, '#6a13c2'], [700, '#962f8b'], [780, '#c05059'], [840, '#dd6a38'], [860, '#ef7227'], [900, '#f3893c'], [960, '#f3a66f'], [1020, '#f2c09c'], [1075, '#f4c098']]),
    D: along('x', [[1472, '#34067a'], [1650, '#36067c'], [1750, '#3e0598'], [1850, '#4604ac'], [1920, '#4e03b8']]),
    half: along('y', [[412, '#e0469a'], [500, '#ca3bad'], [600, '#b634bc'], [700, '#a42bc8'], [780, '#9725d3'], [860, '#8a20dc'], [960, '#7c19e6'], [1050, '#7415ed'], [1148, '#6c12f2']]),
    // navy with the violet lift at the lower left
    back: `vec3 fieldCol(vec2 b) { float r = length((b - vec2(0.0, 820.0)) * vec2(1.0, 1.25)) / 560.0;
  return mix(${hexC('#250958')}, ${hexC('#4a0890')}, pow(clamp(1.0 - r, 0.0, 1.0), 1.2)); }\n`,
  };

  /* ---------- shapes in board px (y up: (px, -py)) and slabs laid on the hold view ---------- */
  const rectS = (x0, y0, x1, y1) => { const s = new THREE.Shape(); s.moveTo(x0, -y0); s.lineTo(x0, -y1); s.lineTo(x1, -y1); s.lineTo(x1, -y0); s.lineTo(x0, -y0); return s; };
  const rrPath = (P, x0, y0, x1, y1, r) => { const X0 = x0, X1 = x1, Ya = -y1, Yb = -y0;
    P.moveTo(X0 + r, Ya); P.lineTo(X1 - r, Ya); P.absarc(X1 - r, Ya + r, r, -Math.PI / 2, 0, false);
    P.lineTo(X1, Yb - r); P.absarc(X1 - r, Yb - r, r, 0, Math.PI / 2, false);
    P.lineTo(X0 + r, Yb); P.absarc(X0 + r, Yb - r, r, Math.PI / 2, Math.PI, false);
    P.lineTo(X0, Ya + r); P.absarc(X0 + r, Ya + r, r, Math.PI, 1.5 * Math.PI, false); return P; };
  const domeS = (cx, cy, r) => { const s = new THREE.Shape(); s.moveTo(cx + r, -cy); s.absarc(cx, -cy, r, 0, Math.PI, false); s.lineTo(cx + r, -cy); return s; };
  const qdiscS = (cx, cy, r, a0) => { const s = new THREE.Shape(); s.moveTo(cx, -cy); s.lineTo(cx + r * Math.cos(a0), -cy + r * Math.sin(a0));
    s.absarc(cx, -cy, r, a0, a0 + Math.PI / 2, false); s.lineTo(cx, -cy); return s; };
  // extrude a px shape, then lay its front cap and back cap on the hold view: front(px, py) / back(px, py) → world. Both
  // caps sit on the same view rays, so the sides are edge-on from the hold camera (flat at the hold, chunky in motion)
  const slabGeo = (shape, front, back) => {
    const g = new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false, curveSegments: 40 });
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const px = p.getX(i), py = -p.getY(i), w = p.getZ(i) > 0.5 ? front(px, py) : back(px, py); p.setXYZ(i, w.x, w.y, w.z); }
    g.deleteAttribute('normal'); g.deleteAttribute('uv'); return rest(g);
  };
  const atDepthSlab = (shape, d, thick) => slabGeo(shape, (px, py) => atD(px, py, d), (px, py) => atD(px, py, d + thick));
  const mk = (geo, m, parent) => { const me = new THREE.Mesh(geo, m); me.frustumCulled = false; (parent || scene).add(me); return me; };
  const group = () => { const g = new THREE.Group(); g.matrixAutoUpdate = false; g.visible = false; scene.add(g); return g; };
  const mat4 = new THREE.Matrix4(), mq = new THREE.Matrix4(), q = new THREE.Quaternion();
  // M = T(c + off) · R(axis, ang) · T(-c)
  const pivotM = (M, c, off, axis, ang) => { if (Math.abs(ang) < 1e-9) return M.makeTranslation(off.x, off.y, off.z);   // (pure moves: neighbours stay bit-identical, no seams)
    q.setFromAxisAngle(axis, ang); M.makeTranslation(-c.x, -c.y, -c.z);
    M.premultiply(mq.makeRotationFromQuaternion(q)); M.premultiply(mat4.makeTranslation(c.x + off.x, c.y + off.y, c.z + off.z)); return M; };
  const u01 = (t, a, b) => cl((t - a) / (b - a));
  const drift = (t, k, amp = 0.03) => rgt.clone().multiplyScalar(amp * (Math.sin((t - TK) * 0.83 + k) - Math.sin(k))).addScaledVector(upv, amp * (Math.cos((t - TK) * 0.61 + 1.7 * k) - Math.cos(1.7 * k)));

  /* ---------- the backdrop: board 23's navy and violet lift, far behind, only around the hold ---------- */
  {
    const d = 45, P = [[-1100, -620], [3020, -620], [3020, 1700], [-1100, 1700]].map(([x, y]) => atD(x, y, d));
    const g = new THREE.BufferGeometry().setFromPoints([P[0], P[3], P[1], P[1], P[3], P[2]]);
    const m = bmat(F.back, { sl: [0, 0] }), me = mk(rest(g), m);
    anim(t => { const a = ACTIVE(t) ? sm(u01(t, 104.0, 104.8)) * (1 - sm(u01(t, 107.5, 108.3))) : 0; me.visible = a > 0.002; setOp([m], a); });
  }

  /* ---------- the floor ---------- */
  const zF = onY(960, 952, Y0).z, zB = onY(960, 750, Y0).z;                // front / back edges at board py 952 / 750
  const FX0 = 14.5 + V.O.x, FX1 = 48.1 + V.O.x, cuts = [FX0, 35 + V.O.x, 38.5 + V.O.x, 42 + V.O.x, 45.5 + V.O.x, FX1];
  const mTop = bmat(F.floorTop, { sl: [30, 0] }), mFront = bmat(F.floorFront, { sl: [24, 0], hid: [0.62, 0.1] });
  // when the sphere has rolled past a section's right end, that section drops away (the last one just after the kick)
  const passT = x => { for (let t = 109.3; t < 111.4; t += 0.01) { const p = bAt(t); if (p.x > x) return t; } return 111; };
  const tLip = passT(kicker.xL);                                           // the sphere leaves the kicker's lip
  const noTop = new THREE.MeshBasicMaterial({ visible: false });
  const floorSegs = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    const x0 = cuts[i], x1 = cuts[i + 1], H = 3;
    const geo = new THREE.BoxGeometry(x1 - x0, H, zF - zB); geo.translate((x0 + x1) / 2, Y0 - H / 2, (zF + zB) / 2);
    { const p = geo.attributes.position; for (let j = 0; j < p.count; j++) {          // shared edges bit-identical: no seams
      p.setX(j, p.getX(j) < (x0 + x1) / 2 ? x0 : x1); p.setY(j, p.getY(j) > Y0 - H / 2 ? Y0 : Y0 - H); p.setZ(j, p.getZ(j) > (zF + zB) / 2 ? zF : zB);
      // an end face at an inner cut sits hidden under its neighbour's top: tuck its top edge just below (no z-fight on the seam)
      const nx = geo.attributes.normal.getX(j), xe = p.getX(j);
      if (Math.abs(nx) > 0.5 && ((nx < 0 && xe > FX0 + 1e-6) || (nx > 0 && xe < FX1 - 1e-6)) && p.getY(j) === Y0) p.setY(j, Y0 - 0.04); } }
    const gg = group(), me = mk(rest(geo), [mFront, mFront, mTop, mFront, mFront, mFront], gg);
    const last = i === cuts.length - 2, t0 = last ? tLip + 0.08 : Math.min(110.8, passT(x1 + 1.2)), dur = last ? 0.3 : 0.42;
    floorSegs.push({ gg, me, c: new Vec((x0 + x1) / 2, Y0 - H / 2, (zF + zB) / 2), t0, dur, tilt: (i % 2 ? 1 : -1) * 0.12 });
  }
  // the kicker on the last section's end (G.kicker, g5.js): a curved ramp whose surface is 1 below the sphere's arc, so it
  // rolls up it and leaps (the leap meets the arch's channel tangentially); it drops away with its section
  {
    const { c: kc, r: kr, al, z: kz } = kicker, rs = kr + 1, sh = new THREE.Shape(), n = 16;
    for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + al * i / n, x = kc.x + rs * Math.cos(a), y = kc.y + rs * Math.sin(a); i ? sh.lineTo(x, y) : sh.moveTo(x, y); }
    const xl = kc.x + rs * Math.sin(al); sh.lineTo(xl, Y0 - 0.02); sh.lineTo(kc.x, Y0 - 0.02);
    const z0 = kz - 0.85, z1 = Math.min(zF, kz + 0.85);
    const g = new THREE.ExtrudeGeometry(sh, { depth: z1 - z0, bevelEnabled: false, curveSegments: 1 }); g.translate(0, 0, z0);
    mk(rest(g), [bmat(F.floorFront, { sl: [24, 0], hid: [0.62, 0.1] }), bmat(F.floorTop, { sl: [30, 0] })], floorSegs.at(-1).gg);
  }
  // one seamless top over all the sections until the first one drops (review fix: a dashed crack showed at a section cut)
  const skinG = group(), tFirst = Math.min(...floorSegs.map(s => s.t0));
  { const g = new THREE.BufferGeometry().setFromPoints([new Vec(FX0, Y0, zF), new Vec(FX1, Y0, zF), new Vec(FX1, Y0, zB), new Vec(FX0, Y0, zF), new Vec(FX1, Y0, zB), new Vec(FX0, Y0, zB)]);
    mk(rest(g), mTop, skinG); }
  const eIn = E('expo.out'), eDrop = E('power2.in');
  anim(t => {
    // (review fix: slides in earlier, so the right half of the 22 → 23 truck isn't empty navy)
    const sl = 16 * (1 - eIn(u01(t, 102.55, 103.75))), skin = ACTIVE(t) && t > 102.55 && t < tFirst;
    skinG.visible = skin; if (skin) { pivotM(skinG.matrix, new Vec(), new Vec(sl, 0, 0), new Vec(0, 0, 1), 0); skinG.matrixWorldNeedsUpdate = true; }
    for (const s of floorSegs) {
      const w = eDrop(u01(t, s.t0, s.t0 + s.dur));
      s.gg.visible = ACTIVE(t) && t > 102.55 && w < 0.999;
      if (!s.gg.visible) continue;
      s.me.material[2] = skin ? noTop : mTop;
      pivotM(s.gg.matrix, s.c, new Vec(sl, -7 * w, 0.6 * w), new Vec(0, 0, 1), s.tilt * w); s.gg.matrixWorldNeedsUpdate = true;
    }
  });

  /* ---------- the sphere's hard, offset shadow (board 23's ellipse, laid on the floor, riding with the sphere) ---------- */
  {
    const NR = 8, NT = 72, pos = [], col = [], idx = [], c0 = new Vec(m23.x, Y0, m23.z);
    for (let j = 0; j <= NR; j++) for (let i = 0; i <= NT; i++) {
      const r = j / NR, th = i / NT * 2 * Math.PI, px = 417.5 + 142.5 * r * Math.cos(th), py = 871 + 38 * r * Math.sin(th);
      const w = onY(px, py, Y0).sub(c0); pos.push(w.x, 0, w.z); col.push(0.012, 0.01, 0.035, Math.min(1, Math.max(0.06, (px - 265) / 285)));
    }
    for (let j = 0; j < NR; j++) for (let i = 0; i < NT; i++) { const a = j * (NT + 1) + i; idx.push(a, a + 1, a + NT + 1, a + 1, a + NT + 2, a + NT + 1); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 4)); g.setIndex(idx);
    const sh = mk(g, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide, opacity: 0 }));
    sh.renderOrder = 2;
    anim((t, b) => {
      const onF = 1 - sm((b.p.y - m23.y - 0.05) / 0.7), x = b.p.x - V.O.x;
      const a = ACTIVE(t) && t > 104.5 && t < 111.2 && x > 14.8 && x < 48.6 ? onF : 0;
      sh.visible = a > 0.01; sh.material.opacity = a; sh.position.set(b.p.x, Y0 + 0.02, b.p.z);
    });
  }

  /* ---------- the loop: board 23's ring, a real track the sphere rides (review fix) ----------
     The sphere's loop (g5.js) lies in the plane z = zL and runs along the centre-line of the ring's band as the hold camera
     sees it (sides lx / rx, top yTop, corner radius rc). The ring's face sits 1.06 behind it (zR), and two rails stand 0.3
     proud of the face along the band's edges (±rw from the centre-line: the band's own outer and hole outlines), so the
     sphere rolls between them all the way up, over and down, touching them. Seen from the hold camera the rails lie on the
     band's edges in the band's colours (flat at the key); in the moves they read as the track's lips. A soft contact shadow
     rides on the face behind the sphere while it is on the ring. */
  const zR = zL - 1.06, ringT = 0.9;                                       // front face z; depth along the view rays
  const ringG = group(), ringMats = [];
  {
    const slabZ = (shape, z, thick) => slabGeo(shape, (px, py) => onZ(px, py, z), (px, py) => { const f = onZ(px, py, z); return f.addScaledVector(f.clone().sub(cam).normalize(), thick); });
    const outer = rrPath(new THREE.Shape(), 831, 1, 1369, 717, 189);
    outer.holes.push(rrPath(new THREE.Path(), 960, 137, 1240, 617, 60));
    const mr = bmat(F.ring, { sl: [0, 26] }), mi = bmat(F.inner, { sl: [0, 16] });
    mk(slabZ(outer, zR, ringT), mr, ringG);
    mk(slabZ(rrPath(new THREE.Shape(), 954, 131, 1246, 623, 64), zR - 0.4, 0.05), mi, ringG);   // the dark panel, recessed in the hole
    ringMats.push(mr, mi);
    // the rails: the centre-line from the right side's foot, up, over the top and down to the left side's foot, offset ±rw in
    // its plane; each ends where its band edge turns into the ring's bottom (board px 528 outer / 557 hole)
    const cLine = (() => { const P = [], A = (cx, cy, a0, a1) => { for (let i = 0; i <= 24; i++) { const a = a0 + (a1 - a0) * i / 24; P.push([cx + rc * Math.cos(a), cy + rc * Math.sin(a), Math.cos(a), Math.sin(a)]); } };
      const y0 = m23.y + 0.5;
      for (let i = 0; i <= 12; i++) P.push([rx, y0 + (yTop - rc - y0) * i / 12, 1, 0]);
      A(rx - rc, yTop - rc, 0, Math.PI / 2);
      for (let i = 1; i < 8; i++) P.push([rx - rc + (lx - rx + 2 * rc) * i / 8, yTop, 0, 1]);
      A(lx + rc, yTop - rc, Math.PI / 2, Math.PI);
      for (let i = 0; i <= 12; i++) P.push([lx, yTop - rc + (y0 - yTop + rc) * i / 12, -1, 0]);
      return P; })();
    const mRail = bmat(F.ring, { sl: [0, 26], mul: 1.16, hid: [0.62, 0.16] });  // (a touch brighter than the band: the track's lit lips)
    const WR = 0.1, HR = 0.26;                                             // (the sphere, 1.06 in front of the face, just touches their inner edges)
    for (const sgn of [1, -1]) {                                           // +1: along the outer edge; -1: along the hole's edge
      const yEnd = Math.max(onZ(1369, sgn > 0 ? 528 : 557, zR).y, onZ(831, sgn > 0 ? 528 : 557, zR).y);
      const pts = cLine.map(([x, y, nx, ny]) => [x + sgn * rw * nx, y + sgn * rw * ny, nx, ny]).filter(([, y]) => y >= yEnd - 1e-6);
      const pos = [], idx = [];
      const ring4 = ([x, y, nx, ny]) => [[x - nx * WR / 2, y - ny * WR / 2, zR - 0.02], [x + nx * WR / 2, y + ny * WR / 2, zR - 0.02], [x + nx * WR / 2, y + ny * WR / 2, zR + HR], [x - nx * WR / 2, y - ny * WR / 2, zR + HR]];
      pts.forEach(q => ring4(q).forEach(v => pos.push(...v)));
      for (let i = 0; i < pts.length - 1; i++) for (let k = 0; k < 4; k++) { const a = 4 * i + k, b = 4 * i + (k + 1) % 4; idx.push(a, b + 4, b, a, a + 4, b + 4); }   // (outward faces)
      for (const [i0, st] of [[0, true], [pts.length - 1, false]]) { const b = 4 * i0; st ? idx.push(b, b + 1, b + 2, b, b + 2, b + 3) : idx.push(b, b + 2, b + 1, b, b + 3, b + 2); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
      mk(rest(g.toNonIndexed()), mRail, ringG);
    }
    ringMats.push(mRail);
  }
  // the contact shadow on the ring's face behind the sphere, while it rides the ring
  const rsh = (() => { const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { op: { value: 0 } },
      vertexShader: '#include <common>\n#include <logdepthbuf_pars_vertex>\nvarying vec2 vP;\nvoid main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}',
      fragmentShader: 'uniform float op; varying vec2 vP;\n#include <logdepthbuf_pars_fragment>\nvoid main() { float r = length(vP) / 0.72; gl_FragColor = vec4(0.05, 0.01, 0.12, op * 0.5 * (1.0 - smoothstep(0.3, 1.0, r)));\n#include <logdepthbuf_fragment>\n}' });
    const me = new THREE.Mesh(new THREE.CircleGeometry(0.72, 40), m); me.renderOrder = 3; me.frustumCulled = false; scene.add(me); return me; })();
  const ringC = onZ(1100, 359, zR);
  const eUp = E('power2.in');
  anim((t, b) => {
    // in: flies forward out of the depth; out (review fix: it no longer fades to a see-through ghost): once the sphere is out
    // of it, it rises up and back out of the frame, whole, and is hidden only once it is gone
    // in (review fix: it arrives during the 22 → 23 truck, gliding down, right and forward across the empty upper right into
    // its place, instead of flying straight out of the depth off screen)
    const u = E('power3.out')(u01(t, 103.0, 104.5)), w = eUp(u01(t, 109.55, 110.25));
    const a = ACTIVE(t) && t < 110.25 ? sm(u01(t, 103.0, 103.3)) : 0;
    ringG.visible = a > 0.002;
    const onRing = ringG.visible && t > 107.2 && t < 109.6 && b.p.y > m23.y + 0.35 && b.p.x > lx - 1 && b.p.x < rx + 1;
    rsh.visible = onRing; if (onRing) { rsh.position.set(b.p.x, b.p.y, zR + 0.015); rsh.material.uniforms.op.value = sm((b.p.y - m23.y - 0.35) / 0.8); }
    if (!ringG.visible) return;
    const off = new Vec(-7.5 * (1 - u), 6 * (1 - u) + 9 * w, -7 * (1 - u) - 6 * w).add(drift(t, 0.4));
    pivotM(ringG.matrix, ringC, off, fwd, 0); ringG.matrixWorldNeedsUpdate = true; setOp(ringMats, a);
  });

  /* ---------- the tile wall: four chunky tiles, their shapes in relief ---------- */
  const DW = 19.9, TW = 0.45;                                              // tiles' front face depth (hold view) and thickness
  const tiles = [];
  const tile = (name, rect, inn, out, parts) => {
    const gg = group(), mats = [];
    const m = bmat(F[name], { sl: name === 'D' ? [26, 0] : [0, 24] }); mats.push(m);
    mk(atDepthSlab(rectS(...rect), DW, TW), m, gg);
    const pops = parts.map(p => {
      const pm = bmat(F[p.f], { sl: p.sl || [0, 20] }); mats.push(pm);
      const me = mk(atDepthSlab(p.shape, p.d, 0.28), pm, gg); me.matrixAutoUpdate = false;
      return { me, a: atD(p.anchor[0], p.anchor[1], p.d), t: p.t, axis: p.axis };
    });
    const c = atD((rect[0] + Math.min(rect[2], 1920)) / 2, (Math.max(rect[1], 0) + Math.min(rect[3], 1080)) / 2, DW);
    tiles.push({ gg, mats, pops, c, inn, out, k: tiles.length * 1.3 });
  };
  const upA = (x, y) => new Vec(x, y, 0);
  // A: dark indigo, the magenta → violet dome over the peach → orange dome
  tile('A', [1028, -220, 1472, 408], { t: [103.60, 104.50], off: upA(0, 7), ang: -0.16 }, { t: [107.12, 107.72], off: new Vec(-0.5, 8.5, 0.8), ang: -0.2 }, [
    { f: 'domeT', shape: domeS(1249, 207, 134), d: 19.7, anchor: [1249, 207], t: [104.22, 104.80], sl: [22, 0] },
    { f: 'domeB', shape: domeS(1249, 340, 134), d: 19.74, anchor: [1249, 340], t: [104.30, 104.88], sl: [22, 0] }]);
  // B: the star: four quarter discs in the corners; the red-orange tile between them is the star
  tile('B', [1472, -220, 2240, 408], { t: [103.75, 104.65], off: upA(0, 7), ang: 0.14 }, { t: [107.2, 107.82], off: new Vec(3, 8.5, 0.5), ang: 0.26 }, [
    { f: 'dTL', shape: qdiscS(1472, 0, 221, -Math.PI / 2), d: 19.64, anchor: [1472, 0], t: [104.30, 104.90], sl: [18, 0] },
    { f: 'dTR', shape: qdiscS(1920, 0, 224, Math.PI), d: 19.68, anchor: [1920, 0], t: [104.36, 104.96], sl: [18, 0] },
    { f: 'dBL', shape: qdiscS(1472, 408, 215, 0), d: 19.72, anchor: [1472, 408], t: [104.42, 105.02], sl: [18, 0] },
    { f: 'dBR', shape: qdiscS(1920, 408, 219, Math.PI / 2), d: 19.76, anchor: [1920, 408], t: [104.48, 105.08], sl: [18, 0] }]);
  // C: violet → magenta, the full-width ∪ and its four stripes (violet at the top, peach at the bottom)
  const cupS = (() => { const s = new THREE.Shape(); s.moveTo(1028, -408); s.lineTo(1472, -408); s.lineTo(1472, -628); s.absarc(1250, -628, 222, 0, -Math.PI, true); s.lineTo(1028, -408); return s; })();
  tile('C', [1028, 408, 1472, 1380], { t: [103.70, 104.60], off: upA(0, -8), ang: 0.1 }, { t: [107.05, 107.62], off: new Vec(0.3, -9.5, 0.9), ang: 0.14 }, [
    { f: 'cup', shape: cupS, d: 19.75, anchor: [1250, 408], t: [104.28, 104.90] },
    ...[1156.5, 1216, 1276, 1335.5].map((x, i) => ({ f: 'stripe', shape: rectS(x - 12, 440, x + 12, 1380), d: 19.6, anchor: [x, 440], axis: upv, t: [104.45 + 0.05 * i, 105.0 + 0.05 * i], sl: [0, 30] }))]);
  // D: violet, the magenta → violet half-disc bulging right
  const halfS = (() => { const s = new THREE.Shape(); s.moveTo(1472, -412); s.absarc(1472, -780, 368, Math.PI / 2, -Math.PI / 2, true); s.lineTo(1472, -412); return s; })();
  tile('D', [1472, 408, 2240, 1380], { t: [103.85, 104.75], off: upA(0, -8), ang: -0.12 }, { t: [107.26, 107.9], off: new Vec(3.2, -9.5, 0.8), ang: -0.22 }, [
    { f: 'half', shape: halfS, d: 19.72, anchor: [1472, 780], t: [104.38, 105.00] }]);

  const ePop = E('back.out(1.5)'), eOut = E('power1.in');
  const S1 = new THREE.Matrix4();
  anim(t => {
    for (const T of tiles) {
      const u = eIn(u01(t, ...T.inn.t)), w = eOut(u01(t, ...T.out.t));
      T.gg.visible = ACTIVE(t) && t >= T.inn.t[0] && w < 0.999;
      if (!T.gg.visible) continue;
      const off = T.inn.off.clone().multiplyScalar(1 - u).addScaledVector(T.out.off, w).add(drift(t, 1.1));             // one drift for the whole wall: no gaps open between tiles
      pivotM(T.gg.matrix, T.c, off, fwd, T.inn.ang * (1 - u) + T.out.ang * w); T.gg.matrixWorldNeedsUpdate = true;
      setOp(T.mats, sm(u01(t, T.inn.t[0], T.inn.t[0] + 0.12)));
      for (const P of T.pops) {
        const s = Math.max(1e-3, ePop(u01(t, ...P.t)));
        P.me.visible = s > 2e-3;
        if (P.axis) { const n = P.axis, k = s - 1;                                  // stretch along the stripe only
          S1.set(1 + k * n.x * n.x, k * n.x * n.y, k * n.x * n.z, 0, k * n.y * n.x, 1 + k * n.y * n.y, k * n.y * n.z, 0, k * n.z * n.x, k * n.z * n.y, 1 + k * n.z * n.z, 0, 0, 0, 0, 1);
          P.me.matrix.makeTranslation(-P.a.x, -P.a.y, -P.a.z).premultiply(S1).premultiply(mat4.makeTranslation(P.a.x, P.a.y, P.a.z));
        } else P.me.matrix.makeTranslation(-P.a.x, -P.a.y, -P.a.z).premultiply(mq.makeScale(s, s, s)).premultiply(mat4.makeTranslation(P.a.x, P.a.y, P.a.z));
        P.me.matrixWorldNeedsUpdate = true;
      }
    }
  });

  V.unplate(23);
};
