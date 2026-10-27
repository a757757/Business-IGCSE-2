
const CACHE_NAME = "business-igcse-pwa-v1";

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

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();

            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, copy);
            });
          }

          return response;
        })
        .catch(() => {
          if (request.mode === "navigate") {
            return caches.match("/index.html");
          }

          throw new Error("Offline and resource not cached");
        });
    })
  );
});
