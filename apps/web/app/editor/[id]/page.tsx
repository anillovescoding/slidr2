"use client";

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useEditorStore } from '@/store/useEditorStore';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { SlidePanel } from '@/components/editor/SlidePanel';
import { SlideCanvas } from '@/components/editor/SlideCanvas';
import { SlideProperties } from '@/components/editor/SlideProperties';
import { Loader2 } from 'lucide-react';

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const { slides, activeIndex, load, carouselId } = useEditorStore();

  useEffect(() => {
    if (id) load(id);
  }, [id, load]);

  if (!carouselId) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  const activeSlide = slides[activeIndex];

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      <EditorToolbar />
      <div className="flex flex-1 overflow-hidden">
        <SlidePanel />
        <main className="flex-1 overflow-hidden bg-slate-100">
          {activeSlide && (
            <SlideCanvas slide={activeSlide} index={activeIndex} total={slides.length} />
          )}
        </main>
        <SlideProperties />
      </div>
    </div>
  );
}
