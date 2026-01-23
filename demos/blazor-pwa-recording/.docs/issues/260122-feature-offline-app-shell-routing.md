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

## **Workbox Notes (No-Build)**

- Use the CDN `workbox-sw` loader and call `precacheAndRoute()` with a manual list of `{ url, revision }`.
- Keep cache names versioned manually until build-time precache is introduced.

## **Future Migration Notes (Build-Time Precache)**

- Replace the manual precache list with a generated manifest (`__WB_MANIFEST`) via Workbox Build/CLI.
- Keep the navigation routing + catch handler logic unchanged.

## **Acceptance Criteria**

- After a successful first load, airplane mode still allows a refresh to load the app shell.
- Deep-link navigation serves the cached app shell when offline.
- No "Failed to fetch" or blank screen occurs during offline navigation.

## **Verification (Pending)**

- Offline verification must use a published build; debug mode uses the no-op `service-worker.js`.
- Publish build, load once online, then go offline and verify refresh + deep links render the app shell.
