import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import {getAuth} from '@react-native-firebase/auth';
import type {MealEntry} from '../backend/models/Nutrition';

const db = getFirestore();
const logsCol = collection(db, 'dailyNutritionLogs');

function dayDocId(userId: string, date: string) {
  return `${userId}_${date}`;
}

/** Plain JSON for Firestore (no Date objects in nested meals). */
function serializeMeal(meal: MealEntry) {
  return {
    id: meal.id,
    userId: meal.userId,
    date: meal.date,
    mealType: meal.mealType,
    timestamp:
      meal.timestamp instanceof Date
        ? meal.timestamp.toISOString()
        : String(meal.timestamp),
    items: meal.items,
    totalNutrition: meal.totalNutrition,
    notes: meal.notes ?? '',
    createdAt:
      meal.createdAt instanceof Date
        ? meal.createdAt.toISOString()
        : String(meal.createdAt),
    updatedAt:
      meal.updatedAt instanceof Date
        ? meal.updatedAt.toISOString()
        : String(meal.updatedAt),
  };
}

function deserializeMeal(raw: Record<string, unknown>): MealEntry {
  const ts = raw.timestamp ? new Date(String(raw.timestamp)) : new Date();
  const ca = raw.createdAt ? new Date(String(raw.createdAt)) : ts;
  const ua = raw.updatedAt ? new Date(String(raw.updatedAt)) : ca;
  return {
    id: String(raw.id),
    userId: String(raw.userId),
    date: String(raw.date),
    mealType: raw.mealType as MealEntry['mealType'],
    timestamp: ts,
    items: raw.items as MealEntry['items'],
    totalNutrition: raw.totalNutrition as MealEntry['totalNutrition'],
    notes: raw.notes ? String(raw.notes) : undefined,
    createdAt: ca,
    updatedAt: ua,
  };
}

export async function saveDailyNutritionLog(
  userId: string,
  date: string,
  meals: MealEntry[],
): Promise<void> {
  const docId = dayDocId(userId, date);
  const mealsPlain = meals.map(m => ({
    ...serializeMeal({...m, userId}),
  }));
  const docRef = doc(logsCol, docId);
  await setDoc(
    docRef,
    {
      userId,
      date,
      meals: mealsPlain,
      updatedAt: serverTimestamp(),
    },
    {merge: true},
  );
}

export async function loadDailyNutritionLog(
  userId: string,
  date: string,
): Promise<MealEntry[]> {
  const docId = dayDocId(userId, date);
  const docRef = doc(logsCol, docId);
  const snap = await getDoc(docRef);
  if (!snap.exists) {
    return [];
  }
  const d = snap.data() as {meals?: unknown} | undefined;
  const meals = d?.meals;
  if (!Array.isArray(meals)) {
    return [];
  }
  return meals.map(m => deserializeMeal(m as Record<string, unknown>));
}

export function currentUserId(): string | undefined {
  return getAuth().currentUser?.uid;
}
