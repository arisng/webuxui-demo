# **Feature Issue: Offline Readiness Notification**

**Date:** 2026-01-22  
**Feature ID:** offline-readiness-notification  
**Priority:** P1  
**Status:** Planned

## **Summary**

Show a one-time toast when the app is fully cached and safe to use offline.
Scope is Blazor WASM standalone only; InteractiveAuto/Server is not supported in this phase.

## **Implementation Notes (Planned)**

- Use `workbox-window` to listen for `activated` and `controlling` events.
- Fire readiness after `activated` (first install) **and** the page is controlled; if `clients.claim()` is enabled, this can happen on first load, otherwise it will occur on the next navigation.
- Use JS interop to invoke a Blazor toast method once per install/session.
- The toast should be non-blocking and auto-dismiss after a few seconds.
 - In no-build mode, readiness is based on service worker control + manual precache completion.

## **Acceptance Criteria**

- After first successful online load, a toast appears: “⚡ App is ready for offline use.”
- The toast appears only once per install or after cache refresh, not on every navigation.
- No toast is shown before the service worker is controlling the page (same session if `clients.claim()` is used, otherwise after the next navigation).

## **Future Migration Notes (Build-Time Precache)**

- Swap manual precache tracking for Workbox build-time manifest completion.
- Keep the toast trigger logic based on `activated` + `controlling`.

## **Verification (Expected)**

- JS interop emits a readiness event only after service worker control + cache warm signal.
- UI displays a single readiness toast and auto-dismisses.
