# Blazor PWA Cheatsheet Reference

The Blazor PWA Cheatsheet provides a comprehensive, factual overview of key configurations, files, and settings for building Progressive Web Apps with Blazor WebAssembly. This reference describes the machinery without instruction, focusing on technical specifications and examples.

## Overview

Blazor PWAs combine Blazor WebAssembly with PWA standards (Web App Manifest, Service Worker) to enable installable, offline-capable web applications. Configurations are defined in project files, manifest JSON, and JavaScript service workers, with build-time generation of assets. In .NET 10, Blazor WebAssembly includes enhanced performance optimizations and improved PWA tooling.

## Project Configuration

### .csproj Properties

Blazor PWA projects use these MSBuild properties for enabling and configuring PWA features.

| Property                              | Type    | Default | Description                                                                                                                          |
| ------------------------------------- | ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `ServiceWorkerAssetsManifest`         | string  | (none)  | Specifies the filename for the generated service worker assets manifest (e.g., `service-worker-assets.js`). Required for PWA builds. |
| `RunAOTCompilation`                   | boolean | false   | Enables Ahead-of-Time compilation for WebAssembly, improving runtime performance at the cost of larger bundle size.                  |
| `BlazorWebAssemblyPreserveWhitespace` | boolean | false   | Preserves whitespace in Blazor components for debugging; set to true for development.                                                |
| `JavaScriptBundlingEnabled`           | boolean | false   | Enables JavaScript bundling with tools like esbuild for optimized builds.                                                            |
| `OverrideHtmlAssetPlaceholders`       | boolean | false   | Allows customization of HTML asset placeholders in index.html.                                                                       |

**Example**
```xml
<Project Sdk="Microsoft.NET.Sdk.BlazorWebAssembly">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <ServiceWorkerAssetsManifest>service-worker-assets.js</ServiceWorkerAssetsManifest>
    <RunAOTCompilation>true</RunAOTCompilation>
    <OverrideHtmlAssetPlaceholders>true</OverrideHtmlAssetPlaceholders>
  </PropertyGroup>
</Project>
```

**Notes**
- Properties are evaluated at build time; changes require rebuild.
- AOT increases download size by ~2-3x but reduces startup time.
- In .NET 10, AOT compilation is more efficient and supports additional optimizations.

### Service Worker Item Group

Defines which service worker files are included in the build.

**Example**
```xml
<ItemGroup>
  <ServiceWorker Include="wwwroot\service-worker.js" PublishedContent="wwwroot\service-worker.published.js" />
</ItemGroup>
```

**Notes**
- `Include` points to development service worker; `PublishedContent` to production version.
- Only one ServiceWorker item is supported per project.

## Web App Manifest

The `manifest.webmanifest` file defines PWA metadata in JSON format, linked via `<link rel="manifest" href="manifest.json">` in HTML.

### Required Members

| Member       | Type   | Description                                                           |
| ------------ | ------ | --------------------------------------------------------------------- |
| `name`       | string | Full application name displayed in install prompts.                   |
| `short_name` | string | Short name for app icons and launchers.                               |
| `start_url`  | string | URL to load when app starts (relative to manifest scope).             |
| `display`    | string | Display mode: "standalone", "fullscreen", "minimal-ui", or "browser". |
| `icons`      | array  | Array of icon objects with src, sizes, type, and purpose.             |

### Optional Members

| Member                        | Type    | Description                                                      |
| ----------------------------- | ------- | ---------------------------------------------------------------- |
| `lang`                        | string  | Primary language (BCP 47 format).                                |
| `scope`                       | string  | Navigation scope for the app.                                    |
| `theme_color`                 | string  | Theme color for UI elements (hex or named color).                |
| `background_color`            | string  | Background color during loading (hex or named color).            |
| `orientation`                 | string  | Preferred orientation: "portrait", "landscape", etc.             |
| `categories`                  | array   | App categories for stores (e.g., ["productivity", "utilities"]). |
| `shortcuts`                   | array   | Quick action shortcuts with name, url, and icons.                |
| `screenshots`                 | array   | Screenshots for app stores with src, sizes, type, and platform.  |
| `prefer_related_applications` | boolean | Whether to prefer native apps over PWA.                          |
| `related_applications`        | array   | Related native apps.                                             |

**Example**
```json
{
  "name": "SonicMemo",
  "short_name": "SonicMemo",
  "start_url": "./",
  "display": "standalone",
  "theme_color": "#3b82f6",
  "background_color": "#0f172a",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "Start Recording",
      "url": "./",
      "icons": [{ "src": "icon-192.png", "sizes": "192x192" }]
    }
  ]
}
```

**Notes**
- Icons must include at least 192x192 and 512x512 sizes.
- Purpose "maskable" allows OS to apply masks for adaptive icons.

## Service Worker

Service workers are JavaScript files that run in the background, enabling offline functionality, caching, and background synchronization for PWAs. They act as a proxy between the web application and the network.

### Development Service Worker (service-worker.js)

Minimal implementation for development; satisfies PWA installability without caching.

**Example**
```javascript
self.addEventListener('fetch', (event) => {
    // No-op: just having the listener is enough for PWA installability.
});
```

### Published Service Worker (service-worker.published.js)

Production version with comprehensive caching and offline capabilities. In Blazor PWAs, this typically uses libraries like Workbox for robust implementation.

**Key Components**
- **Install Event**: Downloads and caches essential assets during service worker installation.
- **Activate Event**: Cleans up old caches and takes control of the application.
- **Fetch Event**: Intercepts network requests to serve cached content or implement custom caching logic.
- **Message Event**: Handles communication between the main application and service worker.
- **Push Event**: Handles push notifications (if implemented).
- **Sync Event**: Handles background synchronization (if implemented).

**Basic Structure**
```javascript
// Install event - cache essential assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('app-cache-v1').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/manifest.json',
                // ... other essential assets
            ]);
        })
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== 'app-cache-v1') {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - serve cached content
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
```

**Caching Strategies (General Concepts)**
- **Cache First**: Check cache first, fallback to network
- **Network First**: Check network first, fallback to cache
- **Cache Only**: Serve only from cache (for guaranteed offline assets)
- **Network Only**: Always fetch from network (for real-time data)
- **Stale While Revalidate**: Serve cached content immediately while updating cache in background

**Notes**
- Service workers require HTTPS in production (except localhost).
- They have a separate lifecycle from the main application.
- Cache storage is limited by browser quotas (~50-500MB).
- Service workers can be updated by deploying new versions.
- Use `self.skipWaiting()` and `self.clients.claim()` for immediate activation.

## Workbox Integration

Workbox is a comprehensive JavaScript library collection for building PWAs, providing tools for caching, routing, and offline functionality.

### PWA Capabilities: With vs Without Workbox

**Without Workbox (Manual Service Worker)**
- Basic PWA installability (manifest + minimal service worker)
- Manual cache management with low-level Cache API
- Simple offline fallbacks (if implemented)
- No built-in caching strategies
- Requires extensive custom JavaScript for advanced features
- Error-prone cache versioning and cleanup
- Limited background sync capabilities

**With Workbox (Recommended)**
- Advanced caching strategies (CacheFirst, NetworkFirst, StaleWhileRevalidate)
- Automatic precaching of essential assets
- Intelligent runtime caching with routing
- Background sync for failed requests
- Pre-built recipes for common patterns
- Automatic cache expiration and cleanup
- Service worker lifecycle management
- Plugin system for extensibility

**Comparison Table**

| Feature                | Without Workbox               | With Workbox                   |
| ---------------------- | ----------------------------- | ------------------------------ |
| **Caching Strategies** | Manual Cache API              | 5 built-in strategies          |
| **Precaching**         | Manual implementation         | Automatic manifest generation  |
| **Runtime Caching**    | Custom routing logic          | Declarative route registration |
| **Background Sync**    | Complex custom implementation | Simple Queue API               |
| **Cache Expiration**   | Manual cleanup                | Automatic plugins              |
| **Offline Fallbacks**  | Basic error handling          | Intelligent catch handlers     |
| **Build Integration**  | Manual service worker         | CLI tools and webpack plugins  |
| **Recipes**            | None                          | Pre-built solutions            |
| **Maintenance**        | High effort                   | Low effort                     |

### Core Concepts

**Caching Strategies**
Workbox provides several built-in strategies for different resource types:

| Strategy             | Description               | Use Case                           | Example                         |
| -------------------- | ------------------------- | ---------------------------------- | ------------------------------- |
| CacheFirst           | Cache → Network fallback  | Static assets (images, fonts, CSS) | Images, fonts, bundled JS/CSS   |
| NetworkFirst         | Network → Cache fallback  | Dynamic content                    | API responses, HTML pages       |
| StaleWhileRevalidate | Cache + Background update | Fast but fresh content             | User profiles, news feeds       |
| NetworkOnly          | Network only              | Analytics, non-cacheable           | Tracking pixels, real-time data |
| CacheOnly            | Cache only                | Guaranteed offline                 | App shell, critical assets      |

**Precaching**
Downloads essential assets during service worker installation for offline availability.

**Runtime Caching**
Handles requests not precached, using routing and strategies.

### Installation

**Latest Version**: 7.4.0

**CDN (Recommended for Blazor)**
```javascript
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.4.0/workbox-sw.js');
```

**NPM Packages**
```bash
npm install workbox-sw workbox-build workbox-webpack-plugin workbox-window
```

### Advanced Features

**Background Sync**
Retries failed requests when connectivity returns.
```javascript
const bgSyncQueue = new workbox.backgroundSync.Queue('apiQueue', {
    maxRetentionTime: 24 * 60, // 24 hours
});
```

**Recipes**
Pre-built solutions for common patterns:
```javascript
// Google Fonts caching
workbox.recipes.googleFontsCache();

// Image caching with expiration
workbox.recipes.imageCache({
    cacheName: 'images',
    maxEntries: 60,
    maxAgeSeconds: 30 * 24 * 60 * 60
});

// Offline fallback
workbox.recipes.offlineFallback({
    pageFallback: '/offline.html'
});
```

**Plugins**
Extend strategies with additional functionality:
- `ExpirationPlugin`: Automatic cache cleanup
- `CacheableResponsePlugin`: Filter cacheable responses
- `BackgroundSyncPlugin`: Queue failed requests
- `BroadcastUpdatePlugin`: Notify app of cache updates

### Build Integration

**workbox-build.generateSW()**
Generates complete service worker with precaching and runtime caching.

**workbox-build.injectManifest()**
Injects precache manifest into custom service worker template.

**Webpack Plugin**
```javascript
const {GenerateSW} = require('workbox-webpack-plugin');

plugins: [
    new GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [{
            urlPattern: /^https:\/\/api\.example\.com/,
            handler: 'NetworkFirst'
        }]
    })
]
```

### Workbox Window

Manages service worker lifecycle from main application:
```javascript
import {Workbox} from 'workbox-window';

const wb = new Workbox('/sw.js');
wb.addEventListener('waiting', () => {
    // Handle update available
});
wb.register();
```

### Best Practices

- Use appropriate strategies for different resource types
- Implement cache versioning with manifest revisions
- Handle service worker updates gracefully
- Test offline functionality thoroughly
- Monitor cache sizes and implement cleanup
- Use local Workbox copy for production reliability

## Build Outputs

### Generated Files

| File                       | Location | Description                                  |
| -------------------------- | -------- | -------------------------------------------- |
| `service-worker-assets.js` | wwwroot  | JSON manifest of assets to precache.         |
| `blazor.publish.*`         | wwwroot  | Published Blazor bundles (DLLs, WASM, etc.). |

## .NET 10 Enhancements

Blazor WebAssembly in .NET 10 includes several improvements for PWA development:

- **Improved AOT Performance**: Faster compilation and smaller output sizes for AOT builds.
- **Enhanced Service Worker Tooling**: Better integration with service worker assets manifest generation.
- **WebAssembly Multithreading**: Experimental support for multithreaded WebAssembly (requires browser support).
- **PWA Installability Checks**: Enhanced validation for PWA requirements during build.

**Notes**
- Multithreading requires enabling experimental features and compatible browsers.
- Service worker assets manifest generation is more robust, handling edge cases in asset inclusion.

- PWAs require HTTPS in production for service worker registration.
- Browser support: Modern browsers (Chrome 70+, Edge 79+, Safari 12.2+).
- Storage limits: Browsers cap service worker cache at ~50-500MB.
- AOT compilation increases build time and requires .NET 8+; optimized in .NET 10.
- Workbox requires JavaScript execution; ensure no CSP policies block script imports.

## Error Messages

| Error                                | Meaning                                     | Solution                                         |
| ------------------------------------ | ------------------------------------------- | ------------------------------------------------ |
| `Service worker registration failed` | HTTPS not used or service worker not found. | Ensure HTTPS and correct file paths.             |
| `Manifest parsing failed`            | Invalid JSON in manifest.                   | Validate JSON syntax and required members.       |
| `Cache quota exceeded`               | Storage limit reached.                      | Reduce cached assets or implement cache cleanup. |

## Related References

- [ASP.NET Core Blazor PWA Documentation](https://learn.microsoft.com/en-us/aspnet/core/blazor/progressive-web-app/) - Official Microsoft guide for Blazor PWA setup.
- [Web App Manifest Specification](https://w3c.github.io/manifest/) - W3C standard for manifest files.
- [Service Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) - MDN reference for service worker implementation.
- [Workbox Documentation](https://developers.google.com/web/tools/workbox) - Google's library for service worker caching strategies.
- [Workbox GitHub](https://github.com/GoogleChrome/workbox) - Source code and releases.
- [Workbox Recipes](https://developers.google.com/web/tools/workbox/modules/workbox-recipes) - Pre-built caching solutions.
- [Workbox Strategies Guide](https://developers.google.com/web/tools/workbox/modules/workbox-strategies) - Detailed caching strategy documentation.