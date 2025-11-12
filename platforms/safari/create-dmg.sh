#!/bin/bash

# Create DMG for Safari Extension Distribution
# Creates a professional DMG installer with drag-to-Applications

set -e

echo "💿 Creating DMG for AI Search Router"
echo "===================================="
echo ""

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

APP_PATH="platforms/safari/build/Build/Products/Debug/AI Search Router.app"
OUTPUT_DMG="platforms/safari/AI-Search-Router-Safari.dmg"
TEMP_DMG="platforms/safari/temp.dmg"
VOLUME_NAME="AI Search Router"

# Check if app exists
if [ ! -d "$APP_PATH" ]; then
    echo "❌ App not found at: $APP_PATH"
    echo ""
    echo "Build it first:"
    echo "  ./platforms/safari/build-safari-extension.sh"
    exit 1
fi

# Get app version
VERSION=$(grep '"version"' packages/extension/dist/manifest.json | sed 's/.*"version": "\(.*\)".*/\1/')
echo "📋 Version: $VERSION"
echo ""

# Remove old DMG if exists
if [ -f "$OUTPUT_DMG" ]; then
    echo "🗑️  Removing old DMG..."
    rm "$OUTPUT_DMG"
fi

if [ -f "$TEMP_DMG" ]; then
    rm "$TEMP_DMG"
fi

# Create temporary DMG
echo "💿 Creating DMG..."
hdiutil create -srcfolder "$APP_PATH" \
    -volname "$VOLUME_NAME" \
    -fs HFS+ \
    -fsargs "-c c=64,a=16,e=16" \
    -format UDRW \
    "$TEMP_DMG"

# Mount the DMG
echo "📂 Mounting DMG..."
MOUNT_DIR=$(hdiutil attach -readwrite -noverify "$TEMP_DMG" | tail -1 | sed 's/.*\t//')

# Create Applications symlink
echo "🔗 Creating Applications symlink..."
ln -s /Applications "$MOUNT_DIR/Applications"

# Optional: Add background image, icons, etc.
# (Requires image assets)

# Unmount
echo "⏏️  Unmounting..."
hdiutil detach "$MOUNT_DIR"

# Convert to compressed, read-only
echo "🗜️  Compressing..."
hdiutil convert "$TEMP_DMG" \
    -format UDZO \
    -imagekey zlib-level=9 \
    -o "$OUTPUT_DMG"

# Clean up temp
rm "$TEMP_DMG"

# Get file size
SIZE=$(du -h "$OUTPUT_DMG" | cut -f1)

echo ""
echo "✅ DMG created!"
echo ""
echo "💿 Output: $OUTPUT_DMG"
echo "📊 Size: $SIZE"
echo ""
echo "📝 Installation instructions for users:"
echo ""
echo "1. Open the DMG file"
echo "2. Drag 'AI Search Router' to Applications folder"
echo "3. Eject the DMG"
echo "4. Open Applications → AI Search Router (right-click → Open first time)"
echo "5. Enable in Safari → Settings → Extensions"
echo ""
echo "⚠️  Note: Users will see 'Untrusted Developer' warning"
echo "    They need to right-click → Open the first time."
echo ""

