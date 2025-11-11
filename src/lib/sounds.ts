/**
 * Sound System - Sistema de efectos de sonido
 * Maneja reproducción de sonidos con soporte para configuración de usuario
 *
 * NOTA: Por ahora usa vibración háptica como feedback táctil.
 * Para agregar sonidos reales, agrega archivos MP3 en assets/sounds/
 */

import { AudioPlayer, AudioSource, useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';

export enum SoundEffect {
  LEVEL_UP = 'level-up',
  ACHIEVEMENT = 'achievement',
  GOAL_COMPLETE = 'goal-complete',
  WATER_SPLASH = 'water-splash',
  TAP = 'tap',
  STREAK_FIRE = 'streak-fire',
  LEGENDARY = 'legendary',
  EXERCISE_COMPLETE = 'exercise-complete',
}

// Caché de players de audio
const playerCache: Map<SoundEffect, AudioPlayer> = new Map();
let isInitialized = false;

/**
 * Mapeo de efectos de sonido a patrones de vibración háptica
 */
const hapticPatterns: Record<SoundEffect, () => Promise<void>> = {
  [SoundEffect.LEVEL_UP]: async () => {
    // Vibración de éxito fuerte
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  [SoundEffect.ACHIEVEMENT]: async () => {
    // Vibración de éxito
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  [SoundEffect.LEGENDARY]: async () => {
    // Vibración heavy para logros legendarios
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // Doble vibración para énfasis
    setTimeout(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 150);
  },
  [SoundEffect.GOAL_COMPLETE]: async () => {
    // Vibración de éxito
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  [SoundEffect.EXERCISE_COMPLETE]: async () => {
    // Vibración medium
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },
  [SoundEffect.WATER_SPLASH]: async () => {
    // Vibración suave
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  [SoundEffect.STREAK_FIRE]: async () => {
    // Vibración fuerte
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },
  [SoundEffect.TAP]: async () => {
    // Vibración ligera para taps
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
};

/**
 * Inicializar el sistema de audio
 */
export const initSounds = async (): Promise<void> => {
  try {
    // expo-audio no requiere configuración inicial como expo-av
    // La configuración se maneja automáticamente
    isInitialized = true;
    console.log('[Sounds] Sistema de audio/háptica inicializado');
  } catch (error) {
    console.error('[Sounds] Error al inicializar audio:', error);
  }
};

/**
 * Cargar un sonido en caché
 * Por ahora, los sonidos no están disponibles, así que usamos efectos de vibración
 */
const loadSound = async (effect: SoundEffect): Promise<AudioPlayer | null> => {
  try {
    // TODO: Reemplazar con archivos de audio reales cuando estén disponibles
    // const player = new AudioPlayer(
    //   require(`../../assets/sounds/${effect}.mp3`) as AudioSource
    // );
    // playerCache.set(effect, player);
    // return player;

    console.log(`[Sounds] Sonido ${effect} - archivos de audio aún no disponibles`);
    return null;
  } catch (error) {
    console.error(`[Sounds] Error cargando sonido ${effect}:`, error);
    return null;
  }
};

/**
 * Reproducir un efecto de sonido
 * Por ahora usa vibración háptica hasta que se agreguen archivos de audio
 */
export const playSound = async (
  effect: SoundEffect,
  options?: {
    volume?: number; // 0.0 - 1.0 (no usado con háptica)
    rate?: number; // Velocidad de reproducción (no usado con háptica)
  }
): Promise<void> => {
  try {
    if (!isInitialized) {
      await initSounds();
    }

    console.log(`[Sounds] 🔊 Reproduciendo (háptica): ${effect}`);

    // Usar vibración háptica como feedback
    const hapticFn = hapticPatterns[effect];
    if (hapticFn) {
      await hapticFn();
    } else {
      // Fallback: vibración ligera por defecto
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // TODO: Implementar reproducción de audio real cuando los archivos estén disponibles
    // let player = playerCache.get(effect);
    //
    // if (!player) {
    //   player = await loadSound(effect);
    //   if (!player) return;
    // }
    //
    // player.volume = options?.volume ?? 1.0;
    // player.playbackRate = options?.rate ?? 1.0;
    // player.play();
  } catch (error) {
    console.error(`[Sounds] Error reproduciendo ${effect}:`, error);
  }
};

/**
 * Detener todos los sonidos
 */
export const stopAllSounds = async (): Promise<void> => {
  try {
    for (const [effect, player] of playerCache.entries()) {
      player.pause();
      console.log(`[Sounds] Detenido: ${effect}`);
    }
  } catch (error) {
    console.error('[Sounds] Error deteniendo sonidos:', error);
  }
};

/**
 * Limpiar recursos de audio
 */
export const unloadSounds = async (): Promise<void> => {
  try {
    for (const [effect, player] of playerCache.entries()) {
      player.remove();
      console.log(`[Sounds] Descargado: ${effect}`);
    }
    playerCache.clear();
  } catch (error) {
    console.error('[Sounds] Error descargando sonidos:', error);
  }
};

/**
 * Wrapper para reproducir sonido solo si está habilitado
 */
export const playSoundIfEnabled = async (
  effect: SoundEffect,
  soundEnabled: boolean,
  options?: { volume?: number; rate?: number }
): Promise<void> => {
  if (soundEnabled) {
    await playSound(effect, options);
  }
};
