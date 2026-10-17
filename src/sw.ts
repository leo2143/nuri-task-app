/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

// Runtime caching: API calls con NetworkFirst
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: "api-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24,
      }),
    ],
  }),
);

// Runtime caching: Cloudinary images con CacheFirst
registerRoute(
  ({ url }) => url.hostname === "res.cloudinary.com",
  new CacheFirst({
    cacheName: "cloudinary-images",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  }),
);

// Push notification handler
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json() as {
    title: string;
    body: string;
    icon?: string;
    url?: string;
  };

  const iconPath = data.icon || "/favicon/android-chrome-192x192.png";
  const options: NotificationOptions = {
    body: data.body,
    icon: new URL(iconPath, self.location.origin).href,
    badge: "/favicon/favicon-32x32.png",
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const path = (event.notification.data?.url as string) || "/";
  const targetUrl = new URL(path, self.location.origin).href;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        const sameOriginClients = clientList.filter((client) =>
          client.url.startsWith(self.location.origin),
        );
        const matchingClient =
          sameOriginClients.find((client) => client.focused) ??
          sameOriginClients.find((client) => client.visibilityState === "visible") ??
          sameOriginClients[0];

        if (!matchingClient) {
          return self.clients.openWindow(targetUrl);
        }

        return matchingClient
          .focus()
          .then((focusedClient) => {
            if (focusedClient && "navigate" in focusedClient) {
              return focusedClient.navigate(targetUrl);
            }
            return focusedClient;
          })
          .catch(() => self.clients.openWindow(targetUrl));
      }),
  );
});
