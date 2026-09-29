/* Frame 11 · out of the dark exit tunnel, frontal on the wall with the ring tunnel; the sphere comes down the S-path toward
   the camera (G3, called from g3.js with its context G). Built (batch 3): every board 11 shape is real 3D, the plate is gone.
   Depths are from camera 11 (the sphere's mark at 36.7; the ring's face, the wall's front, at W11 = 42.7).
   · The ring and the exit tunnel: a thick ring (board 11's conic colours, measured round it; flat at the hold) and a long
     tube behind it along the tunnel's axis, lining the ring's hole. Near the mouth it is board 11's hole colour; deeper in it
     darkens and its ribs catch light only while the camera is close (inside or backing out), so from the hold the hole
     reads flat like the board while the back-out shows the ribs streaming past. (revision: the 10 → 11 chase now runs through
     it, the camera overtaking the sphere inside, so seen from inside it also has a slow living sheen, a lighter floor lane and
     the exit's warm light on its last few units.) (polish 2026-09-29: the ribs are painted in the tube's shader now, filtered
     over each pixel's footprint and a one-frame shutter, so they no longer strobe as the camera streams past and backs out;
     see the tube below.)
   · The S-path ribbon: a sweep along the sphere's path (its top 1 below the sphere's centre), whose edges and side walls are
     solved against board 11 from the hold camera: at each point the face runs out to the board's traced edges (TOP) and
     the near side wall down to its traced walls (SIDES). The chute down the ring's face turns (it twists smoothly) into a
     switchback whose narrow legs are banked toward the camera (it sees them from barely above), easing flat on the wide run
     to the corner. Its colours are a field over hold 11's board px, so at the hold every face shows board 11's colours.
     The sphere's contact shadow is board 11's crisp ellipse, offset lower right.
     (The fit is tuned for the S path requested from g3.js in the batch 3 report: the chute, the switchback's two hairpins
     and the run on board 11's ribbon. On the older path the solve still follows it, but the fit is looser.)
     (chute fix, user 2026-09-28: "the chute … the graphics are not very smooth. They're kind of crooked." The sphere's path
     through the chute and the switchback is now one smooth spline (g3.js), and the ribbon's twist, widths and walls are
     smooth functions along it (see rib), so its edges, walls and twist stay even from every angle over 42.6–46.)
   · The hand-off to frame 12's road (f12.js starts it 1.5 past the mark, flat, 6 wide, 0.9 deep): the ribbon is flat by then;
     past that point board 11's wide run (the tail) dissolves after the hold as the road appears, and a neck narrows from
     the ribbon's section into the road's, 0.01–0.016 under its top. The ribbon's colours there (for matching the road):
     top ≈ #ee5e3f at the hand-off, #fc6f22 2 on, #fe7f09 4.5 on; near side ≈ #0201b0.
   · The wall: a backdrop carrying board 11's base colour field (indigo, the maroon top-left corner, the violet top), with
     the tunnel's hole; behind the ring, back to front: the big dark disc low left (under the HER2 picture) and the bar
     peeking below it, the tall column (soft dark left edge, sharp red-brown right edge at x 1714), the magenta panel right
     of it, the right disc, the dark rounded rect under the ASCO box (split at 1714, where the board's panel edge runs),
     the orange rounded shape top right, the two violet → orange pipes from the top edge, the band from the top-left corner
     and its two bars to the ring; and the yellow ∩ just behind the ring's face (split at 1715 too). The HER2 picture, the
     ASCO box and the words are copy: their areas show what the board implies behind them.
   · Build: the ring and tunnel are there from the cut (41.4, in the dark); as the camera backs out and its view widens the
     shapes arrive (the band slides in from the left, the pipes drop, the disc grows, the ∩ rises, the rest fly in), all
     settled before the hold. After it, as the camera swings away right, they leave left to right (slides, shrinks, fades),
     the ring shrinks, the ribbon retracts from the tunnel toward the sphere, and the backdrop fades as frame 12 builds in. */
export default (V, G) => {
  const { THREE, h11: H, W11, RC, RI, sm } = G;
  const { anim } = V;
  const Vec = THREE.Vector3, TK = H.tk;
  V.unplate(11);
  const cam = H.pos, fwd = H.fwd, rgt = H.right, upv = H.upv, tanV = H.tanV;
  const kpx = d => d * tanV / 540;                                        // world units per board px at depth d (camera 11)
  const proj = p => { const d = p.clone().sub(cam), z = d.dot(fwd); return [960 + d.dot(rgt) / z / tanV * 540, 540 - d.dot(upv) / z / tanV * 540, z]; };
  const hexV3 = h => { const n = parseInt(h.slice(1), 16); return new Vec((n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255); };
  const LOGV = '#include <common>\n#include <logdepthbuf_pars_vertex>\n';
  const flowM = V.mat(['#000000']).uniforms, flowU = flowM.flow, spdU = flowM.spd;                          // the engine's gradient-flow level (shared)
  const tU = { value: 0 }; anim(t => { tU.value = t; });

  const { C, L, sOf } = G;                                                // the sphere's path (g3.js)

  /* ---------- pieces: flat at hold 11 (back faces pushed out along camera 11's view rays) ---------- */
  const flatGeo = (g, at, d, keepR = 0) => { const p = g.attributes.position; g.computeBoundingBox(); const zb = g.boundingBox.min.z; if (zb > -1e-6) return g;
    const t = -zb * d * tanV / 540;
    for (let i = 0; i < p.count; i++) if (p.getZ(i) < zb / 2 && Math.hypot(p.getX(i), p.getY(i)) >= keepR) { const x = p.getX(i), y = p.getY(i); p.setXY(i, x + (at[0] - 960 + x) * t / d, y + (540 - at[1] + y) * t / d); }
    p.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingBox(); return g; };

  /* ---------- skin: board-coloured gradient material for pieces (f10's method): multi-stop linear, conic, or a colour field;
     living (the stops drift), locked so the board colours land exactly at the key instant TK ---------- */
  const GV = LOGV + 'varying vec3 vO; varying vec3 vNv; varying vec3 vNl;\nvoid main() { vO = position; vNl = normal; vNv = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}';
  const GF = `uniform int mode, ns, ns2, na; uniform float op, t, flow, spd, tk, amp, per, ph0, rb;
uniform vec2 A, B, cc; uniform float holeR; uniform vec3 holeC; uniform vec4 box; uniform vec3 vigC; uniform float vigK, vigR, kern, kpw; uniform float st[12], st2[12]; uniform vec3 sc[12], sc2[12]; uniform vec2 ap[64]; uniform vec3 ac[64], a0, ax, ay;
varying vec3 vO; varying vec3 vNv; varying vec3 vNl;
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
    if (kern > 0.0) { vec3 sum = vec3(0.0); float ws = 0.0;
      for (int i = 0; i < 64; i++) { if (i >= na) break; float k = float(i); vec2 p = ap[i] + amp * fl * vec2(wob(k), wob(k + 0.5));
        vec2 d = cp - p; float w = pow(1.0 + dot(d, d) / (kern * kern), -kpw); sum += ac[i] * w; ws += w; }
      col = sum / ws; }
    else { col = a0 + ax * q.x + ay * q.y;
      for (int i = 0; i < 64; i++) { if (i >= na) break; float k = float(i); vec2 p = (ap[i] + amp * fl * vec2(wob(k), wob(k + 0.5))) / 500.0;
        float r2 = dot(q - p, q - p); col += ac[i] * (r2 > 1e-9 ? 0.5 * r2 * log(r2) : 0.0); } }
    col = mix(clamp(col, 0.0, 1.0), vigC, vigK * smoothstep(0.0, vigR, length(vO.xy - cp))); }
  vec3 nv = normalize(vNv); float shade = mix(0.72 + 0.12 * nv.y - 0.05 * nv.x, 1.0, smoothstep(0.55, 0.98, abs(nv.z)));
  if (length(vO.xy - cc) < holeR && abs(normalize(vNl).z) < 0.7) { col = holeC; shade = 1.0; }   // a ring's hole wall: the tunnel's colour
  gl_FragColor = vec4(col * shade, op);
#include <logdepthbuf_fragment>
}`;
  const pad = (a, n, f) => { const o = a.slice(0, n); while (o.length < n) o.push(f()); return o; };
  const tps = (X, cols, lam) => { const n = X.length, N = n + 3, M = Array.from({ length: N }, () => new Float64Array(N + 3)), phi = r2 => r2 > 1e-12 ? 0.5 * r2 * Math.log(r2) : 0;
    for (let i = 0; i < n; i++) { for (let j = 0; j < n; j++) M[i][j] = phi((X[i][0] - X[j][0]) ** 2 + (X[i][1] - X[j][1]) ** 2) + (i === j ? lam : 0);
      M[i][n] = M[n][i] = 1; M[i][n + 1] = M[n + 1][i] = X[i][0]; M[i][n + 2] = M[n + 2][i] = X[i][1]; M[i][N] = cols[i].x; M[i][N + 1] = cols[i].y; M[i][N + 2] = cols[i].z; }
    for (let c = 0; c < N; c++) { let pv = c; for (let r = c + 1; r < N; r++) if (Math.abs(M[r][c]) > Math.abs(M[pv][c])) pv = r; [M[c], M[pv]] = [M[pv], M[c]];
      for (let r = 0; r < N; r++) if (r !== c) { const k = M[r][c] / M[c][c]; if (k) for (let q = c; q < N + 3; q++) M[r][q] -= k * M[c][q]; } }
    const sol = k => new Vec(M[k][N] / M[k][k], M[k][N + 1] / M[k][k], M[k][N + 2] / M[k][k]);
    return { w: Array.from({ length: n }, (_, i) => sol(i)), a: [sol(n), sol(n + 1), sol(n + 2)] }; };
  const swaps = [];
  const skin = (pc, g, at) => {
    const o0 = pc.mesh.material, loc = ([x, y]) => new THREE.Vector2(x - at[0], at[1] - y);
    const u = { op: o0.uniforms.op, t: o0.uniforms.t, flow: o0.uniforms.flow, spd: o0.uniforms.spd, tk: { value: TK }, amp: { value: g.amp ?? 0.08 }, per: { value: g.per ?? 9 }, ph0: { value: 1.3 + 0.9 * swaps.length },
      mode: { value: 0 }, ns: { value: 1 }, ns2: { value: 1 }, na: { value: 0 }, rb: { value: 0 }, holeR: { value: g.holeR ?? -1 }, holeC: { value: hexV3(g.holeC || '#000000') },
      A: { value: new THREE.Vector2() }, B: { value: new THREE.Vector2(1, 0) }, cc: { value: new THREE.Vector2() },
      st: { value: pad([], 12, () => 0) }, st2: { value: pad([], 12, () => 0) }, sc: { value: pad([], 12, () => new Vec()) }, sc2: { value: pad([], 12, () => new Vec()) },
      ap: { value: pad([], 64, () => new THREE.Vector2()) }, ac: { value: pad([], 64, () => new Vec()) }, a0: { value: new Vec() }, ax: { value: new Vec() }, ay: { value: new Vec() },
      box: { value: new THREE.Vector4(-1e6, -1e6, 1e6, 1e6) }, vigC: { value: new Vec() }, vigK: { value: 0 }, vigR: { value: 1 }, kern: { value: 0 }, kpw: { value: 2 } };
    const tab = (list, n, s, c) => { u[n].value = list.length; u[s].value = pad(list.map(q => q[0]), 12, () => 1e5); u[c].value = pad(list.map(q => hexV3(q[1])), 12, () => hexV3(list.at(-1)[1])); };
    if (g.lin) { u.mode.value = 0; u.A.value = loc(g.A); u.B.value = loc(g.B); tab(g.lin, 'ns', 'st', 'sc'); }
    else if (g.conic) { u.mode.value = 1; u.cc.value = loc(g.cc); u.rb.value = g.rb ?? 1e9; tab(g.conic, 'ns', 'st', 'sc'); tab(g.conic2 || g.conic, 'ns2', 'st2', 'sc2'); }
    else { const P = g.field.map(q => loc(q)), T = g.kern ? null : tps(P.map(v => [v.x / 500, v.y / 500]), g.field.map(q => hexV3(q[2])), g.lam ?? 1e-3);
      u.mode.value = 2; u.na.value = P.length; u.ap.value = pad(P, 64, () => new THREE.Vector2());
      if (g.kern) { u.kern.value = g.kern; u.kpw.value = g.kpw ?? 2; u.ac.value = pad(g.field.map(q => hexV3(q[2])), 64, () => new Vec()); }
      else { u.ac.value = pad(T.w, 64, () => new Vec()); u.a0.value = T.a[0]; u.ax.value = T.a[1]; u.ay.value = T.a[2]; }
      if (g.box) { const p0 = loc([g.box[0], g.box[3]]), p1 = loc([g.box[2], g.box[1]]); u.box.value.set(p0.x, p0.y, p1.x, p1.y); u.vigC.value = hexV3(g.vig[0]); u.vigK.value = g.vig[1]; u.vigR.value = g.vig[2]; } }
    const m = new THREE.ShaderMaterial({ uniforms: u, vertexShader: GV, fragmentShader: GF, side: o0.side });
    pc.mesh.material = m; swaps.push([o0, m]); return pc; };
  anim(() => { for (const [a, b] of swaps) { b.transparent = a.transparent; b.depthWrite = a.depthWrite; } });

  /* ---------- a colour field over hold-11 board px, for 3D surfaces (the ribbon): the fragment's world position is projected
     with camera 11, so at the hold every surface shows board 11's colours where the board has them; the anchors drift slowly
     (living), locked so they sit on their board spots at TK ---------- */
  const hc = new THREE.PerspectiveCamera(H.fov, 16 / 9, 0.05, 2000);
  hc.position.copy(cam); hc.up.set(0, 1, 0); hc.lookAt(H.look); hc.updateMatrixWorld(); hc.updateProjectionMatrix();
  const HVP = new THREE.Matrix4().multiplyMatrices(hc.projectionMatrix, hc.matrixWorldInverse);
  const fieldU = (name, list) => ({ [name + 'P']: { value: list.map(([x, y]) => new THREE.Vector2(x, y)) }, [name + 'C']: { value: list.map(q => hexV3(q[2])) } });
  const fieldGLSL = (name, n, kern = 70, kpw = 2.2, amp = 14, per = 10) => `uniform vec2 ${name}P[${n}]; uniform vec3 ${name}C[${n}];
vec3 ${name}(vec2 b, float t, float fl) { vec3 s = vec3(0.0); float ws = 0.0;
  for (int i = 0; i < ${n}; i++) { float k = float(i), a = ${amp.toFixed(1)} * fl;
    vec2 p = ${name}P[i] + a * vec2(sin(6.2832 * ((t - ${TK.toFixed(3)}) * spd) / (${per.toFixed(1)} * (1.0 + 0.13 * k)) + 1.7 * k) - sin(1.7 * k), sin(6.2832 * ((t - ${TK.toFixed(3)}) * spd) / (${per.toFixed(1)} * (1.0 + 0.11 * k)) + 0.9 + 1.3 * k) - sin(0.9 + 1.3 * k));
    vec2 d = b - p; float w = pow(1.0 + dot(d, d) / ${(kern * kern).toFixed(1)}, -${kpw.toFixed(2)}); s += ${name}C[i] * w; ws += w; }
  return s / ws; }\n`;

  /* ---------- shapes from absolute board px ---------- */
  const circlePts = (cx, cy, r, n = 256) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos(2 * Math.PI * i / n), cy - r * Math.sin(2 * Math.PI * i / n)]);
  const areaOf = P => { let a = 0; for (let i = 0; i < P.length; i++) { const [x0, y0] = P[i], [x1, y1] = P[(i + 1) % P.length]; a += x0 * y1 - x1 * y0; } return a / 2; };
  const toLocal = (P, at) => { const Q = P.map(([x, y]) => [x - at[0], at[1] - y]); return areaOf(Q) < 0 ? Q.reverse() : Q; };
  const shapeOf = (P, at, holes = []) => { const s = new THREE.Shape(toLocal(P, at).map(([x, y]) => new THREE.Vector2(x, y)));
    for (const Hp of holes) s.holes.push(new THREE.Path(toLocal(Hp, at).reverse().map(([x, y]) => new THREE.Vector2(x, y)))); return s; };
  const P11 = (spec, g) => { const pc = V.piece({ hold: 11, ...spec }); if (spec.flat !== false) flatGeo(pc.mesh.geometry, spec.at, spec.depth, spec.keepR || 0); if (g) skin(pc, g, spec.at); return pc; };
  const inPoly = (P, x, y) => { let r = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) r = !r; } return r; };

  /* =================== the ring and the exit tunnel =================== */
  const RCpx = [1095, 410], D_RING = W11, TH_RING = 1.4;
  const ringStops = [[0, '#3a0efd'], [45, '#0a00fe'], [75, '#2c01ff'], [92, '#700dde'], [106, '#ce554c'], [122, '#fb8b01'], [140, '#fd9500'], [180, '#f06a14'], [225, '#f85158'], [275, '#e240a5'], [320, '#9227e6'], [360, '#3a0efd']];
  // (fix pass 2: board 11's ring is a little taller than wide and off the hole's centre: its outer edge measures 274 / 267 px
  //  right / left and 280 / 275 top / bottom from (1095, 410). As a 270 circle it fell 4–6 px short at the lower right, where a
  //  dark strip of the wall showed between the ring and the ribbon's second leg. The hole stays on the tunnel.)
  const ringShape = new THREE.Shape(Array.from({ length: 256 }, (_, i) => { const a = 2 * Math.PI * i / 256; return new THREE.Vector2(3.5 + 271 * Math.cos(a), 2.5 + 277 * Math.sin(a)); }));
  ringShape.holes.push(new THREE.Path(circlePts(0, 0, 137).map(([x, y]) => new THREE.Vector2(x, y))));
  P11({ shape: ringShape, at: RCpx, depth: D_RING, thick: TH_RING, drift: 0, out: { type: 'grow', t: [46.3, 46.85], ease: 'power2.in' } }, { conic: ringStops, cc: RCpx, amp: 8, per: 10, holeR: 160, holeC: '#25085a' });

  // the tube: along the tunnel's axis (world −z, the hold camera's view), from the ring's front face back into the dark. Near the
  // mouth it is board 11's hole colour; deeper in it darkens, but only while the camera is close (inside or backing out), so
  // from the hold the hole reads flat like the board. Ribs (lit when the camera is near) stream past as the camera backs out.
  // (polish 2026-09-29, backlog: "frame 11: the thin tunnel rings can strobe during the back-out (filter or thicken them)"; the
  //  user had reported a flicker on frame 11. The 16 ribs were thin torus meshes (0.11 across, 2.6 apart). On 1/30 s frames
  //  they alone made the picture flicker over up to ~5% of the frame, 41.7–43.35: near the camera a rib jumped several times
  //  its own width from frame to frame (a staccato), and deep in the tube they were 1–3 px lines about as far apart as they
  //  were wide (a shimmer). They are now painted in the tube wall's own shader, with the same size, spacing, bottom gap, relief
  //  and colours, and FILTERED: each pixel shows the ribs averaged over the stretch of wall it covers, i.e. its own footprint
  //  and what it sweeps over a 1/30 s shutter (a full frame: the camera half a frame before and after, reprojected onto the
  //  tube; a motion blur). A slow rib reads crisp, a fast one as a soft streak that meets the next frame's, and the far ones
  //  melt into their average tone. Measured the same way, the rings' flicker is ~15× less (a half-frame shutter left ~40% of
  //  it: its streaks still stepped).)
  const TL = 46, RT = RI - 0.003, mouthZ = RC.z, tubeZ = mouthZ - 0.02;   // (the tube lines the ring's hole: same dark, so the two never show a seam)
  const tubeU = { near: { value: 0 }, c0: { value: hexV3('#25085a') }, c1: { value: hexV3('#0b0324') }, zm: { value: mouthZ }, t: tU, flow: flowU, spd: spdU, ax: { value: new THREE.Vector2(RC.x, RC.y) } };
  // the ribs, as the torus meshes were: the first 1.9 in from the mouth, then every 2.6, 16 of them; 0.055 half-width; standing
  // 0.105 proud of the wall (seen at a slant, a rib hides the wall just behind it, so deep in the tube they read fuller); a
  // 0.9 rad gap at the bottom for the sphere's run. iA / iB, pA / pB: the camera at t ∓ 1/60 s (set in onBeforeRender below)
  const ribU = { rT: { value: RT }, rz0: { value: 1.9 }, rP: { value: 2.6 }, rN: { value: 16 }, rA: { value: 0.055 }, rH: { value: 0.105 }, rGap: { value: 0.9 },
    cR: { value: hexV3('#5a2ad8') }, cD: { value: hexV3('#1a0850') }, iA: { value: new THREE.Matrix4() }, iB: { value: new THREE.Matrix4() }, pA: { value: new Vec() }, pB: { value: new Vec() } };
  const tubeMat = (side, wall) => new THREE.ShaderMaterial({ side, uniforms: { ...tubeU, ...ribU, wall: { value: wall ? 1 : 0 } },
    vertexShader: LOGV + 'varying vec3 vW; varying vec3 vN; varying vec4 vC;\nvoid main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; vC = gl_Position;\n#include <logdepthbuf_vertex>\n}',
    fragmentShader: `uniform float near, zm, t, spd, flow, wall, rT, rz0, rP, rN, rA, rH, rGap; uniform vec3 c0, c1, cR, cD, pA, pB; uniform vec2 ax; uniform mat4 iA, iB;
varying vec3 vW; varying vec3 vN; varying vec4 vC;
#include <logdepthbuf_pars_fragment>
// where this pixel's ray met the tube wall (z) for the camera at c with inverse view-projection iv (the far root: the inner wall
// is the one seen, from inside the tube or through its mouth)
float hitZ(mat4 iv, vec3 c, vec2 ndc, float zNow) {
  vec4 p = iv * vec4(ndc, 0.5, 1.0); vec3 d = normalize(p.xyz / p.w - c);
  vec2 o = c.xy - ax; float A = dot(d.xy, d.xy), B = dot(o, d.xy), D = B * B - A * (dot(o, o) - rT * rT);
  if (A < 1e-10 || D < 0.0) return zNow;
  float s = (-B + sqrt(D)) / A; return s > 0.0 ? c.z + s * d.z : zNow; }
// the ribs' cover summed from the mouth to u (rib units: rib k spans k + cs ± w, k = 0 … rN − 1)
float ribF(float u, float cs, float w) { float s = u - cs + w, k = floor(s);
  return 2.0 * w * clamp(k, 0.0, rN) + (k >= 0.0 && k < rN ? min(s - k, 2.0 * w) : 0.0); }
void main() { float dz = zm - vW.z; float k = near * smoothstep(1.0, 22.0, dz);
  vec3 col = mix(c0, c1, k);
  col *= mix(1.0, 0.86 + 0.14 * smoothstep(-1.0, 1.0, -vN.y), near * (1.0 - smoothstep(10.0, 30.0, dz)));
  // (revision: the 10 → 11 chase now runs through here, so it is finished for the inside view) only while the camera is near:
  // a slow living sheen round the wall (violet ↔ magenta, broad, drifting with the gradient flow), the floor lane where the
  // sphere runs a touch lighter, and the exit's light warming the last few units before the mouth
  // (none where the tube lines the ring's own hole wall, the first ~1.5 u: the two coincide there and must stay one colour)
  vec2 q = vW.xy - ax; float a = atan(q.x, q.y), fl = min(flow, 1.6), nr = near * smoothstep(1.5, 2.3, dz);
  float w = 0.5 + 0.5 * sin(a + dz * 0.12 - t * spd * 0.9 * fl);
  vec3 sheen = mix(vec3(0.15, 0.045, 0.40), vec3(0.34, 0.07, 0.47), w) * (0.5 + 0.5 * (1.0 - smoothstep(6.0, 34.0, dz)));
  col = mix(col, sheen, nr * 0.6);
  col += nr * (0.09 * smoothstep(0.82, 0.98, -vN.y) * vec3(0.55, 0.3, 0.95) + 0.28 * exp(-max(dz - 1.5, 0.0) / 3.2) * vec3(1.0, 0.45, 0.22));
  // the ribs (the wall only, not the far cap): u in rib units along the tube; the span of u this pixel covers (its footprint,
  // fwidth, plus where its ray met the wall half a frame before and after); the ribs' average cover over that span
  if (wall > 0.5) {
    float u = (dz - rz0) / rP;
    vec3 rd = normalize(vW - cameraPosition); vec2 q = vW.xy - ax; float rl = max(length(q), 1e-4);
    // relief: seen at a slant (cot = axial / radial ray), a rib 0.105 proud also hides rH·cot of wall beyond it along the ray
    float cot = min(abs(rd.z) / max(abs(dot(rd.xy, q / rl)), 1e-3), rP / rH), sg = rd.z < 0.0 ? 1.0 : -1.0;
    float e = rH * cot / rP, w = min(rA / rP + 0.5 * e, 0.5), cs = sg * 0.5 * e;
    vec2 ndc = vC.xy / vC.w;
    float uA = (zm - hitZ(iA, pA, ndc, vW.z) - rz0) / rP, uB = (zm - hitZ(iB, pB, ndc, vW.z) - rz0) / rP;
    float fu = fwidth(u), lo = min(u, min(uA, uB)) - 0.5 * fu, hi = max(u, max(uA, uB)) + 0.5 * fu;
    if (hi - lo < 1e-3) { lo -= 5e-4; hi += 5e-4; }
    float cov = (ribF(hi, cs, w) - ribF(lo, cs, w)) / (hi - lo);
    float cb = -q.y / rl, cg = cos(0.5 * rGap), aw = 0.5 * fwidth(cb) + 0.002;     // (the gap at the bottom, antialiased)
    cov *= 1.0 - smoothstep(cg - aw, cg + aw, cb);
    // the rib's colour (as the torus ribs': lit near the camera, the mouth's warm light on the first); its top reads 0.9, the
    // side facing the mouth 1.0 and the far side 0.8, weighted by how much of each the slant shows
    float sh = mix(0.9, sg > 0.0 ? 1.0 : 0.8, e / (2.0 * rA / rP + e));
    vec3 lit = mix(cR, cD, smoothstep(4.0, 26.0, dz)) * sh + 0.3 * exp(-max(dz, 0.0) / 3.0) * vec3(1.0, 0.5, 0.25);
    col = mix(col, mix(c0, lit, near), clamp(cov, 0.0, 1.0));
  }
  gl_FragColor = vec4(col, 1.0);
#include <logdepthbuf_fragment>
}` });
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(RT, RT, TL, 128, 1, true), tubeMat(THREE.BackSide, true));
  tube.rotation.x = Math.PI / 2; tube.position.set(RC.x, RC.y, tubeZ - TL / 2); V.scene.add(tube);
  const cap = new THREE.Mesh(new THREE.CircleGeometry(RT, 64), tubeMat(THREE.DoubleSide, false)); cap.position.set(RC.x, RC.y, tubeZ - TL); V.scene.add(cap);
  // the shutter: just before the tube is drawn, the camera half a frame (1/60 s) before and after, as the engine's camera keys
  // give it (G3's keys here are plain poses: no look-follow, not sphere-relative), carried over to the camera actually drawing
  // (so a frame edit or a saved moment moves them with it); never from before the 41.4 cut (the other group's camera)
  { const SH = 1 / 60, CUT = 41.4, raw = new THREE.PerspectiveCamera(), rawN = new THREE.PerspectiveCamera(), pc = new THREE.PerspectiveCamera(), M = new THREE.Matrix4(), Ni = new THREE.Matrix4();
    const rawAt = (t, c) => { const v = V.camAt(t); c.position.set(v[0], v[1], v[2]); c.up.set(0, 1, 0); c.lookAt(v[3], v[4], v[5]); if (v[9]) c.rotateZ(v[9] * Math.PI / 180); c.updateMatrixWorld(true); return v[7]; };
    tube.onBeforeRender = (r, s, cam) => { const t = tU.value, fN = rawAt(t, rawN); Ni.copy(rawN.matrixWorld).invert();
      for (const [dt, iM, pV] of [[-SH, ribU.iA, ribU.pA], [SH, ribU.iB, ribU.pB]]) { const f = rawAt(Math.max(CUT + 1e-4, t + dt), raw);
        M.copy(raw.matrixWorld).multiply(Ni).multiply(cam.matrixWorld);
        pc.fov = cam.fov + f - fN; pc.aspect = cam.aspect; pc.near = cam.near; pc.far = cam.far; pc.updateProjectionMatrix();
        iM.value.copy(M).multiply(pc.projectionMatrixInverse); pV.value.setFromMatrixPosition(M); } }; }
  anim(t => { const c = V.camAt(t), d = Math.hypot(c[0] - RC.x, c[1] - RC.y, c[2] - RC.z);
    tubeU.near.value = 1 - sm((d - 6) / 20);
    const on = t > 41.3 && t < 47.5; tube.visible = cap.visible = on; });

  /* =================== the S-path ribbon ===================
     A sweep along the sphere's path (its top face 1 below the sphere's centre, banked toward the camera where the board shows
     the face from above), whose edges and side walls are solved against board 11 from the hold camera: at each point the
     face runs out to the board's traced edges (TOP), and the near side wall down to the traced side walls (SIDES). */
  const TOP = [[1070, 520], [1070, 598], [1073, 606], [1080, 613], [1090, 620], [1100, 625], [1120, 633], [1140, 641], [1160, 646], [1180, 652], [1192, 658],
    [1180, 673], [1160, 679], [1140, 683], [1120, 686], [1090, 699], [1060, 705], [1030, 717], [1012, 732], [1006, 745], [1010, 757], [1020, 770],
    [1040, 791], [1060, 806], [1080, 816], [1100, 828], [1120, 838], [1140, 848], [1160, 860], [1200, 885], [1220, 900], [1240, 908], [1260, 925], [1280, 940], [1300, 951],
    [1320, 965], [1340, 982], [1360, 1005], [1380, 1030], [1400, 1065], [1412, 1080], [1440, 1150], [1500, 1300], [2700, 1300], [2700, 1400], [2200, 1200],
    [1920, 1080], [1880, 1060], [1840, 1033], [1800, 1010], [1760, 988], [1720, 968], [1680, 948], [1640, 932], [1600, 918], [1560, 903], [1520, 889], [1480, 875], [1440, 862],
    [1400, 850], [1360, 836], [1340, 829], [1320, 823], [1300, 815], [1280, 809], [1260, 803], [1240, 796], [1220, 789], [1200, 781], [1180, 774], [1160, 766], [1150, 760],
    [1135, 752], [1120, 748], [1108, 732], [1120, 714], [1150, 706], [1160, 702], [1180, 694], [1200, 688], [1220, 681], [1240, 673], [1255, 667], [1258, 659], [1252, 650],
    [1240, 645], [1220, 643], [1200, 637], [1180, 631], [1160, 625], [1140, 619], [1120, 611], [1110, 606], [1103, 600], [1100, 592], [1100, 520]];
  const SIDES = [
    [[1068, 598], [1073, 606], [1080, 613], [1090, 620], [1100, 625], [1120, 633], [1140, 641], [1160, 646], [1180, 652], [1195, 657], [1180, 671], [1160, 667], [1140, 660], [1120, 653], [1100, 645], [1085, 636], [1072, 625], [1066, 612]],
    [[1108, 732], [1120, 714], [1150, 706], [1160, 702], [1180, 694], [1200, 688], [1220, 681], [1240, 673], [1255, 667], [1259, 659], [1259, 712], [1240, 717], [1220, 727], [1200, 733], [1180, 741], [1160, 748], [1150, 753], [1135, 752], [1120, 748]],
    [[1004, 750], [1010, 757], [1020, 770], [1040, 791], [1060, 806], [1080, 816], [1100, 828], [1120, 838], [1140, 848], [1160, 860], [1200, 885], [1220, 900], [1240, 908], [1260, 925], [1280, 940],
      [1300, 951], [1320, 965], [1340, 982], [1360, 1005], [1380, 1030], [1400, 1065], [1412, 1080], [1440, 1150], [1400, 1150], [1320, 1085], [1300, 1058], [1280, 1038], [1260, 1020], [1240, 1002],
      [1220, 986], [1200, 972], [1180, 958], [1160, 941], [1140, 929], [1120, 915], [1100, 904], [1080, 890], [1060, 878], [1040, 862], [1020, 842], [1006, 825]]];
  // (fix pass: the traced outlines are corner-cut twice (Chaikin), so the solved edges follow smooth curves, not the tracing's
  //  20 px polyline corners)
  const chaikin = (P, it = 2) => { for (let k = 0; k < it; k++) { const Q = []; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length];
    Q.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]); } P = Q; } return P; };
  const TOPs = chaikin(TOP), SIDESs = SIDES.map(P => chaikin(P));
  const inTop = (x, y) => inPoly(TOPs, x, y), inSide = (x, y) => inTop(x, y) || SIDESs.some(P => inPoly(P, x, y));
  const TOPF = [[1085, 560, '#250364'], [1085, 590, '#24026c'], [1100, 612, '#250378'], [1130, 624, '#240288'], [1170, 636, '#2902a0'], [1200, 650, '#2c01ab'], [1230, 655, '#2b01bb'],
    [1248, 662, '#390592'], [1215, 676, '#2f01b4'], [1180, 684, '#3501bd'], [1150, 694, '#3901ce'], [1110, 700, '#4700dd'], [1070, 712, '#4c01ec'], [1040, 725, '#4e00e8'], [1020, 745, '#4e01e6'],
    [1030, 765, '#4f00e6'], [1060, 785, '#5400e2'], [1100, 800, '#6202da'], [1150, 805, '#6f0bce'], [1200, 820, '#8516ba'], [1180, 840, '#7d14c3'], [1250, 850, '#9d24a2'], [1300, 850, '#b02f8d'],
    [1300, 900, '#b83584'], [1250, 900, '#a92a95'], [1350, 880, '#c43f6e'], [1350, 960, '#d34865'], [1400, 1000, '#e4564d'], [1450, 960, '#ea5949'], [1450, 1050, '#f1623a'], [1500, 930, '#f15e3e'],
    [1500, 1050, '#f76830'], [1550, 960, '#f9692c'], [1600, 1000, '#fe711f'], [1650, 960, '#ff7615'], [1700, 1020, '#ff7d0a'], [1750, 1010, '#ff7f07'], [1800, 1045, '#ff8402'], [1850, 1060, '#fc8801'],
    [1520, 910, '#f16238'], [1250, 815, '#9820aa'], [1350, 840, '#c13781'], [2300, 1250, '#ff8a00'], [1700, 1300, '#ff8a00']];
  const SIDEF = [[1075, 615, '#7e2ded'], [1095, 634, '#7d2dfe'], [1120, 643, '#7c2efd'], [1150, 650, '#842bf9'], [1175, 660, '#7d2eff'], [1205, 705, '#e66d27'], [1230, 700, '#ff8500'],
    [1250, 690, '#ec901d'], [1180, 715, '#a541ba'], [1150, 728, '#5419fe'], [1125, 735, '#3106ff'], [1012, 790, '#d6863f'], [1030, 810, '#ff9203'], [1060, 840, '#ff860b'], [1090, 860, '#fc7718'],
    [1120, 875, '#ec6028'], [1150, 895, '#c9463e'], [1180, 915, '#992f56'], [1200, 925, '#7b2062'], [1230, 945, '#4e0e79'], [1260, 965, '#2b028c'], [1290, 995, '#11009e'], [1320, 1020, '#0600aa'],
    [1350, 1040, '#0001b1'], [1380, 1060, '#0001bd'], [1500, 1250, '#0001b8'], [1065, 742, '#4608dc'], [1040, 735, '#4a06e2']];
  const UP = new Vec(0, 1, 0);
  // the frame: the face normal leans from up (the lip, the switchback, the run) to the camera (+z) where the path drops (the chute
  // down the ring's face), so the ribbon twists from the chute's face into the switchback's top.
  // (chute fix, user 2026-09-28: the chute and switchback were "not very smooth … kind of crooked". The lean is now laid along
  //  the rows (see rib) and smoothed over ~0.5 u, so the twist round the elbow is even instead of snapping over ~0.3 u.)
  const FZ = new Vec(0, 0, 1);
  const frameOf = (p, t, b) => { const nd = UP.clone().multiplyScalar(1 - b).addScaledVector(FZ, b).normalize(), side = new Vec().crossVectors(t, nd).normalize(), nr = new Vec().crossVectors(side, t).normalize();
    return { p, t, side, nr }; };
  const sA = (() => { let s = 0; for (; s < L; s += 0.02) if (C.getPointAt(s / L).z > mouthZ + 0.02) break; return s; })();
  const s11 = sOf('m11'), sE = s11 + 12;
  const SPLIT = s11 + 1.5, NECK = 4.5;                                    // (the ribbon's end; the neck; frame 12's road starts at SPLIT + NECK)
  // barriers: the hairpins' inner lines (on the board the two legs of a hairpin run into each other; the solve must not cross)
  const BARS = [[[1192, 658], [1212, 661], [1232, 664]], [[1108, 732], [1085, 741], [1060, 748], [1040, 753]]];
  const segX = (a, b, c, d) => { const r = (b[0] - a[0]) * (d[1] - c[1]) - (b[1] - a[1]) * (d[0] - c[0]); if (Math.abs(r) < 1e-9) return false;
    const u = ((c[0] - a[0]) * (d[1] - c[1]) - (c[1] - a[1]) * (d[0] - c[0])) / r, v = ((c[0] - a[0]) * (b[1] - a[1]) - (c[1] - a[1]) * (b[0] - a[0])) / r; return u >= 0 && u <= 1 && v >= 0 && v <= 1; };
  const crossesBar = (a, b) => BARS.some(B => B.some((q, i) => i > 0 && segX(a, b, B[i - 1], q)));
  const rib = (() => {
    const ds = 0.05, N = Math.ceil((sE - sA) / ds), R = [];
    // (fix pass: the last step is refined by bisection, so an edge lands where the outline really is, not on a 0.04 u grid)
    const march = (Q, dir, test, max, step = 0.04) => { let w = 0, q0 = proj(Q); for (; w < max; w += step) { const q = proj(Q.clone().addScaledVector(dir, w + step)); if (!test(q[0], q[1]) || crossesBar(q0, q)) break; q0 = q; }
      if (w >= max) return max;
      let lo = w, hi = w + step; for (let k = 0; k < 12; k++) { const m = (lo + hi) / 2, q = proj(Q.clone().addScaledVector(dir, m)); if (test(q[0], q[1]) && !crossesBar(q0, q)) lo = m; else hi = m; }
      return lo; };
    const gs = (arr, key, sig) => { const K = Math.ceil(3 * sig / ds), out = arr.map((_, i) => { let a = 0, w = 0; for (let k = -K; k <= K; k++) { const j = Math.min(arr.length - 1, Math.max(0, i + k)), g = Math.exp(-0.5 * (k * ds / sig) ** 2); a += arr[j][key] * g; w += g; } return a / w; }); out.forEach((v, i) => { arr[i][key] = v; }); };
    const med = (arr, key, K) => { const out = arr.map((r, i) => { const v = []; for (let k = -K; k <= K; k++) v.push(arr[Math.min(arr.length - 1, Math.max(0, i + k))][key]); v.sort((a, b) => a - b); const m = v[K]; return Math.abs(r[key] - m) > 0.2 * m + 0.05 ? m : r[key]; }); out.forEach((v, i) => { arr[i][key] = v; }); };   // despike only
    // the rows along the path, and the lean b along them: the drop's (bL, as before), smoothed (σ 0.22 u)
    for (let i = 0; i <= N; i++) { const s = sA + (sE - sA) * i / N, u = Math.min(1, Math.max(0, s / L)), p = C.getPointAt(u), t = C.getTangentAt(u);
      R.push({ s, p, t, bL: sm((-t.y - 0.35) / 0.4) * sm((-3.6 - p.z) / 0.5) }); }
    R.forEach(r => { r.b = r.bL; }); gs(R, 'b', 0.22);
    for (const r of R) { r.f = frameOf(r.p, r.t, r.b); r.tc = Math.sign(r.f.side.dot(cam.clone().sub(r.p))) || 1; r.q = proj(r.p); }
    // zones, from the path itself: the lip and the stem (until the drop levels out), the narrow switchback (to the second
    // hairpin's apex, the leftmost point on screen), then the wide run toward the camera
    let iDrop = R.findIndex(r => r.f.t.y < -0.7), iBend = R.findIndex((r, i) => i > iDrop && r.f.t.y > -0.5);
    if (iDrop < 0) iDrop = 0; if (iBend < 0) iBend = iDrop;
    let iU1 = iBend; while (iU1 < R.length - 1 && R[iU1 + 1].q[0] >= R[iU1].q[0] - 0.01) iU1++;      // first turn back (rightmost)
    let iU2 = iU1; while (iU2 < R.length - 1 && R[iU2 + 1].q[0] <= R[iU2].q[0] + 0.01) iU2++;      // then the leftmost
    const sBend = R[iBend].s, sU1 = R[iU1].s, sU2 = R[iU2].s;
    const zone = s => s < sBend ? 0 : s < sU1 + 0.8 ? 1 : s < sU2 + 0.3 ? 2 : 3;
    // (fix pass: on the run the path turns toward the camera by m11 on a radius smaller than the ribbon's near half-width, so
    //  sections square to the path fanned, the inner clamp stalled the near edge and it stepped (≈ (1330, 962)). From hairpin 2
    //  on the sections are laid square to a smoothed tangent (σ 1.3 u), blended in over 1.2 u: they fan gently, and the edges
    //  follow the board's smooth curves without folding.)
    { const K = Math.ceil(3.9 / ds), sT = R.map((r, i) => { const a = new Vec(); for (let k = -K; k <= K; k++) { const j = Math.min(R.length - 1, Math.max(0, i + k)); a.addScaledVector(R[j].f.t, Math.exp(-0.5 * (k * ds / 1.3) ** 2)); } return a.normalize(); });
      R.forEach((r, i) => { const k = sm((r.s - sU2 - 0.3) / 1.2) * (1 - sm((r.s - SPLIT) / NECK)); if (k <= 0) return;   // (back to the path's own frame by the road's start)
        // (chute fix: the fanned section stays level (square to world up), so the wide run's far edges don't rise and fall with
        //  the fan's angle: seen from the side after the key, they waved)
        const t2 = r.f.t.clone().lerp(sT[i], k).normalize(), nd = UP.clone().addScaledVector(t2, -UP.dot(t2)).normalize();
        const side = new Vec().crossVectors(t2, nd).normalize(), nr = new Vec().crossVectors(side, t2).normalize();
        r.f = { p: r.f.p, t: t2, side, nr }; r.tc = Math.sign(side.dot(cam.clone().sub(r.f.p))) || 1; }); }
    // (fix pass: the stem (zone 0) is solved like the rest, up to 0.62 each side, so it spans the board's stem (x 1070–1100)
    //  instead of a fixed ±0.31 round the path (which runs at x 1095, off the stem's centre))
    const CAP = [0.62, 0.85, 1.0, 7], TCAP = [0.35, 0.4, 0.9, 2.2], BANK = [0, 18, 18, 6];
    // bank (toward the camera): none on the lip and stem (the chute's face already looks at the camera), 18° on the narrow switchback
    // (the camera sees it from barely above), easing to 6° on the wide run; signed by the near side, smoothed so it turns over gently
    // where the near side swaps (the hairpins)
    for (const r of R) { r.z = zone(r.s); let b = r.z < 3 ? BANK[r.z] : BANK[2] - (BANK[2] - BANK[3]) * sm((r.s - sU2 - 0.3) / 3); if (r.z === 1) b *= sm((r.s - sBend) / 0.6);
      b *= 1 - sm((r.s - s11 + 2.5) / 3.5); r.bk = r.tc * b * Math.PI / 180; }   // (flat by the hand-off to frame 12's flat road)
    gs(R, 'bk', 0.35);
    // the solve: each section's face runs out to board 11's traced top outline, and its near wall down to the traced side walls
    for (const r of R) {
      const { f } = r, cb = Math.cos(r.bk), sb = Math.sin(r.bk);
      r.nr = f.nr.clone().multiplyScalar(cb).addScaledVector(f.side, sb); r.sd = f.side.clone().multiplyScalar(cb).addScaledVector(f.nr, -sb);
      r.Q = f.p.clone().addScaledVector(r.nr, -1);
      const q = proj(r.Q);
      r.on = q[0] > -40 && q[0] < 1960 && q[1] > -40 && q[1] < 1120 && inTop(q[0], q[1]);
      if (r.z === 0) { r.T = TCAP[0]; if (r.on) { r.wp = Math.max(0.12, march(r.Q, r.sd, inTop, CAP[0])); r.wm = Math.max(0.12, march(r.Q, r.sd.clone().negate(), inTop, CAP[0])); } continue; }
      if (!r.on) continue;
      const cap = r.z < 3 ? CAP[r.z] : CAP[2] + (CAP[3] - CAP[2]) * sm((r.s - sU2 - 0.3) / 2.5), tcap = r.z < 3 ? TCAP[r.z] : TCAP[2] + (TCAP[3] - TCAP[2]) * sm((r.s - sU2 - 0.3) / 1.5);
      r.wp = march(r.Q, r.sd, inTop, cap); r.wm = march(r.Q, r.sd.clone().negate(), inTop, cap);
      const nearSign = r.sd.dot(cam.clone().sub(r.Q)) > 0 ? 1 : -1, E = r.Q.clone().addScaledVector(r.sd, nearSign * (nearSign > 0 ? r.wp : r.wm)), qE = proj(E);
      if (qE[1] < 1075 && qE[0] < 1915) r.T = Math.min(tcap, Math.max(0.3, march(E, r.nr.clone().negate(), inSide, 3, 0.03)));
    }
    // fill the unsolved points from their neighbours (beyond the frame: the last solved section), then despike
    for (const key of ['wp', 'wm', 'T']) { let last = null; for (const r of R) { if (r[key] !== undefined) last = r[key]; else if (last !== null) r[key] = last; }
      last = null; for (let i = R.length - 1; i >= 0; i--) { if (R[i][key] !== undefined) last = R[i][key]; else R[i][key] = last ?? 1; } }
    for (const r of R) r.T = Math.min(r.T, 0.45 + 2 * sm((Math.abs(r.s - sU2) - 0.5) / 0.8));   // thin through the second hairpin (its legs pass over each other)
    med(R, 'wp', 8); med(R, 'wm', 8); med(R, 'T', 6);
    // (chute fix, user 2026-09-28) even widths and walls. The solve's raw edges carry the tracing's wobble, and the old chain
    //  (hard clamps, and the elbow's outer corner re-marched with no smoothing) cut notches and kinks into them. Now:
    //  · the lip, seen edge-on from the key, takes the chute's widths where the face has turned to the camera, so the lip and
    //    the chute are one straight strip of even width (the path runs straight down it now, see g3.js);
    //  · widths and walls are smoothed along the path at σ 0.15 u through the stem and round the elbow (board 11's corner is
    //    tight), 0.45 u on the switchback and 1.1 u on the wide run, blended between;
    //  · a tight turn's inner half-width is kept inside the turn's radius by a soft minimum (no fold, and no kink where it
    //    bites; the old hard clamp stepped), before the pinch points below fan each hairpin's inner edge onto the board's.
    { const i0 = R.findIndex(r => r.b > 0.9); if (i0 > 0) for (const key of ['wp', 'wm']) for (let i = 0; i < i0; i++) R[i][key] = R[i0][key]; }
    // (σ: 0.15 u through the stem and round the elbow, where board 11's corner is tight, 0.45 u on the switchback, 1.1 u on the run)
    for (const key of ['wp', 'wm', 'T']) { const a = R.map(r => ({ v: r[key] })), b = R.map(r => ({ v: r[key] })), c = R.map(r => ({ v: r[key] })); gs(a, 'v', 0.15); gs(b, 'v', 0.45); gs(c, 'v', 1.1);
      R.forEach((r, i) => { const k1 = sm((r.s - sBend - 0.3) / 0.8), k2 = sm((r.s - sU2 - 0.3) / 2); r[key] = a[i].v + (b[i].v - a[i].v) * k1 + (c[i].v - b[i].v) * k2; }); }
    const smin = (a, b, k = 0.035) => Math.min(a, b) - k * Math.log(1 + Math.exp(-Math.abs(a - b) / k));
    const curv = i => { const a = R[Math.max(0, i - 1)].f.t, b = R[Math.min(R.length - 1, i + 1)].f.t; return b.clone().sub(a).multiplyScalar(1 / ((Math.min(R.length - 1, i + 1) - Math.max(0, i - 1)) * ds)); };
    R.forEach((r, i) => { const ki = curv(i).dot(r.sd); if (Math.abs(ki) < 1e-3) return; const inner = ki > 0 ? 'wp' : 'wm'; r[inner] = smin(r[inner], 0.8 / Math.abs(ki)); });
    // walls: slivers in the stem that grow out of the elbow's corner (board 11 draws leg 1's violet wall starting as a point);
    // at each tight turn the inner wall (which would show as a wedge between the two tops) eases away round the apex
    const curvAt = i => { const a = R[Math.max(0, i - 2)].f.t, b = R[Math.min(R.length - 1, i + 2)].f.t; return b.clone().sub(a).multiplyScalar(1 / (4 * ds)); };
    const nearest = (P, lo, hi) => { let bi = lo, bd = Infinity; for (let i = lo; i <= hi; i++) { const q = proj(R[i].Q), d = (q[0] - P[0]) ** 2 + (q[1] - P[1]) ** 2; if (d < bd) { bd = d; bi = i; } } return bi; };
    // the three tight turns: the elbow (its inner corner on board 11 at (1101, 599)) and the two hairpins (their pinches, the
    // BARS' first points). apex: the row of the sharpest turn; dp: arc from the apex back to the row nearest the pinch
    let iEl = iBend; for (let i = Math.max(0, iBend - 25); i < Math.min(R.length, iBend + 25); i++) if (curvAt(i).length() > curvAt(iEl).length()) iEl = i;
    const TURNS = [[iEl, [1101, 599], 0.55], [iU1, BARS[0][0], null], [iU2, BARS[1][0], null]].map(([ia, px, dw]) => {
      const r = R[ia], inner = curvAt(ia).dot(r.sd) > 0 ? 'p' : 'm', ray = cam.clone().add(new Vec().addScaledVector(fwd, 1).addScaledVector(rgt, (px[0] - 960) / 540 * tanV).addScaledVector(upv, (540 - px[1]) / 540 * tanV));
      const dir = ray.sub(cam).normalize(), k = r.Q.clone().sub(cam).dot(r.nr) / dir.dot(r.nr), P = cam.clone().addScaledVector(dir, k);
      const dp = dw ?? r.s - R[nearest(px, Math.max(0, ia - 80), ia)].s;
      return { sa: r.s, inner, P, dp }; });
    for (const r of R) { const e = 0.03 + 0.97 * sm((r.s - sBend + 0.25) / 0.55); r.Tp = r.T * e; r.Tm = r.T * e; r.pin = null;
      for (const U of TURNS) { const d = Math.abs(r.s - U.sa); if (d > U.dp + 0.35) continue;
        const w = 1 - sm((d - 0.35 * U.dp) / (0.65 * U.dp + 0.35));                     // the inner edge eases onto the pinch
        r['T' + U.inner] *= 0.03 + 0.97 * (1 - w);                                     // and its wall shrinks to nothing as it gets there
        if (w > 1e-3) r.pin = { side: U.inner, P: U.P, w }; } }
    R.sBend = sBend; R.HP = TURNS.map(U => [U.sa, U.dp, U.inner]);
    return R;
  })();
  // the ribbon's mesh, in parts. Up to SPLIT (1.5 past the mark) it is board 11's ribbon. Beyond it, the run to the frame's corner
  // that board 11 shows (the tail, 0.02 lower) dissolves after the hold, and a neck takes over: it eases from board 11's section
  // into frame 12's road's first section (flat, 3 each side, 0.9 deep, its top on the contact, on the path's own frame), where
  // f12.js starts the road (SPLIT + NECK). Its colour eases into the road's there (f12 writes it into G.neckRoad each frame).
  // (fix pass: the road used to start at SPLIT as a straight slab over the wider neck: the neck's curved edges showed past it,
  //  its outline showed as dark cracks and the two colours differed: a lighter patch behind the sphere.) After the hold the
  //  ribbon retracts from the tunnel toward the sphere as the wall's shapes leave.
  const RD = { w: 3.0, T: 0.9 };
  G.neckRoad = { s: SPLIT + NECK, u: { rS: { value: new Array(16).fill(1e5) }, rC: { value: Array.from({ length: 16 }, () => new Vec(0.98, 0.45, 0.1)) }, rN: { value: 1 },
    oS: { value: new Array(16).fill(1e5) }, oC: { value: Array.from({ length: 16 }, () => new Vec(0.05, 0.03, 0.69)) }, oN: { value: 1 }, ez: { value: 0 }, tk12: { value: 0 } } };   // (f12 fills in its road's colour tables)
  const rbMat = new THREE.ShaderMaterial({ side: THREE.DoubleSide, uniforms: { t: tU, flow: flowU, spd: spdU, op: { value: 1 }, sF: { value: -1e9 }, topOnly: { value: 0 }, sB: { value: rib.sBend }, nk: { value: 0 }, sN: { value: new THREE.Vector2(SPLIT, NECK) }, ...G.neckRoad.u, hvp: { value: HVP }, hcam: { value: cam.clone() }, ...fieldU('topF', TOPF), ...fieldU('sideF', SIDEF) },
    vertexShader: LOGV + 'attribute float fc, sv; varying float vF, vS; varying vec3 vW; varying vec3 vN;\nvoid main() { vF = fc; vS = sv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w;\n#include <logdepthbuf_vertex>\n}',
    fragmentShader: `uniform float t, flow, spd, op, sF, sB, nk, ez, tk12, topOnly; uniform vec2 sN; uniform float rS[16], oS[16]; uniform vec3 rC[16], oC[16]; uniform int rN, oN; uniform mat4 hvp; uniform vec3 hcam; varying float vF, vS; varying vec3 vW; varying vec3 vN;
${fieldGLSL('topF', TOPF.length, 60, 2.2, 12, 10)}${fieldGLSL('sideF', SIDEF.length, 45, 2.4, 10, 11)}
vec3 st16(float g, float s[16], vec3 c[16], int n) { vec3 col = c[0]; for (int i = 1; i < 16; i++) { if (i >= n) break; col = mix(col, c[i], clamp((g - s[i - 1]) / max(1e-4, s[i] - s[i - 1]), 0.0, 1.0)); } return col; }
#include <logdepthbuf_pars_fragment>
void main() { if (vS < sF || (topOnly > 0.5 && vF > 0.5)) discard;
  vec4 hq = hvp * vec4(vW, 1.0); vec2 bp = vec2((hq.x / hq.w * 0.5 + 0.5) * 1920.0, (0.5 - 0.5 * hq.y / hq.w) * 1080.0);
  float fl = min(flow, 1.6); vec3 col = vF < 0.5 ? topF(bp, t, fl) : mix(sideF(bp, t, fl), topF(bp, t, fl), 1.0 - smoothstep(sB - 0.42, sB - 0.2, vS));   // (the stem's sides: its face colour, as the board draws it; the wall's own from the elbow's corner)
  vec3 n = normalize(vN); float faces = abs(dot(n, normalize(hcam - vW)));
  if (vF > 0.5) col *= mix(0.62, 1.0, smoothstep(0.1, 0.6, faces)); if (vF > 1.5) col *= 0.4;
  if (nk > 0.5) { float d = vW.z - ez + 0.5 * min(flow, 1.6) * (sin(6.2832 * ((t - tk12) * spd) / 11.0 + 0.7) - sin(0.7));   // (the neck: into frame 12's road colours (its own function) at the joint)
    col = mix(col, vF < 0.5 ? st16(d, rS, rC, rN) : st16(d, oS, oC, oN), smoothstep(sN.x + 0.3 * sN.y, sN.x + sN.y, vS)); }
  gl_FragColor = vec4(col, op);
#include <logdepthbuf_fragment>
}` });
  const rowOf = (r, k = 0, drop = 0) => { const bk = r.bk * (1 - k), nr = r.f.nr.clone().multiplyScalar(Math.cos(bk)).addScaledVector(r.f.side, Math.sin(bk)), sd = r.f.side.clone().multiplyScalar(Math.cos(bk)).addScaledVector(r.f.nr, -Math.sin(bk));
    const TR = RD.T / Math.max(0.5, nr.y), wp = r.wp + (RD.w - r.wp) * k, wm = r.wm + (RD.w - r.wm) * k, Tp = r.Tp + (TR - r.Tp) * k, Tm = r.Tm + (TR - r.Tm) * k;
    const Q = r.f.p.clone().addScaledVector(nr, -1 - drop), Lp = Q.clone().addScaledVector(sd, wp), Lm = Q.clone().addScaledVector(sd, -wm);
    // (fix pass: a tight turn's inner edge fans onto the board's pinch point; the bottom's inner corner keeps hanging below it, so
    //  the bottom never meets the top there (they fought at hairpin 2's pinch: a dark crack))
    const Bp = Lp.clone().addScaledVector(nr, -Tp), Bm = Lm.clone().addScaledVector(nr, -Tm);
    if (r.pin && k === 0) { const pin = r.pin.P, back = pin.clone().addScaledVector(fwd, 0.3);   // (the bottom corner: straight behind the pinch, as seen from the hold)
      if (r.pin.side === 'p') { Lp.lerp(pin, r.pin.w); Bp.lerp(back, r.pin.w); } else { Lm.lerp(pin, r.pin.w); Bm.lerp(back, r.pin.w); } }
    return { s: r.s, Lp, Lm, Bp, Bm, nr, sd }; };
  const ribMesh = (rows, capA, capB, mat) => {
    // (normals from the section itself, not averaged: the faces shade smoothly along the run, with no creases where it bends)
    const pos = [], nor = [], fc = [], sv = [], idx = [];
    const strip = (a, b, face, nf) => { const base = pos.length / 3;
      rows.forEach(r => { const n = nf(r); for (const P of [r[a], r[b]]) { pos.push(P.x, P.y, P.z); nor.push(n.x, n.y, n.z); fc.push(face); sv.push(r.s); } });
      for (let i = 0; i < rows.length - 1; i++) { const k = base + 2 * i; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); } };
    strip('Lm', 'Lp', 0, r => r.nr); strip('Lp', 'Bp', 1, r => r.sd); strip('Bm', 'Lm', 1, r => r.sd.clone().negate()); strip('Bp', 'Bm', 2, r => r.nr.clone().negate());
    const cap = (i, face, sg) => { const r = rows[i], base = pos.length / 3, n = r.nr.clone().cross(r.sd).multiplyScalar(sg);
      for (const P of [r.Lm, r.Lp, r.Bp, r.Bm]) { pos.push(P.x, P.y, P.z); nor.push(n.x, n.y, n.z); fc.push(face); sv.push(r.s); } idx.push(base, base + 1, base + 2, base, base + 2, base + 3); };
    if (capA) cap(0, 1, 1); if (capB) cap(rows.length - 1, 1, -1);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute('fc', new THREE.Float32BufferAttribute(fc, 1)); g.setAttribute('sv', new THREE.Float32BufferAttribute(sv, 1)); g.setIndex(idx);
    const mesh = new THREE.Mesh(g, mat); mesh.frustumCulled = false; V.scene.add(mesh); return mesh; };
  const iSp = rib.findIndex(r => r.s >= SPLIT), iNk = rib.findIndex(r => r.s >= SPLIT + NECK);
  const ribMain = ribMesh(rib.slice(0, iSp + 1).map(r => rowOf(r)), true, false, rbMat);
  const neckMat = rbMat.clone(); neckMat.uniforms = { ...rbMat.uniforms, ...G.neckRoad.u, nk: { value: 1 }, topOnly: { value: 0 } };
  // (it runs 0.3 on under the road's start, a few thousandths lower, so the joint between the two meshes never shows a pinhole)
  const ribNeck = ribMesh(rib.slice(iSp, iNk + 7).map(r => rowOf(r, Math.max(1e-4, sm((r.s - SPLIT) / NECK)), 0.006 * sm((r.s - SPLIT - NECK + 0.12) / 0.3))), false, false, neckMat);
  const tailMat = rbMat.clone(); tailMat.uniforms = { ...rbMat.uniforms, op: { value: 1 }, sF: { value: -1e9 } };
  // (fix pass 2: the tail's 0.02 drop now eases in over the first 0.6 u: a full step at the joint showed its dark underside as a
  //  hairline across the orange run all through hold 11, (1360, 1005) → (1550, 945). The neck, where it overlaps it there, is
  //  the same section in the same colours.)
  const ribTail = ribMesh(rib.slice(iSp).map(r => rowOf(r, 0, 0.02 * sm((r.s - SPLIT) / 0.6))), false, true, tailMat); ribTail.renderOrder = 1;
  // (review fix, the hand-off: HO = H.t1 + 0.05. The neck (and f12's road, G.handOff) now appear as the tail starts to fade:
  //  the neck used to show from 45.35 over the still-opaque tail, and its edges, 0.02 proud of it, drew a dark hairline across
  //  the run behind the sphere. The tail fades in 0.22 s (was 0.6) and keeps writing depth while it fades: without that its dark
  //  underside drew over its own fading top (a two-frame dark hole in the track at 45.475–45.5, before the road came in) and
  //  its faces showed doubled (a see-through ghost slab to ~45.9). While the tail is still mostly there the neck draws its
  //  top only, so its side walls can't show as a line on it.)
  const HO = H.t1 + 0.05, TFD = 0.22; G.handOff = HO;
  anim(t => { const on = t > 41.3 && t < 47.7; ribMain.visible = on; ribNeck.visible = on && t > HO;
    const a = 1 - sm((t - HO) / TFD); tailMat.uniforms.op.value = a; ribTail.visible = t > 41.3 && a > 0.003; tailMat.transparent = a < 0.999; tailMat.depthWrite = true;
    neckMat.uniforms.topOnly.value = a > 0.5 ? 1 : 0;
    rbMat.uniforms.sF.value = t < 46.25 ? -1e9 : rib[0].s + (SPLIT + NECK + 0.5 - rib[0].s) * sm((t - 46.25) / 1.3); });

  // the sphere's contact shadow on the ribbon (board 11: a crisp dark ellipse, offset to the lower right of the contact)
  { const g = new THREE.CircleGeometry(1, 64), sm2 = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { op: { value: 0 } },
      vertexShader: LOGV + 'varying vec2 vP;\nvoid main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}',
      fragmentShader: 'uniform float op; varying vec2 vP;\n#include <logdepthbuf_pars_fragment>\nvoid main() { float r = length(vP); float a = (1.0 - smoothstep(0.86, 1.0, r)) * (0.82 + 0.18 * smoothstep(-0.2, 0.7, vP.x));\n  gl_FragColor = vec4(mix(vec3(0.09, 0.02, 0.01), vec3(0.02, 0.0, 0.02), smoothstep(-0.5, 0.8, vP.x)), op * a);\n#include <logdepthbuf_fragment>\n}' });
    const sh = new THREE.Mesh(g, sm2); sh.renderOrder = 3; V.scene.add(sh);
    const mB = new THREE.Matrix4(); let iLast = 0;
    anim((t, b) => {
      const on = t > 43.25 && t < 47 && !b.h; sh.visible = on; if (!on) return;
      let best = iLast, bd = Infinity; for (let i = Math.max(0, iLast - 60); i < Math.min(rib.length, iLast + 60); i++) { const d = rib[i].f.p.distanceToSquared(b.p); if (d < bd) { bd = d; best = i; } }
      if (bd > 0.25) for (let i = 0; i < rib.length; i++) { const d = rib[i].f.p.distanceToSquared(b.p); if (d < bd) { bd = d; best = i; } }
      iLast = best; const r = rib[best];
      if (r.z === 0 || bd > 0.6) { sh.visible = false; return; }
      // lying on the face, its x along world +x: an ellipse offset to the right of and a little toward the camera from the contact
      const X = new Vec(1, 0, 0).addScaledVector(r.nr, -r.nr.x).normalize(), Y = r.nr.clone().cross(X).normalize();
      sh.position.copy(b.p).addScaledVector(r.nr, -0.88).addScaledVector(X, 0.62).addScaledVector(Y, Y.z > 0 ? 0.18 : -0.18);
      sh.quaternion.setFromRotationMatrix(mB.makeBasis(X, Y, r.nr));
      sh.scale.set(0.74, 0.95, 1);
      sm2.uniforms.op.value = sm((t - 43.25) / 0.3) * sm((r.s - rib.HP[2][0] - 0.4) / 1.2) * (1 - sm((r.s - SPLIT - NECK + 0.5) / 1.0)); }); }   // (hands over to f12's shadow at the road's start)
  // (chute fix: the shadow now comes in on the wide run, after the second hairpin: on the narrow switchback, offset to the right
  //  as board 11 draws it, it hung off the ribbon's edge in mid-air)

  /* =================== the wall =================== */
  // backdrop: the wall's base colour field (board 11's indigo, the maroon top-left corner, the violet top), with the tunnel's hole
  const D_BACK = W11 + 2.6;
  { const at = [960, 540], hcx = [960 + (RC.x - cam.x) / kpx(D_BACK), 540 - (RC.y - cam.y) / kpx(D_BACK)], hr = RI / kpx(D_BACK) + 1;
    const outer = [[-4000, -3000], [16000, -3000], [16000, 6000], [-4000, 6000]];   // (far past the frame: the orbit sees it at a grazing angle)
    // (fix pass: the wall's pieces fly in from 12–16 u behind it; the wall used to hide them until they punched through it at
    //  full size, one frame each, at 43.53–43.67. It now waits 20 u deeper (sliding along the tunnel's axis, so its hole stays
    //  on the tube) and comes forward behind them, landing at 44.1: every piece is seen flying in from the depth.)
    P11({ shape: shapeOf(outer, at, [circlePts(hcx[0], hcx[1], hr, 128)]), at, depth: D_BACK, thick: 0, drift: 0, keys: { z: [[42.9, 20], [44.1, 0, 'power2.inOut']] }, out: { type: 'fade', t: [46.25, 46.65], ease: 'sine.inOut' } },   // (fix pass 2: gone by 46.65 (was 46.6–47.2): seen edge-on mid-orbit, its far end made a hard seam against the background)
      { field: [[20, 20, '#592137'], [20, 140, '#461940'], [20, 260, '#351446'], [20, 380, '#28134f'], [20, 500, '#221358'], [100, 80, '#48183e'], [100, 200, '#361648'], [180, 150, '#371547'],
        [260, 200, '#2c134d'], [420, 200, '#280d57'], [500, 260, '#230e59'], [580, 20, '#230b56'], [740, 20, '#2c0965'], [820, 80, '#2c096f'], [660, 380, '#241268'], [820, 500, '#261575'],
        [1140, 20, '#3c088d'], [1300, 20, '#430899'], [1460, 20, '#4807a2'], [1300, 640, '#25085a'], [1220, 760, '#25085a'], [1100, 1000, '#25085a'], [1300, 1050, '#25085a'], [900, 760, '#25085a'],
        [1850, 15, '#5a05bb'], [2400, 300, '#2a0a66'], [2400, 900, '#25085a'], [960, 1300, '#25085a'], [-300, 600, '#2a1270'], [20, 580, '#2b197c'], [1030, 700, '#2a0a61'],
        [3400, 0, '#270960'], [3400, 1100, '#25085a'], [4300, 500, '#25085a'], [-1300, 0, '#2a1060'], [-1300, 1400, '#25085a'], [1500, 2000, '#25085a'], [1000, -800, '#2e0870']],
        kern: 160, kpw: 2.5, amp: 30, per: 11 }); }

  // board 11's shapes on the wall (depths from camera 11, behind the ring's back face at 44.11, back to front toward the ring;
  // the yellow arch stands just behind the ring's face). Colours measured on board 11.
  const rectPts = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  const arcPts = (cx, cy, r, a0, a1, n = 48) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return [cx + r * Math.cos(a), cy - r * Math.sin(a)]; });
  const W_ = (spec, g) => P11({ drift: 2, ...spec }, g);
  // build: the shapes arrive as the backing-out camera's view widens past them (all settled before the hold at 44.2); they leave
  // after it as the camera swings away to the right, the left ones first
  const FLY = (a, d, dz) => ({ type: 'fly', t: [a, a + d], dz }), FADE = (a, d) => ({ type: 'fade', t: [a, a + d], ease: 'sine.inOut' }), SHRINK = (a, d) => ({ type: 'grow', t: [a, a + d], ease: 'power2.in' });
  const BAND_K = { x: [[42.95, -1500], [43.8, 0, 'expo.out'], [45.6, 0], [46.15, -1500, 'power2.in']], op: [[42.94, 0], [42.95, 1], [46.15, 1], [46.16, 0]] };   // the band and its bars, as one
  const ARCH_K = { y: [[43.3, 820], [44.05, 0, 'expo.out'], [46.1, 0], [46.7, 900, 'power2.in']], op: [[43.29, 0], [43.3, 1], [46.7, 1], [46.71, 0]] };           // the ∩ rises, then sinks
  // the big dark disc low left (mostly behind the HER2 picture): indigo at the top, violet toward its foot
  W_({ shape: shapeOf(circlePts(500, 840, 545), [500, 840]), at: [500, 840], depth: 45.05, thick: 0.25, in: FLY(43.2, 0.75, 14), out: SHRINK(45.6, 0.5) },
    { field: [[20, 700, '#3f18a3'], [20, 820, '#6116d6'], [20, 940, '#7f13f3'], [20, 1060, '#8e15fb'], [990, 700, '#40129b'], [990, 800, '#4914a2'], [990, 900, '#5715ad'], [990, 1000, '#6614c1'],
      [100, 1065, '#8e14fb'], [300, 1065, '#9113fb'], [600, 1065, '#8513e4'], [800, 1065, '#7b13d3'], [950, 1065, '#7714ca'], [300, 550, '#27197b'], [600, 550, '#2b167e'], [850, 555, '#2b167d'],
      [700, 480, '#251368'], [520, 360, '#241062'], [250, 420, '#23115e'], [850, 440, '#251264'], [100, 470, '#221358'], [320, 330, '#231060'], [720, 360, '#241166'], [950, 520, '#27156f'], [60, 560, '#291875'], [520, 1300, '#8a14f0']], kern: 85, kpw: 2.3, amp: 25, per: 12 });
  // the violet → orange bar peeking out under the picture
  W_({ shape: shapeOf(rectPts(395, 1040, 555, 1250), [475, 1100]), at: [475, 1100], depth: 44.9, thick: 0.3, in: { type: 'slide', from: 'bottom', t: [43.55, 44.1] }, out: { type: 'slide', from: 'bottom', t: [45.6, 46.0] } },
    { lin: [[0, '#6e0ee0'], [0.094, '#7d16d3'], [0.344, '#ab3e8b'], [0.594, '#d76548'], [0.844, '#ee7724'], [1, '#ed772a']], A: [395, 1062], B: [555, 1062] });
  // right middle: the tall column (dark at its soft left, red-brown at its sharp right edge x 1714), the disc over it, the dark
  // rounded rect under the ASCO box (in front of both: its corner shows through), the magenta panel right of 1714
  W_({ shape: shapeOf(rectPts(1290, 380, 1714, 1250), [1500, 800]), at: [1500, 800], depth: 44.95, thick: 0.3, drift: 0, in: FLY(43.15, 0.75, 12), out: { type: 'slide', from: 'bottom', t: [46.0, 46.6] } },
    { lin: [[0, '#25085a'], [0.071, '#290959'], [0.165, '#360c5b'], [0.259, '#420f5a'], [0.377, '#52155a'], [0.495, '#621e56'], [0.613, '#712951'], [0.731, '#82354f'], [1, '#9a4449']], A: [1290, 700], B: [1714, 700] });
  W_({ shape: shapeOf(rectPts(1714, 452, 2380, 1250), [2000, 800]), at: [2000, 800], depth: 44.9, thick: 0.3, drift: 0, in: FLY(43.35, 0.65, 12), out: { type: 'slide', from: 'bottom', t: [46.1, 46.7] } },
    { lin: [[0, '#5e1668'], [0.073, '#701a6a'], [0.355, '#58126a'], [0.597, '#420d66'], [0.8, '#300a65'], [1, '#27095e']], A: [1800, 452], B: [1800, 700] });
  W_({ shape: shapeOf(circlePts(1479, 417, 235), [1479, 417]), at: [1479, 417], depth: 44.6, thick: 0.35, in: { type: 'grow', t: [43.1, 43.85] }, out: SHRINK(45.95, 0.55) },
    { field: [[1360, 540, '#5e155e'], [1380, 600, '#53105d'], [1420, 470, '#82215d'], [1420, 560, '#69185d'], [1420, 620, '#58135c'], [1480, 470, '#8e275f'], [1480, 560, '#791f5d'], [1480, 630, '#671b5a'],
      [1550, 470, '#9e325a'], [1550, 560, '#8c2a59'], [1550, 640, '#7a2856'], [1620, 470, '#b23c55'], [1620, 560, '#9f3851'], [1620, 640, '#91394d'], [1690, 470, '#c04b4d'], [1690, 560, '#b24a49'],
      [1690, 630, '#a74d42'], [1330, 420, '#5a1a70'], [1450, 300, '#8a3060'], [1600, 300, '#b04858']], kern: 55, kpw: 2.2, amp: 12, per: 10 });
  { const dr = (x0, x1) => { const r = 55, P = [[x0, 200]]; if (x0 < 1500) P.push(...arcPts(x0 + r, 450 - r, r, 180, 270, 16)); else P.push([x0, 450]); P.push([x1, 450], [x1, 200]); return P; };
    W_({ shape: shapeOf(dr(1425, 1714), [1570, 350]), at: [1570, 350], depth: 44.45, thick: 0.3, drift: 0, in: FLY(43.3, 0.65, 12), out: { type: 'slide', from: 'top', t: [45.85, 46.4] } },
      { lin: [[0, '#4a1060'], [0.09, '#57135a'], [0.26, '#651d5d'], [0.61, '#873454'], [0.78, '#97424d'], [0.95, '#a85244'], [1, '#a85244']], A: [1425, 420], B: [1714, 420] });
    W_({ shape: shapeOf(dr(1714, 2380), [2000, 350]), at: [2000, 350], depth: 44.45, thick: 0.3, drift: 0, in: FLY(43.3, 0.65, 12), out: { type: 'slide', from: 'top', t: [45.85, 46.4] } }, { lin: [[0, '#340776'], [0.3, '#38077c'], [1, '#3a077f']], A: [1714, 420], B: [2380, 420] }); }
  // the orange rounded shape top right (behind the ASCO box): orange along its top, redder toward its lower left
  { const P = [[1207, 345], ...arcPts(1523, 348, 316, 179.5, 90, 40), ...arcPts(2064, 348, 316, 90, 0, 40), [2380, 385], [1310, 385], [1310, 345]];   // (its corner behind the ring is trimmed: it reached into the tunnel)
    W_({ shape: shapeOf(P, [1700, 250]), at: [1700, 250], depth: 44.75, thick: 0.4, in: FLY(43.2, 0.7, 16), out: { type: 'slide', from: 'top', t: [45.85, 46.4] } },
      { field: [[1290, 160, '#d86140'], [1270, 175, '#cd5b55'], [1350, 100, '#cf5e58'], [1400, 70, '#ee853b'], [1450, 50, '#fb8628'], [1500, 45, '#f98a2a'], [1740, 60, '#f8822b'], [1800, 50, '#fb852b'],
        [1880, 60, '#f8812e'], [1900, 80, '#f37938'], [1300, 300, '#c85060'], [1600, 300, '#e87040'], [2200, 150, '#f8822b']], kern: 70, kpw: 2.2, amp: 14, per: 11 }); }
  // the two pipes from the top edge: violet → orange, left to right
  W_({ shape: shapeOf(rectPts(830, -500, 1100, 132), [965, 0]), at: [965, 0], depth: 44.3, thick: 0.4, drift: 0, keys: { y: [[43.05, -700], [43.8, 0, 'expo.out'], [45.65, 0], [46.15, -700, 'power2.in']], op: [[43.04, 0], [43.05, 1], [46.15, 1], [46.16, 0]] } },
    { lin: [[0, '#28085c'], [0.148, '#2f0773'], [0.259, '#39058a'], [0.407, '#4205a5'], [0.556, '#560bb0'], [0.704, '#88317e'], [0.815, '#b14a5c'], [0.907, '#d16141'], [0.97, '#e47130'], [1, '#e67330']], A: [830, 60], B: [1100, 60] });
  W_({ shape: shapeOf(rectPts(1552, -500, 1716, 100), [1634, 0]), at: [1634, 0], depth: 44.3, thick: 0.4, keys: { y: [[43.3, -700], [43.95, 0, 'expo.out'], [45.85, 0], [46.4, -700, 'power2.in']], op: [[43.29, 0], [43.3, 1], [46.4, 1], [46.41, 0]] } },
    { lin: [[0, '#700ce0'], [0.061, '#7811d9'], [0.232, '#982aac'], [0.415, '#b94877'], [0.598, '#da663f'], [0.78, '#ef7625'], [1, '#ec7729']], A: [1552, 20], B: [1716, 20] });
  // (fix pass 2: the column, the right panel and the two dark rounded rects leave by sliding (opaque) instead of fading: faded,
  //  the stacked pieces showed through each other like panes of glass at 46.2–46.35)
  // the band from the top-left corner (blue → pink along it) and the two bars that carry it on to the ring
  W_({ shape: shapeOf([[-490, -300], [-378, -300], [555, 130], [555, 270]], [400, 150]), at: [400, 150], depth: 44.25, thick: 0.45, drift: 0, keys: BAND_K },
    { field: [[120, 10, '#2601fd'], [200, 30, '#3401ff'], [250, 40, '#4502ff'], [250, 90, '#4f09fc'], [300, 40, '#5802ff'], [300, 110, '#6a20ff'], [350, 60, '#7817fc'], [350, 140, '#903bf2'],
      [400, 80, '#9c32e8'], [400, 170, '#b443d2'], [450, 100, '#bd3fc4'], [450, 195, '#d844a6'], [500, 125, '#db44a2'], [500, 220, '#ea4589'], [535, 140, '#e64591'], [535, 250, '#ed4881'],
      [-100, -100, '#2000ff'], [-300, -250, '#2000ff']], kern: 45, kpw: 2.2, amp: 10, per: 10 });
  W_({ shape: shapeOf(rectPts(555, 132, 830, 268), [690, 200]), at: [690, 200], depth: 44.25, thick: 0.45, drift: 0, keys: BAND_K },
    { field: [[575, 145, '#ec4c88'], [575, 255, '#d42eb1'], [640, 145, '#c04bbe'], [640, 255, '#9b1ae2'], [700, 145, '#7a3ff3'], [700, 255, '#5600fd'], [760, 145, '#4428ff'], [760, 255, '#2d06fd'],
      [815, 145, '#281fff'], [815, 255, '#1f09fb'], [700, 200, '#6b2dfc']], kern: 40, kpw: 2.2, amp: 8, per: 10 });
  W_({ shape: shapeOf(rectPts(830, 132, 1060, 268), [945, 200]), at: [945, 200], depth: 44.25, thick: 0.45, drift: 0, keys: BAND_K },
    { field: [[845, 145, '#f84e82'], [845, 255, '#a022c5'], [880, 145, '#eb4f92'], [880, 200, '#bc37b9'], [910, 150, '#d553ab'], [910, 190, '#ac3ecf'], [960, 160, '#c858b8'], [960, 240, '#9a38d0']], kern: 40, kpw: 2.2, amp: 8, per: 10 });
  // the yellow ∩ at the right (legs behind the ribbon), in two parts: right of x 1715 it is darker (board 11's panel edge runs through it)
  { const cx = 1767.5, cy = 780, Ro = 160.5, Ri = 52.5, yo = x => cy - Math.sqrt(Ro * Ro - (x - cx) ** 2), aC = Math.acos((1715 - cx) / Ro) * 180 / Math.PI;
    const left = [[1607, 1250], ...arcPts(cx, cy, Ro, 180, aC, 24), [1715, 1250]];
    const right = [[1715, yo(1715)], ...arcPts(cx, cy, Ro, aC, 0, 40).slice(1), [cx + Ro, 1250], [cx + Ri, 1250], ...arcPts(cx, cy, Ri, 0, 180, 32)];
    W_({ shape: shapeOf(left, [1660, 900]), at: [1660, 900], depth: 43.1, thick: 0.9, drift: 0, keys: ARCH_K },
      { field: [[1640, 700, '#e7b111'], [1680, 690, '#ecb80d'], [1700, 660, '#f4c209'], [1640, 760, '#d7971a'], [1690, 760, '#dc9e18'], [1640, 830, '#c57f25'], [1690, 830, '#cf8720'], [1640, 900, '#b76b2f'],
        [1690, 900, '#c1752a'], [1665, 1000, '#a85a38'], [1665, 1150, '#8a4040'], [1630, 650, '#f0bc0c']], kern: 50, kpw: 2.2, amp: 10, per: 10 });
    W_({ shape: shapeOf(right, [1820, 900]), at: [1820, 900], depth: 43.1, thick: 0.9, drift: 0, keys: ARCH_K },
      { field: [[1730, 650, '#eec00d'], [1800, 650, '#eec00c'], [1760, 690, '#d8ac12'], [1840, 700, '#d2a614'], [1870, 700, '#d1a613'], [1850, 760, '#b28521'], [1880, 760, '#b28521'], [1850, 830, '#8f6430'],
        [1880, 830, '#8f632f'], [1850, 900, '#73493a'], [1880, 900, '#73493c'], [1850, 960, '#5c3644'], [1880, 960, '#5c3643'], [1850, 1020, '#4b254a'], [1880, 1030, '#47224f'], [1740, 720, '#d4a613'],
        [1850, 1200, '#3e1c50']], kern: 50, kpw: 2.2, amp: 10, per: 10 }); }
};
