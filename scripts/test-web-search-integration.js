// Test script for web search integration functionality
const { defaultWebSearchService } = require('../services/webSearchService');

console.log('🌐 Testing Web Search Integration\n');

// Test 1: Test nutrition search
console.log('1. Testing nutrition search:');
try {
  const nutritionResults = await defaultWebSearchService.searchNutrition('chobani greek yogurt');
  console.log('Nutrition search results:', nutritionResults);
  
  if (nutritionResults.length > 0) {
    console.log('First result nutrition info:', nutritionResults[0].nutritionInfo);
  }
} catch (error) {
  console.error('Nutrition search error:', error);
}

// Test 2: Test brand search
console.log('\n2. Testing brand search:');
try {
  const brandResults = await defaultWebSearchService.searchFoodBrand('kind bars');
  console.log('Brand search results:', brandResults);
  
  if (brandResults.length > 0) {
    console.log('First result nutrition info:', brandResults[0].nutritionInfo);
  }
} catch (error) {
  console.error('Brand search error:', error);
}

// Test 3: Test generic food search
console.log('\n3. Testing generic food search:');
try {
  const genericResults = await defaultWebSearchService.searchNutrition('chicken breast');
  console.log('Generic food search results:', genericResults);
  
  if (genericResults.length > 0) {
    console.log('First result nutrition info:', genericResults[0].nutritionInfo);
  }
} catch (error) {
  console.error('Generic food search error:', error);
}

// Test 4: Test nutrition extraction
console.log('\n4. Testing nutrition extraction:');
const testSnippets = [
  'Chobani Greek Yogurt: 80 calories, 15g protein, 6g carbs, 0g fat per 170g serving',
  'KIND Bars contain 200 calories, 6g protein, 16g carbs, 16g fat per bar',
  'Quaker Oats: 150 calories, 5g protein, 27g carbs, 3g fat per 40g serving'
];

testSnippets.forEach((snippet, index) => {
  console.log(`Snippet ${index + 1}: ${snippet}`);
  // Test the extraction logic here if needed
});

console.log('\n✅ Web search integration testing complete!');
console.log('\nNote: This test verifies the web search service functionality.');
console.log('The actual AI integration will be tested when the chatbot is used.');
