(()=>{'use strict';
 const app=window.koinot,j=app?.journey,DT=window.KOINOT_2MRS;if(!j||!window.THREE||!DT)return;
 const T=THREE,g=j.groups[5],$=s=>document.querySelector(s);
 const UMPC=4,LGP=new T.Vector3(14,3,4),R=Math.PI/180,MLY=3.26156;
 let seed=9120457;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const gauss=()=>{let u=0;while(!u)u=rand();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*rand());};
 const tex=document.createElement('canvas');tex.width=tex.height=64;{const c=tex.getContext('2d'),gr=c.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.12,'rgba(255,255,255,1)');gr.addColorStop(.35,'rgba(255,255,255,.3)');gr.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=gr;c.fillRect(0,0,64,64);}
 const glow=new T.CanvasTexture(tex);
 const rtex=document.createElement('canvas');rtex.width=rtex.height=64;{const c=rtex.getContext('2d');c.strokeStyle='#73eaff';c.lineWidth=4;c.beginPath();c.arc(32,32,26,0,Math.PI*2);c.stroke();}

 for(const o of [...g.children]){g.remove(o);o.geometry?.dispose();o.material?.dispose?.();}
 const model=new T.Group();model.name='laniakea-model';g.add(model);
 const A=[[-0.0548755604,-0.8734370902,-0.4838350155],[0.4941094279,-0.4448296300,0.7469822445],[-0.8676661490,-0.1980763734,0.4559837762]];
 const eq=(ra,de)=>[Math.cos(de*R)*Math.cos(ra*R),Math.cos(de*R)*Math.sin(ra*R),Math.sin(de*R)];
 const gal=v=>A.map(r=>r[0]*v[0]+r[1]*v[1]+r[2]*v[2]);
 const dirOf=(ra,de)=>{const G=gal(eq(ra,de));return new T.Vector3(-G[0],G[2],G[1]);};
 const posOf=(ra,de,mpc)=>dirOf(ra,de).multiplyScalar(mpc/UMPC).add(LGP);

 const bin=atob(DT.b64),n=DT.n,u8=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u8[i]=bin.charCodeAt(i);
 const dv=new DataView(u8.buffer),oRA=0,oDE=2*n,oD=4*n,oK=6*n,oT=7*n;
 const P=new Float32Array(n*3),C=new Float32Array(n*3),S=new Float32Array(n);const EARLY=[1,.78,.5],LATE=[.66,.8,1],UNK=[.88,.88,.95];
 for(let i=0;i<n;i++){const ra=dv.getUint16(oRA+2*i,true)/65535*360,de=dv.getUint16(oDE+2*i,true)/65535*180-90,mpc=dv.getUint16(oD+2*i,true)/20+gauss()*.3,K=u8[oK+i]/20,t=u8[oT+i];
  const p=posOf(ra,de,Math.max(.5,mpc));P[3*i]=p.x;P[3*i+1]=p.y;P[3*i+2]=p.z;
  const col=t===1?EARLY:t===2?LATE:UNK,b=.62+.38*Math.max(0,Math.min(1,(11.8-K)/6));C[3*i]=col[0]*b;C[3*i+1]=col[1]*b;C[3*i+2]=col[2]*b;S[i]=.8+Math.max(0,(11.8-K))*.12;}
 {const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(P,3));geo.setAttribute('color',new T.BufferAttribute(C,3));geo.setAttribute('sparkSize',new T.BufferAttribute(S,1));
  const m=new T.PointsMaterial({size:.5,map:glow,vertexColors:true,toneMapped:false,transparent:true,depthWrite:false,opacity:1,blending:T.AdditiveBlending});
  m.onBeforeCompile=sh=>{sh.vertexShader='attribute float sparkSize;\n'+sh.vertexShader.replace('gl_PointSize = size;','gl_PointSize = size * sparkSize;');};m.customProgramCacheKey=()=> 'koinot-lan-211';
  const o=new T.Points(geo,m);o.frustumCulled=false;model.add(o);}

 const ringLine=(mpc,op)=>{const pts=[];for(let k=0;k<=160;k++){const a=k/160*Math.PI*2;pts.push(new T.Vector3(LGP.x+Math.cos(a)*mpc/UMPC,LGP.y,LGP.z+Math.sin(a)*mpc/UMPC));}
  const l=new T.Line(new T.BufferGeometry().setFromPoints(pts),new T.LineBasicMaterial({color:0x6fb7ff,transparent:true,opacity:op,depthWrite:false}));model.add(l);};
 [50,100,150].forEach(r=>ringLine(r,.12));

 const mv=(()=>{const l=272*R,b=30*R,G=[Math.cos(b)*Math.cos(l),Math.cos(b)*Math.sin(l),Math.sin(b)];return new T.Vector3(-G[0],G[2],G[1]).normalize();})();
 const arrow=new T.ArrowHelper(mv,LGP,7,0xffc177,1.6,.9);model.add(arrow);

 const items=[{name:'Mahalliy guruh (siz shu yerdasiz)',pos:LGP.clone(),mpc:0,info:'Somon Yo‘li, Andromeda va ≈ 100 dan ortiq galaktika.'}];
 for(const [name,ra,de,mpc,cnt] of DT.named)items.push({name,pos:posOf(ra,de,mpc),mpc,cnt,info:'2MRS da '+cnt+' galaktika bir guruhga birlashtirilgan (FoF); masofa — guruhning o‘rtacha qizil siljishidan.'});
 items.push({name:'Shapley superklasteri',pos:posOf(202.5,-31.5,200),mpc:200,info:'Mahalliy guruh unga tomon harakatlanayotgan eng yirik tortishish markazlaridan biri. Joylashuvi adabiyotdagi taxminiy qiymat (RA ≈ 202,5°, Dec ≈ −31,5°, ≈ 200 Mpk); 2MRS da bu uzoqlikda galaktikalar siyrak, shuning uchun nuqtalar bu yerda kam.'});
 const pick=n=>items.find(x=>x.name.startsWith(n));
 const vir=pick('Virgo'),m87=new T.Sprite(new T.SpriteMaterial({map:glow,color:0xffb36b,toneMapped:false,depthWrite:false,transparent:true,blending:T.AdditiveBlending}));
 if(vir){m87.position.copy(vir.pos);m87.scale.set(1.1,1.1,1.1);model.add(m87);vir.info+=' Markazida M87 galaktikasi va uning qora tuynugi M87* (≈ 6,5 mlrd M☉) joylashgan.';}
 const defs=[];function lab(text,p,cls=''){const e=document.createElement('span');e.className='journey-label mw-label '+cls;e.textContent=text;e.hidden=true;app.host.append(e);defs.push({e,p:p.clone()});}
 const up=new T.Vector3(0,.9,0);
 lab('Mahalliy guruh · siz shu yerdasiz',LGP.clone().add(new T.Vector3(0,1.3,0)),'mw-sun');
 const lbl={'Virgo':'Virgo klasteri · M87*','Fornax':'Fornax klasteri','Hydra':'Hydra klasteri','Centaurus':'Centaurus klasteri','Norma':'Norma klasteri · Buyuk Tortuvchi tomon','Perseus':'Perseus klasteri','Coma':'Coma klasteri','Shapley':'Shapley superklasteri'};
 for(const k of Object.keys(lbl)){const it=pick(k);if(it)lab(lbl[k],it.pos.clone().add(up));}
 lab('Mahalliy guruh harakati ≈ 620 km/s (CMB ga nisbatan)',LGP.clone().addScaledVector(mv,8.6));
 [50,100,150].forEach(r=>lab(r+' Mpk ≈ '+Math.round(r*MLY)+' mln y.y.',new T.Vector3(LGP.x+r/UMPC,LGP.y,LGP.z)));
 function updateLabels(){const occ=[];for(const l of defs){const show=Math.abs(j.q-5)<.42&&g.visible;if(!show){l.e.hidden=true;continue;}const v=g.localToWorld(l.p.clone()).project(j.camera);const px=(v.x+1)*.5*app.host.clientWidth,py=(1-v.y)*.5*app.host.clientHeight;let hide=Math.abs(v.x)>.95||Math.abs(v.y)>.9||v.z>1;if(!hide&&occ.some(o=>Math.abs(o.x-px)<135&&Math.abs(o.y-py)<20))hide=true;if(!hide)occ.push({x:px,y:py});l.e.hidden=hide;l.e.style.left=px+'px';l.e.style.top=py+'px';}}
 const ring=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(rtex),toneMapped:false,depthWrite:false,transparent:true}));ring.scale.setScalar(2);ring.visible=false;model.add(ring);
 const sp=x=>String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
 function detail(it){const d=$('#lanDetail');if(!d)return;d.innerHTML='<b>'+it.name+'</b><br>'+(it.mpc?'Masofa: ≈ '+Math.round(it.mpc)+' Mpk ≈ '+sp(it.mpc*MLY)+' mln y.y.<br>':'')+it.info;ring.position.copy(it.pos);ring.visible=true;}
 function extra(){const info=$('#cosmicInfo');if(!info||info.querySelector('#lanExtra'))return;const d=document.createElement('div');d.id='lanExtra';
  d.innerHTML='<h3>Ma‘lumot va cheklovlar</h3><p>Har bir nuqta — 2MRS katalogidagi bitta galaktika (jami '+sp(n)+' ta ko‘rsatilgan). Yo‘nalish — katalogdan; masofa — qizil siljish (CMB sistemasida) ÷ 70 km/s/Mpk. Rang: sarg‘ish — elliptik/linzasimon, ko‘kimtir — spiral/tartibsiz, kulrang — turi noma‘lum. 1 birlik ≈ 13 mln y.y. Halqalar Somon Yo‘li tekisligida.</p><p class="mw-warn">Cheklovlar: katalog yorqinlik bo‘yicha cheklangan, shuning uchun uzoqda faqat yorqin galaktikalar qoladi va zichlik kamayadi — bu haqiqiy bo‘shliq emas. Somon Yo‘li tekisligi bo‘ylab (galaktik tekislikdagi yo‘l) kuzatuvlar siyrak («qochish zonasi»). Klasterlardagi cho‘zilgan iplar («Fingers of God») guruhlar bo‘yicha siqilgan; ≈ 9 Mpk gacha bo‘lgan guruhsiz galaktikalar masofasi ishonchsiz bo‘lgani uchun ko‘rsatilmagan. Laniakea chegarasi (diametri ≈ 160 Mpk ≈ 520 mln y.y.) chizilmagan — u tezlik maydonini talab qiladi.</p><select id="lanSel" aria-label="Obyekt"><option value="">Obyekt tanlang…</option>'+items.map((x,i)=>'<option value="'+i+'">'+x.name+'</option>').join('')+'</select><p id="lanDetail"></p>';
  info.append(d);const sel=d.querySelector('#lanSel');sel.onchange=()=>{if(sel.value!=='')detail(items[+sel.value]);};}
 const oldFrame=j.frame.bind(j),oldStop=j.stop.bind(j);
 j.frame=function(dt){oldFrame(dt);if(j.detail?.active)return;const k=Math.round(j.q);if(k===5)extra();if(ring.visible)ring.scale.setScalar(2.2+.35*Math.sin(performance.now()/300));updateLabels();};
 j.stop=function(...a){oldStop(...a);defs.forEach(l=>l.e.hidden=true);};
 j.lan={items,model,posOf,count:n};
})();
