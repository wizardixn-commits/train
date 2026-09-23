const CACHE_NAME = 'trainbrain-v8';
const ASSETS = [
    './',
    './index.html',
    './css/style.css',
    './css/fa/all.local.css',
    './css/fa/webfonts/fa-solid-900.woff2',
    './css/fa/webfonts/fa-regular-400.woff2',
    './css/fa/webfonts/fa-brands-400.woff2',
    './manifest.json',
    './images/icon-192.png',
    './images/icon-512.png',
    './js/app.js',
    './js/auth.js',
    './js/dashboard.js',
    './js/matrix.js',
    './js/flasks.js',
    './js/numbers.js',
    './js/reaction.js',
    './js/math.js',
    './js/multiply.js',
    './js/schulte.js',
    './js/pairs.js',
    './js/stroop.js',
    './js/simon.js',
    './js/body.js',
    './js/soul.js',
    './js/soul_games.js',
    './js/domino.js',
    './js/emoji.js',
    './js/solfeggio.js',
    './js/catch_circle.js',
    './js/puzzle3d.js'
];

// On install: cache all app shell files
self.addEventListener('install', e => {
    self.skipWaiting(); // activate new SW immediately
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
});

// On activate: delete old caches
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// Fetch: network-first for navigation, cache-first for assets
self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        fetch(e.request)
            .then(res => {
                // Update cache with fresh copy
                const clone = res.clone();
                caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
                return res;
            })
            .catch(() => caches.match(e.request))
    );
});
