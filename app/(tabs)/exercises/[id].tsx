/**
 * Exercise Detail Screen - Detalle y ejecución de ejercicio
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  const { xp, level, xpForNextLevel, addXP } = useAppStore();

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

  const categoryColors: Record<string, string> = {
    Cardio: '#06B6D4',
    Fuerza: '#F97316',
    Técnica: '#10B981',
    Movilidad: '#EC4899',
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleComplete = () => {
    setIsRunning(false);
    setShowCelebration(true);

    // Sumar XP - usar solo el XP del ejercicio
    addXP(exercise.xp, `Ejercicio: ${exercise.name}`);

    // TODO: Registrar en DB
    // TODO: Verificar logros
  };

  const handleCelebrationEnd = () => {
    setShowCelebration(false);
    router.push('/(tabs)/exercises');
  };

  const progressPercentage = (xp / xpForNextLevel) * 100;

  return (
    <View style={theme.layout.container}>
      <ConfettiPow visible={showCelebration} onComplete={handleCelebrationEnd} />

      {/* Header con barra de XP */}
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6', '#7C3AED']}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <BadgeSticker
            label={`Nv. ${level}`}
            variant="primary"
            icon="⚡"
            style={styles.levelBadge}
          />
        </View>

        {/* Indicador y barra de progreso de nivel */}
        <View style={styles.xpRow}>
          <Text style={styles.xpLabel}>
            {xp}/{xpForNextLevel} XP
          </Text>
        </View>
        <View style={styles.xpBar}>
          <View style={[styles.xpFill, { width: `${progressPercentage}%` }]} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <PanelCard variant="elevated">
          <Text style={theme.text.h1}>{exercise.name}</Text>

          <View style={styles.muscleRow}>
            <Text style={styles.metaIcon}>💪</Text>
            <Text style={[theme.text.body, styles.muscleText]}>{exercise.muscle}</Text>
          </View>

          <View style={styles.meta}>
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

          {/* Badges Row - Bottom */}
          <View style={styles.badgesRow}>
            <View
              style={[styles.categoryBadge, { backgroundColor: categoryColors[exercise.category] }]}
            >
              <Text style={styles.categoryText}>{exercise.category}</Text>
            </View>
            <BadgeSticker
              label={exercise.difficulty}
              variant={difficultyColors[exercise.difficulty]}
            />
          </View>
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
          <TouchableOpacity style={[styles.startButton]} onPress={handleStart} activeOpacity={0.8}>
            <Text style={styles.startButtonText}>🎯 Iniciar Misión</Text>
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
    paddingBottom: 24,
    paddingHorizontal: theme.spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.round,
    borderWidth: theme.borderWidth.thick,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  backIcon: {
    fontSize: 24,
    color: theme.colors.ink,
  },
  levelBadge: {
    backgroundColor: theme.colors.paperLight,
    borderColor: theme.colors.primary,
  },
  xpRow: {
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  xpLabel: {
    ...theme.typography.caption,
    color: theme.colors.ink,
    opacity: 0.9,
  },
  xpBar: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
    borderWidth: theme.borderWidth.thin,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  xpFill: {
    height: '100%',
    backgroundColor: theme.colors.cyan,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  muscleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: theme.spacing.sm,
  },
  muscleText: {
    color: theme.colors.gray600,
  },
  meta: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    marginTop: theme.spacing.sm,
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
    marginTop: theme.spacing.md,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
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
  startButton: {
    backgroundColor: '#06B6D4',
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.medium,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.lg,
  },
  startButtonText: {
    color: theme.colors.ink,
    ...theme.typography.button,
  },
});
