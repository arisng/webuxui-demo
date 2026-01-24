# **Feature Issue: App Update Notification**

**Date:** 2026-01-24  
**Feature ID:** app-update-notification  
**Priority:** P2  
**Status:** Planned

## **Summary**

Notify users when a new service worker version is available and let them update.

## **Implementation Notes (Planned)**

- Use `workbox-window` to register the service worker and listen for `waiting` or `installed` events.
- When a new version is detected, show a non-blocking toast/banner: “Update available. Update to apply.”
- Provide a single action button: “Update”.
- On click, call `registration.waiting.postMessage({ type: "SKIP_WAITING" })` and then reload once `controlling` changes.
- Ensure update prompt appears once per new version (track last-seen version in localStorage).
- Do not show the prompt if the update is already applied (`registration.waiting` is null).

## **Acceptance Criteria**

- When a new service worker version is available, user sees a clear update prompt.
- Clicking “Update” applies the update and reloads the app.
- Prompt appears only once per version and does not reappear on every navigation.
- No prompt appears on first install before a previous version exists.

## **Verification (Pending)**

- Publish build, load once, then deploy a changed service worker.
- Reopen the app and verify the update prompt appears.
- Click “Update” and confirm the new version is active (DevTools > Application > Service Workers).
- Verify the prompt does not appear on first install (no prior controller).
- Verify the prompt appears only once per version across reloads.

### **Quick Local Update Simulation (Dummy Change)**

Use this when you want to trigger the update prompt quickly.

1. Make a tiny change to the service worker file, e.g. add a comment to `src/wwwroot/service-worker.published.js`:
   ```js
   // update-test-1
   ```
2. Re-publish so the precache manifest/version changes:
   ```bash
   dotnet publish -c Release
   ```
3. Serve the published output and open the app once.
4. Reopen or reload the app to see the update prompt.

Notes:
- In debug/dev, `service-worker.js` is a no-op. Use a **published** build.
- A “changed service worker” means the SW file bytes or precache manifest/version changed.

## **Reference**

- Microsoft Learn: *ASP.NET Core Blazor PWA* -> **Offline support** / service worker lifecycle notes.  
  https://learn.microsoft.com/en-us/aspnet/core/blazor/progressive-web-app/?view=aspnetcore-10.0&tabs=visual-studio#offline-support
