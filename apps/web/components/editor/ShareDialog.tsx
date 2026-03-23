"use client";

import { useState } from 'react';
import { Share2, X, Copy, CheckCheck, Loader2, Globe, Link2 } from 'lucide-react';
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
        className="hidden md:inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-white/5 text-foreground/60 hover:text-white hover:bg-white/5 text-xs font-bold tracking-tight transition-all"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setOpen(false)} />
          <div className="relative glass-dark border border-white/10 rounded-[40px] shadow-[0_0_80px_rgba(99,102,241,0.15)] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="p-10 pb-6 border-b border-white/5">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-primary animate-pulse" />
                    <p className="text-[10px] font-bold tracking-widest text-primary/60 uppercase">Visibility</p>
                  </div>
                 <button 
                  onClick={() => setOpen(false)} 
                  className="p-2 rounded-xl hover:bg-white/5 text-foreground/20 hover:text-white transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Share Carousel</h2>
            </div>

            <div className="p-10 space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                    <Loader2 className="w-10 h-10 animate-spin text-primary relative z-10" />
                  </div>
                  <p className="text-xs font-bold text-foreground/20 uppercase tracking-[0.2em]">Synchronizing Presence...</p>
                </div>
              ) : error ? (
                <div className="p-6 rounded-2xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm font-medium">
                  {error}
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <p className="text-foreground/40 text-sm font-medium leading-relaxed">
                    Deploy your creation to the world. Anyone with this unique identifier can witness your masterpiece.
                  </p>
                  
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 mb-2">
                      <Link2 className="w-3.5 h-3.5 text-foreground/20" />
                      <label className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest">Global Resource Locator</label>
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        readOnly
                        value={shareUrl}
                        className="flex-1 px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-foreground/60 focus:outline-none"
                      />
                      <button
                        onClick={handleCopy}
                        className={`px-5 py-4 rounded-2xl transition-all duration-500 transform active:scale-95 ${
                          copied 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                          : 'bg-linear-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20 hover:shadow-primary/30'
                        }`}
                      >
                        {copied ? <CheckCheck className="w-5 h-5 animate-in zoom-in" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  {copied && (
                    <div className="flex items-center justify-center gap-2 py-2 animate-in slide-in-from-top-2 duration-300">
                       <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                       <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Identity Copied to Clipboard</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 bg-white/5 border-t border-white/5 text-center">
               <p className="text-[9px] font-bold text-foreground/20 uppercase tracking-[0.3em]">Encrypted Session Token Active</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
