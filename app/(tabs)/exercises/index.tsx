/**
 * Exercises Screen - Arsenal de Entrenamiento
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import theme from '@/theme/theme';
import { ExerciseTile, Exercise } from '@/components/ExerciseTile';
import exercisesData from '@/data/exercises.json';

type FilterType = 'category' | 'muscle';

type FilterChip = {
  label: string;
  value: string;
  icon: string;
  color: string;
  type: FilterType;
};

const FILTER_CHIPS: FilterChip[] = [
  // Categorías
  { label: 'Todos', value: 'Todos', icon: '⚡', color: '#06B6D4', type: 'category' },
  { label: 'Fuerza', value: 'Fuerza', icon: '💪', color: '#F97316', type: 'category' },
  { label: 'Core', value: 'Core', icon: '🔥', color: '#10B981', type: 'category' },

  // Grupos musculares - Tren Superior
  { label: 'Pecho', value: 'Pecho', icon: '🦾', color: '#EC4899', type: 'muscle' },
  { label: 'Espalda', value: 'Espalda', icon: '🛡️', color: '#8B5CF6', type: 'muscle' },
  { label: 'Dorsales', value: 'Dorsal', icon: '🏋️', color: '#7C3AED', type: 'muscle' },
  { label: 'Bíceps', value: 'Bíceps', icon: '💪', color: '#3B82F6', type: 'muscle' },
  { label: 'Tríceps', value: 'Tríceps', icon: '🔱', color: '#14B8A6', type: 'muscle' },
  { label: 'Deltoides', value: 'Deltoides', icon: '🎯', color: '#F59E0B', type: 'muscle' },

  // Grupos musculares - Core
  { label: 'Abdominales', value: 'Abdominales', icon: '🔥', color: '#10B981', type: 'muscle' },

  // Grupos musculares - Tren Inferior
  { label: 'Cuádriceps', value: 'Cuádriceps', icon: '🦵', color: '#EF4444', type: 'muscle' },
  { label: 'Isquios', value: 'Isquiotibiales', icon: '🦴', color: '#DC2626', type: 'muscle' },
  { label: 'Glúteos', value: 'Glúteos', icon: '🍑', color: '#F97316', type: 'muscle' },
  { label: 'Gemelos', value: 'Gemelos', icon: '🦶', color: '#EA580C', type: 'muscle' },
];

export default function ExercisesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('Todos');
  const [selectedFilterType, setSelectedFilterType] = useState<FilterType>('category');
  const [scaleAnim] = useState(new Animated.Value(1));

  const exercises: Exercise[] = exercisesData as Exercise[];

  const filteredExercises = useMemo(() => {
    let result = exercises;

    // Filter by category or muscle
    if (selectedFilter !== 'Todos') {
      if (selectedFilterType === 'category') {
        result = result.filter((ex) => ex.category === selectedFilter);
      } else {
        // Filter by muscle group
        result = result.filter((ex) =>
          ex.muscle.toLowerCase().includes(selectedFilter.toLowerCase())
        );
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (ex) =>
          ex.name.toLowerCase().includes(query) ||
          ex.muscle.toLowerCase().includes(query) ||
          ex.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [exercises, selectedFilter, selectedFilterType, searchQuery]);

  const handleFilterPress = (value: string, type: FilterType) => {
    setSelectedFilter(value);
    setSelectedFilterType(type);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={theme.layout.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={theme.text.h1}>Ejercicios</Text>
        <Text style={styles.subtitle}>¿Qué músculo quieres entrenar, héroe?</Text>
      </View>

      {/* Exercise Grid */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar ejercicio..."
            placeholderTextColor={theme.colors.gray500}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Category and Muscle Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          {FILTER_CHIPS.map((chip) => {
            const isActive = selectedFilter === chip.value && selectedFilterType === chip.type;
            return (
              <TouchableOpacity
                key={`${chip.type}-${chip.value}`}
                style={[
                  styles.filterChip,
                  isActive && { backgroundColor: chip.color, borderColor: chip.color },
                ]}
                onPress={() => handleFilterPress(chip.value, chip.type)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipIcon}>{chip.icon}</Text>
                <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.grid}>
          {filteredExercises.map((exercise, index) => (
            <View key={exercise.id} style={styles.gridItem}>
              <ExerciseTile
                exercise={exercise}
                onPress={() => router.push(`/exercises/${exercise.id}`)}
              />
            </View>
          ))}
        </View>

        {filteredExercises.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No se encontraron ejercicios</Text>
            <Text style={styles.emptyText}>Intenta con otro término de búsqueda o categoría</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.md,
    paddingTop: 60,
    backgroundColor: theme.colors.paper,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.gray600,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.medium,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.ink,
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 16,
    color: theme.colors.gray500,
    fontWeight: '700',
  },
  filtersScroll: {
    flexGrow: 0,
    marginBottom: theme.spacing.md,
  },
  filtersContent: {
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: theme.borderRadius.round,
    borderWidth: theme.borderWidth.medium,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.paper,
    gap: 6,
  },
  chipIcon: {
    fontSize: 16,
  },
  chipLabel: {
    ...theme.typography.caption,
    color: theme.colors.ink,
    fontWeight: '700',
  },
  chipLabelActive: {
    color: theme.colors.paper,
  },
  list: {
    flex: 1,
  },
  gridContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: theme.spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    ...theme.typography.h3,
    color: theme.colors.ink,
    marginBottom: 4,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.gray600,
    textAlign: 'center',
  },
});
