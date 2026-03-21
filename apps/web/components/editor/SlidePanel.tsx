"use client";

import { Plus, Trash2 } from 'lucide-react';
import { useEditorStore, Slide } from '@/store/useEditorStore';

function SlideThumbnail({ slide, index, isActive }: { slide: Slide; index: number; isActive: boolean }) {
  const { setActiveIndex } = useEditorStore();

  return (
    <button
      onClick={() => setActiveIndex(index)}
      className={`w-full text-left rounded-lg overflow-hidden border-2 transition-all ${
        isActive ? 'border-violet-500 shadow-md' : 'border-transparent hover:border-slate-200'
      }`}
    >
      {/* Mini preview */}
      <div
        className="aspect-[16/9] w-full flex flex-col justify-center px-3 py-2"
        style={{ backgroundColor: slide.background, color: slide.textColor }}
      >
        <p className="text-[8px] font-bold truncate leading-tight">{slide.title || 'Untitled'}</p>
        {slide.layout === 'title-body' && (
          <p className="text-[6px] opacity-70 truncate mt-0.5">{slide.body}</p>
        )}
      </div>
      {/* Label */}
      <div className={`px-2 py-1 text-xs font-medium ${isActive ? 'bg-violet-50 text-violet-700' : 'bg-white text-slate-500'}`}>
        {index + 1}. {slide.title || 'Untitled'}
      </div>
    </button>
  );
}

export function SlidePanel() {
  const { slides, activeIndex, addSlide, deleteSlide } = useEditorStore();

  return (
    <div className="w-56 shrink-0 bg-slate-50 border-r flex flex-col h-full">
      <div className="px-3 py-3 border-b flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Slides</span>
        <button
          onClick={addSlide}
          className="p-1 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
          title="Add slide"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {slides.map((slide, i) => (
          <div key={slide.id} className="group relative">
            <SlideThumbnail slide={slide} index={i} isActive={i === activeIndex} />
            {slides.length > 1 && (
              <button
                onClick={() => deleteSlide(i)}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-0.5 rounded bg-white/80 text-red-400 hover:text-red-600 transition-all"
                title="Delete slide"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="p-3 border-t">
        <button
          onClick={addSlide}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-slate-300 text-slate-400 hover:text-slate-600 hover:border-slate-400 text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Slide
        </button>
      </div>
    </div>
  );
}
