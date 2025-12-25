import {
	classifyQuery,
	getSearchUrl,
	type UserPreferences,
} from "./core/index";

/**
 * Default user preferences
 */
const DEFAULT_PREFERENCES: UserPreferences = {
	aiProvider: "google-ai",
	serpProvider: "google",
};

/**
 * In-memory cache for instant access
 * Avoids slow chrome.storage calls on every search
 */
let cachedPreferences: UserPreferences = DEFAULT_PREFERENCES;

/**
 * Load preferences from storage into memory cache
 */
async function loadPreferencesIntoCache(): Promise<void> {
	try {
		const result = await chrome.storage.sync.get("preferences");
		if (result.preferences) {
			cachedPreferences = result.preferences as UserPreferences;
		}
		console.log("[AI Search Router] Preferences cached in memory");
	} catch (error) {
		console.error("[AI Search Router] Failed to load preferences:", error);
	}
}

/**
 * Keep cache in sync when preferences change (from options page)
 */
chrome.storage.onChanged.addListener((changes, areaName) => {
	if (areaName === "sync" && changes.preferences?.newValue) {
		cachedPreferences = changes.preferences.newValue as UserPreferences;
		console.log("[AI Search Router] Preferences cache updated");
	}
});

/**
 * Message handler for search page - returns redirect URL from memory cache
 */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
	if (message.type === "getRedirectUrl" && message.query) {
		const query = message.query as string;
		const searchType = classifyQuery(query);
		const url =
			searchType === "ai"
				? getSearchUrl(
					cachedPreferences.aiProvider,
					query,
					cachedPreferences.customAiUrl,
				)
				: getSearchUrl(
					cachedPreferences.serpProvider,
					query,
					cachedPreferences.customSerpUrl,
				);

		sendResponse({ url });
	}
	return true; // Keep channel open for async response
});

/**
 * Initialize extension on install
 */
chrome.runtime.onInstalled.addListener(async () => {
	console.log("[AI Search Router] Extension installed");

	// Set default preferences if not exists
	const result = await chrome.storage.sync.get("preferences");
	if (!result.preferences) {
		await chrome.storage.sync.set({ preferences: DEFAULT_PREFERENCES });
	}

	// Load into cache
	await loadPreferencesIntoCache();

	console.log(
		"[AI Search Router] Ready - set as default search provider to use",
	);
});

// Load preferences into cache on service worker startup
loadPreferencesIntoCache();

// Log when service worker starts
console.log("[AI Search Router] Background service worker loaded");
