import { NavigationRoute, Route, registerRoute } from "workbox-routing"
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching"
import { CacheFirst, NetworkFirst, NetworkOnly } from "workbox-strategies"
import { BackgroundSyncPlugin } from "workbox-background-sync"

declare let self: ServiceWorkerGlobalScope

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)

self.skipWaiting()

// cache images
const imageRoute = new Route(
  ({ request, sameOrigin }) => {
    return sameOrigin && request.destination === 'image'
  },
  new CacheFirst({
    cacheName: 'images'
  })
)

registerRoute(imageRoute)

// cache api calls with token
const fetchDeviceRoute = new Route(
  ({ request }) => request.url === `${import.meta.env.VITE_APP_API}/device`,
  new NetworkFirst({
    cacheName: 'api/fetch-device',
    fetchOptions: {
      credentials: 'same-origin',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // ใช้ token ของคุณที่นี่
      },
    },
    plugins: [
      {
        fetchDidSucceed: async ({ request, response }) => {
          // Clone the response to ensure it's safe to use for caching.
          const clonedResponse = response.clone()
          // Check if the response was successful (status code 2xx)
          if (response.status >= 200 && response.status < 300) {
            // Open the cache and put the cloned response into it.
            const cache = await caches.open('api/fetch-device')
            await cache.put(request, clonedResponse)
          }
          // Return the original response.
          return response
        },
      },
    ],
  })
)

registerRoute(fetchDeviceRoute)

// cache navigations
const navigationRoute = new NavigationRoute(
  new NetworkFirst({
    cacheName: 'navigation',
    networkTimeoutSeconds: 3
  })
)

registerRoute(navigationRoute)

// background sync
const bgSyncPlugin = new BackgroundSyncPlugin("backgroundSyncQueue", {
  maxRetentionTime: 24 * 60
})

const adjjustDeviceSubmit = new Route(
  ({ request }) => {
    return request.url === `${import.meta.env.VITE_APP_API}/device`
  },
  new NetworkOnly({
    fetchOptions: {
      credentials: 'same-origin',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // ใช้ token ของคุณที่นี่
      },
    },
    plugins: [bgSyncPlugin]
  }),
  "PUT"
)

registerRoute(adjjustDeviceSubmit)

const addDeviceSubmit = new Route(
  ({ request }) => {
    return request.url === `${import.meta.env.VITE_APP_API}/device`
  },
  new NetworkOnly({
    fetchOptions: {
      credentials: 'same-origin',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // ใช้ token ของคุณที่นี่
      },
    },
    plugins: [bgSyncPlugin]
  }),
  "POST"
)

registerRoute(addDeviceSubmit)

const addProbeSubmit = new Route(
  ({ request }) => {
    return request.url === `${import.meta.env.VITE_APP_API}/probe`
  },
  new NetworkOnly({
    fetchOptions: {
      credentials: 'same-origin',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // ใช้ token ของคุณที่นี่
      },
    },
    plugins: [bgSyncPlugin]
  }),
  "POST"
)

registerRoute(addProbeSubmit)

const editProbeSubmit = new Route(
  ({ request }) => {
    return request.url === `${import.meta.env.VITE_APP_API}/probe`
  },
  new NetworkOnly({
    fetchOptions: {
      credentials: 'same-origin',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // ใช้ token ของคุณที่นี่
      },
    },
    plugins: [bgSyncPlugin]
  }),
  "PUT"
)

registerRoute(editProbeSubmit)

const deleteProbeSubmit = new Route(
  ({ request }) => {
    return request.url === `${import.meta.env.VITE_APP_API}/probe`
  },
  new NetworkOnly({
    fetchOptions: {
      credentials: 'same-origin',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // ใช้ token ของคุณที่นี่
      },
    },
    plugins: [bgSyncPlugin]
  }),
  "DELETE"
)

registerRoute(deleteProbeSubmit)

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('install', () => {
  self.skipWaiting()
})