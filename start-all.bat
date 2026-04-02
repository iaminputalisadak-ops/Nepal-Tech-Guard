@echo off
echo Starting Nepal TechGuard - Backend + Frontend
echo.
echo Backend: http://localhost:8000/api
echo Frontend: http://localhost:5173
echo Admin: http://localhost:5173/admin
echo.
cd /d "%~dp0"

REM Start PHP backend in background
echo Starting PHP backend...
start /b cmd /c "C:\xampp\php\php.exe -S localhost:8000 -t backend > nul 2>&1"

REM Wait for backend to start
timeout /t 2 /nobreak > nul

REM Start frontend
echo Starting React frontend...
cd frontend
npm run dev
