/**
 * Achievement System Type Definitions
 * Virtual Hero - Sistema de Logros con Héroes
 */

export type AchievementCategory =
  | 'time_based' // Logros por horarios
  | 'xp_milestone' // Logros por XP acumulado
  | 'streak' // Logros por días consecutivos
  | 'exercise_type' // Logros por tipo de ejercicio
  | 'variety' // Logros por variedad de ejercicios
  | 'sessions' // Logros por número de sesiones
  | 'special' // Logros especiales/creativos
  | 'seasonal' // Logros estacionales
  | 'intensity' // Logros por intensidad
  | 'mega'; // Meta logros (coleccionista)

export type RequirementType =
  | 'workouts_in_timeframe' // X entrenamientos en cierto horario
  | 'total_xp' // XP total acumulado
  | 'consecutive_days' // Días consecutivos
  | 'exercise_category_count' // X ejercicios de una categoría
  | 'unique_exercises' // Ejercicios únicos completados
  | 'total_workouts' // Total de entrenamientos
  | 'workout_duration' // Duración de entrenamiento
  | 'share_count' // Veces compartido
  | 'perfect_form' // Entrenamientos con forma perfecta
  | 'comeback' // Regreso después de inactividad
  | 'personal_records' // Récords personales superados
  | 'variety_streak' // Días con ejercicios diferentes
  | 'seasonal_workouts' // Entrenamientos en estación
  | 'intensity_level' // Entrenamientos de cierta intensidad
  | 'achievements_unlocked' // Logros desbloqueados
  | 'custom'; // Condición personalizada

export type TimeFrame =
  | 'dawn' // 12am - 6am
  | 'morning' // 6am - 12pm
  | 'afternoon' // 12pm - 6pm
  | 'evening'; // 6pm - 12am

export type ExerciseCategory = 'strength' | 'cardio' | 'flexibility' | 'balance';

export type Season = 'summer' | 'winter' | 'spring' | 'fall';

export type IntensityLevel = 'easy' | 'medium' | 'hard' | 'extreme';

export type AchievementRarity =
  | 'common' // Común - gris/blanco
  | 'rare' // Raro - verde/azul
  | 'epic' // Épico - morado
  | 'legendary' // Legendario - dorado
  | 'mythic'; // Mítico - arcoíris

export interface AchievementRequirement {
  type: RequirementType;
  value: number;
  timeFrame?: TimeFrame;
  exerciseCategory?: ExerciseCategory;
  season?: Season;
  intensityLevel?: IntensityLevel;
  customCheck?: (userStats: UserStats) => boolean;
}

export interface Achievement {
  id: string;
  heroName: string;
  category: AchievementCategory;
  tier: number; // 1-5 para progresión dentro de categoría
  title: string;
  description: string;
  requirement: AchievementRequirement;
  xpReward: number;
  iconUrl?: string;
  rarity: AchievementRarity;
  isHidden?: boolean; // Para logros sorpresa
  isSecret?: boolean; // No se muestra hasta desbloquearse
}

export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: Date;
  progress?: number; // Para logros en progreso
}

export interface UserStats {
  totalXP: number;
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;

  // Estadísticas por horario
  dawnWorkouts: number;
  morningWorkouts: number;
  afternoonWorkouts: number;
  eveningWorkouts: number;

  // Estadísticas por categoría
  strengthWorkouts: number;
  cardioWorkouts: number;
  flexibilityWorkouts: number;
  balanceWorkouts: number;

  // Otras estadísticas
  uniqueExercisesCompleted: string[]; // IDs de ejercicios únicos
  totalWorkoutMinutes: number;
  shareCount: number;
  perfectFormWorkouts: number;
  personalRecordsBroken: number;

  // Estadísticas de variedad
  consecutiveDifferentExercises: number;

  // Estadísticas estacionales
  summerWorkouts: number;
  winterWorkouts: number;
  springWorkouts: number;
  fallWorkouts: number;

  // Estadísticas de intensidad
  easyWorkouts: number;
  mediumWorkouts: number;
  hardWorkouts: number;
  extremeWorkouts: number;

  // Metadata
  lastWorkoutDate?: Date;
  accountCreatedAt: Date;
  daysSinceLastWorkout: number;

  // Logros
  unlockedAchievements: UnlockedAchievement[];
}

export interface AchievementProgress {
  achievement: Achievement;
  currentProgress: number;
  targetProgress: number;
  percentage: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
}

export interface AchievementNotification {
  achievement: Achievement;
  timestamp: Date;
  isNew: boolean;
}
