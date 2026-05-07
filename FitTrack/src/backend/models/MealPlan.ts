export interface MealPlan {
  id: string;
  name: string;
  description: string;
  category: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'vegan' | 'vegetarian' | 'keto' | 'mediterranean';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  // Target audience
  targetCalories: number;
  targetProtein: number; // g per day
  targetCarbs: number; // g per day
  targetFat: number; // g per day
  
  // Duration
  duration: number; // days
  
  // Meals structure
  meals: {
    breakfast: MealPlanMeal;
    lunch: MealPlanMeal;
    dinner: MealPlanMeal;
    snacks: MealPlanMeal[];
  };
  
  // Daily totals
  dailyTotals: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  
  // Metadata
  isPublic: boolean;
  createdBy: string; // user ID
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MealPlanMeal {
  name: string;
  description: string;
  time: string; // "08:00", "13:00", etc.
  
  // Food items in this meal
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
  
  // Instructions
  instructions: string[];
  prepTime: number; // minutes
  cookTime: number; // minutes
  
  // Image
  imageUrl?: string;
}

export interface UserMealPlan {
  id: string;
  userId: string;
  mealPlanId: string;
  mealPlan: MealPlan;
  
  // User customization
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  isActive: boolean;
  
  // Progress tracking
  completedDays: number;
  totalDays: number;
  
  // User modifications
  customizations: {
    mealId: string;
    modifications: {
      addItems: MealPlanMeal['items'];
      removeItems: string[]; // food IDs
      quantityChanges: {
        foodId: string;
        newQuantity: number;
      }[];
    };
  }[];
  
  createdAt: Date;
  updatedAt: Date;
}



