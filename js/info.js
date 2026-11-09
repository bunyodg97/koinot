(()=>{'use strict';
 if(!window.KoinotLab||!window.KX)return;const {esc}=KX;
 const SRC=[
  ['Minor Planet Center (MPC)','Asteroid, TNO va kometa orbital elementlari (PHA, NEA, Distant, Unusual, CometEls, MPCORB — asosiy kamar)','Ochiq ma’lumot — minorplanetcenter.net','https://minorplanetcenter.net/data'],
  ['OpenNGC (Mattia Verga)','NGC/IC chuqur osmon obyektlari (data/skydata.js)','CC BY-SA 4.0 — mualliflikni ko‘rsatish shart','https://github.com/mattiaverga/OpenNGC'],
  ['d3-celestial (Olaf Frohn)','Yulduzlar, turkum chiziqlari, Messier (data/skydata.js)','BSD-3-Clause','https://github.com/ofrohn/d3-celestial'],
  ['HYG Database v4.1 (David Nash / Astronexus)','Yaqin yulduzlar katalogi','CC BY-SA 4.0','https://github.com/astronexus/HYG-Database'],
  ['Astronomy Engine (Don Cross)','Planeta/Oy/Quyosh joylashuvi, vaqt, ufq koordinatalari','MIT','https://github.com/cosinekitty/astronomy'],
  ['Three.js r160','3D grafika','MIT','https://github.com/mrdoob/three.js'],
  ['Solar System Scope / INOVE','Sayyora, Oy va Quyosh teksturalari (Yer va Oy — 4K)','CC BY 4.0','https://www.solarsystemscope.com/textures/'],
  ['Local Volume Database (Pace 2024)','Mahalliy guruh galaktikalari','Ochiq GitHub katalogi','https://github.com/apace7/local_volume_database'],
  ['2MRS (Huchra va boshq., 2012)','Yaqin galaktikalar uch o‘lchamli joylashuvi (Laniakea bosqichi)','Ilmiy katalog, ochiq','https://tdc-www.harvard.edu/2mrs/'],
  ['NASA New Horizons / Cassini / Voyager / Galileo; USGS Astrogeology; NASA PDS (MOLA)','Pluton, Titan, Yevropa, Ganimed, Kallisto, Io teksturalari va Mars relyefi','Public domain (AQSh); NASA mahsulotni ma’qullamagan','https://science.nasa.gov/'],
  ['NASA / NSSDCA / JPL','Sayyora faktlari, ekzosayyoralar, yo‘ldoshlar','NASA materiallari','https://science.nasa.gov/']];
 const kv=(h,rows)=>`<h3 style="margin:14px 0 6px">${h}</h3>${rows}`;

 KX.devBlock=()=>`<div class="dev-card"><div class="dev-top"><span class="dev-ic">👨‍💻</span><div><div class="dev-k">Dasturchi</div><div class="dev-n">Bunyodg97</div></div></div><p class="dev-t">Dastur yoqqan bo‘lsa, dastur rivojlanishi uchun o‘z hissangizni qo‘shing.</p><div class="dev-btns"><a class="dev-b dev-don" href="https://www.ali-dasturchi.uz/#donat" target="_blank" rel="noopener noreferrer">💛 Donat</a><a class="dev-b" href="https://www.ali-dasturchi.uz" target="_blank" rel="noopener noreferrer">🌐 Sayt: www.ali-dasturchi.uz</a></div></div>`;
 function credits(body){
  body.innerHTML=`<div style="max-width:880px">${KX.devBlock()}<p>KOINOT quyidagi ochiq ma’lumotlar va kutubxonalarga tayanadi. Litsenziyalar ularning mualliflari belgilagan shartlarga amal qiladi.</p>
  <table class="lab-table"><tr><th>Manba</th><th>Nima uchun</th><th>Litsenziya</th></tr>${SRC.map(s=>`<tr><td><a href="${s[3]}" target="_blank" rel="noopener noreferrer">${esc(s[0])}</a></td><td>${esc(s[1])}</td><td>${esc(s[2])}</td></tr>`).join('')}</table>
  <p class="lab-note">Ilova to‘liq oflayn ishlaydi, ma’lumotlar fayllar ichida «surat» sifatida saqlangan — yangi kashfiyotlar kirmagan. Ba’zi ko‘rinishlar (Kosmik to‘r, Laniakea, spiral qo‘llar) ta’limiy sxema yoki model, kuzatuv xaritasi emas. Hisoblar (Kepler, ufq koordinatalari) taxminiy; aniq ma’lumot uchun asl manbalarga qarang. To‘liq matn: docs/MANBALAR_VA_LITSENZIYALAR.md.</p></div>`;}
 const TAG={m:['Ma’lum','#4fe39a'],t:['Taxmin','#ffcc66'],f:['Faraz','#ff8aa0']};
 const CARDS=[
  ['Kuzatiladigan koinot chegarasi','m','Chegara — yorug‘lik 13,8 mlrd yilda yetib kelgan joy. Hozirgi (kengayish hisobga olingan) masofa ≈ 46 mlrd yorug‘lik yili. Bu koinotning chekkasi emas, faqat bizning «ufqimiz» — boshqa joydan qaralsa ufq boshqa bo‘ladi.'],
  ['Undan nariroqda ham koinot davom etadimi?','t','Eng sodda va keng qabul qilingan taxmin: ha, o‘xshash galaktikalar va tuzilmalar bilan davom etadi. Kosmik mikroto‘lqin fon o‘lchovlari fazo juda tekisga yaqinligini ko‘rsatadi, bu chegara yo‘qligiga mos keladi — lekin cheksizlikni isbotlamaydi.'],
  ['Koinot cheklangan, lekin chegarasiz bo‘lishi mumkinmi?','t','Ha: yopiq (sferaga o‘xshash) yoki «tor» shaklli topologiya bo‘lishi mumkin; u holda yetarlicha uzoqqa borsangiz o‘z joyingizga qaytasiz. Hozirgi o‘lchovlar kuzatiladigan hajmda bunday takrorlanishni topmagan, shuning uchun agar shunday bo‘lsa ham, shakl kuzatiladigan hajmdan ancha katta.'],
  ['Hech qachon ko‘rinmaydigan sohalar','m','Tezlashgan kengayish tufayli bugungi ≈ 16 mlrd yorug‘lik yilidan uzoqdagi hodisalardan yuborilgan signal bizga hech qachon yetib kelmaydi (hodisa gorizonti). Uzoq kelajakda galaktikalar bizning ufqdan chiqib ketadi.'],
  ['Inflyatsiya va «pufaklar»','f','Ba’zi nazariyalarda inflyatsiya tugamasdan boshqa joylarda davom etib, ko‘p «pufak koinot» hosil qiladi (abadiy inflyatsiya, multiverse). Hozircha bu tekshirib bo‘lmaydigan gipoteza; fizik qonunlar har pufakda boshqacha bo‘lishi ham faraz.'],
  ['«Buyuk tortuvchi» oqimlar va «qorong‘u oqim»','t','Galaktikalar guruhlarining ba’zi umumiy harakatlari kuzatiladigan hajmdan tashqaridagi massa ta’siri deb talqin qilingan, lekin keyingi o‘lchovlar bunday «qorong‘u oqim»ni tasdiqlamadi. Hozircha dalil yo‘q.'],
  ['Katta portlashdan oldin nima bo‘lgan?','f','Standart model faqat juda zich-issiq holatdan keyingisini tushuntiradi. «Oldin» haqidagi g‘oyalar (siklik koinot, kvant tug‘ilish, boshqa koinotdan hosil bo‘lish) hozircha tajribada tekshirilmagan farazlardir.'],
  ['Qorong‘u materiya va qorong‘u energiya','m','Koinot energiyasining ≈ 5% oddiy modda, ≈ 27% qorong‘u materiya, ≈ 68% qorong‘u energiya — bu ta’sirlari aniq o‘lchangan, lekin ular nima ekanini hali bilmaymiz.']];
 function beyond(body){
  body.innerHTML=`<div style="max-width:860px"><p>Kuzatiladigan koinotdan tashqarida nima borligini hech kim ko‘rmagan. Quyida har bir g‘oya <b>qanchalik ishonchli</b> ekani bilan belgilangan:</p>
  <div style="display:flex;gap:10px;flex-wrap:wrap;margin:8px 0">${Object.values(TAG).map(t=>`<span style="border:1px solid ${t[1]};color:${t[1]};border-radius:99px;padding:2px 10px;font-size:12px">${t[0]}</span>`).join('')}</div>
  ${CARDS.map(c=>`<div class="lab-result" style="margin:10px 0;border-left-color:${TAG[c[1]][1]}"><b>${esc(c[0])}</b> <span style="color:${TAG[c[1]][1]};font-size:12px;margin-left:6px">${TAG[c[1]][0]}</span><br>${esc(c[2])}</div>`).join('')}
  <p class="lab-note">Ma’lum — o‘lchovlar bilan mustahkamlangan. Taxmin — asosli, lekin yakuniy emas. Faraz — hozircha tekshirib bo‘lmaydi. Sonlar yaxlitlangan.</p></div>`;}
 KX.tab('credits','Manbalar',credits);KX.tab('beyond','Ufqdan narida',beyond);
})();
