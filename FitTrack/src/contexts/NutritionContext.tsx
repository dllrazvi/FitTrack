import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import {getAuth, onAuthStateChanged} from '@react-native-firebase/auth';
import {MealEntry} from '../backend/models/Nutrition';
import {
  loadDailyNutritionLog,
  saveDailyNutritionLog,
} from '../services/nutritionDailyFirestore';

const firebaseAuth = getAuth();

interface NutritionGoals {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
}

interface NutritionContextType {
  dailyFoodLog: MealEntry[];
  dailyTotals: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  dailyGoals: NutritionGoals;
  addMeal: (meal: MealEntry) => void;
  removeMeal: (mealId: string) => void;
  clearDailyLog: () => void;
  setDailyGoals: (goals: NutritionGoals) => void;
}

const NutritionContext = createContext<NutritionContextType | undefined>(
  undefined,
);

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
};

interface NutritionProviderProps {
  children: ReactNode;
}

function todayStr() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
}

export const NutritionProvider: React.FC<NutritionProviderProps> = ({
  children,
}) => {
  const [dailyFoodLog, setDailyFoodLog] = useState<MealEntry[]>([]);
  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
  });
  const [dailyGoals, setDailyGoals] = useState<NutritionGoals>({
    calories: 2000,
    protein: 150,
    carbohydrates: 250,
    fat: 65,
    fiber: 25,
    sugar: 50,
  });

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Avoid persisting before first auth + load (prevents overwriting cloud with []). */
  const hydrationDone = useRef(false);

  const calculateDailyTotals = useCallback((foodLog: MealEntry[]) => {
    const totals = foodLog.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.totalNutrition.calories,
        protein: acc.protein + meal.totalNutrition.protein,
        carbohydrates: acc.carbohydrates + meal.totalNutrition.carbohydrates,
        fat: acc.fat + meal.totalNutrition.fat,
        fiber: acc.fiber + meal.totalNutrition.fiber,
        sugar: acc.sugar + meal.totalNutrition.sugar,
      }),
      {calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0, sugar: 0},
    );
    setDailyTotals(totals);
  }, []);

  const persistLog = useCallback((meals: MealEntry[]) => {
    const u = firebaseAuth.currentUser;
    if (!u) {
      return;
    }
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }
    saveTimer.current = setTimeout(() => {
      saveDailyNutritionLog(u.uid, todayStr(), meals).catch(e =>
        console.warn('saveDailyNutritionLog', e),
      );
    }, 450);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const off = onAuthStateChanged(firebaseAuth, async user => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
      if (!user) {
        setDailyFoodLog([]);
        setDailyTotals({
          calories: 0,
          protein: 0,
          carbohydrates: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
        });
        hydrationDone.current = true;
        return;
      }
      hydrationDone.current = false;
      try {
        const fromCloud = await loadDailyNutritionLog(user.uid, todayStr());
        if (!cancelled) {
          setDailyFoodLog(prev => {
            const merged = [...fromCloud];
            for (const m of prev) {
              if (!merged.some(x => x.id === m.id)) {
                merged.push(m);
              }
            }
            setTimeout(() => calculateDailyTotals(merged), 0);
            return merged;
          });
        }
      } catch (e) {
        console.warn('loadDailyNutritionLog', e);
      } finally {
        if (!cancelled) {
          hydrationDone.current = true;
        }
      }
    });

    return () => {
      cancelled = true;
      off();
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, [calculateDailyTotals]);

  useEffect(() => {
    if (!hydrationDone.current) {
      return;
    }
    persistLog(dailyFoodLog);
  }, [dailyFoodLog, persistLog]);

  const addMeal = useCallback(
    (meal: MealEntry) => {
      const updatedLog = [...dailyFoodLog, meal];
      setDailyFoodLog(updatedLog);
      calculateDailyTotals(updatedLog);
    },
    [dailyFoodLog, calculateDailyTotals],
  );

  const removeMeal = useCallback(
    (mealId: string) => {
      const updatedLog = dailyFoodLog.filter(meal => meal.id !== mealId);
      setDailyFoodLog(updatedLog);
      calculateDailyTotals(updatedLog);
    },
    [dailyFoodLog, calculateDailyTotals],
  );

  const clearDailyLog = useCallback(() => {
    setDailyFoodLog([]);
    setDailyTotals({
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
    });
    const u = firebaseAuth.currentUser;
    if (u) {
      saveDailyNutritionLog(u.uid, todayStr(), []).catch(e =>
        console.warn('clearDailyLog save', e),
      );
    }
  }, []);

  const value: NutritionContextType = {
    dailyFoodLog,
    dailyTotals,
    dailyGoals,
    addMeal,
    removeMeal,
    clearDailyLog,
    setDailyGoals,
  };

  return (
    <NutritionContext.Provider value={value}>
      {children}
    </NutritionContext.Provider>
  );
};
