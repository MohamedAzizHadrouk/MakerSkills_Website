#!/usr/bin/env bash
# Idempotent deployment for Maker Skills only.
# MUST be run from /home/ubuntu/makerskills (never from /home/ubuntu/rondeguard).
set -euo pipefail

APP_DIR="${APP_DIR:-/home/ubuntu/makerskills}"
COMPOSE_PROJECT="${COMPOSE_PROJECT_NAME:-makerskills}"
FRONTEND_HOST_PORT="${FRONTEND_HOST_PORT:-3100}"
HEALTH_RETRIES="${HEALTH_RETRIES:-30}"
HEALTH_SLEEP="${HEALTH_SLEEP:-2}"

log() { echo "[deploy] $*"; }
fail() { echo "[deploy] ERROR: $*" >&2; exit 1; }

cd "$APP_DIR" || fail "Cannot cd to $APP_DIR"

if [[ ! -f docker-compose.yml ]]; then
  fail "docker-compose.yml missing in $APP_DIR — refusing to continue"
fi

if [[ "$(basename "$APP_DIR")" != "makerskills" ]]; then
  fail "Safety check: APP_DIR basename must be makerskills (got $(basename "$APP_DIR"))"
fi

if [[ ! -f .env ]]; then
  fail ".env missing. Copy .env.example to .env and fill secrets before deploying."
fi

# Required secrets
# shellcheck disable=SC1091
set -a
source .env
set +a

[[ -n "${MONGODB_URI:-}" ]] || fail "MONGODB_URI is required in .env"
[[ -n "${JWT_SECRET:-}" ]] || fail "JWT_SECRET is required in .env"
[[ -n "${CORS_ORIGINS:-}" ]] || fail "CORS_ORIGINS is required in .env"

log "Updating git repository (if .git present)..."
if [[ -d .git ]]; then
  git fetch --all --prune
  git pull --ff-only
else
  log "No .git directory — skipping pull (image/code already present)"
fi

log "Validating Compose file..."
docker compose -p "$COMPOSE_PROJECT" config >/dev/null

log "Building and recreating Maker Skills containers only..."
# Do NOT run: docker system prune, docker compose down on other projects
docker compose -p "$COMPOSE_PROJECT" up --build -d --remove-orphans

log "Waiting for container health..."
backend_ok=0
frontend_ok=0
for i in $(seq 1 "$HEALTH_RETRIES"); do
  bstatus="$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' makerskills-backend 2>/dev/null || echo missing)"
  fstatus="$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' makerskills-frontend 2>/dev/null || echo missing)"
  log "Attempt $i/$HEALTH_RETRIES — backend=$bstatus frontend=$fstatus"
  [[ "$bstatus" == "healthy" ]] && backend_ok=1
  [[ "$fstatus" == "healthy" ]] && frontend_ok=1
  if [[ "$backend_ok" -eq 1 && "$frontend_ok" -eq 1 ]]; then
    break
  fi
  sleep "$HEALTH_SLEEP"
done

[[ "$backend_ok" -eq 1 ]] || fail "Backend container not healthy. Previous containers may still be running; inspect: docker logs makerskills-backend"
[[ "$frontend_ok" -eq 1 ]] || fail "Frontend container not healthy. Inspect: docker logs makerskills-frontend"

log "Checking frontend HTTP..."
curl -fsS "http://127.0.0.1:${FRONTEND_HOST_PORT}/" >/dev/null \
  || fail "Frontend not reachable on 127.0.0.1:${FRONTEND_HOST_PORT}"

log "Checking backend health via frontend proxy..."
curl -fsS "http://127.0.0.1:${FRONTEND_HOST_PORT}/health" | grep -q '"status":"ok"' \
  || fail "Backend /health check failed via frontend proxy"

log "Deployment succeeded."
docker compose -p "$COMPOSE_PROJECT" ps
