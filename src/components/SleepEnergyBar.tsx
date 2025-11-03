/**
 * SleepEnergyBar - Barra de energía basada en sueño
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '@/theme/theme';

interface SleepEnergyBarProps {
  sleepMinutes: number;
  targetMinutes: number;
  bedTime?: string;
  wakeTime?: string;
}

export const SleepEnergyBar: React.FC<SleepEnergyBarProps> = ({
  sleepMinutes,
  targetMinutes,
  bedTime,
  wakeTime,
}) => {
  const progress = Math.min((sleepMinutes / targetMinutes) * 100, 100);
  const hours = Math.floor(sleepMinutes / 60);
  const minutes = sleepMinutes % 60;
  const goalMet = sleepMinutes >= targetMinutes;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>SUEÑO</Text>
      </View>

      {/* Barra de energía con gradiente */}
      <View style={styles.barContainer}>
        <LinearGradient
          colors={['#10B981', '#14B8A6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.barFill, { width: `${progress}%` }]}
        />
      </View>

      <View style={styles.stats}>
        <Text style={styles.time}>
          {hours}h {minutes}m
        </Text>

        {bedTime && wakeTime && (
          <Text style={styles.schedule}>
            Dormir: {bedTime} - Despertar: {wakeTime}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.gray600,
    fontWeight: '700',
    letterSpacing: 1,
  },
  barContainer: {
    height: 12,
    backgroundColor: theme.colors.gray800,
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: theme.borderRadius.round,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  time: {
    ...theme.typography.bodySmall,
    color: theme.colors.success,
    fontWeight: '700',
  },
  schedule: {
    ...theme.typography.caption,
    color: theme.colors.gray600,
    fontSize: 10,
  },
});
