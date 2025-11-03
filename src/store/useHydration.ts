/**
 * Hydration Store - Manejo de hidratación diaria
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HydrationState {
  // Configuración
  dailyGoalML: number; // Meta diaria en mililitros
  cupSizeML: number; // Tamaño de un vaso (por defecto 250ml)

  // Progreso del día
  todayML: number;
  todayDate: string; // ISO date
  cupsConsumed: number;

  // Historial
  lastWeekML: number[]; // Últimos 7 días

  // Notificaciones
  reminderEnabled: boolean;
  reminderIntervalHours: number;
  quietHoursStart: number; // 22 (10 PM)
  quietHoursEnd: number; // 8 (8 AM)

  // Acciones
  addCup: (customML?: number) => void;
  setDailyGoal: (goalML: number) => void;
  setCupSize: (sizeML: number) => void;
  resetDay: () => void;
  updateDayIfNeeded: () => void;
  toggleReminder: () => void;
  setReminderInterval: (hours: number) => void;
}

export const useHydration = create<HydrationState>()(
  persist(
    (set, get) => ({
      // Valores por defecto
      dailyGoalML: 2000, // 8 vasos x 250ml
      cupSizeML: 250,

      todayML: 0,
      todayDate: new Date().toISOString().split('T')[0],
      cupsConsumed: 0,

      lastWeekML: [0, 0, 0, 0, 0, 0, 0],

      reminderEnabled: true,
      reminderIntervalHours: 2,
      quietHoursStart: 22,
      quietHoursEnd: 8,

      addCup: (customML?: number) => {
        const state = get();
        state.updateDayIfNeeded();

        const mlToAdd = customML || state.cupSizeML;
        const newTodayML = Math.min(state.todayML + mlToAdd, state.dailyGoalML + 1000); // Cap en meta + 1L
        const newCups = state.cupsConsumed + 1;

        set({
          todayML: newTodayML,
          cupsConsumed: newCups,
        });

        // TODO: Notificar al useAppStore para sumar XP (5 XP por vaso)
        // get().addXP(5, 'Hidratación');

        // Verificar si se alcanzó la meta
        if (newTodayML >= state.dailyGoalML && state.todayML < state.dailyGoalML) {
          console.log('[Hidratación] ¡Meta diaria alcanzada! 💧');
          // TODO: Desbloquear logro 'hydra_hero' en primera vez
        }
      },

      setDailyGoal: (goalML: number) => {
        set({ dailyGoalML: Math.max(500, Math.min(goalML, 5000)) }); // Entre 0.5L y 5L
      },

      setCupSize: (sizeML: number) => {
        set({ cupSizeML: Math.max(100, Math.min(sizeML, 1000)) }); // Entre 100ml y 1L
      },

      resetDay: () => {
        set({
          todayML: 0,
          cupsConsumed: 0,
          todayDate: new Date().toISOString().split('T')[0],
        });
      },

      updateDayIfNeeded: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];

        if (state.todayDate !== today) {
          // Nuevo día: guardar ayer en historial y resetear
          const newWeek = [...state.lastWeekML.slice(1), state.todayML];

          set({
            todayML: 0,
            cupsConsumed: 0,
            todayDate: today,
            lastWeekML: newWeek,
          });

          console.log('[Hidratación] Nuevo día iniciado');
        }
      },

      toggleReminder: () => {
        set({ reminderEnabled: !get().reminderEnabled });
      },

      setReminderInterval: (hours: number) => {
        set({ reminderIntervalHours: Math.max(1, Math.min(hours, 6)) }); // Entre 1 y 6 horas
      },
    }),
    {
      name: 'virtual-hero-hydration',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
