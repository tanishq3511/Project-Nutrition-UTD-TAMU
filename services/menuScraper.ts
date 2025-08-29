const fetch = require('node-fetch');
const cheerio = require('cheerio');

export interface ScrapedNutrition {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  servingSize?: string;
}

// Simple scraper for Chick-fil-A menu pages (extendable to other chains)
export async function scrapeChickFilANutrition(url: string): Promise<ScrapedNutrition | undefined> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return undefined;
    const html = await res.text();
    const $ = cheerio.load(html);

    // Try JSON-LD first
  const jsonLd = $('script[type="application/ld+json"]').map((i: number, el: any) => $(el).html()).get();
    for (const j of jsonLd) {
      try {
        const parsed = JSON.parse(j as string);
        // Look for nutrition property
        if (parsed && parsed.nutrition) {
          const n = parsed.nutrition;
          return {
            calories: n.calories ? parseInt(String(n.calories).replace(/\D/g, '')) : undefined,
            protein: n.proteinContent ? parseFloat(String(n.proteinContent).replace(/\D/g, '')) : undefined,
            carbs: n.carbohydrateContent ? parseFloat(String(n.carbohydrateContent).replace(/\D/g, '')) : undefined,
            fat: n.fatContent ? parseFloat(String(n.fatContent).replace(/\D/g, '')) : undefined,
            servingSize: n.servingSize || undefined
          };
        }
      } catch (e) {
        // ignore JSON parse errors
      }
    }

    // Fallback: look for nutrition table in HTML
    const text = $('body').text();
    const calorieMatch = text.match(/(\d{2,4})\s*(?:k?cal|calories?)/i);
    const proteinMatch = text.match(/Protein[:\s]*?(\d+(?:\.\d+)?)/i) || text.match(/(\d+(?:\.\d+)?)\s*g\s*protein/i);
    const carbsMatch = text.match(/Carbohydrates?[:\s]*?(\d+(?:\.\d+)?)/i) || text.match(/(\d+(?:\.\d+)?)\s*g\s*carbs?/i);
    const fatMatch = text.match(/Fat[:\s]*?(\d+(?:\.\d+)?)/i) || text.match(/(\d+(?:\.\d+)?)\s*g\s*fat/i);

    const result: ScrapedNutrition = {};
    if (calorieMatch) result.calories = parseInt(calorieMatch[1]);
    if (proteinMatch) result.protein = parseFloat(proteinMatch[1]);
    if (carbsMatch) result.carbs = parseFloat(carbsMatch[1]);
    if (fatMatch) result.fat = parseFloat(fatMatch[1]);

    return Object.keys(result).length > 0 ? result : undefined;
  } catch (error) {
    console.error('Chick-fil-A scraper error:', error);
    return undefined;
  }
}

// Generic scraper helpers for other chains
async function scrapeGenericNutrition(url: string): Promise<ScrapedNutrition | undefined> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return undefined;
    const html = await res.text();
    const $ = cheerio.load(html);

    // Try JSON-LD
    const jsonLd = $('script[type="application/ld+json"]').map((i: number, el: any) => $(el).html()).get();
    for (const j of jsonLd) {
      try {
        const parsed = JSON.parse(j as string);
        if (parsed && parsed.nutrition) {
          const n = parsed.nutrition;
          return {
            calories: n.calories ? parseInt(String(n.calories).replace(/\D/g, '')) : undefined,
            protein: n.proteinContent ? parseFloat(String(n.proteinContent).replace(/\D/g, '')) : undefined,
            carbs: n.carbohydrateContent ? parseFloat(String(n.carbohydrateContent).replace(/\D/g, '')) : undefined,
            fat: n.fatContent ? parseFloat(String(n.fatContent).replace(/\D/g, '')) : undefined,
            servingSize: n.servingSize || undefined
          };
        }
      } catch (e) {
        // ignore
      }
    }

    // Fallback to text heuristics
    const text = $('body').text();
    const calorieMatch = text.match(/(\d{2,4})\s*(?:k?cal|calories?)/i);
    const proteinMatch = text.match(/Protein[:\s]*?(\d+(?:\.\d+)?)/i) || text.match(/(\d+(?:\.\d+)?)\s*g\s*protein/i);
    const carbsMatch = text.match(/Carbohydrates?[:\s]*?(\d+(?:\.\d+)?)/i) || text.match(/(\d+(?:\.\d+)?)\s*g\s*carbs?/i);
    const fatMatch = text.match(/Fat[:\s]*?(\d+(?:\.\d+)?)/i) || text.match(/(\d+(?:\.\d+)?)\s*g\s*fat/i);

    const result: ScrapedNutrition = {};
    if (calorieMatch) result.calories = parseInt(calorieMatch[1]);
    if (proteinMatch) result.protein = parseFloat(proteinMatch[1]);
    if (carbsMatch) result.carbs = parseFloat(carbsMatch[1]);
    if (fatMatch) result.fat = parseFloat(fatMatch[1]);

    return Object.keys(result).length > 0 ? result : undefined;
  } catch (error) {
    return undefined;
  }
}

export async function scrapeMcDonaldsNutrition(url: string): Promise<ScrapedNutrition | undefined> {
  // McDonald's often includes nutrition as JSON-LD or in data attributes; use generic scraper
  return scrapeGenericNutrition(url);
}

export async function scrapeSubwayNutrition(url: string): Promise<ScrapedNutrition | undefined> {
  return scrapeGenericNutrition(url);
}

export async function scrapeStarbucksNutrition(url: string): Promise<ScrapedNutrition | undefined> {
  return scrapeGenericNutrition(url);
}

// Helper to pick the right scraper based on URL
export async function scrapeNutritionFromUrl(url: string): Promise<ScrapedNutrition | undefined> {
  if (!url) return undefined;
  const u = url.toLowerCase();
  try {
    if (u.includes('chick-fil-a') || u.includes('chickfila') || u.includes('chickfila')) return await scrapeChickFilANutrition(url);
    if (u.includes('mcdonalds') || u.includes('mcdonald') || u.includes('mcdonald\'s')) return await scrapeMcDonaldsNutrition(url);
    if (u.includes('subway')) return await scrapeSubwayNutrition(url);
    if (u.includes('starbucks')) return await scrapeStarbucksNutrition(url);
    // Generic attempt
    return await scrapeGenericNutrition(url);
  } catch (e) {
    return undefined;
  }
}
