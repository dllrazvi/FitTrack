import React, { useState } from 'react';
import { Button, View, StyleSheet, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = () => {
    setLoading(true);
    // TODO: wire Google Sign-In using credentials from Firebase / Google Cloud (never commit secrets).
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Google Sign-in Ready!', 
        'Your Google Sign-in is configured! Now we need to implement the actual authentication flow.',
        [
          { text: 'Continue without sign in', onPress: () => navigation.navigate('Exercise' as never) },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }, 1000);
  };

  const signInWithoutAuth = () => {
    navigation.navigate('Exercise' as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness App</Text>
      <Text style={styles.subtitle}>Sign in to start your fitness journey</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title={loading ? "Signing in..." : "Sign in with Google"} 
          onPress={signInWithGoogle}
          disabled={loading}
        />
        
        <View style={styles.divider} />
        
        <Button 
          title="Continue without sign in" 
          onPress={signInWithoutAuth}
          color="#666"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  divider: {
    height: 20,
  },
});

export default LoginScreen; 