// Hors ligne : on sert le réseau en priorité, le cache en secours.
const CACHE = 'grimoire-v2';
const FICHIERS = ['./', 'index.html', 'css/style.css?v=2', 'js/sophismes.js?v=2', 'js/exercices.js?v=2', 'js/app.js?v=2', 'icon.svg', 'manifest.webmanifest'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const copie = r.clone(); if (r.ok && new URL(e.request.url).origin === location.origin) caches.open(CACHE).then(c => c.put(e.request, copie)); return r; }).catch(() => caches.match(e.request)));
});
