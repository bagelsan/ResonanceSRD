// Simple offline service worker
const CACHE_NAME = 'pcm-os-v1';
const ASSETS = [
  './index.html',
  './app.js',
  './PCM-definitions.js',
  './PCM-engine.js',
  './PCM-actions-keywords.js',
  './PCM-systems.js',
  './PCM-session.js',
  './PCM-assessment.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});