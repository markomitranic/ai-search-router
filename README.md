# AI Search Router

> ⚠️ **WARNING: AI-GENERATED DEMO CODE**
>
> This entire extension was AI-generated and is **unreviewed, unaudited slop code** created purely for demonstration purposes.
>
> **NO GUARANTEES:**
>
> - ❌ No guarantees about security
> - ❌ No guarantees about functionality
> - ❌ No support provided
> - ❌ Use entirely at your own risk
>
> **HOWEVER:**
>
> - ✅ 100% local code - no external APIs or libraries
> - ✅ No telemetry or analytics
> - ✅ No server backend
> - ✅ No AI calls during operation
> - ✅ Minimal browser performance impact (old-school pattern matching)
> - ✅ Developers cannot see anything you do - you're completely on your own
>
> This is provided as-is for educational/demo purposes only.

---

A browser extension that intelligently routes search queries to either AI-powered search engines or traditional search engines based on query classification.

## Overview

When you perform a search, the extension analyzes your query and automatically directs it to the most appropriate search engine:

- **AI Search** (e.g., Perplexity, ChatGPT, Google AI Mode) for questions requiring reasoning
- **Traditional Search** (e.g., Google, Kagi, DuckDuckGo) for factual lookups and navigation

## Features

- 🤖 **Intelligent Classification**: Automatically detects if your query is a question or a simple search
- 🔧 **Customizable Providers**: Choose your preferred AI and traditional search engines
- 🎯 **Custom URLs**: Add your own search provider URLs
- ⚡ **Fast & Lightweight**: Basic pattern matching for instant classification
- 🌐 **Cross-Platform**: Works on Chromium browsers (Chrome, Edge, Brave) and Safari (future)

## Install on Safari (macOS)

This build is not notarized (no paid Apple Developer account). macOS will warn that the app is from an unidentified developer. Follow these steps once to approve it.

1) Download
- Get the latest DMG from the GitHub Releases page (file name: `AI-Search-Router-Safari.dmg`).

2) Install the app
- Open the DMG and drag “AI Search Router” to Applications.
- Eject the DMG.

3) Approve first launch (Gatekeeper)
- In Applications, right‑click “AI Search Router.app” → Open → confirm.
- If blocked: System Settings → Privacy & Security → “Open Anyway” for AI Search Router.
- Optional (advanced): `xattr -dr com.apple.quarantine "/Applications/AI Search Router.app"`.

4) Enable the Safari extension
- Open Safari → Safari → Settings (⌘,) → Extensions.
- Enable “AI Search Router” and allow requested permissions (e.g., “Always Allow on Every Website”).

Notes
- Keep the app running for the extension to work. To auto-start: System Settings → General → Login Items → add the app.
- For detailed steps and troubleshooting, see `SAFARI_INSTALL.md`.

## Development

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

## How It Works

The extension uses simple pattern-based classification:

1. Checks if query contains W-words **anywhere** (who, what, where, when, why, how) - strong question indicators
2. Checks if query **starts with** question words (is, if, can, could, should, would, will, do, does, did)
3. Checks if query contains "?"
4. Checks if query contains "," or ";" (indicates complex/multi-part queries)
5. Checks for "but/and + question word" patterns (e.g., "but are they", "and does it")
6. Checks word count (>= 10 words indicates reasoning queries)

If any condition matches → route to AI search, otherwise → route to traditional search.

## Supported Browsers

- ✅ Safari
- ✅ Chrome/Chromium

## License

Unlicense (Public Domain) - See LICENSE file for details.
