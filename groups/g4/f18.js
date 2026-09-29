/* Frame 18 · the soft-serve swirl: frontal hold (fov 26); the sphere comes round the front of the upper coil
   (G4, called from g4.js with its context G). User: "do the best with 17 → 18, where it rolls along the squiggly tube".
   Built (batch 4): the real set, no plate (V.unplate(18)).
   · THE SWIRL is one fat tube wound round the sphere's own helix. Its vertical sections are ellipses (half-width A out,
     half-height AV; consecutive coils overlap, so they stack with shallow creases, no gaps and no core showing). It is
     solved from G's helix (axis G.ax/G.az, radius G.rOf, pitch G.PITCH, taper G.DRAD), so it carries the sphere whatever
     helix the journey uses: the sphere rides the groove between two coils, touching the coil below and just clear of the
     coil above (board 18: "in the groove, a further coil continuing above it"). Above the landing the tube gathers into
     the soft-serve's tip; below the exit the coils flare and the lowest one lies flat on the U's floor top (G.yF − 1).
     Clearance along the whole ride is 0.98–1.00 (sphere radius 1), and the sphere's drop onto the U clears every coil
     (measured with a clearance probe when it was built).
   · Board match: the journey's helix (RK 2.0) makes a slim swirl; with the widened helix and the 7° downward tilt of hold
     18's camera asked for in the report (both keep G.M18 on the board's sphere) the coils land on board 18's.
   · Colour follows the side, not the height (board 18): violet on the left/back → magenta → pink → peach on the right,
     as if lit from the right; the lower coils more orange, the upper ones paler pink; each coil's underside goes violet so
     the coils read. Living: the colour field slides a little over time (flow level, capped), phase-locked to the board at
     the key instant (a smooth field: no bands at any flow level).
   · The contact shadow: a soft dark patch wrapped on the coil under the sphere, riding with it round the swirl.
   · Board shapes as pieces (flat at the hold): the navy backdrop with the maroon glow (top left), the orange → coral →
     magenta panel (top right) and its dark arch-topped pill. Copy areas are left as the board shows them behind the copy.
   · In: the swirl is there from 72 s (the camera finds its tip as it cranes down with the ricochets); the backdrop fades
     in and the panel and pill slide in (77.2–78.7) as the camera lands. Out: the panel and pill slide away as the camera
     drops to floor level (80.7–81.6); everything else goes inside the sphere fill (82.85: the screen is all sphere).
   Footprint for f19: the swirl stands on the floor top (y = G.yF − 1); its base is within radius 5.5 of (G.ax, G.az). */
export default (V, G) => {
  const { THREE, V3, DEG, THK, THL, THE, PITCH, DRAD, rOf, ax, az, yK, helix, yF, h18, TK18, tLand, tExit, PC, SH, smooth } = G;
  const { mat, scene, anim } = V;
  const TAU = 2 * Math.PI, A = 1.6, AV = 1.85;             // the tube's section: half-width A (radial) and half-height AV (coils overlap, shallow creases)
  const FLOOR = yF - 1;                                    // the U's floor top: the swirl stands on it
  const T_HIDE = 83.1;                                     // inside the sphere fill (82.9–83.4): the frame-18 set goes (integration: was 82.85, before the fill reached the corners)

  /* ---------- the groove: where the coils sit relative to the sphere's helix ----------
     The swirl's section at any angle θ is the union of vertical ellipses (half-width A outward, half-height AV), one per
     turn, centred on the tube's centre line. The coil under the sphere is centred xb in and yb down from the sphere's
     centre, the coil above it one turn up (PITCH higher, DRAD in). Both follow the sphere's helix, so one solve holds for
     the whole ride: the sphere touches the coil below (0.99 from it) and clears the coil above (1.03). */
  // (fix pass) the journey's helix height: its tilt (the creases rise to the right, as board 18's) and its eased
  // correction below the key come from g4.js; the radius rOf carries its left/back bulge
  const yH = G.yH || (th => yK + (th - THK) / TAU * PITCH);
  const ellD = (u, v, a, b) => { u = Math.abs(u); v = Math.abs(v); let t = Math.atan2(v * a, u * b);   // signed distance to an ellipse
    for (let k = 0; k < 16; k++) { const c = Math.cos(t), s = Math.sin(t), f1 = (a * a - b * b) * c * s - u * a * s + v * b * c, f2 = (a * a - b * b) * (c * c - s * s) - u * a * c - v * b * s; t -= f1 / f2; t = Math.min(Math.PI / 2, Math.max(0, t)); }
    const d = Math.hypot(u - a * Math.cos(t), v - b * Math.sin(t)); return (u / a) ** 2 + (v / b) ** 2 < 1 ? -d : d; };
  const groove = (dLow, dUp) => {
    let xb = 1.8, yb = 2.0; const f = (x, y) => [ellD(x, y, A, AV) - dLow, ellD(x + DRAD, y - PITCH, A, AV) - dUp];
    for (let it = 0; it < 40; it++) {
      const F = f(xb, yb), e = 1e-5, Fx = f(xb + e, yb), Fy = f(xb, yb + e);
      const j11 = (Fx[0] - F[0]) / e, j12 = (Fy[0] - F[0]) / e, j21 = (Fx[1] - F[1]) / e, j22 = (Fy[1] - F[1]) / e, det = j11 * j22 - j12 * j21;
      const dx = (F[0] * j22 - F[1] * j12) / det, dy = (j11 * F[1] - j21 * F[0]) / det; xb -= dx; yb -= dy;
      if (Math.abs(dx) + Math.abs(dy) < 1e-9) break;
    }
    return [xb, yb];
  };
  // (the targets are a hair over 1: the helix's slope brings the coils a little closer in 3D than in the vertical section)
  const [XB, YB] = groove(1.02, 1.1);         // (fix pass: 1.1 above (was 1.05): the tilted turns vary the gap to the coil above a little)
  // a smooth max (the lowest coil flattens onto the floor instead of passing through it)
  const smax = (a, b, k) => { const h = Math.max(0, Math.min(1, 0.5 + 0.5 * (a - b) / k)); return b + (a - b) * h + k * h * (1 - h); };

  /* ---------- the tube's centre line, section and ends ---------- */
  const FL = 0.6;                                                   // flare of the coils below the exit (per turn, eased in)
  const flare = ph => { const u = Math.max(0, (THE - ph) / TAU); return FL * u * u / (0.5 + u); };
  const yLow = FLOOR + AV * 0.9;                                     // the lowest centre height: its coil sits on the floor
  const PH_TOP = THL + 235 * DEG;                                    // the tip's end, above the landing
  // the bottom end: a little under one turn after the coil reaches the floor, ending at the back (θ ≡ 180°)
  let PH_FL = THE; while (yH(PH_FL) - YB > yLow - 0.3) PH_FL -= 2 * DEG;
  let PH_BOT = PH_FL - 300 * DEG; PH_BOT = Math.PI + TAU * Math.round((PH_BOT - Math.PI) / TAU);
  const sc = ph => {                                                 // section scale: the tip tapers to a point, the bottom end rounds off
    // (fix pass: the tube stays fat further and then tapers quickly to the point, a soft-serve tip, not a thin stalk)
    const tip = ph <= THL + 25 * DEG ? 1 : 1 - 0.95 * smooth((ph - THL - 25 * DEG) / (PH_TOP - THL - 25 * DEG)) ** 1.6;
    const bot = 0.3 + 0.7 * smooth((ph - PH_BOT) / (45 * DEG));
    return tip * bot;
  };
  const tipIn = ph => smooth((ph - THL - 60 * DEG) / (PH_TOP - THL - 60 * DEG));   // the tip gathers onto the axis
  const rcOf = ph => (rOf(ph) - XB + flare(ph)) * (1 - tipIn(ph));
  const ycOf = ph => smax(yH(ph) - YB, yLow, 0.6) + 1.0 * tipIn(ph) ** 1.6;   // (the tip curls up onto the axis)
  const cen = ph => { const r = rcOf(ph); return V3(ax + r * Math.sin(ph), ycOf(ph), az + r * Math.cos(ph)); };
  // a point on the swirl: turn φ, angle ψ round the section (0 = out, 90° = up); the inner half-width is kept short so no
  // coil reaches far across the axis
  const surf = (ph, ps, out = V3()) => {
    const r = rcOf(ph), s = sc(ph), c = Math.cos(ps), aw = c >= 0 ? A : Math.min(A, Math.max(0.35, r + 0.35));
    const rr = r + s * aw * c, y = Math.max(FLOOR + 0.002, ycOf(ph) + s * AV * Math.sin(ps));
    return out.set(ax + rr * Math.sin(ph), y, az + rr * Math.cos(ph));
  };

  /* ---------- the tube mesh (vertical sections; the seam faces the axis) ---------- */
  const NU = Math.ceil((PH_TOP - PH_BOT) / (1.5 * DEG)), NV = 60;
  const pos = new Float32Array((NU + 1) * (NV + 1) * 3), idx = [];
  const P = V3();
  for (let i = 0; i <= NU; i++) {
    const ph = PH_BOT + (PH_TOP - PH_BOT) * i / NU;
    for (let j = 0; j <= NV; j++) {
      surf(ph, Math.PI + TAU * j / NV, P);                             // ψ from π: the seam is on the inner side
      const k = (i * (NV + 1) + j) * 3; pos[k] = P.x; pos[k + 1] = P.y; pos[k + 2] = P.z;
      if (i < NU && j < NV) { const q = i * (NV + 1) + j; idx.push(q, q + 1, q + NV + 1, q + 1, q + NV + 2, q + NV + 1); }
    }
  }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals();
  { const nr = geo.attributes.normal;                                // outward (the outer side of a coil faces away from the axis)
    const i0 = Math.round(NU / 2), k0 = i0 * (NV + 1) + NV / 2, ph0 = PH_BOT + (PH_TOP - PH_BOT) * i0 / NU;
    if (nr.getX(k0) * Math.sin(ph0) + nr.getZ(k0) * Math.cos(ph0) < 0) { for (let q = 0; q < idx.length; q += 3) { const t = idx[q + 1]; idx[q + 1] = idx[q + 2]; idx[q + 2] = t; } geo.setIndex(idx); geo.computeVertexNormals(); }
    for (let i = 0; i <= NU; i++) { const a0 = i * (NV + 1), a1 = a0 + NV, n0 = V3(nr.getX(a0) + nr.getX(a1), nr.getY(a0) + nr.getY(a1), nr.getZ(a0) + nr.getZ(a1)).normalize(); nr.setXYZ(a0, n0.x, n0.y, n0.z); nr.setXYZ(a1, n0.x, n0.y, n0.z); } }
  const capTop = cen(PH_TOP), capBot = cen(PH_BOT);

  /* ---------- the swirl's colour: board 18's side-lit field (GLSL on the engine's gradient shader) ---------- */
  const hexC = h => { const v = parseInt(h.slice(1), 16); return `vec3(${((v >> 16 & 255) / 255).toFixed(4)}, ${((v >> 8 & 255) / 255).toFixed(4)}, ${((v & 255) / 255).toFixed(4)})`; };
  const base = mat(['#7510f4'], { flat: true });
  const PER = 7.7, u18 = { ...base.uniforms, sK: { value: TK18 }, sPer: { value: PER }, yKey: { value: yK } };
  const SW_GLSL = `uniform float sK, sPer, yKey;
vec3 swirlCol(vec3 nb, vec3 w, float sl) {
  float g = dot(nb, normalize(vec3(1.0, 0.5, 0.1))) + sl;              // lit from the right, a little above
  float up = smoothstep(-5.0, 0.5, w.y - yKey), top = smoothstep(0.5, 4.5, w.y - yKey);   // the lower coils more orange, the upper ones paler
  vec3 cP = mix(mix(${hexC('#dc6c78')}, ${hexC('#dd7f94')}, up), ${hexC('#d690bc')}, top);
  vec3 cE = mix(mix(${hexC('#e8795f')}, ${hexC('#e9999a')}, up), ${hexC('#e6b6d6')}, top);
  vec3 c = ${hexC('#7410f4')};
  c = mix(c, ${hexC('#8a1ddc')}, smoothstep(-0.15, 0.12, g));
  c = mix(c, ${hexC('#b0409e')}, smoothstep(0.1, 0.32, g));
  c = mix(c, mix(${hexC('#c85286')}, ${hexC('#c86aa8')}, top), smoothstep(0.3, 0.52, g));
  c = mix(c, cP, smoothstep(0.5, 0.74, g));
  c = mix(c, cE, smoothstep(0.72, 0.98, g));
  return c;
}
`;
  const fs = base.fragmentShader.replace('#include <logdepthbuf_pars_fragment>', '#include <logdepthbuf_pars_fragment>\n' + SW_GLSL)
    .replace('gl_FragColor = vec4(col * shade, op);', `float sl = 0.1 * min(flow, 1.6) * sin((t - sK) * spd / sPer * 6.2832);
  gl_FragColor = vec4(swirlCol(normalize(vN), vW, sl), op);`);
  if (fs === base.fragmentShader) throw new Error('f18: engine shader changed; the swirl material could not hook it');
  const mSw = new THREE.ShaderMaterial({ uniforms: u18, vertexShader: base.vertexShader, fragmentShader: fs });
  const swirl = new THREE.Mesh(geo, mSw); swirl.frustumCulled = false; scene.add(swirl);
  const caps = [capTop, capBot].map((p, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(A * (i ? sc(PH_BOT) : sc(PH_TOP)) * 1.0, 24, 16), mSw); m.position.copy(p); m.scale.set(1, AV / A, 1); scene.add(m); return m; });
  anim(t => { const v = t > 72 && t < T_HIDE; swirl.visible = v; for (const c of caps) c.visible = v; });

  /* ---------- the contact shadow: a soft dark patch wrapped on the coil below the sphere ---------- */
  {
    const NS = 14, MS = 8, sp = new Float32Array((NS + 1) * (MS + 1) * 3), suv = new Float32Array((NS + 1) * (MS + 1) * 2), si = [];
    for (let i = 0; i <= NS; i++) for (let j = 0; j <= MS; j++) { const k = i * (MS + 1) + j; suv[k * 2] = i / NS * 2 - 1; suv[k * 2 + 1] = j / MS * 2 - 1;
      if (i < NS && j < MS) si.push(k, k + MS + 1, k + 1, k + 1, k + MS + 1, k + MS + 2); }
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3)); sg.setAttribute('uv', new THREE.BufferAttribute(suv, 2)); sg.setIndex(si);
    const sm = new THREE.ShaderMaterial({ uniforms: { op: { value: 0 } }, transparent: true, depthWrite: false, side: THREE.DoubleSide,
      vertexShader: '#include <common>\n#include <logdepthbuf_pars_vertex>\nvarying vec2 vU; void main() { vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}',
      fragmentShader: `uniform float op; varying vec2 vU;\n#include <logdepthbuf_pars_fragment>\nvoid main() { float r = length(vU); float a = 1.0 - smoothstep(0.5, 1.0, r); gl_FragColor = vec4(${hexC('#12061c')}, a * a * op);\n#include <logdepthbuf_fragment>\n}` });
    const shadow = new THREE.Mesh(sg, sm); shadow.frustumCulled = false; shadow.renderOrder = 2; scene.add(shadow);
    const S_PSI = 30 * DEG, S_DPSI = 0.3, S_LEN = 0.72, S_LEAD = 0 * DEG;
    // the helix angle nearest the sphere (coarse over the whole ride, then fine)
    const phOf = p => { let best = THL, bd = Infinity; for (let ph = THE - 0.2; ph <= THL + 0.2; ph += DEG) { const d = helix(ph).distanceToSquared(p); if (d < bd) { bd = d; best = ph; } }
      const c = best; for (let k = -10; k <= 10; k++) { const ph = c + k * 0.1 * DEG, d = helix(ph).distanceToSquared(p); if (d < bd) { bd = d; best = ph; } } return best; };
    anim((t, b) => {
      const on = smooth((t - tLand) / 0.25) * (1 - smooth((t - tExit + 0.05) / 0.2));
      shadow.visible = on > 0.01 && t < T_HIDE && !!b; if (!shadow.visible) return;
      const ph = phOf(b.p);
      const phc = ph + S_LEAD, rr = Math.max(0.8, rcOf(phc) + A * Math.cos(S_PSI)), dph = S_LEN / rr, q = V3();
      for (let i = 0; i <= NS; i++) for (let j = 0; j <= MS; j++) { const k = i * (MS + 1) + j, ps = S_PSI + S_DPSI * (j / MS * 2 - 1), p = surf(phc + dph * (i / NS * 2 - 1), ps, q);
        const nx = Math.sin(phc) * Math.cos(ps), ny = Math.sin(ps), nz = Math.cos(phc) * Math.cos(ps);   // lift it a hair off the coil
        sp[k * 3] = p.x + 0.015 * nx; sp[k * 3 + 1] = p.y + 0.015 * ny; sp[k * 3 + 2] = p.z + 0.015 * nz; }
      sg.attributes.position.needsUpdate = true; sm.uniforms.op.value = 0.82 * on;
    });
  }

  /* ---------- board shapes: backdrop glow, the top-right panel and its arch pill ---------- */
  const D = h18.depth;
  const backdrop = PC({ hold: 18, shape: SH.rr(1920 * 1.9, 1080 * 1.9, 0), at: [960, 540], depth: D + 45, thick: 0.01, drift: 0,
    grad: { cols: ['#5a1e37', '#35164a', '#221259'], c: [10, 10], r: 640 }, in: { type: 'fade', t: [77.2, 78.3] } });
  // (fix pass: the panel's ramp runs more along x, as board 18's: coral at the top-right corner, not orange)
  const panel = PC({ hold: 18, shape: SH.rr(560, 780, 46), at: [1720, 250], depth: D + 20, thick: 1.6, drift: 2,
    grad: { cols: ['#fb8a24', '#d8565a', '#7a2064'], from: [1450, 0], to: [1850, 380] }, in: { type: 'slide', from: 'right', t: [77.35, 78.6] }, out: { type: 'slide', from: 'right', t: [80.75, 81.6] } });
  const pill = PC({ hold: 18, shape: SH.archFill(236, 540), at: [1719, 640], depth: D + 19.5, thick: 1.2, drift: 2,
    grad: { cols: ['#48069c', '#3a0886', '#2b0966'], from: [1719, 100], to: [1719, 620] }, in: { type: 'slide', from: 'top', t: [77.5, 78.7] }, out: { type: 'slide', from: 'top', t: [80.7, 81.5] } });
  anim(t => { if (t >= T_HIDE) for (const p of [backdrop, panel, pill]) p.mesh.visible = false; });

  V.unplate(18);
};
