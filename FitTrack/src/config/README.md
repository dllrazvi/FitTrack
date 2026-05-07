# Firebase Configuration

This directory contains the Firebase configuration for the FitnessApp.

## Files

- `firebase.ts` - Main Firebase configuration and initialization
- `../utils/firebaseUtils.ts` - Utility functions for Firebase operations

## Setup

The Firebase configuration has been set up with your provided credentials:

- **Project ID**: fitnessapp-94d8d
- **Auth Domain**: fitnessapp-94d8d.firebaseapp.com
- **Storage Bucket**: fitnessapp-94d8d.firebasestorage.app

## Available Services

### Authentication
- Email/password sign in and sign up
- Sign out functionality
- Auth state monitoring

### Firestore Database
- User profile management
- Workout data storage and retrieval
- Real-time data synchronization

### Storage
- Image upload for user profiles
- Workout progress photos

## Usage Examples

### Import Firebase services
```typescript
import { auth, firestore, storage } from '../config/firebase';
```

### Use utility functions
```typescript
import { signInWithEmail, saveWorkout, getCurrentUser } from '../utils/firebaseUtils';

// Sign in
const result = await signInWithEmail('user@example.com', 'password');

// Save workout
const workoutData = {
  name: 'Chest Day',
  exercises: [...],
  duration: 45
};
await saveWorkout(userId, workoutData);

// Get current user
const user = getCurrentUser();
```

## Security Rules

Make sure to set up proper Firestore security rules in your Firebase console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /workouts/{workoutId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## Storage Rules

For Firebase Storage, set up rules like:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
``` 