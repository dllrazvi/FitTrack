import {
  getStorage,
  ref,
  putFile,
  getDownloadURL,
  refFromURL,
  deleteObject,
} from '@react-native-firebase/storage';
import {getAuth} from '@react-native-firebase/auth';

const storage = getStorage();

export async function uploadCommunityPostImage(
  localUri: string,
  contentType?: string | null,
): Promise<string> {
  const uid = getAuth().currentUser?.uid;
  if (!uid) {
    throw new Error('Not signed in');
  }
  const stamp = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const storageRef = ref(storage, `communityMedia/${uid}/${stamp}`);
  const meta =
    contentType && contentType.startsWith('image/')
      ? {contentType}
      : undefined;
  await putFile(storageRef, localUri, meta);
  return getDownloadURL(storageRef);
}

const VIDEO_TYPES = new Set(['video/mp4', 'video/quicktime', 'video/3gpp', 'video/x-matroska']);

export async function uploadCommunityPostVideo(
  localUri: string,
  contentType?: string | null,
): Promise<string> {
  const uid = getAuth().currentUser?.uid;
  if (!uid) {
    throw new Error('Not signed in');
  }
  const stamp = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const isVideo =
    contentType &&
    (contentType.startsWith('video/') || VIDEO_TYPES.has(contentType));
  const ext =
    isVideo && contentType?.includes('quicktime')
      ? 'mov'
      : isVideo && contentType?.includes('3gpp')
        ? '3gp'
        : 'mp4';
  const storageRef = ref(storage, `communityMedia/${uid}/${stamp}.${ext}`);
  const meta = contentType?.startsWith('video/')
    ? {contentType}
    : {contentType: 'video/mp4'};
  await putFile(storageRef, localUri, meta);
  return getDownloadURL(storageRef);
}

export async function deleteCommunityMediaByDownloadUrls(
  urls: string[] | undefined,
): Promise<void> {
  if (!urls?.length) {
    return;
  }
  await Promise.all(
    urls.map(async u => {
      try {
        await deleteObject(refFromURL(storage, u));
      } catch {
        // Orphaned file or revoked URL — ignore
      }
    }),
  );
}
