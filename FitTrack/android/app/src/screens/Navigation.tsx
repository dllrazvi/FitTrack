import React, {useMemo} from 'react';
import {StatusBar, Platform} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  type Theme as NavTheme,
} from '@react-navigation/native';
import {useTheme} from '../../../../src/contexts/ThemeContext';

import LoginScreen from './LoginScreen';
import DashboardScreen from './DashboardScreen';
import NutritionScreen from './NutritionScreen';
import WorkoutScreen from './WorkoutScreen';
import ProfileScreen from './ProfileScreen';
import MealPlansScreen from './MealPlansScreen';
import MealPlanDetailsScreen from './MealPlanDetailsScreen';
import CommunityScreen from './CommunityScreen';

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Nutrition: undefined;
  Workout: undefined;
  Profile: undefined;
  Community: undefined;
  MealPlans: undefined;
  MealPlanDetails: {mealPlanId: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  const {theme, isDark} = useTheme();

  const navigationTheme = useMemo((): NavTheme => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: theme.colors.background,
        card: theme.colors.card,
        text: theme.colors.text,
        border: theme.colors.border,
        primary: theme.colors.primary,
        notification: theme.colors.accent,
      },
    };
  }, [isDark, theme]);

  return (
    <NavigationContainer theme={navigationTheme}>
      {Platform.OS === 'android' && (
        <StatusBar
          translucent={false}
          backgroundColor={theme.colors.surface}
          barStyle={isDark ? 'light-content' : 'dark-content'}
        />
      )}
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            title: 'FitTrack Dashboard',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Nutrition"
          component={NutritionScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Workout"
          component={WorkoutScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Community"
          component={CommunityScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MealPlans"
          component={MealPlansScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MealPlanDetails"
          component={MealPlanDetailsScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
