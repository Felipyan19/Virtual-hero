/**
 * Root Layout - Configuración global de la app
 */

import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initDatabase } from '@/db/client';
import { requestNotificationPermissions } from '@/lib/notifications';
import { SplashScreen } from '@/components/SplashScreen';

const queryClient = new QueryClient();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Inicializar DB y permisos
    const init = async () => {
      try {
        await initDatabase();
        console.log('[App] Base de datos inicializada');

        // Intentar inicializar notificaciones (opcional)
        try {
          await requestNotificationPermissions();
          console.log('[App] Notificaciones inicializadas');
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

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
