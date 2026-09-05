import React, { useState } from 'react';
import { DCRRecord, Doctor, Product, User } from '../../types';
import { Badge } from '../common/Badge';
import { DCREntryModal } from './DCREntryModal';
import { FileText, CheckCircle2, Plus } from 'lucide-react';

interface DCRViewProps {
  dcrLogs: DCRRecord[];
  doctors: Doctor[];
  products: Product[];
  currentUser: User;
  onAddDCR: (dcr: DCRRecord) => void;
}

export const DCRView: React.FC<DCRViewProps> = ({
  dcrLogs,
  doctors,
  products,
  currentUser,
  onAddDCR,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            Daily Call Reports (DCR) Audit
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Automated verification of doctor calls, sample distributions, and POB orders against GPS geofences.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Log Doctor DCR Visit
        </button>
      </div>

      <div className="space-y-4">
        {dcrLogs.map((dcr) => (
          <div key={dcr.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900">{dcr.clientName}</h3>
                  <Badge variant={dcr.clientType === 'DOCTOR' ? 'primary' : 'neutral'}>
                    {dcr.clientType}
                  </Badge>
                  {dcr.isGeofenceVerified && (
                    <Badge variant="success">
                      <CheckCircle2 className="w-3 h-3" /> Geofence Verified ({dcr.distanceFromClinicMeters}m)
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Logged by: <strong>{dcr.userName}</strong> • Date: {dcr.date}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                  Status: {dcr.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block">Check-in / Check-out:</span>
                <span className="font-semibold text-slate-800">{dcr.checkInTime} – {dcr.checkOutTime || 'Active'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Samples Distributed:</span>
                <span className="font-semibold text-teal-700">
                  {dcr.samplesGiven.map((s: { productId: string; quantity: number }) => `${s.quantity} units`).join(', ') || 'None'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Product Order Booking (POB):</span>
                <span className="font-semibold text-blue-700">
                  {dcr.pobAmount ? `₹${dcr.pobAmount.toLocaleString()}` : 'None'}
                </span>
              </div>
            </div>

            {dcr.doctorFeedback && (
              <p className="text-xs text-slate-600 bg-teal-50/50 p-2.5 rounded-lg border border-teal-100">
                <strong>Doctor Feedback:</strong> {dcr.doctorFeedback}
              </p>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <DCREntryModal
          doctors={doctors}
          products={products}
          currentUser={currentUser}
          onClose={() => setIsModalOpen(false)}
          onSubmitDCR={onAddDCR}
        />
      )}

    </div>
  );
};
