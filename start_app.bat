@echo off
TITLE SefMed Pro - Pharma SFA & Telemetry Platform Launcher
COLOR 0A

echo =======================================================================
echo          SEFMED PRO - PHARMA SALES FORCE AUTOMATION (SFA)
echo =======================================================================
echo.
echo [1/3] Starting Backend REST & Telemetry Server (Port 5000)...
start "SefMed Backend API" cmd /k "cd server && npm run dev"

echo.
echo [2/3] Starting Frontend Web Dashboard & Field Simulator (Port 5173)...
start "SefMed Web Dashboard" cmd /k "npm run dev"

echo.
echo [3/3] Opening SefMed Pro Dashboard in your default browser...
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo =======================================================================
echo  SefMed Pro is now running!
echo  - Web Application: http://localhost:5173
echo  - Backend API:     http://localhost:5000/api/health
echo =======================================================================
pause
