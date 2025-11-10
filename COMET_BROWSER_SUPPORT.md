# Perplexity Comet Browser Support

## The Issue

Perplexity Comet browser uses **Perplexity AI as its default search engine**, not Google or traditional search engines. This means when you search from the address bar, it routes through Perplexity's infrastructure using a different URL pattern than our extension was originally designed to detect.

## What We've Added

### Updated URL Detection

The extension now detects these Perplexity patterns:
- `perplexity.ai/search` - Standard Perplexity search
- `perplexity.ai/?q=` - Comet browser format
- `www.perplexity.ai/?q=` - Comet with www prefix

### Debug Logging

Added special logging for Perplexity URLs to help diagnose routing issues.

## Testing in Comet Browser

### 1. Install the Extension

```bash
# Build the extension
cd packages/extension
pnpm build
```

Then in Comet:
1. Go to `chrome://extensions/` (or `comet://extensions/` if that exists)
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `packages/extension/dist/`

### 2. Open the Service Worker Console

This is critical for debugging:

1. Go to `chrome://extensions/`
2. Find "AI Search Router"
3. Click "service worker" or "background page" link
4. This opens the developer console for the extension

**Keep this console open** while testing!

### 3. Test Searches

In Comet's address bar, try these searches:

**AI queries (should stay in Perplexity or route to your AI provider):**
- `how does quantum computing work`
- `what is the meaning of life`
- `why is the sky blue`

**Traditional queries (should route to your SERP provider):**
- `weather`
- `reddit`
- `amazon`

### 4. Check the Console Logs

Watch the service worker console for these messages:

```
[AI Search Router] Detected Perplexity URL: <url>
[AI Search Router] Intercepted search from address bar: <query>
[AI Search Router] Classification: ai / serp
[AI Search Router] Redirecting to: <target-url>
```

## Troubleshooting

### Issue 1: Extension Does Nothing

**Symptom:** Searches in Comet go directly to Perplexity without any interception.

**Debug:**
1. Check the service worker console
2. Do you see "Detected Perplexity URL" messages?
   - **YES** → Extension is detecting the URLs but not intercepting them
   - **NO** → Comet is using a different URL pattern

**If NO (different URL pattern):**

The console should show what URLs Comet is actually using. Look for navigation events. Once you see the actual URL pattern, we can add it to the extension.

**Common Comet patterns to check:**
- Does it use a different domain? (e.g., `comet.perplexity.ai`)
- Does it use a different query parameter? (not `q=` but something else)
- Does it go through an API endpoint directly?

### Issue 2: Extension Redirects But Loops

**Symptom:** Page keeps reloading or redirecting repeatedly.

**Fix:**
- The extension has loop prevention built in
- If this happens, it means the target URL looks like a search URL too
- Check your configured providers in the extension options

### Issue 3: Need to See Raw URLs

**To see exactly what URL Comet uses:**

Add this temporary debugging code to see ALL navigations:

1. In the service worker console, you can manually log all navigations
2. Or ask me to add more verbose logging to the extension

## Changing Comet's Default Search Engine

**Option 1: Keep Perplexity** (and let extension route non-AI queries)
- This is what we're trying to support
- Extension should intercept and redirect traditional queries to your SERP provider

**Option 2: Change to Google** (if extension doesn't work yet)
- Open Comet settings
- Find "Search Engine" settings
- Change default from Perplexity to Google
- Now the extension will work like in Chrome

## Expected Behavior in Comet

### With Extension Working Correctly:

1. **AI queries** → Classified as "ai" → Routes to your configured AI provider
   - If you want these to stay in Perplexity, set Perplexity as your AI provider
   - Or route to ChatGPT, Google AI Mode, etc.

2. **Traditional queries** → Classified as "serp" → Routes to your SERP provider
   - Google, Kagi, DuckDuckGo, Qwant, or custom

### Smart Configuration for Comet Users:

Since Comet already uses Perplexity by default, you might want:

**Option A: Keep AI in Perplexity, route traditional to Google**
- AI Provider: Perplexity
- SERP Provider: Google (or your preference)
- Result: AI questions stay in Perplexity, simple searches go to Google

**Option B: Route everything elsewhere**
- AI Provider: ChatGPT / Google AI Mode
- SERP Provider: Kagi / DuckDuckGo
- Result: Extension intercepts everything from Perplexity and routes elsewhere

## Next Steps

1. **Test with debug logging** - Install the updated extension and check console logs
2. **Report URL patterns** - If you see "Detected Perplexity URL" messages, share them
3. **Share any errors** - If you see errors in the console, let me know

## URL Pattern Examples

If you see URLs like these in the console, share them so we can add support:

```
https://www.perplexity.ai/?q=test+query
https://www.perplexity.ai/search?q=test+query
https://comet.perplexity.ai/?q=test+query
https://api.perplexity.ai/search?q=test+query
```

Once we know the exact pattern Comet uses, we can ensure full compatibility!

## Manual Testing Commands

If you want to test URL detection manually in the service worker console:

```javascript
// Test if a URL would be detected
const testUrl = "https://www.perplexity.ai/?q=test";
console.log("Would intercept:", isSearchUrl(testUrl));

// Test query extraction
console.log("Extracted query:", extractQuery(testUrl));
```

Note: These functions might not be directly accessible depending on how the service worker is bundled.

---

**Current Status:** Extension updated with Perplexity URL detection. Needs testing in Comet to confirm the exact URL pattern being used.

