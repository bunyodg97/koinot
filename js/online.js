(()=>{'use strict';
 const KX=window.KX=window.KX||{};
 const LS={get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v);}catch(e){return d;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}};
 const net={on:LS.get('koinot-net',true)!==false,LS};KX.net=net;
 net.enabled=()=>net.on&&navigator.onLine!==false;
 net.set=v=>{net.on=!!v;LS.set('koinot-net',net.on);};
 net.toggle=()=>{net.set(!net.on);const t=document.getElementById('toast');if(t){t.textContent=net.on?'Internetdan foydalanish YOQILDI (ob-havo, suratlar, NASA yangilanishi). Dastur internetsiz ham ishlaydi.':'Internetdan foydalanish O‘CHIRILDI — dastur faqat ichki ma’lumot bilan ishlaydi.';t.classList.add('show');clearTimeout(net.tt);net.tt=setTimeout(()=>t.classList.remove('show'),4200);}};
 async function getJSON(url,ms=12000){const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);try{const r=await fetch(url,{signal:c.signal,mode:'cors',credentials:'omit',referrerPolicy:'no-referrer'});if(!r.ok)throw new Error('HTTP '+r.status);return await r.json();}finally{clearTimeout(t);}}
 net.getJSON=getJSON;
 const cached=(key,ttl,fn)=>async()=>{const c=LS.get(key,null);if(c&&Date.now()-c.t<ttl)return c.v;const v=await fn();LS.set(key,{t:Date.now(),v});return v;};

 net.weather=async(lat,lon)=>{const k='koinot-wx-'+lat.toFixed(2)+'_'+lon.toFixed(2);
  return cached(k,3600e3,()=>getJSON(`https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(3)}&longitude=${lon.toFixed(3)}&hourly=cloud_cover,temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=UTC&forecast_days=7`).then(j=>j.hourly))();};
 net.weatherBlock=async(lat,lon,dusk,dawn)=>{
  if(!net.enabled())return '';
  try{const h=await net.weather(lat,lon),t0=dusk.getTime(),t1=dawn.getTime(),rows=[];
   h.time.forEach((s,i)=>{const ms=Date.parse(s+':00Z');if(ms>=t0-1800e3&&ms<=t1+1800e3)rows.push({ms,c:h.cloud_cover[i],T:h.temperature_2m[i],H:h.relative_humidity_2m[i],W:h.wind_speed_10m[i]});});
   if(!rows.length){const last=Date.parse(h.time[h.time.length-1]+':00Z');return `<div class="ob-sum">🌐 Ob-havo prognozi: bu sana prognoz oralig‘ida emas (${Date.now()>t1?'o‘tgan sana':'7 kundan uzoq'}).</div>`;}
   const avg=a=>a.reduce((s,x)=>s+x,0)/a.length,cm=avg(rows.map(r=>r.c)),clear=rows.filter(r=>r.c<30).length,mx=Math.max(...rows.map(r=>r.W)),Tm=Math.min(...rows.map(r=>r.T)),Hm=Math.max(...rows.map(r=>r.H));
   const verdict=cm<25?['Ochiq','#5ee0a0']:cm<60?['Qisman bulutli','#ffc65a']:['Bulutli','#ff9a8a'];
   const bars=rows.map(r=>`<i title="${new Date(r.ms+5*3600e3).toISOString().slice(11,16)} · bulut ${r.c}%" style="height:${6+Math.round((100-r.c)*.22)}px;background:${r.c<30?'#5ee0a0':r.c<60?'#ffc65a':'#6a7f93'}"></i>`).join('');
   return `<div class="ob-sum"><b style="color:${verdict[1]}">🌐 Ob-havo: ${verdict[0]}</b> · o‘rtacha bulutlilik ${cm.toFixed(0)}% · ochiq soatlar: ${clear} / ${rows.length}<div class="ob-wx">${bars}</div><small>Harorat ≥ ${Tm.toFixed(0)}°C · namlik ≤ ${Hm.toFixed(0)}% · shamol ≤ ${(mx/3.6).toFixed(0)} m/s${Hm>90?' · yuqori namlik: optikada shudring bo‘lishi mumkin':''}. Har ustun — bir soat (yashil = ochiq). Manba: Open-Meteo prognozi; aniqligi kafolatlanmaydi, kuzatuvdan oldin yana tekshiring.</small></div>`;
  }catch(e){return `<div class="ob-sum"><small>🌐 Ob-havo prognozini olib bo‘lmadi (${(e.name==='AbortError'?'vaqt tugadi':e.message)||'xato'}). Internet va «Internet» sozlamasini tekshiring.</small></div>`;}
 };

 const WIKI={mw:'Milky Way',lmc:'Large Magellanic Cloud',smc:'Small Magellanic Cloud',m31:'Andromeda Galaxy',m33:'Triangulum Galaxy',n6822:"Barnard's Galaxy",ic10:'IC 10',m32:'Messier 32',m81:'Messier 81',m82:'Messier 82',cena:'Centaurus A',m83:'Messier 83',n253:'Sculptor Galaxy',m101:'Pinwheel Galaxy',m51:'Whirlpool Galaxy',m104:'Sombrero Galaxy',m64:'Black Eye Galaxy',m63:'Sunflower Galaxy',m74:'Messier 74',m94:'Messier 94',m106:'Messier 106',m108:'Messier 108',n1300:'NGC 1300',n1365:'NGC 1365',n4565:'NGC 4565',m77:'Messier 77',m87:'Messier 87',m49:'Messier 49',m60:'Messier 60',antn:'Antennae Galaxies',cart:'Cartwheel Galaxy',hoag:"Hoag's Object",ic1101:'IC 1101'};
 net.galPhoto=async id=>{if(!net.enabled()||!WIKI[id])return '';
  try{const j=await cached('koinot-wiki-'+id,7*864e5,()=>getJSON('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(WIKI[id].replace(/ /g,'_'))).then(r=>({src:r.thumbnail?.source||'',w:r.thumbnail?.width,h:r.thumbnail?.height,url:r.content_urls?.desktop?.page||'',title:r.title})))();
   if(!j.src||!/^https:\/\/upload\.wikimedia\.org\//.test(j.src))return '';
   const e=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
   return `<figure class="ga-photo"><img src="${e(j.src)}" alt="${e(j.title)} — surat" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.remove()"><figcaption>🌐 Haqiqiy surat (internetdan). Manba: <a href="${e(j.url)}" target="_blank" rel="noopener noreferrer">Vikipediya — ${e(j.title)}</a>; muallif va litsenziya shu sahifada. ${id==='mw'?'Somon Yo‘lining tashqaridan haqiqiy surati yo‘q — bu rassom tasviri bo‘lishi mumkin.':''}</figcaption></figure>`;
  }catch(e){return '';}
 };

 const HOST={proxima:'Proxima Cen',barnard:"Barnard's Star",epseri:'eps Eri',tauceti:'tau Cet',gj1214:'GJ 1214',lhs1140:'LHS 1140',trappist1:'TRAPPIST-1',cnc55:'55 Cnc',peg51:'51 Peg',kepler186:'Kepler-186',toi700:'TOI-700',hd209458:'HD 209458',hr8799:'HR 8799',kepler452:'Kepler-452'};
 const letter=n=>String(n).trim().split(/\s+/).pop();
 const num=v=>v==null||v===''||!isFinite(+v)?null:+v;
 function applyRows(rows,date){let upd=0,add=0;
  for(const s of window.KOINOT_EXO||[]){const host=HOST[s.id];if(!host)continue;const mine=rows.filter(r=>r.hostname===host);if(!mine.length)continue;
   for(const r of mine){const L=letter(r.pl_name),a=num(r.pl_orbsmax),P=num(r.pl_orbper),R=num(r.pl_rade),M=num(r.pl_bmasse),e=num(r.pl_orbeccen);let p=s.p.find(q=>letter(q[0])===L);
    if(p){if(a)p[1]=a;if(P)p[2]=P;if(R){p[3]=R;p[6]=0;}if(M!=null)p[4]=M;if(e!=null)p[5]=e;upd++;}
    else if(a&&P){const Re=R||(M?Math.max(.8,Math.min(13,Math.pow(M,M<10?.55:.1))):1);s.p.push([r.pl_name,a,P,Re,M,e||0,R?0:1,'NASA Archive’dan qo‘shilgan'+(R?'':' (radius taxminiy)')]);add++;}}
   s.p.sort((x,y)=>x[1]-y[1]);s.nasa=date;}
  return {upd,add};}
 try{const c=LS.get('koinot-exo-nasa',null);if(c&&Array.isArray(c.rows))applyRows(c.rows,c.date);}catch(e){}
 net.exoRefresh=async()=>{
  if(!net.enabled())throw new Error('Internet o‘chirilgan yoki aloqa yo‘q');
  const hosts=Object.values(HOST).map(h=>"'"+h.replace(/'/g,"''")+"'").join(','),q=`select pl_name,hostname,pl_orbsmax,pl_orbper,pl_rade,pl_bmasse,pl_orbeccen from pscomppars where hostname in (${hosts})`;
  const rows=await getJSON('https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query='+encodeURIComponent(q).replace(/%20/g,'+')+'&format=json',20000);
  if(!Array.isArray(rows)||!rows.length)throw new Error('Javob bo‘sh');
  const date=new Date().toISOString().slice(0,10),r=applyRows(rows,date);LS.set('koinot-exo-nasa',{date,rows});return Object.assign(r,{date,n:rows.length});};
 net.exoReset=()=>{LS.set('koinot-exo-nasa',null);};
})();
