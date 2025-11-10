import type { SearchType } from './types.js';

/**
 * W-words that indicate questions - detected ANYWHERE in the query
 */
const W_WORDS = ['who', 'what', 'where', 'when', 'why', 'how'] as const;

/**
 * Question starters that only trigger at the START of a query
 */
const QUESTION_STARTERS = [
  'is', 'if', 'can', 'could', 'should', 'would', 'will',
  'do', 'does', 'did'
] as const;

/**
 * Question words that can appear after conjunctions (but/and)
 */
const CONJUNCTION_QUESTION_WORDS = [
  'is', 'are', 'was', 'were', 'does', 'do', 'did',
  'can', 'could', 'will', 'would', 'should'
] as const;

/**
 * Minimum word count to be considered a potential question/complex query
 */
const QUESTION_WORD_COUNT_THRESHOLD = 10;

/**
 * Classifies a search query as either requiring AI search or traditional SERP
 * 
 * Classification rules (if ANY match → AI):
 * 1. Query contains W-words (who, what, where, when, why, how) anywhere
 * 2. Query starts with question words (is, if, can, could, should, would, will, do, does, did)
 * 3. Query contains "?"
 * 4. Query contains "," or ";" (indicates complex/multi-part query)
 * 5. Query has >= 10 words (longer queries typically questions)
 * 6. Query has "but/and + question word" pattern (e.g., "but are they")
 * 
 * @param query - The search query to classify
 * @returns 'ai' if query should use AI search, 'serp' for traditional search
 * 
 * @example
 * classifyQuery("how to fix a leaky faucet") // → 'ai'
 * classifyQuery("weather") // → 'serp'
 * classifyQuery("what is the capital of france?") // → 'ai'
 * classifyQuery("lisbon flights are cheap but how long are they") // → 'ai'
 * classifyQuery("lisbon flights are cheap but are they long") // → 'ai'
 */
export function classifyQuery(query: string): SearchType {
  // Normalize query: trim and convert to lowercase
  const normalized = query.trim().toLowerCase();
  
  // Empty or very short queries default to SERP
  if (normalized.length === 0) {
    return 'serp';
  }
  
  // Rule 1: Check if contains W-words anywhere (strong question indicators)
  for (const wWord of W_WORDS) {
    // Use word boundary to avoid matching words like "show", "whatever", etc.
    const regex = new RegExp(`\\b${wWord}\\b`);
    if (regex.test(normalized)) {
      return 'ai';
    }
  }
  
  // Rule 2: Check if starts with question words
  for (const questionWord of QUESTION_STARTERS) {
    if (normalized.startsWith(questionWord + ' ')) {
      return 'ai';
    }
  }
  
  // Rule 3: Check if contains question mark
  if (normalized.includes('?')) {
    return 'ai';
  }
  
  // Rule 4: Check for commas or semicolons (complex queries)
  if (normalized.includes(',') || normalized.includes(';')) {
    return 'ai';
  }
  
  // Rule 5: Check for "but/and + question word" patterns
  for (const questionWord of CONJUNCTION_QUESTION_WORDS) {
    const butPattern = new RegExp(`\\bbut\\s+${questionWord}\\b`);
    const andPattern = new RegExp(`\\band\\s+${questionWord}\\b`);
    if (butPattern.test(normalized) || andPattern.test(normalized)) {
      return 'ai';
    }
  }
  
  // Rule 6: Long queries (by word count) are likely questions
  const wordCount = normalized.split(/\s+/).filter(word => word.length > 0).length;
  if (wordCount >= QUESTION_WORD_COUNT_THRESHOLD) {
    return 'ai';
  }
  
  // Default to traditional SERP
  return 'serp';
}

