-- Virtual Giro Database Schema
-- Registros diarios de actividad y progreso

-- Tabla de logs diarios
CREATE TABLE IF NOT EXISTS daily_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL UNIQUE, -- ISO date (YYYY-MM-DD)
  
  -- Pasos
  steps INTEGER DEFAULT 0,
  steps_goal_met INTEGER DEFAULT 0, -- Boolean (0/1)
  
  -- Hidratación
  water_ml INTEGER DEFAULT 0,
  water_goal_met INTEGER DEFAULT 0,
  cups_consumed INTEGER DEFAULT 0,
  
  -- Sueño
  sleep_minutes INTEGER DEFAULT 0,
  sleep_goal_met INTEGER DEFAULT 0,
  bed_time TEXT, -- HH:mm
  wake_time TEXT, -- HH:mm
  
  -- Ejercicios
  completed_exercises TEXT, -- JSON array de IDs
  exercises_count INTEGER DEFAULT 0,
  
  -- Misión del día
  mission_completed INTEGER DEFAULT 0,
  mission_id TEXT,
  
  -- XP ganado este día
  xp_earned INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Índice por fecha para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON daily_logs(date DESC);

-- Tabla de historial de XP
CREATE TABLE IF NOT EXISTS xp_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  source TEXT NOT NULL, -- 'steps_goal', 'water_cup', etc.
  amount INTEGER NOT NULL,
  description TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_xp_history_date ON xp_history(date DESC);

-- Tabla de ejercicios completados (detallado)
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

-- Trigger para actualizar updated_at
CREATE TRIGGER IF NOT EXISTS update_daily_logs_timestamp 
AFTER UPDATE ON daily_logs
FOR EACH ROW
BEGIN
  UPDATE daily_logs SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

