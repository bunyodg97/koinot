window.KOINOT_EXOSYSTEMS=[
 {id:'trappist',name:'TRAPPIST-1',spect:'M',slug:'trappist-1-',source:'https://science.nasa.gov/exoplanets/trappist1/',planets:[
  ['b',1.5,.01154,1.116,1.374],['c',2.4,.0158,1.097,1.308],['d',4,.02227,.788,.388],['e',6.1,.02925,.92,.692],['f',9.2,.03849,1.045,1.039],['g',12.4,.04683,1.129,1.321],['h',18.8,.06189,.755,.326]
 ]},
 {id:'proxima',name:'Proxima Centauri',spect:'M5Ve',slug:'proxima-centauri-',source:'https://science.nasa.gov/exoplanet-catalog/proxima-centauri-b/',planets:[['b',11.2,.04856,null,null]]},
 {id:'toi700',name:'TOI-700',spect:'M2V',source:'https://exoplanetarchive.ipac.caltech.edu/',planets:[
  ['b',9.98,.0637,1.01,null],['c',16.05,.0925,2.63,null],['d',37.42,.1633,1.14,null],['e',27.8,.134,.95,null]
 ]},
 {id:'lhs1140',name:'LHS 1140',spect:'M4.5V',source:'https://exoplanetarchive.ipac.caltech.edu/',planets:[
  ['c',3.78,.027,1.27,1.91],['b',24.74,.0936,1.73,5.6]
 ]},
 {id:'kepler186',name:'Kepler-186',spect:'M1V',source:'https://exoplanetarchive.ipac.caltech.edu/',planets:[
  ['b',3.887,.0343,1.07,null],['c',7.267,.0451,1.25,null],['d',13.34,.0781,1.4,null],['e',22.41,.11,1.27,null],['f',129.9,.432,1.17,null]
 ]},
 {id:'kepler452',name:'Kepler-452',spect:'G2',source:'https://exoplanetarchive.ipac.caltech.edu/',planets:[['b',384.8,1.046,1.63,null]]},
 {id:'cancri55',name:'55 Cancri',spect:'K0IV-V',source:'https://exoplanetarchive.ipac.caltech.edu/',planets:[
  ['e',.7365,.0154,1.88,8],['b',14.65,.1134,null,264],['c',44.4,.2373,null,54],['f',260,.7708,null,45],['d',4800,5.74,null,1208]
 ]},
 {id:'peg51',name:'51 Pegasi',spect:'G2IV',source:'https://exoplanetarchive.ipac.caltech.edu/',planets:[['b',4.231,.0527,null,149]]},
 {id:'hd209458',name:'HD 209458',spect:'G0V',source:'https://exoplanetarchive.ipac.caltech.edu/',planets:[['b',3.525,.0475,15.5,219]]}
].map(s=>({...s,planets:s.planets.map(([letter,period,au,radius,mass])=>({id:s.id+'-'+letter,name:s.name+' '+letter,letter,period,au,radius,mass,source:s.slug?'https://science.nasa.gov/exoplanet-catalog/'+s.slug+letter+'/':s.source}))}));
