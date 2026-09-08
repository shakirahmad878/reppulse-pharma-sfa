/**
 * RepPulse Mobile SFA - Core Domain Types (Barak Division, Assam)
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
  assignedRouteIds: string[];
  activeRouteId?: string;
}

export type GeofenceStatus =
  | 'NOT_STARTED'
  | 'OUTSIDE_RADIUS'
  | 'LOCATION_ACCURACY_LOW'
  | 'WITHIN_RADIUS'
  | 'CHECKED_IN'
  | 'CHECKED_OUT';

export interface RoutePlan {
  id: string;
  code: string;
  name: string;
  district: 'Cachar' | 'Karimganj' | 'Hailakandi';
  areas: string[];
  totalDoctors: number;
  totalHospitals: number;
  totalChemists: number;
  isAssigned: boolean;
  isActiveToday: boolean;
  description: string;
}

export type RouteApprovalStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export interface RouteChangeRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  currentRouteId: string;
  currentRouteName: string;
  requestedRouteId: string;
  requestedRouteName: string;
  reason: string;
  requestTimestamp: string;
  status: RouteApprovalStatus;
  reviewedBy?: string;
  reviewedTimestamp?: string;
  reviewComment?: string;
}

export interface Hospital {
  id: string;
  name: string;
  type: 'GOVERNMENT_MEDICAL_COLLEGE' | 'CIVIL_HOSPITAL' | 'PRIVATE_HOSPITAL' | 'NURSING_HOME';
  district: string;
  area: string;
  address: string;
  bedCount: number;
  keyDoctorsCount: number;
  latitude: number;
  longitude: number;
  phone: string;
  routeId: string;
}

export interface StockistFirm {
  id: string;
  name: string;
  contactPerson: string;
  type: 'SUPER_STOCKIST' | 'AUTHORIZED_DISTRIBUTOR' | 'WHOLESALE_PHARMA';
  dlNumber: string;
  gstNumber: string;
  district: string;
  area: string;
  address: string;
  phone: string;
  routeId: string;
}

export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  specialty: string;
  tier: 'A_PLUS' | 'A' | 'B' | 'C';
  clinicName: string;
  clinicAddress: string;
  district: 'Cachar' | 'Karimganj' | 'Hailakandi';
  area: string;
  routeId: string;
  latitude: number;
  longitude: number;
  geofenceRadiusMeters: number; // default: 100m
  phone: string;
  monthlyVisitTarget: number;
  completedVisitsThisMonth: number;
  todayVisitStatus: 'PENDING' | 'CHECKED_IN' | 'COMPLETED' | 'MISSED';
  lastVisitDate?: string;
  isAssignedToMe: boolean;
}

export interface Chemist {
  id: string;
  shopName: string;
  contactPerson: string;
  drugLicenseNumber: string;
  gstNumber?: string;
  district: 'Cachar' | 'Karimganj' | 'Hailakandi';
  area: string;
  routeId: string;
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
  id: string;
  serverId?: string;
  doctorId: string;
  doctorName: string;
  clinicName: string;
  employeeId: string;
  employeeName: string;
  routeId?: string;
  routeName?: string;
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
  rate: number;
  itemTotal: number;
}

export interface POBOrder {
  id: string;
  orderNumber: string;
  serverId?: string;
  employeeId: string;
  employeeName: string;
  routeId?: string;
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
  routeId?: string;
  routeName?: string;
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

export type SyncEntityType = 'ATTENDANCE' | 'VISIT' | 'POB_ORDER' | 'TELEMETRY' | 'ROUTE_REQUEST';

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
  activeRouteName: string;
  totalPlannedVisits: number;
  completedVisits: number;
  pendingVisits: number;
  todayPOBValue: number;
  todayOrdersCount: number;
  lastSyncTimestamp: string;
  telemetryPingsCountToday: number;
}
