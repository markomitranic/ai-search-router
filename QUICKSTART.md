# Quick Start

Get up and running in 3 steps:

## 1. Install

```bash
pnpm install
```

## 2. Build

```bash
pnpm build
```

## 3. Load Extension

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `packages/extension/dist/`

**Done!** 🎉

## Next Steps

- Click the extension icon to see the popup
- Open settings to configure your preferred search providers
- Try searching - questions go to AI, everything else to traditional search

## Development

```bash
# Watch mode for auto-rebuild
pnpm dev

# Run tests
cd packages/core && pnpm test
```

## Documentation

- Full setup guide: [SETUP.md](./SETUP.md)
- Project architecture: [.cursor/rules/projectrules.mdc](.cursor/rules/projectrules.mdc)
- Main README: [README.md](./README.md)

