"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Loader2, Plus, Sparkles } from 'lucide-react';
import { pb } from '@/lib/pocketbase';

interface CreateCarouselDialogProps {
  onCreated?: () => void;
}

const DEFAULT_SLIDE = {
  id: 'slide-1',
  background: '#060e20',
  elements: [],
};

export function CreateCarouselDialog({ onCreated }: CreateCarouselDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else { setTitle(''); setError(''); }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) { setError('Please enter a title.'); return; }

    const userId = pb.authStore.record?.id;
    if (!userId) { setError('Not authenticated. Please log in again.'); return; }

    setLoading(true);
    setError('');
    try {
      const record = await pb.collection('carousels').create({
        title: trimmed,
        status: 'draft',
        user_id: userId,
        slides_data: [DEFAULT_SLIDE],
      });
      setOpen(false);
      onCreated?.();
      router.push(`/editor/${record.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create carousel.';
      console.error('Create carousel error:', err);
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 bg-linear-to-br from-primary to-secondary text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 text-sm tracking-tight"
      >
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        New Carousel
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setOpen(false)} />
          <div className="relative glass-dark border border-white/10 rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 md:p-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <p className="text-[10px] font-bold tracking-widest text-primary/60 uppercase">Create New</p>
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Project Title</h2>
                  <p className="text-foreground/40 mt-2 text-sm font-medium">What should we name your next masterpiece?</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-3 rounded-2xl hover:bg-white/5 text-foreground/20 hover:text-white transition-all duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <input
                    id="carousel-title"
                    ref={inputRef}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. My Viral SaaS Tips..."
                    className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-lg font-medium text-white placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                    disabled={loading}
                  />
                  {error && <p className="mt-3 text-sm font-medium text-red-400 pl-2">{error}</p>}
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex-1 px-8 py-4 text-sm font-bold text-foreground/60 hover:text-white hover:bg-white/5 rounded-2xl transition-all duration-200"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[1.5] inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-br from-primary to-secondary disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transform hover:scale-[1.02] transition-all duration-300 text-sm"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Initiating...' : 'Start Creating'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
