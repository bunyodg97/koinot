(()=>{'use strict';
 const app=window.koinot,j=app?.journey,W=window.KOINOT_WEB;if(!j||!window.THREE||!W)return;
 const T=THREE,g=j.groups[6],$=s=>document.querySelector(s),UM=8,OBS=new T.Vector3(-8,2,3),MLY=3.26156;
 for(const o of [...g.children]){g.remove(o);o.geometry?.dispose();o.material?.dispose?.();}
 const tex=document.createElement('canvas');tex.width=tex.height=64;{const c=tex.getContext('2d'),gr=c.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.12,'rgba(255,255,255,1)');gr.addColorStop(.35,'rgba(255,255,255,.3)');gr.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=gr;c.fillRect(0,0,64,64);}
 const glow=new T.CanvasTexture(tex),rtex=document.createElement('canvas');rtex.width=rtex.height=64;{const c=rtex.getContext('2d');c.strokeStyle='#73eaff';c.lineWidth=4;c.beginPath();c.arc(32,32,26,0,Math.PI*2);c.stroke();}
 const model=new T.Group();model.name='cosmicweb-model';g.add(model);
 const bin=atob(W.b64),n=W.n,u8=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u8[i]=bin.charCodeAt(i);
 const dv=new DataView(u8.buffer),R=W.R,P=new Float32Array(n*3),C=new Float32Array(n*3),S=new Float32Array(n);
 const ramp=t=>{
  const a=[.22,.35,.85],b=[.62,.84,1],c=[1,.86,.6];let u,v,w;if(t<.55){const k=t/.55;u=a;v=b;w=k;}else{const k=(t-.55)/.45;u=b;v=c;w=k;}return [u[0]+(v[0]-u[0])*w,u[1]+(v[1]-u[1])*w,u[2]+(v[2]-u[2])*w];};
 for(let i=0;i<n;i++){const x=(dv.getUint16(2*i,true)/65535*2-1)*R,y=(dv.getUint16(2*n+2*i,true)/65535*2-1)*R,z=(dv.getUint16(4*n+2*i,true)/65535*2-1)*R,d=u8[6*n+i]/255;
  P[3*i]=OBS.x+x/UM;P[3*i+1]=OBS.y+y/UM;P[3*i+2]=OBS.z+z/UM;const t=Math.max(0,Math.min(1,(d-.25)/.6)),c=ramp(t),b=.32+.7*t;C[3*i]=c[0]*b;C[3*i+1]=c[1]*b;C[3*i+2]=c[2]*b;S[i]=.6+1.3*t;}
 {const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(P,3));geo.setAttribute('color',new T.BufferAttribute(C,3));geo.setAttribute('sparkSize',new T.BufferAttribute(S,1));
  const m=new T.PointsMaterial({size:.42,map:glow,vertexColors:true,toneMapped:false,transparent:true,depthWrite:false,opacity:1,blending:T.AdditiveBlending});
  m.onBeforeCompile=sh=>{sh.vertexShader='attribute float sparkSize;\n'+sh.vertexShader.replace('gl_PointSize = size;','gl_PointSize = size * sparkSize;');};m.customProgramCacheKey=()=> 'koinot-web-212';
  const o=new T.Points(geo,m);o.frustumCulled=false;model.add(o);}

 const wire=(r,op,col)=>{const s=new T.Mesh(new T.SphereGeometry(r,32,16),new T.MeshBasicMaterial({color:col,wireframe:true,transparent:true,opacity:op,depthWrite:false}));s.position.copy(OBS);model.add(s);};
 wire(80/UM,.1,0xffc177);wire(R/UM,.05,0x6fb7ff);
 const mk=new T.Sprite(new T.SpriteMaterial({map:glow,color:0xffffff,toneMapped:false,depthWrite:false,transparent:true,blending:T.AdditiveBlending}));mk.position.copy(OBS);mk.scale.set(1.2,1.2,1.2);model.add(mk);
 const at=(p)=>new T.Vector3(p[0]/UM,p[1]/UM,p[2]/UM).add(OBS);
 const items=[{name:'Siz shu yerdasiz (Laniakea ≈ 160 Mpk)',pos:OBS.clone(),info:'To‘q sariq to‘r — Laniakea o‘lchami (≈ 160 Mpk ≈ 520 mln y.y.). Bu — butun simulyatsiya hajmining kichik qismi. Kuzatuvchining simulyatsiyadagi o‘rni tasodifiy tanlangan, bizning haqiqiy atrofimiz emas.'}];
 W.nodes.forEach((p,i)=>items.push({name:'Zich tugun '+(i+1),pos:at(p),info:'Simulyatsiyadagi massiv klasterlar to‘plami hududi (zichlik ≈ '+p[3].toFixed(1)+'× o‘rtachadan, 12 Mpk gacha tekislangan). Yangi tuzilma, haqiqiy superklaster emas.'}));
 W.voids.forEach((p,i)=>items.push({name:'Bo‘shliq '+(i+1),pos:at(p),info:'Simulyatsiyadagi bo‘shliq (void): zichlik o‘rtachaning ≈ '+Math.round(p[3]*100)+'% igacha pasaygan. Haqiqiy koinotdagi bo‘shliqlar ham shunday juda siyrak bo‘ladi (o‘nlab–yuzlab Mpk).'}));
 const defs=[];function lab(text,p,cls=''){const e=document.createElement('span');e.className='journey-label mw-label '+cls;e.textContent=text;e.hidden=true;app.host.append(e);defs.push({e,p:p.clone()});}
 lab('Siz shu yerdasiz · Laniakea ≈ 160 Mpk',OBS.clone().add(new T.Vector3(0,1.4,0)),'mw-sun');
 items.forEach(it=>{if(it.name.startsWith('Zich'))lab(it.name,it.pos.clone().add(new T.Vector3(0,.9,0)));if(it.name.startsWith('Bo‘sh'))lab(it.name,it.pos.clone());});
 lab('Simulyatsiya chegarasi · radius 256 Mpk',OBS.clone().add(new T.Vector3(R/UM,0,0)));
 function updateLabels(){const occ=[];for(const l of defs){const show=Math.abs(j.q-6)<.42&&g.visible;if(!show){l.e.hidden=true;continue;}const v=g.localToWorld(l.p.clone()).project(j.camera);const px=(v.x+1)*.5*app.host.clientWidth,py=(1-v.y)*.5*app.host.clientHeight;let hide=Math.abs(v.x)>.95||Math.abs(v.y)>.9||v.z>1;if(!hide&&occ.some(o=>Math.abs(o.x-px)<135&&Math.abs(o.y-py)<20))hide=true;if(!hide)occ.push({x:px,y:py});l.e.hidden=hide;l.e.style.left=px+'px';l.e.style.top=py+'px';}}
 const ring=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(rtex),toneMapped:false,depthWrite:false,transparent:true}));ring.scale.setScalar(2);ring.visible=false;model.add(ring);
 const sp=x=>String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
 function detail(it){const d=$('#webDetail');if(!d)return;const dist=it.pos.distanceTo(OBS)*UM;d.innerHTML='<b>'+it.name+'</b>'+(dist>1?'<br>Kuzatuvchidan masofa (simulyatsiyada): ≈ '+Math.round(dist)+' Mpk ≈ '+sp(dist*MLY)+' mln y.y.':'')+'<br>'+it.info;ring.position.copy(it.pos);ring.visible=true;}
 function extra(){const info=$('#cosmicInfo');if(!info||info.querySelector('#webExtra'))return;const d=document.createElement('div');d.id='webExtra';
  d.innerHTML='<h3>Bu nima? (muhim)</h3><p class="mw-warn">Bu bizning koinotning xaritasi EMAS — fizik qonunlarga asoslangan simulyatsiya. U shunday tuzilma qanday ko‘rinishini ko‘rsatadi.</p><p>Usul: ΛCDM kosmologiyasi (Ωm = 0,31; h = 0,68; σ8 = 0,81) uchun Gauss tasodifiy zichlik maydoni + Zel‘dovich yaqinlashuvi: '+sp(n)+' zarracha, 512 Mpk davriy qutidan kuzatuvchi atrofidagi radiusi 256 Mpk shar. 1 birlik = 8 Mpk (≈ 26 mln y.y.). Rang: to‘q ko‘k — siyrak, oqish-ko‘k — filament, sarg‘ish — zich tugun.</p><p>Cheklovlar: Zel‘dovich yaqinlashuvi filament va bo‘shliqlarning umumiy tuzilishini beradi, lekin klasterlarning ichki tuzilishini (to‘liq N-tana simulyatsiyasi kabi) bermaydi. Tuzilma — bitta tasodifiy realizatsiya, shuning uchun aniq klasterlar joyi haqiqiy emas. Sayohatdagi o‘tish animatsiyasi masshtabi ko‘rgazmali.</p><select id="webSel" aria-label="Obyekt"><option value="">Obyekt tanlang…</option>'+items.map((x,i)=>'<option value="'+i+'">'+x.name+'</option>').join('')+'</select><p id="webDetail"></p>';
  info.append(d);const sel=d.querySelector('#webSel');sel.onchange=()=>{if(sel.value!=='')detail(items[+sel.value]);};}
 const oldFrame=j.frame.bind(j),oldStop=j.stop.bind(j);
 j.frame=function(dt){oldFrame(dt);if(j.detail?.active)return;const k=Math.round(j.q);if(k===6)extra();if(ring.visible)ring.scale.setScalar(2.2+.35*Math.sin(performance.now()/300));updateLabels();};
 j.stop=function(...a){oldStop(...a);defs.forEach(l=>l.e.hidden=true);};
 j.web={items,model,count:n};
})();
