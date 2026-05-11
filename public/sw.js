// The Last Story — Service Worker
const CACHE_VERSION = 'v1';
const STATIC_CACHE  = 'tls-static-' + CACHE_VERSION;
const PAGES_CACHE   = 'tls-pages-' + CACHE_VERSION;
const ALL_CACHES    = [STATIC_CACHE, PAGES_CACHE];

const PRECACHE_ASSETS = [
  '/',
  '/share',
  '/privacy',
  '/terms',
  '/contact',
  '/site.webmanifest',
  '/favicon.ico',
  '/favicon-96x96.png',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(function(cache) {
      return Promise.allSettled(
        PRECACHE_ASSETS.map(function(url) {
          return cache.add(url).catch(function(err) {
            console.warn('[SW] Precache miss:', url, err);
          });
        })
      );
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return ALL_CACHES.indexOf(key) === -1;
        }).map(function(key) {
          console.log('[SW] Deleting old cache:', key);
          return caches.delete(key);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  var request = event.request;
  var url = new URL(request.url);

  if (request.method !== 'GET' || !url.protocol.startsWith('http')) return;

  // API routes: network-only
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(function() {
        return new Response(JSON.stringify({ error: 'You are offline' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        });
      })
    );
    return;
  }

  // Next.js static chunks: cache-first
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/_next/image')) {
    event.respondWith(
      caches.match(request).then(function(cached) {
        return cached || fetch(request).then(function(response) {
          if (response.ok) {
            var clone = response.clone();
            caches.open(STATIC_CACHE).then(function(cache) { cache.put(request, clone); });
          }
          return response;
        });
      })
    );
    return;
  }

  // Static files (images, fonts, manifest): cache-first
  if (/\.(png|jpg|jpeg|svg|ico|webp|gif|woff2?|ttf|otf|webmanifest)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(function(cached) {
        return cached || fetch(request).then(function(response) {
          if (response.ok) {
            var clone = response.clone();
            caches.open(STATIC_CACHE).then(function(cache) { cache.put(request, clone); });
          }
          return response;
        });
      })
    );
    return;
  }

  // HTML pages: stale-while-revalidate
  event.respondWith(
    caches.open(PAGES_CACHE).then(function(cache) {
      return cache.match(request).then(function(cached) {
        var networkFetch = fetch(request).then(function(response) {
          if (response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        }).catch(function() {
          if (cached) return cached;
          return caches.match('/').then(function(fallback) {
            return fallback || new Response('You are offline', {
              status: 503,
              headers: { 'Content-Type': 'text/html' },
            });
          });
        });
        return cached || networkFetch;
      });
    })
  );
});
