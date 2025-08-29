declare module 'node-fetch';
declare module 'cheerio';

// Allow jQuery-style callbacks without explicit types in the scraper
declare interface CheerioStatic {
  (selector: string): any;
}

export {};