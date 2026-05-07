import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import {firestoreDocExists} from '../utils/firestoreDocument';
import {withFirestoreRetry} from '../utils/firestoreRetry';

export type EarnedChallengeReward = {
  challengeId: string;
  title: string;
  reward: string;
  /** Matches `CHALLENGE_BADGE_PRESETS` id when challenge was created with a preset. */
  badgePresetId?: string;
  completedAt: string;
};

const db = getFirestore();

function docRef(userId: string) {
  return doc(db, 'users', userId, 'settings', 'challengeRewards');
}

/**
 * Append one completed-challenge reward (get + set merge).
 * Avoids runTransaction quirks on some RN Firebase builds.
 */
export async function appendChallengeRewardIfNew(
  userId: string,
  entry: Omit<EarnedChallengeReward, 'completedAt'> & {
    completedAt?: string;
    badgePresetId?: string;
  },
): Promise<void> {
  await withFirestoreRetry(
    async () => {
      const ref = docRef(userId);
      const snap = await getDoc(ref);
      const raw = firestoreDocExists(snap) ? snap.data()?.items : undefined;
      const items: EarnedChallengeReward[] = Array.isArray(raw)
        ? (raw as EarnedChallengeReward[])
        : [];
      if (items.some(i => i.challengeId === entry.challengeId)) {
        return;
      }
      const next: EarnedChallengeReward = {
        challengeId: entry.challengeId,
        title: entry.title || '',
        reward: entry.reward || '',
        completedAt: entry.completedAt || new Date().toISOString(),
        ...(typeof entry.badgePresetId === 'string' && entry.badgePresetId.trim()
          ? {badgePresetId: entry.badgePresetId.trim()}
          : {}),
      };
      await setDoc(
        ref,
        {
          items: [...items, next],
          updatedAt: serverTimestamp(),
        },
        {merge: true},
      );
    },
    {attempts: 6, baseDelayMs: 450},
  );
}

function normalizeRewardRow(raw: unknown): EarnedChallengeReward | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const o = raw as Record<string, unknown>;
  const challengeId = typeof o.challengeId === 'string' ? o.challengeId : '';
  if (!challengeId) {
    return null;
  }
  let completedAt = '';
  const ca = o.completedAt;
  if (typeof ca === 'string') {
    completedAt = ca;
  } else if (ca && typeof (ca as {toDate?: () => Date}).toDate === 'function') {
    completedAt = (ca as {toDate: () => Date}).toDate().toISOString();
  } else {
    completedAt = new Date().toISOString();
  }
  const badgePresetId =
    typeof o.badgePresetId === 'string' && o.badgePresetId.trim()
      ? o.badgePresetId.trim()
      : undefined;
  return {
    challengeId,
    title: typeof o.title === 'string' ? o.title : '',
    reward: typeof o.reward === 'string' ? o.reward : '',
    completedAt,
    ...(badgePresetId ? {badgePresetId} : {}),
  };
}

export type JoinedChallengeProgress = {
  id: string;
  title: string;
  reward: string;
  progress: number;
  badgePresetId?: string;
};

/** Idempotent: ensure Firestore has a row for every joined challenge at 100%. */
export async function backfillChallengeRewardsFromProgress(
  userId: string,
  joinedComplete: JoinedChallengeProgress[],
): Promise<void> {
  for (const c of joinedComplete) {
    if (c.progress < 100) {
      continue;
    }
    try {
      await appendChallengeRewardIfNew(userId, {
        challengeId: c.id,
        title: c.title,
        reward: c.reward,
        ...(c.badgePresetId ? {badgePresetId: c.badgePresetId} : {}),
      });
    } catch (e) {
      console.warn('backfill challenge reward', c.id, e);
    }
  }
}

export async function loadChallengeRewards(
  userId: string,
): Promise<EarnedChallengeReward[]> {
  const snap = await getDoc(docRef(userId));
  if (!firestoreDocExists(snap)) {
    return [];
  }
  const raw = snap.data()?.items;
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .map(normalizeRewardRow)
    .filter((x): x is EarnedChallengeReward => x != null);
}
