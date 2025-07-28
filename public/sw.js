const CACHE_NAME = 'wietforum-v1';
const STATIC_CACHE = 'wietforum-static-v1';
const DYNAMIC_CACHE = 'wietforum-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  '/src/assets/wietforum-logo.png',
  '/src/assets/wietforum-logo-dark.png',
  '/src/assets/wietforum-logo-green.png'
];

const CACHE_STRATEGIES = {
  images: 'cache-first',
  api: 'network-first',
  static: 'cache-first'
};

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests
  if (url.origin !== self.location.origin && !url.origin.includes('supabase')) {
    return;
  }

  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);
  
  // API requests - network first with cache fallback
  if (url.pathname.includes('/rest/v1/') || url.pathname.includes('/auth/v1/')) {
    return networkFirst(request, DYNAMIC_CACHE);
  }
  
  // Images - cache first
  if (request.destination === 'image') {
    return cacheFirst(request, DYNAMIC_CACHE);
  }
  
  // Static assets - cache first
  if (STATIC_ASSETS.some(asset => url.pathname.endsWith(asset))) {
    return cacheFirst(request, STATIC_CACHE);
  }
  
  // HTML pages - network first with cache fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    return networkFirst(request, DYNAMIC_CACHE);
  }
  
  // Default: network first
  return networkFirst(request, DYNAMIC_CACHE);
}

async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
  }
  return networkResponse;
}

async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/offline.html') || new Response('Offline', { status: 503 });
    }
    
    throw error;
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-posts') {
    event.waitUntil(syncPendingPosts());
  }
  
  if (event.tag === 'background-sync-votes') {
    event.waitUntil(syncPendingVotes());
  }
});

async function syncPendingPosts() {
  // Get pending posts from IndexedDB and sync them
  console.log('Syncing pending posts...');
  // Implementation would read from IndexedDB and POST to API
}

async function syncPendingVotes() {
  // Get pending votes from IndexedDB and sync them
  console.log('Syncing pending votes...');
  // Implementation would read from IndexedDB and POST to API
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  let notificationData = { title: 'WietForum', body: 'Nieuwe activiteit' };
  
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }
  
  const options = {
    body: notificationData.body,
    icon: '/src/assets/wietforum-logo.png',
    badge: '/src/assets/wietforum-logo.png',
    vibrate: [200, 100, 200],
    data: notificationData.data || {},
    actions: [
      {
        action: 'view',
        title: 'Bekijken',
        icon: '/src/assets/wietforum-logo.png'
      },
      {
        action: 'dismiss',
        title: 'Sluiten'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            if (urlToOpen !== '/') {
              client.navigate(urlToOpen);
            }
            return;
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});