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
import { scrapeNutritionFromUrl } from './menuScraper';

export class DuckDuckGoSearchService implements WebSearchService {
  private cache: Map<string, WebSearchResult[]> = new Map();
  async searchNutrition(query: string): Promise<WebSearchResult[]> {
    const cacheKey = `nutrition:${query.toLowerCase().trim()}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey)!;

    try {
      const searchQuery = `${query} nutrition facts calories protein carbs fat`;
      const response = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&format=json&no_html=1&skip_disambig=1`
      );

      if (!response.ok) {
        throw new Error(`DuckDuckGo API error: ${response.status}`);
      }

      const data = await response.json();
      const results = this.parseDuckDuckGoResults(data, query);
      this.cache.set(cacheKey, results);
      return results;
    } catch (error) {
      console.error('DuckDuckGo API error:', error);
      return [];
    }
  }

  async searchFoodBrand(query: string): Promise<WebSearchResult[]> {
    const cacheKey = `brand:${query.toLowerCase().trim()}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey)!;

    try {
      const searchQuery = `${query} brand nutrition label ingredients`;
      const response = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&format=json&no_html=1&skip_disambig=1`
      );

      if (!response.ok) {
        throw new Error(`DuckDuckGo API error: ${response.status}`);
      }

      const data = await response.json();
      const results = this.parseDuckDuckGoResults(data, query);
      this.cache.set(cacheKey, results);
      return results;
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
      data.RelatedTopics.slice(0, 6).forEach((topic: any) => {
        // Try different shapes of topic
        const text = topic.Text || (topic.Topics && topic.Topics.map((t: any) => t.Text).join(' ')) || '';
        if (text) {
          const nutrition = this.extractNutritionFromSnippet(text);
          results.push({
            title: text.split(' - ')[0] || query,
            snippet: text,
            url: topic.FirstURL || '',
            nutritionInfo: nutrition
          });
        }
      });
    }
    
    return results;
  }

  private extractNutritionFromSnippet(snippet: string): any {
    const nutrition: any = {};

    // Normalize snippet spacing
    const normalized = snippet.replace(/\s+/g, ' ');

    // Flexible patterns for calories (cal, kcal)
    const calorieMatch = normalized.match(/(\d{2,4}(?:\.\d+)?)\s*(?:k?cal|calories?)/i);
    if (calorieMatch) nutrition.calories = Math.round(parseFloat(calorieMatch[1]));

    // Macros (g) patterns - match label then number or number then label
    // Match patterns like "Protein: 28 g", "Protein 28g", "28 g protein", "carbs: 20"
    const macros = {
      protein: /(?:protein)[:\s]*?(\d+(?:\.\d+)?)(?:\s*g)?/i,
      carbs: /(?:carbs?|carbohydrates?)[:\s]*?(\d+(?:\.\d+)?)(?:\s*g)?/i,
      fat: /(?:fat)[:\s]*?(\d+(?:\.\d+)?)(?:\s*g)?/i
    };
    for (const [key, pat] of Object.entries(macros)) {
      const m = normalized.match(pat as RegExp);
      if (m) nutrition[key] = parseFloat(m[1]);
      else {
        // fallback to look for number + g + label
        const alt = normalized.match(new RegExp("(\\d+(?:\\.\\d+)?)\\s*g\\s*" + key, 'i'));
        if (alt) nutrition[key] = parseFloat(alt[1]);
      }
    }

    // Fiber and sugar
    const fiberMatch = normalized.match(/(\d+(?:\.\d+)?)\s*g\s*fiber/i);
    if (fiberMatch) nutrition.fiber = parseFloat(fiberMatch[1]);
    const sugarMatch = normalized.match(/(\d+(?:\.\d+)?)\s*g\s*sugar/i);
    if (sugarMatch) nutrition.sugar = parseFloat(sugarMatch[1]);

    // Serving size heuristics
    const servingMatch = normalized.match(/per\s*serving[:\s]*([\d\.]+\s*(?:g|oz|ml|cup|tbsp|tsp))/i) || normalized.match(/serving size[:\s]*([\d\.]+\s*(?:g|oz|ml|cup|tbsp|tsp))/i);
    if (servingMatch) nutrition.servingSize = servingMatch[1];

    return Object.keys(nutrition).length > 0 ? nutrition : undefined;
  }

  // Return best nutrition result from web search results based on available fields and heuristic scoring
  async getBestNutrition(query: string): Promise<WebSearchResult | undefined> {
    // Combine nutrition-focused and brand-focused results to improve coverage for macros
    const nutritionResults = await this.searchNutrition(query);
    const brandResults = await this.searchFoodBrand(query);
    const combined = [...(nutritionResults || []), ...(brandResults || [])];
    if (!combined || combined.length === 0) return undefined;

    // Deduplicate by url/snippet
    const uniqMap = new Map<string, WebSearchResult>();
    for (const r of combined) {
      const key = (r.url || r.snippet || r.title).slice(0, 200);
      if (!uniqMap.has(key)) uniqMap.set(key, r);
      else {
        // Merge nutrition info if existing entry lacks fields
        const existing = uniqMap.get(key)!;
        if (!existing.nutritionInfo && r.nutritionInfo) existing.nutritionInfo = r.nutritionInfo;
        else if (existing.nutritionInfo && r.nutritionInfo) {
          existing.nutritionInfo = { ...r.nutritionInfo, ...existing.nutritionInfo };
        }
      }
    }

    const results = Array.from(uniqMap.values());

    // Try scraping known chain pages to enrich nutrition info
    await Promise.all(results.map(async (r) => {
      try {
        if (r.url && (!r.nutritionInfo || Object.keys(r.nutritionInfo).length < 3)) {
          const scraped = await scrapeNutritionFromUrl(r.url);
          if (scraped) {
            r.nutritionInfo = { ...(r.nutritionInfo || {}), ...scraped };
          }
        }
      } catch (e) {
        // ignore scraper errors
      }
    }));

    // Score results: prefer those with explicit nutritionInfo and more complete macro fields
    const scored = results.map(r => {
      let score = 0;
      if (r.nutritionInfo) score += 20;
      if (r.nutritionInfo?.calories) score += 6;
      if (r.nutritionInfo?.protein) score += 5;
      if (r.nutritionInfo?.carbs) score += 4;
      if (r.nutritionInfo?.fat) score += 4;
      // Higher weight for more complete macros
      const macroCount = ['calories', 'protein', 'carbs', 'fat'].reduce((c, f) => c + (r.nutritionInfo && (r.nutritionInfo as any)[f] ? 1 : 0), 0);
      score += macroCount * 3;
      // Shorter, focused snippets get a slight boost
      score += Math.max(0, 5 - (r.snippet ? r.snippet.length / 300 : 0));
      return { r, score };
    }).sort((a, b) => b.score - a.score);

    return scored[0].r;
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
