import type {FoodItem} from '../backend/models/Nutrition';

type UsdaNutrient = {
  nutrientId?: number;
  value?: number;
  unitName?: string;
};

function inferCategoryFromUsda(category?: string): FoodItem['category'] {
  const s = String(category ?? '').toLowerCase();

  if (/vegetable|greens|salad/.test(s)) {
    return 'vegetables';
  }
  if (/fruit/.test(s)) {
    return 'fruits';
  }
  if (/poultry|meat|seafood|fish|egg|bean|nut|legume|protein/.test(s)) {
    return 'protein';
  }
  if (/dairy|milk|cheese|yogurt/.test(s)) {
    return 'dairy';
  }
  if (/cereal|grain|rice|pasta|bakery|bread/.test(s)) {
    return 'grains';
  }
  if (/beverage|drink|water|juice|coffee|tea/.test(s)) {
    return 'beverages';
  }
  if (/snack|candy|chip|cracker|bar/.test(s)) {
    return 'snacks';
  }
  if (/fat|oil|margarine|mayonnaise/.test(s)) {
    return 'fats';
  }
  return 'other';
}

function pickNutrients(nutrients: UsdaNutrient[] | undefined): Map<number, number> {
  const map = new Map<number, number>();
  if (!Array.isArray(nutrients)) {
    return map;
  }
  for (const n of nutrients) {
    const id = n.nutrientId;
    const v = n.value;
    if (typeof id === 'number' && typeof v === 'number' && Number.isFinite(v)) {
      map.set(id, v);
    }
  }
  return map;
}

/** USDA search nutrients are typically listed per declared serving; scale to per 100 g when possible. */
function servingScaleFactor(food: Record<string, unknown>): number {
  const unit = String(food.servingSizeUnit ?? '').toLowerCase().trim();
  const raw = food.servingSize;
  const size = typeof raw === 'number' ? raw : Number(raw);
  if (unit === 'g' && Number.isFinite(size) && size > 0) {
    return 100 / size;
  }
  return 1;
}

function mapUsdaFood(raw: Record<string, unknown>): FoodItem | null {
  const fdcId = Number(raw.fdcId);
  if (!Number.isFinite(fdcId)) {
    return null;
  }

  const description = String(raw.description ?? '').trim();
  if (!description) {
    return null;
  }

  const nutrients = pickNutrients(raw.foodNutrients as UsdaNutrient[]);
  const factor = servingScaleFactor(raw);

  const energy =
    nutrients.get(1008) ??
    nutrients.get(1062) ??
    nutrients.get(957) ??
    undefined;

  const protein = nutrients.get(1003);
  const carbs = nutrients.get(1005);
  const fat = nutrients.get(1004);
  const fiber = nutrients.get(1079);
  const sugar = nutrients.get(2000);
  const sodium = nutrients.get(1093);
  const cholesterol = nutrients.get(1253);

  const scaled = (v: number | undefined) =>
    v == null ? undefined : v * factor;

  const caloriesRaw = scaled(energy);
  const proteinG = scaled(protein);
  const carbsG = scaled(carbs);
  const fatG = scaled(fat);

  if (
    caloriesRaw == null &&
    proteinG == null &&
    carbsG == null &&
    fatG == null
  ) {
    return null;
  }

  const calories = Math.round(caloriesRaw ?? 0);
  const category = inferCategoryFromUsda(String(raw.foodCategory ?? ''));

  const brandOwner = String(raw.brandOwner ?? '').trim();
  const brandName = String(raw.brandName ?? '').trim();
  const brandLabel = (brandOwner || brandName || 'USDA Generic').trim();

  const now = new Date();

  const servingSizes = [{name: '100 g', weight: 100}];
  const su = String(raw.servingSizeUnit ?? '').toLowerCase();
  const ss = typeof raw.servingSize === 'number' ? raw.servingSize : Number(raw.servingSize);
  if (su === 'g' && Number.isFinite(ss) && ss > 0) {
    servingSizes.unshift({
      name: `Serving (${Math.round(ss)} g)`,
      weight: Math.round(ss),
    });
  }

  return {
    id: `fdc:${fdcId}`,
    name: description,
    brand: brandLabel,
    barcode: raw.gtinUpc ? String(raw.gtinUpc) : undefined,
    nutrition: {
      calories,
      protein: Math.round((proteinG ?? 0) * 10) / 10,
      carbohydrates: Math.round((carbsG ?? 0) * 10) / 10,
      fat: Math.round((fatG ?? 0) * 10) / 10,
      fiber: Math.round((scaled(fiber) ?? 0) * 10) / 10,
      sugar: Math.round((scaled(sugar) ?? 0) * 10) / 10,
      sodium: Math.round(scaled(sodium) ?? 0),
      cholesterol: Math.round(scaled(cholesterol) ?? 0),
    },
    category,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    servingSizes,
    createdAt: now,
    updatedAt: now,
  };
}

export async function searchUsdaFoods(
  query: string,
  apiKey: string,
  options?: {
    includeBranded?: boolean;
    pageSize?: number;
  },
  signal?: AbortSignal,
): Promise<FoodItem[]> {
  const q = query.trim();
  const key = apiKey.trim();
  if (q.length < 2 || !key) {
    return [];
  }

  const includeBranded = options?.includeBranded ?? false;
  const pageSize = options?.pageSize ?? 15;

  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(
    key,
  )}`;

  const body = {
    query: q,
    pageSize,
    pageNumber: 1,
    dataType: includeBranded
      ? ['Foundation', 'SR Legacy', 'Survey (FNDDS)', 'Branded']
      : ['Foundation', 'SR Legacy', 'Survey (FNDDS)'],
  };

  const res = await fetch(url, {
    method: 'POST',
    signal,
    headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`USDA FDC HTTP ${res.status}`);
  }

  const data = (await res.json()) as {foods?: Record<string, unknown>[]};
  const foods = Array.isArray(data.foods) ? data.foods : [];

  const out: FoodItem[] = [];
  for (const f of foods) {
    const item = mapUsdaFood(f);
    if (item) {
      out.push(item);
    }
  }
  return out;
}
