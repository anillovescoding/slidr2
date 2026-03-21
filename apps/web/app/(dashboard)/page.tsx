"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { pb } from '@/lib/pocketbase';
import { CarouselCard } from '@/components/carousels/CarouselCard';
import { CreateCarouselDialog } from '@/components/carousels/CreateCarouselDialog';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CarouselRecord {
  id: string;
  title: string;
  status: 'draft' | 'completed';
  updated: string;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [recent, setRecent] = useState<CarouselRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecent = useCallback(async () => {
    setLoading(true);
    try {
      const records = await pb.collection('carousels').getList<CarouselRecord>(1, 3, {
        filter: `user_id = "${pb.authStore.record?.id}"`,
        sort: '-updated',
      });
      setRecent(records.items);
    } catch (err) {
      console.error('Failed to fetch recent carousels', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecent();
  }, [fetchRecent]);

  const handleDeleted = (id: string) => {
    setRecent((prev) => prev.filter((c) => c.id !== id));
  };

  const displayName = user?.name || user?.email?.split('@')[0] || 'there';

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome back, {displayName}
          </h1>
          <p className="text-slate-500 mt-1">Ready to create something great?</p>
        </div>
        <CreateCarouselDialog onCreated={fetchRecent} />
      </div>

      {/* Recent carousels */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-700">Recent Projects</h2>
          <Link
            href="/library"
            className="inline-flex items-center gap-1 text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 h-28 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-16 mb-3" />
                <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <p className="text-slate-500 text-sm mb-3">You have no recent projects.</p>
            <p className="text-slate-400 text-xs">Hit &quot;Create Carousel&quot; above to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recent.map((carousel) => (
              <CarouselCard
                key={carousel.id}
                carousel={carousel}
                onDeleted={handleDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
