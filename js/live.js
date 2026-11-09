(()=>{'use strict';
 const KX=window.KX,A=window.Astronomy;if(!KX?.tab||!A||!KX.net)return;
 const {$,esc,fmt,hm,ymd,stamp,OFFSET}=KX,net=KX.net,LS=net.LS,RAD=Math.PI/180,SC=KX.scope;
 const city=()=>KX.CITIES?(KX.CITIES[SC?.prof?.city||0]||KX.CITIES[0]):['Toshkent',41.2995,69.2401,455];
 const COMP=['Shimol','Shimoli-sharq','Sharq','Janubi-sharq','Janub','Janubi-g‘arb','G‘arb','Shimoli-g‘arb'],compass=a=>COMP[Math.round(((a%360)+360)%360/45)%8];
 const getText=async(url,ms=12000)=>{const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);try{const r=await fetch(url,{signal:c.signal,mode:'cors',credentials:'omit',referrerPolicy:'no-referrer'});if(!r.ok)throw new Error('HTTP '+r.status);return await r.text();}finally{clearTimeout(t);}};
 const errT=e=>e&&e.name==='AbortError'?'vaqt tugadi':(e&&e.message)||'xato';
 const offMsg=()=>`<div class="ob-sum">🌐 Bu bo‘lim internet talab qiladi. Internet o‘chirilgan yoki aloqa yo‘q. <button id="lvOn" class="ob-go">Yoqish</button></div>`;
 let box=null,cur='sun',timers=[];
 const clearT=()=>{timers.forEach(clearInterval);timers=[];};
 const SUBS=[['sun','Quyosh faolligi'],['iss','ISS'],['comet','Kometalar'],['sn','Supernovalar']];
 function draw(){clearT();box.innerHTML=`<div class="ob-nav">${SUBS.map(s=>`<button data-s="${s[0]}"${s[0]===cur?' class="on"':''}>${s[1]}</button>`).join('')}</div><div class="ob-body"></div>`;
  box.querySelector('.ob-nav').onclick=e=>{const b=e.target.closest('button');if(b){cur=b.dataset.s;draw();}};
  const body=box.querySelector('.ob-body');
  if(!net.enabled()&&cur!=='sn'){body.innerHTML=offMsg();$('#lvOn',body).onclick=()=>{net.set(true);draw();};return;}
  ({sun:sunTab,iss:issTab,comet:cometTab,sn:snTab})[cur](body);}
 KX.tab('live','Jonli ma‘lumot',b=>{box=b;draw();});

 const SW='https://services.swpc.noaa.gov/';
 const xclass=f=>{if(!(f>0))return '—';const L=f<1e-7?['A',1e-8]:f<1e-6?['B',1e-7]:f<1e-5?['C',1e-6]:f<1e-4?['M',1e-5]:['X',1e-4];return L[0]+(f/L[1]).toFixed(1);};
 const kpTxt=k=>k<4?['Tinch','#5ee0a0']:k<5?['Faol','#ffc65a']:k<6?['G1 — kuchsiz geomagnit bo‘ron','#ff9a8a']:k<7?['G2 — o‘rtacha bo‘ron','#ff7a6a']:['G3+ — kuchli bo‘ron','#ff5a5a'];
 async function sunTab(body){
  body.innerHTML=`<p class="lab-note">Quyoshdagi hozirgi holat. Manba: NOAA Space Weather Prediction Center (SWPC) va NASA SDO. <button id="swRef">⟳ Yangilash</button></p><div id="swOut" class="ob-sum">Yuklanmoqda…</div><div class="lv-imgs"><div class="lab-row"><button data-i="HMIIC" class="on">Dog‘lar (HMI)</button><button data-i="0193">193 Å (toj)</button><button data-i="0304">304 Å (xromosfera)</button></div><img id="swImg" alt="Quyoshning so‘nggi surati" referrerpolicy="no-referrer"><small>Surat: NASA / SDO (so‘nggi, ≈ 15 daqiqa kechikish bilan). Internetdan yuklanadi.</small></div><canvas id="swC" class="ob-cv"></canvas>`;
  const img=$('#swImg',body),setImg=k=>{img.src=`https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_${k}.jpg?t=${Math.floor(Date.now()/600000)}`;body.querySelectorAll('.lv-imgs button').forEach(b=>b.classList.toggle('on',b.dataset.i===k));};
  img.onerror=()=>{img.style.display='none';};body.querySelector('.lv-imgs').onclick=e=>{const b=e.target.closest('[data-i]');if(b){img.style.display='';setImg(b.dataset.i);}};setImg('HMIIC');
  const load=async()=>{
   const out=$('#swOut',body);out.textContent='Yuklanmoqda…';
   const J=u=>net.getJSON(SW+u,15000);
   const [sc,kp,pl,mg,xr,ss]=await Promise.allSettled([J('products/noaa-scales.json'),J('json/planetary_k_index_1m.json'),J('products/solar-wind/plasma-5-minute.json'),J('products/solar-wind/mag-5-minute.json'),J('json/goes/primary/xrays-6-hour.json'),J('json/solar-cycle/observed-solar-cycle-indices.json')]);
   const cards=[];let ok=0;
   if(kp.status==='fulfilled'&&Array.isArray(kp.value)&&kp.value.length){const l=kp.value[kp.value.length-1],k=+(l.estimated_kp??l.kp_index??l.kp);if(isFinite(k)){ok++;const t=kpTxt(k);cards.push(['Geomagnit Kp',k.toFixed(1),`<span style="color:${t[1]}">${t[0]}</span>`]);}}
   if(sc.status==='fulfilled'&&sc.value){try{const n=sc.value['0']||sc.value[Object.keys(sc.value)[0]];ok++;cards.push(['NOAA shkalalari',`G${n.G.Scale} · S${n.S.Scale} · R${n.R.Scale}`,'G — geomagnit, S — radiatsiya, R — radioaloqa (0 = yo‘q)']);}catch(e){}}
   if(pl.status==='fulfilled'&&Array.isArray(pl.value)&&pl.value.length>1){const r=pl.value[pl.value.length-1],sp=+r[2];if(isFinite(sp)){ok++;cards.push(['Quyosh shamoli tezligi',fmt(sp,0)+' km/s',sp>600?'<span style="color:#ffc65a">tez oqim</span>':'odatiy (≈ 300–500)']);}}
   if(mg.status==='fulfilled'&&Array.isArray(mg.value)&&mg.value.length>1){const r=mg.value[mg.value.length-1],bz=+r[3];if(isFinite(bz)){ok++;cards.push(['Magnit maydon Bz',bz.toFixed(1)+' nT',bz<-5?'<span style="color:#ffc65a">janubga — bo‘ronga moyil</span>':'']);}}
   if(xr.status==='fulfilled'&&Array.isArray(xr.value)){const a=xr.value.filter(x=>String(x.energy).includes('0.1-0.8')&&x.flux>0);if(a.length){const l=a[a.length-1],mx=Math.max(...a.map(x=>x.flux));ok++;cards.push(['Rentgen (Quyosh chaqnashi)',xclass(l.flux),`so‘nggi 6 soatda eng kuchlisi: <b>${xclass(mx)}</b>`]);}}
   const unit=[];
   out.innerHTML=ok?`<div class="lv-cards">${cards.map(c=>`<div class="lv-card"><small>${c[0]}</small><b>${c[1]}</b><span>${c[2]}</span></div>`).join('')}</div><p class="lab-note">Kp ≥ 5 — geomagnit bo‘ron. Shimoliy kengliklarda qutb yog‘dusi bo‘ladi; O‘zbekiston kengligida (≈ 40–43°) faqat juda kuchli bo‘ronlarda (Kp ≈ 8–9) zaif yog‘du ko‘rinishi mumkin. Ma’lumotlar real vaqtga yaqin; yangilanish: ${stamp(new Date())}.</p>`:`<small>Ma’lumot olib bo‘lmadi (${esc(errT(kp.reason||sc.reason))}). Internetni tekshiring.</small>`;
   const c=$('#swC',body);if(ss.status==='fulfilled'&&Array.isArray(ss.value)&&c&&c.isConnected){const rows=ss.value.filter(r=>isFinite(+r.ssn)).slice(-48);if(rows.length>3){const {ctx,w,h}=KX.hidpi(c,230),mx=Math.max(...rows.map(r=>+r.ssn),50),px=36,py=22;ctx.fillStyle='#02050b';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#17314a';ctx.fillStyle='#6f93ad';ctx.font='10px system-ui';
     for(let k=0;k<=4;k++){const v=mx*k/4,y=h-py-(h-2*py)*k/4;ctx.beginPath();ctx.moveTo(px,y);ctx.lineTo(w-8,y);ctx.stroke();ctx.fillText(Math.round(v),4,y+3);}
     ctx.strokeStyle='#ffc65a';ctx.lineWidth=2;ctx.beginPath();rows.forEach((r,i)=>{const x=px+(w-px-10)*i/(rows.length-1),y=h-py-(h-2*py)*(+r.ssn/mx);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();
     ctx.fillStyle='#9fb4c8';ctx.fillText('Quyosh dog‘lari soni (oylik, so‘nggi '+rows.length+' oy): '+String(rows[0]['time-tag']||'').slice(0,7)+' → '+String(rows[rows.length-1]['time-tag']||'').slice(0,7),px,14);}}
  };
  $('#swRef',body).onclick=load;load();
 }

 const SAT=window.satellite;
 async function getTLE(){const c=LS.get('koinot-tle',null);if(c&&Date.now()-c.t<6*3600e3)return c;
  let l1,l2,src;
  try{try{const j=await net.getJSON('https://api.wheretheiss.at/v1/satellites/25544/tles?format=json');l1=j.line1;l2=j.line2;src='wheretheiss.at';}catch(e){const tx=await getText('https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=tle'),L=tx.trim().split(/\r?\n/).map(s=>s.trim());const i=L.findIndex(s=>s.startsWith('1 '));l1=L[i];l2=L[i+1];src='CelesTrak';}
  if(!l1||!l2||!l1.startsWith('1 ')||!l2.startsWith('2 '))throw new Error('TLE formati noto‘g‘ri');const v={t:Date.now(),l1,l2,src};LS.set('koinot-tle',v);return v;}catch(e){if(c)return c;throw e;}}
 function satAt(rec,date){const p=SAT.propagate(rec,date);if(!p.position||typeof p.position==='boolean')return null;const g=SAT.gstime(date),gd=SAT.eciToGeodetic(p.position,g);return {eci:p.position,g,lat:SAT.degreesLat(gd.latitude),lon:SAT.degreesLong(gd.longitude),alt:gd.height,vel:p.velocity?Math.hypot(p.velocity.x,p.velocity.y,p.velocity.z):0};}
 function look(rec,date,c){const s=satAt(rec,date);if(!s)return null;const la=SAT.ecfToLookAngles({latitude:c[1]*RAD,longitude:c[2]*RAD,height:(c[3]||0)/1000},SAT.eciToEcf(s.eci,s.g));return Object.assign(s,{az:la.azimuth/RAD,el:la.elevation/RAD,rng:la.rangeSat});}
 function sunlit(s,date){const v=A.GeoVector('Sun',new A.AstroTime(date),false),L=Math.hypot(v.x,v.y,v.z),u=[v.x/L,v.y/L,v.z/L],r=s.eci,d=r.x*u[0]+r.y*u[1]+r.z*u[2];if(d>=0)return true;const px=r.x-d*u[0],py=r.y-d*u[1],pz=r.z-d*u[2];return Math.hypot(px,py,pz)>6371;}
 function passes(rec,c,days=4){
  const out=[],obs=new A.Observer(c[1],c[2],c[3]||0),t0=Date.now(),step=30e3;let inP=null,prev=null;
  for(let t=t0;t<t0+days*864e5;t+=step){const d=new Date(t),l=look(rec,d,c);if(!l)continue;
   if(l.el>0){if(!inP)inP={start:d,sAz:l.az,max:l.el,tMax:d,mAz:l.az};if(l.el>inP.max){inP.max=l.el;inP.tMax=d;inP.mAz=l.az;}inP.end=d;inP.eAz=l.az;}
   else if(inP){const ml=look(rec,inP.tMax,c),sl=ml?sunlit(ml,inP.tMax):false,h=A.Horizon(new A.AstroTime(inP.tMax),obs,...(()=>{const q=A.Equator('Sun',new A.AstroTime(inP.tMax),obs,true,true);return [q.ra,q.dec];})(),'normal');inP.dark=h.altitude<-6;inP.lit=sl;out.push(inP);inP=null;}}
  return out;}
 async function issTab(body){
  if(!SAT){body.innerHTML='<div class="ob-sum">satellite.js topilmadi (vendor/satellite.min.js).</div>';return;}
  const c=city();
  body.innerHTML=`<p class="lab-note">Xalqaro kosmik stansiya (ISS): hozirgi joyi va ${esc(c[0])} ustidan ko‘rinadigan o‘tishlari. Shaharni «Teleskop → Asbob» bo‘limida tanlash mumkin. Orbita elementlari (TLE) internetdan olinadi.</p><div id="isNow" class="ob-sum">Yuklanmoqda…</div><canvas id="isMap" class="ob-cv" style="max-width:720px"></canvas><div class="lab-row"><label><input type="checkbox" id="isVis" checked> faqat ko‘rinadiganlar</label></div><div id="isPass"></div>`;
  let rec=null,tle=null;
  try{tle=await getTLE();rec=SAT.twoline2satrec(tle.l1,tle.l2);}catch(e){$('#isNow',body).innerHTML=`<small>TLE olib bo‘lmadi (${esc(errT(e))}). Internetni tekshiring.</small>`;return;}
  const age=(Date.now()-(()=>{const y=+tle.l1.slice(18,20),d=+tle.l1.slice(20,32);return Date.UTC(y<57?2000+y:1900+y,0,1)+(d-1)*864e5;})())/864e5;
  const bg=new Image();bg.src='assets/textures/2k_earth_daymap.jpg';
  const drawMap=async()=>{const cv=$('#isMap',body);if(!cv||!cv.isConnected)return;let live=null;try{live=await net.getJSON('https://api.wheretheiss.at/v1/satellites/25544',8000);}catch(e){}
   const now=new Date(),s=satAt(rec,now);const S=live&&isFinite(live.latitude)?{lat:live.latitude,lon:live.longitude,alt:live.altitude,vel:live.velocity/3.6,src:'wheretheiss.at'}:s?{lat:s.lat,lon:s.lon,alt:s.alt,vel:s.vel,src:'TLE hisobi'}:null;if(!S)return;
   const W=Math.min(cv.parentElement.clientWidth||700,720),{ctx,w,h}=KX.hidpi(cv,Math.round(W/2));ctx.fillStyle='#02050b';ctx.fillRect(0,0,w,h);if(bg.complete&&bg.naturalWidth){ctx.globalAlpha=.8;ctx.drawImage(bg,0,0,w,h);ctx.globalAlpha=1;}
   const X=lon=>(lon+180)/360*w,Y=lat=>(90-lat)/180*h;ctx.strokeStyle='rgba(120,180,230,.25)';for(let a=-60;a<=60;a+=30){ctx.beginPath();ctx.moveTo(0,Y(a));ctx.lineTo(w,Y(a));ctx.stroke();}for(let a=-150;a<=150;a+=30){ctx.beginPath();ctx.moveTo(X(a),0);ctx.lineTo(X(a),h);ctx.stroke();}
   if(s){ctx.strokeStyle='#ffc65a';ctx.lineWidth=1.6;let pl=null;ctx.beginPath();for(let m=-45;m<=90;m+=1){const q=satAt(rec,new Date(now.getTime()+m*60e3));if(!q)continue;const x=X(q.lon),y=Y(q.lat);if(pl===null||Math.abs(q.lon-pl)>180)ctx.moveTo(x,y);else ctx.lineTo(x,y);pl=q.lon;}ctx.stroke();}
   const rho=Math.acos(6371/(6371+S.alt));ctx.strokeStyle='rgba(94,224,160,.7)';ctx.beginPath();let pl2=null;for(let k=0;k<=72;k++){const b=k/72*2*Math.PI,la=Math.asin(Math.sin(S.lat*RAD)*Math.cos(rho)+Math.cos(S.lat*RAD)*Math.sin(rho)*Math.cos(b)),lo=S.lon*RAD+Math.atan2(Math.sin(b)*Math.sin(rho)*Math.cos(S.lat*RAD),Math.cos(rho)-Math.sin(S.lat*RAD)*Math.sin(la)),L=((lo/RAD+540)%360)-180,x=X(L),y=Y(la/RAD);if(pl2===null||Math.abs(L-pl2)>180)ctx.moveTo(x,y);else ctx.lineTo(x,y);pl2=L;}ctx.stroke();
   ctx.fillStyle='#ff5a5a';ctx.beginPath();ctx.arc(X(S.lon),Y(S.lat),5,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.font='11px system-ui';ctx.fillText('ISS',X(S.lon)+8,Y(S.lat)-6);
   ctx.fillStyle='#5ee0a0';ctx.beginPath();ctx.arc(X(c[2]),Y(c[1]),4,0,7);ctx.fill();ctx.fillText(c[0],X(c[2])+7,Y(c[1])+4);ctx.fillStyle='#9fb4c8';ctx.fillText('Sariq — izi (−45…+90 daq) · yashil doira — ko‘rinish zonasi',6,h-6);
   const l=look(rec,now,c);$('#isNow',body).innerHTML=`<b>ISS hozir:</b> ${S.lat.toFixed(2)}°, ${S.lon.toFixed(2)}° · balandlik ${fmt(S.alt,0)} km · tezlik ${fmt(S.vel*3.6,0)} km/soat <small>(manba: ${S.src})</small><br>${esc(c[0])} nuqtasidan: ${l?(l.el>0?`<b style="color:#5ee0a0">ufqdan ${fmt(l.el,0)}° balandda, ${compass(l.az)}</b>`:`ufqdan past (${fmt(l.el,0)}°), masofa ${fmt(l.rng,0)} km`):'—'}<br><small>TLE: ${esc(tle.src)}, yoshi ≈ ${fmt(age,1)} kun${age>10?' — ESKIRGAN, o‘tishlar noaniq bo‘lishi mumkin':''}.</small>`;};
  bg.onload=drawMap;drawMap();timers.push(setInterval(drawMap,8000));
  const showP=()=>{const all=passes(rec,c),vis=$('#isVis',body).checked,list=all.filter(p=>!vis||(p.lit&&p.dark&&p.max>=10));
   $('#isPass').innerHTML=`<div class="ob-tw"><table class="ob-t"><thead><tr><th>Boshlanishi</th><th>Davomiyligi</th><th>Eng baland</th><th>Qayerdan → qayerga</th><th>Ko‘rinishi</th></tr></thead><tbody>${list.slice(0,12).map(p=>`<tr><td>${stamp(p.start)}</td><td>${fmt((p.end-p.start)/60e3+.5,0)} daq</td><td>${fmt(p.max,0)}° · ${compass(p.mAz)}</td><td>${compass(p.sAz)} → ${compass(p.eAz)}</td><td>${p.lit&&p.dark?'<span class="ob-lv l0">ko‘rinadi</span>':p.lit?'<small>kunduzi — ko‘rinmaydi</small>':p.dark?'<small>Yer soyasida</small>':'<small>kunduzi</small>'}</td></tr>`).join('')||'<tr><td colspan="5">4 kun ichida mos o‘tish topilmadi (filtrni o‘chirib ko‘ring).</td></tr>'}</tbody></table></div><p class="lab-note">O‘tish «ko‘rinadi» bo‘ladi, agar ISS Quyosh nuri ostida, kuzatuvchi esa qorong‘ida (Quyosh −6° dan pastda) bo‘lsa va maksimal balandlik ≥ 10° bo‘lsa. Hisob oddiy (silindrik soya, atmosfera sinishisiz): vaqt bir necha soniya–daqiqaga farq qilishi mumkin. ISS ko‘p hollarda ko‘zga yorqin «yulduz» bo‘lib ko‘rinadi, teleskopda kuzatish qiyin (juda tez).</p>`;};
  $('#isVis',body).onchange=showP;setTimeout(showP,30);
 }
 KX.issNext=async ci=>{if(!SAT)throw new Error('satellite.js yo‘q');const tle=await getTLE(),rec=SAT.twoline2satrec(tle.l1,tle.l2),c=(KX.CITIES&&KX.CITIES[ci])||city(),L=passes(rec,c,3).filter(p=>p.lit&&p.dark&&p.max>=10&&p.start.getTime()>Date.now());return L.length?L[0].start.getTime():null;};

 const GK=0.01720209895,EPS=23.4392911*RAD;
 function cometState(o,t,earth){
  const e=o.e,q=o.q,dt=t-o.tp;let x,y;
  if(Math.abs(e-1)<1e-6){const Wv=3*GK/Math.SQRT2*dt/Math.pow(q,1.5);let s=Math.cbrt(Wv/2+Math.sqrt(Wv*Wv/4+1));const tn=s-1/s;const nu=2*Math.atan(tn),r=q*(1+tn*tn);x=r*Math.cos(nu);y=r*Math.sin(nu);}
  else if(e<1){const a=q/(1-e),n=GK/Math.pow(a,1.5);let M=n*dt;M=((M+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;let E=M;for(let k=0;k<30;k++)E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));x=a*(Math.cos(E)-e);y=a*Math.sqrt(1-e*e)*Math.sin(E);}
  else{const a=q/(1-e),n=GK/Math.pow(-a,1.5),M=n*dt;let H=Math.asinh(M/e)||0;for(let k=0;k<40;k++)H-=(e*Math.sinh(H)-H-M)/(e*Math.cosh(H)-1);x=-a*(e-Math.cosh(H));y=-a*Math.sqrt(e*e-1)*Math.sinh(H);}
  const i=o.i*RAD,om=o.om*RAD,w=o.w*RAD,co=Math.cos(om),so=Math.sin(om),cw=Math.cos(w),sw=Math.sin(w),ci=Math.cos(i),si=Math.sin(i);
  const xe=(co*cw-so*sw*ci)*x+(-co*sw-so*cw*ci)*y,ye=(so*cw+co*sw*ci)*x+(-so*sw+co*cw*ci)*y,ze=(sw*si)*x+(cw*si)*y;
  const hx=xe,hy=ye*Math.cos(EPS)-ze*Math.sin(EPS),hz=ye*Math.sin(EPS)+ze*Math.cos(EPS);
  const gx=hx-earth.x,gy=hy-earth.y,gz=hz-earth.z,D=Math.hypot(gx,gy,gz),r=Math.hypot(hx,hy,hz);
  const mag=o.M1+5*Math.log10(D)+(o.K1||10)*Math.log10(r),el=Math.acos(Math.max(-1,Math.min(1,(-(gx*earth.x+gy*earth.y+gz*earth.z))/(D*Math.hypot(earth.x,earth.y,earth.z)))))/RAD;
  return {ra:(Math.atan2(gy,gx)/RAD+360)%360,dec:Math.asin(gz/D)/RAD,D,r,mag,el};}
 KX.cometState=cometState;
 const cm={lim:12,rows:null,t:0};
 async function loadComets(){if(cm.rows&&Date.now()-cm.t<6*3600e3)return cm.rows;
  const jd=Date.now()/864e5+2440587.5,cd=encodeURIComponent(JSON.stringify({AND:[`tp|RG|${Math.round(jd-1500)}|${Math.round(jd+800)}`]}));
  const j=await net.getJSON(`https://ssd-api.jpl.nasa.gov/sbdb_query.api?fields=full_name,e,q,i,om,w,tp,M1,K1&sb-kind=c&sb-cdata=${cd}`,25000);
  if(!j||!Array.isArray(j.data))throw new Error('Javob formati kutilmagan');const f=j.fields,ix=k=>f.indexOf(k);
  cm.rows=j.data.map(r=>({name:String(r[ix('full_name')]).trim(),e:+r[ix('e')],q:+r[ix('q')],i:+r[ix('i')],om:+r[ix('om')],w:+r[ix('w')],tp:+r[ix('tp')],M1:r[ix('M1')]==null?null:+r[ix('M1')],K1:r[ix('K1')]==null?null:+r[ix('K1')]})).filter(o=>isFinite(o.e)&&isFinite(o.q)&&isFinite(o.tp)&&o.M1!=null&&isFinite(o.M1));cm.t=Date.now();return cm.rows;}
 async function cometTab(body){
  body.innerHTML=`<p class="lab-note">Hozir (±) yorqin kometalar ro‘yxati: orbita elementlari JPL Small-Body Database'dan olinadi, o‘rni va yorqinligi shu yerning o‘zida hisoblanadi. <b>Yorqinlik — taxminiy</b> (komet nihoyatda o‘zgaruvchan: portlashlar, parchalanish; real qiymat 1–3ᵐ farq qilishi mumkin).</p><div class="lab-row ob-row"><label>Eng xira <select id="cmL">${[8,10,12,14].map(v=>`<option${v===cm.lim?' selected':''}>${v}</option>`).join('')}</select>ᵐ</label><label>Shahar: <b>${esc(city()[0])}</b></label><button id="cmR">⟳ Yangilash</button></div><div id="cmOut" class="ob-sum">Yuklanmoqda…</div>`;
  const out=$('#cmOut',body);
  const show=async()=>{let rows;try{rows=await loadComets();}catch(e){out.innerHTML=`<small>Komet ro‘yxatini olib bo‘lmadi (${esc(errT(e))}). Internetni tekshiring.</small>`;return;}
   const now=new Date(),t=new A.AstroTime(now),jd=now.getTime()/864e5+2440587.5,ev=A.HelioVector('Earth',t),c=city(),obs=new A.Observer(c[1],c[2],c[3]||0),res=[];
   for(const o of rows){try{const s=cometState(o,jd,ev);if(!isFinite(s.mag)||s.mag>cm.lim)continue;const h=A.Horizon(t,obs,s.ra/15,s.dec,'normal');res.push(Object.assign({o,alt:h.altitude,az:h.azimuth},s));}catch(e){}}
   res.sort((a,b)=>a.mag-b.mag);
   out.innerHTML=`<small>${rows.length} ta komet orbitasi, shundan ${res.length} tasi ≤ ${cm.lim}ᵐ (hozir, ${stamp(now)}).</small><div class="ob-tw"><table class="ob-t"><thead><tr><th>Komet</th><th>Yorqinlik</th><th>Quyoshdan / Yerdan</th><th>Quyoshdan burchak</th><th>Hozir ${esc(c[0])}da</th><th>RA / Dec (J2000)</th><th>Perigeliy</th></tr></thead><tbody>${res.map(x=>`<tr><td><b>${esc(x.o.name)}</b></td><td>${fmt(x.mag,1)}ᵐ</td><td>${fmt(x.r,2)} / ${fmt(x.D,2)} AU</td><td>${fmt(x.el,0)}°${x.el<25?' <small>(Quyoshga yaqin)</small>':''}</td><td>${x.alt>0?'<b>'+fmt(x.alt,0)+'°</b> · '+compass(x.az):'<small>ufqdan past</small>'}</td><td>${fmt(x.ra/15,2)}ʰ / ${fmt(x.dec,1)}°</td><td>${ymd(new Date((x.o.tp-2440587.5)*864e5))}</td></tr>`).join('')||'<tr><td colspan="7">Bu yorqinlikda komet topilmadi — chegarani oshiring.</td></tr>'}</tbody></table></div><p class="lab-note">Koordinatalarni teleskopga yoki «Osmon xaritasi»ga qo‘lda kiriting. Aniq efemeridalar uchun JPL Horizons yoki MPC'ga qarang. Qo‘llangan formula: m = M1 + 5·lg Δ + K1·lg r (K1 yo‘q bo‘lsa 10). Sublimatsiya, halo va koma o‘lchamini hisobga olmaydi.</p>`;};
  $('#cmL',body).onchange=e=>{cm.lim=+e.target.value;show();};$('#cmR',body).onclick=()=>{cm.rows=null;out.textContent='Yuklanmoqda…';show();};show();
 }

 function snTab(body){
  body.innerHTML=`<div class="ob-sum"><b>Yangi supernovalar</b><br>Ochiq, kalitsiz va brauzerdan to‘g‘ridan-to‘g‘ri ishlaydigan ishonchli ro‘yxat manbasi topilmadi: Transient Name Server (TNS) API kalit talab qiladi, boshqa ro‘yxatlar esa brauzer so‘roviga ruxsat bermaydi. Shuning uchun bu yerda avtomatik ro‘yxat <b>yo‘q</b> — o‘rniga ishonchli manbalarga havolalar:</div>
  <div class="lab-row"><a class="ob-link" href="https://www.wis-tns.org/" target="_blank" rel="noopener noreferrer">TNS — rasmiy ro‘yxat</a><a class="ob-link" href="https://www.rochesterastronomy.org/supernova.html" target="_blank" rel="noopener noreferrer">Latest Supernovae (yorqin, ko‘rinadiganlar)</a><a class="ob-link" href="https://www.aavso.org/" target="_blank" rel="noopener noreferrer">AAVSO — o‘zgaruvchan yulduzlar</a></div><p class="lab-note">Yorqin (≤ 14ᵐ) supernova topsangiz, koordinatasini «Teleskop → Ko‘rish maydoni» bo‘limidagi galaktika yaqinidan qidiring (galaktikalar OpenNGC katalogida bor).</p>`;}
})();
