#!/bin/bash

# Configuration: Adjust these paths if your folder structure changes
DEMO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="$DEMO_ROOT/src"
PUBLISH_DIR="$SRC_DIR/bin/Release/net10.0/publish/wwwroot"

echo "🚀 Starting Publish and Run Process..."

# 1. Publish the app in Release mode
echo "📦 Publishing app from $SRC_DIR..."
dotnet publish "$SRC_DIR" -c Release

if [ $? -ne 0 ]; then
    echo "❌ Publish failed. Please check build errors."
    exit 1
fi

# 2. Run the server
# Get local IP for mobile access
LOCAL_IP=$(ip route get 1.1.1.1 2>/dev/null | awk '{print $7}' || hostname -I | awk '{print $1}')

echo "🌐 Starting server..."
echo "📂 Serving directory: $PUBLISH_DIR"
echo ""
echo "📱 To access on your mobile device (same WiFi):"
echo "   http://$LOCAL_IP:8080"
echo ""
echo "💻 Local access:"
echo "   http://localhost:8080"
echo ""

# --address 0.0.0.0 (or 'any') allows connections from other devices on the network
# --fallback-file is essential for Blazor WASM client-side routing
dotnet serve -d "$PUBLISH_DIR" -p 8080 -a any --fallback-file index.html
