require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const multer = require('multer');
const path = require('path');
const { checkGithubUpdates, markRepoAsSeen } = require('./services/githubService');
const { checkLinkedinUpdates, markItemAsSeen } = require('./services/linkedinService');
const { sendUpdateEmail } = require('./services/emailService');
const { adddPendingUpdate, getUpdateById, removeUpdate } = require('./services/pendingUpdatesManager');
const { updatePortfolio } = require('./services/contentUpdater');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure Multer for Image Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Unique filename: fieldname-timestamp.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
// Serve uploads folder statically so frontend can access images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- UPLOAD ROUTE ---
app.post('/api/upload', upload.single('coverImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return the URL that the frontend can use
    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI;
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
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
app.get('/api/admin/updates/:id', (req, res) => {
    const update = getUpdateById(req.params.id);
    if (!update) return res.status(404).json({ error: 'Update not found' });
    res.json(update);
});

// Admin: Approve Update
app.post('/api/admin/updates/:id/approve', (req, res) => {
    const { id } = req.params;
    const { editedData } = req.body; // Allow user to make edits before approving
    const update = getUpdateById(id);

    if (!update) return res.status(404).json({ error: 'Update not found' });

    try {
        const dataToSave = editedData || update.data;
        updatePortfolio(update.type, dataToSave);

        // Cleanup based on type
        if (update.type === 'github') {
            markRepoAsSeen(update.data.id);
        } else if (update.type.startsWith('linkedin_')) {
            if (update.type === 'linkedin_experience') markItemAsSeen(`EXP:${update.data.title}:${update.data.company}`);
            else if (update.type === 'linkedin_skill') (update.data.skills || []).forEach(s => markItemAsSeen(`SKILL:${s}`));
            else if (update.type === 'linkedin_certification') markItemAsSeen(`CERT:${update.data.name}`);
        }

        removeUpdate(id);

        // Trigger Git Commit & Push
        performGitCommit(`Added new ${update.type} project: ${dataToSave.name || dataToSave.title}`);

        res.json({ success: true, message: 'Portfolio updated successfully!' });
    } catch (error) {
        console.error("Update failed:", error);
        res.status(500).json({ error: 'Update failed' });
    }
});

// Admin: Reject Update
app.post('/api/admin/updates/:id/reject', (req, res) => {
    const { id } = req.params;
    const update = getUpdateById(id);
    if (update) {
        if (update.type === 'github') {
            markRepoAsSeen(update.data.id); // Mark as seen so we don't fetch it again
        } else if (update.type.startsWith('linkedin_')) {
            if (update.type === 'linkedin_experience') markItemAsSeen(`EXP:${update.data.title}:${update.data.company}`);
            else if (update.type === 'linkedin_skill') (update.data.skills || []).forEach(s => markItemAsSeen(`SKILL:${s}`));
            else if (update.type === 'linkedin_certification') markItemAsSeen(`CERT:${update.data.name}`);
        }
        removeUpdate(id);
    }
    res.json({ success: true, message: 'Update rejected.' });
});

// --- CRON JOBS ---
const { updateCodolioStats } = require('./services/codolioService');

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

async function runChecks() {
    // 1. Check GitHub
    const newRepos = await checkGithubUpdates();
    if (newRepos && newRepos.length > 0) {
        const updates = require('./services/pendingUpdatesManager').getPendingUpdates();

        for (const newRepo of newRepos) {
            // Check if already pending to avoid spamming email
            const isAlreadyPending = updates.find(u => u.type === 'github' && u.data.id === newRepo.id);

            if (!isAlreadyPending) {
                console.log(`📦 New GitHub Repo found: ${newRepo.name}`);
                const update = adddPendingUpdate('github', newRepo);
                const reviewLink = `http://localhost:3000/admin/review/${update.id}`;
                await sendUpdateEmail('GitHub Project', newRepo, reviewLink);
            } else {
                // If it's already pending, we just ignore it for this cycle.
                // This allows the loop to continue to the NEXT repo in newRepos.
                // So if Repo A is pending, we skip it, but start processing Repo B.
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

app.get('/api/simulate-update', async (req, res) => {
    // ... (existing simulation code)
});

// Dedicated Email Connection Test Route
app.get('/api/test-email', async (req, res) => {
    try {
        await sendUpdateEmail('TEST_CONNECTION', { title: 'Verifying Email Service', description: 'This is a test to check if the backend can reach Gmail.' }, 'http://localhost:3000');
        res.send("<h1>✅ Email Test Initiated</h1><p>Check server logs for 'Email sent successfully' or error details.</p>");
    } catch (error) {
        res.status(500).send(`<h1>❌ Test Failed</h1><p>${error.message}</p>`);
    }
});
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
    const updates = require('./services/pendingUpdatesManager').getPendingUpdates();
    const isAlreadyPending = updates.find(u => u.type === 'github' && u.data.id === fakeUpdate.id);

    if (isAlreadyPending) {
        isSimulating = false;
        return res.send(`
                <div style="font-family: sans-serif; padding: 20px;">
                    <h1>⚠️ Already Pending</h1>
                    <p>This test update is already waiting for your review.</p>
                    <p>No new email was sent to avoid duplicates.</p>
                    <a href="http://localhost:3000/admin/review/${isAlreadyPending.id}" style="background: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Review</a>
                </div>
            `);
    }

    console.log("🧪 Simulating new GitHub repo...");
    const update = adddPendingUpdate('github', fakeUpdate);
    const reviewLink = `http://localhost:3000/admin/review/${update.id}`;

    await sendUpdateEmail('GitHub Project (SIMULATION)', fakeUpdate, reviewLink);

    res.send(`
            <div style="font-family: sans-serif; padding: 20px;">
                <h1 style="color: green;">✅ Simulation Sent!</h1>
                <p>Check your email for the notification.</p>
                <p>Or click below to review immediately:</p>
                <a href="${reviewLink}" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Review Now</a>
            </div>
        `);
} catch (err) {
    console.error(err);
    res.status(500).send("Error");
} finally {
    isSimulating = false;
}
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

function performGitCommit(message) {
    const USER = process.env.GITHUB_USERNAME || 'kodeMapper';
    const TOKEN = process.env.GITHUB_TOKEN;
    const REPO = 'saranggade'; // Your repo name

    if (!TOKEN) {
        console.error("❌ Cannot auto-commit: GITHUB_TOKEN not found in env.");
        return;
    }

    // Authenticated URL
    const remoteUrl = `https://${USER}:${TOKEN}@github.com/${USER}/${REPO}.git`;

    // Chain commands: Config -> Add -> Commit -> Push
    const commands = [
        `git config user.email "bot@portfolio.com"`,
        `git config user.name "Portfolio Bot"`,
        `git add .`,
        `git commit -m "${message}"`,
        `git push "${remoteUrl}" HEAD:main`
    ].join(' && ');

    console.log("🔄 Starting auto-commit...");
    exec(commands, (err, stdout, stderr) => {
        if (err) {
            console.error('❌ Git auto-commit failed:', stderr || err.message);
        } else {
            console.log('✅ Git auto-commit success:', stdout);
        }
    });
}
