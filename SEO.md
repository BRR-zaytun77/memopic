# SEO, AI qidiruv va ASO — saytdan tashqari vazifalar (Klarineo)

Saytning o'zida qilingan ishlar (kod): 6 til (en — asosiy/x-default, ru, uk, tr, ar — RTL, uz)
alohida URL + `hreflang`, canonical, `sitemap.xml` (hreflang alternatelari bilan), `robots.txt`
(AI botlar ochiq), `llms.txt` + `llms-full.txt`, JSON-LD (MobileApplication, Organization,
WebSite, FAQPage, Article, HowTo, BreadcrumbList, CollectionPage), 10 ta inglizcha qo'llanma
(«German letters explained»), CDN'siz CSS/JS, tizim shriftlari (Google Fonts YO'Q), cookie va
analitika YO'Q, sahifada boshqa hostdan birorta resurs yuklanmaydi, IndexNow kaliti.

Reyting, yuklab olishlar soni, sharhlar — saytda va JSON-LD'da YO'Q (eski saytdagi soxta
5.0/150 olib tashlandi). Haqiqiy reyting paydo bo'lsa ham, uni faqat do'kondan aniq
raqam bilan va sana ko'rsatib qo'shing.

Qidiruvda 1-o'rin hech kim tomonidan kafolatlanmaydi — natija tashqi ishlarga va vaqtga
(odatda 4–12 hafta) bog'liq.

## 0. Domen va deploy: `klarineo.com` (host ildizi)

Sayt endi **o'z custom domenida, host ildizida** joylashgan — `/memopic/` subpath YO'Q.
`src/site.mjs` → `SITE_URL = 'https://klarineo.com/'`, `BASE` = `/`. Repo ildizida `CNAME`
fayli (`klarineo.com`) bor. Subpath muammosi (robots.txt faqat host ildizidan o'qiladi)
endi dolzarb emas: `https://klarineo.com/robots.txt`, `/sitemap.xml`, `/llms.txt` va
IndexNow kalit fayli hammasi to'g'ridan-to'g'ri ildizda ishlaydi. Alohida
`brr-zaytun77.github.io` repo'si endi KERAK EMAS.

**Deploy qadamlari (bir marta):**
1. DNS (domen registratoringizda): `klarineo.com` ni GitHub Pages'ga yo'naltiring —
   apex uchun A yozuvlari `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
   `185.199.111.153` (va/yoki AAAA), `www` uchun CNAME `brr-zaytun77.github.io`.
2. GitHub → repo **Settings → Pages → Custom domain** = `klarineo.com` → saqlang →
   DNS tekshiruvidan keyin **«Enforce HTTPS»** ni yoqing. `CNAME` fayli allaqachon repo'da,
   build uni o'chirmaydi.
3. Eski `https://brr-zaytun77.github.io/memopic/` manzillari GitHub tomonidan avtomatik
   `klarineo.com` ga yo'naltiriladi — eski havolalar buzilmaydi.
4. Domen o'zgarsa FAQAT `src/site.mjs` → `SITE_URL` ni o'zgartiring → `npm run build`.

## 1. Birinchi hafta (majburiy)

1. **LEGAL ma'lumotlari**: `src/site.mjs` → `LEGAL.address`, `director`, `regNo` ni to'ldiring
   (`npm run check` shu bo'sh ekan xato beradi). `legalForm` ni ham tekshiring.
2. **GDPR 27-modda — EI vakili**: kompaniya EI'da emas, lekin Germaniyadagi foydalanuvchilarga
   xizmat qiladi → odatda EI'dagi vakil (EU representative) tayinlash talab qilinadi. Bunday
   xizmatlar yillik obuna asosida ishlaydi. Tayinlangach — `EU_REPRESENTATIVE` ga yozing.
   Yurist bilan qisqa maslahat tavsiya etiladi (Impressum va GDPR uchun).
3. **Google Search Console** (search.google.com/search-console): endi **«Domain» mulki**
   tavsiya etiladi — `klarineo.com` → DNS TXT yozuvi bilan tasdiqlang (butun domenni, barcha
   tillarni va subdomenlarni qamrab oladi). Muqobil: «URL prefix» `https://klarineo.com/`.
   Keyin **Sitemaps**: `https://klarineo.com/sitemap.xml`. «URL Inspection» bilan bosh sahifa
   va `https://klarineo.com/guides/` ni «Request indexing».
4. **Bing Webmaster Tools** (bing.com/webmasters): «Import from Google Search Console» yoki
   sitemap qo'lda. Bing indeksi ChatGPT qidiruvi va Copilot'ni oziqlantiradi. Har deploy'dan
   keyin: `npm run indexnow` (kalit fayli `https://klarineo.com/ff97d9d65c3a5979005c5233eaeffb81.txt`
   — endi host ildizida, ishlaydi).
5. **Yandex Webmaster** (webmaster.yandex.com): sayt qo'shish, sitemap — rus/ukrain/o'zbek
   tilli foydalanuvchilar uchun. Tasdiqlash fayli kerak bo'lsa — ayting, build'ga qo'shamiz.
6. **Do'kon sahifalaridagi havolalar**:
   - App Store Connect → «Marketing URL»: `https://klarineo.com/`,
     «Support URL»: shu yoki `https://klarineo.com/#faq`, «Privacy Policy URL»:
     `https://klarineo.com/privacy-policy/`.
   - Play Console → Store settings → «Website» va «Privacy policy» — xuddi shular.
   - Eski `privacy-policy.html` manzili ishlayveradi (yangi sahifaga yo'naltiradi), lekin
     do'konlarda yangisiga almashtiring.
7. **App Store / Play maxfiylik formalari** (App Privacy, Data safety) yangi siyosat bilan mos
   bo'lsin: reklama yo'q, tracking yo'q, analitika — faqat rozilik bilan, xat rasmlari
   Google'ga tahlil uchun yuboriladi (Data safety: «Photos» — collected/processed ephemerally,
   not shared for advertising). Eski AdMob/IDFA ma'lumotlari olib tashlansin.

## 2. Ishonch va tashqi havolalar (AI tavsiyalari uchun eng muhimi)

AI yordamchilar ilovani **mustaqil manbalar** tilga olgandagina ishonch bilan tavsiya qiladi.
- Germaniyadagi muhojirlar jamoalari: Telegram kanallar/chatlar (rus, ukrain, o'zbek, turk,
  arab tillarida), Facebook guruhlari («Русские в Германии», «Українці в Німеччині» va h.k.),
  Reddit r/germany, r/AskAGerman — foydali qo'llanma havolasi bilan, spamsiz.
- Integratsiya va maslahat markazlari (MBE, JMD) uchun bir sahifalik tushuntirish — ular
  ilovani tavsiya qilishi mumkin (hamkorlik so'rang, rasmiy aloqa da'vo qilmang).
- **Wikidata** element: «Klarineo» (mobile application; ilgari «MemoPic»), developer
  TIYN ZAYTUN LLC, official website `https://klarineo.com/`, App Store / Play ID'lari.
- YouTube/TikTok: «Jobcenter xati keldi — nima qilish kerak» kabi qisqa videolar + sayt havolasi.
- Do'konlarda sharhlarga javob bering — reyting va sharhlar AI javoblarida ko'p keltiriladi.

## 3. ASO — do'kon sahifalari (tavsiya, siz kiritasiz)

Qoidalar: App Store Name ≤30, Subtitle ≤30, Keywords ≤100 (vergul bilan, bo'sh joysiz, nomda
bor so'zni takrorlamang); Play Title ≤30, Short description ≤80. Raqobatchi nomlari, «#1»,
«best», «flashcard» — ISHLATILMAYDI. Uzunliklar tekshirilgan; Console'da yana bir bor ko'ring.

| Til | Name / Play Title (30) | Subtitle (30) |
|---|---|---|
| en | `Klarineo: German Letters Help` | `Understand & reply in German` |
| de | `Klarineo: Behördenbriefe` | `Deutsche Post einfach erklärt` |
| ru | `Klarineo: немецкие письма` | `Объяснит письмо и срок ответа` |
| uk | `Klarineo: німецькі листи` | `Пояснить лист і строк` |
| tr | `Klarineo: Almanca Mektuplar` | `Resmi mektupları anlayın` |
| ar | `Klarineo: الرسائل الألمانية` | `افهم رسائل الدوائر الألمانية` |

App Store Keywords (100):
- en: `jobcenter,finanzamt,auslaenderbehoerde,bureaucracy,translate,immigrant,expat,deadline,speak,vocab`
- de: `jobcenter,finanzamt,ausländerbehörde,mahnung,übersetzen,frist,antwort,deutsch,lernen,amt,brief`
- ru: `jobcenter,finanzamt,германия,перевод,иммигрант,бюрократия,немецкий,язык,документы,ведомство`
- uk: `jobcenter,finanzamt,німеччина,переклад,біженці,документи,відповідь,німецька,мова,установа`
- tr: `jobcenter,finanzamt,almanya,tercüme,göçmen,bürokrasi,süre,cevap,öğren,belge,resmi,daire`
- ar: `jobcenter,finanzamt,ألمانيا,ترجمة,مهاجر,لاجئ,موعد,رد,تعلم,وثائق,دائرة,مكتب`

Google Play — Short description (80):
- en: `Photograph a German letter: explanation in your language, deadline and reply`
- de: `Behördenbrief fotografieren: Erklärung in deiner Sprache, Frist und Antwort`
- ru: `Сфотографируйте письмо из ведомства: объяснение на вашем языке, срок и ответ`
- uk: `Сфотографуйте лист з установи: пояснення вашою мовою, строк і відповідь`
- tr: `Resmi Alman mektubunu çekin: kendi dilinizde açıklama, son tarih ve yanıt`
- ar: `صوّر رسالة ألمانية: شرح بلغتك والموعد النهائي ورد مهذّب`

Eslatmalar:
- iOS URL'dagi eski slug (`memopic-learn-with-flashcards`) — ilova nomi Klarineo'ga
  o'zgarganda Apple slug'ni o'zi yangilaydi; eski havolalar ishlayveradi. Saytdagi havola
  ID bo'yicha ishlaydi (`id6756977971`).
- Ilova interfeysida nemis tili yo'q bo'lsa ham, **de** lokalizatsiyasi Germaniya do'konida
  topilishni oshiradi (ko'p muhojirlar telefonni nemischa ishlatadi). Tavsifda ilova
  interfeysi tillarini aniq yozing.
- Skrinshotlarda soxta reyting/sharh, davlat gerbi/logotipi bo'lmasin; namunaviy xatlarda
  faqat «Max Mustermann» kabi to'qima ma'lumot.
- Do'kon tavsifida va skrinshotlarda «AI xato qilishi mumkin, yuridik maslahat emas»
  degan qisqa jumla bo'lsin — saytdagi shartlar bilan mos.

## 4. Kuzatish

Search Console → «Performance»: qaysi so'rovlar bilan topilyapti. Past CTR'li sahifalar
title/description'ini `src/i18n/<til>.json` yoki `src/guides/<slug>.json` da yaxshilang →
`npm run build` → `npm run check`. Qo'llanmalarni yiliga kamida bir marta qayta ko'rib chiqing
(qonunlar o'zgaradi — masalan, 2026-07-01 dagi Grundsicherung islohoti) va `src/site.mjs` dagi
`UPDATED` sanasini yangilang. Keyingi qadam: qo'llanmalarni ru/uk/tr/ar/uz tillariga tarjima
qilish (har biri alohida URL + hreflang).
