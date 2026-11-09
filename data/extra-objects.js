(()=>{
 const rows=[
 ['europa','Yevropa','jupiter',3121.6,.6711,3.551,6,.43,'#d9c9ae',1.315,'≈ −160 °C','Yupiterning muzli yo‘ldoshi. Muz qobig‘i ostida okean borligiga kuchli dalillar mavjud.'],
 ['ganymede','Ganimed','jupiter',5262.4,1.0704,7.155,8,.57,'#9f9481',1.428,'≈ −163 °C','Quyosh sistemasidagi eng katta tabiiy yo‘ldosh. O‘z magnit maydoniga ega.'],
 ['titan','Titan','saturn',5149.5,1.2219,15.945,9,.56,'#d49c47',1.352,'≈ −179 °C','Qalin azot atmosferasi, metan va etan ko‘llari bo‘lgan yo‘ldosh.'],
 ['enceladus','Enselad','saturn',504.2,.2380,1.370,6,.24,'#dfebf4',.113,'≈ −201 °C','Muzli yo‘ldosh. Janubiy qutbidan suv bug‘i va muz zarrachalari otiladi.'],
 ['io','Io','jupiter',3643.2,.4217,1.769,4.6,.42,'#d9c36a',1.796,'≈ −143 °C','Quyosh sistemasidagi eng vulqonli jism: yuzlab faol vulqonlari bor.'],
 ['callisto','Kallisto','jupiter',4820.6,1.8827,16.689,10.6,.55,'#6f6559',1.235,'≈ −139 °C','Yupiterning kraterli yo‘ldoshi; yuzasi juda qadimiy va deyarli o‘zgarmagan.'],
 ['pluto','Pluton',null,2376.6,5906.4,90560,102,.6,'#cbb8a0',.62,'≈ −225 °C','Neptun ortidagi mitti sayyora. Muzli sirt va juda siyrak atmosfera.'],
 ['ceres','Serera',null,964.2,413.8,1681.6,36,.32,'#96958d',.28,'≈ −105 °C','Asteroidlar kamaridagi mitti sayyora. Oqartirgan tuz konlari va kraterlari bor.']
 ];
 for(const [id,name,parent,diameter,distance,period,orbit,radius,color,gravity,temp,note] of rows){
  const c=document.createElement('canvas');c.width=1024;c.height=512;const ctx=c.getContext('2d');ctx.fillStyle=color;ctx.fillRect(0,0,1024,512);let seed=id.length*41;const rand=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<1900;i++){const x=rand()*1024,y=rand()*512,r=rand()*20;ctx.fillStyle=`rgba(${i%2?'255,255,255':'30,20,15'},${rand()*.12})`;ctx.beginPath();ctx.ellipse(x,y,r*(id==='titan'?9:1),r*.6,0,0,Math.PI*2);ctx.fill();}
  if(['europa','enceladus'].includes(id)){ctx.strokeStyle=id==='europa'?'#9d725f66':'#8bbedb66';for(let i=0;i<60;i++){ctx.beginPath();let x=rand()*1024,y=rand()*512;ctx.moveTo(x,y);for(let j=0;j<12;j++){x+=rand()*40-20;y+=rand()*40-20;ctx.lineTo(x,y);}ctx.stroke();}}
  const texture='illustration_'+id+'.png';KOINOT_TEXTURES[texture]=c.toDataURL('image/png');
  KOINOT_CATALOG.push({id,name,parent,diameter,distance,period,orbit,radius,color,gravity,temp,texture,kind:parent?'Tabiiy yo‘ldosh':'Mitti sayyora',subtitle:(parent?KOINOT_CATALOG.find(d=>d.id===parent).name+' yo‘ldoshi':'Mitti sayyora')+' · taxminiy tekstura',rotation:id==='ceres'?9.074:period*24,tilt:0,inclination:parent?1:10,phase:.5+rand()*5,note:note+' Bu tekstura badiiy-protseduraviy, haqiqiy sirt xaritasi emas.',feature:'Qo‘shimcha obyekt',source:parent?'https://ssd.jpl.nasa.gov/sats/phys_par/':'https://science.nasa.gov/dwarf-planets/'});
 }
 const mass={sun:1.9885e30,mercury:3.301e23,venus:4.867e24,earth:5.972e24,moon:7.342e22,mars:6.417e23,jupiter:1.898e27,saturn:5.683e26,uranus:8.681e25,neptune:1.024e26,europa:4.80e22,ganymede:1.482e23,titan:1.345e23,enceladus:1.08e20,pluto:1.303e22,ceres:9.384e20,io:8.932e22,callisto:1.076e23};
 KOINOT_CATALOG.forEach(d=>d.mass=mass[d.id]);
})();
