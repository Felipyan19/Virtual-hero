/**
 * Notifications - Sistema de notificaciones locales
 * Manejo de recordatorios de hidratación y otras notificaciones
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configurar comportamiento de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Solicitar permisos de notificaciones
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('[Notificaciones] Permisos denegados');
      return false;
    }

    // Configurar canal en Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('hydration', {
        name: 'Recordatorios de Hidratación',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6D28D9',
      });

      await Notifications.setNotificationChannelAsync('achievements', {
        name: 'Logros y Recompensas',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 250, 500],
        lightColor: '#10B981',
      });
    }

    console.log('[Notificaciones] Permisos concedidos');
    return true;
  } catch (error) {
    console.error('[Notificaciones] Error al solicitar permisos:', error);
    return false;
  }
};

/**
 * Programar recordatorios de hidratación
 */
export const scheduleWaterReminders = async (
  intervalHours: number = 2,
  quietHoursStart: number = 22,
  quietHoursEnd: number = 8
): Promise<void> => {
  try {
    // Cancelar notificaciones previas
    await cancelWaterReminders();

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('[Notificaciones] No hay permisos para programar');
      return;
    }

    // Crear notificaciones para cada intervalo durante el día
    const startHour = quietHoursEnd; // 8 AM
    const endHour = quietHoursStart; // 10 PM

    for (let hour = startHour; hour < endHour; hour += intervalHours) {
      const identifier = `water-reminder-${hour}`;

      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: '💧 ¡Hora de hidratarte, héroe!',
          body: '¿Ya tomaste agua? Mantén tu energía al máximo.',
          data: { type: 'water_reminder' },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          hour,
          minute: 0,
          repeats: true,
        },
      });
    }

    console.log(
      `[Notificaciones] ${(endHour - startHour) / intervalHours} recordatorios programados`
    );
  } catch (error) {
    console.error('[Notificaciones] Error al programar recordatorios:', error);
  }
};

/**
 * Cancelar recordatorios de agua
 */
export const cancelWaterReminders = async (): Promise<void> => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const waterReminders = scheduled.filter((n) => n.identifier.startsWith('water-reminder-'));

    for (const reminder of waterReminders) {
      await Notifications.cancelScheduledNotificationAsync(reminder.identifier);
    }

    console.log('[Notificaciones] Recordatorios de agua cancelados');
  } catch (error) {
    console.error('[Notificaciones] Error al cancelar:', error);
  }
};

/**
 * Mostrar notificación de logro desbloqueado
 */
export const showAchievementNotification = async (
  title: string,
  description: string,
  icon: string
): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${icon} ¡${title}!`,
        body: description,
        data: { type: 'achievement' },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: null, // Inmediato
    });

    console.log(`[Notificaciones] Logro mostrado: ${title}`);
  } catch (error) {
    console.error('[Notificaciones] Error al mostrar logro:', error);
  }
};

/**
 * Mostrar notificación de subida de nivel
 */
export const showLevelUpNotification = async (level: number): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⚡ ¡NIVEL SUBIDO!',
        body: `¡Felicidades! Ahora eres nivel ${level}. ¡Sigue así, héroe!`,
        data: { type: 'level_up', level },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: null,
    });

    console.log(`[Notificaciones] Subida a nivel ${level}`);
  } catch (error) {
    console.error('[Notificaciones] Error:', error);
  }
};

/**
 * Mostrar notificación de racha
 */
export const showStreakNotification = async (streakCount: number): Promise<void> => {
  try {
    const messages = ['🔥 ¡Racha activa!', '⚡ ¡Imparable!', '💪 ¡Sigue así!', '🌟 ¡Increíble!'];

    const title = messages[Math.min(streakCount - 1, messages.length - 1)];

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: `Llevas ${streakCount} días consecutivos. ¡No rompas la racha!`,
        data: { type: 'streak', count: streakCount },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null,
    });

    console.log(`[Notificaciones] Racha de ${streakCount} días`);
  } catch (error) {
    console.error('[Notificaciones] Error:', error);
  }
};

/**
 * Limpiar todas las notificaciones programadas
 */
export const clearAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('[Notificaciones] Todas las notificaciones canceladas');
  } catch (error) {
    console.error('[Notificaciones] Error al limpiar:', error);
  }
};
