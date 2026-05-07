import {signOut as authSignOut} from '@react-native-firebase/auth';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from '@react-native-firebase/firestore';
import {firebaseAuth, firebaseDb} from '../../config/firebase';
import {User, UserProfile} from '../models/User';

const usersCol = collection(firebaseDb, 'users');

export class UserService {
  private static instance: UserService;

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const currentUser = firebaseAuth.currentUser;
      if (!currentUser) return null;

      const userDoc = await getDoc(doc(usersCol, currentUser.uid));
      if (!userDoc.exists) return null;

      return userDoc.data() as User;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Create or update user profile
  async createUserProfile(userData: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const currentUser = firebaseAuth.currentUser;
      if (!currentUser) {
        return { success: false, error: 'No authenticated user' };
      }

      const userProfile: User = {
        uid: currentUser.uid,
        email: currentUser.email || '',
        displayName: currentUser.displayName || userData.displayName,
        photoURL: currentUser.photoURL || userData.photoURL,
        profile: {
          firstName: userData.profile?.firstName,
          lastName: userData.profile?.lastName,
          age: userData.profile?.age,
          gender: userData.profile?.gender,
          height: userData.profile?.height,
          weight: userData.profile?.weight,
          activityLevel: userData.profile?.activityLevel || 'moderate',
          fitnessGoal: userData.profile?.fitnessGoal || 'maintain',
        },
        goals: {
          dailyCalories: userData.goals?.dailyCalories || 2000,
          dailySteps: userData.goals?.dailySteps || 10000,
          weeklyWorkouts: userData.goals?.weeklyWorkouts || 3,
          targetWeight: userData.goals?.targetWeight,
          targetDate: userData.goals?.targetDate,
        },
        preferences: {
          dietaryRestrictions: userData.preferences?.dietaryRestrictions || [],
          favoriteExercises: userData.preferences?.favoriteExercises || [],
          workoutDuration: userData.preferences?.workoutDuration || 45,
          notifications: {
            meals: userData.preferences?.notifications?.meals ?? true,
            workouts: userData.preferences?.notifications?.workouts ?? true,
            reminders: userData.preferences?.notifications?.reminders ?? true,
          },
        },
        stats: {
          totalWorkouts: 0,
          totalCaloriesBurned: 0,
          currentStreak: 0,
          longestStreak: 0,
          joinDate: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(usersCol, currentUser.uid), userProfile);
      return { success: true, user: userProfile };
    } catch (error: any) {
      console.error('Error creating user profile:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user profile
  async updateUserProfile(updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const currentUser = firebaseAuth.currentUser;
      if (!currentUser) {
        return { success: false, error: 'No authenticated user' };
      }

      const updateData = {
        ...updates,
        updatedAt: new Date(),
      };

      await updateDoc(doc(usersCol, currentUser.uid), updateData);
      
      // Get updated user data
      const updatedUser = await this.getCurrentUser();
      return { success: true, user: updatedUser || undefined };
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user statistics
  async updateUserStats(stats: Partial<User['stats']>): Promise<{ success: boolean; error?: string }> {
    try {
      const currentUser = firebaseAuth.currentUser;
      if (!currentUser) {
        return { success: false, error: 'No authenticated user' };
      }

      await updateDoc(doc(usersCol, currentUser.uid), {
        'stats': stats,
        updatedAt: new Date(),
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error updating user stats:', error);
      return { success: false, error: error.message };
    }
  }

  // Calculate and update daily goals progress
  async updateDailyProgress(): Promise<{ success: boolean; error?: string }> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'No user data found' };
      }

      // Here you would calculate daily progress based on nutrition and workout data
      // For now, we'll just update the timestamp
      await updateDoc(doc(usersCol, currentUser.uid), {
        updatedAt: new Date(),
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error updating daily progress:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user's daily statistics
  async getDailyStats(): Promise<{
    caloriesConsumed: number;
    caloriesBurned: number;
    steps: number;
    workouts: number;
  }> {
    try {
      // This would typically fetch from daily logs
      // For now, returning mock data
      return {
        caloriesConsumed: 1200,
        caloriesBurned: 450,
        steps: 8500,
        workouts: 1,
      };
    } catch (error) {
      console.error('Error getting daily stats:', error);
      return {
        caloriesConsumed: 0,
        caloriesBurned: 0,
        steps: 0,
        workouts: 0,
      };
    }
  }

  // Calculate BMR (Basal Metabolic Rate)
  calculateBMR(user: User): number {
    const { weight, height, age, gender } = user.profile;
    if (!weight || !height || !age || !gender) return 2000; // Default

    // Mifflin-St Jeor Equation
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  }

  // Calculate daily calorie needs
  calculateDailyCalories(user: User): number {
    const bmr = this.calculateBMR(user);
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    const activityLevel = user.profile.activityLevel || 'moderate';
    const multiplier = activityMultipliers[activityLevel] || 1.55;

    return Math.round(bmr * multiplier);
  }

  // Sign out user
  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      await authSignOut(firebaseAuth);
      return { success: true };
    } catch (error: any) {
      console.error('Error signing out:', error);
      return { success: false, error: error.message };
    }
  }
}
