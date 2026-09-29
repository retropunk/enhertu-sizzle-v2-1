/* Frame 10 · the ring tunnel in the wall: the sphere rolls down a flaring path into the tunnel's dark (G2, called from g2.js
   with its context C). Built (batch 2): every board 10 shape is real 3D, the plate is gone.
   · The wall (camera 10's view, depths from its lens; the sphere is at 50.4): a ring tunnel at the bottom centre (a thick
     annulus whose two bands carry board 10's conic colours, and a dark tube behind it along the path, with layered dark
     fog inside so the sphere and the path fade into the tunnel), the post over it, the tall pill, the hourglass, the ∩
     outline, the lavender capsule, the big violet stadium with its lavender pill and ∪, the orange ∩ arch, the magenta
     blob, and a backdrop whose colour field fills the board's gaps (orange column, magenta top left, pink → blue right)
     and fades to deep violet beyond the frame, where the approach sees the wall's lower half.
   · The path: a slab from the end of frame 9's ramp (Pv) into the tunnel, flaring toward the camera exactly as board
     10's trapezoid; its top runs lavender → orange (with board 10's orange glow at the bottom of frame) → lilac → the
     tunnel dark. The sphere's contact shadow rides on it.
   · Build: the backdrop fades in as the camera whips round; the lower shapes fly in out of the depth first (the approach
     sees the wall's lower half first), then the upper ones, all settled well before the hold. Nothing leaves: the cut into
     G3 happens in the tunnel's dark at 41.4.
   Shapes, positions and colours are measured from board 10 (edge scans and colour samples; board px, 1920×1080). */
export default (V, C) => {
  const { THREE, Vec, h10: H, PC, sm } = C;
  const { anim } = V;
  const TK = H.tk;                                                        // 40.35: the gradients pass through the board colours here
  const kpx = d => d * H.tanV / 540;                                      // world units per board px at depth d (camera 10)
  const L3 = (r, u, f) => H.pos.clone().addScaledVector(H.right, r).addScaledVector(H.upv, u).addScaledVector(H.fwd, f);
  const hexV3 = h => { const n = parseInt(h.slice(1), 16); return new Vec((n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255); };
  V.unplate(10);
  const mine = [];                                                         // my meshes that aren't pieces (shown from 35.4 on)

  /* ---------- the ring: board 10's two bands around (911, 888): dark r < 195, inner band 195–226.5, outer band 226.5–256 ---------- */
  const RC = [911, 888], R_IN = 195, R_MID = 226.5, R_OUT = 256, R_BITE = 225;   // shapes behind the ring are cut back to r 225 (hidden by it)
  const D_RING = 51.3, TH_RING = 1.2, D_TUBE = D_RING + TH_RING;          // ring front / back; the tube starts at the ring's back face

  /* ---------- a gradient material for pieces: multi-stop linear, conic (two bands) or a colour field; living, locked at TK ----------
     All positions are the piece's local board px (y up, around its anchor). Sides (the extrusion) are shaded darker, as the engine's. */
  const GV = '#include <common>\n#include <logdepthbuf_pars_vertex>\nvarying vec3 vO; varying vec3 vNv;\nvoid main() { vO = position; vNv = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}';
  const GF = `uniform int mode, ns, ns2, na; uniform float op, t, flow, spd, tk, amp, per, ph0, rb;
uniform vec2 A, B, cc; uniform vec4 box; uniform vec3 vigC; uniform float vigK, vigR, kern, kpw; uniform float st[12], st2[12]; uniform vec3 sc[12], sc2[12]; uniform vec2 ap[64]; uniform vec3 ac[64], a0, ax, ay;
varying vec3 vO; varying vec3 vNv;
#include <logdepthbuf_pars_fragment>
float wob(float k) { return sin(6.2832 * ((t - tk) * spd) / (per * (1.0 + 0.13 * k)) + ph0 + 1.7 * k) - sin(ph0 + 1.7 * k); }
vec3 stops(float g, int n, float s[12], vec3 c[12]) { vec3 col = c[0]; for (int i = 1; i < 12; i++) { if (i >= n) break; col = mix(col, c[i], clamp((g - s[i - 1]) / max(1e-4, s[i] - s[i - 1]), 0.0, 1.0)); } return col; }
void main() {
  float fl = min(flow, 1.6), w0 = amp * fl * wob(0.0);
  vec3 col;
  if (mode == 0) { vec2 ax = B - A; float g = dot(vO.xy - A, ax) / dot(ax, ax) + w0; col = stops(g, ns, st, sc); }
  else if (mode == 1) { vec2 d = vO.xy - cc; float a = mod(degrees(atan(d.y, d.x)) + w0 + 360.0, 360.0);
    col = length(d) < rb ? stops(a, ns, st, sc) : stops(a, ns2, st2, sc2); }
  else { vec2 cp = clamp(vO.xy, box.xy, box.zw), q = cp / 500.0;
    if (kern > 0.0) { vec3 sum = vec3(0.0); float ws = 0.0;                     // a smooth weighted blend (bounded: no overshoot)
      for (int i = 0; i < 64; i++) { if (i >= na) break; float k = float(i); vec2 p = ap[i] + amp * fl * vec2(wob(k), wob(k + 0.5));
        vec2 d = cp - p; float w = pow(1.0 + dot(d, d) / (kern * kern), -kpw); sum += ac[i] * w; ws += w; }
      col = sum / ws; }
    else { col = a0 + ax * q.x + ay * q.y;                                         // thin-plate spline through the anchors
      for (int i = 0; i < 64; i++) { if (i >= na) break; float k = float(i); vec2 p = (ap[i] + amp * fl * vec2(wob(k), wob(k + 0.5))) / 500.0;
        float r2 = dot(q - p, q - p); col += ac[i] * (r2 > 1e-9 ? 0.5 * r2 * log(r2) : 0.0); } }
    col = mix(clamp(col, 0.0, 1.0), vigC, vigK * smoothstep(0.0, vigR, length(vO.xy - cp))); }
  vec3 nv = normalize(vNv); float shade = mix(0.72 + 0.12 * nv.y - 0.05 * nv.x, 1.0, smoothstep(0.55, 0.98, abs(nv.z)));
  gl_FragColor = vec4(col * shade, op);
#include <logdepthbuf_fragment>
}`;
  const pad = (a, n, f) => { const o = a.slice(0, n); while (o.length < n) o.push(f()); return o; };
  // thin-plate spline through colour anchors (smooth, no bands): solves [K + λI, P; Pᵀ, 0][w; a] = [c; 0] per channel
  const tps = (X, cols, lam) => { const n = X.length, N = n + 3, M = Array.from({ length: N }, () => new Float64Array(N + 3)), phi = r2 => r2 > 1e-12 ? 0.5 * r2 * Math.log(r2) : 0;
    for (let i = 0; i < n; i++) { for (let j = 0; j < n; j++) M[i][j] = phi((X[i][0] - X[j][0]) ** 2 + (X[i][1] - X[j][1]) ** 2) + (i === j ? lam : 0);
      M[i][n] = M[n][i] = 1; M[i][n + 1] = M[n + 1][i] = X[i][0]; M[i][n + 2] = M[n + 2][i] = X[i][1]; M[i][N] = cols[i].x; M[i][N + 1] = cols[i].y; M[i][N + 2] = cols[i].z; }
    for (let c = 0; c < N; c++) { let pv = c; for (let r = c + 1; r < N; r++) if (Math.abs(M[r][c]) > Math.abs(M[pv][c])) pv = r; [M[c], M[pv]] = [M[pv], M[c]];
      for (let r = 0; r < N; r++) if (r !== c) { const k = M[r][c] / M[c][c]; if (k) for (let q = c; q < N + 3; q++) M[r][q] -= k * M[c][q]; } }
    const sol = k => new Vec(M[k][N] / M[k][k], M[k][N + 1] / M[k][k], M[k][N + 2] / M[k][k]);
    return { w: Array.from({ length: n }, (_, i) => sol(i)), a: [sol(n), sol(n + 1), sol(n + 2)] }; };
  const swaps = [];
  // skin(piece, spec, anchor): spec = { lin: [[pos 0..1, '#hex'], …], A, B } (multi-stop linear, A → B in board px)
  //   | { conic: [[deg, '#hex'], …], conic2, rb } (by angle round RC; conic2 beyond radius rb)
  //   | { field: [[px, py, '#hex'], …] } (a thin-plate spline through the anchors; with kern: a bounded weighted blend instead, and
  //     box + vig: evaluated inside the box, darkening toward vig's colour outside it); plus amp / per for the living drift
  const skin = (pc, g, at) => {
    const o0 = pc.mesh.material, loc = ([x, y]) => new THREE.Vector2(x - at[0], at[1] - y);
    const u = { op: o0.uniforms.op, t: o0.uniforms.t, flow: o0.uniforms.flow, spd: o0.uniforms.spd, tk: { value: TK }, amp: { value: g.amp ?? 0.08 }, per: { value: g.per ?? 9 }, ph0: { value: 1.3 + 0.9 * swaps.length },
      mode: { value: 0 }, ns: { value: 1 }, ns2: { value: 1 }, na: { value: 0 }, rb: { value: 0 },
      A: { value: new THREE.Vector2() }, B: { value: new THREE.Vector2(1, 0) }, cc: { value: new THREE.Vector2() },
      st: { value: pad([], 12, () => 0) }, st2: { value: pad([], 12, () => 0) }, sc: { value: pad([], 12, () => new Vec()) }, sc2: { value: pad([], 12, () => new Vec()) },
      ap: { value: pad([], 64, () => new THREE.Vector2()) }, ac: { value: pad([], 64, () => new Vec()) }, a0: { value: new Vec() }, ax: { value: new Vec() }, ay: { value: new Vec() },
      box: { value: new THREE.Vector4(-1e6, -1e6, 1e6, 1e6) }, vigC: { value: new Vec() }, vigK: { value: 0 }, vigR: { value: 1 }, kern: { value: 0 }, kpw: { value: 2 } };
    const tab = (list, n, s, c) => { u[n].value = list.length; u[s].value = pad(list.map(q => q[0]), 12, () => 1e5); u[c].value = pad(list.map(q => hexV3(q[1])), 12, () => hexV3(list.at(-1)[1])); };
    if (g.lin) { u.mode.value = 0; u.A.value = loc(g.A); u.B.value = loc(g.B); tab(g.lin, 'ns', 'st', 'sc'); }
    else if (g.conic) { u.mode.value = 1; u.cc.value = loc(g.cc || RC); u.rb.value = g.rb ?? 1e9; tab(g.conic, 'ns', 'st', 'sc'); tab(g.conic2 || g.conic, 'ns2', 'st2', 'sc2'); }
    else { const P = g.field.map(q => loc(q)), T = g.kern ? null : tps(P.map(v => [v.x / 500, v.y / 500]), g.field.map(q => hexV3(q[2])), g.lam ?? 1e-3);
      u.mode.value = 2; u.na.value = P.length; u.ap.value = pad(P, 64, () => new THREE.Vector2());
      if (g.kern) { u.kern.value = g.kern; u.kpw.value = g.kpw ?? 2; u.ac.value = pad(g.field.map(q => hexV3(q[2])), 64, () => new Vec()); }
      else { u.ac.value = pad(T.w, 64, () => new Vec()); u.a0.value = T.a[0]; u.ax.value = T.a[1]; u.ay.value = T.a[2]; }
      if (g.box) { const p0 = loc([g.box[0], g.box[3]]), p1 = loc([g.box[2], g.box[1]]); u.box.value.set(p0.x, p0.y, p1.x, p1.y); u.vigC.value = hexV3(g.vig[0]); u.vigK.value = g.vig[1]; u.vigR.value = g.vig[2]; } }
    const m = new THREE.ShaderMaterial({ uniforms: u, vertexShader: GV, fragmentShader: GF, side: o0.side });
    pc.mesh.material = m; swaps.push([o0, m]); return pc; };
  anim(() => { for (const [a, b] of swaps) { b.transparent = a.transparent; b.depthWrite = a.depthWrite; } });
  const conicStops = s => { const L = s.map(([a, c]) => [a, c]); L.push([360, s[0][1]]); return L; };   // wraps round to 0°

  /* ---------- shapes: point contours (board px, absolute), a bite round the ring, and THREE.Shapes around an anchor ---------- */
  const circlePts = (cx, cy, r, n = 256) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos(2 * Math.PI * i / n), cy - r * Math.sin(2 * Math.PI * i / n)]);
  // stadium / rounded rect contour: centre (cx, cy), w × h, corner radius r (board px, y down)
  const rrPts = (cx, cy, w, h, r, step = 4) => V.rr(w, h, r).getSpacedPoints(Math.ceil((2 * (w + h)) / step)).slice(0, -1).map(p => [cx + p.x, cy - p.y]);
  const area = P => { let a = 0; for (let i = 0; i < P.length; i++) { const [x0, y0] = P[i], [x1, y1] = P[(i + 1) % P.length]; a += x0 * y1 - x1 * y0; } return a / 2; };
  // local (y up, around at), counter-clockwise
  const toLocal = (P, at) => { const Q = P.map(([x, y]) => [x - at[0], at[1] - y]); return area(Q) < 0 ? Q.reverse() : Q; };
  // subtract a circle (local coords) from a CCW contour: the part inside is replaced by the circle's arc (walked clockwise)
  const bite = (P, c, r) => {
    const inn = P.map(([x, y]) => Math.hypot(x - c[0], y - c[1]) < r);
    if (!inn.some(Boolean)) return P;
    let s0 = inn.findIndex(v => !v); const n = P.length, out = [];
    const cross = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], fx = a[0] - c[0], fy = a[1] - c[1], A2 = dx * dx + dy * dy, B2 = 2 * (fx * dx + fy * dy), C2 = fx * fx + fy * fy - r * r;
      const D = Math.sqrt(Math.max(0, B2 * B2 - 4 * A2 * C2)); let s = (-B2 - D) / (2 * A2); if (s < 0 || s > 1) s = (-B2 + D) / (2 * A2); s = Math.min(1, Math.max(0, s)); return [a[0] + s * dx, a[1] + s * dy]; };
    for (let k = 0; k < n; k++) {
      const i = (s0 + k) % n, j = (i + 1) % n;
      if (!inn[i]) { out.push(P[i]); if (inn[j]) {
        const E = cross(P[i], P[j]); let m = j; while (inn[m % n]) m++; const X = cross(P[(m - 1) % n], P[m % n]);
        const tE = Math.atan2(E[1] - c[1], E[0] - c[0]); let dT = Math.atan2(X[1] - c[1], X[0] - c[0]) - tE; while (dT > 0) dT -= 2 * Math.PI; while (dT <= -2 * Math.PI) dT += 2 * Math.PI;
        out.push(E); const N = Math.ceil(Math.abs(dT) * r / 3); for (let q = 1; q < N; q++) { const a = tE + dT * q / N; out.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]); } out.push(X);
        k += (m - j); } } }
    return out; };
  const shapeOf = (P, at, { bitten = false, holes = [] } = {}) => {
    let Q = toLocal(P, at); if (bitten) Q = bite(Q, [RC[0] - at[0], at[1] - RC[1]], R_BITE);
    const s = new THREE.Shape(Q.map(([x, y]) => new THREE.Vector2(x, y)));
    for (const Hp of holes) { const q = toLocal(Hp, at).reverse(); s.holes.push(new THREE.Path(q.map(([x, y]) => new THREE.Vector2(x, y)))); }
    return s; };

  /* ---------- build-in: the backdrop fades in as the camera whips round; the lower shapes fly in first, then the upper ones ----------
     (review fix, 2026-09-28: all ~0.2 s earlier and the upper-left group ~0.3 s earlier, so the whip (36.1–36.7) is never a bare
      lilac ramp and the wall's upper left is behind the ASCO box as it opens, ~36.65) */
  const fly = (a, dz = 16, dur = 0.95) => ({ type: 'fly', t: [a, a + dur], dz });
  const P10 = (spec, g) => { const pc = PC({ hold: 10, ...spec }); if (g) skin(pc, g, spec.at); return pc; };

  // ---- the backdrop: one big wall behind everything; its colour field fills board 10's gaps and fades to deep violet off-frame
  const D_BACK = 56;
  { const at = [960, 900], hc = [960 + (RC[0] - 960) * D_TUBE / D_BACK, 540 + (RC[1] - 540) * D_TUBE / D_BACK], hr = R_IN * D_TUBE / D_BACK + 10;
    const outer = [[-1100, -700], [-1100, 1420], [2500, 1420], [2500, -700]];   // the wall ends under the ring (its foot is seen on the approach)
    P10({ shape: shapeOf(outer, at, { holes: [circlePts(hc[0], hc[1], hr, 128)] }), at, depth: D_BACK, thick: 0, drift: 0, in: { type: 'fade', t: [35.75, 36.4], ease: 'sine.inOut' } },
      { field: [[790, 20, '#f26612'], [690, 20, '#f86d01'], [790, 160, '#ea6423'], [790, 300, '#d95e47'], [790, 420, '#c45674'], [790, 500, '#b55193'], [805, 580, '#a74cb1'], [805, 625, '#9f49be'],   // the orange column
        [60, 15, '#b26199'], [350, 15, '#c66262'], [15, 150, '#a650ba'], [15, 330, '#a435e9'], [100, 400, '#ad29f4'], [305, 400, '#b129e9'],   // top left
        [110, 1000, '#e86d22'], [40, 1070, '#f17105'], [130, 950, '#dd6b42'], [340, 960, '#be5f8b'], [340, 1060, '#c3607c'], [535, 1000, '#a552be'], [535, 1070, '#a254b7'], [690, 1045, '#9147dd'],   // bottom left
        [1180, 1050, '#6425ff'], [1300, 1045, '#6120ff'], [1465, 60, '#df478f'], [1465, 250, '#cb41ac'], [1465, 420, '#ac36d1'], [1465, 720, '#7724fd'], [1465, 1010, '#641cff'],   // right
        [1910, 100, '#dd48a0'], [1910, 300, '#c93fba'], [1910, 450, '#b237d7'], [1905, 720, '#8625fc'], [1910, 1010, '#6d1ff5'], [1800, 300, '#cc3cbd'], [1560, 300, '#c63db7'], [1560, 950, '#681dfe'], [1810, 950, '#6f1dfe']],
        box: [-20, -20, 1940, 1100], vig: ['#2a0a66', 0.8, 420], kern: 150, kpw: 2.5, amp: 40, per: 11 }); }

  // ---- the ring and the tunnel (ring: thick annulus, flat at the hold; no drift: the tube and the path must stay on it)
  // board 10's bands by angle (0° = right, counter-clockwise), measured on radial scans; the shader holds 12 stops per band
  const INNER12 = conicStops([[0, '#ae2ccb'], [30, '#6e13f3'], [60, '#5202f8'], [90, '#5c00fe'], [120, '#8917be'], [150, '#c34956'], [180, '#f27308'], [225, '#ff9200'], [275, '#f86a5a'], [315, '#f35975'], [340, '#d83ea4']]);
  const OUTER12 = conicStops([[0, '#e56d2d'], [30, '#c76142'], [60, '#923383'], [90, '#4e04c0'], [120, '#630edc'], [150, '#6f15ea'], [195, '#6e12f5'], [230, '#6713f0'], [270, '#8a2cb0'], [315, '#b84c5c'], [340, '#d9662f']]);
  const ringShape = new THREE.Shape(circlePts(0, 0, R_OUT).map(([x, y]) => new THREE.Vector2(x, -y)));
  ringShape.holes.push(new THREE.Path(circlePts(0, 0, R_IN).map(([x, y]) => new THREE.Vector2(x, y))));
  P10({ shape: ringShape, at: RC, depth: D_RING, thick: TH_RING, drift: 0, in: { type: 'fade', t: [35.4, 35.9] } }, { conic: INNER12, conic2: OUTER12, rb: R_MID, amp: 10, per: 10 });

  // the tube: along camera 10's view (the path's direction), from the ring's back face; dark inside, and fog layers of the same
  // dark (the sphere and the path fade into it). Flat colour, no living drift (board 10's interior is a flat #25085a).
  const DARK = '#25085a';
  const flatMat = (hex, o = 1) => new THREE.ShaderMaterial({ uniforms: { col: { value: hexV3(hex) }, op: { value: o } }, transparent: o < 1, depthWrite: o >= 1, side: THREE.DoubleSide,
    vertexShader: '#include <common>\n#include <logdepthbuf_pars_vertex>\nvoid main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}',
    fragmentShader: 'uniform vec3 col; uniform float op;\n#include <logdepthbuf_pars_fragment>\nvoid main() { gl_FragColor = vec4(col, op);\n#include <logdepthbuf_fragment>\n}' });
  const rT = R_IN * kpx(D_TUBE), A0 = H.at(RC[0], RC[1], D_TUBE), LEN = 45, qT = new THREE.Quaternion().setFromUnitVectors(new Vec(0, 1, 0), H.fwd);
  { const tube = new THREE.Mesh(new THREE.CylinderGeometry(rT, rT, LEN, 128, 1, true), flatMat(DARK)); tube.quaternion.copy(qT); tube.position.copy(A0).addScaledVector(H.fwd, LEN / 2);
    const cap = new THREE.Mesh(new THREE.CircleGeometry(rT, 128), flatMat(DARK)); cap.quaternion.setFromUnitVectors(new Vec(0, 0, 1), H.fwd); cap.position.copy(A0).addScaledVector(H.fwd, LEN);
    mine.push(tube, cap); }
  // fog: dark discs filling the tube. The sphere rolls into it and dissolves before the point where the journey hides it
  // (g2.js's sIn), so it never pops. Deeper in, the tube goes fully dark.
  // (review fix: the fog used to be only the 16 layers from FA (f 52.6) to fOld − 0.1 (fOld: the old hide point, 3.5 past M10),
  //  so at the hide the FRONT of the sphere (fOld − 1, the surface we see) sat behind only ~4 of them: a ~93 px ball, about
  //  half faded, vanished in one frame at 40.70 → 40.73. Now:
  //  · the hide point is 4.5 past M10 (g2.js's sIn; ~40.83), so the sphere's whole visible surface is behind all 16 of them
  //    when it goes;
  //  · 12 more layers fill the ring's depth, from just behind its front face to FA. They fade in only as the hold ends
  //    (40.45 → 40.57), so hold 10 is exactly as before (board 10 shows the path lit to its far edge) and the sphere dissolves
  //    as it rolls through the ring, ~40.53 → 40.83; at the hide ~99 % of it is gone (measured: +3 levels over the tunnel's
  //    dark in its last frame, from +47).
  //  The old layers, the deep ones, the path's colours and the shadow's fade keep their old reference points (FA, fOld).)
  const { C9, Pv } = C, loc10 = p => { const d = p.clone().sub(H.pos); return [d.dot(H.right), d.dot(H.upv), d.dot(H.fwd)]; };
  const fOld = loc10(C9.at(C9.sOf(C.M10.clone().addScaledVector(C.D9h, 3.5))))[2], FA = Math.min(54.9, fOld - 1.3);
  const FG0 = D_RING + 0.1;                                                // the added layers: just behind the ring's front face → FA
  // (thin layers ~0.1 apart, so no layer edge shows as a band on the path or the tube: 16 × 14.6 % from FA, then the deep ones)
  const FOG = Array.from({ length: 16 }, (_, i) => [FA + (fOld - 0.1 - FA) * i / 15, 0.146]).concat(Array.from({ length: 12 }, (_, i) => [fOld + 0.4 + 0.5 * i, 0.2]));
  const NEAR = Array.from({ length: 12 }, (_, i) => [FG0 + (FA - FG0) * i / 12, 0.14]);
  const fogLate = [], fogF = [];                                           // the added layers: [material, alpha]; every layer: [mesh, f]
  for (const [f, a, late] of [...FOG, ...NEAR.map(q => [...q, 1])]) { const d = new THREE.Mesh(new THREE.CircleGeometry(rT * 0.998, 128), flatMat(DARK, a)); d.quaternion.setFromUnitVectors(new Vec(0, 0, 1), H.fwd);
    d.position.copy(A0).addScaledVector(H.fwd, f - D_TUBE); d.renderOrder = 2; mine.push(d); fogF.push([d, f]); if (late) fogLate.push([d.material, a]); }
  anim(t => { const k = sm((t - H.t1) / 0.12); for (const [m, a] of fogLate) m.uniforms.op.value = a * k; });

  /* ---------- the path: from the end of frame 9's ramp into the tunnel ---------- */
  // the sphere's route in camera-10 coords (right, up, fwd), so the slab sits 1 below its centre all the way
  const RT = []; for (let s = C9.sOf(Pv); s <= C9.L; s += 0.25) RT.push(loc10(C9.at(s)));
  const f0 = loc10(Pv)[2], uAt = f => { if (f <= RT[0][2]) return RT[0][1]; for (let i = 1; i < RT.length; i++) if (RT[i][2] >= f) { const a = RT[i - 1], b = RT[i], k = (f - a[2]) / (b[2] - a[2]); return a[1] + (b[1] - a[1]) * k; } return RT.at(-1)[1]; };
  // board 10's trapezoid: edges x = 912 ± 0.545·(y − 781.6) (symmetric about x 912, vanishing at y 781.6), so on the path
  // plane: centre on the ray through x 912, width 5.63 at the frame's bottom edge (f 34.9) narrowing 0.131 per unit to its
  // far edge (f 54.8); near the ramp it eases to the ramp's end width (frame 9's stand-in: half-width 4.125 at Pv)
  const W0 = 4.125, FE = 54.8;
  const hwB = f => 2.815 - 0.0655 * (Math.min(f, FE) - 34.9), cl = f => -0.0238 * Math.min(f, 52.5);
  const hw = f => { const k = sm((f - f0) / 14); return W0 * (1 - k) + hwB(f) * k; }, ctr = f => cl(f) * sm((f - f0) / 6);
  const TP = 1.4, F1 = D_TUBE + 24;
  // (fix pass: it starts 0.3 back, tucked 0.03 under the end of frame 9's ramp: the two tops met edge to edge, and pinholes
  //  along that shared edge showed as a faint dotted crack across the path at 36.4)
  const fT = f0 - 0.3, yT = f => f < f0 ? uAt(f0) - 1 - 0.03 * Math.min(1, (f0 - f) / 0.05) : uAt(f) - 1;
  { const pos = [], lat = [], ff = [], sd = [], idx = [], N = 320, fs = Array.from({ length: N + 1 }, (_, i) => i === 0 ? fT : f0 + (F1 - f0) * (i / N) ** 1.15);
    const V3 = (r, u, f, l, s) => { const p = L3(r, u, f); pos.push(p.x, p.y, p.z); lat.push(l); ff.push(f); sd.push(s); return pos.length / 3 - 1; };
    const strip = (a, b) => { for (let i = 0; i < N; i++) { const p = a + i, q = b + i; idx.push(p, q, p + 1, p + 1, q, q + 1); } };
    const rows = (fn, l, s) => { const st = pos.length / 3; fs.forEach(f => fn(f, l, s)); return st; };
    const top = (f, l, s) => V3(ctr(f) + l * hw(f), yT(f), f, l, s), bot = (f, l, s) => V3(ctr(f) + l * hw(f), yT(f) - TP, f, l, s);
    strip(rows(top, -1, 0), rows(top, 1, 0));                              // top
    strip(rows(bot, -1, 1), rows(top, -1, 1));                             // left side
    strip(rows(top, 1, 1), rows(bot, 1, 1));                               // right side
    strip(rows(bot, 1, 2), rows(bot, -1, 2));                              // underside
    { const a = V3(ctr(fT) - hw(fT), yT(fT), fT, -1, 1), b = V3(ctr(fT) + hw(fT), yT(fT), fT, 1, 1), c = V3(ctr(fT) + hw(fT), yT(fT) - TP, fT, 1, 1), d = V3(ctr(fT) - hw(fT), yT(fT) - TP, fT, -1, 1); idx.push(a, b, c, a, c, d); }   // near end (tucked under the ramp)
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('lat', new THREE.Float32BufferAttribute(lat, 1));
    g.setAttribute('ff', new THREE.Float32BufferAttribute(ff, 1)); g.setAttribute('sd', new THREE.Float32BufferAttribute(sd, 1)); g.setIndex(idx);
    // colour along the path (fwd from camera 10), centre and edges (board 10: orange glow in the middle of the frame's bottom,
    // mauve toward the edges, lilac toward the tunnel), into the tunnel's dark; living: the stops slide ±1.2 units, locked at TK
    // (board 10's path ends at y 884, f 54.8; here it fades smoothly into the tunnel's dark where the fog begins, and runs on
    // in that dark. If the journey lets the sphere roll deeper before it hides, the lit path runs on under it into the fog.)
    const FL = Math.max(54.7, fOld - 1.5);
    // f → [left edge, centre, right edge]: board 10's orange glow is a narrow blob in the middle of the frame's bottom, the
    // left edge runs mauve and the right edge more orange; the near end matches frame 9's ramp end (f09.js) across
    const DE = Math.max(FA + 1.2, FL + 0.3);
    const PT = [[f0, '#b88ae8', '#c08ce8', '#b88ae8'], [16, '#b070c0', '#d27ab4', '#c070b0'], [26, '#c06478', '#ec7a50', '#d86a50'], [33, '#cc6058', '#f97d10', '#e67030'],
      [35.4, '#d4634d', '#fb7f04', '#ea7421'], [36.9, '#c85c63', '#fa7b02', '#e16d36'], [39.2, '#b34e8f', '#d8633f', '#cc5d63'], [41.9, '#963ccc', '#8a34e2', '#aa4aa0'],
      [44.9, '#812ff6', '#7d2cff', '#8d38dc'], [FA, '#7e2efb', '#7a2dfa', '#7d2dfa'], [DE, DARK, DARK, DARK]];
    const col12 = k => pad(PT.map(q => hexV3(q[k])), 12, () => hexV3(DARK));
    const m = new THREE.ShaderMaterial({ side: THREE.DoubleSide,
      uniforms: { t: { value: 0 }, flow: { value: 1 }, spd: { value: 1 }, tk: { value: TK }, fs: { value: pad(PT.map(q => q[0]), 12, () => 1e5) }, cl: { value: col12(1) }, cc: { value: col12(2) }, cr: { value: col12(3) } },
      vertexShader: '#include <common>\n#include <logdepthbuf_pars_vertex>\nattribute float lat, ff, sd; varying float vL, vF, vS;\nvoid main() { vL = lat; vF = ff; vS = sd; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}',
      fragmentShader: `uniform float t, flow, spd, tk, fs[12]; uniform vec3 cl[12], cc[12], cr[12]; varying float vL, vF, vS;
#include <logdepthbuf_pars_fragment>
void main() { float f = vF + 1.2 * min(flow, 1.6) * (sin(6.2832 * ((t - tk) * spd) / 9.5 + 0.8) - sin(0.8)) * smoothstep(52.0, 45.0, vF);
  vec3 l = cl[0], c = cc[0], r = cr[0]; for (int i = 1; i < 12; i++) { float k = clamp((f - fs[i - 1]) / max(1e-4, fs[i] - fs[i - 1]), 0.0, 1.0); l = mix(l, cl[i], k); c = mix(c, cc[i], k); r = mix(r, cr[i], k); }
  vec3 col = mix(mix(l, r, 0.5 + 0.5 * vL), c, exp(-vL * vL / 0.11));
  if (vS > 0.5) col *= vS > 1.5 ? 0.35 : 0.58;
  gl_FragColor = vec4(col, 1.0);
#include <logdepthbuf_fragment>
}` });
    const path = new THREE.Mesh(g, m); path.frustumCulled = false; mine.push(path);
    anim(t => { m.uniforms.t.value = t; const v = window.v2; m.uniforms.flow.value = v ? v.flow : 1; m.uniforms.spd.value = v && typeof v.flowSpeed === 'number' ? v.flowSpeed : 1; }); }

  // the sphere's contact shadow on the path (board 10: a soft dark ellipse round where the sphere sits, darkest to its right).
  // Frame 9's shadow (f09.js) rides the ramp up to Pv and fades out 1–4 units past it: this one takes over there looking
  // exactly like it (same place, size and maroon → black colour, hard edge) and turns into board 10's over the next 7 units.
  { const g = new THREE.CircleGeometry(1, 64), m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { op: { value: 1 }, k: { value: 1 } },
      polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4,
      vertexShader: '#include <common>\n#include <logdepthbuf_pars_vertex>\nvarying vec2 vP;\nvoid main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}',
      fragmentShader: `uniform float op, k; varying vec2 vP;
#include <logdepthbuf_pars_fragment>
void main() { vec3 c9 = mix(vec3(0.50, 0.18, 0.21), vec3(0.03, 0.005, 0.015), clamp((0.95 - vP.x) / 1.9, 0.0, 1.0));
  float e = 1.0 - smoothstep(0.86, 1.0, length(vP)), a10 = (0.6 + 0.4 * smoothstep(-0.4, 0.5, vP.x + 0.4 * vP.y)) * e;
  gl_FragColor = vec4(mix(c9, vec3(0.035, 0.006, 0.06), k), op * mix(0.97 * e, a10, k));
#include <logdepthbuf_fragment>
}` });
    const sh = new THREE.Mesh(g, m); sh.renderOrder = 1; V.scene.add(sh);
    const mB = new THREE.Matrix4();                                          // lying on the path: local x = right, y = forward
    // (fix pass: takes over from frame 9's at one point, 1.5 units past Pv (f09.js uses the same rule), instead of a cross-fade
    //  of two slightly offset discs, which showed a doubled rim)
    anim((t, b) => { const [r, u, f] = loc10(b.p); const on = t > 35.9 && t < 41.4 && f >= f0 + 1.5 && !b.h;
      sh.visible = on; if (!on) return;
      const k = sm((f - f0 - 1.5) / 7); m.uniforms.k.value = k;
      m.uniforms.op.value = 1 - sm((f - FA + 0.4) / 1.0);   // gone as the sphere enters the tunnel's dark
      // (revision: starts exactly as frame 9's new, smaller shadow (f09.js SH_S, SH_O, the soft rim) and turns into board 10's)
      const fc = f + 0.12 - 0.12 * k, sl = (uAt(fc + 0.6) - uAt(fc - 0.6)) / 1.2, Y = H.fwd.clone().addScaledVector(H.upv, sl).normalize();   // lies along the path's slope
      sh.position.copy(L3(r - 0.1 + 0.4 * k, uAt(fc) - 1 + 0.03, fc)); sh.quaternion.setFromRotationMatrix(mB.makeBasis(H.right, Y, H.right.clone().cross(Y)));
      sh.scale.set(0.86 + 0.24 * k, 0.8 + 0.64 * k, 1); }); }   // board 10: 88 × 24 px round the contact point

  /* ---------- the wall's shapes, back to front (depths from camera 10) ---------- */
  // the lavender capsule top left (its rounded foot at y 436; peach at the top, behind the ASCO box)
  P10({ shape: shapeOf(rrPts(217.5, 110, 145, 652, 72.5), [217.5, 110]), at: [217.5, 110], depth: 54.2, thick: 0.6, in: fly(37.05) },
    { lin: [[0, '#dc7550'], [0.5, '#c46c98'], [1, '#ae64c8']], A: [217, 0], B: [217, 420] });
  // the salmon inside the ∩ (behind its legs and arc; the stadium hides its foot)
  P10({ shape: shapeOf(rrPts(532, 290, 160, 340, 0), [532, 290]), at: [532, 290], depth: 55.2, thick: 0.3, in: fly(37.1) },
    { lin: [[0, '#d86a4a'], [1, '#c8646e']], A: [530, 330], B: [530, 440] });
  // the dark violet ∩ outline (arc centre 532,206; outer r 207, inner r 69; its legs run down behind the stadium)
  { const at = [532, 206], s = new THREE.Shape(), Ro = 207, Ri = 69, Ly = 400;
    s.moveTo(-Ro, -Ly); s.lineTo(-Ro, 0); s.absarc(0, 0, Ro, Math.PI, 0, true); s.lineTo(Ro, -Ly); s.lineTo(Ri, -Ly); s.lineTo(Ri, 0); s.absarc(0, 0, Ri, 0, Math.PI, false); s.lineTo(-Ri, -Ly); s.lineTo(-Ro, -Ly);
    P10({ shape: s, at, depth: 54.2, thick: 0.8, in: fly(36.95) }, { lin: [[0, '#280758'], [0.5, '#3e05a0'], [1, '#6510e8']], A: [532, 0], B: [532, 560] }); }
  // the post over the ring (violet → mauve → orange; its foot hides behind the ring)
  P10({ shape: shapeOf(rrPts(919, 175, 162, 1000, 0), [919, 175]), at: [919, 175], depth: 53.0, thick: 1.2, in: fly(37.2) },
    { lin: [[0, '#720fd8'], [0.25, '#8e27b4'], [0.5, '#b3447f'], [0.74, '#d5604a'], [0.86, '#e6712c'], [0.98, '#ee7621'], [1, '#ef7623']], A: [838, 300], B: [962, 300], amp: 0.05 });
  // the tall pill (touching the post; pink top → violet → blue at its left middle, orange low right), cut round the ring
  // (its foot is not a half circle: measured on board 10, it turns tighter at the right and runs flatter along the bottom)
  // (fix pass: the foot was a Catmull-Rom through hand points 30–40 px apart, kinked at every knot and up to 20 px wide at row
  //  1000. Now fitted: a quarter ellipse (centre 1185,730, semi-axes 269 × 280) matches board 10's edge to 0.8 px rms from the
  //  straight right side to the flat bottom (y 1010); the left corner, mostly behind the ring, meets that bottom the same way)
  const pillPts = (() => { const foot = [];
    for (let i = 0; i <= 40; i++) { const a = Math.PI / 2 * i / 40; foot.push([1185 - 189 * Math.cos(a), 900 + 110 * Math.sin(a)]); }
    for (let i = 1; i <= 64; i++) { const a = Math.PI / 2 * i / 64; foot.push([1185 + 269 * Math.sin(a), 730 + 280 * Math.cos(a)]); }
    const P = [[996, -400]]; for (let y = -380; y < 900; y += 20) P.push([996, y]); P.push(...foot); for (let y = 720; y > -400; y -= 20) P.push([1454, y]); P.push([1454, -400]); return P; })();
  P10({ shape: shapeOf(pillPts, [1224, 305], { bitten: true }), at: [1224, 305], depth: 53.3, thick: 1.2, in: fly(36.85) },
    { field: [[1025, 15, '#de4096'], [1025, 95, '#c838aa'], [1025, 175, '#ad2ec3'], [1025, 255, '#9124db'], [1025, 335, '#761aee'], [1025, 415, '#5f10fb'], [1025, 495, '#4c0afc'], [1025, 575, '#3e05fe'],
      [1110, 15, '#e14491'], [1110, 95, '#cc3ca8'], [1110, 175, '#b234c5'], [1110, 255, '#962adf'], [1110, 575, '#5510f7'], [1110, 655, '#500cf3'], [1195, 15, '#e64891'], [1195, 95, '#d141a9'], [1195, 175, '#b73ac5'], [1195, 255, '#9d32e2'],
      [1195, 575, '#7324e2'], [1195, 655, '#7b23d0'], [1195, 735, '#8523c1'], [1195, 815, '#9223b4'], [1195, 895, '#a23093'], [1195, 975, '#a63684'], [1280, 15, '#e74a95'], [1280, 95, '#d345ad'], [1280, 175, '#bc3ec8'], [1280, 255, '#a338e2'],
      [1280, 575, '#8f39c5'], [1280, 655, '#a2409f'], [1280, 735, '#ba4c73'], [1280, 815, '#d65d40'], [1280, 895, '#e46626'], [1280, 975, '#dc6033'], [1365, 15, '#e74c97'], [1365, 95, '#d446b0'], [1365, 175, '#bf42c9'], [1365, 255, '#a93de1'],
      [1365, 575, '#a64aab'], [1365, 655, '#bd5879'], [1365, 735, '#da6a43'], [1365, 815, '#f47d11'], [1365, 895, '#fc8400'], [1100, 800, '#7b14f1'], [1060, 700, '#4a0af8'],
      [1060, -250, '#e2449a'], [1240, -250, '#e64896'], [1420, -250, '#e74c99']], amp: 30, per: 12 });

  // the hourglass (x 1480–1894, centre 1687): violet top bulb, lavender middle bulb, red-orange "sand" and lower bulb.
  // Half-widths measured per row on board 10 (the waists at y ≈ 305 and 928), extended past the frame
  { const X0 = 1687, TOPB = [[-400, 207], [16, 207], [32, 205], [48, 200], [64, 197], [80, 189], [96, 182], [112, 172], [128, 160], [144, 146], [160, 126], [176, 104], [192, 80], [208, 60], [224, 43], [240, 31], [256, 23], [272, 17], [290, 14], [305, 13]];
    const Hm = [[0, 207], [16, 207], [32, 205], [48, 202], [64, 196], [80, 191], [96, 182], [112, 174], [128, 162], [144, 148], [160, 129], [176, 106], [192, 80], [208, 57], [224, 42], [240, 31], [256, 24], [272, 19], [288, 16], [304, 14], [312, 14]];
    const hmid = dy => { dy = Math.abs(dy); for (let i = 1; i < Hm.length; i++) if (Hm[i][0] >= dy) { const [a, ha] = Hm[i - 1], [b, hb] = Hm[i]; return ha + (hb - ha) * (dy - a) / (b - a); } return 14; };
    const profile = (y0, y1, fn, step = 4) => { const L = [], R = []; for (let y = y0; y <= y1 + 1e-6; y += step) { const w = fn(Math.min(y, y1)); L.push([X0 - w, y]); R.push([X0 + w, y]); } return [...L, ...R.reverse()]; };
    const tab = T => y => { for (let i = 1; i < T.length; i++) if (T[i][0] >= y) { const [a, ha] = T[i - 1], [b, hb] = T[i]; return ha + (hb - ha) * (y - a) / (b - a); } return T.at(-1)[1]; };
    // lower: the sand from its flat top (y 612) down through the waist into the bottom bulb, standing on the wall's foot (y 1400)
    // (below the lower waist the bulb follows the same profile about its own widest row, y 1224: within 4 px of board 10's rows)
    const lowFn = y => y <= 928 ? hmid(y - 616) : Math.max(1, hmid(y - 1224) * (1 - sm((y - 1500) / 40)));
    const lowPts = profile(612, 1400, lowFn);
    P10({ shape: shapeOf(lowPts, [1687, 900]), at: [1687, 900], depth: 53.2, thick: 1.0, in: fly(36.65) },   // (fix pass: the hourglass's three parts now fly in together, 36.85–36.95:
      { lin: [[0, '#d4644a'], [0.5, '#e25b43'], [1, '#fc3f36']], A: [1480, 700], B: [1894, 700] });
    // the lavender middle bulb (from the upper waist down; its lower half hides behind the sand)
    P10({ shape: shapeOf(profile(288, 760, y => hmid(y - 616)), [1687, 520]), at: [1687, 520], depth: 54.4, thick: 0.4, in: fly(36.7) },    //  the orange silhouette used to arrive alone, square-cut, 0.5–0.85 s before its bulbs)
      { lin: [[0, '#a334db'], [0.35, '#a643e3'], [1, '#9946f8']], A: [1687, 300], B: [1687, 600] });
    // the violet top bulb
    P10({ shape: shapeOf(profile(-400, 305, tab(TOPB)), [1687, 0]), at: [1687, 0], depth: 53.2, thick: 1.0, in: fly(36.75) },
      { lin: [[0, '#5a07f3'], [0.39, '#6500fc'], [0.66, '#740ef5'], [0.82, '#871dec'], [1, '#a334db']], A: [1687, 0], B: [1687, 305] }); }   // (into the lavender at the waist: no seam)

  // the big violet stadium (x … 787, y 436–920): violet, darker in the middle, into mauve and orange along its foot; cut round the ring
  P10({ shape: shapeOf(rrPts(43.5, 678, 1487, 484, 242), [43.5, 678], { bitten: true }), at: [43.5, 678], depth: 53.0, thick: 1.0, in: fly(36.65) },
    { lin: [[0, '#6f13f2'], [0.133, '#680fe9'], [0.311, '#5a0bcf'], [0.489, '#4b04b9'], [0.578, '#63179f'], [0.667, '#822a86'], [0.756, '#9e3e6c'], [0.844, '#bb5350'], [0.933, '#d86737'], [1.05, '#e67030']], A: [0, 470], B: [0, 920], amp: 0.04 });
  // the pill on it: lavender on the left (its right edge a straight cut at x 322) over a mauve → salmon → orange pill on the right
  P10({ shape: shapeOf(rrPts(438, 677, 374, 162, 81), [438, 677]), at: [438, 677], depth: 52.35, thick: 0.6, in: fly(36.75) },
    { lin: [[0, '#993970'], [0.14, '#a1406a'], [0.55, '#bd5350'], [0.78, '#ca5c43'], [1, '#d76537']], A: [438, 605], B: [438, 750], amp: 0.05 });
  { const s = new THREE.Shape(), r = 81; s.moveTo(0, -r); s.lineTo(0, r); s.lineTo(-(297 - r), r); s.absarc(-(297 - r), 0, r, Math.PI / 2, 1.5 * Math.PI, false); s.lineTo(0, -r);
    P10({ shape: s, at: [322, 677], depth: 51.95, thick: 0.6, in: fly(36.75) },
      { lin: [[0, '#9c5ff8'], [0.55, '#a05eeb'], [1, '#ab61cc']], A: [150, 610], B: [150, 750], amp: 0.05 }); }
  // its lavender ∪ (flat top on the pill's top edge, round foot)
  { const s = new THREE.Shape(); s.moveTo(-69, 0); s.lineTo(69, 0); s.absarc(0, 0, 69, 0, -Math.PI, true); s.lineTo(-69, 0);
    P10({ shape: s, at: [531, 596], depth: 51.95, thick: 0.3, in: fly(36.8) }, { lin: [[0, '#b357aa'], [1, '#aa58bc']], A: [531, 598], B: [531, 667] }); }
  // the magenta blob behind the stadium and the ring
  P10({ shape: shapeOf(circlePts(660, 895, 112, 160), [660, 895], { bitten: true }), at: [660, 895], depth: 54.2, thick: 0.4, in: fly(36.4) },
    { lin: [[0, '#d010fc'], [1, '#c80ef4']], A: [560, 895], B: [760, 895] });
  // the orange ∩ arch (centre 342,820; outer r 172, inner r 55)
  { const at = [342, 820], Ro = 172, Ri = 55, Ly = 580, s = new THREE.Shape();              // (its legs stand on the wall's foot, y 1400)
    s.moveTo(-Ro, -Ly); s.lineTo(-Ro, 0); s.absarc(0, 0, Ro, Math.PI, 0, true); s.lineTo(Ro, -Ly); s.lineTo(Ri, -Ly);
    s.lineTo(Ri, 0); s.absarc(0, 0, Ri, 0, Math.PI, false); s.lineTo(-Ri, -Ly); s.lineTo(-Ro, -Ly);
    P10({ shape: s, at, depth: 50.6, thick: 1.2, in: fly(36.3) },
      { field: [[180, 805, '#e74b93'], [180, 855, '#dd43a3'], [180, 905, '#d33aad'], [180, 955, '#c233b0'], [180, 1005, '#b129bb'], [180, 1055, '#9d1ecb'], [225, 705, '#f75e75'], [225, 755, '#f2587e'], [225, 805, '#ea508b'],
        [225, 855, '#e04896'], [225, 905, '#d5409e'], [225, 955, '#c637a4'], [225, 1005, '#b42daf'], [225, 1055, '#9e21c3'], [270, 705, '#fa6463'], [270, 755, '#f55f6b'], [270, 805, '#ee5a71'], [270, 855, '#e7527b'], [270, 905, '#dc4a84'],
        [270, 955, '#cd418a'], [270, 1005, '#b93599'], [270, 1055, '#a427b2'], [315, 705, '#fc6c52'], [315, 755, '#fa6855'], [342, 662, '#fd7148'], [360, 705, '#fd733e'], [360, 755, '#fc713d'], [405, 705, '#fe7b2e'], [405, 755, '#fd7b27'],
        [405, 805, '#f97a25'], [405, 855, '#f47520'], [405, 905, '#f4731b'], [405, 955, '#e26a2f'], [405, 1005, '#d0594b'], [405, 1055, '#ba466f'], [450, 705, '#fe7f20'], [450, 755, '#ff8119'], [450, 805, '#ff8210'], [450, 855, '#fd8108'],
        [450, 905, '#f97c05'], [450, 955, '#ee720f'], [450, 1005, '#d9602d'], [450, 1055, '#bf495a'], [495, 805, '#fe8608'], [495, 855, '#fe8500'], [495, 905, '#fa8100'], [495, 955, '#ef760a'], [495, 1005, '#db6427'], [495, 1055, '#c14d52'],
        [200, 1200, '#7e16c0'], [260, 1200, '#8a1ab8'], [425, 1200, '#a0386a'], [485, 1200, '#a63c60'], [200, 1420, '#5e10a8'], [485, 1420, '#80307a']], amp: 22, per: 10 }); }

  // my non-piece meshes (tube, fog, path) exist from the whip on (behind frame 9's camera until then)
  for (const me of mine) { me.visible = false; if (!me.parent) V.scene.add(me); }
  anim(t => { const on = t > 35.3 && t < 41.45; for (const me of mine) me.visible = on; });
  // (revision, the 41.4 contract: the sphere is never hidden now; the camera follows it into the tunnel and sits 3 behind it at
  //  the cut, "lit against the dark". So a fog layer shows only while it is beyond the sphere (it darkens the tunnel ahead of
  //  it); once the sphere reaches it, it switches off, so no layer ever lies between the camera and the sphere)
  anim((t, b) => { const bf = loc10(b.p)[2]; for (const [d, f] of fogF) if (d.visible) d.visible = f > bf + 1.05; });
};
