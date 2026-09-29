/* Frame 14 · low, looking up the hill: the sphere comes from the top right, rolls down toward the camera and stops (G3, called from
   g3.js with its context G). Built (batch 3): the real set, no plate.
   · The reading. Board 14's diagonals (the band's far edge, the rail's foot, the band's near edge) are parallel on screen and
     never meet, so from the approved hold camera they can only be lines of constant depth on one plane. That plane is the
     HILL: a wide ramp banked 30° (rising to the camera's right) that contains the sphere's own straight run down the slope
     (the route and camera are unchanged). The band is the strip of it between depth 17 (far edge) and 8 (near edge); the
     sphere crosses exactly that strip during the hold. It is one solid wedge on the floor: its lower-left edge lies on the
     floor, its far edge rises to ~11 u above it at the right, its right side and far side drop vertically to the floor.
   · Colour: the hill's top takes board 14's colours as a smooth field in the ramp's own plane coordinates (fitted to the
     board, text and pictures masked): the dark red-orange far edge → light orange near edge (the band), a crisp change at
     the near edge to the pink / magenta / orange lower part. Living: the field slides slowly, locked to the board at the
     key instant.
   · The lane. The sphere lands from its leap well up the hill, so a narrow lane (a tongue of the same banked plane) runs from
     the far edge up past the landing point, through the tall ∩ arch (ring 1). At the hold it is coloured exactly like the
     lighter violet arch behind it (region 2), from where it sits in the hold view, so the held frame is board 14; in the
     moves it reads as a violet lane coming out of the arches.
   · Board shapes as pieces (flat at the hold, chunky sides and parallax while moving), each coloured by a field fitted to
     the board: the lavender rail standing on the hill along its far right edge, the tall violet ∩ (ring 1) over the lane,
     the lighter violet arch inside it (region 2), the dark indigo panel and the orange → magenta pillar on the left, the
     dark disc and the pale block in the top-left corner (behind the copy box), and a backdrop (violet → magenta). Legs and
     panels run on down well below the hill, so no piece shows a bottom edge in the moves. Depth order (from camera 14):
     rail 14 (standing on the hill), hill far edge 17, ring 1 20, panel 23.5, pillar 27, region 2 35, corner shapes 43–44,
     backdrop 95. The pieces drift a few px during the hold; region 2 is 10 px bigger than ring 1's opening so no crescent
     opens inside the ring.
   · The sphere's shadow: a crisp ellipse on the hill (fitted to the board's: black at the sphere's lower left, fading to a
     faint brown tip behind its lower right), riding with the sphere while it is on the hill round the hold.
   · Floor: a pad round the hill's foot (magenta → violet, its edges fading out) the sphere runs out onto; it lies 0.01 over
     frame 15's ledge and covers it until it dissolves (62.95–63.45) as frame 15 takes over.
   · In: as the camera swoops down from the aerial (while frame 13's set clears), the lane rises under the leaping sphere,
     region 2, the pillar, the panel and ring 1 rise into place behind it (the camera flies back over ring 1, which comes up
     into view from below and frames the sphere as it rolls through), the hill (unseen until ~58.9) is in by then, and the
     rail rises out of the hill as the camera levels out.
   · (revision, user 2026-09-27: the sphere "slow[s] to a stop in the middle of the ramp and then decide[s] to go down to the
     left on the ramp … The bottom of the ramp will be the entrance to frame 15 … you don't need to disappear the hill ramp that
     the sphere is on. I want you to keep it there so it makes sense.") The sphere stops on its board spot (arrives 60.45, still
     60.75–61.25 (review fix: was 0.2 s); the key instant 60.95 is in the stop) and then rolls down-left along the band (e1, parallel to the band's edges on screen) to the
     hill's foot (~62.6), where frame 15's ramp (f15's ledge) carries on and curves round into frame 15. Its shadow rides
     with it down the band. The hill, the lane and the rail stay to the cut; the other shapes sink away as the camera comes
     round (from 61.9), and the floor dissolves as frame 15 takes over. */
export default (V, G) => {
  const { THREE, h14: H, M14, a20, foot } = G;
  const { anim } = V;
  const SH = V.S, Vec = THREE.Vector3;
  const TK = H.tk, cam = H.pos, fwd = H.fwd, rgt = H.right, upv = H.upv, tanV = H.tanV;
  const sm = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
  const ez = n => gsap.parseEase(n);

  /* ---------- the hold camera's projection ---------- */
  const hc = new THREE.PerspectiveCamera(H.fov, 16 / 9, 0.05, 2000);
  hc.matrixAutoUpdate = false; hc.matrixWorld.makeBasis(rgt, upv, fwd.clone().negate()).setPosition(cam);
  hc.matrixWorldInverse.copy(hc.matrixWorld).invert(); hc.updateProjectionMatrix();
  const HVP = new THREE.Matrix4().multiplyMatrices(hc.projectionMatrix, hc.matrixWorldInverse);
  const rayOf = (px, py) => fwd.clone().addScaledVector(rgt, (px - 960) / 540 * tanV).addScaledVector(upv, (540 - py) / 540 * tanV);

  /* ---------- board 14's lines (board px), measured ---------- */
  const L1 = x => 1076 - 0.5795 * (x - 10);                            // the band's far edge (left of the sphere; runs on behind it)
  const L1r = x => 298 - 0.578 * (x - 1450);                           // the rail's foot (right of the sphere)
  const L2 = x => 1067 - 0.5825 * (x - 530);                           // the band's near edge (band / pink)
  const RT = x => 128 - 0.575 * (x - 1380);                            // the rail's top

  /* ---------- the hill's plane Q: contains the sphere's contact line, banked 30° (rising to the camera's right) ---------- */
  const n0 = new Vec(0, Math.cos(a20), -Math.sin(a20)), dUp = new Vec(0, Math.sin(a20), Math.cos(a20));   // P's normal, uphill
  const BANK = -30 * Math.PI / 180;
  const nQ = n0.clone().multiplyScalar(Math.cos(BANK)).add(new Vec().crossVectors(dUp, n0).multiplyScalar(Math.sin(BANK)));
  // (fix pass: the plane through M14 − n0 sat only cos 30° = 0.87 from the sphere's centre, so it cut 0.13 R into the sphere
  //  (a straight chord across its lower right, all through the hill run). It now passes through M14 − nQ: tangent to the
  //  sphere along the whole straight run (dUp lies in it). The old plane is parallel to it, so the hold camera maps one onto
  //  the other by a scaling about the camera (QS); the colour field (fitted in the old plane's coordinates) and the shadow
  //  are mapped through it, so the held frame keeps exactly the board colours it had.)
  const p0c = M14.clone().sub(n0);                                     // the old plane's origin (the colour fit's coordinates)
  const p0 = M14.clone().sub(nQ);                                      // the contact point at the key instant (tangent)
  const QS = p0.clone().sub(cam).dot(nQ) / p0c.clone().sub(cam).dot(nQ);   // old plane → new plane, scaling about the hold camera
  const e1 = new Vec().crossVectors(fwd, nQ).normalize(), e2 = new Vec().crossVectors(nQ, e1);   // e1: along the board's diagonals
  const hitQ = (px, py) => { const r = rayOf(px, py), k = p0.clone().sub(cam).dot(nQ) / r.dot(nQ); return cam.clone().addScaledVector(r, k); };
  const stOf = P => { const d = P.clone().sub(p0); return [d.dot(e1), d.dot(e2)]; };
  const hitQc = (px, py) => { const r = rayOf(px, py), k = p0c.clone().sub(cam).dot(nQ) / r.dot(nQ); return cam.clone().addScaledVector(r, k); };
  const stOfC = P => { const d = P.clone().sub(p0c); return [d.dot(e1), d.dot(e2)]; };
  const FLOOR = foot.y - 1;                                            // floor surface (the sphere runs out onto it at the foot)

  /* ---------- colour fields: smooth polynomials fitted to board 14 (least squares; text, pictures, sphere and shadow
     masked). Board-px fields for the pieces; the hill's two in its plane coordinates (s along e1, t along e2 from p0).
     T lists the terms u^i·v^j as 'ij' pairs (u, v: 0–1 across the box, clamped), c their RGB coefficients (0–255). ---------- */
  const FIT = {
    bg: {"box": [4, 4, 1595, 655], "T": "0010200102", "c": [[85.08, 4.01, 202.53], [-33.83, 45.41, 186.26], [173.12, 16.02, -195.59], [-30.58, -11.25, 57.79], [81.13, 48.73, -109.63]]},
    disc: {"box": [4, 7, 465, 279], "T": "0001", "c": [[72.63, 8.72, 203.14], [-5.36, -1.41, -27.5]]},
    lrect: {"box": [280, 4, 420, 27], "T": "000110", "c": [[118.1, 53.42, 252.87], [14.85, 14.72, 13.38], [-44.68, -50.59, -29.92]]},
    pillar: {"box": [540, 4, 735, 279], "T": "000102", "c": [[247.72, 134.75, 46.67], [-72.31, -112.98, 144.67], [-11.95, 28.28, -16.79]]},
    panel: {"box": [4, 280, 735, 1075], "T": "000102101120", "c": [[78.23, 5.86, 181.94], [-25.0, -11.57, 21.24], [25.89, 11.86, -21.89], [-46.8, -0.19, -94.04], [22.11, 9.15, -16.42], [7.8, 2.55, 2.53]]},
    ring1: {"box": [808, 25, 1373, 613], "T": "000102101120", "c": [[112.5, 19.31, 243.95], [84.03, 70.48, -149.63], [8.99, 1.94, -4.21], [-4.44, -0.3, -2.28], [-5.6, -9.13, 6.94], [7.29, 2.35, -1.32]]},
    reg2: {"box": [933, 150, 1153, 541], "T": "000110", "c": [[118.28, 33.82, 278.35], [50.66, 34.74, -102.66], [40.95, 16.65, -49.71]]},
    rail: {"box": [1349, 4, 1915, 303], "T": "000102101120", "c": [[209.41, 104.82, 165.78], [-19.03, 91.93, 98.44], [20.14, -15.66, -17.03], [-101.63, -85.56, -11.24], [70.17, -94.85, -217.32], [8.62, 12.84, 95.27]]},
    Qband: {"box": [-9.782, -3.388, 5.1062, 5.5208], "T": "000102101120", "c": [[269.1, 201.78, 90.85], [-60.91, -165.66, -78.29], [12.99, 58.69, 45.57], [-19.57, -84.91, -57.26], [-1.38, 38.71, 45.18], [-15.19, 0.1, 25.13]]},
  };
  const f1 = x => (Math.abs(x) < 1e-9 ? 0 : x).toFixed(4);
  const glslFit = name => { const F = FIT[name], [x0, y0, x1, y1] = F.box, terms = [], u0 = (F.uMin ?? 0).toFixed(3);
    for (let k = 0; k < F.T.length / 2; k++) { const i = +F.T[2 * k], j = +F.T[2 * k + 1], c = F.c[k];
      const m = [...Array(i).fill('u'), ...Array(j).fill('v')].join(' * ');
      terms.push(`vec3(${c.map(f1).join(', ')})${m ? ' * ' + m : ''}`); }
    return `vec3 f_${name}(vec2 b) { vec2 q = clamp((b - vec2(${f1(x0)}, ${f1(y0)})) / vec2(${f1(x1 - x0)}, ${f1(y1 - y0)}), vec2(${u0}, 0.0), vec2(1.0)); float u = q.x, v = q.y;\n  return clamp((${terms.join(' + ')}) / 255.0, 0.0, 1.0); }\n`; };

  // the hill's lower part (below the band's near edge): along that edge magenta (left) → coral → pink (right), turning
  // orange toward the camera (knots and blend fitted to the board in plane coordinates; under the picture box it is interpolated)
  const hexC = h => { const n = parseInt(h.slice(1), 16); return `vec3(${((n >> 16 & 255) / 255).toFixed(4)}, ${((n >> 8 & 255) / 255).toFixed(4)}, ${((n & 255) / 255).toFixed(4)})`; };
  const stopsFn = (name, st) => `vec3 ${name}(float v) { vec3 c = ${hexC(st[0][1])};\n` +
    st.slice(1).map(([v, h], i) => `  c = mix(c, ${hexC(h)}, smoothstep(${st[i][0].toFixed(2)}, ${v.toFixed(2)}, v));`).join('\n') + '\n  return c; }\n';
  const PINK_GLSL = stopsFn('pinkEdge', [[-4.3, '#7b2dae'], [-2.9, '#cf6046'], [0.3, '#f65367'], [2.1, '#e84793']]) +
    // …and past the frame's bottom edge (never seen at the hold) on toward the floor: coral pink, then magenta at the foot
    `vec3 f_Qpink(vec2 q) { vec3 c = mix(pinkEdge(q.x), ${hexC('#ff7a00')}, 1.0 - smoothstep(-8.4, -4.8, q.y));
  c = mix(c, ${hexC('#ec4f6c')}, 1.0 - smoothstep(-12.5, -8.5, q.y));
  return mix(c, ${hexC('#b0338c')}, 1.0 - smoothstep(-18.5, -13.5, q.y)); }\n`;

  /* ---------- pieces for hold 14: flat at the hold, board-field colour, living slide locked to the key instant ---------- */
  // flat at the hold: the back face is pushed out along the hold camera's view rays (as g2.js / f13.js)
  const flatGeo = (g, at, d) => { const p = g.attributes.position; g.computeBoundingBox(); const zb = g.boundingBox.min.z; if (zb > -1e-6) return g;
    const tt = -zb * d * tanV / 540;
    for (let i = 0; i < p.count; i++) if (p.getZ(i) < zb / 2) { const x = p.getX(i), y = p.getY(i); p.setXY(i, x + (at[0] - 960 + x) * tt / d, y + (540 - at[1] + y) * tt / d); }
    p.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingBox(); return g; };
  const hook = (m, head, body) => { const fs = m.fragmentShader.replace('#include <logdepthbuf_pars_fragment>', '#include <logdepthbuf_pars_fragment>\n' + head)
      .replace('gl_FragColor = vec4(col * shade, op);', body);
    if (fs === m.fragmentShader) throw new Error('f14: engine shader changed; the board fields could not hook it');
    m.fragmentShader = fs; m.needsUpdate = true; return m; };
  const PC = (spec, field, sd = [14, 10], noShade = false) => {
    const pc = V.piece({ hold: 14, drift: 0, ...spec });
    flatGeo(pc.mesh.geometry, spec.at, spec.depth);
    const m = pc.mesh.material;
    m.uniforms.ban = { value: new THREE.Vector2(...spec.at) };
    m.uniforms.bsd = { value: new THREE.Vector2(...sd) };
    m.uniforms.bT = { value: TK };
    hook(m, 'uniform vec2 ban, bsd; uniform float bT;\n' + glslFit(field),
      `vec2 bp = vec2(ban.x + vO.x, ban.y - vO.y) + bsd * min(flow, 1.6) * (sin((t - bT) * spd / per * 6.2832 + ph) - sin(ph));
  gl_FragColor = vec4(f_${field}(bp) * ${noShade ? '1.0' : 'shade'}, op);`);
    return pc;
  };
  // rise into place from below (board px, +y = down) and sink away again; op snaps in / out at the far ends only
  const riseSink = (inT, dyIn, outT, dyOut) => { const k = { y: [[inT[0], dyIn], [inT[1], 0, 'expo.out']], op: [[inT[0], 0], [inT[0] + 0.08, 1]] };
    if (outT) { k.y.push([outT[0], 0], [outT[1], dyOut, 'power2.in']); k.op.push([outT[1] - 0.1, 1], [outT[1], 0]); }
    return k; };

  /* ---------- the backdrop and the pieces (back to front) ---------- */
  // (fix pass 2: 61.9, was 61.6: the set stays 0.3 s longer as the camera swings away, so the frame isn't bare hill at 61.6–62.2)
  // (revision: the sphere leaves its stop at 61.05 and the camera comes round from ~61.6; the backdrop goes 62.3–63.1)
  const OUT0 = 61.9;
  const backdrop = PC({ shape: SH.rr(1920 * 5, 1080 * 5, 0), at: [960, 540], depth: 95, thick: 0,
    keys: { op: [[56.9, 0], [57.7, 1, 'sine.inOut'], [62.0, 1], [62.55, 0, 'sine.inOut']] } }, 'bg', [30, 16], true);   // (review fix: gone by 62.55 (was 62.3–63.1): half-faded, it lay as a translucent slab over the ramp beside the orbit)   // (fix pass 2: unshaded: seen at a grazing angle in the swoop (57.8–58.3) the side shade turned it a dull rose-brown)
  backdrop.mesh.renderOrder = -3;
  // the top-left corner, behind the copy box: the dark disc and the pale block above it
  PC({ shape: SH.disc(397), at: [330, 400], depth: 44, thick: 1.6, drift: 3, keys: riseSink([57.2, 57.95], 900, [OUT0 + 0.05, OUT0 + 0.75], 1100) }, 'disc', [10, 10]);
  PC({ shape: SH.rr(140, 300, 50), at: [350, -110], depth: 43.2, thick: 1.2, drift: 3, keys: riseSink([57.3, 58.0], 900, [OUT0 + 0.05, OUT0 + 0.75], 1100) }, 'lrect', [8, 8]);
  // region 2: the lighter violet ∩ inside ring 1 (the lane runs up toward it; it rises once the sphere has leapt past). Its
  // outline is 10 px bigger than ring 1's opening, so the pieces' few-px drift never opens a crescent inside the ring
  const reg2 = PC({ shape: SH.archFill(420, 1260), at: [1133, 1400], depth: 35, thick: 1.4, drift: 3, keys: riseSink([56.95, 57.75], 1250, [OUT0 + 0.25, OUT0 + 1.0], 1300) }, 'reg2', [10, 14]);
  // the orange → magenta pillar (rounded top, its lower part behind the panel) and the dark indigo panel in front of it
  PC({ shape: SH.archFill(240, 1400), at: [615, 1400], depth: 27, thick: 1.4, drift: 3, keys: riseSink([57.15, 57.85], 1300, [OUT0, OUT0 + 0.7], 1400) }, 'pillar', [0, 14]);
  PC({ shape: SH.rr(1535, 1120, 0), at: [735 - 1535 / 2, 840], depth: 23.5, thick: 1.3, drift: 3, keys: riseSink([57.25, 57.95], 1100, [OUT0 + 0.1, OUT0 + 0.8], 1300) }, 'panel', [16, 8]);
  // ring 1: the tall violet ∩ (outer r 325, inner r 200 about (1133, 350)); the lane passes through it
  // (review fix: it sinks 61.85–62.4 (was 62.05–62.75): the camera, low at the hill's foot at 62.6–62.7, saw its two legs
  //  hanging below the floor past the pad's faded edge)
  const ring1 = PC({ shape: SH.arch(650, 1375, 125), at: [1133, 1400], depth: 20, thick: 0.9, drift: 3, keys: riseSink([57.3, 57.95], 1400, [OUT0 - 0.05, OUT0 + 0.5], 1500) }, 'ring1', [0, 16]);
  // the lavender rail, standing on the hill along its far right edge (its foot runs 40 px into the hill); it rises out of
  // the hill as the camera levels out, and sinks back in after the hold
  // (fix pass: the rail's left end showed beside the small, far sphere at the start of the hold (59.6–60.0, before the sphere
  //  passes in front of it) as a hard, pale vertical edge: the colour fit ran on past its box there and went blue-lavender. The
  //  fit is now held at its colour 90 px in (the board's lilac-pink), the end sits at x 1330 and its top corner is rounded.)
  FIT.rail.uMin = 0.16;
  const railPts = (() => { const X = 1330, C = [X, RT(X)], d = 46, tl = Math.hypot(1, 0.575), P1 = [X, C[1] + d], P2 = [X + d / tl, C[1] - 0.575 * d / tl], arc = [];
    for (let i = 0; i <= 12; i++) { const u = i / 12, a = (1 - u) ** 2, b = 2 * u * (1 - u), c = u * u; arc.push([a * P1[0] + b * C[0] + c * P2[0], a * P1[1] + b * C[1] + c * P2[1]]); }
    return [...arc, [2150, RT(2150)], [2150, L1r(2150) + 40], [X, L1r(X) + 40]]; })();
  const rail = PC({ shape: SH.poly(railPts, [1320, 300]), at: [1320, 300], depth: 14.0, thick: 0.35, drift: 2, keys: riseSink([58.45, 59.1], 270) }, 'rail', [18, 6]);                // (revision: it stays, with the hill)

  /* ---------- the hill: one solid wedge (top in Q; far and right sides vertical, down to the floor) ---------- */
  const F0 = hitQ(0, L1(0)), F1 = hitQ(1150, L1(1150)), eF = F1.clone().sub(F0).normalize();
  const A = F0.clone().addScaledVector(eF, (FLOOR - F0.y) / eF.y);          // far edge meets the floor (left, off frame)
  const B = hitQ(2150, L1(2150));                                           // far edge, right end (past the frame, behind the rail)
  // the near-right corner: on the floor line (Q ∩ floor), 2.6 u to the sphere's right of the foot, so the whole run down to
  // the floor is on the hill; the right side B → Gc stays right of the frame at the hold
  const dirF = new Vec().crossVectors(nQ, new Vec(0, 1, 0)).normalize(), footC = p0.clone().addScaledVector(dUp, (FLOOR - p0.y) / dUp.y);
  const Gc = footC.clone().addScaledVector(dirF, -2.6 / Math.abs(dirF.x));
  const Bf = new Vec(B.x, FLOOR, B.z);
  const tri = (list, pts) => { for (const p of pts) list.push(p.x, p.y, p.z); };
  const geoOf = (pts, nrm) => { const g = new THREE.BufferGeometry(), pos = [], nor = [];
    tri(pos, pts); for (let i = 0; i < pts.length; i++) nor.push(nrm.x, nrm.y, nrm.z);
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); return g; };
  const faceN = (a, b, c) => new Vec().crossVectors(b.clone().sub(a), c.clone().sub(a)).normalize();
  // the band / pink boundary (board line 2) in plane coordinates: t = l2a + l2b·s
  // (in the old plane's coordinates, like the colour fit)
  const [s2a, t2a] = stOfC(hitQc(530, L2(530))), [s2b, t2b] = stOfC(hitQc(1900, L2(1900))), l2b = (t2b - t2a) / (s2b - s2a), l2a = t2a - l2b * s2a;
  // top: the engine's gradient shader, re-pointed at the plane fields; faces keep the board colour (no shading). A point is
  // taken back to the old plane through the hold camera (qcam, 1 / QS) before its plane coordinates are read.
  const topMat = hook(V.mat(['#ff8a2a'], { flat: true, side: THREE.DoubleSide }),
    `uniform vec3 qp0, qe1, qe2, qcam; uniform vec2 qsl; uniform float bT, l2a, l2b, qis;\n${glslFit('Qband')}${PINK_GLSL}`,
    `vec3 qo = qcam + (vO - qcam) * qis;
  vec2 q = vec2(dot(qo - qp0, qe1), dot(qo - qp0, qe2));
  vec2 qs = q + qsl * min(flow, 1.6) * (sin((t - bT) * spd / per * 6.2832 + ph) - sin(ph));
  float l2 = l2a + l2b * q.x, w2 = fwidth(q.y) * 0.8 + 1e-4;
  gl_FragColor = vec4(mix(f_Qpink(qs), f_Qband(qs), smoothstep(l2 - w2, l2 + w2, q.y)), op);`);
  Object.assign(topMat.uniforms, { qp0: { value: p0c.clone() }, qcam: { value: cam.clone() }, qis: { value: 1 / QS }, qe1: { value: e1.clone() }, qe2: { value: e2.clone() }, qsl: { value: new THREE.Vector2(0.55, 0.22) }, bT: { value: TK }, l2a: { value: l2a }, l2b: { value: l2b } });
  topMat.extensions = { derivatives: true };
  const hillTop = new THREE.Mesh(geoOf([A, Gc, B], nQ), topMat);
  // (fix pass 2: board-derived colours: magenta at the floor, pink, up to the band's red-orange at its top edge. The dark plum →
  //  maroon → rust read as muddy rose-brown planes filling half the frame in the swoop, 57.6–58.3)
  const sideMat = V.mat(['#9a2f98', '#df4d6e', '#ee5f2c'], { axis: [0, 1, 0], lo: FLOOR, hi: B.y, side: THREE.DoubleSide });
  const hillFar = new THREE.Mesh(geoOf([A, B, Bf], faceN(A, B, Bf).multiplyScalar(faceN(A, B, Bf).z > 0 ? 1 : -1)), sideMat);
  const hillRight = new THREE.Mesh(geoOf([B, Gc, Bf], faceN(B, Gc, Bf).multiplyScalar(faceN(B, Gc, Bf).x < 0 ? 1 : -1)), sideMat);
  const hill = [hillTop, hillFar, hillRight];
  for (const me of hill) { me.frustumCulled = false; V.scene.add(me); }

  /* ---------- the lane: a tongue of the hill's plane from its far edge up past the landing point, through ring 1 ---------- */
  const WL = 1.1, TH = 0.5;
  const wq = new Vec().crossVectors(nQ, dUp).normalize();                   // across the lane, in Q
  // where the line p0 + a·dUp + b·wq meets the far edge (2D, in plane coordinates)
  const [fs0, ft0] = stOf(F0), [fs1, ft1] = stOf(F1), [ds, dt] = [dUp.dot(e1), dUp.dot(e2)], [ws, wt] = [wq.dot(e1), wq.dot(e2)];
  const aFar = b => { const ex = fs1 - fs0, ey = ft1 - ft0, ox = b * ws - fs0, oy = b * wt - ft0; return (ex * oy - ey * ox) / (ey * ds - ex * dt); };
  const zTop = 68.8, aTop = (zTop - p0.z) / dUp.z;
  const LP = (a, b, h = 0) => p0.clone().addScaledVector(dUp, a).addScaledVector(wq, b).addScaledVector(nQ, -h);
  const laneGeo = (() => { const q = [[aFar(-WL), -WL], [aFar(WL), WL], [aTop, WL], [aTop, -WL]], pos = [], nor = [];
    const quad = (P, N) => { if (new Vec().crossVectors(P[1].clone().sub(P[0]), P[2].clone().sub(P[0])).dot(N) < 0) P = [P[0], P[3], P[2], P[1]];   // wind outward
      tri(pos, [P[0], P[1], P[2], P[0], P[2], P[3]]); for (let i = 0; i < 6; i++) nor.push(N.x, N.y, N.z); };
    const top = q.map(([a, b]) => LP(a, b)), bot = q.map(([a, b]) => LP(a, b, TH));
    quad(top, nQ); quad([bot[3], bot[2], bot[1], bot[0]], nQ.clone().negate());
    quad([top[1], bot[1], bot[2], top[2]], wq); quad([top[3], bot[3], bot[0], top[0]], wq.clone().negate());   // the two sides
    quad([top[2], bot[2], bot[3], top[3]], dUp);                                                              // the top end
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); return g; })();
  // colour: region 2's field at the board px where each point sits in the hold view, with region 2's own slide, so at the
  // hold it is indistinguishable from the arch behind it; faces turned away from the hold camera are shaded
  const laneMat = hook(V.mat(['#9632ed'], { flat: true, side: THREE.FrontSide }),   // (front faces only: no back face at its silhouette)
    `uniform mat4 hvp; uniform vec3 hcam; uniform vec2 bsd; uniform float bT;\n${glslFit('reg2')}`,
    `vec4 hq = hvp * vec4(vO, 1.0);
  vec2 bp = vec2((hq.x / hq.w * 0.5 + 0.5) * 1920.0, (0.5 - 0.5 * hq.y / hq.w) * 1080.0) + bsd * min(flow, 1.6) * (sin((t - bT) * spd / per * 6.2832 + ph) - sin(ph));
  vec3 nb = normalize(vN);
  float vis = smoothstep(-0.03, 0.0, dot(nb, normalize(hcam - vO)));   // (any face the hold camera sees, even grazing: full colour)
  gl_FragColor = vec4(f_reg2(bp) * mix(0.7 + 0.12 * nb.y, 1.0, vis), op);`);
  { const ru = reg2.mesh.material.uniforms;
    Object.assign(laneMat.uniforms, { hvp: { value: HVP }, hcam: { value: cam.clone() }, bsd: ru.bsd, bT: ru.bT, per: ru.per, ph: ru.ph }); }
  const lane = new THREE.Mesh(laneGeo, laneMat); lane.frustumCulled = false; V.scene.add(lane);

  /* ---------- the floor: a pad round the hill's foot the sphere runs out onto (magenta at the foot → violet), its
     edges fading out, so no floor edge cuts across any view ---------- */
  const fc = p0.clone().addScaledVector(dUp, (FLOOR - p0.y) / dUp.y);          // where the contact line meets the floor
  const floorMat = hook(V.mat(['#b8378a', '#7a22b8', '#4a12a0'], { rc: fc.toArray(), rad: 24, side: THREE.DoubleSide, op: 0.999 }),
    'uniform vec3 pc; uniform vec2 pr;\n',
    'gl_FragColor = vec4(col, op * (1.0 - smoothstep(pr.x, pr.y, length(vO.xz - pc.xz))));');
  Object.assign(floorMat.uniforms, { pc: { value: fc.clone().add(new Vec(-2, 0, -5)) }, pr: { value: new THREE.Vector2(12, 22) } });
  floorMat.transparent = true; floorMat.depthWrite = false;
  const floorG = new THREE.PlaneGeometry(48, 48, 1, 1); floorG.rotateX(-Math.PI / 2); floorG.translate(fc.x - 2, FLOOR + 0.01, fc.z - 5);   // (0.01 up: frame 15's ledge top is at the floor, under it)
  // (drawn after frame 15's ledge, which lies at the floor under it: it covers the ledge until it dissolves)
  const floor = new THREE.Mesh(floorG, floorMat); floor.renderOrder = 4; floor.frustumCulled = false; V.scene.add(floor);

  /* ---------- the sphere's shadow on the hill (board: a crisp ellipse, black at the sphere's lower left fading to a faint brown tip
     behind its lower right) ---------- */
  // measured on the hill's plane at the key instant (ellipse fitted to the board's shadow outline, relative to the contact)
  const SHC = [0.442, -0.265], SHA = 0.811, SHB = 1.381, SHT = -16.7 * Math.PI / 180;   // centre (s, t), semi-axes, turn (fitted, faint tail included)
  const shV = '#include <common>\n#include <logdepthbuf_pars_vertex>\nvarying vec3 vO;\nvoid main() { vO = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}';
  const shF = `uniform float op;\nvarying vec3 vO;\n#include <logdepthbuf_pars_fragment>
void main() { float g = dot(vO.xy, vec2(0.995, 0.1)), r = length(vO.xy), e = 1.0 - smoothstep(0.955, 1.0, r);
  gl_FragColor = vec4(0.02, 0.006, 0.01, op * e * mix(0.92, 0.1, smoothstep(-1.1, 1.1, g)));   // darkens the hill like the board: ×0.1 at the lower left → ×0.9 at the tip
#include <logdepthbuf_fragment>\n}`;
  const shMat = new THREE.ShaderMaterial({ uniforms: { op: { value: 0 } }, vertexShader: shV, fragmentShader: shF, transparent: true, depthWrite: false,
    polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 });
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(1, 96), shMat); shadow.renderOrder = 1; shadow.frustumCulled = false; V.scene.add(shadow);
  const shU = e1.clone().multiplyScalar(Math.cos(SHT)).addScaledVector(e2, Math.sin(SHT)), shW = e1.clone().multiplyScalar(-Math.sin(SHT)).addScaledVector(e2, Math.cos(SHT));
  shadow.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(shU, shW, nQ)); shadow.scale.set(SHA, SHB, 1);

  /* ---------- timing: build in / out ---------- */
  const LANE_IN = [56.75, 57.3], HILL_IN = [57.2, 57.9], LANE_OUT = [67, 67.1], HILL_OUT = [67, 67.1], FLOOR_T = [56.9, 57.6, 62.95, 63.45];   // (integration: the floor is gone as frame 15's ledge starts its switch (63.45), so the two changes don't overlap)
  const eIn = ez('expo.out'), eOut = ez('power2.in');
  anim((t, b) => {
    // the lane rises (world y) under the leaping sphere; sinks after the hold
    const lu = Math.min(1, Math.max(0, (t - LANE_IN[0]) / (LANE_IN[1] - LANE_IN[0]))), lo = Math.min(1, Math.max(0, (t - LANE_OUT[0]) / (LANE_OUT[1] - LANE_OUT[0])));
    lane.visible = t > LANE_IN[0] && t < LANE_OUT[1];
    lane.position.y = -9 * (1 - eIn(lu)) - 10 * eOut(lo);
    // the hill: in (unseen) before the camera levels out; sinks into the floor once the sphere has run off it
    const hu = Math.min(1, Math.max(0, (t - HILL_IN[0]) / (HILL_IN[1] - HILL_IN[0]))), ho = Math.min(1, Math.max(0, (t - HILL_OUT[0]) / (HILL_OUT[1] - HILL_OUT[0])));
    for (const me of hill) { me.visible = t > HILL_IN[0] && t < HILL_OUT[1]; me.position.y = -14 * (1 - eIn(hu)) - 13 * eOut(ho); }
    // the floor fades in with the set and dissolves as frame 15 takes over
    const fa = Math.min(sm((t - FLOOR_T[0]) / (FLOOR_T[1] - FLOOR_T[0])), 1 - sm((t - FLOOR_T[2]) / (FLOOR_T[3] - FLOOR_T[2])));
    floor.visible = fa > 0.003; floorMat.uniforms.op.value = fa;
    // the shadow rides with the sphere's contact on the hill, near the hold
    // (fix pass 2: on down the hill until the sphere reaches the floor; frame 15's ledge shadow takes over from there)
    // (revision: the sphere now runs down the band and reaches the hill's foot at ~62.55)
    const so = Math.min(sm((t - 59.4) / 0.2), 1 - sm((t - 62.35) / 0.25));   // (review fix: it reaches the foot at ~62.6 now)
    shadow.visible = so > 0.003 && !b.h;
    // (the ellipse was fitted on the old plane; it is carried onto the tangent plane through the hold camera, so at the hold
    //  it covers the same board px)
    // (revision: once the sphere sets off down the band (61.05) and the camera leaves the board's view, the board's long
    //  offset shadow draws in under it, to a round contact shadow by ~61.8, so it doesn't read as detached from other angles)
    if (shadow.visible) { const c = b.p.clone().sub(n0).addScaledVector(e1, SHC[0]).addScaledVector(e2, SHC[1]), kk = sm((t - G.GO - 0.05) / 0.7);   // (from its GO)
      shadow.position.copy(cam).addScaledVector(c.sub(cam), QS).lerp(b.p.clone().addScaledVector(nQ, -1), kk).addScaledVector(nQ, 0.012);
      shadow.scale.set(SHA * QS + (0.95 - SHA * QS) * kk, SHB * QS + (0.95 - SHB * QS) * kk, 1); shMat.uniforms.op.value = so; }
  });

  V.unplate(14);
};
