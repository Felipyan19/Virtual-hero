/**
 * Pedometer Service - Servicio para sincronizar pasos con el sensor del teléfono
 */

import { Pedometer } from 'expo-sensors';
import { Platform } from 'react-native';

export interface PedometerResult {
  steps: number;
  startDate: Date;
  endDate: Date;
}

/**
 * Verifica si el pedómetro está disponible en el dispositivo
 */
export const isPedometerAvailable = async (): Promise<boolean> => {
  try {
    return await Pedometer.isAvailableAsync();
  } catch (error) {
    console.error('[Pedometer] Error verificando disponibilidad:', error);
    return false;
  }
};

/**
 * Solicita permisos para acceder al pedómetro (solo Android)
 * En iOS los permisos se manejan automáticamente
 */
export const requestPedometerPermissions = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      console.log('[Pedometer] Solicitando permisos de ACTIVITY_RECOGNITION...');
      const result = await Pedometer.requestPermissionsAsync();
      console.log('[Pedometer] Resultado de permisos:', result);

      if (result.granted) {
        console.log('[Pedometer] ✓ Permisos concedidos');
      } else {
        console.log('[Pedometer] ✗ Permisos denegados');
        if (result.canAskAgain !== undefined) {
          console.log('[Pedometer] ¿Puede volver a preguntar?', result.canAskAgain);
        }
      }

      return result.granted;
    }
    // En iOS no necesita permisos explícitos
    console.log('[Pedometer] iOS - no requiere permisos explícitos');
    return true;
  } catch (error) {
    console.error('[Pedometer] Error solicitando permisos:', error);
    return false;
  }
};

/**
 * Obtiene los pasos del día actual
 */
export const getTodaySteps = async (): Promise<number> => {
  try {
    const available = await isPedometerAvailable();
    if (!available) {
      console.log('[Pedometer] Pedómetro no disponible');
      return 0;
    }

    const end = new Date();
    const start = new Date();
    start.setHours(0, 0, 0, 0); // Inicio del día

    console.log(
      `[Pedometer] Obteniendo pasos desde ${start.toLocaleTimeString()} hasta ${end.toLocaleTimeString()}`
    );

    const result = await Pedometer.getStepCountAsync(start, end);

    if (result && typeof result.steps === 'number') {
      console.log(`[Pedometer] ✓ Pasos hoy: ${result.steps}`);
      return result.steps;
    }

    console.log('[Pedometer] ⚠ No se obtuvieron datos de pasos');
    return 0;
  } catch (error) {
    console.error('[Pedometer] ✗ Error obteniendo pasos:', error);
    if (error instanceof Error) {
      console.error('[Pedometer] Mensaje de error:', error.message);
    }
    return 0;
  }
};

/**
 * Obtiene los pasos en un rango de fechas
 */
export const getStepsInRange = async (
  startDate: Date,
  endDate: Date
): Promise<PedometerResult | null> => {
  try {
    const available = await isPedometerAvailable();
    if (!available) {
      return null;
    }

    const result = await Pedometer.getStepCountAsync(startDate, endDate);

    if (result && typeof result.steps === 'number') {
      return {
        steps: result.steps,
        startDate,
        endDate,
      };
    }

    return null;
  } catch (error) {
    console.error('[Pedometer] Error obteniendo pasos en rango:', error);
    return null;
  }
};

/**
 * Suscripción en tiempo real a los pasos
 * Retorna una función para cancelar la suscripción
 */
export const subscribeToPedometer = (callback: (steps: number) => void): (() => void) => {
  let subscription: any = null;
  let baseSteps = 0;

  const startSubscription = async () => {
    try {
      const available = await isPedometerAvailable();
      if (!available) {
        console.log('[Pedometer] Pedómetro no disponible para suscripción');
        return;
      }

      // Solicitar permisos cuando aplique (Android)
      if (Platform.OS === 'android') {
        try {
          const { granted } = await Pedometer.requestPermissionsAsync();
          if (!granted) {
            console.log('[Pedometer] Permisos denegados para suscripción');
            return;
          }
          console.log('[Pedometer] Permisos concedidos');
        } catch (permError) {
          console.error('[Pedometer] Error al solicitar permisos:', permError);
          return;
        }
      }

      // Obtener baseline de pasos del día actual para sumar los incrementos del watch
      baseSteps = await getTodaySteps();

      subscription = Pedometer.watchStepCount((result) => {
        // result.steps = pasos desde que inició la suscripción (no incremental)
        const liveSinceSubscription = typeof result?.steps === 'number' ? result.steps : 0;
        const totalToday = baseSteps + liveSinceSubscription;
        callback(totalToday);
      });

      console.log('[Pedometer] Suscripción iniciada');
    } catch (error) {
      console.error('[Pedometer] Error iniciando suscripción:', error);
    }
  };

  startSubscription();

  // Retorna función para cancelar suscripción
  return () => {
    if (subscription) {
      subscription.remove();
      console.log('[Pedometer] Suscripción cancelada');
    }
  };
};

/**
 * Obtiene el historial de pasos de la última semana
 */
export const getWeeklySteps = async (): Promise<number[]> => {
  try {
    const available = await isPedometerAvailable();
    if (!available) {
      return [0, 0, 0, 0, 0, 0, 0];
    }

    const weeklySteps: number[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const end = new Date(today);
      end.setDate(end.getDate() - i);
      end.setHours(23, 59, 59, 999);

      const start = new Date(end);
      start.setHours(0, 0, 0, 0);

      const result = await Pedometer.getStepCountAsync(start, end);
      weeklySteps.push(result?.steps || 0);
    }

    return weeklySteps;
  } catch (error) {
    console.error('[Pedometer] Error obteniendo historial semanal:', error);
    return [0, 0, 0, 0, 0, 0, 0];
  }
};
