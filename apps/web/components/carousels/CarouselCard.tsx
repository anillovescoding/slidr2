"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Clock, CheckCircle2, FileEdit, ArrowRight, Sparkles } from 'lucide-react';
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
      className="group relative glass-dark border border-white/5 rounded-[32px] p-6 hover:bg-white/5 hover:border-white/10 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer flex flex-col gap-4 overflow-hidden"
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Top row */}
      <div className="flex items-center justify-between relative z-10">
        {isDraft ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-400/10 text-amber-400 border border-amber-400/20">
            <FileEdit className="w-3 h-3" /> Draft
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
            <CheckCircle2 className="w-3 h-3" /> Published
          </span>
        )}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="lg:opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl hover:bg-red-500/10 text-foreground/20 hover:text-red-400"
          aria-label="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Preview Placeholder */}
      <div className="aspect-video bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-primary/20 transition-colors duration-300">
        <Sparkles className="w-8 h-8 text-foreground/10 group-hover:text-primary/30 transition-colors duration-300" />
      </div>

      {/* Title */}
      <h3 className="font-serif font-bold text-white text-lg leading-tight line-clamp-2 flex-1 relative z-10">{carousel.title}</h3>

      {/* Footer */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/40">
          <Clock className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>
        <span className="lg:opacity-0 group-hover:opacity-100 transition-all duration-300 inline-flex items-center gap-1.5 text-xs text-primary font-bold tracking-tight">
          Launch Editor <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </div>
  );
}
