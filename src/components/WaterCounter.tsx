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
        <Text style={styles.count}>{cupsConsumed}</Text>
        <Text style={styles.goal}>/ {Math.ceil(goalML / cupSize)} Vasos</Text>
      </View>

      {/* Botón para agregar vaso */}
      <Animated.View style={animatedStyle}>
        <TouchableOpacity style={styles.button} onPress={handlePress} activeOpacity={0.8}>
          <Text style={styles.buttonIcon}>💧</Text>
          <Text style={styles.buttonText}>Agregar Vaso</Text>
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
    color: theme.colors.info,
    paddingVertical: theme.spacing.sm,
  },
  goal: {
    ...theme.typography.caption,
    color: theme.colors.gray600,
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
  buttonIcon: {
    fontSize: 14,
  },
  buttonText: {
    ...theme.typography.caption,
    color: theme.colors.ink,
    fontWeight: '700',
  },
});
