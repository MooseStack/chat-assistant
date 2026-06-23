#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PIDS=()

cleanup() {
    echo ""
    echo "Stopping all containers..."
    podman stop backend frontend-react frontend-streamlit 2>/dev/null || true
    podman rm backend frontend-react frontend-streamlit 2>/dev/null || true
    for pid in "${PIDS[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null || true
        fi
    done
    wait 2>/dev/null || true
    echo "All containers stopped."
    exit 0
}

trap cleanup SIGINT SIGTERM

echo ""
echo "========================================"
echo "  Building & running all containers"
echo "========================================"
echo ""

# ── Backend ──────────────────────────────────────────────────────────────────
echo "[1/3] Starting backend container ..."
bash "$SCRIPT_DIR/backend/podman-dev.sh" &
PIDS+=($!)

# ── React Frontend ───────────────────────────────────────────────────────────
echo "[2/3] Starting frontend-react container ..."
bash "$SCRIPT_DIR/frontend-react/podman-dev.sh" &
PIDS+=($!)

# ── Streamlit Frontend ──────────────────────────────────────────────────────
echo "[3/3] Starting frontend-streamlit container ..."
bash "$SCRIPT_DIR/frontend-streamlit/podman-dev.sh" &
PIDS+=($!)

echo ""
echo "========================================"
echo "  All container builds launched!"
echo "========================================"
echo ""
echo "  Backend:            http://localhost:8000"
echo "  React Frontend:     http://localhost:5173"
echo "  Streamlit Frontend: http://localhost:8501"
echo ""
echo "Press Ctrl+C to stop all containers."
echo ""

wait
