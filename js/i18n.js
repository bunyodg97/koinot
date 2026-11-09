(()=>{'use strict';
 const app=window.koinot;if(!app)return;
 const {$,fmt,pad}=KX;
 const D={
  'Quyosh sistemasi':['Солнечная система','Solar System'],'Galaktikalar':['Галактики','Galaxies'],'Galaktikalar +':['Галактики +','Galaxies +'],'Yulduzlar':['Звёзды','Stars'],'Yulduzlar +':['Звёзды +','Stars +'],
  'Interaktiv 3D atlas':['Интерактивный 3D-атлас','Interactive 3D atlas'],'Bir yulduz. Sakkiz sayyora.':['Одна звезда. Восемь планет.','One star. Eight planets.'],'Cheksiz':['Бесконечная','Infinite'],'koinot.':['Вселенная.','cosmos.'],'Cheksiz qiziqish.':['Бесконечное любопытство.','Endless curiosity.'],
  'KASHFIYOTNI BOSHLANG':['НАЧНИТЕ ОТКРЫТИЕ','START EXPLORING'],'Oyga sayohat':['Полёт к Луне','Trip to the Moon'],'Sayohat':['Путешествие','Journey'],'Nomlar':['Названия','Labels'],'Orbitalar':['Орбиты','Orbits'],'Yaqinlashtirish':['Приблизить','Zoom in'],'Uzoqlashtirish':['Отдалить','Zoom out'],
  'Vaqt tezligi':['Скорость времени','Time speed'],'SIMULYATSIYA VAQTI':['ВРЕМЯ СИМУЛЯЦИИ','SIMULATION TIME'],'Kun / soniya':['дней / сек','days / sec'],'Qayta urinish':['Повторить','Retry'],
  'QUYOSH SISTEMASI':['СОЛНЕЧНАЯ СИСТЕМА','SOLAR SYSTEM'],'TOSHLI SAYYORA':['ТВЁРДАЯ ПЛАНЕТА','ROCKY PLANET'],'YER':['ЗЕМЛЯ','EARTH'],'3D KO‘RINISH':['3D-ВИД','3D VIEW'],'3D · LOKAL':['3D · ЛОКАЛЬНО','3D · LOCAL'],
  'Koinotga tayyorlanmoqda…':['Подготовка к космосу…','Preparing for space…'],'Mahalliy teksturalar yuklanmoqda':['Загрузка локальных текстур','Loading local textures'],'3D grafika ishga tushmadi':['3D-графика не запустилась','3D graphics failed to start'],
  'Quyosh sistemasi · umumiy ko‘rinish':['Солнечная система · общий вид','Solar System · overview'],'O‘lcham va masofalar shartli · orbital fazalar namoyish uchun':['Размеры и расстояния условны · орбитальные фазы для демонстрации','Sizes and distances are schematic · orbital phases are illustrative'],
  'Ma’lumot:':['Данные:','Source:'],'Boshlash / pauza (Space)':['Старт / пауза (Space)','Play / pause (Space)'],'Vaqtni tiklash':['Сбросить время','Reset time'],'Atlas bo‘limlari':['Разделы атласа','Atlas sections'],'Kamerani tiklash':['Сбросить камеру','Reset camera'],
  'Vaqtni boshiga qaytarish':['Вернуть время в начало','Rewind time'],'Obyektni qidirish':['Поиск объекта','Search object'],'Sayyora, yulduz, galaktika…':['Планета, звезда, галактика…','Planet, star, galaxy…'],'Sozlamalar':['Настройки','Settings'],'Asboblar':['Инструменты','Tools'],'Yopish':['Закрыть','Close'],'To‘liq ekran':['Полный экран','Fullscreen'],
  'Bosh ko‘rinish':['Главный вид','Home view'],'Obyektlar katalogi':['Каталог объектов','Object catalogue'],'Kengaytirish bosqichlari':['Этапы расширения','Expansion stages'],'Yordam va manbalar':['Справка и источники','Help and sources'],'Tezkor obyekt tanlash':['Быстрый выбор объекта','Quick object select'],
  'Ma’lumot panelini yig‘ish':['Свернуть панель','Collapse panel'],'Harakatni boshlash':['Запустить движение','Start motion'],'KOINOT haqida':['О KOINOT','About KOINOT'],
  '✦ Laboratoriya':['✦ Лаборатория','✦ Laboratory'],'↗ Erkin parvoz':['↗ Свободный полёт','↗ Free flight'],'Koinotni o‘rganing':['Исследуйте космос','Explore the cosmos'],
  'Masshtab / sana':['Масштаб / дата','Scale / date'],'Solishtirish':['Сравнение','Compare'],'Yorug‘lik':['Свет','Light'],'Tutilish':['Затмение','Eclipse'],'Quyosh ichida':['Внутри Солнца','Inside the Sun'],'Yaqin yulduzlar':['Ближайшие звёзды','Nearby stars'],'Orion tarmog‘i':['Рукав Ориона','Orion Arm'],'Ekskursiya':['Экскурсия','Tour'],'Video studiya':['Видеостудия','Video studio'],
  'Osmon xaritasi':['Карта неба','Sky map'],'Kuzatish kalendari':['Календарь наблюдений','Observing calendar'],'HR diagramma':['Диаграмма Г–Р','HR diagram'],'Hisoblagichlar':['Калькуляторы','Calculators'],'Asteroid va kometalar':['Астероиды и кометы','Asteroids & comets'],'Missiyalar':['Миссии','Missions'],'O‘zbekiston va koinot':['Узбекистан и космос','Uzbekistan & cosmos'],'Viktorina':['Викторина','Quiz'],'Qora tuynuk':['Чёрная дыра','Black hole'],'Ulashish va sozlash':['Поделиться и настройки','Share & settings'],
  'Shahar':['Город','City'],'Boshqa joy…':['Другое место…','Other place…'],'Hozir':['Сейчас','Now'],'−1 soat':['−1 час','−1 hour'],'+1 soat':['+1 час','+1 hour'],'▶ Harakat':['▶ Движение','▶ Animate'],'❚❚ To‘xtatish':['❚❚ Стоп','❚❚ Stop'],'Turkum chiziqlari':['Линии созвездий','Constellation lines'],
  'Jism':['Тело','Body'],'Kattalik':['Звёздная величина','Magnitude'],'Chiqishi':['Восход','Rise'],'Botishi':['Закат','Set'],'Balandlik':['Высота','Altitude'],'Holat':['Статус','Status'],'Quyosh':['Солнце','Sun'],'Oy':['Луна','Moon'],'Merkuriy':['Меркурий','Mercury'],'Venera':['Венера','Venus'],'Yer':['Земля','Earth'],'Mars':['Марс','Mars'],'Yupiter':['Юпитер','Jupiter'],'Saturn':['Сатурн','Saturn'],'Uran':['Уран','Uranus'],'Neptun':['Нептун','Neptune'],
  'Ko‘rinadi':['Видно','Visible'],'Ufq ostida':['Под горизонтом','Below horizon'],'Kunduz':['День','Daytime'],'To‘liq qorong‘u':['Полная темнота','Full dark'],
  'Yil':['Год','Year'],'Turi':['Тип','Type'],'Hammasi':['Все','All'],'Tutilishlar':['Затмения','Eclipses'],'Sayyoralar':['Планеты','Planets'],'Oy fazalari':['Фазы Луны','Moon phases'],'Meteor oqimlari':['Метеорные потоки','Meteor showers'],'Fasllar':['Сезоны','Seasons'],'Hodisa':['Событие','Event'],'Tafsilot':['Подробности','Details'],
  'Yangi oy':['Новолуние','New Moon'],'Birinchi chorak':['Первая четверть','First quarter'],'To‘lin oy':['Полнолуние','Full Moon'],'Oxirgi chorak':['Последняя четверть','Last quarter'],
  'Bahorgi tengkunlik':['Весеннее равноденствие','March equinox'],'Yozgi quyosh turishi':['Летнее солнцестояние','June solstice'],'Kuzgi tengkunlik':['Осеннее равноденствие','September equinox'],'Qishki quyosh turishi':['Зимнее солнцестояние','December solstice'],
  '3D yulduz xaritasida ochish':['Открыть на 3D-карте звёзд','Open in 3D star map'],'Mashhur yulduz nomlari':['Названия ярких звёзд','Bright star names'],'Hisoblagich':['Калькулятор','Calculator'],
  'Qochish va orbital tezlik':['Скорость убегания и орбитальная','Escape & orbital velocity'],'Gomann ko‘chishi':['Гомановский перелёт','Hohmann transfer'],'Qora tuynuk (Shvartsshild)':['Чёрная дыра (Шварцшильд)','Black hole (Schwarzschild)'],'Maxsus nisbiylik (vaqt sekinlashuvi)':['СТО (замедление времени)','Special relativity (time dilation)'],'Yashash zonasi va muvozanat harorati':['Зона обитаемости и температура','Habitable zone & temperature'],'Kepler uchinchi qonuni':['Третий закон Кеплера','Kepler’s third law'],'Qizil siljish va masofa':['Красное смещение и расстояние','Redshift & distance'],'Boshqa jismda vazningiz':['Ваш вес на других телах','Your weight elsewhere'],
  'Ko‘rinish radiusi':['Радиус вида','View radius'],'Avto':['Авто','Auto'],'Qidirish':['Поиск','Search'],'Keyingisi →':['Далее →','Next →'],'Qayta boshlash':['Начать заново','Restart'],
  'Samarqanddan osmonni ko‘rish':['Небо над Самаркандом','See the sky from Samarkand'],'Toshkentdan osmonni ko‘rish':['Небо над Ташкентом','See the sky from Tashkent'],
  '📷 Skrinshot':['📷 Скриншот','📷 Screenshot'],'🔗 Havola':['🔗 Ссылка','🔗 Link'],'Skrinshot (PNG)':['Скриншот (PNG)','Screenshot (PNG)'],'Havolani nusxalash':['Копировать ссылку','Copy link'],
  'Yengil':['Лёгкий','Light'],'O‘rta':['Средний','Medium'],'Yuqori':['Высокий','High'],'Grafika sifati':['Качество графики','Graphics quality'],'Til':['Язык','Language'],'Boshqarish':['Управление','Controls'],
  'Boshqaruv':['Управление','Controls'],'Ilmiy aniqlik':['Научная точность','Scientific accuracy'],'Manbalar va huquqlar':['Источники и права','Sources and licences'],'Katalog':['Каталог','Catalogue'],
  'Tafsilot kartalari':['Карточки','Detail cards'],'Qayerdaman':['Где я','Where am I'],'Yerga qaytish':['Вернуться на Землю','Back to Earth']
 };
 let lang='uz';const orig=new WeakMap(),origAttr=new WeakMap();const ATTRS=['aria-label','title','placeholder'];
 const tr=(s,l)=>{const k=s.trim();const v=D[k];if(v)return s.replace(k,v[l==='ru'?0:1]);const R=window.KX&&KX.i18n&&KX.i18n.rules;if(R){const r=R(k,l);if(r&&r!==k)return s.replace(k,r);}return null;};
 function node(n){
  if(n.nodeType===3){const t=orig.has(n)?orig.get(n):n.nodeValue;const o=lang==='uz'?t:(tr(t,lang)??t);if(!orig.has(n)&&o===t&&lang!=='uz')return;if(!orig.has(n))orig.set(n,t);if(n.nodeValue!==o){busy=true;n.nodeValue=o;}}
  else if(n.nodeType===1){if(['SCRIPT','STYLE','CANVAS'].includes(n.tagName))return;for(const a of ATTRS){if(!n.hasAttribute(a))continue;let m=origAttr.get(n);if(!m){m={};origAttr.set(n,m);}if(!(a in m))m[a]=n.getAttribute(a);const o=lang==='uz'?m[a]:(tr(m[a],lang)??m[a]);if(n.getAttribute(a)!==o){busy=true;n.setAttribute(a,o);}}n.childNodes.forEach(node);}
 }
 let busy=false;
 const mo=new MutationObserver(list=>{if(lang==='uz')return;if(busy){busy=false;}for(const m of list){if(m.type==='characterData'){const o=orig.get(m.target);if(o!==undefined&&m.target.nodeValue===(tr(o,lang)??o))continue;orig.delete(m.target);node(m.target);}else m.addedNodes.forEach(node);}});
 mo.observe(document.body,{subtree:true,childList:true,characterData:true});
 function setLang(l){lang=l;document.documentElement.lang=l;try{localStorage.setItem('koinot-lang',l);}catch(e){}node(document.body);sel.value=l;}

 const launch=$('.lab-launch')||$('#viewport');
 const sel=document.createElement('select');sel.id='langSel';sel.setAttribute('aria-label','Til');sel.innerHTML='<option value="uz">UZ</option><option value="ru">RU</option><option value="en">EN</option>';
 const shot=document.createElement('button');shot.id='shotBtn';shot.textContent='📷 Skrinshot';
 const link=document.createElement('button');link.id='linkBtn';link.textContent='🔗 Havola';
 launch.append(shot,link,sel);
 const toast=m=>{const t=$('#toast');if(t){t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2600);}};
 function screenshot(){
  try{const src=app.canvas,c=document.createElement('canvas');c.width=src.width;c.height=src.height;const x=c.getContext('2d');x.drawImage(src,0,0);
   const name=document.querySelector('#sceneTitle, .scene-title')?.textContent?.trim().split('\n')[0]||'KOINOT';const s=Math.max(1,c.width/1400);
   x.fillStyle='#000a';x.fillRect(0,c.height-46*s,c.width,46*s);x.fillStyle='#fff';x.font=`${18*s}px system-ui,sans-serif`;x.fillText('KOINOT · '+name+' · '+KX.stamp(new Date())+' (UTC+5)',16*s,c.height-17*s);
   c.toBlob(b=>{if(!b){toast('Skrinshot olinmadi.');return;}const a=document.createElement('a'),u=URL.createObjectURL(b);a.href=u;a.download='koinot_'+Date.now()+'.png';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);toast('Skrinshot yuklab olindi.');},'image/png');
  }catch(e){toast('Skrinshot olinmadi: '+e.message);}
 }
 function shareURL(){const u=new URL(location.href.split('#')[0]);const p=new URLSearchParams();if(app.selected)p.set('o',app.selected);if(lang!=='uz')p.set('l',lang);if(Number.isFinite(app.days)&&app.days)p.set('d',Math.round(app.days));return u.href+(p.toString()?'#'+p:'');}
 async function copyLink(){const u=shareURL();try{await navigator.clipboard.writeText(u);toast('Havola nusxalandi.');}catch(e){window.prompt('Havolani nusxalang:',u);}}
 shot.onclick=screenshot;link.onclick=copyLink;sel.onchange=()=>setLang(sel.value);

 let auto=false;try{auto=localStorage.getItem('koinot-autofps')==='1';}catch(e){}
 let frames=0,acc=0,lowered=false;const prevAfter=app.afterFrame;
 app.afterFrame=(dt,...rest)=>{prevAfter?.(dt,...rest);if(!auto||lowered||document.hidden||dt>.5)return;frames++;acc+=dt;if(acc>=3){const fps=frames/acc;frames=0;acc=0;if(fps<24){lowered=true;try{app.setQuality('low');}catch(e){}toast('FPS past ('+Math.round(fps)+') — grafika «Yengil» rejimga o‘tkazildi.');}}};
 KX.tab('share','Ulashish va sozlash',body=>{body.innerHTML=`<div class="lab-row"><button id="shShot">Skrinshot (PNG)</button><button id="shLink">Havolani nusxalash</button><label>Til <select id="shLang"><option value="uz">O‘zbekcha</option><option value="ru">Русский</option><option value="en">English</option></select></label></div><div class="lab-result" id="shUrl"></div><div class="lab-row"><label><input id="shAuto" type="checkbox" ${auto?'checked':''}> Avto FPS: kadr tezligi past bo‘lsa grafikani avtomatik yengillashtirish</label></div><p class="lab-note">Skrinshot hozirgi 3D sahnadan olinadi (Laboratoriya oynasi yopiladi). Havola tanlangan sayyora/yo‘ldosh, simulyatsiya vaqti va tilni saqlaydi; ZIP dan chiqarilgan papka ichida (file://) ham ishlaydi, lekin boshqa kompyuterda KOINOT shu papka bilan ochilgan bo‘lishi kerak. Til: tugmalar, sarlavhalar va bo‘lim nomlari tarjima qilinadi; uzun ilmiy matnlar va obyekt tavsiflari o‘zbekchada qoladi. Avto FPS faqat bir marta, pastga tushiradi.</p>`;$('#shLang',body).value=lang;$('#shLang',body).onchange=e=>{setLang(e.target.value);KoinotLab.render('share');};$('#shUrl',body).textContent=shareURL();$('#shShot',body).onclick=()=>{KoinotLab.dialog.close();setTimeout(screenshot,350);};$('#shLink',body).onclick=copyLink;$('#shAuto',body).onchange=e=>{auto=e.target.checked;lowered=false;frames=0;acc=0;try{localStorage.setItem('koinot-autofps',auto?'1':'0');}catch(err){}};});

 let start='uz',hash=new URLSearchParams(location.hash.slice(1));try{start=localStorage.getItem('koinot-lang')||'uz';}catch(e){}
 if(hash.get('l'))start=hash.get('l');if(!['uz','ru','en'].includes(start))start='uz';
 const apply=()=>{if(start!=='uz')setLang(start);const o=hash.get('o');if(o&&window.koinotSelect&&KOINOT_CATALOG.some(d=>d.id===o)){try{window.koinotSelect(o,false);}catch(e){}}const d=+hash.get('d');if(d&&Number.isFinite(d)){app.days=d;try{app.updatePositions();}catch(e){}}};
 setTimeout(apply,400);
 KX.i18n={D,setLang,get lang(){return lang;},shareURL,screenshot};
})();
