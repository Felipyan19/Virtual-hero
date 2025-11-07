# 🎉 Recomendaciones: Efectos Visuales y Sonidos

## 📋 Resumen Ejecutivo

Análisis completo de **Virtual Hero** para identificar los mejores momentos donde agregar:
- 🎊 **Confeti y animaciones**
- 🔊 **Efectos de sonido**
- 💥 **Onomatopeyas estilo cómic**

---

## 🎨 Componentes Existentes

### ✅ Ya Implementados
1. **ConfettiPow** (`src/components/ConfettiPow.tsx`)
   - Combina confeti + onomatopeya "¡POW!"
   - Actualmente usado: Al completar ejercicio
   - Ubicación: `app/(tabs)/exercises/[id].tsx:73`

2. **OnomatopoeiaBurst** (`src/components/OnomatopoeiaBurst.tsx`)
   - Texto animado estilo cómic (POW, BAM, BOOM, etc.)
   - Reutilizable con diferentes textos
   - Animación con rebote y rotación

3. **soundEnabled** en Store
   - Estado global para activar/desactivar sonidos
   - Ubicación: `src/store/useAppStore.ts:151`
   - **⚠️ NO IMPLEMENTADO: Sistema de audio falta**

---

## 🎯 Momentos Críticos para Efectos

### 🏆 PRIORIDAD ALTA - Logros Mayores

#### 1. **Subida de Nivel**
📍 **Ubicación:** `src/store/useAppStore.ts:162-174`

```typescript
while (newXP >= xpForNext) {
  newXP -= xpForNext;
  newLevel += 1;
  // ⭐ AGREGAR AQUÍ: Confeti + sonido de nivel up
}
```

**Efectos recomendados:**
- 🎊 **Confeti:** Más denso que ejercicio (50+ piezas)
- 💥 **Onomatopeya:** "¡LEVEL UP!" o "¡BOOM!"
- 🔊 **Sonido:** Fanfarria épica (2-3 segundos)
- ✨ **Extra:** Flash de luz dorado en pantalla

**Implementación:**
```typescript
// Callback opcional para notificar a la UI
onLevelUp?: (newLevel: number) => void

// En el store
if (onLevelUp) onLevelUp(newLevel);
```

---

#### 2. **Desbloqueo de Logros**
📍 **Ubicación:** `src/store/useAppStore.ts:231-248`

```typescript
unlockAchievement: (achievementId: string) => {
  // ... lógica existente
  console.log(`[Logro] Desbloqueado: ${achievement.title}`);
  // ⭐ AGREGAR AQUÍ: Confeti + modal de logro + sonido
}
```

**Efectos recomendados:**
- 🎊 **Confeti:** Colores según rareza del logro
  - Común: Azul/Verde
  - Raro: Morado/Cyan
  - Épico: Dorado/Naranja
  - Legendario: Arcoíris multicolor
- 💥 **Onomatopeya:** Según logro
  - "¡ACHIEVEMENT!"
  - "¡LEGENDARY!"
  - "¡EPIC!"
- 🔊 **Sonido:** Campanada + coro épico
- 📱 **Modal:** Tarjeta emergente con el logro

**Pantallas donde mostrar:**
- Cualquier pantalla (overlay global)
- Agregar a `app/_layout.tsx` como componente global

---

#### 3. **Niveles Especiales (5, 10, 15, 20)**
📍 **Ubicación:** `src/store/useAppStore.ts:168-173`

```typescript
// Desbloquear logros de nivel
if (newLevel === 5) {
  get().unlockAchievement('level_5');
  // ⭐ CONFETI ESPECIAL + MENSAJE DE DESBLOQUEO
}
```

**Efectos recomendados:**
- 🎊 **Super Confeti:** 100+ piezas, duración 5 segundos
- 💥 **Onomatopeya:** "¡SUPERHERO!" o "¡LEGENDARY!"
- 🔊 **Sonido:** Fanfarria extendida + efecto de poder
- 🌟 **Animación:** Estrella brillante girando
- 📜 **Mensaje:** "¡Desbloqueaste [Recompensa]!"

---

### 🎯 PRIORIDAD MEDIA - Metas Diarias

#### 4. **Completar Meta de Agua**
📍 **Ubicación:** `app/(tabs)/index.tsx:58-61`

```typescript
if (todayML + cupSizeML >= dailyGoalML && todayML < dailyGoalML) {
  const bonusXP = calculateXP(XPSource.WATER_GOAL);
  addXP(bonusXP, 'Meta de agua');
  // ⭐ AGREGAR: Animación de agua + sonido
}
```

**Efectos recomendados:**
- 💧 **Animación:** Olas de agua azul brillante
- 💥 **Onomatopeya:** "¡SPLASH!" o "¡HYDRATED!"
- 🔊 **Sonido:** Chapoteo + campanita
- 🎨 **Visual:** WaterCounter brilla con efecto de agua

---

#### 5. **Completar Meta de Pasos**
📍 **Ubicación:** `src/store/useSteps.ts` (necesita implementación)

**Efectos recomendados:**
- 🏃 **Animación:** Pisadas brillantes
- 💥 **Onomatopeya:** "¡ZAP!" o "¡GOAL!"
- 🔊 **Sonido:** Pasos rápidos + campanita
- 🎨 **Visual:** StepsGauge brilla en cyan

---

#### 6. **Completar Meta de Sueño**
📍 **Ubicación:** `src/store/useSleep.ts` (necesita implementación)

**Efectos recomendados:**
- 😴 **Animación:** Zzzz flotantes
- 💥 **Onomatopeya:** "¡ZZZ!" o "¡RESTED!"
- 🔊 **Sonido:** Bostezo suave + chime
- 🎨 **Visual:** SleepEnergyBar brilla en morado

---

### ⚡ PRIORIDAD BAJA - Micro-interacciones

#### 7. **Añadir Vaso de Agua**
📍 **Ubicación:** `app/(tabs)/index.tsx:51-56`

**Efectos recomendados:**
- 💧 **Animación:** Gota de agua cayendo
- 🔊 **Sonido:** "Plop" suave
- 🎨 **Visual:** Vaso lleno brevemente

---

#### 8. **Racha de 7+ Días**
📍 **Ubicación:** `src/store/useAppStore.ts:224-226`

```typescript
if (newStreak === 7) {
  get().unlockAchievement('routine_hero');
  // ⭐ EFECTO ESPECIAL DE FUEGO
}
```

**Efectos recomendados:**
- 🔥 **Animación:** Llamas naranjas/rojas
- 💥 **Onomatopeya:** "¡ON FIRE!" o "¡STREAK!"
- 🔊 **Sonido:** Llamarada + silbido
- 🎨 **Visual:** StreakBillboard con partículas de fuego

---

## 🔊 Sistema de Sonidos a Implementar

### Biblioteca Recomendada
```bash
npm install expo-av
```

### Estructura de Carpetas
```
assets/
  sounds/
    ├── level-up.mp3          # Subida de nivel
    ├── achievement.mp3       # Logro desbloqueado
    ├── goal-complete.mp3     # Meta completada
    ├── water-splash.mp3      # Vaso de agua
    ├── tap.mp3               # Interacción general
    ├── streak-fire.mp3       # Racha de días
    └── legendary.mp3         # Logro legendario
```

### Servicio de Audio
📁 **Crear:** `src/lib/sounds.ts`

```typescript
import { Audio } from 'expo-av';
import { useAppStore } from '@/store/useAppStore';

export enum SoundEffect {
  LEVEL_UP = 'level-up',
  ACHIEVEMENT = 'achievement',
  GOAL_COMPLETE = 'goal-complete',
  WATER_SPLASH = 'water-splash',
  TAP = 'tap',
  STREAK_FIRE = 'streak-fire',
  LEGENDARY = 'legendary',
}

const sounds: { [key in SoundEffect]?: Audio.Sound } = {};

export const loadSounds = async () => {
  // Cargar todos los sonidos en memoria
};

export const playSound = async (effect: SoundEffect) => {
  const { soundEnabled } = useAppStore.getState();
  if (!soundEnabled) return;

  const sound = sounds[effect];
  if (sound) {
    await sound.replayAsync();
  }
};
```

---

## 🎨 Variantes de Confeti Recomendadas

### Crear componente genérico
📁 **Mejorar:** `src/components/ConfettiPow.tsx`

```typescript
export enum ConfettiType {
  EXERCISE = 'exercise',      // Actual
  LEVEL_UP = 'level-up',       // Más denso
  ACHIEVEMENT = 'achievement', // Colores por rareza
  GOAL = 'goal',              // Tamaño medio
  SPECIAL = 'special',        // Arcoíris
}

interface ConfettiPowProps {
  visible: boolean;
  type?: ConfettiType;
  message?: string; // Reemplaza "¡POW!"
  onComplete?: () => void;
}
```

---

## 📍 Implementación por Pantalla

### `app/(tabs)/index.tsx` - Home
**Agregar:**
- ✅ Confeti al completar meta de agua
- ✅ Confeti al completar meta de pasos
- ✅ Animación breve al añadir vaso

### `app/(tabs)/exercises/[id].tsx` - Ejercicio
**Actual:**
- ✅ ConfettiPow al completar (línea 73)

**Mejorar:**
- ✨ Sonido al completar
- ✨ Mensaje personalizado según XP ganado

### `app/(tabs)/achievements/index.tsx` - Logros
**Agregar:**
- ✅ Confeti al hacer clic en logro desbloqueado
- ✅ Animación de brillo en logros nuevos

### `app/_layout.tsx` - Global
**Agregar:**
- ✅ Overlay de logros desbloqueados
- ✅ Overlay de subida de nivel
- ✅ Sistema de notificaciones visuales

---

## 🎯 Plan de Implementación

### Fase 1: Sonidos Básicos (2-3 horas)
1. ✅ Instalar `expo-av`
2. ✅ Crear servicio de sonidos
3. ✅ Agregar sonidos a assets
4. ✅ Integrar en eventos principales:
   - Subida de nivel
   - Completar ejercicio
   - Desbloquear logro

### Fase 2: Confeti Mejorado (2-3 horas)
1. ✅ Refactorizar ConfettiPow
2. ✅ Agregar variantes de tipo
3. ✅ Integrar en metas diarias
4. ✅ Agregar colores por rareza

### Fase 3: Onomatopeyas Personalizadas (1-2 horas)
1. ✅ Crear variantes de OnomatopoeiaBurst
2. ✅ Mapear mensajes a eventos
3. ✅ Integrar en todos los eventos

### Fase 4: Overlays Globales (3-4 horas)
1. ✅ Componente de logro desbloqueado
2. ✅ Componente de subida de nivel
3. ✅ Sistema de cola de notificaciones
4. ✅ Integración en layout global

---

## 🎵 Recursos de Sonido Gratuitos

### Sitios Recomendados
1. **Freesound.org** - Efectos generales
2. **Zapsplat.com** - Efectos de juego
3. **Mixkit.co** - Sonidos premium gratis
4. **Pixabay Audio** - Música y efectos

### Búsquedas Sugeridas
- "level up sound"
- "achievement unlock"
- "splash water"
- "fire whoosh"
- "game success"
- "epic fanfare"

---

## 📊 Matriz de Efectos por Evento

| Evento | Confeti | Onomatopeya | Sonido | Prioridad |
|--------|---------|-------------|--------|-----------|
| ✅ Completar ejercicio | ✅ (actual) | ✅ POW | ⚠️ Falta | MEDIA |
| ⚡ Subir de nivel | ⚠️ Falta | ⚠️ Falta | ⚠️ Falta | **ALTA** |
| 🏆 Desbloquear logro | ⚠️ Falta | ⚠️ Falta | ⚠️ Falta | **ALTA** |
| 💧 Meta de agua | ⚠️ Falta | ⚠️ Falta | ⚠️ Falta | MEDIA |
| 🏃 Meta de pasos | ⚠️ Falta | ⚠️ Falta | ⚠️ Falta | MEDIA |
| 😴 Meta de sueño | ⚠️ Falta | ⚠️ Falta | ⚠️ Falta | MEDIA |
| 🔥 Racha 7 días | ⚠️ Falta | ⚠️ Falta | ⚠️ Falta | MEDIA |
| 💧 Añadir vaso | - | - | ⚠️ Falta | BAJA |
| 🌟 Nivel especial (5,10,15,20) | ⚠️ Falta | ⚠️ Falta | ⚠️ Falta | **ALTA** |

---

## 🎨 Paleta de Colores para Efectos

### Confeti por Rareza
```typescript
const RARITY_COLORS = {
  common: ['#6B7280', '#9CA3AF', '#D1D5DB'],
  rare: ['#3B82F6', '#06B6D4', '#8B5CF6'],
  epic: ['#8B5CF6', '#A855F7', '#EC4899'],
  legendary: ['#F59E0B', '#EF4444', '#F97316'],
  mythic: ['#EF4444', '#EC4899', '#8B5CF6', '#06B6D4', '#10B981'], // Arcoíris
};
```

---

## ✅ Checklist de Implementación

### Sonidos
- [ ] Instalar expo-av
- [ ] Crear servicio de sonidos
- [ ] Descargar/crear assets de sonido
- [ ] Implementar playSound en eventos clave
- [ ] Respetar configuración soundEnabled

### Confeti
- [ ] Refactorizar ConfettiPow con tipos
- [ ] Crear variantes de densidad
- [ ] Agregar colores por rareza
- [ ] Integrar en todos los eventos

### Onomatopeyas
- [ ] Crear mapeo de mensajes
- [ ] Integrar en eventos
- [ ] Personalizar por tipo de logro

### UI/UX
- [ ] Overlay de logros
- [ ] Overlay de nivel up
- [ ] Sistema de cola de notificaciones
- [ ] Animaciones de brillo en componentes

---

## 📝 Notas Finales

1. **Rendimiento:** Los efectos deben ser ligeros. Usar `useNativeDriver: true` en animaciones.

2. **Accesibilidad:** Respetar siempre `soundEnabled` del usuario.

3. **Timing:** Los efectos no deben bloquear la UI. Usar overlays con `pointerEvents="none"`.

4. **Testing:** Probar en dispositivos reales para verificar rendimiento de audio.

5. **Progresivo:** Implementar efectos gradualmente, empezando por eventos de alta prioridad.

---

**Autor:** Claude
**Fecha:** 2025-11-07
**Versión:** 1.0
