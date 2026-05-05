'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, PlayCircle, History, Activity } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { href: '/', label: 'Overview', icon: BarChart2 },
  { href: '/play', label: 'Sesi Main', icon: PlayCircle },
  { href: '/activity', label: 'Activity', icon: History },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-surface border-t-2 md:border-t-0 md:border-r-2 border-sport-border fixed bottom-0 md:relative w-full md:w-72 h-24 md:h-screen flex flex-row md:flex-col items-center md:items-stretch justify-around md:justify-start z-50 md:pt-10">
      <div className="hidden md:flex items-center gap-3 px-8 pb-8 mb-6 border-b-2 border-sport-border text-primary font-black text-3xl uppercase italic tracking-tighter">
        <Activity className="w-10 h-10" /> AmericanoPro
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
