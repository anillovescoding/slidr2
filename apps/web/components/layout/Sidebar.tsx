"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import { LayoutDashboard, Library, Palette, Settings, LogOut, Layers } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const routes = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Library',   icon: Library,          href: '/library'   },
  { label: 'Brand',     icon: Palette,           href: '/brand'     },
  { label: 'Settings',  icon: Settings,          href: '/settings'  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const initials = (user?.name || user?.email || 'U')[0].toUpperCase();
  const displayName = user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <aside className="w-64 hidden md:flex flex-col bg-sidebar-bg shrink-0 h-full border-r border-white/5">
      {/* Logo */}
      <div className="h-20 flex items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="font-serif font-bold text-2xl tracking-tight text-white">Slidr</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {routes.map((route) => {
          const active = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5'
                  : 'text-foreground/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <route.icon className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-primary' : 'text-foreground/40'}`} />
              {route.label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-4 pb-6 pt-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl glass-dark hover:bg-white/5 transition-all duration-300">
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{displayName}</p>
            <p className="text-[11px] text-foreground/40 font-medium truncate">{user?.email}</p>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <ThemeToggle />
            <button
              onClick={logout}
              className="p-2.5 rounded-xl hover:bg-red-500/10 text-foreground/40 hover:text-red-400 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
