window.KoinotScene = class {
 constructor(onSelect,onTick){
  const T=THREE;this.T=T;this.onSelect=onSelect;this.onTick=onTick;this.days=0;this.playing=false;this.speed=10;this.selected='earth';this.focused=false;this.showLabels=true;this.tourActive=false;this.rotationEnabled=true;this.quality='auto';this.bodies=new Map();this.labels=new Map();this.orbitLines=[];
  this.canvas=document.querySelector('#space');this.host=document.querySelector('#viewport');
  this.renderer=new T.WebGLRenderer({canvas:this.canvas,antialias:true,alpha:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});this.renderer.setClearColor(0x02050b);this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.25;
  this.scene=new T.Scene();this.camera=new T.PerspectiveCamera(42,1,.03,6000);this.target=new T.Vector3(38,0,0);this.currentTarget=this.target.clone();this.distance=120;this.currentDistance=120;this.yaw=0;this.elevation=.43;
  this.scene.add(new T.AmbientLight(0x9eb4d4,.46));this.starLight=new T.PointLight(0xfff2dd,2.6,0,0);this.scene.add(this.starLight);
  this.addStars();this.addBodies();this.addAsteroids();this.addPreview();this.bindControls();
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(this.host);this.resizeObserver.observe(document.querySelector('.preview-wrap'));
  this.setQuality('auto');this.resize();this.home();this.highlight('earth');
  this.last=performance.now();this.acc=0;this.frames=0;this.running=true;this.animate=this.animate.bind(this);requestAnimationFrame(this.animate);
  this.canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.running=false;document.querySelector('#webglError').hidden=false;});
  this.canvas.addEventListener('webglcontextrestored',()=>location.reload());
 }
 addStars(){
  const T=this.T;let seed=941;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const positions=[],colors=[];for(let i=0;i<3500;i++){const a=random()*Math.PI*2,z=random()*2-1,r=1300;positions.push(Math.sqrt(1-z*z)*Math.cos(a)*r,z*r,Math.sqrt(1-z*z)*Math.sin(a)*r);const b=.3+random()*.7;colors.push(b*.8,b*.9,b);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));this.stars=new T.Points(g,new T.PointsMaterial({size:1.25,sizeAttenuation:false,vertexColors:true,transparent:true,opacity:.7}));this.scene.add(this.stars);
  if(window.KOINOT_TEXTURES['2k_stars_milky_way.jpg']){const sphere=new T.Mesh(new T.SphereGeometry(1500,48,24),new T.MeshBasicMaterial({map:KoinotMaterials.texture('2k_stars_milky_way.jpg'),side:T.BackSide,color:0x565b70}));sphere.rotation.z=.6;sphere.rotation.y=1.4;this.scene.add(sphere);}
 }
 makeBody(d,r,preview=false){
  const T=this.T,group=new T.Group(),tilt=new T.Group();group.add(tilt);tilt.rotation.z=d.tilt*Math.PI/180;
  const material=KoinotMaterials.material(d);if(preview&&material.userData.starPosition)material.userData.starPosition.value.set(-8,5,8);
  const sphere=new T.Mesh(new T.SphereGeometry(r,64,40),material);sphere.name=d.id;sphere.userData.bodyId=d.id;sphere.rotation.y=d.id==='earth'?2.7:.3;tilt.add(sphere);
  const extras={};
  if(d.id==='earth'){
   const cloud=new T.Mesh(new T.SphereGeometry(r*1.009,64,40),new T.MeshStandardMaterial({map:KoinotMaterials.texture('2k_earth_clouds.jpg',true),alphaMap:KoinotMaterials.texture('2k_earth_clouds.jpg',true),transparent:true,opacity:.72,depthWrite:false,roughness:1}));cloud.rotation.y=sphere.rotation.y;tilt.add(cloud);extras.cloud=cloud;
  }
  if(['earth','venus','uranus','neptune'].includes(d.id)){const shell=new T.Mesh(new T.SphereGeometry(r*1.035,48,32),KoinotMaterials.atmosphere(d.id==='venus'?'#e7bb75':d.color));tilt.add(shell);}
  if(d.id==='saturn'){
   const inner=r*1.27,outer=r*2.2,g=new T.RingGeometry(inner,outer,160,1),uv=g.attributes.uv,pos=g.attributes.position;
   for(let i=0;i<pos.count;i++){const radius=Math.hypot(pos.getX(i),pos.getY(i));uv.setXY(i,(radius-inner)/(outer-inner),.5);}
   const ring=new T.Mesh(g,new T.MeshStandardMaterial({map:KoinotMaterials.texture('2k_saturn_ring_alpha.png'),transparent:true,side:T.DoubleSide,roughness:1,opacity:.92,depthWrite:false}));ring.rotation.x=-Math.PI/2;tilt.add(ring);
  }
  if(d.id==='sun'){
   const halo=new T.Sprite(new T.SpriteMaterial({map:KoinotMaterials.glowTexture(),transparent:true,blending:T.AdditiveBlending,depthWrite:false,color:0xffad44}));halo.scale.set(r*3.4,r*3.4,1);group.add(halo);extras.halo=halo;
   const flareGroup=new T.Group();for(let i=0;i<11;i++){const a=i*2.399,center=new T.Vector3(Math.cos(a)*r*.99,Math.sin(a)*r*.99,0),pts=[];const h=r*(.06+(i%4)*.025),w=h*.65;
    for(let j=0;j<=40;j++){const u=j/40*Math.PI;pts.push(new T.Vector3(center.x+Math.cos(a)*h*Math.sin(u)-Math.sin(a)*w*Math.cos(u),center.y+Math.sin(a)*h*Math.sin(u)+Math.cos(a)*w*Math.cos(u),0));}
    const line=new T.Line(new T.BufferGeometry().setFromPoints(pts),new T.LineBasicMaterial({color:0xffab32,transparent:true,opacity:.7,blending:T.AdditiveBlending}));flareGroup.add(line);
   }group.add(flareGroup);extras.flares=flareGroup;
  }
  return {data:d,group,tilt,sphere,extras,radius:r};
 }
 addBodies(){
  const T=this.T;
  for(const d of KOINOT_CATALOG){
   const body=this.makeBody(d,d.radius);this.bodies.set(d.id,body);this.scene.add(body.group);
   const el=document.createElement('button');el.className='planet-label';el.textContent=d.name;el.dataset.id=d.id;el.setAttribute('aria-label',d.name+' ma’lumotlari');el.addEventListener('click',()=>this.onSelect(d.id));el.addEventListener('dblclick',()=>this.focus(d.id));document.querySelector('#labels').append(el);this.labels.set(d.id,el);
   if(d.orbit){const pts=[];for(let i=0;i<=256;i++){const a=i/256*Math.PI*2,inc=(d.inclination||0)*Math.PI/180;pts.push(new T.Vector3(Math.cos(a)*d.orbit,Math.sin(a)*d.orbit*Math.sin(inc),Math.sin(a)*d.orbit*Math.cos(inc)));}const line=new T.Line(new T.BufferGeometry().setFromPoints(pts),new T.LineBasicMaterial({color:d.id==='earth'?0x2d88b5:0x405b76,transparent:true,opacity:d.id==='earth'?.55:.26}));line.userData.bodyId=d.id;line.userData.parent=d.parent;this.scene.add(line);this.orbitLines.push(line);}
  }
  const g=new T.RingGeometry(1.5,1.52,80);this.selection=new T.Mesh(g,new T.MeshBasicMaterial({color:0x55d8ff,transparent:true,opacity:.8,side:T.DoubleSide,depthWrite:false}));this.scene.add(this.selection);this.updatePositions();
 }
 addAsteroids(){

  const T=this.T;this.asteroids=new T.InstancedMesh(new T.IcosahedronGeometry(.075,0),new T.MeshStandardMaterial({color:0x8d8277,roughness:1}),850);let seed=28;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  this.astData=[];for(let i=0;i<850;i++){const a=rand()*Math.PI*2,r=34+rand()*4,scale=.4+rand()*1.7,y=(rand()-.5)*1.1,au=2.2+(r-34)/4*1.1;this.astData.push({a,r,y,scale,rate:Math.PI*2/(365.25*Math.pow(au,1.5)),spin:(rand()-.5)*.02,tilt:rand()*6.28});}
  this._astM=new T.Matrix4();this._astQ=new T.Quaternion();this._astP=new T.Vector3();this._astS=new T.Vector3();this._astE=new T.Euler();this._astDay=null;this.asteroidDir=1;
  this.updateAsteroids(true);this.scene.add(this.asteroids);
 }
 updateAsteroids(force){
  if(!this.astData||(!force&&this._astDay!==null&&Math.abs(this.days-this._astDay)<.02))return;this._astDay=this.days;const d=this.days,dir=this.asteroidDir,m=this._astM,q=this._astQ,p=this._astP,sc=this._astS,e=this._astE;
  for(let i=0;i<this.astData.length;i++){const o=this.astData[i],a=o.a+dir*o.rate*d;p.set(Math.cos(a)*o.r,o.y,Math.sin(a)*o.r);e.set(0,o.tilt+o.spin*d,0);q.setFromEuler(e);sc.set(o.scale,o.scale*.7,o.scale);m.compose(p,q,sc);this.asteroids.setMatrixAt(i,m);}
  this.asteroids.instanceMatrix.needsUpdate=true;
 }
 addPreview(){const T=this.T;this.previewRenderer=new T.WebGLRenderer({canvas:document.querySelector('#preview'),antialias:true,alpha:true});this.previewRenderer.outputColorSpace=T.SRGBColorSpace;this.previewRenderer.toneMapping=T.ACESFilmicToneMapping;this.previewRenderer.toneMappingExposure=1.2;this.previewScene=new T.Scene();this.previewCamera=new T.PerspectiveCamera(36,1,.01,50);this.previewCamera.position.set(0,.3,4.2);this.previewCamera.lookAt(0,0,0);this.previewScene.add(new T.AmbientLight(0x8ba9c9,.5));const light=new T.DirectionalLight(0xfff4e6,3.1);light.position.set(-8,5,8);this.previewScene.add(light);}
 setPreview(id){
  if(this.previewBody){this.previewScene.remove(this.previewBody.group);this.previewBody.group.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});}
  const d=this.bodies.get(id).data;this.previewBody=this.makeBody(d,d.id==='saturn'?.66:1,true);this.previewScene.add(this.previewBody.group);this.previewBody.sphere.rotation.y=d.id==='earth'?2.7:.4;
 }
 highlight(id){this.selected=id;for(const [key,el]of this.labels)el.classList.toggle('selected',key===id);for(const line of this.orbitLines){const s=line.userData.bodyId===id;line.material.color.set(s?0x4bbfff:0x405b76);line.material.opacity=s?.6:.26;}this.setPreview(id);}
 updatePositions(){
  for(const body of this.bodies.values()){const d=body.data;if(!d.orbit)continue;const p=this.positionProvider?this.positionProvider(d):KoinotMath.orbitalPosition(d,this.days);body.group.position.set(p.x,p.y,p.z);if(d.parent&&!this.positionProvider)body.group.position.add(this.bodies.get(d.parent).group.position);}
  for(const line of this.orbitLines)if(line.userData.parent)line.position.copy(this.bodies.get(line.userData.parent).group.position);
  const b=this.bodies.get(this.selected);if(b){this.selection.position.copy(b.group.position);this.selection.scale.setScalar(b.radius*.84);this.selection.quaternion.copy(this.camera.quaternion);}
 }
 home(){this.focused=false;this.target.set(38,0,0);this.yaw=0;this.elevation=.43;this.distance=Math.max(116,110/(2*Math.tan(21*Math.PI/180)*Math.max(.65,this.camera.aspect)));document.querySelector('#viewport').classList.remove('focused');this.stopTour();}
 focus(id){if(!this.bodies.has(id))return;this.focused=true;this.selected=id;const b=this.bodies.get(id);this.target.copy(b.group.position);this.distance=Math.max(.002,b.radius*(id==='saturn'?8:5));this.elevation=.2;document.querySelector('#viewport').classList.add('focused');}
 zoom(factor){this.distance=KoinotMath.clamp(this.distance*factor,this.focused?this.bodies.get(this.selected).radius*2.7:.03,this.realScale?2200:350);}
 setQuality(q){this.quality=q;const ratio=q==='low'?1:q==='high'?Math.min(devicePixelRatio,2):Math.min(devicePixelRatio,innerWidth<700?1.3:1.7);this.renderer.setPixelRatio(ratio);this.previewRenderer?.setPixelRatio(Math.min(ratio,1.7));this.resize();}
 resize(){const w=this.host.clientWidth,h=this.host.clientHeight;if(w&&h){this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();}const el=document.querySelector('.preview-wrap');if(this.previewRenderer&&el.clientWidth&&el.clientHeight){this.previewRenderer.setSize(el.clientWidth,el.clientHeight,false);this.previewCamera.aspect=el.clientWidth/el.clientHeight;this.previewCamera.updateProjectionMatrix();}}
 bindControls(){
  const pointers=new Map();let moved=false,start={x:0,y:0},last=null,pinch=0;
  this.canvas.addEventListener('pointerdown',e=>{this.canvas.focus();this.canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});start={x:e.clientX,y:e.clientY};last=start;moved=false;if(pointers.size===2){const a=[...pointers.values()];pinch=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);}this.stopTour();});
  this.canvas.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(Math.hypot(e.clientX-start.x,e.clientY-start.y)>5)moved=true;
   if(pointers.size===2){const a=[...pointers.values()],d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);if(pinch&&d)this.zoom(pinch/d);pinch=d;moved=true;}else if(last){this.yaw-=(e.clientX-last.x)*.006;this.elevation=KoinotMath.clamp(this.elevation+(e.clientY-last.y)*.005,-1.35,1.35);}last={x:e.clientX,y:e.clientY};});
  this.canvas.addEventListener('pointerup',e=>{if(!this.journey?.active&&!moved&&pointers.size===1){const r=this.canvas.getBoundingClientRect(),mouse=new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),ray=new THREE.Raycaster();ray.setFromCamera(mouse,this.camera);const hits=ray.intersectObjects([...this.bodies.values()].map(b=>b.sphere));if(hits[0])this.onSelect(hits[0].object.userData.bodyId);}pointers.delete(e.pointerId);last=null;pinch=0;});
  const clear=e=>{pointers.delete(e.pointerId);last=null;pinch=0;};this.canvas.addEventListener('pointercancel',clear);this.canvas.addEventListener('lostpointercapture',clear);
  this.canvas.addEventListener('wheel',e=>{e.preventDefault();this.stopTour();this.zoom(Math.exp(Math.max(-120,Math.min(120,e.deltaY))*.0015));},{passive:false});
  this.canvas.addEventListener('dblclick',()=>{if(!this.journey?.active)this.focus(this.selected);});this.canvas.addEventListener('contextmenu',e=>e.preventDefault());
 }
 startTour(){this.tourActive=true;this.tourIndex=-1;this.tourClock=7;}
 stopTour(){this.tourActive=false;if(!this.journey?.active)document.querySelector('#tour').classList.remove('active');}
 animate(now){
  if(!this.running)return;requestAnimationFrame(this.animate);const dt=Math.min((now-this.last)/1000,.05);this.last=now;if(document.hidden)return;KoinotMaterials.tick?.(now*.001);
  if(this.journey?.active){this.journey.frame(dt);if(this.afterFrame)this.afterFrame(dt,now);return;}
  if(this.playing)this.days+=dt*this.speed;
  if(this.tourActive){this.tourClock+=dt;if(this.tourClock>7){this.tourClock=0;this.tourIndex++;const list=KOINOT_CATALOG.filter(d=>!d.parent);if(this.tourIndex>=list.length){this.stopTour();this.home();}else{this.onSelect(list[this.tourIndex].id);this.focus(list[this.tourIndex].id);}}}
  this.updatePositions();this.updateAsteroids();if(this.focused&&!this.freeFlight)this.target.copy(this.bodies.get(this.selected).group.position);
  const smoothing=1-Math.exp(-dt*5);this.currentTarget.lerp(this.target,smoothing);this.currentDistance+=(this.distance-this.currentDistance)*smoothing;
  if(this.freeFlight&&this.updateFlight){this.updateFlight(dt);}else{this.camera.position.set(this.currentTarget.x+Math.sin(this.yaw)*Math.cos(this.elevation)*this.currentDistance,this.currentTarget.y+Math.sin(this.elevation)*this.currentDistance,this.currentTarget.z+Math.cos(this.yaw)*Math.cos(this.elevation)*this.currentDistance);this.camera.lookAt(this.currentTarget);}
  if(this.beforeFrame)this.beforeFrame(dt,now);
  for(const b of this.bodies.values()){
   if(this.playing&&this.rotationEnabled)b.sphere.rotation.y-=dt*this.speed*24/b.data.rotation*Math.PI*2;
   if(b.extras.cloud&&this.playing)b.extras.cloud.rotation.y-=dt*this.speed*24/b.data.rotation*Math.PI*2*1.025;
   if(b.extras.halo){const f=1+Math.sin(now*.0008)*.018;b.extras.halo.scale.setScalar(b.radius*3.4*f);b.extras.flares.rotation.z=now*.000015;}
  }
  const b=this.bodies.get(this.selected);this.selection.position.copy(b.group.position);this.selection.quaternion.copy(this.camera.quaternion);this.selection.visible=!this.focused;
  for(const [id,el]of this.labels){const body=this.bodies.get(id),p=body.group.position.clone().project(this.camera),screenRadius=body.radius/this.camera.position.distanceTo(body.group.position)*this.host.clientHeight/(2*Math.tan(this.camera.fov*Math.PI/360));let visible=this.showLabels&&p.z<1&&p.z>-1&&Math.abs(p.x)<1.1&&Math.abs(p.y)<1.1;
   if(body.data.parent&&!this.focused&&this.distance>60)visible=false;if(this.focused&&id!==this.selected&&screenRadius<2)visible=false;el.hidden=!visible;if(visible){el.style.left=((p.x+1)/2*this.host.clientWidth)+'px';el.style.top=((1-p.y)/2*this.host.clientHeight-screenRadius-18)+'px';}
  }
  this.renderer.render(this.scene,this.camera);if(this.afterFrame)this.afterFrame(dt,now);
  if(this.previewBody){if(this.rotationEnabled){this.previewBody.sphere.rotation.y+=dt*.08;if(this.previewBody.extras.cloud)this.previewBody.extras.cloud.rotation.y+=dt*.085;}this.previewRenderer.render(this.previewScene,this.previewCamera);}
  this.acc+=dt;if(this.acc>.15){this.acc=0;this.onTick(this.days,this.focused,this.selected);}
 }
};
