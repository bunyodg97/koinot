(()=>{'use strict';
 if(!window.KoinotLab||!window.Astronomy)return;
 const {$,esc,fmt,hidpi}=KX,A=Astronomy;
 const VS='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
 const FS=`precision highp float;
uniform vec2 res;uniform vec3 camPos,camR,camU,camF;uniform float time,diskOn,rIn,rOut,expo;
float h1(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float h2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h2(i),h2(i+vec2(1,0)),f.x),mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),f.x),f.y);}
vec3 stars(vec3 d){vec3 c=vec3(0.);
 for(int L=0;L<3;L++){float s=L==0?38.:L==1?85.:170.;vec3 q=d*s,id=floor(q),f=fract(q)-.5;float h=h1(id+float(L)*7.);
  if(h>.93){vec3 o=vec3(h1(id+3.1),h1(id+5.7),h1(id+9.3))-.5;float m=smoothstep(.22,.0,length(f-o*.6));float t=h1(id+1.3);vec3 sc=mix(vec3(1.,.72,.5),vec3(.65,.8,1.),t);c+=sc*m*(.5+1.6*h1(id+2.2))*(L==0?1.:.7);}}
 float band=exp(-pow(dot(d,normalize(vec3(.25,.85,.35)))*3.2,2.));c+=vec3(.16,.2,.32)*band*(.35+.65*vnoise(d.xz*9.+d.y*5.))*.55;return c;}
vec3 diskCol(vec3 hp,vec3 v){float r=length(hp.xz);float T=pow(rIn/r,.75);
 float ang=atan(hp.z,hp.x);float orb=1./(r*sqrt(r));
 float pat=.62+.38*vnoise(vec2(ang*3.+time*orb*6.,log(r)*9.-time*.05))+.15*sin(log(r)*30.+ang*2.-time*orb*8.);
 float beta=min(.75,sqrt(.5/max(r-1.,.05)));vec3 vo=normalize(vec3(-hp.z,0.,hp.x));float g=sqrt(max(1.-1./r,.01));
 float D=1./(1./sqrt(1.-beta*beta)*(1.-beta*dot(vo,-v)));float shift=D*g;
 vec3 hot=vec3(1.,.93,.82),mid=vec3(1.,.55,.18),cool=vec3(.7,.14,.04);float k=clamp(T*shift,0.,1.4);
 vec3 c=k>.7?mix(mid,hot,(k-.7)/.7):mix(cool,mid,k/.7);
 float edge=smoothstep(rIn,rIn*1.12,r)*(1.-smoothstep(rOut*.82,rOut,r));
 return c*pat*pow(clamp(shift,.15,2.4),3.)*pow(T,1.6)*3.2*edge;}
void main(){vec2 uv=(gl_FragCoord.xy-.5*res)/res.y;vec3 rd=normalize(camR*uv.x+camU*uv.y+camF*1.55);
 vec3 p=camPos,v=rd;float hh=dot(cross(p,v),cross(p,v));vec3 col=vec3(0.);float tr=1.;bool done=false;
 for(int i=0;i<300;i++){float r=length(p);if(r<1.0){done=true;tr=0.;break;}if(r>70.&&dot(p,v)>0.)break;
  float dt=clamp(.06*(r-.9),.018,1.1);vec3 a=-1.5*hh*p/(r*r*r*r*r);vec3 pn=p+v*dt;v=normalize(v+a*dt);
  if(diskOn>.5&&p.y*pn.y<0.){float t=p.y/(p.y-pn.y);vec3 hp=mix(p,pn,t);float rr=length(hp.xz);if(rr>rIn&&rr<rOut){col+=diskCol(hp,v)*tr;tr*=.32;}}
  p=pn;}
 if(!done)col+=stars(normalize(v))*tr;
 col=1.-exp(-col*expo);col=pow(col,vec3(.9));gl_FragColor=vec4(col,1.);}`;
 const sky=()=>({city:KX.sky?.city??0});
 const CITY=[41.2995,69.2401,455];
 function makeGL(canvas){const gl=canvas.getContext('webgl',{antialias:false,preserveDrawingBuffer:true})||canvas.getContext('experimental-webgl');if(!gl)return null;
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o;};
  const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(pr));
  gl.useProgram(pr);const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const U={};['res','camPos','camR','camU','camF','time','diskOn','rIn','rOut','expo'].forEach(n=>U[n]=gl.getUniformLocation(pr,n));return {gl,U};}
 const norm=v=>{const l=Math.hypot(...v);return v.map(x=>x/l);},cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const st={id:'sgra',yaw:.6,incl:10,dist:28,disk:true,scale:.6,spin:true,t:0,mass:null};
 function bhTab(body){
  const list=KOINOT_BH;
  body.innerHTML=`<div class="x-grid"><div class="x-main"><canvas class="lab-view x-bh" style="height:min(56vh,460px);cursor:grab" aria-label="Qora tuynuk simulyatsiyasi"></canvas><div class="x-hint" id="bhErr">Sudrab aylantiring. Halqa — orqadagi disk nurining qora tuynuk orqali egilgan tasviri.</div></div>
  <div class="x-side"><div class="lab-row"><label>Qora tuynuk <select id="bhSel">${list.map(b=>`<option value="${b.id}">${b.name}</option>`).join('')}<option value="hyp1">Gipotetik: 1 M☉</option><option value="hyp10">Gipotetik: 10 M☉</option></select></label></div>
  <div class="lab-row"><label>Qiyalik° <input id="bhIncl" type="range" min="0" max="88" value="${st.incl}" style="width:130px"></label><label>Masofa (r<sub>s</sub>) <input id="bhDist" type="range" min="4" max="60" value="${st.dist}" style="width:130px"></label></div>
  <div class="lab-row"><label><input id="bhDisk" type="checkbox" ${st.disk?'checked':''}> Akkretsion disk</label><label><input id="bhSpin" type="checkbox" ${st.spin?'checked':''}> Avto-aylanish</label><label>Sifat <select id="bhQ"><option value=".4">Yengil</option><option value=".6" selected>O‘rta</option><option value=".9">Yuqori</option></select></label></div>
  <div class="lab-result" id="bhInfo"></div></div></div><div class="lab-result" id="bhWhere"></div>
  <p class="lab-note">Model: aylanmaydigan (Shvartsshild) qora tuynuk va yupqa disk; nurlar egri fazo-vaqtda hisoblanadi (GPU). Soya radiusi ≈ 2,6 r<sub>s</sub>; disk ichki chegarasi — ISCO (3 r<sub>s</sub>). Yaqin tomon disk yorqinroq va ko‘kroq (Doppler nurlanishi), uzoq tomoni xiraroq. <b>Bu fotosurat emas</b>: haqiqiy Event Horizon Telescope tasvirlari (aylanish, magnit maydon, issiq plazma) farq qiladi; ranglar badiiy. Ma’lumotlar yaxlitlangan nashr qiymatlari.</p>`;
  const canvas=$('.x-bh',body);let ctx=null,drag=null,dirty=true;
  try{ctx=makeGL(canvas);}catch(e){$('#bhErr',body).textContent='Shader xatosi: '+e.message;}
  if(!ctx){$('#bhErr',body).textContent=$('#bhErr',body).textContent.startsWith('Shader')?$('#bhErr',body).textContent:'WebGL mavjud emas — simulyatsiya ko‘rsatilmaydi (ma’lumotlar quyida).';}
  const sel=$('#bhSel',body);sel.value=st.id;
  const cur=()=>list.find(b=>b.id===st.id)||(st.id==='hyp1'?{name:'Gipotetik 1 M☉',kind:'Gipotetik',M:1,ly:null,note:'Quyosh massasi qora tuynukka siqilsa, r_s ≈ 2,95 km bo‘lardi. Quyosh bunday bo‘lib qolmaydi: massasi qora tuynuk hosil qilish uchun yetarli emas (u oq mittiga aylanadi).'}:{name:'Gipotetik 10 M☉',kind:'Gipotetik',M:10,ly:null,note:'Yulduz massali qora tuynuk uchun tipik massa; r_s ≈ 29,5 km — shahar kattaligida.'});
  function info(){const b=cur(),rs=2.953*b.M,rsAU=rs/1.495978707e8,dKm=st.dist*rs,tdil=Math.sqrt(Math.max(0,1-1/st.dist));
   const sz=rs<1e4?fmt(rs,1)+' km':rs<1e9?fmt(rs/1e6,1)+' mln km':fmt(rs/1.495978707e8,0)+' AU';
   $('#bhInfo',body).innerHTML=`<b>${esc(b.name)}</b> · ${esc(b.kind)}<br>Massa: <b>${b.M>=1e6?fmt(b.M/1e6,2)+' mln':b.M>=1e3?fmt(b.M,0):fmt(b.M,1)} M☉</b><br>Hodisa gorizonti radiusi r<sub>s</sub> = <b>${sz}</b>${b.M>1e5?' ('+fmt(rs/6.957e5,0)+' Quyosh radiusi)':''}<br>Foton sferasi ≈ 1,5 r<sub>s</sub>, ISCO ≈ 3 r<sub>s</sub>.<br>Kamera masofasi ${fmt(st.dist,0)} r<sub>s</sub> ≈ ${dKm<1e9?fmt(dKm,0)+' km':fmt(dKm/1.495978707e8,1)+' AU'}; vaqt sekinlashuvi <b>${fmt(tdil*100,1)}%</b> (uzoq kuzatuvchiga nisbatan).<hr style="border:0;border-top:1px solid #254259">${esc(b.note)}${b.src?`<br><a href="${b.src}" target="_blank" rel="noopener">Manba ↗</a>`:''}`;
   let w='';if(b.ly){const au=b.ly*63241.077;w=`<b>Koinotdagi o‘rni:</b> Quyoshdan ≈ <b>${b.ly>=1e6?fmt(b.ly/1e6,1)+' mln':fmt(b.ly,0)}</b> yorug‘lik yili (${b.ly>1e5?'boshqa galaktikada':'Somon Yo‘li ichida'}); yorug‘lik u yerdan Yerga ${b.ly>=1e6?fmt(b.ly/1e6,1)+' mln':fmt(b.ly,0)} yilda yetib keladi, ya’ni biz uni shuncha yil oldingi holida ko‘ramiz.<br>`;
    if(b.ra!=null){const obs=new A.Observer(CITY[0],CITY[1],CITY[2]),h=A.Horizon(new Date(),obs,b.ra,b.dec,'normal');w+=`Yo‘nalishi: <b>${esc(b.con)}</b> turkumi, RA ${fmt(b.ra,3)} soat, Dec ${fmt(b.dec,2)}°. Hozir Toshkentdan: balandlik <b>${fmt(h.altitude,0)}°</b>, azimut ${fmt(h.azimuth,0)}° — ${h.altitude>0?'ufq ustida (ammo ko‘z bilan ko‘rinmaydi)':'ufq ostida'}. <a href="#" id="bhSky">Osmon xaritasida ko‘rsatish</a>.`;}else w+=`Yo‘nalishi: <b>${esc(b.con)}</b> turkumi.`;}
   else w=`<b>Koinotdagi o‘rni:</b> gipotetik obyekt; real qora tuynuklar ro‘yxatdan tanlang.`;
   $('#bhWhere',body).innerHTML=w;const a=$('#bhSky',body);if(a)a.onclick=e=>{e.preventDefault();if(KX.sky)KX.sky.sel='bh:'+b.id;KoinotLab.render('sky');};}
  sel.onchange=()=>{st.id=sel.value;info();dirty=true;};
  $('#bhIncl',body).oninput=e=>{st.incl=+e.target.value;dirty=true;};$('#bhDist',body).oninput=e=>{st.dist=+e.target.value;info();dirty=true;};
  $('#bhDisk',body).onchange=e=>{st.disk=e.target.checked;dirty=true;};$('#bhSpin',body).onchange=e=>{st.spin=e.target.checked;};$('#bhQ',body).onchange=e=>{st.scale=+e.target.value;dirty=true;};
  canvas.onpointerdown=e=>{drag={x:e.clientX};st.spin=false;$('#bhSpin',body).checked=false;canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing';};canvas.onpointermove=e=>{if(!drag)return;st.yaw-=(e.clientX-drag.x)*.01;drag.x=e.clientX;dirty=true;};canvas.onpointerup=()=>{drag=null;canvas.style.cursor='grab';};
  function render(){if(!ctx)return;const {gl,U}=ctx,w=Math.max(200,Math.round(canvas.clientWidth*st.scale)),h=Math.max(120,Math.round(canvas.clientHeight*st.scale));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
   gl.viewport(0,0,w,h);const inc=st.incl*Math.PI/180,D=st.dist,pos=[D*Math.cos(inc)*Math.sin(st.yaw),D*Math.sin(inc),D*Math.cos(inc)*Math.cos(st.yaw)],f=norm(pos.map(x=>-x));let r=norm(cross(f,[0,1,0]));if(!isFinite(r[0]))r=[1,0,0];const u=cross(r,f);
   gl.uniform2f(U.res,w,h);gl.uniform3fv(U.camPos,pos);gl.uniform3fv(U.camR,r);gl.uniform3fv(U.camU,u);gl.uniform3fv(U.camF,f);gl.uniform1f(U.time,st.t);gl.uniform1f(U.diskOn,st.disk?1:0);gl.uniform1f(U.rIn,3);gl.uniform1f(U.rOut,13);gl.uniform1f(U.expo,1.15);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);}
  KoinotLab.state.labTick=dt=>{st.t+=dt;if(st.spin){st.yaw+=dt*.12;dirty=true;}if(st.disk)dirty=true;if(dirty){dirty=false;render();}};
  KoinotLab.state.cleanup=()=>{const e=ctx?.gl.getExtension('WEBGL_lose_context');e?.loseContext();ctx=null;};
  info();render();
 }
 KX.tab('bh','Qora tuynuk',bhTab);KX.bh={st};
})();
