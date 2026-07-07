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
  return rows.map(row => mapWgerInfoRowToScreenExercise(row));
}

function mapWgerInfoRowToScreenExercise(row: WgerExerciseInfoRow): ScreenExercise {
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
}

export async function fetchWgerExerciseDetail(
  exerciseId: string,
): Promise<ScreenExercise | null> {
  const numericId = exerciseId.replace(/^wger-/, '').trim();
  if (!/^\d+$/.test(numericId)) {
    return null;
  }
  const url = `${WGER_BASE}/exerciseinfo/${numericId}/?language=2`;
  const res = await fetch(url);
  if (!res.ok) {
    return null;
  }
  const row: WgerExerciseInfoRow = await res.json();
  if (!row?.id) {
    return null;
  }
  return mapWgerInfoRowToScreenExercise(row);
}

export async function fetchCatalogExerciseDetail(
  exerciseId: string,
): Promise<ScreenExercise | null> {
  const trimmed = exerciseId.trim();
  if (!trimmed) {
    return null;
  }
  if (trimmed.startsWith('mw-') || /^\d+$/.test(trimmed.replace(/^mw-/, ''))) {
    try {
      const muscleWiki = await fetchMuscleWikiExerciseDetail(trimmed);
      if (muscleWiki) {
        return muscleWiki;
      }
    } catch {
      /* try wger next */
    }
  }
  if (trimmed.startsWith('wger-')) {
    return fetchWgerExerciseDetail(trimmed);
  }
  return null;
}

function stripMarkdown(text: string): string {
  if (!text) {
    return '';
  }
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/(^|\n)-\s*/g, '$1• ')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncatePreview(text: string, maxLength = 160): string {
  const clean = text.trim();
  if (clean.length <= maxLength) {
    return clean;
  }
  return `${clean.slice(0, maxLength).trim()}...`;
}

function firstPreviewSentence(text: string, maxLength = 160): string {
  const clean = stripMarkdown(text);
  const match = clean.match(/^[^.!?]+[.!?]?/);
  return truncatePreview((match?.[0] || clean).trim(), maxLength);
}

const NAME_EQUIPMENT_PATTERNS: [RegExp, string][] = [
  [/\bsmith machine\b/i, 'Smith machine'],
  [/\bmachine\b/i, 'Machine'],
  [/\bkettlebell\b/i, 'Kettlebell'],
  [/\bdumbbell\b/i, 'Dumbbell'],
  [/\bbarbell\b/i, 'Barbell'],
  [/\bcable\b/i, 'Cable'],
  [/\bband\b/i, 'Band'],
  [/\bbodyweight\b/i, 'Bodyweight'],
  [/\bplate\b/i, 'Plate'],
  [/\btrx\b/i, 'TRX'],
  [/\bmedicine ball\b/i, 'Medicine ball'],
];

function inferEquipmentFromName(name: string): string | null {
  for (const [pattern, label] of NAME_EQUIPMENT_PATTERNS) {
    if (pattern.test(name)) {
      return label;
    }
  }
  return null;
}

function buildListPreviewDescription(
  row: any,
  name: string,
  muscleGroups: string[],
  equipment: string,
  listMuscleFilter?: string | null,
): string {
  const steps = normalizeList(row?.steps);
  if (steps.length) {
    return firstPreviewSentence(steps[0]);
  }

  const rawDetail = row?.description || row?.details || row?.instructions;
  if (typeof rawDetail === 'string' && rawDetail.trim()) {
    return firstPreviewSentence(rawDetail);
  }

  const muscles =
    muscleGroups.length && muscleGroups[0] !== 'general'
      ? muscleGroups.slice(0, 2).join(', ')
      : listMuscleFilter?.trim() || null;

  const equip =
    equipment !== 'bodyweight'
      ? equipment
      : inferEquipmentFromName(name);

  const parts = [muscles, equip].filter(Boolean);
  if (parts.length) {
    return parts.join(' · ');
  }

  return 'Open for instructions and demo video.';
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

function firstVideoUrl(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) {
    return value.split('#')[0].trim();
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const url = firstVideoUrl(item);
      if (url) {
        return url;
      }
    }
  }
  return null;
}

function extractYoutubeWatchUrl(value: unknown): string | null {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw) {
    return null;
  }
  const embedMatch = raw.match(/youtube\.com\/embed\/([^?&/]+)/i);
  if (embedMatch?.[1]) {
    return `https://www.youtube.com/watch?v=${embedMatch[1]}`;
  }
  if (/youtube\.com\/watch/i.test(raw) || raw.includes('youtu.be/')) {
    return raw.split('#')[0];
  }
  return null;
}

function pickExerciseVideoUrl(row: any): string | null {
  const youtubeWatch = extractYoutubeWatchUrl(row?.youtubeURL);
  if (youtubeWatch) {
    return youtubeWatch;
  }
  const mp4 =
    firstVideoUrl(row?.video_url) ||
    firstVideoUrl(row?.video) ||
    firstVideoUrl(row?.videoURL);
  if (mp4 && !mp4.includes('media.musclewiki.com')) {
    return mp4;
  }
  return null;
}

function pickOfficialVideoUrl(row: any): string | null {
  if (Array.isArray(row?.videos)) {
    for (const video of row.videos) {
      const url =
        typeof video === 'object' && video && typeof video.url === 'string'
          ? video.url
          : null;
      if (url?.trim()) {
        return url.split('#')[0].trim();
      }
    }
  }
  return pickExerciseVideoUrl(row);
}

function pickOfficialImageUrl(row: any): string | null {
  if (Array.isArray(row?.videos)) {
    for (const video of row.videos) {
      const image =
        typeof video === 'object' && video && typeof video.og_image === 'string'
          ? video.og_image
          : null;
      if (image?.trim()) {
        return image.trim();
      }
    }
  }
  if (typeof row?.image_url === 'string' && row.image_url.trim()) {
    return row.image_url.trim();
  }
  if (typeof row?.thumbnail === 'string' && row.thumbnail.trim()) {
    return row.thumbnail.trim();
  }
  return null;
}

function buildMuscleWikiListQuery(
  limit: number,
  offset: number,
  options?: MuscleWikiCatalogOptions,
): string {
  const params = new URLSearchParams();
  params.set('limit', String(Math.min(100, Math.max(1, limit))));
  params.set('offset', String(Math.max(0, offset)));
  if (options?.muscles?.length) {
    for (const muscle of options.muscles) {
      params.append('muscles', muscle);
    }
  }
  return `/exercises?${params.toString()}`;
}

async function hydrateOfficialExerciseRows(rows: any[]): Promise<any[]> {
  if (!rows.length) {
    return [];
  }
  const needsDetail = rows.some(
    row => !row?.steps?.length && !row?.videos?.length && !row?.primary_muscles?.length,
  );
  if (!needsDetail) {
    return rows;
  }

  return Promise.all(
    rows.map(async row => {
      if (row?.steps?.length || row?.videos?.length || row?.primary_muscles?.length) {
        return row;
      }
      if (row?.id == null) {
        return row;
      }
      try {
        return await fetchMuscleWikiJson(`/exercises/${row.id}`);
      } catch {
        return row;
      }
    }),
  );
}

export type MuscleWikiCatalogOptions = {
  muscles?: string[];
  /** When false, list items skip video/thumbnail payloads (load on tap). */
  includeMedia?: boolean;
};

export const MUSCLE_GROUP_OFFICIAL_FILTER: Record<string, string> = {
  chest: 'Chest',
  lats: 'Lats',
  glutes: 'Glutes',
  lowerback: 'Lower Back',
  traps: 'Traps',
  trapsmiddle: 'Mid back',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  hamstrings: 'Hamstrings',
  quadriceps: 'Quads',
  calves: 'Calves',
  core: 'Abdominals',
  obliques: 'Obliques',
};

export function getOfficialMuscleFilterName(key: string | null | undefined): string | null {
  if (!key) {
    return null;
  }
  return MUSCLE_GROUP_OFFICIAL_FILTER[key] ?? null;
}

function mapMuscleWikiRowToScreenExercise(
  row: any,
  index: number,
  options?: {includeMedia?: boolean; listMuscleFilter?: string | null},
): ScreenExercise {
  const includeMedia = options?.includeMedia ?? true;
  const listMuscleFilter = options?.listMuscleFilter ?? null;
  const id = row?.id != null ? `mw-${String(row.id)}` : `mw-generated-${index}`;
  const name = String(
    row?.name || row?.exercise_name || `Exercise ${index + 1}`,
  ).trim();
  const steps = normalizeList(row?.steps);
  const muscleGroups = normalizeList(
    row?.primary_muscles || row?.muscles || row?.muscle_groups || row?.target_muscles,
  );
  const resolvedMuscleGroups = muscleGroups.length > 0 ? muscleGroups : ['general'];
  const equipmentList = normalizeList(row?.equipment || row?.equipment_required);
  const equipment =
    equipmentList.length > 0
      ? equipmentList.join(', ')
      : typeof row?.category === 'string' && row.category.trim()
        ? row.category.trim()
        : typeof row?.Category === 'string' && row.Category.trim()
          ? row.Category.trim()
          : inferEquipmentFromName(name) || 'bodyweight';
  const description = includeMedia
    ? stripMarkdown(
        String(
          row?.description ||
            row?.details ||
            (steps.length ? steps.join(' ') : '') ||
            row?.instructions ||
            'No detailed description available for this exercise.',
        ),
      ).trim()
    : buildListPreviewDescription(
        row,
        name,
        resolvedMuscleGroups,
        equipment,
        listMuscleFilter,
      );
  const videoUrl = includeMedia
    ? hasPaidMuscleWikiApiKey()
      ? pickOfficialVideoUrl(row)
      : pickExerciseVideoUrl(row)
    : null;
  const imageUrl = includeMedia ? pickOfficialImageUrl(row) : null;

  return {
    id,
    name,
    description: description.slice(0, 500),
    muscleGroups: resolvedMuscleGroups,
    equipment,
    difficulty: toDifficulty(row?.difficulty || row?.Difficulty),
    instructions: steps.length
      ? steps.map(step => stripMarkdown(step))
      : [description.slice(0, 800)],
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

function hasPaidMuscleWikiApiKeyInternal(): boolean {
  return MUSCLEWIKI_API_KEY.length > 0 || MUSCLEWIKI_RAPIDAPI_KEY.length > 0;
}

export function hasMuscleWikiApiKey(): boolean {
  return hasPaidMuscleWikiApiKeyInternal();
}

export function hasPaidMuscleWikiApiKey(): boolean {
  return hasPaidMuscleWikiApiKeyInternal();
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
  limit = 100,
  options?: MuscleWikiCatalogOptions,
): Promise<ScreenExercise[]> {
  if (!hasMuscleWikiApiKey()) {
    throw new Error('Missing MuscleWiki API key');
  }

  const safeLimit = Math.max(1, limit);
  const includeMedia = options?.includeMedia ?? false;
  const listMuscleFilter = options?.muscles?.[0] ?? null;
  const mapOptions = {includeMedia, listMuscleFilter};

  const collected: any[] = [];
  let offset = 0;
  while (collected.length < safeLimit) {
    const pageLimit = Math.min(100, safeLimit - collected.length);
    const json = await fetchMuscleWikiJson(
      buildMuscleWikiListQuery(pageLimit, offset, options),
    );
    const rows: any[] = Array.isArray(json?.results)
      ? json.results
      : Array.isArray(json)
        ? json
        : [];
    if (!rows.length) {
      break;
    }
    const detailed = includeMedia
      ? await hydrateOfficialExerciseRows(rows)
      : rows;
    collected.push(...detailed);
    offset += rows.length;
    if (rows.length < pageLimit) {
      break;
    }
  }

  return collected
    .slice(0, safeLimit)
    .map((row, index) =>
      mapMuscleWikiRowToScreenExercise(row, index, mapOptions),
    );
}

export async function fetchMuscleWikiExerciseDetail(
  exerciseId: string,
): Promise<ScreenExercise | null> {
  if (!hasPaidMuscleWikiApiKey()) {
    return null;
  }
  const numericId = exerciseId.replace(/^mw-/, '').trim();
  if (!/^\d+$/.test(numericId)) {
    return null;
  }
  const json = await fetchMuscleWikiJson(`/exercises/${numericId}`);
  return mapMuscleWikiRowToScreenExercise(json, 0, {includeMedia: true});
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
