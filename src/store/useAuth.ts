/**
 * Auth Store - Gestión de autenticación de usuarios
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authenticateUser, getUserById, User } from '@/db/client';

export interface AuthState {
  // Estado de autenticación
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Acciones
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,

      // Login
      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const user = await authenticateUser(username, password);

          if (user) {
            set({
              isAuthenticated: true,
              user: {
                ...user,
                password: '', // No guardar password en el store
              },
              isLoading: false,
              error: null,
            });
            console.log('[Auth] Login exitoso:', user.username);
            return true;
          } else {
            set({
              isAuthenticated: false,
              user: null,
              isLoading: false,
              error: 'Usuario o contraseña incorrectos',
            });
            console.log('[Auth] Login fallido');
            return false;
          }
        } catch (error) {
          console.error('[Auth] Error en login:', error);
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: 'Error al iniciar sesión',
          });
          return false;
        }
      },

      // Logout
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          error: null,
        });
        console.log('[Auth] Logout exitoso');
      },

      // Verificar autenticación
      checkAuth: async () => {
        const state = get();
        if (state.user?.id) {
          try {
            const user = await getUserById(state.user.id);
            if (user) {
              set({
                isAuthenticated: true,
                user: {
                  ...user,
                  password: '', // No guardar password en el store
                },
              });
            } else {
              set({ isAuthenticated: false, user: null });
            }
          } catch (error) {
            console.error('[Auth] Error al verificar autenticación:', error);
            set({ isAuthenticated: false, user: null });
          }
        }
      },

      // Limpiar error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'virtual-hero-auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
