import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';
import SVGBodyScreen from './src/screens/SVGBodyScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Fitness App Login' }}
        />
        <Stack.Screen 
          name="Exercise" 
          component={ExerciseScreen} 
          options={{ title: 'Exercises' }}
        />
        <Stack.Screen 
          name="SVGBody" 
          component={SVGBodyScreen} 
          options={{ title: 'Body Map' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
