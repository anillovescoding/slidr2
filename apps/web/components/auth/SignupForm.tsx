"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { pb } from '../../lib/pocketbase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

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
      // Create user record
      await pb.collection('users').create({
        email,
        password,
        passwordConfirm,
      });

      // Log in right after creating
      await pb.collection('users').authWithPassword(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Signup error:', msg);
      setError(msg || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your details to get started</CardDescription>
      </CardHeader>
      <form onSubmit={handleSignup}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passwordConfirm">Confirm Password</Label>
            <Input
              id="passwordConfirm"
              type="password"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
