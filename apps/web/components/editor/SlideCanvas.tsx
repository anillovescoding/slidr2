"use client";

import { Slide } from '@/store/useEditorStore';

interface SlideCanvasProps {
  slide: Slide;
  index: number;
  total: number;
}

export function SlideCanvas({ slide, index, total }: SlideCanvasProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
      {/* Canvas frame */}
      <div
        className="w-full max-w-2xl aspect-[16/9] rounded-2xl shadow-xl flex flex-col justify-center px-12 py-8 relative overflow-hidden"
        style={{ backgroundColor: slide.background, color: slide.textColor }}
      >
        {slide.layout === 'title-only' && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4">
            <h1 className="text-4xl font-bold leading-tight">{slide.title || 'Slide Title'}</h1>
          </div>
        )}

        {slide.layout === 'title-body' && (
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold leading-tight">{slide.title || 'Slide Title'}</h1>
            <p className="text-lg opacity-80 leading-relaxed">{slide.body || 'Your content here.'}</p>
          </div>
        )}

        {slide.layout === 'bullet-list' && (
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">{slide.title || 'Slide Title'}</h1>
            <ul className="space-y-2">
              {(slide.bullets.length > 0 ? slide.bullets : ['Point one', 'Point two', 'Point three']).map(
                (b, i) => (
                  <li key={i} className="flex items-start gap-2 text-lg opacity-80">
                    <span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: slide.textColor }} />
                    {b}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        {slide.layout === 'quote' && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-6">
            <p className="text-2xl font-light italic leading-relaxed opacity-90">
              &ldquo;{slide.quote || 'Your quote here.'}&rdquo;
            </p>
            {slide.author && (
              <p className="text-base font-medium opacity-60">— {slide.author}</p>
            )}
          </div>
        )}

        {/* Slide number badge */}
        <div
          className="absolute bottom-4 right-4 text-xs font-medium opacity-40"
          style={{ color: slide.textColor }}
        >
          {index + 1} / {total}
        </div>
      </div>

      {/* Navigation hint */}
      <p className="text-xs text-slate-400">
        Slide {index + 1} of {total} — edit using the panel on the right
      </p>
    </div>
  );
}
