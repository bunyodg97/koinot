(()=>{'use strict';
 const app=window.koinot,j=app?.journey;if(!j||!window.THREE)return;
 const T=THREE,g=j.groups[3],$=s=>document.querySelector(s),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 let seed=770713;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const gauss=()=>{let u=0;while(!u)u=rand();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*rand());};
 const tex=document.createElement('canvas');tex.width=tex.height=64;{const c=tex.getContext('2d'),gr=c.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.12,'rgba(255,255,255,1)');gr.addColorStop(.35,'rgba(255,255,255,.3)');gr.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=gr;c.fillRect(0,0,64,64);}
 const glow=new T.CanvasTexture(tex);

 for(const o of [...g.children])if(o.isPoints){g.remove(o);o.geometry.dispose();o.material.dispose();}
 const model=new T.Group();model.name='milkyway-model';g.add(model);
 function points(P,C,S,{size=.25,opacity=1,additive=true,color=null,order=0}={}){
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(P,3));if(C)geo.setAttribute('color',new T.Float32BufferAttribute(C,3));geo.setAttribute('sparkSize',new T.Float32BufferAttribute(S,1));
  const m=new T.PointsMaterial({size,map:glow,vertexColors:!!C,color:color??0xffffff,toneMapped:false,transparent:true,depthWrite:false,opacity,blending:additive?T.AdditiveBlending:T.NormalBlending});
  m.onBeforeCompile=sh=>{sh.vertexShader='attribute float sparkSize;\n'+sh.vertexShader.replace('gl_PointSize = size;','gl_PointSize = size * sparkSize;');};m.customProgramCacheKey=()=> 'koinot-mw-28';
  const o=new T.Points(geo,m);o.renderOrder=order;o.frustumCulled=false;model.add(o);return o;}

 const B=.26,BAR=-.47,BAR_R=8.7,R_MAX=27;
 const ARMS=[{n:'Scutum–Centaurus',phi:BAR,r:BAR_R,w:1},{n:'Perseus',phi:BAR+Math.PI,r:BAR_R,w:1},{n:'Sagittarius–Carina',phi:2.36,r:6.5,w:.55},{n:'Norma–tashqi',phi:2.36-Math.PI,r:6.5,w:.55}];
 for(const a of ARMS)a.uEnd=Math.log(R_MAX/a.r)/B;
 const armAt=(a,u)=>{const r=a.r*Math.exp(B*u),phi=a.phi-u;return {r,phi,x:r*Math.cos(phi),z:r*Math.sin(phi),tx:B*r*Math.cos(phi)+r*Math.sin(phi),tz:B*r*Math.sin(phi)-r*Math.cos(phi)};};
 const armSigma=r=>.4+.045*r;
 const pickArm=()=>{const t=rand()*(1+1+.55+.55);return t<1?ARMS[0]:t<2?ARMS[1]:t<2.55?ARMS[2]:ARMS[3];};
 const P=[],C=[],S=[];const push=(x,y,z,c,b,s)=>{P.push(x,y,z);C.push(c[0]*b,c[1]*b,c[2]*b);S.push(s);};
 const BLUE=[.62,.78,1],WHITE=[1,.96,.88],WARM=[1,.8,.55],OLD=[1,.74,.45];

 for(let i=0;i<38000;i++){const a=pickArm(),u=a.uEnd*Math.pow(rand(),.85),p=armAt(a,u),len=Math.hypot(p.tx,p.tz),nx=-p.tz/len,nz=p.tx/len,off=gauss()*armSigma(p.r);
  const y=gauss()*(.1+.02*Math.max(0,p.r-12)*0+.12*Math.exp(-p.r/9));const t=rand(),inner=p.r<10,c=t<(inner?.15:.5)?BLUE:t<.8?WHITE:WARM;push(p.x+nx*off,y,p.z+nz*off,c,(.35+rand()*.65)*(.55+.45*a.w)*(p.r>20?.8:1),.5+Math.pow(rand(),3)*2.3);}

 for(let i=0;i<15000;i++){const r=-Math.log(1-rand()*(1-Math.exp(-R_MAX/4.8)))*4.8,ph=rand()*Math.PI*2;push(r*Math.cos(ph),gauss()*(.16+.1*Math.exp(-r/8)),r*Math.sin(ph),r<8?OLD:WARM,.22+rand()*.28,.5+Math.pow(rand(),3)*1.4);}

 for(let i=0;i<3000;i++){const r=-Math.log(1-rand()*(1-Math.exp(-R_MAX/5.5)))*5.5,ph=rand()*Math.PI*2;push(r*Math.cos(ph),gauss()*.55,r*Math.sin(ph),WARM,.15+rand()*.2,.5+Math.pow(rand(),3)*1.2);}

 const cb=Math.cos(BAR),sb=Math.sin(BAR);
 for(let i=0;i<8000;i++){const u=(rand()*2-1),along=Math.sign(u)*Math.pow(Math.abs(u),1.15)*BAR_R*.98,perp=gauss()*(.7+.5*Math.abs(u)*.0),y=gauss()*(.25+.35*Math.exp(-Math.abs(along)/3));push(along*cb-perp*sb,y,along*sb+perp*cb,OLD,.4+rand()*.5,.5+Math.pow(rand(),3)*1.8);}

 for(let i=0;i<11000;i++){const along=gauss()*3.0,perp=gauss()*1.6,y=gauss()*1.15;push(along*cb-perp*sb,y,along*sb+perp*cb,OLD,.35+rand()*.65,.5+Math.pow(rand(),3)*2);}

 for(let i=0;i<1800;i++){push(gauss()*.45,gauss()*.35,gauss()*.45,[1,.92,.75],.5+rand()*.5,.6+Math.pow(rand(),2)*2.4);}

 for(let i=0;i<1600;i++){const r=1+Math.pow(rand(),1.7)*32,th=Math.acos(rand()*2-1),ph=rand()*Math.PI*2;push(r*Math.sin(th)*Math.cos(ph),r*Math.cos(th)*.8,r*Math.sin(th)*Math.sin(ph),WARM,.12+rand()*.2,.5+rand()*.8);}
 points(P,C,S,{size:.25});

 {const p=[],c=[],s=[];for(let i=0;i<900;i++){const a=pickArm(),u=a.uEnd*(.18+.8*rand()),q=armAt(a,u),len=Math.hypot(q.tx,q.tz),nx=-q.tz/len,nz=q.tx/len,off=gauss()*armSigma(q.r)*.6;p.push(q.x+nx*off,gauss()*.08,q.z+nz*off);const k=rand();c.push(1,.32+k*.2,.52+k*.2);s.push(1+rand()*2.2);}points(p,c,s,{size:.3,opacity:.85});}

 {const p=[],c=[],s=[];for(let i=0;i<2600;i++){const a=pickArm(),u=a.uEnd*Math.pow(rand(),.9),q=armAt(a,u),len=Math.hypot(q.tx,q.tz),off=gauss()*armSigma(q.r)*.8;p.push(q.x-q.tz/len*off,gauss()*.15,q.z+q.tx/len*off);c.push(.2,.34,.62);s.push(1);}for(let i=0;i<600;i++){const al=gauss()*3.2,pe=gauss()*1.7;p.push(al*cb-pe*sb,gauss()*.9,al*sb+pe*cb);c.push(.95,.68,.4);s.push(1.3);}points(p,c,s,{size:2.3,opacity:.13});}

 {const p=[],s=[];for(let i=0;i<2600;i++){const a=pickArm(),u=a.uEnd*(.02+.93*Math.pow(rand(),.9)),q=armAt(a,u),len=Math.hypot(q.tx,q.tz);let nx=-q.tz/len,nz=q.tx/len;if(nx*q.x+nz*q.z>0){nx=-nx;nz=-nz;}const off=armSigma(q.r)*(.55+.2*gauss());p.push(q.x+nx*off,gauss()*.07,q.z+nz*off);s.push(.8+rand()*1.1);}
  for(let i=0;i<1300;i++){const r=Math.sqrt(rand())*18,ph=rand()*Math.PI*2;p.push(r*Math.cos(ph),gauss()*.05,r*Math.sin(ph));s.push(.7+rand()*.9);}
  points(p,null,s,{size:2.2,opacity:.2,additive:false,color:0x1b0f08,order:5});}

 {const p=[],c=[],s=[];for(let i=0;i<160;i++){const r=1.5+Math.pow(rand(),1.8)*30,th=Math.acos(rand()*2-1),ph=rand()*Math.PI*2;p.push(r*Math.sin(th)*Math.cos(ph),r*Math.cos(th),r*Math.sin(th)*Math.sin(ph));c.push(1,.86,.55);s.push(2.2+rand()*1.4);}points(p,c,s,{size:.3,opacity:.9});}

 function cloudGalaxy(cx,cy,cz,R,n,tilt){const p=[],c=[],s=[];for(let i=0;i<n;i++){const x=gauss()*R*.55,z=gauss()*R*.35,y=gauss()*R*.12,lump=Math.sin(x*3)*Math.cos(z*4);if(lump<-.55)continue;const ct=Math.cos(tilt),st=Math.sin(tilt);p.push(cx+x*ct-z*st,cy+y,cz+x*st+z*ct);const t=rand();c.push(.7+.3*t,.82,1);s.push(.5+Math.pow(rand(),3)*1.6);}points(p,c,s,{size:.25,opacity:.85});}
 const LMC=[-17,-13,19],SMC=[-25,-16,10];cloudGalaxy(...LMC,2.6,2200,.5);cloudGalaxy(...SMC,1.5,1100,-.4);

 {const p=[],c=[],s=[],sp=[14,0,0];for(let i=0;i<500;i++){const t=(rand()*2-1),x=14+t*1.1+gauss()*.12,z=t*-2.1+gauss()*.2;p.push(x,gauss()*.06,z);const bl=rand()<.7;c.push(bl?.6:1,bl?.8:.5,bl?1:.7);s.push(.6+rand()*1.0);}points(p,c,s,{size:.25,opacity:.9});}
 const ring=new T.Mesh(new T.RingGeometry(.85,.95,48),new T.MeshBasicMaterial({color:0x73eaff,side:T.DoubleSide,transparent:true,depthWrite:false,opacity:.9}));ring.rotation.x=-Math.PI/2;ring.position.set(14,0,0);model.add(ring);
 const sgr=new T.Sprite(new T.SpriteMaterial({map:glow,color:0xfff4d0,toneMapped:false,depthWrite:false,transparent:true,blending:T.AdditiveBlending}));sgr.scale.set(1.6,1.6,1);model.add(sgr);

 const labelDefs=[];function lab(text,pos,cls='',grp=g,qc=3){const e=document.createElement('span');e.className='journey-label mw-label '+cls;e.textContent=text;e.hidden=true;app.host.append(e);labelDefs.push({e,p:new T.Vector3(...pos),g:grp,qc});}
 lab('Galaktik to‘sin',[BAR_R*.6*cb,1.6,BAR_R*.6*sb]);
 ARMS.forEach(a=>{const q=armAt(a,a.uEnd*.72);lab(a.n+' qo‘li',[q.x,.8,q.z]);});
 lab('Katta Magellan buluti (masofa siqilgan)',[LMC[0],LMC[1]+3,LMC[2]]);lab('Kichik Magellan buluti',[SMC[0],SMC[1]+2.2,SMC[2]]);

 let anim=null;const info=$('#cosmicInfo');
 const VIEWS=[['Qiya',.55],['Tepadan',1.3],['Yondan',.02]];let vi=0;
 const views=document.createElement('button');views.id='mwViews';views.hidden=true;views.textContent='◔ Ko‘rinish: Qiya';views.title='Tepadan / Yondan / Qiya';
 const compactBar=document.querySelector('.journey-compact');compactBar.insertBefore(views,document.querySelector('#journeyClean'));
 views.onclick=()=>{vi=(vi+1)%VIEWS.length;anim={elevation:VIEWS[vi][1]};views.textContent='◔ Ko‘rinish: '+VIEWS[vi][0];};
 function extra(){if(!info||info.querySelector('#mwExtra'))return;const d=document.createElement('div');d.id='mwExtra';d.innerHTML=`<h3>Model haqida</h3><p>To‘sinli spiral: 2 yirik (Scutum–Centaurus, Perseus) va 2 kichik qo‘l, Orion shoxchasi, chang yo‘llari, bo‘rtma, sharsimon to‘dalar. Diametri ≈ 100 000 y.y., qalinligi ≈ 1 000 y.y., Quyosh markazdan ≈ 26 000 y.y.</p><p class="mw-warn">Bu ilmiy modelga asoslangan badiiy tasvir, fotosurat emas: galaktikani hech kim tashqaridan suratga olmagan. Qo‘llar soni va shakli hanuz munozarali; ≈ 100 000 nuqta ≈ 100–400 mlrd yulduzni ramziy ifodalaydi. Magellan bulutlari aslida ≈ 160 000–200 000 y.y. uzoqda — bu yerda yaqinlashtirib ko‘rsatilgan.</p>`;info.append(d);}
 app.canvas.addEventListener('pointerdown',()=>{anim=null;});

 const AN=[[0,1.3e4],[1,4.5e9],[2,4.73e15],[3,4.73e17],[4,4.73e19],[5,2.84e21],[6,1.42e22],[7,4.4e23]];
 const LY=9.4607e12,AU=1.495978707e8,CKM=299792.458;
 function distKm(q){const i=Math.min(6,Math.floor(q)),t=q-i,a=Math.log(AN[i][1]),b=Math.log(AN[i+1][1]);return Math.exp(a+(b-a)*t);}
 const sup='⁰¹²³⁴⁵⁶⁷⁸⁹';const supNum=n=>String(n).split('').map(ch=>ch==='-'?'⁻':sup[+ch]).join('');
 const group=n=>Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,' ');
 const dec=(n,d=2)=>n.toFixed(d).replace('.',',');const num=v=>v>=100?group(v):dec(v,v<10?2:1);
 function kmText(d){if(d<1e12)return group(d)+' km';const e=Math.floor(Math.log10(d));return dec(d/Math.pow(10,e))+' × 10'+supNum(e)+' km';}
 function altText(d){const au=d/AU,ly=d/LY;if(ly<.01){const e=Math.floor(Math.log10(ly)),sy=dec(ly/Math.pow(10,e),1)+' × 10'+supNum(e)+' yorug‘lik yili';return (au<1?'':dec(au,au<10?2:1)+' AU = ')+sy;}if(ly<1e3)return num(ly)+' yorug‘lik yili';if(ly<1e6)return group(ly)+' yorug‘lik yili';if(ly<1e9)return dec(ly/1e6,1)+' mln yorug‘lik yili';return dec(ly/1e9,1)+' mlrd yorug‘lik yili';}
 function lightText(d){const s=d/CKM;if(s<1.5)return dec(s)+' soniya';if(s<60)return Math.round(s)+' soniya';if(s<3600)return Math.floor(s/60)+' daqiqa '+Math.round(s%60)+' soniya';if(s<86400)return Math.floor(s/3600)+' soat '+Math.round(s%3600/60)+' daqiqa';const dd=s/86400;if(dd<365.25)return Math.round(dd)+' kun';const y=dd/365.25;if(y<1e3)return num(y)+' yil';if(y<1e6)return group(y)+' yil';if(y<1e9)return dec(y/1e6,1)+' mln yil';return dec(y/1e9,1)+' mlrd yil';}
 const LM=[[3.844e5,'Oygacha ≈ 384 400 km'],[AU,'Quyoshgacha ≈ 149,6 mln km (1 AU)'],[7.78e8,'Yupitergacha ≈ 778 mln km'],[4.5e9,'Neptun orbitasi ≈ 4,5 mlrd km'],[2.59e10,'Voyager 1 ≈ 173 AU (taxminiy)'],[4.0e13,'Proxima Centauri ≈ 4,24 y.y.'],[8.1e13,'Sirius ≈ 8,6 y.y.'],[1.27e16,'Orion tumanligi ≈ 1 340 y.y.'],[2.46e17,'Galaktika markazi ≈ 26 000 y.y.'],[1.5e18,'Magellan bulutlari ≈ 160 000 y.y.'],[2.37e19,'Andromeda ≈ 2,5 mln y.y.'],[5.1e20,'Virgo klasteri ≈ 54 mln y.y.'],[4.4e23,'Kuzatiladigan koinot chekkasi ≈ 46,5 mlrd y.y.']];
 const box=document.createElement('div');box.id='journeyDistance';box.hidden=true;let userHidden=false;try{userHidden=localStorage.getItem('koinot-distance')==='0';}catch(e){}box.innerHTML='<small>YERDAN MASOFA · MASSHTAB KO‘RSATKICHI</small><b id="jdKm"></b><span id="jdAlt"></span><span id="jdLight"></span><em id="jdLm"></em><button id="jdClose" aria-label="Yashirish" title="Yashirish">×</button>';app.host.append(box);
 const ref={km:$('#jdKm'),alt:$('#jdAlt'),light:$('#jdLight'),lm:$('#jdLm')};
 const dBtn=document.createElement('button');dBtn.id='distToggle';dBtn.title='Yerdan masofa ko‘rsatkichini yoqish / o‘chirish';const vs=document.querySelector('#visualStyle');if(vs)vs.after(dBtn);else{const cl=document.querySelector('#journeyClean');cl?.before(dBtn);}
 function syncBtn(){dBtn.textContent=userHidden?'📏 Masofa: o‘chiq':'📏 Masofa: yoqiq';dBtn.setAttribute('aria-pressed',String(!userHidden));dBtn.classList.toggle('on',!userHidden);}
 function setShown(v){userHidden=!v;try{localStorage.setItem('koinot-distance',v?'1':'0');}catch(e){}box.classList.toggle('user-off',userHidden);syncBtn();}
 dBtn.onclick=()=>setShown(userHidden);
 box.classList.toggle('user-off',userHidden);syncBtn();$('#jdClose').onclick=()=>setShown(false);
 function updateReadout(){const q=j.q,d=distKm(q);ref.km.textContent=kmText(d);ref.alt.textContent=altText(d)?'= '+altText(d):'';
  if(q<6.15)ref.light.textContent='Yorug‘lik shu masofani ≈ '+lightText(d)+' ichida bosadi';else if(q>6.7)ref.light.textContent='Kuzatiladigan koinot radiusi (kengayish hisobga olingan): ≈ 46,5 mlrd y.y.';else ref.light.textContent='';
  let best=null,br=1.7;for(const [v,t] of LM){const r=Math.max(v/d,d/v);if(r<br){br=r;best=t;}}ref.lm.textContent=best?'↳ '+best:'';}
 function updateLabels(){const occ=[];for(const l of labelDefs){const show=Math.abs(j.q-l.qc)<.4&&l.g.visible;if(!show){l.e.hidden=true;continue;}const v=l.g.localToWorld(l.p.clone()).project(j.camera);const px=(v.x+1)*.5*app.host.clientWidth,py=(1-v.y)*.5*app.host.clientHeight;let hide=Math.abs(v.x)>.95||Math.abs(v.y)>.9||v.z>1;if(!hide&&occ.some(o=>Math.abs(o.x-px)<130&&Math.abs(o.y-py)<22))hide=true;l.e.hidden=hide;if(!hide){occ.push({x:px,y:py});l.e.style.left=px+'px';l.e.style.top=py+'px';}}}
 const oldFrame=j.frame.bind(j),oldStop=j.stop.bind(j);
 j.frame=function(dt){oldFrame(dt);if(j.detail?.active)return;box.hidden=false;updateReadout();const k=Math.round(j.q);views.hidden=k!==3;if(k===3)extra();if(anim){app.elevation+=(anim.elevation-app.elevation)*(1-Math.exp(-dt*5));if(Math.abs(anim.elevation-app.elevation)<.004)anim=null;}ring.scale.setScalar(1+.18*Math.sin(performance.now()/350));sgr.visible=true;updateLabels();};
 j.stop=function(...a){oldStop(...a);box.hidden=true;views.hidden=true;labelDefs.forEach(l=>l.e.hidden=true);};
 j.mw={setShown,isShown:()=>!userHidden,model,distKm,kmText,altText,lightText,ARMS,armAt};
 const heading=document.querySelector('.journey-heading span');if(heading)heading.textContent='KOSMIK ATLAS · 2.35';
})();
