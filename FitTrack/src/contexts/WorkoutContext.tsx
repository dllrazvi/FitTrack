import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {getAuth, onAuthStateChanged} from '@react-native-firebase/auth';
import {
  addWorkoutSessionDoc,
  subscribeWorkoutSessions,
} from '../services/userWorkoutFirestore';
import {syncMyPublicLeaderboardStats} from '../services/leaderboardFirestore';

const firebaseAuth = getAuth();

export interface WorkoutSession {
  id: string;
  date: string;
  routineName: string;
  duration: number;
  caloriesBurned: number;
  exercisesCompleted: number;
  completedSets?: number;
  exerciseBreakdown?: Array<{
    exerciseId: string;
    exerciseName: string;
    setsCompleted: number;
  }>;
}

export interface WeeklyWorkoutStats {
  totalWorkouts: number;
  totalDuration: number;
  totalCalories: number;
  averageDuration: number;
}

interface WorkoutContextType {
  workoutHistory: WorkoutSession[];
  weeklyStats: WeeklyWorkoutStats;
  addWorkoutSession: (session: WorkoutSession) => void;
  getWeeklyStats: () => WeeklyWorkoutStats;
  clearHistory: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

interface WorkoutProviderProps {
  children: React.ReactNode;
}

export const WorkoutProvider: React.FC<WorkoutProviderProps> = ({children}) => {
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyWorkoutStats>({
    totalWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0,
    averageDuration: 0,
  });

  useEffect(() => {
    let unsubSessions: (() => void) | undefined;

    const off = onAuthStateChanged(firebaseAuth, user => {
      unsubSessions?.();
      unsubSessions = undefined;

      if (!user) {
        setWorkoutHistory([]);
        return;
      }

      unsubSessions = subscribeWorkoutSessions(
        user.uid,
        list => {
          setWorkoutHistory(
            list.map(s => ({
              id: s.id,
              date: s.date,
              routineName: s.routineName,
              duration: s.duration,
              caloriesBurned: s.caloriesBurned,
              exercisesCompleted: s.exercisesCompleted,
              completedSets: s.completedSets,
              exerciseBreakdown: s.exerciseBreakdown,
            })),
          );
        },
        err => console.warn('workoutSessions listener', err),
      );
    });

    return () => {
      off();
      unsubSessions?.();
    };
  }, []);

  const getWeeklyStats = useCallback((): WeeklyWorkoutStats => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weeklyWorkouts = workoutHistory.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= weekAgo;
    });

    const totalWorkouts = weeklyWorkouts.length;
    const totalDuration = weeklyWorkouts.reduce(
      (sum, w) => sum + w.duration,
      0,
    );
    const totalCalories = weeklyWorkouts.reduce(
      (sum, w) => sum + w.caloriesBurned,
      0,
    );
    const averageDuration =
      totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

    return {
      totalWorkouts,
      totalDuration,
      totalCalories,
      averageDuration,
    };
  }, [workoutHistory]);

  const addWorkoutSession = useCallback((session: WorkoutSession) => {
    const u = firebaseAuth.currentUser;
    if (u) {
      const {id: _id, ...rest} = session;
      addWorkoutSessionDoc(rest)
        .then(() => syncMyPublicLeaderboardStats())
        .catch(e => console.warn('addWorkoutSessionDoc', e));
      return;
    }
    setWorkoutHistory(prev => [session, ...prev]);
  }, []);

  const clearHistory = useCallback(() => {
    setWorkoutHistory([]);
  }, []);

  useEffect(() => {
    setWeeklyStats(getWeeklyStats());
  }, [workoutHistory, getWeeklyStats]);

  const value: WorkoutContextType = {
    workoutHistory,
    weeklyStats,
    addWorkoutSession,
    getWeeklyStats,
    clearHistory,
  };

  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  );
};
