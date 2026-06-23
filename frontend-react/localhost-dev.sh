#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/app"

# Copy .env from sample if it doesn't exist
if [ ! -f .env ]; then
    echo "No .env file found. Copying from .env-sample..."
    cp .env-sample .env
    echo "Created .env — edit it with your settings if needed."
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Start the Vite dev server
echo "Starting frontend-react on http://localhost:5173 ..."
npm run dev
