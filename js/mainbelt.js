(()=>{'use strict';
 const app=window.koinot,KX=window.KX,IDX=window.KOINOT_MB_INDEX;if(!app||!KX||!IDX||!KX.tab)return;
 const {$,esc,fmt,hidpi}=KX,A=window.Astronomy,D2R=Math.PI/180,JD2000=2451544.5,GK=.01720209895,TWO=2*Math.PI;
 const LIM=[14,16,1e9],NAME=['Yengil','O‘rta','Yuqori'];
 const MB={data:new Array(IDX.length).fill(null),bad:new Array(IDX.length).fill(false),busy:false,tier:1,subs:[]};
 const tierOf=()=>app.quality==='low'?0:app.quality==='high'?2:1;
 const allowed=i=>IDX[i].h1<=LIM[MB.tier];
 const active=()=>{const o=[];for(let i=0;i<IDX.length;i++)if(MB.data[i]&&allowed(i))o.push(i);return o;};
 const countActive=()=>active().reduce((s,i)=>s+IDX[i].n,0);
 const totalWanted=()=>IDX.reduce((s,c,i)=>s+(allowed(i)?c.n:0),0);
 function solveE(M,ec){M=M%TWO;if(M>Math.PI)M-=TWO;else if(M<-Math.PI)M+=TWO;let E=ec<.8?M+ec*Math.sin(M):Math.PI*Math.sign(M||1);for(let it=0;it<10;it++){const d=(E-ec*Math.sin(E)-M)/(1-ec*Math.cos(E));E-=d;if(Math.abs(d)<1e-8)break;}return E;}

 const loadScript=src=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.onload=()=>{s.remove();ok();};s.onerror=()=>{s.remove();no(new Error(src));};document.head.append(s);});
 function decode(obj){
  const s=atob(obj.b64),L=s.length,u8=new Uint8Array(L);for(let k=0;k<L;k++)u8[k]=s.charCodeAt(k);obj.b64=null;
  const n=obj.n,B=u8.buffer;let o=0;const a=new Float32Array(B,o,n);o+=4*n;const U=()=>{const x=new Uint16Array(B,o,n);o+=2*n;return x;};
  const e=U(),i=U(),N=U(),w=U(),M=U(),ep=U(),H=new Uint8Array(B,o,n);
  return {n,a,e,i,N,w,M,ep,H,names:obj.names?obj.names.split('\n'):null,pre:null,X:null,Y:null,tok:-1};
 }
 async function loadOne(i){
  window.KOINOT_MB=[];
  await loadScript('data/mainbelt/'+IDX[i].f);
  const obj=(window.KOINOT_MB||[]).pop();if(!obj)throw new Error('bo‘sh bo‘lak');
  MB.data[i]=decode(obj);window.KOINOT_MB=[];
  for(const f of MB.subs)try{f(i);}catch(e){console.warn(e);}
 }
 async function pump(){
  if(MB.busy)return;MB.busy=true;
  try{for(;;){const nx=IDX.findIndex((c,i)=>!MB.data[i]&&!MB.bad[i]&&allowed(i));if(nx<0)break;
   try{await loadOne(nx);}catch(e){MB.bad[nx]=true;console.warn('MB',e);}
   await new Promise(r=>setTimeout(r,80));}}
  finally{MB.busy=false;}
 }
 function apply(){MB.tier=tierOf();for(const f of MB.subs)try{f(-1);}catch(e){console.warn(e);}pump();}
 const sq=app.setQuality?.bind(app);if(sq)app.setQuality=function(q){const r=sq(q);try{apply();}catch(e){console.warn(e);}return r;};

 const j=app.journey,K=j?.kit,clouds=new Map();
 if(j&&K&&j.auMap){
  const T=K.T,g1=K.groups[1];
  const zone=a=>a<2.0?[1,.62,.45]:a<3.3?[.88,.75,.58]:(a>3.8&&a<4.2)?[.78,.62,.98]:(a>5&&a<5.45)?[.5,.82,1]:[.72,.78,.9];
  function addCloud(i){
   if(clouds.has(i)||!MB.data[i])return;const D=MB.data[i],n=D.n,t=Date.now()/86400000+2440587.5-JD2000,map=j.auMap,P=[],C=[];
   const dim=Math.max(.1,Math.min(.8,.9*Math.pow(40000/n,.9))),rnd=K.rand;
   for(let k=0;k<n;k++){
    const ec=D.e[k]/20000,a=D.a[k],inc=D.i[k]/300*D2R,Nn=D.N[k]*TWO/65536,w=D.w[k]*TWO/65536,M0=D.M[k]*TWO/65536;
    const E=solveE(M0+GK/(a*Math.sqrt(a))*(t-D.ep[k]),ec),xo=a*(Math.cos(E)-ec),yo=a*Math.sqrt(1-ec*ec)*Math.sin(E);
    const cw=Math.cos(w),sw=Math.sin(w),cN=Math.cos(Nn),sN=Math.sin(Nn),ci=Math.cos(inc),si=Math.sin(inc);
    const x=xo*(cw*cN-sw*sN*ci)+yo*(-sw*cN-cw*sN*ci),y=xo*(cw*sN+sw*cN*ci)+yo*(-sw*sN+cw*cN*ci),z=(xo*sw+yo*cw)*si,r=Math.hypot(x,y);
    if(r<.3)continue;const f=map(r)/r;P.push(x*f,z*f*.6,-y*f);
    const col=zone(a),br=dim*(.5+.5*Math.min(1,Math.max(0,(19-D.H[k]/10)/7)))*(.75+rnd()*.25);C.push(col[0]*br,col[1]*br,col[2]*br);}
   const pts=K.cloud(g1,P,C,.3);pts.material.size=n>100000?.085:.12;pts.userData.keep=true;pts.visible=allowed(i);pts.material.opacity=opa();clouds.set(i,pts);
   if(j.schematicBelt)j.schematicBelt.visible=false;
   j.mainBelt=(j.mainBelt||0)+P.length/3;
  }
  const opa=()=>MB.tier===2?.34:(document.body.classList.contains('cinema')?.38:.7);
  new MutationObserver(()=>{for(const [,p] of clouds)p.material.opacity=opa();}).observe(document.body,{attributes:true,attributeFilter:['class']});
  const sync=i=>{if(i>=0)addCloud(i);for(const [ci,p] of clouds){p.visible=allowed(ci);p.material.opacity=opa();}};
  MB.subs.push(i=>{if(i>=0)setTimeout(()=>sync(i),30);else sync(-1);});
 }

 const PL=[['Merkuriy','Mercury','#a39a90'],['Venera','Venus','#e8c98a'],['Yer','Earth','#4da3ff'],['Mars','Mars','#ff7a4d'],['Yupiter','Jupiter','#e0b88a']];
 const EPS=23.4392911*D2R,ceps=Math.cos(EPS),seps=Math.sin(EPS);
 const planets=d=>PL.map(p=>{const v=A.HelioVector(p[1],d);return {n:p[0],c:p[2],x:v.x,y:v.y*ceps+v.z*seps,z:-v.y*seps+v.z*ceps};});
 const RES=[[2.06,'4:1'],[2.5,'3:1'],[2.82,'5:2'],[2.95,'7:3'],[3.27,'2:1'],[3.97,'3:2 Hilda'],[5.2,'1:1 Troyan']];
 const LUT=(()=>{const L=new Uint32Array(256);const st=[[0,[3,8,20]],[.25,[16,52,110]],[.5,[40,150,170]],[.75,[240,200,90]],[1,[255,250,230]]];for(let i=0;i<256;i++){const v=i/255;let k=1;while(k<st.length-1&&v>st[k][0])k++;const [v0,c0]=st[k-1],[v1,c1]=st[k],u=(v-v0)/(v1-v0);const r=c0[0]+(c1[0]-c0[0])*u,g=c0[1]+(c1[1]-c0[1])*u,b=c0[2]+(c1[2]-c0[2])*u;L[i]=(255<<24)|(b<<16)|(g<<8)|r;}return L;})();
 function prep(D){
  if(D.pre)return;const n=D.n,px=new Float32Array(n),py=new Float32Array(n),qx=new Float32Array(n),qy=new Float32Array(n),nn=new Float32Array(n),m0=new Float32Array(n),ee=new Float32Array(n);
  for(let k=0;k<n;k++){const inc=D.i[k]/300*D2R,N=D.N[k]*TWO/65536,w=D.w[k]*TWO/65536,cw=Math.cos(w),sw=Math.sin(w),cN=Math.cos(N),sN=Math.sin(N),ci=Math.cos(inc),a=D.a[k];
   px[k]=cw*cN-sw*sN*ci;py[k]=cw*sN+sw*cN*ci;qx[k]=-sw*cN-cw*sN*ci;qy[k]=-sw*sN+cw*cN*ci;nn[k]=GK/(a*Math.sqrt(a));m0[k]=D.M[k]*TWO/65536-nn[k]*D.ep[k];ee[k]=D.e[k]/20000;}
  D.pre={px,py,qx,qy,nn,m0,ee};D.X=new Float32Array(n);D.Y=new Float32Array(n);
 }
 function calc(D,t){const p=D.pre,n=D.n,X=D.X,Y=D.Y,a=D.a;for(let k=0;k<n;k++){const ec=p.ee[k],E=solveE(p.m0[k]+p.nn[k]*t,ec),xo=a[k]*(Math.cos(E)-ec),yo=a[k]*Math.sqrt(1-ec*ec)*Math.sin(E);X[k]=xo*p.px[k]+yo*p.qx[k];Y[k]=xo*p.py[k]+yo*p.qy[k];}}
 const st={cx:0,cy:0,lp:Math.log(120),off:0,play:false,sel:null,dirty:true,t0:Date.now(),tokNow:0,hist:null,res:true,orb:true};
 const dayOf=d=>d.getTime()/86400000+2440587.5-JD2000;
 const dateOf=()=>new Date(st.t0+st.off*86400000);
 function tab(body){
  body.innerHTML=`<div class="x-grid"><div class="x-main"><canvas class="lab-view x-mb" style="height:min(60vh,560px);width:100%;cursor:grab;touch-action:none" aria-label="Asosiy asteroid kamari: zichlik xaritasi (ekliptika, tepadan)"></canvas>
  <div class="x-hint">G‘ildirak/chimchilash — masshtab · sudrash — siljitish · jismga bosing — ma’lumot. Rang — jismlar zichligi.</div>
  <div class="lab-row"><label>Sana: <b id="mbDate"></b></label><input type="range" id="mbOff" min="-3650" max="3650" step="1" value="${st.off}" style="flex:1;min-width:140px"><button id="mbPlay">▶ Harakat</button><button id="mbNow">Bugun</button></div>
  <canvas class="lab-view x-mbh" style="height:170px;width:100%;margin-top:8px" aria-label="Katta yarim o‘q bo‘yicha taqsimot (Kirkvud bo‘shliqlari)"></canvas>
  <div class="x-hint">Pastda: jismlar soni — orbitaning katta yarim o‘qi a bo‘yicha. Yupiter bilan rezonans (3:1, 5:2, 7:3, 2:1…) joylarda «bo‘shliqlar» — Kirkvud bo‘shliqlari.</div></div>
  <div class="x-side"><div class="lab-row"><label><input type="checkbox" id="mbOrb" checked> Sayyora orbitalari</label><label><input type="checkbox" id="mbRes" checked> Rezonans doiralari</label></div>
  <div class="lab-row"><button id="mbV1">Ichki sistema</button><button id="mbV2">Asosiy kamar</button><button id="mbV3">Yupiter va Troyanlar</button></div>
  <div class="lab-row"><input id="mbQ" placeholder="Qidirish (faqat H ≤ 14): Ceres, Vesta, Eros…" style="flex:1;min-width:120px"></div><div id="mbRs" class="lab-result"></div>
  <div class="lab-result" id="mbInfo">Jismga bosing yoki qidiring.</div><div class="lab-result" id="mbStat"></div></div></div>
  <p class="lab-note">Manba: Minor Planet Center (MPC) — MPCORB.DAT (to‘plam: ${fmt(IDX.reduce((s,c)=>s+c.n,0),0)} ta jism; Yerga yaqin, xavfli, kentavr va TNO lar «Kichik jismlar (MPC)» bo‘limida alohida). <b>Sifat darajasi</b> qancha jism yuklanishini belgilaydi: Yengil — H ≤ 14 (eng yirik), O‘rta — H ≤ 16, Yuqori — hammasi (Sozlamalar → Grafika sifati). Joylashuv orbital elementlardan oddiy Kepler hisobi bilan topiladi: planetalar tortishi hisobga olinmagan, elementlar epoxasidan (2026 y.) uzoqlashgan sari xato o‘sadi — bu tasavvur uchun, navigatsiya emas. Diametr H dan, albedo 0,14 deb taxminiy. Nomlar faqat eng yirik (H ≤ 14) jismlar uchun saqlangan — qolganlari faqat raqam/belgi bilan ma’lum bo‘lmagani uchun xaritada nomsiz.</p>`;
  const cv=$('.x-mb',body),ch=$('.x-mbh',body);let W=600,H=400,ptrs=new Map(),moved=0,lastPinch=0,pl=[],img=null,off=null,cnt=null,calcTok=0,statT=0;
  const ppm=()=>Math.exp(st.lp),P=(x,y)=>[W/2+(x-st.cx)*ppm(),H/2-(y-st.cy)*ppm()];
  const clampLp=()=>{st.lp=Math.min(Math.log(1200),Math.max(Math.log(14),st.lp));};
  const view=(r,cx=0,cy=0)=>{st.cx=cx;st.cy=cy;st.lp=Math.log(Math.min(W,H)/2/r*.95);clampLp();st.dirty=true;};

  function recompute(){
   const d=dateOf(),t=dayOf(d);pl=planets(d);$('#mbDate',body).textContent=d.toISOString().slice(0,10);
   const tok=++calcTok;const list=active();let q=0;
   const step=()=>{if(tok!==calcTok||!document.body.contains(cv))return;const i=list[q++];if(i===undefined){st.dirty=true;return;}
    const D=MB.data[i];if(!D)return step();prep(D);calc(D,t);D.tok=tok;st.dirty=true;if(q<list.length)setTimeout(step,0);else st.dirty=true;};
   if(!list.length){st.dirty=true;return;}step();
  }
  MB.subs.push(i=>{if(!document.body.contains(cv))return;st.hist=null;recompute();});
  function histo(){
   if(st.hist&&st.hist.tier===MB.tier&&st.hist.cn===countActive())return st.hist;const lo=1.8,hi=5.6,bw=.02,nb=Math.round((hi-lo)/bw),h=new Uint32Array(nb);const zones={in:0,mb:0,hil:0,tro:0,oth:0};let tot=0;
   for(const i of active()){const D=MB.data[i];for(let k=0;k<D.n;k++){const a=D.a[k];tot++;if(a<2.0)zones.in++;else if(a<3.3)zones.mb++;else if(a>3.8&&a<4.2)zones.hil++;else if(a>5&&a<5.45)zones.tro++;else zones.oth++;if(a>=lo&&a<hi)h[((a-lo)/bw)|0]++;}}
   return st.hist={tier:MB.tier,cn:countActive(),lo,hi,bw,nb,h,zones,tot};}
  function drawHist(){
   const hp=hidpi(ch),c=hp.ctx,w=hp.w,h=hp.h,H_=histo();c.fillStyle='#02050b';c.fillRect(0,0,w,h);const pad=26,bw=(w-pad-8)/H_.nb;let mx=1;for(let i=0;i<H_.nb;i++)mx=Math.max(mx,H_.h[i]);
   c.fillStyle='rgba(240,200,110,.85)';for(let i=0;i<H_.nb;i++){const v=H_.h[i]/mx,bh=v*(h-34);c.fillRect(pad+i*bw,h-18-bh,Math.max(1,bw-.4),bh);}
   c.font='10px system-ui,sans-serif';c.fillStyle='rgba(180,200,230,.75)';for(let a=2;a<=5;a+=1){const x=pad+(a-H_.lo)/H_.bw*bw;c.fillText(a+' AU',x-10,h-4);c.strokeStyle='rgba(120,160,220,.15)';c.beginPath();c.moveTo(x,6);c.lineTo(x,h-18);c.stroke();}
   c.setLineDash([3,3]);for(const [a,nm] of RES){const x=pad+(a-H_.lo)/H_.bw*bw;c.strokeStyle='rgba(255,120,110,.55)';c.beginPath();c.moveTo(x,10);c.lineTo(x,h-18);c.stroke();c.fillStyle='rgba(255,150,140,.9)';c.fillText(nm,x+2,12+(RES.findIndex(r=>r[0]===a)%2)*10);}c.setLineDash([]);
   const z=H_.zones,T=Math.max(1,H_.tot);$('#mbStat',body).innerHTML=`<b>Hozir ko‘rsatilayotgan: ${fmt(countActive(),0)} ta jism</b> — sifat darajasi: <b>${NAME[MB.tier]}</b> (${active().length}/${IDX.filter((c,i)=>allowed(i)).length} bo‘lak yuklangan${MB.busy?', yuklanmoqda…':''})<br>Ichki (a&lt;2 AU, Vengriya/Mars kesuvchilar): ${fmt(z.in/T*100,1)}% · Asosiy kamar (2–3,3 AU): ${fmt(z.mb/T*100,1)}% · Gilda (≈3,97): ${fmt(z.hil/T*100,1)}% · Troyanlar (≈5,2): ${fmt(z.tro/T*100,1)}% · boshqa: ${fmt(z.oth/T*100,1)}%<br><span style="opacity:.8">Foizlar — hozir yuklangan jismlar orasida (faqat yirik/yorqin jismlar bo‘lsa, kichiklari kam bo‘ladi).</span>`;}
  function bin(){
   if(!img||img.width!==W||img.height!==H){off=document.createElement('canvas');off.width=W;off.height=H;img=off.getContext('2d').createImageData(W,H);cnt=new Uint16Array(W*H);}
   cnt.fill(0);const pp=ppm(),hx=W/2-st.cx*pp,hy=H/2+st.cy*pp;let mx=1;
   for(const i of active()){const D=MB.data[i];if(!D||D.tok<0||!D.X)continue;const X=D.X,Y=D.Y,n=D.n;for(let k=0;k<n;k++){const fx=hx+X[k]*pp,fy=hy-Y[k]*pp;if(fx>=0&&fx<W&&fy>=0&&fy<H){const id=((fy|0)*W)+(fx|0);const v=cnt[id]+1;cnt[id]=v;if(v>mx)mx=v;}}}
   const u32=new Uint32Array(img.data.buffer),sc=255/Math.log1p(Math.max(2,mx*1.3));
   for(let p=0;p<cnt.length;p++){const v=cnt[p];u32[p]=v?LUT[Math.min(255,Math.round(Math.log1p(v)*sc*.92+24))]:0;}
   off.getContext('2d').putImageData(img,0,0);}
  function render(){
   if(!cv.getBoundingClientRect().width)return;const hp=hidpi(cv),c=hp.ctx;W=hp.w;H=hp.h;c.fillStyle='#02050b';c.fillRect(0,0,W,H);
   bin();c.imageSmoothingEnabled=false;c.drawImage(off,0,0,W,H);
   const pp=ppm(),[sx,sy]=P(0,0);c.lineWidth=1;c.font='11px system-ui,sans-serif';
   for(const r of [1,2,3,4,5,6,8,10].filter(r=>r*pp>26&&r*pp<Math.max(W,H)*3)){c.strokeStyle='rgba(120,160,220,.13)';c.beginPath();c.arc(sx,sy,r*pp,0,7);c.stroke();c.fillStyle='rgba(150,180,230,.5)';c.fillText(r+' AU',sx+r*pp*.7071+3,sy-r*pp*.7071-3);}
   if(st.res){c.setLineDash([4,4]);for(const [a,nm] of RES){if(a>5.3&&pp<40)continue;c.strokeStyle='rgba(255,110,100,.35)';c.beginPath();c.arc(sx,sy,a*pp,0,7);c.stroke();if(a*pp<Math.max(W,H)*1.5){c.fillStyle='rgba(255,150,140,.7)';c.fillText(nm,sx-a*pp*.7071-4-c.measureText(nm).width*.5,sy+a*pp*.7071+12);}}c.setLineDash([]);}
   if(st.orb)for(const p of pl){const r=Math.hypot(p.x,p.y);c.strokeStyle='rgba(255,255,255,.22)';c.beginPath();c.arc(sx,sy,r*pp,0,7);c.stroke();}
   const sg=c.createRadialGradient(sx,sy,0,sx,sy,12);sg.addColorStop(0,'#fff6c8');sg.addColorStop(.4,'rgba(255,200,80,.8)');sg.addColorStop(1,'rgba(255,170,40,0)');c.fillStyle=sg;c.beginPath();c.arc(sx,sy,12,0,7);c.fill();
   for(const p of pl){const [px,py]=P(p.x,p.y);if(px<-20||py<-20||px>W+20||py>H+20)continue;c.fillStyle=p.c;c.beginPath();c.arc(px,py,p.n==='Yupiter'?5:3.4,0,7);c.fill();c.fillStyle='rgba(235,242,255,.92)';c.fillText(p.n,px+7,py-6);}
   const o=st.sel;if(o){const D=MB.data[o.i];if(D&&D.X){const [px,py]=P(D.X[o.k],D.Y[o.k]);c.strokeStyle='#fff';c.lineWidth=1.5;c.beginPath();c.arc(px,py,9,0,7);c.stroke();c.fillStyle='#fff';c.fillText(label(o),px+12,py-8);
    const p=D.pre,ec=p.ee[o.k],a=D.a[o.k],b=a*Math.sqrt(1-ec*ec);c.strokeStyle='rgba(255,255,255,.6)';c.beginPath();for(let q=0;q<=180;q++){const E=q/180*TWO,xo=a*(Math.cos(E)-ec),yo=b*Math.sin(E),[u,v]=P(xo*p.px[o.k]+yo*p.qx[o.k],xo*p.py[o.k]+yo*p.qy[o.k]);q?c.lineTo(u,v):c.moveTo(u,v);}c.stroke();}}
   c.fillStyle='rgba(180,200,230,.7)';c.fillText('Ekliptika tekisligi, tepadan · '+NAME[MB.tier]+' daraja',10,H-8);
   drawHist();st.dirty=false;}
  const label=o=>{const D=MB.data[o.i];return D.names?D.names[o.k]:'H='+fmt(D.H[o.k]/10,1)+' (nomsiz yozuv)';};
  function info(){const o=st.sel,box=$('#mbInfo',body);if(!o){box.innerHTML='Jismga bosing yoki qidiring.';return;}const D=MB.data[o.i],k=o.k,a=D.a[k],ec=D.e[k]/20000,Hm=D.H[k]/10,dm=1329/Math.sqrt(.14)*Math.pow(10,-Hm/5),r=Math.hypot(D.X[k],D.Y[k]),ea=pl[2],de=Math.hypot(D.X[k]-ea.x,D.Y[k]-ea.y);
   box.innerHTML=`<b>${esc(label(o))}</b><br>a: <b>${fmt(a,3)} AU</b> · e: <b>${fmt(ec,3)}</b> · egilish: <b>${fmt(D.i[k]/300,1)}°</b><br>Perigeliy ${fmt(a*(1-ec),3)} AU · afeliy ${fmt(a*(1+ec),3)} AU · davr ≈ ${fmt(Math.pow(a,1.5),1)} yil<br>H = ${fmt(Hm,1)} → diametri ≈ <b>${dm>=1?fmt(dm,dm<10?1:0)+' km':fmt(dm*1000,0)+' m'}</b> (taxminiy)<br>Hozir: Quyoshdan <b>${fmt(r,2)} AU</b> · Yerdan ≈ <b>${fmt(de,2)} AU</b> (ekliptika tekisligida)`;}
  function hit(mx,my){let best=null,bd=100;const pp=ppm();for(const i of active()){const D=MB.data[i];if(!D||!D.X)continue;for(let k=0;k<D.n;k++){const dx=W/2+(D.X[k]-st.cx)*pp-mx;if(dx>10||dx<-10)continue;const dy=H/2-(D.Y[k]-st.cy)*pp-my,d=dx*dx+dy*dy;if(d<bd){bd=d;best={i,k};}}}return best;}
  const zoomAt=(mx,my,f)=>{const bx=st.cx+(mx-W/2)/ppm(),by=st.cy-(my-H/2)/ppm();st.lp+=Math.log(f);clampLp();st.cx=bx-(mx-W/2)/ppm();st.cy=by+(my-H/2)/ppm();st.dirty=true;};
  cv.addEventListener('wheel',ev=>{ev.preventDefault();const r=cv.getBoundingClientRect();zoomAt(ev.clientX-r.left,ev.clientY-r.top,Math.exp(-ev.deltaY*.0015));},{passive:false});
  cv.addEventListener('pointerdown',ev=>{cv.setPointerCapture(ev.pointerId);ptrs.set(ev.pointerId,{x:ev.clientX,y:ev.clientY});moved=0;cv.style.cursor='grabbing';if(ptrs.size===2){const [p,q]=[...ptrs.values()];lastPinch=Math.hypot(p.x-q.x,p.y-q.y);}});
  cv.addEventListener('pointermove',ev=>{const p=ptrs.get(ev.pointerId);if(!p)return;if(ptrs.size===2){p.x=ev.clientX;p.y=ev.clientY;const [u,v]=[...ptrs.values()],d=Math.hypot(u.x-v.x,u.y-v.y);if(lastPinch){const r=cv.getBoundingClientRect();zoomAt((u.x+v.x)/2-r.left,(u.y+v.y)/2-r.top,d/lastPinch);}lastPinch=d;moved+=10;return;}
   const dx=ev.clientX-p.x,dy=ev.clientY-p.y;p.x=ev.clientX;p.y=ev.clientY;moved+=Math.abs(dx)+Math.abs(dy);st.cx-=dx/ppm();st.cy+=dy/ppm();st.dirty=true;});
  const up=ev=>{const was=ptrs.size;ptrs.delete(ev.pointerId);cv.style.cursor='grab';if(was===1&&moved<5){const r=cv.getBoundingClientRect(),o=hit(ev.clientX-r.left,ev.clientY-r.top);if(o){st.sel=o;info();st.dirty=true;}}};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('dblclick',ev=>{const r=cv.getBoundingClientRect();zoomAt(ev.clientX-r.left,ev.clientY-r.top,2.2);});
  $('#mbOrb',body).onchange=e=>{st.orb=e.target.checked;st.dirty=true;};$('#mbRes',body).onchange=e=>{st.res=e.target.checked;st.dirty=true;};
  $('#mbOff',body).oninput=ev=>{st.off=+ev.target.value;recompute();};
  $('#mbNow',body).onclick=()=>{st.off=0;$('#mbOff',body).value=0;st.play=false;$('#mbPlay',body).textContent='▶ Harakat';recompute();};
  $('#mbPlay',body).onclick=()=>{st.play=!st.play;$('#mbPlay',body).textContent=st.play?'⏸ To‘xtatish':'▶ Harakat';};
  $('#mbV1',body).onclick=()=>view(3.4);$('#mbV2',body).onclick=()=>view(4.6);$('#mbV3',body).onclick=()=>view(6.6);
  $('#mbQ',body).oninput=ev=>{const q=ev.target.value.trim().toLowerCase(),res=$('#mbRs',body);if(q.length<2){res.innerHTML='';return;}const D=MB.data[0],hits=[];if(!D||!D.names){res.innerHTML='Nomlar hali yuklanmagan…';return;}
   for(let k=0;k<D.n&&hits.length<10;k++)if(D.names[k].toLowerCase().includes(q))hits.push({i:0,k});
   res.innerHTML=hits.length?hits.map((h,x)=>`<a href="#" data-i="${x}">${esc(D.names[h.k])}</a>`).join('<br>'):'Topilmadi (nomlar faqat H ≤ 14 uchun)';
   res.querySelectorAll('a').forEach(l=>l.onclick=e2=>{e2.preventDefault();const h=hits[+l.dataset.i];if(MB.data[0]?.X){st.sel=h;view(2.2,MB.data[0].X[h.k],MB.data[0].Y[h.k]);info();st.dirty=true;}});};
  KoinotLab.state.labTick=dt=>{if(st.play){st.off+=30*Math.min(.1,dt||.016);if(st.off>3650)st.off=-3650;const s=$('#mbOff',body);if(s)s.value=Math.round(st.off);recompute();}
   statT+=dt||.016;if(statT>.8){statT=0;if(MB.busy||st.hist?.cn!==countActive())st.dirty=true;if(tierOf()!==MB.tier)apply();}
   if(st.dirty)render();};
  KoinotLab.state.cleanup=()=>{st.play=false;calcTok++;};
  const rs=()=>{st.dirty=true;};window.addEventListener('resize',rs);const old=KoinotLab.state.cleanup;KoinotLab.state.cleanup=()=>{old();window.removeEventListener('resize',rs);};
  MB.tier=tierOf();pump();recompute();render();view(4.6);
 }
 KX.tab('mainbelt','Asosiy kamar (MPC)',tab);
 KX.mb={MB,IDX,apply,active,countActive,get tier(){return MB.tier;},names:NAME};

 const start=()=>{MB.tier=tierOf();apply();};
 if(document.readyState==='complete')setTimeout(start,5000);else window.addEventListener('load',()=>setTimeout(start,5000));
})();
