"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { pb } from '@/lib/pocketbase';
import { CarouselCard } from '@/components/carousels/CarouselCard';
import { CreateCarouselDialog } from '@/components/carousels/CreateCarouselDialog';
import { ArrowRight, Layers, FileEdit, CheckCircle2, Sparkles } from 'lucide-react';
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400 mb-1">{today}</p>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {displayName}</h1>
          <p className="text-slate-500 mt-1 text-sm">Here&apos;s an overview of your carousel projects.</p>
        </div>
        <CreateCarouselDialog onCreated={fetchCarousels} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Carousels', value: allCarousels.length, Icon: Layers,       bg: 'bg-indigo-50', color: 'text-indigo-600' },
          { label: 'In Draft',        value: draftCount,          Icon: FileEdit,      bg: 'bg-amber-50',  color: 'text-amber-500'  },
          { label: 'Completed',       value: doneCount,           Icon: CheckCircle2,  bg: 'bg-emerald-50',color: 'text-emerald-500'},
        ].map(({ label, value, Icon, bg, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{loading ? '—' : value}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-800">Recent Projects</h2>
          <Link href="/library" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 h-28 animate-pulse">
                <div className="h-3 bg-slate-100 rounded w-12 mb-3" />
                <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-xl p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="font-semibold text-slate-700 mb-1">No carousels yet</h3>
            <p className="text-slate-400 text-sm mb-5">Create your first carousel to get started.</p>
            <CreateCarouselDialog onCreated={fetchCarousels} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recent.map((carousel) => (
              <CarouselCard key={carousel.id} carousel={carousel} onDeleted={handleDeleted} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
