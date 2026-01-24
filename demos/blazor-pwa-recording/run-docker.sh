#!/bin/bash

# Configuration: Adjust these paths if your folder structure changes
DEMO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Starting Docker Build and Run Process..."

# 1. Build the Docker image
echo "📦 Building Docker image from $DEMO_ROOT..."
docker build -t blazor-pwa-recording "$DEMO_ROOT"

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed. Please check build errors."
    exit 1
fi

# 2. Clean up existing container if running
if docker ps -q -f name=blazor-pwa | grep -q .; then
    echo "🧹 Stopping and removing existing container 'blazor-pwa'..."
    docker stop blazor-pwa
    docker rm blazor-pwa
fi

# 3. Run the container
echo "🐳 Starting Docker container..."
docker run -d \
    -p 8080:80 \
    -p 8443:443 \
    --name blazor-pwa \
    blazor-pwa-recording

if [ $? -ne 0 ]; then
    echo "❌ Failed to start Docker container."
    exit 1
fi

# 4. Get local IP for mobile access
LOCAL_IP=$(ip route get 1.1.1.1 2>/dev/null | awk '{print $7}' || hostname -I | awk '{print $1}')

echo "🌐 Docker container started successfully!"
echo ""
echo "📱 To access on your mobile device (same WiFi):"
echo "   HTTP:  http://$LOCAL_IP:8080"
echo "   HTTPS: https://$LOCAL_IP:8443 (accept SSL warning)"
echo ""
echo "💻 Local access:"
echo "   HTTP:  http://localhost:8080"
echo "   HTTPS: https://localhost:8443 (accept SSL warning)"
echo ""
echo "🔍 To check container status: docker ps"
echo "🛑 To stop the container: docker stop blazor-pwa"
echo ""

