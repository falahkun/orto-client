import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Navigation from "@/components/Navigation";
import Link from 'next/link';
import { Trophy, Users } from 'lucide-react';

export default async function SessionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    notFound();
  }

  // 2. Fetch session and check ownership
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('*, communities(name)')
    .eq('id', id)
    .single();

  if (sessionError || !session) {
    notFound();
  }

  if (session.user_id !== user.id) {
    notFound();
  }

  const community = (session as any).communities;

  return (
    <div className="min-h-screen bg-app-bg p-4 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
        
        {/* Redesigned Header matching Dashboard style */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-2">
            {community && (
              <Link 
                href={`/community/${session.community_id}`}
                className="text-[10px] font-black text-muted-text hover:text-primary transition-colors uppercase tracking-[0.2em] italic flex items-center gap-1 mb-1"
              >
                <Users className="w-3 h-3" /> {community.name}
              </Link>
            )}
            <h1 className="text-4xl md:text-5xl font-black text-app-text tracking-tighter italic uppercase drop-shadow-sm flex items-center gap-4">
              <div className="bg-primary p-3 border-2 border-sport-border shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                <Trophy className="w-8 h-8 text-surface" />
              </div>
              <span className="truncate max-w-[300px] md:max-w-none">{session.name}</span>
            </h1>
            <div className="flex items-center gap-3">
              <div className="text-[10px] font-black px-2 py-0.5 uppercase tracking-[0.2em] italic border-2 border-sport-border inline-block text-primary border-primary bg-primary-light">
                {session.status}
              </div>
              <p className="text-muted-text font-bold text-sm italic leading-none">
                Dibuat {new Date(session.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
              </p>
            </div>
          </div>

          {/* Quick Stats Box */}
          {/* <div className="flex sport-card p-4 bg-surface/50 items-center gap-6 border-dashed border-sport-border/20"> */}
             {/* <div className="text-right">
                <p className="text-[10px] font-black text-muted-text uppercase tracking-widest leading-tight">Duration</p>
                <p className="text-xl font-black text-app-text italic tracking-tighter uppercase leading-tight">{session.duration_minutes}M</p>
             </div>
             <div className="w-px h-8 bg-sport-border/10"></div>
             <div className="text-right">
                <p className="text-[10px] font-black text-muted-text uppercase tracking-widest leading-tight">Target</p>
                <p className="text-xl font-black text-app-text italic tracking-tighter uppercase leading-tight">{session.target_matches_per_player}X</p>
             </div> */}
          {/* </div> */}
        </div>

        {/* Horizontal Navigation under Trophy Header */}
        <Navigation />

        <div className="pt-2">
          {children}
        </div>
        
      </div>
    </div>
  );
}
