require('./load-env')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const withOffline = require('next-offline')

const compose = (...fns) =>
  fns.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args)),
    (arg) => arg
  )

// https://github.com/hanford/next-offline#now-20
const nextConfig = {
  // https://nextjs.org/docs/api-reference/next.config.js/environment-variables
  env: {
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_PUBLIC_API_KEY: process.env.FIREBASE_PUBLIC_API_KEY,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
  },
  transformManifest: (manifest) => ['/'].concat(manifest), // add the homepage to the cache
  generateInDevMode: false,
  // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.GenerateSW#GenerateSW
  workboxOpts: {
    swDest: 'static/service-worker.js',
    // NOTE: Nextjs dynamic routing breaks the service worker caching
    // https://github.com/hanford/next-offline/issues/209
    // We are using static slugs and passing id as a parameter instead.
    // TODO: rewrite to dynamic routing once the issue is fixed
    ignoreURLParametersMatching: [/.*/],
    runtimeCaching: [
      {
        // MUST be the same as "start_url" in manifest.json
        urlPattern: '/',
        handler: 'StaleWhileRevalidate',
        options: {
          // don't change cache name
          cacheName: 'start-url',
          expiration: {
            maxEntries: 1,
            maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
          },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
          },
        },
      },
      {
        urlPattern: /^https:\/firebaselogging-pa\.googleapis\.com\/.*/i,
        handler: 'CacheFirst', // exchange rate
        options: {
          cacheName: 'google-fonts',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
          },
        },
      },
      {
        urlPattern: /^https:\/firebaselogging-pa\.googleapis\.com\/.*/i,
        handler: 'NetworkOnly', // firebase can work offline
      },
      {
        urlPattern: /^https:\/firestore\.googleapis\.com\/.*/i,
        handler: 'NetworkOnly', // firebase can work offline
      },
      {
        urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-font-assets',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
          },
        },
      },
      {
        urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-image-assets',
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 90 * 24 * 60 * 60, // 90 days
          },
        },
      },
      {
        urlPattern: /\.(?:js)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-js-assets',
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 90 * 24 * 60 * 60, // 90 days
          },
        },
      },
      {
        urlPattern: /\.(?:css|less)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-style-assets',
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 90 * 24 * 60 * 60, // 90 days
          },
        },
      },
      {
        // exchange rates are valid for a single day
        urlPattern: /\/api\.exchangeratesapi\.io\/.*$/i,
        handler: 'CacheFirst',
        method: 'GET',
        options: {
          cacheName: 'exchange-rates',
          expiration: {
            maxEntries: 1,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
        },
      },
      {
        urlPattern: /\/api\/.*$/i,
        handler: 'NetworkFirst',
        method: 'GET',
        options: {
          cacheName: 'apis',
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 90 * 24 * 60 * 60, // 90 days
          },
          networkTimeoutSeconds: 10, // fall back to cache if api does not response within 10 seconds
        },
      },
      {
        urlPattern: /.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'others',
          expiration: {
            maxEntries: 256,
            maxAgeSeconds: 90 * 24 * 60 * 60, // 90 days
          },
          networkTimeoutSeconds: 10,
        },
      },
    ],
  },
}

module.exports = compose(withBundleAnalyzer, withOffline)(nextConfig)
