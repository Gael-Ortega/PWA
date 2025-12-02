const CACHE_NAME = 'rostin-adventure-cache-v6';
const urlsToCache = [
  './',
  'index.html',
  'comprar.html',
  'pwa.css',
  'manifest.json',
  'service-worker.js',
  'Imagenes/Rostin-idle-page.png',
  'Imagenes/Elorien.png',
  'Imagenes/Malakar.png',
  'Imagenes/Copito.png',
  'Imagenes/Boss.png',
  'Imagenes/Movement.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache abierto, precacheando assets.');
      return Promise.allSettled(
        urlsToCache.map(url => cache.add(url))
      ).then(results => {
        results.forEach((result, idx) => {
          if (result.status === 'rejected') {
            console.warn(`No se pudo cachear: ${urlsToCache[idx]}`);
          }
        });
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si está en cache, lo devuelve
      if (response) return response;

      // Si no está, intenta hacer fetch
      return fetch(event.request)
        .catch(() => {
          // Aquí puedes devolver un offline.html si lo agregas
          // return caches.match('offline.html');
          console.warn(`Fallo fetch de: ${event.request.url}`);
        });
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
