@echo off
TITLE SefMed Pro - Standalone Android APK Builder
COLOR 0A

echo =======================================================================
echo          SEFMED PRO - 1-CLICK STANDALONE ANDROID APK BUILDER
echo =======================================================================
echo.
echo [1/2] Authenticating with Expo (shakir878)...
set "EXPO_TOKEN=Hi56RyJKJ2dfEcINVUoQFMmPLTCCJrnCwzZoXsYZ"

echo.
echo [2/2] Starting EAS Cloud Build for Android APK...
echo.
cd /d "e:\Pappu Da Company\mobile"
npx eas-cli build --platform android --profile preview

echo.
echo =======================================================================
echo Build process initiated. Check the download link and QR code above!
echo =======================================================================
pause
