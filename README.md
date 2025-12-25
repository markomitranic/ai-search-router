# AI Search Router

![AI Search Router Demo](ai-search-router.gif)

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

![AI Search Router Settings](screenshot.png)

## Features

- 🤖 **Intelligent Classification**: Automatically detects if your query is a question or a simple search
- 🔧 **Customizable Providers**: Choose your preferred AI and traditional search engines
- 🎯 **Custom URLs**: Add your own search provider URLs
- ⚡ **Fast & Lightweight**: Instant local classification and redirect
- 🚀 **Near-Zero Latency**: Uses custom search provider approach - no interception delays

## Installation

### Chromium Browsers (Chrome, Edge, Brave)

1. Download and install the extension from the releases page (or build from source)
2. Open the extension settings page
3. Follow the setup guide to register the extension as a custom search provider
4. Set it as your default search engine (optional)

## Development

### Setup

```bash
# Install dependencies (using Bun)
bun install

# Build extension (outputs to dist/chromium/)
bun run build

# Watch mode for development
bun run dev
```

The built extension will be in `dist/chromium/` - you can load this directly as an unpacked extension in Chrome.

## How It Works

The extension uses simple pattern-based classification:

1. Checks if query contains W-words **anywhere** (who, what, where, when, why, how) - strong question indicators
2. Checks if query **starts with** question words (is, if, can, could, should, would, will, do, does, did)
3. Checks if query contains "?"
4. Checks if query contains "," or ";" (indicates complex/multi-part queries)
5. Checks for "but/and + question word" patterns (e.g., "but are they", "and does it")
6. Checks word count (>= 10 words indicates reasoning queries)

If any condition matches → route to AI search, otherwise → route to traditional search.

## License

Unlicense (Public Domain) - See LICENSE file for details.
