# Google Play Store Listing & Metadata Package

## 📱 App Name
**SefMed Pro - Pharma SFA & MR Reporting**

## 🏷️ Short Description (80 characters)
Pharma Sales Force Automation, 15-min background tracking, DCR & POB orders.

## 📄 Full Description (Up to 4000 characters)

**SefMed Pro** is the next-generation enterprise Sales Force Automation (SFA) and Field Reporting solution built specifically for Pharmaceutical Manufacturers, Marketing Companies, and Medical Representatives (MRs).

Empower your field force with automated, battery-optimized 15-minute background location telemetry, intelligent doctor clinic geofencing, daily call reporting (DCR), and secondary sales (POB) order booking with instant Tally and Marg ERP sync.

---

### 🌟 Key Features

#### 1. ⏱️ Automated 15-Minute Background Telemetry
- Captures automated sub-5-second GPS fixes every 15 minutes during active shift hours.
- Uses advanced sensor algorithms with < 0.10% battery drain over a 10-hour shift.
- Anti-spoofing detection identifies mock GPS and location falsification.
- Full offline sync ensures coordinates are preserved in low-connectivity rural territories.

#### 2. 🔒 Strict Role-Based Privacy Barrier
- Employee real-time positions and historical route replay trails are strictly restricted to **Super Admin** view only.
- Respects field rep privacy with clear punch-in / punch-out shift boundaries.

#### 3. 📍 100m Doctor Clinic Geofence Verification
- Verifies physical arrival at designated clinics using high-accuracy Haversine / PostGIS math.
- Automatic green verification badges on DCR call logs for compliant doctor visits.

#### 4. 📝 Daily Call Reports (DCR) & Tour Plans (TP)
- Effortless monthly tour planning with Area Manager (ASM) 1-click approvals.
- Log doctor calls, sample distributions, and feedback in under 30 seconds.

#### 5. 💊 Secondary Sales (POB) Order Booking
- Book retail chemist orders directly with automatic PTR / PTS pricing calculations.
- Support for trade bonus schemes (e.g. 10+1 free) and 12% GST tax invoices.
- 1-click export to **Marg ERP 9+** and **Tally Prime XML**.

#### 6. 🤳 Geotagged Selfie Attendance & Expense Claims
- Front-camera selfie attendance verification with real-time GPS locking.
- GPS-calculated travel mileage reimbursement (@ ₹7.50 / km) + Daily Allowance (DA) and lodging.

---

## 🛡️ Google Play Data Safety Declaration

| Data Type | Purpose | Ephemeral / Stored | Shared with 3rd Parties? |
| :--- | :--- | :--- | :--- |
| **Location (Background & Foreground)** | To track field route compliance, calculate mileage travel allowances, and verify 100m doctor clinic check-ins. | Encrypted in transit & at rest; stored in private database. | **NO (Never shared or sold)** |
| **Photos / Camera** | To capture attendance punch-in selfies and receipt uploads. | Encrypted in storage. | **NO** |
| **Personal Info (Name, Employee ID, Email)** | Account authentication and role-based access control. | Stored securely. | **NO** |

---

## 🔑 Permissions Declared
- `ACCESS_FINE_LOCATION` & `ACCESS_COARSE_LOCATION`
- `ACCESS_BACKGROUND_LOCATION` (Subject to Google Play background location policy approval)
- `FOREGROUND_SERVICE_LOCATION`
- `CAMERA`
- `RECEIVE_BOOT_COMPLETED`\n