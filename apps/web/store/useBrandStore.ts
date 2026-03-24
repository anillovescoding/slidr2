import { create } from 'zustand';
import { RecordModel } from 'pocketbase';
import { pb } from '../lib/pocketbase';

interface BrandState {
  profile: RecordModel | null;
  isLoading: boolean;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Record<string, unknown>) => Promise<void>;
}

export const useBrandStore = create<BrandState>((set) => ({
  profile: null,
  isLoading: false,
  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const records = await pb.collection('profiles').getFullList({
        filter: `user_id = "${pb.authStore.record?.id}"`,
      });
      if (records.length > 0) {
        set({ profile: records[0] });
      }
    } catch (e) {
      console.error("Failed to fetch profile", e);
    } finally {
      set({ isLoading: false });
    }
  },
  updateProfile: async (data: Record<string, unknown>) => {
    const { profile } = useBrandStore.getState();
    set({ isLoading: true });
    try {
      if (profile) {
        const updated = await pb.collection('profiles').update(profile.id, data);
        set({ profile: updated });
      } else {
        const userId = pb.authStore.record?.id;
        if (userId) {
          const created = await pb.collection('profiles').create({ ...data, user_id: userId });
          set({ profile: created });
        }
      }
    } catch (e) {
      console.error("Failed to update profile", e);
      throw e;
    } finally {
      set({ isLoading: false });
    }
  }
}));
