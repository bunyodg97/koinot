(()=>{'use strict';
 if(!window.KoinotLab)return;
 const {$,esc,fmt,hidpi}=KX;

 const K_V=29.7847;
 function orbitInfo(o){const hyp=o.e>=1,q=hyp?Math.abs(o.a)*(o.e-1):o.a*(1-o.e),Q=hyp?null:o.a*(1+o.e),vq=K_V*Math.sqrt(Math.max(0,2/q-1/o.a)),vinf=hyp?K_V*Math.sqrt(-1/o.a):null;return {hyp,q,Q,vq,vinf};}
 function smallTab(body){
  const S=KOINOT_SMALL;let cur=S[0],ang=0;
  body.innerHTML=`<div class="x-grid"><div class="x-main"><canvas class="lab-view x-orb" aria-label="Orbita shakli"></canvas></div><div class="x-side"><div class="lab-row"><label>Jism <select id="smSel">${S.map(o=>`<option value="${o.id}">${o.name}</option>`).join('')}</select></label></div><div class="lab-row"><label>Ko‘rinish radiusi <select id="smScale"><option value="0">Avto</option><option value="2">2 AU</option><option value="6">6 AU</option><option value="40">40 AU</option><option value="400">400 AU</option></select></label></div><div class="lab-result" id="smInfo"></div></div></div>
  <p class="lab-note">Diagramma orbitaning <b>shakli va o‘lchamini</b> ko‘rsatadi (a, e bo‘yicha, perigeliy o‘ngda); real yo‘nalish (Ω, ω) va hozirgi joylashuv ko‘rsatilmaydi, nuqtaning harakati tezlashtirilgan va fazasi ixtiyoriy. Elementlar yaxlitlangan; aniq efemerida uchun NASA JPL Small-Body Database (ssd.jpl.nasa.gov) dan foydalaning. q — perigeliy, Q — afeliy; tezlik vis-viva formulasidan.</p>`;
  const canvas=$('.x-orb',body);
  const R=[[1,'Yer'],[1.524,'Mars'],[5.203,'Yupiter'],[9.537,'Saturn'],[30.07,'Neptun']];
  function solve(M,e){let E=M;for(let n=0;n<30;n++)E=E-(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));return E;}
  function pos(o,inf,phase){
   if(inf.hyp){const th=(phase*2-1)*Math.acos(-1/o.e)*.92,r=inf.q*(1+o.e)/(1+o.e*Math.cos(th));return [r*Math.cos(th),r*Math.sin(th)];}
   const E=solve(phase*2*Math.PI,o.e),x=o.a*(Math.cos(E)-o.e),y=o.a*Math.sqrt(1-o.e*o.e)*Math.sin(E);return [x,y];}
  function draw(){
   const inf=orbitInfo(cur),{ctx,w,h}=hidpi(canvas,340);let view=+$('#smScale',body).value;if(!view){const need=inf.hyp?Math.max(3,inf.q*3):inf.Q*1.1;view=[2,6,40,400].find(v=>v>=need)||400;}
   const cx=w/2,cy=h/2,sc=Math.min(w,h)/2/view*.92,P=(x,y)=>[cx+x*sc,cy-y*sc];
   ctx.fillStyle='#050d16';ctx.fillRect(0,0,w,h);ctx.lineWidth=1;ctx.font='10px system-ui';
   for(const [r,n] of R){if(r>view*1.05)continue;ctx.strokeStyle='#5f87a355';ctx.beginPath();ctx.arc(cx,cy,r*sc,0,7);ctx.stroke();ctx.fillStyle='#6e93ad';ctx.fillText(n,cx+r*sc*.71+3,cy-r*sc*.71);}
   ctx.beginPath();ctx.arc(cx,cy,4,0,7);ctx.fillStyle='#ffc94d';ctx.fill();
   ctx.strokeStyle='#5cd5ff';ctx.lineWidth=2;ctx.beginPath();const N=360;for(let n=0;n<=N;n++){const [x,y]=pos(cur,inf,n/N),[px,py]=P(x,y);n?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();
   const [x,y]=pos(cur,inf,ang),[px,py]=P(x,y);ctx.beginPath();ctx.arc(px,py,5,0,7);ctx.fillStyle='#fff';ctx.fill();ctx.fillStyle='#cfe6f7';ctx.font='11px system-ui';ctx.fillText(cur.name,Math.min(px+9,w-130),py-8);ctx.fillStyle='#6e93ad';ctx.fillText('Ko‘rinish radiusi ≈ '+view+' AU',10,h-10);
  }
  function info(){const o=cur,i=orbitInfo(o);$('#smInfo',body).innerHTML=`<b>${esc(o.name)}</b> · ${esc(o.type)}<br>Yarim katta o‘q a = ${o.a<0?'−'+fmt(Math.abs(o.a),3):fmt(o.a,3)} AU · ekssentrisitet e = ${fmt(o.e,4)} · og‘ish i = ${fmt(o.i,1)}°${o.i>90?' (<b>retrograd</b>)':''}<br>Perigeliy q = <b>${fmt(i.q,3)} AU</b>${i.Q?' · afeliy Q = <b>'+fmt(i.Q,2)+' AU</b>':''}<br>${o.P?'Davr: <b>'+fmt(o.P,o.P<10?3:1)+' yil</b><br>':''}Perigeliydagi tezlik ≈ <b>${fmt(i.vq,1)} km/s</b>${i.hyp?'<br>Cheksizlikdagi tezlik ≈ <b>'+fmt(i.vinf,1)+' km/s</b> — Quyosh tortishishi bilan bog‘lanmagan (yulduzlararo).':''}${o.d?'<br>Diametr: ≈ '+(o.d<1?fmt(o.d*1000,0)+' m':fmt(o.d,0)+' km'):''}<hr style="border:0;border-top:1px solid #254259">${esc(o.note)}<br><a href="${o.src}" target="_blank" rel="noopener">Manba ↗</a>`;}
  $('#smSel',body).onchange=e=>{cur=S.find(o=>o.id===e.target.value);info();draw();};$('#smScale',body).onchange=draw;
  KoinotLab.state.labTick=dt=>{ang=(ang+dt/14)%1;draw();};info();draw();
 }

 function voyagerLive(){const t=(Date.now()-Date.UTC(2026,10,15))/(365.25*86400e3),d=173.14+3.58*t;return {d,hrs:d*499.005/3600};}
 function missionsTab(body){
  const M=[...KOINOT_MISSIONS].sort((a,b)=>a.year-b.year);
  body.innerHTML=`<div class="lab-row"><label>Qidirish <input id="msQ" type="search" placeholder="Nom, nishon, agentlik…" style="width:220px"></label></div><div class="x-cards" id="msList"></div>
  <p class="lab-note">Sana va faktlar rasmiy agentlik e’lonlariga asoslangan; rejalashtirilgan missiyalarning holati tez o‘zgaradi — NASA/ESA/ISRO/CNSA saytlaridan tekshiring.</p>`;
  const render=()=>{const q=$('#msQ',body).value.trim().toLowerCase();$('#msList',body).innerHTML=M.filter(m=>!q||(m.name+m.target+m.agency+m.text).toLowerCase().includes(q)).map(m=>{let live='';if(m.live==='voyager1'){const v=voyagerLive();live=`<div class="x-live">Hozirgi masofa (chiziqli baho, ± ~1 AU): <b>≈ ${fmt(v.d,1)} AU</b> · signal Yerga ≈ <b>${fmt(v.hrs,1)} soat</b>da yetadi</div>`;}return `<article class="x-card"><small>${m.year} · ${esc(m.agency)}</small><h4>${esc(m.name)}</h4><div class="x-tag">${esc(m.target)}</div><p>${esc(m.text)}</p>${live}</article>`;}).join('')||'<p class="lab-note">Hech narsa topilmadi.</p>';};
  $('#msQ',body).oninput=render;render();
 }

 function uzTab(body){
  body.innerHTML=`<div class="x-cards">${KOINOT_UZ.map(u=>`<article class="x-card"><h4>${esc(u.t)}</h4><p>${esc(u.x)}</p></article>`).join('')}</div>
  <div class="lab-row"><button id="uzSky">Samarqanddan osmonni ko‘rish</button><button id="uzTash">Toshkentdan osmonni ko‘rish</button></div>
  <p class="lab-note">Tarixiy sanalar va raqamlar umumiy manbalarga asoslangan (Ulug‘bek rasadxonasi 1420-yillar, katalog ≈ 1437-yil); aniq yillar manbalarda 1–2 yil farq qilishi mumkin. Ilmiy xulosa uchun akademik nashrlarga murojaat qiling.</p>`;
  const go=i=>{KX.sky&&(KX.sky.city=i);KX.sky&&(KX.sky.date=new Date());KoinotLab.render('sky');};
  $('#uzSky',body).onclick=()=>go(1);$('#uzTash',body).onclick=()=>go(0);
 }

 function quizTab(body){
  const ALLQ=[...KOINOT_QUIZ.map(q=>Object.assign({k:'umum'},q)),...(window.KOINOT_QUIZ2||[])];
  const CATS=[['hammasi','Hammasi'],['umum','Umumiy'],['sys','Quyosh sistemasi'],['star','Yulduzlar va galaktikalar'],['obs','Kuzatish va teleskop'],['uz','O‘zbekiston va tarix'],['cos','Kosmonavtika va kosmologiya']];
  let cat='hammasi',cnt=10,order,i,score,locked,wrong;let best={};try{best=JSON.parse(localStorage.getItem('koinot-quiz-best2')||'{}')||{};}catch(e){}
  const saveBest=()=>{try{localStorage.setItem('koinot-quiz-best2',JSON.stringify(best));}catch(e){}};
  const pool=()=>cat==='hammasi'?ALLQ:ALLQ.filter(q=>q.k===cat);
  function menu(){const n=pool().length;
   body.innerHTML=`<p class="lab-note">Viktorina: ${ALLQ.length} ta savol, bo‘limlar bo‘yicha. Har gal savollar va javoblar tartibi aralashtiriladi.</p><div class="lab-row"><label>Bo‘lim <select id="qzC">${CATS.map(c=>`<option value="${c[0]}"${c[0]===cat?' selected':''}>${c[1]} (${c[0]==='hammasi'?ALLQ.length:ALLQ.filter(q=>q.k===c[0]).length})</option>`).join('')}</select></label><label>Savollar soni <select id="qzN">${[10,20,30].map(v=>`<option${v===cnt?' selected':''}>${v}</option>`).join('')}</select></label><button id="qzGo">Boshlash</button></div><div class="lab-note" id="qzBest"></div>`;
   const bt=()=>{const b=best[cat+'/'+cnt];$('#qzBest',body).textContent=b!=null?`Bu rejimdagi eng yaxshi natija: ${b} / ${Math.min(cnt,pool().length)}`:'Bu rejimda hali natija yo‘q.';};
   $('#qzC',body).onchange=e=>{cat=e.target.value;bt();};$('#qzN',body).onchange=e=>{cnt=+e.target.value;bt();};bt();$('#qzGo',body).onclick=start;}
  const start=()=>{order=[...pool()].sort(()=>Math.random()-.5).slice(0,cnt);i=0;score=0;locked=false;wrong=[];show();};
  function show(){
   if(i>=order.length){const key=cat+'/'+cnt;if(!(best[key]>=score)){best[key]=score;saveBest();}
    body.innerHTML=`<div class="lab-result"><b>Natija: ${score} / ${order.length}</b><br>Bu rejimdagi eng yaxshi natija: ${best[key]}<br>${score>=order.length*.9?'A’lo! Siz haqiqiy koinot bilimdonisiz.':score>=order.length*.6?'Yaxshi natija!':'Laboratoriya bo‘limlarini o‘rganib, qayta urinib ko‘ring.'}</div>`+(wrong.length?`<h4>Xato javoblar tahlili</h4><div class="x-cards">${wrong.map(q=>`<article class="x-card"><h4>${esc(q.s)}</h4><p><b>To‘g‘ri javob:</b> ${esc(q.o[q.a])}<br>${esc(q.e)}</p></article>`).join('')}</div>`:'')+`<div class="lab-row"><button id="qzAgain">Qayta (shu rejim)</button><button id="qzMenu">Rejimni o‘zgartirish</button></div>`;$('#qzAgain',body).onclick=start;$('#qzMenu',body).onclick=menu;return;}
   const q=order[i],idx=q.o.map((_,n)=>n).sort(()=>Math.random()-.5);
   body.innerHTML=`<div class="lab-note">Savol ${i+1} / ${order.length} · Ball: ${score}</div><h3 class="x-q">${esc(q.s)}</h3><div class="x-opts">${idx.map(n=>`<button data-n="${n}">${esc(q.o[n])}</button>`).join('')}</div><div class="lab-result" id="qzFb" hidden></div><button id="qzNext" hidden>Keyingisi →</button>`;
   body.querySelectorAll('.x-opts button').forEach(b=>b.onclick=()=>{if(locked)return;locked=true;const ok=+b.dataset.n===q.a;if(ok)score++;else wrong.push(q);body.querySelectorAll('.x-opts button').forEach(x=>{x.disabled=true;if(+x.dataset.n===q.a)x.classList.add('ok');});if(!ok)b.classList.add('bad');const fb=$('#qzFb',body);fb.hidden=false;fb.innerHTML=(ok?'<b>To‘g‘ri!</b> ':'<b>Noto‘g‘ri.</b> ')+esc(q.e);const nx=$('#qzNext',body);nx.hidden=false;nx.onclick=()=>{i++;locked=false;show();};});
  }
  menu();
 }
 KX.tab('small','Asteroid va kometalar',smallTab);KX.tab('missions','Missiyalar',missionsTab);KX.tab('uz','O‘zbekiston va koinot',uzTab);KX.tab('quiz','Viktorina',quizTab);
 KX.orbitInfo=orbitInfo;
})();
