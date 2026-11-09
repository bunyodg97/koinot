(()=>{'use strict';
 const app=window.koinot;if(!app)return;
 const $=s=>document.querySelector(s),LS={get(k,d){try{const v=localStorage.getItem(k);return v===null?d:v;}catch(e){return d;}},set(k,v){try{localStorage.setItem(k,v);}catch(e){}}};
 if(window.KX?.i18n?.D)Object.assign(KX.i18n.D,{
  'Asboblar va yozuvlar':['Инструменты и подписи','Tools & labels'],'Laboratoriya':['Лаборатория','Laboratory'],'Erkin parvoz':['Свободный полёт','Free flight'],'Qayerdaman?':['Где я?','Where am I?'],'Skrinshot':['Скриншот','Screenshot'],'Havola':['Ссылка','Link'],'Qora tuynuk':['Чёрная дыра','Black hole'],'Til':['Язык','Language'],
  'Masofa ko‘rsatkichi':['Индикатор расстояния','Distance readout'],'Yozuvlar':['Подписи','Text labels'],'Vizual effektlar':['Визуальные эффекты','Visual effects'],'Yoqilgan':['Вкл','On'],'O‘chirilgan':['Выкл','Off']});

 const panel=document.createElement('div');panel.id='xMenu';panel.hidden=true;panel.setAttribute('role','menu');
 const click=sel=>()=>{close();$(sel)?.click();};
 const items=[['🎬','Kino rejimi (musiqa + parvoz)',()=>{close();window.KX?.cinema?.start();}],['⏺','Kino rejimini videoga yozish',()=>{close();window.KX?.rec?.startCinema();}],['🌀','Galaktikalar atlasi',()=>{close();window.KX?.atlas?.open('gal');}],['🪐','Ekzosayyora tizimlari',()=>{close();window.KX?.atlas?.open('exo');}],['🔭','Teleskop kuzatuvchisi (reja, FOV, jurnal)',()=>{close();window.KX?.scope?.open('plan');}],['☀','Jonli: Quyosh, ISS, kometalar',()=>{close();KoinotLab.open('live');}],['🌐','Internetdan foydalanish (yoq/o‘ch)',()=>{close();window.KX?.net?.toggle();}],['⏰','Teleskop budilnigi',()=>{close();window.KX?.scope?.open('alarm');}],['🌠','Obyektning tun yo‘li',()=>{close();window.KX?.scope?.open('path');}],['📋','Messier ro‘yxati (ko‘rilganlar)',()=>{close();window.KX?.scope?.open('list');}],['📜','Ulug‘bek osmoni',()=>{close();KoinotLab.open('ulugbek');}],['⭐','Yulduz hayoti',()=>{close();KoinotLab.open('life');}],['🔴','Qizil tungi rejim',()=>{close();window.KX?.scope?.red?.toggle();}],['🌙','Bugun osmonda nima bor?',()=>{close();KoinotLab.open('tonight');}],['✦','Laboratoriya',click('#labOpen')],['↗','Erkin parvoz',click('#flightToggle')],['◎','Qayerdaman?',click('#atlasWhere')],['⚫','Qora tuynuk',()=>{close();KoinotLab.open('bh');}],['🔭','Ufqdan narida nima bor?',()=>{close();KoinotLab.open('beyond');}],['⚖','Haqiqiy ⇄ ko‘rgazmali masshtab',()=>{close();window.KX?.prov?.toggleReal?.();}],['🏷','Belgilar: o‘lchangan / hisoblangan / taxminiy',()=>{close();window.KX?.prov?.openLegend();}],['📚','Manbalar va litsenziyalar',()=>{close();KoinotLab.open('credits');}],['🌌','Osmon xaritasi (katta ekran)',()=>{close();KoinotLab.open('sky');setTimeout(()=>KX.skyFull&&KX.skyFull(true),60);}],['📷','Skrinshot',click('#shotBtn')],['🔗','Havola',click('#linkBtn')]];
 const sw=[['Tumanlik fon (Sayohat)',()=>window.KX?.fx?.neb!==false,v=>window.KX?.fx?.setNeb(v)],['Kino effektlari (bloom)',()=>window.KX?.fx?.on!==false,v=>window.KX?.fx?.set(v)],['Musiqa',()=>window.KX?.audio?.cfg.music!==false,v=>window.KX?.audio?.set('music',v)],['Ovoz (obyektlar)',()=>window.KX?.audio?.cfg.sfx!==false,v=>window.KX?.audio?.set('sfx',v)],['Masofa ko‘rsatkichi',()=>app.journey?.mw?.isShown()??true,v=>app.journey?.mw?.setShown(v)],['Yozuvlar',()=>document.body.dataset.texts!=='off',v=>{document.body.dataset.texts=v?'on':'off';LS.set('koinot-texts',v?'1':'0');}],['Vizual effektlar',()=>fx.on,v=>setFx(v)]];

 const GROUPS=[['🎬','Namoyish',['Kino rejimi (musiqa + parvoz)','Kino rejimini videoga yozish','Erkin parvoz','Qayerdaman?']],
  ['🌌','Koinotni o‘rganish',['Laboratoriya','Galaktikalar atlasi','Ekzosayyora tizimlari','Qora tuynuk','Ufqdan narida nima bor?','Yulduz hayoti','Ulug‘bek osmoni']],
  ['🔭','Kuzatuvchiga',['Teleskop kuzatuvchisi (reja, FOV, jurnal)','Obyektning tun yo‘li','Messier ro‘yxati (ko‘rilganlar)','Teleskop budilnigi','Bugun osmonda nima bor?','Osmon xaritasi (katta ekran)','Qizil tungi rejim']],
  ['📡','Jonli',['Jonli: Quyosh, ISS, kometalar','Internetdan foydalanish (yoq/o‘ch)']],
  ['⚙','Sozlash va ma’lumot',[]]];
 const gOf=lab=>{const k=GROUPS.findIndex(g=>g[2].includes(lab));return k<0?4:k;};
 const REC_KEY='koinot-menu-recent',recGet=()=>{try{const v=JSON.parse(LS.get(REC_KEY,'[]'));return Array.isArray(v)?v:[];}catch(e){return [];}};
 const recAdd=lab=>{const r=[lab,...recGet().filter(x=>x!==lab)].slice(0,4);LS.set(REC_KEY,JSON.stringify(r));};
 let openG=+LS.get('koinot-menu-open','0');if(!(openG>=0&&openG<5))openG=0;
 const itemBtn=i=>`<button data-i="${i}"><span>${items[i][0]}</span>${items[i][1]}</button>`;
 const swHTML=sw.map((x,i)=>`<button class="sw" data-s="${i}"><span class="dot"></span>${x[0]}<em></em></button>`).join('');
 function buildGroups(){const by=GROUPS.map(()=>[]);items.forEach((it,i)=>by[gOf(it[1])].push(i));
  return GROUPS.map((g,k)=>`<section class="xg${k===openG?' open':''}" data-g="${k}"><button class="xgh" data-gh="${k}" aria-expanded="${k===openG}"><span>${g[0]}</span>${g[1]}<em>${by[k].length}</em><i>›</i></button><div class="xgb">${by[k].map(itemBtn).join('')}${k===4?'<button id="xLang"><span>🌐</span>Til: <b></b></button><hr>'+swHTML:''}</div></section>`).join('');}
 function buildRecent(){const r=recGet().map(l=>items.findIndex(it=>it[1]===l)).filter(i=>i>=0);return r.length?`<small>OXIRGI ISHLATILGANLAR</small>${r.map(itemBtn).join('')}<hr>`:'';}
 panel.innerHTML='<small>ASBOBLAR VA YOZUVLAR</small><div class="xs"><input id="xSearch" type="search" placeholder="Menyudan qidirish…" autocomplete="off" aria-label="Menyudan qidirish"></div><div id="xRecent"></div><div id="xGroups">'+buildGroups()+'</div><div id="xFound" hidden></div>';
 document.body.append(panel);
 panel.addEventListener('click',e=>{const b=e.target.closest('button[data-i]');if(b){const it=items[+b.dataset.i];recAdd(it[1]);it[2](e);return;}
  const h=e.target.closest('[data-gh]');if(h){const k=+h.dataset.gh;openG=openG===k?-1:k;LS.set('koinot-menu-open',String(openG));panel.querySelectorAll('.xg').forEach(g=>{const on=+g.dataset.g===openG;g.classList.toggle('open',on);g.querySelector('.xgh').setAttribute('aria-expanded',on);});}});
 const srch=$('#xSearch'),found=$('#xFound'),groups=$('#xGroups'),recent=$('#xRecent');
 const norm=t=>t.toLowerCase().replace(/[‘’ʻ`']/g,'');
 srch.oninput=()=>{const q=norm(srch.value.trim());if(!q){found.hidden=true;groups.hidden=false;recent.hidden=false;return;}
  const r=items.map((it,i)=>[it,i]).filter(([it])=>norm(it[1]).includes(q));groups.hidden=true;recent.hidden=true;found.hidden=false;
  found.innerHTML=r.length?r.map(([it,i])=>itemBtn(i)).join(''):'<small>Hech narsa topilmadi</small>';};
 srch.onkeydown=e=>{if(e.key==='Enter'){const b=found.querySelector('button[data-i]');if(b){e.preventDefault();b.click();}}};
 const langBtn=$('#xLang');const syncLang=()=>{langBtn.querySelector('b').textContent=(window.KX?.i18n?.lang||'uz').toUpperCase();};
 langBtn.onclick=()=>{const order=['uz','ru','en'],cur=KX.i18n.lang,next=order[(order.indexOf(cur)+1)%3];KX.i18n.setLang(next);syncLang();};
 function syncSw(){panel.querySelectorAll('.sw').forEach(b=>{const s=sw[+b.dataset.s],on=s[1]();b.classList.toggle('on',on);b.querySelector('em').textContent=on?'Yoqilgan':'O‘chirilgan';});}
 panel.querySelectorAll('.sw').forEach(b=>b.onclick=e=>{e.stopPropagation();const s=sw[+b.dataset.s];s[2](!s[1]());syncSw();});
 function open(){panel.hidden=false;recent.innerHTML=buildRecent();srch.value='';srch.oninput();syncLang();syncSw();if(window.matchMedia&&matchMedia('(pointer:fine)').matches)setTimeout(()=>srch.focus(),30);btn.setAttribute('aria-expanded','true');float_.setAttribute('aria-expanded','true');}
 function close(){panel.hidden=true;btn.setAttribute('aria-expanded','false');float_.setAttribute('aria-expanded','false');}
 const toggle=e=>{e.stopPropagation();panel.hidden?open():close();};
 document.addEventListener('click',e=>{if(!panel.hidden&&!panel.contains(e.target))close();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)close();});

 const icon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>';
 const btn=document.createElement('button');btn.id='xMenuBtn';btn.title='Asboblar va yozuvlar';btn.setAttribute('aria-label','Asboblar va yozuvlar');btn.setAttribute('aria-haspopup','true');btn.setAttribute('aria-expanded','false');btn.innerHTML=icon;btn.onclick=toggle;
 const cat=$('#catalogOpen');cat?.after(btn);
 const float_=document.createElement('button');float_.id='xMenuFloat';float_.setAttribute('aria-label','Asboblar va yozuvlar');float_.setAttribute('aria-expanded','false');float_.innerHTML=icon+'<span>Menyu</span>';float_.onclick=toggle;app.host.append(float_);

 document.body.dataset.texts=LS.get('koinot-texts','1')==='0'?'off':'on';

 const fx={on:LS.get('koinot-fx','1')!=='0'};
 const cv=document.createElement('canvas');cv.id='fxCanvas';cv.setAttribute('aria-hidden','true');app.host.append(cv);const g2=cv.getContext('2d');
 let W=0,H=0;function size(){const d=Math.min(2,devicePixelRatio||1);W=app.host.clientWidth;H=app.host.clientHeight;cv.width=W*d;cv.height=H*d;g2.setTransform(d,0,0,d,0,0);}
 new ResizeObserver(size).observe(app.host);size();
 function setFx(v){fx.on=v;LS.set('koinot-fx',v?'1':'0');document.body.classList.toggle('fx-off',!v);if(!v)g2.clearRect(0,0,W,H);}
 document.body.classList.toggle('fx-off',!fx.on);
 const meteors=[];let nextMeteor=2+Math.random()*4,lastQ=null,warp=0;const sunV=new THREE.Vector3();
 const prev=app.afterFrame;
 app.afterFrame=(dt,...rest)=>{prev?.(dt,...rest);if(!fx.on||document.hidden||app.quality==='low'){if(fx._drawn){g2.clearRect(0,0,W,H);fx._drawn=false;}return;}
  fx._drawn=true;g2.clearRect(0,0,W,H);const j=app.journey,jActive=j?.active&&!j.detail?.active;

  nextMeteor-=dt;if(nextMeteor<=0){nextMeteor=jActive?5+Math.random()*7:3+Math.random()*6;const a=.35+Math.random()*.5,sp=480+Math.random()*420;meteors.push({x:Math.random()*W*.9+W*.1,y:Math.random()*H*.45,vx:-Math.cos(a)*sp,vy:Math.sin(a)*sp,life:0,max:.55+Math.random()*.4});}
  for(let i=meteors.length-1;i>=0;i--){const m=meteors[i];m.life+=dt;m.x+=m.vx*dt;m.y+=m.vy*dt;const k=1-m.life/m.max;if(k<=0){meteors.splice(i,1);continue;}const L=70+60*k,nx=m.vx/Math.hypot(m.vx,m.vy),ny=m.vy/Math.hypot(m.vx,m.vy);const gr=g2.createLinearGradient(m.x,m.y,m.x-nx*L,m.y-ny*L);gr.addColorStop(0,`rgba(255,255,255,${.85*k})`);gr.addColorStop(1,'rgba(120,190,255,0)');g2.strokeStyle=gr;g2.lineWidth=1.6;g2.beginPath();g2.moveTo(m.x,m.y);g2.lineTo(m.x-nx*L,m.y-ny*L);g2.stroke();}

  if(jActive){if(lastQ!==null){const v=Math.abs(j.q-lastQ)/Math.max(dt,.001);warp+=(Math.min(1,v*1.3)-warp)*Math.min(1,dt*10);}lastQ=j.q;}else{lastQ=null;warp*=.9;}
  if(warp>.03){const cx=W/2,cy=H/2,n=70,dir=1;g2.lineCap='round';for(let i=0;i<n;i++){const a=(i*2.399963+i*.013)%(Math.PI*2),r0=Math.min(W,H)*(.12+.5*((i*7919)%97)/97),len=(30+160*warp)*(.4+((i*104729)%89)/89);const x0=cx+Math.cos(a)*r0,y0=cy+Math.sin(a)*r0;g2.strokeStyle=`rgba(170,215,255,${.32*warp})`;g2.lineWidth=1;g2.beginPath();g2.moveTo(x0,y0);g2.lineTo(x0+Math.cos(a)*len,y0+Math.sin(a)*len);g2.stroke();}}

  if(!jActive&&!app.freeFlight){const sun=app.bodies.get('sun');if(sun){sun.group.getWorldPosition(sunV);const cam=app.camera,toS=sunV.clone().sub(cam.position),fwd=new THREE.Vector3();cam.getWorldDirection(fwd);if(toS.dot(fwd)>0){const p=sunV.clone().project(cam);if(Math.abs(p.x)<1.1&&Math.abs(p.y)<1.1){const x=(p.x+1)/2*W,y=(1-p.y)/2*H,s=Math.min(W,H)*.2;g2.globalCompositeOperation='lighter';const gr=g2.createRadialGradient(x,y,0,x,y,s);gr.addColorStop(0,'rgba(255,225,160,.35)');gr.addColorStop(.25,'rgba(255,170,70,.12)');gr.addColorStop(1,'rgba(255,140,40,0)');g2.fillStyle=gr;g2.fillRect(x-s,y-s,s*2,s*2);g2.fillStyle='rgba(255,205,130,.16)';g2.fillRect(x-s*2.2,y-1,s*4.4,2);const ox=W/2-x,oy=H/2-y;for(const [t,r,c] of [[.35,s*.12,'rgba(120,180,255,.10)'],[.7,s*.2,'rgba(255,190,120,.08)'],[1.1,s*.08,'rgba(150,255,200,.08)']]){g2.fillStyle=c;g2.beginPath();g2.arc(x+ox*t,y+oy*t,r,0,7);g2.fill();}g2.globalCompositeOperation='source-over';}}}}
 };
 KX.ui={setFx,fx,open,close};
})();
