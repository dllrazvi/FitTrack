import React, {useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {doc, setDoc} from '@react-native-firebase/firestore';
import {firebaseAuth, firebaseDb} from '../../../../src/config/firebase';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../../../../src/contexts/ThemeContext';
import {useStyles} from '../../../../src/hooks/useStyles';
import {useNutrition} from '../../../../src/contexts/NutritionContext';
import {MealPlan} from '../../../../src/backend/models/MealPlan';
import {MealPlanService} from '../../../../src/services/MealPlanService';
import {MealPlanCard} from '../../../../src/components/MealPlanCard';
import {resolveStackBack} from './stackBackHelper';
import {useScreenTopInset} from './useScreenTopInset';

const ACTIVE_MEAL_PLAN_KEY = '@fittrack_active_meal_plan_id';
type GoalKey = 'all' | 'weight_loss' | 'maintenance' | 'muscle_gain';

const deriveWeeklySetsTarget = (mealPlan: MealPlan) => {
  if (mealPlan.category === 'muscle_gain') return 90;
  if (mealPlan.category === 'weight_loss') return 70;
  if (mealPlan.difficulty === 'advanced') return 100;
  if (mealPlan.difficulty === 'intermediate') return 80;
  return 60;
};

const MealPlansScreen = ({navigation}: any) => {
  const stackBack = resolveStackBack(navigation);
  const topInset = useScreenTopInset();
  const {theme} = useTheme();
  const {setDailyGoals} = useNutrition();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<GoalKey>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeMealPlanId, setActiveMealPlanId] = useState<string | null>(null);

  const styles = useStyles(theme => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.card,
    },

    backButton: {
      padding: theme.spacing.sm,
    },

    backButtonText: {
      fontSize: 16,
      color: theme.colors.primary,
      fontWeight: '600',
    },

    title: {
      fontSize: theme.typography.h2.fontSize,
      fontWeight: theme.typography.h2.fontWeight,
      color: theme.colors.text,
    },

    headerRight: {
      width: 60,
    },

    filtersCard: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.sm,
      backgroundColor: theme.colors.card,
    },

    searchInput: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
    },

    templateChipsRow: {
      marginTop: theme.spacing.xs,
      paddingBottom: theme.spacing.xs,
    },

    categoriesScroll: {
      flexDirection: 'row',
    },
    goalContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.xs,
      backgroundColor: theme.colors.card,
    },
    goalLabel: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
      fontWeight: '600',
    },
    goalRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    goalButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    goalButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    goalButtonText: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
      fontWeight: '600',
    },
    goalButtonTextActive: {
      color: theme.colors.buttonText,
    },

    categoryButton: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      marginRight: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    categoryButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },

    categoryButtonText: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.text,
      textTransform: 'capitalize',
    },

    categoryButtonTextActive: {
      color: theme.colors.buttonText,
    },

    content: {
      flex: 1,
    },

    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    loadingText: {
      marginTop: theme.spacing.md,
      color: theme.colors.textSecondary,
    },

    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },

    emptyText: {
      fontSize: theme.typography.h3.fontSize,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },

    emptySubtext: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textMuted,
      textAlign: 'center',
    },

    targetCard: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.card,
      marginBottom: theme.spacing.xs,
    },

    targetTitle: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },

    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    targetItem: {
      alignItems: 'center',
      flex: 1,
    },

    targetValue: {
      fontSize: theme.typography.h2.fontSize,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },

    targetLabel: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    targetSubText: {
      marginTop: theme.spacing.sm,
      color: theme.colors.textMuted,
      fontSize: theme.typography.caption.fontSize,
    },
  })) as any;

  const goalOptions: {key: GoalKey; label: string}[] = [
    {key: 'all', label: 'All Goals'},
    {key: 'weight_loss', label: 'Fat Loss'},
    {key: 'maintenance', label: 'Maintenance'},
    {key: 'muscle_gain', label: 'Muscle Gain'},
  ];

  const categories = [
    {key: 'all', label: 'All Templates'},
    {key: 'high_protein', label: 'High Protein'},
    {key: 'vegetarian', label: 'Vegetarian'},
    {key: 'vegan', label: 'Vegan'},
    {key: 'low_carb', label: 'Low Carb'},
    {key: 'budget', label: 'Budget'},
    {key: 'quick_prep', label: 'Quick Prep'},
  ];

  useEffect(() => {
    loadMealPlans();
    AsyncStorage.getItem(ACTIVE_MEAL_PLAN_KEY).then(id =>
      setActiveMealPlanId(id || null),
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      AsyncStorage.getItem(ACTIVE_MEAL_PLAN_KEY).then(id => {
        if (!cancelled) {
          setActiveMealPlanId(id || null);
        }
      });
      return () => {
        cancelled = true;
      };
    }, []),
  );

  useEffect(() => {
    filterMealPlans();
  }, [searchQuery, selectedGoal, selectedCategory, mealPlans]);

  const loadMealPlans = async () => {
    try {
      setLoading(true);
      const plans = await MealPlanService.getAllMealPlans();
      setMealPlans(plans);
    } catch (error) {
      console.error('Error loading meal plans:', error);
      Alert.alert('Error', 'Failed to load meal plans');
    } finally {
      setLoading(false);
    }
  };

  const filterMealPlans = () => {
    let filtered = mealPlans;

    // Filter by main goal
    if (selectedGoal !== 'all') {
      filtered = filtered.filter(plan => plan.category === selectedGoal);
    }

    // Filter by template chip
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'high_protein') {
        filtered = filtered.filter(
          plan =>
            plan.targetProtein >= 140 ||
            plan.tags.some(tag => tag.toLowerCase().includes('high_protein')),
        );
      } else if (selectedCategory === 'low_carb') {
        filtered = filtered.filter(plan => plan.targetCarbs <= 140);
      } else if (selectedCategory === 'quick_prep') {
        filtered = filtered.filter(plan => plan.duration <= 7);
      } else {
        filtered = filtered.filter(
          plan =>
            plan.category === selectedCategory ||
            plan.tags.some(tag => tag.toLowerCase().includes(selectedCategory)),
        );
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        plan =>
          plan.name.toLowerCase().includes(query) ||
          plan.description.toLowerCase().includes(query) ||
          plan.tags.some(tag => tag.toLowerCase().includes(query)),
      );
    }

    setFilteredPlans(filtered);
  };

  const plansInGoal =
    selectedGoal === 'all'
      ? mealPlans
      : mealPlans.filter(p => p.category === selectedGoal);
  const suggestedPlan = plansInGoal[0] || mealPlans[0];
  const activePlan = activeMealPlanId
    ? mealPlans.find(p => p.id === activeMealPlanId)
    : undefined;
  const targetPlan = activePlan ?? suggestedPlan;
  const targetSnapshot = targetPlan
    ? {
        calories: targetPlan.targetCalories,
        protein: targetPlan.targetProtein,
        carbs: targetPlan.targetCarbs,
      }
    : {calories: 0, protein: 0, carbs: 0};

  const handleMealPlanPress = (mealPlan: MealPlan) => {
    navigation.navigate('MealPlanDetails', {mealPlanId: mealPlan.id});
  };

  const handleStartMealPlan = async (mealPlan: MealPlan) => {
    try {
      Alert.alert(
        'Start Meal Plan',
        `Are you sure you want to start "${mealPlan.name}"? This will set up your meal plan for the next ${mealPlan.duration} days.`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Start',
            onPress: async () => {
              try {
                const uid = firebaseAuth.currentUser?.uid;
                if (!uid) {
                  Alert.alert('Sign in', 'Please sign in to start a meal plan.');
                  return;
                }
                await MealPlanService.startMealPlan(uid, mealPlan.id);
                await AsyncStorage.setItem(ACTIVE_MEAL_PLAN_KEY, mealPlan.id);
                setActiveMealPlanId(mealPlan.id);

                const weeklySetsTarget = deriveWeeklySetsTarget(mealPlan);
                await setDoc(
                  doc(firebaseDb, 'users', uid),
                  {
                    goals: {
                      dailyCalories: mealPlan.targetCalories,
                      weeklySetsTarget,
                    },
                    updatedAt: new Date(),
                  },
                  {merge: true},
                );

                // Set the meal plan goals in nutrition context
                setDailyGoals({
                  calories: mealPlan.targetCalories,
                  protein: mealPlan.targetProtein,
                  carbohydrates: mealPlan.targetCarbs,
                  fat: mealPlan.targetFat,
                  fiber: 25, // Default fiber goal
                  sugar: 50, // Default sugar goal
                });

                Alert.alert(
                  'Success! 🎉',
                  `Meal plan "${mealPlan.name}" has been started!\n\nYour daily targets:\n• Calories: ${mealPlan.targetCalories}\n• Protein: ${mealPlan.targetProtein}g\n• Carbs: ${mealPlan.targetCarbs}g\n• Fat: ${mealPlan.targetFat}g\n\nYou can now track your meals in the Nutrition section.`,
                  [
                    {
                      text: 'Go to Nutrition',
                      onPress: () => navigation.navigate('Nutrition'),
                    },
                    {text: 'OK'},
                  ],
                );
              } catch (error) {
                Alert.alert(
                  'Error',
                  'Failed to start meal plan. Please try again.',
                );
              }
            },
          },
        ],
      );
    } catch (error) {
      console.error('Error starting meal plan:', error);
      Alert.alert('Error', 'Failed to start meal plan');
    }
  };

  const renderMealPlan = ({item}: {item: MealPlan}) => (
    <MealPlanCard
      mealPlan={item}
      onPress={handleMealPlanPress}
      onStart={handleStartMealPlan}
      isActive={activeMealPlanId === item.id}
    />
  );

  const renderCategoryButton = ({item}: {item: (typeof categories)[0]}) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.key && styles.categoryButtonActive,
      ]}
      onPress={() => setSelectedCategory(item.key)}>
      <Text
        style={[
          styles.categoryButtonText,
          selectedCategory === item.key && styles.categoryButtonTextActive,
        ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, {paddingTop: topInset}]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            hitSlop={{top: 24, bottom: 24, left: 24, right: 24}}
            onPress={stackBack.onPress}>
            <Text style={styles.backButtonText}>{stackBack.label}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Meal Plans</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading meal plans...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, {paddingTop: topInset}]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          hitSlop={{top: 24, bottom: 24, left: 24, right: 24}}
          onPress={stackBack.onPress}>
          <Text style={styles.backButtonText}>{stackBack.label}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Meal Plans</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.goalContainer}>
        <Text style={styles.goalLabel}>Goal:</Text>
        <View style={styles.goalRow}>
          {goalOptions.map(option => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.goalButton,
                selectedGoal === option.key && styles.goalButtonActive,
              ]}
              onPress={() => setSelectedGoal(option.key)}>
              <Text
                style={[
                  styles.goalButtonText,
                  selectedGoal === option.key && styles.goalButtonTextActive,
                ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.targetCard}>
        <Text style={styles.targetTitle}>Your Target Today</Text>
        <View style={styles.statsRow}>
          <View style={styles.targetItem}>
            <Text style={styles.targetValue}>{targetSnapshot.calories}</Text>
            <Text style={styles.targetLabel}>Calories</Text>
          </View>
          <View style={styles.targetItem}>
            <Text style={styles.targetValue}>{targetSnapshot.protein}g</Text>
            <Text style={styles.targetLabel}>Protein</Text>
          </View>
          <View style={styles.targetItem}>
            <Text style={styles.targetValue}>{targetSnapshot.carbs}g</Text>
            <Text style={styles.targetLabel}>Carbs</Text>
          </View>
        </View>
        {targetPlan ? (
          <Text style={styles.targetSubText}>
            {activePlan
              ? `Active template: ${targetPlan.name}`
              : `Suggested for filters: ${targetPlan.name}`}
          </Text>
        ) : null}
      </View>

      <View style={styles.filtersCard}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search meal plans..."
          placeholderTextColor={theme.colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.templateChipsRow}>
          <FlatList
            data={categories}
            renderItem={renderCategoryButton}
            keyExtractor={item => item.key}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>

      <View style={styles.content}>
        {filteredPlans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No meal plans found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or category filter
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredPlans}
            renderItem={renderMealPlan}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: theme.spacing.lg}}
          />
        )}
      </View>
    </View>
  );
};

export default MealPlansScreen;
