/**
 * Daily Goals Service - Servicio central de verificación de metas diarias
 * Consolida las metas de pasos, agua, sueño y ejercicios para actualizar la racha
 */

import { useAppStore } from '@/store/useAppStore';
import { useHydration } from '@/store/useHydration';
import { useSleep } from '@/store/useSleep';
import { useSteps } from '@/store/useSteps';
import { checkStreakEligibility, DailyGoals } from '@/lib/streaks';

/**
 * Obtiene el estado actual de todas las metas diarias
 */
export const getCurrentDailyGoals = (): DailyGoals => {
  const hydrationState = useHydration.getState();
  const sleepState = useSleep.getState();
  const stepsState = useSteps.getState();

  return {
    stepsGoalMet: stepsState.todayGoalMet,
    waterGoalMet: hydrationState.todayML >= hydrationState.dailyGoalML,
    sleepGoalMet: sleepState.todayMinutes >= sleepState.targetSleepMinutes,
    missionCompleted: false, // Se actualizará desde achievementService cuando se complete un ejercicio
  };
};

/**
 * Verifica si se deben actualizar las metas y racha
 * Regla: Cumplir 2+ metas (pasos, agua, sueño) O completar misión del día
 */
export const checkAndUpdateStreak = (missionCompleted: boolean = false) => {
  const goals = getCurrentDailyGoals();
  goals.missionCompleted = missionCompleted;

  // Verificar si el día cumple los requisitos para la racha
  const isEligible = checkStreakEligibility(goals);

  if (isEligible) {
    const appStore = useAppStore.getState();
    const today = new Date().toISOString().split('T')[0];
    const lastDate = appStore.lastStreakDate;

    // Solo actualizar si no se ha actualizado hoy
    if (lastDate !== today) {
      appStore.updateStreak(today);
      console.log('[Racha] Actualizada por cumplir metas diarias');
      return true;
    }
  }

  return false;
};

/**
 * Verifica las metas al finalizar el día (útil para verificaciones automáticas)
 */
export const checkPreviousDayStreak = () => {
  const appStore = useAppStore.getState();
  const today = new Date().toISOString().split('T')[0];
  const lastDate = appStore.lastStreakDate;

  if (!lastDate) {
    // Primera vez, no hay nada que verificar
    return;
  }

  // Calcular fecha de ayer
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Si la última actualización no fue ayer, verificar si se rompió la racha
  if (lastDate !== yesterdayStr && lastDate !== today) {
    // La racha se rompió porque no se actualizó ayer
    console.log('[Racha] Se rompió la racha - no se cumplieron metas ayer');
    // No hacer nada aquí, la lógica de updateStreak ya maneja esto
  }
};

/**
 * Hook para suscribirse a cambios en las metas diarias
 * Se debe llamar cuando cambia alguna métrica (agua, pasos, sueño)
 */
export const onGoalCompleted = (
  goalType: 'steps' | 'water' | 'sleep',
  missionCompleted: boolean = false
) => {
  console.log(`[Metas] Meta de ${goalType} completada`);

  // Verificar si ahora se cumplen los requisitos para actualizar la racha
  checkAndUpdateStreak(missionCompleted);
};

/**
 * Verifica si se debe resetear algún contador por cambio de día
 */
export const initializeDailyCheck = () => {
  // Verificar si cambió el día desde la última vez
  checkPreviousDayStreak();

  // Verificar si ya se cumplen las metas del día actual
  checkAndUpdateStreak();
};
