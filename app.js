(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const stage=$('stage'), artwork=$('artwork'), preview=$('preview'), fileInput=$('fileInput');
  const empty=$('emptyState'), zoomLabel=$('zoomLabel'), themeButton=$('themeButton'), toast=$('toast');
  const s={url:null,loaded:false,width:0,height:0,scale:1,fitScale:1,x:0,y:0,pointers:new Map(),pinch:null,lastTap:null,multitouch:false};
  let toastTimer;
  function notify(message) {
    toast.textContent=message; toast.classList.add('visible');
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove('visible'),2900);
  }
  function setTheme(value) {
    const mode=value==='dark'?'dark':'light';
    document.documentElement.dataset.theme=mode;
    themeButton.setAttribute('aria-pressed',String(mode==='dark'));
    const title=mode==='dark'?'Switch to light mode':'Switch to dark mode';
    themeButton.title=title;themeButton.setAttribute('aria-label',title);
    document.querySelector('meta[name="theme-color"]').content=mode==='dark'?'#191c1b':'#f2f2f0';
    document.querySelector('meta[name="color-scheme"]').content=mode;
    try{localStorage.setItem('svg-viewer-theme',mode);}catch{}
  }
  setTheme(document.documentElement.dataset.theme);
  function render() {
    if (!s.loaded) return;
    artwork.style.transform='translate3d('+s.x+'px,'+s.y+'px,0) scale('+s.scale+')';
    const percent=Math.round(s.scale/s.fitScale*100);
    zoomLabel.textContent=percent+'%';
    zoomLabel.setAttribute('aria-label','Zoom '+percent+' percent of fit. Tap to fit');
  }
  function fit() {
    if (!s.loaded) return;
    const w=stage.clientWidth,h=stage.clientHeight;
    const mx=Math.min(65,Math.max(20,w*.075)), availableH=Math.max(90,h-140);
    s.fitScale=Math.max(.0001,Math.min((w-mx*2)/s.width,availableH/s.height));
    s.scale=s.fitScale; s.x=(w-s.width*s.scale)/2; s.y=(h-s.height*s.scale)/2;render();
  }
  const clamp = v => Math.max(s.fitScale*.08,Math.min(s.fitScale*64,v));
  function zoomAt(factor,cx=stage.clientWidth/2,cy=stage.clientHeight/2) {
    if (!s.loaded) return;
    const next=clamp(s.scale*factor), ratio=next/s.scale;
    s.x=cx-(cx-s.x)*ratio; s.y=cy-(cy-s.y)*ratio;s.scale=next;render();
  }
  const point=(x,y)=>{const r=stage.getBoundingClientRect();return {x:x-r.left,y:y-r.top};};
  function pair() {
    const [a,b]=[...s.pointers.values()],p=point(a.x,a.y),q=point(b.x,b.y);
    return {mx:(p.x+q.x)/2,my:(p.y+q.y)/2,d:Math.max(1,Math.hypot(p.x-q.x,p.y-q.y))};
  }
  function startPinch() {
    const p=pair();
    s.pinch={d:p.d,scale:s.scale,imageX:(p.mx-s.x)/s.scale,imageY:(p.my-s.y)/s.scale};
  }
  function resetPointers() {s.pointers.clear();s.pinch=null;stage.classList.remove('is-dragging');}
  stage.addEventListener('pointerdown',e=>{
    if (!s.loaded||(e.pointerType==='mouse'&&e.button!==0)) return;
    e.preventDefault();stage.setPointerCapture(e.pointerId);
    s.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,moved:false,type:e.pointerType});
    if(s.pointers.size===2){s.multitouch=true;startPinch();}
    if(s.pointers.size>2)s.multitouch=true;
    stage.classList.add('is-dragging');
  });
  stage.addEventListener('pointermove',e=>{
    const p=s.pointers.get(e.pointerId);if(!p)return;
    const dx=e.clientX-p.x,dy=e.clientY-p.y;
    p.x=e.clientX;p.y=e.clientY;
    if(Math.hypot(p.x-p.sx,p.y-p.sy)>7)p.moved=true;
    if(s.pointers.size===1){s.x+=dx;s.y+=dy;}
    else if(s.pointers.size===2&&s.pinch){
      const q=pair();s.scale=clamp(s.pinch.scale*q.d/s.pinch.d);
      s.x=q.mx-s.pinch.imageX*s.scale;s.y=q.my-s.pinch.imageY*s.scale;
    }
    render();
  });
  function endPointer(e){
    const p=s.pointers.get(e.pointerId);if(!p)return;
    const tap=s.pointers.size===1&&!s.multitouch&&!p.moved&&p.type==='touch';
    s.pointers.delete(e.pointerId);
    if(tap){
      const now=Date.now();
      if(s.lastTap&&now-s.lastTap.time<320&&Math.hypot(e.clientX-s.lastTap.x,e.clientY-s.lastTap.y)<35){
        fit();s.lastTap=null;
      }else s.lastTap={time:now,x:e.clientX,y:e.clientY};
    }else if(p.moved||s.multitouch)s.lastTap=null;
    if(s.pointers.size<2)s.pinch=null;
    if(s.pointers.size===1){
      const left=s.pointers.values().next().value;
      left.sx=left.x;left.sy=left.y;left.moved=true;
    }
    if(s.pointers.size===0){s.multitouch=false;stage.classList.remove('is-dragging');}
  }
  ['pointerup','pointercancel','lostpointercapture'].forEach(type=>stage.addEventListener(type,endPointer));
  stage.addEventListener('dblclick',()=>{if(s.loaded)fit();});
  stage.addEventListener('wheel',e=>{
    if(!s.loaded)return;e.preventDefault();const p=point(e.clientX,e.clientY);
    zoomAt(Math.exp(-e.deltaY*.0016),p.x,p.y);
  },{passive:false});
  function openPicker(){fileInput.click();}
  async function loadSvg(svgText,name='Untitled.svg'){
    const doc=new DOMParser().parseFromString(svgText,'image/svg+xml');
    if(doc.querySelector('parsererror')||doc.documentElement.localName!=='svg')throw Error('Not a valid SVG file.');
    // Load as an image rather than executing potentially untrusted markup in the document.
    const url=URL.createObjectURL(new Blob([svgText],{type:'image/svg+xml;charset=utf-8'}));
    try{
      const size=await new Promise((resolve,reject)=>{
        const test=new Image();
        test.onload=()=>resolve({width:test.naturalWidth,height:test.naturalHeight});
        test.onerror=()=>reject(Error('Could not render SVG.'));
        test.src=url;
      });
      if(!size.width||!size.height)throw Error('SVG has no usable dimensions.');
      const old=s.url;s.url=url;s.width=size.width;s.height=size.height;s.loaded=true;
      resetPointers();preview.src=url;preview.width=size.width;preview.height=size.height;
      preview.style.width=size.width+'px';preview.style.height=size.height+'px';
      $('openFile').title='Open SVG (current: '+name+')';
      empty.hidden=true;artwork.hidden=false;
      $('zoomOut').disabled=false;$('zoomIn').disabled=false;zoomLabel.disabled=false;
      stage.classList.add('has-artwork');fit();if(old)URL.revokeObjectURL(old);
    }catch(error){URL.revokeObjectURL(url);throw error;}
  }
  async function loadFile(file){
    if(!file)return;
    try{await loadSvg(await file.text(),file.name||'Untitled.svg');}
    catch(error){notify(error.message||'Unable to open SVG');}
  }
  fileInput.addEventListener('change',async()=>{const f=fileInput.files?.[0];fileInput.value='';await loadFile(f);});
  // Desktop Chromium file associations: installed PWAs can receive .svg files.
  if('launchQueue' in window && typeof LaunchParams!=='undefined' && 'files' in LaunchParams.prototype){
    window.launchQueue.setConsumer(async launch=>{
      if(!launch.files?.length)return;
      try{await loadFile(await launch.files[0].getFile());}
      catch(error){notify(error.message||'Unable to open file');}
    });
  }
  // Android Share -> SVG Viewer; temporarily handed off on-device via Cache Storage.
  async function receiveSharedSvg(){
    if(!new URLSearchParams(location.search).has('shared'))return;
    try{
      const inbox=await caches.open('ta-svg-viewer-261012-inbox-v1');
      const key=new URL('./__shared_svg__',location.href);
      const response=await inbox.match(key);
      if(!response)throw Error('No SVG received. Use Open instead.');
      await inbox.delete(key);
      let name='Shared.svg';
      try{name=decodeURIComponent(response.headers.get('X-SVG-Filename')||name);}catch{}
      await loadSvg(await response.text(),name);
    }catch(error){notify(error.message||'Unable to open shared SVG');}
    finally{history.replaceState(null,'',location.pathname);}
  }
  receiveSharedSvg();
  async function loadSample(){
    try{const r=await fetch('./sample.svg');if(!r.ok)throw Error('Sample unavailable');
    await loadSvg(await r.text(),'Sample.svg');}catch(e){notify(e.message||'Sample unavailable');}
  }
  $('openFile').addEventListener('click',openPicker);
  $('sampleButton').addEventListener('click',loadSample);
  $('zoomIn').addEventListener('click',()=>zoomAt(1.3));
  $('zoomOut').addEventListener('click',()=>zoomAt(1/1.3));
  $('zoomLabel').addEventListener('click',fit);
  $('fitButton').addEventListener('click',fit);
  themeButton.addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
  window.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='o'){e.preventDefault();openPicker();return;}
    if(e.altKey||e.ctrlKey||e.metaKey||!s.loaded)return;
    if(e.key==='+'||e.key==='='){e.preventDefault();zoomAt(1.3);}
    if(e.key==='-'){e.preventDefault();zoomAt(1/1.3);}
    if(e.key.toLowerCase()==='f'||e.key==='0'){e.preventDefault();fit();}
  });
  window.addEventListener('dragover',e=>e.preventDefault());
  window.addEventListener('drop',e=>{e.preventDefault();loadFile(e.dataTransfer?.files?.[0]);});
  let last={w:stage.clientWidth,h:stage.clientHeight};
  new ResizeObserver(()=>{
    if(!s.loaded)return;
    const w=stage.clientWidth,h=stage.clientHeight;if(w===last.w&&h===last.h)return;
    const previousFit=Math.abs(s.scale/s.fitScale-1)<.002;
    const relative=s.scale/s.fitScale;
    const imageX=(last.w/2-s.x)/s.scale,imageY=(last.h/2-s.y)/s.scale;
    last={w,h};fit();
    if(!previousFit){s.scale=clamp(s.fitScale*relative);s.x=w/2-imageX*s.scale;s.y=h/2-imageY*s.scale;render();}
  }).observe(stage);
  if('serviceWorker'in navigator)window.addEventListener('load',()=>{
    navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{});
  });
})();
