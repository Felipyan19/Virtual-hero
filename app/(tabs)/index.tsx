/**
 * Home Screen - Pantalla principal con progreso diario
 */

import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import theme from '@/theme/theme';
import { useAppStore } from '@/store/useAppStore';
import { useHydration } from '@/store/useHydration';
import { useSleep } from '@/store/useSleep';
import { useSteps } from '@/store/useSteps';
import { PanelCard } from '@/components/PanelCard';
import { StreakBillboard } from '@/components/StreakBillboard';
import { StepsGauge } from '@/components/StepsGauge';
import { WaterCounter } from '@/components/WaterCounter';
import { SleepEnergyBar } from '@/components/SleepEnergyBar';
import { BadgeSticker } from '@/components/BadgeSticker';
import { calculateXP, XPSource } from '@/lib/xp';

export default function HomeScreen() {
  const router = useRouter();

  // Stores
  const { xp, level, xpForNextLevel, streakCount, longestStreak, userName, addXP } = useAppStore();
  const {
    todayML,
    dailyGoalML,
    cupsConsumed,
    cupSizeML,
    addCup,
    updateDayIfNeeded: updateHydrationDay,
  } = useHydration();
  const {
    todayMinutes,
    targetSleepMinutes,
    todayBedTime,
    todayWakeTime,
    updateDayIfNeeded: updateSleepDay,
  } = useSleep();
  const { todaySteps, dailyGoalSteps, updateDayIfNeeded: updateStepsDay } = useSteps();

  useEffect(() => {
    // Actualizar días si es necesario
    updateHydrationDay();
    updateSleepDay();
    updateStepsDay();
  }, []);

  const handleAddCup = () => {
    addCup();
    // Sumar XP por vaso
    const xpAmount = calculateXP(XPSource.WATER_CUP);
    addXP(xpAmount, 'Hidratación');

    // Si alcanzó la meta, bonus adicional
    if (todayML + cupSizeML >= dailyGoalML && todayML < dailyGoalML) {
      const bonusXP = calculateXP(XPSource.WATER_GOAL);
      addXP(bonusXP, 'Meta de agua');
    }
  };

  const progressPercentage = (xp / xpForNextLevel) * 100;

  return (
    <View style={theme.layout.container}>
      {/* Header con gradiente */}
      <LinearGradient
        colors={theme.colors.gradientHero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={[theme.text.h1, styles.headerText]}>{userName || '¡Hola, Héroe!'}</Text>
            <Text style={[theme.text.body, styles.headerSubtext]}>
              Nivel {level} • {xp}/{xpForNextLevel} XP
            </Text>
          </View>

          <BadgeSticker
            label={`Nv. ${level}`}
            variant="primary"
            icon="⚡"
            style={styles.levelBadge}
          />
        </View>

        {/* Barra de progreso de nivel */}
        <View style={styles.xpBar}>
          <View style={[styles.xpFill, { width: `${progressPercentage}%` }]} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Racha */}
        <StreakBillboard streakCount={streakCount} longestStreak={longestStreak} />

        {/* Grid de metas */}
        <View style={styles.grid}>
          {/* Pasos */}
          <PanelCard style={styles.gridItem}>
            <StepsGauge steps={todaySteps} goal={dailyGoalSteps} size={100} />
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaText}>Sincronizar</Text>
            </TouchableOpacity>
          </PanelCard>

          {/* Hidratación */}
          <PanelCard style={styles.gridItem}>
            <WaterCounter
              currentML={todayML}
              goalML={dailyGoalML}
              cupsConsumed={cupsConsumed}
              cupSize={cupSizeML}
              onAddCup={handleAddCup}
            />
          </PanelCard>
        </View>

        {/* Sueño */}
        <PanelCard>
          <SleepEnergyBar
            sleepMinutes={todayMinutes}
            targetMinutes={targetSleepMinutes}
            bedTime={todayBedTime || undefined}
            wakeTime={todayWakeTime || undefined}
          />
        </PanelCard>

        {/* CTA Misión del día */}
        <TouchableOpacity
          style={styles.missionButton}
          onPress={() => router.push('/exercises')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FCD34D', '#F59E0B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.missionGradient}
          >
            <Text style={styles.missionIcon}>⚡</Text>
            <View>
              <Text style={styles.missionTitle}>START DAILY MISSION</Text>
              <Text style={styles.missionSubtitle}>Completa tu entrenamiento diario</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: theme.spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  headerText: {
    color: theme.colors.ink,
  },
  headerSubtext: {
    color: theme.colors.cyan,
    marginTop: 4,
  },
  levelBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderColor: theme.colors.primary,
  },
  xpBar: {
    height: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  grid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  gridItem: {
    flex: 1,
  },
  ctaButton: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.sm,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  ctaText: {
    ...theme.typography.caption,
    color: theme.colors.ink,
    fontWeight: '700',
  },
  missionButton: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: theme.borderWidth.medium,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  missionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  missionIcon: {
    fontSize: 48,
  },
  missionTitle: {
    ...theme.typography.h3,
    color: theme.colors.ink,
    fontWeight: '800',
  },
  missionSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.ink,
    opacity: 0.9,
  },
});
