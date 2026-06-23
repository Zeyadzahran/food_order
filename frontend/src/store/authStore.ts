import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  getMe: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      clearError: () => set({ error: null }),
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post('/auth/login', credentials);
          if (res.data.success) {
            set({
              user: res.data.data.user,
              token: res.data.data.token,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post('/auth/register', userData);
          if (res.data.success) {
            set({
              user: res.data.data.user,
              token: res.data.data.token,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Registration failed',
            isLoading: false,
          });
          throw error;
        }
      },
      getMe: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            set({ user: res.data.data });
          }
        } catch (error) {
          get().logout();
        }
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
