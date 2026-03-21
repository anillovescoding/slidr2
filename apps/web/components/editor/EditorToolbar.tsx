"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, CheckCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div className="h-14 bg-white border-b flex items-center px-4 gap-3 shrink-0">
      {/* Back */}
      <button
        onClick={() => router.push('/library')}
        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
        title="Back to library"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      {/* Title */}
      <input
        type="text"
        value={carouselTitle}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 text-sm font-semibold text-slate-800 bg-transparent border-none focus:outline-none focus:ring-0 min-w-0 truncate"
        placeholder="Untitled carousel"
      />

      {/* Slide navigation */}
      <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 border rounded-lg px-2 py-1">
        <button
          onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          className="disabled:opacity-30 hover:text-slate-700"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="px-1">{activeIndex + 1} / {slides.length}</span>
        <button
          onClick={() => setActiveIndex(Math.min(slides.length - 1, activeIndex + 1))}
          disabled={activeIndex === slides.length - 1}
          className="disabled:opacity-30 hover:text-slate-700"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* AI Generate */}
      <AiGenerateDialog />

      {/* Export */}
      <button
        onClick={handleExport}
        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition-colors"
      >
        Export
      </button>

      {/* Share */}
      <ShareDialog />

      {/* Save */}
      <button
        onClick={save}
        disabled={isSaving || !isDirty}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 text-xs font-medium transition-colors"
      >
        {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
        {isDirty ? 'Save' : 'Saved'}
      </button>

      {/* Mark complete */}
      <button
        onClick={markComplete}
        disabled={isSaving}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-medium transition-colors"
      >
        <CheckCircle className="w-3.5 h-3.5" />
        Publish
      </button>
    </div>
  );
}
