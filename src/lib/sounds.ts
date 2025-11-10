/**
 * Sound System - Sistema de efectos de sonido
 * Maneja reproducción de sonidos con soporte para configuración de usuario
 */

import { AudioPlayer, AudioSource, useAudioPlayer } from 'expo-audio';

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
 * Inicializar el sistema de audio
 */
export const initSounds = async (): Promise<void> => {
  try {
    // expo-audio no requiere configuración inicial como expo-av
    // La configuración se maneja automáticamente
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
