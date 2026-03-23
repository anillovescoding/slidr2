import { create } from 'zustand';
import { pb } from '../lib/pocketbase';

interface AuthState {
  user: Record<string, unknown> | null;
  isAuthenticated: boolean;
  login: (user: Record<string, unknown>) => void;
  logout: () => void;
  sync: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: pb.authStore.record as Record<string, unknown> | null,
  isAuthenticated: pb.authStore.isValid,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => {
    pb.authStore.clear();
    set({ user: null, isAuthenticated: false });
  },
  sync: () => set({
    user: pb.authStore.record as Record<string, unknown> | null,
    isAuthenticated: pb.authStore.isValid,
  }),
}));

pb.authStore.onChange(() => {
  useAuthStore.getState().sync();
});
