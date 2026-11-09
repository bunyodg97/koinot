(()=>{'use strict';
 const app=window.koinot,j=app?.journey,LG=window.KOINOT_LG;if(!j||!window.THREE||!LG)return;
 const T=THREE,g=j.groups[4],$=s=>document.querySelector(s);
 const KS=8,KO=3,U=40,ORG=new T.Vector3(-10,0,0),GC=[8.2,0,0],KLY=3.26156;
 let seed=4271093;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const gauss=()=>{let u=0;while(!u)u=rand();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*rand());};

 for(const o of [...g.children]){g.remove(o);o.geometry?.dispose();o.material?.dispose?.();}
 const tex=document.createElement('canvas');tex.width=tex.height=64;{const c=tex.getContext('2d'),gr=c.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.12,'rgba(255,255,255,1)');gr.addColorStop(.35,'rgba(255,255,255,.3)');gr.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=gr;c.fillRect(0,0,64,64);}
 const glow=new T.CanvasTexture(tex);
 const rtex=document.createElement('canvas');rtex.width=rtex.height=64;{const c=rtex.getContext('2d');c.strokeStyle='#73eaff';c.lineWidth=4;c.beginPath();c.arc(32,32,26,0,Math.PI*2);c.stroke();}
 const model=new T.Group();model.name='localgroup-model';g.add(model);
 function points(P,C,S,{size=.3,opacity=1}={}){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(P,3));geo.setAttribute('color',new T.Float32BufferAttribute(C,3));geo.setAttribute('sparkSize',new T.Float32BufferAttribute(S,1));
  const m=new T.PointsMaterial({size,map:glow,vertexColors:true,toneMapped:false,transparent:true,depthWrite:false,opacity,blending:T.AdditiveBlending});
  m.onBeforeCompile=sh=>{sh.vertexShader='attribute float sparkSize;\n'+sh.vertexShader.replace('gl_PointSize = size;','gl_PointSize = size * sparkSize;');};m.customProgramCacheKey=()=> 'koinot-lg-210';
  const o=new T.Points(geo,m);o.frustumCulled=false;model.add(o);return o;}

 const A=[[-0.0548755604,-0.8734370902,-0.4838350155],[0.4941094279,-0.4448296300,0.7469822445],[-0.8676661490,-0.1980763734,0.4559837762]];
 const R=Math.PI/180,eq=(ra,de)=>[Math.cos(de*R)*Math.cos(ra*R),Math.cos(de*R)*Math.sin(ra*R),Math.sin(de*R)];
 const gal=v=>A.map(r=>r[0]*v[0]+r[1]*v[1]+r[2]*v[2]);
 const toM=G=>new T.Vector3(-G[0],G[2],G[1]);
 const sunG=(ra,de,d)=>gal(eq(ra,de)).map(x=>x*d);
 const toScene=(G,host,k)=>{let rel=[G[0]-GC[0],G[1]-GC[1],G[2]-GC[2]];if(host&&k!==1){const h=[host[0]-GC[0],host[1]-GC[1],host[2]-GC[2]];rel=[h[0]+k*(G[0]-host[0]),h[1]+k*(G[1]-host[1]),h[2]+k*(G[2]-host[2])];}return toM(rel).multiplyScalar(1/U).add(ORG);};
 function basis(ra,de,PA,inc){const a=ra*R,d=de*R,r=eq(ra,de),e=[-Math.sin(a),Math.cos(a),0],nn=[-Math.sin(d)*Math.cos(a),-Math.sin(d)*Math.sin(a),Math.cos(d)];
  const dir=p=>nn.map((x,i)=>Math.cos(p*R)*x+Math.sin(p*R)*e[i]);const m=dir(PA),q=dir(PA-90),dn=q.map((x,i)=>Math.cos(inc*R)*x-Math.sin(inc*R)*r[i]);
  const M=toM(gal(m)).normalize(),Dn=toM(gal(dn)).normalize();return {m:M,d:Dn,n:new T.Vector3().crossVectors(M,Dn).normalize()};}

 const WARM=[1,.84,.6],BLUE=[.62,.78,1];
 function spiral(o){const P=[],C=[],S=[];
  for(let i=0;i<o.N;i++){let u,v,w,col,b;const t=rand();
   if(t<.17){const s=o.r*.15;u=gauss()*s*1.25;v=gauss()*s;w=gauss()*s*.75;col=[1,.88,.66];b=(.35+rand()*.4)*.55;}
   else{let rad,th;if(o.ring&&rand()<.22){rad=o.r*o.ring*(1+gauss()*.09);th=rand()*Math.PI*2;}
    else{rad=-Math.log(1-rand()*(1-Math.exp(-3)))/3*o.r*1.15;th=rand()<.72?Math.floor(rand()*o.arms)*2*Math.PI/o.arms+Math.log(rad/(o.r*.12)+1e-3)/o.B+gauss()*(.22+.22*rad/o.r):rand()*Math.PI*2;}
    u=rad*Math.cos(th);v=rad*Math.sin(th);w=gauss()*o.r*.018;const f=Math.min(1,rad/o.r);col=[WARM[0]+(BLUE[0]-WARM[0])*f*o.cool,WARM[1]+(BLUE[1]-WARM[1])*f*o.cool,WARM[2]+(BLUE[2]-WARM[2])*f*o.cool];b=(.3+rand()*.6)*.6;}
   const p=o.c.clone().addScaledVector(o.m,u).addScaledVector(o.d,v).addScaledVector(o.n,w);P.push(p.x,p.y,p.z);C.push(col[0]*b,col[1]*b,col[2]*b);S.push(.5+Math.pow(rand(),3)*1.9);}
  points(P,C,S,{size:.22});
  const h=new T.Sprite(new T.SpriteMaterial({map:glow,color:o.halo,toneMapped:false,depthWrite:false,transparent:true,opacity:.16,blending:T.AdditiveBlending}));h.position.copy(o.c);h.scale.setScalar(o.r*3);model.add(h);}

 const mwC=ORG.clone();
 spiral({c:mwC,m:new T.Vector3(1,0,0),d:new T.Vector3(0,0,1),n:new T.Vector3(0,1,0),r:.27*KS,N:3800,arms:4,B:.26,cool:1,halo:0xffd9a0});

 const M31={ra:10.6847,de:41.2692,d:780},M33={ra:23.4621,de:30.6603,d:809};
 const g31=sunG(M31.ra,M31.de,M31.d),g33=sunG(M33.ra,M33.de,M33.d);
 const c31=toScene(g31),c33=toScene(g33);
 spiral({c:c31,...basis(M31.ra,M31.de,38,77),r:.5*KS,N:7200,arms:2,B:.42,ring:.5,cool:.9,halo:0xffe0b0});
 spiral({c:c33,...basis(M33.ra,M33.de,22,56),r:.16*KS,N:2600,arms:2,B:.45,cool:1,halo:0xbfd8ff});

 const items=[{name:'Somon Yo‘li',pos:mwC,dk:0,dgc:0,mv:null,gas:1,grp:3,note:'Bizning galaktika: to‘sinli spiral, ≈ 100 000 y.y. diametr.'},
  {name:'Andromeda (M31)',pos:c31,dk:M31.d,dgc:Math.hypot(g31[0]-GC[0],g31[1],g31[2]),mv:null,gas:1,grp:3,note:'Eng yaqin yirik spiral galaktika; Somon Yo‘liga ≈ 110 km/s tezlik bilan yaqinlashmoqda.'},
  {name:'Uchburchak (M33)',pos:c33,dk:M33.d,dgc:Math.hypot(g33[0]-GC[0],g33[1],g33[2]),mv:null,gas:1,grp:3,note:'Mahalliy guruhning uchinchi yirik galaktikasi (spiral, ≈ 60 000 y.y.).'}];
 const P=[],C=[],S=[];const GAS=[.62,.8,1],OLD=[1,.82,.55];
 const unameRank={'LMC':'Katta Magellan buluti','SMC':'Kichik Magellan buluti','Sagittarius':'Sagittarius mitti galaktikasi','M 32':'M32','Fornax':'Fornax mitti galaktikasi'};
 const mwG=GC;
 for(const s of LG.sats){const [name,ra,de,dk,mv,gas,grp]=s;const G=sunG(ra,de,dk);
  const pos=grp===1?toScene(G,mwG,KO):grp===2?toScene(G,g31,KO):toScene(G);
  const m=mv==null?-6:mv,size=Math.max(.7,Math.min(3.6,.7+.17*(-m-2))),col=gas?GAS:OLD,b=.75+.25*Math.min(1,(-m)/14);
  P.push(pos.x,pos.y,pos.z);C.push(col[0]*b,col[1]*b,col[2]*b);S.push(size);
  if(m<-15){const sg=.1*size;for(let i=0;i<80;i++){P.push(pos.x+gauss()*sg,pos.y+gauss()*sg*.6,pos.z+gauss()*sg);C.push(col[0]*.5,col[1]*.5,col[2]*.5);S.push(.5+rand());}}
  const dgc=Math.hypot(G[0]-GC[0],G[1]-GC[1],G[2]-GC[2]);
  items.push({name:unameRank[name]||name,raw:name,pos,dk,dgc,mv,gas,grp});}
 points(P,C,S,{size:.3});

 const defs=[];function lab(text,p,cls=''){const e=document.createElement('span');e.className='journey-label mw-label '+cls;e.textContent=text;e.hidden=true;app.host.append(e);defs.push({e,p:p.clone()});}
 const at=n=>items.find(x=>x.name===n||x.raw===n)?.pos;
 lab('Somon Yo‘li · siz shu yerdasiz',mwC.clone().add(new T.Vector3(0,1.9,0)),'mw-sun');
 lab('Andromeda (M31) · ≈ 2,5 mln y.y.',c31.clone().add(new T.Vector3(0,3.3,0)));
 lab('Uchburchak (M33)',c33.clone().add(new T.Vector3(0,1.6,0)));
 for(const [n,t] of [['LMC','Katta Magellan buluti'],['SMC','Kichik Magellan buluti'],['M 32','M32'],['NGC 205','NGC 205'],['IC 10','IC 10'],['NGC 6822','NGC 6822'],['IC 1613','IC 1613'],['WLM','WLM'],['Sextans A','Sextans A'],['NGC 3109','NGC 3109'],['Fornax','Fornax']]){const p=at(n);if(p)lab(t,p.clone().add(new T.Vector3(0,.9,0)));}
 function updateLabels(){const occ=[];for(const l of defs){const show=Math.abs(j.q-4)<.42&&g.visible;if(!show){l.e.hidden=true;continue;}const v=g.localToWorld(l.p.clone()).project(j.camera);const px=(v.x+1)*.5*app.host.clientWidth,py=(1-v.y)*.5*app.host.clientHeight;let hide=Math.abs(v.x)>.95||Math.abs(v.y)>.9||v.z>1;if(!hide&&occ.some(o=>Math.abs(o.x-px)<120&&Math.abs(o.y-py)<20))hide=true;if(!hide)occ.push({x:px,y:py});l.e.hidden=hide;l.e.style.left=px+'px';l.e.style.top=py+'px';}}

 const ring=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(rtex),toneMapped:false,depthWrite:false,transparent:true}));ring.scale.setScalar(2);ring.visible=false;model.add(ring);

 const grpName=['yaqin qo‘shni galaktika','Somon Yo‘li yo‘ldoshi','Andromeda yo‘ldoshi','yirik galaktika'];
 const sp=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
 const lyText=kpc=>{const ly=kpc*KLY*1000;return ly<1e6?sp(ly)+' y.y.':(ly/1e6).toFixed(2).replace('.',',')+' mln y.y.';};
 function detail(it){const d=$('#lgDetail');if(!d)return;
  d.innerHTML='<b>'+it.name+'</b> · '+grpName[it.grp]+'<br>Yerdan: ≈ '+(it.dk?lyText(it.dk):'—')+'<br>Somon Yo‘li markazidan: ≈ '+(it.dgc?lyText(it.dgc):'—')+(it.mv!=null?'<br>Yorqinligi: M<sub>V</sub> ≈ '+it.mv.toFixed(1):'')+(it.grp<3?'<br>Neytral vodorod (HI) gazi: '+(it.gas?'aniqlangan':'aniqlanmagan'):'')+(it.note?'<br>'+it.note:'');
  ring.position.copy(it.pos);ring.visible=true;}
 function extra(){const info=$('#cosmicInfo');if(!info||info.querySelector('#lgExtra'))return;const d=document.createElement('div');d.id='lgExtra';
  const opts=(grp,title)=>'<optgroup label="'+title+'">'+items.map((x,i)=>x.grp===grp?'<option value="'+i+'">'+x.name+'</option>':'').join('')+'</optgroup>';
  d.innerHTML='<h3>Ma‘lumot va masshtab</h3><p>Joylashuv — haqiqiy: har bir galaktika katalogdagi yo‘nalish (RA/Dec) va masofada turadi. Manba: Local Volume Database (tasdiqlangan galaktikalar: '+LG.sats.length+' ta, shu bilan M31, M33 va Somon Yo‘li). 1 birlik ≈ 130 000 y.y.</p><p class="mw-warn">Kattalashtirilgan: galaktikalar o‘lchami ≈ 8×, yo‘ldoshlarning o‘z galaktikasidan masofasi ≈ 3× (aks holda ular ko‘rinmas nuqta bo‘lib qolardi). Galaktikalar orasidagi masofalar haqiqiy.</p><div class="cosmic-legend"><span style="color:#9fcaff">● gaz (HI) aniqlangan</span><span style="color:#ffd18c">● gazsiz (qadimiy)</span></div><select id="lgSel" aria-label="Galaktika"><option value="">Galaktika tanlang…</option>'+opts(3,'Yirik galaktikalar')+opts(1,'Somon Yo‘li yo‘ldoshlari')+opts(2,'Andromeda yo‘ldoshlari')+opts(0,'Yaqin qo‘shnilar (≈ 5 mln y.y. gacha)')+'</select><p id="lgDetail"></p><p>Andromeda va Somon Yo‘li: ilgari ≈ 4–5 mlrd yildan keyin to‘qnashadi deb hisoblangan. Gaia va Hubble ma‘lumotlariga asoslangan 2025-yilgi tahlil esa kelgusi 10 mlrd yil ichida qo‘shilish ehtimolini taxminan 50% deb baholaydi — bu hali yakuniy emas.</p><p>M31 va M33 spirallari yo‘nalishi (qiyalik, PA) bo‘yicha taxminiy; yulduzlar soni ramziy.</p>';
  info.append(d);const sel=d.querySelector('#lgSel');sel.onchange=()=>{if(sel.value==='')return;detail(items[+sel.value]);};}
 const oldFrame=j.frame.bind(j),oldStop=j.stop.bind(j);
 j.frame=function(dt){oldFrame(dt);if(j.detail?.active)return;const k=Math.round(j.q);if(k===4)extra();if(ring.visible)ring.scale.setScalar(1.6+.25*Math.sin(performance.now()/300));updateLabels();};
 j.stop=function(...a){oldStop(...a);defs.forEach(l=>l.e.hidden=true);};
 j.lg={items,model,toScene,sunG};
})();
