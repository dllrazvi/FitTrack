import * as React from 'react';
import {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Temporarily disabled
import {
  FoodItem,
  MealEntry,
  DailyNutritionLog,
} from '../backend/models/Nutrition';
import {ExportModal} from '../components/ExportModal';

// const {width} = Dimensions.get('window'); // Not used in current implementation

// Mock food database
const mockFoods: FoodItem[] = [
  {
    id: '1',
    name: 'Chicken Breast',
    brand: 'Local Farm',
    nutrition: {
      calories: 165,
      protein: 31,
      carbohydrates: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74,
      cholesterol: 85,
    },
    category: 'protein',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    servingSizes: [
      {name: '100g', weight: 100},
      {name: '1 piece (150g)', weight: 150},
      {name: '1 tbsp (15g)', weight: 15},
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Brown Rice',
    brand: 'BioFarm',
    nutrition: {
      calories: 111,
      protein: 2.6,
      carbohydrates: 23,
      fat: 0.9,
      fiber: 1.8,
      sugar: 0.4,
      sodium: 5,
      cholesterol: 0,
    },
    category: 'grains',
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    servingSizes: [
      {name: '100g', weight: 100},
      {name: '1 cup (200g)', weight: 200},
      {name: '1 tbsp (15g)', weight: 15},
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Broccoli',
    brand: 'Green Farm',
    nutrition: {
      calories: 34,
      protein: 2.8,
      carbohydrates: 7,
      fat: 0.4,
      fiber: 2.6,
      sugar: 1.5,
      sodium: 33,
      cholesterol: 0,
    },
    category: 'vegetables',
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    servingSizes: [
      {name: '100g', weight: 100},
      {name: '1 piece (148g)', weight: 148},
      {name: '1 cup (91g)', weight: 91},
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Salmon',
    brand: 'Ocean Fresh',
    nutrition: {
      calories: 208,
      protein: 25,
      carbohydrates: 0,
      fat: 12,
      fiber: 0,
      sugar: 0,
      sodium: 59,
      cholesterol: 63,
    },
    category: 'protein',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    servingSizes: [
      {name: '100g', weight: 100},
      {name: '1 fillet (154g)', weight: 154},
      {name: '1 tbsp (15g)', weight: 15},
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Avocado',
    brand: 'Tropical Fruits',
    nutrition: {
      calories: 160,
      protein: 2,
      carbohydrates: 9,
      fat: 15,
      fiber: 7,
      sugar: 0.7,
      sodium: 7,
      cholesterol: 0,
    },
    category: 'fruits',
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    servingSizes: [
      {name: '100g', weight: 100},
      {name: '1 piece (201g)', weight: 201},
      {name: '1 tbsp (15g)', weight: 15},
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Eggs',
    brand: 'Egg Farm',
    nutrition: {
      calories: 155,
      protein: 13,
      carbohydrates: 1.1,
      fat: 11,
      fiber: 0,
      sugar: 1.1,
      sodium: 124,
      cholesterol: 373,
    },
    category: 'protein',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    servingSizes: [
      {name: '100g', weight: 100},
      {name: '1 egg (50g)', weight: 50},
      {name: '1 tbsp (15g)', weight: 15},
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const NutritionScreen = ({navigation}: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>(mockFoods);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState('100');
  const [selectedMeal, setSelectedMeal] = useState<
    'breakfast' | 'lunch' | 'dinner' | 'snack'
  >('lunch');

  // New states for food journal
  const [dailyFoodLog, setDailyFoodLog] = useState<MealEntry[]>([]);
  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
  });
  const [dailyGoal] = useState(2000); // Default daily calorie goal

  // Export modal state
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFoods(mockFoods);
    } else {
      const filtered = mockFoods.filter(
        food =>
          food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          food.brand?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredFoods(filtered);
    }
  }, [searchQuery]);

  // Load daily food log from AsyncStorage
  useEffect(() => {
    loadDailyFoodLog();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadDailyFoodLog = async () => {
    // Temporarily disabled AsyncStorage - using local state only
    console.log('Loading daily food log from local state');
    // In a real app, this would load from AsyncStorage
  };

  // const saveDailyFoodLog = async (newLog: MealEntry[]) => {
  //   // Temporarily disabled AsyncStorage - using local state only
  //   console.log(
  //     'Saving daily food log to local state:',
  //     newLog.length,
  //     'meals',
  //   );
  //   // In a real app, this would save to AsyncStorage
  // };

  const calculateDailyTotals = (foodLog: MealEntry[]) => {
    console.log('Calculating daily totals for:', foodLog.length, 'meals');
    const totals = foodLog.reduce(
      (acc, meal) => {
        console.log(
          'Meal:',
          meal.items[0].foodName,
          'Calories:',
          meal.totalNutrition.calories,
        );
        return {
          calories: acc.calories + meal.totalNutrition.calories,
          protein: acc.protein + meal.totalNutrition.protein,
          carbohydrates: acc.carbohydrates + meal.totalNutrition.carbohydrates,
          fat: acc.fat + meal.totalNutrition.fat,
          fiber: acc.fiber + meal.totalNutrition.fiber,
          sugar: acc.sugar + meal.totalNutrition.sugar,
        };
      },
      {calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0, sugar: 0},
    );
    console.log('New totals:', totals);
    setDailyTotals(totals);
  };

  const removeFromJournal = (mealId: string) => {
    const updatedLog = dailyFoodLog.filter(meal => meal.id !== mealId);
    setDailyFoodLog(updatedLog);
    calculateDailyTotals(updatedLog);
    // saveDailyFoodLog(updatedLog); // Temporarily disabled
  };

  const calculateNutrition = (food: FoodItem, qty: number) => {
    const ratio = qty / 100;
    return {
      calories: Math.round(food.nutrition.calories * ratio),
      protein: Math.round(food.nutrition.protein * ratio * 10) / 10,
      carbohydrates: Math.round(food.nutrition.carbohydrates * ratio * 10) / 10,
      fat: Math.round(food.nutrition.fat * ratio * 10) / 10,
    };
  };

  const addToMeal = () => {
    if (!selectedFood || !quantity) {
      Alert.alert('Error', 'Please select a food and quantity');
      return;
    }

    const qty = parseFloat(quantity);
    const nutrition = calculateNutrition(selectedFood, qty);

    // Create new meal entry
    const newMealEntry: MealEntry = {
      id: Date.now().toString(),
      userId: 'current-user', // Will be replaced with actual user ID
      date: new Date().toISOString().split('T')[0],
      mealType: selectedMeal,
      timestamp: new Date(),
      items: [
        {
          foodId: selectedFood.id,
          foodName: selectedFood.name,
          quantity: qty,
          servingSize: `${qty}g`,
          nutrition: {
            calories: nutrition.calories,
            protein: nutrition.protein,
            carbohydrates: nutrition.carbohydrates,
            fat: nutrition.fat,
            fiber:
              Math.round(selectedFood.nutrition.fiber * (qty / 100) * 10) / 10,
            sugar:
              Math.round(selectedFood.nutrition.sugar * (qty / 100) * 10) / 10,
          },
        },
      ],
      totalNutrition: {
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbohydrates: nutrition.carbohydrates,
        fat: nutrition.fat,
        fiber: Math.round(selectedFood.nutrition.fiber * (qty / 100) * 10) / 10,
        sugar: Math.round(selectedFood.nutrition.sugar * (qty / 100) * 10) / 10,
      },
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add to daily log
    const updatedLog = [...dailyFoodLog, newMealEntry];
    console.log('Adding new meal:', newMealEntry.items[0].foodName);
    console.log('Updated log length:', updatedLog.length);
    setDailyFoodLog(updatedLog);
    calculateDailyTotals(updatedLog);

    // Save to AsyncStorage
    // saveDailyFoodLog(updatedLog); // Temporarily disabled

    Alert.alert(
      'Food added!',
      `${selectedFood.name} (${qty}g) - ${nutrition.calories} kcal\nProtein: ${nutrition.protein}g\nCarbohydrates: ${nutrition.carbohydrates}g\nFat: ${nutrition.fat}g`,
      [
        {
          text: 'OK',
          onPress: () => {
            setSelectedFood(null);
            setQuantity('100');
          },
        },
      ],
    );
  };

  const renderFoodItem = ({item}: {item: FoodItem}) => (
    <TouchableOpacity
      style={styles.foodItem}
      onPress={() => setSelectedFood(item)}>
      <View style={styles.foodItemHeader}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodBrand}>{item.brand}</Text>
      </View>
      <View style={styles.foodNutrition}>
        <Text style={styles.nutritionText}>
          {item.nutrition.calories} kcal | P: {item.nutrition.protein}g | C:{' '}
          {item.nutrition.carbohydrates}g | G: {item.nutrition.fat}g
        </Text>
      </View>
      <View style={styles.foodTags}>
        {item.isVegetarian && <Text style={styles.tag}>🥬 Vegetarian</Text>}
        {item.isVegan && <Text style={styles.tag}>🌱 Vegan</Text>}
        {item.isGlutenFree && <Text style={styles.tag}>🌾 Gluten-free</Text>}
      </View>
    </TouchableOpacity>
  );

  const renderServingSize = ({
    item,
  }: {
    item: {name: string; weight: number};
  }) => (
    <TouchableOpacity
      style={styles.servingSizeItem}
      onPress={() => {
        setQuantity(item.weight.toString());
      }}>
      <Text style={styles.servingSizeText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderJournalItem = ({item}: {item: MealEntry}) => (
    <View style={styles.journalItem}>
      <View style={styles.journalItemHeader}>
        <Text style={styles.journalItemName}>{item.items[0].foodName}</Text>
        <Text style={styles.journalItemMeal}>{item.mealType}</Text>
      </View>
      <View style={styles.journalItemDetails}>
        <Text style={styles.journalItemQuantity}>
          {item.items[0].quantity}g - {item.totalNutrition.calories} kcal
        </Text>
        <Text style={styles.journalItemNutrition}>
          P: {item.totalNutrition.protein}g | C:{' '}
          {item.totalNutrition.carbohydrates}g | G: {item.totalNutrition.fat}g
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromJournal(item.id)}>
        <Text style={styles.removeButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Nutrition</Text>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={() => setShowExportModal(true)}>
            <Text style={styles.exportButtonText}>📊</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search foods..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Meal Selection */}
        <View style={styles.mealSelection}>
          <Text style={styles.sectionTitle}>Select meal:</Text>
          <View style={styles.mealButtons}>
            {[
              {key: 'breakfast', label: 'Breakfast', icon: '🌅'},
              {key: 'lunch', label: 'Lunch', icon: '🌞'},
              {key: 'dinner', label: 'Dinner', icon: '🌙'},
              {key: 'snack', label: 'Snack', icon: '🍎'},
            ].map(meal => (
              <TouchableOpacity
                key={meal.key}
                style={[
                  styles.mealButton,
                  selectedMeal === meal.key && styles.mealButtonActive,
                ]}
                onPress={() => setSelectedMeal(meal.key as any)}>
                <Text style={styles.mealIcon}>{meal.icon}</Text>
                <Text
                  style={[
                    styles.mealLabel,
                    selectedMeal === meal.key && styles.mealLabelActive,
                  ]}>
                  {meal.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Food List */}
        <View style={styles.foodListContainer}>
          <Text style={styles.sectionTitle}>Available foods:</Text>
          <FlatList
            data={filteredFoods}
            renderItem={renderFoodItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Selected Food Details */}
        {selectedFood && (
          <View style={styles.selectedFoodContainer}>
            <Text style={styles.sectionTitle}>Selected food:</Text>
            <View style={styles.selectedFoodCard}>
              <Text style={styles.selectedFoodName}>{selectedFood.name}</Text>
              <Text style={styles.selectedFoodBrand}>{selectedFood.brand}</Text>

              <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Quantity (g):</Text>
                <TextInput
                  style={styles.quantityInput}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  placeholder="100"
                />
              </View>

              <View style={styles.nutritionInfo}>
                {(() => {
                  const nutrition = calculateNutrition(
                    selectedFood,
                    parseFloat(quantity) || 0,
                  );
                  return (
                    <>
                      <Text style={styles.nutritionTitle}>
                        Nutritional values:
                      </Text>
                      <View style={styles.nutritionGrid}>
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionValue}>
                            {nutrition.calories}
                          </Text>
                          <Text style={styles.nutritionLabel}>kcal</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionValue}>
                            {nutrition.protein}
                          </Text>
                          <Text style={styles.nutritionLabel}>Protein</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionValue}>
                            {nutrition.carbohydrates}
                          </Text>
                          <Text style={styles.nutritionLabel}>Carbs</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionValue}>
                            {nutrition.fat}
                          </Text>
                          <Text style={styles.nutritionLabel}>Fat</Text>
                        </View>
                      </View>
                    </>
                  );
                })()}
              </View>

              <View style={styles.servingSizesContainer}>
                <Text style={styles.servingSizesTitle}>Serving sizes:</Text>
                <FlatList
                  data={selectedFood.servingSizes}
                  renderItem={renderServingSize}
                  keyExtractor={item => item.name}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              </View>

              <TouchableOpacity style={styles.addButton} onPress={addToMeal}>
                <Text style={styles.addButtonText}>
                  Add to{' '}
                  {selectedMeal === 'breakfast'
                    ? 'breakfast'
                    : selectedMeal === 'lunch'
                    ? 'lunch'
                    : selectedMeal === 'dinner'
                    ? 'dinner'
                    : 'snack'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Daily Food Journal */}
        <View style={styles.journalContainer}>
          <Text style={styles.sectionTitle}>Today's Food Journal</Text>

          {/* Debug info */}
          <Text style={styles.debugText}>
            Debug: {dailyFoodLog.length} meals, {dailyTotals.calories} calories
          </Text>

          {/* Daily Progress */}
          <View style={styles.dailyProgressContainer}>
            <Text style={styles.progressTitle}>Daily Progress</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      (dailyTotals.calories / dailyGoal) * 100,
                      100,
                    )}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {dailyTotals.calories} / {dailyGoal} kcal
            </Text>
          </View>

          {/* Daily Totals */}
          <View style={styles.dailyTotalsContainer}>
            <Text style={styles.totalsTitle}>Daily Totals</Text>
            <View style={styles.totalsGrid}>
              <View style={styles.totalItem}>
                <Text style={styles.totalValue}>{dailyTotals.protein}g</Text>
                <Text style={styles.totalLabel}>Protein</Text>
              </View>
              <View style={styles.totalItem}>
                <Text style={styles.totalValue}>
                  {dailyTotals.carbohydrates}g
                </Text>
                <Text style={styles.totalLabel}>Carbs</Text>
              </View>
              <View style={styles.totalItem}>
                <Text style={styles.totalValue}>{dailyTotals.fat}g</Text>
                <Text style={styles.totalLabel}>Fat</Text>
              </View>
              <View style={styles.totalItem}>
                <Text style={styles.totalValue}>{dailyTotals.fiber}g</Text>
                <Text style={styles.totalLabel}>Fiber</Text>
              </View>
            </View>
          </View>

          {/* Food Journal List */}
          {dailyFoodLog.length > 0 ? (
            <View style={styles.journalListContainer}>
              <Text style={styles.journalListTitle}>Foods Added Today</Text>
              <FlatList
                data={dailyFoodLog}
                renderItem={renderJournalItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          ) : (
            <View style={styles.emptyJournalContainer}>
              <Text style={styles.emptyJournalText}>No foods added today</Text>
              <Text style={styles.emptyJournalSubtext}>
                Start by adding foods from above
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Export Modal */}
      <ExportModal
        visible={showExportModal}
        onClose={() => setShowExportModal(false)}
        nutritionData={[]} // TODO: Convert dailyFoodLog to DailyNutritionLog format
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  headerRight: {
    width: 60,
  },
  exportButton: {
    padding: 8,
    backgroundColor: '#4ECDC4',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportButtonText: {
    fontSize: 18,
    color: 'white',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  mealSelection: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  mealButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    marginHorizontal: 4,
  },
  mealButtonActive: {
    backgroundColor: '#4ECDC4',
  },
  mealIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  mealLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  mealLabelActive: {
    color: 'white',
  },
  foodListContainer: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4ECDC4',
  },
  foodItemHeader: {
    marginBottom: 8,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  foodBrand: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  foodNutrition: {
    marginBottom: 8,
  },
  nutritionText: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  foodTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: 10,
    color: '#4ECDC4',
    backgroundColor: '#E8F5F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 2,
  },
  selectedFoodContainer: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedFoodCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
  },
  selectedFoodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  selectedFoodBrand: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 15,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  quantityLabel: {
    fontSize: 14,
    color: '#2C3E50',
    marginRight: 10,
  },
  quantityInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    width: 80,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  nutritionInfo: {
    marginBottom: 15,
  },
  nutritionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  nutritionLabel: {
    fontSize: 10,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  servingSizesContainer: {
    marginBottom: 15,
  },
  servingSizesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  servingSizeItem: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  servingSizeText: {
    fontSize: 12,
    color: '#2C3E50',
  },
  addButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Journal styles
  journalContainer: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dailyProgressContainer: {
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  dailyTotalsContainer: {
    marginBottom: 20,
  },
  totalsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  totalsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalItem: {
    alignItems: 'center',
    flex: 1,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  totalLabel: {
    fontSize: 10,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 4,
  },
  journalListContainer: {
    marginBottom: 15,
  },
  journalListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  journalItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  journalItemHeader: {
    flex: 1,
  },
  journalItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  journalItemMeal: {
    fontSize: 12,
    color: '#7F8C8D',
    textTransform: 'capitalize',
  },
  journalItemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  journalItemQuantity: {
    fontSize: 12,
    color: '#2C3E50',
    marginBottom: 2,
  },
  journalItemNutrition: {
    fontSize: 10,
    color: '#7F8C8D',
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 16,
  },
  emptyJournalContainer: {
    alignItems: 'center',
    padding: 30,
  },
  emptyJournalText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  emptyJournalSubtext: {
    fontSize: 14,
    color: '#BDC3C7',
    textAlign: 'center',
  },
  debugText: {
    fontSize: 12,
    color: '#FF6B6B',
    backgroundColor: '#FFE8E8',
    padding: 8,
    borderRadius: 6,
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default NutritionScreen;
