#!/bin/bash

# Script to convert SVG icons to PNG format
# Requires imagemagick: brew install imagemagick

set -e

ICON_DIR="packages/extension/icons"

echo "Converting SVG icons to PNG..."

# Check if imagemagick is installed
if ! command -v convert &> /dev/null; then
    echo "⚠️  ImageMagick not found. Install with: brew install imagemagick"
    echo "Alternatively, manually convert the SVG files to PNG."
    exit 1
fi

# Convert icons
convert "$ICON_DIR/icon-16.svg" "$ICON_DIR/icon-16.png"
convert "$ICON_DIR/icon-48.svg" "$ICON_DIR/icon-48.png"
convert "$ICON_DIR/icon-128.svg" "$ICON_DIR/icon-128.png"

echo "✓ Icons converted successfully!"
echo ""
echo "Generated files:"
echo "  - $ICON_DIR/icon-16.png"
echo "  - $ICON_DIR/icon-48.png"
echo "  - $ICON_DIR/icon-128.png"

