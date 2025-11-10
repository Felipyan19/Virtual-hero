/**
 * TimerChip - Temporizador visual para ejercicios
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '@/theme/theme';

interface TimerChipProps {
  durationSeconds: number;
  isRunning: boolean;
  onComplete?: () => void;
  onFinish?: () => void;
}

export const TimerChip: React.FC<TimerChipProps> = ({
  durationSeconds,
  isRunning,
  onComplete,
  onFinish,
}) => {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [breakRemaining, setBreakRemaining] = useState(300); // 5 minutos = 300 segundos

  useEffect(() => {
    if (!isRunning) {
      setRemaining(durationSeconds);
      setIsPaused(false);
      setIsBreak(false);
      return;
    }

    // Si está en pausa, no hacer nada
    if (isPaused) {
      return;
    }

    const interval = setInterval(() => {
      if (isBreak) {
        // Modo descanso
        setBreakRemaining((prev) => {
          if (prev <= 1) {
            setIsBreak(false);
            setBreakRemaining(300);
            return 300;
          }
          return prev - 1;
        });
      } else {
        // Modo ejercicio normal
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            if (onComplete) {
              onComplete();
            }
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, durationSeconds, isPaused, isBreak]);

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleBreak = () => {
    setIsBreak(true);
    setBreakRemaining(300);
    setIsPaused(false);
  };

  const handleFinish = () => {
    if (onFinish) {
      onFinish();
    }
  };

  const displayTime = isBreak ? breakRemaining : remaining;
  const minutes = Math.floor(displayTime / 60);
  const seconds = displayTime % 60;
  const progress = isBreak
    ? ((300 - breakRemaining) / 300) * 100
    : ((durationSeconds - remaining) / durationSeconds) * 100;

  return (
    <View style={styles.container}>
      {/* Estado del temporizador */}
      {isBreak && (
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>☕ Descanso</Text>
        </View>
      )}
      {isPaused && !isBreak && (
        <View style={[styles.statusBadge, styles.pausedBadge]}>
          <Text style={styles.statusText}>⏸️ Pausado</Text>
        </View>
      )}

      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: `${progress}%` }, isBreak && styles.breakProgress]}
        />
      </View>

      <Text style={styles.time}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </Text>

      {/* Botones de control */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.pauseButton]}
          onPress={handlePauseResume}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonIcon}>{isPaused ? '▶️' : '⏸️'}</Text>
          <Text style={styles.buttonText}>{isPaused ? 'Reanudar' : 'Pausar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.breakButton]}
          onPress={handleBreak}
          activeOpacity={0.7}
          disabled={isBreak}
        >
          <Text style={styles.buttonIcon}>☕</Text>
          <Text style={styles.buttonText}>Descanso</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.finishButton]}
          onPress={handleFinish}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonIcon}>✓</Text>
          <Text style={styles.buttonText}>Finalizar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  statusBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.round,
    borderWidth: theme.borderWidth.medium,
    borderColor: theme.colors.border,
  },
  pausedBadge: {
    backgroundColor: '#F59E0B',
  },
  statusText: {
    ...theme.typography.caption,
    color: theme.colors.paper,
    fontWeight: '700',
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: theme.colors.gray200,
    borderRadius: theme.borderRadius.round,
    borderWidth: theme.borderWidth.medium,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  breakProgress: {
    backgroundColor: '#10B981',
  },
  time: {
    ...theme.typography.hero,
    color: theme.colors.ink,
  },
  controls: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    width: '100%',
    marginTop: theme.spacing.sm,
  },
  button: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.medium,
    borderColor: theme.colors.border,
    gap: 4,
  },
  pauseButton: {
    backgroundColor: '#F59E0B',
  },
  breakButton: {
    backgroundColor: '#10B981',
  },
  finishButton: {
    backgroundColor: '#EF4444',
  },
  buttonIcon: {
    fontSize: 20,
  },
  buttonText: {
    ...theme.typography.caption,
    color: theme.colors.paper,
    fontWeight: '700',
    fontSize: 11,
  },
});
