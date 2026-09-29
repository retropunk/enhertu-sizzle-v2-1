/* Copy · frame 25 (115.95 → 121.15 s): 18+ MONTHS. / 4 MAJOR LAUNCHES. / XXX TEAM MEMBERS. at the top left.
   v1's wording, weights and move: each line is a big ExtraBold figure followed by a small Light phrase (v1: .57 em), and
   the lines swipe in one after another (clip + 60 px slide, 0.7 s power3.out). Sizes, tracking and places are fitted to
   board 25's lettering (measured at 1920 px): the figures' cap height 104 px, the phrases' 58 px, baselines 217 / 354 /
   492, left edges 133 / 132 / 129. 18+ wears the board's small plus (v1 set a full-size one).
   · Each line is one swipe (v1 swiped the figure and the phrase together in one line box): the two parts sit in one
     wrapper that clips open left to right and slides in, inside a mask whose left edge is the line's, as v1's .line.
   · 3D: one card well in front of the sphere (hold depth − 12; it was − 3: at the key instant it still covers the board's
     lettering exactly, since a layer is sized for its depth, but the crane up after the launch now gives it the parallax
     to leave the frame in about a second instead of crawling off the bottom edge for ~1.8 s: review, 2026-09-28; the
     build is unchanged, measured). Frame 25 is an ease-through now (hold 117.1–118.85,
     key 117.93): the camera pulls back out of the dark doorway, passes board 25's pose at the key at ~2 u/s drifting back
     and up, and cranes up after the launch. Through the build and the reading the card rides 75 % of the camera's
     movement (rideCam, below): at the key it is exactly on the board; before it, it hovers (a quarter of the parallax it
     would have in the world), so the lines open inside the frame (never more than ~2 px past its left edge) while the
     camera is still backing out; after it, its lag behind its place in the world is capped at 300 px (rideCam's cap), so
     it keeps its place while it is read as the crane up begins and the sphere fires up through it. Then the ride hands
     over to the world, slowly, from key + 0.6 to key + 2.9 (~118.5–120.8; HAND): it starts as the reading ends (the card
     is already moving ~360 px/s by 118.67) and ends as the card leaves the bottom, so the crane carries it off (from
     ~120.8 it is exactly where it was). Review, 2026-09-29: with a quicker hand-over (key + 1.05 → + 2.25) it caught up
     with its world place in ~1 s, running up to ~280 px/s faster than the set around it (the slide rideCam's cap exists
     to avoid; COPY RULE, "stays where it is in the world"); now the ~180 px catch-up closes at ≤ ~185 px/s (was ~335),
     the card is never more than ~170 px/s faster than its world place (was ~280) and never over ~625 px/s (was ~760);
     probed. (A smaller cap would make it gentler still but costs reading time: 260 px → 1.23 s, 220 px → 1.20 s. With
     the lag kept to the end its top line crawled along the bottom edge until ~121.45.)
   · Timing, all from hold 25 and the sphere: the swipes start at hold start − 0.35 (it was − 0.05; user, 2026-09-29,
     question A2: "add about ½ second where it's under ~1.3 s (e.g. 24, 25), borrowing time from the travel between frames
     so the piece stays 2:27": the lines build in the last of the pull-out, ~7 u/s and slowing), 0.12 s apart, all
     readable by ~hold start + 0.3. Reading time (all the words built and still, ≤ 350 px/s; probed): 1.27 s,
     117.40–118.67 (it was 0.63 s, 117.70–118.33, ended by the hand-over to the world right after the key).
   · No exit (user, 2026-09-28 00:30: no transition-outs; the camera move hides the copy). The pills fire the sphere
     straight up through the middle of the lines (it crosses MEMBERS. and LAUNCHES.), IN FRONT of them (sphereFront,
     below: decision 5a, "it would be fun to see the sphere pass in front for a transition"), so the shot reads as the
     plunger firing the ball up through the copy. The lines stay whole (to ~120.1), and the crane up after the sphere
     carries them down and out of the bottom of the frame (out by ~launch + 2.4 s,
     ~120.8, well before frame 27's copy at ~123.1); the layer is dropped at launch + 2.6, once it is out (probed to
     123.0: it never comes back). The launch is read from the finished sphere
     (the deep squash on the pills just before it first rises well clear of them after the key instant), so a retimed
     plunger carries the timing; if the sphere can't be read, the key instant + 0.47 (where g6.js fires it now).
   Also exports G6's copy helpers: rideCam (c16–c20 and c27–c30 import it; its optional lag cap is what lets copy stay
   and be carried off with the set) and sphereFront (c28, c30). */
import { kit, contentFor } from './c07.js';

/* ---------- G6's copy helpers ---------- */
/* rideCam(V, layers, h, beta, cap): the layers (laid out in hold h's view) ride part of the camera's movement, its turn as well
   as its travel, so on a camera that never stops the copy hovers near its board place instead of sweeping across the
   frame. At h.tk the camera passes hold h's exact pose, so there every layer sits exactly on its board place whatever beta
   is; at any other moment each layer is moved beta(t) of the way (position lerp, facing slerp) from its place in the world
   toward where it would be had it been fixed to the camera since h.tk. beta 0 = in the world (full parallax), 1 = fixed
   on the screen; a number, or a function of the authored time. The live camera is read in the scene's onBeforeRender
   (as c11.js does), which runs once the frame's camera is posed and before the copy is placed. Returns the moving hold.
   cap (optional, for copy that STAYS, the COPY RULE "no transition-outs"; as c21.js's hover): after the key instant the
   layers' lag behind their place in the world (b × the ride − world offset) is softly capped (tanh) at `cap` px on
   screen, measured at each layer's distance from the camera now (so a push-in doesn't inflate it on screen); one factor
   for all the layers, set by the one that lags most, so they stay together. As the camera speeds up away from the board
   the copy stops lagging further and moves with the set, at the set's own speed and parallax (never faster: letting a
   plain ride go makes it catch up at 1.4–1.9× the set's speed, a slide-off), so it keeps its place on screen through
   the slow window and then the camera's move carries it off, whole. Without cap (or 0): exactly as before. The lag is
   measured on the live camera, like the ride. */
export function rideCam(V, layers, h, beta, cap = 0) {
  const { THREE } = V, bOf = typeof beta === 'function' ? beta : () => beta;
  const qkI = h.q.clone().invert(), cq = new THREE.Quaternion(), cp = new THREE.Vector3(), R = new THREE.Quaternion(), A = new THREE.Vector3(), W = new THREE.Vector3(), F = new THREE.Vector3();
  const MH = Object.create(h); MH.q = h.q.clone(); MH.fwd = h.fwd.clone();
  let b = 0, now = 0;
  // where the layer would be carried by the camera since h.tk: R (X − hold camera) + camera now; then lerp by b
  MH.at = (x, y, d) => { const X = h.at(x, y, d); return b > 0 ? X.lerp(A.copy(X).sub(h.pos).applyQuaternion(R).add(cp), b) : X; };
  V.anim(t => { now = t; });
  const prev = V.scene.onBeforeRender;
  V.scene.onBeforeRender = function (r, sc, cam, ...rest) {
    if (prev) prev.call(this, r, sc, cam, ...rest);
    b = Math.min(1, Math.max(0, bOf(now)));
    if (b > 0) {
      cam.getWorldQuaternion(cq); cam.getWorldPosition(cp); R.copy(cq).multiply(qkI);
      if (cap > 0 && now > h.tk) {                                   // the lag behind the world, softly capped (see above)
        let f = 1;
        F.set(0, 0, -1).applyQuaternion(cq);
        for (const o of layers) {
          const X = h.at(o.at[0], o.at[1], o.depth), m = b * W.copy(X).sub(h.pos).applyQuaternion(R).add(cp).distanceTo(X);
          const Lw = cap * o.k * Math.min(3, Math.max(0.05, W.copy(X).sub(cp).dot(F) / o.depth));   // cap px on screen at its distance now
          if (m > 1e-9) f = Math.min(f, Lw * Math.tanh(m / Lw) / m);
        }
        b *= f;
      }
      MH.q.copy(h.q).slerp(cq, b);
    }
    else MH.q.copy(h.q);
    MH.fwd.set(0, 0, -1).applyQuaternion(MH.q);
  };
  for (const o of layers) o.H = MH;
  return MH;
}

/* sphereFront(V, layers, [t0, t1]): decision 5a (user: "it would be fun to see the sphere pass in front for a transition").
   Over [t0, t1] each layer's copy is cut away where the sphere's outline covers it, so the sphere reads as passing in front
   of the copy (the copy is HTML drawn over the WebGL canvas; the cut-out lets the sphere show through). The outline is
   found each render by casting the camera's rays through the sphere's centre and its rim onto the layer's plane (an
   ellipse in the layer's own px, feathered ~1 px); the layer wears it as a CSS mask only while the two overlap. */
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
    if (prev) prev.call(this, r, sc, cam, ...rest);
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

// board 25's lettering (stage px): per line the figure (ExtraBold) and the phrase (Light), each by its ink left edge L
// and ink width W; every line shares the baseline `base`; the figures' cap height is CAP_B, the phrases' CAP_L. 18+ has
// the board's small plus (as board 8's 90+): 53 px wide, its ink centred on y 183.5, 11 px after the 8's ink; it is its
// own fitted line (c07's number places its baseline by a DOM measurement that came out 0 or 3 px low from run to run).
const CAP_B = 104, CAP_L = 58;
const LINES = [
  { base: 217, bold: [{ text: '18', L: 133, W: 149 }, { text: '+', L: 293, W: 53, cy: 183.5 }], l: { text: 'MONTHS.', L: 374, W: 366 } },
  { base: 354, bold: [{ text: '4', L: 132, W: 88, lsEm: 0 }], l: { text: 'MAJOR LAUNCHES.', L: 249, W: 736 } },
  { base: 492, bold: [{ text: 'XXX', L: 129, W: 304 }], l: { text: 'TEAM MEMBERS.', L: 455, W: 645 } },
];
const FIRE_AFTER_KEY = 0.47;                                         // (the fallback: g6.js fires the plunger 0.47 s after the key now)
const RIDE = 0.75;                                                   // how much of the camera's movement the card rides
const CAP = 300;                                                     // after the key: its lag behind its place in the world, capped (px)
const HAND = [0.6, 2.9];                                            // then the ride hands over to the world over key + these (s)
const LEAD = 0.35;                                                   // the swipes start this long before hold start
const GONE = 2.6;                                                    // the layer is dropped this long after the launch (out of frame by ~2.4)

// the plunger's launch time (see the header), or null
const launchOf = h => new Promise(res => {
  const t00 = performance.now();
  const poll = () => {
    const v = window.v2;
    if (v && v.ballAt) {
      try {
        const y0 = h.mark.y; let tc = null;
        for (let t = h.tk; t < h.t1 + 2.5; t += 0.01) if (v.ballAt(t)[1] > y0 + 1.5) { tc = t; break; }
        if (tc == null) return res(null);
        let tm = tc, ym = Infinity;
        for (let t = tc; t > Math.max(h.tk, tc - 0.5); t -= 0.005) { const y = v.ballAt(t)[1]; if (y < ym) { ym = y; tm = t; } }
        return res(tm);
      } catch (e) { return res(null); }
    }
    if (performance.now() - t00 > 4000) return res(null);
    setTimeout(poll, 20);
  };
  poll();
});

export default V => {
  const { holds, copyTL } = V;
  const h = holds[25];
  if (!h) throw new Error('c25: frame 25 needs a hold');
  const K = kit(V), TX = contentFor(V, 25);                          // (TX: frame 25's words from content/copy.json)
  const D = h.depth - 12;                                            // well in front of the sphere and the pills (see the header)

  // the card: a box round the three lines (stage px)
  const box = [90, 70, 1070, 460];
  const card = K.layer(25, box, D);
  // the ride hands over to the world after the key (where the two agree: the camera is on the board's pose), so the lines
  // hover while they build and are read, then stay in the world for the crane to carry off
  const ss = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
  rideCam(V, [card], h, t => RIDE * (1 - ss((t - h.tk - HAND[0]) / (HAND[1] - HAND[0]))), CAP);

  // each line: mask (v1's .line: clips on the left) > wrapper (what swipes) > the figure and the phrase (fitted lines).
  // An edited line (content/copy.json) is laid out by statLine(), below; its mask runs to the card's right edge
  const MAXR = box[0] + box[2] - 10;
  const wraps = LINES.map((Ln, li) => {
    const r = TX.line('lines', li, `**${Ln.bold.map(b => b.text).join('')}** ${Ln.l.text}`);
    const x0 = Ln.bold[0].L - 18, y0 = Ln.base - CAP_B - 40, x1 = r.edited ? MAXR + 30 : Ln.l.L + Ln.l.W + 30, y1 = Ln.base + 40;
    const mask = document.createElement('div');
    mask.style.cssText = `position:absolute;left:${x0 - box[0]}px;top:${y0 - box[1]}px;width:${x1 - x0}px;height:${y1 - y0}px;overflow:hidden`;
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%';
    mask.appendChild(wrap); card.el.appendChild(mask);
    const host = { el: wrap, ox: x0, oy: y0 };
    // (each mask wears its text's weight, so the mask's strut is the same face as its text and the line sits exactly on
    // its fitted place; with the page's default weight the big bold lines sat ~2.5 px low)
    const fit = s => { const sp = K.line(host, s); sp.parentElement.style.fontWeight = s.w === 'b' ? 800 : 300; return sp; };
    if (r.edited) { statLine(Ln, r.runs, fit, r.entry); return wrap; }
    for (const b of Ln.bold) fit(b.cy != null ? { ...b, w: 'b' } : { ...b, w: 'b', cy: Ln.base - CAP_B / 2, H: CAP_B });
    fit({ ...Ln.l, w: 'l', cy: Ln.base - CAP_L / 2, H: CAP_L });
    return wrap;
  });
  /* An edited stat line: its runs left to right on the line's baseline from the figure's left edge: the leading bold run
     (the figure) at the figures' cap height, everything after it at the phrases' (bold words there stay phrase-sized), in
     New Hero's own spacing; a figure ending in + gets the board's small plus (as 18+). The gaps are the board's: figure →
     phrase as this line's, the plus 11 px after its figure. If the line would run past the card's right edge it all
     shrinks together (the baseline stays). */
  function statLine(Ln, runs, fit, entry) {
    const G = Ln.l.L - Math.max(...Ln.bold.map(b => b.L + b.W)), PG = 11, x0 = Ln.bold[0].L;
    const pcs = [];
    for (const u of runs) {
      const t = u.text.trim(); if (!t) continue;
      const fig = !pcs.some(p => !p.fig) && u.w === 'b';              // (still in the leading figure)
      if (fig && t.length > 1 && t.endsWith('+')) pcs.push({ text: t.slice(0, -1).trim(), w: 'b', fig }, { text: '+', w: 'b', fig, plus: true });
      else pcs.push({ text: t, w: u.w, fig });
    }
    if (!pcs.length) return;
    const capOf = p => (p.fig ? CAP_B : CAP_L);
    const sps = pcs.map(p => fit(p.plus ? { text: '+', w: 'b', L: x0, cy: Ln.base - 33.5, W: 53 } : { text: p.text, w: p.w, L: x0, cy: Ln.base - capOf(p) / 2, H: capOf(p), lsEm: 0 }));
    const lay = k => {
      let x = x0;
      pcs.forEach((p, i) => {
        const s = sps[i].ln.s;
        if (i) x += k * (p.plus ? PG : pcs[i - 1].fig !== p.fig ? G : 0.3 * CAP_L);
        s.L = x;
        if (p.plus) { s.W = 53 * k; s.cy = Ln.base - 33.5 * k; } else { const H = capOf(p) * k; s.H = H; s.cy = Ln.base - H / 2; }
        K.refit(sps[i]); x = sps[i].ln.inkR;
      });
      return x;
    };
    V.waitFor(K.ready.then(() => {
      const R = lay(1), k = R > MAXR ? (MAXR - x0) / (R - x0) : 1;
      if (R > MAXR) lay(k);
      if (entry) entry.k = k;                                        // (its size factor, for the report: content.js's noteFit)
    }));
  }

  // in: as the camera finishes backing out of the doorway and slows onto the board
  const T = h.t0 - LEAD;
  K.swipe(wraps, T, 0.12);

  // no exit (user, 00:30): the lines stay in the world and the crane carries them down out of the frame; the sphere fires
  // up through them, in front (sphereFront from the launch; the launch is read once the sphere exists, the first render
  // waits for it). The layer is dropped once it is below the frame
  V.waitFor(launchOf(h).then(L => {
    const F = L ?? h.tk + FIRE_AFTER_KEY;
    card.show(T - 0.1, F + GONE);
    sphereFront(V, [card], [F - 0.05, F + GONE]);                    // the ball shoots up through the lines, in front of them
  }));
};
