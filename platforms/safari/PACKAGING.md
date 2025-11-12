# Safari Extension Packaging Guide

## ✅ Build Status

Your Safari extension has been successfully built! The app is located at:
```
platforms/safari/build/Build/Products/Debug/AI Search Router.app
```

## Quick Start - Test Locally

1. **Run the app:**
   ```bash
   open "platforms/safari/build/Build/Products/Debug/AI Search Router.app"
   ```

2. **Enable in Safari:**
   - Open Safari → Settings (⌘,)
   - Go to **Extensions** tab
   - Find **"AI Search Router"**
   - Check the box to enable
   - Click **"Always Allow on Every Website"**

3. **Test it:**
   - Search "how to learn python" → Should route to AI search
   - Search "weather" → Should route to traditional search

## Distribution Options

### Option 1: Share as ZIP (Easiest)

**Best for:** Personal use, testing, sharing with friends

```bash
# Run the packaging script
./platforms/safari/package-for-distribution.sh
```

This creates: `platforms/safari/AI-Search-Router-Safari.zip`

**Recipients need to:**
1. Unzip the file
2. Drag "AI Search Router.app" to Applications folder
3. Right-click → Open (first time only, to bypass Gatekeeper)
4. Enable extension in Safari settings

**Limitations:**
- ⚠️ Users will get "Untrusted Developer" warning
- Must use right-click → Open to bypass
- Not ideal for wide distribution

### Option 2: Create DMG (Better)

**Best for:** More polished distribution, GitHub releases

```bash
# Run the DMG creation script
./platforms/safari/create-dmg.sh
```

This creates: `platforms/safari/AI-Search-Router-Safari.dmg`

**Advantages:**
- Professional installer experience
- Drag-and-drop to Applications
- Smaller download size
- Standard macOS distribution format

**Still has same limitation:** Unsigned app warning

### Option 3: Signed Build (Requires Apple Developer Account)

**Best for:** Serious distribution, avoiding security warnings

**Requirements:**
- Apple Developer Account ($99/year)
- Developer ID Certificate

**Steps:**

1. **Get Developer Certificate:**
   - Sign up at [developer.apple.com](https://developer.apple.com)
   - Download "Developer ID Application" certificate
   - Install in Keychain

2. **Build with signing:**
   ```bash
   ./platforms/safari/build-signed.sh "YOUR_DEVELOPER_ID"
   ```

3. **Notarize with Apple:**
   ```bash
   ./platforms/safari/notarize.sh
   ```

4. **Result:** Users can install without warnings

### Option 4: App Store Distribution

**Best for:** Maximum reach, automatic updates

**Requirements:**
- Apple Developer Account ($99/year)
- App Store review approval
- More restrictive sandbox

**Steps:**
1. Open Xcode project
2. Configure app signing and capabilities
3. Archive the app (Product → Archive)
4. Submit to App Store Connect
5. Wait for review (1-3 days typically)

**Benefits:**
- Automatic updates
- No security warnings
- Wider audience reach
- Apple handles distribution

**Drawbacks:**
- $99/year cost
- App Store review process
- Stricter sandboxing rules
- 15-30% commission on paid apps (free apps = no commission)

## Rebuilding After Changes

Whenever you update the extension code:

```bash
# 1. Build the extension
pnpm --filter @ai-search-router/extension build

# 2. Rebuild Safari app
./platforms/safari/build-safari-extension.sh

# 3. Close and reopen the app
killall "AI Search Router"
open "platforms/safari/build/Build/Products/Debug/AI Search Router.app"
```

## File Sizes

- **Extension source:** ~11KB (TypeScript)
- **Built extension:** ~11KB (JavaScript)
- **Safari app:** ~764KB (includes macOS wrapper)
- **Zipped for distribution:** ~200KB

## Bundle Identifiers

- **App:** `com.aisearchrouter.AI-Search-Router`
- **Extension:** `com.aisearchrouter.AI-Search-Router.Extension`

These must match the pattern: Extension ID must start with App ID.

## Troubleshooting

### "Untrusted Developer" Warning

**For users installing your unsigned build:**

1. Go to **System Settings → Privacy & Security**
2. Scroll to **Security** section
3. Click **"Open Anyway"** next to AI Search Router warning
4. Or: Right-click app → Open (bypasses warning)

### Extension Not Appearing

- Make sure the app is running (check Dock/Menu Bar)
- Restart Safari
- Check Safari → Settings → Extensions

### Changes Not Reflecting

- Rebuild extension: `pnpm build`
- Rebuild Safari app
- Quit and relaunch the app
- Disable and re-enable extension in Safari

### Build Errors

```bash
# Clean build
rm -rf platforms/safari/build
./platforms/safari/build-safari-extension.sh
```

## Recommended Distribution Path

For open-source/free distribution:

1. **Phase 1 - Testing** (Current)
   - Share unsigned builds via GitHub releases
   - Include installation instructions
   - Users install via right-click → Open

2. **Phase 2 - Growing** (If popular)
   - Get Apple Developer Account ($99/year)
   - Sign and notarize builds
   - No more security warnings

3. **Phase 3 - Mature** (If widely used)
   - Submit to Mac App Store
   - Automatic updates
   - Maximum reach

## CI/CD Notes

For automated builds (GitHub Actions, etc.):

```yaml
# .github/workflows/build-safari.yml
- name: Build Safari Extension
  run: |
    pnpm install
    pnpm build
    ./platforms/safari/build-safari-extension.sh
    ./platforms/safari/package-for-distribution.sh
    
- name: Upload artifact
  uses: actions/upload-artifact@v3
  with:
    name: safari-extension
    path: platforms/safari/AI-Search-Router-Safari.zip
```

## Architecture Notes

The Safari "app" is just a thin wrapper around your web extension:

- **Shared code:** `packages/extension/` (TypeScript)
- **Safari wrapper:** Swift app that hosts the extension
- **95% shared** between Chrome and Safari versions
- Changes to `packages/extension/` automatically work in Safari

The app must stay running for the extension to work in Safari (macOS requirement).

## Support

For issues:
- Check Safari Console: Develop → Show Extension Builder
- Check app logs in Xcode
- File issues on GitHub

