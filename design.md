# Design System & UI/UX Guidelines
## Theme: Precision Healthcare & Modern Field Intelligence

---

### 1. Brand Identity & Visual Aesthetic
The interface is designed for high efficiency, readability under direct sunlight during field visits, and executive clarity for the Admin command center. It balances clean clinical professionalism with modern SaaS fluidity.

* **Design Tone**: Trustworthy, Crisp, Modern, High-Contrast, Data-Dense.
* **Visual Style**: Clean flat design with subtle layered elevation, rounded cards (`rounded-xl` / `rounded-2xl`), and clear visual status indicators.

---

### 2. Color Palette & Tokens

| Token Name | Hex Code | Preview / Usage | Description |
|---|---|---|---|
| **Primary (Medical Navy)** | `#0F172A` / `#1E293B` | `bg-slate-900` | Header bars, primary brand elements, sidebar navigation. |
| **Accent / Action (Teal Cyan)**| `#0D9488` / `#14B8A6` | `bg-teal-600` | Primary buttons, active tabs, completed status, GPS live pins. |
| **Secondary (Medical Blue)**  | `#2563EB` / `#3B82F6` | `bg-blue-600` | Doctor profile links, E-Detailing banners, secondary actions. |
| **Success (Verified Green)**  | `#16A34A` / `#22C55E` | `bg-green-600` | Geofence verified visit, on-time DCR, in-shift attendance. |
| **Warning (Amber Alert)**     | `#D97706` / `#F59E0B` | `bg-amber-500` | Delayed DCR, route deviation alert, low battery warning. |
| **Danger (Critical Red)**      | `#DC2626` / `#EF4444` | `bg-red-600` | Mock GPS detected, out-of-territory breach, rejected claim. |
| **Background (Clean Slate)**  | `#F8FAFC`             | `bg-slate-50`  | Main screen background for mobile and web. |
| **Surface Card (White)**      | `#FFFFFF`             | `bg-white`     | Container cards, doctor lists, data table rows. |
| **Border / Divider**          | `#E2E8F0`             | `border-slate-200` | Clean dividers and component borders. |

---

### 3. Typography Hierarchy

* **Primary Font Family**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, sans-serif.
* **Monospace / Numerical Font** (for GPS coordinates, time stamps, currency): `JetBrains Mono` or `Fira Code`.

| Level | Size | Weight | Line Height | Example Use Case |
|---|---|---|---|---|
| **Display / H1** | 28px (Mobile) / 32px (Web) | Bold (700) | 1.2 | Admin Dashboard Title, Screen Headers |
| **H2** | 20px (Mobile) / 24px (Web) | SemiBold (600) | 1.3 | Card Group Titles, Doctor Detail Section |
| **H3 / Subheading** | 16px (Mobile) / 18px (Web) | Medium (500) | 1.4 | Doctor Name, DCR Section Header |
| **Body (Default)** | 14px (Mobile / Web) | Regular (400) | 1.5 | Standard descriptions, form input values |
| **Caption / Meta** | 12px (Mobile / Web) | Medium (500) | 1.4 | GPS timestamp, battery %, badge tags |

---

### 4. Key UI Components & Layouts

#### 4.1. Mobile Field App Design Rules
* **Touch Targets**: Minimum `48x48px` touch target areas for buttons and list items to accommodate rapid one-handed outdoor usage.
* **Offline Status Banner**: Subtle top indicator bar (`bg-amber-500`) stating *"Working Offline - X reports queued"* when cellular connection is lost.
* **Doctor Profile Card**: Clean badge for Doctor Tier (`A+`, `A`, `B`), distance indicator (*"120m away"*), and quick action buttons (Call, Navigate, Start Visit).

#### 4.2. Admin Live Fleet & Telemetry Map Suite
* **Interactive Map Controls**: Toggle for Heatmaps, Route Breadcrumbs, Doctor Geofence Overlays, and Traffic Layers.
* **Live Employee Sidebar**: Searchable list of all active reps with live status pills (🟢 Active / 🟡 Idle / 🔴 Off Duty) and last sync time (*"Updated 2 min ago"*).
* **Route Timeline Replay**: Interactive slider at the bottom allowing admins to scrub through the employee's entire day from 08:00 to 20:00, showing exact stopovers and doctor meetings.
