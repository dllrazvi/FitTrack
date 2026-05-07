import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Navigation from './android/app/src/screens/Navigation';
import {NutritionProvider} from './src/contexts/NutritionContext';
import {WorkoutProvider} from './src/contexts/WorkoutContext';
import {NotificationInboxProvider} from './src/contexts/NotificationInboxContext';
import {ThemeProvider} from './src/contexts/ThemeContext';
import './src/config/firebase';

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NutritionProvider>
          <WorkoutProvider>
            <NotificationInboxProvider>
              <Navigation />
            </NotificationInboxProvider>
          </WorkoutProvider>
        </NutritionProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
