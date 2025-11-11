/**
 * Notifications Settings Screen - Configuración de notificaciones
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import theme from '@/theme/theme';
import { PanelCard } from '@/components/PanelCard';
import {
  getPermissionStatus,
  requestPedometerPermissions,
  openAppSettings,
} from '@/services/pedometerService';
import {
  scheduleWaterReminders,
  cancelWaterReminders,
  scheduleExerciseReminders,
  cancelExerciseReminders,
  scheduleBedtimeReminder,
  cancelBedtimeReminder,
  schedulePostureReminders,
  cancelPostureReminders,
  scheduleEyeRestReminders,
  cancelEyeRestReminders,
  scheduleMeditationReminders,
  cancelMeditationReminders,
  scheduleHealthyEatingReminders,
  cancelHealthyEatingReminders,
  scheduleAllDefaultReminders,
  cancelAllHealthReminders,
} from '@/lib/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Claves para AsyncStorage
const STORAGE_KEYS = {
  WATER_REMINDERS: 'notifications_water_enabled',
  EXERCISE_REMINDERS: 'notifications_exercise_enabled',
  BEDTIME_REMINDER: 'notifications_bedtime_enabled',
  POSTURE_REMINDERS: 'notifications_posture_enabled',
  EYE_REST_REMINDERS: 'notifications_eye_rest_enabled',
  MEDITATION_REMINDERS: 'notifications_meditation_enabled',
  MEAL_REMINDERS: 'notifications_meal_enabled',
};

export default function NotificationsSettingsScreen() {
  const router = useRouter();

  // Estados de notificaciones
  const [waterReminders, setWaterReminders] = useState(false);
  const [exerciseReminders, setExerciseReminders] = useState(false);
  const [bedtimeReminder, setBedtimeReminder] = useState(false);
  const [postureReminders, setPostureReminders] = useState(false);
  const [eyeRestReminders, setEyeRestReminders] = useState(false);
  const [meditationReminders, setMeditationReminders] = useState(false);
  const [mealReminders, setMealReminders] = useState(false);

  const [loading, setLoading] = useState(true);

  // Estado de permisos del podómetro
  const [pedometerPermissionGranted, setPedometerPermissionGranted] = useState(false);
  const [pedometerCanAskAgain, setPedometerCanAskAgain] = useState(true);

  // Cargar configuraciones guardadas
  useEffect(() => {
    loadNotificationSettings();
    checkPedometerPermission();
  }, []);

  const checkPedometerPermission = async () => {
    const status = await getPermissionStatus();
    setPedometerPermissionGranted(status.granted);
    setPedometerCanAskAgain(status.canAskAgain);
  };

  const loadNotificationSettings = async () => {
    try {
      const settings = await AsyncStorage.multiGet(Object.values(STORAGE_KEYS));

      settings.forEach(([key, value]) => {
        const isEnabled = value === 'true';
        switch (key) {
          case STORAGE_KEYS.WATER_REMINDERS:
            setWaterReminders(isEnabled);
            break;
          case STORAGE_KEYS.EXERCISE_REMINDERS:
            setExerciseReminders(isEnabled);
            break;
          case STORAGE_KEYS.BEDTIME_REMINDER:
            setBedtimeReminder(isEnabled);
            break;
          case STORAGE_KEYS.POSTURE_REMINDERS:
            setPostureReminders(isEnabled);
            break;
          case STORAGE_KEYS.EYE_REST_REMINDERS:
            setEyeRestReminders(isEnabled);
            break;
          case STORAGE_KEYS.MEDITATION_REMINDERS:
            setMeditationReminders(isEnabled);
            break;
          case STORAGE_KEYS.MEAL_REMINDERS:
            setMealReminders(isEnabled);
            break;
        }
      });
    } catch (error) {
      console.error('Error al cargar configuraciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveNotificationSetting = async (key: string, value: boolean) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.error('Error al guardar configuración:', error);
    }
  };

  // Manejadores de toggles
  const toggleWaterReminders = async (value: boolean) => {
    setWaterReminders(value);
    await saveNotificationSetting(STORAGE_KEYS.WATER_REMINDERS, value);

    if (value) {
      await scheduleWaterReminders(2); // Cada 2 horas
    } else {
      await cancelWaterReminders();
    }
  };

  const toggleExerciseReminders = async (value: boolean) => {
    setExerciseReminders(value);
    await saveNotificationSetting(STORAGE_KEYS.EXERCISE_REMINDERS, value);

    if (value) {
      await scheduleExerciseReminders([7, 12, 18]); // 7am, 12pm, 6pm
    } else {
      await cancelExerciseReminders();
    }
  };

  const toggleBedtimeReminder = async (value: boolean) => {
    setBedtimeReminder(value);
    await saveNotificationSetting(STORAGE_KEYS.BEDTIME_REMINDER, value);

    if (value) {
      await scheduleBedtimeReminder(22); // 10 PM
    } else {
      await cancelBedtimeReminder();
    }
  };

  const togglePostureReminders = async (value: boolean) => {
    setPostureReminders(value);
    await saveNotificationSetting(STORAGE_KEYS.POSTURE_REMINDERS, value);

    if (value) {
      await schedulePostureReminders(1, 9, 18); // Cada hora de 9am a 6pm
    } else {
      await cancelPostureReminders();
    }
  };

  const toggleEyeRestReminders = async (value: boolean) => {
    setEyeRestReminders(value);
    await saveNotificationSetting(STORAGE_KEYS.EYE_REST_REMINDERS, value);

    if (value) {
      await scheduleEyeRestReminders(30, 9, 18); // Cada 30 minutos
    } else {
      await cancelEyeRestReminders();
    }
  };

  const toggleMeditationReminders = async (value: boolean) => {
    setMeditationReminders(value);
    await saveNotificationSetting(STORAGE_KEYS.MEDITATION_REMINDERS, value);

    if (value) {
      await scheduleMeditationReminders([8, 20]); // 8am y 8pm
    } else {
      await cancelMeditationReminders();
    }
  };

  const toggleMealReminders = async (value: boolean) => {
    setMealReminders(value);
    await saveNotificationSetting(STORAGE_KEYS.MEAL_REMINDERS, value);

    if (value) {
      await scheduleHealthyEatingReminders([7, 13, 19]); // 7am, 1pm, 7pm
    } else {
      await cancelHealthyEatingReminders();
    }
  };

  const enableAllReminders = async () => {
    Alert.alert(
      '🔔 Activar todos los recordatorios',
      '¿Deseas activar todos los recordatorios de salud y bienestar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Activar todo',
          onPress: async () => {
            // Activar todos los estados
            setWaterReminders(true);
            setExerciseReminders(true);
            setBedtimeReminder(true);
            setPostureReminders(true);
            setMeditationReminders(true);
            setMealReminders(true);

            // Guardar en storage
            await AsyncStorage.multiSet([
              [STORAGE_KEYS.WATER_REMINDERS, 'true'],
              [STORAGE_KEYS.EXERCISE_REMINDERS, 'true'],
              [STORAGE_KEYS.BEDTIME_REMINDER, 'true'],
              [STORAGE_KEYS.POSTURE_REMINDERS, 'true'],
              [STORAGE_KEYS.MEDITATION_REMINDERS, 'true'],
              [STORAGE_KEYS.MEAL_REMINDERS, 'true'],
            ]);

            // Programar todas las notificaciones
            await scheduleAllDefaultReminders();
          },
        },
      ]
    );
  };

  const disableAllReminders = async () => {
    Alert.alert(
      '🔕 Desactivar todos los recordatorios',
      '¿Deseas desactivar todos los recordatorios? (Los logros y rachas seguirán activos)',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desactivar todo',
          style: 'destructive',
          onPress: async () => {
            // Desactivar todos los estados
            setWaterReminders(false);
            setExerciseReminders(false);
            setBedtimeReminder(false);
            setPostureReminders(false);
            setEyeRestReminders(false);
            setMeditationReminders(false);
            setMealReminders(false);

            // Guardar en storage
            await AsyncStorage.multiSet([
              [STORAGE_KEYS.WATER_REMINDERS, 'false'],
              [STORAGE_KEYS.EXERCISE_REMINDERS, 'false'],
              [STORAGE_KEYS.BEDTIME_REMINDER, 'false'],
              [STORAGE_KEYS.POSTURE_REMINDERS, 'false'],
              [STORAGE_KEYS.EYE_REST_REMINDERS, 'false'],
              [STORAGE_KEYS.MEDITATION_REMINDERS, 'false'],
              [STORAGE_KEYS.MEAL_REMINDERS, 'false'],
            ]);

            // Cancelar todas las notificaciones de salud
            await cancelAllHealthReminders();
          },
        },
      ]
    );
  };

  const handlePedometerPermission = async () => {
    if (pedometerPermissionGranted) {
      // Ya tiene permisos, mostrar mensaje
      Alert.alert(
        'Permisos activados',
        'El acceso al sensor de actividad física ya está habilitado.'
      );
      return;
    }

    if (!pedometerCanAskAgain) {
      // No puede volver a preguntar, abrir configuración
      Alert.alert(
        'Permisos requeridos',
        'Los permisos fueron denegados previamente. Para habilitar el contador de pasos, debes activar el permiso manualmente desde la configuración de la aplicación.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Abrir Configuración',
            onPress: () => openAppSettings(),
          },
        ]
      );
      return;
    }

    // Solicitar permisos
    const granted = await requestPedometerPermissions(true);
    if (granted) {
      setPedometerPermissionGranted(true);
      Alert.alert('¡Listo!', 'Ahora puedes usar el contador de pasos.');
    } else {
      // Actualizar el estado
      await checkPedometerPermission();
    }
  };

  if (loading) {
    return (
      <View style={[theme.layout.container, styles.loadingContainer]}>
        <Text style={theme.text.body}>Cargando configuración...</Text>
      </View>
    );
  }

  return (
    <View style={theme.layout.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={[theme.text.h2, styles.headerTitle]}>Notificaciones</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Permisos del Sensor de Actividad */}
        <View style={styles.sectionHeader}>
          <Text style={[theme.text.h3, styles.sectionTitle]}>Permisos</Text>
        </View>

        <PanelCard>
          <TouchableOpacity
            style={styles.permissionRow}
            onPress={handlePedometerPermission}
            activeOpacity={0.7}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🏃</Text>
              <View style={styles.settingTextContainer}>
                <Text style={[theme.text.h4, styles.settingTitle]}>Sensor de Actividad Física</Text>
                <Text style={[theme.text.caption, styles.settingDescription]}>
                  {pedometerPermissionGranted
                    ? '✓ Activado - Contador de pasos funcionando'
                    : pedometerCanAskAgain
                      ? '✗ Desactivado - Toca para habilitar'
                      : '✗ Denegado - Abre configuración para activar'}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.permissionBadge,
                pedometerPermissionGranted ? styles.permissionGranted : styles.permissionDenied,
              ]}
            >
              <Text style={styles.permissionBadgeText}>
                {pedometerPermissionGranted ? '✓' : '!'}
              </Text>
            </View>
          </TouchableOpacity>
        </PanelCard>

        {/* Recordatorios */}
        <View style={styles.sectionHeader}>
          <Text style={[theme.text.h3, styles.sectionTitle]}>Recordatorios</Text>
        </View>

        {/* Botones rápidos */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickButton, styles.enableAllButton]}
            onPress={enableAllReminders}
          >
            <Text style={styles.quickButtonText}>🔔 Activar todo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickButton, styles.disableAllButton]}
            onPress={disableAllReminders}
          >
            <Text style={styles.quickButtonText}>🔕 Desactivar todo</Text>
          </TouchableOpacity>
        </View>

        {/* Hidratación */}
        <PanelCard>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>💧</Text>
              <View style={styles.settingTextContainer}>
                <Text style={[theme.text.h4, styles.settingTitle]}>Recordatorios de Agua</Text>
                <Text style={[theme.text.caption, styles.settingDescription]}>
                  Cada 2 horas de 8 AM a 10 PM
                </Text>
              </View>
            </View>
            <Switch
              value={waterReminders}
              onValueChange={toggleWaterReminders}
              trackColor={{ false: theme.colors.paperLight, true: theme.colors.primary }}
              thumbColor={waterReminders ? theme.colors.cyan : theme.colors.ink}
            />
          </View>
        </PanelCard>

        {/* Ejercicio */}
        <PanelCard>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>💪</Text>
              <View style={styles.settingTextContainer}>
                <Text style={[theme.text.h4, styles.settingTitle]}>Recordatorios de Ejercicio</Text>
                <Text style={[theme.text.caption, styles.settingDescription]}>
                  Frases motivadoras a las 7 AM, 12 PM y 6 PM
                </Text>
              </View>
            </View>
            <Switch
              value={exerciseReminders}
              onValueChange={toggleExerciseReminders}
              trackColor={{ false: theme.colors.paperLight, true: theme.colors.primary }}
              thumbColor={exerciseReminders ? theme.colors.cyan : theme.colors.ink}
            />
          </View>
        </PanelCard>

        {/* Dormir */}
        <PanelCard>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🌙</Text>
              <View style={styles.settingTextContainer}>
                <Text style={[theme.text.h4, styles.settingTitle]}>Recordatorio para Dormir</Text>
                <Text style={[theme.text.caption, styles.settingDescription]}>
                  A las 10 PM cada noche
                </Text>
              </View>
            </View>
            <Switch
              value={bedtimeReminder}
              onValueChange={toggleBedtimeReminder}
              trackColor={{ false: theme.colors.paperLight, true: theme.colors.primary }}
              thumbColor={bedtimeReminder ? theme.colors.cyan : theme.colors.ink}
            />
          </View>
        </PanelCard>

        {/* Postura */}
        <PanelCard>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🧘</Text>
              <View style={styles.settingTextContainer}>
                <Text style={[theme.text.h4, styles.settingTitle]}>Postura y Estiramientos</Text>
                <Text style={[theme.text.caption, styles.settingDescription]}>
                  Cada hora de 9 AM a 6 PM
                </Text>
              </View>
            </View>
            <Switch
              value={postureReminders}
              onValueChange={togglePostureReminders}
              trackColor={{ false: theme.colors.paperLight, true: theme.colors.primary }}
              thumbColor={postureReminders ? theme.colors.cyan : theme.colors.ink}
            />
          </View>
        </PanelCard>

        {/* Descanso visual */}
        <PanelCard>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>👁️</Text>
              <View style={styles.settingTextContainer}>
                <Text style={[theme.text.h4, styles.settingTitle]}>Descanso Visual</Text>
                <Text style={[theme.text.caption, styles.settingDescription]}>
                  Regla 20-20-20 cada 30 minutos
                </Text>
              </View>
            </View>
            <Switch
              value={eyeRestReminders}
              onValueChange={toggleEyeRestReminders}
              trackColor={{ false: theme.colors.paperLight, true: theme.colors.primary }}
              thumbColor={eyeRestReminders ? theme.colors.cyan : theme.colors.ink}
            />
          </View>
        </PanelCard>

        {/* Meditación */}
        <PanelCard>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🧘</Text>
              <View style={styles.settingTextContainer}>
                <Text style={[theme.text.h4, styles.settingTitle]}>Meditación y Mindfulness</Text>
                <Text style={[theme.text.caption, styles.settingDescription]}>
                  Mañana (8 AM) y noche (8 PM)
                </Text>
              </View>
            </View>
            <Switch
              value={meditationReminders}
              onValueChange={toggleMeditationReminders}
              trackColor={{ false: theme.colors.paperLight, true: theme.colors.primary }}
              thumbColor={meditationReminders ? theme.colors.cyan : theme.colors.ink}
            />
          </View>
        </PanelCard>

        {/* Alimentación */}
        <PanelCard>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🥗</Text>
              <View style={styles.settingTextContainer}>
                <Text style={[theme.text.h4, styles.settingTitle]}>Comidas Saludables</Text>
                <Text style={[theme.text.caption, styles.settingDescription]}>
                  Desayuno, almuerzo y cena
                </Text>
              </View>
            </View>
            <Switch
              value={mealReminders}
              onValueChange={toggleMealReminders}
              trackColor={{ false: theme.colors.paperLight, true: theme.colors.primary }}
              thumbColor={mealReminders ? theme.colors.cyan : theme.colors.ink}
            />
          </View>
        </PanelCard>

        {/* Nota informativa */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={[theme.text.caption, styles.infoText]}>
            Los recordatorios te ayudan a mantener hábitos saludables. Puedes activar o desactivar
            cada uno según tus necesidades.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.paper,
    borderBottomWidth: theme.borderWidth.thin,
    borderBottomColor: theme.colors.paperLight,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: theme.colors.text,
  },
  headerTitle: {
    color: theme.colors.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  quickActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  quickButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enableAllButton: {
    backgroundColor: theme.colors.primary,
  },
  disableAllButton: {
    backgroundColor: theme.colors.error,
  },
  quickButtonText: {
    ...theme.typography.body,
    color: theme.colors.ink,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  settingIcon: {
    fontSize: 32,
    marginRight: theme.spacing.sm,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    color: theme.colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    color: theme.colors.textSecondary,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: theme.colors.paperLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoText: {
    flex: 1,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  sectionHeader: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  permissionBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionGranted: {
    backgroundColor: theme.colors.success,
  },
  permissionDenied: {
    backgroundColor: theme.colors.error,
  },
  permissionBadgeText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.ink,
  },
});
