/**
 * Notifications - Sistema de notificaciones locales
 * Manejo de recordatorios de hidratación y otras notificaciones
 *
 * NOTA: En Expo Go SDK 53+, verás un error sobre push notifications remotas.
 * Esto es esperado y no afecta las notificaciones locales que usa esta app.
 * Para usar push notifications remotas, necesitas un development build.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Flag global para evitar inicialización múltiple
let notificationsInitialized = false;

// Configurar comportamiento de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    // En Expo Go, las notificaciones se muestran al programarlas (comportamiento de desarrollo)
    // En production, esto no pasará
    // Por ahora, mostramos solo notificaciones importantes (logros, level up)
    const notificationType = notification.request.content.data?.type;

    // Solo mostrar notificaciones importantes inmediatamente
    const isImportant = ['achievement', 'level_up', 'streak'].includes(notificationType as string);

    return {
      shouldShowBanner: isImportant,
      shouldPlaySound: isImportant,
      shouldSetBadge: false,
    };
  },
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

    // Configurar canales en Android
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

      await Notifications.setNotificationChannelAsync('exercise', {
        name: 'Recordatorios de Ejercicio',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 300, 200, 300],
        lightColor: '#F59E0B',
      });

      await Notifications.setNotificationChannelAsync('health', {
        name: 'Recordatorios de Salud',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 200, 100, 200],
        lightColor: '#3B82F6',
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
        } as Notifications.NotificationTriggerInput,
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
 * Frases motivadoras para ejercicio
 */
const EXERCISE_MOTIVATIONAL_PHRASES = [
  '¡Es hora de mover el cuerpo, héroe! 💪',
  '¡Tu cuerpo te lo agradecerá! Hora de ejercitarte 🏃',
  '¡No hay excusas! Vamos a entrenar 🔥',
  '¡El héroe que llevas dentro te está esperando! 🦸',
  '¡Cada paso cuenta! Hora de tu entrenamiento ⚡',
  '¡Tu yo del futuro te lo agradecerá! 🌟',
  '¡Desafía tus límites! Es hora de ejercicio 💥',
  '¡La consistencia es clave! Vamos a entrenar 🎯',
  '¡Tu salud es tu mayor tesoro! Hora de moverte 💎',
  '¡Los héroes entrenan todos los días! 🏋️',
];

/**
 * Programar recordatorios de ejercicio
 * @param times - Array de horas [7, 12, 18] para 7am, 12pm, 6pm
 */
export const scheduleExerciseReminders = async (times: number[] = [7, 12, 18]): Promise<void> => {
  try {
    await cancelExerciseReminders();

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    for (const hour of times) {
      const phrase =
        EXERCISE_MOTIVATIONAL_PHRASES[
          Math.floor(Math.random() * EXERCISE_MOTIVATIONAL_PHRASES.length)
        ];
      const identifier = `exercise-reminder-${hour}`;

      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: phrase,
          body: '¡Dedica 15 minutos a tu entrenamiento! Tu cuerpo es tu templo.',
          data: { type: 'exercise_reminder' },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          hour,
          minute: 0,
          repeats: true,
        } as Notifications.NotificationTriggerInput,
      });
    }

    console.log(`[Notificaciones] ${times.length} recordatorios de ejercicio programados`);
  } catch (error) {
    console.error('[Notificaciones] Error al programar ejercicio:', error);
  }
};

/**
 * Cancelar recordatorios de ejercicio
 */
export const cancelExerciseReminders = async (): Promise<void> => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const exerciseReminders = scheduled.filter((n) =>
      n.identifier.startsWith('exercise-reminder-')
    );

    for (const reminder of exerciseReminders) {
      await Notifications.cancelScheduledNotificationAsync(reminder.identifier);
    }

    console.log('[Notificaciones] Recordatorios de ejercicio cancelados');
  } catch (error) {
    console.error('[Notificaciones] Error al cancelar:', error);
  }
};

/**
 * Programar recordatorio para dormir
 * @param bedtimeHour - Hora para recordar dormir (ej: 22 = 10 PM)
 */
export const scheduleBedtimeReminder = async (bedtimeHour: number = 22): Promise<void> => {
  try {
    await cancelBedtimeReminder();

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    await Notifications.scheduleNotificationAsync({
      identifier: 'bedtime-reminder',
      content: {
        title: '🌙 Hora de descansar, héroe',
        body: 'Un buen descanso es fundamental. Prepárate para dormir y recuperar energías.',
        data: { type: 'bedtime_reminder' },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        hour: bedtimeHour,
        minute: 0,
        repeats: true,
      } as Notifications.NotificationTriggerInput,
    });

    console.log('[Notificaciones] Recordatorio de dormir programado');
  } catch (error) {
    console.error('[Notificaciones] Error al programar:', error);
  }
};

/**
 * Cancelar recordatorio de dormir
 */
export const cancelBedtimeReminder = async (): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync('bedtime-reminder');
    console.log('[Notificaciones] Recordatorio de dormir cancelado');
  } catch (error) {
    console.error('[Notificaciones] Error al cancelar:', error);
  }
};

/**
 * Programar recordatorios de postura/estiramiento
 */
export const schedulePostureReminders = async (
  intervalHours: number = 1,
  startHour: number = 9,
  endHour: number = 18
): Promise<void> => {
  try {
    await cancelPostureReminders();

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    const messages = [
      {
        title: '🧘 Revisa tu postura',
        body: '¿Estás sentado correctamente? Endereza la espalda y relaja los hombros.',
      },
      {
        title: '🤸 ¡Hora de estirar!',
        body: 'Levántate y estira el cuerpo por 2 minutos. Tu espalda te lo agradecerá.',
      },
      {
        title: '💺 Postura correcta',
        body: '¿Estás encorvado? Ajusta tu postura y respira profundo.',
      },
      {
        title: '🏃 Muévete un poco',
        body: 'Lleva mucho tiempo sentado. Da una pequeña caminata de 5 minutos.',
      },
    ];

    let messageIndex = 0;
    for (let hour = startHour; hour <= endHour; hour += intervalHours) {
      const message = messages[messageIndex % messages.length];
      const identifier = `posture-reminder-${hour}`;

      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: message.title,
          body: message.body,
          data: { type: 'posture_reminder' },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.DEFAULT,
        },
        trigger: {
          hour,
          minute: 0,
          repeats: true,
        } as Notifications.NotificationTriggerInput,
      });

      messageIndex++;
    }

    console.log('[Notificaciones] Recordatorios de postura programados');
  } catch (error) {
    console.error('[Notificaciones] Error al programar:', error);
  }
};

/**
 * Cancelar recordatorios de postura
 */
export const cancelPostureReminders = async (): Promise<void> => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const postureReminders = scheduled.filter((n) => n.identifier.startsWith('posture-reminder-'));

    for (const reminder of postureReminders) {
      await Notifications.cancelScheduledNotificationAsync(reminder.identifier);
    }

    console.log('[Notificaciones] Recordatorios de postura cancelados');
  } catch (error) {
    console.error('[Notificaciones] Error al cancelar:', error);
  }
};

/**
 * Programar recordatorios de descanso visual
 * (Para personas que trabajan frente a pantallas)
 */
export const scheduleEyeRestReminders = async (
  intervalMinutes: number = 30,
  startHour: number = 9,
  endHour: number = 18
): Promise<void> => {
  try {
    await cancelEyeRestReminders();

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    // Programar recordatorios cada 30 minutos
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        if (hour === endHour && minute > 0) break;

        const identifier = `eye-rest-${hour}-${minute}`;

        await Notifications.scheduleNotificationAsync({
          identifier,
          content: {
            title: '👁️ Regla 20-20-20',
            body: 'Mira algo a 20 pies (6m) de distancia por 20 segundos. Cuida tus ojos.',
            data: { type: 'eye_rest_reminder' },
            sound: false, // Sin sonido para no interrumpir
            priority: Notifications.AndroidNotificationPriority.LOW,
          },
          trigger: {
            hour,
            minute,
            repeats: true,
          } as Notifications.NotificationTriggerInput,
        });
      }
    }

    console.log('[Notificaciones] Recordatorios de descanso visual programados');
  } catch (error) {
    console.error('[Notificaciones] Error al programar:', error);
  }
};

/**
 * Cancelar recordatorios de descanso visual
 */
export const cancelEyeRestReminders = async (): Promise<void> => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const eyeReminders = scheduled.filter((n) => n.identifier.startsWith('eye-rest-'));

    for (const reminder of eyeReminders) {
      await Notifications.cancelScheduledNotificationAsync(reminder.identifier);
    }

    console.log('[Notificaciones] Recordatorios visuales cancelados');
  } catch (error) {
    console.error('[Notificaciones] Error al cancelar:', error);
  }
};

/**
 * Programar recordatorios de meditación/mindfulness
 */
export const scheduleMeditationReminders = async (
  times: number[] = [8, 20] // 8 AM y 8 PM
): Promise<void> => {
  try {
    await cancelMeditationReminders();

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    const messages = [
      {
        title: '🧘 Meditación matutina',
        body: 'Comienza el día con 5 minutos de meditación. Centra tu mente.',
      },
      {
        title: '🌅 Mindfulness nocturno',
        body: 'Relájate con una breve sesión de respiración consciente.',
      },
    ];

    for (let index = 0; index < times.length; index++) {
      const hour = times[index];
      const message = messages[index % messages.length];
      const identifier = `meditation-reminder-${hour}`;

      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: message.title,
          body: message.body,
          data: { type: 'meditation_reminder' },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.DEFAULT,
        },
        trigger: {
          hour,
          minute: 0,
          repeats: true,
        } as Notifications.NotificationTriggerInput,
      });
    }

    console.log('[Notificaciones] Recordatorios de meditación programados');
  } catch (error) {
    console.error('[Notificaciones] Error al programar:', error);
  }
};

/**
 * Cancelar recordatorios de meditación
 */
export const cancelMeditationReminders = async (): Promise<void> => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const meditationReminders = scheduled.filter((n) =>
      n.identifier.startsWith('meditation-reminder-')
    );

    for (const reminder of meditationReminders) {
      await Notifications.cancelScheduledNotificationAsync(reminder.identifier);
    }

    console.log('[Notificaciones] Recordatorios de meditación cancelados');
  } catch (error) {
    console.error('[Notificaciones] Error al cancelar:', error);
  }
};

/**
 * Programar recordatorios de alimentación saludable
 */
export const scheduleHealthyEatingReminders = async (
  mealTimes: number[] = [7, 13, 19] // Desayuno, almuerzo, cena
): Promise<void> => {
  try {
    await cancelHealthyEatingReminders();

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    const messages = [
      {
        title: '🥗 Hora del desayuno',
        body: 'El desayuno es importante. Come algo nutritivo para empezar bien el día.',
      },
      {
        title: '🍽️ Hora del almuerzo',
        body: 'Recarga energías con una comida balanceada. ¡Tu cuerpo lo necesita!',
      },
      {
        title: '🥘 Hora de cenar',
        body: 'Una cena ligera y saludable te ayudará a descansar mejor.',
      },
    ];

    for (let index = 0; index < mealTimes.length; index++) {
      const hour = mealTimes[index];
      const message = messages[index % messages.length];
      const identifier = `meal-reminder-${hour}`;

      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: message.title,
          body: message.body,
          data: { type: 'meal_reminder' },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.DEFAULT,
        },
        trigger: {
          hour,
          minute: 0,
          repeats: true,
        } as Notifications.NotificationTriggerInput,
      });
    }

    console.log('[Notificaciones] Recordatorios de comidas programados');
  } catch (error) {
    console.error('[Notificaciones] Error al programar:', error);
  }
};

/**
 * Cancelar recordatorios de alimentación
 */
export const cancelHealthyEatingReminders = async (): Promise<void> => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const mealReminders = scheduled.filter((n) => n.identifier.startsWith('meal-reminder-'));

    for (const reminder of mealReminders) {
      await Notifications.cancelScheduledNotificationAsync(reminder.identifier);
    }

    console.log('[Notificaciones] Recordatorios de comidas cancelados');
  } catch (error) {
    console.error('[Notificaciones] Error al cancelar:', error);
  }
};

/**
 * Programar todos los recordatorios por defecto
 */
export const scheduleAllDefaultReminders = async (): Promise<void> => {
  try {
    await scheduleWaterReminders(2); // Cada 2 horas
    await scheduleExerciseReminders([7, 12, 18]); // 7am, 12pm, 6pm
    await scheduleBedtimeReminder(22); // 10 PM
    await schedulePostureReminders(1, 9, 18); // Cada hora de 9am a 6pm
    await scheduleMeditationReminders([8, 20]); // 8am y 8pm
    await scheduleHealthyEatingReminders([7, 13, 19]); // 7am, 1pm, 7pm

    console.log('[Notificaciones] Todos los recordatorios programados');
  } catch (error) {
    console.error('[Notificaciones] Error al programar todos:', error);
  }
};

/**
 * Cancelar todos los recordatorios de salud (mantiene logros y rachas)
 */
export const cancelAllHealthReminders = async (): Promise<void> => {
  try {
    await cancelWaterReminders();
    await cancelExerciseReminders();
    await cancelBedtimeReminder();
    await cancelPostureReminders();
    await cancelEyeRestReminders();
    await cancelMeditationReminders();
    await cancelHealthyEatingReminders();

    console.log('[Notificaciones] Todos los recordatorios de salud cancelados');
  } catch (error) {
    console.error('[Notificaciones] Error al cancelar todos:', error);
  }
};

/**
 * Restaurar notificaciones basadas en configuración guardada
 * Debe llamarse al iniciar la app
 *
 * PROTECCIÓN MEJORADA CONTRA DUPLICADOS:
 * - Usa debouncing de 2 horas (más estricto que 24h)
 * - Verifica notificaciones existentes antes de cancelar
 * - Logging detallado para debugging
 * - Protección contra hot reload y reaperturas rápidas
 */
export const restoreNotificationsFromSettings = async (): Promise<void> => {
  try {
    // Importar AsyncStorage dinámicamente para evitar errores de dependencia circular
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;

    console.log('[Notificaciones] 🔄 Iniciando restauración de notificaciones...');

    // === PASO 1: Verificar inicialización reciente (debouncing estricto) ===
    const LAST_INIT_KEY = 'notifications_last_initialized';
    const INIT_SESSION_KEY = 'notifications_init_session_id';
    const lastInitTimestamp = await AsyncStorage.getItem(LAST_INIT_KEY);
    const lastSessionId = await AsyncStorage.getItem(INIT_SESSION_KEY);
    const now = Date.now();
    const currentSessionId = `${now}-${Math.random().toString(36).substr(2, 9)}`;

    // Debouncing de 2 horas (más estricto para evitar duplicados en reaperturas del mismo día)
    const TWO_HOURS = 2 * 60 * 60 * 1000;

    if (lastInitTimestamp) {
      const timeSinceLastInit = now - parseInt(lastInitTimestamp, 10);

      if (timeSinceLastInit < TWO_HOURS) {
        console.log(
          `[Notificaciones] ⏸️ Ya inicializadas hace ${Math.round(timeSinceLastInit / 60000)} minutos, omitiendo`
        );
        console.log(`[Notificaciones] 📋 Última sesión: ${lastSessionId}`);
        notificationsInitialized = true;
        return;
      } else {
        console.log(
          `[Notificaciones] ⏰ Última inicialización hace ${Math.round(timeSinceLastInit / 60000)} minutos, continuando...`
        );
      }
    }

    // === PASO 2: Evitar inicialización múltiple en la misma sesión ===
    if (notificationsInitialized) {
      console.log(
        '[Notificaciones] ✅ Ya inicializadas en esta sesión (flag en memoria), omitiendo'
      );
      return;
    }

    // === PASO 3: Verificar notificaciones programadas existentes ===
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log(
      `[Notificaciones] 📊 Notificaciones programadas existentes: ${scheduledNotifications.length}`
    );

    // Listar tipos de notificaciones existentes para debugging
    if (scheduledNotifications.length > 0) {
      const types = scheduledNotifications.map((n) => n.identifier).join(', ');
      console.log(`[Notificaciones] 📝 Tipos existentes: ${types.substring(0, 100)}...`);

      // Si hay muchas notificaciones y se inicializó hace poco, probablemente son duplicados
      if (scheduledNotifications.length > 50 && lastInitTimestamp) {
        const timeSinceLastInit = now - parseInt(lastInitTimestamp, 10);
        if (timeSinceLastInit < TWO_HOURS) {
          console.log('[Notificaciones] ⚠️ Detectadas posibles duplicados, omitiendo');
          notificationsInitialized = true;
          return;
        }
      }
    }

    // === PASO 4: Cancelar notificaciones existentes antes de reprogramar ===
    if (scheduledNotifications.length > 0) {
      console.log('[Notificaciones] 🧹 Limpiando notificaciones previas...');
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('[Notificaciones] ✅ Notificaciones previas canceladas');
    }

    // === PASO 5: Leer configuración de usuario desde AsyncStorage ===
    const STORAGE_KEYS = {
      WATER_REMINDERS: 'notifications_water_enabled',
      EXERCISE_REMINDERS: 'notifications_exercise_enabled',
      BEDTIME_REMINDER: 'notifications_bedtime_enabled',
      POSTURE_REMINDERS: 'notifications_posture_enabled',
      EYE_REST_REMINDERS: 'notifications_eye_rest_enabled',
      MEDITATION_REMINDERS: 'notifications_meditation_enabled',
      MEAL_REMINDERS: 'notifications_meal_enabled',
    };

    const settings = await AsyncStorage.multiGet(Object.values(STORAGE_KEYS));
    console.log('[Notificaciones] 📖 Configuración leída desde AsyncStorage');

    // === PASO 6: Programar notificaciones según configuración ===
    let scheduledCount = 0;

    for (const [key, value] of settings) {
      if (value === 'true') {
        console.log(`[Notificaciones] 🔔 Programando: ${key}`);

        switch (key) {
          case STORAGE_KEYS.WATER_REMINDERS:
            await scheduleWaterReminders(2);
            scheduledCount++;
            break;
          case STORAGE_KEYS.EXERCISE_REMINDERS:
            await scheduleExerciseReminders([7, 12, 18]);
            scheduledCount++;
            break;
          case STORAGE_KEYS.BEDTIME_REMINDER:
            await scheduleBedtimeReminder(22);
            scheduledCount++;
            break;
          case STORAGE_KEYS.POSTURE_REMINDERS:
            await schedulePostureReminders(1, 9, 18);
            scheduledCount++;
            break;
          case STORAGE_KEYS.EYE_REST_REMINDERS:
            await scheduleEyeRestReminders(30, 9, 18);
            scheduledCount++;
            break;
          case STORAGE_KEYS.MEDITATION_REMINDERS:
            await scheduleMeditationReminders([8, 20]);
            scheduledCount++;
            break;
          case STORAGE_KEYS.MEAL_REMINDERS:
            await scheduleHealthyEatingReminders([7, 13, 19]);
            scheduledCount++;
            break;
        }
      }
    }

    // === PASO 7: Guardar timestamp y session ID de inicialización ===
    await AsyncStorage.multiSet([
      [LAST_INIT_KEY, now.toString()],
      [INIT_SESSION_KEY, currentSessionId],
    ]);

    // === PASO 8: Marcar como inicializado y verificar total ===
    notificationsInitialized = true;

    const finalScheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log(
      `[Notificaciones] ✅ Restauración completada: ${scheduledCount} tipos programados, ${finalScheduled.length} notificaciones totales`
    );
    console.log(`[Notificaciones] 🆔 Session ID: ${currentSessionId}`);
  } catch (error) {
    console.error('[Notificaciones] ❌ Error al restaurar notificaciones:', error);
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

/**
 * Resetear el flag de inicialización (útil para testing o cuando el usuario cambia configuraciones)
 * IMPORTANTE: Llama esta función cuando el usuario cambie configuraciones de notificaciones
 * para forzar una re-inicialización inmediata
 */
export const resetNotificationsInitialization = async (): Promise<void> => {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const LAST_INIT_KEY = 'notifications_last_initialized';

    // Resetear flag en memoria
    notificationsInitialized = false;

    // Eliminar timestamp de AsyncStorage para forzar re-inicialización
    await AsyncStorage.removeItem(LAST_INIT_KEY);

    console.log('[Notificaciones] Flag de inicialización reseteado');
  } catch (error) {
    console.error('[Notificaciones] Error al resetear inicialización:', error);
  }
};
