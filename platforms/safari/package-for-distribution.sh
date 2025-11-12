#!/bin/bash

# Package Safari Extension for Distribution (ZIP)
# Creates a distributable ZIP file of the Safari app

set -e

echo "📦 Packaging AI Search Router for Safari"
echo "========================================="
echo ""

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

APP_PATH="platforms/safari/build/Build/Products/Debug/AI Search Router.app"
OUTPUT_ZIP="platforms/safari/AI-Search-Router-Safari.zip"

# Check if app exists
if [ ! -d "$APP_PATH" ]; then
    echo "❌ App not found at: $APP_PATH"
    echo ""
    echo "Build it first:"
    echo "  ./platforms/safari/build-safari-extension.sh"
    exit 1
fi

# Get app version from manifest
VERSION=$(grep '"version"' packages/extension/dist/manifest.json | sed 's/.*"version": "\(.*\)".*/\1/')
echo "📋 Version: $VERSION"
echo ""

# Remove old zip if exists
if [ -f "$OUTPUT_ZIP" ]; then
    echo "🗑️  Removing old package..."
    rm "$OUTPUT_ZIP"
fi

# Create zip
echo "📦 Creating ZIP archive..."
cd "$PROJECT_ROOT/platforms/safari/build/Build/Products/Debug"
zip -r -q "$PROJECT_ROOT/$OUTPUT_ZIP" "AI Search Router.app"
cd "$PROJECT_ROOT"

# Get file size
SIZE=$(du -h "$OUTPUT_ZIP" | cut -f1)

echo "✅ Package created!"
echo ""
echo "📦 Output: $OUTPUT_ZIP"
echo "📊 Size: $SIZE"
echo ""
echo "📝 Installation instructions for users:"
echo ""
echo "1. Unzip the file"
echo "2. Drag 'AI Search Router.app' to Applications folder"
echo "3. Right-click the app → Open (first time only)"
echo "4. Enable in Safari → Settings → Extensions"
echo ""
echo "⚠️  Note: Users will see 'Untrusted Developer' warning"
echo "    This is normal for unsigned apps. They need to right-click → Open."
echo ""
echo "💡 To avoid warnings: Get Apple Developer account and sign the build"
echo ""

