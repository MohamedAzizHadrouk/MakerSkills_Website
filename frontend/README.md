# Maker Skills — Frontend

Public website and admin dashboard for **Maker Skills**. Built with React, TypeScript, Vite, Tailwind CSS, and React Router.

Repository: [Maker_Skills_WebSite_Frontend](https://github.com/AzizHadrouk1/Maker_Skills_WebSite_Frontend.git)

---

## Prerequisites

Install these before you start:

| Tool | Recommended version |
|------|---------------------|
| [Node.js](https://nodejs.org/) | 18.x or 20.x (LTS) |
| npm | Comes with Node.js |
| [Git](https://git-scm.com/) | Latest stable |

The app talks to a **backend API**. For full functionality (shop, admin, events, etc.), the API must be running and configured in `.env` (see below).

---

## Clone the project

```bash
git clone https://github.com/AzizHadrouk1/Maker_Skills_WebSite_Frontend.git
cd Maker_Skills_WebSite_Frontend
```

If you already cloned the repo and only need the latest code:

```bash
git pull origin main
```

---

## Install dependencies

From the project root:

```bash
npm install
```

---

## Environment variables

Create a `.env` file in the project root (this file is not committed to Git):

```env
VITE_API_URL=http://localhost:3020
```

Replace the URL with your backend address if it differs. Many services fall back to `http://localhost:3020` when the variable is missing, but you should set it explicitly for a consistent setup.

After changing `.env`, restart the dev server.

---

## Run the project

### Development (hot reload)

```bash
npm run dev
```

Vite prints the local URL (usually `http://localhost:5173`). Open it in your browser.

### Production build

```bash
npm run build
```

Output is written to the `dist/` folder.

### Preview production build locally

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

### Serve built files (production-style)

After `npm run build`, you can use the included script (requires `serve` via `npx`):

```bash
# Linux / macOS
./start-frontend.sh

# Or manually
npx serve -s dist -l 3000
```

---

## Git workflow: work on your own branch

Never commit directly to `main` for feature work. Use a personal or feature branch, then open a pull request.

### 1. Update `main`

```bash
git checkout main
git pull origin main
```

### 2. Create a branch

Use a clear name, for example:

```bash
git checkout -b feature/update-navbar
# or
git checkout -b fix/shop-cart-error
# or
git checkout -b your-name/homepage-hero
```

### 3. Make your changes

Edit files, then check what changed:

```bash
git status
git diff
```

### 4. Commit

```bash
git add .
git commit -m "Short description of what you changed and why"
```

Example messages:

- `feat: put Accueil first in the header navigation`
- `fix: correct product image URL on shop page`

### 5. Push your branch to GitHub

First push (sets upstream):

```bash
git push -u origin feature/update-navbar
```

Later pushes on the same branch:

```bash
git push
```

### 6. Open a Pull Request

1. Go to the repository on GitHub.
2. Click **Compare & pull request** for your branch.
3. Describe your changes and request review.
4. After approval, merge into `main`.

> **Note:** Pushing to `main` triggers automatic deployment (see `.github/workflows/deploy.yml`). Always merge via PR unless you are explicitly doing a release.

### Keep your branch up to date with `main`

While your PR is open, sync with latest `main`:

```bash
git checkout main
git pull origin main
git checkout feature/update-navbar
git merge main
# resolve conflicts if any, then:
git push
```

---

## Where to modify the project

High-level layout:

```
maker_frontend/
├── src/
│   ├── App.tsx                 # Routes (public + admin)
│   ├── main.tsx                # App entry point
│   ├── components/
│   │   └── Layout/             # Header, Footer, AdminLayout, PublicLayout
│   ├── features/
│   │   ├── public/             # Public pages (home, shop, academy, lab40, …)
│   │   └── admin/              # Admin dashboard modules
│   ├── data/
│   │   └── translations.ts     # FR/EN labels (nav, home, etc.)
│   ├── stores/
│   │   └── useStore.ts         # Global state (theme, language, auth)
│   └── shared/                 # API client, shared UI, utilities
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

| What you want to change | Where to look |
|-------------------------|---------------|
| Top navigation links / order | `src/components/Layout/Header.tsx` → `navItems` |
| Footer | `src/components/Layout/Footer.tsx` |
| Text FR / EN | `src/data/translations.ts` |
| Public page routes | `src/App.tsx` |
| Home page sections | `src/features/public/home/` |
| Shop | `src/features/public/shop/` |
| Admin sidebar & pages | `src/features/admin/`, `src/components/Layout/AdminLayout.tsx` |
| API calls | `src/shared/apiClient.ts` and `*.service.ts` files under `features/admin/` |

### Adding a new public page (checklist)

1. Create the page component under `src/features/public/…`
2. Add a `<Route>` in `src/App.tsx` (inside `PublicLayout` if it should use the public header/footer)
3. Add a nav link in `Header.tsx` if it should appear in the menu
4. Add translation keys in `translations.ts` if needed

### Admin area

- Login: `/admin/login`
- Protected routes use `AdminLayout` and require authentication via `useStore`

---

## Tech stack

- **React 18** + **TypeScript**
- **Vite 5** — dev server and build
- **React Router 6** — routing
- **Tailwind CSS** — styling
- **Zustand** — client state
- **Axios** — HTTP requests
- **Framer Motion** — animations

---

## Troubleshooting

| Problem | What to try |
|---------|-------------|
| `npm install` fails | Use Node 18+; delete `node_modules` and `package-lock.json`, then run `npm install` again |
| Blank data / API errors | Check `.env` → `VITE_API_URL` and ensure the backend is running |
| Port 5173 already in use | Stop the other process or run `npm run dev -- --port 5174` |
| Changes to `.env` not applied | Restart `npm run dev` |
| Git push rejected | Run `git pull origin main` (or rebase/merge `main` into your branch), fix conflicts, push again |

---

## Deployment (reference)

On push to `main`, GitHub Actions deploys to the server: pull, `npm install`, `npm run build`, then PM2 runs `start-frontend.sh` to serve `dist` on port 3000.

Developers normally do not deploy manually; merge to `main` after review.

---

## Scripts summary

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Questions?

Ask the team lead or open an issue on GitHub with:

- What you tried
- Branch name
- Error message or screenshot
- Steps to reproduce
