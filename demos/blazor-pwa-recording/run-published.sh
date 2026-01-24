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

# 2. Run the server using dotnet-serve from the DEMO_ROOT
echo "🌐 Starting server on http://localhost:8080..."
echo "📂 Serving directory: $PUBLISH_DIR"

# --fallback-file is essential for Blazor WASM client-side routing
dotnet serve -d "$PUBLISH_DIR" -p 8080 --fallback-file index.html
