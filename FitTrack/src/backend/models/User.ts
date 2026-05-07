export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  
  // Profile Information
  profile: {
    firstName?: string;
    lastName?: string;
    age?: number;
    gender?: 'male' | 'female' | 'other';
    height?: number; // cm
    weight?: number; // kg
    activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    fitnessGoal?: 'lose_weight' | 'maintain' | 'gain_weight' | 'build_muscle';
  };
  
  // Goals & Targets
  goals: {
    dailyCalories?: number;
    dailySteps?: number;
    weeklyWorkouts?: number;
    weeklySetsTarget?: number;
    targetWeight?: number;
    targetDate?: Date;
  };
  
  // Preferences
  preferences: {
    dietaryRestrictions?: string[];
    favoriteExercises?: string[];
    workoutDuration?: number; // minutes
    notifications?: {
      meals: boolean;
      workouts: boolean;
      reminders: boolean;
    };
  };
  
  // Statistics
  stats: {
    totalWorkouts: number;
    totalCaloriesBurned: number;
    currentStreak: number;
    longestStreak: number;
    joinDate: Date;
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  uid: string;
  displayName?: string;
  photoURL?: string;
  profile: User['profile'];
  goals: User['goals'];
  preferences: User['preferences'];
  stats: User['stats'];
} 