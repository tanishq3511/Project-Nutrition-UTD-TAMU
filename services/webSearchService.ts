// Web Search Service for Real-time Nutrition Information
// This service provides web search capabilities to get up-to-date nutrition data

export interface WebSearchResult {
  title: string;
  snippet: string;
  url: string;
  nutritionInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    servingSize?: string;
  };
}

export interface WebSearchService {
  searchNutrition(query: string): Promise<WebSearchResult[]>;
  searchFoodBrand(query: string): Promise<WebSearchResult[]>;
}

// DuckDuckGo Search Integration (Free alternative)
export class DuckDuckGoSearchService implements WebSearchService {
  async searchNutrition(query: string): Promise<WebSearchResult[]> {
    try {
      const searchQuery = `${query} nutrition facts calories protein carbs fat`;
      const response = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&format=json&no_html=1&skip_disambig=1`
      );

      if (!response.ok) {
        throw new Error(`DuckDuckGo API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseDuckDuckGoResults(data, query);
    } catch (error) {
      console.error('DuckDuckGo API error:', error);
      return [];
    }
  }

  async searchFoodBrand(query: string): Promise<WebSearchResult[]> {
    try {
      const searchQuery = `${query} brand nutrition label ingredients`;
      const response = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&format=json&no_html=1&skip_disambig=1`
      );

      if (!response.ok) {
        throw new Error(`DuckDuckGo API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseDuckDuckGoResults(data, query);
    } catch (error) {
      console.error('DuckDuckGo API error:', error);
      return [];
    }
  }

  private parseDuckDuckGoResults(data: any, query: string): WebSearchResult[] {
    const results: WebSearchResult[] = [];
    
    // Add abstract if available
    if (data.Abstract) {
      results.push({
        title: data.AbstractSource || query,
        snippet: data.Abstract,
        url: data.AbstractURL || '',
        nutritionInfo: this.extractNutritionFromSnippet(data.Abstract)
      });
    }
    
    // Add related topics
    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      data.RelatedTopics.slice(0, 3).forEach((topic: any) => {
        if (topic.Text) {
          results.push({
            title: topic.Text.split(' - ')[0] || query,
            snippet: topic.Text,
            url: topic.FirstURL || '',
            nutritionInfo: this.extractNutritionFromSnippet(topic.Text)
          });
        }
      });
    }
    
    return results;
  }

  private extractNutritionFromSnippet(snippet: string): any {
    const nutrition: any = {};
    
    // Extract calories
    const calorieMatch = snippet.match(/(\d+)\s*calories?/i);
    if (calorieMatch) nutrition.calories = parseInt(calorieMatch[1]);
    
    // Extract protein
    const proteinMatch = snippet.match(/(\d+(?:\.\d+)?)\s*g\s*protein/i);
    if (proteinMatch) nutrition.protein = parseFloat(proteinMatch[1]);
    
    // Extract carbs
    const carbsMatch = snippet.match(/(\d+(?:\.\d+)?)\s*g\s*carbs?/i);
    if (carbsMatch) nutrition.carbs = parseFloat(carbsMatch[1]);
    
    // Extract fat
    const fatMatch = snippet.match(/(\d+(?:\.\d+)?)\s*g\s*fat/i);
    if (fatMatch) nutrition.fat = parseFloat(fatMatch[1]);
    
    // Extract fiber
    const fiberMatch = snippet.match(/(\d+(?:\.\d+)?)\s*g\s*fiber/i);
    if (fiberMatch) nutrition.fiber = parseFloat(fiberMatch[1]);
    
    // Extract sugar
    const sugarMatch = snippet.match(/(\d+(?:\.\d+)?)\s*g\s*sugar/i);
    if (sugarMatch) nutrition.sugar = parseFloat(sugarMatch[1]);
    
    // Extract serving size
    const servingMatch = snippet.match(/(\d+(?:\.\d+)?)\s*(?:g|oz|ml|cup|tbsp|tsp)/i);
    if (servingMatch) nutrition.servingSize = servingMatch[0];
    
    return Object.keys(nutrition).length > 0 ? nutrition : undefined;
  }
}

// Mock Web Search Service for development/testing
export class MockWebSearchService implements WebSearchService {
  async searchNutrition(query: string): Promise<WebSearchResult[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Return mock results based on query
    const mockResults: WebSearchResult[] = [
      {
        title: `${query} - Nutrition Facts`,
        snippet: `Found nutrition information for ${query}: 150 calories, 10g protein, 20g carbs, 5g fat per serving.`,
        url: `https://example.com/nutrition/${encodeURIComponent(query)}`,
        nutritionInfo: {
          calories: 150,
          protein: 10,
          carbs: 20,
          fat: 5,
          servingSize: '100g'
        }
      }
    ];
    
    return mockResults;
  }

  async searchFoodBrand(query: string): Promise<WebSearchResult[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Return mock brand results
    const mockResults: WebSearchResult[] = [
      {
        title: `${query} - Brand Information`,
        snippet: `Found brand information for ${query}: Popular brand with 200 calories, 15g protein, 25g carbs, 8g fat per serving.`,
        url: `https://example.com/brand/${encodeURIComponent(query)}`,
        nutritionInfo: {
          calories: 200,
          protein: 15,
          carbs: 25,
          fat: 8,
          servingSize: '150g'
        }
      }
    ];
    
    return mockResults;
  }
}

// Factory function to create the appropriate web search service
export function createWebSearchService(type: 'duckduckgo' | 'mock', config?: any): WebSearchService {
  switch (type) {
    case 'duckduckgo':
      return new DuckDuckGoSearchService();
    
    case 'mock':
      return new MockWebSearchService();
    
    default:
      throw new Error(`Unknown web search service type: ${type}`);
  }
}

// Configuration helper
export const WebSearchConfig = {
  // Set your preferred web search service here
  service: 'duckduckgo' as 'duckduckgo' | 'mock',
  
  // Configuration for each service
  duckduckgo: {
    // DuckDuckGo is free and doesn't require API keys
  },
  
  mock: {
    // Mock service doesn't need configuration
  },
};

// Export a default configured service
export const defaultWebSearchService = createWebSearchService(WebSearchConfig.service, WebSearchConfig[WebSearchConfig.service]);
