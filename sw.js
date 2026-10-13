/* Offline app shell and on-device SVG share handoff. */
const CACHE='ta-svg-viewer-261012-shell-v2';
const INBOX='ta-svg-viewer-261012-inbox-v1';
const ASSETS=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./sample.svg','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>(k==='ta-svg-viewer-v1'||k.startsWith('ta-svg-viewer-261012-shell-'))&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()]));});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url),scope=new URL(self.registration.scope);
  if(e.request.method==='POST'&&url.origin===scope.origin&&url.pathname===scope.pathname&&url.searchParams.has('share-target')){
    e.respondWith((async()=>{
      let ok=false;
      try{
        const form=await e.request.formData(),file=form.get('svg');
        if(file&&typeof file.arrayBuffer==='function'&&(/\.svg$/i.test(file.name||'')||file.type==='image/svg+xml')){
          const inbox=await caches.open(INBOX);
          await inbox.put(new URL('./__shared_svg__',self.registration.scope),new Response(file,{headers:{'Content-Type':'image/svg+xml','X-SVG-Filename':encodeURIComponent(file.name||'Shared.svg')}}));
          ok=true;
        }
      }catch(err){console.warn('SVG share failed',err);}
      return Response.redirect(new URL(ok?'./?shared=1':'./?shared=missing',self.registration.scope),303);
    })());
    return;
  }
  if(e.request.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
  e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)));
});
