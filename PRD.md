# Product Requirement Document (PRD)
## Project Name: NextGen Pharma Sales Force Automation (SFA) & MR Reporting Platform

---

### 1. Executive Summary & Problem Statement
In the pharmaceutical industry, field sales operations are heavily driven by Medical Representatives (MRs) visiting healthcare professionals (HCPs / Doctors), pharmacies/chemists, hospitals, and stockists. Traditional or legacy SFA applications (such as Sefmed Pharma) suffer from severe limitations:
1. **Unreliable & Inflexible Location Tracking**: Lack of consistent, battery-efficient background location sync leads to missed field activity verifications and disputable call logs.
2. **Data Privacy & Access Security Gaps**: Sensitive employee real-time location and route data must be strictly confidential and restricted to authorized Admins / Managers only, preventing unauthorized visibility across peer field reps.
3. **Connectivity Vulnerabilities**: Field reps frequently work in remote clinics and underground hospital pharmacies with poor cellular coverage, requiring true offline-first local caching and conflict-free background synchronization.
4. **Complex Reporting Friction**: End-of-day reporting is often delayed due to cluttered UX and manual paperwork.

This platform provides an end-to-end enterprise Pharma SFA solution comprising:
* **Mobile Field App (Android & iOS)** for Medical Representatives (MRs) & Area Managers.
* **Web Admin & Management Portal** for Central Company Admins, HR, Sales Directors, and Regional Managers.
* **High-Performance Backend & Telemetry Engine** capable of 15-minute periodic background location pings, doctor geofencing, route deviation tracking, and sales analytics.

---

### 2. User Personas & Targeted Roles

| Persona / Role | Description | Primary Needs & Permissions |
|---|---|---|
| **Medical Representative (MR)** | On-field sales executive visiting doctors and chemists. | • View daily tour plan (TP) & assigned doctor list<br>• Mark geo-attendance (punch in/out with selfie & location)<br>• Submit Daily Call Reports (DCR) & RCPA audits<br>• Book product orders (POB) & log sample distributions<br>• Run digital E-Detailing presentations<br>• *Restricted: Cannot view peer or executive locations* |
| **Area / Regional Sales Manager (ASM / RSM)** | Mid-level supervisor managing teams of 5–20 MRs across territories. | • Approve Tour Plans & leave requests<br>• Review team DCRs, doctor coverage & sales targets<br>• Conduct joint-visit call logging with MRs<br>• View territory-level performance analytics |
| **Super Admin / Company Leadership** | Central operations, sales directors, and system administrators. | • **Exclusive Access:** Real-time & historical location tracking of all field personnel<br>• Live territory map with route deviation and geofence alerts<br>• Master data management (Doctors, Chemists, Products, Territories, Pricing)<br>• Comprehensive MIS, Secondary Sales, and Expense audit reports |

---

### 3. Core System Requirements & Functional Modules

#### 3.1. Automated 15-Minute Background Location Engine (High Priority)
* **Periodic Background Interval**: Device automatically captures high-accuracy GPS coordinates, battery level, speed, and network status every **15 minutes** during active shift hours (e.g., 08:00 to 20:00 or custom shift hours).
* **Battery & Power Optimization**:
  * Utilizes native fused location providers (Android FusedLocationProviderClient / iOS CoreLocation).
  * Implements smart wake-lock / WorkManager / Expo TaskManager background jobs.
  * Adjusts GPS accuracy based on movement speed to keep battery consumption `< 5%` per 10-hour work shift.
* **Offline Telemetry Queue**: If the device loses internet connection, location data points are persisted in local SQLite/MMKV storage and bulk-synchronized once online.
* **Anti-Spoofing & Mock Location Detection**: Detects mock GPS locations, mock provider flags, rooted/jailbroken devices, and manual system clock manipulations.
* **Doctor Geofence Auto-Verification**: Automatically correlates location timestamps against doctor clinic coordinates to verify whether an MR was physically within a 100-meter radius when submitting a DCR.

#### 3.2. Strict Admin-Only Location Telemetry & Privacy Matrix
* **Strict RBAC Enforcement**:
  * Location telemetry endpoints (`/api/v1/telemetry/*`) are accessible **strictly and exclusively** by authenticated users possessing `ROLE_SUPER_ADMIN` or `ROLE_LOCATION_AUDITOR`.
  * Medical Representatives and standard Field staff have **zero read permissions** to location telemetry streams, map APIs, or peer location data.
* **Audit Logging**: Every admin query to view an employee's live location or route history is logged with Admin ID, Timestamp, IP, and Purpose.
* **Admin Live Fleet & Map Suite**:
  * Real-time territory map displaying active field staff with status (On Duty, In Doctor Meeting, Traveling, Inactive).
  * Interactive route replay animation (breadcrumbs with speed, idle time, and doctor visit markers).
  * Out-of-territory & route deviation instant notifications.

#### 3.3. Tour Planning (TP) & Daily Call Reports (DCR)
* **Monthly & Weekly Tour Planning (TP)**: MRs plan visits by territory, doctor category (A/B/C tier), and frequency. Single-click submission for ASM/RSM approval.
* **Daily Call Report (DCR) Logging**:
  * Doctor Visits: Selected doctor, discussed products, sample/gift distribution, doctor feedback, next visit schedule.
  * Chemist / Pharmacy Visits: Stock availability, secondary sales numbers, competitor presence.
  * Stockist Visits: Payment collections, inventory stock reconciliation.
  * Unlisted Doctor Visit: Ability to add and tag new doctor clinics pending admin verification.
* **Offline-First Synchronization**: Full offline DCR draft creation and automatic background sync with conflict resolution.

#### 3.4. Retail Chemist Prescription Audit (RCPA) & Product Order Booking (POB)
* **RCPA Module**: Captures prescribing trends of top doctors by auditing chemist inventory and prescription counter trends against competitor brands.
* **Product Order Booking (POB)**: Field-level order creation for stockists/chemists with discount rules, tax calculation (GST/VAT), delivery expectations, and instant PDF order receipt generation.

#### 3.5. E-Detailing & Visual Aids
* Digital interactive visual aid library (PDF, MP4, HTML5 slides) for medical detailing during doctor meetings.
* Time-spent analytics per product slide to measure detailing effectiveness.

#### 3.6. Field HRMS & Expense Automation
* **Geo-Punch Attendance**: Selfie + Geotagged attendance punch-in and punch-out.
* **Expense Claims**: Automated mileage calculation (verified route distance) + manual upload of lodging, meal, and toll receipts with image capture.
* **Leave Management**: Leave application and balance tracking with manager approval workflow.

---

### 4. Non-Functional Requirements (NFR)
* **Availability**: 99.9% uptime for backend APIs and sync services.
* **Battery Consumption**: Background location service designed to consume `< 5%` battery overhead over a 10-hour shift.
* **Data Security & Compliance**:
  * End-to-end HTTPS/TLS 1.3 encryption for data in transit.
  * AES-256 encryption for database at rest.
  * Mobile token storage in hardware-backed secure storage (`expo-secure-store` / Android Keystore / iOS Keychain).
* **Latency**: Sync API responses `< 200ms`; Admin live map telemetry ingestion `< 500ms`.
