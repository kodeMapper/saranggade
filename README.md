# 🚀 Sarang Gade - The Automated Smart Portfolio

Welcome to my portfolio! This isn't just a static website; it's a **Smart System** designed to maintain itself.

**Live Site:** [saranggade.vercel.app](https://saranggade.vercel.app)

---

## 📖 The Journey: From Static to "Alive"

As a developer, I realized that updating a portfolio is tedious. You do a project, push it to GitHub, then you have to manually copy descriptions, take screenshots, and update your website HTML/JSON. **I wanted to fix that.**

My goal was simple: **"If I do the work, my portfolio should update itself."**

### 🚧 Real Problems & How We Solved Them

This wasn't a simple project. The real world threw some serious curveballs. Here's what broke and how we fixed it:

#### 1. LinkedIn was blocking us 🛑
**The Problem:** The LinkedIn bot tried to log in using email and password (`LINKEDIN_EMAIL`, `LINKEDIN_PASSWORD`), but LinkedIn kept asking for OTPs. It was a security check that we couldn't bypass automatically.

**Attempt 1: Use Session Cookies.** We manually logged into LinkedIn in a browser, exported the cookies, and set them in `LINKEDIN_COOKIES`. The bot would inject these cookies to skip the login page entirely. It worked for a while.

**Attempt 2: The bot still failed.** Even with cookies, Render's servers got flagged. The scraping would randomly fail, give us empty data, or LinkedIn would just lock the session.

**The Final Fix: Manual Manager.** We built an admin page at `/admin/manage` where I can manually type in my experience or skills. The system treats this just like it came from the bot, so the rest of the automation pipeline (review, approval, commit) still works perfectly. This is the reliable fallback.

#### 2. Emails kept failing on Render �
**The Problem:** We were using `nodemailer` to send emails whenever the bot found a new update. But Render's free tier has limited outbound network, and SMTP requests to Gmail were failing constantly. Emails would just silently not send, or end up in spam.

**The Fix: Switch to Discord.** We added `DISCORD_WEBHOOK_URL`. Now, whenever there's a new update, the bot sends a beautiful embedded message to a private Discord channel. It's instant, reliable, and free.

#### 3. Images kept disappearing �
**The Problem:** The frontend is on Vercel. When I uploaded an image (like a company logo or certificate), it would be there for a few hours, but Vercel's filesystem resets after every deployment. The image would just vanish.

**The Fix:** We moved image handling to the backend on Render. When I upload an image now, the backend holds onto it. Then, when I approve the update, the `performGitCommit()` function runs `git add public/images/*` and pushes it to GitHub. The image is now permanently in the repo.

#### 4. How do we trust the bot? 🤖
**The Problem:** I didn't want the bot to just push whatever it scraped directly to my live site. What if it scraped garbage? What if I made a typo in the manual manager?

**The Fix: Human-in-the-Loop Review.**
1.  Bot or Manual Manager creates a **Pending Update** in MongoDB.
2.  A Discord notification is sent with a link.
3.  I click the link and land on `/admin/review/[id]`.
4.  I see a **Preview Card** of exactly how it will appear on my site. I can even edit it.
5.  Only when I click **"Approve"**, the backend updates `resume.json`, commits everything to Git, and triggers the `VERCEL_DEPLOY_HOOK` to redeploy the frontend.

---

## ✨ Key Features

### 🎨 Visual & UI
- **Matrix Loader:** A custom cyberpunk animation on page load.
- **Glassmorphism Theme:** Frosted glass cards, deep gradients.
- **Devicon Integration:** Official tech logos for skills.

### ⚙️ Automation Backend
- **GitHub Sync:** Finds new public repos and queues them for review.
- **Codolio Stats:** Logs into my Codolio profile and takes screenshots of my coding stats, then commits them directly to GitHub.
- **Manual Manager:** A fallback for when scrapers don't work (LinkedIn).
- **Auto-Commit & Deploy:** The backend commands Git to commit changes and then pings Vercel to redeploy.

---

## 🛠️ Project Structure

### 1. Frontend (`/src`) - Next.js
- **Role:** Displays `resume.json` and hosts the Admin UI.
- **Key Paths:**
    - `src/app/admin/review`: The review page for pending updates.
    - `src/app/admin/manage`: Manual entry for LinkedIn-style data.
    - `src/data/resume.json`: The single source of truth for portfolio data.

### 2. Backend (`/backend`) - Express.js
- **Role:** The automation brain. Runs cron jobs, handles Git, manages pending updates.
- **Key Paths:**
    - `services/githubService.js`: Checks for new repos.
    - `services/linkedinService.js`: (Unstable) Scrapes LinkedIn.
    - `services/codolioService.js`: Scrapes Codolio and takes screenshots.
    - `services/discordService.js`: Sends notifications via webhook.
    - `services/emailService.js`: (Disabled) Original email logic.

---

## 🔐 Environment Variables Explained

These are the keys that make everything run. Each one has a purpose.

### Backend (`backend/.env`)

| Variable | Why We Need It |
| :--- | :--- |
| `PORT` | Port for the Express server (usually `5000`). |
| `MONGODB_URI` | Connection string for MongoDB. We store pending updates and "seen" items here so the bot doesn't notify us twice about the same thing. |
| `GITHUB_USERNAME` | Used to fetch public repos from the GitHub API. |
| `GITHUB_TOKEN` | A Personal Access Token (with `repo` scope) to let the bot run `git push` to your repository. This is what enables auto-commit. |
| `DISCORD_WEBHOOK_URL` | The URL for a Discord channel's webhook. This is our primary notification channel since email failed. |
| `VERCEL_DEPLOY_HOOK` | A secret URL from Vercel. When we call it, Vercel redeploys the frontend. This is how the site updates seconds after approval. |
| `CODOLIO_EMAIL` | Login email for Codolio (codolio.com). |
| `CODOLIO_PASSWORD` | Login password for Codolio. The bot logs in to take screenshots. |
| `LINKEDIN_EMAIL` | (Optional) LinkedIn email. Mostly for initial login attempts. |
| `LINKEDIN_PASSWORD` | (Optional) LinkedIn password. |
| `LINKEDIN_COOKIES` | (Optional) A JSON string of browser cookies. This was meant to bypass OTP, but it's still unreliable. |
| `EMAIL_USER` | (Deprecated) Gmail address for sending emails. |
| `EMAIL_PASS` | (Deprecated) App Password for Gmail. SMTP was too unreliable on Render. |

### Frontend (`.env.local`)

| Variable | Why We Need It |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | The URL of the running backend. The frontend calls this to fetch updates, approve, reject, etc. |

---

## 🚀 How to Run Locally

1.  **Clone the Repo:**
    ```bash
    git clone https://github.com/kodeMapper/saranggade.git
    cd saranggade
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    cd backend && npm install
    ```

3.  **Setup Environment:**
    - Create `backend/.env` with at least `MONGODB_URI` and `GITHUB_TOKEN`.
    - Create `.env.local` in root with `NEXT_PUBLIC_API_URL=http://localhost:5000`.

4.  **Run:**
    ```bash
    # Terminal 1: Frontend
    npm run dev

    # Terminal 2: Backend
    cd backend && node server.js
    ```

---

## 👤 Author

**Sarang Gade**
- 🐙 [GitHub](https://github.com/kodeMapper)
- 💼 [LinkedIn](https://linkedin.com/in/sarang-gade)

*Automation isn't about replacing humans; it's about freeing them to do more interesting things.* ❤️
