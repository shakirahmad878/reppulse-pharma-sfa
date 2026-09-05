/**
 * SefMed Pro Mobile SFA - Core Domain Types
 */

export type UserRole = 'SUPER_ADMIN' | 'REGIONAL_MANAGER' | 'AREA_MANAGER' | 'MEDICAL_REP' | 'CHEMIST';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeCode: string;
  territory: string;
  headquarter: string;
  phone?: string;
  token?: string;
}

export type GeofenceStatus =
  | 'NOT_STARTED'
  | 'OUTSIDE_RADIUS'
  | 'LOCATION_ACCURACY_LOW'
  | 'WITHIN_RADIUS'
  | 'CHECKED_IN'
  | 'CHECKED_OUT';

export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  specialty: string;
  tier: 'A_PLUS' | 'A' | 'B' | 'C';
  clinicName: string;
  clinicAddress: string;
  area: string;
  latitude: number;
  longitude: number;
  geofenceRadiusMeters: number; // default: 100m
  phone: string;
  monthlyVisitTarget: number;
  completedVisitsThisMonth: number;
  todayVisitStatus: 'PENDING' | 'CHECKED_IN' | 'COMPLETED' | 'MISSED';
  lastVisitDate?: string;
}

export interface Chemist {
  id: string;
  shopName: string;
  contactPerson: string;
  drugLicenseNumber: string;
  gstNumber?: string;
  area: string;
  phone: string;
  latitude: number;
  longitude: number;
}

export interface Product {
  id: string;
  brandName: string;
  genericName: string;
  category: 'Cardiology' | 'Diabetology' | 'Anti-Infective' | 'Orthopedics' | 'Respiratory' | 'General';
  dosageForm: string;
  packSize: string;
  mrp: number;
  ptr: number;
  pts: number;
  gstRate: number;
  availableStock?: number;
}

export type VisitStatus =
  | 'PLANNED'
  | 'EN_ROUTE'
  | 'CHECKED_IN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'SYNC_PENDING'
  | 'SYNCED';

export interface VisitRecord {
  id: string; // Local UUID
  serverId?: string;
  doctorId: string;
  doctorName: string;
  clinicName: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkInTimestamp: string;
  checkInLatitude: number;
  checkInLongitude: number;
  checkInAccuracyMeters: number;
  checkInDistanceMeters: number;
  isGeofenceVerified: boolean;
  checkOutTimestamp?: string;
  checkOutLatitude?: number;
  checkOutLongitude?: number;
  visitDurationMinutes?: number;
  visitPurpose: 'ROUTINE_CALL' | 'NEW_LAUNCH_DETAILED' | 'SAMPLE_DELIVERY' | 'PAYMENT_FOLLOWUP';
  discussionNotes: string;
  productsDiscussed: string[];
  samplesDistributed: { productId: string; productName: string; quantity: number }[];
  doctorFeedback: string;
  nextFollowUpDate?: string;
  pobAmount?: number;
  status: VisitStatus;
  syncStatus: 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';
  errorMessage?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  freeQuantity: number;
  rate: number; // PTR
  itemTotal: number;
}

export interface POBOrder {
  id: string; // Local Order ID
  orderNumber: string; // e.g. POB-2026-0891
  serverId?: string;
  employeeId: string;
  employeeName: string;
  buyerType: 'CHEMIST' | 'STOCKIST';
  buyerId: string;
  buyerName: string;
  stockistName: string;
  territory: string;
  orderDate: string;
  items: CartItem[];
  subTotal: number;
  gstAmount: number;
  grandTotal: number;
  remarks?: string;
  latitude: number;
  longitude: number;
  status: 'BOOKED' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  syncStatus: 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';
  errorMessage?: string;
}

export interface AttendanceRecord {
  id: string;
  serverId?: string;
  employeeId: string;
  employeeName: string;
  date: string;
  punchInTimestamp: string;
  punchOutTimestamp?: string;
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  selfieBase64OrUri: string;
  isMockLocation: boolean;
  batteryPercentage: number;
  status: 'PUNCHED_IN' | 'PUNCHED_OUT';
  syncStatus: 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';
  errorMessage?: string;
}

export interface TelemetryLogPoint {
  id: string;
  employeeId: string;
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  speedKmh: number;
  batteryPercentage: number;
  isMockLocation: boolean;
  capturedAt: string;
  syncStatus: 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';
}

export type SyncEntityType = 'ATTENDANCE' | 'VISIT' | 'POB_ORDER' | 'TELEMETRY';

export interface SyncQueueItem {
  id: string;
  entityType: SyncEntityType;
  payload: any;
  createdAt: string;
  retryCount: number;
  maxRetries: number;
  status: 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';
  lastError?: string;
}

export interface DashboardSummary {
  employee: UserProfile;
  attendancePunchedIn: boolean;
  punchInTime?: string;
  totalPlannedVisits: number;
  completedVisits: number;
  pendingVisits: number;
  todayPOBValue: number;
  todayOrdersCount: number;
  lastSyncTimestamp: string;
  telemetryPingsCountToday: number;
}
