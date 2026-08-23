# Maker Skills — Deployment Guide

Production deployment of Maker Skills on an Ubuntu VPS that already hosts **RondeGuard**.

Maker Skills must stay fully isolated from RondeGuard.

Related diagram: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Quick start (checklist)

Do these in order on the VPS (`ubuntu` user):

1. [Prerequisites](#0-prerequisites)
2. [Clone the repository](#9-github-repository-setup--clone)
3. [Create `.env`](#7-environment-variables)
4. [Build and start Docker](#15-first-deployment-step-by-step)
5. [Verify health](#19-health-checks)
6. [Install host Nginx vhost](#12-nginx-configuration-host)
7. [DNS + SSL](#13-dns-configuration) / [#14](#14-ssl--https-configuration)
8. [Optional: CI/CD](#16-cicd-deployment)

**Layout on the VPS:**

```text
/home/ubuntu/
├── rondeguard/     # existing app — DO NOT TOUCH
└── makerskills/    # this application
```

---

## 0. Prerequisites

On the VPS, confirm:

| Requirement | Check |
|-------------|--------|
| Docker Engine | `docker --version` |
| Docker Compose plugin | `docker compose version` |
| Host Nginx | `nginx -v` |
| Git + SSH to GitHub | `ssh -T git@github.com` |
| RondeGuard still running | `docker ps` (do not stop those containers) |

Also:

- MongoDB Atlas cluster reachable from the VPS
- Add the **VPS public / egress IP** in Atlas → Network Access
- DNS for `makerskills.tn` and `www.makerskills.tn` pointing to the VPS (can be done before or after first local curl tests)

---

## 1. Application architecture

| Layer | Role |
|-------|------|
| Frontend | React SPA (Vite). Static files served by Nginx inside the `frontend` container. |
| Backend | NestJS API on port `3020` **inside Docker only** (not published on the host). |
| Database | MongoDB Atlas (external). |
| Edge | Host Nginx terminates TLS and proxies to `127.0.0.1:3100`. |

Public entrypoint: **frontend only**. The browser calls same-origin API paths; the frontend container Nginx proxies them to the backend.

---

## 2. Docker architecture

Compose project name: **`makerskills`**

| Service | Image build | Role |
|---------|-------------|------|
| `frontend` | `frontend/Dockerfile` | Nginx + SPA + API reverse proxy |
| `backend` | `backend/Dockerfile` | NestJS Node process |

Always run Compose from the app directory with the project name:

```bash
cd /home/ubuntu/makerskills
docker compose -p makerskills ps
docker compose -p makerskills logs -f
docker compose -p makerskills up --build -d
```

---

## 3. Directory structure (VPS)

```text
/home/ubuntu/
├── rondeguard/          # DO NOT TOUCH
└── makerskills/         # this application
    ├── frontend/
    ├── backend/
    │   └── src/uploads/ # NestJS UploadsModule (source code — must be in git)
    ├── deploy/
    │   ├── deploy.sh
    │   └── nginx/makerskills.conf
    ├── docker-compose.yml
    ├── .env             # server-only secrets (never commit)
    ├── .env.example
    ├── ARCHITECTURE.md
    └── DEPLOYMENT.md
```

---

## 4. Docker network

| Name | Driver | Purpose |
|------|--------|---------|
| `makerskills_net` | bridge | Frontend ↔ backend only |

Backend hostname inside the network: `backend` (port `3020`).

Do **not** connect Maker Skills containers to RondeGuard networks.

---

## 5. Ports

### Host ports used by Maker Skills

| Binding | Service |
|---------|---------|
| `127.0.0.1:3100` → container `80` | Frontend Nginx |

Backend is **not** published on the host.

### Ports reserved by RondeGuard (do not reuse)

- `127.0.0.1:3000`
- `127.0.0.1:5000`
- `127.0.0.1:27018`
- `127.0.0.1:8884`
- `127.0.0.1:8085`
- `127.0.0.1:18083`

Host Nginx continues to listen on `80` / `443` for all virtual hosts.

---

## 6. Volumes

| Volume | Mount | Purpose |
|--------|-------|---------|
| `makerskills_uploads` | `/app/uploads` on backend | Persistent Multer media files |

Do not delete this volume unless you intend to destroy uploaded media.

---

## 7. Environment variables

On the VPS:

```bash
cd /home/ubuntu/makerskills
cp .env.example .env
nano .env    # or: vim .env
chmod 600 .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | yes | Must be `production` |
| `PORT` | no | Backend listen port (default `3020`) |
| `MONGODB_URI` | yes | Full MongoDB Atlas connection string |
| `JWT_SECRET` | yes | Strong random secret — required in production |
| `CORS_ORIGINS` | yes | e.g. `https://www.makerskills.tn,https://makerskills.tn` |
| `SITE_URL` | no | Sitemap base (default `https://www.makerskills.tn`) |
| `UPLOADS_DIR` | no | Set by Compose to `/app/uploads` |
| `VITE_API_URL` | no | Leave **empty** for same-origin production builds |
| `FRONTEND_HOST_PORT` | no | Host bind port (default `3100`) |
| `COMPOSE_PROJECT_NAME` | no | Default `makerskills` |

Example shape (fake values — **never** leave `USER` / `PASSWORD` / `CLUSTER` in production):

```env
NODE_ENV=production
PORT=3020
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/?retryWrites=true&w=majority&appName=makerskills
JWT_SECRET=replace-with-openssl-rand-hex-32
CORS_ORIGINS=https://www.makerskills.tn,https://makerskills.tn
SITE_URL=https://www.makerskills.tn
VITE_API_URL=
FRONTEND_HOST_PORT=3100
```

Replace `USER`, `PASSWORD`, and `CLUSTER` with values from **MongoDB Atlas → Connect**. A real host looks like `makerskills.xxxxx.mongodb.net`, not the literal word `CLUSTER`.

Generate a JWT secret:

```bash
openssl rand -hex 32
```

`VITE_*` values are baked at **image build time**. Changing them requires `docker compose … up --build -d` again.

---

## 8. Production secrets

1. Put Atlas credentials only in `MONGODB_URI` on the server.
2. **Rotate** any MongoDB password that was previously hardcoded in old source history.
3. Never commit `.env`.
4. `chmod 600 /home/ubuntu/makerskills/.env`.
5. After first boot, change any default seeded admin passwords immediately.

---

## 9. GitHub repository setup / clone

Remote (example): `git@github.com:MohamedAzizHadrouk/MakerSkills_Website.git`

### First clone on the VPS

```bash
cd /home/ubuntu
git clone git@github.com:MohamedAzizHadrouk/MakerSkills_Website.git makerskills
cd makerskills
```

Prefer SSH clone URLs so the server never stores a personal GitHub password.

### Later updates

```bash
cd /home/ubuntu/makerskills
git pull --ff-only
```

---

## 10. GitHub SSH Deploy Key (repository → VPS `git pull`)

Used by the VPS to pull without personal credentials.

```bash
# On the VPS
ssh-keygen -t ed25519 -C "makerskills-deploy-key" -f ~/.ssh/makerskills_github_deploy -N ""
cat ~/.ssh/makerskills_github_deploy.pub
```

1. GitHub → repository → **Settings → Deploy keys → Add deploy key**.
2. Paste the **public** key.
3. Allow **read-only** access.
4. Configure SSH:

```bash
# ~/.ssh/config on VPS
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/makerskills_github_deploy
  IdentitiesOnly yes
```

```bash
ssh -T git@github.com
```

---

## 11. VPS SSH access (GitHub Actions → VPS)

Used by CI to run `./deploy/deploy.sh`.

1. Prefer the existing `ubuntu` user (same home as RondeGuard) or a dedicated `deploy` user with Docker rights.
2. Generate a key pair **outside** the repo:

```bash
ssh-keygen -t ed25519 -C "gha-makerskills-deploy" -f ./gha_makerskills_ed25519 -N ""
```

3. Append the **public** key to `~/.ssh/authorized_keys` on the VPS.
4. Add GitHub Actions **repository secrets**:

| Secret | Value |
|--------|-------|
| `VPS_HOST` | VPS IP or hostname |
| `VPS_USER` | SSH username (`ubuntu`) |
| `VPS_SSH_KEY` | Private key PEM contents |

SSH port is `22` in [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml). Edit the workflow if you use another port.

---

## 12. Nginx configuration (host)

Template: [`deploy/nginx/makerskills.conf`](./deploy/nginx/makerskills.conf)

```bash
sudo cp /home/ubuntu/makerskills/deploy/nginx/makerskills.conf /etc/nginx/sites-available/makerskills.tn
sudo ln -sf /etc/nginx/sites-available/makerskills.tn /etc/nginx/sites-enabled/makerskills.tn
sudo nginx -t
sudo systemctl reload nginx
```

**Do not modify** the RondeGuard virtual host (e.g. `roundeguard.com` / whatever file already exists under `sites-enabled`).

Routing:

- RondeGuard domain → existing upstream (unchanged)
- `www.makerskills.tn` / `makerskills.tn` → `127.0.0.1:3100` (Maker Skills)

---

## 13. DNS configuration

| Name | Type | Value |
|------|------|-------|
| `makerskills.tn` | A | VPS public IP |
| `www.makerskills.tn` | A | VPS public IP |

Wait for propagation before Certbot.

Also allow the VPS egress IP in **MongoDB Atlas → Network Access**.

---

## 14. SSL / HTTPS configuration

TLS terminates on **host Nginx** (not inside Docker).

```bash
sudo certbot --nginx -d www.makerskills.tn -d makerskills.tn
sudo nginx -t && sudo systemctl reload nginx
```

---

## 15. First deployment (step by step)

### Step A — Configure secrets

```bash
cd /home/ubuntu/makerskills
cp -n .env.example .env
nano .env
chmod 600 .env
```

Fill at least: `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGINS`, `NODE_ENV=production`.

### Step B — Build and start (manual)

```bash
cd /home/ubuntu/makerskills
docker compose -p makerskills up --build -d
```

Or use the idempotent script (pulls git, validates `.env`, builds, health-checks):

```bash
cd /home/ubuntu/makerskills
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

### Step C — Wait for healthy containers

```bash
docker compose -p makerskills ps
docker ps --filter name=makerskills
```

Expected: `makerskills-backend` and `makerskills-frontend` are **Up** / **healthy**.

### Step D — Local HTTP checks (before DNS/SSL)

```bash
curl -I http://127.0.0.1:3100/
curl -s http://127.0.0.1:3100/health
```

Health should include `"status":"ok"`.

### Step E — Public edge

1. Install Nginx vhost ([section 12](#12-nginx-configuration-host)).
2. Point DNS ([section 13](#13-dns-configuration)).
3. Run Certbot ([section 14](#14-ssl--https-configuration)).
4. Open `https://www.makerskills.tn/` in a browser.

---

## 16. CI/CD deployment

Workflow: [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)

Triggers:

- Push to `main` (includes PR merges into `main`)
- Manual `workflow_dispatch`

Flow:

1. Actions SSHs into the VPS.
2. `cd /home/ubuntu/makerskills`
3. Runs `./deploy/deploy.sh` (git pull, compose build/up, health checks).

The workflow never enters `/home/ubuntu/rondeguard` and never runs global Docker cleanup.

---

## 17. Rollback procedure

Uploads volume is preserved across deploys.

```bash
cd /home/ubuntu/makerskills
git fetch --all
git log --oneline -n 20
git checkout <known-good-commit>
./deploy/deploy.sh
```

Avoid `docker volume rm makerskills_uploads`.

Emergency stop **only this stack**:

```bash
cd /home/ubuntu/makerskills
docker compose -p makerskills stop
```

Do **not** run `docker compose down` against RondeGuard.

---

## 18. Logs

```bash
cd /home/ubuntu/makerskills
docker compose -p makerskills logs -f --tail=200
docker compose -p makerskills logs -f backend
docker compose -p makerskills logs -f frontend
sudo tail -f /var/log/nginx/error.log
```

---

## 19. Health checks

| Check | Command / URL |
|-------|----------------|
| Backend container | Docker healthcheck → `GET /health` |
| Frontend container | Docker healthcheck → `GET /` |
| Via host loopback | `curl -fsS http://127.0.0.1:3100/` |
| API via proxy | `curl -fsS http://127.0.0.1:3100/health` → `{"status":"ok",...}` |
| Public HTTPS | `curl -fsSI https://www.makerskills.tn/` |

---

## 20. Troubleshooting

| Symptom | Likely cause | Action |
|---------|--------------|--------|
| Port already allocated | Clash with RondeGuard / wrong `FRONTEND_HOST_PORT` | Keep `3100`; never bind `3000` |
| Backend unhealthy | Bad `MONGODB_URI` / Atlas IP allowlist / missing `JWT_SECRET` or `CORS_ORIGINS` | See [Backend unhealthy runbook](#backend-unhealthy-runbook) below |
| Frontend 502 from host Nginx | Stack not up or wrong upstream port | `curl 127.0.0.1:3100`; check vhost |
| API 404 from browser | Path not proxied in `frontend/nginx.conf` | Add location; rebuild frontend |
| CORS errors | `CORS_ORIGINS` missing production origin | Update `.env`, recreate backend |
| Empty media after recreate | Volume deleted | Restore backup; never wipe `makerskills_uploads` casually |
| Actions deploy fails | SSH secrets / permissions | Verify `VPS_*` secrets and Docker access for the SSH user |

### Backend unhealthy runbook

Symptom:

```text
dependency failed to start: container makerskills-backend is unhealthy
```

The frontend will not start until the backend is healthy (`depends_on: condition: service_healthy`).

#### 1. Read the logs (first step)

```bash
docker logs makerskills-backend 2>&1 | tail -80
docker inspect makerskills-backend --format '{{.State.Status}} {{.State.Health.Status}} {{.State.Error}}'
```

#### 2. Confirm required `.env` keys are set (no placeholders)

```bash
cd /home/ubuntu/makerskills
grep -E '^(MONGODB_URI|JWT_SECRET|CORS_ORIGINS|NODE_ENV)=' .env | sed 's/=.*/=***set***/'
```

All four lines should print `***set***`. Then open `.env` and ensure:

- `MONGODB_URI` is a real Atlas URI (not `USER:PASSWORD@CLUSTER`)
- `JWT_SECRET` is a long random value (`openssl rand -hex 32`)
- `CORS_ORIGINS` lists your public origins, e.g. `https://www.makerskills.tn,https://makerskills.tn`
- `NODE_ENV=production`

The backend entrypoint refuses to start if `MONGODB_URI`, `JWT_SECRET`, or `CORS_ORIGINS` are empty, or if `MONGODB_URI` still contains the `.env.example` placeholders (`CLUSTER.mongodb.net` / `USER:PASSWORD@`).

#### 3. `querySrv ENOTFOUND _mongodb._tcp.CLUSTER.mongodb.net`

**Cause:** `/home/ubuntu/makerskills/.env` still has the template URI from `.env.example` (`…@CLUSTER.mongodb.net…`). DNS cannot resolve `CLUSTER.mongodb.net`.

**Fix on the VPS (no code rebuild required once URI is correct):**

1. Atlas → your cluster → **Connect** → copy the real `mongodb+srv://…` string.
2. `nano /home/ubuntu/makerskills/.env` — set `MONGODB_URI` to that real URI (real user, password, and host like `something.xxxxx.mongodb.net`).
3. Atlas → **Network Access** → allow the VPS public IP (or temporarily `0.0.0.0/0` to test).
4. Recreate:

```bash
cd /home/ubuntu/makerskills
docker compose -p makerskills up -d --force-recreate
docker logs -f makerskills-backend
```

#### 4. `Cannot find module '/app/dist/main.js'`

If logs show this error, Nest was emitting `dist/src/main.js` instead of `dist/main.js` (root-level TS files polluted the compile `rootDir`). Current repo locks [`backend/tsconfig.build.json`](./backend/tsconfig.build.json) to `src/` only.

```bash
cd /home/ubuntu/makerskills
git pull --ff-only
docker compose -p makerskills up --build -d
docker logs -f makerskills-backend
```

#### 5. Allow the VPS IP in MongoDB Atlas

Atlas → **Network Access** → add the VPS public / egress IP (or temporarily `0.0.0.0/0` only to test connectivity).

If Atlas blocks the IP, logs show a Mongo network/auth/timeout error even when `.env` is correct.

#### 6. Rebuild and restart only Maker Skills

```bash
cd /home/ubuntu/makerskills
docker compose -p makerskills up --build -d
docker compose -p makerskills ps
docker logs -f makerskills-backend
```

Wait up to ~90s for the healthcheck grace period (Atlas connect can be slow).

#### 7. Verify

```bash
curl -s http://127.0.0.1:3100/health
curl -I http://127.0.0.1:3100/
```

Expect `"status":"ok"` from `/health`.

### Docker build: Nest TypeScript failures

If you previously saw:

```text
Cannot find module './uploads/uploads.module'
scripts/backfill-slugs.ts … MONGODB_URI … string | undefined
```

Cause:

1. `backend/src/uploads` was gitignored by a broad `**/uploads/` rule and missing on the VPS clone.
2. `scripts/` was included in `nest build`.

Fix (already in current repo):

- Track `backend/src/uploads/*` (gitignore/dockerignore allowlists).
- Exclude `scripts` from [`backend/tsconfig.build.json`](./backend/tsconfig.build.json).

On the VPS after pulling the fix:

```bash
cd /home/ubuntu/makerskills
git pull --ff-only
ls backend/src/uploads    # must show uploads.module.ts and uploads.controller.ts
docker compose -p makerskills up --build -d
```

---

## 21. Security considerations

- Backend not published on host ports.
- No Docker socket mounted into Maker Skills containers.
- Secrets only in server `.env` + GitHub Actions SSH secrets.
- Production disables Swagger and Nest dev-user controllers.
- CORS allowlist required in production.
- Rotate Atlas credentials that ever lived in git history.
- Change default seeded admin passwords immediately.
- Least privilege for day-to-day Compose operations.

---

## 22. Commands that must NOT be executed on the production VPS

Unless explicitly approved for a planned maintenance window:

```bash
# Global destructive cleanup — can remove RondeGuard images/layers
docker system prune -a
docker system prune -a --volumes

# Wrong project directory
cd /home/ubuntu/rondeguard && docker compose down
docker compose -p <rondeguard-project> down

# Destroy Maker Skills uploads
docker volume rm makerskills_uploads

# Stop everything on the host
docker stop $(docker ps -q)

# Modify RondeGuard configs
# /home/ubuntu/rondeguard/**
# RondeGuard Nginx site under /etc/nginx/sites-enabled/
```

Safe scoped operations stay inside `/home/ubuntu/makerskills` and use `-p makerskills`.
