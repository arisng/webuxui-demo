# **Issue Recap: Blazor WASM Loader 404 in Docker**

**Date:** 2026-01-23  
**Context:** Blazor PWA Recording (WASM standalone) running via Docker + Nginx, HTTPS on localhost.  
**Related Files:** `src/wwwroot/index.html`, `src/blazor-pwa-recording.csproj`, `Dockerfile`, `nginx.conf`

## **Summary**

After running the container, the app loads but the Blazor WebAssembly loader returns 404s. Specifically:
- `_framework/blazor.webassembly.js` returned 404 in Docker.
- Changing to `_framework/blazor.web.js` also returned 404 because that loader is not produced for WASM standalone.
The issue is resolved by using the fingerprint placeholder in `index.html`.

## **Observed Behavior**

- App UI fails to load because the runtime loader script is missing.
- Inside the container, `_framework/blazor.webassembly.<hash>.js` exists (fingerprinted).
- The non‑hashed loader filename does **not** exist.

## **Root Cause**

- The Blazor script is a static web asset with automatic fingerprinting. In Blazor WebAssembly apps, its `<script>` tag lives in `wwwroot/index.html`.
- The correct loader reference uses the fingerprint placeholder:
  ```html
  <script src="_framework/blazor.webassembly#[.{fingerprint}].js"></script>
  ```
  On publish, `{fingerprint}` is replaced with a unique hash, producing the hashed file name.
- `index.html` points to a fixed loader filename, so it 404s once the file is fingerprinted.
- Switching to `blazor.web.js` does not apply here because that loader is **not produced** for WASM standalone apps.

## **Why It Happened in Docker**

- Docker publishes the app and serves only the published static files.
- The published files include the hashed loader, not the un-hashed one referenced by `index.html`.

## **Confirmed Not the Cause**

- Service worker behavior (dev vs published) does not affect the `_framework` 404s.
- Nginx config is serving from `/usr/share/nginx/html` with `try_files` correctly.

## **Fix (Confirmed Working)**

- Use the fingerprint placeholder in `index.html`:
  ```html
  <script src="_framework/blazor.webassembly#[.{fingerprint}].js"></script>
  ```
- Rebuild the Docker image.

## **Reference**

- Microsoft Learn: *ASP.NET Core Blazor project structure* → **Location of the Blazor script** (Blazor WebAssembly script placeholder and publish-time fingerprint replacement).  
  https://learn.microsoft.com/en-us/aspnet/core/blazor/project-structure?view=aspnetcore-10.0#location-of-the-blazor-script

## **Next Steps**

- Verify the published `_framework/blazor.webassembly.<hash>.js` loads without 404.
