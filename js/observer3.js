(()=>{'use strict';
 const KX=window.KX,SC=KX?.scope,A=window.Astronomy;if(!SC||!A)return;
 const {$,esc,fmt,pad,OFFSET,hm,ymd}=KX,LS=SC.LS,RAD=Math.PI/180,BY=SC.BYKEY;
 const PL=[['Moon','Oy'],['Mercury','Merkuriy'],['Venus','Venera'],['Mars','Mars'],['Jupiter','Yupiter'],['Saturn','Saturn'],['Uranus','Uran'],['Neptune','Neptun']];
 const STEP=15*60e3,NS=57;

 function hz(tg,ms,obs){const t=new A.AstroTime(new Date(ms));let ra,dec;
  if(tg.k==='body'){const q=A.Equator(tg.n,t,obs,true,true);ra=q.ra;dec=q.dec;}else{ra=tg.o.ra/15;dec=tg.o.dec;}
  const h=A.Horizon(t,obs,ra,dec,'normal');return {alt:h.altitude,az:h.azimuth,ra,dec};}
 const sun=(ms,obs)=>{const t=new A.AstroTime(new Date(ms)),q=A.Equator('Sun',t,obs,true,true);return A.Horizon(t,obs,q.ra,q.dec,'normal');};
 const evening=ds=>{const m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(ds||'');if(!m)return null;return Date.UTC(+m[1],+m[2]-1,+m[3],17-OFFSET,0);};
 function sky(tg,t0,obs){const rows=[];for(let i=0;i<NS;i++){const ms=t0+i*STEP,o=hz(tg,ms,obs),s=sun(ms,obs);rows.push({ms,alt:o.alt,az:o.az,sun:s.altitude,sunaz:s.azimuth});}return rows;}
 const dark=r=>r.sun<-12;
 const nm=tg=>tg.k==='body'?PL.find(p=>p[0]===tg.n)[1]:SC.nm(tg.o);
 const lastKey=()=>LS.get('koinot-pathkey','M31');

 const ps={tg:null,date:null,res:null,idx:0,play:false,raf:0,minAlt:25,body:'',gen:0};
 SC.addSub('path','Tun yo‘li',body=>{
  const gen=++ps.gen;ps.play=false;
  if(!ps.tg){const o=BY.get(SC.sel||lastKey())||BY.get('M31')||SC.ALL[0];ps.tg={k:'cat',o};}
  if(!ps.date)ps.date=ymd(new Date());
  const c=SC.city();
  body.innerHTML=`<p class="lab-note">Tanlangan obyekt tun bo‘yi osmonda qanday yurishini ko‘rsatadi: chap — osmon gumbazi (tepadan ko‘rinish), o‘ngda — balandlik grafigi. Shahar: <b>${esc(c[0])}</b>. Vaqt: mahalliy (UTC+${OFFSET}), 17:00 dan ertasi 07:00 gacha.</p>
  <div id="phPk"></div>
  <div class="ob-row"><label>Yoki sayyora <select id="phBd"><option value="">—</option>${PL.map(p=>`<option value="${p[0]}">${p[1]}</option>`).join('')}</select></label>
  <label>Kechqurun sanasi <input id="phDt" type="date" value="${ps.date}"></label>
  <label>Eng past balandlik <select id="phMin">${[10,15,20,25,30,40].map(v=>`<option${v===ps.minAlt?' selected':''}>${v}</option>`).join('')}</select>°</label></div>
  <div class="ob-sum" id="phSum"></div>
  <div class="ob-row"><button id="phPlay" class="ob-go">▶ Animatsiya</button><input id="phSl" type="range" min="0" max="${NS-1}" value="${ps.idx}" style="flex:1;min-width:140px"><b id="phT"></b></div>
  <div class="ob-two"><canvas id="phSky" class="ob-cv" style="width:calc(50% - 6px);min-width:280px"></canvas><canvas id="phAlt" class="ob-cv" style="width:calc(50% - 6px);min-width:280px"></canvas></div>
  <div class="ob-row"><button id="phAl">⏰ Shu balandlikka ko‘tarilganda budilnik</button><button id="phFov">🔭 Ko‘rish maydoni</button><button id="phHop">✦ Star-hop</button></div>
  <p class="lab-note" id="phNote"></p>`;
  const pk=$('#phPk',body);
  SC.picker(pk,o=>{ps.tg={k:'cat',o};LS.set('koinot-pathkey',o.key);$('#phBd',body).value='';calc();},ps.tg.k==='cat'?ps.tg.o.key:'');
  $('#phBd',body).value=ps.tg.k==='body'?ps.tg.n:'';
  $('#phBd',body).onchange=e=>{if(e.target.value){ps.tg={k:'body',n:e.target.value};calc();}};
  $('#phDt',body).onchange=e=>{ps.date=e.target.value;calc();};
  $('#phMin',body).onchange=e=>{ps.minAlt=+e.target.value;paint();};
  $('#phSl',body).oninput=e=>{ps.idx=+e.target.value;paint();};
  $('#phPlay',body).onclick=()=>{ps.play=!ps.play;$('#phPlay',body).textContent=ps.play?'⏸ To‘xtatish':'▶ Animatsiya';if(ps.play){if(ps.idx>=NS-1)ps.idx=0;loop();}};
  $('#phAl',body).onclick=()=>{if(!KX.alarm){SC.toast('Budilnik moduli yuklanmagan');return;}KX.alarm.add({type:'alt',target:ps.tg.k==='body'?'body:'+ps.tg.n:ps.tg.o.key,dir:'up',alt:ps.minAlt,lead:10,repeat:'once'});SC.toast('Budilnik qo‘shildi: '+nm(ps.tg)+' '+ps.minAlt+'° dan oshganda');};
  $('#phFov',body).onclick=()=>{if(ps.tg.k==='cat')SC.go('fov',ps.tg.o.key);else SC.toast('Ko‘rish maydoni faqat katalog obyektlari uchun');};
  $('#phHop',body).onclick=()=>{if(ps.tg.k==='cat')SC.go('hop',ps.tg.o.key);else SC.toast('Star-hop faqat katalog obyektlari uchun');};
  function loop(){cancelAnimationFrame(ps.raf);if(!ps.play||gen!==ps.gen||!$('#phSl',body)){ps.play=false;return;}
   let last=performance.now(),acc=0;const f=now=>{if(!ps.play||gen!==ps.gen||!$('#phSl',body)){ps.play=false;return;}acc+=now-last;last=now;if(acc>140){acc=0;ps.idx++;if(ps.idx>=NS){ps.idx=NS-1;ps.play=false;const b=$('#phPlay',body);if(b)b.textContent='▶ Animatsiya';paint();return;}paint();}ps.raf=requestAnimationFrame(f);};ps.raf=requestAnimationFrame(f);}
  function calc(){const t0=evening(ps.date);if(!t0){$('#phSum',body).textContent='Sana noto‘g‘ri.';return;}
   try{ps.res={t0,rows:sky(ps.tg,t0,SC.observer()),moon:sky({k:'body',n:'Moon'},t0,SC.observer())};}catch(e){$('#phSum',body).textContent='Hisoblashda xatolik: '+e.message;return;}paint();}
  function summary(){const R=ps.res,rows=R.rows,min=ps.minAlt;
   let best=null,win=null,cur=null;
   rows.forEach((r,i)=>{if(!best||r.alt>best.alt)best=r;const ok=dark(r)&&r.alt>=min;if(ok){if(!cur)cur={a:i,b:i};else cur.b=i;}else if(cur){if(!win||cur.b-cur.a>win.b-win.a)win=cur;cur=null;}});if(cur&&(!win||cur.b-cur.a>win.b-win.a))win=cur;
   const up=rows.filter(r=>r.alt>0).length,nightUp=rows.filter(r=>dark(r)&&r.alt>0).length;
   const mid=R.moon[Math.round(NS/2)];
   const o=ps.tg.k==='cat'?ps.tg.o:null;let sep='';
   if(o){const q=new A.AstroTime(new Date(R.t0+Math.round(NS/2)*STEP)),m=A.Equator('Moon',q,SC.observer(),true,true),d=SC.angDist(o.ra,o.dec,m.ra*15,m.dec),il=A.Illumination('Moon',q).phase_fraction;sep=`<br>Oy (yarim tunda): yorug‘lik ≈ ${fmt(il*100,0)}%, obyektdan ≈ ${fmt(d,0)}° narida${mid.alt>0?' (Oy ufq ustida)':' (Oy ufq ostida)'}${il>.6&&d<40&&mid.alt>0?' — <b>yorqin Oy yaqin: xira obyektlar yomon ko‘rinadi</b>':''}.`;}
   const txt=!best||best.alt<=0?`<b>${esc(nm(ps.tg))}</b> bu kecha ufq ustiga chiqmaydi.`:
    `<b>${esc(nm(ps.tg))}</b>: ufq ustida ${fmt(up*.25,1)} soat (shundan to‘liq qorong‘i vaqtda ${fmt(nightUp*.25,1)} soat).<br>Eng baland (17:00–07:00 oralig‘ida): <b>${hm(new Date(best.ms))}</b>da ${fmt(best.alt,0)}° (${SC.compass(best.az)}).<br>`+
    (win?`Eng yaxshi oyna (${min}° dan baland va Quyosh −12° dan pastda): <b>${hm(new Date(rows[win.a].ms))} – ${hm(new Date(rows[win.b].ms+STEP))}</b> (≈ ${fmt((win.b-win.a+1)*.25,1)} soat).`:`${min}° dan baland va qorong‘i vaqt to‘g‘ri kelmaydi.`)+sep;
   $('#phSum',body).innerHTML=txt;}
  function paint(){const R=ps.res;if(!R)return;const rows=R.rows,r=rows[ps.idx];summary();
   $('#phSl',body).value=ps.idx;$('#phT',body).textContent=hm(new Date(r.ms))+' · '+fmt(r.alt,0)+'°'+(r.alt>0?' '+SC.compass(r.az):' (ufq ostida)');
   drawSky(rows,R.moon,ps.idx);drawAlt(rows,ps.idx);
   $('#phNote',body).textContent='Kulrang nuqtalar — Quyosh hali ufq ustida yoki shafaq; yorqin nuqtalar — to‘liq qorong‘i (Quyosh −18° dan past). Oy sariq doira. Hisob taxminan ±0,5° aniqlikda.';}
  function drawSky(rows,moon,idx){const cv=$('#phSky',body);const {ctx,w,h}=KX.hidpi(cv,Math.min(cv.clientWidth||340,440));const cx=w/2,cy=h/2,R=Math.min(w,h)/2-30;
   ctx.fillStyle='#02050b';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#27425a';ctx.lineWidth=1;
   for(const a of [0,30,60]){ctx.beginPath();ctx.arc(cx,cy,R*(90-a)/90,0,7);ctx.stroke();}
   ctx.fillStyle='#8aa6bd';ctx.font='11px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';

   const XY=(az,alt)=>{const r=R*(90-alt)/90,a=az*RAD;return [cx-r*Math.sin(a),cy-r*Math.cos(a)];};
   ctx.fillText('Sh',cx,cy-R-10);ctx.fillText('J',cx,cy+R+10);ctx.fillText('Sharq',cx-R-12,cy);ctx.fillText('G‘arb',cx+R+12,cy);
   ctx.fillText('30°',cx+4,cy-R*60/90-6);ctx.fillText('60°',cx+4,cy-R*30/90-6);

   rows.forEach((q,i)=>{if(q.alt<0)return;const [x,y]=XY(q.az,q.alt);ctx.globalAlpha=1;ctx.fillStyle=q.sun<-18?'#bfe3ff':q.sun<-12?'#6aa6d6':q.sun<-6?'#53708a':'#3a4652';ctx.beginPath();ctx.arc(x,y,i===idx?0:2.2,0,7);ctx.fill();});
   const mm=moon[idx];if(mm.alt>0){const [x,y]=XY(mm.az,mm.alt);ctx.fillStyle='#ffd966';ctx.beginPath();ctx.arc(x,y,6,0,7);ctx.fill();ctx.fillStyle='#ffd966';ctx.fillText('Oy',x+13,y);}
   const q=rows[idx];if(q.sun>-6){const [x,y]=XY(q.sunaz,Math.max(0,q.sun));if(q.sun>0){ctx.fillStyle='#ffb000';ctx.beginPath();ctx.arc(x,y,6,0,7);ctx.fill();ctx.fillText('Quyosh',x+22,y);}}
   if(q.alt>0){const [x,y]=XY(q.az,q.alt);ctx.fillStyle='#ff5a5a';ctx.beginPath();ctx.arc(x,y,6,0,7);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke();}
   else{ctx.fillStyle='#ff9a8a';ctx.fillText('ufq ostida',cx,cy);}}
  function drawAlt(rows,idx){const cv=$('#phAlt',body);const {ctx,w,h}=KX.hidpi(cv,Math.min(cv.clientWidth||340,440));const L=34,Rr=w-8,T=10,B=h-22,X=i=>L+(Rr-L)*i/(NS-1),Y=a=>B-(B-T)*(Math.max(-10,Math.min(90,a))+10)/100;
   ctx.fillStyle='#02050b';ctx.fillRect(0,0,w,h);
   rows.forEach((q,i)=>{if(i===NS-1)return;ctx.fillStyle=q.sun<-18?'#0a1830':q.sun<-12?'#0d1f38':q.sun<-6?'#16283d':q.sun<0?'#223347':'#37526b';ctx.fillRect(X(i),T,X(i+1)-X(i)+.5,B-T);});
   ctx.strokeStyle='#2a4660';ctx.fillStyle='#8aa6bd';ctx.font='10px system-ui';ctx.textAlign='right';ctx.textBaseline='middle';
   for(const a of [0,30,60,90]){ctx.beginPath();ctx.moveTo(L,Y(a));ctx.lineTo(Rr,Y(a));ctx.stroke();ctx.fillText(a+'°',L-4,Y(a));}
   ctx.setLineDash([4,4]);ctx.strokeStyle='#5ee0a0';ctx.beginPath();ctx.moveTo(L,Y(ps.minAlt));ctx.lineTo(Rr,Y(ps.minAlt));ctx.stroke();ctx.setLineDash([]);
   ctx.textAlign='center';ctx.textBaseline='top';for(let i=0;i<NS;i+=8){ctx.fillStyle='#8aa6bd';ctx.fillText(hm(new Date(rows[i].ms)),X(i),B+4);}
   ctx.strokeStyle='#ffd966';ctx.lineWidth=1;ctx.beginPath();R_.moon.forEach((q,i)=>{const x=X(i),y=Y(q.alt);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();
   ctx.strokeStyle='#6fd0ff';ctx.lineWidth=2.2;ctx.beginPath();rows.forEach((q,i)=>{const x=X(i),y=Y(q.alt);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();
   ctx.strokeStyle='#ff5a5a';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(X(idx),T);ctx.lineTo(X(idx),B);ctx.stroke();
   ctx.fillStyle='#ff5a5a';ctx.beginPath();ctx.arc(X(idx),Y(rows[idx].alt),4,0,7);ctx.fill();}
  const R_={get moon(){return ps.res.moon;}};
  calc();
 });

 const seen=()=>LS.get('koinot-seen',{});const saveSeen=s=>LS.set('koinot-seen',s);
 const MES=SC.ALL.filter(o=>o.kind==='dso'&&/^M\d+$/.test(o.m)).sort((a,b)=>+a.m.slice(1)-+b.m.slice(1));
 const ls={flt:'unseen',typ:'',sort:'num',tonight:null,tkey:'',clr:false};
 function tonightMap(){const key=ymd(new Date());if(ls.tkey===key&&ls.tonight)return ls.tonight;
  const t0=evening(key),obs=SC.observer(),S=[];for(let i=0;i<NS;i++){const ms=t0+i*STEP;S.push({ms,sun:sun(ms,obs).altitude});}
  const map=new Map();for(const o of MES){const tg={k:'cat',o};let best=null;for(const s of S){if(s.sun>=-12)continue;const a=hz(tg,s.ms,obs).alt;if(!best||a>best.alt)best={alt:a,ms:s.ms};}map.set(o.key,best);}
  ls.tonight=map;ls.tkey=key;return map;}
 SC.addSub('list','Ro‘yxat',body=>{
  const S=seen(),tm=tonightMap(),done=MES.filter(o=>S[o.key]).length,ml=SC.mlim();
  const types=[...new Set(MES.map(o=>SC.typeUz(o)))].sort();
  let rows=MES.slice();
  if(ls.flt==='unseen')rows=rows.filter(o=>!S[o.key]);else if(ls.flt==='seen')rows=rows.filter(o=>S[o.key]);else if(ls.flt==='tonight')rows=rows.filter(o=>!S[o.key]&&tm.get(o.key)&&tm.get(o.key).alt>=25);
  if(ls.typ)rows=rows.filter(o=>SC.typeUz(o)===ls.typ);
  if(ls.sort==='alt')rows.sort((a,b)=>(tm.get(b.key)?.alt??-99)-(tm.get(a.key)?.alt??-99));else if(ls.sort==='mag')rows.sort((a,b)=>(a.mag??99)-(b.mag??99));
  const tn=MES.filter(o=>!S[o.key]&&tm.get(o.key)&&tm.get(o.key).alt>=25).length;
  body.innerHTML=`<p class="lab-note">Messier ro‘yxati: ${MES.length} ta obyekt (M102 katalogda yo‘q — uning nima ekani astronomlar o‘rtasida bahsli, odatda M101 yoki NGC 5866 bilan bog‘lanadi). Ko‘rganlaringizni belgilab boring; belgilar shu brauzerda saqlanadi.</p>
  <div class="ob-sum"><b>${done} / ${MES.length}</b> ta ko‘rilgan<div class="ob-bar"><i style="width:${(done/MES.length*100).toFixed(1)}%"></i></div>
  Bu kecha (qorong‘i vaqtda 25° dan baland) ko‘rish mumkin bo‘lgan <b>ko‘rilmagan</b> obyektlar: <b>${tn}</b>. ${done===MES.length?'🏆 Hammasini ko‘rdingiz!':done>=MES.length/2?'Yarmidan ko‘pi ortda — davom eting!':''}</div>
  <div class="ob-row"><label>Ko‘rsatish <select id="lsF"><option value="unseen">Ko‘rilmagan</option><option value="tonight">Bu kecha ko‘riladigan (ko‘rilmagan)</option><option value="seen">Ko‘rilgan</option><option value="all">Hammasi</option></select></label>
  <label>Turi <select id="lsT"><option value="">Hammasi</option>${types.map(t=>`<option>${esc(t)}</option>`).join('')}</select></label>
  <label>Saralash <select id="lsS"><option value="num">Raqam bo‘yicha</option><option value="alt">Bu kecha balandligi</option><option value="mag">Yorqinligi</option></select></label></div>
  <div class="ob-row"><button id="lsImp">Jurnaldagilarni belgilash</button><button id="lsClr">${ls.clr?'Aniq tozalaymi? (qayta bosing)':'Belgilarni tozalash'}</button></div>
  <div class="ob-tw"><table class="ob-t"><tr><th></th><th>Obyekt</th><th>Turi</th><th>Kattalik</th><th>Bu kecha eng baland</th><th></th></tr>
  ${rows.map(o=>{const b=tm.get(o.key),vis=o.mag==null?'noma‘lum':o.mag<=ml?(o.mag<=ml-2?'oson':'mumkin'):'zaif';return `<tr class="${S[o.key]?'ob-done':''}"><td><input type="checkbox" data-c="${esc(o.key)}"${S[o.key]?' checked':''}></td><td><b>${esc(o.m)}</b> ${esc(o.common||o.label&&o.label!==o.m?o.common||o.label:'')}<small> · ${esc(o.con)}</small>${S[o.key]?`<small> · ${esc(String(S[o.key]).slice(0,10))}</small>`:''}</td><td>${esc(SC.typeUz(o))}</td><td>${o.mag!=null?fmt(o.mag,1)+'ᵐ':'—'} <small>${vis}</small></td><td>${b&&b.alt>0?fmt(b.alt,0)+'° · '+hm(new Date(b.ms)):'ko‘rinmaydi'}</td><td class="ob-act"><button data-a="path" data-k="${esc(o.key)}" title="Tun yo‘li">🌌</button><button data-a="fov" data-k="${esc(o.key)}" title="Ko‘rish maydoni">🔭</button><button data-a="log" data-k="${esc(o.key)}" title="Jurnalga yozish va belgilash">📓</button></td></tr>`;}).join('')||'<tr><td colspan="6">Bu filtr bo‘yicha obyekt yo‘q.</td></tr>'}</table></div>
  <p class="lab-note">«Kattalik» yonidagi baho teleskopingiz (${SC.prof.D} mm, osmon Bortle ${SC.prof.bortle}) uchun taxminiy: yorqinlik chegarasi ≈ ${fmt(ml,1)}ᵐ. Kengroq obyektlar (kattaligi bir xil bo‘lsa ham) qiyinroq ko‘rinadi. Katalogda kattaligi yo‘q obyektlar «noma‘lum» deb belgilangan.</p>`;
  $('#lsF',body).value=ls.flt;$('#lsT',body).value=ls.typ;$('#lsS',body).value=ls.sort;
  $('#lsF',body).onchange=e=>{ls.flt=e.target.value;SC.go('list');};$('#lsT',body).onchange=e=>{ls.typ=e.target.value;SC.go('list');};$('#lsS',body).onchange=e=>{ls.sort=e.target.value;SC.go('list');};
  $('#lsImp',body).onclick=()=>{const L=LS.get('koinot-log',[]),s=seen();let n=0;for(const e of L){const o=BY.get(e.key);if(o&&/^M\d+$/.test(o.m)&&!s[o.key]){s[o.key]=(e.t||new Date().toISOString()).slice(0,10);n++;}}saveSeen(s);SC.toast(n?n+' ta obyekt belgilandi':'Yangi obyekt topilmadi');SC.go('list');};
  $('#lsClr',body).onclick=()=>{if(!ls.clr){ls.clr=true;SC.go('list');setTimeout(()=>{ls.clr=false;},4000);return;}ls.clr=false;saveSeen({});SC.toast('Belgilar tozalandi');SC.go('list');};
  body.onchange=e=>{const c=e.target.closest('[data-c]');if(!c)return;const s=seen();if(c.checked)s[c.dataset.c]=new Date().toISOString().slice(0,10);else delete s[c.dataset.c];saveSeen(s);SC.go('list');};
  body.onclick=e=>{const b=e.target.closest('button[data-a]');if(!b)return;const k=b.dataset.k;
   if(b.dataset.a==='log'){SC.addLog(k);const s=seen();if(!s[k]){s[k]=new Date().toISOString().slice(0,10);saveSeen(s);}SC.go('list');}
   else{ps.tg={k:'cat',o:BY.get(k)};LS.set('koinot-pathkey',k);SC.go(b.dataset.a,k);}};
 });
 SC.seen={get:seen,mes:()=>MES};
})();
