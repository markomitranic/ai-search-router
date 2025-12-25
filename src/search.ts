const query = new URLSearchParams(location.search).get("q");

if (!query) {
	location.replace("https://www.google.com/search");
} else {
	// Request redirect URL from background worker (uses in-memory cache - instant!)
	chrome.runtime.sendMessage(
		{ type: "getRedirectUrl", query },
		(response) => {
			if (response?.url) {
				location.replace(response.url);
			} else {
				// Fallback to Google on any error
				location.replace(
					`https://www.google.com/search?q=${encodeURIComponent(query)}`,
				);
			}
		},
	);
}
