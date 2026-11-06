# Solat Pro Max

A complete solat guide you can install and use offline. It covers every posture, pillar, doa and surah, explains what each phrase means, lists the mistakes that invalidate a prayer, and adds habits (streaks, XP, a tracker) so people keep learning.

**School:** Shafi'i, as taught in Malaysia, Brunei, Singapore and Indonesia.

## Why an app, with a PDF beside it

| Need | PDF | Installable web app (PWA) |
|---|---|---|
| Show how a posture moves | Static pictures | Animated figure that moves between positions |
| Check pronunciation | — | Recitation audio, verse by verse, highlighted as it plays |
| Check what you learned | — | Quizzes with instant feedback |
| Keep coming back | — | Streaks, XP, levels, badges, daily goal, prayer log |
| Works offline | Yes | Yes (service worker) |
| Print, share, read away from a screen | Yes | — |

The app is the main product. The PDF is generated from **the same content files**, so the two never disagree.

## What is inside

- **Learn**: 14 lessons in 4 units, from *why solat matters* to *khushu'*. 63 questions in 4 formats: multiple choice, true/false, put in order, pillar-or-sunnah sorting.
- **Pray along**: a step-by-step guide for each of the 5 prayers (22 to 35 steps), built from the rakaat count. It covers qunut in Subuh, the first Tashahhud, and the brief rest before standing (jalsah istirahah). Every step shows the animated posture, the tag (pillar / sunnah ab'adh / sunnah), what to say, body cues, mistakes to avoid, and whether to recite aloud or silently.
- **Doa**: 28 doas and dhikr, filtered by when they're used: in prayer, after prayer, wudhu, special.
- **Surah**: Al-Fatihah and 11 short surahs in mushaf order, with verse-by-verse recitation (al-Husary) that highlights each verse as it plays.
- Both collections give every item Arabic with full vowel marks, transliteration, meaning and source, plus a memorise mode that hides more words each round and self-rated mastery stars.
- **Handbook**: times and rakaat, conditions, the 13 pillars, sunnah ab'adh and hai'ah, wudhu, what breaks wudhu and the prayer, sujud sahwi, the 12 common mistakes, 10 khushu' habits, notes for women, and a transliteration key.
- **Track**: log each prayer (prayed / on time / jama'ah), a 12-week heatmap, a tasbih counter (33·33·33·1) with haptics, and 14 badges.
- **Posture figures**: a side-view man in baju melayu and kopiah, facing the qiblah, drawn with real proportions (about 7.4 heads tall). Poses use inverse kinematics, so limbs keep their length while animating. Teaching overlays show where to look in qiyam, the flat back in ruku', the 7 contact points in sujud, the raised finger in Tashahhud, and the turn of the salam.
- **Printable guide**: [`dist/solat-pro-max-guide.pdf`](dist/solat-pro-max-guide.pdf), 41 A5 pages, ending with a 30-day paper tracker.

## Run it

It has no build step and no dependencies. Serve the folder over HTTP:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

### Publish free on GitHub Pages

Settings → Pages → *Deploy from a branch* → `main` / root. The app installs from the browser menu ("Add to Home screen").

### Rebuild the PDF after editing content

Needs Node and Playwright with Chromium:

```bash
node scripts/build-pdf.js
```

## Project layout

```
index.html            app shell (strict Content-Security-Policy)
assets/data.js        ALL content: doas, surahs, steps, rulings, lessons, quizzes
assets/figure.js      posture engine (IK skeleton → realistic SVG figure)
assets/app.js         UI: router, lessons, guided prayer, library, tracker
assets/app.css        design tokens (light/dark, accent follows the time of day)
print.html + assets/print.{js,css}   A5 pocket guide layout
scripts/build-pdf.js  renders print.html to dist/solat-pro-max-guide.pdf
sw.js, manifest.webmanifest           offline + installable
```

Edit content in `assets/data.js` only; the app and the PDF both read from it.

## Accuracy and sources

- Arabic uses simplified (imla'i) spelling with full vowel marks. Recitation follows Hafs 'an 'Asim.
- Hadith references use sunnah.com numbering. Each doa shows its source.
- Where a wording comes from scholarly practice rather than a hadith (for example the closing lines of the qunut, or the tasbih of sujud sahwi), the app says so.
- **Before wide distribution, have a qualified ustaz review `assets/data.js`.** It is a single file written to make that review easy.

## Privacy and security

- No accounts, analytics or trackers. Progress lives only in the browser's `localStorage`.
- The CSP allows scripts and styles from the app's own origin, fonts from Google Fonts, and media from everyayah.com (recitation) only. It blocks inline scripts and inline styles, and the app sets no `innerHTML` from user input.
