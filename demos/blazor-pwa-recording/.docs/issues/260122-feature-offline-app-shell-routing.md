# **Feature Issue: Offline App Shell Routing**

**Date:** 2026-01-22  
**Feature ID:** offline-app-shell-routing  
**Priority:** P0  
**Status:** Done

## **Summary**

Ensure the PWA loads and routes while offline by serving the cached app shell for navigation requests.
Scope is Blazor WASM standalone only; InteractiveAuto/Server is not supported in this phase.

## **Implementation Notes (Actual)**

- Workbox no-build is used via CDN (`workbox-sw`) in `src/wwwroot/service-worker.published.js`.
- Navigation requests use `NetworkFirst` with a catch handler that serves cached `index.html`.
- Precache list is derived from `service-worker-assets.js` (manual/no-build) and passed to `precacheAndRoute`.
- Works for client-side routes in WASM standalone (app shell fallback when offline).

## **Docs Alignment (Offline Support)**

- Offline support is only enabled for published apps and requires a first online visit to cache resources.
- Verification should confirm an activated service worker and that reloads are served from Service Worker or memory cache.
- The built-in PWA template uses a cache-first strategy for offline reliability; `NetworkFirst` is a deliberate deviation that must still guarantee offline reloads.

## **Implementation Plan (Proposed)**

- Switch navigation handling to `CacheFirst` (or `StaleWhileRevalidate`) for `request.mode === "navigate"` to align with offline-first behavior.
- Keep the catch handler to return `index.html` from precache for any navigation failure.
- Gate the “offline-ready” signal on a successful precache match of `index.html` to avoid false readiness.
- (Optional) Self-host Workbox in `wwwroot/lib/workbox` to remove CDN dependency during install.

## **Workbox Notes (No-Build)**

- Use the CDN `workbox-sw` loader and call `precacheAndRoute()` with a manual list of `{ url, revision }`.
- Keep cache names versioned manually until build-time precache is introduced.

## **Future Migration Notes (Build-Time Precache)**

- Replace the manual precache list with a generated manifest (`__WB_MANIFEST`) via Workbox Build/CLI.
- Keep the navigation routing + catch handler logic unchanged.

## **Acceptance Criteria**

- After a successful first online load and reload, airplane mode still allows a refresh to load the app shell.
- Deep-link navigation serves the cached app shell when offline.
- No "Failed to fetch" or blank screen occurs during offline navigation.
- Navigation requests are served from Service Worker or memory cache when offline.

## **Verification (Pending)**

- Offline verification must use a published build; debug mode uses the no-op `service-worker.js`.
- Publish build, load once online, reload to ensure the service worker controls the page, then go offline and verify refresh + deep links render the app shell.
- In DevTools, confirm the service worker is activated and assets are served from Service Worker or memory cache on reload.

## **Reference**

- Microsoft Learn: *ASP.NET Core Blazor PWA* -> **Offline support** / **Cache-first fetch strategy**.  
  https://learn.microsoft.com/en-us/aspnet/core/blazor/progressive-web-app/?view=aspnetcore-10.0&tabs=visual-studio#offline-support
