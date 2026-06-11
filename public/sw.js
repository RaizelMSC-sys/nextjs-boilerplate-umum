self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Paksa bypass untuk Clerk agar tidak terganggu oleh lifecycle PWA
  if (event.request.url.includes('clerk')) {
    return;
  }
  
  // Pass-through fetch to satisfy PWA requirements
  event.respondWith(fetch(event.request));
});