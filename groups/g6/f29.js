/* Frame 29 · the dark side of the ring: the sphere rolls away from the camera down the long ramp into the back of the
   ring (G6, called from g6.js with its context G). A drift-length hold (133.85–134.35). Built: the real set, no plate.
   · SHARED with frame 30 and owned here (both first appear in the 28 → 29 move, from 128.3): the one straight ramp
     (11° down toward +z along D, the sphere's centre line through the ring centre C; station s → P(s); the sphere is at
     S29 = −12.5 at 134.1 and S30 = 10 at 137.2) and the one ring. Board 29 shows the ramp's upper part (RAMP_UP, s −61 → 0)
     and the ring's dark back; board 30 shows the lower part (RAMP_DN, s 0 → 34, unchanged from the animatic) and the
     ring's front, so the upper part shows until the sphere is through the ring (it rolls up behind the sphere into the
     ring, 134.9–136.3, so it is gone before the camera is round the front) and the lower from 134.45 (f30 grows it out
     of the ring). G.ring29 exposes them for f30.js (its
     anim runs after this one, so it can take over the lower half or restyle the ring's front).
   · The ring reads as a circle from BOTH hold cameras (the boards draw circles; the cameras are 55° apart). It is one
     slab whose axis is midway between the two hold views (27.5° off each), 0.8 thick. Its back face is solved so that from
     camera 29 its outline is exactly board 29's circles (outer r 285 at (359, 352), hole r 175), its front face so that
     from camera 30 its outline is exactly board 30's (outer r 390 at (1060, 216), hole r 259 at (1042, 222)). Each face
     is coloured from its own board: three concentric bands (inner rim, gradient band, outer band), each a smooth
     angle/radius field fitted to that board (Fourier in the angle), living and colour-locked at that hold. Board 30's
     bands lie on the board's own circles (group C polish, 2026-09-29, "frame 30's ring outer band is duller than board 30
     on the left": they are concentric about (1039, 221), not about the outer circle's centre, so the first fit had the left
     side's edges ~20 px off and its wide orange → rose band came out thin and dull; refitted as RB30B, see there). The walls
     (the tube's outer and inner sides) are dark violet, so the orbit 29 → 30 reads a chunky ring from the side.
   · The ramp: its two edges are fitted to board 29's wedge (the +x edge, screen-left at 29, and the −x edge, the long
     upper edge), a 0.6-thick slab. The top face takes board 29's colours where camera 29 sees it (orange → pink → blue
     toward the near right, a smooth field fitted to the board) and a lateral orange → mauve → blue further up the ramp;
     it fades into the dark as it enters the ring. The side and the violet wedge under it (a backdrop shape) share the
     board's violet.
   · The streak: board 29's translucent mauve trail on the ramp, here a light path running ahead of the sphere into the
     ring; the sphere rolls along it and swallows it. Its dark contact shadow rides beside it.
   · Board 29's backdrop, as pieces on a far wall beyond the ring (camera 29's side; board 30's look-alikes are f30's, on
     the other side): the maroon-cornered navy ground, the small tab, the square tile and the tall rounded tile, the band
     top right, the big indigo → magenta pill (the copy "THERE IS SO MUCH MORE TO ENHERTU" sits on it), the concentric ∩
     dome, the four bottom-left quarter-disc tiles and the violet column beside them. They fly in out of the depth as the
     camera cranes down (130.2–132.0) and fly off as it swings round the ring (134.45–135.3).
   The journey (holds, the sphere's path, camera keys, captions) stays in g6.js. */
export default (V, G) => {
  const { THREE, v3, D, N, C, P, h29, h30, PC } = G;
  const { mat, scene, anim } = V;
  const SH = V.S, Vec = THREE.Vector3, Xw = v3(1, 0, 0);
  V.unplate(29);
  const TK29 = h29.tk, TK30 = h30.tk;
  const f3 = x => (Math.abs(x) < 1e-9 ? 0 : x).toFixed(4);
  const vec = a => `vec3(${a.map(f3).join(', ')})`;
  const hexA = h => { const n = parseInt(h.slice(1), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; };
  const hexC = h => vec(hexA(h));

  /* ---------- board-coloured materials: the engine's shader, coloured by a field in a hold's board px ---------- */
  const hvpOf = h => { const hc = new THREE.PerspectiveCamera(h.fov, 16 / 9, 0.05, 4000); hc.matrixAutoUpdate = false;
    hc.matrixWorld.makeBasis(h.right, h.upv, h.fwd.clone().negate()).setPosition(h.pos); hc.matrixWorldInverse.copy(hc.matrixWorld).invert(); hc.updateProjectionMatrix();
    return new THREE.Matrix4().multiplyMatrices(hc.projectionMatrix, hc.matrixWorldInverse); };
  const HVP29 = hvpOf(h29), HVP30 = hvpOf(h30);
  // boardCol(vec2 b, float sl, vec3 w, float hw, vec3 nb) (GLSL) → colour at board px b (sl: the living slide, px; w: world
  // point; hw: its depth from the hold camera; nb: normal). The slide is zero at the hold's key instant (colour-locked).
  const boardMat = (glsl, o) => {
    const base = mat(['#7b2bf9'], { flat: true, side: o.side ?? THREE.DoubleSide });
    const per = o.per ?? 7.3, tk = o.tk ?? TK29;
    const u = { ...base.uniforms, hvp: { value: o.hvp || HVP29 }, bper: { value: per }, bph: { value: (Math.PI - 2 * Math.PI * tk / per) / 2 }, bamp: { value: o.amp ?? 14 } };
    const head = 'uniform mat4 hvp; uniform float bper, bph, bamp;\n' + glsl;
    const inj = `vec4 hq = hvp * vec4(vW, 1.0);
  float hwd = hq.w;
  vec2 bp = vec2((hq.x / max(hwd, 1e-3) * 0.5 + 0.5) * 1920.0, (0.5 - 0.5 * hq.y / max(hwd, 1e-3)) * 1080.0);
  float sl = bamp * min(flow, 1.6) * (sin(t * spd / bper * 6.2832 + bph) - sin(bph));
  gl_FragColor = vec4(boardCol(bp, sl, vW, hwd, normalize(vN)), op);`;
    const fs = base.fragmentShader.replace('#include <logdepthbuf_pars_fragment>', '#include <logdepthbuf_pars_fragment>\n' + head).replace('gl_FragColor = vec4(col * shade, op);', inj);
    if (fs === base.fragmentShader) throw new Error('f29: engine shader changed; boardMat could not hook it');
    return new THREE.ShaderMaterial({ uniforms: u, vertexShader: base.vertexShader, fragmentShader: fs, side: base.side, transparent: !!o.transparent, depthWrite: o.depthWrite ?? true });
  };
  // a 3-stop gradient (as the pieces' grad) in GLSL
  const g3 = (name, cols) => `vec3 ${name}(float g) { g = clamp(g, 0.0, 1.0); return g < 0.5 ? mix(${hexC(cols[0])}, ${hexC(cols[1])}, g * 2.0) : mix(${hexC(cols[1])}, ${hexC(cols[2])}, g * 2.0 - 1.0); }\n`;

  /* ---------- the ring's colours: three bands per board, each c(angle, radius) = Fourier (3 harmonics) + a radial slope,
     fitted to the board (RGB 0–255; terms 1, cos a, sin a, cos 2a, sin 2a, cos 3a, sin 3a, q, q cos a, q sin a; q = radius
     across the band, −1 … 1) ---------- */
  const RB29 = [[[175, 210], [[176.41, 64.38, 124.61], [-27.61, -30.78, 76.32], [-65.13, -50.48, 96.25], [23.62, 12.78, -13.16], [-18.69, 3.06, 2.81], [-4.8, -2.95, 14.01], [-3.58, -0.76, -3.46], [35.0, 21.23, -20.8], [-2.3, -3.3, -2.73], [-54.36, -28.08, -4.69]]],
    [[210, 248], [[146.23, 50.74, 121.45], [-9.65, -2.53, 6.79], [-3.66, -2.2, 3.74], [67.79, 45.07, -61.59], [-5.96, -3.89, 5.14], [1.32, 2.35, -1.64], [-3.84, -2.53, 3.26], [15.41, 10.28, -13.3], [2.26, 2.36, -3.11], [-5.3, -3.47, 2.84]]],
    [[248, 286], [[111.54, 38.66, 111.61], [86.02, 46.81, -18.16], [-0.26, 0.8, -2.78], [26.93, 23.86, -48.01], [4.33, 3.05, -2.63], [6.05, 3.99, -4.76], [-2.7, -0.7, -0.51], [-7.96, -1.35, -4.98], [11.6, 6.57, -2.69], [17.28, 10.66, -9.91]]]];
  const RB30 = [[[262, 300], [[185.42, 73.87, 118.42], [-30.98, -31.83, 63.54], [-83.55, -62.73, 96.13], [20.06, 14.7, -36.18], [2.6, 16.33, -21.24], [4.92, 5.17, -0.67], [3.89, 3.37, -9.44], [-0.32, 4.31, -35.43], [-5.52, 14.81, -47.22], [66.25, 36.28, -68.96]]],
    [[300, 345], [[145.94, 54.43, 123.18], [-8.7, -3.42, 7.79], [-24.76, -14.03, 27.62], [76.46, 48.3, -76.18], [10.2, 10.54, -14.11], [4.81, 4.61, -1.0], [4.77, -1.09, -2.93], [-8.53, -6.65, 11.6], [32.76, 25.17, -36.0], [25.56, 27.78, -34.04]]],
    [[345, 392], [[154.33, 61.87, 106.04], [18.43, 15.16, -10.57], [-5.61, 5.1, 0.64], [70.35, 42.19, -61.69], [4.28, 2.25, -0.98], [-16.69, -9.69, 12.17], [-1.37, -3.94, 0.75], [-10.95, -3.24, -6.2], [20.95, 10.69, -2.6], [-17.25, -9.38, 7.42]]]];
  /* board 30's face, refitted (group C polish, 2026-09-29: "frame 30's ring outer band is duller than board 30 on the left").
     Board 30's bands are NOT concentric with its outer circle: measured on the board's edges, the hole (r 259.8), the rim's
     edge (r 301.1) and the gradient band's edge (r 365.6) are concentric about (1039.35, 220.7), and only on the right does
     an outer band run on to r 417.4 (on the left the ring ends at the gradient band's edge). The first fit (RB30, above,
     kept for reference) put its band edges at 300 / 345 about the outer circle's centre (1060.39, 215.68), ~20 px off on the
     left, so there the rim's bright orange was cut short and the wide orange → rose band was fitted as a thin, dull one.
     RB30B: the three bands on the board's own circles, each c(angle, q) = Fourier (3 harmonics) + (q, q²) × low harmonics,
     least-squares fitted to the board where it shows the ring (the triangle, the pale border line and ±3 px round each edge
     masked), and held near the first fit where the board hides the ring (the top, off frame; the bottom, behind the
     triangle), so the orbit round to 30 sees much the same ring. The outer band is the board's on the right only (weight 1
     from −50° to 40°, easing out over the hidden top and bottom, gone on the left). Mean error on the board 9.7 → 3.1 (left
     arc 11.7 → 2.5); scratch groupC/g6/ring/fit.py. Terms: 1, cos a, sin a, cos 2a, sin 2a, cos 3a, sin 3a, q, q cos a,
     q sin a, q cos 2a, q sin 2a, q², q² cos a, q² sin a. */
  const RB30B = { c: [1039.35, 220.7], w3: [[40, 80], [50, 90]], bands: [
    [[259.8, 301.1], [[183.85, 70.76, 128.87], [-33.82, -34.89, 88.68], [-83.55, -59.06, 95.29], [28.88, 9.52, -20.57], [-20.25, 3.34, 4.75], [-0.31, -1.61, 9.20], [-3.45, -1.35, -0.02], [3.19, -2.88, -0.60], [1.00, -0.11, -0.26], [12.24, 4.45, -7.96], [-2.98, 4.49, -0.27], [0.62, -1.10, 1.74], [-4.15, -0.31, 0.10], [1.49, 0.43, -3.43], [1.47, 1.12, -3.97]]],
    [[301.1, 365.6], [[138.68, 48.05, 129.87], [-11.79, -3.97, 8.62], [-6.57, 1.65, 8.54], [77.94, 48.66, -72.31], [0.96, 0.69, -0.55], [0.73, 1.72, -1.48], [4.64, 0.33, -5.23], [17.84, 13.26, -20.90], [2.36, 2.28, -1.98], [2.95, 4.24, -7.11], [11.60, 6.41, -4.95], [1.95, 1.11, -1.02], [1.53, 1.97, -4.16], [3.92, 2.72, -1.13], [-1.58, -0.70, -0.42]]],
    [[365.6, 417.4], [[131.67, 51.69, 121.45], [54.31, 33.43, -34.97], [-15.55, 16.84, 7.40], [51.99, 29.52, -50.70], [5.61, -13.89, -3.58], [-10.52, -3.93, 9.48], [2.13, 3.71, -0.09], [-18.05, -0.78, 7.88], [28.67, 6.04, -19.26], [-29.99, -15.14, -1.16], [0.65, 2.61, 1.20], [15.98, 8.37, 0.12], [-6.07, 6.81, 7.70], [7.27, -7.77, -9.06], [-0.02, 0.52, -3.72]]]] };
  const ringGLSL30 = (name, R) => {
    const T = ['1.0', 'cos(a)', 'sin(a)', 'cos(2.0 * a)', 'sin(2.0 * a)', 'cos(3.0 * a)', 'sin(3.0 * a)', 'q', 'q * cos(a)', 'q * sin(a)', 'q * cos(2.0 * a)', 'q * sin(2.0 * a)', 'q * q', 'q * q * cos(a)', 'q * q * sin(a)'];
    const band = (k, [[r0, r1], c]) => `vec3 ${name}_${k}(float a, float r) { float q = clamp((r - ${f3((r0 + r1) / 2)}) / ${f3((r1 - r0) / 2)}, -1.3, 1.3);\n  return ${c.map((cc, i) => `${vec(cc.map(x => x / 255))} * ${T[i]}`).join(' + ')}; }\n`;
    const rR = R.bands[0][0][1], rS = R.bands[1][0][1], [[t0, t1], [b0, b1]] = R.w3;   // the rim's and the gradient band's outer edges
    return R.bands.map((b, k) => band(k, b)).join('') +
      `vec3 ${name}(vec2 b, float sl) { vec2 d = b - vec2(${f3(R.c[0])}, ${f3(R.c[1])}); float r = length(d), a0 = atan(-d.y, d.x), a = a0 + sl * 0.004, dg = degrees(a0);
  float w3 = dg >= 0.0 ? 1.0 - smoothstep(${f3(t0)}, ${f3(t1)}, dg) : 1.0 - smoothstep(${f3(b0)}, ${f3(b1)}, -dg);
  vec3 c = mix(${name}_0(a, r), ${name}_1(a, r), smoothstep(${f3(rR - 1.5)}, ${f3(rR + 1.5)}, r));
  c = mix(c, ${name}_2(a, r), w3 * smoothstep(${f3(rS - 1.5)}, ${f3(rS + 1.5)}, r));
  return clamp(c, 0.0, 1.0); }\n`;
  };
  const ringGLSL = (name, cx, cy, B) => {
    const band = (k, [[r0, r1], c]) => { const rm = (r0 + r1) / 2, w = (r1 - r0) / 2, T = ['1.0', 'cos(a)', 'sin(a)', 'cos(2.0 * a)', 'sin(2.0 * a)', 'cos(3.0 * a)', 'sin(3.0 * a)', 'q', 'q * cos(a)', 'q * sin(a)'];
      return `vec3 ${name}_${k}(float a, float r) { float q = clamp((r - ${f3(rm)}) / ${f3(w)}, -1.3, 1.3);\n  return ${c.map((cc, i) => `${vec(cc.map(x => x / 255))} * ${T[i]}`).join(' + ')}; }\n`; };
    return B.map((b, k) => band(k, b)).join('') +
      `vec3 ${name}(vec2 b, float sl) { vec2 d = b - vec2(${f3(cx)}, ${f3(cy)}); float r = length(d), a = atan(-d.y, d.x) + sl * 0.004;
  vec3 c = mix(${name}_0(a, r), ${name}_1(a, r), smoothstep(${f3(B[1][0][0] - 1.5)}, ${f3(B[1][0][0] + 1.5)}, r));
  c = mix(c, ${name}_2(a, r), smoothstep(${f3(B[2][0][0] - 1.5)}, ${f3(B[2][0][0] + 1.5)}, r));
  return clamp(c, 0.0, 1.0); }\n`;
  };

  /* ---------- the ring: one slab, axis midway between the two hold views, each face solved against its own board ---------- */
  const nAx = h29.fwd.clone().sub(h30.fwd).normalize();                 // points from camera 29's side toward camera 30's
  const HB = 0.4, NA = 192;
  const e1 = new Vec().crossVectors(v3(0, 1, 0), nAx).normalize(), e2 = new Vec().crossVectors(nAx, e1).normalize();
  const rayOf = (h, px, py) => h.fwd.clone().addScaledVector(h.right, (px - 960) / 540 * h.tanV).addScaledVector(h.upv, (540 - py) / 540 * h.tanV);
  const onPlane = (h, px, py, Q) => { const r = rayOf(h, px, py), k = Q.clone().sub(h.pos).dot(nAx) / r.dot(nAx); return h.pos.clone().addScaledVector(r, k); };
  // a board circle (hold h, centre, radius px) back-projected onto the face plane through Q: its in-plane radius at NA
  // even angles round Q (the curve is star-shaped round Q)
  const loop = (h, cx, cy, R, Q) => {
    const pts = [];
    for (let i = 0; i < 1440; i++) { const a = i / 1440 * 2 * Math.PI, p = onPlane(h, cx + R * Math.cos(a), cy - R * Math.sin(a), Q).sub(Q); pts.push([Math.atan2(p.dot(e2), p.dot(e1)), p.length()]); }
    pts.sort((x, y) => x[0] - y[0]);
    const ext = [[pts.at(-1)[0] - 2 * Math.PI, pts.at(-1)[1]], ...pts, [pts[0][0] + 2 * Math.PI, pts[0][1]]];
    const out = [];
    for (let j = 0; j <= NA; j++) { const phi = -Math.PI + j / NA * 2 * Math.PI; let k = 1; while (k < ext.length - 1 && ext[k][0] < phi) k++;
      const [a0, r0] = ext[k - 1], [a1, r1] = ext[k], u = (phi - a0) / Math.max(1e-9, a1 - a0), rho = r0 + (r1 - r0) * u;
      out.push(Q.clone().addScaledVector(e1, rho * Math.cos(phi)).addScaledVector(e2, rho * Math.sin(phi))); }
    return out;
  };
  const Qb = C.clone().addScaledVector(nAx, -HB), Qf = C.clone().addScaledVector(nAx, HB);
  const bOut = loop(h29, 358.86, 351.75, 285.2, Qb), bIn = loop(h29, 358.86, 353.0, 175, Qb);
  const fOut = loop(h30, 1060.39, 215.68, 390, Qf), fIn = loop(h30, 1042, 222, 259, Qf);
  const strip = (A, B) => { const pos = [], idx = []; A.forEach((p, i) => { pos.push(...p.toArray(), ...B[i].toArray()); if (i) { const k = 2 * i; idx.push(k - 2, k, k - 1, k - 1, k, k + 1); } });
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g; };
  const rg = new THREE.Group(); scene.add(rg);
  const backM = boardMat(ringGLSL('ring29', 358.86, 351.75, RB29) + 'vec3 boardCol(vec2 b, float sl, vec3 w, float hw, vec3 nb) { return ring29(b, sl); }\n', { hvp: HVP29, tk: TK29 });
  const frontM = boardMat(ringGLSL30('ring30', RB30B) +'vec3 boardCol(vec2 b, float sl, vec3 w, float hw, vec3 nb) { return ring30(b, sl); }\n', { hvp: HVP30, tk: TK30 });
  // the walls: dark violet, lighter toward the top, always (the user's new rule, 21:50: keep the 3D depth visible and don't
  // switch rims off round a hold; at each key instant a thin sliver of the wall shows past the tilted face as the ring's rim)
  const wallM = boardMat(g3('bg29', ['#581f36', '#2e114a', '#20125d']) + `vec3 boardCol(vec2 b, float sl, vec3 w, float hw, vec3 nb) {
  vec2 A = vec2(17.0, 41.0), B = vec2(264.0, 381.0), d = B - A;
  vec3 at29 = bg29(dot(b - A, d) / dot(d, d));
  vec3 vio = mix(${hexC('#1e0860')}, ${hexC('#5a18c8')}, clamp((w.y - ${f3(C.y - 4.2)}) / 8.4, 0.0, 1.0));
  return vio; }\n`, { hvp: HVP29, tk: TK29 });   // (the new rule: no time switch round the holds; the rim stays visible)
  const boreM = mat(['#1e0850', '#28095e'], { flat: true, side: THREE.DoubleSide });
  const ringBack = new THREE.Mesh(strip(bIn, bOut), backM), ringFront = new THREE.Mesh(strip(fIn, fOut), frontM);
  const ringWall = new THREE.Mesh(strip(bOut, fOut), wallM), ringBore = new THREE.Mesh(strip(bIn, fIn), boreM);
  [ringBack, ringFront, ringWall, ringBore].forEach(m => rg.add(m));
  const ringM = backM;

  /* ---------- the ramp: edges fitted to board 29's wedge; a 0.6-thick slab from the top end (s −61) into the ring ---------- */
  const rampOn = [128.3, 139.6];
  const hw = s => s < 0 ? Math.min(0.072 * (4.9 - s), 2.6) : Math.min(0.24 * (s + 1.5), 9);   // the animatic's half-width (kept for RAMP_DN / f30)
  const A0 = 0.819, A1 = -0.0293, B0 = 0.702, B1 = -0.0546, TH = 0.6;   // +x half-width A0 + A1·s (screen-left at 29), −x half-width B0 + B1·s
  const aL = s => A0 + A1 * s, bR = s => B0 + B1 * s;
  const rampGeo = (s0, s1, hw, th) => {                                // the animatic's symmetric slab (kept for f30.js)
    const q = (s, side, dn) => P(s).addScaledVector(N, -1 - dn * th).addScaledVector(Xw, side * hw(s));
    const A = [], B = [], Ab = [], Bb = [];
    for (let s = s0; s <= s1 + 1e-6; s += 0.5) { A.push(q(s, -1, 0)); B.push(q(s, 1, 0)); Ab.push(q(s, -1, 1)); Bb.push(q(s, 1, 1)); }
    return [strip(A, B), strip(A, Ab), strip(B, Bb)];
  };
  const S0 = -61, S1 = 0;
  const qU = (s, side, dn) => P(s).addScaledVector(N, -1 - dn * TH).addScaledVector(Xw, side > 0 ? aL(s) : -bR(s));
  // the upper ramp's rows run from its far end sa (S0 at first) to the ring (S1); it rolls up behind the sphere into the
  // ring once the sphere is nearly through (upAt, below), instead of dropping away or vanishing on screen
  const NR = 122, rowsOf = sa => { const A = [], B = [], Cm = [], Dp = [];
    for (let i = 0; i <= NR; i++) { const s = sa + (S1 - sa) * i / NR; A.push(qU(s, -1, 0)); B.push(qU(s, 1, 0)); Cm.push(qU(s, -1, 1)); Dp.push(qU(s, 1, 1)); }
    return [A, B, Cm, Dp]; };
  const [Am, Ap, Bm, Bp] = rowsOf(S0);
  const cap = s => strip([qU(s, -1, 0), qU(s, 1, 0)], [qU(s, -1, 1), qU(s, 1, 1)]);
  // the tip: the ramp runs on 2.5 past the ring plane into the tube's dark (board 29 shows it vanishing inside the ring);
  // it hides when the lower half (RAMP_DN, the same plane) appears at 134.45, so the two never overlap
  const S2 = 4.0, Tm = [], Tp = [], TBm = [], TBp = [];
  for (let s = S1; s <= S2 + 1e-6; s += 0.25) { Tm.push(qU(s, -1, 0)); Tp.push(qU(s, 1, 0)); TBm.push(qU(s, -1, 1)); TBp.push(qU(s, 1, 1)); }
  // top face: board 29's field where camera 29 sees it; a lateral orange → mauve → blue further up; dark into the ring
  const TOP = { box: [270, 380, 1370, 1080], T: '00010203101112202130', c: [[147.26, 34.04, 127.0], [-11.48, -13.59, 50.98], [-143.66, -13.05, -162.4], [-8.28, -19.77, 229.52], [950.52, 1011.07, -821.98], [397.38, -130.83, 146.82], [71.42, -58.15, -433.11], [-2312.09, -2228.02, 1611.36], [-534.47, 273.92, 573.7], [1428.88, 1161.65, -1058.41]] };
  const polyGLSL = (name, F) => { const [x0, y0, x1, y1] = F.box, terms = [];
    for (let k = 0; k < F.T.length / 2; k++) { const i = +F.T[2 * k], j = +F.T[2 * k + 1]; const m = [...Array(i).fill('u'), ...Array(j).fill('v')].join(' * ');
      terms.push(`${vec(F.c[k].map(x => x / 255))}${m ? ' * ' + m : ''}`); }
    return `vec3 ${name}(vec2 b) { vec2 q = clamp((b - vec2(${f3(x0)}, ${f3(y0)})) / vec2(${f3(x1 - x0)}, ${f3(y1 - y0)}), 0.0, 1.0); float u = q.x, v = q.y;\n  return clamp(${terms.join(' + ')}, 0.0, 1.0); }\n`; };
  const stationGLSL = `float stationOf(vec3 w) { return dot(w - ${vec(C.toArray())}, ${vec(D.toArray())}); }\nfloat lateralOf(vec3 w) { return w.x - ${f3(C.x)}; }\n`;
  const NAVY = '#25085a';
  const topM = boardMat(polyGLSL('f_top', TOP) + g3('farLat', ['#c65545', '#7a2a86', '#2a0cc8']) + stationGLSL + `
vec3 boardCol(vec2 b, float sl, vec3 w, float hw, vec3 nb) {
  float s = stationOf(w), x = lateralOf(w);
  float aL = ${f3(A0)} + ${f3(A1)} * s, bR = ${f3(B0)} + ${f3(B1)} * s;
  float u = (aL - x) / (aL + bR);
  vec3 far = farLat(u + 0.06 * sl / 14.0);
  vec3 near = f_top(b + vec2(sl, 0.5 * sl));
  float wf = hw < 0.5 ? 1.0 : 1.0 - smoothstep(-23.0, -19.5, s);
  vec3 c = mix(near, far, wf);
  return mix(c, ${hexC('#221258')}, smoothstep(0.6, 3.6, s));
}\n`, { hvp: HVP29, tk: TK29 });
  // the violet side (and the wedge under it): board 29's violet, lighter toward the near end
  const VIO = ['#4e0bb2', '#6616a2', '#7c238d'];
  const sideGLSL = g3('vio', VIO) + `vec3 boardCol(vec2 b, float sl, vec3 w, float hw, vec3 nb) {
  vec2 A = vec2(380.0, 640.0), B = vec2(600.0, 1080.0), d = B - A;
  return hw < 0.5 ? ${hexC(VIO[0])} : vio(dot(b + vec2(0.0, sl) - A, d) / dot(d, d)); }\n`;
  const sideM = boardMat(sideGLSL, { hvp: HVP29, tk: TK29 });
  const underM = mat(['#1e0a58', '#3a0e8c'], { side: THREE.DoubleSide });
  const mk = (g, m) => { const x = new THREE.Mesh(g, m); scene.add(x); return x; };
  // [top, −x side, +x side, bottom, top-end cap, ring-end cap] (the first three as in the animatic)
  const rampUp = [mk(strip(Am, Ap), topM), mk(strip(Am, Bm), underM), mk(strip(Ap, Bp), sideM), mk(strip(Bm, Bp), underM), mk(cap(S0), underM)];
  const setStrip = (g, A, B) => { const a = g.attributes.position; A.forEach((p, i) => { a.setXYZ(2 * i, p.x, p.y, p.z); a.setXYZ(2 * i + 1, B[i].x, B[i].y, B[i].z); }); a.needsUpdate = true; g.computeVertexNormals(); };
  let lastSA = S0;
  const upAt = sa => { if (Math.abs(sa - lastSA) < 1e-4) return; lastSA = sa; const [A, B, Cm, Dp] = rowsOf(sa);
    setStrip(rampUp[0].geometry, A, B); setStrip(rampUp[1].geometry, A, Cm); setStrip(rampUp[2].geometry, B, Dp); setStrip(rampUp[3].geometry, Cm, Dp);
    setStrip(rampUp[4].geometry, [A[0], B[0]], [Cm[0], Dp[0]]); };
  rampUp.forEach(m => { m.frustumCulled = false; });
  // the roll-up: the far end follows smooth(134.9 → 136.3) from S0 to just inside the ring (−0.35), never closer than 1.6
  // behind the sphere's contact; the ramp (and the cap closing it at the ring) goes once it is inside the ring
  const ROLL = [134.9, 136.3], SA_END = -0.35;
  const capRing = mk(cap(S1), boreM);                                  // closes the ramp at the ring plane once the tip has gone
  const tipSideM = boardMat(g3('vio', VIO) + stationGLSL + `vec3 boardCol(vec2 b, float sl, vec3 w, float hw, vec3 nb) {
  vec2 A = vec2(380.0, 640.0), B = vec2(600.0, 1080.0), d = B - A;
  vec3 c = hw < 0.5 ? ${hexC(VIO[0])} : vio(dot(b + vec2(0.0, sl) - A, d) / dot(d, d));
  return mix(c, ${hexC('#221258')}, smoothstep(0.6, 3.6, stationOf(w))); }\n`, { hvp: HVP29, tk: TK29 });
  const rampTip = [mk(strip(Tm, Tp), topM), mk(strip(Tp, TBp), tipSideM), mk(strip(Tm, TBm), underM), mk(cap(S2), boreM)];
  const upM = topM;
  // the lower half (board 30's triangle): unchanged from the animatic (f30.js owns its look)
  const RAMP_DN = rampGeo(0, 34, hw, 0.45);
  const dnM = mat(['#ff9a10', '#e86a70', '#6a28e0'], { axis: [1, 0, 0], lo: C.x - 7, hi: C.x + 7, side: THREE.DoubleSide });
  const dnSideM = mat(['#9a2bd0', '#5a14c0'], { side: THREE.DoubleSide });
  const rampDn = [mk(RAMP_DN[0], dnM), mk(RAMP_DN[1], dnSideM), mk(RAMP_DN[2], dnSideM)];

  /* ---------- the streak: board 29's mauve trail, a light path ahead of the sphere into the ring, and its shadow ---------- */
  const hook = (base, head, body) => { const fs = base.fragmentShader.replace('#include <logdepthbuf_pars_fragment>', '#include <logdepthbuf_pars_fragment>\n' + head).replace('gl_FragColor = vec4(col * shade, op);', body);
    if (fs === base.fragmentShader) throw new Error('f29: engine shader changed; the streak could not hook it');
    return new THREE.ShaderMaterial({ uniforms: base.uniforms, vertexShader: base.vertexShader, fragmentShader: fs, transparent: true, depthWrite: false, side: THREE.FrontSide }); };
  const tubeG = new THREE.CylinderGeometry(0.62, 1, 1, 48, 1, true);   // tapers toward the ring
  tubeG.rotateX(Math.PI / 2); tubeG.translate(0, 0, 0.5);               // radius 1 at the sphere, local z 0 → 1
  const strM = hook(mat(['#a04ecd']), `uniform vec3 nUp;\n`, `float z = clamp(vO.z, 0.0, 1.0);
  float al = op * smoothstep(0.0, 0.04, z) * (1.0 - smoothstep(0.62, 1.0, z));
  vec3 nb = normalize(vN); float lo = clamp(-dot(nb, nUp), 0.0, 1.0);
  gl_FragColor = vec4(mix(vec3(0.66, 0.34, 0.80), vec3(0.42, 0.20, 0.55), lo), al);`);
  strM.uniforms.nUp = { value: N.clone() };
  const streak = new THREE.Mesh(tubeG, strM); streak.renderOrder = 3; scene.add(streak);
  const shG = new THREE.PlaneGeometry(1, 1); shG.translate(0, 0.5, 0);                               // local y 0 → 1 along the ramp
  const shM = hook(mat(['#2a0e04']), '', `float y = clamp(vO.y, 0.0, 1.0), xx = abs(vO.x) * 2.0;
  float al = op * smoothstep(0.0, 0.08, y) * (1.0 - smoothstep(0.35, 1.0, y)) * (1.0 - smoothstep(0.55, 1.0, xx));
  gl_FragColor = vec4(${hexC("#3a1804")}, al);`);
  const shadow = new THREE.Mesh(shG, shM); shadow.renderOrder = 2; scene.add(shadow);
  const qStr = new THREE.Quaternion().setFromUnitVectors(v3(0, 0, 1), D);
  const qSh = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(Xw.clone().negate(), D, N));   // local x → −x, y → along D, z → up (N) (right-handed)
  const STR_R = 0.48, STR_DN = 0.3, STR_X = -0.18, STR_IO = [[132.7, 133.5], [135.55, 135.9]];

  /* ---------- board 29's backdrop: pieces on a far wall beyond the ring (camera 29's side) ---------- */
  const rrc = (x0, y0, x1, y1, [tl, tr, br, bl], at) => {             // rectangle in board px with per-corner radii → a shape round at
    const s = new THREE.Shape(), X = x => x - at[0], Y = y => at[1] - y;
    s.moveTo(X(x0 + tl), Y(y0)); s.lineTo(X(x1 - tr), Y(y0)); if (tr) s.absarc(X(x1 - tr), Y(y0 + tr), tr, Math.PI / 2, 0, true);
    s.lineTo(X(x1), Y(y1 - br)); if (br) s.absarc(X(x1 - br), Y(y1 - br), br, 0, -Math.PI / 2, true);
    s.lineTo(X(x0 + bl), Y(y1)); if (bl) s.absarc(X(x0 + bl), Y(y1 - bl), bl, -Math.PI / 2, -Math.PI, true);
    s.lineTo(X(x0), Y(y0 + tl)); if (tl) s.absarc(X(x0 + tl), Y(y0 + tl), tl, Math.PI, Math.PI / 2, true);
    return s; };
  const box = (x0, y0, x1, y1, r = [0, 0, 0, 0]) => { const at = [(x0 + x1) / 2, (y0 + y1) / 2]; return { shape: rrc(x0, y0, x1, y1, r, at), at }; };
  const inF = (a, d = 1.0, dz = 40) => ({ type: 'fly', t: [a, a + d], dz, ease: 'expo.out' });
  const outF = (a, d = 0.6, dz = 40) => ({ type: 'fly', t: [a, a + d], dz, ease: 'power2.in' });
  const pieces = [];
  const BP = (spec) => { const pc = PC({ hold: 29, thick: 1.2, ...spec }); pieces.push(pc); return pc; };
  // the ground: navy, maroon in the top-left corner (depth 118: the old plate's place; big enough for the crane down)
  const ground = BP({ ...box(-4200, -2800, 5400, 3600), depth: 118, thick: 0.5, drift: 0, grad: { from: [17, 41], to: [264, 381], cols: ['#581f36', '#2e114a', '#20125d'] },
    in: { type: 'fade', t: [130.6, 131.6] }, out: { type: 'fade', t: [134.55, 135.25] } });
  ground.mesh.renderOrder = -2;   // always first: fading, it was sorted by its far centre and painted over the fading band (135.1)
  // top: the small tab, the square tile, the tall rounded tile, the band
  BP({ ...box(270, -260, 415, 75), depth: 84, grad: { from: [277, 15], to: [369, 45], cols: ['#5a01ff', '#e25a5a', '#e27d01'] }, in: inF(130.55), out: outF(134.5) });
  BP({ ...box(600, 205, 832, 455), depth: 86, grad: { from: [830, 285], to: [627, 375], cols: ['#f5761a', '#7825db', '#2a069f'] }, in: inF(130.45), out: outF(134.55) });
  BP({ ...box(820, -5, 1060, 455, [90, 0, 240, 0]), depth: 83, grad: { from: [1006, 316], to: [848, 97], cols: ['#0d0097', '#9029d0', '#ff8909'] }, in: inF(130.35), out: outF(134.6) });
  // the band: board 29 runs pink → orange → violet → indigo left to right; two overlapping pieces (they meet in the orange,
  // so the join can't show; the left one in front)
  BP({ ...box(1060, -220, 1300, 150), depth: 89.9, grad: { from: [1080, 80], to: [1300, 80], cols: ['#f7477f', '#f65c55', '#f36e26'] }, in: inF(130.25), out: outF(134.65) });
  BP({ ...box(1260, -220, 1990, 150), depth: 90, grad: { from: [1300, 80], to: [1680, 80], cols: ['#f36e26', '#8f3bd4', '#5005b0'] }, in: inF(130.25), out: outF(134.65) });
  // right: the big pill (the copy sits on it)
  BP({ ...box(990, 190, 1940, 800, [305, 220, 220, 305]), depth: 88, grad: { from: [1057, 585], to: [1897, 496], cols: ['#270d6d', '#4c15a9', '#b70dee'] }, in: inF(130.3), out: outF(134.7) });   // its right end is a rounded rectangle (r ≈ 220), as the board's, not a semicircle
  // bottom right: the concentric ∩ dome (outer band, gradient dome, hole)
  BP({ shape: SH.archFill(750, 575), at: [1545, 1265], depth: 80, grad: '#3a0c9c', in: inF(130.5), out: outF(134.75) });
  BP({ shape: SH.archFill(610, 500), at: [1525, 1265], depth: 79.4, thick: 0.9, grad: { from: [1734, 946], to: [1352, 906], cols: ['#6a28ff', '#d33fb2', '#fc654d'] }, in: inF(130.6), out: outF(134.75) });
  BP({ shape: SH.archFill(210, 295), at: [1515, 1265], depth: 78.8, thick: 0.9, grad: '#370f9d', in: inF(130.7), out: outF(134.8) });
  // bottom left: the four quarter-disc tiles and the violet column beside them
  BP({ shape: SH.poly([[150, 684], [380, 684], [392, 735], [412, 785], [432, 835], [452, 885], [472, 935], [480, 1260], [150, 1260]], [320, 950]), at: [320, 950], depth: 78, drift: 0,
    grad: { c: [360, 1071], r: 412, cols: ['#6900f7', '#630db5', '#22115f'] }, in: inF(130.75), out: outF(134.5) });
  BP({ ...box(-60, 695, 170, 945, [0, 0, 0, 150]), depth: 76.5, grad: { from: [37, 818], to: [146, 807], cols: ['#802fe9', '#c8576f', '#f67613'] }, in: inF(130.85), out: outF(134.5) });
  BP({ shape: SH.qdisc(245, 'tr'), at: [170, 945], depth: 76.8, grad: { from: [274, 938], to: [274, 715], cols: ['#f63a3f', '#f26422', '#e77420'] }, in: inF(130.95), out: outF(134.55) });
  BP({ ...box(-60, 945, 170, 1260), depth: 76.6, grad: { from: [88, 1070], to: [87, 951], cols: ['#ef6226', '#eb6e21', '#e97220'] }, in: inF(131.0), out: outF(134.55) });
  BP({ shape: SH.qdisc(235, 'tr'), at: [170, 1180], depth: 76.9, grad: { c: [126, 951], r: 258, cols: ['#feb100', '#fc8006', '#5f1eff'] }, in: inF(131.05), out: outF(134.6) });
  // the violet wedge under the ramp's +x side (the board's big violet side face): just behind the ring, flat at the hold
  const wedge = BP({ shape: SH.poly([[288, 352], [520, 640], [900, 1240], [480, 1240], [472, 935], [452, 885], [432, 835], [412, 785], [392, 735], [372, 685]], [450, 800]), at: [450, 800],
    depth: 28, thick: 0.35, drift: 0, grad: { from: [380, 640], to: [600, 1080], cols: VIO }, in: inF(131.1, 0.9, 10), out: outF(134.45, 0.5, 12) });

  G.ring29 = { rampOn, hw, rampGeo, rampUp, rampDn, upM, dnM, sideM, rg, ringM,   // as in the animatic, for f30.js
    ring: { axis: nAx, HB, back: ringBack, front: ringFront, wall: ringWall, bore: ringBore, backM, frontM, wallM, boreM, Qb, Qf },
    ramp: { aL, bR, TH, topM, dnSideM, tip: rampTip, capRing }, streak, shadow, wedge, pieces, boardMat, HVP29, HVP30 };

  anim((t, ball) => {
    // ring + ramp only from the crane down to 29 (and on through 30)
    const on = t > rampOn[0] && t < rampOn[1];
    // the upper half rolls up behind the sphere into the ring (it is gone, inside the ring, before the camera is round the front)
    const sb0 = ball && ball.p ? ball.p.clone().sub(C).dot(D) : -12.5;
    const sa = Math.max(S0, Math.min(sb0 - 1.6, S0 + (SA_END - S0) * G.smooth((t - ROLL[0]) / (ROLL[1] - ROLL[0]))));
    const upOn = on && t < ROLL[1] + 0.02 && sa < SA_END + 0.05;
    if (upOn) upAt(sa);
    rampUp.forEach(m => { m.visible = upOn; }); rampTip.forEach(m => { m.visible = on && t < 134.45; }); capRing.visible = upOn && t >= 134.45;
    rampDn.forEach(m => { m.visible = on && t > 134.45; }); rg.visible = on;
    // the streak runs from the sphere to the ring; it fades in as the camera settles behind the sphere and is swallowed
    const a = Math.min(G.smooth((t - STR_IO[0][0]) / (STR_IO[0][1] - STR_IO[0][0])), 1 - G.smooth((t - STR_IO[1][0]) / (STR_IO[1][1] - STR_IO[1][0])));
    const sb = ball && ball.p ? ball.p.clone().sub(C).dot(D) : -12.5, L = -0.2 - sb;
    streak.visible = shadow.visible = a > 0.002 && L > 0.3;
    if (streak.visible) {
      strM.uniforms.op.value = 0.72 * a;
      streak.position.copy(P(sb)).addScaledVector(N, -STR_DN).addScaledVector(Xw, STR_X); streak.quaternion.copy(qStr); streak.scale.set(STR_R, STR_R, L);
      shM.uniforms.op.value = 0.62 * a * G.smooth((L - 2.5) / 3);
      shadow.position.copy(P(sb + 1.3)).addScaledVector(N, -0.985).addScaledVector(Xw, 0.4); shadow.quaternion.copy(qSh); shadow.scale.set(0.62, Math.min(4.2, L - 1.3), 1);
    }
  });
};
