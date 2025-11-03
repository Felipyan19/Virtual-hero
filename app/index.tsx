/**
 * Splash/Redirect Screen
 * Redirige automáticamente a tabs
 */

import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import theme from '@/theme/theme';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a tabs después de un momento
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return <View style={{ flex: 1, backgroundColor: theme.colors.primary }} />;
}
