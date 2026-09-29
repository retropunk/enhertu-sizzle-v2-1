/* Frame 30 · the front of the ring: the camera has orbited round from 29; the sphere comes out through the ring toward
   the camera, down the ramp, and the camera zooms all the way into it until it fills the frame (the cut at 139.35) (G6,
   called from g6.js with its context G). A drift-length hold (136.95–137.45, key 137.2). Built: the real set, no plate.
   · The triangle is the lower ramp itself (f29's RAMP_DN is hidden and rebuilt here): its two edges are solved against the
     hold camera so they are board 30's lines (360, 1080) → (1040, 270) ← (1720, 1080). The edges meet at the board's apex,
     1.5 u beyond the ring's centre plane. It grows out of the ring ahead of the sphere (134.45–135.75, the path laying
     itself down, instead of switching on in one frame). While the camera swings round, the ramp's first 3 u join f29's
     upper ramp at the ring (its end widths: one cross-section while both show) and ease onto the board's lines once f29's
     upper ramp has rolled up into the ring (136.3–136.75). A navy portal (the board's
     interior) fills the ring's bore in its centre plane, fading in once the sphere is through (136.0–136.35), so the ramp
     beyond the ring (f29's, gone at 136.4) dissolves into the dark instead of vanishing; the tip is a flat cap on the
     portal's face, cut along the hold camera's rays, that grows up to the apex (136.5–136.85). Its colour is board 30's: a radial gradient about the bottom-right corner (blue → violet → mauve →
     orange, measured), projected from the hold camera; below the frame the bottom row's profile carries on across the
     ramp's width, so the zoom sees the same colours.
   · The ring (both faces, solved against boards 29 and 30) is f29's.
   · Board 30's backdrop, as pieces flat at the hold (chunky sides while the camera moves): the violet block, the small
     orange→violet tile and the tall rounded tile (top right), the pink square and the violet strip (right edge), the ∩ dome
     with its band and navy doorway (right), the four quarter discs (bottom left), and a far wall with the board's
     navy, maroon corner and violet glow. Colours are the board's, measured (smooth interpolated gradients), with one
     living drift for the whole set, zero at the key instant.
   · The sphere's dressing (effects, not set): the translucent halo behind it, the dark trail above it (the board's
     shadow crescent) and the mauve light beam from inside the ring down to it. They ride with the sphere, sized to its
     silhouette, so they grow as it comes at the camera; they are drawn behind the sphere and never between it and the
     camera. Plain sphere (decision 7).
   · In: the far wall and the tiles build in while the camera swings round to the front (135.95–136.85; the tiles slide in
     from their edges, the quarter discs flip in like puzzle pieces from 136.3, once the ramp joint has cleared), the
     dressing fades in once the sphere is clear of the ring. The far wall draws first, blended, in the opaque pass (so its
     fade never hides the dressing). The beam tapers smoothly on screen (no shoulders) and is near-opaque by the
     triangle's apex, which hides under it as on the board. Everything stays for the zoom (board 30 stays full frame behind it) until the cut.
   The journey (holds, the sphere's path, camera keys, captions) stays in g6.js. */
export default (V, G) => {
  const { THREE, v3, D, N, C, h30, fadeIO } = G;
  const { scene, anim } = V;
  const h = h30, TK = h.tk, X = v3(1, 0, 0);
  const ON = [134.45, 139.6];                                           // the lower ramp's life (as f29's RAMP_DN)
  V.unplate(30);

  /* ---------- GLSL helpers ---------- */
  const hexC = hx => { const n = parseInt(hx.replace('#', ''), 16); return `vec3(${((n >> 16 & 255) / 255).toFixed(4)}, ${((n >> 8 & 255) / 255).toFixed(4)}, ${((n & 255) / 255).toFixed(4)})`; };
  const f1 = x => (Math.round(x * 10) / 10).toFixed(1);
  const stopsFn = (name, st) => `vec3 ${name}(float v) { vec3 c = ${hexC(st[0][1])};\n` +
    st.slice(1).map(([v, hx], i) => `  c = mix(c, ${hexC(hx)}, clamp((v - ${f1(st[i][0])}) / ${f1(v - st[i][0])}, 0.0, 1.0));`).join('\n') + '\n  return c; }\n';
  // smooth interpolation of measured board colours (board px): no rings, no bands
  const idwFn = (name, pts, k = 44, pw = 2) => `vec3 ${name}(vec2 b) { vec3 s = vec3(0.0); float ws = 0.0, w; vec2 d;\n` +
    pts.map(([x, y, hx]) => `  d = b - vec2(${f1(x)}, ${f1(y)}); w = pow(1.0 + dot(d, d) * ${(1 / (k * k)).toExponential(5)}, ${(-pw).toFixed(2)}); s += w * ${hexC(hx)}; ws += w;`).join('\n') + '\n  return s / ws; }\n';
  // one living drift for the whole set (board px), zero at the key instant
  const PER = 8.5, PH = 0.9, AMP = 22;
  const SLF = `vec2 SL(float t, float flow) { float fl = min(flow, 1.6), a = 6.2832 * ((t - ${TK.toFixed(4)}) * spd);
  return ${AMP.toFixed(1)} * fl * vec2(sin(a / ${PER.toFixed(2)} + ${PH.toFixed(2)}) - sin(${PH.toFixed(2)}), sin(a / ${(PER * 1.13).toFixed(3)} + ${(PH + 0.85).toFixed(2)}) - sin(${(PH + 0.85).toFixed(2)})); }\n`;

  /* ---------- board 30's colours (measured) ---------- */
  const NAVY = '#25085a';
  const LIB = [
    // the triangle: by distance from the bottom-right corner (1720, 1080)
    stopsFn('triR', [[0, '#0401fe'], [200, '#0d00e8'], [255, '#1f00d7'], [365, '#3603bf'], [505, '#6814a0'], [560, '#79208a'], [620, '#902f72'], [680, '#a73f60'], [742, '#c05549'],
      [800, '#d2603b'], [860, '#e36e28'], [920, '#ed7c1c'], [980, '#f78812'], [1040, '#fd900d'], [1100, '#ff9808'], [1160, '#ff9f00'], [1220, '#ffa201'], [1340, '#ffab0b']]),
    // the ring, by angle (degrees, y up) about the hole's centre: the rim band, the face band's inner and outer edge
    stopsFn('rimA', [[-180, '#f37707'], [-150, '#ff8e00'], [-135, '#fe8d0b'], [-100, '#f86a50'], [-60, '#f45282'], [-40, '#f15084'], [-20, '#da3ba1'], [0, '#af2bcc'], [20, '#871ce6'],
      [40, '#650cfa'], [65, '#6a12ee'], [95, '#7c22d0'], [120, '#9a30a0'], [140, '#b0377e'], [160, '#d95936'], [180, '#f37707']]),
    stopsFn('faceI', [[-180, '#d05742'], [-150, '#a3374f'], [-135, '#6f228c'], [-90, '#7a2a80'], [-40, '#812a88'], [-30, '#9d3c6f'], [-20, '#b34a5b'], [0, '#c2584b'], [20, '#b14b59'],
      [40, '#8a2e81'], [90, '#8a3080'], [140, '#8c307d'], [160, '#bf4d57'], [180, '#d05742']]),
    stopsFn('faceO', [[-180, '#fd721d'], [-150, '#c05b6b'], [-135, '#91337f'], [-90, '#b0506a'], [-40, '#c45a42'], [-30, '#d76944'], [-20, '#e16c29'], [0, '#ef7427'], [20, '#e27232'],
      [40, '#d06c3c'], [90, '#d06a40'], [140, '#d8603a'], [160, '#e46427'], [180, '#fd721d']]),
    // the halo around the sphere, by angle about its centre
    stopsFn('haloA', [[-180, '#f27b17'], [-150, '#d2593c'], [-120, '#9a39a4'], [-90, '#7f2dfe'], [-60, '#b52acf'], [-30, '#d65fb1'], [0, '#ba6086'], [30, '#c05a58'], [90, '#cf6a48'],
      [150, '#f7801c'], [180, '#f27b17']]),
    stopsFn('beamU', [[0, '#9a40e0'], [0.22, '#b048e8'], [0.4, '#d870c0'], [0.6, '#c47ca8'], [1, '#c47ca0']]),
    stopsFn('stripY', [[85, '#5507b4'], [300, '#430691'], [520, '#320772'], [900, '#2c0766']]),
    stopsFn('ulX', [[10, '#470ff8'], [42, '#5315f6'], [76, '#6d24e2'], [110, '#963bb8'], [144, '#c45866'], [178, '#eb6f1c'], [212, '#fa7c02']]),
    stopsFn('urY', [[640, '#ec7420'], [700, '#ee6a22'], [760, '#f06024'], [858, '#ff3d36']]),
    stopsFn('llY', [[862, '#ea7120'], [980, '#f06125'], [1085, '#fc4331']]),
    idwFn('tallC', [[1595, 12, '#fa9808'], [1640, 12, '#fa9008'], [1685, 12, '#f47d2c'], [1730, 12, '#e76461'], [1775, 12, '#e15086'], [1820, 12, '#dc459b'], [1595, 57, '#fd8f00'], [1640, 57, '#fd8500'],
      [1685, 57, '#ea6d3b'], [1730, 57, '#cd508d'], [1775, 57, '#c03bb6'], [1820, 57, '#bc31c2'], [1595, 102, '#e67516'], [1640, 102, '#e26b26'], [1685, 102, '#bb4e8e'], [1730, 102, '#9833dd'],
      [1775, 102, '#9023e2'], [1820, 102, '#8e1cde'], [1595, 147, '#af525d'], [1640, 147, '#9e4586'], [1685, 147, '#782ce0'], [1730, 147, '#6418f9'], [1775, 147, '#6510e7'], [1820, 147, '#670cda'],
      [1595, 192, '#7a3289'], [1640, 192, '#6a27a6'], [1685, 192, '#5417ce'], [1730, 192, '#480acd'], [1775, 192, '#4905bc'], [1820, 192, '#4c03b7'], [1595, 237, '#501a9c'], [1640, 237, '#4715a5'],
      [1685, 237, '#3c0bad'], [1730, 237, '#3604a1'], [1775, 237, '#370092'], [1820, 237, '#3a0094'], [1595, 282, '#300b9b'], [1640, 282, '#2b099b'], [1685, 282, '#280495'], [1730, 282, '#270089'],
      [1775, 282, '#290080'], [1595, 327, '#1e0393'], [1640, 327, '#1d028f'], [1685, 327, '#1c0089'], [1730, 327, '#1d0080'], [1775, 327, '#23017a'], [1595, 372, '#15008c'], [1640, 372, '#15008b'],
      [1685, 372, '#150085'], [1595, -40, '#ff9a00'], [1700, -40, '#f47a30'], [1820, -40, '#e04c90']]),
    idwFn('smallC', [[1483, 150, '#953785'], [1511, 150, '#b44c62'], [1539, 150, '#d1603a'], [1567, 150, '#ea6f18'], [1483, 190, '#903792'], [1511, 190, '#b04b6f'], [1539, 190, '#cf5e41'],
      [1567, 190, '#e86f1c'], [1483, 230, '#8832b2'], [1511, 230, '#a54496'], [1539, 230, '#c45765'], [1567, 230, '#dd6636'], [1483, 270, '#792ae5'], [1511, 270, '#943ad0'], [1539, 270, '#ae48a4'],
      [1567, 270, '#c85577'], [1483, 310, '#6b20ef'], [1511, 310, '#832ded'], [1539, 310, '#9d39d1'], [1567, 310, '#b444ae'], [1455, 350, '#5110cb'], [1483, 350, '#6219e4'], [1511, 350, '#7923eb'],
      [1539, 350, '#912de2'], [1567, 350, '#a936cf'], [1455, 390, '#4e0dca'], [1483, 390, '#6015dd'], [1511, 390, '#731feb'], [1539, 390, '#8d27e7'], [1567, 390, '#a52fd9'], [1455, 150, '#7a2aa0'], [1455, 250, '#6a20c8']], 36),
    idwFn('lrC', [[235, 900, '#fd9701'], [265, 900, '#fc9101'], [295, 900, '#f28513'], [325, 900, '#dd7537'], [235, 930, '#fd8d02'], [265, 930, '#fc8701'], [295, 930, '#ef7b16'], [325, 930, '#d16850'],
      [355, 930, '#ae5490'], [235, 960, '#fa7e07'], [265, 960, '#f77a05'], [295, 960, '#e96d20'], [325, 960, '#c05779'], [355, 960, '#9641c0'], [385, 960, '#772de5'], [235, 990, '#ec672c'],
      [265, 990, '#e56237'], [295, 990, '#d05560'], [325, 990, '#a642b5'], [355, 990, '#7b2df6'], [385, 990, '#601cf8'], [235, 1020, '#d54f62'], [265, 1020, '#ca4876'], [295, 1020, '#b23ca2'],
      [325, 1020, '#8f2adc'], [355, 1020, '#6d1af9'], [385, 1020, '#560ff4'], [235, 1050, '#c23c8f'], [265, 1050, '#b534a4'], [295, 1050, '#9d27ca'], [325, 1050, '#8318eb'], [355, 1050, '#6c0df7'],
      [235, 870, '#ff9c00'], [300, 862, '#f89010']], 32),
    idwFn('domeC', [[1590, 595, '#fa5370'], [1630, 595, '#f44e7c'], [1670, 595, '#eb4989'], [1710, 595, '#e0439c'], [1750, 595, '#d13eb0'], [1790, 595, '#c038c3'], [1830, 595, '#af35d4'],
      [1550, 640, '#fb5b60'], [1590, 640, '#f8556d'], [1630, 640, '#f1507a'], [1670, 640, '#e94a88'], [1710, 640, '#dc449c'], [1750, 640, '#cc3db3'], [1790, 640, '#b938c8'], [1830, 640, '#a733db'],
      [1870, 640, '#952fea'], [1510, 685, '#fd6251'], [1550, 685, '#f95e5b'], [1590, 685, '#f55869'], [1630, 685, '#ee5378'], [1670, 685, '#e34c8a'], [1710, 685, '#d5459e'], [1750, 685, '#c33eb7'],
      [1790, 685, '#b038ce'], [1830, 685, '#9d32e3'], [1870, 685, '#8a2df2'], [1510, 730, '#fb674a'], [1550, 730, '#f86255'], [1590, 730, '#f25c65'], [1630, 730, '#e95577'], [1670, 730, '#dd4f8a'],
      [1710, 730, '#cd48a0'], [1750, 730, '#bb40ba'], [1790, 730, '#a639d2'], [1830, 730, '#9332ea'], [1870, 730, '#812dfa'], [1510, 775, '#fb6c42'], [1550, 775, '#f7664f'], [1590, 775, '#ee6060'],
      [1830, 775, '#8e33e6'], [1870, 775, '#7c2ef7'], [1550, 820, '#f46a46'], [1590, 820, '#ec6458'], [1830, 820, '#8b36dc'], [1870, 820, '#7b2feb'], [1590, 865, '#ee674b'], [1830, 865, '#8b37d1'],
      [1870, 865, '#7b30e1'], [1830, 910, '#8b38c4'], [1870, 910, '#7c31d3'], [1830, 955, '#8a37b8'], [1870, 955, '#7c30c8'], [1830, 1000, '#8836ac'], [1870, 1000, '#7a2ebc'], [1830, 1045, '#8533a2'],
      [1870, 1045, '#772cb3'], [1500, 900, '#f86c44'], [1560, 1000, '#f2684c'], [1600, 1100, '#ec6454'], [1920, 700, '#7a2cf8'], [1920, 950, '#742ec4']], 40),
    // the far wall: navy, the maroon corner (top left), a violet glow (low left), a little more violet to the right
    `vec3 bgCol(vec2 q) {
  vec3 c = mix(${hexC('#20125f')}, ${hexC('#2c0868')}, smoothstep(600.0, 1900.0, q.x));
  c = mix(c, ${hexC(NAVY)}, 0.8 * (1.0 - smoothstep(380.0, 560.0, length(q - vec2(1060.0, 230.0)))));
  c = mix(c, ${hexC('#602238')}, pow(1.0 - clamp(length(q) / 580.0, 0.0, 1.0), 1.3));
  c = mix(c, ${hexC('#620ab8')}, 0.95 * pow(1.0 - clamp(length(q - vec2(440.0, 980.0)) / 440.0, 0.0, 1.0), 1.15));
  return c; }\n`,
    // the ring's front face: the navy hole (centre (1044, 237), r 266), the rim band (to r 300), the face band out to the
    // outer circle (centre (1067, 225), r 392)
    `vec3 ringCol(vec2 q, float sa) {
  vec2 d = q - vec2(1044.0, 237.0); float rh = length(d);
  float th = degrees(atan(-d.y, d.x)) + sa; th = th > 180.0 ? th - 360.0 : (th < -180.0 ? th + 360.0 : th);
  vec2 u = d / max(rh, 0.001), oc = vec2(23.0, -12.0); float pr = dot(u, oc), ro = pr + sqrt(max(pr * pr - dot(oc, oc) + 392.0 * 392.0, 1.0));
  vec3 face = mix(faceI(th), faceO(th), smoothstep(300.0, ro, rh));
  vec3 c = mix(rimA(th), face, smoothstep(298.5, 301.5, rh));
  return mix(${hexC(NAVY)}, c, smoothstep(264.5, 267.5, rh)); }\n`,
  ].join('');

  /* ---------- materials ---------- */
  const eng = V.mat(['#000000']);                                       // borrowed for the engine's time and gradient-flow uniforms
  const T = eng.uniforms.t, FLOW = eng.uniforms.flow, SPD = eng.uniforms.spd;
  // (1) pieces: the shape's board colours in its own board px (they ride with the shape)
  const PV = '#include <common>\n#include <logdepthbuf_pars_vertex>\nvarying vec3 vO; varying vec3 vNv;\nvoid main() { vO = position; vNv = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}';
  const PF = (body, alpha = '1.0') => `uniform float op, t, flow, spd; uniform vec2 at;
varying vec3 vO; varying vec3 vNv;
#include <logdepthbuf_pars_fragment>
${LIB}${SLF}
void main() {
  vec2 sl = SL(t, flow), b = at + vec2(vO.x, -vO.y), q = b + sl;
  vec3 col = ${body};
  vec3 nv = normalize(vNv); float shade = mix(0.72 + 0.12 * nv.y - 0.05 * nv.x, 1.0, smoothstep(0.55, 0.98, abs(nv.z)));
  gl_FragColor = vec4(col * shade, op * (${alpha}));
#include <logdepthbuf_fragment>
}`;
  const swaps = [];
  anim(() => { for (const [a, b] of swaps) if (!b.userData.early) { b.transparent = a.transparent; b.depthWrite = a.depthWrite; } });
  const P30 = (spec, body, alpha) => {
    const pc = V.piece({ hold: 30, drift: 3, ...spec });
    if ((spec.thick ?? 0.4) > 0) G.flatFor(pc, 30, spec.at, spec.depth);
    const o0 = pc.mesh.material;
    const m = new THREE.ShaderMaterial({ uniforms: { op: o0.uniforms.op, t: o0.uniforms.t, flow: o0.uniforms.flow, spd: o0.uniforms.spd, at: { value: new THREE.Vector2(...spec.at) } },
      vertexShader: PV, fragmentShader: PF(body, alpha), side: o0.side });
    pc.mesh.material = m; swaps.push([o0, m]); return pc;
  };
  // (2) world geometry coloured by where it sits in the hold-30 view (board px), so it lands on the board at the hold
  const WV = '#include <common>\n#include <logdepthbuf_pars_vertex>\nvarying vec3 vW; varying vec3 vN;\nvoid main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w;\n#include <logdepthbuf_vertex>\n}';
  const hU = { hp: { value: h.pos.clone() }, hr: { value: h.right.clone() }, hu: { value: h.upv.clone() }, hf: { value: h.fwd.clone() }, tv: { value: h.tanV } };
  const WF = (body, pre = '') => `uniform float op, t, flow, spd, tv; uniform vec3 hp, hr, hu, hf;
varying vec3 vW; varying vec3 vN;
#include <logdepthbuf_pars_fragment>
${LIB}${SLF}
vec2 BP(vec3 w) { vec3 d = w - hp; float z = max(dot(d, hf), 0.05); return vec2(960.0 + dot(d, hr) / z / tv * 540.0, 540.0 - dot(d, hu) / z / tv * 540.0); }
${pre}
void main() {
  vec2 sl = SL(t, flow);
  vec3 col = ${body};
  gl_FragColor = vec4(col, op);
#include <logdepthbuf_fragment>
}`;
  const wmat = (body, pre, o = {}) => new THREE.ShaderMaterial({ uniforms: { op: { value: 1 }, t: T, flow: FLOW, spd: SPD, ...hU, ...(o.u || {}) }, vertexShader: WV, fragmentShader: WF(body, pre), side: o.side ?? THREE.FrontSide });

  /* ---------- the lower ramp = board 30's triangle ---------- */
  // the ramp's surface plane (through C − N, normal N); a board pixel's view ray onto it
  const rayOf = (px, py) => h.fwd.clone().addScaledVector(h.right, (px - 960) / 540 * h.tanV).addScaledVector(h.upv, (540 - py) / 540 * h.tanV);
  const onPlane = (px, py, P0, n) => { const r = rayOf(px, py), k = P0.clone().sub(h.pos).dot(n) / r.dot(n); return h.pos.clone().addScaledVector(r, k); };
  const S0 = C.clone().sub(N), sx = p => { const d = p.clone().sub(C); return [d.dot(D), d.dot(X)]; };
  const [sA, xA] = sx(onPlane(1040, 270, S0, N)), [sL, xL1] = sx(onPlane(360, 1080, S0, N)), [sR, xR1] = sx(onPlane(1720, 1080, S0, N));
  const kL = (xL1 - xA) / (sL - sA), kR = (xR1 - xA) / (sR - sA);
  const xl = s => xA + kL * (s - sA), xr = s => xA + kR * (s - sA);            // the edges (lateral x at station s)
  const onRamp = (s, x, dn = 0) => C.clone().addScaledVector(D, s).addScaledVector(N, -1 - dn).addScaledVector(X, x);
  const R29 = G.ring29 || {};
  const S_MAX = 12.4;                                                       // the board's bottom row (below it the profile carries on)
  const TRI = 'triR(length(b - vec2(1720.0, 1080.0)) + sl.x)';
  const rampTop = wmat(`triCol(vW)`, `uniform vec3 C0, Dv, Nv, Xv; uniform vec4 EL;
vec3 triCol(vec3 w) {
  float s = dot(w - C0, Dv);
  vec3 p = w;
  if (s > ${S_MAX.toFixed(2)}) { float x = dot(w - C0, Xv), xl = EL.x + EL.y * s, xr = EL.z + EL.w * s, u = (x - xl) / (xr - xl);
    float s2 = ${S_MAX.toFixed(2)}, xl2 = EL.x + EL.y * s2, xr2 = EL.z + EL.w * s2; p = C0 + Dv * s2 - Nv + Xv * (xl2 + u * (xr2 - xl2)); }
  vec2 b = BP(p); vec2 sl = SL(t, flow);
  return ${TRI}; }`, { side: THREE.DoubleSide, u: { C0: { value: C.clone() }, Dv: { value: D.clone() }, Nv: { value: N.clone() }, Xv: { value: X.clone() },
    EL: { value: new THREE.Vector4(xA - kL * sA, kL, xA - kR * sA, kR) } } });
  const rampSide = V.mat(['#7a24d0', '#3a0a9a'], { side: THREE.DoubleSide });
  const ramp = [], tipM = [];
  // a slab (top + two sides, 0.45 deep) with n + 1 rows; rows(i) → [s, xLeft, xRight]; returns its updater
  const slab = (n, list) => {
    const geos = [0, 1, 2].map(() => { const g = new THREE.BufferGeometry(), idx = []; g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array((n + 1) * 6), 3));
      for (let i = 1; i <= n; i++) { const k = 2 * i; idx.push(k - 2, k, k - 1, k - 1, k, k + 1); } g.setIndex(idx); return g; });
    [[geos[0], rampTop], [geos[1], rampSide], [geos[2], rampSide]].forEach(([g, m]) => { const me = new THREE.Mesh(g, m); me.frustumCulled = false; scene.add(me); list.push(me); });
    return rows => {
      const [T0, S1, S2] = geos.map(g => g.attributes.position), put = (a, i, p) => a.setXYZ(i, p.x, p.y, p.z);
      for (let i = 0; i <= n; i++) { const [s, a, b] = rows(i), A = onRamp(s, a), B = onRamp(s, b), Ab = onRamp(s, a, 0.45), Bb = onRamp(s, b, 0.45);
        put(T0, 2 * i, A); put(T0, 2 * i + 1, B); put(S1, 2 * i, A); put(S1, 2 * i + 1, Ab); put(S2, 2 * i, B); put(S2, 2 * i + 1, Bb); }
      geos.forEach(g => { g.attributes.position.needsUpdate = true; g.computeVertexNormals(); });
    };
  };
  // the far part (s 3 → 34): board 30's lines throughout
  const far = slab(62, ramp), farM = ramp.slice();
  // the near part (s 0 → 3): while the camera swings round it joins f29's upper ramp at the ring (its end widths), and
  // eases onto board 30's lines once f29's upper ramp has rolled up into the ring (136.3 → 136.75), so the two halves
  // share one cross-section at the ring while both show
  const RU = R29.ramp || {}, jR = RU.aL ? RU.aL(0) : 0.36, jL = RU.bR ? -RU.bR(0) : -0.36;
  const near = slab(6, ramp), MORPH = [136.3, 136.75];
  // it grows out of the ring ahead of the sphere (134.45 → 135.75, the path laying itself down; it used to switch on in
  // one frame at 134.45): se is its far end's station
  const GROWR = [134.45, 135.75], seAt = t => 34 * gsap.parseEase('power2.out')(Math.min(1, Math.max(0, (t - GROWR[0]) / (GROWR[1] - GROWR[0]))));
  const farAt = se => far(i => { const s = Math.min(3 + 31 * i / 62, Math.max(3, se)); return [s, xl(s), xr(s)]; });
  const nearAt = (m, se) => near(i => { const s = Math.min(3 * i / 6, se), u = s / 3, w = Math.max(m, u);
    return [s, (jL + (xl(3) - jL) * u) * (1 - w) + xl(s) * w, (jR + (xr(3) - jR) * u) * (1 - w) + xr(s) * w]; });
  // the portal: board 30's navy filling the ring's hole, just behind the ring's front face (f29's: its plane and axis; else
  // the ring's centre plane), so it never shows past the ring and hides the bore's inner wall; it fades in once the sphere
  // is through (136.0 → 136.35), so the ramp beyond the ring dissolves into the dark
  const RF = R29.ring && R29.ring.Qf && R29.ring.axis ? R29.ring : null, nP = RF ? RF.axis.clone().normalize() : D.clone();
  const Pf = RF ? RF.Qf.clone().addScaledVector(nP, -0.015) : C.clone();
  const pc = onPlane(1042, 222, Pf, nP), pr = onPlane(1042 + 259 * 1.06, 222, Pf, nP).distanceTo(pc);
  const portalM = new THREE.ShaderMaterial({ uniforms: { op: { value: 0 } }, transparent: true, depthWrite: false,
    vertexShader: '#include <common>\n#include <logdepthbuf_pars_vertex>\nvoid main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}',
    fragmentShader: `uniform float op;\n#include <logdepthbuf_pars_fragment>\nvoid main() { gl_FragColor = vec4(${hexC(NAVY)}, op);\n#include <logdepthbuf_fragment>\n}` });
  const portal = new THREE.Mesh(new THREE.CircleGeometry(pr, 96), portalM); portal.position.copy(pc); portal.quaternion.setFromUnitVectors(v3(0, 0, 1), nP); scene.add(portal);
  const PORTAL = [136.0, 136.35];
  // the tip: both fitted edges meet at board 30's apex, 1.5 u beyond the ring's centre plane, so the tip stands on the
  // portal's face as a flat cap cut along the hold camera's rays (its base is where the ramp's own edges cross that plane);
  // it grows up to the apex once the ramp has eased onto the board's lines (136.5 → 136.85)
  const Pcap = Pf.clone().addScaledVector(nP, 0.02);
  const cross = xf => { const f = s2 => onRamp(s2, xf(s2)).sub(Pcap).dot(nP), f0 = f(0), f1 = f(1); return f0 / (f0 - f1); };   // the edge's station on the cap's plane
  const sCL = cross(xl), sCR = cross(xr);
  const capB = [onRamp(sCL, xl(sCL)), onRamp(sCR, xr(sCR))], capA = onPlane(1040, 270, Pcap, nP), capM0 = capB[0].clone().lerp(capB[1], 0.5);
  const capG = new THREE.BufferGeometry().setFromPoints([capB[0], capB[1], capA]); capG.setIndex([0, 1, 2]);
  const cap = new THREE.Mesh(capG, rampTop); cap.frustumCulled = false; scene.add(cap); tipM.push(cap);
  const GROW = [136.5, 136.9];
  let lastM = -1, lastG = -1, lastS = -1;
  const rampAt = t => { const m = G.smooth((t - MORPH[0]) / (MORPH[1] - MORPH[0])), g = G.smooth((t - GROW[0]) / (GROW[1] - GROW[0])), se = seAt(t);
    if (m !== lastM || se !== lastS) { nearAt(m, se); lastM = m; }
    if (se !== lastS) { farAt(se); lastS = se; }
    if (g !== lastG) { const q = capM0.clone().lerp(capA, g); capG.attributes.position.setXYZ(2, q.x, q.y, q.z); capG.attributes.position.needsUpdate = true; lastG = g; }
    return g; };
  rampAt(0);
  // f29's lower ramp is replaced by this one; board 29's streak and its shadow (f29's, on the upper ramp) must not show
  // through the ring's hole once the camera is round the front. (f29 owns its upper ramp's exit: it rolls up into the ring.)
  const hideF29 = t => { if (R29.rampDn) R29.rampDn.forEach(m => { m.visible = false; });
    if (t > 136.4) for (const m of [R29.streak, R29.shadow]) if (m) m.visible = false; };

  /* ---------- the backdrop pieces, back to front ---------- */
  const S = V.S, rect = (x0, y0, x1, y1, at) => S.poly([[x0, y1], [x1, y1], [x1, y0], [x0, y0]], at);
  const holeOf = shape => { const p = new THREE.Path(); p.setFromPoints(shape.getPoints(48).reverse()); return p; };
  const arched = (w, hh, hole, hw, hh2) => { const s = S.archFill(w, hh); if (hole) s.holes.push(holeOf(S.archFill(hw, hh2))); return s; };
  const IN = (type, a, b, o = {}) => ({ type, t: [a, b], ease: o.ease || 'expo.out', ...o });
  // the far wall (board 30's navy with the maroon corner and the violet glow), soft at its far edges
  const farWall = P30({ shape: rect(-1500, -1000, 3400, 2300, [960, 540]), at: [960, 540], depth: 70, thick: 0, drift: 0, in: IN('fade', 135.95, 136.8, { ease: 'sine.inOut' }) }, 'bgCol(q)',
    '(1.0 - smoothstep(0.0, 700.0, max(max(-b.x, b.x - 1920.0), max(-b.y, b.y - 1080.0) - 200.0)))');
  // it is the farthest thing here: it draws first, blended, in the opaque pass (right after the background). Fading as a
  // transparent object it was drawn after the sphere's halo, trail and beam (depth-test free, in the opaque pass) and hid
  // them until it turned opaque at 136.8 (a one-frame jump)
  { const fm = farWall.mesh.material; fm.userData.early = true; fm.transparent = false; fm.depthWrite = false;
    fm.blending = THREE.CustomBlending; fm.blendSrc = THREE.SrcAlphaFactor; fm.blendDst = THREE.OneMinusSrcAlphaFactor; fm.blendSrcAlpha = THREE.ZeroFactor; fm.blendDstAlpha = THREE.OneFactor;
    farWall.mesh.renderOrder = -5; }
  // top right: the violet block, the small tile, the tall rounded tile, the pink square, the violet strip
  P30({ shape: rect(1386, -140, 1582, 141, [1484, 0]), at: [1484, 0], depth: 27.45, thick: 0.45, in: IN('slide', 135.95, 136.6, { from: 'top' }) },
    `mix(${hexC('#4e06a8')}, ${hexC('#3b0786')}, smoothstep(-40.0, 141.0, q.y))`);
  P30({ shape: rect(1440, 139, 1580, 400, [1510, 270]), at: [1510, 270], depth: 27.0, thick: 0.45, in: IN('slide', 136.1, 136.78, { from: 'top' }) }, 'smallC(q)');
  { const at = [1710, 140], s = S.cornerRect(260, 520, 190, 'br');
    P30({ shape: s, at, depth: 27.15, thick: 0.5, in: IN('slide', 136.0, 136.7, { from: 'top' }) }, 'tallC(q)'); }
  P30({ shape: rect(1839, -140, 2060, 86, [1950, 0]), at: [1950, 0], depth: 27.3, thick: 0.45, in: IN('slide', 136.05, 136.68, { from: 'right' }) },
    `mix(${hexC('#ff5566')}, ${hexC('#fb4676')}, smoothstep(-40.0, 85.0, q.y))`);
  P30({ shape: rect(1839, 84, 2060, 1500, [1950, 500]), at: [1950, 500], depth: 27.5, thick: 0.45, in: IN('slide', 136.0, 136.75, { from: 'right' }) }, 'stripY(q.y)');
  // right: the ∩ dome (outer band, the gradient dome, the navy doorway), bases well below the frame
  const BASE = 1560;
  P30({ shape: arched(634, BASE - 463, true, 470, BASE - 546), at: [1707, BASE], depth: 26.75, thick: 0.45, in: IN('slide', 136.05, 136.8, { from: 'bottom' }) },
    `mix(${hexC('#3f049c')}, ${hexC('#480e96')}, (1.0 - smoothstep(1450.0, 1700.0, q.x)) * smoothstep(500.0, 800.0, q.y))`);
  P30({ shape: arched(482, BASE - 540, true, 215, BASE - 745), at: [1707, BASE], depth: 26.55, thick: 0.5, in: IN('slide', 136.12, 136.86, { from: 'bottom' }) }, 'domeC(q)');
  P30({ shape: S.archFill(229, BASE - 739), at: [1707, BASE], depth: 26.95, thick: 0.4, in: IN('slide', 136.05, 136.8, { from: 'bottom' }) },
    `mix(${hexC('#380f9c')}, ${hexC('#33139a')}, smoothstep(800.0, 1060.0, q.y))`);
  // bottom left: four quarter discs (r 225) that flip in like puzzle pieces
  // (from 136.3, once the ramp joint has cleared, and rising from below the frame as they flip, so their edge-on start is
  // never seen: flipping in on screen they showed as thin shards under the ramp, like debris)
  P30({ shape: S.qdisc(225, 'bl'), at: [225, 635], depth: 25.6, thick: 0.45, in: IN('flip', 136.3, 136.9, { deg: -100, ease: 'back.out(1.2)' }), keys: { y: [[136.3, 480], [136.70, 0, 'power2.out']] } }, 'ulX(q.x)');
  P30({ shape: S.qdisc(225, 'tr'), at: [225, 860], depth: 25.7, thick: 0.45, in: IN('flip', 136.36, 136.96, { deg: 100, ease: 'back.out(1.2)' }), keys: { y: [[136.36, 480], [136.76, 0, 'power2.out']] } }, 'urY(q.y)');
  P30({ shape: S.qdisc(225, 'bl'), at: [225, 860], depth: 25.8, thick: 0.45, in: IN('flip', 136.42, 137.02, { deg: -100, ease: 'back.out(1.2)' }), keys: { y: [[136.42, 480], [136.82, 0, 'power2.out']] } }, 'llY(q.y)');
  P30({ shape: S.qdisc(225, 'tr'), at: [225, 1085], depth: 25.65, thick: 0.45, in: IN('flip', 136.48, 137.08, { deg: 100, ease: 'back.out(1.2)' }), keys: { y: [[136.48, 480], [136.88, 0, 'power2.out']] } }, 'lrC(q)');

  /* ---------- the sphere's dressing: halo, trail, beam (behind the sphere, never between it and the camera) ---------- */
  // Drawn in the opaque pass just before the sphere (renderOrder 1–3 < the sphere's 5), blended, not depth-tested: over the
  // set, under the sphere. Local coords are in sphere radii, screen-aligned (x right, y up); bb = the board px they
  // correspond to at the hold (sphere (1040, 670), r 170).
  const FXV = '#include <common>\n#include <logdepthbuf_pars_vertex>\nvarying vec2 vL;\nvoid main() { vL = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}';
  const FXF = body => `uniform float op, t, flow, spd;
varying vec2 vL;
#include <logdepthbuf_pars_fragment>
${LIB}${SLF}
void main() {
  vec2 bb = vec2(1040.0 + 170.0 * vL.x, 670.0 - 170.0 * vL.y);
  vec4 c = vec4(0.0); ${body}
  gl_FragColor = vec4(c.rgb, c.a * op);
#include <logdepthbuf_fragment>
}`;
  const fxMat = (frag, vs = FXV, u = {}) => new THREE.ShaderMaterial({ uniforms: { op: { value: 0 }, t: T, flow: FLOW, spd: SPD, ...u }, vertexShader: vs, fragmentShader: frag, transparent: false, depthTest: false, depthWrite: false,
    blending: THREE.CustomBlending, blendSrc: THREE.SrcAlphaFactor, blendDst: THREE.OneMinusSrcAlphaFactor, blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor, side: THREE.DoubleSide });
  const haloM = fxMat(FXF(`vec2 d = bb - vec2(1037.0, 648.0); float r = length(d), th = degrees(atan(-d.y, d.x));
  c = vec4(haloA(th), 0.95 * (1.0 - smoothstep(229.5, 233.5, r)));`));
  const trailM = fxMat(FXF(`float r = length(bb - vec2(1037.0, 545.0));
  c = vec4(${hexC('#3a1200')}, (1.0 - smoothstep(164.5, 168.5, r)) * mix(0.28, 0.56, smoothstep(390.0, 560.0, bb.y)));`));
  // the beam is built in its vertex shader (uniforms reach the GPU after onBeforeRender; geometry would lag a frame): NBR
  // rows along A → B, each widened across the view (uv.y 0 / 1) so that its SCREEN width tapers linearly from the top (bW.x,
  // world half-width at A: board 30's ~35 px at y 60) to the bottom (bW.y at B: ~130 px at the sphere's top at the hold,
  // scaling with the sphere as it comes at the camera): one smooth taper like the board's, no shoulders. vL.x is the
  // screen fraction along the beam
  const NBR = 24;
  const BV = `#include <common>
#include <logdepthbuf_pars_vertex>
uniform vec3 bA, bB; uniform vec2 bW;
varying vec2 vL;
float dep(vec3 p) { return max(-(viewMatrix * vec4(p, 1.0)).z, 0.05); }
vec2 scr(vec3 p) { vec4 c = projectionMatrix * viewMatrix * vec4(p, 1.0); return vec2(c.x * 960.0, c.y * 540.0) / max(c.w, 1e-4); }
void main() {
  vec3 Q = mix(bA, bB, uv.x), ax = normalize(bB - bA);
  float tv = 1.0 / projectionMatrix[1][1], k = tv / 540.0;
  vec2 sA = scr(bA), sB = scr(bB), d = sB - sA;
  float f = clamp(dot(scr(Q) - sA, d) / max(dot(d, d), 1e-6), 0.0, 1.0);
  float hpx = mix(bW.x / (dep(bA) * k), bW.y / (dep(bB) * k), f);
  vec3 P = Q + normalize(cross(ax, Q - cameraPosition)) * hpx * dep(Q) * k * (uv.y * 2.0 - 1.0);
  vL = vec2(f, uv.y); gl_Position = projectionMatrix * viewMatrix * vec4(P, 1.0);
#include <logdepthbuf_vertex>
}`;
  const beamM = fxMat(`uniform float op, t, flow;
varying vec2 vL;
#include <logdepthbuf_pars_fragment>
${LIB}
void main() {
  float u = vL.x, v = vL.y;
  float a = (0.2 + 0.78 * smoothstep(0.0, 0.3, u)) * smoothstep(0.0, 0.05, v) * (1.0 - smoothstep(0.95, 1.0, v));   // (near-opaque by the apex, u ≈ 0.33, so the triangle's tip doesn't read through it)
  gl_FragColor = vec4(beamU(u), a * op);
#include <logdepthbuf_fragment>
}`, BV, { bA: { value: new THREE.Vector3() }, bB: { value: new THREE.Vector3() }, bW: { value: new THREE.Vector2() } });
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 2.8).translate(-0.02, 0.13, 0), haloM);
  const trail = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.0).translate(-0.02, 0.735, 0), trailM);
  const bG = new THREE.BufferGeometry(); bG.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(NBR * 6), 3));
  { const uvs = [], idx = []; for (let i = 0; i < NBR; i++) { uvs.push(i / (NBR - 1), 0, i / (NBR - 1), 1); if (i) { const k = 2 * i; idx.push(k - 2, k, k - 1, k - 1, k, k + 1); } }
    bG.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); bG.setIndex(idx); }
  const beam = new THREE.Mesh(bG, beamM);
  [[halo, 1], [trail, 2], [beam, 3]].forEach(([m, o]) => { m.renderOrder = o; m.frustumCulled = false; m.visible = false; scene.add(m); });
  // the beam's top: inside the ring, just in front of the portal (board (1031, 72))
  const BA = onPlane(1031, 72, Pf.clone().addScaledVector(nP, 0.03), nP), BTOP = 17.5 * BA.clone().sub(h.pos).dot(h.fwd) * h.tanV / 540;   // 17.5 px half-width at the top, at the hold
  const ball = { p: new THREE.Vector3(), ok: false };
  const cp = new THREE.Vector3(), cr = new THREE.Vector3(), cu = new THREE.Vector3(), cf = new THREE.Vector3(), qc = new THREE.Quaternion();
  const camBasis = cam => { cam.matrixWorld.decompose(cp, qc, cf); cr.setFromMatrixColumn(cam.matrixWorld, 0).normalize(); cu.setFromMatrixColumn(cam.matrixWorld, 1).normalize(); cf.setFromMatrixColumn(cam.matrixWorld, 2).normalize().negate(); };
  // a screen-aligned plane BACK u behind the sphere, scaled so one local unit is the sphere's silhouette radius
  const BACK = 1.4;
  const fit = (mesh, cam) => {
    camBasis(cam);
    const w = ball.p.clone().sub(cp), d = w.length(), dz = Math.max(w.dot(cf), 1.05), k = (d + BACK) / d;
    mesh.position.copy(cp).addScaledVector(w, k); mesh.quaternion.copy(qc);
    mesh.scale.setScalar(dz * k / Math.sqrt(Math.max(dz * dz - 1, 0.01))); mesh.updateMatrixWorld(true);
  };
  halo.onBeforeRender = (r, s, cam) => fit(halo, cam);
  trail.onBeforeRender = (r, s, cam) => fit(trail, cam);
  beam.onBeforeRender = (r, s, cam) => {
    camBasis(cam);
    const w = ball.p.clone().sub(cp), d = w.length(), k = (d + BACK) / d, dz = Math.max(w.dot(cf), 1.05), rs = dz * k / Math.sqrt(Math.max(dz * dz - 1, 0.01));   // one sphere radius at B
    const u = beamM.uniforms; u.bA.value.copy(BA); u.bB.value.copy(cp).addScaledVector(w, k); u.bW.value.set(BTOP, 0.518 * rs);   // 88 px half-width at the sphere's centre at the hold (130 px wide at its top)
  };

  anim((t, b) => {
    const on = t > ON[0] && t < ON[1];
    const g = rampAt(t);
    const se = seAt(t);
    ramp.forEach(m => { m.visible = on && se > 0.02 && (se > 3.02 || !farM.includes(m)); }); tipM.forEach(m => { m.visible = on && g > 0.002; }); hideF29(t);
    const po = fadeIO(t, PORTAL) * (on ? 1 : 0); portal.visible = po > 0.002; portalM.uniforms.op.value = po; portalM.transparent = po < 0.999; portalM.depthWrite = po >= 0.999;
    ball.p.copy(b.p); ball.ok = !b.h;
    const a = fadeIO(t, [136.3, 136.85]) * (t < 139.4 ? 1 : 0) * (ball.ok ? 1 : 0);
    haloM.uniforms.op.value = trailM.uniforms.op.value = beamM.uniforms.op.value = a;
    halo.visible = trail.visible = beam.visible = a > 0.002;
  });
};
