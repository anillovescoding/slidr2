"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, isMounted, router]);

  if (!isMounted || !isAuthenticated) return null;

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-background">
      <MobileNav />
      <Sidebar />
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
