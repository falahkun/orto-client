import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, Match, Session } from '@/lib/schemas';

interface AppState {
  players: Player[];
  matches: Match[];
  session: Session;
  activeMatchId: string | null;
  
  // Actions
  addPlayer: (name: string, communityMemberId?: string) => void;
  removePlayer: (id: string) => void;
  generateSession: (matchesPerPlayer: number, duration: number) => void;
  endSession: () => void;
  startMatch: (matchId: string) => void;
  saveMatchScore: (matchId: string, scoreA: number, scoreB: number) => void;
  resetState: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      players: [],
      matches: [],
      session: { isActive: false, durationMinutes: 10, targetMatchesPerPlayer: 4 },
      activeMatchId: null,

      addPlayer: (name: string, communityMemberId?: string) => {
        const { players } = get();
        // Prevent duplicate if same name or same community member
        if (players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
          return;
        }
        if (communityMemberId && players.some((p) => p.communityMemberId === communityMemberId)) {
          return;
        }
        
        const newPlayer: Player = {
          id: Date.now().toString(),
          communityMemberId,
          name,
          matchesPlayed: 0,
          totalPoints: 0,
        };
        set({ players: [...players, newPlayer] });
      },

      removePlayer: (id: string) => {
        set((state) => ({
          players: state.players.filter((p) => p.id !== id),
        }));
      },

      generateSession: (matchesPerPlayer: number, duration: number) => {
        const { players } = get();
        if (players.length < 4) return;

        const totalSlotsNeeded = players.length * matchesPerPlayer;
        const totalMatchesRequired = Math.ceil(totalSlotsNeeded / 4);

        let scheduleCounts: Record<string, number> = {};
        players.forEach((p) => (scheduleCounts[p.id] = 0));
        let newMatches: Match[] = [];

        for (let i = 0; i < totalMatchesRequired; i++) {
          let available = [...players].sort((a, b) => {
            if (scheduleCounts[a.id] === scheduleCounts[b.id]) return Math.random() - 0.5;
            return scheduleCounts[a.id] - scheduleCounts[b.id];
          });

          let selected = available.slice(0, 4);
          selected.forEach((p) => scheduleCounts[p.id]++);
          selected.sort(() => Math.random() - 0.5);

          newMatches.push({
            id: 'M' + Date.now() + i,
            index: i + 1,
            teamA: [selected[0], selected[1]],
            teamB: [selected[2], selected[3]],
            scoreA: null,
            scoreB: null,
            status: 'pending',
          });
        }

        set({
          matches: newMatches,
          session: { isActive: true, durationMinutes: duration, targetMatchesPerPlayer: matchesPerPlayer },
          players: players.map((p) => ({ ...p, matchesPlayed: 0, totalPoints: 0 })),
          activeMatchId: null,
        });
      },

      endSession: () => {
        set((state) => ({
          session: { ...state.session, isActive: false },
          matches: state.matches.filter((m) => m.status === 'completed'),
          activeMatchId: null,
        }));
      },

      startMatch: (matchId: string) => {
        set((state) => ({
          activeMatchId: matchId,
          matches: state.matches.map((m) =>
            m.id === matchId ? { ...m, status: 'active' } : m
          ),
        }));
      },

      saveMatchScore: (matchId: string, scoreA: number, scoreB: number) => {
        set((state) => {
          const match = state.matches.find((m) => m.id === matchId);
          if (!match) return state;

          const updatedMatches = state.matches.map((m) =>
            m.id === matchId
              ? { ...m, scoreA, scoreB, status: 'completed' as const }
              : m
          );

          const updatedPlayers = state.players.map((p) => {
            let matchesPlayed = p.matchesPlayed;
            let totalPoints = p.totalPoints;

            if (match.teamA.some((tp) => tp.id === p.id)) {
              matchesPlayed++;
              totalPoints += scoreA;
            } else if (match.teamB.some((tp) => tp.id === p.id)) {
              matchesPlayed++;
              totalPoints += scoreB;
            }

            return { ...p, matchesPlayed, totalPoints };
          });

          return {
            matches: updatedMatches,
            players: updatedPlayers,
            activeMatchId: null,
          };
        });
      },

      resetState: () => {
        set({
          players: [],
          matches: [],
          session: { isActive: false, durationMinutes: 10, targetMatchesPerPlayer: 4 },
          activeMatchId: null,
        });
      },
    }),
    {
      name: 'americano-pro-tracker',
    }
  )
);
