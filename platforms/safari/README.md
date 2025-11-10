# Safari Platform

This directory will contain the Safari extension wrapper (requires Xcode).

## Prerequisites

- macOS
- Xcode installed
- Command Line Tools installed

## Converting from Chromium Extension

Safari supports the WebExtensions API (same as Chrome), so our extension code can be reused with minimal changes.

### Conversion Steps

1. Build the extension:
   ```bash
   cd packages/extension
   pnpm build
   ```

2. Use Safari's converter tool:
   ```bash
   xcrun safari-web-extension-converter packages/extension/dist/ --app-name "AI Search Router"
   ```

3. This will create:
   - A macOS app wrapper (required by Safari)
   - An Xcode project
   - The extension embedded in the app

4. Open the generated Xcode project

5. Configure signing & capabilities in Xcode

6. Build and run to test

## Distribution

To distribute the Safari extension:

1. Complete the Xcode project setup
2. Configure App Store Connect
3. Archive the app
4. Submit to App Store for review

## Differences from Chromium

The extension code is shared (WebExtensions API), but Safari requires:

- Native macOS app wrapper
- Xcode for building
- App Store for distribution
- Different signing/notarization process

## Current Status

⏳ **Not yet implemented** - Waiting for Xcode availability

The shared extension code in `packages/extension/` is designed to work with both Chromium and Safari, so minimal changes will be needed when implementing Safari support.

## Resources

- [Safari Extensions Documentation](https://developer.apple.com/documentation/safariservices/safari_web_extensions)
- [Converting a Web Extension for Safari](https://developer.apple.com/documentation/safariservices/safari_web_extensions/converting_a_web_extension_for_safari)
- [WebExtensions API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)

