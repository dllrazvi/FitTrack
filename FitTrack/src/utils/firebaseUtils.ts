import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as authSignOut,
  onAuthStateChanged as authOnAuthStateChanged,
} from '@react-native-firebase/auth';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import {ref, putFile, getDownloadURL} from '@react-native-firebase/storage';
import {firebaseAuth, firebaseDb, firebaseStorage} from '../config/firebase';

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

// Authentication functions
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    );
    return {success: true, user: userCredential.user};
  } catch (error) {
    return {success: false, error: errorMessage(error)};
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    );
    return {success: true, user: userCredential.user};
  } catch (error) {
    return {success: false, error: errorMessage(error)};
  }
};

export const signOut = async () => {
  try {
    await authSignOut(firebaseAuth);
    return {success: true};
  } catch (error) {
    return {success: false, error: errorMessage(error)};
  }
};

// Firestore functions for fitness data
export const saveUserProfile = async (userId: string, profileData: any) => {
  try {
    await setDoc(doc(collection(firebaseDb, 'users'), userId), profileData);
    return {success: true};
  } catch (error) {
    return {success: false, error: errorMessage(error)};
  }
};

export const saveWorkout = async (userId: string, workoutData: any) => {
  try {
    await addDoc(collection(doc(collection(firebaseDb, 'users'), userId), 'workouts'), {
      ...workoutData,
      createdAt: serverTimestamp(),
    });
    return {success: true};
  } catch (error) {
    return {success: false, error: errorMessage(error)};
  }
};

export const getUserWorkouts = async (userId: string) => {
  try {
    const workoutsCol = collection(
      doc(collection(firebaseDb, 'users'), userId),
      'workouts',
    );
    const snapshot = await getDocs(
      query(workoutsCol, orderBy('createdAt', 'desc')),
    );

    const workouts = snapshot.docs.map(
      (qd: {id: string; data: () => Record<string, unknown>}) => ({
        id: qd.id,
        ...qd.data(),
      }),
    );

    return {success: true, workouts};
  } catch (error) {
    return {success: false, error: errorMessage(error)};
  }
};

// Storage functions for images
export const uploadImage = async (
  userId: string,
  imageUri: string,
  fileName: string,
) => {
  try {
    const reference = ref(firebaseStorage, `users/${userId}/${fileName}`);
    await putFile(reference, imageUri);
    const url = await getDownloadURL(reference);
    return {success: true, url};
  } catch (error) {
    return {success: false, error: errorMessage(error)};
  }
};

// Get current user
export const getCurrentUser = () => {
  return firebaseAuth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChanged = (callback: (user: any) => void) => {
  return authOnAuthStateChanged(firebaseAuth, callback);
};
