"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Clock, CheckCircle2, FileEdit, ArrowRight } from 'lucide-react';
import { pb } from '@/lib/pocketbase';

interface CarouselRecord {
  id: string;
  title: string;
  status: 'draft' | 'completed';
  updated: string;
}

interface CarouselCardProps {
  carousel: CarouselRecord;
  onDeleted: (id: string) => void;
}

export function CarouselCard({ carousel, onDeleted }: CarouselCardProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete "${carousel.title}"?`)) return;
    setDeleting(true);
    try {
      await pb.collection('carousels').delete(carousel.id);
      onDeleted(carousel.id);
    } catch (err) {
      console.error('Delete failed', err);
      setDeleting(false);
    }
  };

  const formattedDate = new Date(carousel.updated).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const isDraft = carousel.status === 'draft';

  return (
    <div
      onClick={() => router.push(`/editor/${carousel.id}`)}
      className="group relative bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col gap-3"
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        {isDraft ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">
            <FileEdit className="w-3 h-3" /> Draft
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Published
          </span>
        )}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500"
          aria-label="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2 flex-1">{carousel.title}</h3>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Clock className="w-3 h-3" />
          <span>{formattedDate}</span>
        </div>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-xs text-indigo-600 font-medium">
          Edit <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}
