import {
  getFirestore,
  collection,
  doc,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  writeBatch,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from '@react-native-firebase/firestore';

export type UiNotification = {
  id: string;
  message: string;
  time: string;
  read: boolean;
  type?: string;
  postId?: string;
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

function notifCol(recipientId: string) {
  return collection(db, 'users', recipientId, 'notifications');
}

/**
 * Inbox message. Social events skip self; use `allowSelf` for system-style (e.g. challenge completed).
 */
export async function addUserNotification(params: {
  recipientId: string;
  actorId: string;
  type: 'like' | 'comment' | 'challenge_complete';
  message: string;
  postId?: string;
  allowSelf?: boolean;
}): Promise<void> {
  if (params.recipientId === params.actorId && !params.allowSelf) {
    return;
  }
  await addDoc(notifCol(params.recipientId), {
    recipientId: params.recipientId,
    actorId: params.actorId,
    type: params.type,
    message: params.message,
    postId: params.postId ?? null,
    read: false,
    createdAt: serverTimestamp(),
  });
}

export async function markAllNotificationsRead(recipientId: string): Promise<void> {
  const q = query(notifCol(recipientId), orderBy('createdAt', 'desc'), limit(40));
  const snap = await getDocs(q);
  const batch = writeBatch(db);
  let n = 0;
  for (const d of snap.docs) {
    const data = d.data();
    if (!data.read) {
      batch.update(d.ref, {read: true});
      n++;
    }
    if (n >= 400) {
      break;
    }
  }
  if (n > 0) {
    await batch.commit();
  }
}

export function subscribeUserNotifications(
  recipientId: string,
  onUpdate: (items: UiNotification[]) => void,
  onError: (e: Error) => void,
): () => void {
  const q = query(notifCol(recipientId), orderBy('createdAt', 'desc'), limit(40));
  return onSnapshot(
    q,
    snap => {
      try {
        const list: UiNotification[] = snap.docs.map(
          (qd: {id: string; data: () => Record<string, unknown>}) => {
            const dat = qd.data();
            const ca = dat.createdAt as {toDate?: () => Date} | undefined;
            const createdAt = ca?.toDate?.() || new Date();
            return {
              id: qd.id,
              message: dat.message || '',
              time: formatRelative(createdAt),
              read: Boolean(dat.read),
              type: dat.type,
              postId: dat.postId || undefined,
            };
          },
        );
        onUpdate(list);
      } catch (e) {
        onError(e instanceof Error ? e : new Error(String(e)));
      }
    },
    err => onError(err as Error),
  );
}

export async function markNotificationRead(
  recipientId: string,
  notificationId: string,
): Promise<void> {
  await updateDoc(doc(notifCol(recipientId), notificationId), {read: true});
}
