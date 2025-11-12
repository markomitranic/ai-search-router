# Installing AI Search Router for Safari

## 📥 Download

Choose either format:
- **[AI-Search-Router-Safari.zip](link-to-release)** - Simple ZIP archive
- **[AI-Search-Router-Safari.dmg](link-to-release)** - DMG installer (recommended)

## 📦 Installation

### Using DMG (Recommended)

1. **Open** the downloaded DMG file
2. **Drag** "AI Search Router" to the Applications folder
3. **Eject** the DMG
4. Go to **Applications** folder
5. **Right-click** "AI Search Router.app" → **Open** (first time only)
   - ⚠️ You'll see "Untrusted Developer" warning - this is normal
   - Click **"Open"** in the dialog
6. The app will launch and stay running in your menu bar

### Using ZIP

1. **Unzip** the downloaded file
2. **Drag** "AI Search Router.app" to Applications folder
3. **Right-click** the app → **Open** (first time only)
4. Click **"Open"** in the security dialog

## ⚙️ Enable in Safari

After the app is running:

1. Open **Safari**
2. Go to **Safari → Settings** (⌘,)
3. Click the **Extensions** tab
4. Find **"AI Search Router"**
5. ✅ **Check the box** to enable it
6. Click **"Always Allow on Every Website"**
7. Grant any additional permissions

## 🧪 Test It

Try these searches in Safari's address bar:

**Questions (→ AI Search):**
- "how to learn programming"
- "what is quantum computing"
- "explain machine learning"

**Facts/Navigation (→ Traditional Search):**
- "weather"
- "reddit"
- "amazon"

## 🎛️ Configuration

Click the extension icon in Safari's toolbar to:
- Toggle AI routing on/off
- Choose AI provider (Perplexity, ChatGPT, Google AI Mode)
- Choose traditional search (Google, Kagi, DuckDuckGo, Qwant)
- Add custom search URLs

## ⚠️ Security Warning Explanation

Since this is a free, open-source extension, it's **not signed** with an Apple Developer certificate ($99/year).

**This is completely safe** - you can inspect the source code at [github.com/your-repo].

macOS just needs you to explicitly approve it:
1. **Right-click** → **Open** (not double-click)
2. Or go to **System Settings → Privacy & Security** → Click **"Open Anyway"**

## 🔄 Keeping it Running

The app must stay running for the Safari extension to work. You can:
- **Keep it in the Dock** - Right-click app icon → Options → Keep in Dock
- **Launch at Login** - System Settings → General → Login Items → Add the app
- **Hide the window** - Press ⌘H to hide (keeps running in background)

## 🐛 Troubleshooting

### Extension Not Appearing in Safari

- Make sure the app is running (check Menu Bar/Dock)
- Restart Safari
- Re-check Safari → Settings → Extensions

### Extension Not Working

- Verify it's enabled in Safari → Settings → Extensions
- Make sure you clicked "Always Allow on Every Website"
- Try disabling and re-enabling the extension
- Check Safari → Develop → Show Extension Builder for console logs

### "Untrusted Developer" Won't Go Away

1. **System Settings → Privacy & Security**
2. Scroll down to **Security** section
3. Click **"Open Anyway"** next to AI Search Router warning
4. Or: Always use **right-click → Open** (not double-click)

### Need to Uninstall?

1. Disable extension in Safari → Settings → Extensions
2. Quit the app
3. Delete "AI Search Router.app" from Applications folder

## 📝 Support

- **Issues:** [github.com/your-repo/issues]
- **Source Code:** [github.com/your-repo]
- **Documentation:** [github.com/your-repo#readme]

## 🔐 Privacy

All query classification happens **locally** on your device:
- No data sent to any server
- No analytics or tracking
- Open source - you can verify the code

Your search queries are only sent to your chosen search provider (Perplexity, Google, etc.) based on the routing decision.

