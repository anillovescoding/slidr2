"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { pb } from '../../lib/pocketbase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Sparkles, Mail, Lock, UserPlus } from 'lucide-react';

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await pb.collection('users').create({
        email,
        password,
        passwordConfirm,
      });

      await pb.collection('users').authWithPassword(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-surface border border-white/10 shadow-2xl rounded-[2rem] overflow-hidden">
      <CardHeader className="text-center pt-8 pb-4">
        <div className="mx-auto w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-3xl font-black text-white tracking-tight brand-font">Create Account</CardTitle>
        <CardDescription className="text-slate-400 font-medium uppercase tracking-[0.2em] text-[10px] mt-2">
          Start New Neural Sequence
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSignup}>
        <CardContent className="space-y-6 px-8">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Username / Email</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="buildawesomecarousels@slidr.ai"
                className="bg-white/5 border-white/10 text-white pl-12 h-12 rounded-xl focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="bg-white/5 border-white/10 text-white pl-12 h-12 rounded-xl focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="passwordConfirm" className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                id="passwordConfirm"
                type="password"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="••••••••"
                className="bg-white/5 border-white/10 text-white pl-12 h-12 rounded-xl focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-400 font-medium text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{error}</p>}
        </CardContent>
        <CardFooter className="px-8 pb-8 pt-2">
          <Button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black h-12 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center gap-2 group" 
            disabled={isLoading}
          >
            {isLoading ? 'INITIALIZING...' : (
              <>
                CREATE ACCOUNT
                <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
