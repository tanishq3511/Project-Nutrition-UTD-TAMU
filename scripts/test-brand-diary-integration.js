// Test script for Brand Diary Integration
const { defaultAIService } = require('../services/aiService');
const { brandRecognitionService } = require('../services/brandRecognition');

console.log('🧪 Testing Brand Diary Integration\n');

// Test 1: Brand recognition with various formats
console.log('1. Testing brand recognition patterns:');
const testQueries = [
  'How many calories in Chobani Greek yogurt?',
  'What are the nutrition facts for Quest protein bar?',
  'Calories in KIND granola bar?',
  'Protein content in CLIF energy bar?',
  'Nutrition info for Quaker oats?'
];

testQueries.forEach(async (query) => {
  console.log(`\nQuery: "${query}"`);
  
  try {
    // Test brand recognition service
    const brandResult = brandRecognitionService.recognizeBrand(query);
    if (brandResult) {
      console.log(`✅ Brand recognized: ${brandResult.brand} (${brandResult.productName})`);
      console.log(`   Confidence: ${brandResult.confidence}`);
      console.log(`   Nutrition profile:`, brandResult.nutritionInfo);
    } else {
      console.log(`❌ No brand recognized`);
    }
    
    // Test AI service response (simulated)
    console.log(`🤖 AI would generate response with brand information`);
    console.log(`   Expected format: "Brand: [Brand Name]"`);
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
});

// Test 2: Diary parsing patterns
console.log('\n2. Testing diary parsing patterns:');
const diaryPatterns = [
  /Brand:\s*([^,\n.!?]+)/i,
  /brand\s*:\s*([^,\n.!?]+)/i,
  /from\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
  /by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
  /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Greek|Protein|Energy|Granola|Organic)/i,
  /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:yogurt|bar|shake|powder|milk)/i
];

const testResponses = [
  'Chobani Greek Yogurt - Brand: Chobani - 80 calories, 15g protein, 6g carbs, 0g fat per 170g serving',
  'Quest Protein Bar from Quest Nutrition - 200 calories, 20g protein, 22g carbs, 8g fat per bar',
  'KIND Granola Bar by KIND - 150 calories, 3g protein, 18g carbs, 8g fat per bar',
  'CLIF Energy Bar - 250 calories, 9g protein, 45g carbs, 5g fat per bar'
];

testResponses.forEach(response => {
  console.log(`\nResponse: "${response}"`);
  
  let brandFound = false;
  for (const pattern of diaryPatterns) {
    const match = response.match(pattern);
    if (match) {
      console.log(`✅ Brand extracted with pattern: ${pattern.source} → ${match[1]}`);
      brandFound = true;
      break;
    }
  }
  
  if (!brandFound) {
    console.log(`❌ No brand pattern matched`);
  }
});

// Test 3: Nutrition extraction
console.log('\n3. Testing nutrition extraction:');
const nutritionPatterns = [
  /(\d+)\s*calories?/i,
  /(\d+)\s*g\s*protein/i,
  /(\d+)\s*g\s*carbs?/i,
  /(\d+)\s*g\s*fat/i
];

const nutritionResponse = 'Chobani Greek Yogurt - Brand: Chobani - 80 calories, 15g protein, 6g carbs, 0g fat per 170g serving';

console.log(`Response: "${nutritionResponse}"`);

let calories = 0, protein = 0, carbs = 0, fat = 0;

nutritionPatterns.forEach(pattern => {
  const match = nutritionResponse.match(pattern);
  if (match) {
    const value = parseInt(match[1]);
    if (pattern.source.includes('calories')) calories = value;
    else if (pattern.source.includes('protein')) protein = value;
    else if (pattern.source.includes('carbs')) carbs = value;
    else if (pattern.source.includes('fat')) fat = value;
  }
});

console.log(`📊 Extracted nutrition:`);
console.log(`   Calories: ${calories}`);
console.log(`   Protein: ${protein}g`);
console.log(`   Carbs: ${carbs}g`);
console.log(`   Fat: ${fat}g`);

// Test 4: Diary offer generation
console.log('\n4. Testing diary offer generation:');
if (calories > 0 || protein > 0 || carbs > 0 || fat > 0) {
  const brandMatch = nutritionResponse.match(/Brand:\s*([^,\n.!?]+)/i);
  const brandName = brandMatch ? brandMatch[1].trim() : '';
  
  let foodName = 'Greek Yogurt'; // Simplified for demo
  let displayName = brandName ? `${brandName} ${foodName}` : foodName;
  
  const offerMessage = `Would you like me to add ${displayName} to your diary? (${calories} calories, ${protein}g protein, ${carbs}g carbs, ${fat}g fat)`;
  
  console.log(`📝 Diary offer: ${offerMessage}`);
  console.log(`   Food name: ${displayName}`);
  console.log(`   Brand: ${brandName || 'Generic'}`);
} else {
  console.log(`❌ No nutrition data to create diary offer`);
}

console.log('\n🎉 Brand diary integration testing complete!');
console.log('\nKey Improvements Made:');
console.log('• Enhanced brand detection with multiple patterns');
console.log('• Better nutrition extraction from AI responses');
console.log('• Consistent "Brand: [Name]" format');
console.log('• Improved diary offer generation');
console.log('• Better integration with brand recognition service');
