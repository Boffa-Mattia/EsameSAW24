const cacheName = 'v1'
const cacheFile = [
    '/',
    './index.html',
    './index.css',
    './SW.js',
    './img/arrow.gif',
    './img/GoogleLogoPng.png',
    './img/loading.gif',
    './img/panic.png',
    './img/arrow2.gif',
    './img/arrowDir.gif',
    './img/arrowR.gif',
    './img/astronaut.jpg',
    './img/book.jpg',
    './img/gaming.jpg',
    './img/gamer.jpg',
    './manifest.json'
]

const cssImg = {
    'http://localhost:6400/static/media/book.02f973dc0b748b9eabf7.jpg':'./img/book.jpg',
    'http://localhost:6400/static/media/gaming.f67bf9a5f13203585bc0.jpg':'./img/gaming.jpg',
    'http://localhost:6400/static/media/gamer.34216c17c0122872c18f.jpg':'./img/gamer.jpg'
}

self.addEventListener("install", (e)=>{
    console.log(" [ServiceWorker] installed")

    e.waitUntil(
        caches.open(cacheName).then((e)=>{
            console.log("Caching cacheFile")
            return e.addAll(cacheFile)
        })
    )
})

self.addEventListener("activate", ()=>{
    console.log(" [ServiceWorke] activated")
})

self.addEventListener('fetch', (e) => {
    if (e.request.url in cssImg) e.respondWith(
            caches.match(cssImg[e.request.url]).then((data) => {return data}).catch(()=> {return new Response('Opening cache failed', { status: 500 })})
        )
    
    else e.respondWith(
        caches.match(e.request).then((response) => {
            let requestClone = e.request.clone();
            
            if (response) return response
            
            else if(e.request.method === 'POST' || e.request.method === 'PUT' || e.request.url.includes('google')) return onlyFetch(requestClone)
                
            else return fatchAndCache(e,e.request)
            })
        );
    });
    
function fatchAndCache(e, requestClone){
    return caches.open(cacheName).then((cacheOpened) => {
        return fetch(requestClone).then((respons) => {
            if (respons) {
                cacheOpened.put(e.request, respons.clone());
            }
            return respons;
        }).catch(() => {
            return new Response('Resource not found', {status: 404})
        });
    }).catch(() => {
        return new Response('Opening cache failed', { status: 500 });
    });
}

function onlyFetch(requestClone){
    return fetch(requestClone).then((respons) => {
        return respons;
    }).catch(() => {
        return new Response(requestClone,{ status: 500 })
    });
}