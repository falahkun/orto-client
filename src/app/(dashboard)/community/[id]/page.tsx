'use client';

import { useState, useEffect, use } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, Plus, PlayCircle, Calendar, Trophy, Loader2, ArrowLeft, Users, UserPlus, X, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: communityId } = use(params);
  const [activeTab, setActiveTab] = useState<'sessions' | 'members'>('sessions');
  const [community, setCommunity] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Member management state
  const [newMemberName, setNewMemberName] = useState('');
  const [isAddingMember, setIsAddingMember] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [communityId]);

  const fetchData = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Fetch community details
      const { data: commData } = await supabase
        .from('communities')
        .select('*')
        .eq('id', communityId)
        .single();
      
      if (commData) setCommunity(commData);

      // Fetch sessions for this community
      const { data: sessData } = await supabase
        .from('sessions')
        .select('*')
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });

      if (sessData) setSessions(sessData);

      // Fetch members for this community
      const { data: memData } = await supabase
        .from('community_members')
        .select('*')
        .eq('community_id', communityId)
        .order('name', { ascending: true });

      if (memData) setMembers(memData);
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
        { 
          user_id: user.id, 
          community_id: communityId,
          name: `Sesi ${new Date().toLocaleDateString('id-ID')}` 
        }
      ])
      .select()
      .single();

    if (data && !error) {
      router.push(`/session/${data.id}/play`);
    } else {
      setIsCreating(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    setIsAddingMember(true);
    const { data, error } = await supabase
      .from('community_members')
      .insert([{ community_id: communityId, name: newMemberName.trim() }])
      .select()
      .single();

    if (data && !error) {
      setMembers([...members, data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewMemberName('');
    }
    setIsAddingMember(false);
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Hapus member ini? Ini tidak akan menghapus data di sesi yang sudah berjalan.')) return;

    const { error } = await supabase
      .from('community_members')
      .delete()
      .eq('id', id);

    if (!error) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="p-10 text-center space-y-4">
        <h1 className="text-2xl font-black">Komunitas tidak ditemukan</h1>
        <Link href="/dashboard" className="text-primary hover:underline italic uppercase font-bold">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500 md:p-10">
      <div className="flex flex-col gap-4">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 text-muted-text hover:text-app-text transition-colors font-bold uppercase tracking-wider text-xs italic"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
        
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-black text-app-text tracking-tighter italic uppercase drop-shadow-sm flex items-center gap-4">
            <div className="bg-primary p-3 border-2 border-sport-border shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
              <Users className="w-8 h-8 text-surface" />
            </div>
            {community.name}
          </h1>
          <p className="text-muted-text font-bold text-lg italic tracking-tight">Kelola sesi dan anggota komunitas Anda.</p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b-2 border-sport-border/5 pb-2">
        <button
          onClick={() => setActiveTab('sessions')}
          className={cn(
            "px-6 py-3 font-black uppercase italic tracking-tighter text-sm transition-all border-b-4",
            activeTab === 'sessions' 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-text hover:text-app-text"
          )}
        >
          Sesi Permainan
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={cn(
            "px-6 py-3 font-black uppercase italic tracking-tighter text-sm transition-all border-b-4",
            activeTab === 'members' 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-text hover:text-app-text"
          )}
        >
          Daftar Anggota
        </button>
      </div>

      {activeTab === 'sessions' ? (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
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
              <h3 className="font-black text-2xl uppercase italic tracking-tighter text-app-text mb-2">Statistik Komunitas</h3>
              <p className="text-muted-text font-bold text-sm">Total {sessions.length} sesi telah dimainkan. Tambahkan anggota komunitas agar memudahkan saat mendaftarkan pemain di setiap sesi.</p>
            </div>
          </div>

          <section className="sport-card overflow-hidden">
            <div className="px-8 py-6 border-b-2 border-sport-border bg-app-bg flex items-center gap-4">
              <div className="bg-sport-border p-2.5 border-2 border-sport-border shadow-[3px_3px_0px_0px_rgba(220,38,38,1)]">
                <Calendar className="w-6 h-6 text-surface" />
              </div>
              <h2 className="font-black text-2xl tracking-tight uppercase italic text-app-text">Sesi Terakhir</h2>
            </div>
            
            <div className="p-8 space-y-6 bg-surface">
              {sessions.length > 0 ? (
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
                   <p className="text-muted-text text-lg font-bold italic tracking-tight">Belum ada sesi di komunitas ini</p>
                </div>
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Members List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="sport-card p-8 sticky top-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-primary p-2.5 border-2 border-sport-border shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                    <UserPlus className="w-6 h-6 text-surface" />
                  </div>
                  <h2 className="font-black text-2xl tracking-tight uppercase italic text-app-text">Tambah Anggota</h2>
                </div>
                <form onSubmit={handleAddMember} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-black text-muted-text uppercase tracking-[0.2em]">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="sport-input w-full"
                      placeholder="Masukkan nama..."
                      required
                    />
                  </div>
                  <button
                    disabled={isAddingMember}
                    className="w-full sport-btn-primary py-3 flex items-center justify-center gap-2"
                  >
                    {isAddingMember ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                    TAMBAHKAN
                  </button>
                </form>
              </div>
            </div>

            <div className="md:col-span-2">
              <section className="sport-card overflow-hidden h-full min-h-[400px]">
                <div className="px-8 py-6 border-b-2 border-sport-border bg-app-bg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-sport-border p-2.5 border-2 border-sport-border shadow-[3px_3px_0px_0px_rgba(220,38,38,1)]">
                      <User className="w-6 h-6 text-surface" />
                    </div>
                    <h2 className="font-black text-2xl tracking-tight uppercase italic text-app-text">Total Anggota ({members.length})</h2>
                  </div>
                </div>
                
                <div className="p-8">
                  {members.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {members.map((member) => (
                        <div 
                          key={member.id}
                          className="flex items-center justify-between p-4 border-2 border-sport-border/10 bg-surface group hover:border-primary transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary-light flex items-center justify-center border-2 border-primary/20">
                              <span className="font-black text-primary uppercase italic">{member.name.charAt(0)}</span>
                            </div>
                            <span className="font-black uppercase italic tracking-tighter text-app-text">{member.name}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            className="text-muted-text hover:text-primary p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 flex flex-col items-center gap-4">
                      <Users className="w-12 h-12 text-sport-border/20" />
                      <p className="text-muted-text text-lg font-bold italic tracking-tight">Belum ada anggota yang terdaftar</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
