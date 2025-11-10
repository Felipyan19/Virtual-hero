/**
 * ConfettiPow - Animación de confeti + POW al completar misión
 * Soporta diferentes tipos de celebraciones
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { OnomatopoeiaBurst } from './OnomatopoeiaBurst';

export enum ConfettiType {
  EXERCISE = 'exercise', // Actual - confeti normal
  LEVEL_UP = 'level-up', // Más denso y dorado
  ACHIEVEMENT = 'achievement', // Colores por rareza
  GOAL = 'goal', // Tamaño medio, colores específicos
  SPECIAL = 'special', // Arcoíris - para eventos épicos
  STREAK = 'streak', // Fuego/rojo para rachas
}

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

interface ConfettiPowProps {
  visible: boolean;
  type?: ConfettiType;
  message?: string; // Reemplaza el "¡POW!" predeterminado
  rarity?: AchievementRarity; // Para tipo ACHIEVEMENT
  onComplete?: () => void;
}

const { width, height } = Dimensions.get('window');

const ConfettiPiece: React.FC<{ delay: number; color: string; x: number }> = ({
  delay,
  color,
  x,
}) => {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(x);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(height, { duration: 2000, easing: Easing.linear })
    );

    translateX.value = withDelay(delay, withSpring(x + (Math.random() - 0.5) * 100));

    rotate.value = withDelay(delay, withTiming(Math.random() * 720, { duration: 2000 }));

    opacity.value = withDelay(delay + 1500, withTiming(0, { duration: 500 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.confetti, { backgroundColor: color }, animatedStyle]} />;
};

// Configuración de colores por tipo
const CONFETTI_COLORS: Record<ConfettiType, string[]> = {
  [ConfettiType.EXERCISE]: ['#6D28D9', '#2563EB', '#10B981', '#FACC15', '#DC2626'],
  [ConfettiType.LEVEL_UP]: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE047', '#FACC15'],
  [ConfettiType.GOAL]: ['#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6'],
  [ConfettiType.SPECIAL]: [
    '#EF4444',
    '#F59E0B',
    '#FACC15',
    '#10B981',
    '#06B6D4',
    '#6366F1',
    '#8B5CF6',
    '#EC4899',
  ],
  [ConfettiType.STREAK]: ['#DC2626', '#EF4444', '#F97316', '#FB923C', '#FDBA74'],
  [ConfettiType.ACHIEVEMENT]: ['#6D28D9', '#2563EB', '#10B981', '#FACC15', '#DC2626'], // Por defecto, se reemplaza por rareza
};

// Colores por rareza de logros
const RARITY_COLORS: Record<AchievementRarity, string[]> = {
  common: ['#6B7280', '#9CA3AF', '#D1D5DB'],
  rare: ['#3B82F6', '#06B6D4', '#8B5CF6'],
  epic: ['#8B5CF6', '#A855F7', '#EC4899'],
  legendary: ['#F59E0B', '#EF4444', '#F97316'],
  mythic: ['#EF4444', '#EC4899', '#8B5CF6', '#06B6D4', '#10B981'], // Arcoíris
};

// Cantidad de confeti por tipo
const CONFETTI_COUNT: Record<ConfettiType, number> = {
  [ConfettiType.EXERCISE]: 30,
  [ConfettiType.LEVEL_UP]: 50,
  [ConfettiType.ACHIEVEMENT]: 40,
  [ConfettiType.GOAL]: 35,
  [ConfettiType.SPECIAL]: 100,
  [ConfettiType.STREAK]: 45,
};

// Duración de la animación por tipo
const ANIMATION_DURATION: Record<ConfettiType, number> = {
  [ConfettiType.EXERCISE]: 2500,
  [ConfettiType.LEVEL_UP]: 3500,
  [ConfettiType.ACHIEVEMENT]: 3000,
  [ConfettiType.GOAL]: 2500,
  [ConfettiType.SPECIAL]: 5000,
  [ConfettiType.STREAK]: 3000,
};

// Mensajes predeterminados por tipo
const DEFAULT_MESSAGES: Record<ConfettiType, string> = {
  [ConfettiType.EXERCISE]: '¡POW!',
  [ConfettiType.LEVEL_UP]: '¡LEVEL UP!',
  [ConfettiType.ACHIEVEMENT]: '¡ACHIEVEMENT!',
  [ConfettiType.GOAL]: '¡GOAL!',
  [ConfettiType.SPECIAL]: '¡LEGENDARY!',
  [ConfettiType.STREAK]: '¡ON FIRE!',
};

export const ConfettiPow: React.FC<ConfettiPowProps> = ({
  visible,
  type = ConfettiType.EXERCISE,
  message,
  rarity,
  onComplete,
}) => {
  // Determinar colores según tipo y rareza
  let colors = CONFETTI_COLORS[type];
  if (type === ConfettiType.ACHIEVEMENT && rarity) {
    colors = RARITY_COLORS[rarity];
  }

  const count = CONFETTI_COUNT[type];
  const duration = ANIMATION_DURATION[type];
  const displayMessage = message || DEFAULT_MESSAGES[type];

  useEffect(() => {
    if (visible && onComplete) {
      const timer = setTimeout(onComplete, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, onComplete, duration]);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Confeti */}
      {Array.from({ length: count }).map((_, i) => (
        <ConfettiPiece
          key={i}
          delay={i * 50}
          color={colors[i % colors.length]}
          x={Math.random() * width}
        />
      ))}

      {/* Mensaje */}
      <View style={styles.powContainer}>
        <OnomatopoeiaBurst text={displayMessage} visible={visible} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  confetti: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  powContainer: {
    position: 'absolute',
    top: height / 2 - 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
