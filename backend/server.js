require('dotenv').config();
const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const multer = require('multer');
const path = require('path');
const { checkGithubUpdates, markRepoAsSeen } = require('./services/githubService');
const { checkLinkedinUpdates, markItemAsSeen } = require('./services/linkedinService');
const { sendDiscordNotification } = require('./services/discordService');
const { adddPendingUpdate, getUpdateById, resolveUpdate } = require('./services/pendingUpdatesManager');
const { updatePortfolio } = require('./services/contentUpdater');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure Multer for Image Uploads (Save to Frontend Public Folder for Persistence via Git)
const UPLOAD_DIR = path.join(__dirname, '../public/images/uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        // Keep extension, simple numeric timestamp
        const ext = path.extname(file.originalname);
        cb(null, `upload-${Date.now()}${ext}`);
    }
});
const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
// Serve uploads folder statically so frontend can access images (Legacy support + new uploads if needed locally)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- UPLOAD ROUTE ---
app.post('/api/upload', upload.single('coverImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return the RELATIVE URL that the frontend can use directly
    const imageUrl = `/images/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI;
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully');

        // --- START SERVER & CRON ONLY AFTER DB CONNECTS ---

        // GitHub: Run every 1 hour (0 * * * *)
        cron.schedule('0 * * * *', async () => {
            console.log('⏰ [Hourly] Running GitHub update check...');
            await runChecks();
        });

        // LinkedIn: Run every 5 hours (0 */5 * * *)
        cron.schedule('0 */5 * * *', async () => {
            console.log('💼 [5-Hourly] Running LinkedIn update check...');
            const { checkLinkedinUpdates } = require('./services/linkedinService');
            await checkLinkedinUpdates();
        });

        // Codolio: Run Daily at Midnight (0 0 * * *)
        cron.schedule('0 0 * * *', async () => {
            console.log('🦉 [Daily] Running Codolio Update...');
            await updateCodolioStats();
        });

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });

    })
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Feedback Schema (Keep existing logic)
const feedbackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now }
});
const Feedback = mongoose.model('Feedback', feedbackSchema);

// --- AUTOMATION ROUTES ---

// Admin: Get Update Info
app.get('/api/admin/updates/:id', async (req, res) => {
    const update = await getUpdateById(req.params.id);
    if (!update) return res.status(404).json({ error: 'Update not found' });
    res.json(update);
});

// Admin: Approve Update
app.post('/api/admin/updates/:id/approve', async (req, res) => {
    const { id } = req.params;
    const { editedData } = req.body; // Allow user to make edits before approving
    const update = await getUpdateById(id);

    if (!update) return res.status(404).json({ error: 'Update not found' });

    try {
        const dataToSave = editedData || update.data;
        updatePortfolio(update.type, dataToSave);

        // Cleanup based on type
        if (update.type === 'github') {
            await markRepoAsSeen(update.data.id);
        } else if (update.type.startsWith('linkedin_')) {
            if (update.type === 'linkedin_experience') await markItemAsSeen(`EXP:${update.data.title}:${update.data.company}`);
            else if (update.type === 'linkedin_skill') {
                for (const s of (update.data.skills || [])) {
                    await markItemAsSeen(`SKILL:${s}`);
                }
            }
            else if (update.type === 'linkedin_certification') await markItemAsSeen(`CERT:${update.data.name}`);
        }

        // Mark as Approved instead of removing
        await resolveUpdate(id, 'approved');

        // Trigger Git Commit & Push
        performGitCommit(`Added new ${update.type} project: ${dataToSave.name || dataToSave.title}`);

        res.json({ success: true, message: 'Portfolio updated successfully!' });
    } catch (error) {
        console.error("Update failed:", error);
        res.status(500).json({ error: 'Update failed' });
    }
});

// Admin: Reject Update
app.post('/api/admin/updates/:id/reject', async (req, res) => {
    const { id } = req.params;
    const update = await getUpdateById(id);
    if (update) {
        if (update.type === 'github') {
            await markRepoAsSeen(update.data.id); // Mark as seen so we don't fetch it again
        } else if (update.type.startsWith('linkedin_')) {
            if (update.type === 'linkedin_experience') await markItemAsSeen(`EXP:${update.data.title}:${update.data.company}`);
            else if (update.type === 'linkedin_skill') {
                for (const s of (update.data.skills || [])) {
                    await markItemAsSeen(`SKILL:${s}`);
                }
            }
            else if (update.type === 'linkedin_certification') await markItemAsSeen(`CERT:${update.data.name}`);
        }
        // Mark as Rejected instead of removing
        await resolveUpdate(id, 'rejected');
    }
    res.json({ success: true, message: 'Update rejected.' });
});

// --- CRON JOBS ---
const { updateCodolioStats } = require('./services/codolioService');

async function runChecks() {
    // 1. Check GitHub
    const newRepos = await checkGithubUpdates();
    if (newRepos && newRepos.length > 0) {
        const updates = await require('./services/pendingUpdatesManager').getPendingUpdates();

        for (const newRepo of newRepos) {
            // Check if already pending to avoid spamming
            const isAlreadyPending = updates.find(u => u.type === 'github' && u.data.id === newRepo.id);

            if (!isAlreadyPending) {
                console.log(`📦 New GitHub Repo found: ${newRepo.name}`);
                const update = await adddPendingUpdate('github', newRepo);
                const reviewLink = `https://saranggade.vercel.app/admin/review/${update.id}`;

                await sendDiscordNotification('GitHub Project', {
                    Name: newRepo.name,
                    Description: newRepo.description || 'No description'
                }, reviewLink);

                // CRITICAL: Mark as known IMMEDIATELY so we don't re-notify on next trigger
                await markRepoAsSeen(newRepo.id);

            } else {
                console.log(`ℹ️ Repo ${newRepo.name} is already pending review.`);
            }
        }
    }
}


// --- EXISTING ROUTES ---
app.post('/api/feedback', async (req, res) => {
    try {
        const { name, text } = req.body;
        const newFeedback = new Feedback({ name, text });
        await newFeedback.save();

        // Notify via Discord about Feedback
        await sendDiscordNotification('New Feedback Received', { Name: name, Message: text }, null);

        res.status(201).json(newFeedback);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/feedback', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ date: -1 });
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


// Test trigger route (to force a check)
app.post('/api/trigger-check', async (req, res) => {
    await runChecks();
    res.json({ message: 'Checks triggered' });
});

app.post('/api/trigger-codolio', async (req, res) => {
    console.log('🦉 Manual Codolio Update Triggered');
    updateCodolioStats(); // Async
    res.json({ message: 'Codolio update started in background' });
});

app.post('/api/trigger-linkedin', async (req, res) => {
    console.log('🔵 Manual LinkedIn Check Triggered');
    checkLinkedinUpdates(); // Async
    res.json({ message: 'LinkedIn check started in background' });
});

// SIMULATION ROUTE FOR TESTING (GET for easy browser access)
let isSimulating = false; // Memory lock to prevent race conditions



// Dedicated Email Connection Test Route (Now Discord Test)
app.get('/api/test-email', async (req, res) => {
    try {
        await sendDiscordNotification('TEST_CONNECTION', { Status: 'Success', Message: 'Backend can reach Discord!' }, 'https://google.com');
        res.send("<h1>✅ Discord Notification Sent</h1><p>Check your Discord channel.</p>");
    } catch (error) {
        res.status(500).send(`<h1>❌ Test Failed</h1><p>${error.message}</p>`);
    }
});
// Simulation Route
app.get('/api/simulate-update', async (req, res) => {
    if (isSimulating) {
        return res.send("<h1>⏳ Please wait, simulation already in progress...</h1>");
    }
    isSimulating = true;

    try {
        const fakeUpdate = {
            id: "TEST-REPO-123",
            name: "Test-Portfolio-Project",
            html_url: "https://github.com/kodeMapper/test-repo",
            description: "This is a simulated project to test the automation system.",
            language: "JavaScript",
            created_at: new Date().toISOString()
        };

        // Check if duplicate for simulation too
        const updates = await require('./services/pendingUpdatesManager').getPendingUpdates();
        const isAlreadyPending = updates.find(u => u.type === 'github' && u.data.id === fakeUpdate.id);

        if (isAlreadyPending) {
            isSimulating = false;
            return res.send(`
                <div style="font-family: sans-serif; padding: 20px;">
                    <h1>⚠️ Already Pending</h1>
                    <p>This test update is already waiting for your review.</p>
                </div>
            `);
        }

        console.log("🧪 Simulating new GitHub repo...");
        const update = await adddPendingUpdate('github', fakeUpdate);
        const reviewLink = `https://saranggade.vercel.app/admin/review/${update.id}`;

        await sendDiscordNotification('GitHub Project (SIMULATION)', {
            Name: fakeUpdate.name,
            Description: fakeUpdate.description
        }, reviewLink);

        res.send(`
            <div style="font-family: sans-serif; padding: 20px;">
                <h1 style="color: #5865F2;">✅ Discord Alert Sent!</h1>
                <p>Check your channel.</p>
            </div>
        `);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    } finally {
        isSimulating = false;
    }
});

function performGitCommit(message) {
    const USER = process.env.GITHUB_USERNAME || 'kodeMapper';
    const TOKEN = process.env.GITHUB_TOKEN;
    const REPO = 'saranggade';

    if (!TOKEN) {
        console.error("❌ Cannot auto-commit: GITHUB_TOKEN not found.");
        return;
    }

    const remoteUrl = `https://${USER}:${TOKEN}@github.com/${USER}/${REPO}.git`;

    const commands = [
        `cd /app`,
        `git config --global user.email "bot@portfolio.com"`,
        `git config --global user.name "Portfolio Bot"`,
        `git init`,
        `git remote remove origin || true`,
        `git remote add origin "${remoteUrl}"`,
        `git fetch --depth=1 origin main`,
        `git reset origin/main`,
        `git add src/data/resume.json public/images/*`,
        `git commit -m "${message} [skip ci]"`,
        `git push origin HEAD:main`
    ].join(' && ');

    console.log("🔄 Starting auto-commit...");
    exec(commands, async (err, stdout, stderr) => {
        if (err) {
            console.error('❌ Git auto-commit failed:', stderr || err.message);
        } else {
            console.log('✅ Git auto-commit success:', stdout);

            // TRIGGER VERCEL DEPLOY HOOK
            if (process.env.VERCEL_DEPLOY_HOOK) {
                console.log("🚀 Triggering Vercel Deploy Hook...");
                try {
                    // Fetch is available in Node 18+ (Render uses Node 20 usually)
                    await fetch(process.env.VERCEL_DEPLOY_HOOK);
                    console.log("✅ Vercel Deploy Hook Triggered.");
                } catch (e) {
                    console.error("❌ Failed to trigger Vercel Hook:", e.message);
                }
            }
        }
    });
}
