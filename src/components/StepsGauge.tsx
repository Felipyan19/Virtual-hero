/**
 * StepsGauge - Medidor circular de pasos
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import theme from '@/theme/theme';

interface StepsGaugeProps {
  steps: number;
  goal: number;
  size?: number;
  onSync?: () => void;
}

export const StepsGauge: React.FC<StepsGaugeProps> = ({ steps, goal, size = 100, onSync }) => {
  const progress = Math.min((steps / goal) * 100, 100);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>PASOS</Text>
        <Text style={styles.headerIcon}>👟</Text>
      </View>

      <View style={[styles.gaugeContainer, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          {/* Fondo */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.colors.gray800}
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Progreso */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.colors.cyan}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>

        <View style={styles.content}>
          <Text style={styles.number}>{steps.toLocaleString()}</Text>
          <Text style={styles.goalText}>/ {goal.toLocaleString()}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={onSync} activeOpacity={0.8}>
        <Text style={styles.buttonIcon}>🔄</Text>
        <Text style={styles.buttonText}>Sincronizar</Text>
      </TouchableOpacity>
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
  headerIcon: {
    fontSize: 24,
  },
  gaugeContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'absolute',
    alignItems: 'center',
    gap: 2,
  },
  number: {
    fontSize: 24,
    color: theme.colors.ink,
    fontWeight: '900',
  },
  goalText: {
    ...theme.typography.caption,
    color: theme.colors.gray600,
    fontSize: 10,
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
