// Test script for brand identification functionality
const { searchFood, getNutritionInfo, generateDiaryPrompt } = require('../services/foodDatabase.ts');

console.log('🧪 Testing Brand Identification Functionality\n');

// Test 1: Search for branded products
console.log('1. Testing brand search:');
console.log('Searching for "chobani":', searchFood('chobani'));
console.log('Searching for "quaker":', searchFood('quaker'));
console.log('Searching for "kind":', searchFood('kind'));
console.log('Searching for "clif":', searchFood('clif'));

// Test 2: Search for generic foods
console.log('\n2. Testing generic food search:');
console.log('Searching for "chicken":', searchFood('chicken'));
console.log('Searching for "rice":', searchFood('rice'));
console.log('Searching for "apple":', searchFood('apple'));

// Test 3: Get nutrition info for branded products
console.log('\n3. Testing nutrition info for branded products:');
const chobaniInfo = getNutritionInfo('chobani greek yogurt');
if (chobaniInfo) {
  console.log('Chobani Greek Yogurt:', chobaniInfo);
  console.log('Diary prompt:', generateDiaryPrompt(chobaniInfo.food, chobaniInfo));
}

// Test 4: Get nutrition info for generic foods
console.log('\n4. Testing nutrition info for generic foods:');
const chickenInfo = getNutritionInfo('chicken breast');
if (chickenInfo) {
  console.log('Chicken Breast:', chickenInfo);
  console.log('Diary prompt:', generateDiaryPrompt(chickenInfo.food, chickenInfo));
}

// Test 5: Test brand-specific searches
console.log('\n5. Testing brand-specific searches:');
console.log('Searching for "greek yogurt":', searchFood('greek yogurt'));
console.log('Searching for "oats":', searchFood('oats'));
console.log('Searching for "energy bar":', searchFood('energy bar'));

console.log('\n✅ Brand identification testing complete!');
