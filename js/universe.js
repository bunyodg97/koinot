(()=>{'use strict';
 const app=window.koinot,j=app?.journey,U=window.KOINOT_UNI;if(!j||!window.THREE||!U)return;
 const T=THREE,g=j.groups[7],$=s=>document.querySelector(s),GLY=U.horizon_gly/28;
 for(const o of [...g.children]){g.remove(o);o.geometry?.dispose();o.material?.dispose?.();}
 const tex=document.createElement('canvas');tex.width=tex.height=64;{const c=tex.getContext('2d'),gr=c.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.2,'rgba(255,255,255,.8)');gr.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=gr;c.fillRect(0,0,64,64);}
 const glow=new T.CanvasTexture(tex);
 const model=new T.Group();model.name='universe-model';g.add(model);

 const cmbR=U.cmb_gly/GLY,cmbTex=new T.Texture();const im=new Image();im.onload=()=>{cmbTex.image=im;cmbTex.colorSpace=T.SRGBColorSpace;cmbTex.needsUpdate=true;};im.src=U.img;
 const cmb=new T.Mesh(new T.SphereGeometry(cmbR,64,32),new T.MeshBasicMaterial({map:cmbTex,transparent:true,opacity:.38,side:T.BackSide,depthWrite:false,toneMapped:false}));cmb.rotation.y=Math.PI;model.add(cmb);

 const shells=[],cols=[0x73eaff,0x7fd6ff,0x9fc2ff,0xc8b0ff,0xffb3d9,0xffc177];
 U.shells.slice(0,-1).forEach((s,i)=>{const r=s[1]/GLY;const m=new T.Mesh(new T.SphereGeometry(r,36,18),new T.MeshBasicMaterial({color:cols[i],wireframe:true,transparent:true,opacity:.07,depthWrite:false}));model.add(m);shells.push({z:s[0],gly:s[1],lb:s[2],r,mesh:m});});

 const mk=new T.Sprite(new T.SpriteMaterial({map:glow,color:0xffffff,toneMapped:false,depthWrite:false,transparent:true,blending:T.AdditiveBlending}));mk.scale.set(1.6,1.6,1.6);model.add(mk);
 const prev=new T.Mesh(new T.SphereGeometry(.835/GLY,24,12),new T.MeshBasicMaterial({color:0xffc177,wireframe:true,transparent:true,opacity:.35,depthWrite:false}));model.add(prev);
 const fmt=x=>String(x).replace('.',',');
 const items=[{name:'Kuzatuvchi (siz) — markaz',info:'Kuzatiladigan koinotning markazi — bu har bir kuzatuvchi uchun o‘zining joyi. Boshqa joydagi kuzatuvchining «kuzatiladigan koinoti» boshqacha bo‘ladi.',r:0}];
 shells.forEach(s=>items.push({name:'z = '+fmt(s.z)+' · '+fmt(s.gly)+' mlrd y.y.',info:'Qo‘shiluvchi (comoving) masofa ≈ '+fmt(s.gly)+' mlrd y.y.; bu obyektlardan yorug‘lik bizga ≈ '+fmt(s.lb)+' mlrd yil oldin yo‘lga chiqqan (koinot yoshi hozir ≈ '+fmt(U.age_gyr)+' mlrd yil).'+(s.z===14.4?' Shunday qizil siljishdagi eng uzoq galaktikalar JWST bilan tasdiqlangan (rekord o‘zgarishi mumkin).':s.z===6?' Reionizatsiya davri tugayotgan payt.':''),r:s.r,mesh:s.mesh}));
 items.push({name:'KMF (z ≈ 1100) · '+fmt(U.cmb_gly)+' mlrd y.y.',info:'Kosmik mikroto‘lqin foni: koinot ≈ 380 000 yoshda bo‘lgan paytda chiqqan yorug‘lik; biz ko‘radigan eng uzoq «devor». Tasvir — simulyatsiya (CAMB, Planck 2018 parametrlari), haqiqiy xarita emas; rang ≈ ±300 µK harorat tebranishlari.',r:cmbR});
 const defs=[];function lab(text,p,cls=''){const e=document.createElement('span');e.className='journey-label mw-label '+cls;e.textContent=text;e.hidden=true;app.host.append(e);defs.push({e,p:p.clone()});}
 lab('Siz shu yerdasiz (markaz)',new T.Vector3(0,1.3,0),'mw-sun');
 lab('Oldingi bosqich: kosmik to‘r hajmi (radius ≈ 0,84 mlrd y.y.)',new T.Vector3(0,-1.6,0));
 shells.forEach((s,i)=>{const a=i*1.05+.4;lab('z = '+fmt(s.z)+' · '+fmt(s.gly)+' mlrd y.y.',new T.Vector3(Math.cos(a)*s.r,Math.sin(a*.7)*s.r*.35,Math.sin(a)*s.r));});
 lab('KMF · '+fmt(U.cmb_gly)+' mlrd y.y. (z ≈ 1100)',new T.Vector3(cmbR*.95,cmbR*.18,0));
 lab('Kuzatuv ufqi ≈ '+fmt(U.horizon_gly.toFixed(0))+' mlrd y.y. — koinot chegarasi emas',new T.Vector3(-28,0,0));
 function updateLabels(){const occ=[];for(const l of defs){const show=Math.abs(j.q-7)<.42&&g.visible;if(!show){l.e.hidden=true;continue;}const v=g.localToWorld(l.p.clone()).project(j.camera);const px=(v.x+1)*.5*app.host.clientWidth,py=(1-v.y)*.5*app.host.clientHeight;let hide=Math.abs(v.x)>.95||Math.abs(v.y)>.9||v.z>1;if(!hide&&occ.some(o=>Math.abs(o.x-px)<140&&Math.abs(o.y-py)<20))hide=true;if(!hide)occ.push({x:px,y:py});l.e.hidden=hide;l.e.style.left=px+'px';l.e.style.top=py+'px';}}
 function pick(i){const it=items[i],d=$('#uniDetail');shells.forEach(s=>s.mesh.material.opacity=.07);if(it.mesh)it.mesh.material.opacity=.5;if(d)d.innerHTML='<b>'+it.name+'</b><br>'+it.info;}
 function extra(){const info=$('#cosmicInfo');if(!info||info.querySelector('#uniExtra'))return;const d=document.createElement('div');d.id='uniExtra';
  d.innerHTML='<h3>Nimani ko‘ryapsiz</h3><p>Markazda — siz. Sharsimon qobiqlar — qizil siljish (z) bo‘yicha qo‘shiluvchi masofalar (Planck 2018 kosmologiyasi, hisob: astropy). Eng tashqi, rangli sfera — kosmik mikroto‘lqin foni (KMF).</p><p class="mw-warn">KMF tasviri — simulyatsiya (CAMB spektridan tasodifiy realizatsiya), Planck o‘lchagan haqiqiy xarita EMAS. «Kuzatiladigan koinot» butun koinot emas — bizga yorug‘lik yetib kelishga ulgurgan hudud (≈ 46 mlrd y.y. radiusli, koinot kengayishi hisobga olingan). Masofalar yorug‘lik yurgan yo‘l emas, hozirgi qo‘shiluvchi masofa.</p><label class="uni-tg"><input type="checkbox" id="uniCmb" checked> KMF sferasini ko‘rsatish</label><select id="uniSel" aria-label="Qobiq"><option value="">Qobiq tanlang…</option>'+items.map((x,i)=>'<option value="'+i+'">'+x.name+'</option>').join('')+'</select><p id="uniDetail"></p>';
  info.append(d);d.querySelector('#uniSel').onchange=e=>{if(e.target.value!=='')pick(+e.target.value);};d.querySelector('#uniCmb').onchange=e=>{cmb.visible=e.target.checked;};}
 const oldFrame=j.frame.bind(j),oldStop=j.stop.bind(j);
 j.frame=function(dt){oldFrame(dt);if(j.detail?.active)return;if(Math.round(j.q)===7)extra();updateLabels();};
 j.stop=function(...a){oldStop(...a);defs.forEach(l=>l.e.hidden=true);};
 j.uni={items,model,shells,cmb};
})();
