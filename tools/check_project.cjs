const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');const root=path.resolve(__dirname,'..');
class Element{
 constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.dataset={};this.style={};this.hidden=false;this.clientWidth=tag==='viewport'?1100:280;this.clientHeight=tag==='viewport'?650:220;this.listeners={};this.classList={add(){},remove(){},toggle(){}};}
 append(...el){this.children.push(...el)}addEventListener(n,fn){this.listeners[n]=fn}removeEventListener(){}setAttribute(n,v){this[n]=v}focus(){}setPointerCapture(){}getBoundingClientRect(){return {left:0,top:0,width:this.clientWidth,height:this.clientHeight}}toDataURL(){return 'data:image/png;base64,iVBORw0KGgo='}getContext(){return {beginPath(){},ellipse(){},fill(){},stroke(){},moveTo(){},lineTo(){},createRadialGradient(){return {addColorStop(){}}},fillRect(){}}}set src(v){this._src=v}get src(){return this._src}
}
const els={};global.window=global;global.innerWidth=1440;global.devicePixelRatio=1;global.document={hidden:false,createElement:t=>new Element(t),createElementNS:(_,t)=>new Element(t),querySelector:s=>els[s]??(els[s]=new Element(s==='#viewport'?'viewport':'div'))};global.ResizeObserver=class{observe(){}};global.requestAnimationFrame=()=>{};global.location={reload(){}};
global.THREE=require(path.join(root,'vendor/three.min.js'));THREE.WebGLRenderer=class{constructor(){this.outputColorSpace=null}setClearColor(){}setPixelRatio(){}setSize(){}render(scene,camera){scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);assert(camera.position.toArray().every(Number.isFinite));}};
for(const file of ['data/catalog.js','assets/textures/textures.bundle.js','data/extra-objects.js','assets/materials/materials.js','js/math.js','js/scene.js'])vm.runInThisContext(fs.readFileSync(path.join(root,file),'utf8'),{filename:file});
const N=KOINOT_CATALOG.length;assert(N>=16);assert.equal(new Set(KOINOT_CATALOG.map(d=>d.id)).size,N);
for(const d of KOINOT_CATALOG){assert(KOINOT_TEXTURES[d.texture]);assert(d.radius>0);assert(d.diameter>0);if(d.orbit){const a=KoinotMath.orbitalPosition(d,0),b=KoinotMath.orbitalPosition(d,d.period);assert(Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)<1e-8,'periodic orbit '+d.id);}if(d.parent)assert(KOINOT_CATALOG.some(p=>p.id===d.parent));}
const scene=new KoinotScene(()=>{},()=>{});assert.equal(scene.bodies.size,N);assert.equal(scene.orbitLines.length,N-1);
for(const id of KOINOT_CATALOG.map(d=>d.id)){scene.highlight(id);scene.focus(id);scene.animate(performance.now()+16);assert.equal(scene.previewBody.data.id,id);assert(Number.isFinite(scene.distance));}
scene.home();assert(!scene.focused);scene.zoom(1e9);assert.equal(scene.distance,350);scene.zoom(1e-9);assert.equal(scene.distance,.03);scene.days=120;scene.updatePositions();const earth=scene.bodies.get('earth').group.position,moon=scene.bodies.get('moon').group.position;assert(Math.abs(earth.distanceTo(moon)-2.5)<1e-8);scene.playing=true;let before=scene.days;scene.animate(performance.now()+100);assert(scene.days>before);scene.playing=false;before=scene.days;scene.animate(performance.now()+200);assert.equal(scene.days,before);

const shader={uniforms:{},vertexShader:THREE.ShaderLib.standard.vertexShader,fragmentShader:THREE.ShaderLib.standard.fragmentShader};scene.bodies.get('earth').sphere.material.onBeforeCompile(shader);assert(shader.vertexShader.includes('surfaceWorld='));assert(shader.fragmentShader.includes('smoothstep'));assert(shader.uniforms.starPosition);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const [,ref]of html.matchAll(/(?:src|href)="([^"#]+)"/g)){if(/^(https?:|data:)/.test(ref))continue;assert(fs.existsSync(path.join(root,ref)),'Missing '+ref);}for(const f of ['js/app.js','js/scene.js','js/math.js','data/catalog.js','assets/materials/materials.js'])new vm.Script(fs.readFileSync(path.join(root,f),'utf8'));

for(const f of ['data/nearby-stars.js','data/exoplanets.js','data/extras.js'])vm.runInThisContext(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});
vm.runInThisContext(fs.readFileSync(path.join(root,'vendor/astronomy.browser.min.js'),'utf8'));
assert.equal(KOINOT_STARS.length,324);assert(KOINOT_EXOSYSTEMS.length>=9);
for(const s of KOINOT_EXOSYSTEMS){assert(s.planets.length>0);for(const p of s.planets){assert(p.period>0&&p.au>0,'exo '+p.id);}}
assert.equal(new Set(KOINOT_EXOSYSTEMS.flatMap(s=>s.planets.map(p=>p.id))).size,KOINOT_EXOSYSTEMS.flatMap(s=>s.planets).length);
const names=new Set(KOINOT_BRIGHT.map(s=>s[0]));assert.equal(names.size,KOINOT_BRIGHT.length);
for(const s of KOINOT_BRIGHT){assert(s[1]>=0&&s[1]<24&&s[2]>=-90&&s[2]<=90,'star '+s[0]);}
for(const segs of Object.values(KOINOT_LINES))for(const [a,b] of segs)assert(names.has(a)&&names.has(b),'line '+a+'-'+b);
for(const q of KOINOT_QUIZ){assert(q.o.length>=3&&q.a>=0&&q.a<q.o.length&&q.e);assert.equal(new Set(q.o).size,q.o.length);}
assert(KOINOT_BH.length>=4&&KOINOT_BH.every(b=>b.M>0&&b.ly>0));assert(KOINOT_SMALL.length>=10&&KOINOT_MISSIONS.length>=10&&KOINOT_UZ.length>=5);

const ge=Astronomy.SearchGlobalSolarEclipse(new Date('2024-03-01T00:00:00Z'));assert.equal(ge.kind,'total');assert.equal(ge.peak.date.toISOString().slice(0,10),'2024-04-08');
const mu=1.32712440018e20,AUm=1.495978707e11,r1=AUm,r2=1.524*AUm,d1=Math.sqrt(mu/r1)*(Math.sqrt(2*r2/(r1+r2))-1);assert(Math.abs(d1/1000-2.94)<.05);
const tash=new Astronomy.Observer(41.2995,69.2401,455),rise=Astronomy.SearchRiseSet('Sun',tash,+1,new Date('2026-06-20T19:00:00Z'),1),set=Astronomy.SearchRiseSet('Sun',tash,-1,new Date('2026-06-20T19:00:00Z'),1);assert(Math.abs((set.date-rise.date)/3.6e6-15.1)<.4,'Tashkent June day length');
const hz=Astronomy.Horizon(new Date('2026-03-20T07:00:00Z'),tash,Astronomy.Equator('Sun',new Date('2026-03-20T07:00:00Z'),tash,true,true).ra,Astronomy.Equator('Sun',new Date('2026-03-20T07:00:00Z'),tash,true,true).dec,'normal');assert(hz.altitude>40&&hz.altitude<60);
for(const f of ['js/extras-core.js','js/skymap.js','data/skydata.js','js/science.js','js/content.js','js/i18n.js','js/i18n2.js','js/icons.js','js/milkyway.js','js/journey.js','js/blackhole.js','js/melon.js','js/info.js','js/texturesplus.js','js/audio.js','js/cinema.js','js/recorder.js','js/tonight.js','js/galaxyatlas.js','js/online.js','js/live.js','js/observer.js','js/observer2.js','js/alarm.js','js/observer3.js','js/ulugbek.js','js/lifecycle.js','js/labgroups.js','data/quiz2.js','data/galaxies.js','data/exosystems.js','js/provenance.js','js/labelfix.js','js/mainbelt.js','data/mainbelt/mb_index.js','audio/audio-config.js','js/journeyfx.js','js/smallbodies.js','data/smallbodies.js','js/journeyplus.js','js/localgroup.js','data/localgroup.js','js/laniakea.js','data/laniakea.js','js/cosmicweb.js','data/cosmicweb.js','js/universe.js','data/universe.js','js/ui.js','data/extras.js','js/laboratory.js','js/explorer.js'])new vm.Script(fs.readFileSync(path.join(root,f),'utf8'));
console.log('PASS: '+N+' bodies; '+(N-1)+' periodic orbits; parent-relative Moon; focus/zoom; play/pause; shader injection; local resources; JS syntax; 2.7: exoplanet/star/quiz data integrity; eclipse 2024-04-08; Hohmann Earth-Mars; Tashkent day length; new module syntax.');console.log('Scope: CPU smoke test with mocked renderer. This does not verify WebGL pixels or browser UI.');

{const ctx={window:{}};new vm.Script(fs.readFileSync(path.join(root,'data/localgroup.js'),'utf8')).runInNewContext(ctx);const lg=ctx.window.KOINOT_LG;
 if(!lg||!Array.isArray(lg.sats)||lg.sats.length<100)throw new Error('KOINOT_LG yetarli emas');
 for(const s of lg.sats){if(s.length!==7||!(s[1]>=0&&s[1]<360)||!(s[2]>=-90&&s[2]<=90)||!(s[3]>5&&s[3]<3000))throw new Error('LG qator noto‘g‘ri: '+s[0]);}
 const lmc=lg.sats.find(s=>s[0]==='LMC');if(!lmc||Math.abs(lmc[3]-50)>5)throw new Error('LMC masofasi noto‘g‘ri');
 console.log('OK Mahalliy guruh ma‘lumoti:',lg.sats.length,'galaktika');}

{const ctx={window:{},atob:s=>Buffer.from(s,'base64').toString('binary')};new vm.Script(fs.readFileSync(path.join(root,'data/laniakea.js'),'utf8')).runInNewContext(ctx);const d=ctx.window.KOINOT_2MRS;
 if(!d||d.n<30000)throw new Error('KOINOT_2MRS yetarli emas');const bytes=Buffer.from(d.b64,'base64');if(bytes.length!==d.n*8)throw new Error('2MRS ikkilik uzunligi noto‘g‘ri');
 const dist=new Uint16Array(bytes.buffer.slice(bytes.byteOffset+4*d.n,bytes.byteOffset+6*d.n));let mx=0;for(const v of dist)mx=Math.max(mx,v/20);if(mx>200.5)throw new Error('2MRS masofa > 200 Mpk');
 const vir=d.named.find(x=>x[0].startsWith('Virgo'));if(!vir||Math.abs(vir[3]-17.7)>3)throw new Error('Virgo masofasi noto‘g‘ri');
 console.log('OK 2MRS ma‘lumoti:',d.n,'galaktika, maks. masofa',mx.toFixed(0),'Mpk, klasterlar:',d.named.length);}

{const ctx={window:{}};new vm.Script(fs.readFileSync(path.join(root,'data/smallbodies.js'),'utf8')).runInNewContext(ctx);const sb=ctx.window.KOINOT_SB;if(!sb||sb.n<40000||sb.comets.length<800||!sb.names.includes('Apophis'))throw new Error('KOINOT_SB yetarli emas');console.log('OK MPC:',sb.n,'asteroid/TNO,',sb.comets.length,'kometa');}
{const ctx={window:{}};new vm.Script(fs.readFileSync(path.join(root,'data/skydata.js'),'utf8')).runInNewContext(ctx);const d=ctx.window.KOINOT_SKY;
 if(!d||d.stars.length<4000||d.cons.length<85||d.dso.filter(x=>x[0]).length<105)throw new Error('KOINOT_SKY yetarli emas');if(!d.dso.some(x=>x[0]==='M31'&&Math.abs(x[3]-10.685)<.01))throw new Error('KOINOT_SKY: M31 noto‘g‘ri');console.log('OK osmon ma‘lumoti:',d.stars.length,'yulduz,',d.cons.length,'turkum,',d.dso.length,'chuqur osmon obyekti');}
{const ctx={window:{}};new vm.Script(fs.readFileSync(path.join(root,'data/universe.js'),'utf8')).runInNewContext(ctx);const d=ctx.window.KOINOT_UNI;
 if(!d||!d.shells||d.shells.length<5||!/^data:image\/jpeg;base64,/.test(d.img))throw new Error('KOINOT_UNI yetarli emas');if(Math.abs(d.horizon_gly-46.2)>1)throw new Error('KOINOT_UNI gorizont noto‘g‘ri');}
{const ctx={window:{}};new vm.Script(fs.readFileSync(path.join(root,'data/cosmicweb.js'),'utf8')).runInNewContext(ctx);const d=ctx.window.KOINOT_WEB;
 if(!d||d.n<50000)throw new Error('KOINOT_WEB yetarli emas');const bytes=Buffer.from(d.b64,'base64');if(bytes.length!==d.n*7)throw new Error('KOINOT_WEB ikkilik uzunligi noto‘g‘ri');
 if(d.nodes.length<2||d.voids.length<2)throw new Error('tugun/bo‘shliq yo‘q');
 console.log('OK kosmik to‘r simulyatsiyasi:',d.n,'zarracha,',d.nodes.length,'tugun,',d.voids.length,'bo‘shliq');}
{const sc=new KoinotScene(()=>{},()=>{});sc.days=0;sc.updateAsteroids(true);const m=new THREE.Matrix4(),v=new THREE.Vector3();sc.asteroids.getMatrixAt(5,m);v.setFromMatrixPosition(m);const a0=Math.atan2(v.z,v.x);
 sc.days=200;sc.updateAsteroids();sc.asteroids.getMatrixAt(5,m);v.setFromMatrixPosition(m);const a1=Math.atan2(v.z,v.x);if(Math.abs(a1-a0)<.01)throw new Error('asteroidlar harakatlanmayapti');
 console.log('OK asteroid kamari aylanadi: 200 kunda',(a1-a0).toFixed(3),'rad');}

