import {getApps, initializeApp} from '@react-native-firebase/app';
import {getAuth} from '@react-native-firebase/auth';
import {getFirestore} from '@react-native-firebase/firestore';
import {getStorage} from '@react-native-firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAqu97IPz2KPcmUahrF3kgtsZSlYO5tTCI',
  authDomain: 'fitnessapp-94d8d.firebaseapp.com',
  projectId: 'fitnessapp-94d8d',
  storageBucket: 'fitnessapp-94d8d.firebasestorage.app',
  messagingSenderId: '544519532398',
  appId: '1:544519532398:web:41248c476325b9e53a9b7f',
  measurementId: 'G-TQYLRFHY3Z',
};

if (!getApps().length) {
  void initializeApp(firebaseConfig);
}

export const firebaseAuth = getAuth();
export const firebaseDb = getFirestore();
export const firebaseStorage = getStorage();
