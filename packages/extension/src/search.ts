// AI Search Router - Fast classifier for instant search routing

const W_WORDS = ['who','what','where','when','why','how','which','whose','whom'];
const QUESTION_STARTERS = ['is','are','was','were','if','can','could','should','would','will','shall','do','does','did','has','have','had','may','might','must'];
const COMMAND_WORDS = ['summarize','explain','compare','analyze','describe','evaluate','calculate','define','review','discuss','generate','critique','elaborate','clarify'];
const CONJUNCTION_WORDS = ['is','are','was','were','does','do','did','has','have','had','can','could','will','would','should','shall','may','might','must'];

const PROVIDERS = {
  'google-ai': 'https://www.google.com/search?udm=50&q=',
  'perplexity': 'https://www.perplexity.ai/search?q=',
  'chatgpt': 'https://chat.openai.com/?q=',
  'google': 'https://www.google.com/search?q=',
  'kagi': 'https://kagi.com/search?q=',
  'qwant': 'https://www.qwant.com/?q=',
  'duckduckgo': 'https://duckduckgo.com/?q='
};

const DEFAULT_AI = 'google-ai';
const DEFAULT_SERP = 'google';

function classify(q: string): 'ai' | 'serp' {
  const n = q.trim().toLowerCase();
  if (!n.length) return 'serp';
  
  // W-words anywhere
  for (const w of W_WORDS) if (new RegExp('\\b' + w + '\\b').test(n)) return 'ai';
  
  // Question starters
  for (const w of QUESTION_STARTERS) if (n.startsWith(w + ' ')) return 'ai';
  
  // Command words
  for (const w of COMMAND_WORDS) if (new RegExp('\\b' + w + '\\b').test(n)) return 'ai';
  
  // Question mark
  if (n.includes('?')) return 'ai';
  
  // Complex queries (commas/semicolons)
  if (n.includes(',') || n.includes(';')) return 'ai';
  
  // Long queries (10+ words)
  if (n.split(/\s+/).filter(x => x.length > 0).length >= 10) return 'ai';
  
  // Conjunction patterns
  for (const w of CONJUNCTION_WORDS) {
    if (new RegExp('\\b(but|and)\\s+' + w + '\\b').test(n)) return 'ai';
  }
  
  return 'serp';
}

function getUrl(provider: string, query: string, customUrl?: string): string {
  if (customUrl && customUrl.trim()) {
    return customUrl.replace('{query}', encodeURIComponent(query));
  }
  const base = PROVIDERS[provider as keyof typeof PROVIDERS] || PROVIDERS.google;
  return base + encodeURIComponent(query);
}

// Execute immediately
(async () => {
  const query = new URLSearchParams(location.search).get('q');
  
  if (!query) {
    location.replace('https://www.google.com/search');
    return;
  }

  try {
    const result = await chrome.storage.sync.get('preferences');
    const prefs = result.preferences || { enabled: true, aiProvider: DEFAULT_AI, serpProvider: DEFAULT_SERP };

    if (!prefs.enabled) {
      location.replace(getUrl(prefs.serpProvider, query, prefs.customSerpUrl));
      return;
    }

    const type = classify(query);
    const url = type === 'ai'
      ? getUrl(prefs.aiProvider, query, prefs.customAiUrl)
      : getUrl(prefs.serpProvider, query, prefs.customSerpUrl);

    location.replace(url);
  } catch (e) {
    // Fallback to Google on any error
    location.replace('https://www.google.com/search?q=' + encodeURIComponent(query));
  }
})();

