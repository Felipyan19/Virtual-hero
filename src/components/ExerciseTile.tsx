/**
 * ExerciseTile - Tarjeta de ejercicio en lista
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BadgeSticker } from './BadgeSticker';
import theme from '@/theme/theme';

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
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
  const difficultyColors: Record<string, 'success' | 'warning' | 'danger'> = {
    fácil: 'success',
    medio: 'warning',
    difícil: 'danger',
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={theme.text.h4}>{exercise.name}</Text>
        <BadgeSticker label={exercise.difficulty} variant={difficultyColors[exercise.difficulty]} />
      </View>

      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>💪</Text>
          <Text style={theme.text.bodySmall}>{exercise.muscle}</Text>
        </View>

        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>⏱️</Text>
          <Text style={theme.text.bodySmall}>{Math.floor(exercise.duration / 60)}min</Text>
        </View>

        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>⚡</Text>
          <Text style={theme.text.bodySmall}>{exercise.xp} XP</Text>
        </View>
      </View>

      <Text style={[theme.text.bodySmall, styles.description]} numberOfLines={2}>
        {exercise.description}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    ...theme.comicPanel.base,
    gap: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meta: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    fontSize: 14,
  },
  description: {
    color: theme.colors.gray600,
  },
});
