import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { OfflineSyncService } from '../../services/offlineSyncService';
import { Shield, Radio, Activity, Wifi, WifiOff, RefreshCw, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onRoleChange: (newRole: UserRole) => void;
  isSimulatingTelemetry: boolean;
  onTriggerTelemetryPing: () => void;
  onOpenDemoTour?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onRoleChange,
  isSimulatingTelemetry,
  onTriggerTelemetryPing,
  onOpenDemoTour,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingQueueCount, setPendingQueueCount] = useState(0);

  useEffect(() => {
    const unsub = OfflineSyncService.subscribe(setPendingQueueCount);
    return () => unsub();
  }, []);

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    if (!isOnline) {
      // Sync flushed
      const { syncedCount } = OfflineSyncService.flushQueue();
      if (syncedCount > 0) {
        alert(`Network Restored! Flushed ${syncedCount} queued reports successfully.`);
      }
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Platform Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <Activity className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">SefMed Pro</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded border border-teal-500/30">
                Enterprise SFA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Pharma Sales Force Automation & Location Intelligence</p>
          </div>
        </div>

        {/* Action Controls & Simulator Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Platform Guided Tour Modal Trigger */}
          {onOpenDemoTour && (
            <button
              onClick={onOpenDemoTour}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 transition-all shadow-sm shadow-teal-500/20"
              title="Start Interactive Guided Tour"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span>Guided Tour</span>
            </button>
          )}

          {/* Offline Mode Toggle Simulator */}
          <button
            onClick={handleToggleOnline}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isOnline 
                ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' 
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
            }`}
            title="Toggle online / offline field simulator"
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden md:inline">{isOnline ? 'Online' : 'Offline Mode'}</span>
            {pendingQueueCount > 0 && (
              <span className="bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full font-bold text-[10px]">
                {pendingQueueCount}
              </span>
            )}
          </button>

          {/* 15-Min Telemetry Trigger Button */}
          <button
            onClick={onTriggerTelemetryPing}
            disabled={isSimulatingTelemetry}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 transition-colors shadow-sm"
            title="Simulates an automatic 15-minute background GPS location ping from field MR"
          >
            <Radio className={`w-3.5 h-3.5 ${isSimulatingTelemetry ? 'animate-ping text-teal-400' : 'text-teal-400'}`} />
            <span className="hidden lg:inline">Simulate 15-Min GPS</span>
          </button>

          {/* Role Switcher Sandbox for Testing RBAC */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
            <Shield className="w-3.5 h-3.5 text-slate-400 ml-1.5 hidden sm:block" />
            <select
              value={currentUser.role}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-slate-900 text-xs font-semibold text-teal-300 rounded border border-slate-700 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer"
            >
              <option value="SUPER_ADMIN">👑 Super Admin</option>
              <option value="AREA_MANAGER">👔 Area Manager</option>
              <option value="MEDICAL_REP">🏃 Field MR</option>
            </select>
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-xs text-teal-300">
              {currentUser.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
