# **Feature Issue: Setup WASM PWA Standalone**

**Date:** 2026-01-22  
**Feature ID:** setup-wasm-pwa-standalone  
**Priority:** P0  
**Status:** Done

## **Summary**

Establish the current Blazor WebAssembly PWA standalone baseline (non-InteractiveAuto) to reflect the actual project implementation before later migration to Blazor InteractiveAuto.

## **Implementation Notes (Actual State)**

- **Project type:** Blazor WebAssembly (`Microsoft.NET.Sdk.BlazorWebAssembly`).
- **Target framework:** net10.0.
- **Service worker:**
  - `wwwroot/service-worker.js` (dev no-op fetch listener for installability).
  - `wwwroot/service-worker.published.js` (offline cache for published builds).
- **PWA manifest:** `wwwroot/manifest.webmanifest` with `display: standalone` and icons.
- **PWA install/registration:** `wwwroot/index.html` registers `service-worker.js` and links manifest + icons.

## **Acceptance Criteria (Now)**

- App is a standalone Blazor WebAssembly PWA (not InteractiveAuto).
- Service worker is registered and manifest is present.
- Icons and standalone display settings are configured.

## **Verification (Evidence)**

- `src/blazor-pwa-recording.csproj` uses `Microsoft.NET.Sdk.BlazorWebAssembly` and declares service worker assets.
- `src/wwwroot/index.html` registers `service-worker.js` and references `manifest.webmanifest`.
- `src/wwwroot/manifest.webmanifest` contains `display: standalone` and icons.
- `src/wwwroot/service-worker.js` and `src/wwwroot/service-worker.published.js` exist.

## **Follow-ups**

- Future migration path will introduce InteractiveAuto (tracked in the MEP as separate features).
