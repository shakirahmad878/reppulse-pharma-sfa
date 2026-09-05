import React, { useState } from 'react';
import { Doctor, MedicalSpecialty, DoctorTier } from '../../types';
import { Badge } from '../common/Badge';
import { 
  Stethoscope, 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar,
  CheckCircle2,
  X
} from 'lucide-react';

interface DoctorDirectoryProps {
  doctors: Doctor[];
  onAddDoctor: (doc: Doctor) => void;
}

export const DoctorDirectory: React.FC<DoctorDirectoryProps> = ({ doctors, onAddDoctor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Doctor Form State
  const [newDocName, setNewDocName] = useState('');
  const [newDocQual, setNewDocQual] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState<MedicalSpecialty>('Cardiology');
  const [newDocTier, setNewDocTier] = useState<DoctorTier>('A');
  const [newDocClinic, setNewDocClinic] = useState('');
  const [newDocAddress, setNewDocAddress] = useState('');
  const [newDocLat, setNewDocLat] = useState('19.0600');
  const [newDocLng, setNewDocLng] = useState('72.8300');
  const [newDocPhone, setNewDocPhone] = useState('');
  const [newDocHours, setNewDocHours] = useState('10:00 AM - 01:00 PM, 05:00 PM - 08:00 PM');

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty = selectedSpecialty === 'ALL' || doc.specialty === selectedSpecialty;
    const matchesTier = selectedTier === 'ALL' || doc.tier === selectedTier;

    return matchesSearch && matchesSpecialty && matchesTier;
  });

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName || !newDocClinic) return;

    const newDoc: Doctor = {
      id: `doc-${Date.now()}`,
      name: newDocName,
      qualification: newDocQual || 'MBBS, MD',
      specialty: newDocSpecialty,
      tier: newDocTier,
      clinicName: newDocClinic,
      clinicLocation: {
        latitude: parseFloat(newDocLat) || 19.0600,
        longitude: parseFloat(newDocLng) || 72.8300,
        address: newDocAddress || 'Bandra West, Mumbai',
      },
      geofenceRadiusMeters: 100,
      territoryId: 'terr-mum-west',
      territoryName: 'Mumbai West & Bandra',
      phone: newDocPhone || '+91 98200 00000',
      visitingHours: newDocHours,
      preferredVisitDays: ['Mon', 'Wed', 'Fri'],
      averagePatientsPerDay: 35,
      potentialScore: 85,
      monthlyVisitTarget: newDocTier === 'A_PLUS' ? 3 : 2,
      monthlyVisitsCompleted: 0,
    };

    onAddDoctor(newDoc);
    setIsAddModalOpen(false);
    // Reset
    setNewDocName('');
    setNewDocClinic('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            Doctor Master Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Maintain verified healthcare practitioners, clinic geofence coordinates, and monthly visit compliance.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add New Doctor
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search doctor name, specialty, or clinic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {/* Specialty Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="ALL">All Specialties</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Diabetology & Endocrinology">Diabetology & Endocrinology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Neurology">Neurology</option>
          </select>

          {/* Tier Filter */}
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="ALL">All Tiers</option>
            <option value="A_PLUS">Tier A+ (High Yield)</option>
            <option value="A">Tier A (Priority)</option>
            <option value="B">Tier B (Standard)</option>
            <option value="C">Tier C</option>
          </select>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map((doc) => {
          const tierVariant = doc.tier === 'A_PLUS' ? 'purple' : doc.tier === 'A' ? 'primary' : 'neutral';

          return (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{doc.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{doc.qualification}</p>
                  </div>
                  <Badge variant={tierVariant} size="sm">
                    Tier {doc.tier.replace('_', '+')}
                  </Badge>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-teal-700 font-semibold bg-teal-50/60 px-2.5 py-1 rounded-lg border border-teal-100">
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>{doc.specialty}</span>
                  </div>

                  <div className="text-slate-600">
                    <p className="font-semibold text-slate-800">{doc.clinicName}</p>
                    <p className="text-[11px] text-slate-500 flex items-start gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                      <span>{doc.clinicLocation.address}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {doc.visitingHours}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {doc.phone}</span>
                      <span className="font-mono text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded text-[10px]">
                        Radius: {doc.geofenceRadiusMeters}m
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Visit Target Meter */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500">Monthly Visit Target</span>
                  <span className="font-bold text-slate-800">
                    {doc.monthlyVisitsCompleted} / {doc.monthlyVisitTarget} Visits
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (doc.monthlyVisitsCompleted / doc.monthlyVisitTarget) * 100)}%` }}
                  ></div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Doctor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-600" />
                Add New Doctor to Territory
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoctor} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Doctor Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Kothari"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Specialty</label>
                  <select
                    value={newDocSpecialty}
                    onChange={(e) => setNewDocSpecialty(e.target.value as MedicalSpecialty)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Diabetology & Endocrinology">Diabetology & Endocrinology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Neurology">Neurology</option>
                    <option value="General Medicine">General Medicine</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tier Rating</label>
                  <select
                    value={newDocTier}
                    onChange={(e) => setNewDocTier(e.target.value as DoctorTier)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="A_PLUS">Tier A+ (Key Opinion Leader)</option>
                    <option value="A">Tier A (High Potential)</option>
                    <option value="B">Tier B (Regular)</option>
                    <option value="C">Tier C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Clinic / Hospital Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kothari Cardiac Clinic"
                  value={newDocClinic}
                  onChange={(e) => setNewDocClinic(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">GPS Latitude (PostGIS)</label>
                  <input
                    type="text"
                    value={newDocLat}
                    onChange={(e) => setNewDocLat(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono text-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">GPS Longitude (PostGIS)</label>
                  <input
                    type="text"
                    value={newDocLng}
                    onChange={(e) => setNewDocLng(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono text-slate-700"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                >
                  Save Doctor Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
