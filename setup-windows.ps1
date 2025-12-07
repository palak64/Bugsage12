# ============================================
# BugSage Setup Script for Windows (PowerShell)
# ============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   BugSage - Windows Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get script directory
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path

# ----------------------
# Check Prerequisites
# ----------------------

Write-Host "[1/5] Checking Prerequisites..." -ForegroundColor Yellow
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Gray
try {
    $nodeVersion = node -v 2>$null
    if ($nodeVersion) {
        $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
        if ($versionNumber -ge 20) {
            Write-Host "  [OK] Node.js $nodeVersion" -ForegroundColor Green
        } else {
            Write-Host "  [WARNING] Node.js $nodeVersion found, but v20+ recommended" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "  [ERROR] Node.js not found!" -ForegroundColor Red
    Write-Host "  Please install Node.js 20+ from: https://nodejs.org/" -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Gray
try {
    $npmVersion = npm -v 2>$null
    if ($npmVersion) {
        Write-Host "  [OK] npm v$npmVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "  [ERROR] npm not found!" -ForegroundColor Red
    exit 1
}

# Check Docker (optional)
Write-Host "Checking Docker (optional)..." -ForegroundColor Gray
try {
    $dockerVersion = docker --version 2>$null
    if ($dockerVersion) {
        Write-Host "  [OK] $dockerVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "  [INFO] Docker not found (optional, only needed for containerized deployment)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Prerequisites check complete!" -ForegroundColor Green
Write-Host ""

# ----------------------
# Check .env file
# ----------------------

Write-Host "[2/5] Checking Environment Configuration..." -ForegroundColor Yellow
Write-Host ""

# For local dev, .env needs to be in backend folder (where npm run dev is executed)
# For Docker, .env needs to be in project root
$backendEnvFile = Join-Path $SCRIPT_DIR "backend\.env"
$rootEnvFile = Join-Path $SCRIPT_DIR ".env"

$apiKey = $null

# Check if either .env exists
if ((Test-Path $backendEnvFile) -or (Test-Path $rootEnvFile)) {
    Write-Host "  [OK] .env file exists" -ForegroundColor Green
    
    # Copy to backend folder if only root exists
    if ((Test-Path $rootEnvFile) -and !(Test-Path $backendEnvFile)) {
        Copy-Item $rootEnvFile $backendEnvFile
        Write-Host "  [OK] Copied .env to backend folder" -ForegroundColor Green
    }
} else {
    Write-Host "  [INFO] .env file not found. Creating one..." -ForegroundColor Yellow
    Write-Host ""
    $apiKey = Read-Host "Enter your Gemini API Key (get from https://makersuite.google.com/app/apikey)"
    
    if ([string]::IsNullOrWhiteSpace($apiKey)) {
        $apiKey = "your_gemini_api_key_here"
        Write-Host "  [WARNING] No API key provided. AI features won't work until you update .env" -ForegroundColor Yellow
    }
    
    # Create .env in both locations
    "GEMINI_API_KEY=$apiKey" | Out-File -FilePath $rootEnvFile -Encoding UTF8 -NoNewline
    "GEMINI_API_KEY=$apiKey" | Out-File -FilePath $backendEnvFile -Encoding UTF8 -NoNewline
    Write-Host "  [OK] .env file created in project root and backend folder" -ForegroundColor Green
}

Write-Host ""

# ----------------------
# Install Backend Dependencies
# ----------------------

Write-Host "[3/5] Installing Backend Dependencies..." -ForegroundColor Yellow
Write-Host ""

$backendDir = Join-Path $SCRIPT_DIR "backend"
Push-Location $backendDir

try {
    npm install 2>&1 | Out-Null
    Write-Host "  [OK] Backend dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] Failed to install backend dependencies" -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location
Write-Host ""

# ----------------------
# Install Frontend Dependencies
# ----------------------

Write-Host "[4/5] Installing Frontend Dependencies..." -ForegroundColor Yellow
Write-Host ""

$frontendDir = Join-Path $SCRIPT_DIR "frontend"
Push-Location $frontendDir

try {
    npm install 2>&1 | Out-Null
    Write-Host "  [OK] Frontend dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] Failed to install frontend dependencies" -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location
Write-Host ""

# ----------------------
# Start Services
# ----------------------

Write-Host "[5/5] Starting BugSage Services..." -ForegroundColor Yellow
Write-Host ""

# Start backend in a new window
Write-Host "  Starting Backend Server..." -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; Write-Host 'Backend Server (Port 4000)' -ForegroundColor Cyan; npm run dev"

# Wait a moment for backend to start
Start-Sleep -Seconds 2

# Start frontend in a new window
Write-Host "  Starting Frontend Server..." -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; Write-Host 'Frontend Server (Vite)' -ForegroundColor Cyan; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   BugSage is Starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Two terminal windows have been opened:" -ForegroundColor Cyan
Write-Host "  - Backend Server (Express on port 4000)" -ForegroundColor White
Write-Host "  - Frontend Server (Vite, usually port 5173)" -ForegroundColor White
Write-Host ""
Write-Host "Access the application at:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  Backend:  http://localhost:4000" -ForegroundColor White
Write-Host ""
Write-Host "To stop: Close the terminal windows or press Ctrl+C in each" -ForegroundColor Gray
Write-Host ""

# Open browser after a delay
Start-Sleep -Seconds 5
Start-Process "http://localhost:5173"

Write-Host "Browser opened automatically!" -ForegroundColor Green
Write-Host ""

