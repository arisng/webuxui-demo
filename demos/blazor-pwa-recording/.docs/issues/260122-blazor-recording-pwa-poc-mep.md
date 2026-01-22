# **Product Specification: Blazor Audio PWA (Minimal Evolvable Product)**

**Date:** 2026-01-22  
**Target Framework:** .NET 10 (Blazor Web App)  
**Render Mode:** InteractiveAuto  
**Priority:** Instant First Load, Offline Awareness, iOS Compatibility

## **Progress**

- **Progress:** 6/11 Done
- **In-Progress:** None
- **Last Updated:** 2026-01-22

## **Goals**

- Deliver a zero-friction audio recorder that loads instantly and works fully offline after the first successful load.
- Keep all audio data in the browser (privacy-first) while remaining evolvable toward cloud sync/transcription later.
- Make offline readiness explicit so users know when it is safe to disconnect.

## **Non-Goals (Now)**

- Cloud sync, transcription, or server-side storage of audio blobs.
- Multi-user accounts or authentication.
- Advanced audio editing or waveform UI.

## **Constraints & Decisions**

- **InteractiveAuto** is required for SSR-first load and background WASM download.
- **AOT disabled** to keep initial WASM bundle smaller.
- **IndexedDB** is the only storage system.
- **Audio blobs never leave the browser** in this phase.
- **Service worker must provide App Shell offline routing** (auto-mode fix).

## **Feature List (Flat)**

- **ID:** `setup-wasm-pwa-standalone`  
  **Title:** Setup WASM PWA Standalone  
  **Priority:** P0  
  **Status:** Done  
  **Issue:** `.docs/issues/260122-feature-setup-wasm-pwa-standalone.md`  
  **Updated:** 2026-01-22  
  **Summary:** Keep current Blazor WASM PWA standalone setup as the baseline before migrating to InteractiveAuto.
- **ID:** `instant-first-load`  
  **Title:** Instant First Load (SSR)  
  **Priority:** P2  
  **Status:** Planned  
  **Issue:** TBD  
  **Updated:** 2026-01-22  
  **Summary:** UI is interactive immediately via server render; WASM downloads in the background.
- **ID:** `offline-app-shell-routing`  
  **Title:** Offline App Shell Routing  
  **Priority:** P2  
  **Status:** Planned  
  **Issue:** TBD  
  **Updated:** 2026-01-22  
  **Summary:** Service worker intercepts navigation and serves cached `index.html` when offline.
- **ID:** `offline-readiness-notification`  
  **Title:** Offline Readiness Notification  
  **Priority:** P1  
  **Status:** Planned  
  **Issue:** TBD  
  **Updated:** 2026-01-22  
  **Summary:** Toast appears once service worker finishes caching WASM/DLL assets: “⚡ App is ready for offline use.”
- **ID:** `tap-record-tap-stop`  
  **Title:** Recording (Tap-to-Record / Tap-to-Stop)  
  **Priority:** P0  
  **Status:** Done  
  **Issue:** `.docs/issues/260122-feature-tap-record-tap-stop.md`  
  **Updated:** 2026-01-22  
  **Summary:** One tap starts recording, second tap stops and autosaves.
- **ID:** `mime-type-smart-detection`  
  **Title:** MIME Type Smart Detection  
  **Priority:** P0  
  **Status:** Done  
  **Issue:** `.docs/issues/260122-feature-mime-type-smart-detection.md`  
  **Updated:** 2026-01-22  
  **Summary:** MediaRecorder iterates supported types in order: `audio/webm;codecs=opus`, `audio/mp4`, `audio/webm`, `audio/wav`.
- **ID:** `auto-stop-on-app-switch`  
  **Title:** Auto-Stop on App Switch  
  **Priority:** P1  
  **Status:** Planned  
  **Issue:** TBD  
  **Updated:** 2026-01-22  
  **Summary:** Stop recording on `visibilitychange` to prevent background recording loss.
- **ID:** `local-storage-indexeddb`  
  **Title:** Local Storage (IndexedDB)  
  **Priority:** P0  
  **Status:** Done  
  **Issue:** `.docs/issues/260122-feature-local-storage-indexeddb.md`  
  **Updated:** 2026-01-22  
  **Summary:** DB `AudioStore` with store `Recordings` schema `{ id, blob, timestamp, duration }`.
- **ID:** `persistence-protection`  
  **Title:** Persistence Protection  
  **Priority:** P0  
  **Status:** Done  
  **Issue:** `.docs/issues/260122-feature-persistence-protection.md`  
  **Updated:** 2026-01-22  
  **Summary:** Call `navigator.storage.persist()` on startup to reduce eviction risk (especially iOS).
- **ID:** `recordings-list-playback`  
  **Title:** Recordings List & Playback  
  **Priority:** P0  
  **Status:** Done  
  **Issue:** `.docs/issues/260122-feature-recordings-list-playback.md`  
  **Updated:** 2026-01-22  
  **Summary:** List newest-first with play and delete actions.
- **ID:** `offline-status-indicator`  
  **Title:** Offline Status Indicator  
  **Priority:** P2  
  **Status:** Planned  
  **Issue:** TBD  
  **Updated:** 2026-01-22  
  **Summary:** Header icon shows Downloading (grey/blinking), Ready (green), Offline Active (red).

## **UI/UX Baseline**

- Minimal header, centered 150px+ circular record button, list below.
- Offline readiness toast appears bottom-center and auto-dismisses after a few seconds.

## **Implementation Notes (Non-Exhaustive)**

- **Service Worker:** Use NetworkFirst for navigation and CacheFirst for audio; ensure App Shell fallback works for Auto mode.
- **Readiness Bridge:** Use `workbox-window` or equivalent to detect `controlling` and invoke a `[JSInvokable]` toast method.
- **Interop Abstraction:** Audio service must work in both Server (SignalR) and WASM modes.

## **Out of Scope (Future)**

- Transcription (e.g., Whisper API).
- Background sync to cloud storage.
- Waveform rendering or trimming tools.
