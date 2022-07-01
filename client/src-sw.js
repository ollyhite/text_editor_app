const { warmStrategyCache } = require('workbox-recipes');
const { CacheFirst,StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);


const matchCallback = ({ request }) => {
    console.log(request);
    return (
        // CSS
        request.destination === 'style' ||
        // JavaScript
        request.destination === 'script'
    );
};

registerRoute(
    matchCallback,
    new StaleWhileRevalidate({
        cacheName:"asscess-cache",
        plugins: [
        new CacheableResponsePlugin({
            statuses: [0, 200],
        }),
        ],
    })
);
// TODO: Implement asset caching
// registerRoute(()=>{

// });