# Blazor PWA Recording Documentation

Welcome to the documentation for the Blazor PWA Recording demo. This documentation is organized into four sections based on the [Diátaxis framework](https://diataxis.fr/).

## [Tutorials](./tutorials/)
Learning-oriented lessons to get you started.
- [Your first recording](./tutorials/getting-started/your-first-recording.md) - A step-by-step guide to your first offline voice memo.

## [How-to Guides](./how-to/)
Practical steps to help you achieve specific tasks.
- [Publish and run locally](./how-to/deploy/how-to-publish-and-run-locally.md) - How to build and test the production-ready app.
- [Chrome Port Forwarding](./how-to/deploy/how-to-use-chrome-port-forwarding.md) - Testing PWA features on Android without HTTPS.
- [Install the PWA](./how-to/how-to-install-pwa.md) - Understanding and configuring app installation.
- [Debug with HTTPS](./how-to/debug-with-https.md) - Running and debugging with SSL certificates.
- [Deploy to AWS EC2 via ECR](./how-to/deploy/deploy-to-aws-ec2.md) - Step-by-step container deployment.

## [Reference](./reference/)
Technical descriptions of the machinery and configuration.
- [Docker & Nginx Configuration](./reference/docker-configuration.md) - Details on the `Dockerfile` and `nginx.conf`.

## [Explanation](./explanation/)
Conceptual understanding of the project's architecture and decisions.
- [About Offline Architecture](./explanation/about-offline-architecture.md) - Details on how IndexedDB and Service Workers work together.
- [Container Deployment Strategy](./explanation/container-deployment-strategy.md) - Why we use Docker for a static WASM app.
