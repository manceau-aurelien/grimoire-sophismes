// Hors ligne : on sert le réseau en priorité, le cache en secours.
const CACHE = 'grimoire-v4';
const FICHIERS = ['./', 'index.html', 'css/style.css?v=4', 'js/sophismes.js?v=3', 'js/exercices.js?v=3', 'js/debats-2.js?v=3', 'js/phrases-depart.js?v=3', 'js/phrases-suit.js?v=3', 'js/phrases-preuves.js?v=3', 'js/phrases-ailleurs.js?v=3', 'js/phrases-echange.js?v=3', 'js/phrases-pistes.js?v=3', 'js/phrases-grimoire-fautives.js?v=3', 'js/phrases-grimoire-correctes.js?v=3', 'js/app.js?v=4', 'js/installation.js?v=1', 'icon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', 'manifest.webmanifest?v=2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const copie = r.clone(); if (r.ok && new URL(e.request.url).origin === location.origin) caches.open(CACHE).then(c => c.put(e.request, copie)); return r; }).catch(() => caches.match(e.request)));
});
