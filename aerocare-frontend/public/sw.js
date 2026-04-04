// Minimal Service Worker to cache assets for offline
const CACHE_NAME = 'aerocare-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/_next/static/chunks/main.js',
  '/_next/static/chunks/pages/sos.js',
  '/styles/globals.css',
  'https://unpkg.com/leaflet/dist/leaflet.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
    return cache.addAll(urlsToCache);
  }));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request))
  );
});