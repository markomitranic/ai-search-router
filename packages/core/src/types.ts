/**
 * Query classification result
 */
export type SearchType = 'ai' | 'serp';

/**
 * Search provider configuration
 */
export interface SearchProvider {
  id: string;
  name: string;
  url: string;
  category: 'ai' | 'serp';
}

/**
 * User preferences for search routing
 */
export interface UserPreferences {
  enabled: boolean;
  aiProvider: string;
  serpProvider: string;
  customAiUrl?: string;
  customSerpUrl?: string;
}

