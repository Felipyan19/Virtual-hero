/**
 * ExerciseTile - Tarjeta de ejercicio en lista
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { BadgeSticker } from './BadgeSticker';
import theme from '@/theme/theme';

export type ExerciseCategory = 'Cardio' | 'Fuerza' | 'Técnica' | 'Movilidad';

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
    Cardio: '#06B6D4',
    Fuerza: '#F97316',
    Técnica: '#10B981',
    Movilidad: '#EC4899',
  };

  const categoryColor = categoryColors[exercise.category];

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
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
    padding: theme.spacing.md,
    position: 'relative',
    height: 200,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
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
    color: theme.colors.ink,
    height: 40,
    lineHeight: 20,
  },
  muscleText: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray600,
    marginTop: 4,
    height: 18,
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
  },
  statText: {
    ...theme.typography.caption,
    color: theme.colors.ink,
    fontWeight: '600',
  },
});
