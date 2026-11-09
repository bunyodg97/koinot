(()=>{'use strict';
 const app=window.koinot,j=app?.journey;if(!app||!j)return;
 const $=(s,r=document)=>r.querySelector(s);
 const KIND={
  m:['O‘lchangan','#5ee0a0','Kuzatuv, kosmik apparat yoki katalogdan olingan o‘lchov natijasi.'],
  h:['Hisoblangan','#58b8ff','O‘lchangan elementlardan formula yoki model bilan hisoblangan (masalan, sana bo‘yicha joylashuv).'],
  t:['Taxminiy','#ffc65a','Soddalashtirilgan yoki ko‘rgazmali: o‘lcham, masofa yoki ko‘rinish aniq emas.'],
  s:['Simulyatsiya','#c58cff','Fizik yoki statistik modelning natijasi — haqiqiy xarita yoki surat emas.']};
 const STAGE=[
  [['m','Yer o‘lchami va shakli (NASA ma’lumoti)'],['m','Yulduzlar yo‘nalishi: ≈5000 yulduz va turkumlar (katalog, J2000)'],['t','Yer yuzasi — badiiy ishlov berilgan tekstura xaritasi']],
  [['t','Sayyora joylashuvi — namoyish orbitalari, sanaga bog‘liq emas (sana rejimi: «Masshtab / sana»)'],['t','MASSHTAB ko‘rgazmali: sayyoralar ancha kattalashtirilgan, masofalar siqilgan'],['h','Asteroid, kentavr, TNO, asosiy kamar: bugungi sanaga hisoblangan (MPC elementlari, Kepler)'],['m','Sayyora o‘lchamlari va massalari (NASA)']],
  [['m','Yulduzlar: joylashuvi, masofasi, yorqinligi — HYG katalogi'],['t','Yulduz rangi va yorqinlik ko‘rinishi soddalashtirilgan']],
  [['t','Somon Yo‘li — kuzatuvlarga asoslangan MODEL: ichki tuzilishi taxminiy (tashqaridan haqiqiy surat yo‘q)'],['s','Yulduz zarrachalari tasodifiy hosil qilingan']],
  [['h','Galaktikalar masofasi masofa moduli orqali hisoblangan (Local Volume Database)'],['s','Galaktikalarning ichki shakli — sxematik zarrachalar']],
  [['h','Masofa qizil siljishdan hisoblangan (2MRS, H0 = 70 km/s/Mpk)'],['t','Laniakea chegarasi va oqimlari — sxematik']],
  [['s','Kosmik to‘r — ΛCDM simulyatsiyasi (Zel’dovich yaqinlashuvi); haqiqiy xarita EMAS']],
  [['h','Masofa qobiqlari — Planck 2018 kosmologiyasi bo‘yicha hisoblangan'],['s','KMF (reliktiv nurlanish) — simulyatsiya; haqiqiy Planck xaritasi emas']]];
 const DETAIL={
  star:[['m','Yulduz ma’lumoti — HYG katalogi'],['t','Yulduz sirti va o‘lchami badiiy; rang spektr sinfiga taxminan mos']],
  galaxy:[['h','Masofa — Local Volume Database (hisoblangan)'],['s','Galaktika shakli — sxematik zarrachalar, fotosurat emas']],
  system:[['m','Orbita va sayyora o‘lchamlari — NASA Exoplanet Archive (yaxlitlangan)'],['t','Sayyora yuzasi va orbital fazasi — xayoliy, haqiqiy tasviri yo‘q']]};

 const SURF_M=new Set(['pluto','europa','ganymede','io','callisto']);
 const POS_T=new Set(['europa','ganymede','titan','enceladus','ceres','io','callisto']);
 function bodyItems(id,d){
  const L=window.KoinotLab?.state,real=!!app.realScale,date=!!L?.dateMode;
  const out=[];
  out.push(real||date?(POS_T.has(id)?['t','Joylashuv: doiraviy taxminiy orbita (efemerida yo‘q)']:['h','Joylashuv: Astronomy Engine (sana bo‘yicha hisoblangan)']):['t','Joylashuv: namoyish orbitasi (sana bilan bog‘liq emas)']);
  out.push(real?['m','O‘lcham: haqiqiy masshtab']:['t','O‘lcham: ko‘rgazmali (kattalashtirilgan)']);
  out.push(['m','Fizik ma’lumotlar (diametr, massa…): NASA ma’lumotnomasi']);
  out.push(SURF_M.has(id)?['m','Sirt xaritasi: kosmik apparat mozaikasi']:id==='titan'?['t','Sirt xaritasi: infraqizil — rangi taxminiy']:['t','Sirt xaritasi: badiiy ishlov berilgan (Solar System Scope, NASA ma’lumotiga asoslangan)']);
  return out;}
 const TAB={scale:['h','t'],compare:['m'],light:['h'],eclipse:['h'],layers:['t'],stars:['m'],orion:['m','t'],sky:['m','h'],cal:['h'],hr:['m'],calc:['h'],small:['m','t'],missions:['m'],uz:['m'],bh:['s','t'],melon:['h','t'],smallbodies:['h'],mainbelt:['h'],tonight:['h','t'],galatlas:['m','t','s'],ulugbek:['h','t'],life:['s','t'],quiz:['m'],scope:['h','t'],live:['m','h','t'],guide:[],video:[]};
 const TABNOTE={ulugbek:'Ulug‘bek davri koordinatalari — hozirgi katalogdan prekessiya bilan HISOBLANGAN (Ulug‘bekning o‘z raqamlari emas); xususiy harakat hisobga olinmagan; nomlar etimologiyasi umumiy qabul qilingan, ayrimlari bahsli.',life:'Sxematik model: oddiy bog‘lanishlar bilan hisoblangan, taxminiy (vaqtlar ±30–50%, chegaralar 8 va 20 massa ham taxminiy).',quiz:'Savollar umumiy ma’lum faktlarga asoslangan; raqamlar yaxlitlangan.',live:'Quyosh va ISS joyi — tashqi manbalardan (NOAA, NASA, wheretheiss.at); ISS o‘tishlari va komet o‘rni — shu yerda hisoblangan; komet yorqinligi taxminiy.',scope:'Joylashuv — hisoblangan (Astronomy Engine); yorqinlik chegarasi, qiyinlik, mos okulyar va star-hop yo‘li — taxminiy qoidalar.',scale:'Joylashuv: sana rejimida hisoblangan; rejimsiz — namoyish. Haqiqiy masshtab yoqilganda o‘lcham va masofa mutanosib.',compare:'O‘lchamlar — NASA ma’lumotnomasi.',light:'Yorug‘lik vaqti — masofadan hisoblangan.',eclipse:'Tutilishlar Astronomy Engine bilan hisoblanadi.',layers:'Quyosh ichki qatlamlari — soddalashtirilgan model sxemasi.',stars:'Katalog (HYG) qiymatlari; yulduz ko‘rinishi taxminiy.',orion:'Yulduz joylashuvi katalogdan; tarmoq shakli — tasavvur uchun.',sky:'Yulduzlar — katalog; joylashuv — hisoblangan.',cal:'Hodisalar sanasi hisoblangan.',hr:'Yulduz parametrlari — katalogdan.',calc:'Formulalar bo‘yicha hisoblagich.',small:'Ma’lumot — o‘lchangan; ko‘rinishi sxematik.',missions:'Tarixiy ma’lumot — ochiq manbalardan.',uz:'Tarixiy/ma’lumotli bo‘lim.',bh:'Shvartsshild modeli: rang va yorqinlik badiiy; haqiqiy EHT tasvirlaridan farq qiladi.',melon:'Hamma o‘lcham/masofa haqiqiy qiymatdan bir xil koeffitsiyent bilan; buyum rasmlari taxminiy.',smallbodies:'MPC elementlari + Kepler hisobi (planetalar ta’siri hisobga olinmagan).',tonight:'Quyosh, Oy va sayyoralar — hisoblangan; meteor yomg‘irlari jadvali — taxminiy.',mainbelt:'MPCORB elementlari + Kepler hisobi; diametr H dan taxminiy.'};
 const chipHTML=(k,on)=>`<span class="prov-chip" style="--pc:${KIND[k][1]}" data-k="${k}">${KIND[k][0]}</span>`;
 function uniqKinds(items){const o=[];for(const [k] of items)if(!o.includes(k))o.push(k);return o;}

 const bar=document.createElement('div');bar.id='provBar';bar.hidden=true;bar.setAttribute('role','button');bar.tabIndex=0;bar.title='Nima o‘lchangan, nima hisoblangan — bosing';document.body.append(bar);
 const pop=document.createElement('div');pop.id='provPop';pop.hidden=true;document.body.append(pop);
 let ctx={key:'',title:'',items:[]},legendOnly=false;
 function legend(){return Object.values(KIND).map(([n,c,t])=>`<div class="pp-leg"><span class="prov-chip" style="--pc:${c}">${n}</span> ${t}</div>`).join('');}
 function renderPop(){pop.innerHTML=`<button class="pp-x" aria-label="Yopish">×</button>${legendOnly?'<b>Belgilar nima degani</b>':`<b>${ctx.title}</b>`}<div class="pp-list">${(legendOnly?[]:ctx.items).map(([k,t])=>`<div class="pp-item"><span class="prov-chip" style="--pc:${KIND[k][1]}">${KIND[k][0]}</span><span>${t}</span></div>`).join('')}</div><details><summary>Belgilar nima degani?</summary>${legend()}</details><small>Batafsil manbalar: Menyu → «Manbalar va litsenziyalar».</small>${legendOnly?'':'<div id="ppExtra"></div>'}`;extra();$('.pp-x',pop).onclick=()=>{pop.hidden=true;};}

 const AU_KM=149597870.7,SUN_D=1392700,PLN=[['sun','Quyosh'],['mercury','Merkuriy'],['venus','Venera'],['earth','Yer'],['mars','Mars'],['jupiter','Yupiter'],['saturn','Saturn'],['uranus','Uran'],['neptune','Neptun']];
 const lightT=s=>{if(s<90)return s.toFixed(0)+' soniya';if(s<5400)return Math.floor(s/60)+' daqiqa '+Math.round(s%60)+' soniya';return (s/3600).toFixed(1)+' soat';};
 function setReal(v){const L=window.KoinotLab;if(!L)return;L.state.real=!!v;L.applyMode();const cb=document.querySelector('#realScale');if(cb)cb.checked=!!v;ctx.key='';tick();}

 function extra(){
  const el=$('#ppExtra',pop);if(!el||legendOnly)return;const real=!!app.realScale;
  if(j.active){if(ctx.key==='s:1'){el.innerHTML='<button class="pp-btn" id="ppReal">⚖ Haqiqiy masshtabda ko‘rish</button><small>Sayohat — ko‘rgazmali masshtab. Haqiqiy nisbat Quyosh sistemasi sahnasida.</small>';$('#ppReal',pop).onclick=()=>{pop.hidden=true;j.stop();setTimeout(()=>setReal(true),250);};}else el.innerHTML='';return;}
  el.innerHTML=`<button class="pp-btn" id="ppReal">${real?'↩ Ko‘rgazmali masshtabga qaytish':'⚖ Haqiqiy masshtabga o‘tish'}</button>${real?`<div id="rsLive" class="rs-live"></div><div class="rs-b">${PLN.map(([id,n])=>`<button data-id="${id}">${n}</button>`).join('')}</div><small>Haqiqiy masshtabda sayyoralar nuqtaday: Quyosh diametri ≈ 109 Yer diametri, Yer–Quyosh masofasi ≈ 107 Quyosh diametri. Nomni tanlab yaqinlashing.</small>`:'<small>Haqiqiy masshtabda o‘lcham ham, masofa ham bir nisbatda; sayyoralar juda kichik ko‘rinadi.</small>'}`;
  $('#ppReal',pop).onclick=()=>setReal(!real);
  el.querySelectorAll('.rs-b button').forEach(b=>b.onclick=()=>window.koinotSelect(b.dataset.id,true));liveReal();}
 function liveReal(){const el=$('#rsLive',pop);if(!el||!app.realScale)return;const au=app.currentDistance/30,km=au*AU_KM,id=app.selected,b=app.bodies.get(id);const sunAu=b?b.group.position.length()/30:0;
  el.innerHTML=`<b>Kamera:</b> ${au>=.01?au.toFixed(3)+' AU':(km>=1e6?(km/1e6).toFixed(2)+' mln km':Math.round(km).toLocaleString('uz')+' km')} · yorug‘lik ${lightT(km/299792.458)}<br><b>${(b?.data?.name)||id}:</b> Quyoshdan ≈ ${sunAu.toFixed(2)} AU (${(sunAu*AU_KM/1e6).toFixed(0)} mln km), yorug‘lik ${lightT(sunAu*AU_KM/299792.458)}`;}
 const toggle=()=>{legendOnly=false;pop.hidden=!pop.hidden;if(!pop.hidden)renderPop();};
 bar.onclick=toggle;bar.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}};
 document.addEventListener('keydown',e=>{if(e.key==='Escape')pop.hidden=true;});
 window.KX=window.KX||{};window.KX.prov={KIND,STAGE,openLegend:()=>{legendOnly=true;pop.hidden=false;renderPop();$('details',pop).open=true;}};
 const stages=['Yer','Quyosh sistemasi','Orion tarmog‘i','Somon Yo‘li','Mahalliy guruh','Laniakea','Kosmik to‘r','Kuzatiladigan koinot'];
 function context(){
  const ex=window.KoinotExplorer,st=ex?.state;
  if(j.active&&ex?.detail?.active&&DETAIL[st.kind==='planet'?'system':st.kind])return {key:'d:'+st.kind+st.id,title:{star:'Yulduz',galaxy:'Galaktika',system:'Ekzosayyora tizimi',planet:'Ekzosayyora'}[st.kind]||'Obyekt',items:DETAIL[st.kind==='planet'?'system':st.kind]};
  if(j.active){const s=Math.max(0,Math.min(7,Math.round(j.q||0)));return {key:'s:'+s,title:stages[s],items:STAGE[s]};}
  const L=window.KoinotLab?.state,real=!!app.realScale,date=!!L?.dateMode;
  return {key:'o:'+real+date,real,title:real?'Haqiqiy masshtab':'Ko‘rgazmali masshtab',items:real?[['m','O‘lcham va masofa mutanosib (1 birlik = 1/30 AU)'],['h',date?'Joylashuv: tanlangan sana bo‘yicha hisoblangan (Astronomy Engine)':'Joylashuv: hozirgi/boshlang‘ich sana bo‘yicha hisoblangan (Astronomy Engine)'],['m','Fizik ma’lumotlar: NASA']]:[['t','Masofa va o‘lcham ko‘rgazmali — haqiqiy nisbatda emas'],[date?'h':'t',date?'Joylashuv: sana bo‘yicha hisoblangan':'Orbital fazalar namoyish uchun'],['m','Fizik ma’lumotlar: NASA']]};
 }

 const row=document.createElement('div');row.id='provRow';row.className='prov-row';const noteEl=$('#objectNote');if(noteEl)noteEl.after(row);
 let rowKey='';
 function panel(){const id=app.selected;if(!row.isConnected)return;const key=id+'|'+(app.realScale?1:0)+'|'+(window.KoinotLab?.state?.dateMode?1:0);if(key===rowKey)return;rowKey=key;const d=window.KOINOT_CATALOG?.find(x=>x.id===id);if(!d){row.innerHTML='';return;}
  row.innerHTML='<div class="pr-t">Ma’lumot darajasi</div>'+bodyItems(id,d).map(([k,t])=>`<div class="pr-i"><span class="prov-chip" style="--pc:${KIND[k][1]}">${KIND[k][0]}</span><span>${t}</span></div>`).join('');}

 let labKey='';
 function lab(){const dlg=window.KoinotLab?.dialog;if(!dlg||!dlg.open)return;const b=$('.lab-tabs button.active'),body=$('.lab-body');if(!b||!body)return;const id=b.dataset.lab;if(!(id in TAB))return;
  if(body.querySelector(':scope > .prov-lab[data-id="'+id+'"]'))return;const el=document.createElement('div');el.className='prov-lab';el.dataset.id=id;
  el.innerHTML=`${TAB[id].map(k=>chipHTML(k)).join('')}<span class="pl-t">${TABNOTE[id]||''}</span>`;el.onclick=()=>window.KX.prov.openLegend();body.prepend(el);}

 function tick(){
  try{const c=context();if(c.key!==ctx.key){ctx=c;bar.innerHTML=uniqKinds(c.items).map(k=>chipHTML(k)).join('')+'<span class="pb-i">ⓘ</span>';if(!pop.hidden&&!legendOnly)renderPop();}
   const cinema=document.body.classList.contains('cinema');bar.hidden=cinema||!!document.querySelector('dialog[open]');if(cinema||bar.hidden)pop.hidden=true;
   if(innerWidth>800){const mb=$('.mode-banner');if(mb&&mb.offsetParent&&!j.active){const r=mb.getBoundingClientRect();bar.style.left=Math.round(r.right+12)+'px';bar.style.top=Math.round(r.top-8)+'px';}else{bar.style.left='';bar.style.top='';}}
   if(!pop.hidden){const r=bar.getBoundingClientRect();if(innerWidth>800){pop.style.left=Math.round(r.left)+'px';pop.style.top=Math.round(r.bottom+8)+'px';}}
   if(!pop.hidden&&!legendOnly)liveReal();
   const sm=$('.scene-bottom small');if(sm){if(!sm.dataset.o)sm.dataset.o=sm.textContent;if(app.realScale&&!j.active){if(!sm.dataset.r){sm.dataset.r=1;sm.textContent='O‘lcham va masofalar haqiqiy masshtabda · 1 birlik = 1/30 AU';}}else if(sm.dataset.r){delete sm.dataset.r;sm.textContent=sm.dataset.o;}}
   panel();lab();}catch(e){}
 }
 Object.assign(window.KX.prov,{setReal,toggleReal:()=>setReal(!window.KoinotLab?.state?.real)});
 setInterval(tick,350);tick();
})();
