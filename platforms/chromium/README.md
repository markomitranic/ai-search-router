# Chromium Platform Build

This directory contains the build configuration for Chromium-based browsers (Chrome, Edge, Brave, Opera).

## Building

From the repository root:

```bash
# Install dependencies first
pnpm install

# Build the extension
cd packages/extension
pnpm build
```

The extension will be built to `packages/extension/dist/`

## Loading in Browser

### Chrome / Chromium

1. Open `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `packages/extension/dist/` folder

### Microsoft Edge

1. Open `edge://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `packages/extension/dist/` folder

### Brave

1. Open `brave://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `packages/extension/dist/` folder

## Development

Watch mode for automatic rebuilds:

```bash
cd packages/extension
pnpm dev
```

Then reload the extension in your browser after changes.

## Distribution

To package for distribution:

1. Build in production mode: `pnpm build`
2. Zip the `dist/` folder
3. Upload to Chrome Web Store or other stores

## Notes

- Uses Manifest V3 (modern standard)
- Compatible with all Chromium-based browsers
- Shares the same codebase as Safari extension (WebExtensions API)

