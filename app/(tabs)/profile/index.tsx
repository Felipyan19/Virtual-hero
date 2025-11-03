/**
 * Profile Screen - Pantalla de perfil y configuración
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import theme from '@/theme/theme';
import { useAppStore } from '@/store/useAppStore';
import { useSteps } from '@/store/useSteps';
import { useHydration } from '@/store/useHydration';
import { useSleep } from '@/store/useSleep';
import { PanelCard } from '@/components/PanelCard';
import { BadgeSticker } from '@/components/BadgeSticker';
import { getLevelTitle } from '@/lib/xp';

export default function ProfileScreen() {
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

  const levelTitle = getLevelTitle(level);

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
        <PanelCard>
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
        <PanelCard>
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
                  true: theme.colors.primary,
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
                  true: theme.colors.accent,
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
                  true: theme.colors.secondary,
                }}
              />
            </View>
          </View>
        </PanelCard>

        {/* Información */}
        <View style={styles.footer}>
          <Text style={[theme.text.caption, theme.text.center]}>Virtual Giro v1.0.0</Text>
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
    gap: theme.spacing.md,
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
});
