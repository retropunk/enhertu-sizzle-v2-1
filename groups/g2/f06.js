/* Frame 6 · the pipe mouth over the funnel: a side elevation at funnel-rim height (G2, called from g2.js with its context C).
   Built (batch 2): the real set, no plate.
   · The pipe is real 3D. The open channel from the 5 → 6 aerial (C.pipe6) runs on into a closed pipe that bends down
     through a large rounded quarter bend into a vertical section with a flat mouth. Its section is solved so that, from
     the hold camera, the near face, the top chamfer (the orange lip) and the bottom chamfer (the pink lip) land exactly
     on board 6's bands. The channel eases into that section off screen (the aerial section is a little bigger).
     Surfaces that face down (the pipe's underside, the mouth) are tilted a few degrees so they are edge-on from the hold
     camera (it sits below them, at funnel-rim height), so they read flat like the board and still close the pipe.
   · The bore: a slot in the near face of the down section, lit pink → orange toward the mouth; the sphere is seen
     dropping inside it just before it leaves the mouth.
   · Colour: every pipe and funnel surface takes its colour from where it sits in the hold view, so at the hold it shows
     board 6's gradients exactly; the colours flow slowly along the pipe (living), phase-locked to the board at the key
     instant. Back along the channel the board colours blend smoothly into the aerial's own gradients.
   · The funnel and stem: a real cone and cylinder whose silhouette from the hold camera is board 6's trapezoid (the rim
     sits exactly at camera height, so it reads as a straight line); dark inside.
   · Board shapes as pieces (flat at the hold, chunky while moving): the ∩ arch and the translucent pill with its yellow
     cap (lower left), the C disc with its notch and violet slot (top right), the stadium ring (right), the two small
     blocks above the pipe (top left), and a backdrop carrying the board's glows (top, lower left, lower right).
   · In: the funnel rises into place and the board shapes slide in as the camera orbits to the side. Out: the shapes
     slide away as the camera tilts down after the drop; the pipe leaves above frame; the funnel lifts away once the
     sphere has landed on frame 7's path. */
export default (V, C) => {
  const { THREE, Vec, h6, M6, P6, s6, pipe6, A, sA, L, sm, sweep, capAt, rectShape, PC, SH, gm, mesh, prop } = C;
  const { anim } = V;
  const TK = h6.tk;
  const cam = h6.pos, fwd = h6.fwd, rgt = h6.right, upv = h6.upv, tanV = h6.tanV, zP = M6.z;
  const rayOf = (px, py) => fwd.clone().addScaledVector(rgt, (px - 960) / 540 * tanV).addScaledVector(upv, (540 - py) / 540 * tanV);
  // the world point on the hold-6 view ray through board (px, py), on the plane z = zP + zo
  const onZ = (px, py, zo) => { const r = rayOf(px, py), k = (zP + zo - cam.z) / r.z; return cam.clone().addScaledVector(r, k); };
  const yAt = (py, zo) => onZ(960, py, zo).y, xAt = (px, zo, py = 470) => onZ(px, py, zo).x;
  const V3 = (x, y, z) => new Vec(x, y, z);

  /* ---------- the hold camera's projection (for the board-coloured materials) ---------- */
  const hc = new THREE.PerspectiveCamera(h6.fov, 16 / 9, 0.05, 2000);
  hc.position.copy(cam); hc.up.set(0, 1, 0); hc.lookAt(h6.look); hc.updateMatrixWorld(); hc.updateProjectionMatrix();
  const HVP = new THREE.Matrix4().multiplyMatrices(hc.projectionMatrix, hc.matrixWorldInverse);

  /* ---------- board-coloured material: the engine's gradient shader, plus a colour field in hold-6 board px ----------
     boardCol(b, sl) (GLSL) returns the board colour at board px b (sl: the living slide, in px). w: [x0, x1] world-x range
     over which the engine's own gradient (the base material's) hands over to the board colours (none: board colours only).
     Faces the hold camera sees keep the board colour; faces turned away from it are shaded (hid) so the form reads in motion. */
  const hexC = h => { const n = parseInt(h.slice(1), 16); return `vec3(${((n >> 16 & 255) / 255).toFixed(4)}, ${((n >> 8 & 255) / 255).toFixed(4)}, ${((n & 255) / 255).toFixed(4)})`; };
  const stopsFn = (name, st) => `vec3 ${name}(float v) { vec3 c = ${hexC(st[0][1])};\n` +
    st.slice(1).map(([v, h], i) => `  c = mix(c, ${hexC(h)}, clamp((v - ${st[i][0].toFixed(1)}) / ${(v - st[i][0]).toFixed(1)}, 0.0, 1.0));`).join('\n') + '\n  return c; }\n';
  const BPER = 7.3, BPH = (Math.PI - 2 * Math.PI * TK / BPER) / 2;       // the slide is zero at the key instant
  const boardMat = (glsl, o = {}) => {
    const base = o.base || V.mat(['#7b2bf9'], { flat: true, side: THREE.DoubleSide });
    const u = { ...base.uniforms, hvp: { value: HVP }, hcam: { value: cam.clone() }, wax: { value: rgt.clone() }, bper: { value: BPER }, bph: { value: BPH },
      bamp: { value: o.amp ?? 36 }, w0: { value: o.w ? o.w[0] : 0 }, w1: { value: o.w ? o.w[1] : 0 }, hid: { value: new THREE.Vector2(...(o.hid || [0.8, 0.12])) }, bmul: { value: o.mul ?? 1 } };
    const head = 'uniform mat4 hvp; uniform vec3 hcam, wax; uniform float bper, bph, bamp, w0, w1, bmul; uniform vec2 hid;\n' + glsl;
    const inj = `vec4 hq = hvp * vec4(vW, 1.0);
  vec2 bp = vec2((hq.x / hq.w * 0.5 + 0.5) * 1920.0, (0.5 - 0.5 * hq.y / hq.w) * 1080.0);
  float sl = bamp * min(flow, 1.6) * (sin(t * spd / bper * 6.2832 + bph) - sin(bph));
  vec3 nb = normalize(vN);
  float vis = smoothstep(0.0, 0.22, dot(nb, normalize(hcam - vW)));
  vec3 bc = boardCol(bp, sl) * bmul * mix(hid.x + hid.y * nb.y, 1.0, vis);
  float wB = w1 > w0 ? smoothstep(w0, w1, dot(vW, wax)) : 1.0;
  gl_FragColor = vec4(mix(col * shade, bc, wB), op);`;
    const fs = base.fragmentShader.replace('#include <logdepthbuf_pars_fragment>', '#include <logdepthbuf_pars_fragment>\n' + head).replace('gl_FragColor = vec4(col * shade, op);', inj);
    if (fs === base.fragmentShader) throw new Error('f06: engine shader changed; boardMat could not hook it');
    const m = new THREE.ShaderMaterial({ uniforms: u, vertexShader: base.vertexShader, fragmentShader: fs, side: THREE.DoubleSide, transparent: base.transparent });
    return m;
  };

  /* ---------- board 6's pipe colours (measured, board px) ---------- */
  const PIPE_GLSL = [
    stopsFn('lipT', [[10, '#fc5e48'], [70, '#ff5c4b'], [130, '#ff5d46'], [190, '#ff613e'], [250, '#ff6632'], [310, '#ff6b23'], [370, '#fe7213'], [430, '#ff7707'], [490, '#fc7a02'],
      [550, '#f0750e'], [610, '#d8673b'], [670, '#ba5478'], [730, '#9c40af'], [790, '#862dd7'], [822, '#8030de']]),
    stopsFn('bodyX', [[10, '#5d02fe'], [70, '#6f09f3'], [130, '#961cd9'], [190, '#c235b5'], [250, '#e64c8c'], [310, '#f85d64'], [370, '#fe6843'], [430, '#fb6e29'], [490, '#f2701a'],
      [550, '#e86e19'], [610, '#da6a27'], [670, '#cc643e'], [730, '#bd5b60'], [790, '#af5384'], [850, '#a049a7'], [910, '#9441c7'], [970, '#8c3add'], [1030, '#8636ea'], [1090, '#7f31f6']]),
    stopsFn('lipB', [[10, '#fa506c'], [70, '#ff4d74'], [130, '#ff4d77'], [190, '#fc4c7b'], [250, '#f64a86'], [310, '#ed4791'], [370, '#e2439d'], [430, '#d641a7'], [490, '#c742af'],
      [550, '#b33fbc'], [610, '#9e39d5'], [670, '#892eef'], [730, '#7221fa'], [790, '#6416ff'], [822, '#6015ff']]),
    stopsFn('stripY', [[384, '#bd406a'], [420, '#b4367d'], [460, '#a1259f'], [500, '#9519b5'], [540, '#8e14c1'], [600, '#8a12c8']]),
    // along the outer band: s = 0 at x822 on the top, round the bend (mid radius 233), then down the right side
    stopsFn('bandS', [[0, '#ffa602'], [28, '#fea500'], [88, '#ff9e02'], [147, '#ff920e'], [202, '#fe8628'], [302, '#f05d6c'], [391, '#ca3ab5'], [431, '#aa2dd3'], [470, '#8b20ec'],
      [510, '#7114f8'], [550, '#5b0afd'], [590, '#4c04fe'], [630, '#4401ff'], [670, '#4300ff']]),
    stopsFn('boreY', [[384, '#7b29f7'], [410, '#7e2df6'], [420, '#8f37e2'], [440, '#ad45b0'], [460, '#c75381'], [480, '#db5f62'], [500, '#ee5a7e'], [520, '#f25a80'], [550, '#f86a70'], [620, '#ff8060']]),
    `vec3 boardCol(vec2 b, float sl) {
  float px = b.x, py = b.y, qx = px - 930.0, qy = 346.0 - py;
  float rho = qy >= 0.0 ? (qx <= 0.0 ? qy : length(vec2(qx, qy))) : qx;
  float s = qy >= 0.0 ? (qx <= 0.0 ? px - 822.0 : 108.0 + (1.5708 - atan(qy, qx)) * 233.0) : 474.0 + (py - 346.0);
  vec3 outer = mix(bandS(s + sl), lipT(px + sl), 1.0 - smoothstep(821.0, 823.0, px));
  vec3 body = bodyX(px + sl);
  body = mix(body, mix(${hexC('#7c2df8')}, ${hexC('#7628fe')}, smoothstep(900.0, 1100.0, px)), smoothstep(250.0, 420.0, py) * smoothstep(840.0, 900.0, px));
  body = mix(body, boreY(py), smoothstep(932.0, 938.0, px) * (1.0 - smoothstep(1068.0, 1074.0, px)) * smoothstep(384.0, 410.0, py));
  vec3 low = mix(lipB(px + sl), stripY(py), smoothstep(821.0, 823.0, px));
  vec3 inner = mix(body, low, smoothstep(382.5, 384.5, py) * (1.0 - smoothstep(891.0, 893.0, px)));
  return mix(inner, outer, smoothstep(197.5, 199.5, rho));
}\n`].join('');
  const FUNNEL_GLSL = [
    stopsFn('coneX', [[640, '#ef7625'], [1000, '#ef7625'], [1040, '#eb7326'], [1080, '#de673b'], [1120, '#d55d4f'], [1160, '#c8535b'], [1200, '#ba4a72'], [1240, '#b13e8c'],
      [1280, '#a3359b'], [1320, '#982baa'], [1360, '#8a23bc'], [1400, '#8116d8'], [1440, '#7012e2'], [1470, '#6a10e4']]),
    stopsFn('stemX', [[840, '#ef7623'], [960, '#f07724'], [1000, '#de6a3a'], [1040, '#cb5959'], [1080, '#b74779'], [1120, '#a23895'], [1160, '#8f26b3'], [1200, '#7b17d2'], [1240, '#7010dc']]),
    `vec3 boardCol(vec2 b, float sl) { return mix(coneX(b.x + sl), stemX(b.x + sl), smoothstep(835.5, 838.5, b.y)); }\n`].join('');

  /* ---------- the pipe's section at frame 6, solved against the board ----------
     path height yP (the sphere's centre on the straight, board y178); unknowns: half width W, top and bottom (from yP),
     chamfers ct (top) and cbv (bottom). The near face is at z = zP + W. Board edges: top lip 76–147, body 147–383.5,
     bottom lip 383.5–452; a square section (top − bot = 2W), 45° chamfers. */
  const yP = A.at(sA.J).y;
  let W = 2.5, ct = 1, cbv = 0.95, top = 1.5, bot = -3.5;
  for (let it = 0; it < 40; it++) {
    const yBT = yAt(147, W), yBB = yAt(383.5, W);
    top = yAt(76, W - ct) - yP; ct = top - (yBT - yP);
    bot = yAt(452, W - cbv) - yP; cbv = (yBB - yP) - bot;
    W = (top - bot) / 2;
  }
  const zN = W, zC = W - ct, zB = W - cbv;                                   // near face, top-chamfer edge, bottom-chamfer edge (from zP)
  const dF = yAt(452, -zB) - (yP + bot);                                      // the far bottom edge sits on the near one's view plane
  const yM = zo => yAt(551, zo);                                              // the mouth: on the view plane of board row 551

  /* ---------- the open channel (from the 5 → 6 aerial): its section eases into frame 6's off screen ---------- */
  const [chSide, chLipT, chLipB, chIn, , chDark] = pipe6.meshes;
  {
    const sCt = A.sOf(L(2.9, -0.33, 2.06)), sC0 = sCt - 1.5, cp = A.pts(sC0, sA.C, 240), dS = (sA.C - sC0) / 240;
    const sK1 = A.sOf(P6(-60, 178)), sK0 = sK1 - 12;
    const { W: W0, b: b0, top: top0, bot: bot0, fl, ct: ct0, cbv: cbv0 } = pipe6.dims;
    const sec = i => { const m = 1 - sm(i * dS / 11), k = sm((sC0 + i * dS - sK0) / (sK1 - sK0)), lerp = (a, c) => a + (c - a) * k;
      return { W: lerp(W0 + 0.35 * m, W), b: b0 + 0.45 * m, top: lerp(top0 - 1.9 * m, top), bot: lerp(bot0, bot), ct: lerp(ct0, ct), cbv: lerp(cbv0, cbv), dF: dF * k }; };
    const sp = f => i => f(sec(i));
    const set = (me, g) => { me.geometry.dispose(); me.geometry = g; };
    set(chSide, sweep(cp, [{ p: sp(q => [[-q.W, q.top - q.ct], [-q.W, q.bot + q.cbv]]) }, { p: sp(q => [[q.W, q.bot + q.cbv], [q.W, q.top - q.ct]]) }]));
    set(chLipT, sweep(cp, [{ p: sp(q => [[-q.b, q.top], [-(q.W - q.ct), q.top], [-q.W, q.top - q.ct]]) }, { p: sp(q => [[q.W, q.top - q.ct], [q.W - q.ct, q.top], [q.b, q.top]]) }]));
    set(chLipB, sweep(cp, [{ p: sp(q => [[-q.W, q.bot + q.cbv], [-(q.W - q.cbv), q.bot + q.dF], [q.W - q.cbv, q.bot], [q.W, q.bot + q.cbv]]) }]));
    set(chIn, sweep(cp, [{ p: sp(q => [[q.b, q.top], [q.b, fl], [-q.b, fl], [-q.b, q.top]]) }]));
    const qE = sec(240); set(chDark, capAt(cp, 240, rectShape(-qE.b - 0.02, fl - 0.02, qE.b + 0.02, qE.top + 0.02)));
    // its colours: the aerial's own gradients, handing over to board 6's colours before the channel enters the frame
    const wX = [P6(-560, 263).dot(rgt), P6(-90, 263).dot(rgt)];
    for (const me of [chSide, chLipT, chLipB]) me.material = boardMat(PIPE_GLSL, { base: me.material, w: wX });
  }
  // g2's closed pipe and mouth give way to the real frame 6 pipe below
  const oldPipe = pipe6.meshes.slice(6);
  for (const me of oldPipe) { V.scene.remove(me); const i = pipe6.fade.list.indexOf(me); if (i >= 0) pipe6.fade.list.splice(i, 1); }

  /* ---------- the closed pipe: straight → quarter bend → down → flat mouth (world geometry, x right, y up) ---------- */
  const zF = o => -o;                                                         // mirror (far side)
  const xS = P6(700, 263).x - 0.25;                                           // starts just inside the channel's end (overlap, same colours)
  const yT = yP + top, yBT = yP + top - ct, yBB = yP + bot + cbv, yBt = yP + bot;
  const xRc = xAt(1199, zC), xRn = xAt(1128.5, zN), xIn = xAt(892, zN), xIb = xAt(822, zB);
  const arcOf = (zo, xR, yTop) => { const c0 = onZ(930, 346, zo), R = ((xR - c0.x) + (yTop - c0.y)) / 2; return { cx: xR - R, cy: yTop - R, R }; };
  const aO = arcOf(zC, xRc, yT), aN = arcOf(zN, xRn, yBT);
  const N1 = 24, N2 = 40, N3 = 24;
  // an outer line (top → round the bend → down to the mouth) at depth zo, arc a; the same sample count for every line
  const outerLine = (zo, a, zWorld = zo) => { const pts = [], yEnd = yM(zWorld);
    for (let i = 0; i <= N1; i++) pts.push(V3(xS + (a.cx - xS) * i / N1, a.cy + a.R, zP + zWorld));
    for (let i = 1; i <= N2; i++) { const th = Math.PI / 2 * (1 - i / N2); pts.push(V3(a.cx + a.R * Math.cos(th), a.cy + a.R * Math.sin(th), zP + zWorld)); }
    for (let i = 1; i <= N3; i++) pts.push(V3(a.cx + a.R, a.cy + (yEnd - a.cy) * i / N3, zP + zWorld));
    return pts; };
  // an inner line (along the bottom → a square corner → down to the mouth); yH: its height on the straight
  const innerLine = (zo, x, yH) => { const pts = [], yEnd = yM(zo);
    for (let i = 0; i <= N1 + N2 / 2; i++) pts.push(V3(xS + (x - xS) * i / (N1 + N2 / 2), yH, zP + zo));
    for (let i = 1; i <= N2 / 2 + N3; i++) pts.push(V3(x, yH + (yEnd - yH) * i / (N2 / 2 + N3), zP + zo));
    return pts; };
  const strip = (Aa, Bb, out) => { const pos = [], idx = [];
    for (let i = 0; i < Aa.length; i++) pos.push(Aa[i].x, Aa[i].y, Aa[i].z, Bb[i].x, Bb[i].y, Bb[i].z);
    for (let i = 0; i < Aa.length - 1; i++) { const k = 2 * i; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    const n = g.attributes.normal; if (n.getX(0) * out.x + n.getY(0) * out.y + n.getZ(0) * out.z < 0) { for (let i = 0; i < n.count; i++) n.setXYZ(i, -n.getX(i), -n.getY(i), -n.getZ(i)); }
    return g; };
  const On = outerLine(zN, aN), Oc = outerLine(zC, aO), Oc2 = outerLine(zC, aO, zF(zC)), On2 = outerLine(zN, aN, zF(zN));
  const In = innerLine(zN, xIn, yBB), Ib = innerLine(zB, xIb, yBt), In2 = innerLine(zF(zN), xIn, yBB);
  const Ib2 = innerLine(zF(zB), xIb, yBt + dF);                                // the far bottom edge raised onto the near one's view plane
  const mPipe = boardMat(PIPE_GLSL);
  const geos = [strip(On, Oc, V3(0, 1, 1)), strip(Oc, Oc2, V3(0, 1, 0)), strip(Oc2, On2, V3(0, 1, -1)),      // top chamfer, top / outer surface, far top chamfer
    strip(In, Ib, V3(0, -1, 1)), strip(Ib, Ib2, V3(0, -1, 0)), strip(Ib2, In2, V3(0, -1, -1))];              // bottom / inner chamfer, underside / inner face, far one
  // the near face (with the bore slot, open at the mouth) and the far face: planar, board outline
  const xSL = xAt(935, zN, 500), xSR = xAt(1071, zN, 500), ySlot = yAt(455, zN);
  const faceShape = (slot, yMn) => { const s = new THREE.Shape(); s.moveTo(xS, yBB); s.lineTo(xIn, yBB); s.lineTo(xIn, yMn);
    if (slot) { s.lineTo(xSL, yMn); s.lineTo(xSL, ySlot); s.lineTo(xSR, ySlot); s.lineTo(xSR, yMn); }
    s.lineTo(xRn, yMn); s.lineTo(xRn, aN.cy);
    for (let i = 1; i < N2; i++) { const th = Math.PI / 2 * i / N2; s.lineTo(aN.cx + aN.R * Math.cos(th), aN.cy + aN.R * Math.sin(th)); }
    s.lineTo(aN.cx, yBT); s.lineTo(xS, yBT); s.lineTo(xS, yBB); return s; };
  const planar = (shape, z, nz) => { const g = new THREE.ShapeGeometry(shape); g.translate(0, 0, z); const n = g.attributes.normal; for (let i = 0; i < n.count; i++) n.setXYZ(i, 0, 0, nz); return g; };
  geos.push(planar(faceShape(true, yM(zN)), zP + zN, 1), planar(faceShape(false, yM(zF(zN))), zP - zN, -1));
  // inside the down section: far wall and side walls (seen through the bore slot), bottoms on the mouth's view plane
  const xiL = xIn, xiR = xRn, ziF = -zB, yIt = yAt(372, zN);
  const wallQuad = (P0, P1, P2, P3, out) => strip([P0, P1], [P3, P2], out);
  geos.push(wallQuad(V3(xiL, yM(ziF), zP + ziF), V3(xiR, yM(ziF), zP + ziF), V3(xiR, yIt, zP + ziF), V3(xiL, yIt, zP + ziF), V3(0, 0, 1)),
    wallQuad(V3(xiL, yM(ziF), zP + ziF), V3(xiL, yM(zN), zP + zN), V3(xiL, yIt, zP + zN), V3(xiL, yIt, zP + ziF), V3(1, 0, 0)),
    wallQuad(V3(xiR, yM(ziF), zP + ziF), V3(xiR, yM(zN), zP + zN), V3(xiR, yIt, zP + zN), V3(xiR, yIt, zP + ziF), V3(-1, 0, 0)));
  // the mouth's rim (the pipe wall's end, between the outer section and the bore), on the mouth's view plane
  { const oct = [[xIn, zN], [xRn, zN], [xRc, zC], [xRc, zF(zC)], [xRn, zF(zN)], [xIn, zF(zN)], [xIb, zF(zB)], [xIb, zB]];
    const s = new THREE.Shape(); oct.forEach(([x, z], i) => i ? s.lineTo(x, -z) : s.moveTo(x, -z));
    const hp = new THREE.Path(); [[xiL + 0.02, zN - 0.02], [xiL + 0.02, ziF + 0.02], [xiR - 0.02, ziF + 0.02], [xiR - 0.02, zN - 0.02]].forEach(([x, z], i) => i ? hp.lineTo(x, -z) : hp.moveTo(x, -z)); s.holes.push(hp);
    const g = new THREE.ShapeGeometry(s), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), zo = -p.getY(i); p.setXYZ(i, x, yM(zo), zP + zo); }
    g.computeVertexNormals(); const n = g.attributes.normal; if (n.getY(0) > 0) for (let i = 0; i < n.count; i++) n.setXYZ(i, -n.getX(i), -n.getY(i), -n.getZ(i));
    geos.push(g); }
  const pipeMeshes = geos.map(g => mesh(g, mPipe));
  pipe6.fade.list.push(...pipeMeshes);
  // (it rises with the channel after frame 5, as g2's closed pipe did)
  { const e = gsap.parseEase('power2.out'); anim(t => { const dy = -11 * (1 - e(Math.min(1, Math.max(0, (t - 16.0) / 0.4)))); for (const me of pipeMeshes) me.position.y = dy; }); }
  // the pipe stays through the hold and the drop, and leaves once the camera has tilted down after the sphere
  pipe6.fade.ws[0] = [pipe6.fade.ws[0][0], pipe6.fade.ws[0][1], 21.3, 21.55];

  /* ---------- the funnel and its stem: silhouette = board 6's trapezoid from the hold camera ---------- */
  // (in the horizontal plane through the camera, a board column px is seen at angle phi from straight ahead)
  const phi = px => Math.atan((px - 960) / 540 * tanV * Math.abs(fwd.z));
  const dz0 = cam.z - zP, phC = (phi(601) + phi(1461)) / 2, dist = dz0 / Math.cos(phC);
  const ax = V3(cam.x + dist * Math.sin(phC), 0, zP);                                        // the funnel's axis
  const Rr = dist * Math.sin((phi(1461) - phi(601)) / 2), Rs = dist * Math.sin((phi(1236.5) - phi(826.5)) / 2);
  const yRim = cam.y;                                                                         // exactly at camera height: the rim reads as a straight line
  // the stem's left silhouette point (where the view ray grazes it) sets the junction height (board y 837)
  const aL = phC - Math.asin(Rs / dist), tl = Math.sqrt(dist * dist - Rs * Rs), pT = V3(cam.x + tl * Math.sin(aL), 0, cam.z - tl * Math.cos(aL));
  const yJ = onZ(826.5, 837, pT.z - zP).y, yBot = M6.y - 9.2, wall = 0.14;
  const lathe = (pts, n = 96) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), n);
  const fOut = lathe([[Rs, yBot], [Rs, yJ], [Rr, yRim]]), fIn = lathe([[Rs - wall, yBot], [Rs - wall, yJ + 0.1], [Rr - wall * 1.3, yRim]]);
  const fRim = new THREE.RingGeometry(Rr - wall * 1.3, Rr, 96); fRim.rotateX(-Math.PI / 2); fRim.translate(0, yRim, 0);
  const fBot = new THREE.RingGeometry(Rs - wall, Rs, 64); fBot.rotateX(Math.PI / 2); fBot.translate(0, yBot, 0);
  for (const g of [fOut, fIn, fRim, fBot]) g.translate(ax.x, 0, ax.z);
  const mFun = boardMat(FUNNEL_GLSL, { amp: 30, hid: [0.78, 0.1] });
  // (fix pass: near-black at the throat, violet at the rim, so from above the rim the opening reads hollow, not a flat lid;
  //  edge-on at the hold, so board 6 is unchanged)
  const mFunIn = gm(['#06021a', '#1a0850', '#4c16a6'], V3(ax.x, yJ - 0.5, ax.z), V3(ax.x, yRim, ax.z));
  const funnel = [mesh(fOut, mFun), mesh(fIn, mFunIn), mesh(fRim, mFun), mesh(fBot, mFunIn)];
  prop(funnel, [19.7, 19.85, 21.9, 22.05]);
  // rises into place as the camera comes round; lifts away (up and back) once the sphere has landed on frame 7's path
  { const eIn = gsap.parseEase('power3.out'), eOut = gsap.parseEase('power2.in');
    anim(t => { const u = Math.min(1, Math.max(0, (t - 19.7) / 0.6)), v = Math.min(1, Math.max(0, (t - 21.4) / 0.6));
      const dy = -14 * (1 - eIn(u)) + 16 * eOut(v), dz = -10 * eOut(v); for (const me of funnel) { me.position.y = dy; me.position.z = dz; } }); }

  /* ---------- board 6's shapes (pieces: flat at the hold, chunky sides while the camera moves) ---------- */
  // slides in (while the camera settles) and out (as it tilts down after the drop), along a view axis by d px; fades in over
  // its first 0.12 s so it can't pop in view of the orbiting camera
  // (out: sideways or up, never down: the camera tilts down after the sphere and would follow a piece leaving downward)
  const mv = (ax, d, t0, t1, oAx = ax, oD = d, dOut = 0.42, oE = 'power2.in', dIn = 0.5) => { const k = { op: [[t0, 0], [t0 + 0.12, 1], [t1 + dOut - 0.02, 1], [t1 + dOut, 0]] };
    k[ax] = [[t0, d], [t0 + dIn, 0, 'expo.out']];
    if (oAx === ax) k[ax].push([t1, 0], [t1 + dOut, oD, oE]); else k[oAx] = [[t1, 0], [t1 + dOut, oD, oE]];
    return k; };
  const P = (spec, ax, d, t0, t1, oAx, oD, dOut, oE) => PC({ hold: 6, thick: 1.0, ...spec, keys: mv(ax, d, t0, t1, oAx, oD, dOut, oE) });
  // top left: two blocks above the pipe (they run up out of frame and down behind its top lip)
  P({ shape: SH.rr(125, 200, 0), at: [22, -20], depth: 38, grad: { cols: ['#5a2036', '#531c3a', '#4b1c3a'], from: [22, 0], to: [22, 76] } }, 'y', -300, 19.95, 20.92);
  P({ shape: SH.rr(139, 200, 0), at: [154.5, -20], depth: 38.05, grad: { cols: ['#8d337d', '#852c86', '#7f238c'], from: [154, 5], to: [154, 72] } }, 'y', -300, 19.98, 20.94);
  // lower left: the ∩ arch (outer 90–511, opening 230–371, top 519; legs off the bottom), and the translucent pill in front
  P({ shape: SH.arch(421, 600, 140.5), at: [300.5, 1119], depth: 44, thick: 1.4, grad: { cols: ['#cd0bfd', '#8e15e0', '#7712f3'], from: [300, 522], to: [300, 880] } }, 'y', 640, 19.88, 20.86, 'x', -900, 0.36, 'power1.in');
  // the pill: top 964, right end 578 with a 150 px corner; its yellow right cap (x ≥ 511) is a piece of its own
  const pillPts = (x0, x1) => { const r = 150, cx = 428, cy = 1114, arcX = x => cy - Math.sqrt(r * r - (x - cx) ** 2), pts = [[x0, 1330], [x1, 1330]];
    const aA = x1 >= 578 ? 0 : Math.acos((x1 - cx) / r), aB = x0 <= cx ? Math.PI / 2 : Math.acos((x0 - cx) / r);
    if (x1 >= 578) pts.push([578, cy]); else pts.push([x1, arcX(x1)]);
    for (let i = 1; i <= 24; i++) { const a = aA + (aB - aA) * i / 24; pts.push([cx + r * Math.cos(a), cy - r * Math.sin(a)]); }
    if (x0 < cx) pts.push([x0, 964]); return pts; };
  P({ shape: SH.poly(pillPts(-400, 511), [55.5, 1147]), at: [55.5, 1147], depth: 43.3, op: 0.9, grad: { cols: ['#7806f0', '#a03cb0', '#b67a64'], from: [30, 1000], to: [505, 1000] } }, 'x', -760, 19.98, 20.86, 'x', -900, 0.34, 'power1.in');
  P({ shape: SH.poly(pillPts(511, 578), [544.5, 1160]), at: [544.5, 1160], depth: 43.3, grad: { cols: ['#d9a52c', '#e6b62a', '#f0c40d'], from: [512, 1000], to: [575, 1060] } }, 'x', -760, 19.98, 20.86, 'x', -900, 0.34, 'power1.in');
  // top right: the C disc (centre 1782,290, r 314), the darker notch pill cut in from the right, the violet slot inside it
  P({ shape: SH.disc(314), at: [1782, 290], depth: 47, thick: 1.6, grad: { cols: ['#f47b39', '#c24a57', '#6a1862'], from: [1760, 10], to: [1540, 520] } }, 'x', 560, 19.9, 20.9);
  P({ shape: SH.pill(700, 218), at: [1681 + 350, 290], depth: 46.9, thick: 1.4, grad: { cols: ['#6a1c70', '#86296f', '#a03d68'], from: [1690, 290], to: [1900, 290] } }, 'x', 600, 19.93, 20.92);
  P({ shape: SH.pill(600, 85), at: [1748 + 300, 264.5], depth: 46.8, thick: 1.2, grad: { cols: ['#6e228e', '#7f2ba4', '#9a30bc'], from: [1760, 264], to: [1910, 264] } }, 'x', 620, 19.96, 20.94);
  // right: the stadium ring (outer 1560→, 525–847; slot 1645→, 632–741), its left end fading into the backdrop
  { const o = SH.rr(1000, 322, 161), hole = new THREE.Path(), hs = SH.rr(1000 - 85 - 60, 109, 54.5).getPoints(48).map(p => new THREE.Vector2(p.x + 12.5, p.y - 0.5)).filter((p, i, a) => !i || p.distanceTo(a[i - 1]) > 1e-6);
    if (hs[0].distanceTo(hs.at(-1)) < 1e-6) hs.pop(); hole.setFromPoints(hs.reverse()); o.holes.push(hole);
    P({ shape: o, at: [1560 + 500, 686], depth: 45, thick: 1.2, grad: { cols: ['#33095c', '#8a3552', '#c46a34'], from: [1572, 686], to: [1900, 686] } }, 'x', 460, 19.98, 20.95); }
  // the backdrop: board 6's dark indigo, with its glows (lighter violet at the top, violet low left, warm brown low right)
  { const bd = PC({ hold: 6, shape: SH.rr(1920 * 5, 1080 * 5, 0), at: [960, 540], depth: 95, thick: 0, drift: 0, flat: false, in: { type: 'fade', t: [19.45, 20.05], ease: 'sine.inOut' }, out: { type: 'fade', t: [21.5, 21.95], ease: 'sine.inOut' } }), o0 = bd.mesh.material;   // (integration: stays until frame 7's backdrop is in, so the tilt down after the drop isn't bare background)
    bd.mesh.material = new THREE.ShaderMaterial({ uniforms: { op: o0.uniforms.op, t: o0.uniforms.t, flow: o0.uniforms.flow, spd: o0.uniforms.spd }, transparent: true, depthWrite: false,
      vertexShader: '#include <common>\n#include <logdepthbuf_pars_vertex>\nvarying vec3 vO;\nvoid main() { vO = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}',
      fragmentShader: `uniform float op, t, flow, spd;\nvarying vec3 vO;\n#include <logdepthbuf_pars_fragment>
void main() { vec2 b = vec2(960.0 + vO.x, 540.0 - vO.y); float w = sin(t * spd * 0.37) * 12.0 * min(flow, 1.6), w2 = cos(t * spd * 0.29) * 12.0 * min(flow, 1.6);
  vec3 c = mix(${hexC('#1f125c')}, ${hexC('#26085a')}, smoothstep(300.0, 1300.0, b.x));
  c = mix(c, ${hexC('#5a07c4')}, 1.0 - smoothstep(0.0, 650.0, length((b - vec2(1550.0 + w, -250.0)) / vec2(2.0, 1.0))));
  c = mix(c, ${hexC('#7902fa')}, 1.0 - smoothstep(0.0, 540.0, length((b - vec2(150.0, 1050.0 + w2)) / vec2(2.6, 1.0))));
  c = mix(c, ${hexC('#964448')}, clamp((b.x - 1490.0 + w2) / 430.0, 0.0, 1.0) * smoothstep(430.0, 600.0, b.y) * (1.0 - smoothstep(1940.0, 2400.0, b.x)) * (1.0 - smoothstep(1100.0, 1500.0, b.y)));   // (fix pass: bounded to the board's corner; unbounded, it made a flat maroon wall a third of the screen wide in the orbit and the tilt-down)
  gl_FragColor = vec4(c, op);
#include <logdepthbuf_fragment>
}` });
    bd.mesh.renderOrder = -3; }

  V.unplate(6);
};
