import type { SearchProvider } from "./types";

/**
 * Predefined AI search providers
 */
export const AI_PROVIDERS: SearchProvider[] = [
	{
		id: "google-ai",
		name: "Google AI Mode",
		url: "https://www.google.com/search?udm=50&q={query}",
		category: "ai",
	},
	{
		id: "perplexity",
		name: "Perplexity",
		url: "https://www.perplexity.ai/search?q={query}",
		category: "ai",
	},
	{
		id: "chatgpt",
		name: "ChatGPT",
		url: "https://chat.openai.com/?q={query}",
		category: "ai",
	},
];

/**
 * Predefined traditional search providers
 */
export const SERP_PROVIDERS: SearchProvider[] = [
	{
		id: "google",
		name: "Google",
		url: "https://www.google.com/search?q={query}",
		category: "serp",
	},
	{
		id: "kagi",
		name: "Kagi",
		url: "https://kagi.com/search?q={query}",
		category: "serp",
	},
	{
		id: "qwant",
		name: "Qwant",
		url: "https://www.qwant.com/?q={query}",
		category: "serp",
	},
	{
		id: "duckduckgo",
		name: "DuckDuckGo",
		url: "https://duckduckgo.com/?q={query}",
		category: "serp",
	},
];

/**
 * Default provider IDs
 */
export const DEFAULT_AI_PROVIDER = "google-ai";
export const DEFAULT_SERP_PROVIDER = "google";

/**
 * Get all providers
 */
export function getAllProviders(): SearchProvider[] {
	return [...AI_PROVIDERS, ...SERP_PROVIDERS];
}

/**
 * Find a provider by ID
 */
export function getProviderById(id: string): SearchProvider | undefined {
	return getAllProviders().find((p) => p.id === id);
}

/**
 * Format a search URL with the query
 * @param template - URL template with {query} placeholder
 * @param query - The search query
 * @returns Formatted URL with encoded query
 *
 * @example
 * formatSearchUrl("https://google.com/search?q={query}", "hello world")
 * // → "https://google.com/search?q=hello%20world"
 */
export function formatSearchUrl(template: string, query: string): string {
	const encodedQuery = encodeURIComponent(query);
	return template.replace("{query}", encodedQuery);
}

/**
 * Get the search URL for a specific provider and query
 */
export function getSearchUrl(
	providerId: string,
	query: string,
	customUrl?: string,
): string {
	// Use custom URL if provided
	if (customUrl && customUrl.trim().length > 0) {
		return formatSearchUrl(customUrl, query);
	}

	// Find predefined provider
	const provider = getProviderById(providerId);
	if (!provider) {
		throw new Error(`Unknown provider: ${providerId}`);
	}

	return formatSearchUrl(provider.url, query);
}
