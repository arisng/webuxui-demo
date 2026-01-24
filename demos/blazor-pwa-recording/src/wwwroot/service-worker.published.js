// Caution! Be sure you understand the caveats before publishing an application with
// offline support. See https://aka.ms/blazor-offline-considerations

self.importScripts('./service-worker-assets.js');
try {
    self.importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');
} catch (error) {
    self.importScripts('./lib/workbox/workbox-sw.js');
}
if (!self.workbox) {
    try {
        self.importScripts('./lib/workbox/workbox-sw.js');
    } catch (error) {
    }
}

if (!self.workbox) {
    console.warn('Workbox failed to load. Offline support will be limited.');
} else {
    const cachePrefix = 'offline-cache';
    const offlineAssetsInclude = [ /\.dll$/, /\.pdb$/, /\.wasm/, /\.html/, /\.js$/, /\.json$/, /\.css$/, /\.woff$/, /\.png$/, /\.jpe?g$/, /\.gif$/, /\.ico$/, /\.blat$/, /\.dat$/, /\.webmanifest$/ ];
    const offlineAssetsExclude = [ /^service-worker\.js$/ ];

    workbox.setConfig({ debug: false });
    workbox.core.setCacheNameDetails({
        prefix: cachePrefix,
        suffix: self.assetsManifest.version
    });
    workbox.core.clientsClaim();

    const precacheList = self.assetsManifest.assets
        .filter(asset => offlineAssetsInclude.some(pattern => pattern.test(asset.url)))
        .filter(asset => !offlineAssetsExclude.some(pattern => pattern.test(asset.url)))
        .map(asset => ({
            url: asset.url,
            revision: asset.hash
        }));

    workbox.precaching.precacheAndRoute(precacheList);

    workbox.routing.registerRoute(
        ({ request }) => request.mode === 'navigate',
        new workbox.strategies.NetworkFirst({
            cacheName: `${cachePrefix}-pages-${self.assetsManifest.version}`
        })
    );

    workbox.routing.setCatchHandler(async ({ event }) => {
        if (event.request.mode === 'navigate') {
            return workbox.precaching.matchPrecache('index.html');
        }
        return Response.error();
    });

    self.addEventListener('install', (event) => {
        if (!self.assetsManifest || !self.assetsManifest.version) {
            return;
        }
        event.waitUntil(notifyClients({ type: 'sw-update-available', version: self.assetsManifest.version }));
    });

    self.addEventListener('activate', (event) => {
        event.waitUntil(notifyClientsIfReady());
    });
}

self.addEventListener('message', (event) => {
    const data = event.data || {};
    if (data.type === 'SKIP_WAITING') {
        event.waitUntil(self.skipWaiting());
    }
});

async function notifyClientsIfReady() {
    try {
        const appShell = await workbox.precaching.matchPrecache('index.html');
        if (!appShell) {
            return;
        }
        await notifyClients({ type: 'offline-ready', version: self.assetsManifest.version });
    } catch (error) {
        // If precache lookup fails, skip signaling readiness.
    }
}

async function notifyClients(message) {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clients) {
        client.postMessage(message);
    }
}

// dummy changes to simulate version bump for testing