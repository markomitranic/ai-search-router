import { test } from 'node:test';
import assert from 'node:assert';
import { classifyQuery } from './classifier.js';

test('classifyQuery - W-words anywhere in query', () => {
  // At the start
  assert.strictEqual(classifyQuery('how to fix a leaky faucet'), 'ai');
  assert.strictEqual(classifyQuery('How to fix a leaky faucet'), 'ai');
  assert.strictEqual(classifyQuery('what is the capital of france'), 'ai');
  assert.strictEqual(classifyQuery('where can i find good pizza'), 'ai');
  assert.strictEqual(classifyQuery('when was python invented'), 'ai');
  assert.strictEqual(classifyQuery('why is the sky blue'), 'ai');
  assert.strictEqual(classifyQuery('who invented the telephone'), 'ai');
  assert.strictEqual(classifyQuery('which previous software did the brave browser author make'), 'ai');
  assert.strictEqual(classifyQuery('which is better'), 'ai');
  
  // Mid-sentence (should still trigger AI)
  assert.strictEqual(classifyQuery('tell me how to do this'), 'ai');
  assert.strictEqual(classifyQuery('I wonder what happens next'), 'ai');
  assert.strictEqual(classifyQuery('explain where this comes from'), 'ai');
  assert.strictEqual(classifyQuery('show me when to use this'), 'ai');
  assert.strictEqual(classifyQuery('describe why this works'), 'ai');
  assert.strictEqual(classifyQuery('someone who knows python'), 'ai'); // Changed from 'serp' - "who" is now detected
  assert.strictEqual(classifyQuery('tell me which one is better'), 'ai');
});

test('classifyQuery - Question starters (is, if, can, etc.)', () => {
  assert.strictEqual(classifyQuery('is this correct'), 'ai');
  assert.strictEqual(classifyQuery('if I do this what happens'), 'ai');
  assert.strictEqual(classifyQuery('can you help me'), 'ai');
  assert.strictEqual(classifyQuery('could this work'), 'ai');
  assert.strictEqual(classifyQuery('should I use typescript'), 'ai');
  assert.strictEqual(classifyQuery('would this be better'), 'ai');
  assert.strictEqual(classifyQuery('will it rain tomorrow'), 'ai');
  assert.strictEqual(classifyQuery('do I need a visa'), 'ai');
  assert.strictEqual(classifyQuery('does this work'), 'ai');
  assert.strictEqual(classifyQuery('did you know this'), 'ai');
});

test('classifyQuery - Command starters (summarize, explain, compare, etc.)', () => {
  // Core command words
  assert.strictEqual(classifyQuery('summarize this article'), 'ai');
  assert.strictEqual(classifyQuery('Summarize the key points of quantum computing'), 'ai');
  assert.strictEqual(classifyQuery('explain how neural networks work'), 'ai');
  assert.strictEqual(classifyQuery('compare react vs vue'), 'ai');
  assert.strictEqual(classifyQuery('analyze the performance metrics'), 'ai');
  assert.strictEqual(classifyQuery('describe the main features'), 'ai');
  
  // Additional command words
  assert.strictEqual(classifyQuery('evaluate this approach'), 'ai');
  assert.strictEqual(classifyQuery('calculate the total cost'), 'ai');
  assert.strictEqual(classifyQuery('define machine learning'), 'ai');
  assert.strictEqual(classifyQuery('review the code changes'), 'ai');
  assert.strictEqual(classifyQuery('discuss the implications'), 'ai');
  assert.strictEqual(classifyQuery('generate a report'), 'ai');
  assert.strictEqual(classifyQuery('critique this design'), 'ai');
  assert.strictEqual(classifyQuery('elaborate on this concept'), 'ai');
  assert.strictEqual(classifyQuery('clarify the requirements'), 'ai');
  
  // Should NOT trigger if not at the start
  assert.strictEqual(classifyQuery('please summarize'), 'serp');
  assert.strictEqual(classifyQuery('need to explain'), 'serp');
});

test('classifyQuery - Question mark', () => {
  assert.strictEqual(classifyQuery('is this a question?'), 'ai');
  assert.strictEqual(classifyQuery('can you help me?'), 'ai');
  assert.strictEqual(classifyQuery('really?'), 'ai');
});

test('classifyQuery - Commas and semicolons (complex queries)', () => {
  assert.strictEqual(classifyQuery('flight to lisbon, duration'), 'ai');
  assert.strictEqual(classifyQuery('python tips, tricks'), 'ai');
  assert.strictEqual(classifyQuery('install node; setup project'), 'ai');
  assert.strictEqual(classifyQuery('react vs vue, which is better'), 'ai');
});

test('classifyQuery - Long queries (word count >= 10)', () => {
  // Exactly 10 words
  assert.strictEqual(classifyQuery('the best way to learn programming for absolute beginners today online'), 'ai');
  // More than 10 words
  assert.strictEqual(classifyQuery('explain quantum computing in simple terms that a beginner can understand easily'), 'ai');
  assert.strictEqual(classifyQuery('the best way to learn programming for beginners without any prior experience'), 'ai');
  
  // Less than 10 words (should be SERP unless other rules match)
  assert.strictEqual(classifyQuery('best programming language for beginners'), 'serp');
});

test('classifyQuery - Short queries (SERP)', () => {
  assert.strictEqual(classifyQuery('weather'), 'serp');
  assert.strictEqual(classifyQuery('reddit'), 'serp');
  assert.strictEqual(classifyQuery('amazon'), 'serp');
  assert.strictEqual(classifyQuery('python docs'), 'serp');
});

test('classifyQuery - Navigational queries (SERP)', () => {
  assert.strictEqual(classifyQuery('facebook login'), 'serp');
  assert.strictEqual(classifyQuery('youtube'), 'serp');
  assert.strictEqual(classifyQuery('translate hello to spanish'), 'serp');
});

test('classifyQuery - Conjunction patterns (but/and + question word)', () => {
  // User's specific examples
  assert.strictEqual(classifyQuery('lisbon flights are cheap but how long are they'), 'ai');
  assert.strictEqual(classifyQuery('lisbon flights are cheap but are they long'), 'ai');
  
  // More "but" patterns
  assert.strictEqual(classifyQuery('prices are good but is this reliable'), 'ai');
  assert.strictEqual(classifyQuery('looks nice but does it work'), 'ai');
  assert.strictEqual(classifyQuery('seems easy but can I do it'), 'ai');
  assert.strictEqual(classifyQuery('not sure but should I try'), 'ai');
  
  // "and" patterns
  assert.strictEqual(classifyQuery('interesting stuff and are they available'), 'ai');
  assert.strictEqual(classifyQuery('good reviews and can I buy it'), 'ai');
});

test('classifyQuery - Edge cases', () => {
  // Empty string
  assert.strictEqual(classifyQuery(''), 'serp');
  
  // Just whitespace
  assert.strictEqual(classifyQuery('   '), 'serp');
  
  // "is" mid-sentence without conjunction (should be SERP)
  assert.strictEqual(classifyQuery('this is great'), 'serp');
  assert.strictEqual(classifyQuery('everything if possible'), 'serp');
  
  // "how" not followed by space (word boundary check)
  assert.strictEqual(classifyQuery('however'), 'serp');
  assert.strictEqual(classifyQuery('howdy'), 'serp');
  assert.strictEqual(classifyQuery('show'), 'serp');
  assert.strictEqual(classifyQuery('somehow'), 'serp');
  
  // "what" not followed by space
  assert.strictEqual(classifyQuery('whatever'), 'serp');
  assert.strictEqual(classifyQuery('somewhat'), 'serp');
  
  // "is" not followed by space
  assert.strictEqual(classifyQuery('istanbul'), 'serp');
  assert.strictEqual(classifyQuery('island'), 'serp');
  assert.strictEqual(classifyQuery('history'), 'serp');
});

test('classifyQuery - Special characters', () => {
  assert.strictEqual(classifyQuery('c++'), 'serp');
  assert.strictEqual(classifyQuery('node.js'), 'serp');
  assert.strictEqual(classifyQuery('what is c++?'), 'ai');
});

test('classifyQuery - Mixed case handling', () => {
  assert.strictEqual(classifyQuery('HOW TO FIX THIS'), 'ai');
  assert.strictEqual(classifyQuery('What Is TypeScript?'), 'ai');
  assert.strictEqual(classifyQuery('WEATHER'), 'serp');
  assert.strictEqual(classifyQuery('IS THIS CORRECT'), 'ai');
});

test('classifyQuery - Complex real-world examples', () => {
  // Original example: mid-sentence question word with comma
  assert.strictEqual(classifyQuery('flight to lisbon is 10h long, but how long is a trip to the moon'), 'ai'); // "how" + comma
  
  // Multi-part queries
  assert.strictEqual(classifyQuery('python vs javascript; which is better'), 'ai'); // semicolon
  assert.strictEqual(classifyQuery('best laptop, budget 1000'), 'ai'); // comma
  
  // Long complex queries with w-words
  assert.strictEqual(classifyQuery('I need to understand how machine learning works and what tools to use'), 'ai'); // "how" + "what" + 14 words
  
  // Conjunction patterns without w-words
  assert.strictEqual(classifyQuery('great price but is quality good'), 'ai'); // "but is"
  assert.strictEqual(classifyQuery('nice features and are they easy to use'), 'ai'); // "and are"
});

test('classifyQuery - Performance benchmark', () => {
  const iterations = 10000;
  const testQuery = 'how to optimize javascript performance';
  
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    classifyQuery(testQuery);
  }
  const end = performance.now();
  
  const avgTime = (end - start) / iterations;
  console.log(`Average classification time: ${avgTime.toFixed(4)}ms`);
  
  // Should be much faster than 1ms per query
  assert.ok(avgTime < 1, `Classification took ${avgTime}ms, expected < 1ms`);
});

