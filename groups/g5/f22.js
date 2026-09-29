/* Frame 22 · the striped chute and the TV screen (G5, called from g5.js with its context G). Built: the real set, no plate.
   The journey (g5.js, unchanged): the sphere rolls off the end of frame 21's row (G.gap), drops down the chute (G.chute) and
   falls into board 22 from the top as the camera cranes down the wall; frontal hold 99.75–101.25 (key 100.0, 30° lens). It
   goes on down the chute behind the TV screen to G.cBot, round a corner (radius 1.5, centre G.cC) onto the band under the
   screen, right along the band to G.bandEnd and hops down onto frame 23's orange floor (G.land).
   · The track is ONE real object from just below the gap to past the band's end: a channel swept along the sphere's own
     path. Chute: a flat back (the stripes) and two side walls, open toward the camera; round the corner the outer wall
     becomes the floor the sphere rolls on and the inner wall ends, so the band is a back strip (the board's violet band and
     coral pill) with a ledge at its foot. Where the hold camera sees it, every wall runs along that camera's view rays (flat
     at the hold, the depth opens up as the camera moves); up above the frame it bends toward the camera to the gap in
     frame 21's row. Colour: every surface takes the board colour of where it sits in the hold view (the 7 stripes and their
     orange → mauve fall, the coral → violet band); above the frame the stripes turn to alternating orange / violet-pink.
     Living: the colours slide slowly, locked to the board at the key instant. The track is drawn from the gap down, ahead
     of the sphere, as the camera follows it to the row's end, and sinks away once the sphere has hopped off.
   · The TV screen: a slab exactly under the copy's picture (copy/c22.js: 548, 238, 1004 × 578, r 98, 1.5 units nearer than
     the sphere), 0.38 deep, so the sphere passes behind it; the picture always draws over it. Its face is the frame's
     gradient round a dark panel (it shows once the picture has faded: the screen goes dark); it grows in as the camera
     cranes down and scales up exactly with the copy's picture (0.85 → 1, back.out) from its build, and powers off
     (shrinks away) as the camera trucks right.
   · Board shapes as pieces (flat at the hold, chunky while moving, colours fitted to the board): the four quarter-discs
     (bottom left), the soft stadium ring with the dark pill behind the super (top left; its right end runs on up above the
     frame as the magenta panel beside the chute), the big magenta ring (right) and the translucent orange → gold D band in
     front of it, and a backdrop with the board's glows (maroon top left, violet top right, violet wash low left). */
export default (V, G) => {
  const { THREE, anim, scene } = V;
  const { h22: H, m22, vec, cl, sm, PC, SH, chute, cBot, cC, band, bandEnd, ACTIVE } = G;
  const TK = H.tk, cam = H.pos, fwd = H.fwd, rgt = H.right, upv = H.upv, tanV = H.tanV;
  const ez = n => gsap.parseEase(n);
  const dOf = P => P.clone().sub(cam).dot(fwd);
  const pxOf = P => { const d = P.clone().sub(cam), z = d.dot(fwd); return [960 + d.dot(rgt) / z / tanV * 540, 540 - d.dot(upv) / z / tanV * 540]; };

  /* ---------- the hold camera's projection (for the board-coloured materials) ---------- */
  const hc = new THREE.PerspectiveCamera(H.fov, 16 / 9, 0.05, 2000);
  hc.matrixAutoUpdate = false; hc.matrixWorld.makeBasis(rgt, upv, fwd.clone().negate()).setPosition(cam);
  hc.matrixWorldInverse.copy(hc.matrixWorld).invert(); hc.updateProjectionMatrix();
  const HVP = new THREE.Matrix4().multiplyMatrices(hc.projectionMatrix, hc.matrixWorldInverse);

  /* ---------- GLSL helpers ---------- */
  const hexC = h => { const n = parseInt(h.slice(1), 16); return `vec3(${((n >> 16 & 255) / 255).toFixed(4)}, ${((n >> 8 & 255) / 255).toFixed(4)}, ${((n & 255) / 255).toFixed(4)})`; };
  const stopsFn = (name, st) => `vec3 ${name}(float v) { vec3 c = ${hexC(st[0][1])};\n` +
    st.slice(1).map(([v, h], i) => `  c = mix(c, ${hexC(h)}, clamp((v - ${st[i][0].toFixed(1)}) / ${(v - st[i][0]).toFixed(1)}, 0.0, 1.0));`).join('\n') + '\n  return c; }\n';
  const f1 = x => (Math.abs(x) < 1e-9 ? 0 : x).toFixed(4);
  // a smooth field fitted to board 22 (least squares, copy / sphere / other shapes masked): terms u^i·v^j over its box
  const glslFit = (name, F) => { const [x0, y0, x1, y1] = F.box, terms = [];
    for (let k = 0; k < F.T.length / 2; k++) { const i = +F.T[2 * k], j = +F.T[2 * k + 1], c = F.c[k];
      const m = [...Array(i).fill('u'), ...Array(j).fill('v')].join(' * ');
      terms.push(`vec3(${c.map(f1).join(', ')})${m ? ' * ' + m : ''}`); }
    return `vec3 ${name}(vec2 b) { vec2 q = clamp((b - vec2(${f1(x0)}, ${f1(y0)})) / vec2(${f1(x1 - x0)}, ${f1(y1 - y0)}), 0.0, 1.0); float u = q.x, v = q.y;\n  return clamp((${terms.join(' + ')}) / 255.0, 0.0, 1.0); }\n`; };
  const FIT = {
    qd1: { box: [5, 845, 230, 1080], T: '000102101120', c: [[115.92, 16.62, 168.64], [-116.2, -63.06, 313.52], [135.25, 109.86, -274.07], [-35.38, -13.68, 182.84], [109.46, 48.12, -257.81], [59.13, 32.11, -149.55]] },
    qd2: { box: [228, 845, 453, 1080], T: '000102101120', c: [[221.26, 69.28, 157.5], [-86.09, -39.69, 64.02], [12.6, 6.42, -7.09], [0.97, 0.4, -1.37], [2.05, -1.41, -6.3], [-3.41, 0.56, 7.1]] },
    qd3: { box: [455, 845, 680, 1080], T: '000102101120', c: [[106.54, 17.8, 147.18], [-102.6, -65.34, 320.42], [126.27, 106.51, -250.72], [-57.66, -15.89, 158.73], [132.17, 49.4, -211.8], [60.34, 33.22, -155.38]] },
    qd4: { box: [680, 845, 905, 1080], T: '000102101120', c: [[208.96, 65.05, 153.67], [-19.62, -16.06, 74.28], [-54.87, -17.66, -20.56], [-15.43, -6.42, 1.63], [62.2, 19.12, 21.35], [-39.1, -9.45, -22.93]] },
    tlring: { box: [150, 15, 862, 400], T: '000102101120', c: [[68.24, 22.1, 49.38], [-27.56, -7.85, 17.57], [12.48, 3.81, 7.35], [-100.87, 11.46, 205.86], [13.38, 11.38, -41.38], [200.08, -16.96, -19.67]] },
    pill: { box: [260, 127, 830, 263], T: '000110', c: [[28.24, 12.6, 75.41], [-1.25, 2.66, 0.17], [14.45, -1.91, 30.06]] },
    bg: { box: [0, 0, 1920, 1080], T: '000102030410111213202122303140', c: [[88.01, 34.2, 25.49], [-80.36, -98.77, 410.64], [-704.98, 267.67, -1747.33], [1606.13, -305.82, 2906.38], [-727.5, 91.89, -1259.85], [-28.31, -38.62, 573.61], [579.54, 222.08, -642.46], [-508.4, -357.72, 341.69], [-322.19, 221.28, -730.22], [-318.38, -62.25, -1356.17], [-579.5, -86.29, 348.18], [701.04, 79.23, 583.2], [595.95, 121.79, 1420.93], [-43.26, -21.0, -345.62], [-219.28, -49.86, -433.79]] },
  };

  /* ---------- board-coloured material (as f06's): the engine's gradient shader, coloured by where a surface sits in the
     hold view (board px), with a living slide locked to zero at the key instant. Faces the hold camera sees keep the board
     colour; faces turned away from it are shaded so the form reads in motion. `rev` (with the sArc attribute) reveals a
     swept mesh along its length. ---------- */
  const BPER = 7.3, BPH = (Math.PI - 2 * Math.PI * TK / BPER) / 2;
  const boardMat = (glsl, o = {}) => {
    const base = V.mat(['#7b2bf9'], { flat: true, side: THREE.DoubleSide });
    const u = { ...base.uniforms, hvp: { value: HVP }, hcam: { value: cam.clone() }, bper: { value: BPER }, bph: { value: BPH }, bamp: { value: o.amp ?? 24 },
      hid: { value: new THREE.Vector2(...(o.hid || [0.78, 0.12])) }, rev: { value: new THREE.Vector2(-1e9, 1e9) },
      uAC: { value: new THREE.Vector3() }, uOff: { value: new THREE.Vector3() }, uS: { value: 1 } };
    const head = 'uniform mat4 hvp; uniform vec3 hcam; uniform float bper, bph, bamp; uniform vec2 hid, rev; uniform vec3 uAC, uOff; uniform float uS; varying float vS;\n' + glsl;
    const inj = `if (vS < rev.x || vS > rev.y) discard;
  vec3 wP = uAC + (vW - uAC - uOff) / max(uS, 1e-3);            // where it sits unmoved (colours ride with the object)
  vec4 hq = hvp * vec4(wP, 1.0);
  vec2 bp = vec2((hq.x / hq.w * 0.5 + 0.5) * 1920.0, (0.5 - 0.5 * hq.y / hq.w) * 1080.0);
  float sl = bamp * min(flow, 1.6) * (sin(t * spd / bper * 6.2832 + bph) - sin(bph));
  vec3 nb = normalize(vN); if (!gl_FrontFacing) nb = -nb;
  float vis = smoothstep(0.0, 0.22, abs(dot(nb, normalize(hcam - vW))));
  gl_FragColor = vec4(boardCol(bp, sl) * mix(hid.x + hid.y * nb.y, 1.0, vis), op);`;
    const fs = base.fragmentShader.replace('#include <logdepthbuf_pars_fragment>', '#include <logdepthbuf_pars_fragment>\n' + head).replace('gl_FragColor = vec4(col * shade, op);', inj);
    const vs = base.vertexShader.replace('void main() {', 'attribute float sArc;\nvarying float vS;\nvoid main() {\n  vS = sArc;');
    if (fs === base.fragmentShader || vs === base.vertexShader) throw new Error('f22: engine shader changed; boardMat could not hook it');
    return new THREE.ShaderMaterial({ uniforms: u, vertexShader: vs, fragmentShader: fs, side: THREE.DoubleSide });
  };
  // a piece (G.PC: flat at the hold, colour-locked) whose colour is a board field fn(bp) (GLSL), sliding sd px (living)
  const hook = (m, head, body) => { const fs = m.fragmentShader.replace('#include <logdepthbuf_pars_fragment>', '#include <logdepthbuf_pars_fragment>\n' + head)
      .replace('gl_FragColor = vec4(col * shade, op);', body);
    if (fs === m.fragmentShader) throw new Error('f22: engine shader changed; the board fields could not hook it');
    m.fragmentShader = fs; m.needsUpdate = true; return m; };
  const FP = (spec, glsl, fn, sd = [10, 8], alpha = '1.0') => {
    const pc = PC({ hold: 22, ...spec }), m = pc.mesh.material;
    m.uniforms.ban = { value: new THREE.Vector2(...spec.at) }; m.uniforms.bsd = { value: new THREE.Vector2(...sd) }; m.uniforms.bT = { value: TK };
    hook(m, 'uniform vec2 ban, bsd; uniform float bT;\n' + glsl,
      `vec2 bp = vec2(ban.x + vO.x, ban.y - vO.y) + bsd * min(flow, 1.6) * (sin((t - bT) * spd / per * 6.2832 + ph) - sin(ph));
  gl_FragColor = vec4(${fn}(bp) * shade, op * ${alpha});`);
    return pc;
  };

  /* ---------- board 22's colours (measured on the board, 1920 px) ---------- */
  const TRI = (a, b, c) => `(v < 0.5 ? mix(${hexC(a)}, ${hexC(b)}, v * 2.0) : mix(${hexC(b)}, ${hexC(c)}, v * 2.0 - 1.0))`;
  const TRACK_GLSL = [
    // the seven stripes (x 862 877 899 915 934 954 974 990): orange / coral stay, the others fall orange → mauve / violet
    // down the board (v: 0 at y 16, 1 at y 232); up above the frame (u: 0 at y 0 → 1 at y −260) they alternate orange / violet-pink
    `vec3 stripeCol(float px, float py) {
  float v = clamp((py - 16.0) / 216.0, 0.0, 1.0), up = 1.0 - smoothstep(-260.0, 0.0, py);
  vec3 c0 = mix(${TRI('#ed7c2f', '#ba5251', '#903b75')}, ${hexC('#f07a28')}, up);
  vec3 c1 = mix(${TRI('#ef7625', '#f07722', '#f07620')}, ${hexC('#c43f8c')}, up);
  vec3 c2 = mix(${TRI('#f3782b', '#b8505a', '#8f3b77')}, ${hexC('#f3782b')}, up);
  vec3 c3 = mix(${TRI('#d65f4a', '#d06251', '#cf5f51')}, ${hexC('#b33a98')}, up);
  vec3 c4 = mix(${TRI('#f27727', '#b34c5f', '#7c2a96')}, ${hexC('#f27727')}, up);
  vec3 c5 = mix(${TRI('#8a29b4', '#8e28b0', '#9226b8')}, ${hexC('#8a29b4')}, up);
  vec3 c6 = mix(${TRI('#ed7b40', '#a34276', '#631bae')}, ${hexC('#f07a34')}, up);
  vec3 c = mix(c0, c1, smoothstep(876.0, 878.0, px));
  c = mix(c, c2, smoothstep(898.0, 900.0, px)); c = mix(c, c3, smoothstep(914.0, 916.0, px));
  c = mix(c, c4, smoothstep(933.0, 935.0, px)); c = mix(c, c5, smoothstep(953.0, 955.0, px));
  return mix(c, c6, smoothstep(973.0, 975.0, px)); }\n`,
    stopsFn('bandX', [[900, '#d0643e'], [1000, '#bc5252'], [1100, '#a03e6d'], [1200, '#7d288c'], [1300, '#5f10a9'], [1370, '#4c05b8'], [1450, '#5207c5'],
      [1560, '#5b0ad3'], [1700, '#640ee1'], [1800, '#6d11ec'], [1900, '#7111f5'], [2300, '#7414f8']]),
    `vec3 boardCol(vec2 b, float sl) {
  vec3 st = stripeCol(b.x, b.y + sl);
  vec3 bd = bandX(b.x + 2.0 * sl) * mix(1.0, 0.9, smoothstep(830.0, 900.0, b.y) * (1.0 - smoothstep(1100.0, 1350.0, b.x)));
  return mix(st, bd, smoothstep(795.0, 812.0, b.y)); }\n`].join('');
  // the screen's face: board 22's frame (the copy's HOLD_FRAME gradient, 548 → 1552) round a dark panel (inset 14 / 15 / 12, r 84)
  const SCREEN_GLSL = [
    stopsFn('frameX', [[548, '#fb7418'], [588, '#f47324'], [638, '#c9524c'], [699, '#9d396f'], [769, '#74209a'], [849, '#6a1b9e'], [1050, '#621aa4'],
      [1211, '#5310b4'], [1311, '#4d05b8'], [1371, '#7c238d'], [1442, '#a44269'], [1522, '#e27030'], [1552, '#e8722a']]),
    `float sdRR(vec2 p, vec2 hs, float r) { vec2 q = abs(p) - hs + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
vec3 boardCol(vec2 b, float sl) {
  float di = sdRR(b - vec2(1050.0, 528.5), vec2(488.0, 275.5), 84.0);
  vec3 dk = mix(${hexC('#1c0a4c')}, ${hexC('#2a0e64')}, clamp((b.y - 253.0) / 551.0, 0.0, 1.0));
  return mix(dk, frameX(b.x + 0.5 * sl), smoothstep(-0.8, 0.8, di)); }\n`].join('');
  // the magenta ring (right): magenta at the top → violet → dark indigo at the bottom, brightest at the top right
  const MRING_GLSL = stopsFn('mringY', [[40, '#ad0be6'], [200, '#9d11e5'], [330, '#8812da'], [555, '#5615af'], [780, '#391583'], [1000, '#280e6b']]) +
    `vec3 mring(vec2 b) { return mix(mringY(b.y), ${hexC('#d20cfc')}, 0.75 * (1.0 - smoothstep(40.0, 260.0, b.y)) * smoothstep(1640.0, 1900.0, b.x)); }\n`;

  /* ---------- the track: chute (from just below the gap) → corner → band (past bandEnd) ---------- */
  const track = (() => {
    const S = [];
    const push = pts => { for (const p of pts) if (!S.length || p.distanceTo(S.at(-1).C) > 1e-4) S.push({ C: p.clone() }); };
    const cv = chute.curve;
    push(Array.from({ length: 91 }, (_, i) => cv.getPointAt(i / 90)));
    const nChute = S.length;
    push(Array.from({ length: 13 }, (_, i) => m22.clone().lerp(cBot, i / 12)));
    const iBot = S.length - 1;
    push(Array.from({ length: 29 }, (_, i) => { const a = Math.PI + 0.5 * Math.PI * i / 28; return vec(cC.x + 1.5 * Math.cos(a), cC.y + 1.5 * Math.sin(a), m22.z); }));
    const iArc = S.length - 1, xEnd = bandEnd.x + 0.35;
    push(Array.from({ length: 49 }, (_, i) => vec(cC.x + (xEnd - cC.x) * i / 48, band, m22.z)));
    let s = 0; S.forEach((q, i) => { if (i) s += q.C.distanceTo(S[i - 1].C); q.s = s; });
    const Zm = vec(0, 0, -1);
    S.forEach((q, i) => {
      const a = S[Math.max(0, i - 1)].C, b = S[Math.min(S.length - 1, i + 1)].C;
      q.T = b.clone().sub(a).normalize();
      q.B = Zm.clone().addScaledVector(q.T, -Zm.dot(q.T)).normalize();
      q.A = new THREE.Vector3().crossVectors(q.B, q.T);                 // "left": chute left wall → the corner's outer wall → the band's floor
    });
    const sBot = S[iBot].s, sArc = S[iArc].s;
    // the view-ray weight: 1 where the hold camera sees it (walls along its view rays), 0 up the bend to the gap (plain walls)
    S.forEach((q, i) => {
      q.f = i >= nChute - 1 ? 1 - sm((pxOf(q.C)[0] - 1900) / 350) : sm((-5.0 - q.C.y) / 2.2);
      q.wl = 1.229 + (1.004 - 1.229) * sm((q.s - (sBot - 1.0)) / (sArc - sBot + 1.0));     // left / outer wall (px 862 → the floor, contact)
      q.wt = 1.186 + (0.864 - 1.186) * sm((q.s - (sBot - 0.5)) / (sArc - sBot + 0.5));     // the back's right / top edge (px 990 → band top 808)
    });
    const sR = sBot - 0.5, sStart = S.find(q => q.C.y < -1.0).s;   // the right wall ends above the corner; the track starts below the row
    const HF = 1.0, HB = 1.1;                                       // walls from 1.0 in front of the path (z −5) to 1.1 behind it (z −7.1)
    const P = (q, a, k, along = 0) => {
      const P0 = q.C.clone().addScaledVector(q.A, a).addScaledVector(q.T, along);
      const w = P0.clone().addScaledVector(q.B, k), v = P0.clone().addScaledVector(P0.clone().sub(cam), k / dOf(P0));
      return w.lerp(v, q.f);
    };
    const pos = [], sa = [], idx = [];
    const strip = (list, ptA, ptB) => {                              // a ribbon between two point functions of a sample
      const b0 = pos.length / 3;
      list.forEach(q => { const p = ptA(q), r = ptB(q); pos.push(p.x, p.y, p.z, r.x, r.y, r.z); sa.push(q.s, q.s); });
      for (let i = 0; i < list.length - 1; i++) { const k = b0 + 2 * i; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
    };
    const L = S.filter(q => q.s >= sStart);
    strip(L, q => P(q, -q.wl, HB), q => P(q, q.wt, HB));                        // the back (the stripes; the band)
    strip(L, q => P(q, -q.wl, -HF), q => P(q, -q.wl, HB));                      // the left / outer wall → the floor
    strip(L.filter(q => q.s <= sR), q => P(q, q.wt, -HF), q => P(q, q.wt, HB)); // the right wall (chute only)
    // the ends: the back rounds off (a half disc) past the band's last sample and above the chute's first
    for (const [q, dir] of [[S.at(-1), 1], [L[0], -1]]) {
      const am = (q.wt - q.wl) / 2, r = (q.wt + q.wl) / 2, c0 = pos.length / 3, c = P(q, am, HB);
      pos.push(c.x, c.y, c.z); sa.push(q.s);
      for (let j = 0; j <= 24; j++) { const th = Math.PI * j / 24, p = P(q, am + r * Math.cos(th), HB, dir * r * Math.sin(th)); pos.push(p.x, p.y, p.z); sa.push(q.s); }
      for (let j = 0; j < 24; j++) idx.push(c0, c0 + 1 + j, c0 + 2 + j);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('sArc', new THREE.Float32BufferAttribute(sa, 1)); g.setIndex(idx);
    g.computeVertexNormals();
    const m = boardMat(TRACK_GLSL, { amp: 22 }), mesh = new THREE.Mesh(g, m); mesh.frustumCulled = false; scene.add(mesh);
    return { mesh, m, S, sStart, sEnd: S.at(-1).s, sBot, sArc };
  })();
  // drawn from the gap down ahead of the sphere (review fix: it starts drawing while its top is still off screen left, so
  // the front's first cross-sections through the curl, which read as jagged tongues, are never seen); sinks away once the
  // sphere has hopped off
  const TR0 = 97.3;
  anim(t => {
    const { mesh, m, sStart, sEnd } = track;
    mesh.visible = ACTIVE(t) && t > TR0 && t < 105.3;
    m.uniforms.rev.value.y = sStart + (sEnd - sStart) * cl((t - TR0) / 1.45);
    mesh.position.y = -14 * ez('power2.in')(cl((t - 104.45) / 0.8)); m.uniforms.uOff.value.copy(mesh.position);
  });

  /* ---------- the TV screen: a slab under the copy's picture, flat at the hold ---------- */
  {
    const DS = H.depth - 1.5, DB = DS + 0.38, AC = H.at(1050, 527, DS);
    const out = SH.rr(1001, 575, 96.5).getPoints(40).map(p => [1050 + p.x, 527 - p.y]).filter((p, i, a) => !i || Math.hypot(p[0] - a[i - 1][0], p[1] - a[i - 1][1]) > 1e-6);
    if (Math.hypot(out[0][0] - out.at(-1)[0], out[0][1] - out.at(-1)[1]) < 1e-6) out.pop();
    const W = (px, py, d) => H.at(px, py, d).sub(AC);
    const pos = [], idx = [];
    const tri = THREE.ShapeUtils.triangulateShape(out.map(([x, y]) => new THREE.Vector2(x, -y)), []);
    const n = out.length;
    for (const [x, y] of out) { const p = W(x, y, DS); pos.push(p.x, p.y, p.z); }
    for (const [x, y] of out) { const p = W(x, y, DB); pos.push(p.x, p.y, p.z); }
    for (const [a, b, c] of tri) idx.push(a, c, b, n + a, n + b, n + c);
    const side0 = pos.length / 3;
    for (let i = 0; i <= n; i++) { const [x, y] = out[i % n], p = W(x, y, DS), q = W(x, y, DB); pos.push(p.x, p.y, p.z, q.x, q.y, q.z); }
    for (let i = 0; i < n; i++) { const k = side0 + 2 * i; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    const sm22 = boardMat(SCREEN_GLSL, { amp: 16, hid: [0.62, 0.1] }); sm22.uniforms.uAC.value.copy(AC);
    const mesh = new THREE.Mesh(g, sm22); mesh.position.copy(AC); mesh.frustumCulled = false; scene.add(mesh);
    // grows in as the camera cranes down (ending at 0.85 with the copy's own start speed), then scales exactly as the copy's
    // picture does (0.85 → 1 over 0.6 s, back.out(1.3), from its build at hold start − 0.45); powers off as the camera trucks right
    const TP = Math.min(H.t0 - 0.45, H.tk - 0.7), T0 = TP - 0.55, bo = ez('back.out(1.3)'), off = ez('power2.in');
    const h01 = u => { const m0 = 1.8, m1 = 1.075 * 0.55 / 0.85, u2 = u * u, u3 = u2 * u; return (-2 * u3 + 3 * u2) + m0 * (u3 - 2 * u2 + u) + m1 * (u3 - u2); };
    anim(t => {
      let s = t < TP ? 0.85 * h01(cl((t - T0) / (TP - T0))) : 0.85 + 0.15 * bo(cl((t - TP) / 0.6));
      s *= 1 - off(cl((t - 103.35) / 0.5));
      mesh.visible = ACTIVE(t) && t > T0 && s > 1e-3; mesh.scale.setScalar(Math.max(1e-3, s)); sm22.uniforms.uS.value = Math.max(1e-3, s);
    });
  }

  /* ---------- board 22's shapes: pieces, flat at the hold, colours fitted to the board ---------- */
  // slide in / out along a view axis by d px (expo.out in, power2.in out), popping in and out only off screen
  const mv = (ax, d, t0, t1, oAx = ax, oD = d, dIn = 0.6, dOut = 0.55) => { const k = { op: [[t0, 0], [t0 + 0.05, 1], [t1 + dOut - 0.03, 1], [t1 + dOut, 0]] };
    k[ax] = [[t0, d], [t0 + dIn, 0, 'expo.out']];
    if (oAx === ax) k[ax].push([t1, 0], [t1 + dOut, oD, 'power2.in']); else k[oAx] = [[t1, 0], [t1 + dOut, oD, 'power2.in']];
    return k; };
  // a rounded rectangle in board px (x0, y0, x1, y1; corner radii [tl, tr, br, bl]) around the anchor at, y up: a Shape, or a
  // hole Path (wound the other way, no repeated points)
  const rrc = (x0, y0, x1, y1, [rtl, rtr, rbr, rbl], at, hole = false) => {
    const pts = [], P = (x, y) => new THREE.Vector2(x - at[0], at[1] - y);
    const arc = (cx, cy, r, a0, a1) => { if (r < 0.5) { pts.push(P(cx + r * Math.cos(a0), cy - r * Math.sin(a0))); return; }
      for (let i = 0; i <= 16; i++) { const a = a0 + (a1 - a0) * i / 16; pts.push(P(cx + r * Math.cos(a), cy - r * Math.sin(a))); } };
    arc(x1 - rtr, y0 + rtr, rtr, Math.PI / 2, 0); arc(x1 - rbr, y1 - rbr, rbr, 0, -Math.PI / 2);
    arc(x0 + rbl, y1 - rbl, rbl, -Math.PI / 2, -Math.PI); arc(x0 + rtl, y0 + rtl, rtl, Math.PI, Math.PI / 2);
    const clean = pts.filter((p, i, a) => !i || p.distanceToSquared(a[i - 1]) > 1e-6); if (clean[0].distanceToSquared(clean.at(-1)) < 1e-6) clean.pop();
    if (hole) { const h = new THREE.Path(); h.setFromPoints(clean.reverse()); return h; }
    const s = new THREE.Shape(); s.setFromPoints(clean); return s;
  };
  // bottom left: the four quarter-discs (corner at (x0, 1070), flat side left, curve falling right; r measured per disc),
  // running on below the frame
  const qShape = r => { const s = new THREE.Shape(); s.moveTo(0, -330); s.lineTo(r, -330); s.lineTo(r, 0); s.absarc(0, 0, r, 0, Math.PI / 2, false); s.lineTo(0, -330); return s; };
  [[5, 223], [228, 224], [455, 225], [680, 220]].forEach(([x0, r], k) => FP({ shape: qShape(r), at: [x0, 1070], depth: 36.6 + 0.1 * k, thick: 1.0,
    keys: mv('y', 620, 99.02 + 0.07 * k, 102.75 + 0.06 * k, 'y', 700) }, glslFit('qd', FIT['qd' + (k + 1)]), 'qd', [8, 10]));
  // top left: the soft stadium ring (left end r 194.5, top 15, bottom 404); its right end runs up above the frame as the
  // magenta panel beside the chute (x 740–930, up to y −250, rounded top) and ends square under the chute
  {
    const s = new THREE.Shape(), ax = 540, ay = 209.5, P = (x, y) => [x - ax, ay - y];
    s.moveTo(...P(342.5, 404)); s.lineTo(...P(930, 404)); s.lineTo(...P(930, -250));
    s.absarc(...P(835, -250), 95, 0, Math.PI, false); s.lineTo(...P(740, 15)); s.lineTo(...P(342.5, 15));
    s.absarc(...P(342.5, 209.5), 194.5, Math.PI / 2, 1.5 * Math.PI, false);
    FP({ shape: s, at: [ax, ay], depth: 44, thick: 1.2, keys: mv('x', -1000, 98.35, 102.55, 'x', -1100, 0.75) }, glslFit('tlring', FIT.tlring), 'tlring', [12, 8]);
    // the dark pill (the super sits on it): 260–835 × 122–266
    FP({ shape: SH.pill(575, 144), at: [547.5, 194], depth: 43.55, thick: 1.0, keys: mv('x', -1000, 98.42, 102.6, 'x', -1100, 0.75) }, glslFit('pl', FIT.pill), 'pl', [6, 4]);
  }
  // right: the magenta ring (outer from 1578 × 38–1040, top-left corner r 313; hole from 1783 × 236–975, r 91; both run on off
  // the board's right edge) and, in front of it, the translucent orange → gold D band (332–786, its right end a half disc of
  // r 227 about x 1776; hole 483–635, right end r 76 about x 1786; both run on left behind the screen)
  {
    const aR = [1829, 540], ring = rrc(1578, 38, 2150, 1040, [313, 200, 200, 200], aR); ring.holes.push(rrc(1783, 236, 2080, 975, [91, 91, 91, 91], aR, true));
    FP({ shape: ring, at: aR, depth: 45, thick: 1.4, keys: mv('x', 900, 98.85, 104.35, 'y', -1300, 0.6, 0.65) }, MRING_GLSL, 'mring', [0, 12]);
    const aD = [1651, 559], D = rrc(1300, 332, 2003, 786, [0, 227, 227, 0], aD); D.holes.push(rrc(1400, 483, 1862, 635, [0, 76, 76, 0], aD, true));
    PC({ hold: 22, shape: D, at: aD, depth: 42, thick: 0.9, op: 0.8, grad: { cols: ['#a0506c', '#d08840', '#ffcc00'], from: [1560, 555], to: [1915, 555] },
      keys: mv('x', 900, 98.95, 104.3, 'y', -1300, 0.6, 0.65) });
  }
  // the backdrop: board 22's navy with its glows (fitted), behind everything; it never hides a neighbour's set (no depth)
  {
    const bd = FP({ shape: SH.rr(1920 * 5, 1080 * 5, 0), at: [960, 540], depth: 75, thick: 0, drift: 0, flat: false,
      keys: { op: [[98.1, 0], [98.9, 1, 'sine.inOut'], [104.5, 1], [105.3, 0, 'sine.inOut']] } },
      glslFit('bgF', FIT.bg) + `vec3 bg(vec2 b) { return mix(bgF(b), ${hexC('#2a0f62')}, 0.85 * (1.0 - smoothstep(-420.0, -20.0, b.y))); }\n`, 'bg', [24, 12], '(1.0 - smoothstep(2300.0, 2900.0, bp.x))');
    bd.mesh.renderOrder = -3;
    anim(() => { bd.mesh.material.depthWrite = false; });          // drawn first, writing no depth: anything else draws over it
  }

  V.unplate(22);
};
