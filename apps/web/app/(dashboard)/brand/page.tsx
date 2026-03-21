import { BrandProfileForm } from '../../../components/brand/BrandProfileForm';

export default function BrandPage() {
  return (
    <div className="max-w-4xl max-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-slate-800">Brand Profile</h1>
        <p className="text-slate-500">Manage your visual identity for AI carousel generation.</p>
      </div>
      
      <div className="grid gap-6">
        <BrandProfileForm />
      </div>
    </div>
  );
}
