(()=>{'use strict';
 if(!window.KoinotLab||!window.Astronomy||!window.KX?.tab||!KX.CITIES)return;
 const {$,esc,fmt,hm,longDate,MONTHS}=KX,A=Astronomy,CITIES=KX.CITIES,H5=5*3600e3;
 const DIRS=['shimol','shimoli-sharq','sharq','janubi-sharq','janub','janubi-g‘arb','g‘arb','shimoli-g‘arb'];
 const dirOf=az=>DIRS[Math.round(((az%360)+360)%360/45)%8];
 const PL=[['Mercury','Merkuriy',true],['Venus','Venera',true],['Mars','Mars',true],['Jupiter','Yupiter',true],['Saturn','Saturn',true],['Uranus','Uran',false],['Neptune','Neptun',false]];
 const METEORS=[['Kvadrantidlar',1,3,80,'Qirg‘oqdor Ho‘kizboqar'],['Liridlar',4,22,18,'Lira'],['Eta-Akvaridlar',5,6,50,'Qovg‘a'],['Perseidlar',8,12,100,'Perseyg'],['Orionidlar',10,21,20,'Orion'],['Leonidlar',11,17,15,'Arslon'],['Geminidlar',12,14,150,'Egizaklar'],['Ursidlar',12,22,10,'Kichik Ayiq']];
 const ymdOf=d=>{const s=new Date(d.getTime()+H5);return [s.getUTCFullYear(),s.getUTCMonth(),s.getUTCDate()];};
 const toInput=d=>{const [y,m,k]=ymdOf(d);return y+'-'+String(m+1).padStart(2,'0')+'-'+String(k).padStart(2,'0');};
 const fromInput=v=>{const m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(v);return m?new Date(Date.UTC(+m[1],+m[2]-1,+m[3],0,0)-H5):null;};
 const T=(x)=>x?(x.date||x):null;
 function phaseName(a){if(a<10||a>350)return 'Yangi oy';if(a<80)return 'Hilol (o‘sayotgan)';if(a<100)return 'Birinchi chorak';if(a<170)return 'O‘sayotgan bo‘rtgan oy';if(a<190)return 'To‘lin oy';if(a<260)return 'Kamayotgan bo‘rtgan oy';if(a<280)return 'Oxirgi chorak';return 'Hilol (kamayotgan)';}
 function compute(city,day0){
  const [name,lat,lon,h]=city,obs=new A.Observer(lat,lon,h),t0=day0,res={name,obs,t0};
  const at=d=>new Date(d.getTime());
  const rs=(b,dir,start,lim=1.5)=>{try{return T(A.SearchRiseSet(b,obs,dir,start,lim));}catch(e){return null;}};
  const sunrise=rs('Sun',+1,t0),sunset=rs('Sun',-1,t0);res.sunrise=sunrise;res.sunset=sunset;
  const alt=(b,d,lim,start,dir)=>{try{return T(A.SearchAltitude(b,obs,dir,start,lim,d));}catch(e){return null;}};
  const ns=sunset||new Date(t0.getTime()+13*3600e3);
  res.civil=alt('Sun',-6,1,ns,-1)||ns;res.astro=alt('Sun',-18,1,ns,-1);
  res.nightEnd=alt('Sun',-6,1.5,res.civil,+1);res.astroEnd=res.astro?alt('Sun',-18,1.5,res.astro,+1):null;res.nextSunrise=rs('Sun',+1,ns,1.5);
  const winS=res.civil,winE=res.nightEnd||res.nextSunrise||new Date(winS.getTime()+10*3600e3);res.winS=winS;res.winE=winE;

  const mid=new Date((winS.getTime()+winE.getTime())/2),ph=A.MoonPhase(mid),il=A.Illumination('Moon',mid);
  res.moon={phase:ph,name:phaseName(ph),frac:il.phase_fraction,rise:rs('Moon',+1,t0),set:rs('Moon',-1,t0)};
  try{res.moon.nextFull=T(A.SearchMoonPhase(180,t0,40));res.moon.nextNew=T(A.SearchMoonPhase(0,t0,40));}catch(e){}

  res.planets=PL.map(([b,n,naked])=>{
   let best=null,vis=0,first=null,last=null;
   for(let t=winS.getTime();t<=winE.getTime();t+=15*60e3){const d=new Date(t),eq=A.Equator(b,d,obs,true,true),hz=A.Horizon(d,obs,eq.ra,eq.dec,'normal');
    if(hz.altitude>8){vis++;if(first===null)first=d;last=d;}if(!best||hz.altitude>best.alt)best={alt:hz.altitude,az:hz.azimuth,t:d};}
   const ill=A.Illumination(b,mid),mag=ill.mag,pr=rs(b,+1,t0),ps=rs(b,-1,t0);
   const el=A.AngleFromSun?A.AngleFromSun(b,mid):null;
   return {b,n,naked,mag,best,vis,first,last,rise:pr,set:ps,elong:el,hours:vis*.25};
  });

  try{const le=A.SearchLunarEclipse(t0);const pk=T(le.peak),eq=A.Equator('Moon',pk,obs,true,true),hz=A.Horizon(pk,obs,eq.ra,eq.dec,'normal');res.lunar={kind:le.kind,peak:pk,alt:hz.altitude};}catch(e){}
  try{const se=A.SearchLocalSolarEclipse(t0,obs);res.solar={kind:se.kind,peak:T(se.peak.time),alt:se.peak.altitude,obsc:se.obscuration};}catch(e){}
  return res;
 }
 const KIND={penumbral:'yarim soyali',partial:'qisman',total:'to‘liq',annular:'halqasimon'};
 const dayDiff=(a,b)=>Math.round((a.getTime()-b.getTime())/86400000);
 function meteors(t0){const [y]=ymdOf(t0),out=[];for(const [n,m,d,zhr,c] of METEORS){for(const yy of [y,y+1]){const pk=new Date(Date.UTC(yy,m-1,d,0,0)-H5+12*3600e3);const dd=dayDiff(pk,t0);if(dd>=-3&&dd<=400){out.push({n,pk,dd,zhr,c});break;}}}return out.sort((a,b)=>a.dd-b.dd).slice(0,4);}
 function summary(r){
  const L=[];const m=r.moon;L.push(`Oy: ${m.name}, yoritilganlik ≈ ${fmt(m.frac*100,0)}%.`+(m.frac<.25?' Tun qorong‘i — xira obyektlar uchun qulay.':m.frac>.8?' Oy yorqin — xira obyektlarni ko‘rish qiyin.':''));
  const vis=r.planets.filter(p=>p.naked&&p.best&&p.best.alt>8).sort((a,b)=>a.mag-b.mag);
  L.push(vis.length?'Ko‘z bilan ko‘rinadigan sayyoralar: '+vis.map(p=>p.n).join(', ')+'.':'Bu kechada ko‘z bilan ko‘rinadigan sayyora yo‘q (ufqdan past yoki Quyoshga yaqin).');
  if(r.solar&&r.solar.alt>0&&dayDiff(r.solar.peak,r.t0)<=0&&dayDiff(r.solar.peak,r.t0)>=0)L.push('Bugun Quyosh tutilishi ko‘rinadi!');
  return L;
 }
 const rows=(r)=>r.planets.map(p=>{const b=p.best,ok=b&&b.alt>8,inst=!p.naked&&p.mag>5.6?' (durbin kerak)':'';const note=!ok?'<span class="tn-no">Ko‘rinmaydi</span>':`<span class="tn-ok">Ko‘rinadi${inst}</span>`;
  return `<tr><td><b>${p.n}</b></td><td>${note}</td><td>${ok?`${hm(b.t)} · ${fmt(b.alt,0)}° · ${dirOf(b.az)}`:'—'}</td><td>${ok?hm(p.first)+'–'+hm(p.last):'—'}</td><td>${fmt(p.mag,1)}m</td><td>${hm(p.rise)} / ${hm(p.set)}</td></tr>`;}).join('');
 function tab(body){
  const st={ci:KX.sky?.city||0,day:(()=>{const [y,m,d]=ymdOf(new Date());return new Date(Date.UTC(y,m,d,0,0)-H5);})()};
  body.innerHTML=`<div class="tn"><div class="lab-row"><label>Shahar: <select id="tnCity">${CITIES.map((c,i)=>`<option value="${i}">${c[0]}</option>`).join('')}</select></label><button id="tnP">‹</button><input type="date" id="tnD"><button id="tnN">›</button><button id="tnT">Bugun</button></div><div id="tnOut"></div></div>`;
  $('#tnCity',body).value=st.ci;$('#tnD',body).value=toInput(st.day);
  function draw(){const r=compute(CITIES[st.ci],st.day),out=$('#tnOut',body);const [y,m,k]=ymdOf(st.day);
   const mt=meteors(st.day),sm=summary(r);
   out.innerHTML=`<div class="tn-sum"><b>${esc(CITIES[st.ci][0])} · ${k} ${MONTHS[m]} ${y} kechasi</b>${sm.map(s=>`<div>• ${esc(s)}</div>`).join('')}</div>
   <div class="tn-grid"><div class="tn-card"><h4>☀ Quyosh</h4><div>Chiqish: <b>${hm(r.sunrise)}</b> · Botish: <b>${hm(r.sunset)}</b></div><div>Qorong‘i tun (−6°): <b>${hm(r.civil)}</b> – <b>${hm(r.nightEnd)}</b></div><div>To‘liq astronomik tun (−18°): <b>${r.astro?hm(r.astro)+' – '+hm(r.astroEnd):'Bu kenglikda bu kecha to‘liq qorong‘i bo‘lmaydi'}</b></div></div>
   <div class="tn-card"><h4>☾ Oy</h4><div><b>${r.moon.name}</b>, yoritilgan qismi ≈ ${fmt(r.moon.frac*100,0)}%</div><div>Chiqish: <b>${hm(r.moon.rise)}</b> · Botish: <b>${hm(r.moon.set)}</b></div><div>Keyingi to‘lin oy: <b>${r.moon.nextFull?longDate(r.moon.nextFull):'—'}</b></div><div>Keyingi yangi oy: <b>${r.moon.nextNew?longDate(r.moon.nextNew):'—'}</b></div></div></div>
   <div class="tn-card"><h4>✦ Sayyoralar (tunda ${hm(r.winS)}–${hm(r.winE)})</h4><div class="tn-tw"><table class="tn-t"><thead><tr><th>Sayyora</th><th>Holat</th><th>Eng baland</th><th>Ko‘rinish vaqti</th><th>Yorqinlik</th><th>Chiqish / botish</th></tr></thead><tbody>${rows(r)}</tbody></table></div><small>«Ko‘rinadi» — tunda ufqdan kamida 8° balandlikda bo‘ladi. Uran va Neptun odatda durbin yoki teleskop bilan ko‘rinadi.</small></div>
   <div class="tn-grid"><div class="tn-card"><h4>◐ Yaqin tutilishlar</h4>${r.lunar?`<div>Oy tutilishi: <b>${longDate(r.lunar.peak)}</b>, ${KIND[r.lunar.kind]||r.lunar.kind}${r.lunar.alt>0?' — '+esc(CITIES[st.ci][0])+'dan ko‘rinadi':' — '+esc(CITIES[st.ci][0])+'dan ko‘rinmaydi (Oy ufq ostida)'}</div>`:''}${r.solar?`<div>Quyosh tutilishi (shu joydan): <b>${longDate(r.solar.peak)}</b>, ${KIND[r.solar.kind]||r.solar.kind}${r.solar.alt>0?', Quyosh ufqdan '+fmt(r.solar.alt,0)+'° balandda':' (Quyosh ufq ostida)'}</div>`:''}${!r.lunar&&!r.solar?'<div>Ma’lumot topilmadi.</div>':''}</div>
   <div class="tn-card"><h4>☄ Meteor yomg‘irlari</h4>${mt.map(m=>`<div><b>${m.n}</b> — cho‘qqisi ${longDate(m.pk)} ${m.dd>=0?'('+(m.dd===0?'bugun':m.dd+' kundan keyin')+')':'(o‘tdi)'} · ≈ ${m.zhr}/soat · ${m.c} yulduz turkumi tomondan</div>`).join('')}<small>Taxminiy: sanalar yildan yilga ±1 kun siljiydi; soatiga son (ZHR) — ideal osmon va radiant zenitda bo‘lgandagi qiymat.</small></div></div>
   <p class="lab-note">Hisob: Astronomy Engine, atmosfera sinishi hisobga olingan, vaqt — O‘zbekiston (UTC+5). Bulut, ufqdagi bino/tog‘ va shahar yoritilishi hisobga olinmaydi: haqiqiy ko‘rinish shunga qarab yomonroq bo‘lishi mumkin. Meteor sanalari — taxminiy jadval.</p>`;}
  const step=n=>{st.day=new Date(st.day.getTime()+n*86400000);$('#tnD',body).value=toInput(st.day);draw();};
  $('#tnCity',body).onchange=e=>{st.ci=+e.target.value;draw();};$('#tnD',body).onchange=e=>{const d=fromInput(e.target.value);if(d){st.day=d;draw();}};
  $('#tnP',body).onclick=()=>step(-1);$('#tnN',body).onclick=()=>step(1);$('#tnT',body).onclick=()=>{const [y,m,d]=ymdOf(new Date());st.day=new Date(Date.UTC(y,m,d,0,0)-H5);$('#tnD',body).value=toInput(st.day);draw();};
  draw();
 }
 KX.tab('tonight','Bugun osmonda',tab);
})();
