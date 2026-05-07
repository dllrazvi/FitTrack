import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ExerciseScreen = () => {
  const navigation = useNavigation();

  const exercises = [
    { name: 'Push-ups', muscle: 'Chest, Triceps' },
    { name: 'Pull-ups', muscle: 'Back, Biceps' },
    { name: 'Squats', muscle: 'Legs' },
    { name: 'Plank', muscle: 'Core' },
    { name: 'Lunges', muscle: 'Legs' },
    { name: 'Burpees', muscle: 'Full Body' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Fitness exercises</Text>
      
      <TouchableOpacity 
        style={styles.bodyMapButton}
        onPress={() => navigation.navigate('SVGBody' as never)}
      >
        <Text style={styles.bodyMapText}>View body map</Text>
      </TouchableOpacity>

      <View style={styles.exercisesContainer}>
        {exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseMuscle}>{exercise.muscle}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  bodyMapButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  bodyMapText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exercisesContainer: {
    gap: 15,
  },
  exerciseCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  exerciseMuscle: {
    fontSize: 14,
    color: '#666',
  },
});

export default ExerciseScreen; 