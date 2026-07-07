import * as React from 'react';
import {useState, useEffect, useMemo, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {FoodItem, MealEntry} from '../../../../src/backend/models/Nutrition';
import {firebaseAuth} from '../../../../src/config/firebase';
import {useNutrition} from '../../../../src/contexts/NutritionContext';
import {resolveStackBack} from './stackBackHelper';
import {useScreenTopInset} from './useScreenTopInset';
import {
  useNotificationInbox,
  NotificationBellIcon,
} from '../../../../src/contexts/NotificationInboxContext';
import {useTheme} from '../../../../src/contexts/ThemeContext';
import {createNutritionScreenStyles} from '../../../../src/theme/nutritionScreenStyles';
import {
  searchFoodCatalog,
  FOOD_CATALOG_USDA_ENABLED,
} from '../../../../src/services/foodCatalogSearch';
import {DEFAULT_FOOD_CATALOG} from '../../../../src/services/defaultFoodCatalog';

type SortField = 'name' | 'calories' | 'protein' | 'carbs' | 'fat';

const SORT_OPTIONS: {key: SortField; label: string}[] = [
  {key: 'name', label: 'Name'},
  {key: 'calories', label: 'Calories'},
  {key: 'protein', label: 'Protein'},
  {key: 'carbs', label: 'Carbs'},
  {key: 'fat', label: 'Fat'},
];

const CATEGORY_FILTERS: {key: 'all' | FoodItem['category']; label: string}[] = [
  {key: 'all', label: 'All'},
  {key: 'protein', label: 'Protein'},
  {key: 'vegetables', label: 'Vegetables'},
  {key: 'fruits', label: 'Fruits'},
  {key: 'grains', label: 'Grains'},
  {key: 'dairy', label: 'Dairy'},
  {key: 'beverages', label: 'Beverages'},
  {key: 'snacks', label: 'Snacks'},
  {key: 'fats', label: 'Fats'},
];
const PAGE_SIZE = 10;
const STARTER_FOOD_ORDER = [
  'Chicken breast (cooked)',
  'Turkey breast',
  'Lean beef',
  'Salmon',
  'Tuna in water',
  'Egg whole',
  'Egg white',
  'Tofu',
  'Tempeh',
  'Greek yogurt 2%',
  'Cottage cheese',
  'Rice white (cooked)',
  'Rice brown (cooked)',
  'Oats (dry)',
  'Pasta (cooked)',
];
const GENERIC_RECIPE_NOISE_RE =
  /\b(chips?|cracker|toast|roll|sandwich|soup|stew|salad|recipe|meal|sauce|curry|batter|breaded|nuggets?|tenders?)\b/i;

const NutritionScreen = ({navigation}: any) => {
  const {theme, isDark} = useTheme();
  const styles = useMemo(
    () => createNutritionScreenStyles(theme, isDark),
    [theme, isDark],
  );
  const {unreadCount, openPanel, closePanel, panelOpen} = useNotificationInbox();
  const stackBack = resolveStackBack(navigation);
  const topInset = useScreenTopInset();
  const baseFoods = useMemo(() => DEFAULT_FOOD_CATALOG, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>(baseFoods);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState('100');
  const [selectedMeal, setSelectedMeal] = useState<
    'breakfast' | 'lunch' | 'dinner' | 'snack'
  >('lunch');

  // New states for sorting and filtering
  const [sortField, setSortField] = useState<SortField>('calories');
  const [sortDescending, setSortDescending] = useState(true);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [showVegetarianOnly, setShowVegetarianOnly] = useState(false);
  const [showVeganOnly, setShowVeganOnly] = useState(false);
  const [showBranded, setShowBranded] = useState(false);
  const [preferRaw, setPreferRaw] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | FoodItem['category']
  >('all');
  const [quickMessage, setQuickMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const quickMessageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [remoteFoods, setRemoteFoods] = useState<FoodItem[]>([]);
  const [remoteLoading, setRemoteLoading] = useState(false);

  // Using Nutrition Context for persistent state
  const {dailyFoodLog, dailyTotals, dailyGoals, addMeal, removeMeal} =
    useNutrition();

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setRemoteFoods([]);
      setRemoteLoading(false);
      return;
    }

    const ac = new AbortController();
    let cancelled = false;

    const timer = setTimeout(() => {
      setRemoteFoods([]);
      setRemoteLoading(true);
      searchFoodCatalog(
        q,
        {includeBranded: showBranded, limit: 40, preferRaw},
        ac.signal,
      )
        .then(items => {
          if (!cancelled) {
            setRemoteFoods(items);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setRemoteFoods([]);
          }
        })
        .finally(() => {
          if (!cancelled) {
            setRemoteLoading(false);
          }
        });
    }, 450);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      ac.abort();
    };
  }, [searchQuery, showBranded, preferRaw]);

  useEffect(() => {
    const q = searchQuery.trim();

    const applyCommonFilters = (list: FoodItem[]) => {
      let out = [...list];
      if (selectedCategory !== 'all') {
        out = out.filter(food => food.category === selectedCategory);
      }
      if (showVegetarianOnly) {
        out = out.filter(food => food.isVegetarian);
      }
      if (showVeganOnly) {
        out = out.filter(food => food.isVegan);
      }
      return out;
    };

    let catalogBase = [...baseFoods];
    catalogBase = applyCommonFilters(catalogBase);

    const matchesQuery = (food: FoodItem, needle: string) => {
      const n = needle.toLowerCase();
      return (
        food.name.toLowerCase().includes(n) ||
        !!food.brand?.toLowerCase().includes(n)
      );
    };

    let combined: FoodItem[] = [];

    if (q.length >= 2) {
      const localMatching = catalogBase.filter(food => matchesQuery(food, q));
      combined = [...remoteFoods, ...localMatching];
      const seen = new Set<string>();
      combined = combined.filter(food => {
        if (seen.has(food.id)) {
          return false;
        }
        seen.add(food.id);
        return true;
      });
      combined = applyCommonFilters(combined);

      // In generic mode, prefer ingredient-like matches and suppress recipe/snack noise.
      if (!showBranded) {
        const qLower = q.toLowerCase();
        const qTokens = qLower.split(/\s+/).filter(Boolean);
        const tokenMatch = (name: string) =>
          qTokens.some(t => name.includes(t));

        const ingredientLike = combined.filter(food => {
          const name = food.name.toLowerCase();
          return tokenMatch(name) && !GENERIC_RECIPE_NOISE_RE.test(name);
        });

        if (ingredientLike.length >= 5) {
          combined = ingredientLike;
        } else {
          const tokenOnly = combined.filter(food =>
            tokenMatch(food.name.toLowerCase()),
          );
          if (tokenOnly.length >= 5) {
            combined = tokenOnly;
          }
        }
      }
    } else if (q.length === 1) {
      combined = catalogBase.filter(food => matchesQuery(food, q));
    } else {
      // Curated starter list for quick add flow when user opens Nutrition.
      const starter = STARTER_FOOD_ORDER.map(name =>
        catalogBase.find(food => food.name === name),
      ).filter(Boolean) as FoodItem[];
      const starterIds = new Set(starter.map(item => item.id));
      const rest = catalogBase.filter(item => !starterIds.has(item.id));
      combined = [...starter, ...rest];
    }

    if (q.length > 0) {
      combined.sort((a, b) => {
        let cmp = 0;
        switch (sortField) {
          case 'name':
            cmp = a.name.localeCompare(b.name);
            break;
          case 'calories':
            cmp = a.nutrition.calories - b.nutrition.calories;
            break;
          case 'protein':
            cmp = a.nutrition.protein - b.nutrition.protein;
            break;
          case 'carbs':
            cmp = a.nutrition.carbohydrates - b.nutrition.carbohydrates;
            break;
          case 'fat':
            cmp = a.nutrition.fat - b.nutrition.fat;
            break;
          default:
            cmp = 0;
        }

        return sortDescending ? -cmp : cmp;
      });
    }

    setFilteredFoods(combined);
  }, [
    baseFoods,
    remoteFoods,
    searchQuery,
    sortField,
    sortDescending,
    showVegetarianOnly,
    showVeganOnly,
    showBranded,
    selectedCategory,
  ]);
  const sortDirectionGlyph =
    sortField === 'name'
      ? sortDescending
        ? '↓'
        : '↑'
      : sortDescending
      ? '↓'
      : '↑';

  const totalPages = Math.max(1, Math.ceil(filteredFoods.length / PAGE_SIZE));
  const pagedFoods = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredFoods.slice(start, start + PAGE_SIZE);
  }, [filteredFoods, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    sortField,
    sortDescending,
    showVegetarianOnly,
    showVeganOnly,
    preferRaw,
    showBranded,
    selectedCategory,
    remoteFoods,
  ]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);


  useEffect(() => {
    return () => {
      if (quickMessageTimerRef.current) {
        clearTimeout(quickMessageTimerRef.current);
      }
    };
  }, []);

  const showQuickMessage = (message: string) => {
    setQuickMessage(message);
    if (quickMessageTimerRef.current) {
      clearTimeout(quickMessageTimerRef.current);
    }
    quickMessageTimerRef.current = setTimeout(() => {
      setQuickMessage('');
      quickMessageTimerRef.current = null;
    }, 1500);
  };

  const removeFromJournal = (mealId: string) => {
    removeMeal(mealId);
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
      userId: firebaseAuth.currentUser?.uid ?? 'guest',
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

    addMeal(newMealEntry);
    setSelectedFood(null);
    setQuantity('100');
    showQuickMessage('Food added');
  };

  const renderFoodItem = ({item}: {item: FoodItem}) => {
    const isExpanded = selectedFood?.id === item.id;
    const preview = calculateNutrition(item, parseFloat(quantity) || 0);
    return (
      <View style={styles.foodItem}>
        <TouchableOpacity
          onPress={() => {
            if (isExpanded) {
              setSelectedFood(null);
              return;
            }
            setSelectedFood(item);
            setQuantity('100');
          }}>
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

        {isExpanded && (
          <View style={styles.inlineEditor}>
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Quantity (g):</Text>
              <TextInput
                style={styles.quantityInput}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="100"
                placeholderTextColor={theme.colors.placeholder}
              />
            </View>

            <View style={styles.nutritionInfo}>
              <Text style={styles.nutritionTitle}>Nutritional values:</Text>
              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{preview.calories}</Text>
                  <Text style={styles.nutritionLabel}>kcal</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{preview.protein}</Text>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{preview.carbohydrates}</Text>
                  <Text style={styles.nutritionLabel}>Carbs</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{preview.fat}</Text>
                  <Text style={styles.nutritionLabel}>Fat</Text>
                </View>
              </View>
            </View>

            <View style={styles.servingSizesContainer}>
              <Text style={styles.servingSizesTitle}>Serving sizes:</Text>
              <View style={styles.mealTargetButtons}>
                {item.servingSizes.map(size => (
                  <TouchableOpacity
                    key={size.name}
                    style={styles.servingSizeItem}
                    onPress={() => setQuantity(String(size.weight))}>
                    <Text style={styles.servingSizeText}>{size.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.mealTargetContainer}>
              <Text style={styles.servingSizesTitle}>Add to meal:</Text>
              <View style={styles.mealTargetButtons}>
                {['breakfast', 'lunch', 'dinner', 'snack'].map(meal => (
                  <TouchableOpacity
                    key={meal}
                    style={[
                      styles.mealTargetButton,
                      selectedMeal === meal && styles.mealTargetButtonActive,
                    ]}
                    onPress={() => setSelectedMeal(meal as any)}>
                    <Text
                      style={[
                        styles.mealTargetButtonText,
                        selectedMeal === meal && styles.mealTargetButtonTextActive,
                      ]}>
                      {meal.charAt(0).toUpperCase() + meal.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={addToMeal}>
              <Text style={styles.addButtonText}>Add to {selectedMeal}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

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
    <View
      style={[
        styles.container,
        {paddingTop: topInset, backgroundColor: theme.colors.background},
      ]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          hitSlop={{top: 24, bottom: 24, left: 24, right: 24}}
          onPress={stackBack.onPress}>
          <Text style={styles.backButtonText}>{stackBack.label}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nutrition</Text>
        <View style={styles.headerRight}>
          <NotificationBellIcon
            unreadCount={unreadCount}
            onPress={() => (panelOpen ? closePanel() : openPanel())}
          />
        </View>
      </View>
      {quickMessage ? (
        <View
          style={{
            marginHorizontal: 16,
            marginBottom: 8,
            borderRadius: 10,
            paddingVertical: 8,
            paddingHorizontal: 12,
            backgroundColor: theme.colors.primary,
          }}>
          <Text style={{color: '#fff', fontWeight: '600'}}>{quickMessage}</Text>
        </View>
      ) : null}

      <ScrollView
        style={{flex: 1, backgroundColor: theme.colors.background}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search foods..."
            placeholderTextColor={theme.colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Sort and Filter Controls */}
        <View style={styles.controlsContainer}>
          {/* Sort Controls */}
          <View style={styles.sortContainer}>
            <Text style={styles.controlLabel}>Sort by:</Text>
            <View style={styles.sortControlRow}>
              <TouchableOpacity
                style={styles.sortDropdownButton}
                onPress={() => setSortMenuOpen(prev => !prev)}>
                <Text style={styles.sortDropdownText}>
                  {SORT_OPTIONS.find(option => option.key === sortField)?.label}
                </Text>
                <Text style={styles.sortDropdownIcon}>
                  {sortMenuOpen ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sortDirectionButton}
                onPress={() => setSortDescending(prev => !prev)}>
                <Text style={styles.sortDirectionButtonText}>
                  {sortDirectionGlyph}
                </Text>
              </TouchableOpacity>
            </View>
            {sortMenuOpen && (
              <View style={styles.sortMenu}>
                {SORT_OPTIONS.map(option => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.sortMenuItem,
                      sortField === option.key && styles.sortMenuItemActive,
                    ]}
                    onPress={() => {
                      setSortField(option.key);
                      setSortDescending(true);
                      setSortMenuOpen(false);
                    }}>
                    <Text
                      style={[
                        styles.sortMenuItemText,
                        sortField === option.key && styles.sortMenuItemTextActive,
                      ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Filter Controls */}
          <View style={styles.filterContainer}>
            <Text style={styles.controlLabel}>Filters:</Text>
            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  showVegetarianOnly && styles.filterButtonActive,
                ]}
                onPress={() => setShowVegetarianOnly(!showVegetarianOnly)}>
                <Text
                  style={[
                    styles.filterButtonText,
                    showVegetarianOnly && styles.filterButtonTextActive,
                  ]}>
                  🌱 Vegetarian
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  showVeganOnly && styles.filterButtonActive,
                ]}
                onPress={() => setShowVeganOnly(!showVeganOnly)}>
                <Text
                  style={[
                    styles.filterButtonText,
                    showVeganOnly && styles.filterButtonTextActive,
                  ]}>
                  🥬 Vegan
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  showBranded && styles.filterButtonActive,
                ]}
                onPress={() => setShowBranded(!showBranded)}>
                <Text
                  style={[
                    styles.filterButtonText,
                    showBranded && styles.filterButtonTextActive,
                  ]}>
                  🏷️ Branded
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  preferRaw && styles.filterButtonActive,
                ]}
                onPress={() => setPreferRaw(!preferRaw)}>
                <Text
                  style={[
                    styles.filterButtonText,
                    preferRaw && styles.filterButtonTextActive,
                  ]}>
                  🥩 Prefer raw
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.filterContainer}>
            <Text style={styles.controlLabel}>Category:</Text>
            <View style={styles.categoryButtons}>
              {CATEGORY_FILTERS.map(category => (
                <TouchableOpacity
                  key={category.key}
                  style={[
                    styles.filterButton,
                    selectedCategory === category.key && styles.filterButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(category.key)}>
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedCategory === category.key &&
                        styles.filterButtonTextActive,
                    ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Food List */}
        <View style={styles.foodListContainer}>
          <Text style={styles.sectionTitle}>Available foods:</Text>
          {searchQuery.trim().length >= 2 && (
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontSize: 12,
                marginBottom: 8,
              }}>
              {remoteLoading
                ? 'Searching catalog…'
                : showBranded
                ? FOOD_CATALOG_USDA_ENABLED
                  ? 'Branded mode: USDA + Open Food Facts'
                  : 'Branded mode: Open Food Facts (USDA key optional)'
                : FOOD_CATALOG_USDA_ENABLED
                ? 'Generic mode: USDA non-branded foods'
                : 'Generic mode: local catalog (USDA key missing)'}
            </Text>
          )}
          {remoteLoading && searchQuery.trim().length >= 2 ? (
            <ActivityIndicator
              color={theme.colors.primary}
              style={{marginVertical: 16}}
            />
          ) : (
            <FlatList
              data={pagedFoods}
              renderItem={renderFoodItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                !remoteLoading && filteredFoods.length === 0 ? (
                  <Text style={{color: theme.colors.textSecondary}}>
                    No foods match this search.
                  </Text>
                ) : null
              }
            />
          )}
          {filteredFoods.length > PAGE_SIZE && (
            <View style={styles.paginationRow}>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  currentPage === 1 && styles.paginationButtonDisabled,
                ]}
                disabled={currentPage === 1}
                onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}>
                <Text style={styles.paginationButtonText}>Prev</Text>
              </TouchableOpacity>
              <Text style={styles.paginationInfo}>
                Page {currentPage} / {totalPages}
              </Text>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  currentPage >= totalPages && styles.paginationButtonDisabled,
                ]}
                disabled={currentPage >= totalPages}
                onPress={() =>
                  setCurrentPage(prev => Math.min(totalPages, prev + 1))
                }>
                <Text style={styles.paginationButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Daily Food Journal */}
        <View style={styles.journalContainer}>
          <Text style={styles.sectionTitle}>Today's Food Journal</Text>

          {/* Daily Progress */}
          <View style={styles.dailyProgressContainer}>
            <Text style={styles.progressTitle}>Daily Progress</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      (dailyTotals.calories / dailyGoals.calories) * 100,
                      100,
                    )}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {dailyTotals.calories} / {dailyGoals.calories} kcal
            </Text>
          </View>

          {/* Daily Totals */}
          <View style={styles.dailyTotalsContainer}>
            <Text style={styles.totalsTitle}>Daily Totals vs Goals</Text>
            <View style={styles.totalsGrid}>
              <View style={styles.totalItem}>
                <Text style={styles.totalValue}>{dailyTotals.protein}g</Text>
                <Text style={styles.totalLabel}>Protein</Text>
                <Text style={styles.goalText}>Goal: {dailyGoals.protein}g</Text>
              </View>
              <View style={styles.totalItem}>
                <Text style={styles.totalValue}>
                  {dailyTotals.carbohydrates}g
                </Text>
                <Text style={styles.totalLabel}>Carbs</Text>
                <Text style={styles.goalText}>
                  Goal: {dailyGoals.carbohydrates}g
                </Text>
              </View>
              <View style={styles.totalItem}>
                <Text style={styles.totalValue}>{dailyTotals.fat}g</Text>
                <Text style={styles.totalLabel}>Fat</Text>
                <Text style={styles.goalText}>Goal: {dailyGoals.fat}g</Text>
              </View>
              <View style={styles.totalItem}>
                <Text style={styles.totalValue}>{dailyTotals.fiber}g</Text>
                <Text style={styles.totalLabel}>Fiber</Text>
                <Text style={styles.goalText}>Goal: {dailyGoals.fiber}g</Text>
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
    </View>
  );
};

export default NutritionScreen;
