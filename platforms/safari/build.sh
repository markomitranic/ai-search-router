#!/bin/bash
set -e

echo "🍎 Building Safari Extension..."

# Navigate to repo root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Build the extension first (Chromium build)
echo ""
echo "📦 Building extension..."
cd "$ROOT_DIR"
pnpm build

# Check if extension was built
if [ ! -d "$ROOT_DIR/dist/chromium" ]; then
  echo "❌ Error: Extension not built. dist/chromium/ not found."
  exit 1
fi

# Xcode project paths
XCODE_PROJECT="$ROOT_DIR/platforms/safari/AI Search Router/AI Search Router.xcodeproj"
SCHEME="AI Search Router"
CONFIGURATION="Release"
BUILD_DIR="$ROOT_DIR/platforms/safari/build"

# Build using xcodebuild
echo ""
echo "🔨 Building Xcode project..."
xcodebuild \
  -project "$XCODE_PROJECT" \
  -scheme "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -derivedDataPath "$BUILD_DIR" \
  clean build

# Create output directory
OUTPUT_DIR="$ROOT_DIR/dist/safari"
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# Copy the built app
APP_PATH="$BUILD_DIR/Build/Products/$CONFIGURATION/AI Search Router.app"

if [ -d "$APP_PATH" ]; then
  echo ""
  echo "📋 Copying app to dist/safari/..."
  cp -R "$APP_PATH" "$OUTPUT_DIR/"
  
  echo ""
  echo "✨ Build complete!"
  echo ""
  echo "📦 Safari extension built to: dist/safari/AI Search Router.app"
  echo ""
  echo "Next steps:"
  echo "  1. Open the app: open dist/safari/AI\ Search\ Router.app"
  echo "  2. Enable the extension in Safari preferences"
  echo "  3. Go to Safari > Settings > Extensions"
  echo ""
else
  echo "❌ Error: Built app not found at $APP_PATH"
  exit 1
fi

