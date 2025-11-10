/**
 * Profile Screen - Pantalla de perfil y configuración
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import theme from '@/theme/theme';
import { useAppStore } from '@/store/useAppStore';
import { useSteps } from '@/store/useSteps';
import { useHydration } from '@/store/useHydration';
import { useSleep } from '@/store/useSleep';
import { useAuth } from '@/store/useAuth';
import { PanelCard } from '@/components/PanelCard';
import { BadgeSticker } from '@/components/BadgeSticker';
import { getLevelTitle } from '@/lib/xp';

export default function ProfileScreen() {
  const router = useRouter();
  const {
    userName,
    level,
    xp,
    xpForNextLevel,
    streakCount,
    notificationsEnabled,
    soundEnabled,
    toggleNotifications,
    toggleSound,
  } = useAppStore();

  const { dailyGoalSteps, setDailyGoal: setStepsGoal } = useSteps();
  const {
    dailyGoalML,
    cupSizeML,
    reminderEnabled,
    toggleReminder,
    setDailyGoal: setWaterGoal,
  } = useHydration();
  const { targetSleepMinutes, setTargetSleepMinutes } = useSleep();
  const { logout, user } = useAuth();

  const levelTitle = getLevelTitle(level);

  // Estados para modales de edición
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<'steps' | 'water' | 'sleep' | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro que deseas cerrar sesión?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Cerrar Sesión',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/login');
        },
      },
    ]);
  };

  const openEditModal = (goalType: 'steps' | 'water' | 'sleep') => {
    setEditingGoal(goalType);
    if (goalType === 'steps') {
      setEditValue(dailyGoalSteps.toString());
    } else if (goalType === 'water') {
      // Convertir ml a vasos
      const cups = Math.ceil(dailyGoalML / cupSizeML);
      setEditValue(cups.toString());
    } else if (goalType === 'sleep') {
      setEditValue(Math.floor(targetSleepMinutes / 60).toString());
    }
    setEditModalVisible(true);
  };

  const handleSaveGoal = () => {
    const numValue = parseInt(editValue, 10);

    if (isNaN(numValue) || numValue <= 0) {
      Alert.alert('Error', 'Por favor ingresa un valor válido');
      return;
    }

    if (editingGoal === 'steps') {
      if (numValue < 1000 || numValue > 30000) {
        Alert.alert('Error', 'La meta de pasos debe estar entre 1,000 y 30,000');
        return;
      }
      setStepsGoal(numValue);
      Alert.alert('Éxito', `Meta de pasos actualizada a ${numValue.toLocaleString()}`);
    } else if (editingGoal === 'water') {
      // Validar vasos (entre 2 y 20 vasos)
      if (numValue < 2 || numValue > 20) {
        Alert.alert('Error', 'La meta de agua debe estar entre 2 y 20 vasos');
        return;
      }
      // Convertir vasos a ml
      const mlValue = numValue * cupSizeML;
      setWaterGoal(mlValue);
      Alert.alert('Éxito', `Meta de agua actualizada a ${numValue} vasos (${mlValue}ml)`);
    } else if (editingGoal === 'sleep') {
      const minutes = numValue * 60;
      if (minutes < 240 || minutes > 720) {
        Alert.alert('Error', 'La meta de sueño debe estar entre 4 y 12 horas');
        return;
      }
      setTargetSleepMinutes(minutes);
      Alert.alert('Éxito', `Meta de sueño actualizada a ${numValue} horas`);
    }

    setEditModalVisible(false);
    setEditingGoal(null);
    setEditValue('');
  };

  const getGoalLabel = () => {
    if (editingGoal === 'steps') return 'Pasos diarios';
    if (editingGoal === 'water') return 'Vasos de agua por día';
    if (editingGoal === 'sleep') return 'Horas de sueño';
    return '';
  };

  const getGoalPlaceholder = () => {
    if (editingGoal === 'steps') return 'Ej: 8000';
    if (editingGoal === 'water') return 'Ej: 8';
    if (editingGoal === 'sleep') return 'Ej: 8';
    return '';
  };

  const getGoalHelper = () => {
    if (editingGoal === 'steps') return 'Rango: 1,000 - 30,000 pasos';
    if (editingGoal === 'water') return `Rango: 2 - 20 vasos (${cupSizeML}ml por vaso)`;
    if (editingGoal === 'sleep') return 'Rango: 4 - 12 horas';
    return '';
  };

  return (
    <View style={theme.layout.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={theme.text.h1}>👤 Perfil</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta de perfil */}
        <PanelCard gradient={['#1E3A8A', '#3B82F6', '#7C3AED']} gradientLocations={[0, 0.5, 1]}>
          <View style={styles.profileHeader}>
            <Text style={styles.avatar}>🦸</Text>
            <View style={styles.profileInfo}>
              <Text style={[theme.text.h2, styles.lightText]}>{userName || 'Héroe'}</Text>
              <Text style={[theme.text.body, styles.lightText]}>{levelTitle}</Text>
              <BadgeSticker
                label={`Nivel ${level}`}
                variant="primary"
                icon="⚡"
                style={styles.levelBadge}
              />
            </View>
          </View>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{xp}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{streakCount}</Text>
              <Text style={styles.statLabel}>Racha</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{level}</Text>
              <Text style={styles.statLabel}>Nivel</Text>
            </View>
          </View>
        </PanelCard>

        {/* Metas configuradas */}
        <PanelCard style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={theme.text.h3}>🎯 Metas Diarias</Text>
            <Text style={[theme.text.caption, theme.text.muted]}>
              Toca para ajustar tus objetivos
            </Text>
          </View>

          <View style={styles.goalsList}>
            <TouchableOpacity
              style={styles.goalItem}
              onPress={() => openEditModal('steps')}
              activeOpacity={0.7}
            >
              <View style={styles.goalItemContent}>
                <View style={styles.goalItemLeft}>
                  <Text style={styles.goalEmoji}>👟</Text>
                  <View>
                    <Text style={theme.text.body}>Pasos Diarios</Text>
                    <Text style={[theme.text.caption, theme.text.muted]}>
                      Meta de actividad física
                    </Text>
                  </View>
                </View>
                <View style={styles.goalValueContainer}>
                  <Text style={[theme.text.body, theme.text.bold]}>
                    {dailyGoalSteps.toLocaleString()}
                  </Text>
                  <Text style={styles.editIcon}>✏️</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.goalItem}
              onPress={() => openEditModal('water')}
              activeOpacity={0.7}
            >
              <View style={styles.goalItemContent}>
                <View style={styles.goalItemLeft}>
                  <Text style={styles.goalEmoji}>💧</Text>
                  <View>
                    <Text style={theme.text.body}>Agua Diaria</Text>
                    <Text style={[theme.text.caption, theme.text.muted]}>
                      {Math.ceil(dailyGoalML / cupSizeML)} vasos ({dailyGoalML}ml)
                    </Text>
                  </View>
                </View>
                <View style={styles.goalValueContainer}>
                  <Text style={[theme.text.body, theme.text.bold]}>
                    {Math.ceil(dailyGoalML / cupSizeML)} vasos
                  </Text>
                  <Text style={styles.editIcon}>✏️</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.goalItem}
              onPress={() => openEditModal('sleep')}
              activeOpacity={0.7}
            >
              <View style={styles.goalItemContent}>
                <View style={styles.goalItemLeft}>
                  <Text style={styles.goalEmoji}>😴</Text>
                  <View>
                    <Text style={theme.text.body}>Sueño Nocturno</Text>
                    <Text style={[theme.text.caption, theme.text.muted]}>Meta de descanso</Text>
                  </View>
                </View>
                <View style={styles.goalValueContainer}>
                  <Text style={[theme.text.body, theme.text.bold]}>
                    {Math.floor(targetSleepMinutes / 60)}h
                  </Text>
                  <Text style={styles.editIcon}>✏️</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </PanelCard>

        {/* Configuración */}
        <PanelCard style={styles.card}>
          <Text style={theme.text.h3}>⚙️ Configuración</Text>

          <View style={styles.settingsList}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => router.push('/profile/notifications')}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1 }}>
                <Text style={theme.text.body}>🔔 Configurar Notificaciones</Text>
                <Text style={theme.text.caption}>Personaliza tus recordatorios de salud</Text>
              </View>
              <Text style={styles.arrowIcon}>→</Text>
            </TouchableOpacity>

            <View style={styles.settingItem}>
              <View>
                <Text style={theme.text.body}>Notificaciones Generales</Text>
                <Text style={theme.text.caption}>Recibe recordatorios y alertas</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{
                  false: theme.colors.gray300,
                  true: '#06B6D4',
                }}
              />
            </View>

            <View style={styles.settingItem}>
              <View>
                <Text style={theme.text.body}>Recordatorios de agua</Text>
                <Text style={theme.text.caption}>Alertas para mantener hidratación</Text>
              </View>
              <Switch
                value={reminderEnabled}
                onValueChange={toggleReminder}
                trackColor={{
                  false: theme.colors.gray300,
                  true: '#06B6D4',
                }}
              />
            </View>

            <View style={styles.settingItem}>
              <View>
                <Text style={theme.text.body}>Sonido</Text>
                <Text style={theme.text.caption}>Efectos de sonido y música</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={toggleSound}
                trackColor={{
                  false: theme.colors.gray300,
                  true: '#06B6D4',
                }}
              />
            </View>
          </View>
        </PanelCard>

        {/* Sesión */}
        <PanelCard style={styles.card}>
          <Text style={theme.text.h3}>👤 Sesión</Text>

          <View style={styles.sessionInfo}>
            <View>
              <Text style={theme.text.body}>Usuario conectado</Text>
              <Text style={[theme.text.caption, theme.text.muted]}>
                {user?.display_name || user?.username || 'Héroe'}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>🚪 Cerrar Sesión</Text>
          </TouchableOpacity>
        </PanelCard>

        {/* Información */}
        <View style={styles.footer}>
          <Text style={[theme.text.caption, theme.text.center]}>Virtual Hero v1.0.0</Text>
          <Text style={[theme.text.caption, theme.text.center, theme.text.muted]}>
            ¡Sigue entrenando, héroe! 💪
          </Text>
        </View>
      </ScrollView>

      {/* Modal de edición de metas */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[theme.text.h2, styles.modalTitle]}>Editar Meta</Text>
            <Text style={[theme.text.body, styles.modalSubtitle]}>{getGoalLabel()}</Text>
            <Text style={[theme.text.caption, styles.modalHelper]}>{getGoalHelper()}</Text>

            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={getGoalPlaceholder()}
              keyboardType="numeric"
              placeholderTextColor={theme.colors.gray400}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setEditModalVisible(false);
                  setEditingGoal(null);
                  setEditValue('');
                }}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleSaveGoal}
              >
                <Text style={styles.modalButtonTextSave}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.md,
    paddingTop: 60,
    borderBottomWidth: theme.borderWidth.thick,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.paper,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl * 2,
  },
  card: {
    marginTop: theme.spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  avatar: {
    fontSize: 64,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  lightText: {
    color: theme.colors.paper,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: theme.spacing.xs,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: theme.spacing.md,
    borderTopWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    ...theme.typography.h2,
    color: theme.colors.paper,
    fontWeight: '800',
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.paper,
    opacity: 0.9,
  },
  sectionHeader: {
    gap: 4,
  },
  goalsList: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  goalItem: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.paperLight,
  },
  goalItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  goalEmoji: {
    fontSize: 28,
  },
  goalValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  editIcon: {
    fontSize: 16,
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  modalContent: {
    backgroundColor: theme.colors.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: 400,
    borderWidth: theme.borderWidth.thick,
    borderColor: theme.colors.border,
    ...theme.shadows.lg,
  },
  modalTitle: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.ink,
  },
  modalSubtitle: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.ink,
    opacity: 0.8,
  },
  modalHelper: {
    marginBottom: theme.spacing.md,
    color: theme.colors.gray400,
  },
  modalInput: {
    backgroundColor: theme.colors.paperLight,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 18,
    color: theme.colors.ink,
    marginBottom: theme.spacing.lg,
    fontFamily: 'System',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  modalButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    borderWidth: theme.borderWidth.thick,
  },
  modalButtonCancel: {
    backgroundColor: theme.colors.paperLight,
    borderColor: theme.colors.border,
  },
  modalButtonSave: {
    backgroundColor: '#06B6D4',
    borderColor: '#06B6D4',
  },
  modalButtonTextCancel: {
    ...theme.typography.body,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  modalButtonTextSave: {
    ...theme.typography.body,
    fontWeight: '700',
    color: theme.colors.paper,
  },
  settingsList: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  arrowIcon: {
    fontSize: 20,
    color: theme.colors.textSecondary,
  },
  footer: {
    marginTop: theme.spacing.xl,
    gap: theme.spacing.xs,
  },
  sessionInfo: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: theme.borderWidth.thick,
    borderColor: theme.colors.border,
    ...theme.shadows.md,
  },
  logoutButtonText: {
    ...theme.typography.body,
    fontWeight: '800',
    color: theme.colors.paper,
  },
});
