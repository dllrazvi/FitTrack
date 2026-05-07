import type {NavigationProp, ParamListBase} from '@react-navigation/native';

/** Short label for the previous stack screen (shown on the back affordance). */
const PREVIOUS_SCREEN_LABEL: Record<string, string> = {
  Dashboard: 'Home',
  Login: 'Sign in',
  Nutrition: 'Nutrition',
  Workout: 'Workout',
  Profile: 'Profile',
  Community: 'Community',
  MealPlans: 'Meal plans',
};

export type StackBackResolution = {
  label: string;
  onPress: () => void;
};

/**
 * Resolves the in-app "back" action: pops when possible, otherwise goes to Dashboard.
 * Label reflects the previous route (e.g. "← Home" when returning from Workout to Dashboard).
 */
export function resolveStackBack(
  navigation: NavigationProp<ParamListBase>,
): StackBackResolution {
  const goHome = () => {
    navigation.navigate('Dashboard' as never);
  };

  const state = navigation.getState();
  const routes = state?.routes ?? [];
  const index = state?.index ?? 0;

  if (index <= 0) {
    return {label: '← Home', onPress: goHome};
  }

  const prev = routes[index - 1];
  if (!prev || typeof prev.name !== 'string') {
    return {label: '← Home', onPress: goHome};
  }

  if (prev.name === 'Login') {
    return {label: '← Home', onPress: goHome};
  }

  const short =
    PREVIOUS_SCREEN_LABEL[prev.name] ?? prev.name;
  return {
    label: `← ${short}`,
    onPress: () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        goHome();
      }
    },
  };
}
