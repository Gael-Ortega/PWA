const CACHE_NAME = 'rostin-adventure-cache-v2'; // O v3, v4, etc.
// Lista de todos los archivos necesarios para que la PWA funcione offline
// Asegúrate de que las rutas de las imágenes sean correctas (ej. /Imagenes/...)
const urlsToCache = [
  '/', 
  'index.html',
  'pwa.css',
  'comprar.html', // Asumiendo que esta es la ruta de tu página de descarga
  'manifest.json',
  '/service-worker.js',
  // Rutas a tus imágenes del juego. Estas rutas deben coincidir con las usadas en index.html
  'Imagenes/Rostin-idle-page.png',
  'Imagenes/Elorien.png',
  'Imagenes/Malakar.png',
  'Imagenes/Tree jungle.png',
  'Imagenes/Copito.png',
  'Imagenes/Boss.png',
  'Imagenes/Movement.png',
  'hero.jpg', // Asumiendo que tienes una imagen hero.jpg para el fondo principal
  // Iconos del manifiesto
  'icons/icon-72x72.png',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png'
];

// 1. Evento 'install': Se ejecuta la primera vez que se carga el Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto, precacheando assets.');
        // Intenta precachear todos los archivos. Si alguno falla, el Service Worker no se instalará.
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Fallo el precacheo:', error);
      })
  );
  self.skipWaiting(); // Fuerza la activación inmediata del nuevo Service Worker
});

// 2. Evento 'fetch': Intercepta las peticiones de red para servir desde el caché
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si el archivo está en caché, lo devuelve
        if (response) {
          return response;
        }
        // Si no está en caché, hace la petición de red
        return fetch(event.request);
      })
  );
});

// 3. Evento 'activate': Elimina cachés viejos (para manejar actualizaciones)
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Si el nombre del caché no está en la lista blanca, lo borra
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
