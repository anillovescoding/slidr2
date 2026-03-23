import PocketBase from 'pocketbase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PB_URL = process.env.EXPO_PUBLIC_PB_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(PB_URL);

// Disable auto-cancellation for React Native
pb.autoCancellation(false);

const AUTH_KEY = 'pb_auth';

// Load persisted auth on startup
export async function loadAuth() {
  try {
    const raw = await AsyncStorage.getItem(AUTH_KEY);
    if (raw) {
      const { token, model } = JSON.parse(raw);
      pb.authStore.save(token, model);
    }
  } catch (_) {}
}

// Persist auth whenever it changes
pb.authStore.onChange(() => {
  if (pb.authStore.isValid) {
    AsyncStorage.setItem(AUTH_KEY, JSON.stringify({
      token: pb.authStore.token,
      model: pb.authStore.record,
    }));
  } else {
    AsyncStorage.removeItem(AUTH_KEY);
  }
});
