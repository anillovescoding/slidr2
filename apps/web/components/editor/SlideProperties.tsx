"use client";

import { useEditorStore, SlideLayout } from '@/store/useEditorStore';

const LAYOUTS: { value: SlideLayout; label: string }[] = [
  { value: 'title-body', label: 'Title + Body' },
  { value: 'title-only', label: 'Title Only' },
  { value: 'bullet-list', label: 'Bullet List' },
  { value: 'quote', label: 'Quote' },
];

const PRESETS = [
  { bg: '#ffffff', text: '#1e293b', label: 'White' },
  { bg: '#1e293b', text: '#f8fafc', label: 'Dark' },
  { bg: '#7c3aed', text: '#ffffff', label: 'Violet' },
  { bg: '#0f172a', text: '#38bdf8', label: 'Navy' },
  { bg: '#f0fdf4', text: '#14532d', label: 'Mint' },
  { bg: '#fef3c7', text: '#78350f', label: 'Amber' },
];

export function SlideProperties() {
  const { slides, activeIndex, updateSlide } = useEditorStore();
  const slide = slides[activeIndex];
  if (!slide) return null;

  const update = (patch: Parameters<typeof updateSlide>[1]) => updateSlide(activeIndex, patch);

  return (
    <div className="w-72 shrink-0 bg-white border-l flex flex-col h-full overflow-y-auto">
      <div className="px-4 py-3 border-b">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Slide Properties</span>
      </div>

      <div className="p-4 space-y-5">
        {/* Layout */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Layout</label>
          <div className="grid grid-cols-2 gap-1.5">
            {LAYOUTS.map((l) => (
              <button
                key={l.value}
                onClick={() => update({ layout: l.value })}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                  slide.layout === l.value
                    ? 'bg-violet-50 border-violet-300 text-violet-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Title</label>
          <input
            type="text"
            value={slide.title}
            onChange={(e) => update({ title: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>

        {/* Body (for title-body) */}
        {slide.layout === 'title-body' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Body</label>
            <textarea
              value={slide.body}
              onChange={(e) => update({ body: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
            />
          </div>
        )}

        {/* Bullets (for bullet-list) */}
        {slide.layout === 'bullet-list' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Bullets (one per line)
            </label>
            <textarea
              value={slide.bullets.join('\n')}
              onChange={(e) =>
                update({ bullets: e.target.value.split('\n').filter(Boolean) })
              }
              rows={5}
              placeholder="First point&#10;Second point&#10;Third point"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
            />
          </div>
        )}

        {/* Quote */}
        {slide.layout === 'quote' && (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Quote</label>
              <textarea
                value={slide.quote}
                onChange={(e) => update({ quote: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Author</label>
              <input
                type="text"
                value={slide.author}
                onChange={(e) => update({ author: e.target.value })}
                placeholder="Jane Doe"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
          </>
        )}

        {/* Color presets */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Background</label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                title={p.label}
                onClick={() => update({ background: p.bg, textColor: p.text })}
                className="w-8 h-8 rounded-lg border-2 transition-all hover:scale-110"
                style={{
                  backgroundColor: p.bg,
                  borderColor: slide.background === p.bg ? '#7c3aed' : '#e2e8f0',
                }}
              />
            ))}
          </div>
          <div className="flex gap-2 items-center mt-1">
            <label className="text-xs text-slate-500 w-12 shrink-0">Custom</label>
            <input
              type="color"
              value={slide.background}
              onChange={(e) => update({ background: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer border border-slate-200"
            />
            <input
              type="color"
              value={slide.textColor}
              onChange={(e) => update({ textColor: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer border border-slate-200"
              title="Text color"
            />
            <span className="text-xs text-slate-400">bg / text</span>
          </div>
        </div>
      </div>
    </div>
  );
}
