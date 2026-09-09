const CACHE_NAME = 'abatiment-pwa-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './plantilla_cruz.png',
  'https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (event.request.mode === 'navigate' || url.pathname.endsWith('index.html') || url.search.includes('arqueta=')) {
    event.respondWith(
      caches.match('./index.html').then((cachedIndex) => {
        if (cachedIndex) return cachedIndex;
        return fetch(event.request);
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request);
    }).catch(() => {
      if (url.href.includes('script.google.com')) {
        return new Response(JSON.stringify({ elementos: [] }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    })
  );
});
