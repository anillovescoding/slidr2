"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Library, Palette, Settings, Menu, X, Layers, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useAuthStore } from '../../store/useAuthStore';

const routes = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Library',   icon: Library,          href: '/library'   },
  { label: 'Brand',     icon: Palette,           href: '/brand'     },
  { label: 'Settings',  icon: Settings,          href: '/settings'  },
];

export function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      {/* Top Bar */}
      <div className="h-16 flex items-center justify-between px-6 bg-background/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <Link href="/dashboard" className="flex items-center gap-2.5 font-serif font-bold text-xl tracking-tight text-white">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Layers className="w-4 h-4 text-white" />
          </div>
          Slidr
        </Link>
        <div className="flex items-center gap-2">
           <ThemeToggle />
           <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 rounded-xl bg-white/5 text-foreground/60 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Fullscreen Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-16 animate-in slide-in-from-top duration-300">
          <nav className="p-6 space-y-2">
            {routes.map((route) => {
              const active = pathname === route.href;
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`flex items-center gap-4 px-6 py-5 rounded-3xl text-lg font-bold transition-all duration-300 ${
                    active
                      ? 'bg-primary/10 text-primary shadow-inner shadow-primary/10'
                      : 'text-foreground/40 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <route.icon className={`w-6 h-6 ${active ? 'text-primary' : 'text-foreground/20'}`} />
                  {route.label}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-8 border-t border-white/5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-bold text-lg">
                {(user?.name || user?.email || 'U')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-white font-bold">{user?.name || user?.email?.split('@')[0] || 'User'}</p>
                <p className="text-xs text-foreground/40">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-3 py-5 rounded-[24px] bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
