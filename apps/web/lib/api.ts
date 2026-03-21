import { pb } from './pocketbase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${pb.authStore.token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? 'API request failed');
  }

  return res.json() as Promise<T>;
}

export const api = {
  keys: {
    list: () => request<{ id: string; provider: string }[]>('/keys'),
    create: (provider: string, key: string) =>
      request<{ id: string; provider: string }>('/keys', {
        method: 'POST',
        body: JSON.stringify({ provider, key }),
      }),
  },
  generate: {
    carousel: (topic: string, numSlides: number, provider: string) =>
      request<{ slides: GeneratedSlide[] }>('/generate/carousel', {
        method: 'POST',
        body: JSON.stringify({ topic, num_slides: numSlides, provider }),
      }),
  },
};

export interface GeneratedSlide {
  title: string;
  body: string;
  layout: 'title-body' | 'title-only' | 'quote' | 'bullet-list';
  bullets?: string[];
  quote?: string;
  author?: string;
}
