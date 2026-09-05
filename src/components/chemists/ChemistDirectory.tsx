import React from 'react';
import { Chemist } from '../../types';
import { Badge } from '../common/Badge';
import { Store, Phone, MapPin, FileCheck2, User, Building2 } from 'lucide-react';

interface ChemistDirectoryProps {
  chemists: Chemist[];
}

export const ChemistDirectory: React.FC<ChemistDirectoryProps> = ({ chemists }) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-teal-600" />
            Chemist & Retail Pharmacy Master
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track retail chemist outlets, drug license numbers, and nearby mapped prescribing doctors for RCPA audits.
          </p>
        </div>
        <Badge variant="primary" size="md">
          {chemists.length} Registered Pharmacies
        </Badge>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {chemists.map((chem) => (
          <div
            key={chem.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">{chem.shopName}</h3>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {chem.name}
                </p>
              </div>
              <Badge variant="success">Active Partner</Badge>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-600">
              <p className="flex items-start gap-1.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{chem.location.address}</span>
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Drug License No:</span>
                  <span className="font-mono font-semibold text-slate-800">{chem.drugLicenseNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Contact Person:</span>
                  <span className="font-semibold text-slate-800">{chem.contactPerson}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {chem.phone}
                </span>
                <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  Monthly Vol: ₹{(chem.averageMonthlyTurnover / 100000).toFixed(1)}L
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
