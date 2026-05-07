import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import {getAuth} from '@react-native-firebase/auth';
import {getRecentWorkoutSessions} from './userWorkoutFirestore';
import {
  currentWorkoutStreakFromDates,
  mondayYmdOfWeek,
  ymdInCurrentWeek,
} from '../utils/dateWeek';
import {firestoreDocExists} from '../utils/firestoreDocument';

export type LeaderboardRow = {
  rank: number;
  name: string;
  workouts: number;
  calories: number;
  streak: number;
};

const db = getFirestore();
const leaderboardCol = collection(db, 'publicLeaderboardStats');

/**
 * Recomputes this user's weekly totals + streak from workoutSessions and writes a public row
 * (readable by any signed-in user for the Community leaderboard).
 */
export async function syncMyPublicLeaderboardStats(): Promise<void> {
  const user = getAuth().currentUser;
  if (!user) {
    return;
  }
  const uid = user.uid;
  const sessions = await getRecentWorkoutSessions(uid, 160);
  const dates = new Set(
    sessions.map(s => (s.date || '').trim()).filter(Boolean),
  );
  const streak = currentWorkoutStreakFromDates(dates);
  const weekStart = mondayYmdOfWeek();
  let workoutsThisWeek = 0;
  let caloriesThisWeek = 0;
  for (const s of sessions) {
    const y = (s.date || '').trim();
    if (y && ymdInCurrentWeek(y)) {
      workoutsThisWeek++;
      caloriesThisWeek +=
        typeof s.caloriesBurned === 'number' ? s.caloriesBurned : 0;
    }
  }
  const displayName =
    user.displayName?.trim() ||
    user.email?.split('@')[0]?.trim() ||
    'Member';
  await setDoc(
    doc(leaderboardCol, uid),
    {
      userId: uid,
      displayName,
      workoutsThisWeek,
      caloriesThisWeek,
      currentStreak: streak,
      weekStartYmd: weekStart,
      lastSessionYmd: sessions.length ? sessions[0].date || null : null,
      updatedAt: serverTimestamp(),
    },
    {merge: true},
  );
}

export function subscribePublicLeaderboard(
  onUpdate: (rows: LeaderboardRow[]) => void,
  onError: (e: Error) => void,
): () => void {
  const q = query(
    leaderboardCol,
    orderBy('workoutsThisWeek', 'desc'),
    limit(40),
  );
  return onSnapshot(
    q,
    snap => {
      try {
        const rows: LeaderboardRow[] = snap.docs.map(
          (
            qd: {data: () => Record<string, unknown>},
            i: number,
          ): LeaderboardRow => {
            const dat = qd.data();
            return {
              rank: i + 1,
              name: (dat.displayName as string) || 'Member',
              workouts:
                typeof dat.workoutsThisWeek === 'number'
                  ? dat.workoutsThisWeek
                  : 0,
              calories:
                typeof dat.caloriesThisWeek === 'number'
                  ? dat.caloriesThisWeek
                  : 0,
              streak:
                typeof dat.currentStreak === 'number' ? dat.currentStreak : 0,
            };
          },
        );
        onUpdate(rows);
      } catch (e) {
        onError(e instanceof Error ? e : new Error(String(e)));
      }
    },
    err => onError(err as Error),
  );
}

/** One-shot sync when opening leaderboard (no listener yet). */
export async function ensureMyLeaderboardRowExists(): Promise<void> {
  const user = getAuth().currentUser;
  if (!user) {
    return;
  }
  const snap = await getDoc(doc(leaderboardCol, user.uid));
  if (!firestoreDocExists(snap)) {
    await syncMyPublicLeaderboardStats();
  }
}
