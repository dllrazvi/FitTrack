import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  writeBatch,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  increment,
  deleteDoc,
  updateDoc,
} from '@react-native-firebase/firestore';
import {getAuth} from '@react-native-firebase/auth';
import {firestoreDocExists} from '../utils/firestoreDocument';
import {addUserNotification} from './userNotificationsFirestore';
import {deleteCommunityMediaByDownloadUrls} from './communityMediaUpload';

export type FeedComment = {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: Date;
  timeLabel: string;
};

export type CommunityPostKind =
  | 'text'
  | 'media'
  | 'video'
  | 'custom_exercise'
  | 'share_workout'
  | 'share_meal'
  | 'share_challenge';

export type FeedPost = {
  id: string;
  authorId: string;
  authorName: string;
  authorInitial: string;
  body: string;
  imageUrls: string[];
  /** One optional clip per post (URL in Storage). */
  videoUrl: string;
  postKind: CommunityPostKind;
  /** Present when someone shared a community challenge to the feed. */
  sharedChallenge?: {
    id: string;
    title: string;
    reward: string;
  };
  createdAt: Date;
  relativeTime: string;
  likesCount: number;
  likedByMe: boolean;
  comments: FeedComment[];
};

function formatRelative(d: Date): string {
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 45) {
    return 'just now';
  }
  if (sec < 3600) {
    return `${Math.floor(sec / 60)}m ago`;
  }
  if (sec < 86400) {
    return `${Math.floor(sec / 3600)}h ago`;
  }
  return `${Math.floor(sec / 86400)}d ago`;
}

const db = getFirestore();
const postsCol = collection(db, 'communityPosts');

export function listenCommunityFeed(
  onUpdate: (posts: FeedPost[]) => void,
  onError: (e: Error) => void,
): () => void {
  const q = query(postsCol, orderBy('createdAt', 'desc'), limit(25));
  return onSnapshot(
    q,
    async snapshot => {
      try {
        const uid = getAuth().currentUser?.uid;
        const out: FeedPost[] = [];
        for (const docSnap of snapshot.docs) {
          const dat = docSnap.data();
          const createdAt = dat.createdAt?.toDate?.() || new Date();
          let likedByMe = false;
          if (uid) {
            const ls = await getDoc(
              doc(collection(docSnap.ref, 'likes'), uid),
            );
            likedByMe = firestoreDocExists(ls);
          }
          const cq = await getDocs(
            query(
              collection(docSnap.ref, 'comments'),
              orderBy('createdAt', 'desc'),
              limit(10),
            ),
          );
          const comments: FeedComment[] = cq.docs
            .map((c: {id: string; data: () => Record<string, unknown>}) => {
              const cd = c.data();
              const ca = cd.createdAt as {toDate?: () => Date} | undefined;
              const dt = ca?.toDate?.() || new Date();
              return {
                id: c.id,
                authorId: cd.authorId,
                authorName: cd.authorName || 'User',
                text: cd.text || '',
                createdAt: dt,
                timeLabel: formatRelative(dt),
              };
            })
            .reverse();

          const rawUrls = dat.imageUrls;
          const imageUrls = Array.isArray(rawUrls)
            ? rawUrls.filter((u: unknown) => typeof u === 'string')
            : [];
          const videoUrl =
            typeof dat.videoUrl === 'string' && dat.videoUrl.length > 0
              ? dat.videoUrl
              : '';
          const postKindRaw = dat.postKind;
          const postKind: CommunityPostKind =
            postKindRaw === 'media' ||
            postKindRaw === 'video' ||
            postKindRaw === 'custom_exercise' ||
            postKindRaw === 'share_workout' ||
            postKindRaw === 'share_meal' ||
            postKindRaw === 'share_challenge'
              ? postKindRaw
              : videoUrl
                ? 'video'
                : imageUrls.length > 0
                  ? 'media'
                  : 'text';

          const schId = dat.sharedChallengeId;
          const schTitle = dat.sharedChallengeTitle;
          let sharedChallenge: FeedPost['sharedChallenge'] | undefined;
          if (
            typeof schId === 'string' &&
            schId.length > 0 &&
            typeof schTitle === 'string' &&
            schTitle.length > 0
          ) {
            const rw = dat.sharedChallengeReward;
            sharedChallenge = {
              id: schId,
              title: schTitle,
              reward: typeof rw === 'string' ? rw : '',
            };
          }

          out.push({
            id: docSnap.id,
            authorId: dat.authorId,
            authorName: dat.authorName || 'User',
            authorInitial: dat.authorInitial || '?',
            body: dat.body || '',
            imageUrls,
            videoUrl,
            postKind,
            ...(sharedChallenge ? {sharedChallenge} : {}),
            createdAt,
            relativeTime: formatRelative(createdAt),
            likesCount:
              typeof dat.likesCount === 'number' ? dat.likesCount : 0,
            likedByMe,
            comments,
          });
        }
        onUpdate(out);
      } catch (e: any) {
        onError(e instanceof Error ? e : new Error(String(e)));
      }
    },
    err => onError(err as Error),
  );
}

export type CreateCommunityPostInput = {
  body: string;
  imageUrls?: string[];
  videoUrl?: string;
  postKind?: CommunityPostKind;
  /** Attach a challenge card (postKind becomes share_challenge). */
  sharedChallenge?: {
    id: string;
    title: string;
    reward?: string;
  };
};

export async function createCommunityPost(
  bodyOrInput: string | CreateCommunityPostInput,
): Promise<void> {
  const user = getAuth().currentUser;
  if (!user) {
    throw new Error('Not authenticated');
  }
  const input: CreateCommunityPostInput =
    typeof bodyOrInput === 'string'
      ? {body: bodyOrInput}
      : bodyOrInput;
  const trimmed = (input.body || '').trim();
  const imageUrls = input.imageUrls?.filter(Boolean) ?? [];
  const videoIn = (input.videoUrl || '').trim();
  const sch = input.sharedChallenge;
  const hasShareChallenge =
    sch &&
    typeof sch.id === 'string' &&
    sch.id.trim().length > 0 &&
    typeof sch.title === 'string' &&
    sch.title.trim().length > 0;

  if (!trimmed && imageUrls.length === 0 && !videoIn && !hasShareChallenge) {
    throw new Error(
      'Write something, add a photo or video, or attach a challenge to share.',
    );
  }

  const postKind: CommunityPostKind = hasShareChallenge
    ? 'share_challenge'
    : input.postKind ??
      (videoIn
        ? 'video'
        : imageUrls.length > 0
          ? 'media'
          : 'text');

  const displayName = user.displayName || user.email || 'User';
  const initial = displayName.trim().charAt(0).toUpperCase() || '?';
  const payload: Record<string, unknown> = {
    authorId: user.uid,
    authorName: displayName,
    authorInitial: initial,
    body: trimmed,
    imageUrls,
    postKind,
    createdAt: serverTimestamp(),
    likesCount: 0,
    commentsCount: 0,
  };
  if (videoIn) {
    payload.videoUrl = videoIn;
  }
  if (hasShareChallenge && sch) {
    payload.sharedChallengeId = sch.id.trim();
    payload.sharedChallengeTitle = sch.title.trim();
    payload.sharedChallengeReward =
      typeof sch.reward === 'string' ? sch.reward.trim() : '';
  }
  await addDoc(postsCol, payload);
}

export async function deleteCommunityPost(postId: string): Promise<void> {
  const user = getAuth().currentUser;
  if (!user) {
    throw new Error('Not authenticated');
  }
  const postRef = doc(postsCol, postId);
  const snap = await getDoc(postRef);
  const snapRow = snap.data() as {authorId?: string} | undefined;
  if (!firestoreDocExists(snap) || snapRow?.authorId !== user.uid) {
    throw new Error('Forbidden');
  }
  const data = snap.data() as {
    imageUrls?: unknown;
    videoUrl?: unknown;
  };
  const imageUrls = data?.imageUrls as string[] | undefined;
  const v = data?.videoUrl;
  const videoUrl = typeof v === 'string' && v.length > 0 ? v : undefined;
  await deleteCommunityMediaByDownloadUrls(
    [...(imageUrls ?? []), videoUrl].filter(
      (x): x is string => typeof x === 'string' && x.length > 0,
    ),
  );

  const batch = writeBatch(db);
  const comments = await getDocs(collection(postRef, 'comments'));
  for (const qd of comments.docs) {
    batch.delete(qd.ref);
  }
  const likes = await getDocs(collection(postRef, 'likes'));
  for (const qd of likes.docs) {
    batch.delete(qd.ref);
  }
  batch.delete(postRef);
  await batch.commit();
}

export async function togglePostLike(postId: string): Promise<void> {
  const user = getAuth().currentUser;
  const uid = user?.uid;
  if (!uid) {
    return;
  }
  const postRef = doc(postsCol, postId);
  const likeRef = doc(collection(postRef, 'likes'), uid);
  const before = await getDoc(likeRef);
  const wasLiked = firestoreDocExists(before);

  await runTransaction(db, async t => {
    const likeSnap = await t.get(likeRef);
    if (firestoreDocExists(likeSnap)) {
      t.delete(likeRef);
      t.update(postRef, {likesCount: increment(-1)});
    } else {
      t.set(likeRef, {at: serverTimestamp()});
      t.update(postRef, {likesCount: increment(1)});
    }
  });

  const after = await getDoc(likeRef);
  if (firestoreDocExists(after) && !wasLiked) {
    const postSnap = await getDoc(postRef);
    const authorId = (postSnap.data() as {authorId?: string} | undefined)
      ?.authorId;
    const name = user.displayName || user.email || 'Someone';
    if (authorId && authorId !== uid) {
      await addUserNotification({
        recipientId: authorId,
        actorId: uid,
        type: 'like',
        message: `${name} liked your post`,
        postId,
      });
    }
  }
}

export async function addPostComment(
  postId: string,
  text: string,
): Promise<void> {
  const user = getAuth().currentUser;
  if (!user) {
    throw new Error('Not authenticated');
  }
  const name = user.displayName || user.email || 'User';
  const postRef = doc(postsCol, postId);
  await addDoc(collection(postRef, 'comments'), {
    authorId: user.uid,
    authorName: name,
    text: text.trim(),
    createdAt: serverTimestamp(),
  });
  await updateDoc(postRef, {
    commentsCount: increment(1),
  });

  const postSnap = await getDoc(postRef);
  const authorId = (postSnap.data() as {authorId?: string} | undefined)
    ?.authorId;
  if (authorId && authorId !== user.uid) {
    await addUserNotification({
      recipientId: authorId,
      actorId: user.uid,
      type: 'comment',
      message: `${name} commented on your post`,
      postId,
    });
  }
}

export async function deletePostComment(
  postId: string,
  commentId: string,
): Promise<void> {
  const user = getAuth().currentUser;
  if (!user) {
    throw new Error('Not authenticated');
  }
  const postRef = doc(postsCol, postId);
  const cref = doc(collection(postRef, 'comments'), commentId);
  const cs = await getDoc(cref);
  const csAuthor = cs.data() as {authorId?: string} | undefined;
  if (!firestoreDocExists(cs) || csAuthor?.authorId !== user.uid) {
    throw new Error('Forbidden');
  }
  await deleteDoc(cref);
  await updateDoc(postRef, {
    commentsCount: increment(-1),
  });
}
