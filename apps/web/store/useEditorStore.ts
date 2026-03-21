import { create } from 'zustand';
import { pb } from '@/lib/pocketbase';

export type SlideLayout = 'title-body' | 'title-only' | 'quote' | 'bullet-list';

export interface Slide {
  id: string;
  title: string;
  body: string;
  layout: SlideLayout;
  background: string;
  textColor: string;
  bullets: string[];
  quote: string;
  author: string;
}

export function makeSlide(overrides: Partial<Slide> = {}): Slide {
  return {
    id: crypto.randomUUID(),
    title: 'Slide Title',
    body: 'Add your content here.',
    layout: 'title-body',
    background: '#ffffff',
    textColor: '#1e293b',
    bullets: [],
    quote: '',
    author: '',
    ...overrides,
  };
}

interface EditorState {
  carouselId: string | null;
  carouselTitle: string;
  slides: Slide[];
  activeIndex: number;
  isSaving: boolean;
  isDirty: boolean;

  load: (id: string) => Promise<void>;
  setTitle: (title: string) => void;
  setActiveIndex: (index: number) => void;
  updateSlide: (index: number, patch: Partial<Slide>) => void;
  addSlide: () => void;
  deleteSlide: (index: number) => void;
  moveSlide: (from: number, to: number) => void;
  replaceSlides: (slides: Slide[]) => void;
  save: () => Promise<void>;
  markComplete: () => Promise<void>;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  carouselId: null,
  carouselTitle: '',
  slides: [],
  activeIndex: 0,
  isSaving: false,
  isDirty: false,

  load: async (id: string) => {
    const record = await pb.collection('carousels').getOne(id);
    const raw = record.slides_data;
    const slides: Slide[] = Array.isArray(raw) && raw.length > 0
      ? raw
      : [makeSlide({ title: record.title })];
    set({ carouselId: id, carouselTitle: record.title, slides, activeIndex: 0, isDirty: false });
  },

  setTitle: (title) => set({ carouselTitle: title, isDirty: true }),

  setActiveIndex: (index) => set({ activeIndex: index }),

  updateSlide: (index, patch) =>
    set((s) => {
      const slides = [...s.slides];
      slides[index] = { ...slides[index], ...patch };
      return { slides, isDirty: true };
    }),

  addSlide: () =>
    set((s) => {
      const slides = [...s.slides, makeSlide()];
      return { slides, activeIndex: slides.length - 1, isDirty: true };
    }),

  deleteSlide: (index) =>
    set((s) => {
      if (s.slides.length <= 1) return {};
      const slides = s.slides.filter((_, i) => i !== index);
      const activeIndex = Math.min(s.activeIndex, slides.length - 1);
      return { slides, activeIndex, isDirty: true };
    }),

  moveSlide: (from, to) =>
    set((s) => {
      const slides = [...s.slides];
      const [moved] = slides.splice(from, 1);
      slides.splice(to, 0, moved);
      return { slides, activeIndex: to, isDirty: true };
    }),

  replaceSlides: (slides) => set({ slides, activeIndex: 0, isDirty: true }),

  save: async () => {
    const { carouselId, carouselTitle, slides } = get();
    if (!carouselId) return;
    set({ isSaving: true });
    try {
      await pb.collection('carousels').update(carouselId, {
        title: carouselTitle,
        slides_data: slides,
      });
      set({ isDirty: false });
    } finally {
      set({ isSaving: false });
    }
  },

  markComplete: async () => {
    const { carouselId, carouselTitle, slides } = get();
    if (!carouselId) return;
    set({ isSaving: true });
    try {
      await pb.collection('carousels').update(carouselId, {
        title: carouselTitle,
        slides_data: slides,
        status: 'completed',
      });
      set({ isDirty: false });
    } finally {
      set({ isSaving: false });
    }
  },
}));
