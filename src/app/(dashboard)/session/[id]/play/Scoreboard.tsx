'use client';

import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { Match } from '@/lib/schemas';
import { MonitorPlay, Play, Pause, RotateCcw, Plus, Minus, Save, Zap, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface ScoreboardProps {
  match: Match;
}

export default function Scoreboard({ match }: ScoreboardProps) {
  const { session, saveMatchScore } = useStore();
  const [timeLeft, setTimeLeft] = useState(session.durationMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSave = async () => {
    setIsSaving(true);
    const endTime = new Date().toISOString();

    try {
      // 1. Update Match in DB
      const { error: matchError } = await supabase
        .from('matches')
        .update({
          score_a: scoreA,
          score_b: scoreB,
          status: 'completed',
          match_end_at: endTime
        })
        .eq('id', match.id);

      if (matchError) throw matchError;

      // 2. Update involved players' stats in DB
      const updatePlayerStats = async (playerId: string, points: number) => {
        // We need to increment the current values. 
        // Supabase has an 'rpc' for this, but for simplicity let's use the current store values
        const localPlayer = useStore.getState().players.find(p => p.id === playerId);
        if (!localPlayer) return;

        await supabase
          .from('players')
          .update({
            matches_played: localPlayer.matchesPlayed + 1,
            total_points: localPlayer.totalPoints + points
          })
          .eq('id', playerId);
      };

      await Promise.all([
        updatePlayerStats(match.teamA[0].id, scoreA),
        updatePlayerStats(match.teamA[1].id, scoreA),
        updatePlayerStats(match.teamB[0].id, scoreB),
        updatePlayerStats(match.teamB[1].id, scoreB),
      ]);

      // 3. Update Local Store
      saveMatchScore(match.id, scoreA, scoreB, endTime);
      
    } catch (err: any) {
      alert(`Gagal menyimpan hasil: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="sport-card p-10 bg-sport-border border-primary shadow-[10px_10px_0px_0px_rgba(220,38,38,1)] text-surface overflow-hidden relative">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 p-6 opacity-10 -rotate-12 translate-x-6 -translate-y-6">
         <Zap className="w-64 h-64 text-primary" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-center items-center gap-3 text-primary font-black uppercase tracking-[0.3em] text-[11px] mb-10 italic">
          <MonitorPlay className="w-5 h-5" /> Live Match Control
        </div>

        {/* Timer Area */}
        <div className="text-center mb-14">
          <div className={`text-9xl font-black tabular-nums tracking-tighter mb-8 italic transition-all ${timeLeft < 60 && isRunning ? 'text-primary scale-110 animate-pulse' : 'text-surface'}`}>
            {formatTime(timeLeft)}
          </div>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`sport-btn flex items-center gap-3 px-10 py-4 rounded-none shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] text-lg ${
                isRunning 
                  ? 'bg-primary text-surface border-surface' 
                  : 'bg-success text-surface border-surface'
              }`}
            >
              {isRunning ? (
                <><Pause className="w-6 h-6 fill-current" /> Pause</>
              ) : (
                <><Play className="w-6 h-6 fill-current" /> {timeLeft < session.durationMinutes * 60 ? 'Resume' : 'Start Timer'}</>
              )}
            </button>
            <button
              onClick={() => {
                setIsRunning(false);
                setTimeLeft(session.durationMinutes * 60);
              }}
              className="sport-btn bg-surface/10 text-surface/80 border-surface/20 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Score Area */}
        <div className="grid grid-cols-2 gap-10 mb-12">
          {/* Team A */}
          <div className="flex flex-col gap-6">
            <div className="bg-surface/5 border-2 border-surface/20 p-6 text-center h-24 flex items-center justify-center shadow-inner">
              <span className="font-black text-sm md:text-lg uppercase italic tracking-tighter leading-tight text-surface/90">
                {match.teamA[0].name}<br />&<br />{match.teamA[1].name}
              </span>
            </div>
            <div className="flex flex-col items-center gap-6">
              <button
                onClick={() => setScoreA((s) => s + 1)}
                className="w-full h-24 bg-primary text-surface border-2 border-surface shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex items-center justify-center active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all group"
              >
                <Plus className="w-12 h-12 group-hover:scale-125 transition-transform" />
              </button>
              <div className="text-[10rem] font-black text-surface italic tracking-tighter tabular-nums leading-none drop-shadow-[0_8px_8px_rgba(220,38,38,0.5)]">
                {scoreA}
              </div>
              <button
                onClick={() => setScoreA((s) => Math.max(0, s - 1))}
                className="w-2/3 h-12 bg-surface/5 text-surface/60 border-2 border-surface/20 flex items-center justify-center hover:text-surface hover:border-surface transition-all italic font-black uppercase tracking-widest text-xs"
              >
                <Minus className="w-6 h-6 mr-2" /> Decrease
              </button>
            </div>
          </div>

          {/* Team B */}
          <div className="flex flex-col gap-6">
            <div className="bg-surface/5 border-2 border-surface/20 p-6 text-center h-24 flex items-center justify-center shadow-inner">
              <span className="font-black text-sm md:text-lg uppercase italic tracking-tighter leading-tight text-surface/90">
                {match.teamB[0].name}<br />&<br />{match.teamB[1].name}
              </span>
            </div>
            <div className="flex flex-col items-center gap-6">
              <button
                onClick={() => setScoreB((s) => s + 1)}
                className="w-full h-24 bg-primary text-surface border-2 border-surface shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex items-center justify-center active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all group"
              >
                <Plus className="w-12 h-12 group-hover:scale-125 transition-transform" />
              </button>
              <div className="text-[10rem] font-black text-surface italic tracking-tighter tabular-nums leading-none drop-shadow-[0_8px_8px_rgba(220,38,38,0.5)]">
                {scoreB}
              </div>
              <button
                onClick={() => setScoreB((s) => Math.max(0, s - 1))}
                className="w-2/3 h-12 bg-surface/5 text-surface/60 border-2 border-surface/20 flex items-center justify-center hover:text-surface hover:border-surface transition-all italic font-black uppercase tracking-widest text-xs"
              >
                <Minus className="w-6 h-6 mr-2" /> Decrease
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="sport-btn-secondary w-full py-8 text-3xl flex items-center justify-center gap-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] border-surface disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-10 h-10 animate-spin" /> : <Save className="w-10 h-10" />} 
          {isSaving ? 'SAVING...' : 'SUBMIT RESULTS'}
        </button>
      </div>
    </section>
  );
}
