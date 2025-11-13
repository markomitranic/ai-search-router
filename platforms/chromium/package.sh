#!/bin/bash
set -e

echo "📦 Packaging Chromium Extension..."

# Navigate to repo root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Build first
echo ""
echo "🔨 Building extension..."
cd "$ROOT_DIR"
pnpm build

# Check if extension was built
DIST_DIR="$ROOT_DIR/dist/chromium"
if [ ! -d "$DIST_DIR" ]; then
  echo "❌ Error: Extension not built. dist/chromium/ not found."
  exit 1
fi

OUTPUT_FILE="$ROOT_DIR/dist/ai-search-router-chromium.zip"

echo ""
echo "📦 Creating zip file..."
cd "$DIST_DIR"
zip -r "$OUTPUT_FILE" . -x "*.DS_Store" "*.map"

echo ""
echo "✨ Package complete!"
echo ""
echo "📦 Distribution file: dist/ai-search-router-chromium.zip"
echo ""
echo "Distribution options:"
echo "  1. Chrome Web Store: Upload the .zip file"
echo "  2. Direct distribution: Users can extract and load unpacked"
echo "  3. Enterprise: Create .crx with private key (not included)"
echo ""

