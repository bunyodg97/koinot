(()=>{'use strict';
 const app=window.koinot,j=app?.journey,K=j?.kit;if(!j||!K)return;
 const T=K.T,SD=window.KOINOT_SKY,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

 const bd=new T.Group();bd.visible=false;K.scene.add(bd);const R=900,EPS=23.4393*Math.PI/180,ce=Math.cos(EPS),se=Math.sin(EPS);
 const toScene=(raDeg,dec,r=R)=>{const a=raDeg*Math.PI/180,d=dec*Math.PI/180,x=Math.cos(d)*Math.cos(a),y=Math.cos(d)*Math.sin(a),z=Math.sin(d);const ye=y*ce+z*se,ze=-y*se+z*ce;return [x*r,ze*r,-ye*r];};
 let starMat=null,lineMat=null;const sprites=[];
 if(SD){
  const P=[],C=[],S=[];
  for(const s of SD.stars){const [x,y,z]=toScene(s[0],s[1]);P.push(x,y,z);const bv=s[3],b=clamp(.6+(6.3-s[2])*.14,.55,1);
   const c=bv<.1?[.72,.82,1]:bv<.45?[.9,.94,1]:bv<.8?[1,.96,.88]:bv<1.2?[1,.84,.62]:[1,.66,.46];C.push(c[0]*b,c[1]*b,c[2]*b);S.push(Math.max(2,(6.9-s[2])*1.05));}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(P,3));g.setAttribute('col',new T.Float32BufferAttribute(C,3));g.setAttribute('size',new T.Float32BufferAttribute(S,1));
  starMat=new T.ShaderMaterial({uniforms:{op:{value:1},px:{value:Math.min(2,window.devicePixelRatio||1)}},vertexShader:'attribute float size;attribute vec3 col;varying vec3 vC;uniform float px;void main(){vC=col;gl_PointSize=size*px;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:'varying vec3 vC;uniform float op;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,.04,d);gl_FragColor=vec4(vC*a*op,1.);}',transparent:true,blending:T.AdditiveBlending,depthWrite:false});
  const pts=new T.Points(g,starMat);pts.frustumCulled=false;bd.add(pts);

  const L=[];for(const c of SD.cons)for(const pl of c[4])for(let i=1;i<pl.length;i++){L.push(...toScene(pl[i-1][0],pl[i-1][1],R*.995),...toScene(pl[i][0],pl[i][1],R*.995));}
  const lg=new T.BufferGeometry();lg.setAttribute('position',new T.Float32BufferAttribute(L,3));lineMat=new T.LineBasicMaterial({color:0x6fb7ff,transparent:true,opacity:.12,depthWrite:false,toneMapped:false});const ls=new T.LineSegments(lg,lineMat);ls.frustumCulled=false;bd.add(ls);

  const COL={G:0xffb98a,GCl:0xffd9a0,OCl:0xbfe0ff,PN:0x8fffd8,Neb:0xff9ec7,HII:0xff9ec7,SNR:0xff9ec7,RfN:0x9ec7ff,EmN:0xff9ec7,'Cl+N':0xffc0d8,'*Ass':0xbfe0ff};
  const NAMES={M31:'M31 · Andromeda galaktikasi',M42:'M42 · Orion tumanligi',M45:'M45 · Parvin (Pleyadalar)',M44:'M44 · Praesepe to‘dasi',M13:'M13 · Gerkules sharsimon to‘dasi',M1:'M1 · Qisqichbaqasimon tumanlik',M57:'M57 · Uzuk tumanligi',M27:'M27 · Gantel tumanligi',M33:'M33 · Uchburchak galaktikasi',M51:'M51 · Girdob galaktikasi'};
  for(const d of SD.dso){if(!d[0])continue;const [x,y,z]=toScene(d[3],d[4],R*.99);const sz=Math.max(11,(d[6]||5)/60*Math.PI/180*R*1.4);
   const sp=new T.Sprite(new T.SpriteMaterial({map:K.glow,color:COL[d[2]]||0xffffff,transparent:true,opacity:.5,depthWrite:false,toneMapped:false,blending:T.AdditiveBlending}));sp.position.set(x,y,z);sp.scale.set(sz,sz*(d[2]==='G'?.55:1),1);sp.material.rotation=.6;bd.add(sp);sprites.push(sp);
   if(NAMES[d[0]])K.label(bd,NAMES[d[0]],[x,y,z]);}
 }

 const g1=K.groups[1],rnd=K.rand;
 function belt(r0,r1,n,h,col,name,labelAt){const p=[],c=[];for(let i=0;i<n;i++){const r=r0+(r1-r0)*(rnd()+rnd())/2,a=rnd()*Math.PI*2;p.push(Math.cos(a)*r,(rnd()+rnd()+rnd()-1.5)*h,Math.sin(a)*r);const b=.4+rnd()*.6;c.push(col[0]*b,col[1]*b,col[2]*b);}const pc=K.cloud(g1,p,c,.3);if(name)K.label(g1,name,[Math.cos(labelAt)*r1*1.02,.8,Math.sin(labelAt)*r1*1.02]);return pc;}
 j.schematicBelt=belt(34*.35,38*.35,2600,.7,[.85,.72,.58],'Asosiy asteroid kamari',2.4);

 const SB=KX.sb;
 if(SB&&app.bodies.get('neptune')){
  const ids=[['mercury',.387],['venus',.723],['earth',1],['mars',1.524],['jupiter',5.203],['saturn',9.537],['uranus',19.19],['neptune',30.07]],M=[[0,0]];
  for(const [id,au] of ids){const b=app.bodies.get(id);if(b)M.push([au,b.data.orbit*.35]);}
  const sl=(M[M.length-1][1]-M[M.length-2][1])/(M[M.length-1][0]-M[M.length-2][0]);
  const map=r=>{for(let i=1;i<M.length;i++)if(r<=M[i][0])return M[i-1][1]+(M[i][1]-M[i-1][1])*(r-M[i-1][0])/(M[i][0]-M[i-1][0]);const l=M[M.length-1];return l[1]+(r-l[0])*sl*.55;};
  j.auMap=map;const now=new Date();SB.compute(now.getTime()/86400000+2440587.5-2451544.5);
  const P=[],C=[],COL={1:[1,.35,.3],2:[1,.7,.28],3:[.3,.85,1],4:[.72,.55,1]};let cnt=0;
  for(let k=0;k<SB.n;k++){const c=SB.cls[k];if(c>4)continue;if(c===2&&(k%11))continue;const x=SB.X[k],y=SB.Y[k],z=SB.Z[k],r=Math.hypot(x,y);if(r<.05||r>140)continue;const rs=map(r),f=rs/r,br=.55+rnd()*.45;
   P.push(x*f,z*f*(c>=3?1:.6),-y*f);const cl=COL[c];C.push(cl[0]*br,cl[1]*br,cl[2]*br);cnt++;}
  K.cloud(g1,P,C,.34);K.label(g1,'Kuiper kamari (haqiqiy TNO — MPC)',[0,.8,-map(44)]);
  j.realBodies=cnt;
 }

 const f0=j.frame;j.frame=function(dt){const q=this.q,op=1-clamp((q-.9)/.9,0,1);bd.visible=op>.01&&this.active;if(bd.visible){if(starMat)starMat.uniforms.op.value=op;if(lineMat)lineMat.opacity=.12*op;for(const s of sprites)s.material.opacity=.5*op;}return f0.call(this,dt);};

 const bn=document.createElement('div');bn.id='jFlyBanner';bn.hidden=true;bn.setAttribute('aria-live','polite');document.body.append(bn);
 const stageNames=()=>[...document.querySelectorAll('[data-stage]')].sort((a,b)=>a.dataset.stage-b.dataset.stage).map(b=>b.textContent.trim().replace(/\s+/g,' '));
 let SN=null,lastW=-1,hideT=0;const fov0=j.camera.fov;
 const f1=j.frame;j.frame=function(dt){const r=f1.call(this,dt);const sp=Math.abs(this.wanted-this.q);
  if(this.active&&sp>.04){if(!SN||!SN.length)SN=stageNames();const w=Math.round(this.wanted);if(w!==lastW||bn.hidden){lastW=w;bn.textContent='→ '+(SN[w]||'');}bn.hidden=false;bn.style.opacity=Math.min(1,sp*1.6);hideT=0;}
  else if(!bn.hidden){hideT+=dt||.016;if(hideT>.9)bn.hidden=true;else bn.style.opacity=Math.max(0,1-hideT/.9);}
  const nf=fov0*(1+Math.min(.28,sp*.22));if(Math.abs(j.camera.fov-nf)>.05){j.camera.fov=nf;j.camera.updateProjectionMatrix();}
  return r;};
 j.backdrop={group:bd,stars:SD?SD.stars.length:0};
})();
