(()=>{'use strict';
 const app=window.koinot,KX=window.KX;if(!app||!KX?.cinema)return;
 const R={active:false,rec:null,chunks:[],bytes:0,t0:0,timer:0};KX.rec=R;
 const MAXB=900*1024*1024;
 const dot=document.createElement('div');dot.id='recDot';dot.hidden=true;dot.innerHTML='<i></i><span>00:00</span>';document.body.append(dot);
 const pick=()=>{const c=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm','video/mp4'];for(const m of c)if(window.MediaRecorder&&MediaRecorder.isTypeSupported(m))return m;return '';};
 const ts=()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');return d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+'-'+p(d.getHours())+p(d.getMinutes());};
 function begin(){
  if(R.active)return true;
  const cv=app.renderer?.domElement;if(!cv?.captureStream||!window.MediaRecorder){alert('Bu brauzer video yozishni qo‘llamaydi. Chrome yoki Edge’dan foydalaning.');return false;}
  const mime=pick();let stream;
  try{stream=cv.captureStream(30);const a=KX.audio?.tap?.();if(a)a.getAudioTracks().forEach(t=>stream.addTrack(t));
   R.rec=new MediaRecorder(stream,mime?{mimeType:mime,videoBitsPerSecond:9e6}:{videoBitsPerSecond:9e6});}
  catch(e){console.warn(e);alert('Video yozishni boshlab bo‘lmadi: '+e.message);return false;}
  R.chunks=[];R.bytes=0;R.mime=R.rec.mimeType||mime||'video/webm';
  R.rec.ondataavailable=e=>{if(e.data&&e.data.size){R.chunks.push(e.data);R.bytes+=e.data.size;if(R.bytes>MAXB)finish();}};
  R.rec.onstop=save;R.rec.start(1000);R.active=true;R.t0=Date.now();dot.hidden=false;
  R.timer=setInterval(()=>{const s=Math.floor((Date.now()-R.t0)/1000);dot.lastChild.textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');},500);
  return true;
 }
 function save(){
  clearInterval(R.timer);dot.hidden=true;if(!R.chunks.length)return;
  const ext=/mp4/.test(R.mime)?'mp4':'webm',blob=new Blob(R.chunks,{type:R.mime.split(';')[0]}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='koinot-kino-'+ts()+'.'+ext;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);R.chunks=[];
 }
 function finish(){if(!R.active)return;R.active=false;try{R.rec.state!=='inactive'&&R.rec.stop();}catch(e){save();}}
 R.start=begin;R.stop=finish;
 R.startCinema=()=>{KX.cinema.start();setTimeout(()=>{if(document.body.classList.contains('cinema'))begin();},1500);};
 const cs=KX.cinema.stop;KX.cinema.stop=function(...a){finish();return cs.apply(this,a);};

 setInterval(()=>{if(R.active&&!document.body.classList.contains('cinema'))finish();},500);
})();
