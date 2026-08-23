# Maker Skills — Deployment Guide

This document covers production deployment of Maker Skills on an Ubuntu VPS that already hosts **RondeGuard**. Maker Skills must remain fully isolated from RondeGuard.

Related diagram: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 1. Application architecture

| Layer | Role |
|-------|------|
| Frontend | React SPA (Vite). Built as static files, served by Nginx inside the `frontend` container. |
| Backend | NestJS API on port `3020` inside Docker only. |
| Database | MongoDB Atlas (external). |
| Edge | Host Nginx terminates TLS and proxies to `127.0.0.1:3100`. |

Public entrypoint: **frontend only**. The browser uses same-origin API calls; the frontend Nginx proxies API paths to the backend.

---

## 2. Docker architecture

Compose project name: **`makerskills`**

| Service | Image build | Role |
|---------|-------------|------|
| `frontend` | `frontend/Dockerfile` | Nginx + SPA + API reverse proxy |
| `backend` | `backend/Dockerfile` | NestJS Node process |

Commands must always use the project name and app directory:

```bash
cd /home/ubuntu/makerskills
docker compose -p makerskills ps
docker compose -p makerskills logs -f
```

---

## 3. Directory structure (VPS)

```text
/home/ubuntu/
├── rondeguard/          # DO NOT TOUCH
└── makerskills/         # this application
    ├── frontend/
    ├── backend/
    ├── deploy/
    ├── docker-compose.yml
    ├── .env             # server-only secrets
    └── ...
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

Host Nginx continues to listen on `80` / `443` for all vhosts.

---

## 6. Volumes

| Volume | Mount | Purpose |
|--------|-------|---------|
| `makerskills_uploads` | `/app/uploads` on backend | Persistent Multer uploads |

Do not delete this volume unless you intend to destroy uploaded media.

---

## 7. Environment variables

Copy [`.env.example`](./.env.example) to `/home/ubuntu/makerskills/.env` on the server.

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | yes | `production` |
| `PORT` | no | Backend listen port (default `3020`) |
| `MONGODB_URI` | yes | Full MongoDB Atlas connection string |
| `JWT_SECRET` | yes | Strong random secret (required in production) |
| `CORS_ORIGINS` | yes | Comma-separated origins, e.g. `https://www.makerskills.tn,https://makerskills.tn` |
| `SITE_URL` | no | Public site URL for sitemap (default `https://www.makerskills.tn`) |
| `UPLOADS_DIR` | no | Set by Compose to `/app/uploads` |
| `VITE_API_URL` | no | Empty for same-origin production builds |
| `FRONTEND_HOST_PORT` | no | Host bind port (default `3100`) |
| `COMPOSE_PROJECT_NAME` | no | Default `makerskills` |

`VITE_*` values are baked at **image build time**. Changing them requires a rebuild.

---

## 8. Production secrets

1. Generate a strong `JWT_SECRET` (e.g. `openssl rand -hex 32`).
2. Put Atlas credentials only in `MONGODB_URI` on the server.
3. **Rotate** any MongoDB password that was previously hardcoded in source history.
4. Never commit `.env`.
5. Restrict file permissions: `chmod 600 /home/ubuntu/makerskills/.env`.

Default seeded admin accounts (if DB is empty) must be changed immediately after first boot.

---

## 9. GitHub repository setup

Remote (example): `git@github.com:MohamedAzizHadrouk/MakerSkills_Website.git`

On the VPS:

```bash
cd /home/ubuntu
git clone git@github.com:MohamedAzizHadrouk/MakerSkills_Website.git makerskills
cd makerskills
cp .env.example .env
# edit .env with real secrets
```

Prefer SSH clone URLs so the server never stores a personal GitHub password.

---

## 10. GitHub SSH Deploy Key (repository → VPS git pull)

Used by the VPS to `git pull` without personal credentials.

```bash
# On the VPS
ssh-keygen -t ed25519 -C "makerskills-deploy-key" -f ~/.ssh/makerskills_github_deploy -N ""
cat ~/.ssh/makerskills_github_deploy.pub
```

1. GitHub → repository → **Settings → Deploy keys → Add deploy key**.
2. Paste the **public** key.
3. Allow **read-only** access (enough for pull).
4. Configure SSH for GitHub:

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

1. Create a dedicated Linux user (recommended), e.g. `deploy`, with permission to run Docker for this project.
2. Generate a key pair **locally or in a secure place** (not committed to git):

```bash
ssh-keygen -t ed25519 -C "gha-makerskills-deploy" -f ./gha_makerskills_ed25519 -N ""
```

3. Install the **public** key in `~deploy/.ssh/authorized_keys` on the VPS.
4. Add GitHub Actions **repository secrets**:

| Secret | Value |
|--------|-------|
| `VPS_HOST` | VPS IP or hostname |
| `VPS_USER` | SSH username |
| `VPS_SSH_KEY` | Private key PEM contents |

SSH port is `22` in the workflow. Change [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) if your VPS uses another port.

Do not reuse personal interactive SSH keys in Actions if avoidable.

---

## 12. Nginx configuration (host)

Template in repo: [`deploy/nginx/makerskills.conf`](./deploy/nginx/makerskills.conf)

```bash
sudo cp /home/ubuntu/makerskills/deploy/nginx/makerskills.conf /etc/nginx/sites-available/makerskills.tn
sudo ln -sf /etc/nginx/sites-available/makerskills.tn /etc/nginx/sites-enabled/makerskills.tn
sudo nginx -t
sudo systemctl reload nginx
```

**Do not modify** `/etc/nginx/sites-enabled/roundeguard.com` unless there is a proven global conflict.

Resulting routing:

- `roundeguard.com` → RondeGuard
- `www.makerskills.tn` / `makerskills.tn` → Maker Skills (`127.0.0.1:3100`)

---

## 13. DNS configuration

Create A/AAAA records:

| Name | Type | Value |
|------|------|-------|
| `makerskills.tn` | A | VPS public IP |
| `www.makerskills.tn` | A | VPS public IP |

Wait for propagation before requesting certificates.

Also allow the VPS egress IP in **MongoDB Atlas Network Access**.

---

## 14. SSL / HTTPS configuration

TLS is terminated on **host Nginx** (not inside Docker).

```bash
sudo certbot --nginx -d www.makerskills.tn -d makerskills.tn
sudo nginx -t && sudo systemctl reload nginx
```

Containers keep speaking HTTP on localhost / Docker networks.

---

## 15. First deployment

```bash
cd /home/ubuntu/makerskills
cp .env.example .env
nano .env   # set MONGODB_URI, JWT_SECRET, CORS_ORIGINS, SITE_URL

chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

Then install the host Nginx vhost (section 12) and Certbot (section 14).

Verify:

```bash
curl -I http://127.0.0.1:3100/
curl -s http://127.0.0.1:3100/health
```

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

Uploads volume is preserved across deploys. To roll back code/images:

```bash
cd /home/ubuntu/makerskills
git fetch --all
git log --oneline -n 20
git checkout <known-good-commit>
./deploy/deploy.sh
```

If images are broken but git is fine, rebuild after fixing `.env` / code. Avoid `docker volume rm makerskills_uploads`.

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
| Backend unhealthy | Bad `MONGODB_URI` / Atlas IP allowlist / missing `JWT_SECRET` | `docker logs makerskills-backend` |
| Frontend 502 from host Nginx | Stack not up or wrong upstream port | `curl 127.0.0.1:3100`; check vhost |
| API 404 from browser | Path not proxied in `frontend/nginx.conf` | Add location; rebuild frontend |
| CORS errors | `CORS_ORIGINS` missing production origin | Update `.env`, recreate backend |
| Empty media after recreate | Volume deleted | Restore backup; never wipe `makerskills_uploads` casually |
| Actions deploy fails | SSH secrets / permissions | Verify `VPS_*` secrets and deploy user Docker access |

---

## 21. Security considerations

- Backend not published on host ports.
- No Docker socket mounted into Maker Skills containers.
- Secrets only in server `.env` + GitHub Actions SSH secrets.
- Production disables Swagger and Nest dev-user controllers.
- CORS allowlist required in production.
- Rotate Atlas credentials that ever lived in git history.
- Change default seeded admin passwords immediately.
- Least privilege: deploy user should not need root for day-to-day compose operations (Docker group or rootless — follow your VPS policy).

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
# /etc/nginx/sites-enabled/roundeguard.com
```

Safe scoped operations stay inside `/home/ubuntu/makerskills` and use `-p makerskills`.
