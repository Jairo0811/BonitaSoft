param(
    [switch]$Install
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$ApiPath = Join-Path $Root "demo\mock-api"
$UiPath = Join-Path $Root "ui\dashboard-react"
$VenvPath = Join-Path $ApiPath ".venv"
$ActivatePath = Join-Path $VenvPath "Scripts\Activate.ps1"

Write-Host "BonitaSoft local launcher" -ForegroundColor Cyan
Write-Host "Root: $Root"

if ($Install -or -not (Test-Path $VenvPath)) {
    Write-Host "Preparing Python environment..." -ForegroundColor Yellow
    Push-Location $ApiPath
    if (-not (Test-Path $VenvPath)) {
        python -m venv .venv
    }
    & $ActivatePath
    python -m pip install --upgrade pip
    pip install -r requirements.txt
    Pop-Location
}

if ($Install -or -not (Test-Path (Join-Path $UiPath "node_modules"))) {
    Write-Host "Preparing React dependencies..." -ForegroundColor Yellow
    Push-Location $UiPath
    npm install
    Pop-Location
}

$ApiCommand = "Set-Location '$ApiPath'; & '$ActivatePath'; uvicorn main:app --reload --port 8000"
$UiCommand = "Set-Location '$UiPath'; npm run dev"

Write-Host "Starting FastAPI at http://localhost:8000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", $ApiCommand

Start-Sleep -Seconds 2

Write-Host "Starting React dashboard at http://localhost:5173 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", $UiCommand

Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"

Write-Host "Done. Two PowerShell windows were opened: API and dashboard." -ForegroundColor Cyan
