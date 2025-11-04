/**
 * Achievement Service
 * Maneja el almacenamiento, tracking y actualización de logros del usuario
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserStats,
  UnlockedAchievement,
  Achievement,
  ExerciseCategory,
  IntensityLevel,
} from '@/types/achievements';
import {
  detectNewAchievements,
  getCurrentTimeFrame,
  getCurrentSeason,
  checkSpecialDateAchievements,
} from './achievementDetector';

const STORAGE_KEYS = {
  USER_STATS: '@virtual_hero:user_stats',
  UNLOCKED_ACHIEVEMENTS: '@virtual_hero:unlocked_achievements',
};

/**
 * Inicializa las estadísticas del usuario
 */
const getDefaultUserStats = (): UserStats => ({
  totalXP: 0,
  totalWorkouts: 0,
  currentStreak: 0,
  longestStreak: 0,

  dawnWorkouts: 0,
  morningWorkouts: 0,
  afternoonWorkouts: 0,
  eveningWorkouts: 0,

  strengthWorkouts: 0,
  cardioWorkouts: 0,
  flexibilityWorkouts: 0,
  balanceWorkouts: 0,

  uniqueExercisesCompleted: [],
  totalWorkoutMinutes: 0,
  shareCount: 0,
  perfectFormWorkouts: 0,
  personalRecordsBroken: 0,

  consecutiveDifferentExercises: 0,

  summerWorkouts: 0,
  winterWorkouts: 0,
  springWorkouts: 0,
  fallWorkouts: 0,

  easyWorkouts: 0,
  mediumWorkouts: 0,
  hardWorkouts: 0,
  extremeWorkouts: 0,

  accountCreatedAt: new Date(),
  daysSinceLastWorkout: 0,
  unlockedAchievements: [],
});

/**
 * Carga las estadísticas del usuario desde AsyncStorage
 */
export const loadUserStats = async (): Promise<UserStats> => {
  try {
    const statsJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_STATS);
    if (statsJson) {
      const stats = JSON.parse(statsJson);
      // Convertir strings de fechas de vuelta a Date objects
      if (stats.lastWorkoutDate) {
        stats.lastWorkoutDate = new Date(stats.lastWorkoutDate);
      }
      if (stats.accountCreatedAt) {
        stats.accountCreatedAt = new Date(stats.accountCreatedAt);
      }
      stats.unlockedAchievements = stats.unlockedAchievements.map(
        (achievement: UnlockedAchievement) => ({
          ...achievement,
          unlockedAt: new Date(achievement.unlockedAt),
        })
      );
      return stats;
    }
    return getDefaultUserStats();
  } catch (error) {
    console.error('Error loading user stats:', error);
    return getDefaultUserStats();
  }
};

/**
 * Guarda las estadísticas del usuario en AsyncStorage
 */
export const saveUserStats = async (stats: UserStats): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving user stats:', error);
  }
};

/**
 * Resetea todas las estadísticas (útil para testing o reset de cuenta)
 */
export const resetUserStats = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_STATS);
  } catch (error) {
    console.error('Error resetting user stats:', error);
  }
};

/**
 * Calcula los días desde el último entrenamiento
 */
const calculateDaysSinceLastWorkout = (lastWorkoutDate?: Date): number => {
  if (!lastWorkoutDate) return 0;

  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastWorkoutDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Actualiza el streak del usuario
 */
const updateStreak = (stats: UserStats, workoutDate: Date): UserStats => {
  const today = new Date(workoutDate);
  today.setHours(0, 0, 0, 0);

  if (!stats.lastWorkoutDate) {
    // Primer workout
    return {
      ...stats,
      currentStreak: 1,
      longestStreak: Math.max(1, stats.longestStreak),
      lastWorkoutDate: workoutDate,
    };
  }

  const lastWorkout = new Date(stats.lastWorkoutDate);
  lastWorkout.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    // Mismo día, no actualizar streak
    return { ...stats, lastWorkoutDate: workoutDate };
  } else if (daysDiff === 1) {
    // Día consecutivo
    const newStreak = stats.currentStreak + 1;
    return {
      ...stats,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, stats.longestStreak),
      lastWorkoutDate: workoutDate,
      daysSinceLastWorkout: 0,
    };
  } else {
    // Streak roto
    return {
      ...stats,
      currentStreak: 1,
      lastWorkoutDate: workoutDate,
      daysSinceLastWorkout: 0,
    };
  }
};

/**
 * Interfaz para datos de un workout completado
 */
export interface WorkoutCompletedData {
  xpEarned: number;
  exerciseIds: string[];
  exerciseCategories: ExerciseCategory[];
  durationMinutes: number;
  intensityLevel: IntensityLevel;
  isPerfectForm?: boolean;
  isPersonalRecord?: boolean;
  workoutDate?: Date;
  userBirthday?: Date;
}

/**
 * Registra un workout completado y actualiza estadísticas
 */
export const recordWorkoutCompleted = async (
  data: WorkoutCompletedData
): Promise<{
  newAchievements: Achievement[];
  updatedStats: UserStats;
}> => {
  const stats = await loadUserStats();
  const workoutDate = data.workoutDate || new Date();

  // Calcular días desde último workout (para comeback achievements)
  const daysSinceLastWorkout = calculateDaysSinceLastWorkout(stats.lastWorkoutDate);

  // Actualizar estadísticas básicas
  let updatedStats: UserStats = {
    ...stats,
    totalXP: stats.totalXP + data.xpEarned,
    totalWorkouts: stats.totalWorkouts + 1,
    totalWorkoutMinutes: stats.totalWorkoutMinutes + data.durationMinutes,
    daysSinceLastWorkout, // Guardarlo antes de resetear
  };

  // Actualizar streak
  updatedStats = updateStreak(updatedStats, workoutDate);

  // Actualizar estadísticas por horario
  const timeFrame = getCurrentTimeFrame(workoutDate);
  switch (timeFrame) {
    case 'dawn':
      updatedStats.dawnWorkouts++;
      break;
    case 'morning':
      updatedStats.morningWorkouts++;
      break;
    case 'afternoon':
      updatedStats.afternoonWorkouts++;
      break;
    case 'evening':
      updatedStats.eveningWorkouts++;
      break;
  }

  // Actualizar estadísticas por categoría de ejercicio
  data.exerciseCategories.forEach((category) => {
    switch (category) {
      case 'strength':
        updatedStats.strengthWorkouts++;
        break;
      case 'cardio':
        updatedStats.cardioWorkouts++;
        break;
      case 'flexibility':
        updatedStats.flexibilityWorkouts++;
        break;
      case 'balance':
        updatedStats.balanceWorkouts++;
        break;
    }
  });

  // Actualizar ejercicios únicos
  data.exerciseIds.forEach((exerciseId) => {
    if (!updatedStats.uniqueExercisesCompleted.includes(exerciseId)) {
      updatedStats.uniqueExercisesCompleted.push(exerciseId);
    }
  });

  // Actualizar estadísticas estacionales
  const season = getCurrentSeason(workoutDate);
  switch (season) {
    case 'summer':
      updatedStats.summerWorkouts++;
      break;
    case 'winter':
      updatedStats.winterWorkouts++;
      break;
    case 'spring':
      updatedStats.springWorkouts++;
      break;
    case 'fall':
      updatedStats.fallWorkouts++;
      break;
  }

  // Actualizar estadísticas de intensidad
  switch (data.intensityLevel) {
    case 'easy':
      updatedStats.easyWorkouts++;
      break;
    case 'medium':
      updatedStats.mediumWorkouts++;
      break;
    case 'hard':
      updatedStats.hardWorkouts++;
      break;
    case 'extreme':
      updatedStats.extremeWorkouts++;
      break;
  }

  // Actualizar otras estadísticas
  if (data.isPerfectForm) {
    updatedStats.perfectFormWorkouts++;
  }

  if (data.isPersonalRecord) {
    updatedStats.personalRecordsBroken++;
  }

  // Detectar logros especiales por fecha/hora
  const specialAchievementIds = checkSpecialDateAchievements(workoutDate, data.userBirthday);

  // Agregar logros especiales a stats temporalmente para detección
  specialAchievementIds.forEach((achievementId) => {
    if (!updatedStats.unlockedAchievements.some((a) => a.achievementId === achievementId)) {
      updatedStats.unlockedAchievements.push({
        achievementId,
        unlockedAt: workoutDate,
      });
    }
  });

  // Detectar nuevos achievements
  const newAchievements = detectNewAchievements(updatedStats);

  // Agregar nuevos achievements a la lista de desbloqueados
  newAchievements.forEach((achievement) => {
    if (!updatedStats.unlockedAchievements.some((a) => a.achievementId === achievement.id)) {
      updatedStats.unlockedAchievements.push({
        achievementId: achievement.id,
        unlockedAt: workoutDate,
      });
    }
  });

  // Guardar estadísticas actualizadas
  await saveUserStats(updatedStats);

  return {
    newAchievements,
    updatedStats,
  };
};

/**
 * Incrementa el contador de compartidos
 */
export const recordWorkoutShared = async (): Promise<{
  newAchievements: Achievement[];
  updatedStats: UserStats;
}> => {
  const stats = await loadUserStats();

  const updatedStats: UserStats = {
    ...stats,
    shareCount: stats.shareCount + 1,
  };

  // Detectar nuevos achievements
  const newAchievements = detectNewAchievements(updatedStats);

  // Agregar nuevos achievements
  newAchievements.forEach((achievement) => {
    if (!updatedStats.unlockedAchievements.some((a) => a.achievementId === achievement.id)) {
      updatedStats.unlockedAchievements.push({
        achievementId: achievement.id,
        unlockedAt: new Date(),
      });
    }
  });

  await saveUserStats(updatedStats);

  return {
    newAchievements,
    updatedStats,
  };
};

/**
 * Actualiza el contador de días desde último workout (llamar diariamente)
 */
export const updateDaysSinceLastWorkout = async (): Promise<void> => {
  const stats = await loadUserStats();

  if (stats.lastWorkoutDate) {
    const daysSince = calculateDaysSinceLastWorkout(stats.lastWorkoutDate);
    if (daysSince !== stats.daysSinceLastWorkout) {
      await saveUserStats({
        ...stats,
        daysSinceLastWorkout: daysSince,
      });
    }
  }
};

/**
 * Desbloquea manualmente un achievement (para testing o eventos especiales)
 */
export const unlockAchievement = async (achievementId: string): Promise<void> => {
  const stats = await loadUserStats();

  if (!stats.unlockedAchievements.some((a) => a.achievementId === achievementId)) {
    stats.unlockedAchievements.push({
      achievementId,
      unlockedAt: new Date(),
    });

    await saveUserStats(stats);
  }
};

/**
 * Exporta todas las estadísticas para backup o análisis
 */
export const exportUserStats = async (): Promise<string> => {
  const stats = await loadUserStats();
  return JSON.stringify(stats, null, 2);
};

/**
 * Importa estadísticas desde un backup
 */
export const importUserStats = async (statsJson: string): Promise<void> => {
  try {
    const stats = JSON.parse(statsJson);
    // Validar y convertir fechas
    if (stats.lastWorkoutDate) {
      stats.lastWorkoutDate = new Date(stats.lastWorkoutDate);
    }
    if (stats.accountCreatedAt) {
      stats.accountCreatedAt = new Date(stats.accountCreatedAt);
    }
    stats.unlockedAchievements = stats.unlockedAchievements.map(
      (achievement: UnlockedAchievement) => ({
        ...achievement,
        unlockedAt: new Date(achievement.unlockedAt),
      })
    );

    await saveUserStats(stats);
  } catch (error) {
    console.error('Error importing user stats:', error);
    throw new Error('Invalid stats data');
  }
};
