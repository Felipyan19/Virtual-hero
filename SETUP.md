# 🚀 Setup Rápido - Virtual Hero

Guía paso a paso para poner en marcha el proyecto.

## ✅ Pre-requisitos

Antes de comenzar, asegúrate de tener instalado:

- [ ] Node.js >= 18.0.0 ([Descargar](https://nodejs.org/))
- [ ] npm >= 9.0.0 (viene con Node)
- [ ] Git ([Descargar](https://git-scm.com/))

### Para iOS:

- [ ] macOS (requerido)
- [ ] Xcode >= 14 ([Mac App Store](https://apps.apple.com/app/xcode/id497799835))
- [ ] Xcode Command Line Tools: `xcode-select --install`
- [ ] CocoaPods: `sudo gem install cocoapods`

### Para Android:

- [ ] Android Studio ([Descargar](https://developer.android.com/studio))
- [ ] Android SDK >= 33
- [ ] Java JDK 17

## 📦 Paso 1: Clonar e Instalar

```bash
# Clonar repositorio (o usar el código existente)
cd Virtual-hero

# Instalar dependencias
npm install

# O con Yarn
yarn install
```

**Tiempo estimado**: 2-3 minutos

## 🔧 Paso 2: Configurar Variables

```bash
# Copiar ejemplo de env (opcional para MVP)
cp .env.example .env

# Editar valores si necesario
# nano .env
```

**Nota**: Para el MVP, las variables por defecto funcionan sin necesidad de editar.

## 📱 Paso 3: Generar Código Nativo

```bash
# Generar carpetas iOS y Android
npm run prebuild

# Esto creará:
# - ios/ con proyecto Xcode
# - android/ con proyecto Android Studio
```

**Tiempo estimado**: 1-2 minutos

### Si hay errores:

```bash
# Limpiar y regenerar
npm run prebuild:clean
```

## 🎨 Paso 4: Agregar Assets (Temporal)

Para desarrollo, puedes usar placeholders:

```bash
# Crear iconos básicos (1024x1024 con fondo morado #6D28D9)
# Puedes usar herramientas online como:
# - https://easyappicon.com/
# - https://appicon.co/

# Colocar en:
# assets/icon.png
# assets/adaptive-icon.png
# assets/splash.png
# assets/favicon.png
# assets/notification-icon.png
```

**Opción rápida**: Descargar iconos de ejemplo de [Figma Community](https://www.figma.com/community) con tema superhéroes.

## ▶️ Paso 5: Iniciar la App

### Opción A: iOS (requiere macOS)

```bash
# Terminal 1: Iniciar Metro
npm run dev

# Terminal 2: Correr en iOS
npm run ios

# O directamente
npx expo run:ios
```

**Primera vez**: Demorará más (compila dependencias nativas).

### Opción B: Android

```bash
# Abrir emulador de Android Studio primero
# O conectar dispositivo físico con USB debugging

# Terminal 1: Metro
npm run dev

# Terminal 2: Correr en Android
npm run android

# O directamente
npx expo run:android
```

### Opción C: Web (Preview limitado)

```bash
npm run web
```

⚠️ **Limitación**: Web no soporta todas las features nativas (HealthKit, Google Fit, SQLite, MMKV).

## ✅ Paso 6: Verificar Funcionamiento

Una vez que la app corra, verifica:

1. [ ] **Home cargó** con gradiente morado-azul-verde
2. [ ] **Puedes navegar** entre tabs (Home, Ejercicios, Logros, Perfil)
3. [ ] **Agregar vaso de agua** funciona y actualiza contador
4. [ ] **Abrir un ejercicio** y ver temporizador
5. [ ] **Completar ejercicio** muestra confeti + POW!
6. [ ] **Ver logros** en la pantalla de achievements

Si todo funciona: **¡Proyecto listo! 🎉**

## 🔐 Paso 7: Configurar Permisos (Opcional para MVP)

### iOS HealthKit

1. Abrir `ios/VirtualHero.xcworkspace` en Xcode
2. Seleccionar el target VirtualHero
3. Ir a "Signing & Capabilities"
4. Agregar capability: **HealthKit**
5. Verificar que `VirtualHero.entitlements` se creó

### Android Google Fit

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear proyecto nuevo
3. Habilitar **Fitness API**
4. Crear credenciales OAuth 2.0 para Android
5. Descargar `google-services.json`
6. Colocar en `android/app/google-services.json`

**Para desarrollo**: Puedes omitir esto y usar datos dummy.

## 🧪 Paso 8: Configurar Husky (Git Hooks)

```bash
# Instalar Husky
npm run prepare

# Hacer pre-commit ejecutable (Unix/Mac)
chmod +x .husky/pre-commit
```

Ahora cada commit ejecutará automáticamente:

- ESLint
- Prettier
- Type checking

## 🐛 Troubleshooting Común

### Error: "Metro bundler can't find module"

```bash
# Limpiar caché
npx expo start --clear
```

### Error: "Unable to resolve module @/theme/theme"

```bash
# Reinstalar dependencias
rm -rf node_modules
npm install
npm run prebuild:clean
```

### Error iOS: "Command PhaseScriptExecution failed"

```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### Error Android: "SDK location not found"

Crear `android/local.properties`:

```properties
sdk.dir=/Users/TU_USUARIO/Library/Android/sdk
# o en Windows:
# sdk.dir=C:\\Users\\TU_USUARIO\\AppData\\Local\\Android\\Sdk
```

### TypeScript: "Cannot find module 'react-native-mmkv'"

```bash
# Reinstalar tipos
npm install --save-dev @types/react-native
```

## 📊 Verificar Instalación

```bash
# Verificar versiones
node --version    # Debe ser >= 18
npm --version     # Debe ser >= 9

# Verificar Expo CLI
npx expo --version

# Verificar TypeScript
npx tsc --version
```

## 🎯 Próximos Pasos

Después del setup:

1. **Personalizar**: Editar metas en `src/store/`
2. **Agregar ejercicios**: Modificar `src/data/exercises.json`
3. **Integrar salud real**: Descomentar código en `src/lib/healthkit.ts` y `googleFit.ts`
4. **Personalizar tema**: Ajustar colores en `src/theme/tokens.ts`
5. **Agregar assets**: Reemplazar placeholders con diseños finales

## 📚 Recursos Útiles

- [Documentación Expo](https://docs.expo.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [React Native Docs](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 💡 Tips

### Desarrollo más rápido:

```bash
# Modo tunnel (compartir con otros devices)
npx expo start --tunnel

# Limpiar todo y empezar fresh
rm -rf node_modules ios android
npm install
npm run prebuild
```

### Debug:

```bash
# Ver logs detallados iOS
npx react-native log-ios

# Ver logs detallados Android
npx react-native log-android

# Debug con Flipper
npx expo install react-native-flipper
```

### Producción:

```bash
# Build con EAS (Expo Application Services)
npm install -g eas-cli
eas login
eas build --platform ios
eas build --platform android
```

## ✨ ¡Listo para Desarrollar!

El proyecto está configurado y listo para correr.

**Siguiente**: Lee `README.md` para documentación completa de funcionalidades.

---

**¿Problemas?** Abre un issue o consulta la sección Troubleshooting del README.

¡Feliz coding! 🦸‍♂️💪
