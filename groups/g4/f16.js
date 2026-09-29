/* Frame 16 · the meander, bounced across: frontal, long lens (fov 26) at the key; the sphere bounces arch to arch on the
   orange meander's crowns (G4, called from g4.js with its context G). Built: the real set, no plate.
   (Rebuilt 2026-09-28. The user on the old ride: "The way the sphere goes through and bounces through the path is really
   not good. I'd like to do something a little bit more fun, 3D, and logical"; chosen: "Rollercoaster ride", "Drops in
   from above". Then, on the rollercoaster build: "I see how you are matching frame 16 perfectly so you've created a
   scoop/cup in the band. Unfortunately it makes the journey of the sphere weird. Can you remove that scoop/cup and make
   the cup into an arch to match the other sections so the sphere simply bounces across?" The cup is gone.)
   · The meander is a thick 3D track (3.1 u deep: its front face 1.35 u in front of the sphere's centre plane, its back
     1.75 u behind): board 16's whole outline (half-annuli of outer radius 201 and inner 36 px on the line y 877, centres
     530 / 768 / 1005 / 1241 (the tall "i" arch: a plain rounded crown, centre y 749, on straight legs) / 1478 / 1716 px).
     (fix pass 2) It is drawn as ONE piece, the whole 3.1 u (two parts left a dotted seam along the walls); the old back
     part is still created but never drawn, because one piece fewer would shift the engine's material counter, which
     seeds the living gradients of every later set. Its walls have smooth normals (no faceted banding). The sphere
     bounces on the crowns (g4.js's bounce16: the contacts sit on these exact circles), and the band dips a little under
     each bounce and springs back (g4.js's dip16; the ball rides the dip).
   · The track's up-facing surfaces (the crowns' tops the sphere bounces on) catch a warm top light, and the sphere casts
     a soft contact shadow on them as it comes down; the faces the key camera sees are untouched.
   · Colour: every piece takes board 16's colours from a smooth field fitted to the board over the shape's own area
     (polynomials in board px; mean error ~1–4 / 255; text, copy box, sphere and neighbours masked). The fields flow
     slowly (living), exactly on the board at the key instant.
   · Pieces (back to front, depth from the hold camera; the sphere is at 35.98): the purple left field (42.0, runs well
     past the left and top edges) with the four peach bars (41.3); the right lower panel (40.6), its stripe bars (40.25);
     the four tiles (backgrounds 40.0 / 40.08, quarter discs 39.75); the lilac rect (39.6), the magenta band with its
     rounded corner (39.35) and the lilac pill (39.1); the track (34.6 → 37.7).
     The copy areas (BTD: ACTIVATED box, the JULY 2025 block) show the purple field and the peach bars as the board does.
   · In: out of G3's wipe the track draws itself along its length from its left end (66.9–67.95) as the sphere drops onto
     its left end (its drawing head reads as a solid cut: the cap); the peach bars slide down, the tiles flip in (then
     turn single-sided), the lilac rect, the magenta band and the pill slide in from the right and the stripes fade in on
     their panel, staggered, 66.95–68.3.
   · Out: none (2026-09-28, the rollercoaster): the set stays in the world and the camera's crane down after the sphere
     carries it off the top of the frame; it is switched off at T_GONE (73.9), once it is out of view. Only the
     purple left field keeps its exit (recedes and fades 71.15–71.95: staying, its lower edge would hang across the top of
     board 17's view); the lower panel and its stripes end higher (py 1150 / 1130) for the same reason. */
export default (V, G) => {
  const { THREE, h16, D16 } = G;
  const { anim } = V;
  const SH = V.S, Vec = THREE.Vector3;
  const TK = h16.tk, cam = h16.pos, fwd = h16.fwd, rgt = h16.right, upv = h16.upv, tanV = h16.tanV;
  const proj = W => { const d = W.clone().sub(cam), z = d.dot(fwd); return [960 + d.dot(rgt) / z / tanV * 540, 540 - d.dot(upv) / z / tanV * 540]; };
  const onDepth = (W, dd) => { const d = W.clone().sub(cam); return cam.clone().addScaledVector(d, dd / d.dot(fwd)); };   // the point on the hold ray through W at depth dd

  /* ---------- board 16's colour fields ----------
     Smooth polynomials in board px, fitted (least squares) to the board over each shape's own area (box: the fitted area;
     outside it the field holds its edge colour). T lists the terms u^i·v^j as 'ij' pairs (u, v: 0–1 across the box), c
     their RGB coefficients (0–255). mean: the meander (x-led); left: the purple field (copy box, text, bars, band and
     sphere masked); panel: the lower right panel; sbar: its stripe bars; lilac / mag / pill: the rect, the rounded band
     and the pill under the tiles; tdK / tbK: tile K's quarter disc and its background. */
  const FIT = {
    mean: { box: [328, 540, 1918, 1080], T: '00102030400111', c: [[225.7, 99.4, 50.9], [30.2, 105.3, 89.2], [127.4, -82.5, -389.9], [-224.6, 139.5, 637.5], [95.5, -55.1, -270.4], [1.1, 0.3, -0.8], [-2.6, 0.2, 3.5]] },
    left: { box: [0, 0, 1108, 1080], T: '000102030410111213202122303140', c: [[72.7, 4.2, 204.9], [-30.6, -73.9, -58.8], [290.1, 285.3, 617.9], [-381.2, -312.3, -857.6], [162.3, 119.4, 351.4], [11.6, -19.4, -14.8], [-158.1, -153.4, -92.7], [319.2, 388.7, 68.1], [-215.7, -239.5, 4.9], [2.6, 145.7, -145.6], [282.3, 173.1, 309], [-44.1, -92.1, -125], [-169.9, -294.4, 529.2], [-71.6, 36.3, -257.2], [159.3, 171.8, -403.2]] },
    panel: { box: [1112, 464, 1918, 1080], T: '000102030410111213202122303140', c: [[102.3, 49.4, 259.1], [-7.6, 3.2, -106.8], [-102.1, -119.1, 316.8], [66.3, 5.9, -460.4], [10.3, 73.6, 230.4], [-33.4, 3.6, 10.9], [4.8, -52.7, 361], [9.5, -74.7, 13.5], [-58.2, -60.9, -182.5], [591.5, 272.4, -241.3], [76.1, 227, -367.1], [45.8, 142.6, 331.1], [-357.5, -170.6, -1075.3], [-38, -179.2, -177.7], [-60.3, -14.4, 1105.1]] },
    sbar: { box: [1762, 470, 1918, 1080], T: '0001020304051011', c: [[242.1, 135.6, 27.9], [-51.2, -303.3, -86.1], [-3433.4, -294, 5073.6], [12478.6, 1929.4, -19316], [-14709.7, -1405.1, 24988], [5725.6, 129.4, -10546.1], [7.3, 8, -7.4], [-8, -7.5, 12.5]] },
    lilac: { box: [1112, 222, 1918, 462], T: '0010200111', c: [[225.6, 213.2, 268.1], [-76.8, -287.2, -333.7], [-38, 96.6, 307.5], [-1.3, -4.5, -26.6], [-14, 10.8, 155.7]] },
    mag: { box: [1112, 256, 1918, 462], T: '0010203001', c: [[217.5, 80.5, 264.2], [-138.3, 80.2, -145.4], [73.5, -213.3, -31.8], [-41.2, 74.3, 164.4], [-0.6, -0.3, -1.6]] },
    pill: { box: [1250, 389, 1918, 462], T: '0010203001', c: [[206.1, 173.3, 242.8], [-32.6, -270.8, -380.8], [-120, 198.9, 651.6], [55, -80.3, -268.3], [0.8, -0.3, -2]] },
    td0: { box: [1112, 0, 1315, 224], T: '000102030410111213202122303140', c: [[267.1, 172.3, -24.3], [-261, -81.9, 574.5], [1313.9, 239.5, -2611.9], [-2488.4, -963.1, 4414.9], [1309, 662.8, -2168.8], [-105.2, -33.6, 101.6], [1349.3, 373.1, -3171.1], [-2787.2, -484, 6724.6], [1804.6, 125.1, -4089.6], [254.2, -173.9, 207.1], [-2577.7, -811, 5544.4], [1187.7, 709.8, -3785.3], [-222.8, 101.9, -201], [1641.3, 393.2, -3030.2], [51.4, 23.1, 25.5]] },
    tb0: { box: [1112, 0, 1314, 222], T: '001001', c: [[74.2, -0.6, 169.3], [51.9, 50.4, -34.7], [25.1, 22.8, 1.3]] },
    td1: { box: [1313.5, 0, 1516.5, 224], T: '00010210111220', c: [[221.4, 101.5, 67], [76.3, 70.1, -58.8], [-46.1, 34.3, 115.8], [6.8, -0.3, -24.5], [-9.7, 10.5, 34.7], [13.8, -15.3, -49.2], [-5.1, -0.7, 18.1]] },
    tb1: { box: [1313.5, 0, 1515.5, 222], T: '001001', c: [[132.3, 57.2, 135.5], [41.8, 40.4, -21.6], [20.8, 17.5, -0.3]] },
    td2: { box: [1515, 0, 1718, 224], T: '00010210111220', c: [[249.5, 130.9, 127.7], [2.3, 28, 27.6], [-19.1, -89.2, -58.3], [18.4, 3.5, 5.4], [7, 21, -5.3], [-8.1, -35.2, -0.9], [-17.8, -5.3, -3.4]] },
    tb2: { box: [1515, 0, 1717, 222], T: '001001', c: [[182.7, 105.7, 105.4], [16.8, 20.1, -4.9], [16.1, 14.1, 7.2]] },
    td3: { box: [1716.5, 0, 1919.5, 224], T: '00010210111220', c: [[112.6, 23.7, 238.2], [57.6, 24.6, -41], [49.3, 24.4, -42.6], [-18.2, -23.4, 25.9], [-22.3, 1, -3.9], [44.5, 4.9, -7.6], [17.7, 20.6, -22.7]] },
    tb3: { box: [1716.5, 0, 1918.5, 222], T: '001001', c: [[204.6, 129.3, 104.2], [5.1, 2.6, -4], [10.9, 15.9, 4.5]] },
  };
  const f1 = x => (Math.abs(x) < 1e-9 ? 0 : x).toFixed(3);
  const glslFit = name => { const F = FIT[name], [x0, y0, x1, y1] = F.box, terms = [];
    for (let k = 0; k < F.T.length / 2; k++) { const i = +F.T[2 * k], j = +F.T[2 * k + 1], c = F.c[k];
      const m = [...Array(i).fill('u'), ...Array(j).fill('v')].join(' * ');
      terms.push(`vec3(${c.map(f1).join(', ')})${m ? ' * ' + m : ''}`); }
    return `vec3 f_${name}(vec2 b) { vec2 q = clamp((b - vec2(${f1(x0)}, ${f1(y0)})) / vec2(${f1(x1 - x0)}, ${f1(y1 - y0)}), 0.0, 1.0); float u = q.x, v = q.y;\n  return (${terms.join(' + ')}) / 255.0; }\n`; };

  /* ---------- the meander's geometry (board px, y down) ---------- */
  const Y0 = 877, RO = 201, RI = 36, UC = [530, 1005, 1478], AC = [768, 1716], TX = 1241, TY = 749;
  // inside the band (m > 0: at least m px inside its edges)
  const inBand = (x, y, m = 0) => {
    const ro = RO - m, ri = RI + m;
    if (y >= Y0) { for (const c of UC) { const r = Math.hypot(x - c, y - Y0); if (r >= ri && r <= ro) return true; } return false; }
    for (const c of AC) { const r = Math.hypot(x - c, y - Y0); if (r >= ri && r <= ro) return true; }
    if (y <= TY) { const r = Math.hypot(x - TX, y - TY); return r >= ri && r <= ro; }
    const d = Math.abs(x - TX); return d >= ri && d <= ro;
  };
  // path length along the band's centre line (0 at the left arm's end, 2488 at the right arm's end), for drawing it in
  const S_GLSL = `float sMe(vec2 b) {
  float x = b.x, y = b.y, PI = 3.14159265;
  // (fix pass 2: the last arch's right leg ends ON the line y 877 (its bottom face), which the valleys' branch took for
  //  the middle valley's end (s 2116): it showed early as a loose sliver at the drawing head. Past x 1700 it is the end.)
  if (y >= 877.0 && x > 1700.0) return 2488.0;
  if (y >= 877.0) {
    float c = abs(x - 530.0) < abs(x - 1005.0) ? 530.0 : (abs(x - 1005.0) < abs(x - 1478.0) ? 1005.0 : 1478.0);
    float s0 = c < 600.0 ? 0.0 : (c < 1100.0 ? 744.0 : 1744.0);
    return s0 + (PI - atan(y - 877.0, x - c)) / PI * 372.0;
  }
  float c = abs(x - 768.0) < abs(x - 1241.0) ? 768.0 : (abs(x - 1241.0) < abs(x - 1716.0) ? 1241.0 : 1716.0);
  if (c == 1241.0) {
    if (y > 749.0) return x < c ? 1116.0 + (877.0 - y) : 1744.0 - (877.0 - y);
    return 1244.0 + (PI + atan(y - 749.0, x - c)) / PI * 372.0;
  }
  return (c < 1000.0 ? 372.0 : 2116.0) + (PI + atan(min(y - 877.0, -0.001), x - c)) / PI * 372.0;
}
`;

  /* ---------- pieces for hold 16: flat at the hold, board-field colour, living slide locked to the key instant ---------- */
  const all = [];
  const FP = (spec, field, o = {}) => {
    const pc = V.piece({ hold: 16, drift: 0, ...spec });
    const pa = o.flare ? pc.mesh.geometry.attributes.position.array.slice() : null;
    G.flatFor(pc, 16, spec.at, spec.depth);
    // (flare: the sides open out a little MORE than the key camera's view rays (by o.flare of that taper), so near the key
    //  they face away from the camera and are culled instead of being near edge-on slivers. The renderer's MSAA with its
    //  log depth draws such slivers as a one-frame 1-px hairline over whatever is in front (here: across the sphere as it
    //  bounces on the tall crown right below these bands). The key view is unchanged: only the front face shows there.)
    // (flareAxes: [x, y, z] weights; the tiles flare in y only, so their bottom faces turn away near the key)
    if (pa) { const g = pc.mesh.geometry, q = g.attributes.position, ax = o.flareAxes || [1, 1, 1]; for (let i = 0; i < q.array.length; i++) q.array[i] += o.flare * ax[i % 3] * (q.array[i] - pa[i]);
      q.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingBox(); g.computeBoundingSphere(); }
    const m = pc.mesh.material;
    // (fix pass 2: the band's spring) o.dip: the vertex shader lowers the surface round a contact point dC (world) along
    // −dN by dA, falling off over dS (world units) along the track's plane; g4.js's dip16 drives it, and the ball rides it
    if (o.dip) {
      Object.assign(m.uniforms, { dC: { value: new Vec(0, -1e4, 0) }, dN: { value: new Vec(0, 1, 0) }, dA: { value: 0 }, dS: { value: 1.7 } });
      const vs = m.vertexShader.replace('varying vec3 vW;', 'uniform vec3 dC, dN; uniform float dA, dS;\nvarying vec3 vW;')
        .replace('vW = w.xyz;', 'if (dA > 0.0) { vec2 q = w.xy - dC.xy; w.xyz -= dN * dA * exp(-dot(q, q) / (dS * dS)); }\n  vW = w.xyz;');
      if (vs.indexOf('dA > 0.0') < 0) throw new Error('f16: engine vertex shader changed; the band dip could not hook it');
      m.vertexShader = vs;
    }
    m.uniforms.ban = { value: new THREE.Vector2(...spec.at) };
    m.uniforms.bsd = { value: new THREE.Vector2(...(o.sd || [12, 8])) };
    m.uniforms.bof = { value: new THREE.Vector2(...(o.off || [0, 0])) };
    m.uniforms.bT = { value: TK };
    let decl = 'uniform vec2 ban, bsd, bof; uniform float bT;\n' + glslFit(field), pre = '';
    if (o.reveal) {
      // (fix pass 2: the path length is measured at the fragment's true board px: flatGeo pushed the back vertices out
      //  along the hold's view rays by up to spec.thick / spec.depth of their offset from the view centre, which shifted
      //  the back of the walls across the regions' boundaries; uTau / uZb undo that push, by the fragment's depth in it)
      const g = pc.mesh.geometry; g.computeBoundingBox();
      m.uniforms.sHead = { value: -1e4 }; m.uniforms.uTau = { value: spec.thick / spec.depth }; m.uniforms.uZb = { value: Math.min(-1e-6, g.boundingBox.min.z) };
      decl += 'uniform float sHead, uTau, uZb;\n' + S_GLSL;
      pre = 'float tz = uTau * clamp(vO.z / uZb, 0.0, 1.0); float sB = sMe((b0 + vec2(960.0, 540.0) * tz) / (1.0 + tz)); if (sB > sHead) discard;\n  ';
    }
    // the track's rail: its up-facing surfaces (the crowns' tops the sphere bounces on) catch a warm top light, and the
    // sphere casts a soft contact shadow on them (never on the faces that look at the key camera: the board stays the board)
    let post = '';
    if (o.rail) {
      m.uniforms.bcp = o.rail.bcp;
      decl += 'uniform vec3 bcp;\n';
      post = `vec3 wn = normalize(vN); float up = smoothstep(0.35, 0.85, wn.y) * (1.0 - smoothstep(0.6, 0.98, abs(normalize(vNv).z)));
  float dd = max(0.0, length(vW - bcp) - 1.0), cs = 1.0 - 0.32 * exp(-dd * dd / 0.06) * smoothstep(0.2, 0.7, wn.y);
  cc = mix(cc, cc * 1.16 + vec3(0.06, 0.035, 0.0), 0.8 * up) * cs;`;
    }
    // (fix pass 2, the look review: the track's drawing head was an open, hollow cut. While it draws itself in, the band
    //  renders both sides and its inside (back faces) in one flat, side-shaded colour, so the cut reads as a solid
    //  cross-section: the classic capping trick for a clipped solid)
    const cap = o.reveal ? `if (!gl_FrontFacing) cc = f_${field}(bp) * 0.74;` : '';
    const fs = m.fragmentShader.replace('#include <logdepthbuf_pars_fragment>', '#include <logdepthbuf_pars_fragment>\n' + decl)
      .replace('gl_FragColor = vec4(col * shade, op);', `vec2 b0 = vec2(ban.x + vO.x, ban.y - vO.y);
  ${pre}vec2 bp = b0 - bof + bsd * min(flow, 1.6) * (sin((t - bT) * spd / per * 6.2832 + ph) - sin(ph));
  vec3 cc = f_${field}(bp) * shade;
  ${post}
  ${cap}
  gl_FragColor = vec4(cc, op);`);
    if (fs === m.fragmentShader) throw new Error('f16: engine shader changed; the board fields could not hook it');
    m.fragmentShader = fs; m.needsUpdate = true;
    all.push(pc);
    return pc;
  };
  const rect = (x0, y0, x1, y1) => ({ shape: SH.rr(x1 - x0, y1 - y0, 0), at: [(x0 + x1) / 2, (y0 + y1) / 2] });
  // (2026-09-28, the rollercoaster) the set stays in the world; the camera's crane down after the sphere carries it off the
  // top of the frame (no fly-outs, no un-drawing the track). T_GONE: switched off once it is out of view.
  const T_GONE = 73.9;

  /* ---------- the backdrop: the purple left field and its peach bars ---------- */
  // the left field runs well past the left and top edges (the camera out of the wipe is closer, higher and to the left)
  // and under the right column (its seam at x 1110 is a real step: the right column stands 1.4–2.4 u in front)
  // (fix pass: it leaves earlier, receding as it fades, so its edge isn't on screen as a loose card at 71.6–72.2)
  // (2026-09-28: it keeps this exit when the rest of the set stays: it is only backdrop, and staying, its bottom edge would
  //  hang across the top of board 17's view at 17's key)
  FP({ ...rect(-650, -380, 1130, 1250), depth: 42.0, thick: 0.8, keys: { z: [[71.15, 0], [71.95, 9, 'power2.in']], op: [[71.25, 1], [71.85, 0, 'sine.in']] } }, 'left', { sd: [14, 10] });
  // four peach bars from above the frame, fading into the purple below the copy box
  [[273, 293], [322, 342], [372, 392], [421, 441]].forEach(([p, q], i) => {
    // (fix pass: end 60 px higher, still under the copy box at the key)
    // (fix pass 2, the look review: this comment used to sit at the end of the next line and swallowed thick and grad, so
    //  the bars drew the engine's default flat purple; they are board 16's peach → mauve → purple again)
    const pc = G.PC({ hold: 16, ...rect(p, -330, q, 500), depth: 41.3, thick: 0.3, grad: { cols: ['#f8bf9e', '#c95548', '#600cec'], from: [0, 180], to: [0, 540] },
      in: { type: 'slide', from: 'top', t: [66.95 + 0.06 * i, 67.6 + 0.06 * i] } });
    all.push(pc);
  });

  /* ---------- the right column ---------- */
  // (fix pass: the right column runs on to board x XR, ~650 px past the frame's right edge, so the camera's release to the
  //  right after the key sees more of the set rather than a bare vertical cut; f17's ambient discs keep clear of it)
  const XR = 2600;
  // the lower panel (blue-violet → orange), its four stripe bars (mauve above the band, peach below; they leave with it)
  // (2026-09-28, the bounce: its top edge runs up to 300, hidden behind the lilac rect and magenta band (it was 450, where
  //  its near edge-on top face drew a one-frame hairline across the sphere bouncing on the tall crown, ~70.35))
  FP({ ...rect(1110, 300, XR, 1150), depth: 40.6, thick: 0.8 }, 'panel', { sd: [14, 8] });
  // (fix pass 2, both reviews: sliding up "from bottom", a bar showed below the track from the low camera as a lone rod
  //  hanging under it; the bars now fade in where they sit, on their panel, staggered)
  [[1762, 1780], [1806, 1828], [1854, 1874], [1900, 1925]].forEach(([p, q], i) =>
    FP({ ...rect(p, 470, q, 1130), depth: 40.25, thick: 0.25, drift: 2, in: { type: 'fade', t: [67.3 + 0.07 * i, 67.95 + 0.07 * i] } }, 'sbar', { sd: [0, 14] }));
  // (a second group of the stripe bars on the panel's run-on, so it isn't one flat block of orange)
  [[2182, 2200], [2226, 2248], [2274, 2294], [2320, 2345]].forEach(([p, q], i) =>
    FP({ ...rect(p, 470, q, 1130), depth: 40.25, thick: 0.25, drift: 2, in: { type: 'fade', t: [67.6 + 0.07 * i, 68.25 + 0.07 * i] } }, 'sbar', { sd: [0, 14], off: [420, 0] }));
  // the four tiles: backgrounds, and quarter discs (quarter ellipses 203 × 224 px on the tile's top-left corner, convex
  // edge bottom-right; they run on above the frame's top edge as plain tile)
  // (tiles 4–6 continue the row past the right edge, with tiles 0–2's colour fields shifted onto them)
  // (fix pass 2, the look review: a 1-px dark line flickered across the top of the lilac rect through the slow window: the
  //  tiles' hidden bottom edges (board y 232, just behind it), near edge-on faces that the renderer's MSAA with log depth
  //  draws through what is in front. The tiles and quarter discs now flare in y (their bottom faces turn away from the key
  //  camera) and are single-sided once their flip-in is over (FLIPPED), so those faces are culled near the key.)
  const flips = [], FX = 0.3;                                                   // (x flare: the tiles' side faces at the boundaries too)
  for (let k = 0; k < 7; k++) {
    const x0 = 1112 + 201.5 * k, x1 = k === 6 ? XR + 50 : x0 + 205.5, at = [x0 + 101, -14], j = k % 4 === k ? k : k - 4, off = [201.5 * (k - j), 0];
    const P = (x, y) => [x - at[0], at[1] - y];
    flips.push(FP({ shape: SH.rr(x1 - x0, 492, 0), at: [(x0 + x1) / 2, -14], depth: 40.0 + 0.08 * (k % 2), thick: 0.5,
      in: { type: 'flip', t: [67.0 + 0.12 * k, 67.55 + 0.12 * k] } }, 'tb' + j, { sd: [8, 8], off, flare: 1.0, flareAxes: [FX, 1, 0] }));
    const s = new THREE.Shape(); s.moveTo(...P(x0, -260)); s.lineTo(...P(x0 + 203, -260)); s.lineTo(...P(x0 + 203, 0));
    for (let i = 1; i <= 48; i++) { const a = i / 48 * Math.PI / 2; s.lineTo(...P(x0 + 203 * Math.cos(a), Math.min(222, 224 * Math.sin(a)))); }
    s.lineTo(...P(x0, -260));
    flips.push(FP({ shape: s, at, depth: 39.75 + 0.06 * (k % 2), thick: 0.35, drift: 2,   // (fix pass: neighbours overlap 1.5 px above the frame: they alternate in depth, like the tiles)
      in: { type: 'flip', t: [67.08 + 0.12 * k, 67.63 + 0.12 * k] } }, 'td' + j, { sd: [10, 10], off, flare: 1.0, flareAxes: [FX, 1, 0] }));
  }
  const FLIPPED = 68.5;                                                         // (single-sided once the flip-in is over)
  anim(t => { const side = t > FLIPPED ? THREE.FrontSide : THREE.DoubleSide; for (const pc of flips) pc.mesh.material.side = side; });
  // under the tiles: the lilac rect, the magenta band with its rounded top-left corner (r 200), the lilac pill (r 72.5)
  // (2026-09-28, the bounce: these three bands' bottom edges sit right above the tall crown, where the sphere now bounces
  //  at the key; flare 1.0 keeps their sides culled near the key, see FP)
  FP({ ...rect(1110, 222, XR, 463), depth: 39.6, thick: 0.45, in: { type: 'slide', from: 'right', t: [67.05, 67.75] } }, 'lilac', { sd: [14, 4], flare: 1.0 });
  FP({ shape: SH.cornerRect(XR - 1112, 206, 200, 'tl'), at: [(1112 + XR) / 2, 359], depth: 39.35, thick: 0.4, drift: 2, in: { type: 'slide', from: 'right', t: [67.15, 67.85] } }, 'mag', { sd: [16, 0], flare: 1.0 });
  FP({ shape: SH.cornerRect(XR - 1250, 73, 72.5, 'tl'), at: [(1250 + XR) / 2, 425.5], depth: 39.1, thick: 0.3, drift: 2, in: { type: 'slide', from: 'right', t: [67.25, 67.95] } }, 'pill', { sd: [16, 0], flare: 1.0 });

  /* ---------- the meander: a thick 3D track (two parts, one outline) ---------- */
  // (2026-09-28) The band is a 3.1 u deep track (its front face 1.35 u in front of the sphere's centre plane, its back face
  // 1.75 u behind; the sphere bounces on its crowns in that plane). The tall arch's crown is a plain rounded arch like the
  // others (the rollercoaster build's cup, cut into its front part, is gone at the user's word). The two parts, the back
  // 0.75 u and the front 2.35 u, now share one outline (kept as two only for the material counter; see the header).
  // Both are flat at the hold (sides along the hold camera's view rays) and take board 16's colour field by board px.
  const arc = (cx, cy, r, a0, a1, n) => { const p = []; for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return p; };
  const crown = () => arc(TX, TY, RO, 360, 180, 56);
  const outlineOf = () => [
    ...arc(530, Y0, RO, 180, 0, 48), ...arc(768, Y0, RI, 180, 360, 20), ...arc(1005, Y0, RO, 180, 0, 48),
    [TX - RI, Y0], ...arc(TX, TY, RI, 180, 360, 20), [TX + RI, Y0], ...arc(1478, Y0, RO, 180, 0, 48), ...arc(1716, Y0, RI, 180, 360, 20),
    ...arc(1716, Y0, RO, 360, 180, 48), ...arc(1478, Y0, RI, 0, 180, 20), [TX + RO, Y0], ...crown(), [TX - RO, Y0],
    ...arc(1005, Y0, RI, 0, 180, 20), ...arc(768, Y0, RO, 360, 180, 48), ...arc(530, Y0, RI, 0, 180, 20)];
  const clean = outline => { const q = outline.filter((v, i) => !i || Math.hypot(v[0] - outline[i - 1][0], v[1] - outline[i - 1][1]) > 0.5);
    if (Math.hypot(q[0][0] - q.at(-1)[0], q[0][1] - q.at(-1)[1]) < 0.5) q.pop(); return q; };
  const bandAt = [1120, 800], bcp = { value: new Vec(0, -1e4, 0) };
  const band = clean(outlineOf());
  // (fix pass 2, the look review: where the two parts met, a dotted light seam ran along every side wall like a crack.
  //  The front part is now the whole track (3.1 u); the back part is kept only for the engine's material counter, never
  //  drawn.)
  const back = FP({ shape: SH.poly(band, bandAt), at: bandAt, depth: D16 + 1.0, thick: 0.75 }, 'mean', { sd: [18, 0], reveal: true, rail: { bcp } });
  back.visible = false;
  const front = FP({ shape: SH.poly(band, bandAt), at: bandAt, depth: D16 - 1.35, thick: 3.1 }, 'mean', { sd: [18, 0], reveal: true, rail: { bcp }, dip: true });
  const bands = [back, front];
  // (fix pass 2, the look review: the curved walls shaded facet by facet (flat normals), a venetian-blind banding against
  //  the no-hard-bands rule. The walls get smooth normals: each vertex averages the faces round it that are within 35° of
  //  its own, so the arcs shade smoothly while the flat ends' corners and the front and back faces stay crisp.)
  const smoothCrease = (g, deg) => {
    if (g.index) return;
    const P = g.attributes.position.array, N = g.attributes.normal.array, nt = P.length / 9, cosT = Math.cos(deg * Math.PI / 180);
    const fa = new Float32Array(nt * 3), fu = new Float32Array(nt * 3), map = new Map(), key = i => `${Math.round(P[3 * i] * 50)},${Math.round(P[3 * i + 1] * 50)},${Math.round(P[3 * i + 2] * 50)}`;
    for (let f = 0; f < nt; f++) {
      const a = 9 * f, e1 = [P[a + 3] - P[a], P[a + 4] - P[a + 1], P[a + 5] - P[a + 2]], e2 = [P[a + 6] - P[a], P[a + 7] - P[a + 1], P[a + 8] - P[a + 2]];
      const c = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]], l = Math.hypot(...c) || 1;
      for (let k = 0; k < 3; k++) { fa[3 * f + k] = c[k]; fu[3 * f + k] = c[k] / l; }
      for (let v = 0; v < 3; v++) { const kk = key(3 * f + v); let L = map.get(kk); if (!L) map.set(kk, L = []); L.push(f); }
    }
    for (let f = 0; f < nt; f++) for (let v = 0; v < 3; v++) {
      const i = 3 * f + v, s = [0, 0, 0];
      for (const h of map.get(key(i))) if (fu[3 * h] * fu[3 * f] + fu[3 * h + 1] * fu[3 * f + 1] + fu[3 * h + 2] * fu[3 * f + 2] > cosT) for (let k = 0; k < 3; k++) s[k] += fa[3 * h + k];
      const l = Math.hypot(...s) || 1; for (let k = 0; k < 3; k++) N[3 * i + k] = s[k] / l;
    }
    g.attributes.normal.needsUpdate = true;
  };
  smoothCrease(front.mesh.geometry, 35);
  anim(t => { if (t > 66.8 && t < 74.1) bcp.value.copy(G.ballAt(t)); });
  // the band's dip under each bounce (g4.js's dip16: the ball rides the same dip)
  { const u = front.mesh.material.uniforms;
    anim(t => { const d = G.dip16 && G.dip16(t); if (!d) { u.dA.value = 0; return; } u.dC.value.copy(d.P); u.dN.value.copy(d.n); u.dA.value = d.D; }); }

  /* ---------- in: the track draws itself along its length (it stays drawn: no un-draw behind the sphere) ---------- */
  {
    const us = bands.map(pc => pc.mesh.material.uniforms), cl = x => Math.min(1, Math.max(0, x));
    anim(t => {
      const a = cl((t - 66.9) / 1.05);
      for (const u of us) u.sHead.value = t < 66.9 ? -1e4 : -40 + 2640 * (1 - (1 - a) ** 2);
      // (the cap: both sides only while the cut is open, the head drawing in)
      front.mesh.material.side = t < 67.97 ? THREE.DoubleSide : THREE.FrontSide;
      if (t < 66.8 || t > T_GONE) for (const pc of all) pc.mesh.visible = false;   // frame 16's set lives only in its window
    });
  }

  V.unplate(16);
};
