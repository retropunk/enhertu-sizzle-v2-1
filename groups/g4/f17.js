/* Frame 17 · floating discs: frontal hold (fov 26) on the four painted discs; the sphere ricochets disc to disc
   (user: "lean into" v1's ball bouncing between the floating discs, "really fun") (G4, called from g4.js with its context G).
   Built (batch 4): the real set, no plate.
   Hold: 73.55–75.15, key G.TK17 = 74.35; camera G.h17 (looking −z). G.w17(px, py, dz) = board 17 px → world at the
   sphere's depth G.D17 (+ dz). 1 board px = 1/64 u at that depth (G.PX17 = 64: the 128 px sphere is 2 u across).
   The ricochet chain (journey, g4.js; every contact point is a ball centre, ballistic arcs under G.GD = 12 u/s² between):
     A (above frame 17) → B_ → D1 → D2 → the key (G.M17, mid-arc) → D3 (0.05 s after the key) → D4 → E1 → E2 (below it)
     → the swirl's tip (G.Lp at G.tLand, where frame 18's helix takes over).
   · The four board discs are real discs (a thin cylinder: face, rim, back). Each is solved against the hold camera from
     board 17's painted ellipse: centre on the view ray through the painted centre, radius from the long axis, the face
     normal from the long axis's tilt and the face's aspect, turned to the side whose rim the board shows (D1 and D3 show
     their right faces and a rim on the left, D2 and D4 their left faces and a rim on the right: the zigzag). Its depth
     puts the ball's contact exactly on the face (each contact hits near the disc's centre), so D4 reads nearest, D1
     furthest, as painted. Faces: board 17's linear gradient along the long axis (orange at one end, deep blue in the
     middle, violet at the other); rims: pale peach at the face's orange end, lilac, orange at the other.
   · The ricochet is physically exact at every contact: the journey's bounce normals differ from the painted tilts
     (D1 ~40°, D2 ~35°, D4 ~25°), so those discs are paddles: D1 and D2 wait at the bounce angle, take the hit and swing
     back to their painted pose (settled before the key); D4 winds up to the bounce angle after the key, swats the ball
     and swings back. D3 (hit 0.05 s after the key) already matches. Every disc also recoils, flexes and bobs when hit
     (v1's disc reactions), and grows in (staggered) as the camera cranes down to it.
   · The board's motion trail: ten fading translucent echo rings behind the sphere through the ricochets.
   · Stand-in discs A, B (above the frame) and E1, E2 (below it), in the same style, face their bounces exactly.
   · Board 17's shapes, as pieces (flat at the hold, chunky while moving): the backdrop (dark navy with the maroon glow
     top left), the lower-left violet block, the coral-rose → dark violet arch ring across the top right with its dark
     inner pill, and the magenta disc lower right (the copy card, c17.js, is masked by exactly this circle). They slide in
     as the camera lands and slide away as it cranes down after the ball.
   · export ambient: up to 18 ambient floating discs (same style) round disc A (16 → 17) and the swirl's tip (17 → 18),
     skipped where they would show in holds 16–18, near the route or inside the swirl; shown 70.3–79.2. g4.js calls it
     after f18 (the materials' creation order). */
const DEG = Math.PI / 180;
const cl = u => Math.min(1, Math.max(0, u));
const backOut = (u, s = 1.5) => { u = cl(u) - 1; return 1 + (s + 1) * u * u * u + s * u * u; };
const sio = u => 0.5 - 0.5 * Math.cos(Math.PI * cl(u));
const TH = 0.18, GAP = 1 + TH / 2 + 0.02;             // disc thickness; ball centre → disc mid-plane at a contact

// the disc family: a face gradient along the disc's long axis (local x, −r → r: [bottom end, middle, top end] as seen in
// hold 17), the rim likewise, the back shaded; living gradients calmed and phase-locked to the key instant
function family(V, G) {
  const { THREE } = G;
  const lockAll = ms => ms.forEach(m => { G.calm({ mesh: { material: m } }, 0.4); G.lock({ mesh: { material: m } }, G.TK17); });
  const disc = (r, face, rim) => {
    const ax = { axis: [1, 0, 0], lo: -r, hi: r, local: true };
    const fM = V.mat(face, { ...ax, flat: true }), rM = V.mat(rim, { ...ax, flat: true }), bM = V.mat(face, ax);
    lockAll([fM, rM, bM]);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, TH, 80, 1), [rM, fM, bM]);
    m.frustumCulled = false; V.scene.add(m); return m;
  };
  // orientation with local x = e (long axis, toward the top end), local y = n (the face normal)
  const basisQ = (e, n) => new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(e, n, e.clone().cross(n)));
  // a long axis for a disc of normal n: the hold-17 view's up, laid into the disc's plane
  const upIn = n => { const u = G.h17.upv.clone().addScaledVector(n, -G.h17.upv.dot(n)); if (u.lengthSq() < 0.04) u.copy(G.h17.right).addScaledVector(n, -G.h17.right.dot(n)); return u.normalize(); };
  return { disc, basisQ, upIn };
}
// the two colourings of board 17's discs (face and rim, [bottom, middle, top]): orange at the top, or at the bottom
const STYLE = {
  up: { face: ['#7610f8', '#520ac4', '#e8702a'], rim: ['#ff7a1a', '#8c5cd0', '#f0dce8'] },
  down: { face: ['#e46d25', '#520bb8', '#6a15f8'], rim: ['#f4dcb0', '#d87a50', '#ff7a1a'] },
};

export default (V, G) => {
  const { THREE, V3, GD, A, B_, D1, D2, D3, D4, E1, E2, vAB, vBD1, vD12, vD2K, vD34, vD4E1, vE12, vE2L, hops, tA, tB, tD1, tD2, tD3, tD4, tE1, tE2,
    ballAt, smooth, h17, PC, SH } = G;
  const { scene, anim } = V;
  const F = family(V, G);
  const cam = h17.pos, fwd = h17.fwd, rgt = h17.right, upv = h17.upv, tanV = h17.tanV;
  const ray = (px, py) => fwd.clone().addScaledVector(rgt, (px - 960) / 540 * tanV).addScaledVector(upv, (540 - py) / 540 * tanV).normalize();
  const vEnd = (v0, T) => v0.clone().add(V3(0, -GD * T, 0));
  const HIDE = 79.2;

  /* ---------- the discs: pose, swat, recoil, flex, bob, grow-in ---------- */
  const discs = [];
  const qA = new THREE.Quaternion(), qW = new THREE.Quaternion();
  // d: { m, C, qR (rest), w, ang (swat axis, angle), mode: 'post' | 'pre' | 'none', T (swing back), Tp (wind-up), tHit, nH, g: [grow t0, t1], kn, wob (knock) }
  anim(t => discs.forEach(d => {
    const vis = t >= d.g[0] && t < HIDE; d.m.visible = vis; if (!vis) return;
    const x = t - d.tHit;
    let s = 0;
    if (d.mode === 'post') s = x < 0 ? 1 : 1 - backOut(x / d.T);
    else if (d.mode === 'pre') s = x < 0 ? sio((x + d.Tp) / d.Tp) : 1 - backOut(x / d.T);
    const q = qA.setFromAxisAngle(d.w, s * d.ang).multiply(d.qR);
    if (d.kn && x > 0) q.premultiply(qW.setFromAxisAngle(d.wob, d.kn * Math.exp(-2.8 * x) * Math.sin(9 * x)));
    d.m.quaternion.copy(q);
    const rec = x > 0 && x < 0.45 ? 0.2 * Math.sin(Math.PI * x / 0.45) * (1 - x / 0.45) : 0;          // recoil, away from the ball
    d.m.position.copy(d.C).addScaledVector(d.nH, -rec).addScaledVector(upv, 0.07 * Math.sin(2 * Math.PI * x / 3.1));
    const fl = x > 0 && x < 0.28 ? Math.sin(Math.PI * x / 0.28) : 0;                                   // flex on impact
    const gr = Math.max(1e-3, backOut((t - d.g[0]) / (d.g[1] - d.g[0]), 1.3));
    d.m.scale.set(gr * (1 + 0.12 * fl), gr * (1 - 0.35 * fl), gr * (1 + 0.12 * fl));
  }));

  // (fix pass: D1 and D2 no longer wait at their bounce tilt; like D4 they hold the painted pose and wind up just before
  //  their hit (0.35 / 0.3 s), then swing back, so the slow window shows the board's discs except for the swats)
  // board 17's four discs, solved against the hold camera from the painted ellipses (measured on the board):
  // pc centre, L long axis (px), tilt of the long axis (deg, + = top leaning right), asp face aspect, side of the shown face
  const BD = [
    { P: D1, tHit: tD1, vin: vEnd(vBD1, hops[1]), vout: vD12, pc: [189, 228], L: 220, tilt: 3, asp: 0.28, side: 1, st: STYLE.up, mode: 'pre', Tp: 0.35, T: 0.55, g: [71.95, 72.45] },
    { P: D2, tHit: tD2, vin: vEnd(vD12, hops[2]), vout: vD2K, pc: [438, 376], L: 280, tilt: 17, asp: 0.28, side: -1, st: STYLE.down, mode: 'pre', Tp: 0.3, T: 0.4, g: [72.08, 72.6] },
    { P: D3, tHit: tD3, vin: vEnd(vD2K, tD3 - tD2), vout: vD34, pc: [118, 577], L: 345, tilt: -20, asp: 0.18, side: 1, st: { face: ['#6c10ea', '#540ac0', '#dd6f34'], rim: ['#ff7a1a', '#9a70c8', '#f4e6b0'] }, mode: 'none', g: [72.2, 72.75] },
    { P: D4, tHit: tD4, vin: vEnd(vD34, tD4 - tD3), vout: vD4E1, pc: [436, 801], L: 365, tilt: 29, asp: 0.19, side: -1, st: { face: ['#d0683c', '#4f06c0', '#6f13ef'], rim: ['#f4e2a8', '#c8a0d8', '#ff7a1a'] }, mode: 'pre', Tp: 0.38, T: 0.5, g: [72.32, 72.9] },
  ];
  for (const b of BD) {
    const rc = ray(...b.pc);
    // a pose from the long axis's direction in the picture: the face turned to the camera by the board's aspect, on the
    // side whose rim the board shows (so a swing only turns the disc in the picture, like a clock hand, never flips it)
    const pose = e => { const p = e.clone().cross(rc).normalize(); if (p.dot(rgt) * b.side < 0) p.negate();
      return { e, n: p.multiplyScalar(Math.sqrt(1 - b.asp * b.asp)).addScaledVector(rc, -b.asp) }; };
    const Lv = rgt.clone().multiplyScalar(Math.sin(b.tilt * DEG)).addScaledVector(upv, Math.cos(b.tilt * DEG));
    const R = pose(Lv.clone().addScaledVector(rc, -Lv.dot(rc)).normalize());                      // the painted pose
    const nH = b.vout.clone().sub(b.vin).normalize();                                                 // the bounce normal
    const eH = rc.clone().cross(nH.clone().addScaledVector(rc, -nH.dot(rc))).normalize(); if (eH.dot(upv) < 0) eH.negate();
    const H = pose(eH);                                                                               // the bounce pose: exact in the picture
    const nC = b.mode === 'none' ? R.n : H.n;                                                         // the face's normal at the contact
    const sR = (b.P.clone().sub(cam).dot(nC) - GAP) / rc.dot(nC);
    const C = cam.clone().addScaledVector(rc, sR), dC = C.clone().sub(cam).dot(fwd);
    const r = b.L / 2 * dC * tanV / 540;
    const m = F.disc(r, b.st.face, b.st.rim);
    const qR = F.basisQ(R.e, R.n), qD = F.basisQ(H.e, H.n).multiply(qR.clone().invert());          // the swat: rest → bounce pose
    if (qD.w < 0) qD.set(-qD.x, -qD.y, -qD.z, -qD.w);
    const sh = Math.sqrt(Math.max(0, 1 - qD.w * qD.w)), ang = 2 * Math.acos(Math.min(1, qD.w));
    discs.push({ m, C, qR, w: sh > 1e-6 ? V3(qD.x / sh, qD.y / sh, qD.z / sh) : V3(0, 0, 1), ang, mode: b.mode, T: b.T, Tp: b.Tp, tHit: b.tHit, nH: nC, g: b.g });
  }
  // stand-in discs for the bounces the board doesn't show (A, B above frame 17; E1, E2 below it), each facing its bounce
  {
    // the face is the bounce's, exact in the picture, tipped toward the camera side (+z; the camera looks −z throughout
    // 16 → 18) so it reads as a disc rather than a line from a level camera
    const mk = (P, vin, vout, tHit, rad, st, g) => {
      const nB = vout.clone().sub(vin).normalize(), Z = V3(0, 0, 1);
      const n = nB.clone().addScaledVector(Z, -nB.z).normalize().multiplyScalar(Math.sqrt(1 - 0.3 * 0.3)).addScaledVector(Z, 0.3), C = P.clone().addScaledVector(n, -GAP);
      const m = F.disc(rad, st.face, st.rim);
      discs.push({ m, C, qR: F.basisQ(F.upIn(n), n), w: V3(0, 0, 1), ang: 0, mode: 'none', tHit, nH: n, g, kn: 0.3, wob: V3().crossVectors(nB, vin).normalize() });
    };
    // (2026-09-28, frame 16's rollercoaster: the ball now flies off the meander's last arch straight onto disc B, so disc A
    //  is gone (G.noDiscA) and B faces the ball's real arrival (G.vinB))
    if (!G.noDiscA) mk(A, V3(0, -9.5, 0), vAB, tA, 1.7, STYLE.down, [70.85, 71.3]);
    mk(B_, G.vinB || vEnd(vAB, hops[0]), vBD1, tB, 1.25, STYLE.up, [71.05, 71.5]);            // (1.25: its lower edge stays just above hold 17's frame)
    mk(E1, vEnd(vD4E1, tE1 - tD4), vE12, tE1, 1.9, STYLE.down, [74.55, 75.0]);
    mk(E2, vEnd(vE12, tE2 - tE1), vE2L, tE2, 2.0, STYLE.up, [74.8, 75.25]);
  }

  /* ---------- the board's motion trail: fading translucent echo rings behind the sphere ---------- */
  {
    const cv = document.createElement('canvas'); cv.width = cv.height = 128; const cx = cv.getContext('2d');
    const gr = cx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,0.22)'); gr.addColorStop(0.78, 'rgba(255,255,255,0.3)'); gr.addColorStop(0.93, 'rgba(255,255,255,0.9)');
    gr.addColorStop(0.985, 'rgba(255,255,255,0.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    cx.fillStyle = gr; cx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    const NE = 28, DT = 0.013, gs = [];                      // (fix pass: was 10 rings 0.036 s apart, which read as a slinky)
    for (let k = 0; k < NE; k++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: 0xf3e6ff, transparent: true, depthWrite: false, opacity: 0 })); s.scale.set(2, 2, 1); s.renderOrder = 4; scene.add(s); gs.push(s); }
    anim(t => { const a = smooth((t - (tD1 - 0.25)) / 0.3) * (1 - smooth((t - (tE1 + 0.2)) / 0.3));
      gs.forEach((s, i) => { s.visible = a > 0.01; if (!s.visible) return; s.position.copy(ballAt(t - DT * (i + 1))); s.material.opacity = a * 0.24 * Math.pow(1 - i / NE, 1.3); }); });
  }

  /* ---------- board 17's shapes (pieces: flat at the hold, chunky sides while the camera moves) ---------- */
  const IN = [72.25, 73.15], OUT = [75.25, 75.95];   // (integration: in 0.3 s earlier, so frame 17's world arrives as frame 16's leaves)
  // lower left: the violet block (top 735, rounded top-right corner r 100; runs off the left and bottom, and on behind the picture)
  PC({ hold: 17, shape: SH.cornerRect(940, 665, 100, 'tr'), at: [170, 1067.5], depth: 44, thick: 1.2,
    grad: { cols: ['#2b0861', '#3a068e', '#4a04b6'], from: [0, 900], to: [600, 900] },
    in: { type: 'slide', t: [IN[0] + 0.05, IN[1]], from: 'bottom' }, out: { type: 'slide', t: [OUT[0] - 0.05, OUT[1] - 0.2], from: 'left' },
    keys: { op: [[OUT[0] + 0.15, 1], [OUT[1] - 0.2, 0, 'sine.in']] } });   // (fades as it goes: the crane down would carry it across the frame)
  // top right: the arch ring (outer left edge 958, top 12, corner r 130; coral-rose at the top → dark violet below), and
  // its dark inner pill (left end 1195, 120–340: indigo → violet to the right); both run on off the right edge
  PC({ hold: 17, shape: SH.rr(1742, 564, 130), at: [1829, 270], depth: 47, thick: 1.2,   // (fix pass: top at −12, off the frame, as the board's; was 12)
    grad: { cols: ['#c64c5a', '#7a2369', '#2e0870'], from: [1300, 20], to: [1300, 410] },
    in: { type: 'slide', t: IN, from: 'right' }, out: { type: 'slide', t: OUT, from: 'right' } });
  PC({ hold: 17, shape: SH.pill(1500, 220), at: [1945, 230], depth: 46.8, thick: 0.6,
    grad: { cols: ['#2e0c74', '#29075f', '#500690'], from: [1200, 230], to: [1880, 230] },
    in: { type: 'slide', t: [IN[0] + 0.05, IN[1] + 0.05], from: 'right' }, out: { type: 'slide', t: [OUT[0] - 0.03, OUT[1] - 0.03], from: 'right' } });
  // lower right: the magenta disc (centre 1732.6, 744.1, r 311: the copy card is masked by this circle), magenta → violet down
  PC({ hold: 17, shape: SH.disc(311), at: [1732.6, 744.1], depth: 45.5, thick: 1.4,
    grad: { cols: ['#c80cf2', '#8e10e0', '#5a12d0'], from: [1732, 440], to: [1732, 1000] },
    in: { type: 'grow', t: [IN[0] + 0.15, IN[1] + 0.05], ease: 'back.out(1.3)' }, out: { type: 'slide', t: [OUT[0] + 0.05, OUT[1] + 0.05], from: 'right' } });
  // (fix pass) under the copy's picture frame (its bottom edge is at y ≈ 1016): the board's violet → rose → pale lilac band
  // (770–1500), the violet strip right of it and the dark navy block (1630–1850) that hides the magenta disc's lower rim
  // (they leave with the copy card: they fade as the crane down would otherwise carry them up through the frame)
  const UO = { type: 'fade', t: [OUT[0] - 0.1, OUT[0] + 0.25], ease: 'sine.in' };
  PC({ hold: 17, shape: SH.cornerRect(730, 150, 70, 'bl'), at: [1135, 1075], depth: 45.15, thick: 0.6, drift: 2,
    grad: { cols: ['#7516ec', '#ad53ad', '#dfc6f7'], from: [785, 1040], to: [1485, 1040] },
    in: { type: 'slide', t: [IN[0] + 0.12, IN[1] + 0.08], from: 'bottom' }, out: UO });
  PC({ hold: 17, shape: SH.rr(220, 150, 0), at: [1740, 1075], depth: 45.2, thick: 0.6, drift: 2, grad: { cols: ['#240a5c', '#230a5b', '#1e0851'], from: [1740, 1012], to: [1740, 1080] },
    in: { type: 'slide', t: [IN[0] + 0.18, IN[1] + 0.12], from: 'bottom' }, out: UO });
  PC({ hold: 17, shape: SH.rr(640, 150, 0), at: [1810, 1075], depth: 45.3, thick: 0.6, drift: 2, grad: { cols: ['#47169d', '#46149a', '#3a1286'], from: [1810, 1012], to: [1810, 1080] },
    in: { type: 'slide', t: [IN[0] + 0.15, IN[1] + 0.1], from: 'bottom' }, out: UO });
  // the backdrop: board 17's dark navy, the maroon glow top left, a violet haze at the ring's outer edge and low in the middle
  {
    const hexC = h => { const n = parseInt(h.slice(1), 16); return `vec3(${((n >> 16 & 255) / 255).toFixed(4)}, ${((n >> 8 & 255) / 255).toFixed(4)}, ${((n & 255) / 255).toFixed(4)})`; };
    const bd = PC({ hold: 17, shape: SH.rr(1920 * 5, 1080 * 5, 0), at: [960, 540], depth: 80, thick: 0, drift: 0, flat: false,
      in: { type: 'fade', t: [71.7, 72.6], ease: 'sine.inOut' }, out: { type: 'fade', t: [75.7, 76.6], ease: 'sine.inOut' } }), o0 = bd.mesh.material;
    bd.mesh.material = new THREE.ShaderMaterial({ uniforms: { op: o0.uniforms.op, t: o0.uniforms.t, flow: o0.uniforms.flow, spd: o0.uniforms.spd }, transparent: true, depthWrite: false,
      vertexShader: '#include <common>\n#include <logdepthbuf_pars_vertex>\nvarying vec3 vO;\nvoid main() { vO = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}',
      fragmentShader: `uniform float op, t, flow, spd;\nvarying vec3 vO;\n#include <logdepthbuf_pars_fragment>
void main() { vec2 b = vec2(960.0 + vO.x, 540.0 - vO.y); float w = sin(t * spd * 0.37) * 14.0 * min(flow, 1.6), w2 = cos(t * spd * 0.29) * 14.0 * min(flow, 1.6);
  vec3 c = mix(${hexC('#270b5c')}, ${hexC('#21125e')}, smoothstep(-100.0, 500.0, b.y));
  c = mix(c, ${hexC('#1f1462')}, smoothstep(500.0, 700.0, b.y));
  c = mix(c, ${hexC('#370880')}, 0.7 * (1.0 - smoothstep(0.0, 260.0, length((b - vec2(930.0 + w, 60.0)) / vec2(0.7, 1.3)))));
  c = mix(c, ${hexC('#4a06b0')}, 0.8 * (1.0 - smoothstep(0.0, 420.0, length((b - vec2(640.0 + w2, 1180.0)) / vec2(1.6, 1.0)))));
  c = mix(c, ${hexC('#602334')}, exp(-length(vec2(b.x + w2, 1.15 * (b.y + w))) / 260.0));
  gl_FragColor = vec4(c, op);
#include <logdepthbuf_fragment>
}` });
    bd.mesh.renderOrder = -3;
  }

  V.unplate(17);
};

// ambient floating discs (nothing bounces on them) where the camera travels between the sets, so the space isn't empty;
// any that would show in a hold, sit near the sphere's route or inside the swirl are skipped
export const ambient = (V, G) => {
  const { THREE, V3, h16, h17, h18, ballAt, ax, az, yK, Lp, A } = G;
  const F = family(V, G);
  const inHold = (h, P, r) => { const v = P.clone().sub(h.pos), z = v.dot(h.fwd); if (z <= 0.5) return false; const k = 540 / (z * h.tanV), px = 960 + v.dot(h.right) * k, py = 540 - v.dot(h.upv) * k, pr = r * k; return px + pr > -30 && px - pr < 1950 && py + pr > -30 && py - pr < 1110; };
  const route = []; for (let t = 70.2; t < 81.0; t += 0.04) route.push(ballAt(t));
  const amb = [];
  // (fix pass) frame 16's right column now runs on past hold 16's right edge (to board x 2600, depths ~39–41.4): no disc
  // may sit in or near it
  const inCol16 = (P, r) => { const v = P.clone().sub(h16.pos), z = v.dot(h16.fwd); if (z < 26 - r || z > 42.8 + r) return false;   // (in it, or in front of it)
    const k = 540 / (z * h16.tanV), px = 960 + v.dot(h16.right) * k, py = 540 - v.dot(h16.upv) * k, pr = r * k; return px + pr > 1850 && px - pr < 2700 && py + pr > -300 && py - pr < 1300; };
  const put = (P, rad, k) => {
    if ([h16, h17, h18].some(h => inHold(h, P, rad + 0.4)) || inCol16(P, rad)) return;
    if (route.some(q => q.distanceTo(P) < rad + 1.8)) return;
    if (Math.hypot(P.x - ax, P.z - az) < rad + 4.5 && P.y > yK - 12 && P.y < Lp.y + 4) return;
    const n = V3(Math.sin(k * 1.7) * 0.9 + 0.2, Math.cos(k * 2.3) * 0.5, 0).normalize().multiplyScalar(Math.sqrt(1 - 0.3 * 0.3)); n.z = 0.3;   // edge-on like the board's discs (aspect ~0.3 from the level camera)
    const st = k % 2 ? STYLE.up : STYLE.down;
    const m = F.disc(rad, st.face, st.rim);
    const q0 = F.basisQ(F.upIn(n), n);
    m.position.copy(P); m.quaternion.copy(q0);
    amb.push({ m, P, q0, k, ax: V3().crossVectors(n, V3(0, 0, 1)).normalize() });
  };
  [[7, 3, -3, 1.6], [10, -2, 2, 1.3], [-4, -4, -5, 2.0], [5, -7, 4, 1.4], [-7, 2, -1, 1.5], [13, 1, -6, 2.2], [2, 5, 5, 1.2], [15, -6, -2, 1.7], [-2, -9, -3, 1.5]]
    .forEach(([x, y, z, r], k) => put(A.clone().add(V3(x, y, z)), r, k));
  [[-6, 4, -3, 1.8], [7, 5, 1, 1.5], [-8, -1, 2, 1.4], [8, -2, -4, 2.0], [-3, 8, 3, 1.3], [5, 9, -2, 1.6], [-10, 6, -6, 2.2], [10, 3, 3, 1.4], [-9, -5, -4, 1.9]]
    .forEach(([x, y, z, r], k) => put(Lp.clone().add(V3(x, y, z)), r, k + 9));
  const wq = new THREE.Quaternion();
  V.anim(t => amb.forEach(d => { d.m.visible = t > 70.3 && t < 79.2; if (!d.m.visible) return; d.m.position.copy(d.P).add(V3(0, 0.25 * Math.sin(t * 0.8 + d.k), 0)); d.m.quaternion.copy(wq.setFromAxisAngle(d.ax, 0.22 * Math.sin(t * 0.55 + d.k * 1.3)).multiply(d.q0)); }));
};
