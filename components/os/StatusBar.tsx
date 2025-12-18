import React, { useState, useEffect } from 'react';
import { Icons } from '../ui/Icons';

interface StatusBarProps {
  onOpenSpotlight: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({ onOpenSpotlight }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-8 w-full bg-black/20 backdrop-blur-md text-white flex items-center justify-between px-6 text-xs font-medium select-none z-50 fixed top-0 left-0">
      <div className="flex items-center gap-4">
        <span className="font-bold tracking-wide">Yellow OS</span>
        <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSpotlight}
          className="hover:bg-white/10 p-1 rounded-md transition-colors flex items-center gap-2"
        >
          <Icons.Search size={14} />
          <span className="text-[10px] opacity-70">Cmd+K</span>
        </button>
        <div className="flex items-center gap-3">
          <Icons.Wifi size={14} />
          <div className="flex items-center gap-1">
              <span className="text-[10px]">100%</span>
              <Icons.Battery size={14} className="rotate-90" />
          </div>
        </div>
      </div>
    </div>
  );
};