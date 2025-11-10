import {
  getProviderById,
  DEFAULT_AI_PROVIDER,
  DEFAULT_SERP_PROVIDER,
  type UserPreferences
} from '@ai-search-router/core';

// DOM elements
const enabledToggle = document.getElementById('enabled-toggle') as HTMLInputElement;
const statusText = document.getElementById('status-text') as HTMLSpanElement;
const aiProviderName = document.getElementById('ai-provider-name') as HTMLDivElement;
const serpProviderName = document.getElementById('serp-provider-name') as HTMLDivElement;
const settingsButton = document.getElementById('settings-button') as HTMLButtonElement;

/**
 * Load and display current preferences
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

    // Update AI provider name
    if (prefs.customAiUrl) {
      aiProviderName.textContent = 'Custom URL';
    } else {
      const aiProvider = getProviderById(prefs.aiProvider);
      aiProviderName.textContent = aiProvider?.name || 'Unknown';
    }

    // Update SERP provider name
    if (prefs.customSerpUrl) {
      serpProviderName.textContent = 'Custom URL';
    } else {
      const serpProvider = getProviderById(prefs.serpProvider);
      serpProviderName.textContent = serpProvider?.name || 'Unknown';
    }
  } catch (error) {
    console.error('Error loading preferences:', error);
    aiProviderName.textContent = 'Error loading';
    serpProviderName.textContent = 'Error loading';
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
 * Open settings page
 */
function openSettings(): void {
  chrome.runtime.openOptionsPage();
}

// Event listeners
enabledToggle.addEventListener('change', () => {
  saveEnabled(enabledToggle.checked);
});

settingsButton.addEventListener('click', openSettings);

// Load preferences on popup open
loadPreferences();

