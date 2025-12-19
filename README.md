# 🚀 Sarang Gade - Automated Developer Portfolio

A modern, high-performance portfolio website built with **Next.js 16**. What makes this special is the **Smart Automation Backend** that keeps your portfolio up-to-date automatically by tracking your GitHub, LinkedIn, and Codolio activity.

![Portfolio Preview](https://saranggade.vercel.app/og-image.png)

---

## ✨ Key Features

- **⚡ Automated Updates** – No more manually editing JSON files.
- **🎨 Modern Aesthetic** – Dark mode, glassmorphism, and smooth animations.
- **📱 Fully Responsive** – Looks perfect on mobile, tablet, and desktop.
- **👨‍💻 Live Coding Stats** – Auto-updates your Codolio coding card daily.
- **💼 LinkedIn Sync** – Scrapes and adds your new jobs, skills, and certs.
- **📦 GitHub Sync** – Detects new public repos and helps you add them.
- **💬 Feedback System** – Visitors can send messages (saved to MongoDB).

---

## 🏗️ Project Architecture

The project is split into two parts:

### 1. Frontend (`/src`)
- Built with **Next.js 16** (App Router).
- Displays your data from `resume.json`.
- Hosted on **Vercel** for speed and SEO.

### 2. Backend (`/backend`)
- Built with **Express.js** & **Node.js**.
- Runs automation bots (Puppeteer) and Cron jobs.
- API for handling forms, uploads, and automated checks.
- Hosted on **Render** (free tier compatible).

---

## 🤖 How the Automation Works

### 1. 📦 GitHub Automation (Hourly)
- **What:** Checks your GitHub profile for new public repositories.
- **Action:** If a new repo is found, it sends you an email.
- **Review:** You click the link, edit the description/tech stack, and approve.
- **Result:** Instantly added to your portfolio's Projects section.

### 2. 💼 LinkedIn Automation (Every 5 Hours)
- **What:** Scrapes your LinkedIn profile for updates.
- **Detects:**
  - New **Experience** (Job roles)
  - New **Skills**
  - New **Certifications**
- **Action:** Emails you a review link.
- **Review:** You upload a company logo or select skills to add.
- **Result:** Automatically updates your underlying data files.

### 3. 🦉 Codolio Stats (Daily at Midnight)
- **What:** Logs into your Codolio account.
- **Action:** Takes a screenshot of your stats card.
- **Result:** Updates the image on your portfolio homepage automatically.

---

## 🚀 Deployment Guide

### Step 1: Deploy Backend (Render)
The backend does the heavy lifting (automation, database).

1.  Push this code to **GitHub**.
2.  Go to [Render.com](https://render.com) and create a **Web Service**.
3.  Connect your GitHub repo.
4.  Render will auto-detect the `render.yaml` file in this project.
5.  **Critical:** Add these Environment Variables in Render Dashboard:
    - `MONGODB_URI`: Your MongoDB Connection String.
    - `EMAIL_USER` / `EMAIL_PASS`: For sending notifications.
    - `GITHUB_TOKEN`: To check your repos API.
    - `LINKEDIN_EMAIL` / `LINKEDIN_PASSWORD`: For scraping.
    - `CODOLIO_EMAIL` / `CODOLIO_PASSWORD`: For screenshots.
6.  Deploy!

### Step 2: Deploy Frontend (Vercel)
The frontend is the visible website.

1.  Go to [Vercel.com](https://vercel.com) and **Add New Project**.
2.  Import the same GitHub repo.
3.  **Environment Variables**:
    - `NEXT_PUBLIC_API_URL`: `https://your-backend-url.onrender.com`
    - *(This tells the frontend where to send emails/data)*
4.  Deploy!

---

## 💻 Local Development

Want to run it on your machine?

### 1. Clone & Install
```bash
git clone https://github.com/kodeMapper/saranggade.git
cd saranggade
npm install

# Install backend deps
cd backend
npm install
```

### 2. Configure Secrets
Create a `.env` file in the `backend/` folder:
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
GITHUB_USERNAME=kodeMapper
GITHUB_TOKEN=ghp_...
EMAIL_USER=...
EMAIL_PASS=...
```

### 3. Run It
Open two terminals:

**Terminal 1 (Frontend):**
```bash
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2 (Backend):**
```bash
cd backend
npm start
# Runs on http://localhost:5000
```

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React 19, Framer Motion, Styled Components.
- **Backend:** Node.js, Express, Puppeteer (Browser Automation).
- **Database:** MongoDB (for feedback & logs).
- **Tools:** GitHub API, Nodemailer (Email), Multer (Image Uploads).

---

## 👤 Author

**Sarang Gade**
- 🌐 [Portfolio](https://saranggade.vercel.app)
- 🐙 [GitHub](https://github.com/kodeMapper)
- 💼 [LinkedIn](https://linkedin.com/in/sarang-gade)

*Built with ❤️ and strictly automated.*
