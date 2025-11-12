# Safari Extension Release Checklist

## ✅ Pre-Release Testing

- [ ] Test in Safari with various query types
- [ ] Verify AI routing works (questions → AI search)
- [ ] Verify traditional routing works (facts → Google)
- [ ] Test extension popup UI
- [ ] Test extension settings page
- [ ] Test provider switching (Perplexity, ChatGPT, Google AI)
- [ ] Test custom URL configuration
- [ ] Verify it works after Safari restart
- [ ] Verify it works after Mac restart

## 📦 Build Release Packages

```bash
# 1. Build latest version
pnpm build

# 2. Build Safari app
./platforms/safari/build-safari-extension.sh

# 3. Create distribution packages
./platforms/safari/package-for-distribution.sh
./platforms/safari/create-dmg.sh
```

## 📤 GitHub Release Steps

1. **Create Git Tag**
   ```bash
   git tag -a v0.1.0 -m "Release v0.1.0 - Initial Safari support"
   git push origin v0.1.0
   ```

2. **Create GitHub Release**
   - Go to: https://github.com/YOUR-USERNAME/ai-search-router/releases/new
   - Tag: `v0.1.0`
   - Title: `v0.1.0 - Safari Extension Support`
   - Description: (see template below)

3. **Upload Assets**
   - Upload: `platforms/safari/AI-Search-Router-Safari.zip`
   - Upload: `platforms/safari/AI-Search-Router-Safari.dmg`
   - Upload: `SAFARI_INSTALL.md` (as documentation)

4. **Link Installation Instructions**
   - Update README.md with Safari installation section
   - Link to SAFARI_INSTALL.md

## 📝 Release Description Template

```markdown
# AI Search Router v0.1.0 - Safari Extension

🎉 First release with Safari support!

## What's New

- ✅ Safari extension for macOS
- 🤖 Intelligent query routing (AI vs traditional search)
- ⚙️ Configurable providers (Perplexity, ChatGPT, Google AI Mode, etc.)
- 🎨 Modern popup and settings UI
- 🔒 Privacy-first (all classification happens locally)

## Downloads

### Safari Extension (macOS)

Choose one:
- **[AI-Search-Router-Safari.dmg](link)** (348K) - Recommended
- **[AI-Search-Router-Safari.zip](link)** (348K) - Alternative

📖 **[Installation Instructions](SAFARI_INSTALL.md)**

⚠️ **First-time users:** Right-click the app → Open to bypass "Untrusted Developer" warning (this is normal for unsigned apps)

### Chrome Extension

Available at: `platforms/chromium/` (load unpacked extension)

## How It Works

The extension automatically routes your searches:

**Questions → AI Search**
- "how to learn programming" → Perplexity/ChatGPT/Google AI
- "what is quantum computing" → AI-powered answer
- "explain machine learning" → Detailed AI explanation

**Facts/Navigation → Traditional Search**  
- "weather" → Google
- "reddit" → Google
- "amazon" → Google

## Features

- ⚡ Fast classification (< 1ms, no API calls)
- 🎛️ Choose your preferred AI provider
- 🔍 Choose your preferred search engine
- 🌐 Custom search URLs supported
- 🔒 100% local processing, no tracking
- 🎨 Clean, modern UI

## Requirements

- macOS 10.14 or later
- Safari 14 or later
- No Apple Developer account needed (unsigned, safe to use)

## Support

- 📖 [Documentation](README.md)
- 🐛 [Report Issues](issues)
- 💬 [Discussions](discussions)

## What's Next

- [ ] Additional AI providers
- [ ] Enhanced classification rules
- [ ] Keyboard shortcuts
- [ ] Statistics dashboard
- [ ] Firefox support

---

**Star ⭐ the repo if you find this useful!**
```

## 📊 Version Bump (for next release)

Remember to update version in:
- [ ] `packages/extension/manifest.json`
- [ ] `packages/core/package.json`
- [ ] `packages/extension/package.json`
- [ ] Root `package.json`

## 🔄 Rebuild After Version Bump

```bash
pnpm build
./platforms/safari/build-safari-extension.sh
./platforms/safari/package-for-distribution.sh
./platforms/safari/create-dmg.sh
```

## 📢 Announcement Channels

After release:
- [ ] Update README.md with Safari install instructions
- [ ] Tweet/post on social media
- [ ] Share in relevant communities (r/safari, r/productivity, etc.)
- [ ] Add to browser extension directories (if applicable)
- [ ] Update project documentation

## 🔐 Optional: Code Signing (Future)

If you get Apple Developer account ($99/year):

```bash
# Sign the app
codesign --sign "Developer ID Application: YOUR NAME" \
  --deep --force \
  "platforms/safari/build/Build/Products/Debug/AI Search Router.app"

# Notarize with Apple
xcrun notarytool submit AI-Search-Router-Safari.zip \
  --apple-id "your@email.com" \
  --password "app-specific-password" \
  --team-id "TEAM_ID"

# Staple notarization
xcrun stapler staple "AI Search Router.app"
```

This removes the "Untrusted Developer" warning for users.

