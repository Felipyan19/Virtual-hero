/**
 * ExerciseTile - Tarjeta de ejercicio en lista
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { BadgeSticker } from './BadgeSticker';
import theme from '@/theme/theme';
import { getExerciseImage } from '@/lib/exerciseImages';

export type ExerciseCategory = 'Fuerza' | 'Core';

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  category: ExerciseCategory;
  difficulty: 'fácil' | 'medio' | 'difícil';
  duration: number; // segundos
  xp: number;
  description: string;
  media?: string;
}

interface ExerciseTileProps {
  exercise: Exercise;
  onPress: () => void;
}

export const ExerciseTile: React.FC<ExerciseTileProps> = ({ exercise, onPress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const difficultyColors: Record<string, 'success' | 'warning' | 'danger'> = {
    fácil: 'success',
    medio: 'warning',
    difícil: 'danger',
  };

  const categoryColors: Record<ExerciseCategory, string> = {
    Fuerza: '#F97316',
    Core: '#10B981',
  };

  const categoryColor = categoryColors[exercise.category];
  const exerciseImage = getExerciseImage(exercise.id);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
        {/* Exercise Image */}
        {exerciseImage && (
          <View style={styles.imageContainer}>
            <Image source={exerciseImage} style={styles.exerciseImage} resizeMode="cover" />
            <View style={styles.imageOverlay} />
          </View>
        )}

        <View style={styles.content}>
          {/* Exercise Name */}
          <Text style={styles.exerciseName} numberOfLines={2}>
            {exercise.name}
          </Text>

          {/* Muscle Group */}
          <Text style={styles.muscleText} numberOfLines={1}>
            💪 {exercise.muscle}
          </Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statIcon}>⏱️</Text>
              <Text style={styles.statText}>{Math.floor(exercise.duration / 60)}min</Text>
            </View>

            <View style={styles.stat}>
              <Text style={styles.statIcon}>⚡</Text>
              <Text style={styles.statText}>{exercise.xp} XP</Text>
            </View>
          </View>

          {/* Badges Row - Bottom */}
          <View style={styles.badgesRow}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
              <Text style={styles.categoryText}>{exercise.category}</Text>
            </View>
            <BadgeSticker
              label={exercise.difficulty}
              variant={difficultyColors[exercise.difficulty]}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...theme.comicPanel.base,
    padding: 0,
    position: 'relative',
    height: 200,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    position: 'relative',
    zIndex: 1,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  categoryText: {
    ...theme.typography.caption,
    color: theme.colors.paper,
    fontWeight: '700',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    height: 40,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  muscleText: {
    ...theme.typography.bodySmall,
    color: '#FFFFFF',
    marginTop: 4,
    height: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
    height: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  statText: {
    ...theme.typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
