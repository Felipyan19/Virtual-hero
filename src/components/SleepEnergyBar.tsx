/**
 * SleepEnergyBar - Barra de energía basada en sueño
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '@/theme/theme';

interface SleepEnergyBarProps {
  sleepMinutes: number;
  targetMinutes: number;
  bedTime?: string;
  wakeTime?: string;
  onLogSleep?: (minutes: number, bedTime?: string, wakeTime?: string) => void;
}

export const SleepEnergyBar: React.FC<SleepEnergyBarProps> = ({
  sleepMinutes,
  targetMinutes,
  bedTime,
  wakeTime,
  onLogSleep,
}) => {
  const progress = Math.min((sleepMinutes / targetMinutes) * 100, 100);
  const hours = Math.floor(sleepMinutes / 60);
  const minutes = sleepMinutes % 60;
  const goalMet = sleepMinutes >= targetMinutes;

  const [modalVisible, setModalVisible] = useState(false);

  // Time pickers
  const [showBedTimePicker, setShowBedTimePicker] = useState(false);
  const [showWakeTimePicker, setShowWakeTimePicker] = useState(false);
  const [bedTimeDate, setBedTimeDate] = useState(new Date());
  const [wakeTimeDate, setWakeTimeDate] = useState(new Date());
  const [selectedBedTime, setSelectedBedTime] = useState<string | null>(null);
  const [selectedWakeTime, setSelectedWakeTime] = useState<string | null>(null);

  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const calculateSleepMinutes = (): number | null => {
    if (!selectedBedTime || !selectedWakeTime) return null;

    const [bedHour, bedMin] = selectedBedTime.split(':').map(Number);
    const [wakeHour, wakeMin] = selectedWakeTime.split(':').map(Number);

    let totalMinutes = wakeHour * 60 + wakeMin - (bedHour * 60 + bedMin);

    // Handle overnight sleep
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60;
    }

    return totalMinutes;
  };

  const handleBedTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowBedTimePicker(false);
    }

    if (selectedDate) {
      setBedTimeDate(selectedDate);
      setSelectedBedTime(formatTime(selectedDate));
    }
  };

  const handleWakeTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowWakeTimePicker(false);
    }

    if (selectedDate) {
      setWakeTimeDate(selectedDate);
      setSelectedWakeTime(formatTime(selectedDate));
    }
  };

  const handleLogSleep = () => {
    if (!selectedBedTime || !selectedWakeTime) {
      Alert.alert('Error', 'Debes seleccionar la hora de dormir y de despertar');
      return;
    }

    const totalMinutes = calculateSleepMinutes();

    if (totalMinutes === null || totalMinutes < 60 || totalMinutes > 24 * 60) {
      Alert.alert('Error', 'Las horas de sueño deben estar entre 1 y 24 horas');
      return;
    }

    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (onLogSleep) {
      onLogSleep(totalMinutes, selectedBedTime, selectedWakeTime);
    }

    Alert.alert('Éxito', `Registrado: ${hours}h ${mins}m de sueño`);
    setModalVisible(false);
    setSelectedBedTime(null);
    setSelectedWakeTime(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>SUEÑO</Text>
        <Text style={styles.icon}>😴</Text>
      </View>

      {/* Barra de energía con gradiente */}
      <View style={styles.barContainer}>
        <LinearGradient
          colors={goalMet ? ['#10B981', '#14B8A6'] : ['#6B7280', '#9CA3AF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.barFill, { width: `${progress}%` }]}
        />
      </View>

      <View style={styles.stats}>
        <View style={styles.timeContainer}>
          <Text style={[styles.time, goalMet && styles.timeSuccess]}>
            {hours}h {minutes}m
          </Text>
          <Text style={styles.target}>/ {Math.floor(targetMinutes / 60)}h Meta</Text>
        </View>

        {bedTime && wakeTime && (
          <Text style={styles.schedule}>
            {bedTime} - {wakeTime}
          </Text>
        )}

        {!bedTime && !wakeTime && sleepMinutes === 0 && (
          <Text style={styles.noData}>Sin registro hoy</Text>
        )}
      </View>

      {goalMet && <Text style={styles.successMessage}>¡Meta de sueño cumplida! 🌙</Text>}

      {/* Botón para registrar sueño */}
      <TouchableOpacity
        style={styles.logButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.logButtonText}>📝 Registrar Sueño</Text>
      </TouchableOpacity>

      {/* Modal para registrar sueño */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar Sueño 😴</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Hora de dormir *</Text>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => setShowBedTimePicker(true)}
              >
                <Text style={styles.timePickerText}>
                  {selectedBedTime || '🕐 Seleccionar hora'}
                </Text>
              </TouchableOpacity>
              {showBedTimePicker && (
                <DateTimePicker
                  value={bedTimeDate}
                  mode="time"
                  is24Hour={true}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleBedTimeChange}
                />
              )}
              {Platform.OS === 'ios' && showBedTimePicker && (
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => setShowBedTimePicker(false)}
                >
                  <Text style={styles.doneButtonText}>Listo</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Hora de despertar *</Text>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => setShowWakeTimePicker(true)}
              >
                <Text style={styles.timePickerText}>
                  {selectedWakeTime || '🌅 Seleccionar hora'}
                </Text>
              </TouchableOpacity>
              {showWakeTimePicker && (
                <DateTimePicker
                  value={wakeTimeDate}
                  mode="time"
                  is24Hour={true}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleWakeTimeChange}
                />
              )}
              {Platform.OS === 'ios' && showWakeTimePicker && (
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => setShowWakeTimePicker(false)}
                >
                  <Text style={styles.doneButtonText}>Listo</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Calculated Sleep Hours Display */}
            {selectedBedTime && selectedWakeTime && (
              <View style={styles.calculatedHoursContainer}>
                <Text style={styles.calculatedHoursLabel}>💡 Horas de sueño:</Text>
                <Text style={styles.calculatedHoursValue}>
                  {(() => {
                    const totalMinutes = calculateSleepMinutes();
                    if (totalMinutes === null) return '--';
                    const h = Math.floor(totalMinutes / 60);
                    const m = totalMinutes % 60;
                    return `${h}h ${m}m`;
                  })()}
                </Text>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleLogSleep}
              >
                <Text style={styles.modalButtonTextSave}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.gray600,
    fontWeight: '700',
    letterSpacing: 1,
  },
  icon: {
    fontSize: 24,
  },
  barContainer: {
    height: 12,
    backgroundColor: theme.colors.gray800,
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: theme.borderRadius.round,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: theme.spacing.xs,
  },
  time: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray600,
    fontWeight: '700',
  },
  timeSuccess: {
    color: theme.colors.success,
  },
  target: {
    ...theme.typography.caption,
    color: theme.colors.gray600,
    fontSize: 11,
  },
  schedule: {
    ...theme.typography.caption,
    color: theme.colors.gray600,
    fontSize: 10,
  },
  noData: {
    ...theme.typography.caption,
    color: theme.colors.gray400,
    fontSize: 10,
    fontStyle: 'italic',
  },
  successMessage: {
    ...theme.typography.caption,
    color: theme.colors.success,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.border,
  },
  logButtonText: {
    ...theme.typography.caption,
    color: theme.colors.ink,
    fontWeight: '700',
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
  },
  modalTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.lg,
    color: theme.colors.ink,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    ...theme.typography.body,
    color: theme.colors.ink,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  input: {
    backgroundColor: theme.colors.paperLight,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.ink,
  },
  inputHelper: {
    ...theme.typography.caption,
    color: theme.colors.gray400,
    marginTop: 4,
  },
  timePickerButton: {
    backgroundColor: theme.colors.paperLight,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  timePickerText: {
    fontSize: 16,
    color: theme.colors.ink,
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: '#10B981',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  doneButtonText: {
    ...theme.typography.body,
    color: theme.colors.paper,
    fontWeight: '700',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
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
    backgroundColor: '#10B981',
    borderColor: '#10B981',
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
  calculatedHoursContainer: {
    backgroundColor: theme.colors.paperLight,
    borderWidth: theme.borderWidth.thin,
    borderColor: '#10B981',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calculatedHoursLabel: {
    ...theme.typography.body,
    color: theme.colors.ink,
    fontWeight: '600',
  },
  calculatedHoursValue: {
    ...theme.typography.h3,
    color: '#10B981',
    fontWeight: '700',
  },
});
