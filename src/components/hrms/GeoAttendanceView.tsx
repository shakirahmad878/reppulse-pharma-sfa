import React, { useState } from 'react';
import { AttendanceRecord, User } from '../../types';
import { Badge } from '../common/Badge';
import { 
  UserCheck, 
  MapPin, 
  Clock, 
  Camera, 
  Battery, 
  CheckCircle2, 
  Calendar,
  Navigation,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface GeoAttendanceViewProps {
  currentUser: User;
}

export const GeoAttendanceView: React.FC<GeoAttendanceViewProps> = ({ currentUser }) => {
  const [isPunchedIn, setIsPunchedIn] = useState(true);
  const [punchInTime, setPunchInTime] = useState('09:02 AM');
  const [punchOutTime, setPunchOutTime] = useState<string | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([
    {
      id: 'att-01',
      userId: currentUser.id,
      userName: currentUser.name,
      date: '2026-09-05',
      punchInTime: '09:02 AM',
      punchInLocation: {
        latitude: 19.0550,
        longitude: 72.8280,
        address: 'Bandra West Field HQ, Mumbai',
      },
      selfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      batteryPercentage: 94,
      totalDistanceKm: 38.4,
      status: 'PRESENT',
    },
    {
      id: 'att-02',
      userId: currentUser.id,
      userName: currentUser.name,
      date: '2026-09-04',
      punchInTime: '08:58 AM',
      punchOutTime: '06:45 PM',
      punchInLocation: {
        latitude: 19.0552,
        longitude: 72.8281,
        address: 'Linking Road Start, Bandra West',
      },
      selfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      batteryPercentage: 96,
      totalDistanceKm: 42.1,
      status: 'PRESENT',
    }
  ]);

  const handlePunchToggle = () => {
    if (isPunchedIn) {
      // Punch Out
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setPunchOutTime(timeNow);
      setIsPunchedIn(false);
      setAttendanceHistory(prev => [
        {
          ...prev[0],
          punchOutTime: timeNow,
        },
        ...prev.slice(1)
      ]);
    } else {
      // Punch In
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setPunchInTime(timeNow);
      setPunchOutTime(null);
      setIsPunchedIn(true);
      const newRec: AttendanceRecord = {
        id: `att-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        date: new Date().toISOString().split('T')[0],
        punchInTime: timeNow,
        punchInLocation: {
          latitude: 19.0550,
          longitude: 72.8280,
          address: 'Bandra West, Mumbai',
        },
        selfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        batteryPercentage: 92,
        totalDistanceKm: 0,
        status: 'PRESENT',
      };
      setAttendanceHistory(prev => [newRec, ...prev]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-teal-600" />
            Field Geo-Attendance & Shift Controls
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Geotagged selfie punch-in, GPS shift start verification, and duty status for field personnel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isPunchedIn ? 'success' : 'neutral'} size="md">
            {isPunchedIn ? '🟢 On Duty (Active Shift)' : '⚪ Off Duty'}
          </Badge>
        </div>
      </div>

      {/* Main Action Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-[10px] uppercase tracking-wider font-bold text-teal-400 bg-teal-500/20 px-2 py-0.5 rounded border border-teal-500/30">
            Automated 15-Min Telemetry Linked
          </span>
          <h3 className="text-xl font-bold">{isPunchedIn ? 'Field Shift In Progress' : 'Ready to Start Field Duty'}</h3>
          <p className="text-xs text-slate-300 max-w-lg">
            {isPunchedIn
              ? `Punched in today at ${punchInTime}. 15-minute background location pings are active and verifying doctor visits.`
              : 'Punch in with GPS verification to begin recording doctor calls and automated travel allowance.'}
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-teal-400" /> Shift: 09:00 AM – 06:30 PM</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-teal-400" /> Territory: {currentUser.territoryName}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 shrink-0">
          <button
            onClick={handlePunchToggle}
            className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
              isPunchedIn
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-500/30'
            }`}
          >
            <Camera className="w-4 h-4" />
            {isPunchedIn ? 'Punch Out (End Duty)' : 'Geo-Punch In (Start Shift)'}
          </button>
          <span className="text-[11px] text-slate-400">Captures GPS coordinates & selfie</span>
        </div>
      </div>

      {/* Attendance History Logs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            Attendance & GPS Shift Logbook
          </h3>
          <span className="text-xs text-slate-500">Monthly Attendance: <strong>100%</strong></span>
        </div>

        <div className="space-y-3">
          {attendanceHistory.map((att) => (
            <div
              key={att.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <img
                  src={att.selfieUrl}
                  alt="Selfie"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-300 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{att.date}</span>
                    <Badge variant="success">Present</Badge>
                  </div>
                  <p className="text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {att.punchInLocation.address}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t md:border-t-0 pt-2 md:pt-0 border-slate-200">
                <div>
                  <span className="text-slate-400 text-[11px] block">In / Out Time:</span>
                  <span className="font-semibold text-slate-800">
                    {att.punchInTime} – {att.punchOutTime || 'Active'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Verified GPS Route:</span>
                  <span className="font-semibold text-teal-700 font-mono">
                    {att.totalDistanceKm} km
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Battery at Start:</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <Battery className="w-3.5 h-3.5 text-emerald-600" /> {att.batteryPercentage}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
