/**
 * Root Layout - Configuración global de la app
 */

import { useEffect, useState, useRef } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initDatabase } from '@/db/client';
import {
  requestNotificationPermissions,
  restoreNotificationsFromSettings,
} from '@/lib/notifications';
import { initSounds } from '@/lib/sounds';
import { SplashScreen } from '@/components/SplashScreen';
import { AchievementUnlocked } from '@/components/AchievementUnlocked';
import { LevelUpOverlay } from '@/components/LevelUpOverlay';
import { useAuth } from '@/store/useAuth';
import { useAppStore } from '@/store/useAppStore';
import { useEventStore } from '@/store/useEventStore';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Notifications from 'expo-notifications';

const queryClient = new QueryClient();

function NavigationHandler({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && inAuthGroup) {
      // Si no está autenticado y está en tabs, redirigir a login
      router.replace('/login');
    } else if (isAuthenticated && segments[0] === 'login') {
      // Si está autenticado y está en login, redirigir a tabs
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    ...MaterialCommunityIcons.font,
  });
  const router = useRouter();

  // Event listeners para celebraciones
  const soundEnabled = useAppStore((state) => state.soundEnabled);
  const levelUpEvent = useEventStore((state) => state.levelUpEvent);
  const achievementEvent = useEventStore((state) => state.achievementEvent);
  const clearLevelUpEvent = useEventStore((state) => state.clearLevelUpEvent);
  const clearAchievementEvent = useEventStore((state) => state.clearAchievementEvent);

  useEffect(() => {
    // Inicializar DB y permisos
    const init = async () => {
      try {
        await initDatabase();
        console.log('[App] Base de datos inicializada');

        // Inicializar sistema de audio
        await initSounds();
        console.log('[App] Sistema de audio inicializado');

        // Intentar inicializar notificaciones (opcional)
        try {
          await requestNotificationPermissions();
          // Restaurar notificaciones programadas basadas en configuración guardada
          // Nota: restoreNotificationsFromSettings() tiene protección interna contra
          // ejecuciones múltiples (flag global + timestamp persistente) para evitar
          // notificaciones duplicadas especialmente durante Hot Reload o reaperturas de la app
          await restoreNotificationsFromSettings();
          console.log('[App] Notificaciones inicializadas y restauradas');
        } catch (notifError) {
          console.warn('[App] Notificaciones no disponibles:', notifError);
        }

        console.log('[App] Inicialización completada');
        setIsReady(true);
      } catch (error) {
        console.error('[App] Error en inicialización:', error);
        setIsReady(true); // Continuar incluso si hay error
      }
    };

    init();
  }, []);

  // Listener para manejar clics en notificaciones
  const isAuthenticatedForNotifications = useAuth((state) => state.isAuthenticated);
  useEffect(() => {
    // Función para manejar la navegación según el tipo de notificación
    const handleNotificationNavigation = (data: any) => {
      if (!isAuthenticatedForNotifications) {
        console.log('[Notificaciones] Usuario no autenticado, ignorando navegación');
        return;
      }

      const { type } = data;

      switch (type) {
        case 'water_reminder':
        case 'exercise_reminder':
        case 'bedtime_reminder':
        case 'posture_reminder':
        case 'eye_rest_reminder':
        case 'meditation_reminder':
        case 'meal_reminder':
          // Redirigir a la pantalla principal de ejercicios
          router.push('/(tabs)/exercises');
          break;

        case 'achievement':
          // Redirigir a la pantalla de logros
          router.push('/(tabs)/profile/achievements');
          break;

        case 'level_up':
          // Redirigir al perfil donde se muestra el nivel
          router.push('/(tabs)/profile');
          break;

        case 'streak':
          // Redirigir a la pantalla principal
          router.push('/(tabs)');
          break;

        default:
          // Si no se reconoce el tipo, abrir la app en la pantalla principal
          router.push('/(tabs)');
          break;
      }
    };

    // Listener para cuando el usuario presiona una notificación
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const { data } = response.notification.request.content;
      console.log('[Notificaciones] Notificación presionada:', data);

      // Navegar según el tipo de notificación
      handleNotificationNavigation(data);
    });

    return () => {
      subscription.remove();
    };
  }, [isAuthenticatedForNotifications, router]);

  if (!isReady || !fontsLoaded || showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <NavigationHandler>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
        </NavigationHandler>

        {/* Overlays globales de celebración */}
        <LevelUpOverlay
          level={levelUpEvent?.newLevel || null}
          visible={levelUpEvent !== null}
          soundEnabled={soundEnabled}
          onClose={clearLevelUpEvent}
        />
        <AchievementUnlocked
          achievement={achievementEvent?.achievement || null}
          visible={achievementEvent !== null}
          soundEnabled={soundEnabled}
          onClose={clearAchievementEvent}
        />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
