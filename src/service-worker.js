self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Segera kontrol semua client setelah service worker baru diaktifkan
self.addEventListener('activate', (event) => {
    event.waitUntil(
        clients.claim().then(() => {
            console.log('Service worker aktif dan mengontrol semua client.');
        })
    );
});

// Tambahkan cache baru sesuai dengan file build Anda dengan timestamp
const CACHE_NAME = `app-cache-v${Date.now()}`;
const STATIC_CACHE = 'static-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/static/js/bundle.js',
    '/static/js/main.chunk.js',
    '/static/js/0.chunk.js',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Cache terbuka: ', CACHE_NAME);
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Hapus semua cache lama kecuali yang sedang digunakan
                    if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
                        console.log('Menghapus cache lama: ', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Segera kontrol semua client
            return clients.claim();
        })
    );
});

// Fetch handler dengan network-first strategy untuk HTML dan API calls
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Network-first untuk HTML files dan API calls
    if (request.destination === 'document' || 
        url.pathname.endsWith('.html') || 
        url.pathname.includes('/api/') ||
        url.pathname.includes('version.json')) {
        
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Jika berhasil dari network, update cache
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Jika network gagal, coba dari cache
                    return caches.match(request);
                })
        );
    } else {
        // Cache-first untuk static assets (CSS, JS, images)
        event.respondWith(
            caches.match(request).then((response) => {
                if (response) {
                    return response;
                }
                return fetch(request).then((response) => {
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(STATIC_CACHE).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                });
            })
        );
    }
});
