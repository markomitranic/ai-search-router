// AI Search Router - Fast classifier for instant search routing

import {
	classifyQuery,
	getSearchUrl,
	type UserPreferences,
} from "./core/index";

const DEFAULT_AI = "google-ai";
const DEFAULT_SERP = "google";

// Execute immediately
(async () => {
	const query = new URLSearchParams(location.search).get("q");

	if (!query) {
		location.replace("https://www.google.com/search");
		return;
	}

	try {
		const result = await chrome.storage.sync.get("preferences");
		const prefs: UserPreferences = (result.preferences as UserPreferences) || {
			enabled: true,
			aiProvider: DEFAULT_AI,
			serpProvider: DEFAULT_SERP,
		};

		if (!prefs.enabled) {
			location.replace(
				getSearchUrl(prefs.serpProvider, query, prefs.customSerpUrl),
			);
			return;
		}

		const type = classifyQuery(query);
		const url =
			type === "ai"
				? getSearchUrl(prefs.aiProvider, query, prefs.customAiUrl)
				: getSearchUrl(prefs.serpProvider, query, prefs.customSerpUrl);

		location.replace(url);
	} catch (_e) {
		// Fallback to Google on any error
		location.replace(
			`https://www.google.com/search?q=${encodeURIComponent(query)}`,
		);
	}
})();
