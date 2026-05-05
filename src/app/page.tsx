'use client';

import { useStore } from '@/store/useStore';
import { Trophy, Zap, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function OverviewPage() {
  const { players, matches } = useStore();

  const sortedPlayers = [...players].sort((a, b) => b.totalPoints - a.totalPoints || a.matchesPlayed - b.matchesPlayed);
  const completedMatches = matches.filter(m => m.status === 'completed').reverse();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
      {/* Header section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-black text-app-text tracking-tighter italic uppercase drop-shadow-sm">Dashboard</h1>
        <p className="text-muted-text font-bold text-lg">Pantau performa dan hasil pertandingan terbaru.</p>
      </div>

      {/* Leaderboard Card */}
      <section className="sport-card overflow-hidden">
        <div className="px-8 py-6 border-b-2 border-sport-border bg-app-bg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-2.5 border-2 border-sport-border shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
              <Trophy className="w-6 h-6 text-surface" />
            </div>
            <h2 className="font-black text-2xl tracking-tight uppercase italic text-app-text">Klasemen Sementara</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-sport-border text-surface uppercase text-[12px] font-black tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">#</th>
                <th className="px-8 py-5">Pemain</th>
                <th className="px-8 py-5 text-center">Main</th>
                <th className="px-8 py-5 text-center">Poin</th>
                <th className="px-8 py-5 text-center">Avg</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-sport-border/10 font-bold bg-surface">
              {sortedPlayers.length > 0 ? (
                sortedPlayers.map((player, index) => {
                  const avg = player.matchesPlayed === 0 ? 0 : (player.totalPoints / player.matchesPlayed).toFixed(1);
                  let rankStyles = 'text-app-text';
                  if (index === 0) {
                    rankStyles = 'text-gold';
                  } else if (index === 1) {
                    rankStyles = 'text-silver';
                  } else if (index === 2) {
                    rankStyles = 'text-bronze';
                  }

                  return (
                    <tr key={player.id} className="hover:bg-app-bg transition-colors group">
                      <td className={`px-8 py-6 font-black text-2xl italic tracking-tighter ${rankStyles}`}>{index + 1}</td>
                      <td className="px-8 py-6">
                        <span className="font-black text-app-text text-xl uppercase tracking-tighter italic group-hover:text-primary transition-colors">{player.name}</span>
                      </td>
                      <td className="px-8 py-6 text-center text-muted-text text-lg">{player.matchesPlayed}</td>
                      <td className="px-8 py-6 text-center">
                        <span className="bg-primary text-surface px-4 py-1.5 border-2 border-sport-border font-black rounded-none shadow-[3px_3px_0px_0px_rgba(15,23,42,0.1)] group-hover:shadow-[3px_3px_0px_0px_rgba(220,38,38,0.2)]">
                          {player.totalPoints}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center text-muted-text italic font-black">{avg}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-muted-text italic font-bold text-lg bg-surface">
                    Belum ada data sesi yang berjalan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Activity Card */}
      <section className="sport-card overflow-hidden">
        <div className="px-8 py-6 border-b-2 border-sport-border bg-app-bg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-cta p-2.5 border-2 border-sport-border shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
              <Zap className="w-6 h-6 text-app-text" />
            </div>
            <h2 className="font-black text-2xl tracking-tight uppercase italic text-app-text">Recent Activity</h2>
          </div>
          <Link href="/activity" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-text hover:text-primary transition-colors">
            Lihat Semua <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="p-8 space-y-8 bg-surface">
          {completedMatches.length > 0 ? (
            completedMatches.slice(0, 3).map((match) => (
              <div key={match.id} className="relative border-2 border-sport-border/10 rounded-none p-6 bg-surface hover:border-primary transition-all group">
                <div className="absolute top-0 right-0 p-2 opacity-5 -rotate-12 translate-x-2 -translate-y-2 group-hover:opacity-10 transition-opacity">
                   <Activity className="w-20 h-20 text-primary" />
                </div>
                <div className="absolute -top-3 left-6 bg-sport-border text-surface text-[11px] font-black px-3 py-1 uppercase tracking-[0.2em] italic border-2 border-sport-border shadow-[3px_3px_0px_0px_rgba(220,38,38,1)]">
                  Match #{match.index}
                </div>
                <div className="flex items-center justify-between mt-4 relative z-10">
                  <div className="flex-1 text-center">
                    <div className="font-black text-app-text text-base md:text-xl leading-tight uppercase tracking-tighter italic group-hover:text-primary transition-colors">
                      {match.teamA[0].name}<br />{match.teamA[1].name}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 px-10">
                    <span className="text-5xl font-black text-primary italic tracking-tighter drop-shadow-md group-hover:scale-110 transition-transform">{match.scoreA ?? 0}</span>
                    <div className="w-1.5 h-12 bg-sport-border opacity-10 rotate-12"></div>
                    <span className="text-5xl font-black text-primary italic tracking-tighter drop-shadow-md group-hover:scale-110 transition-transform">{match.scoreB ?? 0}</span>
                  </div>

                  <div className="flex-1 text-center">
                    <div className="font-black text-app-text text-base md:text-xl leading-tight uppercase tracking-tighter italic group-hover:text-primary transition-colors">
                      {match.teamB[0].name}<br />{match.teamB[1].name}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 flex flex-col items-center gap-4 bg-surface">
               <div className="w-16 h-16 bg-app-bg border-2 border-dashed border-sport-border/20 rounded-full flex items-center justify-center text-sport-border/20">
                  <Zap className="w-8 h-8" />
               </div>
               <p className="text-muted-text text-lg font-bold italic tracking-tight">Belum ada pertandingan selesai</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

import { Activity } from 'lucide-react';
