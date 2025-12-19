# 🚀 Sarang Gade - Developer Portfolio

A modern, automated portfolio website built with Next.js 16 and a Node.js backend. Features smart automation to keep your portfolio updated without manual intervention.

![Portfolio Preview](https://saranggade.vercel.app)

---

## ✨ Key Features

- **Responsive Design** – Works beautifully on all devices
- **Dark/Light Mode** – Theme toggle for user preference
- **Animated Skills Marquee** – Smooth parallax scrolling effect
- **Project Carousel** – Stacking card animations
- **Codolio Stats Integration** – Live coding stats display
- **Feedback System** – MongoDB-powered visitor feedback
- **Smart Automation** – GitHub, LinkedIn, and Codolio updates

---

## 🏗️ Project Structure

```
Portfolio/
├── src/                    # Frontend (Next.js)
│   ├── app/               # App Router pages
│   │   ├── page.js        # Homepage
│   │   ├── admin/         # Admin review pages
│   │   └── projects/[id]/ # Project detail pages
│   ├── components/        # React components
│   │   ├── Hero.jsx       # Hero section
│   │   ├── Projects.jsx   # Projects carousel
│   │   ├── Skills.jsx     # Skills marquee
│   │   ├── Experience.jsx # Work experience
│   │   └── Contact.jsx    # Contact form
│   └── data/
│       └── resume.json    # All portfolio data
│
├── backend/               # Backend (Express.js)
│   ├── server.js          # Main server + routes
│   ├── services/          # Automation services
│   │   ├── githubService.js
│   │   ├── linkedinService.js
│   │   ├── codolioService.js
│   │   ├── emailService.js
│   │   ├── contentUpdater.js
│   │   └── pendingUpdatesManager.js
│   └── pending_updates.json
│
└── public/               # Static assets
    └── images/           # Project & skill images
```

---

## 🔧 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework with App Router |
| Framer Motion | Animations & transitions |
| CSS Modules | Scoped styling |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|------------|---------|
| Express.js | REST API server |
| MongoDB/Mongoose | Database for feedback |
| Puppeteer | Browser automation (LinkedIn/Codolio) |
| Nodemailer | Email notifications |
| node-cron | Scheduled tasks |
| Multer | File uploads |

---

## 🤖 Automation Systems

The portfolio has 3 automated update systems that run on schedule:

### 1. 📦 GitHub Automation

**What it does:** Detects new public repositories and lets you add them to your portfolio.

**How it works:**
1. Cron job runs every 2 minutes
2. Calls GitHub API for your repositories
3. Compares with `state.json` (known repos)
4. If new repo found:
   - Adds to `pending_updates.json`
   - Sends email with review link
5. You click the link → Review page opens
6. Edit project details (name, tech, description)
7. Click "Approve" → Added to `resume.json`

**Files involved:**
- `backend/services/githubService.js` – API calls
- `backend/services/pendingUpdatesManager.js` – Queue management
- `src/app/admin/review/[id]/page.js` – Review UI

---

### 2. 💼 LinkedIn Automation

**What it does:** Scrapes your LinkedIn profile for new experiences, skills, and certifications.

**How it works:**
1. Trigger manually or via cron
2. Opens browser with Puppeteer (uses saved cookies)
3. Navigates to:
   - `/details/experience/`
   - `/details/skills/`
   - `/details/certifications/`
4. Scrapes data from page
5. Filters out junk (recommendations, duplicates)
6. Creates pending updates for review
7. Sends individual emails with review links

**Experience approval:**
- Upload company logo (required)
- Edit title, company, duration
- Add highlights (each line = bullet point)

**Skills approval:**
- Checkboxes to select which skills to add
- Skills go to `resume.json → skills.tools`

**Files involved:**
- `backend/services/linkedinService.js` – Scraper
- `backend/services/linkedin_cookies.json` – Saved session
- `src/app/admin/review/[id]/page.js` – Review UI

---

### 3. 🦉 Codolio Automation

**What it does:** Takes a screenshot of your Codolio stats card daily.

**How it works:**
1. Cron runs at midnight
2. Opens Codolio with Puppeteer
3. Logs in with your credentials
4. Navigates to card page
5. Toggles dark mode
6. Crops the card element
7. Saves to `public/images/codolio-*.png`

**Files involved:**
- `backend/services/codolioService.js` – Screenshot logic
- `src/components/CodolioProfile.jsx` – Display component

---

## 💬 Feedback System

Visitors can leave feedback which is stored in MongoDB.

**How it works:**
1. User fills form on Contact section
2. POST to `/api/feedback`
3. Saved to MongoDB (Feedback model)
4. Admin can view at `/api/feedbacks`

**Files involved:**
- `backend/server.js` – API routes
- `src/components/Contact.jsx` – Feedback form

---

## 📧 Email Notifications

When automation detects updates, you get an email with:
- What was found (repo name, skill, etc.)
- Direct link to review page

**Configuration:** Set in `.env`:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/kodeMapper/saranggade.git
cd saranggade
npm install
cd backend && npm install
```

### 2. Environment Setup

Create `backend/.env`:
```env
MONGODB_URI=mongodb+srv://...
GITHUB_TOKEN=ghp_...
GITHUB_USERNAME=kodeMapper
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CODOLIO_EMAIL=your-codolio-email
CODOLIO_PASSWORD=your-codolio-password
LINKEDIN_EMAIL=your-linkedin-email
LINKEDIN_PASSWORD=your-linkedin-password
```

### 3. Run Development

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend && node server.js
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 📋 Manual Trigger Commands

Run these in PowerShell:

```powershell
# Trigger GitHub check
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/trigger-check"

# Trigger LinkedIn check
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/trigger-linkedin"

# Trigger Codolio update
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/trigger-codolio"
```

---

## 📁 Key Files Explained

| File | Purpose |
|------|---------|
| `resume.json` | Master data source for all portfolio content |
| `pending_updates.json` | Queue of updates waiting for approval |
| `state.json` | Tracks seen repos/items to avoid duplicates |
| `linkedin_cookies.json` | Saved LinkedIn session for auto-login |

---

## 🔄 Data Flow

```
LinkedIn/GitHub → Scraper → pending_updates.json → Email
                                    ↓
                            Review Page (edit)
                                    ↓
                            resume.json (saved)
                                    ↓
                            Portfolio (updated)
```

---

## 🛠️ Node Modules Used

| Package | Purpose |
|---------|---------|
| `express` | HTTP server |
| `mongoose` | MongoDB ODM |
| `puppeteer` | Browser automation |
| `nodemailer` | Sending emails |
| `node-cron` | Scheduled jobs |
| `multer` | File uploads |
| `axios` | HTTP requests |
| `dotenv` | Environment variables |
| `cors` | Cross-origin requests |
| `framer-motion` | Frontend animations |
| `lucide-react` | Icon components |

---

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 🚢 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

### Backend (Render/Railway)
1. Push to GitHub
2. Set environment variables
3. Deploy with `node server.js`

---

## 📝 License

MIT License - feel free to use and modify!

---

## 👤 Author

**Sarang Gade**
- Portfolio: [saranggade.vercel.app](https://saranggade.vercel.app)
- GitHub: [@kodeMapper](https://github.com/kodeMapper)
- LinkedIn: [sarang-gade](https://linkedin.com/in/sarang-gade)

---

*Built with ❤️ and lots of automation*
