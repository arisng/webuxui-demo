# How to publish and run the Blazor PWA locally

This guide shows you how to publish the Blazor PWA to its production-ready state and run it in your local environment.

## When to use this guide

Use this guide when you need to test features that only work in the published application, such as:
- Progressive Web App (PWA) installation
- Service worker behavior and background synchronization
- Offline-first capabilities
- Production-specific bundle optimizations

## Before you start

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) installed
- Basic familiarity with the command line
- Docker installed (optional, for HTTPS testing)

## Automated approach (Fastest)

To avoid repeating multiple `cd` and `publish` commands, you can use the provided automation script from the project root.

1. Run the script:
   ```bash
   ./run-published.sh
   ```
   This script will:
   - Run `dotnet publish -c Release`
   - Automatically target the correct output directory
   - Start `dotnet-serve` with the necessary `--fallback-file` for Blazor routing
   - **Enable mobile access** by binding to all network interfaces and displaying your local IP address.

> [!IMPORTANT]
> **HTTPS for PWA on Mobile**: Most browsers (Chrome/Safari) require a Secure Context (HTTPS) for PWA features like Service Workers and "Add to Home Screen" to work on mobile. If you are accessing via IP over HTTP, these features may be disabled. Use the **Docker (HTTPS)** method for full PWA testing on mobile.

---

## Manual Steps

### 1. Build and publish the release bundle

The application must be published in **Release** configuration to enable PWA features.

Run this command from the `demos/blazor-pwa-recording/src` directory:

```bash
dotnet publish -c Release
```

The output files are generated in:
`demos/blazor-pwa-recording/src/bin/Release/net10.0/publish/wwwroot`

### 2. Serve the application

Choose one of the following methods to serve the published static files.

#### Option A: Using `dotnet-serve` (Recommended)

`dotnet-serve` is a specialized tool for serving static .NET web assets.

1. Install the tool globally (if not already installed):
   ```bash
   dotnet tool install --global dotnet-serve
   ```
2. Navigate to the publish directory and start the server:
   ```bash
   cd bin/Release/net10.0/publish/wwwroot
   dotnet-serve --port 8080
   ```

#### Option B: Using Python `http.server`

If you have Python installed, use its built-in server:

```bash
cd bin/Release/net10.0/publish/wwwroot
python3 -m http.server 8080
```

#### Option C: Using Docker (with HTTPS)

This project includes a `Dockerfile` that configures **HTTPS** using self-signed certificates, which is highly recommended for PWA testing.

1. From the `demos/blazor-pwa-recording` folder, build the image:
   ```bash
   docker build -t blazor-pwa-recording .
   ```
2. Run the container:
   ```bash
   docker run -d \
     -p 8080:80 \
     -p 8443:443 \
     --name blazor-pwa \
     blazor-pwa-recording
   ```
3. Access the app:
   - HTTPS: `https://localhost:8443` (Accept the browser SSL warning)
   - HTTP: `http://localhost:8080`

### 3. Verify PWA functionality

1. Open `http://localhost:8080` (or the HTTPS link) in your browser.
2. Open **Chrome DevTools (F12)** and navigate to the **Application** tab.
3. Select **Service Workers** in the left sidebar to verify that the service worker is active.
4. Check the **Offline** box and refresh the page to confirm the app still loads.

## Troubleshooting

**Problem: Service worker not registering**  
Solution: Ensure you are running the **published** version of the app. Development mode often overrides the service worker for easier debugging.

**Problem: Camera/Microphone access denied over HTTP**  
Solution: Browsers restrict powerful APIs like the MediaStream API to secure contexts. Use the **Docker (HTTPS)** method or test via `localhost`.

## Simulate a service worker update (local)

Use these steps when you need to trigger the app update prompt.

1. **Make a change** that will alter the service worker or its precache manifest:
   - Edit `src/wwwroot/service-worker.published.js`, or
   - Change any static asset (CSS/JS/HTML) that ends up in `wwwroot`.
2. **Publish again** so the build regenerates `service-worker-assets.js` and updates the version:
   ```bash
   dotnet publish -c Release
   ```
3. **Serve the published output** (same as above) and open the app once.
4. **Reopen or reload** the app to see the update prompt appear.

Notes:
- In debug/dev, `service-worker.js` is a no-op. Updates only work in **published** builds.
- A “changed service worker” means the SW file bytes or the precache manifest/version changed between publishes.

## Variations

### Testing on Mobile via Chrome Port Forwarding

If you want to test PWA features on an Android device without setting up HTTPS, you can use Chrome's Port Forwarding. This allows the mobile device to access the app via `localhost:8080`, which browsers treat as a Secure Context.

See the [Chrome Port Forwarding Guide](./how-to-use-chrome-port-forwarding.md) for detailed steps.

## Related guides

- [How to use Chrome Port Forwarding](./how-to-use-chrome-port-forwarding.md)
- [Tutorial: Getting started with Blazor PWA](../../tutorials/getting-started.md)
- [Reference: Service Worker Configuration](../../reference/service-worker-config.md)

## See also

- [Explanation: Understanding Offline-First in Blazor](../../explanation/offline-first-concepts.md)
- [Reference: .NET 10 Blazor PWA Documentation](https://learn.microsoft.com/en-us/aspnet/core/blazor/progressive-web-app/?view=aspnetcore-10.0)
