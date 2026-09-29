/* Frame 19 · the U-turn seen from above: top-down hold (fov 26; screen-right = world +z, screen-up = world +x); the sphere
   rounds the bend (G4, called from g4.js with its context G). Built: the real set, no plate.
   · THE PLATFORM (this file owns it): one floor slab whose top face is the U's floor, from under the swirl (z = Z_END, just
     past where hold 18's camera would start to see a floor) to past hold 19's right edge, and from the lip (x = G.xEdge,
     frame 20's edge; its wall and chute below it belong to f20.js) to past hold 19's top edge. Everything on it is a floor
     inlay, a real slab lying flat, laid out by board 19 px so that from hold 19's camera it covers its board shape exactly;
     each sits at its own height (≥ 0.05 apart, in the board's layering), so the moves show the steps and the parallax.
     Near the frame the slabs' sides run along hold 19's view rays (edge-on from that camera: flat at the hold), and
     vertical further out, where the lip is (a clean vertical edge for the 'over the edge' tilt).
   · THE TRACK: the U band (the sphere rolls on its top, 1 below the ball centre G.yF), the board's thick flat U: upper arm
     y 119–351, the bend (outer r 351.5, inner r 119 round (655, 470)), lower arm y 589–822. Off the frame its arms run on:
     the upper one back to the platform's end under the swirl (the sphere lands on it at G.PL), the lower one to a quarter
     turn (radius G.RT, as the sphere's route) and straight to the lip. It stands 0.42 above the platform, so at floor level
     (18 → 19) and in the tilt (19 → 20) it reads as a real track. The top-left shape lies over it (0.05 higher): the arm
     runs under it as the board draws, and the sphere rolls across it.
   · Board 19's shapes: the top-left shape, the magenta circle behind the bend, the top-right violet circle, the pink and
     the violet circles below, the four quarter-disc tiles, the orange half ring and its violet disc; the dark panel inside
     the U is the platform's own colour. Colours are smooth fields fitted to the board (least squares, copy boxes and sphere
     masked; mean error ~4 / 255 at the hold) and coloured by board px as hold 19's camera sees the point, so every face
     lands on the board's colours; sides shade darker. They flow slowly (a slide of the field, zero at the key instant
     85.6, so the hold is exactly the board's). Off the frame the fields hold their edge colours, dimming gently.
   · Build: the platform, the track and the top-left shape are there from 80.4 (the floor-level run of 18 → 19 sees the
     upper arm and the floor); the frame's other shapes grow out of the floor during the rise (83.9–84.76), left to right,
     as the view opens onto them (all in by ~84.76). They stay: in the tilt to frame 20 the camera sees the whole platform top.
   · A soft contact shadow sits under the sphere while it is on (or dropping onto) the platform: it grounds it at floor
     level and in the tilt, and is hidden under the sphere from straight above. */
export default (V, G) => {
  const { THREE, V3, DEG, h19, yF, TK19, xEdge, zTurn, RT, ballAt, smooth } = G;
  const { scene, anim } = V;
  const h = h19, cam = h.pos.clone(), TK = TK19, YT = yF - 1, Vec2 = THREE.Vector2;
  const T_ON = 80.4;                                             // the set exists from here (hold 18's camera never sees it)

  /* ---------- hold 19's camera: board px <-> world ---------- */
  const hc = new THREE.PerspectiveCamera(h.fov, 16 / 9, 0.05, 2000);
  hc.matrixAutoUpdate = false; hc.matrixWorld.makeBasis(h.right, h.upv, h.fwd.clone().negate()).setPosition(cam);
  hc.matrixWorldInverse.copy(hc.matrixWorld).invert(); hc.updateProjectionMatrix();
  const HVP = new THREE.Matrix4().multiplyMatrices(hc.projectionMatrix, hc.matrixWorldInverse);
  const proj = P => { const q = P.clone().applyMatrix4(HVP); return [(q.x * 0.5 + 0.5) * 1920, (0.5 - 0.5 * q.y) * 1080]; };
  // the point at height y that hold 19's camera sees at board px (px, py)
  const onY = (px, py, y) => { const r = h.at(px, py, 1).sub(cam); return cam.clone().addScaledVector(r, (y - cam.y) / r.y); };
  const Xrow = (py, y = YT) => onY(960, py, y).x;               // board rows are lines of constant world x (screen-right = +z)

  /* ---------- board 19's colour fields ----------
     Each is a smooth polynomial in board px, fitted (least squares; the copy boxes, the sphere and the edges masked) to the
     board over the shape's own visible area (box: that area; outside it the field holds its edge colour). T lists the
     terms u^i·v^j as 'ij' pairs (u, v: 0–1 across the box), c their RGB coefficients (0–255). */
  const FIT = {
    bg: { box: [12, 8, 1908, 997], T: '000110021120031221300413223140', c: [[30.65, 20.33, 56.77], [-3.47, -1.81, 12.37], [90.58, -41.21, 121.68], [-24.46, 11.37, 28.46], [-45.82, 38.76, -95.78], [-174.73, 32.68, -23.88], [42.32, -8.03, 86.65], [-100.27, 24.64, -133.27], [-31.52, 14.97, 31.73], [-36.84, 24.26, -10.06], [96.34, -25.44, 102.14], [-111.56, 4.39, -179.47], [23.13, -11.65, 10.78], [162.57, -33.86, 146.91], [270.52, -39.19, 82.71]] },
    A: { box: [830, 8, 1417, 682], T: '000110021120', c: [[187.54, 69.5, 194.46], [-118.05, -83.7, 54.43], [-75.85, -51.45, 24.46], [21.97, 33.42, -80.49], [-7.51, 6.35, -44.69], [-29.48, -14.82, -11.42]] },
    C: { box: [1482, 8, 1908, 117], T: '000110021120', c: [[75.91, 20.86, 192.77], [-7.84, 0.49, -10.2], [49.84, 6.54, 59.7], [-1.52, -0.07, -7.91], [7.66, -0.37, 12.99], [72.25, -16.1, -2.48]] },
    P: { box: [1094, 615, 1591, 997], T: '000110021120031221300413223140', c: [[244.26, 77.27, 124.69], [-36.54, -17.59, 62.26], [-98.82, 10.67, 137.91], [-50.27, -21.59, 48.39], [-20.28, -0.57, 11.69], [-75.68, -18.06, 35.34], [-23.99, -16.6, 14.09], [1.71, -3.07, -16.01], [24.14, 3.9, -32.88], [-12.48, -15.83, -14.26], [-1.08, -11.15, -12.21], [12.86, -3.7, -30.14], [29.84, 3.35, -39.76], [49.86, 9.68, -43.04], [41.29, -3.47, -29.78]] },
    B: { box: [546, 503, 1107, 1068], T: '000110021120', c: [[166.65, 45.38, 187.54], [14.2, 5.02, 6.75], [-75.53, -36.88, 81.96], [-2.03, -0.34, -5.18], [-38.13, -16.24, 11.49], [23.88, 11.87, -29.24]] },
    disc: { box: [216, 990, 434, 1068], T: '000110', c: [[125.07, 4.19, 246.32], [-0.37, -2.36, 13.58], [-15.38, 0.92, -28.3]] },
    arch: { box: [12, 826, 667, 1068], T: '000110021120', c: [[249.27, 211.12, 122.4], [14.12, -22.05, -30.25], [34.1, -75.9, -114.86], [-7.56, -8.39, -4.21], [-40.96, -23.62, 30.92], [-54.02, -34.99, 41.22]] },
    t1: { box: [909, 813, 1170, 1068], T: '000110021120', c: [[215.19, 107.75, 28.54], [28.61, 12.47, 2.3], [32.23, 1.11, 7.96], [-11.33, -5.15, 0.04], [-20.9, -8.81, -2.85], [6.02, -47.31, 16.39]] },
    t2: { box: [1179, 813, 1440, 1068], T: '000110021120031221300413223140', c: [[116.85, 62.93, 183.19], [144.36, 81.26, -138.29], [-57.5, -56.83, 131.05], [100.92, 61.19, -190.99], [-2.28, -24.05, 20.32], [-61.81, -49.08, 86.48], [-2, 7.55, -39.17], [62.02, 20.58, -115.5], [-82.29, -58.98, 163.01], [5.08, 7.05, -31.96], [-99.75, -45.26, 158.8], [59.26, 27.89, -123.77], [-13.71, -13.17, 60.35], [-84.2, -42, 156.81], [75.66, 62.27, -142.76]] },
    t3: { box: [1450, 813, 1711, 1068], T: '000110021120', c: [[214.99, 108, 28.23], [28.63, 12.34, 3.01], [30.38, 2.69, 6.75], [-10.9, -5.27, 0.11], [-21.47, -8.59, -3.63], [7.94, -48.13, 17.26]] },
    t4: { box: [1721, 826, 1908, 1068], T: '000110021120031221300413223140', c: [[122.06, 62.4, 164.73], [148.13, 88.59, -136.41], [-33.6, -33.1, 116.7], [91.68, 55.11, -196.31], [30.43, 8.74, -16.42], [-42.17, -33.35, 58.22], [-13.42, -0.32, -17.37], [55.61, 19.72, -152.25], [-32.06, -17.91, 85.57], [-10.27, -11.59, -1.64], [-103.15, -48.43, 204.43], [16.91, 2.7, -94.97], [7.26, 0.25, -55.63], [-62.16, -23.96, 144.28], [29.55, 11.71, -56.78]] },
    band: { box: [12, 124, 1001, 816], T: '00011002112003122130', c: [[179.97, 57.06, 42.09], [113.33, 158.52, 27.51], [9.35, -31.98, 1.9], [15.11, 39.09, 27.22], [13.3, 50.99, -1.75], [-5.28, -20.38, -0.28], [-52.6, -49.75, 19.4], [-27.42, -24.99, 4.41], [4.91, 23.97, 0.01], [3.75, 16.96, -2.63]] },
    tl: { box: [12, 8, 327, 544], T: '00011002112003122130', c: [[257.99, 131.36, -10.99], [-201.76, -146.08, 355.65], [-36.93, -56.94, 144.08], [-54.39, -56.18, 69.62], [-7.49, 17.69, -112.28], [-34.03, -26.6, 90.27], [82.25, 58.98, -142.41], [56.59, 51.01, -68.84], [5.82, 24.78, -82.65], [9.4, 7.18, -14.44]] },
  };
  const f1 = x => (Math.abs(x) < 1e-9 ? 0 : x).toFixed(3);
  const glslFit = name => { const F = FIT[name], [x0, y0, x1, y1] = F.box, terms = [];
    for (let k = 0; k < F.T.length / 2; k++) { const i = +F.T[2 * k], j = +F.T[2 * k + 1], c = F.c[k];
      const m = [...Array(i).fill('u'), ...Array(j).fill('v')].join(' * ');
      terms.push(`vec3(${c.map(f1).join(', ')})${m ? ' * ' + m : ''}`); }
    return `vec3 f_${name}(vec2 b) { vec2 q = clamp((b - vec2(${f1(x0)}, ${f1(y0)})) / vec2(${f1(x1 - x0)}, ${f1(y1 - y0)}), 0.0, 1.0); float u = q.x, v = q.y;\n  return clamp((${terms.join(' + ')}) / 255.0, 0.0, 1.0); }\n`; };

  /* ---------- the inlay material: the engine's gradient material, re-pointed at a board field ----------
     colour = field(board px of this point in hold 19's view + a slow slide); the slide is zero at the key instant, so the
     hold lands on the board's colours, and it flows otherwise (living gradients; smooth at any flow level). Sides (any
     face that isn't horizontal) shade darker, more so toward their foot. Off the frame the colour dims gently. */
  let nMat = 0;
  const fieldMat = (name, yTop, o = {}) => {
    const m = V.mat(['#7b2bf9'], { flat: true, side: THREE.DoubleSide }), k = nMat++;
    Object.assign(m.uniforms, { hvp: { value: HVP }, sdir: { value: new Vec2(...(o.sd || [16, 10])) }, bT: { value: TK },
      bper: { value: 6.5 + (k * 0.77) % 3 }, bph: { value: 0.6 + (k * 1.37) % 5 }, yTop: { value: yTop }, thk: { value: o.thk ?? 0.45 },
      wallK: { value: o.wallK ?? 0.66 }, dimOut: { value: o.dimOut ?? 0.28 },
      bc0: { value: new Vec2(...(o.map ? o.map[0] : [0, 0])) }, bc1: { value: new Vec2(...(o.map ? o.map[1] : [0, 0])) }, bsc: { value: o.map ? o.map[2] : 1 } });
    const fs = m.fragmentShader.replace('#include <logdepthbuf_pars_fragment>', '#include <logdepthbuf_pars_fragment>\nuniform mat4 hvp; uniform vec2 sdir, bc0, bc1; uniform float bT, bper, bph, yTop, thk, wallK, dimOut, bsc;\n' + glslFit(name))
      .replace('gl_FragColor = vec4(col * shade, op);', `vec4 hq = hvp * vec4(vW, 1.0);
  vec2 bp = vec2((hq.x / hq.w * 0.5 + 0.5) * 1920.0, (0.5 - 0.5 * hq.y / hq.w) * 1080.0);
  vec3 fc = f_${name}(bc1 + (bp - bc0) * bsc + sdir * min(flow, 1.6) * (sin((t - bT) * spd / bper * 6.2832 + bph) - sin(bph)));
  float od = length(max(max(-bp, bp - vec2(1920.0, 1080.0)), 0.0));
  fc *= 1.0 - dimOut * smoothstep(150.0, 2400.0, od);
  float wall = 1.0 - smoothstep(0.35, 0.75, abs(normalize(vN).y));
  fc *= mix(1.0, wallK - 0.16 * clamp((yTop - vW.y) / thk, 0.0, 1.0), wall);
  gl_FragColor = vec4(fc, op);`);
    if (fs === m.fragmentShader) throw new Error('f19: engine shader changed; the board fields could not hook it');
    m.fragmentShader = fs; m.needsUpdate = true;
    return m;
  };

  /* ---------- slabs: a top face (at its height) with sides down to yB ----------
     rings: the outline (and any holes) as world points at the top height, not closed. Each side runs from the top edge
     down along hold 19's view ray through it (edge-on from that camera, so the hold reads flat) near the frame, blending
     to vertical from ~40 to ~160 board px outside it. */
  const rayW = P => { const [px, py] = proj(P); const od = Math.hypot(Math.max(0, -px, px - 1920), Math.max(0, -py, py - 1080)); return 1 - smooth((od - 40) / 120); };
  const footOf = (P, yB) => { const r = P.clone().sub(cam), pa = P.clone().addScaledVector(r, (yB - P.y) / r.y); return V3(P.x, yB, P.z).lerp(pa, rayW(P)); };
  const set19 = [];
  const slab = (rings, yB, m, { bottom = false, name } = {}) => {
    const pos = [], nor = [], idx = [];
    const tris = THREE.ShapeUtils.triangulateShape(rings[0].map(p => new Vec2(p.x, p.z)), rings.slice(1).map(r => r.map(p => new Vec2(p.x, p.z))));
    for (const p of rings.flat()) { pos.push(p.x, p.y, p.z); nor.push(0, 1, 0); }
    for (const [a, b, c] of tris) idx.push(a, b, c);
    const nTop = pos.length / 3;
    if (bottom) {                                                 // an underside (the platform only)
      for (const p of rings.flat()) { const q = footOf(p, yB); pos.push(q.x, q.y, q.z); nor.push(0, -1, 0); }
      for (const [a, b, c] of tris) idx.push(nTop + a, nTop + c, nTop + b);
    }
    for (const ring of rings) {
      const n = ring.length, base = pos.length / 3;
      for (let i = 0; i < n; i++) {
        const p = ring[i], q = footOf(p, yB), d = ring[(i + 1) % n].clone().sub(ring[(i + n - 1) % n]), L = Math.hypot(d.x, d.z) || 1;
        pos.push(p.x, p.y, p.z, q.x, q.y, q.z); nor.push(d.z / L, 0, -d.x / L, d.z / L, 0, -d.x / L);
      }
      for (let i = 0; i < n; i++) { const A = base + 2 * i, B = base + 2 * ((i + 1) % n); idx.push(A, B, A + 1, B, B + 1, A + 1); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setIndex(idx);
    const mesh = new THREE.Mesh(g, m); mesh.frustumCulled = false; mesh.name = name || ''; scene.add(mesh); set19.push(mesh);
    return mesh;
  };
  // outlines in board px, laid on the height y
  const circ = (cx, cy, r, y, n = 144) => Array.from({ length: n }, (_, i) => onY(cx + r * Math.cos(2 * Math.PI * i / n), cy + r * Math.sin(2 * Math.PI * i / n), y));
  const arcPx = (cx, cy, r, a0, a1, y, step = 3) => { const out = [], n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / step)); for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * DEG; out.push(onY(cx + r * Math.cos(a), cy + r * Math.sin(a), y)); } return out; };

  /* ---------- heights (tops; the board's layering, bottom to top) ---------- */
  const H = { base: YT - 0.42, C: YT - 0.33, A: YT - 0.28, P: YT - 0.23, B: YT - 0.18, disc: YT - 0.13, tiles: YT - 0.08, band: YT, tl: YT + 0.05 };
  const FOOT = YT - 0.43;                                        // every inlay's sides run just into the platform

  /* ---------- the platform ---------- */
  const Z_END = -1.0, Z_FAR = 52, X_FAR = xEdge + 26;
  {
    const rc = 1.4, P = [], y = H.base;
    P.push(V3(xEdge, y, Z_END), V3(xEdge, y, Z_FAR));
    for (let a = 0; a <= 90; a += 10) P.push(V3(X_FAR - rc + rc * Math.sin(a * DEG), y, Z_FAR - rc + rc * Math.cos(a * DEG)));
    for (let a = 90; a <= 180; a += 10) P.push(V3(X_FAR - rc + rc * Math.sin(a * DEG), y, Z_END + rc + rc * Math.cos(a * DEG)));
    // (the two lip-side corners stay square: the lip is one straight edge)
    const seen = P.filter((p, i) => i === 0 || p.distanceTo(P[i - 1]) > 1e-6);
    slab([seen], YT - 1.0, fieldMat('bg', y, { thk: 0.6, wallK: 0.5, dimOut: 0.34, sd: [22, 12] }), { bottom: true, name: 'platform' });
  }

  /* ---------- the track: the U band ---------- */
  const XU0 = Xrow(119), XU1 = Xrow(351), XL0 = Xrow(589), XL1 = Xrow(822);
  {
    const y = H.band, xc = (XL0 + XL1) / 2, wL = (XL0 - XL1) / 2, cxT = xc - RT, czT = zTurn, B = [];
    B.push(V3(XU0, y, Z_END));
    B.push(...arcPx(655, 470.5, 351.5, -90, 90, y, 2));          // the upper arm's top edge meets the bend's outer edge …
    B.push(V3(XL1, y, czT));                                      // … back along the lower arm's bottom edge to the turn
    for (let a = 6; a < 90; a += 6) B.push(V3(cxT + (RT - wL) * Math.cos(a * DEG), y, czT - (RT - wL) * Math.sin(a * DEG)));
    B.push(V3(cxT, y, czT - (RT - wL)), V3(xEdge, y, czT - (RT - wL)), V3(xEdge, y, czT - (RT + wL)), V3(cxT, y, czT - (RT + wL)));
    for (let a = 84; a > 0; a -= 6) B.push(V3(cxT + (RT + wL) * Math.cos(a * DEG), y, czT - (RT + wL) * Math.sin(a * DEG)));
    B.push(V3(XL0, y, czT));                                      // the turn's outer edge, then the lower arm's top edge …
    B.push(...arcPx(655, 470, 119, 90, -90, y, 3));              // … the bend's inner edge …
    B.push(V3(XU1, y, Z_END));                                    // … and the upper arm's bottom edge back to the far end
    slab([B], FOOT, fieldMat('band', y, { sd: [0, 26] }), { name: 'band' });
  }

  /* ---------- board 19's shapes ---------- */
  const grows = [], drifts = [];
  const grow = (mesh, pivot, t0, d = 0.5) => { mesh.geometry.translate(-pivot.x, -pivot.y, -pivot.z); mesh.position.copy(pivot); grows.push({ mesh, t0, d }); return mesh; };
  // (fix pass, the never-stop rule: "never quite settled, but very, very close to what the board would be at that
  //  keyframe") board 19's shapes drift ~3 board px in the floor plane, each at its own phase, passing through their exact
  //  board pose at the key instant 85.6 while still moving. The band (the sphere's track) and the platform stay put.
  const DRA = 0.035;                                             // ≈ 3 board px at the floor (hold 19: ~86 px per unit)
  const drift = (mesh, k, ax = 1) => { drifts.push({ mesh, base: mesh.position.clone(), ax, per: 5.2 + (k * 1.37) % 2.6, ph: 0.9 + (k * 2.11) % 5 }); return mesh; };
  const tGrow = cx => 83.9 + Math.max(0, cx) / 1920 * 0.3;       // left to right as the rising view opens; all in by ~84.76
  // the top-left shape (orange → magenta → violet): straight right edge, rounded left corners; over the upper arm
  {
    const y = H.tl, P = [onY(332, -300, y), onY(332, 549, y), ...arcPx(200, 313, 236, 90, 180, y, 3), ...arcPx(200, -64, 236, 180, 270, y, 3)];
    drift(slab([P], FOOT, fieldMat('tl', y, { sd: [14, 16] }), { name: 'tl' }), 0);
  }
  // the circles: magenta behind the bend (A), violet top right (C), pink (P), violet under the lower arm (B)
  let nDr = 1;
  const disc = (name, cx, cy, r, y, sd, k = nDr++) => drift(grow(slab([circ(cx, cy, r, y)], FOOT, fieldMat(name, y, { sd }), { name }), onY(cx, cy, y), tGrow(cx - r * 0.5)), k);
  disc('C', 1766, 250, 330, H.C, [-14, 12]);
  disc('A', 1145.4, 331.3, 367.1, H.A, [16, 14]);
  disc('P', 1321, 840, 275, H.P, [14, -10]);
  disc('B', 785.6, 823.9, 326.8, H.B, [18, 8]);
  // the orange half ring (bottom left) and the violet disc in it
  {
    const cx = 325, cy = 1107, y = H.tiles;
    const P = [...arcPx(cx, cy, 350, 180, 360, y, 2), ...arcPx(cx, cy, 122, 360, 180, y, 3)];
    drift(grow(slab([P], FOOT, fieldMat('arch', y, { sd: [20, 6] }), { name: 'arch' }), onY(cx, cy, y), tGrow(0)), 11);
    disc('disc', cx, cy, 122, H.disc, [8, 8], 11);             // (the same phase as its ring: it stays centred in it)
  }
  // the four quarter-disc tiles along the bottom (curved edge at the upper left): they grow from their corners
  [['t1', 1175], ['t2', 1445], ['t3', 1716], ['t4', 1987]].forEach(([name, cx], i) => {
    // (fix pass: neighbouring tiles share a 2 px edge, so they alternate 0.025 in height, and the row drifts as one,
    //  sideways only: they sit on the frame's bottom edge)
    const y = H.tiles - 0.025 * (i % 2), cy = 1080, r = 272, P = [onY(cx, cy, y), ...arcPx(cx, cy, r, 180, 270, y, 3)];
    drift(grow(slab([P], FOOT, fieldMat(name, y, { sd: i % 2 ? [12, 12] : [18, 0] }), { name }), onY(cx, cy, y), tGrow(cx - r) + 0.03 * i), 20, 0);
  });

  /* ---------- off the frame: a few more of board 19's shapes on the platform ----------
     Seen at floor level as the sphere comes off the swirl (18 → 19) and in the tilt to frame 20: a magenta circle and a
     violet one beside the upper arm, a half ring (with its violet disc) and two quarter-disc tiles by the lip. Each takes
     the colour field of its twin on the board (re-mapped onto it), so they read as the same set; they grow out of the
     floor as the camera comes down to floor level. */
  {
    const bpx = P => proj(P);                                      // board px (off the frame) of a world point
    const at = (x, z, y) => V3(x, y, z);
    const circW = (c, r, y, n = 120) => Array.from({ length: n }, (_, i) => V3(c.x + r * Math.cos(2 * Math.PI * i / n), y, c.z + r * Math.sin(2 * Math.PI * i / n)));
    const PX = 86;                                                 // board px per unit near the floor (hold 19)
    const extra = (name, pts, pivot, twin, twinR, r, y, t0, sd) => {
      const c = bpx(pivot); const m = fieldMat(name, y, { sd, dimOut: 0.1, map: [c, twin, twinR / (r * PX)] });
      return grow(slab([pts], FOOT, m, { name: 'x-' + name }), pivot, t0, 0.6);
    };
    // the magenta circle (as A) and the violet one (as B), right of the upper arm
    { const y = H.A, c = at(XU0 + 5.9, 6.0, y), r = 4.3; extra('A', circW(c, r, y), c, [1145.4, 331.3], 367.1, r, y, 80.75, [16, 14]); }
    { const y = H.B, c = at(XU0 + 9.2, 15.2, y), r = 3.2; extra('B', circW(c, r, y), c, [785.6, 823.9], 326.8, r, y, 80.95, [18, 8]); }
    // (fix pass: the extras were moved. The two tiles sat inside board 19's own half ring (z 17.8–26 by the lip, at the
    //  same height: z-fighting at the key), and the half ring's disc hung 0.4 over the lip right under the track's end.
    //  Everything off the frame by the lip now lives in the free strip between the track's turn and the frame's left
    //  edge (z 7.2–17.5, x from the lip to the lower arm), clear of every inlay; the second tile sits past the upper arm.)
    // the half ring (as the board's, curve toward +x) with its violet disc, by the lip (the disc 0.05 in from it)
    { const y = H.tiles, ri = 1.05, c = at(xEdge + ri + 0.05, 10.2, y), ro = 3.0, P = [];
      for (let a = -90; a <= 90; a += 3) P.push(V3(c.x + ro * Math.cos(a * DEG), y, c.z + ro * Math.sin(a * DEG)));
      for (let a = 90; a >= -90; a -= 3) P.push(V3(c.x + ri * Math.cos(a * DEG), y, c.z + ri * Math.sin(a * DEG)));
      extra('arch', P, c, [325, 1107], 350, ro, y, 80.85, [20, 6]);
      const yd = H.disc, cd = at(c.x, c.z, yd); extra('disc', circW(cd, ri, yd, 72), cd, [325, 1107], 122, ri, yd, 80.9, [8, 8]); }
    // two quarter-disc tiles (corner at the lip side, curved edge toward +x and −z, like the board's row): one by the lip
    // past the half ring, one beyond the upper arm (both ≥ 1.5 u outside hold 19's frame)
    [['t1', xEdge + 0.35, 16.2, 1175, 2.7], ['t2', XU0 + 0.55, 16.0, 1445, 2.7]].forEach(([name, xc, zc, bx, r], i) => {
      const y = H.tiles, c = at(xc, zc, y), P = [c.clone()];
      for (let a = 0; a <= 90; a += 3) P.push(V3(c.x + r * Math.sin(a * DEG), y, c.z - r * Math.cos(a * DEG)));
      extra(name, P, c, [bx, 1080], 272, r, y, 81.05 + 0.08 * i, i ? [12, 12] : [18, 0]);
    });
  }

  /* ---------- the sphere's contact shadow on the platform ---------- */
  const cv = document.createElement('canvas'); cv.width = cv.height = 64;
  { const c = cv.getContext('2d'), g = c.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(10,4,30,1)'); g.addColorStop(0.45, 'rgba(10,4,30,0.55)'); g.addColorStop(1, 'rgba(10,4,30,0)'); c.fillStyle = g; c.fillRect(0, 0, 64, 64); }
  const shM = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false, opacity: 0 });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 2.1), shM); shadow.rotation.x = -Math.PI / 2; shadow.renderOrder = 2; scene.add(shadow);

  anim(t => {
    for (const m of set19) m.visible = t > T_ON;
    for (const { mesh, t0, d } of grows) { const x = Math.min(1, Math.max(0, (t - t0) / d)), k = 1 - Math.pow(1 - x, 3); mesh.visible = t > T_ON && x > 0; mesh.scale.setScalar(Math.max(1e-3, k)); }
    for (const { mesh, base, ax, per, ph } of drifts) { const a = 6.2832 * (t - TK) / per;
      mesh.position.set(base.x + ax * DRA * (Math.sin(a + ph) - Math.sin(ph)), base.y, base.z + DRA * (Math.sin(a / 1.3 + ph + 1.7) - Math.sin(ph + 1.7))); }
    // the shadow: while the sphere is over the platform (dropping onto it or rolling on it), before the lip
    const b = t > T_ON && t < 93.25 ? ballAt(t) : null, dh = b ? b.y - yF : 99;
    const on = b && dh > -0.05 && dh < 6 && b.x > xEdge + 0.6 && b.z > Z_END + 0.5;
    shadow.visible = !!on;
    if (on) { const k = 1 - dh / 6; shM.opacity = 0.42 * k * k * Math.min(1, (b.x - xEdge - 0.6) / 0.8); shadow.position.set(b.x, YT + 0.012, b.z); shadow.scale.setScalar(0.85 + 0.12 * dh); }
  });

  V.unplate(19);
};
