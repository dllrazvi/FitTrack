import React, {useState} from 'react';
import {
  View,
  Alert,
  Platform,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import {useScreenTopInset} from './useScreenTopInset';
import {useTheme} from '../../../../src/contexts/ThemeContext';

const authInstance = getAuth();

GoogleSignin.configure({
  webClientId:
    '544519532398-0sbvl5tvkepm3pdt0s6gknjg9n38uer3.apps.googleusercontent.com',
  offlineAccess: false,
});

const LoginScreen = ({navigation}: any) => {
  const {isDark} = useTheme();
  const topInset = useScreenTopInset();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(authInstance, email, password);
        navigation.replace('Dashboard');
      } else {
        await createUserWithEmailAndPassword(authInstance, email, password);
        navigation.replace('Dashboard');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      await GoogleSignin.signIn();
      const {accessToken} = await GoogleSignin.getTokens();
      const googleCredential = GoogleAuthProvider.credential(
        null,
        accessToken,
      );
      await signInWithCredential(authInstance, googleCredential);
      navigation.replace('Dashboard');
    } catch (error: any) {
      console.log('Google Sign-In Error:', error);
      if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      }
      if (error?.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Please wait', 'Google sign-in is already in progress.');
        return;
      }
      if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert(
          'Google Play Services',
          'Google Play services are not available on this device, which is required for “Continue with Google”.\n\n' +
            'Fix: In Android Studio → Device Manager, create an AVD that uses a system image with the Play Store (Google Play), not the AOSP-only image.\n\n' +
            'Until then, use email and password sign-in.',
        );
        return;
      }
      const msg = String(error?.message || '');
      if (
        msg.includes('Play services') ||
        msg.includes('Google Play services')
      ) {
        Alert.alert(
          'Google Play Services',
          'This app needs Google Play services for Google sign-in. Use a Google Play emulator image, or sign in with email and password.',
        );
        return;
      }
      Alert.alert(
        'Error',
        error.message || 'Google sign-in failed.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: topInset,
          backgroundColor: isDark ? '#1a1f3a' : '#667eea',
        },
      ]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>FitTrack</Text>
          <Text style={styles.subtitle}>Transform your life with us!</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleEmailAuth}
            disabled={loading}>
            <Text style={styles.buttonText}>
              {loading
                ? 'Please wait...'
                : isLogin
                ? 'Sign in'
                : 'Sign up'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.googleButton]}
            onPress={handleGoogleSignIn}
            disabled={loading}>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  form: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 25,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    padding: 18,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.2)',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButton: {
    backgroundColor: '#667eea',
  },
  googleButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  googleButtonText: {
    color: '#667eea',
    fontSize: 18,
    fontWeight: '700',
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 25,
    padding: 10,
  },
  switchText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
