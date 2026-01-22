# **Feature Issue: Offline App Shell Routing**

**Date:** 2026-01-22  
**Feature ID:** offline-app-shell-routing  
**Priority:** P0  
**Status:** Planned

## **Summary**

Ensure the PWA loads and routes while offline by serving the cached app shell for navigation requests.
Scope is Blazor WASM standalone only; InteractiveAuto/Server is not supported in this phase.

## **Implementation Notes (Planned)**

- Use Workbox `workbox-routing` to match navigation requests and apply `NetworkFirst`.
- Use `setCatchHandler` (or a custom navigation fallback) to return cached `index.html` when navigation fails.
- Precache `index.html`, WASM/DLLs, CSS, and static assets so offline loads succeed after first run (manual list in no-build).
- Confirm the fallback works for client-side routes in WASM standalone.

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

## **Verification (Expected)**

- Service worker includes a navigation route fallback to cached `index.html`.
- Manual test: load once online, go offline, refresh, and navigate within the app successfully.
