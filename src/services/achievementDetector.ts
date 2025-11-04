/**
 * Achievement Detection Service
 * Detecta cuando un usuario ha cumplido los requisitos para desbloquear un logro
 */

import { Achievement, UserStats, AchievementRequirement, TimeFrame } from '@/types/achievements';
import { ACHIEVEMENTS } from '@/data/achievements';

/**
 * Obtiene el timeframe actual basado en la hora
 */
export const getCurrentTimeFrame = (date: Date = new Date()): TimeFrame => {
  const hour = date.getHours();

  if (hour >= 0 && hour < 6) return 'dawn';
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
};

/**
 * Obtiene la estación actual basada en el mes (hemisferio norte)
 */
export const getCurrentSeason = (
  date: Date = new Date()
): 'summer' | 'winter' | 'spring' | 'fall' => {
  const month = date.getMonth(); // 0-11

  // Primavera: marzo, abril, mayo (2, 3, 4)
  if (month >= 2 && month <= 4) return 'spring';
  // Verano: junio, julio, agosto (5, 6, 7)
  if (month >= 5 && month <= 7) return 'summer';
  // Otoño: septiembre, octubre, noviembre (8, 9, 10)
  if (month >= 8 && month <= 10) return 'fall';
  // Invierno: diciembre, enero, febrero (11, 0, 1)
  return 'winter';
};

/**
 * Verifica si un requirement específico se cumple
 */
export const checkRequirement = (
  requirement: AchievementRequirement,
  userStats: UserStats
): boolean => {
  switch (requirement.type) {
    case 'workouts_in_timeframe':
      if (!requirement.timeFrame) return false;
      const timeframeMap = {
        dawn: userStats.dawnWorkouts,
        morning: userStats.morningWorkouts,
        afternoon: userStats.afternoonWorkouts,
        evening: userStats.eveningWorkouts,
      };
      return timeframeMap[requirement.timeFrame] >= requirement.value;

    case 'total_xp':
      return userStats.totalXP >= requirement.value;

    case 'consecutive_days':
      return userStats.currentStreak >= requirement.value;

    case 'exercise_category_count':
      if (!requirement.exerciseCategory) return false;
      const categoryMap = {
        strength: userStats.strengthWorkouts,
        cardio: userStats.cardioWorkouts,
        flexibility: userStats.flexibilityWorkouts,
        balance: userStats.balanceWorkouts,
      };
      return categoryMap[requirement.exerciseCategory] >= requirement.value;

    case 'unique_exercises':
      return userStats.uniqueExercisesCompleted.length >= requirement.value;

    case 'total_workouts':
      return userStats.totalWorkouts >= requirement.value;

    case 'workout_duration':
      // Este se verificará por sesión individual, no acumulado
      return false; // Se maneja en el context de completar workout

    case 'share_count':
      return userStats.shareCount >= requirement.value;

    case 'perfect_form':
      return userStats.perfectFormWorkouts >= requirement.value;

    case 'comeback':
      // Verifica si el usuario volvió después de X días de inactividad
      return userStats.daysSinceLastWorkout >= requirement.value;

    case 'personal_records':
      return userStats.personalRecordsBroken >= requirement.value;

    case 'variety_streak':
      return userStats.consecutiveDifferentExercises >= requirement.value;

    case 'seasonal_workouts':
      if (!requirement.season) return false;
      const seasonMap = {
        summer: userStats.summerWorkouts,
        winter: userStats.winterWorkouts,
        spring: userStats.springWorkouts,
        fall: userStats.fallWorkouts,
      };
      return seasonMap[requirement.season] >= requirement.value;

    case 'intensity_level':
      if (!requirement.intensityLevel) return false;
      const intensityMap = {
        easy: userStats.easyWorkouts,
        medium: userStats.mediumWorkouts,
        hard: userStats.hardWorkouts,
        extreme: userStats.extremeWorkouts,
      };
      return intensityMap[requirement.intensityLevel] >= requirement.value;

    case 'achievements_unlocked':
      return userStats.unlockedAchievements.length >= requirement.value;

    case 'custom':
      // Para requisitos personalizados, usar la función customCheck si existe
      if (requirement.customCheck) {
        return requirement.customCheck(userStats);
      }
      return false;

    default:
      return false;
  }
};

/**
 * Verifica si un achievement específico está desbloqueado
 */
export const isAchievementUnlocked = (achievement: Achievement, userStats: UserStats): boolean => {
  return userStats.unlockedAchievements.some(
    (unlocked) => unlocked.achievementId === achievement.id
  );
};

/**
 * Detecta todos los logros que el usuario puede desbloquear ahora
 */
export const detectNewAchievements = (userStats: UserStats): Achievement[] => {
  const newAchievements: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    // Si ya está desbloqueado, saltar
    if (isAchievementUnlocked(achievement, userStats)) {
      continue;
    }

    // Verificar si cumple el requisito
    if (checkRequirement(achievement.requirement, userStats)) {
      newAchievements.push(achievement);
    }
  }

  return newAchievements;
};

/**
 * Obtiene el progreso de un achievement específico
 */
export const getAchievementProgress = (
  achievement: Achievement,
  userStats: UserStats
): { current: number; target: number; percentage: number } => {
  const requirement = achievement.requirement;
  let current = 0;
  const target = requirement.value;

  switch (requirement.type) {
    case 'workouts_in_timeframe':
      if (requirement.timeFrame) {
        const timeframeMap = {
          dawn: userStats.dawnWorkouts,
          morning: userStats.morningWorkouts,
          afternoon: userStats.afternoonWorkouts,
          evening: userStats.eveningWorkouts,
        };
        current = timeframeMap[requirement.timeFrame];
      }
      break;

    case 'total_xp':
      current = userStats.totalXP;
      break;

    case 'consecutive_days':
      current = userStats.currentStreak;
      break;

    case 'exercise_category_count':
      if (requirement.exerciseCategory) {
        const categoryMap = {
          strength: userStats.strengthWorkouts,
          cardio: userStats.cardioWorkouts,
          flexibility: userStats.flexibilityWorkouts,
          balance: userStats.balanceWorkouts,
        };
        current = categoryMap[requirement.exerciseCategory];
      }
      break;

    case 'unique_exercises':
      current = userStats.uniqueExercisesCompleted.length;
      break;

    case 'total_workouts':
      current = userStats.totalWorkouts;
      break;

    case 'share_count':
      current = userStats.shareCount;
      break;

    case 'perfect_form':
      current = userStats.perfectFormWorkouts;
      break;

    case 'personal_records':
      current = userStats.personalRecordsBroken;
      break;

    case 'variety_streak':
      current = userStats.consecutiveDifferentExercises;
      break;

    case 'seasonal_workouts':
      if (requirement.season) {
        const seasonMap = {
          summer: userStats.summerWorkouts,
          winter: userStats.winterWorkouts,
          spring: userStats.springWorkouts,
          fall: userStats.fallWorkouts,
        };
        current = seasonMap[requirement.season];
      }
      break;

    case 'intensity_level':
      if (requirement.intensityLevel) {
        const intensityMap = {
          easy: userStats.easyWorkouts,
          medium: userStats.mediumWorkouts,
          hard: userStats.hardWorkouts,
          extreme: userStats.extremeWorkouts,
        };
        current = intensityMap[requirement.intensityLevel];
      }
      break;

    case 'achievements_unlocked':
      current = userStats.unlockedAchievements.length;
      break;

    case 'custom':
      // Para custom, no podemos determinar progreso fácilmente
      current = checkRequirement(requirement, userStats) ? target : 0;
      break;

    default:
      current = 0;
  }

  const percentage = Math.min(100, Math.round((current / target) * 100));

  return { current, target, percentage };
};

/**
 * Obtiene los próximos 5 achievements más cercanos a desbloquearse
 */
export const getNextAchievements = (
  userStats: UserStats,
  limit: number = 5
): Array<{
  achievement: Achievement;
  progress: { current: number; target: number; percentage: number };
}> => {
  const unlockedIds = new Set(userStats.unlockedAchievements.map((a) => a.achievementId));

  const achievementsWithProgress = ACHIEVEMENTS.filter(
    (achievement) => !unlockedIds.has(achievement.id) && !achievement.isHidden
  )
    .map((achievement) => ({
      achievement,
      progress: getAchievementProgress(achievement, userStats),
    }))
    .filter((item) => item.progress.percentage > 0) // Solo los que tienen algún progreso
    .sort((a, b) => b.progress.percentage - a.progress.percentage); // Ordenar por progreso descendente

  return achievementsWithProgress.slice(0, limit);
};

/**
 * Verifica logros especiales basados en fecha/hora específica
 */
export const checkSpecialDateAchievements = (
  date: Date = new Date(),
  userBirthday?: Date
): string[] => {
  const unlockedIds: string[] = [];
  const hour = date.getHours();
  const month = date.getMonth();
  const day = date.getDate();
  const dayOfWeek = date.getDay(); // 0 = domingo, 1 = lunes, etc.

  // Madruguete Extremo - 3am exacta
  if (hour === 3) {
    unlockedIds.push('special_3am');
  }

  // Año Nuevo
  if (month === 0 && day === 1) {
    unlockedIds.push('special_nye');
  }

  // Cumpleaños
  if (userBirthday) {
    if (month === userBirthday.getMonth() && day === userBirthday.getDate()) {
      unlockedIds.push('special_birthday');
    }
  }

  // Zombi Fitness - 5am un lunes
  if (hour === 5 && dayOfWeek === 1) {
    unlockedIds.push('special_zombie');
  }

  // Héroe de Resaca - antes de 9am sábado o domingo
  if ((dayOfWeek === 0 || dayOfWeek === 6) && hour < 9 && hour >= 6) {
    unlockedIds.push('special_hangover');
  }

  return unlockedIds;
};

/**
 * Calcula estadísticas agregadas de logros
 */
export const getAchievementStats = (
  userStats: UserStats
): {
  total: number;
  unlocked: number;
  percentage: number;
  byCategory: Record<string, { total: number; unlocked: number }>;
  byRarity: Record<string, { total: number; unlocked: number }>;
} => {
  const unlockedIds = new Set(userStats.unlockedAchievements.map((a) => a.achievementId));

  const byCategory: Record<string, { total: number; unlocked: number }> = {};
  const byRarity: Record<string, { total: number; unlocked: number }> = {};

  ACHIEVEMENTS.forEach((achievement) => {
    // Por categoría
    if (!byCategory[achievement.category]) {
      byCategory[achievement.category] = { total: 0, unlocked: 0 };
    }
    byCategory[achievement.category].total++;
    if (unlockedIds.has(achievement.id)) {
      byCategory[achievement.category].unlocked++;
    }

    // Por rareza
    if (!byRarity[achievement.rarity]) {
      byRarity[achievement.rarity] = { total: 0, unlocked: 0 };
    }
    byRarity[achievement.rarity].total++;
    if (unlockedIds.has(achievement.id)) {
      byRarity[achievement.rarity].unlocked++;
    }
  });

  return {
    total: ACHIEVEMENTS.length,
    unlocked: userStats.unlockedAchievements.length,
    percentage: Math.round((userStats.unlockedAchievements.length / ACHIEVEMENTS.length) * 100),
    byCategory,
    byRarity,
  };
};
