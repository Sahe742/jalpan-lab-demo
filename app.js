'use strict';
(()=>{
 const $=id=>document.getElementById(id); let stream=null, installEvent=null;
 const setStatus=(msg,cls='')=>{ $('status').textContent=msg; $('status').className='small '+cls; };
 function tabs(name){ document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x.dataset.tab===name)); ['cam','diag','inst','users'].forEach(x=>$(x).classList.toggle('hide',x!==name)); if(name==='diag')diagnostics(); if(name==='users')userLab(); }
 document.querySelectorAll('.tab').forEach(x=>x.addEventListener('click',()=>tabs(x.dataset.tab)));
 async function start(){if(!navigator.mediaDevices?.getUserMedia){setStatus('Cámara no disponible. Abre desde HTTPS o localhost en un teléfono con cámara.','bad');return;}try{stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:960}}});$('video').srcObject=stream; await $('video').play();$('snap').disabled=false;$('stop').disabled=false;$('start').disabled=true;setStatus('Cámara activada. Apunta a una tarjeta de PRUEBA, nunca a una INE real.','good');}catch(e){setStatus('No se pudo abrir la cámara: '+e.name+' — '+e.message,'bad');}}
 function stop(){if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}$('video').srcObject=null;$('snap').disabled=true;$('stop').disabled=true;$('start').disabled=false;setStatus('Cámara apagada.');}
 function quality(data,w,h){
  let sx=Math.floor(w*.14),ex=Math.floor(w*.86),sy=Math.floor(h*.23),ey=Math.floor(h*.77);
  const cw=ex-sx,ch=ey-sy,g=new Float32Array(cw*ch);let sum=0,sum2=0,low=0,high=0;
  for(let y=0;y<ch;y++)for(let x=0;x<cw;x++){let p=((y+sy)*w+(x+sx))*4,v=(data[p]*.299+data[p+1]*.587+data[p+2]*.114);g[y*cw+x]=v;sum+=v;sum2+=v*v;if(v<25)low++;if(v>245)high++;}
  const n=cw*ch,mean=sum/n,contrast=Math.sqrt(Math.max(0,sum2/n-mean*mean));let edge=0,ct=0;
  for(let y=2;y<ch-2;y+=2)for(let x=2;x<cw-2;x+=2){const i=y*cw+x;const lap=Math.abs(4*g[i]-g[i-1]-g[i+1]-g[i-cw]-g[i+cw]);edge+=lap;ct++;}
  const sharp=edge/(ct||1),dark=low/n,glare=high/n;
  const flags=[];if(w<640||h<480) flags.push('resolución insuficiente');if(mean<55)flags.push('muy oscura');if(mean>205)flags.push('sobreexpuesta');if(contrast<28)flags.push('poco contraste');if(sharp<15)flags.push('posible desenfoque');if(glare>.18)flags.push('demasiado brillo o reflejo');
  return {width:w,height:h,mean,contrast,sharp,dark,glare,flags,ok:flags.length===0};
 }
 function snapshot(){const v=$('video');if(!stream||!v.videoWidth){setStatus('No hay video disponible para analizar.','bad');return;}const w=Math.min(v.videoWidth,1280),h=Math.round(v.videoHeight*w/v.videoWidth);const c=$('canvas');c.width=w;c.height=h;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(v,0,0,w,h);const im=x.getImageData(0,0,w,h);const q=quality(im.data,w,h);x.clearRect(0,0,w,h);c.width=1;c.height=1;
 $('assessment').classList.remove('hide');$('verdict').innerHTML=q.ok?'<strong class="good">Calidad preliminar aceptable en la prueba.</strong> No significa que el texto sea legible ni que el documento sea auténtico.':'<strong class="bad">Calidad insuficiente o incierta.</strong> '+q.flags.join(', ')+'. Repite la toma.';
 $('metrics').innerHTML=[['Resolución',q.width+' × '+q.height],['Brillo medio',q.mean.toFixed(1)],['Contraste',q.contrast.toFixed(1)],['Nitidez aproximada',q.sharp.toFixed(1)]].map(([a,b])=>'<div class="metric"><b>'+b+'</b><span>'+a+'</span></div>').join('');$('assessment').scrollIntoView({behavior:'smooth',block:'nearest'});
 }
 function diagnostics(){const vals={url:location.href,secureContext:isSecureContext,https:location.protocol==='https:',cameraApi:!!navigator.mediaDevices?.getUserMedia,serviceWorker:'serviceWorker' in navigator,online:navigator.onLine,platform:navigator.userAgent.slice(0,180),localTime:new Date().toISOString(),mode:matchMedia('(display-mode: standalone)').matches?'instalada':'navegador'};$('diagnostics').textContent=JSON.stringify(vals,null,2);$('checks').innerHTML=[['HTTPS',vals.https],['Cámara',vals.cameraApi],['Service worker',vals.serviceWorker],['Red',vals.online]].map(([k,v])=>'<span class="pill">'+k+': '+(v?'Sí':'No')+'</span>').join('');}
 function selftest(){
  const w=800,h=600,source=document.createElement('canvas');source.width=w;source.height=h;
  const ctx=source.getContext('2d',{willReadFrequently:true});
  ctx.fillStyle='#f7f7f7';ctx.fillRect(0,0,w,h);
  // Test stripes occupy the same central region measured by quality().
  for(let i=0;i<30;i++){ctx.fillStyle=i%2?'#101010':'#e9e9e9';ctx.fillRect(100+i*18,180,14,250);}
  const defined=quality(ctx.getImageData(0,0,w,h).data,w,h);
  // Critical fix: blur into a DIFFERENT canvas. Drawing a canvas on itself
  // is undefined across engines and previously gave identical metrics on iPhone.
  const blurredCanvas=document.createElement('canvas');blurredCanvas.width=w;blurredCanvas.height=h;
  const blurredCtx=blurredCanvas.getContext('2d',{willReadFrequently:true});
  blurredCtx.fillStyle='#f7f7f7';blurredCtx.fillRect(0,0,w,h);
  blurredCtx.filter='blur(12px)';blurredCtx.drawImage(source,0,0);blurredCtx.filter='none';
  const softened=quality(blurredCtx.getImageData(0,0,w,h).data,w,h);
  const passed=defined.sharp>softened.sharp*1.15;
  $('testOutput').textContent='Prueba de imagen sintética\\nNitidez definida: '+defined.sharp.toFixed(2)+
   '\\nNitidez suavizada: '+softened.sharp.toFixed(2)+'\\nResultado: '+
   (passed?'PASS: distingue diferencia de nitidez':'NO CONCLUYENTE: el navegador no separó bien las imágenes')+
   '\\nEsta prueba NO valida OCR, autenticidad documental ni seguridad de datos.';
 }
 function userLab(){
  const rows=[
   {id:'USR-DEMO-01',nombre:'Coordinación de prueba',rol:'Administrador',estado:'Aprobado'},
   {id:'USR-DEMO-02',nombre:'Capturista ficticio',rol:'Capturista',estado:'Pendiente'}
  ];
  $('userCount').textContent=rows.length+' / 50 cuentas simuladas';
  $('userRows').textContent=rows.map(r=>r.id+' · '+r.nombre+' · '+r.rol+' · '+r.estado).join('\\n');
  $('auditRows').textContent='2026-11-15 · USR-DEMO-01 · USUARIO_SIMULADO · autorización ficticia\\n2026-11-15 · USR-DEMO-02 · ACCESO_PENDIENTE · sin acceso real';
 }

 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e;$('install').classList.remove('hide');});
 $('install').addEventListener('click',async()=>{if(!installEvent)return;installEvent.prompt();await installEvent.userChoice;installEvent=null;$('install').classList.add('hide');});
 $('offline').addEventListener('click',async()=>{if(!('serviceWorker' in navigator)){$('offlineStatus').textContent='Service workers no disponibles.';return;}try{const reg=await navigator.serviceWorker.ready;const cache=await caches.open('jalpan-v05');const keys=await cache.keys();$('offlineStatus').textContent='Service worker: '+(reg.active?'activo':'pendiente')+'. Recursos locales en caché: '+keys.length+'. Prueba final: activa modo avión y vuelve a abrir la aplicación.';}catch(e){$('offlineStatus').textContent='Error: '+e.message;}});
 $('start').addEventListener('click',start);$('stop').addEventListener('click',stop);$('snap').addEventListener('click',snapshot);$('again').addEventListener('click',()=>{ $('assessment').classList.add('hide');window.scrollTo({top:0,behavior:'smooth'});});$('refresh').addEventListener('click',diagnostics);$('selftest').addEventListener('click',selftest);window.addEventListener('pagehide',stop);window.addEventListener('online',diagnostics);window.addEventListener('offline',diagnostics);
 if('serviceWorker' in navigator && location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').catch(e=>console.warn('Service worker:',e));diagnostics();
})();