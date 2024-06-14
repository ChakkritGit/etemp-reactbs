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
  ({ request }) => {
    return request.url.includes(`${import.meta.env.VITE_APP_API}/img`)
  },
  new NetworkFirst({
    cacheName: 'images',
  })
)

registerRoute(imageRoute)

// cache fonts
const fontRoute = new Route(
  ({ request }) => {
    return request.destination === 'font'
  },
  new CacheFirst({
    cacheName: 'fonts',
  })
)

registerRoute(fontRoute)

// cache api calls with token
const fetchDeviceRoute = new Route(
  ({ request }) => {
    return request.url.includes(`${import.meta.env.VITE_APP_API}/device`)
  },

  new NetworkFirst({
    cacheName: 'api/fetchDevice',
  })
)

registerRoute(fetchDeviceRoute)

const fetchHospitalRoute = new Route(
  ({ request }) => {
    return request.url.includes(`${import.meta.env.VITE_APP_API}/hospital`)
  },

  new NetworkFirst({
    cacheName: 'api/fetchHospital',
  })
)

registerRoute(fetchHospitalRoute)

const fetchWardRoute = new Route(
  ({ request }) => {
    return request.url.includes(`${import.meta.env.VITE_APP_API}/ward`)
  },

  new NetworkFirst({
    cacheName: 'api/fetchWard',
  })
)

registerRoute(fetchWardRoute)

const fetchProbeRoute = new Route(
  ({ request }) => {
    return request.url.includes(`${import.meta.env.VITE_APP_API}/probe`)
  },

  new NetworkFirst({
    cacheName: 'api/fetchProbe',
  })
)

registerRoute(fetchProbeRoute)

const fetchUserRoute = new Route(
  ({ request }) => {
    return request.url.includes(`${import.meta.env.VITE_APP_API}/user`)
  },

  new NetworkFirst({
    cacheName: 'api/fetchUser',
  })
)

registerRoute(fetchUserRoute)

const fetchNotificationRoute = new Route(
  ({ request }) => {
    return request.url.includes(`${import.meta.env.VITE_APP_API}/notification`)
  },

  new NetworkFirst({
    cacheName: 'api/fetchNotification',
  })
)

registerRoute(fetchNotificationRoute)

const fetchWarrantyRoute = new Route(
  ({ request }) => {
    return request.url.includes(`${import.meta.env.VITE_APP_API}/warranty`)
  },

  new NetworkFirst({
    cacheName: 'api/fetchWarranty',
  })
)

registerRoute(fetchWarrantyRoute)

const fetchRepairRoute = new Route(
  ({ request }) => {
    return request.url.includes(`${import.meta.env.VITE_APP_API}/repair`)
  },

  new NetworkFirst({
    cacheName: 'api/fetchRepair',
  })
)

registerRoute(fetchRepairRoute)

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
    plugins: [bgSyncPlugin]
  }),
  "DELETE"
)

registerRoute(deleteProbeSubmit)

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})