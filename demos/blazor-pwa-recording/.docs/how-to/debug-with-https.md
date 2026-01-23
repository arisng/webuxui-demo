# How-to: Debug Blazor PWA with HTTPS

This guide explains how to run and debug the Blazor PWA Recording app with HTTPS enabled, including troubleshooting certificate issues that commonly occur in Linux/WSL environments.

## Prerequisites

- .NET 8+ SDK installed
- OpenSSL (for generating certificates)
- The Blazor PWA Recording source code

## Running with HTTPS

### Standard Development Run

Navigate to the source directory:

```bash
cd demos/blazor-pwa-recording/src
```

Run with the HTTPS launch profile:

```bash
dotnet run --launch-profile https
```

This should start the app on:
- HTTPS: `https://localhost:7017`
- HTTP: `http://localhost:5204`

## Troubleshooting HTTPS Certificate Issues

### Common Problem: Certificate Not Found (Linux/WSL)

**Symptoms:**
```
System.InvalidOperationException: Unable to configure HTTPS endpoint. No server certificate was specified, and the default developer certificate could not be found or is out of date.
```

**Root Cause:**
On Windows, ASP.NET Core development certificates integrate seamlessly with the system certificate store. On Linux/WSL, certificates are stored in a file-based store (`~/.dotnet/corefx/cryptography/x509stores/`) and may not be accessible or properly configured.

### Solution: Use File-Based Certificates

1. **Generate self-signed certificates:**

```bash
# In the src directory
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"
```

2. **Configure launch settings to use file certificates:**

Update `Properties/launchSettings.json` to include certificate environment variables:

```json
{
  "profiles": {
    "https": {
      "commandName": "Project",
      "applicationUrl": "https://0.0.0.0:7017;http://0.0.0.0:5204",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development",
        "ASPNETCORE_Kestrel__Certificates__Default__Path": "cert.pem",
        "ASPNETCORE_Kestrel__Certificates__Default__KeyPath": "key.pem"
      }
    }
  }
}
```

3. **Run the application:**

```bash
dotnet run --launch-profile https
```

### Alternative: Manual Certificate Trust (Advanced)

If you prefer to use the standard development certificates:

1. **Clean and regenerate dev certs:**

```bash
dotnet dev-certs https --clean
dotnet dev-certs https
```

2. **Export the certificate:**

```bash
dotnet dev-certs https --export-path ~/devcert.crt --format PEM
```

3. **Add to system trust store (requires sudo):**

```bash
sudo cp ~/devcert.crt /usr/local/share/ca-certificates/
sudo update-ca-certificates
```

## Browser Certificate Warnings

When using self-signed certificates, browsers will show security warnings. For development:

- Click "Advanced" → "Proceed to localhost (unsafe)"
- Or add a permanent exception for `https://localhost:7017`

## Platform Differences

| Platform | Certificate Handling | Solution |
|----------|---------------------|----------|
| Windows | Native certificate store integration | Standard `dotnet dev-certs https --trust` |
| macOS | Native certificate store integration | Standard `dotnet dev-certs https --trust` |
| Linux/WSL | File-based certificate store | Use file-based certificates (recommended) |

## Related

- [Self-Host as Docker Container](./self-host-docker.md) - Production SSL configuration
- [Docker & Nginx Configuration](../reference/docker-configuration.md) - SSL in containerized deployment</content>
<parameter name="filePath">/home/arisng/src/webuxui-demo/demos/blazor-pwa-recording/.docs/how-to/debug-with-https.md