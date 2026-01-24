# How-to: Self-Host Blazor PWA as Docker Container

This guide explains how to build and run the Blazor PWA Recording app as a Docker container for self-hosting on any server or local machine, with optional SSL support.

## Prerequisites

- Docker installed and running on your system.
- The Blazor PWA Recording source code cloned locally.
- (For SSL) SSL certificates (self-signed or from a CA like Let's Encrypt).
  This repo already includes dev certs at `src/cert.pem` and `src/key.pem`.

## 1. Build the Docker Image

Navigate to the project directory:

```bash
cd demos/blazor-pwa-recording/
```

Build the Docker image:

```bash
docker build -t blazor-pwa-recording .
```

This command:
- Uses the .NET 10 SDK to build and publish the Blazor app
- Creates a production-ready static site in the container
- Uses Nginx to serve the files with built-in SSL support (includes default self-signed certificates) with SSL support

## 2. Run the Container

### HTTP Only

Run the container, mapping port 80 inside the container to port 8080 on your host:

```bash
docker run -d -p 8080:80 --name blazor-pwa blazor-pwa-recording
```

### With SSL (HTTPS)

The container includes default self-signed SSL certificates for immediate HTTPS access. For production use, mount your own certificates.

Run the container with HTTPS support:

```bash
docker run -d \
  -p 8080:80 \
  -p 8443:443 \
  --name blazor-pwa \
  blazor-pwa-recording
```

To use the dev certs in this repo (generated under `src/`):

```bash
docker run -d \
  -p 8080:80 \
  -p 8443:443 \
  -v "$(pwd)/src/cert.pem:/etc/ssl/certs/cert.pem" \
  -v "$(pwd)/src/key.pem:/etc/ssl/private/key.pem" \
  --name blazor-pwa \
  blazor-pwa-recording
```

- `-p 8443:443`: Maps host port 8443 to container port 443 (HTTPS)
- `-v`: Mounts the local dev certs (overwrites the defaults)

## 3. Access the Application

- **HTTP**: `http://localhost:8080` (or your server IP/port)
- **HTTPS**: `https://localhost:8443` (or your server IP/port)

The Blazor PWA should load and be fully functional.

**Note**: The default HTTPS uses self-signed certificates, which will show a browser security warning. For production, use valid certificates.

## 4. Container Management

### Stop the Container

```bash
docker stop blazor-pwa
```

### Start the Container Again

```bash
docker start blazor-pwa
```

### Remove the Container

```bash
docker rm blazor-pwa
```

### View Logs

```bash
docker logs blazor-pwa
```

## 5. Updating the Application

To deploy updates:

1. Pull the latest source code changes
2. Rebuild the image (use a new tag to avoid conflicts):

```bash
docker build -t blazor-pwa-recording:v2 .
```

3. Stop and remove the old container:

```bash
docker stop blazor-pwa
docker rm blazor-pwa
```

4. Run the new container with your preferred SSL configuration

## 6. Troubleshooting

- **Port already in use**: Change the host port mapping, e.g., `-p 8081:80 -p 8444:443`
- **Permission denied**: Ensure Docker is running and you have permissions to run containers
- **Container won't start**: Check logs with `docker logs blazor-pwa` for error messages
- **SSL certificate errors**: Verify certificate paths and permissions
- **Browser shows "Not Secure"**: This is normal for self-signed certificates; click "Advanced" and "Proceed to localhost (unsafe)" for testing

## Related

- [Dockerfile Reference](../reference/docker-configuration.md)
- [Deploy to AWS EC2](deploy-to-aws-ec2.md)
- [Architecture Explanation](../explanation/container-deployment-strategy.md)
