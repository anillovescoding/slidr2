"use client";

import { useRef } from 'react';
import { Plus, Trash2, Layers, ChevronLeft, ChevronRight, Copy } from 'lucide-react';
import { useEditorStore, Slide } from '@/store/useEditorStore';

function SlideThumbnail({ slide, index, isActive }: { slide: Slide; index: number; isActive: boolean }) {
  const { setActiveIndex, duplicateSlide, deleteSlide, slides } = useEditorStore();

  return (
    <div className="group relative">
      <button
        onClick={() => setActiveIndex(index)}
        className={`relative w-full text-left rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
          isActive
            ? 'border-primary shadow-lg shadow-primary/10'
            : 'border-white/5 hover:border-white/10 hover:bg-white/5'
        }`}
      >
        <div
          className="aspect-[16/9] w-full flex flex-col justify-center px-4 py-3 relative overflow-hidden"
          style={{ backgroundColor: slide.background, color: slide.textColor }}
        >
          <div className="absolute inset-0 bg-linear-to-b from-black/5 to-transparent pointer-events-none" />
          <p className="text-[10px] font-serif font-bold truncate leading-tight relative z-10">{slide.title || 'Untitled Slide'}</p>
          <div className="w-12 h-1 bg-current opacity-20 rounded-full mt-1 relative z-10" />
        </div>
        <div className={`px-3 py-2 text-[10px] font-bold tracking-widest uppercase transition-colors ${
          isActive ? 'bg-primary text-white' : 'bg-background/20 text-foreground/40'
        }`}>
          {String(index + 1).padStart(2, '0')}. {slide.title || 'Slide'}
        </div>
      </button>

      {/* Hover actions */}
      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-all z-10">
        <button
          onClick={() => duplicateSlide(index)}
          className="p-1.5 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 transform scale-75 hover:scale-100 transition-all"
          title="Duplicate slide"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        {slides.length > 1 && (
          <button
            onClick={() => deleteSlide(index)}
            className="p-1.5 rounded-xl bg-red-500 text-white shadow-lg shadow-red-500/20 transform scale-75 hover:scale-100 transition-all"
            title="Delete slide"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export function SlidePanel() {
  const { slides, activeIndex, addSlide, isSidebarCollapsed, setSidebarCollapsed, setActiveIndex } = useEditorStore();
  const listRef = useRef<HTMLDivElement>(null);

  const scrollUp = () => {
    listRef.current?.scrollBy({ top: -120, behavior: 'smooth' });
  };
  const scrollDown = () => {
    listRef.current?.scrollBy({ top: 120, behavior: 'smooth' });
  };

  if (isSidebarCollapsed) {
    return (
      <div className="w-12 shrink-0 bg-background/40 backdrop-blur-2xl border-r border-white/5 flex flex-col items-center py-6 gap-6 z-40">
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="p-2 rounded-xl hover:bg-white/5 text-foreground/40 hover:text-white transition-all border border-transparent hover:border-white/10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="flex flex-col gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                i === activeIndex ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-foreground/40 hover:text-white'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 shrink-0 bg-background/40 backdrop-blur-2xl border-r border-white/5 flex flex-col h-full z-40 transition-all duration-300">
      {/* Header */}
      <div className="px-6 h-16 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Slides</span>
          <span className="text-[10px] font-bold text-foreground/20">({slides.length})</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={addSlide}
            className="p-2 rounded-xl hover:bg-white/5 text-foreground/40 hover:text-white transition-all border border-transparent hover:border-white/10"
            title="Add slide"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSidebarCollapsed(true)}
            className="p-2 rounded-xl hover:bg-white/5 text-foreground/40 hover:text-white transition-all border border-transparent hover:border-white/10"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scroll up */}
      <button
        onClick={scrollUp}
        className="w-full py-1.5 flex items-center justify-center text-foreground/20 hover:text-white hover:bg-white/5 transition-all border-b border-white/5 shrink-0"
        title="Scroll up"
      >
        <ChevronLeft className="w-4 h-4 rotate-90" />
      </button>

      {/* Slide list */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
        {slides.map((slide, i) => (
          <SlideThumbnail key={slide.id} slide={slide} index={i} isActive={i === activeIndex} />
        ))}
      </div>

      {/* Scroll down */}
      <button
        onClick={scrollDown}
        className="w-full py-1.5 flex items-center justify-center text-foreground/20 hover:text-white hover:bg-white/5 transition-all border-t border-white/5 shrink-0"
        title="Scroll down"
      >
        <ChevronLeft className="w-4 h-4 -rotate-90" />
      </button>

      {/* Footer: Add slide */}
      <div className="p-4 border-t border-white/5 bg-[#060e20]/40 shrink-0">
        <button
          onClick={addSlide}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border border-dashed border-white/10 text-foreground/40 hover:text-white hover:border-primary/50 hover:bg-primary/5 text-xs font-bold tracking-tight transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Slide
        </button>
      </div>
    </div>
  );
}
