/* Frame 9 · the corkscrew and the ramp down toward the camera (G2, called from g2.js with its context C).
   Board 9: a small corkscrew cut off at the top left, its post (violet / orange / blue) standing on the far end of a ramp
   that runs from the upper left toward the camera, the ramp's yellow side face at the lower left, a magenta → orange →
   violet strip at the left edge, a violet "D" against the post, a chain of three stadium outlines on the right, the big
   sphere on the ramp with a crisp black shadow. Built as real 3D (no plate):
   · the CORKSCREW is the helix the sphere really runs (g2.js: HX round `post`): a helical shelf round a post, 2.6 turns (the
     sphere uses the bottom one and drops in between the upper turns). The route puts it low and left of where board 9
     draws it, so once the sphere has left it (33.25) it coils up (the pitch tightens), turns and lifts into its board
     corner, standing on the ramp's far end (33.26 → 33.95). Its shape is parametric and rebuilt while it moves; at the
     board pose its rounded sides are cut away and each turn is edge-on to the camera, so it reads as board 9's side-on
     zig-zag of straight slats, slanting as the board's (follow-up: the helix turns the other way now, and at the board
     pose each turn's rise sits in its front slat, so the back slats are level and the front ones rise to the right).
   · the RAMP runs under the route (C9, Hx → Pv), asymmetric as on the board (left edge ~1.1 from the sphere's line, the
     right edge flaring from 0.7 to 2.4; out of the hold's view it widens to frame 10's path, ±4.125 at Pv, and meets it
     edge to edge), a solid block whose left side face is the board's yellow triangle. Its top and
     side carry the board's colours as 2D colour tables (fitted from the board in ramp coordinates); they flow gently and
     land exactly on the board at the key instant.
   · the SHADOW: a crisp ellipse (dark maroon → black) on the ramp under the sphere while it rolls; 1.5 units past Pv it
     hands over to frame 10's own shadow (identical there) in one step.
   · board 9's other shapes are pieces (flat at the hold): the strip, the D, the tab under the corkscrew, the three
     stadium outlines (two with slot panels behind), and a backdrop with the board's violet. */
export default (V, C) => {
  const { THREE, Vec, UP, sm, h9, D9, Hx, post, yTop, yBot, C9, Pv, SH, prop } = C;
  const PC = spec => C.PC(spec);
  V.unplate(9);
  const TK = h9.tk;                                                        // 35.15, the key instant
  const clamp01 = x => Math.min(1, Math.max(0, x));
  const smoother = x => { x = clamp01(x); return x * x * x * (x * (6 * x - 15) + 10); };
  const expoOut = gsap.parseEase('expo.out');
  const hexRGB = h => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };

  /* ---------- a 2D colour-table material (the board's colours as a smooth grid in the surface's own coordinates) ----------
     rows along u, columns along v (knots may be uneven); resampled with monotone cubics onto a 64×64 texture, so there are
     no bands. Coordinates come from the mesh's own (local) position, so the colours ride with it. The table slides a
     little (living gradient) and sits exactly on the board at the key instant. shade: 0 flat (board colours), 1 view
     shading like the pieces (faces toward the camera keep the colour, oblique ones darker). */
  const pchip = (xs, ys) => { const n = xs.length, h = [], d = [], m = new Array(n);
    for (let i = 0; i < n - 1; i++) { h[i] = xs[i + 1] - xs[i]; d[i] = (ys[i + 1] - ys[i]) / h[i]; }
    m[0] = d[0]; m[n - 1] = d[n - 2];
    for (let i = 1; i < n - 1; i++) { if (d[i - 1] * d[i] <= 0) m[i] = 0; else { const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1]; m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]); } }
    return x => { if (x <= xs[0]) return ys[0]; if (x >= xs[n - 1]) return ys[n - 1]; let i = 0; while (x > xs[i + 1]) i++;
      const t = (x - xs[i]) / h[i], t2 = t * t, t3 = t2 * t; return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h[i] * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h[i] * m[i + 1]; }; };
  const W = 64;
  const tableTex = (us, vs, rows) => {                                    // rows[i][j] = colour at (us[i], vs[j])
    const rgb = rows.map(r => r.map(hexRGB)), data = new Uint8Array(W * W * 4);
    const colsAt = vs.map((_, j) => [0, 1, 2].map(c => pchip(us, rgb.map(r => r[j][c]))));
    for (let a = 0; a < W; a++) { const u = us[0] + (us.at(-1) - us[0]) * a / (W - 1), line = colsAt.map(f => f.map(g => g(u)));
      const fv = [0, 1, 2].map(c => pchip(vs, line.map(q => q[c])));
      for (let b = 0; b < W; b++) { const v = vs[0] + (vs.at(-1) - vs[0]) * b / (W - 1), k = (a * W + b) * 4;
        for (let c = 0; c < 3; c++) data[k + c] = Math.round(Math.min(255, Math.max(0, fv[c](v)))); data[k + 3] = 255; } }
    const tx = new THREE.DataTexture(data, W, W, THREE.RGBAFormat); tx.magFilter = tx.minFilter = THREE.LinearFilter; tx.needsUpdate = true; return tx; };
  const TV = '#include <common>\n#include <logdepthbuf_pars_vertex>\nvarying vec3 vO; varying vec3 vNv;\nvoid main() { vO = position; vNv = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}';
  const TF = `uniform sampler2D tab; uniform vec3 o, au, av; uniform vec2 ru, rv; uniform float op, t, flow, spd, tk, per, amp, shade;
varying vec3 vO; varying vec3 vNv;
#include <logdepthbuf_pars_fragment>
void main() { vec3 d = vO - o; float k = min(flow, 1.6) * amp * sin(6.2832 * ((t - tk) * spd) / per);
  float u = clamp((dot(d, au) - ru.x) / (ru.y - ru.x) + k, 0.0, 1.0), v = clamp((dot(d, av) - rv.x) / (rv.y - rv.x) - 0.6 * k, 0.0, 1.0);
  vec3 col = texture2D(tab, vec2(v, u) * ${((W - 1) / W).toFixed(6)} + ${(0.5 / W).toFixed(6)}).rgb;
  vec3 nv = normalize(vNv); float s = mix(1.0, mix(0.72 + 0.12 * nv.y - 0.05 * nv.x, 1.0, smoothstep(0.55, 0.98, abs(nv.z))), shade);
  gl_FragColor = vec4(col * s, op);
#include <logdepthbuf_fragment>
}`;
  const tmats = [];
  const flowProbe = V.mat(['#000000']);                                    // the engine updates its flow uniform every frame
  const tableMat = ({ us, vs, rows, o, au, av, shade = 0, amp = 0.035, per = 7.3, side = THREE.FrontSide }) => {
    const m = new THREE.ShaderMaterial({ uniforms: { tab: { value: tableTex(us, vs, rows) }, o: { value: o.clone() }, au: { value: au.clone() }, av: { value: av.clone() },
      ru: { value: new THREE.Vector2(us[0], us.at(-1)) }, rv: { value: new THREE.Vector2(vs[0], vs.at(-1)) }, op: { value: 1 }, t: { value: 0 }, flow: { value: 1 }, spd: flowProbe.uniforms.spd,
      tk: { value: TK }, per: { value: per }, amp: { value: amp }, shade: { value: shade } }, vertexShader: TV, fragmentShader: TF, side });
    tmats.push(m); return m; };
  V.anim(t => { for (const m of tmats) { m.uniforms.t.value = t; m.uniforms.flow.value = flowProbe.uniforms.flow.value; } });
  const addMesh = (geo, m, order = 0) => { const me = new THREE.Mesh(geo, m); me.renderOrder = order; me.frustumCulled = false; V.scene.add(me); return me; };
  // a triangle list from quads, each wound so its normal points along `out` (so front faces face outward)
  const quadGeo = quads => { const pos = [];
    for (const [a, b, c, d, out] of quads) { const n = b.clone().sub(a).cross(d.clone().sub(a)); const [p, q, r, s] = n.dot(out) >= 0 ? [a, b, c, d] : [a, d, c, b];
      pos.push(...p.toArray(), ...q.toArray(), ...r.toArray(), ...p.toArray(), ...r.toArray(), ...s.toArray()); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); return g; };

  /* =================== the ramp (under C9, from the helix exit Hx to Pv where frame 10's path takes over) =================== */
  // ramp coordinates: along a (down the ramp, D9), across c (+ = screen left at the hold, the camera's side), and the
  // surface 1 below the sphere's line. Board 9's edges measured on this plane: left c ≈ 0.6 at the apex → 1.1 from a ≈ 9;
  // right c = −0.72 → −2.21 at a = 18 (the board's kink at 960,830) → −2.43 at the frame's bottom. Past the frame bottom
  // (below and behind the hold camera) it widens to ±4.125 at Pv and turns frame 10's lilac, where frame 10's path starts.
  const S9 = D9.clone().cross(UP).normalize(), Y9 = S9.clone().cross(D9), base = Hx.clone().addScaledVector(Y9, -1);
  const sPv = C9.sOf(Pv), YB = -80;                                        // the block's flat underside (well below every view)
  const W10 = 4.125;                                                       // frame 10's path half-width at Pv (f10.js W0)
  const cL0 = a => a < 23 ? 0.6 + 0.5 * sm(a / 12) : 1.1 + (W10 - 1.1) * sm((a - 23) / (sPv - 23));
  // (fix pass: the left edge bowed into an S near the apex (16–28 px inside board 9's straight edge (214,524) → (660,1080)).
  //  In the frame it is now solved so it projects exactly onto that line, then blends back into the old profile over 4 units
  //  past the frame's bottom edge)
  const cL = (() => { const pj = P => { const d = P.clone().sub(h9.pos), z = d.dot(h9.fwd); return [960 + 540 * d.dot(h9.right) / (z * h9.tanV), 540 - 540 * d.dot(h9.upv) / (z * h9.tanV)]; };
    const xLine = py => 214 + (py - 524) * (660 - 214) / (1080 - 524);
    const solve = s => { const P = C9.at(s), T = C9.tan(s), S = T.clone().cross(UP).normalize(), Yv = S.clone().cross(T), at = c => P.clone().addScaledVector(S, c).addScaledVector(Yv, -1);
      const f = c => { const [x, y] = pj(at(c)); return x - xLine(y); }; let lo = 0.1, hi = 4; if (f(lo) * f(hi) > 0) return null;
      for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; } const c = (lo + hi) / 2; return pj(at(c))[1] < 1070 ? c : null; };
    const NS = 200, tab = []; let sB = 0, cB = cL0(0);
    for (let i = 0; i <= NS; i++) { const s = 23 * i / NS, c = solve(s); if (c === null) break; tab.push(c); sB = s; cB = c; }
    if (tab.length < 2) { console.warn('f09: the ramp edge could not be solved; old profile kept'); return cL0; }
    return a => { if (a <= sB) { const x = a / 23 * NS, i = Math.min(tab.length - 2, Math.floor(x)); return tab[i] + (tab[i + 1] - tab[i]) * (x - i); }
      return cB + (cL0(a) - cB) * sm((a - sB) / 4); }; })();
  const cR = a => a < 18 ? -0.72 - 0.083 * a : a < 22.4 ? -2.214 - 0.05 * (a - 18) : -2.434 - (W10 - 2.434) * sm((a - 22.4) / (sPv - 22.4));
  const NR = 220, rail = [];
  // (the surface sits 1 below the route along its normal; over the last 3 units that eases to straight down, as frame 10's
  // path is built, so the two tops meet edge to edge at Pv with no seam)
  for (let i = 0; i <= NR; i++) { const s = sPv * i / NR, P = C9.at(s), T = C9.tan(s), S = T.clone().cross(UP).normalize(), Yv = S.clone().cross(T).lerp(UP, sm((s - sPv + 3) / 3)).normalize();
    const top = c => P.clone().addScaledVector(S, c).addScaledVector(Yv, -1);
    const L0 = top(cL(s)), R0 = top(cR(s)); rail.push({ T, S, Yv, L: L0, R: R0, Lb: L0.clone().setY(YB), Rb: R0.clone().setY(YB), top }); }
  const topQ = [], leftQ = [], restQ = [];
  for (let i = 0; i < NR; i++) { const A = rail[i], B = rail[i + 1], up = A.Yv;
    for (let k = 0; k < 4; k++) { const f0 = k / 4, f1 = (k + 1) / 4; topQ.push([A.R.clone().lerp(A.L, f0), A.R.clone().lerp(A.L, f1), B.R.clone().lerp(B.L, f1), B.R.clone().lerp(B.L, f0), up]); }
    leftQ.push([A.L, B.L, B.Lb, A.Lb, A.S]);
    restQ.push([A.R, B.R, B.Rb, A.Rb, A.S.clone().negate()], [A.Lb, B.Lb, B.Rb, A.Rb, new Vec(0, -1, 0)]); }
  const r0 = rail[0], r1 = rail[NR];
  restQ.push([r0.L, r0.R, r0.Rb, r0.Lb, r0.T.clone().negate()], [r1.L, r1.R, r1.Rb, r1.Lb, r1.T.clone()]);
  // the top: board 9's ramp colours by (along, across): dark indigo at the far end, plum, then coral on the left and
  // pink → lilac → periwinkle toward the right near the camera (fitted from the board in these coordinates)
  const mTop = tableMat({ o: base, au: D9, av: S9, us: [0, 4, 8, 12, 15, 18, 21, 25, 29, 32.2], vs: [-2.8, -2.0, -1.2, -0.4, 0.4, 1.2], rows: [
    ['#2e066a', '#2c056a', '#2a046b', '#210366', '#1c016c', '#1a006e'],
    ['#3c1062', '#3a0f63', '#360d64', '#2e0765', '#23036a', '#22036a'],
    ['#601f54', '#5a1c55', '#501757', '#45135b', '#350b62', '#300a64'],
    ['#b05880', '#a8507c', '#9a4470', '#7a3060', '#5e1e50', '#6a2848'],
    ['#c26295', '#c45e82', '#c76184', '#a8506e', '#7b2c45', '#a04a3a'],
    ['#9a76fa', '#a473f2', '#b56ed5', '#cf6478', '#cf5c5a', '#cd5745'],   // (fix pass: this and the next row warmed just right of the sphere's line: board 9 is coral there, not lilac)
    ['#817dfe', '#877bfe', '#9777fd', '#c26aa8', '#d36984', '#dd6759'],
    ['#7e7eff', '#827cfe', '#9078fe', '#ae74e8', '#d06c98', '#e06a68'],
    ['#9a84f4', '#9c84f2', '#a484f0', '#b484ea', '#c87cb8', '#ce7c9a'],
    ['#b88ae8', '#bc8be8', '#c08ce8', '#c08ce8', '#bc8be8', '#b88ae8']] });                     // (Pv: frame 10's lilac)
  // the left side face (board 9's yellow triangle): by along and depth below the edge, yellow at the far top → orange →
  // mauve → violet at the near bottom
  const mSide = tableMat({ o: base, au: D9, av: Y9.clone().multiplyScalar(-1 / Y9.y), us: [0, 3, 6, 9, 12, 15, 18, 21, 33], vs: [0, 1, 2, 3, 4, 5, 6, 8, 12, 22], rows: [
    ['#ffd600', '#ffd000', '#ffc000', '#fead08', '#fb9418', '#f07a34', '#e2684c', '#c1457d', '#a02ba6', '#8a1cb4'],
    ['#ffd101', '#ffc601', '#feb503', '#fc9f10', '#f88924', '#e87040', '#d0567a', '#b33c94', '#9c28aa', '#8418b8'],
    ['#fece00', '#febf00', '#fea708', '#f88924', '#e2684c', '#d0526c', '#b13796', '#a02ba6', '#9020b0', '#7c12c0'],   // (fix pass: this row and the next two warmed at depth 2–5, sampled on board 9: its orange runs deeper)
    ['#fdc301', '#feaf05', '#f98923', '#f0782f', '#d0586a', '#bc4488', '#a02ba6', '#9424ad', '#8a1cb4', '#7410c8'],
    ['#fdae07', '#f98922', '#f0782f', '#c84b70', '#b23c8e', '#9c28a8', '#9424ad', '#8a1cb4', '#8418b8', '#6c10d0'],
    ['#ef7a35', '#c64a74', '#a93199', '#a02ba6', '#9424ad', '#8a1cb4', '#8418b8', '#7c12c0', '#7410c8', '#6810d4'],
    ['#9e2aa3', '#9220b3', '#8a1cb4', '#8418b8', '#7c12c0', '#7410c8', '#7010cc', '#6c10d0', '#6810d4', '#6410d8'],
    ['#8420b4', '#7a16c2', '#7410c8', '#7010cc', '#6c10d0', '#6810d4', '#6610d6', '#6410d8', '#6010dc', '#5c10e0'],
    ['#8420b4', '#7a16c2', '#7410c8', '#7010cc', '#6c10d0', '#6810d4', '#6610d6', '#6410d8', '#6010dc', '#5c10e0']] });
  const mRest = tableMat({ o: base, au: D9, av: new Vec(0, -1, 0), us: [0, 33], vs: [0, 8, 21], rows: [['#5a18d0', '#3a0c9a', '#1e0a58'], ['#5a18d0', '#3a0c9a', '#1e0a58']], shade: 1 });
  const ramp = [addMesh(quadGeo(topQ), mTop), addMesh(quadGeo(leftQ), mSide), addMesh(quadGeo(restQ), mRest)];
  // builds in rising from below while the camera turns to the corkscrew; stays to the group's end (it leaves the frame)
  const RAMP_IN = [31.4, 32.3];
  V.anim(t => { const dy = -14 * (1 - expoOut(clamp01((t - RAMP_IN[0]) / (RAMP_IN[1] - RAMP_IN[0])))); for (const me of ramp) me.position.y = dy; });
  prop(ramp, [RAMP_IN[0], RAMP_IN[0] + 0.12, 41.5, 41.6]);

  /* =================== the sphere's shadow on the ramp (board: a crisp ellipse, dark maroon on the left → black) =================== */
  // (revision, user 2026-09-27 21:50: "fix the shadow of the sphere. It's too wide when it drops in." It was 1.08 across ×
  //  0.94 along the ramp, centred 0.15 down-ramp and 0.08 right of the contact point: its right tip stuck out ~16% past the
  //  sphere, a long dark slit under it as it came onto the ramp from the corkscrew. It is now the size of the sphere's real
  //  footprint (SH_S: 0.86 across × 0.8 along, within the sphere's own width, light from the upper left pushing it a little
  //  right and down-ramp), with a thin soft rim instead of a hard slit edge, and it follows the sphere's height above the
  //  ramp (smaller-cored, wider and fainter as it lifts off; it rolls in contact here, so that is a safeguard).)
  const SH_S = [0.86, 0.8], SH_O = [-0.1, 0.12];                           // size (across, along) and offset (across: − = right, along: + = down-ramp)
  const SHF = 'uniform float op;\nvarying vec3 vO;\n#include <logdepthbuf_pars_fragment>\nvoid main() { float k = clamp((0.95 - vO.x) / 1.9, 0.0, 1.0), e = 1.0 - smoothstep(0.86, 1.0, length(vO.xy));\n  gl_FragColor = vec4(mix(vec3(0.50, 0.18, 0.21), vec3(0.03, 0.005, 0.015), k), op * e);\n#include <logdepthbuf_fragment>\n}';
  const shMat = new THREE.ShaderMaterial({ uniforms: { op: { value: 1 } }, vertexShader: TV, fragmentShader: SHF, transparent: true, depthWrite: false,
    polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 });
  const shadow = addMesh(new THREE.CircleGeometry(1, 96), shMat, 1);
  const S_END = sPv + 5, sTab = Array.from({ length: 501 }, (_, i) => C9.at(S_END * i / 500));   // nearest-point lookup along the route
  const SH_T = [33.25, 36.9];                                              // from the helix exit; it hands over to frame 10's shadow past Pv
  const qS = new THREE.Quaternion(), mB = new THREE.Matrix4();
  // (fix pass: the two shadows used to cross-fade over 1–4 units past Pv, showing a doubled, offset rim at 36.7–37.0, and this
  //  one, lying on the ramp's plane, was cut by a straight line where frame 10's path rises above that plane past Pv. Now they
  //  hand over at ONE point, 1.5 units past Pv along camera 10's axis, where they look the same (f10.js uses the same rule),
  //  and this one lifts 0.03 more around the joint, clear of the path's rise; away from the joint it lies as before)
  const h10 = C.h10, fOf = p => p.clone().sub(h10.pos).dot(h10.fwd), fHand = fOf(Pv) + 1.5;
  V.anim((t, b) => {
    const on = t > SH_T[0] && t < SH_T[1] && !b.h && fOf(b.p) < fHand; shadow.visible = on; if (!on) return;
    let bi = 0, bd = Infinity; for (let i = 0; i < sTab.length; i++) { const d = sTab[i].distanceToSquared(b.p); if (d < bd) { bd = d; bi = i; } }
    const s = S_END * bi / 500, T = C9.tan(s), S = T.clone().cross(UP).normalize(), Yv = S.clone().cross(T), lift = 0.03 * sm((s - sPv + 2.6) / 1.2);
    const hgt = Math.max(0, b.p.clone().sub(C9.at(s)).dot(Yv) - ramp[0].position.y * Yv.y), g = 1 + 0.25 * hgt;   // its lowest point above the ramp
    shadow.position.copy(b.p).addScaledVector(Yv, -1 - hgt + 0.012 + lift).addScaledVector(T, SH_O[1]).addScaledVector(S, SH_O[0]);
    shadow.position.y += ramp[0].position.y;
    mB.makeBasis(S, T, Yv); qS.setFromRotationMatrix(mB); shadow.quaternion.copy(qS); shadow.scale.set(SH_S[0] * g, SH_S[1] * g, 1);
    shMat.uniforms.op.value = 0.97 * sm((t - SH_T[0]) / 0.12) * Math.max(0, 1 - hgt / 3);
  });

  /* =================== the corkscrew: a helical shelf round a post, coiling up into its board corner =================== */
  // Route pose (the sphere's helix HX): centre `post`, the exit (u = 1) at angle phiX where the sphere leaves onto the ramp,
  // pitch yTop − yBot per turn; the shelf's top is under the sphere's line. Board pose: the post on board 9's post
  // (x 208–300: seen 22° off-axis it projects 7.7% wider than 2r), planted against the ramp's far end (its surface 0.08
  // behind it, so a camera move barely shows any post beside it), the coil tight (like the board's slats ~78 px apart) at
  // the top left, cut off by the frame's top, its exit end turned to face the camera, just above the tab. (The coil's
  // handedness is the route's; follow-up: both now turn the way that makes its near slats rise to the right, as board 9's.)
  const NT = 2.6, NU = 420, phiX = Math.atan2(Hx.z - post.z, Hx.x - post.x), kOff = -1.048;   // (1 / cos of the helix slope: the sphere sits exactly on it)
  const Dp = 27.2, RP = 0.66, pB = h9.at(256, 330, Dp), toCam = Math.atan2(h9.pos.z - pB.z, h9.pos.x - pB.x);
  const PR = { A: new Vec(post.x, yBot, post.z), phi: phiX, P: yTop - yBot, NT, ri: 0.55, ro: 3.95, th: 0.42, sq: 1, cut: 0 };
  // coiled up, the shelf folds into an upright ribbon and the coil flattens along the view (sq): board 9's thin zig-zag slats.
  // (fix pass: board 9 draws a side-on zig-zag: straight slats, the front ones slanting one way and the back ones the other,
  //  cut square at x ≈ 100 and 430. At the board pose the rounded sides of each turn (within 66° of side-on) are cut away, so
  //  no U-loops show, and each turn is sheared a little in height with its depth so it is edge-on to the hold camera: the
  //  slats come out straight instead of bowed. The radius is 7% larger so the cut slats still span x 100–430. Not flattened
  //  further: below sq ≈ 0.3 the front slats would sink behind the post's front, and the board draws them in front of it.)
  // (follow-up: 3.1 turns at the board pose (2.6 on the route): the next front slat shows at the top left, as on board 9)
  const PBo = { phi: toCam, P: 1.22, NT: 3.1, ri: 2.42, ro: 2.66, th: 0.48, sq: 0.35, cut: 1 }, DC = Math.hypot(h9.pos.x - pB.x, h9.pos.z - pB.z);
  // (follow-up: 189, was 196: with the board's slant the slats sat ~8 px under board 9's; the exit end now sits 7 px higher on the tab)
  { const q = h9.at(256, 189, Dp - 1.6); PBo.A = new Vec(pB.x, q.y - kOff + PBo.th, pB.z); }   // the exit end's underside at y 189 (board)
  // unwrap so the coil turns the short way (+98°, follow-up (was −82° with the old handedness): the thread still appears to
  // screw upward as it lifts)
  while (PBo.phi - PR.phi > Math.PI) PBo.phi -= 2 * Math.PI; while (PBo.phi - PR.phi < -Math.PI) PBo.phi += 2 * Math.PI;
  const GLIDE = [33.26, 33.95], CK_IN = [30.6, 31.35];
  const coilPos = new Float32Array((NU + 1) * 8 * 3 + 16 * 3);
  const coilGeo = new THREE.BufferGeometry(); coilGeo.setAttribute('position', new THREE.BufferAttribute(coilPos, 3));
  { const idx = [];
    for (let e = 0; e < 4; e++) { const b0 = e * (NU + 1) * 2; for (let i = 0; i < NU; i++) { const a = b0 + 2 * i, b = a + 1, c = a + 2, d = a + 3; idx.push(a, c, b, b, c, d); } }
    const c0 = (NU + 1) * 8; idx.push(c0, c0 + 1, c0 + 2, c0, c0 + 2, c0 + 3, c0 + 4, c0 + 6, c0 + 5, c0 + 4, c0 + 7, c0 + 6);
    coilGeo.setIndex(idx); }
  const lerpP = (a, b, w) => ({ A: a.A.clone().lerp(b.A, w), phi: a.phi + (b.phi - a.phi) * w, P: a.P + (b.P - a.P) * w, NT: a.NT + (b.NT - a.NT) * w, ri: a.ri + (b.ri - a.ri) * w, ro: a.ro + (b.ro - a.ro) * w, th: a.th + (b.th - a.th) * w, sq: a.sq + (b.sq - a.sq) * w, cut: a.cut + (b.cut - a.cut) * w });
  // (review fix: at the board pose the lowest slat ended 3° past the exit, at x ≈ 248, in the middle of the tab. It runs in
  //  depth across the tab's plane (in front of it left of x ≈ 261, behind it right of that), so its end showed as a lilac
  //  window inside the dark tab. Board 9 draws that slat's left end merging into the tab's top: a dark navy band from the tab's
  //  top-right, rising to the right more gently than the other front slats. So, at the board pose only (all × cut):
  //  · it ends 3° on the other side of the exit (x ≈ 267), where it is behind the tab: the tab reads solid;
  //  · the lowest front arc is lifted by LIFT (a fraction of a turn, 0 at its right end, linear in sin ψ so it stays straight):
  //    its top meets the tab's top (y 166) at the tab's right edge (it sat 14–18 px under board 9's band there);
  //  · it darkens toward the tab's navy (DKC) from its end to ψ ≈ 16°, back to the table's colours by ψ ≈ 44°, as the board.)
  const PSI_END = 3 * Math.PI / 180, LIFT = 0.2, DK_A = 16 * Math.PI / 180, DK_B = 44 * Math.PI / 180;
  const coilDk = new Float32Array((NU + 1) * 8 + 16); coilGeo.setAttribute('dk', new THREE.BufferAttribute(coilDk, 1));
  const buildCoil = p => {                                                 // positions relative to the anchor p.A
    const uEnd = 1 + (PSI_END * (1 - 2 * p.cut)) / (2 * Math.PI * p.NT);    // route pose: 3° past the exit (its end is buried in the ramp's first bit); board pose: 3° short of it
    const dkOf = u => { const psi = 2 * Math.PI * p.NT * (1 - u); return p.cut * (1 - sm((psi - DK_A) / (DK_B - DK_A))); };
    const sec = [[p.ri, 0], [p.ro, 0], [p.ro, -p.th], [p.ri, -p.th]], fx = Fw.x * (1 - p.sq), fz = Fw.z * (1 - p.sq), rc = (p.ri + p.ro) / 2, yc = -p.th / 2;
    // (the sides of each turn collapse onto its centre line as cut → 1: degenerate, so invisible, with a one-sample (~2°) taper;
    //  the shear lowers a point by its depth toward the camera × its height above the camera / the post's distance, so a ring
    //  projects to one screen height)
    const pt = (u, r0, dy0) => { const psi = 2 * Math.PI * p.NT * (1 - u), th = p.phi - psi, fc = Math.cos(th) * Fw.x + Math.sin(th) * Fw.z, ls = Math.cos(th) * Lt.x + Math.sin(th) * Lt.z,
        kk = 1 - sm(p.cut / 0.85) * (Math.abs(fc) > (ls >= 0 ? cutR : cutL) ? 0 : 1), r = rc + (r0 - rc) * kk, dy = yc + (dy0 - yc) * kk;   // (follow-up: the sides are
      // fully collapsed by cut 0.85, so no hairline sticks out past the slat ends as the glide lands)
      const lift = psi < aR ? LIFT * (1 - Math.max(0, Math.sin(psi)) / sR) : 0;   // (review fix: the lowest front arc only)
      const y = p.P * p.NT * (1 - u) + p.cut * p.P * (RISE(psi) + lift) + kOff + dy, x = r * Math.cos(th), z = r * Math.sin(th), f = x * Fw.x + z * Fw.z, fs = f * p.sq;
      return [x - f * fx, y - p.cut * fs * (p.A.y + y - h9.pos.y) / DC + p.cut * TILT * (x * Lt.x + z * Lt.z), z - f * fz]; };
    let k = 0, j = 0;
    for (let e = 0; e < 4; e++) { const [ra, ya] = sec[e], [rb, yb] = sec[(e + 1) % 4];
      for (let i = 0; i <= NU; i++) { const u = uEnd * i / NU, dk = dkOf(u); for (const q of [pt(u, ra, ya), pt(u, rb, yb)]) { coilPos[k++] = q[0]; coilPos[k++] = q[1]; coilPos[k++] = q[2]; coilDk[j++] = dk; } } }
    for (const u of [0, uEnd]) for (const [r, dy] of sec) { const q = pt(u, r, dy); coilPos[k++] = q[0]; coilPos[k++] = q[1]; coilPos[k++] = q[2]; coilDk[j++] = dkOf(u); }
    coilGeo.attributes.position.needsUpdate = true; coilGeo.attributes.dk.needsUpdate = true; coilGeo.computeVertexNormals(); };
  // colours (local, around the post): seen from the hold camera the near side runs dark (left) → violet → orange (right),
  // the far side violet, as board 9's slats
  const Rt = h9.right.clone().setY(0).normalize(), Fw = h9.pos.clone().sub(pB).setY(0).normalize();
  // (follow-up: the slant. The helix now turns the sphere's new way, so its front slats rise to the right as on board 9. Two
  //  more changes at the board pose (both scaled by cut, so the route pose stays the sphere's exact helix):
  //  · the rise of each turn is shared out as the board draws it: board 9's back slats are level and meet the front ones
  //    flush at the left end, and the front slat carries ~86% of the turn's rise (66 of 77 px), the right side the rest.
  //    RISE(ψ) is that profile minus the uniform one (ψ: the angle up the thread from the exit, which faces the camera; the
  //    front arc is |ψ| < 66°, ψ = 90° the screen-right side, 180° the back); on the front arc the height is linear in
  //    sin ψ, so the slats come out straight.
  //  · the hold camera sees the coil ~22° off its axis, which leans everything down to the right on screen; each point is
  //    lifted by TILT × its sideways offset (Lt: across the line of sight, toward screen right) so level reads level (a
  //    shear, so the slat ends stay cut square).)
  //  · the sides are cut at 66° from side-on on the right and 55° on the left (was 66° both): board 9's coil sits off-centre
  //    on its post (151 px to its left, 176 to its right), so the slat ends land at x ≈ 103 and 430.
  const Lt = new Vec(Fw.z, 0, -Fw.x), TILT = 0.12, FRONT = 0.86, aR = 66 * Math.PI / 180, aL = 55 * Math.PI / 180, cutR = Math.cos(aR), cutL = Math.cos(aL);
  const sR = Math.sin(aR), sL = Math.sin(aL), SF = FRONT / (sR + sL), hR = SF * sR, hB = 1 - SF * sL;   // the front slat's right end, the back level
  const RISE = psi => { const q = psi - 2 * Math.PI * Math.floor(psi / (2 * Math.PI));
    const h = q <= aR ? SF * Math.sin(q) : q < Math.PI - aR ? hR + (hB - hR) * sm((q - aR) / (Math.PI - 2 * aR)) : q < 2 * Math.PI - aL ? hB : 1 + SF * Math.sin(q);
    return h - q / (2 * Math.PI); };
  // (its depth range is the flattened coil's: the route pose, deeper, clamps to the same near / far colours)
  const mCoil = tableMat({ o: new Vec(0, 0, 0), au: Rt, av: Fw, us: [-2.7, -1.2, 0.6, 2.7], vs: [-0.95, 0, 0.95], rows: [
    ['#4a10d8', '#281070', '#1c0850'], ['#5010e0', '#3a10b0', '#34109c'], ['#5412e0', '#5a18d8', '#7a2ac0'], ['#5a14e0', '#c06030', '#fb8a1c']], shade: 1, side: THREE.DoubleSide });
  // (review fix: the lowest slat's end darkens toward board 9's navy where it meets the tab: a per-vertex weight dk (coilDk))
  const DKC = hexRGB('#33058a');
  mCoil.vertexShader = TV.replace('varying vec3 vNv;', 'varying vec3 vNv; attribute float dk; varying float vDk;').replace('vO = position;', 'vO = position; vDk = dk;');
  mCoil.fragmentShader = TF.replace('varying vec3 vO; varying vec3 vNv;', 'varying vec3 vO; varying vec3 vNv; varying float vDk; uniform vec3 dkc;').replace('vec3 nv = normalize(vNv);', 'col = mix(col, dkc, vDk); vec3 nv = normalize(vNv);');
  mCoil.uniforms.dkc = { value: new Vec(DKC[0] / 255, DKC[1] / 255, DKC[2] / 255) }; mCoil.needsUpdate = true;
  const coil = addMesh(coilGeo, mCoil);
  // the post: board 9's post from top to bottom (hold view): blue-violet between the slats, orange just under the coil,
  // pink, violet, deep blue at the ramp. Heights are local (the anchor's), taken from the board pose.
  const yl = py => h9.at(256, py, Dp).y - PBo.A.y;
  const mPost = tableMat({ o: new Vec(0, 0, 0), au: new Vec(0, -1, 0), av: new Vec(1, 0, 0), us: [120, 186, 206, 252, 300, 380, 460, 540].map(py => -yl(py)), vs: [-1, 1],
    rows: [['#3c10d8', '#3c10d8'], ['#5a18b8', '#5a18b8'], ['#f58038', '#f58038'], ['#e66e80', '#e66e80'], ['#b350c0', '#b350c0'], ['#611dfe', '#611dfe'], ['#3606fe', '#3606fe'], ['#2800ff', '#2800ff']], shade: 0.5 });
  const pst = addMesh(new THREE.CylinderGeometry(RP, RP, 50, 48, 1, false).translate(0, 6, 0), mPost);
  let lastKey = '';
  V.anim(t => {
    const w = smoother((t - GLIDE[0]) / (GLIDE[1] - GLIDE[0])), rise = -16 * (1 - expoOut(clamp01((t - CK_IN[0]) / (CK_IN[1] - CK_IN[0]))));
    const p = lerpP(PR, PBo, w), key = w.toFixed(5);
    if (key !== lastKey) { buildCoil(p); lastKey = key; }
    coil.position.copy(p.A).add(new Vec(0, rise, 0)); pst.position.copy(coil.position);
  });
  prop([coil, pst], [CK_IN[0], CK_IN[0] + 0.1, 36.55, 36.65]);

  /* =================== board 9's shapes as pieces (flat at the hold) =================== */
  const hold = 9, IN = (type, a, b, extra = {}) => ({ type, t: [a, b], ...extra }), OUT = IN;
  // backdrop: board 9's violet (bluer at the top centre, pink-violet toward the upper left, mauve low by the ramp)
  // (review fix, 2026-09-28: 9 → 10's whip (36.1–36.7) read as ~85% bare lilac ramp: frame 9's shapes had left by ~36.3 and
  //  frame 10's wall only started at 36.5. Frame 9's shapes now leave ~0.25 s later, into the whip, and f10's build ~0.2 s earlier.)
  const BDF = { in: IN('fade', 32.45, 33.2), out: OUT('fade', 36.2, 36.7, { ease: 'sine.inOut' }) };   // (fix pass: in 0.25 s earlier, overlapping frame 8's backdrop; review fix: out 0.25 s later, into the whip)
  PC({ hold, shape: SH.rr(4400, 2800, 0), at: [960, 540], depth: 44, thick: 0, drift: 0, grad: { cols: ['#5109ff', '#8c37f7', '#8730a7'], c: [998, 46], r: 713 }, ...BDF }).mesh.renderOrder = -3;
  // two soft glows over it (least-squares residuals against the board): pink-violet at the top left, deep violet right of centre
  for (const [at, r, col, a] of [[[430, 30], 380, '#b64cd2', 0.8], [[1380, 650], 470, '#4e06c0', 0.85]]) {
    const g = C.glow({ hold, shape: SH.disc(r), at, depth: 43.9, ...BDF }, col, [0, 0], r, a); g.mesh.renderOrder = -2; }
  // the strip at the left edge (magenta → orange → violet); it runs on far past the frame's left edge, so the wider views
  // before the camera settles show a colour field there, not a bar (just behind the post, in front of the D's depth)
  PC({ hold, shape: SH.rr(1614, 2490, 0), at: [-593, 1155], depth: 29.7, thick: 0.35, grad: { cols: ['#be1ddc', '#f86c49', '#5e09ff'], from: [61, 149], to: [127, 773] },   /* (fix pass: 25 px lower, as board 9's orange band) */
    in: IN('slide', 32.55, 33.25, { from: 'left' }), out: OUT('slide', 36.05, 36.55, { from: 'left' }), keys: { op: [[32.55, 0], [32.8, 1, 'sine.inOut']] } });   // (fix pass: 0.25 s earlier again: 32.62–32.85 was bare)   // (integration: in 0.4 s earlier, so 32.8–33.2 isn't bare)   // (the wider views before the hold see its start: fade)
  // the D against the post: flat left and bottom, a rounded top-right corner (r 262); it unfolds from the post's foot
  { const s = new THREE.Shape(); s.moveTo(-22, 0); s.lineTo(380, 0); s.lineTo(380, 44); s.absarc(118, 44, 262, 0, Math.PI / 2, false); s.lineTo(-22, 306); s.lineTo(-22, 0);
    PC({ hold, shape: s, at: [302, 522], depth: 30.1, thick: 0.7, grad: { cols: ['#9633bc', '#6c10fc', '#5502fe'], from: [628, 531], to: [416, 326] },
      in: IN('grow', 33.35, 33.95), out: OUT('grow', 36.1, 36.5) }); }
  // the tab under the corkscrew (dark violet → orange), in front of the post
  PC({ hold, shape: SH.rr(36, 84, 0), at: [254, 208], depth: 26.42, thick: 0.05, drift: 1, grad: { cols: ['#210952', '#4b04b4', '#d2623e'], from: [253, 174], to: [255, 244] },
    in: IN('slide', 33.7, 34.0, { from: 'top' }), out: OUT('fade', 36.5, 36.6) });
  // the stadium chain on the right, back to front: (1) the big outline (its slot panel behind it), (2) the vertical one (its
  // slot panel behind it), (3) the horizontal one (its slot is open: (2) and the backdrop show through, as on the board)
  const chain = (i, spec) => PC({ hold, thick: 0.9, in: IN('slide', 32.45 + 0.1 * i, 33.25 + 0.1 * i, { from: 'right' }), out: OUT('slide', 36.0 + 0.08 * i, 36.5 + 0.08 * i, { from: 'right' }), ...spec });
  chain(0, { shape: SH.stadiumRing(1400, 650, 219), at: [1669, 324], depth: 35.8, grad: { cols: ['#f4761d', '#742cb6', '#5300ca'], from: [1415, -5], to: [1388, 771] } });
  chain(0, { shape: SH.rr(880, 236, 118), at: [1618, 324], depth: 36.8, thick: 0.2, drift: 3, grad: { cols: ['#5c11e4', '#5817c5', '#4402b9'], from: [1215, 259], to: [1699, 327] } });
  chain(1, { shape: SH.stadiumRing(427, 812, 142), at: [1776.5, 766], depth: 34.7, grad: { cols: ['#f67b24', '#4d06b0', '#650fe2'], from: [1776, 330], to: [1776, 1080] } });
  chain(1, { shape: SH.rr(165, 550, 82), at: [1776.5, 766], depth: 35.7, thick: 0.05, grad: { cols: ['#4d07b3', '#4903b7', '#5d129d'], from: [1763, 842], to: [1837, 426] } });
  chain(2, { shape: SH.stadiumRing(775, 414, 138), at: [1429.5, 950], depth: 33.6, grad: { cols: ['#efc116', '#ab6863', '#803096'], from: [1800, 877], to: [1304, 877] } });
};
