/* Frame 25 · out of G5's dark doorway (cut 115.15) onto the three stacked pills, which work like a pinball plunger (G6,
   called from g6.js with its context G). Built: the real set, no plate.
   · The dark dome is a real tunnel: board 25's backdrop is a wall with a ∩ opening (the dome's outline), and a ∩ tunnel
     runs 46 u back into it (walls, floor, end cap). At the 115.15 cut the camera starts 2.5 u inside it (dark: the tunnel
     is dimmed with depth, with soft ribs, until the camera is out) and pulls back out through the mouth as the sphere rolls
     out after it along the floor, then hops up out of the mouth onto the top pill (group C polish, 2026-09-29: "the sphere
     sails out of the upper tunnel instead of rolling on the floor and hopping onto the pills"; the path is g6.js's). The
     mouth's depth and the floor's height are the journey's (G.WALL25, G.FLOOR25), so the roll and the hop fit the tunnel.
     A soft contact shadow rides under the sphere on the floor while it rolls, and fades as the hop lifts it.
     Every tunnel surface takes the dome's board colour from where it sits in the hold view, so at the hold the opening
     reads as board 25's flat dark indigo dome.
   · Board 25's shapes as pieces laid out in hold 25's view (flat at the hold, chunky sides and parallax while the camera
     moves), each coloured by a smooth field fitted to the board (board px; mean error ~1–3 / 255), flowing slowly and
     exactly on the board at the key instant: the backdrop wall (the diagonal blue → violet → peach gradient, soft top
     edge; the copy area is left as plain backdrop), the orange disc (top), the left ∩ arch, the dark strip / top-right
     band behind the right panel, the right panel with its big rounded corner.
     Depths (from the hold camera; the sphere plane is 25.29): wall 29.4 (the tunnel mouth), back band 29.1, disc 28.6,
     arch 27.9, panel 27.3, tiles 25.29 (the sphere plane), pills 24.4–26.2.
   · The plunger: three real pills (238 × 53 px, 1.8 u deep) are the sphere's track; the sphere bounces on the top one.
     They rise into place from below as the camera pulls out (top first, 116.0–116.83: the upper pill always leads, so they
     never pass through each other, as the bottom-first order did mid-rise, and at the sphere's take-off they are still
     low, clear of it), squash on each landing (LAND), compress as the
     sphere sinks (LAND[3] → FIRE) and spring back after it fires (pillSq), then slide away sideways (118.8–119.66), as the camera starts up after the sphere.
   · The 2×2 quarter-disc tiles: SHARED with frame 27 and owned here (they first appear on board 25). They slide in with the
     panel, then (the journey's contract, unchanged) break loose at 118.9, tumble up with the camera while the sphere
     ricochets off each tile at its K[hit] contact (K and arcs are the journey's pinball arcs; while tumbling the tiles part
     ±0.75 u in depth so they never cut through each other), and re-form as board 27's
     grid (centres 1575/1835 × 700/952, 255 px in hold 27's view at depth 36.83) at T_SET = 123.05, then fade 123.1–123.5
     as f27's grid takes over. Their colours are board 25's tiles (fitted in tile coordinates) blending into board 27's
     tiles on the way up (120.0–122.8), so the hand-over matches. G.tiles25 exposes them.
   · In: the wall and tunnel are there at the cut; the panel (with the back band and the tiles) slides in from the right,
     the arch from the left, the disc from the top, as the pulled-back view widens (115.75–116.95). Out (25 → 27, "puzzle
     pieces"): after the plunger fires, the pills slide off left / right / left, the disc rolls away left, the arch tips
     away down-left, the panel and band slide off right (119.0–120.8) while the tiles tumble up; the wall and tunnel fade
     121.0–122.0, before hold 27.
   The journey (holds, the sphere's path, camera keys, captions) stays in g6.js. */
export default (V, G) => {
  const { THREE, fadeIO, smooth, LAND, FIRE, COMP, h25, h27, K, arcs, track, wpt, kpx, M25, TK25, WALL25, FLOOR25, T_OFF } = G;
  const { anim, scene } = V;
  const SH = V.S, Vec = THREE.Vector3;
  const TK = TK25, cam = h25.pos, fwd = h25.fwd, rgt = h25.right, upv = h25.upv, tanV = h25.tanV;
  V.unplate(25);

  /* ---------- board 25's colour fields ----------
     Smooth polynomials fitted (least squares; the copy's letters, the sphere and the other shapes masked, and a 16 px frame
     round the board's edges, whose pale JPEG border line had leaked a lavender haze into the right edge) to the board over
     each shape's own area. box: the fitted area in board px (outside it the field holds its edge colour); T: the terms
     u^i·v^j as 'ij' pairs (u, v: 0–1 across the box); c: their RGB coefficients (0–255). The tiles (t25_k: board 25,
     t27_k: board 27) are fitted in tile coordinates (the unit square of the quarter-disc shape). */
  const FIT = {
    bg: { box: [0, 0, 1920, 1080], T: '00010203040506101112131415202122232430313233404142505160', c: [[26.58,-6.67,241.14],[278.62,170.35,-324.08],[-1283.31,-633.29,2102.44],[2849.62,423.05,-6508.44],[-2561.03,1320.11,9560.13],[823.82,-2023.87,-7113.68],[-88.34,724.29,2262.41],[-71.2,-192.53,23.37],[-1328.88,-134.4,894.56],[3341.9,-824.52,-4619.9],[-1464.35,5071.06,6493.93],[-4165.12,-8565.8,-472.97],[4266.06,5177.5,-3137.03],[2435.65,3442.12,-341.82],[1464.07,-3913.65,-138.27],[-246.61,7634.75,-1028.4],[1282.99,-4859.82,-2273.35],[-5267.37,-3058.83,7035.94],[-13857.67,-17962.55,1598.34],[431.54,12149.89,1057.8],[-3486.28,-10345.62,2314.24],[7963.83,9347.43,-9468.71],[34457.05,40640.0,-3564.71],[-2266.97,-13602.78,-451.32],[-2528.71,82.91,5497.7],[-37104.32,-40697.82,3335.77],[2074.42,5974.43,-1744.63],[14207.41,14798.62,-1057.46]] },
    disc: { box: [740, 0, 1380, 236], T: '000102101120', c: [[233.27,113.88,32.05],[-0.93,1.57,-0.18],[1.2,-3.31,1.55],[2.1,-5.62,-1.42],[-6.72,19.44,-9.09],[9.81,-25.49,14.08]] },
    arch: { box: [-30, 590, 592, 1080], T: '000102101120', c: [[96.7,22.85,162.61],[23.66,11.74,-29.99],[-7.76,-5.47,10.52],[186.3,89.99,-156.93],[-13.28,-3.62,16.44],[-25.3,-55.55,50.51]] },
    dome: { box: [544, 559, 1312, 1080], T: '000102101120', c: [[37.32,8.44,88.31],[-0.22,-0.04,0.0],[-0.2,0.24,-0.17],[39.32,-5.61,96.92],[0.7,-0.39,0.32],[-2.1,1.42,0.39]] },
    back: { box: [1363, 0, 1920, 560], T: '001020304001', c: [[32.49,3.26,97.55],[211.64,122.37,-94.36],[-870.88,-812.97,1723.18],[1668.21,1562.7,-3266.11],[-803.18,-759.17,1578.28],[-0.19,0.14,-0.28]] },
    panel: { box: [1290, 105, 1920, 1080], T: '000102030405101112131420212223303132404150', c: [[81.88,20.08,182.51],[-46.25,-40.37,-210.04],[-211.66,16.43,1421.23],[1222.59,389.4,-2917.19],[-1169.85,-459.81,2230.09],[280.76,134.04,-548.34],[-79.21,-67.74,-89.19],[129.06,141.33,747.8],[310.7,2.51,-1874.02],[-1334.31,-514.45,2422.02],[1179.66,549.14,-1341.08],[108.43,131.09,56.92],[-27.25,-26.44,-579.71],[564.58,512.53,-64.7],[-1299.85,-872.02,908.03],[-29.9,-140.34,75.82],[-297.94,-284.46,334.06],[958.75,550.51,-687.18],[-88.04,57.45,-75.91],[-252.42,-89.39,206.5],[123.61,37.74,-36.2]] },
    t25_0: { box: [0, 0, 1, 1], T: '000102030410111213202122303140', c: [[245.18,118.31,45.2],[70.75,60.8,-271.81],[-177.27,-174.05,560.98],[99.84,129.19,-240.05],[-18.92,-34.98,14.9],[84.66,50.1,-541.31],[20.65,-62.26,649.82],[-95.57,71.71,-333.26],[156.84,40.86,-407.71],[-909.57,-561.79,3162.88],[-328.25,-92.46,-116.77],[351.73,129.28,-24.38],[830.02,537.49,-3958.75],[184.63,69.69,-279.95],[-170.79,-126.02,1542.97]] },
    t25_1: { box: [0, 0, 1, 1], T: '000102030410111213202122303140', c: [[231.09,117.01,30.35],[29.9,-42.23,11.66],[-91.05,100.48,-18.29],[165.67,-225.79,52.59],[-83.78,114.54,-23.83],[8.15,-15.88,12.44],[-61.9,118.11,-54.75],[107.51,-210.91,88.37],[-53.78,107.77,-44.39],[-17.26,34.47,-44.08],[88.82,-162.39,89.44],[-72.25,139.45,-61.54],[13.89,-29.06,60.39],[-38.25,63.62,-44.65],[-3.68,9.0,-28.35]] },
    t25_2: { box: [0, 0, 1, 1], T: '000102030410111213202122303140', c: [[254.28,60.52,54.2],[-33.78,99.79,-55.23],[-12.28,-34.71,81.92],[49.99,-25.43,-100.35],[-24.6,11.73,53.43],[-2.93,-8.2,-5.14],[-11.6,21.56,-21.6],[-10.2,71.84,-17.76],[13.53,-59.08,31.25],[25.77,-20.48,36.63],[44.9,-123.24,86.49],[-28.45,45.22,-53.8],[-77.24,155.22,-101.76],[21.4,-38.49,2.81],[39.74,-91.11,54.2]] },
    t25_3: { box: [0, 0, 1, 1], T: '000102030410111213202122303140', c: [[190.64,73.04,144.89],[-71.1,-24.03,74.66],[748.59,345.41,-1358.61],[-1006.43,-221.77,1763.28],[345.12,-42.07,-513.9],[267.0,160.88,-497.17],[-214.3,-255.33,665.46],[328.2,223.18,-890.32],[224.59,163.98,-545.13],[-1769.91,-919.48,2778.95],[-170.64,20.29,766.22],[-435.39,-444.68,1092.36],[2920.85,1553.76,-4651.51],[284.28,235.52,-1221.51],[-1410.04,-783.85,2336.31]] },
    t27_0: { box: [0, 0, 1, 1], T: '000102030410111213202122303140', c: [[237.58,116.61,52.31],[119.46,77.27,-357.77],[-270.4,-215.56,734.43],[173.95,174.28,-367.04],[-42.12,-53.79,48.18],[90.07,42.19,-493.64],[-175.82,-133.61,1119.89],[187.58,182.01,-996.52],[70.94,12.16,-195.25],[-987.22,-590.92,2998.95],[-111.54,-15.31,-650.91],[149.2,35.09,494.0],[982.17,627.81,-3751.45],[127.24,62.95,-220.37],[-241.41,-180.94,1436.87]] },
    t27_1: { box: [0, 0, 1, 1], T: '000102030410111213202122303140', c: [[231.73,116.28,29.84],[20.16,-28.73,5.63],[-44.07,50.84,-3.94],[82.2,-153.24,44.96],[-35.79,76.06,-23.98],[5.99,-14.89,36.79],[-54.84,105.76,-74.25],[88.92,-204.06,100.2],[-43.1,115.67,-56.71],[-10.59,39.41,-166.23],[89.62,-142.83,156.06],[-63.97,118.94,-65.59],[2.35,-45.92,274.77],[-45.74,63.8,-107.91],[3.94,19.78,-148.27]] },
    t27_2: { box: [0, 0, 1, 1], T: '000102030410111213202122303140', c: [[255.59,57.95,52.91],[-32.99,100.25,-43.97],[-47.96,1.19,37.9],[125.18,-90.86,-22.16],[-69.05,47.91,7.58],[-29.81,33.71,-12.13],[119.21,-109.11,-11.38],[-163.93,139.6,-33.94],[79.48,-84.98,47.24],[76.2,-110.61,74.99],[-192.7,222.99,-3.51],[98.92,-61.08,-18.99],[-71.82,124.84,-114.45],[107.96,-175.38,41.37],[18.29,-33.19,46.49]] },
    t27_3: { box: [0, 0, 1, 1], T: '000102030410111213202122303140', c: [[185.34,63.19,150.81],[-88.74,-89.11,114.66],[907.66,751.92,-1569.47],[-1237.43,-836.27,1982.83],[450.32,252.68,-560.65],[-144.26,-75.89,31.19],[646.07,352.99,-864.91],[-553.05,-456.18,1024.34],[403.01,303.11,-1349.86],[5.3,-52.57,897.53],[-1731.76,-769.72,3057.68],[697.51,289.17,-365.23],[-136.52,42.36,-1724.16],[808.23,333.38,-1930.04],[215.41,58.14,837.19]] },
    p0: { box: [810, 866, 1048, 918], T: '0010203040', c: [[95.04,10.32,244.83],[267.22,163.73,-217.49],[-1894.06,-1115.32,716.88],[3537.86,2117.93,-1468.28],[-1787.55,-1068.25,768.29]] },
    p1: { box: [810, 938, 1048, 990], T: '0010203040', c: [[201.98,198.42,246.53],[3.0,47.23,83.75],[-23.99,-183.56,-309.79],[48.98,276.25,446.54],[-29.12,-140.89,-220.08]] },
    p2: { box: [810, 1008, 1048, 1060], T: '0010203040', c: [[226.73,112.83,39.11],[99.73,-23.0,-79.17],[-335.89,-75.26,372.5],[541.79,67.85,-544.48],[-289.67,-23.36,274.69]] },
  };
  const f1 = x => (Math.abs(x) < 1e-9 ? 0 : x).toFixed(3);
  const glslFit = name => { const F = FIT[name], [x0, y0, x1, y1] = F.box, terms = [];
    for (let k = 0; k < F.T.length / 2; k++) { const i = +F.T[2 * k], j = +F.T[2 * k + 1], c = F.c[k];
      const m = [...Array(i).fill('u'), ...Array(j).fill('v')].join(' * ');
      terms.push(`vec3(${c.map(f1).join(', ')})${m ? ' * ' + m : ''}`); }
    return `vec3 f_${name}(vec2 b) { vec2 q = clamp((b - vec2(${f1(x0)}, ${f1(y0)})) / vec2(${f1(x1 - x0)}, ${f1(y1 - y0)}), 0.0, 1.0); float u = q.x, v = q.y;\n  return (${terms.join(' + ')}) / 255.0; }\n`; };
  const hook = (m, head, body, who) => {
    const fs = m.fragmentShader.replace('#include <logdepthbuf_pars_fragment>', '#include <logdepthbuf_pars_fragment>\n' + head).replace('gl_FragColor = vec4(col * shade, op);', body);
    if (fs === m.fragmentShader) throw new Error('f25: engine shader changed; the board fields could not hook it (' + who + ')');
    m.fragmentShader = fs; m.needsUpdate = true; return m;
  };

  /* ---------- pieces for hold 25: flat at the hold, board-field colour, living slide locked to the key instant ---------- */
  // flat at the hold: the back face is pushed out along the hold camera's view rays (sides edge-on at the hold)
  const flatGeo = (g, at, d) => { const p = g.attributes.position; g.computeBoundingBox(); const zb = g.boundingBox.min.z; if (zb > -1e-6) return g;
    const tt = -zb * d * tanV / 540;
    for (let i = 0; i < p.count; i++) if (p.getZ(i) < zb / 2) { const x = p.getX(i), y = p.getY(i); p.setXY(i, x + (at[0] - 960 + x) * tt / d, y + (540 - at[1] + y) * tt / d); }
    p.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingBox(); return g; };
  // colour = field(board px of this point + a slow slide); the slide (sd px) is zero at the key instant. softTop: a board-px
  // row range over which the piece fades in from its top edge (a soft edge when the crane shows it)
  const PF = (spec, field, sd = [14, 10], softTop = null) => {
    const pc = V.piece({ hold: 25, ...spec });
    flatGeo(pc.mesh.geometry, spec.at, spec.depth);
    const m = pc.mesh.material;
    m.uniforms.ban = { value: new THREE.Vector2(...spec.at) };
    m.uniforms.bsd = { value: new THREE.Vector2(...sd) };
    m.uniforms.bT = { value: TK };
    const a = softTop ? ` * smoothstep(${f1(softTop[0])}, ${f1(softTop[1])}, ban.y - vO.y)` : '';
    hook(m, 'uniform vec2 ban, bsd; uniform float bT;\n' + glslFit(field),
      `vec2 bp = vec2(ban.x + vO.x, ban.y - vO.y) + bsd * min(flow, 1.6) * (sin((t - bT) * spd / per * 6.2832 + ph) - sin(ph));
  gl_FragColor = vec4(f_${field}(bp) * shade, op${a});`, field);
    pc.soft = !!softTop;
    return pc;
  };
  const rect = (x0, y0, x1, y1) => ({ shape: SH.rr(x1 - x0, y1 - y0, 0), at: [(x0 + x1) / 2, (y0 + y1) / 2] });
  const ek = (ks, t, d = 0) => V.evk(ks, t, d);

  // the in-slide shared by the panel, the back band and the tiles (world units to the right at 115.75 → 0 by 116.95)
  const IN_R = 9.5, inK = t => ek([[115.75, 1], [116.95, 0, 'expo.out']], t, 0);
  const D = { wall: WALL25, back: 29.1, disc: 28.6, arch: 27.9, panel: 27.3, pill: 24.4 };
  const pxAt = (w, d) => w / kpx(h25, d);                               // world → board px at a depth

  /* ---------- the backdrop wall, with the dome's ∩ opening (the tunnel mouth) ---------- */
  const kW = kpx(h25, D.wall), CX = 928, CY = 943, CR = 384;             // the dome: a half disc on straight sides (board px)
  const yF = FLOOR25, pyF = 540 + (cam.y - yF) / kW;                // the tunnel floor (world y) and its board row at the mouth
  const wallShape = (() => {
    const L = (px, py) => [px - 960, 540 - py];
    const s = new THREE.Shape(); s.moveTo(...L(-1000, -560)); s.lineTo(...L(2900, -560)); s.lineTo(...L(2900, 1700)); s.lineTo(...L(-1000, 1700)); s.lineTo(...L(-1000, -560));
    const h = new THREE.Path(); h.moveTo(...L(CX + CR, CY)); h.absarc(CX - 960, 540 - CY, CR, 0, Math.PI, false); h.lineTo(...L(CX - CR, pyF)); h.lineTo(...L(CX + CR, pyF)); h.lineTo(...L(CX + CR, CY));
    s.holes.push(h); return s;
  })();
  const WALL_OUT = [[121.0, 1], [122.0, 0, 'power1.inOut']];
  const wall = PF({ shape: wallShape, at: [960, 540], depth: D.wall, thick: 0, drift: 0, keys: { op: WALL_OUT } }, 'bg', [18, 12], [-560, -5]);

  /* ---------- the tunnel behind the opening (open ∩ tube + end cap), coloured from the hold view ---------- */
  const hc = new THREE.PerspectiveCamera(h25.fov, 16 / 9, 0.05, 2000);
  hc.matrixAutoUpdate = false; hc.matrixWorld.makeBasis(rgt, upv, fwd.clone().negate()).setPosition(cam);
  hc.matrixWorldInverse.copy(hc.matrixWorld).invert(); hc.updateProjectionMatrix();
  const HVP = new THREE.Matrix4().multiplyMatrices(hc.projectionMatrix, hc.matrixWorldInverse);
  const Cw = h25.at(CX, CY, D.wall), Rt = CR * kW, hF = yF - Cw.y, TL = 46;
  const tunnel = (() => {
    const pts = [], nrm = [];                                          // the outline (right, up) around Cw, with inward normals per segment
    const NA = 72; for (let i = 0; i <= NA; i++) { const a = Math.PI * i / NA; pts.push([Rt * Math.cos(a), Rt * Math.sin(a)]); }
    pts.push([-Rt, hF], [Rt, hF]);
    const P = (sx, sy, z) => Cw.clone().addScaledVector(rgt, sx).addScaledVector(upv, sy).addScaledVector(fwd, z);
    const pos = [], nor = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      let n; if (i < NA) { const am = Math.PI * (i + 0.5) / NA; n = [-Math.cos(am), -Math.sin(am)]; } else if (i === NA) n = [1, 0]; else if (i === NA + 1) n = [0, 1]; else n = [-1, 0];
      const N = new Vec().addScaledVector(rgt, n[0]).addScaledVector(upv, n[1]);
      const q = [P(a[0], a[1], 0), P(b[0], b[1], 0), P(b[0], b[1], TL), P(a[0], a[1], TL)];
      for (const j of [0, 1, 2, 0, 2, 3]) { pos.push(...q[j].toArray()); nor.push(N.x, N.y, N.z); }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    const capS = new THREE.Shape(); pts.forEach(([x, y], i) => i ? capS.lineTo(x, y) : capS.moveTo(x, y));
    const cg = new THREE.ShapeGeometry(capS, 64);
    cg.applyMatrix4(new THREE.Matrix4().makeBasis(rgt, upv, rgt.clone().cross(upv)).setPosition(Cw.clone().addScaledVector(fwd, TL)));
    const m = V.mat(['#2a0a6a'], { flat: true, side: THREE.DoubleSide });
    m.uniforms.hvp = { value: HVP }; m.uniforms.tdim = { value: 1 }; m.uniforms.tmouth = { value: Cw.clone() }; m.uniforms.tfwd = { value: fwd.clone() };
    hook(m, 'uniform mat4 hvp; uniform float tdim; uniform vec3 tmouth, tfwd;\n' + glslFit('dome'),
      `vec4 hq = hvp * vec4(vW, 1.0);
  vec2 bp = vec2((hq.x / hq.w * 0.5 + 0.5) * 1920.0, (0.5 - 0.5 * hq.y / hq.w) * 1080.0);
  float dd = max(dot(vW - tmouth, tfwd), 0.0);
  vec3 nb = normalize(vN);
  float rib = pow(0.5 + 0.5 * cos(6.2832 * dd / 2.6), 4.0);          // soft ribs, so backing out through the dark reads as motion
  vec3 fc = f_dome(bp) * mix(1.0, (0.38 + 0.62 * exp(-dd / 8.0)) * (0.8 + 0.2 * nb.y) * (1.0 + 0.45 * rib), tdim);
  gl_FragColor = vec4(fc, op);`, 'tunnel');
    const tube = new THREE.Mesh(g, m), cap = new THREE.Mesh(cg, m);
    tube.frustumCulled = cap.frustumCulled = false; scene.add(tube); scene.add(cap);
    return { m, meshes: [tube, cap] };
  })();

  /* ---------- the back band (the dark strip + the top-right band, behind the panel) ---------- */
  const inX = d => [[115.75, pxAt(IN_R, d)], [116.95, 0, 'expo.out']];
  const back = PF({ ...rect(1363, -170, 2900, 700), depth: D.back, thick: 0.2, keys: { x: [...inX(D.back), [119.5, 0], [120.7, 1300, 'power2.in']], op: [[120.5, 1], [120.7, 0]] } }, 'back', [16, 0], [-170, -5]);   // gone once off frame (it would linger in the world)

  /* ---------- the orange disc (top) ---------- */
  const disc = PF({ shape: SH.disc(321.5), at: [1060, -86.5], depth: D.disc, thick: 0.35,
    keys: { y: [[115.85, -520], [116.85, 0, 'expo.out']], x: [[119.15, 0], [120.05, -2100, 'power2.in']], r: [[119.15, 0], [120.05, 260, 'power2.in']], op: [[119.92, 1], [120.05, 0]] } }, 'disc', [14, 6]);   // rolls off left once the launched sphere has skimmed it; fades only as it leaves frame

  /* ---------- the left ∩ arch (outer r 310, inner r 106, centre (282, 900)) ---------- */
  const archP = PF({ shape: SH.arch(620, 810, 204), at: [282, 1400], depth: D.arch, thick: 1.0,
    keys: { x: [[115.8, -760], [116.9, 0, 'expo.out'], [119.4, 0], [120.5, -1000, 'power2.in']], y: [[119.4, 0], [120.5, 260, 'power2.in']], r: [[119.4, 0], [120.5, 38, 'power2.in']],
      op: [[120.35, 1], [120.5, 0]] } }, 'arch', [16, 0]);   // gone once off frame (it showed under the ramp in the crane down to 29)

  /* ---------- the right panel (big rounded top-left corner, r 475) ---------- */
  const panel = PF({ shape: SH.cornerRect(1610, 1595, 475, 'tl'), at: [1290 + 805, 105 + 797.5], depth: D.panel, thick: 1.2,
    keys: { x: [...inX(D.panel), [119.6, 0], [120.8, 1350, 'power2.in']], r: [[119.6, 0], [120.8, -10, 'power2.in']], op: [[120.6, 1], [120.8, 0]] } }, 'panel', [12, 14]);   // gone once off frame

  /* ---------- the plunger: three pills (the sphere's track) ---------- */
  const pillSq = t => {
    if (t < LAND[3]) { let s = 0; LAND.forEach((l, i) => { const u = (t - l) / 0.2; if (u > 0 && u < 1) s += [0.12, 0.09, 0.07, 0.05][i] * Math.sin(Math.PI * u); }); return s; }
    if (t < FIRE) { const u = (t - LAND[3]) / (FIRE - LAND[3]); return G.compAt ? G.compAt(u) : COMP * Math.sin(u * Math.PI / 2); }   // the journey's wind-up curve (the sphere still sinking as it fires)
    const u = t - FIRE; return COMP * Math.exp(-4.5 * u) * Math.cos(16 * u);
  };
  const pills = [[892.5, 'p0', 1, 116.0, 116.75, -1], [964, 'p1', 0.6, 116.04, 116.79, 1], [1034, 'p2', 0.3, 116.08, 116.83, -1]].map(([py, f, k, a, b, side], i) => {
    const o0 = 118.8 + 0.08 * i, o1 = o0 + 0.7;
    const pc = PF({ shape: SH.pill(238, 53), at: [929, py], depth: D.pill, thick: 1.8, drift: 0,
      keys: { y: [[a, 380], [b, 0, 'expo.out']], x: [[o0, 0], [o1, side * 1350, 'power2.in']], r: [[o0, 0], [o1, -side * 22, 'power2.in']], op: [[a, 0], [a + 0.1, 1], [o1 - 0.2, 1], [o1, 0]] } }, f, [10, 0]);
    return { pc, k };
  });

  /* ---------- the four quarter-disc tiles: same grid on boards 25 and 27; they break loose, tumble (the sphere ricochets off
     them) and re-form as board 27's grid (the tracks are the journey's contract with f27, unchanged) ---------- */
  const qd = (() => { const s = new THREE.Shape(); s.moveTo(-0.5, -0.5); s.lineTo(0.5, -0.5); s.absarc(-0.5, -0.5, 1, 0, Math.PI / 2, false); s.lineTo(-0.5, -0.5); return s; })();
  const TILES = [
    { p25: [1557.5, 577.5], p27: [1575, 700], a: Math.PI, hit: 1, spin: 2 },
    { p25: [1557.5, 922.5], p27: [1575, 952], a: Math.PI, hit: 2, spin: -2 },
    { p25: [1902.5, 577.5], p27: [1835, 700], a: 0, hit: 3, spin: -2 },
    { p25: [1902.5, 922.5], p27: [1835, 952], a: 0, hit: 4, spin: 2 },
  ];
  const T_SET = 123.05, S25 = 345 / 92.5, S27Z = 255 / 63.5, TH = 0.35;
  const TBL = [120.0, 122.8];                                            // board 25's tile colours → board 27's
  TILES.forEach((T, k) => {
    const a = wpt(h25, ...T.p25), b = wpt(h27, ...T.p27), aR = T.a;   // rest angle
    const [tc, pc] = K[T.hit], vin = arcs[T.hit - 1].b, vout = arcs[T.hit].a;
    const nX = -(vout.z - vin.z), nY = vout.y - vin.y, nl = Math.hypot(nX, nY), n = [nX / nl, nY / nl];
    const sz = S25 + (S27Z - S25) * (tc - 118.9) / (T_SET - 118.9), off = 1 + sz / 2;
    const cy = pc.y - n[1] * off, cz = pc.z + n[0] * off;                // tile centre at the contact (X = -z)
    let ac = Math.atan2(n[0], -n[1]); const want = aR + T.spin * Math.PI * (tc - 118.9) / (T_SET - 118.9);
    while (ac - want > Math.PI) ac -= 2 * Math.PI; while (want - ac > Math.PI) ac += 2 * Math.PI;
    const aF = aR + T.spin * Math.PI, sgn = Math.sign(T.spin);
    // keys stay in time order: the last tile (hit at 122.3) has only 0.75 s left, so its bounce-away is shorter and it
    // goes straight into its slot (its contact pose and its 27 pose are unchanged)
    const tB = Math.min(tc + 0.5, T_SET - 0.35), kB = Math.min(1, (T_SET - tc - 0.35) / 0.8), tA = Math.max(tc + 1.0, 122.35);
    T.tr = track([
      [118.9, [a.y, a.z, aR, S25], 1],
      [Math.min(119.3, tc - 0.3), [a.y + 1.4, a.z + 0.6 * sgn, aR + 0.35 * sgn, S25]],
      [tc - 0.12, [cy - n[1] * 0.7, cz + n[0] * 0.7, ac - 0.12 * sgn, sz]],
      [tc, [cy, cz, ac, sz]],
      [tB, [cy + (n[1] * 1.4 + 0.8) * kB, cz - n[0] * 1.4 * kB, ac + 0.5 * sgn * kB, sz]],
      ...(tA < T_SET - 0.15 ? [[tA, [b.y + 1.1, b.z - 0.9 * sgn, aF - 0.45 * sgn, S27Z]]] : []),
      [T_SET, [b.y, b.z, aF, S27Z], 1],
    ]);
    // the tile: a quarter-disc slab TH thick, centred on the sphere plane; flat at its rest pose in hold 25 (the back face
    // pushed out along the hold camera's rays, so its sides are edge-on there and open up as it tumbles)
    const geo = new THREE.ExtrudeGeometry(qd, { depth: TH, bevelEnabled: false, curveSegments: 48 });
    {
      const p = geo.attributes.position, dF = h25.depth - TH / 2, ca = Math.cos(aR), sa = Math.sin(aR);
      const c0 = a.clone().sub(cam), oR = c0.dot(rgt), oU = c0.dot(upv);
      for (let i = 0; i < p.count; i++) if (p.getZ(i) < TH / 2) {
        const lx = p.getX(i), ly = p.getY(i), R = oR + S25 * (ca * lx - sa * ly), U = oU + S25 * (sa * lx + ca * ly);
        const dR = R * TH / dF, dU = U * TH / dF;
        p.setXY(i, lx + (ca * dR + sa * dU) / S25, ly + (-sa * dR + ca * dU) / S25);
      }
      p.needsUpdate = true; geo.computeVertexNormals();
    }
    const m = V.mat(['#ffffff'], { local: true, viewShade: true });
    m.uniforms.bl = { value: 0 }; m.uniforms.bT = { value: TK }; m.uniforms.tsd = { value: new THREE.Vector2(0.035, 0.025) };
    hook(m, 'uniform float bl, bT; uniform vec2 tsd;\n' + glslFit('t25_' + k) + glslFit('t27_' + k),
      `vec2 q = vO.xy + 0.5 + tsd * (1.0 - bl) * min(flow, 1.6) * (sin((t - bT) * spd / per * 6.2832 + ph) - sin(ph));
  gl_FragColor = vec4(mix(f_t25_${k}(q), f_t27_${k}(q), bl) * shade, op);`, 'tile ' + k);
    const g = new THREE.Group(); g.rotation.y = Math.PI / 2; scene.add(g);
    const mesh = new THREE.Mesh(geo, m); mesh.position.z = -TH / 2; mesh.frustumCulled = false; g.add(mesh);
    T.pc = { mesh, group: g, set(y, z, ang, s, sy, op, dx = 0) {
      g.position.set(a.x + dx, y, z); mesh.rotation.z = ang; mesh.scale.set(s, s * sy, 1);
      m.uniforms.op.value = op; m.transparent = op < 0.999; m.depthWrite = op >= 0.999; g.visible = op > 0.002;
    } };
  });
  G.tiles25 = { TILES, T_SET, S25, S27Z };                             // for f27.js (the hand-over into board 27's grid)

  /* ---------- the sphere's soft contact shadow on the tunnel floor (group C polish, 2026-09-29: the sphere now rolls out
     along the floor and hops onto the pills; the floor is dark, so without it the rolling sphere read as hovering). A dark
     soft disc on the floor under the sphere, strongest while it rolls, shrinking and fading as the hop lifts it (gone
     ~1.3 u up), only over the tunnel's floor ---------- */
  const xMouth = cam.x + fwd.x * D.wall, zMid = h25.at(CX, CY, D.wall).z;
  const shM = new THREE.ShaderMaterial({ uniforms: { op: { value: 0 } }, transparent: true, depthWrite: false,
    vertexShader: '#include <common>\n#include <logdepthbuf_pars_vertex>\nvarying vec2 vU;\nvoid main() { vU = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}',
    fragmentShader: 'uniform float op;\nvarying vec2 vU;\n#include <logdepthbuf_pars_fragment>\nvoid main() { float r = length(vU); gl_FragColor = vec4(0.03, 0.0, 0.09, op * pow(1.0 - smoothstep(0.0, 1.0, r), 1.6));\n#include <logdepthbuf_fragment>\n}' });
  const contact = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6).rotateX(-Math.PI / 2), shM);
  contact.renderOrder = -1; contact.frustumCulled = false; contact.visible = false; scene.add(contact);
  anim((t, b) => {
    const p = b && b.p, hgt = p ? p.y - (yF + 1) : 9;
    const on = p && t > 115.1 && t < T_OFF + 0.4 && (p.x - xMouth) * fwd.x > 0.6 && Math.abs(p.z - zMid) < Rt;   // (inside the tunnel, over its floor)
    const a = on ? 0.62 * (1 - smooth(hgt / 1.3)) : 0;
    contact.visible = a > 0.003; shM.uniforms.op.value = a;
    if (contact.visible) { contact.position.set(p.x, yF + 0.015, p.z); contact.scale.setScalar(1 + 0.35 * Math.min(1, hgt / 1.3)); }
  });
  // draw order: the wall and the back band are always blended (the wall's soft top edge), so three.js sorts them among the
  // fading pieces by their centres; that order flipped mid-fade and the wall painted over the fading disc in one frame
  // (119.963). The backdrop now always draws first (the tunnel, then the wall, then the back band); nearer pieces blend over it.
  tunnel.meshes.forEach(me => { me.renderOrder = -3; }); wall.mesh.renderOrder = -2; back.mesh.renderOrder = -1;

  anim(t => {
    // the wall's soft top edge needs blending; the tunnel fades with the wall and is dimmed while the camera is in it / moving
    const wm = wall.mesh.material; wm.transparent = true;
    const back_m = back.mesh.material; back_m.transparent = true;
    const wop = ek(WALL_OUT, t, 1);
    tunnel.m.uniforms.op.value = wop; tunnel.m.transparent = wop < 0.999; tunnel.m.depthWrite = wop >= 0.999;
    for (const me of tunnel.meshes) me.visible = wop > 0.002;
    tunnel.m.uniforms.tdim.value = Math.max(1 - smooth((t - 115.45) / 1.05), 0.7 * smooth((t - 119.1) / 1.1));
    // pills: squash on the landings (after the engine has placed them)
    const sq = pillSq(t);
    for (const { pc, k } of pills) { const me = pc.mesh; if (!me.visible) continue; me.scale.y *= 1 - 0.35 * k * Math.max(0, sq); me.position.addScaledVector(upv, -k * sq); }
    // tiles
    const opT = fadeIO(t, [100, 100.01], [123.1, 123.5]), shift = IN_R * inK(t), bl = smooth((t - TBL[0]) / (TBL[1] - TBL[0]));
    // while tumbling the tiles part in depth (0.5 u apart, more than their 0.35 thickness), so they never cut through each
    // other where they cross; flat in the sphere plane at rest and again at the hand-over (T_SET)
    const sep = 0.5 * smooth((t - 118.95) / 0.5) * (1 - smooth((t - 122.55) / 0.5));
    TILES.forEach((T, k) => { const [y, z, a, s] = T.tr(t); T.pc.set(y, z - shift, a, s, 1, opT, (k - 1.5) * sep); T.pc.mesh.material.uniforms.bl.value = bl; });
  });
};
