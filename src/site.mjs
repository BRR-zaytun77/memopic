// =============================================================================
//  Sayt sozlamalari — bitta joyda.
// =============================================================================
//  Custom domain olinganda FAQAT SITE_URL ni o'zgartiring, masalan:
//    export const SITE_URL = 'https://memopic.app/';
//  Barcha ichki havolalar, canonical, hreflang, sitemap, llms.txt shundan olinadi.
// =============================================================================

/** Saytning to'liq manzili (oxirida `/` bilan). Custom domain: klarineo.com (ildiz). */
export const SITE_URL = 'https://klarineo.com/';

const u = new URL(SITE_URL);
/** Host ildizi, masalan `https://brr-zaytun77.github.io`. */
export const ORIGIN = u.origin;
/** Yo'l prefiksi, masalan `/memopic/` (custom domain'da — `/`). */
export const BASE = u.pathname.endsWith('/') ? u.pathname : `${u.pathname}/`;

/** Kontent oxirgi ko'rib chiqilgan sana (sitemap lastmod, «Last reviewed»). */
export const UPDATED = '2026-10-25';
export const UPDATED_HUMAN = '25 October 2026';

/**
 * Bosh sahifa tillari. `path` — URL prefiksi ('' — asosiy til, ingliz; x-default).
 * Qo'llanmalar, maxfiylik, shartlar, Impressum — hozircha faqat inglizcha.
 */
export const LANGS = [
  { code: 'en', hreflang: 'en', path: '', name: 'English', og: 'en_US' },
  { code: 'ru', hreflang: 'ru', path: 'ru', name: 'Русский', og: 'ru_RU' },
  { code: 'uk', hreflang: 'uk', path: 'uk', name: 'Українська', og: 'uk_UA' },
  { code: 'tr', hreflang: 'tr', path: 'tr', name: 'Türkçe', og: 'tr_TR' },
  { code: 'ar', hreflang: 'ar', path: 'ar', name: 'العربية', og: 'ar_AR', dir: 'rtl' },
  { code: 'uz', hreflang: 'uz', path: 'uz', name: "O'zbekcha", og: 'uz_UZ' },
];

export const LINKS = {
  playStore: 'https://play.google.com/store/apps/details?id=uz.tiynzaytun.memopic.one',
  appStore: 'https://apps.apple.com/us/app/memopic-learn-with-flashcards/id6756977971',
  appStoreId: '6756977971',
  email: 'appnews.uz@gmail.com',
  telegram: 'https://t.me/inquiryuz',
  telegramHandle: '@inquiryuz',
};

/**
 * Impressum / Legal notice va maxfiylik siyosatidagi «controller» ma'lumotlari.
 * `npm run check` biror maydon bo'sh bo'lsa XATO beradi — to'ldiring.
 */
export const LEGAL = {
  company: 'TIYN ZAYTUN LLC',
  legalForm: 'Limited liability company (MChJ), Republic of Uzbekistan',
  address: "Omonariq ko'chasi 120, Omonariq MFY, Baliqchi tumani, Andijon viloyati, Uzbekistan",
  director: 'Axrorbek Madaminovich Abdullayev',
  regNo: 'TIN (STIR) 309938921',
  email: 'appnews.uz@gmail.com',
};

/**
 * Ixtiyoriy (check faqat ogohlantiradi): GDPR 27-modda — EI'da ofisi bo'lmagan
 * kompaniya EI foydalanuvchilariga xizmat ko'rsatsa, EI vakili tayinlashi kerak
 * bo'lishi mumkin. Tayinlangach: 'Firma, manzil, email'.
 */
export const EU_REPRESENTATIVE = '';

/** Qo'llanmalar tartibi (src/guides/<slug>.json). */
export const GUIDES = [
  'jobcenter-einladung',
  'rundfunkbeitrag-letter',
  'mahnung-payment-reminder',
  'steuerbescheid-finanzamt',
  'anmeldung-meldebescheinigung',
  'auslaenderbehoerde-termin',
  'krankenkasse-letter',
  'nebenkostenabrechnung',
  'kuendigung-vermieter',
  'bussgeldbescheid-anhoerung',
];

/** IndexNow kaliti (fayl: <kalit>.txt sayt ildizida, /memopic/ ichida). */
export const INDEXNOW_KEY = 'ff97d9d65c3a5979005c5233eaeffb81';
