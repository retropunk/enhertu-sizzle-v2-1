/* G5 · the in-between shapes: the two travels that used to show mostly empty floor and background (the polish pass,
   2026-09-29, backlog C: "sparse stretches at 22→23 (~102.8–104.8) and ~109.3"). Called from g5.js after f21 … f24 with
   the shared context G. Nothing here is on a board: every shape is shown only between the key moments, so boards 22, 23
   and 24 look exactly as before at their key instants and through their slow windows.
   · The style is G5's own: chunky slabs whose outlines come from the boards around them (22's quarter-discs, 21's ∪, 23's
     domes, 24's stadium ring, column and arch colours), each with a living gradient (it slides slowly along the
     shape, the tempo of the frames' own; no hard bands) and rims: the sides are a paler, lit tint of the face (as frame
     13's cut rims and 17's disc rims), the backs darker, so the 3D depth reads whenever the camera moves. They never
     quite settle (a slow drift and sway, as the board shapes'), and they sit at different depths, so the camera's truck
     gives them parallax.
   · 22 → 23 (the truck right along the band, 101.55–105.35): just after 22's slow window, three shapes rise in from
     below along the floor under the band, running on 22's row of quarter-discs (which then sink away), well below the
     sphere's line and behind or in front of it in depth (never on it): a violet → pink quarter-disc (22's), an orange →
     peach dome on a stem, set back, and a mirrored pink → violet quarter-disc. Each dips and rocks a little as the sphere
     rolls over it. They stay in the world: the camera carries them off the left edge (all gone by ~105.0). Above, in the
     gap between 22's leaving shapes and 23's arriving loop, 21's thick violet ∪ (orange legs running up past the frame)
     drops in from above (103.35–104.15) and lifts out again before 23's words build in (104.85–105.35).
   · 23 → 24 (the pull-back round the loop and the truck right, 108.3–110.0): on the right of the loop, deeper in the
     space (behind the sphere's plane and 23's floor, in front of 24's backdrop), one cluster of three overlapping pieces in
     board 24's colours rises from behind 23's floor (108.3–109.3, first seen at ~108.35): at the back a big quarter-disc
     (24's stadium-ring mauve → burnt coral → orange), its curve rising from the left and its straight side standing on the
     right; in front of its foot a dome in 24's column violet; at its right foot a small dome in 24's arch pink → coral →
     orange. As 24's arch and column grow up out of the floor they sink back behind it (109.35–110.0; gone from the
     picture by 109.92), before 24's words build in. Their flat bottoms always stay below the floor's horizon and they are
     cut at y -30.2, inside the floor's shadow from these moves (clip), so nothing shows beneath the floor.
     Review fixes (2026-09-29): this replaces three copies of the tile wall's own pieces. Tile D's half-disc on a narrow
     post read as a "P" beside the ring's "0" (with the quarter-disc on a stem after it, a row of stray type next to 23's
     words), and tile A dropping back in from the top and the half-disc rising back in at the bottom right, 0.1–0.3 s after
     the wall had thrown those same pieces out through those edges, read as the pieces bouncing back. So the cluster has no
     stems and no bowl-on-a-post outline (wide, overlapping, low shapes that can't read as letters), takes 24's colours
     rather than the wall's, rises from behind the floor's horizon rather than through a frame edge, and starts 0.58 s after
     the wall's last piece (tile D) has left the frame (~107.775). Nothing drops in from above any more.
   · The materials share the engine's clock and flow uniforms through G.live (frame 23's registered material), so no new
     engine material is made here: every other shape's living-gradient phase stays exactly as it was. */
export default (V, G) => {
  const { THREE, anim, scene } = V;
  const { cl, E, ACTIVE, live } = G;
  const OX = V.O.x, Vec = THREE.Vector3;
  const hexC = h => { const n = parseInt(h.slice(1), 16); return new Vec((n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255); };

  /* ---------- material: a living three-stop gradient in the shape's own units, rims on the sides ---------- */
  const VS = `#include <common>
#include <logdepthbuf_pars_vertex>
varying vec3 vO; varying vec3 vNo; varying vec3 vNw; varying vec3 vNv; varying float vY;
void main() { vO = position; vNo = normal; vNw = normalize(mat3(modelMatrix) * normal); vNv = normalize(normalMatrix * normal);
  vec4 w = modelMatrix * vec4(position, 1.0); vY = w.y;
  gl_Position = projectionMatrix * viewMatrix * w;
#include <logdepthbuf_vertex>
}`;
  const FS = `uniform float t, flow, spd, per, ph, lo, hi, clipY; uniform vec2 ax; uniform vec3 c0, c1, c2;
varying vec3 vO; varying vec3 vNo; varying vec3 vNw; varying vec3 vNv; varying float vY;
#include <logdepthbuf_pars_fragment>
void main() {
  if (vY < clipY) discard;                                             // (behind the floor: nothing shows below it)
  float fl = min(flow, 1.6);
  float g = (dot(vO.xy, ax) - lo) / (hi - lo) + 0.14 * fl * (sin(t * spd / per * 6.2832 + ph) - sin(ph));
  g = clamp(g, 0.0, 1.0);
  vec3 col = g < 0.5 ? mix(c0, c1, g * 2.0) : mix(c1, c2, g * 2.0 - 1.0);
  if (abs(vNo.z) < 0.5) {                                              // the sides: the rim, a paler tint of the face, lit from the upper left
    float l = clamp(0.5 + 0.5 * dot(normalize(vNw), normalize(vec3(-0.35, 0.75, 0.55))), 0.0, 1.0);
    col = mix(col, vec3(1.0, 0.88, 0.84), 0.2) * (0.6 + 0.5 * l);
  } else if (vNo.z < 0.0) col *= 0.55;                                 // the back
  else { vec3 nv = normalize(vNv); col *= mix(0.86, 1.0, smoothstep(0.5, 0.98, abs(nv.z))); }   // the face, a touch darker at a slant
  gl_FragColor = vec4(col, 1.0);
#include <logdepthbuf_fragment>
}`;
  let nm = 0;
  // cols: three hex stops from `from` to `to` (local units); clip: world y below which it is not drawn (a shape that rises
  // from and sinks behind 23's floor is cut inside the floor's shadow, so its stem never shows beneath the floor)
  const gmat = (cols, from, to, clip = -1e9) => {
    const k = nm++, a = new THREE.Vector2(...from), b = new THREE.Vector2(...to), d = b.clone().sub(a).normalize();
    return new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: FS, uniforms: {
      t: live.t, flow: live.flow, spd: live.spd, per: { value: 6.6 + (k * 1.37) % 3.2 }, ph: { value: (k * 2.21) % 6.28 },
      ax: { value: d }, lo: { value: d.dot(a) }, hi: { value: d.dot(b) }, c0: { value: hexC(cols[0]) }, c1: { value: hexC(cols[1]) }, c2: { value: hexC(cols[2]) }, clipY: { value: clip } } });
  };
  // an extruded slab (front face at z = 0 facing +z, the body going back `thick`)
  const slab = (shape, thick, m) => { const g = new THREE.ExtrudeGeometry(shape, { depth: thick, bevelEnabled: false, curveSegments: 48 }); g.translate(0, 0, -thick);
    const me = new THREE.Mesh(g, m); me.frustumCulled = false; return me; };

  /* ---------- outlines (local units, y up) ---------- */
  // a quarter-disc standing on a stem that runs on below the frame (22's): corner at the origin, curve falling right (or left)
  const qStem = (r, below, flip = 1) => { const s = new THREE.Shape(); s.moveTo(0, -below); s.lineTo(flip * r, -below); s.lineTo(flip * r, 0);
    if (flip > 0) s.absarc(0, 0, r, 0, Math.PI / 2, false); else s.absarc(0, 0, r, Math.PI, Math.PI / 2, true); s.lineTo(0, -below); return s; };
  // a dome (half-disc, flat side down) on a stem running on below
  const domeStem = (r, below) => { const s = new THREE.Shape(); s.moveTo(-r, -below); s.lineTo(r, -below); s.lineTo(r, 0); s.absarc(0, 0, r, 0, Math.PI, false); s.lineTo(-r, -below); return s; };
  const dome = r => { const s = new THREE.Shape(); s.moveTo(r, 0); s.absarc(0, 0, r, 0, Math.PI, false); s.lineTo(r, 0); return s; };
  // 21's thick ∪: outer half-width w, slot half-width v, legs running up to `up`
  const cup = (w, v, up) => { const s = new THREE.Shape(); s.moveTo(-w, up); s.lineTo(-w, 0); s.absarc(0, 0, w, Math.PI, 2 * Math.PI, false); s.lineTo(w, up); s.lineTo(v, up);
    s.lineTo(v, 0); s.absarc(0, 0, v, 0, -Math.PI, true); s.lineTo(-v, up); s.lineTo(-w, up); return s; };
  // a plain quarter-disc, the corner at the origin: flip 1, the curve on the right; flip -1, the curve on the left
  const qd = (r, flip = 1) => { const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(flip * r, 0);
    if (flip > 0) s.absarc(0, 0, r, 0, Math.PI / 2, false); else s.absarc(0, 0, r, Math.PI, Math.PI / 2, true); s.lineTo(0, 0); return s; };

  /* ---------- the shapes: where (G5-local world units), their outline and colours, when ----------
     in / out: { t: [a, b], dy } (a rise from below / a drop from above / a lift or sink: world units along y, eased
     expo.out in, power2.in out); hide: when it is switched off (it is out of view by then); yaw / tilt: a small turn (rad) so
     the rims read; bob: dips as the sphere rolls over it. */
  const SH = [];
  const add = (o, meshes) => { const g = new THREE.Group(); g.visible = false; meshes.forEach(m => g.add(m)); scene.add(g); SH.push({ ...o, g, p: new Vec(OX + o.at[0], o.at[1], o.at[2]), k: SH.length }); };
  // 22 → 23, along the floor under the band (the band's ledge is at y -24.5, the sphere rolls at -23.5 on z = -6)
  add({ at: [-3.0, -31.0, -5.2], in: { t: [101.55, 102.35], dy: -9 }, hide: 105.5, yaw: 0.14, bob: -0.75 },
    [slab(qStem(4.8, 9), 1.0, gmat(['#4f0cc0', '#8a1fcc', '#dd459d'], [0, -3], [3.4, 4.2]))]);
  add({ at: [5.8, -29.0, -9.0], in: { t: [101.7, 102.5], dy: -9 }, hide: 105.5, yaw: 0.0, bob: 5.8 },
    [slab(domeStem(2.8, 11), 0.9, gmat(['#ff7a1a', '#ffa347', '#fdd068'], [0, -4], [0, 2.8]))]);
  add({ at: [13.0, -32.0, -4.0], in: { t: [101.85, 102.65], dy: -9 }, hide: 105.5, yaw: -0.14, bob: 11.0 },
    [slab(qStem(4.2, 8, -1), 0.8, gmat(['#d6449f', '#9a24d0', '#5a0fc8'], [-3.4, 3.6], [0, -3]))]);
  // 22 → 23, above: 21's ∪ hanging in the gap between 22's leaving shapes and 23's arriving loop
  add({ at: [22.0, -15.8, -13.0], in: { t: [103.35, 104.15], dy: 10 }, out: { t: [104.85, 105.35], dy: 11 }, hide: 105.35, yaw: 0.16 },
    [slab(cup(3.2, 1.15, 14), 1.1, gmat(['#5a02fa', '#a52ab5', '#e36a26'], [0, -3.2], [0, 6.5]))]);
  // 23 → 24, on the right of the loop, behind the sphere's plane and 23's floor (its back edge is at z -11.3; 24's backdrop
  // at z -19): one cluster of three overlapping pieces in board 24's colours rises from behind the floor, back to front a
  // wide dome, a quarter-disc and a small dome. Their flat bottoms stay behind the floor (below its horizon), so no stem
  // and no bowl-on-a-post shows (review fix: the old half-disc on a post read as a "P" beside the ring's "0"), and they
  // start 0.5 s after the tile wall's last pieces have left, with outlines and colours of their own (review fix: the old
  // copies of tiles A and D seemed to bounce back in through the edges they had just left by).
  const FC = -30.2;                                                   // the cut, inside 23's floor (top -27.5, bottom -30.5) as seen from these moves
  // the back: a big quarter-disc in 24's stadium-ring colours (mauve low left → burnt coral → orange high right), its curve
  // rising from the left, its straight side standing on the right (turned so its curved rim reads; all of it stays in front
  // of 24's backdrop, which fades in at z -19 from 108.4)
  add({ at: [47.6, -29.6, -16.6], in: { t: [108.3, 109.1], dy: -11 }, out: { t: [109.45, 110.0], dy: -12 }, hide: 110.0, yaw: 0.1 },
    [slab(qd(8.0, -1), 1.2, gmat(['#83326f', '#d8583c', '#ff9426'], [-7.6, 1.0], [-0.4, 6.8], FC))]);
  // the middle: a dome in 24's column violet, in front of the quarter-disc's foot
  add({ at: [42.0, -29.2, -14.6], in: { t: [108.4, 109.2], dy: -9 }, out: { t: [109.4, 109.95], dy: -10 }, hide: 110.0, yaw: 0.14 },
    [slab(dome(3.6), 1.0, gmat(['#3a0e96', '#5a1fd0', '#8f52f4'], [-3.4, 0.6], [2.2, 3.6], FC))]);
  // the front: a small dome in 24's arch colours (pink → coral → orange) at the quarter-disc's right foot
  add({ at: [45.5, -28.3, -12.4], in: { t: [108.5, 109.3], dy: -8 }, out: { t: [109.35, 109.9], dy: -9 }, hide: 110.0, yaw: -0.12 },
    [slab(dome(2.3), 0.8, gmat(['#e94a9a', '#fc5d62', '#ff8a14'], [-2.3, 0.4], [2.3, 1.8], FC))]);

  const eIn = E('expo.out'), eOut = E('power2.in');
  const Y = new Vec(0, 1, 0), X = new Vec(1, 0, 0), Z = new Vec(0, 0, 1), q = new THREE.Quaternion();
  anim((t, b) => {
    for (const s of SH) {
      const on = ACTIVE(t) && t >= s.in.t[0] && t < s.hide;
      s.g.visible = on; if (!on) continue;
      let dy = s.in.dy * (1 - eIn(cl((t - s.in.t[0]) / (s.in.t[1] - s.in.t[0]))));
      if (s.out) dy += s.out.dy * eOut(cl((t - s.out.t[0]) / (s.out.t[1] - s.out.t[0])));
      // never quite settled: a slow drift and sway (as the board shapes')
      const w = t * 6.2832, k = s.k;
      s.g.position.copy(s.p).add(new Vec(0.07 * Math.sin(w / 7.1 + k), dy + 0.08 * Math.cos(w / 6.3 + 1.7 * k), 0));
      let bob = 0, roll = 0;
      if (s.bob != null && b && b.p) { const x = b.p.x - OX - s.bob, f = Math.exp(-x * x / 2.6); bob = -0.3 * f; roll = -0.04 * x / 1.6 * f; }
      s.g.position.y += bob;
      s.g.quaternion.setFromAxisAngle(Y, s.yaw + 0.035 * Math.sin(w / 8.3 + 2.3 * k))
        .multiply(q.setFromAxisAngle(X, 0.03 * Math.sin(w / 9.1 + k))).multiply(q.setFromAxisAngle(Z, roll));
    }
  });
};
