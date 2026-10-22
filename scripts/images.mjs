// =============================================================================
//  Rasmlar — `npm run images` (logo yoki matn o'zgarganda bir marta; natija commit qilinadi)
// =============================================================================
//  src/img/logo.svg → assets/img/favicon.svg, icon-32/180/192/512.png
//  src/i18n/<til>.json → assets/img/og-<til>.png (1200×630, har til uchun)
//  Barcha rasmlar — o'zimiz chizgan SVG'dan (stok rasm yoki begona ikonka yo'q).
// =============================================================================

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { LANGS } from '../src/site.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'assets/img');
mkdirSync(OUT, { recursive: true });

const logo = readFileSync(join(ROOT, 'src/img/logo.svg'));
copyFileSync(join(ROOT, 'src/img/logo.svg'), join(OUT, 'favicon.svg'));
for (const s of [32, 180, 192, 512]) {
  await sharp(logo, { density: 72 * (s / 64) * 1.2 })
    .resize(s, s)
    .png({ compressionLevel: 9 })
    .toFile(join(OUT, `icon-${s}.png`));
}
// Maskable icon (safe zone padding) for the web manifest.
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#C2412D' } })
  .composite([{ input: await sharp(logo, { density: 600 }).resize(360, 360).png().toBuffer(), left: 76, top: 76 }])
  .png({ compressionLevel: 9 })
  .toFile(join(OUT, 'icon-maskable-512.png'));

const x = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

/** Oddiy so'z bo'yicha qatorlarga bo'lish (SVG'da avtomatik o'tkazish yo'q). */
function wrap(text, max) {
  const lines = [];
  let cur = '';
  for (const w of text.split(/\s+/)) {
    if ((cur + ' ' + w).trim().length > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

const logoInner = logo.toString().replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

for (const l of LANGS) {
  const t = JSON.parse(readFileSync(join(ROOT, `src/i18n/${l.code}.json`), 'utf8'));
  const rtl = l.dir === 'rtl';
  const font = rtl ? 'DejaVu Sans, Noto Sans Arabic, sans-serif' : 'Inter, Helvetica Neue, Arial, DejaVu Sans, sans-serif';
  const lines = wrap(t.hero.title, rtl ? 18 : 22).slice(0, 4);
  const size = lines.length > 3 ? 50 : 58;
  const tx = rtl ? 1120 : 80;
  // LTR yorliqlar (MemoPic, Android · iPhone) uchun anchor; RTL matnda `start` — o'ng chet.
  const anchor = rtl ? 'end' : 'start';
  const dir = rtl ? ' direction="rtl"' : '';
  const tAnchor = 'start';
  // Illustration side (mirrored for RTL).
  const ix = rtl ? 90 : 800;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#FFF8F0"/>
  <circle cx="${rtl ? 220 : 980}" cy="140" r="300" fill="#FFCB47" opacity=".35"/>
  <g transform="translate(${ix} 120)">
    <g transform="rotate(${rtl ? 4 : -4} 150 170)">
      <rect x="0" y="0" width="300" height="360" rx="14" fill="#FFFFFF" stroke="#ECDCCB" stroke-width="2"/>
      <text x="26" y="48" font-family="DejaVu Sans, sans-serif" font-size="15" font-weight="700" fill="#6B6F86" letter-spacing="1">JOBCENTER MUSTERSTADT</text>
      <text x="26" y="78" font-family="DejaVu Sans, sans-serif" font-size="14" fill="#555A73">Herrn Max Mustermann</text>
      <text x="26" y="124" font-family="DejaVu Serif, Georgia, serif" font-size="30" font-weight="700" fill="#1B2140">Einladung</text>
      <rect x="26" y="146" width="248" height="10" rx="5" fill="#E7E3DC"/>
      <rect x="26" y="168" width="220" height="10" rx="5" fill="#E7E3DC"/>
      <rect x="26" y="192" width="168" height="26" rx="6" fill="#FFE08A"/>
      <text x="34" y="211" font-family="DejaVu Sans, sans-serif" font-size="15" font-weight="700" fill="#1B2140">12.11. · 9:30</text>
      <rect x="26" y="234" width="248" height="10" rx="5" fill="#E7E3DC"/>
      <rect x="26" y="256" width="190" height="10" rx="5" fill="#E7E3DC"/>
      <rect x="26" y="278" width="230" height="10" rx="5" fill="#E7E3DC"/>
    </g>
    <rect x="${rtl ? 150 : -60}" y="300" width="240" height="64" rx="18" fill="#C2412D"/>
    <path transform="translate(${rtl ? 170 : -40} 318)" d="M5 14V9a7 7 0 0114 0v5l2 2.5H3zM9.5 20h5" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="${rtl ? 200 : -10}" y="342" font-family="DejaVu Sans, sans-serif" font-size="22" font-weight="700" fill="#FFFFFF">12.11. · 9:30</text>
  </g>
  <g transform="translate(${rtl ? 1056 : 80} 64)">${logoInner}</g>
  <text x="${rtl ? 1040 : 160}" y="108" font-family="${font}" font-size="40" font-weight="800" fill="#1B2140" text-anchor="${anchor}" direction="ltr">MemoPic</text>
  <text font-family="${font}" font-size="${size}" font-weight="800" fill="#1B2140" text-anchor="${tAnchor}"${dir}>
    ${lines.map((s, i) => `<tspan x="${tx}" y="${236 + i * (size + 14)}">${x(s)}</tspan>`).join('\n    ')}
  </text>
  <text x="${tx}" y="560" font-family="${font}" font-size="26" font-weight="600" fill="#4A5170" text-anchor="${tAnchor}"${dir}>${x(t.hero.kicker)}</text>
  <text x="${tx}" y="598" font-family="${font}" font-size="22" font-weight="700" fill="#C2412D" text-anchor="${anchor}" direction="ltr">Android · iPhone</text>
</svg>`;
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(join(OUT, `og-${l.code}.png`));
}
console.log(`✓ favicon, ikonkalar, ${LANGS.length} ta og-*.png`);
