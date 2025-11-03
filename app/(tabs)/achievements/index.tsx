/**
 * Achievements Screen - Pantalla de logros
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import theme from '@/theme/theme';
import { useAppStore } from '@/store/useAppStore';
import { PanelCard } from '@/components/PanelCard';
import { BadgeSticker } from '@/components/BadgeSticker';

export default function AchievementsScreen() {
  const { achievements } = useAppStore();

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const totalCount = achievements.length;
  const progress = (unlockedCount / totalCount) * 100;

  return (
    <View style={theme.layout.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={theme.text.h1}>🏆 Logros</Text>
        <Text style={theme.text.body}>
          {unlockedCount} / {totalCount} desbloqueados
        </Text>
      </View>

      {/* Barra de progreso */}
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={theme.text.caption}>{Math.round(progress)}% completado</Text>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {achievements.map((achievement) => (
          <PanelCard
            key={achievement.id}
            style={[styles.achievementCard, !achievement.isUnlocked && styles.achievementLocked]}
          >
            <View style={styles.achievementHeader}>
              <Text style={styles.achievementIcon}>
                {achievement.isUnlocked ? achievement.icon : '🔒'}
              </Text>

              {achievement.isUnlocked && (
                <BadgeSticker label={`+${achievement.xpReward} XP`} variant="success" icon="⚡" />
              )}
            </View>

            <Text style={[theme.text.h4, !achievement.isUnlocked && styles.lockedText]}>
              {achievement.title}
            </Text>

            <Text
              style={[
                theme.text.bodySmall,
                styles.description,
                !achievement.isUnlocked && styles.lockedText,
              ]}
            >
              {achievement.description}
            </Text>

            {achievement.isUnlocked && achievement.unlockedAt && (
              <Text style={[theme.text.caption, styles.unlockedDate]}>
                Desbloqueado: {new Date(achievement.unlockedAt).toLocaleDateString()}
              </Text>
            )}
          </PanelCard>
        ))}
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
  progressSection: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderBottomWidth: theme.borderWidth.medium,
    borderBottomColor: theme.colors.gray200,
  },
  progressBar: {
    height: 16,
    backgroundColor: theme.colors.gray200,
    borderRadius: theme.borderRadius.sm,
    borderWidth: theme.borderWidth.medium,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  achievementCard: {
    gap: theme.spacing.sm,
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 48,
  },
  description: {
    color: theme.colors.gray600,
  },
  lockedText: {
    color: theme.colors.gray500,
  },
  unlockedDate: {
    color: theme.colors.success,
    marginTop: theme.spacing.xs,
  },
});
