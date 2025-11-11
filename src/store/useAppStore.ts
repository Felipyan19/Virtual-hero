/**
 * App Store - Estado global principal
 * Maneja XP, nivel, rachas, logros y configuración
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  isUnlocked: boolean;
  xpReward: number;
}

export interface AppState {
  // Progresión del jugador
  xp: number;
  level: number;
  xpForNextLevel: number;

  // Sistema de rachas
  streakCount: number;
  lastStreakDate: string | null; // ISO date
  longestStreak: number;

  // Logros
  achievements: Achievement[];

  // Onboarding
  hasCompletedOnboarding: boolean;
  userName: string;

  // Configuración
  notificationsEnabled: boolean;
  soundEnabled: boolean;

  // Acciones
  addXP: (amount: number, source: string) => void;
  updateStreak: (date: string) => void;
  unlockAchievement: (achievementId: string) => void;
  resetProgress: () => void;
  setUserName: (name: string) => void;
  completeOnboarding: () => void;
  toggleNotifications: () => void;
  toggleSound: () => void;
}

// Fórmula para calcular XP necesario para siguiente nivel
const calculateXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Logros predefinidos
const initialAchievements: Achievement[] = [
  {
    id: 'first_step',
    title: '¡Primer Paso!',
    description: 'Registra tus primeros 1,000 pasos',
    icon: '👟',
    isUnlocked: false,
    xpReward: 50,
  },
  {
    id: 'hydra_hero',
    title: 'Hidra-Héroe',
    description: 'Completa tu meta de agua por primera vez',
    icon: '💧',
    isUnlocked: false,
    xpReward: 30,
  },
  {
    id: 'sleep_master',
    title: 'Maestro del Sueño',
    description: 'Cumple tu meta de sueño 7 días seguidos',
    icon: '😴',
    isUnlocked: false,
    xpReward: 100,
  },
  {
    id: 'routine_hero',
    title: 'Héroe de Rutina',
    description: 'Mantén una racha de 7 días',
    icon: '🔥',
    isUnlocked: false,
    xpReward: 150,
  },
  {
    id: 'mission_complete',
    title: '¡Misión Cumplida!',
    description: 'Completa tu primera misión de ejercicio',
    icon: '⚡',
    isUnlocked: false,
    xpReward: 50,
  },
  {
    id: 'level_5',
    title: 'Superhéroe en Entrenamiento',
    description: 'Alcanza el nivel 5',
    icon: '🦸',
    isUnlocked: false,
    xpReward: 200,
  },
  {
    id: 'level_10',
    title: 'Superhéroe Legendario',
    description: 'Alcanza el nivel 10',
    icon: '🌟',
    isUnlocked: false,
    xpReward: 500,
  },
  {
    id: 'water_week',
    title: 'Torrente de Poder',
    description: 'Alcanza tu meta de hidratación 7 días seguidos',
    icon: '💦',
    isUnlocked: false,
    xpReward: 120,
  },
  {
    id: 'steps_10k',
    title: 'Corredor Supersónico',
    description: 'Camina 10,000 pasos en un día',
    icon: '🚀',
    isUnlocked: false,
    xpReward: 80,
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      xp: 0,
      level: 1,
      xpForNextLevel: calculateXPForLevel(1),

      streakCount: 0,
      lastStreakDate: null,
      longestStreak: 0,

      achievements: initialAchievements,

      hasCompletedOnboarding: false,
      userName: '',

      notificationsEnabled: true,
      soundEnabled: true,

      // Acciones
      addXP: (amount: number, source: string) => {
        const state = get();
        let newXP = state.xp + amount;
        let newLevel = state.level;
        let xpForNext = state.xpForNextLevel;
        const previousLevel = state.level;

        // Verificar si sube de nivel
        while (newXP >= xpForNext) {
          newXP -= xpForNext;
          newLevel += 1;
          xpForNext = calculateXPForLevel(newLevel);

          // Desbloquear logros de nivel
          if (newLevel === 5) {
            get().unlockAchievement('level_5');
          }
          if (newLevel === 10) {
            get().unlockAchievement('level_10');
          }
        }

        set({
          xp: newXP,
          level: newLevel,
          xpForNextLevel: xpForNext,
        });

        // Trigger level up event if leveled up
        if (newLevel > previousLevel) {
          // Importar dinámicamente para evitar dependencias circulares
          import('./useEventStore').then(({ useEventStore }) => {
            useEventStore.getState().triggerLevelUp(newLevel);
          });
        }

        console.log(
          `[XP] +${amount} desde ${source}. Nivel ${newLevel}, XP: ${newXP}/${xpForNext}`
        );
      },

      updateStreak: (date: string) => {
        const state = get();
        const today = new Date(date).toISOString().split('T')[0];
        const lastDate = state.lastStreakDate;

        if (lastDate === today) {
          // Ya se actualizó hoy
          return;
        }

        // Verificar si es día consecutivo
        const yesterday = new Date(date);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = state.streakCount;

        if (lastDate === yesterdayStr) {
          // Día consecutivo
          newStreak += 1;
        } else if (lastDate !== null && lastDate !== yesterdayStr) {
          // Se rompió la racha
          newStreak = 1;
        } else {
          // Primera vez
          newStreak = 1;
        }

        const newLongest = Math.max(newStreak, state.longestStreak);

        set({
          streakCount: newStreak,
          lastStreakDate: today,
          longestStreak: newLongest,
        });

        // Logros de rachas
        if (newStreak === 7) {
          get().unlockAchievement('routine_hero');
        }

        console.log(`[Racha] Día ${newStreak} consecutivo`);
      },

      unlockAchievement: (achievementId: string) => {
        const state = get();
        const achievement = state.achievements.find((a) => a.id === achievementId);

        if (!achievement || achievement.isUnlocked) {
          return;
        }

        const unlockedAchievement = {
          ...achievement,
          isUnlocked: true,
          unlockedAt: new Date(),
        };

        set({
          achievements: state.achievements.map((a) =>
            a.id === achievementId ? unlockedAchievement : a
          ),
        });

        // Trigger achievement unlocked event
        import('./useEventStore').then(({ useEventStore }) => {
          useEventStore.getState().triggerAchievementUnlocked(unlockedAchievement);
        });

        // También desbloquear en el nuevo sistema de achievements
        import('../services/achievementService').then(({ unlockAchievement }) => {
          unlockAchievement(achievementId);
        });

        // Dar recompensa de XP
        get().addXP(achievement.xpReward, `Logro: ${achievement.title}`);

        console.log(`[Logro] Desbloqueado: ${achievement.title} (+${achievement.xpReward} XP)`);
      },

      resetProgress: () => {
        set({
          xp: 0,
          level: 1,
          xpForNextLevel: calculateXPForLevel(1),
          streakCount: 0,
          lastStreakDate: null,
          longestStreak: 0,
          achievements: initialAchievements,
        });
      },

      setUserName: (name: string) => {
        set({ userName: name });
      },

      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },

      toggleNotifications: () => {
        set({ notificationsEnabled: !get().notificationsEnabled });
      },

      toggleSound: () => {
        set({ soundEnabled: !get().soundEnabled });
      },
    }),
    {
      name: 'virtual-hero-app',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
