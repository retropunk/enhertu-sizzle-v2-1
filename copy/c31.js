/* Copy · frame 31 (139.35 → 146.95 s, the end card): the ENHERTU logo lockup (symbol, wordmark, ® and the generic name
   fam-trastuzumab deruxtecan-nxki), the only copy on board 31. It is v1's placeholder picture (assets/copy/enhertu-logo.png:
   white, cut from board 31 with a luminance alpha until the real artwork arrives), at v1's place, 843 × 174 px with its
   top left at 538, 447.5 (within 1 px of the board's logo).
   · The reveal is v1's: the logo wipes on left to right behind the sphere as it rolls past (v1: a linear clip that ran with
     the sphere at 8.5 u/s). Here the front comes from the sphere itself. At every moment the sphere's trailing (left) edge,
     seen from the camera, is projected onto the logo's plane, and the logo shows up to just behind it, with a soft 50 px
     edge. So it stays tied to the sphere whatever the set's builder does to its route or timing, and it never covers
     the sphere (the copy layer draws over the WebGL sets). The front only moves right (a running max). If the sphere
     doesn't carry it all the way across by the hold, it finishes on its own, 0.3 s before the hold starts.
   · It drops into frame from above during the pull-back, and it materialises as it does (review): its opacity rises from 0
     while its top edge is still 0.6 of its on-screen height above the frame to 1 once it has cleared the top, so the first
     sliced, oversized fragments at the frame edge are faint instead of popping. The layer is hidden (and its picture not
     drawn) until then, so the browser never composites the huge projected box it has while the camera is still close.
   · 3D: the logo sits in hold 31's view just behind the sphere's path, measured from the sphere's route where it passes
     the logo. The sphere rolls in front of it, as the board story says, and the camera's pull-back out of the sphere shows
     it at its own depth against the set's shapes. The lockup stays one piece: it is a brand lockup, so no "lines in
     layers". There is no push in Z either, because the pull-back is frame 31's 3D moment.
   · The end: v1's end fade. The whole end card, logo included, fades to #12062e over the last 0.8 → 0.2 s of the piece
     (146.15 → 146.75 on screen, power1.out, as v1's #fade and its sound cue C145), then stays dark to 146.95. It is a dark
     card just in front of the logo, in hold 31's view, covering the frame with bleed. The camera is not still by then: the
     end card keeps a slow drift to the end (user, 21:50), so the card is 3000 × 1900 board px, 540 px of bleed at the
     sides and 410 at the top and bottom (was 2400 × 1500). At the drift measured in review (~15–18 px/s and a slow push)
     it covers the frame with ≥ ~420 px to spare, and a stronger drift or a slow pull-out would still stay inside it. It is
     timed in display time, the video's own clock (read back through the engine's time map), so the fade lands on v1's
     times whatever the map inside hold 31 does.
   Every time is read from hold 31, the G7 cut, the sphere's route and END. */
import { contentFor, watchPic } from './content.js';

export default V => {
  const { THREE, holds, copyLayer, anim, CUTS, END } = V;
  const h = holds[31], CUT = CUTS.G7;
  const W = 843, H = 174, AT = [538 + W / 2, 447.5 + H / 2];        // the lockup's box and its centre (board px)
  const F = 50;                                                      // the wipe's soft edge (logo px)
  const LAGR = 1.3;                                                  // the front trails the sphere's centre by 1.3 radii (its left edge + 0.3 r)
  const BEHIND = 1.2;                                                // the logo's plane: this far behind the sphere's centre (world units)
  const IN = 0.6;                                                    // materialise: opacity 0 → 1 as its top edge goes from 0.6 × its height above the frame to the frame's top
  const FADE = [END - 0.8, 0.6], FADE_COL = '#12062e';               // v1's end fade (display time): start, duration, colour

  const el = document.createElement('div');
  el.style.cssText = `width:${W}px;height:${H}px;visibility:hidden`;
  const img = new Image();
  // the logo (content/copy.json: frame 31 "logo"): a new one fits whole in the lockup's box (contain), centred or at its focus
  const P = contentFor(V, 31).pic('logo', { src: 'assets/copy/enhertu-logo.png', fit: 'contain' });
  img.src = P.src; img.alt = 'ENHERTU'; img.className = 'img'; watchPic(V, img, P);
  img.style.cssText = P.edited ? `display:none;width:${W}px;height:${H}px;object-fit:${P.fit};object-position:${P.focus}` : `display:none;width:${W}px;height:${H}px`;
  el.appendChild(img);
  V.waitFor(img.decode().catch(() => {}));                           // the first render waits for the picture
  const Lg = copyLayer(31, el, { at: AT, depth: 30 }).show(CUT, Infinity);   // (depth set below, from the sphere's route)

  // v1's end fade: a dark card just in front of the logo, 3000 × 1900 board px (the frame plus bleed for the end drift)
  // in hold 31's view
  const fd = document.createElement('div');
  fd.style.cssText = `width:3000px;height:1900px;background:${FADE_COL};opacity:0;visibility:hidden`;
  const Fd = copyLayer(31, fd, { at: [960, 540], depth: 29 }).show(CUT, Infinity);

  /* Set up on the first render at or after the cut (the sphere's route and the camera exist by then, via window.v2):
     1. the logo's depth: where the sphere's route passes the logo's centre in hold 31's view, plus BEHIND;
     2. the tables (authored time, 1/120 s), each made monotonic:
        · the front: the sphere's trailing edge projected from the camera onto the logo's plane, in logo px (0 = its left
          edge), finished by the hold if the sphere didn't;
        · the entry opacity, from the logo's top edge on screen, and 1 by 0.3 s before the hold at the latest;
     3. the end fade's start in authored time. */
  const DT = 1 / 120;
  let tab = null, opT = null, tF0 = Infinity, toA = null;
  const ss = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
  const cam = new THREE.PerspectiveCamera(40, 16 / 9, 0.05, 2000), C = new THREE.Vector3(), look = new THREE.Vector3(), rt = new THREE.Vector3(), vv = new THREE.Vector3();
  const prj = p => {                                                 // stage px of a world point, null if behind the camera
    vv.copy(p).applyMatrix4(cam.matrixWorldInverse);
    if (vv.z > -0.05) return null;
    vv.applyMatrix4(cam.projectionMatrix);
    return [(vv.x + 1) * 960, (1 - vv.y) * 540];
  };
  const setup = () => {
    const v2 = window.v2;
    if (!v2 || !v2.ballAt || !v2.camAt) return false;
    const bAt = t => new THREE.Vector3(...v2.ballAt(t));
    // 1. depth
    let best = null;
    for (let t = CUT; t <= h.t1; t += 1 / 60) {
      const r = bAt(t).sub(h.pos), dz = r.dot(h.fwd);
      if (dz < 2) continue;
      const px = 960 + r.dot(h.right) / (dz * h.tanV) * 540, py = 540 - r.dot(h.upv) / (dz * h.tanV) * 540;
      if (py < -200 || py > 1280) continue;
      const e = Math.abs(px - AT[0]);
      if (!best || e < best.e) best = { e, dz };
    }
    const dep = best && best.e < 400 ? best.dz + BEHIND : 30;
    Lg.depth = dep; Lg.k = dep * h.tanV / 540;
    Fd.depth = dep - 0.3; Fd.k = Fd.depth * h.tanV / 540;           // the fade card: just in front of the logo
    const P = h.at(AT[0], AT[1], dep), n = h.fwd, k = Lg.k;
    const cTL = P.clone().addScaledVector(h.right, -W / 2 * k).addScaledVector(h.upv, H / 2 * k),
      cTR = P.clone().addScaledVector(h.right, W / 2 * k).addScaledVector(h.upv, H / 2 * k),
      cBL = P.clone().addScaledVector(h.right, -W / 2 * k).addScaledVector(h.upv, -H / 2 * k);
    // 2. the tables
    const N = Math.ceil((END + 0.5 - CUT) / DT) + 1, fr = new Float32Array(N), op = new Float32Array(N);
    let m = -1e4, om = 0, tLast = CUT, xLast = -1e4, vLast = 0;
    for (let i = 0; i < N; i++) {
      const t = CUT + i * DT, b = bAt(t), v = v2.camAt(t);
      let x = -1e4, o = 0;
      if (v) {
        C.set(v[0], v[1], v[2]).addScaledVector(b, v[8]);            // the camera, as the engine poses it (pose() in v2.js)
        look.set(v[3], v[4], v[5]).addScaledVector(b, v[8]).lerp(b, v[6]);
        cam.position.copy(C); cam.up.set(0, 1, 0); cam.lookAt(look);
        if (v[9]) cam.rotateZ(v[9] * Math.PI / 180);
        if (cam.fov !== v[7]) { cam.fov = v[7]; cam.updateProjectionMatrix(); }
        cam.updateMatrixWorld();
        // the logo's top edge on screen → entry opacity (0 while its projection is still huge, over 3 frames wide, or off
        // the frame's sides: e.g. the sample at the cut itself, where the sphere is still at G6's end)
        const a = prj(cTL), c = prj(cTR), e = prj(cBL);
        if (a && c && e) {
          const wp = Math.hypot(c[0] - a[0], c[1] - a[1]), hp = e[1] - a[1], yT = Math.min(a[1], c[1]);
          if (wp < 3 * 1920 && hp > 1 && Math.max(a[0], c[0], e[0]) > 0 && Math.min(a[0], c[0], e[0]) < 1920) o = ss((yT + IN * hp) / (IN * hp));
        }
        // the front
        rt.setFromMatrixColumn(cam.matrixWorld, 0);
        const S = b.addScaledVector(rt, -LAGR), d = S.sub(C), dn = d.dot(n), pn = P.clone().sub(C).dot(n);
        if (pn > 0.6 && dn > 0.05) x = C.clone().addScaledVector(d, pn / dn).sub(P).dot(h.right) / k + W / 2;
      }
      if (x > m) { if (m > -1e3 && x - m > 1e-3) vLast = (x - m) / DT; m = x; tLast = t; xLast = x; }
      fr[i] = m;
      om = Math.max(om, o); op[i] = om;
    }
    // if the sphere hasn't carried the front across by 0.3 s before the hold, it finishes on its own at its last pace
    const tDone = h.t0 - 0.3, iDone = Math.min(N - 1, Math.round((tDone - CUT) / DT));
    if (fr[iDone] < W + F) {
      const x0 = Math.max(xLast, -F), t0 = Math.min(tLast, tDone - 0.4), sp = Math.max(vLast, (W + F - x0) / Math.max(0.4, tDone - t0));
      for (let i = 0; i < N; i++) { const t = CUT + i * DT; if (t > t0) fr[i] = Math.max(fr[i], x0 + sp * (t - t0)); }
    }
    for (let i = 0; i < N; i++) op[i] = Math.max(op[i], ss((CUT + i * DT - tDone + 0.3) / 0.3));   // fully in by tDone at the latest
    tab = fr; opT = op;
    // 3. the end fade, in display time (the engine's time map; identity unless the player's Edit mode retimes a hold)
    toA = typeof v2.toAuthored === 'function' ? v2.toAuthored : null;
    tF0 = toA ? toA(FADE[0]) : FADE[0];
    return true;
  };
  const sample = (A, t) => {
    const f = Math.min(A.length - 1.001, Math.max(0, (t - CUT) / DT)), i = Math.floor(f);
    return A[i] + (A[i + 1] - A[i]) * (f - i);
  };
  const dispOf = t => {                                              // display time of authored t (bisection on the monotone map)
    if (!toA) return t;
    let lo = t - 3, hi = t + 3;
    for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (toA(mid) < t) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  };

  let shown = null, shownOp = -1, shownFd = -1;
  anim(t => {
    if (t < CUT - 1e-6) return;
    if (!tab && !setup()) return;
    // the logo: wipe front and entry opacity
    const x = sample(tab, t), o = Math.round(sample(opT, t) * 1000) / 1000;
    const hide = x <= 0 || o <= 0;
    const mk = hide ? 'hidden' : x >= W + F ? 'none'
      : `linear-gradient(90deg,#000 ${(x - F).toFixed(1)}px,transparent ${x.toFixed(1)}px)`;
    if (mk !== shown) {
      el.style.visibility = hide ? 'hidden' : '';
      img.style.display = hide ? 'none' : 'block';
      if (!hide) { img.style.webkitMaskImage = mk; img.style.maskImage = mk; }
      shown = mk;
    }
    const ov = hide ? 0 : o;
    if (ov !== shownOp) { el.style.opacity = ov >= 1 ? '' : String(ov); shownOp = ov; }
    // v1's end fade (power1.out over FADE, display time)
    let f = 0;
    if (t >= tF0) { const u = Math.min(1, Math.max(0, (dispOf(t) - FADE[0]) / FADE[1])); f = Math.round((1 - (1 - u) * (1 - u)) * 1000) / 1000; }
    if (f !== shownFd) { fd.style.opacity = String(f); fd.style.visibility = f > 0 ? '' : 'hidden'; shownFd = f; }
  });
};
