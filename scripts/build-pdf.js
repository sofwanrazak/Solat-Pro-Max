#!/usr/bin/env node
/* Builds dist/solat-pro-max-guide.pdf from print.html.
 * Usage: node scripts/build-pdf.js   (needs Playwright + Chromium; fonts load from Google Fonts) */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/^\/+/, '') || 'index.html';
  const file = path.resolve(ROOT, rel);
  if (!file.startsWith(ROOT + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

server.listen(0, '127.0.0.1', async () => {
  const { port } = server.address();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    page.on('pageerror', (e) => { console.error('page error:', e.message); process.exitCode = 1; });
    await page.goto(`http://127.0.0.1:${port}/print.html`, { waitUntil: 'networkidle' });
    await page.waitForSelector('body[data-ready="1"]', { timeout: 30000 });
    const out = path.join(ROOT, 'dist', 'solat-pro-max-guide.pdf');
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
    console.log('wrote', path.relative(ROOT, out), Math.round(fs.statSync(out).size / 1024) + ' KB');
  } finally {
    await browser.close();
    server.close();
  }
});
