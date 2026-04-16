const CACHE_NAME = "myfilms-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/offline",
];

// Install: cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first with offline fallback
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip API routes, auth routes, and cross-origin requests
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/") ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful page responses
        if (response.status === 200) {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // Return offline page for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match("/offline").then((offlinePage) => {
              if (offlinePage) return offlinePage;
              // Fallback if offline page isn't cached yet
              return new Response(
                '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offline</title><style>body{background:#000;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center}</style></head><body><div><h1>You\'re offline</h1><p>Check your connection and try again.</p><button onclick="location.reload()">Retry</button></div></body></html>',
                { status: 503, headers: { "Content-Type": "text/html" } }
              );
            });
          }
          return new Response("", { status: 408 });
        })
      )
  );
});
