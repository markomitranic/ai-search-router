#!/bin/bash

# Script to package the extension for distribution

set -e

echo "📦 Packaging AI Search Router Extension..."

# Build the extension
echo "Building extension..."
cd packages/extension
pnpm build

# Create zip file
DIST_DIR="dist"
OUTPUT_FILE="../../ai-search-router-extension.zip"

echo "Creating zip file..."
cd "$DIST_DIR"
zip -r "$OUTPUT_FILE" . -x "*.map" "*.DS_Store"
cd ../../..

echo ""
echo "✓ Extension packaged successfully!"
echo ""
echo "Output: ai-search-router-extension.zip"
echo ""
echo "Next steps:"
echo "  1. Test the extension by loading it unpacked"
echo "  2. Upload to Chrome Web Store"
echo "  3. Submit for review"

