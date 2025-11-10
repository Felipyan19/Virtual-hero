# 📱 Guía de Build - Virtual Hero

Esta guía te explica cómo crear un build de la aplicación Virtual Hero para poder descargarla e instalarla.

## 🚀 Opciones de Build

### 1. Build de Preview (Recomendado para Pruebas)

Este build genera un **APK** que puedes descargar e instalar directamente en cualquier dispositivo Android.

#### Pasos:

1. **Instalar EAS CLI** (si no lo tienes instalado):

```bash
npm install -g eas-cli
```

2. **Iniciar sesión en tu cuenta de Expo**:

```bash
eas login
```

3. **Generar el build de Android**:

```bash
npm run build:preview
```

O directamente:

```bash
eas build --platform android --profile preview
```

4. **Esperar el build**: El proceso tomará entre 10-20 minutos. Una vez completado, recibirás un enlace para descargar el APK.

5. **Descargar e instalar**:
   - Abre el enlace en tu dispositivo Android
   - Descarga el APK
   - Instala el APK (necesitarás permitir instalación desde fuentes desconocidas)

---

### 2. Build de Producción

Este build genera un **AAB** (Android App Bundle) optimizado para subir a Google Play Store.

#### Para Android:

```bash
npm run build:prod:android
```

#### Para iOS:

```bash
npm run build:prod:ios
```

#### Para ambas plataformas:

```bash
npm run build:prod
```

---

## 📝 Notas Importantes

### Perfiles de Build Disponibles

Tu proyecto tiene 3 perfiles configurados en `eas.json`:

1. **development**: Build de desarrollo con cliente de desarrollo (requiere Expo Go o custom development client)
2. **preview**: Build interno, ideal para pruebas. Genera APK instalable directamente
3. **production**: Build para las tiendas de aplicaciones

### Requisitos Previos

- ✅ Cuenta de Expo (gratis en https://expo.dev)
- ✅ EAS CLI instalado globalmente
- ✅ Conexión a internet estable

### Tiempo Estimado

- **Primera vez**: 15-20 minutos (incluye instalación de dependencias)
- **Builds subsecuentes**: 10-15 minutos

---

## 🔍 Verificar el Estado del Build

Puedes verificar el estado de tus builds en:

- CLI: `eas build:list`
- Web: https://expo.dev/accounts/felipyan199/projects/virtual-hero/builds

---

## 🐛 Solución de Problemas

### Error: "No EAS project configured"

```bash
eas init
```

### Error de credenciales de Android/iOS

```bash
eas credentials
```

### Build fallido

Revisa los logs en el dashboard de Expo o ejecuta:

```bash
eas build:list
```

---

## 💡 Alternativa: Build Local (Avanzado)

Si prefieres hacer un build local (más rápido pero requiere más configuración):

### Android:

1. Generar archivos nativos:

```bash
npm run prebuild:clean
```

2. Build local:

```bash
npm run android
```

O si tienes Android Studio configurado:

```bash
cd android && ./gradlew assembleRelease
```

El APK estará en: `android/app/build/outputs/apk/release/app-release.apk`

### iOS (Solo en macOS):

```bash
npm run prebuild:clean
npm run ios
```

---

## 📦 Resumen Rápido

**Para un APK instalable en Android:**

```bash
npm install -g eas-cli
eas login
npm run build:preview
```

**Para publicar en tiendas:**

```bash
npm run build:prod
```

---

## 🎯 Información del Proyecto

- **Nombre**: Virtual Hero
- **Package**: com.virtualhero.virtualhero
- **Versión**: 1.0.0
- **Owner**: felipyan199
- **Project ID**: 3f2133e1-0ad7-4059-b7bf-0ec4973939f3
