const CACHE_NAME = 'rostin-adventure-cache-v4';

// SOLO archivos que existen y NO causan errores:
const urlsToCache = [
  '/', 
  'index.html',
  'comprar.html',
  'pwa.css',
  'manifest.json',
  '/service-worker.js',

  // Imágenes que realmente EXISTEN y NO tienen espacios
  'Imagenes/Rostin-idle-page.png',
  'Imagenes/Elorien.png',
  'Imagenes/Malakar.png',
  'Imagenes/Copito.png',
  'Imagenes/Boss.png',
  'Imagenes/Movement.png'

  // ⚠ Archivos que dan error, se eliminan:
  // 'Imagenes/Tree-jungle.png',
  // 'hero.jpg'
];

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

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
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
