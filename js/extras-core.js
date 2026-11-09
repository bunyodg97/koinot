window.KX=(()=>{
 const $=(s,r=document)=>r.querySelector(s);
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const fmt=(n,d=2)=>Number.isFinite(n)?new Intl.NumberFormat('uz-UZ',{maximumFractionDigits:d}).format(n):'—';
 const pad=n=>String(n).padStart(2,'0');

 const OFFSET=5;
 const shifted=(date,off=OFFSET)=>new Date(date.getTime()+off*3600e3);
 const ymd=(date,off=OFFSET)=>{const d=shifted(date,off);return d.getUTCFullYear()+'-'+pad(d.getUTCMonth()+1)+'-'+pad(d.getUTCDate());};
 const hm=(date,off=OFFSET)=>{if(!date)return '—';const d=shifted(date,off);return pad(d.getUTCHours())+':'+pad(d.getUTCMinutes());};
 const stamp=(date,off=OFFSET)=>ymd(date,off)+' '+hm(date,off);
 const inputValue=(date,off=OFFSET)=>ymd(date,off)+'T'+hm(date,off);
 const parseInput=(v,off=OFFSET)=>{const m=/^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)/.exec(v||'');if(!m)return null;return new Date(Date.UTC(+m[1],+m[2]-1,+m[3],+m[4],+m[5])-off*3600e3);};
 const MONTHS=['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentyabr','oktyabr','noyabr','dekabr'];
 const longDate=(date,off=OFFSET)=>{const d=shifted(date,off);return d.getUTCDate()+' '+MONTHS[d.getUTCMonth()]+' '+d.getUTCFullYear();};
 function hidpi(canvas,h){const dpr=Math.min(2,window.devicePixelRatio||1),w=canvas.clientWidth||600,hh=h||canvas.clientHeight||360;canvas.width=Math.round(w*dpr);canvas.height=Math.round(hh*dpr);const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);return {ctx,w,h:hh};}

 function tab(id,name,fn){window.KoinotLab?.register(id,name,fn);}
 const lab=()=>window.KoinotLab;
 return {$,esc,fmt,pad,OFFSET,shifted,ymd,hm,stamp,inputValue,parseInput,MONTHS,longDate,hidpi,tab,lab};
})();
