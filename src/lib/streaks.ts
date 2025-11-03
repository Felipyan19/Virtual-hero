/**
 * Streaks System - Sistema de rachas diarias
 * Regla: Cumplir 2+ metas (pasos, agua, sueño) o completar misión del día
 */

export interface DailyGoals {
  stepsGoalMet: boolean;
  waterGoalMet: boolean;
  sleepGoalMet: boolean;
  missionCompleted: boolean;
}

/**
 * Verificar si el día actual cuenta para la racha
 */
export const checkStreakEligibility = (goals: DailyGoals): boolean => {
  const metGoalsCount =
    (goals.stepsGoalMet ? 1 : 0) + (goals.waterGoalMet ? 1 : 0) + (goals.sleepGoalMet ? 1 : 0);

  // Regla: 2+ metas O misión completada
  return metGoalsCount >= 2 || goals.missionCompleted;
};

/**
 * Calcular si la racha debe continuar
 */
export const shouldContinueStreak = (lastStreakDate: string | null, currentDate: Date): boolean => {
  if (!lastStreakDate) {
    return false;
  }

  const yesterday = new Date(currentDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  return lastStreakDate === yesterdayStr;
};

/**
 * Calcular nuevo contador de racha
 */
export const calculateNewStreak = (
  lastStreakDate: string | null,
  currentDate: Date,
  goalsToday: DailyGoals
): { newStreak: number; shouldUpdate: boolean } => {
  const todayStr = currentDate.toISOString().split('T')[0];

  // Ya se actualizó hoy
  if (lastStreakDate === todayStr) {
    return { newStreak: 0, shouldUpdate: false };
  }

  // No cumple requisitos
  if (!checkStreakEligibility(goalsToday)) {
    return { newStreak: 0, shouldUpdate: false };
  }

  // Verificar continuidad
  const continues = shouldContinueStreak(lastStreakDate, currentDate);

  if (continues) {
    // Incrementar racha
    return { newStreak: 1, shouldUpdate: true }; // El store suma al valor actual
  } else {
    // Nueva racha
    return { newStreak: 1, shouldUpdate: true };
  }
};

/**
 * Obtener mensaje motivacional según racha
 */
export const getStreakMessage = (streakCount: number): string => {
  if (streakCount === 0) {
    return '¡Empieza tu racha hoy!';
  }

  if (streakCount === 1) {
    return '¡Buen comienzo! 🔥';
  }

  if (streakCount < 7) {
    return `${streakCount} días seguidos 💪`;
  }

  if (streakCount === 7) {
    return '¡Una semana completa! ⚡';
  }

  if (streakCount < 30) {
    return `${streakCount} días imparable 🌟`;
  }

  if (streakCount === 30) {
    return '¡UN MES ÉPICO! 🏆';
  }

  return `${streakCount} días de leyenda 🦸`;
};

/**
 * Calcular días restantes hasta el siguiente hito
 */
export const getDaysUntilNextMilestone = (streakCount: number): number => {
  const milestones = [7, 14, 30, 60, 100, 365];

  for (const milestone of milestones) {
    if (streakCount < milestone) {
      return milestone - streakCount;
    }
  }

  // Siguiente centenario
  return Math.ceil((streakCount + 1) / 100) * 100 - streakCount;
};
