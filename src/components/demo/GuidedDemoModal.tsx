import React, { useState } from 'react';
import { Sparkles, MapPin, ShieldCheck, FileText, ArrowRight, ArrowLeft, X, Smartphone, BatteryCharging } from 'lucide-react';

interface GuidedDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onSetRole: (role: any) => void;
}

const DEMO_STEPS = [
  {
    step: 1,
    title: '1. Morning Attendance & Geotagged Selfie',
    role: 'MEDICAL_REP',
    targetTab: 'attendance',
    icon: Smartphone,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    description: "Field reps start their day by taking a front-camera selfie. SefMed locks high-accuracy GPS coordinates, verifies against mock GPS spoofers, and timestamps the punch-in."
  },
  {
    step: 2,
    title: '2. 15-Minute Automated Telemetry Worker',
    role: 'MEDICAL_REP',
    targetTab: 'dashboard',
    icon: BatteryCharging,
    color: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
    description: "While the phone is in the rep's pocket, a sub-5-second background GPS fix executes every 15 minutes. It consumes < 0.10% battery over a 10-hour shift and queues pings offline if network drops."
  },
  {
    step: 3,
    title: '3. Doctor Visit with 100m Geofence Validation',
    role: 'MEDICAL_REP',
    targetTab: 'dcr',
    icon: MapPin,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    description: "When logging a DCR call, the app calculates distance to the doctor's clinic. Check-ins within 100 meters get an instant green verified badge; distant check-ins are flagged."
  },
  {
    step: 4,
    title: '4. Chemist Secondary Sales (POB) Booking',
    role: 'MEDICAL_REP',
    targetTab: 'orders',
    icon: FileText,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    description: "Book chemist orders with PTR/PTS calculations, trade bonus schemes (e.g. 10+1), 12% GST breakdown, and instant Tally Prime / Marg ERP XML exports."
  },
  {
    step: 5,
    title: '5. Admin Live Route Replay & Strict Privacy Barrier',
    role: 'SUPER_ADMIN',
    targetTab: 'live-tracking',
    icon: ShieldCheck,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    description: "Only Super Admins can access employee location telemetry. Admins can replay full day route trails at 1x, 2x, or 4x speed, view stopover durations, and check territory compliance."
  }
];

export const GuidedDemoModal: React.FC<GuidedDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onSetRole
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIndex];
  const Icon = currentStep.icon;

  const handleApplyStep = () => {
    onSetRole(currentStep.role);
    onNavigateTab(currentStep.targetTab);
  };

  const handleNext = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      onSetRole(DEMO_STEPS[nextIndex].role);
      onNavigateTab(DEMO_STEPS[nextIndex].targetTab);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      onSetRole(DEMO_STEPS[prevIndex].role);
      onNavigateTab(DEMO_STEPS[prevIndex].targetTab);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">Interactive Platform Tour</h3>
              <p className="text-xs text-slate-400">A guided walkthrough of SefMed Pro capabilities</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progression Bar */}
        <div className="grid grid-cols-5 gap-2 my-6">
          {DEMO_STEPS.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => {
                setCurrentStepIndex(idx);
                onSetRole(s.role);
                onNavigateTab(s.targetTab);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === currentStepIndex
                  ? 'bg-teal-400 shadow-sm shadow-teal-500/50'
                  : idx < currentStepIndex
                  ? 'bg-teal-700'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Step Card Content */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-xl border ${currentStep.color}`}>
              <Icon className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-lg font-bold text-slate-100">{currentStep.title}</h4>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Role: {currentStep.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Medical Rep'}
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mt-2">{currentStep.description}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 hover:bg-slate-800/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleApplyStep}
              className="px-4 py-2 rounded-xl text-sm font-medium text-teal-400 bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20 transition-all"
            >
              Jump to Tab
            </button>
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl text-sm font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-md shadow-teal-500/20 transition-all"
            >
              <span>{currentStepIndex === DEMO_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
