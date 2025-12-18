import React, { useState, useEffect } from 'react';
import { Icons } from '../ui/Icons';
import { performBrowserSearch } from '../../services/geminiService';

export const BrowserApp: React.FC = () => {
  const [url, setUrl] = useState('https://catbrowser.meow');
  const [inputUrl, setInputUrl] = useState('https://catbrowser.meow');
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(['https://catbrowser.meow']);

  useEffect(() => {
    handleNavigate(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNavigate = async (targetUrl: string) => {
    setIsLoading(true);
    let query = targetUrl;
    if (!targetUrl.startsWith('http') && !targetUrl.includes('.')) {
      query = `Search results for: ${targetUrl}`;
    }
    
    const result = await performBrowserSearch(query);
    setContent(result);
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUrl(inputUrl);
    setHistory(prev => [...prev, inputUrl]);
    handleNavigate(inputUrl);
  };

  return (
    <div className="flex flex-col h-full bg-white text-gray-900 font-sans">
      {/* Browser Toolbar */}
      <div className="flex flex-col bg-gray-100 border-b border-gray-300">
        <div className="flex items-center gap-3 p-3">
          <div className="flex gap-2 text-gray-500">
            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors"><Icons.Back size={18} /></button>
            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors"><Icons.Forward size={18} /></button>
            <button 
              onClick={() => handleNavigate(url)}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <Icons.Refresh size={18} className={isLoading ? 'animate-spin text-yellow-500' : ''} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex-1">
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Icons.Cat size={16} className="text-yellow-600" />
              </div>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-800 text-sm rounded-full focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 block pl-10 p-2.5 shadow-sm transition-all"
                placeholder="Search with Cat Browser..."
              />
            </div>
          </form>
        </div>
        
        {/* Subtle loading indicator */}
        <div className="h-[2px] w-full bg-gray-200 overflow-hidden">
            {isLoading && <div className="h-full bg-yellow-500 animate-[browserLoading_1.5s_infinite_ease-in-out]" />}
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 overflow-y-auto relative bg-white">
        {content ? (
          <div 
            className={`prose prose-yellow max-w-none p-8 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
            dangerouslySetInnerHTML={{ __html: content }} 
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Icons.Cat size={64} className="mb-4 opacity-20" />
            <p>Ready to explore the Meow-eb</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes browserLoading {
            0% { transform: translateX(-100%); width: 30%; }
            50% { transform: translateX(50%); width: 60%; }
            100% { transform: translateX(100%); width: 30%; }
        }
      `}</style>
    </div>
  );
};