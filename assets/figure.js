/* Solat Pro Max — posture figure engine.
 * A side-view human figure (baju melayu, kopiah, bare feet) facing the qiblah (right).
 * Poses are declared with IK targets, converted once to joint angles, and animated by
 * interpolating angles, so limbs keep their length while moving.
 * Proportions: ~7.4 heads tall; 1 unit ≈ 1.07 cm. */
(function (global) {
  'use strict';

  const L = { torso: 50, neck: 17, head: 12, upper: 28, fore: 25, thigh: 40, shin: 38 };
  const GROUND = 184;
  const rad = (d) => (d * Math.PI) / 180;
  const deg = (r) => (r * 180) / Math.PI;
  const dir = (a, len) => [Math.cos(rad(a)) * len, Math.sin(rad(a)) * len];
  const add = (p, v) => [p[0] + v[0], p[1] + v[1]];
  const rot = (p, a) => {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    return [p[0] * c - p[1] * s, p[0] * s + p[1] * c];
  };
  // Map local points (x forward, y down, "up" = -y) into world space.
  const place = (pts, origin, upAngle) => pts.map((p) => add(origin, rot(p, upAngle + 90)));
  const placeX = (pts, origin, axisAngle) => pts.map((p) => add(origin, rot(p, axisAngle)));

  function ik(root, target, a, b, sign) {
    const dx = target[0] - root[0], dy = target[1] - root[1];
    let d = Math.hypot(dx, dy);
    d = Math.max(Math.abs(a - b) + 0.01, Math.min(a + b - 0.01, d));
    const base = deg(Math.atan2(dy, dx));
    const cosA = (a * a + d * d - b * b) / (2 * a * d);
    const a1 = base + sign * deg(Math.acos(Math.max(-1, Math.min(1, cosA))));
    const j = add(root, dir(a1, a));
    return [a1, deg(Math.atan2(target[1] - j[1], target[0] - j[0]))];
  }

  const ARM_ROOT = [-1, -44]; // shoulder joint inside the torso, local to the hip
  function armRoot(hip, torso) { return place([ARM_ROOT], hip, torso)[0]; }

  function build(s) {
    const lu = s.lu || L.upper, lf = s.lf || L.fore;
    const root = armRoot(s.hip, s.torso);
    const [u, f] = ik(root, s.wrist, lu, lf, s.elbow || 1);
    const [t, sh] = ik(s.hip, s.ankle, L.thigh, L.shin, -1);
    return { hx: s.hip[0], hy: s.hip[1], torso: s.torso, head: s.head, u, f, lu, lf, t, s: sh, foot: s.foot, hand: s.hand };
  }

  const POSES = {
    stand: build({ hip: [100, 100], torso: -90, head: -90, wrist: [101, 143], hand: 88, ankle: [100, 178], foot: 0 }),
    takbir: build({ hip: [100, 100], torso: -90, head: -90, wrist: [103, 43], hand: -86, ankle: [100, 178], foot: 0, lu: 24, lf: 25 }),
    qiyam: build({ hip: [100, 100], torso: -90, head: -82, wrist: [111, 84], hand: 30, ankle: [100, 178], foot: 0, lu: 26, lf: 20 }),
    ruku: build({ hip: [82, 100], torso: -1, head: 4, wrist: [93, 128], hand: 92, ankle: [88, 178], foot: 0 }),
    itidal: build({ hip: [100, 100], torso: -90, head: -86, wrist: [102, 143], hand: 88, ankle: [100, 178], foot: 0 }),
    sujud: build({ hip: [80, 136], torso: 24, head: 40, wrist: [128, 179], hand: 2, ankle: [46, 170], foot: 106, lu: 18, lf: 24 }),
    iftirasy: build({ hip: [80, 157], torso: -88, head: -84, wrist: [104, 150], hand: 18, ankle: [79, 178], foot: 168 }),
    tawarruk: build({ hip: [84, 167], torso: -88, head: -84, wrist: [106, 160], hand: 14, ankle: [86, 172], foot: 100 }),
  };

  function joints(p) {
    const hip = [p.hx, p.hy];
    const shoulder = add(hip, dir(p.torso, L.torso));
    const root = armRoot(hip, p.torso);
    const head = add(shoulder, dir(p.head, L.neck));
    const elbow = add(root, dir(p.u, p.lu));
    const wrist = add(elbow, dir(p.f, p.lf));
    const knee = add(hip, dir(p.t, L.thigh));
    const ankle = add(knee, dir(p.s, L.shin));
    return { hip, shoulder, root, head, elbow, wrist, knee, ankle };
  }

  const ANGLES = ['torso', 'head', 'u', 'f', 't', 's', 'foot', 'hand'];
  function lerpPose(a, b, k) {
    const o = { hx: a.hx + (b.hx - a.hx) * k, hy: a.hy + (b.hy - a.hy) * k, lu: a.lu + (b.lu - a.lu) * k, lf: a.lf + (b.lf - a.lf) * k };
    for (const key of ANGLES) {
      let d = b[key] - a[key];
      while (d > 180) d -= 360;
      while (d < -180) d += 360;
      o[key] = a[key] + d * k;
    }
    return o;
  }

  // ---- shape helpers ----
  const f1 = (n) => n.toFixed(1);
  const P = (p) => f1(p[0]) + ' ' + f1(p[1]);
  // Smooth closed curve through points (Catmull-Rom → cubic Bézier).
  function smooth(pts, closed) {
    const n = pts.length;
    const g = (i) => pts[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
    let d = 'M' + P(pts[0]);
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += 'C' + P(c1) + ' ' + P(c2) + ' ' + P(p2);
    }
    return d + (closed ? 'Z' : '');
  }
  // Tapered limb from A (width wa) to B (width wb) with rounded ends and a soft muscle bulge.
  function limb(A, B, wa, wb, bulge) {
    const dx = B[0] - A[0], dy = B[1] - A[1];
    const len = Math.hypot(dx, dy) || 1;
    const n = [-dy / len, dx / len];
    const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
    const ra = wa / 2, rb = wb / 2, b = bulge || 0;
    const a1 = add(A, [n[0] * ra, n[1] * ra]), a2 = add(A, [-n[0] * ra, -n[1] * ra]);
    const b1 = add(B, [n[0] * rb, n[1] * rb]), b2 = add(B, [-n[0] * rb, -n[1] * rb]);
    const mw = (ra + rb) / 2;
    const c1 = add(m, [n[0] * (mw + b), n[1] * (mw + b)]);
    const c2 = add(m, [-n[0] * (mw + b * 0.6), -n[1] * (mw + b * 0.6)]);
    return 'M' + P(a1) + 'Q' + P(c1) + ' ' + P(b1) + 'A' + f1(rb) + ' ' + f1(rb) + ' 0 0 0 ' + P(b2) +
      'Q' + P(c2) + ' ' + P(a2) + 'A' + f1(ra) + ' ' + f1(ra) + ' 0 0 0 ' + P(a1) + 'Z';
  }

  // Local outlines (x forward, y down).
  const TORSO = [[10, 5], [11.5, -6], [10.5, -19], [11.5, -31], [12.5, -39], [9, -48], [2, -52], [-6, -51], [-11, -45], [-11.5, -33], [-9, -21], [-11, -9], [-13, 0], [-9, 8], [2, 9]];
  const HEAD = [[-5, 10], [-10.5, 2], [-10, -7], [-4, -12], [3, -12], [8.2, -8], [9.6, -3.5], [10.2, -1.2], [12.8, 3], [10.6, 4.4], [11, 6], [10.4, 7.6], [10, 10.4], [6.5, 12.2], [1, 11.5]];
  const KOPIAH = [[-10.9, -3.6], [-11, -9.5], [-5, -13.6], [3, -13.6], [8.6, -10.6], [8.8, -6.8], [2, -8.4], [-5, -6.8]];
  const BEARD = [[0.5, 4], [3.5, 8.2], [8, 8.6], [10.6, 10.6], [8.6, 13.2], [3.5, 13.6], [-0.8, 10.5]];
  const HAIR = [[-10.9, -4], [-5, -6.8], [-6.5, -2], [-9.5, 3.5]];
  const HANDS = [[0, -3.1], [5, -3.6], [9.6, -2.9], [12.6, -1.3], [13.2, 0.8], [10, 2.7], [4, 3.3], [0, 3.1]];
  const FOOT = [[-3, -3.2], [-5.4, 1.5], [-4, 5.2], [3, 5.8], [12, 5.6], [17, 4.6], [18.2, 2.8], [15, 1.2], [8, -0.6], [3, -3.8]];

  function render(svg, p) {
    const j = joints(p);
    const q = (sel) => svg.querySelector(sel);
    const setD = (sel, d) => { const e = q(sel); if (e) e.setAttribute('d', d); };
    const off = [-3.5, -1.5];
    const o = (pt) => add(pt, off);

    const leg = (hip, knee, ankle, pre) => {
      setD(pre + 'thigh', limb(hip, knee, 17, 11.5, 1.2));
      setD(pre + 'shin', limb(knee, ankle, 11, 7, 1.4));
      const hem = add(hip, [(knee[0] - hip[0]) * 0.48, (knee[1] - hip[1]) * 0.48]);
      setD(pre + 'tunic', limb(hip, hem, 21, 17.5, 0.5));
      setD(pre + 'foot', smooth(placeX(FOOT, ankle, p.foot), true));
    };
    const arm = (root, elbow, wrist, pre) => {
      setD(pre + 'upper', limb(root, elbow, 10, 8.4, 0.8));
      setD(pre + 'fore', limb(elbow, wrist, 8.2, 6.4, 0.6));
      setD(pre + 'hand', smooth(placeX(HANDS, wrist, p.hand), true));
    };

    leg(o(j.hip), o(j.knee), o(j.ankle), '.fg-far .');
    const oa = (pt) => add(pt, [-1.5, -1]);
    arm(oa(j.root), oa(j.elbow), oa(j.wrist), '.fg-far .');
    setD('.fg-torso', smooth(place(TORSO, j.hip, p.torso), true));
    setD('.fg-neck', limb(add(j.shoulder, dir(p.torso, -4)), add(j.shoulder, dir(p.head, 9)), 9, 8, 0));
    setD('.fg-head', smooth(place(HEAD, j.head, p.head), true));
    setD('.fg-hair', smooth(place(HAIR, j.head, p.head), true));
    setD('.fg-beard', smooth(place(BEARD, j.head, p.head), true));
    setD('.fg-kopiah', smooth(place(KOPIAH, j.head, p.head), true));
    const ear = place([[-1.6, 1.2]], j.head, p.head)[0];
    const eye = place([[7.2, -1.4]], j.head, p.head)[0];
    const brow = place([[5.6, -4.2], [9.2, -4]], j.head, p.head);
    q('.fg-ear').setAttribute('cx', f1(ear[0]));
    q('.fg-ear').setAttribute('cy', f1(ear[1]));
    q('.fg-ear').setAttribute('transform', 'rotate(' + f1(p.head + 90) + ' ' + P(ear) + ')');
    q('.fg-eye').setAttribute('cx', f1(eye[0]));
    q('.fg-eye').setAttribute('cy', f1(eye[1]));
    setD('.fg-brow', 'M' + P(brow[0]) + 'L' + P(brow[1]));
    leg(j.hip, j.knee, j.ankle, '.fg-near .');
    arm(j.root, j.elbow, j.wrist, '.fg-near .');
    svg.__joints = j;
    placeOverlays(svg, j, p);
  }

  function placeOverlays(svg, j, p) {
    const set = (sel, attrs) => {
      svg.querySelectorAll(sel).forEach((el) => {
        for (const k in attrs) el.setAttribute(k, typeof attrs[k] === 'number' ? f1(attrs[k]) : attrs[k]);
      });
    };
    const eye = place([[8, -1.4]], j.head, p.head)[0];
    set('.ov-gaze', { x1: eye[0], y1: eye[1], x2: 150, y2: GROUND - 1 });
    set('.ov-spot', { cx: 150, cy: GROUND - 1 });
    const chest = place([[4, -36]], j.hip, p.torso)[0];
    set('.ov-heart', { cx: chest[0], cy: chest[1] });
    const tip = placeX([[12.5, -1], [21, -4.5]], j.wrist, p.hand);
    set('.ov-point', { x1: tip[0][0], y1: tip[0][1], x2: tip[1][0], y2: tip[1][1] });
    const back = place([[-12, -2], [-12, -50]], j.hip, p.torso);
    set('.ov-level', { x1: back[0][0] - 6, y1: back[0][1] - 4, x2: back[1][0] + 34, y2: back[1][1] - 4 });
    const pts = [
      place([[9.4, -5]], j.head, p.head)[0], place([[12.6, 3]], j.head, p.head)[0],
      placeX([[8, 3]], j.wrist, p.hand)[0], add(placeX([[8, 3]], j.wrist, p.hand)[0], [-3.5, -1.5]),
      add(j.knee, [0, 5]), add(j.knee, [-3.5, 3.5]), placeX([[17, 4]], j.ankle, p.foot)[0],
    ];
    svg.querySelectorAll('.ov-contact').forEach((c, i) => {
      c.setAttribute('cx', f1(pts[i][0]));
      c.setAttribute('cy', f1(Math.min(pts[i][1], GROUND - 1.5)));
    });
    const sh = svg.querySelector('.fg-shadow');
    if (sh) {
      const xs = [j.hip[0], j.knee[0], j.ankle[0], j.head[0], j.wrist[0]];
      const lo = Math.min.apply(null, xs) - 10, hi = Math.max.apply(null, xs) + 14;
      sh.setAttribute('cx', f1((lo + hi) / 2));
      sh.setAttribute('rx', f1((hi - lo) / 2));
    }
  }

  const SVGNS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs, parent) {
    const e = document.createElementNS(SVGNS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function limbSet(parent, cls) {
    const g = el('g', { class: cls }, parent);
    el('path', { class: 'thigh fg-trouser' }, g);
    el('path', { class: 'shin fg-trouser' }, g);
    el('path', { class: 'foot fg-skin' }, g);
    el('path', { class: 'tunic fg-shirt' }, g);
    el('path', { class: 'upper fg-shirt' }, g);
    el('path', { class: 'fore fg-shirt' }, g);
    el('path', { class: 'hand fg-skin' }, g);
    return g;
  }

  function create(container, opts) {
    opts = opts || {};
    const svg = el('svg', { viewBox: '0 0 220 200', class: 'figure', role: 'img', 'aria-label': opts.label || 'Prayer posture' });
    el('rect', { x: 14, y: GROUND, width: 192, height: 5, rx: 2.5, class: 'fg-mat' }, svg);
    el('ellipse', { class: 'fg-shadow', cx: 100, cy: GROUND + 0.5, rx: 30, ry: 2.6 }, svg);
    el('path', { d: 'M198 166 l7 6 l-7 6', class: 'fg-qiblah' }, svg);
    const ov = el('g', { class: 'ov' }, svg);
    el('line', { class: 'ov-gaze ov-item', 'data-ov': 'gaze' }, ov);
    el('circle', { class: 'ov-spot ov-item', r: 3.5, 'data-ov': 'gaze' }, ov);
    el('line', { class: 'ov-level ov-item', 'data-ov': 'level' }, ov);
    const body = el('g', { class: 'fg-body' }, svg);
    limbSet(body, 'fg-far');
    el('path', { class: 'fg-neck fg-skin' }, body);
    el('path', { class: 'fg-torso fg-shirt' }, body);
    el('path', { class: 'fg-head fg-skin' }, body);
    el('path', { class: 'fg-hair' }, body);
    el('path', { class: 'fg-beard' }, body);
    el('ellipse', { class: 'fg-ear', rx: 2.4, ry: 3.6 }, body);
    el('circle', { class: 'fg-eye', r: 1.1 }, body);
    el('path', { class: 'fg-brow' }, body);
    el('path', { class: 'fg-kopiah' }, body);
    limbSet(body, 'fg-near');
    const top = el('g', { class: 'ov' }, svg);
    el('circle', { class: 'ov-heart ov-item', r: 5.5, 'data-ov': 'heart' }, top);
    el('line', { class: 'ov-point ov-item', 'data-ov': 'point' }, top);
    for (let i = 0; i < 7; i++) el('circle', { class: 'ov-contact ov-item', r: 3.2, 'data-ov': 'contacts' }, top).style.setProperty('--i', String(i));
    const sal = el('g', { class: 'ov-salam ov-item', 'data-ov': 'salam' }, top);
    el('path', { d: 'M146 70 h26 m-7 -6 l7 6 l-7 6', class: 'ov-arrow' }, sal);
    el('path', { d: 'M146 96 h26 m-19 -6 l-7 6 l7 6', class: 'ov-arrow' }, sal);
    el('text', { x: 177, y: 73.5, class: 'ov-label' }, sal).textContent = '1 Right';
    el('text', { x: 177, y: 99.5, class: 'ov-label' }, sal).textContent = '2 Left';
    container.appendChild(svg);

    let current = Object.assign({}, POSES[opts.pose] || POSES.stand);
    let raf = 0;
    render(svg, current);
    setOverlays(opts.overlays || []);

    function setOverlays(list) {
      svg.querySelectorAll('.ov-item').forEach((n) => n.classList.toggle('on', list.indexOf(n.dataset.ov) !== -1));
    }
    function set(name, overlays, animate) {
      const target = POSES[name] || POSES.stand;
      setOverlays(overlays || []);
      cancelAnimationFrame(raf);
      const reduce = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (animate === false || reduce) {
        current = Object.assign({}, target);
        render(svg, current);
        return;
      }
      const from = current, t0 = performance.now(), dur = 700;
      const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
      const tick = (now) => {
        const k = Math.min(1, (now - t0) / dur);
        current = lerpPose(from, target, ease(k));
        render(svg, current);
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
    return { svg, set };
  }

  global.SolatFigure = { create, POSES };
})(window);
