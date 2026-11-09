(()=>{'use strict';
 const nav=document.querySelector('.lab-tabs');if(!nav||!window.KoinotLab)return;
 const G=[['🎬','Namoyish',['guide','video','scale','compare','quiz']],['🌌','Koinotni o‘rganish',null],['🔭','Kuzatuvchiga',['sky','cal','tonight','scope']],['📡','Jonli',['live']],['⚙','Sozlash va ma’lumot',['credits','share']]];
 const gOf=id=>{for(let i=0;i<G.length;i++)if(G[i][2]&&G[i][2].includes(id))return i;return 1;};
 let cur=null,q='';
 const bar=document.createElement('div');bar.className='lab-groups';
 bar.innerHTML=`<button data-g="-1">Hammasi</button>`+G.map((g,i)=>`<button data-g="${i}">${g[0]} ${g[1]}</button>`).join('')+`<input type="search" placeholder="Bo‘lim qidirish…" aria-label="Bo‘lim qidirish" autocomplete="off">`;
 nav.before(bar);
 const norm=t=>t.toLowerCase().replace(/[‘’ʻ`']/g,'');
 function apply(){bar.querySelectorAll('button').forEach(b=>b.classList.toggle('on',+b.dataset.g===cur&&!q));
  nav.querySelectorAll('button[data-lab]').forEach(b=>{const id=b.dataset.lab,ok=q?norm(b.textContent).includes(q):(cur===-1||gOf(id)===cur);b.classList.toggle('lab-hide',!ok);});}
 bar.onclick=e=>{const b=e.target.closest('button');if(!b)return;cur=+b.dataset.g;q='';bar.querySelector('input').value='';apply();};
 bar.querySelector('input').oninput=e=>{q=norm(e.target.value.trim());apply();};
 let last='';const sync=()=>{const a=nav.querySelector('button.active');if(a&&a.dataset.lab!==last){last=a.dataset.lab;if(cur===null||(cur>=0&&!q))cur=gOf(last);}apply();};
 new MutationObserver(sync).observe(nav,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
 sync();
})();
