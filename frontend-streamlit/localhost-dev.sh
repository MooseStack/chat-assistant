#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Copy .env from sample if it doesn't exist
if [ ! -f .env ]; then
    echo "No .env file found. Copying from .env-sample..."
    cp .env-sample .env
    echo "Created .env — edit it with your settings if needed."
fi

# Create virtual environment if it doesn't exist
if [ ! -d .venv ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r app/requirements.txt

# Start the Streamlit app
echo "Starting frontend-streamlit on http://localhost:8501 ..."
streamlit run app/main.py --server.port 8501
