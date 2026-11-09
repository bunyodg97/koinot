(()=>{'use strict';
 const app=window.koinot,KX=window.KX=window.KX||{},T=window.THREE;if(!app||!T)return;
 const GAL=window.KOINOT_GAL||[],EXO=window.KOINOT_EXO||[];if(!GAL.length)return;
 const $=(s,r=document)=>r.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const fmt=(x,d=1)=>Number(x).toLocaleString('en-US',{maximumFractionDigits:d}).replace(/,/g,' ');
 const KIND=()=>KX.prov?.KIND||{m:['O‘lchangan','#5ee0a0'],h:['Hisoblangan','#58b8ff'],t:['Taxminiy','#ffc65a'],s:['Simulyatsiya','#c58cff']};
 const chip=k=>`<span class="prov-chip" style="--pc:${KIND()[k][1]}">${KIND()[k][0]}</span>`;
 const D2R=Math.PI/180,AU_RSUN=.00465047;
 const TYPE={Sp:'Spiral',El:'Elliptik',Le:'Linzasimon',Ir:'Tartibsiz',Ri:'Halqasimon',Mg:'Qo‘shilayotgan'};
 const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
 const rng=seed=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};

 const root=document.createElement('div');root.id='galAtlas';root.hidden=true;
 root.innerHTML=`<header><b>🌀 Atlas</b><nav id="gaModes"><button data-m="gal">Galaktikalar</button><button data-m="map">Xarita</button><button data-m="exo">Ekzosayyora tizimlari</button></nav><button id="gaClose" aria-label="Yopish">✕</button></header>
 <aside id="gaList"></aside><main id="gaView"><canvas id="gaCanvas"></canvas><div id="gaLabels"></div><div id="gaHud"></div><div id="gaTools"></div></main><section id="gaInfo"></section>`;
 document.body.append(root);
 const list=$('#gaList',root),info=$('#gaInfo',root),canvas=$('#gaCanvas',root),labels=$('#gaLabels',root),hud=$('#gaHud',root),tools=$('#gaTools',root);

 let R=null,scene=null,cam=null,mode='gal',open=false,raf=0,last=0;
 const cs={th:.4,ph:1.25,dist:40,tgt:new T.Vector3(),dTh:0,tTgt:new T.Vector3(),tDist:40,auto:true,min:2,max:400};
 function init(){
  if(R)return true;
  try{R=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});}catch(e){console.warn(e);return false;}
  R.setClearColor(0x02040a,1);cam=new T.PerspectiveCamera(50,1,.05,5000);scene=new T.Scene();
  const ro=new ResizeObserver(resize);ro.observe($('#gaView',root));return true;
 }
 function resize(){if(!R)return;const w=Math.max(10,canvas.parentElement.clientWidth),h=Math.max(10,canvas.parentElement.clientHeight);R.setPixelRatio(app.quality==='low'?1:Math.min(devicePixelRatio,2));R.setSize(w,h,false);canvas.style.width=w+'px';canvas.style.height=h+'px';cam.aspect=w/h;cam.updateProjectionMatrix();}
 function placeCam(){const sp=Math.sin(cs.ph);cam.position.set(cs.tgt.x+cs.dist*sp*Math.sin(cs.th),cs.tgt.y+cs.dist*Math.cos(cs.ph),cs.tgt.z+cs.dist*sp*Math.cos(cs.th));cam.lookAt(cs.tgt);}

 const ptr=new Map();let down=null,pinch0=0;
 canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);ptr.set(e.pointerId,[e.clientX,e.clientY]);down={x:e.clientX,y:e.clientY,t:performance.now(),moved:0};cs.auto=false;if(ptr.size===2){const [a,b]=[...ptr.values()];pinch0=Math.hypot(a[0]-b[0],a[1]-b[1]);}});
 canvas.addEventListener('pointermove',e=>{const p=ptr.get(e.pointerId);if(!p)return;const dx=e.clientX-p[0],dy=e.clientY-p[1];p[0]=e.clientX;p[1]=e.clientY;
  if(ptr.size===2){const [a,b]=[...ptr.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinch0)cs.tDist=clampD(cs.tDist*pinch0/d);pinch0=d;if(down)down.moved+=99;return;}
  if(down)down.moved+=Math.abs(dx)+Math.abs(dy);cs.th-=dx*.006;cs.ph=Math.min(3.05,Math.max(.09,cs.ph-dy*.006));});
 const up=e=>{ptr.delete(e.pointerId);pinch0=0;if(down&&e.type==='pointerup'&&down.moved<6&&performance.now()-down.t<500)pick(e.clientX,e.clientY);if(!ptr.size)down=null;};
 canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
 const clampD=d=>Math.min(cs.max,Math.max(cs.min,d));
 canvas.addEventListener('wheel',e=>{e.preventDefault();cs.tDist=clampD(cs.tDist*Math.exp(e.deltaY*.0012));},{passive:false});

 const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
 const WARM=[1,.78,.5],COOL=[.62,.78,1],HII=[1,.42,.62];
 const glow=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.15,'rgba(255,255,255,.9)');g.addColorStop(.4,'rgba(255,255,255,.25)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new T.CanvasTexture(c);})();

 const NPT=()=>app.quality==='low'?14000:app.quality==='high'?60000:30000;
 function genGalaxy(g){
  const m=g[11],rnd=rng(hash(g[0])),N=NPT(),P=[],C=[],S=[],Rr=10;
  const gs=()=>{let u=0;while(!u)u=rnd();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*rnd());};
  const hue=m.hue??.4,base=mix(WARM,COOL,hue);
  const push=(x,y,z,col,br,sz)=>{P.push(x,y,z);C.push(col[0]*br,col[1]*br,col[2]*br);S.push(sz);};
  const lane=m.dust;
  const addBulge=(n,rb,flat=.7)=>{for(let i=0;i<n;i++){const r=rb*Math.pow(rnd(),1.6)*(.4+Math.abs(gs())*.6),a=rnd()*6.283,b=Math.acos(2*rnd()-1);let x=r*Math.sin(b)*Math.cos(a),y=r*Math.sin(b)*Math.sin(a),z=r*Math.cos(b)*flat;if(lane&&Math.abs(z)<.14&&Math.hypot(x,y)>1.2&&rnd()<.9)continue;push(x,y,z,mix(WARM,[1,.9,.75],rnd()*.5),.55+rnd()*.5,1);}};
  const disk=(n,arms,tight,bar,rd,starburst)=>{
   const turns=.35/Math.max(.08,tight),barL=bar*Rr*.55;
   for(let i=0;i<n;i++){
    let r=-Math.log(1-rnd()*.985)*rd*Rr;if(r>Rr)r=Rr*rnd();
    let th,inArm=arms>0&&rnd()<.72;
    if(inArm){const k=Math.floor(rnd()*arms);th=k*2*Math.PI/arms+turns*2*Math.PI*(r/Rr)+gs()*(.28+.12*(r/Rr));if(bar>0&&r<barL){th=(Math.round(th/Math.PI))*Math.PI+gs()*.08;}}
    else th=rnd()*6.283;
    let x=r*Math.cos(th),y=r*Math.sin(th),z=gs()*(m.k==='le'?.3:.12)*(.5+.5*(1-r/Rr));
    if(lane&&Math.abs(z)<.16&&r>1.2&&rnd()<.85)continue;
    const young=inArm&&r>Rr*.12;let col=young?mix(base,COOL,.55):mix(base,WARM,.4*(1-r/Rr));let br=young?.7+rnd()*.8:.35+rnd()*.5;
    if(young&&rnd()<(starburst?.07:.03)){col=HII;br=1.3;}
    push(x,y,z,col,br,young?1.2:1);
   }
   if(bar>0)for(let i=0;i<n*.12;i++){const u=gs()*barL*.55,x=u,y=gs()*barL*.16,z=gs()*.25;push(x,y,z,mix(WARM,base,.4),.22+rnd()*.25,1);}
  };
  switch(m.k){
   case 'sp':{addBulge(N*(.08+m.bulge*.5),Rr*(.12+m.bulge*.35));disk(N*(.82-m.bulge*.3),m.a,m.tight,m.bar||0,.3,m.star);break;}
   case 'le':{addBulge(N*(.25+m.bulge*.4),Rr*(.2+m.bulge*.3),.75);disk(N*.5,0,.2,0,.3,0);break;}
   case 'el':{const e=m.e??.15;for(let i=0;i<N;i++){const r=Rr*.22*Math.pow(-Math.log(1-rnd()*.995),1.9)*.35;if(r>Rr)continue;const a=rnd()*6.283,b=Math.acos(2*rnd()-1);push(r*Math.sin(b)*Math.cos(a),r*Math.sin(b)*Math.sin(a)*(1-e),r*Math.cos(b)*(1-e*.7),mix(WARM,[1,.93,.8],rnd()*.4),.3+rnd()*.6,1);}
     for(let i=0;i<N*.01;i++){const r=Rr*(.3+rnd()*.6),a=rnd()*6.283,b=Math.acos(2*rnd()-1);push(r*Math.sin(b)*Math.cos(a),r*Math.sin(b)*Math.sin(a),r*Math.cos(b),[1,.95,.85],1.1,1.4);}break;}
   case 'ir':{const cl=[];for(let i=0;i<8;i++)cl.push([gs()*Rr*.28,gs()*Rr*.18,gs()*.3,.5+rnd()*1.2]);const barL=(m.bar||0)*Rr*.5;
     for(let i=0;i<N*.9;i++){const c=cl[Math.floor(rnd()*cl.length)];let x=c[0]+gs()*c[3]*Rr*.1,y=c[1]+gs()*c[3]*Rr*.1,z=gs()*.35;if(rnd()<.35){x=gs()*barL*.7;y=gs()*barL*.2;}const young=rnd()<.45;push(x,y,z,young?mix(base,COOL,.6):mix(base,WARM,.5),young?.6+rnd()*.8:.3+rnd()*.4,1);if(rnd()<(m.star?.05:.02))push(x,y,z,HII,1.3,1.4);}break;}
   case 'ri':{addBulge(N*(m.hoag?.3:.15+m.bulge*.2),Rr*(m.hoag?.18:.12+m.bulge*.2));const rr=m.hoag?Rr*.7:Rr*.55;for(let i=0;i<N*.6;i++){const a=rnd()*6.283,r=rr+gs()*Rr*.06;const young=true;push(r*Math.cos(a),r*Math.sin(a),gs()*.2,mix(base,COOL,.7),.6+rnd()*.8,1.2);if(rnd()<.03)push(r*Math.cos(a),r*Math.sin(a),gs()*.2,HII,1.3,1.4);}
     if(!m.hoag)for(let i=0;i<N*.1;i++){const a=rnd()*6.283,r=rnd()*rr;push(r*Math.cos(a),r*Math.sin(a),gs()*.2,mix(WARM,base,.5),.3,1);}break;}
   case 'mg':{const one=(ox,oy,oz,rot,tilt,n)=>{const q=new T.Quaternion().setFromEuler(new T.Euler(tilt,0,rot)),v=new T.Vector3();for(let i=0;i<n;i++){const r=-Math.log(1-rnd()*.98)*Rr*.2,th=rnd()*6.283*(rnd()<.6?1:1)+r*.5;v.set(r*Math.cos(th),r*Math.sin(th),gs()*.2).applyQuaternion(q);const young=rnd()<.5;push(v.x+ox,v.y+oy,v.z+oz,young?mix(base,COOL,.7):mix(WARM,base,.4),young?1:.45,1);if(rnd()<.03)push(v.x+ox,v.y+oy,v.z+oz,HII,1.3,1.4);}};
     one(-Rr*.18,-Rr*.05,0,.4,.6,N*.3);one(Rr*.15,Rr*.08,.5,-.8,1.1,N*.3);
     for(const s of [-1,1])for(let i=0;i<N*.2;i++){const t=rnd(),a=s*(.4+t*2.6),r=Rr*(.25+t*.7);push(s*Rr*.15+r*Math.cos(a)*s*.9+gs()*Rr*.05*(.4+t),s*Rr*.05+r*Math.sin(a)*.6+gs()*Rr*.05*(.4+t),gs()*.3*t,mix(base,COOL,.5),(.12+rnd()*.25)*(1.2-t),1);}break;}
  }

  for(let i=0;i<N*.03;i++){const r=Rr*(.2+rnd()*.9),a=rnd()*6.283,b=Math.acos(2*rnd()-1);push(r*Math.sin(b)*Math.cos(a),r*Math.sin(b)*Math.sin(a),r*Math.cos(b),WARM,.15+rnd()*.2,1);}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(P,3));geo.setAttribute('color',new T.Float32BufferAttribute(C,3));
  const mat=new T.PointsMaterial({size:.2,map:glow,vertexColors:true,transparent:true,depthWrite:false,blending:T.AdditiveBlending,opacity:app.quality==='low'?.55:.4,sizeAttenuation:true});
  const pts=new T.Points(geo,mat);
  const incl=new T.Group();incl.add(pts);incl.rotation.x=-g[8]*D2R;const pa=new T.Group();pa.add(incl);pa.rotation.z=g[9]*D2R;

  const sp=new T.Sprite(new T.SpriteMaterial({map:glow,color:new T.Color(...mix(WARM,base,.3)),transparent:true,opacity:.55,blending:T.AdditiveBlending,depthWrite:false}));sp.scale.setScalar(m.k==='el'?7:4.5);
  const grp=new T.Group();grp.add(pa,sp);grp.userData.pts=pts;return grp;
 }

 const st={gi:3,ei:0,pi:-1,real:true,speed:1,days:0,sys:null,hover:-1,mapSel:3,mapObjs:[]};
 let cur=null;
 function clearScene(){while(scene.children.length){const o=scene.children.pop();o.traverse(c=>{c.geometry?.dispose();if(c.material){c.material.map&&c.material!==glow&&c.material.map!==glow&&c.material.map.dispose?.();c.material.dispose?.();}});}cur=null;labels.innerHTML='';st.sys=null;st.mapObjs=[];}

 const LY_MLY=1e6;
 function showGal(i,instant){
  st.gi=i;clearScene();const g=GAL[i];cur=genGalaxy(g);scene.add(cur);
  cs.tgt.set(0,0,0);cs.tTgt.set(0,0,0);cs.th=0;cs.ph=Math.PI/2-.0001+0;cs.ph=Math.PI/2;cs.tDist=34;cs.dist=instant?34:90;cs.min=3;cs.max=120;cs.auto=true;

  cs.th=0;cs.ph=Math.PI/2;
  renderListSel();galInfo(g);if(KX.net)KX.net.galPhoto(g[0]).then(h=>{if(h&&st.gi===i&&mode==='gal'){const f=document.createElement('div');f.innerHTML=h;info.prepend(f);}});tools.innerHTML=`<button id="gaView0">↺ Yerdan ko‘rinishi</button><button id="gaMapGo">🗺 Xaritada ko‘rsat</button>`;
  $('#gaView0',root).onclick=()=>{cs.th=0;cs.ph=Math.PI/2;cs.tDist=34;cs.auto=true;};
  $('#gaMapGo',root).onclick=()=>{st.mapSel=i;setMode('map');};
  hud.innerHTML=`<span>Sudrash — aylantirish · G‘ildirak / ikki barmoq — yaqinlashtirish</span>`;
 }
 function galInfo(g){
  const d=g[6],dia=g[7],ang=2*Math.atan(dia/1000/2/d)/D2R,ratio=dia/100;
  const T0=TYPE[g[2]]||g[2],age=d>=1?`${fmt(d,d<10?2:0)} million yil`:`${fmt(d*1e6,0)} yil`;
  info.innerHTML=`<h2>${esc(g[1])}</h2><p class="ga-sub">${esc(T0)} · ${esc(g[3])}</p>
  <div class="ga-chips">${chip('m')}<span>joylashuv va tur</span> ${chip('t')}<span>masofa, o‘lcham</span> ${chip('s')}<span>3D ko‘rinish</span></div>
  <div class="ga-facts"><div><span>Masofa</span><b>${d>=1?fmt(d,d<10?2:0)+' mln':fmt(d*1000,0)+' ming'} y.y.</b></div><div><span>Diametr</span><b>≈ ${fmt(dia,0)} ming y.y.</b></div><div><span>Somon Yo‘liga nisbatan</span><b>${fmt(ratio,ratio<1?2:1)}×</b></div><div><span>Osmondagi burchak o‘lchami</span><b>≈ ${ang<1?fmt(ang*60,0)+'′':fmt(ang,1)+'°'} ${chip('h')}</b></div><div><span>Ko‘rinayotgan nur</span><b>${age} oldin chiqqan</b></div>${g[4]!=null?`<div><span>Koordinata (RA / Dec)</span><b>${fmt(g[4],2)}° / ${fmt(g[5],2)}°</b></div>`:''}</div>
  <p class="ga-note">${esc(g[10])}</p>
  <p class="ga-warn"><b>Eslatma:</b> 3D ko‘rinish — tur, qiyalik va yo‘nalish bo‘yicha <u>soddalashtirilgan model</u>: yulduzlar soni va yelkanlarning aniq shakli real emas. Chang va gaz to‘liq modellanmagan. Masofa/o‘lcham qiymatlari katalogdan yaxlitlab kiritilgan (manbalarga qarang) — turli manbalarda 5–30 % farq qiladi.</p>`;
 }

 function mapPos(g){const ra=g[4]*D2R,de=g[5]*D2R,r=2.5+(Math.log10(g[6])+1)*4.2;return new T.Vector3(r*Math.cos(de)*Math.cos(ra),r*Math.sin(de),-r*Math.cos(de)*Math.sin(ra));}
 function showMap(){
  clearScene();
  for(const [mly,txt] of [[.1,'100 ming'],[1,'1 mln'],[10,'10 mln'],[100,'100 mln'],[1000,'1 mlrd']]){const r=2.5+(Math.log10(mly)+1)*4.2,pts=[];for(let k=0;k<=96;k++){const a=k/96*Math.PI*2;pts.push(new T.Vector3(r*Math.cos(a),0,r*Math.sin(a)));}scene.add(new T.Line(new T.BufferGeometry().setFromPoints(pts),new T.LineBasicMaterial({color:0x1f4260,transparent:true,opacity:.7})));
   const l=document.createElement('div');l.className='ga-lab ga-ring';l.textContent=txt+' y.y.';l._p=new T.Vector3(r,0,0);labels.append(l);st.mapObjs.push({el:l,p:l._p,ring:true});}
  const earth=new T.Sprite(new T.SpriteMaterial({map:glow,color:0x66ddff,blending:T.AdditiveBlending,depthWrite:false}));earth.scale.setScalar(1.6);scene.add(earth);
  const e=document.createElement('div');e.className='ga-lab ga-me';e.textContent='Siz shu yerdasiz';e._p=new T.Vector3(0,.7,0);labels.append(e);st.mapObjs.push({el:e,p:e._p,me:true});
  GAL.forEach((g,i)=>{if(g[4]==null)return;const p=mapPos(g),col={Sp:0x7fb4ff,El:0xffc07a,Le:0xffd9a0,Ir:0xa8d8ff,Ri:0xff9ad0,Mg:0xc58cff}[g[2]]||0xffffff;
   const s=new T.Sprite(new T.SpriteMaterial({map:glow,color:col,blending:T.AdditiveBlending,depthWrite:false,transparent:true}));s.position.copy(p);s.scale.setScalar(.9+Math.min(2.2,Math.log10(g[7])*.5));s.userData.gi=i;scene.add(s);
   const l=document.createElement('button');l.className='ga-lab';l.textContent=g[1].replace(/ \(.*$/,'');l.onclick=()=>{st.mapSel=i;mapFocus(i);};labels.append(l);st.mapObjs.push({el:l,p,gi:i,sprite:s});});
  cs.tgt.set(0,0,0);cs.tTgt.set(0,0,0);cs.th=.6;cs.ph=1.15;cs.tDist=44;cs.dist=70;cs.min=4;cs.max=140;cs.auto=true;
  tools.innerHTML=`<button id="gaOpen3d">🌀 3D modelni ochish</button>`;$('#gaOpen3d',root).onclick=()=>{setMode('gal',st.mapSel);};
  hud.innerHTML=`<span>Radial masofa — logarifmik (har halqa ≈ 10× uzoqroq). Yo‘nalishlar haqiqiy (osmon koordinatalari).</span>`;
  renderListSel();mapFocus(st.mapSel);
 }
 function mapFocus(i){st.mapSel=i;const g=GAL[i];if(g[4]!=null){cs.tTgt.copy(mapPos(g)).multiplyScalar(.6);cs.auto=false;}galInfo(g);renderListSel();}

 const bb=T0=>{
  const t=Math.min(40000,Math.max(1000,T0))/100;let r,g,b;
  r=t<=66?255:329.698727446*Math.pow(t-60,-.1332047592);g=t<=66?99.4708025861*Math.log(t)-161.1195681661:288.1221695283*Math.pow(t-60,-.0755148492);b=t>=66?255:t<=19?0:138.5177312231*Math.log(t-10)-305.0447927307;
  const c=v=>Math.max(0,Math.min(255,v))/255;return new T.Color(c(r),c(g),c(b));};
 const cls=r=>r<1.25?['Yer o‘lchamli','#c9a57c']:r<2?['Super-Yer','#8fb8a4']:r<6?['Mini-Neptun','#6fa4dc']:['Gaz gigant','#dcb480'];
 function ptex(c,seed,gas){const cv=document.createElement('canvas');cv.width=256;cv.height=128;const x=cv.getContext('2d'),r=rng(seed);x.fillStyle=c;x.fillRect(0,0,256,128);
  if(gas){for(let y=0;y<128;y+=3){x.fillStyle=`rgba(${r()<.5?'255,255,255':'0,0,0'},${.05+r()*.14})`;x.fillRect(0,y,256,2+r()*6);}}
  else for(let i=0;i<90;i++){x.fillStyle=`rgba(${r()<.5?'255,255,255':'0,0,0'},${.04+r()*.1})`;x.beginPath();x.arc(r()*256,r()*128,3+r()*16,0,7);x.fill();}
  return new T.CanvasTexture(cv);}
 function solveE(M,e){let E=e<.8?M:Math.PI;for(let k=0;k<12;k++)E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));return E;}
 const hz=s=>{const L=s.R*s.R*Math.pow(s.T/5772,4),q=Math.sqrt(L);return[.95*q,1.37*q,L];};
 function sysMap(s){
  const as=s.p.map(p=>p[1]),amax=Math.max(...as),amin=Math.min(...as);
  if(st.real)return a=>a*(34/amax);
  return a=>3.2+6.2*(Math.log10(a)-Math.log10(Math.max(amin*.5,1e-3)));
 }
 function showExo(i,pi){
  st.ei=i;clearScene();const s=EXO[i],f=sysMap(s),sr=Math.max(st.real?Math.min(.55,f(Math.min(...s.p.map(p=>p[1])))*.5):.5,Math.min(2.6,st.real?s.R*AU_RSUN*(34/Math.max(...s.p.map(p=>p[1]))):.9*Math.pow(s.R,.4)));
  scene.add(new T.AmbientLight(0x303848,.9));const col=bb(s.T);
  const star=new T.Mesh(new T.SphereGeometry(sr,48,32),new T.MeshBasicMaterial({color:col}));scene.add(star);
  const halo=new T.Sprite(new T.SpriteMaterial({map:glow,color:col,transparent:true,opacity:.8,blending:T.AdditiveBlending,depthWrite:false}));halo.scale.setScalar(Math.max(sr*7,1.8));scene.add(halo);
  const lamp=new T.PointLight(0xffffff,2.6,0,0);scene.add(lamp);
  const [hi,ho]=hz(s);const rI=f(hi),rO=f(ho);
  if(rO>rI&&isFinite(rO)&&rI>0){const ring=new T.Mesh(new T.RingGeometry(rI,rO,128,1),new T.MeshBasicMaterial({color:0x35d07a,transparent:true,opacity:.14,side:T.DoubleSide,depthWrite:false}));ring.rotation.x=-Math.PI/2;scene.add(ring);}
  const Pmin=Math.min(...s.p.map(p=>p[2])),objs=[];
  s.p.forEach((p,k)=>{const [name,a,P,Re,Me,e]=p,[cn,cc]=cls(Re),rnd=rng(hash(name)),w=rnd()*6.283,M0=rnd()*6.283;
   const teq=s.T*Math.sqrt(s.R*AU_RSUN/(2*a));let ccol=cc;if(teq>1100)ccol='#d8683a';
   const pr=.24+.1*Math.pow(Re,.75);const mesh=new T.Mesh(new T.SphereGeometry(pr,32,20),new T.MeshStandardMaterial({map:ptex(ccol,hash(name),Re>=6),roughness:.95,metalness:0}));mesh.userData.pi=k;scene.add(mesh);
   const pts=[];for(let q=0;q<=180;q++){const E=q/180*Math.PI*2,x=a*(Math.cos(E)-e),y=a*Math.sqrt(1-e*e)*Math.sin(E),r=Math.hypot(x,y),nu=Math.atan2(y,x)+w,rr=f(r);pts.push(new T.Vector3(rr*Math.cos(nu),0,-rr*Math.sin(nu)));}
   const line=new T.Line(new T.BufferGeometry().setFromPoints(pts),new T.LineBasicMaterial({color:0x4d7aa6,transparent:true,opacity:.5}));scene.add(line);
   const l=document.createElement('button');l.className='ga-lab';l.textContent=name;l.onclick=()=>selPlanet(k);labels.append(l);
   objs.push({mesh,line,el:l,a,P,e,w,M0,pr,teq});});
  st.sys={s,f,objs,Pmin,star};
  const maxR=f(Math.max(...s.p.map(p=>p[1])));cs.tgt.set(0,0,0);cs.tTgt.set(0,0,0);cs.th=.5;cs.ph=1.0;cs.tDist=Math.max(14,maxR*1.7);cs.dist=cs.tDist*1.6;cs.min=.4;cs.max=Math.max(300,maxR*5);cs.auto=true;
  st.pi=-1;renderListSel();exoInfo(-1);
  tools.innerHTML=`<button id="gaScale">${st.real?'Masshtab: haqiqiy nisbat':'Masshtab: logarifmik'}</button><button id="gaAll">⟲ Butun tizim</button><button id="gaNasa" title="Internetdan: NASA Exoplanet Archive">🌐 NASA yangilash</button><label class="ga-sp">Tezlik <input id="gaSpeed" type="range" min="0" max="3" step="0.05" value="${Math.log10(st.speed*10+1)>3?3:Math.log10(st.speed*10+1)}"></label>`;
  $('#gaScale',root).onclick=()=>{st.real=!st.real;showExo(st.ei,st.pi);};
  $('#gaAll',root).onclick=()=>{st.pi=-1;cs.tTgt.set(0,0,0);cs.tDist=Math.max(14,maxR*1.7);cs.auto=true;exoInfo(-1);};
  $('#gaNasa',root).onclick=async e=>{const b=e.currentTarget;b.textContent='⏳ Yangilanmoqda…';try{const r=await KX.net.exoRefresh();KX.scope?.toast?.(`NASA: ${r.upd} ta yangilandi, ${r.add} ta yangi sayyora (${r.date})`);showExo(st.ei,st.pi);}catch(err){b.textContent='🌐 NASA yangilash';KX.scope?.toast?.('Yangilab bo‘lmadi: '+err.message);}};
  $('#gaSpeed',root).oninput=e=>{st.speed=(Math.pow(10,+e.target.value)-1)/10;};
  if(pi!=null&&pi>=0)selPlanet(pi);
 }
 function selPlanet(k){st.pi=k;const o=st.sys.objs[k];cs.auto=false;cs.tDist=Math.max(.9,o.pr*9);exoInfo(k);}
 function exoInfo(k){
  const s=st.sys.s,[hi,ho,L]=hz(s),dayTxt=`1 soniya ≈ ${fmt(st.sys.Pmin/8*st.speed,st.sys.Pmin/8*st.speed<10?1:0)} kun`;
  const head=`<h2>${esc(s.name)}</h2><p class="ga-sub">${s.ly?fmt(s.ly,s.ly<100?1:0)+' y.y. · ':''}${esc(s.sp)} · ${fmt(s.T,0)} K · R = ${fmt(s.R,2)} R☉</p>`;
  const sysFacts=`<div class="ga-facts"><div><span>Yulduz radiusi / massasi</span><b>${fmt(s.R,2)} / ${fmt(s.M,2)} R☉, M☉ ${chip('m')}</b></div><div><span>Yorqinligi</span><b>${L<.01?L.toExponential(1):fmt(L,L<10?2:0)} L☉ ${chip('h')}</b></div><div><span>Yashash zonasi (taxminiy)</span><b>${fmt(hi,hi<.1?3:2)}–${fmt(ho,ho<.1?3:2)} AU ${chip('h')}</b></div><div><span>Sayyoralar soni</span><b>${s.p.length}</b></div><div><span>Vaqt</span><b>${dayTxt} ${chip('s')}</b></div></div>`;
  if(k<0){info.innerHTML=head+`<div class="ga-chips">${chip('m')}<span>orbita va o‘lchamlar</span> ${chip('h')}<span>harorat, zona</span> ${chip('t')}<span>sayyora ko‘rinishi</span></div>`+sysFacts+`<p class="ga-note">${esc(s.note)}</p><div class="ga-pl">${s.p.map((p,j)=>`<button data-k="${j}">${esc(p[0])}</button>`).join('')}</div>`+warnExo();bindPl();return;}
  const p=s.p[k],o=st.sys.objs[k],[cn]=cls(p[3]),inHZ=p[1]>=hi&&p[1]<=ho;
  info.innerHTML=head+`<h3>${esc(p[0])}</h3><div class="ga-chips">${chip(p[6]?'t':'m')}<span>${p[6]?'radius/massa taxminiy':'o‘lchangan'}</span> ${chip('h')}<span>harorat</span></div><div class="ga-facts"><div><span>Tur</span><b>${cn}</b></div><div><span>Orbita yarim o‘qi</span><b>${fmt(p[1],p[1]<.1?4:3)} AU</b></div><div><span>Yil davomiyligi</span><b>${p[2]<2?fmt(p[2]*24,1)+' soat':p[2]<400?fmt(p[2],1)+' kun':fmt(p[2]/365.25,1)+' yil'}</b></div><div><span>Radius</span><b>${fmt(p[3],2)} R⊕ ${p[6]?'(taxminiy)':''}</b></div><div><span>Massa</span><b>${p[4]==null?'noma’lum':fmt(p[4],p[4]<10?2:0)+' M⊕'+(p[6]?' (min./taxminiy)':'')}</b></div><div><span>Muvozanat harorati</span><b>≈ ${fmt(o.teq-273,0)} °C ${chip('h')}</b></div><div><span>Yashash zonasida</span><b>${inHZ?'ha (hisob bo‘yicha)':'yo‘q'}</b></div></div>${p[7]?`<p class="ga-note">${esc(p[7])}</p>`:''}<p class="ga-note">Muvozanat harorati — atmosfera va albedoni hisobga olmaydigan taxminiy qiymat (Tₑq = T★·√(R★/2a), albedo = 0). Haqiqiy sirt harorati boshqacha bo‘lishi mumkin. “Yashash zonasida” — hayot borligini bildirmaydi.</p><div class="ga-pl">${s.p.map((q,j)=>`<button data-k="${j}"${j===k?' class="on"':''}>${esc(q[0])}</button>`).join('')}</div>`+warnExo();bindPl();
 }
 const warnExo=()=>`${st.sys?.s?.nasa?`<p class="ga-note">🌐 NASA Exoplanet Archive bilan yangilangan: ${st.sys.s.nasa}.</p>`:''}<p class="ga-warn"><b>Eslatma:</b> orbita elementlari katalogdan qo‘lda yaxlitlab kiritilgan (internet yangilanishi bo‘lmasa) (NASA Exoplanet Archive va nashrlar), yangi kuzatuvlar bilan o‘zgarishi mumkin. Sayyoralarning <u>ranglari va sirti ramziy</u> — ularning haqiqiy ko‘rinishi noma’lum. Ko‘rinadigan sayyora o‘lchami kattalashtirilgan; haqiqiy nisbat sonlarda berilgan.</p>`;
 function bindPl(){info.querySelectorAll('.ga-pl button').forEach(b=>b.onclick=()=>selPlanet(+b.dataset.k));}

 function renderList(){
  if(mode==='exo'){list.innerHTML=EXO.map((s,i)=>`<button data-i="${i}"><b>${esc(s.name.replace(/ \(.*$/,''))}</b><small>${s.ly?fmt(s.ly,s.ly<100?1:0)+' y.y. · ':''}${s.p.length} sayyora</small></button>`).join('');}
  else list.innerHTML=GAL.map((g,i)=>`<button data-i="${i}"><b>${esc(g[1].replace(/ \(.*$/,''))}</b><small>${esc(TYPE[g[2]]||g[2])} · ${g[6]===0?'bizniki':g[6]>=1?fmt(g[6],g[6]<10?1:0)+' mln y.y.':fmt(g[6]*1000,0)+' ming y.y.'}</small></button>`).join('');
  list.querySelectorAll('button').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(mode==='exo')showExo(i);else if(mode==='map'){mapFocus(i);}else showGal(i);});
 }
 function renderListSel(){const sel=mode==='exo'?st.ei:mode==='map'?st.mapSel:st.gi;list.querySelectorAll('button').forEach(b=>{const on=+b.dataset.i===sel;b.classList.toggle('on',on);if(on&&b.scrollIntoView)try{b.scrollIntoView({block:'nearest',inline:'nearest'});}catch(e){}});}
 function setMode(m,idx){
  if(!init())return;mode=m;root.dataset.mode=m;$('#gaModes',root).querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.m===m));renderList();resize();
  if(m==='gal')showGal(idx!=null?idx:st.gi);else if(m==='map')showMap();else showExo(idx!=null?idx:st.ei);
 }

 const ray=new T.Raycaster(),v2=new T.Vector2(),tmp=new T.Vector3();
 function pick(cx,cy){
  const r=canvas.getBoundingClientRect(),x=cx-r.left,y=cy-r.top;
  if(mode==='exo'&&st.sys){v2.set(x/r.width*2-1,-(y/r.height)*2+1);ray.setFromCamera(v2,cam);const hit=ray.intersectObjects(st.sys.objs.map(o=>o.mesh),false)[0];if(hit)selPlanet(hit.object.userData.pi);}
  else if(mode==='map'){let best=-1,bd=26;for(const o of st.mapObjs){if(o.gi==null)continue;tmp.copy(o.p).project(cam);if(tmp.z>1)continue;const d=Math.hypot((tmp.x+1)/2*r.width-x,(1-tmp.y)/2*r.height-y);if(d<bd){bd=d;best=o.gi;}}if(best>=0)mapFocus(best);}
 }
 canvas.addEventListener('dblclick',()=>{if(mode==='map')setMode('gal',st.mapSel);});

 function frame(t){
  raf=requestAnimationFrame(frame);if(!open||!R)return;const dt=Math.min(.1,(t-last)/1000||0);last=t;
  if(cs.auto&&mode!=='exo')cs.th+=dt*.05;else if(cs.auto&&mode==='exo')cs.th+=dt*.03;
  const k=1-Math.exp(-dt*5);cs.dist+=(cs.tDist-cs.dist)*k;cs.tgt.lerp(cs.tTgt,k);
  if(mode==='exo'&&st.sys){
   st.days+=dt*(st.sys.Pmin/8)*st.speed;
   for(const o of st.sys.objs){const Mn=o.M0+2*Math.PI*st.days/o.P,E=solveE(((Mn%(2*Math.PI))+2*Math.PI)%(2*Math.PI),o.e),x=o.a*(Math.cos(E)-o.e),y=o.a*Math.sqrt(1-o.e*o.e)*Math.sin(E),r=Math.hypot(x,y),nu=Math.atan2(y,x)+o.w,rr=st.sys.f(r);o.mesh.position.set(rr*Math.cos(nu),0,-rr*Math.sin(nu));o.mesh.rotation.y+=dt*.4;}
   if(st.pi>=0)cs.tTgt.copy(st.sys.objs[st.pi].mesh.position);
   const sl=$('#gaSpeed',root);const el=info.querySelector('.ga-facts b');
  }
  if(cur&&mode==='gal'){}
  placeCam();R.render(scene,cam);

  if(mode==='map'||mode==='exo'){const w=canvas.clientWidth,h=canvas.clientHeight;
   const arr=mode==='map'?st.mapObjs:st.sys.objs.map(o=>({el:o.el,p:o.mesh.position}));
   for(const o of arr){tmp.copy(o.p).project(cam);let vis=tmp.z<1&&Math.abs(tmp.x)<1.05&&Math.abs(tmp.y)<1.05;if(mode==='map'&&w<700&&o.gi!=null&&o.gi!==st.mapSel)vis=false;o.el.style.display=vis?'':'none';if(vis)o.el.style.transform=`translate(${(tmp.x+1)/2*w}px,${(1-tmp.y)/2*h}px) translate(-50%,-130%)`;if(o.gi!=null)o.el.classList.toggle('on',o.gi===st.mapSel);}
   if(mode==='exo')st.sys.objs.forEach((o,i)=>o.el.classList.toggle('on',i===st.pi));}
 }

 function openAtlas(m,idx){
  if(!init()){alert('Bu qurilmada WebGL ishlamayapti — atlasni ochib bo‘lmadi.');return;}
  root.hidden=false;open=true;document.body.classList.add('ga-open');app.cinemaPause?.();last=performance.now();if(!raf)raf=requestAnimationFrame(frame);setMode(m||mode,idx);document.addEventListener('keydown',esc_,true);
 }
 function close(){open=false;root.hidden=true;document.body.classList.remove('ga-open');document.removeEventListener('keydown',esc_,true);cancelAnimationFrame(raf);raf=0;}
 const esc_=e=>{if(e.key==='Escape'){e.stopPropagation();close();}};
 $('#gaClose',root).onclick=close;
 $('#gaModes',root).onclick=e=>{const b=e.target.closest('button');if(b)setMode(b.dataset.m);};
 KX.atlas={open:openAtlas,close,state:st,gal:GAL,exo:EXO,get mode(){return mode;},isOpen:()=>open};
 KX.tab?.('galatlas','Galaktikalar / ekzosayyoralar',body=>{
  body.innerHTML=`<p class="lab-note">${GAL.length} ta galaktika (turi, joyi, masofasi, 3D modeli) va ${EXO.length} ta sayyora tizimi (TRAPPIST-1, Proksima, 55 Cancri, Kepler-452 …) — to‘liq ekranli atlasda.</p><div class="ga-tabbtns"><button data-m="gal">🌀 Galaktikalar</button><button data-m="map">🗺 Galaktikalar xaritasi</button><button data-m="exo">🪐 Ekzosayyora tizimlari</button></div><p class="lab-note">Galaktikalarning 3D ko‘rinishi — simulyatsiya; sayyora ranglari ramziy. Ma’lumotlar yaxlitlab kiritilgan, qarang: Manbalar.</p>`;
  body.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{window.KoinotLab?.dialog?.close?.();openAtlas(b.dataset.m);});
 });
})();
