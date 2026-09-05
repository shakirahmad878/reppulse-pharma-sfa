# Engineering Rules, Coding Standards & AI Guardrails

---

### 1. General Principles
1. **Security & Role Isolation First**: Never leak telemetry or location coordinates to non-admin accounts. Every endpoint fetching employee coordinates must have strict server-side validation for `ROLE_SUPER_ADMIN`.
2. **Offline-First Resilience**: Mobile components must assume zero network availability at any time. All critical actions (DCR submission, POB orders, Attendance mark) must write to the local database before attempting network sync.
3. **Type Safety Across Stack**: Strict TypeScript (`noImplicitAny: true`, strict null checks). All network boundaries (API responses, route params, push payloads) must be validated with **Zod**.
4. **Performance & Battery Preservation**: Background location tracking must strictly honor the 15-minute sampling interval and cease GPS acquisition immediately upon acquiring a valid fix to prevent battery drain.

---

### 2. Technology Choices: What to Use vs What to Avoid

| Category | ✅ Recommended / Required | ❌ Strictly Avoid | Reason |
|---|---|---|---|
| **Mobile Navigation** | Expo Router (file-based) | React Navigation manual stacks without types | Type-safe URL deep-linking and cleaner modular routes. |
| **Mobile State** | Zustand + TanStack Query | Redux Boilerplate / Copying server state to global stores | Prevents state desynchronization and stale cache issues. |
| **Local Storage (Mobile)** | `expo-secure-store` (tokens) + SQLite / MMKV | Raw unencrypted `AsyncStorage` for sensitive credentials | Security and cryptographic compliance. |
| **Styling** | Tailwind CSS / NativeWind | Inline object styles (`style={{...}}`) inside flatlists/loops | Inline style objects trigger unnecessary garbage collection and frame drops. |
| **Maps & Geospatial** | Leaflet / Mapbox GL + PostGIS | Raw string/float calculations for distance | PostGIS provides mathematically accurate spherical earth geofence checks (`ST_DWithin`). |
| **Validation** | Zod schemas for all DTOs | Unvalidated `any` type casting | Prevents runtime serialization failures. |

---

### 3. Strict Boundaries & Guidelines for AI Assistants
* **DO NOT** create mock credentials or hardcode API keys/JWT secrets in client code.
* **DO NOT** allow MR mobile screens to import or call Admin Location Tracking endpoints.
* **DO NOT** execute blocking network calls on the main JavaScript UI thread in React Native.
* **DO NOT** write un-virtualized large lists using `<ScrollView>{items.map(...)}</ScrollView>`. Always use `<FlatList>` or `@shopify/flash-list`.
* **DO** create reusable, accessible, and theme-token-driven components.
* **DO** ensure all API routes have explicit HTTP status codes, structured JSON error responses (`{ success: false, error: { code, message } }`), and request correlation IDs.

---

### 4. Error Handling & Logging Standards
* **Client Side**:
  * Display user-friendly error banners and retry buttons (never crash or show raw stack traces).
  * Gracefully handle permission denials (e.g. GPS Disabled, Location Permission Denied) with clear instructions to open device settings.
* **Server Side**:
  * Centralized Exception Filter catching standard HTTP and database exceptions.
  * Structured logging (Winston / Pino) outputting JSON logs with timestamp, userId, requestId, error trace, and latency.
