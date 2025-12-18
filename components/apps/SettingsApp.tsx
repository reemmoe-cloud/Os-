import React, { useState } from 'react';
import { Icons } from '../ui/Icons';

export const SettingsApp: React.FC = () => {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const SettingRow = ({ icon: Icon, color, label, value, type = 'toggle', onClick }: any) => (
    <div 
        className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-0"
        onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-md text-white`} style={{ backgroundColor: color }}>
          <Icon size={16} />
        </div>
        <span className="text-gray-900 font-medium text-sm">{label}</span>
      </div>
      
      {type === 'toggle' && (
        <div 
            className={`w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out ${value ? 'bg-green-500' : 'bg-gray-200'}`}
            onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
        >
          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${value ? 'translate-x-5' : 'translate-x-0'}`} />
        </div>
      )}
      
      {type === 'link' && (
        <div className="flex items-center gap-2 text-gray-400">
           {value && <span className="text-sm">{value}</span>}
           <Icons.ChevronRight size={16} />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-full bg-gray-100 font-sans">
      {/* Sidebar / Main List */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

            {/* Profile */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm mb-6">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-900 text-2xl font-bold">
                    YO
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Yellow User</h2>
                    <p className="text-gray-500 text-sm">user@yellowos.com</p>
                </div>
            </div>

            {/* Connectivity */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <SettingRow 
                    icon={Icons.Wifi} 
                    color="#3B82F6" 
                    label="Wi-Fi" 
                    value={wifi} 
                    onClick={() => setWifi(!wifi)} 
                />
                <SettingRow 
                    icon={Icons.Bluetooth} 
                    color="#3B82F6" 
                    label="Bluetooth" 
                    value={bluetooth} 
                    onClick={() => setBluetooth(!bluetooth)} 
                />
                <SettingRow 
                    icon={Icons.Device} 
                    color="#10B981" 
                    label="Cellular Data" 
                    type="link" 
                    value="5G" 
                />
            </div>

            {/* Display & Sound */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <SettingRow 
                    icon={Icons.Bell} 
                    color="#EF4444" 
                    label="Notifications" 
                    type="link" 
                />
                 <SettingRow 
                    icon={Icons.Moon} 
                    color="#6366F1" 
                    label="Dark Mode" 
                    value={darkMode} 
                    onClick={() => setDarkMode(!darkMode)} 
                />
                <SettingRow 
                    icon={Icons.Sun} 
                    color="#F59E0B" 
                    label="Display & Brightness" 
                    type="link" 
                />
            </div>

            {/* Privacy */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <SettingRow 
                    icon={Icons.Privacy} 
                    color="#6B7280" 
                    label="Privacy & Security" 
                    type="link" 
                />
                 <SettingRow 
                    icon={Icons.AppStore} 
                    color="#3B82F6" 
                    label="App Store" 
                    type="link" 
                    value="2 Updates"
                />
            </div>

            <p className="text-center text-gray-400 text-sm pt-4">Yellow OS v1.0.0 (Build 240)</p>
        </div>
      </div>
    </div>
  );
};