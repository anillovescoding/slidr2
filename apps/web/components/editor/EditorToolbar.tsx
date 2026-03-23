"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, CheckCircle, Loader2, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { AiGenerateDialog } from './AiGenerateDialog';
import { ShareDialog } from './ShareDialog';
import { exportCarouselHtml } from '@/lib/exportCarousel';

export function EditorToolbar() {
  const router = useRouter();
  const {
    carouselTitle, setTitle, slides, activeIndex, setActiveIndex,
    isSaving, isDirty, save, markComplete,
  } = useEditorStore();

  const handleExport = () => {
    const { carouselTitle: title, slides: s } = useEditorStore.getState();
    exportCarouselHtml(title, s);
  };

  return (
    <div className="h-20 bg-background/80 backdrop-blur-2xl border-b border-white/5 flex items-center px-6 gap-6 shrink-0 relative z-50">
      {/* Back */}
      <button
        onClick={() => router.push('/library')}
        className="p-3 rounded-2xl hover:bg-white/5 text-foreground/40 hover:text-white transition-all duration-200 border border-transparent hover:border-white/10"
        title="Back to library"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0 max-w-sm">
        <input
          type="text"
          value={carouselTitle}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-base font-serif font-bold text-white bg-transparent border-none focus:outline-none focus:ring-0 truncate placeholder:text-foreground/20"
          placeholder="Untitled Masterpiece"
        />
        <div className="flex items-center gap-2 mt-0.5">
          <div className={`w-1.5 h-1.5 rounded-full ${isDirty ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
          <span className="text-[10px] font-bold tracking-widest text-foreground/20 uppercase">
            {isDirty ? 'Unsaved Changes' : 'All Changes Saved'}
          </span>
        </div>
      </div>

      {/* Slide navigation */}
      <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-2xl p-1.5">
        <button
          onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          className="p-2 disabled:opacity-20 text-foreground/40 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="px-3 flex items-center gap-1.5 min-w-[3.5rem] justify-center">
          <span className="text-xs font-bold text-white tracking-widest">{activeIndex + 1}</span>
          <span className="text-[10px] font-bold text-foreground/20">/</span>
          <span className="text-[10px] font-bold text-foreground/40 tracking-widest">{slides.length}</span>
        </div>
        <button
          onClick={() => setActiveIndex(Math.min(slides.length - 1, activeIndex + 1))}
          disabled={activeIndex === slides.length - 1}
          className="p-2 disabled:opacity-20 text-foreground/40 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1" />

      {/* Actions Group */}
      <div className="flex items-center gap-3">
        {/* AI Generate */}
        <AiGenerateDialog />

        {/* Export */}
        <button
          onClick={handleExport}
          className="hidden md:inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-white/5 text-foreground/60 hover:text-white hover:bg-white/5 text-xs font-bold tracking-tight transition-all"
        >
          <Download className="w-4 h-4" />
          Export
        </button>

        {/* Share */}
        <ShareDialog />

        <div className="w-px h-8 bg-white/5 mx-1" />

        {/* Save */}
        <button
          onClick={save}
          disabled={isSaving || !isDirty}
          className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-white/5 text-foreground/60 hover:text-white hover:bg-white/5 disabled:opacity-20 text-xs font-bold tracking-tight transition-all"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isDirty ? 'Save' : 'Saved'}
        </button>

        {/* Mark complete */}
        <button
          onClick={markComplete}
          disabled={isSaving}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-linear-to-br from-primary to-secondary disabled:opacity-50 text-white text-xs font-bold tracking-tight shadow-lg shadow-primary/20 hover:shadow-primary/30 transform hover:scale-[1.02] transition-all duration-300"
        >
          <CheckCircle className="w-4 h-4" />
          Publish
        </button>
      </div>
    </div>
  );
}
