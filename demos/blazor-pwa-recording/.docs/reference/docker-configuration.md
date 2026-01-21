# Docker and Nginx Configuration Reference

Technical details for the containerized deployment of the Blazor PWA.

## Dockerfile

The `Dockerfile` uses a multi-stage build to minimize image size and separate the build environment from the production artifacts.

| Stage | Image | Purpose |
| :--- | :--- | :--- |
| `build` | `mcr.microsoft.com/dotnet/sdk:10.0` | Restores, builds, and publishes the .NET 10.0 project. |
| `final` | `nginx:alpine` | Serves the static `wwwroot` files using Nginx on Alpine Linux. |

### Build Arguments and Environment
- **Context Root**: `demos/blazor-pwa-recording/`
- **Output Path**: `/app/publish/wwwroot` inside the build stage.

## Nginx Configuration

The custom `nginx.conf` is optimized for Blazor WebAssembly SPAs.

### Key Directives

- `try_files $uri $uri/ /index.html =404;`: Essential for client-side routing. It ensures that deep-linked URLs (e.g., `/counter`) are handled by `index.html`.
- `types { application/wasm wasm; }`: Forces the correct MIME type for WebAssembly modules, which is required by some browsers for streaming instantiation.
- `expires 1y;`: Sets long-term caching headers for immutable assets like `.wasm`, `.js`, and `.css` files.

## Exposed Ports
- `80`: Standard HTTP port.
