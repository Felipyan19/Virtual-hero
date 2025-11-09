/**
 * Sound System - Sistema de efectos de sonido
 * Maneja reproducción de sonidos con soporte para configuración de usuario
 */

import { Audio } from 'expo-av';

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

// Caché de sonidos cargados
const soundCache: Map<SoundEffect, Audio.Sound> = new Map();
let isInitialized = false;

/**
 * Inicializar el sistema de audio
 */
export const initSounds = async (): Promise<void> => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: false,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
    isInitialized = true;
    console.log('[Sounds] Sistema de audio inicializado');
  } catch (error) {
    console.error('[Sounds] Error al inicializar audio:', error);
  }
};

/**
 * Cargar un sonido en caché
 * Por ahora, los sonidos no están disponibles, así que usamos efectos de vibración
 */
const loadSound = async (effect: SoundEffect): Promise<Audio.Sound | null> => {
  try {
    // TODO: Reemplazar con archivos de audio reales cuando estén disponibles
    // const { sound } = await Audio.Sound.createAsync(
    //   require(`../../assets/sounds/${effect}.mp3`)
    // );
    // soundCache.set(effect, sound);
    // return sound;

    console.log(`[Sounds] Sonido ${effect} - archivos de audio aún no disponibles`);
    return null;
  } catch (error) {
    console.error(`[Sounds] Error cargando sonido ${effect}:`, error);
    return null;
  }
};

/**
 * Reproducir un efecto de sonido
 */
export const playSound = async (
  effect: SoundEffect,
  options?: {
    volume?: number; // 0.0 - 1.0
    rate?: number; // Velocidad de reproducción
  }
): Promise<void> => {
  try {
    if (!isInitialized) {
      await initSounds();
    }

    // Por ahora, solo registramos el intento de reproducción
    console.log(`[Sounds] 🔊 Reproduciendo: ${effect}`);

    // TODO: Implementar reproducción real cuando los archivos estén disponibles
    // let sound = soundCache.get(effect);
    //
    // if (!sound) {
    //   sound = await loadSound(effect);
    //   if (!sound) return;
    // }
    //
    // await sound.setVolumeAsync(options?.volume ?? 1.0);
    // await sound.setRateAsync(options?.rate ?? 1.0, true);
    // await sound.replayAsync();

  } catch (error) {
    console.error(`[Sounds] Error reproduciendo ${effect}:`, error);
  }
};

/**
 * Detener todos los sonidos
 */
export const stopAllSounds = async (): Promise<void> => {
  try {
    for (const [effect, sound] of soundCache.entries()) {
      await sound.stopAsync();
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
    for (const [effect, sound] of soundCache.entries()) {
      await sound.unloadAsync();
      console.log(`[Sounds] Descargado: ${effect}`);
    }
    soundCache.clear();
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
