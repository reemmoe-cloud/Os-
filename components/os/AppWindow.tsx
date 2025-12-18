import React from 'react';
import { Icons } from '../ui/Icons';
import { AppConfig } from '../../types';

interface AppWindowProps {
  app: AppConfig;
  onClose: () => void;
  isOpen: boolean;
}

export const AppWindow: React.FC<AppWindowProps> = ({ app, onClose, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 pt-10 pb-24 animate-[scale-in_0.3s_ease-out]">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full h-full max-w-[95%] max-h-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col transform transition-all">
        {/* Window Handle / Header (iPad style home indicator logic is mostly at bottom, but we add a close header for usability) */}
        <div className="h-6 bg-gray-100 flex items-center justify-center group relative">
            <div className="w-16 h-1 bg-gray-300 rounded-full mt-1"></div>
            <button 
                onClick={onClose}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors"
            >
                <Icons.Close size={14} />
            </button>
        </div>

        {/* App Content */}
        <div className="flex-1 overflow-hidden relative">
            {app.component}
        </div>

        {/* Home Indicator Overlay */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/20 rounded-full pointer-events-none mix-blend-difference" />
      </div>
    </div>
  );
};