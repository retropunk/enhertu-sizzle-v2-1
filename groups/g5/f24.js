/* Frame 24 · the arch (the sphere's arched path) and the dark doorway (G5, called from g5.js with its context G).
   BUILT (batch 5): every board 24 shape is real 3D and the plate is gone.
   · The arch: board 24's thick ∩ (measured: outer r 381 and doorway r 129.5 round board (860.7, 938.5), legs to the floor),
     its face in the sphere's plane (depth D24, z = m24.z). Its band is a CHANNEL: a half-pipe (radius 1.06) bent into the ∩
     along the sphere's own arc (about G.aC, centre-line radius G.aR + 0.06), open toward the camera, so the sphere lands in it
     on the left shoulder, rides it over the top and leaves it forward off the right shoulder ("the sphere moves through an
     arched path"; the board's sphere sits in the middle of the band, which a ball on the top edge could not). The sphere
     arrives by a leap that meets the channel tangentially just left of the top (g5.js), in front of the face, and settles
     into it. The legs run on 1.2 below the floor, so the channel's open ends at the feet are never seen. Its lips are
     0.15–0.25 wide, so from the hold camera the face is the board's band. Every surface takes board 24's colours at its place
     in the hold view (a smooth fit, mean error ~1.5/255); the channel is always shaded as a lit channel, by the view angle
     (not the clock): fully in the moves, and at ~40% from close to the key's viewpoint, so its rims and depth still show but
     the band reads as the board's flat coral → orange (the NEW RULE of 21:50), and the
     outer sides (pushed back along the hold camera's view rays: edge-on at the key, chunky when moving) read darker.
   · The doorway is a real tunnel 12.5 deep behind the arch's inner opening, in board 24's doorway colours (violet left half,
     dark right half), darkening with depth: gently from the key's viewpoint, fully as the camera closes in (it follows the
     camera's distance, not the clock), with 30 thin fog layers that skip the sphere's silhouette and a veil over the sphere
     carrying the fog in front of it, so it simply dims as it rolls in; the violet / dark split blends inside the tunnel
     (the push-in at the 115.15 cut; G6 starts in frame 25's dark tunnel).
   · Behind, back to front: a backdrop (board 24's navy with its violet glow low left), the orange stadium ring top right
     (outer r 323.5 / inner r 108 round (1222, 293), fading to navy low left, as the board draws it) with its dark indigo inner
     pill, the violet column low left, and the pink → orange field low right. The copy boxes (the pills, the & disc, the 100+
     panel and the 90+ band) are the copy layer (copy/c24.js); behind them the board's shapes simply run on.
   · The floor (not on the board: below its bottom edge at the hold) is dark violet with soft edges; the part behind the
     arch's face shows only away from the hold (at the hold it would peek in along the bottom edge). A soft contact shadow
     follows the sphere on it.
   · Build: the backdrop and floor fade in as the camera leaves 23, then the arch (with its tunnel) grows up out of the floor,
     the ring slides down, the column and the field grow up (109.0–110.1), all still before the leap. Nothing leaves: the
     dip at 115.15 covers the cut.
   Colours: fitted to board 24 (1920 px render of the storyboard), polynomial fields in board px; living gradients: one shared
   slow slide of the colour fields (zero at the key instant 111.95, so the hold is the board). */
export default (V, G) => {
  const { THREE, anim, mat, scene } = V;
  const { h24: H, aC, aR, floorY, proj, sm } = G;
  const Vec = THREE.Vector3;
  V.unplate(24);
  const TK = H.tk, DF = H.depth, kpx = d => d * H.tanV / 540;
  const ZF = aC.z;                                                        // the arch's face: the sphere's plane (= H.pos.z - DF)
  const YB = floorY - 1;                                                  // the floor's top (the sphere's centre rolls at floorY)
  const E = n => gsap.parseEase(n);
  const on = t => t > 108.3 && t < 115.2;                                 // my set exists only here (G5 ends at the 115.15 cut)

  /* ---------- board 24's colours (GLSL; fitted offline to the board, board px, sRGB bytes) ---------- */
  const hexC = h => { const n = parseInt(h.replace('#', ''), 16); return `vec3(${((n >> 16 & 255) / 255).toFixed(4)}, ${((n >> 8 & 255) / 255).toFixed(4)}, ${((n & 255) / 255).toFixed(4)})`; };
  const f1 = x => (+x).toFixed(1);
  const TERMS = ['1.0', 'u', 'v', 'u * u', 'u * v', 'v * v', 'u * u * u', 'u * u * v', 'u * v * v', 'v * v * v'];
  const polyFn = (name, C, lo, hi) => `vec3 ${name}(vec2 b) { b = clamp(b, vec2(${f1(lo[0])}, ${f1(lo[1])}), vec2(${f1(hi[0])}, ${f1(hi[1])}));
  float u = (b.x - 960.0) / 960.0, v = (b.y - 540.0) / 540.0;
  return clamp((${C.map((c, i) => `vec3(${c.map(x => x.toFixed(2)).join(', ')}) * ${TERMS[i]}`).join(' + ')}) / 255.0, 0.0, 1.0); }\n`;
  const stopsFn = (name, st) => `vec3 ${name}(float v) { vec3 c = ${hexC(st[0][1])};\n` +
    st.slice(1).map(([v, h], i) => `  c = mix(c, ${hexC(h)}, clamp((v - ${f1(st[i][0])}) / ${f1(v - st[i][0])}, 0.0, 1.0));`).join('\n') + '\n  return c; }\n';
  const LIB = [
    // the arch's band (mean error 1.5 on 0–255 over 1558 samples): pink/magenta low on the left leg → orange over the top and down the right
    polyFn('archC', [[252.33, 119.58, 54.59], [-15.12, 36.41, -100.82], [20.96, 16.43, -41.98], [-63.05, -123.11, 248.12], [11.02, 121.7, -298.77], [-27.96, -22.04, 30.57],
      [-85.68, -280.81, 721.01], [-7.79, 21.35, 61.59], [67.67, -31.32, 102.92], [0.57, -1.0, -2.75]], [482, 556], [1240, 1068]),
    // the stadium ring (mean error 2.5): orange along its top, brown down its left side, into the navy low left
    polyFn('ringC', [[45.03, 17.68, 96.73], [-33.43, 19.2, -40.69], [-103.01, -38.61, 1.37], [53.42, -14.59, 79.68], [-146.65, 31.54, -312.56], [100.4, 108.17, -127.56],
      [24.92, -12.49, 12.73], [122.68, -38.14, 148.32], [-57.32, -2.63, -193.98], [17.41, 50.12, -48.16]], [900, 8], [1905, 615]),
    // the field low right (mean error 4.8): pink at its left → orange at the right edge
    polyFn('fieldC', [[79.35, -39.3, 419.09], [103.02, 116.85, -319.93], [303.81, 153.22, -380.52], [5.59, 24.56, -53.94], [-120.36, -50.52, 225.17], [-120.52, -49.72, 98.28]], [1255, 870], [1912, 1062]),
    stopsFn('colC', [[560, '#5a13b9'], [760, '#5612b3'], [820, '#4d14aa'], [900, '#4813a7'], [1000, '#4911b0'], [1080, '#4d0eb7']]),
    stopsFn('pillC', [[185, '#3c0887'], [300, '#390884'], [400, '#310b78']]),
    stopsFn('doorL', [[810, '#4a16a8'], [860, '#4716a6'], [950, '#4214a3'], [1050, '#410fa0'], [1400, '#3c0c96']]),
    stopsFn('doorR', [[810, '#2c0b6c'], [860, '#2e0b6f'], [950, '#310a77'], [1050, '#37087e'], [1400, '#3a0885']]),
    // the backdrop: navy, with the violet glow in the bottom-left corner (mean error 5.6)
    `vec3 bgC(vec2 b) { float g = exp(-pow(b.x / 350.0, 2.0) - pow((1080.0 - b.y) / 350.0, 2.0)), v = clamp((b.y - 540.0) / 540.0, -1.6, 1.6);
  return clamp((vec3(41.19, 7.74, 96.98) + vec3(44.22, 2.09, 80.2) * g + vec3(4.51, -1.73, 8.75) * v) / 255.0, 0.0, 1.0); }
vec3 doorC(vec2 b, float w) { return mix(doorL(b.y), doorR(b.y), smoothstep(867.0 - w, 867.0 + w, b.x)); }
`].join('');
  // living gradients: one slow slide of every colour field (the set flows together), zero at the key instant
  const PER = 9.5, PH = 1.1, AMP = 24;
  const SLF = `vec2 SL(float t, float flow) { float fl = min(flow, 1.6), a = 6.2832 * ((t - ${TK.toFixed(4)}) * spd);
  return ${AMP.toFixed(1)} * fl * vec2(sin(a / ${PER.toFixed(2)} + ${PH.toFixed(2)}) - sin(${PH.toFixed(2)}), sin(a / ${(PER * 1.13).toFixed(3)} + ${(PH + 0.85).toFixed(2)}) - sin(${(PH + 0.85).toFixed(2)})); }\n`;

  /* ---------- material: every vertex carries bp, its board px in the hold view at its home pose (the colours ride with the
     shape and land exactly on the board at the hold) ---------- */
  const dm = mat(['#000000']);                                            // (unused: lends the engine's per-frame t and flow)
  // (NEW RULE, user 21:50: never switch the form shading off around a key.) The channel is always lit as a channel; the
  // tunnel's depth darkening follows the camera's distance to the doorway (0.4 from the key's viewpoint, so the doorway still
  // reads as the board's violet / dark halves, deepening to full dark as the camera pushes in after the sphere); only the
  // floor's strip behind the arch's face still hides around the key (it would peek in along the bottom edge).
  const hkT = { value: 1 }, hkF = { value: 1 }, ballP = { value: new Vec(0, -1e4, 0) };
  const VS = `#include <common>
#include <logdepthbuf_pars_vertex>
attribute vec2 bp;
varying vec2 vB; varying vec3 vN; varying vec3 vW;
void main() { vB = bp; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w;
#include <logdepthbuf_vertex>
}`;
  const LIGHT = 'normalize(vec3(-0.35, 0.75, 0.55))';
  // shade: 'slab' = faces toward the hold camera keep the board colour, sides darker (always); 'chan' = the channel: exact at the
  // hold, lit as a channel away from it; 'tun' = the tunnel: exact at the hold, darkening with depth away from it
  const HP = `vec3(${H.pos.x.toFixed(4)}, ${H.pos.y.toFixed(4)}, ${H.pos.z.toFixed(4)})`;
  const M = (body, shade, o = {}) => new THREE.ShaderMaterial({
    side: THREE.DoubleSide, transparent: !!o.transparent, depthWrite: o.depthWrite ?? true,
    uniforms: { t: dm.uniforms.t, flow: dm.uniforms.flow, spd: dm.uniforms.spd, hkT, op: { value: 1 }, ballP },
    vertexShader: VS,
    fragmentShader: `uniform float t, flow, spd, hkT, op; uniform vec3 ballP;
varying vec2 vB; varying vec3 vN; varying vec3 vW;
#include <logdepthbuf_pars_fragment>
${LIB}${SLF}
void main() {
  ${o.skipBall ? '{ vec3 rd = normalize(vW - cameraPosition), oc = cameraPosition - ballP; float bb = dot(oc, rd), cc = dot(oc, oc) - 1.0; if (bb < 0.0 && bb * bb - cc > 0.0) discard; }' : ''}
  vec2 q = vB + SL(t, flow);
  vec3 col = ${body};
  vec3 n = normalize(vN) * (gl_FrontFacing ? 1.0 : -1.0);
  ${shade === 'slab' ? 'col *= mix(0.70 + 0.12 * n.y - 0.05 * n.x, 1.0, smoothstep(0.55, 0.98, abs(n.z)));'
    // the channel: lit as a channel, fully in the moves; from close to the key's viewpoint only partly (its rims and depth
    // still show, but the band reads as board 24's flat coral → orange). It follows the view angle, never the clock.
    : shade === 'chan' ? `{ vec3 sh = col * mix(0.70 + 0.12 * n.y - 0.05 * n.x, 1.0, smoothstep(0.55, 0.98, abs(n.z))) * (0.58 + 0.42 * clamp(0.45 + 0.6 * dot(n, ${LIGHT}), 0.0, 1.0)) / 0.9;
    float dv = 1.0 - dot(normalize(cameraPosition - vW), normalize(${HP} - vW));
    col = mix(col, sh, mix(0.38, 1.0, smoothstep(0.0003, 0.012, dv))); }`
    : shade === 'tun' ? `col *= mix(1.0, 1.0 - 0.86 * smoothstep(0.2, 7.5, ${ZF.toFixed(4)} - vW.z), hkT);` : ''}
  float a = op${o.alpha ? ` * (${o.alpha})` : ''};
  gl_FragColor = vec4(col, a);
#include <logdepthbuf_fragment>
}` });

  /* ---------- geometry helpers ---------- */
  const withBp = g => { const p = g.attributes.position, bp = []; for (let i = 0; i < p.count; i++) { const [px, py] = proj(H, new Vec(p.getX(i), p.getY(i), p.getZ(i))); bp.push(px, py); }
    g.setAttribute('bp', new THREE.Float32BufferAttribute(bp, 2)); return g; };
  // a grid through rows of points (each row a polyline, all the same length)
  const grid = rows => { const n = rows[0].length, pos = [], idx = [];
    rows.forEach(r => r.forEach(p => pos.push(p.x, p.y, p.z)));
    for (let j = 0; j < rows.length - 1; j++) for (let i = 0; i < n - 1; i++) { const a = j * n + i, b = a + n; idx.push(a, b, a + 1, a + 1, b, b + 1); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return withBp(g); };
  // a board shape (THREE.Shape in board px round `at`, y up) laid in the hold view at depth d, extruded back along the hold
  // camera's view rays (thick world units): flat at the hold, chunky sides when the camera moves
  const slab = (shape, at, d, thick) => {
    const g0 = thick > 0 ? new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false, curveSegments: 72 }) : new THREE.ShapeGeometry(shape, 72);
    const p = g0.attributes.position, pos = [], bp = [];
    for (let i = 0; i < p.count; i++) { const px = at[0] + p.getX(i), py = at[1] - p.getY(i), w = H.at(px, py, d + (thick > 0 ? (1 - p.getZ(i)) * thick : 0)); pos.push(w.x, w.y, w.z); bp.push(px, py); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); if (g0.index) g.setIndex(g0.index);
    g.setAttribute('bp', new THREE.Float32BufferAttribute(bp, 2)); g.computeVertexNormals(); g0.dispose(); return g; };
  const group = () => { const g = new THREE.Group(); scene.add(g); return g; };
  const addTo = (grp, geo, m, ro = 0) => { const me = new THREE.Mesh(geo, m); me.frustumCulled = false; me.renderOrder = ro; grp.add(me); return me; };
  // board px shapes (y up round the anchor)
  const pillShape = (x0, x1, yc, r, at, holes = []) => { const s = new THREE.Shape(), X = x => x - at[0], Y = y => at[1] - y;
    s.moveTo(X(x0 + r), Y(yc + r)); s.lineTo(X(x1), Y(yc + r)); s.lineTo(X(x1), Y(yc - r)); s.lineTo(X(x0 + r), Y(yc - r)); s.absarc(X(x0 + r), Y(yc), r, Math.PI / 2, 1.5 * Math.PI, false);
    holes.forEach(h => s.holes.push(h)); return s; };
  const pillPath = (x0, x1, yc, r, at) => { const s = new THREE.Path(), X = x => x - at[0], Y = y => at[1] - y;   // clockwise (a hole)
    s.moveTo(X(x0 + r), Y(yc + r)); s.absarc(X(x0 + r), Y(yc), r, 1.5 * Math.PI, Math.PI / 2, true); s.lineTo(X(x1), Y(yc - r)); s.lineTo(X(x1), Y(yc + r)); s.lineTo(X(x0 + r), Y(yc + r)); return s; };

  /* ---------- the backdrop (behind everything; its far left dissolves so it never shows as an edge in the 23 → 24 move) ---------- */
  const DB = DF + 14;                                                     // behind the tunnel's end
  const gBack = group();
  const mBack = M('bgC(q)', '', { transparent: true, alpha: `smoothstep(${f1(H.pos.x - 21)}, ${f1(H.pos.x - 16.2)}, vW.x)` });
  { const at = [960, 540], s = new THREE.Shape(); [[-1100, -1500], [3400, -1500], [3400, 1900], [-1100, 1900]].forEach(([x, y], i) => i ? s.lineTo(x - at[0], at[1] - y) : s.moveTo(x - at[0], at[1] - y));
    addTo(gBack, slab(s, at, DB, 0), mBack, -2); }

  /* ---------- the stadium ring (top right) and its inner pill; behind the arch ---------- */
  const DR = DF + 3.4, gRing = group();
  { const at = [1223, 293];
    addTo(gRing, slab(pillShape(1223.2 - 323.5, 2700, 292.5, 323.5, at, [pillPath(1114, 2500, 293.5, 107.5, at)]), at, DR, 0.8), M('ringC(q)', 'slab'));
    addTo(gRing, slab(pillShape(1114, 2500, 293.5, 107.5, at), at, DR + 0.62, 0), M('pillC(q.y)', 'slab')); }   // (flat, recessed in the hole: no sides to meet its walls)

  /* ---------- the violet column low left (its top is under the pills at the hold: a rounded end for the moves) ---------- */
  const DC = DF + 2.3, gCol = group();
  // (its foot is just under the floor: 0.5 below the floor's top, still below the frame at the hold)
  const pyFoot = d => 540 + (H.pos.y - (YB - 0.5)) / kpx(d);
  { const at = [403.5, 900], s = new THREE.Shape(), X = x => x - at[0], Y = y => at[1] - y, r = 89.5, yb = pyFoot(DC);
    s.moveTo(X(314), Y(yb)); s.lineTo(X(493), Y(yb)); s.lineTo(X(493), Y(560 + r)); s.absarc(X(403.5), Y(560 + r), r, 0, Math.PI, false); s.lineTo(X(314), Y(yb));
    addTo(gCol, slab(s, at, DC, 0.5), M('colC(q.y)', 'slab')); }

  /* ---------- the pink → orange field low right (its left end is behind the arch's right leg; its top under the 90+ band) ---------- */
  const DFd = DF + 0.85, gField = group();
  { const at = [1700, 950], s = new THREE.Shape(), X = x => x - at[0], Y = y => at[1] - y, r = 140, yb = pyFoot(DFd);
    s.moveTo(X(1236), Y(yb)); s.lineTo(X(1236), Y(700 + r)); s.absarc(X(1236 + r), Y(700 + r), r, Math.PI, Math.PI / 2, true); s.lineTo(X(2900), Y(700)); s.lineTo(X(2900), Y(yb)); s.lineTo(X(1236), Y(yb));
    addTo(gField, slab(s, at, DFd, 0.4), M('fieldC(q)', 'slab')); }

  /* ---------- the arch: a thick ∩ whose band is a channel ---------- */
  const k0 = kpx(DF), Bc = H.at(860.7, 938.5, DF), RO = 381 * k0, RI = 129.5 * k0;
  const RG = 1.06, RHO = aR + RG - 1, T = 2.0;                            // the channel's radius; its centre-line (about aC); the arch's depth
  const NL = 16, NA = 132, NT = 26;
  // a ∩ at radius r about c in the face plane: up the left leg from the floor, over the top, down the right leg; with the
  // outward normal (N) at each point. Every ∩ here has the same sampling, so they pair up point by point.
  const cap = (c, r0, yb = YB) => { const P = [], r = typeof r0 === 'function' ? r0 : () => r0;
    for (let i = 0; i < NL; i++) P.push({ x: c.x - r(Math.PI), y: yb + (c.y - yb) * i / NL, nx: -1, ny: 0 });
    for (let i = 0; i <= NA; i++) { const a = Math.PI * (1 - i / NA); P.push({ x: c.x + r(a) * Math.cos(a), y: c.y + r(a) * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a) }); }
    for (let i = 1; i <= NL; i++) P.push({ x: c.x + r(0), y: c.y + (yb - c.y) * i / NL, nx: 1, ny: 0 });
    return P; };
  // (under the copy's 90+ band the outer edge runs 3 px wider: the band's cut-out, fitted by the copy, is 1–2 px wider than the
  // arch there, and the gap would show the navy behind as a hairline at the hold)
  const rOut = a => RO + 3 * k0 * sm((a - 0.08) / 0.12) * (1 - sm((a - 0.95) / 0.15));
  // (review fix: the arch's legs run on 1.2 below the floor's top, so the channel's open ends at its feet are never seen:
  // the floor covers them; the tunnel and the doorway's cross-sections keep the floor line)
  const YS = YB - 1.2, bO = cap(Bc, rOut, YS), bIa = cap(Bc, RI, YS), tC = cap(aC, RHO, YS), bI = cap(Bc, RI);
  const at3 = (q, dx = 0, dy = 0, z = ZF) => new Vec(q.x + dx, q.y + dy, z);
  const back = p => H.pos.clone().add(p.clone().sub(H.pos).multiplyScalar((DF + T) / DF));
  const gArch = group(), mArch = M('archC(q)', 'slab'), mChan = M('archC(q)', 'chan'), mTun = M(`doorC(q, 1.5 + 70.0 * smoothstep(0.3, 5.0, ${ZF.toFixed(4)} - vW.z))`, 'tun');
  addTo(gArch, grid([bO.map(q => at3(q)), tC.map(q => at3(q, RG * q.nx, RG * q.ny))]), mArch);                       // the outer lip
  addTo(gArch, grid([tC.map(q => at3(q, -RG * q.nx, -RG * q.ny)), bIa.map(q => at3(q))]), mArch);                    // the inner lip
  { const rows = []; for (let j = 0; j <= NT; j++) { const th = Math.PI * j / NT, c = Math.cos(th), s = Math.sin(th);   // the channel
      rows.push(tC.map(q => at3(q, RG * c * q.nx, RG * c * q.ny, ZF - RG * s))); }
    addTo(gArch, grid(rows), mChan); }
  addTo(gArch, grid([bO.map(q => at3(q)), bO.map(q => back(at3(q)))]), mArch);                                       // the outer sides
  // the tunnel: the doorway's ∩ straight back 12.5 (dense rows: its colours are looked up by where it sits in the hold view)
  const ZE = ZF - 12.5, NZ = 48, zAt = j => ZF - (ZF - ZE) * Math.pow(j / NZ, 1.35);
  { const rows = []; for (let j = 0; j <= NZ; j++) rows.push(bI.map(q => at3(q, 0, 0, zAt(j))));
    addTo(gArch, grid(rows), mTun);
    const fl = []; for (let j = 0; j <= NZ; j++) fl.push([new Vec(Bc.x - RI, YB, zAt(j)), new Vec(Bc.x + RI, YB, zAt(j))]);
    addTo(gArch, grid(fl), mTun); }
  // frontal cross-sections of the doorway: the tunnel's end cap and its fog layers
  const doorShape = new THREE.Shape(bI.map(q => new THREE.Vector2(q.x, q.y)));
  const secGeo = z => { const g = new THREE.ShapeGeometry(doorShape, 1); g.translate(0, 0, z); return withBp(g); };
  addTo(gArch, secGeo(ZE), mTun);
  // fog: thin layers of the tunnel's own colours from 0.9 inside the mouth; the sphere fades as it rolls in (≈99% gone ~6 in)
  const fogM = [], fogZ = [];
  for (let i = 0; i < 30; i++) { const z = ZF - 0.9 - 0.34 * i, m = M(`doorC(q, 1.5 + 70.0 * smoothstep(0.3, 5.0, ${ZF.toFixed(4)} - vW.z))`, 'tun', { transparent: true, depthWrite: false, skipBall: true }); m.uniforms.op.value = 0.03 + 0.22 * sm(i / 14);
    fogM.push(m); fogZ.push(z); addTo(gArch, secGeo(z), m, 2); }
  /* the sphere in the fog (review fix: the layers used to cut through it, so it read as a see-through bubble with an inner
     disc). The layers now skip the sphere's silhouette (skipBall), and this veil, a disc facing the camera just in front of
     the sphere and sized to its silhouette (in the vertex shader), lays over it exactly the fog of the layers in front of
     its centre: it simply dims, evenly, as it rolls deeper. */
  const veilU = { ballP, col: { value: new THREE.Color() }, a: { value: 0 } };
  const veil = new THREE.Mesh(new THREE.CircleGeometry(1, 64), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, uniforms: veilU,
    vertexShader: `#include <common>
#include <logdepthbuf_pars_vertex>
uniform vec3 ballP; varying float vR;
void main() { vec3 dir = cameraPosition - ballP; float d = length(dir); dir /= d;
  vec3 rt = normalize(cross(dir, abs(dir.y) < 0.95 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0))), up = cross(rt, dir);
  float r = (d - 1.002) / sqrt(max(d * d - 1.0, 1e-4)) * 1.035; vR = length(position.xy);
  gl_Position = projectionMatrix * viewMatrix * vec4(ballP + dir * 1.002 + (rt * position.x + up * position.y) * r, 1.0);
#include <logdepthbuf_vertex>
}`,
    fragmentShader: `uniform vec3 col; uniform float a; varying float vR;
#include <logdepthbuf_pars_fragment>
void main() { gl_FragColor = vec4(col, a * (1.0 - smoothstep(0.975, 1.0, vR)));
#include <logdepthbuf_fragment>
}` }));
  veil.frustumCulled = false; veil.renderOrder = 6; scene.add(veil);
  const fogBase = [0.224, 0.059, 0.549], fogA = fogM.map(m => m.uniforms.op.value);

  /* ---------- the floor: dark violet, soft edges; its part behind the arch's face shows only away from the hold ---------- */
  const X0 = 47.9 + (H.pos.x - 55.39), X1 = 72 + (H.pos.x - 55.39);       // (G.kick is 47.5: frame 23's floor ends there)
  const mFloor = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: { op: { value: 0 }, hkF },
    vertexShader: '#include <common>\n#include <logdepthbuf_pars_vertex>\nvarying vec3 vW;\nvoid main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w;\n#include <logdepthbuf_vertex>\n}',
    fragmentShader: `uniform float op, hkF; varying vec3 vW;
#include <logdepthbuf_pars_fragment>
void main() {
  float x = vW.x, z = vW.z, bx = ${Bc.x.toFixed(4)}, zf = ${ZF.toFixed(4)};
  if (z < zf && abs(x - bx) < ${RI.toFixed(4)}) discard;                               // the tunnel has its own floor
  float a = smoothstep(${f1(X0)}, ${f1(X0 + 1.8)}, x) * (1.0 - smoothstep(${f1(X1 - 3.5)}, ${f1(X1)}, x))
          * (1.0 - smoothstep(zf + 5.5, zf + 12.5, z)) * smoothstep(zf - 9.0, zf - 5.0, z);
  a *= mix(hkF, 1.0, smoothstep(zf - 0.42, zf - 0.3, z));                             // behind the face: only away from the key
  float d = length(vec2((x - bx) * 0.75, z - zf));
  vec3 col = mix(${hexC('#3a1392')}, ${hexC('#1c0a4d')}, smoothstep(0.0, 11.0, d));
  // a soft darkening along the arch's foot (it grounds the arch, and the channel's open ends read as shade)
  col *= 1.0 - 0.34 * (1.0 - smoothstep(0.0, 1.3, abs(z - zf + 0.5))) * (1.0 - smoothstep(${f1(RO + 0.1)}, ${f1(RO + 0.9)}, abs(x - bx)));
  gl_FragColor = vec4(col, op * a);
#include <logdepthbuf_fragment>
}` });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(X1 - X0 + 1, 22), mFloor);
  floor.rotation.x = -Math.PI / 2; floor.position.set((X0 + X1) / 2, YB - 0.01, ZF + 1.5); floor.frustumCulled = false; scene.add(floor);

  /* ---------- the sphere's soft contact shadow on the floor (fades into the tunnel's dark) ---------- */
  const mSh = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4, uniforms: { op: { value: 0 } },
    vertexShader: '#include <common>\n#include <logdepthbuf_pars_vertex>\nvarying vec2 vP;\nvoid main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}',
    fragmentShader: 'uniform float op; varying vec2 vP;\n#include <logdepthbuf_pars_fragment>\nvoid main() { float r = length(vP); gl_FragColor = vec4(0.04, 0.01, 0.09, op * 0.5 * (1.0 - smoothstep(0.3, 1.0, r)));\n#include <logdepthbuf_fragment>\n}' });
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(1.1, 48), mSh); shadow.rotation.x = -Math.PI / 2; shadow.renderOrder = 1; shadow.frustumCulled = false; scene.add(shadow);

  /* ---------- timing ---------- */
  const rise = (t, a, b, e = 'expo.out') => E(e)(Math.min(1, Math.max(0, (t - a) / (b - a))));
  const growUp = (g, s) => { g.scale.y = Math.max(1e-3, s); g.position.y = YB * (1 - s); };             // grows up out of the floor
  const fadeMat = (m, a) => { m.uniforms.op.value = a; m.transparent = a < 0.999 || m === mBack; m.depthWrite = a >= 0.999 && m !== mBack; };
  anim((t, b) => {
    const vis = on(t);
    for (const g of [gBack, gRing, gCol, gField, gArch]) g.visible = vis;
    floor.visible = vis; shadow.visible = vis && !b.h;
    ballP.value.copy(b.h ? new Vec(0, -1e4, 0) : b.p);
    veil.visible = false;
    if (!vis) return;
    hkF.value = 1 - Math.min(sm((t - (H.t0 - 0.45)) / 0.4), 1 - sm((t - H.t1) / 0.45));
    const cp = V.camAt(t), dc = cp ? Math.hypot(cp[0] - Bc.x, cp[1] - Bc.y, cp[2] - ZF) : 99;
    hkT.value = 0.25 + 0.75 * sm((20 - dc) / 11);                        // (review: 0.4 read ~18% darker than the board)
    // the veil: composite the layers in front of the sphere's centre (back to front), each in its own depth-darkened colour
    if (!b.h && b.p.z < ZF - 0.5) { let A = 0; const C = [0, 0, 0];
      for (let i = fogZ.length - 1; i >= 0; i--) { const ai = fogA[i] * sm((fogZ[i] - b.p.z) / 0.34 + 0.5); if (ai < 1e-4) continue;
        const k = 1 - 0.86 * sm((ZF - fogZ[i] - 0.2) / 7.3) * hkT.value;
        for (let j = 0; j < 3; j++) C[j] = C[j] * (1 - ai) + fogBase[j] * k * ai; A = A * (1 - ai) + ai; }
      if (A > 0.002) { veil.visible = true; veilU.a.value = A; veilU.col.value.setRGB(C[0] / A, C[1] / A, C[2] / A); } }
    fadeMat(mBack, sm((t - 108.4) / 0.8));
    mFloor.uniforms.op.value = sm((t - 108.7) / 0.6);
    growUp(gArch, rise(t, 109.0, 109.85));
    growUp(gCol, rise(t, 109.25, 110.0));
    growUp(gField, rise(t, 109.35, 110.1));
    // the subtle hold drift (a few board px, zero at the key instant; the arch stays put: the sphere runs in it)
    const dr = (d, ph) => 3 * kpx(d) * Math.sin(6.2832 * (t - TK) / 7.3 + ph) - 3 * kpx(d) * Math.sin(ph);
    gRing.position.set(dr(DR, 0.4), 7.5 * (1 - rise(t, 109.15, 109.95)) + dr(DR, 2.1), 0);
    gCol.position.x = dr(DC, 1.3); gField.position.x = dr(DFd, 2.9);
    // the contact shadow: under the sphere while it rolls on the floor (the hook and into the tunnel)
    const onFloor = Math.abs(b.p.y - floorY) < 0.06 && b.p.x > X0 + 1 && b.p.x < X1 - 1;
    mSh.uniforms.op.value = onFloor ? mFloor.uniforms.op.value * (1 - sm((ZF - 0.2 - b.p.z) / 2.5)) : 0;
    shadow.position.set(b.p.x, YB + 0.004, b.p.z);
  });
};
