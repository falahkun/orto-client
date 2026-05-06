'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Activity, Check, Loader2, Trophy } from 'lucide-react';

const HOBBIES = [
  { id: 'badminton', label: 'Badminton', icon: '🏸' },
  { id: 'padel', label: 'Padel', icon: '🎾' },
  { id: 'tennis', label: 'Tennis', icon: '🎾' },
  { id: 'squash', label: 'Squash', icon: '🏸' },
  { id: 'table_tennis', label: 'Table Tennis', icon: '🏓' },
  { id: 'other', label: 'Lainnya', icon: '✨' },
];

export default function OnboardingPage() {
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const toggleHobby = (id: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  };

  const handleCompleteOnboarding = async () => {
    if (selectedHobbies.length === 0) {
      setError('Pilih minimal 1 hobi untuk melanjutkan.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    // Update profile with hobbies and set onboarding_completed to true
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        hobbies: selectedHobbies,
        onboarding_completed: true,
      })
      .eq('id', user.id);

    if (profileError) {
      setError(profileError.message);
      setIsLoading(false);
      return;
    }

    // Also update user metadata for faster checking in middleware
    await supabase.auth.updateUser({
      data: { onboarding_completed: true }
    });

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg p-4">
      <div className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="bg-cta p-4 border-4 border-sport-border shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
            <Trophy className="w-12 h-12 text-app-text" />
          </div>
          <div>
            <h1 className="text-5xl font-black text-app-text tracking-tighter italic uppercase drop-shadow-sm mt-4">
              Welcome, Champ!
            </h1>
            <p className="text-muted-text font-bold text-lg mt-2 italic">Bantu kami menyesuaikan pengalaman Anda.</p>
          </div>
        </div>

        <div className="sport-card p-8 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-app-text uppercase italic tracking-tight border-b-2 border-sport-border pb-2">
              Pilih Hobi Olahraga Anda
            </h2>
            <p className="text-muted-text font-bold text-sm">Pilih minimal satu olahraga yang sering Anda mainkan.</p>
          </div>

          {error && (
            <div className="bg-primary-light border-2 border-primary text-primary-dark p-4 font-bold text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {HOBBIES.map((hobby) => {
              const isSelected = selectedHobbies.includes(hobby.id);
              return (
                <button
                  key={hobby.id}
                  onClick={() => toggleHobby(hobby.id)}
                  className={`
                    relative p-6 border-2 flex flex-col items-center gap-3 transition-all duration-200
                    ${isSelected 
                      ? 'bg-primary border-sport-border shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -translate-x-1 -translate-y-1' 
                      : 'bg-surface border-sport-border/10 hover:border-primary/50'}
                  `}
                >
                  <span className="text-4xl">{hobby.icon}</span>
                  <span className={`font-black uppercase italic tracking-tighter ${isSelected ? 'text-surface' : 'text-app-text'}`}>
                    {hobby.label}
                  </span>
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-surface p-0.5 border border-sport-border">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleCompleteOnboarding}
            disabled={isLoading || selectedHobbies.length === 0}
            className="w-full sport-btn-secondary py-4 text-xl flex items-center justify-center gap-3 disabled:opacity-50 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Activity className="w-6 h-6" />}
            {isLoading ? 'SAVING...' : 'LETS GO!'}
          </button>
        </div>

      </div>
    </div>
  );
}
