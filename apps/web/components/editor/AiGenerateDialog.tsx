"use client";

import { useState } from 'react';
import { Sparkles, X, Loader2, Wand2, Lightbulb } from 'lucide-react';
import { api } from '@/lib/api';
import { useEditorStore, makeSlide, Slide } from '@/store/useEditorStore';

export function AiGenerateDialog() {
  const { replaceSlides } = useEditorStore();
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [numSlides, setNumSlides] = useState(5);
  const [provider, setProvider] = useState('OpenAI');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    try {
      const result = await api.generate.carousel(topic.trim(), numSlides, provider);
      const slides: Slide[] = result.slides.map((s) =>
        makeSlide({
          title: s.title,
          body: s.body,
          layout: s.layout,
          bullets: s.bullets ?? [],
          quote: s.quote ?? '',
          author: s.author ?? '',
        })
      );
      replaceSlides(slides);
      setOpen(false);
      setTopic('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group relative inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 hover:border-primary/40 text-xs font-bold tracking-tight transition-all duration-300"
      >
        <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
        Magic Generate
        <div className="absolute inset-x-0 bottom-px h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setOpen(false)} />
          <div className="relative glass-dark border border-white/10 rounded-[40px] shadow-[0_0_80px_rgba(99,102,241,0.15)] w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="p-8 md:p-12 pb-6 border-b border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-5">
                <Sparkles className="w-32 h-32 text-primary" />
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                   <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    <p className="text-[10px] font-bold tracking-widest text-primary/60 uppercase">AI Orchestrator</p>
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Generate Carousel</h2>
                  <p className="text-foreground/40 mt-2 text-sm font-medium">Sit back while we craft your visual story.</p>
                </div>
                <button 
                  onClick={() => setOpen(false)} 
                  className="p-3 rounded-2xl hover:bg-white/5 text-foreground/20 hover:text-white transition-all duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="p-8 md:p-12 space-y-8 relative z-10">
              {/* Topic */}
              <div className="space-y-4">
                 <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-foreground/20" />
                    <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Initial Spark</label>
                  </div>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. 10 surprising facts about deep sea exploration"
                  autoFocus
                  className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-lg font-medium text-white placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 shadow-inner"
                  disabled={loading}
                />
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-foreground/20 uppercase tracking-tight ml-1">Length</label>
                  <input
                    type="number"
                    min={3}
                    max={15}
                    value={numSlides}
                    onChange={(e) => setNumSlides(Number(e.target.value))}
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-foreground/20 uppercase tracking-tight ml-1">AI Engine</label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 appearance-none cursor-pointer"
                    disabled={loading}
                  >
                    <option value="OpenAI">OpenAI (GTP-4o)</option>
                    <option value="Anthropic">Anthropic (Sonnet 3.5)</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-xs font-medium animate-in fade-in slide-in-from-top-2">
                   {error}
                </div>
              )}

              {/* Footer Actions */}
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
                  disabled={loading || !topic.trim()}
                  className="flex-[1.5] inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-linear-to-br from-primary to-secondary disabled:opacity-50 text-white font-bold rounded-[24px] shadow-lg shadow-primary/20 hover:shadow-primary/30 transform hover:scale-[1.02] transition-all duration-500 text-sm"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'Crafting Experience...' : 'Initiate Magic'}
                </button>
              </div>

              <div className="text-center">
                 <p className="text-[9px] font-bold text-foreground/20 uppercase tracking-[0.3em] bg-white/5 py-2 px-4 rounded-full w-fit mx-auto">Warning: This will overwrite current slides</p>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
