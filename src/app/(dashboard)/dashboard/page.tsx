'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, Plus, PlayCircle, Calendar, Trophy, Loader2 } from 'lucide-react';

export default function DashboardIndexPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setSessions(data);
    }
    setIsLoading(false);
  };

  const handleCreateSession = async () => {
    setIsCreating(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { data, error } = await supabase
      .from('sessions')
      .insert([
        { user_id: user.id, name: `Sesi ${new Date().toLocaleDateString('id-ID')}` }
      ])
      .select()
      .single();

    if (data && !error) {
      router.push(`/session/${data.id}/play`);
    } else {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500 md:p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-black text-app-text tracking-tighter italic uppercase drop-shadow-sm flex items-center gap-4">
          <div className="bg-primary p-3 border-2 border-sport-border shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
            <Activity className="w-8 h-8 text-surface" />
          </div>
          My Dashboard
        </h1>
        <p className="text-muted-text font-bold text-lg italic tracking-tight">Kelola semua sesi permainan Anda dari sini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={handleCreateSession}
          disabled={isCreating}
          className="sport-btn-secondary h-40 flex flex-col items-center justify-center gap-4 text-2xl group shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]"
        >
          {isCreating ? (
            <Loader2 className="w-10 h-10 animate-spin" />
          ) : (
            <Plus className="w-10 h-10 group-hover:scale-125 transition-transform duration-300" />
          )}
          <span>Buat Sesi Baru</span>
        </button>

        <div className="sport-card p-6 md:col-span-2 flex flex-col justify-center items-start border-primary/20 bg-primary-light/10">
          <h3 className="font-black text-2xl uppercase italic tracking-tighter text-app-text mb-2">Selamat Datang di Orto!</h3>
          <p className="text-muted-text font-bold text-sm">Pilih "Buat Sesi Baru" untuk memulai turnamen Anda. Anda bisa mendaftarkan pemain, mengatur durasi, dan mencatat skor secara real-time.</p>
        </div>
      </div>

      <section className="sport-card overflow-hidden">
        <div className="px-8 py-6 border-b-2 border-sport-border bg-app-bg flex items-center gap-4">
          <div className="bg-sport-border p-2.5 border-2 border-sport-border shadow-[3px_3px_0px_0px_rgba(220,38,38,1)]">
            <Calendar className="w-6 h-6 text-surface" />
          </div>
          <h2 className="font-black text-2xl tracking-tight uppercase italic text-app-text">Sesi Saya</h2>
        </div>
        
        <div className="p-8 space-y-6 bg-surface">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div key={session.id} className="relative border-2 border-sport-border/10 rounded-none p-6 bg-surface hover:border-primary transition-all group overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="absolute top-0 right-0 p-2 opacity-5 -rotate-12 translate-x-2 -translate-y-2 group-hover:opacity-10 transition-opacity">
                   <Trophy className="w-24 h-24 text-primary" />
                </div>
                
                <div className="flex-1 w-full relative z-10 text-center md:text-left">
                  <div className="text-[10px] font-black px-2 py-0.5 uppercase tracking-[0.2em] italic border-2 border-sport-border inline-block mb-2 text-primary border-primary bg-primary-light">
                    {session.status}
                  </div>
                  <h3 className="font-black text-app-text text-2xl leading-tight uppercase tracking-tighter italic group-hover:text-primary transition-colors">
                    {session.name}
                  </h3>
                  <p className="text-muted-text font-bold text-sm mt-1">{new Date(session.created_at).toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
                </div>
                
                <div className="relative z-10 w-full md:w-auto">
                  <Link
                    href={`/session/${session.id}/overview`}
                    className="w-full sport-btn-primary py-3 px-8 text-lg inline-flex"
                  >
                    Buka Sesi <PlayCircle className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 flex flex-col items-center gap-4 bg-surface">
               <div className="w-16 h-16 bg-app-bg border-2 border-dashed border-sport-border/20 rounded-full flex items-center justify-center text-sport-border/20">
                  <Activity className="w-8 h-8" />
               </div>
               <p className="text-muted-text text-lg font-bold italic tracking-tight">Belum ada sesi yang dibuat</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
