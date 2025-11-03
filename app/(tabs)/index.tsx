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
        colors={['#1E3A8A', '#3B82F6', '#7C3AED']}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={[theme.text.h1, styles.headerText]}>{userName || '¡Hola, Héroe!'}</Text>
            <Text style={[theme.text.body, styles.headerSubtext]}>Nivel {level}</Text>
          </View>

          <BadgeSticker
            label={`Nv. ${level}`}
            variant="primary"
            icon="⚡"
            style={styles.levelBadge}
          />
        </View>

        {/* Indicador y barra de progreso de nivel */}
        <View style={styles.xpRow}>
          <Text style={styles.xpLabel}>
            {xp}/{xpForNextLevel} XP
          </Text>
        </View>
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
            <StepsGauge
              steps={todaySteps}
              goal={dailyGoalSteps}
              size={100}
              onSync={() => {
                // TODO: Implementar sincronización con Health/Google Fit
                console.log('Sincronizando pasos...');
              }}
            />
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
          activeOpacity={0.7}
        >
          <Text style={styles.missionTitle}>Iniciar Misión Diaria</Text>
          <Text style={styles.missionIcon}>→</Text>
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
    color: theme.colors.ink,
    marginTop: 4,
  },
  xpRow: {
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  xpLabel: {
    ...theme.typography.caption,
    color: theme.colors.ink,
    opacity: 0.9,
  },
  levelBadge: {
    backgroundColor: theme.colors.paperLight,
    borderColor: theme.colors.primary,
  },
  xpBar: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
    borderWidth: theme.borderWidth.thin,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  xpFill: {
    height: '100%',
    backgroundColor: theme.colors.cyan,
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
  missionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#06B6D4',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 14,
    shadowColor: '#06B6D4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  missionTitle: {
    ...theme.typography.h3,
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.3,
  },
  missionIcon: {
    fontSize: 22,
    color: '#0F172A',
    fontWeight: '700',
  },
});
