"use client";

import { useState } from 'react';
import { Sparkles, X, Loader2, Wand2, Lightbulb, ChevronDown } from 'lucide-react';
import { api } from '@/lib/api';
import { useEditorStore, makeSlide, Slide } from '@/store/useEditorStore';

const AI_ENGINES = [
  { value: 'OpenAI',    label: 'OpenAI',    model: 'GPT-4o' },
  { value: 'Anthropic', label: 'Anthropic', model: 'Claude 3.5 Sonnet' },
  { value: 'Gemini',    label: 'Google',    model: 'Gemini 1.5 Pro' },
];

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
      setError(err instanceof Error ? err.message : 'Generation failed. Ensure the API backend is running and your key is configured in Settings.');
    } finally {
      setLoading(false);
    }
  };

  const selectedEngine = AI_ENGINES.find((e) => e.value === provider) ?? AI_ENGINES[0];

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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => !loading && setOpen(false)}
          />

          {/* Modal */}
          <div className="relative glass-dark border border-white/10 rounded-[32px] shadow-[0_0_80px_rgba(99,102,241,0.2)] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="px-8 pt-8 pb-6 border-b border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-5">
                <Sparkles className="w-32 h-32 text-primary" />
              </div>
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    <p className="text-[10px] font-bold tracking-widest text-primary/60 uppercase">AI Orchestrator</p>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Generate Carousel</h2>
                  <p className="text-foreground/40 mt-1 text-sm font-medium">Describe your topic and we&apos;ll craft the slides.</p>
                </div>
                <button
                  onClick={() => !loading && setOpen(false)}
                  className="p-2.5 rounded-2xl hover:bg-white/5 text-foreground/20 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="px-8 py-6 space-y-6">
              {/* Topic */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-foreground/20" />
                  <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Topic</label>
                </div>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. 10 surprising facts about deep sea exploration"
                  autoFocus
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-base font-medium text-white placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  disabled={loading}
                />
              </div>

              {/* Options row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Slide count */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-foreground/20 uppercase tracking-tight ml-1">Slides (3–15)</label>
                  <input
                    type="number"
                    min={3}
                    max={15}
                    value={numSlides}
                    onChange={(e) => setNumSlides(Number(e.target.value))}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    disabled={loading}
                  />
                </div>

                {/* AI Engine */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-foreground/20 uppercase tracking-tight ml-1">AI Engine</label>
                  <div className="relative">
                    <select
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer pr-10"
                      disabled={loading}
                    >
                      {AI_ENGINES.map((eng) => (
                        <option key={eng.value} value={eng.value} className="bg-surface text-white">
                          {eng.label} — {eng.model}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Selected engine info */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-primary/5 border border-primary/10 rounded-xl">
                <Sparkles className="w-3.5 h-3.5 text-primary/60" />
                <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                  Using {selectedEngine.label} · {selectedEngine.model}
                </span>
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-xs font-medium animate-in fade-in">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 px-6 py-3.5 text-sm font-bold text-foreground/60 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !topic.trim()}
                  className="flex-[1.5] inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-linear-to-br from-primary to-secondary disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transform hover:scale-[1.02] transition-all text-sm"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'Generating...' : 'Initiate Magic'}
                </button>
              </div>

              <p className="text-center text-[9px] font-bold text-foreground/20 uppercase tracking-[0.3em]">
                Warning: this will overwrite current slides
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
