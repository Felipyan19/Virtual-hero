/**
 * ConfettiPow - Animación de confeti + POW al completar misión
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

interface ConfettiPowProps {
  visible: boolean;
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

export const ConfettiPow: React.FC<ConfettiPowProps> = ({ visible, onComplete }) => {
  const colors = ['#6D28D9', '#2563EB', '#10B981', '#FACC15', '#DC2626'];

  useEffect(() => {
    if (visible && onComplete) {
      const timer = setTimeout(onComplete, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Confeti */}
      {Array.from({ length: 30 }).map((_, i) => (
        <ConfettiPiece
          key={i}
          delay={i * 50}
          color={colors[i % colors.length]}
          x={Math.random() * width}
        />
      ))}

      {/* POW! */}
      <View style={styles.powContainer}>
        <OnomatopoeiaBurst text="¡POW!" visible={visible} />
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
