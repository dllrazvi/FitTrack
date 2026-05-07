import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  writeBatch,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  increment,
} from '@react-native-firebase/firestore';
import {getAuth} from '@react-native-firebase/auth';
import {firestoreDocExists} from '../utils/firestoreDocument';
import {withFirestoreRetry} from '../utils/firestoreRetry';
import {getChallengeBadgePresetById} from '../constants/challengeBadgePresets';
import type {ChallengeMetric} from './communityChallengeProgress';

export type UiChallenge = {
  id: string;
  title: string;
  description: string;
  participants: number;
  progress: number;
  reward: string;
  /** Preset badge id for Badges tab when challenge is completed */
  badgePresetId?: string;
  joined: boolean;
  daysCompleted?: number;
  caloriesBurned?: number;
  startDate: string;
  createdBy?: string | null;
  metricType?: ChallengeMetric | string;
  targetTotalExercises?: number;
  targetCalories?: number;
  targetStreakDays?: number;
  selectedExerciseIds?: string[];
};

const db = getFirestore();
const challengesCol = collection(db, 'communityChallenges');

const DEFAULTS: Omit<UiChallenge, 'joined'>[] = [
  {
    id: 'streak-7',
    title: '7-Day Workout Streak',
    description: 'Complete a workout for 7 consecutive days',
    participants: 0,
    progress: 0,
    reward: 'Streak Runner',
    badgePresetId: 'streak_runner',
    daysCompleted: 0,
    startDate: new Date().toISOString().slice(0, 10),
    metricType: 'streak_7',
    targetStreakDays: 7,
  },
  {
    id: 'calories-week',
    title: 'Calorie Burn Challenge',
    description: 'Burn 2000 calories this week',
    participants: 0,
    progress: 0,
    reward: 'Firestarter',
    badgePresetId: 'firestarter',
    caloriesBurned: 0,
    startDate: new Date().toISOString().slice(0, 10),
    metricType: 'calories_week',
    targetCalories: 2000,
  },
  {
    id: 'protein-week',
    title: 'Protein Power Week',
    description: 'Hit your protein goal for 7 days',
    participants: 0,
    progress: 0,
    reward: 'Power Builder',
    badgePresetId: 'power_builder',
    daysCompleted: 0,
    startDate: new Date().toISOString().slice(0, 10),
    metricType: 'protein_week',
  },
];

export async function seedCommunityChallengesIfEmpty(): Promise<void> {
  const snap = await getDocs(query(challengesCol, limit(1)));
  if (!snap.empty) {
    return;
  }
  const batch = writeBatch(db);
  for (const c of DEFAULTS) {
    const ref = doc(challengesCol, c.id);
    batch.set(ref, {
      title: c.title,
      description: c.description,
      reward: c.reward,
      badgePresetId: c.badgePresetId ?? null,
      participantsCount: 0,
      startDate: c.startDate,
      metricType: c.metricType,
      targetStreakDays: c.targetStreakDays ?? null,
      targetCalories: c.targetCalories ?? null,
      targetTotalExercises: c.targetTotalExercises ?? null,
      selectedExerciseIds: c.selectedExerciseIds ?? [],
      createdAt: serverTimestamp(),
    });
  }
  await batch.commit();
}

export function subscribeCommunityChallenges(
  onUpdate: (list: UiChallenge[]) => void,
  onError: (e: Error) => void,
): () => void {
  const q = query(challengesCol, orderBy('title'));
  return onSnapshot(
    q,
    async snap => {
      try {
        const uid = getAuth().currentUser?.uid;
        const out: UiChallenge[] = [];
        for (const d of snap.docs) {
          const dat = d.data();
          let joined = false;
          let pdata: Record<string, unknown> | undefined;
          if (uid) {
            const p = await getDoc(doc(collection(d.ref, 'participants'), uid));
            joined = firestoreDocExists(p);
            pdata = joined ? (p.data() as Record<string, unknown>) : undefined;
          }
          const sel = dat.selectedExerciseIds;
          const bpid = dat.badgePresetId;
          out.push({
            id: d.id,
            title: dat.title || '',
            description: dat.description || '',
            reward: dat.reward || '',
            badgePresetId:
              typeof bpid === 'string' && bpid.trim() ? bpid.trim() : undefined,
            participants:
              typeof dat.participantsCount === 'number'
                ? dat.participantsCount
                : 0,
            progress:
              typeof pdata?.progress === 'number' ? pdata.progress : 0,
            joined,
            daysCompleted:
              typeof pdata?.daysCompleted === 'number'
                ? pdata.daysCompleted
                : 0,
            caloriesBurned:
              typeof pdata?.caloriesBurned === 'number'
                ? pdata.caloriesBurned
                : 0,
            startDate: dat.startDate || '',
            createdBy: dat.createdBy ?? null,
            metricType: dat.metricType,
            targetTotalExercises:
              typeof dat.targetTotalExercises === 'number'
                ? dat.targetTotalExercises
                : undefined,
            targetCalories:
              typeof dat.targetCalories === 'number'
                ? dat.targetCalories
                : undefined,
            targetStreakDays:
              typeof dat.targetStreakDays === 'number'
                ? dat.targetStreakDays
                : undefined,
            selectedExerciseIds: Array.isArray(sel) ? sel : [],
          });
        }
        onUpdate(out);
      } catch (e) {
        onError(e instanceof Error ? e : new Error(String(e)));
      }
    },
    err => onError(err),
  );
}

export async function joinCommunityChallenge(
  challengeId: string,
): Promise<void> {
  const uid = getAuth().currentUser?.uid;
  if (!uid) {
    throw new Error('Not signed in');
  }
  const cref = doc(challengesCol, challengeId);
  const pref = doc(collection(cref, 'participants'), uid);
  await withFirestoreRetry(
    () =>
      runTransaction(db, async tx => {
        const pSnap = await tx.get(pref);
        if (firestoreDocExists(pSnap)) {
          return;
        }
        tx.set(pref, {
          joinedAt: serverTimestamp(),
          progress: 0,
          daysCompleted: 0,
          caloriesBurned: 0,
        });
        tx.update(cref, {
          participantsCount: increment(1),
        });
      }),
    {attempts: 4, baseDelayMs: 450},
  );
}

/** After a client timeout, check whether join actually landed on the server. */
export async function hasJoinedCommunityChallenge(
  challengeId: string,
): Promise<boolean> {
  const uid = getAuth().currentUser?.uid;
  if (!uid) {
    return false;
  }
  const pref = doc(
    collection(doc(challengesCol, challengeId), 'participants'),
    uid,
  );
  const snap = await getDoc(pref);
  return firestoreDocExists(snap);
}

export type CreateChallengeInput = {
  title: string;
  description: string;
  /** Must match `CHALLENGE_BADGE_PRESETS`; `reward` label is derived from preset. */
  badgePresetId: string;
  metricType: ChallengeMetric;
  targetTotalExercises?: number;
  targetCalories?: number;
  targetStreakDays?: number;
  selectedExerciseIds?: string[];
};

export async function createCommunityChallenge(
  input: CreateChallengeInput,
): Promise<string> {
  const u = getAuth().currentUser;
  if (!u) {
    throw new Error('Not signed in');
  }
  const preset = getChallengeBadgePresetById(input.badgePresetId?.trim());
  if (!preset) {
    throw new Error('Choose a valid badge for this challenge.');
  }
  const ref = doc(challengesCol);
  await setDoc(ref, {
    title: input.title.trim(),
    description: input.description.trim(),
    reward: preset.label,
    badgePresetId: preset.id,
    participantsCount: 0,
    startDate: new Date().toISOString().slice(0, 10),
    createdBy: u.uid,
    createdAt: serverTimestamp(),
    metricType: input.metricType,
    targetTotalExercises:
      typeof input.targetTotalExercises === 'number'
        ? input.targetTotalExercises
        : input.metricType === 'weekly_exercises'
          ? 30
          : null,
    targetCalories:
      typeof input.targetCalories === 'number'
        ? input.targetCalories
        : input.metricType === 'calories_week'
          ? 2000
          : null,
    targetStreakDays:
      typeof input.targetStreakDays === 'number'
        ? input.targetStreakDays
        : input.metricType === 'streak_7'
          ? 7
          : null,
    selectedExerciseIds: Array.isArray(input.selectedExerciseIds)
      ? input.selectedExerciseIds
      : [],
  });
  return ref.id;
}

export async function updateCommunityChallenge(
  challengeId: string,
  patch: {
    title?: string;
    description?: string;
    reward?: string;
    badgePresetId?: string;
    targetTotalExercises?: number;
    targetCalories?: number;
    targetStreakDays?: number;
    selectedExerciseIds?: string[];
  },
): Promise<void> {
  const u = getAuth().currentUser;
  if (!u) {
    throw new Error('Not signed in');
  }
  const ref = doc(challengesCol, challengeId);
  const snap = await getDoc(ref);
  if (!firestoreDocExists(snap)) {
    throw new Error('Challenge not found');
  }
  const snapData = snap.data() as {createdBy?: string} | undefined;
  if (snapData?.createdBy !== u.uid) {
    throw new Error('Only the creator can edit this challenge');
  }
  const clean: Record<string, unknown> = {};
  if (typeof patch.title === 'string') {
    clean.title = patch.title.trim();
  }
  if (typeof patch.description === 'string') {
    clean.description = patch.description.trim();
  }
  if (typeof patch.reward === 'string') {
    clean.reward = patch.reward.trim();
  }
  if (typeof patch.badgePresetId === 'string') {
    const preset = getChallengeBadgePresetById(patch.badgePresetId.trim());
    if (preset) {
      clean.badgePresetId = preset.id;
      clean.reward = preset.label;
    }
  }
  if (typeof patch.targetTotalExercises === 'number') {
    clean.targetTotalExercises = patch.targetTotalExercises;
  }
  if (typeof patch.targetCalories === 'number') {
    clean.targetCalories = patch.targetCalories;
  }
  if (typeof patch.targetStreakDays === 'number') {
    clean.targetStreakDays = patch.targetStreakDays;
  }
  if (Array.isArray(patch.selectedExerciseIds)) {
    clean.selectedExerciseIds = patch.selectedExerciseIds;
  }
  if (Object.keys(clean).length === 0) {
    return;
  }
  clean.updatedAt = serverTimestamp();
  await setDoc(ref, clean, {merge: true});
}

export async function deleteCommunityChallenge(
  challengeId: string,
): Promise<void> {
  const u = getAuth().currentUser;
  if (!u) {
    throw new Error('Not signed in');
  }
  const ref = doc(challengesCol, challengeId);
  const snap = await getDoc(ref);
  if (!firestoreDocExists(snap)) {
    throw new Error('Challenge not found');
  }
  const createdBy = (snap.data() as {createdBy?: string} | undefined)
    ?.createdBy;
  if (createdBy !== u.uid) {
    throw new Error('Only the creator can delete this challenge');
  }
  const parts = await getDocs(collection(ref, 'participants'));
  let batch = writeBatch(db);
  let n = 0;
  for (const d of parts.docs) {
    batch.delete(d.ref);
    n++;
    if (n >= 400) {
      await batch.commit();
      batch = writeBatch(db);
      n = 0;
    }
  }
  batch.delete(ref);
  await batch.commit();
}
