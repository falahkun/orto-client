'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Users, Settings, Plus, X, Shuffle, User } from 'lucide-react';

export default function SetupPhase() {
  const { players, addPlayer, removePlayer, generateSession } = useStore();
  const [playerName, setPlayerName] = useState('');
  const [matchesPerPlayer, setMatchesPerPlayer] = useState(4);
  const [duration, setDuration] = useState(10);

  const handleAddPlayer = () => {
    if (!playerName.trim()) return;
    addPlayer(playerName.trim());
    setPlayerName('');
  };

  const handleStartSession = () => {
    if (players.length < 4) {
      alert('Minimal 4 pemain untuk mulai sesi!');
      return;
    }
    generateSession(matchesPerPlayer, duration);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-black text-app-text tracking-tighter italic uppercase drop-shadow-sm">Setup Sesi</h1>
        <p className="text-muted-text font-bold text-lg">Daftarkan pemain dan atur parameter pertandingan.</p>
      </div>

      {/* Players Input */}
      <section className="sport-card p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-primary p-2.5 border-2 border-sport-border shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
            <Users className="w-6 h-6 text-surface" />
          </div>
          <h2 className="font-black text-2xl tracking-tight uppercase italic text-app-text">1. Input Daftar Pemain</h2>
        </div>
        
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
            placeholder="Ketik nama pemain..."
            className="sport-input flex-1 text-xl"
          />
          <button
            onClick={handleAddPlayer}
            className="sport-btn-primary px-8 text-lg"
          >
            <Plus className="w-6 h-6" /> Tambah
          </button>
        </div>

        <div className="flex flex-wrap gap-4 min-h-[50px]">
          {players.length > 0 ? (
            players.map((player) => (
              <span
                key={player.id}
                className="bg-sport-border text-surface px-5 py-2.5 border-2 border-sport-border font-black uppercase italic tracking-tight flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] transition-transform hover:translate-x-[-2px] hover:translate-y-[-2px]"
              >
                <User className="w-5 h-5 text-primary" />
                {player.name}
                <button
                  onClick={() => removePlayer(player.id)}
                  className="text-surface/40 hover:text-primary transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </span>
            ))
          ) : (
            <div className="w-full flex items-center justify-center py-8 border-2 border-dashed border-sport-border/20 bg-app-bg rounded-none">
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
          className="w-full sport-btn-secondary py-6 text-2xl group shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]"
        >
          <Shuffle className="w-8 h-8 group-hover:rotate-180 transition-transform duration-700" /> 
          Generate Jadwal & Mulai Sesi
        </button>
      </section>
    </div>
  );
}
