/**
 * SQLite Client - Manejo de base de datos local
 */

// TEMPORAL: Comentado hasta resolver problemas de módulos
// import * as SQLite from 'expo-sqlite';
type SQLiteDatabase = any;

const DB_NAME = 'virtual_giro.db';

let db: SQLiteDatabase | null = null;

/**
 * Inicializar base de datos
 */
export const initDatabase = async (): Promise<void> => {
  try {
    // TEMPORAL: Deshabilitado hasta resolver problemas de módulos
    console.warn('[DB] SQLite temporalmente deshabilitado');
    return;
    // db = await SQLite.openDatabaseAsync(DB_NAME);

    // Crear tablas
    await db.execAsync(`
      -- Tabla de logs diarios
      CREATE TABLE IF NOT EXISTS daily_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL UNIQUE,
        steps INTEGER DEFAULT 0,
        steps_goal_met INTEGER DEFAULT 0,
        water_ml INTEGER DEFAULT 0,
        water_goal_met INTEGER DEFAULT 0,
        cups_consumed INTEGER DEFAULT 0,
        sleep_minutes INTEGER DEFAULT 0,
        sleep_goal_met INTEGER DEFAULT 0,
        bed_time TEXT,
        wake_time TEXT,
        completed_exercises TEXT,
        exercises_count INTEGER DEFAULT 0,
        mission_completed INTEGER DEFAULT 0,
        mission_id TEXT,
        xp_earned INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON daily_logs(date DESC);

      -- Tabla de historial de XP
      CREATE TABLE IF NOT EXISTS xp_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        source TEXT NOT NULL,
        amount INTEGER NOT NULL,
        description TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_xp_history_date ON xp_history(date DESC);

      -- Tabla de ejercicios completados
      CREATE TABLE IF NOT EXISTS exercise_completions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exercise_id TEXT NOT NULL,
        date TEXT NOT NULL,
        duration_seconds INTEGER,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_exercise_completions_date ON exercise_completions(date DESC);
      CREATE INDEX IF NOT EXISTS idx_exercise_completions_exercise ON exercise_completions(exercise_id);

      -- Trigger para actualizar timestamp
      CREATE TRIGGER IF NOT EXISTS update_daily_logs_timestamp 
      AFTER UPDATE ON daily_logs
      FOR EACH ROW
      BEGIN
        UPDATE daily_logs SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
      END;
    `);

    console.log('[DB] Base de datos inicializada');
  } catch (error) {
    console.error('[DB] Error al inicializar:', error);
    throw error;
  }
};

/**
 * Obtener instancia de DB
 */
const getDB = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Base de datos no inicializada. Llama a initDatabase() primero.');
  }
  return db;
};

// ============================================
// DAILY LOGS
// ============================================

export interface DailyLog {
  id?: number;
  date: string;
  steps: number;
  steps_goal_met: boolean;
  water_ml: number;
  water_goal_met: boolean;
  cups_consumed: number;
  sleep_minutes: number;
  sleep_goal_met: boolean;
  bed_time?: string;
  wake_time?: string;
  completed_exercises: string[]; // Array de IDs
  exercises_count: number;
  mission_completed: boolean;
  mission_id?: string;
  xp_earned: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Obtener log de un día específico
 */
export const getLog = async (date: string): Promise<DailyLog | null> => {
  try {
    const database = getDB();
    const result = await database.getFirstAsync<any>('SELECT * FROM daily_logs WHERE date = ?', [
      date,
    ]);

    if (!result) {
      return null;
    }

    return {
      ...result,
      steps_goal_met: Boolean(result.steps_goal_met),
      water_goal_met: Boolean(result.water_goal_met),
      sleep_goal_met: Boolean(result.sleep_goal_met),
      mission_completed: Boolean(result.mission_completed),
      completed_exercises: result.completed_exercises ? JSON.parse(result.completed_exercises) : [],
    };
  } catch (error) {
    console.error('[DB] Error al obtener log:', error);
    return null;
  }
};

/**
 * Insertar o actualizar log diario
 */
export const upsertLog = async (log: Partial<DailyLog> & { date: string }): Promise<void> => {
  try {
    const database = getDB();
    const existing = await getLog(log.date);

    const exercisesJson = log.completed_exercises ? JSON.stringify(log.completed_exercises) : '[]';

    if (existing) {
      // Actualizar
      await database.runAsync(
        `UPDATE daily_logs SET
          steps = ?,
          steps_goal_met = ?,
          water_ml = ?,
          water_goal_met = ?,
          cups_consumed = ?,
          sleep_minutes = ?,
          sleep_goal_met = ?,
          bed_time = ?,
          wake_time = ?,
          completed_exercises = ?,
          exercises_count = ?,
          mission_completed = ?,
          mission_id = ?,
          xp_earned = ?
        WHERE date = ?`,
        [
          log.steps ?? existing.steps,
          (log.steps_goal_met ?? existing.steps_goal_met) ? 1 : 0,
          log.water_ml ?? existing.water_ml,
          (log.water_goal_met ?? existing.water_goal_met) ? 1 : 0,
          log.cups_consumed ?? existing.cups_consumed,
          log.sleep_minutes ?? existing.sleep_minutes,
          (log.sleep_goal_met ?? existing.sleep_goal_met) ? 1 : 0,
          log.bed_time ?? existing.bed_time,
          log.wake_time ?? existing.wake_time,
          exercisesJson,
          log.exercises_count ?? existing.exercises_count,
          (log.mission_completed ?? existing.mission_completed) ? 1 : 0,
          log.mission_id ?? existing.mission_id,
          log.xp_earned ?? existing.xp_earned,
          log.date,
        ]
      );
    } else {
      // Insertar
      await database.runAsync(
        `INSERT INTO daily_logs (
          date, steps, steps_goal_met, water_ml, water_goal_met,
          cups_consumed, sleep_minutes, sleep_goal_met, bed_time, wake_time,
          completed_exercises, exercises_count, mission_completed, mission_id, xp_earned
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          log.date,
          log.steps ?? 0,
          log.steps_goal_met ? 1 : 0,
          log.water_ml ?? 0,
          log.water_goal_met ? 1 : 0,
          log.cups_consumed ?? 0,
          log.sleep_minutes ?? 0,
          log.sleep_goal_met ? 1 : 0,
          log.bed_time,
          log.wake_time,
          exercisesJson,
          log.exercises_count ?? 0,
          log.mission_completed ? 1 : 0,
          log.mission_id,
          log.xp_earned ?? 0,
        ]
      );
    }

    console.log('[DB] Log guardado:', log.date);
  } catch (error) {
    console.error('[DB] Error al guardar log:', error);
    throw error;
  }
};

/**
 * Obtener logs de los últimos N días
 */
export const getRecentLogs = async (days: number = 7): Promise<DailyLog[]> => {
  try {
    const database = getDB();
    const results = await database.getAllAsync<any>(
      'SELECT * FROM daily_logs ORDER BY date DESC LIMIT ?',
      [days]
    );

    return results.map((r) => ({
      ...r,
      steps_goal_met: Boolean(r.steps_goal_met),
      water_goal_met: Boolean(r.water_goal_met),
      sleep_goal_met: Boolean(r.sleep_goal_met),
      mission_completed: Boolean(r.mission_completed),
      completed_exercises: r.completed_exercises ? JSON.parse(r.completed_exercises) : [],
    }));
  } catch (error) {
    console.error('[DB] Error al obtener logs recientes:', error);
    return [];
  }
};

// ============================================
// XP HISTORY
// ============================================

export interface XPHistoryEntry {
  id?: number;
  date: string;
  source: string;
  amount: number;
  description?: string;
  created_at?: string;
}

/**
 * Agregar entrada de XP al historial
 */
export const addXPHistory = async (
  entry: Omit<XPHistoryEntry, 'id' | 'created_at'>
): Promise<void> => {
  try {
    const database = getDB();
    await database.runAsync(
      'INSERT INTO xp_history (date, source, amount, description) VALUES (?, ?, ?, ?)',
      [entry.date, entry.source, entry.amount, entry.description || '']
    );
  } catch (error) {
    console.error('[DB] Error al agregar XP history:', error);
  }
};

/**
 * Obtener historial de XP
 */
export const getXPHistory = async (limit: number = 50): Promise<XPHistoryEntry[]> => {
  try {
    const database = getDB();
    const results = await database.getAllAsync<XPHistoryEntry>(
      'SELECT * FROM xp_history ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
    return results;
  } catch (error) {
    console.error('[DB] Error al obtener XP history:', error);
    return [];
  }
};

// ============================================
// EXERCISE COMPLETIONS
// ============================================

export interface ExerciseCompletion {
  id?: number;
  exercise_id: string;
  date: string;
  duration_seconds?: number;
  notes?: string;
  created_at?: string;
}

/**
 * Registrar completación de ejercicio
 */
export const logExerciseCompletion = async (
  completion: Omit<ExerciseCompletion, 'id' | 'created_at'>
): Promise<void> => {
  try {
    const database = getDB();
    await database.runAsync(
      'INSERT INTO exercise_completions (exercise_id, date, duration_seconds, notes) VALUES (?, ?, ?, ?)',
      [
        completion.exercise_id,
        completion.date,
        completion.duration_seconds || 0,
        completion.notes || '',
      ]
    );
  } catch (error) {
    console.error('[DB] Error al registrar ejercicio:', error);
  }
};

/**
 * Obtener completaciones de ejercicios
 */
export const getExerciseCompletions = async (
  exerciseId?: string,
  limit: number = 30
): Promise<ExerciseCompletion[]> => {
  try {
    const database = getDB();

    if (exerciseId) {
      const results = await database.getAllAsync<ExerciseCompletion>(
        'SELECT * FROM exercise_completions WHERE exercise_id = ? ORDER BY created_at DESC LIMIT ?',
        [exerciseId, limit]
      );
      return results;
    } else {
      const results = await database.getAllAsync<ExerciseCompletion>(
        'SELECT * FROM exercise_completions ORDER BY created_at DESC LIMIT ?',
        [limit]
      );
      return results;
    }
  } catch (error) {
    console.error('[DB] Error al obtener completaciones:', error);
    return [];
  }
};

/**
 * Limpiar datos antiguos (opcional, para mantenimiento)
 */
export const cleanOldData = async (daysToKeep: number = 90): Promise<void> => {
  try {
    const database = getDB();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    await database.runAsync('DELETE FROM daily_logs WHERE date < ?', [cutoffStr]);
    await database.runAsync('DELETE FROM xp_history WHERE date < ?', [cutoffStr]);
    await database.runAsync('DELETE FROM exercise_completions WHERE date < ?', [cutoffStr]);

    console.log('[DB] Datos antiguos limpiados');
  } catch (error) {
    console.error('[DB] Error al limpiar datos:', error);
  }
};
