(()=>{'use strict';
 if(!window.KoinotLab||!window.Astronomy)return;
 const {$,esc,fmt,pad,OFFSET,hm,stamp,longDate,inputValue,parseInput,hidpi,MONTHS}=KX,A=Astronomy;
 const CITIES=[['Toshkent',41.2995,69.2401,455],['Samarqand',39.6542,66.9597,720],['Buxoro',39.7747,64.4286,225],['Xiva',41.3775,60.3619,100],['Nukus',42.4531,59.6103,75],['Urganch',41.5506,60.6317,100],['Namangan',41.0011,71.6726,450],['Andijon',40.7821,72.3442,480],['Farg‘ona',40.3834,71.7843,580],['Qarshi',38.8606,65.7891,370],['Termiz',37.2242,67.2783,310],['Jizzax',40.1158,67.8422,380],['Guliston',40.4897,68.7842,300],['Navoiy',40.0844,65.3792,340]];
 const BODIES=[['Sun','Quyosh','#ffd36b'],['Moon','Oy','#e8eef7'],['Mercury','Merkuriy','#c9b8a6'],['Venus','Venera','#fff0c8'],['Mars','Mars','#ff7d5c'],['Jupiter','Yupiter','#f2d2a0'],['Saturn','Saturn','#e8d08a'],['Uranus','Uran','#8fe3ea'],['Neptune','Neptun','#7aa2ff']];
 const starByName=new Map(KOINOT_BRIGHT.map(s=>[s[0],s]));
window.KX.CITIES=CITIES;
 const sky={city:0,lat:CITIES[0][1],lon:CITIES[0][2],h:CITIES[0][3],date:new Date(),play:false,sel:null,names:true,lines:true,dso:true,ngc:false};
 window.KX.sky=sky;
 const SD=window.KOINOT_SKY||null,RAD=Math.PI/180;

 function frameOf(t,obs){const R=A.Rotation_EQJ_EQD(t),lst=(A.SiderealTime(t)*15+obs.longitude)*RAD;return {R,t,lst,sp:Math.sin(obs.latitude*RAD),cp:Math.cos(obs.latitude*RAD)};}
 function horF(F,raDeg,dec){const a=raDeg*RAD,d=dec*RAD,cd=Math.cos(d),v=A.RotateVector(F.R,{x:cd*Math.cos(a),y:cd*Math.sin(a),z:Math.sin(d),t:F.t});const ra=Math.atan2(v.y,v.x),de=Math.asin(Math.max(-1,Math.min(1,v.z))),H=F.lst-ra,sd=Math.sin(de),c2=Math.cos(de);
  const alt=Math.asin(sd*F.sp+c2*F.cp*Math.cos(H));let az=Math.atan2(-c2*Math.sin(H),sd*F.cp-c2*F.sp*Math.cos(H))/RAD;if(az<0)az+=360;return {alt:alt/RAD,az};}
 const horJ=(F,raH,dec)=>horF(F,raH*15,dec);
 const BR_XY=KOINOT_BRIGHT.map(s=>[s[1]*15,s[2]]);
 const FAINT=SD?SD.stars.filter(f=>!BR_XY.some(b=>Math.abs(b[1]-f[1])<.2&&Math.abs(((b[0]-f[0]+540)%360)-180)<.2/Math.max(.1,Math.cos(f[1]*RAD)))):[];
 const ZOD={Ari:'Hamal',Tau:'Savr',Gem:'Javzo',Cnc:'Saraton',Leo:'Asad',Vir:'Sunbula',Lib:'Mezon',Sco:'Aqrab',Sgr:'Qavs',Cap:'Jaddiy',Aqr:'Dalv',Psc:'Hut'};
 const DSO_UZ={G:'Galaktika',GCl:'Sharsimon yulduz to‘dasi',OCl:'Sochma yulduz to‘dasi',PN:'Planetar tumanlik',Neb:'Tumanlik',HII:'Ionlashgan vodorod tumanligi',SNR:'O‘ta yangi yulduz qoldig‘i','Cl+N':'Yulduz to‘dasi va tumanlik',RfN:'Aks ettiruvchi tumanlik',EmN:'Nurlanuvchi tumanlik','*Ass':'Yulduzlar assotsiatsiyasi',Other:'Boshqa',Nova:'Yangi yulduz'};
 const DSO_NAME={M31:'Andromeda galaktikasi',M42:'Orion tumanligi',M45:'Parvin (Pleyadalar)'};
 function hor(date,obs,ra,dec){const h=A.Horizon(date,obs,ra,dec,'normal');return {alt:h.altitude,az:h.azimuth};}
 function compute(){
  const obs=new A.Observer(sky.lat,sky.lon,sky.h),t=new A.AstroTime(sky.date),out={obs,stars:[],bodies:[]};
  const F=frameOf(t,obs);out.F=F;
  for(const s of KOINOT_BRIGHT){const h=horJ(F,s[1],s[2]);out.stars.push({name:s[0],mag:s[3],info:s[4],...h});}
  for(const [k,uz,color] of BODIES){const eq=A.Equator(k,t,obs,true,true),h=hor(t,obs,eq.ra,eq.dec);let mag=k==='Sun'?-26.7:null,frac=null;if(k!=='Sun'){const il=A.Illumination(k,t);mag=il.mag;frac=il.phase_fraction;}out.bodies.push({key:k,name:uz,color,mag,frac,ra:eq.ra,dec:eq.dec,...h});}
  out.bh=KOINOT_BH.filter(b=>b.ra!=null).map(b=>({key:'bh:'+b.id,name:b.name,info:'Qora tuynuk ('+b.kind+') · '+b.con+' · ≈ '+fmt(b.ly,0)+' y.y. Ko‘z bilan ko‘rinmaydi: bu faqat yo‘nalish.',...horJ(F,b.ra,b.dec)}));if(SD){out.fs=FAINT.map(f=>{const h=horF(F,f[0],f[1]);return {mag:f[2],bv:f[3],alt:h.alt,az:h.az,name:f[5]||null,key:f[5]?'hip:'+f[4]:null,info:f[5]?'HIP '+f[4]+' · B−V = '+fmt(f[3],2)+' (rang indeksi)':null};});out.fsn=out.fs.filter(x=>x.name);
  out.cons=SD.cons.map(c=>({id:c[0],name:c[1],c:horF(F,c[2],c[3]),segs:c[4].map(pl=>pl.map(q=>horF(F,q[0],q[1])))}));
  out.dsos=SD.dso.map(d=>{const h=horF(F,d[3]*15/15*1,d[4]);return {key:'dso:'+(d[0]||d[1]),m:d[0],label:d[1],type:d[2],mag:d[5],size:d[6],con:d[7],common:d[8],name:(d[0]?d[0]+' · ':'')+(DSO_NAME[d[0]]||d[8]||d[1])+(d[0]&&(DSO_NAME[d[0]]||d[8])?'':d[0]?' ('+d[1]+')':''),alt:h.alt,az:h.az,info:(DSO_UZ[d[2]]||d[2])+' · '+d[7]+' turkumi'+(d[6]?' · o‘lchami ≈ '+fmt(d[6],1)+'′':'')+(d[5]==null?'':' · ko‘rinma kattalik ≈ '+fmt(d[5],1))+(d[5]==null?'':d[5]<=6?' (qorong‘u osmonda ko‘z bilan ko‘rinishi mumkin)':d[5]<=9.5?' (durbin/binokl bilan)':' (teleskop kerak)')+'. Katalog: OpenNGC.'};});}
  out.sunAlt=out.bodies[0].alt;return out;
 }
 function riseSet(obs){const d=new Date(sky.date.getTime()+OFFSET*3600e3);const start=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())-OFFSET*3600e3);const rows={};for(const [k] of BODIES){const r=A.SearchRiseSet(k,obs,+1,start,1),s=A.SearchRiseSet(k,obs,-1,start,1);rows[k]={rise:r?.date,set:s?.date};}return rows;}
 function twilight(alt){return alt>0?'Kunduz':alt>-6?'Fuqaro alacasi':alt>-12?'Dengizchi alacasi':alt>-18?'Astronomik alaca':'To‘liq qorong‘u';}
 function project(alt,az,cx,cy,R){const r=(90-alt)/90*R,a=az*Math.PI/180;return [cx-r*Math.sin(a),cy-r*Math.cos(a)];}
 function draw(canvas,data){
  const {ctx,w,h}=hidpi(canvas),cx=w/2,cy=h/2,R=Math.min(w,h)/2-22;
  const sa=data.sunAlt,k=Math.max(0,Math.min(1,(sa+18)/18));
  const bg=ctx.createRadialGradient(cx,cy,R*.1,cx,cy,R);const mix=(a,b)=>Math.round(a+(b-a)*k);
  bg.addColorStop(0,`rgb(${mix(3,38)},${mix(8,80)},${mix(18,140)})`);bg.addColorStop(1,`rgb(${mix(6,70)},${mix(14,120)},${mix(30,170)})`);
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#02060c';ctx.fillRect(0,0,w,h);ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.fillStyle=bg;ctx.fill();ctx.strokeStyle='#4d86b0';ctx.lineWidth=1.5;ctx.stroke();
  ctx.save();ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.clip();
  ctx.strokeStyle='#ffffff18';ctx.lineWidth=1;for(const alt of [30,60]){ctx.beginPath();ctx.arc(cx,cy,(90-alt)/90*R,0,7);ctx.stroke();}
  ctx.beginPath();for(let a=0;a<360;a+=45){const [x,y]=project(0,a,cx,cy,R);ctx.moveTo(cx,cy);ctx.lineTo(x,y);}ctx.stroke();
  const pos=new Map(data.stars.map(s=>[s.name,s]));
  if(sky.lines&&data.cons){ctx.strokeStyle='#7fc6ff77';ctx.lineWidth=1.2;ctx.beginPath();for(const c of data.cons)for(const pl of c.segs)for(let i=1;i<pl.length;i++){const p=pl[i-1],q=pl[i];if(p.alt<-1&&q.alt<-1)continue;const [x1,y1]=project(p.alt,p.az,cx,cy,R),[x2,y2]=project(q.alt,q.az,cx,cy,R);ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);}ctx.stroke();}
  else if(sky.lines){ctx.strokeStyle='#7fc6ff55';ctx.lineWidth=1.2;for(const segs of Object.values(KOINOT_LINES))for(const [a,b] of segs){const p=pos.get(a),q=pos.get(b);if(!p||!q||(p.alt<-2&&q.alt<-2))continue;const [x1,y1]=project(p.alt,p.az,cx,cy,R),[x2,y2]=project(q.alt,q.az,cx,cy,R);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}}
  const fade=sa>-6?Math.max(.12,1-(sa+6)/20):1;
  if(data.fs){const cols=bv=>bv<.2?'#cfe0ff':bv<.65?'#ffffff':bv<1.1?'#ffeccb':'#ffcfa3';
   for(const f of data.fs){f.sx=null;if(f.alt<0)continue;const [x,y]=project(f.alt,f.az,cx,cy,R),r=Math.max(.55,(6.7-f.mag)*.3);f.sx=x;f.sy=y;ctx.globalAlpha=fade*Math.min(1,.22+(6.3-f.mag)*.22);ctx.fillStyle=cols(f.bv);ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();if(sky.names&&f.name&&f.mag<2.7&&sa<-4){ctx.globalAlpha=.7;ctx.fillStyle='#bfe2ff';ctx.font='10px system-ui';ctx.fillText(f.name,x+r+3,y+3);}}
   ctx.globalAlpha=1;}
  if(data.cons&&sky.names&&sa<-6){ctx.font='italic 10px system-ui';ctx.textAlign='center';ctx.fillStyle='#7fc6ff';ctx.globalAlpha=.5*fade;for(const c of data.cons){if(c.c.alt<6)continue;const [x,y]=project(c.c.alt,c.c.az,cx,cy,R);ctx.fillText(c.name+(ZOD[c.id]?' · '+ZOD[c.id]:''),x,y);}ctx.globalAlpha=1;ctx.textAlign='left';}
  if(data.dsos&&sky.dso&&sa<-9){const dk=Math.min(1,(-sa-9)/6),pxd=R/90;for(const d of data.dsos){d.sx=null;if(d.alt<2||(!d.m&&!sky.ngc))continue;const [x,y]=project(d.alt,d.az,cx,cy,R),r=Math.max(3.4,Math.min(13,(d.size||0)/60*pxd*.5));d.sx=x;d.sy=y;ctx.globalAlpha=dk*(d.m?.95:.7);ctx.lineWidth=1.2;
    const t=d.type;if(t==='G'){ctx.strokeStyle='#ffb98a';ctx.beginPath();ctx.ellipse(x,y,r*1.3,r*.7,.5,0,7);ctx.stroke();}
    else if(t==='OCl'||t==='*Ass'){ctx.strokeStyle='#ffe08a';ctx.setLineDash([2,2]);ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();ctx.setLineDash([]);}
    else if(t==='GCl'){ctx.strokeStyle='#ffd08a';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.moveTo(x-r,y);ctx.lineTo(x+r,y);ctx.moveTo(x,y-r);ctx.lineTo(x,y+r);ctx.stroke();}
    else if(t==='PN'){ctx.strokeStyle='#7fffd4';ctx.beginPath();ctx.arc(x,y,r*.8,0,7);ctx.stroke();ctx.fillStyle='#7fffd4';ctx.beginPath();ctx.arc(x,y,1.2,0,7);ctx.fill();}
    else{ctx.strokeStyle='#ff9ec7';ctx.strokeRect(x-r*.8,y-r*.8,r*1.6,r*1.6);}
    if(sky.names&&d.m&&((d.mag!=null&&d.mag<=8.2)||d.size>=30||sky.sel===d.key)){ctx.globalAlpha=dk*.85;ctx.fillStyle='#ffd9b8';ctx.font='10px system-ui';ctx.fillText(d.m,x+r*1.3+3,y+3);}}ctx.globalAlpha=1;}
  data.stars.forEach(s=>{s.sx=null;if(s.alt<0)return;const [x,y]=project(s.alt,s.az,cx,cy,R),r=Math.max(1.1,3.6-s.mag*.9);s.sx=x;s.sy=y;ctx.globalAlpha=fade*Math.min(1,.55+(3.4-s.mag)*.2);ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fillStyle='#fff';ctx.fill();if(sky.names&&s.mag<2.1&&sa<-4){ctx.globalAlpha=.8;ctx.fillStyle='#bfe2ff';ctx.font='10px system-ui';ctx.fillText(s.name,x+r+3,y+3);}});
  ctx.globalAlpha=1;
  data.bodies.forEach(b=>{b.sx=null;if(b.alt<0)return;const [x,y]=project(b.alt,b.az,cx,cy,R),r=b.key==='Sun'?9:b.key==='Moon'?7:4.2;b.sx=x;b.sy=y;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fillStyle=b.color;ctx.globalAlpha=b.key==='Moon'?.45+.55*(b.frac??1):1;ctx.fill();ctx.globalAlpha=1;if(b.key==='Sun'){ctx.strokeStyle='#ffd36b88';ctx.lineWidth=3;ctx.stroke();}ctx.fillStyle='#fff';ctx.font='11px system-ui';ctx.fillText(b.name,x+r+4,y+4);});
  data.bh.forEach(b=>{b.sx=null;if(b.alt<0)return;const [x,y]=project(b.alt,b.az,cx,cy,R);b.sx=x;b.sy=y;ctx.beginPath();ctx.arc(x,y,6,0,7);ctx.fillStyle='#000';ctx.fill();ctx.strokeStyle='#ffb35c';ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.arc(x,y,10,0,7);ctx.strokeStyle='#ffb35c55';ctx.lineWidth=1;ctx.stroke();ctx.fillStyle='#ffd7a0';ctx.font='11px system-ui';ctx.fillText('● '+b.name,x+13,y+4);});
  if(sky.sel){const o=[...data.stars,...data.bodies,...data.bh,...(data.fsn||[]),...(data.dsos||[])].find(x=>x&&(x.key||x.name)===sky.sel);if(o?.sx!=null){ctx.strokeStyle='#5cd5ff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(o.sx,o.sy,13,0,7);ctx.stroke();}}
  ctx.restore();
  ctx.fillStyle='#9fd4ff';ctx.font='12px system-ui';ctx.textAlign='center';[['Sh',0],['G‘',90],['J',180],['Sq',270]].forEach(([t,a])=>{const [x,y]=project(-9,a,cx,cy,R);ctx.fillText(t,x,y+4);});ctx.textAlign='left';
 }
 function skyTab(body){
  body.innerHTML=`<div class="x-grid"><div class="x-main"><canvas class="lab-view x-sky" aria-label="Osmon xaritasi"></canvas><div class="x-hint">Xarita tepasi — zenit, chetlari — ufq. Sharq chapda (osmonga qaralgandagidek). Obyektni bosing.</div></div>
  <div class="x-side"><div class="lab-row"><label>Shahar <select id="skCity">${CITIES.map((c,i)=>`<option value="${i}">${c[0]}</option>`).join('')}<option value="-1">Boshqa joy…</option></select></label></div>
  <div class="lab-row x-custom" hidden><label>Kenglik° <input id="skLat" type="number" step="0.01" min="-90" max="90" style="width:90px"></label><label>Uzunlik° <input id="skLon" type="number" step="0.01" min="-180" max="180" style="width:90px"></label></div>
  <div class="lab-row"><label>Mahalliy vaqt (UTC+${OFFSET}) <input id="skTime" type="datetime-local"></label></div>
  <div class="lab-row"><button id="skFull" title="Xaritani butun ekranga yoyish (Esc — chiqish)">⛶ Katta ekran</button></div>
  <div class="lab-row"><button id="skNow">Hozir</button><button id="skM">−1 soat</button><button id="skP">+1 soat</button><button id="skPlay">▶ Harakat</button></div>
  <div class="lab-row"><label><input id="skLines" type="checkbox" checked> Turkum chiziqlari</label><label><input id="skNames" type="checkbox" checked> Nomlar</label></div>
  <div class="lab-row"><label><input id="skDso" type="checkbox" checked> Messier obyektlari</label><label><input id="skNgc" type="checkbox"> NGC/IC (≤10,2)</label></div>
  <div class="lab-result" id="skInfo"></div></div></div><div id="skTable"></div>
  <p class="lab-note">Joylashuv Astronomy Engine bilan hisoblanadi (sayyoralar, Oy, Quyosh). Joylashuv Astronomy Engine bilan hisoblanadi (sayyoralar, Oy, Quyosh, qora tuynuk yo‘nalishlari). Yulduzlar: 6-kattalikkacha ≈ 5000 ta (d3-celestial, Hipparcos/Tycho asosida) + 68 ta tanlangan yorqin yulduz; turkum chiziqlari — 88 turkum (IAU). Chuqur osmon: barcha Messier va yorqinligi ≤ 10,2 bo‘lgan NGC/IC obyektlari (OpenNGC, CC-BY-SA 4.0); ular faqat osmon yetarlicha qorong‘u bo‘lganda (Quyosh −9° dan past) ko‘rsatiladi. Yulduz koordinatalari J2000 dan sana ekvatoriga (presessiya, nutatsiya) o‘tkazilgan; atmosfera sinishi yulduzlar uchun hisobga olinmagan (ufq yaqinida ≈0,5° gacha farq). Samoviy Somon Yo‘li polosasi chizilmagan. Burj nomlari (Hamal, Savr…) — an’anaviy. O‘zbekistonda yozgi vaqt yo‘q: UTC+5. Atmosfera sinishi hisobga olingan, ob-havo va yorug‘lik ifloslanishi esa — yo‘q.</p>`;
  const canvas=$('.x-sky',body);let data=compute();
  const set=()=>{$('#skTime',body).value=inputValue(sky.date);};
  const info=()=>{const o=[...data.stars,...data.bodies,...data.bh,...(data.fsn||[]),...(data.dsos||[])].find(x=>(x.key||x.name)===sky.sel);const moon=data.bodies[1];let h=`<b>${esc(twilight(data.sunAlt))}</b> · Quyosh balandligi ${fmt(data.sunAlt,1)}°<br>Oy yorug‘ligi: ${fmt(moon.frac*100,0)}%`;if(o)h+=`<hr style="border:0;border-top:1px solid #254259"><b>${esc(o.name)}</b> · balandlik ${fmt(o.alt,1)}°, azimut ${fmt(o.az,0)}°${o.mag!=null?' · kattalik '+fmt(o.mag,2):''}${o.info?'<br>'+esc(o.info):''}${o.alt<0?'<br>Hozir ufq ostida.':''}`;$('#skInfo',body).innerHTML=h;};
  const table=()=>{const rs=riseSet(data.obs);$('#skTable',body).innerHTML=`<table class="lab-table"><tr><th>Jism</th><th>Kattalik</th><th>Chiqishi</th><th>Botishi</th><th>Balandlik</th><th>Holat</th></tr>${data.bodies.map(b=>{const r=rs[b.key];const st=b.key==='Sun'?twilight(b.alt):b.alt<0?'Ufq ostida':data.sunAlt<-6?'Ko‘rinadi':'Yorug‘ osmonda';return `<tr><td>${b.name}</td><td>${b.mag==null?'—':fmt(Math.abs(b.mag)<.05?0:b.mag,1)}</td><td>${hm(r.rise)}</td><td>${hm(r.set)}</td><td>${fmt(b.alt,1)}°</td><td>${st}</td></tr>`;}).join('')}</table><p class="lab-note">Chiqish/botish vaqtlari tanlangan mahalliy sana uchun (UTC+${OFFSET}); «—» — shu sutkada chiqmaydi/botmaydi.</p>`;};
  const refresh=(full=true)=>{data=compute();draw(canvas,data);info();if(full)table();};
  const loc=()=>{const i=+$('#skCity',body).value;$('.x-custom',body).hidden=i>=0;if(i>=0){const c=CITIES[i];sky.lat=c[1];sky.lon=c[2];sky.h=c[3];}else{sky.lat=+$('#skLat',body).value||0;sky.lon=+$('#skLon',body).value||0;sky.h=0;}refresh();};
  $('#skCity',body).value=sky.city;$('#skLat',body).value=sky.lat;$('#skLon',body).value=sky.lon;set();
  $('#skCity',body).onchange=()=>{sky.city=+$('#skCity',body).value;loc();};$('#skLat',body).onchange=$('#skLon',body).onchange=loc;
  $('#skTime',body).onchange=()=>{const d=parseInput($('#skTime',body).value);if(d){sky.date=d;refresh();}};
  $('#skNow',body).onclick=()=>{sky.date=new Date();set();refresh();};
  $('#skM',body).onclick=()=>{sky.date=new Date(sky.date.getTime()-3600e3);set();refresh();};$('#skP',body).onclick=()=>{sky.date=new Date(sky.date.getTime()+3600e3);set();refresh();};
  $('#skPlay',body).onclick=()=>{sky.play=!sky.play;$('#skPlay',body).textContent=sky.play?'❚❚ To‘xtatish':'▶ Harakat';};
  $('#skLines',body).onchange=e=>{sky.lines=e.target.checked;refresh(false);};$('#skNames',body).onchange=e=>{sky.names=e.target.checked;refresh(false);};$('#skDso',body).onchange=e=>{sky.dso=e.target.checked;refresh(false);};$('#skNgc',body).onchange=e=>{sky.ngc=e.target.checked;if(sky.ngc){sky.dso=true;$('#skDso',body).checked=true;}refresh(false);};
  canvas.onclick=e=>{const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;let best=null,bd=18;for(const o of [...data.bh,...data.bodies,...(data.dsos||[]),...(data.fsn||[]),...data.stars]){if(o.sx==null)continue;const d=Math.hypot(o.sx-x,o.sy-y);if(d<bd){bd=d;best=o;}}sky.sel=best?(best.key||best.name):null;draw(canvas,data);info();};
  let acc=0;KoinotLab.state.labTick=dt=>{if(!sky.play)return;acc+=dt;if(acc<.1)return;sky.date=new Date(sky.date.getTime()+acc*900e3*1);acc=0;data=compute();draw(canvas,data);set();info();};
  KoinotLab.state.cleanup=()=>{sky.play=false;};
  const dlg=body.closest('dialog');
  const setFull=on=>{if(!dlg)return;dlg.classList.toggle('sky-full',on);$('#skFull',body).textContent=on?'⮌ Kichraytirish':'⛶ Katta ekran';requestAnimationFrame(()=>requestAnimationFrame(()=>{draw(canvas,data);}));};
  $('#skFull',body).onclick=()=>setFull(!dlg.classList.contains('sky-full'));
  const onRs=()=>draw(canvas,data);window.addEventListener('resize',onRs);
  const oldClean=KoinotLab.state.cleanup;KoinotLab.state.cleanup=()=>{oldClean?.();window.removeEventListener('resize',onRs);dlg?.classList.remove('sky-full');};
  KX.skyFull=on=>setFull(on!==false);
  loc();
  window.KX.sky=sky;sky.compute=compute;
 }

 const SHOWERS=[['Kvadrantidlar',1,3.5,'≈ 80'],['Liridlar',4,22,'≈ 18'],['Eta-Akvaridlar',5,6,'≈ 50'],['Perseidlar',8,12.5,'≈ 100'],['Orionidlar',10,21,'≈ 20'],['Leonidlar',11,17.5,'≈ 15'],['Geminidlar',12,14,'≈ 150'],['Ursidlar',12,22,'≈ 10']];
 const calState={year:new Date().getFullYear(),city:0};
 function events(year,cityIdx){
  const ev=[],start=new Date(Date.UTC(year-1,11,31,19)),end=new Date(Date.UTC(year,11,31,19)),c=CITIES[cityIdx],obs=new A.Observer(c[1],c[2],c[3]);
  const add=(date,type,title,detail='')=>{if(date>=start&&date<end)ev.push({date,type,title,detail});};
  const se=A.Seasons(year);add(se.mar_equinox.date,'sezon','Bahorgi tengkunlik');add(se.jun_solstice.date,'sezon','Yozgi quyosh turishi');add(se.sep_equinox.date,'sezon','Kuzgi tengkunlik');add(se.dec_solstice.date,'sezon','Qishki quyosh turishi');
  const names=['Yangi oy','Oy to‘linligi'];let q=A.SearchMoonQuarter(start);for(let n=0;n<60&&q.time.date<end;n++){const nm=['Yangi oy','Birinchi chorak','To‘lin oy','Oxirgi chorak'][q.quarter];add(q.time.date,'oy',nm);q=A.NextMoonQuarter(q);}
  let le=A.SearchLunarEclipse(start);while(le.peak.date<end){const kind={penumbral:'penumbral (xira)',partial:'qisman',total:'to‘liq'}[le.kind]||le.kind;add(le.peak.date,'tutilish','Oy tutilishi — '+kind,'Tutilishning maksimumi; ko‘rinishi Oy ufq ustida bo‘lishiga bog‘liq. Tekshirish: '+c[0]+'da Oy balandligi '+fmt(A.Horizon(le.peak.date,obs,...(()=>{const e=A.Equator('Moon',le.peak,obs,true,true);return [e.ra,e.dec,'normal'];})()).altitude,0)+'°.');le=A.NextLunarEclipse(le.peak);}
  let se2=A.SearchGlobalSolarEclipse(start);while(se2.peak.date<end){const kind={partial:'qisman',annular:'halqasimon',total:'to‘liq',hybrid:'gibrid'}[se2.kind]||se2.kind;add(se2.peak.date,'tutilish','Quyosh tutilishi — '+kind,'Global maksimum nuqtasi: '+fmt(Math.abs(se2.latitude),1)+'°'+(se2.latitude>=0?'Sh':'J')+', '+fmt(Math.abs(se2.longitude),1)+'°'+(se2.longitude>=0?'Sh':'G‘')+'.');se2=A.NextGlobalSolarEclipse(se2.peak);}
  let ls=A.SearchLocalSolarEclipse(start,obs);for(let n=0;n<4&&ls.peak.time.date<end;n++){if(ls.peak.altitude>0)add(ls.peak.time.date,'tutilish',c[0]+'da Quyosh tutilishi ko‘rinadi — '+({partial:'qisman',annular:'halqasimon',total:'to‘liq'}[ls.kind]||ls.kind),'Maksimumda Quyosh balandligi '+fmt(ls.peak.altitude,0)+'°, yopilish ≈ '+fmt(ls.obscuration*100,0)+'%. Ko‘zga zararli: faqat maxsus filtr bilan kuzating!');ls=A.NextLocalSolarEclipse(ls.peak.time,obs);}
  for(const k of ['Mars','Jupiter','Saturn','Uranus','Neptune']){const uz={Mars:'Mars',Jupiter:'Yupiter',Saturn:'Saturn',Uranus:'Uran',Neptune:'Neptun'}[k];const o=A.SearchRelativeLongitude(k,0,start);if(o&&o.date>=start&&o.date<end){const mag=A.Illumination(k,o).mag;add(o.date,'sayyora',uz+' qarama-qarshiligi','Yer–sayyora eng yaqin va kechasi to‘liq ko‘rinadigan davr; kattalik ≈ '+fmt(mag,1)+'.');}}
  for(const k of ['Mercury','Venus']){const uz=k==='Mercury'?'Merkuriy':'Venera';let m=A.SearchMaxElongation(k,start);for(let n=0;n<8&&m.time.date<end;n++){add(m.time.date,'sayyora',uz+' — eng katta uzoqlashuv ('+(m.visibility==='morning'?'tong':'kech')+'da)','Quyoshdan burchak masofa ≈ '+fmt(m.elongation,1)+'°; kuzatish uchun eng qulay payt.');m=A.SearchMaxElongation(k,new Date(m.time.date.getTime()+25*86400e3));}}
  for(const [name,mo,day,zhr] of SHOWERS){const d=new Date(Date.UTC(year,mo-1,Math.floor(day),Math.round((day%1)*24)));const il=A.Illumination('Moon',new A.AstroTime(d));add(d,'meteor',name+' meteor oqimi','Odatdagi cho‘qqi sanasi; soatiga ≈ '+zhr+' (ZHR, ideal sharoit). Shu kuni Oy yorug‘ligi ≈ '+fmt(il.phase_fraction*100,0)+'% — '+(il.phase_fraction<.3?'kuzatish uchun qulay.':il.phase_fraction>.7?'yorqin Oy xira meteorlarni pasaytiradi.':'o‘rtacha.'));}
  return ev.sort((a,b)=>a.date-b.date);
 }
 function calTab(body){
  const now=new Date();body.innerHTML=`<div class="lab-row"><label>Davr <select id="cPer"><option value="year">Tanlangan yil</option><option value="next"${calState.next?' selected':''}>Kelgusi 12 oy</option></select></label><label>Yil <input id="cYear" type="number" min="1950" max="2100" value="${calState.year}" style="width:90px"></label><label>Shahar <select id="cCity">${CITIES.map((c,i)=>`<option value="${i}" ${i===calState.city?'selected':''}>${c[0]}</option>`).join('')}</select></label>
  <label>Turi <select id="cType"><option value="">Hammasi</option><option value="tutilish">Tutilishlar</option><option value="sayyora">Sayyoralar</option><option value="oy">Oy fazalari</option><option value="meteor">Meteor oqimlari</option><option value="sezon">Fasllar</option></select></label></div><div class="ob-sum" id="cNext"></div><div id="cList"></div>
  <p class="lab-note">Vaqtlar UTC+${OFFSET} bo‘yicha. Tutilish, Oy fazalari, sayyora qarama-qarshiliklari va uzoqlashuvlar Astronomy Engine bilan hisoblanadi (daqiqalar aniqligida). Meteor oqimlarining cho‘qqi sanalari — odatiy, yildan yilga ±1 kun o‘zgaradi; ZHR — ideal osmondagi taxminiy ko‘rsatkich.</p>`;
  const icons={tutilish:'◐',sayyora:'✦',oy:'☾',meteor:'☄',sezon:'☀'};
  const render=()=>{calState.year=Math.max(1950,Math.min(2100,+$('#cYear',body).value||calState.year));calState.city=+$('#cCity',body).value;const f=$('#cType',body).value;calState.next=$('#cPer',body).value==='next';let list;try{if(calState.next){const y=new Date().getFullYear(),t0=Date.now(),t1=t0+365*864e5;list=[...events(y,calState.city),...events(y+1,calState.city)].filter(e=>+e.date>=t0&&+e.date<=t1);}else list=events(calState.year,calState.city);}catch(err){$('#cList',body).innerHTML='<div class="lab-result">Hisoblashda xatolik: '+esc(err.message)+'</div>';return;}
   $('#cList',body).innerHTML=`<table class="lab-table x-cal"><tr><th></th><th>Sana (UTC+${OFFSET})</th><th>Hodisa</th><th>Tafsilot</th><th></th></tr>${list.filter(e=>!f||e.type===f).map(e=>`<tr class="${e.date<now&&calState.year===now.getFullYear()?'x-past':''}"><td>${icons[e.type]}</td><td>${stamp(e.date)}</td><td><b>${esc(e.title)}</b></td><td>${esc(e.detail)}</td><td>${e.date>now?`<button data-al="${+e.date}" data-ty="${e.type}" data-t="${esc(e.title)}" title="Budilnik qo‘yish">⏰</button>`:''}</td></tr>`).join('')}</table>`;
   const nx=list.find(e=>e.date>now&&e.type!=='oy'&&e.type!=='sezon');const dd=nx?(+nx.date-+now)/864e5:0;$('#cNext',body).innerHTML=nx?`<b>Eng yaqin muhim hodisa:</b> ${esc(nx.title)} — ${stamp(nx.date)} (${dd<1?Math.max(1,Math.round(dd*24))+' soatdan keyin':Math.round(dd)+' kundan keyin'}).`:'Tanlangan davrda kelgusi hodisa yo‘q.';};
  body.onclick=e=>{const b=e.target.closest('[data-al]');if(!b)return;if(!KX.alarm){KX.scope?.toast?.('Budilnik moduli yuklanmagan');return;}let at=+b.dataset.al,lead=60;if(b.dataset.ty==='meteor'){const d=new Date(at+OFFSET*36e5);at=Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate(),22-OFFSET,0);lead=0;}if(at<Date.now()){KX.scope?.toast?.('Bu vaqt o‘tib ketgan');return;}KX.alarm.add({type:'time',at,label:b.dataset.t,lead,repeat:'once'});KX.scope?.toast?.('Budilnik qo‘shildi: '+b.dataset.t+(b.dataset.ty==='meteor'?' (o‘sha kuni 22:00)':' (1 soat oldin ogohlantiradi)'));};
  $('#cYear',body).onchange=$('#cCity',body).onchange=$('#cType',body).onchange=$('#cPer',body).onchange=render;render();
 }
 KX.tab('sky','Osmon xaritasi',skyTab);KX.tab('cal','Kuzatish kalendari',calTab);
 KX.skyCompute=compute;KX.skyEvents=events;
})();
