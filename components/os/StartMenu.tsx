import React from 'react';
import { Icons } from '../ui/Icons';
import { AppConfig } from '../../types';

interface StartMenuProps {
  apps: AppConfig[];
  isOpen: boolean;
  onOpenApp: (appId: string) => void;
  onClose: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ apps, isOpen, onOpenApp, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center pb-32 px-4 pointer-events-none">
      {/* Backdrop for clicking outside */}
      <div className="absolute inset-0 pointer-events-auto" onClick={onClose} />
      
      {/* Menu Panel */}
      <div className="glass-panel w-full max-w-[640px] h-[720px] max-h-[80vh] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-[menuSlideUp_0.4s_cubic-bezier(0.2, 0.8, 0.2, 1)] pointer-events-auto border-white/20">
        
        {/* Search Bar */}
        <div className="p-8 pb-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Icons.Search size={18} className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search for apps, settings, and documents"
              className="w-full bg-white/50 border border-black/5 rounded-full py-3 pl-12 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Pinned Apps Grid */}
        <div className="flex-1 overflow-y-auto px-8 py-4 scrollbar-hide">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-gray-800">Pinned</h3>
            <button className="text-xs bg-white/40 hover:bg-white/60 px-3 py-1 rounded-md border border-black/5 transition-colors font-medium">All apps</button>
          </div>
          
          <div className="grid grid-cols-6 gap-y-8 gap-x-2">
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={() => {
                  onOpenApp(app.id);
                  onClose();
                }}
                className="flex flex-col items-center gap-2 group transition-transform active:scale-95"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{ backgroundColor: app.color }}
                >
                  <app.icon size={24} strokeWidth={2} />
                </div>
                <span className="text-[11px] font-medium text-gray-700 text-center w-full truncate px-1">
                  {app.name}
                </span>
              </button>
            ))}
          </div>

          {/* Recommended Section */}
          <div className="mt-12 mb-6">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-gray-800">Recommended</h3>
                <button className="text-xs bg-white/40 hover:bg-white/60 px-3 py-1 rounded-md border border-black/5 transition-colors font-medium">More</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/40 transition-colors cursor-pointer group">
                <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center text-yellow-900">
                  <Icons.Notes size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800">Project Alpha</span>
                  <span className="text-[10px] text-gray-500">Recently edited</span>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/40 transition-colors cursor-pointer group">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-yellow-900">
                  <Icons.Cat size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800">Cat Browser</span>
                  <span className="text-[10px] text-gray-500">Top Sites</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile / Power Footer */}
        <div className="p-6 px-10 bg-black/5 border-t border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold text-yellow-900 border border-white/50">
              YU
            </div>
            <span className="text-xs font-bold text-gray-800 group-hover:underline">Yellow User</span>
          </div>
          <button className="p-2 hover:bg-black/10 rounded-lg transition-colors text-gray-700">
            <Icons.Power size={18} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes menuSlideUp {
          from {
            opacity: 0;
            transform: translateY(100px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};