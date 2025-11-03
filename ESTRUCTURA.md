# 📂 Estructura del Proyecto Virtual Hero

## Árbol Completo de Archivos

```
Virtual-hero/
│
├── 📱 app/                                    # Navegación y pantallas (Expo Router)
│   ├── _layout.tsx                           # Layout raíz con providers
│   ├── index.tsx                             # Splash/redirect inicial
│   └── (tabs)/                               # Navegación por pestañas
│       ├── _layout.tsx                       # Layout de tabs
│       ├── index.tsx                         # 🏠 Home - Dashboard principal
│       ├── exercises/
│       │   ├── index.tsx                     # 💪 Lista de ejercicios
│       │   └── [id].tsx                      # 🎯 Detalle y ejecución
│       ├── achievements/
│       │   └── index.tsx                     # 🏆 Logros desbloqueables
│       └── profile/
│           └── index.tsx                     # 👤 Perfil y configuración
│
├── 🎨 src/
│   │
│   ├── theme/                                # Sistema de diseño
│   │   ├── tokens.ts                         # Colores, espaciado, tipografía
│   │   └── theme.ts                          # Estilos componibles
│   │
│   ├── 📦 store/                             # Estado global (Zustand)
│   │   ├── useAppStore.ts                    # XP, nivel, rachas, logros
│   │   ├── useHydration.ts                   # Hidratación y vasos
│   │   ├── useSleep.ts                       # Sueño y objetivos
│   │   └── useSteps.ts                       # Pasos diarios
│   │
│   ├── 🔧 lib/                               # Lógica de negocio
│   │   ├── healthkit.ts                      # iOS HealthKit (stubs)
│   │   ├── googleFit.ts                      # Android Google Fit (stubs)
│   │   ├── notifications.ts                  # Sistema de notificaciones
│   │   ├── streaks.ts                        # Lógica de rachas
│   │   └── xp.ts                             # Sistema de experiencia
│   │
│   ├── 💾 db/                                # Base de datos
│   │   ├── schema.sql                        # Schema SQLite
│   │   └── client.ts                         # Cliente y queries
│   │
│   ├── 📊 data/
│   │   └── exercises.json                    # 25 ejercicios predefinidos
│   │
│   └── 🧩 components/                        # Componentes UI
│       ├── PanelCard.tsx                     # Tarjeta/viñeta base
│       ├── SpeechBubble.tsx                  # Bocadillo de diálogo
│       ├── OnomatopoeiaBurst.tsx             # POW/BAM animado
│       ├── BadgeSticker.tsx                  # Badge/etiqueta
│       ├── StepsGauge.tsx                    # Medidor circular pasos
│       ├── WaterCounter.tsx                  # Contador de agua
│       ├── SleepEnergyBar.tsx                # Barra de energía/sueño
│       ├── StreakBillboard.tsx               # Cartelera de racha
│       ├── ExerciseTile.tsx                  # Tarjeta de ejercicio
│       ├── TimerChip.tsx                     # Temporizador
│       └── ConfettiPow.tsx                   # Animación celebración
│
├── 🖼️ assets/                                # Assets estáticos
│   ├── .gitkeep                              # (placeholder)
│   ├── icon.png                              # (por agregar 1024x1024)
│   ├── adaptive-icon.png                     # (por agregar 1024x1024)
│   ├── splash.png                            # (por agregar 2048x2048)
│   ├── favicon.png                           # (por agregar 48x48)
│   └── notification-icon.png                 # (por agregar 96x96)
│
├── 🔨 .husky/                                # Git hooks
│   └── pre-commit                            # Lint + format + type-check
│
├── ⚙️ Configuración
│   ├── package.json                          # Dependencias y scripts
│   ├── app.json                              # Config Expo + plugins
│   ├── tsconfig.json                         # Config TypeScript
│   ├── babel.config.js                       # Config Babel + aliases
│   ├── metro.config.js                       # Config Metro bundler
│   ├── .eslintrc.js                          # Config ESLint
│   ├── .prettierrc.js                        # Config Prettier
│   └── .gitignore                            # Archivos ignorados
│
└── 📖 Documentación
    ├── README.md                             # Documentación principal
    └── ESTRUCTURA.md                         # Este archivo
```

## 📊 Estadísticas

- **Pantallas**: 6 (Home, Ejercicios, Detalle, Logros, Perfil, Splash)
- **Componentes UI**: 11 componentes reutilizables
- **Stores**: 4 stores de estado (Zustand + MMKV)
- **Librerías**: 5 módulos de lógica de negocio
- **Ejercicios**: 25 ejercicios pre-cargados
- **Logros**: 9 achievements desbloqueables
- **Líneas de código**: ~3,500+ LOC (sin contar node_modules)

## 🎯 Flujo de Navegación

```
[Splash] → [Home (Tabs)]
              ├── Home (Dashboard)
              │   └── → Ejercicios (al tocar "Misión del día")
              │
              ├── Ejercicios
              │   ├── Lista con filtros
              │   └── → [id] Detalle + temporizador
              │
              ├── Logros
              │   └── Lista de achievements
              │
              └── Perfil
                  └── Stats + Configuración
```

## 🔄 Flujo de Datos

```
[Usuario]
    ↓
[UI Components] ← lee → [Zustand Stores] ← persiste → [MMKV]
    ↓                           ↓
[Actions]                   [SQLite]
    ↓                           ↓
[Lib Functions]            [Historial]
    ↓
[HealthKit/Google Fit] → [Notificaciones]
```

## 🎨 Sistema de Tema

### Paleta de Colores

```
Primarios:
  primary: #6D28D9   (morado héroe)
  secondary: #2563EB (azul acción)
  accent: #10B981    (verde logro)
  pop: #FACC15       (amarillo onomatopeyas)

Superficies:
  paper: #FFFDFC     (fondo papel cómic)
  ink: #0F172A       (texto)
  border: #111827    (contornos)

Gradientes:
  hero: [#6D28D9, #2563EB, #10B981]
  danger: [#DC2626, #EA580C]
  success: [#10B981, #14B8A6]
```

### Componentes de Diseño

- **Contornos**: 2-4px negros
- **Sombras**: Offset (desplazadas) sin blur
- **Tipografía**: Bold para títulos (900), regular para cuerpo (400)
- **Espaciado**: Sistema de 8pt grid
- **Border radius**: 4-24px según jerarquía

## 📦 Dependencias Principales

### Core

- `react-native`: 0.73.2
- `expo`: ~50.0.0
- `typescript`: ^5.3.3

### Navegación y Estado

- `expo-router`: ~3.4.0
- `zustand`: ^4.4.7
- `react-native-mmkv`: ^2.11.0

### Datos

- `expo-sqlite`: ~13.2.0
- `@tanstack/react-query`: ^5.8.4

### UI/Animación

- `react-native-reanimated`: ~3.6.1
- `react-native-svg`: 14.1.0
- `lottie-react-native`: 6.5.1
- `victory-native`: ^36.9.2

### Salud (por integrar)

- `react-native-health`: ^1.19.1
- `react-native-google-fit`: ^0.5.0

### Notificaciones

- `expo-notifications`: ~0.27.0

## 🔐 Permisos Requeridos

### iOS (Info.plist)

- `NSHealthShareUsageDescription`
- `NSHealthUpdateUsageDescription`
- `NSMotionUsageDescription`

### Android (AndroidManifest.xml)

- `ACTIVITY_RECOGNITION`
- `POST_NOTIFICATIONS`
- `SCHEDULE_EXACT_ALARM`
- Google Fit OAuth scopes

## 🚀 Comandos Rápidos

```bash
# Desarrollo
npm run dev              # Metro Bundler
npm run ios              # Correr iOS
npm run android          # Correr Android

# Build nativo
npm run prebuild         # Generar iOS/Android
npm run prebuild:clean   # Regenerar desde cero

# Calidad
npm run lint             # Verificar código
npm run format           # Formatear código
npm run type-check       # Verificar tipos TS
```

## ✅ Estado de Implementación

### Completado (MVP) ✅

- [x] Configuración del proyecto
- [x] Sistema de tema cómic
- [x] Todos los stores (App, Hydration, Sleep, Steps)
- [x] Todas las librerías (XP, streaks, notifications)
- [x] Base de datos SQLite con schema
- [x] 11 componentes UI completos
- [x] 6 pantallas funcionales
- [x] Navegación con tabs
- [x] 25 ejercicios en catálogo
- [x] Sistema de logros (9 achievements)
- [x] Sistema de notificaciones
- [x] Animaciones y efectos visuales
- [x] README completo

### Por Implementar 🚧

- [ ] Integración real HealthKit (descomentar código)
- [ ] Integración real Google Fit (descomentar código)
- [ ] Assets gráficos (iconos, splash)
- [ ] Widgets nativos
- [ ] Backend para sincronización
- [ ] Tests unitarios y de integración
- [ ] Modo oscuro
- [ ] Sonidos y efectos de audio

## 📝 Notas de Desarrollo

### Para Activar HealthKit/Google Fit:

1. Descomentar imports en `src/lib/healthkit.ts` y `src/lib/googleFit.ts`
2. Instalar dependencias nativas
3. Ejecutar `npm run prebuild`
4. Configurar OAuth (Google Fit) o capabilities (HealthKit)

### Para Widgets:

Ver TODOs en README principal. Requiere:

- `react-native-android-widget`
- `react-native-widgetkit`
- Configuración adicional en código nativo

### Para Producción:

1. Generar iconos y splash screens
2. Configurar EAS Build (Expo Application Services)
3. Actualizar versiones en `app.json` y `package.json`
4. Probar en dispositivos físicos con permisos reales
5. Configurar Analytics (opcional)

---

**Estructura generada**: Noviembre 2025  
**Framework**: Expo 50 + React Native 0.73  
**Última actualización**: Proyecto inicializado completo
