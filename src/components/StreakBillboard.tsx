/**
 * StreakBillboard - Cartelera de racha con llamas
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '@/theme/theme';
import { getStreakMessage } from '@/lib/streaks';

interface StreakBillboardProps {
  streakCount: number;
  longestStreak: number;
}

export const StreakBillboard: React.FC<StreakBillboardProps> = ({ streakCount, longestStreak }) => {
  const message = getStreakMessage(streakCount);

  return (
    <View style={styles.wrapper}>
      <View style={styles.background}>
        <View style={styles.content}>
          <Text style={styles.flame}>🔥</Text>

          <View style={styles.info}>
            <Text style={styles.label}>STREAK</Text>
            <Text style={styles.count}>{streakCount} DAYS</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.medium,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  background: {
    backgroundColor: theme.colors.paperLight,
    padding: theme.spacing.lg,
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  flame: {
    fontSize: 32,
  },
  info: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.gray600,
    fontWeight: '700',
    letterSpacing: 1,
  },
  count: {
    fontSize: 40,
    fontWeight: '900',
    color: theme.colors.yellow,
    letterSpacing: -1,
  },
});
