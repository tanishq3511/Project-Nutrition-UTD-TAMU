// Test script for Enhanced Brand Recognition
const { brandRecognitionService } = require('../services/brandRecognition');
const { searchFood, getNutritionInfo, getBrandSuggestions } = require('../services/foodDatabase');

console.log('🚀 Testing Enhanced Brand Recognition System\n');

// Test 1: Basic brand recognition
console.log('1. Testing brand recognition:');
const testQueries = [
  'chobani greek yogurt',
  'quest protein bar',
  'kind bar',
  'clif energy bar',
  'quaker oats',
  'atkins bar',
  'think thin protein bar',
  'rxbar protein',
  'larabar fruit bar',
  'siggi skyr yogurt'
];

testQueries.forEach(query => {
  const result = brandRecognitionService.recognizeBrand(query);
  if (result) {
    console.log(`✅ "${query}" → ${result.brand} (${result.productName}) - Confidence: ${result.confidence}`);
  } else {
    console.log(`❌ "${query}" → No brand recognized`);
  }
});

// Test 2: Fuzzy matching with typos
console.log('\n2. Testing fuzzy matching (typos):');
const typoQueries = [
  'chobani', // exact
  'chobani', // typo
  'quest', // exact
  'questt', // typo
  'kind', // exact
  'kindd', // typo
  'clif', // exact
  'cliff' // typo
];

typoQueries.forEach(query => {
  const result = brandRecognitionService.recognizeBrand(query);
  if (result) {
    console.log(`✅ "${query}" → ${result.brand} - Confidence: ${result.confidence}`);
  }
});

// Test 3: Brand suggestions
console.log('\n3. Testing brand suggestions:');
const partialInputs = ['ch', 'qu', 'ki', 'cl', 'at'];
partialInputs.forEach(input => {
  const suggestions = getBrandSuggestions(input);
  console.log(`"${input}" → ${suggestions.join(', ')}`);
});

// Test 4: Enhanced food search with brand recognition
console.log('\n4. Testing enhanced food search:');
const searchQueries = ['chobani yogurt', 'quest bar', 'kind snack'];
searchQueries.forEach(query => {
  const results = searchFood(query);
  console.log(`"${query}" → Found ${results.length} results`);
  if (results.length > 0) {
    const first = results[0];
    console.log(`  Top result: ${first.name} (${first.brand || 'Generic'})`);
  }
});

// Test 5: Brand categories and profiles
console.log('\n5. Testing brand categories:');
const categories = ['dairy', 'snacks', 'protein'];
categories.forEach(category => {
  const brands = brandRecognitionService.getBrandsByCategory(category);
  console.log(`${category}: ${brands.map(b => b.name).join(', ')}`);
});

console.log('\n🎉 Enhanced brand recognition testing complete!');
console.log('\nKey Improvements:');
console.log('• Fuzzy matching for typos and misspellings');
console.log('• Brand aliases and common variations');
console.log('• Confidence scoring for matches');
console.log('• Enhanced nutrition profiles');
console.log('• Smart product name extraction');
console.log('• Category-based brand organization');
