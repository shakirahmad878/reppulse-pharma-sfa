import React from 'react';
import { Doctor, Chemist, Product, DCRRecord } from '../../types';
import { Badge } from '../common/Badge';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  TrendingUp, 
  Stethoscope, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface MISReportsViewProps {
  doctors: Doctor[];
  chemists: Chemist[];
  products: Product[];
  dcrLogs: DCRRecord[];
}

export const MISReportsView: React.FC<MISReportsViewProps> = ({
  doctors,
  chemists,
  products,
  dcrLogs,
}) => {
  const handleExportCSV = (reportTitle: string) => {
    alert(`Exporting ${reportTitle} to CSV spreadsheet...`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-600" />
            Executive Management Information System (MIS) Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Doctor coverage compliance, secondary sales POB conversion, and field telemetry audit exports.
          </p>
        </div>

        <button
          onClick={() => handleExportCSV('Executive Summary Report')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal-300 text-xs font-semibold transition-colors"
        >
          <Download className="w-4 h-4" />
          Export All MIS Reports (CSV)
        </button>
      </div>

      {/* Key Metric Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Doctor Call Coverage</span>
          <h3 className="text-2xl font-bold text-teal-700">83.3%</h3>
          <p className="text-xs text-slate-500">5 out of 6 priority clinics visited within geofence.</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Total POB Booked</span>
          <h3 className="text-2xl font-bold text-slate-900">₹20,339.79</h3>
          <p className="text-xs text-slate-500">Secondary sales routed through local stockists.</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase">GPS Verification Accuracy</span>
          <h3 className="text-2xl font-bold text-emerald-600">100%</h3>
          <p className="text-xs text-slate-500">Zero mock location breaches recorded.</p>
        </div>
      </div>

      {/* Doctor Performance & Coverage Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            Physician Visit Coverage & Geofence Adherence Matrix
          </h3>
          <button
            onClick={() => handleExportCSV('Doctor Coverage Matrix')}
            className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" /> Export Table
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="p-3">Doctor Name</th>
                <th className="p-3">Specialty</th>
                <th className="p-3">Tier</th>
                <th className="p-3">Monthly Target</th>
                <th className="p-3">Completed</th>
                <th className="p-3">Geofence Compliance</th>
                <th className="p-3 text-right">Potential Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {doctors.map((doc) => (
                <tr key={doc.id}>
                  <td className="p-3 font-semibold text-slate-900">{doc.name}</td>
                  <td className="p-3 text-slate-600">{doc.specialty}</td>
                  <td className="p-3">
                    <Badge variant={doc.tier === 'A_PLUS' ? 'purple' : 'primary'}>{doc.tier}</Badge>
                  </td>
                  <td className="p-3 font-mono">{doc.monthlyVisitTarget}</td>
                  <td className="p-3 font-mono font-bold text-teal-700">{doc.monthlyVisitsCompleted}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 100% (100m Radius)
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-800">{doc.potentialScore}/100</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
