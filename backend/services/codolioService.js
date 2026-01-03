const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
require('dotenv').config();

const CODOLIO_EMAIL = process.env.CODOLIO_EMAIL;
const CODOLIO_PASSWORD = process.env.CODOLIO_PASSWORD;
const OUTPUT_DIR = path.join(__dirname, '../../public/images');
const LOG_FILE = path.join(__dirname, 'codolio_debug.txt');

const log = (msg) => {
    const timestamp = new Date().toISOString();
    const logMsg = `[${timestamp}] ${msg}\n`;
    console.log(msg);
    fs.appendFileSync(LOG_FILE, logMsg);
};

const updateCodolioStats = async () => {
    log("🔄 Starting Codolio Update (Screenshot Mode - V4 - Fixed Click)...");
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new", // Must be headless in production
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        const page = await browser.newPage();

        // Listener to debug browser console
        page.on('console', msg => log(`[BROWSER] ${msg.text()}`));

        // High Quality Viewport
        await page.setViewport({ width: 1280, height: 1000, deviceScaleFactor: 2 });

        // 1. Login
        log("➡️ Logging in...");
        await page.goto('https://codolio.com/login', { waitUntil: 'networkidle2' });
        await page.type('input[type="email"]', CODOLIO_EMAIL);
        await page.type('input[type="password"]', CODOLIO_PASSWORD);
        // Fix: Use Promise.all to avoid "Navigating frame was detached" race condition
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            page.click('button[type="submit"]'),
        ]);
        log("✅ Logged in.");

        // 2. Go to Card Page
        const cardUrl = 'https://codolio.com/profile/kodeMapper/card';
        log(`➡️ Navigating to ${cardUrl}...`);

        await new Promise(r => setTimeout(r, 1000));
        await page.goto(cardUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(r => setTimeout(r, 4000)); // Render wait

        // 3. Toggle Dark Mode (Spatial Search: 2nd from Top Right)
        log("🌗 Searching for Dark Mode toggle (Left of Profile)...");
        const darkModeClicked = await page.evaluate(async () => {
            try {
                const clickables = Array.from(document.querySelectorAll('button, div[role="button"], svg, span'));
                // Top Right Region
                const rightThreshold = window.innerWidth * 0.7;
                const topThreshold = 100;

                const candidates = clickables.filter(el => {
                    const rect = el.getBoundingClientRect();
                    return rect.left > rightThreshold && rect.top < topThreshold && rect.width > 20;
                });

                console.log(`Found ${candidates.length} candidates in top right.`);

                if (candidates.length > 0) {
                    // Sort by x position descending (rightmost first)
                    candidates.sort((a, b) => b.getBoundingClientRect().left - a.getBoundingClientRect().left);

                    let target = candidates[0];
                    if (candidates.length >= 2) {
                        target = candidates[1]; // Left of Profile
                    }

                    console.log(`Clicking candidate: ${target.tagName} (Title: ${target.title}, Text: ${target.innerText})`);

                    if (typeof target.click === 'function') {
                        target.click();
                        return true;
                    } else {
                        const evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                        target.dispatchEvent(evt);
                        return true;
                    }
                }
            } catch (e) {
                console.error("Error in DarkMode Toggle:", e.message);
            }
            return false;
        });

        if (darkModeClicked) {
            log("✅ Clicked Dark Mode toggle. Waiting 3s...");
            await new Promise(r => setTimeout(r, 3000));
        } else {
            log("⚠️ Could not find Dark Mode toggle candidates. Proceeding.");
        }

        // 4. Find Card Element Logic (Traverse Up Strategy)
        const getCardHandle = async () => {
            return await page.evaluateHandle(() => {
                const validationText = "@kodeMapper";
                const allElements = Array.from(document.querySelectorAll('span, div, p'));
                const target = allElements.find(el => el.innerText.trim() === validationText);

                if (!target) return null;

                let current = target;

                // Go up max 12 levels to find container
                for (let i = 0; i < 12; i++) {
                    current = current.parentElement;
                    if (!current) break;

                    const rect = current.getBoundingClientRect();
                    // Heuristic: Card is usually ~300-500px wide.
                    if (rect.width > 250 && rect.width < 900 && rect.height > 300) {
                        // Found a likely container
                        if (current.innerText.includes('Codolio') || current.innerText.includes('CARD')) {
                            return current;
                        }
                    }
                }
                return current; // Fallback
            });
        };

        // Capture Problem Solving
        log("📸 Capturing Problem Solving Card...");
        let cardHandle = await getCardHandle();

        if (cardHandle && (await cardHandle.jsonValue())) {
            const dest = path.join(OUTPUT_DIR, 'codolio-problem.png');
            await cardHandle.screenshot({ path: dest });
            log("✅ Saved codolio-problem.png");
        } else {
            log("❌ Element not found! Taking fallback fullpage screenshot.");
            await page.screenshot({ path: path.join(__dirname, 'debug_fallback_problem.png') });
        }

        // 5. Switch to Development
        log("➡️ Switching to Development tab...");
        const devClicked = await page.evaluate(async () => {
            const allElements = Array.from(document.querySelectorAll('span, div, p, li'));
            for (const el of allElements) {
                if (el.innerText && el.innerText.trim() === 'Development') {
                    el.click();
                    return true;
                }
            }
            return false;
        });

        if (devClicked) {
            log("   Clicked 'Development'. Waiting...");
            await new Promise(r => setTimeout(r, 4000));

            // Capture Development
            cardHandle = await getCardHandle();
            if (cardHandle && (await cardHandle.jsonValue())) {
                const dest = path.join(OUTPUT_DIR, 'codolio-dev.png');
                await cardHandle.screenshot({ path: dest });
                log("✅ Saved codolio-dev.png");
            } else {
                log("❌ Dev Card Element not found.");
            }
        } else {
            log("❌ Could not find 'Development' tab.");
        }

        // 6. Push Changes (Persistence Fix for Render)
        try {
            const { exec } = require('child_process');
            log("🔄 Auto-committing Codolio screenshots...");

            // Reusing the same commit logic (Simplified for service context)
            const USER = process.env.GITHUB_USERNAME || 'kodeMapper';
            const TOKEN = process.env.GITHUB_TOKEN;
            const REPO = 'saranggade';
            const remoteUrl = `https://${USER}:${TOKEN}@github.com/${USER}/${REPO}.git`;

            // Fixed: Use git init -b main to create main branch directly (not master)
            const commands = [
                `cd /app`,
                `git config --global user.email "kodeMapper@users.noreply.github.com"`,
                `git config --global user.name "Portfolio Bot"`,
                `git config --global init.defaultBranch main`,
                // Clean slate - remove existing .git to avoid branch conflicts
                `rm -rf .git`,
                // Initialize with main branch directly (Git 2.28+)
                `git init -b main`,
                `git remote add origin "${remoteUrl}"`,
                `git fetch --depth=1 origin main`,
                // Reset to remote state while staying on main branch
                `git reset --soft origin/main`,
                // Add only the codolio screenshots
                `git add -f public/images/codolio-*.png`,
                `git status`,
                `git commit -m "Auto-update Codolio stats [skip ci]" || echo "Nothing new to commit"`,
                // Force push to override any conflicts
                `git push -f origin main`
            ].join(' && ');

            exec(commands, (err, stdout, stderr) => {
                if (err) {
                    log(`❌ Git Push Failed!`);
                    log(`   Error: ${err.message}`);
                    log(`   Stderr: ${stderr}`);
                    log(`   Stdout: ${stdout}`);
                } else {
                    log(`✅ Git Push Success: ${stdout}`);
                }
            });
        } catch (e) { log(`❌ Git Error: ${e.message}`); }

    } catch (err) {
        log(`❌ CRITICAL ERROR in Codolio Service: ${err.message}`);
        console.error(err);
    } finally {
        if (browser) await browser.close();
        log("🔄 Finished Codolio Update.");
        if (require.main === module) process.exit();
    }
};

module.exports = { updateCodolioStats };
