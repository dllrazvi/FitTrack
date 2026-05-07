import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
  TextInput,
  Animated,
  Image,
} from 'react-native';
import Svg, {ClipPath, Defs, Ellipse, G, Path, Rect} from 'react-native-svg';
import {useWorkout} from '../../../../src/contexts/WorkoutContext';
import {getAuth, onAuthStateChanged} from '@react-native-firebase/auth';
import {
  fetchMuscleWikiExercisesForCatalog,
  fetchMuscleWikiRoutinesForCatalog,
  fetchWgerExercisesForCatalog,
  hasMuscleWikiApiKey,
} from '../../../../src/services/wgerExerciseCatalog';
import {
  subscribeUserRoutines,
  createUserRoutine,
  deleteUserRoutine,
  loadWeeklyPlanner,
  saveWeeklyPlanner,
  type FirestoreRoutine,
} from '../../../../src/services/userWorkoutFirestore';
import {resolveStackBack} from './stackBackHelper';
import {useScreenTopInset} from './useScreenTopInset';
import {
  useNotificationInbox,
  NotificationBellIcon,
} from '../../../../src/contexts/NotificationInboxContext';
import {useTheme} from '../../../../src/contexts/ThemeContext';
import type {Theme} from '../../../../src/contexts/ThemeContext';
import {createWorkoutScreenStyles} from '../../../../src/theme/workoutScreenStyles';

const firebaseAuth = getAuth();

const {width} = Dimensions.get('window');

const getLocalYmd = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;

const getStartOfWeekMonday = (d = new Date()) => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  const day = copy.getDay(); // Sun=0
  const diffToMonday = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diffToMonday);
  return copy;
};

type RoutineDifficulty = 'beginner' | 'intermediate' | 'advanced';

type ScreenExercise = {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: RoutineDifficulty;
  instructions: string[];
  sets: number;
  reps: number;
  restTime: number;
  caloriesPerMinute: number;
  imageUrl?: string | null;
  videoUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type ScreenWorkoutRoutine = {
  id: string;
  name: string;
  description: string;
  exercises: string[];
  duration: number;
  difficulty: RoutineDifficulty;
  caloriesBurned: number;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

function normalizeExerciseForCatalog(
  ex: Partial<ScreenExercise> & {id?: string; name?: string},
  idx: number,
): ScreenExercise {
  const rawId =
    typeof ex.id === 'string' && ex.id.trim().length > 0
      ? ex.id.trim()
      : `fetched-${idx}`;
  const normalizedId = rawId.startsWith('wger-') ? rawId : `wger-${rawId}`;
  return {
    id: normalizedId,
    name: ex.name || 'Exercise',
    description: ex.description || 'No description available.',
    muscleGroups: Array.isArray(ex.muscleGroups) ? ex.muscleGroups : ['general'],
    equipment:
      typeof ex.equipment === 'string'
        ? ex.equipment
        : Array.isArray(ex.equipment)
        ? ex.equipment[0] || 'bodyweight'
        : 'bodyweight',
    difficulty:
      ex.difficulty === 'beginner' ||
      ex.difficulty === 'intermediate' ||
      ex.difficulty === 'advanced'
        ? ex.difficulty
        : 'beginner',
    instructions:
      Array.isArray(ex.instructions) && ex.instructions.length > 0
        ? ex.instructions
        : ['Follow the movement with controlled form.'],
    sets: typeof ex.sets === 'number' ? ex.sets : 3,
    reps: typeof ex.reps === 'number' ? ex.reps : 10,
    restTime: typeof ex.restTime === 'number' ? ex.restTime : 60,
    caloriesPerMinute:
      typeof ex.caloriesPerMinute === 'number' ? ex.caloriesPerMinute : 7,
    imageUrl: ex.imageUrl ?? null,
    videoUrl: ex.videoUrl ?? null,
    createdAt: ex.createdAt || new Date(),
    updatedAt: ex.updatedAt || new Date(),
  };
}

// Animated Progress Circle Component
const ProgressCircle = ({
  size = 80,
  progress = 0,
  color = '#4ECDC4',
  label = '',
  value = '',
}: any) => {
  const {theme} = useTheme();
  const c = theme.colors;
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const circleSize = size;
  const strokeWidth = 8;

  useEffect(() => {
    Animated.spring(animatedProgress, {
      toValue: progress,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [progress, animatedProgress]);

  return (
    <View style={{alignItems: 'center', margin: 10}}>
      <View
        style={{
          width: circleSize,
          height: circleSize,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            position: 'absolute',
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            borderWidth: strokeWidth,
            borderColor: c.border,
          }}
        />
        <Animated.View
          style={{
            position: 'absolute',
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            borderWidth: strokeWidth,
            borderColor: color,
            borderTopColor: 'transparent',
            borderRightColor: 'transparent',
            transform: [
              {
                rotate: animatedProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
        />
        <Text style={{fontSize: 16, fontWeight: 'bold', color: c.text}}>
          {value}
        </Text>
      </View>
      <Text style={{fontSize: 12, color: c.textSecondary, marginTop: 8}}>
        {label}
      </Text>
    </View>
  );
};

// Calendar Day Component
const CalendarDay = ({
  day,
  hasWorkout,
  isToday,
  isFuture,
  onPress,
  theme,
}: {
  day: string;
  hasWorkout: boolean;
  isToday: boolean;
  isFuture: boolean;
  onPress: () => void;
  theme: Theme;
}) => {
  const c = theme.colors;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} disabled={isFuture}>
      <Animated.View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: hasWorkout ? '#4ECDC4' : c.surface,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 5,
          borderWidth: isToday ? 3 : 0,
          borderColor: c.error,
          transform: [{scale: scaleAnim}],
          opacity: isFuture ? 0.45 : 1,
        }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: isToday ? 'bold' : '500',
            color: hasWorkout ? c.buttonText : c.textSecondary,
          }}>
          {day}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Animated History Card Component
const AnimatedHistoryCard = ({workout, index, theme}: any) => {
  const c = (theme as Theme).colors;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{translateX: slideAnim}],
        backgroundColor: c.surface,
        borderRadius: 16,
        padding: 18,
        marginBottom: 12,
        borderLeftWidth: 5,
        borderLeftColor: '#4ECDC4',
        shadowColor: c.shadow,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: c.border,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: c.text}}>
          {workout.routineName}
        </Text>
        <Text style={{fontSize: 12, color: c.textSecondary}}>
          {workout.date}
        </Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: '#4ECDC4'}}>
            {workout.duration}
          </Text>
          <Text style={{fontSize: 11, color: c.textSecondary}}>minutes</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: '#FF6B6B'}}>
            {workout.caloriesBurned}
          </Text>
          <Text style={{fontSize: 11, color: c.textSecondary}}>calories</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: '#F39C12'}}>
            {workout.exercisesCompleted}
          </Text>
          <Text style={{fontSize: 11, color: c.textSecondary}}>exercises</Text>
        </View>
      </View>
    </Animated.View>
  );
};

type MuscleGroupOption = {
  key: string;
  label: string;
  emoji: string;
  keywords: string[];
  bodyView: 'front' | 'back' | 'both';
};

const MUSCLE_GROUP_OPTIONS: MuscleGroupOption[] = [
  {key: 'chest', label: 'Chest', emoji: '💪', keywords: ['chest', 'pectoral', 'pec'], bodyView: 'front'},
  {key: 'lats', label: 'Lats', emoji: '🏋️', keywords: ['lat', 'lats', 'row', 'rhomboid', 'back'], bodyView: 'back'},
  {key: 'glutes', label: 'Glutes', emoji: '🍑', keywords: ['glute', 'glutes', 'hip thrust', 'bridge'], bodyView: 'back'},
  {key: 'lowerback', label: 'Lower Back', emoji: '🧱', keywords: ['lower back', 'erector', 'spinal', 'back extension'], bodyView: 'back'},
  {key: 'traps', label: 'Traps', emoji: '🧱', keywords: ['trap', 'trapez'], bodyView: 'back'},
  {key: 'trapsmiddle', label: 'Middle Traps', emoji: '🧱', keywords: ['middle trap', 'mid trap', 'trapezius middle', 'trap'], bodyView: 'back'},
  {key: 'shoulders', label: 'Shoulders', emoji: '🏋️', keywords: ['shoulder', 'deltoid'], bodyView: 'both'},
  {key: 'biceps', label: 'Biceps', emoji: '💪', keywords: ['bicep', 'biceps', 'curl'], bodyView: 'front'},
  {key: 'triceps', label: 'Triceps', emoji: '🦾', keywords: ['tricep', 'triceps', 'dip', 'pushdown'], bodyView: 'back'},
  {key: 'forearms', label: 'Forearms', emoji: '✊', keywords: ['forearm', 'wrist', 'grip'], bodyView: 'both'},
  {key: 'hamstrings', label: 'Hamstrings', emoji: '🦵', keywords: ['hamstring', 'romanian deadlift', 'rdl', 'leg curl'], bodyView: 'back'},
  {key: 'quadriceps', label: 'Quadriceps', emoji: '🦵', keywords: ['quadricep', 'quad', 'leg extension', 'squat', 'step-up'], bodyView: 'front'},
  {key: 'calves', label: 'Calves', emoji: '🦵', keywords: ['calf', 'calves'], bodyView: 'both'},
  {key: 'core', label: 'Core/Abs', emoji: '🔥', keywords: ['core', 'ab', 'abs', 'abdominal', 'plank', 'crunch'], bodyView: 'front'},
  {key: 'obliques', label: 'Obliques', emoji: '🔥', keywords: ['oblique', 'side abs', 'core'], bodyView: 'front'},
];

type BodyZone = {
  key: string;
  kind: 'ellipse' | 'rect' | 'path';
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  d?: string;
  transform?: string;
};

const MUSCLEWIKI_TRANSFORM = 'translate(28, 8) scale(0.24)';

const BODY_ZONE_LAYOUT: Record<
  'front' | 'back',
  BodyZone[]
> = {
  front: [
    {
      key: 'shoulders',
      kind: 'path',
      transform: MUSCLEWIKI_TRANSFORM,
      d: 'M510.6,303.91c-1.61-.91-3.25-1.75-4.94-2.53-7.64-3.49-14.56-4.88-19.19-5.42-7.44-1.87-13.18-4.12-16.62-6.5-12.81-8.87-22.9-20.97-27.79-26.83-4.59-5.52-7.95-10.07-10.92-14.08-6.46-8.74-11.12-15.05-22.12-22.2-5.2-3.37-11.11-5.94-15.09-7.49,8.34-2.74,26.96-7.7,44.59-4.11.97.24,1.99.51,3.04.78,1.25.32,2.34.6,3.08.8.34.09.84.17,1.59.3,32.54,5.37,45.89,28.26,51.36,46.48.75,2.74,1.56,4.76,2.58,7.33,2.02,5.07,5.06,12.69,10.42,33.46Z',
    },
    {
      key: 'shoulders',
      kind: 'path',
      transform: MUSCLEWIKI_TRANSFORM,
      d: 'M266.59,218.87c-3.98,1.55-9.89,4.12-15.09,7.49-10.99,7.14-15.66,13.45-22.12,22.2-2.97,4.01-6.33,8.57-10.96,14.13-4.84,5.81-14.94,17.91-27.76,26.79-3.42,2.39-9.16,4.62-16.62,6.5,0,0-.03,0-.03,0-2.75.32-6.31.94-10.34,2.14-.11.03-.21.06-.32.1-2.66.79-5.53,1.83-8.5,3.18-1.69.77-3.34,1.62-4.95,2.53,5.37-20.76,8.41-28.39,10.43-33.47,1.02-2.56,1.82-4.59,2.57-7.29,5.48-18.25,18.83-41.15,51.37-46.52.75-.12,1.25-.21,1.59-.3.74-.2,1.83-.48,3.09-.8,1.06-.27,2.08-.53,3.06-.79.02,0,.04-.02.07-.02,17.61-3.55,36.17,1.39,44.49,4.14Z',
    },
    {
      key: 'chest',
      kind: 'path',
      transform: MUSCLEWIKI_TRANSFORM,
      d: 'M473.89,295.55c-14.9.39-23.27,9.22-29.96,17.52-.93,1.15-1.89,2.26-2.88,3.34-.09.06-.16.13-.23.22-.15.17-.28.32-.44.49-18.16,19.25-45.55,26.23-69.71,17.75-1.63-.69-3.27-1.34-4.89-1.95-9.36-4.2-17.52-10.41-24.23-18.47-6.08-7.31-9.44-16.78-9.44-26.7v-49.81c0-.72.19-17.59,26.62-20.16,15.4-1.49,24.1,1.14,28.77,2.55.26.08.5.16.74.22.04.02.09.04.12.04,0,0,.03,0,.03,0h.02c.05.02.1.04.15.05.17.06.36.12.54.17,2.64.92,11.16,4,18.08,8.5,10.48,6.8,14.75,12.59,21.23,21.35,2.99,4.06,6.39,8.65,11.08,14.28,4.95,5.94,15.25,18.28,28.44,27.42,1.61,1.12,3.6,2.19,5.96,3.18Z',
    },
    {
      key: 'chest',
      kind: 'path',
      transform: MUSCLEWIKI_TRANSFORM,
      d: 'M328.4,237.95v49.79c0,9.9-3.35,19.39-9.44,26.7-6.71,8.06-14.87,14.27-24.23,18.47-1.62.61-3.25,1.26-4.87,1.94-24.1,8.48-51.46,1.55-69.61-17.62-.19-.2-.37-.41-.55-.61-.08-.09-.15-.16-.24-.22-.98-1.08-1.94-2.19-2.87-3.34-6.69-8.3-15.07-17.13-29.96-17.52,2.36-1,4.35-2.06,5.95-3.18,13.19-9.14,23.49-21.48,28.48-27.46,4.65-5.59,8.04-10.18,11.04-14.24,6.48-8.76,10.75-14.55,21.23-21.35,6.92-4.49,15.44-7.58,18.08-8.5.18-.05.36-.11.54-.17.05,0,.1-.03.15-.05.03,0,.07-.02.09-.03.03,0,.06,0,.09-.03h0c.23-.06.48-.14.73-.22,4.66-1.42,13.36-4.05,28.77-2.55,26.44,2.57,26.63,19.44,26.62,20.19Z',
    },
    {
      key: 'biceps',
      kind: 'path',
      transform: MUSCLEWIKI_TRANSFORM,
      d: 'M535.68,414.61c-8.57,4.33-23.53,1.71-39.79-18.59-.02-.02-.03-.04-.05-.06-9.71-13.16-19.05-25.49-21.34-27.65-.5-.47-1.05-.99-1.66-1.54-4.5-4.14-11.31-10.39-15.31-20.4-.14-.35-.37-.62-.67-.8,0,0,0,0,0,0-.86-2.84-1.54-5.75-2.01-8.66-1.1-6.96-4.03-25.45,5.81-33.63,5.53-4.61,13.2-4.37,21.33-4.14.92.03,2.27.1,3.94.29,0,0,.03,0,.03,0,.04,0,.09.02.13.02.02,0,.03,0,.05,0,.03,0,.06,0,.09,0,2.54.31,5.82.88,9.54,1.98,0,0,0,0,.02,0,.14.06.29.11.45.12.02,0,.03,0,.03,0,2.49.75,5.18,1.73,7.97,3.01,3.26,1.5,6.39,3.29,9.32,5.29.45.54.96,1.08,1.5,1.67,2.81,3.02,7.61,8.17,16.01,24.38,0,.02.02.03.02.04,0,0,0,.02.02.03,25.45,57.59,13.79,73.98,4.57,78.62Z',
    },
    {
      key: 'biceps',
      kind: 'path',
      transform: MUSCLEWIKI_TRANSFORM,
      d: 'M205.61,336.89c-.47,2.92-1.15,5.82-2.01,8.66-.3.19-.54.47-.68.82-4,10-10.81,16.26-15.31,20.4-.61.55-1.16,1.07-1.66,1.54-2.28,2.16-11.63,14.49-21.34,27.65-.02.02-.03.04-.05.06-16.26,20.3-31.21,22.91-39.79,18.59-9.21-4.64-20.86-21.02,4.53-78.53,0,0,0,0,0-.02l.03-.05c8.42-16.29,13.23-21.44,16.04-24.47.55-.59,1.05-1.13,1.51-1.68,2.92-2,6.05-3.78,9.3-5.27,2.82-1.29,5.55-2.28,8.08-3.03.11-.04.23-.07.35-.11,0,0,.02,0,.03,0,3.72-1.08,7.02-1.67,9.57-1.98.03,0,.07,0,.1,0h.02c.05,0,.11,0,.16-.02.02,0,.03,0,.04,0h0c1.67-.19,2.99-.26,3.91-.29,8.13-.24,15.8-.47,21.33,4.14,9.84,8.18,6.91,26.67,5.81,33.62Z',
    },
    {
      key: 'forearms',
      kind: 'path',
      transform: MUSCLEWIKI_TRANSFORM,
      d: 'M629.69,522.22c-1.13,6.78-4.65,12.42-9.28,14.77-4.03,2.05-9.46,1.91-15.01-.38-2.21-4.21-5.19-8.37-6.61-10.26-.04-.04-.08-.1-.13-.14-8.02-8.58-14.46-13.59-20.69-18.45-8.62-6.72-16.75-13.06-28.61-28.19-12.92-16.47-16.63-24.46-20.56-32.91-2.42-5.19-4.92-10.57-9.56-18.2-.02-.03-.03-.05-.05-.08-2.17-3.18-6.32-8.99-11.24-15.81,7.32,5.22,14.13,7.31,19.91,7.31,3.54,0,6.69-.78,9.33-2.12,5.52-2.78,12.21-9.26,12.71-24.32.21-6.44-.72-13.94-2.78-22.46.3.72.6,1.44.91,2.18,2.49,6.15,5.69,9.56,11.5,15.77,4.14,4.41,9.81,10.46,17.68,20.13,13.13,16.15,26.59,50.24,37.42,77.64,4.49,11.37,8.74,22.12,12.4,30.19.02.04.03.08.05.11.97,1.78,1.83,3.52,2.62,5.24Z',
    },
    {
      key: 'forearms',
      kind: 'path',
      transform: MUSCLEWIKI_TRANSFORM,
      d: 'M152.48,412.57c-4.91,6.81-9.05,12.62-11.22,15.8-.02.03-.03.05-.05.08-4.64,7.64-7.14,13.01-9.56,18.2-3.93,8.45-7.64,16.44-20.56,32.91-11.86,15.13-20,21.47-28.61,28.19-6.23,4.86-12.66,9.88-20.69,18.45-.04.04-.09.1-.13.14-1.41,1.89-4.39,6.04-6.6,10.26-5.54,2.29-10.98,2.44-15.02.38-4.63-2.35-8.15-7.98-9.28-14.77.79-1.71,1.65-3.45,2.62-5.24.02-.04.04-.08.06-.11,3.65-8.06,7.9-18.81,12.39-30.19,10.82-27.4,24.28-61.49,37.42-77.64,7.86-9.67,13.54-15.72,17.68-20.13,5.81-6.21,9.02-9.63,11.5-15.75.3-.71.58-1.41.88-2.1-2.04,8.48-2.96,15.95-2.75,22.36.49,15.06,7.18,21.54,12.7,24.32,2.64,1.34,5.79,2.12,9.33,2.12,5.77,0,12.57-2.09,19.88-7.29Z',
    },
    {
      key: 'core',
      kind: 'path',
      transform: MUSCLEWIKI_TRANSFORM,
      d: 'M385.82,350.44c-2.32-5.36-9.35-9.32-16.39-12.32-.03-.02-.05-.03-.08-.03-1.6-.57-3.18-1.2-4.75-1.9-.03,0-.06-.02-.09-.04-10.51-3.96-23.74-6.74-29.44-2.69-1.99,1.42-2.95,3.62-2.95,6.73,0,.97-.77,1.75-1.71,1.75-.06,0-.12,0-.17,0-.06,0-.12,0-.18,0-.94,0-1.71-.78-1.71-1.75,0-3.11-.97-5.32-2.95-6.73-5.7-4.06-18.93-1.27-29.44,2.69-.03.02-.06.03-.09.04-1.57.7-3.15,1.33-4.75,1.9-.03.02-.07.03-.11.04-7.03,3-14.03,6.96-16.36,12.31-1.47,3.38-.66,6.05.81,10.88,1.22,4.02,2.84,9.3,3.56,17.09,0,0,0,.03,0,.04.11.8.17,1.63.21,2.49.03.67.08,1.35.1,2.06.1,2.61.04,3.85-.03,5.54-.09,1.82-.21,4.31-.15,9.95.09,11.41,2.3,60.52,4.34,93.24,3.28,52.64,34.75,92.8,46.58,92.8.06,0,.12,0,.18,0,.05,0,.11,0,.17,0,11.83,0,43.3-40.16,46.58-92.8,2.05-32.73,4.24-81.84,4.34-93.24.05-5.64-.07-8.13-.15-9.95-.08-1.7-.14-2.93-.03-5.54.03-.71.07-1.39.1-2.06.03-.87.09-1.7.21-2.49,0-.02,0-.04,0-.04.73-7.79,2.34-13.07,3.56-17.09,1.47-4.83,2.28-7.5.81-10.88Z',
    },
    {
      key: 'obliques',
      kind: 'path',
      transform: MUSCLEWIKI_TRANSFORM,
      d: 'M272.8,406.06c-2.74,15.58-5.85,33.23-3.49,49.66,4.83,33.57-6.55,48.85-11.65,53.86-6.22,6.09-16.8,8.99-26.23,7.31,1.27-10.42,2.32-20.17,2.91-27.28.42-5.01,1.09-10.04,1.79-15.35,2.58-19.47,5.24-39.6-4.39-59.14-19.23-37.82-24.33-61.62-25.32-67.11,1.13-3.44,1.99-6.98,2.58-10.55.92-5.82,3.02-19.11-1.38-29.2,2.28,2.19,4.33,4.6,6.29,7.03,1.18,1.46,2.4,2.87,3.68,4.21,10.16,11.56,22.09,22.06,32.62,31.32,13.18,11.59,24.56,21.61,25.39,27.78,0,.05.02.11.02.16.08.83.15,1.69.2,2.58,0,.06,0,.12,0,.19.18,6.35-1.32,14.88-3.02,24.53Z',
    },
    {
      key: 'obliques',
      kind: 'path',
      transform: MUSCLEWIKI_TRANSFORM,
      d: 'M426.13,489.61c.6,7.11,1.65,16.86,2.91,27.28-9.43,1.68-20.01-1.22-26.23-7.31-5.11-5.01-16.47-20.29-11.65-53.86,2.36-16.44-.74-34.09-3.49-49.66-1.7-9.65-3.2-18.18-3.02-24.53,0-.07,0-.13,0-.19.05-.89.12-1.75.2-2.58,0-.05,0-.11.02-.16.84-6.17,12.22-16.19,25.39-27.78,10.5-9.23,22.37-19.69,32.5-31.19,1.33-1.39,2.59-2.83,3.81-4.34,1.96-2.42,4-4.83,6.27-7.02-4.4,10.09-2.29,23.37-1.36,29.19.57,3.57,1.44,7.12,2.58,10.57-1,5.53-6.13,29.33-25.33,67.12-9.62,19.52-6.96,39.65-4.38,59.11.7,5.32,1.37,10.34,1.79,15.35Z',
    },
    {
      key: 'quadriceps',
      kind: 'path',
      transform: MUSCLEWIKI_TRANSFORM,
      d: 'M452.4,783.8s0,.06-.02.09c0,.02,0,.04,0,.06-.8,3.72-1.52,7.5-2.22,11.15-3.01,15.71-5.86,30.55-13.07,34.21-2.93,1.49-6.55,1.09-11.09-1.18-2.16-1.08-4.06-1.25-5.66-.47-3.13,1.52-4.12,5.95-5.38,11.57-2.08,9.29-4.43,19.83-16.56,20.04h-.25c-22.01,0-29.18-50.54-29.24-51.05,0-.05-.02-.1-.03-.14-2.46-18.26-6.39-36.59-11.76-54.7-1.1-3.72-2.91-8.81-5.01-14.71-6.53-18.38-16.39-46.18-17.75-68.65-.11-3.62-.17-6.84-.23-9.67-.15-7.05-.24-11.52-.79-14.17,14.83-2.06,21.68-20.6,33.8-62.45,13.65-47.17,49.14-60.08,62.35-63.31,2.7,21.79,6.16,45.47,8.19,53.68.14.55.33,1.32.59,2.31,9.41,36.36,27.37,122.24,14.14,207.42Z',
    },
    {
      key: 'quadriceps',
      kind: 'path',
      transform: MUSCLEWIKI_TRANSFORM,
      d: 'M327.13,646.17c-.55,2.65-.64,7.12-.79,14.17-.05,2.83-.12,6.06-.22,9.62-1.36,22.53-11.23,50.32-17.75,68.7-2.1,5.9-3.9,11-5.01,14.71-5.37,18.13-9.32,36.48-11.77,54.76,0,.03-.02.05-.02.08-.08.52-7.24,51.05-29.25,51.05h-.25c-12.12-.21-14.48-10.74-16.56-20.04-1.26-5.61-2.25-10.04-5.38-11.57-1.59-.78-3.49-.61-5.66.47-4.54,2.27-8.16,2.66-11.09,1.18-7.21-3.66-10.06-18.5-13.07-34.21-.71-3.71-1.44-7.54-2.26-11.3v-.03c-13.22-85.17,4.75-171.04,14.15-207.39.26-.99.45-1.76.59-2.31,2.03-8.2,5.5-31.89,8.2-53.68,13.22,3.23,48.69,16.15,62.34,63.31,12.12,41.86,18.97,60.39,33.8,62.45Z',
    },
    {
      key: 'calves',
      kind: 'path',
      transform: MUSCLEWIKI_TRANSFORM,
      d: 'M502.8,1183.5c-.68,1.05-1.86,1.29-2.74,1.31-.93.02-1.69.81-1.69,1.77,0,.38-.14,1.54-.78,2.18-.39.38-.97.56-1.75.53-.8-.04-1.51.52-1.72,1.32,0,.03-.6,2.33-2.27,3.3-.86.51-1.88.59-3.12.24-.69-.19-1.44.07-1.86.67-.02.03-1.86,2.61-4.39,2.9-1.39.17-2.76-.38-4.19-1.68-.68-.62-1.71-.58-2.35.08-.04.04-4.49,4.53-10.15,3.77-4.52-.61-8.73-4.34-12.51-11.09-.21-.39-.58-.69-1.02-.81-.57-.17-14.2-4.29-13.15-17.37.18-5.53-4.76-8.41-11.01-12.05l-.97-.57c-5.92-3.45-9.83-5.73-6.12-27.69.89-7.14-.42-14.69-.48-15-.11-.62-.33-1.05-.9-1.25-.42-.36-3.52-3.52-2.29-17.55,1.51-17.34,2.94-33.72-17.75-101.36-1.11-3.85-2.68-6.08-4.18-8.24-4.08-5.83-8.31-11.86-2.32-56.42,2.35-21.34,3.14-29.8,2.5-34.69,6.67,6.59,14.23,10.26,21.63,10.26h.34c8.38-.13,15.5-4.85,20.06-13.29,4.38-8.1,7.01-11.48,12.38-13.17.31.97.72,2.16,1.23,3.63,5.67,16.3,20.73,59.59,8.3,131.92,0,.05,0,.1-.02.15-.7,7.93-1.67,16.17-2.6,24.14-2.43,20.85-4.73,40.55-2.42,53.28,1.72,10.5,2.43,14.98,2.6,20.5,0,.15.03.3.07.45,1.34,4.55,8.23,15.73,12.79,23.12,1.33,2.14,2.46,4,3.13,5.14.8,1.37,1.22,2.38,1.59,3.25,1.09,2.59,1.89,4.14,6.89,8.26.9.74,1.83,1.49,2.8,2.26,6.46,5.2,13.78,11.1,17.75,20.07,1.41,3.47,1.65,6.21.69,7.71Z',
    },
    {
      key: 'calves',
      kind: 'path',
      transform: MUSCLEWIKI_TRANSFORM,
      d: 'M265.06,986.92c-1.51,2.16-3.08,4.4-4.18,8.22-20.71,67.67-19.28,84.05-17.76,101.38,1.22,14.03-1.87,17.2-2.29,17.55-.56.2-.79.63-.9,1.25-.05.31-1.37,7.86-.47,15.08,3.7,21.87-.21,24.15-6.13,27.61l-.98.57c-6.25,3.64-11.18,6.51-10.99,12.13,1.04,12.99-12.58,17.12-13.16,17.28-.44.12-.8.42-1.02.81-3.78,6.75-7.99,10.47-12.51,11.09-5.67.76-10.1-3.72-10.15-3.77-.63-.66-1.67-.7-2.35-.08-1.42,1.29-2.8,1.84-4.18,1.68-2.53-.29-4.39-2.88-4.41-2.9-.42-.6-1.15-.87-1.85-.67-1.25.35-2.28.27-3.13-.24-1.67-.98-2.27-3.28-2.27-3.3-.2-.8-.91-1.36-1.72-1.33-.79.03-1.36-.15-1.75-.53-.64-.64-.78-1.79-.78-2.17,0-.96-.74-1.76-1.68-1.77-.88-.02-2.07-.26-2.75-1.31-.96-1.5-.72-4.24.67-7.66,4-9.02,11.31-14.92,17.78-20.12.96-.77,1.89-1.52,2.79-2.26,5-4.13,5.8-5.67,6.89-8.26.37-.88.79-1.88,1.59-3.25.67-1.15,1.81-2.99,3.12-5.13,4.56-7.4,11.46-18.58,12.8-23.13.04-.15.07-.3.07-.45.17-5.52.88-10,2.6-20.47,2.31-12.77,0-32.47-2.42-53.32-.93-7.96-1.9-16.21-2.6-24.14,0-.05,0-.1-.02-.15-12.43-72.33,2.63-115.62,8.3-131.92.51-1.47.92-2.66,1.23-3.63,5.38,1.69,8,5.06,12.39,13.17,4.55,8.44,11.67,13.16,20.05,13.29h.35c7.39,0,14.95-3.67,21.62-10.27-.64,4.9.15,13.37,2.5,34.74,5.99,44.51,1.77,50.55-2.31,56.38Z',
    },
  ],
  back: [
    {key: 'traps', kind: 'path', transform: MUSCLEWIKI_TRANSFORM, d: 'M233.69,210.53c3.21-1.97,7.59-4.66,10.69-6.06,1.99-.9,6.6-2.81,11.49-4.84,5-2.07,10.45-4.34,14.44-6.07.04,0,.07,0,.11-.02,19.55-5.27,40.39-4.24,51.58-3.69,1.19.06,2.28.11,3.24.16,3.33.14,6.72.14,10.04,0,.96-.04,2.04-.1,3.23-.16,11.2-.55,32.03-1.58,51.58,3.69.04,0,.07.02.11.02,4,1.73,9.45,4,14.45,6.07,4.89,2.03,9.5,3.94,11.49,4.84,3.08,1.4,7.48,4.09,10.69,6.06.06.04.12.08.19.11-16.13,2.35-25.59,11.71-30.85,17.43h0s-.02.03-.02.04c-.36.39-.71.77-1.03,1.12l-.53.58-.04.04c-6.7,7.33-11.8,6.41-24.14,4.2-9.02-1.62-21.37-3.83-40.14-3.83s-31.12,2.21-40.14,3.83c-12.33,2.21-17.44,3.12-24.14-4.2-.02-.02-.03-.04-.04-.04l-.52-.58c-5-5.5-14.62-16.06-31.89-18.59.05-.04.11-.08.18-.11Z'},
    {key: 'trapsmiddle', kind: 'path', transform: MUSCLEWIKI_TRANSFORM, d: 'M390.36,237.49c-18.28,34.34-29.74,61.7-37.49,82.12,0,0,0,.03-.02.04,0,.04-.03.06-.04.1-1.22,3-2.31,5.9-3.25,8.73-.03.04-.04.09-.05.13-1.56,4.29-2.96,8.2-4.22,11.72-6.56,18.38-9.85,27.6-15.04,27.6s-8.48-9.22-15.04-27.6c-1.26-3.52-2.65-7.43-4.22-11.72,0-.04-.03-.09-.05-.13-.95-2.83-2.03-5.73-3.25-8.73,0-.04-.03-.06-.04-.1,0,0,0-.03-.02-.04-7.76-20.42-19.22-47.78-37.5-82.12,2.48,1.17,5.04,1.63,7.88,1.63,3.63,0,7.73-.73,12.72-1.63,8.88-1.59,21.05-3.78,39.5-3.78s30.63,2.19,39.51,3.78c4.99.89,9.09,1.63,12.72,1.63,2.84,0,5.39-.45,7.88-1.63Z'},
    {key: 'shoulders', kind: 'path', transform: MUSCLEWIKI_TRANSFORM, d: 'M511.59,288.79c-3.24-2.06-8.25-4.62-13.43-4.9-.56-.04-1.2-.06-1.91-.09-6.97-.31-21.03-.93-34.55-7.07-4.38-1.99-8.7-4.55-12.71-7.89-6.97-5.78-13.74-10.96-20.27-15.97-10.06-7.72-19.59-15.02-28.81-23.66,6.14-6.45,17.33-16.23,36.59-15.6h.02c.17,0,16.25,1.4,33.54,11.85,15.31,9.27,34.65,27.7,41.54,63.32Z'},
    {key: 'shoulders', kind: 'path', transform: MUSCLEWIKI_TRANSFORM, d: 'M260.61,229.21c-9.23,8.65-18.75,15.95-28.81,23.66-6.54,5.01-13.29,10.19-20.27,15.97-4,3.33-8.34,5.89-12.71,7.89-13.52,6.15-27.58,6.76-34.55,7.07-.71.03-1.35.05-1.92.09-5.18.27-10.19,2.84-13.43,4.9,6.9-35.62,26.23-54.06,41.55-63.33,17.29-10.46,33.37-11.85,33.53-11.85h.02c19.28-.62,30.45,9.14,36.6,15.6Z'},
    {key: 'lats', kind: 'path', transform: MUSCLEWIKI_TRANSFORM, d: 'M460.55,310.16c-2.47,11.73-4.81,22.83-1.44,29.18-1.15,5.04-8.99,38.57-20.51,56.67-11.74,18.46-11.85,45.39-11.92,59.85,0,1.61-.02,3.08-.04,4.39-.2,12.91,3.54,55.42,9.02,78.37-9.26-12.73-27.37-23.51-39.84-28.45h0c-.68-.32-1.38-.62-2.1-.92h0c-12.29-5.86-11.8-17.54-11.17-32.16.52-12.39,1.11-26.43-6.06-39.94-27.18-51.29-34.71-74.09-23.78-106.94.02-.04.03-.1.05-.15,1.04-2.86,2.17-5.89,3.39-9.09,8.26-21.71,20.7-51.34,41.17-88.91l.23-.25c9.33,8.75,18.9,16.09,29.02,23.85,6.51,4.99,13.24,10.15,20.16,15.89,4.25,3.52,8.81,6.24,13.42,8.35,0,0,.02,0,.02,0,5.96,3.89,3.13,17.3.4,30.26Z'},
    {key: 'lats', kind: 'path', transform: MUSCLEWIKI_TRANSFORM, d: 'M284.03,437.14c-7.16,13.52-6.57,27.55-6.05,39.94.62,14.65,1.11,26.36-11.25,32.19,0,0-.03,0-.04.02-.65.26-1.29.54-1.9.82,0,0-.02,0-.03,0-12.47,4.94-30.64,15.74-39.91,28.5,5.46-22.96,9.21-65.46,9.01-78.37-.02-1.31-.03-2.79-.04-4.4-.06-14.46-.18-41.38-11.92-59.84-11.52-18.1-19.37-51.63-20.51-56.67,3.37-6.35,1.03-17.45-1.44-29.18-2.75-12.99-5.57-26.43.43-30.29,0,0,0,0,0,0,4.6-2.1,9.15-4.82,13.39-8.33,6.92-5.74,13.65-10.9,20.16-15.89,10.12-7.75,19.69-15.1,29.02-23.85l.23.25c23.51,43.19,36.45,75.86,44.59,98.11,0,.02.02.03.02.04,10.93,32.85,3.39,55.65-23.79,106.94Z'},
    {key: 'triceps', kind: 'path', transform: MUSCLEWIKI_TRANSFORM, d: 'M558.73,386.68c-1.2,1.24-4.96.14-8.28-.83-4.59-1.34-9.33-2.73-12.84-.57-3.41,2.1-3.73,7.68-4.08,13.59-.32,5.5-.68,11.73-3.7,12.96-2.65,1.08-9.14-.61-24.99-14.77h0s0-.02-.02-.03c-.02-.02-.03-.03-.04-.04-1.59-1.78-3.24-3.51-5.2-5.5-8.08-8.18-28.8-40.45-36.6-52.6l-.5-.76v-.02s0,0,0,0c0,0-.02-.03-.03-.04-3.09-5.07-.72-16.32,1.57-27.21,2.25-10.68,4.56-21.65,2.09-28.59,12.14,4.23,23.77,4.75,29.99,5.02.7.04,1.33.06,1.88.09,7.16.39,14.43,6.24,14.94,6.66t.02.02s0,0,.03.03c.87.75,22.04,19.45,29.55,45.42.02.09.05.17.09.24.26.57,6.42,13.93,10.73,21.4,1.4,2.41,2.1,5.09,2.81,7.9.04.15.07.3.11.45.57,2.27,1.18,4.68,2.17,7.14,0,0,0,0,0,.02,1.75,6.98,1.03,9.28.31,10.02Z'},
    {key: 'triceps', kind: 'path', transform: MUSCLEWIKI_TRANSFORM, d: 'M198.03,338.14l-.03.05h0s-.45.71-.45.71c-7.81,12.15-28.53,44.42-36.6,52.6-1.97,2-3.64,3.75-5.26,5.55h0s0,.02,0,.02c-15.85,14.14-22.34,15.83-24.98,14.76-3.02-1.22-3.39-7.46-3.7-12.96-.34-5.91-.67-11.49-4.07-13.59-3.52-2.16-8.27-.77-12.85.57-3.31.97-7.08,2.07-8.28.83-.73-.74-1.44-3.03.31-10.02,0,0,0,0,0-.02.99-2.47,1.59-4.87,2.17-7.14.75-2.99,1.45-5.8,2.93-8.35,4.31-7.47,10.47-20.83,10.73-21.4.04-.08.06-.16.09-.24,7.61-26.35,29.36-45.27,29.58-45.45,0,0,.03-.02.04-.04.67-.54,7.84-6.26,14.92-6.64.56-.03,1.18-.05,1.88-.09,6.22-.27,17.86-.79,29.99-5.03-2.47,6.94-.17,17.91,2.09,28.6,2.3,10.93,4.69,22.22,1.53,27.27Z'},
    {key: 'hamstrings', kind: 'path', transform: MUSCLEWIKI_TRANSFORM, d: 'M455.77,791.39c-1.19,6.38-2.58,12.65-4.21,18.78-.49,2.22-.72,4.55-.76,7-3.9,15.79-9.27,30.08-15.03,30.77-2.1.24-6.46-1.5-12.31-16.1-7.27-18.11-9.18-19.9-11.54-19.49-2.72.47-2.85,4.22-3.14,13.29-.44,13.91-1.19,37.18-14.61,37.18-11.9,0-19.74-20.05-27.07-69.19-.08-.49-.35-.91-.73-1.17-3.47-16.43-7.45-30.43-11.55-44.89-3.24-11.39-6.58-23.17-9.72-36.45-6.98-29.43-8.2-43.68-9.62-60.19-.39-4.47-.78-9.01-1.29-14.01.84,1.15,1.77,2.19,2.78,3.14,5.97,5.52,14.37,6.89,23.83,6.89,4.61,0,9.48-.33,14.43-.66,1.63-.11,3.27-.22,4.91-.31,8.79-.53,30.52-3.65,42.65-21.18,10.11-14.62,10.97-35.24,2.55-61.28-1.64-5.04-2.93-9.76-4.19-14.33-3.1-11.22-5.73-20.73-11.38-28.13,13.7,8.25,26.93,20.08,28.18,31.58v.04c.03,1.44-.05,2.61-.12,3.72-.28,4.27-.53,7.95,3.98,20.95,8.32,23.97,29.87,128.52,13.96,214.07Z'},
    {key: 'hamstrings', kind: 'path', transform: MUSCLEWIKI_TRANSFORM, d: 'M326.33,636.9c-.52,5.01-.91,9.56-1.29,14.02-1.41,16.5-2.63,30.76-9.62,60.2-3.15,13.28-6.49,25.05-9.72,36.45-4.1,14.46-8.08,28.46-11.55,44.89-.39.26-.66.68-.74,1.17-7.32,49.15-15.16,69.19-27.06,69.19-13.43,0-14.17-23.27-14.62-37.18-.29-9.07-.41-12.82-3.13-13.29-2.35-.4-4.26,1.38-11.54,19.49-5.85,14.59-10.22,16.36-12.31,16.1-5.75-.69-11.14-15.01-15.04-30.81-.05-2.47-.29-4.8-.78-7.05-1.61-6.06-2.99-12.27-4.16-18.58-.02-.06-.03-.13-.04-.19-15.89-85.48,5.65-190.03,13.97-214,4.51-13,4.27-16.68,3.99-20.95-.07-1.12-.15-2.29-.12-3.73v-.06c1.28-11.48,14.49-23.3,28.18-31.54-5.66,7.41-8.28,16.92-11.38,28.14-1.26,4.56-2.56,9.28-4.19,14.32-8.43,26.04-7.58,46.66,2.55,61.28,12.13,17.53,33.86,20.65,42.65,21.18,1.64.1,3.28.21,4.91.31,4.95.33,9.81.66,14.43.66,9.46,0,17.86-1.38,23.82-6.89,1.03-.94,1.95-1.99,2.79-3.16Z'},
    {key: 'glutes', kind: 'path', transform: MUSCLEWIKI_TRANSFORM, d: 'M419.87,622.8c-11.23,16.25-31.67,19.17-39.94,19.67-1.65.1-3.31.21-4.94.31-14.32.96-27.85,1.87-35.6-5.29-4.96-4.58-7.37-12.25-7.37-23.45v-60.34c0-17.89,5.12-30.73,15.2-38.16,11.92-8.78,28.54-8.24,40.1-4.82,1.86.55,3.58,1.15,5.18,1.81,0,0,.03,0,.04.02.55.22,1.08.45,1.6.69.03,0,.05.02.07.03,15.29,6.98,18.68,19.28,23.52,36.81,1.26,4.6,2.58,9.35,4.23,14.47,8.08,24.96,7.37,44.56-2.1,58.24Z'},
    {key: 'glutes', kind: 'path', transform: MUSCLEWIKI_TRANSFORM, d: 'M328.49,553.72v60.34c0,11.2-2.4,18.87-7.36,23.45-7.74,7.16-21.28,6.25-35.6,5.29-1.64-.11-3.29-.22-4.94-.31-8.27-.5-28.7-3.42-39.95-19.67-9.47-13.68-10.17-33.28-2.1-58.24,1.65-5.11,2.96-9.87,4.23-14.47,4.83-17.54,8.23-29.83,23.52-36.81h0c.59-.24,1.17-.48,1.71-.74,1.59-.66,3.31-1.25,5.15-1.8,11.57-3.43,28.18-3.96,40.11,4.82,10.09,7.43,15.2,20.26,15.2,38.16Z'},
    {key: 'lowerback', kind: 'path', transform: MUSCLEWIKI_TRANSFORM, d: 'M384.18,506.32c-12-2.59-27.49-2.09-39.07,6.44-7.44,5.48-12.42,13.54-14.86,24.07-2.44-10.53-7.42-18.59-14.86-24.07-11.58-8.53-27.07-9.03-39.06-6.44,6.12-7.5,5.66-18.21,5.19-29.38-.5-11.94-1.08-25.48,5.64-38.17,20.65-38.94,30.2-62.3,28.8-86.04,4.76,12.64,8.11,18.59,14.12,18.69.05,0,.12,0,.18,0s.12,0,.19,0c6.01-.11,9.36-6.07,14.13-18.71-1.42,23.73,8.13,47.1,28.78,86.06,6.73,12.68,6.15,26.23,5.65,38.17-.47,11.17-.93,21.88,5.19,29.38Z'},
    {key: 'forearms', kind: 'path', transform: MUSCLEWIKI_TRANSFORM, d: 'M641.37,536.12c-1.96,6.88-5.9,12.17-10.38,13.89-4.44,1.69-10.73.5-16.91-3.2-4.3-9.14-14.31-23.73-36.66-46.42-13.84-13.95-23.22-30.12-32.29-45.76-5.73-9.89-11.14-19.21-17.56-27.96l-.42-.57c-5.13-6.98-8.93-12.15-12-16.23,5.56,3.85,9.87,5.69,13.21,5.69,1.03,0,1.97-.17,2.82-.52,5.08-2.06,5.49-9.14,5.89-15.99.27-4.54.57-9.68,2.41-10.81,2.17-1.33,6.32-.12,9.98.95,4.49,1.31,9.14,2.67,11.84-.1,1.07-1.1,1.66-2.7,1.74-4.91.68.79,1.44,1.57,2.29,2.35,7.59,6.98,33.48,32.65,47.87,69.77,9.51,24.54,17.43,48.99,22.17,63.6,2.34,7.23,3.9,12.01,4.64,13.76.42.99.89,1.75,1.37,2.44Z'},
    {key: 'forearms', kind: 'path', transform: MUSCLEWIKI_TRANSFORM, d: 'M145.36,409.89c-3.07,4.07-6.87,9.25-11.99,16.22l-.42.57c-6.43,8.74-11.84,18.07-17.56,27.96-9.07,15.63-18.45,31.8-32.3,45.76-22.35,22.69-32.36,37.27-36.65,46.41-6.18,3.7-12.47,4.9-16.91,3.2-4.48-1.72-8.42-7.01-10.38-13.9.48-.69.95-1.45,1.37-2.43.74-1.75,2.29-6.53,4.63-13.76,4.74-14.61,12.67-39.06,22.18-63.6,14.39-37.11,40.27-62.78,47.87-69.77.85-.79,1.61-1.57,2.3-2.36.08,2.22.66,3.81,1.74,4.92,2.7,2.76,7.34,1.41,11.84.1,3.66-1.08,7.81-2.28,9.98-.95,1.85,1.14,2.15,6.28,2.4,10.81.4,6.85.81,13.93,5.9,15.99.85.34,1.79.52,2.81.52,3.34,0,7.65-1.84,13.2-5.68Z'},
    {
      key: 'calves',
      kind: 'path',
      transform: MUSCLEWIKI_TRANSFORM,
      d: 'M475.03,965.71v.08c-1.41,26.22-4.62,53.06-17.62,53.83-7.32.45-13.09-11.27-17.28-19.82-3.48-7.09-5.78-11.78-9.14-11.49-4.23.36-4.81,5.96-5.54,13.06-.9,8.78-2.02,19.7-10.11,21.38-3.17.66-12.83,2.66-21.97-20.97,0-.02,0-.04-.02-.06-2.96-9.62-3.27-22.92,1.1-64.53.81-.12,1.45-.8,1.49-1.64.39-8.56,3.78-14.95,9.32-17.55,4.9-2.3,10.93-1.39,16.12,2.44,7.63,5.62,16.5-2.93,24.34-10.47,5.12-4.93,10.91-10.52,14.28-9.61,1.49.4,2.61,2.19,3.41,4.19,0,.03.02.06.03.09.28.85.56,1.7.85,2.57,4.88,14.97,10.31,32.88,10.74,58.5Z',
    },
    {
      key: 'calves',
      kind: 'path',
      transform: MUSCLEWIKI_TRANSFORM,
      d: 'M267.16,1001.72s-.02.04-.02.06c-9.13,23.64-18.78,21.64-21.97,20.97-8.09-1.68-9.21-12.61-10.11-21.38-.72-7.1-1.3-12.7-5.53-13.06-3.37-.29-5.66,4.4-9.14,11.49-4.2,8.54-9.91,20.27-17.29,19.82-12.98-.77-16.19-27.59-17.62-53.8v-.04c.42-25.66,5.86-43.61,10.75-58.58.29-.87.57-1.72.85-2.57,0-.03.02-.06.03-.09.8-1.99,1.92-3.79,3.41-4.19,3.37-.91,9.16,4.68,14.28,9.61,7.83,7.54,16.72,16.09,24.34,10.47,5.2-3.83,11.23-4.74,16.12-2.44,5.53,2.6,8.93,8.99,9.32,17.55.04.84.67,1.52,1.48,1.64,4.38,41.61,4.07,54.93,1.1,64.53Z',
    },
  ],
};

// Mock exercises database
const mockExercises: ScreenExercise[] = [
  {
    id: '1',
    name: 'Push-ups',
    description: 'Classic bodyweight exercise for chest and triceps',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    equipment: 'bodyweight',
    difficulty: 'beginner',
    instructions: [
      'Start in a plank position with hands shoulder-width apart',
      'Lower your body until chest nearly touches the ground',
      'Push back up to starting position',
      'Keep your core tight throughout the movement',
    ],
    sets: 3,
    reps: 10,
    restTime: 60,
    caloriesPerMinute: 8,
    imageUrl: null,
    videoUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Squats',
    description: 'Fundamental lower body exercise',
    muscleGroups: ['legs', 'glutes', 'core'],
    equipment: 'bodyweight',
    difficulty: 'beginner',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower your body as if sitting back into a chair',
      'Keep your chest up and knees behind toes',
      'Return to standing position',
    ],
    sets: 3,
    reps: 15,
    restTime: 90,
    caloriesPerMinute: 10,
    imageUrl: null,
    videoUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Pull-ups',
    description: 'Upper body strength exercise',
    muscleGroups: ['back', 'biceps', 'shoulders'],
    equipment: 'pull-up-bar',
    difficulty: 'intermediate',
    instructions: [
      'Grab the pull-up bar with palms facing away',
      'Hang with arms fully extended',
      'Pull your body up until chin clears the bar',
      'Lower back down with control',
    ],
    sets: 3,
    reps: 8,
    restTime: 120,
    caloriesPerMinute: 12,
    imageUrl: null,
    videoUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Planks',
    description: 'Core stability exercise',
    muscleGroups: ['core', 'shoulders'],
    equipment: 'bodyweight',
    difficulty: 'beginner',
    instructions: [
      'Start in a forearm plank position',
      'Keep your body in a straight line',
      'Engage your core muscles',
      'Hold the position for the specified time',
    ],
    sets: 3,
    reps: 30, // seconds
    restTime: 60,
    caloriesPerMinute: 4,
    imageUrl: null,
    videoUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Lunges',
    description: 'Unilateral leg exercise',
    muscleGroups: ['legs', 'glutes', 'core'],
    equipment: 'bodyweight',
    difficulty: 'beginner',
    instructions: [
      'Step forward with one leg',
      'Lower your body until both knees are bent',
      'Push back to starting position',
      'Alternate legs',
    ],
    sets: 3,
    reps: 12,
    restTime: 90,
    caloriesPerMinute: 8,
    imageUrl: null,
    videoUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Bicep Curls',
    description: 'Isolation exercise for biceps',
    muscleGroups: ['biceps'],
    equipment: 'dumbbells',
    difficulty: 'beginner',
    instructions: [
      'Hold dumbbells at your sides',
      'Curl the weights up to your shoulders',
      'Lower back down with control',
      'Keep your elbows at your sides',
    ],
    sets: 3,
    reps: 12,
    restTime: 60,
    caloriesPerMinute: 6,
    imageUrl: null,
    videoUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock workout routines
const mockWorkoutRoutines: ScreenWorkoutRoutine[] = [
  {
    id: '1',
    name: 'Full Body Beginner',
    description: 'Complete workout for beginners',
    exercises: ['1', '2', '4', '6'],
    duration: 45,
    difficulty: 'beginner',
    caloriesBurned: 300,
    isPublic: true,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Upper Body Focus',
    description: 'Target chest, back, and arms',
    exercises: ['1', '3', '6'],
    duration: 30,
    difficulty: 'intermediate',
    caloriesBurned: 250,
    isPublic: true,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Lower Body Power',
    description: 'Build strong legs and glutes',
    exercises: ['2', '5'],
    duration: 25,
    difficulty: 'beginner',
    caloriesBurned: 200,
    isPublic: true,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

function routineFromFirestore(r: FirestoreRoutine): ScreenWorkoutRoutine {
  const mappedExercises = Array.isArray(r.exerciseIds) ? r.exerciseIds : [];
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    exercises: mappedExercises,
    duration: r.duration,
    difficulty:
      r.difficulty === 'beginner' ||
      r.difficulty === 'intermediate' ||
      r.difficulty === 'advanced'
        ? r.difficulty
        : 'beginner',
    caloriesBurned: r.caloriesBurned,
    isPublic: false,
    createdBy: 'user',
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

const WorkoutScreen = ({navigation}: any) => {
  const {theme, isDark} = useTheme();
  const styles = useMemo(
    () => createWorkoutScreenStyles(theme, isDark),
    [theme, isDark],
  );
  const {unreadCount, openPanel, closePanel, panelOpen} = useNotificationInbox();
  const stackBack = resolveStackBack(navigation);
  const topInset = useScreenTopInset();
  // Use workout context
  const {workoutHistory, addWorkoutSession} = useWorkout();

  const [exerciseCatalog, setExerciseCatalog] =
    useState<ScreenExercise[]>(mockExercises);
  const [presetRoutines, setPresetRoutines] =
    useState<ScreenWorkoutRoutine[]>(mockWorkoutRoutines);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let extra: ScreenExercise[] = [];
        if (hasMuscleWikiApiKey()) {
          try {
            extra = await fetchMuscleWikiExercisesForCatalog(28);
          } catch (e) {
            console.warn(
              'MuscleWiki unavailable, falling back to wger catalog',
              e,
            );
            extra = await fetchWgerExercisesForCatalog(28);
          }
        } else {
          extra = await fetchWgerExercisesForCatalog(28);
        }
        if (!cancelled && extra.length) {
          setExerciseCatalog(prev => {
            const merged = [
              ...(extra as unknown[]).map((item, idx) =>
                normalizeExerciseForCatalog(item as Partial<ScreenExercise>, idx),
              ),
              ...prev,
            ];
            const byId = new Map<string, ScreenExercise>();
            for (const ex of merged) {
              if (!byId.has(ex.id)) {
                byId.set(ex.id, ex);
              }
            }
            return Array.from(byId.values());
          });
        }
      } catch (e) {
        console.warn('exerciseCatalogSource', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!hasMuscleWikiApiKey()) {
        return;
      }
      try {
        const routines = await fetchMuscleWikiRoutinesForCatalog(12);
        if (!cancelled && routines.length) {
          setPresetRoutines(
            routines.map(r => ({
              ...r,
              exercises: r.exercises.map(ex => (ex.startsWith('mw-') || ex.startsWith('wger-') ? ex : `mw-${ex}`)),
            })),
          );
        }
      } catch (e) {
        console.warn(
          'MuscleWiki routines unavailable, keeping local preset routines',
          e,
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Modal states
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ScreenExercise | null>(
    null,
  );

  const [selectedMuscleGroupKey, setSelectedMuscleGroupKey] = useState<
    string | null
  >(null);
  const [bodyView, setBodyView] = useState<'front' | 'back'>('front');
  const [selectedRoutine, setSelectedRoutine] = useState<ScreenWorkoutRoutine | null>(
    null,
  );
  const [currentExercise, setCurrentExercise] = useState<ScreenExercise | null>(
    null,
  );
  const [workoutInProgress, setWorkoutInProgress] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState<number>(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(0);
  const [completedSetsCount, setCompletedSetsCount] = useState(0);
  const [completedExercisesCount, setCompletedExercisesCount] = useState(0);
  const [exerciseSetProgress, setExerciseSetProgress] = useState<
    Record<string, {exerciseName: string; setsCompleted: number}>
  >({});
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterEquipment, setFilterEquipment] = useState<string>('all');

  // Timer states
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerType, setTimerType] = useState<'work' | 'rest' | 'break'>('work');
  const [timerLabel, setTimerLabel] = useState('');

  // Personal routines state
  const [personalRoutines, setPersonalRoutines] = useState<ScreenWorkoutRoutine[]>(
    [],
  );

  const [showCreateRoutine, setShowCreateRoutine] = useState(false);
  const [showPresetRoutines, setShowPresetRoutines] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [selectedExercisesForRoutine, setSelectedExercisesForRoutine] =
    useState<string[]>([]);

  // Workout planner state
  const [showPlanner, setShowPlanner] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState<{[key: string]: string | null}>({
    Monday: null,
    Tuesday: null,
    Wednesday: null,
    Thursday: null,
    Friday: null,
    Saturday: null,
    Sunday: null,
  });
  const nextExerciseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const thisWeekStats = useMemo(() => {
    const now = new Date();
    const start = getStartOfWeekMonday(now);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    const inRange = workoutHistory.filter(w => {
      const d = new Date(w.date);
      return !Number.isNaN(d.getTime()) && d >= start && d <= end;
    });
    const totalWorkouts = inRange.length;
    const totalDuration = inRange.reduce(
      (sum, w) => sum + Math.max(Number(w.duration) || 0, 0),
      0,
    );
    const totalCalories = inRange.reduce(
      (sum, w) => sum + Math.max(Number(w.caloriesBurned) || 0, 0),
      0,
    );
    return {totalWorkouts, totalDuration, totalCalories};
  }, [workoutHistory]);

  useEffect(() => {
    let unsubRoutines: (() => void) | undefined;
    const off = onAuthStateChanged(firebaseAuth, user => {
      unsubRoutines?.();
      unsubRoutines = undefined;
      if (!user) {
        setPersonalRoutines([]);
        return;
      }
      unsubRoutines = subscribeUserRoutines(
        user.uid,
        list => setPersonalRoutines(list.map(routineFromFirestore)),
        e => console.warn('subscribeUserRoutines', e),
      );
      (async () => {
        try {
          const plan = await loadWeeklyPlanner(user.uid);
          if (plan) {
            setWeeklyPlan(prev => ({...prev, ...plan}));
          }
        } catch (e) {
          console.warn('loadWeeklyPlanner', e);
        }
      })();
    });
    return () => {
      off();
      unsubRoutines?.();
    };
  }, []);

  const startWorkout = (routine: ScreenWorkoutRoutine) => {
    setSelectedRoutine(routine);
    setWorkoutInProgress(true);
    setWorkoutStartTime(Date.now());
    setCurrentSet(1);
    setCurrentRep(0);
    setCompletedSetsCount(0);
    setCompletedExercisesCount(0);
    setExerciseSetProgress({});

    // Get first exercise
    const firstExerciseId = routine.exercises[0];
    const exercise = exerciseCatalog.find(ex => ex.id === firstExerciseId);
    setCurrentExercise(exercise || null);
  };

  // Calendar functions
  const getTargetDateForCalendarIndex = (dayIndex: number) => {
    const monday = getStartOfWeekMonday(new Date());
    const target = new Date(monday);
    target.setDate(monday.getDate() + dayIndex);
    target.setHours(0, 0, 0, 0);
    return target;
  };

  const getWorkoutForDay = (dayIndex: number) => {
    const targetDate = getTargetDateForCalendarIndex(dayIndex);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (targetDate > today) {
      return undefined;
    }
    const targetYmd = getLocalYmd(targetDate);
    return workoutHistory.find(workout => workout.date === targetYmd);
  };

  const handleCalendarDayPress = (dayIndex: number) => {
    const workout = getWorkoutForDay(dayIndex);
    if (workout) {
      setSelectedWorkout(workout);
      setShowWorkoutModal(true);
    } else {
      Alert.alert('No Workout', 'No workout completed on this day');
    }
  };

  const handleExercisePress = (exercise: ScreenExercise) => {
    setSelectedExercise(exercise);
    setShowExerciseModal(true);
  };

  const nextExercise = () => {
    if (!selectedRoutine || !currentExercise) return;

    const currentIndex = selectedRoutine.exercises.indexOf(currentExercise.id);
    const nextIndex = currentIndex + 1;

    if (nextIndex < selectedRoutine.exercises.length) {
      const nextExerciseId = selectedRoutine.exercises[nextIndex];
      const exercise = exerciseCatalog.find(ex => ex.id === nextExerciseId);
      setCurrentExercise(exercise || null);
      setCurrentSet(1);
      setCurrentRep(0);
    } else {
      // Workout completed
      const workoutDuration = Math.round(
        (Date.now() - workoutStartTime) / 1000 / 60,
      ); // minutes
      saveWorkoutProgress(
        selectedRoutine,
        workoutDuration,
        completedSetsCount,
        completedExercisesCount,
      );

      Alert.alert(
        'Workout Complete! 🎉',
        `Great job! You've completed the ${selectedRoutine.name} workout in ${workoutDuration} minutes!`,
        [
          {
            text: 'OK',
            onPress: () => {
              setWorkoutInProgress(false);
              setSelectedRoutine(null);
              setCurrentExercise(null);
            },
          },
        ],
      );
    }
  };

  // Personal routines functions
  const createPersonalRoutine = async () => {
    if (!newRoutineName.trim() || selectedExercisesForRoutine.length === 0) {
      Alert.alert(
        'Error',
        'Please enter a routine name and select at least one exercise',
      );
      return;
    }

    const nameToSave = newRoutineName.trim();

    try {
      const u = firebaseAuth.currentUser;
      if (!u) {
        Alert.alert(
          'Sign in required',
          'Sign in to save routines to your account.',
        );
        return;
      }
      await createUserRoutine({
        name: nameToSave,
        description: 'Custom personal routine',
        difficulty: 'beginner',
        exerciseIds: selectedExercisesForRoutine,
        duration: selectedExercisesForRoutine.length * 5,
        caloriesBurned: selectedExercisesForRoutine.length * 50,
        muscleGroups: [],
        equipment: 'mixed',
      });
      setNewRoutineName('');
      setSelectedExercisesForRoutine([]);
      setShowCreateRoutine(false);
      Alert.alert('Success!', `"${nameToSave}" saved to the cloud.`);
    } catch (e) {
      console.warn('createUserRoutine', e);
      Alert.alert(
        'Error',
        'Could not save the routine. Check Firestore rules and your connection.',
      );
    }
  };

  const toggleExerciseSelection = (exerciseId: string) => {
    if (selectedExercisesForRoutine.includes(exerciseId)) {
      setSelectedExercisesForRoutine(
        selectedExercisesForRoutine.filter(id => id !== exerciseId),
      );
    } else {
      setSelectedExercisesForRoutine([
        ...selectedExercisesForRoutine,
        exerciseId,
      ]);
    }
  };

  const deletePersonalRoutine = (routineId: string) => {
    Alert.alert(
      'Delete Routine',
      'Are you sure you want to delete this routine?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUserRoutine(routineId);
            } catch (e) {
              console.warn('deleteUserRoutine', e);
              Alert.alert('Error', 'Could not delete the routine from the cloud.');
            }
          },
        },
      ],
    );
  };

  // Timer functions
  const startTimer = (
    seconds: number,
    type: 'work' | 'rest' | 'break',
    label: string,
  ) => {
    setTimerSeconds(seconds);
    setTimerType(type);
    setTimerLabel(label);
    setTimerActive(true);
  };

  const stopTimer = () => {
    setTimerActive(false);
    setTimerSeconds(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            // Timer finished
            setTimerActive(false);

            // Play sound or vibration here
            if (timerType === 'rest') {
              Alert.alert('Rest Complete!', 'Time to start your next set! 💪');
            } else if (timerType === 'break') {
              Alert.alert('Break Complete!', 'Ready for the next exercise? 🚀');
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerActive, timerSeconds, timerType]);

  useEffect(() => {
    return () => {
      if (nextExerciseTimeoutRef.current) {
        clearTimeout(nextExerciseTimeoutRef.current);
      }
    };
  }, []);

  // Progress tracking functions
  const saveWorkoutProgress = (
    routine: ScreenWorkoutRoutine,
    duration: number,
    completedSets = 0,
    completedExercises = 0,
  ) => {
    // Use local date instead of ISO to avoid timezone issues
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(now.getDate()).padStart(2, '0')}`;

    const routineSetsEstimate = Math.max(routine.exercises.length * 3, 1);
    const completionRatio = Math.min(completedSets / routineSetsEstimate, 1);
    const baseCalories = routine.caloriesBurned || duration * 8;
    const adjustedCalories = Math.max(Math.round(baseCalories * completionRatio), 0);
    const exerciseBreakdown = Object.entries(exerciseSetProgress)
      .map(([exerciseId, v]) => ({
        exerciseId,
        exerciseName: v.exerciseName,
        setsCompleted: v.setsCompleted,
      }))
      .filter(e => e.setsCompleted > 0);
    const newWorkout = {
      id: Date.now().toString(),
      date: today,
      routineName: routine.name,
      duration: duration,
      caloriesBurned: adjustedCalories,
      exercisesCompleted: Math.max(completedExercises, 0),
      completedSets: Math.max(completedSets, 0),
      exerciseBreakdown,
    };

    console.log('Saving workout for date:', today);
    addWorkoutSession(newWorkout);
  };

  // Progress tracking is now handled by WorkoutContext

  // Weekly planner functions
  const assignRoutineToDay = (day: string, routineName: string) => {
    setWeeklyPlan(prev => {
      const next = {...prev, [day]: routineName};
      const u = firebaseAuth.currentUser;
      if (u) {
        saveWeeklyPlanner(u.uid, next).catch(e =>
          console.warn('saveWeeklyPlanner', e),
        );
      }
      return next;
    });
  };

  const removeRoutineFromDay = (day: string) => {
    setWeeklyPlan(prev => {
      const next = {...prev, [day]: null};
      const u = firebaseAuth.currentUser;
      if (u) {
        saveWeeklyPlanner(u.uid, next).catch(e =>
          console.warn('saveWeeklyPlanner', e),
        );
      }
      return next;
    });
  };

  const getAllRoutines = () => {
    return [...presetRoutines, ...personalRoutines];
  };

  const selectedMuscleGroup = useMemo(
    () =>
      MUSCLE_GROUP_OPTIONS.find(group => group.key === selectedMuscleGroupKey) ??
      null,
    [selectedMuscleGroupKey],
  );
  useEffect(() => {
    if (!selectedMuscleGroup) {
      return;
    }
    if (
      selectedMuscleGroup.bodyView !== 'both' &&
      selectedMuscleGroup.bodyView !== bodyView
    ) {
      setSelectedMuscleGroupKey(null);
    }
  }, [bodyView, selectedMuscleGroup]);
  const bodyZones = BODY_ZONE_LAYOUT[bodyView];

  const matchesMuscleGroup = (
    exercise: ScreenExercise,
    muscleGroup: MuscleGroupOption,
  ) => {
    const haystack = [
      exercise.name,
      exercise.description,
      ...(exercise.instructions ?? []),
      ...(exercise.muscleGroups ?? []),
    ]
      .join(' ')
      .toLowerCase();
    return muscleGroup.keywords.some(keyword => haystack.includes(keyword));
  };

  const getFilteredExercises = () => {
    let filtered = exerciseCatalog;

    if (selectedMuscleGroupKey) {
      const muscleGroup = MUSCLE_GROUP_OPTIONS.find(
        group => group.key === selectedMuscleGroupKey,
      );
      if (muscleGroup) {
        filtered = filtered.filter(ex => matchesMuscleGroup(ex, muscleGroup));
      }
    }

    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(ex => ex.difficulty === filterDifficulty);
    }

    if (filterEquipment !== 'all') {
      filtered = filtered.filter(ex => ex.equipment === filterEquipment);
    }

    return filtered;
  };

  const renderExercise = ({item}: {item: ScreenExercise}) => (
    <TouchableOpacity
      style={styles.exerciseCard}
      onPress={() => handleExercisePress(item)}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={styles.exerciseDifficulty}>{item.difficulty}</Text>
      </View>
      <Text style={styles.exerciseDescription}>{item.description}</Text>
      <View style={styles.exerciseStats}>
        <Text style={styles.exerciseStat}>{item.sets} sets</Text>
        <Text style={styles.exerciseStat}>{item.reps} reps</Text>
        <Text style={styles.exerciseStat}>{item.restTime}s rest</Text>
      </View>
    </TouchableOpacity>
  );

  const renderBodyMap = () => (
    <View style={styles.bodyMapCard}>
      <Text style={styles.bodyMapHint}>
        Interactive body map ({bodyView === 'front' ? 'front' : 'back'} view)
      </Text>
      <View style={styles.bodyFigure}>
        <Svg width="100%" height="100%" viewBox="0 0 220 320">
          <Rect
            x={18}
            y={18}
            width={184}
            height={284}
            rx={12}
            stroke={theme.colors.border}
            strokeOpacity={0.55}
            fill="none"
          />
          <Defs>
            <ClipPath id={`bodyClip-${bodyView}`}>
              <Path
                d="M86 54
                   C78 60 73 68 72 78
                   C58 80 48 88 44 100
                   C41 110 42 122 47 132
                   C51 140 58 146 66 148
                   C66 146 66 154 64 162
                   C62 172 60 183 61 194
                   C62 206 66 217 71 228
                   C75 237 79 247 83 258
                   C87 268 90 280 92 294
                   L102 294
                   C103 279 104 266 105 253
                   C106 239 107 224 108 209
                   C109 198 109 187 110 176
                   C111 187 111 198 112 209
                   C113 224 114 239 115 253
                   C116 266 117 279 118 294
                   L128 294
                   C130 280 133 268 137 258
                   C141 247 145 237 149 228
                   C154 217 158 206 159 194
                   C160 183 158 172 156 162
                   C154 154 154 146 155 148
                   C163 146 170 140 174 132
                   C179 122 180 110 177 100
                   C173 88 163 80 148 78
                   C147 68 142 60 134 54
                   C127 49 120 47 110 47
                   C100 47 93 49 86 54 Z"
              />
            </ClipPath>
          </Defs>
          <G>
            {bodyZones.map((zone, zoneIndex) => {
              const isSelected = selectedMuscleGroupKey === zone.key;
              const fillColor = isSelected
                ? '#f58fb0'
                : isDark
                ? 'rgba(77, 208, 225, 0.18)'
                : 'rgba(45, 212, 191, 0.16)';
              const strokeColor = isSelected
                ? '#f06292'
                : isDark
                ? 'rgba(77, 208, 225, 0.55)'
                : 'rgba(13, 148, 136, 0.45)';
              const onPress = () =>
                setSelectedMuscleGroupKey(isSelected ? null : zone.key);
              if (zone.kind === 'ellipse') {
                return (
                  <Ellipse
                    key={`${bodyView}-${zone.key}-${zoneIndex}`}
                    cx={zone.cx || 0}
                    cy={zone.cy || 0}
                    rx={zone.rx || 0}
                    ry={zone.ry || 0}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={1.5}
                    onPress={onPress}
                  />
                );
              }
              if (zone.kind === 'path') {
                return (
                  <Path
                    key={`${bodyView}-${zone.key}-${zoneIndex}`}
                    d={zone.d || ''}
                  transform={zone.transform}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={1.5}
                    onPress={onPress}
                  />
                );
              }
              return (
                <Rect
                  key={`${bodyView}-${zone.key}-${zoneIndex}`}
                  x={zone.x || 0}
                  y={zone.y || 0}
                  width={zone.width || 0}
                  height={zone.height || 0}
                  rx={zone.radius || 10}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={1.5}
                  onPress={onPress}
                />
              );
            })}
          </G>
        </Svg>
      </View>
    </View>
  );

  const renderWorkoutRoutine = ({
    item,
    isPersonal = false,
  }: {
    item: ScreenWorkoutRoutine;
    isPersonal?: boolean;
  }) => (
    <View style={styles.routineCard}>
      <TouchableOpacity
        style={styles.routineContent}
        onPress={() => startWorkout(item)}>
        <View style={styles.routineHeader}>
          <Text style={styles.routineName}>{item.name}</Text>
          <View style={styles.routineHeaderRight}>
            {isPersonal && (
              <Text style={styles.personalBadge}>👤 Personal</Text>
            )}
            <Text style={styles.routineDifficulty}>{item.difficulty}</Text>
          </View>
        </View>
        <Text style={styles.routineDescription}>{item.description}</Text>
        <View style={styles.routineStats}>
          <Text style={styles.routineStat}>{item.duration} min</Text>
          <Text style={styles.routineStat}>{item.caloriesBurned} cal</Text>
          <Text style={styles.routineStat}>
            {item.exercises.length} exercises
          </Text>
        </View>
      </TouchableOpacity>
      {isPersonal && (
        <TouchableOpacity
          style={styles.deleteRoutineButton}
          onPress={() => deletePersonalRoutine(item.id)}>
          <Text style={styles.deleteRoutineText}>🗑️</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (workoutInProgress && currentExercise) {
    return (
      <View
        style={[
          styles.container,
          {paddingTop: topInset, backgroundColor: theme.colors.background},
        ]}>
        <View style={styles.workoutContainer}>
          {/* Header */}
          <View style={styles.workoutHeader}>
            <TouchableOpacity
              style={styles.backButton}
              hitSlop={{top: 16, bottom: 16, left: 16, right: 16}}
              onPress={() => {
                Alert.alert(
                  'End Workout?',
                  'Are you sure you want to end this workout?',
                  [
                    {text: 'Cancel', style: 'cancel'},
                    {
                      text: 'End',
                      style: 'destructive',
                      onPress: () => {
                        // Save progress before ending
                        if (selectedRoutine && workoutStartTime > 0) {
                          const workoutDuration = Math.round(
                            (Date.now() - workoutStartTime) / 1000 / 60,
                          );
                          saveWorkoutProgress(
                            selectedRoutine,
                            workoutDuration,
                            completedSetsCount,
                            completedExercisesCount,
                          );
                        }

                        if (nextExerciseTimeoutRef.current) {
                          clearTimeout(nextExerciseTimeoutRef.current);
                          nextExerciseTimeoutRef.current = null;
                        }
                        stopTimer();

                        setWorkoutInProgress(false);
                        setSelectedRoutine(null);
                        setCurrentExercise(null);
                        setWorkoutStartTime(0);
                      },
                    },
                  ],
                );
              }}>
              <Text style={styles.backButtonText}>← End Workout</Text>
            </TouchableOpacity>
            <Text style={styles.workoutTitle}>{selectedRoutine?.name}</Text>
            <View style={styles.headerRight} />
          </View>

          {/* Current Exercise */}
          <View style={styles.currentExerciseCard}>
            <Text style={styles.exerciseTitle}>{currentExercise.name}</Text>
            <Text style={styles.exerciseSubtitle}>
              {currentExercise.description}
            </Text>

            <View style={styles.progressSection}>
              <Text style={styles.progressTitle}>Progress</Text>
              <View style={styles.progressStats}>
                <View style={styles.progressItem}>
                  <Text style={styles.progressValue}>{currentSet}</Text>
                  <Text style={styles.progressLabel}>Set</Text>
                </View>
                <View style={styles.progressItem}>
                  <Text style={styles.progressValue}>
                    {currentExercise.sets}
                  </Text>
                  <Text style={styles.progressLabel}>Total Sets</Text>
                </View>
                <View style={styles.progressItem}>
                  <Text style={styles.progressValue}>
                    {currentExercise.reps}
                  </Text>
                  <Text style={styles.progressLabel}>Reps</Text>
                </View>
              </View>
            </View>

            {/* Timer Section */}
            {timerActive && (
              <View style={styles.timerSection}>
                <Text style={styles.timerTitle}>{timerLabel}</Text>
                <View
                  style={[
                    styles.timerDisplay,
                    {
                      backgroundColor:
                        timerType === 'rest' ? '#FFE8B3' : '#E8F5E8',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.timerText,
                      {color: timerType === 'rest' ? '#B8860B' : '#2E7D32'},
                    ]}>
                    {formatTime(timerSeconds)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.stopTimerButton}
                  onPress={stopTimer}>
                  <Text style={styles.stopTimerButtonText}>⏹️ Stop Timer</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Quick Timer Buttons */}
            {!timerActive && (
              <View style={styles.quickTimerSection}>
                <Text style={styles.quickTimerTitle}>Quick Timers</Text>
                <View style={styles.quickTimerButtons}>
                  <TouchableOpacity
                    style={styles.quickTimerButton}
                    onPress={() => startTimer(30, 'work', 'Quick 30s Work')}>
                    <Text style={styles.quickTimerButtonText}>30s</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.quickTimerButton}
                    onPress={() => startTimer(60, 'work', 'Quick 1min Work')}>
                    <Text style={styles.quickTimerButtonText}>1min</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.quickTimerButton}
                    onPress={() => startTimer(90, 'rest', 'Quick 1.5min Rest')}>
                    <Text style={styles.quickTimerButtonText}>1.5min</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.instructionsSection}>
              <Text style={styles.instructionsTitle}>Instructions:</Text>
              {currentExercise.instructions.map((instruction, index) => (
                <Text key={index} style={styles.instructionText}>
                  {index + 1}. {instruction}
                </Text>
              ))}
            </View>

            <View style={styles.workoutButtons}>
              <TouchableOpacity
                style={styles.completeSetButton}
                onPress={() => {
                  console.log('🔥 Complete Set button pressed!');
                  console.log(
                    'Current set:',
                    currentSet,
                    'Total sets:',
                    currentExercise.sets,
                  );

                  setCompletedSetsCount(prev => prev + 1);
                  setExerciseSetProgress(prev => {
                    const exId = currentExercise.id;
                    const existing = prev[exId];
                    return {
                      ...prev,
                      [exId]: {
                        exerciseName: currentExercise.name,
                        setsCompleted: (existing?.setsCompleted ?? 0) + 1,
                      },
                    };
                  });
                  if (currentSet < currentExercise.sets) {
                    console.log('📈 Moving to next set');
                    setCurrentSet(currentSet + 1);
                    // Start rest timer between sets
                    startTimer(
                      currentExercise.restTime,
                      'rest',
                      `Rest between sets (${currentExercise.restTime}s)`,
                    );
                  } else {
                    setCompletedExercisesCount(prev => prev + 1);
                    console.log('🏃 Moving to next exercise');
                    // Start break timer before next exercise
                    startTimer(
                      120,
                      'break',
                      'Break before next exercise (2min)',
                    );
                    if (nextExerciseTimeoutRef.current) {
                      clearTimeout(nextExerciseTimeoutRef.current);
                    }
                    nextExerciseTimeoutRef.current = setTimeout(() => {
                      nextExerciseTimeoutRef.current = null;
                      nextExercise();
                    }, 120000); // 2 minutes
                  }
                }}>
                <Text style={styles.completeSetButtonText}>
                  {currentSet < currentExercise.sets
                    ? 'Complete Set'
                    : 'Next Exercise'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
        <TouchableOpacity
          style={styles.backButton}
          hitSlop={{top: 24, bottom: 24, left: 24, right: 24}}
          onPress={stackBack.onPress}>
          <Text style={styles.backButtonText}>{stackBack.label}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Workout</Text>
        <View style={styles.headerRight}>
          <NotificationBellIcon
            unreadCount={unreadCount}
            onPress={() => (panelOpen ? closePanel() : openPanel())}
          />
        </View>
      </View>

      <ScrollView
        style={{flex: 1, backgroundColor: theme.colors.background}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Weekly Planner Toggle */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.plannerToggleButton}
            onPress={() => setShowPlanner(!showPlanner)}>
            <Text style={styles.plannerToggleText}>
              {showPlanner
                ? '📅 Hide Weekly Planner'
                : '📅 Show Weekly Planner'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Planner */}
        {showPlanner && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Weekly Workout Planner</Text>
            <Text style={styles.plannerPersistHint}>
              Plan your week and keep a consistent training rhythm.
            </Text>
            {Object.keys(weeklyPlan).map(day => (
              <View key={day} style={styles.plannerDayCard}>
                <View style={styles.plannerDayHeader}>
                  <Text style={styles.plannerDayName}>{day}</Text>
                  {weeklyPlan[day] && (
                    <TouchableOpacity
                      style={styles.removePlanButton}
                      onPress={() => removeRoutineFromDay(day)}>
                      <Text style={styles.removePlanText}>❌</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {weeklyPlan[day] ? (
                  <View style={styles.plannedRoutine}>
                    <Text style={styles.plannedRoutineName}>
                      {weeklyPlan[day]}
                    </Text>
                    <TouchableOpacity
                      style={styles.startPlannedButton}
                      onPress={() => {
                        const routine = getAllRoutines().find(
                          r => r.name === weeklyPlan[day],
                        );
                        if (routine) startWorkout(routine);
                      }}>
                      <Text style={styles.startPlannedText}>▶️ Start</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.routineSelector}>
                    <Text style={styles.selectorLabel}>Choose a routine:</Text>
                    <View style={styles.routineButtons}>
                      {getAllRoutines()
                        .slice(0, 3)
                        .map(routine => (
                          <TouchableOpacity
                            key={routine.id}
                            style={styles.routineSelectButton}
                            onPress={() =>
                              assignRoutineToDay(day, routine.name)
                            }>
                            <Text style={styles.routineSelectText}>
                              {routine.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Quick Stats & Calendar - Combined */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 This Week</Text>

          {/* Quick Stats Row */}
          <View style={styles.quickStatsRow}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{thisWeekStats.totalWorkouts}</Text>
              <Text style={styles.quickStatLabel}>Workouts</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{thisWeekStats.totalDuration}</Text>
              <Text style={styles.quickStatLabel}>Minutes</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{thisWeekStats.totalCalories}</Text>
              <Text style={styles.quickStatLabel}>Calories</Text>
            </View>
          </View>

          {/* Calendar */}
          <Text style={styles.calendarTitle}>📅 This Week</Text>
          <View style={styles.calendarGrid}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
              const today = new Date().getDay();
              // Convert Sunday (0) to 7, then compare with index + 1
              const isToday = (today === 0 ? 7 : today) === index + 1;
              const targetDate = getTargetDateForCalendarIndex(index);
              const isFuture = targetDate > new Date();
              const hasWorkout = getWorkoutForDay(index) !== undefined;
              return (
                <CalendarDay
                  key={index}
                  day={day}
                  hasWorkout={hasWorkout}
                  isToday={isToday}
                  isFuture={isFuture}
                  theme={theme}
                  onPress={() => handleCalendarDayPress(index)}
                />
              );
            })}
          </View>
        </View>

        {/* Personal Routines */}
        {personalRoutines.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Personal Routines</Text>
            <FlatList
              data={personalRoutines}
              renderItem={({item}) =>
                renderWorkoutRoutine({item, isPersonal: true})
              }
              keyExtractor={item => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Create Personal Routine Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.createRoutineButton}
            onPress={() => setShowCreateRoutine(!showCreateRoutine)}>
            <Text style={styles.createRoutineButtonText}>
              {showCreateRoutine ? '❌ Cancel' : '➕ Create Personal Routine'}
            </Text>
          </TouchableOpacity>

          {/* Create Routine Form */}
          {showCreateRoutine && (
            <View style={styles.createRoutineForm}>
              <Text style={styles.formTitle}>Create New Routine</Text>

              <TextInput
                style={styles.routineNameInput}
                placeholder="Enter routine name..."
                placeholderTextColor={theme.colors.placeholder}
                value={newRoutineName}
                onChangeText={setNewRoutineName}
              />

              <Text style={styles.formSubtitle}>Select Exercises:</Text>
              <FlatList
                data={getFilteredExercises()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={[
                      styles.exerciseSelectionItem,
                      selectedExercisesForRoutine.includes(item.id) &&
                        styles.exerciseSelected,
                    ]}
                    onPress={() => toggleExerciseSelection(item.id)}>
                    <Text
                      style={[
                        styles.exerciseSelectionText,
                        selectedExercisesForRoutine.includes(item.id) &&
                          styles.exerciseSelectedText,
                      ]}>
                      {selectedExercisesForRoutine.includes(item.id)
                        ? '✅'
                        : '⬜'}{' '}
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />

              <TouchableOpacity
                style={styles.saveRoutineButton}
                onPress={createPersonalRoutine}>
                <Text style={styles.saveRoutineButtonText}>
                  💾 Save Routine
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Preset Workout Routines */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.presetToggleButton}
            onPress={() => setShowPresetRoutines(prev => !prev)}>
            <Text style={styles.presetToggleButtonText}>
              {showPresetRoutines
                ? '📦 Hide Preset Routines'
                : '✨ Get Inspired by App Presets'}
            </Text>
          </TouchableOpacity>

          {showPresetRoutines && (
            <>
              <Text style={styles.sectionTitle}>Preset Workout Routines</Text>
              <FlatList
                data={presetRoutines}
                renderItem={renderWorkoutRoutine}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
        </View>

        {/* Muscle Groups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Muscle Groups</Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                bodyView === 'front' && styles.filterButtonActive,
              ]}
              onPress={() => setBodyView('front')}>
              <Text
                style={[
                  styles.filterButtonText,
                  bodyView === 'front' && styles.filterButtonTextActive,
                ]}>
                Front View
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                bodyView === 'back' && styles.filterButtonActive,
              ]}
              onPress={() => setBodyView('back')}>
              <Text
                style={[
                  styles.filterButtonText,
                  bodyView === 'back' && styles.filterButtonTextActive,
                ]}>
                Back View
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.filterLabel}>
            Tap a muscle area to filter exercises:
          </Text>
          {renderBodyMap()}
          {selectedMuscleGroup && (
            <View style={styles.bodyMapSelectedRow}>
              <Text style={styles.bodyMapSelectedText}>
                Selected: {selectedMuscleGroup.label}
              </Text>
              <TouchableOpacity
                style={styles.clearFilterButton}
                onPress={() => setSelectedMuscleGroupKey(null)}>
                <Text style={styles.clearFilterText}>Clear</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Filters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filters</Text>
          <View style={styles.filterContainer}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Difficulty:</Text>
              <View style={styles.filterButtons}>
                {['all', 'beginner', 'intermediate', 'advanced'].map(
                  difficulty => (
                    <TouchableOpacity
                      key={difficulty}
                      style={[
                        styles.filterButton,
                        filterDifficulty === difficulty &&
                          styles.filterButtonActive,
                      ]}
                      onPress={() => setFilterDifficulty(difficulty)}>
                      <Text
                        style={[
                          styles.filterButtonText,
                          filterDifficulty === difficulty &&
                            styles.filterButtonTextActive,
                        ]}>
                        {difficulty.charAt(0).toUpperCase() +
                          difficulty.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}
              </View>
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Equipment:</Text>
              <View style={styles.filterButtons}>
                {['all', 'bodyweight', 'dumbbells', 'pull-up-bar'].map(
                  equipment => (
                    <TouchableOpacity
                      key={equipment}
                      style={[
                        styles.filterButton,
                        filterEquipment === equipment &&
                          styles.filterButtonActive,
                      ]}
                      onPress={() => setFilterEquipment(equipment)}>
                      <Text
                        style={[
                          styles.filterButtonText,
                          filterEquipment === equipment &&
                            styles.filterButtonTextActive,
                        ]}>
                        {equipment === 'pull-up-bar'
                          ? 'Pull-up Bar'
                          : equipment.charAt(0).toUpperCase() +
                            equipment.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Exercises */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedMuscleGroup
              ? `${selectedMuscleGroup.label} Exercises`
              : 'All Exercises'}
          </Text>
          {selectedMuscleGroup && (
            <TouchableOpacity
              style={styles.clearFilterButton}
              onPress={() => setSelectedMuscleGroupKey(null)}>
              <Text style={styles.clearFilterText}>❌ Clear Filter</Text>
            </TouchableOpacity>
          )}
          <FlatList
            data={getFilteredExercises()}
            renderItem={renderExercise}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      {/* Workout Details Modal */}
      {showWorkoutModal && selectedWorkout && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Workout Details</Text>
              <TouchableOpacity
                onPress={() => setShowWorkoutModal(false)}
                style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.workoutDetails}>
              <Text style={styles.workoutDetailTitle}>
                {selectedWorkout.routineName}
              </Text>
              <Text style={styles.workoutDetailDate}>
                {selectedWorkout.date}
              </Text>
              <Text style={styles.workoutDetailType}>
                Workout Type: {selectedWorkout.routineName}
              </Text>
              <View style={styles.workoutDetailStats}>
                <View style={styles.workoutDetailStat}>
                  <Text style={styles.workoutDetailStatValue}>
                    {selectedWorkout.duration}
                  </Text>
                  <Text style={styles.workoutDetailStatLabel}>Minutes</Text>
                </View>
                <View style={styles.workoutDetailStat}>
                  <Text style={styles.workoutDetailStatValue}>
                    {selectedWorkout.caloriesBurned}
                  </Text>
                  <Text style={styles.workoutDetailStatLabel}>Calories</Text>
                </View>
                <View style={styles.workoutDetailStat}>
                  <Text style={styles.workoutDetailStatValue}>
                    {selectedWorkout.exercisesCompleted}
                  </Text>
                  <Text style={styles.workoutDetailStatLabel}>Exercises</Text>
                </View>
              </View>
              <View style={styles.workoutDetailExerciseList}>
                <Text style={styles.workoutDetailExerciseTitle}>
                  Exercises & Sets
                </Text>
                {Array.isArray(selectedWorkout.exerciseBreakdown) &&
                selectedWorkout.exerciseBreakdown.length > 0 ? (
                  selectedWorkout.exerciseBreakdown.map(
                    (
                      ex: {
                        exerciseId: string;
                        exerciseName: string;
                        setsCompleted: number;
                      },
                      idx: number,
                    ) => (
                      <Text key={`${ex.exerciseId}-${idx}`} style={styles.workoutDetailExerciseItem}>
                        • {ex.exerciseName}: {ex.setsCompleted} sets
                      </Text>
                    ),
                  )
                ) : (
                  <Text style={styles.workoutDetailExerciseItem}>
                    No detailed exercise list saved for this workout.
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Exercise Details Modal */}
      {showExerciseModal && selectedExercise && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Exercise Details</Text>
              <TouchableOpacity
                onPress={() => setShowExerciseModal(false)}
                style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.exerciseDetails}>
              <Text style={styles.exerciseDetailName}>
                {selectedExercise.name}
              </Text>
              <Text style={styles.exerciseDetailDescription}>
                {selectedExercise.description}
              </Text>
              {selectedExercise.imageUrl ? (
                <Image
                  source={{uri: selectedExercise.imageUrl}}
                  style={styles.exerciseDetailImage}
                  resizeMode="contain"
                />
              ) : null}

              <View style={styles.exerciseDetailInfo}>
                <View style={styles.exerciseDetailInfoItem}>
                  <Text style={styles.exerciseDetailInfoLabel}>Difficulty</Text>
                  <Text style={styles.exerciseDetailInfoValue}>
                    {selectedExercise.difficulty}
                  </Text>
                </View>
                <View style={styles.exerciseDetailInfoItem}>
                  <Text style={styles.exerciseDetailInfoLabel}>Equipment</Text>
                  <Text style={styles.exerciseDetailInfoValue}>
                    {selectedExercise.equipment}
                  </Text>
                </View>
                <View style={styles.exerciseDetailInfoItem}>
                  <Text style={styles.exerciseDetailInfoLabel}>
                    Muscle Groups
                  </Text>
                  <Text style={styles.exerciseDetailInfoValue}>
                    {selectedExercise.muscleGroups.join(', ')}
                  </Text>
                </View>
              </View>

              <View style={styles.exerciseInstructions}>
                <Text style={styles.exerciseInstructionsTitle}>
                  Instructions:
                </Text>
                {selectedExercise.instructions.map((instruction, index) => (
                  <Text key={index} style={styles.exerciseInstruction}>
                    {index + 1}. {instruction}
                  </Text>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};


export default WorkoutScreen;
