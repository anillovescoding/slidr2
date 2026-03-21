import { create } from 'zustand';
import { RecordModel } from 'pocketbase';
import { pb } from '../lib/pocketbase';

interface AuthState {
  user: RecordModel | null;
  isAuthenticated: boolean;
  login: (user: RecordModel) => void;
  logout: () => void;
  sync: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: pb.authStore.record,
  isAuthenticated: pb.authStore.isValid,
  login: (user: RecordModel) => set({ user, isAuthenticated: true }),
  logout: () => {
    pb.authStore.clear();
    set({ user: null, isAuthenticated: false });
  },
  sync: () => set({
    user: pb.authStore.record,
    isAuthenticated: pb.authStore.isValid,
  }),
}));

// Listen to PocketBase updates automatically
if (typeof window !== 'undefined') {
  pb.authStore.onChange(() => {
    useAuthStore.getState().sync();
  });
}
