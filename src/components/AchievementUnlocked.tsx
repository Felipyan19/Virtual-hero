/**
 * AchievementUnlocked - Modal de logro desbloqueado
 * Muestra un modal celebratorio cuando se desbloquea un logro
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '@/theme/theme';
import { ConfettiPow, ConfettiType, AchievementRarity } from './ConfettiPow';
import { playSound, SoundEffect } from '@/lib/sounds';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  rarity?: AchievementRarity;
}

interface AchievementUnlockedProps {
  achievement: Achievement | null;
  visible: boolean;
  soundEnabled?: boolean;
  onClose: () => void;
}

export const AchievementUnlocked: React.FC<AchievementUnlockedProps> = ({
  achievement,
  visible,
  soundEnabled = true,
  onClose,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const iconScale = useSharedValue(0);

  useEffect(() => {
    if (visible && achievement) {
      // Reproducir sonido
      if (soundEnabled) {
        const sound = achievement.rarity === 'legendary' || achievement.rarity === 'mythic'
          ? SoundEffect.LEGENDARY
          : SoundEffect.ACHIEVEMENT;
        playSound(sound);
      }

      // Animaciones
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSequence(
        withSpring(1.1, { damping: 8 }),
        withSpring(1, { damping: 10 })
      );
      iconScale.value = withSequence(
        withSpring(1.3, { damping: 6 }),
        withSpring(1, { damping: 8 })
      );
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = 0;
      iconScale.value = 0;
    }
  }, [visible, achievement]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  if (!achievement) return null;

  // Colores del gradiente según rareza
  const rarityGradients: Record<string, readonly [string, string, ...string[]]> = {
    common: ['#4B5563', '#6B7280'] as const,
    rare: ['#3B82F6', '#8B5CF6'] as const,
    epic: ['#8B5CF6', '#EC4899'] as const,
    legendary: ['#F59E0B', '#EF4444'] as const,
    mythic: ['#EF4444', '#8B5CF6', '#06B6D4'] as const,
  };

  const gradient = achievement.rarity
    ? rarityGradients[achievement.rarity]
    : (['#6D28D9', '#2563EB'] as const);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ConfettiPow
          visible={visible}
          type={ConfettiType.ACHIEVEMENT}
          rarity={achievement.rarity}
          message="¡LOGRO!"
        />

        <Animated.View style={[styles.container, containerStyle]}>
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <Text style={styles.header}>🏆 ¡LOGRO DESBLOQUEADO! 🏆</Text>

            <Animated.View style={[styles.iconContainer, iconStyle]}>
              <Text style={styles.icon}>{achievement.icon}</Text>
            </Animated.View>

            <Text style={styles.title}>{achievement.title}</Text>
            <Text style={styles.description}>{achievement.description}</Text>

            <View style={styles.xpContainer}>
              <Text style={styles.xpLabel}>+{achievement.xpReward} XP</Text>
            </View>

            {achievement.rarity && (
              <View style={styles.rarityBadge}>
                <Text style={styles.rarityText}>
                  {achievement.rarity.toUpperCase()}
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.buttonText}>¡GENIAL!</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  container: {
    width: '100%',
    maxWidth: 400,
  },
  card: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: theme.borderWidth.thick,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.xl,
  },
  header: {
    ...theme.typography.h4,
    color: theme.colors.ink,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    letterSpacing: 1,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: theme.borderWidth.thick,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  icon: {
    fontSize: 60,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.ink,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.ink,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: theme.spacing.lg,
  },
  xpContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    borderWidth: theme.borderWidth.medium,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    marginBottom: theme.spacing.md,
  },
  xpLabel: {
    ...theme.typography.h3,
    color: theme.colors.ink,
    fontWeight: '900',
  },
  rarityBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },
  rarityText: {
    ...theme.typography.caption,
    color: theme.colors.ink,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.medium,
    borderColor: theme.colors.border,
    marginTop: theme.spacing.sm,
    ...theme.shadows.md,
  },
  buttonText: {
    ...theme.typography.button,
    color: theme.colors.paperDark,
    fontWeight: '900',
  },
});
