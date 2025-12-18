import React from 'react';
import { Icons } from '../ui/Icons';
import { AppConfig } from '../../types';

interface DockProps {
  apps: AppConfig[];
  onOpenApp: (appId: string) => void;
  onToggleStart: () => void;
  isStartOpen: boolean;
}

export const Dock: React.FC<DockProps> = ({ apps, onOpenApp, onToggleStart, isStartOpen }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70]">
      <div className="glass-panel flex items-end gap-3 p-3 rounded-[1.75rem] shadow-2xl transition-all duration-300 ease-out hover:scale-[1.01]">
        
        {/* Start Button */}
        <button
          onClick={onToggleStart}
          className={`group relative flex flex-col items-center gap-1 transition-transform duration-200 hover:-translate-y-1.5 active:scale-90 ${isStartOpen ? '-translate-y-1' : ''}`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-yellow-900 shadow-lg transition-all duration-300 ${isStartOpen ? 'bg-yellow-400 shadow-yellow-500/30' : 'bg-white/80 hover:bg-white'}`}>
            <Icons.Start size={28} strokeWidth={2} />
          </div>
          <span className="absolute -top-10 bg-black/75 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm">
            Start
          </span>
        </button>

        <div className="w-[1px] h-10 bg-black/10 self-center mx-1" />

        {/* App Icons */}
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => onOpenApp(app.id)}
            className="group relative flex flex-col items-center gap-1 transition-transform duration-200 hover:-translate-y-1.5 active:scale-95"
          >
            <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:shadow-xl"
                style={{ backgroundColor: app.color }}
            >
              <app.icon size={26} strokeWidth={1.5} />
            </div>
            <div className="w-1 h-1 bg-white/50 rounded-full opacity-0 group-active:opacity-100 transition-opacity absolute -bottom-2"></div>
            {/* Tooltip */}
            <span className="absolute -top-10 bg-black/75 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm">
                {app.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};