import React, {useEffect, useMemo, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {doc, setDoc} from '@react-native-firebase/firestore';
import {firebaseAuth, firebaseDb} from '../../../../src/config/firebase';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useTheme} from '../../../../src/contexts/ThemeContext';
import {useStyles} from '../../../../src/hooks/useStyles';
import {useNutrition} from '../../../../src/contexts/NutritionContext';
import {MealEntry} from '../../../../src/backend/models/Nutrition';
import {MealPlan} from '../../../../src/backend/models/MealPlan';
import {MealPlanService} from '../../../../src/services/MealPlanService';
import {resolveStackBack} from './stackBackHelper';
import {useScreenTopInset} from './useScreenTopInset';

const ACTIVE_MEAL_PLAN_KEY = '@fittrack_active_meal_plan_id';

const deriveWeeklySetsTarget = (mealPlan: MealPlan) => {
  if (mealPlan.category === 'muscle_gain') return 90;
  if (mealPlan.category === 'weight_loss') return 70;
  if (mealPlan.difficulty === 'advanced') return 100;
  if (mealPlan.difficulty === 'intermediate') return 80;
  return 60;
};

const MealPlanDetailsScreen = ({navigation, route}: any) => {
  const {theme} = useTheme();
  const topInset = useScreenTopInset();
  const stackBack = resolveStackBack(navigation);
  const {setDailyGoals, addMeal} = useNutrition();
  const mealPlanId: string | undefined = route?.params?.mealPlanId;
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [quickMessage, setQuickMessage] = useState('');
  const quickMessageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const styles = useStyles(themeObj => ({
    container: {flex: 1, backgroundColor: themeObj.colors.background},
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: themeObj.spacing.lg,
      backgroundColor: themeObj.colors.card,
    },
    backButton: {padding: themeObj.spacing.sm},
    backButtonText: {
      fontSize: 16,
      color: themeObj.colors.primary,
      fontWeight: '600',
    },
    title: {
      fontSize: themeObj.typography.h2.fontSize,
      fontWeight: themeObj.typography.h2.fontWeight,
      color: themeObj.colors.text,
    },
    headerRight: {width: 70},
    body: {padding: themeObj.spacing.lg, paddingBottom: themeObj.spacing.xl},
    loadingWrap: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    loadingText: {marginTop: themeObj.spacing.md, color: themeObj.colors.textSecondary},
    card: {
      backgroundColor: themeObj.colors.card,
      borderRadius: themeObj.borderRadius.lg,
      padding: themeObj.spacing.lg,
      marginBottom: themeObj.spacing.md,
    },
    planName: {
      fontSize: themeObj.typography.h2.fontSize,
      fontWeight: '700',
      color: themeObj.colors.text,
      marginBottom: themeObj.spacing.xs,
    },
    desc: {
      fontSize: themeObj.typography.body.fontSize,
      color: themeObj.colors.textSecondary,
      marginBottom: themeObj.spacing.md,
    },
    macroRow: {flexDirection: 'row', justifyContent: 'space-between'},
    macroItem: {flex: 1, alignItems: 'center'},
    macroValue: {
      fontSize: themeObj.typography.h3.fontSize,
      fontWeight: '700',
      color: themeObj.colors.primary,
    },
    macroLabel: {
      marginTop: themeObj.spacing.xs,
      fontSize: themeObj.typography.caption.fontSize,
      color: themeObj.colors.textSecondary,
    },
    sectionTitle: {
      fontSize: themeObj.typography.h3.fontSize,
      fontWeight: '700',
      color: themeObj.colors.text,
      marginBottom: themeObj.spacing.sm,
    },
    mealCard: {
      backgroundColor: themeObj.colors.surface,
      borderRadius: themeObj.borderRadius.md,
      padding: themeObj.spacing.md,
      marginBottom: themeObj.spacing.sm,
      borderWidth: 1,
      borderColor: themeObj.colors.border,
    },
    mealTitle: {
      fontSize: themeObj.typography.body.fontSize,
      fontWeight: '700',
      color: themeObj.colors.text,
    },
    mealMeta: {
      marginTop: themeObj.spacing.xs,
      fontSize: themeObj.typography.caption.fontSize,
      color: themeObj.colors.textSecondary,
    },
    mealActionsRow: {
      marginTop: themeObj.spacing.sm,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    addMealButton: {
      backgroundColor: themeObj.colors.primary,
      borderRadius: themeObj.borderRadius.sm,
      paddingVertical: themeObj.spacing.xs,
      paddingHorizontal: themeObj.spacing.sm,
    },
    addMealButtonText: {
      color: themeObj.colors.buttonText,
      fontSize: themeObj.typography.caption.fontSize,
      fontWeight: '700',
    },
    itemText: {
      marginTop: themeObj.spacing.xs,
      fontSize: themeObj.typography.caption.fontSize,
      color: themeObj.colors.textMuted,
    },
    startButton: {
      marginTop: themeObj.spacing.md,
      backgroundColor: themeObj.colors.primary,
      borderRadius: themeObj.borderRadius.md,
      paddingVertical: themeObj.spacing.md,
      alignItems: 'center',
    },
    startButtonText: {
      color: themeObj.colors.buttonText,
      fontSize: themeObj.typography.body.fontSize,
      fontWeight: '700',
    },
    quickBanner: {
      marginHorizontal: themeObj.spacing.lg,
      marginTop: themeObj.spacing.sm,
      marginBottom: themeObj.spacing.xs,
      borderRadius: themeObj.borderRadius.md,
      paddingVertical: themeObj.spacing.sm,
      paddingHorizontal: themeObj.spacing.md,
      backgroundColor: themeObj.colors.primary,
    },
    quickBannerText: {
      color: themeObj.colors.buttonText,
      fontSize: themeObj.typography.body.fontSize,
      fontWeight: '600',
    },
  })) as any;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const plans = await MealPlanService.getAllMealPlans();
        const found = plans.find(p => p.id === mealPlanId) || null;
        setMealPlan(found);
      } catch (err) {
        Alert.alert('Error', 'Could not load meal plan details.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [mealPlanId]);

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
    }, 1300);
  };

  const meals = useMemo(() => {
    if (!mealPlan) return [];
    return [
      {label: 'Breakfast', value: mealPlan.meals.breakfast},
      {label: 'Lunch', value: mealPlan.meals.lunch},
      {label: 'Dinner', value: mealPlan.meals.dinner},
      ...mealPlan.meals.snacks.map((s, idx) => ({
        label: `Snack ${idx + 1}`,
        value: s,
      })),
    ];
  }, [mealPlan]);

  const handleUsePlan = async () => {
    if (!mealPlan) return;
    const uid = firebaseAuth.currentUser?.uid;
    if (!uid) {
      Alert.alert('Sign in', 'Please sign in to start a meal plan.');
      return;
    }
    try {
      await MealPlanService.startMealPlan(uid, mealPlan.id);
      await AsyncStorage.setItem(ACTIVE_MEAL_PLAN_KEY, mealPlan.id);

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

      setDailyGoals({
        calories: mealPlan.targetCalories,
        protein: mealPlan.targetProtein,
        carbohydrates: mealPlan.targetCarbs,
        fat: mealPlan.targetFat,
        fiber: 25,
        sugar: 50,
      });

      Alert.alert('Plan activated', `${mealPlan.name} is now active.`, [
        {text: 'Go to Nutrition', onPress: () => navigation.navigate('Nutrition')},
        {text: 'OK'},
      ]);
    } catch {
      Alert.alert('Error', 'Failed to start meal plan. Please try again.');
    }
  };

  const handleAddPlannedMealToToday = (sectionLabel: string, sectionMeal: any) => {
    const mealType: MealEntry['mealType'] =
      sectionLabel.toLowerCase().startsWith('snack')
        ? 'snack'
        : sectionLabel.toLowerCase() === 'breakfast'
        ? 'breakfast'
        : sectionLabel.toLowerCase() === 'lunch'
        ? 'lunch'
        : 'dinner';

    const newMealEntry: MealEntry = {
      id: `plan-${Date.now()}-${mealType}`,
      userId: firebaseAuth.currentUser?.uid ?? 'guest',
      date: new Date().toISOString().split('T')[0],
      mealType,
      timestamp: new Date(),
      items: sectionMeal.items.map((item: any) => ({
        foodId: item.foodId,
        foodName: item.foodName,
        quantity: item.quantity,
        servingSize: item.servingSize,
        nutrition: {
          calories: item.nutrition.calories,
          protein: item.nutrition.protein,
          carbohydrates: item.nutrition.carbohydrates,
          fat: item.nutrition.fat,
          fiber: item.nutrition.fiber,
          sugar: item.nutrition.sugar,
        },
      })),
      totalNutrition: {
        calories: sectionMeal.totalNutrition.calories,
        protein: sectionMeal.totalNutrition.protein,
        carbohydrates: sectionMeal.totalNutrition.carbohydrates,
        fat: sectionMeal.totalNutrition.fat,
        fiber: sectionMeal.totalNutrition.fiber,
        sugar: sectionMeal.totalNutrition.sugar,
      },
      notes: `From meal plan: ${mealPlan?.name ?? 'Plan'}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addMeal(newMealEntry);
    showQuickMessage(`${sectionLabel} added to today`);
  };

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
          <Text style={styles.title}>Meal Plan</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading details...</Text>
        </View>
      </View>
    );
  }

  if (!mealPlan) {
    return (
      <View style={[styles.container, {paddingTop: topInset}]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            hitSlop={{top: 24, bottom: 24, left: 24, right: 24}}
            onPress={stackBack.onPress}>
            <Text style={styles.backButtonText}>{stackBack.label}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Meal Plan</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingText}>Meal plan not found.</Text>
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
        <Text style={styles.title}>Meal Plan</Text>
        <View style={styles.headerRight} />
      </View>
      {quickMessage ? (
        <View style={styles.quickBanner}>
          <Text style={styles.quickBannerText}>{quickMessage}</Text>
        </View>
      ) : null}
      <ScrollView style={{flex: 1}} contentContainerStyle={styles.body}>
        <View style={styles.card}>
          <Text style={styles.planName}>{mealPlan.name}</Text>
          <Text style={styles.desc}>{mealPlan.description}</Text>
          <View style={styles.macroRow}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{mealPlan.targetCalories}</Text>
              <Text style={styles.macroLabel}>Calories</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{mealPlan.targetProtein}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{mealPlan.targetCarbs}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{mealPlan.targetFat}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.startButton} onPress={handleUsePlan}>
            <Text style={styles.startButtonText}>Use This Plan</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Meals Overview</Text>
        {meals.map(section => (
          <View key={`${section.label}-${section.value.name}`} style={styles.mealCard}>
            <Text style={styles.mealTitle}>{section.label}: {section.value.name}</Text>
            <Text style={styles.mealMeta}>
              {section.value.time} • {section.value.totalNutrition.calories} kcal • P{' '}
              {section.value.totalNutrition.protein}g / C{' '}
              {section.value.totalNutrition.carbohydrates}g / F{' '}
              {section.value.totalNutrition.fat}g
            </Text>
            {section.value.items.slice(0, 4).map(item => (
              <Text key={`${section.label}-${item.foodName}`} style={styles.itemText}>
                • {item.foodName} ({item.quantity}g)
              </Text>
            ))}
            <View style={styles.mealActionsRow}>
              <TouchableOpacity
                style={styles.addMealButton}
                onPress={() =>
                  handleAddPlannedMealToToday(section.label, section.value)
                }>
                <Text style={styles.addMealButtonText}>Add this meal to today</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default MealPlanDetailsScreen;
