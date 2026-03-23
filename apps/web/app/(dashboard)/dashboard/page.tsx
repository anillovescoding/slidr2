"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { pb } from '@/lib/pocketbase';
import { CarouselCard } from '@/components/carousels/CarouselCard';
import { CreateCarouselDialog } from '@/components/carousels/CreateCarouselDialog';
import { ArrowRight, Layers, FileEdit, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface CarouselRecord {
  id: string;
  title: string;
  status: 'draft' | 'completed';
  updated: string;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [allCarousels, setAllCarousels] = useState<CarouselRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCarousels = useCallback(async () => {
    setLoading(true);
    try {
      const records = await pb.collection('carousels').getFullList<CarouselRecord>({
        filter: `user_id = "${pb.authStore.record?.id}"`,
        sort: '-updated',
      });
      setAllCarousels(records);
    } catch (err) {
      console.error('Failed to fetch carousels', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCarousels(); }, [fetchCarousels]);

  const handleDeleted = (id: string) => setAllCarousels((prev) => prev.filter((c) => c.id !== id));

  const displayName = user?.name || user?.email?.split('@')[0] || 'there';
  const recent = allCarousels.slice(0, 4);
  const draftCount = allCarousels.filter((c) => c.status === 'draft').length;
  const doneCount = allCarousels.filter((c) => c.status === 'completed').length;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <p className="text-xs font-bold tracking-widest text-primary/60 uppercase">{today}</p>
          </div>
          <h1 className="text-4xl font-serif font-bold text-white tracking-tight">
            Welcome back, <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{displayName}</span>
          </h1>
          <p className="text-foreground/40 mt-2 text-base font-medium">Design your next masterpiece with Slidr&apos;s AI.</p>
        </div>
        <CreateCarouselDialog onCreated={fetchCarousels} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Total Carousels', value: allCarousels.length, Icon: Layers,       color: 'text-primary'    },
          { label: 'In Draft',        value: draftCount,          Icon: FileEdit,      color: 'text-amber-400'  },
          { label: 'Completed',       value: doneCount,           Icon: CheckCircle2,  color: 'text-emerald-400'},
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className="glass-dark rounded-3xl p-6 flex items-center gap-5 transition-all duration-300 hover:bg-white/5 group border border-white/5">
            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-white">{loading ? '—' : value}</p>
              <p className="text-sm font-medium text-foreground/40">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-white">Recent Projects</h2>
          <Link href="/library" className="group inline-flex items-center gap-2 text-sm text-primary hover:text-secondary transition-colors font-semibold">
            Explore Library <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-dark border border-white/5 rounded-3xl p-6 h-40 animate-pulse">
                <div className="h-3 bg-white/5 rounded-full w-12 mb-4" />
                <div className="h-6 bg-white/5 rounded-full w-3/4 mb-3" />
                <div className="h-4 bg-white/5 rounded-full w-1/2" />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="glass rounded-[40px] p-20 text-center border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-6 border border-white/5 animate-bounce-slow">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-white mb-2 tracking-tight">Start your creative journey</h3>
            <p className="text-foreground/40 text-base mb-8 max-w-sm mx-auto font-medium">Create your first carousel and let our AI handle the heavy lifting.</p>
            <CreateCarouselDialog onCreated={fetchCarousels} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recent.map((carousel) => (
              <CarouselCard key={carousel.id} carousel={carousel} onDeleted={handleDeleted} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
