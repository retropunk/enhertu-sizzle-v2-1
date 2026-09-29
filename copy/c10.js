/* Copy for frame 10 · the holding shape ASCO: ACTIVATED (top left) and MAY 2025 / AN IMPACT ACROSS INDICATIONS (right)
   v1: the holding shape wipes open left to right (clip, 0.7 s expo.out); its two lines swipe in (clip + 60 px slide, 0.7 s
   power3.out); the right-hand lines swipe in the same way. Sizes and places are fitted to board 10's type and box (v1's
   were 3–6% off): the holding shape on board 10's shape, 603.6 × 304.2 on its outer edges at 38.4, 38.55 (c07's HOLD, the
   outline every board draws: an 8 px frame, 82 px corners; refit 2026-09-29, polish backlog "holding-shape outer edges
   sit 2–4 px inside the boards": it was 596 × 300 at 42.5, 40.5 with a 6 px frame and 70 px corners); ASCO: 300 80.8 px,
   ACTIVATED 800 79.2 px; MAY 2025 300 61.7 px, the rest 800 69.7 px, left edge 1044.
   The holding shape wears the boards' colours (c07.js's holdBg: the fitted blue-violet fill; the frame orange down the
   sides, violet across the middle of the top and bottom), flowing, locked to board 10 at the key instant.
   The camera (G2, since the user's 21:50 rule "never stop"): the 9 → 10 whip round behind the sphere ends ~36.7, then it
   cranes up and back while the wall builds in (36.5–38.4), glides forward and down onto board 10, passes board 10's exact
   pose at the key instant 39.9 at ~5.5 u/s (slow window 39.45–40.25), and chases the sphere into the ring tunnel (it
   accelerates to ~74 u/s at 40.6 and crosses the ring at ~41.0; the dark dip hides the cut at 41.4).
   The user (21:50): "let's have them already in place in 3D space around 36.5 and begin their animation but in 3D space as
   the camera moves into place, we see them stagger in from left to right. 'Asco activated' text and panel is first, 'May
   2025 An impact ...' is second. … those panels can sort of hover in space. And again, we don't want that 'ASCO activated'
   panel to move across the screen to be reused for the next frame."
   · Two layers in hold 10's view, in front of the wall (its shapes sit at 50.6–55.2): the holding shape at 44, the
     right-hand lines at 47, so the approach shows them part in depth.
   · They are in place from ~36.8 and build as the camera moves into place, left to right: the holding shape wipes open at
     key − 3.05 (36.85, review: at 36.65 it opened as an empty box over the lilac ramp before the wall was behind it) with
     its lines 0.25 s later; the right-hand lines swipe in from key − 2.7 (37.2), 0.15 apart; all in by ~38.0, so they
     read for ~2 s before the key and through the slow window. Each pushes forward a little out of the depth as it builds
     (frame 10's Z moment).
   · They hover (c07's hover()): a slow float in 3D, bigger than the other frames' (the user: "sort of hover in space"),
     zero at the key instant, so at 39.9 both sit on their board places. While the camera cranes (its view starts ~60°
     away from board 10's and well below it) a pure world place would leave them above the top edge until ~38.5, and the
     crane would reveal the right-hand lines first (tested: at any depth from 12 to 44 the box stays above the frame until
     ~38.0; the crane's upward tilt moves every depth alike). So while their world places are still above the frame their
     place is blended most of the way (0.9) toward riding in the camera's view, and it hands back to the world as soon as
     the crane allows (review: the old 0.9 → 0.55 blend, held to 39.3, kept them within ~30 px on screen while the wall
     scrolled ~500 px behind, so they read as a screen overlay): the right-hand lines over key − 2.0 → − 1.1 (37.9–38.8),
     the holding shape over key − 1.8 → − 0.9 (38.1–39.0), each rising ~30–60 px toward its world place as it does. From
     ~39.0 both are purely in the world, so the glide onto board 10 moves them with the set (~100–120 px, in parallax),
     and the chase carries them off. They keep facing board 10's view throughout, so the settling camera shows them in
     perspective, turning flat as it lands. (Keeping them in the world from their build would need a gentler crane tilt
     over 37.4–38.2: a sets change.)
   · No exit animation (user, 2026-09-28 00:30: frame 10 "by far, has the best text panel and text transition animation …
     The only small change I would make is, as the camera moves forward, you see the text fade … I wouldn't fade it";
     "the camera is going to move past it"): they are in the world well before the key (the blend is gone by ~39.0), so
     the camera's chase into the tunnel carries them off at full opacity: the holding shape out over the top left (gone
     by ~40.6) and the lines over the top right (by ~40.7), as the ring fills the frame (~40.8). The build and the float
     are unchanged. They switch off at key + 0.9 (40.8), once off screen, just before the camera passes their depth. The
     holding shape does NOT carry to frame 11 any more ("cheesy"): c11.js brings in frame 11's own. */
import { liveFill, holdBg, hover, kit, contentFor, grow, HOLD, holdCss, holdClip } from './c07.js';
const FACE = 'font-family:"new-hero","Open Sans",sans-serif;color:#fff;white-space:nowrap;line-height:1';

// one v1 super line (v1's .line box: padding .1em .12em .14em, overflow hidden) placed in a container whose top left is
// at stage px (ox, oy). x = left edge of the letters, top = v1's line top (stage px). Returns the span (what swipes).
// An edited line (content/copy.json: s.edit) is a kit line (c07.js) at the same size and place, fitted with auto-fit.
function line(parent, ox, oy, s, K) {
  if (s.edit) { const sp = K.line({ el: parent, ox, oy }, { ...s, L: s.x, org: true, W: 0 }); sp.parentElement.style.cssText += `;${FACE}`; return sp; }
  const { x, top, fs, w, text } = s;
  const d = document.createElement('div');
  d.style.cssText = `position:absolute;left:${(x - 0.12 * fs - ox).toFixed(2)}px;top:${(top - 0.1 * fs - oy).toFixed(2)}px;padding:${(0.1 * fs).toFixed(2)}px ${(0.12 * fs).toFixed(2)}px ${(0.14 * fs).toFixed(2)}px;overflow:hidden;font-size:${fs}px;${FACE}`;
  d.innerHTML = `<span class="${w} txt" style="display:inline-block">${text}</span>`;
  parent.appendChild(d);
  return d.firstElementChild;
}
const sm = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };

export default V => {
  const h = V.holds[10], tl = V.copyTL;
  if (!h) throw new Error('c10: frame 10 needs a hold');
  const tk = h.tk;
  V.waitFor(Promise.all([document.fonts.load('800 100px "new-hero"'), document.fonts.load('300 100px "new-hero"')]));
  const K = kit(V), TX = contentFor(V, 10);                          // frame 10's words (content/copy.json)

  // --- the holding shape (top left): its own layer, centred on its box (so it tilts about its own centre), at depth 44 ---
  // (the layer keeps its place, BOX10: the shape's old centre; the shape sits on board 10's measured shape, SHAPE10, in
  //  c07's refit outline HOLD, 603.6 × 304.2: see the header)
  const BOX10 = [340.5, 190.5], A = { w: 720, h: 420 };              // the layer's centre and size
  const SHAPE10 = [340.2, 190.65];                                   // the shape's centre on board 10 (outer edges)
  const ax = BOX10[0] - A.w / 2, ay = BOX10[1] - A.h / 2;
  const hs = document.createElement('div'); hs.style.cssText = `width:${A.w}px;height:${A.h}px`;
  const box = document.createElement('div');
  box.className = 'hold box';
  box.style.cssText = holdCss(SHAPE10[0] - HOLD.w / 2 - ax, SHAPE10[1] - HOLD.h / 2 - ay);
  hs.appendChild(box);
  // (siblings of the shape, not inside it, so the Layers switch can hide the shape and keep the text)
  const asco = [line(hs, ax, ay, TX.spec('panel', 0, { x: 113.5, top: 96.5, fs: 80.8, w: 'l', text: 'ASCO:' }), K),
    line(hs, ax, ay, TX.spec('panel', 1, { x: 112.5, top: 195.0, fs: 79.2, w: 'b', text: 'ACTIVATED' }), K)];
  grow(K.ready, { el: box, box: [SHAPE10[0] - HOLD.w / 2, SHAPE10[1] - HOLD.h / 2, HOLD.w, HOLD.h], lines: asco, refit: K.refit });   // (grows with edited words)
  const card = V.copyLayer(10, hs, { at: BOX10, depth: 44 });
  V.anim(t => { box.style.background = holdBg(liveFill(t, tk, 5, 9)); });   // living fill, board 10's at the key instant

  // --- the right-hand lines, one layer at depth 47 (a box around the three lines) ---
  const R = { x0: 1025, y0: 300, w: 780, h: 270 };
  const blk = document.createElement('div');
  blk.style.cssText = `width:${R.w}px;height:${R.h}px`;
  const right = [line(blk, R.x0, R.y0, TX.spec('lines', 0, { x: 1043, top: 320.8, fs: 61.7, w: 'l', text: 'MAY 2025' }), K),
    line(blk, R.x0, R.y0, TX.spec('lines', 1, { x: 1044, top: 392.0, fs: 69.7, w: 'b', text: 'AN IMPACT ACROSS' }), K),
    line(blk, R.x0, R.y0, TX.spec('lines', 2, { x: 1044.2, top: 469.5, fs: 69.7, w: 'b', text: 'INDICATIONS' }), K)];
  const blkL = V.copyLayer(10, blk, { at: [R.x0 + R.w / 2, R.y0 + R.h / 2], depth: 47 });

  // --- in: left to right as the camera moves into place ---
  const TB = tk - 3.05, TR = tk - 2.7;                              // the holding shape (its lines + 0.25), the right-hand lines
  gsap.set(box, { autoAlpha: 0 });
  gsap.set([...asco, ...right], { clipPath: 'inset(0% 100% 0% 0%)', x: -60 });
  const swipe = (els, t, st) => tl.fromTo(els, { clipPath: 'inset(0% 100% 0% 0%)', x: -60 },
    { clipPath: 'inset(0% 0% 0% 0%)', x: 0, duration: 0.7, ease: 'power3.out', stagger: st, immediateRender: false }, t);
  tl.set(box, { autoAlpha: 1 }, TB)                                  // v1's holdIn: a set, so it survives seeking back and forth
    .fromTo(box, { clipPath: holdClip(100) },
      { clipPath: holdClip(0), duration: 0.7, ease: 'expo.out', immediateRender: false }, TB);
  swipe(asco, TB + 0.25, 0.12);
  swipe(right, TR, 0.15);
  tl.fromTo(card, { dz: 5 }, { dz: 0, duration: 1.2, ease: 'power3.out', immediateRender: false }, TB)      // each pushes forward out of the depth
    .fromTo(blkL, { dz: 5 }, { dz: 0, duration: 1.2, ease: 'power3.out', immediateRender: false }, TR);

  // --- hover: each floats on its own; on the way in they ride most of the way in the camera's view until the crane
  //     brings their world places into the frame, then hand back to the world (see the header) ---
  const bBox = t => 0.9 * (1 - sm((t - (tk - 1.8)) / 0.9)), bLines = t => 0.9 * (1 - sm((t - (tk - 2.0)) / 0.9));
  hover(V, [card], { tk, seed: 31, amp: 9, tilt: 1.8, zAmp: 0.02, per: 0.8, beta: bBox });
  hover(V, [blkL], { tk, seed: 32, amp: 8, tilt: 1.5, zAmp: 0.02, per: 0.8, beta: bLines });

  // --- out: none. The chase into the tunnel carries them off at full opacity (see the header); off once gone ---
  const OFF = tk + 0.9;
  card.show(TB - 0.05, OFF);
  blkL.show(TR - 0.05, OFF);
};
