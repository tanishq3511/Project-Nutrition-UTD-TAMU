#!/usr/bin/env python3
import asyncio
import datetime
import json
import sys
from collections import defaultdict
from pathlib import Path
from typing import Dict, List, Optional

from playwright.async_api import async_playwright

# ───────────────────────────────────────────────────────────────────────────────
# Vegetarian detection & numeric helper
MEAT_KEYWORDS = ["pork", "beef", "chicken", "sausage", "bacon",
                 "ham", "turkey", "fish", "shrimp"]

ADDITIONAL_VEG_KEYWORDS = ["meatless", "vegetarian", "veggie"]

def to_float(s: str) -> float:
    try:
        if "less than" in s:
            return 0.5
        return float(s)
    except:
        return 0.0

def is_vegetarian(ingredients: str) -> bool:
    txt = ingredients.lower()
    if any(k in txt for k in ADDITIONAL_VEG_KEYWORDS):
        return True
    return not any(meat in txt for meat in MEAT_KEYWORDS)

# ───────────────────────────────────────────────────────────────────────────────
async def scrape_menu(date: Optional[str] = None,
                      output: Optional[str] = None,
                      debug: bool = False) -> Dict:

    # 1) date & single-output file
    if not date:
        date = datetime.datetime.now().strftime("%Y-%m-%d")
    if not output:
        output = "current_menu.json"
    out_path = Path(output)
    # clear file
    try:
        out_path.write_text("")
    except:
        pass

    # 2) scrape
    api_data: Dict[str, dict] = {}
    periods = ["Breakfast", "Lunch", "Dinner"]

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(user_agent=(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/91.0.4472.124 Safari/537.36"
        ))
        page = await ctx.new_page()

        async def capture(resp):
            if "api.dineoncampus.com/v1/location" in resp.url:
                try:
                    api_data[resp.url] = await resp.json()
                except:
                    if debug: print("❗ parse error", resp.url)
        page.on("response", capture)

        await page.goto(
            "https://dineoncampus.com/utdallasdining/whats-on-the-menu",
            wait_until="networkidle"
        )
        for m in periods:
            tab = await page.query_selector(f"a:has-text('{m}')")
            if tab:
                if debug: print("→", m)
                await tab.click()
                await page.wait_for_timeout(2000)

        await browser.close()

    # 3) extract raw items
    raw_items: List[dict] = []
    for resp in api_data.values():
        raw_items.extend(extract_items(resp, date))

    # 4) group & simplify
    grouped: Dict[str, List[dict]] = {p: [] for p in periods}
    for item in raw_items:
        grp = item["Meal Period"]
        # transform to restaurant‐style shape
        simplified = {
            "name":    item["Item Name"],
            "calories": int(to_float(item["Calories"])),
            "carbs":   int(to_float(item["Carbs (g)"])),
            "fats":    int(to_float(item["Fat (g)"])),
            "protein": int(to_float(item["Protein (g)"])),
            "veg":     is_vegetarian(item.get("Ingredients", ""))
        }
        if grp in grouped:
            grouped[grp].append(simplified)

    # 5) merge static restaurants
    try:
        static = json.loads(
            Path(__file__).parent.joinpath("otherRestaurants.json").read_text()
        )
        for vendor, menu in static.items():
            grouped[vendor] = menu
    except Exception as e:
        print("⚠️ couldn’t load campus_restaurants.json:", e)

    # 6) write final JSON
    out_path.write_text(json.dumps(grouped, indent=2))
    print("✅ wrote", output)
    return grouped

# ───────────────────────────────────────────────────────────────────────────────
def extract_items(data: dict, date: str, 
                  period: Optional[str]=None, 
                  depth: int=0) -> List[dict]:
    """Walks the API JSON, finds each period name, then collects items."""
    if depth > 15:
        return []
    items = []
    if isinstance(data, dict):
        # detect period switch
        mp = data.get("menu", {}).get("periods")
        if isinstance(mp, dict) and "name" in mp:
            return extract_items(mp, date, mp["name"], depth+1)

        # collect items under a category if we know the period
        if period and "name" in data and isinstance(data.get("items"), list):
            cat = data["name"]
            for e in data["items"]:
                if not isinstance(e, dict): continue
                mi = {
                    "Date": date,
                    "Meal Period": period,
                    "Category": cat,
                    "Item Name": e.get("name", ""),
                    "Portion": e.get("portion", ""),
                    "Calories": "",
                    "Fat (g)": "",
                    "Carbs (g)": "",
                    "Protein (g)": "",
                    "Sodium (mg)": "",
                    "Sugar (g)": "",
                    "Allergens": "",
                    "Ingredients": e.get("ingredients", "")
                }
                for nut in e.get("nutrients", []):
                    if not isinstance(nut, dict): continue
                    n, v = nut.get("name",""), str(nut.get("value",""))
                    if n=="Calories":       mi["Calories"]=v
                    elif n=="Total Fat (g)": mi["Fat (g)"]=v
                    elif n=="Total Carbohydrates (g)": mi["Carbs (g)"]=v
                    elif n=="Protein (g)":   mi["Protein (g)"]=v
                    elif n=="Sodium (mg)":   mi["Sodium (mg)"]=v
                    elif n=="Sugar (g)":     mi["Sugar (g)"]=v
                alle = [a.get("name","") for a in e.get("allergens",[]) if isinstance(a,dict)]
                mi["Allergens"] = ", ".join(alle)
                items.append(mi)

        # recurse
        for v in data.values():
            items.extend(extract_items(v, date, period, depth+1))
    elif isinstance(data, list):
        for elem in data:
            items.extend(extract_items(elem, date, period, depth+1))
    return items

# ───────────────────────────────────────────────────────────────────────────────
async def main_async(date=None, output=None, debug=False):
    try:
        await scrape_menu(date, output, debug)
        return 0
    except Exception as e:
        print("❌", e, file=sys.stderr)
        return 1

def main():
    import argparse
    parser = argparse.ArgumentParser("Scrape UT Dallas menu")
    parser.add_argument("--date", help="YYYY-MM-DD")
    parser.add_argument("--output", help="Output file (default: current_menu.json)")
    parser.add_argument("--debug", action="store_true")
    args = parser.parse_args()
    sys.exit(asyncio.run(main_async(
        args.date, args.output, args.debug)))

if __name__ == "__main__":
    main()
