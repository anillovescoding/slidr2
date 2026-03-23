"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useEditorStore } from '@/store/useEditorStore';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { SlidePanel } from '@/components/editor/SlidePanel';
import { SlideCanvas } from '@/components/editor/SlideCanvas';
import { SlideProperties } from '@/components/editor/SlideProperties';
import { Loader2, Layers, Settings2, X } from 'lucide-react';

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const { slides, activeIndex, load, carouselId } = useEditorStore();
  const [mobileSheet, setMobileSheet] = useState<'slides' | 'properties' | null>(null);

  useEffect(() => {
    if (id) load(id);
  }, [id, load]);

  if (!carouselId) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const activeSlide = slides[activeIndex];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden selection:bg-primary/30">
      <EditorToolbar />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left sidebar — hidden on mobile */}
        <div className="hidden md:flex">
          <SlidePanel />
        </div>

        {/* Canvas — full width on mobile */}
        <main className="flex-1 overflow-hidden relative bg-[#0a0a0a]/50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03)_0%,transparent_70%)] pointer-events-none" />
          {activeSlide && (
            <SlideCanvas slide={activeSlide} index={activeIndex} total={slides.length} />
          )}
        </main>

        {/* Right properties panel — hidden on mobile */}
        <div className="hidden md:flex">
          <SlideProperties />
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <div className="md:hidden flex border-t border-white/5 bg-background/80 backdrop-blur-2xl shrink-0">
        <button
          onClick={() => setMobileSheet(mobileSheet === 'slides' ? null : 'slides')}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${
            mobileSheet === 'slides' ? 'text-primary' : 'text-foreground/40'
          }`}
        >
          <Layers className="w-5 h-5" />
          Slides
        </button>
        <button
          onClick={() => setMobileSheet(mobileSheet === 'properties' ? null : 'properties')}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${
            mobileSheet === 'properties' ? 'text-primary' : 'text-foreground/40'
          }`}
        >
          <Settings2 className="w-5 h-5" />
          Properties
        </button>
      </div>

      {/* Mobile bottom sheet */}
      {mobileSheet && (
        <div className="md:hidden fixed inset-0 z-[100] flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={() => setMobileSheet(null)}
          />
          {/* Sheet */}
          <div className="relative bg-surface border-t border-white/10 rounded-t-[2rem] max-h-[75vh] flex flex-col animate-in slide-in-from-bottom-8 duration-300">
            {/* Handle */}
            <div className="flex items-center justify-between px-6 pt-4 pb-2 shrink-0">
              <div className="flex items-center gap-2">
                {mobileSheet === 'slides' ? (
                  <><Layers className="w-4 h-4 text-primary" /><span className="text-xs font-bold text-white uppercase tracking-widest">Slides</span></>
                ) : (
                  <><Settings2 className="w-4 h-4 text-primary" /><span className="text-xs font-bold text-white uppercase tracking-widest">Properties</span></>
                )}
              </div>
              <button
                onClick={() => setMobileSheet(null)}
                className="p-2 rounded-xl hover:bg-white/5 text-foreground/40 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {mobileSheet === 'slides' && <SlidePanel />}
              {mobileSheet === 'properties' && <SlideProperties />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
