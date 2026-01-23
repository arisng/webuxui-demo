# **Feature Issue: Offline Status Indicator**

**Date:** 2026-01-22  
**Feature ID:** offline-status-indicator  
**Priority:** P1  
**Status:** Done

## **Summary**

Show a persistent status indicator for Downloading, Ready, and Offline Active states.
Scope is Blazor WASM standalone only; InteractiveAuto/Server is not supported in this phase.

## **Implementation Notes (Actual)**

- `offline-bridge.js` tracks `navigator.onLine` plus service worker messages and updates status.
- `OfflineStatusIndicator.razor` renders the label + animated dot with CSS states.
- `MainLayout.razor` receives status via JS interop and binds it to the header indicator.
- In no-build mode, readiness is based on service worker `activate` + `clients.claim()` messaging.

## **Docs Alignment (Offline Support)**

- `navigator.onLine` is not a reliable indicator of offline readiness, only network connectivity.
- Offline support requires a published build, an online first visit, and a service worker controlling the page.
- Reload once to ensure the service worker controls the page before expecting reliable offline behavior.

## **Implementation Plan (Proposed)**

- Split indicator states: `online`/`offline` (network) vs `ready` (cached + SW controlled).
- Gate Ready on `navigator.serviceWorker.controller` + receipt of `offline-ready`.
- Add an intermediate UI state when offline but not ready (e.g., “Offline (not cached)”).
- Ensure the status source does not rely solely on `navigator.onLine`.

## **Use Cases**

### **Blazor WASM Standalone Mode**

- On first load, show Downloading until the service worker activates and precache completes.
- Transition to Ready only after the page is controlled (`navigator.serviceWorker.controller`) and caches are warmed.
- Offline Active toggles via `online`/`offline` events and persists across refreshes while offline.
 - Offline Active indicates network loss; it does not guarantee the app shell is cached unless Ready was previously achieved.
 
## **Out of Scope (Now)**

- InteractiveAuto/Server rendering support and transition handling.
 - Build-time precache manifest integration.

## **Acceptance Criteria**

- While assets are caching, indicator shows Downloading (grey/blinking).
- When caching completes and the service worker controls the page, indicator shows Ready (green).
- When offline, indicator shows Offline Active (red) and returns to Ready when online.
- If offline before readiness, indicator shows Offline (not cached) instead of Ready.

## **Verification (Pending)**

- Offline verification must use a published build; debug mode uses the no-op `service-worker.js`.
- Publish build, load once online, reload to ensure control, toggle offline/online, and verify Downloading → Ready → Offline state transitions.
- In DevTools, confirm the service worker is activated before expecting Ready or Offline Active to imply cached usage.

## **Reference**

- Microsoft Learn: *ASP.NET Core Blazor PWA* -> **Offline support** / `navigator.onLine` reliability notes.  
  https://learn.microsoft.com/en-us/aspnet/core/blazor/progressive-web-app/?view=aspnetcore-10.0&tabs=visual-studio#offline-support
