#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

IMAGE_NAME="backend"
CONTAINER_NAME="backend"
PORT=8000

echo ""
echo "========================================"
echo "  Building & running: $CONTAINER_NAME"
echo "========================================"
echo ""

# Build the container image
echo "Building image '$IMAGE_NAME' ..."
podman build -t "$IMAGE_NAME" -f Containerfile .

# Stop and remove any existing container with the same name
if podman container exists "$CONTAINER_NAME" 2>/dev/null; then
    echo "Stopping existing container '$CONTAINER_NAME' ..."
    podman stop "$CONTAINER_NAME" 2>/dev/null || true
    podman rm "$CONTAINER_NAME" 2>/dev/null || true
fi

# Run the container
ENV_ARGS=()
if [ -f .env ]; then
    ENV_ARGS+=(--env-file .env)
fi

echo "Starting container '$CONTAINER_NAME' on http://localhost:$PORT ..."
podman run --name "$CONTAINER_NAME" \
    -p "$PORT:$PORT" \
    "${ENV_ARGS[@]}" \
    "$IMAGE_NAME"
