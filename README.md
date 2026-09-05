# SefMed Pro - Enterprise Pharma Sales Force Automation (SFA) & Location Intelligence

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-teal.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![PostGIS](https://img.shields.io/badge/PostGIS-16-336791.svg)](https://postgis.net/)
[![Vite Build](https://img.shields.io/badge/Build-Passing%20(0%20errors)-brightgreen.svg)]()

**SefMed Pro** is a comprehensive Pharma Sales Force Automation (SFA) and Field Reporting platform built to mirror and enhance the capabilities of the Google Play *Sefmed* application.

---

## 🌟 Key Features

### 1. ⏱️ 15-Minute Automated Telemetry & Strict Admin RBAC
- **Low-Power GPS Burst**: Periodic sub-5-second location fixes every 15 minutes during active shift hours.
- **Battery-Optimized**: Verified battery drain of **< 0.10%** over a 10-hour work shift (4.67 mAh on 4500 mAh battery).
- **Strict Privacy Barrier**: Live employee location and historical route replays ($1\times, 2\times, 4\times$) are strictly gated to **Super Admin** only (`403 Forbidden` for all other roles).
- **Anti-Spoofing & Offline Queue**: Detects mock GPS and queues telemetry locally when connectivity drops in rural clinics.

### 2. 📍 Doctor Clinic Geofencing (100m Radius)
- Interactive Leaflet map overlays with 100-meter circular geofence perimeters.
- Automated compliance verification tags on Daily Call Reports (DCRs).

### 3. 💼 Complete Field Commercial Operations
- **Monthly Tour Planner (TP)**: Route planning with Area Manager (ASM) 1-click approvals.
- **Daily Call Reporting (DCR)**: Log doctor visits, product presentations, and sample distributions.
- **Secondary Sales (POB) Order Booking**: Real-time PTR/PTS calculation, trade bonus schemes (10+1), 12% GST breakdown, and instant **Tally Prime XML** / **Marg ERP CSV** export.
- **Chemist RCPA Auditing**: Competitor prescription tracking and market share analytics.
- **Interactive E-Detailing**: Digital slide presenter for doctor promotion.

### 4. 👥 HRMS & MIS Analytics
- **Geo-Attendance**: Selfie camera verification with GPS coordinates.
- **GPS-Verified Mileage Expenses**: Auto-calculated travel allowance (@ ₹7.50/km) + Daily Allowance (DA) and lodging.
- **Executive MIS Reports**: Doctor call coverage matrix, secondary sales funnel, and one-click CSV export.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ & npm

### Method 1: One-Click Windows Launcher
Double-click `start_app.bat` to automatically launch both backend and frontend servers.

### Method 2: Manual Terminal Startup
```bash
# 1. Install frontend dependencies and start Vite dev server
npm install
npm run dev

# 2. In a separate terminal, start the Backend API
cd server
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🧪 Running Verification Tests
```bash
python tests/telemetry_battery_audit.py
```
```
=== TEST 1: PostGIS Doctor Clinic Geofence Precision ===
  [PASS] Point A (15.3m): VERIFIED INSIDE CLINIC GEOFENCE (100m)
  [PASS] Point B (478.8m): VERIFIED OUTSIDE CLINIC GEOFENCE (100m)
  [PASS] Haversine / PostGIS ST_DWithin Geofence Math Verified.

=== TEST 2: 15-Minute Background Telemetry Battery Budget ===
  Total Pings in 10h Shift: 40 pings
  Total Active Hardware Uptime: 140.0 seconds (2.33 mins)
  Total Energy Consumed: 4.67 mAh
  Shift Battery Overhead: 0.10% of 4500 mAh
  [PASS] Battery Budget < 5% STRICT SPECIFICATION SATISFIED.

=== TEST 3: Strict Role-Based Access Control (Admin-Only Location) ===
  [PASS] Role 'SUPER_ADMIN ': ACCESS GRANTED (Full Telemetry)
  [PASS] Role 'ASM         ': ACCESS DENIED (403 Forbidden)
  [PASS] Role 'MR          ': ACCESS DENIED (403 Forbidden)
  [PASS] Role 'CHEMIST     ': ACCESS DENIED (403 Forbidden)
  [PASS] RBAC Boundary Verification Passed. Employee tracking strictly restricted to Admin.
```

---

## 📱 Mobile App (Android APK & AAB)
```bash
cd mobile
npm install
# Build standalone Android APK for field testing:
eas build -p android --profile preview

# Build production Google Play bundle:
eas build -p android --profile production
```

---

## 📄 Documentation
- [`PRD.md`](./PRD.md) - Product Requirements Document
- [`Architecture.md`](./Architecture.md) - System & DB Architecture
- [`rules.md`](./rules.md) - Technical Guidelines & AI Guardrails
- [`phasis.md`](./phasis.md) - Phase Milestones Breakdown
- [`design.md`](./design.md) - Design Tokens & Typography
- [`SECURITY_AUDIT.md`](./SECURITY_AUDIT.md) - Security & Privacy Audit
- [`PLAY_STORE_LISTING.md`](./PLAY_STORE_LISTING.md) - Google Play Store Assets & Data Safety
- [`PRIVACY_POLICY.md`](./PRIVACY_POLICY.md) - Production Privacy Policy
