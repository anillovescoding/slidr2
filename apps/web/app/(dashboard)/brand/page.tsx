import { BrandProfileForm } from '../../../components/brand/BrandProfileForm';
import { Sparkles } from 'lucide-react';

export default function BrandPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
           <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <p className="text-[10px] font-bold tracking-[0.3em] text-primary/60 uppercase">Identity Management</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">Brand Kit</h1>
          <p className="text-foreground/40 mt-3 text-sm md:text-base font-medium max-w-lg">
            Define your visual signature. These assets will feed directly into our AI engine to ensure every carousel feels uniquely yours.
          </p>
        </div>
      </div>
      
      <div className="pt-4">
        <BrandProfileForm />
      </div>
    </div>
  );
}
