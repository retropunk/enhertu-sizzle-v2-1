/* G7 · frame 31 (139.35 → 146.95): the end card.
   Starts inside the sphere's gradient (the hidden cut: frame 30's camera zoomed all the way into it). The camera pulls
   back out, fast at first then settling, while the sphere rolls on left to right along the band at a steady 8.5 u/s and
   board 31's set builds in behind it (the shapes split apart: each one glides out from nearer the centre and from further
   back into its board place, left side first; the arch rises into place before the sphere reaches it). The sphere rolls
   behind the arch's leg, out through the arch and off to the right, and the camera's pull-back eases into a very slow drift
   on the end card (user, 21:50, "slow drift to the end": nothing is ever fully still): a slow pull-out (≈ 2 % a second) with a
   sideways truck, passing board 31's exact framing at the key instant 144.95 and carrying on to the end, while the copy
   layer fades it to dark over 146.15 → 146.75 as v1 did. Plain sphere (no symbol), as everywhere.
   The trick that keeps the sphere ON the band: the camera always ends level with the band's top edge, so that edge lies on
   the camera's horizon (the band's top face is edge-on, as on the board) and the sphere's bottom touches it. The hold
   camera is tilted up ~7.4° so the horizon falls on the board's band line (y 845 px).
   THE SET (batch: G7) is real 3D, no board picture: every board-31 shape is a piece laid out in the hold's view at its own
   depth (the band the sphere rolls on; the ∩ arch in front of the sphere's path, so the sphere passes behind its leg and
   out through its window, where the band carries on as the yellow-orange block; the B with its two recessed slots, the
   top-left block, the three quarter-disc tabs and the hanging pill behind; a backdrop plane far back). Each piece is flat
   at the hold (its sides lie along the hold camera's rays) and shows chunky sides and parallax while the camera moves.
   Colours: each piece carries a board-coloured field measured from board 31 (points sampled inside that shape, blended
   smoothly: no hard bands), riding with the shape, with a gentle living slide that is exactly zero at the key instant.
   The ENHERTU logo is NOT part of the set: the copy layer (copy/c31.js) reveals it with a wipe trailing the sphere; its area
   shows the board's background behind it. The sphere's route and timing are unchanged (the porter trails it). */
export default V => {
  const { THREE, hold, key, seg, line, note, anim, o, END } = V;

  /* ---- the end-card camera: frontal, long lens, level with the band's top edge ---- */
  const FOV = 26, tanV = Math.tan(FOV * Math.PI / 360);
  const BAND = 845;                                             // board px: the band's top edge (the rolling surface)
  const th = Math.atan((BAND - 540) / 540 * tanV);              // tilt up so the horizon lands on the band line
  const fwd = new THREE.Vector3(0, Math.sin(th), -Math.cos(th));
  const HC = o(0, 0, 0);                                        // hold camera; y = 0 is the band's top edge
  const DB = 100;                                               // sphere size at the hold framing (px) while it rolls through
  const D = 1080 / (DB * tanV);                                 // its depth from the hold camera
  const ZB = (Math.sin(th) - D) / Math.cos(th);                 // z of the sphere's path (centre height 1 = sits on the band)
  const PD = D + 1.3;                                           // the reference plane for the camera's framing (was the plate's)
  const PX = 540 / (D * tanV);                                  // board px per world unit at the sphere's depth (= DB / 2)
  const xOfPx = px => (px - 960) / PX;

  // A drift-through (user, 21:50: never stop): the camera passes the end card's exact framing at the key instant 144.95
  // (mid-window) and keeps drifting; 143.0–146.9 is the slow window (the logo copy finishes its wipe by its start − 0.3).
  // The window ends just short of END: a hold ending exactly at END collides with the engine's END time-map knot (review:
  // the key read 143.99, the gradients ran fast then froze in the last half-second, and the probes crashed at 146.95).
  const h = hold(31, { pass: true, t: [143.0, 146.9], tk: 144.95, pos: HC, look: HC.clone().addScaledVector(fwd, 20), fov: FOV, plate: false });

  /* ---- the sphere: rolls left to right along the band at a steady 8.5 u/s; fully off the right edge at TE ---- */
  const VS = 8.5, TE = 142.5, PXE = 1920 + DB / 2 + 2;
  const ballPx = t => PXE - VS * PX * (TE - t);                 // where it is on the board (hold framing)
  const at = t => o(xOfPx(ballPx(t)), 1, ZB);
  seg(139.35, 147.3, 'none', line(at(139.35), at(147.3)));

  /* ---- camera: out of the sphere (contract key), then one smooth pull-back that settles into a very slow drift on the
     end card, never still (user, 21:50). Written as curves and laid down as keys every 1/60 s, so speed and turn change
     smoothly (no kinks, no sway):
       distance: the pull-back, fast early with a long settle, easing into a continuing slow pull-out (VP u/s, ≈ 2 % a
                 second) that passes the end card's framing exactly at the key instant and carries on to the end. The depth
                 motion never reverses: (review, 2026-09-28: the old pull-back came to rest and turned into a push around
                 142.7, leaving only a 0.3 u/s truck, a 15 px/s drift that read as landing and stopping)
       sideways: starts at the sphere's speed (the contract key rides with it) and decelerates smoothly, not to rest but to
                 a slow drift right (VD0 u/s, on the sphere's way), which then gathers to VD0 + VDX over 141.8–143.4 as the
                 pull-back settles; it passes the end card's framing at the key instant. Together they keep the card
                 visibly breathing to the fade (~30–40 px/s on screen; the camera never below ~1 u/s)
       height:   eases down from just above the sphere to the band's top edge (then the sphere sits exactly on the band);
                 push and drift are level, so the band's top edge stays on the horizon (edge-on, as on the board)
       aim:      at the sphere, blending to the end card's centre, then (140.9–142.1) to the end card's own view direction,
                 so the drift is a true truck: the card slides a few px a second with parallax between the arch, the B and the
                 backdrop (aimed at the card's centre, the drift was an orbit that left the card's plane still on screen) */
  const T0 = 139.35, T1 = 143.0, TK = h.tk, X0 = xOfPx(ballPx(T0));
  const ease = u => 1 - Math.pow(1 - u, 3.5) * (1 + 3.5 * u);                // 0 → 1, zero speed at both ends, peak at u ≈ 0.22
  const sm = (a, b, x) => { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x); };
  const VD0 = 0.35, VDX = 0.25, VP = 1.0, SA = 141.8, SB = 143.4;             // the drift: sideways (base, extra), pull-out, the extra's ramp-in
  const IP = t => { if (t <= SA) return 0; if (t >= SB) return (SB - SA) / 2 + (t - SB); const u = (t - SA) / (SB - SA); return (SB - SA) * (u * u * u - u * u * u * u / 2); };   // ∫ smoothstep ramp
  const TL = 3 * (-X0 - VD0 * (TK - T0) - VDX * IP(TK)) / (VS - VD0);         // sideways settle time (sphere's speed → VD0)
  const xAt = tau => X0 + VD0 * tau + (VS - VD0) * TL / 3 * (1 - Math.pow(1 - Math.min(1, tau / TL), 3)) + VDX * IP(T0 + tau);   // x(TK) = 0
  // depth: the pull-back ease (from rest at ZS' to rest at the end card) plus a steady pull-out VP, offset so the camera starts
  // at ZS (the contract) and is at the end card (z 0) exactly at TK; its speed is the ease's plus VP, never zero, never reversing
  const ZS = ZB + 1.45, ZS1 = ZS + VP * (TK - T0);
  const camAt = t => {
    const tau = t - T0, e = ease(Math.min(1, tau / (T1 - T0)));
    return { pos: o(xAt(tau), 1.3 * (1 - sm(0, 0.9, tau)), ZS1 * (1 - e) + VP * (t - TK)), fov: 40 - (40 - FOV) * e };
  };
  // the aim is a point on the framing plane (board px): the sphere at first, blending to the board centre; softly kept far
  // enough from the board's edges that the view never runs off the set
  const P0 = HC.clone().addScaledVector(fwd, PD), UP = new THREE.Vector3(0, Math.cos(th), Math.sin(th)), WUP = new THREE.Vector3(0, 1, 0);
  const pxw0 = 2 * PD * tanV / 1080;                                          // framing-plane world units per board px
  const onPlate = (pos, ray) => { const k = P0.clone().sub(pos).dot(fwd) / ray.dot(fwd), p = pos.clone().addScaledVector(ray, k).sub(P0); return [960 + p.x / pxw0, 540 - p.dot(UP) / pxw0]; };
  const plateAt = (px, py) => P0.clone().addScaledVector(new THREE.Vector3(1, 0, 0), (px - 960) * pxw0).addScaledVector(UP, (540 - py) * pxw0);
  const soft = (x, k = 25) => x > k ? x : x > -k ? (x + k) * (x + k) / (4 * k) : 0;   // a smooth ramp: 0 below −k, x above k
  const corners = (pos, target, fov) => {
    const f = target.clone().sub(pos).normalize(), r = f.clone().cross(WUP).normalize(), u = r.clone().cross(f), tv = Math.tan(fov * Math.PI / 360);
    return [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => onPlate(pos, f.clone().addScaledVector(r, sx * tv * 16 / 9).addScaledVector(u, sy * tv)));
  };
  key(T0, [0, 0.3, 1.45], [0, 0, 0], { pf: 1, f: 1, fov: 40 });              // contract: inside the sphere's gradient
  // Keys every 1/60 s, written RELATIVE to the sphere while the camera is close (pf 1: the engine adds the sphere's position),
  // so the sphere stays exactly where the curves put it on screen; pf then hands over smoothly to world keys (1 → 0 over
  // 139.9–140.4, a C2 ease) so no key ever mixes the two frames. (Review: 0.1 s world keys next to the sphere-relative
  // contract key swung the sphere ~90 / 160 / 70 px sideways over 139.36–139.55.)
  const KDT = 1 / 60, q5 = x => { x = Math.min(1, Math.max(0, x)); return x * x * x * (10 + x * (6 * x - 15)); };
  const PF = t => 1 - q5((t - 139.9) / 0.5);
  for (let i = 1; T0 + i * KDT < END + 0.1; i++) {                           // past the end (no last still key, no edge at END)
    const t = T0 + i * KDT; if (Math.abs(t - TK) < 0.004) continue;            // (the drift-through's own key is at TK)
    const c = camAt(t), g = sm(139.55, 141.9, t);                              // aim: the sphere → the board centre
    const [bx, by] = onPlate(c.pos, at(t).sub(c.pos));
    let cx = bx + (960 - bx) * g, cy = by + (540 - by) * g;
    for (let it = 0; it < 6; it++) {
      const cs = corners(c.pos, plateAt(cx, cy), c.fov), M = 14;
      const xs = cs.map(q => q[0]), ys = cs.map(q => q[1]);
      cx += soft(M - Math.min(...xs)) - soft(Math.max(...xs) - (1920 - M));
      cy += soft(M - Math.min(...ys)) - soft(Math.max(...ys) - (1080 - M));
    }
    const w = PF(t), sb = at(t).multiplyScalar(w);                            // the part the engine adds back (pf · sphere)
    // the view direction: at the aim, blending to the end card's own direction for the drift; the look point sits 20 units
    // out along it (as the drift-through's own key at TK), so the engine's per-component Hermite through the keys never
    // swings the look point between two distances
    const dir = plateAt(cx, cy).sub(c.pos).normalize().lerp(fwd, sm(140.9, 142.1, t)).normalize();
    const lk = c.pos.clone().addScaledVector(dir, 20);
    key(t, c.pos.clone().sub(sb), lk.sub(sb), { pf: w, fov: c.fov });
  }

  // (the sphere's rotation: the engine now keeps its quaternion normalised (the squashed-sphere bug is fixed in v2.js), so
  // G7's own renormalising anim was a no-op and is gone)

  /* ================= THE SET: board 31's shapes as real 3D pieces ================= */
  /* Board-coloured fields, measured from board 31: per shape, a coarse grid of the board's colours [x0, y0 (board px of
     grid point 0,0), spacing px, nx, ny, RGB bytes (base64)]. Sampled inside the shape where the board shows it (edges
     eroded), smoothly extended past its edges and behind whatever covers it; the background leaves out the logo's glyphs
     (filled from around them). Read back with a cubic B-spline, so every field is smooth: no hard bands. */
  const F = {
    arch: [1468, 238, 32, 16, 28, 'cxbschbtchXtchXuchXucRXucRXvcRXvcRTvcRTvcBTwcBTwcBTwcBTwcBTwcBTwcxbrcxbscxbschbtchXtchXtchXucRXucBTwcBTxbxPybxPybxPycBTxcBTwcBTwdBfqdBfqcxbrcxbrcxbschbscRXucBTxbxPycBPybxPybxPybxPybxPybxPybxPydRjodRfpdBfqdBfqcxbrcRXvbxPybxPybxPybxPybxPybxPybxPybxPybxPybxPydhjndhjndRjodRfpcRXubxTybxPybxPybxPybxPybxPybxPybxPybxPybxPybxPydxnldxnldhnmcxbrcBTybxPybxPybxPybxPybxPybxPybxPybxPybxPybxPybxPyeBrjeBrjdhjncBTwbxPybxPybxPybxPybxPybxPybxPybxPybxPybxPybxPybxPyehzgeRvhdBfpcBTwbxPxbxPxbxPxbxPxbxPxbxPxbxPxbxPxbxPxbxPycBTxcBTxfB3deRvhdRfpchXtchXscxXtcxbtcxbtchbtchbtchbschbscxbscxbschXtchXtfh7aehzhdhnmdhnndhnndhnndhnndhnndhjmdhjmdhnmdhjndBfpdBfpdRjndRjnfyDYex3fehvieRvieRvheRvhehvhehvieRvheRzheBvkdhjndRjoeBrkeBrkeBrkgSHVfh/bfR7cfR7cfR7cfR7bfR7bfR7bfR7bfR7behzgeRviexzfehzgehvgehvggyPRgSHVgCHWgCHWgCHWgSHWgSHWgCHWgCHWgCHXfh/afh/afh/afR7bfB3cfB3chiXNhCTPhCPPhSTQhSTQhSTQhSTQhCPQhCTPgyTQgiLTgSHUgSHVgCDXfyDYfyDYiCfIhyfJiCbKhybJhybJhybJiCbKiCbKiCfKhyfKhiXMhSTPhCPQgyPSgiLTgiLTiynEiynEiynEiynEiynEiynEiynEiynEiynEiyrEiijHiCbKhybLhiXMhiXNhiXNjyy+jiy+jyy+jyy+jyy+jyy/jyu/jyu/jyy+jiy+jSvBiynEiynFiijGiSjHiSjHki65ki+5ky+5ky65ky+5ki+5ki+5ki+5ky+5ki+5kS27jyy/jiu/jivAjSvBjSvBlTG0ljK0ljG0ljG0lTG0lTGzlTGzlTGzljGzlTKzlDC2ki65kS66kS67kS27kS27mDOvmTStmTSumTStmTStmTStmTStmTStmTSumTSulzOwlTG0lTC1lDC1lDC2lDC2mzaqnTeonTeonTeonTeonTeonTeonTennTennDeomjWrmDOwlzOwlzOwlzKxlzKxnjiloDmioDmioDmioDmioDmioDmjoDmjoDmjoDminTenmjWsmjWsmjWsmjWsmjWsoDqhpDycpDycpDycpDycozydpDydpDydpDydozydoDmjnDeonDeonDaonDapnDapojuepz+Wpz+Xpz+Xpz+Wpz+Xpz+Xpz+Xpz+Xpz+XoTugnjilnjilnjilnjilnjilozydqkGRqkGRqkKRqkKRqkKSqkKSqkKSq0KSqkGTojufoDqioDmioDmioDmioDmiojufq0KQrkSMrkSMrUSMrkSMrkSMrkSMrkWMqkGTojufojugojugojugojugojugozydpj6YrkWLr0aJr0aJr0aJr0aJr0aJrkWMpT2aozyeozyeozyeozyeozyeozyeozydpT2arUWKr0aJr0aJrkaJrkaJr0aJrUWMpD2cozydozydozydozydozydozyd'],
    band: [451, 813, 32, 48, 11, 'siWJsyaGtSeEtimBuCp+uix6vC53vjBzwDJuwjRqxTZmyDhhyzxazz9T00NM10hE3E084FE05VYs6Vsk7WAd8WUX9GoR924N+XMJ+3cG/HsF/X8D/YMD/YUC/ocC/ocC/ocC/ooC/owB/pAB/pMB/5cB/5oB/50B/6AB/6IB/6MB/6QB/6QB/6QB/6QB/6QBsiWKsyaHtCeFtiiCtyp/uSt7uy15uy14vS11wC9wwzJqxjZjyjpczz5U00NL2EhD3Uw64lEx51Yo7Fsg8GEZ9GYS92sM+nAG/HUD/XkB/n4B/oIB/oYB/ooB/o0B/pAB/o8B/ooC/owB/o8B/pMB/5cB/5oB/50B/6AB/6IB/qUB/6YB/6YC/qYC/6UB/6UBsSSKsiWItCaGtSiDtymAtiiCtieCuCl+vCx5vy5ywjFrxjVkyjldzz5U00JL10hD3Uw64VEx5lco61wg8GEY9GYR92sL+nAG/XUC/nkB/34B/4IB/4cB/4oA/40B/5AB/5MB/5AB/owB/o8B/pMB/5cB/5oB/50B/6AB/qQB/qUA/qYA/6YA/6YB/6YB/6YBsSSLsiWJsyaHtCeFsSSLsiOLsyaGtyeAuip7vi10wTFtxTVmyTlfzj1W00JN10dE3Ew74VEy5lYp61sh72EZ82YS92oM+m8H/XQD/nkB/30A/4IB/4YA/4oA/40B/48B/5MB/5IB/o0B/o8B/pMB/5cB/5oB/50B/6EB/6QB/6UA/qUA/6YA/6YB/6YB/6YBsCOMsSSKsyaIriKQrSCTryGPsiSJtSaEuCl+vCx4vzBwwzRpxzhhzDxY0UFQ1kZG20s+4FA15FUs6Vsj7mAb8mUU9moN+XAI/HQE/nkB/n0A/4EA/4YB/4kA/40A/48B/5MB/5IB/o0B/o8B/pMB/5YB/5oB/50B/6IB/6QB/6QB/qUA/qUA/qYB/qUB/qUBsCONsSSLryOOqR2aqx6YrSCTsCKOsiWItSiCuSt8vS91wjNtxTdlyjxcz0BT1EVK2UtA3VA341Uu51ol7GAd8WUV9WoP+G8J+nQF/XkC/n0B/oEB/4UB/4kA/4wA/48B/5IA/5EB/o0B/o8B/pMB/5YB/5oB/50B/6EA/6MA/6MA/6QB/qUA/qUB/qUB/qUBryOOsCSMqh6YphufqBycqh6XrSGSsCONsyaHtiqAuy15vzFxwzZpxzpgzD9X0URO10pE3E874FQx5lko6l8g7mQY82kR928L+nMG/HgD/XwB/oAA/4UA/4gA/4sA/44B/5EB/5EB/owB/o8B/pMB/5YB/5oB/50B/6EA/6IA/6MA/6MA/6QB/6QC/6QB/6QBryKPsCONoxiloxilpRqgpxycqh+XrSKSsCWMtCiFtyx+vDB2wDRuxDllyT5cz0NT1EhJ2U4/3lM141ks6V4j7GMb8WkT9G4M+HMI+ncE/HwB/n8A/oQB/4gA/4sA/44B/5AA/44B/owB/o8B/pMB/5YB/5oB/50B/6AB/6IA/6IA/6MA/6MA/6MB/6QB/6QBriKPryKPpRugohmloxqjphyfqB6bqyGWrySPsiiJtiyCujB6vjRwwzloyD1fzUNW0khL101B3VM34lgt5l4k62Mc72gV824O93MI+XcF/HwC/YAA/oQB/4cB/4sB/o4B/44B/ooC/owB/o8B/pIB/5YB/5oB/50B/58B/6EB/6IA/6IA/6IA/6MB/6QB/6QBriKPryOOpx2cohmloxqjphyfqB6bqyGVriSQsiiJtiuCujB6vjRwwzlnyD5ezUNV0khL101C3VM34lks5l4j62Mb72gV9G0O93II+ncE/HsC/YAA/oQB/4cB/4sB/o4B/44B/okC/owB/o8B/pIB/5YB/5oB/50B/58B/6EA/6IA/6IA/6MA/6MA/6QB/6QBriKPryOOpx2cohmloxqjphyfqB6bqyGVriSQsiiJtiuCujB6vjRwwzlnyD5ezUNV0khL101C3VM34lks5l4j62Mb72gV9G0O93II+ncE/HsC/YAA/oQB/4cB/4sB/o4B/44B/okC/owB/o8B/pIB/5YB/5oB/50B/58B/6EA/6IA/6IA/6MA/6MA/6QB/6QB'],
    lobe: [-15, 253, 24, 19, 17, 'tFBotE9osk1qs09ouFJkuFFktk5nskhsrkNwqj90pTp4oDd8nDV/mTOBlzGDlC+Eki6GkSyHjyqJtFFnuFVjyGdSzWlOyGJTw1pavlNhuUxntEVsrz9xqzp0pjV4oDF8mi+BlS+Eky+GkS2HjyuJjSqKx2dRzW5L1HZDzmxLyWNSw1tavlNhuEtns0Rtrz5yqzl1pjR5ojB7nS19lSmDkSuHkCyIjiqKjCmL0nVF1HZE0nVFzGtNxmJWwFldulFktUlrr0JxqTx2pTZ6oDF+nC2AmCqBlSeBjiWHjCiLjCqLiyiMym1NznFKz3RHyWpQw2FXvFhgtk9osEdvqkB1pDl7nzOAmi6ElimGkSaIjySHiyOHhiGNiieNiSeOtVRmultgy29MyGlSwWBauldis05qrUZypz54oTh+mzGElCuJjyaMiyKOhyCOhB+NgR2PhCKRiCePrkxurUxus1FowWBZvlxduVVjs05qrEZxpT54njZ/ly+FkCiLiSKRhB+UfxyVfBqUehqTfByVhyaQrUtvrEtvqklxsVBruVhitFJorktup0N2nzt9lzOEjyyLiCaQgB6XfBubdxeccxWbcRaYdRiZhSWRrEtwq0pwqUhyrExwtVZnsFBtqUl0okF7mTiDkTCKiSmRgiOWdxqedBehbxSjbBGhaRKfbhSegiOTq0pxqkpxqkpxs1VpsVNrrE5xpUd4nj9/lTeHjS+OhSiVeyCdcRmkbhamaBGpZA6nYg6kbhWfgyWTq0txrk9tu2FeumBgs1hoq09xo0d5mz+BkzeJiy+QgiiYdx+gbhmmaBSqYhCsXQysXQypcxmegiSUul9fvmVZw2tUvGJetFhnrFBxo0d6mz+CkzeLjC+ShCiZfCGfcRqmYxSsXA6vVwuwYA+qfSGYgiSVxGpWxWtUxGlWvGBgtVdprU9ypEZ7nD6DlDeLjC+ThSiafSGgdhykbRapXQ+wXA+vcxuggyWUgSSVwWVaxGdYxWdXvV9itVZqrk5zpUV7nT6ElTaLjjCShimZfyOgeB2kchinaxWqcxuhgiaVgiWVgCSWsFJstlhmxWVav15it1Vrrk1zp0Z7nz6DlzeKkDCSiCqZgSSeex+idh2jeyKchCeUgyeUgSWVgCOXp0h2pkh2q0xysVJtsVJurEx0pUZ7nj+ClziJkDKQiSyVhSmXhCiWhiqThyqRhSiTgyeUgSWWfyOXpkh2pkh2pEZ4okR7oUN8oEJ9nT+AmTyDljiHkjWKjzKLjjGMiy6OiSyQhyqShSiTgyeVgSWWfyOY'],
    slot1: [-11, 365, 20, 17, 9, 'kS2SkS2TkCyTkCyTky6Rky6RkiySjyqVjCeXiiWZiCSaiCSaiSaZiCWaiCWahySbhySbkS2Tki6SnziGozqDoDeGnDKKmC+OlSuRkSiUjiSYiiGbhx+chR6dhSGciCWahySbhiSbmDSLnzmFpz9+ozqDnjeHmzKMly6PlCuSkCeVjSSYiSGbhh6dgxyegBqfgh6ehySbhiSboDyDoj6Boz+AoDqFnDWJlzGNky2SjymWiyaaiCKchB+fgR2hfhqhexikeRejhySbhiOboD6DoT6CoD6CnDmHlzSMkzCRjiyUiyiZhiWcgyGfgB6ifBukeRimdRandBWnhySbhiOcmTeKmzuHnT2FmDmKlDSOjy+SjCuXhyecgySffyGieh2kdxqocxeqbxSrehqkhySbhiOckS6SkzGPmzyHmDiMkzSQjzCViyuZhiecgiSgfiCjeh2mdRmqcRereRukhiSbhiSbhiOckC2TkC2TkC2TkjCRkzGQkC+TjSuWiSiZhiWcgiKffyChgCChhiSciCWahyWbhiSbhiOckC2TkC2TjyyUjiuUjiuVjSuVjSqWiymXiSeZiSeZiSeZiSaZiCaaiCWahySbhiSbhiOc'],
    bowl: [-19, 535, 28, 19, 22, 'lTCSlDCSky+Tki6UkC2UjyyVjiuVjCuWiyqWiimXiSmXiCiXhyeXhyeXhieXhSaXhSaXhCaXhCWXljGRljGRlTCRky+Ski6TkS6TjyyVjSuXiiiZhiabgiOdgCKegCKchiaYiCiWhyiWhieWhieWhSeWmDOPmDOPmTSOmDOQlTGTkS2XjCqbhyafgiOhfiCkeBymcRepaxOraxOpfSGciSmUiCmUiCiUhyiUnjiKoDuIojuInDeOljKUkC2ZiymdhSWhgCGkex6ndhuochipbhapahSobBWmfiKaiyqSiiqSiiqSpDyGpT6FpTyGnziMmTOSlC+WjiubiieehCShgCGkex6ldxumcxmlbxelaxajcxufiCmTjCyQjCyQozuGpDyFpj2FojmKnDWPljCUki2YjiqaiiedhSSfgSKhfR+heB2hdRuhcRqfchqdgCSWjy6Ojy6Opj2Cpj2DpTyDojqFmzWNky6WkCyYjyuZjiuZiymahyacgyOcfiGceiCceB6adB6ZfSKWkS+MkTCLq0F+q0F+qUB/qD6Apj2BoTmGky6UkCyWkSyWkSyVjSqWiSiXhiaXgiSWfiOVeyKTfyWSjy+LlDKJsUV6sEV6r0N7rUJ8q0F9qUB+oTqFljGQljCRmTGRlC+QkC2QjCuRiSqQhiiPgiiOhCmNkjCJmDSGtkl1tkl1tEd2skZ3sEV5rkN6q0F8oTmHnzeJnzeMnDWMmTOLlTGKkS+Kji6Kiy2Iiy6HlDOGmzeDu01wu01wuUtxt0pztUl0s0d1skZ3r0J8qj+AqD2FpDyFoTmEnTeEmjWDljWDkzOBkzOCmzeBnjmBwFFswFFsvk9tvE5uukxwv09twU9tu0tytUZ4sUN+rUJ9qUB9pT58ozx8oDt8nTp6nDl8oDt9ojx+xVRnxVRoxFNoy1dk0lth0FpiylZmw09svEpyuUh0tkd1s0Z1r0R0rEN1qkJzp0FzpD93pj96pj97ylhjy1hi1lxd1Vxe01pg0Fhiy1VlxlJnxFBqwU9tvk5tvExtuUtstkpstElsr0htrERzq0J3qUF4219f215g211i2Fxj1ltj01tj0VpjzlljzFhlyVZlx1VlxVRlwlNkwFJku1Bkt0xpsUdwrkV0rUR14mNb4mNc4mJc32Nc3WJb22Jb2GFb1mBb1F9b0l5b0F1bzltbzFpbxllcwVdfu1BntElvskhxsEdy5WlT5mlT6GlT5WlT42lS4WhS4GhS3mdS3GdR2mZR2GRS02NSz2FUzWBVxlldu09pt0xttUtutEpv425L4m5K4W1K4G1K4G1K32xK3mxK32xK3WxK22tL2WtM2WtL2GpKz2FUxFZhvFBpuk5quU1rt0xs43FG43JF5HND5HRD43RD5HRC5HRD5XRC5HRB5HRA5HRA4XFD12dOyltcwVNlv1JmvVFnvFBouk9p2mdS3WpP6Xg+63o763k763o763k77Hk67Hk66nk75HNC2WlNzF1bxldhxFZiwlVjwFNlv1JmvVFn2WVV2WZU53VB6ng96ng86ng86ng86ng86ng86Hc94XBF12dQyVlfxlhhxFZiw1VjwVRkv1NlvlFm2WVV2WZU53VB6ng96ng86ng86ng86ng86ng86Hc94XBF12dQyVlfxlhhxFZiw1VjwVRkv1NlvlFm'],
    slot2: [-11, 661, 20, 14, 14, 'by24by24biy4by22by6zbi20bCy1aiu3aSq5aSq6aSq7aCq7Zym7Zym8by24by23ejeiezicdjSgcS+kbCupZyiwZCe1ZCi5aCm7aCm7Zym8Zym8dzSqezmhgT6UfDmbdjShcC+maiurZSewYCOzWyG3XyW8Zym8Zym8Zym8gDqfgD2bgD6VezibdjShbi+maSusYyewXiO1WB+4Vh67XSS/Zym8Zym8gjergzqkgT2aeziedTSkbi+paCuuYyazXSO3ViC5UB29Uh7DYye+Zym8hDK+hzDEhy3QgC3QeSzNcizNayrMZSjMXiXLWCPLUSDMTh7KXCTCZym9hi/KiC3Ohy3QgC3QeSzOcivNaynNZCjNXiXMWCPMUSDMSh3OWCLGZim9hi7KiS7Ohy3RgS3QeSzOcivOayrOZCfNXiXNVyPMUSDMSx3MWCPGZim9hDK/hzDGhy3QgC3PeSzOcivOayrOZSfNXiXNVyPMUSDMTh7LXyXCZim9gjeugzmngDyeezejdTOobS+tZyuyYSe1WyO5VR+8UB3BVSDFZCi+Zim9fjilgDuefz2ZejmedDSkbS+qZyuvYSe0WyO4VSC6VCC/YSbAZym9Zim9cS+1djOsgD2YejmedDSkbDCpZyuvYCe0XSS5XCS8Yie+Zym9Zym9Zim9bi25bi25cjCydTSpcjKrbS+uaSyyZim2ZSi6Zim8aCq8aCm8Zym9Zim9bi25bi25biy6bSy6bSy5bCy5ayu5aiu7aiq7aSq8aCq8aCm8Zym9Zim9'],
    block: [-23, -24, 32, 10, 12, 'yEdiyUlf009Z0kxcz0hezUVfy0NfyENixUNkxUNkyUlgy0td01BY0UxbzkhezEZfykRfyENhxUNkxUNk01NX1FRW01JX0ExbzUhey0VfyUNfyUJexkNjxENl01RX01RW0VFZzUxdzEdgykRhyEJhx0FhxUFjxEJm0VJa0VJZzlBby0pfyUZixkNjxUBkxEBjw0Blw0JmzlFbzlFbzE5dyUhixkRlw0FmwT5nwD1nwD5owkFny09ey09fyUxhxUdlwkJpvz5rvTtsvDpsvTtrwUBox05ix05ixUtkwURpvj9tuzxvuDlxtjdwujpuwUBow0tlxEtlwUhovEJtuT1xtTl0szV2sTR2ujtvwEBpwUZnwUdnvUZsuUBxtTt1sjd5rjN7rzR4vj9rwEBqwkNowkNowENqvUFtuj5wuTxxuTxwvj9rv0Bqvz9qwUNpwUNpwUJpwEJpwEFqv0Fqv0Bqv0Brvj9rvj9r'],
    tab1: [197, -12, 20, 16, 15, 'kDq+jzq/ey7daST3ZCD5Xx37WRn9UxX9TRH+SA3+RAv+Rwz6ZyDhgDDOfy/QfS7RkDu9jjnBcyrpZyP4YiD6XRz6Vxj8URT9SxD9Rgz9Qgr+Qwr8VRXtfS7Qfy/Pfi7Rkzy6ei3jbCX3aSP5ZCD7Xhz9Vxj/URT/SxD/Rgz+Qgn+Pgf+PAX+XhvmgTHNgDDOkTu/eC3qdSvtcinvbSb0ZyL4YB38Whj+UxX/ThH/Sg7+Rwz+Qwr+XhrpgzLKgjHMkz2/gzTcgTPffjHiei7pdCrxbSX5ZSD9Xhv/WRj/VRX+URL9ThD8ZyDkhTPHhDLJm0K1kz3Hkj3KjzvPizjXhTThfi/udin6byX/aSH8ZR74YBv2Whj4dCjaiDXFhjTGpkmlpEitpEevoUa1nkS9mUDIkzzYijfohDHyfy7reSrnciXnbiPngjHMijbCiDXDsVCUt1SPt1SQtVOTs1GasE6jrEuvpka8oELEmD7FkTjGhDHSfy7TjDe/jDe/izbAvFaCymBvy2Buy19vyl5zyV12xlt7xFiAv1SEt0+Lp0ahkTm+jTi/kDq6jzm8jTi9vld922pP3WtN3WtM3WtL3WpK3mlI3mdG22VHzVxfq0mZmT6xlDy1kju3kTq4jzm6uFOE6nM07HQw7HQv7XQq7nQm8HQf8XQa6G0rwFZ3p0edmD+vlj6ylT2zkzy1kju3qkuY6XMx9nwa93wX+HwT+XwO+HoQ6nAqzF5isk6NnUKpmkCsmT+ulz6wlj2ylDy0q0uXx11o/IAN/H8N+n0P8Xce32tBxlttrkyRoESlnkOnnUKpm0GrmkCtmD+vlz6wrUyTrEyVtFGGulR9v1d1ulR+rEuTpUeeo0agokWioUSkn0OlnkKnnEGpm0CrmT+tsE6Qr02RrUyTrEyUq0uWqkqXqUmZp0ibpkicpUeeo0agokWioESkn0OmnUKonEGq'],
    tab2: [443, -12, 20, 16, 15, '8lwo8lwo9VUr+Uov+kkw+kkw+kkw+kkw+kkw+kkw+kkw+Uow9lMs81op81op81op8lwo8lwo91At+kgw+kgw+kgw+kgw+kgw+kgw+kgw+kgw+kgw+E4u9Fcq81op81op8lwo9VQr+kgx+kgx+kgx+kgx+kgx+kgx+kgx+kgx+kgx+kgx+0gy9lEu81op81op8lwo9lIt908u908t908t908t908t908t908t908t908t908t91Au9lIt81sp81sp8lwo9Fcr9FYr9FYq9FYq9FYq9FYq9FYq9FYq9FYq9FYq9FYq9VYs9VYr8lso8lso8l0o8lwo8lwo8lwn8lwn8lwn8lwn8lwn8lwn8lwn8lwn8lwn81so81kp8lwo8lwo8WAn8GEm8GEm8GEm8GEm8GEm8GEm8GEm8GEm8GEm8GEm8WEm8l0n8lwo8lwo8lwo8GIm72Ul7mYl7mYl7mYl7mYl7mYl7mYl7mYl7mYl7mYl72Ql8V4n8l0o8l0o8l0o72Ql7Wkj7Woj7moj7moj7moj7moj7moj7moj7Woj7Wkj72Ml8V8n8V4n8l4o8l0o72Ul7Gwi7G0i7G0i7G0i7G0i7G0i7G0i7G4i7G0h7mck8GIm8V8n8V4n8V4n8V4n72Ml7G4h628g6m8g6m8g6m8g628g6m8g624h7Woj72Ul8WAn8V8n8V8n8V8n8V4n8GIm7Gsi6nEg6nAg6nAg6nEf63Ai628h7Wsi7mYk8GEm8WAn8WAn8V8n8V8n8V8n8GIm72Ul6nEh6nIg6nEg63Ag7G0h7Wkj72Ql8GEm8GEm8GAm8WAm8WAn8WAn8WAn8GMl8GMm72Ql72Uk7mYk72Uk72Ml8GIm8GIm8GEm8GEm8GEm8GEm8GEm8GAm8WAn72Ml72Ml72Ml72Ml8GMl8GMm8GIm8GIm8GIm8GIm8GIm8GEm8GEm8GEm8GEm8GEm'],
    tab3: [686, -12, 20, 16, 15, 'kDq8jzq9fC7caiT1ZSH4Xx36WRn8UxX9TRH+SA7+RAv+Rwz6ZyDhgDDOfy/PfS7RkDu8jjm/dCrmaCP3YyD5XR36WBj8UhT9SxD9Rw3+Qgr+Qwr8VRXsfi7Pfy/Pfi7Qkzy4ei3hbCX1aSP2ZSD6Xxz9WBj+URT/SxD+Rwz+Qgn+Pgf+PQb+XxrmgTHMgDDOkTu9eSzndivrcinvbibzaCL4YR39Whn+UxX/ThH/Sg7+Rwz+RQn+XhrogzLJgjHLlD28gzTagjPcfzHgei7ndCrwbSX4ZSD+Xhv/Whj+VRX+URP9TRD+ZyDlhTPHhDLInEKykj7Ekj3GjzvNizjVhTTgfS/sdSn5biT+aiH8ZR75YBv3Wxj4cyfciDXEhjTGpkmio0mppEisokaxnkS6mUDHkzvVijbogzLyfi7teSrocSbpbiTogC/OijbBiDXDsVCQt1SKt1SMtVKRtFCYr06hq0qtpUe8oELDmD7FkTjIhTDVfi7UjDe+jDe+izbAvFZ+ymBqy2BpymBsyl5wyV11x1p6xFh/v1WFt0+MqEWikjm+jTe/kDq5jzm7jTi9vld522pK3GtI3WtI3WtI3mpI3mlI3mhG22VHz1xdrkqVmT6xlDy0kju2kTq4jzm5uFOB6nMu63Uq7XQp7nQo73Qk8XQf8XMa6W0rw1hxqUiamT+tlj6xlT2zkzy0kju2qkuW6nMr9nwT93wR+HwQ+XwM+HoO63AozF5hs0+KnUKomkCrmT+tlz6vlj2xlDyzq0uVx11k/H8H/H8H+n0K8ncc4Ww9yV1mr02NoESknkOmnUKom0GqmkCsmD+ulz6wrUyRrEyTtVGEulR7wVlvulR8rk2PpUedpEafokWgoUSin0OknkKmnEGom0CqmT+ssE6Or02PrkyRrEySq0uUqkqWqUmXp0iZpkibpUedo0afokWhoESjn0OlnUKnnEGp'],
    pill: [958, -24, 32, 32, 11, 'MAd0MAd0KghlKghkLQdrLwdxMQd3NAd+NwaEOQaKOwaRPQaXPwaeQgWlRQWsRwWySga2UgqzXhKqaxqddyKSgyqHjzN8mztxpkRns0xbv1RQyl1E1WU6y15DskxbskxbMAd0MAdyKQhiKghkLAdqLwdxMQd3NAd+NgaEOAeLOwaRPgaXQAWeQwWlRQWrSAWySwW2UgqzXhKpaxqediKSgyuHjjN8mjtyp0Nns0xbv1RQyl1F1mU60mI9tk9Xtk9XMQd0LQdrKAheKghjLAdpLwdxMQd3NAd9NwaEOQaLOwaRPgWXQAWfQgWkRgWqSASxSgW2Ugm0XhKpahqediKSgiuHjjN8mjtxpkRms0xbv1RPyl1F12U54m0vzF5DzF5DMQd1LgdtKAheKghjLAdpLwdwMQd3NAZ9NwaEOQaLOwaRPgWXQAWeQgWkRgWqSASySgS2Ugm0XhGpahqediKSgiuHjjN8mjtxpkRms0xavlRPyl1F1mU64Gwwyl1Fyl1FMQd1LwdxKQhiKghjLAdpLwdwMQd3NAZ9NwaEOQaLOwaRPgWXQAWeQgWkRgWqSASySgS2Ugm0XhGpahqediKSgiuHjjN8mjtxpkRms0xavlRPyl1F1mU52mc2v1VPv1VPMQd1MQd2LAhpKwhlLAdpLwdwMQd3NAZ9NwaEOQaLOwaRPgWXQAWeQwWkRgWrSASxSgS3Ugm0XhGpahqediKSgiuHjjN8mjtxpkRnskxbvlRPyl1F1GQ8yFtGsUtcsUtcMQd2Mgd4MQd1LQdqLQdqLwdwMQd3NAZ9NwaEOQaLOwaRPgWXQQWeQwWkRgWrSASySgS4Ugm0XhGpahmedyKTgiuHjjN8mjtxpkNnskxbvlRPyFxFx1tHs01arklerkleMQd2Mgd4Mwd7MQd3LwdwMAdxMQd3NAZ9NwaEOQaLOwaRPgWXQQWeQwWkRgWrSASySgS4Ugm0XhGpahmedyKTgiuIjjN8mjtxpkNnskxbvFNRvVRRr0pdqkdirUlfrUlfMgd3Mgd5Mwd7NAd+NAd9Mgd5Mgd6NAd+NwaEOQaLOwaRPgWXQQWeQwWkRgWrSASxSwS4Uwm0XhGpahmediOSgiuIjjN9mjxxpENorEhgrUhgpkRmpUNnqUZjrUhgrUhgMgd3Mwd5Mwd8NAd+NgeBNweDNweDNwaEOAaHOQaMPAaSPgWYQQWeQwWkRgWqSgavTgixVgyuYBKnaxqddiKTgSqJizF/lDd3mTpymjxwmjxwnz9spEJoqUVkrEhhrEhhMgd4Mwd6NAd8NQd/NgeBNweEOQeHOgeKPAeNPgeQQAeTQgiXRQiaSAmdTAugUQ2hVg+hXROfZBebbByWdCGQeyaKgiuFhy+AjTN7kzd2mTtxnj5to0JoqEVkq0dhq0dh'],
    bg: [-48, -48, 48, 43, 26, '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'],
  };
  const SH = V.S, tk = h.tk;
  const BPER = 7.3, BPH = (Math.PI - 2 * Math.PI * tk / BPER) / 2;          // the living slide is exactly zero at the key instant
  const FIELD_GLSL = `
uniform sampler2D ftex; uniform vec4 fgrid; uniform vec2 bat, bdir; uniform float bamp, bper, bph;
vec4 bsw(float f) { float f2 = f * f, f3 = f2 * f; return vec4(1.0 - 3.0 * f + 3.0 * f2 - f3, 4.0 - 6.0 * f2 + 3.0 * f3, 1.0 + 3.0 * f + 3.0 * f2 - 3.0 * f3, f3) / 6.0; }
vec3 field(vec2 b) {                                // cubic B-spline through the measured board-colour grid (clamped at its edges)
  vec2 g = (b - fgrid.xy) / fgrid.z, i0 = floor(g); vec4 wx = bsw(g.x - i0.x), wy = bsw(g.y - i0.y);
  ivec2 n = textureSize(ftex, 0) - 1, q0 = ivec2(i0) - 1; vec3 c = vec3(0.0);
  for (int j = 0; j < 4; j++) { vec3 r = vec3(0.0);
    for (int i = 0; i < 4; i++) r += wx[i] * texelFetch(ftex, clamp(q0 + ivec2(i, j), ivec2(0), n), 0).rgb;
    c += wy[j] * r; }
  return c;
}
`;
  const texOf = name => { const [x0, y0, sp, nx, ny, b64] = F[name], s = atob(b64), a = new Uint8Array(nx * ny * 4);
    for (let i = 0; i < nx * ny; i++) { a[4 * i] = s.charCodeAt(3 * i); a[4 * i + 1] = s.charCodeAt(3 * i + 1); a[4 * i + 2] = s.charCodeAt(3 * i + 2); a[4 * i + 3] = 255; }
    const tx = new THREE.DataTexture(a, nx, ny, THREE.RGBAFormat); tx.needsUpdate = true; return { tx, grid: new THREE.Vector4(x0, y0, sp, 0) }; };
  // the engine's piece shader, with its colour swapped for the board field (in board px, riding with the shape: local
  // coordinates are board px around the anchor); keeps the engine's side shading, opacity and flow level
  const fieldMat = (base, name, at, o = {}) => {
    const { tx, grid } = texOf(name);
    const u = { ...base.uniforms, ftex: { value: tx }, fgrid: { value: grid }, bat: { value: new THREE.Vector2(...at) }, bdir: { value: new THREE.Vector2(...(o.dir || [1, 0])).normalize() },
      bamp: { value: 0.7 * (o.amp ?? 30) }, bper: { value: BPER }, bph: { value: BPH } };
    const fs = base.fragmentShader.replace('#include <logdepthbuf_pars_fragment>', '#include <logdepthbuf_pars_fragment>\n' + FIELD_GLSL)
      .replace('gl_FragColor = vec4(col * shade, op);', `vec2 bp = vec2(bat.x + vO.x, bat.y - vO.y) + bdir * (bamp * min(flow, 1.6) * (sin(t * spd / bper * 6.2832 + bph) - sin(bph)));
  gl_FragColor = vec4(field(bp) * shade, op);`);
    if (!fs.includes('field(bp)') || !fs.includes('vec3 field(')) throw new Error('G7: engine shader changed; the board-colour material could not hook it');
    return new THREE.ShaderMaterial({ uniforms: u, vertexShader: base.vertexShader, fragmentShader: fs, side: base.side, transparent: base.transparent });
  };
  // flat at the hold: the back face is pushed out along the hold camera's view rays (sides edge-on from that camera)
  const flatGeo = (g, pa, d) => { const p = g.attributes.position; g.computeBoundingBox(); const zb = g.boundingBox.min.z; if (zb > -1e-6) return;
    const t = -zb * d * h.tanV / 540;
    for (let i = 0; i < p.count; i++) if (p.getZ(i) < zb / 2) { const x = p.getX(i), y = p.getY(i); p.setXY(i, x + (pa[0] - 960 + x) * t / d, y + (540 - pa[1] + y) * t / d); }
    p.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingBox(); };
  // outlines in board px (y down); arcs in degrees (y down: 90° = straight down)
  const arcP = (cx, cy, r, a0, a1, n = 64) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
  const clean = pts => { const q = []; for (const p of pts) if (!q.length || Math.hypot(p[0] - q.at(-1)[0], p[1] - q.at(-1)[1]) > 1e-3) q.push(p);
    if (q.length > 2 && Math.hypot(q[0][0] - q.at(-1)[0], q[0][1] - q.at(-1)[1]) < 1e-3) q.pop(); return q; };
  const shapeOf = (pts, pa, holes = []) => { const s = SH.poly(clean(pts), pa);
    for (const hp of holes) { const p = new THREE.Path(); clean(hp).forEach(([x, y], i) => i ? p.lineTo(x - pa[0], pa[1] - y) : p.moveTo(x - pa[0], pa[1] - y)); s.holes.push(p); }
    return s; };
  const syncs = [];
  const PCE = (name, pts, pa, depth, thick, o = {}) => {
    const pc = V.piece({ hold: 31, shape: shapeOf(pts, pa, o.holes), at: pa, depth, thick, grad: '#7b2bf9', drift: o.drift ?? 3, keys: o.keys, name: 'f31 ' + name });
    flatGeo(pc.mesh.geometry, pa, depth);
    const om = pc.mesh.material, nm = fieldMat(om, o.field || name, pa, o);
    pc.mesh.material = nm; syncs.push([om, nm]);
    return pc;
  };
  anim(() => { for (const [a, b] of syncs) { b.transparent = a.transparent; b.depthWrite = a.depthWrite; } });   // the engine drives the original's flags
  // build-in: from nearer the frame centre (dx, dy px) and further back (dz), gliding out into place ("the shapes split apart").
  // The fade-in is kept very short (0.08 s): while the stacked B pieces (lobe, slot backs, bowl) were all see-through
  // together they read as a ghostly double exposure (review, 140.74–140.92). The glide does the build.
  const BI = (t0, dur, dx, dy, dz) => ({ x: [[t0, dx], [t0 + dur, 0, 'power3.out']], y: [[t0, dy], [t0 + dur, 0, 'power3.out']], z: [[t0, dz], [t0 + dur, 0, 'power3.out']],
    op: [[t0, 0], [t0 + 0.08, 1, 'sine.inOut']] });

  /* ---- shapes (board px), measured on board 31; each runs well past the frame edges it touches ---- */
  const BANDP = [[819, 845], [2600, 845], [2600, 1600], [457, 1600], ...arcP(819, 1207, 362, 180, 270)];            // top y 845, rounded top-left (r 362)
  const ARCHP = [[1500, 1600], ...arcP(1890, 660, 390, 180, 360), [2280, 1600], [2024, 1600], ...arcP(1890, 655, 134, 360, 180), [1756, 1600]];   // ∩: outer r 390 (top 270), window r 134 (top 521)
  const LOBE = [[-700, 277], ...arcP(226, 439, 162, -90, 90), [-700, 601]];                  // the B's upper lobe (top 277, bottom 601)
  const SLOT1 = [[-680, 385], ...arcP(226, 439, 54, -90, 90), [-680, 493]];                  // its slot (385–493, round end at 280)
  const BOWL = [[-700, 480], ...arcP(120, 790, 310, -90, 90), [120, 1600], [-700, 1600]];    // the B's bowl (to x 430 at y 790)
  const SLOT2 = [[-680, 681], ...arcP(115, 788.5, 107.5, -90, 90), [-680, 896]];             // its slot (681–896, round end at 222)
  const slotBack = (x0, cx, cy, r) => [[x0, cy - r], ...arcP(cx, cy, r, -90, 90), [x0, cy + r]];
  const BLOCK = [[-700, -700], [247, -700], [247, 236], [217, 240], [217, 300], [-700, 300]];   // top-left block (to x 217, y 277; tucked behind tab 1 and the lobe)
  const TAB = cx => [[cx, -700], [cx + 244, -700], ...arcP(cx, 0, 244, 0, 90), [cx, -700]];   // quarter disc: flat top and left, round bottom-right
  const PILLP = [[990, -700], ...arcP(1250, -7, 260, 180, 90), ...arcP(1655, -7, 260, 90, 0), [1915, -700]];   // hanging pill, bottom 253

  /* ---- depths from the hold camera (the sphere rolls at D): the arch in front of the sphere's path, the band under it,
     the B / block / tabs / pill a few units behind (parallax), the backdrop far back. Neighbours ≥ 0.1 apart. ---- */
  const dArch = D - 2.8, dBand = D - 1.4, dLobe = D + 3.3, dS1 = D + 3.72, dBowl = D + 4.05, dS2 = D + 4.5, dTab = [D + 4.9, D + 5.05, D + 5.2], dBlock = D + 5.55, dPill = D + 5.9, dBack = D + 25;

  // backdrop: the board's background (warm glow upper centre, navy centre-right, electric blue lower left), far back, huge
  PCE('bg', [[-2600, -1900], [4500, -1900], [4500, 2900], [-2600, 2900]], [960, 540], dBack, 0, { drift: 0, amp: 40, dir: [1, 0.3] });
  // the band the sphere rolls on (no drift: its top edge is the rolling surface), present from the start
  PCE('band', BANDP, [1200, 960], dBand, 2.8, { drift: 0, amp: 36 });
  // the B: upper lobe in front of the bowl; both slots recessed (holes, with their slot colour behind)
  const kB = BI(140.72, 1.05, 260, 0, 6);
  PCE('lobe', LOBE, [100, 439], dLobe, 0.3, { holes: [SLOT1], keys: kB, amp: 24 });
  PCE('slot1', slotBack(-690, 226, 439, 76), [100, 439], dS1, 0.15, { keys: kB, amp: 20 });
  PCE('bowl', BOWL, [150, 790], dBowl, 0.3, { holes: [SLOT2], keys: kB, amp: 30, dir: [0.3, 1] });
  PCE('slot2', slotBack(-690, 115, 788.5, 130), [100, 790], dS2, 0.2, { keys: kB, amp: 20 });
  PCE('block', BLOCK, [110, 140], dBlock, 0.25, { keys: BI(140.8, 1.05, 190, 160, 6), amp: 20, dir: [0.6, 0.8] });
  [217, 463, 706].forEach((cx, i) => PCE('tab' + (i + 1), TAB(cx), [cx + 100, 100], dTab[i], 0.4, { keys: BI(140.84 + 0.07 * i, 1.0, 60 - 40 * i, 240, 6), amp: 18, dir: [0, 1] }));
  PCE('pill', PILLP, [1450, 120], dPill, 0.35, { keys: BI(140.74, 1.05, -180, 200, 6), amp: 40 });
  // the arch rises into place in front of the band (never through it), well before the sphere reaches its leg (~141.3)
  PCE('arch', ARCHP, [1890, 900], dArch, 1.2, { drift: 2, amp: 30, dir: [0, 1], keys: { y: [[140.08, 560], [140.98, 0, 'power3.out']], op: [[140.08, 0], [140.3, 1, 'sine.inOut']] } });
  V.unplate(31);


  /* ---- captions ---- */
  // (the copy layer's logo wipe trails the sphere: c31's front sits 1.3 R behind the sphere's centre, ~65 px at the hold
  // framing, with a 50 px soft edge; the logo's right end is at x 1381. Only for the caption's timing.)
  const LX1 = 1381, LAG = 65 + 50;
  const tOf = px => TE - (PXE - px) / (VS * PX);                // when the sphere is at board px
  const tLogo1 = tOf(LX1 + LAG);
  note(139.35, 140.15, '30 → 31 · out of the sphere: the camera pulls back as it rolls on, left to right along the band; frame 31\'s shapes split apart into place around it');
  note(140.15, tLogo1 + 0.15, `31 · LOGO REVEAL (copy layer): ENHERTU wipes on left to right, just behind the sphere and at its pace (complete at about ${tLogo1.toFixed(1)} s)`);
  note(tLogo1 + 0.15, 143.0, '31 · the sphere rolls behind the arch\'s leg, out through the arch and off to the right; the camera\'s pull-back eases into a slow drift');
  note(143.0, 146.15, '31 · end card: a slow pull-out and sideways drift on the logo (never still); the exact board framing at 144.95');
  note(146.15, 146.95, '31 · final fade to dark (copy layer, as v1: 146.15 → 146.75; the music ends it)');

  // (the end fade itself is the copy layer's: c31.js fades the whole end card to #12062e over 146.15 → 146.75, as v1)
};
