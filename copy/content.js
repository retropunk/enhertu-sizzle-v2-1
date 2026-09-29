/* The editable content (content/copy.json; the user's guide is content/README.md): every line of copy text and every
   picture, per frame. v2.js loads the file before the copy files run (V.content); each copy file asks here for its lines
   and pictures, with today's values as the defaults, so a missing or broken file (or one that says the same) renders the
   piece exactly as built.
     const T = contentFor(V, 7);
     T.spec('card', 0, { text: 'JANUARY 2025', w: 'l', L, cy, W })   → a kit line's spec: the SAME object when the file says
        what the spec says (the frame renders exactly as built), or a copy carrying the edit, { …, edit: { md, runs, … } },
        which the kits draw with auto-fit (below)
     T.line('lines', 0, '**AND THE**')                               → { md, runs, text, edited } (for the non-kit lines)
     T.num('numbers', 0, '90+')                                       → { text, digits, value, suffix, edited } (count-ups)
     T.pic('art', { src, fit })                                       → { src, fit, focus, edited }
   The text markup: **bold**, the rest light (New Hero ExtraBold / Light, as the boards). A line is one line: its place,
   size, animation and layer come from the copy file; the file only changes its words.
   Auto-fit (only for a line that differs from today's; a line as built is never touched):
   · it keeps the line's size and tracking as built (fitted to the board) and its left edge (or its centre, for the lines
     the board centres), and shrinks, if it has to, so it never runs past the edge of its area (maxR, board px): its
     holding shape's or card's inside, or its layer's box, never past 40 px from the frame's edge;
   · holding shapes and cards first grow with their text (grow(), up to 30 % wider, never past 40 px from the frame's
     edge; to the right, or to the left for a shape in the right half of the frame, its text moving with it);
   · pictures: a new picture cover-fills its frame (fit "cover", centred, or at `focus`), or fits whole ("contain": the
     cut-outs and the logo).
   Everything asked for is recorded on V.content (used keys, defaults, edits, problems) for check.mjs and the player.
   Each edit's record (V.content.edits[…], also carried as .entry on what line() / spec() / num() / numSpec() return)
   gets the size factor its auto-fit settled on (entry.k: 1 = the size as built): the fits call noteFit(entry, k), or pass
   { entry } to shrinkK(). check.mjs and the player's Words tab say so when an edited line had to shrink a lot. */

const FACE = '"new-hero", "Open Sans", sans-serif';
export const WT = { b: 800, l: 300 };
export const EDGE = [40, 1880];                                       // an edited line or a grown shape stays inside these (board px)

/* ---------- markup ---------- */
// '**AND PRINTED** WITHIN' → [{ text: 'AND PRINTED', w: 'b' }, { text: ' WITHIN', w: 'l' }] (an unclosed ** runs bold to the end)
export const parseMd = md => {
  const runs = []; let b = false;
  for (const part of String(md).split('**')) { if (part) runs.push({ text: part, w: b ? 'b' : 'l' }); b = !b; }
  return runs;
};
export const plain = runs => runs.map(u => u.text).join('');
const mdOf = s => (s.w === 'b' ? `**${s.text}**` : s.text);

/* ---------- measuring (canvas, as the kits do) ---------- */
let cv = null;
const cx = () => cv || (cv = document.createElement('canvas').getContext('2d'));
// the ink of runs set one after another at font size fs and letter-spacing ls (px): l = the first run's ink left bearing
// (from the origin, + to the left, as canvas measures it), r = the ink's right end from the origin, w = its width, adv =
// the advance (the box CSS lays out). wts: the weights for 'b' and 'l'; ws: word spacing (px, added to each space).
export function inkRuns(runs, fs, ls = 0, wts = WT, ws = 0) {
  const c = cx(); let x = 0, l = 0, r = 0;
  runs.forEach((u, i) => {
    c.font = `${wts[u.w]} ${fs}px ${FACE}`; c.letterSpacing = `${ls}px`; c.wordSpacing = `${ws}px`;
    const m = c.measureText(u.text);
    if (i === 0) l = m.actualBoundingBoxLeft;
    if (u.text.trim()) r = Math.max(r, x + m.actualBoundingBoxRight);
    x += m.width;
  });
  c.letterSpacing = '0px'; c.wordSpacing = '0px';
  return { l, r, w: runs.length ? l + r : 0, adv: x };
}
// the cap height and the cap centre in a line-height-1 box, per weight (fractions of the font size)
const CAP = {};
export function capOf(wt) {
  if (CAP[wt]) return CAP[wt];
  const c = cx(); c.font = `${wt} 100px ${FACE}`; c.letterSpacing = '0px';
  const m = c.measureText('H'), base = (100 - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
  return (CAP[wt] = { cap: m.actualBoundingBoxAscent / 100, cc: (base - m.actualBoundingBoxAscent / 2) / 100 });
}
// a span's text as runs: one child span per run, weighted by class (b / l) or, with wts, by an inline weight
export function fillRuns(sp, runs, wts) {
  sp.textContent = '';
  for (const u of runs) {
    const k = document.createElement('span'); k.className = u.w; k.textContent = u.text;
    if (wts) k.style.fontWeight = wts[u.w];
    sp.appendChild(k);
  }
  return sp;
}
export const fontsIn = () => Promise.all([300, 800].map(w => document.fonts.load(`${w} 100px "new-hero"`)));

/* ---------- auto-fit of an edited line ----------
   fs, ls: the line's size and tracking as built. L: its left edge (ink, or the text box's for org lines), c: its centre
   for centred lines. Returns the size factor k (≤ 1) that keeps the edited ink inside [minL, maxR]. (maxR is taken as
   given for a left-aligned line: a shape that grows to the left lets its lines run past the frame's edge before they
   move left with it; the callers keep their own defaults inside EDGE.) */
export function shrinkK(runs, fs, ls, { L, maxR, minL = EDGE[0], align, c, ws = 0, entry }) {
  const m = inkRuns(runs, fs, ls, WT, ws);
  if (m.w <= 0) return noteFit(entry, 1);
  const room = align === 'center' ? 2 * Math.min(c - Math.max(minL, EDGE[0]), Math.min(maxR, EDGE[1]) - c) : maxR - L;
  return noteFit(entry, room > 0 && m.w > room ? room / m.w : 1);
}
// an edited line's final size factor, for the report (entry: its V.content.edits record; the last fit wins). Returns k.
export const noteFit = (entry, k) => { if (entry) entry.k = k; return k; };

/* ---------- the accessor ---------- */
const frameOf = (d, n) => d && d.frames && typeof d.frames === 'object' ? (d.frames[n] ?? d.frames[String(n).padStart(2, '0')]) : undefined;
export function contentFor(V, n) {
  const C = V.content || { data: null, used: new Set(), edits: [], problems: [], defaults: {} };
  const F = frameOf(C.data, n);
  const where = (g, i) => `frame ${n} ${g}${i != null ? ` line ${i + 1}` : ''}`;
  // the value in the file, or undefined (a wrong type is reported and ignored)
  const valOf = (kind, g, i) => {
    const grp = F && F[kind] && F[kind][g];
    const v = i == null ? grp : Array.isArray(grp) ? grp[i] : undefined;
    return v;
  };
  const rec = (kind, g, i, def) => {
    const key = `${n}/${kind}/${g}${i != null ? `/${i}` : ''}`;
    if (C.used) C.used.add(key);
    if (C.defaults) C.defaults[key] = def;
    return key;
  };
  const T = {
    /* a line: { md, runs, text, edited } (edited: the file's words differ from today's) */
    line(g, i, defMd) {
      rec('text', g, i, defMd);
      let md = valOf('text', g, i);
      if (md !== undefined && typeof md !== 'string') { C.problems.push(`content/copy.json: ${where(g, i)} should be text in quotes (it is ${JSON.stringify(md)}): using the built-in words`); md = undefined; }
      const edited = md !== undefined && md.trim() !== defMd.trim();
      let entry;
      if (!edited) md = defMd;
      else C.edits.push(entry = { n, g, i, key: `${n}/text/${g}/${i}`, where: where(g, i), text: `${where(g, i)}: "${md}"` });
      const runs = parseMd(md);
      return { md, runs, text: plain(runs), edited, entry };
    },
    /* a kit line's spec: s itself when not edited; else a copy with the edit. defMd: the line's markup as built (default:
       s.text, bold if s.w is 'b'); o.mixed: the line as built is in two weights (its size is fitted over those runs);
       o.align 'center': the board centres it (an edit keeps its centre); o.maxR / o.minL: its area (board px) */
    spec(g, i, s, defMd = mdOf(s), o = {}) {
      const r = T.line(g, i, defMd);
      if (!r.edited) return s;
      return { ...s, edit: { md: r.md, runs: r.runs, sizeRuns: o.mixed ? parseMd(defMd) : [{ text: s.text, w: s.w }], align: o.align, maxR: o.maxR ?? s.maxR, minL: o.minL, entry: r.entry } };
    },
    /* a counting number: '90+' → digits '90' (what counts up), value 90, suffix '+' (drawn small, as the board's plus);
       a number with commas counts with commas; text that doesn't start with a digit is shown as it is (no count) */
    num(g, i, def) {
      const r = T.line(g, i, def), t = r.text.trim(), m = /^(\d[\d,]*)(.*)$/.exec(t);
      if (!m) return { text: t, digits: t, value: NaN, suffix: '', edited: r.edited, entry: r.entry };
      const value = +m[1].replace(/,/g, '');
      return { text: t, digits: m[1], value, suffix: m[2], commas: m[1].includes(','), edited: r.edited, entry: r.entry };
    },
    /* a kit number's spec (c07's K.number: s.digits, then the board's small plus): s itself, or a copy with the edit */
    numSpec(g, i, s, def = `${s.digits}+`, o = {}) {
      const r = T.num(g, i, def);
      return r.edited ? { ...s, edit: { ...r, maxR: o.maxR ?? s.maxR } } : s;
    },
    /* a picture: { src, fit, focus, edited } (edited: anything differs from today's: then it cover- or contain-fits its
       frame; as built it keeps its board registration). The file may give just the path, or { src, fit, focus }. */
    pic(key, def) {
      rec('pictures', key, null, { src: def.src, fit: def.fit || 'cover' });
      let v = valOf('pictures', key, null);
      if (typeof v === 'string') v = { src: v };
      if (v !== undefined && (v === null || typeof v !== 'object' || (v.src !== undefined && typeof v.src !== 'string'))) {
        C.problems.push(`content/copy.json: frame ${n} picture "${key}" should be { "src": "assets/…" } or a path in quotes: using the built-in picture`); v = undefined;
      }
      const src = (v && v.src && v.src.trim()) || def.src, fit = v && (v.fit === 'contain' || v.fit === 'cover') ? v.fit : def.fit || 'cover';
      const focus = v && typeof v.focus === 'string' && v.focus.trim() ? v.focus.trim() : '50% 50%';
      const edited = src !== def.src || fit !== (def.fit || 'cover') || !!(v && v.focus);
      if (edited) C.edits.push({ n, g: 'pictures', i: 0, text: `frame ${n} picture "${key}": ${src} (${fit}${v && v.focus ? `, focus ${focus}` : ''})` });
      return { src, fit, focus, edited, key, n };
    },
  };
  return T;
}

/* a picture that fails to load is reported (check.mjs); harmless for the built-in ones */
export function watchPic(V, img, p) {
  const C = V.content; if (!C || !img) return img;
  img.addEventListener('error', () => { C.problems.push(`content/copy.json: frame ${p.n} picture "${p.key}": ${p.src} didn't load (check the path; pictures live in assets/copy/)`); }, { once: true });
  return img;
}
// an edited picture's style: it fills its frame's inside (cover: cropped to fill; contain: whole, on the frame's colour)
export const picCss = (p, extra = '') => `position:absolute;left:0;top:0;width:100%;height:100%;max-width:none;display:block;object-fit:${p.fit};object-position:${p.focus}${extra ? ';' + extra : ''}`;

/* ---------- holding shapes and cards grow with edited text ----------
   grow(ready, { el, box: [x, y, w, h] (the shape's outer box, board px), lines: the kit spans inside it, side, margin })
   Called right after the shape's lines are made (before the fonts are in). If none of its lines is edited it does nothing
   (the shape stays exactly as built). Otherwise each edited line may run to the shape's inside at its widest (maxR), and
   once the lines are fitted the shape grows by what they need: up to 30 % of its width, never past 40 px from the
   frame's edge; to the right, or (side 'left', the default for a shape in the right half of the frame) to the left, its
   lines moving with it. Beyond that the lines shrink (the kit's fit). margin: the text's inset from the shape's right
   edge (default: the same as from its left edge). limit: [left, right] board px the shape may not grow past (other copy
   next to it). */
export function grow(ready, { el, box: [x, , w], lines, side, margin, limit = EDGE, refit }) {
  const eds = lines.filter(sp => sp && sp.ln && sp.ln.s.edit);
  if (!eds.length) return;
  side = side || (x + w / 2 > 960 ? 'left' : 'right');
  const textL = Math.min(...lines.filter(sp => sp && sp.ln).map(sp => { const L = sp.ln.s.L; return typeof L === 'function' ? L() : L; }));
  const mg = margin ?? Math.max(24, textL - x);
  // the inside's right edge as built: the shape's right less the margin, or further if the board's own text runs further
  const inR = Math.min(EDGE[1], Math.max(x + w - mg, ...lines.filter(sp => sp && sp.ln && !sp.ln.s.edit).map(sp => sp.ln.s.L + (sp.ln.s.W || 0)),
    ...eds.map(sp => sp.ln.s.L + (sp.ln.s.W || 0))));
  const room = side === 'right' ? Math.min(EDGE[1], limit[1]) - (x + w) : x - Math.max(EDGE[0], limit[0]);
  const G = Math.max(0, Math.min(0.3 * w, room));
  for (const sp of eds) { const e = sp.ln.s.edit; e.maxR = Math.min(e.maxR ?? Infinity, inR + G); if (refit) refit(sp); }   // (a line's own, nearer limit stays)
  ready.then(() => {
    const need = Math.max(...eds.map(sp => sp.ln.inkR || 0)) - inR, g = Math.min(G, Math.max(0, need));
    if (g <= 0.5) return;
    el.style.width = `${(w + g).toFixed(2)}px`;
    if (side === 'left') {
      el.style.left = `${(parseFloat(el.style.left) - g).toFixed(2)}px`;
      for (const sp of lines) if (sp && sp.ln) { sp.ln.dx = -g; sp.ln.d.style.left = `${(parseFloat(sp.ln.d.style.left) - g).toFixed(2)}px`; }
    }
  });
}
