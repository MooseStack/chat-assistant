$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $ScriptDir

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting all services for localhost"   -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ── Backend ──────────────────────────────────────────────────────────────────
Write-Host "[1/3] Starting backend ..." -ForegroundColor Yellow
$backend = Start-Process pwsh -ArgumentList "-NoExit", "-Command", "& '$ScriptDir\backend\localhost-dev.ps1'" `
    -PassThru -WindowStyle Normal

# ── React Frontend ───────────────────────────────────────────────────────────
Write-Host "[2/3] Starting frontend-react ..." -ForegroundColor Yellow
$react = Start-Process pwsh -ArgumentList "-NoExit", "-Command", "& '$ScriptDir\frontend-react\localhost-dev.ps1'" `
    -PassThru -WindowStyle Normal

# ── Streamlit Frontend ──────────────────────────────────────────────────────
Write-Host "[3/3] Starting frontend-streamlit ..." -ForegroundColor Yellow
$streamlit = Start-Process pwsh -ArgumentList "-NoExit", "-Command", "& '$ScriptDir\frontend-streamlit\localhost-dev.ps1'" `
    -PassThru -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  All services launched!"                -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Backend:            http://localhost:8000"
Write-Host "  React Frontend:     http://localhost:5173"
Write-Host "  Streamlit Frontend: http://localhost:8501"
Write-Host ""
Write-Host "Press Ctrl+C to stop this watcher. Close the other windows to stop each service." -ForegroundColor DarkGray
Write-Host ""

# Wait for all processes — if any exits, report it
try {
    while ($true) {
        if ($backend.HasExited)   { Write-Host "Backend exited with code $($backend.ExitCode)"          -ForegroundColor Red }
        if ($react.HasExited)     { Write-Host "React frontend exited with code $($react.ExitCode)"     -ForegroundColor Red }
        if ($streamlit.HasExited) { Write-Host "Streamlit frontend exited with code $($streamlit.ExitCode)" -ForegroundColor Red }

        if ($backend.HasExited -and $react.HasExited -and $streamlit.HasExited) {
            Write-Host "All services have stopped." -ForegroundColor Yellow
            break
        }
        Start-Sleep -Seconds 2
    }
}
finally {
    # Clean up on Ctrl+C
    foreach ($proc in @($backend, $react, $streamlit)) {
        if (-not $proc.HasExited) {
            Write-Host "Stopping PID $($proc.Id) ..." -ForegroundColor Yellow
            Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
        }
    }
    Write-Host "All services stopped." -ForegroundColor Green
}
