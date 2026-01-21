# Understanding the Container Deployment Strategy

This document explores why we use Docker with Nginx to host a Standalone Blazor WebAssembly (WASM) Progressive Web App (PWA).

## Why Containerize a Static Site?

While Blazor WASM produces static files that could be served from an S3 bucket or CDN, containerization offers several advantages for this specific demo project:

1. **Environmental Consistency**: By using Docker, we ensure that the .NET SDK version used to build the app and the Nginx version used to serve it are identical across development and production.
2. **Simplified Routing Logic**: Blazor WASM requires a fallback mechanism for Single Page Application (SPA) routing. Packaging this logic into a containerized `nginx.conf` makes the deployment "plug-and-play" on any platform that supports Docker (like EC2).
3. **PWA Optimization**: Serving the app via Nginx allows us to fine-tune `Cache-Control` headers and MIME types (specifically for `wasm` files) which are critical for smooth PWA installation and performance.

## Architecture Overview

The deployment follows a standard "Build-Ship-Run" workflow:

- **Build**: The `.NET SDK` stage performs AOT (Ahead-Of-Time) ready compilation (if configured) and tree-shaking to produce a set of static assets.
- **Ship**: The resulting assets are bundled with a custom Nginx image and stored in AWS ECR.
- **Run**: EC2 pulls the image and runs it. Nginx acts as the entry point, handling incoming HTTP requests and serving the Blazor runtime to the client browser.

## Trade-offs

- **Memory/CPU**: Running a container on EC2 has slightly more overhead than a pure static host, but it provides significantly more control over the server environment and headers.
- **Scaling**: This setup is vertically scalable on EC2 and could easily be migrated to ECS or Fargate if horizontal auto-scaling is required.
