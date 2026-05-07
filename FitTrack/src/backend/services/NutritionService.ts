import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  setDoc,
} from '@react-native-firebase/firestore';
import {firebaseDb} from '../../config/firebase';
import {FoodItem, MealEntry, DailyNutritionLog, NutritionGoal} from '../models/Nutrition';

export class NutritionService {
  private static instance: NutritionService;
  private foodsCollection = collection(firebaseDb, 'foods');
  private mealsCollection = collection(firebaseDb, 'meals');
  private dailyLogsCollection = collection(firebaseDb, 'dailyNutritionLogs');
  private nutritionGoalsCollection = collection(firebaseDb, 'nutritionGoals');

  static getInstance(): NutritionService {
    if (!NutritionService.instance) {
      NutritionService.instance = new NutritionService();
    }
    return NutritionService.instance;
  }

  // Search foods by name
  async searchFoods(searchQuery: string, lim: number = 20): Promise<FoodItem[]> {
    try {
      const snapshot = await getDocs(
        query(
          this.foodsCollection,
          where('name', '>=', searchQuery),
          where('name', '<=', `${searchQuery}\uf8ff`),
          limit(lim),
        ),
      );

      return snapshot.docs.map((qd: {id: string; data: () => Record<string, unknown>}) => ({
        id: qd.id,
        ...(qd.data() as Record<string, unknown>),
      })) as FoodItem[];
    } catch (error) {
      console.error('Error searching foods:', error);
      return [];
    }
  }

  // Get food by ID
  async getFoodById(foodId: string): Promise<FoodItem | null> {
    try {
      const snap = await getDoc(doc(this.foodsCollection, foodId));
      if (!snap.exists) return null;

      return {
        id: snap.id,
        ...(snap.data() as Record<string, unknown>),
      } as FoodItem;
    } catch (error) {
      console.error('Error getting food by ID:', error);
      return null;
    }
  }

  // Add meal entry
  async addMealEntry(mealData: Omit<MealEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; meal?: MealEntry; error?: string }> {
    try {
      const mealRef = doc(this.mealsCollection);
      const mealEntry: MealEntry = {
        ...mealData,
        id: mealRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(
        mealRef,
        mealEntry as unknown as Record<string, unknown>,
      );
      return { success: true, meal: mealEntry };
    } catch (error: any) {
      console.error('Error adding meal entry:', error);
      return { success: false, error: error.message };
    }
  }

  // Get meals for a specific date
  async getMealsForDate(userId: string, date: string): Promise<MealEntry[]> {
    try {
      const snapshot = await getDocs(
        query(
          this.mealsCollection,
          where('userId', '==', userId),
          where('date', '==', date),
          orderBy('timestamp', 'desc'),
        ),
      );

      return snapshot.docs.map((qd: {id: string; data: () => Record<string, unknown>}) => ({
        id: qd.id,
        ...(qd.data() as Record<string, unknown>),
      })) as MealEntry[];
    } catch (error) {
      console.error('Error getting meals for date:', error);
      return [];
    }
  }

  // Get daily nutrition log
  async getDailyNutritionLog(userId: string, date: string): Promise<DailyNutritionLog | null> {
    try {
      const snap = await getDoc(
        doc(this.dailyLogsCollection, `${userId}_${date}`),
      );
      if (!snap.exists) return null;

      const raw = snap.data() as Record<string, unknown> | undefined;
      return {
        id: snap.id,
        ...(raw ?? {}),
      } as unknown as DailyNutritionLog;
    } catch (error) {
      console.error('Error getting daily nutrition log:', error);
      return null;
    }
  }

  // Create or update daily nutrition log
  async updateDailyNutritionLog(userId: string, date: string): Promise<{ success: boolean; log?: DailyNutritionLog; error?: string }> {
    try {
      const meals = await this.getMealsForDate(userId, date);
      
      // Group meals by type
      const mealsByType = {
        breakfast: meals.find(m => m.mealType === 'breakfast'),
        lunch: meals.find(m => m.mealType === 'lunch'),
        dinner: meals.find(m => m.mealType === 'dinner'),
        snacks: meals.filter(m => m.mealType === 'snack'),
      };

      // Calculate totals
      const totals = meals.reduce((acc, meal) => ({
        calories: acc.calories + meal.totalNutrition.calories,
        protein: acc.protein + meal.totalNutrition.protein,
        carbohydrates: acc.carbohydrates + meal.totalNutrition.carbohydrates,
        fat: acc.fat + meal.totalNutrition.fat,
        fiber: acc.fiber + meal.totalNutrition.fiber,
        sugar: acc.sugar + meal.totalNutrition.sugar,
      }), {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
      });

      // Get user's nutrition goals
      const goals = await this.getNutritionGoals(userId);
      const userGoals = goals?.dailyTargets || {
        calories: 2000,
        protein: 50,
        carbohydrates: 250,
        fat: 65,
      };

      // Calculate progress percentages
      const progress = {
        caloriesPercentage: Math.min((totals.calories / userGoals.calories) * 100, 100),
        proteinPercentage: Math.min((totals.protein / userGoals.protein) * 100, 100),
        carbohydratesPercentage: Math.min((totals.carbohydrates / userGoals.carbohydrates) * 100, 100),
        fatPercentage: Math.min((totals.fat / userGoals.fat) * 100, 100),
      };

      const dailyLog: DailyNutritionLog = {
        userId,
        date,
        meals: mealsByType,
        totals,
        goals: userGoals,
        progress,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(
        doc(this.dailyLogsCollection, `${userId}_${date}`),
        dailyLog as unknown as Record<string, unknown>,
      );
      return { success: true, log: dailyLog };
    } catch (error: any) {
      console.error('Error updating daily nutrition log:', error);
      return { success: false, error: error.message };
    }
  }

  // Get nutrition goals for user
  async getNutritionGoals(userId: string): Promise<NutritionGoal | null> {
    try {
      const snap = await getDoc(doc(this.nutritionGoalsCollection, userId));
      if (!snap.exists) return null;

      return {
        id: snap.id,
        ...(snap.data() as Record<string, unknown>),
      } as unknown as NutritionGoal;
    } catch (error) {
      console.error('Error getting nutrition goals:', error);
      return null;
    }
  }

  // Set nutrition goals for user
  async setNutritionGoals(userId: string, goals: Partial<NutritionGoal>): Promise<{ success: boolean; goals?: NutritionGoal; error?: string }> {
    try {
      const nutritionGoals: NutritionGoal = {
        userId,
        dailyTargets: {
          calories: goals.dailyTargets?.calories || 2000,
          protein: goals.dailyTargets?.protein || 50,
          carbohydrates: goals.dailyTargets?.carbohydrates || 250,
          fat: goals.dailyTargets?.fat || 65,
          fiber: goals.dailyTargets?.fiber || 25,
          sugar: goals.dailyTargets?.sugar || 50,
        },
        mealDistribution: {
          breakfast: goals.mealDistribution?.breakfast || 25,
          lunch: goals.mealDistribution?.lunch || 30,
          dinner: goals.mealDistribution?.dinner || 30,
          snacks: goals.mealDistribution?.snacks || 15,
        },
        preferences: {
          isVegetarian: goals.preferences?.isVegetarian || false,
          isVegan: goals.preferences?.isVegan || false,
          isGlutenFree: goals.preferences?.isGlutenFree || false,
          restrictions: goals.preferences?.restrictions || [],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(
        doc(this.nutritionGoalsCollection, userId),
        nutritionGoals as unknown as Record<string, unknown>,
      );
      return { success: true, goals: nutritionGoals };
    } catch (error: any) {
      console.error('Error setting nutrition goals:', error);
      return { success: false, error: error.message };
    }
  }

  // Calculate nutrition for a food item based on quantity
  calculateNutritionForQuantity(food: FoodItem, quantity: number): {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
    sugar: number;
  } {
    const ratio = quantity / 100; // per 100g basis
    return {
      calories: Math.round(food.nutrition.calories * ratio),
      protein: Math.round(food.nutrition.protein * ratio * 10) / 10,
      carbohydrates: Math.round(food.nutrition.carbohydrates * ratio * 10) / 10,
      fat: Math.round(food.nutrition.fat * ratio * 10) / 10,
      fiber: Math.round(food.nutrition.fiber * ratio * 10) / 10,
      sugar: Math.round(food.nutrition.sugar * ratio * 10) / 10,
    };
  }

  // Get weekly nutrition summary
  async getWeeklyNutritionSummary(userId: string, startDate: string): Promise<{
    totalCalories: number;
    averageCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    daysWithData: number;
  }> {
    try {
      const logs: DailyNutritionLog[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const log = await this.getDailyNutritionLog(userId, dateStr);
        if (log) logs.push(log);
      }

      const totals = logs.reduce((acc, log) => ({
        totalCalories: acc.totalCalories + log.totals.calories,
        totalProtein: acc.totalProtein + log.totals.protein,
        totalCarbs: acc.totalCarbs + log.totals.carbohydrates,
        totalFat: acc.totalFat + log.totals.fat,
      }), {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
      });

      return {
        ...totals,
        averageCalories: Math.round(totals.totalCalories / 7),
        daysWithData: logs.length,
      };
    } catch (error) {
      console.error('Error getting weekly nutrition summary:', error);
      return {
        totalCalories: 0,
        averageCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        daysWithData: 0,
      };
    }
  }
}
