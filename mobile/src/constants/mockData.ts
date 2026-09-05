import { Doctor, Chemist, Product, UserProfile } from '../types';

export const CURRENT_USER_MOCK: UserProfile = {
  id: 'usr-mr-01',
  name: 'Vikram Mehta',
  email: 'vikram.mr@sefmed.com',
  role: 'MEDICAL_REP',
  employeeCode: 'EMP-MUM-104',
  territory: 'Bandra - Khar Medical Zone',
  headquarter: 'Mumbai South',
  phone: '+91 98201 12345',
  token: 'mock_jwt_token_vikram_mr_2026'
};

export const DOCTORS_MOCK: Doctor[] = [
  {
    id: 'doc-01',
    name: 'Dr. Alok Verma',
    qualification: 'MD, DM (Cardiology)',
    specialty: 'Cardiology',
    tier: 'A_PLUS',
    clinicName: 'Lilavati Hospital & Research Centre',
    clinicAddress: 'A-791, Bandra Reclamation, Bandra West, Mumbai',
    area: 'Bandra West',
    latitude: 19.0596,
    longitude: 72.8295,
    geofenceRadiusMeters: 100,
    phone: '+91 98201 23456',
    monthlyVisitTarget: 3,
    completedVisitsThisMonth: 1,
    todayVisitStatus: 'PENDING',
    lastVisitDate: '2026-08-28'
  },
  {
    id: 'doc-02',
    name: 'Dr. Meera Kulkarni',
    qualification: 'MBBS, MD (Medicine)',
    specialty: 'Diabetology',
    tier: 'A',
    clinicName: 'Apex Diabetes & Endocrine Care',
    clinicAddress: '14th Road, Off Linking Road, Khar West, Mumbai',
    area: 'Khar West',
    latitude: 19.0645,
    longitude: 72.8355,
    geofenceRadiusMeters: 100,
    phone: '+91 98202 34567',
    monthlyVisitTarget: 2,
    completedVisitsThisMonth: 0,
    todayVisitStatus: 'PENDING',
    lastVisitDate: '2026-08-22'
  },
  {
    id: 'doc-03',
    name: 'Dr. Rajesh Patel',
    qualification: 'MD (Pediatrics), DCH',
    specialty: 'Pediatrics',
    tier: 'B',
    clinicName: 'Little Angels Child Care Clinic',
    clinicAddress: 'Swami Vivekananda Road, Santacruz West, Mumbai',
    area: 'Santacruz West',
    latitude: 19.0720,
    longitude: 72.8410,
    geofenceRadiusMeters: 100,
    phone: '+91 98203 45678',
    monthlyVisitTarget: 2,
    completedVisitsThisMonth: 1,
    todayVisitStatus: 'PENDING',
    lastVisitDate: '2026-08-30'
  },
  {
    id: 'doc-04',
    name: 'Dr. Ananya Roy',
    qualification: 'MS (Orthopedics), M.Ch',
    specialty: 'Orthopedics',
    tier: 'A_PLUS',
    clinicName: 'Bone & Joint Speciality Hospital',
    clinicAddress: 'Hill Road, Near Mehboob Studio, Bandra West, Mumbai',
    area: 'Bandra West',
    latitude: 19.0510,
    longitude: 72.8240,
    geofenceRadiusMeters: 100,
    phone: '+91 98204 56789',
    monthlyVisitTarget: 3,
    completedVisitsThisMonth: 2,
    todayVisitStatus: 'COMPLETED',
    lastVisitDate: '2026-09-05'
  },
  {
    id: 'doc-05',
    name: 'Dr. Farhan Qureshi',
    qualification: 'MD (Pulmonology)',
    specialty: 'Pulmonology',
    tier: 'B',
    clinicName: 'BreathEasy Chest Care Center',
    clinicAddress: 'Nehru Road, Vile Parle East, Mumbai',
    area: 'Vile Parle',
    latitude: 19.0800,
    longitude: 72.8450,
    geofenceRadiusMeters: 100,
    phone: '+91 98205 67890',
    monthlyVisitTarget: 1,
    completedVisitsThisMonth: 0,
    todayVisitStatus: 'PENDING',
    lastVisitDate: '2026-08-15'
  }
];

export const CHEMISTS_MOCK: Chemist[] = [
  {
    id: 'chm-01',
    shopName: 'Apollo Pharmacy Bandra',
    contactPerson: 'Ramesh Gupta',
    drugLicenseNumber: 'MH-MZ4-184920',
    gstNumber: '27AAAAA0000A1Z5',
    area: 'Bandra West',
    phone: '+91 98111 22233',
    latitude: 19.0598,
    longitude: 72.8290
  },
  {
    id: 'chm-02',
    shopName: 'Wellness Forever Khar',
    contactPerson: 'Ashok Shah',
    drugLicenseNumber: 'MH-MZ4-192837',
    gstNumber: '27BBBBB1111B1Z2',
    area: 'Khar West',
    phone: '+91 98222 33344',
    latitude: 19.0640,
    longitude: 72.8360
  },
  {
    id: 'chm-03',
    shopName: 'Noble Chemist Santacruz',
    contactPerson: 'Pravin Jain',
    drugLicenseNumber: 'MH-MZ4-203948',
    gstNumber: '27CCCCC2222C1Z9',
    area: 'Santacruz West',
    phone: '+91 98333 44455',
    latitude: 19.0715,
    longitude: 72.8415
  }
];

export const PRODUCTS_MOCK: Product[] = [
  {
    id: 'prd-01',
    brandName: 'CardioSafe-AM',
    genericName: 'Telmisartan 40mg + Amlodipine 5mg',
    category: 'Cardiology',
    dosageForm: 'Tablet',
    packSize: '10x10 Strips',
    mrp: 145.00,
    ptr: 103.57,
    pts: 93.21,
    gstRate: 12,
    availableStock: 450
  },
  {
    id: 'prd-02',
    brandName: 'GlycoControl-M',
    genericName: 'Metformin 500mg (SR) + Glimepiride 2mg',
    category: 'Diabetology',
    dosageForm: 'Tablet',
    packSize: '10x15 Strips',
    mrp: 180.00,
    ptr: 128.57,
    pts: 115.71,
    gstRate: 12,
    availableStock: 600
  },
  {
    id: 'prd-03',
    brandName: 'CefaStar-CV 625',
    genericName: 'Amoxicillin 500mg + Pot. Clavulanate 125mg',
    category: 'Anti-Infective',
    dosageForm: 'Tablet',
    packSize: '10x6 Strips',
    mrp: 210.00,
    ptr: 150.00,
    pts: 135.00,
    gstRate: 12,
    availableStock: 320
  },
  {
    id: 'prd-04',
    brandName: 'OsteoCal-D3 Max',
    genericName: 'Calcium Carbonate 1250mg + Vit D3 2000 IU + Zinc',
    category: 'Orthopedics',
    dosageForm: 'Tablet',
    packSize: 'Bottle of 30s',
    mrp: 320.00,
    ptr: 228.57,
    pts: 205.71,
    gstRate: 12,
    availableStock: 210
  },
  {
    id: 'prd-05',
    brandName: 'Respira-Mont LC',
    genericName: 'Montelukast 10mg + Levocetirizine 5mg',
    category: 'Respiratory',
    dosageForm: 'Tablet',
    packSize: '10x10 Strips',
    mrp: 165.00,
    ptr: 117.85,
    pts: 106.07,
    gstRate: 12,
    availableStock: 500
  }
];
