/**
 * Root Layout - Configuración global de la app
 */

import { useEffect, useState } from 'react';
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

const queryClient = new QueryClient();

function NavigationHandler({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
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
