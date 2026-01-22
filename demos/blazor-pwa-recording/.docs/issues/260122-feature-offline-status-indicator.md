# **Feature Issue: Offline Status Indicator**

**Date:** 2026-01-22  
**Feature ID:** offline-status-indicator  
**Priority:** P1  
**Status:** Planned

## **Summary**

Show a persistent status indicator for Downloading, Ready, and Offline Active states.
Scope is Blazor WASM standalone only; InteractiveAuto/Server is not supported in this phase.

## **Implementation Notes (Planned)**

- Track service worker installation/activation and cache readiness to switch from Downloading to Ready.
- Use `navigator.onLine` and `online`/`offline` events to indicate Offline Active.
- Expose state to Blazor via JS interop and update a header icon with color and animation.
- In no-build mode, treat "Ready" as `workbox-window` `controlling` after install (or after next navigation if `clients.claim()` is not enabled).

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

## **Verification (Expected)**

- Header component binds to an offline status model.
- JS interop module dispatches readiness and network events to Blazor.
