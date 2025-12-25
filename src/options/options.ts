import {
	classifyQuery,
	DEFAULT_AI_PROVIDER,
	DEFAULT_SERP_PROVIDER,
	getSearchUrl,
	type UserPreferences,
} from "../core/index";

// DOM elements - Main controls
const enabledToggle = document.getElementById(
	"enabled-toggle",
) as HTMLInputElement;
const statusText = document.getElementById("status-text") as HTMLSpanElement;
const customAiUrl = document.getElementById(
	"custom-ai-url",
) as HTMLInputElement;
const customSerpUrl = document.getElementById(
	"custom-serp-url",
) as HTMLInputElement;
const customAiGroup = document.getElementById(
	"custom-ai-group",
) as HTMLDivElement;
const customSerpGroup = document.getElementById(
	"custom-serp-group",
) as HTMLDivElement;
const testQuery = document.getElementById("test-query") as HTMLInputElement;
const testButton = document.getElementById("test-button") as HTMLButtonElement;
const testResult = document.getElementById("test-result") as HTMLDivElement;
const resultType = document.getElementById("result-type") as HTMLDivElement;
const resultUrl = document.getElementById("result-url") as HTMLDivElement;
const resetButton = document.getElementById(
	"reset-button",
) as HTMLButtonElement;
const saveMessage = document.getElementById("save-message") as HTMLDivElement;

// DOM elements - Setup guide
const extensionIdSpan = document.getElementById(
	"extension-id",
) as HTMLSpanElement;
const copyUrlBtn = document.getElementById("copy-url-btn") as HTMLButtonElement;
const openSettingsBtn = document.getElementById(
	"open-settings-btn",
) as HTMLButtonElement;

// State
let selectedAiProvider = DEFAULT_AI_PROVIDER;
let selectedSerpProvider = DEFAULT_SERP_PROVIDER;
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Debounce delay for auto-save on custom URL input
 */
const DEBOUNCE_DELAY = 300;

/**
 * Show save message briefly
 */
function showSaveMessage(message = "✓ Saved"): void {
	saveMessage.textContent = message;
	saveMessage.classList.remove("hidden");
	setTimeout(() => {
		saveMessage.classList.add("hidden");
	}, 1500);
}

/**
 * Set active button and trigger save
 */
function setActiveButton(
	type: "ai" | "serp",
	providerId: string,
	shouldSave = true,
): void {
	const buttons = document.querySelectorAll(`.preset-btn[data-type="${type}"]`);

	buttons.forEach((btn) => {
		const button = btn as HTMLButtonElement;
		if (button.dataset.provider === providerId) {
			button.classList.add("active");
		} else {
			button.classList.remove("active");
		}
	});

	// Update state
	if (type === "ai") {
		selectedAiProvider = providerId;
		if (providerId === "custom") {
			customAiGroup.classList.remove("hidden");
		} else {
			customAiGroup.classList.add("hidden");
		}
	} else {
		selectedSerpProvider = providerId;
		if (providerId === "custom") {
			customSerpGroup.classList.remove("hidden");
		} else {
			customSerpGroup.classList.add("hidden");
		}
	}

	// Auto-save when clicking provider buttons
	if (shouldSave) {
		savePreferences();
	}
}

/**
 * Load current preferences
 */
async function loadPreferences(): Promise<void> {
	try {
		const result = await chrome.storage.sync.get("preferences");
		const prefs: UserPreferences = (result.preferences as UserPreferences) || {
			enabled: true,
			aiProvider: DEFAULT_AI_PROVIDER,
			serpProvider: DEFAULT_SERP_PROVIDER,
		};

		// Update toggle
		enabledToggle.checked = prefs.enabled;
		statusText.textContent = prefs.enabled ? "Enabled" : "Disabled";

		// Handle custom AI provider
		if (prefs.customAiUrl) {
			setActiveButton("ai", "custom", false);
			customAiUrl.value = prefs.customAiUrl;
		} else {
			setActiveButton("ai", prefs.aiProvider, false);
			customAiUrl.value = "";
		}

		// Handle custom SERP provider
		if (prefs.customSerpUrl) {
			setActiveButton("serp", "custom", false);
			customSerpUrl.value = prefs.customSerpUrl;
		} else {
			setActiveButton("serp", prefs.serpProvider, false);
			customSerpUrl.value = "";
		}
	} catch (error) {
		console.error("Error loading preferences:", error);
	}
}

/**
 * Save preferences (auto-save)
 */
async function savePreferences(): Promise<void> {
	try {
		const result = await chrome.storage.sync.get("preferences");
		const prefs: UserPreferences = (result.preferences as UserPreferences) || {
			enabled: true,
			aiProvider: DEFAULT_AI_PROVIDER,
			serpProvider: DEFAULT_SERP_PROVIDER,
		};

		// Preserve enabled state
		prefs.enabled = enabledToggle.checked;

		// Handle AI provider
		if (selectedAiProvider === "custom") {
			prefs.customAiUrl = customAiUrl.value.trim() || undefined;
			prefs.aiProvider = DEFAULT_AI_PROVIDER; // Fallback
		} else {
			prefs.aiProvider = selectedAiProvider;
			prefs.customAiUrl = undefined;
		}

		// Handle SERP provider
		if (selectedSerpProvider === "custom") {
			prefs.customSerpUrl = customSerpUrl.value.trim() || undefined;
			prefs.serpProvider = DEFAULT_SERP_PROVIDER; // Fallback
		} else {
			prefs.serpProvider = selectedSerpProvider;
			prefs.customSerpUrl = undefined;
		}

		await chrome.storage.sync.set({ preferences: prefs });
		showSaveMessage();
	} catch (error) {
		console.error("Error saving preferences:", error);
	}
}

/**
 * Debounced save for text inputs
 */
function debouncedSave(): void {
	if (saveTimeout) {
		clearTimeout(saveTimeout);
	}
	saveTimeout = setTimeout(() => {
		savePreferences();
	}, DEBOUNCE_DELAY);
}

/**
 * Save enabled/disabled state
 */
async function saveEnabled(enabled: boolean): Promise<void> {
	try {
		const result = await chrome.storage.sync.get("preferences");
		const prefs: UserPreferences = (result.preferences as UserPreferences) || {
			enabled: true,
			aiProvider: DEFAULT_AI_PROVIDER,
			serpProvider: DEFAULT_SERP_PROVIDER,
		};

		prefs.enabled = enabled;
		await chrome.storage.sync.set({ preferences: prefs });

		statusText.textContent = enabled ? "Enabled" : "Disabled";
		showSaveMessage();
	} catch (error) {
		console.error("Error saving enabled state:", error);
	}
}

/**
 * Reset to defaults
 */
async function resetToDefaults(): Promise<void> {
	if (!confirm("Reset all settings to defaults?")) {
		return;
	}

	try {
		const defaultPrefs: UserPreferences = {
			enabled: true,
			aiProvider: DEFAULT_AI_PROVIDER,
			serpProvider: DEFAULT_SERP_PROVIDER,
		};

		await chrome.storage.sync.set({ preferences: defaultPrefs });
		await loadPreferences();

		showSaveMessage("✓ Reset to defaults");
	} catch (error) {
		console.error("Error resetting preferences:", error);
		alert("Error resetting preferences. Please try again.");
	}
}

/**
 * Test query classification
 */
function testClassification(query?: string): void {
	const testQueryValue = query || testQuery.value.trim();

	if (!testQueryValue) {
		alert("Please enter a test query");
		return;
	}

	// Update test input if query was provided
	if (query) {
		testQuery.value = query;
	}

	const searchType = classifyQuery(testQueryValue);

	const providerId =
		searchType === "ai" ? selectedAiProvider : selectedSerpProvider;
	const customUrl =
		searchType === "ai" ? customAiUrl.value.trim() : customSerpUrl.value.trim();

	// Use custom URL if "custom" is selected and URL is provided
	const url =
		providerId === "custom" && customUrl
			? getSearchUrl(DEFAULT_AI_PROVIDER, testQueryValue, customUrl)
			: getSearchUrl(providerId, testQueryValue, undefined);

	resultType.textContent =
		searchType === "ai" ? "🤖 AI Search" : "🔍 Traditional Search";

	resultUrl.textContent = url;
	testResult.classList.remove("hidden");

	// Scroll to test results
	testResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/**
 * Handle example query clicks
 */
function handleExampleClick(event: Event): void {
	const target = event.target as HTMLElement;
	const query = target.dataset.query;

	if (query) {
		testClassification(query);
	}
}

/**
 * Handle preset button clicks
 */
function handlePresetClick(event: Event): void {
	const button = event.target as HTMLButtonElement;
	const provider = button.dataset.provider;
	const type = button.dataset.type as "ai" | "serp";

	if (!provider || !type) return;

	setActiveButton(type, provider);
}

/**
 * Copy search URL to clipboard
 */
async function copySearchUrl(): Promise<void> {
	const extensionId = chrome.runtime.id;
	const url = `chrome-extension://${extensionId}/search.html?q=%s`;

	try {
		await navigator.clipboard.writeText(url);
		copyUrlBtn.textContent = "✓";
		copyUrlBtn.classList.add("copied");
		setTimeout(() => {
			copyUrlBtn.textContent = "📋";
			copyUrlBtn.classList.remove("copied");
		}, 2000);
	} catch (error) {
		console.error("Failed to copy:", error);
		// Fallback: select the text
		const codeEl = document.getElementById("search-url");
		if (codeEl) {
			const range = document.createRange();
			range.selectNodeContents(codeEl);
			const selection = window.getSelection();
			selection?.removeAllRanges();
			selection?.addRange(range);
		}
	}
}

/**
 * Open Chrome search engine settings
 */
function openSearchSettings(): void {
	chrome.tabs.create({ url: "chrome://settings/searchEngines" });
}

/**
 * Initialize setup guide
 */
function initSetupGuide(): void {
	// Display extension ID
	const extensionId = chrome.runtime.id;
	extensionIdSpan.textContent = extensionId;

	// Copy URL button
	copyUrlBtn.addEventListener("click", copySearchUrl);

	// Open settings button
	openSettingsBtn.addEventListener("click", openSearchSettings);

	// Prevent link click (chrome:// URLs can't be navigated via anchor)
	const settingsLink = document.getElementById("open-search-settings");
	if (settingsLink) {
		settingsLink.addEventListener("click", (e) => {
			e.preventDefault();
			openSearchSettings();
		});
	}
}

// Event listeners
enabledToggle.addEventListener("change", () => {
	saveEnabled(enabledToggle.checked);
});

resetButton.addEventListener("click", resetToDefaults);
testButton.addEventListener("click", () => testClassification());

// Provider button clicks - auto-save
const presetButtons = document.querySelectorAll(".preset-btn");
presetButtons.forEach((btn) => {
	btn.addEventListener("click", handlePresetClick);
});

// Custom URL inputs - debounced auto-save
customAiUrl.addEventListener("input", debouncedSave);
customSerpUrl.addEventListener("input", debouncedSave);

// Example query clicks
const exampleItems = document.querySelectorAll(".example-item");
exampleItems.forEach((item) => {
	item.addEventListener("click", handleExampleClick);
});

// Test on Enter key
testQuery.addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		testClassification();
	}
});

// Initialize
loadPreferences();
initSetupGuide();
