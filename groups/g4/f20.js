/* Frame 20 · the rail chute and the dark hole: frontal hold (fov 26) on the platform's wall (camera 20 looks +x; screen-right
   = world +z, screen-up = +y). The sphere comes over the platform's lip, rolls down the rail chute to the lip of the dark hole
   and drops in (G4, called from g4.js with its context G). Built (batch 4): every board 20 shape is real 3D, the plate is gone.
   · The wall is a shadow box under the platform's edge. f19's track and floor slab end at x = xEdge (the sphere pivots on the
     track's corner (xEdge, yF − 1)); under the slab a fascia (x = xEdge + 0.3 … + 2.35, above the frame at the hold) closes
     the top. Below the fascia the wall is recessed: board 20's reliefs are laid out in camera 20's view by board px,
     back to front: the backdrop (navy, the maroon top left), the rose area and its dark violet bar (top right), the small
     violet disc in the top-left corner, the violet pocket behind the circle, the tall rounded rect and the orange → violet
     strip at the left edge, the orange → violet circle and the magenta → violet arch with its doorway, then the blue-violet D
     with the hole, and the small magenta disc in the corner. They are flat at the hold (sides edge-on) and chunky when the camera moves.
   · The rail chute: 4 bars (board x 102–126 / 162–186 / 222–246 / 281–305) whose front faces sit exactly on the lip plane
     x = xEdge, so the sphere (centre 1 in front) rolls on them. They run from under f19's slab down to the hole's top lip
     (board y 792): peach at the top, rose, then violet over the D, as the board shows them.
   · The hole is a real opening: the D's stadium-shaped hole (board: top 784, right end centred (272, 930), r 146) is the
     mouth of a dark tunnel that runs +x (away from the camera) for 46 u. Its floor follows the sphere's route (it lands just
     inside and rolls on), and its colours are board 20's dark hole as seen from camera 20 (dark violet at the left, near
     black at the right, the faint rail glints), fading to black deeper in, so the dive (92.2–93.25) stays dark.
   · Colour: every relief takes board 20's colours from a smooth field of samples measured on the board (in its own board
     px, so it rides with the shape); one shared slow drift keeps them living and passes through the board exactly at the
     key instant (90.7). The rails and fascia use the engine's gradients, calmed and locked to 90.7.
   · Build: the wall, rails, D and tunnel are there from 86.5 (off screen until the tilt). The other reliefs push out of the
     wall, back to front, as the camera tilts down onto them (88.4–89.7). Nothing leaves: the dive into the hole and the dip
     hide the cut at 93.25.
   Shapes and colours are measured from board 20 (edge scans and colour samples; board px, 1920×1080). */
export default (V, G) => {
  const { THREE, yF, xEdge, h20: H, M20, PU, PC, calm, lock } = G;
  const { mat, scene, anim } = V;
  const TK = H.tk;                                                        // 90.7: the gradients pass through board 20 here
  V.unplate(20);
  const cam = H.pos, kpx = d => d * H.tanV / 540;                         // world units per board px at depth d (camera 20)
  const zPx = (px, d) => cam.z + (px - 960) * kpx(d), yPy = (py, d) => cam.y - (py - 540) * kpx(d);
  const pxZ = (z, d) => 960 + (z - cam.z) / kpx(d), pyY = (y, d) => 540 - (y - cam.y) / kpx(d);
  const sm = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
  const T_ON = 86.5;                                                      // the static wall is on from here (off screen)

  /* ---------- depths (from camera 20, along +x) ---------- */
  const dL = xEdge - cam.x;                                               // the lip plane (28.20): the rails' front faces
  const RT = 0.29;                                                        // the rails' depth (front at dL)
  const dC = dL + 0.31, dM = dL + 0.40, dCi = dL + 0.85, dRe = dL + 1.05, dBar = dL + 1.35, dPk = dL + 1.62, dRo = dL + 1.66;
  const DB = dL + 2.2, dF = dL + 2.35;                                    // the backdrop; the back of the fascia block
  // f19 owns the platform's top and its edge: its track and floor slab end at x = xEdge (track top yF − 1, slab down to
  // yF − 2). The fascia's top is hidden inside that slab, and the rails start inside it, so the platform and the wall meet
  // with no seam and nothing of this file shows from above.
  const YT = yF - 1 - 0.7;                                                // the fascia block's top (inside f19's floor slab)
  const YR = yF - 1 - 0.8;                                                // the rails' top (inside f19's floor slab)
  const YS = cam.y + dF * H.tanV + 0.09;                                  // the soffit: just above frame 20 at the fascia's back

  /* ---------- board 20's colours: samples (x, y, colour) in board px, measured per shape ---------- */
  const A = {
    back: `48,40,541e38 56,64,511e31 10,96,531f45 70,14,541f37 686,14,290863 742,14,2b0867 798,14,2e086e 854,14,310870 70,70,4e1b3c
      686,70,280a61 742,70,2b0967 798,70,2c0a6a 854,70,2f0970 742,126,290b65 798,126,2a0a6a 854,126,2e0a6e
      742,182,290c66 798,182,290c68 854,182,2b0c6a 742,238,270d64 798,238,270d66 854,238,2a0d69 910,238,2b0c6c
      742,294,260e64 798,294,260e64 854,294,280e67 910,294,290d68 966,294,280e69 742,350,250f62 798,350,260e62
      742,406,23105f 798,406,231061 742,462,22115f 798,462,22105e 742,518,22125d 798,518,21105e 742,574,22125e
      798,574,22105f 854,574,240e60 910,574,240e61 966,574,260d60 1022,574,270d62 1078,574,270b60 1134,574,28095f
      1190,574,25085c 1246,574,26095d 1302,574,26095b 1358,630,25085a 1414,630,25085a 1470,630,25085a 1358,686,25085a
      1414,686,25085a 1358,854,25085a 1638,854,260959 1694,854,260959 1750,854,24095a 1358,910,240958 1638,910,260959
      1694,910,260959 1750,910,260959 1358,966,230a58 1638,966,240958 1694,966,240958 1750,966,240958 1358,1022,240957
      1638,1022,230a5b 1694,1022,240959 1750,1022,240958 1880,320,520c89 1910,330,440b7e 1880,360,440786 1880,400,390780 1820,400,37087c
      1760,400,360777 1880,480,330776 1820,480,310870 1880,560,2d0969 1910,440,29066e 204,14,421b5a 204,34,431a5e 204,54,421a60 204,74,3e195f
      204,94,3d1961 204,412,2a166f 204,438,261772 204,464,251870 204,490,26186f 204,516,251870 204,542,251872
      204,568,231876 264,14,411c6c 264,34,441a6e 264,54,43196f 264,74,401a71 264,94,3d1a6e
      264,412,30177d 264,438,31187e 264,464,2c1b7b 264,490,2e1980 264,516,2e1980 264,542,2d1b7f 264,568,2e1980
      144,14,481e46 144,34,481a48 144,54,451b49 144,74,43194b 144,94,41194b`,
    rect: `320,14,451c7d 354,14,491b89 388,14,501993 422,14,53199f 456,14,5d17ab 490,14,6816b4 524,14,7713c0 558,14,8214c7
      320,48,441a80 354,48,48198b 388,48,4d1995 422,48,5417a0 456,48,5e17ab 490,48,6916b6 524,48,7415c0 558,48,8313cb
      592,48,9311d5 626,48,a70ce3 320,82,421a81 354,82,47198d 388,82,4b1996 422,82,5417a1 456,82,5d17ac 490,82,6916b7
      524,82,7415c0 558,82,8313cb 592,82,9311d5 626,82,a50ee0 660,422,b70de9 320,456,37198d 354,456,3d1995
      388,456,47199f 422,456,4f19a7 456,456,5a19b0 490,456,6718b9 524,456,7316c3 558,456,8213cb 592,456,9113d6
      626,456,a40fdf 660,456,b70de9 320,490,351a90 354,490,3e1a96 388,490,47199f 422,490,4f19a8 456,490,5a19b1
      490,490,6519b9 524,490,7316c3 558,490,8314cc 592,490,9113d6 626,490,a40fdf 660,490,b70de9 320,524,361a8f
      354,524,3e1a96 388,524,451a9f 422,524,4f1aa8 456,524,5a19b1 490,524,6519ba 524,524,7216c3 558,524,8215cc
      592,524,9113d6 626,524,a40fdf 660,524,b70de9 320,558,361a90 354,558,3e1a96 388,558,461ba0 422,558,4e1aa8
      456,558,5a19b1 490,558,6519ba 524,558,7217c4 558,558,8215cc 592,558,9213d6 626,558,a410e0 660,558,b70de9
      388,592,4519a1 422,592,4f1aa8 456,592,5a19b1 490,592,6519ba 524,592,7217c3 558,592,8215cc 592,592,9213d6
      626,592,a410e0 660,592,b70de9 456,626,6f12dc 490,626,7811e5 524,626,8311e7 558,626,8e11ea 592,626,9e0eed
      626,626,ad0df2 660,626,bd0bf7 524,660,8311e5 558,660,9010eb 592,660,9c0fed 626,660,ad0df1 660,660,bd0bf5
      558,694,9010eb 592,694,9c0fed 626,694,ad0df1 660,694,bd0bf5 592,728,9c0fed 626,728,ad0df1 660,728,bd0bf5
      592,762,9f0eed 626,762,ad0df1`,
    D: `14,626,db43a0 48,626,d33caf 82,626,c536bd 320,626,690ffd 354,626,630bfe 388,626,5c07ff 14,660,dc449c
      48,660,d43eac 82,660,c738bb 320,660,6910fd 354,660,600bfe 388,660,5907ff 422,660,5504fe 456,660,5002fe
      14,694,dc469b 48,694,d440a8 82,694,c63ab8 320,694,6810fd 354,694,5f0bfe 388,694,5907ff 422,694,5504ff
      456,694,5101ff 490,694,5000fe 14,728,dd4997 48,728,d343a4 82,728,c63eb5 320,728,6712fe 354,728,5e0dff
      388,728,5808ff 422,728,5403fe 456,728,5101ff 490,728,4d00fe 524,728,4c00ff 14,762,e14c90 48,762,d3479f
      82,762,c541b0 320,762,6713ff 354,762,5e0dff 388,762,5909ff 422,762,5504ff 456,762,5101ff 490,762,4d00fe
      524,762,4d00fe 558,762,4c00fe 388,796,5909ff 422,796,5505fe 456,796,5201fe 490,796,5000ff 524,796,5101ff
      558,796,4e01ff 422,830,5705ff 456,830,5502ff 490,830,5300ff 524,830,5200ff 558,830,5000ff 592,830,5400fc
      422,864,5b06fd 456,864,5902ff 490,864,5700ff 524,864,5600ff 558,864,5500fe 592,864,5300fe 456,898,5d03fd
      490,898,5c01ff 524,898,5a00fe 558,898,5a00fe 592,898,5700fd 456,932,6404fb 490,932,6100fe 524,932,5d00fe
      558,932,5d00fe 592,932,5c00fd 456,966,6a07f6 490,966,6703f8 524,966,6400f9 558,966,6300fb 592,966,6100fc
      422,1000,7611e6 456,1000,720bec 490,1000,6e06ef 524,1000,6b04f4 558,1000,6901f7 592,1000,6501f8 422,1034,7f17d9
      456,1034,790fe0 490,1034,740be6 524,1034,7106eb 558,1034,6f04f0 592,1034,6c02f3`,
    left: `14,170,ef7214 14,196,eb7111 14,222,e86f15 14,248,e66a19 14,274,e16820 14,300,db6427 14,326,d4602f 14,352,cd5c3a
      14,378,c55845 14,404,bb5256 14,430,b04d61 40,430,a84868 66,430,a0446e 144,430,8c3b7f 14,456,a74772 40,456,9d4275
      66,456,963e7b 144,456,813689 14,482,9e4180 40,482,933c86 66,482,8b3889 144,482,773093 14,508,943b90
      40,508,893694 66,508,803296 144,508,6d2c9c 14,534,8a36a4 40,534,7f31a4 66,534,762da2 144,534,6225a2
      14,560,7d31b3 40,560,752bb0 66,560,6c28ac 144,560,5a21a6`,
    circle: `854,654,fc9600 894,654,ff9402 934,654,ff9400 814,694,ff8e02 854,694,ff9000 894,694,ff9000 934,694,ff9000
      774,734,fe8d00 814,734,fe8d00 854,734,fe8d00 894,734,fe8d00 934,734,fe8d02 734,774,ff8700 774,774,ff8900
      814,774,fe8800 854,774,fe8802 894,774,fd8804 934,774,fa8709 734,814,ff8400 774,814,fe8400 814,814,fe8401
      854,814,fc8204 894,814,f8810a 934,814,f57f14 694,854,fa8100 734,854,fc7f01 774,854,fc7f01 814,854,fa7d02
      854,854,f77b0a 894,854,f17819 934,854,ea7628 694,894,f87a05 734,894,fa7805 774,894,f77805 814,894,f57509
      854,894,f17314 894,894,e66e2b 934,894,dc6945 694,934,f27010 734,934,f27012 774,934,ef6e14 814,934,ea6b1c
      854,934,e3682c 894,934,d86249 934,934,cb5b6e 694,974,e96720 734,974,e66627 774,974,e1632e 814,974,da5f3b
      854,974,d25a50 894,974,c6546f 934,974,b64c98 974,974,a343c1 1014,974,8936ec 1054,974,7027fb 1094,974,5c1bfc
      1134,974,4c12f8 1174,974,410cf7 1214,974,3807f6 1254,974,3504f5 1294,974,3104f1 694,1014,dc5f37 734,1014,d95c3e
      774,1014,d2584a 814,1014,ca535b 854,1014,c04d74 894,1014,b34790 934,1014,a53fb4 974,1014,9237d8 1014,1014,7d2df6
      1054,1014,6a21f9 1094,1014,5718f3 1134,1014,4910f2 1174,1014,400bf1 1214,1014,3806ef 1254,1014,3403f1
      734,1054,cb5255 774,1054,c34c64 814,1054,b94775 854,1054,ae4090 894,1054,a23aa7 934,1054,9333c5 974,1054,842be0
      1014,1054,6f23e6 1054,1054,611aea 1094,1054,5313e8 1134,1054,470de9 1174,1054,3e09ea 1214,1054,3806e9
      1254,1054,3405ea`,
    arch: `1614,614,cd0cfb 1654,614,cd0cfb 1694,614,cd0cfb 1734,614,cd0cfb 1774,614,cd0cfb 1534,654,c10ef5 1574,654,c00ef5
      1614,654,c10ef5 1654,654,c00ff5 1694,654,c10ef5 1734,654,c00ff5 1774,654,bf0ef4 1814,654,bf0ef4 1854,654,c10df4
      1814,694,b40fee 1854,694,b30fee 1894,694,b211eb 1814,734,a710e7 1854,734,a710e7 1894,734,a611e5 1814,774,9c11e0
      1854,774,9c10e2 1894,774,9c11de 1414,814,9313db 1454,814,9313db 1494,814,9313db 1534,814,9212db 1574,814,9311da
      1774,814,9312dc 1814,814,9213d9 1854,814,9213db 1894,814,9213d9 1414,854,8914d5 1454,854,8914d5 1494,854,8914d4
      1534,854,8914d4 1814,854,8814d4 1854,854,8814d4 1894,854,8715d3 1414,894,7f13ce 1454,894,8014cf 1494,894,8015cd
      1534,894,8014cd 1814,894,7e14ce 1854,894,7e14ce 1894,894,7f14cb 1414,934,7714c8 1454,934,7714c8 1494,934,7714c8
      1534,934,7715c8 1814,934,7615c7 1854,934,7615c7 1894,934,7714c6 1414,974,6e15c2 1454,974,6e14c2 1494,974,6e15c3
      1534,974,6e15c3 1814,974,6e14c1 1854,974,6d15c2 1894,974,6b16bf 1414,1014,6715bc 1454,1014,6715bc
      1494,1014,6716bd 1534,1014,6616bc 1814,1014,6515bb 1854,1014,6616bb 1894,1014,6516b9 1414,1054,6014b7
      1454,1054,6014b6 1494,1054,6014b6 1534,1054,5e15b6 1814,1054,5e15b7 1854,1054,6015b5 1894,1054,5e17b1`,
    rose: `894,14,9d3562 934,14,9f3561 974,14,a03563 1014,14,a23464 1054,14,a43468 1094,14,a63368 894,54,932e65
      934,54,942d65 974,54,952e67 1014,54,952d69 1054,54,962c6b 1094,54,962e6a 894,94,852769 934,94,892669
      974,94,89276a 1014,94,8a266d 1054,94,8a276d 1094,94,8b276c 894,134,7d2164 934,134,7b216a 974,134,7c216c
      1014,134,7d216d 1054,134,7e226f 1094,134,7e216f 1134,134,7f2071 934,174,6e1c6a 974,174,6f1c6d 1014,174,6f1c6d
      1054,174,701c6f 1094,174,711c71 1134,174,701c71 1174,174,711c71 1214,174,711c71 1254,174,711c71 1294,174,711b71
      1334,174,721a71 1374,174,721a71 1414,174,711a70 1454,174,721a71 1494,174,721a71 1534,174,731a72 1574,174,731974
      1614,174,751876 1654,174,77187a 1694,174,78187c 1734,174,7a1781 1774,174,7b1885 1814,174,7e1888 1854,174,80198c
      1894,174,821790 934,214,61196b 974,214,62196c 1014,214,62196d 1054,214,62186d 1094,214,63186f 1134,214,63176f
      1174,214,62176e 1214,214,63176e 1254,214,63186e 1294,214,62186d 1334,214,62186d 1374,214,62166c 1414,214,63166c
      1454,214,63156e 1494,214,64156e 1534,214,64146f 1574,214,671471 1614,214,681476 1654,214,6a137b 1694,214,6c147e
      1734,214,6f1481 1774,214,701385 1814,214,721489 1854,214,73138d 1894,214,751491 974,254,54156a 1014,254,55146b
      1054,254,55146b 1094,254,55146b 1134,254,54146b 1174,254,53136a 1214,254,54136a 1254,254,53136a 1294,254,54136a
      1334,254,541269 1374,254,551169 1414,254,55116a 1454,254,56116a 1494,254,57106a 1534,254,57116d 1574,254,59106f
      1614,254,5b1074 1654,254,5d0f7a 1694,254,600f7d 1734,254,620f7f 1774,254,630f84 1814,254,640f88 1854,254,660f8b
      1894,254,6a0e8f 1054,294,48126a 1094,294,481268 1134,294,471167 1174,294,471167 1214,294,461167 1254,294,461066
      1294,294,461064 1334,294,461064 1374,294,470f64 1414,294,480f66 1454,294,480d67 1494,294,490d68 1534,294,4a0e6c
      1574,294,4d0d6e 1614,294,4f0d73 1654,294,510c77 1694,294,530c7c 1734,294,550d7e 1774,294,560d82 1814,294,580b85
      1854,294,5a0b89 1894,294,5a0c8b`,
    bar: `1134,14,3e0790 1166,14,3e0792 1198,14,410792 1230,14,420795 1262,14,430799 1294,14,45079b 1326,14,45079d
      1358,14,46089f 1390,14,4906a1 1422,14,4906a3 1454,14,4b06a4 1486,14,4a06a6 1518,14,4b07a7 1550,14,4c07a9
      1582,14,4e07ac 1614,14,4f06ad 1646,14,5006b0 1678,14,5206ac 1710,14,5306b1 1742,14,5406b3 1774,14,5606b5
      1806,14,5606b6 1838,14,5707b8 1870,14,5905bd 1902,14,6002c3 1134,46,3c0889 1166,46,3d088c 1198,46,3f088f
      1230,46,400890 1262,46,410792 1294,46,420793 1326,46,430695 1358,46,440797 1390,46,450798 1422,46,460699
      1454,46,47079b 1486,46,48079c 1518,46,48069d 1550,46,49079f 1582,46,4a06a1 1614,46,4c06a3 1646,46,4d06a4
      1678,46,4d05a6 1710,46,4f05a9 1742,46,5005ac 1774,46,5204ae 1806,46,5304b0 1838,46,5505b4 1870,46,5705b8
      1902,46,5c03bd 1134,78,3b0885 1166,78,3b0887 1198,78,3c0889 1230,78,3d088a 1262,78,3d088c 1294,78,3f088d
      1326,78,40088e 1358,78,40088f 1390,78,410891 1422,78,410791 1454,78,420792 1486,78,430793 1518,78,450795
      1550,78,450796 1582,78,450596 1614,78,460699 1646,78,47069a 1678,78,48069d 1710,78,4a06a0 1742,78,4c05a3
      1774,78,4e04a5 1806,78,5005a9 1838,78,5105ad 1870,78,5405b1 1902,78,5704b5 1166,110,390983 1198,110,3a0983
      1230,110,3b0985 1262,110,3b0986 1294,110,3b0887 1326,110,3c0887 1358,110,3c0887 1390,110,3c0889 1422,110,3d0889
      1454,110,3e088a 1486,110,3f078b 1518,110,3f078b 1550,110,40078c 1582,110,40078e 1614,110,420690 1646,110,430692
      1678,110,450695 1710,110,470698 1742,110,48069c 1774,110,4b05a1 1806,110,4c05a3 1838,110,4f05a7 1870,110,5106ac
      1902,110,5504b2`,
    corner: `14,1022,a010e3 14,1034,a50fe3 14,1046,ad10e8 26,1046,b50eeb 14,1058,ae11ea 26,1058,b80fed`,
    hole: `14,806,260858 38,806,240855 62,806,210852 86,806,1f084e 14,830,260858 38,830,240855 62,830,210852 86,830,1f084e
      326,830,0a072c 350,830,060824 14,854,260858 38,854,240855 62,854,210852 86,854,1f084e 326,854,09082a
      350,854,070823 374,854,030922 14,878,260858 38,878,240855 62,878,210852 86,878,1f084e 326,878,09082a
      350,878,070826 374,878,040822 14,902,260858 38,902,240855 62,902,210852 86,902,1f084e 326,902,09082a
      350,902,070826 374,902,040822 398,902,03081c 14,926,260858 38,926,240855 62,926,210852 86,926,1f084e
      206,926,15093b 326,926,09082a 350,926,070826 374,926,040822 398,926,030720 14,950,260858 38,950,240855
      62,950,210852 86,950,1f084e 206,950,15093b 326,950,09082a 350,950,070826 374,950,040822 398,950,03071f
      14,974,26075b 38,974,240855 62,974,210852 86,974,1f084e 134,974,1c0847 158,974,180943 206,974,15083c
      254,974,100935 278,974,0d0831 326,974,09082a 350,974,070826 374,974,040822 398,974,03071e 38,998,240855
      62,998,200852 86,998,1f084e 110,998,1d084a 134,998,1c0847 158,998,180943 182,998,17083f 206,998,15083c
      230,998,130838 254,998,100935 278,998,0d0831 302,998,0b082c 326,998,09082a 350,998,070826 374,998,040822
      62,1022,220853 86,1022,1f084e 110,1022,1d084a 134,1022,1c0847 158,1022,180943 182,1022,17083f 206,1022,15083c
      230,1022,130838 254,1022,100935 278,1022,0d0831 302,1022,0b082c 326,1022,09082a 350,1022,070826 62,1046,220852
      86,1046,1f084e 110,1046,1d084a 134,1046,1c0847 158,1046,180943 182,1046,17083f 206,1046,15083c 230,1046,130838
      254,1046,100935 278,1046,0d0831 302,1046,0b082c 326,1046,09082a`,
    tl: `10,8,3b0484 24,8,3a048d 12,24,4305a4 28,24,4304ab 12,44,4705a3 24,40,4b069d 12,60,4604ae`,
    pocket: `704,644,4b04ba 734,644,4b04ba 764,644,4b04ba 794,644,4b04ba 704,674,4a04ba 734,674,4b04ba 764,674,4b04b9
      704,704,4a05ba 734,704,4b05bb 704,734,4b05b7 674,794,4e03b8 644,824,4b04ba 644,854,4b04ba 644,884,4a04bc
      644,914,4e02be 644,944,4905bb 644,974,4a05b8 644,1004,4b04ba 644,1034,4b04ba 614,1064,4b04b8 644,1064,4b04b8
      674,1064,4c03bb`,
  };
  const parseA = s => s.trim().split(/\s+/).map(t => { const [x, y, h] = t.split(','); return [+x, +y, h]; });
  const hexC = h => { const n = parseInt(h.replace('#', ''), 16); return `vec3(${((n >> 16 & 255) / 255).toFixed(4)}, ${((n >> 8 & 255) / 255).toFixed(4)}, ${((n & 255) / 255).toFixed(4)})`; };
  // a smooth, bounded blend of the samples (no overshoot, no bands)
  const fieldFn = (name, pts, kern) => { const K = (1 / (kern * kern)).toExponential(5);
    return `vec3 ${name}(vec2 b) { vec3 s = vec3(0.0); float ws = 0.0, q, w; vec2 d;\n` +
      pts.map(([x, y, h]) => `  d = b - vec2(${x.toFixed(1)}, ${y.toFixed(1)}); q = 1.0 + dot(d, d) * ${K}; w = 1.0 / (q * q); s += w * ${hexC(h)}; ws += w;`).join('\n') +
      '\n  return s / ws; }\n'; };
  // one shared living drift for the whole set (px), zero at the key instant
  const PER = 9.5, PH = 1.1, AMP = 22;
  const SLF = `vec2 SL(float t, float flow) { float fl = min(flow, 1.6), a = 6.2832 * ((t - ${TK.toFixed(4)}) * spd);
  return ${AMP.toFixed(1)} * fl * vec2(sin(a / ${PER.toFixed(2)} + ${PH.toFixed(2)}) - sin(${PH.toFixed(2)}), sin(a / ${(PER * 1.13).toFixed(3)} + ${(PH + 0.85).toFixed(2)}) - sin(${(PH + 0.85).toFixed(2)})); }\n`;
  const PV = '#include <common>\n#include <logdepthbuf_pars_vertex>\nvarying vec3 vO; varying vec3 vNv;\nvoid main() { vO = position; vNv = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include <logdepthbuf_vertex>\n}';
  const PF = lib => `uniform float op, t, flow, spd; uniform vec2 at;
varying vec3 vO; varying vec3 vNv;
#include <logdepthbuf_pars_fragment>
${lib}${SLF}
void main() {
  vec3 col = F(at + vec2(vO.x, -vO.y) + SL(t, flow));
  vec3 nv = normalize(vNv); float shade = mix(0.72 + 0.12 * nv.y - 0.05 * nv.x, 1.0, smoothstep(0.55, 0.98, abs(nv.z)));
  gl_FragColor = vec4(col * shade, op);
#include <logdepthbuf_fragment>
}`;
  const swaps = [];
  anim(() => { for (const [a, b] of swaps) { b.transparent = a.transparent; b.depthWrite = a.depthWrite; } });
  // a board piece (flat at the hold, chunky when moving) whose colours are the measured field for its shape
  const FP = (spec, key, kern, extra = []) => {
    const pc = PC({ hold: 20, drift: 0, ...spec });
    const o0 = pc.mesh.material;
    const m = new THREE.ShaderMaterial({ uniforms: { op: o0.uniforms.op, t: o0.uniforms.t, flow: o0.uniforms.flow, spd: o0.uniforms.spd, at: { value: new THREE.Vector2(...spec.at) } },
      vertexShader: PV, fragmentShader: PF(fieldFn('F', [...parseA(A[key]), ...extra], kern)), side: o0.side });
    pc.mesh.material = m; swaps.push([o0, m]); return pc; };
  // pushes out of the wall: starts just behind the backdrop (hidden), comes forward into place
  const emerge = (depth, a, dur = 0.85) => ({ z: [[a, DB - depth + 0.12], [a + dur, 0, 'power3.out']], op: [[a - 0.01, 0], [a, 1]] });
  const onFrom = a => ({ op: [[a - 0.01, 0], [a, 1]] });

  /* ---------- outlines in board px (y down); arcs: angles counter-clockwise from +x, y up ---------- */
  const arcPts = (cx, cy, r, a0, a1, n) => { const p = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; p.push([cx + r * Math.cos(a), cy - r * Math.sin(a)]); } return p; };
  const dedup = pts => pts.filter((p, i) => { const q = pts[(i + pts.length - 1) % pts.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > 1e-3; });
  const shapeOf = (at, outer, holes = []) => { const toL = ([x, y]) => new THREE.Vector2(x - at[0], at[1] - y);
    const s = new THREE.Shape(dedup(outer).map(toL)); for (const h of holes) s.holes.push(new THREE.Path(dedup(h).map(toL))); return s; };
  const PI = Math.PI;
  const HOLE = [...arcPts(272, 930, 146, PI / 2, -PI / 2, 40), ...arcPts(-60, 930, 146, -PI / 2, -1.5 * PI, 40)];   // the hole (at the D's face)

  /* ---------- the tunnel's section: the hole's stadium at the D's face, in world (z across, y up) ---------- */
  const yc = yPy(930, dM), rH = 146 * kpx(dM), zR = zPx(272, dM), zL = zPx(-60, dM), xM = cam.x + dM;
  // the sphere's route inside (G.PU past the lip), so the floor runs just under it
  const route = [];
  for (let i = 0; i <= 5000; i++) { const p = PU.C.getPointAt(i / 5000); if (p.x > xEdge + 0.9 && p.y < M20.y - 1) route.push([p.x, p.y]); }
  route.sort((a, b) => a[0] - b[0]);
  const ballY = x => {
    const n = route.length - 1;
    if (x <= route[0][0]) return route[0][1];
    if (x >= route[n][0]) { const [x0, y0] = route[Math.max(0, n - 40)], [x1, y1] = route[n]; return y1 + (x - x1) * (y1 - y0) / Math.max(1e-6, x1 - x0); }
    let lo = 0, hi = n; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (route[m][0] < x) lo = m; else hi = m; }
    const [x0, y0] = route[lo], [x1, y1] = route[hi]; return y0 + (y1 - y0) * (x - x0) / Math.max(1e-6, x1 - x0); };
  const yB0 = yc - rH, x12 = xEdge + 1.2, fl12 = ballY(x12) - 1.004;
  // the section's rise from the mouth: 0 at the D's face (so the hole is the board's), then the floor follows the sphere
  const off = x => x <= xM ? 0 : x < x12 ? (fl12 - yB0) * sm((x - xM) / (x12 - xM)) : ballY(x) - 1.004 - yB0;
  const secPts = (x, grow, n = 28) => { const o = off(x), r = rH + grow, p = [];
    for (let i = 0; i <= n; i++) { const a = PI / 2 - PI * i / n; p.push([zR + r * Math.cos(a), yc + o + r * Math.sin(a)]); }
    for (let i = 0; i <= n; i++) { const a = -PI / 2 - PI * i / n; p.push([zL + r * Math.cos(a), yc + o + r * Math.sin(a)]); }
    return p; };

  /* ---------- the backdrop: board 20's navy wall with its glows; the tunnel passes through it ---------- */
  {
    const at = [800, 800];
    const hole = secPts(cam.x + DB, 0.008).map(([z, y]) => [pxZ(z, DB), pyY(y, DB)]);
    FP({ shape: shapeOf(at, [[-900, -100], [2500, -100], [2500, 1700], [-900, 1700]], [hole]), at, depth: DB, thick: 0, keys: onFrom(T_ON) }, 'back', 50);
  }

  /* ---------- the reliefs, back to front ---------- */
  // (fix pass: they push out 0.3 s earlier (from 88.1), so the wall under the lip reads as solid as soon as the tilt shows it)
  // top right: the rose → purple area (its bottom-left corner a big round) and the dark violet bar over it
  FP({ shape: shapeOf([1500, 150], [[876, -40], [2150, -40], [2150, 330], ...arcPts(1126, 80, 250, -PI / 2, -PI, 48)]), at: [1500, 150], depth: dRo, thick: 0.3, drift: 3, keys: emerge(dRo, 88.10) }, 'rose', 36);
  FP({ shape: shapeOf([1600, 60], [[1110, -40], [2150, -40], [2150, 150], ...arcPts(1220, 40, 110, -PI / 2, -PI, 32)]), at: [1600, 60], depth: dBar, thick: 0.25, drift: 3, keys: emerge(dBar, 88.18) }, 'bar', 29);
  // the small violet disc in the top-left corner
  FP({ shape: shapeOf([0, 20], arcPts(-35, 5, 77, 0, 2 * PI, 48).slice(0, -1)), at: [0, 20], depth: dRo, thick: 0.3, drift: 2, keys: emerge(dRo, 88.10) }, 'tl', 16);
  // the violet pocket behind the circle (its top edge shows between the rect and the circle)
  FP({ shape: shapeOf([800, 900], [[560, 616], [1100, 616], [1100, 1300], [560, 1300]]), at: [800, 900], depth: dPk, thick: 0.3, drift: 3, keys: emerge(dPk, 88.25) }, 'pocket', 30);
  // the orange → rose → violet strip at the left edge (its right edge is under the second rail)
  FP({ shape: shapeOf([0, 400], [[-300, 137], ...arcPts(134, 177, 40, PI / 2, 0, 12), [174, 700], [-300, 700]]), at: [0, 400], depth: dRe, thick: 0.5, drift: 3, keys: emerge(dRe, 88.25) }, 'left', 24);
  // the tall violet → magenta rounded rect (left edge under the fourth rail; its hidden bottom left is cut clear of the tunnel)
  FP({ shape: shapeOf([490, 400], [[295, -8], ...arcPts(532, 142, 150, PI / 2, 0, 32), ...arcPts(552, 701, 130, 0, -PI / 2, 28), [450, 831], [450, 660], [295, 660]]),
    at: [490, 400], depth: dRe, thick: 0.5, drift: 3, keys: emerge(dRe, 88.32) }, 'rect', 31);
  // the orange → violet circle (under the 90+ copy square) and the magenta → violet arch with its doorway
  FP({ shape: shapeOf([989, 936], arcPts(989, 936, 324, 0, 2 * PI, 128).slice(0, -1)), at: [989, 936], depth: dCi, thick: 0.6, drift: 3, keys: emerge(dCi, 88.56) }, 'circle', 36);
  FP({ shape: shapeOf([1684, 900], [[1376, 1300], [1376, 891], ...arcPts(1684, 891, 308, PI, 0, 64), [1992, 1300], [1790, 1300], [1790, 892], ...arcPts(1684, 892, 106, 0, PI, 32), [1578, 1300]]),
    at: [1684, 900], depth: dCi, thick: 0.6, drift: 3, keys: emerge(dCi, 88.50) }, 'arch', 36);
  // the blue-violet D with the hole (static: the tunnel is fixed behind it); below the hole it darkens (seen only in the dive)
  const darkLip = []; for (let x = -420; x <= 420; x += 70) darkLip.push([x, 1150, '1a0844'], [x, 1230, '14063a']);
  FP({ shape: shapeOf([200, 900], [[-450, 593], ...arcPts(279, 935, 342, PI / 2, -PI / 2, 96), [-450, 1277]], [HOLE]), at: [200, 900], depth: dM, thick: 0.55, keys: onFrom(T_ON) }, 'D', 31, darkLip);
  // the small magenta disc in the corner, in front of the hole
  FP({ shape: shapeOf([-78, 1080], arcPts(-78, 1080, 123, 0, 2 * PI, 64).slice(0, -1)), at: [-78, 1080], depth: dC, thick: 0.035, keys: onFrom(T_ON) }, 'corner', 16,
    [[-40, 1110, 'b40ff0'], [40, 1100, 'b80ef0'], [-20, 980, '9a10e0']]);

  /* ---------- the tunnel: a real opening, dark, running +x (away from camera 20) ---------- */
  {
    const xs = []; for (let x = xM + 0.002; x < xEdge + 3; x += 0.15) xs.push(x); for (let x = xEdge + 3; x <= xEdge + 46; x += 0.8) xs.push(x);
    const pos = [], idx = []; let m = 0;
    xs.forEach((x, i) => { const ring = secPts(x, -0.004); m = ring.length; for (const [z, y] of ring) pos.push(x, y, z);
      if (i) for (let j = 0; j < m; j++) { const a = (i - 1) * m + j, b = (i - 1) * m + (j + 1) % m, c = i * m + j, d = i * m + (j + 1) % m; idx.push(a, c, b, b, c, d); } });
    // the far end: a cap
    const xe = xs.at(-1), o = off(xe), c0 = pos.length / 3; pos.push(xe, yc + o, (zL + zR) / 2);
    for (let j = 0; j < m; j++) idx.push(c0, (xs.length - 1) * m + j, (xs.length - 1) * m + (j + 1) % m);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    const hc = new THREE.PerspectiveCamera(H.fov, 16 / 9, 0.05, 2000);
    hc.position.copy(cam); hc.up.set(0, 1, 0); hc.lookAt(H.look); hc.updateMatrixWorld(); hc.updateProjectionMatrix();
    const HVP = new THREE.Matrix4().multiplyMatrices(hc.projectionMatrix, hc.matrixWorldInverse);
    const rails = [[102, 126], [162, 186], [222, 246], [281, 305]];
    const WV = '#include <common>\n#include <logdepthbuf_pars_vertex>\nvarying vec3 vW;\nvoid main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w;\n#include <logdepthbuf_vertex>\n}';
    const tm = new THREE.ShaderMaterial({ side: THREE.DoubleSide, uniforms: { hvp: { value: HVP }, xa: { value: xEdge + 12 }, xb: { value: xEdge + 42 } }, vertexShader: WV,
      fragmentShader: `uniform mat4 hvp; uniform float xa, xb;
varying vec3 vW;
#include <logdepthbuf_pars_fragment>
${fieldFn('HF', parseA(A.hole), 22)}
void main() {
  // board 20's dark hole as camera 20 sees it (so the hold shows the board), fading to black deeper in
  vec4 hq = hvp * vec4(vW, 1.0);
  vec2 b = vec2((hq.x / hq.w * 0.5 + 0.5) * 1920.0, (0.5 - 0.5 * hq.y / hq.w) * 1080.0);
  vec3 col = HF(b);
  float st = 0.0;
  ${rails.map(([a, c]) => `st = max(st, smoothstep(${a - 4}.0, ${a + 2}.0, b.x) * (1.0 - smoothstep(${c - 2}.0, ${c + 4}.0, b.x)));`).join('\n  ')}
  col += st * step(776.0, b.y) * (1.0 - smoothstep(760.0, 1000.0, b.y)) * vec3(0.09, 0.0, 0.16);
  col *= 1.0 - smoothstep(xa, xb, vW.x);
  gl_FragColor = vec4(col, 1.0);
#include <logdepthbuf_fragment>
}` });
    const tun = new THREE.Mesh(g, tm); tun.frustumCulled = false; scene.add(tun);
    anim(t => { tun.visible = t >= T_ON; });
  }

  /* ---------- the rail chute: 4 bars on the lip plane (front faces at x = xEdge), from under f19's slab to the hole's lip ---------- */
  {
    const yBot = yPy(792, dL), k = (dL + RT) / dL;
    const yAt = py => yPy(py, dL);
    const C0 = '#f6bf9a', C1 = ['#a4455f', '#a44366', '#964165', '#964266'], C2 = ['#7c1eba', '#7418c0', '#6a14c4', '#620ed2'];
    [[102, 126], [162, 186], [222, 246], [281, 305]].forEach(([a, b], i) => {
      const za = zPx(a, dL), zb = zPx(b, dL), x0 = xEdge + 0.006, x1 = xEdge + RT;   // (a hair behind f19's slab face above)
      const zab = cam.z + (za - cam.z) * k, zbb = cam.z + (zb - cam.z) * k;   // the back edges on camera 20's view rays: the sides are edge-on at the hold
      const ybb = cam.y + (yBot - cam.y) * k;                                  // the bottom end on a view ray too
      const P = { fa: [x0, 0, za], fb: [x0, 0, zb], ba: [x1, 0, zab], bb: [x1, 0, zbb] };
      const v = (c, y) => [c[0], y, c[2]];
      const top = y => ({ fa: v(P.fa, y), fb: v(P.fb, y), ba: v(P.ba, y), bb: v(P.bb, y) });
      const T = top(YR), B = { fa: v(P.fa, yBot), fb: v(P.fb, yBot), ba: v(P.ba, ybb), bb: v(P.bb, ybb) };
      const quads = [[T.fa, T.fb, B.fb, B.fa], [T.bb, T.ba, B.ba, B.bb], [T.ba, T.fa, B.fa, B.ba], [T.fb, T.bb, B.bb, B.fb], [B.fa, B.fb, B.bb, B.ba], [T.fa, T.ba, T.bb, T.fb]];
      const pos = []; for (const [p, q, r, s] of quads) pos.push(...p, ...q, ...r, ...p, ...r, ...s);
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
      const m = mat([C0, C1[i], C2[i]], { local: true, viewShade: true, axis: [0, -1, 0], lo: -yAt(200), hi: -yAt(700), side: THREE.DoubleSide });
      const rail = { mesh: new THREE.Mesh(g, m) }; lock(calm(rail), TK);
      rail.mesh.frustumCulled = false; scene.add(rail.mesh);
      anim(t => { rail.mesh.visible = t >= T_ON; });
    });
  }

  /* ---------- the fascia: the wall under the platform's edge, above frame 20 (the recess behind it is closed from above) ---------- */
  {
    const x0 = xEdge + 0.3, x1 = cam.x + dF, z0 = -1, z1 = 36;   // (integration: z0 was -8; f19's slab starts at z -1, so a sliver of fascia showed past its end in the tilt)
    const fm = mat(['#1c0c56', '#2a1070', '#3c1a8e'], { local: true, axis: [0, 1, 0], lo: YS, hi: YT });
    lock(calm({ mesh: { material: fm } }), TK);
    const g = new THREE.BoxGeometry(x1 - x0, YT - YS, z1 - z0); g.translate((x0 + x1) / 2, (YT + YS) / 2, (z0 + z1) / 2);
    const me = new THREE.Mesh(g, fm); me.frustumCulled = false; scene.add(me); anim(t => { me.visible = t >= T_ON; });
  }
};
