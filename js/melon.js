(()=>{'use strict';
 if(!window.KoinotLab||!window.KX)return;
 const {$,esc,fmt,hidpi}=KX;
 const AU=149597870.7,K=0.004/12742e3;
 const mAU=a=>a*AU*1000*K;
 const km=d=>d*1000*K;
 const O=[
  {id:'sun',n:'Quyosh',d:1392000,a:0,obj:'qovun',eq:'katta qovun yoki tarvuz',c:'#ffb020'},
  {id:'mer',n:'Merkuriy',d:4879,a:.387,obj:'tariq donasi',eq:'tariq (sorgo) donasi',c:'#a39a90'},
  {id:'ven',n:'Venera',d:12104,a:.723,obj:'qora murch',eq:'qora murch donasi',c:'#e3c27d'},
  {id:'ear',n:'Yer',d:12742,a:1,obj:'chumoli',eq:'chumoli (4 mm)',c:'#3b7fd0'},
  {id:'moo',n:'Oy',d:3474,a:1,off:384400,obj:'kunjut urug‘i',eq:'kunjut urug‘i (~1 mm)',c:'#cfcfc8',moon:true},
  {id:'mar',n:'Mars',d:6779,a:1.524,obj:'tariq donasi',eq:'tariq donasi (~2 mm)',c:'#c1633f'},
  {id:'jup',n:'Yupiter',d:139820,a:5.203,obj:'ping-pong to‘pi',eq:'ping-pong to‘pi (4 sm)',c:'#d2b48c'},
  {id:'sat',n:'Saturn',d:116460,a:9.537,obj:'yong‘oq',eq:'yong‘oq (~3,7 sm); halqalari bilan ≈ 8,6 sm',c:'#e0cf9b',ring:273550},
  {id:'ura',n:'Uran',d:50724,a:19.19,obj:'yashil uzum',eq:'yashil uzum (~1,6 sm)',c:'#9fd7dd'},
  {id:'nep',n:'Neptun',d:49244,a:30.07,obj:'ko‘k uzum',eq:'to‘q uzum (~1,5 sm)',c:'#4b70dd'},
  {id:'plu',n:'Pluton',d:2377,a:39.48,obj:'tuz donasi',eq:'tuz donasi (<1 mm)',c:'#cdb8a5'},
  {id:'prx',n:'Proksima Kentavra',d:214700,ly:4.2465,obj:'tennis to‘pi',eq:'tennis to‘pi (6,7 sm)',c:'#ff7a45',star:true}];
 for(const o of O){o.r=km(o.d)/2;o.x=o.ly?o.ly*9.4607e15*K:mAU(o.a)+(o.off?km(o.off):0);}
 const byId=Object.fromEntries(O.map(o=>[o.id,o]));
 const MIN_LP=Math.log(.03),MAX_LP=Math.log(80000);
 const st={cx:-.55,cy:.62,lp:Math.log(185),sel:'sun',objects:true,fly:null,dirty:true};
 const rnd=(()=>{let s=7;return()=>(s=(s*16807)%2147483647)/2147483647;})();
 const stars=Array.from({length:140},()=>({x:rnd(),y:rnd(),a:.2+rnd()*.6,s:rnd()<.1?1.6:1}));
 const belt=Array.from({length:900},()=>({x:mAU(2.1+rnd()*1.2),y:(rnd()+rnd()+rnd()-1.5)*14}));
 const fL=m=>m<1e-3?fmt(m*1e6,0)+' µm':m<.01?fmt(m*1e3,1)+' mm':m<1?fmt(m*100,1)+' sm':m<1000?fmt(m,1)+' m':fmt(m/1000,2)+' km';
 const fT=s=>s<60?fmt(s,0)+' soniya':s<3600?fmt(s/60,0)+' daqiqa':fmt(s/3600,1)+' soat';
 const nice=px=>{const m=px;const p=Math.pow(10,Math.floor(Math.log10(m))),f=m/p;return (f>=5?5:f>=2?2:1)*p;};

 const circ=(c,x,y,r)=>{c.beginPath();c.arc(x,y,r,0,7);};
 const sph=(c,a,b,col)=>{const g=c.createRadialGradient(-.35,-.4,.05,0,0,1.05);g.addColorStop(0,a);g.addColorStop(1,b);c.fillStyle=g;circ(c,0,0,1);c.fill();};
 const D={
  melon(c){sph(c,'#e8efb0','#9bb04c');c.save();circ(c,0,0,1);c.clip();c.strokeStyle='rgba(70,95,30,.38)';c.lineWidth=.022;
   for(let k=-4;k<=4;k++){c.beginPath();c.ellipse(0,0,Math.abs(k)*.23+.001,1,0,-Math.PI/2,Math.PI/2,k<0);c.stroke();}
   c.strokeStyle='rgba(250,245,200,.2)';c.lineWidth=.012;for(let i=-9;i<=9;i++){c.beginPath();c.moveTo(-1,i*.11);c.quadraticCurveTo(0,i*.11+.05,1,i*.11);c.stroke();}
   const g=c.createRadialGradient(-.4,-.45,.02,-.3,-.35,.9);g.addColorStop(0,'rgba(255,255,230,.55)');g.addColorStop(1,'rgba(255,255,230,0)');c.fillStyle=g;c.fillRect(-1,-1,2,2);
   const s=c.createRadialGradient(.3,.4,.4,.2,.3,1.35);s.addColorStop(0,'rgba(0,0,0,0)');s.addColorStop(1,'rgba(20,35,0,.55)');c.fillStyle=s;c.fillRect(-1,-1,2,2);c.restore();
   c.fillStyle='#6b5326';c.beginPath();c.moveTo(-.06,-.98);c.lineTo(-.04,-1.12);c.lineTo(.05,-1.12);c.lineTo(.06,-.98);c.fill();},
  ant(c){c.lineCap='round';c.strokeStyle='#241309';c.lineWidth=.045;
   for(const s of[-1,1])for(const [bx,k] of[[.12,-.5],[0,0],[-.12,.55]]){c.beginPath();c.moveTo(bx,s*.1);c.lineTo(bx+k*.35,s*.42);c.lineTo(bx+k*.3-.12,s*.72);c.stroke();}
   for(const s of[-1,1]){c.beginPath();c.moveTo(.82,s*.06);c.lineTo(1.0,s*.16);c.lineTo(1.18,s*.04);c.stroke();}
   const bd=(x,rx,ry,a,b)=>{const g=c.createRadialGradient(x-rx*.3,-ry*.5,.01,x,0,rx*1.2);g.addColorStop(0,a);g.addColorStop(1,b);c.fillStyle=g;c.beginPath();c.ellipse(x,0,rx,ry,0,0,7);c.fill();};
   bd(-.62,.46,.32,'#6b3d22','#1d0f06');bd(0,.27,.15,'#5a3118','#1d0f06');bd(.62,.26,.22,'#6b3d22','#1d0f06');
   c.fillStyle='#0c0603';circ(c,.7,-.1,.045);c.fill();circ(c,.7,.1,.045);c.fill();},
  sesame(c){const g=c.createLinearGradient(-1,0,1,0);g.addColorStop(0,'#d9c79a');g.addColorStop(1,'#f4ead0');c.fillStyle=g;c.beginPath();c.moveTo(-1,0);c.quadraticCurveTo(-.3,-.8,.7,-.5);c.lineTo(1,0);c.lineTo(.7,.5);c.quadraticCurveTo(-.3,.8,-1,0);c.fill();},
  grain(c,col,hi){sph(c,hi,col);},
  pepper(c){sph(c,'#4a4036','#14100c');c.strokeStyle='rgba(255,255,255,.12)';c.lineWidth=.07;for(let i=0;i<4;i++){c.beginPath();c.arc(0,0,.25+i*.18,.4+i,1.7+i);c.stroke();}},
  pingpong(c){sph(c,'#ffffff','#e3ded6');c.fillStyle='rgba(250,140,40,.15)';circ(c,0,0,1);c.fill();c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=.04;c.beginPath();c.arc(-.15,-.2,.7,3.5,4.6);c.stroke();},
  walnut(c){sph(c,'#c9a26a','#7d5a32');c.strokeStyle='rgba(60,35,15,.55)';c.lineWidth=.035;c.beginPath();c.moveTo(0,-1);c.quadraticCurveTo(.15,0,0,1);c.stroke();
   for(let i=0;i<14;i++){const a=i*2.4,r=.25+(i%5)*.14;c.beginPath();c.arc(Math.cos(a)*r*.8,Math.sin(a)*r*.8,.1+.05*(i%3),a,a+1.3);c.stroke();}},
  grape(c,a,b){sph(c,a,b);c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(-.38,-.45,.2,.12,-.6,0,7);c.fill();c.fillStyle='#4b3a1c';c.fillRect(-.05,-1.12,.1,.18);},
  salt(c){c.save();c.rotate(.5);const g=c.createLinearGradient(-1,-1,1,1);g.addColorStop(0,'#ffffff');g.addColorStop(1,'#cfd6dc');c.fillStyle=g;c.fillRect(-.8,-.8,1.6,1.6);c.strokeStyle='rgba(120,140,160,.5)';c.lineWidth=.08;c.strokeRect(-.8,-.8,1.6,1.6);c.restore();},
  tennis(c){sph(c,'#e9f06a','#a9b82a');c.save();circ(c,0,0,1);c.clip();c.strokeStyle='#f8fbe8';c.lineWidth=.07;c.beginPath();c.arc(-1.05,0,1.0,-1,1);c.stroke();c.beginPath();c.arc(1.05,0,1.0,Math.PI-1,Math.PI+1);c.stroke();c.restore();},
  star(c){const g=c.createRadialGradient(-.3,-.3,.05,0,0,1);g.addColorStop(0,'#ffd7a8');g.addColorStop(.6,'#ff7a45');g.addColorStop(1,'#b5361b');c.fillStyle=g;circ(c,0,0,1);c.fill();}
 };
 function drawObj(c,o,x,y,r){c.save();c.translate(x,y);c.scale(r,r);
  switch(o.id){case'sun':D.melon(c);break;case'ear':D.ant(c);break;case'moo':D.sesame(c);break;case'mer':case'mar':D.grain(c,'#c9a21f','#f4e08a');break;case'ven':D.pepper(c);break;
   case'jup':D.pingpong(c);break;case'sat':D.walnut(c);break;case'ura':D.grape(c,'#d6f0a0','#7aa83c');break;case'nep':D.grape(c,'#9a86d8','#3b2a78');break;case'plu':D.salt(c);break;case'prx':D.tennis(c);break;}
  c.restore();}
 function drawPlanet(c,o,x,y,r){c.save();c.translate(x,y);c.scale(r,r);
  if(o.id==='sun'){const g=c.createRadialGradient(0,0,.2,0,0,1);g.addColorStop(0,'#fff6c0');g.addColorStop(.7,'#ffc23a');g.addColorStop(1,'#f08a1c');c.fillStyle=g;circ(c,0,0,1);c.fill();}
  else if(o.id==='ear'){sph(c,'#7fc0ff','#14437f');c.fillStyle='rgba(80,170,90,.8)';c.beginPath();c.ellipse(-.25,-.1,.35,.25,.5,0,7);c.fill();c.beginPath();c.ellipse(.35,.3,.22,.3,-.4,0,7);c.fill();}
  else if(o.id==='jup'||o.id==='sat'){if(o.id==='sat'){c.strokeStyle='rgba(215,195,150,.85)';c.lineWidth=.3;c.beginPath();c.ellipse(0,0,1.75,.5,-.35,Math.PI,2*Math.PI);c.stroke();}
   sph(c,'#f0dcb4','#a8825a');c.save();circ(c,0,0,1);c.clip();c.fillStyle='rgba(120,70,40,.28)';for(const yy of[-.55,-.1,.35])c.fillRect(-1,yy,2,.16);c.restore();
   if(o.id==='sat'){c.strokeStyle='rgba(215,195,150,.9)';c.lineWidth=.3;c.beginPath();c.ellipse(0,0,1.75,.5,-.35,0,Math.PI);c.stroke();}}
  else sph(c,'#ffffff',o.c);
  c.restore();}
 function human(c,P,H){
  const x0=-1.25,fy=-.22,s=1.75;const p=(dx,dy)=>P(x0+dx*s,fy+dy*s);c.fillStyle='rgba(140,170,195,.5)';c.strokeStyle='rgba(140,170,195,.5)';
  const [hx,hy]=p(0,.935),hr=.065*s*H;c.beginPath();c.arc(hx,hy,hr,0,7);c.fill();
  const q=(a,b,w)=>{const [x1,y1]=p(a[0],a[1]),[x2,y2]=p(b[0],b[1]);c.lineWidth=w*s*H;c.lineCap='round';c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();};
  q([0,.86],[0,.5],.15);q([-.06,.82],[-.1,.48],.045);q([.06,.82],[.14,.58],.045);q([-.03,.5],[-.04,0],.06);q([.03,.5],[.05,0],.06);}
 function tower(c,P){const x0=-200,h=375;const p=(dx,y)=>P(x0+dx,y);c.fillStyle='rgba(140,170,195,.4)';c.beginPath();let a=p(-12,-.22);c.moveTo(a[0],a[1]);a=p(-3,250);c.lineTo(a[0],a[1]);a=p(-1,375);c.lineTo(a[0],a[1]);a=p(1,375);c.lineTo(a[0],a[1]);a=p(3,250);c.lineTo(a[0],a[1]);a=p(12,-.22);c.lineTo(a[0],a[1]);c.fill();
  const [bx,by]=p(0,270),[rx,ry]=[P(14,0)[0]-P(0,0)[0],P(0,0)[1]-P(0,22)[1]];c.beginPath();c.ellipse(bx,by,Math.abs(rx),Math.abs(ry),0,0,7);c.fill();}
 function field(c,P){const [x1,y1]=P(-135,-22),[x2,y2]=P(-30,-90);c.fillStyle='rgba(40,110,60,.45)';c.fillRect(x1,y1,x2-x1,y2-y1);c.strokeStyle='rgba(235,245,235,.55)';c.lineWidth=1;c.strokeRect(x1,y1,x2-x1,y2-y1);
  const mx=(x1+x2)/2;c.beginPath();c.moveTo(mx,y1);c.lineTo(mx,y2);c.stroke();c.beginPath();c.arc(mx,(y1+y2)/2,9.15*(x2-x1)/105,0,7);c.stroke();}

 function tab(body){
  body.innerHTML=`<div class="x-grid"><div class="x-main"><canvas class="lab-view x-mel" style="height:min(62vh,520px);width:100%;cursor:grab;touch-action:none" aria-label="Qovun modeli: Quyosh sistemasi bitta masshtabda"></canvas>
  <div class="x-hint">G‘ildirak — yaqinlashish/uzoqlashish · sudrash — siljitish · obyektga bosing — ma’lumot · ikki marta bosing — yaqinlashish.</div></div>
  <div class="x-side"><div class="lab-row"><label>Obyekt <select id="melSel">${O.map(o=>`<option value="${o.id}">${o.n}</option>`).join('')}</select></label><button id="melGo">Uchib borish</button></div>
  <div class="lab-row"><button id="melV1">Qovun va odam</button><button id="melV2">Yer — chumoli</button><button id="melV6">Yer va Oy</button><button id="melV3">Ichki sayyoralar</button><button id="melV4">Neptun/Pluton</button><button id="melV5">Eng yaqin yulduz</button></div>
  <div class="lab-row"><label><input type="checkbox" id="melObj" ${st.objects?'checked':''}> Buyum ko‘rinishi (o‘chirsangiz — sayyora ko‘rinishi)</label></div>
  <div class="lab-result" id="melInfo"></div></div></div>
  <p class="lab-note">Masshtab 1 : ${fmt(1/K/1000/1000,0)} mln (Yer 12 742 km → 4 mm). Hamma o‘lcham va masofa haqiqiy diametr va orbitaning katta yarim o‘qidan bir xil koeffitsiyent bilan hisoblangan; orbitalar aslida ellips, shuning uchun masofalar o‘rtacha. Buyum rasmlari tasavvur uchun taxminiy. Proksima Kentavra masofasi 4,2465 yorug‘lik yili. Odam, teleminora va futbol maydoni — o‘lchov taqqoslash uchun.</p>`;
  const cv=$('.x-mel',body),sel=$('#melSel',body);sel.value=st.sel;
  let W=600,H=400,drag=null,ptrs=new Map(),moved=0,lastPinch=0;
  const ppm=()=>Math.exp(st.lp),P=(x,y)=>[W/2+(x-st.cx)*ppm(),H/2-(y-st.cy)*ppm()];
  const clampLp=()=>{st.lp=Math.min(MAX_LP,Math.max(MIN_LP,st.lp));};
  function fit(x0,x1,cy=0){st.cx=(x0+x1)/2;st.cy=cy;st.lp=Math.log(W*.88/(x1-x0));clampLp();st.dirty=true;}
  function flyTo(cx,cy,lp,ms=1500){clampLp();st.fly={c0:st.cx,y0:st.cy,l0:st.lp,c1:cx,y1:cy,l1:Math.min(MAX_LP,Math.max(MIN_LP,lp)),t:0,T:ms/1000,t0:performance.now()};}
  const focusFor=o=>{const rr=o.r;const want=o.id==='sun'?150:o.id==='prx'?90:70;return {cx:o.x,cy:0,lp:Math.log(want/rr)};};
  function go(o){const f=focusFor(o);flyTo(f.cx,f.cy,f.lp);select(o.id,true);}
  function select(id,keep){st.sel=id;sel.value=id;info();st.dirty=true;}
  function info(){const o=byId[st.sel],dm=o.r*2,walkS=o.x/(4.8e3/3600);
   const real=o.ly?fmt(o.ly,4)+' yorug‘lik yili':o.a?fmt(o.a,3)+' AU ('+fmt(o.a*AU/1e6,1)+' mln km)':'—';
   const dist=o.id==='sun'?'markaz':o.moo||o.moon?fL(km(o.off))+' (Yerdan)':fL(o.x);
   $('#melInfo',body).innerHTML=`<b>${esc(o.n)}</b> — modelda <b>${esc(o.eq)}</b> o‘lchamida<br>Haqiqiy diametri: <b>${fmt(o.d,0)} km</b> (Yerdan ${fmt(o.d/12742,2)}×)<br>Modeldagi diametri: <b>${fL(dm)}</b>${o.ring?' · halqalari bilan '+fL(km(o.ring)):''}<br>`+
   (o.id==='sun'?'Quyosh markazda turibdi; hamma masofa shu qovunning markazidan hisoblangan.':`Quyoshdan masofa: <b>${dist}</b>${o.moon?'':` · haqiqiy: ${real}`}<br>${o.moon?'':`Qadam bilan: ≈ <b>${fmt(o.x/.75,o.x/.75<10?1:0)}</b> qadam · piyoda (4,8 km/soat): ≈ <b>${fT(walkS)}</b>`}`);}
  function render(){
   const r0=cv.getBoundingClientRect();if(!r0.width)return;const hp=hidpi(cv);const c=hp.ctx;W=hp.w;H=hp.h;const pp=ppm();
   const bg=c.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#01040a');bg.addColorStop(1,'#08172a');c.fillStyle=bg;c.fillRect(0,0,W,H);
   for(const s of stars){c.fillStyle='rgba(200,220,255,'+s.a+')';c.fillRect(s.x*W,s.y*H,s.s,s.s);}
   const ay=P(0,0)[1];
   if(pp*13>3){field(c,P);}
   if(pp*375>12)tower(c,P);
   if(pp*1.75>14&&pp*1.75<4500)human(c,P,pp);

   c.font='11px system-ui,sans-serif';c.textAlign='center';c.fillStyle='rgba(160,190,215,.85)';
   const lab=(t,x,y)=>{if(x>-80&&x<W+80&&y>14&&y<H-4)c.fillText(t,x,y);};
   if(pp*375>12){const [x,y]=P(-200,375);lab('Toshkent teleminorasi · 375 m',x,y-8);}
   if(pp*13>3){const [x,y]=P(-82,-90);lab('Futbol maydoni · 105×68 m',x,y+14);}
   if(pp*1.75>14&&pp*1.75<4500){const [x,y]=P(-1.25,1.58);lab('Odam · 1,75 m',x,y-14);}

   c.strokeStyle='rgba(120,160,190,.22)';c.lineWidth=1;c.setLineDash([4,6]);c.beginPath();c.moveTo(0,ay);c.lineTo(W,ay);c.stroke();c.setLineDash([]);
   const bx0=P(belt[0].x,0)[0];if(pp>.05){c.fillStyle='rgba(170,150,130,.5)';for(const b of belt){const [x,y]=P(b.x,b.y);if(x>-2&&x<W+2&&y>-2&&y<H+2)c.fillRect(x,y,1,1);}}
   const bm=P(mAU(2.65),0);if(pp<30&&bm[0]>-100&&bm[0]<W+100){c.fillStyle='rgba(190,170,150,.8)';c.fillText('Asteroid kamari (har biri <0,3 mm)',bm[0],ay+(pp*14>40?pp*14:40)+0);}

   const labels=[];
   for(const o of O){const [x,y]=P(o.x,0),rp=o.r*pp;if(x<-300-rp||x>W+300+rp)continue;
    if(rp<1.6){const dim=!(o.moon&&Math.abs(x-P(byId.ear.x,0)[0])<30);c.fillStyle=o.c;c.beginPath();c.arc(x,y,2.4,0,7);c.fill();if(dim){c.strokeStyle=o.c;c.globalAlpha=.5;c.lineWidth=1;c.beginPath();c.arc(x,y,8,0,7);c.stroke();c.globalAlpha=1;}}
    else{if(o.id==='sun'&&rp>2){const g=c.createRadialGradient(x,y,rp*.9,x,y,rp*2.2);g.addColorStop(0,'rgba(255,190,70,.25)');g.addColorStop(1,'rgba(255,190,70,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,rp*2.2,0,7);c.fill();}
     (st.objects?drawObj:drawPlanet)(c,o,x,y,rp);}
    if(o.id===st.sel){c.strokeStyle='#7fd6ff';c.lineWidth=1.5;c.setLineDash([5,4]);c.beginPath();c.arc(x,y,Math.max(rp,2.4)+(rp<1.6?10:7),0,7);c.stroke();c.setLineDash([]);}
    if(o.moon&&Math.abs(x-P(byId.ear.x,0)[0])<34)continue;
    const nm=st.objects&&rp>=1.6&&rp<1e4&&o.obj?o.n+' · '+o.obj:o.n;labels.push({o,x,rp,t:nm,w:c.measureText(nm).width+10});}
   labels.sort((a,b)=>a.x-b.x);const lv=[];c.textAlign='center';
   for(const L of labels){let k=0;while((lv[k]??-1e9)>L.x-L.w/2-4)k++;lv[k]=L.x+L.w/2;L.k=k;
    if(L.x<-60||L.x>W+60)continue;const top=Math.min(ay-Math.max(L.rp,3)-10,ay-12),y=Math.max(14,top-k*17);
    c.fillStyle='rgba(2,10,20,.72)';c.fillRect(L.x-L.w/2,y-11,L.w,15);c.fillStyle=L.o.id===st.sel?'#bfe9ff':'#e5f1fb';c.font='12px system-ui,sans-serif';c.fillText(L.t,L.x,y);
    if(k>0){c.strokeStyle='rgba(160,190,215,.3)';c.beginPath();c.moveTo(L.x,y+4);c.lineTo(L.x,ay-Math.max(L.rp,3));c.stroke();}}

   const m=nice(130/pp),bw=m*pp;c.strokeStyle='#cfe8ff';c.lineWidth=2;c.beginPath();c.moveTo(16,H-18);c.lineTo(16+bw,H-18);c.moveTo(16,H-24);c.lineTo(16,H-12);c.moveTo(16+bw,H-24);c.lineTo(16+bw,H-12);c.stroke();
   c.textAlign='left';c.fillStyle='#cfe8ff';c.font='12px system-ui,sans-serif';c.fillText(fL(m),16,H-28);
   c.fillStyle='rgba(180,210,235,.75)';c.fillText('Ekran kengligi ≈ '+fL(W/pp)+' (modelda)',16,18);
   c.textAlign='right';c.fillText('1 sm modelda ≈ '+fmt(.01/K/1000,0)+' km haqiqatda',W-14,18);
   st.dirty=false;}
  function hit(mx,my){let best=null,bd=1e9;for(const o of O){const [x,y]=P(o.x,0),rp=Math.max(o.r*pp(),0),d=Math.hypot(mx-x,my-y);const lim=Math.max(rp,12);if(d<lim&&d<bd){best=o;bd=d;}}return best;}
  const pp=ppm;
  function zoomAt(mx,my,f){const wx=st.cx+(mx-W/2)/ppm(),wy=st.cy-(my-H/2)/ppm();st.lp+=Math.log(f);clampLp();st.cx=wx-(mx-W/2)/ppm();st.cy=wy+(my-H/2)/ppm();st.dirty=true;}
  cv.addEventListener('wheel',e=>{e.preventDefault();st.fly=null;const r=cv.getBoundingClientRect();zoomAt(e.clientX-r.left,e.clientY-r.top,Math.exp(-e.deltaY*(e.ctrlKey?.01:.0018)));},{passive:false});
  cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});st.fly=null;moved=0;drag={x:e.clientX,y:e.clientY};cv.style.cursor='grabbing';if(ptrs.size===2){const a=[...ptrs.values()];lastPinch=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);}});
  cv.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;const p=ptrs.get(e.pointerId);
   if(ptrs.size===2){p.x=e.clientX;p.y=e.clientY;const a=[...ptrs.values()],d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),r=cv.getBoundingClientRect();if(lastPinch>0)zoomAt((a[0].x+a[1].x)/2-r.left,(a[0].y+a[1].y)/2-r.top,d/lastPinch);lastPinch=d;moved=99;return;}
   const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;moved+=Math.abs(dx)+Math.abs(dy);st.cx-=dx/ppm();st.cy+=dy/ppm();st.dirty=true;});
  const up=e=>{const was=ptrs.size;ptrs.delete(e.pointerId);cv.style.cursor='grab';if(was===1&&moved<5){const r=cv.getBoundingClientRect(),o=hit(e.clientX-r.left,e.clientY-r.top);if(o)select(o.id);}};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('dblclick',e=>{const r=cv.getBoundingClientRect(),o=hit(e.clientX-r.left,e.clientY-r.top);if(o)go(o);else zoomAt(e.clientX-r.left,e.clientY-r.top,2.2);});
  sel.onchange=()=>{select(sel.value);};$('#melGo',body).onclick=()=>go(byId[sel.value]);
  $('#melObj',body).onchange=e=>{st.objects=e.target.checked;st.dirty=true;};
  const view=(x0,x1,cy)=>{const lp=Math.log(W*.88/(x1-x0));flyTo((x0+x1)/2,cy||0,lp);};
  $('#melV1',body).onclick=()=>{select('sun');flyTo(-.55,.62,Math.log(185));};
  $('#melV2',body).onclick=()=>{select('ear');const e=byId.ear;flyTo(e.x+.0005,0,Math.log(W*.75/.012));};
  $('#melV6',body).onclick=()=>{select('ear');const e=byId.ear;view(e.x-.012,e.x+.14,0);};
  $('#melV3',body).onclick=()=>view(-6,80,0);
  $('#melV4',body).onclick=()=>view(-60,1950,0);
  $('#melV5',body).onclick=()=>{select('prx');view(-600,13200,0);};
  KoinotLab.state.labTick=dt=>{const f=st.fly;if(f){f.t=(performance.now()-f.t0)/1000;let u=Math.min(1,f.t/f.T);u=u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;st.lp=f.l0+(f.l1-f.l0)*u;
    const i0=1/Math.exp(f.l0),i1=1/Math.exp(f.l1),den=i0-i1;const w=Math.abs(den)/Math.max(i0,i1)>.02?(i0-1/Math.exp(st.lp))/den:u;st.cx=f.c0+(f.c1-f.c0)*w;st.cy=f.y0+(f.y1-f.y0)*u;if(f.t>=f.T)st.fly=null;st.dirty=true;}
   if(st.dirty)render();};
  KoinotLab.state.cleanup=()=>{st.fly=null;};
  const rs=()=>{st.dirty=true;};window.addEventListener('resize',rs);const old=KoinotLab.state.cleanup;KoinotLab.state.cleanup=()=>{old();window.removeEventListener('resize',rs);};
  info();render();
 }
 KX.tab('melon','Qovun modeli',tab);KX.melon={O,K,st};
})();
