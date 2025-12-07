@echo off
title BugSage Setup
color 0B

echo.
echo ========================================
echo    BugSage - Quick Start (Windows)
echo ========================================
echo.

:: Get the directory where this script is located
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

:: Check Node.js
echo [1/5] Checking Node.js...
node -v >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo   [ERROR] Node.js not found!
    echo   Please install Node.js 20+ from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
for /f "tokens=1 delims=." %%a in ('node -v') do set NODE_VER=%%a
set NODE_VER=%NODE_VER:v=%
echo   [OK] Node.js installed (v%NODE_VER%)

:: Check npm
echo [2/5] Checking npm...
npm -v >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo   [ERROR] npm not found!
    pause
    exit /b 1
)
echo   [OK] npm installed

:: Check .env file
:: For local dev, .env needs to be in backend folder (where npm run dev is executed)
:: For Docker, .env needs to be in project root
echo [3/5] Checking .env file...

set "ROOT_ENV=%SCRIPT_DIR%.env"
set "BACKEND_ENV=%SCRIPT_DIR%backend\.env"

if exist "%ROOT_ENV%" (
    echo   [OK] .env file exists in project root
    if not exist "%BACKEND_ENV%" (
        copy "%ROOT_ENV%" "%BACKEND_ENV%" >nul
        echo   [OK] Copied .env to backend folder
    )
) else if exist "%BACKEND_ENV%" (
    echo   [OK] .env file exists in backend folder
    copy "%BACKEND_ENV%" "%ROOT_ENV%" >nul
    echo   [OK] Copied .env to project root
) else (
    echo   [INFO] Creating .env file...
    set /p "API_KEY=Enter your Gemini API Key (or press Enter to skip): "
    if "%API_KEY%"=="" (
        echo GEMINI_API_KEY=your_gemini_api_key_here > "%ROOT_ENV%"
        echo GEMINI_API_KEY=your_gemini_api_key_here > "%BACKEND_ENV%"
        echo   [WARNING] No key provided. Update .env later for AI features.
    ) else (
        echo GEMINI_API_KEY=%API_KEY% > "%ROOT_ENV%"
        echo GEMINI_API_KEY=%API_KEY% > "%BACKEND_ENV%"
        echo   [OK] .env file created with your API key
    )
)

:: Install Backend
echo [4/5] Installing Backend dependencies...
cd /d "%SCRIPT_DIR%backend"
call npm install >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo   [ERROR] Backend install failed!
    pause
    exit /b 1
)
echo   [OK] Backend ready

:: Install Frontend
echo [5/5] Installing Frontend dependencies...
cd /d "%SCRIPT_DIR%frontend"
call npm install >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo   [ERROR] Frontend install failed!
    pause
    exit /b 1
)
echo   [OK] Frontend ready

echo.
echo ========================================
echo    Starting BugSage Services...
echo ========================================
echo.

:: Start Backend in new window
start "BugSage Backend (Port 4000)" cmd /k "cd /d "%SCRIPT_DIR%backend" && npm run dev"

:: Wait a moment
timeout /t 3 /nobreak >nul

:: Start Frontend in new window
start "BugSage Frontend (Vite)" cmd /k "cd /d "%SCRIPT_DIR%frontend" && npm run dev"

:: Wait for services to start
timeout /t 5 /nobreak >nul

echo.
color 0A
echo ========================================
echo    BugSage is Running!
echo ========================================
echo.
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:4000
echo.
echo   Two terminal windows opened for the servers.
echo   Close them to stop BugSage.
echo.

:: Open browser
start http://localhost:5173

echo Opening browser...
echo.
pause

