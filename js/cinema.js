(()=>{'use strict';
 const app=window.koinot,j=app?.journey,K=j?.kit;if(!j||!K)return;const KX=window.KX=window.KX||{},T=K.T,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),sm=x=>{x=clamp(x,0,1);return x*x*(3-2*x);};
 const SEQ=[1,2,3,4,5,6,7,6,5,4,3,2,1,0];
 const DWELL={0:20,1:84,2:30,3:34,4:24,5:24,6:24,7:28},TRAVEL=16;
 const SPEC={0:{m0:1,m1:.6,R:0,ys:.05},2:{m0:.7,m1:.35,R:12,ys:.04},3:{m0:.8,m1:.45,R:10,ys:.035},4:{m0:.9,m1:.6,R:6,ys:.03},5:{m0:.9,m1:.7,R:5,ys:.03},6:{m0:1,m1:.8,R:4,ys:.025},7:{m0:1,m1:.9,R:3,ys:.02}};
 const TOUR=['Quyosh','Venera','Yer','Mars','Yupiter','Saturn','Uran','Neptun'];
 const S={active:false,idx:0,mode:'dwell',u:0,yaw:.2,lm:0,off:new T.Vector3(),tOff:new T.Vector3(),tMul:1,roll:0,saved:null,wl:null,hint:0,idle:0};
 const planetInfo=name=>{const l=K.labels.find(l=>l.g===K.groups[1]&&l.e.textContent===name);if(!l)return null;let r=1;for(const b of app.bodies.values())if(b.data.name===name)r=b.data.radius*.35;return {p:l.p,r};};
 let hint=null;
 function ensureDom(){if(hint)return;hint=document.createElement('div');hint.id='cineHint';hint.textContent='Chiqish: Esc yoki ikki marta bosing';document.body.append(hint);}

 function targets(dt){const stage=S.mode==='dwell'?SEQ[S.idx]:SEQ[S.idx],dw=DWELL[stage];let mul=1,R=0,ys=.04,off=S.tOff.set(0,0,0);
  if(S.mode==='dwell'){const u=S.u;
   if(stage===1){const t=u-9;if(t<0){mul=.9-.35*sm(u/9);R=0;}else{const k=Math.min(TOUR.length-1,Math.floor(t/8.6)),pi=planetInfo(TOUR[k]);if(pi){off.copy(pi.p);const asp=Math.max(1,1/app.camera.aspect);mul=Math.max(.01,pi.r*(TOUR[k]==='Saturn'?8:TOUR[k]==='Quyosh'?4.2:5.5)/(66*asp));}ys=.07;}}
   else{const sp=SPEC[stage]||SPEC[7];mul=sp.m0+(sp.m1-sp.m0)*sm(u/dw);R=sp.R;ys=sp.ys;off.set(Math.sin(u*.05)*R,Math.sin(u*.037)*R*.4,Math.cos(u*.043)*R);}}
  return {mul,off,ys};}
 function frame(dt){if(!S.active)return;dt=Math.min(dt||.016,.1);S.u+=dt;const stage=SEQ[S.idx];
  if(S.mode==='dwell'){if(S.u>=DWELL[stage]){S.mode='travel';S.u=0;S.from=stage;S.to=SEQ[(S.idx+1)%SEQ.length];}}
  else{const u=S.u;j.auto=false;if(u>3){j.wanted=S.from+(S.to-S.from)*sm((u-3)/10);}if(u>=TRAVEL){S.mode='dwell';S.u=0;S.idx=(S.idx+1)%SEQ.length;j.wanted=S.to;}}
  const tg=S.mode==='dwell'?targets(dt):{mul:1,off:S.tOff.set(0,0,0),ys:.05};
  const trav=S.mode==='travel',kk=trav?1.6:(SEQ[S.idx]===1&&S.u>9?.75:.9);
  S.lm+=(Math.log(tg.mul)-S.lm)*(1-Math.exp(-dt*kk));S.off.lerp(tg.off,1-Math.exp(-dt*kk));
  S.yaw+=dt*(trav?.06:tg.ys);const e=.38+.2*Math.sin(S.u*.09+S.idx),roll=.045*Math.sin(S.u*.07+S.idx*1.7);
  S.roll+=(roll-S.roll)*(1-Math.exp(-dt*.8));
  const gc=K.groups[1].children.length;if(!S.pts||S.gc!==gc){S.gc=gc;S.pts=[];K.groups[1].traverse(o=>{if(o.isPoints&&o.material&&!o.material.isShaderMaterial&&typeof o.material.size==='number'){const u=o.material.userData;if(u.baseSize==null)u.baseSize=o.material.size;S.pts.push([o.material,u.baseSize]);}});}
  const pf=clamp(Math.exp(S.lm)/.35,.07,1);for(const [m,b] of S.pts)m.size=b*pf;
  app.yaw=S.yaw;app.elevation=e;j.camMul=Math.exp(S.lm);S.hint=Math.max(0,S.hint-dt);document.body.classList.toggle('cine-hint',S.hint>0);S.idle+=dt;document.body.classList.toggle('cine-idle',S.idle>2.5);}
 j.postCam=function(cam,ft){if(!S.active)return;cam.position.add(S.off);cam.lookAt(ft.x+S.off.x,ft.y+S.off.y,ft.z+S.off.z);cam.rotateZ(S.roll);};
 const f0=j.frame;j.frame=function(dt){frame(dt);return f0.call(this,dt);};

 async function start(){if(S.active)return;ensureDom();S.active=true;S.idx=0;S.mode='dwell';S.u=0;S.yaw=.2;S.lm=Math.log(.9);S.off.set(0,0,0);S.roll=0;S.hint=3.5;S.idle=0;
  const au=KX.audio;S.saved=au?{music:au.cfg.music,sfx:au.cfg.sfx}:null;if(au){au.set('music',true);au.set('sfx',true);}
  document.body.classList.add('cinema');j.start(1);j.auto=false;j.wanted=1;
  try{const el=document.documentElement;if(el.requestFullscreen&&!document.fullscreenElement)await el.requestFullscreen({navigationUI:'hide'});}catch{}
  try{if(navigator.wakeLock)S.wl=await navigator.wakeLock.request('screen');}catch{}
  window.dispatchEvent(new Event('resize'));}
 function stop(){if(!S.active)return;S.active=false;document.body.classList.remove('cinema','cine-hint','cine-idle');j.camMul=1;if(S.pts)for(const [m,b] of S.pts)m.size=b;S.pts=null;try{j.stop();}catch{}
  const au=KX.audio;if(au&&S.saved){au.set('music',S.saved.music);au.set('sfx',S.saved.sfx);}
  try{if(document.fullscreenElement)document.exitFullscreen();}catch{}try{S.wl?.release();}catch{}S.wl=null;window.dispatchEvent(new Event('resize'));}
 window.addEventListener('keydown',e=>{if(S.active&&e.key==='Escape'){e.stopPropagation();stop();}},true);
 window.addEventListener('dblclick',()=>{if(S.active)stop();});
 document.addEventListener('fullscreenchange',()=>{if(S.active&&!document.fullscreenElement)stop();});
 window.addEventListener('pointermove',()=>{if(S.active){S.idle=0;S.hint=2.5;}},{passive:true});
 document.addEventListener('visibilitychange',async()=>{if(S.active&&!document.hidden&&navigator.wakeLock&&!S.wl){try{S.wl=await navigator.wakeLock.request('screen');}catch{}}});
 KX.cinema={start,stop,S,SEQ,seek(idx,u=0,mode='dwell'){S.idx=idx;S.u=u;S.mode=mode;if(mode==='dwell')j.wanted=SEQ[idx];}};
})();
