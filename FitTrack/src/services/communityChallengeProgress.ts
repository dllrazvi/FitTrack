import {
  getFirestore,
  collection,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import {getAuth} from '@react-native-firebase/auth';
import {getRecentWorkoutSessions} from './userWorkoutFirestore';
import {loadDailyNutritionLog} from './nutritionDailyFirestore';
import {
  addDaysYmd,
  currentWorkoutStreakFromDates,
  mondayYmdOfWeek,
  ymdInCurrentWeek,
} from '../utils/dateWeek';
import {firestoreDocExists} from '../utils/firestoreDocument';
import {withFirestoreRetry} from '../utils/firestoreRetry';
import {addUserNotification} from './userNotificationsFirestore';
import {appendChallengeRewardIfNew} from './challengeRewardsFirestore';

const db = getFirestore();
const challengesCol = collection(db, 'communityChallenges');

export type ChallengeMetric =
  | 'streak_7'
  | 'calories_week'
  | 'protein_week'
  | 'weekly_exercises';

function isPermissionDeniedError(e: unknown): boolean {
  const msg = String(e || '').toLowerCase();
  return (
    msg.includes('permission-denied') ||
    msg.includes('insufficient permissions') ||
    msg.includes('missing or insufficient permissions')
  );
}

function inferMetric(
  challengeId: string,
  d: Record<string, unknown>,
): ChallengeMetric {
  const m = d.metricType as string | undefined;
  if (m === 'streak_7') {
    return 'streak_7';
  }
  if (m === 'calories_week') {
    return 'calories_week';
  }
  if (m === 'protein_week') {
    return 'protein_week';
  }
  if (m === 'weekly_exercises') {
    return 'weekly_exercises';
  }
  if (challengeId === 'streak-7') {
    return 'streak_7';
  }
  if (challengeId === 'calories-week') {
    return 'calories_week';
  }
  if (challengeId === 'protein-week') {
    return 'protein_week';
  }
  return 'weekly_exercises';
}

async function dailyProteinTotal(
  userId: string,
  dateYmd: string,
): Promise<number> {
  const meals = await loadDailyNutritionLog(userId, dateYmd);
  let p = 0;
  for (const meal of meals) {
    p += meal.totalNutrition?.protein ?? 0;
  }
  return Math.round(p * 10) / 10;
}

export async function syncChallengeParticipantProgress(
  challengeId: string,
): Promise<void> {
  const userId = getAuth().currentUser?.uid;
  if (!userId) {
    return;
  }
  const cref = doc(challengesCol, challengeId);
  const pref = doc(collection(cref, 'participants'), userId);
  const [pSnap, chSnap] = await withFirestoreRetry(
    () => Promise.all([getDoc(pref), getDoc(cref)]),
    {attempts: 3, baseDelayMs: 350},
  );
  if (!firestoreDocExists(pSnap)) {
    return;
  }
  const pData = pSnap.data() as {progress?: number} | undefined;
  const prevProgress =
    typeof pData?.progress === 'number' ? pData.progress : 0;
  if (!firestoreDocExists(chSnap)) {
    return;
  }
  const d = chSnap.data() as Record<string, unknown>;
  const metric = inferMetric(challengeId, d);
  const sessions = await getRecentWorkoutSessions(userId, 160);
  const dates = new Set(
    sessions.map(s => (s.date || '').trim()).filter(Boolean),
  );
  const weekSessions = sessions.filter(
    s => s.date && ymdInCurrentWeek(s.date),
  );
  const sumEx = weekSessions.reduce(
    (a, s) => a + (typeof s.exercisesCompleted === 'number' ? s.exercisesCompleted : 0),
    0,
  );
  const weekCals = weekSessions.reduce(
    (a, s) => a + (typeof s.caloriesBurned === 'number' ? s.caloriesBurned : 0),
    0,
  );

  let progress = 0;
  let daysCompleted = 0;
  let caloriesBurned = weekCals;

  switch (metric) {
    case 'streak_7': {
      const streak = currentWorkoutStreakFromDates(dates);
      const target =
        typeof d.targetStreakDays === 'number' ? d.targetStreakDays : 7;
      daysCompleted = Math.min(streak, target);
      progress = Math.min(100, Math.round((streak / target) * 100));
      break;
    }
    case 'calories_week': {
      const target =
        typeof d.targetCalories === 'number' ? d.targetCalories : 2000;
      daysCompleted = weekSessions.length;
      progress = Math.min(100, Math.round((weekCals / target) * 100));
      break;
    }
    case 'protein_week': {
      const goalsSnap = await getDoc(doc(db, 'nutritionGoals', userId));
      const pg =
        typeof goalsSnap.data()?.dailyTargets?.protein === 'number'
          ? goalsSnap.data()!.dailyTargets.protein
          : 50;
      const monYmd = mondayYmdOfWeek();
      const weekYmds = Array.from({length: 7}, (_, i) => addDaysYmd(monYmd, i));
      const totals = await Promise.all(
        weekYmds.map(ymd => dailyProteinTotal(userId, ymd)),
      );
      const hit = totals.filter(total => total >= pg).length;
      daysCompleted = hit;
      progress = Math.min(100, Math.round((hit / 7) * 100));
      caloriesBurned = 0;
      break;
    }
    default: {
      const target =
        typeof d.targetTotalExercises === 'number'
          ? d.targetTotalExercises
          : 30;
      daysCompleted = weekSessions.length;
      progress = Math.min(100, Math.round((sumEx / target) * 100));
      break;
    }
  }

  await withFirestoreRetry(
    () =>
      updateDoc(pref, {
        progress,
        daysCompleted,
        caloriesBurned,
        lastProgressSyncAt: serverTimestamp(),
      }),
    {attempts: 4, baseDelayMs: 400},
  );

  if (progress >= 100 && prevProgress < 100) {
    const title = (d.title as string) || 'Challenge';
    const reward = (d.reward as string) || 'Reward';
    const badgePresetId =
      typeof d.badgePresetId === 'string' && d.badgePresetId.trim()
        ? d.badgePresetId.trim()
        : undefined;
    try {
      await withFirestoreRetry(
        () =>
          addUserNotification({
            recipientId: userId,
            actorId: userId,
            type: 'challenge_complete',
            message: `You completed "${title}". Reward: ${reward}`,
            allowSelf: true,
          }),
        {attempts: 3, baseDelayMs: 350},
      );
    } catch (e) {
      console.warn('challenge completion notification', e);
    }
    try {
      await appendChallengeRewardIfNew(userId, {
        challengeId,
        title,
        reward,
        ...(badgePresetId ? {badgePresetId} : {}),
      });
    } catch (e) {
      console.warn('challenge completion reward doc', e);
    }
  }
}

export async function syncAllJoinedChallengesProgress(
  joinedChallengeIds: string[],
): Promise<void> {
  for (const id of joinedChallengeIds) {
    try {
      await syncChallengeParticipantProgress(id);
    } catch (e) {
      if (!isPermissionDeniedError(e)) {
        console.warn('syncChallenge', id, e);
      }
    }
  }
}

export function subscribeMyJoinedChallengeParticipants(
  userId: string,
  challengeIds: string[],
  onUpdate: (
    challengeId: string,
    patch: {progress: number; daysCompleted: number; caloriesBurned: number},
  ) => void,
): () => void {
  const unsubs = challengeIds.map(cid => {
    const pref = doc(
      collection(doc(challengesCol, cid), 'participants'),
      userId,
    );
    return onSnapshot(pref, snap => {
      if (!firestoreDocExists(snap)) {
        return;
      }
      const dat = snap.data()!;
      onUpdate(cid, {
        progress: typeof dat.progress === 'number' ? dat.progress : 0,
        daysCompleted:
          typeof dat.daysCompleted === 'number' ? dat.daysCompleted : 0,
        caloriesBurned:
          typeof dat.caloriesBurned === 'number' ? dat.caloriesBurned : 0,
      });
    });
  });
  return () => unsubs.forEach(u => u());
}
