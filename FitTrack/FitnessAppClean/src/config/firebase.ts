import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJFjl", // You need to get this from Firebase Console
  authDomain: "fitness-37f84.firebaseapp.com",
  projectId: "fitness-37f84",
  storageBucket: "fitness-37f84.appspot.com",
  messagingSenderId: "954564865193",
  appId: "1:954564865193:web:your-app-id" // You need to get this from Firebase Console
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app; 