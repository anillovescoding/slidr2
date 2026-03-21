"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isMounted, router]);

  if (!isMounted || !isAuthenticated) return null;

  return (
    <div className="h-full min-h-screen flex flex-col relative shrink-0 overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden h-full">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-slate-50 relative p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
