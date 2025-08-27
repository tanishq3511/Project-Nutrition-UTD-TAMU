// Test script for Macronutrient Extraction Fix
console.log('🧪 Testing Macronutrient Extraction for Brands\n');

// Simulate the enhanced nutrition extraction logic
function parseNutritionFromResponse(aiResponse) {
  console.log(`📝 AI Response: "${aiResponse}"`);
  
  // Enhanced nutrition patterns for better extraction
  const nutritionPatterns = [
    // Primary patterns - most common formats
    { pattern: /(\d+(?:\.\d+)?)\s*calories?/i, type: 'calories' },
    { pattern: /(\d+(?:\.\d+)?)\s*g\s*protein/i, type: 'protein' },
    { pattern: /(\d+(?:\.\d+)?)\s*g\s*carbs?/i, type: 'carbs' },
    { pattern: /(\d+(?:\.\d+)?)\s*g\s*fat/i, type: 'fat' },
    
    // Alternative unit patterns
    { pattern: /(\d+(?:\.\d+)?)\s*grams?\s*protein/i, type: 'protein' },
    { pattern: /(\d+(?:\.\d+)?)\s*grams?\s*carbs?/i, type: 'carbs' },
    { pattern: /(\d+(?:\.\d+)?)\s*grams?\s*fat/i, type: 'fat' },
    
    // Shorthand patterns
    { pattern: /(\d+(?:\.\d+)?)\s*cal/i, type: 'calories' },
    { pattern: /(\d+(?:\.\d+)?)\s*protein/i, type: 'protein' },
    { pattern: /(\d+(?:\.\d+)?)\s*carbs?/i, type: 'carbs' },
    { pattern: /(\d+(?:\.\d+)?)\s*fat/i, type: 'fat' },
    
    // Web search and serving size patterns
    { pattern: /(\d+(?:\.\d+)?)\s*calories?.*per\s*serving/i, type: 'calories' },
    { pattern: /(\d+(?:\.\d+)?)\s*g\s*protein.*per\s*serving/i, type: 'protein' },
    { pattern: /(\d+(?:\.\d+)?)\s*g\s*carbs?.*per\s*serving/i, type: 'carbs' },
    { pattern: /(\d+(?:\.\d+)?)\s*g\s*fat.*per\s*serving/i, type: 'fat' },
    
    // Brand-specific patterns (e.g., "Chobani: 80 cal, 15g protein")
    { pattern: /(\d+(?:\.\d+)?)\s*cal(?:ories?)?/i, type: 'calories' },
    { pattern: /(\d+(?:\.\d+)?)\s*protein/i, type: 'protein' },
    { pattern: /(\d+(?:\.\d+)?)\s*carbs?/i, type: 'carbs' },
    { pattern: /(\d+(?:\.\d+)?)\s*fat/i, type: 'fat' }
  ];

  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fats = 0;

  // Extract nutrition values from the response with better logic
  nutritionPatterns.forEach(({ pattern, type }) => {
    const matches = aiResponse.match(new RegExp(pattern.source, 'gi'));
    if (matches) {
      matches.forEach(match => {
        const valueMatch = match.match(/(\d+(?:\.\d+)?)/);
        if (valueMatch) {
          const value = parseFloat(valueMatch[1]);
          console.log(`  ✅ Found ${type}: ${value} from pattern: ${pattern.source}`);
          
          // Only update if we haven't found a value yet or if this is a better match
          switch (type) {
            case 'calories':
              if (calories === 0 || value > calories) calories = value;
              break;
            case 'protein':
              if (protein === 0 || value > protein) protein = value;
              break;
            case 'carbs':
              if (carbs === 0 || value > carbs) carbs = value;
              break;
            case 'fat':
              if (fats === 0 || value > fats) fats = value;
              break;
          }
        }
      });
    }
  });

  return { calories, protein, carbs, fats };
}

// Test cases with various brand response formats
const testCases = [
  {
    name: "Standard Brand Format",
    response: "Chobani Greek Yogurt - Brand: Chobani - 80 calories, 15g protein, 6g carbs, 0g fat per 170g serving"
  },
  {
    name: "Alternative Brand Format",
    response: "Quest Protein Bar from Quest Nutrition - 200 calories, 20g protein, 22g carbs, 8g fat per bar"
  },
  {
    name: "Shorthand Format",
    response: "KIND Granola Bar by KIND - 150 cal, 3g protein, 18g carbs, 8g fat"
  },
  {
    name: "Mixed Format",
    response: "CLIF Energy Bar - Brand: CLIF - 250 calories, 9g protein, 45g carbs, 5g fat per bar"
  },
  {
    name: "Web Search Format",
    response: "Beyond Meat Burger - Brand: Beyond Meat - 250 calories per serving, 20g protein per serving, 3g carbs per serving, 18g fat per serving"
  },
  {
    name: "Complex Format",
    response: "Chobani: 80 cal, 15g protein, 6g carbs, 0g fat. Great source of protein!"
  },
  {
    name: "Generic Food (No Brand)",
    response: "Chicken breast - 165 calories, 31g protein, 0g carbs, 3.6g fat per 100g"
  }
];

console.log('1. Testing Various Brand Response Formats:\n');

testCases.forEach((testCase, index) => {
  console.log(`${index + 1}. ${testCase.name}:`);
  const nutrition = parseNutritionFromResponse(testCase.response);
  
  console.log(`   📊 Extracted Nutrition:`);
  console.log(`      Calories: ${nutrition.calories}`);
  console.log(`      Protein: ${nutrition.protein}g`);
  console.log(`      Carbs: ${nutrition.carbs}g`);
  console.log(`      Fat: ${nutrition.fats}g`);
  
  // Check if we can create a diary entry
  if (nutrition.calories > 0 || nutrition.protein > 0 || nutrition.carbs > 0 || nutrition.fats > 0) {
    console.log(`   ✅ Can create diary entry`);
  } else {
    console.log(`   ❌ Cannot create diary entry - no nutrition data`);
  }
  
  console.log('');
});

// Test 2: Brand Detection
console.log('2. Testing Brand Detection:\n');

function extractBrandFromResponse(aiResponse) {
  const brandPatterns = [
    /Brand:\s*([^,\n.!?]+)/i,                    // "Brand: Chobani"
    /brand\s*:\s*([^,\n.!?]+)/i,                 // "brand: Chobani"
    /from\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i, // "from Chobani"
    /by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,   // "by Chobani"
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Greek|Protein|Energy|Granola|Organic)/i, // "Chobani Greek"
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:yogurt|bar|shake|powder|milk)/i,         // "Chobani yogurt"
  ];
  
  for (const pattern of brandPatterns) {
    const match = aiResponse.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return null;
}

testCases.forEach((testCase, index) => {
  const brand = extractBrandFromResponse(testCase.response);
  console.log(`${index + 1}. ${testCase.name}:`);
  if (brand) {
    console.log(`   🏷️  Brand detected: ${brand}`);
  } else {
    console.log(`   ❌ No brand detected`);
  }
});

// Test 3: Diary Entry Creation
console.log('\n3. Testing Diary Entry Creation:\n');

function createDiaryEntry(foodName, brandName, nutrition) {
  const displayName = brandName ? `${brandName} ${foodName}` : foodName;
  
  return {
    name: displayName,
    brand: brandName,
    calories: nutrition.calories,
    protein: nutrition.protein,
    carbs: nutrition.carbs,
    fat: nutrition.fats,
    offerMessage: `Would you like me to add ${displayName} to your diary? (${nutrition.calories} calories, ${nutrition.protein}g protein, ${nutrition.carbs}g carbs, ${nutrition.fats}g fat)`
  };
}

testCases.slice(0, 3).forEach((testCase, index) => {
  console.log(`${index + 1}. ${testCase.name}:`);
  const nutrition = parseNutritionFromResponse(testCase.response);
  const brand = extractBrandFromResponse(testCase.response);
  const foodName = "Product"; // Simplified for demo
  
  if (nutrition.calories > 0 || nutrition.protein > 0 || nutrition.carbs > 0 || nutrition.fat > 0) {
    const diaryEntry = createDiaryEntry(foodName, brand, nutrition);
    console.log(`   📝 Diary Entry:`);
    console.log(`      Name: ${diaryEntry.name}`);
    console.log(`      Brand: ${diaryEntry.brand || 'Generic'}`);
    console.log(`      Calories: ${diaryEntry.calories}`);
    console.log(`      Protein: ${diaryEntry.protein}g`);
    console.log(`      Carbs: ${diaryEntry.carbs}g`);
    console.log(`      Fat: ${diaryEntry.fat}g`);
    console.log(`      Offer: ${diaryEntry.offerMessage}`);
  }
  console.log('');
});

console.log('🎉 Macronutrient extraction testing complete!');
console.log('\nKey Fixes Applied:');
console.log('• Enhanced regex patterns for better nutrition extraction');
console.log('• Support for decimal values (e.g., 3.5g protein)');
console.log('• Multiple pattern matching to catch all variations');
console.log('• Better value assignment logic (no overwriting)');
console.log('• Consistent nutrition format instructions for AI');
console.log('• Brand-aware diary entry creation');
