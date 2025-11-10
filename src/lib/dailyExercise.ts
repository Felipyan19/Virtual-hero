/**
 * Daily Exercise Utilities
 *
 * Funciones para determinar el ejercicio del día de forma determinística.
 * El mismo día siempre retorna el mismo ejercicio.
 */

import { Exercise } from '@/components/ExerciseTile';
import exercisesData from '@/data/exercises.json';

/**
 * Obtiene el ejercicio del día usando el día actual como seed.
 * La misma fecha siempre retornará el mismo ejercicio.
 *
 * @returns El ejercicio seleccionado para el día actual
 */
export function getDailyExercise(): Exercise {
  const exercises: Exercise[] = exercisesData as Exercise[];

  // Obtener la fecha actual (solo día, mes y año)
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() retorna 0-11
  const day = now.getDate();

  // Crear un número único basado en la fecha (YYYYMMDD)
  // Ejemplo: 2025-11-09 -> 20251109
  const dateSeed = year * 10000 + month * 100 + day;

  // Usar el módulo para obtener un índice dentro del rango de ejercicios
  const exerciseIndex = dateSeed % exercises.length;

  return exercises[exerciseIndex];
}

/**
 * Obtiene el ID del ejercicio del día
 *
 * @returns El ID del ejercicio del día
 */
export function getDailyExerciseId(): string {
  return getDailyExercise().id;
}

/**
 * Verifica si un ejercicio es el ejercicio del día
 *
 * @param exerciseId - ID del ejercicio a verificar
 * @returns true si el ejercicio es el ejercicio del día
 */
export function isDailyExercise(exerciseId: string): boolean {
  return getDailyExerciseId() === exerciseId;
}
