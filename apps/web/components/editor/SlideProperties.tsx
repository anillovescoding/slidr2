"use client";

import { useEditorStore, SlideLayout } from '@/store/useEditorStore';
import { Settings2, Layout, Type, Palette, AlignLeft, Quote as QuoteIcon, List } from 'lucide-react';

import React from 'react';
const LAYOUTS: { value: SlideLayout; label: string; icon: React.ElementType }[] = [
  { value: 'title-body', label: 'Classic', icon: AlignLeft },
  { value: 'title-only', label: 'Hero', icon: Type },
  { value: 'bullet-list', label: 'Listing', icon: List },
  { value: 'quote', label: 'Featured', icon: QuoteIcon },
];

const PRESETS = [
  { bg: '#060e20', text: '#ffffff', label: 'Space' },
  { bg: '#ffffff', text: '#060e20', label: 'Stark' },
  { bg: '#6366f1', text: '#ffffff', label: 'Indigo' },
  { bg: '#8b5cf6', text: '#ffffff', label: 'Violet' },
  { bg: '#f43f5e', text: '#ffffff', label: 'Rose' },
  { bg: '#10b981', text: '#ffffff', label: 'Emerald' },
];

export function SlideProperties() {
  const { slides, activeIndex, updateSlide } = useEditorStore();
  const slide = slides[activeIndex];
  if (!slide) return null;

  const update = (patch: Parameters<typeof updateSlide>[1]) => updateSlide(activeIndex, patch);

  return (
    <div className="w-80 shrink-0 bg-background/40 backdrop-blur-2xl border-l border-white/5 flex flex-col h-full overflow-y-auto custom-scrollbar z-40">
      <div className="px-6 h-16 border-b border-white/5 flex items-center gap-3">
        <Settings2 className="w-4 h-4 text-primary" />
        <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Properties</span>
      </div>

      <div className="p-8 space-y-10">
        {/* Layout */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Layout className="w-3.5 h-3.5 text-foreground/20" />
            <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Master Layout</label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {LAYOUTS.map((l) => (
              <button
                key={l.value}
                onClick={() => update({ layout: l.value })}
                className={`flex flex-col items-center gap-2 py-4 px-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 ${
                  slide.layout === l.value
                    ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5'
                    : 'bg-white/5 border-white/5 text-foreground/40 hover:text-white hover:border-white/10 hover:bg-white/10'
                }`}
              >
                <l.icon className="w-5 h-5 opacity-60" />
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Type className="w-3.5 h-3.5 text-foreground/20" />
            <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Slide Content</label>
          </div>
          
          <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-500">
            {/* Title */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-foreground/20 uppercase tracking-tight ml-1">Headline</span>
              <input
                type="text"
                value={slide.title}
                onChange={(e) => update({ title: e.target.value })}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium text-white placeholder-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                placeholder="The Hook..."
              />
            </div>

            {/* Body (for title-body) */}
            {slide.layout === 'title-body' && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-foreground/20 uppercase tracking-tight ml-1">Context Body</span>
                <textarea
                  value={slide.body}
                  onChange={(e) => update({ body: e.target.value })}
                  rows={4}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium text-white placeholder-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all duration-300"
                  placeholder="Elaborate on your idea..."
                />
              </div>
            )}

            {/* Bullets (for bullet-list) */}
            {slide.layout === 'bullet-list' && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-foreground/20 uppercase tracking-tight ml-1">Key Takeaways</span>
                <textarea
                  value={slide.bullets.join('\n')}
                  onChange={(e) =>
                    update({ bullets: e.target.value.split('\n').filter(Boolean) })
                  }
                  rows={6}
                  placeholder="One impactful point&#10;Per line of text..."
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium text-white placeholder-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all duration-300"
                />
              </div>
            )}

            {/* Quote */}
            {slide.layout === 'quote' && (
              <>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-foreground/20 uppercase tracking-tight ml-1">Statement</span>
                  <textarea
                    value={slide.quote}
                    onChange={(e) => update({ quote: e.target.value })}
                    rows={4}
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium text-white placeholder-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all duration-300"
                    placeholder="Something worth sharing..."
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-foreground/20 uppercase tracking-tight ml-1">Credits</span>
                  <input
                    type="text"
                    value={slide.author}
                    onChange={(e) => update({ author: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium text-white placeholder-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Visual Styling */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-3.5 h-3.5 text-foreground/20" />
            <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Visual Ethos</label>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                title={p.label}
                onClick={() => update({ background: p.bg, textColor: p.text })}
                className={`w-10 h-10 rounded-xl border-2 transition-all duration-300 transform hover:scale-110 shadow-lg ${
                  slide.background === p.bg ? 'border-primary scale-110 ring-4 ring-primary/10' : 'border-white/10'
                }`}
                style={{ backgroundColor: p.bg }}
              />
            ))}
          </div>

          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 mt-2">
            <div className="flex-1 flex flex-col gap-1">
               <span className="text-[10px] font-bold text-foreground/20 uppercase tracking-tighter">Surface</span>
               <input
                type="color"
                value={slide.background}
                onChange={(e) => update({ background: e.target.value })}
                className="w-12 h-8 rounded-lg cursor-pointer bg-transparent border-none appearance-none"
              />
            </div>
            <div className="w-px h-8 bg-white/5" />
            <div className="flex-1 flex flex-col gap-1 items-end text-right">
               <span className="text-[10px] font-bold text-foreground/20 uppercase tracking-tighter">Ink</span>
               <input
                type="color"
                value={slide.textColor}
                onChange={(e) => update({ textColor: e.target.value })}
                className="w-12 h-8 rounded-lg cursor-pointer bg-transparent border-none appearance-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
