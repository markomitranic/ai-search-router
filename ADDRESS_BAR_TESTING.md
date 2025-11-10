# Address Bar Search Testing Guide

## What Changed

The extension now properly intercepts searches made from the Chrome address bar (omnibox).

### Technical Changes

**Previous Implementation:**
- Used `chrome.tabs.onUpdated` listener
- Only caught navigation after it happened
- Unreliable for address bar searches

**New Implementation:**
- Uses `chrome.webNavigation.onBeforeNavigate` listener
- Fires BEFORE navigation happens, allowing proper interception
- Reliably catches all address bar searches to supported search engines

## How to Test

### 1. Install/Reload the Extension

1. Open `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. If already installed: Click the **reload icon** on the extension card
4. If not installed: Click "Load unpacked" → Select `packages/extension/dist/`

### 2. Set Chrome's Default Search Engine

For the extension to intercept address bar searches, Chrome needs to route them through a search engine first.

**Option A: Use Google (recommended for testing)**
1. Go to `chrome://settings/searchEngines`
2. Make sure "Google" is set as the default search engine
3. This is usually the default

**Option B: Use any other supported engine**
- Bing
- DuckDuckGo
- Yahoo

### 3. Test Address Bar Searches

Open a new tab and type directly into the **address bar**:

#### Test AI Routing (should go to AI provider)

Type these queries in the address bar:
- `how do I fix a leaky faucet`
- `what is quantum computing`
- `why is the sky blue`
- `who invented the telephone`
- `explain python decorators`

**Expected:** Should redirect to your configured AI provider (default: Google AI Mode)

#### Test Traditional SERP Routing

Type these queries in the address bar:
- `weather`
- `reddit`
- `amazon`
- `python documentation`
- `youtube`

**Expected:** Should redirect to your configured SERP provider (default: Google)

### 4. Verify in Console

To see what's happening behind the scenes:

1. Go to `chrome://extensions/`
2. Click "service worker" under your extension
3. This opens the background script console
4. Perform searches and watch for logs:
   - `[AI Search Router] Intercepted search from address bar: <query>`
   - `[AI Search Router] Classification: ai` or `serp`
   - `[AI Search Router] Redirecting to: <url>`

## Common Issues

### Address Bar Searches Not Being Intercepted

**Symptom:** Searches go directly to Google/Bing without routing

**Fixes:**
1. Reload the extension (`chrome://extensions/` → reload icon)
2. Check that extension is enabled (toggle on)
3. Make sure you're searching from the address bar, not a search engine's own search box
4. Check console logs to see if interception is happening

### Redirect Loops

**Symptom:** Page keeps reloading or jumping between search engines

**Fixes:**
1. The extension has loop prevention built in
2. If it still happens, check console for errors
3. Try disabling and re-enabling the extension

### Not Working with Specific Search Engine

**Symptom:** Works with Google but not with DuckDuckGo (or vice versa)

**Current Limitations:**
- The extension only intercepts navigation to known search engines
- If you're using a custom/uncommon search engine as default, it may not be detected
- Supported: Google, Bing, DuckDuckGo, Yahoo, Kagi, Qwant

## Configuration

You can customize routing behavior in the extension settings:

1. Click the extension icon in the toolbar
2. Click "Options" (or right-click extension → Options)
3. Configure:
   - Enable/disable routing
   - Choose AI provider (Perplexity, ChatGPT, Google AI Mode, or custom)
   - Choose SERP provider (Google, Kagi, DuckDuckGo, Qwant, or custom)

## Advanced Testing

### Test Loop Prevention

1. Search for "how does this work" (AI query)
2. Should redirect to AI provider
3. Perform another search from that page
4. Should not create a redirect loop

### Test with Extension Disabled

1. Click extension icon → toggle "Enabled" off
2. Perform searches
3. Should go to Chrome's default search engine without interception

### Test Custom Providers

1. Go to extension options
2. Select "Custom" for AI provider
3. Enter: `https://duckduckgo.com/?q={query}`
4. Search for "what is AI" from address bar
5. Should redirect to DuckDuckGo

## Performance

The extension should:
- Add minimal latency (< 100ms)
- Not slow down regular browsing
- Only activate on search engine navigations
- Use efficient pattern matching (no heavy computation)

## Next Steps

If everything works:
- ✅ Address bar searches are being intercepted
- ✅ AI vs SERP classification is correct
- ✅ Redirects work without loops
- ✅ Custom providers can be configured

The extension is working correctly!

If something doesn't work, check the console logs and see the "Common Issues" section above.

