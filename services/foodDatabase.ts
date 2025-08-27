// Food Database Service
// Provides calorie and nutrition information for common foods

import { brandRecognitionService, BrandedProduct } from './brandRecognition';

export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  servingSize: string;
  category: 'protein' | 'carbs' | 'fats' | 'vegetables' | 'fruits' | 'dairy' | 'grains' | 'snacks';
  brand?: string; // Brand name for branded products
}

export interface NutritionInfo {
  food: FoodItem;
  suggestedServing: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  brandInfo?: BrandedProduct; // Enhanced brand information
}

// Common foods database with nutrition facts
export const FOOD_DATABASE: { [key: string]: FoodItem } = {
  // Proteins
  'chicken breast': {
    name: 'Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: '100g (3.5 oz)',
    category: 'protein'
  },
  'salmon': {
    name: 'Salmon',
    calories: 208,
    protein: 25,
    carbs: 0,
    fat: 12,
    servingSize: '100g (3.5 oz)',
    category: 'protein'
  },
  'eggs': {
    name: 'Eggs',
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    servingSize: '2 large eggs',
    category: 'protein'
  },
  'tofu': {
    name: 'Tofu',
    calories: 76,
    protein: 8,
    carbs: 1.9,
    fat: 4.8,
    servingSize: '100g (3.5 oz)',
    category: 'protein'
  },
  
  // Carbohydrates
  'brown rice': {
    name: 'Brown Rice',
    calories: 111,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    fiber: 1.8,
    servingSize: '100g cooked',
    category: 'grains'
  },
  'quinoa': {
    name: 'Quinoa',
    calories: 120,
    protein: 4.4,
    carbs: 22,
    fat: 1.9,
    fiber: 2.8,
    servingSize: '100g cooked',
    category: 'grains'
  },
  'sweet potato': {
    name: 'Sweet Potato',
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
    fiber: 3,
    servingSize: '100g',
    category: 'carbs'
  },
  'banana': {
    name: 'Banana',
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    fiber: 2.6,
    sugar: 12,
    servingSize: '1 medium (118g)',
    category: 'fruits'
  },
  
  // Fats
  'avocado': {
    name: 'Avocado',
    calories: 160,
    protein: 2,
    carbs: 9,
    fat: 15,
    fiber: 7,
    servingSize: '100g',
    category: 'fats'
  },
  'almonds': {
    name: 'Almonds',
    calories: 164,
    protein: 6,
    carbs: 6,
    fat: 14,
    fiber: 3.5,
    servingSize: '28g (1 oz)',
    category: 'fats'
  },
  'olive oil': {
    name: 'Olive Oil',
    calories: 119,
    protein: 0,
    carbs: 0,
    fat: 14,
    servingSize: '1 tbsp (15ml)',
    category: 'fats'
  },
  
  // Vegetables
  'broccoli': {
    name: 'Broccoli',
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    fiber: 2.6,
    servingSize: '100g',
    category: 'vegetables'
  },
  'spinach': {
    name: 'Spinach',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    fiber: 2.2,
    servingSize: '100g',
    category: 'vegetables'
  },
  
  // Dairy
  'greek yogurt': {
    name: 'Greek Yogurt',
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    sugar: 3.2,
    servingSize: '100g',
    category: 'dairy'
  },
  'cottage cheese': {
    name: 'Cottage Cheese',
    calories: 98,
    protein: 11,
    carbs: 3.4,
    fat: 4.3,
    servingSize: '100g',
    category: 'dairy'
  },
  
  // Branded Products Examples
  'chobani greek yogurt': {
    name: 'Greek Yogurt',
    calories: 80,
    protein: 15,
    carbs: 6,
    fat: 0,
    sugar: 4,
    servingSize: '170g (6 oz)',
    category: 'dairy',
    brand: 'Chobani'
  },
  'quaker oats': {
    name: 'Old Fashioned Oats',
    calories: 150,
    protein: 5,
    carbs: 27,
    fat: 3,
    fiber: 4,
    servingSize: '40g (1/2 cup)',
    category: 'grains',
    brand: 'Quaker'
  },
  'kind bars': {
    name: 'Dark Chocolate Nuts & Sea Salt',
    calories: 200,
    protein: 6,
    carbs: 16,
    fat: 16,
    fiber: 7,
    sugar: 5,
    servingSize: '40g (1 bar)',
    category: 'snacks',
    brand: 'KIND'
  },
  'clif bars': {
    name: 'Chocolate Chip Energy Bar',
    calories: 250,
    protein: 9,
    carbs: 45,
    fat: 5,
    fiber: 4,
    sugar: 21,
    servingSize: '68g (1 bar)',
    category: 'snacks',
    brand: 'CLIF'
  },
  'protein powder': {
    name: 'Whey Protein Powder',
    calories: 120,
    protein: 24,
    carbs: 3,
    fat: 1.5,
    sugar: 1,
    servingSize: '30g (1 scoop)',
    category: 'protein',
    brand: 'Generic'
  },
  'oatmeal': {
    name: 'Instant Oatmeal',
    calories: 150,
    protein: 5,
    carbs: 27,
    fat: 3,
    fiber: 4,
    sugar: 1,
    servingSize: '40g (1 packet)',
    category: 'grains',
    brand: 'Generic'
  },
  'granola': {
    name: 'Honey Almond Granola',
    calories: 140,
    protein: 4,
    carbs: 22,
    fat: 5,
    fiber: 3,
    sugar: 8,
    servingSize: '30g (1/4 cup)',
    category: 'grains',
    brand: 'Generic'
  },
  'almond milk': {
    name: 'Unsweetened Almond Milk',
    calories: 30,
    protein: 1,
    carbs: 1,
    fat: 2.5,
    servingSize: '240ml (1 cup)',
    category: 'dairy',
    brand: 'Generic'
  },
  'protein shake': {
    name: 'Ready-to-Drink Protein Shake',
    calories: 160,
    protein: 30,
    carbs: 4,
    fat: 2,
    sugar: 1,
    servingSize: '330ml (1 bottle)',
    category: 'protein',
    brand: 'Generic'
  }
};

// Enhanced search function with brand recognition
export function searchFood(query: string): FoodItem[] {
  const searchTerm = query.toLowerCase();
  const results: FoodItem[] = [];
  
  // First, try brand recognition
  const brandResult = brandRecognitionService.recognizeBrand(query);
  
  for (const [key, food] of Object.entries(FOOD_DATABASE)) {
    // Check if the search term matches the food name, key, or brand
    const matchesName = food.name.toLowerCase().includes(searchTerm);
    const matchesKey = key.includes(searchTerm);
    const matchesBrand = food.brand && food.brand.toLowerCase().includes(searchTerm);
    
    // Enhanced brand matching with the new service
    let enhancedBrandMatch = false;
    if (brandResult && food.brand) {
      enhancedBrandMatch = food.brand.toLowerCase() === brandResult.brand.toLowerCase();
    }
    
    if (matchesName || matchesKey || matchesBrand || enhancedBrandMatch) {
      results.push(food);
    }
  }
  
  // Sort results to prioritize exact matches and branded products
  results.sort((a, b) => {
    const aExactMatch = a.name.toLowerCase() === searchTerm || (a.brand && a.brand.toLowerCase() === searchTerm);
    const bExactMatch = b.name.toLowerCase() === searchTerm || (b.brand && b.brand.toLowerCase() === searchTerm);
    
    if (aExactMatch && !bExactMatch) return -1;
    if (!aExactMatch && bExactMatch) return 1;
    
    // Prioritize branded products for brand searches
    if (a.brand && !b.brand) return -1;
    if (!a.brand && b.brand) return 1;
    
    // Prioritize high-confidence brand matches
    if (brandResult) {
      const aBrandMatch = a.brand && a.brand.toLowerCase() === brandResult.brand.toLowerCase();
      const bBrandMatch = b.brand && b.brand.toLowerCase() === brandResult.brand.toLowerCase();
      if (aBrandMatch && !bBrandMatch) return -1;
      if (!aBrandMatch && bBrandMatch) return 1;
    }
    
    return 0;
  });
  
  return results;
}

// Enhanced nutrition info function with brand recognition
export function getNutritionInfo(foodName: string, servingSize?: string): NutritionInfo | null {
  // First try to find an exact match
  let food = FOOD_DATABASE[foodName.toLowerCase()];
  
  // If no exact match, try to find by brand or partial name
  if (!food) {
    const searchResults = searchFood(foodName);
    if (searchResults.length > 0) {
      food = searchResults[0]; // Use the best match
    }
  }
  
  if (!food) return null;
  
  const serving = servingSize || food.servingSize;
  const multiplier = getServingMultiplier(serving, food.servingSize);
  
  // Get enhanced brand information
  let brandInfo: BrandedProduct | undefined;
  if (food.brand) {
    const recognizedBrand = brandRecognitionService.recognizeBrand(foodName);
    brandInfo = recognizedBrand || undefined;
  }
  
  return {
    food,
    suggestedServing: serving,
    calories: Math.round(food.calories * multiplier),
    macros: {
      protein: Math.round(food.protein * multiplier * 10) / 10,
      carbs: Math.round(food.carbs * multiplier * 10) / 10,
      fat: Math.round(food.fat * multiplier * 10) / 10
    },
    brandInfo
  };
}

// Calculate serving size multiplier
function getServingMultiplier(requestedServing: string, baseServing: string): number {
  // Simple serving size conversion
  const baseMatch = baseServing.match(/(\d+(?:\.\d+)?)/);
  const requestedMatch = requestedServing.match(/(\d+(?:\.\d+)?)/);
  
  if (baseMatch && requestedMatch) {
    const baseValue = parseFloat(baseMatch[1]);
    const requestedValue = parseFloat(requestedMatch[1]);
    return requestedValue / baseValue;
  }
  
  return 1; // Default to 1 if we can't parse
}

// Enhanced diary prompt with brand information
export function generateDiaryPrompt(food: FoodItem, nutrition: NutritionInfo): string {
  let prompt = `🍎 **${food.name}**`;
  
  // Add enhanced brand information if available
  if (nutrition.brandInfo) {
    prompt += ` (${nutrition.brandInfo.brand})`;
    if (nutrition.brandInfo.confidence >= 0.8) {
      prompt += ` - High Confidence Match`;
    }
  } else if (food.brand) {
    prompt += ` (${food.brand})`;
  }
  
  prompt += ` - ${nutrition.suggestedServing}

📊 **Nutrition Facts:**
• Calories: ${nutrition.calories}
• Protein: ${nutrition.macros.protein}g
• Carbs: ${nutrition.macros.carbs}g
• Fat: ${nutrition.macros.fat}g`;

  // Add additional nutrition info if available
  if (food.fiber) {
    prompt += `\n• Fiber: ${food.fiber}g`;
  }
  if (food.sugar) {
    prompt += `\n• Sugar: ${food.sugar}g`;
  }

  // Add brand-specific nutrition profile if available
  if (nutrition.brandInfo?.nutritionInfo) {
    const profile = nutrition.brandInfo.nutritionInfo;
    if (profile.protein === 'High') {
      prompt += `\n\n💪 **High Protein Product** - Great for muscle building and recovery!`;
    } else if (profile.organic) {
      prompt += `\n\n🌱 **Organic Product** - Made with natural ingredients!`;
    } else if (profile.vegan) {
      prompt += `\n\n🌿 **Vegan Product** - Plant-based nutrition!`;
    }
  }

  prompt += `\n\nWould you like me to add this to your diary? I can help you track your daily nutrition intake! 📝`;
  
  return prompt;
}

// New function to get brand suggestions
export function getBrandSuggestions(partialInput: string): string[] {
  return brandRecognitionService.getBrandSuggestions(partialInput);
}

// New function to get brands by category
export function getBrandsByCategory(category: string) {
  return brandRecognitionService.getBrandsByCategory(category);
}

// New function to get brands by nutrition profile
export function getBrandsByNutritionProfile(profile: string) {
  return brandRecognitionService.getBrandsByNutritionProfile(profile);
}
