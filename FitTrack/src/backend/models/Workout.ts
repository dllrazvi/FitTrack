export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'balance' | 'sports';
  muscleGroups: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  // Equipment needed
  equipment: string[];
  bodyweightOnly: boolean;
  
  // Instructions
  instructions: string[];
  tips: string[];
  
  // Media
  imageUrl?: string;
  videoUrl?: string;
  
  // Metadata
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  description: string;
  userId: string;
  
  // Routine details
  category: 'strength' | 'cardio' | 'flexibility' | 'mixed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // minutes
  
  // Exercises in this routine
  exercises: {
    exerciseId: string;
    exerciseName: string;
    sets: number;
    reps?: number;
    duration?: number; // seconds
    weight?: number; // kg
    restTime: number; // seconds
    order: number;
  }[];
  
  // Schedule
  schedule?: {
    daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
    timeOfDay?: 'morning' | 'afternoon' | 'evening';
  };
  
  // Metadata
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  routineId?: string;
  routineName?: string;
  
  // Session details
  startTime: Date;
  endTime?: Date;
  duration?: number; // minutes
  
  // Exercises performed
  exercises: {
    exerciseId: string;
    exerciseName: string;
    sets: {
      reps?: number;
      weight?: number; // kg
      duration?: number; // seconds
      completed: boolean;
      notes?: string;
    }[];
    totalSets: number;
    completedSets: number;
  }[];
  
  // Performance metrics
  metrics: {
    totalCaloriesBurned?: number;
    averageHeartRate?: number;
    maxHeartRate?: number;
    totalWeight?: number; // kg
    totalReps?: number;
  };
  
  // User feedback
  rating?: number; // 1-5
  difficulty?: 'easy' | 'moderate' | 'hard';
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutGoal {
  userId: string;
  
  // Weekly targets
  weeklyTargets: {
    workouts: number;
    totalDuration: number; // minutes
    totalCalories: number;
  };
  
  // Specific goals
  specificGoals: {
    type: 'strength' | 'endurance' | 'flexibility' | 'weight_loss' | 'muscle_gain';
    target: string;
    currentValue?: number;
    targetValue: number;
    unit: string;
    deadline?: Date;
  }[];
  
  // Progress tracking
  progress: {
    currentStreak: number;
    longestStreak: number;
    totalWorkouts: number;
    totalCaloriesBurned: number;
    averageWorkoutDuration: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface MuscleGroup {
  id: string;
  name: string;
  description: string;
  exercises: string[]; // Exercise IDs
  imageUrl?: string;
} 