"use client";

import { Plus, Trash2, Layers } from 'lucide-react';
import { useEditorStore, Slide } from '@/store/useEditorStore';

function SlideThumbnail({ slide, index, isActive }: { slide: Slide; index: number; isActive: boolean }) {
  const { setActiveIndex } = useEditorStore();

  return (
    <button
      onClick={() => setActiveIndex(index)}
      className={`relative w-full text-left rounded-2xl overflow-hidden border-2 transition-all duration-300 group/thumb ${
        isActive 
          ? 'border-primary shadow-lg shadow-primary/10' 
          : 'border-white/5 hover:border-white/10 hover:bg-white/5'
      }`}
    >
      {/* Mini preview */}
      <div
        className="aspect-[16/9] w-full flex flex-col justify-center px-4 py-3 relative overflow-hidden"
        style={{ backgroundColor: slide.background, color: slide.textColor }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/5 to-transparent pointer-events-none" />
        <p className="text-[10px] font-serif font-bold truncate leading-tight relative z-10">{slide.title || 'Untitled Slide'}</p>
        <div className="w-12 h-1 bg-current opacity-20 rounded-full mt-1 relative z-10" />
      </div>
      
      {/* Label */}
      <div className={`px-3 py-2 text-[10px] font-bold tracking-widest uppercase transition-colors ${
        isActive ? 'bg-primary text-white' : 'bg-background/20 text-foreground/40'
      }`}>
        {String(index + 1).padStart(2, '0')}. {slide.title || 'Slide'}
      </div>
    </button>
  );
}

export function SlidePanel() {
  const { slides, activeIndex, addSlide, deleteSlide } = useEditorStore();

  return (
    <div className="w-64 shrink-0 bg-background/40 backdrop-blur-2xl border-r border-white/5 flex flex-col h-full z-40">
      <div className="px-6 h-16 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Storyline</span>
        </div>
        <button
          onClick={addSlide}
          className="p-2 rounded-xl hover:bg-white/5 text-foreground/40 hover:text-white transition-all border border-transparent hover:border-white/10"
          title="Add slide"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 custom-scrollbar">
        {slides.map((slide, i) => (
          <div key={slide.id} className="group relative">
            <SlideThumbnail slide={slide} index={i} isActive={i === activeIndex} />
            {slides.length > 1 && (
              <button
                onClick={() => deleteSlide(i)}
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-xl bg-red-500 text-white shadow-lg shadow-red-500/20 transform scale-75 hover:scale-100 transition-all z-10"
                title="Delete slide"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-white/5 bg-[#060e20]/40">
        <button
          onClick={addSlide}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl border border-dashed border-white/10 text-foreground/40 hover:text-white hover:border-primary/50 hover:bg-primary/5 text-xs font-bold tracking-tight transition-all"
        >
          <Plus className="w-4 h-4" />
          Append New Slide
        </button>
      </div>
    </div>
  );
}
