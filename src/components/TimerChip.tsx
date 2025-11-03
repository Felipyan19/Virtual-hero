/**
 * TimerChip - Temporizador visual para ejercicios
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '@/theme/theme';

interface TimerChipProps {
  durationSeconds: number;
  isRunning: boolean;
  onComplete?: () => void;
}

export const TimerChip: React.FC<TimerChipProps> = ({ durationSeconds, isRunning, onComplete }) => {
  const [remaining, setRemaining] = useState(durationSeconds);

  useEffect(() => {
    if (!isRunning) {
      setRemaining(durationSeconds);
      return;
    }

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onComplete) {
            onComplete();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, durationSeconds]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progress = ((durationSeconds - remaining) / durationSeconds) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <Text style={styles.time}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: theme.colors.gray200,
    borderRadius: theme.borderRadius.round,
    borderWidth: theme.borderWidth.medium,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  time: {
    ...theme.typography.hero,
    color: theme.colors.ink,
  },
});
