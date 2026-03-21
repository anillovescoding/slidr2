"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Slide } from '@/store/useEditorStore';

interface Props {
  title: string;
  slides: Slide[];
}

export function PublicCarouselViewer({ title, slides }: Props) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  if (!slide) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p>This carousel has no slides.</p>
      </div>
    );
  }

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(slides.length - 1, i + 1));

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-6"
      tabIndex={0}
      onKeyDown={handleKey}
    >
      {/* Slide */}
      <div
        className="w-full max-w-3xl aspect-[16/9] rounded-2xl shadow-2xl flex flex-col justify-center px-16 py-10 relative"
        style={{ backgroundColor: slide.background, color: slide.textColor }}
      >
        {slide.layout === 'title-only' && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-5xl font-bold leading-tight">{slide.title}</h1>
          </div>
        )}
        {slide.layout === 'title-body' && (
          <div className="flex flex-col gap-5">
            <h1 className="text-4xl font-bold">{slide.title}</h1>
            <p className="text-xl opacity-80 leading-relaxed">{slide.body}</p>
          </div>
        )}
        {slide.layout === 'bullet-list' && (
          <div className="flex flex-col gap-5">
            <h1 className="text-4xl font-bold">{slide.title}</h1>
            <ul className="space-y-3">
              {slide.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-xl opacity-80">
                  <span className="mt-2 w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slide.textColor }} />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}
        {slide.layout === 'quote' && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-6">
            <p className="text-3xl font-light italic leading-relaxed opacity-90">
              &ldquo;{slide.quote}&rdquo;
            </p>
            {slide.author && (
              <p className="text-lg opacity-60">— {slide.author}</p>
            )}
          </div>
        )}
        <span className="absolute bottom-4 right-5 text-xs opacity-30">
          {index + 1} / {slides.length}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mt-6">
        <button
          onClick={prev}
          disabled={index === 0}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dot indicators */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === index ? 'bg-white w-5' : 'bg-white/40'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={index === slides.length - 1}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <p className="mt-4 text-white/30 text-sm">{title}</p>
      <p className="mt-1 text-white/20 text-xs">Use ← → arrow keys to navigate</p>
    </div>
  );
}
