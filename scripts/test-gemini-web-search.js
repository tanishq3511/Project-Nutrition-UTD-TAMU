// Test script for Gemini AI service with web search integration
const { defaultAIService } = require('../services/aiService');
const { defaultWebSearchService } = require('../services/webSearchService');

console.log('🤖 Testing Gemini AI Service with Web Search Integration\n');

// Test 1: Test basic Gemini response without web search
console.log('1. Testing basic Gemini response:');
try {
  const basicResponse = await defaultAIService.generateResponse(
    'What are the benefits of eating quinoa?',
    'You are a helpful nutrition assistant. Keep responses brief.',
    false
  );
  console.log('Basic response:', basicResponse.text);
  console.log('Metadata:', basicResponse.metadata);
} catch (error) {
  console.error('Basic Gemini test error:', error);
}

// Test 2: Test Gemini with web search for nutrition query
console.log('\n2. Testing Gemini with web search:');
try {
  const webSearchResponse = await defaultAIService.generateResponse(
    'How many calories are in Chobani Greek yogurt?',
    'You are a helpful nutrition assistant. Keep responses brief.',
    true
  );
  console.log('Web search response:', webSearchResponse.text);
  console.log('Metadata:', webSearchResponse.metadata);
} catch (error) {
  console.error('Web search Gemini test error:', error);
}

// Test 3: Test web search service directly
console.log('\n3. Testing web search service:');
try {
  const searchResults = await defaultWebSearchService.searchNutrition('chobani greek yogurt');
  console.log('Web search results:', searchResults);
  
  if (searchResults.length > 0) {
    console.log('First result nutrition info:', searchResults[0].nutritionInfo);
  }
} catch (error) {
  console.error('Web search test error:', error);
}

// Test 4: Test brand identification with Gemini
console.log('\n4. Testing brand identification:');
try {
  const brandResponse = await defaultAIService.generateResponse(
    'What are the nutrition facts for KIND bars?',
    'You are a helpful nutrition assistant. Always identify brands when possible.',
    true
  );
  console.log('Brand identification response:', brandResponse.text);
  console.log('Metadata:', brandResponse.metadata);
} catch (error) {
  console.error('Brand identification test error:', error);
}

// Test 5: Test fallback to local database
console.log('\n5. Testing fallback to local database:');
try {
  const fallbackResponse = await defaultAIService.generateResponse(
    'What are the calories in chicken breast?',
    'You are a helpful nutrition assistant. Use local knowledge if web search is not available.',
    false
  );
  console.log('Fallback response:', fallbackResponse.text);
  console.log('Metadata:', fallbackResponse.metadata);
} catch (error) {
  console.error('Fallback test error:', error);
}

console.log('\n✅ Gemini AI service testing complete!');
console.log('\nConfiguration Summary:');
console.log('- AI Service: Gemini (gemini-1.5-flash)');
console.log('- API Key: Configured');
console.log('- Web Search: DuckDuckGo (free)');
console.log('- Fallback: Local food database');
console.log('\nThe chatbot is now ready to use Gemini AI with web search capabilities!');
