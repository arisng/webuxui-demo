# Progressive Web App (PWA) Installation Guide

SonicMemo is a Progressive Web App (PWA), meaning it can be installed on your device to provide a more app-like experience, including offline support and standalone window display.

## PWA Installation Overview

Browsers determine if an app is "installable" based on several criteria:
- **Web App Manifest**: A valid `manifest.webmanifest` file is present.
- **Service Worker**: A service worker with a `fetch` handler is registered.
- **HTTPS**: The site is served over HTTPS (or `localhost`).
- **Icons**: At least one icon (192px/512px) is provided.

When these criteria are met, the browser will offer an installation prompt.

## Installation Behavior

### Desktop (Chrome, Edge, Brave)

A PWA install icon will appear on the right side of the **Omnibox** (address bar). 

1. Navigate to the SonicMemo URL.
2. Click the **Install** icon in the address bar.
3. Confirm installation in the popup.
4. SonicMemo will open in a standalone window and appear in your OS app list/dock.

### Android

Chrome on Android will periodically show an "Add to Home Screen" mini-infobar at the bottom of the screen.

1. Navigate to the SonicMemo URL.
2. If the banner appears, tap it to begin installation.
3. Alternatively, tap the **three-dot menu** ⋮ in the corner and select **Install app** or **Add to Home screen**.

### iOS (Safari)

iOS does not automatically prompt users to install PWAs. Users must initiate the process manually.

1. Open the SonicMemo URL in **Safari**.
2. Tap the **Share** button (square with an arrow pointing up).
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add** in the top right corner.
5. SonicMemo will appear on your Home Screen as an icon.

## PWA Compliance Checklist

Maintainers should ensure these elements are properly configured to keep the app installable:

- [ ] **Web Manifest**: 
  - Located at `src/wwwroot/manifest.webmanifest`.
  - Must include `name`, `short_name`, `start_url`, `display: standalone`, and `icons`.
- [ ] **`index.html` Links**: 
  - Linked via `<link rel="manifest" href="manifest.webmanifest" />`.
- [ ] **Apple-Specific Meta Tags**: 
  - `<meta name="apple-mobile-web-app-capable" content="yes">`
  - `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
  - Meta tags for `apple-mobile-web-app-title`.
  - `<link rel="apple-touch-icon" ...>` for Home Screen icons.
- [ ] **Service Worker**: 
  - Located at `src/wwwroot/service-worker.js`.
  - Must be registered in `index.html`.
  - **Crucial**: Must have a `fetch` event listener (even if empty in development) to pass Chromium's installability check.
- [ ] **Icons**:
  - Provided in `192x192` and `512x512` sizes in `src/wwwroot/`.
  - Manifest should define icons with `purpose: "any"` and `purpose: "maskable"` to support different launcher styles (e.g., adaptive icons on Android).
- [ ] **Security**:
  - Production deployments must use **HTTPS**.

## Troubleshooting Installation Issues

### Android/Remote Device Not Showing Banner

Chrome only enables PWA installation features over **HTTPS** or **Localhost**.
- If testing on a physical Android device via a local network IP (e.g., `http://192.168.1.5:8000`), the "Install" prompt will **not** appear.
- **Solution**: Use a tool like **ngrok** to create an HTTPS tunnel, or enable the following flag in Chrome on Android: `chrome://flags/#unsafely-treat-insecure-origin-as-secure` and add your development URL.

### App Opens in Browser Instead of Standalone

If the app opens in a browser tab even after being "Added to Home Screen," it means the installation failed to register as a full PWA.

#### 1. HTTPS and Trusted Certificates (The most common cause)

- **iOS (Safari)**: Is relatively lenient and will often allow "standalone" mode even over plain HTTP or untrusted HTTPS.
- **Android (Chrome)**: Is **extremely strict**. 
  - If you are using **plain HTTP**, Chrome will refuse to launch in standalone mode.
  - **Untrusted Certificates**: If you are using HTTPS but your certificate is untrusted (e.g., you see a "Your connection is not private" warning in Chrome), **Chrome often disables PWA features**. The app may install but it will fail the background validation, causing it to open in the browser.
- **Solution**: 
  - For local testing on Android, use **ngrok** to get a trusted HTTPS URL.
  - Or, use Chrome's flag: `chrome://flags/#unsafely-treat-insecure-origin-as-secure` on the Android device and add your `http://<ip>:<port>` to the list. This allows you to test on **HTTP** with full PWA features.

#### 2. Manifest and Service Worker

Android requires a valid manifest and a registered service worker with a `fetch` event listener.
- Check `chrome://serviceworker-internals/` on your device to see if the worker is actually registered.
- Check the **Applications** tab in Desktop Chrome DevTools (while inspecting your phone) to see "Installability" errors.
