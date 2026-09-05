# SefMed Mobile SFA - Android & iOS Build Guide

## 📱 Features
- **15-Minute Automated Telemetry**: `expo-task-manager` background worker capturing GPS coordinates every 15 minutes.
- **Strict Admin Visibility**: Live location and trails are viewable exclusively by Super Admin on the web dashboard.
- **Offline Sync**: Caches DCR logs, orders, and telemetry when working in remote rural chemist clinics.
- **Geotagged Selfie Attendance**: Front-facing camera attendance punch-in with instant GPS lock.

## 🛠️ Prerequisites
- Node.js 18+ & npm
- EAS CLI: `npm install -g eas-cli`
- Expo account for cloud building

## 🚀 Building Standalone Android APK (for field testing)
```bash
cd mobile
npm install
eas build --platform android --profile preview
```
*This produces a direct `.apk` file that can be downloaded and installed on any Android phone.*

## 📦 Building Google Play Store AAB (Production Bundle)
```bash
eas build --platform android --profile production
```

## 🔋 Android Battery Exemption Notice
On Android 12+, ensure field reps grant:
1. `Allow all the time` for Location Permissions.
2. `Unrestricted` under App Battery Settings (bypasses OS Doze mode for the 15-minute worker).\n