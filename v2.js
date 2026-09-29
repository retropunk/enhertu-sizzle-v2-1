/* =====================================================================
   ENHERTU Sizzle · version 2 · animatic engine
   Every storyboard frame gets a HOLD: the camera lands on a pose from which the frame's board picture is matched,
   holds (~1.5 s, shapes drifting subtly), then releases to follow the sphere to the next one.
   In the animatic each board is a flat PLATE standing where its set will be, facing its hold camera, sized to fill
   the frame exactly; a stand-in sphere rolls the journey and passes its board spot and size at the key instant,
   showing the board's white-orange face then (its roll is turned a little between keys; where it fills the frame,
   82.55–84.3 s and from 139.0 s on, it shows the approved piece's colours exactly: see "sphere table").
   The piece is authored in GROUPS (groups/g1.js …) that meet at hidden cuts (wipes, dark tunnels, the sphere filling
   the frame), so each group lives in its own region of the world and can be designed on its own.
   Pure function of display time t (0 … END): scrubs and renders frame-accurately.
   Reuses from v1's course3d.js: the living-gradient material, the sphere, the eases, the camera keys.
   ===================================================================== */
import * as THREE from './vendor/three.module.js';

export const END = 146.95;
// v1's frame starts (display seconds, 3D). Timing is kept (user, 2026-09-27) so music, SFX and copy line up later.
export const FR = [[1, 0], [2, 4.2], [3, 8], [4, 13.2], [5, 14.8], [6, 17.75], [7, 21.45], [8, 27.25], [9, 32.35], [10, 36.95],
  [11, 41.65], [12, 47.25], [13, 52.45], [14, 56.85], [15, 61.95], [16, 67.25], [17, 72.55], [18, 77.95], [19, 83.35], [20, 88.35],
  [21, 93.55], [22, 98.55], [23, 103.75], [24, 109.35], [25, 115.95], [27, 121.15], [28, 125.95], [29, 132.55], [30, 136.05], [31, 139.55]];
export const win = n => { const i = FR.findIndex(f => f[0] === n); return [FR[i][1], i + 1 < FR.length ? FR[i + 1][1] : END]; };
export const frameAt = t => { let n = 1; for (const [k, s] of FR) if (t >= s - 1e-6) n = k; return n; };
// the sphere on each board: centre (stage px) and diameter (px). null = no sphere on the board.
export const BOARD = {
  1: { px: 1379, py: 400, d: 109 }, 2: { px: 1687, py: 330, d: 137 }, 3: { px: 1562, py: 328, d: 140 }, 4: null,
  5: { px: 1015, py: 451, d: 276 }, 6: { px: 1004, py: 556, d: 136 }, 7: { px: 664, py: 580, d: 190 }, 8: { px: 890, py: 236, d: 76 },
  9: { px: 620, py: 670, d: 300 }, 10: { px: 910, py: 874, d: 80 }, 11: { px: 1417, py: 878, d: 118 }, 12: { px: 958, py: 628, d: 257 },
  13: { px: 1417, py: 660, d: 206 }, 14: { px: 1255, py: 308, d: 352 }, 15: { px: 1368, py: 488, d: 316 }, 16: { px: 1250, py: 625, d: 130 },
  17: { px: 214, py: 516, d: 128 }, 18: { px: 577, py: 245, d: 185 }, 19: { px: 868, py: 488, d: 172 }, 20: { px: 210, py: 802, d: 172 },
  21: { px: 800, py: 822, d: 230 }, 22: { px: 927, py: 85, d: 106 }, 23: { px: 455, py: 775, d: 205 }, 24: { px: 1021, py: 740, d: 200 },
  25: { px: 932, py: 760, d: 185 }, 27: { px: 1587, py: 415, d: 127 }, 28: { px: 1095, py: 420, d: 125 }, 29: { px: 720, py: 690, d: 262 },
  30: { px: 1040, py: 670, d: 340 }, 31: null,
};
// hidden cuts between groups (display s). Each group owns [its first cut, the next cut). tools/serve.mjs keeps an identical
// CUTS (and GROUP_FRAMES) for the camera moments' cut guard: change both (dev/check.mjs says when its guard differs).
export const CUTS = { G1: 0, G2: 13.2, G3: 41.4, G4: 66.85, G5: 93.25, G6: 115.15, G7: 139.35 };
const GROUP_FRAMES = { G1: [1, 2, 3], G2: [4, 5, 6, 7, 8, 9, 10], G3: [11, 12, 13, 14, 15], G4: [16, 17, 18, 19, 20], G5: [21, 22, 23, 24], G6: [25, 27, 28, 29, 30], G7: [31] };
/* per-frame edits (frames/fNN.json, one per board frame): adjustments on top of the built frame, for the player's Edit
   mode and for Claude. Each is full at that frame's hold and eases out to nothing by the neighbouring frames, never past a
   hidden cut (the other group stays as built). The Edit mode previews them live with setEdit(n, e), below.
     timing: { holdStart, holdEnd }  seconds to move the hold's start / end (the frames around it re-time smoothly)
     camera: { orbit, tilt (deg around the frame's sphere spot), push (fraction closer, e.g. 0.2), panX, panY (px), lens (deg of fov), roll (deg) }
     sphere: { speed (× through this frame, 0.6–1.5; it still passes its board spot on time), nudge: [px right, px down, units back] } */
const pad2 = n => String(n).padStart(2, '0');
/* edits kept in the browser (the hosted web page has no helper to write files): index.html sets, before loading this file,
   window.__v2Local = { frames: { n: {…as frames/fNN.json} }, content: {…as content/copy.json}, pictures: { 'assets/copy/x.jpg': 'blob:…' } }.
   A frame or the content given there is used instead of its file, and a picture added in the browser is shown from its
   blob URL. With no __v2Local (the local player, the exporter, the dev tools) the files are read exactly as before. */
const LOCAL = window.__v2Local && typeof window.__v2Local === 'object' ? window.__v2Local : null;
export const EDITS = {};
await Promise.all(FR.map(async ([n]) => {
  if (LOCAL && LOCAL.frames && LOCAL.frames[n] && typeof LOCAL.frames[n] === 'object') { EDITS[n] = LOCAL.frames[n]; return; }
  try { const r = await fetch(`frames/f${pad2(n)}.json`, { cache: 'no-store' }); if (r.ok) EDITS[n] = await r.json(); } catch {}
}));
/* camera moments (frames/moments.json; the player's "Add a moment here"): camera adjustments at any moment, between the
   keyframes too. { about, moments: [{ id, t (display s), width (s: the blend's half-width, 0.3–2.0, default 0.6),
   camera: { orbit, tilt, push, panX, panY, lens, roll } (as the per-frame camera edits, same limits), note }] }.
   Each is full at t and eases in and out over ± width (a smoothstep bump, the quintic one), on top of the frame edits;
   applyMoments() and editCamera() below. Camera only: the sphere, the copy's timing and the sound never move. No file
   (or an empty list) = no moments, and the piece renders exactly as built. The hosted page gives its list as window.__v2Local.moments
   (an array, even empty, is used instead of the file). The Edit mode previews changes live with setMoments(list). */
const MOMENTS = { src: [], loaded: [], file: null, error: null };
if (LOCAL && (Array.isArray(LOCAL.moments) || (LOCAL.moments && Array.isArray(LOCAL.moments.moments)))) {
  MOMENTS.loaded = Array.isArray(LOCAL.moments) ? LOCAL.moments : LOCAL.moments.moments; MOMENTS.file = 'the browser';
} else try {
  const r = await fetch('frames/moments.json', { cache: 'no-store' });
  if (r.ok) {
    MOMENTS.file = 'frames/moments.json';
    const txt = await r.text();
    let d;
    try { d = JSON.parse(txt); } catch (e) {                          // (where: the parser's position, or its quoted snippet found in the text)
      const pos = /position (\d+)/.exec(e.message), snip = /(?:\.\.\.)?"([\s\S]*?)"(?:\.\.\.)? is not valid JSON/.exec(e.message);
      const at = pos ? +pos[1] : snip && snip[1] ? txt.indexOf(snip[1]) : -1;
      MOMENTS.error = `frames/moments.json can't be read${at >= 0 ? ` near line ${txt.slice(0, at).split('\n').length}` : ''} (${e.message.replace(/\s+/g, ' ').slice(0, 160)}; often a missing or extra comma or quote): no camera moments are used until it's fixed`;
    }
    if (!MOMENTS.error) {                                           // { "moments": [ … ] } only: the helper (tools/serve.mjs readMoments) and the
      // player (index.html readMomentsFile) read the file the same way, so a bare list is a mistake for all three (review, 09-29)
      if (d && typeof d === 'object' && !Array.isArray(d) && (d.moments === undefined || Array.isArray(d.moments))) MOMENTS.loaded = d.moments || [];
      else MOMENTS.error = 'frames/moments.json should be { "moments": [ … ] }: no camera moments are used until it\'s fixed';
    }
  }                                                                 // (no file: no moments)
} catch {}
MOMENTS.src = MOMENTS.loaded;
/* the editable content (content/copy.json; the user's guide: content/README.md): every line of copy text and every picture,
   per frame. Loaded here, before the copy files run; they read it through copy/content.js, with today's values as their
   defaults, so a missing or broken file leaves the copy as built. check.mjs reports the file's state, the edits in use
   (with a note on any edited line auto-fit had to shrink below SHRUNK of its size) and anything in it the copy doesn't
   use (a typo, a line a frame doesn't have). window.v2.content: { file, error, edits, problems, notes, fit }. The page
   reads it once, when it loads. */
export const CONTENT = { data: null, error: null, used: new Set(), defaults: {}, edits: [], problems: [] };
// (the browser's words and pictures: a copy, with each picture added in the browser pointing at its blob URL. As a second
// guard behind index.html's check, a picture must be a file name in assets/copy/ (or one added in the browser) and its
// crop point a plain position; anything else is left out, so the picture as built shows: the copy files put these into HTML)
const localPics = d => {
  const map = (LOCAL && LOCAL.pictures) || {}, out = JSON.parse(JSON.stringify(d));
  const SAFE = /^assets\/copy\/[\w.-]+\.(?:jpe?g|png|webp|gif|svg)$/i, FOCUS = /^[a-z0-9 .%-]{1,40}$/i;
  const added = s => Object.prototype.hasOwnProperty.call(map, s) && typeof map[s] === 'string' && map[s].startsWith('blob:');
  for (const f of Object.values(out.frames || {})) if (f && f.pictures && typeof f.pictures === 'object') for (const [k, v] of Object.entries(f.pictures)) {
    const p = typeof v === 'string' ? { src: v } : v && typeof v === 'object' && !Array.isArray(v) ? { ...v } : null;
    const src = p && typeof p.src === 'string' ? p.src.trim() : null;
    if (!p || (p.src !== undefined && (src === null || (src !== '' && !SAFE.test(src) && !added(src))))) { delete f.pictures[k]; continue; }
    if (p.focus !== undefined && !(typeof p.focus === 'string' && FOCUS.test(p.focus.trim()))) delete p.focus;
    if (src && added(src)) p.src = map[src];
    f.pictures[k] = typeof v === 'string' && p.src === v ? v : p;
  }
  return out;
};
if (LOCAL && LOCAL.content && typeof LOCAL.content === 'object' && LOCAL.content.frames && typeof LOCAL.content.frames === 'object') CONTENT.data = localPics(LOCAL.content);
else try {
  const r = await fetch('content/copy.json', { cache: 'no-store' });
  if (!r.ok) CONTENT.error = `content/copy.json not found (HTTP ${r.status}): the copy is as built`;
  else {
    const txt = await r.text();
    try { CONTENT.data = JSON.parse(txt); } catch (e) {                // (where: the parser's position, or its quoted snippet found in the text)
      const pos = /position (\d+)/.exec(e.message), snip = /\.\.\."([\s\S]*?)"\.\.\./.exec(e.message), at = pos ? +pos[1] : snip ? txt.indexOf(snip[1]) : -1;
      CONTENT.error = `content/copy.json can't be read${at >= 0 ? ` near line ${txt.slice(0, at).split('\n').length}` : ''} (${e.message.replace(/\s+/g, ' ').slice(0, 160)}; often a missing or extra comma or quote): the copy is as built until it's fixed`;
    }
    if (CONTENT.data && (typeof CONTENT.data !== 'object' || typeof CONTENT.data.frames !== 'object' || !CONTENT.data.frames)) { CONTENT.error = 'content/copy.json has no "frames": the copy is as built'; CONTENT.data = null; }
  }
} catch (e) { CONTENT.error = `content/copy.json couldn't be loaded (${e.message}): the copy is as built`; }
const contentReport = () => {                                     // the file's state for check() and the player
  const p = [...CONTENT.problems], d = CONTENT.data;
  if (d) for (const [k, f] of Object.entries(d.frames)) {
    const n = +k;
    if (!f || typeof f !== 'object') { p.push(`content/copy.json: frame "${k}" should be { "text": …, "pictures": … }`); continue; }
    for (const [g, a] of Object.entries(f.text || {})) {
      if (!Array.isArray(a)) { p.push(`content/copy.json: frame ${k} text "${g}" should be a list of lines in [ ]`); continue; }
      a.forEach((_, i) => { if (!CONTENT.used.has(`${n}/text/${g}/${i}`)) p.push(`content/copy.json: frame ${k} text "${g}" line ${i + 1} isn't used (check the frame and the name; a frame's lines can be changed, not added)`); });
    }
    for (const g of Object.keys(f.pictures || {})) if (!CONTENT.used.has(`${n}/pictures/${g}`)) p.push(`content/copy.json: frame ${k} picture "${g}" isn't used (check the frame and the name)`);
  }
  const G = ['panel', 'card', 'left', 'numbers', 'lines', 'right', 'pictures'], at = e => e.n * 1e4 + (G.includes(e.g) ? G.indexOf(e.g) : 6) * 100 + e.i;
  const eds = CONTENT.edits.slice().sort((a, b) => at(a) - at(b));
  // an edited line that auto-fit had to shrink a lot (e.k, content.js's noteFit) reads smaller than the lines round it:
  // said in its edit line (check.mjs) and in notes (the player's Words tab); fit: every edited line's size factor
  const small = e => e.k != null && e.k < SHRUNK, pct = e => `${Math.round(e.k * 100)}%`;
  return { file: CONTENT.error ? 'built-in copy' : 'content/copy.json', error: CONTENT.error,
    edits: eds.map(e => (small(e) ? `${e.text} (shrunk to ${pct(e)} to fit its space: try a shorter line)` : e.text)), problems: p,
    notes: eds.filter(small).map(e => `${e.where} is shrunk to ${pct(e)} of its size to fit its space, so it's smaller than the lines around it: try a shorter line`),
    fit: Object.fromEntries(eds.filter(e => e.key && e.k != null).map(e => [e.key, +e.k.toFixed(3)])) };
};
const SHRUNK = 0.85;                                              // (below this an edited line's shrink is worth a note)
const R = 1;                                                    // sphere radius (world units); speeds are in u/s (8.5 = the user's "perfect")

/* ---------------- renderer ---------------- */
const canvas = document.getElementById('c3d');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, logarithmicDepthBuffer: true });
renderer.setPixelRatio(1);
{ const k = Math.min(3, Math.max(1, +new URLSearchParams(location.search).get('scale') || 1)); renderer.setSize(1920 * k, 1080 * k, false); }
// the 3D picture's pixel size while the page runs (k × 1920×1080, as ?scale=k): the in-browser recorder sets 2 for a 4K video
export const setRenderScale = k => { k = Math.min(3, Math.max(1, +k || 1)); renderer.setSize(1920 * k, 1080 * k, false); };
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;          // shaders output display sRGB directly (as v1)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.05, 2000);

/* ---------------- palette + living-gradient material (from v1) ---------------- */
const hex2rgb = h => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map(c => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const PAL = ['#ffa800', '#ff7a00', '#ff4f7b', '#d10cf0', '#7b2bf9', '#4b00ff'].map(hex2rgb), DEEP = hex2rgb('#3a10a8');
const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const dist = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
const v3 = rgb => new THREE.Vector3(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
const hexV = h => v3(hex2rgb(h));
let flowAmt = 1, FX = { sp: 1, wild: 0, walk: 0 };
export function setFlow(v) { flowAmt = Math.min(5, Math.max(0, +v || 0)); const e = Math.max(0, flowAmt - 1.6); FX = { sp: 1 + 0.5 * e, wild: Math.min(1, e / 0.9), walk: 0.8 * e }; }
function partnerOf(hex, seed) {
  const base = hex2rgb(hex);
  if (Math.max(...base) < 140) return v3(DEEP);
  let best = 0; PAL.forEach((c, k) => { if (dist(c, base) < dist(PAL[best], base)) best = k; });
  const k = best + (rnd(seed) < 0.5 ? -1 : 1);
  return v3(PAL[k < 0 || k >= PAL.length ? best : k]);
}
const GV = `
#include <common>
#include <logdepthbuf_pars_vertex>
varying vec3 vW; varying vec3 vN; varying vec3 vO; varying vec3 vNv;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vO = position; vNv = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
  #include <logdepthbuf_vertex>
}`;
const GF = `
uniform vec3 c0, c1, c2, p0, p1, p2, axis, rc;
uniform float lo, hi, rad, t, flow, ph, per, shadeK, op, spd, wild, walk, fold, loc, vshade;
uniform vec3 bi, kph, pal[6];
varying vec3 vW; varying vec3 vN; varying vec3 vO; varying vec3 vNv;
#include <logdepthbuf_pars_fragment>
vec3 palAt(float x) { x = clamp(x, 0.0, 5.0); vec3 c = pal[0]; for (int i = 0; i < 5; i++) c = mix(c, pal[i + 1], clamp(x - float(i), 0.0, 1.0)); return c; }
float easeEnds(float r) { const float z = 0.25; float g = r < z ? r * r / (2.0 * z) : r > 1.0 - z ? 1.0 - z - (1.0 - r) * (1.0 - r) / (2.0 * z) : r - z * 0.5; return g / (1.0 - z); }
vec3 walkTo(vec3 col, float b, float tt, float k) { if (wild <= 0.0 || b < 0.0) return col; return mix(col, palAt(b + walk * (sin(tt / (per * 0.8) * 6.2832 + ph + k) - sin(ph + k))), wild); }
void main() {
  float tt = t * spd;
  vec3 P = loc > 0.5 ? vO : vW;                                          // pieces: the gradient rides with the shape
  float g = rad > 0.0 ? length(P - rc) / rad : (dot(P, axis) - lo) / (hi - lo);
  float dg = min(flow, 1.6) * 0.14 * (sin(tt / per * 6.2832 + ph) - sin(ph));
  g += dg;
  g = loc > 0.5 ? clamp(g, 0.0, 1.0) : 1.0 - abs(1.0 - mod(max(g, 0.0), 2.0));   // pieces hold their end colours (as the boards do)
  g = mix(g, easeEnds(g), fold * min(1.0, abs(dg) / 0.04));
  float s = sin(3.14159 * tt / (per * 0.8));
  float m = min(0.85, flow * 0.5 * s * s);
  vec3 a = walkTo(mix(c0, p0, m), bi.x, tt, kph.x), b = walkTo(mix(c1, p1, m), bi.y, tt, kph.y), c = walkTo(mix(c2, p2, m), bi.z, tt, kph.z);
  vec3 col = g < 0.5 ? mix(a, b, g * 2.0) : mix(b, c, g * 2.0 - 1.0);
  vec3 n = normalize(vN);
  float shade = mix(1.0, 0.8 + 0.2 * n.y + 0.08 * n.z - 0.05 * n.x, shadeK);
  if (vshade > 0.5) { vec3 nv = normalize(vNv); shade = mix(0.72 + 0.12 * nv.y - 0.05 * nv.x, 1.0, smoothstep(0.55, 0.98, abs(nv.z))); }   // pieces: faces keep the board colour, sides darker
  gl_FragColor = vec4(col * shade, op);
  #include <logdepthbuf_fragment>
}`;
const mats = [];
let mSeed = 0;
const FXU = { fold: { value: 1 }, spd: { value: 1 }, wild: { value: 0 }, walk: { value: 0 }, pal: { value: PAL.map(v3) } };
const palIdx = hex => { const base = hex2rgb(hex); if (Math.max(...base) < 140) return -1; let best = 0; PAL.forEach((c, k) => { if (dist(c, base) < dist(PAL[best], base)) best = k; }); return best; };
function mat(cols, o = {}) {
  const i = mSeed++;
  const c = cols.length === 1 ? [cols[0], cols[0], cols[0]] : cols.length === 2 ? [cols[0], cols[0], cols[1]] : cols;
  const uq = c.map(h => c.indexOf(h));
  const u = {
    c0: { value: hexV(c[0]) }, c1: { value: hexV(c[1]) }, c2: { value: hexV(c[2]) },
    p0: { value: partnerOf(c[0], i * 3) }, p1: { value: partnerOf(c[1], i * 3) }, p2: { value: partnerOf(c[2], i * 3) },
    kph: { value: new THREE.Vector3(...uq.map(j => 0.25 * j)) },
    axis: { value: new THREE.Vector3(...(o.axis || [0, 1, 0])).normalize() }, lo: { value: o.lo ?? -1 }, hi: { value: o.hi ?? 1 },
    rc: { value: new THREE.Vector3(...(o.rc || [0, 0, 0])) }, rad: { value: o.rad ?? 0 },
    t: { value: 0 }, flow: { value: 1 }, ph: { value: rnd(i + 7) * 6.28 }, per: { value: 7 + rnd(i + 3) * 6 },
    shadeK: { value: o.flat ? 0 : 1 }, op: { value: o.op ?? 1 }, loc: { value: o.local ? 1 : 0 }, vshade: { value: o.viewShade ? 1 : 0 },
    bi: { value: new THREE.Vector3(palIdx(c[0]), palIdx(c[1]), palIdx(c[2])) }, ...FXU,
  };
  const m = new THREE.ShaderMaterial({ uniforms: u, vertexShader: GV, fragmentShader: GF, transparent: (o.op ?? 1) < 1, side: o.side ?? THREE.FrontSide });
  mats.push(m);
  return m;
}

/* ---------------- geometry helpers (from v1) ---------------- */
function add(geo, m, pos = [0, 0, 0], rot = [0, 0, 0], parent = scene) {
  const mesh = new THREE.Mesh(geo, m); mesh.position.set(...pos); mesh.rotation.set(...rot); parent.add(mesh); return mesh;
}
function rr(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2; r = Math.min(r, w / 2, h / 2);
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0);
  s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2);
  s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
  s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, 1.5 * Math.PI);
  return s;
}
function ring(ro, ri) { const s = new THREE.Shape(); s.absarc(0, 0, ro, 0, Math.PI * 2, false); const h = new THREE.Path(); h.absarc(0, 0, ri, 0, Math.PI * 2, true); s.holes.push(h); return s; }
function disc(r) { const s = new THREE.Shape(); s.absarc(0, 0, r, 0, Math.PI * 2, false); return s; }
function arch(w, h, t) {
  const s = new THREE.Shape(), r = w / 2, ri = r - t, cy = h - r;
  s.moveTo(-r, 0); s.lineTo(-r, cy); s.absarc(0, cy, r, Math.PI, 0, true); s.lineTo(r, 0);
  s.lineTo(ri, 0); s.lineTo(ri, cy); s.absarc(0, cy, ri, 0, Math.PI, false); s.lineTo(-ri, 0); s.lineTo(-r, 0);
  return s;
}
function halfRing(ro, ri) { const s = new THREE.Shape(); s.moveTo(ro, 0); s.absarc(0, 0, ro, 0, Math.PI, false); s.lineTo(-ri, 0); s.absarc(0, 0, ri, Math.PI, 0, true); s.lineTo(ro, 0); return s; }
const ext = (shape, depth = 0.4) => new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 48 });

/* ---------------- background (screen-space gradient, keyed by time) ---------------- */
const bgU = { a: { value: new THREE.Vector3() }, b: { value: new THREE.Vector3() }, c: { value: new THREE.Vector3() }, t: { value: 0 }, flow: { value: 1 }, spd: FXU.spd };
const bg = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
  uniforms: bgU, depthWrite: false, depthTest: false,
  vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }',
  fragmentShader: `uniform vec3 a, b, c; uniform float t, flow, spd; varying vec2 vUv;
    void main() { float g = vUv.x * 0.75 + (1.0 - vUv.y) * 0.25 + flow * 0.08 * sin(t * 0.5 * spd);
      g = clamp(g, 0.0, 1.0); gl_FragColor = vec4(g < 0.5 ? mix(a, b, g * 2.0) : mix(b, c, g * 2.0 - 1.0), 1.0); }`,
}));
bg.frustumCulled = false; bg.renderOrder = -10; scene.add(bg);
const BGK = [];                                                     // [t, a, b, c]; default the blank purple
function bgAt(t) {
  const K = BGK.length ? BGK : [{ t: 0, c: ['#1a0a4a', '#220c5e', '#3f0aa8'].map(hexV) }];
  let i = 0; while (i < K.length - 1 && t > K[i + 1].t) i++;
  const a = K[i], b = K[Math.min(i + 1, K.length - 1)], u = b === a ? 0 : Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t))), k = u * u * (3 - 2 * u);
  ['a', 'b', 'c'].forEach((n, j) => bgU[n].value.copy(a.c[j]).lerp(b.c[j], k));
}

/* ---------------- the sphere (v1's glossy sphere; user: keep it, plain, no symbol) ---------------- */
const SV = `
#include <common>
#include <logdepthbuf_pars_vertex>
varying vec3 vL; varying vec3 vNv;
void main() { vL = position; vNv = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  #include <logdepthbuf_vertex>
}`;
const SF = `
uniform vec3 ring[8], avg;
uniform float dim;
varying vec3 vL; varying vec3 vNv;
#include <logdepthbuf_pars_fragment>
void main() {
  float a = atan(vL.z, vL.x) / 6.28318 + 0.5 + vL.y * 0.12;
  a = fract(a) * 8.0;
  int i = int(floor(a)); float f = fract(a);
  vec3 col = mix(ring[i], ring[(i + 1) - 8 * ((i + 1) / 8)], smoothstep(0.0, 1.0, f));
  col = mix(col, avg, smoothstep(0.72, 0.97, abs(normalize(vL).y)));   // the poles melt to the ring's average: no pinwheel where all colours meet
  vec3 n = normalize(vNv);
  float d = max(dot(n, normalize(vec3(-0.45, 0.55, 0.7))), 0.0);
  float dark = smoothstep(-0.1, 0.9, dot(n, normalize(vec3(0.45, -0.6, 0.35))));
  col = col * (1.0 - 0.35 * dark) + vec3(pow(d, 30.0) * 0.95 + pow(d, 6.0) * 0.22);
  gl_FragColor = vec4(col, 1.0 - dim);
  #include <logdepthbuf_fragment>
}`;
const ringCols = ['#ff7a00', '#ffd9a0', '#ffffff', '#ff4f7b', '#b52bf0', '#4b00ff', '#6a14ff', '#d10cf0'].map(hexV);
const ball = new THREE.Mesh(new THREE.SphereGeometry(R, 64, 48), new THREE.ShaderMaterial({ uniforms: { ring: { value: ringCols }, avg: { value: ringCols.reduce((a, c) => a.add(c), new THREE.Vector3()).multiplyScalar(1 / 8) }, dim: { value: 0 } }, vertexShader: SV, fragmentShader: SF }));
ball.renderOrder = 5; scene.add(ball);

/* ---------------- sphere trajectory (from v1): segs → 240 Hz table with rolling ---------------- */
const segs = [];
const seg = (t0, t1, ease, fn) => segs.push({ t0, t1, e: typeof ease === 'function' ? ease : gsap.parseEase(ease), fn });
const easeV = a => u => a * u + (1 - a) * u * u;                    // start speed a × average (end 2 − a)
const easeH = (m0, m1) => u => { const u2 = u * u, u3 = u2 * u; return 3 * u2 - 2 * u3 + m0 * (u3 - 2 * u2 + u) + m1 * (u3 - u2); };
// consecutive segs [t0, t1, length, fn] with no stop between them: knot speeds = weighted harmonic mean of neighbours (PCHIP)
const runSegs = (list, v0, v1) => {
  const d = list.map(([a, b, L]) => L / (b - a)), h = list.map(([a, b]) => b - a), v = [v0 ?? d[0]];
  for (let k = 1; k < list.length; k++) { const w1 = 2 * h[k] + h[k - 1], w2 = h[k] + 2 * h[k - 1]; v.push((w1 + w2) / (w1 / d[k - 1] + w2 / d[k])); }
  v.push(v1 ?? d.at(-1));
  list.forEach(([a, b, , fn], k) => { let m0 = v[k] / d[k], m1 = v[k + 1] / d[k]; const r = Math.hypot(m0, m1) / 3; if (r > 1) { m0 /= r; m1 /= r; } seg(a, b, easeH(m0, m1), fn); });
  return v;
};
const V3 = a => a instanceof THREE.Vector3 ? a.clone() : new THREE.Vector3(...a);
const line = (a, b, c = 1) => { a = V3(a); b = V3(b); const tan = b.clone().sub(a).normalize(); return u => ({ p: a.clone().lerp(b, u), c, tan }); };
const curve = (pts, c = 1, type = 'centripetal') => { const C = new THREE.CatmullRomCurve3(pts.map(V3), false, type); const f = u => ({ p: C.getPointAt(u), c, tan: C.getTangentAt(u) }); f.L = C.getLength(); f.curve = C; return f; };
const airArc = (a, b, h) => { a = V3(a); b = V3(b); return u => ({ p: new THREE.Vector3().lerpVectors(a, b, u).setY(a.y + (b.y - a.y) * u + 4 * h * u * (1 - u)), c: 0 }); };
const fallArc = (a, b) => { a = V3(a); b = V3(b); return u => ({ p: new THREE.Vector3(a.x + (b.x - a.x) * u, a.y + (b.y - a.y) * u * u, a.z + (b.z - a.z) * u), c: 0 }); };
const up = new THREE.Vector3(0, 1, 0);
const surfN = tan => up.clone().sub(tan.clone().multiplyScalar(tan.dot(up))).normalize();

/* ---------------- holds, plates, camera keys, cuts, overlays ---------------- */
export const holds = {};                                           // n → hold info
const plates = [];
const keys = [];                                                   // {t, v:[pos3, look3, f, fov, pf, roll], e, still}
const cutTimes = Object.values(CUTS).filter(t => t > 0).sort((a, b) => a - b);
const anims = [];
const notes = [];                                                  // {t0, t1, text}
export const wipes = [];                                           // {t0, dir, dur}
export const dips = [];                                            // {t, dur, col}
const texLoader = new THREE.TextureLoader();
export const boardSrc = n => `assets/board/f${n}.jpg`;
let loading = 0;
/* Board images are cleaned before they become plates (every group gets this):
   · the thin light border some board JPGs have (1–3 px at the sides/top, up to ~8 rows at the bottom of 4–6) is
     replaced by the nearest clean line, so a plate seen off its hold has no card outline;
   · the board's own painted sphere is filled in from the colours around it (row and column interpolation, then a few
     smoothing passes), so there is only ever one sphere, the 3D one, which covers that spot exactly at the key instant. */
function cleanBoard(img, n) {
  const W = img.naturalWidth || img.width, H = img.naturalHeight || img.height;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const x = cv.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
  const id = x.getImageData(0, 0, W, H), d = id.data, at = (i, j) => (j * W + i) * 4;
  const lum = (i, j) => { const k = at(i, j); return 0.3 * d[k] + 0.59 * d[k + 1] + 0.11 * d[k + 2]; };
  const lineLum = (horiz, k) => { let s = 0; const N = horiz ? W : H; for (let q = 0; q < N; q += 4) s += horiz ? lum(q, k) : lum(k, q); return s / Math.ceil(N / 4); };
  const copyLine = (horiz, from, to) => { const N = horiz ? W : H; for (let q = 0; q < N; q++) { const a = horiz ? at(q, from) : at(from, q), b = horiz ? at(q, to) : at(to, q); d[b] = d[a]; d[b + 1] = d[a + 1]; d[b + 2] = d[a + 2]; } };
  // edges: [horizontal line?, first line, step inward]
  for (const [horiz, first, step, maxN] of [[true, 0, 1, 4], [true, H - 1, -1, 12], [false, 0, 1, 4], [false, W - 1, -1, 4]]) {
    const ref = lineLum(horiz, first + step * (maxN + 6));
    let k = 0; while (k < maxN && lineLum(horiz, first + step * k) > Math.max(150, ref + 35)) k++;
    for (let q = 0; q < k; q++) copyLine(horiz, first + step * k, first + step * q);
  }
  const B = BOARD[n];
  if (B) {
    const s = W / 1920, cx = B.px * s, cy = B.py * s, r = B.d / 2 * s + 3 * s * 2;
    const x0 = Math.max(0, Math.floor(cx - r - 2)), x1 = Math.min(W - 1, Math.ceil(cx + r + 2)), y0 = Math.max(0, Math.floor(cy - r - 2)), y1 = Math.min(H - 1, Math.ceil(cy + r + 2));
    const inM = (i, j) => (i - cx) ** 2 + (j - cy) ** 2 <= r * r;
    const out = new Float32Array((x1 - x0 + 1) * (y1 - y0 + 1) * 3), bw = x1 - x0 + 1, ix = (i, j) => ((j - y0) * bw + (i - x0)) * 3;
    for (let j = y0; j <= y1; j++) for (let i = x0; i <= x1; i++) {
      if (!inM(i, j)) continue;
      let l = i, rr = i, u = j, dn = j;
      while (l > 0 && inM(l, j)) l--; while (rr < W - 1 && inM(rr, j)) rr++; while (u > 0 && inM(i, u)) u--; while (dn < H - 1 && inM(i, dn)) dn++;
      const wh = 1 / Math.max(1, rr - l), wv = 1 / Math.max(1, dn - u), fh = (i - l) / Math.max(1, rr - l), fv = (j - u) / Math.max(1, dn - u);
      for (let c = 0; c < 3; c++) {
        const h = d[at(l, j) + c] * (1 - fh) + d[at(rr, j) + c] * fh, v = d[at(i, u) + c] * (1 - fv) + d[at(i, dn) + c] * fv;
        out[ix(i, j) + c] = (h * wh + v * wv) / (wh + wv);
      }
    }
    for (let j = y0; j <= y1; j++) for (let i = x0; i <= x1; i++) if (inM(i, j)) for (let c = 0; c < 3; c++) d[at(i, j) + c] = out[ix(i, j) + c];
    for (let pass = 0; pass < 12; pass++)                                   // soften the cross-hatch the two interpolations leave
      for (let j = y0 + 1; j < y1; j++) for (let i = x0 + 1; i < x1; i++) if (inM(i, j)) for (let c = 0; c < 3; c++) {
        const k = at(i, j) + c; d[k] = (d[k] * 2 + d[k - 4] + d[k + 4] + d[k - W * 4] + d[k + W * 4]) / 6;
      }
  }
  x.putImageData(id, 0, 0);
  return cv;
}
const tex = n => {
  loading++;
  const t = new THREE.Texture(); t.colorSpace = THREE.NoColorSpace;
  const img = new Image();
  img.onload = () => { t.image = cleanBoard(img, n); t.needsUpdate = true; loading--; };
  img.onerror = () => { loading--; };
  img.src = boardSrc(n);
  return t;
};
export const texturesReady = () => loading === 0;
// a group can hold the first render until something async is ready (e.g. the brand font for 3D letters): V.waitFor(promise)
const waitFor = p => { loading++; Promise.resolve(p).catch(e => console.error(e)).finally(() => { loading--; }); return p; };

const tmpCam = new THREE.PerspectiveCamera(40, 16 / 9, 0.05, 2000);
// orientation basis of a camera at pos looking along dir (world up +y), rolled by roll° (as render does: lookAt then rotateZ)
function basisOf(pos, look, roll = 0) {
  tmpCam.position.copy(pos); tmpCam.up.set(0, 1, 0); tmpCam.lookAt(look); if (roll) tmpCam.rotateZ(roll * Math.PI / 180); tmpCam.updateMatrixWorld();
  const e = tmpCam.matrixWorld.elements;
  return { right: new THREE.Vector3(e[0], e[1], e[2]), upv: new THREE.Vector3(e[4], e[5], e[6]), fwd: new THREE.Vector3(-e[8], -e[9], -e[10]), q: tmpCam.quaternion.clone() };
}
const rayOf = (B, tanV, px, py) => B.fwd.clone().addScaledVector(B.right, (px - 960) / 540 * tanV).addScaledVector(B.upv, (540 - py) / 540 * tanV);   // depth component 1
/* hold(n, spec)
   spec.t: [t0, t1] camera still (default: back part of the frame's window); spec.tk: key instant (default mid-hold)
   camera, either
     { mark: [x,y,z], dir: [dx,dy,dz], fov, roll }  → placed so the sphere at `mark` shows at the board's spot and size, or
     { pos: [..], look: [..], fov, roll }            → explicit (mark = the board spot at the board size along that view)
   spec.land: ease name for the camera move INTO the hold (default: a smooth Hermite stop)
   spec.plate: false | { depth (from camera; default a bit behind the sphere), in: [a, b], out: [a, b], stay, drift (px) }
   Returns the hold info (pos, fwd, right, upv, tanV, mark, depth, t0, t1, tk, …) for placing keys and props. */
function hold(n, spec = {}) {
  const [w0, w1] = win(n);
  const fov = spec.fov ?? 28, roll = spec.roll ?? 0, tanV = Math.tan(fov * Math.PI / 360);
  const [t0, t1] = spec.t || (() => { const H = Math.min(2.2, Math.max(1.2, 0.35 * (w1 - w0))); return [w1 - 0.6 - H, w1 - 0.6]; })();
  const tk = spec.tk ?? (t0 + t1) / 2;
  const B0 = BOARD[n];
  let pos, look, Bs, mark = null, depth = null;
  if (spec.pos) {
    pos = V3(spec.pos); look = V3(spec.look); Bs = basisOf(pos, look, roll);
    if (B0) { depth = R * 540 / (B0.d / 2 * tanV); mark = pos.clone().addScaledVector(rayOf(Bs, tanV, B0.px, B0.py), depth); }
  } else {
    const dir = V3(spec.dir).normalize();
    mark = V3(spec.mark);
    Bs = basisOf(new THREE.Vector3(), dir, roll);
    const B = B0 || { px: 960, py: 540, d: 120 };
    depth = R * 540 / (B.d / 2 * tanV);
    pos = mark.clone().addScaledVector(rayOf(Bs, tanV, B.px, B.py), -depth);
    look = pos.clone().addScaledVector(Bs.fwd, 10);
    Bs = basisOf(pos, look, roll);
  }
  const aim = mark ? mark.clone() : pos.clone().addScaledVector(Bs.fwd, 30);   // where the view is centred (the mark, if given)
  if (!B0) mark = null;
  const h = { n, t0, t1, tk, pos, look, fov, roll, tanV, ...Bs, mark, aim, depth, spec, pass: !!spec.pass };
  // board point helper for this view: stage (px, py) at a given depth along the view
  h.at = (px, py, d) => pos.clone().addScaledVector(rayOf(Bs, tanV, px, py), d);
  holds[n] = h;
  const v = [...pos.toArray(), ...look.toArray(), 0, fov, 0, roll];
  // pass: true = a drift-through hold (quick frames): the camera passes through this exact pose at tk without stopping
  // (one key, tangent from its neighbours: surround it with keys that carry the motion through). Otherwise it holds still.
  if (spec.pass) keys.push({ t: tk, v, n });
  else keys.push({ t: t0, v, e: spec.land && gsap.parseEase(spec.land), still: true, n }, { t: t1, v, still: true, n });
  if (spec.plate !== false) {
    const P = spec.plate || {};
    const pd = P.depth ?? (depth ? depth + Math.max(3, 0.3 * depth) : 30);
    const hgt = 2 * pd * tanV, wid = hgt * 16 / 9;
    const m = new THREE.MeshBasicMaterial({ map: tex(n), transparent: true, opacity: 0, depthWrite: true, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(wid, hgt), m);
    mesh.quaternion.copy(Bs.q); scene.add(mesh);
    plates.push({ n, mesh, c: pos.clone().addScaledVector(Bs.fwd, pd), fwd: Bs.fwd.clone(), right: Bs.right.clone(), upv: Bs.upv.clone(), pxw: hgt / 1080, pd,
      in: P.in || [t0 - 1.0, t0 - 0.15], out: P.out || null, stay: !!P.stay, drift: P.drift ?? 4, fly: P.fly ?? 0.12 * pd, ph: rnd(n) * 6.28 });
  }
  return h;
}
/* camera key between holds (v1 semantics): key(t, pos, look, { f: look-follow 0..1 toward the sphere, fov, pf: 1 = pos and look
   are offsets from the sphere, roll°, ease: name → the move INTO this key is a plain eased move }) */
const key = (t, pos, look, o = {}) => keys.push({ t, v: [...V3(pos).toArray(), ...V3(look).toArray(), o.f ?? 0, o.fov ?? 40, o.pf ?? 0, o.roll ?? 0], e: o.ease && gsap.parseEase(o.ease), still: !!o.still });
const wipe = (t0, dir = 'lr', dur = 1.0) => wipes.push({ t0, dir, dur });   // the full-screen gradient pill (v1's 15→16 wipe); cut mid-wipe
const dip = (t, dur = 0.35, col = '#150632') => dips.push({ t, dur, col });  // animatic stand-in for a dark tunnel / hole cut
const note = (t0, t1, text) => notes.push({ t0, t1, text });
const bgKey = (t, a, b, c) => { BGK.push({ t, c: [a, b, c].map(hexV) }); BGK.sort((x, y) => x.t - y.t); };
const anim = fn => anims.push(fn);
const unplate = n => { for (let i = plates.length - 1; i >= 0; i--) if (plates[i].n === n) { scene.remove(plates[i].mesh); plates.splice(i, 1); } };   // a built frame drops its board picture
const REGION = { G1: 0, G2: 1, G3: 2, G4: 3, G5: 4, G6: 5, G7: 6 };
const region = g => new THREE.Vector3(REGION[g] * 3000, 0, 0);     // groups live 3000 units apart: none can see another

/* =====================================================================
   REAL SETS · pieces
   A piece is one of a board's gradient shapes, built in 3D: its outline is authored in BOARD PIXELS and it is laid
   out in a hold's view at a depth, so at that hold it covers exactly its board shape (like v1's frames 1–3, for any
   camera). It is extruded away from that camera (thick, in world units): flat at the hold, chunky sides and parallax
   when the camera moves. Its gradient is authored in board px too and rides with the shape. Colours are the board's.
     piece({ hold: n, shape, at: [px, py], depth, thick, grad, op, rot, s, keys, in, out, carry, drift, side, order, name })
   · shape: a THREE.Shape in px, around its anchor, y UP (the S.* helpers below, SH here; S.poly takes absolute board px).
   · depth: world distance from the hold camera along its view (bigger = further back). Typical: the sphere's depth
     (holds[n].depth) ± a few units; back-to-front order = the board's layering. thick default 0.4 world units.
   · grad: '#hex' | { cols: [a, b, c], from: [px, py], to: [px, py] } | { cols, c: [px, py], r: px } (radial), board px.
   · keys (offsets, eased keys [[t, v], [t, v, 'ease'] …]): x, y (px in the view), z (world, + = away), r (deg, in plane),
     ry / rx (deg, flip about the view's vertical / horizontal axis), s (×), op (×).
   · in / out: { type: 'fly' | 'grow' | 'slide' | 'flip' | 'fade' | 'drop', t: [a, b], from?: 'left'|'right'|'top'|'bottom', dz? }
   · carry: [{ hold: m, at: [px, py], depth, rot, s, t: [a, b], ease }]: glides (position, orientation, scale) into a
     pose in another hold's view: a shape shared by consecutive boards.
   · drift: px amplitude of the always-on subtle drift (default 3; 0 = still).
   Returns { mesh, size: [w, h] px, poseAt(t) }.  Several pieces with the same shape share geometry.
   ===================================================================== */
// a hole path from a shape's outline, without the repeated points (arc joins, closing point) that make ExtrudeGeometry notch
const holeOf = shape => { const pts = []; for (const q of shape.getPoints(64)) if (!pts.length || q.distanceToSquared(pts.at(-1)) > 1e-8) pts.push(q);
  if (pts.length > 2 && pts[0].distanceToSquared(pts.at(-1)) < 1e-8) pts.pop(); const p = new THREE.Path(); p.setFromPoints(pts.reverse()); return p; };
const SH = {
  rr: (w, h, r) => rr(w, h, r),
  ring: (ro, ri) => ring(ro, ri),
  disc: r => disc(r),
  // quarter disc with its corner (right angle) at the origin, filling quadrant q: 'tl' | 'tr' | 'bl' | 'br' (y up)
  qdisc: (r, q = 'tr') => { const a0 = { tr: 0, tl: Math.PI / 2, bl: Math.PI, br: 1.5 * Math.PI }[q]; const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(r * Math.cos(a0), r * Math.sin(a0)); s.absarc(0, 0, r, a0, a0 + Math.PI / 2, false); s.lineTo(0, 0); return s; },
  // half disc, flat side through the origin, round side toward dir: 'up' | 'down' | 'left' | 'right'
  half: (r, dir = 'up') => { const a0 = { up: 0, left: Math.PI / 2, down: Math.PI, right: -Math.PI / 2 }[dir]; const s = new THREE.Shape(); s.moveTo(r * Math.cos(a0), r * Math.sin(a0)); s.absarc(0, 0, r, a0, a0 + Math.PI, false); s.lineTo(r * Math.cos(a0), r * Math.sin(a0)); return s; },
  halfRing: (ro, ri) => halfRing(ro, ri),
  arch: (w, h, t) => arch(w, h, t),                                 // ∩ outline, base at y = 0 (rotate 180° for ∪)
  archFill: (w, h) => { const s = new THREE.Shape(), r = w / 2, cy = h - r; s.moveTo(-r, 0); s.lineTo(r, 0); s.lineTo(r, cy); s.absarc(0, cy, r, 0, Math.PI, false); s.lineTo(-r, 0); return s; },
  stadiumRing: (w, h, t) => { const o = rr(w, h, h / 2); o.holes.push(holeOf(rr(w - 2 * t, h - 2 * t, (h - 2 * t) / 2))); return o; },
  rrRing: (w, h, r, t) => { const o = rr(w, h, r); o.holes.push(holeOf(rr(w - 2 * t, h - 2 * t, Math.max(0, r - t)))); return o; },
  cornerRect: (w, h, r, corner = 'tl') => {                          // rectangle with one rounded corner
    const s = new THREE.Shape(), x0 = -w / 2, x1 = w / 2, y0 = -h / 2, y1 = h / 2, c = { tl: [x0 + r, y1 - r, 0.5, 1], tr: [x1 - r, y1 - r, 0, 0.5], bl: [x0 + r, y0 + r, 1, 1.5], br: [x1 - r, y0 + r, 1.5, 2] }[corner];
    const pts = { tl: [[x0, y0], [x1, y0], [x1, y1]], tr: [[x1, y0], [x0, y0], [x0, y1]], bl: [[x1, y1], [x0, y1]], br: [[x0, y1], [x1, y1]] }[corner];
    if (corner === 'tl') { s.moveTo(x0, y0); s.lineTo(x1, y0); s.lineTo(x1, y1); s.lineTo(x0 + r, y1); s.absarc(c[0], c[1], r, Math.PI / 2, Math.PI, false); s.lineTo(x0, y0); }
    else if (corner === 'tr') { s.moveTo(x0, y0); s.lineTo(x1, y0); s.lineTo(x1, y1 - r); s.absarc(c[0], c[1], r, 0, Math.PI / 2, false); s.lineTo(x0, y1); s.lineTo(x0, y0); }
    else if (corner === 'bl') { s.moveTo(x0 + r, y0); s.lineTo(x1, y0); s.lineTo(x1, y1); s.lineTo(x0, y1); s.lineTo(x0, y0 + r); s.absarc(c[0], c[1], r, Math.PI, 1.5 * Math.PI, false); }
    else { s.moveTo(x0, y0); s.lineTo(x1 - r, y0); s.absarc(c[0], c[1], r, 1.5 * Math.PI, 2 * Math.PI, false); s.lineTo(x1, y1); s.lineTo(x0, y1); s.lineTo(x0, y0); }
    void pts; return s;
  },
  // polygon or path from ABSOLUTE board px [[px, py], …] relative to the anchor at: y flipped (board y is down)
  poly: (pts, at) => { const s = new THREE.Shape(); pts.forEach(([x, y], i) => i ? s.lineTo(x - at[0], at[1] - y) : s.moveTo(x - at[0], at[1] - y)); return s; },
  // capsule (pill) of length L (end to end) and diameter d, horizontal; rotate with rot
  pill: (L, d) => rr(L, d, d / 2),
};
const pieces = [];
const geoCache = new Map();
function pieceMat(grad, at, op) {
  const toLocal = ([px, py]) => new THREE.Vector3(px - at[0], at[1] - py, 0);
  if (typeof grad === 'string' || Array.isArray(grad)) { const cols = Array.isArray(grad) ? grad : [grad]; return mat(cols, { local: true, viewShade: true, op, axis: [0, 1, 0], lo: -1e5, hi: 1e5 }); }
  if (grad.c) return mat(grad.cols, { local: true, viewShade: true, op, rc: toLocal(grad.c).toArray(), rad: grad.r });
  const A = toLocal(grad.from), B = toLocal(grad.to), ax = B.clone().sub(A).normalize();
  return mat(grad.cols, { local: true, viewShade: true, op, axis: ax.toArray(), lo: ax.dot(A), hi: ax.dot(B) });
}
const EZ = e => typeof e === 'function' ? e : gsap.parseEase(e || 'none');
const evk = (ks, t, dflt) => {                                       // eased keys [[t, v], [t, v, ease] …]
  if (!ks || !ks.length) return dflt;
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) if (t <= ks[i][0]) { const [t0, v0] = ks[i - 1], [t1, v1, e] = ks[i]; return v0 + (v1 - v0) * EZ(e)((t - t0) / Math.max(1e-6, t1 - t0)); }
  return ks.at(-1)[1];
};
function piece(spec) {
  const h = holds[spec.hold];
  if (!h) throw new Error(`piece: frame ${spec.hold} has no hold yet (define its hold first)`);
  const at = spec.at || [960, 540], depth = spec.depth ?? (h.depth || 30) + 2;
  const k0 = depth * h.tanV / 540;                                   // world units per board px at that depth
  const thickW = spec.thick ?? 0.4, thickPx = thickW / k0;
  const key = spec.shapeKey ? spec.shapeKey + '|' + thickPx.toFixed(3) : null;
  let geo = key && geoCache.get(key);
  if (!geo) {
    geo = thickPx > 1e-3 ? new THREE.ExtrudeGeometry(spec.shape, { depth: thickPx, bevelEnabled: false, curveSegments: 64 }) : new THREE.ShapeGeometry(spec.shape, 64);
    if (thickPx > 1e-3) geo.translate(0, 0, -thickPx);              // the front face at z = 0 faces the camera; the body goes back
    geo.computeBoundingBox(); if (key) geoCache.set(key, geo);
  }
  const bb = geo.boundingBox, size = [bb.max.x - bb.min.x, bb.max.y - bb.min.y];
  const m = pieceMat(spec.grad || '#7b2bf9', at, spec.op ?? 1);
  m.side = spec.side ?? (spec.in && spec.in.type === 'flip' || spec.out && spec.out.type === 'flip' ? THREE.DoubleSide : THREE.FrontSide);
  const mesh = new THREE.Mesh(geo, m); mesh.renderOrder = spec.order ?? 0; mesh.frustumCulled = false; scene.add(mesh);
  // poses: the home pose in its hold's view, then any carried poses
  const poseOf = (n, a, d, rot, s) => { const H = holds[n]; if (!H) throw new Error(`piece carry: frame ${n} has no hold`); const kk = d * H.tanV / 540;
    return { n, H, at: a, d, rot: rot || 0, s: s ?? 1, k: kk }; };
  const poses = [poseOf(spec.hold, at, depth, spec.rot, spec.s)];
  const carries = (spec.carry || []).map(c => { poses.push(poseOf(c.hold, c.at || at, c.depth ?? depth, c.rot ?? spec.rot, c.s ?? spec.s)); return { t: c.t, e: EZ(c.ease || 'power3.inOut') }; });
  // key tracks: custom + presets (in / out); x, y, z, r, ry, rx add; s, op multiply
  const tracks = [];
  if (spec.keys) tracks.push(spec.keys);
  const off = (edge) => { const P = poses[0], w = size[0] * P.s, hh = size[1] * P.s;
    return { left: ['x', -(P.at[0] + w / 2 + 60)], right: ['x', 1920 - P.at[0] + w / 2 + 60], top: ['y', -(P.at[1] + hh / 2 + 60)], bottom: ['y', 1080 - P.at[1] + hh / 2 + 60] }[edge]; };
  const nearest = () => { const P = poses[0]; const d = { left: P.at[0], right: 1920 - P.at[0], top: P.at[1], bottom: 1080 - P.at[1] }; return Object.keys(d).sort((a, b) => d[a] - d[b])[0]; };
  const preset = (p, dirIn) => {
    if (!p) return;
    const [a, b] = p.t, T = {};
    const E = dirIn ? (p.ease || 'expo.out') : (p.ease || 'power3.in');
    const ramp = (v0, v1) => dirIn ? [[a, v0], [b, v1, E]] : [[a, v1], [b, v0, E]];
    if (p.type === 'fly') { T.z = ramp(p.dz ?? 18, 0); T.op = dirIn ? [[a, 0], [a + 0.25 * (b - a), 1]] : [[a + 0.7 * (b - a), 1], [b, 0]]; }
    else if (p.type === 'grow') { T.s = ramp(0.001, 1); }
    else if (p.type === 'slide') { const [ch, v] = off(p.from || nearest()); T[ch] = ramp(v, 0); }
    else if (p.type === 'flip') { T.ry = ramp(p.deg ?? 90, 0); T.op = dirIn ? [[a, 0], [a + 0.05, 1]] : [[b - 0.05, 1], [b, 0]]; }
    else if (p.type === 'drop') { T.y = ramp(-(p.dy ?? 700), 0); }
    else if (p.type === 'fade') { T.op = ramp(0, 1); }
    tracks.push(T);
    return dirIn ? a : b;
  };
  const tIn = preset(spec.in, true), tOut = preset(spec.out, false);
  const drift = spec.drift ?? 3, ph = rnd(pieces.length + 11) * 6.28, per = 6 + rnd(pieces.length + 29) * 4;
  const q0 = new THREE.Quaternion(), qa = new THREE.Quaternion(), qb = new THREE.Quaternion(), qr = new THREE.Quaternion(), Z = new THREE.Vector3(0, 0, 1), Yv = new THREE.Vector3(0, 1, 0), Xv = new THREE.Vector3(1, 0, 0);
  const worldOf = (P, dx, dy, dz, r, s) => ({ p: P.H.at(P.at[0] + dx, P.at[1] + dy, P.d).addScaledVector(P.H.fwd, dz), q: P.H.q.clone().multiply(qr.setFromAxisAngle(Z, (P.rot + r) * Math.PI / 180)), sc: P.k * P.s * s });
  const o = { mesh, size, spec, name: spec.name, visible: true };
  o.poseAt = t => {
    let x = 0, y = 0, z = 0, r = 0, ry = 0, rx = 0, s = 1, op = 1;
    for (const T of tracks) { x += evk(T.x, t, 0); y += evk(T.y, t, 0); z += evk(T.z, t, 0); r += evk(T.r, t, 0); ry += evk(T.ry, t, 0); rx += evk(T.rx, t, 0); s *= evk(T.s, t, 1); op *= evk(T.op, t, 1); }
    if (tIn !== undefined && t < tIn) op = 0;
    if (tOut !== undefined && t > tOut) op = 0;
    x += drift * Math.sin(t / per * 6.2832 + ph); y += drift * Math.cos(t / (per * 1.3) * 6.2832 + ph);
    // which pose segment
    let W = worldOf(poses[0], x, y, z, r, s);
    for (let i = 0; i < carries.length; i++) {
      const [a, b] = carries[i].t;
      if (t <= a) break;
      const B = worldOf(poses[i + 1], x, y, z, r, s);
      if (t >= b) { W = B; continue; }
      const u = carries[i].e((t - a) / (b - a));
      W = { p: W.p.clone().lerp(B.p, u), q: W.q.clone().slerp(B.q, u), sc: W.sc + (B.sc - W.sc) * u };
    }
    if (ry) W.q.multiply(qa.setFromAxisAngle(Yv, ry * Math.PI / 180));
    if (rx) W.q.multiply(qb.setFromAxisAngle(Xv, rx * Math.PI / 180));
    return { ...W, op };
  };
  o.update = t => {
    const P = o.poseAt(t);
    mesh.visible = o.visible && P.op > 0.002 && P.sc > 1e-6;
    if (!mesh.visible) return;
    mesh.position.copy(P.p); mesh.quaternion.copy(P.q); mesh.scale.setScalar(Math.max(1e-6, P.sc));
    const u = m.uniforms.op; u.value = (spec.op ?? 1) * P.op; m.transparent = u.value < 0.999; m.depthWrite = u.value >= 0.999 || !!spec.depthWrite;
  };
  pieces.push(o);
  return o;
}
anims.push(t => { for (const o of pieces) o.update(t); });


/* =====================================================================
   COPY LAYER · the supers, text boxes and pictures as real HTML placed in the 3D scene: a small CSS3D renderer driven by the
   WebGL camera, so copy and sets share one camera (user: text "floating in 3D space … when you move the camera, we actually
   see that dimension"). Crisp brand type; drawn over the sets (the sphere passes in front only as a special transition).
   Authored like v1: stage px (1920 × 1080) and GSAP tweens on V.copyTL (a paused timeline seeked to the authored time
   every render, like v1's master timeline).
     V.copy(n, { depth, html | build(el), cls }) → a full-stage card laid out in hold n's view at `depth` (world units from
       that hold camera; default a little in front of the sphere): at the hold its contents sit exactly on their stage px;
       when the camera moves they show perspective and parallax.
     V.copyLayer(n, el, { at: [px, py], depth }) → one element (a line, a box) as its own layer at its own depth, centred on
       board px `at` (el needs a width and height): "lines in layers", used sparingly.
   Both return { el, dz, show(t0, t1) }: tween .dz (world units, + = away from the hold camera) for a push / pull in depth
   (copyTL.fromTo(layer, { dz: 6 }, { dz: 0, … }, t)); show() limits when it exists. Children get the classes .txt (text),
   .box (holding shapes, cards, glass) or .img (pictures) for the player's Layers switches.
   The words and pictures come from content/copy.json (V.content, loaded above): each copy file asks copy/content.js for
   them (contentFor(V, n): .spec / .line / .num / .pic, with today's values as the defaults), so the user can change the
   copy without touching code, and an edited line is auto-fitted (content.js's header). New copy must do the same.
   ===================================================================== */
const cssView = document.getElementById('css3d'), cssCam = document.getElementById('cssCam');
const KCSS = 100;                                                    // CSS px per world unit (keeps each layer's scale near 1: crisp text)
export const copyTL = gsap.timeline({ paused: true });
const copyObjs = [];
function copyPlace(n, el, at, depth) {
  const H = holds[n]; if (!H) throw new Error(`copy: frame ${n} has no hold`);
  el.classList.add('c3'); cssCam.appendChild(el);
  const o = { el, n, H, at, depth, k: depth * H.tanV / 540, dz: 0, t0: -Infinity, t1: Infinity };
  o.show = (a, b) => { o.t0 = a; o.t1 = b; return o; };
  copyObjs.push(o); return o;
}
function copy(n, spec = {}) {
  const el = document.createElement('div'); el.className = 'copycard' + (spec.cls ? ' ' + spec.cls : '');
  if (spec.html) el.innerHTML = spec.html;
  if (spec.build) spec.build(el);
  const H = holds[n]; if (!H) throw new Error(`copy: frame ${n} has no hold`);
  return copyPlace(n, el, [960, 540], spec.depth ?? Math.max(4, (H.depth || 30) - 3));
}
const copyLayer = (n, el, spec) => copyPlace(n, el, spec.at, spec.depth ?? Math.max(4, (holds[n].depth || 30) - 3));
const mCSS = new THREE.Matrix4(), sCSS = new THREE.Vector3(), vCSS = new THREE.Vector3();
const ep = v => (Math.abs(v) < 1e-10 ? 0 : v).toFixed(10);
function renderCopy(t) {
  copyTL.time(Math.max(0, t), true);
  const fov = camera.projectionMatrix.elements[5] * 540;
  cssView.style.perspective = fov + 'px';
  const e = camera.matrixWorldInverse.elements;
  cssCam.style.transform = `translateZ(${fov}px)matrix3d(${ep(e[0])},${ep(-e[1])},${ep(e[2])},${ep(e[3])},${ep(e[4])},${ep(-e[5])},${ep(e[6])},${ep(e[7])},${ep(e[8])},${ep(-e[9])},${ep(e[10])},${ep(e[11])},${ep(KCSS * e[12])},${ep(-KCSS * e[13])},${ep(KCSS * e[14])},${ep(e[15])})translate(960px,540px)`;
  for (const o of copyObjs) {
    const P = o.H.at(o.at[0], o.at[1], o.depth).addScaledVector(o.H.fwd, o.dz);
    const zc = vCSS.copy(P).applyMatrix4(camera.matrixWorldInverse).z;
    if (t < o.t0 || t > o.t1 || zc > -0.5) { if (o.el.style.display !== 'none') o.el.style.display = 'none'; continue; }   // not yet / no longer / behind the camera
    if (o.el.style.display === 'none') o.el.style.display = '';
    mCSS.compose(P, o.H.q, sCSS.setScalar(o.k));
    const m = mCSS.elements.map((v, i) => (i % 4 === 3 ? v : v * KCSS));
    o.el.style.transform = `translate(-50%,-50%)matrix3d(${ep(m[0])},${ep(m[1])},${ep(m[2])},${ep(m[3])},${ep(-m[4])},${ep(-m[5])},${ep(-m[6])},${ep(-m[7])},${ep(m[8])},${ep(m[9])},${ep(m[10])},${ep(m[11])},${ep(m[12])},${ep(m[13])},${ep(m[14])},${ep(m[15])})`;
  }
}

export const API = { THREE, R, END, FR, BOARD, CUTS, win, frameAt, hold, holds, key, wipe, dip, note, bgKey, anim, region, seg, runSegs, easeV, easeH, line, curve, airArc, fallArc, V3, surfN,
  mat, add, rr, ring, disc, arch, halfRing, ext, scene, piece, S: SH, evk, waitFor, camAt: t => camAt(t), unplate, copy, copyLayer, copyTL, markAt: n => holds[n] && holds[n].mark && holds[n].mark.clone(),
  content: CONTENT };

/* default choreography for a group nobody has designed yet: frontal holds side by side, straight runs between marks */
API.auto = (g, frames = GROUP_FRAMES[g]) => {
  const O = region(g);
  frames.forEach((n, i) => {
    const [w0, w1] = win(n), H = Math.min(2.2, Math.max(1.2, 0.35 * (w1 - w0))), t1 = w1 - 0.6, t0 = Math.max(t1 - H, CUTS[g] + 0.3, w0);
    const h = hold(n, { t: [t0, t1], mark: O.clone().add(new THREE.Vector3(i * 70, 0, 0)), dir: [0, 0, -1], fov: 28 });
    const m = h.mark || h.aim;
    if (i === 0) seg(CUTS[g], h.tk, 'none', line(m.clone().add(new THREE.Vector3(-20, 0, 0)), m));
    else { const p = holds[frames[i - 1]]; seg(p.tk, h.tk, 'none', line(p.mark || p.aim, m)); }
  });
  const last = holds[frames.at(-1)], next = Object.values(CUTS).find(t => t > CUTS[g]) ?? END + 0.3;
  const lm = last.mark || last.aim;
  seg(last.tk, next, 'none', line(lm, lm.clone().add(new THREE.Vector3(20, 0, 0))));
  note(CUTS[g], next, `${g}: placeholder layout (not designed yet)`);
};

/* ---------------- groups ---------------- */
// Loaded one by one (dynamic import), so a file that doesn't parse (someone mid-edit) only loses its own group, or the
// copy layer, instead of the whole page. Its error lands in groupErrors (check.mjs prints them).
const groupErrors = [];
const load = (name, path) => import(path).then(m => m.default, e => { console.error(name, e); groupErrors.push(`${name}: ${e.message}`); return null; });
const groupMods = await Promise.all(['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7'].map(async n => [n, await load(n, `./groups/g${n[1]}.js`)]));
for (const [name, fn] of groupMods) {
  if (!fn) continue;
  try { fn({ ...API, O: region(name), o: (x, y, z) => region(name).add(new THREE.Vector3(x, y, z)), group: name, frames: GROUP_FRAMES[name], start: CUTS[name] }); }
  catch (e) { console.error(name, e); groupErrors.push(`${name}: ${e.message}`); }
}

/* plates with no explicit exit cross-fade into the next board during the move (carry), or vanish at a cut (hidden by the
   wipe / dark), so the screen is never an empty purple between holds */
{
  const order = FR.map(f => f[0]);
  for (const P of plates) if (!P.out) {
    const nx = plates.filter(Q => order.indexOf(Q.n) > order.indexOf(P.n)).sort((a, b) => order.indexOf(a.n) - order.indexOf(b.n))[0];
    const h = holds[P.n], cut = cutTimes.find(c => c > h.t1 && (!nx || c <= nx.in[1]));
    P.out = cut !== undefined ? [cut - 0.02, cut] : nx ? [nx.in[0], nx.in[1] + 0.25] : [END + 1, END + 2];
  }
}

/* ---------------- the copy layer's per-frame files (after the groups: they need the holds) ---------------- */
// copy/index.js lists the file names (every one exists, a stub until its copy is written); each loads on its own
const copyMods = (await Promise.all(((await load('copy', './copy/index.js')) || []).map(async n => [n, await load(n, `./copy/${n}.js`)]))).filter(([, fn]) => fn);
for (const [name, fn] of copyMods) { try { fn(API); } catch (e) { console.error(name, e); groupErrors.push(`${name}: ${e.message}`); } }

/* ---------------- sphere table ----------------
   The roll: the segs sampled at 240 Hz; in contact the sphere rolls without slipping, in the air it keeps its last spin.
   THE FACE AT THE KEYS (polish backlog: "the sphere's surface orientation at the keys doesn't show the board sphere's
   white-orange face"). The boards paint one sphere: white on top, orange on the left, blue-violet lower right, pink
   between (its colour ring seen nearly pole-on; boards 6, 14 and 17 paint it turned). The plain roll brought round
   whatever face it happened to (violet, mostly). So at each board's key instant the drawn sphere now shows the board's
   face, still a plain glossy sphere with the same shader and light; only which way it faces changes:
   · FACE_Q is that face as an orientation in the view (the ring's frame → the view, as if seen straight on; each key
     turns it for where the sphere sits in the lens). It was fitted to the boards by simulating this shader (the fit
     agreed within 2–5° on 22 boards; 6, 14 and 17 have their own).
   · Up to FACE_TOL (10°, which keeps ~97% of the match) is given back toward what the roll brings, so a small difference
     isn't turned at all (G1's floating sphere keeps its orientation through 1 → 2 → 3).
   · Between two keys the difference is made up by an extra turn on the sphere's own body, spread over the angle it
     rolls (eased in and out, so there is none at the keys, where it rolls exactly): ≤ ~10% of the roll on most
     stretches, ~20% on the shortest. Where a wipe or dip hides a cut between the keys, it turns there instead, unseen.
     Where it doesn't roll at all (floating), it turns slowly with time.
   · THE FILLS (FACE_PINS). Where the sphere fills the whole frame, it shows exactly the colours of the approved piece
     (tonight's merged state, before the polish pass, which had no face turn): G4's 18 → 19 fill (82.55–84.3, g4.js's
     own fill window: lilac/violet) and G6's frame-filling moment (139.0 → the 139.35 cut) on through G7's pull-back and
     the end card (violet). Reviews: the fill had changed colour, "Nobody asked for that, and it is not closer to any
     board"; the final review found both fills still changed (83: pink/magenta; 139: orange). Easing back to the plain
     roll wasn't enough: the roll is built up across the whole piece, so a route change upstream (G6's new entry, G2's
     41.4 trim) turns it (144.7° at 139.0 tonight). So each fill is pinned to that piece's own orientation at its start
     (read from its sphere table), taken on through the fill by the route itself: S[i].q = qr[i] · qr[i0]⁻¹ · pinned. It
     reproduces the approved fill exactly whatever changes upstream, as long as the route from the fill's start on is
     the same. The turn eases in and out of each fill like a key: key 18 → 82.55 turns 98° over 27 rad of roll (≤ 10%),
     84.3 → key 19 81° over 11 rad (13%, ~20% at its peak), key 30 → 139.0 128° over 14 rad (16%, ~24% at its peak,
     mid-way, where the sphere is small). Before the first key: a constant offset.
   · It is computed once, on the first ballAt (after everything is built), from the camera as built (no frame edits or
     moments) and from what is actually drawn at each key (pose + the groups' anims: G1's tilt and G4's fill turn the
     drawn sphere, and both keep a body-frame turn intact), so it follows any change of route or camera. That first
     ballAt is the first render's, or, when frames/moments.json has a camera moment, applyMoments' at load (above the
     render section), so everything pose() touches must already be declared then: `look` lives here for that reason
     (it was declared in the render section, and a moment at load made the face turn fail back to the plain roll).
   S[i].qr keeps the plain roll (S[i].q = qr × the face turn). */
const look = new THREE.Vector3();                                  // pose()'s look target (declared here: see just above)
segs.sort((a, b) => a.t0 - b.t0);
const DT = 1 / 240, N = Math.ceil((END + 0.3) / DT) + 1;
const S = [];
{
  let q = new THREE.Quaternion(), axis = new THREE.Vector3(0, 0, -1), rate = 0, prev = null;
  for (let i = 0; i < N; i++) {
    const t = i * DT;
    let sg = segs.find(s => t <= s.t1) || segs.at(-1);
    const u = sg.e(Math.min(1, Math.max(0, (t - sg.t0) / (sg.t1 - sg.t0))));
    const r = sg.fn(u);
    const n = r.n ? r.n : r.tan ? surfN(r.tan) : up.clone();
    if (prev) {
      const d = r.p.clone().sub(prev);
      if (r.c > 0.5 && d.lengthSq() > 1e-10 && d.lengthSq() < 4) {
        // moving along the contact normal (a drop in contact) has no rolling axis: keep the last one. A zero axis gave a
        // non-unit quaternion, which three.js draws as a squashed sphere (up to 11% from ~60 s on, found in G7's review)
        const ax = new THREE.Vector3().crossVectors(n, d);
        if (ax.lengthSq() > 1e-14) { axis = ax.normalize(); rate = d.length() / R; }
      }
      q = new THREE.Quaternion().setFromAxisAngle(axis, rate).multiply(q).normalize();
    }
    prev = r.p.clone();
    S.push({ p: r.p, c: r.c, n, q: q.clone(), h: r.h || 0, sc: r.sc ?? 1 });
  }
}
// the board's face (the ring's frame → the view, seen straight on), fitted to the boards; [x, y, z, w]
const FACE_Q = { all: [0.61662, -0.10554, -0.26523, 0.73368], 6: [0.35084, -0.57552, -0.67767, 0.29403], 14: [-0.3172, -0.5973, 0.73023, 0.0969], 17: [-0.6902, -0.26033, 0.37272, 0.56298] };
const FACE_TOL = 10 * Math.PI / 180;
// the fills, as built: [from, to (s), the sphere table's orientation at `from` in the approved piece (tonight's merged
// state, before the polish pass: it had no face turn); [x, y, z, w]]. See "THE FILLS" above.
const FACE_PINS = [
  [82.55, 84.3, [-0.9435958754835784, -0.2329962438044108, -0.23426831204382514, 0.021399348484286016]],   // G4's fill, 18 → 19 (g4.js's W0–W1)
  [139.0, Infinity, [0.4056998194451573, -0.42233848618059744, -0.7329001478821725, -0.3462589101050511]]]   // G6's fill, the 139.35 cut, G7
let faceState = 0;                                               // 0 = not yet, 1 = computing, 2 = done
function faceKeys() {
  faceState = 1;
  const Qt = THREE.Quaternion, V3t = THREE.Vector3, ang = (a, b) => 2 * Math.acos(Math.min(1, Math.abs(a.dot(b))));
  const ks = [];
  for (const n of Object.keys(holds).map(Number).sort((a, b) => a - b)) {
    const h = holds[n], i = Math.round(h.tk / DT), s = S[i];
    if (!BOARD[n] || !s || s.h || s.sc < 0.05) continue;
    const v = camAt(h.tk); if (!v) continue;
    const b = pose(h.tk);                                          // what is drawn there with the plain roll (ballAt gives it now)
    for (const f of anims) f(h.tk, b);
    const drawn = ball.quaternion.clone().normalize();
    const pos = new V3t(v[0], v[1], v[2]).addScaledVector(b.p, v[8]), lk = new V3t(v[3], v[4], v[5]).addScaledVector(b.p, v[8]).lerp(b.p, v[6]);
    const Bs = basisOf(pos, lk, v[9]), d = b.p.clone().sub(pos), z = d.dot(Bs.fwd), tv = Math.tan(v[7] * Math.PI / 360);
    if (!(z > 0) || Math.abs(d.dot(Bs.upv)) > 1.1 * tv * z || Math.abs(d.dot(Bs.right)) > 1.1 * tv * 16 / 9 * z) continue;   // off screen
    const toCam = new V3t(-d.dot(Bs.right), -d.dot(Bs.upv), z).normalize();
    const W = Bs.q.clone().multiply(new Qt().setFromUnitVectors(new V3t(0, 0, 1), toCam)).multiply(new Qt(...(FACE_Q[n] || FACE_Q.all)));
    ks.push({ i, t: h.tk, G: drawn.invert().multiply(W).normalize() });
  }
  ks.sort((a, b) => a.i - b.i);
  if (!ks.length) return;
  // cuts hidden by a wipe or a dip: the turn between two keys on either side is made there (not 139.35: the sphere is the frame)
  const hidden = cutTimes.filter(c => wipes.some(w => c >= w.t0 && c <= w.t0 + w.dur) || dips.some(dd => Math.abs(c - dd.t) <= 0.3 * dd.dur));
  for (let j = 1; j < ks.length; j++) {
    const a = ks[j - 1], b = ks[j];
    b.cut = hidden.find(c => c > a.t && c <= b.t);
    if (b.cut !== undefined) continue;
    const x = ang(a.G, b.G);
    if (x <= FACE_TOL) b.G.copy(a.G); else b.G.slerp(a.G, FACE_TOL / x);
  }
  for (const s of S) s.qr = s.q.clone();
  const set = (i, G) => S[i].q.copy(S[i].qr).multiply(G).normalize(), G = new Qt(), EPS = 0.02 * DT;
  // the angle rolled per step, averaged over 0.2 s (so the extra turn eases through a landing or a one-step kink in the
  // route instead of copying it), plus a hair of time (so a floating sphere turns slowly with time)
  const P = [0]; for (let i = 1; i < N; i++) P.push(P[i - 1] + ang(S[i - 1].qr, S[i].qr));
  const HW = 24, rolled = i => (P[Math.min(N - 1, i + HW)] - P[Math.max(0, i - HW)]) / (Math.min(N - 1, i + HW) - Math.max(0, i - HW)) + EPS;
  // the fills (FACE_PINS) join the keys as two fixed nodes each, turn Gp = qr[i0]⁻¹ · the orientation as built: then
  // S[i].q = qr[i] · Gp is exactly the approved piece's from i0 on (the route from there is the same), whatever the roll
  // brought upstream. A key inside a fill gives way to it (none does).
  let nodes = ks;
  for (const [t0, t1, q] of FACE_PINS) {
    const i0 = Math.round(t0 / DT), i1 = Math.min(N - 1, Math.round(t1 / DT));
    if (i0 >= N - 1 || i1 <= i0) continue;
    const Gp = S[i0].qr.clone().invert().multiply(new Qt(...q).normalize()).normalize();
    nodes = nodes.filter(k => k.i < i0 || k.i > i1).concat([{ i: i0, t: i0 * DT, G: Gp }, { i: i1, t: i1 * DT, G: Gp }]);
  }
  nodes.sort((a, b) => a.i - b.i);
  for (let i = 0; i <= nodes[0].i; i++) set(i, nodes[0].G);
  for (let j = 0; j + 1 < nodes.length; j++) {
    const a = nodes[j], b = nodes[j + 1], cut = hidden.find(c => c > a.t && c <= b.t);
    if (cut !== undefined) { const ic = Math.round(cut / DT); for (let i = a.i + 1; i <= b.i; i++) set(i, i < ic ? a.G : b.G); continue; }
    const w = [0];
    for (let i = a.i + 1; i <= b.i; i++) w.push(w.at(-1) + rolled(i));
    for (let i = a.i + 1; i <= b.i; i++) { const x = w[i - a.i] / w.at(-1); set(i, G.copy(a.G).slerp(b.G, x * x * (3 - 2 * x))); }
  }
  for (let i = nodes.at(-1).i + 1; i < N; i++) set(i, nodes.at(-1).G);   // after the last node (with no fill pinned to the end): kept
}
function ballAt(t) {
  if (faceState === 0) { try { faceKeys(); } catch (e) {          // (on a failure: the plain roll, and check.mjs says why)
    for (const s of S) if (s.qr) s.q.copy(s.qr);
    groupErrors.push(`sphere face at the keys: ${e.message}`); } faceState = 2; }
  const f = Math.min(N - 1.001, Math.max(0, t / DT)), i = Math.floor(f), k = f - i;
  const a = S[i], b = S[i + 1];
  if (a.p.distanceToSquared(b.p) > 4) { const s = k < 0.5 ? a : b; return { p: s.p.clone(), c: s.c, n: s.n.clone(), q: s.q.clone(), h: s.h, sc: s.sc }; }
  return { p: a.p.clone().lerp(b.p, k), c: a.c + (b.c - a.c) * k, n: a.n.clone().lerp(b.n, k).normalize(), q: a.q.clone().slerp(b.q, k), h: a.h, sc: a.sc + (b.sc - a.sc) * k };
}

/* ---------------- camera: shots split at the cuts; Hermite through keys; holds pinned ---------------- */
keys.sort((a, b) => a.t - b.t);
const shotBounds = [0, ...cutTimes, Infinity];
const shots = shotBounds.slice(0, -1).map((a, i) => {
  const b = shotBounds[i + 1], K = keys.filter(k => k.t >= a - 1e-6 && k.t < b - 1e-6);
  const T = K.map((k, j) => (j === 0 || j === K.length - 1 || k.still || k.e || K[j + 1].e) ? k.v.map(() => 0)
    : k.v.map((_, m) => (K[j + 1].v[m] - K[j - 1].v[m]) / (K[j + 1].t - K[j - 1].t)));
  return { a, b, K, T };
});
function camAt(t) {
  const sh = shots.find(s => t < s.b) || shots.at(-1), { K, T } = sh;
  if (!K.length) return null;
  if (K.length === 1 || t <= K[0].t) return K[0].v;
  let i = K.findIndex((k, j) => j < K.length - 1 && t <= K[j + 1].t);
  if (i < 0) return K.at(-1).v;
  const a = K[i], b = K[i + 1], h = b.t - a.t, u = Math.min(1, Math.max(0, (t - a.t) / h));
  if (b.e) { const e = b.e(u); return a.v.map((v, j) => v + (b.v[j] - v) * e); }
  const u2 = u * u, u3 = u2 * u, h00 = 2 * u3 - 3 * u2 + 1, h10 = u3 - 2 * u2 + u, h01 = -2 * u3 + 3 * u2, h11 = u3 - u2;
  return a.v.map((_, j) => h00 * a.v[j] + h10 * h * T[i][j] + h01 * b.v[j] + h11 * h * T[i + 1][j]);
}

/* ---------------- per-frame edits: time warp, sphere speed / nudge, camera framing ---------------- */
function pchip(xs, ys) {                                            // smooth monotone interpolation (Fritsch–Carlson)
  const n = xs.length, h = [], d = [], m = new Array(n);
  for (let i = 0; i < n - 1; i++) { h[i] = xs[i + 1] - xs[i]; d[i] = (ys[i + 1] - ys[i]) / h[i]; }
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) { if (d[i - 1] * d[i] <= 0) m[i] = 0; else { const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1]; m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]); } }
  return x => {
    if (x <= xs[0]) return ys[0] + (x - xs[0]) * m[0];
    if (x >= xs[n - 1]) return ys[n - 1] + (x - xs[n - 1]) * m[n - 1];
    let lo = 0, hi = n - 1; while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (xs[mid] <= x) lo = mid; else hi = mid; }
    const t = (x - xs[lo]) / h[lo], t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[lo] + (t3 - 2 * t2 + t) * h[lo] * m[lo] + (-2 * t3 + 3 * t2) * ys[lo + 1] + (t3 - t2) * h[lo] * m[lo + 1];
  };
}
const Ed = n => EDITS[n] || {};
const holdOrder = FR.map(f => f[0]).filter(n => holds[n]);
const ss = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
const bump = (t, a, b, c, d) => t <= a || t >= d ? 0 : t < b ? ss((t - a) / Math.max(1e-6, b - a)) : t <= c ? 1 : 1 - ss((t - c) / Math.max(1e-6, d - c));
const nb = n => { const i = holdOrder.indexOf(n); return [holds[holdOrder[i - 1]], holds[holdOrder[i + 1]]]; };
// an edit stays inside its own shot: it eases in from the hidden cut before its frame and out by the cut after it, never
// past them. (Reaching across a cut swung the other group's camera around this frame's pivot, 3000 units away, shifted
// and warped its sphere, and left this frame's sphere in the old region for a moment after the cut.)
const shotAround = t => [Math.max(-1, ...cutTimes.filter(c => c <= t)), Math.min(END + 1, ...cutTimes.filter(c => c > t))];
let mapA, mapD, EDITED = [];
function applyEdits() {                                             // (re)builds the time map and the edit list from EDITS
  const knots = [[0, 0]];
  for (const n of holdOrder) { const h = holds[n], tm = Ed(n).timing || {};
    if (h.pass) { const d = ((+tm.holdStart || 0) + (+tm.holdEnd || 0)) / 2; knots.push([h.t0 + d, h.t0], [h.t1 + d, h.t1]); }   // a drift-through has no still span to lengthen: its timing edit moves the moment (no slow motion)
    else knots.push([h.t0 + (+tm.holdStart || 0), h.t0], [h.t1 + (+tm.holdEnd || 0), h.t1]); }
  if (knots.at(-1)[1] < END - 1e-6) knots.push([END, END]);   // a hold that ends at END is the end knot itself (a second one collided and broke the map)
  for (let i = 1; i < knots.length; i++) if (knots[i][0] < knots[i - 1][0] + 0.05) knots[i][0] = knots[i - 1][0] + 0.05;   // an edit can't pass a neighbour
  mapA = pchip(knots.map(k => k[0]), knots.map(k => k[1]));
  mapD = pchip(knots.map(k => k[1]), knots.map(k => k[0]));
  EDITED = holdOrder.filter(n => { const e = Ed(n); return e.timing || e.camera || e.sphere; }).map(n => {
    const h = holds[n], [pv, nx] = nb(n), e = Ed(n), cm = e.camera || {}, sp = e.sphere || {}, [sa, sb] = shotAround(h.tk);
    const piv = (h.mark || h.aim).clone(), k = Math.min(1.5, Math.max(0.6, +sp.speed || 1));
    const pxs = (h.depth || h.aim.distanceTo(h.pos)) * h.tanV / 540, nd = sp.nudge || [0, 0, 0];
    const nudge = h.right.clone().multiplyScalar((+nd[0] || 0) * pxs).addScaledVector(h.upv, -(+nd[1] || 0) * pxs).addScaledVector(h.fwd, +nd[2] || 0);
    const cam = ['orbit', 'tilt', 'push', 'panX', 'panY', 'lens', 'roll'].some(q => +cm[q]) ? cm : null;
    return { n, h, piv, k, nudge, hasNudge: nudge.lengthSq() > 1e-9, cam,
      wS: t => bump(t, Math.max(pv ? pv.tk : -1, sa), h.tk, h.tk, Math.min(nx ? nx.tk : END + 1, sb)),   // sphere speed: peaks at the key instant
      wN: t => bump(t, Math.max(pv ? pv.tk : -1, sa), h.t0, h.t1, Math.min(nx ? nx.tk : END + 1, sb)),   // sphere nudge: full through the hold
      wC: t => bump(t, Math.max(pv ? pv.t1 : -1, sa), h.t0, h.t1, Math.min(nx ? nx.t0 : END + 1, sb)) }; // camera: full through the hold, none at the neighbours' holds
  });
}
applyEdits();
export const toAuthored = T => mapA(T);
export const toDisplay = t => mapD(t);
export const holdDisplay = n => { const h = holds[n]; return h && { t0: toDisplay(h.t0), t1: toDisplay(h.t1), tk: toDisplay(h.tk) }; };
// the player's Edit mode previews a frame's adjustments live, before they're saved (tools/serve.mjs writes the file):
// e is the file's object (as frames/fNN.json), or null for none. The next render shows it.
export function setEdit(n, e) { if (e) EDITS[n] = e; else delete EDITS[n]; applyEdits(); applyMoments(); }   // (a timing or sphere edit moves the moments' clock and pivots)
const sphereT = t => { let ts = t; for (const E of EDITED) if (E.k !== 1) ts += E.wS(t) * (E.k - 1) * (t - E.h.tk); return ts; };
const qA = new THREE.Quaternion(), qB = new THREE.Quaternion();
// one camera adjustment cm at weight c, around the pivot P (the per-frame edits and the moments share it): orbit (about
// world up) and tilt (about the view's right) swing the camera round P, push moves it that fraction of the way to P, pan
// shifts the view by board px at P's distance, lens and roll add to the fov and the roll
function camAdjust(C, L, fr, c, cm, P) {
  const fwd = L.clone().sub(C).normalize(), right = fwd.clone().cross(up).normalize(), upv = right.clone().cross(fwd);
  qA.setFromAxisAngle(up, c * (+cm.orbit || 0) * Math.PI / 180); qB.setFromAxisAngle(right, c * (+cm.tilt || 0) * Math.PI / 180); qA.multiply(qB);
  C.sub(P).applyQuaternion(qA).add(P); L.sub(P).applyQuaternion(qA).add(P);
  if (+cm.push) { const d = P.clone().sub(C).multiplyScalar(c * cm.push); C.add(d); L.add(d); }
  const pxs = C.distanceTo(P) * Math.tan(fr[0] * Math.PI / 360) / 540, pan = right.multiplyScalar(c * (+cm.panX || 0) * pxs).addScaledVector(upv, -c * (+cm.panY || 0) * pxs);
  C.add(pan); L.add(pan);
  fr[0] += c * (+cm.lens || 0); fr[1] += c * (+cm.roll || 0);
}
function editCamera(t, C, L, fr, moments = true) {                   // C, L: camera position / look target (modified in place); fr: [fov, roll]
  for (const E of EDITED) {
    if (!E.cam) continue;
    const c = E.wC(t); if (c <= 0) continue;
    camAdjust(C, L, fr, c, E.cam, E.piv);
  }
  if (moments) for (const M of MOM) {                                // the camera moments, on top of the frame edits
    const c = momentW(t, M); if (c <= 0) continue;
    camAdjust(C, L, fr, c, M.camera, M.piv);
  }
}

/* ---------------- camera moments (frames/moments.json, loaded at the top) ----------------
   A moment is full at its time and eases in and out over ± its width (a smoothstep bump, in display seconds, mapped to the
   authored clock like everything else, so a timing edit keeps it at its display time). The bump is the quintic smoothstep
   (6x⁵ − 15x⁴ + 10x³): the cubic one keeps the speed smooth but jumps the acceleration where a blend starts and ends,
   which camprobe shows as a jolt (40–90 u/s² spikes on a 15° orbit over ± 0.6 s); this one has none.
   It pivots on the sphere as it is at that moment (where it's drawn, nudges included), so orbit, tilt and push behave as
   they do at a keyframe; when the sphere isn't in view then (hidden, behind the camera or off screen), on the centre of the
   view at the sphere's depth.
   The cut guard: a moment whose blend reaches a hidden cut, or the gradient wipe or dark dip that hides one, is left out
   (moving the camera there shows the join; the player refuses to add one) and noted in groupErrors ("moments: …"); one
   whose blend overlaps a board's key moment is used, with a warning (that board no longer matches exactly). */
const CAM_KEYS = ['orbit', 'tilt', 'push', 'panX', 'panY', 'lens', 'roll'];
// the same limits as the per-frame camera edits (tools/serve.mjs normFrame, index.html LIM): keep them identical
const CAM_LIM = { orbit: [-90, 90], tilt: [-60, 60], push: [-2, 0.9], panX: [-960, 960], panY: [-540, 540], lens: [-20, 30], roll: [-45, 45] };
const MW = { min: 0.3, max: 2, dflt: 0.6 };                           // the blend's half-width (s)
const clampW = w => { const x = +w; return Number.isFinite(x) && w !== null && w !== '' ? Math.min(MW.max, Math.max(MW.min, x)) : MW.dflt; };
let MREV = 0;                                                        // (bumped whenever the moments in use, or the frame edits under them, change: camBase's callers cache by it)
let MOM = [];                                                        // in use, with a camera change: { a, c, b (authored), piv, camera }
let MREP = { file: null, error: null, all: [], used: [], ignored: [], warnings: [] };
// a list as the file has it → every moment normalised (numbers clamped to the limits, a default width, unique ids), plus the
// entries that can't be used at all (not a moment, or no time inside the piece)
function normMoments(list) {
  const all = [], bad = [], ids = new Set();
  (Array.isArray(list) ? list : []).forEach((m, i) => {
    let id = m && typeof m === 'object' && (typeof m.id === 'string' || typeof m.id === 'number') && String(m.id).trim() ? String(m.id).trim().slice(0, 40) : `m${i + 1}`;
    if (ids.has(id)) { let k = 2; while (ids.has(`${id}-${k}`)) k++; id = `${id}-${k}`; }
    ids.add(id);
    if (!m || typeof m !== 'object' || Array.isArray(m)) { bad.push({ id, t: null, reason: `entry ${i + 1} isn't a moment ({ "t": seconds, "width": …, "camera": { … } })` }); return; }
    const t = m.t === null || m.t === '' || typeof m.t === 'boolean' ? NaN : +m.t;
    if (!Number.isFinite(t)) { bad.push({ id, t: null, reason: 'its time ("t") isn\'t a number of seconds' }); return; }
    if (t < 0 || t > END) { bad.push({ id, t, reason: `its time (${t} s) is outside the piece (0–${END} s)` }); return; }
    const cm = m.camera && typeof m.camera === 'object' ? m.camera : {}, camera = {};
    for (const k of CAM_KEYS) { const v = cm[k] === null || cm[k] === '' || typeof cm[k] === 'boolean' ? NaN : +cm[k]; camera[k] = Number.isFinite(v) ? Math.min(CAM_LIM[k][1], Math.max(CAM_LIM[k][0], v)) : 0; }
    all.push({ id, t, width: clampW(m.width), camera, note: typeof m.note === 'string' ? m.note.slice(0, 500) : '' });
  });
  all.sort((a, b) => a.t - b.t);
  return { all, bad };
}
const ss5 = x => { x = Math.min(1, Math.max(0, x)); return x * x * x * (x * (x * 6 - 15) + 10); };
const momentW = (t, M) => t <= M.a || t >= M.b ? 0 : t < M.c ? ss5((t - M.a) / Math.max(1e-6, M.c - M.a)) : 1 - ss5((t - M.c) / Math.max(1e-6, M.b - M.c));
const f2 = x => x.toFixed(2);
// the places a camera change would show a join between two parts of the piece, in display seconds (authored: in authored
// seconds, as tools/serve.mjs's SEAMS has them): each hidden cut with the gradient wipe or dark dip that hides it (overlapping
// ones merged)
function seamZones(authored = false) {
  const z = [...cutTimes.map(c => ({ a: c, b: c, cut: c, kind: null })),
    ...wipes.map(w => ({ a: w.t0, b: w.t0 + w.dur, cut: null, kind: 'the gradient wipe' })),
    ...dips.map(d => ({ a: d.t - d.dur, b: d.t + d.dur, cut: null, kind: 'the dark dip' }))].sort((x, y) => x.a - y.a);
  const out = [];
  for (const s of z) {
    const o = out.at(-1);
    if (o && s.a <= o.b + 1e-6) { o.b = Math.max(o.b, s.b); o.cut ??= s.cut; if (s.kind) o.kind ??= s.kind; }
    else out.push({ ...s });
  }
  const tt = authored ? x => x : toDisplay;
  return out.map(s => ({ a: tt(s.a), b: tt(s.b), cut: s.cut === null ? null : tt(s.cut), kind: s.kind }));
}
/* momentProblem(t, width, camera): can a moment go at display time t with this half-width (and, when given, this camera
   change: { orbit, tilt, … })?
   → null (fine) | { block: why, in plain words, … } (it can't: its blend reaches a join) | { warn: why, … } (it can, but a
   board's key moment is inside its blend, so that board won't match exactly; or, with camera, it swings the camera much
   faster than the camera moves there).
   The numbers come with the words (display s), so the player can say them in its own clock and offer the fixes:
     block: zone [a, b] (the join, with the wipe or dip that hides it), kind ('the gradient wipe' | 'the dark dip' | null),
            cut, before / after (where it can go instead with this blend; null outside the piece), shorter (the widest
            blend, 0.3 s or more in 0.05 s steps, that clears every join from t; null when none does: then the blend's
            length isn't offered as a fix)
     warn:  keys [{ n, tk }] (the key moments inside its blend), swing (× the camera's own speed; see momentSwing) */
const SEAM_EPS = 0.02;                                               // (tools/serve.mjs SEAM_EPS: the same margin)
const zoneHit = (t, w, zones) => zones.find(z => t - w < z.b + SEAM_EPS && t + w > z.a - SEAM_EPS) || null;
function widestBlend(t, zones) {                                    // → the widest blend at t that clears every join, or null
  let m = MW.max;
  for (const z of zones) {
    if (t > z.a - SEAM_EPS && t < z.b + SEAM_EPS) return null;       // (t itself is inside a join's window)
    m = Math.min(m, t <= z.a - SEAM_EPS ? z.a - SEAM_EPS - t : t - z.b - SEAM_EPS);
  }
  for (let w = Math.floor(m * 20 + 1e-9) / 20; w >= MW.min - 1e-9; w = Math.round((w - 0.05) * 20) / 20)
    if (!zoneHit(t, w, zones)) return +w.toFixed(2);
  return null;
}
const SWING_WARN = 2;                                                // (× the camera's own speed: above this, say so)
function momentProblem(t, width, camera, full = false) {   // (full: applyMoments' own use: { swing } even when there's nothing to say)
  t = t === null || t === '' ? NaN : +t;
  if (!Number.isFinite(t)) return { block: 'its time isn\'t a number of seconds' };
  if (t < 0 || t > END) return { block: `its time (${f2(t)} s) is outside the piece (0–${END} s)` };
  const w = clampW(width), a = t - w, b = t + w, zones = seamZones(), z = zoneHit(t, w, zones);
  if (z) {
    const where = z.kind ? `${z.kind} (${f2(z.a)}–${f2(z.b)} s) that hides a join between two parts of the piece` : `the hidden join at ${f2(z.cut)} s between two parts of the piece`;
    const before = Math.floor((z.a - SEAM_EPS - w) * 100 - 1e-6) / 100, after = Math.ceil((z.b + SEAM_EPS + w) * 100 + 1e-6) / 100;   // (rounded away from the join)
    const shorter = widestBlend(t, zones), go = [before >= 0 ? `before ${f2(before)} s` : null, after <= END ? `after ${f2(after)} s` : null].filter(Boolean).join(' or ');
    const fix = [go ? `put it ${go}` : null, shorter !== null ? `make its blend shorter (${shorter} s or less)` : null].filter(Boolean).join(', or ');
    return { block: `its blend (${f2(a)}–${f2(b)} s) reaches ${where}, and moving the camera there would show the join${fix ? `. ${fix[0].toUpperCase()}${fix.slice(1)}` : ''}`,
      zone: [z.a, z.b], kind: z.kind, cut: z.cut, before: before >= 0 ? before : null, after: after <= END ? after : null, shorter };
  }
  const why = [], keys = holdOrder.map(n => ({ n, tk: toDisplay(holds[n].tk) })).filter(k => k.tk > a && k.tk < b);
  if (keys.length) {
    const ns = keys.map(k => k.n), list = ns.length === 1 ? `frame ${ns[0]}` : `frames ${ns.slice(0, -1).join(', ')} and ${ns.at(-1)}`;
    why.push(`its blend (${f2(a)}–${f2(b)} s) overlaps ${list}'s key moment${ns.length > 1 ? 's' : ''} (${keys.map(k => f2(k.tk) + ' s').join(', ')}), so ${ns.length > 1 ? 'those boards' : 'that board'} won't match exactly there`);
  }
  const swing = camera && typeof camera === 'object' ? momentSwing(t, w, camera) : null;
  if (swing !== null && swing >= SWING_WARN) why.push(swingText(swing));
  return why.length ? { warn: why.join('; and '), keys, ...(swing !== null ? { swing } : {}) } : full && swing !== null ? { swing } : null;
}
const swingText = x => `it's a fast swing (about ${x < 3 ? x.toFixed(1) : Math.round(x)}× the camera's own speed there), which reads as a jolt; a longer blend (or a smaller change) makes it gentler`;
/* momentSwing(t, width, camera): how much faster a moment makes the picture move than the camera moves it there on its own
   → × (1 = no faster). The camera is sampled at 120 Hz of display time over the blend (and 0.15 s either side), as built
   plus the frame edits, without and with this one moment, and two speeds are read, both as how fast the picture moves
   (°/s of view): its turn (the view's direction, plus 0.6 × its roll, which the frame's corners feel at ~0.6 of the way
   out, and half its lens change) and its travel as seen at the moment's pivot (sideways travel ÷ the distance to the pivot;
   travel along the view only spreads the picture from its centre, so 0.45 × that: the frame's side edge; in °/s, so it
   reads the same in every part of the piece). The swing is the larger of the two peaks with the moment over the same peak
   without it, never counting less than SWING_FLOOR °/s as the camera's own (a near-still camera would otherwise make any
   change look fast). Calibrated 09-29 against the review's camprobe figures (its peak turn with ÷ without): the three
   test moments m1 (orbit 15°, push 20 %, ± 0.6 s at 47.0) 1.7× (camprobe 1.74×), m2 (88.0) 1.35×, m3 (128.5) 1.8×; the
   Orbit slider's end (45°) at ± 0.3 s 5.8× (5.7×), and at ± 2 s 1.7×; orbit 90° with push 90 % typed in, ± 0.3 s, 11.6×
   (~10×). SWING_WARN (2×) sits between the gentle ones and the whip-pans. */
const SWING_FLOOR = 30;
const swDir = new THREE.Vector3();
function momentSwing(t, width, camera) {
  if (!CAM_KEYS.some(k => +camera[k])) return 1;
  const w = clampW(width), cm = {};
  for (const k of CAM_KEYS) { const v = +camera[k]; cm[k] = Number.isFinite(v) ? Math.min(CAM_LIM[k][1], Math.max(CAM_LIM[k][0], v)) : 0; }
  const c = toAuthored(t), M = { a: toAuthored(t - w), c, b: toAuthored(t + w) }, piv = momentPivot(c), DT = 1 / 120;
  const sample = (T, withIt) => {
    const ta = toAuthored(T), p = baseCamAt(ta); if (!p.C) return null;
    if (withIt) { const k = momentW(ta, M); if (k > 0) camAdjust(p.C, p.L, p.fr, k, cm, piv); }
    return { C: p.C, f: swDir.copy(p.L).sub(p.C).normalize().clone(), fr: p.fr, d: Math.max(1e-3, p.C.distanceTo(piv)) };
  };
  const R2D = 180 / Math.PI, dv = new THREE.Vector3();
  const peaks = withIt => {
    let turn = 0, move = 0, prev = null;
    for (let T = Math.max(0, t - w - 0.15); T <= Math.min(END, t + w + 0.15) + 1e-9; T += DT) {
      const s = sample(T, withIt);
      if (s && prev) {
        const ang = Math.acos(Math.min(1, Math.max(-1, s.f.dot(prev.f)))) * R2D;
        turn = Math.max(turn, (ang + 0.6 * Math.abs(s.fr[1] - prev.fr[1]) + 0.5 * Math.abs(s.fr[0] - prev.fr[0])) / DT);
        dv.copy(s.C).sub(prev.C); const along = dv.dot(s.f), side = Math.sqrt(Math.max(0, dv.lengthSq() - along * along));
        move = Math.max(move, (side + 0.45 * Math.abs(along)) / s.d * R2D / DT);
      }
      prev = s;
    }
    return { turn, move };
  };
  const a = peaks(false), b = peaks(true);
  return Math.max(b.turn / Math.max(a.turn, SWING_FLOOR), b.move / Math.max(a.move, SWING_FLOOR), 1);
}
// the camera as built plus the frame edits (no moments) at authored time t, and where the sphere is drawn then
function baseCamAt(t) {
  const b = ballAt(sphereT(t));
  for (const E of EDITED) if (E.hasNudge) { const w = E.wN(t); if (w > 0) b.p.addScaledVector(E.nudge, w); }
  const v = camAt(t); if (!v) return { b, C: null };
  const C = new THREE.Vector3(v[0], v[1], v[2]).addScaledVector(b.p, v[8]), L = new THREE.Vector3(v[3], v[4], v[5]).addScaledVector(b.p, v[8]).lerp(b.p, v[6]), fr = [v[7], v[9]];
  editCamera(t, C, L, fr, false);
  return { b, C, L, fr };
}
function momentPivot(t) {
  const { b, C, L, fr } = baseCamAt(t);
  if (!C) return b.p.clone();
  const fwd = L.clone().sub(C).normalize(), right = fwd.clone().cross(up).normalize(), upv = right.clone().cross(fwd), rel = b.p.clone().sub(C);
  const z = rel.dot(fwd), tv = Math.tan(fr[0] * Math.PI / 360);
  const inView = !b.h && b.sc > 0.01 && z > 0.3 && Math.abs(rel.dot(right)) <= 1.1 * z * tv * 16 / 9 && Math.abs(rel.dot(upv)) <= 1.1 * z * tv;
  return inView ? b.p.clone() : C.clone().addScaledVector(fwd, z > 1 ? z : Math.max(1, C.distanceTo(L)));
}
// (re)builds the moments in use from MOMENTS.src (after loading, a setMoments() preview, or a frame edit that moves the clock)
function applyMoments() {
  const { all, bad } = normMoments(MOMENTS.src), used = [], ignored = [...bad], warnings = [];
  const swingOf = new Map();
  for (const m of all) {
    const p = momentProblem(m.t, m.width, m.camera, true);
    if (p && !p.block) swingOf.set(m.id, +(p.swing ?? 1).toFixed(2));
    if (p && p.block) { ignored.push({ id: m.id, t: m.t, reason: p.block }); continue; }
    if (p && p.warn) warnings.push({ id: m.id, t: m.t, warn: p.warn, ...(p.swing !== undefined ? { swing: +p.swing.toFixed(2) } : {}) });
    used.push(m);
  }
  MOM = used.filter(m => CAM_KEYS.some(k => m.camera[k])).map(m => {       // (a moment with no camera change does nothing)
    const c = toAuthored(m.t);
    return { id: m.id, a: toAuthored(m.t - m.width), c, b: toAuthored(m.t + m.width), camera: m.camera, piv: momentPivot(c) };
  });
  MREP = { file: MOMENTS.file, error: MOMENTS.error, all, used, ignored, warnings, swing: Object.fromEntries(used.map(m => [m.id, swingOf.get(m.id) ?? 1])) };
  MREV++;
  for (let i = groupErrors.length - 1; i >= 0; i--) if (groupErrors[i].startsWith('moments: ')) groupErrors.splice(i, 1);
  if (MOMENTS.error) groupErrors.push(`moments: ${MOMENTS.error}`);
  for (const g of ignored) groupErrors.push(`moments: ${g.id}${g.t !== null ? ` (${f2(g.t)} s)` : ''} is left out: ${g.reason}`);
}
const cloneJ = x => JSON.parse(JSON.stringify(x));
/* the player's Edit mode previews moments live, before they're saved (tools/serve.mjs writes frames/moments.json): list is
   the moments array (as the file's "moments"), or null for the list as loaded. The next render shows it.
   → { used: [the normalised moments in use], ignored: [{ id, t, reason }], warnings: [{ id, t, warn, swing? }] } */
export function setMoments(list) {
  MOMENTS.src = list === null || list === undefined ? MOMENTS.loaded : Array.isArray(list) ? list : list && Array.isArray(list.moments) ? list.moments : [];
  applyMoments();
  return { used: cloneJ(MREP.used), ignored: cloneJ(MREP.ignored), warnings: cloneJ(MREP.warnings) };
}
/* camBase(t, withMoments): the camera without the moments, for copy that comes to rest in the world (copy/c13.js
   leaveInWorld: its stand-in camera is built on this one, so a moment moves resting copy exactly as it moves the set).
   t = authored time. → null when no moment moves the camera at t (the live camera is then exactly this one: nothing to
   compute, and the piece with no moments runs the same code as before), else { C: [x, y, z], Q: [x, y, z, w] }: the
   camera's place and turn as built plus the frame edits, as pose() sets them; withMoments: plus the moments too (the
   camera as it renders at t). */
const cbCam = new THREE.PerspectiveCamera();
function camBase(t, withMoments = false) {
  if (!MOM.some(M => t > M.a && t < M.b)) return null;
  const { C, L, fr } = baseCamAt(t); if (!C) return null;
  if (withMoments) for (const M of MOM) { const c = momentW(t, M); if (c > 0) camAdjust(C, L, fr, c, M.camera, M.piv); }
  cbCam.position.copy(C); cbCam.up.set(0, 1, 0); cbCam.quaternion.identity(); cbCam.lookAt(L);
  if (fr[1]) cbCam.rotateZ(fr[1] * Math.PI / 180);
  return { C: C.toArray(), Q: cbCam.quaternion.toArray() };
}
const momentProblemPublic = (t, width, camera) => momentProblem(t, width, camera);   // (null | { block } | { warn }, as the contract has it)
export { momentProblemPublic as momentProblem };
const momentsReport = () => cloneJ(MREP);
applyMoments();

/* ---------------- render ---------------- */
const smooth = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
export const view = { plates: true, notes: true };
const els = { wipe: document.getElementById('wipe'), dip: document.getElementById('dip'), hud: document.getElementById('hud') };
function pose(t) {                                                // sphere + camera only (cheap; used by the checks). t = authored time
  const b = ballAt(sphereT(t));
  for (const E of EDITED) if (E.hasNudge) { const w = E.wN(t); if (w > 0) b.p.addScaledVector(E.nudge, w); }
  ball.position.copy(b.p); ball.quaternion.copy(b.q); ball.scale.setScalar(Math.max(0.001, b.sc));
  ball.visible = !b.h && !document.getElementById('stage').classList.contains('hide-sphere');
  const v = camAt(t);
  if (v) {
    camera.position.set(v[0], v[1], v[2]).addScaledVector(b.p, v[8]);
    look.set(v[3], v[4], v[5]).addScaledVector(b.p, v[8]).lerp(b.p, v[6]);
    const fr = [v[7], v[9]];
    editCamera(t, camera.position, look, fr);
    camera.up.set(0, 1, 0); camera.lookAt(look);
    if (fr[1]) camera.rotateZ(fr[1] * Math.PI / 180);
    if (camera.fov !== fr[0]) { camera.fov = fr[0]; camera.updateProjectionMatrix(); }
  }
  camera.updateMatrixWorld();
  return b;
}
export function render(T) {                                        // T = display time (the timeline); t = authored time (after timing edits)
  const t = toAuthored(T);
  bgAt(t); bgU.t.value = t; bgU.flow.value = flowAmt;
  const b = pose(t);
  for (const P of plates) {
    const a = P.stay ? smooth((t - P.in[0]) / (P.in[1] - P.in[0])) : Math.min(smooth((t - P.in[0]) / (P.in[1] - P.in[0])), 1 - smooth((t - P.out[0]) / (P.out[1] - P.out[0])));
    P.mesh.visible = view.plates && a > 0.001;
    if (!P.mesh.visible) continue;
    P.mesh.material.opacity = a;
    // build in / out: arrives out of the depth; subtle drift while held (a few px)
    const dx = P.drift * P.pxw * Math.sin(t * 0.9 + P.ph), dy = P.drift * P.pxw * Math.cos(t * 0.7 + P.ph);
    P.mesh.position.copy(P.c).addScaledVector(P.fwd, (1 - a) * P.fly).addScaledVector(P.right, dx).addScaledVector(P.upv, dy);
  }
  for (const f of anims) f(t, b);
  FXU.spd.value = FX.sp; FXU.wild.value = FX.wild; FXU.walk.value = FX.walk;
  for (const m of mats) { m.uniforms.t.value = t; m.uniforms.flow.value = flowAmt; }
  renderer.render(scene, camera);
  renderCopy(t);
  // 2D overlays: the gradient pill wipe, the dark dip, the animatic notes
  let wx = null;
  for (const w of wipes) { const u = (t - w.t0) / w.dur; if (u > 0 && u < 1) { const e = gsap.parseEase('power2.inOut')(u); wx = w.dir === 'lr' ? -2700 + e * 4620 : 1920 - e * 4620; els.wipe.dataset.dir = w.dir; } }
  if (els.wipe) { els.wipe.style.display = wx === null ? 'none' : 'block'; if (wx !== null) els.wipe.style.transform = `translateX(${wx}px)`; }
  let dk = 0, dc = '#150632';
  for (const d of dips) { const x = 1 - Math.abs(t - d.t) / d.dur; if (x > dk) { dk = x; dc = d.col; } }
  if (els.dip) { els.dip.style.opacity = smooth(dk * 1.6); els.dip.style.background = dc; }
  if (els.hud) {
    const n = frameAt(t), h = holds[n];
    const inH = h && t >= h.t0 && t <= h.t1, phase = inH ? (h.pass ? `passing board ${n} (drift-through)` : `HOLD · board ${n}`) : h && t < h.t0 ? `moving into ${n}` : `leaving ${n}`;
    const ns = notes.filter(x => t >= x.t0 && t <= x.t1).map(x => x.text);
    els.hud.innerHTML = `<b>Frame ${n}</b> · ${phase}${ns.length ? '<br>' + ns.join('<br>') : ''}`;
    els.hud.style.display = view.notes ? 'block' : 'none';
    els.hud.classList.toggle('held', !!(inH && !h.pass));
  }
}

/* ---------------- dev: checks for authors ---------------- */
const ballView = t => {                                             // [x px, y px, diameter px, visible]
  pose(t); const c = ball.position.clone(), vv = c.clone().project(camera);
  const upW = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1), e = c.addScaledVector(upW, R * ball.scale.x).project(camera);
  return [(vv.x + 1) * 960, (1 - vv.y) * 540, 2 * Math.hypot((e.x - vv.x) * 960, (e.y - vv.y) * 540), ball.visible && vv.z < 1 && Math.abs(vv.x) < 1.1 && Math.abs(vv.y) < 1.1];
};
const check = (from = 0, to = END) => {
  const cr = contentReport();
  const out = { errors: [...groupErrors, ...(cr.error ? [cr.error] : []), ...cr.problems], holds: [], pace: [], content: cr, moments: momentsReport() };
  // sphere coverage: every moment must belong to a seg (a gap freezes the sphere at the next seg's start)
  for (let i = 1; i < segs.length; i++) { const a = segs[i - 1], b = segs[i]; if (b.t0 > a.t1 + 0.01 && b.t0 > from && a.t1 < to) out.errors.push(`sphere: no seg between ${a.t1.toFixed(2)} and ${b.t0.toFixed(2)} (it would sit still)`); }
  for (const n of Object.keys(holds).map(Number).sort((a, b) => a - b)) {
    const h = holds[n]; if (h.tk < from || h.tk > to) continue;
    const bv = ballView(h.tk), B = BOARD[n];
    let still = 0; const p0 = camAt(h.t0);
    for (let k = 1; k <= 8; k++) { const p = camAt(h.t0 + (h.t1 - h.t0) * k / 8); still = Math.max(still, Math.hypot(p[0] - p0[0], p[1] - p0[1], p[2] - p0[2])); }
    const cutIn = cutTimes.find(c => c > h.t0 && c <= h.t1);
    const gOf = Object.keys(GROUP_FRAMES).find(g => GROUP_FRAMES[g].includes(n));
    if (h.t0 < CUTS[gOf] - 1e-6) out.errors.push(`frame ${n}: its hold starts (${h.t0.toFixed(2)}) before its group ${gOf} begins (${CUTS[gOf]})`);
    if (cutIn !== undefined) out.errors.push(`frame ${n}: its hold (${h.t0.toFixed(2)}–${h.t1.toFixed(2)}) spans the cut at ${cutIn}`);
    out.holds.push({ n, t: [h.t0, h.t1].map(x => +x.toFixed(2)), tk: +h.tk.toFixed(2), sphere: B ? { dx: Math.round(bv[0] - B.px), dy: Math.round(bv[1] - B.py), dSize: +((bv[2] - B.d) / B.d).toFixed(2), visible: bv[3] } : 'none on board', camDriftDuringHold: h.pass ? 'pass-through (moves by design)' : +still.toFixed(4) });
  }
  // pace per frame window: world speed while the sphere is on screen and not hidden
  for (const [n] of FR) {
    const [a, b] = win(n); if (b < from || a > to) continue;
    let vs = [], stopRun = 0, stops = 0, prev = ballAt(a).p;
    for (let t = a + 1 / 60; t < b; t += 1 / 60) {
      const bb = ballAt(t), d = bb.p.distanceTo(prev); prev = bb.p;
      if (d > 2 || bb.h) continue;                                  // cut or hidden
      const on = ballView(t)[3]; if (!on) { stopRun = 0; continue; }
      const v = d * 60; vs.push(v);
      if (v < 1) { stopRun += 1 / 60; if (Math.abs(stopRun - 0.25) < 1 / 120) stops++; } else stopRun = 0;
    }
    if (vs.length) out.pace.push({ n, min: +Math.min(...vs).toFixed(1), avg: +(vs.reduce((s, x) => s + x, 0) / vs.length).toFixed(1), max: +Math.max(...vs).toFixed(1), visibleStops: stops });
  }
  return out;
};
// the engine's own tables, read-only, for tools that need more than the API above (audio/v2/probe_v2_events.mjs, the
// sound re-cue, reads the sphere table, the set pieces, the camera, the copy objects, the wipes and dips). Getters, so
// they're always current. Keep these names working when refactoring (or update the tools that read them).
const probe = Object.freeze({ get pieces() { return pieces; }, get S() { return S; }, get DT() { return DT; }, get N() { return N; }, get camera() { return camera; },
  get copyObjs() { return copyObjs; }, get wipes() { return wipes; }, get dips() { return dips; }, get ball() { return ball; }, get pose() { return pose; }, get sphereT() { return sphereT; } });
window.v2 = { holds, BOARD, FR, CUTS, EDITS, setEdit, toAuthored, toDisplay, holdDisplay, ballView, check, camAt, ballAt: t => ballAt(t).p.toArray(), camPose: t => { render(toDisplay(t)); const d = new THREE.Vector3(); camera.getWorldDirection(d); return { pos: camera.position.toArray(), dir: d.toArray(), fov: camera.fov }; }, groupErrors,
  get content() { return contentReport(); }, contentDefaults: () => CONTENT.defaults, probe,
  // camera moments: moments = the list in use (normalised); setMoments(list) previews a list live → { used, ignored };
  // momentProblem(t, width, camera?) → null | { block, zone, kind, cut, before, after, shorter } | { warn, keys, swing? } (the
  // numbers in display s, for the player's own wording); momentSwing(t, width, camera) → × the camera's own speed;
  // momentsReport = { file, error, all (every moment, normalised), used, ignored: [{ id, t, reason }], warnings: [{ id, t,
  // warn, swing? }], swing: { id: × } } (check.mjs and the exporter read it); momentZones() =
  // where no blend may reach (display s: [{ a, b, cut, kind }], each hidden cut with its wipe or dip; momentProblem adds 0.02 s;
  // momentZones(true): in authored s, as tools/serve.mjs's SEAMS has them, which dev/check.mjs compares); camBase(t, withMoments)
  // = the camera without the moments at authored t, or null when none is active then (copy/c13.js leaveInWorld; momentsRev
  // changes whenever what it returns can, so it can be cached by t and momentsRev)
  get moments() { return cloneJ(MREP.used); }, setMoments, momentProblem: momentProblemPublic, momentSwing, get momentsReport() { return momentsReport(); }, momentZones: authored => seamZones(!!authored), camBase, get momentsRev() { return MREV; } };
Object.defineProperties(window.v2, { setFlow: { value: setFlow, enumerable: true }, flow: { get: () => flowAmt, enumerable: true }, flowSpeed: { get: () => FX.sp, enumerable: true } });   // the gradient flow (0–5; 1 = Medium, as built): the player's Gradient flow slider, ?flow=, and the exporter's check (tools/export.mjs); flowSpeed: the living gradients' clock speed (1 up to Bold, 2.7 at Max), for the copy's fills (copy/c07.js flowFill)
