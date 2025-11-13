#!/bin/bash
set -e

echo "📦 Packaging Safari Extension..."

# Navigate to repo root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Build first
echo ""
echo "🔨 Building Safari extension..."
cd "$ROOT_DIR"
pnpm build:safari

# Check if app was built
APP_PATH="$ROOT_DIR/dist/safari/AI Search Router.app"
if [ ! -d "$APP_PATH" ]; then
  echo "❌ Error: Safari app not built. dist/safari/AI Search Router.app not found."
  exit 1
fi

OUTPUT_FILE="$ROOT_DIR/dist/ai-search-router-safari.dmg"

echo ""
echo "📦 Creating DMG installer..."

# Remove old DMG if exists
rm -f "$OUTPUT_FILE"

# Create temporary folder for DMG contents
TMP_DIR=$(mktemp -d)
cp -R "$APP_PATH" "$TMP_DIR/"

# Create DMG
# Using hdiutil (built into macOS)
hdiutil create -volname "AI Search Router" \
  -srcfolder "$TMP_DIR" \
  -ov -format UDZO \
  "$OUTPUT_FILE"

# Cleanup
rm -rf "$TMP_DIR"

echo ""
echo "✨ Package complete!"
echo ""
echo "📦 Distribution file: dist/ai-search-router-safari.dmg"
echo ""
echo "Distribution options:"
echo "  1. Direct distribution: Share the .dmg file"
echo "     - Users: Open DMG → Drag app to Applications → Run app → Enable in Safari"
echo "  2. Mac App Store: Archive in Xcode → Upload to App Store Connect"
echo "     - Requires: Apple Developer Program membership"
echo "     - Command: open 'platforms/safari/AI Search Router/AI Search Router.xcodeproj'"
echo ""
echo "⚠️  For distribution outside App Store, you should notarize the app:"
echo "  xcrun notarytool submit dist/ai-search-router-safari.dmg --keychain-profile \"YOUR_PROFILE\" --wait"
echo ""

