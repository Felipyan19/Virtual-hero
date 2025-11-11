/**
 * Achievement Migration Service
 * Migra logros del sistema antiguo (useAppStore) al nuevo sistema (achievementService)
 */

import { useAppStore } from '@/store/useAppStore';
import { loadUserStats, saveUserStats, unlockAchievement } from './achievementService';

/**
 * Migra los logros desbloqueados del sistema antiguo al nuevo
 * Esta función solo se ejecuta una vez al inicio de la app
 */
export const migrateOldAchievements = async (): Promise<void> => {
  try {
    // Obtener logros del sistema antiguo
    const oldAchievements = useAppStore.getState().achievements;
    const unlockedOldAchievements = oldAchievements.filter((a) => a.isUnlocked);

    if (unlockedOldAchievements.length === 0) {
      console.log('[Migration] No hay logros antiguos para migrar');
      return;
    }

    // Obtener stats del nuevo sistema
    const userStats = await loadUserStats();

    // Migrar cada logro desbloqueado
    let migratedCount = 0;
    for (const oldAchievement of unlockedOldAchievements) {
      // Verificar si ya está desbloqueado en el nuevo sistema
      const alreadyUnlocked = userStats.unlockedAchievements.some(
        (a) => a.achievementId === oldAchievement.id
      );

      if (!alreadyUnlocked) {
        // Desbloquear en el nuevo sistema
        await unlockAchievement(oldAchievement.id);
        migratedCount++;
        console.log(`[Migration] Migrado logro: ${oldAchievement.title}`);
      }
    }

    if (migratedCount > 0) {
      console.log(`[Migration] ${migratedCount} logros migrados exitosamente`);
    } else {
      console.log('[Migration] Todos los logros ya estaban sincronizados');
    }
  } catch (error) {
    console.error('[Migration] Error migrando logros:', error);
    throw error;
  }
};
