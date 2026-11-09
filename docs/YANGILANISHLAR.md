# 2.24 — Ma'lumot darajasi nishonlari, haqiqiy masshtab, telefon
- Nishonlar (js/provenance.js): har bir sayohat bosqichida, yulduz/galaktika/ekzotizim ko'rinishida, sayyora ma'lumot panelida va laboratoriya bo'limlari tepasida «O'lchangan / Hisoblangan / Taxminiy / Simulyatsiya» belgilari. Chipni bosing — nima nimaligi ro'yxat bilan chiqadi. Menyu → «Belgilar…».
- Halollik tuzatishi: Quyosh sistemasida sayyora joylashuvi oddiy rejimda «namoyish orbitalari» (sanaga bog'liq emas) deb yozildi; haqiqiy masshtab yoki sana rejimida — Astronomy Engine bilan hisoblangan.
- Haqiqiy masshtab endi ko'rinadigan joyda: Menyu → «Haqiqiy ⇄ ko'rgazmali masshtab» yoki nishon oynasidagi tugma. Rejimda: kamera masofasi (AU/km), yorug'lik vaqti, Quyoshdan masofa va sayyoralarga tezkor o'tish tugmalari. Sayohat (1-bosqich) — ko'rgazmali; oynadagi tugma haqiqiy masshtabga o'tkazadi.
- Telefon: banner va «Menyu» tugmasi ustma-ust tushishi tuzatildi; yozuvlar to'qnashuvi kamaytirildi (js/labelfix.js); laboratoriya oynasida bo'lim tugmalari bir qatorda aylanadi, osmon xaritasi va boshqa ikki ustunli bo'limlar bir ustunga o'tadi.
- Cheklovlar: telefon sinovi faqat Chromium'ning telefon rejimida (390×844); haqiqiy sensorli qurilma, Safari va Firefox sinalmagan. Nishonlar jadvali dasturning manbalariga qarab qo'lda yozilgan — yangi ma'lumot qo'shilganda yangilash kerak.

# 2.23 — Asosiy asteroid kamari (MPCORB) va sifat darajalari
- MPC MPCORB.DAT dan 1 524 585 ta asteroid (Yerga yaqin/PHA/TNO lar 2.17 da alohida). Ma'lumot H (yorqinlik) bo'yicha 9 bo'lakka bo'lingan: data/mainbelt/mb_01…09.js (≈35 MB, hech narsa kesilmagan).
- Sifat darajalari (Sozlamalar → Grafika sifati) qancha yuklanishini belgilaydi: Yengil — H ≤ 14 (≈25 ming), O'rta/Moslashuvchan — H ≤ 16 (≈200 ming), Yuqori — hammasi. Bo'laklar sahifa ochilgach 5 soniyadan so'ng orqa fonda yuklanadi.
- Yangi bo'lim «Asosiy kamar (MPC)»: zichlik xaritasi (sana bo'yicha harakat), Kirkvud bo'shliqlari va rezonanslar, Troyanlar, Gilda, jismga bosib ma'lumot, qidirish (nomlar faqat H ≤ 14 uchun).
- Sayohat, Quyosh sistemasi: sxematik kamar o'rniga haqiqiy asteroidlar (zonalar rangi: kamar, Gilda, Troyanlar, ichki).
- Cheklovlar: Kepler hisobi (planetalar ta'siri yo'q); nomlar faqat yirik jismlar uchun; Yuqori darajada ≈ 150 MB xotira va katta GPU yuki — kuchsiz qurilmada «O'rta» yoki «Yengil» tanlang. Faqat Chromium (SwiftShader) da sinalgan.

# 2.22 — Kino rejimi
- Menyu: «🎬 Kino rejimi» (js/cinema.js). Hech qanday yozuv va tugma yo‘q: faqat yulduzlar, sayyoralar, tumanlik va musiqa. Kamera Quyosh tizimidan Orion, Somon Yo‘li, Mahalliy guruh, Laniakea, Kosmik to‘r va Kuzatiladigan koinotgacha uchib boradi, keyin orqaga qaytadi va sikl takrorlanadi.
- Quyosh tizimida kamera har bir sayyora yonidan sekin o‘tadi. Musiqa avtomatik yoqiladi (chiqqanda oldingi holat tiklanadi). To‘liq ekran va ekran o‘chmasligi (wakeLock) so‘raladi.
- Chiqish: Esc yoki ikki marta bosish.
- Cheklovlar: faqat Chromium (SwiftShader) da sinalgan; haqiqiy ovoz va uzoq (soatlab) ishlash tekshirilmagan; kamera yo‘li ko‘z bilan sozlangan — yoqmasa ayting, tuzatamiz.

# 2.21 — HD teksturalar
- HD teksturalar (js/texturesplus.js, assets/textures/hd/): Yer 4K + relyef + okean yaltirashi; Oy 4K; Mars 4K + NASA MOLA balandligidan relyef; Pluton (New Horizons); Yevropa, Ganimed (Voyager/Galileo); Titan (Cassini infraqizil xaritasi — rangi taxminiy). Yangi yo‘ldoshlar: Io va Kallisto.
- Teksturalar sahifa ochilgach orqa fonda yuklanadi (jami ≈ 10 MB, bir necha soniya); «Grafika sifati: Yengil» da yuklanmaydi. Sayohatdagi sayyora nusxalari ham yangilanadi.
- Cheklovlar: Ganimed, Kallisto, Yevropa, Io xaritalari past ruxsatli (1–1,4K) — yaqindan xira ko‘rinadi. Serera, Eris, Haumea, Makemake «fictional» — ishlatilmadi. Venera: bulut qatlami saqlandi. Oy relyefi (CGI Moon Kit) paketda yo‘q edi. Faqat Chromium (SwiftShader) da ko‘rilgan; GPU xotirasi Yer+Oy+Mars uchun ≈ 150 MB oshadi.
- Manbalar va litsenziyalar yangilandi (docs va «Manbalar» bo‘limi).


# 2.20 — Musiqa, ovoz va fon sozlamalari
- «Tumanlik fon» endi alohida yoqiladi/o‘chiriladi: Sozlamalar bo‘limida va asosiy menyuda (Asboblar). «Kino effektlari (bloom)» ham alohida.
- Musiqa va ovoz (js/audio.js): fon musiqasi uzluksiz yangrab turadi; sayyora, Sayohat bosqichi, galaktika va yulduz uchun alohida ovoz yumshoq o‘tib kiradi. Fayl bo‘lmasa — ilovaning o‘z generativ musiqa va ovozlari (kod bilan). Sozlamalarda yoqish/o‘chirish va balandlik; asosiy menyuda «Musiqa» va «Ovoz (obyektlar)» tugmalari.
- audio/ papkasi: music/ (music1.mp3, music2.mp3 …), ambient/ (earth.mp3, jupiter.mp3, stage3.mp3, galaxy_andromeda.mp3 …) va audio-config.js. Batafsil: audio/OQING.txt.
- Cheklov: brauzer tovushni faqat birinchi bosishdan keyin boshlaydi. Fayl ovozlari file:// rejimida oddiy audio sifatida chaladi (MP3 tavsiya). Kosmosda ovoz tarqalmaydi — badiiy tovushlar. Sinov Chromium'da, haqiqiy karnay/quloqchinda eshitib ko‘rilmagan — balandlik va ta’mni o‘zingiz sozlang.


# 2.19 — Sayohat kino effektlari
- Sayohat «kino» effektlari (js/journeyfx.js): protsedur tumanlik (gaz-chang bulutlari; bosqichga qarab rangi va yorqinligi o‘zgaradi), bloom (yorug‘lik tarqalishi), yorqin yulduzlarda xoch shaklidagi nur, vignetka va yengil rang grading.
- Tumanlik — badiiy fon: kod bilan hosil qilingan, haqiqiy kosmik surat emas va kuzatuv ma’lumoti emas. Katta masshtabli bosqichlarda (Laniakea va undan keyin) ataylab juda xira qilingan.
- O‘chirish: asboblar menyusida «Kino effektlari (Sayohat)» yoki «Grafika sifati: Yengil» (FPS past bo‘lsa avtomatik o‘chadi).
- Cheklov: faqat Chromium (SwiftShader) da sinalgan; haqiqiy video kartada tezlik boshqacha bo‘lishi mumkin.


# 2.18 — Ufq, manbalar, yaqin o‘tishlar
- «Kichik jismlar (MPC)»: tanlangan jism uchun Osmon xaritasidagi joyingizdan balandligi, azimuti, tungi ko‘rinish oynasi va taxminiy yorqinligi; «Yaqin o‘tishlar (PHA, kelasi 10 yil)» ro‘yxati (Kepler hisobi; masalan 1999 AN10, 2027-08-07, ≈1 Oy masofasi). Aniq sana uchun NASA CNEOS ga qarang.
- Sayohat: bosqichlar orasida uchishda yuqorida «→ bosqich nomi» sarlavhasi chiqadi va kameraning ko‘rish burchagi tezlikka qarab kengayadi.
- Yangi bo‘limlar: «Ufqdan narida» (Ma’lum / Taxmin / Faraz belgilari bilan) va «Manbalar» (litsenziyalar); menyuda ham bor. docs/MANBALAR_VA_LITSENZIYALAR.md to‘ldirildi.
- Fayllar: js/info.js (yangi), js/smallbodies.js, js/journeyplus.js, js/skymap.js, js/ui.js, css/extras.css.


# 2.17 — Kichik jismlar (MPC)
- «Kichik jismlar (MPC)» yangi laboratoriya bo‘limi: Minor Planet Center'ning haqiqiy orbital elementlari — 50 061 asteroid/TNO (2 367 PHA, 39 691 NEA, 961 kentavr, 7 042 transneptun) va 942 kometa. Ekliptika tekisligi, tepadan; masshtab, siljitish, sana siljitgichi (±10 yil) va ▶ harakat, filtrlar, qidiruv (Apophis, Halley…), jism ma’lumoti va orbitasi, «hozir Yerga eng yaqin» ro‘yxati.
- Sayohat, «Quyosh sistemasi» bosqichi: ~14 000 HAQIQIY jism (barcha PHA, NEA namunasi, kentavrlar, TNO) bugungi sana bo‘yicha; masofa sayyora orbitalari bo‘yicha siqilgan masshtabda (burchaklar ekliptik, lekin sayyoralar sahnada haqiqiy joyida emas). Asosiy kamar sxematik qoladi.
- Fayl: data/smallbodies.js (1,8 MB), js/smallbodies.js.
- Cheklovlar: joy oddiy Kepler hisobi bilan topiladi (planetalar ta’siri yo‘q); asosiy asteroid kamaridagi ~million oddiy asteroid bu to‘plamda yo‘q; ma’lumot — suratdir; faqat Chromium'da sinalgan.
- Manba: Minor Planet Center (minorplanetcenter.net) ochiq ma’lumotlari.


# 2.16 — Katta osmon xaritasi va boyitilgan Sayohat

Osmon xaritasi katta ekran rejimi; Sayohatda real yulduz foni, Messier obyektlari, asteroid va Kuiper kamarlari; kamera moslashtirildi.

# 2.15 — Osmon xaritasi kengaytirildi

5044 yulduz, 88 turkum, Messier va NGC/IC obyektlari; presessiya tuzatildi. Manbalar: d3-celestial (BSD-3), OpenNGC (CC-BY-SA 4.0).

# 2.14 — Qovun modeli

Quyosh = qovun, Yer = chumoli: butun Quyosh sistemasi bitta masshtabda, 2D zoom/pan, buyum va sayyora ko‘rinishi.

# 2.13 — Kuzatiladigan koinot

Masofa qobiqlari (z=0,5…1100), simulyatsiya qilingan KMF sferasi (CAMB, Planck 2018), gorizont ≈ 46,2 mlrd y.y.

# 2.12 — Aylanuvchi asteroidlar va kosmik to'r simulyatsiyasi

1. js/scene.js: asteroid kamari (850 jism) Kepler qonuni bo'yicha harakatlanadi: r 34–38 birlik → a ≈ 2,2–3,3 AU, davr 365,25·a^1,5 kun, yo'nalishi planetalar bilan bir xil (sinalgan), sekin aylanish. `updateAsteroids()` har kadrda `days` ga qarab matritsalarni yangilaydi (faqat vaqt o'zgarganda).
2. data/cosmicweb.js + js/cosmicweb.js: ΛCDM Gauss maydoni (BBKS, σ8=0,81) → Zel'dovich yaqinlashuvi, 128³ zarrachadan 82 000 ta, 512 Mpk davriy qutidan R=256 Mpk shar; zichlik bo'yicha rang; 4 zich tugun va 3 bo'shliq avtomatik topilgan; Laniakea (80 Mpk radius) sferasi.
3. js/journey.js: eski sxematik to'r olib tashlandi, matnlar yangilandi.

## Cheklovlar
Zel'dovich yaqinlashuvi N-tana simulyatsiyasi emas; tasodifiy realizatsiya — bizning koinot xaritasi emas. Asteroid orbitalari doira shaklida (ekssentrisitet yo'q), taqsimot tasodifiy. Chromium/SwiftShader'da sinalgan.

# 2.11 — Laniakea: haqiqiy galaktikalar (2MRS)

1. data/laniakea.js: 2MRS asosiy jadvali (VizieR J/ApJS/199/26 table3, 43 533 ta qizil siljishli galaktika) → 37 086 ta. Qayta ishlash: CMB sistemasi (Planck 2018 dipoli), d = cz/70, FoF guruhlash (≥4 a‘zo, Δv<350 km/s, Δ⊥<0,35·(1+D/90) Mpk) orqali «Fingers of God» siqish, guruhsiz cz<600 km/s va d>200 Mpk chiqarilgan. Ikkilik (SoA) base64.
2. js/laniakea.js: groups[5] qayta qurildi (1 birlik = 4 Mpk; Mahalliy guruh (14;3;4)). Klasterlar yozuvlari FoF guruhlaridan (Virgo 137, Norma 98, Perseus 87, Hydra 70, Centaurus 60, Coma 41, Fornax 28 a‘zo). Shapley — adabiyotdagi taxminiy joy.
3. MG harakati o‘qi (≈ 620 km/s, l≈272°, b≈30°), 50/100/150 Mpk halqalari, obyekt tanlash paneli. M87* Virgo markaziga.
4. js/journey.js: eski sxematik to‘r olib tashlandi; js/milkyway.js: eski M87* belgisi olib tashlandi.

## Cheklovlar
K<11,75 tanlanma effekti; qochish zonasi; qizil siljish masofasi (xususiy tezliklar); Laniakea chegarasi chizilmagan; Shapley joyi taxminiy. Chromium/SwiftShader'da sinalgan.

# 2.10 — Mahalliy guruh (haqiqiy ma'lumot)

1. data/localgroup.js: Local Volume Database (Pace 2024) dan 117 ta tasdiqlangan galaktika: nom, RA/Dec (J2000), masofa (masofa modulidan), M_V, HI gazi, guruh (Somon Yo'li / Andromeda yo'ldoshi / yaqin qo'shni).
2. js/localgroup.js: Sayohatning 5-bosqichi qayta qurildi. RA/Dec → galaktik koordinatalar (Hipparcos matritsasi) → Somon Yo'li modeli bilan bir xil o'qlar. 1 birlik = 40 kpc ≈ 130 000 y.y.
3. M31 (780 kpc, qiyalik 77°, PA 38°) va M33 (809 kpc, 56°, 22°) — spiral model; MW tekisligi y=0.
4. Kattalashtirish: galaktika o'lchami 8×, yo'ldoshlarning host galaktikadan masofasi 3×; ekranda yozilgan. Galaktikalar orasidagi masofa haqiqiy.
5. Panel: galaktika tanlash (masofa, M_V, gaz), 2025 yilgi M31–MW to'qnashuv bahosi.
6. js/journey.js: eski sxematik galaktikalar olib tashlandi, matnlar yangilandi.

## Cheklovlar
Spiral shakllari taxminiy; M33 yaqin chetining yo'nalishi noaniq. Laniakea va kosmik to'r eski sxematik. Ma'lumotlar tashqi manba bilan solishtirilmagan (faqat LVD ga tayanilgan). Chromium/SwiftShader'da sinalgan.

# 2.9 — Chap menyu, qora tuynuk, effektlar

1. js/ui.js: «Asboblar va yozuvlar» menyusi (rail + mobil «Menyu»), eski yuqori-chap tugmalar yashirildi; o‘chirgichlar: masofa ko‘rsatkichi, yozuvlar, effektlar.
2. js/blackhole.js: Shvartsshild nur kuzatuvi (GPU shader), yupqa akkretsion disk, Doppler nurlanishi, 4 real + 2 gipotetik obyekt; data/extras.js → KOINOT_BH. Osmon xaritasida yo‘nalish belgilari; M87* Laniakea bosqichida.
3. Masofa ko‘rsatkichi tepada, × bilan yashirish.
4. Effektlar (canvas ustki qatlam): meteorlar, tezlik chiziqlari, Quyosh flare, vignetka. «Yengil» sifatda yoki o‘chirgichdan o‘chadi.

## Cheklovlar
Simulyatsiya aylanmaydigan qora tuynuk va yupqa disk; rang badiiy. Gaia BH1 koordinatalari kiritilmagan. Chromium/SwiftShader'da sinalgan.

# 2.8 — Somon Yo‘li va masofa ko‘rsatkichi

1. js/milkyway.js: to‘sinli spiral Somon Yo‘li (to‘sin, 4 qo‘l — 2 yirik/2 kichik, Orion shoxchasi, chang yo‘llari, bo‘rtma, HII hududlari, sharsimon to‘dalar, Magellan bulutlari, Sgr A*). 1 birlik ≈ 1 852 y.y.; disk radiusi 27 birlik ≈ 50 000 y.y.; Quyosh (14;0;0) ≈ 26 000 y.y.
2. Qiya / Tepadan / Yondan ko‘rinish tugmasi; qo‘l va to‘sin yozuvlari.
3. «Yerdan masofa» ko‘rsatkichi: km (katta sonlar 10ⁿ ko‘rinishida), AU/y.y., yorug‘lik vaqti, mashhur belgilar. Bosqichlar oralig‘ida logarifmik interpolyatsiya — masshtab ko‘rsatkichi, real parvoz emas.
4. journey.js: yozuv va tavsif yangilandi (versiya 2.8).

## Cheklovlar
Model — ilmiy asosli badiiy tasvir; qo‘llar soni/shakli munozarali; Magellan bulutlari yaqinlashtirilgan. Mahalliy guruhdagi kichik Somon Yo‘li eski sodda spiral. Chromium/SwiftShader'da tekshirildi, haqiqiy GPU'da emas.

# 2.7 — Osmon, kalendar, hisoblagichlar, kontent

1. Osmon xaritasi (planetariy): shahar/koordinata + sana, Astronomy Engine, 68 yorqin yulduz (J2000), turkum chiziqlari, chiqish/botish jadvali.
2. Kuzatish kalendari: tutilishlar (mahalliy ko‘rinish), Oy fazalari, qarama-qarshiliklar, eng katta uzoqlashuvlar, meteor oqimlari, fasllar.
3. HR diagramma (324 HYG yulduzi) + 3D xaritaga o‘tish. 4. Hisoblagichlar (8 ta). 5. Asteroid/kometalar (11 jism). 6. Missiyalar (17). 7. O‘zbekiston va koinot (10 bo‘lim). 8. Viktorina (20 savol).
9. 7 ta yangi ekzosayyora tizimi (jami 9 tizim, 27 sayyora); keng orbitalar uchun kvadrat-ildiz shkalasi.
10. UZ/RU/EN interfeys, skrinshot, havola (#o=…&d=…&l=…), ixtiyoriy Avto FPS.
11. Texnik: `KoinotLab.register(id,nom,fn)` ilgagi; yangi fayllar: js/extras-core.js, skymap.js, science.js, content.js, i18n.js, data/extras.js, css/extras.css. check_project.cjs endi 16 ga qattiq bog‘lanmagan.

## Cheklovlar
Teksturalar 2K (4K/8K yo‘q). Ruscha/inglizcha tarjima faqat interfeys. Yulduz xaritasi to‘liq emas. Yangi ma’lumotlar yaxlitlangan; manbalar bilan solishtiring. PWA qo‘shilmagan (so‘rov bo‘yicha). Haqiqiy GPU va Chrome’dan boshqa brauzerlar tekshirilmagan; Chromium/SwiftShader sinovi o‘tdi.

# 2.6 — Obyektlarni o‘rganish

1. Mahalliy guruhda galaktika nomi yoki markazini bosish: alohida 3D model, disk ichiga yaqinlashish va qaytish. Besh galaktika modeli.
2. 324 HYG yozuvi uchun rangli, harakatlanuvchi badiiy yulduz sirti. Radius/harorat mavjud bo‘lmasa ko‘rsatilmaydi.
3. TRAPPIST-1 b–h va Proxima Centauri b: 2 tizim, 8 ekzosayyora. Sayyora tanlash, yaqinlashish, orbital harakat, pauza va tezlik. Davrlar NASA katalogida berilgan yaxlitlangan qiymatlar.
4. Qayerdaman: sxematik manzil zanjiri, oldingi manzil, Yerga qaytish. Bu fazoviy koordinatali navigatsiya xaritasi emas.
5. Yuqori qidiruv va Obyektlar oynasi: sayyora/yulduz/galaktika/tizim/ekzosayyora.
6. Yengil/O‘rta/Yuqori: pixel ratio va katta zarracha qatlamlarining 30/65/100 foizi. 324 haqiqiy katalog yozuvi o‘chirilmaydi. Qo‘lda tanlanadigan rejimlar; avtomatik FPS boshqaruvi yo‘q.
7. Tafsilot kartalari: mavjud masofa, spektr, davr, radius, massa, manba va ko‘rgazmali model belgisi.

## Cheklovlar
Yulduz/ekzosayyora sirtlari badiiy; boshqa galaktikalar ichidagi nuqtalar kuzatuv katalogi emas. Sayyoralarning ko‘rinadigan radiuslari kattalashtirilgan. Orbita fazasi, yo‘nalishi va doiraviy shakli taxminiy; aniq sana efemeridasi emas. Proxima tizimida faqat b qo‘shilgan. GPU/Chrome vizual tekshiruvi bu muhitda bajarilmagan.

# 2.5 — Tabiiy va kinematik ko‘rinish

- Tabiiy/Kinematik tugmasi, tanlov lokal saqlanadi.
- Yulduzlarning turli o‘lchami va yorqinligi; tabiiy rejimda yumshoq ranglar.
- Galaktika tarmoqlarida fazoga bog‘liq qorong‘i chang yo‘llari, cho‘zinchoq markaz va gaz qatlamlari.
- Magellan bulutlari uchun tartibsiz shakl; ko‘rgazmali model.
- Filamentlar qalinligi tugunlar yaqinida ortadi.
- Kamroq atrof yorug‘ligi: sayyoralarning kunduz va tun tomonlari yaxshiroq ajraladi.
- Quyosh sirtidagi protseduraviy donadorlik va dog‘lar, kichikroq toj yog‘dusi.
- Silliqroq qatlam ochilishi va ixcham nom belgilari.

Mavjud 2K teksturalar saqlandi. Yangi 4K/8K xaritalar yoki haqiqiy relyef xaritalari qo‘shilmadi. Kosmik tuzilmalar taxminiy. Shader matni va DOM/CPU regressiya sinovlari o‘tdi. Haqiqiy GPU shader kompilyatsiyasi va Chrome/WebGL tasviri tekshirilmagan.

# 2.4 — Ixcham boshqaruv va yulduzga yaqinlashish

Pastdagi bir qator boshqaruv; bosqichlar menyusi va ma’lumot paneli ixtiyoriy ochiladi. Faqat koinot rejimi va boshqaruvni qaytarish tugmasi. Orionda 324 katalog yozuvidan tanlash yoki yulduzni bosish, masofa/spektr, kamerani yaqinlashtirish va qaytish. Doimiy dekorativ yulduz foni va katta masshtabda xira galaktikalar; fon katalog obyektlari emas. O‘tishlar ertaroq bir-biriga ulanadi.

# 2.3 — Tiniqroq kosmik atlas

Oq yulduz sprite; ranglar sariq tekstura bilan buzilmaydi. Katta ota-sahna bosqich boshida yashiriladi va asta ochiladi. Somon Yo‘li 42 ming yulduz zarrachasi va yumshoq gaz qatlamlari bilan tasvirlanadi. Nomlar ustma-ust tushishi cheklanadi. Boshqaruv pastda, ma’lumot o‘ng panelda. HYG katalogidagi 324 yaqin yozuv Orion foniga nisbatan kattalashtirilgan qatlamda; yulduz tanlab masofa va spektrni o‘qish mumkin. Magellan bulutlarining ko‘rgazmali modellari qo‘shildi.

Barcha katta tuzilmalar protseduraviy, aniq kuzatuv fotosurati yoki navigatsion xarita emas.

# 2.2 — Asosiy sahnada uzluksiz sayohat

8 bosqich, logarifmik zoom, masshtabga mos koordinatalar, ikki tomonlama o‘tish, avtomatik sayohat, asosiy sahnada galaktikalar. Teksturalar va vendor kutubxonalari o‘zgarmadi.

# 2.1 — Orion tarmog‘i

Galaktikalar bo‘limida Orionning taxminiy 3D modeli, Somon Yo‘lidagi o‘rni, Quyosh belgisi, aylantirish va zoom. Quyosh sistemasiga qaytish tugmasi. Model yulduzlarning aniq katalogi emas.

# 2.0

16 Quyosh sistemasi obyekti va 324 yaqin yulduz. Laboratoriya 8 bo‘limdan iborat.
Asosiy dizayn va avvalgi boshqaruv saqlandi. Alohida ilmiy tajribalar Canvas 2D,
yulduz xaritasi WebGL 3D, asosiy Quyosh sistemasi Three.js orqali ishlaydi.

`astronomy-model.js` haqiqiy km koordinatalarni hisoblaydi. `laboratory.js`
interfeys/eksperimentlar va real masshtab adapterini boshqaradi.
`data/extra-objects.js` qo‘shimcha katalog va taxminiy teksturalarni yaratadi.
`data/nearby-stars.js` alohida qayta foydalaniladigan, litsenziyalangan katalog.

Haqiqiy masshtab koeffitsiyenti: 30 sahna birligi / AU. Kamera yaqin tekisligi
moslashtiriladi. Vizual va haqiqiy radiuslar alohida. Shu rejimda asteroidlarga
soxta fizik joylashuv bermaslik uchun dekorativ kamar yashiriladi.

Video lokal brauzerda yaratiladi; hech qayerga yuborilmaydi. Yuklash foydalanuvchi
brauzerining odatiy Downloads papkasiga bo‘ladi. captureStream/MediaRecorder
mavjudligi va codec oldindan tekshiriladi. MP4 uchun server konvertori yo‘q.

Ovozli ekskursiya uchun o‘zbekcha tizim ovozi kerak. Ovoz yo‘q bo‘lsa, ochiq
xabar va matnli ekskursiya mavjud. Bu paket professional TTS audio yozuvini
va’da qilmaydi.

KENGAYTIRISH.md birinchi versiyaning umumiy arxitektura izohidir.
Endi qo‘shimcha katalog ham index.html’da yuklanadi va model adapteri mavjud.
CPU test katalog soni 16 deb tekshiradi; yangi obyekt qo‘shganda uni yangilang.

## 2.25
- **Bugun osmonda** (laboratoriya tabi): shahar va sana bo'yicha Quyosh/Oy chiqishi-botishi, tun davomiyligi, Oy fazasi, ko'rinadigan sayyoralar (Astronomy Engine), eng yaqin tutilishlar, meteor oqimlari (sanalar taxminiy).
- **Kino rejimini videoga yozish** (menyu → ⏺): canvas + dasturning sintez ovozi → WebM. Tayyor audio fayllar (mp3) videoga kirmaydi. Faqat Chromium'da sinalgan.
- **Fayl yaxlitligi tekshiruvi**: CSS/JS fayl topilmasa, uslubsiz sahifa o'rniga aniq o'zbekcha xabar.
- Cheklovlar: bulut/yorug'lik ifloslanishi hisobga olinmaydi.

## 2.26
- **Galaktikalar atlasi** (menyu → 🌀): 33 galaktika (Magellan bulutlari, M31, M33, M51, M87, Sombrero, Antenna, Hoag, IC 1101 …). Har biri uchun tur, masofa, o'lcham, osmondagi burchak o'lchami va 3D model. «Xarita» rejimida galaktikalar haqiqiy yo'nalishda (RA/Dec) va logarifmik masofada ko'rsatiladi.
- **Ekzosayyora tizimlari** (menyu → 🪐): 15 ta tizim (TRAPPIST-1, Proksima, Barnard, 55 Cancri, Kepler-186/452, TOI-700, HR 8799 …) + taqqoslash uchun Quyosh sistemasi. Kepler orbitalari, yashash zonasi, muvozanat harorati (hisoblangan), sayyorani bosib yaqinlashish, haqiqiy nisbat / logarifmik masshtab.
- Halollik: galaktika 3D modellari — SIMULYATSIYA (turga mos protsedurali tuzilma, haqiqiy surat emas); sayyora ranglari ramziy; katalog qiymatlari internet bo'lmagani uchun yaxlitlab qo'lda kiritilgan (qarang: docs/MANBALAR_VA_LITSENZIYALAR.md).

## 2.27 — Teleskop kuzatuvchilari uchun
- **Laboratoriya → Teleskop** (menyu → 🔭): Asbob (teleskop, okulyarlar, izlagich, osmon sifati), Reja (kecha ko'rinadigan obyektlar, qiyinlik, mos okulyar), Ko'rish maydoni (xaritada okulyar doiralari), Yo'l (star-hop), Sayyoralar (balandlik, burchak o'lchami, faza, Saturn halqa qiyaligi) + Yupiter yo'ldoshlari, Astrofoto hisoblagichi, Jurnal (Messier progressi, CSV/JSON zaxira).
- **Qizil tungi rejim** (menyu → 🔴): butun interfeys qizil; yorqinlik surgichi.
- Cheklovlar: qiyinlik va yorqinlik chegarasi — taxminiy qoidalar; star-hop avtomatik taklif (teleskopda sinalmagan); Yupiter yo'ldoshlarining disk oldidan o'tishi/soyasi va Buyuk Qizil Dog' yo'q; bulut va yorug'lik ifloslanishi faqat Bortle bilan taxminan.

## 2.28 — ixtiyoriy internet
- Dastur internetsiz ham to'liq ishlaydi; internet bo'lsa (menyu → 🌐 bilan yoq/o'ch) qo'shiladi: kuzatuv rejasida ob-havo prognozi (Open-Meteo), galaktikalar uchun Vikipediya suratlari, ekzosayyora ma'lumotini NASA Exoplanet Archive'dan yangilash (yangi sayyoralar qo'shiladi, natija saqlanadi).
- Maxfiylik: so'rovlar brauzerdan to'g'ridan-to'g'ri tashqi saytlarga ketadi (IP ko'rinadi); ob-havo uchun shahar koordinatasi yuboriladi.
- Cheklov: yozuvchi muhitda tarmoq yopiq edi — kod soxta (mock) javoblar bilan sinaldi, haqiqiy serverlarda sinalmagan; CORS yoki format o'zgargan bo'lsa, xabar chiqadi va dastur oflayn ishlashda davom etadi.

## 2.29 — jonli ma'lumot (internet kerak)
- **Laboratoriya → Jonli ma'lumot** (menyu → ☀): Quyosh faolligi (Kp, NOAA shkalalari, Quyosh shamoli, Bz, rentgen, dog'lar soni, SDO surati), ISS (joyi, xarita, ko'rinadigan o'tishlar — TLE + SGP4), yorqin kometalar (JPL orbita elementlari, o'rni va yorqinligi dasturda hisoblanadi), supernovalar uchun havolalar.
- vendor/satellite.min.js (satellite-js 5.0.0, MIT) qo'shildi.
- Cheklovlar: tashqi API'lar yozuvchi muhitda sinalmadi (soxta javoblar bilan sinaldi); komet yorqinligi taxminiy; supernovalar uchun ishonchli kalitsiz manba topilmadi — avtomatik ro'yxat yo'q; ISS o'tishlari oddiy soya modeli bilan.

## 2.30 — Teleskop budilnigi
- **Teleskop → Budilnik** (menyu → ⏰): obyekt/sayyora/Oy/Quyosh kerakli balandlikka ko'tarilganda yoki pasayganda, aniq vaqtda (bir marta yoki har kuni) yoki ISS ko'rinadigan o'tishidan oldin ogohlantiradi. «Oldindan» (0–60 daqiqa), takrorlash, «5 daqiqa keyin», tez shablonlar (qorong'i tun, Oy chiqishi, Yupiter 30° …).
- Ogohlantirish: katta oyna (boshqa oynalar ustida), tovush, tebranish, sarlavha miltillashi, ruxsat bo'lsa tizim bildirishnomasi; «ekranni o'chirmaslik» (Wake Lock).
- Cheklov: oddiy veb-sahifa — brauzer ochiq turishi kerak; telefon ekrani o'chsa yoki sahifa fonda uxlasa, budilnik kechikishi/chalinmasligi mumkin. Budilniklar brauzerda saqlanadi.

## 2.31 — tun yo'li, Messier ro'yxati, Ulug'bek osmoni, yulduz hayoti, viktorina, kalendar
- Teleskop → «Tun yo'li» (js/observer3.js): tanlangan obyekt yoki sayyoraning tun bo'yi (17:00–07:00) osmondagi yo'li: osmon gumbazi, balandlik grafigi (qorong'ilik darajasi bo'yicha fon), animatsiya va slayder, eng yaxshi kuzatish oynasi, Oy halal berishi, budilnik/ko'rish maydoni/star-hop tugmalari.
- Teleskop → «Ro'yxat»: Messier ro'yxati (katalogda 109 ta, M102 yo'q): ko'rilganlarni belgilash (brauzerda saqlanadi), jurnaldan olish, «bu kecha ko'riladigan» filtri, saralash, 🌌/🔭/📓 tugmalari.
- «Ulug'bek osmoni» (js/ulugbek.js): yorqin yulduzlarning 1437-yildagi ekliptik o'rni (HISOBLANGAN — hozirgi koordinatalardan prekessiya bilan, Ulug'bekning o'z raqamlari emas), zodiak belgisi ko'rinishida, Qutb yulduzining 1000–3000-yillar orasidagi qutbdan masofasi, nomlarning arabcha ildizlari.
- «Yulduz hayoti» (js/lifecycle.js): massa tanlanadi, gaz buluti → protoyulduz → bosh ketma-ketlik → gigant → oq mitti/neytron yulduz/qora tuynuk animatsiyasi va HR diagramma izi. SXEMATIK, taxminiy.
- Viktorina: savollar 20 dan 80 ga (data/quiz2.js), 5 bo'lim, 10/20/30 savol, har rejim uchun eng yaxshi natija, xato javoblar tahlili.
- Kuzatish kalendari: «Kelgusi 12 oy» davri, eng yaqin hodisa bannerida, har hodisa yonida ⏰ (budilnikka qo'shadi: tutilish/oy — 1 soat oldin; meteor oqimi — o'sha kuni 22:00).
- Cheklovlar: Ulug'bek jadvalida xususiy harakat hisobga olinmagan (Arkturusda ≈ 0,4° gacha farq); yulduz hayotida vaqtlar ±30–50% xato berishi mumkin, 8 va 20 massa chegaralari taxminiy; tun yo'li balandligi J2000 koordinatalaridan davr tuzatmasiz hisoblanadi (≈ 0,3° xato); animatsiyalar faqat Chromium'da sinalgan.

## 2.32 — menyu va laboratoriya qulayligi
- Chap menyu (joyi o'zgarmadi): 25+ band 5 yig'iladigan guruhga bo'lindi — 🎬 Namoyish, 🌌 Koinotni o'rganish, 🔭 Kuzatuvchiga, 📡 Jonli, ⚙ Sozlash va ma'lumot (til va yoqish/o'chirish tugmalari shu yerda). Bir vaqtda bitta guruh ochiq; oxirgi ochilgan guruh eslab qolinadi.
- Menyu ichida qidiruv (Enter — birinchi natijani ochadi) va «Oxirgi ishlatilganlar» (4 tagacha, brauzerda saqlanadi). Menyu balandligi ekranga moslanadi (ichida aylantiriladi).
- Laboratoriya (js/labgroups.js): tablar tepasida guruh tugmalari («Hammasi» ham bor) va bo'lim qidirish. Faol tab guruhi avtomatik tanlanadi. Hamma tablar avvalgidek DOM da, faqat ko'rinishi filtrlanadi.
- Cheklovlar: yangi yozuvlar (guruh nomlari, qidiruv) hozircha faqat o'zbekcha — rus/ingliz tarjimasi qo'shilmagan; telefon ko'rinishi faqat Chromium telefon rejimida (390×844) ko'rildi.

## 2.32 (qo'shimcha) — ish stoli yorlig'i (Windows)
- KOINOT_yorliq_yaratish.bat (tools/yorliq.ps1) ish stoli va Start menyusiga «KOINOT» yorlig'ini yaratadi: Chrome (bo'lmasa Edge) «ilova rejimi»da — manzil qatorisiz alohida oyna, o'z ikonkasi bilan (assets/ui/koinot.ico). KOINOT_yorliqni_olib_tashlash.bat yorliqlarni o'chiradi. Qo'llanma: YORLIQ_QOLLANMA.txt.
- Cheklovlar: skript Windows'da SINALMAGAN (sandbox Linux) — faqat ehtiyotkorlik bilan yozilgan; yorliq fayllarni o'zgartirishdan himoya QILMAYDI; papka ko'chirilsa yorliq qayta yaratilishi kerak.

## 2.33
- Kino rejimi: yulduzlar va bloom yumshatildi (ohang egri chizig‘i, yuqoriroq bloom chegarasi, spayk kuchi kamaydi, asosiy kamar kino rejimida xiraroq).
- Til: ~500 ta interfeys matni (menyu, guruhlar, laboratoriya, kuzatuvchi asboblari, budilnik, atlas, viktorina) RU/EN ga tarjima qilindi + raqam/birlik qoidalari (js/i18n2.js). Uzun ilmiy matnlar, obyekt tavsiflari va katalog nomlari o‘zbekchada qoladi.
- audio/music/music1.mp3 qo‘shildi (≈31 MB, 12:55) — musiqa shu fayldan ijro etiladi.
- «Manbalar» va «KOINOT haqida» oynalarida Dasturchi (Bunyodg97), Donat va sayt bloki.
- Telefonda keng jadvallar/qatorlar sig‘adigan bo‘ldi; skrinshot yozuvi versiyaga bog‘liq emas.

## 2.34
- Barcha emojilar (🎬 🔭 ⏰ 🌐 ⚙ … ▶ ⏸ ● ✓ va boshqalar) olib tashlandi; o‘rniga interfeysga mos 24×24 chiziqli SVG ikonkalar (js/icons.js, ~50 ta). Dinamik matnlar ham avtomatik almashadi. Select ro‘yxatlari va title/aria-label ichida ikonka ko‘rsatib bo‘lmaydi — u yerda belgi shunchaki olib tashlanadi.
- Oddiy matn belgilari (→ ← ↑ ↓ ↗ M☉ ° ᵐ) o‘z holicha qoldi.

## 2.35
- Bosh sahifa sarlavhasi «Cheksiz koinot.» deb o‘zgartirildi (RU/EN ham).
- JS/data fayllaridagi barcha izohlar (288 ta, 58 fayl) olib tashlandi; kod o‘zgarmadi, hajm ≈ 27 KB kamaydi. Vendor kutubxonalar va litsenziya izohlari tegilmadi.
