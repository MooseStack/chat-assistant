$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $ScriptDir

# Copy .env from sample if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "No .env file found. Copying from .env-sample..."
    Copy-Item ".env-sample" ".env"
    Write-Host "Created .env — edit it with your settings if needed."
}

# Create virtual environment if it doesn't exist
if (-not (Test-Path ".venv")) {
    Write-Host "Creating Python virtual environment..."
    python -m venv .venv
}

# Activate virtual environment
& .venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "Installing dependencies..."
pip install -r app\requirements.txt

# Start the FastAPI server
Write-Host "Starting backend on http://localhost:8000 ..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
