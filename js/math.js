(function(root){
 const TAU=Math.PI*2;
 function orbitalPosition(d,days){const a=(d.phase||0)+(d.period?days/d.period*TAU:0),r=d.orbit||0,inc=(d.inclination||0)*Math.PI/180;return {x:Math.cos(a)*r,y:Math.sin(a)*r*Math.sin(inc),z:Math.sin(a)*r*Math.cos(inc)};}
 function clamp(v,lo,hi){return Math.min(hi,Math.max(lo,v));}
 root.KoinotMath={orbitalPosition,clamp,TAU};
})(typeof window==='undefined'?globalThis:window);
