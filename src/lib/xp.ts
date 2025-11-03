/**
 * XP System - Sistema de experiencia y recompensas
 */

export enum XPSource {
  STEPS_GOAL = 'steps_goal',
  WATER_CUP = 'water_cup',
  WATER_GOAL = 'water_goal',
  SLEEP_GOAL = 'sleep_goal',
  EXERCISE_COMPLETE = 'exercise_complete',
  MISSION_COMPLETE = 'mission_complete',
  STREAK_BONUS = 'streak_bonus',
  ACHIEVEMENT = 'achievement',
}

export interface XPReward {
  source: XPSource;
  amount: number;
  description: string;
}

/**
 * Tabla de recompensas de XP
 */
export const XP_REWARDS: Record<XPSource, number> = {
  [XPSource.STEPS_GOAL]: 50, // Alcanzar meta de pasos
  [XPSource.WATER_CUP]: 5, // Por cada vaso de agua
  [XPSource.WATER_GOAL]: 30, // Completar meta de agua
  [XPSource.SLEEP_GOAL]: 40, // Dormir suficiente
  [XPSource.EXERCISE_COMPLETE]: 30, // Completar un ejercicio
  [XPSource.MISSION_COMPLETE]: 100, // Completar misión del día
  [XPSource.STREAK_BONUS]: 20, // Bonus por día de racha
  [XPSource.ACHIEVEMENT]: 0, // Variable según logro
};

/**
 * Calcular XP por acción
 */
export const calculateXP = (source: XPSource, multiplier: number = 1): number => {
  const baseXP = XP_REWARDS[source] || 0;
  return Math.floor(baseXP * multiplier);
};

/**
 * Obtener descripción de fuente de XP
 */
export const getXPSourceDescription = (source: XPSource): string => {
  const descriptions: Record<XPSource, string> = {
    [XPSource.STEPS_GOAL]: 'Meta de pasos alcanzada',
    [XPSource.WATER_CUP]: 'Vaso de agua tomado',
    [XPSource.WATER_GOAL]: '¡Meta de hidratación!',
    [XPSource.SLEEP_GOAL]: 'Descanso completo',
    [XPSource.EXERCISE_COMPLETE]: 'Ejercicio completado',
    [XPSource.MISSION_COMPLETE]: '¡Misión cumplida!',
    [XPSource.STREAK_BONUS]: 'Bonus de racha',
    [XPSource.ACHIEVEMENT]: 'Logro desbloqueado',
  };

  return descriptions[source] || 'Recompensa';
};

/**
 * Calcular nivel basado en XP total (acumulado)
 */
export const calculateLevelFromTotalXP = (totalXP: number): number => {
  let level = 1;
  let xpNeeded = 0;

  while (xpNeeded <= totalXP) {
    xpNeeded += calculateXPForLevel(level);
    if (xpNeeded <= totalXP) {
      level++;
    }
  }

  return level;
};

/**
 * Calcular XP necesario para alcanzar un nivel
 */
export const calculateXPForLevel = (level: number): number => {
  // Fórmula exponencial suave: 100 * 1.5^(level - 1)
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

/**
 * Calcular progreso porcentual hacia siguiente nivel
 */
export const calculateLevelProgress = (currentXP: number, xpForNext: number): number => {
  return Math.min(Math.max((currentXP / xpForNext) * 100, 0), 100);
};

/**
 * Obtener recompensas especiales por nivel
 */
export const getLevelRewards = (level: number): string[] => {
  const rewards: string[] = [];

  if (level === 5) {
    rewards.push('🎯 Desbloqueo: Misiones avanzadas');
  }

  if (level === 10) {
    rewards.push('⚡ Desbloqueo: Ejercicios legendarios');
  }

  if (level === 15) {
    rewards.push('🏆 Desbloqueo: Modo competitivo');
  }

  if (level === 20) {
    rewards.push('🌟 ¡Superhéroe Elite!');
  }

  if (level % 5 === 0) {
    rewards.push(`💎 Bonus de nivel: +${level * 10} XP`);
  }

  return rewards;
};

/**
 * Calcular bonus de racha
 */
export const calculateStreakBonus = (streakDays: number): number => {
  if (streakDays < 3) return 0;
  if (streakDays < 7) return 20;
  if (streakDays < 14) return 50;
  if (streakDays < 30) return 100;
  return 200; // 30+ días
};

/**
 * Obtener título según nivel
 */
export const getLevelTitle = (level: number): string => {
  if (level < 5) return 'Aprendiz de Héroe';
  if (level < 10) return 'Héroe en Entrenamiento';
  if (level < 15) return 'Superhéroe';
  if (level < 20) return 'Superhéroe Elite';
  if (level < 30) return 'Leyenda Viviente';
  return 'Deidad del Fitness';
};
