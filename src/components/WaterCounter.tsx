/**
 * WaterCounter - Contador de vasos de agua con animación
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import theme from '@/theme/theme';

interface WaterCounterProps {
  currentML: number;
  goalML: number;
  cupsConsumed: number;
  cupSize: number;
  onAddCup: () => void;
}

export const WaterCounter: React.FC<WaterCounterProps> = ({
  currentML,
  goalML,
  cupsConsumed,
  cupSize,
  onAddCup,
}) => {
  const scale = useSharedValue(1);
  const progress = Math.min((currentML / goalML) * 100, 100);
  const goalMet = currentML >= goalML;

  const handlePress = () => {
    scale.value = withSpring(0.9, { damping: 5 }, () => {
      scale.value = withSpring(1);
    });
    onAddCup();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>AGUA</Text>
        <Text style={styles.icon}>💧</Text>
      </View>

      <View style={styles.stats}>
        <Text style={styles.count}>
          <Text style={styles.countCurrent}>{cupsConsumed}</Text>
          <Text style={styles.countGoal}> / {Math.ceil(goalML / cupSize)}</Text>
        </Text>
      </View>

      {/* Indicador de meta en ML */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {currentML}ml / {goalML}ml
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Botón para agregar vaso */}
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          style={[styles.button, goalMet && styles.buttonSuccess]}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonIcon}>💧</Text>
          <Text style={styles.buttonText}>{goalMet ? '¡Meta Cumplida!' : 'Agregar Vaso'}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 200,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.gray600,
    fontWeight: '700',
    letterSpacing: 1,
  },
  icon: {
    fontSize: 24,
  },
  stats: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  count: {
    fontSize: 36,
    fontWeight: '900',
    paddingVertical: theme.spacing.sm,
  },
  countCurrent: {
    color: theme.colors.info,
  },
  countGoal: {
    color: theme.colors.gray600,
  },
  goal: {
    ...theme.typography.caption,
    color: theme.colors.gray600,
  },
  progressContainer: {
    width: '100%',
    gap: theme.spacing.xs,
    alignItems: 'center',
  },
  progressText: {
    ...theme.typography.caption,
    color: theme.colors.gray600,
    fontSize: 11,
    fontWeight: '600',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: theme.colors.gray800,
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#06B6D4',
    borderRadius: theme.borderRadius.round,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: '#06B6D4',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.border,
  },
  buttonSuccess: {
    backgroundColor: '#10B981',
  },
  buttonIcon: {
    fontSize: 14,
  },
  buttonText: {
    ...theme.typography.caption,
    color: theme.colors.ink,
    fontWeight: '700',
  },
});
