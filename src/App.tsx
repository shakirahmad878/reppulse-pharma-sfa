import React, { useState } from 'react';
import { 
  User, 
  UserRole, 
  Doctor, 
  Chemist, 
  Product, 
  LocationTelemetryPoint, 
  DCRRecord, 
  TourPlanItem 
} from './types';
import { 
  INITIAL_USERS, 
  INITIAL_DOCTORS, 
  INITIAL_CHEMISTS, 
  INITIAL_PRODUCTS, 
  INITIAL_TERRITORIES, 
  INITIAL_TELEMETRY_LOGS, 
  INITIAL_DCR_LOGS 
} from './data/mockData';
import { AuthService } from './services/authService';
import { TelemetryService } from './services/telemetryService';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { LiveFleetMap } from './components/maps/LiveFleetMap';
import { DoctorDirectory } from './components/doctors/DoctorDirectory';
import { ChemistDirectory } from './components/chemists/ChemistDirectory';
import { ProductCatalog } from './components/products/ProductCatalog';
import { TerritoryStaffView } from './components/territory/TerritoryStaffView';
import { DCRView } from './components/dcr/DCRView';
import { TourPlanner } from './components/tour/TourPlanner';
import { POBOrderBooking } from './components/orders/POBOrderBooking';
import { RCPAAuditView } from './components/rcpa/RCPAAuditView';
import { GeoAttendanceView } from './components/hrms/GeoAttendanceView';
import { ExpenseClaimsView } from './components/expenses/ExpenseClaimsView';
import { MISReportsView } from './components/reports/MISReportsView';
import { GuidedDemoModal } from './components/demo/GuidedDemoModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(() => AuthService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  
  // Master Data State
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [chemists] = useState<Chemist[]>(INITIAL_CHEMISTS);
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [telemetryLogs, setTelemetryLogs] = useState<LocationTelemetryPoint[]>(INITIAL_TELEMETRY_LOGS);
  const [dcrLogs, setDcrLogs] = useState<DCRRecord[]>(INITIAL_DCR_LOGS);

  // Tour Plans State
  const [tourPlans, setTourPlans] = useState<TourPlanItem[]>([
    {
      id: 'tp-01',
      userId: 'usr-mr-01',
      userName: 'Vikram Mehta',
      date: '2026-09-08',
      territoryId: 'terr-mum-west',
      territoryName: 'Mumbai West & Bandra',
      routeTitle: 'Bandra Linking Road Cardiac Focus',
      plannedDoctorsCount: 2,
      plannedChemistsCount: 1,
      doctorIds: ['doc-01', 'doc-02'],
      chemistIds: ['chem-01'],
      status: 'APPROVED',
      approvalComments: 'Approved by ASM Dr. Amitav Ghosh. Focus on CardioVast.',
    }
  ]);
  
  const [isSimulatingPing, setIsSimulatingPing] = useState(false);

  // Switch role handler for testing RBAC
  const handleRoleChange = (newRole: UserRole) => {
    const updated = AuthService.switchRole(newRole);
    setCurrentUser(updated);
  };

  // Add new doctor handler
  const handleAddDoctor = (newDoc: Doctor) => {
    setDoctors(prev => [newDoc, ...prev]);
  };

  // Add new DCR handler
  const handleAddDCR = (newDcr: DCRRecord) => {
    setDcrLogs(prev => [newDcr, ...prev]);
  };

  // Add new Tour Plan
  const handleAddTourPlan = (newPlan: TourPlanItem) => {
    setTourPlans(prev => [newPlan, ...prev]);
  };

  // Tour plan status update
  const handleUpdateTourPlanStatus = (id: string, newStatus: 'APPROVED' | 'REJECTED', comments?: string) => {
    setTourPlans(prev => prev.map(tp => tp.id === id ? { ...tp, status: newStatus, approvalComments: comments } : tp));
  };

  // 15-Minute Background Telemetry Simulator
  const handleTriggerTelemetryPing = () => {
    setIsSimulatingPing(true);
    setTimeout(() => {
      const nextLat = 19.0548 + (Math.random() - 0.5) * 0.0004;
      const nextLng = 72.8312 + (Math.random() - 0.5) * 0.0004;
      
      const newPoint = TelemetryService.ingest15MinPing({
        userId: 'usr-mr-01',
        userName: 'Vikram Mehta (MR)',
        userRole: 'MEDICAL_REP',
        territoryName: 'Mumbai West & Bandra',
        latitude: nextLat,
        longitude: nextLng,
        accuracyMeters: 5.5,
        speedKmh: Math.floor(Math.random() * 5),
        batteryPercentage: Math.max(10, (telemetryLogs[telemetryLogs.length - 1]?.batteryPercentage || 90) - 1),
        isMockLocation: false,
        isCharging: false,
      });

      setTelemetryLogs(prev => [...prev, newPoint]);
      setIsSimulatingPing(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        isSimulatingTelemetry={isSimulatingPing}
        onTriggerTelemetryPing={handleTriggerTelemetryPing}
        onOpenDemoTour={() => setIsDemoTourOpen(true)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          userRole={currentUser.role}
        />

        {/* Dynamic Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto max-w-5xl">
          {activeTab === 'dashboard' && (
            <ExecutiveDashboard
              doctors={doctors}
              chemists={chemists}
              products={products}
              telemetryLogs={telemetryLogs}
              dcrLogs={dcrLogs}
              userRole={currentUser.role}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'fleet_tracking' && (
            <LiveFleetMap
              userRole={currentUser.role}
              telemetryLogs={telemetryLogs}
            />
          )}

          {activeTab === 'dcr' && (
            <DCRView
              dcrLogs={dcrLogs}
              doctors={doctors}
              products={products}
              currentUser={currentUser}
              onAddDCR={handleAddDCR}
            />
          )}

          {activeTab === 'tour_plans' && (
            <TourPlanner
              tourPlans={tourPlans}
              doctors={doctors}
              chemists={chemists}
              currentUser={currentUser}
              onAddTourPlan={handleAddTourPlan}
              onUpdateStatus={handleUpdateTourPlanStatus}
            />
          )}

          {activeTab === 'orders' && (
            <POBOrderBooking
              products={products}
              chemists={chemists}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'rcpa' && (
            <RCPAAuditView
              doctors={doctors}
              chemists={chemists}
            />
          )}

          {activeTab === 'attendance' && (
            <GeoAttendanceView
              currentUser={currentUser}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpenseClaimsView
              currentUser={currentUser}
            />
          )}

          {activeTab === 'mis_reports' && (
            <MISReportsView
              doctors={doctors}
              chemists={chemists}
              products={products}
              dcrLogs={dcrLogs}
            />
          )}

          {activeTab === 'doctors' && (
            <DoctorDirectory
              doctors={doctors}
              onAddDoctor={handleAddDoctor}
            />
          )}

          {activeTab === 'chemists' && (
            <ChemistDirectory
              chemists={chemists}
            />
          )}

          {activeTab === 'products' && (
            <ProductCatalog
              products={products}
            />
          )}

          {activeTab === 'territories' && (
            <TerritoryStaffView
              territories={INITIAL_TERRITORIES}
              users={INITIAL_USERS}
            />
          )}
        </main>

      </div>

      {/* Interactive Guided Demo Simulator Modal */}
      <GuidedDemoModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onNavigateTab={(tab) => {
          if (tab === 'live-tracking' || tab === 'fleet_tracking') setActiveTab('fleet_tracking');
          else if (tab === 'tour_plans' || tab === 'tour') setActiveTab('tour_plans');
          else setActiveTab(tab as any);
        }}
        onSetRole={(role) => handleRoleChange(role)}
      />

    </div>
  );
}
