(()=>{'use strict';
 const KX=window.KX,SC=KX?.scope,A=window.Astronomy;if(!SC||!A)return;
 const {$,esc,fmt,hm,stamp,inputValue,parseInput}=KX,LS=SC.LS,BY=SC.BYKEY,OFF=5*3600e3,DAY=864e5;
 const BODIES=[['Sun','Quyosh'],['Moon','Oy'],['Mercury','Merkuriy'],['Venus','Venera'],['Mars','Mars'],['Jupiter','Yupiter'],['Saturn','Saturn'],['Uranus','Uran'],['Neptune','Neptun']];
 const bodyUz=k=>(BODIES.find(b=>b[0]===k)||[])[1]||k;
 let alarms=LS.get('koinot-alarms',[]);if(!Array.isArray(alarms))alarms=[];const save=()=>LS.set('koinot-alarms',alarms);
 const nx=new Map();
 const tname=a=>a.label||(a.type==='alt'?(a.target.startsWith('body:')?bodyUz(a.target.slice(5)):(BY.get(a.target)?SC.nm(BY.get(a.target)):a.target)):a.type==='iss'?'ISS':'Budilnik');
 const desc=a=>a.type==='alt'?(a.dir==='up'?`${a.alt}° balandlikka ko‘tariladi`:`${a.alt}° dan pastga tushadi`):a.type==='iss'?'ISS ning ko‘rinadigan o‘tishi boshlanadi':'belgilangan vaqt keldi';

 const altOf=(a,ms,obs)=>{const t=new A.AstroTime(new Date(ms));let ra,dec;if(a.target.startsWith('body:')){const q=A.Equator(a.target.slice(5),t,obs,true,true);ra=q.ra;dec=q.dec;}else{const o=BY.get(a.target);if(!o)return null;ra=o.ra/15;dec=o.dec;}return A.Horizon(t,obs,ra,dec,'normal').altitude;};
 function nextAlt(a,from){const c=SC.city(),obs=new A.Observer(c[1],c[2],c[3]||0),X=a.alt,up=a.dir==='up';let prev=altOf(a,from,obs);if(prev==null)return null;
  for(let i=1;i<=360;i++){const t=from+i*300e3,v=altOf(a,t,obs);if(up?(prev<X&&v>=X):(prev>X&&v<=X)){return t-300e3+(X-prev)/(v-prev)*300e3;}prev=v;}return null;}
 function nextTime(a,from){if(a.daily){const base=Math.floor((from+OFF)/DAY)*DAY-OFF+a.hh*3600e3+a.mm*60e3;return base>from?base:base+DAY;}return a.at>from-60e3?a.at:null;}
 async function computeNext(a,now){if(a.type==='alt')return nextAlt(a,now);if(a.type==='time')return nextTime(a,now);if(a.type==='iss')return KX.issNext?KX.issNext(SC.prof.city):null;return null;}

 let ac=null,banner=null,beepT=0,flashT=0,wake=null;
 const unlock=()=>{try{if(!ac)ac=new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();}catch(e){}};
 document.addEventListener('pointerdown',unlock,{passive:true});document.addEventListener('keydown',unlock,{passive:true});
 function beepOnce(){if(!ac)return;try{const t=ac.currentTime;for(let i=0;i<3;i++){const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=i===2?1175:880;g.gain.setValueAtTime(0,t+i*.28);g.gain.linearRampToValueAtTime(.18,t+i*.28+.02);g.gain.linearRampToValueAtTime(0,t+i*.28+.2);o.connect(g);g.connect(ac.destination);o.start(t+i*.28);o.stop(t+i*.28+.22);}}catch(e){}}
 function stopRing(){clearInterval(beepT);clearInterval(flashT);if(banner){try{banner.hidePopover?.();}catch(e){}banner.remove();banner=null;}if(document.title.startsWith('⏰'))document.title=document.title.replace(/^⏰ [^|]*\| /,'');}
 function showBanner(title,text,snoozeFn){stopRing();banner=document.createElement('div');banner.id='alarmBanner';banner.setAttribute('role','alertdialog');
  banner.innerHTML=`<b>⏰ ${esc(title)}</b><p>${esc(text)}</p><div><button id="abOk">To‘xtatish</button><button id="abSn">5 daqiqa keyin</button></div>`;document.body.append(banner);
  try{banner.popover='manual';banner.showPopover();}catch(e){}
  $('#abOk',banner).onclick=stopRing;$('#abSn',banner).onclick=()=>{stopRing();setTimeout(()=>snoozeFn&&snoozeFn(),5*60e3);};
  unlock();beepOnce();let n=0;beepT=setInterval(()=>{beepOnce();if(++n>=15)clearInterval(beepT);},2600);
  const base=document.title;let on=false;flashT=setInterval(()=>{on=!on;document.title=on?'⏰ '+title+' | '+base.replace(/^⏰ [^|]*\| /,''):base.replace(/^⏰ [^|]*\| /,'');},900);
  try{navigator.vibrate&&navigator.vibrate([300,150,300,150,600]);}catch(e){}}
 function ring(a,kind,E){const mins=Math.max(0,Math.round((E-Date.now())/60e3)),title=kind==='pre'?`${tname(a)} — ${mins} daqiqadan so‘ng`:`${tname(a)} — hozir`,text=`${tname(a)}: ${kind==='pre'?mins+' daqiqadan so‘ng ':'hozir '}${desc(a)}${a.type==='alt'?' ('+SC.city()[0]+')':''}. Vaqt: ${hm(new Date(E))}.`;
  showBanner(title,text,()=>ring(a,kind,E));
  try{if('Notification' in window&&Notification.permission==='granted')new Notification('⏰ '+title,{body:text,tag:a.id,requireInteraction:true});}catch(e){}
  SC.toast(title);}

 let busy=false;
 async function tick(nowOv){if(busy)return;busy=true;try{const now=nowOv||Date.now();
  for(const a of alarms){if(!a.on)continue;
   let n=nx.get(a.id);
   if(!n||now>n.E+90e3||(n.E==null&&now-n.c>5*60e3)||(now-n.c>15*60e3&&(n.E-now)>20*60e3)){try{const E=await computeNext(a,now);n={E,c:now,err:null};}catch(e){n={E:null,c:now,err:e.message||'xato'};}nx.set(a.id,n);if(a.repeat==='once'&&n.E&&!a.E0){a.E0=n.E;save();}}
   if(a.repeat==='once'&&a.E0&&now>a.E0+10*60e3){a.on=false;a.note='o‘tkazib yuborildi';save();continue;}
   if(!n.E)continue;a.f=a.f||{};const same=x=>x&&Math.abs(x-n.E)<20*60e3,pre=n.E-a.lead*60e3;
   if(a.lead>0&&now>=pre&&now<n.E&&!same(a.f.pre)){a.f.pre=n.E;save();ring(a,'pre',n.E);}
   if(now>=n.E&&now<n.E+10*60e3&&!same(a.f.at)){a.f.at=n.E;if(a.repeat==='once')a.on=false;save();ring(a,'at',n.E);}
  }}finally{busy=false;}}
 setInterval(()=>tick(),15000);setTimeout(()=>tick(),3000);

 async function wl(on){try{if(on&&'wakeLock' in navigator&&document.visibilityState==='visible'){wake=await navigator.wakeLock.request('screen');}else if(!on&&wake){await wake.release();wake=null;}}catch(e){}}
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&LS.get('koinot-wake',false))wl(true);});
 if(LS.get('koinot-wake',false))setTimeout(()=>wl(true),1500);

 const PRE=[['Qorong‘i tun boshlanadi (Quyosh −18° dan pastga)',{type:'alt',target:'body:Sun',dir:'down',alt:-18,lead:15}],['Quyosh botadi (0° dan pastga)',{type:'alt',target:'body:Sun',dir:'down',alt:0,lead:20}],['Oy chiqadi (0° dan yuqoriga)',{type:'alt',target:'body:Moon',dir:'up',alt:0,lead:10}],['Yupiter 30° dan oshadi',{type:'alt',target:'body:Jupiter',dir:'up',alt:30,lead:10}],['Saturn 30° dan oshadi',{type:'alt',target:'body:Saturn',dir:'up',alt:30,lead:10}]];
 SC.addSub('alarm','Budilnik',body=>{
  const c=SC.city(),notif='Notification' in window?Notification.permission:'yo‘q';
  body.innerHTML=`<p class="lab-note">Obyekt kerakli balandlikka ko‘tarilishidan oldin ogohlantiradi. Shahar: <b>${esc(c[0])}</b> (Reja bo‘limida o‘zgartiriladi). <b>Brauzer sahifasi ochiq turishi kerak</b>; telefon ekrani o‘chsa budilnik chalinmasligi mumkin.</p>
  <div class="ob-sum"><b>Yangi budilnik</b>
  <div class="lab-row ob-row"><span class="ob-nt">Tez tanlash:</span>${PRE.map((p,i)=>`<button data-pre="${i}">${esc(p[0])}</button>`).join('')}</div>
  <div class="lab-row ob-row"><label>Tur <select id="alTy"><option value="alt">Obyekt balandligi</option><option value="time">Aniq vaqt</option><option value="iss">ISS ko‘rinadigan o‘tishi</option></select></label><label id="alTgW">Obyekt <select id="alTg">${BODIES.map(b=>`<option value="body:${b[0]}">${b[1]}</option>`).join('')}<option value="cat">Katalogdan…</option></select></label></div>
  <div id="alPk" style="display:none"></div>
  <div class="lab-row ob-row" id="alAltW"><label>Shart <select id="alDir"><option value="up">ko‘tarilib shu balandlikdan oshganda</option><option value="down">pasayib shu balandlikdan tushganda</option></select></label><label>Balandlik <input type="number" id="alAlt" value="30" min="-30" max="89" style="width:70px">°</label></div>
  <div class="lab-row ob-row" id="alTmW" style="display:none"><label>Vaqt <input type="datetime-local" id="alAt"></label><label><input type="checkbox" id="alDaily"> har kuni shu soatda</label></div>
  <div class="lab-row ob-row"><label>Oldindan <select id="alLead">${[0,5,10,15,30,60].map(v=>`<option${v===10?' selected':''} value="${v}">${v?v+' daqiqa':'faqat vaqtida'}</option>`).join('')}</select></label><label>Takror <select id="alRep"><option value="once">bir marta</option><option value="daily">har safar (kunlik)</option></select></label><label>Nomi <input id="alLbl" placeholder="ixtiyoriy" style="width:130px"></label><button id="alAdd" class="ob-go">⏰ Qo‘shish</button></div></div>
  <div id="alList"></div>
  <div class="ob-sum"><b>Sozlamalar</b><div class="lab-row ob-row"><button id="alTest">🔔 Tovush va ogohlantirishni sinash</button><button id="alPerm">Bildirishnoma ruxsati: ${notif==='granted'?'berilgan':notif==='denied'?'rad etilgan':notif==='yo‘q'?'qo‘llanmaydi':'so‘rash'}</button><label><input type="checkbox" id="alWake"${LS.get('koinot-wake',false)?' checked':''}> ekranni o‘chirmaslik</label></div><small>Bildirishnoma brauzer yopiq bo‘lsa ham ishlamaydi. «Ekranni o‘chirmaslik» telefon/planshetda sahifani faol saqlaydi (batareyani tezroq sarflaydi).</small></div>`;
  let pk=null;const ty=$('#alTy',body);
  const upd=()=>{const t=ty.value;$('#alTgW',body).style.display=t==='alt'?'':'none';$('#alAltW',body).style.display=t==='alt'?'':'none';$('#alTmW',body).style.display=t==='time'?'':'none';$('#alPk',body).style.display=t==='alt'&&$('#alTg',body).value==='cat'?'':'none';};
  ty.onchange=upd;$('#alTg',body).onchange=()=>{upd();if($('#alTg',body).value==='cat'&&!$('#alPk',body).firstChild)SC.picker($('#alPk',body),o=>{pk=o.key;},null);};
  $('#alAt',body).value=inputValue(new Date(Date.now()+3600e3));
  body.querySelectorAll('[data-pre]').forEach(b=>b.onclick=()=>{const p=PRE[+b.dataset.pre][1];ty.value='alt';$('#alTg',body).value=p.target;$('#alDir',body).value=p.dir;$('#alAlt',body).value=p.alt;$('#alLead',body).value=p.lead;$('#alRep',body).value='daily';upd();});
  $('#alAdd',body).onclick=()=>{unlock();const t=ty.value,a={id:Date.now().toString(36)+Math.random().toString(36).slice(2,5),type:t,on:true,lead:+$('#alLead',body).value,repeat:$('#alRep',body).value,label:$('#alLbl',body).value.trim()};
   if(t==='alt'){let tg=$('#alTg',body).value;if(tg==='cat'){if(!pk){SC.toast('Katalogdan obyekt tanlang');return;}tg=pk;}Object.assign(a,{target:tg,dir:$('#alDir',body).value,alt:+$('#alAlt',body).value});}
   else if(t==='time'){const d=parseInput($('#alAt',body).value);if(!d){SC.toast('Vaqtni kiriting');return;}if($('#alDaily',body).checked){const L=new Date(d.getTime()+OFF);Object.assign(a,{daily:true,hh:L.getUTCHours(),mm:L.getUTCMinutes(),repeat:'daily'});}else Object.assign(a,{at:d.getTime(),repeat:'once'});}
   alarms.unshift(a);save();tick().then(()=>SC.go('alarm'));SC.toast('Budilnik qo‘shildi');SC.go('alarm');};
  $('#alTest',body).onclick=()=>{showBanner('Sinov','Budilnik shunday ko‘rinadi va eshitiladi.',null);};
  $('#alPerm',body).onclick=async()=>{try{const r=await Notification.requestPermission();SC.toast('Bildirishnoma: '+r);SC.go('alarm');}catch(e){SC.toast('Bu brauzerda bildirishnoma yo‘q');}};
  $('#alWake',body).onchange=e=>{LS.set('koinot-wake',e.target.checked);wl(e.target.checked);};
  const list=$('#alList',body),rows=()=>{list.innerHTML=alarms.length?`<div class="ob-tw"><table class="ob-t"><thead><tr><th>Budilnik</th><th>Shart</th><th>Keyingisi</th><th></th></tr></thead><tbody>${alarms.map(a=>{const n=nx.get(a.id),now=Date.now();let when='—';if(!a.on)when='<small>o‘chiq'+(a.note?' · '+esc(a.note):'')+'</small>';else if(!n)when='<small>hisoblanmoqda…</small>';else if(n.err)when='<small>'+esc(n.err)+'</small>';else if(!n.E)when='<small>'+(a.type==='iss'?'3 kun ichida ko‘rinadigan o‘tish yo‘q yoki TLE yo‘q':'24 soat ichida bunday holat yo‘q')+'</small>';else{const m=Math.round((n.E-now)/60e3);when=`<b>${stamp(new Date(n.E))}</b><small>${m>0?(m>=60?Math.floor(m/60)+' soat '+m%60+' daq':m+' daq')+' qoldi':'hozir'}${a.lead?' · ogohlantirish '+hm(new Date(n.E-a.lead*60e3)):''}</small>`;}
    return `<tr><td><b>${esc(tname(a))}</b><small>${a.type==='time'?(a.daily?'har kuni '+String(a.hh).padStart(2,'0')+':'+String(a.mm).padStart(2,'0'):stamp(new Date(a.at))):a.type==='iss'?'ISS ko‘rinadigan o‘tish':esc(desc(a))}</small></td><td>${a.lead?a.lead+' daq oldin':'vaqtida'} · ${a.repeat==='once'?'bir marta':'takroriy'}</td><td>${when}</td><td class="ob-act"><button data-t="${a.id}">${a.on?'⏸':'▶'}</button><button data-d="${a.id}">✕</button></td></tr>`;}).join('')}</tbody></table></div>`:'<p class="lab-note">Hali budilnik yo‘q.</p>';};
  rows();tick().then(rows);const iv=setInterval(()=>{if(!body.isConnected){clearInterval(iv);return;}rows();},10000);
  list.onclick=e=>{const t=e.target.closest('[data-t]'),d=e.target.closest('[data-d]');if(t){const a=alarms.find(x=>x.id===t.dataset.t);a.on=!a.on;if(a.on){a.note='';a.E0=null;nx.delete(a.id);if(a.type==='time'&&!a.daily&&a.at<Date.now()){a.on=false;a.note='vaqti o‘tgan';SC.toast('Bu vaqt o‘tib ketgan');}}save();tick().then(rows);rows();}else if(d){alarms=alarms.filter(x=>x.id!==d.dataset.d);save();rows();}};
 });
 KX.alarm={tick,ring,showBanner,stop:stopRing,list:()=>alarms,add:a=>{alarms.unshift(Object.assign({id:'t'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),on:true,lead:0,repeat:'once'},a));save();},next:nx};
})();
