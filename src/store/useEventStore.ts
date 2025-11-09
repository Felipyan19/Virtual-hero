/**
 * Event Store - Sistema de eventos globales para celebraciones
 * Maneja eventos como subida de nivel y logros desbloqueados
 */

import { create } from 'zustand';
import type { Achievement } from './useAppStore';

export interface LevelUpEvent {
  newLevel: number;
  timestamp: number;
}

export interface AchievementUnlockedEvent {
  achievement: Achievement;
  timestamp: number;
}

interface EventState {
  // Eventos pendientes
  levelUpEvent: LevelUpEvent | null;
  achievementEvent: AchievementUnlockedEvent | null;

  // Acciones
  triggerLevelUp: (newLevel: number) => void;
  triggerAchievementUnlocked: (achievement: Achievement) => void;
  clearLevelUpEvent: () => void;
  clearAchievementEvent: () => void;
}

export const useEventStore = create<EventState>((set) => ({
  levelUpEvent: null,
  achievementEvent: null,

  triggerLevelUp: (newLevel: number) => {
    console.log('[EventStore] Level up event:', newLevel);
    set({
      levelUpEvent: {
        newLevel,
        timestamp: Date.now(),
      },
    });
  },

  triggerAchievementUnlocked: (achievement: Achievement) => {
    console.log('[EventStore] Achievement unlocked event:', achievement.title);
    set({
      achievementEvent: {
        achievement,
        timestamp: Date.now(),
      },
    });
  },

  clearLevelUpEvent: () => {
    set({ levelUpEvent: null });
  },

  clearAchievementEvent: () => {
    set({ achievementEvent: null });
  },
}));
