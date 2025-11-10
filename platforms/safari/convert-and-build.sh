#!/bin/bash

# Safari Extension Converter Script
# Converts the Chrome extension to Safari format

set -e

echo "🍎 AI Search Router - Safari Extension Converter"
echo "================================================"
echo ""

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ Error: Xcode is not installed or not in PATH"
    echo ""
    echo "Please install Xcode from the App Store:"
    echo "https://apps.apple.com/app/xcode/id497799835"
    echo ""
    echo "After installation, run:"
    echo "  sudo xcodebuild -license accept"
    exit 1
fi

echo "✓ Xcode detected"
echo ""

# Get project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

echo "📦 Building extension..."
cd packages/extension
pnpm build
cd "$PROJECT_ROOT"
echo "✓ Extension built"
echo ""

# Remove old Safari project if it exists
SAFARI_DIR="platforms/safari"
if [ -d "$SAFARI_DIR/AI Search Router" ]; then
    echo "🗑️  Removing old Safari project..."
    rm -rf "$SAFARI_DIR/AI Search Router"
    rm -rf "$SAFARI_DIR/AI Search Router.xcodeproj"
    echo "✓ Cleaned up"
    echo ""
fi

echo "🔄 Converting to Safari extension..."
xcrun safari-web-extension-converter packages/extension/dist/ \
    --project-location "$SAFARI_DIR" \
    --app-name "AI Search Router" \
    --bundle-identifier "com.aisearchrouter.extension" \
    --macos-only \
    --no-open

echo ""
echo "✓ Conversion complete!"
echo ""

# Check if project was created
if [ ! -d "$SAFARI_DIR/AI Search Router.xcodeproj" ]; then
    echo "❌ Error: Xcode project was not created"
    exit 1
fi

echo "📝 Safari extension created at:"
echo "   $SAFARI_DIR/AI Search Router.xcodeproj"
echo ""
echo "🚀 Next steps:"
echo ""
echo "1. Open the Xcode project:"
echo "   open \"$SAFARI_DIR/AI Search Router.xcodeproj\""
echo ""
echo "2. In Xcode:"
echo "   - Select 'AI Search Router' scheme"
echo "   - Select 'My Mac' as destination"
echo "   - Click Run (▶️) or press Cmd+R"
echo ""
echo "3. Configure signing:"
echo "   - Select project → Target → Signing & Capabilities"
echo "   - Check 'Automatically manage signing'"
echo "   - Select your Apple ID from Team dropdown"
echo ""
echo "4. After the app launches:"
echo "   - Open Safari → Settings → Extensions"
echo "   - Enable 'AI Search Router'"
echo "   - Grant necessary permissions"
echo ""
echo "Opening Xcode project..."
open "$SAFARI_DIR/AI Search Router.xcodeproj"

echo ""
echo "✨ Done! Build and run in Xcode to install the extension."

