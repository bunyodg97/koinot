(()=>{'use strict';
 const KX=window.KX,BR=window.KOINOT_BRIGHT;if(!KX?.tab||!BR)return;
 const {$,esc,fmt}=KX,RAD=Math.PI/180,E0=23.4392911*RAD;
 const epsOf=T=>(23.4392911-0.0130042*T)*RAD;
 const prec=T=>(5028.796195*T+1.1054348*T*T)/3600;
 const norm=d=>((d%360)+360)%360;
 function toEcl(raH,dec){const a=raH*15*RAD,d=dec*RAD;const b=Math.asin(Math.sin(d)*Math.cos(E0)-Math.cos(d)*Math.sin(E0)*Math.sin(a));
  const l=Math.atan2(Math.sin(a)*Math.cos(E0)*Math.cos(d)+Math.sin(d)*Math.sin(E0),Math.cos(a)*Math.cos(d));return {l:norm(l/RAD),b:b/RAD};}
 function toEq(l,b,e){const L=l*RAD,B=b*RAD;const d=Math.asin(Math.sin(B)*Math.cos(e)+Math.cos(B)*Math.sin(e)*Math.sin(L));
  const a=Math.atan2(Math.sin(L)*Math.cos(e)*Math.cos(B)-Math.sin(B)*Math.sin(e),Math.cos(L)*Math.cos(B));return {ra:norm(a/RAD)/15,dec:d/RAD};}
 const yearT=y=>(y-2000)/100;
 function atYear(s,y){const T=yearT(y),e=toEcl(s[1],s[2]),l=norm(e.l+prec(T));return {l,b:e.b,eq:toEq(l,e.b,epsOf(T))};}
 const SIGN=['Hamal','Savr','Javzo','Saraton','Asad','Sunbula','Mezon','Aqrab','Qavs','Jaddiy','Dalv','Hut'];
 const sg=l=>{const k=Math.floor(l/30),r=l-k*30,d=Math.floor(r),m=Math.round((r-d)*60);return SIGN[k]+' '+d+'°'+String(m===60?59:m).padStart(2,'0')+'′';};

 const ETY={Aldebaran:'al-dabarān — «ergashuvchi» (Parvin turkumidan keyin chiqadi)',Altair:'an-nasr aṭ-ṭāʾir — «uchuvchi burgut»',Deneb:'ḏanab — «dum» (Oqqush dumi)',Betelgeuse:'yad al-jawzāʾ — «Jovzoning qo‘li» (kelib chiqishi bahsli)',Fomalhaut:'fam al-ḥūt — «baliq og‘zi»',
  Algol:'raʾs al-ġūl — «devning boshi»',Alphard:'al-fard — «yolg‘iz»',Achernar:'āḵir an-nahr — «daryo oxiri»',Rasalhague:'raʾs al-ḥawwāʾ — «ilon ushlovchining boshi»',Denebola:'ḏanab al-asad — «sher dumi»',
  Dubhe:'ẓahr ad-dubb — «ayiq orqasi»',Alnitak:'an-niṭāq — «belbog‘»',Alnilam:'an-niẓām — «marjon tizmasi»',Mintaka:'manṭaqa — «belbog‘»',Saiph:'sayf al-jabbār — «devning qilichi»',Enif:'anf — «burun» (Pegas burni)',
  Markab:'markab — «minik, kema»',Sadr:'ṣadr — «ko‘krak» (Oqqush ko‘kragi)',Kochab:'kawkab — «yulduz»',Alkaid:'al-qāʾid — «yetaklovchi»',Merak:'maraqq — «bel, yon»',Algieba:'al-jabha — «peshona»',Menkar:'minḫar — «burun teshigi»',
  Hamal:'ḥamal — «qo‘chqor»',Mirfak:'mirfaq — «tirsak»',Alpheratz:'surrat al-faras — «otning kindigi»',Schedar:'ṣadr — «ko‘krak» (Kassiopeya ko‘kragi)',Caph:'kaff — «kaft»',Ruchbah:'rukba — «tizza»',Algenib:'al-janb — «yon»',
  Zubenelgenubi:'zubān al-janūbiyy — «janubiy changal»',Shaula:'šawla — «ko‘tarilgan (dum)» (Chayon dumi)',Diphda:'aḍ-ḍifdaʿ aṯ-ṯānī — «ikkinchi qurbaqa»',Wezen:'wazn — «og‘irlik»',Adhara:'ʿaḏārā — «bokiralar»'};
 const ety=s=>s[4]||ETY[s[0]]||'';
 const POLARIS=BR.find(s=>s[0]==='Polaris');
 const poleDist=y=>{if(!POLARIS)return NaN;return 90-atYear(POLARIS,y).eq.dec;};
 const st={q:'',sort:'mag'};
 KX.tab('ulugbek','Ulug‘bek osmoni',body=>{
  const rows=()=>{let r=BR.map(s=>({s,o:atYear(s,1437),n:atYear(s,2000)}));const q=st.q.trim().toLowerCase();if(q)r=r.filter(x=>(x.s[0]+' '+ety(x.s)).toLowerCase().includes(q));
   r.sort((a,b)=>st.sort==='name'?a.s[0].localeCompare(b.s[0]):st.sort==='lon'?a.o.l-b.o.l:a.s[3]-b.s[3]);return r;};
  const shift=prec(yearT(1437))*-1;
  body.innerHTML=`<p class="lab-note">Mirzo Ulug‘bek (1394–1449) Samarqand rasadxonasida yulduzlar katalogini tuzgan (≈1437-y., «Ziji Ko‘ragoniy», 1018 yulduz; Samarqandda ko‘rinmaydiganlari qadimgi kataloglardan olingan). Quyida — <b>hozirgi yorqin yulduzlar o‘sha davrda qayerda bo‘lgan bo‘lishi kerakligining hisobi</b>. Bu Ulug‘bekning o‘z raqamlari emas.</p>
  <div class="ob-sum"><b>Asosiy fakt.</b> Yer o‘qining prekessiyasi tufayli bahorgi tengkunlik nuqtasi asrlar davomida siljiydi: 1437–2000 yillar orasida ekliptik uzunlik ≈ <b>${fmt(shift,1)}°</b>ga o‘zgargan, ya’ni har bir yulduzning uzunligi o‘sha davrda ${fmt(shift,1)}° kamroq edi.
  <br><span id="ubPole"></span></div>
  <canvas id="ubCv" class="ob-cv"></canvas>
  <div class="ob-row"><label>Qidirish <input id="ubQ" type="search" placeholder="Vega, burgut, ayiq…" value="${esc(st.q)}"></label><label>Saralash <select id="ubS"><option value="mag">Yorqinligi</option><option value="name">Nomi</option><option value="lon">1437-y. uzunligi</option></select></label></div>
  <div class="ob-tw"><table class="ob-t"><thead><tr><th>Yulduz</th><th>Kattalik</th><th>1437-yildagi o‘rni (ekliptik)</th><th>2000-yilda</th><th>Kenglik β</th><th>Nomi qayerdan</th></tr></thead><tbody id="ubT"></tbody></table></div>
  <p class="lab-note">Qanday o‘qiladi: «Sunbula 23°15′» — Quyosh yo‘lining (ekliptikaning) 12 ta teng 30° li bo‘lagidan oltinchisi ichida, uning boshidan 23°15′ narida degani (Ulug‘bek jadvallarida shunday yoziladi). Bu yerdagi «Sunbula» — zodiak <i>belgisi</i> (ekliptikaning 30° li qismi), bugungi Bokira <i>yulduz turkumi</i> bilan aynan bir joyda emas, chunki tengkunlik siljigan. Yulduz nomlarining ma’nolari — umumiy qabul qilingan etimologiyalar (arabcha ildizlar o‘rta asrlarda lotin yozuviga o‘tgan); ayrimlarining kelib chiqishi bahsli.</p>`;
  const body2=$('#ubT',body);
  const paint=()=>{body2.innerHTML=rows().map(x=>`<tr><td><b>${esc(x.s[0])}</b></td><td>${fmt(x.s[3],2)}ᵐ</td><td>${esc(sg(x.o.l))} <small>(λ ${fmt(x.o.l,2)}°)</small></td><td>${esc(sg(x.n.l))}</td><td>${fmt(x.o.b,1)}°</td><td><small>${esc(ety(x.s)||'—')}</small></td></tr>`).join('')||'<tr><td colspan="6">Topilmadi.</td></tr>';};
  $('#ubQ',body).oninput=e=>{st.q=e.target.value;paint();};$('#ubS',body).value=st.sort;$('#ubS',body).onchange=e=>{st.sort=e.target.value;paint();};paint();

  if(POLARIS){const d1=poleDist(1437),d0=poleDist(2026),ys=[];let mn={y:0,d:99};for(let y=1000;y<=3000;y+=5){const d=poleDist(y);ys.push([y,d]);if(d<mn.d)mn={y,d};}
   $('#ubPole',body).innerHTML=`<b>Qutb yulduzi (Polaris).</b> 1437-yilda u shimoliy osmon qutbidan ≈ <b>${fmt(d1,1)}°</b> uzoqda edi (hozir ≈ ${fmt(d0,2)}°, eng yaqin kelishi ≈ ${mn.y}-yil atrofida, ≈ ${fmt(mn.d,2)}°). Ya’ni Ulug‘bek davrida Qutb yulduzi hozirgidan ancha «aylanib yuruvchi» edi.`;
   const cv=$('#ubCv',body),{ctx,w,h}=KX.hidpi(cv,Math.min(cv.clientWidth||560,230));ctx.fillStyle='#02050b';ctx.fillRect(0,0,w,h);
   const L=40,R=w-10,T=14,B=h-26,X=y=>L+(R-L)*(y-1000)/2000,mx=Math.max(...ys.map(a=>a[1])),Y=d=>B-(B-T)*d/mx;
   ctx.strokeStyle='#27425a';ctx.fillStyle='#8aa6bd';ctx.font='10px system-ui';ctx.textAlign='right';ctx.textBaseline='middle';
   for(let g=0;g<=mx;g+=Math.ceil(mx/4)){ctx.beginPath();ctx.moveTo(L,Y(g));ctx.lineTo(R,Y(g));ctx.stroke();ctx.fillText(g+'°',L-4,Y(g));}
   ctx.textAlign='center';ctx.textBaseline='top';for(let y=1000;y<=3000;y+=500)ctx.fillText(y,X(y),B+5);
   ctx.strokeStyle='#6fd0ff';ctx.lineWidth=2;ctx.beginPath();ys.forEach((a,i)=>{i?ctx.lineTo(X(a[0]),Y(a[1])):ctx.moveTo(X(a[0]),Y(a[1]));});ctx.stroke();
   for(const [y,t,c] of [[1437,'Ulug‘bek','#ffd966'],[2026,'Bugun','#5ee0a0']]){ctx.strokeStyle=c;ctx.lineWidth=1;ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(X(y),T);ctx.lineTo(X(y),B);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=c;ctx.textBaseline='top';ctx.fillText(t,X(y),T-2);ctx.beginPath();ctx.arc(X(y),Y(poleDist(y)),4,0,7);ctx.fill();}
   ctx.fillStyle='#8aa6bd';ctx.textAlign='left';ctx.fillText('Polaris–qutb orasidagi burchak (hisob, xususiy harakatsiz)',L+4,B-12);}
 });
 KX.ulugbek={atYear,poleDist,prec,toEcl,toEq,sg};
})();
