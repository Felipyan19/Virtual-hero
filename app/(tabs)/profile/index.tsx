/**
 * Profile Screen - Pantalla de perfil y configuración
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
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

  const { dailyGoalSteps } = useSteps();
  const { dailyGoalML, reminderEnabled, toggleReminder } = useHydration();
  const { targetSleepMinutes } = useSleep();
  const { logout, user } = useAuth();

  const levelTitle = getLevelTitle(level);

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
        <PanelCard gradient={theme.colors.gradientHero}>
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
          <Text style={theme.text.h3}>🎯 Metas Diarias</Text>

          <View style={styles.goalsList}>
            <View style={styles.goalItem}>
              <Text style={theme.text.body}>👟 Pasos</Text>
              <Text style={[theme.text.body, theme.text.bold]}>
                {dailyGoalSteps.toLocaleString()}
              </Text>
            </View>

            <View style={styles.goalItem}>
              <Text style={theme.text.body}>💧 Agua</Text>
              <Text style={[theme.text.body, theme.text.bold]}>{dailyGoalML}ml</Text>
            </View>

            <View style={styles.goalItem}>
              <Text style={theme.text.body}>😴 Sueño</Text>
              <Text style={[theme.text.body, theme.text.bold]}>
                {Math.floor(targetSleepMinutes / 60)}h
              </Text>
            </View>
          </View>
        </PanelCard>

        {/* Configuración */}
        <PanelCard style={styles.card}>
          <Text style={theme.text.h3}>⚙️ Configuración</Text>

          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View>
                <Text style={theme.text.body}>Notificaciones</Text>
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
  goalsList: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
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
