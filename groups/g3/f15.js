/* Frame 15 · frontal on the doorway wall; the sphere turns into the doorway before the wipe (G3, called from g3.js with its
   context G). Built (batch 3): every board 15 shape is real 3D, the plate is gone.
   · The wall (camera 15's view, depths from its lens; the sphere is at 13.7): a backdrop (board 15's dark indigo, the maroon
     glow top left, violet low down) and its reliefs, back to front: the violet → orange bar at the top left, the violet
     shape behind the KOL stills, the orange-red shape low left, the wide top band (orange → violet → magenta), the orange
     block (rounded top left), the orange rect top right, and the thick ∩ portal (violet at the top, magenta down its left
     jamb, orange down its right one).
   · The doorway is real: a tunnel through the wall, sheared along the sphere's way in (it runs in at ~27° to the wall), dark
     inside (board 15's near-black navy, lighter violet low down), with layered dark fog so the sphere fades into it and never
     pops. The four slats sit just inside the mouth (orange at their left ends, fading to dark violet); they slide in out of
     the right jamb as the camera lands and slide back into it, bottom first, as the sphere turns in (the door opens for it).
   · The floor: a narrow ledge (the ramp) under the sphere from the foot of frame 14's hill, straight on, round the bend and into
     the doorway (it becomes the tunnel's floor). (revision, user 2026-09-27: "The ramp should go down and curve around to
     connect to what would be the hill ramp inside of frame 15 … keep it there so it makes sense.") It is a solid path all the
     way, the key moment included (it used to switch to the board's floorless look at the hold): orange → coral → magenta →
     violet into the doorway's dark. Frame 15's set sits where this ramp takes the sphere: g3.js places the key camera behind
     it looking −z (it looked −x before the revision); everything here is built round that camera and the path, so it moved
     with it unchanged.
   · Build: the backdrop and the ledge fade in while they're still off screen; the reliefs push out of the wall (61.9–63.1)
     before the camera comes round onto it (~62.8); the portal and tunnel are in place before they're seen.
     Nothing leaves: the wipe covers the cut at 66.85.
   Shapes, positions and colours are measured from board 15 (edge scans and colour samples; board px, 1920×1080). */
export default (V, G) => {
  const { THREE, h15: H, C, L, sOf, sm } = G;
  const { anim } = V;
  const Vec = THREE.Vector3;
  const TK = H.tk;                                                        // 64.6: the gradients pass through the board colours here
  V.unplate(15);
  const kpx = d => d * H.tanV / 540;                                      // world units per board px at depth d (camera 15)
  const L3 = (r, u, f) => H.pos.clone().addScaledVector(H.right, r).addScaledVector(H.upv, u).addScaledVector(H.fwd, f);
  const loc = p => { const d = p.clone().sub(H.pos); return [d.dot(H.right), d.dot(H.upv), d.dot(H.fwd)]; };
  const hexC = h => { const n = parseInt(h.replace('#', ''), 16); return `vec3(${((n >> 16 & 255) / 255).toFixed(4)}, ${((n >> 8 & 255) / 255).toFixed(4)}, ${((n & 255) / 255).toFixed(4)})`; };
  const f1 = x => (Math.round(x * 10) / 10).toFixed(1);

  /* ---------- where the doorway is: the sphere's way in is straight after its mark; the portal's plane is where that line
     crosses the opening's centre (board x 1612.5), so the sphere goes through the middle of the door ---------- */
  const sM = sOf('m15'), pAt = s => C.getPointAt(Math.min(1, Math.max(0, s / L)));
  const pxS = s => { const [r, , f] = loc(pAt(s)); return 960 + r / kpx(f); };
  let sa = sM, sb = L; for (let i = 0; i < 60; i++) { const m = (sa + sb) / 2; if (pxS(m) < 1612.5) sa = m; else sb = m; }
  const sDoor = (sa + sb) / 2, Da = loc(pAt(sDoor))[2];                   // the portal's front face (≈ 21.1)
  const PA = loc(pAt(sM + 1)), PB = loc(pAt(L - 0.5));
  const KSH = (PB[0] - PA[0]) / (PB[2] - PA[2]);                          // the way in: lateral per unit depth (≈ 0.51)
  const uF = PA[1] - 1;                                                   // the floor (ledge top), camera-15 coords
  const LEN = 12, DB = Da + 1.65;                                         // tunnel length; the backdrop plane

  /* ---------- board 15's colours (GLSL, generated from the measured samples) ---------- */
  const stopsFn = (name, st) => `vec3 ${name}(float v) { vec3 c = ${hexC(st[0][1])};\n` +
    st.slice(1).map(([v, h], i) => `  c = mix(c, ${hexC(h)}, clamp((v - ${f1(st[i][0])}) / ${f1(v - st[i][0])}, 0.0, 1.0));`).join('\n') + '\n  return c; }\n';
  // a smooth, bounded blend of colour anchors (no overshoot, no bands)
  const fieldFn = (name, pts, kern, pw = 2) => `vec3 ${name}(vec2 b) { vec3 s = vec3(0.0); float ws = 0.0, w; vec2 d;\n` +
    pts.map(([x, y, h]) => `  d = b - vec2(${f1(x)}, ${f1(y)}); w = pow(1.0 + dot(d, d) * ${(1 / (kern * kern)).toExponential(5)}, ${(-pw).toFixed(2)}); s += w * ${hexC(h)}; ws += w;`).join('\n') + '\n  return s / ws; }\n';
  const BAND = [[700, 10, 'fe7901'], [780, 10, 'fc7701'], [860, 10, 'f67105'], [940, 10, 'ea671e'], [1020, 10, 'cf5a4d'], [1100, 10, 'ae4b9a'], [1180, 10, '983ed5'], [1260, 10, '9236ed'],
    [1340, 10, '9b32e0'], [1420, 10, 'a631ce'], [1500, 10, 'b62fbc'], [1580, 10, 'bf30b2'], [1660, 10, 'c231b4'],
    [700, 60, 'f97303'], [860, 60, 'ec6614'], [1020, 60, 'c04a69'], [1180, 60, '842eec'], [1340, 60, '8725ef'], [1500, 60, 'a725c9'], [1580, 60, 'af27bf'],
    [700, 110, 'f56b09'], [860, 110, 'e25b24'], [940, 110, 'cd4d48'], [1020, 110, 'b13b80'], [1100, 110, '8f2ac0'], [1180, 110, '761def'], [1260, 110, '6c19fe'], [1340, 110, '7619f6'], [1420, 110, '861ae0'],
    [780, 160, 'e75d1b'], [860, 160, 'da5133'], [940, 160, 'c2415a'], [1020, 160, 'a22e92'], [1100, 160, '821ace'], [1180, 160, '690cf8'], [1260, 160, '610bfd'], [1340, 160, '670ef8'],
    [860, 210, 'd24940'], [940, 210, 'b93869'], [1020, 210, '9a239e'], [1100, 210, '7a0ed6'], [1180, 210, '6000fc'], [1260, 210, '5902fe'],
    [860, 285, 'c14559'], [940, 285, 'b23273'], [1020, 285, '931da7'], [1100, 285, '7409da'], [1180, 285, '5c00f8'], [1260, 285, '5300fd'],
    [700, -400, 'ff7c00'], [1100, -400, 'b64c96'], [1600, -400, 'c233b3'], [1450, 240, '5a04fe'], [1650, 140, '8a22d6']];
  const BLOCK = [[1000, 380, 'fd9403'], [1100, 380, 'fe8f04'], [1180, 380, 'fc881a'], [950, 420, 'ff9400'], [1050, 420, 'ff9101'], [1150, 420, 'ff8c0d'],
    [900, 480, 'fd9201'], [1000, 480, 'fe9000'], [1100, 480, 'fe8c04'], [1200, 480, 'f8861b'], [850, 560, 'fe8d01'], [1000, 560, 'ff8c00'], [1100, 560, 'ff8904'], [1200, 560, 'f68017'],
    [850, 640, 'ff8800'], [1000, 640, 'fe8500'], [1100, 640, 'fc8002'], [1200, 640, 'f27718'], [1250, 640, 'e87032'],
    [850, 690, 'fd8003'], [1000, 690, 'fc7d04'], [1100, 690, 'fb7704'], [1200, 690, 'ec6e23'], [1255, 690, 'e06935'], [1265, 780, 'cd5159'], [1265, 870, 'b33c7c'], [1265, 1020, '9b239e'],
    [900, 1030, 'ec5d19'], [960, 1030, 'e6571f'], [1020, 1030, 'db512c'], [1080, 1030, 'ce483f'], [1140, 1030, 'c13c59'], [1200, 1030, 'b03176'],
    [1350, 500, 'dc6a3c'], [1400, 800, 'b8407a'], [1000, 850, 'f27010'], [1150, 850, 'd65a3a']];
  // the portal: by angle round its arc centre (1613.5, 409); 0° = right, counter-clockwise (under the sphere, 170–215°, and
  // under the stills, 240–300°, the colours are continued smoothly)
  const ARCH = [[0, 'c84f55'], [15, 'b33c7c'], [30, '9f2ba4'], [45, '8a1ac5'], [60, '790ce0'], [75, '6b03f2'], [90, '5f00fd'], [105, '5700ff'], [120, '5000ff'], [135, '4e01ff'],
    [150, '5506ff'], [165, '5d09fe'], [185, '7414ee'], [200, 'a42ccc'], [216, 'd23aae'], [228, 'da429d'], [240, 'c63c9a'], [258, 'a02cb8'], [272, 'd05a60'], [285, 'f07a14'], [300, 'f7820a'],
    [308, 'f67d08'], [316, 'f37708'], [330, 'ee6e13'], [345, 'dd602f'], [360, 'c84f55']];
  const GLSL_LIB = [
    stopsFn('backY', [[-900, '#2b0b58'], [0, '#270b5a'], [300, '#251160'], [450, '#22115c'], [620, '#1f1460'], [690, '#2b1174'], [720, '#320f83'], [760, '#3c0c96'], [900, '#4108a0'], [1500, '#35088a'], [2600, '#22075a']]),
    stopsFn('tlX', [[280, '#7c15d0'], [310, '#9228b0'], [330, '#a63e8b'], [350, '#bd5268'], [370, '#d76443'], [390, '#e97626'], [410, '#ee7625'], [440, '#f07526']]),
    stopsFn('trY', [[-600, '#ff7a14'], [10, '#fe731b'], [90, '#fd701e'], [170, '#fc6c21'], [210, '#fc691f'], [300, '#f86422']]),
    stopsFn('violetX', [[300, '#2d076c'], [420, '#37077d'], [540, '#3b078f'], [660, '#4204a4'], [720, '#4504aa'], [780, '#3a0682'], [880, '#320870']]),
    stopsFn('blX', [[-1500, '#f58a1a'], [0, '#f0731f'], [120, '#eb6d21'], [240, '#eb6526'], [360, '#ee5c2b'], [480, '#f34e32'], [600, '#fe4034'], [630, '#ff3a31']]),
    stopsFn('inY', [[250, '#060720'], [300, '#090828'], [380, '#0b082c'], [450, '#0f0832'], [520, '#150840'], [600, '#1f084e'], [650, '#230855'], [690, '#25085c'], [1030, '#4404a6'], [1600, '#35068a']]),
    stopsFn('slatX', [[1458, '#d4622c'], [1540, '#c85c35'], [1580, '#8d3a5b'], [1620, '#5a1f75'], [1660, '#36087f'], [1700, '#2c086f'], [1740, '#1e0950'], [1767, '#140a3c']]),
    stopsFn('archA', ARCH),
    fieldFn('bandF', BAND, 70),
    fieldFn('blockF', BLOCK, 95),
    `const vec3 MAROON = ${hexC('5e1f36')}, VLOW = ${hexC('7f0cf0')}, MAGENTA = ${hexC('c50df6')};
vec3 cBack(vec2 b) { float g = exp(-pow(b.x / (b.x > 0.0 ? 230.0 : 520.0), 2.0) - pow(b.y / 300.0, 2.0)); return mix(backY(b.y), MAROON, clamp(g * 1.05, 0.0, 1.0)); }
vec3 cArch(vec2 b, float da) { float a = mod(degrees(atan(409.0 - b.y, b.x - 1613.5)) + da + 360.0, 360.0); return mix(archA(a), VLOW, smoothstep(780.0, 900.0, b.y)); }
float sdRB(vec2 p, vec2 c, vec2 h, float r) { vec2 q = abs(p - c) - h + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
float cov(float d, float e) { return 1.0 - smoothstep(-e, e, d); }
float dOpen(vec2 b) { return b.y >= 424.0 ? max(1458.5 - b.x, b.x - 1766.5) : length(b - vec2(1612.5, 424.0)) - 154.0; }
float dArch(vec2 b) { return b.y >= 409.0 ? max(1269.5 - b.x, b.x - 1957.5) : length(b - vec2(1613.5, 409.0)) - 344.0; }
// the board below its top band, as seen from the hold camera (what the ledge and the tunnel show at the hold)
vec3 boardCol(vec2 b, vec2 sl, float e) {
  vec2 q = b + sl;
  vec3 c = cBack(q);
  c = mix(c, violetX(q.x), cov(sdRB(b, vec2(650.0, 1400.0), vec2(250.0, 755.0), 110.0), e));
  c = mix(c, blX(q.x), cov(sdRB(b, vec2(-1200.0, 1600.0), vec2(1830.0, 840.0), 200.0), e));
  c = mix(c, blockF(q), cov(sdRB(b, vec2(1135.5, 732.0), vec2(304.5, 372.0), 230.0), e));
  float dO = dOpen(b);
  c = mix(c, cArch(b, sl.x * 0.06), cov(max(dArch(b), -dO), e));
  vec3 ci = mix(inY(q.y), MAGENTA, cov(length(b - vec2(1770.0, 801.0)) - 155.0, e));
  return mix(c, ci, cov(dO, e));
}
`].join('');
  // one shared living drift for the whole set (so the pieces and the ledge flow together); zero at the key instant
  const PER = 9.5, PH = 1.1, AMP = 26;
  const SLF = `vec2 SL(float t, float flow) { float fl = min(flow, 1.6), a = 6.2832 * ((t - ${TK.toFixed(4)}) * spd);
  return ${AMP.toFixed(1)} * fl * vec2(sin(a / ${PER.toFixed(2)} + ${PH.toFixed(2)}) - sin(${PH.toFixed(2)}), sin(a / ${(PER * 1.13).toFixed(3)} + ${(PH + 0.85).toFixed(2)}) - sin(${(PH + 0.85).toFixed(2)})); }\n`;

  /* ---------- piece material: the shape's board colours in its own board px (they ride with the shape) ---------- */
  const PV = '#include <common>\n#include <logdepthbuf_pars_vertex>\nvarying vec3 vO; varying vec3 vNv;\nvoid main() { vO = position; vNv = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}';
  const PF = (body, alpha = '1.0') => `uniform float op, t, flow, spd; uniform vec2 at;
varying vec3 vO; varying vec3 vNv;
#include <logdepthbuf_pars_fragment>
${GLSL_LIB}${SLF}
void main() {
  vec2 sl = SL(t, flow), b = at + vec2(vO.x, -vO.y), q = b + sl;
  vec3 col = ${body};
  vec3 nv = normalize(vNv); float shade = mix(0.72 + 0.12 * nv.y - 0.05 * nv.x, 1.0, smoothstep(0.55, 0.98, abs(nv.z)));
  gl_FragColor = vec4(col * shade, op * (${alpha}));
#include <logdepthbuf_fragment>
}`;
  const swaps = [];
  anim(() => { for (const [a, b] of swaps) { b.transparent = a.transparent; b.depthWrite = a.depthWrite; } });
  // flat at the hold: the back face is pushed out along camera 15's view rays, so the sides are edge-on at the hold and open
  // up as soon as the camera moves ("flat at the hold, chunky sides when the camera moves")
  const flatGeo = (g, at, d) => { const p = g.attributes.position; g.computeBoundingBox(); const zb = g.boundingBox.min.z; if (zb > -1e-6) return g;
    const tw = -zb * kpx(d);
    for (let i = 0; i < p.count; i++) if (p.getZ(i) < zb / 2) { const x = p.getX(i), y = p.getY(i); p.setXY(i, x + (at[0] - 960 + x) * tw / d, y + (540 - at[1] + y) * tw / d); }
    p.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingBox(); return g; };
  const P15 = (spec, body, alpha) => {
    const pc = V.piece({ hold: 15, ...spec });
    flatGeo(pc.mesh.geometry, spec.at, spec.depth);
    const o0 = pc.mesh.material;
    const m = new THREE.ShaderMaterial({ uniforms: { op: o0.uniforms.op, t: o0.uniforms.t, flow: o0.uniforms.flow, spd: o0.uniforms.spd, at: { value: new THREE.Vector2(...spec.at) } },
      vertexShader: PV, fragmentShader: PF(body, alpha), side: o0.side });
    pc.mesh.material = m; swaps.push([o0, m]); return pc; };
  // pushes out of the wall: starts just behind the backdrop (hidden), comes forward into place
  const emerge = (depth, thick, a, dur = 0.8) => ({ z: [[a, DB - depth + thick + 0.08], [a + dur, 0, 'power3.out']], op: [[a - 0.01, 0], [a, 1]] });

  /* ---------- the backdrop: one wall behind everything, with a hole where the tunnel goes through ---------- */
  // the tunnel's cross-section in camera-15 coords at the portal plane (lateral r, height u): the opening's ∩ (jambs at board x
  // 1458.5 and 1766.5, arc centre (1612.5, 424), r 154), from the ledge's underside up
  const kA = kpx(Da), rL = (1458.5 - 960) * kA, rR = (1766.5 - 960) * kA, rC = (1612.5 - 960) * kA, uA = (540 - 424) * kA, rI = 154 * kA, uB = uF - 0.72;
  const outline = (grow = 0, nArc = 48) => { const P = [[rL - grow, uB - grow], [rL - grow, uA]];
    for (let i = 1; i < nArc; i++) { const a = Math.PI * (1 - i / nArc); P.push([rC + (rI + grow) * Math.cos(a), uA + (rI + grow) * Math.sin(a)]); }
    P.push([rR + grow, uA], [rR + grow, uB - grow]); return P; };
  const shiftAt = f => KSH * (f - Da);
  let flowU = { value: 1 }, spdU = { value: 1 };                                                // the engine's gradient-flow setting (shared with the projected materials)
  { const hole = new THREE.Path(outline(0.1).map(([r, u]) => { r += shiftAt(DB); return new THREE.Vector2((960 + r / kpx(DB)) - 960, (540 - u / kpx(DB)) - 540).multiply(new THREE.Vector2(1, -1)); }).reverse());
    const at = [960, 540], s = new THREE.Shape([[-4400, -2500], [2000, -2500], [2000, 1500], [-4400, 1500]].map(([x, y]) => new THREE.Vector2(x, y)));
    s.holes.push(hole);
    // (its far end, off the board's left, dissolves into the background instead of ending in a hard edge on the approach)
    const bd = P15({ shape: s, at, depth: DB, thick: 0, drift: 0, in: { type: 'fade', t: [61.15, 61.9], ease: 'sine.inOut' } }, 'cBack(q)', 'smoothstep(-3350.0, -1700.0, b.x)');
    anim(() => { bd.mesh.material.transparent = true; }); flowU = bd.mesh.material.uniforms.flow; spdU = bd.mesh.material.uniforms.spd; }

  /* ---------- the reliefs, back to front ---------- */
  // (fix pass 2: each pushes out of the wall 0.5 s earlier (61.95–62.45, was 62.45–62.95), and the portal and tunnel are in by
  //  62.35: as the camera swings off frame 14's hill the wall is already building, so 61.7–62.8 isn't a bare hill and floor)
  const rect = (x0, y0, x1, y1, at) => V.S.poly([[x0, y1], [x1, y1], [x1, y0], [x0, y0]], at);
  // the violet → orange bar at the top left (its rounded foot is behind the KOLs box)
  { const at = [360, 0], s = new THREE.Shape(); s.moveTo(-80, 900); s.lineTo(-80, -70); s.absarc(0, -70, 80, Math.PI, 2 * Math.PI, false); s.lineTo(80, 900); s.lineTo(-80, 900);
    P15({ shape: s, at, depth: DB - 0.6, thick: 0.4, keys: emerge(DB - 0.6, 0.4, 62.3) }, 'tlX(q.x)'); }
  // the violet shape behind the KOL stills (its top traced from board 15; flat top at y ~645, rounded shoulders)
  { const top = [[396, 720], [402, 690], [410, 668], [420, 655], [440, 650], [460, 647], [480, 646], [560, 645], [660, 644], [680, 648], [700, 654], [720, 664], [740, 676], [760, 692], [772, 708], [790, 760], [830, 880], [870, 1000], [900, 1150], [910, 2200], [380, 2200], [390, 800]];
    P15({ shape: V.S.poly(top, [650, 900]), at: [650, 900], depth: DB - 0.7, thick: 0.45, keys: emerge(DB - 0.7, 0.45, 62.2) }, 'violetX(q.x)'); }
  // the orange-red shape low left (from the left edge at y 760; its rounded shoulder is under the first KOL still)
  { const at = [300, 1300], s = new THREE.Shape(), r = 200; s.moveTo(-2100, -1000); s.lineTo(330, -1000); s.lineTo(330, 540 - r); s.absarc(330 - r, 540 - r, r, 0, Math.PI / 2, false); s.lineTo(-2100, 540); s.lineTo(-2100, -1000);
    P15({ shape: s, at, depth: DB - 1.0, thick: 0.5, keys: emerge(DB - 1.0, 0.5, 62.25) }, 'blX(q.x)'); }
  // the wide top band: left edge x 684, bottom y 295, bottom-left corner r 230 (centre 914, 65); its right end steps back behind
  // the portal so it never reaches over the tunnel
  { const at = [1150, 100], s = new THREE.Shape(), X = x => x - at[0], Y = y => at[1] - y;
    s.moveTo(X(684), Y(-900)); s.lineTo(X(684), Y(65)); s.absarc(X(914), Y(65), 230, Math.PI, 1.5 * Math.PI, false); s.lineTo(X(1440), Y(295)); s.lineTo(X(1440), Y(180)); s.lineTo(X(1720), Y(180)); s.lineTo(X(1720), Y(-900)); s.lineTo(X(684), Y(-900));
    P15({ shape: s, at, depth: DB - 0.9, thick: 0.5, keys: emerge(DB - 0.9, 0.5, 62.0) }, 'bandF(q)'); }
  // the orange block: x 831 →, y 360 → 1104, left corners r 230 (its right end is inside the portal's left jamb)
  { const at = [1135, 732], s = new THREE.Shape(), X = x => x - at[0], Y = y => at[1] - y, r = 230;
    s.moveTo(X(1440), Y(1104)); s.lineTo(X(831 + r), Y(1104)); s.absarc(X(831 + r), Y(1104 - r), r, 1.5 * Math.PI, Math.PI, true); s.lineTo(X(831), Y(360 + r));
    s.absarc(X(831 + r), Y(360 + r), r, Math.PI, Math.PI / 2, true); s.lineTo(X(1440), Y(360)); s.lineTo(X(1440), Y(1104));
    P15({ shape: s, at, depth: DB - 1.1, thick: 0.6, keys: emerge(DB - 1.1, 0.6, 62.1) }, 'blockF(q)'); }
  // the orange rect at the top right (left edge x 1647; its foot is behind the portal's crown)
  P15({ shape: rect(1647, -900, 2300, 262, [1900, 0]), at: [1900, 0], depth: DB - 1.05, thick: 0.5, keys: emerge(DB - 1.05, 0.5, 61.9) }, 'trY(q.y)');
  // (fix pass 2: the wall runs on to the left of board 15's frame, and the camera faces that stretch while it swings off frame
  //  14's hill (at 62.0 the view's right edge is at board x ≈ −820; it reaches x 0 only at 62.4). It was bare backdrop there:
  //  61.7–62.6 showed only the sphere, the hill and a dark field. Three reliefs in board 15's language now push out of it as the
  //  camera swings onto them: a wide top band (orange → violet → magenta, like the board's), a tall pill (violet → orange, like
  //  the top-left bar) and a low orange-red block. All are left of x −100: never in frame at the hold or in the push after it.)
  { const at = [-1100, 0], s = new THREE.Shape(), X = x => x - at[0], Y = y => at[1] - y, r = 230;
    s.moveTo(X(-2150), Y(-900)); s.lineTo(X(-2150), Y(175 - r)); s.absarc(X(-2150 + r), Y(175 - r), r, Math.PI, 1.5 * Math.PI, false); s.lineTo(X(-140 - r), Y(175));
    s.absarc(X(-140 - r), Y(175 - r), r, 1.5 * Math.PI, 2 * Math.PI, false); s.lineTo(X(-140), Y(-900)); s.lineTo(X(-2150), Y(-900));
    P15({ shape: s, at, depth: DB - 0.9, thick: 0.5, keys: emerge(DB - 0.9, 0.5, 61.55) },
      `mix(mix(mix(${hexC('fe7901')}, ${hexC('e25b24')}, smoothstep(-2150.0, -1300.0, q.x)), ${hexC('842eec')}, smoothstep(-1500.0, -700.0, q.x)), ${hexC('b62fbc')}, smoothstep(-700.0, -140.0, q.x)) * mix(1.0, 0.86, smoothstep(0.0, 175.0, q.y))`); }
  { const at = [-540, 0], s = new THREE.Shape(); s.moveTo(-80, 900); s.lineTo(-80, -340); s.absarc(0, -340, 80, Math.PI, 2 * Math.PI, false); s.lineTo(80, 900); s.lineTo(-80, 900);
    P15({ shape: s, at, depth: DB - 0.6, thick: 0.4, keys: emerge(DB - 0.6, 0.4, 61.75) }, `mix(${hexC('7c15d0')}, ${hexC('ee7625')}, smoothstep(120.0, 400.0, q.y))`); }
  { const at = [-1300, 600], s = new THREE.Shape(), X = x => x - at[0], Y = y => at[1] - y, r = 200;
    s.moveTo(X(-1750), Y(1300)); s.lineTo(X(-1750), Y(340 + r)); s.absarc(X(-1750 + r), Y(340 + r), r, Math.PI, Math.PI / 2, true); s.lineTo(X(-860 - r), Y(340));
    s.absarc(X(-860 - r), Y(340 + r), r, Math.PI / 2, 0, true); s.lineTo(X(-860), Y(1300)); s.lineTo(X(-1750), Y(1300));
    // (review fix: it sat at the same depth as the orange-red shape low left, which runs under it (x −1750…−860, y 760…1300):
    //  their faces z-fought at 63.55–63.85. It stands 0.08 in front of it now.)
    P15({ shape: s, at, depth: DB - 1.08, thick: 0.5, keys: emerge(DB - 1.08, 0.5, 61.65) }, `mix(${hexC('f58a1a')}, ${hexC('fe4034')}, smoothstep(-1750.0, -860.0, q.x))`); }

  /* ---------- the portal: a thick ∩ (outer r 344 round (1613.5, 409), opening r 154 round (1612.5, 424)), legs down past the
     frame; no drift (the tunnel must stay on its opening) ---------- */
  const ARCH_IN = { type: 'fade', t: [61.85, 62.35], ease: 'sine.inOut' };
  { const at = [1613.5, 409], s = new THREE.Shape(), X = x => x - at[0], Y = y => at[1] - y, YB = 2300;
    s.moveTo(X(1269.5), Y(YB)); s.lineTo(X(1269.5), Y(409)); s.absarc(0, 0, 344, Math.PI, 0, true); s.lineTo(X(1957.5), Y(YB)); s.lineTo(X(1766.5), Y(YB)); s.lineTo(X(1766.5), Y(424));
    s.absarc(X(1612.5), Y(424), 154, 0, Math.PI, false); s.lineTo(X(1458.5), Y(YB)); s.lineTo(X(1269.5), Y(YB));
    P15({ shape: s, at, depth: Da, thick: 1.5, drift: 0, in: ARCH_IN }, 'cArch(b, sl.x * 0.06)'); }
  // the sill: closes the slot between the jambs under the ledge (the opening's violet, lighter low down; under the stills)
  const pyB = 540 - (uB - 0.03) / kpx(Da + 0.1);
  P15({ shape: rect(1440, pyB, 1790, 2300, [1612, 1000]), at: [1612, 1000], depth: Da + 0.1, thick: 0.5, drift: 0, in: ARCH_IN }, 'inY(q.y)');
  // the four slats, just inside the mouth: slide in out of the right jamb as the camera lands; slide back into it, bottom
  // first, as the sphere turns in (clear before it reaches them)
  const SLATS = [[564, 592], [504, 532], [444, 472], [384, 412]];
  SLATS.forEach(([y0, y1], i) => {
    const tIn = 63.25 + 0.07 * (3 - i), tOut = 65.02 + 0.07 * i;
    P15({ shape: rect(1440, y0, 1800, y1, [1620, (y0 + y1) / 2]), at: [1620, (y0 + y1) / 2], depth: Da + 0.4, thick: 0.12, drift: 0,
      keys: { x: [[tIn, 380], [tIn + 0.6, 0, 'power3.out'], [tOut, 0], [tOut + 0.45, 380, 'power2.in']], op: [[tIn, 0], [tIn + 0.02, 1], [tOut + 0.44, 1], [tOut + 0.46, 0]] } }, 'slatX(q.x)');
  });

  /* ---------- projected material (the ledge and the tunnel): the board colour at the point's place in the hold view ---------- */
  const hc = new THREE.PerspectiveCamera(H.fov, 16 / 9, 0.05, 2000);
  hc.position.copy(H.pos); hc.up.set(0, 1, 0); hc.lookAt(H.look); hc.updateMatrixWorld(); hc.updateProjectionMatrix();
  const HVP = new THREE.Matrix4().multiplyMatrices(hc.projectionMatrix, hc.matrixWorldInverse);
  // (fix pass: mf > 0 slides a vertex back along the hold camera's own view ray, to depth dFl at most: invisible from the hold
  //  camera, and it takes the ledge back to just in front of the doorway wall as it turns into the board's colours)
  const WV = '#include <common>\n#include <logdepthbuf_pars_vertex>\nattribute float sv;\nuniform float mf, dFl, sw, msl; uniform vec3 hc0, hf0;\nvarying vec3 vW; varying vec3 vN; varying float vS;\nvoid main() { vS = sv; vec4 w = modelMatrix * vec4(position, 1.0);\n  float kk = clamp((sw - sv) / 0.9 + 0.5, 0.0, 1.0), m = mf * msl * kk * kk * (3.0 - 2.0 * kk);\n  float dp = dot(w.xyz - hc0, hf0); if (m > 0.0 && dp < dFl && dp > 0.1) w.xyz = hc0 + (w.xyz - hc0) * mix(1.0, dFl / dp, m);\n  vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w;\n#include <logdepthbuf_vertex>\n}';
  const hk = { value: 1 };                                                // 0 at the hold (exact board colours), 1 away from it
  const ledgeMF = { value: 1 }, ledgeSW = { value: -1e9 };                // the ledge's switch: a front sweeping along it (path s)
  // (fix pass 2: the geometry no longer slides back onto the wall (msl 0 on the ledge): with the front half way along it, the
  //  slid part and the rest sheared the ledge into a floating, blurred box in front of the doorway at 63.72–63.85. The front
  //  now only switches its colour (opaque, so nothing shows through), onto the board as seen from the landing camera.)
  // (fix pass: it was a cross-fade of the ledge's two looks at 63.6–63.9, with the board look projected from the hold camera onto a
  //  ledge ~7 u in front of the wall: from the not-quite-settled camera it read as a doubled, glassy ledge. Now a front sweeps
  //  along the ledge from its near end into the doorway (63.45–63.95): each point switches quickly to the board look and slides
  //  back along the hold camera's rays onto the wall, so the floor rolls away into the doorway with nothing half-transparent.
  //  It stays in the board look to the wipe: board 15 has no floor.)
  const hkAt = t => 1 - sm((t - (H.t0 - 0.4)) / 0.4);
  const projMats = [];
  const projMat = (body, o = {}) => {
    const m = new THREE.ShaderMaterial({ side: THREE.DoubleSide, transparent: true, depthWrite: o.depthWrite ?? true,
      uniforms: { hvp: { value: HVP }, hcam: { value: H.pos.clone() }, op: { value: 0 }, t: { value: 0 }, flow: flowU, spd: spdU, hk, e: { value: o.e ?? 1.5 }, shd: { value: o.shade === false ? 0 : 1 },
        mf: o.mf || { value: 0 }, sw: o.sw || { value: 1e9 }, msl: { value: o.msl ?? 1 }, dFl: { value: Da - 0.06 }, hc0: { value: H.pos.clone() }, hf0: { value: H.fwd.clone() } },
      vertexShader: WV,
      fragmentShader: `uniform mat4 hvp; uniform vec3 hcam; uniform float op, t, flow, spd, hk, e, shd, mf, sw;
varying vec3 vW; varying vec3 vN; varying float vS;
#include <logdepthbuf_pars_fragment>
${GLSL_LIB}${SLF}${o.lib || ''}
void main() {
  vec4 hq = hvp * vec4(vW, 1.0);
  vec2 bp = hq.w > 0.0 ? vec2((hq.x / hq.w * 0.5 + 0.5) * 1920.0, (0.5 - 0.5 * hq.y / hq.w) * 1080.0) : vec2(-40.0, 1100.0);
  bp.x = max(bp.x, -40.0);                                   // beyond the frame's left edge: the board's left-edge colours run on
  vec2 sl = SL(t, flow);
  float kk = clamp((sw - vS) / 0.9 + 0.5, 0.0, 1.0); kk = mf * kk * kk * (3.0 - 2.0 * kk);   // (the ledge: switched to the board look here)
  float hkf = mf > 0.0 ? 1.0 - kk : hk;
  vec3 col = ${body};
  vec3 nb = normalize(vN); float vis = smoothstep(-0.05, 0.02, dot(nb, normalize(hcam - vW)));
  col *= mix(1.0, mix(0.72 + 0.08 * nb.y, 1.0, vis), shd * hkf);    // faces the hold camera never sees are shaded (not once flat on the wall)
  col *= mix(1.0, nb.y > 0.5 ? 1.0 : 0.74, hkf * shd);         // away from the hold, the ledge's sides read darker than its top
  gl_FragColor = vec4(col, op);
#include <logdepthbuf_fragment>
}` });
    projMats.push(m); return m; };
  const mine = [];                                                        // [mesh, fade window [a, b], max op]
  const addM = (geo, m, win, a = 1) => { const me = new THREE.Mesh(geo, m); me.frustumCulled = false; V.scene.add(me); mine.push([me, win, a]); return me; };

  /* ---------- the tunnel: the opening's ∩ swept back along the sphere's way in (sheared), dark inside ---------- */
  const TUN_IN = [61.85, 62.35];
  const ring = (f, grow = 0) => outline(grow).map(([r, u]) => L3(r + shiftAt(f), u, f));
  { const A = ring(Da + 0.02), B = ring(Da + LEN), pos = [], idx = [];
    A.forEach((p, i) => { pos.push(p.x, p.y, p.z, B[i].x, B[i].y, B[i].z); });
    for (let i = 0; i < A.length - 1; i++) { const k = 2 * i; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    addM(g, projMat('inY(bp.y + sl.y)', { shade: false }), TUN_IN); }
  // frontal cross-sections (the back cap and the fog layers)
  const secGeo = (f, grow = 0) => { const P = outline(grow); const s = new THREE.Shape(P.map(([r, u]) => new THREE.Vector2(r + shiftAt(f), u)));
    const g = new THREE.ShapeGeometry(s, 1); g.applyMatrix4(new THREE.Matrix4().makeBasis(H.right, H.upv, H.fwd.clone().negate()).setPosition(H.pos.clone().addScaledVector(H.fwd, f))); return g; };
  addM(secGeo(Da + LEN), projMat('inY(bp.y + sl.y)', { shade: false }), TUN_IN);
  // fog: thin dark layers (the tunnel's own colours) from 0.7 inside the mouth; the sphere fades as it rolls in (~99% gone
  // 5.5 units in, before the wipe reaches the doorway)
  // (fix pass: 26 layers 0.24 apart sliced the sphere into concentric 'onion rings' as it went in (66.1–66.45). Now 10× as many,
  //  0.024 apart, each with 1 − (1 − a)^(1/10) of the old layer's opacity there: the same darkness, no visible steps. They start
  //  1.3 in (was 0.7), so the sphere is seen rolling into the doorway a little longer before the wipe.)
  //  (10× only for the first 2.4 u, while the sphere is still bright; then 3×: an 8-bit frame can't darken much further with
  //  3%-layers, whose change rounds away below ~17/255, which would leave a ghost of the sphere.)
  const FOG = []; for (let j = 0; j < 100; j++) { const i = j / 10, a = 0.035 + 0.25 * sm(i / 13); FOG.push([Da + 1.3 + 0.024 * j, 1 - Math.pow(1 - a, 1 / 10)]); }
  for (let j = 30; j < 78; j++) { const i = j / 3, a = 0.035 + 0.25 * sm(i / 13); FOG.push([Da + 1.3 + 0.08 * j, 1 - Math.pow(1 - a, 1 / 3)]); }
  for (const [f, a] of FOG) { const me = addM(secGeo(f, -0.004), projMat('inY(bp.y + sl.y)', { depthWrite: false, shade: false }), TUN_IN, a); me.renderOrder = 2; }
  // (fix pass 2: past ~3.5 u in, the layers stopped darkening the sphere (8-bit rounding): it lingered as a faint grey disc in the
  //  doorway until the wipe covered it (66.4–66.75). A thin shell round it, in the tunnel's own colour where it sits, takes it the
  //  rest of the way in one blend, 3.6 → 5.2 u in (66.31–66.53).)
  { const shM = projMat('inY(bp.y + sl.y)', { depthWrite: false, shade: false }), shell = new THREE.Mesh(new THREE.SphereGeometry(1.006, 48, 32), shM);
    shell.renderOrder = 6; shell.frustumCulled = false; V.scene.add(shell);
    anim((t, b) => { const dz = loc(b.p)[2] - Da, a = t > 65 && t < 66.95 && !b.h ? sm((dz - 3.6) / 1.6) : 0;
      shell.visible = a > 0.002; if (!shell.visible) return; shell.position.copy(b.p); shell.scale.setScalar(Math.max(0.001, b.sc ?? 1)); shM.uniforms.op.value = a; }); }

  /* ---------- the ledge: from the foot of the hill, round the turn and into the tunnel (its floor) ----------
     Two looks: at the hold it takes the board colours of where it sits in the hold view (so board 15, which shows no floor,
     reads exactly); away from the hold it's a solid path, orange → coral → magenta → violet into the doorway's dark (side
     faces darker). The looks cross-fade as the camera lands (63.6–63.9) and as it moves off after the hold (65.3–65.75).
     Its top sits 0.015 under the sphere's contact (no z-fighting with any floor run of frame 14's that overlaps it). */
  const W_L = 2.6, TH_L = 0.72, s0 = sOf('foot'), DZ = 0.015;
  const lp = [], ls = []; for (let s = s0; s < L; s += 0.2) { lp.push(pAt(s)); ls.push(s); } lp.push(pAt(L)); ls.push(L);
  { const tE = C.getTangentAt(1), pE = pAt(L), fE = loc(pE)[2], ext = (Da + LEN - 0.05 - fE) / tE.dot(H.fwd);
    for (let k = 1; k <= 12; k++) { lp.push(pE.clone().addScaledVector(tE, ext * k / 12)); ls.push(L + ext * k / 12); } }
  { const up = new Vec(0, 1, 0), fr = lp.map((p, i) => { const tg = lp[Math.min(i + 1, lp.length - 1)].clone().sub(lp[Math.max(i - 1, 0)]).normalize(), sd = tg.clone().cross(up).normalize(); return { p, sd, nr: sd.clone().cross(tg).normalize() }; });
    const at = (F, a, b) => F.p.clone().addScaledVector(F.sd, a).addScaledVector(F.nr, b);
    const geos = [];
    // a face of the slab between two section corners; its normals point out (out(F): the outward direction at frame F)
    const strip = (qa, qb, out) => { const pos = [], idx = [], sv = []; fr.forEach((F, i) => { const A = at(F, ...qa), B = at(F, ...qb); pos.push(A.x, A.y, A.z, B.x, B.y, B.z); sv.push(ls[i], ls[i]); });
      for (let i = 0; i < fr.length - 1; i++) { const k = 2 * i; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('sv', new THREE.Float32BufferAttribute(sv, 1)); g.setIndex(idx); g.computeVertexNormals();
      const n = g.attributes.normal; if (new Vec(n.getX(0), n.getY(0), n.getZ(0)).dot(out(fr[0])) < 0) for (let i = 0; i < n.count; i++) n.setXYZ(i, -n.getX(i), -n.getY(i), -n.getZ(i));
      geos.push(g); };
    const w = W_L / 2, TL = [-w, -1 - DZ], TR = [w, -1 - DZ], BR = [w, -1 - TH_L], BL = [-w, -1 - TH_L];
    strip(TL, TR, F => F.nr); strip(TR, BR, F => F.sd); strip(BR, BL, F => F.nr.clone().negate()); strip(BL, TL, F => F.sd.clone().negate());
    // the end at the foot (a flat cap across the section)
    { const F = fr[0], q = [TL, TR, BR, BL].map(c => at(F, ...c)), g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(q.flatMap(v => v.toArray()), 3)); g.setAttribute('sv', new THREE.Float32BufferAttribute([s0, s0, s0, s0], 1));
      g.setIndex([0, 1, 2, 0, 2, 3]); g.computeVertexNormals(); const bk = lp[0].clone().sub(lp[1]).normalize(), n = g.attributes.normal; for (let i = 0; i < 4; i++) n.setXYZ(i, bk.x, bk.y, bk.z); geos.push(g); }
    const lib = stopsFn('pathS', [[s0, '#f47a2c'], [s0 + 0.55 * (sM - s0), '#f36a2e'], [sM - 0.5, '#ea5848'], [sM + 3, '#d2489a'], [sDoor - 2, '#8a2ad0'], [sDoor, '#2c0c64'], [sDoor + 2.5, '#150838']]);   // (revision: spaced by the new ramp's length)
    const mL = projMat(`mix(mix(pathS(vS + 1.2 * min(flow, 1.6) * (sin(6.2832 * ((t - ${TK.toFixed(3)}) * spd) / ${PER.toFixed(2)} + ${PH.toFixed(2)}) - sin(${PH.toFixed(2)}))), inY(bp.y + sl.y), smoothstep(${f1(sDoor + 0.3)}, ${f1(sDoor + 2.5)}, vS)), boardCol(bp, sl, e), 1.0 - hkf)`, { e: 2.5, lib, mf: ledgeMF, sw: ledgeSW, msl: 0 });   // (fix pass 2: colour sweep only; see ledgeMF)
    for (const g of geos) addM(g, mL, [59.0, 59.5]); }                    // (revision: in while off screen, before the sphere sets off down the band)

  /* ---------- the sphere's contact shadow on the ledge (soft; gone as it enters the tunnel's dark) ---------- */
  { const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4, uniforms: { op: { value: 0 } },
      vertexShader: '#include <common>\n#include <logdepthbuf_pars_vertex>\nvarying vec2 vP;\nvoid main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}',
      fragmentShader: 'uniform float op; varying vec2 vP;\n#include <logdepthbuf_pars_fragment>\nvoid main() { float r = length(vP); gl_FragColor = vec4(0.05, 0.01, 0.08, op * 0.42 * (1.0 - smoothstep(0.35, 1.0, r)));\n#include <logdepthbuf_fragment>\n}' });
    const sh = new THREE.Mesh(new THREE.CircleGeometry(1.05, 48), m); sh.rotation.x = -Math.PI / 2; sh.renderOrder = 1; sh.frustumCulled = false; V.scene.add(sh);
    const yLev = pAt(sM).y, rFoot = loc(lp[0])[0];
    anim((t, b) => { const on = t > 61.6 && t < 66.9 && !b.h; sh.visible = on; if (!on) return;
      const [r, , f] = loc(b.p), onL = Math.abs(b.p.y - yLev) < 0.15 && r > rFoot - 0.3;   // on the ledge (level, past the hill's foot)
      m.uniforms.op.value = (onL ? 1 : 0) * (1 - sm((f - Da - 0.3) / 1.5));   // (revision: the ledge stays solid through the key, so its shadow does too)
      sh.position.copy(b.p).add(new Vec(0, -0.995 - DZ, 0)); }); }

  /* ---------- timing: my meshes' fades; the hold switch for the projected colours ---------- */
  anim(t => {
    // (integration: the landing switch runs 63.6–63.9 (was 63.45–63.85), when the settling camera is within ~0.3 u of the hold, so
    //  the projected board look is nearly exact while it blends in and the ledge doesn't read as glass)
    // (revision, user: "you don't need to disappear the hill ramp that the sphere is on. I want you to keep it there so it makes
    //  sense": the ledge is the ramp from frame 14, so it stays a solid path through the key moment; it no longer switches to
    //  the board's floorless look. ledgeSW stays off.)
    hk.value = hkAt(t);
    for (const m of projMats) { m.uniforms.t.value = t; }
    for (const [me, [a, b], k] of mine) { const o = t > 66.95 ? 0 : sm((t - a) / (b - a)) * k; me.visible = o > 0.002; const mm = me.material; mm.uniforms.op.value = o; if (k >= 1) { mm.transparent = o < 0.999; mm.depthWrite = o >= 0.999; } }
  });
};
