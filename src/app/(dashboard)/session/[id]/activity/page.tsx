'use client';

import { useStore } from '@/store/useStore';
import { Calendar, History, ArrowRight } from 'lucide-react';

export default function ActivityPage() {
  const { matches } = useStore();

  const completedMatches = matches.filter(m => m.status === 'completed').reverse();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-black text-app-text tracking-tighter italic uppercase flex items-center gap-4 drop-shadow-sm">
          <div className="bg-primary p-3 border-2 border-sport-border shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
            <History className="w-8 h-8 text-surface" />
          </div>
          History Pertandingan
        </h1>
        <p className="text-muted-text font-bold text-lg italic tracking-tight">Rekapitulasi seluruh hasil pertandingan yang telah selesai.</p>
      </div>

      <section className="sport-card overflow-hidden">
        <div className="px-8 py-6 border-b-2 border-sport-border bg-app-bg flex items-center gap-4">
          <div className="bg-sport-border p-2.5 border-2 border-sport-border shadow-[3px_3px_0px_0px_rgba(220,38,38,1)]">
            <Calendar className="w-6 h-6 text-surface" />
          </div>
          <h2 className="font-black text-2xl tracking-tight uppercase italic text-app-text">Log Pertandingan</h2>
        </div>
        
        <div className="p-8 space-y-10 bg-surface">
          {completedMatches.length > 0 ? (
            completedMatches.map((match) => {
              const sA = match.scoreA ?? 0;
              const sB = match.scoreB ?? 0;
              
              return (
                <div key={match.id} className="relative border-2 border-sport-border/10 rounded-none p-10 bg-surface group hover:border-primary transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-5 -rotate-12 translate-x-4 -translate-y-4 group-hover:opacity-10 transition-opacity">
                     <History className="w-32 h-32 text-primary" />
                  </div>
                  <div className="absolute -top-3 left-8 bg-sport-border text-surface text-[12px] font-black px-4 py-1.5 uppercase tracking-[0.3em] italic border-2 border-sport-border shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
                    Match #{match.index}
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-6 relative z-10">
                    <div className="flex-1 text-center md:text-right">
                      <div className="font-black text-app-text text-xl md:text-3xl leading-tight uppercase tracking-tighter italic group-hover:text-primary transition-colors">
                        {match.teamA[0].name}<br />{match.teamA[1].name}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8 px-12 py-6 bg-app-bg border-4 border-sport-border shadow-[6px_6px_0px_0px_rgba(15,23,42,0.1)] -rotate-2 group-hover:rotate-0 transition-all">
                      <span className="text-7xl font-black text-primary italic tracking-tighter drop-shadow-md group-hover:scale-110 transition-transform">{sA}</span>
                      <div className="w-2 h-16 bg-sport-border opacity-20 rotate-12"></div>
                      <span className="text-7xl font-black text-primary italic tracking-tighter drop-shadow-md group-hover:scale-110 transition-transform">{sB}</span>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <div className="font-black text-app-text text-xl md:text-3xl leading-tight uppercase tracking-tighter italic group-hover:text-primary transition-colors">
                        {match.teamB[0].name}<br />{match.teamB[1].name}
                      </div>
                    </div>
                  </div>
                  
                  {/* Result indicator */}
                  <div className="mt-10 pt-6 border-t-2 border-sport-border/10 flex justify-center items-center gap-3">
                     <span className={`text-[12px] font-black uppercase tracking-[0.4em] italic flex items-center gap-3 ${sA > sB ? 'text-success' : sA < sB ? 'text-primary' : 'text-muted-text'}`}>
                        {sA > sB ? (
                          <>TEAM A DOMINATED <ArrowRight className="w-4 h-4" /></>
                        ) : sA < sB ? (
                          <>TEAM B DOMINATED <ArrowRight className="w-4 h-4 rotate-180" /></>
                        ) : (
                          'EQUAL STRENGTH - DRAW'
                        )}
                     </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-28 text-center flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-app-bg border-4 border-dashed border-sport-border/20 rounded-full flex items-center justify-center text-sport-border/20">
                <History className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <p className="text-muted-text text-xl italic font-bold">Belum ada history pertandingan.</p>
                <p className="text-app-text font-black uppercase italic tracking-tighter text-2xl">Mulai sesi main untuk mencatat skor!</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
