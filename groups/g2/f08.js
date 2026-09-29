/* Frame 8 · the peg wall (G2, called from g2.js with its context C). Built (batch 2): real 3D set, no plate.
   Head-on at the hold (a long lens: the relief reads flat, like the board), then the camera rises and angles down on the
   hops (v1's look, which the user loves), and the wall's pieces show their chunky sides and parallax.

   The wall is a relief of board 8's shapes (board px, y down; measured from the board's edges and least-squares colour fits):
     backdrop  pink → violet → blue-violet across the top band
     arch      the big orange ∩ (x 660–1990, top 79, corner r 330), orange → pink → orange, with the soft violet shadow that the
               magenta ∩ casts on it (a capsule-distance glow)
     pill      the violet pill (x 884–1760, y 308–552; it shows left of the ∩ and through the doorway)
     frame     the magenta ∩ (x 1179–1798, round top r 309.5) with its doorway (x 1388–1598, round top r 105): the doorway
               is a real opening, so the pill and the arch show through it, recessed
     left      the tall violet shape at the left (top 171, top-right corner r 268), violet → magenta → orange
     accordion the bar and the wedge stripes at the bottom centre
   Back to front (depth from camera 8): backdrop 65.6 · arch 65.1 · pill 64.75 · left 64.55 · frame 64.3 · accordion 64.0.
   Pegs: 3D capsules sunk into whichever relief is behind their base; each projects exactly onto its board capsule (centre
   and angle fitted to the board's outlines, 31–42°, 94 × 38 px). Each board peg's tip depth is solved so the sphere, at its
   landing point (onPeg), rests right on the tip (1.52 from the axis). Their colour is board 8's peg gradient (binned from
   the board) laid on in camera 8's image space and baked per vertex (dark indigo → violet → orange → yellow tip), so it
   matches the board at the hold and stays on the surface from every other angle. They sprout out of the wall in a wave
   ahead of the sphere as the camera swings in (25.75–27.9), flex when the sphere lands on them (the tip dips, then springs
   back; hit times read from the sphere's own path), and slide back into the wall in a wave behind it (30.4–32.5). A few
   extra pegs continue the band beyond the frame (never visible at the hold, clear of frame 9's post) so the angled views
   don't show the band stopping at the frame edge.
   Build-in (7 → 8): backdrop flies in 24.35–25.25 (drawn behind everything until frame 7's backdrop has left, 25.3); left shape
   and arch slide in 24.65–25.7; pill, ∩ and accordion
   25.45–27.0. Exit (8 → 9): pieces slide away 31.8–32.7 (the arch 32.15–32.9) behind frame 9's corkscrew; the backdrop
   fades 32.3–32.9, while frame 9's builds in. */
export default (V, C) => {
  const { THREE, Vec, UP, h8, PEGS, onPeg, PC, SH, hexV3 } = C;
  V.unplate(8);
  const ez = n => gsap.parseEase(n), cl = x => Math.min(1, Math.max(0, x));
  const BOT = 2000;                                                        // shapes run well past the frame bottom (angled views)

  /* ---------- board-px outlines (1920 × 1080, y down) ---------- */
  const arcP = (cx, cy, r, a0, a1, n = 48) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
  const rrP = (x0, y0, x1, y1, r) => [...arcP(x1 - r, y0 + r, r, -90, 0, 24), ...arcP(x1 - r, y1 - r, r, 0, 90, 24), ...arcP(x0 + r, y1 - r, r, 90, 180, 24), ...arcP(x0 + r, y0 + r, r, 180, 270, 24)];
  const inPoly = (x, y, P) => { let r = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) r = !r; } return r; };
  const O = {
    back: rrP(-1100, -420, 3300, BOT, 160),
    arch: rrP(660, 79, 1990, BOT, 330),
    pill: rrP(884, 308, 1760, 552, 122),                                   // (its right end stays inside the ∩'s round shoulder)
    frame: [[1179, BOT], ...arcP(1488.5, 530, 309.5, 180, 360, 64), [1798, BOT], [1598, BOT], ...arcP(1493, 533, 105, 0, -180, 40), [1388, BOT]],
    left: [[-1100, 171], ...arcP(480, 439, 268, -90, 0, 32), [748, BOT], [-1100, BOT]],
    acc: [[860, 911], [1700, 911], [1700, 1300], [860, 1300]],            // the accordion's footprint (for the pegs' bases)
  };
  // depth (from camera 8) of each relief's front face, front to back: the pegs' bases sink into the first one they meet
  const DEP = { acc: 64.0, frame: 64.3, left: 64.55, pill: 64.75, arch: 65.1, back: 65.6 };
  const reliefAt = (x, y) => { for (const k of ['acc', 'frame', 'left', 'pill', 'arch']) if (inPoly(x, y, O[k])) return DEP[k]; return DEP.back; };
  // (fix pass: a peg's base sits on the NEAREST relief face under its whole buried end, not the one under its base point. Where
  //  an end straddled two reliefs, the nearer one's face cut the peg and the buried end showed past its edge as a detached dark
  //  crescent (review: 4 pegs). Sampled over a disc of ~30 px round the base point, reaching further along the peg's back.)
  const reliefUnder = (bx, by, u) => { let d = reliefAt(bx, by);
    for (let r = 12; r <= 30; r += 9) for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; d = Math.min(d, reliefAt(bx + r * Math.cos(a), by + r * Math.sin(a))); }
    for (const s of [20, 32]) d = Math.min(d, reliefAt(bx - s * u[0], by - s * u[1]));
    return d; };

  /* ---------- timing: build in during 7 → 8, leave during 8 → 9 ---------- */
  const IN = (type, a, b, from) => ({ type, t: [a, b], from, ...(type === 'fly' ? { dz: 14 } : {}) });
  const OUT = (type, a, b, from) => ({ type, t: [a, b], from, ...(type === 'fade' ? { ease: 'sine.inOut' } : {}) });
  const piece = (k, spec) => PC({ hold: 8, shape: SH.poly(O[k] || spec.pts, spec.at), ...spec });

  // backdrop: a thick wall panel (its top edge shows as the camera swings in from above)
  const back = piece('back', { at: [960, 540], depth: DEP.back, thick: 1.2, drift: 0, grad: { cols: ['#e746a7', '#832bff', '#530ed7'], from: [100, 60], to: [1800, 0] },
    in: IN('fly', 24.35, 25.25), out: OUT('fade', 32.3, 32.9) });   // (fix pass: in 0.2 s earlier and out a touch later, so the sets overlap)
  // (review fix, 7 → 8: from the camera leaving frame 7 this wall lies IN FRONT of frame 7's backdrop (the two sets' planes cross),
  //  so the instant its fly-in turned it opaque (24.575) it hid frame 7's stripes, disc and stadium in one frame. While the sets
  //  overlap (until BGM_END, when frame 7's backdrop has left) it is drawn as a true backdrop: first (just after the engine's
  //  background), not writing depth, in the opaque pass with alpha blending for its fade-in. Everything else, frame 7's set
  //  included, draws over it, so frame 7 leaves in front of it and reveals it. Then it is an ordinary piece again: frame 7's
  //  backdrop is gone and frame 8's own pieces sit in front of it either way, so the switch changes nothing on screen.)
  const BGM_END = 25.3;
  V.anim(t => { const me = back.mesh, m = me.material;                  // (runs after the engine's piece update, which sets these)
    if (t < BGM_END) { me.renderOrder = -9; m.transparent = false; m.depthWrite = false; m.blending = THREE.CustomBlending; }
    else if (me.renderOrder !== 0 || m.blending !== THREE.NormalBlending) { me.renderOrder = 0; m.blending = THREE.NormalBlending; } });
  // the orange arch, and the magenta ∩'s soft violet shadow on it (a glow by distance to the ∩'s outline, clipped to the arch)
  const ARCH = { at: [1325, 700], in: IN('slide', 24.75, 25.7, 'bottom'), out: OUT('slide', 32.15, 32.9, 'bottom') };   // (fix pass: leaves 0.2 s later: 32.62–32.85 was bare; review fix: in 0.2 s earlier, so frame 7 → 8 has no bare moment)
  piece('arch', { ...ARCH, depth: DEP.arch, thick: 0.45, drift: 0, grad: { cols: ['#fa8132', '#c240ac', '#ff8100'], from: [900, 80], to: [900, 1060] } });
  const SHV = 'varying vec3 vO;\n#include <common>\n#include <logdepthbuf_pars_vertex>\nvoid main() { vO = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}';
  const overlay = (spec, frag, uni) => { const pc = PC({ drift: 0, thick: 0, flat: false, ...spec }), o0 = pc.mesh.material;
    pc.mesh.material = new THREE.ShaderMaterial({ uniforms: { op: o0.uniforms.op, t: o0.uniforms.t, ...uni }, vertexShader: SHV, fragmentShader: frag, transparent: true, depthWrite: false });
    return pc; };
  const loc = (at, x, y) => new THREE.Vector2(x - at[0], at[1] - y);    // board px → a piece's local px (y up)
  overlay({ hold: 8, ...ARCH, shape: SH.poly(O.arch, ARCH.at), depth: DEP.arch - 0.05 },
    'uniform vec3 c0, c1; uniform vec2 sa, sb; uniform float rad, w0, w1, ga, y0, y1, op, t;\nvarying vec3 vO;\n#include <logdepthbuf_pars_fragment>\n' +
    'void main() { vec2 p = vO.xy, ab = sb - sa; float h = clamp(dot(p - sa, ab) / dot(ab, ab), 0.0, 1.0); float sd = length(p - sa - ab * h) - rad;\n' +
    '  float k = 1.0 - smoothstep(-w0, w1, sd); vec3 col = mix(c0, c1, clamp((p.y - y0) / (y1 - y0), 0.0, 1.0));\n  gl_FragColor = vec4(col, ga * op * k);\n#include <logdepthbuf_fragment>\n}',
    // (fitted jointly with the arch's own gradient: the shadow sits ~120 px right of the ∩'s axis and fades over 320 px)
    { c0: { value: hexV3('#a9327d') }, c1: { value: hexV3('#3c0dcd') }, sa: { value: loc(ARCH.at, 1610, 530) }, sb: { value: loc(ARCH.at, 1610, 3000) }, rad: { value: 309.5 },
      w0: { value: 40 }, w1: { value: 320 }, ga: { value: 0.8 }, y0: { value: ARCH.at[1] - 350 }, y1: { value: ARCH.at[1] - 900 } });
  // the pill, the tall left shape, the magenta ∩ with its doorway
  piece('pill', { at: [1337, 430], depth: DEP.pill, thick: 0.28, grad: { cols: ['#a840d3', '#7125fd', '#5e17bc'], from: [884, 520], to: [1500, 350] },
    in: IN('slide', 25.45, 26.35, 'right'), out: OUT('slide', 31.9, 32.5, 'right') });
  const LEFT = { at: [374, 625], in: IN('slide', 24.65, 25.55, 'left'), out: OUT('slide', 31.9, 32.6, 'left') };   // (review fix: in 0.2 s earlier)
  piece('left', { ...LEFT, depth: DEP.left, thick: 0.5, drift: 0, grad: { cols: ['#5700ff', '#9336d2', '#ff8300'], from: [250, 200], to: [650, 1080] } });
  // its pink lower-left corner (a radial glow, clipped to the shape)
  overlay({ hold: 8, ...LEFT, shape: SH.poly(O.left, LEFT.at), depth: DEP.left - 0.05 },
    'uniform vec3 col; uniform vec2 gc; uniform float gr, ga, op, t;\nvarying vec3 vO;\n#include <logdepthbuf_pars_fragment>\n' +
    'void main() { float d = length(vO.xy - gc) / gr; float k = 1.0 - smoothstep(0.0, 1.0, d);\n  gl_FragColor = vec4(col, ga * op * k * k * (3.0 - 2.0 * k));\n#include <logdepthbuf_fragment>\n}',
    { col: { value: hexV3('#ff48a1') }, gc: { value: loc(LEFT.at, 0, 1080) }, gr: { value: 700 }, ga: { value: 0.6 } });
  piece('frame', { at: [1488, 700], depth: DEP.frame, thick: 0.75, grad: { cols: ['#b109ff', '#8d2ad1', '#5624b3'], from: [1431, 288], to: [1607, 1117] },
    in: IN('slide', 25.55, 26.45, 'bottom'), out: OUT('slide', 31.85, 32.55, 'bottom') });
  // the accordion: a bar (two halves: orange → violet → orange → violet) over a plate of wedge stripes
  const ACC = (i, extra) => ({ in: IN('slide', 25.8 + 0.06 * i, 26.7 + 0.06 * i, 'bottom'), out: OUT('slide', 31.8 + 0.03 * i, 32.4 + 0.03 * i, 'bottom'), ...extra });
  const accP = (pts, depth, thick, grad, i) => { const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), at = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
    return piece(null, ACC(i, { pts, at, depth, thick, grad })); };
  accP([[860, 911], [1245, 911], [1245, 979], [860, 979]], 64.0, 0.3, { cols: ['#ef7622', '#a03f6a', '#5108b3'], from: [861, 945], to: [1241, 945] }, 0);
  // (fix pass: the right half now starts 9 px under the left one, a hair behind it: a 1–2 px light seam showed where they met)
  accP([[1236, 911], [1700, 911], [1700, 979], [1236, 979]], 64.012, 0.3, { cols: ['#4e06b4', '#ed742d', '#5f02f6'], from: [1245, 945], to: [1701, 945] }, 0);
  accP([[860, 979], [1700, 979], [1700, 1300], [860, 1300]], 64.1, 0.3, { cols: ['#ea7228', '#4c06b2', '#6c12ea'], from: [870, 1015], to: [1690, 1015] }, 1);
  accP([[860, 979], [1300, 979], [860, 1004]], 64.03, 0.1, { cols: ['#f6720e', '#e56a2a', '#c05a5a'], from: [870, 990], to: [1290, 980] }, 2);
  accP([[860, 1004], [1300, 979], [1300, 1010], [860, 1008]], 64.03, 0.1, { cols: ['#4a1040', '#420a80', '#4c06a8'], from: [870, 1005], to: [1290, 995] }, 2);
  accP([[1300, 979], [1700, 979], [1700, 1010], [1300, 1010]], 64.03, 0.1, { cols: ['#4c06a8', '#6a1eb0', '#6521c7'], from: [1300, 995], to: [1700, 995] }, 2);   // (fix pass: starts on its left neighbour's end colour: no step at x 1300)
  accP([[1270, 1009], [1700, 980], [1700, 993]], 63.97, 0.08, { cols: ['#8a3a98', '#a84868', '#8a3890'], from: [1280, 1005], to: [1695, 984] }, 2);
  accP([[860, 1028], [1185, 1037], [860, 1053]], 64.03, 0.1, { cols: ['#f67408', '#ec6a1c', '#c85a48'], from: [870, 1040], to: [1180, 1037] }, 3);
  accP([[860, 1055], [1185, 1040], [1700, 1036], [1700, 1300], [860, 1300]], 64.03, 0.1, { cols: ['#2a0766', '#4405aa', '#74289c'], from: [870, 1065], to: [1500, 1065] }, 3);
  accP([[1270, 1060], [1700, 1028], [1700, 1042]], 63.97, 0.08, { cols: ['#8a3478', '#b04e64', '#9c4478'], from: [1280, 1057], to: [1695, 1036] }, 4);
  accP([[1250, 1082], [1700, 1057], [1700, 1082]], 63.97, 0.08, { cols: ['#7a2890', '#b0505a', '#e0702d'], from: [1300, 1074], to: [1690, 1068] }, 4);

  /* ---------- the pegs ---------- */
  const R = 0.5, TIP = 61.1, K = h8.tanV / 540;                           // radius; tip depth (from camera 8); world units per px per unit depth
  const toPx = P => { const d = P.clone().sub(h8.pos), z = d.dot(h8.fwd); return [960 + d.dot(h8.right) / z / K, 540 - d.dot(h8.upv) / z / K]; };
  // board 8's peg gradient, in image px from the capsule centre along a line 30° below the peg's axis (binned from 22 of the board's
  // pegs; 30° gives the least spread: the warm tip colour reaches further down the capsule's lower-right side)
  const PE = [[-60, '#2c0666'], [-33, '#30076e'], [-24, '#34077d'], [-15, '#3b0691'], [-6, '#4305a6'], [0, '#4905b1'], [4, '#4d06b0'], [8, '#5e10a6'], [11, '#76258f'],
    [14, '#8e3a78'], [17, '#a64e62'], [20, '#bc6450'], [23, '#cf7a40'], [26, '#de8e32'], [30, '#eaa22a'], [34, '#f3b422'], [40, '#fbc426'], [60, '#ffcc34']];
  // (fix pass: each peg is clipped at the nearest relief face under its end (a plane square to camera 8, attribute cd = its depth),
  //  so no buried part can show past a nearer relief's outline: that was the detached dark crescent at the lower-left end of 4
  //  pegs. Drawn double-sided, so where a clipped end floats over a deeper relief its inside shows as the peg's dark end colour.)
  const pegMat = new THREE.ShaderMaterial({ side: THREE.DoubleSide,
    uniforms: { pc: { value: PE.map(p => hexV3(p[1])) }, pe: { value: PE.map(p => p[0]) }, op: { value: 1 }, c8: { value: h8.pos.clone() }, f8: { value: h8.fwd.clone() } },
    vertexShader: 'attribute float ge, cd;\nvarying float vG, vCd; varying vec3 vN, vW;\n#include <common>\n#include <logdepthbuf_pars_vertex>\n' +
      'void main() { vG = ge; vCd = cd; vN = normalize(mat3(modelMatrix) * normal); vW = (modelMatrix * vec4(position, 1.0)).xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}',
    fragmentShader: `uniform vec3 pc[${PE.length}], c8, f8; uniform float pe[${PE.length}]; uniform float op;\nvarying float vG, vCd; varying vec3 vN, vW;\n#include <logdepthbuf_pars_fragment>\n` +
      `void main() { if (dot(vW - c8, f8) > vCd) discard;\n  vec3 c = pc[0]; for (int i = 0; i < ${PE.length - 1}; i++) c = mix(c, pc[i + 1], clamp((vG - pe[i]) / (pe[i + 1] - pe[i]), 0.0, 1.0));\n` +
      '  if (!gl_FrontFacing) c = pc[0] * 0.9;\n  gl_FragColor = vec4(c * (0.95 + 0.07 * normalize(vN).y), op);\n#include <logdepthbuf_fragment>\n}',
  });
  // the band: the board's 35 pegs, plus a few beyond the frame (outside the hold view by ≥ 60 px), clear of frame 9's post
  const EXTRA = [[91, -65], [215, -74], [323, -102], [-104, -150], [20, -159], [128, -187], [-228, -128], [2136, 853], [2223, 965], [2331, 937], [2294, 1061], [2418, 1052]];
  const diag = (x, y) => (0.895 * x + 0.447 * y - 164) / 1941;            // 0 at the top-left peg, 1 at the bottom-right one
  // each board peg's capsule, fitted to its outline on the board (centre px, angle°); null = a poor fit (crowded by other edges),
  // which takes its neighbours' offset from the PEGS point and angle
  const FIT = [null, null, null, null, null, null, [408.4, 287.3, 39.5], [533.6, 264.1, 34.8], null, null, [611.2, 380.1, 33.0], null, null, [965.1, 319.2, 41.6], null,
    [929.4, 441.0, 39.6], [1052.1, 433.0, 36.5], [1160.7, 405.1, 34.6], [996.4, 550.3, 39.4], [1122.0, 527.2, 38.3], [1246.5, 517.5, 36.5], [1356.1, 488.4, 33.9], [1191.1, 635.3, 36.2],
    [1317.0, 611.6, 36.6], [1442.5, 601.8, 33.7], [1554.3, 571.7, 33.3], [1385.2, 720.8, 34.7], [1509.0, 695.2, 31.7], [1643.1, 710.7, 31.7], [1749.6, 684.9, 30.9], [1588.3, 829.2, 33.9],
    [1714.5, 805.6, 30.4], [1836.3, 794.0, 33.7], [1779.9, 913.6, 32.3], [1900, 906.5, 32.3]];
  const pegs = [...PEGS.map((p, i) => [p[0], p[1], true, FIT[i]]), ...EXTRA.map(p => [p[0], p[1], false, null])].map(([px, py, onBoard, fit]) => {
    const c = fit ? [fit[0], fit[1]] : [px - 6.5, py + 9], an = (fit ? fit[2] : 37) * Math.PI / 180, u = [Math.cos(an), -Math.sin(an)], gd = [Math.cos(an - 0.524), -Math.sin(an - 0.524)];
    const T = [c[0] + 28 * u[0], c[1] + 28 * u[1]], Bp = [c[0] - 23 * u[0], c[1] - 23 * u[1]];   // (the wall entry: its ellipse reaches ~21 px further)
    const dB = reliefUnder(Bp[0], Bp[1], u), B3 = h8.at(Bp[0], Bp[1], dB), land = onBoard ? onPeg(px, py) : null;
    const axis = dT => { const a = h8.at(T[0], T[1], dT).sub(B3), L = a.length(); return { ax: a.normalize(), Lc: L }; };
    // a peg the sphere lands on gets the tip depth at which the sphere just rests on it (1.52 from its axis); at the hold its
    // image is unchanged (the tip keeps its board px), only its tilt toward the camera differs by a degree or two
    const gap = g => { const v = land.clone().sub(B3), s = Math.min(g.Lc, Math.max(0, v.dot(g.ax))); return land.distanceTo(B3.clone().addScaledVector(g.ax, s)); };
    let dT = TIP; if (land) { let lo = TIP - 0.8, hi = TIP + 2.4; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (gap(axis(m)) < 1.52) lo = m; else hi = m; } dT = (lo + hi) / 2; }
    const { ax, Lc } = axis(dT);
    // local frame: Y along the peg, X toward the board's down-right side of the capsule
    const vw = h8.right.clone().multiplyScalar(-u[1]).addScaledVector(h8.upv, -u[0]), X = vw.addScaledVector(ax, -vw.dot(ax)).normalize(), Z = X.clone().cross(ax);
    const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(X, ax, Z));
    const g = new THREE.CapsuleGeometry(R, Lc + 0.6, 8, 20); g.translate(0, (Lc + 0.6) / 2 - 0.6, 0);
    const pos = g.attributes.position, ge = new Float32Array(pos.count), P = new Vec();
    for (let i = 0; i < pos.count; i++) { P.set(pos.getX(i), pos.getY(i), pos.getZ(i)).applyQuaternion(q).add(B3); const [x, y] = toPx(P); ge[i] = (x - c[0]) * gd[0] + (y - c[1]) * gd[1]; }
    g.setAttribute('ge', new THREE.BufferAttribute(ge, 1)); g.setAttribute('cd', new THREE.BufferAttribute(new Float32Array(pos.count).fill(dB + 0.003), 1));
    const mesh = new THREE.Mesh(g, pegMat); mesh.position.copy(B3); mesh.quaternion.copy(q); mesh.frustumCulled = false; V.scene.add(mesh);
    const k = diag(px, py);
    return { px, py, onBoard, mesh, B3, ax, q, Lc, hits: [], land, kx: new Vec().crossVectors(ax, UP).normalize(),
      tIn: 25.75 + 1.75 * cl(k), tOut: 30.4 + 1.8 * cl(k) };
  });
  // the sphere's hits, read from its own path (so they follow any change to the hop timing): it lands exactly on onPeg points
  let hitsFound = false;
  const findHits = () => { const ba = window.v2 && window.v2.ballAt; if (!ba) return; hitsFound = true;
    const P = new Vec(), last = new Map();
    for (let t = 25.6; t < 31.9; t += 1 / 240) { P.fromArray(ba(t));
      for (const p of pegs) if (p.land && P.distanceTo(p.land) < 0.05 && !(last.get(p) > t - 0.15)) { p.hits.push(t); last.set(p, t); } } };
  const pop = ez('back.out(1.7)'), dive = ez('power2.in'), qf = new THREE.Quaternion();
  anim(t => {
    if (!hitsFound) findHits();
    for (const p of pegs) {
      const kin = pop(cl((t - p.tIn) / 0.38)), kout = dive(cl((t - p.tOut) / 0.32)), k = kin * (1 - kout);
      p.mesh.visible = k > 0.002;
      if (!p.mesh.visible) continue;
      // flex: the hit pushes the tip down, then it springs back (a damped wobble about its base)
      let th = 0; for (const h of p.hits) { const x = t - h; if (x > 0 && x < 0.9) th -= 0.13 * Math.exp(-x / 0.16) * Math.sin(2 * Math.PI * x / 0.21); }
      p.mesh.quaternion.copy(p.q); if (th) p.mesh.quaternion.premultiply(qf.setFromAxisAngle(p.kx, th));
      p.mesh.position.copy(p.B3).addScaledVector(p.ax, -(1 - k) * (p.Lc + R + 0.7));   // slides out of (and back into) the wall
    }
  });
  function anim(fn) { V.anim(fn); }
};
