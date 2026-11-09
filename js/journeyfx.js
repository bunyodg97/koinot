(()=>{'use strict';
 const app=window.koinot,j=app?.journey,K=j?.kit;if(!j||!K||!app.renderer)return;
 const T=K.T,R=app.renderer,orig=R.render.bind(R),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 let saved=null;try{saved=JSON.parse(localStorage.getItem('koinot-fx')||'null');}catch{}
 const sv=()=>{try{localStorage.setItem('koinot-fx',JSON.stringify({on:fx.on,neb:fx.neb}));}catch{}};
 const fx=window.KX&&(KX.fx={on:!(saved&&saved.on===false),neb:!(saved&&saved.neb===false),bloom:true,set(v){fx.on=!!v;sv();},setNeb(v){fx.neb=!!v;sv();}})||{on:true,neb:true,bloom:true};
 let busy=false,ok=true;
 const fsCam=new T.OrthographicCamera(-1,1,1,-1,0,1),quadGeo=new T.PlaneGeometry(2,2);
 const VS='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
 const mk=(fs,uni,extra)=>new T.ShaderMaterial(Object.assign({uniforms:uni,vertexShader:VS,fragmentShader:fs,depthTest:false,depthWrite:false,toneMapped:false},extra||{}));
 const fsScene=new T.Scene(),quad=new T.Mesh(quadGeo,null);quad.frustumCulled=false;fsScene.add(quad);
 function pass(mat,target,clear){quad.material=mat;busy=true;R.setRenderTarget(target||null);const ac=R.autoClear;R.autoClear=!!clear;orig(fsScene,fsCam);R.autoClear=ac;R.setRenderTarget(null);busy=false;}

 const NOISE=`float h(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
 float vn(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z);}
 float fbm(vec3 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*vn(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=.5;}return s;}`;
 const BAKE=`varying vec2 vUv;${NOISE}
 void main(){float lon=vUv.x*6.2831853,lat=(vUv.y-.5)*3.1415927;vec3 d=vec3(cos(lat)*cos(lon),sin(lat),cos(lat)*sin(lon));
  vec3 p=d*2.3;vec3 q=vec3(fbm(p),fbm(p+vec3(5.2,1.3,2.8)),fbm(p+vec3(9.1,4.7,6.3)));float n=fbm(p+2.2*q);
  float body=smoothstep(.42,.92,n);float fil=smoothstep(.5,.88,fbm(p*2.9+q*1.6+7.));float big=smoothstep(.26,.6,fbm(d*1.15+3.));
  float dust=smoothstep(.55,.85,fbm(p*1.7+q*2.+13.));float rid=pow(1.-abs(fbm(p*3.4+q*2.1+21.)*2.-1.),5.);
  vec3 cA=vec3(.08,.12,.42),cB=vec3(.62,.12,.30),cC=vec3(.04,.42,.50),cD=vec3(.95,.62,.22);
  vec3 col=mix(cA,cB,smoothstep(.25,.85,q.x))*body+cC*fil*.9*body+cD*fil*fil*body*.9+mix(cC,cD,q.y)*rid*(.25+body)*1.1;
  col*=big;col*=1.-.5*dust;col*=3.2;gl_FragColor=vec4(col,1.);}`;
 let nebTex=null,nebMesh=null,nebMat=null;
 function bake(){const rt=new T.WebGLRenderTarget(2048,1024,{minFilter:T.LinearFilter,magFilter:T.LinearFilter,depthBuffer:false,generateMipmaps:false});
  pass(mk(BAKE,{}),rt,true);nebTex=rt.texture;
  nebMat=new T.ShaderMaterial({uniforms:{map:{value:nebTex},tint:{value:new T.Vector3(1,1,1)},amp:{value:.5}},side:T.BackSide,transparent:true,depthWrite:false,depthTest:false,blending:T.AdditiveBlending,toneMapped:false,
   vertexShader:'varying vec3 vD;void main(){vD=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:'varying vec3 vD;uniform sampler2D map;uniform vec3 tint;uniform float amp;void main(){vec3 d=normalize(vD);vec2 uv=vec2(atan(d.z,d.x)/6.2831853+.5,asin(clamp(d.y,-1.,1.))/3.1415927+.5);gl_FragColor=vec4(texture2D(map,uv).rgb*tint*amp,1.);}'});
  nebMesh=new T.Mesh(new T.SphereGeometry(1400,48,24),nebMat);nebMesh.frustumCulled=false;nebMesh.renderOrder=-100;K.scene.add(nebMesh);}

 const ST=[[.7,1,1,1],[.6,.9,1,1.1],[.6,1.25,.7,.85],[.45,1.2,.95,.7],[.3,.7,.85,1.2],[.18,.7,.9,1.1],[.16,.6,1,1.1],[.1,.8,.9,1.2]];
 function nebFrame(){if(!nebMesh)return;const q=clamp(j.q,0,7),i=Math.floor(q),f=q-i,a=ST[i],b=ST[Math.min(7,i+1)],m=k=>a[k]+(b[k]-a[k])*f;
  nebMat.uniforms.amp.value=m(0);nebMat.uniforms.tint.value.set(m(1),m(2),m(3));nebMesh.position.copy(j.camera.position);nebMesh.visible=!!fx.neb;}

 const BR=`varying vec2 vUv;uniform sampler2D tex;uniform float thr;void main(){vec3 c=texture2D(tex,vUv).rgb;float b=max(max(c.r,c.g),c.b);float w=smoothstep(thr,thr+.3,b);gl_FragColor=vec4(c*w,1.);}`;
 const BL=`varying vec2 vUv;uniform sampler2D tex;uniform vec2 dir;void main(){vec3 s=texture2D(tex,vUv).rgb*.2270;
  s+=(texture2D(tex,vUv+dir*1.385).rgb+texture2D(tex,vUv-dir*1.385).rgb)*.3162;s+=(texture2D(tex,vUv+dir*3.231).rgb+texture2D(tex,vUv-dir*3.231).rgb)*.0703;gl_FragColor=vec4(s,1.);}`;
 const ST_=`varying vec2 vUv;uniform sampler2D tex;uniform vec2 dir;void main(){vec3 s=vec3(0.);float w=1.,t=0.;for(int i=0;i<18;i++){float k=float(i);float wt=exp(-k*.19);s+=(texture2D(tex,vUv+dir*k).rgb+texture2D(tex,vUv-dir*k).rgb)*wt;t+=wt*2.;}gl_FragColor=vec4(s/t*3.,1.);}`;
 const CP=`varying vec2 vUv;uniform sampler2D a,b,c,d;uniform float g,sp;void main(){vec3 s=texture2D(a,vUv).rgb*.9+texture2D(b,vUv).rgb*.7+(texture2D(c,vUv).rgb+texture2D(d,vUv).rgb)*sp;gl_FragColor=vec4(s*g,1.);}`;
 const TN=`varying vec2 vUv;uniform sampler2D tex;uniform float k;void main(){vec3 c=texture2D(tex,vUv).rgb;float l=dot(c,vec3(.299,.587,.114));vec3 o=.84*pow(max(c,vec3(0.)),vec3(k));gl_FragColor=vec4(o,1.);}`;
 const VG=`varying vec2 vUv;uniform float v;void main(){vec2 p=vUv-.5;p.x*=1.15;float r=dot(p,p)*2.;float k=pow(clamp(r,0.,1.5),1.6)*v;vec3 m=mix(vec3(1.),vec3(.62,.70,.86),clamp(k,0.,1.));gl_FragColor=vec4(m,1.);}`;
 let P=null,W0=0,H0=0;
 function rts(w,h){const o={minFilter:T.LinearFilter,magFilter:T.LinearFilter,depthBuffer:false,generateMipmaps:false};return new T.WebGLRenderTarget(Math.max(2,w|0),Math.max(2,h|0),o);}
 function setup(W,H){if(P){P.fb.dispose();for(const k of ['A','B1','B2','C1','C2','S1','S2'])P[k].dispose();}
  const fb=new T.FramebufferTexture(W,H);fb.minFilter=T.LinearFilter;fb.magFilter=T.LinearFilter;fb.generateMipmaps=false;
  P={fb,A:rts(W/2,H/2),B1:rts(W/4,H/4),B2:rts(W/4,H/4),C1:rts(W/8,H/8),C2:rts(W/8,H/8),S1:rts(W/4,H/4),S2:rts(W/4,H/4)};
  P.mBR=mk(BR,{tex:{value:fb},thr:{value:.7}});P.mBR2=mk(BR,{tex:{value:fb},thr:{value:.9}});P.mBL=mk(BL,{tex:{value:null},dir:{value:new T.Vector2()}});P.mST=mk(ST_,{tex:{value:null},dir:{value:new T.Vector2()}});
  P.mCP=mk(CP,{a:{value:P.B2.texture},b:{value:P.C2.texture},c:{value:P.S1.texture},d:{value:P.S2.texture},g:{value:.7},sp:{value:.5}},{blending:T.AdditiveBlending,transparent:true});
  P.mTN=mk(TN,{tex:{value:fb},k:{value:1.25}});P.mVG=mk(VG,{v:{value:.75}},{transparent:true,blending:T.CustomBlending,blendEquation:T.AddEquation,blendSrc:T.ZeroFactor,blendDst:T.SrcColorFactor,blendSrcAlpha:T.ZeroFactor,blendDstAlpha:T.OneFactor});
  W0=W;H0=H;}
 const sz=new T.Vector2(),org=new T.Vector2(0,0);
 function post(){R.getDrawingBufferSize(sz);const W=sz.x|0,H=sz.y|0;if(W<64||H<64)return;if(!P||W!==W0||H!==H0)setup(W,H);
  R.copyFramebufferToTexture(org,P.fb);

  const cin=document.body.classList.contains('cinema');P.mBR.uniforms.thr.value=cin?.88:.7;P.mBR2.uniforms.thr.value=cin?1.15:.9;P.mCP.uniforms.g.value=cin?.34:.7;P.mCP.uniforms.sp.value=cin?.12:.5;P.mVG.uniforms.v.value=cin?.6:.75;
  if(cin)pass(P.mTN,null,false);
  if(fx.bloom){const blur=(src,tmp,out,w,h,r)=>{P.mBL.uniforms.tex.value=src.texture;P.mBL.uniforms.dir.value.set(r/w,0);pass(P.mBL,tmp,false);P.mBL.uniforms.tex.value=tmp.texture;P.mBL.uniforms.dir.value.set(0,r/h);pass(P.mBL,out,false);};
   pass(P.mBR,P.A,false);blur(P.A,P.B1,P.B2,W/4,H/4,1.4);blur(P.B2,P.C1,P.C2,W/8,H/8,2.2);
   pass(P.mBR2,P.A,false);P.mST.uniforms.tex.value=P.A.texture;P.mST.uniforms.dir.value.set(3.2/(W/4),0);pass(P.mST,P.S1,false);P.mST.uniforms.dir.value.set(0,3.2/(H/4));pass(P.mST,P.S2,false);
   pass(P.mCP,null,false);}
  pass(P.mVG,null,false);}
 R.render=function(sc,cam){orig(sc,cam);if(busy||!ok||!fx.on||sc!==K.scene||!j.active||app.quality==='low'||document.hidden)return;
  try{if(!nebMesh&&fx.neb){bake();}post();}catch(e){ok=false;console.warn('KOINOT fx o‘chirildi:',e);if(nebMesh)nebMesh.visible=false;}};
 const f0=j.frame;j.frame=function(dt){if(ok&&fx.neb&&app.quality!=='low'){if(!nebMesh&&fx.neb)try{bake();}catch(e){ok=false;console.warn(e);}nebFrame();}else if(nebMesh)nebMesh.visible=false;return f0.call(this,dt);};
 fx.dbg=()=>({ok,neb:!!nebMesh,P:!!P,W0,H0,vis:nebMesh&&nebMesh.visible,amp:nebMat&&nebMat.uniforms.amp.value});j.fx=fx;
})();
