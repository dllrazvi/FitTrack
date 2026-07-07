import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {signOut} from '@react-native-firebase/auth';
import {
  doc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
} from '@react-native-firebase/firestore';
import {ref, putFile, getDownloadURL} from '@react-native-firebase/storage';
import {firebaseAuth, firebaseDb, firebaseStorage} from '../../../../src/config/firebase';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {
  launchImageLibrary,
  type Asset,
} from 'react-native-image-picker';
import {User} from '../../../../src/backend/models/User';
import {useWorkout} from '../../../../src/contexts/WorkoutContext';
import {useTheme} from '../../../../src/contexts/ThemeContext';
import {DarkModeToggle} from '../../../../src/components/DarkModeToggle';
import {MealPlanService} from '../../../../src/services/MealPlanService';
import {resolveStackBack} from './stackBackHelper';
import {useScreenTopInset} from './useScreenTopInset';

const {width} = Dimensions.get('window');
const ACTIVE_MEAL_PLAN_KEY = '@fittrack_active_meal_plan_id';

const ProfileScreen = ({navigation}: any) => {
  const stackBack = resolveStackBack(navigation);
  const topInset = useScreenTopInset();
  // Context hooks
  const {workoutHistory} = useWorkout();
  const {theme} = useTheme();

  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [isExportingData, setIsExportingData] = useState(false);
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    weight: '',
    height: '',
    activityLevel: 'moderate',
    fitnessGoal: 'build_muscle',
    dailySteps: '10000',
    weeklyWorkouts: '3',
    targetWeight: '',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    const unsub = navigation?.addListener?.('focus', () => loadUserData());
    return unsub;
  }, [navigation]);

  // Update user stats when workout/nutrition data changes
  useEffect(() => {
    if (user) {
      setUser(prevUser => ({
        ...prevUser!,
        stats: {
          ...calculateRealStats(),
          joinDate: prevUser!.stats.joinDate,
        },
      }));
    }
  }, [workoutHistory]);

  // Calculate real-time statistics
  const calculateRealStats = () => {
    const totalWorkouts = workoutHistory.length;
    const totalCaloriesBurned = workoutHistory.reduce(
      (sum, workout) => sum + workout.caloriesBurned,
      0,
    );

    // Calculate current streak (consecutive days with workouts)
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      // Check last 30 days
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateString = checkDate.toISOString().split('T')[0];
      const hasWorkout = workoutHistory.some(w => w.date === dateString);

      if (hasWorkout) {
        currentStreak++;
      } else if (i > 0) {
        // Allow today to not have a workout yet
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    const allDates = workoutHistory.map(w => w.date).sort();

    for (let i = 0; i < allDates.length; i++) {
      if (i === 0 || allDates[i] !== allDates[i - 1]) {
        tempStreak = 1;
        if (i > 0) {
          const prevDate = new Date(allDates[i - 1]);
          const currDate = new Date(allDates[i]);
          const dayDiff =
            (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
          if (dayDiff === 1) {
            tempStreak = longestStreak + 1;
          }
        }
        longestStreak = Math.max(longestStreak, tempStreak);
      }
    }

    return {
      totalWorkouts,
      totalCaloriesBurned,
      currentStreak,
      longestStreak,
    };
  };

  const normalizeFitnessGoal = (
    raw?: string,
  ): 'lose_weight' | 'maintain' | 'gain_weight' | 'build_muscle' => {
    if (!raw) return 'build_muscle';
    const goal = raw.toLowerCase();
    if (goal === 'muscle_gain') return 'build_muscle';
    if (
      goal === 'lose_weight' ||
      goal === 'maintain' ||
      goal === 'gain_weight' ||
      goal === 'build_muscle'
    ) {
      return goal;
    }
    return 'build_muscle';
  };

  const mealPlanCategoryToFitnessGoal = (
    category?: string,
  ): 'lose_weight' | 'maintain' | 'gain_weight' | 'build_muscle' => {
    if (!category) {
      return 'build_muscle';
    }
    if (category === 'weight_loss') {
      return 'lose_weight';
    }
    if (category === 'muscle_gain') {
      return 'build_muscle';
    }
    if (category === 'maintenance') {
      return 'maintain';
    }
    return 'build_muscle';
  };

  const mealPlanCategoryToWeeklySetsTarget = (category?: string) => {
    if (category === 'muscle_gain') return 90;
    if (category === 'weight_loss') return 70;
    if (category === 'maintenance') return 75;
    return 60;
  };

  const formatFitnessGoal = (goal?: string) => {
    switch (normalizeFitnessGoal(goal)) {
      case 'lose_weight':
        return 'Lose Weight';
      case 'gain_weight':
        return 'Gain Weight';
      case 'build_muscle':
        return 'Build Muscle';
      default:
        return 'Maintain';
    }
  };

  const accountStats = (() => {
    const totalMinutes = workoutHistory.reduce(
      (sum, w) => sum + (Number(w.duration) || 0),
      0,
    );
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recent = workoutHistory.filter(w => {
      const d = new Date(w.date);
      return !Number.isNaN(d.getTime()) && d >= sevenDaysAgo;
    });
    const weeklyMinutes = recent.reduce((sum, w) => sum + (Number(w.duration) || 0), 0);
    const weeklyWorkouts = recent.length;
    const weeklyCalories = recent.reduce(
      (sum, w) => sum + (Number(w.caloriesBurned) || 0),
      0,
    );
    const avgSession = weeklyWorkouts > 0 ? Math.round(weeklyMinutes / weeklyWorkouts) : 0;
    const activeDays7 = new Set(recent.map(w => w.date)).size;
    const totalSetsCompleted = workoutHistory.reduce(
      (sum, w) =>
        sum +
        (typeof w.completedSets === 'number'
          ? Math.max(Number(w.completedSets) || 0, 0)
          : Math.max(Number(w.exercisesCompleted) || 0, 0) * 3),
      0,
    );
    const weeklySets = recent.reduce(
      (sum, w) =>
        sum +
        (typeof w.completedSets === 'number'
          ? Math.max(Number(w.completedSets) || 0, 0)
          : Math.max(Number(w.exercisesCompleted) || 0, 0) * 3),
      0,
    );
    const weeklySetsTarget = user?.goals.weeklySetsTarget ?? 60;
    const weeklySetsCompletion = Math.min(
      Math.round((weeklySets / Math.max(weeklySetsTarget, 1)) * 100),
      100,
    );
    return {
      totalMinutes,
      avgSession,
      totalSetsCompleted,
      weeklyMinutes,
      weeklyWorkouts,
      weeklyCalories,
      weeklySets,
      activeDays7,
      weeklySetsCompletion,
    };
  })();

  const computedFavoriteExercises = (() => {
    const counts: Record<string, number> = {};
    for (const w of workoutHistory) {
      counts[w.routineName] = (counts[w.routineName] ?? 0) + 1;
    }
    const fromHistory = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);
    if (fromHistory.length > 0) {
      return fromHistory;
    }
    return user?.preferences.favoriteExercises ?? [];
  })();

  const loadUserData = async () => {
    try {
      const currentAuthUser = firebaseAuth.currentUser;
      if (!currentAuthUser) {
        Alert.alert('Error', 'User is not authenticated');
        navigation.replace('Login');
        return;
      }

      // Create default user profile (fallback)
      const defaultUserProfile: User = {
        uid: currentAuthUser.uid,
        email: currentAuthUser.email || '',
        displayName: currentAuthUser.displayName || '',
        photoURL: currentAuthUser.photoURL || '',
        profile: {
          firstName: currentAuthUser.displayName?.split(' ')[0] || 'User',
          lastName:
            currentAuthUser.displayName?.split(' ').slice(1).join(' ') || '',
          age: 25,
          gender: 'other',
          height: 175,
          weight: 70,
          activityLevel: 'moderate',
          fitnessGoal: 'build_muscle',
        },
        goals: {
          dailyCalories: 2000,
          dailySteps: 10000,
          weeklyWorkouts: 3,
          weeklySetsTarget: 60,
          targetWeight: 70,
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        preferences: {
          dietaryRestrictions: [],
          favoriteExercises: [],
          workoutDuration: 0,
          notifications: {
            meals: true,
            workouts: true,
            reminders: true,
          },
        },
        stats: {
          ...calculateRealStats(),
          joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };

      let userProfile = defaultUserProfile;

      try {
        // Try to load from Firebase
        const userDoc = await getDoc(
          doc(firebaseDb, 'users', currentAuthUser.uid),
        );

        if (userDoc.exists()) {
          // User exists in Firestore, load their data
          const data = userDoc.data();
          userProfile = {
            uid: currentAuthUser.uid,
            email: currentAuthUser.email || '',
            displayName: currentAuthUser.displayName || '',
            photoURL: currentAuthUser.photoURL || '',
            profile: data?.profile || defaultUserProfile.profile,
            goals: data?.goals || defaultUserProfile.goals,
            preferences: data?.preferences || defaultUserProfile.preferences,
            stats: {
              ...calculateRealStats(),
              joinDate:
                data?.stats?.joinDate?.toDate() ||
                defaultUserProfile.stats.joinDate,
            },
            createdAt:
              data?.createdAt?.toDate() || defaultUserProfile.createdAt,
            updatedAt: data?.updatedAt?.toDate() || new Date(),
          };
        } else {
          // Try to save new user to Firestore (but don't fail if it doesn't work)
          try {
            await setDoc(
              doc(firebaseDb, 'users', currentAuthUser.uid),
              userProfile as unknown as Record<string, unknown>,
            );
          } catch {
            // Firestore write failed; local profile still usable.
          }
        }
      } catch {
        // Firestore unavailable; fall back to default profile fields.
      }

      const activeMealPlanId = await AsyncStorage.getItem(ACTIVE_MEAL_PLAN_KEY);
      if (activeMealPlanId) {
        const activeMealPlan = await MealPlanService.getMealPlanById(activeMealPlanId);
        if (activeMealPlan) {
          userProfile = {
            ...userProfile,
            profile: {
              ...userProfile.profile,
              fitnessGoal: mealPlanCategoryToFitnessGoal(activeMealPlan.category),
            },
            goals: {
              ...userProfile.goals,
              dailyCalories: activeMealPlan.targetCalories,
              weeklySetsTarget: mealPlanCategoryToWeeklySetsTarget(
                activeMealPlan.category,
              ),
            },
          };
        }
      }

      setUser(userProfile);
      setEditData({
        firstName: userProfile.profile.firstName || '',
        lastName: userProfile.profile.lastName || '',
        age: userProfile.profile.age?.toString() || '',
        weight: userProfile.profile.weight?.toString() || '',
        height: userProfile.profile.height?.toString() || '',
        activityLevel: userProfile.profile.activityLevel || 'moderate',
        fitnessGoal: normalizeFitnessGoal(userProfile.profile.fitnessGoal),
        dailySteps: userProfile.goals.dailySteps?.toString() || '10000',
        weeklyWorkouts: userProfile.goals.weeklyWorkouts?.toString() || '3',
        targetWeight: userProfile.goals.targetWeight?.toString() || '',
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSave = async () => {
    if (!user) {
      return;
    }

    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        firstName: editData.firstName,
        lastName: editData.lastName,
        age: parseInt(editData.age) || undefined,
        weight: parseFloat(editData.weight) || undefined,
        height: parseFloat(editData.height) || undefined,
        activityLevel: editData.activityLevel as
          | 'sedentary'
          | 'light'
          | 'moderate'
          | 'active'
          | 'very_active',
        fitnessGoal: editData.fitnessGoal as
          | 'lose_weight'
          | 'maintain'
          | 'gain_weight'
          | 'build_muscle',
      },
      goals: {
        ...user.goals,
        dailySteps: parseInt(editData.dailySteps) || 10000,
        weeklyWorkouts: parseInt(editData.weeklyWorkouts) || 3,
        targetWeight: parseFloat(editData.targetWeight) || undefined,
      },
      updatedAt: new Date(),
    };

    try {
      const currentAuthUser = firebaseAuth.currentUser;
      if (currentAuthUser) {
        try {
          await updateDoc(doc(firebaseDb, 'users', currentAuthUser.uid), {
            profile: updatedUser.profile,
            goals: updatedUser.goals,
            updatedAt: updatedUser.updatedAt,
          });
        } catch {
          // Local state still updated below.
        }
      }

      setUser(updatedUser);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(firebaseAuth);
            navigation.replace('Login');
          } catch (error) {
            Alert.alert('Error', 'Could not sign out');
          }
        },
      },
    ]);
  };

  const handleExportData = async () => {
    const currentAuthUser = firebaseAuth.currentUser;
    if (!currentAuthUser || !user) {
      Alert.alert('Error', 'User not ready for export.');
      return;
    }

    if (isExportingData) {
      return;
    }

    try {
      setIsExportingData(true);
      const uid = currentAuthUser.uid;
      const userRef = doc(collection(firebaseDb, 'users'), uid);
      const [userDocSnap, workoutSessionsSnap, nutritionLogsSnap] =
        await Promise.all([
          getDoc(userRef),
          getDocs(
            query(
              collection(userRef, 'workoutSessions'),
              orderBy('createdAt', 'desc'),
              limit(300),
            ),
          ),
          getDocs(
            query(
              collection(firebaseDb, 'dailyNutritionLogs'),
              where('userId', '==', uid),
              limit(90),
            ),
          ),
        ]);

      const workoutSessions = workoutSessionsSnap.docs.map(
        (qd: {id: string; data: () => Record<string, unknown>}) => ({
          id: qd.id,
          ...qd.data(),
        }),
      );
      const nutritionLogs = nutritionLogsSnap.docs.map(
        (qd: {id: string; data: () => Record<string, unknown>}) => ({
          id: qd.id,
          ...qd.data(),
        }),
      );

      const exportPayload = {
        exportedAt: new Date().toISOString(),
        app: 'FitTrack',
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        profile: user.profile,
        goals: user.goals,
        preferences: user.preferences,
        stats: user.stats,
        firestoreUserDoc: userDocSnap.exists() ? userDocSnap.data() : null,
        workoutSessions,
        nutritionLogs,
        metadata: {
          workoutSessionCount: workoutSessions.length,
          nutritionLogCount: nutritionLogs.length,
        },
      };

      const fileName = `fittrack-export-${new Date().toISOString().slice(0, 10)}.json`;
      const basePath = RNFS.DownloadDirectoryPath || RNFS.DocumentDirectoryPath;
      const path = `${basePath}/${fileName}`;
      await RNFS.writeFile(path, JSON.stringify(exportPayload, null, 2), 'utf8');
      let shared = false;
      try {
        await Share.open({
          title: 'Export FitTrack Data',
          message: 'FitTrack account export',
          url: `file://${path}`,
          type: 'application/json',
          failOnCancel: false,
        });
        shared = true;
      } catch {
        // Share sheet unavailable; file remains on device.
      }
      Alert.alert(
        'Export ready',
        shared
          ? 'Your data export is ready and share sheet opened.'
          : `Your export was saved locally at:\n${path}`,
      );
    } catch (e) {
      console.error('export data failed', e);
      Alert.alert(
        'Export failed',
        `Could not export your data. Please try again.\n\n${String(
          (e as Error)?.message || e,
        )}`,
      );
    } finally {
      setIsExportingData(false);
    }
  };

  const handlePickProfilePhoto = async () => {
    const currentAuthUser = firebaseAuth.currentUser;
    if (!currentAuthUser) {
      Alert.alert('Error', 'User is not authenticated');
      return;
    }

    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
      },
      async response => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Failed to pick image');
          return;
        }

        const asset: Asset | undefined = response.assets?.[0];
        if (!asset?.uri) {
          Alert.alert('Error', 'Invalid image selected');
          return;
        }

        try {
          setPhotoUploading(true);
          const safeName = asset.fileName || `profile_${Date.now()}.jpg`;
          const remotePath = `profilePhotos/${currentAuthUser.uid}/${Date.now()}_${safeName}`;
          const storageRef = ref(firebaseStorage, remotePath);
          await putFile(storageRef, asset.uri);
          const photoURL = await getDownloadURL(storageRef);

          await setDoc(
            doc(firebaseDb, 'users', currentAuthUser.uid),
            {
              photoURL,
              updatedAt: new Date(),
            },
            {merge: true},
          );

          await currentAuthUser.updateProfile({photoURL});
          setUser(prev =>
            prev
              ? {
                  ...prev,
                  photoURL,
                }
              : prev,
          );
        } catch (e) {
          console.error('profile photo upload failed', e);
          Alert.alert('Error', 'Could not upload profile picture');
        } finally {
          setPhotoUploading(false);
        }
      },
    );
  };

  const StatCard = ({title, value, subtitle, color}: any) => (
    <View
      style={[
        styles.statCard,
        {borderLeftColor: color, backgroundColor: theme.colors.card},
      ]}>
      <Text style={[styles.statValue, {color: theme.colors.text}]}>
        {value}
      </Text>
      <Text style={[styles.statTitle, {color: theme.colors.textSecondary}]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.statSubtitle, {color: theme.colors.textMuted}]}>
          {subtitle}
        </Text>
      )}
    </View>
  );

  if (!user) {
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: theme.colors.background, paddingTop: topInset},
        ]}>
        <View style={styles.loadingContainer}>
          <Text
            style={[styles.loadingText, {color: theme.colors.textSecondary}]}>
            Loading profile...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: theme.colors.background, paddingTop: topInset},
      ]}>
      <View style={[styles.header, {backgroundColor: theme.colors.card}]}>
        <TouchableOpacity
          style={styles.backButton}
          hitSlop={{top: 24, bottom: 24, left: 24, right: 24}}
          onPress={stackBack.onPress}>
          <Text
            style={[styles.backButtonText, {color: theme.colors.primary}]}>
            {stackBack.label}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.title, {color: theme.colors.text}]}>Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}>
          <Text
            style={[styles.editButtonText, {color: theme.colors.primary}]}>
            {isEditing ? 'Cancel' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Profile Info */}
        <View style={[styles.section, {backgroundColor: theme.colors.card}]}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Personal Information
          </Text>
          <View
            style={[
              styles.profileCard,
              {backgroundColor: theme.colors.surface},
            ]}>
            <View style={styles.avatarContainer}>
              {user.photoURL ? (
                <Image source={{uri: user.photoURL}} style={styles.avatar} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user.profile.firstName?.charAt(0) ||
                      user.displayName?.charAt(0) ||
                      'U'}
                  </Text>
                </View>
              )}
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {user.profile.firstName} {user.profile.lastName}
                </Text>
                <Text style={styles.profileEmail}>{user.email}</Text>
                <TouchableOpacity
                  style={styles.changePhotoButton}
                  onPress={handlePickProfilePhoto}
                  disabled={photoUploading}>
                  {photoUploading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.changePhotoButtonText}>Change Photo</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {isEditing ? (
              <View style={styles.editForm}>
                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>First Name</Text>
                    <TextInput
                      style={styles.input}
                      value={editData.firstName}
                      onChangeText={text =>
                        setEditData({...editData, firstName: text})
                      }
                      placeholder="First Name"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Last Name</Text>
                    <TextInput
                      style={styles.input}
                      value={editData.lastName}
                      onChangeText={text =>
                        setEditData({...editData, lastName: text})
                      }
                      placeholder="Last Name"
                    />
                  </View>
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Age</Text>
                    <TextInput
                      style={styles.input}
                      value={editData.age}
                      onChangeText={text =>
                        setEditData({...editData, age: text})
                      }
                      placeholder="Age"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Weight (kg)</Text>
                    <TextInput
                      style={styles.input}
                      value={editData.weight}
                      onChangeText={text =>
                        setEditData({...editData, weight: text})
                      }
                      placeholder="Weight"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Height (cm)</Text>
                    <TextInput
                      style={styles.input}
                      value={editData.height}
                      onChangeText={text =>
                        setEditData({...editData, height: text})
                      }
                      placeholder="Height"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* Goals Section */}
                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Daily Steps</Text>
                    <TextInput
                      style={styles.input}
                      value={editData.dailySteps}
                      onChangeText={text =>
                        setEditData({...editData, dailySteps: text})
                      }
                      placeholder="Daily Steps"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Weekly Workouts</Text>
                    <TextInput
                      style={styles.input}
                      value={editData.weeklyWorkouts}
                      onChangeText={text =>
                        setEditData({...editData, weeklyWorkouts: text})
                      }
                      placeholder="Weekly Workouts"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Target Weight (kg)</Text>
                    <TextInput
                      style={styles.input}
                      value={editData.targetWeight}
                      onChangeText={text =>
                        setEditData({...editData, targetWeight: text})
                      }
                      placeholder="Target Weight"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.profileDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Age:</Text>
                  <Text style={styles.detailValue}>
                    {user.profile.age || 'Not set'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Weight:</Text>
                  <Text style={styles.detailValue}>
                    {user.profile.weight
                      ? `${user.profile.weight} kg`
                      : 'Not set'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Height:</Text>
                  <Text style={styles.detailValue}>
                    {user.profile.height
                      ? `${user.profile.height} cm`
                      : 'Not set'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Activity Level:</Text>
                  <Text style={styles.detailValue}>
                    {user.profile.activityLevel}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Fitness Goal:</Text>
                  <Text style={styles.detailValue}>
                    {formatFitnessGoal(user.profile.fitnessGoal)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Goals */}
        <View style={[styles.section, {backgroundColor: theme.colors.card}]}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Your Goals
          </Text>
          <View
            style={[styles.goalsCard, {backgroundColor: theme.colors.surface}]}>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>Daily Calories</Text>
              <Text style={styles.goalValue}>
                {(user.goals.dailyCalories ?? 2000)} kcal
              </Text>
            </View>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>Daily Steps</Text>
              <Text style={styles.goalValue}>
                {(user.goals.dailySteps ?? 0).toLocaleString()}
              </Text>
            </View>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>Weekly Workouts</Text>
              <Text style={styles.goalValue}>{user.goals.weeklyWorkouts}</Text>
            </View>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>Weekly Sets Target</Text>
              <Text style={styles.goalValue}>
                {user.goals.weeklySetsTarget ?? 60}
              </Text>
            </View>
            {user.goals.targetWeight && (
              <View style={styles.goalItem}>
                <Text style={styles.goalLabel}>Target Weight</Text>
                <Text style={styles.goalValue}>
                  {user.goals.targetWeight} kg
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Preferences */}
        <View style={[styles.section, {backgroundColor: theme.colors.card}]}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Preferences
          </Text>
          <View
            style={[
              styles.preferencesCard,
              {backgroundColor: theme.colors.surface},
            ]}>
            {/* Dark Mode Toggle */}
            <View style={styles.preferenceItem}>
              <DarkModeToggle showLabel={true} size="medium" />
            </View>

            <View style={styles.preferenceItem}>
              <Text
                style={[
                  styles.preferenceLabel,
                  {color: theme.colors.textSecondary},
                ]}>
                Dietary Restrictions
              </Text>
              <Text
                style={[styles.preferenceValue, {color: theme.colors.text}]}>
                Not configured
              </Text>
            </View>
            <View style={styles.preferenceItem}>
              <Text
                style={[
                  styles.preferenceLabel,
                  {color: theme.colors.textSecondary},
                ]}>
                Workout Duration
              </Text>
              <Text
                style={[styles.preferenceValue, {color: theme.colors.text}]}>
                {accountStats.avgSession > 0
                  ? `${accountStats.avgSession} minutes`
                  : 'Not enough data yet'}
              </Text>
            </View>
            <View style={styles.preferenceItem}>
              <Text
                style={[
                  styles.preferenceLabel,
                  {color: theme.colors.textSecondary},
                ]}>
                Favorite Exercises
              </Text>
              <Text
                style={[styles.preferenceValue, {color: theme.colors.text}]}>
                {computedFavoriteExercises.length > 0
                  ? computedFavoriteExercises.join(', ')
                  : 'None set'}
              </Text>
            </View>
          </View>
        </View>

        {/* Statistics */}
        <View style={[styles.section, {backgroundColor: theme.colors.card}]}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Your Statistics (This Week)
          </Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Workouts"
              value={accountStats.weeklyWorkouts}
              subtitle="last 7 days"
              color="#4ECDC4"
            />
            <StatCard
              title="Calories Burned"
              value={accountStats.weeklyCalories}
              subtitle="last 7 days"
              color="#FF6B6B"
            />
            <StatCard
              title="Minutes"
              value={accountStats.weeklyMinutes}
              subtitle="trained"
              color="#45B7D1"
            />
            <StatCard
              title="Sets"
              value={accountStats.weeklySets}
              subtitle="estimated"
              color="#00B894"
            />
            <StatCard
              title="Active Days (7d)"
              value={accountStats.activeDays7}
              subtitle="days"
              color="#96CEB4"
            />
            <StatCard
              title="Sets Goal"
              value={`${accountStats.weeklySetsCompletion}%`}
              subtitle="weekly target"
              color="#AB47BC"
            />
          </View>
        </View>

        {/* Actions */}
        <View style={[styles.section, {backgroundColor: theme.colors.card}]}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Account Actions
          </Text>
          <View
            style={[
              styles.actionsCard,
              {backgroundColor: theme.colors.surface},
            ]}>
            <TouchableOpacity
              style={[styles.actionButton, isExportingData && styles.actionButtonDisabled]}
              onPress={handleExportData}
              disabled={isExportingData}>
              {isExportingData ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <Text style={styles.actionButtonText}>Export Data</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Privacy Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.signOutButton]}
              onPress={handleSignOut}>
              <Text style={[styles.actionButtonText, styles.signOutButtonText]}>
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    fontSize: 16,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  profileCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  profileEmail: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
  changePhotoButton: {
    marginTop: 8,
    backgroundColor: '#4ECDC4',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  changePhotoButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  editForm: {
    marginTop: 10,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileDetails: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  detailValue: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    width: (width - 60) / 2 - 5,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  statSubtitle: {
    fontSize: 10,
    color: '#7F8C8D',
  },
  goalsCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
  },
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  goalLabel: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  goalValue: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: 'bold',
  },
  preferencesCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
  },
  preferenceItem: {
    marginBottom: 15,
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  preferenceValue: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '500',
  },
  actionsCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  actionButtonDisabled: {
    opacity: 0.7,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  signOutButtonText: {
    color: 'white',
  },
});

export default ProfileScreen;
