import Link from 'next/link';
import { Activity, Trophy, Users, Zap, Timer, ChevronRight, Play } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-app-bg">
      {/* Navbar */}
      <nav className="border-b-4 border-sport-border bg-surface sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 text-primary font-black text-2xl uppercase italic tracking-tighter">
            <Activity className="w-8 h-8" /> Orto
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="font-black uppercase tracking-widest text-xs text-muted-text hover:text-primary transition-colors">
              Log In
            </Link>
            <Link href="/register" className="sport-btn-primary px-6 py-2 text-xs">
              Join Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b-4 border-sport-border bg-surface">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 skew-x-[-12deg] translate-x-20"></div>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-32 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-block bg-cta text-app-text px-4 py-1 border-2 border-sport-border font-black uppercase italic tracking-[0.2em] text-[10px] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              The Ultimate Padel Tracker
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-app-text leading-[0.9] tracking-tighter uppercase italic">
              Track Your <span className="text-primary underline decoration-8 underline-offset-4 decoration-primary/20">Victory</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-text font-bold italic leading-tight max-w-md">
              Ubah hobi anda jadi profesional. Skor real-time, statistik otomatis, dan riwayat kemenangan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register" className="sport-btn-primary py-5 px-10 text-xl group shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                Get Started Free <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="sport-btn-outline py-5 px-10 text-xl shadow-[8px_8px_0px_0px_rgba(15,23,42,0.1)] hover:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                Live Demo
              </Link>
            </div>
          </div>

          <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-300">
            <div className="sport-card p-4 bg-sport-border rotate-2 shadow-[12px_12px_0px_0px_rgba(220,38,38,1)]">
               {/* Abstract Sport Shape/Mockup Placeholder */}
               <div className="aspect-square bg-surface border-4 border-sport-border flex items-center justify-center relative overflow-hidden group">
                  <Zap className="w-40 h-40 text-primary opacity-10 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
                    <div className="bg-primary text-surface px-6 py-2 font-black italic uppercase tracking-widest text-lg border-2 border-sport-border">LIVE SCORE</div>
                    <div className="text-8xl font-black italic tracking-tighter text-sport-border">21-18</div>
                    <div className="text-muted-text font-bold uppercase tracking-widest">Match #04 Underway</div>
                  </div>
                  {/* Decorative lines */}
                  <div className="absolute bottom-0 left-0 w-full h-2 bg-primary"></div>
                  <div className="absolute top-0 right-0 w-2 h-full bg-cta"></div>
               </div>
            </div>
            {/* Float Badge */}
            <div className="absolute -bottom-6 -left-6 sport-card p-6 bg-cta border-sport-border shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -rotate-3 animate-bounce">
               <Trophy className="w-10 h-10 text-app-text" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-10">
          <div className="sport-card p-8 space-y-4 hover:border-primary transition-colors group">
            <div className="bg-primary/10 p-4 border-2 border-primary/20 inline-block group-hover:bg-primary group-hover:border-sport-border transition-all">
              <Users className="w-8 h-8 text-primary group-hover:text-surface" />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tight">Fair Matchmaking</h3>
            <p className="text-muted-text font-bold italic leading-snug">Algoritma otomatis yang memastikan setiap pemain mendapatkan lawan dan partner yang adil di setiap sesi.</p>
          </div>

          <div className="sport-card p-8 space-y-4 hover:border-cta transition-colors group">
            <div className="bg-cta/10 p-4 border-2 border-cta/20 inline-block group-hover:bg-cta group-hover:border-sport-border transition-all">
              <Timer className="w-8 h-8 text-cta group-hover:text-app-text" />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tight">Real-time Clock</h3>
            <p className="text-muted-text font-bold italic leading-snug">Kontrol durasi pertandingan dengan timer terintegrasi. Fokus pada rally, biarkan kami urus waktunya.</p>
          </div>

          <div className="sport-card p-8 space-y-4 hover:border-primary transition-colors group">
            <div className="bg-primary/10 p-4 border-2 border-primary/20 inline-block group-hover:bg-primary group-hover:border-sport-border transition-all">
              <Play className="w-8 h-8 text-primary group-hover:text-surface" />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tight">Instant Stats</h3>
            <p className="text-muted-text font-bold italic leading-snug">Lihat klasemen sementara langsung setelah setiap game selesai. Update poin otomatis tanpa delay.</p>
          </div>
        </div>
      </section>

      {/* Social Proof / Numbers */}
      <section className="bg-sport-border py-16 text-surface border-y-8 border-primary">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
             <div className="text-5xl font-black italic tracking-tighter text-cta">1.2k+</div>
             <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Matches Tracked</div>
          </div>
          <div className="space-y-1">
             <div className="text-5xl font-black italic tracking-tighter text-cta">450+</div>
             <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Active Players</div>
          </div>
          <div className="space-y-1">
             <div className="text-5xl font-black italic tracking-tighter text-cta">99%</div>
             <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Accuracy Rate</div>
          </div>
          <div className="space-y-1">
             <div className="text-5xl font-black italic tracking-tighter text-cta">24/7</div>
             <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Live Support</div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 text-center space-y-10 px-6">
         <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter max-w-2xl mx-auto leading-none"> Ready to rule the court?</h2>
         <p className="text-xl text-muted-text font-bold italic max-w-xl mx-auto">Gabung dengan komunitas Orto dan mulailah melacak performa Anda seperti pro.</p>
         <div className="flex justify-center">
            <Link href="/register" className="sport-btn-secondary py-6 px-16 text-3xl shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
              START TRACKING NOW
            </Link>
         </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-sport-border py-12 bg-surface">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-3 text-sport-border font-black text-xl uppercase italic tracking-tighter">
            <Activity className="w-6 h-6" /> Orto
          </div>
          <div className="text-muted-text font-bold text-sm italic">
            © 2026 Orto Pro Tracker. All Rights Reserved.
          </div>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-muted-text">
             <a href="#" className="hover:text-primary">Privacy</a>
             <a href="#" className="hover:text-primary">Terms</a>
             <a href="#" className="hover:text-primary">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
