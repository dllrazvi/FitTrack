import {USDA_API_KEY, USDA_API_CONFIGURED} from '../config/usda';
import {searchOpenFoodFacts} from './openFoodFactsSearch';
import {searchUsdaFoods} from './usdaFoodSearch';
import type {FoodItem} from '../backend/models/Nutrition';

export const FOOD_CATALOG_USDA_ENABLED = USDA_API_CONFIGURED;

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function scoreFoodRelevance(
  food: FoodItem,
  query: string,
  preferRaw: boolean,
): number {
  const q = normalize(query);
  const name = normalize(food.name);
  const brand = normalize(food.brand || '');
  const tokens = q.split(' ').filter(Boolean);
  let score = 0;

  // Strong boosts for direct/simple matches first.
  if (name === q) {
    score += 1200;
  }
  if (name.startsWith(q)) {
    score += 700;
  }
  if (name.includes(q)) {
    score += 420;
  }
  for (const t of tokens) {
    if (name === t) {
      score += 400;
    } else if (name.startsWith(`${t} `)) {
      score += 260;
    } else if (name.includes(` ${t} `) || name.endsWith(` ${t}`)) {
      score += 120;
    } else if (brand.includes(t)) {
      score += 25;
    }
  }

  // Prefer simpler ingredient-like names over recipe-like names.
  const words = name.split(' ').filter(Boolean).length;
  if (words <= 2) {
    score += 130;
  } else if (words <= 4) {
    score += 60;
  } else {
    score -= 35;
  }

  if (/[,+/&]/.test(food.name)) {
    score -= 70;
  }
  if (
    /\b(with|and|style|flavor|recipe|meal|soup|stew|sauce|curry|pasta|salad|sandwich)\b/.test(
      name,
    )
  ) {
    score -= 110;
  }

  // Prefer "raw/plain/fresh" entries for generic ingredient queries.
  const genericIngredientQuery = tokens.length <= 2;
  if (preferRaw && genericIngredientQuery) {
    if (
      /\b(raw|fresh|plain|uncooked)\b/.test(name) ||
      /\b(raw|fresh|plain|uncooked)\b/.test(brand)
    ) {
      score += 180;
    }
    if (
      /\b(cooked|fried|grilled|roasted|smoked|breaded|battered|marinated|seasoned)\b/.test(
        name,
      )
    ) {
      score -= 90;
    }
  }

  // Mild boost for generic/non-branded entries.
  if ((food.brand || '').toLowerCase().includes('generic')) {
    score += 55;
  }

  return score;
}

/**
 * Remote catalog:
 * - Generic mode (default): USDA non-branded foods
 * - Branded mode (optional): USDA branded + Open Food Facts
 */
export async function searchFoodCatalog(
  query: string,
  options?: {
    includeBranded?: boolean;
    limit?: number;
    preferRaw?: boolean;
  },
  signal?: AbortSignal,
): Promise<FoodItem[]> {
  const q = query.trim();
  if (q.length < 2) {
    return [];
  }

  const includeBranded = options?.includeBranded ?? false;
  const limit = options?.limit ?? 30;
  const preferRaw = options?.preferRaw ?? true;

  const offPromise = includeBranded
    ? searchOpenFoodFacts(q, signal).catch(() => [] as FoodItem[])
    : Promise.resolve([] as FoodItem[]);

  const usdaPromise = USDA_API_CONFIGURED
    ? searchUsdaFoods(
        q,
        USDA_API_KEY,
        {includeBranded, pageSize: Math.min(40, limit)},
        signal,
      ).catch(() => [] as FoodItem[])
    : Promise.resolve([] as FoodItem[]);

  const [off, usda] = await Promise.all([offPromise, usdaPromise]);
  const merged = [...usda, ...off];

  const dedupByName = new Map<string, FoodItem>();
  for (const item of merged) {
    const key = normalize(item.name);
    const existing = dedupByName.get(key);
    if (!existing) {
      dedupByName.set(key, item);
      continue;
    }
    // Keep entry with fuller macro data when names collide.
    const existingDensity =
      existing.nutrition.protein +
      existing.nutrition.carbohydrates +
      existing.nutrition.fat +
      (existing.nutrition.calories > 0 ? 1 : 0);
    const currentDensity =
      item.nutrition.protein +
      item.nutrition.carbohydrates +
      item.nutrition.fat +
      (item.nutrition.calories > 0 ? 1 : 0);
    if (currentDensity > existingDensity) {
      dedupByName.set(key, item);
    }
  }

  return Array.from(dedupByName.values())
    .sort(
      (a, b) =>
        scoreFoodRelevance(b, q, preferRaw) -
        scoreFoodRelevance(a, q, preferRaw),
    )
    .slice(0, limit);
}
