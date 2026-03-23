"use client";

import { Slide } from '@/store/useEditorStore';
import { Sparkles, Quote } from 'lucide-react';

interface SlideCanvasProps {
  slide: Slide;
  index: number;
  total: number;
}

export function SlideCanvas({ slide, index, total }: SlideCanvasProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full gap-8 p-12 relative overflow-y-auto">
      {/* Canvas frame */}
      <div className="relative group/canvas w-full max-w-3xl">
        {/* Glow effect */}
        <div 
          className="absolute -inset-4 bg-primary/20 blur-3xl opacity-0 group-hover/canvas:opacity-100 transition-opacity duration-1000 rounded-[40px]" 
          style={{ backgroundColor: `${slide.background}44` }}
        />
        
        <div
          className="aspect-[16/9] w-full rounded-[32px] shadow-2xl flex flex-col justify-center px-16 py-12 relative overflow-hidden border border-white/5 transition-transform duration-500 hover:scale-[1.01]"
          style={{ backgroundColor: slide.background, color: slide.textColor }}
        >
          {/* Grainy Texture / Glass Reflection */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-black/5 pointer-events-none" />

          {slide.layout === 'title-only' && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-6">
              <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight tracking-tight drop-shadow-sm">
                {slide.title || 'Slide Title'}
              </h1>
              <div className="w-24 h-1.5 bg-current opacity-20 rounded-full" />
            </div>
          )}

          {slide.layout === 'title-body' && (
            <div className="flex flex-col gap-6 max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight tracking-tight">
                {slide.title || 'Slide Title'}
              </h1>
              <p className="text-xl md:text-2xl font-medium opacity-80 leading-relaxed font-sans">
                {slide.body || 'Your content here.'}
              </p>
            </div>
          )}

          {slide.layout === 'bullet-list' && (
            <div className="flex flex-col gap-8 max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight tracking-tight">
                {slide.title || 'Key Points'}
              </h1>
              <ul className="space-y-4">
                {(slide.bullets.length > 0 ? slide.bullets : ['Point one', 'Point two', 'Point three']).map(
                  (b, i) => (
                    <li key={i} className="flex items-start gap-4 text-xl md:text-2xl font-medium opacity-80 font-sans">
                      <div className="mt-2.5 w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: slide.textColor }} />
                      {b}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {slide.layout === 'quote' && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-8 px-12">
              <Quote className="w-12 h-12 opacity-10 absolute top-12 left-12 rotate-180" />
              <p className="text-3xl md:text-4xl font-serif font-bold italic leading-relaxed drop-shadow-sm">
                &ldquo;{slide.quote || 'Inspiring message goes here.'}&rdquo;
              </p>
              {slide.author && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-px bg-current opacity-20" />
                  <p className="text-lg md:text-xl font-bold tracking-tight opacity-60 uppercase">{slide.author}</p>
                  <div className="w-8 h-px bg-current opacity-20" />
                </div>
              )}
            </div>
          )}

          {/* Slide number badge */}
          <div
            className="absolute bottom-8 right-8 flex items-center gap-2"
            style={{ color: slide.textColor }}
          >
            <span className="text-sm font-serif font-bold opacity-30 tracking-widest uppercase">Page</span>
            <span className="text-lg font-serif font-bold opacity-60 tracking-widest">{index + 1}</span>
          </div>
        </div>
      </div>

      {/* Navigation hint */}
      <div className="flex items-center gap-3 px-6 py-3 glass-dark border border-white/5 rounded-2xl animate-in slide-in-from-bottom-4 duration-700">
        <Sparkles className="w-4 h-4 text-primary" />
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/40">
          Scene {index + 1} of {total} — Crafting Mode Active
        </p>
      </div>
    </div>
  );
}
