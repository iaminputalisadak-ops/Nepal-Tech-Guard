@echo off
echo Starting PHP backend at http://localhost:8000
echo API will be at http://localhost:8000/api
echo.
echo Create frontend\.env with: VITE_API_URL=http://localhost:8000/api
echo.
cd /d "%~dp0"
C:\xampp\php\php.exe -S localhost:8000 -t backend
pause
