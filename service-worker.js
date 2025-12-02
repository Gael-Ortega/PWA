    const CACHE_NAME = 'rostin-adventure-cache-v4';

const urlsToCache = [
  'index.html',
  'pwa.css',
  'comprar.html',
  'manifest.json',
  'Imagenes/Rostin-idle-page.png',
  'Imagenes/Elorien.png',
  'Imagenes/Malakar.png',
  'Imagenes/Tree%20jungle.png', // ← espacio codificado
  'Imagenes/Copito.png',
  'Imagenes/Boss.png',
  'Imagenes/Movement.png',
  'hero.jpg'
];

// INSTALACIÓN DEL SERVICE WORKER
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto, precacheando assets.');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Fallo el precacheo:', error);
      })
  );
  self.skipWaiting();
});

// FETCH: responder desde cache o red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

// ACTIVATE: borrar caches viejos
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
