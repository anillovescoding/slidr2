import PocketBase from 'pocketbase';

export const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL || 'http://127.0.0.1:8090');

// Avoids SSR hydration issues with local token injection
if (typeof window !== 'undefined') {
  pb.authStore.loadFromCookie(document.cookie);
  
  // Set up an auth listener to save cookie automatically
  pb.authStore.onChange(() => {
    document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
  });
}
