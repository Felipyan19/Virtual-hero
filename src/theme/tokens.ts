/**
 * Design Tokens - Virtual Hero
 * Paleta de colores y constantes de diseño con estética cómic/superhéroes
 */

export const colors = {
  // Colores principales
  primary: '#8B5CF6', // Morado vibrante (poder heroico)
  secondary: '#3B82F6', // Azul intenso (acción)
  accent: '#10B981', // Verde éxito (logro)
  pop: '#FCD34D', // Amarillo (onomatopeyas POW/BAM)

  // Fondos y superficies
  paper: '#1E1B2E', // Fondo oscuro principal
  paperDark: '#16141F',
  paperLight: '#2D2640', // Cards/paneles más claros
  ink: '#F9FAFB', // Texto claro
  border: '#3D3555', // Contornos sutiles
  background: '#1E1B2E', // Alias para paper
  text: '#F9FAFB', // Alias para ink
  textSecondary: '#94A3B8', // Alias para gray600

  // Gradientes héroe (ajustados para mejor contraste)
  gradientHero: ['#7C3AED', '#9333EA', '#A855F7'],
  gradientDanger: ['#EF4444', '#F97316'],
  gradientSuccess: ['#10B981', '#14B8A6'],

  // Semánticos
  success: '#10B981',
  warning: '#FCD34D',
  danger: '#EF4444',
  error: '#EF4444', // Alias para danger
  info: '#3B82F6',

  // Neutrales
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#94A3B8',
  gray700: '#64748B',
  gray800: '#334155',
  gray900: '#1E293B',

  // Colores específicos para componentes
  cyan: '#22D3EE', // Para el gauge de pasos (más brillante para mejor visibilidad)
  cyanDark: '#06B6D4',
  yellow: '#FCD34D', // Para streak
  yellowDark: '#F59E0B',

  // Transparencias
  overlay: 'rgba(15, 23, 42, 0.8)',
  overlayLight: 'rgba(255, 255, 255, 0.1)',

  // Ben-Day dots (efecto retro)
  benDayDots: 'rgba(139, 92, 246, 0.08)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};

export const borderWidth = {
  thin: 1,
  medium: 2,
  thick: 3,
  bold: 4,
};

export const shadows = {
  // Sombras offset estilo cómic (desplazadas)
  sm: {
    shadowColor: colors.border,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  md: {
    shadowColor: colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  medium: {
    shadowColor: colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  xl: {
    shadowColor: colors.border,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  strong: {
    shadowColor: colors.border,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
};

export const typography = {
  // Títulos estilo cómic (bold, impacto)
  hero: {
    fontSize: 48,
    fontWeight: '900' as const,
    letterSpacing: -1,
    lineHeight: 52,
  },
  h1: {
    fontSize: 32,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  h3: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: 0,
    lineHeight: 30,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 26,
  },

  // Cuerpo (legibilidad)
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 26,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 20,
  },

  // Especiales
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    lineHeight: 20,
  },

  // Onomatopeyas
  onomatopoeia: {
    fontSize: 36,
    fontWeight: '900' as const,
    letterSpacing: 2,
    lineHeight: 40,
  },
};

export const animations = {
  timing: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    default: 'ease-in-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export const hitSlop = {
  // Áreas táctiles accesibles (mínimo 44x44 iOS)
  sm: { top: 8, bottom: 8, left: 8, right: 8 },
  md: { top: 12, bottom: 12, left: 12, right: 12 },
  lg: { top: 16, bottom: 16, left: 16, right: 16 },
};

export const layout = {
  containerPadding: spacing.md,
  maxContentWidth: 600,
  tabBarHeight: 68,
  headerHeight: 56,
};

export default {
  colors,
  spacing,
  borderRadius,
  borderWidth,
  shadows,
  typography,
  animations,
  hitSlop,
  layout,
};
