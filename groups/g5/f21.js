/* Frame 21 · the row of half-discs (G5, called from g5.js with its context G). Built: every board 21 shape is real 3D and
   the plate is gone (V.unplate(21)).
   · The path: the stripe band is a real striped deck lying flat at the sphere's contact height (y = -1), seen from the
     hold camera at a grazing angle. Its outline is solved against that camera, so at the hold it covers exactly the
     board's band (x 850 →, y 746–958) and its five bars and four stripes land on the board's (the stripes run along the
     row, so from the chase camera they are the sphere's speed lines, and they light up in a trail behind it on the way
     in). The sphere rolls on it from the entry (26.8 right of its mark) to the key. From the deck's left end a narrow
     violet ledge carries the row line on to the gap at -10.5 (where it drops into 22's chute). The board shows no track
     under the sphere, so the ledge melts away as the camera lands on the hold and comes back as the camera leaves.
     Every surface of the deck takes the board colour of where it sits in the hold view (the stripes, the base bars, the
     wash under its front edge), so at the key it is the board's flat band; its sides read darker as they turn from the camera.
   · Board shapes as pieces, flat at the hold, chunky while moving, back to front: the backdrop (navy ground and the
     soft navy → coral wash on the right half), the magenta ring top right, the translucent orange → pink stadium ring,
     the violet ∪, the orange donut at the top, the square tile, the violet quarter shape with its orange glow, the tall
     violet → orange column, the violet band and the dark band under it (left), and the four half-discs just behind the
     sphere's line. Colours are fields of anchors sampled from board 21 inside each shape (no bands), sliding a little
     (living), exactly on the board at the key instant (96.95).
   · Reactions (the user: the shapes react to its velocity, moving and spinning as it passes): the ∪ spins round and the
     rings sway as the sphere rolls under them on the way in (settled before the key); after the key the half-discs flip
     in its wake with a hop, the donut spins a full turn and bobs, and the column, band, quarter and tile push back as it
     passes. On the way in the deck's stripes light up in a trail behind it.
   · Build: the backdrop fades in under the dark; the deck is there from the start; the shapes fly in from depth, right
     to left, while the camera rides beside the sphere; the half-discs grow in. Out: the right-hand shapes fly off first
     as the camera follows the sphere left; the rest fly back as it cranes down to 22 (overlapping 22's build-in).
   · The two dark halves in front of the lens at the start are kept from the animatic (the 93.25 cut is a fixed contract).
   Shapes, positions and colours are measured from board 21 (edge scans and colour samples, board px 1920×1080). */
export default (V, G) => {
  const { THREE, anim, scene, O } = V;
  const { h21: H, D21, m21, X0, offA, lookA, vec, cl, sm, E, flatGeo } = G;
  const TK = H.tk;                                                        // 96.95: every colour is on the board here
  V.unplate(21);
  const Vec = THREE.Vector3;
  const hexC = h => { const n = parseInt(h.replace('#', ''), 16); return `vec3(${((n >> 16 & 255) / 255).toFixed(4)}, ${((n >> 8 & 255) / 255).toFixed(4)}, ${((n & 255) / 255).toFixed(4)})`; };
  const f1 = x => (Math.round(x * 10) / 10).toFixed(1);
  const stopsFn = (name, st) => `vec3 ${name}(float v) { vec3 c = ${hexC(st[0][1])};\n` +
    st.slice(1).map(([v, h], i) => `  c = mix(c, ${hexC(h)}, clamp((v - ${f1(st[i][0])}) / ${f1(v - st[i][0])}, 0.0, 1.0));`).join('\n') + '\n  return c; }\n';
  // a smooth, bounded blend of colour anchors sampled from the board (no overshoot, no bands)
  const fieldFn = (name, pts, k) => { const c = (1 / (k * k)).toExponential(5);
    return `vec3 ${name}(vec2 b) { vec3 s = vec3(0.0); float ws = 0.0, w; vec2 d;\n` +
      pts.map(([x, y, h]) => `  d = b - vec2(${f1(x)}, ${f1(y)}); w = 1.0 + dot(d, d) * ${c}; w = 1.0 / (w * w); s += w * ${hexC(h)}; ws += w;`).join('\n') + '\n  return s / ws; }\n'; };

  /* ---------- board 21's colours: anchors sampled inside each shape's visible part (board px x, y, colour) ---------- */
  // (review pass: the tile's bottom-right and the quarter's top-right orange glows got extra anchors sampled at the corners)
  const A = {
    tile: '22,22,5f147b;67,22,57147a;112,22,551374;157,22,531472;202,22,511377;247,22,50147c;292,22,4c167c;337,22,4f147e;22,67,5913a0;67,67,5414a0;112,67,5514a5;157,67,5514a5;202,67,5617a3;247,67,5c1999;292,67,5e1a92;337,67,5f1c8f;22,112,5f13c5;67,112,5c15c8;112,112,5e18cf;157,112,621cd4;202,112,6921c5;247,112,7026af;292,112,76299a;337,112,782a8d;22,157,6b19e0;67,157,6a1ce4;112,157,6f22ec;157,157,7729f9;202,157,8431d6;247,157,8e38a9;292,157,943c8b;337,157,983e7b;22,202,7e22eb;67,202,8127e9;112,202,892ee6;157,202,9239dd;202,202,a143b6;247,202,af4c85;292,202,b85263;337,202,bb5552;22,247,952de2;67,247,9c31d9;112,247,a43aca;157,247,af46ac;202,247,c05382;247,247,d15d50;292,247,da6535;337,247,dc6928;360,270,e97117;372,290,ec771f;350,285,ef760b;372,255,e06c26;330,288,f07513;300,290,e97125;372,220,c85e44',
    quarter: '25,325,6400ff;75,325,6803fd;125,325,6c0af4;175,325,7715e8;225,325,8423d2;275,325,9835b1;325,325,ae4986;375,325,cc5c50;425,325,e66e23;25,375,6301ff;75,375,6702fc;125,375,6b08f8;175,375,7212ee;225,375,7e1fdd;275,375,8f30c2;325,375,a7449b;375,375,c55866;425,375,e26b2c;25,425,6201ff;75,425,6401fc;125,425,6704fc;175,425,6d0df5;225,425,7619eb;275,425,8329da;325,425,983bbd;375,425,b54e89;425,425,d5604d;25,475,6000ff;75,475,6100ff;125,475,6502fd;175,475,6508fb;225,475,6a14f9;275,475,7421f5;325,475,8531e6;375,475,a141bd;425,475,c15383;75,525,5f00ff;125,525,5f00fe;175,525,5f05ff;225,525,630eff;275,525,681afe;325,525,7627fe;375,525,9036df;425,525,af44b1;75,575,5b00fe;125,575,5b00fe;175,575,5a03ff;225,575,5c0bfe;275,575,6315ff;325,575,7121fe;375,575,892ced;425,575,a439cf;125,625,5b00ff;175,625,5803ff;225,625,5909ff;275,625,6012fe;325,625,6f1dfd;375,625,8427f1;425,625,9d31dd;455,300,ed7911;445,315,ee7311;430,300,e8711f;400,300,da6737',
    column: '522,302,5100fe;522,357,5000ff;577,357,5500fe;632,357,5b00fe;687,357,6001ff;522,412,5000ff;577,412,5600ff;632,412,5d00ff;687,412,6401fc;742,412,6a06fa;522,467,5203fd;577,467,5703ff;632,467,5f05fd;687,467,6909f9;742,467,710ff1;797,467,7b14e9;522,522,560aff;577,522,5b0cfe;632,522,640ffe;687,522,7016f5;742,522,7d1ce4;797,522,8623d4;522,577,6014fd;577,577,6416ff;632,577,6d1cfd;687,577,7c25eb;742,577,8d2ecc;797,577,9a34b4;522,632,721efc;577,632,7423fc;632,632,7d2dfc;687,632,9138d3;742,632,a743a3;797,632,b54a83;522,687,8b2aed;577,687,9032e3;632,687,9d3ec9;687,687,b34c98;742,687,c75964;797,687,d16148;687,742,d55d58;687,907,fa7028;522,962,f4546c;577,962,f85d5b;632,962,fc673e;687,962,fe7225;742,962,ff7d10;797,962,fe8204;522,1017,fb5b5e;577,1017,fd604d;632,1017,fe6b37;687,1017,ff7323;742,1017,ff7c10;797,1017,ff8204',
    lband: '22,787,7b22ff;67,787,7921ff;112,787,771fff;157,787,741cfe;22,832,7b22ff;67,832,7921ff;112,832,771fff;157,832,741cfe;22,877,7b22ff;67,877,7922fd;112,877,771fff;157,877,741cfe;22,922,7b22ff;67,922,7921ff;112,922,771fff;157,922,751dff;202,922,711aff;337,922,630bfa',
    dband: '25,975,7404f1;75,975,7603f4;125,975,7603f5;175,975,7704f7;225,975,7703f7;275,975,7603f4;325,975,7104ed;375,975,6b04df;425,975,6405d3;25,1025,7604f5;75,1025,7903f9;125,1025,7b03fa;175,1025,7a03fb;225,1025,7a03fd;275,1025,7b02fd;325,1025,7802f8;375,1025,6f03e9;425,1025,6803db',
    donut: '472,22,cb3830;517,22,cb3830;562,22,cb3830;877,22,cb3830;922,22,cb3830;967,22,cb3830;472,67,d95335;517,67,d85334;562,67,d85334;607,67,d85335;832,67,d95334;877,67,d85334;922,67,d85334;967,67,db532e;517,112,e86e38;562,112,e86e38;607,112,e86e38;652,112,e86e38;697,112,e86e38;742,112,e86e38;787,112,e86e38;832,112,e86e38;877,112,e86e38;922,112,e86e38;562,157,f88a3d;607,157,f88a3d;652,157,f88a3c;697,157,f88a3c;742,157,f88a3d;787,157,f88a3d;832,157,f88a3c;877,157,f88a3c;607,202,feaa52;652,202,feab4f;697,202,feab4f;742,202,ffaa4f;787,202,ffaa4f;832,202,ffa84d',
    ring: '1182,82,952a6d;1237,82,a03069;1402,82,bf485a;1457,82,c84f56;1622,82,e56f3b;1677,82,fa7a3b;1072,137,731b71;1127,137,7d2070;1182,137,88266d;1237,137,932b69;1402,137,b3415b;1457,137,bd4955;1622,137,dc6642;1677,137,f97148;1732,137,f87d35;1787,137,fc8727;1017,192,5c1470;1072,192,671870;1127,192,711d6e;1182,192,7d216c;1237,192,872767;1457,192,b24355;1622,192,d85c46;1677,192,f76a52;1732,192,f87245;1787,192,fb7e36;1017,247,52136e;1072,247,5b166b;1127,247,651a6a;1732,247,e1693e;1787,247,ed7337;1842,247,f4802e;1017,302,451168;1072,302,4f1467;1732,302,d76044;1787,302,e16b3d;1842,302,ed7536;1017,357,381162;1072,357,431263;1732,357,ce5849;1787,357,d96242;1842,357,e26c3a;1677,412,e25948;1732,412,e86241;1787,412,f26a3c;1677,467,dd554a;1732,467,e65e46;1787,467,ee6640;1677,522,d7504d',
    U: '1300,20,e16723;1340,20,de612c;1500,20,c03996;1540,20,bb31a8;1580,20,b62cb7;1300,60,ca5546;1340,60,c7504f;1500,60,ae2ea6;1540,60,a727b8;1580,60,a623c3;1300,100,b6426c;1340,100,b23d76;1500,100,9a21c0;1540,100,961ccb;1580,100,9419d3;1300,140,9e3091;1340,140,9a2a9f;1500,140,8714d5;1540,140,8412de;1580,140,8210e1;1300,180,8b20b4;1340,180,851bbe;1540,180,7208ee;1580,180,7307f0;1300,220,7b14cc;1340,220,750fd7;1380,220,6f09e4;1500,220,6601fc;1540,220,6502f8;1580,220,6602f6;1340,260,6807ea;1380,260,6203f5;1420,260,5c00fd;1460,260,5a00fe;1500,260,5a00fe;1540,260,5b00fe;1380,300,5a01fa;1420,300,5600ff;1460,300,5300fe;1500,300,5300fe',
    mag: '1665,45,d40bfd;1695,45,d10bfe;1725,45,cd0cfd;1755,45,c90dfd;1785,45,c10df9;1815,45,b60ff6;1845,45,ab10f2;1875,45,9e12ef;1875,165,9912eb;1875,195,9b12e9',
    disc0: '285,741,7516ec;247,779,821ce2;285,779,821ce2;247,817,9524d4;285,817,9525d4;247,855,a92cc4;285,855,a92cc4;247,893,bf39b3;285,893,c038b4',
    disc1: '399,741,ffa044;361,779,ffa94f;399,779,ffa94f;361,817,ffb258;399,817,ffb258;361,855,ffba62;399,855,ffba62;361,893,ffc46b;399,893,ffc46a',
    disc2: '513,741,7715ed;475,779,821ce2;513,779,821ce2;475,817,9524d4;513,817,9524d3;475,855,a92cc4;513,855,a92cc6;475,893,c138b5;513,893,c237b5',
    disc3: '627,741,ffa044;589,779,ffa94f;627,779,ffa94f;589,817,ffb258;627,817,ffb258;589,855,ffba62;627,855,ffba62;589,893,ffc46a;627,893,ffc46a',
    ground: '420,20,2f1146;660,20,250b5d;740,20,2b0967;1060,20,390a89;1140,20,3d0890;1220,20,430795;1460,20,4b05a2;1620,20,4e06b1;700,60,280a62;1020,60,3a0683;1100,60,3b0986;420,100,280f50;980,100,350a7a;1860,100,5105ad;460,140,250e54;420,180,260f55;500,180,240d59;980,180,300b72;460,220,240e57;540,220,230e5b;860,220,2a0d6d;940,220,2e0c6d;420,260,230f56;500,260,230e5b;580,260,230e5d;660,260,250e60;740,260,250d63;820,260,270d68;900,260,2a0d6a;1220,260,2a0b69;1620,260,360779;700,300,260e5e;780,300,260e64;860,300,280e67;940,300,290e69;1180,300,290c66;1260,300,290b65;1580,300,2f066e;1660,300,360779;1900,300,430593;740,340,270e5f;820,340,261063;900,340,270d64;1220,340,270b60;1300,340,27095f;1380,340,270960;1540,340,2f0768;1620,340,320771;860,380,260e62;940,380,260e62;1900,380,3b0785;820,420,221064;20,580,201261;20,620,201362;60,620,20145e;20,660,241364;60,660,221365;100,660,221364;20,700,2c1276;60,700,2c1277;100,700,2c1277;140,700,2b1277;180,700,2b1375;220,700,2b1375;260,700,2b1273;340,700,2c1174;380,700,2c1174',
  };
  const pts = k => A[k].split(';').map(s => { const [x, y, h] = s.split(','); return [+x, +y, h]; });
  const BASE = [[924, '5700ff'], [960, '5d00fe'], [1000, '6a10fe'], [1040, '7923fe'], [1080, '8532f8'], [1120, '933cf0'], [1160, '9d46e3'], [1200, 'aa50d6'],
    [1240, 'b455c6'], [1280, 'bd58b4'], [1320, 'c55ca2'], [1360, 'ce5e8f'], [1400, 'd55e7a'], [1440, 'dc5e67'], [1480, 'e25e54'], [1520, 'e75d41'], [1560, 'ed5c2f'],
    [1600, 'f05a23'], [1640, 'f45819'], [1680, 'fa5710'], [1720, 'fb5607'], [1760, 'fd5704'], [1800, 'ff5401']];
  const STRIPE = [[924, '5a07f3'], [960, '5d0cee'], [1000, '6313e8'], [1040, '6819e2'], [1080, '681ad7'], [1120, '6b1dca'], [1160, '7526bc'], [1200, '802dac'],
    [1240, '8c349c'], [1280, '983b8b'], [1320, 'a1427b'], [1360, 'af4a6a'], [1400, 'bb515b'], [1440, 'c55a4b'], [1480, 'd2643f'], [1520, 'e06e32'], [1560, 'ed7827'],
    [1600, 'ef8237'], [1640, 'ef904b'], [1680, 'f29a5f'], [1720, 'f3a673'], [1760, 'f4b285'], [1800, 'f5be96'], [1840, 'f5bf99']];
  const WASH = [[850, '2c0b6a'], [950, '2a0a66'], [1050, '28085e'], [1100, '2b095a'], [1150, '340b5a'], [1200, '400d5c'], [1300, '54135c'], [1400, '6b1b5a'],
    [1500, '7e2657'], [1600, '963352'], [1700, 'ab414d'], [1800, 'c25245'], [1880, 'd5613c'], [1920, 'd06a42']];
  const toStops = L => L.map(([v, h]) => [v, '#' + h]);
  const LIB_WASH = stopsFn('washX', toStops(WASH)) + fieldFn('groundF', pts('ground'), 70) +
    'vec3 bg(vec2 q) { return mix(groundF(q), washX(q.x), smoothstep(398.0, 420.0, q.y) * smoothstep(840.0, 900.0, q.x)); }\n';
  const LIB_BAND = stopsFn('baseX', toStops(BASE)) + stopsFn('stripeX', toStops(STRIPE)) + stopsFn('washX', toStops(WASH)) +
    `float bnd(float y, float a, float b) { return smoothstep(a - 1.2, a + 1.2, y) * (1.0 - smoothstep(b - 1.2, b + 1.2, y)); }
float stripeM(float y) { return bnd(y, 771.0, 791.0) + bnd(y, 819.0, 840.0) + bnd(y, 869.0, 890.0) + bnd(y, 919.0, 940.0); }
vec3 bandCol(vec2 bp, float slx) { float x = bp.x + slx; vec3 c = mix(baseX(x), stripeX(x), stripeM(bp.y)); return mix(c, washX(x), smoothstep(956.5, 959.5, bp.y)); }
`;
  // one shared living drift for the whole set (zero at the key instant, so the held frame is the board's colours)
  const PER = 9.5, PH = 1.1, AMP = 24;
  const SLF = `vec2 SL(float t, float flow) { float fl = min(flow, 1.6), a = 6.2832 * ((t - ${TK.toFixed(4)}) * spd);
  return ${AMP.toFixed(1)} * fl * vec2(sin(a / ${PER.toFixed(2)} + ${PH.toFixed(2)}) - sin(${PH.toFixed(2)}), 0.6 * (sin(a / ${(PER * 1.13).toFixed(3)} + ${(PH + 0.85).toFixed(2)}) - sin(${(PH + 0.85).toFixed(2)}))); }\n`;

  /* ---------- piece material: the shape's board colours in its own board px (they ride with the shape) ---------- */
  const PV = '#include <common>\n#include <logdepthbuf_pars_vertex>\nvarying vec3 vO; varying vec3 vNv;\nvoid main() { vO = position; vNv = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}';
  const PF = (lib, body) => `uniform float op, t, flow, spd; uniform vec2 at;
varying vec3 vO; varying vec3 vNv;
#include <logdepthbuf_pars_fragment>
${lib}${SLF}
void main() {
  vec2 sl = SL(t, flow), b = at + vec2(vO.x, -vO.y), q = b + sl;
  vec3 col = ${body};
  vec3 nv = normalize(vNv); float shade = mix(0.72 + 0.12 * nv.y - 0.05 * nv.x, 1.0, smoothstep(0.55, 0.98, abs(nv.z)));
  gl_FragColor = vec4(col * shade, op);
#include <logdepthbuf_fragment>
}`;
  const swaps = [];
  anim(() => { for (const [a, b] of swaps) { b.transparent = a.transparent; b.depthWrite = a.depthWrite; } });
  const P21 = (spec, lib, body) => {
    const pc = V.piece({ hold: 21, ...spec });
    flatGeo(pc.mesh.geometry, 21, spec.at, spec.depth);
    const o0 = pc.mesh.material;
    const m = new THREE.ShaderMaterial({ uniforms: { op: o0.uniforms.op, t: o0.uniforms.t, flow: o0.uniforms.flow, spd: o0.uniforms.spd, at: { value: new THREE.Vector2(...spec.at) } },
      vertexShader: PV, fragmentShader: PF(lib, body), side: o0.side });
    pc.mesh.material = m; swaps.push([o0, m]); pc.flow = o0.uniforms.flow; pc.spd = o0.uniforms.spd; return pc; };
  const field = (k, spacing) => [fieldFn('F', pts(k), spacing * 0.9), 'F(q)'];
  const FLY = (a, b, dz = 9) => ({ type: 'fly', t: [a, b], dz, ease: 'expo.out' });
  // out: the set lifts away upward (the camera is craning down to 22), fading at the very end
  const UP = (a, b) => ({ out: { type: 'slide', from: 'top', t: [a, b], ease: 'power2.in' }, keys: { op: [[b - 0.22, 1], [b, 0]] } });
  const S = V.S;
  const rectS = (x0, y0, x1, y1, at) => S.poly([[x0, y1], [x1, y1], [x1, y0], [x0, y0]], at);
  // a rounded rect in board px (y down) as a THREE.Shape around at, and one as a hole path
  const rrPts = (x0, y0, x1, y1, r, at, n = 16) => { const p = []; const Y = y => at[1] - y, X = x => x - at[0];
    for (const [cx, cy, a0] of [[x1 - r, y1 - r, 0], [x0 + r, y1 - r, 90], [x0 + r, y0 + r, 180], [x1 - r, y0 + r, 270]])
      for (let k = 0; k <= n; k++) { const a = (a0 + 90 * k / n) * Math.PI / 180, v = new THREE.Vector2(X(cx + r * Math.cos(a)), Y(cy + r * Math.sin(a))); if (!p.length || v.distanceTo(p.at(-1)) > 1e-3) p.push(v); }
    if (p.length > 2 && p[0].distanceTo(p.at(-1)) < 1e-3) p.pop();
    return p; };
  const ringShape = (o, i, at) => { const s = new THREE.Shape(rrPts(...o, at).reverse()); s.holes.push(new THREE.Path(rrPts(...i, at))); return s; };

  /* ---------- depths (world distance from the hold camera; the sphere is at 20.34) ---------- */
  const DZ = { disc: D21 + 1.3, lband: 22.4, dband: 22.5, column: 22.9, quarter: 23.4, tile: 24.2, donut: 27, U: 29.5, ring: 31.5, mag: 33.5, back: 44 };

  /* ---------- the backdrop: navy ground, the soft wash on the right half ---------- */
  const back = P21({ shape: rectS(-4000, -2400, 7000, 1500, [960, 540]), at: [960, 540], depth: DZ.back, thick: 0, drift: 0,
    in: { type: 'fade', t: [93.3, 93.9], ease: 'sine.inOut' }, out: { type: 'fade', t: [98.45, 99.15], ease: 'sine.inOut' } }, LIB_WASH, 'bg(q)');

  /* ---------- the far shapes (cut by the frame top) ---------- */
  // the magenta ring top right (behind the orange ring): outer x 1617 →, y 5–225; slot x 1725 →, y 65–145
  const mag = P21({ shape: ringShape([1616, 2, 2700, 225, 111.5], [1725, 65, 2690, 145, 40], [1800, 110]), at: [1800, 110], depth: DZ.mag, thick: 0.8,
    in: FLY(93.55, 94.5), ...UP(98.25, 98.95) }, ...field('mag', 30));
  // the orange → pink stadium ring: outer x 960–1880, y 65–545; hole x 1120–1720, y 225–385
  const ring = P21({ shape: ringShape([960, 65, 1880, 545, 240], [1120, 225, 1720, 385, 80], [1420, 305]), at: [1420, 305], depth: DZ.ring, thick: 1.0,
    in: FLY(93.6, 94.6), ...UP(98.3, 99.0) }, ...field('ring', 55));
  // the thick violet ∪: outer x 1265–1610 (bottom y 335), slot x 1375–1490 (bottom y 220); legs run up past the frame
  const Ush = (() => { const at = [1437.5, 162.5], s = new THREE.Shape(), top = 162.5 + 700;
    s.moveTo(-172.5, top); s.lineTo(-172.5, 0); s.absarc(0, 0, 172.5, Math.PI, 2 * Math.PI, false); s.lineTo(172.5, top); s.lineTo(57.5, top);
    s.lineTo(57.5, 0); s.absarc(0, 0, 57.5, 0, -Math.PI, true); s.lineTo(-57.5, top); s.lineTo(-172.5, top); return [s, at]; })();
  const U = P21({ shape: Ush[0], at: Ush[1], depth: DZ.U, thick: 1.2, in: FLY(93.65, 94.6), ...UP(98.35, 99.05) }, ...field('U', 40));
  // the orange donut: centre (716, -40), r 285 / 120
  const donut = P21({ shape: S.ring(286, 128), at: [716, -40], depth: DZ.donut, thick: 1.0, in: FLY(93.8, 94.8), ...UP(98.4, 99.1) }, ...field('donut', 45));

  /* ---------- the left side ---------- */
  const tile = P21({ shape: rectS(0, -86, 378, 297, [189, 105]), at: [189, 105], depth: DZ.tile, thick: 0.6, in: FLY(94.1, 95.1), ...UP(98.45, 99.15) }, ...field('tile', 45));
  const quarter = P21({ shape: (() => { const at = [232, 483], s = new THREE.Shape(), X = x => x - at[0], Y = y => at[1] - y;
      s.moveTo(X(0), Y(292)); s.lineTo(X(470), Y(292)); s.lineTo(X(470), Y(675)); s.lineTo(X(230), Y(675)); s.absarc(X(230), Y(445), 230, -Math.PI / 2, -Math.PI, true);
      s.lineTo(X(0), Y(292)); return s; })(), at: [232, 483], depth: DZ.quarter, thick: 0.6, in: FLY(94.05, 95.05), ...UP(98.5, 99.2) }, ...field('quarter', 50));
  const column = P21({ shape: (() => { const at = [656, 700], s = new THREE.Shape(), X = x => x - at[0], Y = y => at[1] - y;
      s.moveTo(X(465), Y(1110)); s.lineTo(X(848), Y(1110)); s.lineTo(X(848), Y(582)); s.absarc(X(558), Y(582), 290, 0, Math.PI / 2, false); s.lineTo(X(465), Y(292)); s.lineTo(X(465), Y(1110)); return s; })(),
    at: [656, 700], depth: DZ.column, thick: 0.7, in: FLY(93.9, 94.9), ...UP(98.6, 99.3) }, ...field('column', 55));
  const lband = P21({ shape: rectS(-150, 745, 466, 958, [232, 851]), at: [232, 851], depth: DZ.lband, thick: 0.4, in: FLY(93.95, 94.95), ...UP(98.62, 99.3) }, ...field('lband', 45));
  const dband = P21({ shape: rectS(-150, 952, 466, 1110, [232, 1031]), at: [232, 1031], depth: DZ.dband, thick: 0.5, in: FLY(94.0, 95.0), ...UP(98.65, 99.35) }, ...field('dband', 50));

  /* ---------- the four half-discs (bulging left, flat edge right; 114 × 228), just behind the sphere's line ---------- */
  const R0 = 114, CX = 4 * R0 / (3 * Math.PI);                             // centroid 48.4 px left of the flat edge (the flip axis)
  const discs = [314, 428, 542, 656].map((fx, k) => {
    const s = new THREE.Shape(); s.moveTo(CX, -R0); s.absarc(CX, 0, R0, -Math.PI / 2, -1.5 * Math.PI, true); s.lineTo(CX, -R0);
    const a = 94.25 + 0.09 * (3 - k);
    return { k, pc: P21({ shape: s, at: [fx - CX, 822], depth: DZ.disc, thick: 0.35, in: { type: 'grow', t: [a, a + 0.6], ease: 'back.out(1.6)' }, out: { type: 'flip', t: [98.55 + 0.06 * k, 98.95 + 0.06 * k], ease: 'power2.in' } }, ...field('disc' + k, 38)),
      x: H.at(fx - CX, 822, D21).x };
  });

  /* ---------- reactions to the sphere passing (post-pose tweaks on the pieces' meshes) ---------- */
  const qA = new THREE.Quaternion(), Xv = new Vec(1, 0, 0), Yv = new Vec(0, 1, 0), Zv = new Vec(0, 0, 1);
  const xOn = px => H.at(px, 822, D21).x;                                // world x on the sphere's line under board px
  const p2o = E('power2.out'), p3o = E('power3.out');
  const reacts = [
    // the half-discs flip over in its wake, with a small hop and a tug in its direction of travel
    ...discs.map(({ pc, x, k }) => [pc, x, (past, me) => { const u = cl((past - 0.5) / 4.2), e = p2o(u), bump = Math.sin(Math.PI * u);
      me.quaternion.multiply(qA.setFromAxisAngle(Yv, 2 * Math.PI * e * (k % 2 ? -1 : 1)));
      me.position.addScaledVector(H.upv, 0.35 * bump).addScaledVector(H.right, -0.3 * bump); }]),
    // the donut spins a full turn the way the sphere rolls, and bobs
    [donut, xOn(716), (past, me) => { const u = cl((past + 0.3) / 5.5); if (u <= 0 || u >= 1) return;
      me.quaternion.multiply(qA.setFromAxisAngle(Zv, 2 * Math.PI * p2o(u))); me.position.addScaledVector(H.upv, 0.35 * Math.sin(Math.PI * u)); }],
    // the ∪ spins round as the sphere rolls under it (done before the key)
    [U, xOn(1437.5), (past, me) => { const u = cl((past + 0.4) / 4.4); if (u <= 0 || u >= 1) return;
      me.quaternion.multiply(qA.setFromAxisAngle(Yv, -2 * Math.PI * p3o(u))); }],
    // the rings sway back as it passes under them, and settle before the key
    [ring, xOn(1500), (past, me) => { const u = cl((past + 1.5) / 4.8); if (u <= 0 || u >= 1) return;
      me.quaternion.multiply(qA.setFromAxisAngle(Yv, -0.42 * Math.sin(Math.PI * u) * (1 - 0.35 * u))); }],
    [mag, xOn(1850), (past, me) => { const u = cl((past + 1.5) / 4.5); if (u <= 0 || u >= 1) return;
      me.quaternion.multiply(qA.setFromAxisAngle(Xv, 0.5 * Math.sin(Math.PI * u))); }],
    // the left-hand shapes push back as it rolls past them
    [column, xOn(700), (past, me) => { const u = cl((past + 0.3) / 4.5); if (u <= 0 || u >= 1) return; const s = Math.sin(Math.PI * u);
      me.position.addScaledVector(H.fwd, 0.9 * s); me.quaternion.multiply(qA.setFromAxisAngle(Yv, -0.14 * s)); }],
    [lband, xOn(260), (past, me) => { const u = cl((past + 0.3) / 5); if (u <= 0 || u >= 1) return; me.position.addScaledVector(H.fwd, 0.6 * Math.sin(Math.PI * u)); }],
    [quarter, xOn(300), (past, me) => { const u = cl((past + 0.8) / 5); if (u <= 0 || u >= 1) return; const s = Math.sin(Math.PI * u);
      me.position.addScaledVector(H.fwd, 0.8 * s); me.quaternion.multiply(qA.setFromAxisAngle(Xv, -0.12 * s)); }],
    [tile, xOn(190), (past, me) => { const u = cl((past + 0.4) / 5); if (u <= 0 || u >= 1) return; const s = Math.sin(Math.PI * u);
      me.position.addScaledVector(H.fwd, 0.7 * s); me.quaternion.multiply(qA.setFromAxisAngle(Xv, 0.1 * s)); }],
  ];
  anim((t, b) => { if (!b || !b.p || t < 93.2 || t > 99.6) return; for (const [pc, x, fn] of reacts) if (pc.mesh.visible) fn(x - b.p.x, pc.mesh, t); });

  /* ---------- the deck: the stripe band lying flat at the sphere's contact height, solved against the hold camera ---------- */
  const yF = m21.y - 1.005, THK = 0.4;
  const ray = (px, py) => H.fwd.clone().addScaledVector(H.right, (px - 960) / 540 * H.tanV).addScaledVector(H.upv, (540 - py) / 540 * H.tanV);
  const onY = (px, py, y) => { const r = ray(px, py); return H.pos.clone().addScaledVector(r, (y - H.pos.y) / r.y); };
  const XR = O.x + 46;
  const FL = onY(850, 958, yF), BL = onY(850, 746, yF), FR = new Vec(XR, yF, FL.z), BR = new Vec(XR, yF, BL.z);
  // a slab from 4 top corners (front-left, front-right, back-right, back-left), th deep, flat normals per face
  const slab = (c, th) => { const d = new Vec(0, -th, 0), b = c.map(p => p.clone().add(d)), pos = [], nor = [];
    const quad = (p, q, r, s) => { const n = q.clone().sub(p).cross(r.clone().sub(p)).normalize(); for (const v of [p, q, r, p, r, s]) { pos.push(v.x, v.y, v.z); nor.push(n.x, n.y, n.z); } };
    const [f0, f1_, f2, f3] = c, [g0, g1, g2, g3] = b;
    quad(f0, f1_, f2, f3); quad(g3, g2, g1, g0); quad(g0, g1, f1_, f0); quad(g1, g2, f2, f1_); quad(g2, g3, f3, f2); quad(g3, g0, f0, f3);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); return g; };
  // make sure every face points outward (the corner order above is counter-clockwise seen from above)
  const deckGeo = slab([FL, FR, BR, BL].map(p => p.clone()), THK);
  { const p = deckGeo.attributes.position, n = deckGeo.attributes.normal, c = new Vec(); for (let i = 0; i < p.count; i++) c.add(new Vec(p.getX(i), p.getY(i), p.getZ(i))); c.divideScalar(p.count);
    for (let i = 0; i < p.count; i += 3) { const v = new Vec(p.getX(i), p.getY(i), p.getZ(i)).sub(c), nn = new Vec(n.getX(i), n.getY(i), n.getZ(i)); if (v.dot(nn) < 0) for (let j = i; j < i + 3; j++) n.setXYZ(j, -n.getX(j), -n.getY(j), -n.getZ(j)); } }
  // projected material: the board colour at the point's place in the hold view (+ the speed trail behind the sphere)
  const hc = new THREE.PerspectiveCamera(H.fov, 16 / 9, 0.05, 2000);
  hc.position.copy(H.pos); hc.up.set(0, 1, 0); hc.lookAt(H.look); hc.updateMatrixWorld(); hc.updateProjectionMatrix();
  const HVP = new THREE.Matrix4().multiplyMatrices(hc.projectionMatrix, hc.matrixWorldInverse);
  const WV = '#include <common>\n#include <logdepthbuf_pars_vertex>\nvarying vec3 vW; varying vec3 vN;\nvoid main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w;\n#include <logdepthbuf_vertex>\n}';
  const ballU = { value: new Vec() }, trailU = { value: 0 };
  const deckM = new THREE.ShaderMaterial({ transparent: true, depthWrite: true,
    uniforms: { hvp: { value: HVP }, op: { value: 0 }, t: { value: 0 }, flow: back.flow, spd: back.spd, ball: ballU, trail: trailU },
    vertexShader: WV,
    fragmentShader: `uniform mat4 hvp; uniform float op, t, flow, spd, trail; uniform vec3 ball;
varying vec3 vW; varying vec3 vN;
#include <logdepthbuf_pars_fragment>
${LIB_BAND}${SLF}
void main() {
  vec4 hq = hvp * vec4(vW, 1.0);
  vec2 bp = vec2((hq.x / hq.w * 0.5 + 0.5) * 1920.0, (0.5 - 0.5 * hq.y / hq.w) * 1080.0);
  vec2 sl = SL(t, flow);
  vec3 col = bandCol(bp, sl.x);
  vec3 nb = normalize(vN);
  float top = step(0.5, nb.y), m = stripeM(bp.y) * top;
  // the speed trail: the stripes light up behind the sphere on the way in
  float dx = vW.x - ball.x, tr = trail * top * smoothstep(-0.9, 0.5, dx) * exp(-max(dx, 0.0) / 7.5) * exp(-abs(vW.z - ball.z) / 8.0);
  col = mix(col, mix(col, vec3(1.0, 0.94, 0.88), 0.45 + 0.3 * m), clamp(tr * (0.25 + 0.75 * m), 0.0, 1.0));
  // the deck's sides read darker as they turn from the camera (form shading, never switched off: at the key the front
  // edge faces the camera and keeps the board's wash; from the chase camera it reads as a chunky side)
  col *= top > 0.5 ? 1.0 : mix(0.66 + 0.08 * nb.z, 1.0, smoothstep(0.75, 0.99, abs(dot(nb, normalize(cameraPosition - vW)))));
  gl_FragColor = vec4(col, op);
#include <logdepthbuf_fragment>
}` });
  const deck = new THREE.Mesh(deckGeo, deckM); deck.frustumCulled = false; scene.add(deck);

  /* ---------- the ledge: the row line on from the deck's left end to the gap (-10.5), where the sphere drops into 22 ---------- */
  const LW = 0.5, LX0 = G.gap.x + 0.45, LX1 = FL.x + 0.8;               // (review fix: it ends before frame 22's chute top, not inside it)
  const ledgeM = V.mat(['#7c22fc', '#6a12fe', '#5902fc'], { axis: [1, 0, 0], lo: LX0, hi: LX1 });
  const ledge = new THREE.Mesh(slab([new Vec(LX0, yF - 0.012, m21.z + LW), new Vec(LX1, yF - 0.012, m21.z + LW), new Vec(LX1, yF - 0.012, m21.z - LW), new Vec(LX0, yF - 0.012, m21.z - LW)], 0.32), ledgeM);
  { const g = ledge.geometry, p = g.attributes.position, n = g.attributes.normal, c = new Vec((LX0 + LX1) / 2, yF - 0.17, m21.z);
    for (let i = 0; i < p.count; i += 3) { const v = new Vec(p.getX(i), p.getY(i), p.getZ(i)).sub(c), nn = new Vec(n.getX(i), n.getY(i), n.getZ(i)); if (v.dot(nn) < 0) for (let j = i; j < i + 3; j++) n.setXYZ(j, -n.getX(j), -n.getY(j), -n.getZ(j)); } }
  ledge.frustumCulled = false; scene.add(ledge);

  /* ---------- timing: the deck and ledge fades, the hold switch, the trail ---------- */
  anim((t, b) => {
    const on = t > 93.2 && t < 99.5;
    const dOp = on ? 1 - sm((t - 98.7) / 0.6) : 0;
    deck.visible = dOp > 0.002; deckM.uniforms.op.value = dOp; deckM.transparent = dOp < 0.999; deckM.depthWrite = dOp >= 0.999;
    deckM.uniforms.t.value = t;
    trailU.value = on ? 1 - sm((t - 95.3) / 0.8) : 0;
    if (b && b.p) ballU.value.copy(b.p);
    // the ledge melts into the board as the camera lands, and comes back as it leaves
    const lOp = on ? Math.min(1 - sm((t - 95.95) / 0.35) + sm((t - 97.6) / 0.35), 1 - sm((t - 98.95) / 0.4)) : 0;
    ledge.visible = lOp > 0.002; ledgeM.uniforms.op.value = lOp; ledgeM.transparent = lOp < 0.999; ledgeM.depthWrite = lOp >= 0.999;
  });

  /* ---------- two dark halves in front of the camera at the start: they part to reveal the set (out of frame 20's hole) ---------- */
  {
    const cam0 = m21.clone().add(vec(X0, 0, 0)).add(offA), look0 = m21.clone().add(vec(X0, 0, 0)).add(lookA);
    const dummy = new THREE.PerspectiveCamera(); dummy.position.copy(cam0); dummy.lookAt(look0);
    const q = dummy.quaternion.clone(), dir = look0.clone().sub(cam0).normalize(), upv = vec(0, 1, 0).applyQuaternion(q);
    // (review: the edges were orange and read as letterbox trim; now a deep violet rim, the lip of a dark hole. The closed state
    // at the 93.25 cut is unchanged: G4's dip covers it fully there)
    const darkM = V.mat(['#150632'], { flat: true }), edgeM = V.mat(['#3a1488', '#2a0e66'], { flat: true });
    const halves = [1, -1].map(s => {
      const sh = new THREE.Shape(); sh.moveTo(2, 0); sh.absarc(0, 0, 2, 0, Math.PI, false); sh.lineTo(2, 0);
      const g = new THREE.Group(); g.quaternion.copy(q); if (s < 0) g.rotateZ(Math.PI); scene.add(g);
      V.add(new THREE.ShapeGeometry(sh, 48), darkM, [0, 0, 0], [0, 0, 0], g);
      V.add(new THREE.BoxGeometry(4, 0.02, 0.01), edgeM, [0, 0.01, 0.005], [0, 0, 0], g);
      return { g, s };
    });
    anim((t, b) => halves.forEach(({ g, s }) => {
      const u = cl((t - 93.25) / 0.8);                                  // (from the cut, power1: they start parting at once, so the view is never still)
      g.visible = t >= 93.2 && t < 94.2 && u < 1;
      g.position.copy(b.p).add(offA).addScaledVector(dir, 1.3).addScaledVector(upv, s * 1.9 * E('power1.inOut')(u));
    }));
  }
};
