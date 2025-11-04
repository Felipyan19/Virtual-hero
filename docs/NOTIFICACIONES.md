# 🔔 Sistema de Notificaciones Push

## Descripción General

El sistema de notificaciones push de Virtual Hero ayuda a los usuarios a mantener hábitos saludables mediante recordatorios personalizables y motivadores.

## Tipos de Notificaciones Implementadas

### 1. 💧 Recordatorios de Hidratación

- **Frecuencia**: Cada 2 horas
- **Horario**: 8:00 AM - 10:00 PM
- **Objetivo**: Mantener una hidratación adecuada durante el día

### 2. 💪 Recordatorios de Ejercicio

- **Frecuencia**: 3 veces al día
- **Horarios**: 7:00 AM, 12:00 PM, 6:00 PM
- **Características especiales**:
  - Incluye 10 frases motivadoras diferentes
  - Cada notificación muestra una frase aleatoria para mantener la motivación
- **Frases motivadoras**:
  - "¡Es hora de mover el cuerpo, héroe! 💪"
  - "¡Tu cuerpo te lo agradecerá! Hora de ejercitarte 🏃"
  - "¡No hay excusas! Vamos a entrenar 🔥"
  - "¡El héroe que llevas dentro te está esperando! 🦸"
  - "¡Cada paso cuenta! Hora de tu entrenamiento ⚡"
  - "¡Tu yo del futuro te lo agradecerá! 🌟"
  - "¡Desafía tus límites! Es hora de ejercicio 💥"
  - "¡La consistencia es clave! Vamos a entrenar 🎯"
  - "¡Tu salud es tu mayor tesoro! Hora de moverte 💎"
  - "¡Los héroes entrenan todos los días! 🏋️"

### 3. 🌙 Recordatorio para Dormir

- **Frecuencia**: Una vez al día
- **Horario**: 10:00 PM
- **Objetivo**: Establecer un horario regular de sueño

### 4. 🧘 Recordatorios de Postura y Estiramientos

- **Frecuencia**: Cada hora
- **Horario**: 9:00 AM - 6:00 PM
- **Mensajes rotativos**:
  - Revisa tu postura
  - Hora de estirar
  - Postura correcta
  - Muévete un poco

### 5. 👁️ Recordatorios de Descanso Visual (Regla 20-20-20)

- **Frecuencia**: Cada 30 minutos
- **Horario**: 9:00 AM - 6:00 PM
- **Objetivo**: Prevenir fatiga visual en usuarios que trabajan con pantallas
- **Método**: Regla 20-20-20 (mirar algo a 6 metros de distancia por 20 segundos)
- **Nota**: Sin sonido para no interrumpir el trabajo

### 6. 🧘 Recordatorios de Meditación y Mindfulness

- **Frecuencia**: 2 veces al día
- **Horarios**: 8:00 AM y 8:00 PM
- **Objetivo**: Fomentar la práctica de meditación matutina y nocturna

### 7. 🥗 Recordatorios de Alimentación Saludable

- **Frecuencia**: 3 veces al día
- **Horarios**: 7:00 AM, 1:00 PM, 7:00 PM
- **Objetivo**: Recordar las comidas principales (desayuno, almuerzo, cena)

## Configuración

### Pantalla de Configuración

Los usuarios pueden acceder a la configuración de notificaciones desde:

1. Perfil → 🔔 Configurar Notificaciones

### Opciones Disponibles

- ✅ Activar/desactivar cada tipo de notificación individualmente
- 🔔 Activar todas las notificaciones con un botón
- 🔕 Desactivar todas las notificaciones con un botón
- 💾 Las preferencias se guardan automáticamente

## Características Técnicas

### Canales de Notificación (Android)

1. **Hidratación**: Importancia ALTA, color violeta
2. **Logros y Recompensas**: Importancia MÁXIMA, color verde
3. **Ejercicio**: Importancia ALTA, color naranja
4. **Salud**: Importancia PREDETERMINADA, color azul

### Persistencia

- Las configuraciones se guardan en AsyncStorage
- Las notificaciones se restauran automáticamente al iniciar la app
- Las notificaciones programadas sobreviven reinicios de la app

### Funciones Principales

```typescript
// Programar notificaciones individuales
scheduleWaterReminders(intervalHours);
scheduleExerciseReminders([hours]);
scheduleBedtimeReminder(hour);
schedulePostureReminders(intervalHours, startHour, endHour);
scheduleEyeRestReminders(intervalMinutes, startHour, endHour);
scheduleMeditationReminders([hours]);
scheduleHealthyEatingReminders([hours]);

// Gestión masiva
scheduleAllDefaultReminders(); // Activa todas con valores predeterminados
cancelAllHealthReminders(); // Cancela todas las de salud
clearAllNotifications(); // Cancela absolutamente todas

// Restauración
restoreNotificationsFromSettings(); // Restaura desde AsyncStorage
```

## Permisos

La app solicita permisos de notificación al iniciarse por primera vez. Los usuarios pueden:

- Conceder permisos inmediatamente
- Denegar permisos (las notificaciones no se mostrarán)
- Cambiar permisos posteriormente desde la configuración del sistema

## Mejoras Futuras Sugeridas

1. **Personalización de horarios**: Permitir a los usuarios configurar horarios específicos
2. **Frecuencia ajustable**: Configurar intervalos personalizados para cada tipo
3. **Sonidos personalizados**: Diferentes tonos para cada tipo de notificación
4. **Estadísticas**: Mostrar cuántas notificaciones se han completado
5. **Integración con logros**: Desbloquear logros por seguir notificaciones consistentemente
6. **Modo "No molestar"**: Desactivar temporalmente notificaciones
7. **Notificaciones basadas en ubicación**: Recordatorios cuando el usuario está en el gimnasio
8. **Notificaciones inteligentes**: Ajustar horarios basados en patrones de uso

## Notas de Desarrollo

- Las notificaciones usan `expo-notifications`
- Compatible con Android e iOS
- Las notificaciones locales no requieren servidor backend
- Los identificadores únicos permiten cancelación selectiva
- Las notificaciones repetitivas usan triggers basados en hora del día
