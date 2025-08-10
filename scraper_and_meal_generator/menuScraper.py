#!/usr/bin/env python3
import argparse
import asyncio
import json
import re
import sys
from pathlib import Path
from playwright.async_api import async_playwright

async def scrape_simple(output: str, debug: bool):
    """Simple, reliable scraper - no complex regex, just get what works"""
    url = "https://new.dineoncampus.com/utdallasdining/whats-on-the-menu/dining-hall-west"
    periods = ["Breakfast", "Lunch", "Dinner"]
    results = {p: [] for p in periods}

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=not debug)
        page = await browser.new_page()
        await page.goto(url, wait_until="networkidle")
        
        if debug:
            print(f"Loaded: {url}")

        for period in periods:
            if debug:
                print(f"\nProcessing {period}")
            
            # Use the working navigation from original scraper
            try:
                # 1) Click dropdown button
                menu_btn = page.get_by_role("button", name=re.compile(r"^(Select Menu|Menu)"))
                if await menu_btn.count() == 0:
                    if debug:
                        print(f"  No dropdown found for {period}")
                    continue
                        
                await menu_btn.first.click()
                await page.wait_for_timeout(1000)
                
                # 2) Select period
                option = page.get_by_text(period, exact=True)
                if await option.count() == 0:
                    if debug:
                        print(f"  {period} not available")
                    await page.click('body')  # Close dropdown
                    continue
                    
                await option.first.click()
                await page.wait_for_timeout(500)
                
                # 3) Click Go
                go_btn = page.get_by_role("button", name="View menu for selected location, date, and period")
                await go_btn.click()
                await page.wait_for_timeout(3000)
                
            except Exception as e:
                if debug:
                    print(f"  → Failed to navigate to {period}: {e}")
                continue

            # 4) Extract menu items from page text (much simpler)
            try:
                # Get all page text after clicking "Go"
                page_text = await page.locator('body').text_content()
                
                if debug:
                    print(f"  → Parsing page text for menu items...")
                    # Show a sample of the page text for debugging
                    sample_text = page_text[:500] if page_text else "No text found"
                    print(f"  → Sample text: {sample_text}")
                
                if not page_text:
                    if debug:
                        print(f"  → No page text found for {period}")
                    continue
                
                # Parse menu items using station sections
                stations = [
                    ("Grill", r'Grill.*?(?=The Sweet Shoppe|Pure Eats|The Kitchen|Icon Legend|$)'),
                    ("The Kitchen", r'The Kitchen.*?(?=Pure Eats|Grill|The Sweet Shoppe|Icon Legend|$)'),
                    ("Pure Eats", r'Pure Eats.*?(?=Grill|The Sweet Shoppe|The Kitchen|Icon Legend|$)'),
                    ("The Sweet Shoppe", r'The Sweet Shoppe.*?(?=Icon Legend|$)'),
                    ("Pantry", r'Pantry.*?(?=The Sweet Shoppe|Icon Legend|$)')
                ]
                
                for station_name, pattern in stations:
                    station_match = re.search(pattern, page_text, re.IGNORECASE | re.DOTALL)
                    if not station_match:
                        continue
                        
                    station_text = station_match.group(0)
                    if debug:
                        print(f"  → Processing {station_name}")
                    
                    # More precise pattern: Look for actual food items not table headers
                    # Skip "Portion Calories" headers and extract real items
                    clean_section = re.sub(r'Click any item for nutritional information\.\s*Portion\s*Calories\s*', '', station_text)
                    
                    # Extract items and debug the raw format first
                    # Pattern: Word(s) + Number + Unit + Number(calories)
                    item_pattern = r'([A-Z][A-Za-z\s]+?)(\d+(?:/\d+)?\s*(?:cup|slice|oz|ounce|each|serving|tbsp|ladle|wedge|meat))(\d+)'
                    item_matches = re.findall(item_pattern, clean_section)
                    
                    if debug and item_matches:
                        print(f"    → Raw matches for {station_name}:")
                        for raw_name, portion, cal in item_matches[:3]:
                            print(f"      • Raw: '{raw_name}' | Portion: '{portion}' | Cal: {cal}")
                    
                    for name_raw, portion, calories_str in item_matches:
                        try:
                            calories = int(calories_str)
                            if calories < 10 or calories > 1000:
                                continue
                            
                            # Clean up item name by fixing concatenated text and removing descriptions
                            name_part = name_raw.strip()
                            
                            # Skip table headers that got captured
                            if 'portion' in name_part.lower() and 'calories' in name_part.lower():
                                # Extract just the actual item name after "Portion Calories"
                                parts = name_part.split()
                                # Remove "Portion" and "Calories" if they appear
                                clean_parts = []
                                skip_next = False
                                for part in parts:
                                    if skip_next:
                                        skip_next = False
                                        continue
                                    if part.lower() in ['portion', 'calories']:
                                        continue
                                    clean_parts.append(part)
                                name_part = ' '.join(clean_parts)
                            
                            # Fix concatenated words like "ToastLightly" -> "Toast Lightly"
                            # Look for common description words that might be concatenated
                            concat_words = ['lightly', 'sweetened', 'traditional', 'delicious', 'perfectly', 'classic', 'grilled', 'great', 'tender']
                            for concat_word in concat_words:
                                # Look for pattern like "ToastLightly" where "Toast" + "Lightly" are joined
                                pattern = f'([A-Z][a-z]+)({concat_word.capitalize()})'
                                if re.search(pattern, name_part):
                                    name_part = re.sub(pattern, r'\1 \2', name_part)
                                    break
                            
                            # Now split into words and find clean name
                            words = name_part.split()
                            clean_words = []
                            
                            description_starters = ['lightly', 'sweetened', 'pudding', 'traditional', 'delicious', 'cooked', 'til', 'golden', 'brown', 'perfectly', 'seasoned', 'tender', 'moist', 'classic', 'freshly', 'steamed', 'long', 'grain', 'juicy', 'hot', 'whole', 'wheat', 'grilled', 'stuffed', 'melted', 'roasted', 'braised', 'simply', 'house', 'made', 'wonderfully', 'satisfying', 'great', 'taste']
                            
                            # Special food name patterns that shouldn't be cut off
                            food_name_patterns = ['banana bread', 'french toast', 'chicken tender', 'sweet potato', 'bread pudding']
                            
                            for i, word in enumerate(words):
                                word_lower = word.lower()
                                
                                # Check if this word might be part of a common food name
                                is_part_of_food_name = False
                                if i > 0:  # Not the first word
                                    prev_word = words[i-1].lower()
                                    two_word_name = f"{prev_word} {word_lower}"
                                    if two_word_name in food_name_patterns:
                                        is_part_of_food_name = True
                                
                                # Stop at description starters, unless it's part of a food name
                                if word_lower in description_starters and not is_part_of_food_name:
                                    break
                                
                                clean_words.append(word)
                                
                                # Most food names are 1-3 words, stop at 3 unless clearly part of name
                                if len(clean_words) >= 3:
                                    # Only continue if next word looks like part of name (not description)
                                    if i + 1 < len(words):
                                        next_word = words[i + 1].lower()
                                        if next_word in description_starters:
                                            break
                                    else:
                                        break
                            
                            if clean_words and len(clean_words[0]) > 1:
                                clean_name = ' '.join(clean_words)
                                
                                # Skip obvious non-food items and generic names
                                skip_names = ['portion', 'calories', 'click', 'information', 'the sweet shoppe', 'the kitchen', 'pure eats', 'grill']
                                if clean_name.lower() in skip_names:
                                    continue
                                
                                # Try to get detailed nutrition by clicking the item
                                nutrition_data = {"cal": calories, "prot": 0, "carbs": 0, "fats": 0}
                                
                                try:
                                    # Find and click the menu item for nutrition details
                                    item_element = page.get_by_text(clean_name).first
                                    if await item_element.count() > 0:
                                        await item_element.click(timeout=3000)
                                        
                                        # Wait for nutrition panel to appear
                                        try:
                                            nutrition_panel = page.locator('[role="dialog"]').first
                                            await nutrition_panel.wait_for(state="visible", timeout=3000)
                                            
                                            # Extract nutrition text
                                            panel_text = await nutrition_panel.text_content()
                                            
                                            if panel_text:
                                                # Extract nutrition values using simple regex
                                                cal_match = re.search(r'Calories\s*(\d+)', panel_text, re.IGNORECASE)
                                                prot_match = re.search(r'Protein\s*\(g\)\s*(\d+)', panel_text, re.IGNORECASE)  
                                                carb_match = re.search(r'Total Carbohydrates\s*\(g\)\s*(\d+)', panel_text, re.IGNORECASE)
                                                fat_match = re.search(r'Total Fat\s*\(g\)\s*(\d+)', panel_text, re.IGNORECASE)
                                                
                                                nutrition_data = {
                                                    "cal": int(cal_match.group(1)) if cal_match else calories,
                                                    "prot": int(prot_match.group(1)) if prot_match else 0,
                                                    "carbs": int(carb_match.group(1)) if carb_match else 0,
                                                    "fats": int(fat_match.group(1)) if fat_match else 0
                                                }
                                            
                                            # Close the panel reliably
                                            try:
                                                # Try multiple methods to close
                                                close_attempts = [
                                                    lambda: page.get_by_text("Close").first.click(timeout=2000),
                                                    lambda: page.locator('button[aria-label*="close" i]').first.click(timeout=2000),
                                                    lambda: page.keyboard.press("Escape")
                                                ]
                                                
                                                for attempt in close_attempts:
                                                    try:
                                                        await attempt()
                                                        await page.wait_for_timeout(500)
                                                        # Check if panel closed
                                                        if await page.locator('[role="dialog"]').count() == 0:
                                                            break
                                                    except:
                                                        continue
                                                        
                                                # Final fallback - multiple escapes
                                                for _ in range(3):
                                                    await page.keyboard.press("Escape")
                                                    await page.wait_for_timeout(200)
                                                    
                                            except:
                                                await page.keyboard.press("Escape")
                                                await page.wait_for_timeout(500)
                                                
                                        except:
                                            # No nutrition panel appeared
                                            pass
                                            
                                except:
                                    # Clicking failed, use parsed calories
                                    pass
                                
                                # Determine if vegetarian
                                meat_keywords = ['chicken', 'beef', 'pork', 'bacon', 'ham', 'turkey', 'fish', 'sausage', 'pepperoni']
                                veg_keywords = ['meatless', 'vegetarian', 'veggie', 'bean', 'vegetable']
                                
                                name_lower = clean_name.lower()
                                is_veg = any(veg in name_lower for veg in veg_keywords) or not any(meat in name_lower for meat in meat_keywords)
                                
                                results[period].append({
                                    "name": clean_name,
                                    "station": station_name,
                                    "calories": nutrition_data["cal"],
                                    "protein": nutrition_data["prot"],
                                    "carbs": nutrition_data["carbs"],
                                    "fats": nutrition_data["fats"],
                                    "veg": is_veg
                                })
                                
                                if debug:
                                    print(f"    → {clean_name}: {nutrition_data['cal']} cal, {nutrition_data['prot']}g protein, {nutrition_data['carbs']}g carbs, {nutrition_data['fats']}g fat, veg: {is_veg}")
                                    
                        except Exception as e:
                            if debug:
                                print(f"    → Error parsing item: {e}")
                            continue
                        
            except Exception as e:
                if debug:
                    print(f"  → Error finding items for {period}: {e}")

            # Brief wait between periods to avoid modal conflicts  
            await page.wait_for_timeout(1000)

        await browser.close()

    # Write results
    Path(output).write_text(json.dumps(results, indent=2))
    print(f"✅ Wrote {sum(len(items) for items in results.values())} items to {output}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Simple Menu Scraper")
    parser.add_argument("--output", default="menu.json", help="Output file")
    parser.add_argument("--debug", action="store_true", help="Debug mode")
    args = parser.parse_args()

    try:
        asyncio.run(scrape_simple(args.output, args.debug))
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)