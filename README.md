# klarineo — https://klarineo.com/

Klarineo ilovasining statik landing sayti (GitHub Pages, `main` branch ildizi).
Framework yo'q: Node skripti `src/` dan HTML generatsiya qiladi.

## Tuzilma
- `src/site.mjs` — **SITE_URL** (custom domain — bitta qator), tillar, do'kon havolalari, **LEGAL** (Impressum), qo'llanmalar ro'yxati.
- `src/i18n/<til>.json` — bosh sahifa matnlari (en — asosiy; kalitlar shundan tekshiriladi).
- `src/guides/<slug>.json` — inglizcha qo'llanmalar; `_help.json` — bepul yordam manbalari.
- `src/legal/privacy.json`, `terms.json` — maxfiylik siyosati va foydalanish shartlari.
- `src/img/logo.svg` — logo (o'zimiz chizgan). `src/icons.mjs` — o'z SVG ikonkalarimiz.
- `assets/` — CSS, JS, generatsiya qilingan rasmlar. Ildizdagi HTML, til papkalari, `guides/`, `privacy-policy/`, `terms/`, `impressum/`, `sitemap.xml`, `robots.txt`, `llms*.txt`, `404.html`, `privacy-policy.html` — **generatsiya qilinadi**, qo'lda tahrirlamang.

## Ish tartibi
```bash
npm install
npm run images   # logo yoki bosh sahifa sarlavhasi o'zgarganda (og-*.png, ikonkalar)
npm run build    # HTML, sitemap, robots, llms.txt
npm run check    # havolalar, hreflang, JSON-LD, meta, tashqi resurslar, LEGAL
npm run indexnow # push va deploy'dan keyin (ixtiyoriy)
```
Natijani (`src/` bilan birga) commit qiling. Saytdan tashqari vazifalar — `SEO.md`.
