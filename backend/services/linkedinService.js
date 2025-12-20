const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { sendDiscordNotification } = require('./discordService');
const { adddPendingUpdate, getPendingUpdates } = require('./pendingUpdatesManager');
const { getState, saveState } = require('./stateManager');

const RESUME_PATH = path.join(__dirname, '../../src/data/resume.json');
const COOKIES_PATH = path.join(__dirname, 'linkedin_cookies.json');
const LOG_FILE = path.join(__dirname, 'linkedin_debug.txt');

const LINKEDIN_EMAIL = process.env.LINKEDIN_EMAIL;
const LINKEDIN_PASSWORD = process.env.LINKEDIN_PASSWORD;
const PROFILE_URL = 'https://www.linkedin.com/in/sarang-gade';

const log = (msg) => {
    const timestamp = new Date().toISOString();
    const logMsg = `[${timestamp}] ${msg}\n`;
    console.log(msg);
    fs.appendFileSync(LOG_FILE, logMsg);
};

const getSeenItems = () => {
    const state = getState();
    return state.seenLinkedinItems || [];
};

const markItemAsSeen = (identifier) => {
    const state = getState();
    if (!state.seenLinkedinItems) state.seenLinkedinItems = [];
    if (!state.seenLinkedinItems.includes(identifier)) {
        state.seenLinkedinItems.push(identifier);
        saveState(state);
    }
};

const checkLinkedinUpdates = async () => {
    log("🔵 Starting LinkedIn Update Cycle (Review Mode)...");
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            defaultViewport: null,
            args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        const page = await browser.newPage();

        let resumeData = JSON.parse(fs.readFileSync(RESUME_PATH, 'utf8'));
        const seenItems = getSeenItems();
        const pendingUpdates = getPendingUpdates();

        // 1. Session Management
        if (process.env.LINKEDIN_COOKIES) {
            try {
                const envCookies = JSON.parse(process.env.LINKEDIN_COOKIES);
                await page.setCookie(...envCookies);
                log("🍪 Loaded session cookies from Environment Variable.");
            } catch (e) {
                log("⚠️ Error parsing LINKEDIN_COOKIES env var.");
            }
        } else if (fs.existsSync(COOKIES_PATH)) {
            const cookies = JSON.parse(fs.readFileSync(COOKIES_PATH));
            await page.setCookie(...cookies);
            log("🍪 Loaded session cookies from File.");
        }

        // 2. Validate Session (Try Feed First)
        log("🔑 Validating Session...");
        try {
            await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded', timeout: 60000 });
        } catch (e) {
            log("⚠️ Navigation timeout (feed might depend on lazy loading). Proceeding to check DOM...");
        }

        let isLoggedIn = false;
        try {
            // Check for the "Me" icon in the top nav bar. This ONLY exists if logged in.
            await page.waitForSelector('.global-nav__me', { timeout: 6000 });
            isLoggedIn = true;
        } catch (e) {
            log("⚠️ Session Check Failed: global-nav__me not found.");
        }

        // IMPORTANT: Also trust URL if it stayed on /feed/ (selector might have changed)
        const currentUrl = await page.url();
        if (isLoggedIn || currentUrl.includes("/feed")) {
            log("✅ Session Verified! Skipping Login.");
        } else {
            log("⚠️ Session invalid (URL: " + currentUrl + "). Starting Manual Login...");

            // Fallback: Explicit Login
            try {
                await page.goto('https://www.linkedin.com/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
            } catch (e) { log("⚠️ Login page load timeout. Proceeding..."); }

            await page.type('#username', LINKEDIN_EMAIL);
            await page.type('#password', LINKEDIN_PASSWORD);
            await page.click('button[type="submit"]');

            try {
                await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 });
            } catch (e) { log("⚠️ Navigation timeout proceeding..."); }

            // Check again (2FA Check)
            if ((await page.url()).includes("checkpoint") || (await page.url()).includes("challenge")) {
                log("❌ CRITICAL: LinkedIn is asking for 2FA/OTP. The cookies are invalid or expired.");
                log("👉 ACTION: Please get FRESH cookies from your browser and update 'LINKEDIN_COOKIES' in Render.");
                browser.close();
                return; // Stop here
            }

            // Save new cookies if login worked
            const cookies = await page.cookies();
            fs.writeFileSync(COOKIES_PATH, JSON.stringify(cookies, null, 2));
            log("🍪 New Cookies saved locally.");
        }

        // 3. Scrape EXPERIENCE
        const expUrl = `${PROFILE_URL}/details/experience/`;
        log(`🔍 Scrape Exp: ${expUrl}`);
        try {
            await page.goto(expUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
        } catch (e) { log("⚠️ Experience page timeout. Continuing..."); }
        await new Promise(r => setTimeout(r, 6000));

        const scrapedExperience = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('.pvs-list__paged-list-item, li.artdeco-list__item, li.pvs-list__item--line-separated'));
            return items.map(item => {
                const spans = Array.from(item.querySelectorAll('span[aria-hidden="true"]'));
                if (spans.length < 2) return null;
                return {
                    title: spans[0]?.innerText?.trim(),
                    company: spans[1]?.innerText?.split('·')[0]?.trim(),
                    date: spans[2]?.innerText?.split('·')[0]?.trim(),
                    location: spans.length > 3 ? spans[3]?.innerText?.trim() : ''
                };
            }).filter(i => i && i.title);
        });

        // 4. Scrape SKILLS
        const skillUrl = `${PROFILE_URL}/details/skills/`;
        log(`🔍 Scrape Skills: ${skillUrl}`);
        try {
            await page.goto(skillUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
        } catch (e) { log("⚠️ Skills page timeout. Continuing..."); }

        // Better Wait Strategy
        try {
            await page.waitForSelector('.pvs-list__paged-list-item, .artdeco-list__item', { timeout: 10000 });
        } catch (e) {
            log("⚠️ Timeout waiting for skill list items. Taking debug screenshot...");
        }

        // DEBUG: Capture Screenshot
        const debugPath = path.join(__dirname, '../../public/images/debug_linkedin_skills.png');
        await page.screenshot({ path: debugPath, fullPage: true });
        log("📸 Saved debug_linkedin_skills.png");

        const scrapedSkills = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('.pvs-list__paged-list-item, li.artdeco-list__item'));
            return items.map(item => {
                const span = item.querySelector('span[aria-hidden="true"]');
                return span ? span.innerText.trim() : null;
            }).filter(s => s);
        });
        log(`📊 Scraped ${scrapedSkills.length} skills: ${scrapedSkills.slice(0, 10).join(', ')}...`);

        // 5. Scrape CERTIFICATIONS
        const certUrl = `${PROFILE_URL}/details/certifications/`;
        log(`🔍 Scrape Certs: ${certUrl}`);
        try {
            await page.goto(certUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
        } catch (e) { log("⚠️ Certs page timeout. Continuing..."); }
        await new Promise(r => setTimeout(r, 5000));
        const scrapedCerts = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('.pvs-list__paged-list-item, li.artdeco-list__item'));
            return items.map(item => {
                const spans = Array.from(item.querySelectorAll('span[aria-hidden="true"]'));
                if (spans.length < 1) return null;
                return {
                    name: spans[0]?.innerText?.trim(),
                    issuer: spans[1]?.innerText?.trim(),
                    date: spans[2]?.innerText?.trim()
                };
            }).filter(c => c && c.name);
        });

        // Filter out misidentified recommendations (not actual certifications)
        const validCerts = scrapedCerts.filter(c => {
            const name = c.name.toLowerCase();
            // Exclude if it looks like a recommendation/endorsement
            if (name.includes('someone') ||
                name.includes('professor') ||
                name.includes('student') ||
                name.includes('university') ||
                name.includes('college') ||
                name.includes(' at ') ||
                name.startsWith('someone')) {
                return false;
            }
            return true;
        });

        // 6. PROCESSING (Pending Updates)
        let updatesQueued = 0;

        // Experience
        const existingExp = resumeData.experience || [];
        for (const role of scrapedExperience) {
            const id = `EXP:${role.title}:${role.company}`;
            if (seenItems.includes(id)) continue;

            const existsInResume = existingExp.some(e => e.title === role.title && e.company === role.company);
            const isAlreadyPending = pendingUpdates.find(u => u.type === 'linkedin_experience' && u.data.title === role.title && u.data.company === role.company);

            if (!existsInResume && !isAlreadyPending) {
                log(`🚀 New Pending Role: ${role.title}`);
                const update = adddPendingUpdate('linkedin_experience', {
                    id: `${role.title}_${role.company}`,
                    name: `${role.title} at ${role.company}`,
                    title: role.title,
                    company: role.company,
                    duration: role.date,
                    location: role.location,
                    image: "/images/experience/default.png",
                    highlights: ["Imported from LinkedIn"]
                });

                // DISCORD NOTIFICATION
                const reviewLink = `https://saranggade.vercel.app/admin/review/${update.id}`;
                await sendDiscordNotification('LinkedIn Experience', {
                    Role: `${role.title} at ${role.company}`,
                    Date: role.date
                }, reviewLink);
                updatesQueued++;
            } else if (existsInResume) {
                markItemAsSeen(id);
            }
        }

        // Skills - Batch approach
        const existingSkills = [
            ...(resumeData.skills.languages || []),
            ...(resumeData.skills.tools || []),
            ...(resumeData.skills.frameworks || [])
        ];
        const newSkills = [...new Set(scrapedSkills.filter(s => !existingSkills.includes(s) && !seenItems.includes(`SKILL:${s}`)))];
        const skillsAlreadyPending = pendingUpdates.find(u => u.type === 'linkedin_skill');

        if (newSkills.length > 0 && !skillsAlreadyPending) {
            log(`✨ New Pending Skills: ${newSkills.length}`);
            const update = adddPendingUpdate('linkedin_skill', {
                id: 'linkedin_new_skills_batch',
                name: `${newSkills.length} New Skills`,
                skills: newSkills
            });

            // DISCORD NOTIFICATION
            const reviewLink = `https://saranggade.vercel.app/admin/review/${update.id}`;
            await sendDiscordNotification('LinkedIn Skills', {
                Count: `${newSkills.length} New Skills`,
                List: newSkills.slice(0, 5).join(', ') + '...'
            }, reviewLink);
            updatesQueued++;
        }

        // Certifications
        if (!resumeData.certifications) resumeData.certifications = [];
        const existingCertNames = resumeData.certifications.map(c => c.name);
        for (const cert of validCerts) {
            const id = `CERT:${cert.name}`;
            if (seenItems.includes(id)) continue;

            const isAlreadyPending = pendingUpdates.find(u => u.type === 'linkedin_certification' && u.data.name === cert.name);

            if (!existingCertNames.includes(cert.name) && !isAlreadyPending) {
                log(`📜 New Pending Cert: ${cert.name}`);
                const update = adddPendingUpdate('linkedin_certification', {
                    id: cert.name,
                    name: cert.name,
                    issuer: cert.issuer,
                    date: cert.date
                });

                // DISCORD NOTIFICATION
                const reviewLink = `https://saranggade.vercel.app/admin/review/${update.id}`;
                await sendDiscordNotification('LinkedIn Certification', {
                    Name: cert.name,
                    Issuer: cert.issuer
                }, reviewLink);
                updatesQueued++;
            } else if (existingCertNames.includes(cert.name)) {
                markItemAsSeen(id);
            }
        }

        // 7. Summary
        if (updatesQueued > 0) {
            log(`✅ Queued ${updatesQueued} updates for review. Discord alerts sent.`);
        } else {
            log("✅ No new updates found (or all already pending).");
        }

    } catch (err) {
        log(`❌ Error: ${err.message}`);
        console.error(err);
    } finally {
        // AUTO-COMMIT DEBUG SCREENSHOTS (Stateless Logic)
        try {
            const { exec } = require('child_process');
            log("🔄 Auto-committing debug screenshots...");

            const USER = process.env.GITHUB_USERNAME || 'kodeMapper';
            const TOKEN = process.env.GITHUB_TOKEN;
            const REPO = 'saranggade';
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
                `git add public/images/debug_linkedin_skills.png`,
                `git commit -m "Add LinkedIn Debug Screenshot [skip ci]"`,
                `git push origin HEAD:main`
            ].join(' && ');

            exec(commands, (err, stdout, stderr) => {
                if (!err) log(`✅ Debug Screenshot Pushed to GitHub.`);
            });
        } catch (e) { log(`❌ Git Error: ${e.message}`); }

        if (browser) await browser.close();
        log("🔵 Finished LinkedIn Check.");
    }
};

module.exports = { checkLinkedinUpdates, markItemAsSeen };
