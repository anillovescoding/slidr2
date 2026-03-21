import { LoginForm } from '@/components/auth/LoginForm';
import { Navbar } from '@/components/layout/Navbar';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <LoginForm />
      </div>
    </div>
  );
}
