import assert from "node:assert";
import { test } from "node:test";
import {
	AI_PROVIDERS,
	DEFAULT_AI_PROVIDER,
	DEFAULT_SERP_PROVIDER,
	formatSearchUrl,
	getAllProviders,
	getProviderById,
	getSearchUrl,
	SERP_PROVIDERS,
} from "./providers.js";

test("AI_PROVIDERS - Structure", () => {
	assert.ok(AI_PROVIDERS.length > 0, "Should have AI providers");

	for (const provider of AI_PROVIDERS) {
		assert.ok(provider.id, "Provider should have ID");
		assert.ok(provider.name, "Provider should have name");
		assert.ok(
			provider.url.includes("{query}"),
			"URL should contain {query} placeholder",
		);
		assert.strictEqual(provider.category, "ai", "Category should be ai");
	}
});

test("SERP_PROVIDERS - Structure", () => {
	assert.ok(SERP_PROVIDERS.length > 0, "Should have SERP providers");

	for (const provider of SERP_PROVIDERS) {
		assert.ok(provider.id, "Provider should have ID");
		assert.ok(provider.name, "Provider should have name");
		assert.ok(
			provider.url.includes("{query}"),
			"URL should contain {query} placeholder",
		);
		assert.strictEqual(provider.category, "serp", "Category should be serp");
	}
});

test("getAllProviders", () => {
	const all = getAllProviders();
	assert.strictEqual(all.length, AI_PROVIDERS.length + SERP_PROVIDERS.length);
});

test("getProviderById", () => {
	const google = getProviderById("google");
	assert.ok(google);
	assert.strictEqual(google.name, "Google");

	const perplexity = getProviderById("perplexity");
	assert.ok(perplexity);
	assert.strictEqual(perplexity.name, "Perplexity");

	const unknown = getProviderById("nonexistent");
	assert.strictEqual(unknown, undefined);
});

test("formatSearchUrl - Basic encoding", () => {
	const template = "https://example.com/search?q={query}";

	assert.strictEqual(
		formatSearchUrl(template, "hello world"),
		"https://example.com/search?q=hello%20world",
	);

	assert.strictEqual(
		formatSearchUrl(template, "c++"),
		"https://example.com/search?q=c%2B%2B",
	);
});

test("formatSearchUrl - Special characters", () => {
	const template = "https://example.com/search?q={query}";

	assert.strictEqual(
		formatSearchUrl(template, "question?"),
		"https://example.com/search?q=question%3F",
	);

	assert.strictEqual(
		formatSearchUrl(template, "a&b"),
		"https://example.com/search?q=a%26b",
	);
});

test("getSearchUrl - With predefined provider", () => {
	const url = getSearchUrl("google", "test query");
	assert.ok(url.includes("google.com"));
	assert.ok(url.includes("test%20query"));
});

test("getSearchUrl - With custom URL", () => {
	const customUrl = "https://custom.com/search?q={query}";
	const url = getSearchUrl("google", "test", customUrl);
	assert.strictEqual(url, "https://custom.com/search?q=test");
});

test("getSearchUrl - Unknown provider throws", () => {
	assert.throws(() => {
		getSearchUrl("unknown-provider", "test");
	}, /Unknown provider/);
});

test("Default providers exist", () => {
	const defaultAi = getProviderById(DEFAULT_AI_PROVIDER);
	assert.ok(defaultAi, "Default AI provider should exist");

	const defaultSerp = getProviderById(DEFAULT_SERP_PROVIDER);
	assert.ok(defaultSerp, "Default SERP provider should exist");
});
