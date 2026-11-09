(()=>{'use strict';
 const KX=window.KX,A=window.Astronomy,SD=window.KOINOT_SKY;if(!KX?.tab||!A||!SD)return;
 const {$,esc,fmt,pad,OFFSET,hm,ymd,stamp,longDate,inputValue,parseInput}=KX,RAD=Math.PI/180;
 const LS={get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v);}catch(e){return d;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}};
 const toast=s=>{const t=document.getElementById('toast');if(!t)return;t.textContent=s;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2600);};

 const DEF={D:200,F:1200,bortle:5,city:0,seeing:3,eps:[{n:'25 mm Plössl',f:25,a:52},{n:'10 mm Plössl',f:10,a:52}],finder:{n:'Izlagich 6×30',fov:5},img:'sky'};
 const prof=Object.assign({},DEF,LS.get('koinot-scope',{}));if(!Array.isArray(prof.eps)||!prof.eps.length)prof.eps=DEF.eps;
 const saveProf=()=>LS.set('koinot-scope',prof);
 const mag=ep=>prof.F/ep.f,tfov=ep=>ep.a/mag(ep),exitP=ep=>prof.D/mag(ep);
 const NELM=[0,7.6,7.1,6.6,6.2,5.6,5.1,4.6,4.3,4.0];
 const mlim=()=>NELM[prof.bortle]+5*Math.log10(prof.D/7);

 const DSO_UZ={G:'Galaktika',GCl:'Sharsimon to‘da',OCl:'Sochma to‘da',PN:'Planetar tumanlik',Neb:'Tumanlik',HII:'HII tumanligi',SNR:'Supernova qoldig‘i','Cl+N':'To‘da + tumanlik',RfN:'Aks ettiruvchi tumanlik',DrkN:'Qora tumanlik',EmN:'Emission tumanlik',Nova:'Yangi yulduz',Other:'Boshqa','*Ass':'Yulduzlar guruhi','**':'Qo‘shaloq yulduz','*':'Yulduz'};
 const DSO=SD.dso.map(d=>({kind:'dso',key:d[0]||d[1],m:d[0],label:d[1],type:d[2],ra:d[3],dec:d[4],mag:d[5],size:d[6]||1,con:d[7],common:d[8]||''}));
 const STARS=(window.KOINOT_BRIGHT||[]).map(s=>({kind:'star',key:s[0],m:'',label:s[0],type:'*',ra:s[1]*15,dec:s[2],mag:s[3],size:0,con:'',common:''}));
 const ALL=[...DSO,...STARS],BYKEY=new Map(ALL.map(o=>[o.key,o]));
 const nm=o=>o.kind==='star'?o.label:(o.m?o.m+(o.label&&o.label!==o.m?' ('+o.label+')':''):o.label)+(o.common?' · '+o.common:'');
 const typeUz=o=>o.kind==='star'?'Yorqin yulduz':(DSO_UZ[o.type]||o.type);
 const COMP=['Shimol','Shimoli-sharq','Sharq','Janubi-sharq','Janub','Janubi-g‘arb','G‘arb','Shimoli-g‘arb'];
 const compass=az=>COMP[Math.round(((az%360)+360)%360/45)%8];
 const angDist=(r1,d1,r2,d2)=>{const a=d1*RAD,b=d2*RAD,c=Math.sin(a)*Math.sin(b)+Math.cos(a)*Math.cos(b)*Math.cos((r1-r2)*RAD);return Math.acos(Math.max(-1,Math.min(1,c)))/RAD;};
 const city=()=>KX.CITIES?KX.CITIES[prof.city]||KX.CITIES[0]:['Toshkent',41.2995,69.2401,455];
 const observer=()=>{const c=city();return new A.Observer(c[1],c[2],c[3]);};

 function bestEp(o){const sd=o.size/60,eps=prof.eps.filter(e=>exitP(e)>=.45);if(!eps.length)return null;eps.sort((a,b)=>mag(b)-mag(a));
  if(o.kind==='star'||o.size<3)return {ep:eps[0],fit:true};
  const f=eps.find(e=>tfov(e)>=sd*1.25);return f?{ep:f,fit:true}:{ep:eps[eps.length-1],fit:false};}

 const subs=[];let cur='plan',box=null,sel=null;
 const SC=KX.scope={prof,mag,tfov,exitP,mlim,ALL,BYKEY,nm,typeUz,compass,angDist,observer,city,LS,toast,bestEp,saveProf,
  addSub(id,name,fn){subs.push([id,name,fn]);},go(id,key){if(key)sel=key;cur=id;if(box)draw();},get sel(){return sel;},set sel(k){sel=k;},radians:RAD};
 const SUBORDER=['plan','fov','hop','planets','photo','path','list','alarm','log','gear'];
 function draw(){
  const list=subs.slice().sort((a,b)=>SUBORDER.indexOf(a[0])-SUBORDER.indexOf(b[0]));if(!list.some(s=>s[0]===cur))cur=list[0][0];
  box.innerHTML=`<div class="ob-nav">${list.map(s=>`<button data-s="${s[0]}"${s[0]===cur?' class="on"':''}>${s[1]}</button>`).join('')}</div><div class="ob-body"></div>`;
  box.querySelector('.ob-nav').onclick=e=>{const b=e.target.closest('button');if(b){cur=b.dataset.s;draw();}};
  const f=list.find(s=>s[0]===cur)[2];f(box.querySelector('.ob-body'));
 }
 KX.tab('scope','Teleskop',body=>{box=body;draw();});

 const svg=document.createElement('div');svg.id='redSvg';svg.innerHTML='<svg width="0" height="0" style="position:absolute"><defs><filter id="redF" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.45 0.45 0.1 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/></filter></defs></svg>';document.body.append(svg);
 const red={on:!!LS.get('koinot-red',false),dim:+LS.get('koinot-dim',1)};
 function applyRed(){document.documentElement.classList.toggle('red-night',red.on);document.documentElement.style.setProperty('--nb',red.dim);}
 red.set=v=>{red.on=!!v;LS.set('koinot-red',red.on);applyRed();};red.toggle=()=>{red.set(!red.on);toast(red.on?'Qizil tungi rejim yoqildi':'Qizil tungi rejim o‘chirildi');};
 red.setDim=v=>{red.dim=Math.max(.15,Math.min(1,+v));LS.set('koinot-dim',red.dim);applyRed();};
 SC.red=red;applyRed();

 function picker(host,onPick,init){
  host.innerHTML=`<input class="ob-in" type="search" placeholder="Obyekt: M31, Orion, NGC 7000, Vega …" autocomplete="off"><div class="ob-sug"></div>`;const inp=host.querySelector('input'),sg=host.querySelector('.ob-sug');
  if(init&&BYKEY.get(init))inp.value=nm(BYKEY.get(init));
  const upd=()=>{const q=inp.value.trim().toLowerCase();if(q.length<1){sg.innerHTML='';return;}
   const r=[];for(const o of ALL){const s=(o.key+' '+o.label+' '+o.common+' '+o.m).toLowerCase();if(s.includes(q)){r.push(o);if(r.length>=8)break;}}
   sg.innerHTML=r.map(o=>`<button data-k="${esc(o.key)}">${esc(nm(o))}<small>${esc(typeUz(o))}${o.mag!=null?' · '+fmt(o.mag,1)+'ᵐ':''}</small></button>`).join('');};
  inp.oninput=upd;sg.onclick=e=>{const b=e.target.closest('button');if(!b)return;const o=BYKEY.get(b.dataset.k);inp.value=nm(o);sg.innerHTML='';onPick(o);};
 }
 SC.picker=picker;

 const plan={date:null,minAlt:30,type:'',onlyM:false,hard:false,res:null};
 const dayKey=d=>ymd(d);const localNoon=ds=>{const [y,m,d]=ds.split('-').map(Number);return new Date(Date.UTC(y,m-1,d,12-OFFSET,0));};
 function computePlan(){
  const obs=observer(),noon=localNoon(plan.date),t0=new A.AstroTime(noon);
  let dusk=A.SearchAltitude('Sun',obs,-1,t0,1,-12),dawn=dusk?A.SearchAltitude('Sun',obs,+1,dusk,1,-12):null;
  const res={obs,dusk:dusk?.date,dawn:dawn?.date,rows:[],moon:null};
  if(!dusk||!dawn){res.err='Bu sanada Quyosh −12° dan pastga tushmaydi (oq tunlar) — to‘liq qorong‘i tun yo‘q.';return res;}
  const samples=[];for(let t=dusk.date.getTime();t<=dawn.date.getTime();t+=30*60000)samples.push(new Date(t));
  const mid=new Date((dusk.date.getTime()+dawn.date.getTime())/2);res.mid=mid;res.moonFrac=A.Illumination('Moon',new A.AstroTime(mid)).phase_fraction;
  const moonAt=samples.map(d=>{const tt=new A.AstroTime(d),q=A.Equator('Moon',tt,obs,true,true),h=A.Horizon(tt,obs,q.ra,q.dec,'normal');return {ra:q.ra*15,dec:q.dec,alt:h.altitude,fr:A.Illumination('Moon',tt).phase_fraction};});
  res.moonUp=moonAt.filter(m=>m.alt>5).length/samples.length;
  const ml=mlim();
  for(const o of DSO){
   if(plan.onlyM&&!o.m)continue;if(plan.type&&!(plan.type==='nb'?['Neb','HII','PN','SNR','EmN','RfN','Cl+N'].includes(o.type):plan.type==='cl'?['OCl','GCl','Cl+N'].includes(o.type):o.type===plan.type))continue;
   let best=-90,bi=0;for(let i=0;i<samples.length;i++){const h=A.Horizon(new A.AstroTime(samples[i]),obs,o.ra/15,o.dec,'normal');if(h.altitude>best){best=h.altitude;bi=i;var baz=h.azimuth;}}
   if(best<plan.minAlt)continue;
   const m=moonAt[bi],sep=angDist(o.ra,o.dec,m.ra,m.dec),pen=m.alt>5&&m.fr>.25?m.fr*2.4*Math.max(0,1-sep/70):0;
   const unk=o.mag==null,mg=unk?9.5:o.mag,sb=mg+2.5*Math.log10(.785*Math.pow(Math.max(.2,o.size)*60,2));const margin=ml-pen-mg;
   let lvl=unk?1:margin>=2.5&&sb<=22.5?0:margin>=1&&sb<=23.5?1:margin>=0?2:3;
   if(lvl===3&&!plan.hard)continue;if(lvl===2&&!plan.hard&&sb>24)continue;
   res.rows.push({o,alt:best,t:samples[bi],az:baz,sb,pen,sep,lvl,margin,unk});
  }
  res.rows.sort((a,b)=>a.lvl-b.lvl||(a.unk-b.unk)||((a.o.mag??99)-(b.o.mag??99)));return res;
 }
 SC.addSub('plan','Reja',body=>{
  if(!plan.date)plan.date=dayKey(new Date());
  const cities=KX.CITIES||[city()];
  body.innerHTML=`<p class="lab-note">Bu kechada teleskopingiz bilan ko‘rsa bo‘ladigan obyektlar: tun (Quyosh −12° dan pastda) davomida eng baland nuqtasi va yorqinligiga qarab saralangan. «Asbob» bo‘limida teleskopingizni kiriting.</p>
  <div class="lab-row ob-row"><label>Shahar <select id="obCity">${cities.map((c,i)=>`<option value="${i}"${i===prof.city?' selected':''}>${esc(c[0])}</option>`).join('')}</select></label><label>Sana <input type="date" id="obDate" value="${plan.date}"></label><button id="obPrev">‹</button><button id="obNext">›</button><button id="obToday">Bugun</button>
  <label>Min. balandlik <select id="obAlt">${[20,30,40,50].map(v=>`<option${v===plan.minAlt?' selected':''}>${v}</option>`).join('')}</select>°</label>
  <label>Tur <select id="obType"><option value="">Hammasi</option><option value="G">Galaktikalar</option><option value="cl">Yulduz to‘dalari</option><option value="nb">Tumanliklar</option><option value="PN">Planetar tumanliklar</option></select></label>
  <label><input type="checkbox" id="obM"${plan.onlyM?' checked':''}> faqat Messier</label><label><input type="checkbox" id="obHard"${plan.hard?' checked':''}> qiyinlarini ham</label></div><div id="obOut"><p class="lab-note">Hisoblanmoqda…</p></div>`;
  $('#obType',body).value=plan.type;
  const run=()=>{const out=$('#obOut',body);out.innerHTML='<p class="lab-note">Hisoblanmoqda…</p>';setTimeout(()=>{try{plan.res=computePlan();}catch(e){out.innerHTML='<p class="lab-note">Xato: '+esc(e.message)+'</p>';return;}show(out);const r=plan.res;if(r&&!r.err&&window.KX.net){const c=city(),host=$('#obWx',body);window.KX.net.weatherBlock(c[1],c[2],r.dusk,r.dawn).then(h=>{if(host&&host.isConnected&&plan.res===r)host.innerHTML=h;});}},30);};
  const step=n=>{const [y,m,d]=plan.date.split('-').map(Number);plan.date=ymd(new Date(Date.UTC(y,m-1,d+n,12-OFFSET)));$('#obDate',body).value=plan.date;run();};
  $('#obCity',body).onchange=e=>{prof.city=+e.target.value;saveProf();run();};$('#obDate',body).onchange=e=>{if(e.target.value){plan.date=e.target.value;run();}};
  $('#obPrev',body).onclick=()=>step(-1);$('#obNext',body).onclick=()=>step(1);$('#obToday',body).onclick=()=>{plan.date=dayKey(new Date());$('#obDate',body).value=plan.date;run();};
  $('#obAlt',body).onchange=e=>{plan.minAlt=+e.target.value;run();};$('#obType',body).onchange=e=>{plan.type=e.target.value;run();};$('#obM',body).onchange=e=>{plan.onlyM=e.target.checked;run();};$('#obHard',body).onchange=e=>{plan.hard=e.target.checked;run();};
  const LV=['oson','o‘rtacha','qiyin','juda qiyin'];
  function show(out){const r=plan.res;if(r.err){out.innerHTML=`<p class="lab-note">${esc(r.err)}</p>`;return;}
   const rows=r.rows.slice(0,80),done=new Set(LS.get('koinot-log',[]).map(e=>e.key));
   out.innerHTML=`<div id="obWx"></div><div class="ob-sum"><b>${esc(city()[0])} · ${plan.date}</b><div>Qorong‘i tun: <b>${hm(r.dusk)}</b> – <b>${hm(r.dawn)}</b> (Quyosh −12°) · Oy: <b>${fmt(r.moonFrac*100,0)}%</b> yoritilgan${r.moonUp>.15?', tunning ≈ '+fmt(r.moonUp*100,0)+'% qismida ufqdan yuqorida — xira obyektlarga xalaqit beradi':', tunda deyarli ko‘rinmaydi'}</div><div>Teleskop: ${prof.D} mm, f=${prof.F} mm · yorqinlik chegarasi ≈ <b>${fmt(mlim(),1)}ᵐ</b> (osmon: Bortle ${prof.bortle}) · ${r.rows.length} ta obyekt topildi${r.rows.length>80?' (eng yaxshi 80 tasi)':''}</div></div>
   <div class="ob-tw"><table class="ob-t"><thead><tr><th>Obyekt</th><th>Tur</th><th>Yorqinlik</th><th>O‘lcham</th><th>Eng baland</th><th>Qiyinlik</th><th>Okulyar</th><th></th></tr></thead><tbody>${rows.map(x=>{const be=bestEp(x.o);return `<tr${done.has(x.o.key)?' class="ob-done"':''}><td><b>${esc(nm(x.o))}</b><small>${esc(x.o.con)}</small></td><td>${esc(typeUz(x.o))}</td><td>${x.unk?'<small>noma’lum</small>':fmt(x.o.mag,1)+'ᵐ'}</td><td>${x.o.size>=1?fmt(x.o.size,x.o.size<10?1:0)+'′':'<1′'}</td><td>${hm(x.t)} · ${fmt(x.alt,0)}° · ${compass(x.az)}</td><td><span class="ob-lv l${x.lvl}">${LV[x.lvl]}</span>${x.pen>.4?'<small>Oy xalaqit beradi</small>':''}</td><td>${be?esc(be.ep.n)+'<small>'+fmt(mag(be.ep),0)+'× · '+fmt(tfov(be.ep),2)+'°'+(be.fit?'':' · sig‘maydi')+'</small>':'—'}</td><td class="ob-act"><button data-a="fov" data-k="${esc(x.o.key)}" title="Ko‘rish maydoni">◎</button><button data-a="hop" data-k="${esc(x.o.key)}" title="Yo‘l (star-hop)">➜</button><button data-a="log" data-k="${esc(x.o.key)}" title="Jurnalga: ko‘rdim">✓</button></td></tr>`;}).join('')}</tbody></table></div>
   <p class="lab-note">Qiyinlik — taxminiy: obyektning yorqinligi va sirt yorqinligi, teleskop teshigi, osmon (Bortle) va Oyning xalaqitiga qarab baholanadi. Bulut, shaffoflik, ufqdagi to‘siqlar va shahar yoritilishining aniq darajasi hisobga olinmaydi. Obyekt ro‘yxati OpenNGC (≤10,2ᵐ) bilan cheklangan.</p>`;}
  body.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;if(b.dataset.a==='log'){addLog(b.dataset.k);if(plan.res&&!plan.res.err)show($('#obOut',body));}else SC.go(b.dataset.a==='hop'?'hop':'fov',b.dataset.k);};
  run();
 });

 const logs=()=>LS.get('koinot-log',[]);
 function addLog(key,extra){const o=BYKEY.get(key);if(!o)return;const L=logs();L.unshift(Object.assign({id:Date.now()+Math.random().toString(36).slice(2,6),t:new Date().toISOString(),key,name:nm(o),m:o.m||'',scope:prof.D+'/'+prof.F,ep:'',see:0,tr:0,note:'',city:city()[0]},extra||{}));LS.set('koinot-log',L);toast('Jurnalga qo‘shildi: '+nm(o));}
 SC.addLog=addLog;
 SC.addSub('log','Jurnal',body=>{
  const L=logs(),mset=new Set(L.filter(e=>e.m).map(e=>e.m)),nM=DSO.filter(o=>/^M\d+$/.test(o.m)).length||110;
  body.innerHTML=`<p class="lab-note">Brauzerda saqlanadi (internet kerak emas). <b>Muhim:</b> brauzer ma'lumotlarini tozalasangiz jurnal yo‘qoladi — vaqti-vaqti bilan «Zaxira» tugmasi bilan fayl qilib saqlang.</p>
  <div class="ob-sum"><b>Messier ro‘yxati: ${mset.size} / ${nM}</b><div class="ob-bar"><i style="width:${Math.min(100,mset.size/nM*100)}%"></i></div><div>Jami yozuv: ${L.length}</div></div>
  <div class="ob-form"><div id="lgPick"></div><label>Okulyar <select id="lgEp"><option value="">—</option>${prof.eps.map(e=>`<option>${esc(e.n)}</option>`).join('')}</select></label><label>Seeing (1–5) <select id="lgSee">${[0,1,2,3,4,5].map(v=>`<option>${v||'—'}</option>`).join('')}</select></label><label>Shaffoflik (1–5) <select id="lgTr">${[0,1,2,3,4,5].map(v=>`<option>${v||'—'}</option>`).join('')}</select></label><input id="lgNote" class="ob-in" placeholder="Izoh: nimani ko‘rdingiz?"><button id="lgAdd" class="ob-go">+ Qo‘shish</button></div>
  <div class="lab-row"><button id="lgCsv">CSV</button><button id="lgBak">Zaxira (JSON)</button><label class="ob-file">Tiklash <input type="file" id="lgRes" accept=".json,application/json"></label></div>
  <div class="ob-tw"><table class="ob-t"><thead><tr><th>Sana</th><th>Obyekt</th><th>Asbob</th><th>Seeing / shaff.</th><th>Izoh</th><th></th></tr></thead><tbody>${L.map(e=>`<tr><td>${stamp(new Date(e.t))}</td><td><b>${esc(e.name)}</b></td><td>${esc(e.scope)}${e.ep?'<small>'+esc(e.ep)+'</small>':''}</td><td>${e.see||'—'} / ${e.tr||'—'}</td><td>${esc(e.note)}</td><td><button data-del="${e.id}" title="O‘chirish">✕</button></td></tr>`).join('')||'<tr><td colspan="6">Hali yozuv yo‘q.</td></tr>'}</tbody></table></div>`;
  let pk=sel;picker($('#lgPick',body),o=>{pk=o.key;},sel);
  $('#lgAdd',body).onclick=()=>{if(!pk){toast('Avval obyektni tanlang');return;}const g=id=>$(id,body).value;addLog(pk,{ep:g('#lgEp'),see:+g('#lgSee')||0,tr:+g('#lgTr')||0,note:g('#lgNote')});SC.go('log');};
  body.onclick=e=>{const d=e.target.closest('[data-del]');if(d){LS.set('koinot-log',logs().filter(x=>x.id!==d.dataset.del));SC.go('log');}};
  const dl=(name,txt,type)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type}));a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),20000);};
  $('#lgCsv',body).onclick=()=>{const q=s=>'"'+String(s??'').replace(/"/g,'""')+'"';dl('koinot-jurnal.csv','﻿Sana,Obyekt,Asbob,Okulyar,Seeing,Shaffoflik,Shahar,Izoh\n'+logs().map(e=>[stamp(new Date(e.t)),e.name,e.scope,e.ep,e.see,e.tr,e.city,e.note].map(q).join(',')).join('\n'),'text/csv');};
  $('#lgBak',body).onclick=()=>dl('koinot-jurnal-zaxira.json',JSON.stringify({v:1,log:logs(),profile:prof},null,1),'application/json');
  $('#lgRes',body).onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const j=JSON.parse(r.result);if(!Array.isArray(j.log))throw 0;const have=new Set(logs().map(x=>x.id)),add=j.log.filter(x=>x&&x.id&&x.key&&!have.has(x.id));LS.set('koinot-log',[...logs(),...add].sort((a,b)=>b.t.localeCompare(a.t)));toast(add.length+' ta yozuv tiklandi');SC.go('log');}catch(x){toast('Fayl noto‘g‘ri');}};r.readAsText(f);};
 });

 SC.addSub('gear','Asbob',body=>{
  const row=(e,i)=>`<tr><td><input data-i="${i}" data-f="n" value="${esc(e.n)}"></td><td><input type="number" data-i="${i}" data-f="f" value="${e.f}" min="1" step="0.1"> mm</td><td><input type="number" data-i="${i}" data-f="a" value="${e.a}" min="20" max="120"> °</td><td>${fmt(mag(e),0)}×</td><td>${fmt(tfov(e),2)}°</td><td>${fmt(exitP(e),1)} mm</td><td><button data-rm="${i}">✕</button></td></tr>`;
  body.innerHTML=`<p class="lab-note">Teleskop va okulyarlaringizni kiriting — Reja, Ko‘rish maydoni, Yo‘l va Astrofoto bo‘limlari shundan foydalanadi. Qiymatlar shu brauzerda saqlanadi.</p>
  <div class="lab-row ob-row"><label>Teshik (mm) <input type="number" id="gD" value="${prof.D}" min="20" max="2000" style="width:90px"></label><label>Fokus (mm) <input type="number" id="gF" value="${prof.F}" min="50" max="20000" style="width:90px"></label><label>Osmon (Bortle) <select id="gB">${[1,2,3,4,5,6,7,8,9].map(v=>`<option${v===prof.bortle?' selected':''}>${v}</option>`).join('')}</select></label><label>Tasvir <select id="gImg"><option value="sky">Osmondagidek (shimol tepada, sharq chapda)</option><option value="inv">Teskari (Nyuton / Dobson)</option><option value="mir">Ko‘zgu (refraktor + diagonal)</option></select></label></div>
  <div class="ob-sum"><div>Yorug‘lik kuchi: <b>${fmt(Math.pow(prof.D/7,2),0)}×</b> (ko‘zga nisbatan) · fokus nisbati <b>f/${fmt(prof.F/prof.D,1)}</b> · yorqinlik chegarasi ≈ <b>${fmt(mlim(),1)}ᵐ</b> · ajratish (Dawes) ≈ <b>${fmt(116/prof.D,2)}″</b> · foydali maks. kattalashtirish ≈ <b>${fmt(prof.D*2,0)}×</b></div><small>Bular umumiy qoidalar bo‘yicha TAXMINIY hisob (yorqinlik: NELM + 5·lg(D/7); real natija ko‘zingiz va osmonga bog‘liq).</small></div>
  <h4>Okulyarlar</h4><div class="ob-tw"><table class="ob-t"><thead><tr><th>Nomi</th><th>Fokus</th><th>Ko‘rinish burchagi</th><th>Kattalashtirish</th><th>Maydon</th><th>Chiqish ko‘zi</th><th></th></tr></thead><tbody>${prof.eps.map(row).join('')}</tbody></table></div>
  <div class="lab-row"><button id="gAdd">+ Okulyar</button><button id="gBar">+ Barlow ×2 (barcha okulyarga)</button></div>
  <h4>Izlagich</h4><div class="lab-row ob-row"><label>Nomi <input id="gFn" value="${esc(prof.finder.n)}"></label><label>Maydon (°) <input type="number" id="gFf" value="${prof.finder.fov}" step="0.1" min="0.5" max="15" style="width:70px"></label></div>
  <h4>Qizil tungi rejim</h4><div class="lab-row ob-row"><button id="gRed">${red.on?'O‘chirish':'Yoqish'}</button><label>Yorqinlik <input type="range" id="gDim" min="0.15" max="1" step="0.05" value="${red.dim}"></label></div><p class="lab-note">Butun interfeys qizil rangga o‘tadi — ko‘zingiz qorong‘ilikka moslashgan holda qoladi. Menyudan ham yoqish mumkin. Telefon ekrani «qizil»ni to‘liq tozalay olmasligi mumkin.</p>`;
  $('#gImg',body).value=prof.img;
  const num=(id,k,min)=>$(id,body).onchange=e=>{const v=+e.target.value;if(v>=min){prof[k]=v;saveProf();SC.go('gear');}};
  num('#gD','D',20);num('#gF','F',50);$('#gB',body).onchange=e=>{prof.bortle=+e.target.value;saveProf();SC.go('gear');};$('#gImg',body).onchange=e=>{prof.img=e.target.value;saveProf();};
  body.oninput=e=>{const t=e.target;if(t.dataset.i!=null){const ep=prof.eps[+t.dataset.i];ep[t.dataset.f]=t.dataset.f==='n'?t.value:Math.max(1,+t.value||1);saveProf();}};
  body.onchange=e=>{if(e.target.dataset.i!=null)SC.go('gear');};
  body.onclick=e=>{const r=e.target.closest('[data-rm]');if(r){if(prof.eps.length>1){prof.eps.splice(+r.dataset.rm,1);saveProf();SC.go('gear');}return;}};
  $('#gAdd',body).onclick=()=>{prof.eps.push({n:'Yangi okulyar',f:15,a:52});saveProf();SC.go('gear');};
  $('#gBar',body).onclick=()=>{const add=prof.eps.filter(e=>!/Barlow/.test(e.n)).map(e=>({n:e.n+' + Barlow ×2',f:e.f/2,a:e.a}));prof.eps.push(...add);saveProf();SC.go('gear');};
  $('#gFn',body).onchange=e=>{prof.finder.n=e.target.value;saveProf();};$('#gFf',body).onchange=e=>{prof.finder.fov=Math.max(.5,+e.target.value||5);saveProf();};
  $('#gRed',body).onclick=()=>{red.toggle();SC.go('gear');};$('#gDim',body).oninput=e=>red.setDim(e.target.value);
 });

 const projF=(ra,dec,ra0,dec0)=>{const a=dec*RAD,d0=dec0*RAD,da=(ra-ra0)*RAD,c=Math.sin(d0)*Math.sin(a)+Math.cos(d0)*Math.cos(a)*Math.cos(da);if(c<=.02)return null;return [Math.cos(a)*Math.sin(da)/c,(Math.cos(d0)*Math.sin(a)-Math.sin(d0)*Math.cos(a)*Math.cos(da))/c];};
 const starCol=bv=>bv<0?'#bcd2ff':bv<.5?'#f2f5ff':bv<1.0?'#fff1c8':bv<1.5?'#ffd9a0':'#ffb98a';

 function chart(canvas,c,half,opt={}){
  const {ctx,w,h}=KX.hidpi(canvas,opt.h||canvas.clientWidth||520);ctx.fillStyle='#02050b';ctx.fillRect(0,0,w,h);
  const S=Math.min(w,h)/2/Math.tan(half*RAD),cx=w/2,cy=h/2,P=(ra,dec)=>{const p=projF(ra,dec,c.ra,c.dec);return p?[cx-p[0]*S,cy-p[1]*S]:null;};
  const lim=Math.min(6.2,opt.mag||6.2),k=Math.max(.55,Math.min(1.6,w/520));
  const rng=half*1.6;ctx.save();
  for(const s of SD.stars){if(s[2]>lim)continue;if(Math.abs(s[1]-c.dec)>rng)continue;const p=P(s[0],s[1]);if(!p||p[0]<-10||p[1]<-10||p[0]>w+10||p[1]>h+10)continue;const r=Math.max(1.2,(7.6-s[2])*.85*k);ctx.fillStyle=starCol(s[3]);ctx.beginPath();ctx.arc(p[0],p[1],r,0,7);ctx.fill();}
  for(const s of STARS){if(Math.abs(s.dec-c.dec)>rng||s.mag>3.6)continue;const p=P(s.ra,s.dec);if(!p||p[0]<0||p[1]<0||p[0]>w||p[1]>h)continue;ctx.fillStyle='#8db4d4';ctx.font=`${11*k}px system-ui`;ctx.fillText(s.label,p[0]+6,p[1]-6);}
  for(const o of DSO){if(Math.abs(o.dec-c.dec)>rng)continue;const p=P(o.ra,o.dec);if(!p||p[0]<-20||p[1]<-20||p[0]>w+20||p[1]>h+20)continue;const rr=Math.max(4,Math.tan(o.size/120*RAD)*S);ctx.strokeStyle=o.key===opt.sel?'#ffd36b':'rgba(110,200,255,.55)';ctx.lineWidth=o.key===opt.sel?1.6:1;ctx.setLineDash(o.type==='G'?[]:[3,3]);ctx.beginPath();ctx.ellipse(p[0],p[1],rr,rr*(o.type==='G'?.6:1),-.5,0,7);ctx.stroke();ctx.setLineDash([]);if(o.m||o.key===opt.sel||half<4){ctx.fillStyle=o.key===opt.sel?'#ffd36b':'#7fc3e6';ctx.font=`${10.5*k}px system-ui`;ctx.fillText(o.m||o.label,p[0]+rr+3,p[1]+3);}}
  ctx.restore();
  for(const ci of opt.circles||[]){const rr=Math.tan(ci.deg/2*RAD)*S;ctx.strokeStyle=ci.color;ctx.lineWidth=1.6;ctx.setLineDash(ci.dash||[]);ctx.beginPath();ctx.arc(cx,cy,rr,0,7);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=ci.color;ctx.font=`${11*k}px system-ui`;ctx.fillText(ci.label,cx+rr*.707+4,cy-rr*.707-3);}
  opt.after?.(ctx,P,S,w,h,k);
  ctx.fillStyle='#6f93ad';ctx.font=`${11*k}px system-ui`;ctx.fillText('N ↑',w-34,16);ctx.fillText('← Sharq',8,16);
  const sc=half>=1?fmt(half*2,1)+'°':fmt(half*120,0)+'′';ctx.fillText('Kadr ≈ '+sc,8,h-8);
  return {P,S};
 }
 SC.chart=chart;SC.projF=projF;
 SC.addSub('fov','Ko‘rish maydoni',body=>{
  const COL=['#5ee0a0','#ffc65a','#ff8f8f','#c58cff','#58b8ff','#f2f2f2'];
  const st=SC.fovSt=SC.fovSt||{use:null,finder:false};if(!st.use||st.use.length!==prof.eps.length)st.use=prof.eps.map((e,i)=>i<3);
  body.innerHTML=`<p class="lab-note">Obyektni tanlang — xaritada teleskopingiz okulyarlarida ko‘rinadigan doira chiziladi. Faqat ≤6ᵐ yulduzlar va OpenNGC (≤10,2ᵐ) obyektlari bor: kichik maydonda xira yulduzlar ko‘rinmaydi.</p><div id="fvPick"></div><div class="lab-row ob-row" id="fvEps"></div><div class="ob-sum" id="fvInfo"></div><canvas id="fvC" class="ob-cv"></canvas>`;
  const cv=$('#fvC',body);
  const eps=$('#fvEps',body);eps.innerHTML=prof.eps.map((e,i)=>`<label style="color:${COL[i%COL.length]}"><input type="checkbox" data-e="${i}"${st.use[i]?' checked':''}> ${esc(e.n)} (${fmt(tfov(e),2)}°)</label>`).join('')+`<label style="color:#9fb4c8"><input type="checkbox" id="fvFi"${st.finder?' checked':''}> ${esc(prof.finder.n)} (${prof.finder.fov}°)</label>`;
  const redraw=()=>{const o=BYKEY.get(sel)||BYKEY.get('M31')||ALL[0];if(!o)return;if(!sel)sel=o.key;
   const circ=[];prof.eps.forEach((e,i)=>{if(st.use[i])circ.push({deg:tfov(e),color:COL[i%COL.length],label:`${fmt(mag(e),0)}× · ${fmt(tfov(e),2)}°`});});if(st.finder)circ.push({deg:prof.finder.fov,color:'#9fb4c8',dash:[5,4],label:'izlagich '+prof.finder.fov+'°'});
   const mx=Math.max(.2,...circ.map(c=>c.deg),o.size/60*1.4);cv.style.height=Math.min(cv.parentElement.clientWidth||520,600)+'px';
   chart(cv,{ra:o.ra,dec:o.dec},mx*.62,{circles:circ,sel:o.key,h:Math.min(cv.parentElement.clientWidth||520,600)});
   const be=bestEp(o);$('#fvInfo',body).innerHTML=`<b>${esc(nm(o))}</b> · ${esc(typeUz(o))} · ${fmt(o.mag,1)}ᵐ${o.size?' · '+(o.size>=1?fmt(o.size,1)+'′':'<1′')+' ('+fmt(o.size/60,2)+'°)':''} ${o.con?'· '+esc(o.con):''}<br>${be?`Tavsiya: <b>${esc(be.ep.n)}</b> (${fmt(mag(be.ep),0)}×, maydon ${fmt(tfov(be.ep),2)}°)${be.fit?'':' — obyekt eng kichik kattalashtirishda ham to‘liq sig‘maydi'}`:'Okulyar kiriting (Asbob bo‘limi).'} <button id="fvHop" class="ob-go">➜ Yo‘l (star-hop)</button><button id="fvLog">✓ Ko‘rdim</button>`;
   $('#fvHop',body).onclick=()=>SC.go('hop',o.key);$('#fvLog',body).onclick=()=>addLog(o.key);};
  picker($('#fvPick',body),o=>{sel=o.key;redraw();},sel);
  eps.onchange=e=>{if(e.target.dataset.e!=null)st.use[+e.target.dataset.e]=e.target.checked;else if(e.target.id==='fvFi')st.finder=e.target.checked;redraw();};
  redraw();
 });
})();
