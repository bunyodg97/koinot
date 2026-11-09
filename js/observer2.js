(()=>{'use strict';
 const KX=window.KX,SC=KX?.scope,A=window.Astronomy,SD=window.KOINOT_SKY;if(!SC||!A||!SD)return;
 const {$,esc,fmt,hm,ymd,stamp,inputValue,parseInput,OFFSET}=KX,{prof,mag,tfov,nm,typeUz,compass,angDist,BYKEY,picker,RAD:_r}=SC,RAD=Math.PI/180;
 const BR=(window.KOINOT_BRIGHT||[]);
 const starName=s=>{let b=null,bd=.35;for(const x of BR){const d=angDist(s[0],s[1],x[1]*15,x[2]);if(d<bd){bd=d;b=x;}}return b?b[0]:(s[5]||'yulduz HIP '+s[4]);};
 const pa=(r1,d1,r2,d2)=>{const a=d1*RAD,b=d2*RAD,da=(r2-r1)*RAD;return(Math.atan2(Math.sin(da)*Math.cos(b),Math.cos(a)*Math.sin(b)-Math.sin(a)*Math.cos(b)*Math.cos(da))/RAD+360)%360;};
 const imgPA=p=>prof.img==='inv'?(p+180)%360:prof.img==='mir'?(360-p)%360:p;
 const IMGN={sky:'osmondagidek',inv:'teskari (Nyuton/Dobson)',mir:'ko‘zgu (diagonal)'};

 function findPath(o,hopMax,magLim){
  for(const R of [30,45,70]){
   const N=[{ra:o.ra,dec:o.dec,mag:o.mag,t:1}];
   for(const s of SD.stars){if(s[2]>magLim&&s[2]>3.0)continue;if(Math.abs(s[1]-o.dec)>R)continue;if(angDist(s[0],s[1],o.ra,o.dec)>R)continue;if(o.kind==='star'&&angDist(s[0],s[1],o.ra,o.dec)<.05)continue;N.push({ra:s[0],dec:s[1],mag:s[2],s});}
   const n=N.length,cost=new Float64Array(n).fill(1e9),prev=new Int32Array(n).fill(-1),done=new Uint8Array(n);
   for(let i=1;i<n;i++)if(N[i].mag<=3.0)cost[i]=.3*Math.max(0,N[i].mag-1.5);
   for(let it=0;it<n;it++){let u=-1,b=1e9;for(let i=0;i<n;i++)if(!done[i]&&cost[i]<b){b=cost[i];u=i;}if(u<0)break;done[u]=1;if(u===0)break;
    for(let v=0;v<n;v++){if(done[v]||v===u)continue;if(Math.abs(N[u].dec-N[v].dec)>hopMax)continue;const d=angDist(N[u].ra,N[u].dec,N[v].ra,N[v].dec);if(d>hopMax)continue;const c=b+1+.6*Math.max(0,(v===0?4.5:N[v].mag)-4.5)+.15*d/hopMax;if(c<cost[v]){cost[v]=c;prev[v]=u;}}}
   if(cost[0]<1e8){const p=[];for(let i=0;i>=0;i=prev[i])p.push(N[i]);return p.reverse();}
  }
  return null;
 }
 SC.addSub('hop','Yo‘l (star-hop)',body=>{
  const st=SC.hopSt=SC.hopSt||{fov:'f',mag:5.5};
  const opts=[['f',prof.finder.n+' ('+prof.finder.fov+'°)',prof.finder.fov],...prof.eps.map((e,i)=>['e'+i,e.n+' ('+fmt(tfov(e),2)+'°)',tfov(e)])];
  if(!opts.some(x=>x[0]===st.fov))st.fov='f';
  body.innerHTML=`<p class="lab-note">Yorqin yulduzdan boshlab, obyektga qadamma-qadam yo‘l: har qadam tanlangan asbobning ko‘rish maydoni ichida (≈70 %). Yo‘l avtomatik hisoblanadi — taklif sifatida qabul qiling.</p><div id="hpPick"></div><div class="lab-row ob-row"><label>Qadam asbobi <select id="hpF">${opts.map(x=>`<option value="${x[0]}"${x[0]===st.fov?' selected':''}>${esc(x[1])}</option>`).join('')}</select></label><label>Eng xira yulduz <select id="hpM">${[4.5,5,5.5,6].map(v=>`<option${v===st.mag?' selected':''}>${v}</option>`).join('')}</select>ᵐ</label><span class="ob-nt">Tasvir: ${IMGN[prof.img]} (Asbob bo‘limida o‘zgartiring)</span></div><div id="hpOut"></div><canvas id="hpC" class="ob-cv"></canvas>`;
  const out=$('#hpOut',body),cv=$('#hpC',body);
  const run=()=>{const o=BYKEY.get(SC.sel);if(!o){out.innerHTML='<p class="lab-note">Obyektni tanlang.</p>';cv.style.display='none';return;}
   const fv=opts.find(x=>x[0]===st.fov)[2],hop=fv*.7;let path=findPath(o,hop,st.mag);
   if(!path){out.innerHTML=`<p class="lab-note">Bu obyekt uchun ${fmt(hop,1)}° qadam bilan yo‘l topilmadi. Kattaroq ko‘rish maydonli asbobni (izlagich) yoki xiraroq yulduzlarni (6ᵐ) tanlang.</p>`;cv.style.display='none';return;}
   cv.style.display='';const steps=[];
   for(let i=0;i<path.length;i++){const p=path[i];if(i===0){steps.push(`<li><b>Boshlang‘ich:</b> ${esc(p.t?nm(o):starName(p.s))} (${fmt(p.mag,1)}ᵐ). Uni izlagichda markazga qo‘ying.</li>`);continue;}
    const q=path[i-1],d=angDist(q.ra,q.dec,p.ra,p.dec),dir=compass(imgPA(pa(q.ra,q.dec,p.ra,p.dec)));
    steps.push(p.t?`<li><b>${i}. Obyekt:</b> ${dir} tomonga ≈ ${fmt(d,1)}° (${fmt(d/fv*100,0)}% maydon) — <b>${esc(nm(o))}</b>.</li>`:`<li><b>${i}.</b> ${dir} tomonga ≈ ${fmt(d,1)}° → ${esc(starName(p.s))} (${fmt(p.mag,1)}ᵐ)</li>`);}
   out.innerHTML=`<div class="ob-sum"><b>${esc(nm(o))}</b> · ${path.length-1} qadam · umumiy masofa ≈ ${fmt(path.slice(1).reduce((s,p,i)=>s+angDist(path[i].ra,path[i].dec,p.ra,p.dec),0),1)}°</div><ol class="ob-steps">${steps.join('')}</ol><p class="lab-note">Yo‘nalishlar «${IMGN[prof.img]}» tasvir uchun berilgan. Yo‘nalish noto‘g‘ri chiqsa, Asbob bo‘limida tasvir turini tekshiring. Yo‘l yorqinligi 6ᵐ gacha bo‘lgan yulduzlar bo‘yicha tuzilgan; xira yulduzlar yo‘lni osonlashtirishi mumkin.</p>`;
   let x=0,y=0,z=0;for(const p of path){x+=Math.cos(p.dec*RAD)*Math.cos(p.ra*RAD);y+=Math.cos(p.dec*RAD)*Math.sin(p.ra*RAD);z+=Math.sin(p.dec*RAD);}
   const c={ra:(Math.atan2(y,x)/RAD+360)%360,dec:Math.atan2(z,Math.hypot(x,y))/RAD};let ext=0;for(const p of path)ext=Math.max(ext,angDist(p.ra,p.dec,c.ra,c.dec));
   const half=Math.max(hop*1.2,ext+hop*.8),W=Math.min(cv.parentElement.clientWidth||520,600);cv.style.height=W+'px';
   SC.chart(cv,c,Math.min(60,half),{h:W,sel:o.key,mag:st.mag,after:(ctx,P,S,w,h,k)=>{
    ctx.strokeStyle='#ffc65a';ctx.lineWidth=2;ctx.beginPath();path.forEach((p,i)=>{const q=P(p.ra,p.dec);if(!q)return;i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);});ctx.stroke();
    path.forEach((p,i)=>{const q=P(p.ra,p.dec);if(!q)return;ctx.fillStyle='#ffc65a';ctx.beginPath();ctx.arc(q[0],q[1],8*k,0,7);ctx.fill();ctx.fillStyle='#1a1200';ctx.font=`bold ${10*k}px system-ui`;ctx.textAlign='center';ctx.fillText(i===0?'S':String(i),q[0],q[1]+3.5*k);ctx.textAlign='left';});
    const t=P(o.ra,o.dec);if(t){ctx.strokeStyle='#5ee0a0';ctx.lineWidth=1.4;ctx.setLineDash([4,3]);ctx.beginPath();ctx.arc(t[0],t[1],Math.tan(fv/2*RAD)*S,0,7);ctx.stroke();ctx.setLineDash([]);}}});};
  picker($('#hpPick',body),o=>{SC.sel=o.key;run();},SC.sel);
  $('#hpF',body).onchange=e=>{st.fov=e.target.value;run();};$('#hpM',body).onchange=e=>{st.mag=+e.target.value;run();};
  run();
 });

 const PL=[['Mercury','Merkuriy',2440],['Venus','Venera',6052],['Mars','Mars',3396],['Jupiter','Yupiter',71492],['Saturn','Saturn',60268],['Uranus','Uran',25559],['Neptune','Neptun',24764]];
 const AU_KM=149597870.7;
 const pst=SC.plSt=SC.plSt||{t:null};
 function planetRows(date){
  const t=new A.AstroTime(date),obs=SC.observer();
  return PL.map(([b,u,R])=>{const g=A.GeoVector(b,t,true),d=g.Length(),eq=A.Equator(b,t,obs,true,true),h=A.Horizon(t,obs,eq.ra,eq.dec,'normal'),el=A.Elongation(b,t),il=A.Illumination(b,t);
   return {b,u,alt:h.altitude,az:h.azimuth,el:el.elongation,vis:el.visibility,diam:2*Math.atan(R/(d*AU_KM))/RAD*3600,ph:il.phase_fraction,mag:il.mag,tilt:b==='Saturn'?il.ring_tilt:null,d};});
 }
 SC.planetDiam=date=>{const r=planetRows(date||new Date());return Object.fromEntries(r.map(x=>[x.b,x.diam]));};
 const MOON=[['io','Io','#ffe08a'],['europa','Evropa','#cfe8ff'],['ganymede','Ganimed','#b8f5c0'],['callisto','Kallisto','#f5b3a6']];
 function jup(date){
  const t=new A.AstroTime(date),g=A.GeoVector('Jupiter',t,true),L=g.Length(),ra=Math.atan2(g.y,g.x),de=Math.asin(g.z/L);
  const E=[-Math.sin(ra),Math.cos(ra),0],N=[-Math.sin(de)*Math.cos(ra),-Math.sin(de)*Math.sin(ra),Math.cos(de)],Rj=71492/AU_KM,jm=A.JupiterMoons(t);
  return MOON.map(([k])=>{const v=jm[k];return {e:(v.x*E[0]+v.y*E[1]+v.z*E[2])/Rj,n:(v.x*N[0]+v.y*N[1]+v.z*N[2])/Rj};});
 }
 SC.addSub('planets','Sayyoralar',body=>{
  if(!pst.t)pst.t=new Date();
  body.innerHTML=`<p class="lab-note">Sayyoralarning joriy ko‘rinishi va Yupiter yo‘ldoshlari (Astronomy Engine bilan hisoblangan). Vaqt — O‘zbekiston (UTC+5).</p><div class="lab-row ob-row"><label>Vaqt <input type="datetime-local" id="plT" value="${inputValue(pst.t)}"></label><button id="plNow">Hozir</button><label>Shahar: <b>${esc(SC.city()[0])}</b></label></div><div id="plTab"></div><h4>Yupiter yo‘ldoshlari</h4><div class="lab-row ob-row"><span class="ob-nt">Tasvir: ${IMGN[prof.img]}</span></div><div class="ob-two"><canvas id="jvA" class="ob-cv2"></canvas><canvas id="jvB" class="ob-cv2"></canvas></div><p class="lab-note">Chapda — hozirgi holat, o‘ngda — keyingi 72 soat (qatorlar — yo‘ldoshlar, vertikal — vaqt). Yupiter diskining oldidan/orqasidan o‘tish, soya o‘tishi va Buyuk Qizil Dog‘ning vaqti bu yerda <b>yo‘q</b> — ular hisoblanmagan.</p>`;
  const draw=()=>{const rows=planetRows(pst.t),mx=SC.mlim?0:0;
   $('#plTab',body).innerHTML=`<div class="ob-tw"><table class="ob-t"><thead><tr><th>Sayyora</th><th>Balandlik / yo‘nalish</th><th>Elongatsiya</th><th>Burchak diametri</th><th>Faza</th><th>Yorqinlik</th><th>Masofa</th></tr></thead><tbody>${rows.map(r=>`<tr><td><b>${r.u}</b>${r.tilt!=null?'<small>halqa qiyaligi '+fmt(r.tilt,1)+'°</small>':''}</td><td>${r.alt>0?'<b>'+fmt(r.alt,0)+'°</b> · '+compass(r.az):'<span class="ob-dim">ufqdan past ('+fmt(r.alt,0)+'°)</span>'}</td><td>${fmt(r.el,0)}° ${r.vis==='morning'?'(ertalab)':'(kechqurun)'}</td><td>${fmt(r.diam,r.diam<10?1:0)}″</td><td>${fmt(r.ph*100,0)}%</td><td>${fmt(r.mag,1)}ᵐ</td><td>${fmt(r.d,2)} AU</td></tr>`).join('')}</tbody></table></div><p class="lab-note">Eng yaxshi ko‘rish: elongatsiya katta, balandlik ≥ 30°. Sayyorani yaxshi ko‘rish uchun foydali kattalashtirish ≈ ${fmt(Math.min(prof.D*2,300),0)}× gacha (seeing ruxsat bersa).</p>`;
   const W=Math.min(300,(body.clientWidth||600)/2-10);

   const a=$('#jvA',body),b=$('#jvB',body);let {ctx,w,h}=KX.hidpi(a,260);ctx.fillStyle='#02050b';ctx.fillRect(0,0,w,h);
   const sx=prof.img==='sky'?-1:1,sy=prof.img==='inv'?1:-1,cx=w/2,cy=h/2,sc=(w/2-14)/32,m=jup(pst.t);
   ctx.fillStyle='#e6c28a';ctx.beginPath();ctx.arc(cx,cy,sc,0,7);ctx.fill();
   m.forEach((q,i)=>{const x=cx+sx*q.e*sc,y=cy+sy*q.n*sc;ctx.fillStyle=MOON[i][2];ctx.beginPath();ctx.arc(x,y,3.2,0,7);ctx.fill();ctx.font='10px system-ui';ctx.fillText(MOON[i][1],x+5,y-5);});
   ctx.fillStyle='#6f93ad';ctx.font='11px system-ui';ctx.fillText(prof.img==='sky'?'← Sharq':'Sharq →',prof.img==='sky'?8:w-52,14);ctx.fillText('Masshtab: ±32 Yupiter radiusi',8,h-8);

   ({ctx,w,h}=KX.hidpi(b,260));ctx.fillStyle='#02050b';ctx.fillRect(0,0,w,h);const sc2=(w/2-6)/32,H=72,t0=pst.t.getTime();
   ctx.fillStyle='#e6c28a33';ctx.fillRect(cx-0+0*0,0,0,0);ctx.fillStyle='#e6c28a40';ctx.fillRect(w/2-sc2,0,2*sc2,h);
   for(let k=0;k<=3;k++){const y=k*24/H*(h-20)+10;ctx.strokeStyle='#17314a';ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();ctx.fillStyle='#6f93ad';ctx.font='10px system-ui';ctx.fillText(hm(new Date(t0+k*24*3600e3))+' · '+ymd(new Date(t0+k*24*3600e3)).slice(5),4,y-2);}
   MOON.forEach((mm,i)=>{ctx.strokeStyle=mm[2];ctx.lineWidth=1.5;ctx.beginPath();for(let s=0;s<=144;s++){const q=jup(new Date(t0+s*30*60000))[i],x=w/2+sx*q.e*sc2,y=10+s/144*(h-20);s?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();});
   MOON.forEach((mm,i)=>{ctx.fillStyle=mm[2];ctx.font='10px system-ui';ctx.fillText(mm[1],w-62,12+i*12);});
  };
  $('#plT',body).onchange=e=>{const d=parseInput(e.target.value);if(d){pst.t=d;draw();}};$('#plNow',body).onclick=()=>{pst.t=new Date();$('#plT',body).value=inputValue(pst.t);draw();};
  draw();
 });

 const CAMS=[['Maxsus',null,null,null],['APS-C kamera (24 MP)',3.9,6000,4000],['To‘liq kadr kamera (24 MP)',5.9,6000,4000],['ZWO ASI294 (rang)',4.63,4144,2822],['ZWO ASI533 (rang)',3.76,3008,3008],['ZWO ASI120 (sayyora)',3.75,1280,960],['Telefon kamerasi (okulyar orqali)',1.0,4000,3000]];
 SC.addSub('photo','Astrofoto',body=>{
  const c=prof.cam=prof.cam||{pix:3.76,w:3008,h:3008,bar:1,exp:30,dec:30,see:3,ci:4};
  body.innerHTML=`<p class="lab-note">Teleskopingiz va kamerangiz bilan nimaga erishish mumkin: kadr o‘lchami, piksel masshtabi, seeing bilan mosligi va kuzatuvsiz (motorsiz) maksimal ekspozitsiya.</p>
  <div class="lab-row ob-row"><label>Kamera <select id="phC">${CAMS.map((x,i)=>`<option value="${i}"${i===c.ci?' selected':''}>${x[0]}</option>`).join('')}</select></label><label>Piksel (µm) <input type="number" id="phP" value="${c.pix}" step="0.01" min="0.5" style="width:80px"></label><label>Kenglik (px) <input type="number" id="phW" value="${c.w}" style="width:80px"></label><label>Balandlik (px) <input type="number" id="phH" value="${c.h}" style="width:80px"></label><label>Barlow/reduktor × <input type="number" id="phB" value="${c.bar}" step="0.05" min="0.3" max="5" style="width:70px"></label></div>
  <div class="lab-row ob-row"><label>Ekspozitsiya (s) <input type="number" id="phE" value="${c.exp}" min="0.001" step="any" style="width:80px"></label><label>Obyekt og‘ishi (°) <input type="number" id="phD" value="${c.dec}" min="-90" max="90" style="width:70px"></label><label>Seeing (″) <input type="number" id="phS" value="${c.see}" step="0.1" min="0.5" style="width:70px"></label></div><div id="phObj"></div><div id="phOut" class="ob-sum"></div>`;
  const calc=()=>{const F=prof.F*c.bar,sc=206.265*c.pix/F,fw=sc*c.w/3600,fh=sc*c.h/3600,N=F/prof.D;
   const npf=(35*N+30*c.pix)/F,trail=15.04*c.exp*Math.cos(c.dec*RAD)/sc,sp=c.see/sc,ideal=c.pix*5;
   const o=BYKEY.get(SC.sel);let fit='';if(o&&o.size){const w=o.size/60,pct=Math.max(w/fw,w/fh)*100;fit=`<div><b>${esc(nm(o))}</b> (${fmt(o.size,1)}′): kadrning ≈ <b>${fmt(Math.min(pct,999),0)}%</b> ni egallaydi ${pct>90?'— sig‘maydi, mozaika yoki reduktor kerak':pct<8?'— juda kichik, uzunroq fokus kerak':'— yaxshi nisbat'}</div>`;}
   let pl='';try{const d=SC.planetDiam(new Date());pl=`<div>Hozirgi o‘lcham (piksellarda): Yupiter ≈ <b>${fmt(d.Jupiter/sc,0)}</b> px, Mars ≈ <b>${fmt(d.Mars/sc,0)}</b> px, Saturn ≈ <b>${fmt(d.Saturn/sc,0)}</b> px (halqasiz disk).</div>`;}catch(e){}
   $('#phOut',body).innerHTML=`<div>Samarali fokus: <b>${fmt(F,0)} mm</b> · f/<b>${fmt(N,1)}</b></div><div>Piksel masshtabi: <b>${fmt(sc,2)} ″/px</b></div><div>Kadr: <b>${fmt(fw,2)}° × ${fmt(fh,2)}°</b> (${fmt(fw*60,0)}′ × ${fmt(fh*60,0)}′)</div><div>Seeing ${c.see}″ → <b>${fmt(sp,1)} px</b> FWHM ${sp<1.5?'— kam namuna olish (undersampled): detal seeing\'dan ko‘p, yirik piksel':sp>4?'— ortiqcha namuna (oversampled): binning/reduktor foyda beradi':'— yaxshi (ideal 2–3 px)'}</div><div>Sayyora suratga olishda ideal f-nisbat ≈ f/<b>${fmt(ideal,0)}</b> (5 × piksel) — sizda f/${fmt(N,1)}</div><div>Kuzatuvsiz (motorsiz) maks. ekspozitsiya (NPF qoidasi): <b>${fmt(npf/Math.max(.05,Math.cos(c.dec*RAD)),npf<1?2:1)} s</b> · ${c.exp} s da yulduz izi ≈ <b>${fmt(trail,1)} px</b> ${trail>1?'(iz bor — motor yoki qisqaroq ekspozitsiya)':'(iz sezilmaydi)'}</div>${fit}${pl}<p class="lab-note">Barchasi standart formulalar: masshtab = 206,265·piksel/fokus; NPF = (35·f/son + 30·piksel)/fokus. Bu — taxminiy yo‘l-yo‘riq: montirovka aniqligi, atmosfera va optika sifati natijani o‘zgartiradi. Kamera parametrlari tipik qiymatlar, o‘z kamerangiz ma’lumotnomasi bilan tekshiring.</p>`;};
  const bind=(id,k,fn)=>$(id,body).onchange=e=>{c[k]=+e.target.value;if(fn)fn();SC.saveProf();calc();};
  bind('#phP','pix',()=>{c.ci=0;$('#phC',body).value=0;});bind('#phW','w');bind('#phH','h');bind('#phB','bar');bind('#phE','exp');bind('#phD','dec');bind('#phS','see');
  $('#phC',body).onchange=e=>{const x=CAMS[+e.target.value];c.ci=+e.target.value;if(x[1]){c.pix=x[1];c.w=x[2];c.h=x[3];}SC.saveProf();SC.go('photo');};
  picker($('#phObj',body),o=>{SC.sel=o.key;c.dec=Math.round(o.dec);$('#phD',body).value=c.dec;SC.saveProf();calc();},SC.sel);calc();
 });

 SC.open=(sub,key)=>{if(window.KoinotLab){window.KoinotLab.open('scope');setTimeout(()=>SC.go(sub||'plan',key),60);}};
})();
