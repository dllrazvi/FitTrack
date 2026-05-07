import type {Theme} from '../contexts/ThemeContext';

/** UI accent; keep for chips / CTAs across the app. */
export const BRAND_ACCENT = '#4ECDC4';

/**
 * Reusable card shadow using theme — use on any elevated panel (screens + web later).
 * New feature screens: import and spread `...cardShadow(c)` on root cards.
 */
export const cardShadow = (t: Theme['colors']) => ({
  shadowColor: t.shadow,
  shadowOffset: {width: 0, height: 2},
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
});

/**
 * Optional subtle bottom edge for headers that sit on `background` (e.g. stack screens).
 */
export const headerOnBackground = (t: Theme['colors'], isDark: boolean) => ({
  backgroundColor: t.card,
  borderBottomWidth: 1,
  borderBottomColor: isDark ? t.divider : t.border,
});
