/* G4's copy helpers (frames 16–20: c16.js … c20.js import them). They live in their own file so the five frames' copy files
   no longer import one another (c19 used to import from c18, and c20 from c19, so a parse error in one dropped the next
   frames' copy too). Only c07.js (the kit) and this file are shared.
   · ride(): the copy rides part of the camera's move, so on a camera that never stops it hovers near its board place.
   · rideBeta(): how much it rides, easing from one value before the key instant to another after it.
   · sphereFront(): the sphere passes in front of a layer for a moment (decision 5a).
   · mixedLine(): a super line in two weights, one mask and one swipe (moved here from c18.js).
   · MODE: the 1L MODE: ACTIVATED holding shape on boards 19 and 20.
   · tag(): marks a frame's layers (data-f) for the dev probes. */

const sm = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };

/* ride(V, layers, h, beta): the layers (laid out in hold h's view) ride part of the camera's movement, its turn as well as
   its travel. At h.tk the camera passes hold h's exact pose, so there every layer sits exactly on its board place whatever
   beta is. At any other moment each layer is moved beta(t) of the way (position lerp, facing slerp) from its place in the
   world toward where it would be had it been fixed to the camera since h.tk: 0 = in the world (full parallax), 1 = fixed
   on the screen. So the copy keeps (1 − beta) of the world's motion on screen: it still slides and turns in perspective
   against the set (it is in 3D), but it hovers near its board place through the slow window instead of sweeping across
   the frame and being cropped by its edges. beta is a number or a function of the (authored) time. The live camera is read
   in the scene's onBeforeRender, which runs once the frame's camera is posed and before the copy is placed. A layer's dz
   push / pull goes along the ridden view axis. Returns the moving hold. */
export function ride(V, layers, h, beta) {
  const { THREE } = V, bOf = typeof beta === 'function' ? beta : () => beta;
  const qkI = h.q.clone().invert(), cq = new THREE.Quaternion(), cp = new THREE.Vector3(), R = new THREE.Quaternion(), A = new THREE.Vector3();
  const MH = Object.create(h); MH.q = h.q.clone(); MH.fwd = h.fwd.clone();
  let b = 0, now = 0;
  MH.at = (x, y, d) => { const X = h.at(x, y, d); return b > 0 ? X.lerp(A.copy(X).sub(h.pos).applyQuaternion(R).add(cp), b) : X; };
  V.anim(t => { now = t; });
  const prev = V.scene.onBeforeRender;
  V.scene.onBeforeRender = function (r, sc, cam, ...rest) {
    if (prev) prev.call(this, r, sc, cam, ...rest);
    b = Math.min(1, Math.max(0, bOf(now)));
    if (b > 0) { cam.getWorldQuaternion(cq); cam.getWorldPosition(cp); R.copy(cq).multiply(qkI); MH.q.copy(h.q).slerp(cq, b); }   // (fixed to the camera, it would face as the camera does: cq)
    else MH.q.copy(h.q);
    MH.fwd.set(0, 0, -1).applyQuaternion(MH.q);
  };
  for (const o of layers) o.H = MH;
  return MH;
}
// beta(t) for ride(): bIn on the way in, easing to bOut across the key instant tk (± w s). The ride is zero at tk whatever
// beta is there, so the change of beta around tk can't be seen.
export const rideBeta = (tk, bIn, bOut, w = 0.3) => t => bIn + (bOut - bIn) * sm((t - tk + w) / (2 * w));

/* sphereFront(V, layers, [t0, t1]): decision 5a (user: "It would be fun to see the sphere pass in front for a transition if
   you find a way to make it work"). Over [t0, t1] each layer is cut away where the sphere's outline covers it, so the sphere
   reads as passing in front of the copy (the copy is HTML drawn over the WebGL canvas; the cut-out lets the sphere show
   through). The same method as G6's c25.js (kept here so G4's copy loads on its own): each render the camera's rays through
   the sphere's centre and its rim are cast onto the layer's plane (an ellipse in the layer's own px, feathered ~1 px), and
   the layer wears it as a CSS mask only while the two overlap. */
export function sphereFront(V, layers, [t0, t1]) {
  const { THREE } = V, Vec = THREE.Vector3;
  const C = new Vec(), S = new Vec(), P = new Vec(), N = new Vec(), Rt = new Vec(), Up = new Vec(), cr = new Vec(), cu = new Vec(), D = new Vec(), Q = new Vec(), X = new Vec();
  const cq = new THREE.Quaternion();
  let now = 0, ball = null;
  V.anim((t, b) => { now = t; ball = b; });
  const set = (el, v) => { if ((el.dataset.sf || '') !== v) { el.dataset.sf = v; el.style.maskImage = v; el.style.webkitMaskImage = v; } };
  const hit = (o, Y) => {                                            // the camera's ray through Y meets the layer's plane: its px from the layer's centre
    D.copy(Y).sub(C); const den = D.dot(N); if (den < 1e-6) return null;
    const lam = Q.copy(P).sub(C).dot(N) / den; if (lam <= 0) return null;
    Q.copy(C).addScaledVector(D, lam).sub(P);
    return [Q.dot(Rt) / o.k, -Q.dot(Up) / o.k];
  };
  const prev = V.scene.onBeforeRender;
  V.scene.onBeforeRender = function (r, sc, cam, ...rest) {
    if (prev) prev.call(this, r, sc, cam, ...rest);                   // (a ride registered before this has posed the layers' hold)
    const on = now >= t0 && now <= t1 && ball && !ball.h;
    if (on) {
      V.copyTL.time(Math.max(0, now), true);                           // (so the layers' dz is this moment's; renderCopy seeks it again, a no-op)
      cam.getWorldPosition(C); cam.getWorldQuaternion(cq); cr.set(1, 0, 0).applyQuaternion(cq); cu.set(0, 1, 0).applyQuaternion(cq); S.copy(ball.p);
    }
    for (const o of layers) {
      if (!on) { set(o.el, ''); continue; }
      const H = o.H; P.copy(H.at(o.at[0], o.at[1], o.depth)).addScaledVector(H.fwd, o.dz);
      N.copy(H.fwd); Rt.set(1, 0, 0).applyQuaternion(H.q); Up.set(0, 1, 0).applyQuaternion(H.q);
      const dist = S.distanceTo(C), rs = (ball.sc ?? 1) * (V.R || 1), rr = rs * dist / Math.sqrt(Math.max(1e-6, dist * dist - rs * rs));
      const c = hit(o, S), a = hit(o, X.copy(S).addScaledVector(cr, rr)), u = hit(o, X.copy(S).addScaledVector(cu, rr));
      if (!c || !a || !u) { set(o.el, ''); continue; }
      const rx = Math.hypot(a[0] - c[0], a[1] - c[1]), ry = Math.hypot(u[0] - c[0], u[1] - c[1]);
      const w = parseFloat(o.el.style.width) || 0, hh = parseFloat(o.el.style.height) || 0, x = c[0] + w / 2, y = c[1] + hh / 2;
      if (x + rx < 0 || x - rx > w || y + ry < 0 || y - ry > hh) { set(o.el, ''); continue; }
      const f = 100 / Math.max(4, rx);
      set(o.el, `radial-gradient(${rx.toFixed(1)}px ${ry.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px,#0000 ${(100 - f).toFixed(2)}%,#000 ${(100 + f).toFixed(2)}%)`);
    }
  };
}

/* ---------- a super line in mixed weights (v1's sup() with a <span class="l"> inside) ----------
   parts: [{ text, w: 'b' | 'l', L, W }] (each word group's ink left edge and width on the board), cy: the line's cap
   centre, ref: the part whose width sets the size (default 0; the face's own spacing), the others are tracked to their
   widths. One mask (v1's .line) and one span inside it that swipes, with each part absolutely placed on its board spot.
   host: a kit layer ({ el, ox, oy }). Returns the span that swipes. */
const WT = { b: 800, l: 300 }, CC = {}, MIX = [];
let cx = null, mixP = null;
const ink = (text, w, fs, ls) => {
  cx.font = `${WT[w]} ${fs}px "new-hero", "Open Sans", sans-serif`; cx.letterSpacing = `${ls}px`;
  const m = cx.measureText(text); return { l: m.actualBoundingBoxLeft, r: m.actualBoundingBoxRight };
};
function mixMetrics() {
  cx = document.createElement('canvas').getContext('2d');
  for (const w of ['b', 'l']) {                                      // where the cap centre sits in a line-height-1 box
    cx.font = `${WT[w]} 100px "new-hero"`; cx.letterSpacing = '0px';
    const m = cx.measureText('H'), base = (100 - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
    CC[w] = (base - m.actualBoundingBoxAscent / 2) / 100;
  }
}
function fitMix(M) {
  const { parts, cy, ref = 0 } = M.s, r = parts[ref];
  const m0 = ink(r.text, r.w, 100, 0), fs = 100 * r.W / (m0.l + m0.r);
  const P = parts.map((p, i) => {
    let ls = 0;
    const n = [...p.text].length;
    if (i !== ref && n > 1) { const m = ink(p.text, p.w, fs, 0); ls = (p.W - (m.l + m.r)) / (n - 1); }
    const m = ink(p.text, p.w, fs, ls);
    return { o: p.L + m.l, top: cy - CC[p.w] * fs, ls, R: p.L + p.W };
  });
  const x0 = Math.min(...P.map(p => p.o)), y0 = Math.min(...P.map(p => p.top)), x1 = Math.max(...P.map(p => p.R));
  Object.assign(M.d.style, { left: `${(x0 - M.host.ox).toFixed(2)}px`, top: `${(y0 - M.host.oy).toFixed(2)}px`, fontSize: `${fs.toFixed(2)}px` });
  Object.assign(M.sp.style, { width: `${(x1 - x0 + 0.1 * fs).toFixed(2)}px`, height: `${(fs + Math.max(...P.map(p => p.top)) - y0).toFixed(2)}px` });
  P.forEach((p, i) => Object.assign(M.kids[i].style, { left: `${(p.o - x0).toFixed(2)}px`, top: `${(p.top - y0).toFixed(2)}px`, letterSpacing: `${p.ls.toFixed(2)}px` }));
}
export function mixedLine(V, host, s) {
  if (!mixP) mixP = Promise.all([800, 300].map(w => document.fonts.load(`${w} 100px "new-hero"`))).then(() => { mixMetrics(); MIX.forEach(fitMix); });
  V.waitFor(mixP);
  const d = document.createElement('div'); d.className = 'txt line';                 // (index.html's .line: the mask's style)
  const sp = document.createElement('span'); sp.style.cssText = 'position:relative;vertical-align:top';
  const kids = s.parts.map(p => { const k = document.createElement('span'); k.className = p.w; k.style.cssText = 'position:absolute;white-space:nowrap'; k.textContent = p.text; sp.appendChild(k); return k; });
  d.appendChild(sp); host.el.appendChild(d);
  const M = { host, s, d, sp, kids }; MIX.push(M); if (cx) fitMix(M);
  return sp;
}

// The holding shape on boards 19 and 20: 600 × 302 with its top left at tl19 / tl20 (the fill's outer edge), and its text,
// which sits the same in the box on both boards (ink left dx and cap centre cy from the box's top left, ink width W)
export const MODE = { w: 600, h: 302, r: 84, tl19: [60, 76.5], tl20: [41.75, 102.75],
  lines: [{ text: '1L MODE:', w: 'l', dx: 66, cy: 102.3, W: 364 }, { text: 'ACTIVATED', w: 'b', dx: 64, cy: 198.5, W: 456 }] };

// marks a frame's layers (data-f = frame), for the dev probes
export const tag = (n, layers) => layers.forEach(o => { o.el.dataset.f = String(n); });
