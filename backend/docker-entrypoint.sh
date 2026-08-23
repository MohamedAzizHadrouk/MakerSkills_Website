#!/bin/sh
set -eu

echo "[entrypoint] Validating required environment variables..."

missing=0
for var in MONGODB_URI JWT_SECRET CORS_ORIGINS; do
  eval "val=\${$var:-}"
  if [ -z "$val" ]; then
    echo "[entrypoint] ERROR: $var is missing or empty. Set it in /home/ubuntu/makerskills/.env"
    missing=1
  fi
done

if [ "$missing" -ne 0 ]; then
  echo "[entrypoint] Refusing to start. Copy .env.example to .env and fill real values."
  exit 1
fi

# Reject .env.example placeholders (causes querySrv ENOTFOUND _mongodb._tcp.CLUSTER.mongodb.net)
case "$MONGODB_URI" in
  *@CLUSTER.mongodb.net*|*"USER:PASSWORD@"*)
    echo "[entrypoint] ERROR: MONGODB_URI is still the .env.example placeholder."
    echo "[entrypoint] Edit /home/ubuntu/makerskills/.env and set the real Atlas URI from Atlas → Connect."
    echo "[entrypoint] Hostname must look like something.xxxxx.mongodb.net — not CLUSTER.mongodb.net"
    exit 1
    ;;
esac

# Named volume may remount /app/uploads as root — fix ownership before dropping privileges
mkdir -p /app/uploads
chown -R app:app /app/uploads

echo "[entrypoint] Starting NestJS as user app..."
exec su-exec app "$@"
