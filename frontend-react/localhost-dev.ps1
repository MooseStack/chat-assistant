$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location "$ScriptDir\app"

# Copy .env from sample if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "No .env file found. Copying from .env-sample..."
    Copy-Item ".env-sample" ".env"
    Write-Host "Created .env — edit it with your settings if needed."
}

# Install dependencies
Write-Host "Installing dependencies..."
npm.cmd install

# Start the Vite dev server
Write-Host "Starting frontend-react on http://localhost:5173 ..."
npm.cmd run dev
