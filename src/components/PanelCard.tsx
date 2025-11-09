/**
 * PanelCard - Tarjeta contenedora con estilo viñeta de cómic
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '@/theme/theme';

interface PanelCardProps {
  children: React.ReactNode;
  variant?: 'base' | 'elevated' | 'flat';
  gradient?: readonly [string, string, ...string[]];
  gradientLocations?: readonly [number, number, ...number[]];
  style?: ViewStyle;
}

export const PanelCard: React.FC<PanelCardProps> = ({
  children,
  variant = 'base',
  gradient,
  gradientLocations,
  style,
}) => {
  if (gradient) {
    return (
      <View style={[styles.gradientWrapper, style]}>
        <LinearGradient
          colors={gradient}
          locations={gradientLocations}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {children}
        </LinearGradient>
      </View>
    );
  }

  return <View style={[theme.comicPanel[variant], style]}>{children}</View>;
};

const styles = StyleSheet.create({
  gradientWrapper: {
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.medium,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  gradient: {
    padding: theme.spacing.md,
  },
});
