/**
 * Virtual Hero - Achievement Database
 * Todos los logros y héroes del juego
 */

import { Achievement } from '@/types/achievements';

export const ACHIEVEMENTS: Achievement[] = [
  // ============================================
  // 1️⃣ LOGROS POR HORARIOS - MADRUGADA (12am-6am)
  // ============================================
  {
    id: 'dawn_vigilante',
    heroName: 'Vigilante Nocturno',
    category: 'time_based',
    tier: 1,
    title: 'Vigilante Nocturno',
    description: 'Completa tu primer entrenamiento de madrugada (12am-6am)',
    requirement: {
      type: 'workouts_in_timeframe',
      value: 1,
      timeFrame: 'dawn',
    },
    xpReward: 50,
    rarity: 'common',
  },
  {
    id: 'dawn_owl',
    heroName: 'Búho Supremo',
    category: 'time_based',
    tier: 2,
    title: 'Búho Supremo',
    description: 'Completa 10 entrenamientos de madrugada',
    requirement: {
      type: 'workouts_in_timeframe',
      value: 10,
      timeFrame: 'dawn',
    },
    xpReward: 150,
    rarity: 'rare',
  },
  {
    id: 'dawn_sentinel',
    heroName: 'Centinela de la Oscuridad',
    category: 'time_based',
    tier: 3,
    title: 'Centinela de la Oscuridad',
    description: 'Completa 25 entrenamientos de madrugada',
    requirement: {
      type: 'workouts_in_timeframe',
      value: 25,
      timeFrame: 'dawn',
    },
    xpReward: 300,
    rarity: 'epic',
  },
  {
    id: 'dawn_guardian',
    heroName: 'Guardián de las Sombras',
    category: 'time_based',
    tier: 4,
    title: 'Guardián de las Sombras',
    description: 'Completa 50 entrenamientos de madrugada',
    requirement: {
      type: 'workouts_in_timeframe',
      value: 50,
      timeFrame: 'dawn',
    },
    xpReward: 500,
    rarity: 'legendary',
  },
  {
    id: 'dawn_master',
    heroName: 'Amo de la Noche',
    category: 'time_based',
    tier: 5,
    title: 'Amo de la Noche',
    description: 'Completa 100 entrenamientos de madrugada',
    requirement: {
      type: 'workouts_in_timeframe',
      value: 100,
      timeFrame: 'dawn',
    },
    xpReward: 1000,
    rarity: 'mythic',
  },

  // ============================================
  // 1️⃣ LOGROS POR HORARIOS - MAÑANA (6am-12pm)
  // ============================================
  {
    id: 'morning_dawn',
    heroName: 'Amanecer Heroico',
    category: 'time_based',
    tier: 1,
    title: 'Amanecer Heroico',
    description: 'Completa tu primer entrenamiento matutino (6am-12pm)',
    requirement: {
      type: 'workouts_in_timeframe',
      value: 1,
      timeFrame: 'morning',
    },
    xpReward: 50,
    rarity: 'common',
  },
  {
    id: 'morning_warrior',
    heroName: 'Guerrero del Alba',
    category: 'time_based',
    tier: 2,
    title: 'Guerrero del Alba',
    description: 'Completa 10 entrenamientos matutinos',
    requirement: {
      type: 'workouts_in_timeframe',
      value: 10,
      timeFrame: 'morning',
    },
    xpReward: 150,
    rarity: 'rare',
  },
  {
    id: 'morning_hero',
    heroName: 'Héroe Madrugador',
    category: 'time_based',
    tier: 3,
    title: 'Héroe Madrugador',
    description: 'Completa 25 entrenamientos matutinos',
    requirement: {
      type: 'workouts_in_timeframe',
      value: 25,
      timeFrame: 'morning',
    },
    xpReward: 300,
    rarity: 'epic',
  },
  {
    id: 'morning_titan',
    heroName: 'Titán Solar',
    category: 'time_based',
    tier: 4,
    title: 'Titán Solar',
    description: 'Completa 50 entrenamientos matutinos',
    requirement: {
      type: 'workouts_in_timeframe',
      value: 50,
      timeFrame: 'morning',
    },
    xpReward: 500,
    rarity: 'legendary',
  },
  {
    id: 'morning_emperor',
    heroName: 'Emperador del Amanecer',
    category: 'time_based',
    tier: 5,
    title: 'Emperador del Amanecer',
    description: 'Completa 100 entrenamientos matutinos',
    requirement: {
      type: 'workouts_in_timeframe',
      value: 100,
      timeFrame: 'morning',
    },
    xpReward: 1000,
    rarity: 'mythic',
  },

  // ============================================
  // 1️⃣ LOGROS POR HORARIOS - TARDE (12pm-6pm)
  // ============================================
  {
    id: 'afternoon_defender',
    heroName: 'Defensor Diurno',
    category: 'time_based',
    tier: 1,
    title: 'Defensor Diurno',
    description: 'Completa tu primer entrenamiento vespertino (12pm-6pm)',
    requirement: {
      type: 'workouts_in_timeframe',
      value: 1,
      timeFrame: 'afternoon',
    },
    xpReward: 50,
    rarity: 'common',
  },
  {
    id: 'afternoon_paladin',
    heroName: 'Paladín de Mediodía',
    category: 'time_based',
    tier: 2,
    title: 'Paladín de Mediodía',
    description: 'Completa 10 entrenamientos vespertinos',
    requirement: {
      type: 'workouts_in_timeframe',
      value: 10,
      timeFrame: 'afternoon',
    },
    xpReward: 150,
    rarity: 'rare',
  },
  {
    id: 'afternoon_champion',
    heroName: 'Campeón del Día',
    category: 'time_based',
    tier: 3,
    title: 'Campeón del Día',
    description: 'Completa 25 entrenamientos vespertinos',
    requirement: {
      type: 'workouts_in_timeframe',
      value: 25,
      timeFrame: 'afternoon',
    },
    xpReward: 300,
    rarity: 'epic',
  },
  {
    id: 'afternoon_colossus',
    heroName: 'Coloso del Sol',
    category: 'time_based',
    tier: 4,
    title: 'Coloso del Sol',
    description: 'Completa 50 entrenamientos vespertinos',
    requirement: {
      type: 'workouts_in_timeframe',
      value: 50,
      timeFrame: 'afternoon',
    },
    xpReward: 500,
    rarity: 'legendary',
  },
  {
    id: 'afternoon_lord',
    heroName: 'Señor del Cenit',
    category: 'time_based',
    tier: 5,
    title: 'Señor del Cenit',
    description: 'Completa 100 entrenamientos vespertinos',
    requirement: {
      type: 'workouts_in_timeframe',
      value: 100,
      timeFrame: 'afternoon',
    },
    xpReward: 1000,
    rarity: 'mythic',
  },

  // ============================================
  // 1️⃣ LOGROS POR HORARIOS - NOCHE (6pm-12am)
  // ============================================
  {
    id: 'evening_protector',
    heroName: 'Protector Nocturno',
    category: 'time_based',
    tier: 1,
    title: 'Protector Nocturno',
    description: 'Completa tu primer entrenamiento nocturno (6pm-12am)',
    requirement: {
      type: 'workouts_in_timeframe',
      value: 1,
      timeFrame: 'evening',
    },
    xpReward: 50,
    rarity: 'common',
  },
  {
    id: 'evening_legend',
    heroName: 'Leyenda del Crepúsculo',
    category: 'time_based',
    tier: 2,
    title: 'Leyenda del Crepúsculo',
    description: 'Completa 10 entrenamientos nocturnos',
    requirement: {
      type: 'workouts_in_timeframe',
      value: 10,
      timeFrame: 'evening',
    },
    xpReward: 150,
    rarity: 'rare',
  },
  {
    id: 'evening_avenger',
    heroName: 'Vengador de la Noche',
    category: 'time_based',
    tier: 3,
    title: 'Vengador de la Noche',
    description: 'Completa 25 entrenamientos nocturnos',
    requirement: {
      type: 'workouts_in_timeframe',
      value: 25,
      timeFrame: 'evening',
    },
    xpReward: 300,
    rarity: 'epic',
  },
  {
    id: 'evening_sovereign',
    heroName: 'Soberano Lunar',
    category: 'time_based',
    tier: 4,
    title: 'Soberano Lunar',
    description: 'Completa 50 entrenamientos nocturnos',
    requirement: {
      type: 'workouts_in_timeframe',
      value: 50,
      timeFrame: 'evening',
    },
    xpReward: 500,
    rarity: 'legendary',
  },
  {
    id: 'evening_emperor',
    heroName: 'Emperador de la Medianoche',
    category: 'time_based',
    tier: 5,
    title: 'Emperador de la Medianoche',
    description: 'Completa 100 entrenamientos nocturnos',
    requirement: {
      type: 'workouts_in_timeframe',
      value: 100,
      timeFrame: 'evening',
    },
    xpReward: 1000,
    rarity: 'mythic',
  },

  // ============================================
  // 2️⃣ LOGROS POR XP
  // ============================================
  {
    id: 'xp_100',
    heroName: 'Novato Prometedor',
    category: 'xp_milestone',
    tier: 1,
    title: 'Novato Prometedor',
    description: 'Alcanza 100 XP total',
    requirement: {
      type: 'total_xp',
      value: 100,
    },
    xpReward: 25,
    rarity: 'common',
  },
  {
    id: 'xp_500',
    heroName: 'Aprendiz Valiente',
    category: 'xp_milestone',
    tier: 2,
    title: 'Aprendiz Valiente',
    description: 'Alcanza 500 XP total',
    requirement: {
      type: 'total_xp',
      value: 500,
    },
    xpReward: 50,
    rarity: 'common',
  },
  {
    id: 'level_5',
    heroName: 'Superhéroe en Entrenamiento',
    category: 'xp_milestone',
    tier: 3,
    title: 'Superhéroe en Entrenamiento',
    description: 'Alcanza el nivel 5 (800 XP total)',
    requirement: {
      type: 'total_xp',
      value: 812,
    },
    xpReward: 200,
    rarity: 'rare',
  },
  {
    id: 'xp_1000',
    heroName: 'Guerrero Ascendente',
    category: 'xp_milestone',
    tier: 3,
    title: 'Guerrero Ascendente',
    description: 'Alcanza 1,000 XP total',
    requirement: {
      type: 'total_xp',
      value: 1000,
    },
    xpReward: 100,
    rarity: 'rare',
  },
  {
    id: 'xp_2500',
    heroName: 'Héroe Veterano',
    category: 'xp_milestone',
    tier: 4,
    title: 'Héroe Veterano',
    description: 'Alcanza 2,500 XP total',
    requirement: {
      type: 'total_xp',
      value: 2500,
    },
    xpReward: 200,
    rarity: 'rare',
  },
  {
    id: 'level_10',
    heroName: 'Superhéroe Legendario',
    category: 'xp_milestone',
    tier: 5,
    title: 'Superhéroe Legendario',
    description: 'Alcanza el nivel 10 (3000 XP total)',
    requirement: {
      type: 'total_xp',
      value: 2998,
    },
    xpReward: 500,
    rarity: 'epic',
  },
  {
    id: 'xp_5000',
    heroName: 'Campeón Elite',
    category: 'xp_milestone',
    tier: 5,
    title: 'Campeón Elite',
    description: 'Alcanza 5,000 XP total',
    requirement: {
      type: 'total_xp',
      value: 5000,
    },
    xpReward: 300,
    rarity: 'epic',
  },
  {
    id: 'xp_10000',
    heroName: 'Maestro Legendario',
    category: 'xp_milestone',
    tier: 6,
    title: 'Maestro Legendario',
    description: 'Alcanza 10,000 XP total',
    requirement: {
      type: 'total_xp',
      value: 10000,
    },
    xpReward: 500,
    rarity: 'epic',
  },
  {
    id: 'xp_25000',
    heroName: 'Titán Imparable',
    category: 'xp_milestone',
    tier: 7,
    title: 'Titán Imparable',
    description: 'Alcanza 25,000 XP total',
    requirement: {
      type: 'total_xp',
      value: 25000,
    },
    xpReward: 750,
    rarity: 'legendary',
  },
  {
    id: 'xp_50000',
    heroName: 'Dios del Olimpo',
    category: 'xp_milestone',
    tier: 8,
    title: 'Dios del Olimpo',
    description: 'Alcanza 50,000 XP total',
    requirement: {
      type: 'total_xp',
      value: 50000,
    },
    xpReward: 1000,
    rarity: 'legendary',
  },
  {
    id: 'xp_100000',
    heroName: 'Ser Cósmico',
    category: 'xp_milestone',
    tier: 9,
    title: 'Ser Cósmico',
    description: 'Alcanza 100,000 XP total',
    requirement: {
      type: 'total_xp',
      value: 100000,
    },
    xpReward: 2000,
    rarity: 'mythic',
  },
  {
    id: 'xp_250000',
    heroName: 'Entidad Infinita',
    category: 'xp_milestone',
    tier: 10,
    title: 'Entidad Infinita',
    description: 'Alcanza 250,000 XP total',
    requirement: {
      type: 'total_xp',
      value: 250000,
    },
    xpReward: 5000,
    rarity: 'mythic',
  },

  // ============================================
  // 3️⃣ LOGROS POR RACHAS
  // ============================================
  {
    id: 'streak_3',
    heroName: 'Primer Paso',
    category: 'streak',
    tier: 1,
    title: 'Primer Paso',
    description: 'Entrena 3 días consecutivos',
    requirement: {
      type: 'consecutive_days',
      value: 3,
    },
    xpReward: 50,
    rarity: 'common',
  },
  {
    id: 'streak_7',
    heroName: 'Determinación Férrea',
    category: 'streak',
    tier: 2,
    title: 'Determinación Férrea',
    description: 'Entrena 7 días consecutivos',
    requirement: {
      type: 'consecutive_days',
      value: 7,
    },
    xpReward: 150,
    rarity: 'rare',
  },
  {
    id: 'streak_14',
    heroName: 'Espíritu Inquebrantable',
    category: 'streak',
    tier: 3,
    title: 'Espíritu Inquebrantable',
    description: 'Entrena 14 días consecutivos',
    requirement: {
      type: 'consecutive_days',
      value: 14,
    },
    xpReward: 300,
    rarity: 'epic',
  },
  {
    id: 'streak_30',
    heroName: 'Guardián Persistente',
    category: 'streak',
    tier: 4,
    title: 'Guardián Persistente',
    description: 'Entrena 30 días consecutivos',
    requirement: {
      type: 'consecutive_days',
      value: 30,
    },
    xpReward: 500,
    rarity: 'epic',
  },
  {
    id: 'streak_60',
    heroName: 'Titán de Acero',
    category: 'streak',
    tier: 5,
    title: 'Titán de Acero',
    description: 'Entrena 60 días consecutivos',
    requirement: {
      type: 'consecutive_days',
      value: 60,
    },
    xpReward: 1000,
    rarity: 'legendary',
  },
  {
    id: 'streak_90',
    heroName: 'Leyenda Eterna',
    category: 'streak',
    tier: 6,
    title: 'Leyenda Eterna',
    description: 'Entrena 90 días consecutivos',
    requirement: {
      type: 'consecutive_days',
      value: 90,
    },
    xpReward: 1500,
    rarity: 'legendary',
  },
  {
    id: 'streak_180',
    heroName: 'Inmortal',
    category: 'streak',
    tier: 7,
    title: 'Inmortal',
    description: 'Entrena 180 días consecutivos',
    requirement: {
      type: 'consecutive_days',
      value: 180,
    },
    xpReward: 3000,
    rarity: 'mythic',
  },
  {
    id: 'streak_phoenix',
    heroName: 'Fénix Renacido',
    category: 'streak',
    tier: 8,
    title: 'Fénix Renacido',
    description: 'Recupera una racha perdida de 30+ días',
    requirement: {
      type: 'comeback',
      value: 30,
    },
    xpReward: 750,
    rarity: 'legendary',
    isSecret: true,
  },

  // ============================================
  // 4️⃣ LOGROS POR TIPO DE EJERCICIO - FUERZA
  // ============================================
  {
    id: 'strength_10',
    heroName: 'Musculoso',
    category: 'exercise_type',
    tier: 1,
    title: 'Musculoso',
    description: 'Completa 10 ejercicios de fuerza',
    requirement: {
      type: 'exercise_category_count',
      value: 10,
      exerciseCategory: 'strength',
    },
    xpReward: 100,
    rarity: 'common',
  },
  {
    id: 'strength_50',
    heroName: 'Hércules',
    category: 'exercise_type',
    tier: 2,
    title: 'Hércules',
    description: 'Completa 50 ejercicios de fuerza',
    requirement: {
      type: 'exercise_category_count',
      value: 50,
      exerciseCategory: 'strength',
    },
    xpReward: 300,
    rarity: 'rare',
  },
  {
    id: 'strength_100',
    heroName: 'Coloso',
    category: 'exercise_type',
    tier: 3,
    title: 'Coloso',
    description: 'Completa 100 ejercicios de fuerza',
    requirement: {
      type: 'exercise_category_count',
      value: 100,
      exerciseCategory: 'strength',
    },
    xpReward: 600,
    rarity: 'epic',
  },
  {
    id: 'strength_250',
    heroName: 'Hulk Imparable',
    category: 'exercise_type',
    tier: 4,
    title: 'Hulk Imparable',
    description: 'Completa 250 ejercicios de fuerza',
    requirement: {
      type: 'exercise_category_count',
      value: 250,
      exerciseCategory: 'strength',
    },
    xpReward: 1200,
    rarity: 'legendary',
  },

  // ============================================
  // 4️⃣ LOGROS POR TIPO DE EJERCICIO - CARDIO
  // ============================================
  {
    id: 'cardio_10',
    heroName: 'Corredor Veloz',
    category: 'exercise_type',
    tier: 1,
    title: 'Corredor Veloz',
    description: 'Completa 10 ejercicios de cardio',
    requirement: {
      type: 'exercise_category_count',
      value: 10,
      exerciseCategory: 'cardio',
    },
    xpReward: 100,
    rarity: 'common',
  },
  {
    id: 'cardio_50',
    heroName: 'Flash',
    category: 'exercise_type',
    tier: 2,
    title: 'Flash',
    description: 'Completa 50 ejercicios de cardio',
    requirement: {
      type: 'exercise_category_count',
      value: 50,
      exerciseCategory: 'cardio',
    },
    xpReward: 300,
    rarity: 'rare',
  },
  {
    id: 'cardio_100',
    heroName: 'Velocista Legendario',
    category: 'exercise_type',
    tier: 3,
    title: 'Velocista Legendario',
    description: 'Completa 100 ejercicios de cardio',
    requirement: {
      type: 'exercise_category_count',
      value: 100,
      exerciseCategory: 'cardio',
    },
    xpReward: 600,
    rarity: 'epic',
  },
  {
    id: 'cardio_250',
    heroName: 'Viento del Norte',
    category: 'exercise_type',
    tier: 4,
    title: 'Viento del Norte',
    description: 'Completa 250 ejercicios de cardio',
    requirement: {
      type: 'exercise_category_count',
      value: 250,
      exerciseCategory: 'cardio',
    },
    xpReward: 1200,
    rarity: 'legendary',
  },

  // ============================================
  // 4️⃣ LOGROS POR TIPO DE EJERCICIO - FLEXIBILIDAD
  // ============================================
  {
    id: 'flexibility_10',
    heroName: 'Acróbata Novato',
    category: 'exercise_type',
    tier: 1,
    title: 'Acróbata Novato',
    description: 'Completa 10 ejercicios de flexibilidad',
    requirement: {
      type: 'exercise_category_count',
      value: 10,
      exerciseCategory: 'flexibility',
    },
    xpReward: 100,
    rarity: 'common',
  },
  {
    id: 'flexibility_50',
    heroName: 'Elástico',
    category: 'exercise_type',
    tier: 2,
    title: 'Elástico',
    description: 'Completa 50 ejercicios de flexibilidad',
    requirement: {
      type: 'exercise_category_count',
      value: 50,
      exerciseCategory: 'flexibility',
    },
    xpReward: 300,
    rarity: 'rare',
  },
  {
    id: 'flexibility_100',
    heroName: 'Contorsionista Maestro',
    category: 'exercise_type',
    tier: 3,
    title: 'Contorsionista Maestro',
    description: 'Completa 100 ejercicios de flexibilidad',
    requirement: {
      type: 'exercise_category_count',
      value: 100,
      exerciseCategory: 'flexibility',
    },
    xpReward: 600,
    rarity: 'epic',
  },
  {
    id: 'flexibility_250',
    heroName: 'Espíritu Fluido',
    category: 'exercise_type',
    tier: 4,
    title: 'Espíritu Fluido',
    description: 'Completa 250 ejercicios de flexibilidad',
    requirement: {
      type: 'exercise_category_count',
      value: 250,
      exerciseCategory: 'flexibility',
    },
    xpReward: 1200,
    rarity: 'legendary',
  },

  // ============================================
  // 4️⃣ LOGROS POR TIPO DE EJERCICIO - EQUILIBRIO
  // ============================================
  {
    id: 'balance_10',
    heroName: 'Balanceador',
    category: 'exercise_type',
    tier: 1,
    title: 'Balanceador',
    description: 'Completa 10 ejercicios de equilibrio',
    requirement: {
      type: 'exercise_category_count',
      value: 10,
      exerciseCategory: 'balance',
    },
    xpReward: 100,
    rarity: 'common',
  },
  {
    id: 'balance_50',
    heroName: 'Maestro Zen',
    category: 'exercise_type',
    tier: 2,
    title: 'Maestro Zen',
    description: 'Completa 50 ejercicios de equilibrio',
    requirement: {
      type: 'exercise_category_count',
      value: 50,
      exerciseCategory: 'balance',
    },
    xpReward: 300,
    rarity: 'rare',
  },
  {
    id: 'balance_100',
    heroName: 'Guardián del Centro',
    category: 'exercise_type',
    tier: 3,
    title: 'Guardián del Centro',
    description: 'Completa 100 ejercicios de equilibrio',
    requirement: {
      type: 'exercise_category_count',
      value: 100,
      exerciseCategory: 'balance',
    },
    xpReward: 600,
    rarity: 'epic',
  },
  {
    id: 'balance_250',
    heroName: 'Avatar del Balance',
    category: 'exercise_type',
    tier: 4,
    title: 'Avatar del Balance',
    description: 'Completa 250 ejercicios de equilibrio',
    requirement: {
      type: 'exercise_category_count',
      value: 250,
      exerciseCategory: 'balance',
    },
    xpReward: 1200,
    rarity: 'legendary',
  },

  // ============================================
  // 5️⃣ LOGROS POR VARIEDAD
  // ============================================
  {
    id: 'variety_5',
    heroName: 'Explorador',
    category: 'variety',
    tier: 1,
    title: 'Explorador',
    description: 'Completa 5 ejercicios diferentes',
    requirement: {
      type: 'unique_exercises',
      value: 5,
    },
    xpReward: 75,
    rarity: 'common',
  },
  {
    id: 'variety_15',
    heroName: 'Aventurero',
    category: 'variety',
    tier: 2,
    title: 'Aventurero',
    description: 'Completa 15 ejercicios diferentes',
    requirement: {
      type: 'unique_exercises',
      value: 15,
    },
    xpReward: 200,
    rarity: 'rare',
  },
  {
    id: 'variety_30',
    heroName: 'Maestro del Arsenal',
    category: 'variety',
    tier: 3,
    title: 'Maestro del Arsenal',
    description: 'Completa 30 ejercicios diferentes',
    requirement: {
      type: 'unique_exercises',
      value: 30,
    },
    xpReward: 400,
    rarity: 'epic',
  },
  {
    id: 'variety_all',
    heroName: 'Héroe Completo',
    category: 'variety',
    tier: 4,
    title: 'Héroe Completo',
    description: 'Completa todos los ejercicios disponibles',
    requirement: {
      type: 'custom',
      value: 1,
      customCheck: (stats) => {
        // Este número debería ser el total de ejercicios en tu app
        const totalExercises = 50; // Ajustar según tu data
        return stats.uniqueExercisesCompleted.length >= totalExercises;
      },
    },
    xpReward: 1000,
    rarity: 'legendary',
  },
  {
    id: 'variety_weekly',
    heroName: 'Todoterreno',
    category: 'variety',
    tier: 5,
    title: 'Todoterreno',
    description: 'Haz al menos 1 ejercicio de cada categoría en una semana',
    requirement: {
      type: 'custom',
      value: 1,
      customCheck: (stats) => {
        // Esto requeriría lógica adicional para trackear ejercicios semanales
        return false; // Implementar después
      },
    },
    xpReward: 500,
    rarity: 'epic',
    isSecret: true,
  },

  // ============================================
  // 6️⃣ LOGROS POR SESIONES
  // ============================================
  {
    id: 'sessions_1',
    heroName: 'Iniciado',
    category: 'sessions',
    tier: 1,
    title: 'Iniciado',
    description: 'Completa tu primer entrenamiento',
    requirement: {
      type: 'total_workouts',
      value: 1,
    },
    xpReward: 25,
    rarity: 'common',
  },
  {
    id: 'sessions_10',
    heroName: 'Comprometido',
    category: 'sessions',
    tier: 2,
    title: 'Comprometido',
    description: 'Completa 10 entrenamientos',
    requirement: {
      type: 'total_workouts',
      value: 10,
    },
    xpReward: 75,
    rarity: 'common',
  },
  {
    id: 'sessions_25',
    heroName: 'Dedicado',
    category: 'sessions',
    tier: 3,
    title: 'Dedicado',
    description: 'Completa 25 entrenamientos',
    requirement: {
      type: 'total_workouts',
      value: 25,
    },
    xpReward: 150,
    rarity: 'rare',
  },
  {
    id: 'sessions_50',
    heroName: 'Incansable',
    category: 'sessions',
    tier: 4,
    title: 'Incansable',
    description: 'Completa 50 entrenamientos',
    requirement: {
      type: 'total_workouts',
      value: 50,
    },
    xpReward: 300,
    rarity: 'rare',
  },
  {
    id: 'sessions_100',
    heroName: 'Guerrero de Hierro',
    category: 'sessions',
    tier: 5,
    title: 'Guerrero de Hierro',
    description: 'Completa 100 entrenamientos',
    requirement: {
      type: 'total_workouts',
      value: 100,
    },
    xpReward: 500,
    rarity: 'epic',
  },
  {
    id: 'sessions_250',
    heroName: 'Leyenda Viviente',
    category: 'sessions',
    tier: 6,
    title: 'Leyenda Viviente',
    description: 'Completa 250 entrenamientos',
    requirement: {
      type: 'total_workouts',
      value: 250,
    },
    xpReward: 1000,
    rarity: 'epic',
  },
  {
    id: 'sessions_500',
    heroName: 'Dios de la Guerra',
    category: 'sessions',
    tier: 7,
    title: 'Dios de la Guerra',
    description: 'Completa 500 entrenamientos',
    requirement: {
      type: 'total_workouts',
      value: 500,
    },
    xpReward: 2000,
    rarity: 'legendary',
  },
  {
    id: 'sessions_1000',
    heroName: 'Eterno',
    category: 'sessions',
    tier: 8,
    title: 'Eterno',
    description: 'Completa 1,000 entrenamientos',
    requirement: {
      type: 'total_workouts',
      value: 1000,
    },
    xpReward: 5000,
    rarity: 'mythic',
  },

  // ============================================
  // 7️⃣ LOGROS ESPECIALES/CREATIVOS
  // ============================================
  {
    id: 'special_marathon',
    heroName: 'Maratonista',
    category: 'special',
    tier: 1,
    title: 'Maratonista',
    description: 'Entrena 60 minutos seguidos',
    requirement: {
      type: 'workout_duration',
      value: 60,
    },
    xpReward: 200,
    rarity: 'rare',
  },
  {
    id: 'special_ultra',
    heroName: 'Ultra Resistencia',
    category: 'special',
    tier: 2,
    title: 'Ultra Resistencia',
    description: 'Entrena 90 minutos seguidos',
    requirement: {
      type: 'workout_duration',
      value: 90,
    },
    xpReward: 400,
    rarity: 'epic',
  },
  {
    id: 'special_time_titan',
    heroName: 'Titán del Tiempo',
    category: 'special',
    tier: 3,
    title: 'Titán del Tiempo',
    description: 'Acumula 100 horas de entrenamiento total',
    requirement: {
      type: 'custom',
      value: 6000, // 100 horas en minutos
      customCheck: (stats) => stats.totalWorkoutMinutes >= 6000,
    },
    xpReward: 1500,
    rarity: 'legendary',
  },
  {
    id: 'special_mentor',
    heroName: 'Mentor',
    category: 'special',
    tier: 1,
    title: 'Mentor',
    description: 'Comparte 5 entrenamientos',
    requirement: {
      type: 'share_count',
      value: 5,
    },
    xpReward: 100,
    rarity: 'rare',
  },
  {
    id: 'special_inspirator',
    heroName: 'Inspirador',
    category: 'special',
    tier: 2,
    title: 'Inspirador',
    description: 'Comparte 25 entrenamientos',
    requirement: {
      type: 'share_count',
      value: 25,
    },
    xpReward: 300,
    rarity: 'epic',
  },
  {
    id: 'special_league_leader',
    heroName: 'Líder de la Liga',
    category: 'special',
    tier: 3,
    title: 'Líder de la Liga',
    description: 'Comparte 100 entrenamientos',
    requirement: {
      type: 'share_count',
      value: 100,
    },
    xpReward: 1000,
    rarity: 'legendary',
  },
  {
    id: 'special_perfectionist',
    heroName: 'Perfeccionista',
    category: 'special',
    tier: 1,
    title: 'Perfeccionista',
    description: 'Completa 10 entrenamientos con técnica perfecta',
    requirement: {
      type: 'perfect_form',
      value: 10,
    },
    xpReward: 250,
    rarity: 'epic',
  },
  {
    id: 'special_form_master',
    heroName: 'Maestro de la Forma',
    category: 'special',
    tier: 2,
    title: 'Maestro de la Forma',
    description: 'Completa 50 entrenamientos sin errores',
    requirement: {
      type: 'perfect_form',
      value: 50,
    },
    xpReward: 750,
    rarity: 'legendary',
  },
  {
    id: 'special_virtuoso',
    heroName: 'Virtuoso',
    category: 'special',
    tier: 3,
    title: 'Virtuoso',
    description: 'Completa una semana perfecta (todos los días entrenados)',
    requirement: {
      type: 'consecutive_days',
      value: 7,
    },
    xpReward: 500,
    rarity: 'epic',
  },
  {
    id: 'special_3am',
    heroName: 'Madruguete Extremo',
    category: 'special',
    tier: 1,
    title: 'Madruguete Extremo',
    description: 'Entrenar a las 3am exactamente',
    requirement: {
      type: 'custom',
      value: 1,
      customCheck: () => false, // Se verificará con hora exacta
    },
    xpReward: 300,
    rarity: 'legendary',
    isSecret: true,
    isHidden: true,
  },
  {
    id: 'special_nye',
    heroName: 'Guerrero del Fin del Mundo',
    category: 'special',
    tier: 1,
    title: 'Guerrero del Fin del Mundo',
    description: 'Entrenar en Año Nuevo',
    requirement: {
      type: 'custom',
      value: 1,
      customCheck: () => false, // Se verificará con fecha
    },
    xpReward: 500,
    rarity: 'legendary',
    isSecret: true,
    isHidden: true,
  },
  {
    id: 'special_birthday',
    heroName: 'Cumpleañero Fit',
    category: 'special',
    tier: 1,
    title: 'Cumpleañero Fit',
    description: 'Entrena en tu cumpleaños',
    requirement: {
      type: 'custom',
      value: 1,
      customCheck: () => false, // Se verificará con fecha de cumpleaños
    },
    xpReward: 250,
    rarity: 'epic',
    isSecret: true,
    isHidden: true,
  },
  {
    id: 'special_comeback',
    heroName: 'Comeback Kid',
    category: 'special',
    tier: 1,
    title: 'Comeback Kid',
    description: 'Vuelve a entrenar después de 30 días de inactividad',
    requirement: {
      type: 'comeback',
      value: 30,
    },
    xpReward: 400,
    rarity: 'epic',
    isSecret: true,
  },
  {
    id: 'special_record_breaker',
    heroName: 'Rompe Récords',
    category: 'special',
    tier: 1,
    title: 'Rompe Récords',
    description: 'Supera tu récord personal 10 veces',
    requirement: {
      type: 'personal_records',
      value: 10,
    },
    xpReward: 350,
    rarity: 'epic',
  },
  {
    id: 'special_chameleon',
    heroName: 'Camaleón',
    category: 'special',
    tier: 1,
    title: 'Camaleón',
    description: 'Haz diferentes ejercicios 7 días seguidos',
    requirement: {
      type: 'variety_streak',
      value: 7,
    },
    xpReward: 300,
    rarity: 'rare',
  },
  {
    id: 'special_zombie',
    heroName: 'Zombi Fitness',
    category: 'special',
    tier: 1,
    title: 'Zombi Fitness',
    description: 'Entrena a las 5am un lunes',
    requirement: {
      type: 'custom',
      value: 1,
      customCheck: () => false, // Verificar día y hora
    },
    xpReward: 200,
    rarity: 'rare',
    isSecret: true,
    isHidden: true,
  },
  {
    id: 'special_hangover',
    heroName: 'Héroe de Resaca',
    category: 'special',
    tier: 1,
    title: 'Héroe de Resaca',
    description: 'Entrena temprano en fin de semana (antes de 9am sábado o domingo)',
    requirement: {
      type: 'custom',
      value: 1,
      customCheck: () => false, // Verificar día y hora
    },
    xpReward: 150,
    rarity: 'rare',
    isSecret: true,
    isHidden: true,
  },
  {
    id: 'special_couch_warrior',
    heroName: 'Guerrero del Sofá',
    category: 'special',
    tier: 1,
    title: 'Guerrero del Sofá',
    description: 'Completa tu primer entrenamiento de cuerpo completo',
    requirement: {
      type: 'custom',
      value: 1,
      customCheck: () => false, // Verificar tipo de entrenamiento
    },
    xpReward: 100,
    rarity: 'common',
  },
  {
    id: 'special_excuse_destroyer',
    heroName: 'Destructor de Excusas',
    category: 'special',
    tier: 1,
    title: 'Destructor de Excusas',
    description: '30 días sin fallar',
    requirement: {
      type: 'consecutive_days',
      value: 30,
    },
    xpReward: 600,
    rarity: 'legendary',
  },

  // ============================================
  // 8️⃣ LOGROS ESTACIONALES
  // ============================================
  {
    id: 'seasonal_summer',
    heroName: 'Guerrero del Verano',
    category: 'seasonal',
    tier: 1,
    title: 'Guerrero del Verano',
    description: 'Completa 20 entrenamientos en verano',
    requirement: {
      type: 'seasonal_workouts',
      value: 20,
      season: 'summer',
    },
    xpReward: 300,
    rarity: 'rare',
  },
  {
    id: 'seasonal_winter',
    heroName: 'Titán Invernal',
    category: 'seasonal',
    tier: 1,
    title: 'Titán Invernal',
    description: 'Completa 20 entrenamientos en invierno',
    requirement: {
      type: 'seasonal_workouts',
      value: 20,
      season: 'winter',
    },
    xpReward: 300,
    rarity: 'rare',
  },
  {
    id: 'seasonal_spring',
    heroName: 'Héroe de Primavera',
    category: 'seasonal',
    tier: 1,
    title: 'Héroe de Primavera',
    description: 'Completa 20 entrenamientos en primavera',
    requirement: {
      type: 'seasonal_workouts',
      value: 20,
      season: 'spring',
    },
    xpReward: 300,
    rarity: 'rare',
  },
  {
    id: 'seasonal_fall',
    heroName: 'Guardián del Otoño',
    category: 'seasonal',
    tier: 1,
    title: 'Guardián del Otoño',
    description: 'Completa 20 entrenamientos en otoño',
    requirement: {
      type: 'seasonal_workouts',
      value: 20,
      season: 'fall',
    },
    xpReward: 300,
    rarity: 'rare',
  },
  {
    id: 'seasonal_champion',
    heroName: 'Campeón Anual',
    category: 'seasonal',
    tier: 2,
    title: 'Campeón Anual',
    description: 'Entrena en todas las estaciones del año',
    requirement: {
      type: 'custom',
      value: 4,
      customCheck: (stats) => {
        return (
          stats.summerWorkouts > 0 &&
          stats.winterWorkouts > 0 &&
          stats.springWorkouts > 0 &&
          stats.fallWorkouts > 0
        );
      },
    },
    xpReward: 1000,
    rarity: 'legendary',
  },

  // ============================================
  // 9️⃣ LOGROS POR INTENSIDAD
  // ============================================
  {
    id: 'intensity_easy',
    heroName: 'Calentamiento',
    category: 'intensity',
    tier: 1,
    title: 'Calentamiento',
    description: 'Completa 10 entrenamientos fáciles',
    requirement: {
      type: 'intensity_level',
      value: 10,
      intensityLevel: 'easy',
    },
    xpReward: 50,
    rarity: 'common',
  },
  {
    id: 'intensity_beast',
    heroName: 'Modo Bestia',
    category: 'intensity',
    tier: 2,
    title: 'Modo Bestia',
    description: 'Completa 25 entrenamientos intensos',
    requirement: {
      type: 'intensity_level',
      value: 25,
      intensityLevel: 'hard',
    },
    xpReward: 400,
    rarity: 'epic',
  },
  {
    id: 'intensity_super',
    heroName: 'Súper Saiyajin',
    category: 'intensity',
    tier: 3,
    title: 'Súper Saiyajin',
    description: 'Completa 50 entrenamientos al máximo',
    requirement: {
      type: 'intensity_level',
      value: 50,
      intensityLevel: 'extreme',
    },
    xpReward: 800,
    rarity: 'legendary',
  },
  {
    id: 'intensity_ultra',
    heroName: 'Ultra Instinto',
    category: 'intensity',
    tier: 4,
    title: 'Ultra Instinto',
    description: 'Completa 100 entrenamientos extremos',
    requirement: {
      type: 'intensity_level',
      value: 100,
      intensityLevel: 'extreme',
    },
    xpReward: 2000,
    rarity: 'mythic',
  },

  // ============================================
  // 🔟 MEGA LOGROS (Meta-achievements)
  // ============================================
  {
    id: 'mega_collector_25',
    heroName: 'Coleccionista',
    category: 'mega',
    tier: 1,
    title: 'Coleccionista',
    description: 'Desbloquea 25 héroes',
    requirement: {
      type: 'achievements_unlocked',
      value: 25,
    },
    xpReward: 500,
    rarity: 'epic',
  },
  {
    id: 'mega_master_50',
    heroName: 'Maestro de Héroes',
    category: 'mega',
    tier: 2,
    title: 'Maestro de Héroes',
    description: 'Desbloquea 50 héroes',
    requirement: {
      type: 'achievements_unlocked',
      value: 50,
    },
    xpReward: 1000,
    rarity: 'epic',
  },
  {
    id: 'mega_leader_75',
    heroName: 'Líder de la Liga',
    category: 'mega',
    tier: 3,
    title: 'Líder de la Liga',
    description: 'Desbloquea 75 héroes',
    requirement: {
      type: 'achievements_unlocked',
      value: 75,
    },
    xpReward: 2000,
    rarity: 'legendary',
  },
  {
    id: 'mega_guardian_100',
    heroName: 'Guardián del Universo',
    category: 'mega',
    tier: 4,
    title: 'Guardián del Universo',
    description: 'Desbloquea 100 héroes',
    requirement: {
      type: 'achievements_unlocked',
      value: 100,
    },
    xpReward: 5000,
    rarity: 'legendary',
  },
  {
    id: 'mega_omnipotent',
    heroName: 'Omnipotente',
    category: 'mega',
    tier: 5,
    title: 'Omnipotente',
    description: 'Desbloquea TODOS los héroes disponibles',
    requirement: {
      type: 'custom',
      value: 1,
      customCheck: (stats) => {
        // El número total de logros - 1 (este mismo)
        return stats.unlockedAchievements.length >= ACHIEVEMENTS.length - 1;
      },
    },
    xpReward: 10000,
    rarity: 'mythic',
  },
];

// Utilidades para trabajar con achievements
export const getAchievementById = (id: string): Achievement | undefined => {
  return ACHIEVEMENTS.find((achievement) => achievement.id === id);
};

export const getAchievementsByCategory = (category: Achievement['category']): Achievement[] => {
  return ACHIEVEMENTS.filter((achievement) => achievement.category === category);
};

export const getAchievementsByRarity = (rarity: Achievement['rarity']): Achievement[] => {
  return ACHIEVEMENTS.filter((achievement) => achievement.rarity === rarity);
};

export const getTotalAchievements = (): number => {
  return ACHIEVEMENTS.length;
};

export const getVisibleAchievements = (): Achievement[] => {
  return ACHIEVEMENTS.filter((achievement) => !achievement.isHidden);
};

export const getSecretAchievements = (): Achievement[] => {
  return ACHIEVEMENTS.filter((achievement) => achievement.isSecret);
};
