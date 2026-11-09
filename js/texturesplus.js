(()=>{'use strict';
 const app=window.koinot,M=window.KoinotMaterials;if(!app||!M||!window.THREE)return;const T=THREE,j=app.journey;
 const HD=window.KOINOT_HD=window.KOINOT_HD||{},loaded={},extra={};
 const GROUPS=[['earth','assets/textures/hd/hd_earth.js'],['moon','assets/textures/hd/hd_moon.js'],['mars','assets/textures/hd/hd_mars.js'],['outer','assets/textures/hd/hd_outer.js']];
 const BASE={earth:'2k_earth_daymap.jpg',moon:'2k_moon.jpg',mars:'2k_mars.jpg',pluto:'illustration_pluto.png',titan:'illustration_titan.png',europa:'illustration_europa.png',ganymede:'illustration_ganymede.png',callisto:'illustration_callisto.png',io:'illustration_io.png'};
 const HDKEY={earth:'earth_day',moon:'moon',mars:'mars',pluto:'pluto',titan:'titan',europa:'europa',ganymede:'ganymede',callisto:'callisto',io:'io'};
 const NOTE={pluto:'Tekstura: NASA New Horizons (Ralph/MVIC) rangli mozaikasi; aniqlik hududlar bo‘yicha farq qiladi.',titan:'Tekstura: Cassini ISS infraqizil (938 nm) albedo xaritasi; ko‘zga ko‘rinadigan rang emas — ranglar taxminiy (haqiqiy Titan qalin to‘q-sariq tuman bilan qoplangan).',
  europa:'Tekstura: NASA/JPL/USGS Voyager–Galileo global mozaikasi (past ruxsatli).',ganymede:'Tekstura: NASA/JPL Voyager global mozaikasi (eski, past ruxsatli).',callisto:'Tekstura: NASA/JPL Voyager global mozaikasi (eski, past ruxsatli).',io:'Tekstura: NASA/JPL/USGS Galileo SSI global rangli xaritasi.'};
 const texCache={};const mkTex=(key,linear)=>{if(texCache[key])return texCache[key];const t=new T.TextureLoader().load(HD[key]);t.colorSpace=linear?T.NoColorSpace:T.SRGBColorSpace;t.anisotropy=4;return texCache[key]=t;};
 function upgradeBase(id){const old=BASE[id],key=HDKEY[id];if(!old||!HD[key]||loaded['b'+id])return;loaded['b'+id]=1;
  try{const tx=M.texture(old),img=new Image();img.onload=()=>{tx.dispose();tx.image=img;tx.needsUpdate=true;};img.src=HD[key];}catch(e){console.warn('HD tekstura:',id,e);}
  const cat=window.KOINOT_CATALOG?.find(d=>d.id===id);if(cat&&NOTE[id]){cat.note=cat.note.replace(' Bu tekstura badiiy-protseduraviy, haqiqiy sirt xaritasi emas.','')+' '+NOTE[id];cat.subtitle=(cat.subtitle||'').replace(' · taxminiy tekstura','');}}
 function applyMat(m,id){if(!m||!m.isMeshStandardMaterial||m.userData.hd)return;
  if(id==='earth'&&HD.earth_normal){m.normalMap=mkTex('earth_normal',true);m.normalScale=new T.Vector2(.85,.85);m.roughnessMap=mkTex('earth_rough',true);m.roughness=.9;m.userData.hd=1;m.needsUpdate=true;}
  else if(id==='mars'&&HD.mars_bump){m.bumpMap=mkTex('mars_bump',true);m.bumpScale=1.6;m.userData.hd=1;m.needsUpdate=true;}
  else if(id==='titan'&&HD.titan){m.color=new T.Color('#e0a860');m.userData.hd=1;m.needsUpdate=true;}}
 const origMat=M.material;M.material=function(d){const m=origMat.call(M,d);try{applyMat(m,d.id);}catch(e){}return m;};
 function sweep(){const scenes=[app.scene,j?.kit?.scene,app.previewScene].filter(Boolean);for(const sc of scenes)sc.traverse(o=>{if(o.isMesh&&o.name&&o.material&&(o.name in HDKEY||o.name==='earth'))applyMat(o.material,o.name);});}
 function loadGroup(i){if(i>=GROUPS.length)return;const s=document.createElement('script');s.src=GROUPS[i][1];s.onload=()=>{try{for(const id in HDKEY)upgradeBase(id);sweep();}catch(e){console.warn(e);}setTimeout(()=>loadGroup(i+1),1500);};s.onerror=()=>setTimeout(()=>loadGroup(i+1),500);document.head.appendChild(s);}
 const go=()=>{try{if(app.quality==='low')return;const mx=app.renderer.capabilities.maxTextureSize||0;if(mx<4096)return;}catch{return;}loadGroup(0);};
 const t0=()=>setTimeout(go,2500);if(document.readyState==='complete')t0();else window.addEventListener('load',t0);
 window.KX=window.KX||{};KX.hd={loaded,HD,sweep};
})();
