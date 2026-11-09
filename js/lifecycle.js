(()=>{'use strict';
 const KX=window.KX;if(!KX?.tab)return;
 const {$,esc,fmt}=KX,TSUN=5772;
 const lumOf=M=>M<.43?.23*Math.pow(M,2.3):M<2?Math.pow(M,4):M<55?1.4*Math.pow(M,3.5):32000*M;
 const radOf=M=>M>1?Math.pow(M,.8):Math.pow(M,.9);

 const TAB=[[1.5,2.7e9],[2,1.2e9],[3,3.5e8],[4,1.7e8],[5,9.4e7],[7,4.3e7],[9,2.6e7],[12,1.6e7],[15,1.2e7],[20,8.8e6],[25,6.6e6],[40,4.6e6],[60,3.5e6],[120,2.6e6]];
 function lifeOf(M,L){if(M<1.5)return 10e9*M/L;if(M>=120)return 2.6e6;for(let i=1;i<TAB.length;i++)if(M<=TAB[i][0]){const a=TAB[i-1],b=TAB[i],f=(Math.log(M)-Math.log(a[0]))/(Math.log(b[0])-Math.log(a[0]));return Math.exp(Math.log(a[1])+f*(Math.log(b[1])-Math.log(a[1])));}return 2.6e6;}
 const tempOf=(L,R)=>TSUN*Math.pow(L/(R*R),.25);
 function fmtYr(y){if(!(y>0))return '—';if(y<1e3)return fmt(y,0)+' yil';if(y<1e6)return fmt(y/1e3,y<1e4?1:0)+' ming yil';if(y<1e9)return fmt(y/1e6,y<1e7?1:0)+' mln yil';if(y<1e12)return fmt(y/1e9,y<1e10?1:0)+' mlrd yil';return fmt(y/1e12,1)+' trln yil';}
 function kToRGB(K){const t=Math.max(10,Math.min(400,K/100));let r,g,b;
  r=t<=66?255:329.698727446*Math.pow(t-60,-.1332047592);g=t<=66?99.4708025861*Math.log(t)-161.1195681661:288.1221695283*Math.pow(t-60,-.0755148492);b=t>=66?255:t<=19?0:138.5177312231*Math.log(t-10)-305.0447927307;
  const c=v=>Math.round(Math.max(0,Math.min(255,v)));return [c(r),c(g),c(b)];}

 function model(M){
  const L=lumOf(M),R=radOf(M),T=tempOf(L,R),tMS=lifeOf(M,L),tKH=3e7*M*M/(R*L),tG=.12*tMS;
  let end,stages;
  if(M<.08){end='bd';stages=['cloud','proto','bd'];}
  else if(M<8){end='wd';stages=['cloud','proto','ms','giant','pn','wd'];}
  else if(M<20){end='ns';stages=['cloud','proto','ms','giant','sn','ns'];}
  else{end='bh';stages=['cloud','proto','ms','giant','sn','bh'];}
  const Rg=Math.max(80,Math.min(1500,120*Math.pow(M,.6))),Tg=M<8?3600:3800,Lg=Rg*Rg*Math.pow(Tg/TSUN,4);
  const Mwd=Math.max(.2,Math.min(1.4,.109*M+.394)),Rwd=.0126*Math.pow(Mwd,-1/3),Twd=80000,Lwd=Rwd*Rwd*Math.pow(Twd/TSUN,4);
  const Mbh=M<30?Math.max(5,M*.25):M*.3;
  return {M,L,R,T,tMS,tKH,tG,end,stages,Rg,Tg,Lg,Mwd,Rwd,Twd,Lwd,Mbh};}
 const NAMES={cloud:'Gaz-chang buluti',proto:'Protoyulduz',ms:'Bosh ketma-ketlik',giant:'Gigant',pn:'Planetar tumanlik',wd:'Oq mitti',sn:'Supernova',ns:'Neytron yulduz',bh:'Qora tuynuk',bd:'Jigarrang mitti'};
 function info(m,st){const f=fmt;switch(st){
  case 'cloud':return 'Sovuq gaz va chang buluti o‘z og‘irligi ta’sirida siqila boshlaydi. Bu bosqich yulduz massasiga qarab yuz ming–bir necha million yil davom etishi mumkin.';
  case 'proto':return `Bulut markazi qiziydi va yarqiray boshlaydi, hali vodorod “yonmaydi”. Qisilish ≈ ${fmtYr(m.tKH)} davom etadi (taxminiy).`+(m.end==='bd'?' Massa 0,08 M☉ dan kam: yadroda vodorod sintezi uchun yetarli harorat hosil bo‘lmaydi.':'');
  case 'ms':return `Yadroda vodorod geliyga aylanadi — yulduz umrining asosiy qismi shu yerda. Massa ${f(m.M,2)} M☉, yorqinlik ≈ ${f(m.L,m.L<10?2:0)} L☉, sirt harorati ≈ ${f(m.T,0)} K. Bu bosqich ≈ ${fmtYr(m.tMS)} (taxminiy)${m.tMS>13.8e9?'. Bu koinot yoshidan (≈ 13,8 mlrd yil) uzun: shunday massali yulduzlarning hech biri hali umrining oxiriga yetmagan.':'.'}`;
  case 'giant':return `Yadroda vodorod tugaydi: yadro qisilib qiziydi, tashqi qatlamlar esa kengayib soviydi. Radiusi ≈ ${f(m.Rg,0)} R☉ ga yetadi, harorat ≈ ${f(m.Tg,0)} K (qizil). ${m.M>=8?'Bu — o‘ta gigant; yadroda og‘ir elementlar (uglerod, kislorod… temirgacha) ketma-ket sintezlanadi.':'Bu bosqich bosh ketma-ketlik umrining ≈ 12% ini oladi (taxminiy).'}`;
  case 'pn':return 'Gigantning tashqi qatlamlari sekin uchib ketib, chiroq kabi yonuvchi planetar tumanlik hosil qiladi (sayyoralarga aloqasi yo‘q — nomi tarixiy). Markazda yadro qoladi.';
  case 'wd':return (m.tMS>13.8e9?'Bunday massali yulduz koinot yoshida hali oq mittiga aylanishga ulgurmagan — bu nazariy bashorat. ':'')+`Oq mitti: massasi ≈ ${f(m.Mwd,2)} M☉ (taxminiy), o‘lchami ≈ Yer kattaligida (${f(m.Rwd*109.1,1)} R⊕). Termoyadro sintezi yo‘q — u faqat asta-sekin soviydi (milliardlab yillar).`;
  case 'sn':return 'Temir yadro endi energiya bera olmaydi, u bir necha soniyada qulaydi, tashqi qatlamlar kuchli portlash (II tur supernova) bilan otiladi. Bir necha hafta ichida butun galaktika yorqinligiga yaqin nur sochishi mumkin.';
  case 'ns':return 'Yadro qulab neytron yulduzga aylandi: massasi ≈ 1,4–2 M☉, diametri ≈ 20–25 km. Tez aylansa va magnit nurlari Yerga to‘g‘ri kelsa, pulsar sifatida ko‘rinadi.';
  case 'bh':return `Yadro juda og‘ir bo‘lgani uchun hatto neytron yulduz holatida ham to‘xtay olmaydi: qora tuynuk hosil bo‘ladi (massasi taxminan ${f(m.Mbh,0)} M☉ atrofida — massa yo‘qotishga bog‘liq, aniq emas). Supernova portlashi bo‘lishi ham, bo‘lmasligi ham mumkin.`;
  case 'bd':return 'Jigarrang mitti: yulduz bo‘la olmagan, vodorodni sintez qilmaydi. U asta-sekin soviydi va xiralashadi (gigant sayyoralar bilan yulduzlar o‘rtasidagi jism).';}return '';}

 const lerp=(a,b,u)=>a+(b-a)*u,llerp=(a,b,u)=>Math.exp(lerp(Math.log(a),Math.log(b),u)),ease=u=>u*u*(3-2*u);
 function state(m,k,u){
  const st=m.stages[k],S={st,R:m.R,T:m.T,L:m.L,age:0,u};const tPro=m.tKH;
  switch(st){
   case 'cloud':S.R=llerp(3e4,200,ease(u));S.T=15;S.L=0;S.age=0;break;
   case 'proto':{S.R=llerp(40,m.R,ease(u));S.T=llerp(3300,m.T,ease(u));S.L=llerp(Math.max(m.L*8,.5),m.L,ease(u));S.age=tPro*u;break;}
   case 'ms':{S.R=m.R*lerp(1,1.4,u);S.L=m.L*lerp(1,1.5,u);S.T=tempOf(S.L,S.R);S.age=tPro+m.tMS*u;break;}
   case 'giant':{const R0=m.R*1.4,L0=m.L*1.5,T0=tempOf(L0,R0);S.R=llerp(R0,m.Rg,ease(u));S.L=llerp(L0,m.Lg,ease(u));S.T=llerp(T0,m.Tg,ease(u));S.age=tPro+m.tMS+m.tG*u;break;}
   case 'pn':{S.R=llerp(.05,m.Rwd*4,u);S.T=llerp(30000,m.Twd,u);S.L=llerp(300,m.Lwd,u);S.age=tPro+m.tMS+m.tG*(1+.0001*u);break;}
   case 'wd':S.R=m.Rwd;S.T=llerp(m.Twd,9000,u);S.L=m.Rwd*m.Rwd*Math.pow(S.T/TSUN,4);S.age=tPro+m.tMS+m.tG*1.0001+3e9*u;break;
   case 'sn':S.R=llerp(m.Rg,1e-3,Math.min(1,u*3));S.T=llerp(m.Tg,1e6,u);S.L=m.Lg*lerp(1,40,u<.5?u*2:(1-u)*2);S.age=tPro+m.tMS+m.tG;break;
   case 'ns':S.R=1.72e-5;S.T=1e6;S.L=1e-4;S.age=tPro+m.tMS+m.tG+1e5*u;break;
   case 'bh':S.R=2.95*m.Mbh/6.957e5;S.T=0;S.L=0;S.age=tPro+m.tMS+m.tG+1e5*u;break;
   case 'bd':S.R=m.R;S.T=llerp(2500,1000,u);S.L=1e-5;S.age=tPro+1e9*u;break;}
  return S;}
 const px=R=>4+11*(Math.log10(Math.max(R,1e-6))+5)*.88;

 const ps={M:1,t:0,play:true,raf:0,gen:0};
 const sliderToM=v=>Math.exp(Math.log(.08)+(Math.log(60)-Math.log(.08))*v/1000),mToSlider=M=>Math.round(1000*(Math.log(M)-Math.log(.08))/(Math.log(60)-Math.log(.08)));
 const PRE=[['Qizil mitti (Proksima)',.12],['Quyosh',1],['Sirius A',2.0],['Vega',2.1],['Rigel (o‘ta gigant)',21],['Betelgeuse',18],['Juda katta (60 M☉)',60]].map(p=>p);
 KX.tab('life','Yulduz hayoti',body=>{
  body.innerHTML=`<p class="lab-note">Yulduz massasini tanlang — uning butun hayoti animatsiyada ko‘rsatiladi. <b>Sxematik model</b>: ko‘rsatkichlar taxminiy bog‘lanishlardan hisoblanadi (batafsil: pastda).</p>
  <div class="ob-row"><label style="flex:1;min-width:200px">Massa: <b id="lfM"></b> <input id="lfS" type="range" min="0" max="1000" style="width:100%"></label></div>
  <div class="ob-row">${PRE.map((p,i)=>`<button data-p="${i}">${esc(p[0])}</button>`).join('')}</div>
  <div class="ob-row"><button id="lfPlay" class="ob-go"></button><input id="lfT" type="range" min="0" max="1000" style="flex:1;min-width:140px"></div>
  <div class="ob-row" id="lfStg"></div>
  <div class="ob-two"><canvas id="lfCv" class="ob-cv" style="width:calc(50% - 6px);min-width:280px"></canvas><canvas id="lfHR" class="ob-cv" style="width:calc(50% - 6px);min-width:280px"></canvas></div>
  <div class="ob-sum" id="lfInfo"></div>
  <div class="ob-sum" id="lfFin"></div>
  <p class="lab-note">Eslatma: bosqichlarning bir xil uzunligi faqat animatsiya qulayligi uchun — haqiqiy davomiylik matnda yozilgan (masalan, bosh ketma-ketlik umrning ~90% idir). HR diagramma izi sxematik: protoyulduz bosqichi, gigantga o‘tish va oq mitti izi aniq hisob emas. Yulduz kattaligi logarifmik masshtabda chiziladi. Chegaralar (8 va 20 M☉) taxminiy, haqiqatda kimyoviy tarkib, juftlik va massa yo‘qotishiga bog‘liq. Formulalar fayl boshidagi izohda.</p>`;
  let m=model(ps.M);const gen=++ps.gen;
  const seed=[];for(let i=0;i<260;i++)seed.push([Math.random()*6.283,.3+Math.random()*.7,Math.random()]);
  const stars=[];for(let i=0;i<70;i++)stars.push([Math.random(),Math.random(),Math.random()]);
  const setM=M=>{ps.M=Math.max(.08,Math.min(60,M));m=model(ps.M);ps.t=Math.min(ps.t,m.stages.length-.001);$('#lfS',body).value=mToSlider(ps.M);$('#lfM',body).textContent=fmt(ps.M,ps.M<1?2:1)+' M☉';stg();upd();};
  const stg=()=>{$('#lfStg',body).innerHTML=m.stages.map((s,i)=>`<button data-s="${i}">${esc(NAMES[s])}</button>`).join('');};
  $('#lfS',body).oninput=e=>setM(sliderToM(+e.target.value));
  body.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{ps.t=0;setM(PRE[+b.dataset.p][1]);ps.play=true;pb();});
  $('#lfStg',body).onclick=e=>{const b=e.target.closest('[data-s]');if(b){ps.t=+b.dataset.s;ps.play=false;pb();upd();}};
  $('#lfT',body).oninput=e=>{ps.t=+e.target.value/1000*m.stages.length*.9999;ps.play=false;pb();upd();};
  const pb=()=>{$('#lfPlay',body).textContent=ps.play?'⏸ To‘xtatish':'▶ Boshlash';};
  $('#lfPlay',body).onclick=()=>{ps.play=!ps.play;if(ps.play&&ps.t>=m.stages.length-.01)ps.t=0;pb();};
  let last=performance.now();
  function frame(now){if(gen!==ps.gen||!body.isConnected||!$('#lfT',body))return;const dt=Math.min(.1,(now-last)/1000);last=now;
   if(ps.play){ps.t+=dt*.3;if(ps.t>=m.stages.length){ps.t=m.stages.length-.0001;ps.play=false;pb();}}
   upd(now);ps.raf=requestAnimationFrame(frame);}
  function upd(now){now=now||performance.now();const k=Math.min(m.stages.length-1,Math.floor(ps.t)),u=Math.min(1,ps.t-k),S=state(m,k,u);
   $('#lfT',body).value=Math.round(ps.t/m.stages.length*1000);
   body.querySelectorAll('#lfStg button').forEach(b=>b.classList.toggle('on',+b.dataset.s===k));
   $('#lfInfo',body).innerHTML=`<b>${esc(NAMES[S.st])}</b> — yosh ≈ ${esc(fmtYr(S.age))}<br>${esc(info(m,S.st))}`+(S.st==='ms'&&Math.abs(m.M-1)<.15?'<br><small>Quyosh hozir ≈ 4,6 mlrd yoshda — bosh ketma-ketlikning o‘rtasida.</small>':'');
   $('#lfFin',body).innerHTML=`<b>Yakuniy holat:</b> ${esc(NAMES[m.end==='bd'?'bd':m.end])} · <b>bosh ketma-ketlik umri:</b> ≈ ${esc(fmtYr(m.tMS))} · <b>Quyosh bilan solishtirganda:</b> yorqinligi ${fmt(m.L,m.L<10?2:0)}×, radiusi ${fmt(m.R,2)}×.`;
   drawStar(S,now);drawHR(S,k);}
  function drawStar(S,now){const cv=$('#lfCv',body),{ctx,w,h}=KX.hidpi(cv,Math.min(cv.clientWidth||340,320)),cx=w/2,cy=h/2;ctx.fillStyle='#02050b';ctx.fillRect(0,0,w,h);
   for(const s of stars){ctx.fillStyle=`rgba(255,255,255,${.15+.5*s[2]})`;ctx.fillRect(s[0]*w,s[1]*h,1.3,1.3);}
   const U=S.u,st=S.st;
   if(st==='cloud'){const rr=Math.min(w,h)*.46*(1-.8*ease(U));for(const p of seed){const a=p[0]+U*3*(1.2-p[1]),r=rr*p[1];const x=cx+r*Math.cos(a),y=cy+r*Math.sin(a)*.85;ctx.fillStyle=`rgba(${150+60*U|0},${110+60*U|0},${90+120*U|0},${.25+.5*p[2]})`;ctx.beginPath();ctx.arc(x,y,1.2+p[2]*1.6,0,7);ctx.fill();}
    const g=ctx.createRadialGradient(cx,cy,0,cx,cy,rr*.7);g.addColorStop(0,`rgba(255,200,140,${.1+.5*U})`);g.addColorStop(1,'rgba(255,200,140,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}
   else if(st==='bh'){const r=Math.max(6,Math.min(30,px(S.R)*.3+4));const g=ctx.createRadialGradient(cx,cy,r,cx,cy,r*2.6);g.addColorStop(0,'rgba(255,170,60,.9)');g.addColorStop(.4,'rgba(255,110,30,.35)');g.addColorStop(1,'rgba(255,100,20,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r*2.6,0,7);ctx.fill();ctx.fillStyle='#000';ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fill();ctx.strokeStyle='rgba(255,200,120,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(cx,cy,r*1.9,r*.55,-.25,0,7);ctx.stroke();}
   else if(st==='ns'){const ph=now/220;ctx.save();ctx.translate(cx,cy);ctx.rotate(ph*.5);for(const s of [1,-1]){const g=ctx.createLinearGradient(0,0,s*Math.min(w,h)*.5,0);g.addColorStop(0,'rgba(150,200,255,.7)');g.addColorStop(1,'rgba(150,200,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,-3);ctx.lineTo(s*Math.min(w,h)*.5,-14);ctx.lineTo(s*Math.min(w,h)*.5,14);ctx.lineTo(0,3);ctx.fill();}ctx.restore();ctx.fillStyle='#cfe6ff';ctx.beginPath();ctx.arc(cx,cy,5,0,7);ctx.fill();}
   else if(st==='sn'){const R0=Math.min(w,h)*.5,e=ease(U);const g=ctx.createRadialGradient(cx,cy,0,cx,cy,R0*(.15+.85*e));g.addColorStop(0,`rgba(255,255,255,${1-.7*U})`);g.addColorStop(.3,`rgba(255,200,120,${.9-.6*U})`);g.addColorStop(.7,`rgba(255,90,40,${.5-.4*U})`);g.addColorStop(1,'rgba(255,60,20,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,R0*(.15+.85*e),0,7);ctx.fill();}
   else{
    if(st==='pn'){const r=Math.min(w,h)*.45*(.25+.75*ease(U));const g=ctx.createRadialGradient(cx,cy,r*.55,cx,cy,r);g.addColorStop(0,'rgba(120,255,220,0)');g.addColorStop(.75,'rgba(120,255,220,.35)');g.addColorStop(.9,'rgba(255,120,160,.45)');g.addColorStop(1,'rgba(255,120,160,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fill();}
    const col=kToRGB(S.T),r=Math.max(2.2,Math.min(Math.min(w,h)*.42,px(S.R)*(st==='proto'?.9:1)));
    const lg=Math.min(1,Math.max(.15,(Math.log10(Math.max(S.L,1e-5))+5)/10));
    const gl=ctx.createRadialGradient(cx,cy,r*.6,cx,cy,r*(1.7+2*lg));gl.addColorStop(0,`rgba(${col[0]},${col[1]},${col[2]},.55)`);gl.addColorStop(1,`rgba(${col[0]},${col[1]},${col[2]},0)`);ctx.fillStyle=gl;ctx.beginPath();ctx.arc(cx,cy,r*(1.7+2*lg),0,7);ctx.fill();
    const g2=ctx.createRadialGradient(cx-r*.3,cy-r*.3,r*.1,cx,cy,r);g2.addColorStop(0,'#fff');g2.addColorStop(.35,`rgb(${col[0]},${col[1]},${col[2]})`);g2.addColorStop(1,`rgb(${col[0]*.55|0},${col[1]*.55|0},${col[2]*.55|0})`);ctx.fillStyle=g2;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fill();}
   ctx.fillStyle='#8aa6bd';ctx.font='11px system-ui';ctx.textAlign='left';ctx.textBaseline='top';
   const rtxt=S.st==='cloud'?'—':S.R>=.1?fmt(S.R,S.R<10?2:0)+' R☉':S.R>=1e-3?fmt(S.R*109.1,2)+' R⊕':fmt(S.R*6.957e5,S.st==='bh'?1:0)+' km';
   ctx.fillText('Radius ≈ '+rtxt+(S.T>0&&S.st!=='cloud'?' · T ≈ '+fmt(S.T,0)+' K':''),8,6);if(S.st!=='cloud'&&S.R<.5)ctx.fillText('(haqiqatda Quyoshdan ≈ '+fmt(1/S.R,S.R<1e-2?0:1)+' marta kichik)',8,22);ctx.fillText('o‘lcham — logarifmik masshtab',8,h-16);}
  function drawHR(S,k){const cv=$('#lfHR',body),{ctx,w,h}=KX.hidpi(cv,Math.min(cv.clientWidth||340,320)),L=48,Rr=w-8,T=10,B=h-26;ctx.fillStyle='#02050b';ctx.fillRect(0,0,w,h);
   const X=t=>L+(Rr-L)*(Math.log10(40000)-Math.log10(Math.max(2000,Math.min(40000,t))))/(Math.log10(40000)-Math.log10(2000));
   const Y=l=>B-(B-T)*(Math.log10(Math.max(1e-4,Math.min(1e6,l)))+4)/10;
   ctx.strokeStyle='#1d3043';ctx.fillStyle='#8aa6bd';ctx.font='10px system-ui';ctx.textAlign='right';ctx.textBaseline='middle';
   for(let e=-4;e<=6;e+=2){ctx.beginPath();ctx.moveTo(L,Y(10**e));ctx.lineTo(Rr,Y(10**e));ctx.stroke();ctx.fillText('10'+String(e).replace('-','⁻').replace(/\d/g,d=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[d]),L-3,Y(10**e));}
   ctx.textAlign='center';ctx.textBaseline='top';for(const t of [30000,10000,6000,4000,3000]){ctx.fillText(t,X(t),B+4);}
   ctx.fillText('Harorat (K) → past',(L+Rr)/2,B+14);

   ctx.strokeStyle='#4b6b86';ctx.lineWidth=5;ctx.globalAlpha=.4;ctx.beginPath();let f=true;for(let lm=Math.log(.1);lm<=Math.log(60);lm+=.1){const M=Math.exp(lm),l=lumOf(M),t=tempOf(l,radOf(M));f?ctx.moveTo(X(t),Y(l)):ctx.lineTo(X(t),Y(l));f=false;}ctx.stroke();ctx.globalAlpha=1;

   ctx.strokeStyle='#6fd0ff';ctx.lineWidth=1.6;ctx.beginPath();let first=true;const pts=[];
   for(let i=0;i<=k;i++){const uu=i<k?1:S.u,n=i<k?20:Math.max(2,Math.round(20*S.u));for(let j=0;j<=n;j++){const q=state(m,i,uu*j/n);if(['cloud','sn','ns','bh'].includes(q.st)||!(q.T>0)||!(q.L>0))continue;pts.push([X(q.T),Y(q.L)]);}}
   pts.forEach((p,i)=>{i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);});ctx.stroke();
   if(S.T>0&&S.L>0&&!['cloud','sn','ns','bh'].includes(S.st)){const col=kToRGB(S.T);ctx.fillStyle=`rgb(${col[0]},${col[1]},${col[2]})`;ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(X(S.T),Y(S.L),6,0,7);ctx.fill();ctx.stroke();}
   else{ctx.fillStyle='#ff9a8a';ctx.textAlign='center';ctx.fillText(S.st==='cloud'?'(hali yulduz emas)':'(HR diagrammadan tashqarida)',(L+Rr)/2,T+4);}
   ctx.save();ctx.translate(11,(T+B)/2);ctx.rotate(-Math.PI/2);ctx.fillStyle='#8aa6bd';ctx.textAlign='center';ctx.textBaseline='top';ctx.fillText('Yorqinlik (L☉)',0,0);ctx.restore();
   ctx.fillStyle='#8aa6bd';ctx.textAlign='left';ctx.textBaseline='top';ctx.fillText('Bosh ketma-ketlik (kulrang)',L+4,T+2);}
  pb();setM(ps.M);requestAnimationFrame(frame);
 });
 KX.life={model,state,lumOf,fmtYr};
})();
