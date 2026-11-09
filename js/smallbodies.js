(()=>{'use strict';
 if(!window.KoinotLab||!window.KX||!window.KOINOT_SB)return;
 const {$,esc,fmt,hidpi}=KX,A=window.Astronomy,SB=window.KOINOT_SB,D2R=Math.PI/180;
 const n=SB.n;

 const b64=Uint8Array.from(atob(SB.b64),c=>c.charCodeAt(0)),dv=new DataView(b64.buffer);
 let off=0;const rdF=()=>{const a=new Float32Array(n);for(let i=0;i<n;i++)a[i]=dv.getFloat32(off+i*4,true);off+=n*4;return a;};
 const rdU=()=>{const a=new Uint16Array(n);for(let i=0;i<n;i++)a[i]=dv.getUint16(off+i*2,true);off+=n*2;return a;};
 const sa=rdF(),se=rdU(),si=rdU(),sN=rdU(),sw=rdU(),sM=rdU(),sep=rdU();const sH=b64.subarray(off,off+n);off+=n;const cls=b64.subarray(off,off+n);
 const names=SB.names.split('\n');
 const a=sa,e=new Float32Array(n),Px=new Float32Array(n),Py=new Float32Array(n),Pz=new Float32Array(n),Qx=new Float32Array(n),Qy=new Float32Array(n),Qz=new Float32Array(n),nn=new Float32Array(n),M0=new Float32Array(n),bb=new Float32Array(n),E0=new Float32Array(n);
 for(let k=0;k<n;k++){e[k]=se[k]/20000;const inc=si[k]/300*D2R,N=sN[k]*360/65536*D2R,w=sw[k]*360/65536*D2R;M0[k]=sM[k]*360/65536*D2R;E0[k]=sep[k];
  const cw=Math.cos(w),sw_=Math.sin(w),cN=Math.cos(N),sN_=Math.sin(N),ci=Math.cos(inc),si_=Math.sin(inc);
  Px[k]=cw*cN-sw_*sN_*ci;Py[k]=cw*sN_+sw_*cN*ci;Pz[k]=sw_*si_;Qx[k]=-sw_*cN-cw*sN_*ci;Qy[k]=-sw_*sN_+cw*cN*ci;Qz[k]=cw*si_;
  nn[k]=.01720209895/Math.pow(a[k],1.5);bb[k]=a[k]*Math.sqrt(1-e[k]*e[k]);}
 const X=new Float32Array(n),Y=new Float32Array(n),Z=new Float32Array(n);
 const CLS={1:['Potentsial xavfli (PHA)','#ff5a4d'],2:['Yerga yaqin asteroid (NEA)','#ffb347'],3:['Kentavr / sirtqi','#4fd8ff'],4:['Transneptun jism (TNO)','#b58cff'],5:['Boshqa','#9fb0c4']};
 const JD2000=2451544.5;
 function solveE(M,ec){M=M%(2*Math.PI);if(M>Math.PI)M-=2*Math.PI;else if(M<-Math.PI)M+=2*Math.PI;let E=ec<.8?M+ec*Math.sin(M):Math.PI*Math.sign(M||1);for(let it=0;it<12;it++){const d=(E-ec*Math.sin(E)-M)/(1-ec*Math.cos(E));E-=d;if(Math.abs(d)<1e-9)break;}return E;}
 function compute(t){
  for(let k=0;k<n;k++){const ec=e[k],E=solveE(M0[k]+nn[k]*(t-E0[k]),ec),xo=a[k]*(Math.cos(E)-ec),yo=bb[k]*Math.sin(E);
   X[k]=xo*Px[k]+yo*Qx[k];Y[k]=xo*Py[k]+yo*Qy[k];Z[k]=xo*Pz[k]+yo*Qz[k];}
 }

 const CM=SB.comets.map(c=>{const [nm,jd,q,ec,w,N,inc,H,G]=c;const wr=w*D2R,Nr=N*D2R,ir=inc*D2R,cw=Math.cos(wr),sw_=Math.sin(wr),cN=Math.cos(Nr),sN_=Math.sin(Nr),ci=Math.cos(ir),si_=Math.sin(ir);
  return {nm,T:jd-JD2000,q,e:ec,H,G,inc,Px:cw*cN-sw_*sN_*ci,Py:cw*sN_+sw_*cN*ci,Pz:sw_*si_,Qx:-sw_*cN-cw*sN_*ci,Qy:-sw_*sN_+cw*cN*ci,Qz:cw*si_,x:0,y:0,z:0};});
 function cometPos(c,t){const ec=c.e,q=c.q;let xo,yo;const dt=t-c.T;
  if(Math.abs(ec-1)<1e-4){ const W=3*.01720209895/Math.SQRT2*dt/Math.pow(q,1.5),Y_=Math.cbrt(W/2+Math.sqrt(W*W/4+1)),s=Y_-1/Y_;const tn=s;xo=q*(1-tn*tn);yo=2*q*tn;}
  else if(ec<1){const aa=q/(1-ec),E=solveE(.01720209895/Math.pow(aa,1.5)*dt,ec);xo=aa*(Math.cos(E)-ec);yo=aa*Math.sqrt(1-ec*ec)*Math.sin(E);}
  else{const aa=q/(ec-1),M=.01720209895/Math.pow(aa,1.5)*dt;let H=Math.asinh(M/ec);for(let it=0;it<30;it++){const d=(ec*Math.sinh(H)-H-M)/(ec*Math.cosh(H)-1);H-=d;if(Math.abs(d)<1e-10)break;}xo=aa*(ec-Math.cosh(H));yo=aa*Math.sqrt(ec*ec-1)*Math.sinh(H);}
  c.x=xo*c.Px+yo*c.Qx;c.y=xo*c.Py+yo*c.Qy;c.z=xo*c.Pz+yo*c.Qz;}

 const PL=[['Merkuriy','Mercury','#a39a90'],['Venera','Venus','#e8c98a'],['Yer','Earth','#4da3ff'],['Mars','Mars','#ff7a4d'],['Yupiter','Jupiter','#e0b88a'],['Saturn','Saturn','#e8d9a0'],['Uran','Uranus','#8fe0e8'],['Neptun','Neptune','#6f8fff']];
 const EPS=23.4392911*D2R,ceps=Math.cos(EPS),seps=Math.sin(EPS);
 function planets(date){return PL.map(p=>{const v=A.HelioVector(p[1],date);return {n:p[0],c:p[2],x:v.x,y:v.y*ceps+v.z*seps,z:-v.y*seps+v.z*ceps};});}
 const DIAM=(H)=>1329/Math.sqrt(.14)*Math.pow(10,-H/5);

 const ceq=Math.cos(EPS),seq=Math.sin(EPS);
 function visibility(p,earth,dateNow,mag){
  const S=KX.sky;if(!S||!A.Horizon)return '';const tz=S.city>=0?5:0,tzn=tz?'UTC+5':'UTC',obs=new A.Observer(S.lat,S.lon,S.h||0);
  const gx=p[0]-earth.x,gy=p[1]-earth.y,gz=p[2]-earth.z,ex=gx,ey=gy*ceq-gz*seq,ez=gy*seq+gz*ceq;
  const t0=dateNow.getTime(),res=[];let best=null;const hh=ms=>{const d=new Date(ms+tz*3600e3);return String(d.getUTCHours()).padStart(2,'0')+':'+String(d.getUTCMinutes()).padStart(2,'0');};
  let nightUp=[],cur=null;
  for(let i=0;i<=96;i++){const d=new Date(t0+i*900e3),t=new A.AstroTime(d),v=A.RotateVector(A.Rotation_EQJ_EQD(t),new A.Vector(ex,ey,ez,t)),q=A.EquatorFromVector(v),h=A.Horizon(d,obs,q.ra,q.dec,'normal');
   const sq=A.Equator('Sun',d,obs,true,true),sh=A.Horizon(d,obs,sq.ra,sq.dec,'normal').altitude,night=sh<-6,up=h.altitude>5;
   if(night&&up){if(best===null||h.altitude>best.a)best={a:h.altitude,az:h.azimuth,ms:d.getTime()};if(!cur)cur={a:d.getTime()};cur.b=d.getTime();}else if(cur){nightUp.push(cur);cur=null;}
   if(i===0)res.ra=q.ra,res.dec=q.dec,res.alt=h.altitude,res.az=h.azimuth,res.sun=sh;}
  if(cur)nightUp.push(cur);
  const dirs=['Sh','ShSh','Sh-Sharq','Sharq','JSharq','JSharq','J','JG’arb','G’arb','Sh-G’arb'];const az=a=>['Shimol','Shimoli-sharq','Sharq','Janubi-sharq','Janub','Janubi-g‘arb','G‘arb','Shimoli-g‘arb'][Math.round(a/45)%8];
  let h=`<hr><b>Osmonda (${fmt(S.lat,2)}°, ${fmt(S.lon,2)}° — Osmon xaritasidagi joy)</b>: hozir balandligi <b>${fmt(res.alt,0)}°</b>, azimut ${fmt(res.az,0)}° (${az(res.az)}) · RA ${fmt(res.ra,2)}ʰ, Dek ${fmt(res.dec,1)}°${res.sun>-6?' · hozir kunduz/shafaq':''}<br>`;
  h+=best?`Keyingi 24 soatda <b>tunda</b> eng baland: ${fmt(best.a,0)}° (${hh(best.ms)} ${tzn}), ${nightUp.map(r=>hh(r.a)+'–'+hh(r.b)).join(', ')} oralig‘ida ufqdan 5° dan balandda.`:'Keyingi 24 soatda tunda ufqdan 5° dan balandga ko‘tarilmaydi.';
  h+=`<br>Taxminiy yorqinligi: <b>${mag===null?'—':fmt(mag,1)+'ᵐ'}</b> ${mag!==null&&mag>10?'(faqat teleskopda)':mag!==null&&mag>6?'(durbin/teleskop)':''}`;
  return h;}
 const geoD=(p,e)=>Math.hypot(p[0]-e.x,p[1]-e.y,p[2]-e.z);
 const st={cx:0,cy:0,lp:Math.log(60),off:0,play:false,spd:30,show:{1:1,2:1,3:1,4:1,5:1,c:1,o:1},sel:null,dirty:true,fly:null,t0:Date.now()};
 const dateOf=()=>new Date(st.t0+st.off*86400000);
 const dayOf=d=>d.getTime()/86400000+2440587.5-JD2000;
 const MIN_LP=Math.log(2),MAX_LP=Math.log(6000);
 function tab(body){
  body.innerHTML=`<div class="x-grid"><div class="x-main"><canvas class="lab-view x-sb" style="height:min(66vh,600px);width:100%;cursor:grab;touch-action:none" aria-label="Kichik jismlar xaritasi (ekliptika, tepadan)"></canvas>
  <div class="x-hint">G‘ildirak — masshtab · sudrash — siljitish · jismga bosing — ma’lumot · ikki marta bosing — yaqinlashish.</div>
  <div class="lab-row"><label>Sana: <b id="sbDate"></b></label><input type="range" id="sbOff" min="-3650" max="3650" step="1" value="${st.off}" style="flex:1;min-width:140px"><button id="sbPlay">▶ Harakat</button><button id="sbNow">Bugun</button></div></div>
  <div class="x-side"><div class="lab-row" style="flex-wrap:wrap;gap:6px 12px">${[1,2,3,4].map(k=>`<label><input type="checkbox" data-c="${k}" ${st.show[k]?'checked':''}> <span style="color:${CLS[k][1]}">●</span> ${CLS[k][0]}</label>`).join('')}<label><input type="checkbox" data-c="c" ${st.show.c?'checked':''}> <span style="color:#7dffb0">●</span> Kometalar</label><label><input type="checkbox" data-c="o" ${st.show.o?'checked':''}> Sayyora orbitalari</label></div>
  <div class="lab-row"><button id="sbV1">Ichki sistema</button><button id="sbV2">Asteroid kamari</button><button id="sbV3">Yupiterdan Neptungacha</button><button id="sbV4">Kuiper kamari</button></div>
  <div class="lab-row"><input id="sbQ" placeholder="Qidirish: Apophis, Halley, Eris…" style="flex:1;min-width:120px"></div><div id="sbRes" class="lab-result"></div>
  <div class="lab-row"><button id="sbAp">Yaqin o‘tishlar (PHA, kelasi 10 yil)</button></div><div class="lab-result" id="sbApRes"></div><div class="lab-result" id="sbInfo"></div><div class="lab-result" id="sbNear"></div></div></div>
  <p class="lab-note">Manba: Minor Planet Center (MPC) orbital elementlari — jami ${fmt(n,0)} ta asteroid/TNO (${fmt(SB.counts[1],0)} PHA, ${fmt(SB.counts[2],0)} NEA, ${fmt(SB.counts[3],0)} kentavr, ${fmt(SB.counts[4],0)} TNO) va ${CM.length} kometa. Joylashuv elementlardan oddiy Kepler hisobi bilan topiladi: planetalar tortishi hisobga olinmagan, shuning uchun elementlar epoxasidan (2026-yil atrofi) ±10 yil ichida ham yaqin o‘tishlarda xato bo‘lishi mumkin — bu navigatsiya emas, tasavvur uchun. Diametr — H kattaligidan, albedo 0,14 deb taxminiy baholangan. Ma’lumot suratidir (yangi kashfiyotlar kirmagan). Asosiy kamar (Mars–Yupiter oralig‘i) asteroidlari bu bo‘limda yo‘q — ular alohida «Asosiy kamar (MPC)» bo‘limida (sifat darajasiga qarab ≈25 mingdan ≈1,5 milliongacha).</p>`;
  const cv=$('.x-sb',body);let W=600,H=400,drag=null,ptrs=new Map(),moved=0,lastPinch=0,pl=[];
  const ppm=()=>Math.exp(st.lp),P=(x,y)=>[W/2+(x-st.cx)*ppm(),H/2-(y-st.cy)*ppm()];
  const clampLp=()=>{st.lp=Math.min(MAX_LP,Math.max(MIN_LP,st.lp));};
  function flyTo(cx,cy,lp,ms=1200){clampLp();st.fly={c0:st.cx,y0:st.cy,l0:st.lp,c1:cx,y1:cy,l1:Math.min(MAX_LP,Math.max(MIN_LP,lp)),T:ms/1000,t0:performance.now()};}
  const view=(r)=>flyTo(0,0,Math.log(Math.min(W,H)/2/r*.95));
  function update(){const d=dateOf(),t=dayOf(d);compute(t);for(const c of CM)cometPos(c,t);pl=planets(d);$('#sbDate',body).textContent=d.toISOString().slice(0,10);st.dirty=true;nearList();}
  let nearT=0;
  function nearList(){const now=performance.now();if(now-nearT<400)return;nearT=now;const ea=pl[2];if(!ea)return;const best=[];
   for(let k=0;k<n;k++){if(cls[k]>2)continue;const dx=X[k]-ea.x,dy=Y[k]-ea.y,dz=Z[k]-ea.z,d2=dx*dx+dy*dy+dz*dz;if(best.length<8||d2<best[best.length-1][0]){best.push([d2,k]);best.sort((p,q)=>p[0]-q[0]);if(best.length>8)best.pop();}}
   $('#sbNear',body).innerHTML='<b>Hozir Yerga eng yaqin (hisobiy)</b><br>'+best.map(([d2,k])=>`<a href="#" data-k="${k}">${esc(names[k])}</a> — ${fmt(Math.sqrt(d2),3)} AU (${fmt(Math.sqrt(d2)*149.5978707,1)} mln km)`).join('<br>');
   $('#sbNear',body).querySelectorAll('a').forEach(l=>l.onclick=ev=>{ev.preventDefault();pick({k:+l.dataset.k},true);});}
  function pos(o){return o.c?[o.c.x,o.c.y,o.c.z]:[X[o.k],Y[o.k],Z[o.k]];}
  function pick(o,go){st.sel=o;const p=pos(o);info();if(go)flyTo(p[0],p[1],Math.log(Math.min(W,H)/2/Math.max(.4,Math.hypot(p[0]-pl[2].x,p[1]-pl[2].y)*1.5)));st.dirty=true;}
  function info(){const o=st.sel,box=$('#sbInfo',body);if(!o){box.innerHTML='Jismga bosing yoki qidiring.';return;}const p=pos(o),r=Math.hypot(p[0],p[1],p[2]),ea=pl[2],de=Math.hypot(p[0]-ea.x,p[1]-ea.y,p[2]-ea.z);
   if(o.c){const c=o.c;box.innerHTML=`<b>${esc(c.nm)}</b> — kometa<br>Perigeliy q: <b>${fmt(c.q,3)} AU</b> · ekssentrisitet e: <b>${fmt(c.e,4)}</b>${c.e>=1?' (ochiq orbita — Quyosh sistemasidan chiqib ketadi yoki bir marta kelgan)':''}<br>Egilish: ${fmt(c.inc,1)}° · perigeliy vaqti: ${(JD2000+c.T-2440587.5)*86400000>0?new Date((c.T+JD2000-2440587.5)*86400000).toISOString().slice(0,10):'—'}<br>Hozir: Quyoshdan <b>${fmt(r,2)} AU</b> · Yerdan <b>${fmt(de,2)} AU</b>`+visibility(p,ea,dateOf(),(c.H!=null&&c.H>-5&&c.H<30)?c.H+5*Math.log10(Math.max(de,.01))+2.5*(c.G||4)*Math.log10(Math.max(r,.05)):null);return;}
   const k=o.k,per=a[k]*(1-e[k]),ap=a[k]*(1+e[k]),dm=DIAM(sH[k]/4);
   box.innerHTML=`<b>${esc(names[k])}</b> — ${CLS[cls[k]][0]}<br>Katta yarim o‘q a: <b>${fmt(a[k],3)} AU</b> · e: <b>${fmt(e[k],3)}</b> · egilish: <b>${fmt(si[k]/300,1)}°</b><br>Perigeliy ${fmt(per,3)} AU · afeliy ${fmt(ap,3)} AU · davr ≈ ${fmt(Math.pow(a[k],1.5),a[k]<3?2:1)} yil<br>Mutlaq kattalik H = ${fmt(sH[k]/4,1)} → diametri ≈ <b>${dm>=1?fmt(dm,dm<10?1:0)+' km':fmt(dm*1000,0)+' m'}</b> (taxminiy)<br>Hozir: Quyoshdan <b>${fmt(r,2)} AU</b> · Yerdan <b>${fmt(de,2)} AU</b> (${fmt(de*149.5978707,1)} mln km)`+visibility(p,ea,dateOf(),sH[k]/4+5*Math.log10(Math.max(.001,r*de)));}
  function hit(mx,my){let best=null,bd=100;const test=(x,y,o)=>{const s=P(x,y),d=(s[0]-mx)**2+(s[1]-my)**2;if(d<bd){bd=d;best=o;}};
   for(let k=0;k<n;k++){const c=cls[k];if(!st.show[c>4?4:c])continue;test(X[k],Y[k],{k});}
   if(st.show.c)for(const c of CM)test(c.x,c.y,{c});return best;}
  function render(){
   const r0=cv.getBoundingClientRect();if(!r0.width)return;const hp=hidpi(cv);const c=hp.ctx;W=hp.w;H=hp.h;const pp=ppm();
   c.fillStyle='#02050b';c.fillRect(0,0,W,H);
   const [sx,sy]=P(0,0);

   c.lineWidth=1;c.font='11px system-ui,sans-serif';
   const rings=[1,2,5,10,20,50,100,200,500,1000].filter(r=>r*pp>26&&r*pp<Math.max(W,H)*3);
   for(const r of rings){c.strokeStyle='rgba(120,160,220,.16)';c.beginPath();c.arc(sx,sy,r*pp,0,7);c.stroke();c.fillStyle='rgba(150,180,230,.55)';c.fillText(r+' AU',sx+r*pp*.7071+3,sy-r*pp*.7071-3);}
   if(st.show.o)for(const p of pl){const r=Math.hypot(p.x,p.y);c.strokeStyle='rgba(255,255,255,.2)';c.beginPath();c.arc(sx,sy,r*pp,0,7);c.stroke();}

   const order=[5,4,3,2,1],sz=pp>150?3:pp>25?2:1.4;
   for(const cc of order){if(!st.show[cc>4?4:cc])continue;c.fillStyle=CLS[cc][1];const s=cc===1?sz+.6:sz;
    for(let k=0;k<n;k++){if(cls[k]!==cc)continue;const px=W/2+(X[k]-st.cx)*pp,py=H/2-(Y[k]-st.cy)*pp;if(px<-4||py<-4||px>W+4||py>H+4)continue;c.fillRect(px-s/2,py-s/2,s,s);}}
   if(st.show.c)for(const m of CM){const [px,py]=P(m.x,m.y);if(px<-30||py<-30||px>W+30||py>H+30)continue;const r=Math.hypot(m.x,m.y),tl=Math.min(16,Math.max(4,6/Math.max(.3,r)*Math.min(3,pp/30+.6)));
    if(r<4){const ux=(px-sx)/Math.max(1,Math.hypot(px-sx,py-sy)),uy=(py-sy)/Math.max(1,Math.hypot(px-sx,py-sy));const g=c.createLinearGradient(px,py,px+ux*tl,py+uy*tl);g.addColorStop(0,'rgba(125,255,176,.7)');g.addColorStop(1,'rgba(125,255,176,0)');c.strokeStyle=g;c.lineWidth=2;c.beginPath();c.moveTo(px,py);c.lineTo(px+ux*tl,py+uy*tl);c.stroke();}
    c.fillStyle='#7dffb0';c.beginPath();c.arc(px,py,2.2,0,7);c.fill();}

   const sg=c.createRadialGradient(sx,sy,0,sx,sy,14);sg.addColorStop(0,'#fff6c8');sg.addColorStop(.35,'rgba(255,200,80,.8)');sg.addColorStop(1,'rgba(255,170,40,0)');c.fillStyle=sg;c.beginPath();c.arc(sx,sy,14,0,7);c.fill();
   for(const p of pl){const [px,py]=P(p.x,p.y);if(px<-20||py<-20||px>W+20||py>H+20)continue;c.fillStyle=p.c;c.beginPath();c.arc(px,py,p.n==='Yer'?4:3.2,0,7);c.fill();c.fillStyle='rgba(235,242,255,.9)';c.fillText(p.n,px+6,py-5);}

   const o=st.sel;if(o){const p=pos(o),[px,py]=P(p[0],p[1]);c.strokeStyle='#fff';c.lineWidth=1.5;c.beginPath();c.arc(px,py,9,0,7);c.stroke();c.fillStyle='#fff';c.fillText(o.c?o.c.nm:names[o.k],px+12,py-8);
    if(!o.c){const k=o.k,ec=e[k],pts=[];c.strokeStyle='rgba(255,255,255,.55)';c.beginPath();for(let i=0;i<=180;i++){const E=i/180*2*Math.PI,xo=a[k]*(Math.cos(E)-ec),yo=bb[k]*Math.sin(E),qx=xo*Px[k]+yo*Qx[k],qy=xo*Py[k]+yo*Qy[k],[u,v]=P(qx,qy);i?c.lineTo(u,v):c.moveTo(u,v);}c.stroke();}}
   c.fillStyle='rgba(180,200,230,.7)';c.fillText('Ekliptika tekisligi, tepadan · o‘ng tomon — bahor teng kunligi yo‘nalishi',10,H-8);
   st.dirty=false;}

  const zoomAt=(mx,my,f)=>{const bx=st.cx+(mx-W/2)/ppm(),by=st.cy-(my-H/2)/ppm();st.lp+=Math.log(f);clampLp();st.cx=bx-(mx-W/2)/ppm();st.cy=by+(my-H/2)/ppm();st.dirty=true;};
  cv.addEventListener('wheel',ev=>{ev.preventDefault();const r=cv.getBoundingClientRect();st.fly=null;zoomAt(ev.clientX-r.left,ev.clientY-r.top,Math.exp(-ev.deltaY*.0015));},{passive:false});
  cv.addEventListener('pointerdown',ev=>{cv.setPointerCapture(ev.pointerId);ptrs.set(ev.pointerId,{x:ev.clientX,y:ev.clientY});moved=0;st.fly=null;cv.style.cursor='grabbing';if(ptrs.size===2){const [p,q]=[...ptrs.values()];lastPinch=Math.hypot(p.x-q.x,p.y-q.y);}});
  cv.addEventListener('pointermove',ev=>{const p=ptrs.get(ev.pointerId);if(!p)return;if(ptrs.size===2){p.x=ev.clientX;p.y=ev.clientY;const [u,v]=[...ptrs.values()],d=Math.hypot(u.x-v.x,u.y-v.y);if(lastPinch){const r=cv.getBoundingClientRect();zoomAt((u.x+v.x)/2-r.left,(u.y+v.y)/2-r.top,d/lastPinch);}lastPinch=d;moved+=10;return;}
   const dx=ev.clientX-p.x,dy=ev.clientY-p.y;p.x=ev.clientX;p.y=ev.clientY;moved+=Math.abs(dx)+Math.abs(dy);st.cx-=dx/ppm();st.cy+=dy/ppm();st.dirty=true;});
  const up=ev=>{const was=ptrs.size;ptrs.delete(ev.pointerId);cv.style.cursor='grab';if(was===1&&moved<5){const r=cv.getBoundingClientRect(),o=hit(ev.clientX-r.left,ev.clientY-r.top);if(o)pick(o);}};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('dblclick',ev=>{const r=cv.getBoundingClientRect(),o=hit(ev.clientX-r.left,ev.clientY-r.top);if(o)pick(o,true);else zoomAt(ev.clientX-r.left,ev.clientY-r.top,2.2);});
  body.querySelectorAll('input[data-c]').forEach(i=>i.onchange=()=>{const k=i.dataset.c;st.show[k]=i.checked?1:0;st.dirty=true;});
  $('#sbOff',body).oninput=ev=>{st.off=+ev.target.value;update();};
  $('#sbNow',body).onclick=()=>{st.off=0;$('#sbOff',body).value=0;st.play=false;$('#sbPlay',body).textContent='▶ Harakat';update();};
  $('#sbPlay',body).onclick=()=>{st.play=!st.play;$('#sbPlay',body).textContent=st.play?'⏸ To‘xtatish':'▶ Harakat';};
  $('#sbV1',body).onclick=()=>view(3);$('#sbV2',body).onclick=()=>view(6);$('#sbV3',body).onclick=()=>view(35);$('#sbV4',body).onclick=()=>view(110);
  $('#sbQ',body).oninput=ev=>{const q=ev.target.value.trim().toLowerCase(),res=$('#sbRes',body);if(q.length<2){res.innerHTML='';return;}const hits=[];
   for(let k=0;k<n&&hits.length<8;k++)if(names[k].toLowerCase().includes(q))hits.push({k});for(const c of CM)if(hits.length<12&&c.nm.toLowerCase().includes(q))hits.push({c});
   res.innerHTML=hits.length?hits.map((h,i)=>`<a href="#" data-i="${i}">${esc(h.c?h.c.nm+' (kometa)':names[h.k])}</a>`).join('<br>'):'Topilmadi';res.querySelectorAll('a').forEach(l=>l.onclick=e2=>{e2.preventDefault();pick(hits[+l.dataset.i],true);});};

  $('#sbAp',body).onclick=()=>{const out=$('#sbApRes',body);out.textContent='Hisoblanmoqda…';
   setTimeout(()=>{const base=dateOf().getTime(),D0=dayOf(new Date(base)),E=[],N=1461;
    const ev=t=>{const v=A.HelioVector('Earth',new Date((t+JD2000-2440587.5)*86400000));return [v.x,v.y*ceps+v.z*seps,-v.y*seps+v.z*ceps];};
    const ed=new Float32Array(N*3);for(let i=0;i<N;i++){const e3=ev(D0-3650+i*5);ed[i*3]=e3[0];ed[i*3+1]=e3[1];ed[i*3+2]=e3[2];}
    const idx=[];for(let k=0;k<n;k++)if(cls[k]===1)idx.push(k);
    const pa=(k,t)=>{const ec=e[k],E_=solveE(M0[k]+nn[k]*(t-E0[k]),ec),xo=a[k]*(Math.cos(E_)-ec),yo=bb[k]*Math.sin(E_);return [xo*Px[k]+yo*Qx[k],xo*Py[k]+yo*Qy[k],xo*Pz[k]+yo*Qz[k]];};
    const found=[];
    for(const k of idx){const dd=new Float32Array(N);for(let i=0;i<N;i++){const q=pa(k,D0-3650+i*5);dd[i]=Math.hypot(q[0]-ed[i*3],q[1]-ed[i*3+1],q[2]-ed[i*3+2]);}
     for(let i=1;i<N-1;i++)if(dd[i]<dd[i-1]&&dd[i]<=dd[i+1]&&dd[i]<.12){let bt=0,bd=9;for(let t=D0-3650+(i-1)*5;t<=D0-3650+(i+1)*5;t+=.25){const q=pa(k,t),e3=ev(t),d=Math.hypot(q[0]-e3[0],q[1]-e3[1],q[2]-e3[2]);if(d<bd){bd=d;bt=t;}}if(bd<.05&&bt>=D0)found.push([bt,bd,k]);}}
    found.sort((u,v)=>u[0]-v[0]);
    out.innerHTML=`<b>Kelasi 10 yilda ${found.length} ta o‘tish &lt; 0,05 AU</b> (${fmt(.05*389.17,0)} Oy masofasidan yaqin), birinchi 40 tasi sana bo‘yicha. Lekin Kepler hisobi planetalar ta’sirini bilmaydi — aniq sana va masofa uchun NASA/JPL (CNEOS) ga qarang.<br>`+found.slice(0,40).map(f=>{const d=new Date((f[0]+JD2000-2440587.5)*86400000);return `<a href="#" data-t="${f[0]}" data-k="${f[2]}">${d.toISOString().slice(0,10)} — ${esc(names[f[2]])}</a> · ${fmt(f[1],4)} AU (${fmt(f[1]*389.17,1)} Oy masofasi)`;}).join('<br>');
    out.querySelectorAll('a').forEach(l=>l.onclick=ev=>{ev.preventDefault();st.off=Math.round((+l.dataset.t-dayOf(new Date(st.t0)))); st.off=Math.max(-3650,Math.min(3650,st.off));$('#sbOff',body).value=st.off;update();pick({k:+l.dataset.k},true);});},30);};
  KoinotLab.state.labTick=dt=>{const f=st.fly;if(f){let u=Math.min(1,(performance.now()-f.t0)/1000/f.T);u=u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;const i0=1/Math.exp(f.l0),i1=1/Math.exp(f.l1),den=i0-i1;st.lp=f.l0+(f.l1-f.l0)*u;const w=Math.abs(den)/Math.max(i0,i1)>.02?(i0-1/Math.exp(st.lp))/den:u;st.cx=f.c0+(f.c1-f.c0)*w;st.cy=f.y0+(f.y1-f.y0)*u;if(u>=1)st.fly=null;st.dirty=true;}
   if(st.play){st.off+=st.spd*Math.min(.1,dt||.016);const s=$('#sbOff',body);if(st.off>3650)st.off=-3650;if(s)s.value=Math.round(st.off);update();}
   if(st.dirty)render();};
  KoinotLab.state.cleanup=()=>{st.fly=null;st.play=false;};
  const rs=()=>{st.dirty=true;};window.addEventListener('resize',rs);const old=KoinotLab.state.cleanup;KoinotLab.state.cleanup=()=>{old();window.removeEventListener('resize',rs);};
  update();info();render();
 }
 KX.tab('smallbodies','Kichik jismlar (MPC)',tab);KX.sb={n,st,compute,visibility,CM,names,cls,X,Y,Z,a,e};
})();
