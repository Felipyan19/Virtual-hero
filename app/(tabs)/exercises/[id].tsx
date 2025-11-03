/**
 * Exercise Detail Screen - Detalle y ejecución de ejercicio
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import theme from '@/theme/theme';
import { PanelCard } from '@/components/PanelCard';
import { BadgeSticker } from '@/components/BadgeSticker';
import { TimerChip } from '@/components/TimerChip';
import { ConfettiPow } from '@/components/ConfettiPow';
import { useAppStore } from '@/store/useAppStore';
import { calculateXP, XPSource } from '@/lib/xp';
import exercisesData from '@/data/exercises.json';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addXP } = useAppStore();

  const [isRunning, setIsRunning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const exercise = exercisesData.find((ex) => ex.id === id);

  if (!exercise) {
    return (
      <View style={[theme.layout.container, theme.layout.center]}>
        <Text style={theme.text.h2}>Ejercicio no encontrado</Text>
      </View>
    );
  }

  const difficultyColors: Record<string, 'success' | 'warning' | 'danger'> = {
    fácil: 'success',
    medio: 'warning',
    difícil: 'danger',
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleComplete = () => {
    setIsRunning(false);
    setShowCelebration(true);

    // Sumar XP
    const xpAmount = calculateXP(XPSource.EXERCISE_COMPLETE);
    addXP(xpAmount + exercise.xp, `Ejercicio: ${exercise.name}`);

    // TODO: Registrar en DB
    // TODO: Verificar logros
  };

  const handleCelebrationEnd = () => {
    setShowCelebration(false);
    router.back();
  };

  return (
    <View style={theme.layout.container}>
      <ConfettiPow visible={showCelebration} onComplete={handleCelebrationEnd} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <PanelCard variant="elevated">
          <View style={styles.titleRow}>
            <Text style={theme.text.h1}>{exercise.name}</Text>
            <BadgeSticker
              label={exercise.difficulty}
              variant={difficultyColors[exercise.difficulty]}
            />
          </View>

          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>💪</Text>
              <Text style={theme.text.body}>{exercise.muscle}</Text>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>⏱️</Text>
              <Text style={theme.text.body}>{Math.floor(exercise.duration / 60)} min</Text>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>⚡</Text>
              <Text style={theme.text.body}>{exercise.xp} XP</Text>
            </View>
          </View>

          <Text style={[theme.text.body, styles.description]}>{exercise.description}</Text>
        </PanelCard>

        {/* Timer */}
        {isRunning ? (
          <PanelCard>
            <TimerChip
              durationSeconds={exercise.duration}
              isRunning={isRunning}
              onComplete={handleComplete}
            />
          </PanelCard>
        ) : (
          <TouchableOpacity
            style={[theme.buttons.success, styles.startButton]}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <Text style={theme.buttons.textPrimary}>🎯 Iniciar Misión</Text>
          </TouchableOpacity>
        )}

        {/* Instrucciones placeholder */}
        <PanelCard>
          <Text style={theme.text.h4}>📋 Instrucciones</Text>
          <Text style={[theme.text.body, { marginTop: theme.spacing.sm }]}>
            1. Prepara tu espacio{'\n'}
            2. Sigue el temporizador{'\n'}
            3. Mantén buena forma{'\n'}
            4. ¡Completa la misión!
          </Text>
        </PanelCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: theme.borderWidth.thick,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.paper,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.round,
    borderWidth: theme.borderWidth.thick,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.paper,
    ...theme.shadows.sm,
  },
  backIcon: {
    fontSize: 24,
    color: theme.colors.ink,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  meta: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    fontSize: 18,
  },
  description: {
    color: theme.colors.gray600,
    lineHeight: 24,
  },
  startButton: {
    ...theme.shadows.lg,
  },
});
