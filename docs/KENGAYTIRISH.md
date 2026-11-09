# KOINOT loyihasini kengaytirish

Build tizimi va server shart emas. Skriptlar `index.html` ichidagi tartibda klassik script sifatida yuklanadi. Lokal WebGL teksturalari uchun `data:` URL ishlatiladi; shu sabab Chrome file:// CORS cheklovi original rasmlarni bloklamaydi.

## Tuzilish

- `data/catalog.js`: ma’lumot. Fizik qiymatlar va vizual `radius/orbit` mustaqil.
- `js/math.js`: orbital matematikasi, DOM bog‘liqligi yo‘q.
- `js/scene.js`: Three.js sahna, GPU obyektlari, kamera, pointer boshqaruvi.
- `js/app.js`: o‘zbekcha UI va hodisalar. `KoinotScene(onSelect,onTick)` orqali sahna bilan bog‘lanadi.
- `assets/materials/materials.js`: tekstura cache, materiallar, atmosfera va tungi yoritish shaderi.
- `css/style.css`: desktop/tablet/telefon joylashuvlari.

## Yangi sayyora / yo‘ldosh

`KOINOT_CATALOG` oxiriga yagona `id`li yozuv qo‘shing. Mavjud yozuvni namuna qiling. Katalogdagi nomlar ishonchli lokal ishlab chiquvchi ma’lumotlari hisoblanadi, foydalanuvchi HTML’i sifatida import qilinmaydi.

```js
{
 id:'new-object', name:'Yangi obyekt', kind:'Tabiiy yo‘ldosh',
 subtitle:'Tavsif', parent:'jupiter',
 texture:'new-object.jpg', color:'#bbccee',
 radius:0.4, orbit:5, diameter:3000, distance:0.5,
 period:4.2, rotation:100.8, tilt:0, inclination:1, phase:0,
 gravity:1.2, temp:'Noma’lum', note:'Tekshirilgan tavsif', feature:'...',
 source:'https://ishonchli-manba.example/'
}
```

Bu misolning sonlari taxminiy; real obyekt uchun ishlatmang. `parent` bo‘lsa ota obyekt katalogda oldin turishi kerak. `distance` mln km, `diameter` km, `period` Yer kuni, `rotation` soat (manfiy — retrograd), burchaklardan `phase` radian, qolganlari gradus. UI hozirgi Oy uchun “Yerdan” deydi: boshqa yo‘ldosh qo‘shsangiz ota obyekt nomini avtomatik chiqarishni `app.js`ga qo‘shing. Murakkab ko‘p yulduzli gravitatsiya hisoblanmaydi.

1. JPG/PNG teksturani `assets/textures/` ga qo‘ying.
2. `python tools/build_textures.py` bajaring. Original fayllar o‘z joyida qoladi.
3. `node tools/check_project.cjs` dagi katalog soni tekshiruvini yangilang; testni bajaring.
4. Chrome’da ochib, yangi obyekt va teksturani ko‘ring.

Qo‘shimcha kutubxona kerak emas. Python faqat teksturani o‘zgartirganda ishlatiladi; foydalanuvchiga kerak emas. Rangli tekstura odatda 2:1 equirectangular xarita bo‘lsin. Alohida sayyora fotosurati to‘g‘ridan-to‘g‘ri sfera xaritasi emas.

## Yulduzlar, galaktikalar va masshtablar

`KOINOT_STAGES` kelajakdagi sahnalar metama’lumotidir; hozir mavjud bo‘lmagan sahnalarni bor deb ko‘rsatmaydi. Faqat `available:true` qilish bilan yangi sahna paydo bo‘lmaydi.

Keyingi bosqichda `js/scenes/` ichida alohida `StarScene`, `GalaxyScene`, `CosmicWebScene` modullarini yarating. Sahna boshqaruvchisida `activate`, `update`, `focus`, `resize`, `dispose` kontraktini kiriting va hozirgi `KoinotScene`ni adapter bilan ulang. `app.js` tanlash/ma’lumot hodisalari saqlanishi mumkin.

Har masshtabning o‘z birliklari (AU, parsek, megaparsek), lokal koordinata markazi va kamera chegaralari bo‘lsin. Bitta sahnaga milliardlab km koordinatalarni tashlash float aniqligi muammosini keltiradi. Sahna almashishda kamera holatini saqlang, crossfade ishlating, ortiqcha GPU material/geometriyalarni dispose qiling.

Katalog manbalari va aniqlik bayroqlari alohida saqlansin. Haqiqiy kuzatuv nuqtalari, ilmiy rekonstruksiya va dekorativ nuqtalar UI’da farqlansin. Yulduz fonidagi hozirgi procedural nuqtalar katalog emas.

Aniq sana ko‘rinishi kerak bo‘lsa, joriy doiraviy demo orbitlar o‘rniga tasdiqlangan orbital elementlar yoki ephemeris hisoblagich moduli kerak. Vaqt formatini ham real epoch bilan almashtiring.

## Tekshiruv

`node tools/check_project.cjs` CPU smoke test: renderer mock qilingan. Grafik ko‘rinishni tekshirmaydi. Haqiqiy Chrome’da quyidagilarni tekshiring:
- `index.html` ni file:// bilan ochish, internetni o‘chirib qayta yuklash;
- 10 obyekt, Saturn halqasi va Yer bulutlari;
- tanlash, fokus, g‘ildirak, sudrash, pinch, katalog/qidiruv;
- pauza va 6 xil vaqt tezligi, vaqtni tiklash;
- 1440×900, 1024×768, 390×844 o‘lchamlar;
- Console va WebGL shader xatolari yo‘qligi.

Three.js r160.1 klassik build mahalliy file:// ishlashi uchun qotirilgan. U eskirgan UMD haqida konsol ogohlantirishi beradi, bu bajarilishni to‘xtatuvchi xato emas. ESM’ga o‘tish bilan lokal HTTP server talabi qaytishi mumkin.


## 2.7: Laboratoriyaga yangi bo‘lim qo‘shish
`KX.tab('id','Nomi',body=>{ body.innerHTML='…'; KoinotLab.state.labTick=dt=>{…}; })` — js/extras-core.js orqali `KoinotLab.register` chaqiriladi.
Yangi modulni index.html da js/explorer.js dan keyin ulang. Ma’lumotlar: data/extras.js (yulduzlar, kometalar, missiyalar, viktorina), data/exoplanets.js (yangi tizim: `[harf, davr(kun), a(AU), radius(Yer), massa(Yer)]`).
Tarjima lug‘ati: js/i18n.js ichidagi `D` obyekti (uz → [ru, en]).
