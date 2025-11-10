import {
  classifyQuery,
  getSearchUrl,
  DEFAULT_AI_PROVIDER,
  DEFAULT_SERP_PROVIDER,
  type UserPreferences
} from '@ai-search-router/core';

/**
 * Default user preferences
 */
const DEFAULT_PREFERENCES: UserPreferences = {
  enabled: true,
  aiProvider: DEFAULT_AI_PROVIDER,
  serpProvider: DEFAULT_SERP_PROVIDER
};

/**
 * Track tabs we've already redirected to avoid loops
 */
const redirectedTabs = new Map<number, string>();

/**
 * Get user preferences from storage
 */
async function getPreferences(): Promise<UserPreferences> {
  try {
    const result = await chrome.storage.sync.get('preferences');
    return { ...DEFAULT_PREFERENCES, ...result.preferences };
  } catch (error) {
    console.error('[AI Search Router] Error loading preferences:', error);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Extract query from a URL
 */
function extractQuery(url: string): string | null {
  try {
    const urlObj = new URL(url);

    // Try common query parameter names
    const queryParams = ['q', 'query', 'search'];
    for (const param of queryParams) {
      const value = urlObj.searchParams.get(param);
      if (value) {
        return value;
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Check if URL is a search engine URL
 */
function isSearchUrl(url: string): boolean {
  const searchPatterns = [
    'google.com/search',
    'bing.com/search',
    'duckduckgo.com/',
    'yahoo.com/search',
    'kagi.com/search',
    'qwant.com/',
    'perplexity.ai/search',
    'perplexity.ai/?q=',      // Comet browser format
    'www.perplexity.ai/?q=',   // Comet browser format with www
    'chat.openai.com/'
  ];

  return searchPatterns.some(pattern => url.includes(pattern));
}

/**
 * Check if this navigation should be intercepted
 */
function shouldIntercept(url: string, tabId: number): boolean {
  // Don't intercept chrome:// URLs
  if (url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
    return false;
  }

  // Check if it's a search URL
  if (!isSearchUrl(url)) {
    return false;
  }

  // Check if we recently redirected this tab
  const lastRedirect = redirectedTabs.get(tabId);
  if (lastRedirect) {
    try {
      const lastUrl = new URL(lastRedirect);
      const currentUrl = new URL(url);
      // If we're navigating to where we just redirected, don't intercept again
      if (lastUrl.hostname === currentUrl.hostname) {
        return false;
      }
    } catch {
      // Invalid URL, skip
    }
  }

  return true;
}

/**
 * Handle navigation - intercept search queries from address bar ONLY
 * We use onCommitted (not onBeforeNavigate) because it provides transitionType
 * which tells us HOW the navigation was initiated (typed, link click, etc.)
 */
chrome.webNavigation.onCommitted.addListener(async (details) => {
  // Only intercept main frame navigations (not iframes)
  if (details.frameId !== 0) {
    return;
  }

  const { url, tabId, transitionType, transitionQualifiers } = details;

  // CRITICAL: Only intercept address bar searches
  // - 'typed': User typed in address bar
  // - 'generated': User selected from address bar autocomplete/suggestions
  // DO NOT intercept:
  // - 'link': User clicked a link (including Google tabs like Images, Videos, etc.)
  // - 'form_submit': User submitted a form (including Google's search box)
  // - 'reload', 'auto_bookmark', etc.
  if (transitionType !== 'typed' && transitionType !== 'generated') {
    return;
  }

  // Also exclude forward/back button navigation
  if (transitionQualifiers &&
    (transitionQualifiers.includes('forward_back') ||
      transitionQualifiers.includes('from_address_bar') === false)) {
    return;
  }

  // Debug logging for Comet browser
  if (url.includes('perplexity.ai')) {
    console.log('[AI Search Router] Detected Perplexity URL:', url);
  }

  // Check if we should intercept this navigation
  if (!shouldIntercept(url, tabId)) {
    return;
  }

  // Extract query
  const query = extractQuery(url);
  if (!query) {
    return;
  }

  // Get user preferences
  const prefs = await getPreferences();

  // If disabled, don't intercept
  if (!prefs.enabled) {
    return;
  }

  console.log('[AI Search Router] Intercepted search from address bar:', query);
  console.log('[AI Search Router] Transition type:', transitionType);

  // Classify the query
  const searchType = classifyQuery(query);
  console.log('[AI Search Router] Classification:', searchType);

  // Determine target URL
  let targetUrl: string;
  if (searchType === 'ai') {
    targetUrl = getSearchUrl(prefs.aiProvider, query, prefs.customAiUrl);
  } else {
    targetUrl = getSearchUrl(prefs.serpProvider, query, prefs.customSerpUrl);
  }

  console.log('[AI Search Router] Redirecting to:', targetUrl);

  // Store this redirect to avoid loops
  redirectedTabs.set(tabId, targetUrl);

  // Clean up after 3 seconds
  setTimeout(() => {
    redirectedTabs.delete(tabId);
  }, 3000);

  // Redirect to the appropriate search engine
  try {
    await chrome.tabs.update(tabId, { url: targetUrl });
  } catch (error) {
    console.error('[AI Search Router] Redirect failed:', error);
  }
});

/**
 * Clean up when tabs are closed
 */
chrome.tabs.onRemoved.addListener((tabId) => {
  redirectedTabs.delete(tabId);
});

/**
 * Initialize extension
 */
chrome.runtime.onInstalled.addListener(async () => {
  console.log('[AI Search Router] Extension installed');

  // Set default preferences if not exists
  const result = await chrome.storage.sync.get('preferences');
  if (!result.preferences) {
    await chrome.storage.sync.set({ preferences: DEFAULT_PREFERENCES });
  }

  const prefs = await getPreferences();
  console.log('[AI Search Router] Configuration:', {
    enabled: prefs.enabled,
    aiProvider: prefs.aiProvider,
    serpProvider: prefs.serpProvider
  });

  console.log('[AI Search Router] Ready to intercept searches');
});

// Log when service worker starts
console.log('[AI Search Router] Background service worker loaded');
