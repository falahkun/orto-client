'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { BarChart2, PlayCircle, History, Home } from 'lucide-react';
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
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 transition-all font-black uppercase tracking-tight text-xs border-2 cursor-pointer whitespace-nowrap",
                  isActive 
                    ? "bg-primary text-surface border-sport-border shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] translate-x-[-2px] translate-y-[-2px]" 
                    : "bg-surface text-muted-text border-sport-border/10 hover:border-primary hover:text-primary"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-surface" : "text-muted-text")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <Link 
          href="/dashboard" 
          className="sport-btn bg-white text-muted-text border-sport-border/20 shadow-[2px_2px_0px_0px_rgba(15,23,42,0.1)] hover:bg-slate-50 text-[10px] py-2"
        >
          <Home className="w-3.5 h-3.5 mr-2" /> EXIT SESSION
        </Link>
      </div>
      
      {/* Decorative separator line */}
      <div className="w-full h-1 bg-sport-border/5 rounded-full relative overflow-hidden">
         <div className="absolute top-0 left-0 h-full bg-primary/20 w-full animate-pulse"></div>
      </div>
    </div>
  );
}
