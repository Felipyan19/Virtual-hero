/**
 * Tabs Layout - Navegación por pestañas
 */

import { Tabs, useRouter, useSegments } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuth } from '@/store/useAuth';

interface TabIconProps {
  label: string;
  focused: boolean;
  iconType: 'home' | 'train' | 'trophy' | 'settings';
}

function TabIcon({ label, focused, iconType }: TabIconProps) {
  const iconColor = focused ? '#FFFFFF' : '#8A94A6';

  const renderIcon = () => {
    switch (iconType) {
      case 'home':
        return <Ionicons name="home-outline" size={22} color={iconColor} />;
      case 'train':
        return <MaterialCommunityIcons name="dumbbell" size={22} color={iconColor} />;
      case 'trophy':
        return <MaterialCommunityIcons name="trophy-outline" size={22} color={iconColor} />;
      case 'settings':
        return <MaterialCommunityIcons name="cog-outline" size={22} color={iconColor} />;
      default:
        return <Ionicons name="home-outline" size={22} color={iconColor} />;
    }
  };

  return (
    <View style={styles.tabIconContainer}>
      <View
        style={[
          styles.iconWrapper,
          focused ? styles.iconWrapperActive : styles.iconWrapperInactive,
        ]}
      >
        {renderIcon()}
      </View>
      <Text style={[styles.label, focused ? styles.labelActive : styles.labelInactive]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Redirigir a login si no está autenticado
    const inTabs = segments[0] === '(tabs)';

    if (!isAuthenticated && inTabs) {
      router.replace('/login');
    }
  }, [isAuthenticated, segments]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: '#283041',
          backgroundColor: '#1A1D29',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Inicio" focused={focused} iconType="home" />,
        }}
      />
      <Tabs.Screen
        name="exercises/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Entrenar" focused={focused} iconType="train" />
          ),
        }}
      />
      <Tabs.Screen
        name="achievements/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Logros" focused={focused} iconType="trophy" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Ajustes" focused={focused} iconType="settings" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 70,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    backgroundColor: '#06B6D4',
  },
  iconWrapperInactive: {
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 10,
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  labelActive: {
    color: '#06B6D4',
  },
  labelInactive: {
    color: '#8A94A6',
  },
});
