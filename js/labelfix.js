(()=>{'use strict';
 const app=window.koinot;if(!app)return;
 const st=document.createElement('style');st.textContent='.lbl-hide{visibility:hidden!important}';document.head.append(st);
 const vis=el=>{const r=el.getBoundingClientRect();if(r.width<2||r.height<2)return null;const cs=getComputedStyle(el);if(cs.display==='none'||parseFloat(cs.opacity)<.05)return null;return r;};
 const hit=(a,b,pad=2)=>!(a.right+pad<b.left||b.right+pad<a.left||a.bottom+pad<b.top||b.bottom+pad<a.top);
 function run(list){
  const acc=[];for(const el of list){el.classList.remove('lbl-hide');const r=vis(el);if(!r)continue;if(acc.some(a=>hit(a,r))){el.classList.add('lbl-hide');}else acc.push(r);}
 }
 function tick(){
  if(document.hidden||document.body.classList.contains('cinema'))return;
  try{
   if(window.koinot.journey?.active){run([...document.querySelectorAll('.journey-label')]);}
   else{const sel=app.selected,ent=[...app.labels.entries()].map(([id,el])=>[id,el,app.bodies.get(id)?.data?.radius||0]);
    ent.sort((a,b)=>(b[0]===sel)-(a[0]===sel)||(b[0]==='sun')-(a[0]==='sun')||b[2]-a[2]);run(ent.map(e=>e[1]));}
  }catch(e){}
 }
 setInterval(tick,300);
})();
