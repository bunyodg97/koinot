window.KoinotAstro=(()=>{
 const AU=149597870.7,C=299792.458,DAY=86400000;
 const names={mercury:'Mercury',venus:'Venus',earth:'Earth',mars:'Mars',jupiter:'Jupiter',saturn:'Saturn',uranus:'Uranus',neptune:'Neptune',pluto:'Pluto'};
 function ecliptic(v){const p=Astronomy.RotateVector(Astronomy.Rotation_EQJ_ECL(),v);return {x:p.x*AU,y:p.z*AU,z:-p.y*AU};}
 function positions(date,catalog=KOINOT_CATALOG){const out={sun:{x:0,y:0,z:0}};for(const d of catalog){if(d.id==='sun')continue;if(names[d.id])out[d.id]=ecliptic(Astronomy.HelioVector(names[d.id],date));else if(d.id==='moon'){const p=ecliptic(Astronomy.GeoMoon(date)),e=out.earth;out.moon={x:e.x+p.x,y:e.y+p.y,z:e.z+p.z};}else{const days=(date-new Date('2000-01-01T12:00:00Z'))/DAY,a=days/d.period*Math.PI*2+(d.phase||0),r=d.distance*1e6,inc=(d.inclination||0)*Math.PI/180,p=d.parent?out[d.parent]:out.sun;out[d.id]={x:p.x+r*Math.cos(a),y:p.y+r*Math.sin(a)*Math.sin(inc),z:p.z-r*Math.sin(a)*Math.cos(inc)};}}return out;}
 function separation(a,b){return Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);}
 function lightSeconds(a,b){return separation(a,b)/C;}
 function duration(s){if(s>=86400)return (s/86400).toFixed(2)+' kun';const h=Math.floor(s/3600),m=Math.floor(s%3600/60);return (h?h+' soat ':'')+(m?m+' daqiqa ':'')+(s%60).toFixed(1)+' soniya';}
 return {AU,C,DAY,positions,separation,lightSeconds,duration};
})();
