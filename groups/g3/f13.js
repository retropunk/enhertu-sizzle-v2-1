/* Frame 13 · the aerial view into a pipe cut in half: the sphere rolls round the U-bend channel (G3, called from g3.js with
   its context G). Built (batch 3): the real set, no plate.
   · The pipe is real 3D: a pipe cut in half along its axis, laid along the sphere's own path (the axis at the sphere's
     centre height; outer radius 1, so the channel is exactly one sphere wide, as board 13's band is; a 0.16 wall, so the
     sphere sits a little into it). It starts on the floor of frame 12's open channel, where the channel's walls slope
     away (review fix: it used to start with a short closed ring that floated over the tunnel's end), and runs straight to the U-bend, round it, and down the right leg to an open end, where the sphere leaps off
     onto frame 14's hill. From the aerial hold camera the cut rims sit at the sphere's centre height, so the channel is
     board 13's ∩ band at its place and size (edges within ~10 px; the path itself sits ~5 px right of the board's band).
   · Colour: every pipe surface takes board 13's band colour from where it sits in the hold view (a smooth field fitted to
     the board, in board px): the board's peach → orange band, surface for surface. Below the board it runs on as a deeper
     orange back to the tunnel. It always has form (revision: the user wants the rimmed edges seen at the key moment too,
     never blended to a flat U): the underside and outer walls shade darker, the channel's walls darken toward the rims
     and the flat cut faces (rims, end sections) turn paler, so it reads as a pipe cut open rather than a solid bar.
     The colours flow slowly along the band (living), exactly on the board at the key instant.
   · Build: as the camera cranes up over frame 12's tunnel, the pipe lays itself out ahead of the sphere (a front with a
     solid end section runs from the tunnel round the bend to the right leg's end, 52.25–54.3; the sphere comes out of
     the tunnel at ~52.85 with the front ~14 u ahead), while board 13's tile grid rises into place from below
     (52.35–54.55). Out: once the sphere is off the leg, the pipe clears away behind it (from the tunnel end round the
     bend to the leg's end, 56.2–57.55) and the tiles sink away as the camera swoops down to frame 14 (56.5–57.6).
   · Board 13's shapes, as pieces laid flat for the aerial camera (flat at the hold, chunky sides and parallax while
     moving): the violet half-disc inside the U, the tile grid (the mauve tile and its coral ring; the two quarter-disc
     tiles; the blue tile and its peach dome; the indigo and coral tiles under the pipe) and the plain violet left panel
     (the copy area: "AND THE MOMENTUM KEPT ROLLING" comes back with the copy layer). Each is coloured by a smooth field
     fitted to the board (mean error ~1–3 / 255). Tiles are mosaic slabs at slightly different heights; the deeper of two
     neighbours runs under the nearer, so no seam opens in motion; the outer tiles run past the frame edges, so the crane
     and the swoop see a continuous floor. */
export default (V, G) => {
  const { THREE, h13, C, L, sOf, crest, sm } = G;
  const { anim } = V;
  const SH = V.S, Vec = THREE.Vector3;
  const TK = h13.tk, cam = h13.pos, fwd = h13.fwd, rgt = h13.right, upv = h13.upv, tanV = h13.tanV;
  const up = new Vec(0, 1, 0);

  /* ---------- the hold camera's projection (board px of a world point) ---------- */
  const hc = new THREE.PerspectiveCamera(h13.fov, 16 / 9, 0.05, 2000);
  hc.matrixAutoUpdate = false; hc.matrixWorld.makeBasis(rgt, upv, fwd.clone().negate()).setPosition(cam);
  hc.matrixWorldInverse.copy(hc.matrixWorld).invert(); hc.updateProjectionMatrix();
  const HVP = new THREE.Matrix4().multiplyMatrices(hc.projectionMatrix, hc.matrixWorldInverse);

  /* ---------- board 13's colour fields ----------
     Each is a smooth polynomial in board px, fitted (least squares, text and sphere masked) to the board over the shape's
     own area (box: the fitted area; outside it the field holds its edge colour). T lists the terms u^i·v^j as 'ij' pairs
     (u, v: 0–1 across the box), c their RGB coefficients (0–255). */
  const FIT = {
    A: { box: [887, 5, 1501, 409], T: '000110', c: [[177.0, 86.6, 166.1], [0.1, -0.0, 0.0], [-111.2, -81.7, -2.3]] },
    ring: { box: [1095, 5, 1499, 409], T: '000102101120', c: [[219.3, 60.4, 86.6], [-25.9, 71.1, -31.2], [10.9, -33.6, 16.0], [-19.0, -16.0, 0.9], [0.4, -0.8, -1.4], [-2.9, 0.4, -0.8]] },
    B1bg: { box: [1513, 5, 1649, 133], T: '000110', c: [[250.4, 174.0, 86.9], [-24.9, -35.0, 32.4], [-27.6, -37.2, 36.7]] },
    B1d: { box: [1517, 13, 1707, 203], T: '000102030410111213202122303140', c: [[64.9, 7.4, 347.5], [602.5, 287.7, -1129.0], [-615.9, -198.4, 1191.9], [268.4, 84.5, -592.2], [-83.9, -53.1, 233.2], [361.2, 238.2, -998.1], [-1214.9, -645.2, 2838.2], [1189.1, 474.3, -2527.6], [-181.5, -20.6, 135.3], [-1039.6, -687.7, 3124.0], [584.4, 397.8, -1643.9], [-548.5, -274.6, 1674.2], [1013.7, 671.5, -3886.4], [33.7, -26.0, -181.7], [-340.3, -226.0, 1682.4]] },
    B2bg: { box: [1783, 71, 1915, 203], T: '000110', c: [[179.6, 81.7, 182.0], [-24.1, -39.5, 37.2], [-29.4, -36.3, 29.2]] },
    B2d: { box: [1719, 5, 1911, 199], T: '000102101120', c: [[232.4, 114.4, 32.7], [1.2, -1.1, -3.8], [-0.4, 0.8, 3.9], [3.5, -5.1, -3.4], [-1.6, 0.7, -1.3], [17.2, -45.8, 24.8]] },
    C: { box: [1515, 217, 1915, 343], T: '000110', c: [[0.3, 18.4, 218.0], [3.2, 0.0, -4.1], [1.4, 125.0, 35.3]] },
    dome: { box: [1519, 219, 1911, 409], T: '000110', c: [[253.6, 169.9, 86.1], [-1.8, -13.9, 5.2], [-0.0, 0.3, -0.1]] },
    D: { box: [887, 421, 1501, 955], T: '000110', c: [[74.8, 4.0, 185.2], [-29.8, 3.1, -78.4], [-0.0, 0.2, 0.1]] },
    E: { box: [1515, 421, 1915, 875], T: '000110', c: [[237.4, 71.7, 100.0], [21.3, 74.0, 39.4], [-1.4, -0.5, -0.7]] },
    band: { box: [889, 569, 1915, 1073], T: '000102101120', c: [[251.8, 204.5, 119.8], [24.2, -96.2, -137.9], [-36.7, 15.9, 76.3], [-0.9, 0.9, 2.9], [-0.8, 0.2, 1.0], [1.1, -1.0, -3.4]] },
    hd: { box: [1095, 773, 1735, 1073], T: '000110', c: [[68.4, 6.4, 163.5], [0.3, -0.0, 0.4], [106.8, 78.4, 2.5]] },
    panel: { box: [0, 0, 880, 1080], T: '000102030410111213202122303140', c: [[61.1, -3.7, 194.7], [78.9, 62.6, -106.1], [-286.5, -285.5, 385.2], [420.1, 457.6, -547.2], [-193.3, -222.3, 246.3], [11.4, 21.3, -7.0], [-141.3, -109.7, 168.0], [331.0, 274.2, -430.0], [-244.2, -202.8, 329.9], [48.7, -70.3, 8.8], [42.2, 57.4, -8.6], [114.2, 103.7, -164.5], [-59.2, 83.8, 146.3], [-21.5, -40.9, 7.5], [30.2, -14.1, -89.5]] },
  };
  const f1 = x => (Math.abs(x) < 1e-9 ? 0 : x).toFixed(3);
  const glslFit = name => { const F = FIT[name], [x0, y0, x1, y1] = F.box, terms = [];
    for (let k = 0; k < F.T.length / 2; k++) { const i = +F.T[2 * k], j = +F.T[2 * k + 1], c = F.c[k];
      const m = [...Array(i).fill('u'), ...Array(j).fill('v')].join(' * ');
      terms.push(`vec3(${c.map(f1).join(', ')})${m ? ' * ' + m : ''}`); }
    return `vec3 f_${name}(vec2 b) { vec2 q = clamp((b - vec2(${f1(x0)}, ${f1(y0)})) / vec2(${f1(x1 - x0)}, ${f1(y1 - y0)}), 0.0, 1.0); float u = q.x, v = q.y;\n  return (${terms.join(' + ')}) / 255.0; }\n`; };
  const fieldGLSL = glslFit;

  /* ---------- pieces for hold 13: flat at the hold, board-field colour, living slide locked to the key instant ---------- */
  // flat at the hold: the back face is pushed out along the hold camera's view rays, so the sides are edge-on (invisible)
  // from that camera and open up as soon as it moves (as g2.js)
  const flatGeo = (g, at, d) => { const p = g.attributes.position; g.computeBoundingBox(); const zb = g.boundingBox.min.z; if (zb > -1e-6) return g;
    const tt = -zb * d * tanV / 540;
    for (let i = 0; i < p.count; i++) if (p.getZ(i) < zb / 2) { const x = p.getX(i), y = p.getY(i); p.setXY(i, x + (at[0] - 960 + x) * tt / d, y + (540 - at[1] + y) * tt / d); }
    p.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingBox(); return g; };
  // the piece's own gradient material, re-pointed at a board field: colour = field(board px of this point + a slow slide).
  // The slide (sl px along sd) is zero at the key instant, so the hold lands on the board's colours; it flows otherwise.
  const pieces = [];
  const PC = (spec, field, sd = [14, 10]) => {
    // (fix pass 2: depth writes stay on while a piece fades as it sinks away, so stacked tiles don't show through each other
    //  like panes of glass (57.4–57.6))
    const pc = V.piece({ hold: 13, depthWrite: true, ...spec });
    flatGeo(pc.mesh.geometry, spec.at, spec.depth);
    const m = pc.mesh.material;
    m.uniforms.ban = { value: new THREE.Vector2(...spec.at) };
    m.uniforms.bsd = { value: new THREE.Vector2(...sd) };
    m.uniforms.bT = { value: TK };
    const fs = m.fragmentShader.replace('#include <logdepthbuf_pars_fragment>', '#include <logdepthbuf_pars_fragment>\nuniform vec2 ban, bsd; uniform float bT;\n' + fieldGLSL(field))
      .replace('gl_FragColor = vec4(col * shade, op);', `vec2 bp = vec2(ban.x + vO.x, ban.y - vO.y) + bsd * min(flow, 1.6) * (sin((t - bT) * spd / per * 6.2832 + ph) - sin(ph));
  vec3 fc = f_${field}(bp);${field === 'panel' ? '\n  fc = mix(fc, f_panel(vec2(bp.x, 560.0)), smoothstep(1080.0, 1900.0, bp.y));   // below the board it settles to the plain violet' : ''}
  gl_FragColor = vec4(fc * shade, op);`);
    if (fs === m.fragmentShader) throw new Error('f13: engine shader changed; the board fields could not hook it');
    m.fragmentShader = fs; m.needsUpdate = true;
    pieces.push(pc);
    return pc;
  };
  // build in: rise from below (the aerial camera looks down, so "out of the depth" is up from under the floor);
  // out: sink away again
  const inAt = (a, d = 0.8) => ({ type: 'fly', t: [a, a + d], dz: 14, ease: 'expo.out' });
  const outAt = (a, d = 0.6) => ({ type: 'fly', t: [a, a + d], dz: 13, ease: 'power2.in' });
  // rect by board px edges [x0, y0, x1, y1] → { shape, at }
  const rect = (x0, y0, x1, y1) => ({ shape: SH.rr(x1 - x0, y1 - y0, 0), at: [(x0 + x1) / 2, (y0 + y1) / 2] });

  // (review fix: the shapes are never quite settled (the user's rule): the panel and tiles A and D drift 1.5 px; their edges run
  //  40 px under their neighbours, so no seam opens. The corner tiles (B1, B2, C, E) stay put: their quarter discs and the dome
  //  share exact edges with them and with each other, so an independent drift would open a hairline. The ring and the
  //  half-disc keep their default drift.)
  // depths (world units from the hold camera; the sphere's centre is at 19.57, the pipe's rim at the same height and its
  // underside ~1.1 lower): every piece sits clear below the pipe; nearer = higher. The deeper of two neighbours runs 40 px
  // under the nearer one.
  // the left panel (copy area): plain violet field; runs far past the frame (left, up, and down past the tunnel end)
  PC({ ...rect(-620, -320, 920, 2320), depth: 23.3, thick: 1.1, drift: 1.5, in: inAt(51.9, 1.0), out: outAt(56.5) }, 'panel', [18, 12]);
  // tile D (indigo) under the left leg and between the legs; runs down past the frame (to z ≈ 68.5, clear of frame 14's hill)
  PC({ ...rect(880, 415, 1508, 1900), depth: 21.85, thick: 0.9, drift: 1.5, in: inAt(52, 1.0), out: outAt(56.75) }, 'D', [0, 18]);
  // tile E (coral), right of the half-disc; stops short of the sphere's leap off the right leg
  PC({ ...rect(1468, 415, 2340, 1250), depth: 22.25, thick: 0.9, drift: 0, in: inAt(52.25), out: outAt(57.0) }, 'E', [0, 16]);
  // tile A (mauve → indigo) with its coral ring
  PC({ ...rect(880, -320, 1548, 455), depth: 22.8, thick: 0.9, drift: 1.5, in: inAt(52.8), out: outAt(56.5) }, 'A', [18, 0]);
  PC({ shape: SH.ring(211, 130), at: [1297, 205.5], depth: 22.15, thick: 0.45, in: inAt(53.05), out: outAt(56.55) }, 'ring', [12, 12]);
  // tile B1: the peach corner and its quarter disc (orange → violet → blue)
  PC({ ...rect(1508, -320, 1712, 208), depth: 22.4, thick: 0.8, drift: 0, in: inAt(52.95), out: outAt(56.7) }, 'B1bg', [10, 10]);
  PC({ shape: SH.qdisc(204, 'tl'), at: [1712, 208], depth: 22.0, thick: 0.5, drift: 0, in: inAt(53.15), out: outAt(56.75) }, 'B1d', [10, -6]);
  // tile B2: the purple corner and its quarter disc (orange → red)
  PC({ ...rect(1672, -320, 2340, 208), depth: 22.55, thick: 0.8, drift: 0, in: inAt(53.1), out: outAt(56.85) }, 'B2bg', [10, 10]);
  PC({ shape: SH.qdisc(208, 'br'), at: [1712, 0], depth: 22.1, thick: 0.5, drift: 0, in: inAt(53.3), out: outAt(56.9) }, 'B2d', [16, 0]);
  // tile C (blue → cyan) with the peach dome on its bottom edge
  PC({ ...rect(1508, 168, 2340, 455), depth: 22.65, thick: 0.8, drift: 0, in: inAt(53), out: outAt(56.95) }, 'C', [18, 0]);
  PC({ shape: SH.half(205, 'up'), at: [1715, 415], depth: 21.95, thick: 0.55, drift: 0, in: inAt(53.25), out: outAt(57.0) }, 'dome', [0, 14]);
  // the violet half-disc inside the U (radius 345: it runs ~20 px under the channel, so parallax never opens a gap)
  PC({ shape: SH.half(345, 'up'), at: [1415, 1092], depth: 21.0, thick: 0.7, in: inAt(52.5), out: outAt(56.85) }, 'hd', [16, 0]);

  /* ---------- the pipe ---------- */
  // inner / outer radius, the axis (cut plane) at the sphere's centre height. The outer radius is the band's half width on
  // the board (one sphere radius); the wall is 0.16 thick so the cut reads, and the sphere sits a little into the channel
  // (0.16: unseen from above; from the side its lower half is inside the walls anyway)
  const RI = 0.84, RO = 1.0, Y0 = crest.y;
  // (review fix: no upper part at all now: its 0.05 slice and start cap stood up as a ring floating over the tunnel's far end,
  //  with the sphere appearing inside it (52.95–53.35); the half-pipe starts on frame 12's channel floor, which runs out under it)
  const sRoof = sOf('roof'), s0 = sRoof - 0.6, sCut = s0, s1 = sOf('legEnd');   // (fix pass: open from the start: frame 12's tunnel is an open channel by its end now)
  const fr = s => { const u = Math.min(1, Math.max(0, s / L)), p = C.getPointAt(u), t = C.getTangentAt(u); p.y = Y0; t.y = 0; t.normalize();
    return { p, t, sd: new Vec(-t.z, 0, t.x) }; };                 // sd = tangent × up: the section's "side" axis (horizontal)
  const K = 28, arc = (r, a0, a1, inward) => { const pts = [], nrm = [];
    for (let i = 0; i <= K; i++) { const th = a0 + (a1 - a0) * i / K, sn = Math.sin(th), cs = Math.cos(th);
      pts.push([r * sn, -r * cs]); nrm.push(inward ? [-sn, cs] : [sn, -cs]); }
    return { pts, nrm }; };
  const H = Math.PI / 2;
  const LOWER = [arc(RI, -H, H, true), arc(RO, -H, H, false), { pts: [[-RO, 0], [-RI, 0]], nrm: [[0, 1], [0, 1]] }, { pts: [[RI, 0], [RO, 0]], nrm: [[0, 1], [0, 1]] }];
  const UPPER = [arc(RI, H, 3 * H, true), arc(RO, H, 3 * H, false)];
  const sweepPipe = (sA, sB, polys, ds = 0.12) => {
    const n = Math.max(2, Math.ceil((sB - sA) / ds)), pos = [], nor = [], sAt = [], idx = [];
    for (const poly of polys) {
      const m = poly.pts.length, base = pos.length / 3;
      for (let i = 0; i <= n; i++) {
        const s = sA + (sB - sA) * i / n, F = fr(s);
        for (let k = 0; k < m; k++) { const [a, b] = poly.pts[k], [na, nb] = poly.nrm[k];
          pos.push(F.p.x + F.sd.x * a, F.p.y + b, F.p.z + F.sd.z * a); nor.push(F.sd.x * na, nb, F.sd.z * na); sAt.push(s); }
      }
      for (let i = 0; i < n; i++) for (let k = 0; k < m - 1; k++) { const A = base + i * m + k, B = A + m; idx.push(A, B, A + 1, A + 1, B, B + 1); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute('sP', new THREE.Float32BufferAttribute(sAt, 1)); g.setIndex(idx); return g;
  };
  // end sections (in the section plane: x = side, y = up; normal +z = along the path): lower half ring, upper half ring
  const halfRing = lower => { const s = new THREE.Shape(), a0 = lower ? Math.PI : 0, a1 = lower ? 2 * Math.PI : Math.PI;
    s.moveTo(RO * Math.cos(a0), RO * Math.sin(a0)); s.absarc(0, 0, RO, a0, a1, false); s.lineTo(RI * Math.cos(a1), RI * Math.sin(a1));
    s.absarc(0, 0, RI, a1, a0, true); s.lineTo(RO * Math.cos(a0), RO * Math.sin(a0));
    const g = new THREE.ShapeGeometry(s, 32); g.setAttribute('sP', new THREE.Float32BufferAttribute(new Array(g.attributes.position.count).fill(0), 1)); return g; };
  const gLow = halfRing(true), gUp = halfRing(false);

  // the material: the band's colour field by where the point sits in the hold view; shaded where it turns from the hold camera
  const PIPE_V = `#include <common>
#include <logdepthbuf_pars_vertex>
attribute float sP;
varying vec3 vW; varying vec3 vN; varying float vS;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vS = sP;
  gl_Position = projectionMatrix * viewMatrix * w;
  #include <logdepthbuf_vertex>
}`;
  const PIPE_F = `uniform mat4 hvp; uniform vec3 hcam; uniform float t, flow, spd, ph, per, op, bT, bamp, wMot, sLo, sHi, yAx, cutS;
varying vec3 vW; varying vec3 vN; varying float vS;
#include <logdepthbuf_pars_fragment>
${glslFit('band')}
vec3 pipeCol(vec2 b) {                     // the band; below the board it runs on as a deeper orange toward the tunnel
  vec3 c = f_band(b);
  return mix(c, vec3(0.925, 0.400, 0.200), smoothstep(1073.0, 2600.0, b.y));
}
void main() {
#ifdef CLIP
  if (vS < sLo || vS > sHi) discard;
#endif
  vec3 nb = normalize(vN);
  vec4 hq = hvp * vec4(vW, 1.0);
  vec2 bp = vec2((hq.x / hq.w * 0.5 + 0.5) * 1920.0, (0.5 - 0.5 * hq.y / hq.w) * 1080.0);
  float sl = bamp * min(flow, 1.6) * (sin((t - bT) * spd / per * 6.2832 + ph) - sin(ph));
  vec3 bc = pipeCol(bp + vec2(0.0, sl));
  float vis = max(smoothstep(-0.02, 0.1, dot(nb, normalize(hcam - vW))), cutS);   // (the end sections: always face-lit)
  // (at the hold every surface keeps the board colour, so no edge of the shell can show as a line; the shading comes in
  //  with the camera's motion)
  float shade = mix(1.0, mix(0.72 + 0.1 * nb.y, 1.0, vis), wMot);
  // always (the key moment too; revision, wMot is fixed at 1): the channel's walls darken toward the rims and the flat cut faces
  // (the rims, the end sections) turn paler, so it reads as a pipe cut open, not a solid bar
  float cut = max(step(abs(vW.y - yAx), 0.004) * step(0.99, nb.y), cutS);
  shade *= 1.0 - wMot * 0.42 * pow(1.0 - clamp(nb.y, 0.0, 1.0), 0.8) * (1.0 - cut);
  bc = mix(bc, vec3(1.0, 0.86, 0.66), wMot * 0.35 * cut);
  gl_FragColor = vec4(bc * shade, op);
  #include <logdepthbuf_fragment>
}`;
  const base = V.mat(['#ff9a3a'], { flat: true });                 // registered with the engine, so t and flow update
  const U = { ...base.uniforms, hvp: { value: HVP }, hcam: { value: cam.clone() }, bT: { value: TK }, bamp: { value: 26 }, wMot: { value: 1 },
    sLo: { value: s0 }, sHi: { value: s0 }, yAx: { value: Y0 }, cutS: { value: 0 } };
  const pm = defines => new THREE.ShaderMaterial({ uniforms: U, vertexShader: PIPE_V, fragmentShader: PIPE_F, defines, side: THREE.DoubleSide });
  const mPipe = pm({ CLIP: 1 }), mCap = pm({});
  mCap.uniforms = { ...U, cutS: { value: 1 } };                  // the end sections are cut faces too
  const mk = (g, m) => { const me = new THREE.Mesh(g, m); me.frustumCulled = false; V.scene.add(me); return me; };
  const pipe = [mk(sweepPipe(s0, s1, LOWER), mPipe)];
  // caps: placed at path position s, facing along (dir +1) or against (-1) the path
  const cap = g => mk(g, mCap);
  const place = (me, s, dir) => { const F = fr(s), sd = F.sd.clone().multiplyScalar(dir), tn = F.t.clone().multiplyScalar(dir);
    me.matrixAutoUpdate = false; me.matrix.makeBasis(sd, up, tn).setPosition(F.p); me.matrixWorldNeedsUpdate = true; };
  const cStartL = cap(gLow), cStartU = cap(gUp), cCut = cap(gUp), cEnd = cap(gLow);
  place(cStartL, s0, -1); place(cStartU, s0, -1); place(cCut, sCut, 1); place(cEnd, s1, 1);
  const fHiL = cap(gLow), fHiU = cap(gUp), fLoL = cap(gLow), fLoU = cap(gUp);   // the moving fronts
  // build: the front runs ahead of the sphere (it leaves the tunnel at ~52.85; the front is ~14 u ahead then)
  const IN = [51.8, 54.1], OUT = [56.2, 57.55];   // (fix pass: builds from 51.8 (was 52.25), so the crane over frame 12's tunnel sees it)
  const eIn = gsap.parseEase('sine.out');
  anim(t => {
    const sHi = s0 + (s1 - s0) * eIn(Math.min(1, Math.max(0, (t - IN[0]) / (IN[1] - IN[0]))));
    const sLo = s0 + (s1 - s0) * Math.min(1, Math.max(0, (t - OUT[0]) / (OUT[1] - OUT[0])));
    U.sHi.value = sHi; U.sLo.value = sLo;
    const on = sHi > s0 + 0.02 && sLo < s1 - 0.02;
    for (const me of pipe) me.visible = on;
    cStartL.visible = on && sLo <= s0; cStartU.visible = false;
    cCut.visible = false;
    cEnd.visible = on && sHi >= s1 - 1e-4;
    fHiL.visible = on && sHi < s1 - 1e-4; fHiU.visible = fHiL.visible && sHi < sCut;
    if (fHiL.visible) { place(fHiL, sHi, 1); place(fHiU, sHi, 1); }
    fLoL.visible = on && sLo > s0; fLoU.visible = fLoL.visible && sLo < sCut;
    if (fLoL.visible) { place(fLoL, sLo, -1); place(fLoU, sLo, -1); }
    // (revision, user: "I love the 3D effect you have on the U shape! … for the frame hold, you blend it with a flat version of
    //  the U shape. Let's not do that because I want to be able to see those rimmed edges". The form shading (darker walls
    //  toward the rims, paler cut faces) used to switch off round the hold; it now stays on all the time: wMot is fixed at 1.)
  });

  V.unplate(13);
};
