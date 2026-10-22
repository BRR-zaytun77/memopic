// =============================================================================
//  Sayt tekshiruvi — `npm run check`
// =============================================================================
//  * ichki havolalar, rasmlar, langarlar (#id) mavjud;
//  * hreflang o'zaro (reciprocal) va x-default bor; canonical har sahifada;
//  * JSON-LD to'g'ri JSON; aggregateRating/Review YO'Q;
//  * title ≤ 60, description ≤ 160 belgi; bitta <h1>; lang/dir; img alt;
//  * TODO/placeholder matn, HTML izoh (<!-- -->) yo'q;
//  * boshqa hostdan BIRORTA resurs yuklanmaydi (CSS/JS/shrift/rasm) — havolalar mumkin;
//  * marketingda taqiqlangan so'zlar (raqobatchilar, «flashcard», «#1»…) yo'q;
//  * sitemap ↔ sahifalar mos;
//  * LEGAL (src/site.mjs) maydonlari to'ldirilgan — aks holda XATO.
// =============================================================================

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BASE, EU_REPRESENTATIVE, LANGS, LEGAL, ORIGIN, SITE_URL } from '../src/site.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['node_modules', '.git', 'src', 'scripts', '.github']);
const errors = [];
const warnings = [];
const err = (f, m) => errors.push(`${f}: ${m}`);

function files(dir, ext) {
  return readdirSync(dir).flatMap((f) => {
    if (SKIP.has(f)) return [];
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return files(p, ext);
    // Qidiruv tizimlarining tasdiqlash fayllari (google*.html, yandex_*.html) — sahifa emas.
    if (/^(google[0-9a-f]+|yandex_[0-9a-f]+)\.html$/.test(f)) return [];
    return ext.some((e) => f.endsWith(e)) ? [p] : [];
  });
}

/** Sayt URL'i (`/memopic/...` yoki to'liq) → diskdagi fayl, yoki null (boshqa host). */
function toFile(href, from) {
  let u;
  try {
    u = new URL(href, ORIGIN + '/' + from);
  } catch {
    return { bad: true };
  }
  if (u.origin !== ORIGIN) return null;
  if (!u.pathname.startsWith(BASE)) return { bad: true, path: u.pathname };
  let p = decodeURIComponent(u.pathname.slice(BASE.length));
  if (p === '' || p.endsWith('/')) p += 'index.html';
  return { file: join(ROOT, p), hash: u.hash.slice(1) };
}

const html = new Map();
for (const f of files(ROOT, ['.html'])) html.set(relative(ROOT, f), readFileSync(f, 'utf8'));
const urlOf = (rel) => SITE_URL + rel.replace(/(^|\/)index\.html$/, '$1');
const idsOf = (s) => new Set([...s.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

// Ko'rinadigan matn (teglar, atributlar, script/style'siz) — so'z tekshiruvi uchun.
const visibleText = (s) =>
  s.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ');

const BANNED = [
  [/flash\s*-?cards?/i, '«flashcard» (eski pozitsiya) — marketingda ishlatmang'],
  [/\b(duolingo|babbel|busuu|memrise|chatgpt|deepl|lingoda|anki)\b/i, 'raqobatchi brend nomi'],
  [/\b(telc|goethe)\b/i, '«telc»/«Goethe» nomi'],
  [/#\s?1\b|\bnumber one\b|\bguaranteed\b|\b\d+x faster\b|\bthe best\b|\bbest app\b/i, 'tekshirib bo‘lmaydigan superlativ'],
  [/лучш(ий|ее|ая)|найкращ|en iyi|eng yaxshi|الأفضل/i, 'superlativ (lokal tilda)'],
  [/\b(TODO|FIXME|TBD|lorem ipsum|placeholder)\b|\{\{|\}\}/i, 'TODO / placeholder matn'],
];

const OK_LINK_REL = new Set(['canonical', 'alternate']);
const indexable = [];

for (const [rel, s] of html) {
  const isRedirect = /http-equiv="refresh"/.test(s);
  const is404 = rel === '404.html';
  const noindex = /name="robots" content="noindex/.test(s);

  // <html lang>, dir
  const lang = s.match(/<html lang="([^"]+)"/)?.[1];
  if (!lang) err(rel, '<html lang> yo\'q');
  if (lang === 'ar' && !/<html lang="ar" dir="rtl"/.test(s)) err(rel, 'ar sahifada dir="rtl" yo\'q');

  // title / description
  const title = s.match(/<title>([^<]*)<\/title>/)?.[1];
  const desc = s.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const unesc = (x) => x.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>');
  if (!title) err(rel, '<title> yo\'q');
  else if ([...unesc(title)].length > 60) err(rel, `title ${[...unesc(title)].length} belgi (≤60): «${unesc(title)}»`);
  if (!desc) err(rel, 'meta description yo\'q');
  else if ([...unesc(desc)].length > 160) err(rel, `description ${[...unesc(desc)].length} belgi (≤160)`);

  // canonical
  const canon = s.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  if (!canon && !is404) err(rel, 'canonical yo\'q');
  if (canon && !isRedirect && canon !== urlOf(rel)) err(rel, `canonical ${canon} ≠ ${urlOf(rel)}`);
  if (!is404 && !isRedirect && !noindex) indexable.push(urlOf(rel));

  // h1
  const h1 = (s.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) err(rel, `<h1> soni ${h1} (1 bo'lishi kerak)`);

  // HTML izohlar
  if (s.includes('<!--')) err(rel, 'HTML izoh (<!-- -->) bor');

  // JSON-LD
  for (const [, j] of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const o = JSON.parse(j);
      if (/aggregateRating|"Review"|reviewRating/i.test(j)) err(rel, 'JSON-LD da reyting/sharh bor — taqiqlangan');
      if (!o['@context'] || !o['@type']) err(rel, 'JSON-LD da @context/@type yo\'q');
    } catch (e) {
      err(rel, `JSON-LD parse xatosi: ${e.message}`);
    }
  }

  // Taqiqlangan so'zlar (ko'rinadigan matn + title/description/alt/aria-label)
  const attrs = [...s.matchAll(/\s(?:alt|aria-label|content|title)="([^"]*)"/g)].map((m) => m[1]).filter((v) => !/^https?:/.test(v)).join(' ');
  const text = visibleText(s) + ' ' + attrs;
  for (const [re, msg] of BANNED) {
    const m = text.match(re);
    if (m) err(rel, `${msg}: «${m[0]}»`);
  }

  // img alt
  for (const [tag] of s.matchAll(/<img\b[^>]*>/g)) if (!/\salt="/.test(tag)) err(rel, `alt yo'q: ${tag}`);

  // Tashqi resurslar (yuklanadigan) — taqiqlangan.
  const resources = [
    ...[...s.matchAll(/<(?:img|script|iframe|source|audio|video|embed|track)\b[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]),
    ...[...s.matchAll(/\ssrcset="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((x) => x.trim().split(/\s+/)[0])),
    ...[...s.matchAll(/<link\b([^>]*)>/g)]
      .filter((m) => !OK_LINK_REL.has(m[1].match(/rel="([^"]+)"/)?.[1]))
      .map((m) => m[1].match(/href="([^"]+)"/)?.[1])
      .filter(Boolean),
    ...[...s.matchAll(/<meta property="og:image" content="([^"]+)"/g)].map((m) => m[1]),
    ...[...s.matchAll(/url\(\s*['"]?([^'")]+)/g)].map((m) => m[1]).filter((x) => !x.startsWith('#')),
  ];
  for (const r of resources) {
    if (r.startsWith('data:')) continue;
    const t = toFile(r, rel);
    if (t === null) err(rel, `boshqa hostdan resurs: ${r}`);
    else if (t.bad) err(rel, `noto'g'ri resurs yo'li: ${r}`);
    else if (!existsSync(t.file)) err(rel, `resurs fayli yo'q: ${r}`);
  }
  if (/<style[\s>]/.test(s) || /\sstyle="/.test(s)) err(rel, 'inline style — CSP style-src \'self\' bilan ishlamaydi');
  if (/@import|fonts\.googleapis|fonts\.gstatic|cdn\.tailwindcss|googletagmanager|google-analytics/.test(s)) err(rel, 'tashqi shrift/CDN/analitika izi');

  // Havolalar va langarlar
  const ids = idsOf(s);
  for (const [, href] of s.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    if (/^(mailto:|tel:)/.test(href)) continue;
    if (href.startsWith('#')) {
      if (!ids.has(href.slice(1))) err(rel, `#${href.slice(1)} langari yo'q`);
      continue;
    }
    if (/^http:\/\//.test(href)) err(rel, `http:// havola (https bo'lsin): ${href}`);
    const t = toFile(href, rel);
    if (t === null) continue; // tashqi havola — mumkin
    if (t.bad) {
      err(rel, `ichki havola BASE (${BASE}) dan tashqarida: ${href}`);
      continue;
    }
    if (!existsSync(t.file)) {
      err(rel, `havola sahifasi yo'q: ${href}`);
      continue;
    }
    if (t.hash && t.file.endsWith('.html') && !idsOf(readFileSync(t.file, 'utf8')).has(t.hash)) err(rel, `${href} — langar yo'q`);
  }

  // hreflang: o'zaro bo'lishi va x-default
  if (!is404 && !isRedirect) {
    const alts = [...s.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)].map((m) => ({ hl: m[1], href: m[2] }));
    if (!alts.some((a) => a.hl === 'x-default')) err(rel, 'hreflang x-default yo\'q');
    if (!alts.some((a) => a.href === canon && a.hl !== 'x-default')) err(rel, 'hreflang o\'z-o\'ziga havola yo\'q');
    for (const a of alts) {
      const t = toFile(a.href, rel);
      if (!t || t.bad || !existsSync(t.file)) {
        err(rel, `hreflang ${a.hl} → mavjud emas: ${a.href}`);
        continue;
      }
      if (a.hl === 'x-default') continue;
      const other = readFileSync(t.file, 'utf8');
      const back = [...other.matchAll(/<link rel="alternate" hreflang="[^"]+" href="([^"]+)">/g)].map((m) => m[1]);
      if (!back.includes(canon)) err(rel, `hreflang o'zaro emas: ${a.href} → ${canon} ga qaytmaydi`);
      const otherLang = other.match(/<html lang="([^"]+)"/)?.[1];
      if (otherLang !== a.hl) err(rel, `hreflang="${a.hl}" lekin ${a.href} lang="${otherLang}"`);
    }
  }
}

// Barcha tillar bosh sahifasi bor
for (const l of LANGS) if (!html.has(`${l.path ? l.path + '/' : ''}index.html`)) err('LANGS', `${l.code} bosh sahifasi yo'q`);

// CSS / JS: tashqi resurs yo'q
for (const f of files(join(ROOT, 'assets'), ['.css', '.js'])) {
  const s = readFileSync(f, 'utf8');
  const rel = relative(ROOT, f);
  for (const [, u] of s.matchAll(/url\(\s*['"]?([^'")]+)/g)) if (/^(https?:)?\/\//.test(u)) err(rel, `tashqi url(): ${u}`);
  if (/@import/.test(s)) err(rel, '@import bor');
  if (/\b(fetch|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage|document\.cookie)\b/.test(s)) err(rel, 'tarmoq so\'rovi yoki brauzer xotirasi ishlatilgan');
}

// Matnli fayllar: taqiqlangan so'zlar (URL'larsiz)
for (const f of ['llms.txt', 'llms-full.txt']) {
  const p = join(ROOT, f);
  if (!existsSync(p)) {
    err(f, 'yo\'q');
    continue;
  }
  const s = readFileSync(p, 'utf8').replace(/https?:\/\/\S+/g, ' ');
  for (const [re, msg] of BANNED) {
    const m = s.match(re);
    if (m) err(f, `${msg}: «${m[0]}»`);
  }
}

// Sitemap
const sm = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const u of locs) {
  const t = toFile(u, '');
  if (!t || t.bad || !existsSync(t.file)) err('sitemap.xml', `mavjud emas: ${u}`);
}
for (const u of indexable) if (!locs.includes(u)) err('sitemap.xml', `sahifa sitemap'da yo'q: ${u}`);
for (const [, u] of sm.matchAll(/hreflang="[^"]+" href="([^"]+)"/g)) if (!locs.includes(u)) err('sitemap.xml', `alternate loc emas: ${u}`);

// robots.txt AI botlarni ochadi (bot nomlari — brend tekshiruvidan tashqari)
const rb = readFileSync(join(ROOT, 'robots.txt'), 'utf8');
for (const b of ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'Bingbot']) {
  if (!new RegExp(`User-agent: ${b}\\nAllow: /`).test(rb)) err('robots.txt', `${b} ochiq emas`);
}

// LEGAL — oxirida, alohida aniq xabar bilan.
const legalMissing = Object.entries(LEGAL).filter(([, v]) => !String(v ?? '').trim()).map(([k]) => k);
if (!EU_REPRESENTATIVE.trim()) {
  warnings.push('EU_REPRESENTATIVE (src/site.mjs) bo\'sh — GDPR 27-modda: EI vakilini tayinlash tavsiya etiladi (SEO.md ga qarang).');
}

for (const w of warnings) console.warn(`⚠ ${w}`);
if (errors.length) {
  console.error(`✗ ${errors.length} xato:\n  ` + errors.join('\n  '));
}
if (legalMissing.length) {
  console.error(
    `✗ LEGAL to'ldirilmagan (src/site.mjs → LEGAL): ${legalMissing.join(', ')}\n` +
      '  Impressum va maxfiylik siyosatidagi kompaniya ma\'lumotlari to\'liq bo\'lishi shart.\n' +
      '  Manzil, direktor F.I.Sh. va ro\'yxatdan o\'tish raqamini kiriting → npm run build → npm run check.',
  );
}
if (errors.length || legalMissing.length) process.exit(1);
console.log(`✓ ${html.size} HTML fayl tekshirildi — havolalar, hreflang, JSON-LD, meta, tashqi resurslar, LEGAL joyida`);
