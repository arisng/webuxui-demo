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

## **Use Cases**

### **Blazor WASM Standalone Mode**

- On first load, show Downloading until the service worker activates and precache completes.
- Transition to Ready only after the page is controlled (`navigator.serviceWorker.controller`) and caches are warmed.
- Offline Active toggles via `online`/`offline` events and persists across refreshes while offline.
 
## **Out of Scope (Now)**

- InteractiveAuto/Server rendering support and transition handling.
 - Build-time precache manifest integration.

## **Acceptance Criteria**

- While assets are caching, indicator shows Downloading (grey/blinking).
- When caching completes and the service worker controls the page, indicator shows Ready (green).
- When offline, indicator shows Offline Active (red) and returns to Ready when online.

## **Verification (Pending)**

- Offline verification must use a published build; debug mode uses the no-op `service-worker.js`.
- Publish build, toggle offline/online, and verify Downloading → Ready → Offline state transitions.
