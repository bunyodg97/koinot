(()=>{'use strict';
 const KX=window.KX=window.KX||{};
 const F='fill="currentColor" stroke="none"';
 const P={
  film:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v14M17 5v14M3 9h4M3 15h4M17 9h4M17 15h4"/>',
  rec:`<circle cx="12" cy="12" r="6.5" ${F}/>`,
  dot:`<circle cx="12" cy="12" r="4.5" ${F}/>`,
  galaxy:`<path d="M12 12c0-3 3-5 6-3s2 7-3 8-10-1-10-6 5-9 11-8"/><circle cx="12" cy="12" r="1.4" ${F}/>`,
  planet:'<circle cx="12" cy="12" r="6"/><ellipse cx="12" cy="12" rx="11" ry="3.6" transform="rotate(-28 12 12)"/>',
  cosmos:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/><path d="M17 3.5v4M15 5.5h4"/>',
  telescope:'<path d="m3 13.5 12-6 2.2 4.4-12 6Z"/><path d="m15 7.5 3-1.5 2.2 4.4-3 1.5M10 15.5l-3 5.5M12.5 14l3 7"/>',
  live:`<circle cx="12" cy="12" r="1.8" ${F}/><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.5 5.5a9.2 9.2 0 0 0 0 13M18.5 5.5a9.2 9.2 0 0 1 0 13"/>`,
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="7"/>',
  shooting:'<path d="m3.5 20.5 9-9"/><path d="m15 3 1.6 3.9L20.5 8.5l-3.9 1.6L15 14l-1.6-3.9L9.5 8.5l3.9-1.6Z"/>',
  clip:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM8.5 12h7M8.5 16h4"/>',
  doc:'<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  star:'<path d="m12 3 2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 17l-5.6 3 1.3-6.2L3 9.5l6.3-.7Z"/>',
  moon:'<path d="M19.5 15A8 8 0 0 1 9 4.5a8 8 0 1 0 10.5 10.5Z"/>',
  tag:`<path d="M3 12V4h8l10 10-8 8Z"/><circle cx="7.6" cy="8.6" r="1.2" ${F}/>`,
  books:'<path d="M4 4h4v16H4zM10 4h4v16h-4z"/><path d="m16 6.5 3.8 1-3.6 12.5-3.8-1Z"/>',
  scale:'<path d="M12 4v16M7 20h10M5 7h14"/><path d="m5 7-3 7a3 3 0 0 0 6 0ZM19 7l-3 7a3 3 0 0 0 6 0Z"/>',
  trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0ZM8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 20h8M10 17h4"/>',
  notebook:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v18M12.5 8h3.5M12.5 12h3.5"/>',
  camera:'<path d="M4 8h3l2-3h6l2 3h3v12H4Z"/><circle cx="12" cy="13.5" r="3.5"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3.2 3 3.2 15 0 18M12 3c-3.2 3-3.2 15 0 18"/>',
  alarm:'<circle cx="12" cy="13" r="7"/><path d="M12 9v4l2.5 1.5M4 5.5 7 3M20 5.5 17 3"/>',
  bell:'<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4ZM10 21h4"/>',
  map:'<path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2ZM9 4v14M15 6v14"/>',
  ruler:'<path d="m3 16 13-13 5 5L8 21Z"/><path d="m7 12 2 2M10 9l2 2M13 6l2 2"/>',
  heart:'<path d="M12 20S3 14.5 3 8.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 9 1.5C21 14.5 12 20 12 20Z"/>',
  dev:'<rect x="4" y="5" width="16" height="11" rx="1.6"/><path d="M2 19.5h20M10 8.5l-2.5 2.5L10 13.5M14 8.5l2.5 2.5-2.5 2.5"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>',
  comet:'<circle cx="16.5" cy="7.5" r="3.5"/><path d="M14 10 3.5 20.5M11.5 7.5 7 11M16.5 12.5 13 17"/>',
  eclipse:`<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16Z" ${F}/>`,
  quarter:`<circle cx="12" cy="12" r="8"/><path d="M12 12V4a8 8 0 0 1 8 8Z" ${F}/>`,
  target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/>',
  target2:`<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.6" ${F}/>`,
  spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/>',
  play:`<path d="m8 5 11 7-11 7Z" ${F}/>`,
  pause:`<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" ${F}/>`,
  check:'<path d="m5 12.5 4.5 4.5L19 7"/>',
  close:'<path d="M6 6l12 12M18 6 6 18"/>',
  arrow:'<path d="M4 12h15m-5-5 5 5-5 5"/>',
  swap:'<path d="M4 8h14m-4-4 4 4-4 4M20 16H6m4-4-4 4 4 4"/>',
  refresh:'<path d="M20 12a8 8 0 1 1-2.6-5.9M20 4v5h-5"/>',
  expand:'<path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5"/>',
  home:'<path d="m3 10.5 9-7.5 9 7.5V20H3Z"/><path d="M9.5 20v-6h5v6"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  up:'<path d="m6 15 6-6 6 6"/>',down:'<path d="m6 9 6 6 6-6"/>',
  undo:'<path d="M9 6 4 11l5 5M4 11h10a5 5 0 0 1 0 9h-3"/>',
  hourglass:'<path d="M7 3h10M7 21h10M8 3c0 5 4 6 4 9s-4 4-4 9M16 3c0 5-4 6-4 9s4 4 4 9"/>'
 };

 const MAP={'👨‍💻':'dev','🎬':'film','⏺':'rec','🔴':'rec','⚫':'dot','●':'dot','🌀':'galaxy','🪐':'planet','🌌':'cosmos','🔭':'telescope','📡':'live','⚙':'gear','🌠':'shooting','📋':'clip','📜':'doc','⭐':'star','★':'star','🌙':'moon','☾':'moon','🏷':'tag','📚':'books','⚖':'scale','🏆':'trophy','📓':'notebook','📷':'camera','🔗':'link','🌐':'globe','⏰':'alarm','🔔':'bell','🗺':'map','📏':'ruler','💛':'heart','☀':'sun','☄':'comet','◐':'eclipse','◔':'quarter','◎':'target','◉':'target2','✦':'spark','▶':'play','⏸':'pause','❚❚':'pause','✓':'check','✕':'close','➜':'arrow','⇄':'swap','↺':'refresh','↻':'refresh','⛶':'expand','⌂':'home','☰':'menu','▴':'up','▾':'down','⮌':'undo','⏳':'hourglass'};
 const keys=Object.keys(MAP).sort((a,b)=>b.length-a.length);
 const RXG='(?:'+keys.join('|')+')[\\uFE0E\\uFE0F]?';
 const RX=new RegExp(RXG+'[ \\u00A0]?','gu'),RXT=new RegExp(RXG,'u'),RXS=new RegExp('^(?:'+RXG+'[ \\u00A0]*)+','u');
 const svg=n=>`<svg class="ic ic-${n}" viewBox="0 0 24 24" aria-hidden="true">${P[n]||P.dot}</svg>`;
 const strip=s=>typeof s==='string'?s.replace(RX,'').replace(/^\s+/,''):s;
 const stripLead=s=>typeof s==='string'?s.replace(RXS,''):s;
 const SKIP=new Set(['SCRIPT','STYLE','TEXTAREA','CANVAS','TITLE','NOSCRIPT']);
 const mk=h=>{const t=document.createElement('template');t.innerHTML=h;return t.content.firstChild;};
 function text(n){
  const v=n.nodeValue;if(!v||!RXT.test(v))return;const p=n.parentNode;if(!p||SKIP.has(p.nodeName))return;
  if(p.nodeName==='OPTION'||p.nodeName==='OPTGROUP'){n.nodeValue=strip(v);return;}
  const frag=document.createDocumentFragment();let last=0,m;RX.lastIndex=0;
  while((m=RX.exec(v))){if(m.index>last)frag.appendChild(document.createTextNode(v.slice(last,m.index)));
   const g=m[0].replace(/[︎️  ]/g,'');frag.appendChild(mk(svg(MAP[g]||'dot')));last=m.index+m[0].length;}
  if(last<v.length)frag.appendChild(document.createTextNode(v.slice(last)));
  p.replaceChild(frag,n);
 }
 const AT=['title','aria-label','placeholder','alt'];
 function attrs(e){for(const a of AT){const v=e.getAttribute&&e.getAttribute(a);if(v&&RXT.test(v)){const s=strip(v);if(s!==v)e.setAttribute(a,s);}}}
 function scan(root){
  if(!root)return;
  if(root.nodeType===3){text(root);return;}
  if(root.nodeType!==1)return;
  if(SKIP.has(root.nodeName))return;
  attrs(root);
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT,{acceptNode:n=>n.nodeType===1&&SKIP.has(n.nodeName)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
  const list=[];let n;while((n=w.nextNode()))list.push(n);
  for(const x of list){if(x.nodeType===3)text(x);else attrs(x);}
 }
 const mo=new MutationObserver(ms=>{for(const m of ms){
  if(m.type==='childList')m.addedNodes.forEach(scan);
  else if(m.type==='characterData')text(m.target);
  else if(m.type==='attributes')attrs(m.target);}});
 const start=()=>{scan(document.body);mo.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:AT});};
 KX.icons={svg,strip,stripLead,scan,paths:P,map:MAP};
 if(document.body)start();else document.addEventListener('DOMContentLoaded',start);
})();
