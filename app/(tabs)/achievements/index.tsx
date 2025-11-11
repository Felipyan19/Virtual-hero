/**
 * Achievements Screen - Galería de Héroes
 * Muestra todos los logros desbloqueados y por desbloquear
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

import { ACHIEVEMENTS, getAchievementsByCategory } from '@/data/achievements';
import { loadUserStats } from '@/services/achievementService';
import {
  getAchievementProgress,
  getAchievementStats,
  isAchievementUnlocked,
} from '@/services/achievementDetector';
import { UserStats, Achievement, AchievementCategory } from '@/types/achievements';
import theme from '@/theme/theme';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 2; // 2 columnas con padding

type FilterType = 'all' | 'unlocked' | AchievementCategory;

export default function AchievementsScreen() {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);

  // Recargar stats cada vez que la pantalla se enfoca
  useFocusEffect(
    React.useCallback(() => {
      loadStats();
    }, [])
  );

  const loadStats = async () => {
    const stats = await loadUserStats();
    setUserStats(stats);
    setLoading(false);
  };

  if (loading || !userStats) {
    return (
      <View style={theme.layout.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando héroes...</Text>
        </View>
      </View>
    );
  }

  const stats = getAchievementStats(userStats);
  const filteredAchievements =
    filter === 'all'
      ? ACHIEVEMENTS.filter((a) => !a.isHidden)
      : filter === 'unlocked'
        ? ACHIEVEMENTS.filter((a) => !a.isHidden && isAchievementUnlocked(a, userStats))
        : getAchievementsByCategory(filter).filter((a) => !a.isHidden);

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
        <Text style={styles.headerTitle}>🦸 Galería de Héroes</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.unlocked}</Text>
            <Text style={styles.statLabel}>Desbloqueados</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.percentage}%</Text>
            <Text style={styles.statLabel}>Completado</Text>
          </View>
        </View>

        {/* Barra de progreso */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${stats.percentage}%` }]} />
          </View>
        </View>
      </LinearGradient>

      {/* Grid de héroes */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Filtros */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          <FilterButton
            label="Todos"
            icon="⚡"
            isActive={filter === 'all'}
            onPress={() => setFilter('all')}
          />
          <FilterButton
            label="Desbloqueados"
            icon="🏆"
            isActive={filter === 'unlocked'}
            onPress={() => setFilter('unlocked')}
          />
          <FilterButton
            label="Horarios"
            icon="⏰"
            isActive={filter === 'time_based'}
            onPress={() => setFilter('time_based')}
          />
          <FilterButton
            label="XP"
            icon="💎"
            isActive={filter === 'xp_milestone'}
            onPress={() => setFilter('xp_milestone')}
          />
          <FilterButton
            label="Rachas"
            icon="🔥"
            isActive={filter === 'streak'}
            onPress={() => setFilter('streak')}
          />
          <FilterButton
            label="Tipos"
            icon="🎯"
            isActive={filter === 'exercise_type'}
            onPress={() => setFilter('exercise_type')}
          />
          <FilterButton
            label="Variedad"
            icon="🌈"
            isActive={filter === 'variety'}
            onPress={() => setFilter('variety')}
          />
          <FilterButton
            label="Sesiones"
            icon="📅"
            isActive={filter === 'sessions'}
            onPress={() => setFilter('sessions')}
          />
          <FilterButton
            label="Especiales"
            icon="⭐"
            isActive={filter === 'special'}
            onPress={() => setFilter('special')}
          />
          <FilterButton
            label="Mega"
            icon="👑"
            isActive={filter === 'mega'}
            onPress={() => setFilter('mega')}
          />
        </ScrollView>

        <View style={styles.gridContainer}>
          {filteredAchievements.map((achievement) => (
            <HeroCard key={achievement.id} achievement={achievement} userStats={userStats} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// Componente de tarjeta de héroe
function HeroCard({ achievement, userStats }: { achievement: Achievement; userStats: UserStats }) {
  const unlocked = isAchievementUnlocked(achievement, userStats);
  const progress = getAchievementProgress(achievement, userStats);

  // Obtener la fecha de desbloqueo si existe
  const unlockedData = userStats.unlockedAchievements.find(
    (a) => a.achievementId === achievement.id
  );
  const unlockedDate = unlockedData
    ? new Date(unlockedData.unlockedAt).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
      })
    : null;

  const rarityColors = {
    common: ['#6c757d', '#495057'] as const,
    rare: ['#20c997', '#17a2b8'] as const,
    epic: ['#9b59b6', '#8e44ad'] as const,
    legendary: ['#f39c12', '#e67e22'] as const,
    mythic: ['#e74c3c', '#c0392b'] as const,
  };

  // Colores especiales para cards desbloqueadas (efecto dorado/brillante)
  const unlockedGradient = {
    common: ['#FFD700', '#FFA500'] as const, // Dorado
    rare: ['#00CED1', '#1E90FF'] as const, // Azul brillante
    epic: ['#9370DB', '#FF1493'] as const, // Púrpura brillante
    legendary: ['#FF8C00', '#FF4500'] as const, // Naranja fuego
    mythic: ['#FF1493', '#8B008B'] as const, // Rosa/Púrpura místico
  };

  const colors = unlocked ? unlockedGradient[achievement.rarity] : rarityColors[achievement.rarity];

  return (
    <TouchableOpacity style={styles.heroCard} activeOpacity={0.8}>
      {/* Card desbloqueada con gradiente especial */}
      {unlocked ? (
        <LinearGradient
          colors={[colors[0], colors[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroCardContainer, styles.heroCardUnlocked]}
        >
          {/* Efecto de brillo en la esquina */}
          <View style={styles.glowEffect} />

          {/* Icono del héroe */}
          <View style={[styles.heroIcon, styles.heroIconUnlocked]}>
            <Text style={styles.heroIconText}>🦸</Text>
          </View>

          {/* Nombre del héroe */}
          <Text style={[styles.heroName, styles.heroNameUnlocked]} numberOfLines={2}>
            {achievement.heroName}
          </Text>

          {/* Fecha de desbloqueo */}
          {unlockedDate && (
            <View style={styles.unlockedDateContainer}>
              <Text style={styles.unlockedDateIcon}>🎉</Text>
              <Text style={styles.unlockedDateText}>{unlockedDate}</Text>
            </View>
          )}

          {/* Badge de rareza */}
          <View style={[styles.rarityBadge, styles.rarityBadgeUnlocked]}>
            <Text style={styles.rarityText}>{achievement.rarity.toUpperCase()}</Text>
          </View>

          {/* Tier */}
          <View style={[styles.tierBadge, styles.tierBadgeUnlocked]}>
            <Text style={styles.tierTextUnlocked}>★{achievement.tier}</Text>
          </View>

          {/* Recompensa de XP */}
          <View style={styles.xpBadge}>
            <Text style={styles.xpBadgeText}>+{achievement.xpReward} XP</Text>
          </View>
        </LinearGradient>
      ) : (
        /* Card bloqueada (diseño original) */
        <View style={styles.heroCardContainer}>
          {/* Icono/Silueta del héroe */}
          <View style={[styles.heroIcon, styles.heroIconLocked]}>
            <Text style={styles.heroIconText}>🔒</Text>
          </View>

          {/* Nombre del héroe */}
          <Text style={[styles.heroName, styles.heroNameLocked]} numberOfLines={2}>
            ???
          </Text>

          {/* Progreso */}
          {progress.percentage > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBarSmall}>
                <View style={[styles.progressBarSmallFill, { width: `${progress.percentage}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {progress.current}/{progress.target}
              </Text>
            </View>
          )}

          {/* Badge de rareza */}
          <View style={[styles.rarityBadge, { backgroundColor: colors[0] }]}>
            <Text style={styles.rarityText}>{achievement.rarity.toUpperCase()}</Text>
          </View>

          {/* Tier */}
          <View style={styles.tierBadge}>
            <Text style={styles.tierText}>★{achievement.tier}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

// Componente de botón de filtro
function FilterButton({
  label,
  icon,
  isActive,
  onPress,
}: {
  label: string;
  icon: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.filterChip,
        isActive && { backgroundColor: '#06B6D4', borderColor: '#06B6D4' },
      ]}
      activeOpacity={0.7}
    >
      <Text style={styles.chipIcon}>{icon}</Text>
      <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: theme.spacing.md,
  },
  headerTitle: {
    ...theme.typography.h1,
    color: theme.colors.ink,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...theme.typography.h2,
    color: theme.colors.ink,
    fontWeight: 'bold',
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.ink,
    marginTop: 2,
    opacity: 0.9,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  progressBarContainer: {
    marginTop: theme.spacing.sm,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
    borderWidth: theme.borderWidth.thin,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.cyan,
  },
  filtersContainer: {
    flexGrow: 0,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  filtersContent: {
    gap: 8,
    paddingHorizontal: theme.spacing.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: theme.borderRadius.round,
    borderWidth: theme.borderWidth.medium,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.paper,
    gap: 6,
  },
  chipIcon: {
    fontSize: 16,
  },
  chipLabel: {
    ...theme.typography.caption,
    color: theme.colors.ink,
    fontWeight: '700',
  },
  chipLabelActive: {
    color: theme.colors.paper,
  },
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.paper,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    justifyContent: 'space-between',
  },
  heroCard: {
    width: CARD_SIZE,
    height: CARD_SIZE * 1.4,
    marginBottom: theme.spacing.md,
  },
  heroCardContainer: {
    ...theme.comicPanel.base,
    flex: 1,
    padding: theme.spacing.sm,
    justifyContent: 'space-between',
    position: 'relative',
  },
  heroCardUnlocked: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 15,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  glowEffect: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    opacity: 0.6,
  },
  heroIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.paper,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 5,
    borderWidth: theme.borderWidth.medium,
    borderColor: theme.colors.cyan,
  },
  heroIconUnlocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 3,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  heroIconLocked: {
    backgroundColor: theme.colors.paperDark,
    borderColor: theme.colors.gray600,
  },
  heroIconText: {
    fontSize: 30,
  },
  heroName: {
    ...theme.typography.bodySmall,
    fontWeight: 'bold',
    color: theme.colors.ink,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    minHeight: 36,
  },
  heroNameUnlocked: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  heroNameLocked: {
    color: theme.colors.gray600,
  },
  unlockedDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  unlockedDateIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  unlockedDateText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.3,
  },
  progressContainer: {
    marginTop: 5,
  },
  progressBarSmall: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: 3,
  },
  progressBarSmallFill: {
    height: '100%',
    backgroundColor: theme.colors.cyan,
  },
  progressText: {
    ...theme.typography.caption,
    color: theme.colors.gray600,
    textAlign: 'center',
    fontSize: 10,
  },
  rarityBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  rarityBadgeUnlocked: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  rarityText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tierBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: theme.colors.paper,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.cyan,
  },
  tierBadgeUnlocked: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.8)',
  },
  tierText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.colors.cyan,
  },
  tierTextUnlocked: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFD700',
    textShadowColor: 'rgba(255, 140, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  xpBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 215, 0, 0.8)',
  },
  xpBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFD700',
    textShadowColor: 'rgba(255, 140, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...theme.typography.h3,
    color: theme.colors.ink,
  },
});
