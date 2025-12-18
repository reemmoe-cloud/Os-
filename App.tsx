import React, { useState, useEffect, useMemo } from 'react';
import { StatusBar } from './components/os/StatusBar';
import { Dock } from './components/os/Dock';
import { AppWindow } from './components/os/AppWindow';
import { StartMenu } from './components/os/StartMenu';
import { Spotlight } from './components/os/Spotlight';
import { BrowserApp } from './components/apps/BrowserApp';
import { WorkApp } from './components/apps/WorkApp';
import { SettingsApp } from './components/apps/SettingsApp';
import { AppStoreApp } from './components/apps/AppStoreApp';
import { GamesApp } from './components/apps/GamesApp';
import { CameraApp } from './components/apps/CameraApp';
import { PhotosApp } from './components/apps/PhotosApp';
import { ExcelApp } from './components/apps/ExcelApp';
import { Icons } from './components/ui/Icons';
import { AppConfig } from './types';

export default function App() {
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  // App Definitions - Memoized to prevent unnecessary re-renders
  const APPS = useMemo<AppConfig[]>(() => [
    {
      id: 'browser',
      name: 'Cat Browser',
      icon: Icons.Cat,
      color: '#F59E0B',
      component: <BrowserApp />,
    },
    {
      id: 'excel',
      name: 'XL Cat',
      icon: Icons.Excel,
      color: '#15803d',
      component: <ExcelApp />,
    },
    {
      id: 'games',
      name: 'Games',
      icon: Icons.Game,
      color: '#EF4444',
      component: <GamesApp />,
    },
    {
      id: 'camera',
      name: 'Camera',
      icon: Icons.Camera,
      color: '#1f2937',
      component: <CameraApp />,
    },
    {
      id: 'photos',
      name: 'Photos',
      icon: Icons.Photos,
      color: '#EC4899',
      component: <PhotosApp />,
    },
    {
      id: 'appstore',
      name: 'App Store',
      icon: Icons.AppStore,
      color: '#3B82F6',
      component: <AppStoreApp />,
    },
    {
      id: 'notes',
      name: 'Work',
      icon: Icons.Notes,
      color: '#3B82F6',
      component: <WorkApp />,
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: Icons.Settings,
      color: '#6B7280',
      component: <SettingsApp />,
    },
    {
      id: 'mail',
      name: 'Mail',
      icon: Icons.Mail,
      color: '#10B981',
      component: <div className="h-full flex items-center justify-center bg-gray-50 text-gray-400">Inbox Empty</div>,
    }
  ], []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSpotlightOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSpotlightOpen(false);
        setIsStartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openApp = (id: string) => {
    setActiveAppId(id);
    setIsStartOpen(false);
    setIsSpotlightOpen(false);
  };

  const closeApp = () => setActiveAppId(null);
  const toggleStartMenu = () => setIsStartOpen(!isStartOpen);

  const activeApp = useMemo(() => APPS.find(app => app.id === activeAppId), [activeAppId, APPS]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#F59E0B]">
      {/* Dynamic Wallpaper - Pre-optimized for instant feel */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000"
        style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2874&auto=format&fit=crop')`,
            filter: activeAppId || isStartOpen || isSpotlightOpen ? 'blur(20px) scale(1.05)' : 'none'
        }} 
      />
      
      {/* Gradient Overlay for Aesthectics */}
      <div className="absolute inset-0 bg-black/10 mix-blend-multiply z-[1] pointer-events-none" />

      {/* OS UI Layer */}
      <StatusBar onOpenSpotlight={() => setIsSpotlightOpen(true)} />

      {/* App Layer */}
      {activeApp && (
        <AppWindow 
            app={activeApp} 
            isOpen={!!activeAppId} 
            onClose={closeApp} 
        />
      )}

      {/* Spotlight Overlay */}
      <Spotlight 
        isOpen={isSpotlightOpen} 
        onClose={() => setIsSpotlightOpen(false)} 
        onOpenApp={openApp}
      />

      {/* Start Menu Overlay */}
      <StartMenu 
        apps={APPS} 
        isOpen={isStartOpen} 
        onOpenApp={openApp} 
        onClose={() => setIsStartOpen(false)} 
      />

      {/* Dock Layer */}
      <Dock 
        apps={APPS} 
        onOpenApp={openApp} 
        onToggleStart={toggleStartMenu} 
        isStartOpen={isStartOpen}
      />
      
      <style>{`
        @keyframes scale-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}