// AI Service for Chatbot Integration
// This file provides a clean interface for Gemini AI integration

export interface AIResponse {
  text: string;
  confidence?: number;
  metadata?: any;
  webSearchResults?: any[]; // Web search results for nutrition queries
}

export interface AIService {
  generateResponse(message: string, context?: string, useWebSearch?: boolean): Promise<AIResponse>;
}

// Google Gemini Integration
export class GeminiService implements AIService {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'gemini-1.5-flash') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateResponse(message: string, context?: string, useWebSearch: boolean = false): Promise<AIResponse> {
    try {
      // Enhanced context for web search capabilities and brand identification
      let enhancedContext = context || `You are Nutribot, an expert nutritionist and certified personal trainer with 15+ years of experience. You specialize in sports nutrition, meal planning, and fitness optimization. Provide detailed, actionable advice that includes specific recommendations, examples, and practical tips. Always consider the user\'s goals, experience level, and preferences. Give comprehensive responses that educate and empower users to make informed decisions about their health and fitness journey. 

CRITICAL BRAND IDENTIFICATION INSTRUCTIONS:
- When discussing ANY packaged foods, snacks, or beverages, ALWAYS identify and mention the specific brand name
- Use the exact format: "Brand: [Brand Name]" in your response
- For generic foods (chicken, rice, apple), provide standard nutrition facts without brand
- For branded products (Chobani yogurt, Quest bar, KIND snack), ALWAYS include "Brand: [Brand Name]"
- This is essential for proper diary tracking and user experience

NUTRITION FORMAT INSTRUCTIONS:
- Always provide nutrition information in this exact format: "X calories, Xg protein, Xg carbs, Xg fat"
- Use consistent units: calories, grams (g) for protein/carbs/fat
- Include serving size information when relevant
- Examples:
  * "Chobani Greek Yogurt - Brand: Chobani - 80 calories, 15g protein, 6g carbs, 0g fat per 170g serving"
  * "Quest Protein Bar - Brand: Quest - 200 calories, 20g protein, 22g carbs, 8g fat per bar"
  * "Chicken breast - 165 calories, 31g protein, 0g carbs, 3.6g fat per 100g"`;
      
      if (useWebSearch) {
        enhancedContext += `\n\nWEB SEARCH CAPABILITIES: You have access to real-time web search results for nutrition information. Use this data to provide the most up-to-date and accurate nutrition facts for any food, brand, or product. Always cite your sources when using web search results.

WEB SEARCH BRAND INSTRUCTIONS:
- When using web search results, prioritize brand information from official sources
- Extract brand names from product titles, descriptions, and nutrition labels
- Always format brand information as "Brand: [Brand Name]" for consistency
- Use web search data to provide current, accurate nutrition facts for branded products

WEB SEARCH NUTRITION FORMAT:
- Extract and present nutrition data in consistent format: "X calories, Xg protein, Xg carbs, Xg fat"
- Always include all four macronutrients when available
- Use the most accurate, current data from web search results
- Maintain the exact format for proper diary integration`;
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${enhancedContext}\n\nUser question: ${message}`
                }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 1500,
            temperature: 0.7,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        text: data.candidates[0].content.parts[0].text,
        confidence: 0.9,
        metadata: { model: this.model, webSearchUsed: useWebSearch }
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }
}

// Mock AI Service for development/testing
export class MockAIService implements AIService {
  async generateResponse(message: string): Promise<AIResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Default response for questions
    const responses = [
      "That's a great nutrition question! For personalized advice, consider consulting with a registered dietitian.",
      "I'd be happy to help with nutrition advice. Could you provide more specific details about your question?",
      "That's an interesting topic in nutrition. What specific aspect would you like to know more about?",
      "Great question about health and nutrition! To get the most accurate advice, could you clarify your goals?",
    ];
    
    return {
      text: responses[Math.floor(Math.random() * responses.length)] + 
             " (This is a mock response. Configure a real AI service for full functionality.)",
      confidence: 0.6,
      metadata: { service: 'mock' }
    };
  }
}
// Factory function to create the appropriate AI service
export function createAIService(type: 'gemini' | 'mock', config?: any): AIService {
  switch (type) {
    case 'gemini':
      if (!config?.apiKey) {
        throw new Error('Gemini API key is required');
      }
      return new GeminiService(config.apiKey, config.model);
    
    case 'mock':
      return new MockAIService();
    
    default:
      throw new Error(`Unknown AI service type: ${type}`);
  }
}

// Configuration helper
export const AIConfig = {
  // Set your preferred AI service here
  service: 'gemini' as 'gemini' | 'mock',
  
  // Configuration for Gemini service
  gemini: {
  apiKey: 'AIzaSyAh4oo2fhG58cWEB-I1JeAmnoDzeIIgGoo',
    model: 'gemini-1.5-flash',
  },
  
  mock: {
    // Mock service doesn't need configuration
  },
  
  // Web search configuration
  webSearch: {
    enabled: true, // Enable web search by default
    service: 'duckduckgo', // Use DuckDuckGo as default (free)
    fallbackToLocal: true, // Fall back to local database if web search fails
  },
};

// Export a default configured service
export const defaultAIService = createAIService(AIConfig.service, AIConfig[AIConfig.service]);

