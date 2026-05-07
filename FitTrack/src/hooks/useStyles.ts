import { StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Quick theme-aware StyleSheet for small components.
 * For full screens, prefer factories in `src/theme/` (e.g. `createNutritionScreenStyles`,
 * `createWorkoutScreenStyles`, `cardShadow` from `appScreenTheme`) so new UI stays on the global palette.
 */
export const useStyles = <T extends Record<string, any>>(
  createStyles: (theme: ReturnType<typeof useTheme>['theme']) => T
): T => {
  const { theme } = useTheme();
  return StyleSheet.create(createStyles(theme));
};

// Common style patterns
export const createCommonStyles = (theme: ReturnType<typeof useTheme>['theme']) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  button: {
    backgroundColor: theme.colors.buttonPrimary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonText: {
    color: theme.colors.buttonText,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  
  input: {
    backgroundColor: theme.colors.inputBackground,
    borderColor: theme.colors.inputBorder,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  },
  
  text: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
  },
  
  textSecondary: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
  },
  
  textMuted: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.caption.fontSize,
  },
  
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: theme.spacing.md,
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  shadow: {
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
