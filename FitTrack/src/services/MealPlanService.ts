import { MealPlan, UserMealPlan, MealPlanMeal } from '../backend/models/MealPlan';

// Built-in meal plan templates
const rawBuiltInMealPlans: MealPlan[] = [
  {
    id: '1',
    name: 'Classic Fat-Loss Day',
    description:
      'Example full day built around lean protein and colorful plants (~1500 kcal). Treat each template as “today’s menu” — tap another card tomorrow if you want a different vibe.',
    category: 'weight_loss',
    difficulty: 'beginner',
    targetCalories: 1500,
    targetProtein: 120,
    targetCarbs: 150,
    targetFat: 50,
    duration: 7,
    meals: {
      breakfast: {
        name: 'Protein Oatmeal',
        description: 'Oatmeal with protein powder and berries',
        time: '08:00',
        items: [
          {
            foodId: '1',
            foodName: 'Oatmeal',
            quantity: 50,
            servingSize: '1/2 cup',
            nutrition: { calories: 150, protein: 5, carbohydrates: 27, fat: 3, fiber: 4, sugar: 1 },
          },
          {
            foodId: '2',
            foodName: 'Protein Powder',
            quantity: 30,
            servingSize: '1 scoop',
            nutrition: { calories: 120, protein: 25, carbohydrates: 3, fat: 1, fiber: 0, sugar: 2 },
          },
          {
            foodId: '3',
            foodName: 'Blueberries',
            quantity: 50,
            servingSize: '1/2 cup',
            nutrition: { calories: 25, protein: 0, carbohydrates: 6, fat: 0, fiber: 2, sugar: 4 },
          }
        ],
        totalNutrition: { calories: 295, protein: 30, carbohydrates: 36, fat: 4, fiber: 6, sugar: 7 },
        instructions: [
          'Cook oatmeal with water or milk',
          'Mix in protein powder',
          'Top with fresh berries',
          'Serve immediately',
        ],
        prepTime: 5,
        cookTime: 10,
      },
      lunch: {
        name: 'Grilled Chicken Salad',
        description: 'Mixed greens with grilled chicken and vegetables',
        time: '13:00',
        items: [
          {
            foodId: '1',
            foodName: 'Chicken Breast',
            quantity: 120,
            servingSize: '4 oz',
            nutrition: { calories: 198, protein: 37, carbohydrates: 0, fat: 4, fiber: 0, sugar: 0 }
          },
          {
            foodId: '3',
            foodName: 'Mixed Greens',
            quantity: 100,
            servingSize: '2 cups',
            nutrition: { calories: 20, protein: 2, carbohydrates: 4, fat: 0, fiber: 2, sugar: 2 }
          },
          {
            foodId: '5',
            foodName: 'Avocado',
            quantity: 50,
            servingSize: '1/4 medium',
            nutrition: { calories: 80, protein: 1, carbohydrates: 4, fat: 7, fiber: 3, sugar: 0 }
          }
        ],
        totalNutrition: { calories: 298, protein: 40, carbohydrates: 8, fat: 11, fiber: 5, sugar: 2 },
        instructions: [
          'Season chicken breast with herbs',
          'Grill for 6-7 minutes per side',
          'Let rest and slice',
          'Toss greens with olive oil and lemon',
          'Top with sliced chicken and avocado'
        ],
        prepTime: 10,
        cookTime: 15
      },
      dinner: {
        name: 'Baked Salmon with Vegetables',
        description: 'Salmon fillet with roasted vegetables',
        time: '19:00',
        items: [
          {
            foodId: '4',
            foodName: 'Salmon',
            quantity: 150,
            servingSize: '5 oz',
            nutrition: { calories: 312, protein: 38, carbohydrates: 0, fat: 18, fiber: 0, sugar: 0 }
          },
          {
            foodId: '3',
            foodName: 'Broccoli',
            quantity: 100,
            servingSize: '1 cup',
            nutrition: { calories: 34, protein: 3, carbohydrates: 7, fat: 0, fiber: 3, sugar: 2 }
          },
          {
            foodId: '2',
            foodName: 'Brown Rice',
            quantity: 80,
            servingSize: '1/2 cup',
            nutrition: { calories: 89, protein: 2, carbohydrates: 18, fat: 1, fiber: 1, sugar: 0 }
          }
        ],
        totalNutrition: { calories: 435, protein: 43, carbohydrates: 25, fat: 19, fiber: 4, sugar: 2 },
        instructions: [
          'Preheat oven to 400°F',
          'Season salmon with herbs and lemon',
          'Roast vegetables with olive oil',
          'Bake salmon for 12-15 minutes',
          'Serve with rice'
        ],
        prepTime: 15,
        cookTime: 20
      },
      snacks: [
        {
          name: 'Greek Yogurt with Nuts',
          description: 'Protein-rich afternoon snack',
          time: '15:00',
          items: [
            {
              foodId: '6',
              foodName: 'Greek Yogurt',
              quantity: 150,
              servingSize: '1 cup',
              nutrition: { calories: 130, protein: 20, carbohydrates: 9, fat: 0, fiber: 0, sugar: 9 }
            },
            {
              foodId: '7',
              foodName: 'Almonds',
              quantity: 15,
              servingSize: '1 tbsp',
              nutrition: { calories: 87, protein: 3, carbohydrates: 3, fat: 8, fiber: 2, sugar: 1 }
            }
          ],
          totalNutrition: { calories: 217, protein: 23, carbohydrates: 12, fat: 8, fiber: 2, sugar: 10 },
          instructions: [
            'Scoop yogurt into bowl',
            'Top with chopped almonds',
            'Add a drizzle of honey if desired'
          ],
          prepTime: 2,
          cookTime: 0
        }
      ]
    },
    dailyTotals: { calories: 1245, protein: 136, carbohydrates: 81, fat: 42, fiber: 17, sugar: 21 },
    isPublic: true,
    createdBy: 'system',
    tags: ['weight_loss', 'high_protein', 'balanced'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Heavy Lift Day · Muscle Fuel',
    description:
      'Higher-energy example built around eggs, chicken, beef, grains, and a simple shake (~2500 kcal). Use it as inspiration for training days — rotate templates rather than repeating one blueprint forever.',
    category: 'muscle_gain',
    difficulty: 'intermediate',
    targetCalories: 2500,
    targetProtein: 180,
    targetCarbs: 250,
    targetFat: 80,
    duration: 14,
    meals: {
      breakfast: {
        name: 'Power Breakfast Bowl',
        description: 'High-protein breakfast with eggs and complex carbs',
        time: '08:00',
        items: [
          {
            foodId: '6',
            foodName: 'Eggs',
            quantity: 100,
            servingSize: '2 large',
            nutrition: { calories: 155, protein: 13, carbohydrates: 1, fat: 11, fiber: 0, sugar: 1 }
          },
          {
            foodId: '2',
            foodName: 'Brown Rice',
            quantity: 100,
            servingSize: '1/2 cup',
            nutrition: { calories: 111, protein: 3, carbohydrates: 23, fat: 1, fiber: 2, sugar: 0 }
          },
          {
            foodId: '5',
            foodName: 'Avocado',
            quantity: 100,
            servingSize: '1/2 medium',
            nutrition: { calories: 160, protein: 2, carbohydrates: 9, fat: 15, fiber: 7, sugar: 1 }
          }
        ],
        totalNutrition: { calories: 426, protein: 18, carbohydrates: 33, fat: 27, fiber: 9, sugar: 2 },
        instructions: [
          'Cook rice according to package directions',
          'Scramble eggs with herbs',
          'Slice avocado',
          'Layer in bowl and serve'
        ],
        prepTime: 10,
        cookTime: 15
      },
      lunch: {
        name: 'Chicken and Quinoa Bowl',
        description: 'Protein-packed lunch with quinoa and vegetables',
        time: '13:00',
        items: [
          {
            foodId: '1',
            foodName: 'Chicken Breast',
            quantity: 200,
            servingSize: '7 oz',
            nutrition: { calories: 330, protein: 62, carbohydrates: 0, fat: 7, fiber: 0, sugar: 0 }
          },
          {
            foodId: '8',
            foodName: 'Quinoa',
            quantity: 100,
            servingSize: '1/2 cup',
            nutrition: { calories: 120, protein: 4, carbohydrates: 22, fat: 2, fiber: 3, sugar: 0 }
          },
          {
            foodId: '3',
            foodName: 'Broccoli',
            quantity: 150,
            servingSize: '1.5 cups',
            nutrition: { calories: 51, protein: 4, carbohydrates: 10, fat: 1, fiber: 4, sugar: 3 }
          }
        ],
        totalNutrition: { calories: 501, protein: 70, carbohydrates: 32, fat: 10, fiber: 7, sugar: 3 },
        instructions: [
          'Cook quinoa in chicken broth',
          'Season and grill chicken',
          'Steam broccoli',
          'Combine in bowl and serve'
        ],
        prepTime: 15,
        cookTime: 20
      },
      dinner: {
        name: 'Beef and Sweet Potato',
        description: 'Lean beef with sweet potato and vegetables',
        time: '19:00',
        items: [
          {
            foodId: '9',
            foodName: 'Lean Beef',
            quantity: 200,
            servingSize: '7 oz',
            nutrition: { calories: 400, protein: 50, carbohydrates: 0, fat: 20, fiber: 0, sugar: 0 }
          },
          {
            foodId: '10',
            foodName: 'Sweet Potato',
            quantity: 200,
            servingSize: '1 medium',
            nutrition: { calories: 180, protein: 4, carbohydrates: 41, fat: 0, fiber: 6, sugar: 12 }
          },
          {
            foodId: '3',
            foodName: 'Green Beans',
            quantity: 100,
            servingSize: '1 cup',
            nutrition: { calories: 31, protein: 2, carbohydrates: 7, fat: 0, fiber: 3, sugar: 3 }
          }
        ],
        totalNutrition: { calories: 611, protein: 56, carbohydrates: 48, fat: 20, fiber: 9, sugar: 15 },
        instructions: [
          'Season beef with herbs and spices',
          'Grill to medium-rare',
          'Bake sweet potato until tender',
          'Steam green beans',
          'Slice beef and serve'
        ],
        prepTime: 20,
        cookTime: 30
      },
      snacks: [
        {
          name: 'Protein Shake',
          description: 'Post-workout protein shake',
          time: '16:00',
          items: [
            {
              foodId: '2',
              foodName: 'Protein Powder',
              quantity: 50,
              servingSize: '2 scoops',
              nutrition: { calories: 200, protein: 40, carbohydrates: 5, fat: 2, fiber: 0, sugar: 3 }
            },
            {
              foodId: '11',
              foodName: 'Banana',
              quantity: 100,
              servingSize: '1 medium',
              nutrition: { calories: 89, protein: 1, carbohydrates: 23, fat: 0, fiber: 3, sugar: 12 }
            }
          ],
          totalNutrition: { calories: 289, protein: 41, carbohydrates: 28, fat: 2, fiber: 3, sugar: 15 },
          instructions: [
            'Add protein powder to shaker',
            'Add banana and water',
            'Shake vigorously',
            'Serve immediately'
          ],
          prepTime: 3,
          cookTime: 0
        }
      ]
    },
    dailyTotals: { calories: 1827, protein: 185, carbohydrates: 141, fat: 59, fiber: 28, sugar: 35 },
    isPublic: true,
    createdBy: 'system',
    tags: ['muscle_gain', 'high_protein', 'bodybuilding'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Whole-Food Vegan Day',
    description:
      'Plant protein from powders, legumes, quinoa, and lentils (~1800 kcal). Swap veggies or grains freely — it’s a coherent day plan you can reuse whenever you want structure.',
    category: 'vegan',
    difficulty: 'beginner',
    targetCalories: 1800,
    targetProtein: 100,
    targetCarbs: 200,
    targetFat: 60,
    duration: 10,
    meals: {
      breakfast: {
        name: 'Vegan Smoothie Bowl',
        description: 'Nutrient-dense smoothie bowl with plant proteins',
        time: '08:00',
        items: [
          {
            foodId: '12',
            foodName: 'Plant Protein Powder',
            quantity: 30,
            servingSize: '1 scoop',
            nutrition: { calories: 120, protein: 20, carbohydrates: 4, fat: 2, fiber: 2, sugar: 1 }
          },
          {
            foodId: '13',
            foodName: 'Spinach',
            quantity: 50,
            servingSize: '1 cup',
            nutrition: { calories: 12, protein: 2, carbohydrates: 2, fat: 0, fiber: 1, sugar: 0 }
          },
          {
            foodId: '11',
            foodName: 'Banana',
            quantity: 100,
            servingSize: '1 medium',
            nutrition: { calories: 89, protein: 1, carbohydrates: 23, fat: 0, fiber: 3, sugar: 12 }
          }
        ],
        totalNutrition: { calories: 221, protein: 23, carbohydrates: 29, fat: 2, fiber: 6, sugar: 13 },
        instructions: [
          'Blend protein powder with water',
          'Add spinach and banana',
          'Blend until smooth',
          'Pour into bowl and top with berries'
        ],
        prepTime: 5,
        cookTime: 0
      },
      lunch: {
        name: 'Chickpea Buddha Bowl',
        description: 'Colorful bowl with chickpeas and vegetables',
        time: '13:00',
        items: [
          {
            foodId: '14',
            foodName: 'Chickpeas',
            quantity: 150,
            servingSize: '1 cup',
            nutrition: { calories: 210, protein: 11, carbohydrates: 35, fat: 4, fiber: 10, sugar: 6 }
          },
          {
            foodId: '15',
            foodName: 'Quinoa',
            quantity: 80,
            servingSize: '1/2 cup',
            nutrition: { calories: 96, protein: 3, carbohydrates: 18, fat: 2, fiber: 2, sugar: 0 }
          },
          {
            foodId: '16',
            foodName: 'Tahini',
            quantity: 20,
            servingSize: '1 tbsp',
            nutrition: { calories: 90, protein: 3, carbohydrates: 3, fat: 8, fiber: 1, sugar: 0 }
          }
        ],
        totalNutrition: { calories: 396, protein: 17, carbohydrates: 56, fat: 14, fiber: 13, sugar: 6 },
        instructions: [
          'Cook quinoa according to package',
          'Roast chickpeas with spices',
          'Prepare tahini dressing',
          'Combine in bowl and serve'
        ],
        prepTime: 15,
        cookTime: 25
      },
      dinner: {
        name: 'Lentil Curry',
        description: 'Hearty lentil curry with rice',
        time: '19:00',
        items: [
          {
            foodId: '17',
            foodName: 'Red Lentils',
            quantity: 100,
            servingSize: '1/2 cup',
            nutrition: { calories: 230, protein: 18, carbohydrates: 40, fat: 1, fiber: 15, sugar: 2 }
          },
          {
            foodId: '2',
            foodName: 'Brown Rice',
            quantity: 100,
            servingSize: '1/2 cup',
            nutrition: { calories: 111, protein: 3, carbohydrates: 23, fat: 1, fiber: 2, sugar: 0 }
          },
          {
            foodId: '18',
            foodName: 'Coconut Milk',
            quantity: 50,
            servingSize: '1/4 cup',
            nutrition: { calories: 120, protein: 1, carbohydrates: 3, fat: 12, fiber: 0, sugar: 1 }
          }
        ],
        totalNutrition: { calories: 461, protein: 22, carbohydrates: 66, fat: 14, fiber: 17, sugar: 3 },
        instructions: [
          'Cook lentils with spices',
          'Add coconut milk and simmer',
          'Cook rice separately',
          'Serve curry over rice'
        ],
        prepTime: 20,
        cookTime: 30
      },
      snacks: [
        {
          name: 'Hummus and Veggies',
          description: 'Fresh vegetables with homemade hummus',
          time: '15:00',
          items: [
            {
              foodId: '19',
              foodName: 'Hummus',
              quantity: 60,
              servingSize: '3 tbsp',
              nutrition: { calories: 90, protein: 3, carbohydrates: 6, fat: 6, fiber: 2, sugar: 1 }
            },
            {
              foodId: '20',
              foodName: 'Carrots',
              quantity: 100,
              servingSize: '1 cup',
              nutrition: { calories: 41, protein: 1, carbohydrates: 10, fat: 0, fiber: 3, sugar: 5 }
            }
          ],
          totalNutrition: { calories: 131, protein: 4, carbohydrates: 16, fat: 6, fiber: 5, sugar: 6 },
          instructions: [
            'Cut vegetables into sticks',
            'Scoop hummus into bowl',
            'Serve with vegetables'
          ],
          prepTime: 5,
          cookTime: 0
        }
      ]
    },
    dailyTotals: { calories: 1209, protein: 66, carbohydrates: 167, fat: 36, fiber: 41, sugar: 28 },
    isPublic: true,
    createdBy: 'system',
    tags: ['vegan', 'plant_based', 'nutrient_dense'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

type MealNutrition = MealPlanMeal['totalNutrition'];

const ZERO_NUT: MealNutrition = {
  calories: 0,
  protein: 0,
  carbohydrates: 0,
  fat: 0,
  fiber: 0,
  sugar: 0,
};

const addNut = (a: MealNutrition, b: MealNutrition): MealNutrition => ({
  calories: a.calories + b.calories,
  protein: a.protein + b.protein,
  carbohydrates: a.carbohydrates + b.carbohydrates,
  fat: a.fat + b.fat,
  fiber: a.fiber + b.fiber,
  sugar: a.sugar + b.sugar,
});

const sumItemsNutrition = (items: MealPlanMeal['items']): MealNutrition =>
  items.reduce((acc, item) => addNut(acc, item.nutrition), {...ZERO_NUT});

const cloneMeals = (meals: MealPlan['meals']): MealPlan['meals'] =>
  JSON.parse(JSON.stringify(meals)) as MealPlan['meals'];

const mealPlanCalorieSum = (meals: MealPlan['meals']): number =>
  meals.breakfast.totalNutrition.calories +
  meals.lunch.totalNutrition.calories +
  meals.dinner.totalNutrition.calories +
  meals.snacks.reduce((sum, snack) => sum + snack.totalNutrition.calories, 0);

const scaleItemNutrition = (n: MealNutrition, ratio: number): MealNutrition => ({
  calories: Math.round(n.calories * ratio),
  protein: Math.round(n.protein * ratio),
  carbohydrates: Math.round(n.carbohydrates * ratio),
  fat: Math.round(n.fat * ratio),
  fiber: Math.round(n.fiber * ratio),
  sugar: Math.round(n.sugar * ratio),
});

const rescaleMeal = (meal: MealPlanMeal, ratio: number): MealPlanMeal => {
  const m: MealPlanMeal = JSON.parse(JSON.stringify(meal));
  m.items = m.items.map(item => ({
    ...item,
    nutrition: scaleItemNutrition(item.nutrition, ratio),
  }));
  m.totalNutrition = sumItemsNutrition(m.items);
  return m;
};

const rescaleAllMeals = (meals: MealPlan['meals'], ratio: number): MealPlan['meals'] => {
  const next = cloneMeals(meals);
  next.breakfast = rescaleMeal(next.breakfast, ratio);
  next.lunch = rescaleMeal(next.lunch, ratio);
  next.dinner = rescaleMeal(next.dinner, ratio);
  next.snacks = next.snacks.map(snack => rescaleMeal(snack, ratio));
  return next;
};

const sumDailyTotals = (meals: MealPlan['meals']): MealPlan['dailyTotals'] => {
  let running = {...ZERO_NUT};
  running = addNut(running, meals.breakfast.totalNutrition);
  running = addNut(running, meals.lunch.totalNutrition);
  running = addNut(running, meals.dinner.totalNutrition);
  meals.snacks.forEach(snack => {
    running = addNut(running, snack.totalNutrition);
  });
  return running;
};

const normalizePlanToTargetCalories = (plan: MealPlan): MealPlan => {
  const baseCalories = mealPlanCalorieSum(plan.meals);
  const ratio = plan.targetCalories / Math.max(1, baseCalories);
  const meals = rescaleAllMeals(plan.meals, ratio);
  const dailyTotals = sumDailyTotals(meals);
  return {
    ...plan,
    meals,
    dailyTotals,
    targetCalories: dailyTotals.calories,
    targetProtein: dailyTotals.protein,
    targetCarbs: dailyTotals.carbohydrates,
    targetFat: dailyTotals.fat,
  };
};

const builtInMealPlans = rawBuiltInMealPlans.map(normalizePlanToTargetCalories);

type MealLabelPatch = Partial<Pick<MealPlanMeal, 'name' | 'description'>>;

type VariantMealLabels = {
  breakfast?: MealLabelPatch;
  lunch?: MealLabelPatch;
  dinner?: MealLabelPatch;
  snacks?: MealLabelPatch[];
};

const VARIANT_MEAL_LABELS: Record<string, VariantMealLabels> = {
  '11': {
    breakfast: {
      name: 'Protein-Forward Oats',
      description: 'Warm oats with a full scoop of protein to stretch fullness into lunch.',
    },
    lunch: {
      name: 'Lean Chicken Garden Bowl',
      description: 'Big salad volume with sliced chicken — crunch and fiber do the heavy lifting.',
    },
    dinner: {
      name: 'Salmon + Greens + Rice',
      description: 'Omega-3-rich fish, fibrous veg, and a modest carb portion to close the day evenly.',
    },
    snacks: [
      {
        name: 'Greek Yogurt & Nuts',
        description: 'Fast hit of dairy protein with a little crunch from almonds.',
      },
    ],
  },
  '12': {
    breakfast: {
      name: 'Pantry Oats Breakfast',
      description: 'Repeatable staples (oats + protein) that stay inexpensive week to week.',
    },
    lunch: {
      name: 'Simple Chicken Salad Plate',
      description: 'Grilled chicken on greens — flexible dressing: lemon, yogurt, or vinegar.',
    },
    dinner: {
      name: 'Baked Salmon Sheet Dinner',
      description: 'One oven tray for fish, veg, and rice keeps shopping and cleanup predictable.',
    },
    snacks: [
      {
        name: 'Budget Yogurt Snack',
        description: 'Store-brand yogurt works fine; almonds can be swapped for peanuts if cheaper.',
      },
    ],
  },
  '13': {
    breakfast: {
      name: '10-Minute Power Oats',
      description: 'Microwave oats, stir in protein, top with berries — minimal dishes.',
    },
    lunch: {
      name: 'Fast Chicken Salad Bowl',
      description: 'Use pre-washed greens and pre-cooked chicken when you are time-boxed.',
    },
    dinner: {
      name: 'One-Tray Salmon Night',
      description: 'Roast salmon while rice simmers; keep vegetables simple (broccoli or frozen mix).',
    },
    snacks: [
      {
        name: 'Afternoon Yogurt Cup',
        description: 'Grab, top with nuts, done — no cooking.',
      },
    ],
  },
  '14': {
    breakfast: {
      name: 'Steady Breakfast Anchor',
      description: 'Same structure as the lean day, scaled up for maintenance energy.',
    },
    lunch: {
      name: 'Midday Protein Salad',
      description: 'Protein + greens + healthy fat to avoid the 3pm crash.',
    },
    dinner: {
      name: 'Balanced Evening Plate',
      description: 'Fish, veg, whole grain — predictable volume for stable hunger.',
    },
    snacks: [
      {
        name: 'Structured Snack',
        description: 'Protein yogurt with a small fat source keeps the day from “grazing”.',
      },
    ],
  },
  '21': {
    breakfast: {
      name: 'Training-Day Breakfast Bowl',
      description: 'Eggs + rice + avocado: energy that holds up through a heavy session.',
    },
    lunch: {
      name: 'Chicken & Quinoa Power Bowl',
      description: 'High surface-area lunch for protein and chew time — helps satiety when calories climb.',
    },
    dinner: {
      name: 'Beef + Sweet Potato + Greens',
      description: 'Dense dinner for iron and carbs; steam or microwave the beans to save time.',
    },
    snacks: [
      {
        name: 'Shake + Banana',
        description: 'Liquid calories for when solid food feels like too much volume.',
      },
    ],
  },
  '22': {
    breakfast: {
      name: 'Economy Power Bowl',
      description: 'Eggs, rice, avocado — repeatable and easy to scale with store-brand staples.',
    },
    lunch: {
      name: 'Bulk Chicken Grain Bowl',
      description: 'Chicken + quinoa batch cooks well; broccoli can be frozen.',
    },
    dinner: {
      name: 'Lean Beef & Potato Dinner',
      description: 'Ground beef specials work here; sweet potato microwaves fast.',
    },
    snacks: [
      {
        name: 'Budget Shake',
        description: 'Bananas add carbs cheaply; buy protein in bulk when possible.',
      },
    ],
  },
  '23': {
    breakfast: {
      name: 'Athlete Breakfast Bowl',
      description: 'Same backbone as muscle fuel, trimmed slightly for maintenance trainees.',
    },
    lunch: {
      name: 'Training Lunch Bowl',
      description: 'Balanced macros without feeling stuffed before evening training.',
    },
    dinner: {
      name: 'Recovery Beef Plate',
      description: 'Carbs from potato, protein from beef — straightforward recovery math.',
    },
    snacks: [
      {
        name: 'Post-Training Shake',
        description: 'Quick carbs + protein window without cooking.',
      },
    ],
  },
  '24': {
    breakfast: {
      name: 'Fast Muscle Breakfast',
      description: 'Scramble eggs while rice reheats — under ~15 minutes door-to-table.',
    },
    lunch: {
      name: 'Quick Chicken Grain Bowl',
      description: 'Rotisserie chicken short-cut is fair game here.',
    },
    dinner: {
      name: 'Simple Steak Night',
      description: 'Lean beef + potato + greens — one pan/grill mindset.',
    },
    snacks: [
      {
        name: 'Express Shake',
        description: 'Blender bottle friendly; stash a banana in your gym bag.',
      },
    ],
  },
  '31': {
    breakfast: {
      name: 'Plant Protein Smoothie Bowl',
      description: 'Powder + fruit + spinach — easy to sneak more protein early.',
    },
    lunch: {
      name: 'Chickpea Quinoa Lunch',
      description: 'Legumes + grain + tahini dressing for a satisfying vegan lunch.',
    },
    dinner: {
      name: 'Red Lentil Curry Bowl',
      description: 'Coconut milk rounds it out; lentils keep the protein floor higher.',
    },
    snacks: [
      {
        name: 'Hummus + Crunch Veg',
        description: 'Fiber-rich snack that still feels snacky, not “diet foam”.',
      },
    ],
  },
  '32': {
    breakfast: {
      name: 'Budget Blender Breakfast',
      description: 'Frozen spinach and banana keep costs down; protein powder carries the macros.',
    },
    lunch: {
      name: 'Pantry Chickpea Bowl',
      description: 'Canned chickpeas + quick quinoa — roast chickpeas when you have time.',
    },
    dinner: {
      name: 'Lentils & Rice Curry',
      description: 'Dry lentils are cheap insurance for protein + fiber.',
    },
    snacks: [
      {
        name: 'Carrots & Hummus',
        description: 'Whole-food snack that scales with whatever hummus is on sale.',
      },
    ],
  },
  '33': {
    breakfast: {
      name: 'Balanced Vegan Smoothie Bowl',
      description: 'Same smoothie skeleton as plant power, framed for everyday consistency.',
    },
    lunch: {
      name: 'Everyday Buddha Bowl',
      description: 'Grain + legume + fat keeps vegetarian lunches complete.',
    },
    dinner: {
      name: 'Comfort Curry Evening',
      description: 'Warm, spoonable dinner — batch-friendly for leftovers.',
    },
    snacks: [
      {
        name: 'Fresh Veggie Dip Snack',
        description: 'Crunch first, hummus second — slows munching.',
      },
    ],
  },
  '34': {
    breakfast: {
      name: '5-Minute Blender Breakfast',
      description: 'Everything lands in the blender; rinse once and go.',
    },
    lunch: {
      name: 'Assembly-Line Grain Bowl',
      description: 'Jar dressing + frozen grains/legumes make this lunch almost no-cook.',
    },
    dinner: {
      name: 'One-Pot Curry',
      description: 'Simmer lentils with coconut milk while rice cooks in a second pot or cooker.',
    },
    snacks: [
      {
        name: 'Grab-and-Go Snack',
        description: 'Pre-cut veg + hummus cup for commuting days.',
      },
    ],
  },
};

const applyVariantMealLabels = (meals: MealPlan['meals'], variantId: string): void => {
  const patch = VARIANT_MEAL_LABELS[variantId];
  if (!patch) return;
  if (patch.breakfast) Object.assign(meals.breakfast, patch.breakfast);
  if (patch.lunch) Object.assign(meals.lunch, patch.lunch);
  if (patch.dinner) Object.assign(meals.dinner, patch.dinner);
  if (patch.snacks) {
    patch.snacks.forEach((snackPatch, index) => {
      if (meals.snacks[index]) {
        Object.assign(meals.snacks[index], snackPatch);
      }
    });
  }
};

type MealPlanVariantInput = {
  id: string;
  name: string;
  description: string;
  category: MealPlan['category'];
  difficulty?: MealPlan['difficulty'];
  targetCalories: number;
  duration: number;
  tags: string[];
};

const createVariant = (base: MealPlan, variant: MealPlanVariantInput): MealPlan => {
  const baseCalories = mealPlanCalorieSum(base.meals);
  const ratio = variant.targetCalories / Math.max(1, baseCalories);
  const meals = rescaleAllMeals(base.meals, ratio);
  applyVariantMealLabels(meals, variant.id);
  const dailyTotals = sumDailyTotals(meals);
  return {
    ...base,
    id: variant.id,
    name: variant.name,
    description: variant.description,
    category: variant.category,
    difficulty: variant.difficulty ?? base.difficulty,
    targetCalories: dailyTotals.calories,
    targetProtein: dailyTotals.protein,
    targetCarbs: dailyTotals.carbohydrates,
    targetFat: dailyTotals.fat,
    duration: variant.duration,
    tags: variant.tags,
    meals,
    dailyTotals,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const seedBaseWeightLoss = builtInMealPlans.find(p => p.id === '1');
const seedBaseMuscle = builtInMealPlans.find(p => p.id === '2');
const seedBaseVegan = builtInMealPlans.find(p => p.id === '3');

const seededVariants: MealPlan[] =
  seedBaseWeightLoss && seedBaseMuscle && seedBaseVegan
    ? [
        createVariant(seedBaseWeightLoss, {
          id: '11',
          name: 'High-Protein Cut Day',
          description:
            'Same lean-day backbone as “Classic Fat-Loss”, tuned slightly higher on calories while keeping protein prominent. Mentally file it under “today I want extra fuel but still a deficit mindset”.',
          category: 'weight_loss',
          targetCalories: 1600,
          duration: 7,
          tags: ['weight_loss', 'high_protein', 'balanced'],
        }),
        createVariant(seedBaseWeightLoss, {
          id: '12',
          name: 'Budget Fat-Loss Day',
          description:
            'Shopping-cart friendly rotation: oats, chicken, frozen veg, canned fish substitutes later if you swap manually. Copy emphasizes repeatable staples rather than gourmet novelty.',
          category: 'weight_loss',
          targetCalories: 1500,
          duration: 7,
          tags: ['weight_loss', 'budget', 'quick_prep'],
        }),
        createVariant(seedBaseWeightLoss, {
          id: '13',
          name: 'Fast Prep Fat-Loss Day',
          description:
            'Language focuses on shortcuts (microwave, rotisserie chicken, frozen broccoli). Calories stay modest — this card is about friction, not fancy plating.',
          category: 'weight_loss',
          targetCalories: 1550,
          duration: 5,
          tags: ['weight_loss', 'quick_prep', 'high_protein'],
        }),
        createVariant(seedBaseWeightLoss, {
          id: '14',
          name: 'Maintenance · Structured Day',
          description:
            'Built from the lean template but scaled to “hold steady weight” energy. Pick it on rest days or when you want structure without aggressive cutting.',
          category: 'maintenance',
          targetCalories: 2100,
          duration: 10,
          tags: ['maintenance', 'balanced', 'starter'],
        }),
        createVariant(seedBaseMuscle, {
          id: '21',
          name: 'High-Calorie Lift Day',
          description:
            'The “muscle fuel” archetype pushed up for big eaters or double-session days. Treat it as one high-intensity day’s menu — not necessarily every day of the week.',
          category: 'muscle_gain',
          targetCalories: 2700,
          duration: 10,
          tags: ['muscle_gain', 'high_protein', 'bodybuilding'],
        }),
        createVariant(seedBaseMuscle, {
          id: '22',
          name: 'Budget Bulk Day',
          description:
            'Same training-day food pattern with copy nudging cheaper carb and protein sources. Helpful when you still need calories but want the grocery receipt calm.',
          category: 'muscle_gain',
          targetCalories: 2500,
          duration: 14,
          tags: ['muscle_gain', 'budget', 'quick_prep'],
        }),
        createVariant(seedBaseMuscle, {
          id: '23',
          name: 'Maintenance · Active Gym Day',
          description:
            'Trimmed from the full bulk day for athletes who mostly want to perform and recover without living in a permanent surplus.',
          category: 'maintenance',
          targetCalories: 2300,
          duration: 10,
          tags: ['maintenance', 'high_protein', 'training'],
        }),
        createVariant(seedBaseMuscle, {
          id: '24',
          name: 'Express Training Day',
          description:
            'All the lifting-day ideas, framed for schedules with ~30–40 minutes of cooking tolerance. Shake stays the “I’m done chewing” parachute.',
          category: 'muscle_gain',
          targetCalories: 2600,
          duration: 7,
          tags: ['muscle_gain', 'quick_prep', 'high_protein'],
        }),
        createVariant(seedBaseVegan, {
          id: '31',
          name: 'Plant Protein Emphasis Day',
          description:
            'Vegan template with coaching copy around protein pacing (powder early, legumes later). Still one day — tomorrow you might pick the quicker vegan card instead.',
          category: 'vegan',
          targetCalories: 1950,
          duration: 10,
          tags: ['vegan', 'high_protein', 'plant_based'],
        }),
        createVariant(seedBaseVegan, {
          id: '32',
          name: 'Affordable Vegan Day',
          description:
            'Highlights canned beans, bulk lentils, and seasonal veg swaps. Macros inherit the vegan scaffold while the story stresses thrift.',
          category: 'vegan',
          targetCalories: 1800,
          duration: 7,
          tags: ['vegan', 'budget', 'quick_prep'],
        }),
        createVariant(seedBaseVegan, {
          id: '33',
          name: 'Vegetarian Everyday Plate',
          description:
            'Plant-forward meals that already qualify as vegan — convenient when vegetarians and vegans share the same grocery list.',
          category: 'vegetarian',
          targetCalories: 2000,
          duration: 10,
          tags: ['vegetarian', 'balanced', 'maintenance'],
        }),
        createVariant(seedBaseVegan, {
          id: '34',
          name: 'Vegetarian Sprint Day',
          description:
            'Lowest-friction vegetarian vibe: blender breakfasts, bowls at lunch, one simmer at dinner. Ideal when your calendar has meetings stacked.',
          category: 'vegetarian',
          targetCalories: 1900,
          duration: 6,
          tags: ['vegetarian', 'quick_prep', 'high_protein'],
        }),
      ]
    : [];

const mealPlanCatalog: MealPlan[] = [...builtInMealPlans, ...seededVariants];

export class MealPlanService {
  /**
   * Get all available meal plans
   */
  static async getAllMealPlans(): Promise<MealPlan[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mealPlanCatalog);
      }, 500); // Simulate API delay
    });
  }

  /**
   * Get meal plans by category
   */
  static async getMealPlansByCategory(category: MealPlan['category']): Promise<MealPlan[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mealPlanCatalog.filter(plan => plan.category === category);
        resolve(filtered);
      }, 300);
    });
  }

  /**
   * Get meal plan by ID
   */
  static async getMealPlanById(id: string): Promise<MealPlan | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const plan = mealPlanCatalog.find(p => p.id === id);
        resolve(plan || null);
      }, 200);
    });
  }

  /**
   * Start a meal plan for user
   */
  static async startMealPlan(userId: string, mealPlanId: string): Promise<UserMealPlan> {
    const mealPlan = await this.getMealPlanById(mealPlanId);
    if (!mealPlan) {
      throw new Error('Meal plan not found');
    }

    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + mealPlan.duration * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];

    const userMealPlan: UserMealPlan = {
      id: `user_${userId}_${mealPlanId}_${Date.now()}`,
      userId,
      mealPlanId,
      mealPlan,
      startDate,
      endDate,
      isActive: true,
      completedDays: 0,
      totalDays: mealPlan.duration,
      customizations: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(userMealPlan);
      }, 300);
    });
  }

  /**
   * Get user's active meal plans
   */
  static async getUserMealPlans(_userId: string): Promise<UserMealPlan[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, 200);
    });
  }

  /**
   * Complete a day of meal plan
   */
  static async completeMealPlanDay(_userMealPlanId: string, _day: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 200);
    });
  }

  /**
   * Get meal plan recommendations based on user profile
   */
  static async getRecommendations(
    targetCalories: number,
    preferences: string[],
    goals: string[],
  ): Promise<MealPlan[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let recommendations = mealPlanCatalog.filter(plan =>
          Math.abs(plan.targetCalories - targetCalories) <= 200,
        );

        if (preferences.includes('vegan')) {
          recommendations = recommendations.filter(plan => plan.category === 'vegan');
        } else if (preferences.includes('vegetarian')) {
          recommendations = recommendations.filter(plan =>
            plan.category === 'vegetarian' || plan.category === 'vegan',
          );
        }

        if (goals.includes('weight_loss')) {
          recommendations = recommendations.filter(plan => plan.category === 'weight_loss');
        } else if (goals.includes('muscle_gain')) {
          recommendations = recommendations.filter(plan => plan.category === 'muscle_gain');
        }

        resolve(recommendations);
      }, 400);
    });
  }
}
