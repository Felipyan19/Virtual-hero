/**
 * OnomatopoeiaBurst - Onomatopeyas estilo cómic (POW, BAM, BOOM)
 */

import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import theme from '@/theme/theme';

interface OnomatopoeiaBurstProps {
  text: string;
  visible?: boolean;
  onAnimationEnd?: () => void;
}

export const OnomatopoeiaBurst: React.FC<OnomatopoeiaBurstProps> = ({
  text,
  visible = false,
  onAnimationEnd,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(-15);

  useEffect(() => {
    if (visible) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 8, stiffness: 100 }),
        withSpring(1, { damping: 10 })
      );

      opacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(1, { duration: 800 }),
        withTiming(0, { duration: 300 })
      );

      rotation.value = withSpring(15, { damping: 10 });

      // Llamar callback después de la animación
      setTimeout(() => {
        if (onAnimationEnd) {
          onAnimationEnd();
        }
      }, 1300);
    } else {
      scale.value = 0;
      opacity.value = 0;
      rotation.value = -15;
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    opacity: opacity.value,
  }));

  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1000,
  },
  text: {
    ...theme.typography.onomatopoeia,
    color: theme.colors.pop,
    textShadowColor: theme.colors.border,
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 0,
    fontWeight: '900',
    letterSpacing: 4,
  },
});
