#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PIDS=()

cleanup() {
    echo ""
    echo "Stopping all services..."
    for pid in "${PIDS[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            echo "  Stopping PID $pid ..."
            kill "$pid" 2>/dev/null || true
        fi
    done
    wait 2>/dev/null || true
    echo "All services stopped."
    exit 0
}

trap cleanup SIGINT SIGTERM

echo ""
echo "========================================"
echo "  Starting all services for localhost"
echo "========================================"
echo ""

# ── Backend ──────────────────────────────────────────────────────────────────
echo "[1/3] Starting backend ..."
bash "$SCRIPT_DIR/backend/localhost-dev.sh" &
PIDS+=($!)

# ── React Frontend ───────────────────────────────────────────────────────────
echo "[2/3] Starting frontend-react ..."
bash "$SCRIPT_DIR/frontend-react/localhost-dev.sh" &
PIDS+=($!)

# ── Streamlit Frontend ──────────────────────────────────────────────────────
echo "[3/3] Starting frontend-streamlit ..."
bash "$SCRIPT_DIR/frontend-streamlit/localhost-dev.sh" &
PIDS+=($!)

echo ""
echo "========================================"
echo "  All services launched!"
echo "========================================"
echo ""
echo "  Backend:            http://localhost:8000"
echo "  React Frontend:     http://localhost:5173"
echo "  Streamlit Frontend: http://localhost:8501"
echo ""
echo "Press Ctrl+C to stop all services."
echo ""

# Wait for all background processes
wait
