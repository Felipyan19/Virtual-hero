/**
 * SpeechBubble - Bocadillo de diálogo estilo cómic
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '@/theme/theme';

interface SpeechBubbleProps {
  message: string;
  variant?: 'base' | 'success' | 'warning' | 'info';
  icon?: string;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({ message, variant = 'base', icon }) => {
  return (
    <View style={[theme.speechBubble.base, variant !== 'base' && theme.speechBubble[variant]]}>
      <View style={styles.content}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={[theme.text.body, variant !== 'base' && styles.lightText]}>{message}</Text>
      </View>
      {/* Punta del bocadillo */}
      <View style={[styles.tail, variant !== 'base' && styles.tailColored]} />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  icon: {
    fontSize: 24,
  },
  lightText: {
    color: theme.colors.paper,
  },
  tail: {
    position: 'absolute',
    bottom: -10,
    left: 24,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: theme.colors.paper,
  },
  tailColored: {
    // Para variantes con color, usar el color de fondo
  },
});
