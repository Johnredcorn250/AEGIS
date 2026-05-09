const CACHE_NAME = 'aegis-cache-v2'; // Incremented version

const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon.svg'
];

// Install: Cache everything
self.addEventListener('install', event => {
  self.skipWaiting(); // Force the new service worker to take over immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Fetch: Network-First Strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If network works, update the cache and return
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        return response;
      })
      .catch(() => caches.match(event.request)) // If network fails, use cache
  );
});
