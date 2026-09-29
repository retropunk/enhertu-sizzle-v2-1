/* Frame 27 · the sphere drops back in "out of nowhere" down the bar lane into the window, hops, settles and finds its path:
   a ledge runs out of the window ahead of it and carries it onto frame 28's block (G6, called from g6.js with its context G).
   Built: the real set, no plate (V.unplate(27)).
   · The reading. Board 27 is a frontal relief seen through hold 27's long lens (every piece is flat at the hold: its sides are
     pushed out along that camera's rays, so they open up only when the camera moves). Depth order (from camera 27; the
     sphere's plane is 36.83): the ledge 36.5, the peek of 28's block under the picture box 36.9, the tiles 37.3, the orange
     panel behind the left tiles 37.95, the lilac bars 38.2, the dome 38.4 (1.4 thick, the arched window a real recess in it,
     its back wall 40.0), the ∪ 39.6 (its channel a separate back piece at 39.9), the blue column 58, the five scallops
     75.8 / 67.6 / 60.5 / 54.4 / 49.5 (each nearer than the one to its left, as the board layers them), the ⊂ (the B's upper
     bowl) 80 with its slot 79.5 and a maroon nub above it 82.3, the D 90 with its slot 89.5, a backdrop 100.
   · Colour: each piece carries a smooth colour field fitted to board 27 (least squares over the pixels where it is the front
     shape; the copy, the picture box and the sphere masked), in the piece's own board-px coordinates, so it rides with the
     shape. Living: the field slides a few px and is locked to the board at the key instant (124.5).
   · 25 → 27 (user: "the on-screen shapes move and spin like puzzle pieces finding their way around each other"): while the
     camera cranes up (board 27's lower half is in view from ~119.8, its top from ~122), the set assembles bottom-up, each
     piece arriving where the camera is looking: the blue column rises (119.7–121.1), the dome with its
     window and the tile panel rises turning (119.8–121.5), the ∪ rises spinning half a turn (120.3–121.9), the D swings in
     from the lower left (120.4–121.9), the ⊂ slides in turning (120.9–122.2), 28's block peeks in along the bottom
     (122.3–123.2), the orange panel rises in behind the tiles as they re-form (122.35–123.0), the scallops drop in stacked at the fifth's place and fan out to theirs like a deck (121.9–123.4). Then,
     with the camera settling and the sphere gone off the top, the four lilac bars slide down into the dome one after another
     (122.85–123.74): the lane forms, and the sphere drops down it (it reappears at the top at 123.35, bounces on the ledge
     in the window at 124.05 and hops onto the board spot at 124.5).
   · The tiles: f25's tumbling tiles (G.tiles25) re-form at T_SET = 123.05 on board 27's grid; this file's tiles appear there
     (same pose, just behind them) and f25's fade 123.1–123.5 over them.
   · The ledge: the sphere lands on it in the window at the key instant (coloured like the window there, so the board's
     floating sphere reads), then as it settles the ledge runs out of the window to the left ahead of it (124.95 →), maroon
     turning to the orange of 28's block top, and rolls up behind it once it is on the block (gone by 126.5).
   · 27 → 28 (the carry): the shapes both boards share (the scallops, the blue column, the ⊂ and its slot, the D, the ∪ and the
     dome) glide during the camera's truck (on its own progress, G.carryE: 0 as it passes 27, 1 as it passes 28) from board 27's places to board 28's (depths chosen so the
     parallax does most of it; the rest is a glide and a scale), their colours cross-fading to fields fitted to board 28. The
     scallops also widen (243 px on board 28: their straight part stretches, the round part keeps its radius). The 27-only
     pieces (tiles, panel, bars, window, the slots' ends, the peek) leave frame or fade (125.4–126.7); the backdrop fades
     125.8–126.9, as plate 27 did (f28's own backdrop takes over). The shared shapes stay through hold 28 and fly back out
     129.5–130.7 as the camera cranes down to 29.
   The journey (holds, the sphere's path, camera keys, captions) stays in g6.js. */
export default (V, G) => {
  const { THREE, h27, h28, M27, M28, smooth, flatGeo } = G;
  const { anim, mat, scene } = V;
  V.unplate(27);

  /* ---------- colour fields fitted to board 27 (f27) and, for the shared shapes, board 28 (f28): [box, terms 'ij…', RGB coefs] ---------- */
  const FIT = {"bg":{"f27":[[72.0,6.0,1911.0,1071.0],"000102030410111213202122303140",[[-11.1,2.3,70.6],[89.0,38.9,19.7],[29.5,10.8,44.7],[1.9,-17.3,52.6],[1.3,-21.9,38.6],[2.5,-19.1,12.2],[70.7,11.5,-18.6],[14.8,-4.6,27.3],[-36.8,-32.2,47.5],[36.9,18.5,-17.0],[53.8,27.3,-80.4],[43.3,23.3,-26.2],[25.4,8.7,33.2],[4.0,13.8,-81.7],[20.8,-9.6,94.2]]]},"D":{"f27":[[6.0,543.0,450.0,1071.0],"00010203101112202130",[[152.5,62.8,73.9],[112.0,20.0,60.2],[26.7,25.6,-9.3],[-43.6,25.7,-78.8],[-61.7,-44.4,25.3],[55.4,16.2,6.7],[11.7,24.7,-33.3],[-30.9,-11.0,2.1],[43.0,9.4,12.4],[2.1,11.4,-9.2]]],"f28":[[-76.11,535.29,450.0,992.31],"00010203101112202130",[[55.6,24.5,83.6],[134.9,9.1,97.9],[49.6,24.1,-0.4],[-13.8,24.7,-68.8],[154.8,66.4,-29.8],[-2.1,-4.3,8.4],[-101.8,-10.9,-32.5],[-28.3,-21.5,16.7],[56.9,15.5,-8.8],[-121.5,-52.1,22.9]]]},"Dslot":{"f27":[[6.0,666.0,240.0,879.0],"000102101120",[[149.3,71.5,66.6],[-15.8,-35.1,242.5],[51.0,27.0,-166.9],[-44.9,-32.0,9.5],[6.3,3.1,26.9],[-6.2,-0.8,-19.3]]]},"nub":{"f27":[[6.0,108.0,69.0,219.0],"000102101120",[[164.9,85.1,58.2],[-21.7,-37.0,11.6],[26.1,44.2,-16.4],[-13.9,-32.3,19.2],[18.5,20.6,-48.7],[-22.8,-8.3,45.4]]]},"cup":{"f27":[[6.0,222.0,519.0,540.0],"00010203101112202130",[[194.5,116.9,39.4],[-5.4,9.8,-12.6],[-0.2,-2.0,14.3],[17.6,-10.9,10.1],[-169.5,-158.8,93.5],[-28.0,-23.4,0.7],[3.5,9.4,-1.0],[-61.9,-17.0,7.9],[1.1,26.1,-18.9],[66.8,68.1,-39.7]]],"f28":[[-163.61,222.76,510.16,538.42],"00010203101112202130",[[201.6,156.2,20.1],[4.9,22.1,-7.9],[-4.4,-7.3,8.8],[13.8,-11.9,10.5],[-101.1,-183.7,100.9],[-15.2,-30.3,-0.6],[6.6,11.0,-3.4],[-107.7,-49.7,36.5],[-30.1,17.7,-17.9],[34.0,80.2,-45.5]]]},"cslot":{"f27":[[6.0,318.0,273.0,426.0],"00010203101112202130",[[159.5,83.3,57.1],[-27.2,-27.7,18.9],[14.5,18.7,-7.2],[4.5,2.6,-5.0],[-48.3,-47.0,24.9],[-16.9,-11.9,4.8],[1.7,-0.1,-0.1],[-23.0,-7.9,5.3],[13.1,14.2,-4.4],[0.5,6.9,-6.2]]],"f28":[[-148.31,318.0,275.0,427.15],"00010203101112202130",[[34.2,16.7,71.6],[-11.3,-3.7,23.4],[9.0,7.7,-5.1],[-8.7,-6.5,-7.9],[220.3,98.4,-11.5],[67.3,30.8,-14.0],[11.1,3.3,-1.4],[-64.9,-41.0,16.5],[-86.9,-39.0,7.5],[-118.1,-53.2,15.0]]]},"s1":{"f27":[[6.0,6.0,201.0,255.0],"000102030410111213202122303140",[[236.8,120.0,15.9],[-188.0,-133.6,356.8],[1.9,-31.5,-56.3],[47.5,20.3,-99.1],[27.7,34.8,-19.4],[-63.2,-55.4,196.1],[-29.7,-15.8,-29.5],[29.6,18.4,-81.4],[17.0,23.0,4.9],[-37.7,-16.5,38.9],[10.0,16.8,-71.4],[15.7,18.2,-9.8],[-0.8,1.6,-16.6],[14.6,14.2,-23.2],[15.1,3.1,-8.0]]],"f28":[[2.0,11.0,200.0,254.0],"000102030410111213202122303140",[[167.8,74.7,161.1],[-96.8,-107.4,147.5],[4.8,-6.8,-22.3],[22.0,23.1,-36.0],[8.4,22.8,-14.6],[-59.9,-37.4,124.9],[5.4,0.2,-74.5],[20.6,18.2,-41.6],[4.5,9.8,13.8],[-16.6,-3.2,-1.3],[11.3,10.5,-41.3],[3.2,4.1,12.7],[2.8,4.0,-12.9],[4.6,1.0,4.7],[5.6,-1.4,8.4]]]},"s2":{"f27":[[129.0,6.0,330.0,255.0],"000102030410111213202122303140",[[237.0,118.0,19.5],[-193.6,-134.6,369.1],[-1.8,-35.5,-42.3],[44.0,16.5,-86.0],[23.6,32.0,-6.2],[-56.0,-42.9,158.1],[-20.5,-11.3,-51.1],[37.6,22.9,-102.4],[22.9,28.1,-15.0],[-43.8,-28.8,81.7],[11.8,15.8,-67.9],[19.2,22.5,-26.3],[-8.0,-5.5,9.5],[13.6,17.2,-35.8],[8.6,4.6,-19.6]]],"f28":[[87.0,11.0,330.0,254.0],"000102030410111213202122303140",[[182.5,83.7,127.6],[-107.4,-111.3,185.2],[3.3,-7.0,-20.7],[20.3,21.0,-34.7],[2.2,18.6,0.5],[-58.3,-38.9,136.3],[5.4,-6.3,-82.0],[28.1,20.4,-61.2],[9.6,14.4,3.0],[-35.7,-14.7,38.4],[17.2,12.2,-60.2],[12.8,12.0,-4.3],[-9.1,-0.4,3.2],[12.5,8.6,-16.1],[2.5,1.7,2.5]]]},"s3":{"f27":[[255.0,6.0,453.0,255.0],"000102030410111213202122303140",[[236.0,117.5,21.2],[-194.7,-136.6,373.5],[-3.9,-35.7,-41.2],[42.5,17.1,-85.8],[22.5,33.0,-4.8],[-48.3,-38.3,147.2],[-18.2,-9.7,-60.1],[39.0,23.3,-107.9],[24.6,27.9,-14.9],[-49.9,-30.4,82.2],[10.9,14.8,-72.1],[21.0,21.2,-23.7],[-11.4,-6.5,15.3],[15.6,15.8,-27.9],[10.2,3.8,0.0]]],"f28":[[212.0,11.0,455.0,254.0],"000102030410111213202122303140",[[181.8,83.5,129.1],[-107.4,-111.9,186.6],[4.3,-6.7,-21.9],[20.4,21.4,-35.6],[-0.0,19.3,0.5],[-55.4,-36.9,130.1],[4.4,-7.6,-78.9],[28.2,20.6,-61.5],[9.0,15.0,2.7],[-35.4,-14.8,33.4],[15.4,10.7,-57.6],[11.9,11.7,-2.0],[-7.8,-0.1,1.1],[11.2,7.5,-9.5],[4.6,2.3,7.7]]]},"s4":{"f27":[[378.0,6.0,579.0,255.0],"000102030410111213202122303140",[[231.8,114.2,29.8],[-192.4,-134.6,366.9],[-3.7,-37.1,-40.2],[40.4,16.2,-84.0],[19.3,33.4,-4.7],[-30.5,-24.9,112.0],[-20.8,-12.1,-47.4],[38.9,22.4,-103.0],[26.0,29.4,-17.2],[-62.1,-39.4,105.4],[8.9,13.2,-67.2],[24.5,23.4,-30.5],[-18.2,-11.3,26.0],[19.2,18.7,-37.2],[11.9,5.3,-6.1]]],"f28":[[339.0,11.0,579.0,254.0],"000102030410111213202122303140",[[182.4,83.8,128.4],[-108.7,-112.3,188.0],[5.1,-7.1,-22.8],[20.6,21.5,-35.3],[-1.6,19.3,5.2],[-58.1,-38.9,135.0],[7.6,-4.8,-89.4],[29.3,20.9,-64.9],[8.1,14.0,6.0],[-34.7,-14.2,35.2],[17.1,12.0,-62.6],[11.7,10.9,-0.4],[-8.7,-0.4,4.0],[11.3,7.6,-10.5],[2.3,1.5,11.0]]]},"s5":{"f27":[[504.0,6.0,705.0,255.0],"000102030410111213202122303140",[[230.3,113.2,34.0],[-180.8,-126.2,329.4],[-2.0,-37.1,-27.3],[37.9,13.3,-68.6],[19.2,32.4,-13.4],[-39.5,-31.4,137.9],[-30.3,-7.1,-62.5],[39.5,18.1,-84.3],[28.1,23.0,6.0],[-60.2,-42.6,109.3],[-4.7,15.1,-70.8],[23.4,16.2,0.0],[-7.4,-8.9,5.0],[6.5,19.9,-36.1],[38.4,20.1,-64.4]]],"f28":[[464.0,11.0,704.0,254.0],"000102030410111213202122303140",[[179.9,82.3,132.3],[-99.0,-105.1,163.0],[5.3,-8.2,-12.9],[18.6,18.0,-29.6],[0.0,18.3,-8.8],[-58.6,-38.7,144.2],[-2.0,-5.1,-79.4],[29.4,19.7,-50.5],[10.9,11.2,11.1],[-36.9,-19.3,28.2],[2.9,11.5,-47.6],[9.5,10.0,20.8],[1.8,0.3,-24.3],[-2.2,9.7,8.9],[28.7,11.6,-33.7]]]},"col":{"f27":[[522.0,6.0,753.0,525.0],"00010203101112202130",[[21.8,4.2,137.1],[-1.5,-5.1,32.3],[8.2,-0.3,12.9],[18.7,2.2,11.1],[-0.2,-3.9,15.9],[1.5,-3.0,-8.3],[7.2,4.5,-5.2],[2.4,-0.3,-13.8],[14.8,5.8,-5.3],[-1.2,1.2,-17.5]]],"f28":[[521.02,6.0,753.98,714.0],"00010203101112202130",[[22.9,3.2,140.1],[-6.7,-5.7,20.8],[25.1,3.6,32.2],[28.7,3.2,15.8],[5.9,-2.0,33.2],[-13.7,-7.5,-18.3],[25.6,6.0,43.3],[8.4,4.3,-18.8],[-29.3,-8.0,-84.6],[15.1,3.5,22.3]]]},"uback":{"f27":[[891.0,6.0,1029.0,429.0],"00010203101112202130",[[29.0,1.0,105.5],[12.4,-1.0,9.1],[21.4,11.0,-2.4],[24.6,14.4,-1.3],[-0.1,-3.1,3.7],[2.6,1.8,-9.7],[10.2,7.3,-8.6],[0.8,1.5,-7.9],[-1.3,-0.2,2.1],[2.2,2.0,-4.8]]],"f28":[[891.26,132.09,1028.74,429.15],"00010203101112202130",[[31.2,2.1,107.0],[11.2,-2.7,6.0],[15.3,11.4,-2.0],[7.3,2.6,1.5],[-0.1,-1.2,-0.1],[1.8,0.8,-9.0],[7.5,5.5,-4.3],[1.5,1.9,-5.6],[1.6,0.1,1.1],[-1.2,-0.6,-3.4]]]},"u":{"f27":[[756.0,6.0,1164.0,525.0],"00010203101112202130",[[87.9,53.8,87.0],[-81.6,-83.8,65.9],[13.7,1.1,17.0],[55.4,40.0,-16.9],[22.9,8.5,-30.7],[4.1,-1.7,-24.9],[47.8,41.0,-44.9],[-4.8,-1.2,-3.4],[-4.3,-3.1,-5.8],[-12.5,-5.0,17.2]]],"f28":[[756.24,132.09,1163.76,515.07],"00010203101112202130",[[79.8,45.3,93.7],[-53.3,-58.1,45.9],[-0.1,-3.1,16.6],[41.0,24.2,-11.0],[18.9,8.3,-31.1],[5.2,0.6,-23.9],[33.1,28.6,-31.5],[-3.3,-0.7,-3.3],[-2.3,-2.7,-1.9],[-11.4,-5.2,14.6]]]},"winback":{"f27":[[1443.0,267.0,1704.0,567.0],"00010203101112202130",[[49.7,10.4,92.3],[31.0,15.8,-35.3],[42.0,23.5,-23.2],[15.4,4.9,16.8],[-44.2,-14.2,11.0],[-2.4,1.4,-14.9],[10.2,2.0,19.9],[-3.3,-1.9,-1.2],[9.7,2.1,12.3],[22.1,4.8,-2.0]]]},"dome":{"f27":[[1188.0,12.0,1911.0,1071.0],"000102030410111213202122303140",[[213.6,103.7,48.4],[-158.9,-117.2,162.2],[-61.8,-42.4,46.9],[29.0,19.1,-10.8],[73.6,49.7,-26.9],[33.6,19.1,-13.4],[-61.7,-40.8,33.5],[-2.6,-2.2,-10.5],[39.8,24.3,-33.6],[-7.6,-4.9,4.0],[-24.9,-14.8,19.2],[19.4,12.7,-9.0],[-5.5,-3.2,2.7],[-4.9,-0.7,11.7],[4.0,4.0,-6.1]]],"f28":[[1188.92,38.56,1431.44,1011.42],"000102030410111213202122303140",[[193.3,91.1,55.2],[-114.8,-87.0,135.0],[-91.8,-61.4,67.6],[2.6,2.2,0.5],[95.1,61.8,-49.0],[44.0,24.6,-6.7],[-59.6,-36.5,28.7],[-20.1,-10.7,3.5],[36.9,24.4,-20.6],[4.6,0.7,-3.3],[-18.2,-11.8,6.3],[17.3,10.4,-8.5],[-5.4,-3.2,0.4],[5.7,3.5,-4.9],[-8.8,-0.4,-0.4]]]},"panel":{"f27":[[1443.0,576.0,1674.0,1071.0],"000102101120",[[242.7,137.5,21.1],[31.4,10.6,-34.2],[-28.8,-26.0,51.9],[15.6,22.3,-66.1],[7.3,2.1,-15.8],[-21.3,-7.1,86.4]]]},"t1":{"f27":[[1452.0,573.0,1704.0,825.0],"000102030410111213202122303140",[[77.2,21.3,225.2],[7.0,3.2,58.3],[15.9,11.5,-16.3],[26.2,18.5,-52.9],[28.4,21.4,-70.8],[42.7,14.4,50.1],[7.7,-2.9,2.1],[-29.2,-20.9,56.7],[-36.6,-22.6,70.4],[178.2,112.1,-302.9],[24.8,12.8,-68.4],[-48.0,-30.3,86.8],[62.8,43.0,-151.2],[-23.1,-14.8,12.0],[-91.9,-52.9,134.0]]]},"t2":{"f27":[[1452.0,828.0,1704.0,1071.0],"00010203101112202130",[[231.4,116.6,25.9],[14.1,-7.1,4.7],[4.9,-14.9,1.2],[4.0,-1.8,0.4],[1.0,-8.3,15.3],[-7.8,-16.6,6.0],[1.8,-18.2,11.5],[-0.3,4.9,-9.5],[1.4,2.6,0.4],[0.6,5.8,-4.0]]]},"t3":{"f27":[[1707.0,573.0,1911.0,825.0],"000102030410111213202122303140",[[214.1,103.7,43.1],[69.9,27.7,-45.5],[-27.0,-46.5,33.4],[-16.9,-29.1,24.8],[6.5,3.6,4.4],[-7.1,-5.7,18.1],[30.4,14.2,-33.7],[-10.5,-13.1,10.3],[-21.6,-12.9,24.2],[-13.0,-8.8,5.7],[29.6,19.8,-30.2],[0.8,3.8,0.0],[-14.7,-9.9,11.7],[24.8,20.3,-22.8],[-20.8,-8.1,20.2]]]},"t4":{"f27":[[1707.0,825.0,1911.0,1071.0],"000102030410111213202122303140",[[260.9,155.7,-33.2],[31.5,-17.8,-5.6],[-100.6,-94.4,179.7],[-53.2,-36.4,85.4],[34.5,43.0,-72.3],[-21.3,-25.7,65.0],[-82.4,-37.3,151.0],[-32.1,-14.1,30.1],[54.5,33.1,-127.4],[-93.8,-62.2,193.7],[-29.6,-7.1,41.9],[59.2,34.8,-131.9],[-45.5,-25.6,69.0],[44.6,34.3,-115.5],[21.6,17.1,-94.9]]]},"peek":{"f27":[[471.0,1026.0,1194.0,1071.0],"000102101120",[[108.7,2.4,209.4],[14.5,-4.1,35.3],[-20.4,1.0,-30.7],[68.2,29.0,6.4],[-4.9,0.5,15.1],[18.4,55.2,-131.3]]]}};

  /* ---------- outlines in board px (y down) → THREE.Shape around an anchor (y up) ---------- */
  const arc = (cx, cy, r, a0, a1, n = 48) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
  const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  const rrect = (x0, y0, x1, y1, r) => [...arc(x1 - r, y0 + r, r, -90, 0, 12), ...arc(x1 - r, y1 - r, r, 0, 90, 12), ...arc(x0 + r, y1 - r, r, 90, 180, 12), ...arc(x0 + r, y0 + r, r, 180, 270, 12)];
  const scallop = (R, W, top, bot, r) => [[R - W, top], [R, top], [R, bot], ...arc(R - W + r, bot - r, r, 90, 180, 40)];
  const dshape = (x0, cx, cy, r) => [[x0, cy - r], ...arc(cx, cy, r, -90, 90, 64), [x0, cy + r]];
  const pill = (x0, y0, x1, y1) => { const r = (y1 - y0) / 2; return [...arc(x1 - r, y0 + r, r, -90, 90, 32), ...arc(x0 + r, y0 + r, r, 90, 270, 32)]; };
  const archfill = (cx, cy, r, yb) => [...arc(cx, cy, r, 180, 360, 96), [cx + r, yb], [cx - r, yb]];
  const uRing = (cx, cy, ro, ri, top) => [[cx - ro, top], ...arc(cx, cy, ro, 180, 0, 64).slice(0), [cx + ro, top], [cx + ri, top], ...arc(cx, cy, ri, 0, 180, 40), [cx - ri, top]];
  const ushape = (cx, cy, ro, top) => [[cx - ro, top], [cx + ro, top], ...arc(cx, cy, ro, 0, 180, 64)];
  const qdisc = (cx, cy, r, q) => { const a = { br: 0, bl: 90, tl: 180, tr: 270 }[q]; return [[cx, cy], ...arc(cx, cy, r, a, a + 90, 48)]; };
  const clean = pts => { const o = []; for (const p of pts) if (!o.length || Math.hypot(p[0] - o.at(-1)[0], p[1] - o.at(-1)[1]) > 1e-3) o.push(p);
    if (o.length > 2 && Math.hypot(o[0][0] - o.at(-1)[0], o[0][1] - o.at(-1)[1]) < 1e-3) o.pop(); return o; };
  const shapeOf = (pts, at, holes = []) => {
    const s = new THREE.Shape(); clean(pts).forEach(([x, y], i) => i ? s.lineTo(x - at[0], at[1] - y) : s.moveTo(x - at[0], at[1] - y));
    for (const h of holes) { const p = new THREE.Path(); clean(h).reverse().forEach(([x, y], i) => i ? p.lineTo(x - at[0], at[1] - y) : p.moveTo(x - at[0], at[1] - y)); s.holes.push(p); }
    return s;
  };

  /* ---------- the field shader (hooked into the engine's piece material, as f14) ---------- */
  const f1 = x => (Math.abs(x) < 1e-9 ? 0 : x).toFixed(3);
  const glslFit = (fn, F) => { const [[x0, y0, x1, y1], T, c] = F, terms = [];
    for (let k = 0; k < T.length / 2; k++) { const i = +T[2 * k], j = +T[2 * k + 1], m = [...Array(i).fill('u'), ...Array(j).fill('v')].join(' * ');
      terms.push(`vec3(${c[k].map(f1).join(', ')})${m ? ' * ' + m : ''}`); }
    return `vec3 ${fn}(vec2 b) { vec2 q = clamp((b - vec2(${f1(x0)}, ${f1(y0)})) / vec2(${f1(x1 - x0)}, ${f1(y1 - y0)}), 0.0, 1.0); float u = q.x, v = q.y;\n  return clamp((${terms.join(' + ')}) / 255.0, 0.0, 1.0); }\n`; };
  const hook = (m, head, body) => { const fs = m.fragmentShader.replace('#include <logdepthbuf_pars_fragment>', '#include <logdepthbuf_pars_fragment>\n' + head)
      .replace('gl_FragColor = vec4(col * shade, op);', body);
    if (fs === m.fragmentShader) throw new Error('f27: engine shader changed; the board fields could not hook it');
    m.fragmentShader = fs; m.needsUpdate = true; return m; };
  const TK27 = h27.tk, TK28 = h28.tk;
  const fieldMat = (m, name, at, sd, alpha) => {
    const F = FIT[name] || {};
    m.uniforms.ban = { value: new THREE.Vector2(...at) }; m.uniforms.bsd = { value: new THREE.Vector2(...sd) };
    m.uniforms.bT = { value: TK27 }; m.uniforms.bT2 = { value: TK28 }; m.uniforms.bmix = { value: 0 };
    const has27 = !!F.f27, has28 = !!F.f28;
    const head = 'uniform vec2 ban, bsd; uniform float bT, bT2, bmix;\n' + (has27 ? glslFit('fA', F.f27) : '') + (has28 ? glslFit('fB', F.f28) : '');
    // (the backdrop's field is only pinned by the board where the backdrop shows; below and right of board 27, where the
    // crane sees it, it ran to hot pink, so it is held to the board's backdrop range there: navy / indigo / violet)
    const col = alpha ? alpha.col : name === 'bg' ? 'min(fA(bp + d1), vec3(0.36, 0.16, 1.0))' : 'fA(bp + d1)';
    const body = `vec2 bp = vec2(ban.x + vO.x, ban.y - vO.y); float fl = min(flow, 1.6);
  vec2 d1 = bsd * fl * (sin((t - bT) * spd / per * 6.2832 + ph) - sin(ph));
  vec3 cc = ${col};
  ${has28 ? 'vec2 d2 = bsd * fl * (sin((t - bT2) * spd / per * 6.2832 + ph) - sin(ph)); cc = mix(cc, fB(bp + d2), bmix);' : ''}
  gl_FragColor = vec4(cc * shade, ${alpha ? `op * ${alpha.a}` : 'op'});`;
    return hook(m, head, body);
  };

  /* ---------- the carry into board 28: glide + scale during the camera's truck (same ease as the camera: Hermite, still ends) ---------- */
  const T0 = h27.t1, T1 = h28.t0;                                      // 125.2 → 126.8 (the colour cross-fade)
  // the glide rides the camera's own truck (g6.js sets G.carryE once the camera is built: 0 at 27's pose, 1 at 28's; the
  // camera eases through both boards without stopping), else a plain ease between the two key instants
  const E28 = t => G.carryE ? G.carryE(t) : (G.smoother || smooth)((t - h27.tk) / (h28.tk - h27.tk));
  const DZ = h27.pos.clone().sub(h28.pos).dot(h27.fwd);                // depth from camera 28 = depth from camera 27 + DZ (0.59)
  const MAP = {                                                        // board 27 px → board 28 px: A28 + (p − A27)·s (measured on both boards)
    D: { A27: [140, 770], A28: [250, 820], s: [350 / 310, 350 / 310] },
    cup: { A27: [-230, 381], A28: [-75, 395], s: [1.22, 1.226] },
    cslot: { A27: [275, 373], A28: [540, 395], s: [1.141, 130 / 110] },
    col: { A27: [637.5, 540], A28: [945, 540], s: [230 / 235, 1] },
    u: { A27: [960, 360], A28: [1368, 284.5], s: [1.222, 1.222] },
    dome: { A27: [1572, 395], A28: [2064, 400], s: [418 / 384, 418 / 384] },
  };
  const SC = [202, 330, 455, 580, 706], SC28 = [443, 597, 750, 904, 1058], SDEP = [75.8, 67.6, 60.5, 54.4, 49.5];
  SC.forEach((R, i) => { MAP['s' + (i + 1)] = { A27: [R, 255], A28: [SC28[i], 250], s: [1, 1], widen: 243 - 202 }; });
  // Carried pieces are flat at BOTH holds: each back-face vertex lies on camera 27's ray through its front vertex at hold 27,
  // and moves onto camera 28's ray by hold 28 (so no side shows on either board; they open up only mid-move)
  const carries = [];
  const carry = (pc, map, at, depth, colour = true) => {
    const at28 = [map.A28[0] + (at[0] - map.A27[0]) * map.s[0], map.A28[1] + (at[1] - map.A27[1]) * map.s[1]];
    const W27 = h27.at(at[0], at[1], depth), off = h28.at(at28[0], at28[1], depth + DZ).sub(W27), k = (depth + DZ) / depth;
    const c = { pc, off, mx: map.s[0] * k, my: map.s[1] * k, colour, widen: map.widen || 0, orig: pc.orig, lastE: -1 };
    const k0 = depth * h27.tanV / 540;                                 // world units per local px at home
    const loc = (cam, pos, sx, sy) => { const d = cam.clone().sub(pos); return [d.dot(h27.right) / (k0 * sx), d.dot(h27.upv) / (k0 * sy), -d.dot(h27.fwd) / k0]; };
    c.C27 = loc(h27.pos, W27, 1, 1); c.C28 = loc(h28.pos, W27.clone().add(off), c.mx, c.my);
    let zb = 0; for (let i = 2; i < c.orig.length; i += 3) zb = Math.min(zb, c.orig[i]); c.zb = zb;
    shapeAt(c, 0); carries.push(c); return pc;
  };
  const shapeAt = (c, e) => {
    if (Math.abs(e - c.lastE) < 1e-5) return; c.lastE = e;
    const p = c.pc.mesh.geometry.attributes.position, O = c.orig, w = c.widen * e, A = c.C27, B = c.C28;
    for (let i = 0; i < p.count; i++) {
      let x = O[3 * i], y = O[3 * i + 1]; const z = O[3 * i + 2];
      if (w) x -= w * Math.min(1, Math.max(0, -x / 2));                // scallops: the round part moves left, the straight part stretches
      if (c.zb < -1e-6 && z < c.zb / 2) {
        const a = (A[2] - z) / A[2], b = (B[2] - z) / B[2];
        const x27 = A[0] + (x - A[0]) * a, y27 = A[1] + (y - A[1]) * a, x28 = B[0] + (x - B[0]) * b, y28 = B[1] + (y - B[1]) * b;
        x = x27 + (x28 - x27) * e; y = y27 + (y28 - y27) * e;
      }
      p.array[3 * i] = x; p.array[3 * i + 1] = y;
    }
    p.needsUpdate = true;
  };

  /* ---------- pieces ---------- */
  const all = [];
  const P = (name, spec, sd = [12, 8], alpha) => {
    const at = spec.at, pc = V.piece({ hold: 27, drift: 3, ...spec, shape: shapeOf(spec.pts, at, spec.holes || []), grad: '#7b2bf9' });
    pc.orig = Float32Array.from(pc.mesh.geometry.attributes.position.array);   // before flattening (a carried piece re-flattens itself)
    if (spec.flat !== false) flatGeo(pc.mesh.geometry, 27, at, spec.depth);
    fieldMat(pc.mesh.material, name, at, sd, alpha);
    pc.name = name; all.push(pc); return pc;
  };
  // (the opacity ramp is short, 0.08 s, so the pieces read as solid puzzle pieces arriving, not translucent double exposures)
  const inK = (a, b, o, ease = 'power3.out') => { const k = {}; for (const [ch, v0] of Object.entries(o)) k[ch] = [[a, v0], [b, 0, ease]]; k.op = [[a, 0], [a + 0.08, 1, 'sine.out']]; return k; };
  const fadeOut = (k, a, b) => { k.op = (k.op || [[0, 1]]).concat([[a, 1], [b, 0, 'sine.inOut']]); return k; };
  const flyOut = (a, b) => ({ type: 'fly', t: [a, b], dz: 22 });

  // backdrop (deep indigo / violet; navy up the middle): fades in as plate 27 did, and out as board 28's own backdrop takes over
  const bg = P('bg', { pts: rect(-1400, -1100, 3300, 2200), at: [960, 540], depth: 100, thick: 0, drift: 0, flat: false,
    keys: { op: [[118.9, 0], [119.4, 1, 'sine.inOut'], [125.8, 1], [126.9, 0, 'sine.inOut']] } }, [20, 12]);
  bg.mesh.renderOrder = -3;

  // the D (lower left) and its slot: swing in from the left
  const kD = () => inK(120.4, 121.9, { x: -500, y: 300, r: -60 });
  carry(P('D', { pts: dshape(-700, 140, 770, 310), at: [140, 770], depth: 90, thick: 3, keys: kD(), out: flyOut(129.55, 130.55) }), MAP.D, [140, 770], 90);
  carry(P('Dslot', { pts: pill(-300, 665, 240, 880), at: [140, 770], depth: 89.5, thick: 0.4, keys: fadeOut(kD(), 125.4, 126.2) }), MAP.D, [140, 770], 89.5, false);
  // the ⊂ (the B's upper bowl), its slot and the maroon nub above it: slide in from the left, turning
  const CA = [-230, 381], kC = () => inK(120.9, 122.2, { x: -600, r: 30 });
  carry(P('nub', { pts: rect(-300, 30, 70, 236), at: CA, depth: 82.3, thick: 0.4, keys: fadeOut(kC(), 125.4, 126.2) }), MAP.cup, CA, 82.3, false);   // just behind the ⊂'s back
  carry(P('cup', { pts: pill(-230, 222, 700, 540), at: CA, depth: 80, thick: 2, keys: kC(), out: flyOut(129.65, 130.6) }), MAP.cup, CA, 80);
  carry(P('cslot', { pts: pill(-150, 318, 275, 428), at: CA, depth: 79.5, thick: 0.4, keys: kC(), out: flyOut(129.65, 130.6) }), MAP.cslot, CA, 79.5);
  // the blue column behind the scallops: rises from below
  carry(P('col', { pts: rect(520, -420, 755, 1300), at: [637.5, 540], depth: 58, thick: 2, keys: inK(119.7, 121.1, { y: 900 }), out: flyOut(129.75, 130.7) }), MAP.col, [637.5, 540], 58);
  // the five scallops: drop in stacked at the fifth's place, then fan out to theirs (each finds its slot past the others)
  SC.forEach((R, i) => {
    const at = [R, 255], a = 121.9 + 0.05 * (4 - i), f0 = 122.35 + 0.08 * (4 - i), f1v = f0 + 0.75;
    const keys = { y: [[a, -650], [a + 0.55, 0, 'power3.out']], x: [[f0, SC[4] - R], [f1v, 0, 'power2.inOut']], r: [[a, 24 - 4 * i], [f1v, 0, 'power2.out']], op: [[a, 0], [a + 0.2, 1, 'sine.out']] };
    carry(P('s' + (i + 1), { pts: scallop(R, 202, -420, 255, 200), at, depth: SDEP[i], thick: 2, keys, out: flyOut(129.5 + 0.07 * i, 130.45 + 0.07 * i) }, [14, 8]), MAP['s' + (i + 1)], at, SDEP[i]);
  });
  // the ∪ (top centre; its channel is a separate back piece): rises spinning half a turn
  const UA = [960, 360], kU = () => inK(120.3, 121.9, { y: 700, r: 180 });
  carry(P('uback', { pts: ushape(960, 360, 90, -420), at: UA, depth: 39.9, thick: 1, keys: kU(), out: flyOut(129.7, 130.65) }), MAP.u, UA, 39.9);
  carry(P('u', { pts: uRing(960, 360, 205, 70, -420), at: UA, depth: 39.6, thick: 0.25, keys: kU(), out: flyOut(129.7, 130.65) }), MAP.u, UA, 39.6);
  // the dome with its arched window (a recess: the dome is 1.4 thick, the window's back wall behind it): slides in turning
  const DA = [1572, 395], kDome = () => inK(119.8, 121.5, { x: 1400, y: 700, r: -40 });   // (starts off frame right, so it slides in solid)
  const win = archfill(1572.5, 397.5, 131.5, 575);
  const wb = carry(P('winback', { pts: rrect(1421, 246, 1724, 585, 60), at: DA, depth: 40.0, thick: 0.5, keys: fadeOut(kDome(), 126.0, 126.7) }), MAP.dome, DA, 40.0, false);
  carry(P('dome', { pts: archfill(1572, 395, 384, 1300), holes: [win], at: DA, depth: 38.4, thick: 1.4, keys: kDome(), out: flyOut(129.6, 130.6) }), MAP.dome, DA, 38.4);
  // the lilac bars (translucent; they fade out down in the window): drop into the dome
  const BARS = [[1466, 1492], [1526, 1550], [1586, 1610], [1646, 1670]];
  BARS.forEach(([a, b], i) => carry(P('bar' + (i + 1), { pts: rrect(a, -420, b, 398, (b - a) / 2 - 0.5), at: DA, depth: 38.2 - 0.02 * i, thick: 0, op: 0.998,
    keys: fadeOut(inK(122.85 + 0.13 * i, 123.35 + 0.13 * i, { y: -760 }, 'power2.out'), 126.0, 126.6) }, [0, 0],
    { col: 'vec3(0.384, 0.078, 0.604)', a: '0.67 * (1.0 - smoothstep(305.0, 350.0, bp.y))' }), MAP.dome, DA, 38.2, false));
  // the orange panel behind the left tiles: rises in with the tiles as they re-form (a bare orange slab in the dome for
  // 2.5 s before, it read as a placeholder)
  carry(P('panel', { pts: rect(1441, 575, 1705, 1095), at: DA, depth: 37.95, thick: 0.35, keys: fadeOut(inK(122.35, 123.0, { y: 560 }, 'power2.out'), 126.0, 126.7) }), MAP.dome, DA, 37.95, false);
  // the 2×2 quarter-disc tiles: f25's tumbling tiles re-form here at T_SET (same pose, within 2.5 px: these meet at the board's
  // seam x 1705 with no gap); these appear just behind them then
  const T_SET = (G.tiles25 && G.tiles25.T_SET) || 123.05;
  [[1705, 572.5, 'bl'], [1705, 826, 'bl'], [1705, 826, 'tr'], [1705, 1079.5, 'tr']].forEach(([cx, cy, q], i) =>
    carry(P('t' + (i + 1), { pts: qdisc(cx, cy, 255, q), at: DA, depth: 37.3, thick: 0.5, drift: 1.5, keys: { op: [[T_SET - 0.001, 0], [T_SET, 1], [126.0, 1], [126.7, 0, 'sine.inOut']] } }), MAP.dome, DA, 37.3, false));
  // board 28's block peeking out under the picture box (f28 builds the block itself): rises, then gives way to it
  P('peek', { pts: rect(520, 1000, 1195, 1130), at: [832, 1065], depth: 36.9, thick: 0.5, keys: fadeOut(inK(122.3, 123.2, { x: -760 }), 125.4, 126.2) });   // square-ended as the board's strip (from x 520)

  /* ---------- the ledge: the sphere lands on it in the window; it runs out ahead of it and rolls up behind it ---------- */
  // its colour: inside the window, the window's own field at the pixel it covers in hold 27's view (so at the hold it can't be
  // told from the window behind it); out of the window, maroon turning orange toward the block's end
  const yTop = M27.y - 1, xF = M27.x + 0.3, xB = M27.x - 0.6;          // top = the sphere's contact; shallow, so its end faces stay inside the window at the hold
  const zOf = (px, d) => h27.at(px, 478, d).z;
  const zWallR = zOf(1696, h27.depth - 0.3), zWallL = zOf(1455, h27.depth + 0.6), zEnd = M28.z - 5.1;   // window walls; ~5 u onto 28's block
  const lm = mat(['#6a2b38'], { flat: true }), wu = wb.mesh.material.uniforms;
  Object.assign(lm.uniforms, { hcam: { value: h27.pos.clone() }, hfw: { value: h27.fwd.clone() }, hri: { value: h27.right.clone() }, hup: { value: h27.upv.clone() },
    htan: { value: h27.tanV }, wbsd: { value: wu.bsd.value.clone() }, wper: { value: wu.per.value }, wph: { value: wu.ph.value }, bT: { value: TK27 },
    zw: { value: zWallL + 0.2 }, zk: { value: zOf(1650 - 440, h27.depth) } });
  hook(lm, 'uniform vec3 hcam, hfw, hri, hup; uniform float htan, wper, wph, bT, zw, zk; uniform vec2 wbsd;\n' + glslFit('fW', FIT.winback.f27),
    `vec3 dd = vW - hcam; float zz = dot(dd, hfw);
  vec2 bp = vec2(960.0 + dot(dd, hri) / zz / htan * 540.0, 540.0 - dot(dd, hup) / zz / htan * 540.0);
  vec2 d1 = wbsd * min(flow, 1.6) * (sin((t - bT) * spd / wper * 6.2832 + wph) - sin(wph));
  vec3 cout = mix(vec3(0.5, 0.17, 0.2), vec3(0.94, 0.4, 0.07), smoothstep(zw, zk, vW.z));   // maroon → the orange of 28's block top at its right end
  gl_FragColor = vec4(mix(fW(bp + d1), cout, smoothstep(zw - 0.3, zw + 0.3, vW.z)), op);`);
  const ledge = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), lm); ledge.frustumCulled = false; scene.add(ledge);
  const ez = gsap.parseEase('power2.out');

  anim((t, b) => {
    // the carry
    const e = E28(t);
    for (const c of carries) {
      const m = c.pc.mesh;
      shapeAt(c, e);
      if (c.colour) m.material.uniforms.bmix.value = smooth((t - T0 - 0.1) / (T1 - T0 - 0.2));
      if (!m.visible || e <= 0) continue;
      m.position.addScaledVector(c.off, e); m.scale.x *= 1 + (c.mx - 1) * e; m.scale.y *= 1 + (c.my - 1) * e;
    }
    // the ledge
    let zL = zWallL, zR = zWallR;
    if (t > 124.95) zL = zWallL + (zEnd - zWallL) * ez(Math.min(1, (t - 124.95) / 0.75));
    if (t > 125.05) zR = Math.max(zWallR, b.p.z - 1.7);
    const on = t > 122.4 && t < 126.9 && zL - zR > 0.02;
    ledge.visible = on;
    if (on) { ledge.position.set((xF + xB) / 2, yTop - 0.175, (zL + zR) / 2); ledge.scale.set(xF - xB, 0.35, zL - zR); lm.uniforms.op.value = 1; }
  });
  G.f27 = { pieces: all, MAP, carries };                               // for f28 / the integrator (the shared shapes and how they land on board 28)
};
