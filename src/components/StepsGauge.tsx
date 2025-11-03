/**
 * StepsGauge - Medidor circular de pasos
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import theme from '@/theme/theme';

interface StepsGaugeProps {
  steps: number;
  goal: number;
  size?: number;
}

export const StepsGauge: React.FC<StepsGaugeProps> = ({ steps, goal, size = 120 }) => {
  const progress = Math.min((steps / goal) * 100, 100);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
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
        <Text style={styles.icon}>👟</Text>
        <Text style={styles.number}>{steps.toLocaleString()}</Text>
        <Text style={styles.label}>/ {goal.toLocaleString()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'absolute',
    alignItems: 'center',
    gap: 2,
  },
  icon: {
    fontSize: 20,
  },
  number: {
    fontSize: 24,
    color: theme.colors.ink,
    fontWeight: '900',
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.gray600,
    fontSize: 10,
  },
});
