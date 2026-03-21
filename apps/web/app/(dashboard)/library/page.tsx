"use client";

import { useEffect, useState, useCallback } from 'react';
import { Layers, FolderOpen } from 'lucide-react';
import { pb } from '@/lib/pocketbase';
import { CarouselCard } from '@/components/carousels/CarouselCard';
import { CreateCarouselDialog } from '@/components/carousels/CreateCarouselDialog';

interface CarouselRecord {
  id: string;
  title: string;
  status: 'draft' | 'completed';
  updated: string;
}

export default function LibraryPage() {
  const [carousels, setCarousels] = useState<CarouselRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCarousels = useCallback(async () => {
    setLoading(true);
    try {
      const records = await pb.collection('carousels').getFullList<CarouselRecord>({
        filter: `user_id = "${pb.authStore.record?.id}"`,
        sort: '-updated',
      });
      setCarousels(records);
    } catch (err) {
      console.error('Failed to fetch carousels', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCarousels();
  }, [fetchCarousels]);

  const handleDeleted = (id: string) => {
    setCarousels((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Library</h1>
          <p className="text-slate-500 mt-1">All your carousel projects in one place.</p>
        </div>
        <CreateCarouselDialog onCreated={fetchCarousels} />
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 h-28 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-16 mb-3" />
              <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : carousels.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="p-4 bg-slate-100 rounded-full mb-4">
            <FolderOpen className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">No carousels yet</h3>
          <p className="text-slate-400 text-sm mb-6">Create your first carousel to get started.</p>
          <CreateCarouselDialog onCreated={fetchCarousels} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {carousels.map((carousel) => (
            <CarouselCard
              key={carousel.id}
              carousel={carousel}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}

      {/* Count footer */}
      {!loading && carousels.length > 0 && (
        <div className="flex items-center gap-1.5 text-sm text-slate-400">
          <Layers className="w-4 h-4" />
          <span>{carousels.length} carousel{carousels.length !== 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  );
}
