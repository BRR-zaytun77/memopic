// IndexNow — Bing, Yandex, Seznam va boshqalarga sitemap'dagi sahifalar
// yangilanganini bildiradi. Push + GitHub Pages deploy'dan keyin qo'lda: `npm run indexnow`.
// Kalit fayli sayt ichida: <SITE_URL><kalit>.txt (ochiq bo'lishi shart — protokol talabi).
// Kalit /memopic/ ichida bo'lgani uchun faqat shu yo'l ostidagi URL'lar yuborilishi mumkin.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { INDEXNOW_KEY, SITE_URL } from '../src/site.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const host = new URL(SITE_URL).host;
const urls = [...readFileSync(join(ROOT, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation: `${SITE_URL}${INDEXNOW_KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${res.status} (${urls.length} URL)`);
if (res.status >= 400 && res.status !== 429) process.exit(1);
