<div align="center">

# Sarang Gade — The Self-Updating Portfolio

A developer portfolio that **maintains itself**. New GitHub repos, coding stats, and experience updates flow through an automated backend pipeline — reviewed, approved, committed, and deployed — without touching the frontend code.

**[iamsarang.dev](https://iamsarang.dev)**

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Express](https://img.shields.io/badge/Express-5-000?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-node:20--slim-2496ED?style=flat-square&logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000?style=flat-square&logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render&logoColor=white)

</div>

---

## Why?

Keeping a portfolio up-to-date is tedious. Every new project means copying descriptions, taking screenshots, editing JSON, and redeploying. This project eliminates that friction:

**If I do the work, my portfolio updates itself.**

The backend watches GitHub for new repositories, fetches live coding stats from Codolio, and queues everything for human review before anything goes live. No blind automation — every change is previewed and approved before it reaches production.

## Features

### Frontend
- **Glassmorphism UI** — Frosted-glass cards, cosmic parallax backgrounds, spotlight effects, and smooth Framer Motion animations
- **Stacking Carousel** — 3D project cards with keyboard navigation and autoplay
- **Live Coding Stats** — Real-time data from LeetCode, Codeforces, CodeChef, GeeksforGeeks, and HackerRank via Codolio API
- **Dark / Light Mode** — Full theme support across all components
- **Responsive Design** — Mobile-first layouts with adaptive spacing and navigation
- **Visitor Feedback** — Contact form backed by MongoDB with Google Sheets logging

### Backend Automation
- **GitHub Sync** — Cron job detects new public repos, fetches README content, and creates pending updates
- **Codolio Stats** — Lightweight REST API calls (no Puppeteer) fetch coding profile data and commit `codolio.json` directly to the repo
- **Human-in-the-Loop Review** — Every update goes through a preview → approve/reject flow before reaching the live site
- **Auto-Commit & Deploy** — Approved changes are committed to GitHub and trigger a Vercel deploy hook automatically
- **Discord Notifications** — Rich embeds sent to a private channel whenever an update is queued for review
- **Google Sheets Logging** — Every visitor feedback entry is logged to a Google Sheet

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        AUTOMATION FLOW                          │
│                                                                  │
│  GitHub API ──┐                                                  │
│               ├──▶ Backend (Express) ──▶ MongoDB (Pending Updates)│
│  Codolio API ─┘        │                       │                 │
│                         │                       ▼                 │
│                    Discord Webhook ◀── Admin Review Page          │
│                                           │                      │
│                                     ┌─────┴─────┐               │
│                                     │  Approve?  │               │
│                                     └─────┬─────┘               │
│                                           │ Yes                  │
│                                           ▼                      │
│                               Update resume.json                 │
│                               Git commit & push                  │
│                               Trigger Vercel Deploy              │
│                                           │                      │
│                                           ▼                      │
│                                 Live Site Updated                │
└──────────────────────────────────────────────────────────────────┘
```

| Component | Technology | Hosting |
|---|---|---|
| Frontend | Next.js 16, React 19, Framer Motion | Vercel |
| Backend | Express 5, Node.js 20, node-cron | Render (Docker) |
| Database | MongoDB Atlas (Mongoose) | MongoDB Atlas |
| Notifications | Discord Webhooks | — |
| Feedback Logging | Google Sheets API | — |
| Analytics | Vercel Analytics | Vercel |

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.js                    # Main portfolio page
│   │   ├── layout.js                  # Root layout (Outfit + Playfair fonts)
│   │   ├── globals.css                # Global styles and CSS variables
│   │   ├── admin/
│   │   │   ├── manage/               # Manual entry form (LinkedIn fallback)
│   │   │   └── review/               # Approve/reject pending updates
│   │   └── project/[id]/             # Individual project case study pages
│   ├── components/                    # React components (JSX + CSS Modules)
│   │   ├── Hero.jsx                   # Landing section
│   │   ├── CodolioProfile.jsx         # Live coding stats dashboard
│   │   ├── StackingCarousel.jsx       # 3D project carousel
│   │   ├── Skills.jsx                 # Tech stack with Devicon integration
│   │   ├── Experience.jsx             # Work experience timeline
│   │   ├── Comments.jsx               # Visitor feedback section
│   │   └── ui/                        # Reusable background effects
│   ├── data/
│   │   ├── resume.json                # Single source of truth for all portfolio data
│   │   └── codolio.json               # Auto-updated coding stats (committed by bot)
│   └── middleware.js                  # Basic Auth for /admin/* routes
│
├── backend/
│   ├── server.js                      # Express server, cron schedules, API routes
│   ├── services/
│   │   ├── githubService.js           # Detects new public repos via GitHub API
│   │   ├── codolioService.js          # Fetches coding stats via Codolio REST API
│   │   ├── contentUpdater.js          # Writes approved data to resume.json
│   │   ├── discordService.js          # Sends Discord webhook notifications
│   │   ├── googleSheetService.js      # Logs feedback to Google Sheets
│   │   ├── pendingUpdatesManager.js   # CRUD for pending updates in MongoDB
│   │   ├── stateManager.js            # Tracks known repos to avoid duplicates
│   │   └── linkedinService.js         # LinkedIn scraper (disabled — manual fallback)
│   └── models/                        # Mongoose schemas
│
├── Dockerfile                         # node:20-slim (~200MB image)
├── render.yaml                        # Render deployment config
└── package.json
```

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [Git](https://git-scm.com/)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) database (free tier works)
- A [Discord Webhook URL](https://support.discord.com/hc/en-us/articles/228383668) (for notifications)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kodeMapper/saranggade.git
cd saranggade
```

### 2. Install dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies (separate package.json in /backend is not required;
# all deps are in the root package.json)
```

### 3. Configure environment variables

Create two files:

**`backend/.env`**

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>

# GitHub automation
GITHUB_USERNAME=your-github-username
GITHUB_TOKEN=ghp_your_personal_access_token

# Notifications
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Auto-deploy (optional)
VERCEL_DEPLOY_HOOK=https://api.vercel.com/v1/integrations/deploy/...

# Admin auth
ADMIN_USER=admin
ADMIN_PASS=your-password

# Google Sheets feedback logging (optional)
GOOGLE_SHEET_ID=your-spreadsheet-id
GOOGLE_CREDENTIALS_JSON={"type":"service_account",...}
```

**`.env.local`** (project root)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
ADMIN_USER=admin
ADMIN_PASS=your-password
```

### 4. Run the project

Open two terminals:

```bash
# Terminal 1 — Frontend (Next.js dev server)
npm run dev
```

```bash
# Terminal 2 — Backend (Express server)
node backend/server.js
```

The frontend runs on `http://localhost:3000` and the backend on `http://localhost:5000`.

## Cron Schedules

The backend runs automated jobs on the following schedules (IST):

| Job | Schedule | What it does |
|---|---|---|
| GitHub Sync | 1:00, 7:00, 13:00, 19:00 | Checks for new public repos, queues them for review |
| Codolio Stats | 4:00, 10:00, 16:00, 22:00 | Fetches coding stats, commits `codolio.json`, pushes to GitHub |

## API Overview

All routes are served by the Express backend on port `5000`.

| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/api/feedback` | Submit visitor feedback |
| `POST` | `/api/trigger-check` | Manually trigger GitHub repo scan |
| `POST` | `/api/trigger-codolio` | Manually trigger Codolio stats update |
| `GET` | `/api/admin/updates/:id` | Get pending update details |
| `POST` | `/api/admin/updates/:id/approve` | Approve and deploy an update |
| `POST` | `/api/admin/updates/:id/reject` | Reject an update |
| `POST` | `/api/admin/manual-update` | Create a manual update entry |
| `POST` | `/api/admin/reset-github-state` | Clear known repos (force re-scan) |

> [!NOTE]
> Routes under `/api/admin/*` require Basic Authentication via the `ADMIN_USER` and `ADMIN_PASS` environment variables.

## Deployment

### Frontend — Vercel

The frontend deploys automatically on push to `main` via Vercel's GitHub integration. Set the following environment variables in Vercel:

- `NEXT_PUBLIC_API_URL` — URL of the Render backend
- `ADMIN_USER` / `ADMIN_PASS` — For admin route protection via middleware

### Backend — Render (Docker)

The backend runs as a Docker web service on Render using `render.yaml`.

The Dockerfile uses `node:20-slim` as the base image (~200MB), installs Git for auto-commit functionality, and runs `node backend/server.js`.

> [!IMPORTANT]
> The backend needs the `GITHUB_TOKEN` environment variable with `repo` scope to push commits. Without it, auto-commit and Codolio stats updates will fail silently.

## Troubleshooting

### `git push` rejected — remote contains work you don't have locally

The backend's Codolio cron job auto-commits `codolio.json` directly to GitHub. If you've made local changes without pulling first:

```bash
git pull --rebase origin main
git push origin main
```

### Discord notifications not sending

- Verify `DISCORD_WEBHOOK_URL` is set in `backend/.env`
- Test the webhook: visit `http://localhost:5000/api/test-email` (this route tests Discord, not email)

### Admin pages return 401

Both the frontend middleware (`src/middleware.js`) and backend routes check for Basic Auth. Ensure `ADMIN_USER` and `ADMIN_PASS` are set in both `backend/.env` and `.env.local`.

### Codolio stats not updating

- The service uses the public Codolio API at `https://api.codolio.com/profile?userKey=<username>`. No login credentials are needed.
- Check `backend/services/codolio_debug.txt` for detailed logs.

### Google Sheets logging fails

- Ensure the service account has **Editor** access to the target spreadsheet.
- For cloud deployment, set `GOOGLE_CREDENTIALS_JSON` as a stringified JSON environment variable.
- For local development, place `google-credentials.json` in the `backend/` directory.

## Author

**Sarang Gade**

- [GitHub](https://github.com/kodeMapper)
- [LinkedIn](https://linkedin.com/in/sarang-gade)
- [Portfolio](https://iamsarang.dev)
