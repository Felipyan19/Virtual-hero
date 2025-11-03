/**
 * Exercises Screen - Lista de ejercicios
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import theme from '@/theme/theme';
import { ExerciseTile, Exercise } from '@/components/ExerciseTile';
import exercisesData from '@/data/exercises.json';

export default function ExercisesScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<'todos' | 'fácil' | 'medio' | 'difícil'>('todos');

  const exercises: Exercise[] = exercisesData;

  const filteredExercises =
    filter === 'todos' ? exercises : exercises.filter((ex) => ex.difficulty === filter);

  return (
    <View style={theme.layout.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={theme.text.h1}>💪 Ejercicios</Text>
        <Text style={theme.text.body}>Completa misiones y gana XP</Text>
      </View>

      {/* Filtros */}
      <View style={styles.filters}>
        {(['todos', 'fácil', 'medio', 'difícil'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterButton, filter === f && styles.filterButtonActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredExercises.map((exercise) => (
          <ExerciseTile
            key={exercise.id}
            exercise={exercise}
            onPress={() => router.push(`/exercises/${exercise.id}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.md,
    paddingTop: 60,
    borderBottomWidth: theme.borderWidth.thick,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.paper,
  },
  filters: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    borderWidth: theme.borderWidth.medium,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.paper,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    ...theme.typography.caption,
    color: theme.colors.ink,
    fontWeight: '700',
  },
  filterTextActive: {
    color: theme.colors.paper,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
});
