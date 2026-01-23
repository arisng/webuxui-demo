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

## **Acceptance Criteria**

- After first successful online load, a toast appears: “⚡ App is ready for offline use.”
- The toast appears only once per install or after cache refresh, not on every navigation.
- No toast is shown before the service worker is controlling the page (same session if `clients.claim()` is used, otherwise after the next navigation).

## **Future Migration Notes (Build-Time Precache)**

- Swap manual precache tracking for Workbox build-time manifest completion.
- Keep the toast trigger logic based on `activated` + `controlling`.

## **Verification (Pending)**

- Offline verification must use a published build; debug mode uses the no-op `service-worker.js`.
- Publish build, load once online, and verify the toast appears once per service worker version.
