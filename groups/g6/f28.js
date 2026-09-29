/* Frame 28 · the sphere rolls in from the window along the block top, over the block's rounded corner, and drops off
   toward the ramp far below (G6, called from g6.js with its context G). Built: the real set, no plate.
   · The block is real 3D: a slab extruded straight back along the hold camera's view (−x), its front face 1.2 u in front
     of the sphere's plane, 4.2 u deep. Its top face is the sphere's track (y = the sphere's centre − 1 + a 0.04 lip) and
     its rounded top-left corner is a cylinder concentric with the journey's arc (arcC, ball-centre radius ARC_R), so the
     sphere rolls on it exactly from the window (27) round the corner to PHI1, where it flies off. It runs down to
     y ≈ 12, a tower above the ramp's top end. From the hold camera (which sits inside the block's cross-section) only
     the front face shows, so it reads flat. The corner is board 28's (g6.js solves the arc against it: r ≈ 368 px about
     (1189.5, 836.5) on the front face, the sphere ~12° round it at the key instant); the top rises gently (G.EA ≈ 0.15 u)
     from the block's right end to the corner's top, as the sphere's path does.
   · The donut (a proud ring, 0.22 u off the face) and its inner disc sit on the block's front face.
   · Board 28's other shapes of mine, as pieces (flat at the hold, chunky sides and parallax while moving): the lower-left
     group inside f27's D (the violet pill, the magenta ⊂ cap and arm, the pink bar, the salmon band, the blue-violet
     patch at the left edge; just in front of the D, depth ~90) and board 28's backdrop (the maroon strip at the left edge, the
     orange → indigo field, the navy top right; depth ~120, behind everything). The scallops, the blue column, the gold ⊂
     and its slot, the D, the tall ∪ and the right dome are f27's: they carry from board 27 into board 28 (G.f27).
   · Colour: every piece takes board 28's colours from a smooth field fitted to the board over the piece's visible area
     (least squares in board px, copy and sphere masked; mean error ~1–4 / 255), sampled where the point sits in the
     hold view (so the sides take their edge colours and shade darker in motion). The colours flow slowly (living),
     exactly on the board at the key instant (127.1).
   · In (the 27 → 28 truck): the block rises from below into place (125.2–125.84) just before the sphere comes off f27's
     ledge onto it (~125.87); the donut spins in and its disc grows; the lower-left group rises in from the bottom; the
     backdrop fades in behind f27's (which fades 125.8–126.9). Out (the crane down): the block stays in the world (the
     sphere has just fallen from it; the camera drops away past it) and goes at 131.3 once it is far out of view (it
     would otherwise show in 30's reverse view); the lower-left group and the backdrop fly back with f27's shared shapes
     (129.5–130.6).
   The journey (holds, the sphere's path, camera keys, captions) stays in g6.js. */
export default (V, G) => {
  const { THREE, v3, h28, arcC, ARC_R, flatGeo, proj } = G;
  const SH = V.S, O = V.O, TK = h28.tk;

  /* ---------- board 28's colour fields (fitted; board px). T: the terms u^i·v^j as 'ij' pairs over the box (u, v: 0–1),
     c: their RGB coefficients (0–255); xs: [from, to] board x for a field that changes at a sharp vertical edge ---------- */
  const DATA = {
    bgL: { outer: [[-900,-700],[127.5,-700],[127.5,1780],[-900,1780]], holes: [], fields: [{ xs: [null, null], box: [19, 19, 121, 743], T: '000102030410111213202122303140', c: [[92.7, 31.4, 53.7], [-104.9, -44.6, 21.1], [-158.2, 12.9, 279.7], [353.4, 58.3, -613.6], [-60.2, -25.7, 385.5], [-15.7, -2.5, 4.2], [21.7, 15.6, -21.6], [-15.3, 0.4, 23.4], [9.3, -12.1, -9.5], [-2.7, -3.4, 10.9], [11.3, -7.3, 6.1], [-12.7, 7.6, -9.2], [8.5, 2.9, -17.8], [0.9, -0.5, 2.9], [-5.9, -0.8, 8.9]] }] },
    bgM: { outer: [[107.5,-700],[1060,-700],[1060,1780],[107.5,1780]], holes: [], fields: [{ xs: [null, null], box: [135, 19, 823, 1063], T: '00010203101112202130', c: [[189.2, 91.2, 55.7], [-191.1, 18.4, -125.3], [414.6, -90.4, 456.6], [-204.9, 79.1, -280.4], [-159.9, -157.7, 45], [87.8, 65.4, 47.5], [3.7, -96.2, 134.9], [-71.2, 53.8, 52.1], [-137.6, 35.8, -275.9], [117.8, 5.8, 8]] }] },
    bgR: { outer: [[1040,-700],[2800,-700],[2800,1780],[1040,1780]], holes: [], fields: [{ xs: [null, null], box: [1067, 19, 1841, 467], T: '000102030410111213202122303140', c: [[21.2, 1, 131.5], [22.2, -1.5, 8.5], [-33.1, -3.6, 14.8], [82.7, 10.9, 15], [-43.9, -9.9, -0.8], [31.3, -17.6, -83.4], [-7.9, 10.7, -18.9], [123.9, 77.6, -58.5], [-26, 5.7, -33.8], [20.1, 75.2, 36.2], [30.9, 21.4, -48.6], [-59, -56.4, 50.7], [-114, -107, 22.3], [-17.7, -36.1, 41.8], [54.6, 48.9, -6.8]] }] },
    block: { fields: [{ xs: [null, null], box: [833, 479, 1639, 1063], T: '000102030410111213202122303140', c: [[176.9, 30.4, 129.7], [-25.6, -7.4, 75.9], [-23.8, -31.7, -1], [-4.1, 18.6, 35.6], [3, -4.2, -21.6], [10.6, 24.8, 22.7], [57.9, -10.4, -212.4], [-59.2, 2.1, 134.6], [2.3, -16.7, 63.9], [48.3, 17.7, -209.6], [-96.6, 38.5, 321], [34.5, 13.1, -131.8], [82.3, 88.1, -35], [70.2, -19.8, -178.8], [-72.8, -56.4, 101.5]] }] },
    disc: { outer: [[1483,890],[1482.5,905.2],[1481,920.4],[1478.5,935.5],[1475.1,950.3],[1470.6,964.9],[1465.3,979.2],[1459,993.1],[1451.8,1006.5],[1443.7,1019.4],[1434.9,1031.8],[1425.2,1043.6],[1414.8,1054.8],[1403.6,1065.2],[1391.8,1074.9],[1379.4,1083.7],[1366.5,1091.8],[1353.1,1099],[1339.2,1105.3],[1324.9,1110.6],[1310.3,1115.1],[1295.5,1118.5],[1280.4,1121],[1265.2,1122.5],[1250,1123],[1234.8,1122.5],[1219.6,1121],[1204.5,1118.5],[1189.7,1115.1],[1175.1,1110.6],[1160.8,1105.3],[1146.9,1099],[1133.5,1091.8],[1120.6,1083.7],[1108.2,1074.9],[1096.4,1065.2],[1085.2,1054.8],[1074.8,1043.6],[1065.1,1031.8],[1056.3,1019.4],[1048.2,1006.5],[1041,993.1],[1034.7,979.2],[1029.4,964.9],[1024.9,950.3],[1021.5,935.5],[1019,920.4],[1017.5,905.2],[1017,890],[1017.5,874.8],[1019,859.6],[1021.5,844.5],[1024.9,829.7],[1029.4,815.1],[1034.7,800.8],[1041,786.9],[1048.2,773.5],[1056.3,760.6],[1065.1,748.2],[1074.8,736.4],[1085.2,725.2],[1096.4,714.8],[1108.2,705.1],[1120.6,696.3],[1133.5,688.2],[1146.9,681],[1160.8,674.7],[1175.1,669.4],[1189.7,664.9],[1204.5,661.5],[1219.6,659],[1234.8,657.5],[1250,657],[1265.2,657.5],[1280.4,659],[1295.5,661.5],[1310.3,664.9],[1324.9,669.4],[1339.2,674.7],[1353.1,681],[1366.5,688.2],[1379.4,696.3],[1391.8,705.1],[1403.6,714.8],[1414.8,725.2],[1425.2,736.4],[1434.9,748.2],[1443.7,760.6],[1451.8,773.5],[1459,786.9],[1465.3,800.8],[1470.6,815.1],[1475.1,829.7],[1478.5,844.5],[1481,859.6],[1482.5,874.8]], holes: [], fields: [{ xs: [null, null], box: [1025, 665, 1475, 1063], T: '00010203101112202130', c: [[86.4, 18.3, 105.8], [14.7, 16.9, -21.8], [-42.5, -37.5, 71.6], [17, 16.8, -31.9], [-22.8, -61.3, 228], [-11.6, -11.8, 17.4], [20, 17.1, -24.9], [123, 114.2, -233.5], [-14.6, -8.3, 22.8], [37.8, 31.1, -63.3]] }] },
    ring: { outer: [[1560,890],[1559.3,910.3],[1557.3,930.5],[1554,950.5],[1549.4,970.2],[1543.5,989.6],[1536.4,1008.6],[1528,1027.1],[1518.5,1045],[1507.8,1062.2],[1495.9,1078.7],[1483.1,1094.4],[1469.2,1109.2],[1454.4,1123.1],[1438.7,1135.9],[1422.2,1147.8],[1405,1158.5],[1387.1,1168],[1368.6,1176.4],[1349.6,1183.5],[1330.2,1189.4],[1310.5,1194],[1290.5,1197.3],[1270.3,1199.3],[1250,1200],[1229.7,1199.3],[1209.5,1197.3],[1189.5,1194],[1169.8,1189.4],[1150.4,1183.5],[1131.4,1176.4],[1112.9,1168],[1095,1158.5],[1077.8,1147.8],[1061.3,1135.9],[1045.6,1123.1],[1030.8,1109.2],[1016.9,1094.4],[1004.1,1078.7],[992.2,1062.2],[981.5,1045],[972,1027.1],[963.6,1008.6],[956.5,989.6],[950.6,970.2],[946,950.5],[942.7,930.5],[940.7,910.3],[940,890],[940.7,869.7],[942.7,849.5],[946,829.5],[950.6,809.8],[956.5,790.4],[963.6,771.4],[972,752.9],[981.5,735],[992.2,717.8],[1004.1,701.3],[1016.9,685.6],[1030.8,670.8],[1045.6,656.9],[1061.3,644.1],[1077.8,632.2],[1095,621.5],[1112.9,612],[1131.4,603.6],[1150.4,596.5],[1169.8,590.6],[1189.5,586],[1209.5,582.7],[1229.7,580.7],[1250,580],[1270.3,580.7],[1290.5,582.7],[1310.5,586],[1330.2,590.6],[1349.6,596.5],[1368.6,603.6],[1387.1,612],[1405,621.5],[1422.2,632.2],[1438.7,644.1],[1454.4,656.9],[1469.2,670.8],[1483.1,685.6],[1495.9,701.3],[1507.8,717.8],[1518.5,735],[1528,752.9],[1536.4,771.4],[1543.5,790.4],[1549.4,809.8],[1554,829.5],[1557.3,849.5],[1559.3,869.7]], holes: [[[1481,890],[1480.5,905.1],[1479,920.2],[1476.6,935.1],[1473.1,949.8],[1468.7,964.3],[1463.4,978.4],[1457.2,992.2],[1450.1,1005.5],[1442.1,1018.3],[1433.3,1030.6],[1423.7,1042.3],[1413.3,1053.3],[1402.3,1063.7],[1390.6,1073.3],[1378.3,1082.1],[1365.5,1090.1],[1352.2,1097.2],[1338.4,1103.4],[1324.3,1108.7],[1309.8,1113.1],[1295.1,1116.6],[1280.2,1119],[1265.1,1120.5],[1250,1121],[1234.9,1120.5],[1219.8,1119],[1204.9,1116.6],[1190.2,1113.1],[1175.7,1108.7],[1161.6,1103.4],[1147.8,1097.2],[1134.5,1090.1],[1121.7,1082.1],[1109.4,1073.3],[1097.7,1063.7],[1086.7,1053.3],[1076.3,1042.3],[1066.7,1030.6],[1057.9,1018.3],[1049.9,1005.5],[1042.8,992.2],[1036.6,978.4],[1031.3,964.3],[1026.9,949.8],[1023.4,935.1],[1021,920.2],[1019.5,905.1],[1019,890],[1019.5,874.9],[1021,859.8],[1023.4,844.9],[1026.9,830.2],[1031.3,815.7],[1036.6,801.6],[1042.8,787.8],[1049.9,774.5],[1057.9,761.7],[1066.7,749.4],[1076.3,737.7],[1086.7,726.7],[1097.7,716.3],[1109.4,706.7],[1121.7,697.9],[1134.5,689.9],[1147.8,682.8],[1161.6,676.6],[1175.7,671.3],[1190.2,666.9],[1204.9,663.4],[1219.8,661],[1234.9,659.5],[1250,659],[1265.1,659.5],[1280.2,661],[1295.1,663.4],[1309.8,666.9],[1324.3,671.3],[1338.4,676.6],[1352.2,682.8],[1365.5,689.9],[1378.3,697.9],[1390.6,706.7],[1402.3,716.3],[1413.3,726.7],[1423.7,737.7],[1433.3,749.4],[1442.1,761.7],[1450.1,774.5],[1457.2,787.8],[1463.4,801.6],[1468.7,815.7],[1473.1,830.2],[1476.6,844.9],[1479,859.8],[1480.5,874.9]]], fields: [{ xs: [null, null], box: [947, 615, 1553, 1063], T: '000102030410111213202122303140', c: [[205.8, 78.2, 79.4], [-79.4, -45.9, 132.1], [-726, -483.4, 294.4], [1317.2, 862.4, -513.9], [-610, -401, 233.9], [68.5, 75.3, -36.3], [-55.3, -102.8, 24], [-51.1, 10.2, 31.5], [96.8, 60, -36.1], [-303.8, -253.8, 65], [132.2, 183, -65.6], [-136.4, -117.2, 48.5], [494.4, 372.2, -125.9], [33.9, -26, -1.4], [-259.3, -180.4, 67.3]] }] },
    R1: { outer: [[127.5,862],[127.5,750],[284,750],[287.7,750.1],[291.3,750.5],[294.9,751.1],[298.5,751.9],[302,753],[305.4,754.3],[308.8,755.8],[312,757.5],[315.1,759.4],[318.1,761.6],[320.9,763.9],[323.6,766.4],[326.1,769.1],[328.4,771.9],[330.6,774.9],[332.5,778],[334.2,781.2],[335.7,784.6],[337,788],[338.1,791.5],[338.9,795.1],[339.5,798.7],[339.9,802.3],[340,806],[339.9,809.7],[339.5,813.3],[338.9,816.9],[338.1,820.5],[337,824],[335.7,827.4],[334.2,830.8],[332.5,834],[330.6,837.1],[328.4,840.1],[326.1,842.9],[323.6,845.6],[320.9,848.1],[318.1,850.4],[315.1,852.6],[312,854.5],[308.8,856.2],[305.4,857.7],[302,859],[298.5,860.1],[294.9,860.9],[291.3,861.5],[287.7,861.9],[284,862]], holes: [], fields: [{ xs: [null, null], box: [133, 757, 333, 855], T: '00010203101112202130', c: [[177.8, 87.5, 83.3], [4.7, 4.5, 28], [20.4, -14.5, -15], [-25.1, 5.9, 14.9], [-35.3, -38.6, 13.9], [33.6, 4.6, 6.5], [88.6, 17.2, -17.9], [-77.2, -24.5, 62.7], [-190.5, -34.8, 33.6], [163.1, 42.8, -69.8]] }] },
    R0: { outer: [[-100,750],[135,750],[135,1016],[-100,1016]], holes: [], fields: [{ xs: [null, null], box: [19, 757, 119, 919], T: '00010203101112202130', c: [[63.3, 12.8, 146.6], [47.6, -8, 105.3], [16.6, -4.1, -10.1], [-18.2, 3.3, -14.1], [-11, 4.5, 3.6], [13.7, -2.9, -24.1], [-15.3, 2.7, 13.6], [21, -5.4, -0.9], [-3, 0.1, 14.1], [-13.1, 2.3, -1.1]] }] },
    R2: { outer: [[0,1010],[0.2,1002.6],[0.7,995.3],[1.6,988],[2.9,980.7],[4.5,973.6],[6.5,966.5],[8.8,959.5],[11.4,952.6],[14.4,945.9],[17.7,939.3],[21.3,932.9],[25.3,926.7],[29.5,920.6],[34,914.8],[38.9,909.3],[43.9,903.9],[49.3,898.9],[54.8,894],[60.6,889.5],[66.7,885.3],[72.9,881.3],[79.3,877.7],[85.9,874.4],[92.6,871.4],[99.5,868.8],[106.5,866.5],[113.6,864.5],[120.7,862.9],[128,861.6],[135.3,860.7],[142.6,860.2],[150,860],[288.5,860],[295.4,857.4],[302.1,858.8],[308.6,861],[314.8,864],[320.5,867.8],[325.6,872.4],[330.2,877.5],[334,883.2],[337,889.4],[339.2,895.9],[340.6,902.6],[341,909.5],[340.6,916.4],[339.2,923.1],[337,929.6],[334,935.8],[330.2,941.5],[325.6,946.6],[320.5,951.2],[314.8,955],[308.6,958],[302.1,960.2],[295.4,961.6],[288.5,962],[135,962],[135,1016],[1,1016]], holes: [], fields: [{ xs: [null, 127.5], box: [19, 869, 123, 1003], T: '00010203101112202130', c: [[331.4, 47.1, 279.7], [-386.8, -106.3, -84.3], [386.7, 103, 92.5], [-125.9, -31.4, -35.9], [-442.8, -104.5, -82.1], [721.2, 204.7, 157.5], [-332.4, -92.9, -69], [403.9, 121.6, 61.3], [-328, -100, -63.9], [-136.8, -46.1, -14]] }, { xs: [127.5, null], box: [133, 867, 333, 953], T: '00010203101112202130', c: [[175.8, 39.6, 217], [7.5, -1.7, 2.8], [-11.3, 0.7, 8.4], [6.5, -0.4, -8.7], [-47.9, 22.2, -48.4], [9.1, -1.4, 4.5], [-1.9, 3.9, 0.4], [16, -16.8, 36.3], [-3.4, -3.7, 4.4], [-5.3, 0.2, -20.6]] }] },
    R3: { soft: 60, outer: [[126.0,960.0],[121.5,960.4],[117.1,961.6],[113.0,963.5],[109.3,966.1],[106.1,969.3],[103.5,973.0],[101.6,977.1],[100.4,981.5],[100.0,986.0],[100.4,990.5],[101.6,994.9],[103.5,999.0],[106.1,1002.7],[109.3,1005.9],[113.0,1008.5],[117.1,1010.4],[121.5,1011.6],[126.0,1012.0],[542.6,1012],[550.8,999],[558.1,986],[564.8,973],[570.8,960],[570.8,960]], holes: [], fields: [{ xs: [null, 127.5], box: [19, 757, 119, 919], T: '00010203101112202130', c: [[63.3, 12.8, 146.6], [47.6, -8, 105.3], [16.6, -4.1, -10.1], [-18.2, 3.3, -14.1], [-11, 4.5, 3.6], [13.7, -2.9, -24.1], [-15.3, 2.7, 13.6], [21, -5.4, -0.9], [-3, 0.1, 14.1], [-13.1, 2.3, -1.1]] }, { xs: [127.5, 300], box: [133, 967, 295, 1003], T: '000110021120', c: [[214.8, 94.9, 99.4], [-29.6, -22.8, 46.6], [-94, -88.6, 145.5], [12.7, 11.9, -23], [62.2, 38.9, -74], [59.7, 48.3, -91.6]] }, { xs: [300, null], box: [305, 967, 579, 1003], T: '000110021120', c: [[221.7, 79.8, 105.9], [9.3, 6.3, -12.9], [-21.8, -14, 7.2], [-2.2, -1.1, 4.9], [-1.1, 1.4, 3.6], [-3.7, 2.1, -8.5]] }] },
    R5: { outer: [[-100,1011],[584,1011],[576,1025],[563,1040],[548,1070],[536,1095],[518,1120],[494,1145],[462,1168],[420,1188],[360,1204],[250,1212],[-100,1212]], holes: [], fields: [{ xs: [null, 127.5], box: [19, 1017, 123, 1063], T: '000110021120', c: [[238.8, 75.7, 123.6], [-0.3, 9, -16.6], [-8.5, 7.3, 0.3], [-2.7, -0.2, 2.5], [19.3, 5.1, 1.1], [-21.1, -10.6, -2.4]] }, { xs: [127.5, null], box: [133, 1017, 571, 1063], T: '000110021120', c: [[235.5, 99.5, 82.7], [7.3, 4.6, -12], [-11.2, -33.4, 44.3], [-5.4, 0.4, 4.3], [4.6, 6.6, -0.7], [-17.6, 11.9, -30.1]] }] },
  };

  const f1 = x => (Math.abs(x) < 1e-9 ? 0 : x).toFixed(3);
  const glslFit = (fn, F) => { const [x0, y0, x1, y1] = F.box, terms = [];
    for (let k = 0; k < F.T.length / 2; k++) { const i = +F.T[2 * k], j = +F.T[2 * k + 1], c = F.c[k];
      const m = [...Array(i).fill('u'), ...Array(j).fill('v')].join(' * ');
      terms.push(`vec3(${c.map(f1).join(', ')})${m ? ' * ' + m : ''}`); }
    return `vec3 ${fn}(vec2 b) { vec2 q = clamp((b - vec2(${f1(x0)}, ${f1(y0)})) / vec2(${f1(x1 - x0)}, ${f1(y1 - y0)}), 0.0, 1.0); float u = q.x, v = q.y;\n  return (${terms.join(' + ')}) / 255.0; }\n`; };
  const fieldGLSL = name => { const Fs = DATA[name].fields;
    let s = Fs.map((F, i) => glslFit(`f_${name}_${i}`, F)).join('');
    // several fields side by side (split at sharp vertical board edges xs; DATA[name].soft widens the last split, which the
    // board doesn't draw sharp): each takes over from the one before across its left edge
    const sw = k => (k === Fs.length - 1 && DATA[name].soft) || 1;
    s += `vec3 f_${name}(vec2 b) { vec3 c = f_${name}_0(b);\n` + Fs.slice(1).map((F, i) => `  c = mix(c, f_${name}_${i + 1}(b), smoothstep(${f1(F.xs[0] - sw(i + 1))}, ${f1(F.xs[0] + sw(i + 1))}, b.x));\n`).join('') + '  return c; }\n';
    return s; };
  // a piece's outline from its board-px polygon (and holes), anchored at its box centre
  const shapeOf = name => { const d = DATA[name];
    const clean = P => P.filter((p, i) => { const q = P[(i + P.length - 1) % P.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.5; });
    const outer = clean(d.outer); let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const [x, y] of outer) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    const at = [(x0 + x1) / 2, (y0 + y1) / 2], shape = SH.poly(outer, at);
    for (const h of d.holes) { const p = new THREE.Path(); clean(h).forEach(([x, y], i) => i ? p.lineTo(x - at[0], at[1] - y) : p.moveTo(x - at[0], at[1] - y)); shape.holes.push(p); }
    return { shape, at }; };
  // a piece of hold 28 coloured by its board field: colour = field(board px of this point + a slow slide), the slide zero
  // at the key instant; flat at the hold (flatGeo) unless spec.flat === false
  const pieces = [];
  const FP = (name, spec, sd = [12, 8]) => {
    const { shape, at } = spec.shape ? spec : shapeOf(name);
    const pc = V.piece({ hold: 28, name: 'f28 ' + name, ...spec, shape, at });
    if (spec.flat !== false) flatGeo(pc.mesh.geometry, 28, at, spec.depth);
    const m = pc.mesh.material;
    m.uniforms.ban = { value: new THREE.Vector2(...at) };
    m.uniforms.bsd = { value: new THREE.Vector2(...sd) };
    m.uniforms.bT = { value: TK };
    const fs = m.fragmentShader.replace('#include <logdepthbuf_pars_fragment>', '#include <logdepthbuf_pars_fragment>\nuniform vec2 ban, bsd; uniform float bT;\n' + fieldGLSL(name))
      .replace('gl_FragColor = vec4(col * shade, op);', `vec2 bp = vec2(ban.x + vO.x, ban.y - vO.y) + bsd * min(flow, 1.6) * (sin((t - bT) * spd / per * 6.2832 + ph) - sin(ph));
  gl_FragColor = vec4(clamp(f_${name}(bp), 0.0, 1.0) * shade, op);`);
    if (fs === m.fragmentShader) throw new Error('f28: engine shader changed; the board fields could not hook it');
    m.fragmentShader = fs; m.needsUpdate = true;
    pieces.push(pc);
    return pc;
  };
  const slideIn = (from, a, d = 1.0) => ({ type: 'slide', from, t: [a, a + d], ease: 'expo.out' });

  /* ---------- the block: the sphere's track (top face + the rounded corner, concentric with the journey's arc) ---------- */
  const LIP = 0.04, rS = ARC_R - 1 + LIP, xF = 1.2;                   // surface radius; the front face at x = +1.2
  const dF = h28.pos.x - (O.x + xF), kF = 540 / (dF * h28.tanV);       // its depth from the hold camera; px per unit there
  const [bcx, bcy] = proj(h28, v3(O.x + xF, arcC.y, arcC.z));          // the corner's centre on the front face (board px)
  const rpx = rS * kF, pyBot = 540 + (h28.pos.y - 12) * kF, pxR = 1655; // bottom at y = 12; the right end under the dome
  const bs = new THREE.Shape();
  // (the top rises G.EA from its right end to the corner's top, as the sphere's path does: g6.js solves the corner against
  // board 28, so the corner's top sits a little above the window's sill)
  bs.moveTo(pxR - bcx, bcy - pyBot); bs.lineTo(pxR - bcx, rpx - (G.EA || 0) * kF); bs.lineTo(0, rpx); bs.absarc(0, 0, rpx, Math.PI / 2, Math.PI, false); bs.lineTo(-rpx, bcy - pyBot);
  const OUT_B = { type: 'fade', t: [131.3, 131.6] };                   // gone once it is far out of view (it would show in 30's view)
  FP('block', { shape: bs, at: [bcx, bcy], depth: dF, thick: 4.2, drift: 0, flat: false, in: slideIn('bottom', 125.2, 0.64), out: OUT_B }, [10, 6]);
  // the donut and its disc on the block's face (the ring proud of it)
  FP('disc', { shape: SH.disc(233), at: [1250, 890], depth: dF - 0.1, thick: 0.15, drift: 0,
    keys: { s: [[125.6, 0.05], [126.45, 1, 'expo.out']] }, in: { type: 'fade', t: [125.6, 125.7] }, out: OUT_B }, [10, 8]);
  FP('ring', { shape: SH.ring(310, 231), at: [1250, 890], depth: dF - 0.22, thick: 0.3, drift: 0,
    keys: { r: [[125.5, -140], [126.5, 0, 'expo.out']], s: [[125.5, 0.55], [126.5, 1, 'expo.out']] }, in: { type: 'fade', t: [125.5, 125.62] }, out: OUT_B }, [12, 10]);

  /* ---------- the lower-left group inside the D ---------- */
  // (just in front of f27's D, 0.4–0.7 u, so they keep to its outline as the camera moves: at depth ~32 they floated
  // 58 u in front of it and read as a blocky cut-out in the crane down; they fly back with it, 129.5–130.6)
  const flyOut = (a, d = 1.0) => ({ type: 'fly', t: [a, a + d], dz: 22 });
  FP('R0', { depth: 90.2, thick: 0.25, drift: 0, in: slideIn('bottom', 125.42), out: flyOut(129.5) }, [6, 12]);
  FP('R1', { depth: 90.05, thick: 0.25, drift: 0, in: slideIn('bottom', 125.5), out: flyOut(129.56) }, [12, 6]);
  FP('R2', { depth: 90.1, thick: 0.25, drift: 0, in: slideIn('bottom', 125.46), out: flyOut(129.53) }, [2, 6]);
  FP('R3', { depth: 90.0, thick: 0.25, drift: 0, in: slideIn('bottom', 125.55), out: flyOut(129.59) }, [2, 4]);
  FP('R5', { depth: 89.9, thick: 0.25, drift: 0, in: slideIn('bottom', 125.6), out: flyOut(129.62) }, [2, 6]);

  /* ---------- board 28's backdrop (far back, behind all of f27's carried shapes): the maroon strip at the left edge, the
     orange → indigo field (x 128–830, running on under f27's blue column) and the navy top right. It fades in behind f27's
     backdrop (which fades 125.8–126.9) and fades back out with the shared shapes. ---------- */
  const bgIn = a => ({ type: 'fade', t: [a, a + 0.8] });
  FP('bgL', { depth: 120, thick: 0.8, drift: 0, in: bgIn(125.2), out: { type: 'fly', t: [129.5, 130.4], dz: 30 } }, [8, 16]);
  FP('bgM', { depth: 120.3, thick: 0.8, drift: 0, in: bgIn(125.25), out: { type: 'fly', t: [129.55, 130.45], dz: 30 } }, [18, 12]);
  FP('bgR', { depth: 120.6, thick: 0.8, drift: 0, in: bgIn(125.3), out: { type: 'fly', t: [129.6, 130.5], dz: 30 } }, [16, 12]);
  pieces.slice(-3).forEach(pc => { pc.mesh.renderOrder = -4; });    // drawn before f27's backdrop (−3), which fades out in front of them

  G.set28 = { pieces, block: { dF, xF, rS, LIP } };                   // for the neighbours (read-only)
  V.unplate(28);                                                       // built: no board picture left
};
