"use client";

import { useState } from 'react';
import { Share2, X, Copy, CheckCheck, Loader2 } from 'lucide-react';
import { pb } from '@/lib/pocketbase';
import { useEditorStore } from '@/store/useEditorStore';

export function ShareDialog() {
  const { carouselId, save, isDirty } = useEditorStore();
  const [open, setOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleOpen = async () => {
    setOpen(true);
    if (shareUrl) return;
    setLoading(true);
    setError('');
    try {
      // Save first if there are unsaved changes
      if (isDirty) await save();

      // Check for existing share
      let share;
      try {
        const existing = await pb.collection('shares').getFirstListItem(
          `carousel_id = "${carouselId}"`
        );
        share = existing;
      } catch {
        // No existing share — create one
        share = await pb.collection('shares').create({ carousel_id: carouselId });
      }

      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      setShareUrl(`${origin}/carousel/${share.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create share link.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition-colors"
      >
        <Share2 className="w-3.5 h-3.5" />
        Share
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Share Carousel</h2>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
              </div>
            ) : error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-slate-500">Anyone with this link can view your carousel.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors"
                  >
                    {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {copied && <p className="text-xs text-emerald-600">Link copied!</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
