import {
  DEFAULT_AI_PROVIDER,
  DEFAULT_SERP_PROVIDER,
  classifyQuery,
  getSearchUrl,
  type UserPreferences
} from '@ai-search-router/core';

// DOM elements
const enabledToggle = document.getElementById('enabled-toggle') as HTMLInputElement;
const statusText = document.getElementById('status-text') as HTMLSpanElement;
const customAiUrl = document.getElementById('custom-ai-url') as HTMLInputElement;
const customSerpUrl = document.getElementById('custom-serp-url') as HTMLInputElement;
const customAiGroup = document.getElementById('custom-ai-group') as HTMLDivElement;
const customSerpGroup = document.getElementById('custom-serp-group') as HTMLDivElement;
const testQuery = document.getElementById('test-query') as HTMLInputElement;
const testButton = document.getElementById('test-button') as HTMLButtonElement;
const testResult = document.getElementById('test-result') as HTMLDivElement;
const resultType = document.getElementById('result-type') as HTMLDivElement;
const resultUrl = document.getElementById('result-url') as HTMLDivElement;
const saveButton = document.getElementById('save-button') as HTMLButtonElement;
const resetButton = document.getElementById('reset-button') as HTMLButtonElement;
const saveMessage = document.getElementById('save-message') as HTMLDivElement;

// State
let selectedAiProvider = DEFAULT_AI_PROVIDER;
let selectedSerpProvider = DEFAULT_SERP_PROVIDER;

/**
 * Set active button
 */
function setActiveButton(type: 'ai' | 'serp', providerId: string): void {
  const buttons = document.querySelectorAll(`.preset-btn[data-type="${type}"]`);

  buttons.forEach(btn => {
    const button = btn as HTMLButtonElement;
    if (button.dataset.provider === providerId) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });

  // Update state
  if (type === 'ai') {
    selectedAiProvider = providerId;
    // Toggle custom input visibility
    if (providerId === 'custom') {
      customAiGroup.classList.remove('hidden');
    } else {
      customAiGroup.classList.add('hidden');
    }
  } else {
    selectedSerpProvider = providerId;
    // Toggle custom input visibility
    if (providerId === 'custom') {
      customSerpGroup.classList.remove('hidden');
    } else {
      customSerpGroup.classList.add('hidden');
    }
  }
}

/**
 * Load current preferences
 */
async function loadPreferences(): Promise<void> {
  try {
    const result = await chrome.storage.sync.get('preferences');
    const prefs: UserPreferences = result.preferences || {
      enabled: true,
      aiProvider: DEFAULT_AI_PROVIDER,
      serpProvider: DEFAULT_SERP_PROVIDER
    };

    // Update toggle
    enabledToggle.checked = prefs.enabled;
    statusText.textContent = prefs.enabled ? 'Enabled' : 'Disabled';

    // Handle custom AI provider
    if (prefs.customAiUrl) {
      setActiveButton('ai', 'custom');
      customAiUrl.value = prefs.customAiUrl;
    } else {
      setActiveButton('ai', prefs.aiProvider);
      customAiUrl.value = '';
    }

    // Handle custom SERP provider
    if (prefs.customSerpUrl) {
      setActiveButton('serp', 'custom');
      customSerpUrl.value = prefs.customSerpUrl;
    } else {
      setActiveButton('serp', prefs.serpProvider);
      customSerpUrl.value = '';
    }
  } catch (error) {
    console.error('Error loading preferences:', error);
  }
}

/**
 * Save enabled/disabled state
 */
async function saveEnabled(enabled: boolean): Promise<void> {
  try {
    const result = await chrome.storage.sync.get('preferences');
    const prefs: UserPreferences = result.preferences || {
      enabled: true,
      aiProvider: DEFAULT_AI_PROVIDER,
      serpProvider: DEFAULT_SERP_PROVIDER
    };

    prefs.enabled = enabled;
    await chrome.storage.sync.set({ preferences: prefs });

    statusText.textContent = enabled ? 'Enabled' : 'Disabled';
  } catch (error) {
    console.error('Error saving enabled state:', error);
  }
}

/**
 * Save preferences
 */
async function savePreferences(): Promise<void> {
  try {
    const result = await chrome.storage.sync.get('preferences');
    const prefs: UserPreferences = result.preferences || {
      enabled: true,
      aiProvider: DEFAULT_AI_PROVIDER,
      serpProvider: DEFAULT_SERP_PROVIDER
    };

    // Preserve enabled state
    prefs.enabled = enabledToggle.checked;

    // Handle AI provider
    if (selectedAiProvider === 'custom') {
      if (!customAiUrl.value.trim()) {
        alert('Please enter a custom AI search URL');
        return;
      }
      prefs.customAiUrl = customAiUrl.value.trim();
      prefs.aiProvider = DEFAULT_AI_PROVIDER; // Fallback
    } else {
      prefs.aiProvider = selectedAiProvider;
      prefs.customAiUrl = undefined;
    }

    // Handle SERP provider
    if (selectedSerpProvider === 'custom') {
      if (!customSerpUrl.value.trim()) {
        alert('Please enter a custom traditional search URL');
        return;
      }
      prefs.customSerpUrl = customSerpUrl.value.trim();
      prefs.serpProvider = DEFAULT_SERP_PROVIDER; // Fallback
    } else {
      prefs.serpProvider = selectedSerpProvider;
      prefs.customSerpUrl = undefined;
    }

    await chrome.storage.sync.set({ preferences: prefs });

    // Show save message
    saveMessage.classList.remove('hidden');
    setTimeout(() => {
      saveMessage.classList.add('hidden');
    }, 3000);
  } catch (error) {
    console.error('Error saving preferences:', error);
    alert('Error saving preferences. Please try again.');
  }
}

/**
 * Reset to defaults
 */
async function resetToDefaults(): Promise<void> {
  if (!confirm('Reset all settings to defaults?')) {
    return;
  }

  try {
    const defaultPrefs: UserPreferences = {
      enabled: true,
      aiProvider: DEFAULT_AI_PROVIDER,
      serpProvider: DEFAULT_SERP_PROVIDER
    };

    await chrome.storage.sync.set({ preferences: defaultPrefs });
    await loadPreferences();

    saveMessage.textContent = '✓ Reset to defaults!';
    saveMessage.classList.remove('hidden');
    setTimeout(() => {
      saveMessage.textContent = '✓ Settings saved successfully!';
      saveMessage.classList.add('hidden');
    }, 3000);
  } catch (error) {
    console.error('Error resetting preferences:', error);
    alert('Error resetting preferences. Please try again.');
  }
}

/**
 * Test query classification
 */
function testClassification(query?: string): void {
  const testQueryValue = query || testQuery.value.trim();

  if (!testQueryValue) {
    alert('Please enter a test query');
    return;
  }

  // Update test input if query was provided
  if (query) {
    testQuery.value = query;
  }

  const searchType = classifyQuery(testQueryValue);

  const providerId = searchType === 'ai' ? selectedAiProvider : selectedSerpProvider;
  const customUrl = searchType === 'ai' ? customAiUrl.value.trim() : customSerpUrl.value.trim();

  // Use custom URL if "custom" is selected and URL is provided
  const url = providerId === 'custom' && customUrl
    ? getSearchUrl(DEFAULT_AI_PROVIDER, testQueryValue, customUrl)
    : getSearchUrl(providerId, testQueryValue, undefined);

  resultType.textContent = searchType === 'ai'
    ? '🤖 AI Search'
    : '🔍 Traditional Search';

  resultUrl.textContent = url;
  testResult.classList.remove('hidden');

  // Scroll to test results
  testResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Handle example query clicks - fill test input and run classification
 */
function handleExampleClick(event: Event): void {
  const target = event.target as HTMLElement;
  const query = target.dataset.query;

  if (query) {
    // Fill the test input and trigger classification
    testClassification(query);
  }
}

/**
 * Handle preset button clicks
 */
function handlePresetClick(event: Event): void {
  const button = event.target as HTMLButtonElement;
  const provider = button.dataset.provider;
  const type = button.dataset.type as 'ai' | 'serp';

  if (!provider || !type) return;

  setActiveButton(type, provider);
}

// Event listeners
enabledToggle.addEventListener('change', () => {
  saveEnabled(enabledToggle.checked);
});

saveButton.addEventListener('click', savePreferences);
resetButton.addEventListener('click', resetToDefaults);
testButton.addEventListener('click', () => testClassification());

const presetButtons = document.querySelectorAll('.preset-btn');
presetButtons.forEach(btn => {
  btn.addEventListener('click', handlePresetClick);
});

// Example query clicks
const exampleItems = document.querySelectorAll('.example-item');
exampleItems.forEach(item => {
  item.addEventListener('click', handleExampleClick);
});

// Test on Enter key
testQuery.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    testClassification();
  }
});

// Initialize
loadPreferences();

