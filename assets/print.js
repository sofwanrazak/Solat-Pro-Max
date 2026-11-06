/* Solat Pro Max — builds the A5 pocket guide from the same content as the app. */
(function () {
  'use strict';
  const D = window.SOLAT;
  function h(tag, props, ...kids) {
    const e = document.createElement(tag);
    for (const k in props || {}) { const v = props[k]; if (v == null || v === false) continue; if (k === 'class') e.className = v; else e.setAttribute(k, v); }
    for (const c of kids.flat(Infinity)) { if (c == null || c === false) continue; e.append(c.nodeType ? c : document.createTextNode(String(c))); }
    return e;
  }
  const dua = (id) => D.duas.find((d) => d.id === id);
  const fig = (pose, ov) => { const box = h('div'); SolatFigure.create(box, { pose, overlays: ov || [] }); return box; };
  const page = (...kids) => h('section', { class: 'page' }, kids);
  const head = (eyebrow, title) => [h('span', { class: 'eyebrow' }, eyebrow), h('h2', null, title)];
  const duaBlock = (d, opts) => h('div', { class: 'block' },
    h('div', { class: 'head' }, h('h3', null, d.title), d.count && h('span', { class: 'count' }, '×' + d.count)),
    h('p', { class: 'ar' + (d.audio ? ' quran' : ''), lang: 'ar' }, d.ar), h('p', { class: 'tr' }, d.tr), h('p', { class: 'en' }, d.en),
    d.note && !(opts && opts.noNote) && h('p', { class: 'note' }, d.note), d.src && h('p', { class: 'src' }, d.src));
  const surahBlock = (s, tips) => h('div', null, s.ayat.map((a, i) => h('div', { class: 'block' },
    h('p', { class: 'ar quran', lang: 'ar' }, a.ar + ' ﴿' + (i + 1).toLocaleString('ar-EG') + '﴾'), h('p', { class: 'tr' }, a.tr), h('p', { class: 'en' }, a.en),
    tips && a.tip && h('p', { class: 'note' }, a.tip))));
  const TAGS = { rukun: 'Pillar', abadh: 'Sunnah ab’adh', sunnah: 'Sunnah', condition: 'Before you start' };

  const book = document.getElementById('book');
  const pages = [];

  // Cover
  const mark = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  mark.setAttribute('viewBox', '0 0 32 32');
  mark.setAttribute('class', 'mark');
  mark.innerHTML = '<rect x="6" y="6" width="20" height="20" rx="3" fill="#0e6e66"/><rect x="6" y="6" width="20" height="20" rx="3" fill="#0e6e66" transform="rotate(45 16 16)"/><path d="M16 9.5a6.5 6.5 0 1 0 4.6 11.1A5.2 5.2 0 1 1 16 9.5z" fill="#f4efe1"/>';
  const cf = h('div', { class: 'cover-fig' }, h('div', { class: 'strip' }, ['takbir', 'ruku', 'sujud', 'tawarruk'].map((p) => h('figure', null, fig(p)))));
  pages.push(h('section', { class: 'page cover' },
    h('div', null, mark),
    h('div', { class: 'cover-text' },
      h('p', { class: 'ar', lang: 'ar' }, 'صَلُّوا كَمَا رَأَيْتُمُونِي أُصَلِّي'),
      h('h1', null, 'Solat Pro Max'),
      h('p', { class: 'lede' }, 'The pocket guide to a complete prayer: every posture, pillar, doa and surah, with meaning, the common mistakes, and how to pray with a present heart.'),
      h('p', { class: 'eyebrow' }, 'Shafi’i school · Malaysia · Brunei · Singapore · Indonesia')),
    cf));

  // How to use + one rakaat
  pages.push(page(head('Start here', 'How to use this guide'),
    h('p', null, 'A perfect prayer has two halves. The outward half is correct pillars, postures and recitation. The inward half is khushu’, a present heart. Read one section a day. Practise the step-by-step pages on your mat. Use the tracker on the last page for 30 days.'),
    h('p', { class: 'note' }, '“Worship Allah as though you see Him; and if you do not see Him, He sees you.” (Muslim 8)'),
    h('h3', null, 'One rakaat at a glance'),
    h('div', { class: 'strip' }, D.timeline.map((t) => h('figure', null, fig(t.pose), t.t))),
    h('p', { class: 'muted' }, 'Every rakaat repeats this shape. The Tashahhud closes the 2nd rakaat (of 3 and 4 rakaat prayers) and the last.'),
    h('h3', null, 'Contents'),
    h('ol', null, ['The five prayers', 'Step by step', 'Al-Fatihah done right', 'Pillars and sunnah', 'Conditions and wudhu', 'What breaks the prayer · sujud sahwi', 'The 12 common mistakes', 'Khushu’', 'After the prayer', 'Short surahs', 'Notes, reading guide, sources', '30-day tracker'].map((x) => h('li', null, x)))));

  // Five prayers
  pages.push(page(head('Section 1', 'The five prayers'),
    h('table', null, h('thead', null, h('tr', null, ['Prayer', 'Fard', 'Time', 'Sunnah'].map((x) => h('th', null, x)))),
      h('tbody', null, D.prayers.map((p) => h('tr', null, h('td', null, h('b', null, p.name), h('br'), h('span', { class: 'muted' }, p.alt + ' · ' + (p.jahr ? (p.jahr === p.rakaat ? 'aloud' : 'first 2 aloud') : 'silent'))), h('td', null, h('b', { class: 'big' }, p.rakaat)), h('td', null, p.time), h('td', null, 'Before: ' + p.before, h('br'), 'After: ' + p.after))))),
    h('h3', null, 'Niat for each prayer'),
    D.prayers.map((p) => { const n = D.niat(p); return h('div', { class: 'block' }, h('h3', null, p.name), h('p', { class: 'ar', lang: 'ar' }, n.ar), h('p', { class: 'tr' }, n.tr)); }),
    h('p', { class: 'src' }, 'The niat is in the heart at takbiratul ihram; saying it beforehand is sunnah to focus the heart. Exact prayer times: JAKIM e-Solat in Malaysia, or your local authority.')));

  // Step by step
  const order = ['prepare', 'niat', 'qiyam', 'iftitah', 'surah', 'ruku', 'itidal', 'qunut', 'sujud1', 'julus', 'istirahah', 'tashahhud1', 'tashahhud2', 'salam'];
  const stepEl = (k) => {
    const s = D.steps[k];
    return h('div', { class: 'step' }, fig(s.pose, s.ov),
      h('div', { class: 'step-text' },
        h('div', { class: 'step-title' }, h('span', { class: 'tag ' + s.tag }, TAGS[s.tag]), h('h3', null, s.name)),
        (s.say || []).map((id) => { const d = dua(id); return h('div', null, h('p', { class: 'ar', lang: 'ar' }, d.ar), h('p', { class: 'tr' }, d.tr), h('p', { class: 'en' }, d.en)); }),
        s.surah === 'fatihah' && h('p', { class: 'muted' }, 'Al-Fatihah: see Section 3.'),
        h('ul', { class: 'cues' }, s.how.map((c) => h('li', null, c))),
        s.mistakes && h('ul', { class: 'warn' }, s.mistakes.map((c) => h('li', null, c)))));
  };
  pages.push(page(head('Section 2', 'Step by step'), h('p', { class: 'muted' }, 'In order, for any prayer. Repeat Al-Fatihah → sujud for each rakaat. Al-Fatihah comes after the doa iftitah (rakaat 1) and at the start of every rakaat.'),
    stepEl('prepare'), stepEl('niat'), stepEl('qiyam'), stepEl('iftitah'), stepEl('fatihah'), order.slice(4).map(stepEl)));

  // Fatihah
  const fat = D.surahs.find((s) => s.id === 'fatihah');
  pages.push(page(head('Section 3', 'Al-Fatihah done right'),
    h('p', { class: 'note' }, '“There is no prayer for the one who does not recite the Opening of the Book.” (al-Bukhari 756; Muslim 394). 7 verses, 14 shaddah: 3 · 2 · 2 · 1 · 2 · 1 · 3.'),
    surahBlock(fat, true), duaBlock(dua('amin'))));

  // Pillars & sunnah
  pages.push(page(head('Section 4', 'The 13 pillars'),
    h('ol', { class: 'rk' }, D.rukun.map((r) => h('li', null, h('b', { class: 'n' }, r.n), h('span', null, h('b', null, r.name), ' — ', h('span', { class: 'muted' }, r.note))))),
    h('div', { class: 'two' },
      h('div', null, h('h3', null, 'Sunnah ab’adh'), h('p', { class: 'src' }, 'Leave one: make sujud sahwi.'), h('ul', null, D.sunnahAbadh.map((x) => h('li', null, x)))),
      h('div', null, h('h3', null, 'Sunnah hai’ah'), h('p', { class: 'src' }, 'Reward; nothing needed if left.'), h('ul', null, D.sunnahHaiah.map((x) => h('li', null, x)))))));

  // Conditions & wudhu
  pages.push(page(head('Section 5', 'Conditions and wudhu'),
    h('div', { class: 'two' },
      h('div', null, h('h3', null, 'Who must pray'), h('ul', null, D.syarat.wajib.map((x) => h('li', null, x)))),
      h('div', null, h('h3', null, 'What makes it valid'), h('ul', null, D.syarat.sah.map((x) => h('li', null, x))))),
    h('h3', null, 'Wudhu, step by step'),
    h('ol', null, D.wudhu.steps.map((s) => h('li', null, h('b', null, s.t), ' ', h('span', { class: 'tag ' + (s.tag === 'rukun' ? 'rukun' : 'sunnah') }, s.tag === 'rukun' ? 'Pillar' : 'Sunnah'), h('br'), h('span', { class: 'muted' }, s.d)))),
    h('h3', null, 'Wudhu is broken by'),
    h('ul', null, D.wudhu.nullifiers.map((n) => h('li', null, h('b', null, n.t), ' — ', h('span', { class: 'muted' }, n.d)))),
    duaBlock(dua('wudhu-niat'), { noNote: true }), duaBlock(dua('wudhu-after'), { noNote: true })));

  // Invalidators & sahwi
  pages.push(page(head('Section 6', 'What breaks the prayer'),
    h('ul', null, D.invalidators.map((x) => h('li', null, h('b', null, x.t), x.d && [' — ', h('span', { class: 'muted' }, x.d)]))),
    h('h2', null, 'Sujud sahwi'),
    h('ul', null, D.sahwi.when.map((x) => h('li', null, h('b', null, x.t), ' — ', h('span', { class: 'muted' }, x.d)))),
    h('ol', null, D.sahwi.how.map((x) => h('li', null, x))),
    h('p', { class: 'note' }, D.sahwi.rukunNote), duaBlock(dua('sahwi'))));

  // Mistakes
  pages.push(page(head('Section 7', 'The 12 common mistakes'),
    D.mistakes.map((m) => h('div', { class: 'mistake ' + m.severity }, h('b', null, m.t, ' ', h('span', { class: 'src' }, '· ' + { invalid: 'can invalidate', serious: 'serious', disliked: 'disliked' }[m.severity])), h('span', { class: 'muted' }, m.fix), m.src && h('span', { class: 'src' }, ' (' + m.src + ')')))));

  // Khushu
  pages.push(page(head('Section 8', 'Khushu’: a present heart'),
    h('p', { class: 'note' }, '“Successful indeed are the believers: those who are humble in their prayers.” (Quran 23:1–2)'),
    h('ol', null, D.khushu.map((k) => h('li', null, h('b', null, k.t), h('br'), h('span', { class: 'muted' }, k.d))))));

  // After prayer
  pages.push(page(head('Section 9', 'After the prayer'),
    ['istighfar', 'antas-salam', 'kursi', 'subhanallah', 'alhamdulillah', 'allahuakbar', 'tahlil', 'ainni'].map((id) => duaBlock(dua(id), { noNote: true }))));

  // Surahs
  pages.push(page(head('Section 10', 'Short surahs for the 1st and 2nd rakaat'),
    D.surahs.filter((s) => !s.rukun).map((s) => h('div', { class: 'block' }, h('h3', null, s.name + ' (' + s.n + ') · ' + s.meaning),
      h('p', { class: 'ar quran', lang: 'ar' }, s.ayat.map((a, i) => a.ar + ' ﴿' + (i + 1).toLocaleString('ar-EG') + '﴾').join(' ')),
      h('p', { class: 'tr' }, s.ayat.map((a, i) => a.tr + ' (' + (i + 1) + ')').join(' ')),
      h('p', { class: 'en' }, s.ayat.map((a, i) => '(' + (i + 1) + ') ' + a.en).join(' '))))));

  // Notes
  pages.push(page(head('Section 11', 'Notes for women'),
    h('ul', null, D.women.map((x) => h('li', null, x))),
    h('h2', null, 'Reading the transliteration'),
    h('div', { class: 'key' }, [['ح', 'ḥ deep throat h'], ['ه', 'h light h'], ['ع', 'ʿ throat stop'], ['ء', '\' glottal stop'], ['ص', 'ṣ heavy s'], ['ض', 'ḍ heavy d'], ['ط', 'ṭ heavy t'], ['ظ', 'ẓ heavy dh'], ['ذ', 'dh as in this'], ['ث', 'th as in think'], ['خ', 'kh rasping'], ['غ', 'gh gargled']].map(([a, b]) => h('div', null, h('b', { lang: 'ar' }, a), b))),
    h('p', { class: 'muted' }, 'Long vowels ā ī ū are held for two counts. Transliteration is a bridge: learn the Arabic with a qualified teacher (talaqqi).'),
    h('h2', null, 'School and sources'),
    h('p', null, 'Rulings follow the Shafi’i school as taught in Malaysia, Brunei, Singapore and Indonesia. Hadith references use sunnah.com numbering. Arabic uses simplified (imla’i) spelling with full vowel marks; recitation follows Hafs ‘an ‘Asim.'),
    h('p', { class: 'muted' }, 'This guide supports learning; it does not replace a teacher. For personal situations, ask your local ustaz or ustazah.')));

  // Tracker
  const grid = h('table', null, h('thead', null, h('tr', null, h('th', null, 'Day'), D.prayers.map((p) => h('th', null, p.name)), h('th', null, 'Dhikr'))),
    h('tbody', null, Array.from({ length: 30 }, (_, i) => h('tr', null, h('td', null, i + 1), D.prayers.map(() => h('td', null, '○')), h('td', null, '○')))));
  pages.push(page(head('Section 12', '30-day tracker'), h('p', { class: 'muted' }, 'Fill the circle when you pray; put a dot in it if it was on time, a ring around it if in jama’ah.'), grid));

  book.append(...pages);
  document.fonts.ready.then(() => { document.body.dataset.ready = '1'; });
})();
