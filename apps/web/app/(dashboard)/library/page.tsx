"use client";

import { useEffect, useState, useCallback } from 'react';
import { FolderOpen, Search, Layers } from 'lucide-react';
import { pb } from '@/lib/pocketbase';
import { CarouselCard } from '@/components/carousels/CarouselCard';
import { CreateCarouselDialog } from '@/components/carousels/CreateCarouselDialog';

interface CarouselRecord {
  id: string;
  title: string;
  status: 'draft' | 'completed';
  updated: string;
}

type Filter = 'all' | 'draft' | 'completed';

export default function LibraryPage() {
  const [carousels, setCarousels] = useState<CarouselRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

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

  useEffect(() => { fetchCarousels(); }, [fetchCarousels]);

  const handleDeleted = (id: string) => setCarousels((prev) => prev.filter((c) => c.id !== id));

  const filtered = carousels
    .filter((c) => filter === 'all' || c.status === filter)
    .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));

  const filterOptions: { label: string; value: Filter }[] = [
    { label: 'All',       value: 'all'       },
    { label: 'Drafts',    value: 'draft'     },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Library</h1>
          <p className="text-slate-500 mt-0.5 text-sm">All your carousel projects in one place.</p>
        </div>
        <CreateCarouselDialog onCreated={fetchCarousels} />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search carousels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === opt.value
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 h-28 animate-pulse">
              <div className="h-3 bg-slate-100 rounded w-12 mb-3" />
              <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <FolderOpen className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">
            {search || filter !== 'all' ? 'No results found' : 'No carousels yet'}
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            {search || filter !== 'all' ? 'Try a different search or filter.' : 'Create your first carousel to get started.'}
          </p>
          {!search && filter === 'all' && <CreateCarouselDialog onCreated={fetchCarousels} />}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((carousel) => (
              <CarouselCard key={carousel.id} carousel={carousel} onDeleted={handleDeleted} />
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-400 pt-2">
            <Layers className="w-4 h-4" />
            <span>{filtered.length} of {carousels.length} carousel{carousels.length !== 1 ? 's' : ''}</span>
          </div>
        </>
      )}
    </div>
  );
}
