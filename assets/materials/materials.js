/* Materials independent of catalogue and UI; all maps loaded from local offline bundle. */
window.KoinotMaterials = (()=>{
 const T=THREE, cache={}, solarTime={value:0};
 function texture(name,linear=false){
  if(!cache[name]){
   const src=window.KOINOT_TEXTURES?.[name];
   if(!src) throw new Error('Tekstura topilmadi: '+name);
   const tx=new T.TextureLoader().load(src);tx.colorSpace=linear?T.NoColorSpace:T.SRGBColorSpace;tx.anisotropy=4;cache[name]=tx;
  }return cache[name];
 }
 function material(d){
  if(d.id==='sun'){const m=new T.MeshBasicMaterial({map:texture(d.texture),color:0xffedc2});m.onBeforeCompile=shader=>{shader.uniforms.solarTime=solarTime;shader.fragmentShader='uniform float solarTime;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
#ifdef USE_MAP
vec2 uv=vMapUv;float grain=sin(uv.x*950.0+sin(uv.y*350.0)+solarTime*.6)*sin(uv.y*740.0-solarTime*.45);float spot=pow(max(0.0,sin(uv.x*31.0+sin(uv.y*18.0))*sin(uv.y*23.0)),18.0);diffuseColor.rgb*=1.0+grain*.07-spot*.45;
#endif`);};m.customProgramCacheKey=()=> 'koinot-solar25';return m;}
  const m=new T.MeshStandardMaterial({map:texture(d.texture),roughness:d.id==='earth'?.88:1,metalness:0});
  if(d.id==='earth'){
   m.emissiveMap=texture('2k_earth_nightmap.jpg');m.emissive=new T.Color(0xffc58a);
   m.emissiveIntensity=.8;
   m.userData.starPosition={value:new T.Vector3(0,0,0)};
   m.onBeforeCompile=shader=>{
    shader.uniforms.starPosition=m.userData.starPosition;
    shader.vertexShader='varying vec3 surfaceWorld; varying vec3 normalWorld;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nsurfaceWorld=(modelMatrix*vec4(position,1.0)).xyz;normalWorld=normalize(mat3(modelMatrix)*normal);');
    shader.fragmentShader='uniform vec3 starPosition; varying vec3 surfaceWorld; varying vec3 normalWorld;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`#ifdef USE_EMISSIVEMAP
      vec4 emissiveColor=texture2D(emissiveMap,vEmissiveMapUv);
      float facing=dot(normalize(normalWorld),normalize(starPosition-surfaceWorld));
      totalEmissiveRadiance*=emissiveColor.rgb*(1.0-smoothstep(-0.15,0.15,facing));
      #endif`);
   };

  }return m;
 }
 function atmosphere(color){return new T.ShaderMaterial({uniforms:{tint:{value:new T.Color(color)}},vertexShader:`varying vec3 vNormal;varying vec3 vEye;void main(){vec4 p=modelViewMatrix*vec4(position,1.0);vNormal=normalize(normalMatrix*normal);vEye=normalize(-p.xyz);gl_Position=projectionMatrix*p;}`,fragmentShader:`varying vec3 vNormal;varying vec3 vEye;uniform vec3 tint;void main(){float rim=pow(1.0-max(dot(normalize(vNormal),normalize(vEye)),0.0),3.8);gl_FragColor=vec4(tint,rim*.46);}`,transparent:true,depthWrite:false,blending:T.AdditiveBlending});}
 function glowTexture(){const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d'),g=ctx.createRadialGradient(128,128,20,128,128,128);g.addColorStop(0,'rgba(255,180,40,.55)');g.addColorStop(.35,'rgba(255,115,12,.24)');g.addColorStop(.65,'rgba(255,80,0,.07)');g.addColorStop(1,'rgba(255,70,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,256,256);return new T.CanvasTexture(c);}
 return {texture,material,atmosphere,glowTexture,tick(seconds){solarTime.value=seconds;}};
})();
