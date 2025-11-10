# Setup Guide

This guide will help you set up the AI Search Router project for development.

## Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0

Install pnpm if you haven't:
```bash
npm install -g pnpm
```

## Installation

1. Clone the repository (or you're already here)

2. Install dependencies:
   ```bash
   pnpm install
   ```

   This will install dependencies for all packages in the monorepo.

## Building

### Build All Packages

```bash
pnpm build
```

This builds both the core library and the extension.

### Build Individual Packages

```bash
# Build only core
cd packages/core
pnpm build

# Build only extension
cd packages/extension
pnpm build
```

## Development

### Watch Mode

For development with automatic rebuilds:

```bash
# Watch all packages
pnpm dev

# Or watch individual packages
cd packages/extension
pnpm dev
```

### Running Tests

```bash
# Test core library
cd packages/core
pnpm test
```

## Loading the Extension

### Chrome/Chromium/Edge/Brave

1. Build the extension:
   ```bash
   cd packages/extension
   pnpm build
   ```

2. Open your browser's extension page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`

3. Enable "Developer mode" (toggle in top right)

4. Click "Load unpacked"

5. Select the `packages/extension/dist/` folder

6. The extension should now be loaded and ready to use!

### Safari (Future)

Safari support requires Xcode. See `platforms/safari/README.md` for details.

## Project Structure

```
ai-search-router/
├── .cursor/rules/
│   └── projectrules.mdc    # Project documentation for AI assistants
├── packages/
│   ├── core/               # Classification library
│   │   ├── src/
│   │   │   ├── classifier.ts
│   │   │   ├── providers.ts
│   │   │   └── types.ts
│   │   └── package.json
│   └── extension/          # Browser extension
│       ├── src/
│       │   ├── background.ts
│       │   ├── popup/
│       │   └── options/
│       ├── manifest.json
│       └── package.json
├── platforms/
│   ├── chromium/          # Chromium-specific docs
│   └── safari/            # Safari-specific docs
└── package.json           # Root package.json
```

## Usage

Once loaded in your browser:

1. Click the extension icon to see the popup
2. Use the toggle to enable/disable routing
3. Click "Settings" to configure providers
4. Try searching - questions will go to AI, facts to traditional search!

## Configuration

The extension classifies queries using these rules:

- Starts with question words (who, what, where, when, why, how) → AI
- Contains "?" → AI
- Length > 30 characters → AI
- Everything else → Traditional SERP

You can customize which providers to use in the settings page.

## Troubleshooting

### Extension won't load

- Make sure you've run `pnpm build` first
- Check the browser console for errors
- Verify all dependencies are installed

### TypeScript errors

- Run `pnpm install` to ensure all type definitions are installed
- Try rebuilding: `pnpm clean && pnpm build`

### Changes not reflecting

- Reload the extension in `chrome://extensions/`
- For development, use watch mode: `pnpm dev`
- Hard refresh the browser page

## Next Steps

- Add proper icons to `packages/extension/icons/`
- Customize provider URLs in settings
- Test with various query types
- Report issues or suggest improvements

## License

MIT

