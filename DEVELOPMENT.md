# Development Guide

This guide covers development workflows, architecture decisions, and best practices for the AI Search Router project.

## Architecture Overview

### Monorepo Structure

The project uses **pnpm workspaces** for managing multiple packages:

```
packages/
├── core/          # Classification library (framework-agnostic)
└── extension/     # Browser extension (WebExtensions API)
```

**Benefits:**
- Shared code between packages via workspace dependencies
- Single source of truth for configuration
- Unified development workflow
- Easy cross-package refactoring

### Core Library (`@ai-search-router/core`)

**Purpose:** Framework-agnostic TypeScript library for query classification and provider management.

**Design Principles:**
- No browser APIs (can be used anywhere)
- Pure functions for easy testing
- Fast execution (< 1ms per classification)
- Zero dependencies

**Key Files:**
- `classifier.ts` - Pattern-based classification logic
- `providers.ts` - Provider configurations and URL formatting
- `types.ts` - TypeScript interfaces and types
- `index.ts` - Public API exports

### Extension Package (`@ai-search-router/extension`)

**Purpose:** Browser extension using WebExtensions API (compatible with Chromium and Safari).

**Design Principles:**
- Manifest V3 (modern standard)
- Service worker pattern (no background page)
- Minimal permissions required
- Privacy-focused (no tracking, all local)

**Key Components:**

1. **Background Service Worker** (`background.ts`)
   - Listens for navigation events
   - Intercepts search queries
   - Routes to appropriate provider
   - Manages user preferences

2. **Popup UI** (`popup/`)
   - Quick enable/disable toggle
   - Current provider display
   - Link to settings

3. **Options Page** (`options/`)
   - Provider selection
   - Custom URL configuration
   - Test classification feature
   - Settings persistence

## Development Workflows

### Setting Up

```bash
# Clone and install
git clone <repo>
cd ai-search-router
pnpm install

# Build everything
pnpm build
```

### Active Development

```bash
# Terminal 1: Watch core library
cd packages/core
pnpm dev

# Terminal 2: Watch extension
cd packages/extension
pnpm dev
```

Changes will automatically rebuild. Reload the extension in `chrome://extensions/` to see updates.

### Testing

```bash
# Run core tests
cd packages/core
pnpm test

# Watch tests
pnpm test --watch
```

**Test Coverage:**
- Classification patterns
- Provider URL formatting
- Edge cases (empty, special chars, very long queries)
- Performance benchmarks

### Building for Production

```bash
# Build all packages
pnpm build

# Package extension for distribution
./scripts/package-extension.sh
```

## Classification Algorithm

### Current Implementation

**Basic Pattern Matching** - Fast, deterministic, no ML/API required:

```typescript
// Routes to AI if ANY of these match:
1. Starts with question words (who, what, where, when, why, how)
2. Contains "?"
3. Length > 30 characters
```

**Performance Target:** < 1ms per classification

**Why Basic Patterns?**
- Instant classification (no network calls)
- Privacy-preserving (no data sent anywhere)
- Easy to understand and debug
- Good enough for most queries

### Future Enhancements

Potential improvements (while maintaining speed):

1. **Intent Scoring** - Weighted rules with configurable threshold
2. **Keyword Detection** - Specific trigger words (explain, compare, calculate)
3. **Pattern Learning** - User correction feedback (store preferences)
4. **Regex Patterns** - More sophisticated matching

**NOT Planned:**
- ML models (too slow for realtime)
- API calls (privacy concerns)
- User tracking (against principles)

## Browser Extension Details

### Manifest V3

We use Manifest V3 for future-proofing and modern capabilities:

**Key Differences from V2:**
- Service workers instead of background pages
- Promises instead of callbacks
- Stricter CSP (Content Security Policy)
- Better resource management

### Permissions

**Required:**
- `storage` - Save user preferences
- `tabs` - Access tab URLs for routing
- `webNavigation` - Intercept searches

**Host Permissions:**
- Major search engines (for interception)
- User-configured custom URLs

### Storage

Uses `chrome.storage.sync` for preferences:

```typescript
interface UserPreferences {
  enabled: boolean;
  aiProvider: string;
  serpProvider: string;
  customAiUrl?: string;
  customSerpUrl?: string;
}
```

**Sync Benefits:**
- Automatic backup
- Works across devices (if user signed in)
- Quota: 100KB (plenty for our needs)

## Adding New Features

### New Classification Rule

1. Edit `packages/core/src/classifier.ts`
2. Add test cases
3. Verify performance stays < 1ms
4. Update docs

### New Provider

1. Add to `AI_PROVIDERS` or `SERP_PROVIDERS` in `providers.ts`
2. Include URL template with `{query}` placeholder
3. Add test case
4. Update UI dropdown

### UI Changes

1. Maintain consistency with existing design
2. Test responsiveness
3. Update CSS with proper naming
4. Test in different browsers

## Code Style

### TypeScript

- Strict mode enabled
- Explicit return types on public functions
- No `any` types
- Prefer interfaces for objects

### Naming

- Files: `kebab-case.ts`
- Classes/Interfaces: `PascalCase`
- Functions/Variables: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`

### Comments

- JSDoc for public APIs
- Inline comments for complex logic
- Examples in documentation

## Performance

### Targets

- Classification: < 1ms
- Extension load: < 100ms
- UI interaction: < 50ms

### Monitoring

```typescript
// Performance test in classifier.test.ts
const start = performance.now();
classifyQuery(query);
const end = performance.now();
assert(end - start < 1);
```

## Debugging

### Core Library

```bash
# Run tests with verbose output
cd packages/core
pnpm test -- --verbose

# Check specific test
node --test dist/classifier.test.js
```

### Extension

1. Open `chrome://extensions/`
2. Click "Inspect views: service worker"
3. Check console for errors
4. Use `chrome.storage` API in console

**Common Issues:**
- Service worker not starting: Check manifest syntax
- Storage not persisting: Check permissions
- Classification wrong: Test in core library first

## Safari Support

### Current Status

⏳ Not yet implemented (requires Xcode)

### Implementation Plan

1. Build extension: `pnpm build`
2. Convert: `xcrun safari-web-extension-converter dist/`
3. Open Xcode project
4. Configure signing
5. Test on macOS

**Code Compatibility:**
- WebExtensions API is shared
- Minor adjustments may be needed
- Test all features in Safari

## CI/CD (Future)

Planned automation:

- Run tests on PR
- Build and package releases
- Deploy to Chrome Web Store
- Automated versioning

## Resources

- [WebExtensions API Docs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration](https://developer.chrome.com/docs/extensions/migrating/)
- [Safari Extensions](https://developer.apple.com/documentation/safariservices/safari_web_extensions)

## Questions?

Open an issue or check existing documentation:
- Architecture: `.cursor/rules/projectrules.mdc`
- Setup: `SETUP.md`
- Contributing: `CONTRIBUTING.md`

