// Enhanced Brand Recognition Service
// Provides sophisticated brand detection and matching for food products

export interface BrandInfo {
  name: string;
  aliases: string[];
  category: 'dairy' | 'snacks' | 'beverages' | 'protein' | 'grains' | 'frozen' | 'canned' | 'condiments';
  commonProducts: string[];
  nutritionProfile: 'high-protein' | 'low-carb' | 'organic' | 'vegan' | 'gluten-free' | 'keto-friendly' | 'standard';
}

export interface BrandedProduct {
  brand: string;
  productName: string;
  fullName: string;
  confidence: number;
  nutritionInfo?: any;
}

// Comprehensive brand database with aliases and common misspellings
export const BRAND_DATABASE: { [key: string]: BrandInfo } = {
  'chobani': {
    name: 'Chobani',
    aliases: ['chobani', 'chobani greek', 'chobani yogurt', 'chobani greek yogurt'],
    category: 'dairy',
    commonProducts: ['greek yogurt', 'yogurt', 'oat milk', 'almond milk'],
    nutritionProfile: 'high-protein'
  },
  'quaker': {
    name: 'Quaker',
    aliases: ['quaker', 'quaker oats', 'quaker oatmeal', 'quaker instant'],
    category: 'grains',
    commonProducts: ['oats', 'oatmeal', 'instant oats', 'steel cut oats'],
    nutritionProfile: 'standard'
  },
  'kind': {
    name: 'KIND',
    aliases: ['kind', 'kind bar', 'kind bars', 'kind snack', 'kind healthy'],
    category: 'snacks',
    commonProducts: ['granola bars', 'nuts', 'dried fruit', 'protein bars'],
    nutritionProfile: 'organic'
  },
  'clif': {
    name: 'CLIF',
    aliases: ['clif', 'clif bar', 'clif bars', 'clif energy', 'clif protein'],
    category: 'snacks',
    commonProducts: ['energy bars', 'protein bars', 'granola bars'],
    nutritionProfile: 'organic'
  },
  'quest': {
    name: 'Quest',
    aliases: ['quest', 'quest bar', 'quest bars', 'quest protein', 'quest nutrition'],
    category: 'protein',
    commonProducts: ['protein bars', 'protein chips', 'protein cookies'],
    nutritionProfile: 'high-protein'
  },
  'protein': {
    name: 'Protein',
    aliases: ['protein', 'protein powder', 'protein shake', 'protein bar'],
    category: 'protein',
    commonProducts: ['whey protein', 'casein protein', 'plant protein'],
    nutritionProfile: 'high-protein'
  },
  'atkins': {
    name: 'Atkins',
    aliases: ['atkins', 'atkins bar', 'atkins bars', 'atkins diet'],
    category: 'snacks',
    commonProducts: ['protein bars', 'shakes', 'snacks'],
    nutritionProfile: 'low-carb'
  },
  'thinkthin': {
    name: 'ThinkThin',
    aliases: ['thinkthin', 'think thin', 'think thin bar'],
    category: 'snacks',
    commonProducts: ['protein bars', 'snack bars'],
    nutritionProfile: 'high-protein'
  },
  'rxbar': {
    name: 'RXBAR',
    aliases: ['rxbar', 'rx bar', 'rx bars', 'rx protein'],
    category: 'snacks',
    commonProducts: ['protein bars', 'energy bars'],
    nutritionProfile: 'organic'
  },
  'larabar': {
    name: 'LÄRABAR',
    aliases: ['larabar', 'lara bar', 'lara bars', 'lara'],
    category: 'snacks',
    commonProducts: ['fruit bars', 'energy bars'],
    nutritionProfile: 'organic'
  },
  'siggi': {
    name: 'Siggi\'s',
    aliases: ['siggi', 'siggis', 'siggi yogurt', 'siggi skyr'],
    category: 'dairy',
    commonProducts: ['skyr yogurt', 'icelandic yogurt'],
    nutritionProfile: 'high-protein'
  },
  'fage': {
    name: 'FAGE',
    aliases: ['fage', 'fage yogurt', 'fage greek'],
    category: 'dairy',
    commonProducts: ['greek yogurt', 'total yogurt'],
    nutritionProfile: 'high-protein'
  },
  'dannon': {
    name: 'Dannon',
    aliases: ['dannon', 'danone', 'dannon yogurt', 'dannon greek'],
    category: 'dairy',
    commonProducts: ['yogurt', 'greek yogurt', 'drinkable yogurt'],
    nutritionProfile: 'standard'
  },
  'yoplait': {
    name: 'Yoplait',
    aliases: ['yoplait', 'yoplait yogurt', 'yoplait greek'],
    category: 'dairy',
    commonProducts: ['yogurt', 'greek yogurt', 'drinkable yogurt'],
    nutritionProfile: 'standard'
  },
  'stonyfield': {
    name: 'Stonyfield',
    aliases: ['stonyfield', 'stony field', 'stonyfield organic'],
    category: 'dairy',
    commonProducts: ['organic yogurt', 'milk', 'smoothies'],
    nutritionProfile: 'organic'
  },
  'chobani': {
    name: 'Chobani',
    aliases: ['chobani', 'chobani greek', 'chobani yogurt'],
    category: 'dairy',
    commonProducts: ['greek yogurt', 'oat milk', 'almond milk'],
    nutritionProfile: 'high-protein'
  }
};

// Enhanced brand recognition with fuzzy matching
export class BrandRecognitionService {
  private brandDatabase: { [key: string]: BrandInfo };

  constructor() {
    this.brandDatabase = BRAND_DATABASE;
  }

  // Main brand recognition function
  recognizeBrand(query: string): BrandedProduct | null {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Try exact brand match first
    const exactBrand = this.findExactBrand(normalizedQuery);
    if (exactBrand) {
      return this.createBrandedProduct(exactBrand, query, 1.0);
    }

    // Try fuzzy brand matching
    const fuzzyBrand = this.findFuzzyBrand(normalizedQuery);
    if (fuzzyBrand) {
      return this.createBrandedProduct(fuzzyBrand, query, 0.8);
    }

    // Try to extract brand from product description
    const extractedBrand = this.extractBrandFromDescription(normalizedQuery);
    if (extractedBrand) {
      return this.createBrandedProduct(extractedBrand, query, 0.7);
    }

    // Try partial brand matching
    const partialBrand = this.findPartialBrand(normalizedQuery);
    if (partialBrand) {
      return this.createBrandedProduct(partialBrand, query, 0.6);
    }

    return null;
  }

  // Find exact brand match
  private findExactBrand(query: string): BrandInfo | null {
    return this.brandDatabase[query] || null;
  }

  // Find fuzzy brand match using Levenshtein distance
  private findFuzzyBrand(query: string): BrandInfo | null {
    let bestMatch: BrandInfo | null = null;
    let bestDistance = Infinity;

    for (const [brandKey, brandInfo] of Object.entries(this.brandDatabase)) {
      // Check brand name
      const brandDistance = this.levenshteinDistance(query, brandKey);
      if (brandDistance < bestDistance && brandDistance <= 2) {
        bestDistance = brandDistance;
        bestMatch = brandInfo;
      }

      // Check aliases
      for (const alias of brandInfo.aliases) {
        const aliasDistance = this.levenshteinDistance(query, alias);
        if (aliasDistance < bestDistance && aliasDistance <= 2) {
          bestDistance = aliasDistance;
          bestMatch = brandInfo;
        }
      }
    }

    return bestMatch;
  }

  // Extract brand from product description
  private extractBrandFromDescription(query: string): BrandInfo | null {
    const words = query.split(/\s+/);
    
    for (const word of words) {
      if (word.length >= 3) { // Only check words with 3+ characters
        const brand = this.findExactBrand(word) || this.findFuzzyBrand(word);
        if (brand) {
          return brand;
        }
      }
    }

    return null;
  }

  // Find partial brand match
  private findPartialBrand(query: string): BrandInfo | null {
    for (const [brandKey, brandInfo] of Object.entries(this.brandDatabase)) {
      if (query.includes(brandKey) || brandKey.includes(query)) {
        return brandInfo;
      }
      
      // Check aliases
      for (const alias of brandInfo.aliases) {
        if (query.includes(alias) || alias.includes(query)) {
          return brandInfo;
        }
      }
    }

    return null;
  }

  // Create branded product object
  private createBrandedProduct(brand: BrandInfo, query: string, confidence: number): BrandedProduct {
    // Extract product name from query
    const productName = this.extractProductName(query, brand);
    
    return {
      brand: brand.name,
      productName,
      fullName: `${brand.name} ${productName}`.trim(),
      confidence,
      nutritionInfo: this.getBrandNutritionProfile(brand)
    };
  }

  // Extract product name from query
  private extractProductName(query: string, brand: BrandInfo): string {
    let productName = query;
    
    // Remove brand name and aliases
    for (const alias of brand.aliases) {
      productName = productName.replace(new RegExp(alias, 'gi'), '').trim();
    }
    
    // Clean up extra spaces and common words
    productName = productName.replace(/\s+/g, ' ').trim();
    
    // Remove common filler words
    const fillerWords = ['brand', 'product', 'food', 'item', 'the', 'a', 'an'];
    for (const word of fillerWords) {
      productName = productName.replace(new RegExp(`\\b${word}\\b`, 'gi'), '').trim();
    }
    
    return productName || 'Product';
  }

  // Get nutrition profile for brand
  private getBrandNutritionProfile(brand: BrandInfo): any {
    switch (brand.nutritionProfile) {
      case 'high-protein':
        return { protein: 'High', carbs: 'Low-Moderate', fat: 'Low-Moderate' };
      case 'low-carb':
        return { protein: 'Moderate-High', carbs: 'Very Low', fat: 'Moderate-High' };
      case 'organic':
        return { organic: true, natural: true };
      case 'vegan':
        return { vegan: true, plantBased: true };
      case 'gluten-free':
        return { glutenFree: true };
      case 'keto-friendly':
        return { keto: true, lowCarb: true, highFat: true };
      default:
        return { standard: true };
    }
  }

  // Calculate Levenshtein distance for fuzzy matching
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // Get all brands for a specific category
  getBrandsByCategory(category: string): BrandInfo[] {
    return Object.values(this.brandDatabase).filter(brand => brand.category === category);
  }

  // Get all brands with a specific nutrition profile
  getBrandsByNutritionProfile(profile: string): BrandInfo[] {
    return Object.values(this.brandDatabase).filter(brand => brand.nutritionProfile === profile);
  }

  // Add new brand to database
  addBrand(brandKey: string, brandInfo: BrandInfo): void {
    this.brandDatabase[brandKey.toLowerCase()] = brandInfo;
  }

  // Get brand suggestions for partial input
  getBrandSuggestions(partialInput: string): string[] {
    const suggestions: string[] = [];
    const input = partialInput.toLowerCase();
    
    for (const [brandKey, brandInfo] of Object.entries(this.brandDatabase)) {
      if (brandKey.startsWith(input) || brandInfo.name.toLowerCase().startsWith(input)) {
        suggestions.push(brandInfo.name);
      }
      
      // Check aliases
      for (const alias of brandInfo.aliases) {
        if (alias.startsWith(input)) {
          suggestions.push(brandInfo.name);
          break;
        }
      }
    }
    
    return [...new Set(suggestions)].slice(0, 5); // Return top 5 unique suggestions
  }
}

// Export default instance
export const brandRecognitionService = new BrandRecognitionService();
