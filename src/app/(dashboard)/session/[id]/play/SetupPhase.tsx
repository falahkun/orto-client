'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Users, Settings, Plus, X, Shuffle, User, UserPlus, Search, Loader2 } from 'lucide-react';

export default function SetupPhase() {
  const params = useParams();
  const sessionId = params.id as string;
  const supabase = createClient();
  
  const { players, addPlayer, removePlayer, generateSession } = useStore();
  const [playerName, setPlayerName] = useState('');
  const [matchesPerPlayer, setMatchesPerPlayer] = useState(4);
  const [duration, setDuration] = useState(10);
  
  // Community members state
  const [communityMembers, setCommunityMembers] = useState<any[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCommunityMembers();
  }, [sessionId]);

  const fetchCommunityMembers = async () => {
    setIsLoadingMembers(true);
    
    // 1. Get session to find community_id
    const { data: session } = await supabase
      .from('sessions')
      .select('community_id')
      .eq('id', sessionId)
      .single();
      
    if (session?.community_id) {
      // 2. Get members of that community
      const { data: members } = await supabase
        .from('community_members')
        .select('*')
        .eq('community_id', session.community_id)
        .order('name', { ascending: true });
        
      if (members) setCommunityMembers(members);
    }
    setIsLoadingMembers(false);
  };

  const handleAddGuest = () => {
    if (!playerName.trim()) return;
    addPlayer(playerName.trim());
    setPlayerName('');
  };

  const handleAddMember = (member: any) => {
    addPlayer(member.name, member.id);
  };

  const handleStartSession = () => {
    if (players.length < 4) {
      alert('Minimal 4 pemain untuk mulai sesi!');
      return;
    }
    generateSession(matchesPerPlayer, duration);
  };

  const filteredMembers = communityMembers.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !players.some(p => p.communityMemberId === m.id)
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-black text-app-text tracking-tighter italic uppercase drop-shadow-sm">Setup Sesi</h1>
        <p className="text-muted-text font-bold text-lg">Daftarkan pemain dan atur parameter pertandingan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Players List & Guest Input */}
          <section className="sport-card p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-primary p-2.5 border-2 border-sport-border shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                <Users className="w-6 h-6 text-surface" />
              </div>
              <h2 className="font-black text-2xl tracking-tight uppercase italic text-app-text">1. Daftar Pemain Sesi</h2>
            </div>

            <div className="flex gap-4 mb-8">
              <div className="relative flex-1">
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text" />
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddGuest()}
                  placeholder="Tambah Guest Player..."
                  className="sport-input w-full pl-12 text-lg"
                />
              </div>
              <button
                onClick={handleAddGuest}
                className="sport-btn-primary px-8 text-lg"
              >
                TAMBAH GUEST
              </button>
            </div>

            <div className="flex flex-wrap gap-4 min-h-[100px] p-6 bg-app-bg/50 border-2 border-dashed border-sport-border/10">
              {players.length > 0 ? (
                players.map((player) => (
                  <span
                    key={player.id}
                    className="bg-sport-border text-surface px-5 py-2.5 border-2 border-sport-border font-black uppercase italic tracking-tight flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] transition-transform hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  >
                    <div className="flex items-center gap-2">
                      {player.communityMemberId ? <Users className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-surface/60" />}
                      {player.name}
                    </div>
                    <button
                      onClick={() => removePlayer(player.id)}
                      className="text-surface/40 hover:text-primary transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </span>
                ))
              ) : (
                <div className="w-full flex items-center justify-center py-8">
                  <p className="text-muted-text text-lg italic font-bold tracking-tight">Belum ada pemain yang terdaftar</p>
                </div>
              )}
            </div>
          </section>

          {/* Session Settings */}
          <section className="sport-card p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-cta p-2.5 border-2 border-sport-border shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                <Settings className="w-6 h-6 text-app-text" />
              </div>
              <h2 className="font-black text-2xl tracking-tight uppercase italic text-app-text">2. Pengaturan Sesi</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-3">
                <label className="block text-[11px] font-black text-muted-text uppercase tracking-[0.2em]">
                  Main Tiap Pemain (Maks)
                </label>
                <input
                  type="number"
                  value={matchesPerPlayer}
                  onChange={(e) => setMatchesPerPlayer(parseInt(e.target.value) || 1)}
                  min="1"
                  className="sport-input w-full text-2xl"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-[11px] font-black text-muted-text uppercase tracking-[0.2em]">
                  Durasi per game (Menit)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                  min="1"
                  className="sport-input w-full text-2xl"
                />
              </div>
            </div>

            <button
              onClick={handleStartSession}
              disabled={players.length < 4}
              className="w-full sport-btn-secondary py-6 text-2xl group shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] disabled:opacity-50 disabled:grayscale"
            >
              <Shuffle className="w-8 h-8 group-hover:rotate-180 transition-transform duration-700" /> 
              Generate Jadwal & Mulai Sesi
            </button>
          </section>
        </div>

        {/* Community Members Selection */}
        <div className="lg:col-span-1">
          <section className="sport-card h-full flex flex-col overflow-hidden sticky top-10">
            <div className="px-6 py-5 border-b-2 border-sport-border bg-app-bg">
              <h2 className="font-black text-xl tracking-tight uppercase italic text-app-text flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" /> Pilih Member
              </h2>
            </div>
            
            <div className="p-4 border-b-2 border-sport-border/5 bg-surface">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari member..."
                  className="sport-input w-full pl-10 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[600px] no-scrollbar">
              {isLoadingMembers ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => handleAddMember(member)}
                    className="w-full flex items-center justify-between p-4 border-2 border-sport-border/10 bg-surface hover:border-primary group transition-all"
                  >
                    <span className="font-black uppercase italic tracking-tighter text-app-text text-sm">{member.name}</span>
                    <Plus className="w-4 h-4 text-muted-text group-hover:text-primary transition-colors" />
                  </button>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-text text-xs font-bold italic">
                    {searchTerm ? 'Member tidak ditemukan' : 'Semua member terpilih'}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-primary-light/30 border-t-2 border-sport-border/5">
              <p className="text-[10px] font-bold text-muted-text italic">
                * Member komunitas memudahkan pendaftaran pemain antar sesi.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
