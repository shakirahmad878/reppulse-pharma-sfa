import React, { useState } from 'react';
import { RCPAAuditRecord, Doctor, Chemist } from '../../types';
import { Badge } from '../common/Badge';
import { FileSpreadsheet, Plus, TrendingUp, Stethoscope, Store, X } from 'lucide-react';

interface RCPAAuditViewProps {
  doctors: Doctor[];
  chemists: Chemist[];
}

export const RCPAAuditView: React.FC<RCPAAuditViewProps> = ({ doctors, chemists }) => {
  const [rcpaRecords, setRcpaRecords] = useState<RCPAAuditRecord[]>([
    {
      id: 'rcpa-01',
      userId: 'usr-mr-01',
      userName: 'Vikram Mehta',
      chemistId: 'chem-01',
      chemistName: 'HealthPlus Super Chemist',
      doctorId: 'doc-01',
      doctorName: 'Dr. Alok Verma',
      specialty: 'Cardiology',
      auditDate: '2026-09-04',
      ourProductBrand: 'CardioVast 20',
      ourRxCountPerMonth: 45,
      competitorDrugs: [
        {
          competitorBrandName: 'Atorva 20 (Zydus)',
          competitorCompany: 'Zydus Lifesciences',
          prescriptionCountPerMonth: 35,
          estimatedPrice: 195.00,
        },
        {
          competitorBrandName: 'Lipitor 20 (Pfizer)',
          competitorCompany: 'Pfizer',
          prescriptionCountPerMonth: 20,
          estimatedPrice: 240.00,
        }
      ],
      totalMarketRx: 100,
      ourMarketSharePercent: 45,
      chemistRemarks: 'Dr. Verma actively shifting patients from Atorva to CardioVast.',
    },
    {
      id: 'rcpa-02',
      userId: 'usr-mr-01',
      userName: 'Vikram Mehta',
      chemistId: 'chem-02',
      chemistName: 'Noble Chemists',
      doctorId: 'doc-02',
      doctorName: 'Dr. Radhika Sen',
      specialty: 'Diabetology & Endocrinology',
      auditDate: '2026-09-05',
      ourProductBrand: 'GlucoFree-M 500',
      ourRxCountPerMonth: 55,
      competitorDrugs: [
        {
          competitorBrandName: 'Galvus Met 50/500 (Novartis)',
          competitorCompany: 'Novartis',
          prescriptionCountPerMonth: 40,
          estimatedPrice: 285.00,
        },
        {
          competitorBrandName: 'Zomelis Met (Abbott)',
          competitorCompany: 'Abbott',
          prescriptionCountPerMonth: 25,
          estimatedPrice: 230.00,
        }
      ],
      totalMarketRx: 120,
      ourMarketSharePercent: 45.8,
      chemistRemarks: 'High chemist stock rotation on GlucoFree-M.',
    }
  ]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-600" />
            Retail Chemist Prescription Audit (RCPA)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Analyze doctor prescribing market share at chemist counters against competitor pharmaceutical brands.
          </p>
        </div>
        <Badge variant="primary" size="md">{rcpaRecords.length} Audits Completed</Badge>
      </div>

      {/* RCPA Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {rcpaRecords.map((rcpa) => (
          <div key={rcpa.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{rcpa.doctorName}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Store className="w-3.5 h-3.5 text-slate-400" />
                    Audited at: <strong>{rcpa.chemistName}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded">
                    {rcpa.ourMarketSharePercent.toFixed(1)}% Rx Share
                  </span>
                </div>
              </div>

              {/* Progress Bar of Market Share */}
              <div className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Our Brand: <strong>{rcpa.ourProductBrand}</strong> ({rcpa.ourRxCountPerMonth} Rx)</span>
                  <span>Total Rx: {rcpa.totalMarketRx}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                  <div
                    className="bg-teal-600 h-full"
                    style={{ width: `${rcpa.ourMarketSharePercent}%` }}
                    title={`Our Brand: ${rcpa.ourMarketSharePercent}%`}
                  />
                  <div
                    className="bg-slate-400 h-full"
                    style={{ width: `${100 - rcpa.ourMarketSharePercent}%` }}
                    title="Competitor Share"
                  />
                </div>
              </div>

              {/* Competitor Breakdown */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <span className="font-semibold text-slate-700 block">Competitor Prescriptions:</span>
                {rcpa.competitorDrugs.map((comp, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div>
                      <span className="font-semibold text-slate-800">{comp.competitorBrandName}</span>
                      <span className="text-[10px] text-slate-400 block">{comp.competitorCompany}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-700">{comp.prescriptionCountPerMonth} Rx / mo</span>
                  </div>
                ))}
              </div>
            </div>

            {rcpa.chemistRemarks && (
              <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 italic">
                "{rcpa.chemistRemarks}"
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
