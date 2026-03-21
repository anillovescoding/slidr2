"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Loader2, Plus } from 'lucide-react';
import { pb } from '@/lib/pocketbase';

interface CreateCarouselDialogProps {
  onCreated?: () => void;
}

const DEFAULT_SLIDE = {
  id: 'slide-1',
  background: '#ffffff',
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
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors text-sm shadow-sm"
      >
        <Plus className="w-4 h-4" />
        New Carousel
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">New Carousel</h2>
                <p className="text-sm text-slate-500 mt-0.5">Give your project a name to get started.</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="carousel-title" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Title
                </label>
                <input
                  id="carousel-title"
                  ref={inputRef}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 5 tips for better sleep..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  disabled={loading}
                />
                {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
              </div>

              <div className="flex gap-3 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium rounded-lg transition-colors text-sm"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
