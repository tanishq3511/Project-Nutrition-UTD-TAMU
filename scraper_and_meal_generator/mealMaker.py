#!/usr/bin/env python3
import json
import argparse
import sys
import random
from itertools import combinations_with_replacement

# Keywords for vegetarian detection and vegetable presence
MEAT_KEYWORDS = ["pork", "beef", "chicken", "sausage", "bacon",
                 "ham", "turkey", "fish", "shrimp"]
ADDITIONAL_VEG_KEYWORDS = ["meatless", "vegetarian", "veggie"]
VEG_ITEM_KEYWORDS = [
    "spinach", "broccoli", "kale", "salad", "vegetable", "bean", "peas",
    "pepper", "onion", "carrot", "tomato", "cucumber"
]

def parse_item(raw: dict) -> dict:
    """
    Transforms a raw item into internal format:
      - name, calories, protein, fat, carbs, vegetarian, has_veg_item
    """
    name = raw.get("name", "")
    calories = float(raw.get("calories", 0))
    protein = float(raw.get("protein", 0))
    fats = float(raw.get("fats", 0))
    carbs = float(raw.get("carbs", 0))
    veg = bool(raw.get("veg", False))
    lname = name.lower()

    # Improved vegetarian detection
    if any(k in lname for k in ADDITIONAL_VEG_KEYWORDS):
        veg = True
    elif any(meat in lname for meat in MEAT_KEYWORDS):
        veg = False

    # Detect if this item counts as a "green/veg" choice
    has_veg_item = any(kw in lname for kw in VEG_ITEM_KEYWORDS)

    return {
        "name":           name,
        "calories":       calories,
        "protein":        protein,
        "fat":            fats,
        "carbs":          carbs,
        "vegetarian":     veg,
        "has_veg_item":   has_veg_item
    }

def generate_meals(items,
                   min_calories,
                   max_calories,
                   min_protein,
                   max_protein=None,
                   min_carbs=0,
                   max_carbs=None,
                   min_fats=0,
                   max_fats=None,
                   vegetarian_only=False,
                   require_vegetable=False,
                   max_servings=3):
    """
    Finds combinations (with up to max_servings repeats) meeting:
      - min_calories <= total calories <= max_calories
      - min_protein  <= total protein  <= max_protein (if provided)
      - min_carbs    <= total carbs    <= max_carbs   (if provided)
      - min_fats     <= total fats     <= max_fats    (if provided)
      - (optional) all items vegetarian
      - (optional) at least one item with vegetables
    """
    pool = [
        i for i in items
        if i["calories"] > 0 and (not vegetarian_only or i["vegetarian"])
    ]
    if not pool:
        return []

    min_item_cal = min(i["calories"] for i in pool)
    max_len = min(max_servings, int(max_calories // min_item_cal)) if min_item_cal > 0 else max_servings

    valid = []
    for r in range(1, max_len + 1):
        for combo in combinations_with_replacement(pool, r):
            total_cal  = sum(i["calories"] for i in combo)
            total_pro  = sum(i["protein"]  for i in combo)
            total_car  = sum(i["carbs"]    for i in combo)
            total_fat  = sum(i["fat"]      for i in combo)

            if not (min_calories <= total_cal <= max_calories):
                continue
            if total_pro < min_protein or (max_protein is not None and total_pro > max_protein):
                continue
            if total_car < min_carbs or (max_carbs is not None and total_car > max_carbs):
                continue
            if total_fat < min_fats or (max_fats is not None and total_fat > max_fats):
                continue

            valid.append({
                "items":           [i["name"] for i in combo],
                "total_calories":  total_cal,
                "total_protein":   total_pro,
                "total_carbs":     total_car,
                "total_fats":      total_fat,
                "has_veg_item":    any(i["has_veg_item"] for i in combo)
            })

    # Sort by highest protein, then lowest calories
    valid.sort(key=lambda m: (-m["total_protein"], m["total_calories"]))

    # Apply vegetable requirement if requested
    if require_vegetable:
        veg_only = [m for m in valid if m["has_veg_item"]]
        if veg_only:
            valid = veg_only
        else:
            print("⚠️ No combos include a vegetable item — showing all combos.", file=sys.stderr)

    # Clean up helper field
    for m in valid:
        m.pop("has_veg_item", None)

    return valid

def main():
    # Test Variables
    daily_calories = 2400
    status = "bulking" # can be bulking, maintenance, cutting

    calories_per_meal = daily_calories/3
    calories_remaining = 800
    if calories_remaining < calories_per_meal:
        calories_per_meal = calories_remaining
        
    #this is for cutting
    min_calories = calories_per_meal*.7
    max_calories = calories_per_meal
    if status == "bulking":
        min_calories = calories_per_meal
        max_calories = calories_per_meal*1.3
    elif status == "maintenance": 
        min_calories = calories_per_meal * .8
        max_calories = calories_per_meal * 1.2

    parser = argparse.ArgumentParser(description="Generate a meal from today’s combined menu")
    parser.add_argument("--menu-file", default="current_menu.json",
                        help="Path to the JSON with all periods + restaurants")
    parser.add_argument("--source", default="Lunch",
                        help="Key in the JSON to pull items from (e.g. Lunch, Panda Express)")
    parser.add_argument("--min-calories", type=float, default=min_calories,
                        help="Minimum total calories")
    parser.add_argument("--max-calories", type=float, default=max_calories,
                        help="Maximum total calories")
    parser.add_argument("--min-protein", type=float, default= min_calories*.3/4,
                        help="Minimum total protein")
    parser.add_argument("--max-protein", type=float, default= max_calories*.6/4,
                        help="Maximum total protein (optional)")
    parser.add_argument("--min-carbs", type=float, default= min_calories*.4/4,
                        help="Minimum total carbs")
    parser.add_argument("--max-carbs", type=float, default= max_calories*.5/4,
                        help="Maximum total carbs (optional)")
    parser.add_argument("--min-fats", type=float, default= min_calories*.15/9,
                        help="Minimum total fats")
    parser.add_argument("--max-fats", type=float, default=max_calories*.3/9,
                        help="Maximum total fats (optional)")
    parser.add_argument("--vegetarian", type=bool, default = False,
                        help="Only include vegetarian items")
    parser.add_argument("--require-vegetable", action="store_true",
                        help="Require at least one green/veg item in the combo")
    parser.add_argument("--max-servings", type=int, default=5,
                        help="Max servings of each item (default: 3)")

    args = parser.parse_args()

    # Load combined menu
    try:
        with open(args.menu_file, encoding="utf-8") as f:
            menu = json.load(f)
    except FileNotFoundError:
        print(f"Error: menu file not found: {args.menu_file}", file=sys.stderr)
        sys.exit(1)

    # Extract the chosen source
    raw_items = menu.get(args.source)
    if raw_items is None:
        print(f"Error: key '{args.source}' not in menu JSON", file=sys.stderr)
        print("Available keys:", ", ".join(menu.keys()), file=sys.stderr)
        sys.exit(1)

    # Parse and generate
    parsed_items = [parse_item(item) for item in raw_items]
    combos = generate_meals(
        parsed_items,
        min_calories      = args.min_calories,
        max_calories      = args.max_calories,
        min_protein       = args.min_protein,
        max_protein       = args.max_protein,
        min_carbs         = args.min_carbs,
        max_carbs         = args.max_carbs,
        min_fats          = args.min_fats,
        max_fats          = args.max_fats,
        vegetarian_only   = args.vegetarian,
        require_vegetable = args.require_vegetable,
        max_servings      = args.max_servings
    )

    if not combos:
        print("No valid combos with those constraints.")
        return

    # Pick one random combo
    choice = random.choice(combos)
    print(json.dumps(choice, indent=2))

if __name__ == "__main__":
    main()

