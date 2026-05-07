import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import {getAuth} from '@react-native-firebase/auth';

export type FirestoreRoutine = {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  exerciseIds: string[];
  duration: number;
  caloriesBurned: number;
  muscleGroups: string[];
  equipment: string;
  createdAt: Date;
  updatedAt: Date;
};

export type FirestoreSessionInput = {
  date: string;
  routineName: string;
  duration: number;
  caloriesBurned: number;
  exercisesCompleted: number;
  completedSets?: number;
  exerciseBreakdown?: Array<{
    exerciseId: string;
    exerciseName: string;
    setsCompleted: number;
  }>;
};

const db = getFirestore();

const uid = () => getAuth().currentUser?.uid;

function routinesCol(userId: string) {
  return collection(db, 'users', userId, 'routines');
}

function sessionsCol(userId: string) {
  return collection(db, 'users', userId, 'workoutSessions');
}

function plannerRef(userId: string) {
  return doc(db, 'users', userId, 'settings', 'weeklyPlanner');
}

function mapRoutineDoc(d: {
  id: string;
  data: () => Record<string, unknown>;
}): FirestoreRoutine {
  const data = d.data() as any;
  const createdAt = data?.createdAt?.toDate?.() || new Date();
  const updatedAt = data?.updatedAt?.toDate?.() || createdAt;
  return {
    id: d.id,
    name: data.name || '',
    description: data.description || '',
    difficulty: data.difficulty || 'beginner',
    exerciseIds: Array.isArray(data.exerciseIds) ? data.exerciseIds : [],
    duration: typeof data.duration === 'number' ? data.duration : 0,
    caloriesBurned: typeof data.caloriesBurned === 'number' ? data.caloriesBurned : 0,
    muscleGroups: Array.isArray(data.muscleGroups) ? data.muscleGroups : [],
    equipment: data.equipment || 'mixed',
    createdAt,
    updatedAt,
  };
}

export function subscribeUserRoutines(
  userId: string,
  onUpdate: (routines: FirestoreRoutine[]) => void,
  onError: (e: Error) => void,
): () => void {
  const q = query(routinesCol(userId), orderBy('updatedAt', 'desc'));
  return onSnapshot(
    q,
    snap => {
      try {
        onUpdate(
          snap.docs.map((qd: {id: string; data: () => Record<string, unknown>}) =>
            mapRoutineDoc(qd),
          ),
        );
      } catch (e) {
        onError(e instanceof Error ? e : new Error(String(e)));
      }
    },
    err => onError(err),
  );
}

export async function createUserRoutine(input: {
  name: string;
  description: string;
  difficulty: string;
  exerciseIds: string[];
  duration: number;
  caloriesBurned: number;
  muscleGroups?: string[];
  equipment?: string;
}): Promise<string> {
  const id = uid();
  if (!id) {
    throw new Error('Not signed in');
  }
  const ref = doc(routinesCol(id));
  const now = serverTimestamp();
  await setDoc(ref, {
    name: input.name,
    description: input.description,
    difficulty: input.difficulty,
    exerciseIds: input.exerciseIds,
    duration: input.duration,
    caloriesBurned: input.caloriesBurned,
    muscleGroups: input.muscleGroups ?? [],
    equipment: input.equipment ?? 'mixed',
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export async function deleteUserRoutine(routineId: string): Promise<void> {
  const id = uid();
  if (!id) {
    throw new Error('Not signed in');
  }
  await deleteDoc(doc(routinesCol(id), routineId));
}

export async function getRecentWorkoutSessions(
  userId: string,
  lim = 120,
): Promise<(FirestoreSessionInput & {id: string})[]> {
  const q = query(
    sessionsCol(userId),
    orderBy('createdAt', 'desc'),
    limit(lim),
  );
  const snap = await getDocs(q);
  return snap.docs.map((qd: {id: string; data: () => Record<string, unknown>}) => {
    const dat = qd.data();
    return {
      id: qd.id,
      date: dat.date || '',
      routineName: dat.routineName || '',
      duration: typeof dat.duration === 'number' ? dat.duration : 0,
      caloriesBurned:
        typeof dat.caloriesBurned === 'number' ? dat.caloriesBurned : 0,
      exercisesCompleted:
        typeof dat.exercisesCompleted === 'number' ? dat.exercisesCompleted : 0,
      completedSets: typeof dat.completedSets === 'number' ? dat.completedSets : 0,
      exerciseBreakdown: Array.isArray(dat.exerciseBreakdown)
        ? dat.exerciseBreakdown
        : [],
    };
  });
}

export function subscribeWorkoutSessions(
  userId: string,
  onUpdate: (sessions: (FirestoreSessionInput & {id: string})[]) => void,
  onError: (e: Error) => void,
): () => void {
  const q = query(sessionsCol(userId), orderBy('createdAt', 'desc'), limit(80));
  return onSnapshot(
    q,
    snap => {
      try {
        const list = snap.docs.map((qd: {id: string; data: () => Record<string, unknown>}) => {
          const dat = qd.data() as Record<string, unknown>;
          return {
            id: qd.id,
            date: dat.date || '',
            routineName: dat.routineName || '',
            duration: typeof dat.duration === 'number' ? dat.duration : 0,
            caloriesBurned:
              typeof dat.caloriesBurned === 'number' ? dat.caloriesBurned : 0,
            exercisesCompleted:
              typeof dat.exercisesCompleted === 'number'
                ? dat.exercisesCompleted
                : 0,
            completedSets: typeof dat.completedSets === 'number' ? dat.completedSets : 0,
            exerciseBreakdown: Array.isArray(dat.exerciseBreakdown)
              ? dat.exerciseBreakdown
              : [],
          };
        });
        onUpdate(list);
      } catch (e) {
        onError(e instanceof Error ? e : new Error(String(e)));
      }
    },
    err => onError(err),
  );
}

export async function addWorkoutSessionDoc(
  input: FirestoreSessionInput,
): Promise<string> {
  const id = uid();
  if (!id) {
    throw new Error('Not signed in');
  }
  const ref = doc(sessionsCol(id));
  await setDoc(ref, {
    ...input,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export type WeeklyPlanState = {[key: string]: string | null};

export async function loadWeeklyPlanner(
  userId: string,
): Promise<WeeklyPlanState | null> {
  const snap = await getDoc(plannerRef(userId));
  if (!snap.exists) {
    return null;
  }
  const dat = snap.data();
  const plan = dat?.plan;
  if (plan && typeof plan === 'object') {
    return plan as WeeklyPlanState;
  }
  return null;
}

export async function saveWeeklyPlanner(
  userId: string,
  plan: WeeklyPlanState,
): Promise<void> {
  await setDoc(
    plannerRef(userId),
    {
      plan,
      updatedAt: serverTimestamp(),
    },
    {merge: true},
  );
}
