import React from 'react';
import { Icons } from '../ui/Icons';

export const AppStoreApp: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white text-gray-900 font-sans overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <h1 className="text-xl font-bold flex items-center gap-2">
                <Icons.AppStore className="text-blue-500" /> 
                App Store
            </h1>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Icons.User size={16} className="text-gray-500" />
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Hero Banner - Cat Browser */}
            <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition-transform hover:scale-[1.01]">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-600"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                    <span className="text-yellow-200 font-bold text-xs uppercase tracking-wider mb-2">Editor's Choice</span>
                    <h2 className="text-3xl font-bold mb-2">Cat Browser 3.0</h2>
                    <p className="text-yellow-50 mb-4 max-w-md">The most purr-fect way to browse the meow-eb. Instant loading, no fluff.</p>
                    <button className="bg-white text-yellow-600 font-bold py-2 px-6 rounded-full w-max hover:bg-gray-100 transition-colors">
                        OPEN
                    </button>
                </div>
                <div className="absolute top-8 right-8 text-white/10">
                    <Icons.Cat size={128} />
                </div>
            </div>

            {/* Horizontal Scroll Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Popular Apps</h3>
                    <button className="text-blue-500 text-sm font-medium">See All</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                     {/* Cat Browser Card */}
                    <div className="flex-shrink-0 w-40 flex flex-col gap-2">
                        <div className="w-40 h-40 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-500 mb-1">
                            <Icons.Cat size={48} />
                        </div>
                        <span className="font-medium text-sm">Cat Browser</span>
                        <span className="text-xs text-gray-500">Utilities</span>
                    </div>

                    {/* Work Card */}
                    <div className="flex-shrink-0 w-40 flex flex-col gap-2">
                        <div className="w-40 h-40 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-500 mb-1">
                            <Icons.Notes size={48} />
                        </div>
                        <span className="font-medium text-sm">Work</span>
                        <span className="text-xs text-gray-500">Productivity</span>
                    </div>

                    {/* Camera Card */}
                    <div className="flex-shrink-0 w-40 flex flex-col gap-2">
                        <div className="w-40 h-40 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500 mb-1">
                            <Icons.Camera size={48} />
                        </div>
                        <span className="font-medium text-sm">Camera</span>
                        <span className="text-xs text-gray-500">Photo & Video</span>
                    </div>
                </div>
            </div>

             {/* List Section */}
             <div>
                <h3 className="text-xl font-bold mb-4">New Updates</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                        <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-500">
                            <Icons.Mail size={24} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold">Mail</h4>
                            <p className="text-sm text-gray-500">Stay connected with the world.</p>
                        </div>
                        <button className="bg-gray-100 text-blue-500 font-bold py-1 px-4 rounded-full text-sm hover:bg-gray-200">
                            UPDATE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};