@echo off
REM Start both backend and frontend servers (Windows version)

echo Starting Calculator Full-Stack Application...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Start backend
echo Starting backend server on port 8001...
cd backend
start "Calculator Backend" python main.py
cd ..

REM Wait a moment for backend to start
timeout /t 2 /nobreak >nul

REM Start frontend
echo Starting frontend server on port 8000...
cd frontend
start "Calculator Frontend" python -m http.server 8000
cd ..

echo.
echo ✅ Application started successfully!
echo.
echo Backend API: http://localhost:8001
echo Frontend:    http://localhost:8000
echo.
echo Press any key to stop both servers...
pause >nul

REM Stop servers
taskkill /f /im python.exe >nul 2>&1
echo.
echo Servers stopped.
pause
