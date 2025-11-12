#!/bin/bash

# Safari Extension Builder
# Builds and packages the AI Search Router for Safari

set -e

echo "🍎 Building AI Search Router for Safari"
echo "========================================"
echo ""

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

# Step 1: Build the extension
echo "📦 Building extension..."
pnpm --filter @ai-search-router/extension build
echo "✓ Extension built"
echo ""

# Step 2: Build the Safari app
XCODE_PROJECT="platforms/safari/AI Search Router/AI Search Router.xcodeproj"

if [ ! -d "$XCODE_PROJECT" ]; then
    echo "❌ Xcode project not found. Run convert-and-build.sh first."
    exit 1
fi

echo "🔨 Building Safari app with Xcode..."
echo ""

# Build for running locally (Debug)
xcodebuild -project "$XCODE_PROJECT" \
    -scheme "AI Search Router" \
    -configuration Debug \
    -derivedDataPath "platforms/safari/build" \
    CODE_SIGN_IDENTITY="-" \
    CODE_SIGNING_REQUIRED=NO \
    CODE_SIGNING_ALLOWED=NO

echo ""
echo "✅ Build complete!"
echo ""
echo "📍 Built app location:"
echo "   platforms/safari/build/Build/Products/Debug/AI Search Router.app"
echo ""
echo "🚀 Next steps:"
echo ""
echo "Option 1 - Test locally:"
echo "  open 'platforms/safari/build/Build/Products/Debug/AI Search Router.app'"
echo "  Then enable the extension in Safari → Settings → Extensions"
echo ""
echo "Option 2 - Build with Xcode GUI for proper signing:"
echo "  open '$XCODE_PROJECT'"
echo "  Then build and run in Xcode (Cmd+R)"
echo ""

