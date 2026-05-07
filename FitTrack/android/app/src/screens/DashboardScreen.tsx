import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
  Animated,
  Image,
} from 'react-native';
import {doc, getDoc} from '@react-native-firebase/firestore';
import {firebaseAuth, firebaseDb} from '../../../../src/config/firebase';
import {User} from '../../../../src/backend/models/User';
import {useNutrition} from '../../../../src/contexts/NutritionContext';
import {useWorkout} from '../../../../src/contexts/WorkoutContext';
import {useScreenTopInset} from './useScreenTopInset';
import {
  useNotificationInbox,
  NotificationBellIcon,
} from '../../../../src/contexts/NotificationInboxContext';
import {useTheme} from '../../../../src/contexts/ThemeContext';
import type {Theme} from '../../../../src/contexts/ThemeContext';
import {getTodaySteps, requestStepAccess} from '../../../../src/services/stepTrackingService';

const {width} = Dimensions.get('window');

const getLocalYmd = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;

// Custom Circular Stats with Percentage-Based Sections
const CircularStats = ({stats, dailyTotals, dailyGoals, theme, scrollY}: any) => {
  const c = (theme as Theme).colors;
  const size = 280;
  const center = size / 2;
  const clusterProgress = scrollY.interpolate({
    inputRange: [-140, 0, 140],
    outputRange: [1, 0, 1],
    extrapolate: 'clamp',
  });

  // Calculate percentages for each metric
  const burnedPercent = Math.min((stats.caloriesBurned / 500) * 100, 100);
  const setsPercent = Math.min((stats.sets / Math.max(stats.setsTarget || 60, 1)) * 100, 100);
  const stepsPercent = Math.min((stats.steps / 10000) * 100, 100);
  const consumedPercent = Math.min(
    (dailyTotals.calories / dailyGoals.calories) * 100,
    100,
  );

  const sections = [
    {
      label: 'Sets',
      value: stats.sets,
      unit: '',
      icon: '🏋️',
      color: '#4ECDC4',
      percentage: setsPercent,
      position: 0, // Top-left
    },
    {
      label: 'Calories Burned',
      value: stats.caloriesBurned,
      unit: 'kcal',
      icon: '🔥',
      color: '#FF6B6B',
      percentage: burnedPercent,
      position: 1, // Top-right
    },
    {
      label: 'Steps',
      value: stats.steps,
      unit: 'steps',
      icon: '👟',
      color: '#45B7D1',
      percentage: stepsPercent,
      position: 2, // Bottom-right
    },
    {
      label: 'Calories Consumed',
      value: dailyTotals.calories,
      unit: 'kcal',
      icon: '🍎',
      color: '#9B59B6',
      percentage: consumedPercent,
      position: 3, // Bottom-left
    },
  ];

  return (
    <View style={styles.customCircularContainer}>
      <View
        style={[
          styles.customCircularCircle,
          {
            backgroundColor: c.card,
            borderColor: c.border,
            shadowColor: c.shadow,
          },
        ]}>
        {/* Background circle */}
        <View
          style={[
            styles.customCircleBackground,
            {backgroundColor: c.surface, borderColor: c.border},
          ]}
        />

        {/* Percentage-based sections */}
        {sections.map((section, index) => {
          // Fixed positions for 4 circles around the center
          const positions = [
            {x: -80, y: -80}, // Top-left
            {x: 80, y: -80}, // Top-right
            {x: 80, y: 80}, // Bottom-right
            {x: -80, y: 80}, // Bottom-left
          ];

          const pos = positions[section.position];

          const translateX = Animated.multiply(
            clusterProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.42],
            }),
            pos.x,
          );
          const translateY = Animated.multiply(
            clusterProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.42],
            }),
            pos.y,
          );

          return (
            <Animated.View
              key={index}
              style={[
                styles.customSection,
                {
                  left: center - 60,
                  top: center - 60,
                  transform: [
                    {translateX},
                    {translateY},
                    {
                      scale: clusterProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.84],
                      }),
                    },
                  ],
                },
              ]}>
              <View
                style={[
                  styles.customSectionContent,
                  {backgroundColor: section.color},
                ]}>
                <Text style={styles.customSectionIcon}>{section.icon}</Text>
                <Text style={styles.customSectionValue}>{section.value}</Text>
                {section.unit ? (
                  <Text style={styles.customSectionUnit}>{section.unit}</Text>
                ) : null}
                <Text style={styles.customSectionLabel}>{section.label}</Text>
                <Text style={styles.customSectionPercent}>
                  {Math.round(section.percentage)}%
                </Text>
              </View>
            </Animated.View>
          );
        })}

        {/* Center circle with overall progress */}
        <Animated.View
          style={[
            styles.customCenterCircle,
            {backgroundColor: c.card, borderColor: '#4ECDC4'},
            {
              transform: [
                {
                  scale: clusterProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.92],
                  }),
                },
              ],
            },
          ]}>
          <Text style={[styles.customCenterTitle, {color: c.text}]}>
            Today
          </Text>
          <Text style={[styles.customCenterSubtitle, {color: c.textSecondary}]}>
            Progress
          </Text>
          <Text style={[styles.customCenterPercent, {color: '#4ECDC4'}]}>
            {Math.round(
              (setsPercent +
                burnedPercent +
                stepsPercent +
                consumedPercent) /
                4,
            )}
            %
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

const ProgressBar = ({current, target, label, color, theme}: any) => {
  const c = (theme as Theme).colors;
  const percentage = Math.min((current / target) * 100, 100);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedWidth, {
      toValue: percentage,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  }, [percentage, animatedWidth]);

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={[styles.progressLabel, {color: c.text}]}>{label}</Text>
        <Text style={[styles.progressText, {color: c.textSecondary}]}>
          {Math.round(current)}/{target}
        </Text>
      </View>
      <View
        style={[
          styles.progressBar,
          {
            backgroundColor: c.inputBackground,
            borderColor: c.border,
          },
        ]}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: color,
            },
          ]}
        />
        <View style={[styles.progressGlow, {backgroundColor: color}]} />
      </View>
      <Text style={[styles.progressPercentage, {color: c.textMuted}]}>
        {Math.round(percentage)}%
      </Text>
    </View>
  );
};

const QuickAction = ({title, icon, onPress, color}: any) => (
  <TouchableOpacity style={styles.quickActionContainer} onPress={onPress}>
    <View style={[styles.quickAction, {backgroundColor: color}]}>
      <View style={styles.quickActionIconContainer}>
        <Text style={styles.quickActionIcon}>{icon}</Text>
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const DashboardScreen = ({navigation}: any) => {
  const {unreadCount, openPanel, closePanel, panelOpen} = useNotificationInbox();
  const {theme, isDark} = useTheme();
  const welcomeAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const [clockText, setClockText] = useState('');
  const tText = useMemo(
    () => ({
      section: [styles.sectionTitle, {color: theme.colors.text}],
      goalCat: [styles.goalCategoryTitle, {color: theme.colors.text}],
      quote: [
        styles.quoteText,
        {color: isDark ? theme.colors.text : '#FFFFFF'},
      ],
      load: [styles.loadingText, {color: theme.colors.textSecondary}],
      headerTitle: [styles.headerTitle, {color: theme.colors.text}],
      date: [styles.date, {color: theme.colors.textSecondary}],
    }),
    [theme, isDark],
  );
  const cardShell = useMemo(
    () => ({
      section: {
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.border,
        shadowColor: theme.colors.shadow,
      },
      goalCluster: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
      },
      quote: isDark
        ? {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderWidth: 1,
            shadowColor: theme.colors.shadow,
          }
        : {backgroundColor: '#667eea', borderWidth: 0, shadowColor: '#000'},
    }),
    [theme, isDark],
  );
  const topInset = useScreenTopInset();
  const [user, setUser] = useState<User | null>(null);
  const [dailyStats, setDailyStats] = useState({
    caloriesConsumed: 0,
    caloriesBurned: 0,
    steps: 0,
    workouts: 0,
    sets: 0,
    setsTarget: 60,
  });
  const [loading, setLoading] = useState(true);

  // Get nutrition data from context
  const {dailyTotals, dailyGoals} = useNutrition();

  // Get workout data from context
  const {workoutHistory} = useWorkout();

  useEffect(() => {
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update dashboard when nutrition data changes
  useEffect(() => {
    console.log(
      '🔄 Dashboard updating with new nutrition data:',
      dailyTotals.calories,
      'kcal',
    );
    setDailyStats(prevStats => ({
      ...prevStats,
      caloriesConsumed: dailyTotals.calories,
    }));
  }, [dailyTotals]);

  useEffect(() => {
    const todayYmd = getLocalYmd();
    const todaySessions = workoutHistory.filter(session => session.date === todayYmd);
    const todaySetsDone = todaySessions
      .reduce(
        (sum, session) =>
          sum +
          (typeof session.completedSets === 'number'
            ? Math.max(Number(session.completedSets) || 0, 0)
            : Math.max(Number(session.exercisesCompleted) || 0, 0) * 3),
        0,
      );
    const todayCaloriesBurned = todaySessions.reduce(
      (sum, session) => sum + Math.max(Number(session.caloriesBurned) || 0, 0),
      0,
    );

    setDailyStats(prev => ({
      ...prev,
      workouts: todaySessions.length,
      caloriesBurned: todayCaloriesBurned,
      sets: todaySetsDone,
    }));
  }, [workoutHistory]);

  useEffect(() => {
    let cancelled = false;
    let stepAccessGranted = false;
    const refreshSteps = async () => {
      if (!stepAccessGranted) {
        return;
      }
      try {
        const steps = await getTodaySteps();
        if (!cancelled) {
          setDailyStats(prev => ({...prev, steps}));
        }
      } catch (e) {
        const msg = String(e || '').toLowerCase();
        if (!msg.includes('activity_recognition')) {
          console.warn('getTodaySteps', e);
        }
      }
    };

    const boot = async () => {
      const access = await requestStepAccess();
      stepAccessGranted = access.granted;
      if (access.granted) {
        await refreshSteps();
      } else if (!cancelled) {
        console.log('step access not granted:', access.message);
      }
    };

    boot().catch(() => {});
    const timer = setInterval(() => {
      refreshSteps().catch(() => {});
    }, 60000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);

      // Get current user from Firebase Auth
      const currentAuthUser = firebaseAuth.currentUser;
      if (!currentAuthUser) {
        Alert.alert('Error', 'User is not authenticated');
        navigation.replace('Login');
        return;
      }

      // Create a simple user profile from Firebase Auth data
      let userProfile: User = {
        uid: currentAuthUser.uid,
        email: currentAuthUser.email || '',
        displayName: currentAuthUser.displayName || undefined,
        photoURL: currentAuthUser.photoURL || undefined,
        profile: {
          firstName: currentAuthUser.displayName?.split(' ')[0] || 'User',
          lastName:
            currentAuthUser.displayName?.split(' ').slice(1).join(' ') || '',
          age: undefined,
          gender: undefined,
          height: undefined,
          weight: undefined,
          activityLevel: 'moderate',
          fitnessGoal: 'maintain',
        },
        goals: {
          dailyCalories: 2000,
          dailySteps: 10000,
          weeklyWorkouts: 3,
          weeklySetsTarget: 60,
          targetWeight: undefined,
          targetDate: undefined,
        },
        preferences: {
          dietaryRestrictions: [],
          favoriteExercises: [],
          workoutDuration: 45,
          notifications: {
            meals: true,
            workouts: true,
            reminders: true,
          },
        },
        stats: {
          totalWorkouts: 0,
          totalCaloriesBurned: 0,
          currentStreak: 0,
          longestStreak: 0,
          joinDate: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      try {
        const userDoc = await getDoc(
          doc(firebaseDb, 'users', currentAuthUser.uid),
        );
        if (userDoc.exists()) {
          const d = userDoc.data();
          userProfile = {
            ...userProfile,
            photoURL: d?.photoURL || userProfile.photoURL,
            profile: d?.profile ? {...userProfile.profile, ...d.profile} : userProfile.profile,
            goals: d?.goals ? {...userProfile.goals, ...d.goals} : userProfile.goals,
          };
        }
      } catch (e) {
        console.log('dashboard user firestore fallback', e);
      }

      setUser(userProfile);
      setDailyStats(prev => ({
        ...prev,
        setsTarget: userProfile.goals.weeklySetsTarget ?? 60,
      }));

      setDailyStats({
        caloriesConsumed: dailyTotals.calories, // Real data from nutrition context
        caloriesBurned: 0,
        steps: 0,
        workouts: 0,
        sets: 0,
        setsTarget: userProfile.goals.weeklySetsTarget ?? 60,
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Could not load user data');
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good morning';
    }
    if (hour < 18) {
      return 'Good afternoon';
    }
    return 'Good evening';
  };

  const getMotivationalQuote = () => {
    const quotes = [
      'Every step counts in your journey to health! 💪',
      'Today is the perfect day to start! 🌟',
      'Small progress leads to big results! 🎯',
      'Your health is your best investment! ❤️',
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const formatDateTimeLine = (date: Date) => {
    const datePart = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timePart = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${datePart} • ${timePart}`;
  };

  useEffect(() => {
    const tick = () => setClockText(formatDateTimeLine(new Date()));
    tick();
    const timer = setInterval(tick, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (loading || !user) {
      return;
    }
    setShowWelcomeBanner(true);
    welcomeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(welcomeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.delay(2300),
      Animated.timing(welcomeAnim, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start(() => setShowWelcomeBanner(false));
  }, [loading, user, welcomeAnim]);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {paddingTop: topInset, backgroundColor: theme.colors.background},
        ]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={tText.load}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {paddingTop: topInset, backgroundColor: theme.colors.background},
      ]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTextWrap}>
            <Text style={tText.headerTitle}>Dashboard</Text>
            <Text style={tText.date} numberOfLines={1} ellipsizeMode="tail">
              {clockText}
            </Text>
          </View>
          <View style={styles.headerRightCluster}>
            <NotificationBellIcon
              unreadCount={unreadCount}
              onPress={() => (panelOpen ? closePanel() : openPanel())}
            />
            <TouchableOpacity
              style={[styles.avatar, styles.avatarHeaderSpacing]}
              onPress={() => navigation.navigate('Profile')}>
              {user?.photoURL ? (
                <Image source={{uri: user.photoURL}} style={styles.avatarGradient} />
              ) : (
                <View style={styles.avatarGradient}>
                  <Text style={styles.avatarText}>
                    {user?.profile?.firstName?.charAt(0) ||
                      user?.displayName?.charAt(0) ||
                      'U'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {showWelcomeBanner && (
        <Animated.View
          style={[
            styles.welcomeBanner,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              opacity: welcomeAnim,
              transform: [
                {
                  translateY: welcomeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-8, 0],
                  }),
                },
              ],
            },
          ]}>
          <Text style={[styles.welcomeBannerText, {color: theme.colors.text}]}>
            {getGreeting()}, {user?.profile?.firstName || user?.displayName || 'there'}! 👋
          </Text>
        </Animated.View>
      )}

      <Animated.ScrollView
        style={{flex: 1, backgroundColor: theme.colors.background}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}>
        {/* Stats Cards - Circular */}
        <View style={styles.statsContainer}>
          <CircularStats
            stats={dailyStats}
            dailyTotals={dailyTotals}
            dailyGoals={dailyGoals}
            theme={theme}
            scrollY={scrollY}
          />
        </View>

        {/* Quick Actions */}
        <View style={[styles.quickActionsSection, cardShell.section]}>
          <Text style={tText.section}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickAction
              title="Add Food"
              icon="🍎"
              color="#FF6B6B"
              gradientColors={['#FF6B6B', '#FF8E8E']}
              onPress={() => navigation.navigate('Nutrition')}
            />
            <QuickAction
              title="Start Workout"
              icon="🏋️"
              color="#4ECDC4"
              gradientColors={['#4ECDC4', '#6DD5D5']}
              onPress={() => navigation.navigate('Workout')}
            />
            <QuickAction
              title="Community"
              icon="👥"
              color="#96CEB4"
              gradientColors={['#96CEB4', '#B0D8C6']}
              onPress={() => navigation.navigate('Community')}
            />
            <QuickAction
              title="Meal Plans"
              icon="🍽️"
              color="#FF9F43"
              gradientColors={['#FF9F43', '#FFB366']}
              onPress={() => navigation.navigate('MealPlans')}
            />
          </View>
        </View>

        {/* Today's Goals - Nutrition & Workout Combined */}
        <View style={[styles.goalsSection, cardShell.section]}>
          <Text style={tText.section}>Today's Goals</Text>
          <View style={styles.goalsContainer}>
            {/* Workout Goals */}
            <View style={[styles.goalCategory, cardShell.goalCluster]}>
              <Text style={tText.goalCat}>💪 Workout</Text>
              <ProgressBar
                current={dailyStats.steps}
                target={10000}
                label="Steps"
                color="#4ECDC4"
                theme={theme}
              />
              <ProgressBar
                current={dailyStats.workouts}
                target={1}
                label="Workouts Today"
                color="#9B59B6"
                theme={theme}
              />
              <ProgressBar
                current={dailyStats.caloriesBurned}
                target={500}
                label="Calories Burned"
                color="#E74C3C"
                theme={theme}
              />
            </View>

            {/* Nutrition Goals */}
            <View style={[styles.goalCategory, cardShell.goalCluster]}>
              <Text style={tText.goalCat}>🍎 Nutrition</Text>
              <ProgressBar
                current={Math.round(dailyTotals.calories)}
                target={dailyGoals.calories}
                label="Calories"
                color="#FF6B6B"
                theme={theme}
              />
              <ProgressBar
                current={Math.round(dailyTotals.protein)}
                target={dailyGoals.protein}
                label="Protein (g)"
                color="#3498DB"
                theme={theme}
              />
              <ProgressBar
                current={Math.round(dailyTotals.carbohydrates)}
                target={dailyGoals.carbohydrates}
                label="Carbs (g)"
                color="#F39C12"
                theme={theme}
              />
              <ProgressBar
                current={Math.round(dailyTotals.fat)}
                target={dailyGoals.fat}
                label="Fat (g)"
                color="#1ABC9C"
                theme={theme}
              />
            </View>
          </View>
        </View>

        {/* Motivational Quote */}
        <View style={[styles.quoteContainer, cardShell.quote]}>
          <Text style={tText.quote}>{getMotivationalQuote()}</Text>
        </View>
      </Animated.ScrollView>
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
    marginTop: 10,
    fontSize: 16,
    color: '#7F8C8D',
  },
  header: {
    padding: 20,
    marginBottom: 10,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    backgroundColor: 'transparent',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  headerRightCluster: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {fontSize: 24, fontWeight: 'bold'},
  date: {
    fontSize: 14,
    marginTop: 4,
  },
  welcomeBanner: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  welcomeBannerText: {
    fontSize: 16,
    fontWeight: '700',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  avatarHeaderSpacing: {marginLeft: 12},
  avatarGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffecd2',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  statsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  // Custom circular stats styles
  customCircularContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  customCircularCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 3,
  },
  customCircleBackground: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 2,
  },
  customSection: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  customSectionContent: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  customSectionIcon: {
    fontSize: 24,
    marginTop: 4,
  },
  customSectionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
  },
  customSectionUnit: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
  },
  customSectionLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
  },
  customSectionPercent: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
    marginBottom: 4,
  },
  customCenterCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 3,
  },
  customCenterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  customCenterSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  customCenterPercent: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  progressSectionBelow: {
    marginTop: 20,
    paddingHorizontal: 20,
    width: '100%',
  },
  progressSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
    textAlign: 'center',
  },
  statCardContainer: {
    width: (width - 40) / 2 - 5,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  statCard: {
    borderRadius: 15,
    padding: 15,
    minHeight: 120,
  },
  statCardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  statUnit: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 4,
    fontWeight: '500',
  },
  statTitle: {
    fontSize: 11,
    color: '#7F8C8D',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressSection: {
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
    marginBottom: 15,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressText: {
    fontSize: 15,
    fontWeight: '600',
  },
  progressBar: {
    height: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progressGlow: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderRadius: 10,
    opacity: 0.2,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'right',
  },
  goalsSection: {
    margin: 10,
    borderRadius: 20,
    padding: 24,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
  },
  goalsContainer: {
    gap: 20,
  },
  goalCategory: {
    borderRadius: 16,
    padding: 18,
    gap: 14,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  goalCategoryTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  quickActionsSection: {
    margin: 10,
    borderRadius: 12,
    padding: 20,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionContainer: {
    width: '48%',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 10,
  },
  quickAction: {
    height: 90,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  quickActionIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  quickActionIcon: {
    fontSize: 18,
  },
  quickActionText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
    letterSpacing: 0.5,
  },
  quoteContainer: {
    margin: 10,
    borderRadius: 20,
    padding: 25,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  quoteText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
    fontWeight: '500',
  },
  weeklySection: {
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
  weeklyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weekDay: {
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  weekDayIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  weekDayActive: {
    backgroundColor: '#4ECDC4',
  },
  weekDayInactive: {
    backgroundColor: '#E0E0E0',
  },
});

export default DashboardScreen;
