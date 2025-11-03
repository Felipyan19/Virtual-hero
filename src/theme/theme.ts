/**
 * Theme System - Virtual Giro
 * Utilidades y estilos componibles para el sistema de diseño cómic
 */

import { StyleSheet } from 'react-native';
import tokens from './tokens';

const { colors, spacing, borderRadius, borderWidth, shadows, typography } = tokens;

/**
 * Estilos base para paneles/tarjetas con estilo cómic
 */
export const comicPanel = StyleSheet.create({
  base: {
    backgroundColor: colors.paperLight,
    borderRadius: borderRadius.md,
    borderWidth: borderWidth.medium,
    borderColor: colors.border,
    padding: spacing.md,
  },
  elevated: {
    backgroundColor: colors.paperLight,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.medium,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  flat: {
    backgroundColor: colors.paperLight,
    borderRadius: borderRadius.sm,
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
    padding: spacing.sm,
  },
  gradient: {
    borderRadius: borderRadius.md,
    borderWidth: borderWidth.medium,
    borderColor: colors.border,
    padding: spacing.md,
  },
});

/**
 * Estilos para bocadillos de diálogo
 */
export const speechBubble = StyleSheet.create({
  base: {
    backgroundColor: colors.paperLight,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.medium,
    borderColor: colors.border,
    padding: spacing.md,
    position: 'relative',
  },
  success: {
    backgroundColor: colors.accent,
    borderColor: colors.border,
  },
  warning: {
    backgroundColor: colors.warning,
    borderColor: colors.border,
  },
  info: {
    backgroundColor: colors.secondary,
    borderColor: colors.border,
  },
});

/**
 * Estilos de botones heroicos
 */
export const buttons = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    borderWidth: borderWidth.medium,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.md,
    borderWidth: borderWidth.medium,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  success: {
    backgroundColor: colors.success,
    borderRadius: borderRadius.md,
    borderWidth: borderWidth.medium,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius.md,
    borderWidth: borderWidth.medium,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textPrimary: {
    color: colors.ink,
    ...typography.button,
  },
  textOutline: {
    color: colors.ink,
    ...typography.button,
  },
});

/**
 * Estilos de badges/stickers
 */
export const badges = StyleSheet.create({
  base: {
    borderRadius: borderRadius.round,
    borderWidth: borderWidth.medium,
    borderColor: colors.border,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  success: {
    backgroundColor: colors.success,
  },
  warning: {
    backgroundColor: colors.warning,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  info: {
    backgroundColor: colors.info,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  text: {
    color: colors.ink,
    ...typography.caption,
    fontWeight: '700',
  },
});

/**
 * Utilidades de texto
 */
export const text = StyleSheet.create({
  hero: {
    ...typography.hero,
    color: colors.ink,
  },
  h1: {
    ...typography.h1,
    color: colors.ink,
  },
  h2: {
    ...typography.h2,
    color: colors.ink,
  },
  h3: {
    ...typography.h3,
    color: colors.ink,
  },
  h4: {
    ...typography.h4,
    color: colors.ink,
  },
  body: {
    ...typography.body,
    color: colors.ink,
  },
  bodyLarge: {
    ...typography.bodyLarge,
    color: colors.ink,
  },
  bodySmall: {
    ...typography.bodySmall,
    color: colors.ink,
  },
  caption: {
    ...typography.caption,
    color: colors.gray600,
  },
  onomatopoeia: {
    ...typography.onomatopoeia,
    color: colors.pop,
    textShadowColor: colors.border,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  light: {
    color: colors.paper,
  },
  muted: {
    color: colors.gray600,
  },
  center: {
    textAlign: 'center',
  },
  bold: {
    fontWeight: '700',
  },
});

/**
 * Layout utilities
 */
export const layout = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  containerPadded: {
    flex: 1,
    backgroundColor: colors.paper,
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaced: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerHorizontal: {
    alignItems: 'center',
  },
  centerVertical: {
    justifyContent: 'center',
  },
});

/**
 * Función helper para crear gradiente con contorno
 */
export const createGradientStyle = (gradientColors: string[]) => ({
  borderRadius: borderRadius.md,
  borderWidth: borderWidth.thick,
  borderColor: colors.border,
  ...shadows.md,
});

export default {
  colors,
  spacing,
  borderRadius,
  borderWidth,
  shadows,
  typography,
  comicPanel,
  speechBubble,
  buttons,
  badges,
  text,
  layout,
  createGradientStyle,
};
