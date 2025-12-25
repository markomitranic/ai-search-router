/**
 * User preferences interface
 */
interface UserPreferences {
	aiProvider: string;
	serpProvider: string;
	customAiUrl?: string;
	customSerpUrl?: string;
}

/**
 * Default user preferences
 */
const DEFAULT_PREFERENCES: UserPreferences = {
	aiProvider: "google-ai",
	serpProvider: "google",
};

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

	console.log(
		"[AI Search Router] Ready - set as default search provider to use",
	);
});

// Log when service worker starts
console.log("[AI Search Router] Background service worker loaded");
