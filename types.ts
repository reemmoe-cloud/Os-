import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface AppConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  component: React.ReactNode;
}

export type AppID = 'browser' | 'notes' | 'settings' | 'camera' | 'photos' | 'mail' | 'appstore' | 'games' | 'excel';

export interface SystemState {
  activeApp: string | null;
  brightness: number;
  volume: number;
  wifi: boolean;
  bluetooth: boolean;
}