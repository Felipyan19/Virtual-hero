/**
 * LevelUpOverlay - Modal de subida de nivel
 * Celebración épica cuando el usuario sube de nivel
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '@/theme/theme';
import { ConfettiPow, ConfettiType } from './ConfettiPow';
import { playSound, SoundEffect } from '@/lib/sounds';
import { getLevelRewards, getLevelTitle } from '@/lib/xp';

interface LevelUpOverlayProps {
  level: number | null;
  visible: boolean;
  soundEnabled?: boolean;
  onClose: () => void;
}

export const LevelUpOverlay: React.FC<LevelUpOverlayProps> = ({
  level,
  visible,
  soundEnabled = true,
  onClose,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const starRotation = useSharedValue(0);
  const starScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible && level) {
      // Reproducir sonido
      if (soundEnabled) {
        playSound(SoundEffect.LEVEL_UP);
      }

      // Animaciones
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSequence(withSpring(1.15, { damping: 6 }), withSpring(1, { damping: 10 }));

      // Estrella giratoria
      starRotation.value = withRepeat(
        withTiming(360, { duration: 3000, easing: Easing.linear }),
        -1, // Infinito
        false
      );

      // Pulso de la estrella
      starScale.value = withRepeat(
        withSequence(withTiming(1.2, { duration: 600 }), withTiming(1, { duration: 600 })),
        -1,
        true
      );

      // Brillo de fondo
      glowOpacity.value = withRepeat(
        withSequence(withTiming(0.4, { duration: 800 }), withTiming(0.2, { duration: 800 })),
        -1,
        true
      );
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = 0;
      starRotation.value = 0;
      starScale.value = 1;
      glowOpacity.value = 0;
    }
  }, [visible, level]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const starStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${starRotation.value}deg` }, { scale: starScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  if (!level) return null;

  const rewards = getLevelRewards(level);
  const title = getLevelTitle(level);
  const isSpecialLevel = level % 5 === 0;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <ConfettiPow
          visible={visible}
          type={isSpecialLevel ? ConfettiType.SPECIAL : ConfettiType.LEVEL_UP}
          message={isSpecialLevel ? '¡EPIC!' : '¡LEVEL UP!'}
        />

        {/* Brillo de fondo */}
        <Animated.View style={[styles.glow, glowStyle]} />

        <Animated.View style={[styles.container, containerStyle]}>
          <LinearGradient
            colors={['#F59E0B', '#FBBF24', '#FCD34D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <Text style={styles.header}>
              {isSpecialLevel ? '⭐ ¡NIVEL ESPECIAL! ⭐' : '⚡ ¡NIVEL SUBIDO! ⚡'}
            </Text>

            {/* Estrella giratoria */}
            <Animated.View style={[styles.starContainer, starStyle]}>
              <Text style={styles.star}>⭐</Text>
            </Animated.View>

            <View style={styles.levelContainer}>
              <Text style={styles.levelLabel}>NIVEL</Text>
              <Text style={styles.level}>{level}</Text>
            </View>

            <Text style={styles.title}>{title}</Text>

            {rewards.length > 0 && (
              <View style={styles.rewardsContainer}>
                <Text style={styles.rewardsHeader}>🎁 Recompensas:</Text>
                {rewards.map((reward, index) => (
                  <Text key={index} style={styles.reward}>
                    {reward}
                  </Text>
                ))}
              </View>
            )}

            <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.buttonText}>{isSpecialLevel ? '¡ÉPICO!' : '¡CONTINUAR!'}</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FCD34D',
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
    ...theme.typography.h3,
    color: theme.colors.paperDark,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  starContainer: {
    marginBottom: theme.spacing.md,
  },
  star: {
    fontSize: 80,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  levelContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.medium,
    borderColor: 'rgba(0, 0, 0, 0.3)',
    marginVertical: theme.spacing.md,
    alignItems: 'center',
  },
  levelLabel: {
    ...theme.typography.caption,
    color: theme.colors.paperDark,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: theme.spacing.xs,
  },
  level: {
    fontSize: 64,
    fontWeight: '900',
    color: theme.colors.paperDark,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.paperDark,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  rewardsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    width: '100%',
  },
  rewardsHeader: {
    ...theme.typography.h4,
    color: theme.colors.paperDark,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  reward: {
    ...theme.typography.body,
    color: theme.colors.paperDark,
    textAlign: 'center',
    marginVertical: theme.spacing.xs,
    fontWeight: '600',
  },
  button: {
    backgroundColor: theme.colors.paperDark,
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.thick,
    borderColor: theme.colors.border,
    marginTop: theme.spacing.sm,
    ...theme.shadows.lg,
  },
  buttonText: {
    ...theme.typography.button,
    color: '#FCD34D',
    fontWeight: '900',
    fontSize: 18,
  },
});
