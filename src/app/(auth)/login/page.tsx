'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, LogIn, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg p-4">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="bg-primary p-4 border-4 border-sport-border shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
            <Activity className="w-12 h-12 text-surface" />
          </div>
          <div>
            <h1 className="text-5xl font-black text-app-text tracking-tighter italic uppercase drop-shadow-sm mt-4">
              Log In
            </h1>
            <p className="text-muted-text font-bold text-lg mt-2">Masuk untuk mengelola sesi permainan Anda.</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="sport-card p-8 space-y-6">
          {error && (
            <div className="bg-primary-light border-2 border-primary text-primary-dark p-4 font-bold text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="block text-[11px] font-black text-muted-text uppercase tracking-[0.2em]">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="sport-input w-full text-lg"
              placeholder="player@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-black text-muted-text uppercase tracking-[0.2em]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="sport-input w-full text-lg"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sport-btn-primary py-4 text-xl flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <LogIn className="w-6 h-6" />}
            {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        <div className="text-center font-bold text-muted-text">
          Belum punya akun?{' '}
          <Link href="/register" className="text-primary hover:text-primary-dark hover:underline underline-offset-4 uppercase tracking-wider text-sm font-black italic">
            Daftar Sekarang
          </Link>
        </div>

      </div>
    </div>
  );
}
