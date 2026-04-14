// Service Worker for Gokullive Official PWA
const CACHE_NAME = 'gokullive-v1.0.0';
const urlsToCache = [
  '/artist/',
  '/artist/index.html',
  '/artist/news.html',
  '/artist/gallery.html',
  '/artist/login.html',
  '/artist/grid-gallery/drive-gallery-viewer.html',
  '/artist/css/bootstrap.min.css',
  '/artist/css/style.css',
  '/artist/css/all.min.css',
  '/artist/css/inter.css',
  '/artist/css/outfit.css',
  '/artist/js/bootstrap.bundle.min.js',
  '/artist/js/script.js',
  '/artist/images/gokullive.svg',
  '/artist/images/favicon.svg',
  '/artist/images/hero-slider/01.jpg',
  '/artist/images/hero-slider/02.jpg',
  '/artist/images/hero-slider/03.png',
  '/artist/images/hero-slider/04.jpg',
  '/artist/images/hero-slider/05.jpg'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Cache add failed:', err))
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Strategy: Cache First, then Network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        // Make network request
        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          // Cache the fetched response
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(() => {
        // Fallback for offline
        if (event.request.url.includes('/images/')) {
          return caches.match('/artist/images/gokullive.svg');
        }
        return new Response('Offline - Please check your internet connection');
      })
  );
});

// Handle push notifications (optional)
self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: '/artist/images/icon-192x192.png',
    badge: '/artist/images/favicon.svg',
    vibrate: [200, 100, 200],
    data: {
      url: '/artist/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Gokullive Official', options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/artist/')
  );
});