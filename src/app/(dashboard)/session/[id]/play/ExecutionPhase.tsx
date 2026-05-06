'use client';

import { useStore } from '@/store/useStore';
import { Radio, List, Flag, AlertCircle, Loader2 } from 'lucide-react';
import Scoreboard from './Scoreboard';
import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function ExecutionPhase() {
  const { matches, activeMatchId, startMatch, endSession } = useStore();
  const supabase = createClient();
  const params = useParams();
  const sessionId = params.id as string;
  const [isUpdating, setIsUpdating] = useState(false);

  const completedCount = matches.filter((m) => m.status === 'completed').length;
  const activeMatch = matches.find((m) => m.id === activeMatchId);
  const pendingMatches = matches.filter((m) => m.status !== 'completed');

  const handleStartMatch = async (matchId: string) => {
    setIsUpdating(true);
    const startTime = new Date().toISOString();
    
    // 1. Update DB
    const { error } = await supabase
      .from('matches')
      .update({ 
        status: 'active',
        match_start_at: startTime
      })
      .eq('id', matchId);

    if (error) {
      alert(`Gagal memulai pertandingan: ${error.message}`);
    } else {
      // 2. Update Local Store
      startMatch(matchId, startTime);
    }
    setIsUpdating(false);
  };

  const handleEndSession = async () => {
    if (!confirm('Yakin ingin mengakhiri sesi? Semua jadwal belum main akan dihapus.')) return;
    
    setIsUpdating(true);
    // 1. Update DB
    const { error } = await supabase
      .from('sessions')
      .update({ status: 'completed' })
      .eq('id', sessionId);

    if (error) {
      alert(`Gagal mengakhiri sesi: ${error.message}`);
    } else {
      // 2. Update Local Store
      endSession();
    }
    setIsUpdating(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-5xl font-black text-app-text tracking-tighter italic uppercase flex items-center gap-4">
            <div className="relative">
              <div className="bg-primary-light p-3 border-2 border-sport-border shadow-[3px_3px_0px_0px_rgba(220,38,38,1)]">
                <Radio className="w-8 h-8 text-primary animate-pulse" />
              </div>
            </div>
            Sesi Berjalan
          </h2>
          <p className="text-muted-text font-bold text-lg italic tracking-tight">Pantau antrean dan catat hasil pertandingan secara real-time.</p>
        </div>
        
        <button
          onClick={handleEndSession}
          disabled={isUpdating}
          className="sport-btn bg-surface text-primary border-primary shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] hover:bg-primary-light text-xs py-3 px-6 disabled:opacity-50"
        >
          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />} 
          Akhiri Sesi
        </button>
      </div>

      {/* Scoreboard Controller */}
      {activeMatch && (
        <div className="animate-in zoom-in-95 duration-500">
          <Scoreboard match={activeMatch} />
        </div>
      )}

      {/* Pending Matches List */}
      <section className="sport-card overflow-hidden">
        <div className="px-8 py-6 border-b-2 border-sport-border bg-app-bg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <div className="bg-sport-border p-2.5 border-2 border-sport-border shadow-[3px_3px_0px_0px_rgba(220,38,38,1)]">
              <List className="w-6 h-6 text-surface" />
            </div>
            <h2 className="font-black text-2xl tracking-tight uppercase italic text-app-text">Antrean Pertandingan</h2>
          </div>
          <div className="flex items-center gap-3 bg-primary text-surface px-5 py-2 font-black italic text-lg tracking-tighter border-2 border-sport-border shadow-[4px_4px_0px_0px_rgba(15,23,42,0.1)]">
            <Flag className="w-5 h-5" /> {completedCount}/{matches.length} SELESAI
          </div>
        </div>
        
        <div className="p-8 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 bg-surface">
          {pendingMatches.length > 0 ? (
            pendingMatches.map((match) => {
              const isActive = match.id === activeMatchId;
              
              return (
                <div
                  key={match.id}
                  className={`relative border-2 rounded-none p-8 transition-all group ${
                    isActive
                      ? 'border-primary bg-primary-light/30 shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] translate-x-[-3px] translate-y-[-3px]'
                      : 'border-sport-border/20 bg-surface hover:border-sport-border hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,0.05)]'
                  }`}
                >
                  <div className={`absolute -top-3 left-6 text-surface text-[11px] font-black px-3 py-1 uppercase tracking-[0.2em] italic border-2 border-sport-border shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] ${isActive ? 'bg-primary' : 'bg-sport-border'}`}>
                    Match #{match.index}
                  </div>
                  
                  {isActive && (
                    <div className="absolute top-4 right-6 flex items-center gap-2 bg-primary text-surface text-[10px] font-black px-3 py-1 rounded-none uppercase tracking-[0.2em] italic animate-pulse border-2 border-surface shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                      LIVE NOW
                    </div>
                  )}
                  
                  <div className="flex flex-col md:flex-row items-center justify-between text-center gap-8 mt-4">
                    <div className="flex-1">
                      <div className="font-black text-app-text text-lg md:text-2xl leading-tight uppercase tracking-tighter italic group-hover:text-primary transition-colors">
                        {match.teamA[0].name}<br />{match.teamA[1].name}
                      </div>
                    </div>
                    
                    <div className="relative">
                       <div className="w-14 h-14 border-4 border-sport-border rounded-full flex items-center justify-center font-black text-lg text-app-text bg-surface z-10 relative italic rotate-[-12deg]">
                        VS
                      </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-1 bg-sport-border/10 -z-0"></div>
                    </div>

                    <div className="flex-1">
                      <div className="font-black text-app-text text-lg md:text-2xl leading-tight uppercase tracking-tighter italic group-hover:text-primary transition-colors">
                        {match.teamB[0].name}<br />{match.teamB[1].name}
                      </div>
                    </div>
                  </div>

                  {!activeMatchId && !isActive && (
                    <button
                      onClick={() => handleStartMatch(match.id)}
                      disabled={isUpdating}
                      className="sport-btn-primary w-full mt-10 text-xl py-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] disabled:opacity-50"
                    >
                      {isUpdating ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Mulai Game Ini'}
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-20 text-center flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center border-4 border-success text-success shadow-xl shadow-success/20">
                 <Flag className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <p className="text-success font-black text-3xl uppercase italic tracking-tighter">
                  Sesi Selesai!
                </p>
                <p className="text-muted-text font-bold text-lg italic">Semua pertandingan telah tuntas dilaksanakan.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
