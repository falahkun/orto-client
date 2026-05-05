'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { BarChart2, PlayCircle, History, Activity, Home } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navigation() {
  const pathname = usePathname();
  const params = useParams();
  const sessionId = params.id as string;

  const navItems = [
    { href: `/session/${sessionId}/overview`, label: 'Overview', icon: BarChart2 },
    { href: `/session/${sessionId}/play`, label: 'Sesi Main', icon: PlayCircle },
    { href: `/session/${sessionId}/activity`, label: 'Activity', icon: History },
  ];

  return (
    <nav className="bg-surface border-t-2 md:border-t-0 md:border-r-2 border-sport-border fixed bottom-0 md:relative w-full md:w-72 h-24 md:h-screen flex flex-row md:flex-col items-center md:items-stretch justify-around md:justify-start z-50 md:pt-10">
      <div className="hidden md:flex flex-col items-start gap-4 px-8 pb-8 mb-6 border-b-2 border-sport-border">
        <div className="flex items-center gap-3 text-primary font-black text-3xl uppercase italic tracking-tighter">
          <Activity className="w-10 h-10" /> AmericanoPro
        </div>
        <Link href="/dashboard" className="flex items-center gap-2 text-muted-text hover:text-primary transition-colors text-sm font-bold">
          <Home className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
      </div>
      
      <div className="flex md:flex-col w-full md:px-4 gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-5 w-full py-4 md:px-5 transition-all font-black uppercase tracking-tight text-[11px] md:text-base border-2 border-transparent cursor-pointer",
                isActive 
                  ? "text-surface md:bg-primary md:border-sport-border md:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] md:translate-x-[-3px] md:translate-y-[-3px]" 
                  : "text-muted-text hover:text-primary hover:md:bg-primary-light/50"
              )}
            >
              <Icon className={cn("w-7 h-7 md:w-6 md:h-6", isActive ? "text-primary md:text-surface" : "text-muted-text")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
