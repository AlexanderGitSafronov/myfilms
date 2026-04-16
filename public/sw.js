const STATIC_CACHE  = "myfilms-static-v4";   // JS/CSS chunks — cache-first
const PAGES_CACHE   = "myfilms-pages-v4";    // HTML pages  — stale-while-revalidate
const IMAGES_CACHE  = "myfilms-images-v4";   // Images      — cache-first (30 days)
const OFFLINE_URL   = "/offline";

// ── Install ──────────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PAGES_CACHE).then((cache) =>
      cache.addAll(["/", OFFLINE_URL, "/manifest.json"])
    )
  );
  self.skipWaiting();
});

// ── Activate — clean old caches ──────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  const CURRENT = [STATIC_CACHE, PAGES_CACHE, IMAGES_CACHE];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !CURRENT.includes(k)).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip cross-origin and API routes (always fresh)
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  // ── Next.js static chunks (JS/CSS with content hash) → cache-first ─────────
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        const response = await fetch(event.request);
        if (response.ok) cache.put(event.request, response.clone());
        return response;
      })
    );
    return;
  }

  // ── Images → cache-first (30 days) ─────────────────────────────────────────
  if (
    url.pathname.startsWith("/_next/image") ||
    /\.(png|jpg|jpeg|webp|avif|svg|ico|gif)$/.test(url.pathname)
  ) {
    event.respondWith(
      caches.open(IMAGES_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        const response = await fetch(event.request);
        if (response.ok) {
          const headers = new Headers(response.headers);
          headers.set("Cache-Control", "public, max-age=2592000");
          const cloned = new Response(await response.clone().arrayBuffer(), { status: response.status, headers });
          cache.put(event.request, cloned);
        }
        return response;
      })
    );
    return;
  }

  // ── HTML pages → stale-while-revalidate (instant + background refresh) ──────
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.open(PAGES_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);

        const fetchPromise = fetch(event.request)
          .then((response) => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => null);

        // Return cached immediately, fetch in background
        if (cached) {
          fetchPromise.catch(() => {}); // background revalidate
          return cached;
        }

        // No cache — wait for network
        const response = await fetchPromise;
        if (response) return response;

        // Offline fallback
        return cache.match(OFFLINE_URL).then(
          (offline) => offline || new Response("Offline", { status: 503 })
        );
      })
    );
    return;
  }
});
