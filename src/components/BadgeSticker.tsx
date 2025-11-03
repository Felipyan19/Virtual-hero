/**
 * BadgeSticker - Badge/etiqueta estilo sticker de cómic
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import theme from '@/theme/theme';

interface BadgeStickerProps {
  label: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'primary';
  icon?: string;
  style?: ViewStyle;
}

export const BadgeSticker: React.FC<BadgeStickerProps> = ({
  label,
  variant = 'primary',
  icon,
  style,
}) => {
  return (
    <View style={[theme.badges.base, theme.badges[variant], style]}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={theme.badges.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 12,
    marginRight: 4,
  },
});
