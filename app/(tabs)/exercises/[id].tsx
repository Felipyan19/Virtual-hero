/**
 * Exercise Detail Screen - Detalle y ejecución de ejercicio
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import theme from '@/theme/theme';
import { PanelCard } from '@/components/PanelCard';
import { BadgeSticker } from '@/components/BadgeSticker';
import { TimerChip } from '@/components/TimerChip';
import { ConfettiPow } from '@/components/ConfettiPow';
import { MarkdownText } from '@/components/MarkdownText';
import { useAppStore } from '@/store/useAppStore';
import { isDailyExercise } from '@/lib/dailyExercise';
import { getExerciseImage } from '@/lib/exerciseImages';
import exercisesData from '@/data/exercises.json';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { xp, level, xpForNextLevel, addXP } = useAppStore();

  const [isRunning, setIsRunning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Animaciones para el badge del ejercicio del día
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const exercise = exercisesData.find((ex) => ex.id === id);
  const isDaily = exercise ? isDailyExercise(exercise.id) : false;
  const xpMultiplier = isDaily ? 2 : 1;
  const displayXP = exercise ? exercise.xp * xpMultiplier : 0;
  const exerciseImage = exercise ? getExerciseImage(exercise.id) : undefined;

  // Animación de pulso para el badge
  useEffect(() => {
    if (isDaily) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );

      pulseAnimation.start();
      glowAnimation.start();

      return () => {
        pulseAnimation.stop();
        glowAnimation.stop();
      };
    }
  }, [isDaily]);

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
    Fuerza: '#F97316',
    Core: '#10B981',
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleComplete = () => {
    setIsRunning(false);
    setShowCelebration(true);

    // Sumar XP - doble si es ejercicio del día
    const xpToAdd = exercise.xp * xpMultiplier;
    const xpLabel = isDaily
      ? `Misión Diaria: ${exercise.name} (x2 XP!)`
      : `Ejercicio: ${exercise.name}`;
    addXP(xpToAdd, xpLabel);

    // TODO: Registrar en DB
    // TODO: Verificar logros
  };

  const handleFinish = () => {
    setIsRunning(false);
    setShowCelebration(true);

    // Sumar XP - doble si es ejercicio del día
    const xpToAdd = exercise.xp * xpMultiplier;
    const xpLabel = isDaily
      ? `Misión Diaria: ${exercise.name} (x2 XP!)`
      : `Ejercicio: ${exercise.name}`;
    addXP(xpToAdd, xpLabel);

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
        {/* Exercise Image */}
        {exerciseImage && (
          <View style={styles.imageCard}>
            <Image source={exerciseImage} style={styles.exerciseImage} resizeMode="cover" />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.imageGradient}
            />
          </View>
        )}

        <PanelCard variant="elevated">
          <Text style={theme.text.h1}>{exercise.name}</Text>

          {/* Badge de Ejercicio del Día */}
          {isDaily && (
            <Animated.View
              style={[
                styles.dailyBadgeContainer,
                {
                  transform: [{ scale: pulseAnim }],
                  opacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ]}
            >
              <LinearGradient
                colors={['#FFD700', '#FFA500', '#FF6347']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.dailyBadge}
              >
                <Text style={styles.dailyBadgeIcon}>⭐</Text>
                <Text style={styles.dailyBadgeText}>MISIÓN DIARIA</Text>
                <Text style={styles.dailyBadgeXP}>DOBLE XP</Text>
              </LinearGradient>
            </Animated.View>
          )}

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
              <Text style={theme.text.body}>
                {displayXP} XP{isDaily && ' x2'}
              </Text>
            </View>
          </View>

          <MarkdownText>{exercise.description}</MarkdownText>

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
              onFinish={handleFinish}
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
  imageCard: {
    height: 240,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
    marginBottom: theme.spacing.sm,
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
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
  dailyBadgeContainer: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  dailyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.md,
    gap: 8,
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  dailyBadgeIcon: {
    fontSize: 20,
  },
  dailyBadgeText: {
    ...theme.typography.h4,
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1.2,
  },
  dailyBadgeXP: {
    ...theme.typography.caption,
    color: '#0F172A',
    fontWeight: '900',
    fontSize: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    letterSpacing: 0.8,
  },
});
