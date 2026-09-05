import React from 'react';
import { Territory, User } from '../../types';
import { Badge } from '../common/Badge';
import { Map, Users, Stethoscope, Store, UserCheck } from 'lucide-react';

interface TerritoryStaffViewProps {
  territories: Territory[];
  users: User[];
}

export const TerritoryStaffView: React.FC<TerritoryStaffViewProps> = ({ territories, users }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Map className="w-5 h-5 text-teal-600" />
            Territory & Field Force Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Territory boundaries, headquarter allocations, and assigned field staff.
          </p>
        </div>
        <Badge variant="primary" size="md">{territories.length} Active Territories</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {territories.map((terr) => {
          const manager = users.find(u => u.id === terr.assignedManagerId);
          const reps = users.filter(u => terr.assignedMRIds.includes(u.id));

          return (
            <div key={terr.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{terr.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">Code: {terr.code} • {terr.zone}</p>
                </div>
                <Badge variant="neutral">{terr.state}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-600" />
                  <span><strong>{terr.doctorCount}</strong> Doctors</span>
                </div>
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-blue-600" />
                  <span><strong>{terr.chemistCount}</strong> Chemists</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs space-y-2">
                <div>
                  <span className="text-slate-400 text-[11px] block">Area Sales Manager (ASM):</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                    {manager?.name || 'Unassigned'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 text-[11px] block">Assigned Medical Representatives (MRs):</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {reps.map(r => (
                      <span key={r.id} className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-xs font-medium">
                        <Users className="w-3 h-3 text-slate-500" />
                        {r.name} ({r.employeeCode})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
