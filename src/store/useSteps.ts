/**
 * Steps Store - Manejo de pasos diarios
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StepsState {
  // Configuración
  dailyGoalSteps: number; // Meta diaria (por defecto 8000)

  // Progreso del día
  todaySteps: number;
  todayDate: string;
  todayGoalMet: boolean;

  // Historial
  lastWeekSteps: number[]; // Últimos 7 días

  // Permisos
  hasHealthPermission: boolean;
  isLoading: boolean;
  lastSyncTime: string | null; // ISO timestamp

  // Acciones
  setDailyGoal: (steps: number) => void;
  updateSteps: (steps: number) => void;
  setHealthPermission: (granted: boolean) => void;
  setLoading: (loading: boolean) => void;
  updateDayIfNeeded: () => void;
  syncSteps: () => Promise<void>;
}

export const useSteps = create<StepsState>()(
  persist(
    (set, get) => ({
      // Valores por defecto
      dailyGoalSteps: 8000,

      todaySteps: 0,
      todayDate: new Date().toISOString().split('T')[0],
      todayGoalMet: false,

      lastWeekSteps: [0, 0, 0, 0, 0, 0, 0],

      hasHealthPermission: false,
      isLoading: false,
      lastSyncTime: null,

      setDailyGoal: (steps: number) => {
        // Entre 1,000 y 30,000 pasos
        set({ dailyGoalSteps: Math.max(1000, Math.min(steps, 30000)) });
      },

      updateSteps: (steps: number) => {
        const state = get();
        state.updateDayIfNeeded();

        const goalMet = steps >= state.dailyGoalSteps;
        const previousGoalMet = state.todayGoalMet;

        set({
          todaySteps: steps,
          todayGoalMet: goalMet,
          lastSyncTime: new Date().toISOString(),
        });

        // Si acaba de alcanzar la meta
        if (goalMet && !previousGoalMet) {
          console.log('[Pasos] ¡Meta diaria alcanzada! 👟');
          // TODO: Sumar XP (50 XP por meta de pasos)

          // Logro: Primera vez con 1,000 pasos
          if (steps >= 1000) {
            // TODO: Desbloquear logro 'first_step'
          }

          // Logro: 10,000 pasos en un día
          if (steps >= 10000) {
            // TODO: Desbloquear logro 'steps_10k'
          }
        }
      },

      setHealthPermission: (granted: boolean) => {
        set({ hasHealthPermission: granted });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      updateDayIfNeeded: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];

        if (state.todayDate !== today) {
          // Guardar ayer en historial
          const newWeek = [...state.lastWeekSteps.slice(1), state.todaySteps];

          set({
            todaySteps: 0,
            todayDate: today,
            todayGoalMet: false,
            lastWeekSteps: newWeek,
          });

          console.log('[Pasos] Nuevo día iniciado');
        }
      },

      syncSteps: async () => {
        const state = get();

        if (!state.hasHealthPermission) {
          console.log('[Pasos] Sin permisos de salud');
          return;
        }

        state.setLoading(true);

        try {
          // TODO: Implementar lectura real desde HealthKit/Google Fit
          // const steps = await readStepsFromHealth();
          // state.updateSteps(steps);

          console.log('[Pasos] Sincronización pendiente (implementar integración)');
        } catch (error) {
          console.error('[Pasos] Error al sincronizar:', error);
        } finally {
          state.setLoading(false);
        }
      },
    }),
    {
      name: 'virtual-giro-steps',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
