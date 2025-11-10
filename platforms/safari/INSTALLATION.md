# Safari Extension - Installation Guide

## For Mac Users (Personal Testing)

### Prerequisites

1. **macOS** 10.14 or later
2. **Xcode** installed from App Store
3. **Safari** 14 or later

### Quick Start

Once you have Xcode installed, run this from the project root:

```bash
./platforms/safari/convert-and-build.sh
```

This will:
1. Build the extension
2. Convert it to Safari format
3. Open the Xcode project
4. You can then build and run to install on your Mac

## Manual Installation Steps

If you prefer to do it manually:

### 1. Install Xcode

```bash
# Open App Store and install Xcode
# Or download from: https://developer.apple.com/xcode/

# After installation, accept the license:
sudo xcodebuild -license accept
```

### 2. Build the Extension

```bash
cd /Users/markomitranic/Sites/ai-search-router
pnpm build
```

### 3. Convert to Safari

```bash
# From project root
xcrun safari-web-extension-converter packages/extension/dist/ \
  --project-location platforms/safari/ \
  --app-name "AI Search Router" \
  --bundle-identifier com.aisearchrouter.extension \
  --macos-only
```

This creates:
- `platforms/safari/AI Search Router/` - Xcode project
- `platforms/safari/AI Search Router.xcodeproj` - Project file

### 4. Open in Xcode

```bash
open "platforms/safari/AI Search Router.xcodeproj"
```

### 5. Configure Signing

In Xcode:
1. Select the project in the navigator (left sidebar)
2. Select the **"AI Search Router"** target
3. Go to **"Signing & Capabilities"** tab
4. Check **"Automatically manage signing"**
5. Select your **Apple ID** from the Team dropdown
   - If you don't have one added: Xcode → Settings → Accounts → Add your Apple ID

### 6. Build and Run

1. Select **"AI Search Router"** scheme and **"My Mac"** as destination
2. Click the **Play** button (▶️) or press `Cmd+R`
3. The app will build and launch
4. **First time only:** Safari will ask you to enable the extension

### 7. Enable in Safari

After the app launches:

1. Open Safari
2. Go to **Safari → Settings** (Cmd+,)
3. Click **Extensions** tab
4. Find **"AI Search Router"**
5. Check the box to **enable** it
6. Click **"Always Allow on Every Website"** (for search interception)

## Testing

Try these searches in Safari's address bar:

**Questions (→ AI):**
- "how to learn programming"
- "what is quantum computing"
- "explain machine learning"

**Facts (→ SERP):**
- "weather"
- "reddit"
- "amazon"

## Troubleshooting

### Extension Not Appearing in Safari

- Make sure the app is running (you'll see it in the menu bar or Dock)
- Restart Safari
- Check Safari → Settings → Extensions

### "Untrusted Developer" Warning

If you get a warning about an untrusted developer:
1. Go to **System Settings → Privacy & Security**
2. Scroll down to **Security** section
3. Click **"Open Anyway"** next to the warning about AI Search Router

### Extension Not Intercepting Searches

- Check that it's enabled in Safari Settings → Extensions
- Make sure you clicked "Always Allow on Every Website"
- Check the app's console logs (in Xcode)

### Rebuild After Code Changes

```bash
# 1. Make your changes
# 2. Rebuild extension
pnpm build

# 3. In Xcode, clean and rebuild
# Product → Clean Build Folder (Shift+Cmd+K)
# Product → Build (Cmd+B)

# 4. Run again (Cmd+R)
```

## Keeping the App Running

The macOS app needs to stay running for the Safari extension to work. You can:

1. **Keep it in the Dock** - Right-click app icon → Options → Keep in Dock
2. **Launch at Login** - System Settings → General → Login Items → Add the app
3. **Hide the window** - Cmd+H to hide, but keep running

## Distribution to Others

Since you're not publishing to the App Store:

### Option 1: Share Xcode Project

1. Commit the Xcode project to GitHub
2. Users clone and build it themselves
3. They need their own Apple ID for signing

### Option 2: Export Signed App (Requires Developer Account)

If you have a paid Apple Developer account ($99/year):
1. Archive the app in Xcode
2. Export with Developer ID signature
3. Others can download and run it
4. Must notarize with Apple first

### Option 3: Unsigned Build (Not Recommended)

Users can build unsigned, but they'll need to:
1. Disable Gatekeeper temporarily
2. Manually approve in System Settings
3. Not ideal for distribution

**Recommendation:** Option 1 (users build themselves) is best for open-source distribution.

## Notes

- Safari extension = Chrome extension code + macOS app wrapper
- The app is tiny (just a container for the extension)
- All the logic is in the shared extension code
- You can customize the app icon later in Xcode

## Quick Reference

```bash
# Build extension
pnpm build

# Convert to Safari
xcrun safari-web-extension-converter packages/extension/dist/ \
  --project-location platforms/safari/ \
  --app-name "AI Search Router" \
  --bundle-identifier com.aisearchrouter.extension \
  --macos-only

# Open project
open "platforms/safari/AI Search Router.xcodeproj"

# Then build and run in Xcode (Cmd+R)
```

