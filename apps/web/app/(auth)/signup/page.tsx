import { SignupForm } from '@/components/auth/SignupForm';
import { Navbar } from '@/components/layout/Navbar';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <SignupForm />
      </div>
    </div>
  );
}
