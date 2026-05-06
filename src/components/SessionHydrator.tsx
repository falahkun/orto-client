'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

interface SessionHydratorProps {
  sessionId: string;
}

export default function SessionHydrator({ sessionId }: SessionHydratorProps) {
  const hydrateSession = useStore((state) => state.hydrateSession);
  const resetState = useStore((state) => state.resetState);
  const [isHydrating, setIsHydrating] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const performHydration = async () => {
      // 1. Clear current state to avoid stale data
      resetState();
      localStorage.clear();

      // 2. Fetch fresh data from DB
      const { data: sessionData } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (!sessionData) {
        setIsHydrating(false);
        return;
      }

      const { data: dbPlayers } = await supabase
        .from('players')
        .select('*')
        .eq('session_id', sessionId);

      const { data: dbMatches } = await supabase
        .from('matches')
        .select('*')
        .eq('session_id', sessionId)
        .order('index', { ascending: true });

      if (dbPlayers) {
        const finalPlayers = dbPlayers.map(p => ({
          id: p.id,
          communityMemberId: p.community_member_id,
          name: p.name,
          matchesPlayed: p.matches_played,
          totalPoints: p.total_points,
        }));

        const finalMatches = (dbMatches || []).map(m => {
          const pA1 = finalPlayers.find(p => p.id === m.team_a_player1_id);
          const pA2 = finalPlayers.find(p => p.id === m.team_a_player2_id);
          const pB1 = finalPlayers.find(p => p.id === m.team_b_player1_id);
          const pB2 = finalPlayers.find(p => p.id === m.team_b_player2_id);

          // We check if players exist (they should, but for safety)
          if (!pA1 || !pA2 || !pB1 || !pB2) return null;

          return {
            id: m.id,
            index: m.index,
            teamA: [pA1, pA2],
            teamB: [pB1, pB2],
            scoreA: m.score_a,
            scoreB: m.score_b,
            status: m.status as any,
            matchStartAt: m.match_start_at,
            matchEndAt: m.match_end_at,
          };
        }).filter(Boolean) as any[];

        hydrateSession(
          finalPlayers,
          finalMatches,
          {
            isActive: sessionData.status === 'active',
            durationMinutes: sessionData.duration_minutes,
            targetMatchesPerPlayer: sessionData.target_matches_per_player
          }
        );
      }

      setIsHydrating(false);
    };

    performHydration();
  }, [sessionId, hydrateSession, resetState]);

  if (isHydrating) {
    return (
      <div className="fixed inset-0 bg-app-bg z-[100] flex flex-col items-center justify-center gap-6">
        <div className="bg-primary p-6 border-4 border-sport-border shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
          <Loader2 className="w-16 h-16 text-surface animate-spin" />
        </div>
        <p className="text-2xl font-black uppercase italic tracking-tighter text-app-text animate-pulse">
          Syncing with Database...
        </p>
      </div>
    );
  }

  return null;
}
