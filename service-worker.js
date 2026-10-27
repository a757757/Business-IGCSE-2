
const CACHE_NAME = "business-igcse-pwa-v2";

const CORE_FILES = [
  "/",
  "/index.html",
  "/styles.css",
  "/config.js",
  "/app.js",
  "/tutor.js",
  "/practice.js",
  "/content/content-1.js",
  "/content/content-2.js",
  "/content/content-3.js",
  "/content/content-4.js",
  "/content/content-5.js",
  "/content/content-6.js",
  "/content/content-7.js",
  "/content/content-8.js",
  "/content/content-9.js",
  "/content/content-10.js",
  "/content/content-11.js",
  "/content/content-12.js",
  "/manifest.webmanifest",
  "/icon.svg",
  "/pwa-register.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (
    request.method !== "GET" ||
    new URL(request.url).origin !== self.location.origin
  ) {
    return;
  }

  // Check the network first so updated files are preferred.
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response && response.ok) {
          const copy = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, copy);
          });
        }

        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);

        if (cached) return cached;

        if (request.mode === "navigate") {
          const page = await caches.match("/index.html");
          if (page) return page;
        }

        return new Response("You are offline and this resource is not cached.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      })
  );
});
