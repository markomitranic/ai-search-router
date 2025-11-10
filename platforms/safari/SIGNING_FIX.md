# Xcode Signing Issues - Quick Fixes

## Issue: "Failed to retrieve development teams"

This happens because your Apple ID hasn't been used for development before.

## Solution 1: Manual Signing (Recommended)

1. In Xcode, select the **AI Search Router** target
2. Go to **Signing & Capabilities** tab
3. **UNCHECK** "Automatically manage signing"
4. Under **Signing Certificate**: Select **"Sign to Run Locally"**
5. Bundle Identifier: Change to something unique:
   - `com.yourname.aisearchrouter`
   - Or: `local.aisearchrouter.app`

## Solution 2: Create Personal Team

1. Go to [appleid.apple.com](https://appleid.apple.com)
2. Sign in with your Apple ID
3. Accept any pending agreements
4. Back in Xcode → Settings → Accounts
5. Remove and re-add your account
6. Try again

## Solution 3: Use Different Bundle ID

Sometimes the bundle ID conflicts. Change it to:

- `dev.aisearchrouter.extension`
- `test.searchrouter.app`
- `local.yourname.searchrouter`

Then try automatic signing again.

## For the Extension Target Too

Don't forget to do the same for **both targets**:

1. AI Search Router (the app)
2. AI Search Router Extension (the extension)

Both need to be signed!

