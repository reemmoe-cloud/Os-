import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../ui/Icons';
import { parseSystemIntent } from '../../services/geminiService';

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (id: string, searchParams?: string) => void;
}

export const Spotlight: React.FC<SpotlightProps> = ({ isOpen, onClose, onOpenApp }) => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsProcessing(true);
    const intent = await parseSystemIntent(query);
    
    if (intent.action === 'open' && intent.target) {
      onOpenApp(intent.target);
      onClose();
    } else if (intent.action === 'search' && intent.target) {
      onOpenApp('browser', intent.target);
      onClose();
    } else if (intent.action === 'answer' && intent.content) {
      setQuery(intent.content);
    } else {
      onOpenApp('browser', query);
      onClose();
    }
    setIsProcessing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md pointer-events-auto" onClick={onClose} />
      
      <div className="relative w-full max-w-[600px] glass-panel rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden pointer-events-auto border-white/30 animate-[spotlightSlideIn_0.3s_cubic-bezier(0.2, 0.8, 0.2, 1)]">
        <form onSubmit={handleAction} className="flex items-center gap-4 p-5">
          <Icons.AI size={24} className={isProcessing ? 'text-yellow-500 animate-pulse' : 'text-yellow-600'} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Do anything..."
            className="flex-1 bg-transparent text-xl font-medium outline-none text-gray-800 placeholder-gray-400"
          />
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-black/5 px-2 py-1 rounded">
            <Icons.Command size={10} />
            <span>K</span>
          </div>
        </form>
        
        <div className="px-5 pb-5 flex flex-wrap gap-2">
            <button onClick={() => setQuery('Open browser')} className="px-3 py-1.5 bg-white/50 hover:bg-white rounded-lg text-xs font-medium text-gray-600 border border-black/5 transition-colors">Open browser</button>
            <button onClick={() => setQuery('Take a picture')} className="px-3 py-1.5 bg-white/50 hover:bg-white rounded-lg text-xs font-medium text-gray-600 border border-black/5 transition-colors">Take a picture</button>
            <button onClick={() => setQuery('Yellow OS News')} className="px-3 py-1.5 bg-white/50 hover:bg-white rounded-lg text-xs font-medium text-gray-600 border border-black/5 transition-colors">Search news</button>
            <button onClick={() => setQuery('Open Games')} className="px-3 py-1.5 bg-white/50 hover:bg-white rounded-lg text-xs font-medium text-gray-600 border border-black/5 transition-colors">Open Games</button>
        </div>
      </div>

      <style>{`
        @keyframes spotlightSlideIn {
          from { opacity: 0; transform: translateY(-40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};