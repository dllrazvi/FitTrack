import React, { useEffect, useState } from 'react';
import {View, Text, FlatList, StyleSheet, ActivityIndicator} from 'react-native';
import {useScreenTopInset} from './useScreenTopInset';

type Exercise = {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
};

const ExerciseScreen = () => {
  const topInset = useScreenTopInset();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExercises = async () => {
    try {
      const response = await fetch('https://api.api-ninjas.com/v1/exercises?muscle=biceps', {
        headers: {
          'X-Api-Key': 'pKTg7nQJFizu4iaPhgPJIw==6rlIoRRXA8iR4DQC'
        },
      });

      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <View style={[styles.container, {paddingTop: topInset}]}>
      {loading ? (
        <ActivityIndicator size="large" color="#00ff99" />
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.name}</Text>
              <Text>🧠 Tip: {item.type}</Text>
              <Text>💪 Group: {item.muscle}</Text>
              <Text>🛠️ Echipament: {item.equipment}</Text>
              <Text>🎯 Dificultate: {item.difficulty}</Text>
              <Text>📋 Instructions: {item.instructions}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    padding: 10,
  },
  card: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 10,
    padding: 12,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
});

export default ExerciseScreen;
