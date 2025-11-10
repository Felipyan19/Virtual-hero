/**
 * Exercise Images Mapping
 * Maps exercise IDs to their corresponding images
 */

import { ImageSourcePropType } from 'react-native';

// Mapeo de IDs de ejercicios a imágenes
export const exerciseImages: Record<string, ImageSourcePropType> = {
  // Pecho
  'flexiones-pecho': require('../../assets/exercise/flexiones-pecho.png'),
  'fondos-pecho': require('../../assets/exercise/fondos-pecho.png'),
  'press-banca-plano': require('../../assets/exercise/press-banca-plano.png'),
  'press-banca-inclinado': require('../../assets/exercise/press-banca-inclinado.png'),
  'aperturas-polea': require('../../assets/exercise/aperturas-polea.png'),
  'pec-deck-fly': require('../../assets/exercise/pec-deck-fly.png'),

  // Espalda
  dominadas: require('../../assets/exercise/dominadas.png'),
  'jalon-al-pecho': require('../../assets/exercise/jalon-al-pecho.png'),
  'remo-barra': require('../../assets/exercise/remo-barra.png'),
  'remo-maquina': require('../../assets/exercise/remo-maquina.png'),
  'remo-mancuerna': require('../../assets/exercise/remo-mancuerna.png'),
  'face-pulls': require('../../assets/exercise/face-pulls.png'),
  'pull-over-polea': require('../../assets/exercise/pull-over-polea.png'),
  'pull-over-mancuerna': require('../../assets/exercise/pull-over-mancuerna.png'),

  // Tríceps
  'triceps-overhead-db': require('../../assets/exercise/triceps-overhead-db.png'),
  'triceps-barra-z': require('../../assets/exercise/triceps-barra-z.png'),
  'press-frances': require('../../assets/exercise/press-frances.png'),
  'fondos-triceps': require('../../assets/exercise/fondos-triceps.png'),
  'extension-polea-alta': require('../../assets/exercise/extension-polea-alta.png'),
  'patada-triceps': require('../../assets/exercise/patada-triceps.png'),

  // Bíceps
  'curl-barra': require('../../assets/exercise/curl-barra.png'),
  'curl-martillo': require('../../assets/exercise/curl-martillo.png'),
  'curl-predicador': require('../../assets/exercise/curl-predicador.png'),
  'curl-banco-inclinado': require('../../assets/exercise/curl-banco-inclinado.png'),
  'curl-polea-baja': require('../../assets/exercise/curl-polea-baja.png'),

  // Core
  plancha: require('../../assets/exercise/plancha.png'),
  'press-pallof': require('../../assets/exercise/press-pallof.png'),
  'superman-core': require('../../assets/exercise/superman-core.png'),
  'abdominales-v': require('../../assets/exercise/abdominales-v.png'),
  'rueda-abdominal': require('../../assets/exercise/rueda-abdominal.png'),

  // Piernas
  sentadilla: require('../../assets/exercise/sentadilla.png'),
  'prensa-piernas': require('../../assets/exercise/prensa-piernas.png'),
  'zancadas-mancuerna': require('../../assets/exercise/zancadas-mancuerna.png'),
  'step-ups': require('../../assets/exercise/step-ups.png'),
  'sentadilla-bulgara': require('../../assets/exercise/sentadilla-bulgara.png'),
  'hack-squat': require('../../assets/exercise/hack-squat.png'),
  'extension-cuadriceps': require('../../assets/exercise/extension-cuadriceps.png'),
  'peso-muerto': require('../../assets/exercise/peso-muerto.png'),
  'curl-femoral-acostado': require('../../assets/exercise/curl-femoral-acostado.png'),
  'curl-femoral-sentado': require('../../assets/exercise/curl-femoral-sentado.png'),
  'curl-femoral-de-pie': require('../../assets/exercise/curl-femoral-de-pie.png'),
  'curl-nordico': require('../../assets/exercise/curl-nordico.png'),
  'elevacion-talones-pie': require('../../assets/exercise/elevacion-talones-pie.png'),
  'elevacion-talones-prensa': require('../../assets/exercise/elevacion-talones-prensa.png'),
  'elevacion-talones-sentado': require('../../assets/exercise/elevacion-talones-sentado.png'),
};

/**
 * Obtiene la imagen de un ejercicio por su ID
 * @param exerciseId - ID del ejercicio
 * @returns La imagen del ejercicio o undefined si no existe
 */
export const getExerciseImage = (exerciseId: string): ImageSourcePropType | undefined => {
  return exerciseImages[exerciseId];
};

/**
 * Verifica si existe una imagen para un ejercicio
 * @param exerciseId - ID del ejercicio
 * @returns true si existe la imagen, false si no
 */
export const hasExerciseImage = (exerciseId: string): boolean => {
  return exerciseId in exerciseImages;
};
