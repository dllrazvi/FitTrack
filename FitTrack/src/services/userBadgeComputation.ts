import {getFirestore, doc, getDoc} from '@react-native-firebase/firestore';
import {getChallengeBadgePresetById} from '../constants/challengeBadgePresets';
import {getRecentWorkoutSessions} from './userWorkoutFirestore';
import {
  loadChallengeRewards,
  type EarnedChallengeReward,
} from './challengeRewardsFirestore';
import {loadDailyNutritionLog} from './nutritionDailyFirestore';
import {
  addDaysYmd,
  currentWorkoutStreakFromDates,
  toYmd,
  ymdInCurrentWeek,
} from '../utils/dateWeek';

export type UiBadge = {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  date: string | null;
};

function isPermissionDeniedError(e: unknown): boolean {
  const msg = String(e || '').toLowerCase();
  return (
    msg.includes('permission-denied') ||
    msg.includes('insufficient permissions') ||
    msg.includes('missing or insufficient permissions')
  );
}

/** Emoji for completed community challenges from reward/title text (no images required). */
export function challengeRewardBadgeIcon(reward: string, title: string): string {
  const t = `${reward} ${title}`.toLowerCase();
  if (t.includes('bronze')) {
    return '🥉';
  }
  if (t.includes('silver')) {
    return '🥈';
  }
  if (t.includes('gold')) {
    return '🥇';
  }
  if (t.includes('platinum') || t.includes('diamond')) {
    return '💎';
  }
  if (t.includes('streak')) {
    return '⚡';
  }
  if (t.includes('calorie') || t.includes('calor')) {
    return '🔥';
  }
  if (t.includes('protein')) {
    return '💪';
  }
  if (t.includes('master') || t.includes('champion')) {
    return '👑';
  }
  if (t.includes('badge')) {
    return '🏅';
  }
  return '🎖️';
}

function parseCompletedAt(raw: string): Date {
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function formatEarned(d: Date): string {
  try {
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return toYmd(d);
  }
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

export async function computeUserBadges(userId: string): Promise<UiBadge[]> {
  let earnedChallenges: EarnedChallengeReward[] = [];
  try {
    earnedChallenges = await loadChallengeRewards(userId);
  } catch (e) {
    console.warn('loadChallengeRewards', e);
  }
  const fromChallenges: UiBadge[] = earnedChallenges.map(c => {
    const preset = getChallengeBadgePresetById(c.badgePresetId);
    const name =
      preset?.label?.trim() ||
      (c.reward || 'Challenge').trim() ||
      'Challenge reward';
    const icon =
      preset?.icon ?? challengeRewardBadgeIcon(c.reward, c.title);
    return {
      id: `challenge_${c.challengeId}`,
      name,
      icon,
      description: (c.title || 'Completed challenge').trim(),
      earned: true,
      date: formatEarned(parseCompletedAt(c.completedAt)),
    };
  });

  try {
    const sessions = await getRecentWorkoutSessions(userId, 200);
  const sessionDates = new Set(
    sessions.map(s => (s.date || '').trim()).filter(Boolean),
  );
  const ymdsSorted = [
    ...new Set(sessions.map(s => (s.date || '').trim()).filter(Boolean)),
  ].sort();
  const firstWorkoutYmd = ymdsSorted[0] || null;

  const db = getFirestore();
  const goalsSnap = await getDoc(doc(db, 'nutritionGoals', userId));
  const proteinGoal =
    typeof goalsSnap.data()?.dailyTargets?.protein === 'number'
      ? goalsSnap.data()!.dailyTargets.protein
      : 50;

  const streak = currentWorkoutStreakFromDates(sessionDates);

  let weekCals = 0;
  for (const s of sessions) {
    if (s.date && ymdInCurrentWeek(s.date)) {
      weekCals +=
        typeof s.caloriesBurned === 'number' ? s.caloriesBurned : 0;
    }
  }

  const today = toYmd(new Date());
  const proteinHitYmds: string[] = [];
  for (let i = 0; i < 120; i++) {
    const ymd = addDaysYmd(today, -i);
    const total = await dailyProteinTotal(userId, ymd);
    if (total >= proteinGoal) {
      proteinHitYmds.push(ymd);
    }
  }
  proteinHitYmds.sort();
  const proteinEarned = proteinHitYmds.length >= 7;
  const seventhProteinYmd = proteinEarned ? proteinHitYmds[6] : null;

  let bestWeekCals = 0;
  for (let w = 0; w < 26; w++) {
    const end = addDaysYmd(today, -w * 7);
    const start = addDaysYmd(end, -6);
    let sum = 0;
    for (const s of sessions) {
      const y = s.date || '';
      if (y >= start && y <= end) {
        sum +=
          typeof s.caloriesBurned === 'number' ? s.caloriesBurned : 0;
      }
    }
    if (sum > bestWeekCals) {
      bestWeekCals = sum;
    }
  }

  const firstEarned =
    firstWorkoutYmd && sessionDates.size > 0
      ? formatEarned(new Date(firstWorkoutYmd + 'T12:00:00'))
      : null;

  const base: UiBadge[] = [
    {
      id: 'first_workout',
      name: 'First Workout',
      icon: '🏆',
      description: 'Complete your first workout',
      earned: sessionDates.size > 0,
      date: firstEarned,
    },
    {
      id: 'streak_master',
      name: 'Streak Master',
      icon: '⚡',
      description: '7-day workout streak',
      earned: streak >= 7,
      date: streak >= 7 ? formatEarned(new Date()) : null,
    },
    {
      id: 'calorie_crusher',
      name: 'Calorie Crusher',
      icon: '🔥',
      description: 'Burn 2000 calories in a week',
      earned: bestWeekCals >= 2000 || weekCals >= 2000,
      date:
        weekCals >= 2000 || bestWeekCals >= 2000
          ? formatEarned(new Date())
          : null,
    },
    {
      id: 'protein_pro',
      name: 'Protein Pro',
      icon: '💪',
      description: 'Hit protein goal for 7 days',
      earned: proteinEarned,
      date:
        proteinEarned && seventhProteinYmd
          ? formatEarned(new Date(seventhProteinYmd + 'T12:00:00'))
          : null,
    },
  ];

    return [...base, ...fromChallenges];
  } catch (e) {
    if (!isPermissionDeniedError(e)) {
      console.warn('computeUserBadges base badges failed', e);
    }
    return fromChallenges;
  }
}
