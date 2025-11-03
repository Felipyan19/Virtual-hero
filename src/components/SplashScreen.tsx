/**
 * SplashScreen - Pantalla de carga inicial
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animación de la barra de progreso
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 15000,
      useNativeDriver: false,
    }).start(() => {
      // Cuando termina la animación, llamar onFinish
      setTimeout(onFinish, 300);
    });

    // Animación de pulso en el texto
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/silueta-hero.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Overlay oscuro para mejor legibilidad */}
        <View style={styles.overlay} />

        {/* Contenido */}
        <View style={styles.content}>
          {/* Logo y texto */}
          <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.title}>Virtual Hero</Text>
            <Text style={styles.subtitle}>Desata tu Héroe Interior</Text>
          </Animated.View>

          {/* Barra de progreso */}
          <View style={styles.progressBarContainer}>
            <LinearGradient
              colors={['#A855F7', '#EC4899', '#F59E0B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressBarBorder}
            >
              <View style={styles.progressBarBackground}>
                <Animated.View style={[styles.progressBarFill, { width: progressWidth }]}>
                  <LinearGradient
                    colors={['#A855F7', '#EC4899', '#F59E0B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.progressGradient}
                  />
                </Animated.View>
              </View>
            </LinearGradient>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1B4B',
  },
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 27, 75, 0.4)',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 80,
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 56,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.95,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  progressBarContainer: {
    width: '100%',
    maxWidth: 300,
  },
  progressBarBorder: {
    borderRadius: 30,
    padding: 3,
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  progressBarBackground: {
    height: 20,
    backgroundColor: 'rgba(30, 27, 75, 0.8)',
    borderRadius: 27,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 27,
    overflow: 'hidden',
  },
  progressGradient: {
    flex: 1,
  },
});
