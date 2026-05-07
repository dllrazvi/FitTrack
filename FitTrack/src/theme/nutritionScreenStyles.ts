import {StyleSheet} from 'react-native';
import type {Theme} from '../contexts/ThemeContext';
import {BRAND_ACCENT, cardShadow} from './appScreenTheme';

/**
 * Nutrition screen — all colors from ThemeContext. Add new UI here so dark mode stays in sync.
 */
export function createNutritionScreenStyles(theme: Theme, isDark: boolean) {
  const c = theme.colors;
  const tagBg = isDark ? 'rgba(78, 205, 196, 0.14)' : '#E8F5F5';
  const filterActiveOther = isDark ? 'rgba(150, 206, 180, 0.35)' : '#96CEB4';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      backgroundColor: c.card,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    backButton: {
      padding: 10,
      minWidth: 48,
      minHeight: 44,
      justifyContent: 'center',
    },
    backButtonText: {
      fontSize: 16,
      color: BRAND_ACCENT,
      fontWeight: '600',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: c.text,
    },
    headerRight: {
      minWidth: 48,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    searchContainer: {
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: c.card,
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    searchInput: {
      backgroundColor: c.inputBackground,
      borderRadius: 12,
      padding: 15,
      fontSize: 16,
      borderWidth: 1,
      borderColor: c.inputBorder,
      color: c.text,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: c.text,
      marginBottom: 15,
    },
    foodListContainer: {
      backgroundColor: c.card,
      marginHorizontal: 10,
      marginVertical: 6,
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: c.border,
      ...cardShadow(c),
    },
    paginationRow: {
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    paginationButton: {
      backgroundColor: BRAND_ACCENT,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },
    paginationButtonDisabled: {
      backgroundColor: c.border,
    },
    paginationButtonText: {
      color: c.buttonText,
      fontSize: 12,
      fontWeight: '700',
    },
    paginationInfo: {
      color: c.textSecondary,
      fontSize: 12,
      fontWeight: '600',
    },
    foodItem: {
      backgroundColor: c.surface,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      borderLeftWidth: 4,
      borderLeftColor: BRAND_ACCENT,
    },
    inlineEditor: {
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    foodItemHeader: {
      marginBottom: 8,
    },
    foodName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: c.text,
    },
    foodBrand: {
      fontSize: 12,
      color: c.textSecondary,
    },
    foodNutrition: {
      marginBottom: 8,
    },
    nutritionText: {
      fontSize: 12,
      color: c.textSecondary,
    },
    foodTags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    tag: {
      fontSize: 10,
      color: BRAND_ACCENT,
      backgroundColor: tagBg,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      marginRight: 4,
      marginBottom: 2,
    },
    selectedFoodContainer: {
      backgroundColor: c.card,
      marginHorizontal: 10,
      marginVertical: 6,
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: c.border,
      ...cardShadow(c),
    },
    selectedFoodCard: {
      backgroundColor: c.surface,
      borderRadius: 12,
      padding: 12,
    },
    selectedFoodName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: c.text,
      marginBottom: 4,
    },
    selectedFoodBrand: {
      fontSize: 14,
      color: c.textSecondary,
      marginBottom: 15,
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    quantityLabel: {
      fontSize: 14,
      color: c.text,
      marginRight: 10,
    },
    quantityInput: {
      backgroundColor: c.inputBackground,
      borderRadius: 8,
      padding: 8,
      width: 80,
      textAlign: 'center',
      borderWidth: 1,
      borderColor: c.inputBorder,
      color: c.text,
    },
    nutritionInfo: {
      marginBottom: 15,
    },
    nutritionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: c.text,
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
      color: BRAND_ACCENT,
    },
    nutritionLabel: {
      fontSize: 10,
      color: c.textSecondary,
      textAlign: 'center',
    },
    servingSizesContainer: {
      marginBottom: 12,
    },
    servingSizesTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: c.text,
      marginBottom: 10,
    },
    servingSizeItem: {
      backgroundColor: c.inputBackground,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      marginRight: 8,
      borderWidth: 1,
      borderColor: c.border,
    },
    servingSizeText: {
      fontSize: 12,
      color: c.text,
    },
    addButton: {
      backgroundColor: BRAND_ACCENT,
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: 'center',
    },
    addButtonText: {
      color: c.buttonText,
      fontSize: 16,
      fontWeight: 'bold',
    },

    journalContainer: {
      backgroundColor: c.card,
      marginHorizontal: 10,
      marginVertical: 6,
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: c.border,
      ...cardShadow(c),
    },
    dailyProgressContainer: {
      marginBottom: 20,
    },
    progressTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: c.text,
      marginBottom: 10,
    },
    progressBar: {
      height: 12,
      backgroundColor: c.inputBackground,
      borderRadius: 6,
      overflow: 'hidden',
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      backgroundColor: BRAND_ACCENT,
      borderRadius: 6,
    },
    progressText: {
      fontSize: 14,
      color: c.textSecondary,
      textAlign: 'center',
    },
    dailyTotalsContainer: {
      marginBottom: 20,
    },
    totalsTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: c.text,
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
      color: BRAND_ACCENT,
    },
    totalLabel: {
      fontSize: 10,
      color: c.textSecondary,
      textAlign: 'center',
      marginTop: 4,
    },
    goalText: {
      fontSize: 9,
      color: c.textMuted,
      textAlign: 'center',
      marginTop: 2,
    },
    journalListContainer: {
      marginBottom: 15,
    },
    journalListTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: c.text,
      marginBottom: 15,
    },
    journalItem: {
      backgroundColor: c.surface,
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
      color: c.text,
      marginBottom: 4,
    },
    journalItemMeal: {
      fontSize: 12,
      color: c.textSecondary,
      textTransform: 'capitalize',
    },
    journalItemDetails: {
      flex: 1,
      marginLeft: 15,
    },
    journalItemQuantity: {
      fontSize: 12,
      color: c.text,
      marginBottom: 2,
    },
    journalItemNutrition: {
      fontSize: 10,
      color: c.textSecondary,
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
      color: c.textSecondary,
      marginBottom: 8,
    },
    emptyJournalSubtext: {
      fontSize: 14,
      color: c.textMuted,
      textAlign: 'center',
    },
    controlsContainer: {
      backgroundColor: c.card,
      marginHorizontal: 10,
      marginVertical: 6,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: c.border,
      ...cardShadow(c),
    },
    sortContainer: {
      marginBottom: 12,
    },
    controlLabel: {
      fontSize: 14,
      fontWeight: 'bold',
      color: c.text,
      marginBottom: 8,
    },
    sortDropdownButton: {
      flex: 1,
      minHeight: 42,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    sortDropdownText: {
      color: c.text,
      fontSize: 13,
      fontWeight: '600',
    },
    sortDropdownIcon: {
      color: c.textSecondary,
      fontSize: 12,
      marginLeft: 10,
    },
    sortControlRow: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
    },
    sortDirectionButton: {
      minHeight: 42,
      minWidth: 44,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: BRAND_ACCENT,
      backgroundColor: BRAND_ACCENT,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sortDirectionButtonText: {
      color: c.buttonText,
      fontSize: 18,
      fontWeight: '700',
      lineHeight: 22,
    },
    sortMenu: {
      marginTop: 8,
      borderRadius: 10,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    sortMenuItem: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    sortMenuItemActive: {
      backgroundColor: BRAND_ACCENT,
    },
    sortMenuItemText: {
      color: c.text,
      fontSize: 13,
      fontWeight: '500',
    },
    sortMenuItemTextActive: {
      color: c.buttonText,
      fontWeight: '700',
    },
    filterContainer: {
      marginBottom: 10,
    },
    filterButtons: {
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
    },
    categoryButtons: {
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
    },
    filterButton: {
      backgroundColor: c.surface,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.border,
    },
    filterButtonActive: {
      backgroundColor: filterActiveOther,
      borderColor: filterActiveOther,
    },
    filterButtonText: {
      fontSize: 12,
      color: c.textSecondary,
      fontWeight: '500',
    },
    filterButtonTextActive: {
      color: c.buttonText,
      fontWeight: 'bold',
    },
    mealTargetContainer: {
      marginBottom: 12,
    },
    mealTargetButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    mealTargetButton: {
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.inputBackground,
    },
    mealTargetButtonActive: {
      backgroundColor: BRAND_ACCENT,
      borderColor: BRAND_ACCENT,
    },
    mealTargetButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: c.textSecondary,
    },
    mealTargetButtonTextActive: {
      color: c.buttonText,
      fontWeight: '700',
    },
  });
}

export type NutritionScreenStyles = ReturnType<typeof createNutritionScreenStyles>;
