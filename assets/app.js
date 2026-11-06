/* Solat Pro Max — application. No dependencies, no network calls except optional Quran audio. */
(function () {
  'use strict';
  const D = window.SOLAT;
  const root = document.documentElement;

  // ---------- DOM helpers ----------
  function h(tag, props, ...kids) {
    const e = document.createElement(tag);
    if (props) {
      for (const k in props) {
        const v = props[k];
        if (v == null || v === false) continue;
        if (k === 'class') e.className = v;
        else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
        else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
        else e.setAttribute(k, v === true ? '' : v);
      }
    }
    append(e, kids);
    return e;
  }
  function append(e, kids) {
    for (const c of kids.flat(Infinity)) {
      if (c == null || c === false) continue;
      e.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return e;
  }
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);

  const ICONS = {
    learn: '<path d="M2.5 9 12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v4.5c0 1.6 2.5 3 5.5 3s5.5-1.4 5.5-3V11"/><path d="M21.5 9v5.5"/>',
    doa: '<path d="M10.5 20.5 6 16c-1-1-1.5-2.2-1.5-3.6V6.5a1.5 1.5 0 0 1 3 0V11"/><path d="M7.5 11V4.8a1.5 1.5 0 0 1 3 0v8.7"/><path d="M13.5 20.5 18 16c1-1 1.5-2.2 1.5-3.6V6.5a1.5 1.5 0 0 0-3 0V11"/><path d="M16.5 11V4.8a1.5 1.5 0 0 0-3 0v8.7"/>',
    surah: '<path d="M12 7.5c-2-1.6-4.6-2-7.5-1.5v9.5c2.9-.5 5.5-.1 7.5 1.5 2-1.6 4.6-2 7.5-1.5V6c-2.9-.5-5.5-.1-7.5 1.5z"/><path d="M12 7.5V17M6 21l6-4 6 4"/>',
    pray: '<circle cx="15.5" cy="5" r="2"/><path d="M4 20h16"/><path d="M6.5 20c0-4 2-6.5 5-7.5l3.5 3"/><path d="M11.5 12.5 14 9l3.5 2.5"/>',
    library: '<path d="M5 4h4v16H5zM10 4h4v16h-4z"/><path d="m15 5 3.6-.9 3.2 15.5-3.6.9z"/>',
    handbook: '<path d="M6 3h11a1 1 0 0 1 1 1v17l-6.5-3.5L5 21V4a1 1 0 0 1 1-1z"/><path d="M9 8h6M9 11.5h4"/>',
    track: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="m9 15 2 2 4-4"/>',
    flame: '<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.3 2.4-5.3 3.8-7.8.6 1.6 1.6 2.6 2.7 3.1.3-2.6 1.6-5 3.7-7.1.3 3.4 2.8 5.9 2.8 10.4 0 4.6-2.6 7.6-6.5 7.6z"/>',
    star: '<path d="m12 3 2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4l-5.3 3 1.2-6-4.5-4.1 6-.7z"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    right: '<path d="m9 5 7 7-7 7"/>',
    left: '<path d="m15 5-7 7 7 7"/>',
    play: '<path d="M7 4.5v15l12.5-7.5z"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
    sound: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    alert: '<path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17.2v.3"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    auto: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17A8.5 8.5 0 0 0 12 3.5z" fill="currentColor"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  };
  function icon(name, cls) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('class', 'icon' + (cls ? ' ' + cls : ''));
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = ICONS[name] || '';
    return s;
  }
  function brandMark() {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 32 32');
    s.setAttribute('class', 'brand-mark');
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = '<rect x="6" y="6" width="20" height="20" rx="3" fill="var(--accent)"/><rect x="6" y="6" width="20" height="20" rx="3" fill="var(--accent)" transform="rotate(45 16 16)"/><path d="M16 9.5a6.5 6.5 0 1 0 4.6 11.1A5.2 5.2 0 1 1 16 9.5z" fill="var(--accent-ink)"/>';
    return s;
  }

  // ---------- state ----------
  const KEY = 'solat-pro-max.v1';
  const defaults = () => ({ xp: 0, day: { date: '', xp: 0 }, lessons: {}, days: [], log: {}, logMax: {}, badges: [], mastery: {}, prefs: { tr: true, en: true, theme: 'auto' }, guided: 0, tasbih: 0 });
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      const s = JSON.parse(raw);
      const d = defaults();
      return Object.assign(d, s, { prefs: Object.assign(d.prefs, s.prefs || {}) });
    } catch (e) { return defaults(); }
  }
  let S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage blocked: progress lasts this visit */ } }

  const pad = (n) => String(n).padStart(2, '0');
  const dkey = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const today = () => dkey(new Date());
  const shift = (key, n) => { const [y, m, d] = key.split('-').map(Number); return dkey(new Date(y, m - 1, d + n)); };

  function streakFrom(days, start) {
    const set = new Set(days);
    let k = start, n = 0;
    while (set.has(k)) { n++; k = shift(k, -1); }
    return n;
  }
  function streak() {
    const t = today();
    return S.days.includes(t) ? streakFrom(S.days, t) : streakFrom(S.days, shift(t, -1));
  }
  function bestStreak() {
    const sorted = [...new Set(S.days)].sort();
    let best = 0, run = 0, prev = null;
    for (const d of sorted) { run = prev && shift(prev, 1) === d ? run + 1 : 1; best = Math.max(best, run); prev = d; }
    return best;
  }
  function markActive() {
    const t = today();
    if (!S.days.includes(t)) S.days.push(t);
    const s = streak();
    if (s >= 3) award('streak3');
    if (s >= 7) award('streak7');
    if (s >= 30) award('streak30');
  }
  const GOAL = 30;
  function addXP(n) {
    if (n <= 0) return;
    const t = today();
    if (S.day.date !== t) S.day = { date: t, xp: 0 };
    S.xp += n;
    S.day.xp += n;
    markActive();
    save();
    updateTop();
  }
  function xpToday() { return S.day.date === today() ? S.day.xp : 0; }
  function level() {
    let cur = D.levels[0], next = null;
    for (let i = 0; i < D.levels.length; i++) {
      if (S.xp >= D.levels[i].xp) { cur = D.levels[i]; next = D.levels[i + 1] || null; }
    }
    return { cur, next, idx: D.levels.indexOf(cur) + 1 };
  }
  function award(id) {
    if (S.badges.includes(id)) return false;
    S.badges.push(id);
    save();
    const b = D.badges.find((x) => x.id === id);
    if (b) setTimeout(() => toast('Badge unlocked: ' + b.t, 'star'), 400);
    return true;
  }
  let toastTimer = 0;
  function toast(msg, ic) {
    document.querySelectorAll('.toast').forEach((t) => t.remove());
    const t = h('div', { class: 'toast', role: 'status' }, icon(ic || 'check'), msg);
    document.body.append(t);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.remove(), 2800);
  }

  // ---------- theme & sky ----------
  function skyNow() {
    const hr = new Date().getHours() + new Date().getMinutes() / 60;
    if (hr >= 4.5 && hr < 7.25) return 'dawn';
    if (hr >= 7.25 && hr < 15.5) return 'noon';
    if (hr >= 15.5 && hr < 19) return 'afternoon';
    if (hr >= 19 && hr < 20.25) return 'dusk';
    return 'night';
  }
  function applyTheme() {
    root.dataset.sky = skyNow();
    if (S.prefs.theme === 'auto') root.removeAttribute('data-theme');
    else root.dataset.theme = S.prefs.theme;
  }

  // ---------- audio (Quran recitation, Mahmoud Khalil al-Husary) ----------
  const audio = { el: null, queue: [], onAyah: null, btn: null };
  function stopAudio() {
    if (audio.el) { audio.el.pause(); audio.el.removeAttribute('src'); audio.el = null; }
    audio.queue = [];
    if (audio.onAyah) audio.onAyah(-1);
    audio.onAyah = null;
    if (audio.btn) { audio.btn.replaceChildren(icon('sound'), 'Listen'); audio.btn = null; }
  }
  function playAyat(surah, from, to, onAyah, btn) {
    const wasSame = audio.btn === btn;
    stopAudio();
    if (wasSame) return;
    for (let a = from; a <= to; a++) audio.queue.push(a);
    audio.onAyah = onAyah;
    audio.btn = btn;
    btn.replaceChildren(icon('stop'), 'Stop');
    const next = () => {
      const a = audio.queue.shift();
      if (a == null) { stopAudio(); return; }
      if (onAyah) onAyah(a);
      const url = 'https://everyayah.com/data/Husary_128kbps/' + String(surah).padStart(3, '0') + String(a).padStart(3, '0') + '.mp3';
      const el = new Audio(url);
      audio.el = el;
      el.addEventListener('ended', next);
      el.addEventListener('error', () => { stopAudio(); toast('Recitation could not load. It needs an internet connection.', 'alert'); });
      el.play().catch(() => { stopAudio(); toast('Recitation could not play here.', 'alert'); });
    };
    next();
  }

  // ---------- shared renderers ----------
  const duaById = (id) => D.duas.find((d) => d.id === id);
  const surahById = (id) => D.surahs.find((s) => s.id === id);

  function clozeText(text, lvl, seed) {
    if (!lvl) return text;
    const words = text.split(' ');
    return words.map((w, i) => {
      const hide = lvl >= 3 || (lvl === 1 ? (i + seed) % 3 === 2 : (i + seed) % 3 !== 0);
      const node = hide && w.length > 1 ? h('span', { class: 'cloze', role: 'button', tabindex: '0', title: 'Tap to reveal', onclick: (e) => e.currentTarget.classList.toggle('show') }, w) : w;
      return i < words.length - 1 ? [node, ' '] : [node];
    });
  }

  function duaBlock(d, opts) {
    opts = opts || {};
    const lvl = opts.cloze || 0;
    if (d.parts) {
      return h('div', { class: 'dua' },
        opts.head !== false && h('div', { class: 'dua-head' }, h('h3', null, d.title), h('span', { class: 'count' }, d.parts.length + ' parts')),
        d.note && opts.note !== false && h('p', { class: 'note' }, d.note),
        h('ol', { class: 'parts' }, d.parts.map((pt, k) => h('li', { class: 'part' },
          h('span', { class: 'eyebrow' }, pt.label),
          h('p', { class: 'ar', lang: 'ar' }, clozeText(pt.ar, lvl, k)),
          h('p', { class: 'tr' }, pt.tr),
          h('p', { class: 'en' }, pt.en),
          pt.src && h('p', { class: 'src' }, 'Source: ' + pt.src)))));
    }
    return h('div', { class: 'dua' },
      opts.head !== false && h('div', { class: 'dua-head' }, h('h3', null, d.title), d.count && h('span', { class: 'count' }, '×' + d.count)),
      h('p', { class: 'ar' + (d.audio ? ' quran' : ''), lang: 'ar' }, clozeText(d.ar, lvl, 0)),
      h('p', { class: 'tr' }, d.tr),
      h('p', { class: 'en' }, d.en),
      d.note && opts.note !== false && h('p', { class: 'note' }, d.note),
      d.src && h('p', { class: 'src' }, 'Source: ' + d.src));
  }

  function surahBlock(s, opts) {
    opts = opts || {};
    const lvl = opts.cloze || 0;
    const ay = s.ayat.map((a, i) => h('div', { class: 'ayah', 'data-n': i + 1 },
      h('p', { class: 'ar quran', lang: 'ar' }, clozeText(a.ar, lvl, i), h('span', { class: 'ayah-no' }, i + 1)),
      h('p', { class: 'tr' }, a.tr),
      h('p', { class: 'en' }, a.en),
      a.tip && opts.tips !== false && h('p', { class: 'tip' }, icon('bulb'), a.tip)));
    return h('div', { class: 'surah' }, ay);
  }
  function listenButton(s, container) {
    const btn = h('button', { class: 'btn small', type: 'button' }, icon('sound'), 'Listen');
    btn.addEventListener('click', () => {
      playAyat(s.n, 1, s.ayat.length, (n) => {
        container.querySelectorAll('.ayah').forEach((a) => a.classList.toggle('playing', Number(a.dataset.n) === n));
      }, btn);
    });
    return btn;
  }

  function prayerTable() {
    return h('div', { class: 'table-wrap' }, h('table', null,
      h('thead', null, h('tr', null, h('th', null, 'Prayer'), h('th', null, 'Fard'), h('th', null, 'Time'), h('th', null, 'Sunnah before'), h('th', null, 'Sunnah after'))),
      h('tbody', null, D.prayers.map((p) => h('tr', null,
        h('td', null, h('b', null, p.name), h('br'), h('small', { class: 'muted' }, p.alt + ' · ' + (p.jahr ? (p.jahr === p.rakaat ? 'aloud' : 'first 2 aloud') : 'silent'))),
        h('td', null, h('span', { class: 'big' }, p.rakaat)),
        h('td', null, p.time),
        h('td', null, p.before),
        h('td', null, p.after))))));
  }

  function medal(earned) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 48 48');
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = '<rect x="10" y="10" width="28" height="28" rx="3" class="medal-b"/><rect x="10" y="10" width="28" height="28" rx="3" class="medal-b" transform="rotate(45 24 24)"/><circle cx="24" cy="24" r="11" class="medal-a"/>' + (earned ? '<path d="m18.5 24.5 3.6 3.6 7.4-7.6" class="medal-c"/>' : '');
    return s;
  }

  // ---------- shell ----------
  const VIEWS = [
    { id: 'learn', label: 'Learn', icon: 'learn' },
    { id: 'pray', label: 'Pray', icon: 'pray' },
    { id: 'doa', label: 'Doa and Wirid', icon: 'doa' },
    { id: 'surah', label: 'Surah', icon: 'surah' },
    { id: 'handbook', label: 'Handbook', icon: 'handbook' },
    { id: 'track', label: 'Track', icon: 'track' },
  ];
  let mainEl, topStats;
  function shell() {
    const app = $('#app');
    const tabs = (cls) => VIEWS.map((v) => h('a', { class: 'tab', href: '#' + v.id, 'data-view': v.id }, icon(v.icon), h('span', null, v.label)));
    topStats = h('div', { class: 'confirm' });
    mainEl = h('main', { class: 'main', id: 'main' });
    app.replaceChildren(
      h('nav', { class: 'rail', 'aria-label': 'Sections' },
        h('a', { class: 'brand', href: '#learn' }, brandMark(), h('span', null, 'Solat Pro Max', h('small', null, 'Shafi’i · guided'))),
        tabs(),
        h('p', { class: 'rail-foot' }, 'Follows the Shafi’i school as taught in Malaysia, Brunei, Singapore and Indonesia. For personal rulings, ask your local ustaz or ustazah.')),
      h('div', { style: { minWidth: '0' } },
        mainEl),
      h('nav', { class: 'tabbar', 'aria-label': 'Sections' }, tabs()));
  }
  function topbar() {
    const lv = level();
    const s = streak();
    return h('header', { class: 'topbar' },
      h('a', { class: 'brand', href: '#learn' }, brandMark(), h('span', null, 'Solat Pro Max', h('small', null, 'Shafi’i · guided'))),
      h('span', { class: 'spacer' }),
      h('span', { class: 'stat-pill streak' + (S.days.includes(today()) ? '' : ' cold'), title: s + '-day streak' }, icon('flame'), s),
      h('span', { class: 'stat-pill xp', title: lv.cur.t + ' · ' + S.xp + ' XP' }, icon('star'), h('span', { class: 'lvl' }, lv.cur.t + ' · '), S.xp + ' XP'));
  }
  function updateTop() {
    const old = $('.topbar');
    if (old) old.replaceWith(topbar());
  }

  let current = 'learn';
  function route() {
    let id = (location.hash || '#learn').slice(1);
    if (id === 'library') id = 'doa';
    current = VIEWS.some((v) => v.id === id) ? id : 'learn';
    stopAudio();
    document.querySelectorAll('.sheet').forEach((sh) => sh.remove());
    document.querySelectorAll('.tab').forEach((t) => {
      if (t.dataset.view === current) t.setAttribute('aria-current', 'page');
      else t.removeAttribute('aria-current');
    });
    const col = h('div', { class: 'col' });
    mainEl.replaceChildren(topbar(), col);
    mainEl.classList.toggle('hide-tr', !S.prefs.tr);
    mainEl.classList.toggle('hide-en', !S.prefs.en);
    ({ learn: viewLearn, pray: viewPray, doa: (c) => viewLibrary(c, 'doa'), surah: (c) => viewLibrary(c, 'surah'), handbook: viewHandbook, track: viewTrack })[current](col);
    window.scrollTo(0, 0);
  }

  // ---------- LEARN ----------
  function nextLesson() { return D.lessons.find((l) => !S.lessons[l.id]) || null; }
  function ring(val, max, size) {
    const r = 21, c = 2 * Math.PI * r;
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 52 52');
    s.setAttribute('class', 'ring');
    if (size) { s.style.width = size + 'px'; s.style.height = size + 'px'; }
    s.innerHTML = '<circle class="track" cx="26" cy="26" r="' + r + '"/><circle class="val" cx="26" cy="26" r="' + r + '" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - Math.min(1, val / max))).toFixed(1) + '"/>';
    return s;
  }
  function viewLearn(col) {
    const nl = nextLesson();
    const done = D.lessons.filter((l) => S.lessons[l.id]).length;
    const xt = xpToday();
    const greet = { dawn: 'The dawn is for Subuh.', noon: 'A good hour to learn.', afternoon: 'Before Asar slips away.', dusk: 'Maghrib comes quickly.', night: 'Quiet nights, steady learning.' }[skyNow()];
    col.append(
      h('section', { class: 'hero' },
        h('span', { class: 'hero-ar', lang: 'ar' }, 'صَلُّوا كَمَا رَأَيْتُمُونِي أُصَلِّي'),
        h('h1', null, 'Pray the way the Prophet ', h('span', { class: 'saw', lang: 'ar' }, 'ﷺ'), ' prayed.'),
        h('p', null, '“Pray as you have seen me praying” (al-Bukhari 631). Fourteen short lessons, an animated guide for every rakaat, and every doa with its meaning. ' + greet),
        h('div', { class: 'hero-row' },
          nl ? h('button', { class: 'btn primary', type: 'button', onclick: () => openLesson(nl) }, done ? 'Continue: ' + nl.title : 'Start lesson 1', icon('right'))
            : h('a', { class: 'btn primary', href: '#pray' }, 'Pray along', icon('right')),
          h('a', { class: 'btn ghost', href: '#pray' }, icon('pray'), 'Pray along')),
        h('div', { class: 'goal' }, ring(xt, GOAL),
          h('div', null, h('b', null, xt >= GOAL ? 'Daily goal reached' : 'Daily goal: ' + xt + ' / ' + GOAL + ' XP'),
            h('span', { class: 'muted' }, done + ' of ' + D.lessons.length + ' lessons done · ' + streak() + '-day streak')))));

    for (const u of D.units) {
      const ls = D.lessons.filter((l) => l.unit === u.n);
      const ud = ls.filter((l) => S.lessons[l.id]).length;
      col.append(h('section', { class: 'unit' },
        h('div', { class: 'unit-head' }, h('span', { class: 'eyebrow' }, 'Unit ' + u.n), h('h3', null, u.title),
          h('span', { class: 'unit-bar', role: 'progressbar', 'aria-valuenow': ud, 'aria-valuemax': ls.length, 'aria-label': u.title + ' progress' }, h('i', { style: { width: (ud / ls.length) * 100 + '%' } }))),
        h('ol', { class: 'path' }, ls.map((l) => {
          const rec = S.lessons[l.id];
          const i = D.lessons.indexOf(l) + 1;
          const isNext = nl && nl.id === l.id;
          return h('li', null, h('button', { class: 'node' + (rec ? ' done' : '') + (isNext ? ' next' : ''), type: 'button', onclick: () => openLesson(l) },
            h('span', { class: 'node-dot' }, rec ? icon('check') : i),
            h('span', null, h('b', null, l.title), h('small', null, l.blurb)),
            h('span', { class: 'best' }, rec ? 'Best ' + rec.best + '%' : l.quiz.length + ' questions')));
        }))));
    }
  }

  // ---------- LESSON PLAYER ----------
  function renderCard(c) {
    switch (c.type) {
      case 'quote': return h('div', { class: 'panel' }, h('p', { class: 'quote' }, c.text), h('p', { class: 'src' }, c.src));
      case 'text': return h('div', { class: 'panel' }, h('h3', null, c.title), h('p', null, c.body));
      case 'list': return h('div', { class: 'panel' }, h('h3', null, c.title), h('ul', { class: 'list' }, c.items.map((i) => h('li', null, i))));
      case 'items': return h('div', { class: 'panel' }, h('h3', null, c.title), h('ul', { class: 'items' }, c.items.map((i) => h('li', null, h('b', null, i.t), i.d && h('span', null, i.d)))));
      case 'steps': return h('div', { class: 'panel' }, h('h3', null, c.title), h('ol', { class: 'items' }, c.items.map((i) => h('li', null, h('span', { style: { display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' } }, h('b', null, i.t), h('span', { class: 'tag ' + (i.tag === 'rukun' ? 'rukun' : 'sunnah') }, i.tag === 'rukun' ? 'Pillar' : 'Sunnah')), h('span', null, i.d)))));
      case 'dua': return h('div', { class: 'panel' }, duaBlock(duaById(c.id)));
      case 'surah': { const s = surahById(c.id); const box = h('div', null, surahBlock(s)); return h('div', { class: 'panel' }, h('div', { class: 'dua-head' }, h('h3', null, s.name + ' · ' + s.meaning), listenButton(s, box)), box); }
      case 'figure': { const f = h('div', { style: { maxWidth: '320px', margin: '0 auto', width: '100%' } }); SolatFigure.create(f, { pose: c.pose, overlays: c.ov, label: c.title }); return h('div', { class: 'panel' }, f, h('h3', null, c.title), h('p', null, c.body)); }
      case 'table': return h('div', { class: 'panel' }, h('h3', null, c.title), prayerTable());
      case 'rukun': return h('div', { class: 'panel' }, h('h3', null, 'The 13 pillars (rukun)'), rukunList());
      case 'mistakes': return h('div', { style: { display: 'grid', gap: '10px' } }, mistakeList());
      default: return h('div');
    }
  }
  function rukunList() {
    return h('ol', { class: 'rk' }, D.rukun.map((r) => h('li', null, h('span', { class: 'n' }, r.n), h('span', null, h('b', null, r.name), h('small', null, r.note)), h('span', { class: 'type' }, r.type))));
  }
  function mistakeList() {
    return D.mistakes.map((m) => h('div', { class: 'mistake ' + m.severity }, h('div', null,
      h('span', { class: 'sev ' + m.severity }, { invalid: 'Can invalidate', serious: 'Serious', disliked: 'Disliked (makruh)' }[m.severity]),
      h('b', null, m.t), h('p', null, m.fix), m.src && h('p', { class: 'src' }, m.src))));
  }
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function openLesson(lesson) {
    stopAudio();
    const total = lesson.cards.length + lesson.quiz.length;
    let i = 0, correct = 0;
    const prog = h('i');
    const body = h('div', { class: 'sheet-body' });
    const foot = h('div', { class: 'sheet-foot' });
    const close = () => { stopAudio(); sheet.remove(); document.removeEventListener('keydown', onKey); route(); };
    const sheet = h('div', { class: 'sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': lesson.title },
      h('div', { class: 'sheet-top' }, h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Close lesson', onclick: close }, icon('x')), h('div', { class: 'progress' }, prog)),
      body, foot);
    document.body.append(sheet);
    let primary = null;
    function onKey(e) { if (e.key === 'Escape') close(); if (e.key === 'Enter' && primary && !primary.disabled && document.activeElement.tagName !== 'BUTTON') primary.click(); }
    document.addEventListener('keydown', onKey);

    function setFoot(state, title, text, label, onGo, disabled) {
      foot.className = 'sheet-foot' + (state ? ' ' + state : '');
      primary = h('button', { class: 'btn primary', type: 'button', disabled: !!disabled, onclick: onGo }, label);
      foot.replaceChildren(h('div', { class: 'row' }, h('div', { class: 'feedback' }, title && h('b', null, title), text && h('span', null, text)), primary));
      return primary;
    }
    function show() {
      prog.style.width = (i / total) * 100 + '%';
      body.scrollTop = 0;
      if (i < lesson.cards.length) {
        const c = lesson.cards[i];
        body.replaceChildren(h('div', { class: 'sheet-inner' }, i === 0 && h('div', null, h('span', { class: 'eyebrow' }, 'Lesson ' + (D.lessons.indexOf(lesson) + 1)), h('h2', { style: { fontSize: '1.9rem' } }, lesson.title)), renderCard(c)));
        setFoot('', '', (i + 1) + ' of ' + lesson.cards.length, i === lesson.cards.length - 1 ? 'Start quiz' : 'Continue', () => { stopAudio(); i++; show(); });
      } else if (i < total) {
        quiz(lesson.quiz[i - lesson.cards.length]);
      } else finish();
    }
    function answered(ok, explain) {
      if (ok) correct++;
      setFoot(ok ? 'good' : 'bad', ok ? pick(['Correct', 'Well done', 'Ma sha Allah', 'Exactly']) : 'Not quite', explain || '', 'Continue', () => { i++; show(); });
      primary.focus();
    }
    const pick = (a) => a[Math.floor(Math.random() * a.length)];

    function quiz(q) {
      const t = q.t || 'mcq';
      const inner = h('div', { class: 'sheet-inner' }, h('span', { class: 'eyebrow' }, 'Question ' + (i - lesson.cards.length + 1) + ' of ' + lesson.quiz.length), h('p', { class: 'q' }, q.q));
      body.replaceChildren(inner);
      if (t === 'mcq' || t === 'tf') {
        const opts = t === 'tf' ? ['True', 'False'] : q.o;
        const answer = t === 'tf' ? (q.a ? 0 : 1) : q.a;
        let sel = -1;
        const btns = opts.map((o, k) => h('button', { class: 'opt', type: 'button', onclick: () => { sel = k; btns.forEach((b, j) => b.classList.toggle('sel', j === k)); check.disabled = false; } }, o));
        inner.append(h('div', { class: 'opts' + (t === 'tf' ? ' tf' : '') }, btns));
        const check = setFoot('', '', '', 'Check', () => {
          btns.forEach((b, j) => { b.disabled = true; b.classList.remove('sel'); if (j === answer) b.classList.add('right'); else if (j === sel) b.classList.add('wrong'); });
          answered(sel === answer, q.e);
        }, true);
      } else if (t === 'order') {
        const pool = shuffle(q.items);
        if (pool.join() === q.items.join() && pool.length > 1) pool.push(pool.shift());
        const placed = [];
        const slots = h('div', { class: 'order-slots', 'aria-label': 'Your order' });
        const poolEl = h('div', { class: 'opts' });
        const draw = () => {
          slots.replaceChildren(...(placed.length ? placed.map((it, k) => h('button', { class: 'opt sel', type: 'button', onclick: () => { placed.splice(k, 1); draw(); } }, h('em', null, k + 1), it)) : [h('span', { class: 'muted' }, 'Tap the items below in the right order.')]));
          poolEl.replaceChildren(...pool.filter((it) => !placed.includes(it)).map((it) => h('button', { class: 'opt', type: 'button', onclick: () => { placed.push(it); draw(); } }, it)));
          check.disabled = placed.length !== q.items.length;
        };
        inner.append(slots, poolEl);
        const check = setFoot('', '', '', 'Check', () => {
          const ok = placed.every((it, k) => it === q.items[k]);
          slots.querySelectorAll('.opt').forEach((b, k) => { b.disabled = true; b.classList.remove('sel'); b.classList.add(placed[k] === q.items[k] ? 'right' : 'wrong'); });
          answered(ok, ok ? '' : 'Correct order: ' + q.items.join(' → '));
        }, true);
        draw();
      } else if (t === 'classify') {
        const items = shuffle(q.items);
        let k = 0, wrong = 0;
        const doneEl = h('div', { class: 'classify-done' });
        const stage = h('div');
        const buttons = h('div', { class: 'opts tf' });
        inner.append(stage, buttons, doneEl);
        setFoot('', '', 'Sort each item', 'Check', () => {}, true);
        const next = () => {
          if (k >= items.length) {
            stage.replaceChildren();
            buttons.replaceChildren();
            answered(wrong === 0, wrong ? wrong + ' of ' + items.length + ' sorted wrongly.' : 'All sorted correctly.');
            return;
          }
          const [label, bucket] = items[k];
          stage.replaceChildren(h('div', { class: 'classify-item' }, label));
          buttons.replaceChildren(...q.buckets.map((b, j) => h('button', { class: 'opt', type: 'button', style: { textAlign: 'center' }, onclick: () => {
            const ok = j === bucket;
            if (!ok) wrong++;
            doneEl.append(h('span', { class: ok ? 'r' : 'w' }, label + ' → ' + q.buckets[bucket]));
            k++;
            next();
          } }, b)));
        };
        next();
      }
    }
    function finish() {
      prog.style.width = '100%';
      const n = lesson.quiz.length;
      const pct = Math.round((correct / n) * 100);
      const prev = S.lessons[lesson.id];
      const first = !prev;
      let xp = first ? correct * 10 + 20 + (pct === 100 ? 15 : 0) : correct * 3 + 5;
      S.lessons[lesson.id] = { best: Math.max(pct, prev ? prev.best : 0), at: today() };
      addXP(xp);
      award('first');
      if (pct === 100) award('perfect');
      if (lesson.id === 'fatihah' && pct === 100) award('fatihah');
      for (const u of D.units) if (D.lessons.filter((l) => l.unit === u.n).every((l) => S.lessons[l.id])) award('unit' + u.n);
      save();
      const nl = nextLesson();
      const burst = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      burst.setAttribute('viewBox', '0 0 140 140');
      burst.setAttribute('class', 'burst');
      let rays = '';
      for (let r = 0; r < 8; r++) { const a = (r * Math.PI) / 4; rays += '<path d="M' + (70 + Math.cos(a) * 34).toFixed(1) + ' ' + (70 + Math.sin(a) * 34).toFixed(1) + 'L' + (70 + Math.cos(a) * 62).toFixed(1) + ' ' + (70 + Math.sin(a) * 62).toFixed(1) + '"/>'; }
      burst.innerHTML = rays + '<g class="star"><rect x="52" y="52" width="36" height="36" rx="3"/><rect x="52" y="52" width="36" height="36" rx="3" transform="rotate(45 70 70)"/></g>';
      burst.querySelectorAll('path').forEach((pa, r) => { pa.style.animationDelay = r * 40 + 'ms'; });
      body.replaceChildren(h('div', { class: 'sheet-inner' }, h('div', { class: 'result' }, burst,
        h('h2', null, pct === 100 ? 'Flawless.' : pct >= 70 ? 'Lesson complete.' : 'Done. Review and try again.'),
        h('div', { class: 'xp-big' }, '+' + xp + ' XP'),
        h('p', { class: 'muted' }, correct + ' of ' + n + ' correct · ' + pct + '%' + (first ? '' : ' · practice round')),
        h('p', { class: 'muted' }, 'Today: ' + xpToday() + ' / ' + GOAL + ' XP · ' + streak() + '-day streak'))));
      foot.className = 'sheet-foot';
      primary = h('button', { class: 'btn primary', type: 'button', onclick: () => { close(); if (nl) openLesson(nl); } }, nl ? 'Next: ' + nl.title : 'Finish', icon('right'));
      foot.replaceChildren(h('div', { class: 'row' }, h('button', { class: 'btn ghost', type: 'button', onclick: close }, 'Back to path'), primary));
    }
    show();
  }

  // ---------- PRAY ALONG ----------
  const skyPrayer = { dawn: 'subuh', noon: 'zohor', afternoon: 'asar', dusk: 'maghrib', night: 'isyak' };
  const pray = { pid: null, idx: 0, surah: { 1: 'ikhlas', 2: 'kawthar' }, fig: null };
  function buildSequence(p) {
    const seq = [{ k: 'prepare', r: 0 }, { k: 'niat', r: 1 }, { k: 'qiyam', r: 1 }, { k: 'iftitah', r: 1 }];
    for (let r = 1; r <= p.rakaat; r++) {
      seq.push({ k: 'fatihah', r });
      if (r <= 2) seq.push({ k: 'surah', r });
      seq.push({ k: 'ruku', r }, { k: 'itidal', r });
      if (p.qunut && r === 2) seq.push({ k: 'qunut', r });
      seq.push({ k: 'sujud1', r }, { k: 'julus', r }, { k: 'sujud2', r });
      if (r === p.rakaat) seq.push({ k: 'tashahhud2', r }, { k: 'salam', r });
      else if (r === 2) seq.push({ k: 'tashahhud1', r });
      else seq.push({ k: 'istirahah', r });
    }
    return seq;
  }
  const TAGS = { rukun: ['rukun', 'Pillar'], abadh: ['abadh', 'Sunnah ab’adh'], sunnah: ['sunnah', 'Sunnah'], condition: ['condition', 'Before you start'] };

  function viewPray(col) {
    if (!pray.pid) pray.pid = skyPrayer[skyNow()];
    const p = D.prayers.find((x) => x.id === pray.pid);
    const seq = buildSequence(p);
    pray.idx = Math.min(pray.idx, seq.length - 1);

    const figBox = h('div');
    pray.fig = SolatFigure.create(figBox, { pose: 'stand', label: 'Posture for the current step' });
    const dots = h('div', { class: 'rakaat', 'aria-label': 'Rakaat' });
    const voice = h('span', { class: 'voice' });
    const stepBody = h('div', { class: 'step-body' });
    const prog = h('i');
    const label = h('span');
    const timeline = h('div', { class: 'timeline', role: 'tablist', 'aria-label': 'Steps' });
    const prev = h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Previous step', onclick: () => go(pray.idx - 1) }, icon('left'));
    const next = h('button', { class: 'btn primary', type: 'button', onclick: () => (pray.idx === seq.length - 1 ? complete() : go(pray.idx + 1)) });

    col.append(
      h('div', { class: 'sec-head' }, h('div', null, h('span', { class: 'eyebrow' }, 'Guided prayer'), h('h2', null, 'Pray along, step by step')),
        h('div', { class: 'chips', role: 'group', 'aria-label': 'Choose a prayer' }, D.prayers.map((x) => h('button', { class: 'chip', type: 'button', 'aria-pressed': String(x.id === p.id), onclick: () => { pray.pid = x.id; pray.idx = 0; route(); } }, x.name + ' · ' + x.rakaat)))),
      h('section', { class: 'pray' },
        timeline,
        h('div', { class: 'stage' }, h('div', { class: 'stage-fig' }, h('div', { class: 'stage-meta' }, dots, voice), figBox), stepBody),
        h('div', { class: 'controls' }, prev, h('div', { class: 'ctrl-mid' }, label, h('div', { class: 'progress' }, prog)), next)));

    seq.forEach((s, k) => timeline.append(h('button', { type: 'button', role: 'tab', onclick: () => go(k) }, (s.r ? s.r + ' · ' : '') + (D.steps[s.k].short || D.steps[s.k].name))));

    function sayBlock(d) { return h('div', { class: 'say' }, duaBlock(d)); }
    function go(k, instant) {
      stopAudio();
      pray.idx = Math.max(0, Math.min(seq.length - 1, k));
      const s = seq[pray.idx];
      const st = D.steps[s.k];
      pray.fig.set(st.pose, st.ov, !instant);
      dots.replaceChildren(...Array.from({ length: p.rakaat }, (_, n) => h('i', { class: n + 1 === s.r ? 'on' : n + 1 < s.r ? 'done' : '' })), h('span', null, s.r ? 'Rakaat ' + s.r + ' of ' + p.rakaat : 'Before'));
      const recites = ['fatihah', 'surah'].includes(s.k);
      voice.textContent = recites ? (s.r <= p.jahr ? 'Recite aloud' : 'Recite silently') : '';
      voice.title = recites && s.r <= p.jahr ? 'Aloud for the imam and a man praying alone' : '';
      voice.hidden = !recites;
      const tg = TAGS[st.tag];
      const parts = [
        h('div', { class: 'step-title' }, h('span', { class: 'tag ' + tg[0] }, tg[1]), h('h2', null, st.name), h('span', { class: 'ar-name', lang: 'ar' }, st.ar)),
      ];
      if (st.niat) {
        const n = D.niat(p);
        parts.push(h('div', { class: 'say' }, h('div', { class: 'dua' }, h('div', { class: 'dua-head' }, h('h3', null, 'Niat (in the heart)')), h('p', { class: 'ar', lang: 'ar' }, n.ar), h('p', { class: 'tr' }, n.tr), h('p', { class: 'en' }, n.en),
          h('p', { class: 'note' }, 'The niat itself is in the heart. Saying these words before the takbir is sunnah to focus the heart. Following an imam, add “ma’mūman” (مَأْمُومًا); leading, add “imāman” (إِمَامًا).'))));
      }
      (st.say || []).forEach((id) => parts.push(sayBlock(duaById(id))));
      if (st.surah) {
        const sr = surahById(st.surah);
        const box = h('div', null, surahBlock(sr));
        parts.push(h('div', { class: 'say' }, h('div', { class: 'dua-head' }, h('h3', null, sr.name), listenButton(sr, box)), box));
      }
      if (st.surahPick) {
        const choice = pray.surah[s.r] || 'ikhlas';
        const sr = surahById(choice);
        const box = h('div', null, surahBlock(sr));
        parts.push(h('div', { class: 'say' },
          h('label', { class: 'surah-pick' }, h('span', { class: 'eyebrow' }, 'Choose a surah'),
            h('select', { id: 'surah-pick-' + s.r, onchange: (e) => { pray.surah[s.r] = e.target.value; go(pray.idx, true); } },
              D.surahs.filter((x) => !x.rukun).sort((a, b) => a.n - b.n).map((x) => { const o = h('option', { value: x.id }, x.n + ' · ' + x.name + ' (' + x.ayat.length + ' verses)'); o.selected = x.id === choice; return o; }))),
          pairHint(p, s.r),
          h('div', { class: 'dua-head' }, h('h3', null, sr.name + ' · ' + sr.meaning), listenButton(sr, box)), box));
      }
      (st.after || []).forEach((id) => parts.push(sayBlock(duaById(id))));
      parts.push(h('div', null, h('span', { class: 'eyebrow' }, 'How'), h('ul', { class: 'cues', style: { marginTop: '8px' } }, st.how.map((c) => h('li', null, icon('check'), h('span', null, c))))));
      if (st.mistakes) parts.push(h('div', null, h('span', { class: 'eyebrow' }, 'Avoid'), h('ul', { class: 'cues warn', style: { marginTop: '8px' } }, st.mistakes.map((c) => h('li', null, icon('alert'), h('span', null, c))))));
      stepBody.replaceChildren(...parts);
      prog.style.width = ((pray.idx + 1) / seq.length) * 100 + '%';
      label.textContent = 'Step ' + (pray.idx + 1) + ' of ' + seq.length;
      prev.disabled = pray.idx === 0;
      next.replaceChildren(pray.idx === seq.length - 1 ? 'Finish' : 'Next', icon(pray.idx === seq.length - 1 ? 'check' : 'right'));
      [...timeline.children].forEach((b, j) => { b.className = j === pray.idx ? 'cur' : j < pray.idx ? 'past' : ''; b.setAttribute('aria-selected', String(j === pray.idx)); });
      const cur = timeline.children[pray.idx];
      if (cur) timeline.scrollTo({ left: cur.offsetLeft - timeline.clientWidth / 2 + cur.clientWidth / 2, behavior: instant ? 'auto' : 'smooth' });
    }
    function complete() {
      S.guided++;
      addXP(25);
      award('guided');
      toast(p.name + ' complete. +25 XP. Now the wirid.', 'star');
      pray.idx = 0;
      openWirid(null, p.id);
    }
    const onKey = (e) => {
      if (current !== 'pray' || $('.sheet')) return;
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight') go(pray.idx + 1);
      if (e.key === 'ArrowLeft') go(pray.idx - 1);
    };
    document.onkeydown = onKey;
    go(pray.idx, true);
  }

  // ---------- WIRID ----------
  const surahName = (id) => { const x = surahById(id); return x ? x.name : id; };
  function pairHint(p, r) {
    const tips = { maghrib: 'Short surahs suit Maghrib.', isyak: 'Al-A’la or Ad-Duha suit Isyak (Muslim 465).', subuh: 'Subuh is the longest recitation of the day; on Friday the sunnah is As-Sajdah and Al-Insan.' };
    return tips[p.id] && r === 1 ? h('p', { class: 'src' }, tips[p.id]) : null;
  }
  function pairingPanel(onPick) {
    return h('section', { class: 'panel pairs' },
      h('div', { class: 'dua-head' }, h('h3', null, 'Recommended in prayer'), h('span', { class: 'src' }, 'What the Prophet ﷺ recited')),
      h('ul', { class: 'pair-list' }, D.pairings.map((pr) => h('li', null,
        h('b', null, pr.t),
        h('span', { class: 'pair-surahs' }, pr.r.length ? pr.r.map((x, k) => h('span', { class: 'pair-r' }, h('em', null, 'R' + (k + 1)), (Array.isArray(x) ? x : [x]).map((id) => h('button', { class: 'chip', type: 'button', onclick: () => onPick(id) }, surahName(id))))) : null),
        pr.note && h('span', { class: 'muted' }, pr.note),
        h('span', { class: 'src' }, pr.src)))));
  }
  function wiridLauncher() {
    return h('section', { class: 'panel wirid-launch' },
      h('div', null, h('span', { class: 'eyebrow' }, 'After every fard prayer'), h('h3', null, 'Wirid and doa, counted for you')),
      h('p', { class: 'muted' }, 'Step through the wirid with a counter, then the doa. Short: what is reported in the hadith (about 3 minutes). Long: as recited in Malaysian mosques (about 8 minutes).'),
      h('div', { class: 'actions' },
        h('button', { class: 'btn primary', type: 'button', onclick: () => openWirid('short') }, 'Short wirid'),
        h('button', { class: 'btn', type: 'button', onclick: () => openWirid('long') }, 'Long wirid')));
  }
  function openWirid(kind, pid) {
    stopAudio();
    pid = pid || skyPrayer[skyNow()];
    let items = [], i = 0, n = 0;
    const prog = h('i');
    const body = h('div', { class: 'sheet-body' });
    const foot = h('div', { class: 'sheet-foot' });
    const close = () => { stopAudio(); sheet.remove(); document.removeEventListener('keydown', onKey); };
    const sheet = h('div', { class: 'sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Wirid and doa' },
      h('div', { class: 'sheet-top' }, h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Close wirid', onclick: close }, icon('x')), h('div', { class: 'progress' }, prog)),
      body, foot);
    document.body.append(sheet);
    function onKey(e) {
      if (e.key === 'Escape') close();
      if ((e.key === ' ' || e.key === 'Enter') && items.length && document.activeElement.tagName !== 'BUTTON') { e.preventDefault(); tap(); }
    }
    document.addEventListener('keydown', onKey);
    const footRow = (...kids) => foot.replaceChildren(h('div', { class: 'row' }, kids));

    function chooser() {
      prog.style.width = '0%';
      const state = { kind: kind || 'short', pid };
      const draw = () => {
        const list = D.wirid(state.kind, state.pid);
        body.replaceChildren(h('div', { class: 'sheet-inner' },
          h('span', { class: 'eyebrow' }, 'Wirid & doa after prayer'),
          h('h2', { style: { fontSize: '1.8rem' } }, 'Seal your prayer'),
          h('div', { class: 'chips', role: 'group', 'aria-label': 'Length' }, [['short', 'Short · ~3 min'], ['long', 'Long · ~8 min']].map(([v, l]) => h('button', { class: 'chip', type: 'button', 'aria-pressed': String(state.kind === v), onclick: () => { state.kind = v; draw(); } }, l))),
          h('div', { class: 'chips', role: 'group', 'aria-label': 'After which prayer' }, D.prayers.map((x) => h('button', { class: 'chip', type: 'button', 'aria-pressed': String(state.pid === x.id), onclick: () => { state.pid = x.id; draw(); } }, x.name))),
          h('ol', { class: 'wirid-list' }, list.map((it) => { const d = it.id ? duaById(it.id) : null; return h('li', null, h('span', null, d ? d.title : surahName(it.surah)), it.count > 1 && h('span', { class: 'count' }, '×' + it.count)); })),
          h('p', { class: 'foot-note' }, state.kind === 'long' ? 'Long wirid follows common Malaysian practice. Items not from a specific hadith are marked as such.' : 'Short wirid keeps to what is reported in the hadith.')));
        footRow(h('span', { class: 'muted' }, list.length + ' steps'), h('button', { class: 'btn primary', type: 'button', onclick: () => { items = list; i = 0; n = 0; step(); } }, 'Begin', icon('right')));
      };
      draw();
    }
    function cur() { return items[i]; }
    function step() {
      const it = cur();
      const max = it.count || 1;
      prog.style.width = (i / items.length) * 100 + '%';
      let content;
      if (it.surah) {
        const sr = surahById(it.surah);
        const box = h('div', null, surahBlock(sr, { tips: false }));
        content = h('div', { class: 'panel' }, h('div', { class: 'dua-head' }, h('h3', null, sr.name), listenButton(sr, box)), it.note && h('p', { class: 'note' }, it.note), box);
      } else {
        const d = duaById(it.id);
        const b = d.audio ? h('button', { class: 'btn small', type: 'button' }, icon('sound'), 'Listen') : null;
        if (b) b.addEventListener('click', () => playAyat(d.audio[0], d.audio[1], d.audio[2], null, b));
        content = h('div', { class: 'panel' }, b && h('div', { class: 'actions' }, b), duaBlock(Object.assign({}, d, { count: it.count || d.count })));
      }
      body.scrollTop = 0;
      body.replaceChildren(h('div', { class: 'sheet-inner' }, h('span', { class: 'eyebrow' }, 'Step ' + (i + 1) + ' of ' + items.length), content));
      if (max > 1) {
        const C = 2 * Math.PI * 22;
        const btn = h('button', { class: 'counter', type: 'button', 'aria-label': 'Count, ' + n + ' of ' + max, onclick: tap });
        btn.innerHTML = '<svg viewBox="0 0 52 52" aria-hidden="true"><circle class="track" cx="26" cy="26" r="22"/><circle class="val" cx="26" cy="26" r="22" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - n / max)).toFixed(1) + '"/></svg>';
        append(btn, [h('span', { class: 'counter-n' }, n), h('span', { class: 'counter-of' }, '/' + max)]);
        footRow(h('button', { class: 'btn ghost small', type: 'button', onclick: back, disabled: i === 0 }, icon('left'), 'Back'), h('span', { class: 'muted counter-hint' }, 'Tap to count'), btn);
        btn.focus({ preventScroll: true });
      } else {
        footRow(h('button', { class: 'btn ghost small', type: 'button', onclick: back, disabled: i === 0 }, icon('left'), 'Back'), h('button', { class: 'btn primary', type: 'button', onclick: next }, i === items.length - 1 ? 'Ameen, finish' : 'Done', icon(i === items.length - 1 ? 'check' : 'right')));
      }
    }
    function tap() {
      const it = cur();
      if (!it) return;
      const max = it.count || 1;
      if (max <= 1) { next(); return; }
      n++;
      try { if (navigator.vibrate) navigator.vibrate(n >= max ? [30, 40, 30] : 8); } catch (e) { /* no haptics */ }
      if (n >= max) next(); else step();
    }
    function back() { if (i > 0) { stopAudio(); i--; n = 0; step(); } }
    function next() {
      stopAudio();
      n = 0;
      if (i < items.length - 1) { i++; step(); return; }
      prog.style.width = '100%';
      addXP(15);
      award('wirid');
      body.replaceChildren(h('div', { class: 'sheet-inner' }, h('div', { class: 'result' },
        h('h2', null, 'Taqabbalallāhu minnā wa minkum.'),
        h('p', { class: 'muted' }, 'May Allah accept from us and from you.'),
        h('div', { class: 'xp-big' }, '+15 XP'))));
      footRow(h('span'), h('button', { class: 'btn primary', type: 'button', onclick: close }, 'Close'));
    }
    if (kind) { items = D.wirid(kind, pid); chooser(); } else chooser();
  }

  // ---------- LIBRARY ----------
  const lib = { doa: { q: '', cat: 'All' }, surah: { q: '' }, cloze: {} };
  const LIB = {
    doa: { eyebrow: 'Doa and wirid', title: 'Doa, wirid and dhikr', search: 'Search: sujud, forgiveness, qunut, kursi…', cats: ['All', 'In prayer', 'Wirid', 'Doa after prayer', 'Wudhu', 'Special'] },
    surah: { eyebrow: 'Surah collection', title: 'Al-Fatihah and the short surahs', search: 'Search: ikhlas, falaq, mercy…', cats: null },
  };
  function viewLibrary(col, kind) {
    const cfg = LIB[kind];
    const st = lib[kind];
    const items = kind === 'surah'
      ? D.surahs.slice().sort((a, b) => a.n - b.n).map((s) => ({ id: 's-' + s.id, kind: 'surah', title: s.name, sub: 'Surah ' + s.n + ' · ' + s.meaning + ' · ' + s.ayat.length + ' verses' + (s.rukun ? ' · a pillar of every rakaat' : ''), ar: s.ayat[0].ar, data: s, hay: (s.name + ' ' + s.meaning + ' ' + s.n + ' ' + s.ayat.map((a) => a.tr + ' ' + a.en).join(' ')).toLowerCase() }))
      : D.duas.map((d) => ({ id: 'd-' + d.id, kind: 'dua', cat: d.cat, title: d.title, sub: d.cat + (d.count ? ' · ×' + d.count : '') + (d.parts ? ' · ' + d.parts.length + ' parts' : ''), ar: d.ar || d.parts[0].ar, data: d, hay: (d.title + ' ' + d.cat + ' ' + (d.parts ? d.parts.map((x) => x.label + ' ' + x.tr + ' ' + x.en).join(' ') : d.tr + ' ' + d.en)).toLowerCase() }));
    const listEl = h('div', { class: 'lib' });
    const search = h('input', { id: 'lib-search-' + kind, type: 'search', placeholder: cfg.search, value: st.q, 'aria-label': 'Search the ' + kind + ' collection', oninput: (e) => { st.q = e.target.value; draw(); } });
    const chips = cfg.cats && h('div', { class: 'chips', role: 'group', 'aria-label': 'Filter' });
    const drawChips = () => chips && chips.replaceChildren(...cfg.cats.map((c) => h('button', { class: 'chip', type: 'button', 'aria-pressed': String(st.cat === c), onclick: () => { st.cat = c; drawChips(); draw(); } }, c)));
    const tog = (key, text) => h('label', { class: 'toggle' }, h('input', { type: 'checkbox', id: 'pref-' + key, checked: S.prefs[key], onchange: (e) => { S.prefs[key] = e.target.checked; save(); mainEl.classList.toggle('hide-' + key, !e.target.checked); } }), text);
    drawChips();
    const mastered = items.filter((it) => (S.mastery[it.id] || 0) >= 3).length;
    col.append(
      h('div', { class: 'sec-head' }, h('div', null, h('span', { class: 'eyebrow' }, cfg.eyebrow + ' · ' + items.length + ' · ' + mastered + ' memorised'), h('h2', null, cfg.title)),
        h('div', { class: 'chips' }, tog('tr', 'Transliteration'), tog('en', 'Meaning'))),
      h('div', { class: 'search' }, icon('search'), search),
      ...[chips].filter(Boolean),
      h('p', { class: 'foot-note' }, kind === 'surah'
        ? 'Recite Al-Fatihah in every rakaat, then any surah in the 1st and 2nd. Listen verse by verse; memorise: each tap hides more words. Three stars means you have it by heart.'
        : 'Memorise: each tap hides more words; tap a blank to check yourself. Rate yourself with the stars; three stars means you have it by heart.'),
      kind === 'doa' ? wiridLauncher() : pairingPanel((id) => {
        const det = listEl.querySelector('[data-id="s-' + id + '"]');
        if (det) { det.open = true; det.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      }),
      listEl);

    function stars(id) {
      const v = S.mastery[id] || 0;
      return h('span', { class: 'stars', role: 'group', 'aria-label': 'Mastery ' + v + ' of 3' }, [1, 2, 3].map((n) => h('button', { type: 'button', style: { border: 0, background: 'none', padding: '2px' }, 'aria-label': 'Set mastery ' + n, onclick: (e) => {
        e.preventDefault();
        S.mastery[id] = v === n ? n - 1 : n;
        if (Object.values(S.mastery).filter((x) => x >= 3).length >= 3) award('hafiz');
        if (S.mastery[id] > v) addXP(3); else save();
        e.currentTarget.parentNode.replaceWith(stars(id));
      } }, icon('star', n <= v ? '' : 'off'))));
    }
    function itemBody(it, wrap) {
      const lvl = lib.cloze[it.id] || 0;
      const content = it.kind === 'surah' ? surahBlock(it.data, { cloze: lvl }) : duaBlock(it.data, { head: false, cloze: lvl });
      const acts = h('div', { class: 'actions' });
      if (it.kind === 'surah') acts.append(listenButton(it.data, content));
      else if (it.data.audio) {
        const b = h('button', { class: 'btn small', type: 'button' }, icon('sound'), 'Listen');
        b.addEventListener('click', () => playAyat(it.data.audio[0], it.data.audio[1], it.data.audio[2], null, b));
        acts.append(b);
      }
      acts.append(h('button', { class: 'btn small', type: 'button', onclick: () => { lib.cloze[it.id] = (lvl + 1) % 4; stopAudio(); wrap.replaceChildren(itemBody(it, wrap)); } }, icon('eye'), ['Memorise', 'Hide more', 'Hide all', 'Show all'][lvl]));
      return h('div', { class: 'lib-body' }, acts, content);
    }
    function draw() {
      const q = st.q.trim().toLowerCase();
      const shown = items.filter((it) => (!cfg.cats || st.cat === 'All' || it.cat === st.cat) && (!q || it.hay.includes(q)));
      listEl.replaceChildren(...(shown.length ? shown.map((it) => {
        const wrap = h('div');
        const det = h('details', { class: 'lib-item', 'data-id': it.id },
          h('summary', null, h('span', { class: 'lib-title' }, h('b', null, it.title), h('small', null, it.sub), stars(it.id)), h('span', { class: 'ar', lang: 'ar' }, it.ar.split(' ').slice(0, 4).join(' '))),
          wrap);
        det.addEventListener('toggle', () => { if (det.open && !wrap.firstChild) wrap.append(itemBody(it, wrap)); if (!det.open) stopAudio(); });
        return det;
      }) : [h('p', { class: 'muted' }, 'Nothing matches “' + st.q + '”. Try a shorter word.')]));
    }
    draw();
  }

  // ---------- HANDBOOK ----------
  function viewHandbook(col) {
    const secs = [
      ['glance', 'At a glance'], ['times', 'Times & rakaat'], ['syarat', 'Conditions'], ['rukun', '13 pillars'], ['sunnah', 'Sunnah'],
      ['wudhu', 'Wudhu'], ['batal', 'What breaks solat'], ['sahwi', 'Sujud sahwi'], ['mistakes', 'Mistakes'], ['khushu', 'Khushu’'], ['wirid', 'Wirid & doa'], ['women', 'Women'], ['key', 'Reading guide'], ['about', 'Sources'],
    ];
    const strip = h('div', { class: 'strip' }, D.timeline.map((t) => { const f = h('figure', null); SolatFigure.create(f, { pose: t.pose, label: t.t }); f.append(h('figcaption', null, t.t)); return f; }));
    const sec = (id, title, ...kids) => h('section', { id: 'hb-' + id }, h('h2', null, title), kids);
    col.append(
      h('div', { class: 'sec-head' }, h('div', null, h('span', { class: 'eyebrow' }, 'Handbook'), h('h2', null, 'Everything in one place'))),
      h('nav', { class: 'toc', 'aria-label': 'Handbook sections' }, secs.map(([id, t]) => h('a', { href: '#hb-' + id, onclick: (e) => { e.preventDefault(); document.getElementById('hb-' + id).scrollIntoView({ behavior: 'smooth' }); } }, t))),
      h('div', { class: 'hb' },
        sec('glance', 'One rakaat at a glance', strip, h('p', { class: 'muted' }, 'Standing, bowing, rising, two prostrations with a sitting between. Every rakaat repeats this shape; the Tashahhud closes the 2nd and the last.')),
        sec('times', 'Times and rakaat', prayerTable(), h('p', { class: 'foot-note' }, 'Exact times depend on your location. In Malaysia use JAKIM’s official e-Solat times; elsewhere, your local authority.')),
        sec('syarat', 'Conditions', h('div', { class: 'grid2' },
          h('div', { class: 'panel' }, h('h3', null, 'Who must pray'), h('ul', { class: 'list' }, D.syarat.wajib.map((x) => h('li', null, x)))),
          h('div', { class: 'panel' }, h('h3', null, 'What makes it valid'), h('ul', { class: 'list' }, D.syarat.sah.map((x) => h('li', null, x)))))),
        sec('rukun', 'The 13 pillars', rukunList(), h('p', { class: 'foot-note' }, 'Some books count stillness (tama’ninah) in each of ruku’, i’tidal, sujud and the sitting between as separate pillars, giving 17. The content is the same.')),
        sec('sunnah', 'Sunnah of the prayer', h('div', { class: 'grid2' },
          h('div', { class: 'panel' }, h('h3', null, 'Sunnah ab’adh'), h('p', { class: 'muted' }, 'Leave one, by mistake or on purpose, and make sujud sahwi.'), h('ul', { class: 'list' }, D.sunnahAbadh.map((x) => h('li', null, x)))),
          h('div', { class: 'panel' }, h('h3', null, 'Sunnah hai’ah'), h('p', { class: 'muted' }, 'Reward for doing them; nothing needed if left.'), h('ul', { class: 'list' }, D.sunnahHaiah.map((x) => h('li', null, x)))))),
        sec('wudhu', 'Wudhu', h('div', { class: 'grid2' },
          renderCard({ type: 'steps', title: 'Step by step', items: D.wudhu.steps }),
          h('div', { style: { display: 'grid', gap: '14px', alignContent: 'start' } },
            renderCard({ type: 'items', title: 'Breaks wudhu', items: D.wudhu.nullifiers }),
            h('div', { class: 'panel' }, duaBlock(duaById('wudhu-niat'))),
            h('div', { class: 'panel' }, duaBlock(duaById('wudhu-after')))))),
        sec('batal', 'What breaks the prayer', h('div', { class: 'panel' }, h('ul', { class: 'items' }, D.invalidators.map((x) => h('li', null, h('b', null, x.t), x.d && h('span', null, x.d)))))),
        sec('sahwi', 'Sujud sahwi', h('div', { class: 'grid2' },
          renderCard({ type: 'items', title: 'When', items: D.sahwi.when }),
          h('div', { class: 'panel' }, h('h3', null, 'How'), h('ol', { class: 'list' }, D.sahwi.how.map((x) => h('li', null, x))), h('p', { class: 'note' }, D.sahwi.rukunNote), duaBlock(duaById('sahwi'), { note: true })))),
        sec('mistakes', 'The 12 common mistakes', h('div', { style: { display: 'grid', gap: '10px' } }, mistakeList())),
        sec('khushu', 'Khushu’: presence of heart', h('div', { class: 'grid2' }, D.khushu.map((k, n) => h('div', { class: 'panel' }, h('span', { class: 'eyebrow' }, 'Habit ' + (n + 1)), h('h3', null, k.t), h('p', { class: 'muted' }, k.d))))),
        sec('wirid', 'Wirid and doa after prayer', h('div', { class: 'grid2' },
          h('div', { class: 'panel' }, h('h3', null, 'Short wirid'), h('p', { class: 'muted' }, 'What is reported in the hadith, about 3 minutes.'), h('ol', { class: 'list' }, D.wirid('short', 'zohor').map((it) => h('li', null, it.id ? duaById(it.id).title : surahName(it.surah), it.count > 1 ? ' ×' + it.count : '')))),
          h('div', { class: 'panel' }, h('h3', null, 'Long wirid'), h('p', { class: 'muted' }, 'As recited in Malaysian mosques, about 8 minutes. Shown for Subuh and Maghrib; after other prayers, tahlil ×3 and no “ajirnā”.'), h('ol', { class: 'list' }, D.wirid('long', 'subuh').map((it) => h('li', null, it.id ? duaById(it.id).title : surahName(it.surah), it.count > 1 ? ' ×' + it.count : ''))))),
          wiridLauncher()),
        sec('women', 'Notes for women', h('div', { class: 'panel' }, h('ul', { class: 'list' }, D.women.map((x) => h('li', null, x))))),
        sec('key', 'How to read the transliteration', h('div', { class: 'key' },
          [['ح', 'ḥ', 'deep throat h'], ['ه', 'h', 'light h'], ['ع', 'ʿ', 'throat stop'], ['ء', '\'', 'glottal stop'], ['ص', 'ṣ', 'heavy s'], ['ض', 'ḍ', 'heavy d'], ['ط', 'ṭ', 'heavy t'], ['ظ', 'ẓ', 'heavy dh'], ['ذ', 'dh', 'as in “this”'], ['ث', 'th', 'as in “think”'], ['خ', 'kh', 'rasping kh'], ['غ', 'gh', 'gargled g'], ['ق', 'q', 'deep k'], ['ā ī ū', '—', 'long vowels, held 2 counts']].map(([a, b, c]) => h('div', null, h('b', { lang: 'ar' }, a), h('strong', null, b), h('br'), h('span', { class: 'muted' }, c)))),
          h('p', { class: 'foot-note' }, 'Transliteration is a bridge, not a replacement. Learn the Arabic with a qualified teacher (talaqqi), and use the recitation audio to check your ear.')),
        sec('about', 'School and sources', h('div', { class: 'panel' },
          h('p', null, 'Rulings follow the Shafi’i school as taught in Malaysia, Brunei, Singapore and Indonesia (based on works such as al-Nawawi’s al-Majmu’ and Minhaj al-Talibin). Where other schools differ, practise what your teachers taught you.'),
          h('p', null, 'Hadith references use sunnah.com numbering. Arabic is in simplified (imla’i) spelling with full vowel marks; recitation follows Hafs ‘an ‘Asim. Recitation audio: Shaykh Mahmoud Khalil al-Husary, via everyayah.com.'),
          h('p', { class: 'muted' }, 'This guide supports learning; it does not replace a teacher. For personal situations (illness, travel, special cases), ask your local ustaz or ustazah.'),
          document.querySelector('link[rel="manifest"]') && h('a', { class: 'btn small', href: 'dist/solat-pro-max-guide.pdf', target: '_blank', rel: 'noopener' }, icon('handbook'), 'Printable pocket guide (PDF, A5)')))));
  }

  // ---------- TRACK ----------
  const tas = { phase: 0, n: 0 };
  const PHASES = [{ id: 'subhanallah', max: 33 }, { id: 'alhamdulillah', max: 33 }, { id: 'allahuakbar', max: 33 }, { id: 'tahlil', max: 1 }];
  function viewTrack(col) {
    const t = today();
    const log = S.log[t] || {};
    const levels = ['Prayed', 'On time', 'Jama’ah'];
    const todayEl = h('div', { class: 'today' }, D.prayers.map((p) => {
      const v = log[p.id] || 0;
      return h('div', { class: 'prow' }, h('div', null, h('b', null, p.name), ' ', h('small', null, p.rakaat + ' rakaat')),
        h('div', { class: 'seg', role: 'group', 'aria-label': p.name }, levels.map((l, k) => h('button', { type: 'button', 'aria-pressed': String(v >= k + 1), onclick: () => setLog(p.id, v === k + 1 ? k : k + 1) }, l))));
    }));
    function setLog(pid, val) {
      S.log[t] = S.log[t] || {};
      S.log[t][pid] = val;
      S.logMax[t] = S.logMax[t] || {};
      const before = S.logMax[t][pid] || 0;
      if (val > before) { S.logMax[t][pid] = val; addXP((val - before) * 5); }
      if (D.prayers.every((p) => (S.log[t][p.id] || 0) >= 1)) award('five');
      save();
      route();
    }
    // heatmap: 12 weeks ending this week
    const heat = h('div', { class: 'heat', 'aria-label': 'Prayers logged over the last 12 weeks' });
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - now.getDay()));
    for (let k = 83; k >= 0; k--) {
      const d = dkey(new Date(end.getFullYear(), end.getMonth(), end.getDate() - k));
      const n = S.log[d] ? Object.values(S.log[d]).filter((x) => x > 0).length : 0;
      heat.append(h('i', { 'data-l': d > t ? '' : String(n), class: d === t ? 'today' : '', title: d + ': ' + n + ' of 5' }));
    }
    const prayedTotal = Object.values(S.log).reduce((a, day) => a + Object.values(day).filter((x) => x > 0).length, 0);

    // tasbih
    const ph = PHASES[tas.phase];
    const d = duaById(ph.id);
    const C = 2 * Math.PI * 46;
    const tb = h('button', { class: 'tasbih-btn', type: 'button', 'aria-label': 'Count. ' + d.tr + ', ' + tas.n + ' of ' + ph.max });
    tb.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="track" cx="50" cy="50" r="46"/><circle class="val" cx="50" cy="50" r="46" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - tas.n / ph.max)).toFixed(1) + '"/></svg>';
    append(tb, [h('span', null, h('span', { class: 'num' }, tas.n), h('br'), h('span', { class: 'muted' }, 'of ' + ph.max))]);
    tb.addEventListener('click', () => {
      tas.n++;
      try { if (navigator.vibrate) navigator.vibrate(tas.n === ph.max ? [30, 40, 30] : 8); } catch (e) { /* no haptics */ }
      if (tas.n >= ph.max) {
        tas.phase++; tas.n = 0;
        if (tas.phase >= PHASES.length) { tas.phase = 0; S.tasbih++; addXP(10); award('tasbih'); toast('100 remembrances complete. +10 XP', 'star'); }
      }
      const y = window.scrollY;
      route();
      window.scrollTo(0, y);
      const nb = $('.tasbih-btn');
      if (nb) nb.focus({ preventScroll: true });
    });
    const lv = level();
    const themeSeg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Theme' }, [['auto', 'Auto'], ['light', 'Light'], ['dark', 'Dark']].map(([v, l]) => h('button', { type: 'button', 'aria-pressed': String(S.prefs.theme === v), onclick: () => { S.prefs.theme = v; save(); applyTheme(); route(); } }, l)));
    const resetBox = h('div', { class: 'confirm' });
    const drawReset = (asking) => resetBox.replaceChildren(...(asking
      ? [h('span', null, 'Erase all progress on this device?'), h('button', { class: 'btn small', type: 'button', style: { borderColor: 'var(--bad)', color: 'var(--bad)' }, onclick: () => { S = defaults(); save(); applyTheme(); route(); toast('Progress erased'); } }, 'Erase'), h('button', { class: 'btn small ghost', type: 'button', onclick: () => drawReset(false) }, 'Cancel')]
      : [h('button', { class: 'btn small ghost', type: 'button', onclick: () => drawReset(true) }, 'Reset progress')]));
    drawReset(false);

    col.append(
      h('div', { class: 'sec-head' }, h('div', null, h('span', { class: 'eyebrow' }, 'Track'), h('h2', null, 'Today’s prayers'))),
      todayEl,
      h('p', { class: 'foot-note' }, '+5 XP for each level you log. Honest logging only. This is between you and Allah; the app never shares it.'),
      h('section', { class: 'panel' }, h('div', { class: 'sec-head' }, h('h3', null, 'Last 12 weeks'), h('span', { class: 'muted', style: { fontSize: '.84rem' } }, 'Darker = more prayers logged')), heat),
      h('div', { class: 'stats' },
        h('div', { class: 'stat' }, h('b', null, streak()), h('span', null, 'Day streak')),
        h('div', { class: 'stat' }, h('b', null, bestStreak()), h('span', null, 'Best streak')),
        h('div', { class: 'stat' }, h('b', null, prayedTotal), h('span', null, 'Prayers logged')),
        h('div', { class: 'stat' }, h('b', null, lv.cur.t), h('span', null, lv.next ? (lv.next.xp - S.xp) + ' XP to ' + lv.next.t : 'Highest level'))),
      h('section', { class: 'panel tasbih', id: 'tasbih' },
        h('span', { class: 'eyebrow' }, 'Dhikr after prayer'),
        h('div', { class: 'tasbih-phases', 'aria-hidden': 'true' }, PHASES.map((x, k) => h('i', { class: k <= tas.phase ? 'on' : '' }))),
        h('p', { class: 'ar', lang: 'ar', style: { textAlign: 'center', fontSize: ph.id === 'tahlil' ? '1.4rem' : '2.2rem', lineHeight: '1.8' } }, d.ar),
        h('p', { class: 'tr' }, d.tr), h('p', { class: 'en', style: { maxWidth: '44ch' } }, d.en),
        tb,
        h('div', { class: 'actions' }, h('button', { class: 'btn small primary', type: 'button', onclick: () => openWirid(null) }, 'Full wirid & doa', icon('right')), h('button', { class: 'btn small ghost', type: 'button', onclick: () => { tas.phase = 0; tas.n = 0; route(); } }, 'Restart'), h('span', { class: 'src', style: { alignSelf: 'center' } }, 'Muslim 597 · completed ' + S.tasbih + '×'))),
      h('section', { style: { display: 'grid', gap: '12px' } }, h('h3', null, 'Badges · ' + S.badges.length + ' of ' + D.badges.length),
        h('div', { class: 'badges' }, D.badges.map((b) => { const got = S.badges.includes(b.id); return h('div', { class: 'badge' + (got ? '' : ' locked') }, medal(got), h('b', null, b.t), h('small', null, b.d)); }))),
      h('section', { class: 'panel' }, h('h3', null, 'Settings'),
        h('div', { class: 'confirm' }, h('span', { class: 'muted' }, 'Theme'), themeSeg),
        resetBox,
        h('p', { class: 'foot-note' }, 'Progress is stored only in this browser. Nothing is sent anywhere.')));
  }

  // ---------- boot ----------
  applyTheme();
  shell();
  window.addEventListener('hashchange', route);
  route();
  setInterval(applyTheme, 5 * 60 * 1000);
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
  }
})();
