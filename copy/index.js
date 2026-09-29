/* The copy layer's per-frame files (supers, text boxes, pictures), run after every group has made its holds, in this order.
   Each is export default V => { … } using V.copy / V.copyLayer / V.copyTL (see the COPY LAYER comment in v2.js).
   Every frame with copy is listed, and each file exists (a stub until its copy is written), so there is nothing to
   register. v2.js loads each file on its own: a file that doesn't parse only loses its own copy (check.mjs shows why).
   Frames 4–6 have no copy (4's READY? LET'S GO is the set's 3D letters); there is no frame 26. */
export default ['c01', 'c02', 'c03', 'c07', 'c08', 'c09', 'c10', 'c11', 'c12', 'c13', 'c14', 'c15',
  'c16', 'c17', 'c18', 'c19', 'c20', 'c21', 'c22', 'c23', 'c24', 'c25', 'c27', 'c28', 'c29', 'c30', 'c31'];
