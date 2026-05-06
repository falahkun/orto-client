'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Plus, PlayCircle, Trophy, Loader2, ArrowRight, LogOut } from 'lucide-react';
import { checkCommunityLimit } from '@/lib/limits';

export default function DashboardIndexPage() {
  const [communities, setCommunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setCommunities(data);
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommunityName.trim()) return;

    setIsCreating(true);
    
    // Check limit
    const canCreate = await checkCommunityLimit();
    if (!canCreate) {
      alert('Limit komunitas tercapai. Silakan upgrade plan Anda.');
      setIsCreating(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { data, error } = await supabase
      .from('communities')
      .insert([
        { user_id: user.id, name: newCommunityName.trim() }
      ])
      .select()
      .single();

    if (data && !error) {
      setCommunities([data, ...communities]);
      setShowCreateModal(false);
      setNewCommunityName('');
    }
    setIsCreating(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-black text-app-text tracking-tighter italic uppercase drop-shadow-sm flex items-center gap-4">
            <div className="bg-primary p-3 border-2 border-sport-border shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
              <Users className="w-8 h-8 text-surface" />
            </div>
            My Communities
          </h1>
          <p className="text-muted-text font-bold text-lg italic tracking-tight">Kelola grup dan klub olahraga Anda.</p>
        </div>

        <button
          onClick={handleLogout}
          className="sport-btn-outline px-6 py-3 flex items-center gap-2 text-sm shadow-[4px_4px_0px_0px_rgba(15,23,42,0.1)] hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
        >
          <LogOut className="w-4 h-4" />
          LOGOUT
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => setShowCreateModal(true)}
          className="sport-btn-secondary h-40 flex flex-col items-center justify-center gap-4 text-2xl group shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]"
        >
          <Plus className="w-10 h-10 group-hover:scale-125 transition-transform duration-300" />
          <span>Buat Komunitas</span>
        </button>

        <div className="sport-card p-6 md:col-span-2 flex flex-col justify-center items-start border-primary/20 bg-primary-light/10">
          <h3 className="font-black text-2xl uppercase italic tracking-tighter text-app-text mb-2">Pusat Komunitas Orto</h3>
          <p className="text-muted-text font-bold text-sm">Pilih komunitas untuk melihat sesi permainan, statistik anggota, dan riwayat turnamen. Semua sesi sekarang dikelompokkan berdasarkan komunitas.</p>
        </div>
      </div>

      <section className="sport-card overflow-hidden">
        <div className="px-8 py-6 border-b-2 border-sport-border bg-app-bg flex items-center gap-4">
          <div className="bg-sport-border p-2.5 border-2 border-sport-border shadow-[3px_3px_0px_0px_rgba(220,38,38,1)]">
            <Trophy className="w-6 h-6 text-surface" />
          </div>
          <h2 className="font-black text-2xl tracking-tight uppercase italic text-app-text">Komunitas Saya</h2>
        </div>
        
        <div className="p-8 space-y-6 bg-surface">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : communities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {communities.map((community) => (
                <Link
                  key={community.id}
                  href={`/community/${community.id}`}
                  className="relative border-2 border-sport-border/10 rounded-none p-6 bg-surface hover:border-primary transition-all group overflow-hidden flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-black text-app-text text-2xl leading-tight uppercase tracking-tighter italic group-hover:text-primary transition-colors">
                      {community.name}
                    </h3>
                    <p className="text-muted-text font-bold text-sm mt-1 uppercase tracking-widest text-[10px]">
                      Dibuat pada {new Date(community.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-muted-text group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 flex flex-col items-center gap-4 bg-surface">
               <div className="w-16 h-16 bg-app-bg border-2 border-dashed border-sport-border/20 rounded-full flex items-center justify-center text-sport-border/20">
                  <Users className="w-8 h-8" />
               </div>
               <p className="text-muted-text text-lg font-bold italic tracking-tight">Belum ada komunitas yang dibuat</p>
            </div>
          )}
        </div>
      </section>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="sport-card w-full max-w-md p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-app-text">Baru Komunitas</h2>
            <form onSubmit={handleCreateCommunity} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[11px] font-black text-muted-text uppercase tracking-[0.2em]">
                  Nama Komunitas
                </label>
                <input
                  autoFocus
                  type="text"
                  value={newCommunityName}
                  onChange={(e) => setNewCommunityName(e.target.value)}
                  className="sport-input w-full text-lg"
                  placeholder="Padel Club Jakarta"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-4 font-black uppercase italic tracking-wider text-muted-text hover:text-app-text transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-[2] sport-btn-primary py-4 text-xl flex items-center justify-center gap-3"
                >
                  {isCreating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                  CREATE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
