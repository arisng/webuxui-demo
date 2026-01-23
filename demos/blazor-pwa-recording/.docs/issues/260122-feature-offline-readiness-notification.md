# **Feature Issue: Offline Readiness Notification**

**Date:** 2026-01-22  
**Feature ID:** offline-readiness-notification  
**Priority:** P1  
**Status:** Done

## **Summary**

Show a one-time toast when the app is fully cached and safe to use offline.
Scope is Blazor WASM standalone only; InteractiveAuto/Server is not supported in this phase.

## **Implementation Notes (Actual)**

- Service worker posts `{ type: "offline-ready", version }` on `activate` after claiming clients.
- `offline-bridge.js` listens for the message and triggers a one-time toast per version using localStorage.
- `MainLayout.razor` exposes a `[JSInvokable]` method to show the toast and auto-dismiss.

## **Docs Alignment (Offline Support)**

- Offline support is only enabled for published builds and requires a first online visit to cache resources.
- A page reload is typically required before the service worker controls the page.
- `navigator.onLine` is not a reliable signal of offline readiness.

## **Implementation Plan (Proposed)**

- Emit the `offline-ready` message only after `precacheAndRoute` is set and `matchPrecache("index.html")` succeeds.
- In `offline-bridge.js`, set Ready only when `navigator.serviceWorker.controller` exists and `offline-ready` is received.
- Show a “ready” toast only after the above condition is met (avoid showing while online but not cached).
- (Optional) Add a one-time “Reload to finish offline setup” prompt when SW activates but the page is not yet controlled.

## **Acceptance Criteria**

- After first successful online load, a toast appears: “⚡ App is ready for offline use.”
- The toast appears only once per install or after cache refresh, not on every navigation.
- No toast is shown before the service worker is controlling the page (after the first reload if needed).
- Toast is not shown if `index.html` is not present in precache.

## **Future Migration Notes (Build-Time Precache)**

- Swap manual precache tracking for Workbox build-time manifest completion.
- Keep the toast trigger logic based on `activated` + `controlling`.

## **Verification (Pending)**

- Offline verification must use a published build; debug mode uses the no-op `service-worker.js`.
- Publish build, load once online, reload to ensure control, and verify the toast appears once per service worker version.
- In DevTools, confirm the service worker is activated before expecting the toast.

## **Reference**

- Microsoft Learn: *ASP.NET Core Blazor PWA* -> **Offline support** / `navigator.onLine` reliability notes.  
  https://learn.microsoft.com/en-us/aspnet/core/blazor/progressive-web-app/?view=aspnetcore-10.0&tabs=visual-studio#offline-support
