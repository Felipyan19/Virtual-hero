# 🦸 Virtual Giro - App de Fitness Gamificada

App móvil de fitness gamificada con estética de cómic y superhéroes. Convierte tu rutina diaria en una aventura épica.

## 🎨 Características

- **Sistema de XP y Niveles**: Gana experiencia completando metas diarias y ejercicios
- **Sistema de Rachas**: Mantén rachas diarias cumpliendo objetivos
- **Seguimiento de Pasos**: Integración con Google Fit (Android) y HealthKit (iOS)
- **Hidratación**: Registro de consumo de agua con recordatorios programables
- **Objetivos de Sueño**: Define y sigue tus metas de descanso
- **Catálogo de Ejercicios**: 25+ ejercicios con temporizador y guías
- **Logros Desbloqueables**: Sistema de achievements con recompensas
- **Estilo Cómic Único**: UI con viñetas, bocadillos y onomatopeyas (POW!, BAM!)

## 🛠️ Tech Stack

- **Framework**: React Native + Expo 50 (SDK)
- **Lenguaje**: TypeScript
- **Navegación**: Expo Router (file-based routing)
- **Estado Global**: Zustand + MMKV (persistencia)
- **Base de Datos**: SQLite (expo-sqlite)
- **Notificaciones**: Expo Notifications
- **Animaciones**: React Native Reanimated
- **Salud**:
  - iOS: react-native-health (HealthKit)
  - Android: react-native-google-fit
- **Charts**: Victory Native
- **Calidad**: ESLint, Prettier, Husky

## 📁 Estructura del Proyecto

```
Virtual-hero/
├── app/                          # Navegación (Expo Router)
│   ├── _layout.tsx              # Root layout
│   ├── index.tsx                # Splash/redirect
│   └── (tabs)/                  # Navegación por tabs
│       ├── _layout.tsx
│       ├── index.tsx            # Home
│       ├── exercises/
│       │   ├── index.tsx        # Lista ejercicios
│       │   └── [id].tsx         # Detalle ejercicio
│       ├── achievements/
│       │   └── index.tsx        # Logros
│       └── profile/
│           └── index.tsx        # Perfil y config
│
├── src/
│   ├── theme/
│   │   ├── tokens.ts            # Design tokens
│   │   └── theme.ts             # Sistema de tema
│   ├── store/                   # Zustand stores
│   │   ├── useAppStore.ts       # XP, nivel, rachas, logros
│   │   ├── useHydration.ts      # Hidratación
│   │   ├── useSleep.ts          # Sueño
│   │   └── useSteps.ts          # Pasos
│   ├── lib/                     # Lógica de negocio
│   │   ├── healthkit.ts         # iOS HealthKit
│   │   ├── googleFit.ts         # Android Google Fit
│   │   ├── notifications.ts     # Notificaciones locales
│   │   ├── streaks.ts           # Sistema de rachas
│   │   └── xp.ts                # Sistema de XP
│   ├── db/
│   │   ├── schema.sql           # Schema SQLite
│   │   └── client.ts            # Cliente DB
│   ├── data/
│   │   └── exercises.json       # Catálogo de ejercicios
│   └── components/              # Componentes UI
│       ├── PanelCard.tsx
│       ├── SpeechBubble.tsx
│       ├── OnomatopoeiaBurst.tsx
│       ├── BadgeSticker.tsx
│       ├── StepsGauge.tsx
│       ├── WaterCounter.tsx
│       ├── SleepEnergyBar.tsx
│       ├── StreakBillboard.tsx
│       ├── ExerciseTile.tsx
│       ├── TimerChip.tsx
│       └── ConfettiPow.tsx
│
├── assets/                      # Assets estáticos
├── package.json
├── app.json                     # Configuración Expo
├── tsconfig.json
└── README.md
```

## 🚀 Instalación y Setup

### Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Para iOS: macOS con Xcode instalado
- Para Android: Android Studio con SDK configurado

### 1. Instalar Dependencias

```bash
npm install
# o
yarn install
```

### 2. Configurar Permisos Nativos (Prebuild)

```bash
# Generar carpetas nativas iOS/Android
npm run prebuild

# O con limpieza previa
npm run prebuild:clean
```

### 3. Configurar Google Fit (Android)

1. Crear proyecto en [Google Cloud Console](https://console.cloud.google.com)
2. Habilitar **Fitness API**
3. Crear credenciales OAuth 2.0 para Android
4. Descargar `google-services.json` y colocar en `android/app/`
5. Actualizar `app.json` con el package name correcto

**Nota**: Los scopes necesarios ya están configurados en `app.json`:

```json
"fitnessPermissions": ["Step count"]
```

### 4. Configurar HealthKit (iOS)

Ya configurado en `app.json` con:

- Entitlement de HealthKit
- Mensajes de permisos en `Info.plist`

Al ejecutar `prebuild`, Expo generará automáticamente:

- `ios/VirtualGiro/VirtualGiro.entitlements`
- Permisos en `Info.plist`

### 5. Assets Necesarios

Colocar en el directorio `assets/`:

```
assets/
├── icon.png              # 1024x1024 (icono app)
├── adaptive-icon.png     # 1024x1024 (Android adaptive)
├── splash.png            # 2048x2048 (splash screen)
├── favicon.png           # 48x48 (web)
└── notification-icon.png # 96x96 (notificaciones Android)
```

Puedes usar placeholders temporales o generar con herramientas como:

- [Icon Generator](https://easyappicon.com/)
- [Figma](https://www.figma.com/)

## 📱 Ejecutar la App

### Modo Desarrollo

```bash
# Iniciar Metro Bundler
npm run dev

# En iOS (requiere macOS)
npm run ios

# En Android
npm run android

# Web (preview limitado)
npm run web
```

### Desarrollo con Expo Go (Solo para pruebas básicas)

⚠️ **Limitación**: Expo Go **NO** soporta:

- HealthKit / Google Fit
- MMKV
- SQLite con configuraciones custom

Para desarrollo completo, usa **development build**:

```bash
# Crear development build
npx expo run:ios
npx expo run:android
```

## 🎯 Funcionalidades Implementadas

### ✅ MVP Completo

#### 1. Sistema de Progresión

- [x] XP y niveles con fórmula exponencial
- [x] Sistema de rachas (cumplir 2+ metas diarias)
- [x] 9 logros desbloqueables con recompensas
- [x] Persistencia con Zustand + MMKV

#### 2. Seguimiento de Salud

- [x] **Pasos**: Integración con HealthKit/Google Fit (stubs listos)
- [x] **Hidratación**: Contador de vasos con meta configurable
- [x] **Sueño**: Registro de minutos con metas personalizadas
- [x] Base de datos SQLite para historial

#### 3. Ejercicios

- [x] Catálogo con 25 ejercicios
- [x] Filtros por dificultad (fácil, medio, difícil)
- [x] Temporizador funcional
- [x] Sistema de recompensas al completar
- [x] Animación de celebración (confeti + POW!)

#### 4. Notificaciones

- [x] Recordatorios de hidratación programables
- [x] Notificaciones de logros
- [x] Alertas de racha y nivel
- [x] Configuración de quiet hours

#### 5. UI/UX

- [x] Tema cómic con paleta personalizada
- [x] Componentes con contornos gruesos y sombras offset
- [x] Gradientes héroe (morado → azul → verde)
- [x] Animaciones con Reanimated
- [x] Onomatopeyas y bocadillos de diálogo

## 🔧 Configuración y Variables

### Metas por Defecto

Puedes modificar en los stores respectivos:

**Pasos** (`src/store/useSteps.ts`):

```typescript
dailyGoalSteps: 8000;
```

**Hidratación** (`src/store/useHydration.ts`):

```typescript
dailyGoalML: 2000; // 8 vasos × 250ml
cupSizeML: 250;
reminderIntervalHours: 2;
```

**Sueño** (`src/store/useSleep.ts`):

```typescript
targetSleepMinutes: 480; // 8 horas
targetBedTime: '22:30';
targetWakeTime: '06:30';
```

### Tabla de Recompensas XP

Ver `src/lib/xp.ts`:

| Acción                       | XP                    |
| ---------------------------- | --------------------- |
| Alcanzar meta de pasos       | 50                    |
| Vaso de agua                 | 5                     |
| Meta de hidratación completa | 30                    |
| Dormir suficiente            | 40                    |
| Completar ejercicio          | 30 + XP del ejercicio |
| Misión del día               | 100                   |
| Bonus de racha               | 20                    |

### Sistema de Rachas

Regla: Cumplir **2 o más metas** (pasos/agua/sueño) O completar misión del día.

Ver `src/lib/streaks.ts` para personalizar.

## 🔨 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar Metro
npm run ios              # Correr en iOS
npm run android          # Correr en Android

# Build
npm run prebuild         # Generar código nativo
npm run prebuild:clean   # Regenerar desde cero

# Calidad de código
npm run lint             # ESLint
npm run lint:fix         # Auto-fix
npm run format           # Prettier
npm run format:check     # Verificar formato
npm run type-check       # TypeScript

# Testing (por configurar)
npm run test
```

## 📋 Checklist de QA

### Funcionalidad Core

- [ ] La app inicia sin errores
- [ ] Navegación entre tabs funciona correctamente
- [ ] Se puede agregar vasos de agua y actualiza el contador
- [ ] El temporizador de ejercicios funciona
- [ ] Se muestra animación de confeti al completar ejercicio
- [ ] La racha se actualiza correctamente

### Permisos

- [ ] Se solicitan permisos de notificaciones al iniciar
- [ ] Se pueden programar recordatorios de agua
- [ ] iOS: Permisos de HealthKit funcionan (en device)
- [ ] Android: Permisos de Google Fit funcionan (en device)

### Persistencia

- [ ] Los datos persisten al cerrar/reabrir la app
- [ ] El XP y nivel se mantienen
- [ ] Las metas configuradas se guardan

### UI/UX

- [ ] Los textos son legibles (contraste AA)
- [ ] Los botones tienen área táctil >= 44px
- [ ] Las animaciones son fluidas (60 fps)
- [ ] El tema cómic se aplica consistentemente

## 🚧 TODOs y Mejoras Futuras

### Integraciones de Salud

- [ ] Descomentar e implementar código de HealthKit (`src/lib/healthkit.ts`)
- [ ] Descomentar e implementar código de Google Fit (`src/lib/googleFit.ts`)
- [ ] Agregar lectura automática de pasos cada hora
- [ ] Sincronizar datos de sueño automáticamente

### Widgets

- [ ] Implementar widget Android con `react-native-android-widget`
- [ ] Implementar widget iOS con `react-native-widgetkit`
- [ ] Mostrar racha y pasos del día

### Backend (Fase 2)

- [ ] Crear API REST para sincronización
- [ ] Sistema de cuentas de usuario
- [ ] Ranking social y competencias
- [ ] Compartir logros en redes sociales

### Gamificación Avanzada

- [ ] Misiones diarias dinámicas
- [ ] Sistema de power-ups
- [ ] Personalización de avatar
- [ ] Tienda de recompensas

### Ejercicios

- [ ] Agregar GIFs/videos de demostración
- [ ] Rutinas personalizadas
- [ ] Planes de entrenamiento semanales
- [ ] Tracking de sets y repeticiones

### UX

- [ ] Onboarding interactivo
- [ ] Tutorial de primera vez
- [ ] Modo oscuro
- [ ] Sonidos y efectos de audio
- [ ] Animaciones Lottie para logros

## 🐛 Troubleshooting

### Error: "Cannot find module 'expo-linear-gradient'"

```bash
npx expo install expo-linear-gradient
```

### Error en iOS: "HealthKit not available"

1. Verificar que `app.json` tenga el entitlement configurado
2. Ejecutar `npm run prebuild:clean`
3. Abrir `ios/VirtualGiro.xcworkspace` en Xcode
4. Verificar que HealthKit esté habilitado en Capabilities

### Error en Android: "Google Fit not authorized"

1. Verificar OAuth configurado en Google Cloud Console
2. Asegurar que `google-services.json` esté en `android/app/`
3. Verificar package name coincida con el de Google Console
4. Ejecutar `cd android && ./gradlew clean`

### TypeScript Errors en Imports

Verificar que `tsconfig.json` tenga los paths configurados:

```json
"paths": {
  "@/*": ["./src/*"],
  "@components/*": ["./src/components/*"],
  ...
}
```

Y que `babel.config.js` tenga `module-resolver`.

### SQLite: "Database not initialized"

Asegurar que `initDatabase()` se llame en `app/_layout.tsx` antes de usar la DB.

## 📚 Recursos Adicionales

### Documentación

- [Expo Docs](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

### Assets y Diseño

- [Heroicons](https://heroicons.com/) - Iconos
- [Lottie Files](https://lottiefiles.com/) - Animaciones
- [Coolors](https://coolors.co/) - Paletas de color

### Permisos de Salud

- [HealthKit Docs](https://developer.apple.com/documentation/healthkit)
- [Google Fit API](https://developers.google.com/fit)

## 🤝 Contribuir

Este es un proyecto de ejemplo/plantilla. Siéntete libre de:

1. Fork el repositorio
2. Crear una rama (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto es de código abierto para propósitos educativos.

## 🙏 Créditos

Desarrollado con ❤️ usando React Native + Expo.

Estética inspirada en cómics clásicos de superhéroes.

---

**¡Conviértete en el héroe de tu propia historia! 🦸‍♂️💪**

¿Preguntas? Abre un issue en GitHub.
