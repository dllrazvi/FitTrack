export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  
  // Nutritional Information (per 100g)
  nutrition: {
    calories: number;
    protein: number; // g
    carbohydrates: number; // g
    fat: number; // g
    fiber: number; // g
    sugar: number; // g
    sodium: number; // mg
    cholesterol: number; // mg
  };
  
  // Additional Info
  category: 'fruits' | 'vegetables' | 'grains' | 'protein' | 'dairy' | 'fats' | 'beverages' | 'snacks' | 'other';
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  
  // Serving Sizes
  servingSizes: {
    name: string;
    weight: number; // g
    volume?: number; // ml
    pieces?: number;
  }[];
  
  // Image
  imageUrl?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface MealEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: Date;
  
  // Food Items in this meal
  items: {
    foodId: string;
    foodName: string;
    quantity: number; // g
    servingSize?: string;
    nutrition: {
      calories: number;
      protein: number;
      carbohydrates: number;
      fat: number;
      fiber: number;
      sugar: number;
    };
  }[];
  
  // Total nutrition for this meal
  totalNutrition: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  
  // Notes
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyNutritionLog {
  userId: string;
  date: string; // YYYY-MM-DD
  
  // Meals for the day
  meals: {
    breakfast?: MealEntry;
    lunch?: MealEntry;
    dinner?: MealEntry;
    snacks: MealEntry[];
  };
  
  // Daily totals
  totals: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  
  // Goals comparison
  goals: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
  };
  
  // Progress
  progress: {
    caloriesPercentage: number;
    proteinPercentage: number;
    carbohydratesPercentage: number;
    fatPercentage: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionGoal {
  userId: string;
  
  // Daily targets
  dailyTargets: {
    calories: number;
    protein: number; // g
    carbohydrates: number; // g
    fat: number; // g
    fiber: number; // g
    sugar: number; // g
  };
  
  // Meal distribution
  mealDistribution: {
    breakfast: number; // percentage
    lunch: number;
    dinner: number;
    snacks: number;
  };
  
  // Dietary preferences
  preferences: {
    isVegetarian: boolean;
    isVegan: boolean;
    isGlutenFree: boolean;
    restrictions: string[];
  };
  
  createdAt: Date;
  updatedAt: Date;
} 