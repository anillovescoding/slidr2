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
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const activeSlide = slides[activeIndex];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden selection:bg-primary/30">
      <EditorToolbar />
      <div className="flex flex-1 overflow-hidden relative">
        <SlidePanel />
        <main className="flex-1 overflow-hidden relative bg-[#0a0a0a]/50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03)_0%,transparent_70%)] pointer-events-none" />
          {activeSlide && (
            <SlideCanvas slide={activeSlide} index={activeIndex} total={slides.length} />
          )}
        </main>
        <SlideProperties />
      </div>
    </div>
  );
}
