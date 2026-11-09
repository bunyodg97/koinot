(()=>{'use strict';
 if(!window.KoinotLab)return;
 const {$,esc,fmt,hidpi}=KX;

 const T0={O:40000,B:30000,A:9700,F:7300,G:6000,K:5200,M:3850},ORDER=['O','B','A','F','G','K','M'],TEND={O:30000,B:9700,A:7300,F:6000,G:5200,K:3850,M:2300};
 function teff(spect){
  if(!spect)return null;let s=spect.trim();
  if(s[0]==='D'){const m=/^D[A-Z]*(\d(?:\.\d)?)/.exec(s),n=m?+m[1]:null;return {t:n?Math.min(50000,50400/n):null,wd:true};}
  s=s.replace(/^(sd|d|esd)/,'');const m=/^([OBAFGKMkm])\s*(\d(?:\.\d)?)?/.exec(s);if(!m)return null;const c=m[1].toUpperCase();if(!T0[c])return null;const n=m[2]!=null?+m[2]:(c==='M'?3:5);
  return {t:T0[c]*Math.pow(TEND[c]/T0[c],n/10),wd:false};
 }
 function hrData(){
  const rows=[];let skipped=0;
  for(const s of KOINOT_STARS){const t=teff(s.spect);if(!t||!t.t||!s.pc){skipped++;continue;}rows.push({id:s.id,name:s.name,spect:s.spect,pc:s.pc,mag:s.mag,M:s.mag-5*Math.log10(s.pc)+5,T:t.t,wd:t.wd});}
  return {rows,skipped};
 }
 function colorOf(T){return T>20000?'#9bb7ff':T>9000?'#cad7ff':T>7000?'#f4f1ea':T>5500?'#fff0b8':T>4500?'#ffcf80':T>3500?'#ff9a60':'#ff6d4a';}
 function hrTab(body){
  const {rows,skipped}=hrData();
  body.innerHTML=`<canvas class="lab-view x-hr" style="height:390px" aria-label="HR diagramma"></canvas><div class="lab-result" id="hrInfo">Nuqtani bosing. X — samarali harorat (spektr sinfidan taxminan), Y — absolyut kattalik M = m − 5·log₁₀(d/10 pk).</div><div class="lab-row"><button id="hrOpen" disabled>3D yulduz xaritasida ochish</button><label><input id="hrLabel" type="checkbox" checked> Mashhur yulduz nomlari</label></div>
  <p class="lab-note">${rows.length} ta yulduz chizildi (${skipped} tasida spektr sinfi yo‘q/aniqlanmadi). Harorat spektr sinfi bo‘yicha taxminiy (rang indeksi katalogda yo‘q), oq mitti uchun — subsinfdan. Qizil mittilar (M sinfi) pastki o‘ngda to‘planadi — yaqin yulduzlarning aksariyati shunday. Quyosh (G2V) mos yozuv sifatida belgilangan. Ma’lumot: HYG v4.1 (CC BY-SA 4.0).</p>`;
  const canvas=$('.x-hr',body);let sel=null,pts=[];
  const X=(T,w)=>{const a=Math.log10(2200),b=Math.log10(45000);return 52+(1-(Math.log10(T)-a)/(b-a))*(w-72);};
  const Y=(M,h)=>{const lo=-2.5,hi=18;return 18+(M-lo)/(hi-lo)*(h-52);};
  function draw(){
   const {ctx,w,h}=hidpi(canvas);ctx.clearRect(0,0,w,h);ctx.fillStyle='#050d16';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#ffffff14';ctx.fillStyle='#8fb4cf';ctx.font='10px system-ui';ctx.lineWidth=1;
   for(let M=0;M<=16;M+=4){const y=Y(M,h);ctx.beginPath();ctx.moveTo(52,y);ctx.lineTo(w-20,y);ctx.stroke();ctx.fillText(M,22,y+3);}
   for(const T of [40000,20000,10000,6000,4000,3000]){const x=X(T,w);ctx.beginPath();ctx.moveTo(x,18);ctx.lineTo(x,h-34);ctx.stroke();ctx.fillText(T>=1000?T/1000+'k':T,x-8,h-20);}
   ctx.fillText('Harorat, K (issiq ← → sovuq)',w/2-60,h-5);ctx.save();ctx.translate(11,h/2+40);ctx.rotate(-Math.PI/2);ctx.fillText('Absolyut kattalik (yorqin ↑)',0,0);ctx.restore();
   [['O',40000],['B',20000],['A',8500],['F',6600],['G',5600],['K',4500],['M',3200]].forEach(([c,T])=>{ctx.fillStyle='#5f87a3';ctx.fillText(c,X(T,w)-3,12);});
   ctx.strokeStyle='#4d86b055';ctx.setLineDash([4,4]);ctx.beginPath();[[30000,-4],[9700,.6],[7300,3.2],[6000,5],[5200,6.5],[3850,10.5],[2600,15.5]].forEach(([T,M],i)=>{const x=X(T,w),y=Y(Math.max(M,-2.4),h);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();ctx.setLineDash([]);
   pts=[];for(const r of rows){const x=X(r.T,w),y=Y(r.M,h);pts.push({x,y,r});ctx.beginPath();ctx.arc(x,y,r===sel?6:r.wd?2.5:3,0,7);ctx.fillStyle=r.wd?'#e8f3ff':colorOf(r.T);ctx.globalAlpha=.9;ctx.fill();ctx.globalAlpha=1;if(r===sel){ctx.strokeStyle='#5cd5ff';ctx.lineWidth=2;ctx.stroke();ctx.lineWidth=1;}
    if($('#hrLabel',body).checked&&r.mag<2.5||r===sel){ctx.fillStyle='#cfe6f7';ctx.fillText(r.name,x+6,y-5);}}
   const sx=X(5772,w),sy=Y(4.83,h);ctx.strokeStyle='#ffd36b';ctx.lineWidth=2;ctx.beginPath();ctx.arc(sx,sy,8,0,7);ctx.stroke();ctx.fillStyle='#ffd36b';ctx.fillText('☉ Quyosh',sx+10,sy+14);
  }
  canvas.onclick=e=>{const b=canvas.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top;let best=null,bd=14;for(const p of pts){const d=Math.hypot(p.x-x,p.y-y);if(d<bd){bd=d;best=p.r;}}sel=best;draw();$('#hrOpen',body).disabled=!sel;if(sel)$('#hrInfo',body).innerHTML=`<b>${esc(sel.name)}</b> · spektr ${esc(sel.spect)} · masofa ${fmt(sel.pc*3.26156,2)} yorug‘lik yili<br>Ko‘rinma kattalik ${fmt(sel.mag,2)} · absolyut kattalik ${fmt(sel.M,2)} · harorat ≈ ${fmt(Math.round(sel.T/50)*50,0)} K${sel.wd?' · <b>oq mitti</b>':''}<br>Yorqinligi taxminan Quyoshning ${fmt(Math.pow(10,.4*(4.83-sel.M)),sel.M>10?5:3)} baravari.`;};
  $('#hrLabel',body).onchange=draw;
  $('#hrOpen',body).onclick=()=>{if(!sel||!window.KoinotExplorer)return;KoinotLab.dialog.close();KoinotExplorer.go({kind:'star',id:sel.id});};
  draw();KoinotLab.state.labTick=null;
 }

 const G=6.6743e-11,c=299792458,Msun=1.98847e30,Mearth=5.9722e24,Rearth=6.371e6,AU=1.495978707e11,LY=9.4607304725808e15,GMsun=1.32712440018e20,Lsun=3.828e26;
 const sci=(n,d=3)=>Number.isFinite(n)?(Math.abs(n)>=1e6||Math.abs(n)<1e-3&&n!==0?n.toExponential(d-1).replace('e+','×10^').replace('e','×10^'):fmt(n,d)):'—';
 const DEFS=[
  {id:'esc',name:'Qochish va orbital tezlik',fields:[['m','Massa (Yer massasi)',1],['r','Radius (Yer radiusi)',1]],presets:[['Yer',1,1],['Oy',.0123,.2727],['Mars',.1075,.532],['Yupiter',317.8,10.97],['Quyosh',333000,109.2]],
   run:v=>{const M=v.m*Mearth,R=v.r*Rearth,ve=Math.sqrt(2*G*M/R),vo=Math.sqrt(G*M/R),g=G*M/R**2;return `Qochish (2-kosmik) tezlik: <b>${fmt(ve/1000,2)} km/s</b><br>Past orbita (1-kosmik) tezligi: <b>${fmt(vo/1000,2)} km/s</b><br>Sirt tortishish tezlanishi: <b>${fmt(g,2)} m/s²</b> (${fmt(g/9.80665,2)} g)<br><span class="x-f">v₂ = √(2GM/R), v₁ = √(GM/R)</span>`;}},
  {id:'hoh',name:'Gomann ko‘chishi',fields:[['r1','Boshlang‘ich orbita (AU)',1],['r2','Maqsad orbita (AU)',1.524]],presets:[['Yer→Mars',1,1.524],['Yer→Venera',1,.723],['Yer→Yupiter',1,5.203],['Yer→Saturn',1,9.537]],
   run:v=>{const r1=v.r1*AU,r2=v.r2*AU;if(r1<=0||r2<=0||r1===r2)return 'Ikki xil musbat orbita kiriting.';const at=(r1+r2)/2,d1=Math.sqrt(GMsun/r1)*(Math.sqrt(2*r2/(r1+r2))-1),d2=Math.sqrt(GMsun/r2)*(1-Math.sqrt(2*r1/(r1+r2))),t=Math.PI*Math.sqrt(at**3/GMsun);return `Δv₁ (jo‘nash): <b>${fmt(Math.abs(d1)/1000,2)} km/s</b><br>Δv₂ (yetib borish): <b>${fmt(Math.abs(d2)/1000,2)} km/s</b><br>Parvoz vaqti: <b>${fmt(t/86400,1)} kun</b> (${fmt(t/86400/365.25,2)} yil)<br><span class="x-f">Quyosh atrofida doiraviy komplanar orbitalar orasida; sayyora tortishishidan chiqish Δv i hisobga olinmagan. Yer→Mars: ≈ 2,9 va 2,6 km/s, ≈ 259 kun.</span>`;}},
  {id:'rs',name:'Qora tuynuk (Shvartsshild)',fields:[['m','Massa (Quyosh massasi)',10],['k','Kuzatuvchi masofasi (r_s ulushida)',3]],presets:[['Yulduz massali',10],['Sgr A* (≈ 4,3 mln)',4.3e6],['M87* (≈ 6,5 mlrd)',6.5e9]],
   run:v=>{const M=v.m*Msun,rs=2*G*M/c**2,k=Math.max(1.0001,v.k),f=Math.sqrt(1-1/k);return `Hodisa gorizonti radiusi: <b>${sci(rs/1000)} km</b> (${sci(rs/AU)} AU)<br>Foton sferasi: ${sci(1.5*rs/1000)} km · ISCO (aylanmaydigan): ${sci(3*rs/1000)} km<br>O‘rtacha zichlik gorizont ichida: ${sci(M/(4/3*Math.PI*rs**3),2)} kg/m³<br>Gravitatsion sekinlashuv ${fmt(k,2)} r_s masofada: soat tezligi <b>${fmt(f*100,2)}%</b> (uzoq kuzatuvchiga nisbatan)<br><span class="x-f">r_s = 2GM/c² ≈ 2,95 km·(M/M☉). Aylanmaydigan, zaryadsiz tuynuk.</span>`;}},
  {id:'rel',name:'Maxsus nisbiylik (vaqt sekinlashuvi)',fields:[['b','Tezlik (c ning ulushi, 0…0,9999)',.9],['d','Masofa (yorug‘lik yili)',4.24]],presets:[['Proxima: 0,5c',.5,4.24],['Proxima: 0,99c',.99,4.24],['Somon Yo‘li markazi: 0,9999c',.9999,26000]],
   run:v=>{const b=Math.min(.999999,Math.max(0,v.b));if(b<=0)return 'Tezlik 0 dan katta bo‘lsin.';const g=1/Math.sqrt(1-b*b),tEarth=v.d/b,tShip=tEarth/g;return `Lorens omili γ: <b>${fmt(g,3)}</b><br>Yerdagi kuzatuvchi uchun parvoz: <b>${fmt(tEarth,2)} yil</b><br>Kema ichidagi vaqt: <b>${fmt(tShip,2)} yil</b><br>Kemadan masofa qisqargan ko‘rinadi: ${fmt(v.d/g,2)} yorug‘lik yili<br>Kinetik energiya (1 kg uchun): ${sci((g-1)*c*c)} J<br><span class="x-f">Tezlanish/tormozlanish vaqtini hisobga olmaydigan ideal doimiy tezlik. Bunday tezliklar hozirgi texnologiya uchun mumkin emas.</span>`;}},
  {id:'hz',name:'Yashash zonasi va muvozanat harorati',fields:[['L','Yulduz yorqinligi (L☉)',1],['a','Sayyora orbitasi (AU)',1],['A','Albedo (0…1)',.3]],presets:[['Quyosh',1,1,.3],['Proxima (0,0017 L☉)',.0017,.0485,.3],['TRAPPIST-1 (0,00055)',.00055,.0293,.3]],
   run:v=>{const L=Math.max(1e-6,v.L),inn=Math.sqrt(L/1.107),out=Math.sqrt(L/.356),Te=278.5*Math.pow(L,.25)/Math.sqrt(v.a)*Math.pow(1-Math.min(.99,Math.max(0,v.A)),.25);return `Yashash zonasi: <b>${fmt(inn,3)} – ${fmt(out,3)} AU</b><br>Sayyora ${v.a>=inn&&v.a<=out?'<b>zona ichida</b>':v.a<inn?'zonadan <b>ichkarida</b> (juda issiq)':'zonadan <b>tashqarida</b> (juda sovuq)'}<br>Muvozanat harorati: <b>${fmt(Te,0)} K</b> (${fmt(Te-273.15,0)} °C) — issiqxona effektisiz<br><span class="x-f">Zona chegaralari: Kopparapu va b. (2013) ning Quyosh turidagi yulduz uchun S_eff = 1,107 va 0,356 qiymatlari; boshqa spektr sinflarida chegaralar siljiydi — taxminiy. Yerning muvozanat harorati ≈ 255 K, haqiqiy o‘rtacha ≈ 288 K.</span>`;}},
  {id:'kep',name:'Kepler uchinchi qonuni',fields:[['a','Yarim katta o‘q (AU)',1],['M','Markaziy massa (M☉)',1]],presets:[['Yer',1,1],['Mars',1.524,1],['Halley',17.83,1],['TRAPPIST-1 e',.02925,.09]],
   run:v=>{const a=v.a*AU,M=v.M*Msun,P=2*Math.PI*Math.sqrt(a**3/(G*M)),vv=Math.sqrt(G*M/a);return `Orbital davr: <b>${fmt(P/86400,3)} kun</b> (${fmt(P/86400/365.25,4)} yil)<br>Doiraviy orbita tezligi: <b>${fmt(vv/1000,2)} km/s</b><br><span class="x-f">P² = 4π²a³/(G·M); jism massasi markazdagidan ancha kichik deb olingan.</span>`;}},
  {id:'z',name:'Qizil siljish va masofa',fields:[['z','Qizil siljish z',.01]],presets:[['Virgo klasteri 0,004',.004],['z = 0,05',.05],['z = 0,1',.1]],
   run:v=>{const z=v.z,b=((1+z)**2-1)/((1+z)**2+1),H0=70,vv=b*299792.458;return `Radial tezlik (nisbiy Doppler): <b>${fmt(vv,0)} km/s</b> (${fmt(b,4)} c)<br>${z>0.1?'z > 0,1: oddiy Habbl qonuni noto‘g‘ri — kosmologik model kerak.<br>':''}Habbl qonuni bo‘yicha (H₀ = ${H0} km/s/Mpk) masofa: <b>${fmt(vv/H0,1)} Mpk</b> ≈ ${fmt(vv/H0*3.26156,1)} mln yorug‘lik yili<br><span class="x-f">Faqat kichik z uchun va Habbl oqimi bo‘yicha; yaqin galaktikalarda «xos tezlik» ustun bo‘lishi mumkin. H₀ qiymati bahsli (≈ 67–73).</span>`;}},
  {id:'wt',name:'Boshqa jismda vazningiz',fields:[['kg','Massangiz (kg)',70]],presets:[],
   run:v=>{const m=Math.max(0,v.kg);return `<table class="lab-table"><tr><th>Jism</th><th>g, m/s²</th><th>Tarozi ko‘rsatadi</th></tr>${KOINOT_CATALOG.filter(d=>d.gravity&&d.id!=='sun').map(d=>`<tr><td>${d.name}</td><td>${fmt(d.gravity,2)}</td><td>${fmt(m*d.gravity/9.80665,1)} kg</td></tr>`).join('')}</table><span class="x-f">Gaz va muz gigantlari uchun g — 1 bar bosimli sath. Massangiz o‘zgarmaydi, faqat vazn.</span>`;}}
 ];
 function calcTab(body){
  body.innerHTML=`<div class="lab-row"><label>Hisoblagich <select id="cSel">${DEFS.map(d=>`<option value="${d.id}">${d.name}</option>`).join('')}</select></label></div><div id="cForm"></div><div class="lab-result" id="cOut"></div>`;
  const form=$('#cForm',body),out=$('#cOut',body);let def=DEFS[0];
  const run=()=>{const v={};form.querySelectorAll('input[data-k]').forEach(i=>{v[i.dataset.k]=parseFloat(String(i.value).replace(',','.'));});if(Object.values(v).some(x=>!Number.isFinite(x))){out.textContent='Barcha maydonlarga son kiriting.';return;}try{out.innerHTML=def.run(v);}catch(e){out.textContent='Hisoblab bo‘lmadi: '+e.message;}};
  const show=id=>{def=DEFS.find(d=>d.id===id);form.innerHTML=`<div class="lab-row">${def.fields.map(([k,l,val])=>`<label>${l} <input data-k="${k}" type="text" inputmode="decimal" value="${val}" style="width:130px"></label>`).join('')}</div>${def.presets.length?`<div class="lab-row">${def.presets.map((p,i)=>`<button data-p="${i}">${p[0]}</button>`).join('')}</div>`:''}`;form.querySelectorAll('input').forEach(i=>i.oninput=run);form.querySelectorAll('button[data-p]').forEach(b=>b.onclick=()=>{const p=def.presets[+b.dataset.p];form.querySelectorAll('input[data-k]').forEach((i,n)=>{if(p[n+1]!==undefined)i.value=p[n+1];});run();});run();};
  $('#cSel',body).onchange=e=>show(e.target.value);show('esc');
 }
 KX.tab('hr','HR diagramma',hrTab);KX.tab('calc','Hisoblagichlar',calcTab);
 KX.science={teff,hrData,DEFS};
})();
