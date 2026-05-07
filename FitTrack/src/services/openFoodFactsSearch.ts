import type {FoodItem} from '../backend/models/Nutrition';

function num(v: unknown): number | undefined {
  if (v == null || v === '') {
    return undefined;
  }
  const x = Number(v);
  return Number.isFinite(x) ? x : undefined;
}

function saltToSodiumMg(saltGPer100g: number): number {
  return Math.round(saltGPer100g * 1000 * 0.393);
}

function inferCategoryFromOffTags(tags: unknown): FoodItem['category'] {
  const list = Array.isArray(tags)
    ? tags.map(String)
    : typeof tags === 'string'
      ? [tags]
      : [];
  const s = list.join(' ').toLowerCase();

  if (
    /vegetable|greens|tomato|broccoli|carrot|salad|cabbage/.test(s)
  ) {
    return 'vegetables';
  }
  if (/fruit|berries|apple|banana|citrus/.test(s)) {
    return 'fruits';
  }
  if (/meat|poultry|fish|seafood|egg|protein/.test(s)) {
    return 'protein';
  }
  if (/dairy|milk|cheese|yogurt/.test(s)) {
    return 'dairy';
  }
  if (/bread|cereal|rice|pasta|grain|oat/.test(s)) {
    return 'grains';
  }
  if (/beverage|drink|juice|water|soda|tea|coffee/.test(s)) {
    return 'beverages';
  }
  if (/snack|chocolate|candy|cookie|cracker|chip/.test(s)) {
    return 'snacks';
  }
  if (/oil|fat|butter|margarine/.test(s)) {
    return 'fats';
  }
  return 'other';
}

function mapTags(tags: unknown): {
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
} {
  const list = Array.isArray(tags) ? tags.map(String) : [];
  const lower = list.map(t => t.toLowerCase());
  const isVegan = lower.some(t => t.includes('vegan'));
  const isVegetarian =
    isVegan || lower.some(t => t.includes('vegetarian'));
  const isGlutenFree =
    lower.some(t => t.includes('gluten-free')) ||
    lower.some(t => t.includes('no-gluten')) ||
    lower.some(t => t.includes('sans-gluten'));
  return {isVegetarian, isVegan, isGlutenFree};
}

function mapProduct(raw: Record<string, unknown>): FoodItem | null {
  const code = String(raw.code ?? '').trim();
  const name = String(raw.product_name ?? raw.generic_name ?? '').trim();
  if (!name) {
    return null;
  }

  const n = (raw.nutriments ?? {}) as Record<string, unknown>;
  let calories =
    num(n['energy-kcal_100g']) ??
    num(n['energy_kcal_100g']) ??
    undefined;
  const kj = num(n['energy-kj_100g']) ?? num(n['energy_100g']);
  if (calories == null && kj != null) {
    calories = Math.round(kj / 4.184);
  }

  const protein = num(n.proteins_100g);
  const carbohydrates = num(n.carbohydrates_100g);
  const fat = num(n.fat_100g);

  if (
    calories == null &&
    protein == null &&
    carbohydrates == null &&
    fat == null
  ) {
    return null;
  }

  const fiber = num(n.fiber_100g) ?? 0;
  const sugar = num(n.sugars_100g) ?? 0;
  let sodium = num(n.sodium_100g);
  if (sodium == null) {
    const salt = num(n.salt_100g);
    if (salt != null) {
      sodium = saltToSodiumMg(salt);
    }
  }
  sodium ??= 0;

  const cholesterol = num(n.cholesterol_100g) ?? 0;

  const {isVegetarian, isVegan, isGlutenFree} = mapTags(raw.labels_tags);

  const brands = String(raw.brands ?? '').trim();
  const brand =
    brands.split(',').map(b => b.trim()).filter(Boolean)[0] ?? undefined;

  const imageUrl =
    typeof raw.image_front_small_url === 'string'
      ? raw.image_front_small_url
      : typeof raw.image_front_url === 'string'
        ? raw.image_front_url
        : undefined;

  const category = inferCategoryFromOffTags([
    ...(Array.isArray(raw.categories_tags) ? raw.categories_tags : []),
    ...(typeof raw.categories === 'string' ? [raw.categories] : []),
  ]);

  const now = new Date();

  return {
    id: code ? `off:${code}` : `off:${name.slice(0, 48)}:${now.getTime()}`,
    name,
    brand,
    barcode: code || undefined,
    nutrition: {
      calories: Math.round(calories ?? 0),
      protein: Math.round((protein ?? 0) * 10) / 10,
      carbohydrates: Math.round((carbohydrates ?? 0) * 10) / 10,
      fat: Math.round((fat ?? 0) * 10) / 10,
      fiber: Math.round(fiber * 10) / 10,
      sugar: Math.round(sugar * 10) / 10,
      sodium: Math.round(sodium),
      cholesterol: Math.round(cholesterol),
    },
    category,
    isVegetarian,
    isVegan,
    isGlutenFree,
    servingSizes: [{name: '100 g', weight: 100}],
    imageUrl,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Open Food Facts — packaged foods; nutrients mapped per 100 g.
 */
export async function searchOpenFoodFacts(
  query: string,
  signal?: AbortSignal,
): Promise<FoodItem[]> {
  const q = query.trim();
  if (q.length < 2) {
    return [];
  }

  const url =
    'https://world.openfoodfacts.org/cgi/search.pl?' +
    new URLSearchParams({
      search_terms: q,
      search_simple: '1',
      action: 'process',
      json: '1',
      page_size: '18',
      fields:
        'code,product_name,generic_name,brands,nutriments,labels_tags,categories_tags,categories,image_front_small_url,image_front_url',
    }).toString();

  const res = await fetch(url, {
    signal,
    headers: {
      Accept: 'application/json',
      'User-Agent': 'FitTrack/1.0 (mobile nutrition search)',
    },
  });

  if (!res.ok) {
    throw new Error(`OpenFoodFacts HTTP ${res.status}`);
  }

  const data = (await res.json()) as {products?: Record<string, unknown>[]};
  const products = Array.isArray(data.products) ? data.products : [];

  const out: FoodItem[] = [];
  for (const p of products) {
    const item = mapProduct(p);
    if (item) {
      out.push(item);
    }
  }
  return out;
}
