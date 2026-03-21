import { redirect } from 'next/navigation';

export default function Home() {
  // Since we rely on a client-side Zustand store for Auth state, 
  // we will direct users to the dashboard. The dashboard layout 
  // is protected and will redirect unauthenticated users to /login.
  redirect('/dashboard');
}
