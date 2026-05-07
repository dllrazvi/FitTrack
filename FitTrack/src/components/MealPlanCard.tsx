// @ts-nocheck
import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import {useStyles} from '../hooks/useStyles';
import {MealPlan} from '../backend/models/MealPlan';

interface MealPlanCardProps {
  mealPlan: MealPlan;
  onPress: (mealPlan: MealPlan) => void;
  onStart: (mealPlan: MealPlan) => void;
  isActive?: boolean;
}

export const MealPlanCard: React.FC<MealPlanCardProps> = ({
  mealPlan,
  onPress,
  onStart,
  isActive = false,
}) => {
  const {theme} = useTheme();

  const styles = useStyles(theme => ({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginVertical: theme.spacing.xs,
      marginHorizontal: theme.spacing.md,
      borderWidth: 2,
      borderColor: 'transparent',
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardActive: {
      borderColor: theme.colors.success || '#2E7D32',
    },

    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },

    titleContainer: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },

    title: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },

    description: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
      lineHeight: 18,
    },

    categoryBadge: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },

    categoryText: {
      color: theme.colors.buttonText,
      fontSize: theme.typography.caption.fontSize,
      fontWeight: '600',
      textTransform: 'capitalize',
    },

    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },

    statItem: {
      alignItems: 'center',
      flex: 1,
    },

    statValue: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },

    statLabel: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },

    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: theme.spacing.sm,
    },

    tag: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },

    tagText: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
    },

    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    button: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginHorizontal: theme.spacing.xs,
    },

    primaryButton: {
      backgroundColor: theme.colors.primary,
    },

    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },

    buttonText: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },

    primaryButtonText: {
      color: theme.colors.buttonText,
    },

    secondaryButtonText: {
      color: theme.colors.primary,
    },

    difficultyContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },

    difficultyDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: theme.spacing.xs,
    },

    difficultyText: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
      textTransform: 'capitalize',
    },
  }));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return theme.colors.success;
      case 'intermediate':
        return theme.colors.warning;
      case 'advanced':
        return theme.colors.error;
      default:
        return theme.colors.textMuted;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'weight_loss':
        return '#FF6B6B';
      case 'muscle_gain':
        return '#4ECDC4';
      case 'vegan':
        return '#96CEB4';
      case 'vegetarian':
        return '#FECA57';
      case 'keto':
        return '#FF9FF3';
      case 'mediterranean':
        return '#54A0FF';
      default:
        return theme.colors.primary;
    }
  };

  return (
    <View style={[styles.card, isActive && styles.cardActive]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{mealPlan.name}</Text>
          <Text style={styles.description}>{mealPlan.description}</Text>
        </View>
        <View
          style={[
            styles.categoryBadge,
            {backgroundColor: getCategoryColor(mealPlan.category)},
          ]}>
          <Text style={styles.categoryText}>
            {mealPlan.category.replace('_', ' ')}
          </Text>
        </View>
      </View>

      <View style={styles.difficultyContainer}>
        <View
          style={[
            styles.difficultyDot,
            {backgroundColor: getDifficultyColor(mealPlan.difficulty)},
          ]}
        />
        <Text style={styles.difficultyText}>
          {mealPlan.difficulty} • {mealPlan.duration} days
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{mealPlan.targetCalories}</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{mealPlan.targetProtein}g</Text>
          <Text style={styles.statLabel}>Protein</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{mealPlan.targetCarbs}g</Text>
          <Text style={styles.statLabel}>Carbs</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{mealPlan.targetFat}g</Text>
          <Text style={styles.statLabel}>Fat</Text>
        </View>
      </View>

      <View style={styles.tagsContainer}>
        {mealPlan.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>#{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => onPress(mealPlan)}>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            View Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            isActive ? styles.secondaryButton : styles.primaryButton,
          ]}
          onPress={() => {
            if (!isActive) {
              onStart(mealPlan);
            }
          }}>
          <Text
            style={[
              styles.buttonText,
              isActive ? styles.secondaryButtonText : styles.primaryButtonText,
            ]}>
            {isActive ? 'Current plan' : 'Start Plan'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



