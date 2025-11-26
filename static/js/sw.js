/**
 * Service Worker for Weather App
 * Implements network-first strategy with offline fallback and runtime caching
 */

const CACHE_VERSION = 'v1';
const STATIC_CACHE_NAME = `weather-app-static-${CACHE_VERSION}`;
const RUNTIME_CACHE_NAME = `weather-app-runtime-${CACHE_VERSION}`;
const OFFLINE_PAGE = '/static/_offline.html';

// Static assets to precache
const STATIC_ASSETS = [
    '/',
    '/static/css/styles.css',
    '/static/js/main.js',
    '/static/manifest.json',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// Runtime cache configuration
const RUNTIME_CACHE_CONFIG = {
    maxEntries: 50,
    maxAgeSeconds: 300 // 5 minutes TTL
};

/**
 * Install event - precache static assets
 */
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Precaching static assets');
                // Use addAll for critical assets, but don't fail if some fail
                return cache.addAll(STATIC_ASSETS).catch(err => {
                    console.warn('[Service Worker] Failed to precache some assets:', err);
                });
            })
            .then(() => self.skipWaiting())
    );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE_NAME && cacheName !== RUNTIME_CACHE_NAME) {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

/**
 * Fetch event - network-first strategy with cache fallback
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle API requests with network-first strategy
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirstStrategy(request));
        return;
    }
    
    // Handle navigation requests
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .catch(() => caches.match(OFFLINE_PAGE) || caches.match('/'))
        );
        return;
    }
    
    // Handle static assets with cache-first strategy
    event.respondWith(cacheFirstStrategy(request));
});

/**
 * Network-first strategy for API calls
 * Try network first, fall back to cache if offline, with runtime caching
 */
async function networkFirstStrategy(request) {
    const cache = await caches.open(RUNTIME_CACHE_NAME);
    
    try {
        // Try to fetch from network
        const networkResponse = await fetch(request);
        
        // Only cache successful responses
        if (networkResponse && networkResponse.status === 200) {
            // Clone the response before caching (response can only be used once)
            cache.put(request, networkResponse.clone());
            
            // Clean up old entries in runtime cache
            await cleanupRuntimeCache();
        }
        
        return networkResponse;
    } catch (error) {
        // Network failed, try cache
        console.log('[Service Worker] Network request failed, trying cache:', request.url);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return error response if no cache available
        return new Response(JSON.stringify({ 
            error: 'Network unavailable and no cached data found. Please check your connection.' 
        }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

/**
 * Cache-first strategy for static assets
 * Check cache first, fall back to network
 */
async function cacheFirstStrategy(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        // Cache the new resource
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(STATIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('[Service Worker] Fetch failed:', error);
        // Return a fallback response for images
        if (request.destination === 'image') {
            return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="#e2e8f0" width="80" height="80"/></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
            );
        }
    }
}

/**
 * Clean up runtime cache to maintain max entries
 */
async function cleanupRuntimeCache() {
    const cache = await caches.open(RUNTIME_CACHE_NAME);
    const requests = await cache.keys();
    
    if (requests.length > RUNTIME_CACHE_CONFIG.maxEntries) {
        // Delete oldest entries
        const deleteCount = requests.length - RUNTIME_CACHE_CONFIG.maxEntries;
        for (let i = 0; i < deleteCount; i++) {
            await cache.delete(requests[i]);
        }
    }
}

/**
 * Handle messages from clients
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }
});

console.log('[Service Worker] Loaded');
