/**
 * Pedometer Service - Servicio para sincronizar pasos con el sensor del teléfono
 */

import { Pedometer } from 'expo-sensors';
import { Platform, Alert, Linking } from 'react-native';

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
 * Verifica el estado actual de los permisos sin solicitarlos
 */
export const getPermissionStatus = async (): Promise<{
  granted: boolean;
  canAskAgain: boolean;
  status: string;
}> => {
  try {
    if (Platform.OS === 'android') {
      const result = await Pedometer.getPermissionsAsync();
      console.log('[Pedometer] Estado actual de permisos:', result);
      return {
        granted: result.granted,
        canAskAgain: result.canAskAgain ?? true,
        status: result.status,
      };
    }
    // En iOS siempre retorna true
    return { granted: true, canAskAgain: true, status: 'granted' };
  } catch (error) {
    console.error('[Pedometer] Error verificando estado de permisos:', error);
    return { granted: false, canAskAgain: false, status: 'undetermined' };
  }
};

/**
 * Abre la configuración de la aplicación en el sistema
 */
export const openAppSettings = async (): Promise<void> => {
  try {
    await Linking.openSettings();
  } catch (error) {
    console.error('[Pedometer] Error abriendo configuración:', error);
    Alert.alert(
      'Error',
      'No se pudo abrir la configuración de la aplicación. Por favor, ábrela manualmente desde la configuración del sistema.'
    );
  }
};

/**
 * Solicita permisos para acceder al pedómetro (solo Android)
 * En iOS los permisos se manejan automáticamente
 * @param showAlert - Si debe mostrar un diálogo cuando los permisos están denegados permanentemente
 */
export const requestPedometerPermissions = async (showAlert: boolean = true): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      // Primero verificar el estado actual de los permisos
      const currentStatus = await getPermissionStatus();

      // Si ya están concedidos, retornar true
      if (currentStatus.granted) {
        console.log('[Pedometer] ✓ Permisos ya concedidos previamente');
        return true;
      }

      // Si no puede volver a preguntar (denegado permanentemente)
      if (!currentStatus.canAskAgain) {
        console.log('[Pedometer] ✗ Permisos denegados permanentemente');

        if (showAlert) {
          Alert.alert(
            'Permisos requeridos',
            'Para contar tus pasos, Virtual Hero necesita acceso al sensor de actividad física.\n\nDebes habilitar el permiso manualmente desde la configuración de la aplicación.',
            [
              {
                text: 'Cancelar',
                style: 'cancel',
              },
              {
                text: 'Abrir Configuración',
                onPress: () => openAppSettings(),
              },
            ]
          );
        }

        return false;
      }

      // Solicitar permisos si puede preguntar
      console.log('[Pedometer] Solicitando permisos de ACTIVITY_RECOGNITION...');
      const result = await Pedometer.requestPermissionsAsync();
      console.log('[Pedometer] Resultado de permisos:', result);

      if (result.granted) {
        console.log('[Pedometer] ✓ Permisos concedidos');
        return true;
      } else {
        console.log('[Pedometer] ✗ Permisos denegados');
        if (result.canAskAgain !== undefined) {
          console.log('[Pedometer] ¿Puede volver a preguntar?', result.canAskAgain);
        }
        return false;
      }
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
