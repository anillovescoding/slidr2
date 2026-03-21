"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Clock, CheckCircle, FileEdit } from 'lucide-react';
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
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      onClick={() => router.push(`/editor/${carousel.id}`)}
      className="group relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-violet-300 transition-all cursor-pointer"
    >
      {/* Status badge */}
      <div className="flex items-center justify-between mb-3">
        {carousel.status === 'draft' ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <FileEdit className="w-3 h-3" />
            Draft
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        )}

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"
          aria-label="Delete carousel"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-slate-800 text-base truncate mb-2">{carousel.title}</h3>

      {/* Timestamp */}
      <div className="flex items-center gap-1 text-xs text-slate-400">
        <Clock className="w-3 h-3" />
        <span>Updated {formattedDate}</span>
      </div>
    </div>
  );
}
