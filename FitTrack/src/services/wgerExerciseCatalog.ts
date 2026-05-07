/**
 * Public read-only catalog from wger.de (no API key).
 * Uses exerciseinfo for richer English text and optional images.
 * https://wger.de/en/software/api
 */
import {
  MUSCLEWIKI_API_KEY,
  MUSCLEWIKI_RAPIDAPI_HOST,
  MUSCLEWIKI_RAPIDAPI_KEY,
} from '../config/muscleWiki';

const WGER_BASE = 'https://wger.de/api/v2';
const MUSCLEWIKI_BASE = 'https://api.musclewiki.com';
const MUSCLEWIKI_RAPID_BASE = 'https://musclewiki-api.p.rapidapi.com';

function stripHtml(html: string): string {
  if (!html) {
    return '';
  }
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export type ScreenExercise = {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  sets: number;
  reps: number;
  restTime: number;
  caloriesPerMinute: number;
  imageUrl: string | null;
  videoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CatalogWorkoutRoutine = {
  id: string;
  name: string;
  description: string;
  exercises: string[];
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  caloriesBurned: number;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

type WgerExerciseInfoRow = {
  id: number;
  category?: {name?: string};
  equipment?: {name: string}[];
  muscles?: {name: string}[];
  translations?: {
    language: number;
    name: string;
    description?: string;
  }[];
  images?: {image: string; is_main?: boolean}[];
};

function pickEnglishTranslation(row: WgerExerciseInfoRow): {
  name: string;
  description: string;
} {
  const list = row.translations || [];
  const en =
    list.find(t => t.language === 2) ||
    list.find(t => t.language === 1) ||
    list[0];
  const name = (en?.name || `Exercise ${row.id}`).trim();
  const rawDesc = stripHtml(en?.description || '');
  const description =
    rawDesc ||
    'No detailed description is available for this exercise. Move with control and stop if you feel pain.';
  return {name, description};
}

function pickImageUrl(row: WgerExerciseInfoRow): string | null {
  const imgs = row.images || [];
  if (!imgs.length) {
    return null;
  }
  const main = imgs.find(i => i.is_main) || imgs[0];
  const path = main?.image;
  if (!path) {
    return null;
  }
  if (path.startsWith('http')) {
    return path;
  }
  return `https://wger.de${path.startsWith('/') ? '' : '/'}${path}`;
}

function mapDifficulty(
  categoryName: string | undefined,
): 'beginner' | 'intermediate' | 'advanced' {
  const c = (categoryName || '').toLowerCase();
  if (c.includes('calisthenics') || c.includes('stretch')) {
    return 'intermediate';
  }
  return 'beginner';
}

export async function searchWgerExercisesForPicker(
  query: string,
  limit = 20,
): Promise<{id: string; name: string}[]> {
  const q = encodeURIComponent((query || 'a').trim().slice(0, 80));
  const url = `${WGER_BASE}/exerciseinfo/?language=2&search=${q}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`wger HTTP ${res.status}`);
  }
  const json = await res.json();
  const rows: WgerExerciseInfoRow[] = json.results || [];
  return rows.map(row => {
    const {name} = pickEnglishTranslation(row);
    return {id: `wger-${row.id}`, name};
  });
}

export async function fetchWgerExercisesForCatalog(
  limit = 28,
): Promise<ScreenExercise[]> {
  const url = `${WGER_BASE}/exerciseinfo/?language=2&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`wger HTTP ${res.status}`);
  }
  const json = await res.json();
  const rows: WgerExerciseInfoRow[] = json.results || [];
  return rows.map(row => {
    const {name, description} = pickEnglishTranslation(row);
    const muscleFromCategory = row.category?.name
      ? [row.category.name]
      : (row.muscles || []).map(m => m.name).filter(Boolean);
    const muscleGroups =
      muscleFromCategory.length > 0 ? muscleFromCategory : ['general'];
    const equipNames = (row.equipment || []).map(e => e.name).filter(Boolean);
    const equipment =
      equipNames.length > 0 ? equipNames.join(', ') : 'bodyweight';
    const imageUrl = pickImageUrl(row);

    return {
      id: `wger-${row.id}`,
      name,
      description: description.slice(0, 500),
      muscleGroups,
      equipment,
      difficulty: mapDifficulty(row.category?.name),
      instructions: [description.slice(0, 800)],
      sets: 3,
      reps: 12,
      restTime: 60,
      caloriesPerMinute: 8,
      imageUrl,
      videoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
}

function toDifficulty(value: string | undefined): 'beginner' | 'intermediate' | 'advanced' {
  const v = (value || '').toLowerCase();
  if (v.includes('advanced') || v.includes('expert')) return 'advanced';
  if (v.includes('intermediate')) return 'intermediate';
  return 'beginner';
}

function normalizeList(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return values
    .map(v => (typeof v === 'string' ? v : ''))
    .map(v => v.trim())
    .filter(Boolean);
}

function mapMuscleWikiRowToScreenExercise(row: any, index: number): ScreenExercise {
  const id = row?.id != null ? `mw-${String(row.id)}` : `mw-generated-${index}`;
  const name = String(row?.name || `Exercise ${index + 1}`).trim();
  const description = String(
    row?.description ||
      row?.instructions ||
      'No detailed description available for this exercise.',
  ).trim();
  const muscleGroups = normalizeList(
    row?.muscles || row?.muscle_groups || row?.target_muscles,
  );
  const equipmentList = normalizeList(row?.equipment || row?.equipment_required);
  const equipment = equipmentList.length ? equipmentList.join(', ') : 'bodyweight';
  const videoUrl =
    typeof row?.video_url === 'string'
      ? row.video_url
      : typeof row?.video === 'string'
        ? row.video
        : null;
  const imageUrl =
    typeof row?.image_url === 'string'
      ? row.image_url
      : typeof row?.thumbnail === 'string'
        ? row.thumbnail
        : null;

  return {
    id,
    name,
    description: description.slice(0, 500),
    muscleGroups: muscleGroups.length ? muscleGroups : ['general'],
    equipment,
    difficulty: toDifficulty(row?.difficulty),
    instructions: [description.slice(0, 800)],
    sets: 3,
    reps: 12,
    restTime: 60,
    caloriesPerMinute: 8,
    imageUrl,
    videoUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function hasMuscleWikiApiKey(): boolean {
  return MUSCLEWIKI_API_KEY.length > 0 || MUSCLEWIKI_RAPIDAPI_KEY.length > 0;
}

async function fetchMuscleWikiJson(pathAndQuery: string): Promise<any> {
  const attempts: Array<{
    url: string;
    headers: Record<string, string>;
    label: string;
  }> = [];

  if (MUSCLEWIKI_API_KEY) {
    attempts.push({
      url: `${MUSCLEWIKI_BASE}${pathAndQuery}`,
      headers: {
        'X-API-Key': MUSCLEWIKI_API_KEY,
        Accept: 'application/json',
      },
      label: 'direct',
    });
  }

  if (MUSCLEWIKI_RAPIDAPI_KEY) {
    attempts.push({
      url: `${MUSCLEWIKI_RAPID_BASE}${pathAndQuery}`,
      headers: {
        'X-RapidAPI-Key': MUSCLEWIKI_RAPIDAPI_KEY,
        'X-RapidAPI-Host': MUSCLEWIKI_RAPIDAPI_HOST,
        Accept: 'application/json',
      },
      label: 'rapidapi',
    });
  }

  if (!attempts.length) {
    throw new Error('Missing MuscleWiki direct/RapidAPI key');
  }

  let lastError: unknown = null;
  for (const attempt of attempts) {
    try {
      const res = await fetch(attempt.url, {headers: attempt.headers});
      if (!res.ok) {
        throw new Error(`MuscleWiki ${attempt.label} HTTP ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error('MuscleWiki request failed');
}

export async function fetchMuscleWikiExercisesForCatalog(
  limit = 28,
): Promise<ScreenExercise[]> {
  if (!hasMuscleWikiApiKey()) {
    throw new Error('Missing MuscleWiki API key');
  }
  const json = await fetchMuscleWikiJson(`/exercises?limit=${Math.max(1, limit)}`);
  const rows: any[] = Array.isArray(json?.results)
    ? json.results
    : Array.isArray(json)
      ? json
      : [];

  return rows.map((row, index) => mapMuscleWikiRowToScreenExercise(row, index));
}

function toStringArray(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return values
    .map(v => (typeof v === 'string' ? v : v && typeof v === 'object' ? String((v as any).id ?? '') : ''))
    .map(v => v.trim())
    .filter(Boolean);
}

function mapMuscleWikiRoutineRow(row: any, index: number): CatalogWorkoutRoutine {
  const exercises = toStringArray(
    row?.exercise_ids || row?.exercises || row?.exerciseIds,
  );
  const id = row?.id != null ? `mw-routine-${String(row.id)}` : `mw-routine-generated-${index}`;
  const name = String(row?.name || `Routine ${index + 1}`).trim();
  const description = String(
    row?.description || row?.summary || 'Workout routine from MuscleWiki.',
  ).trim();
  const durationRaw = Number(row?.duration ?? row?.duration_minutes ?? 30);
  const caloriesRaw = Number(row?.calories_burned ?? row?.calories ?? 200);
  return {
    id,
    name,
    description,
    exercises,
    duration: Number.isFinite(durationRaw) && durationRaw > 0 ? durationRaw : 30,
    difficulty: toDifficulty(row?.difficulty),
    caloriesBurned:
      Number.isFinite(caloriesRaw) && caloriesRaw > 0 ? caloriesRaw : 200,
    isPublic: true,
    createdBy: 'musclewiki',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function fetchMuscleWikiRoutinesForCatalog(
  limit = 12,
): Promise<CatalogWorkoutRoutine[]> {
  if (!hasMuscleWikiApiKey()) {
    throw new Error('Missing MuscleWiki API key');
  }
  const tryEndpoints = [
    `/routines?limit=${Math.max(1, limit)}`,
    `/workouts?limit=${Math.max(1, limit)}`,
  ];

  let lastError: unknown = null;
  for (const url of tryEndpoints) {
    try {
      const json = await fetchMuscleWikiJson(url);
      const rows: any[] = Array.isArray(json?.results)
        ? json.results
        : Array.isArray(json)
          ? json
          : [];
      const mapped = rows.map((row, index) => mapMuscleWikiRoutineRow(row, index));
      if (mapped.length) {
        return mapped;
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error('No routine data returned from MuscleWiki');
}
