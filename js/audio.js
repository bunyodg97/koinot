(()=>{'use strict';
 const app=window.koinot;if(!app)return;const KX=window.KX=window.KX||{};
 const FILES=window.KOINOT_AUDIO||{music:[],ambient:{}};
 const cfg={music:true,sfx:true,mvol:.35,svol:.5};try{Object.assign(cfg,JSON.parse(localStorage.getItem('koinot-audio')||'{}'));}catch{}
 const save=()=>{try{localStorage.setItem('koinot-audio',JSON.stringify(cfg));}catch{}};
 let ctx=null,mBus=null,sBus=null,started=false,hidden=false;
 const A={cfg,state:{ctx:'',music:'—',ambient:'—'}};KX.audio=A;
 const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};

 const PRE={sun:{f:49,r:[1,2,3,4.01],t:'sawtooth',lp:260,n:.35,nf:900,lfo:.05},mercury:{f:196,r:[1,2.01,3],t:'sine',lp:1800,n:.05,nf:3000,lfo:.2},venus:{f:73,r:[1,1.33,2],t:'triangle',lp:500,n:.3,nf:300,lfo:.08},
  earth:{f:130.8,r:[1,1.5,2,3],t:'sine',lp:1200,n:.18,nf:700,lfo:.12},moon:{f:174.6,r:[1,2],t:'sine',lp:900,n:.02,nf:2000,lfo:.05},mars:{f:98,r:[1,1.5,2.5],t:'triangle',lp:700,n:.4,nf:1200,lfo:.15},
  jupiter:{f:41.2,r:[1,2,3,5],t:'sine',lp:600,n:.2,nf:200,lfo:.04},saturn:{f:87.3,r:[1,2,3,4,6],t:'sine',lp:2600,n:.05,nf:4000,lfo:.1,sh:1},uranus:{f:155.6,r:[1,1.5,2,2.7],t:'triangle',lp:1500,n:.1,nf:2500,lfo:.09},
  neptune:{f:69.3,r:[1,1.5,2],t:'sine',lp:700,n:.25,nf:400,lfo:.06},pluto:{f:233,r:[1,2],t:'sine',lp:900,n:.02,nf:3000,lfo:.03},star:{f:220,r:[1,2,3,5],t:'sine',lp:3000,n:.04,nf:5000,lfo:.18,sh:1},
  stage0:{f:110,r:[1,1.5,2],t:'sine',lp:900,n:.2,nf:600,lfo:.1},stage1:{f:82.4,r:[1,1.5,2.02],t:'sine',lp:800,n:.15,nf:500,lfo:.08},stage2:{f:98,r:[1,1.5,2,3],t:'triangle',lp:1100,n:.15,nf:900,lfo:.07},
  stage3:{f:65.4,r:[1,1.5,2,3,4],t:'sine',lp:1600,n:.1,nf:1500,lfo:.06,sh:1},stage4:{f:55,r:[1,1.5,2],t:'sine',lp:700,n:.1,nf:700,lfo:.05},stage5:{f:46.2,r:[1,2,3],t:'sine',lp:600,n:.12,nf:500,lfo:.04},
  stage6:{f:36.7,r:[1,1.5,2.5],t:'sine',lp:500,n:.15,nf:350,lfo:.035},stage7:{f:30.9,r:[1,2,3],t:'sine',lp:420,n:.2,nf:250,lfo:.03}};
 const PENT=[1,9/8,5/4,3/2,5/3];
 function params(key){if(PRE[key])return PRE[key];const h=hash(key),f=55*PENT[h%5]*(1+(h>>3)%2);return {f,r:[1,1.5,2,3+((h>>5)%2)],t:(h>>7)%2?'sine':'triangle',lp:900+(h%1200),n:.1+(h%10)/80,nf:400+(h%1500),lfo:.04+(h%9)/80,sh:(h>>9)%2};}
 let noiseBuf=null;const noise=()=>{if(noiseBuf)return noiseBuf;const n=ctx.sampleRate*3,b=ctx.createBuffer(1,n,ctx.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<n;i++){l=l*.98+(Math.random()*2-1)*.02;d[i]=(Math.random()*2-1)*.6+l*8;}return noiseBuf=b;};
 function synth(key){const p=params(key),out=ctx.createGain();out.gain.value=0;out.connect(sBus);const stops=[];const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=p.lp;lp.Q.value=.7;lp.connect(out);
  const lfo=ctx.createOscillator(),lg=ctx.createGain();lfo.frequency.value=p.lfo;lg.gain.value=p.lp*.35;lfo.connect(lg);lg.connect(lp.frequency);lfo.start();stops.push(lfo);
  p.r.forEach((r,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type=p.t;o.frequency.value=p.f*r;o.detune.value=(i%2?1:-1)*(3+i*2);g.gain.value=.16/(1+i*.7);o.connect(g);g.connect(lp);o.start();stops.push(o);
   const t=ctx.createOscillator(),tg=ctx.createGain();t.frequency.value=.05+i*.031+(hash(key+i)%10)/200;tg.gain.value=g.gain.value*.6;t.connect(tg);tg.connect(g.gain);t.start();stops.push(t);});
  if(p.n>0){const s=ctx.createBufferSource();s.buffer=noise();s.loop=true;const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=p.nf;bp.Q.value=.6;const g=ctx.createGain();g.gain.value=p.n*.25;s.connect(bp);bp.connect(g);g.connect(out);s.start();stops.push(s);}
  if(p.sh){const o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.createOscillator(),tg=ctx.createGain();o.type='sine';o.frequency.value=p.f*8;g.gain.value=0;t.frequency.value=.13;tg.gain.value=.012;t.connect(tg);tg.connect(g.gain);o.connect(g);g.connect(out);o.start();t.start();stops.push(o,t);}
  return {setLevel:(v)=>out.gain.setTargetAtTime(v,ctx.currentTime,.9),stop:()=>{try{out.gain.setTargetAtTime(0,ctx.currentTime,.3);}catch{}setTimeout(()=>{stops.forEach(s=>{try{s.stop();}catch{}});try{out.disconnect();}catch{}},1500);},kind:'synth'};}

 const probeCache=new Map();
 function probe(url,timeout=6000){if(probeCache.has(url))return probeCache.get(url);const pr=new Promise(res=>{const a=new Audio();let done=false;const fin=ok=>{if(done)return;done=true;clearTimeout(t);res(ok?url:null);};a.preload='metadata';a.addEventListener('loadedmetadata',()=>fin(true),{once:true});a.addEventListener('error',()=>fin(false),{once:true});const t=setTimeout(()=>fin(false),timeout);a.src=url;});probeCache.set(url,pr);return pr;}
 function fileVoice(url,loop){const el=new Audio(url);el.loop=!!loop;el.preload='auto';let lvl=0,tgt=0;el.volume=0;const play=()=>{const pr=el.play();pr&&pr.catch?.(()=>{});};return {el,play,setLevel:v=>{tgt=v;},tick:(gain)=>{lvl+=(tgt-lvl)*.12;el.volume=Math.max(0,Math.min(1,lvl*gain));},stop:()=>{tgt=0;setTimeout(()=>{try{el.pause();el.src='';}catch{}},1800);},kind:'file'};}

 let cur=null,curKey='',want='',busy=false;
 const safe=k=>k.replace(/[^a-z0-9]+/gi,'_');
 async function resolveFile(key){const m=FILES.ambient||{};if(m[key])return probe(m[key]);let u=await probe('audio/ambient/'+safe(key)+'.mp3');if(!u&&key.startsWith('galaxy:'))u=await probe('audio/ambient/galaxy.mp3');return u;}
 async function setAmbient(key){if(key===curKey||busy)return;busy=true;curKey=key;try{const old=cur;let v=null;const url=await resolveFile(key);if(curKey!==key){busy=false;return;}
   if(url){v=fileVoice(url,true);v.play();}else if(ctx)v=synth(key.startsWith('galaxy:')?key:key);cur=v;if(v)v.setLevel(1);if(old)old.stop();A.state.ambient=key+(url?' (fayl)':' (sintez)');}catch(e){console.warn('KOINOT audio:',e);}busy=false;if(want&&want!==curKey)setAmbient(want);}
 function context(){const j=app.journey,ex=window.KoinotExplorer;
  if(j&&j.active){const s=ex?.state;if(j.detail?.active&&s){if(s.kind==='galaxy')return 'galaxy:'+s.id;if(s.kind==='star')return 'star';}if(j.star&&j.starFocus)return 'star';return 'stage'+Math.round(Math.max(0,Math.min(7,j.q)));}
  if(app.focused&&app.selected)return app.selected;return 'stage1';}

 let tracks=null,mi=-1,mel=null,genTimer=0,mVol=0,useGen=false;
 async function findTracks(){if(tracks)return tracks;let list=(FILES.music||[]).slice();if(!list.length){for(let i=1;i<=12;i++){const u=await probe('audio/music/music'+i+'.mp3');if(!u)break;list.push(u);}}else{const ok=[];for(const u of list)if(await probe(u))ok.push(u);list=ok;}return tracks=list;}
 function nextTrack(){if(!tracks||!tracks.length)return;mi=(mi+1+(tracks.length>1?Math.floor(Math.random()*(tracks.length-1)):0))%tracks.length;if(mel){try{mel.pause();}catch{}}mel=new Audio(tracks[mi]);mel.volume=0;mVol=0;mel.addEventListener('ended',nextTrack);mel.addEventListener('error',()=>{tracks=tracks.filter((_,i)=>i!==mi);if(tracks.length)setTimeout(nextTrack,300);else{useGen=true;}});const pr=mel.play();pr&&pr.catch?.(()=>{});A.state.music=tracks[mi];}

 let delay=null;
 function genChord(){if(!ctx||!cfg.music||hidden||!useGen)return;const root=[55,61.7,65.4,73.4][Math.floor(Math.random()*4)],sc=[1,9/8,6/5,4/3,3/2,8/5,9/5],n=3+Math.floor(Math.random()*2),t0=ctx.currentTime;
  for(let i=0;i<n;i++){const f=root*sc[Math.floor(Math.random()*sc.length)]*[2,4,4,8][Math.floor(Math.random()*4)];const o=ctx.createOscillator(),g=ctx.createGain(),pan=ctx.createStereoPanner?ctx.createStereoPanner():null;o.type=Math.random()<.5?'sine':'triangle';o.frequency.value=f;o.detune.value=(Math.random()-.5)*10;
   const a=3+Math.random()*3,d=7+Math.random()*6;g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(.05,t0+a);g.gain.linearRampToValueAtTime(0,t0+a+d);o.connect(g);if(pan){pan.pan.value=Math.random()*1.6-.8;g.connect(pan);pan.connect(delay);}else g.connect(delay);o.start(t0);o.stop(t0+a+d+.2);}
  const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=root/2;g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(.07,t0+4);g.gain.linearRampToValueAtTime(0,t0+14);o.connect(g);g.connect(mBus);o.start(t0);o.stop(t0+15);}
 function startGen(){if(genTimer||!ctx)return;if(!delay){delay=ctx.createGain();const d=ctx.createDelay(1.5),fb=ctx.createGain(),lp=ctx.createBiquadFilter();d.delayTime.value=.73;fb.gain.value=.55;lp.type='lowpass';lp.frequency.value=2200;delay.connect(mBus);delay.connect(d);d.connect(lp);lp.connect(fb);fb.connect(d);d.connect(mBus);}
  genChord();genTimer=setInterval(genChord,5200);A.state.music='generativ';}
 function stopGen(){clearInterval(genTimer);genTimer=0;}

 async function start(){if(started)return;started=true;try{const AC=window.AudioContext||window.webkitAudioContext;ctx=new AC();mBus=ctx.createGain();sBus=ctx.createGain();mBus.connect(ctx.destination);sBus.connect(ctx.destination);A.tap=()=>{if(!ctx)return null;if(!A._dst){A._dst=ctx.createMediaStreamDestination();mBus.connect(A._dst);sBus.connect(A._dst);}return A._dst.stream;};apply();}catch(e){console.warn('KOINOT audio: WebAudio ochilmadi',e);ctx=null;}
  const t=await findTracks();if(t.length)nextTrack();else useGen=true;if(useGen&&cfg.music&&ctx)startGen();want=context();setAmbient(want);}
 function apply(){if(ctx){const now=ctx.currentTime;mBus.gain.setTargetAtTime(cfg.music?cfg.mvol*1.6:0,now,.3);sBus.gain.setTargetAtTime(cfg.sfx?cfg.svol*1.2:0,now,.3);}
  if(useGen&&started&&cfg.music&&ctx)startGen();if(!cfg.music)stopGen();}
 setInterval(()=>{if(!started)return;hidden=document.hidden;
  const w=context();if(w!==want){want=w;setAmbient(w);}
  const mg=hidden||!cfg.music?0:cfg.mvol;if(mel){mVol+=(mg-mVol)*.1;mel.volume=Math.max(0,Math.min(1,mVol));if(!cfg.music||hidden){if(!mel.paused)mel.pause();}else if(mel.paused&&!mel.ended){const pr=mel.play();pr&&pr.catch?.(()=>{});}}
  const sg=hidden||!cfg.sfx?0:cfg.svol;if(cur&&cur.kind==='file'){cur.tick(sg);if(sg>0&&cur.el.paused){const pr=cur.el.play();pr&&pr.catch?.(()=>{});}else if(sg===0&&!cur.el.paused)cur.el.pause();}
  if(ctx){if(hidden&&ctx.state==='running')ctx.suspend();else if(!hidden&&ctx.state==='suspended')ctx.resume();}},90);
 const gesture=()=>{start();if(ctx&&ctx.state==='suspended')ctx.resume();};
 for(const ev of ['pointerdown','keydown','touchstart'])window.addEventListener(ev,gesture,{passive:true});
 A.dbg=()=>({ctx:ctx&&ctx.state,started,useGen,key:curKey,cur:cur&&cur.kind,mel:!!mel,tracks:tracks&&tracks.length,st:A.state});
 A.set=(k,v)=>{cfg[k]=v;save();if(!started&&(cfg.music||cfg.sfx)){}apply();};
 A.mountSettings=el=>{if(!el)return;const fx=KX.fx||{on:true,neb:true};
  el.innerHTML=`<div class="setting"><label class="switch"><input id="aNeb" type="checkbox" ${fx.neb!==false?'checked':''}><span>Tumanlik fon (Sayohat)</span><i></i></label></div>
  <div class="setting"><label class="switch"><input id="aFx" type="checkbox" ${fx.on!==false?'checked':''}><span>Kino effektlari: bloom, vignetka</span><i></i></label></div>
  <div class="setting"><label class="switch"><input id="aMus" type="checkbox" ${cfg.music?'checked':''}><span>Musiqa</span><i></i></label></div>
  <div class="setting"><span>Musiqa balandligi</span><input id="aMv" type="range" min="0" max="100" value="${Math.round(cfg.mvol*100)}"></div>
  <div class="setting"><label class="switch"><input id="aSfx" type="checkbox" ${cfg.sfx?'checked':''}><span>Ovoz (sayyora, galaktika, bosqich)</span><i></i></label></div>
  <div class="setting"><span>Ovoz balandligi</span><input id="aSv" type="range" min="0" max="100" value="${Math.round(cfg.svol*100)}"></div>
  <p>Musiqa va ovoz fayllari: <b>audio/music</b> va <b>audio/ambient</b> papkalari (batafsil — audio/OQING.txt). Fayl bo‘lmasa, ilovaning o‘z generativ tovushlari yangraydi. Kosmosda ovoz tarqalmaydi — bular badiiy tovushlar. Brauzer tovushni sahifani bosganingizdan keyin boshlaydi.</p>`;
  const q=s=>el.querySelector(s);q('#aNeb').onchange=e=>fx.setNeb?.(e.target.checked);q('#aFx').onchange=e=>fx.set?.(e.target.checked);q('#aMus').onchange=e=>A.set('music',e.target.checked);q('#aSfx').onchange=e=>A.set('sfx',e.target.checked);
  q('#aMv').oninput=e=>A.set('mvol',e.target.value/100);q('#aSv').oninput=e=>A.set('svol',e.target.value/100);};
})();
