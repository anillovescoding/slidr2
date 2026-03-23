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
    { label: 'All Projects', value: 'all'       },
    { label: 'Drafts',       value: 'draft'     },
    { label: 'Completed',    value: 'completed' },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Your Library</h1>
          <p className="text-foreground/40 mt-2 text-base font-medium">Manage and organize your creative projects.</p>
        </div>
        <CreateCarouselDialog onCreated={fetchCarousels} />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
          <input
            type="text"
            placeholder="Search your carousels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
          />
        </div>
        <div className="flex items-center gap-1.5 glass-dark border border-white/10 rounded-2xl p-1.5 overflow-x-auto no-scrollbar">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`whitespace-nowrap px-6 py-2.5 text-xs font-bold tracking-widest uppercase rounded-xl transition-all duration-300 ${
                filter === opt.value
                  ? 'bg-linear-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20'
                  : 'text-foreground/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-dark border border-white/5 rounded-[32px] p-6 h-48 animate-pulse">
              <div className="h-3 bg-white/5 rounded-full w-12 mb-4" />
              <div className="h-6 bg-white/5 rounded-full w-3/4 mb-3" />
              <div className="h-4 bg-white/5 rounded-full w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-[40px] py-16 px-8 text-center border border-white/5">
          <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6">
            <FolderOpen className="w-10 h-10 text-foreground/10" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-white mb-2">
            {search || filter !== 'all' ? 'No matches found' : 'Your library is empty'}
          </h3>
          <p className="text-foreground/40 text-base mb-8 max-w-sm mx-auto font-medium">
            {search || filter !== 'all' ? 'Try adjusting your search or filters to find what you&apos;re looking for.' : 'Time to start your first project! Create a carousel to see it here.'}
          </p>
          {!search && filter === 'all' && <CreateCarouselDialog onCreated={fetchCarousels} />}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((carousel) => (
              <CarouselCard key={carousel.id} carousel={carousel} onDeleted={handleDeleted} />
            ))}
          </div>
          <div className="flex items-center gap-2 px-4 py-3 glass-dark border border-white/5 rounded-2xl w-fit">
            <div className="flex items-center gap-2">
               <Layers className="w-4 h-4 text-primary" />
               <span className="text-xs font-bold text-white">{filtered.length}</span>
            </div>
            <span className="text-[10px] font-bold tracking-widest text-foreground/40 uppercase">of {carousels.length} Projects</span>
          </div>
        </div>
      )}
    </div>
  );
}
