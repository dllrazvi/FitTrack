import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SVGBodyScreen = () => {
  const navigation = useNavigation();
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

  const muscleGroups = [
    { name: 'Chest', exercises: ['Push-ups', 'Bench Press', 'Dumbbell Flyes'] },
    { name: 'Back', exercises: ['Pull-ups', 'Rows', 'Deadlifts'] },
    { name: 'Biceps', exercises: ['Curls', 'Hammer Curls', 'Preacher Curls'] },
    { name: 'Triceps', exercises: ['Dips', 'Tricep Extensions', 'Close-grip Push-ups'] },
    { name: 'Core', exercises: ['Crunches', 'Plank', 'Leg Raises'] },
    { name: 'Legs', exercises: ['Squats', 'Lunges', 'Deadlifts'] },
    { name: 'Shoulders', exercises: ['Overhead Press', 'Lateral Raises', 'Front Raises'] },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Body Map</Text>
      
      <View style={styles.bodyMapContainer}>
        <View style={styles.bodyOutline}>
          <Text style={styles.bodyText}>👤</Text>
          <Text style={styles.bodyLabel}>Your Body</Text>
        </View>
      </View>

      <ScrollView style={styles.muscleList}>
        {muscleGroups.map((muscle, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.muscleCard,
              selectedMuscle === muscle.name && styles.selectedMuscle
            ]}
            onPress={() => setSelectedMuscle(muscle.name)}
          >
            <Text style={styles.muscleName}>{muscle.name}</Text>
            {selectedMuscle === muscle.name && (
              <View style={styles.exercisesList}>
                {muscle.exercises.map((exercise, idx) => (
                  <Text key={idx} style={styles.exerciseItem}>• {exercise}</Text>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Exercises</Text>
      </TouchableOpacity>
    </View>
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
  bodyMapContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bodyOutline: {
    alignItems: 'center',
    padding: 20,
  },
  bodyText: {
    fontSize: 80,
    marginBottom: 10,
  },
  bodyLabel: {
    fontSize: 16,
    color: '#666',
  },
  muscleList: {
    flex: 1,
  },
  muscleCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedMuscle: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    borderWidth: 2,
  },
  muscleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  exercisesList: {
    marginTop: 10,
    paddingLeft: 10,
  },
  exerciseItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  backButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SVGBodyScreen; 