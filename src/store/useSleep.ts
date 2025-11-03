/**
 * Sleep Store - Manejo de objetivos y registro de sueño
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SleepRecord {
  date: string; // ISO date
  sleepMinutes: number;
  targetMet: boolean;
  bedTime?: string; // HH:mm
  wakeTime?: string; // HH:mm
}

export interface SleepState {
  // Objetivos
  targetSleepMinutes: number; // Por defecto 480 (8 horas)
  targetBedTime: string; // HH:mm (ej: "22:30")
  targetWakeTime: string; // HH:mm (ej: "06:30")

  // Registro actual
  todayDate: string;
  todayMinutes: number;
  todayBedTime: string | null;
  todayWakeTime: string | null;

  // Historial
  lastWeekRecords: SleepRecord[];
  consecutiveDaysMetGoal: number;

  // Permisos
  hasHealthPermission: boolean;

  // Acciones
  setTargetSleepMinutes: (minutes: number) => void;
  setTargetBedTime: (time: string) => void;
  setTargetWakeTime: (time: string) => void;
  logSleep: (minutes: number, bedTime?: string, wakeTime?: string) => void;
  updateDayIfNeeded: () => void;
  setHealthPermission: (granted: boolean) => void;
}

export const useSleep = create<SleepState>()(
  persist(
    (set, get) => ({
      // Valores por defecto
      targetSleepMinutes: 480, // 8 horas
      targetBedTime: '22:30',
      targetWakeTime: '06:30',

      todayDate: new Date().toISOString().split('T')[0],
      todayMinutes: 0,
      todayBedTime: null,
      todayWakeTime: null,

      lastWeekRecords: [],
      consecutiveDaysMetGoal: 0,

      hasHealthPermission: false,

      setTargetSleepMinutes: (minutes: number) => {
        // Entre 4 y 12 horas
        set({ targetSleepMinutes: Math.max(240, Math.min(minutes, 720)) });
      },

      setTargetBedTime: (time: string) => {
        set({ targetBedTime: time });
      },

      setTargetWakeTime: (time: string) => {
        set({ targetWakeTime: time });
      },

      logSleep: (minutes: number, bedTime?: string, wakeTime?: string) => {
        const state = get();
        state.updateDayIfNeeded();

        const targetMet = minutes >= state.targetSleepMinutes;

        set({
          todayMinutes: minutes,
          todayBedTime: bedTime || state.todayBedTime,
          todayWakeTime: wakeTime || state.todayWakeTime,
        });

        // Actualizar racha de días que cumplió meta
        if (targetMet) {
          const newConsecutive = state.consecutiveDaysMetGoal + 1;
          set({ consecutiveDaysMetGoal: newConsecutive });

          // Logro: 7 días seguidos durmiendo bien
          if (newConsecutive === 7) {
            console.log('[Sueño] ¡7 días seguidos cumpliendo meta! 🌙');
            // TODO: Desbloquear logro 'sleep_master'
          }

          // TODO: Sumar XP (40 XP por noche completa)
          console.log(`[Sueño] Meta cumplida: ${minutes} min`);
        } else {
          set({ consecutiveDaysMetGoal: 0 });
        }
      },

      updateDayIfNeeded: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];

        if (state.todayDate !== today) {
          // Guardar ayer en historial
          if (state.todayMinutes > 0) {
            const record: SleepRecord = {
              date: state.todayDate,
              sleepMinutes: state.todayMinutes,
              targetMet: state.todayMinutes >= state.targetSleepMinutes,
              bedTime: state.todayBedTime || undefined,
              wakeTime: state.todayWakeTime || undefined,
            };

            const newWeek = [...state.lastWeekRecords.slice(-6), record];
            set({ lastWeekRecords: newWeek });
          }

          // Resetear día
          set({
            todayDate: today,
            todayMinutes: 0,
            todayBedTime: null,
            todayWakeTime: null,
          });

          console.log('[Sueño] Nuevo día iniciado');
        }
      },

      setHealthPermission: (granted: boolean) => {
        set({ hasHealthPermission: granted });
      },
    }),
    {
      name: 'virtual-hero-sleep',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
