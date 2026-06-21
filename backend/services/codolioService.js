/**
 * Codolio Stats Service — V2 (REST API)
 * 
 * Replaces the Puppeteer-based screenshot approach with lightweight HTTP calls.
 * Uses the public Codolio API endpoint (no authentication required).
 * 
 * Endpoint: GET https://api.codolio.com/profile?userKey=kodeMapper
 * Returns: Full profile data including all platform stats
 */

const fs = require('fs');
const path = require('path');

const CODOLIO_USERNAME = 'kodeMapper';
const GITHUB_USERNAME = 'kodeMapper';
const CODOLIO_JSON_PATH = path.join(__dirname, '../../src/data/codolio.json');
const LOG_FILE = path.join(__dirname, 'codolio_debug.txt');

const log = (msg) => {
    const timestamp = new Date().toISOString();
    const logMsg = `[${timestamp}] ${msg}\n`;
    console.log(msg);
    fs.appendFileSync(LOG_FILE, logMsg);
};

/**
 * Fetches Codolio profile data via the public REST API.
 * No authentication required — the profile is public.
 */
async function fetchCodolioProfile() {
    const url = `https://api.codolio.com/profile?userKey=${CODOLIO_USERNAME}`;
    log(`📡 Fetching Codolio profile from: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Codolio API returned ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    if (!json.status?.success) {
        throw new Error(`Codolio API error: ${json.status?.message || 'Unknown error'}`);
    }

    return json.data;
}

/**
 * Fetches GitHub contribution stats via the Codolio API.
 * This ensures we get the exact numbers shown on the Codolio development card.
 */
async function fetchGithubStats() {
    log(`📡 Fetching GitHub stats from Codolio API for: ${GITHUB_USERNAME}`);
    try {
        const url = `https://api.codolio.com/github/profile?userKey=${CODOLIO_USERNAME}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Codolio Github API returned ${response.status}`);
        }

        const json = await response.json();
        if (!json.status?.success) {
            throw new Error(`Codolio Github API error: ${json.status?.message || 'Unknown'}`);
        }
        
        const data = json.data;
        
        // We still want languages from somewhere. The Codolio github profile doesn't return languages.
        // We'll rely on a fallback or keep it empty, since languages might not be heavily needed, 
        // or we can just fetch languages if needed. Wait, the user asked to remove tags! 
        // We removed tags from UI anyway.
        return {
            activeDays: data.totalActiveDays || 0,
            contributions: data.totalContributions || data.commitCounts || 0,
            totalRepos: 0,
            languages: [], // Tags removed in UI
        };
    } catch (err) {
        log(`⚠️ Codolio Github API error: ${err.message}. Using fallback.`);
        return null;
    }
}

/**
 * Transforms raw Codolio + GitHub API data into the JSON format 
 * consumed by the frontend CodolioProfile component.
 */
function transformData(codolioData, githubStats) {
    const platforms = codolioData.platformProfiles?.platformProfiles || [];

    // --- Problem Solving Data ---
    // Sum total questions across all coding platforms
    let totalQuestionsSolved = 0;
    let totalPSActiveDays = 0;
    const psSubmissionDays = new Set();
    const psPlatforms = [];
    const allTags = new Set();

    for (const platform of platforms) {
        const questions = platform.totalQuestionStats?.totalQuestionCounts || 0;
        totalQuestionsSolved += questions;

        // Count active days from submission calendars
        const calendar = platform.dailyActivityStatsResponse?.submissionCalendar;
        if (calendar) {
            Object.keys(calendar).forEach(day => psSubmissionDays.add(day));
        }

        // Build platform list
        psPlatforms.push({
            name: platform.platform,
            handle: platform.userStats?.handle || '',
            rating: platform.userStats?.currentRating || null,
            maxRating: platform.userStats?.maxRating || null,
            rank: platform.userStats?.rank || null,
            stars: platform.userStats?.stars || null,
            questions: questions,
            types: platform.platformDetails?.types || [],
        });

        // Collect tags
        if (platform.userStats?.rank) allTags.add(platform.userStats.rank);
        if (platform.userStats?.stars) allTags.add(`${platform.userStats.stars}Stars`);
        if (platform.userStats?.languageList) {
            platform.userStats.languageList.forEach(lang => allTags.add(lang));
        }
        if (platform.platformDetails?.types) {
            platform.platformDetails.types.forEach(t => allTags.add(t));
        }
    }

    // Use psSubmissionDays count if totalActiveDays wasn't available
    if (totalPSActiveDays === 0) {
        totalPSActiveDays = psSubmissionDays.size;
    }

    // --- Development Data ---
    const devData = githubStats || {
        activeDays: 0,
        contributions: 0,
        languages: [],
    };

    // --- Build Output ---
    return {
        lastUpdated: new Date().toISOString(),
        profile: {
            name: `${codolioData.firstName} ${codolioData.secondName}`,
            username: codolioData.profileName,
            avatarUrl: codolioData.imageUrl,
            bio: codolioData.userDetails?.userPersonalDetails?.bio || '',
            profileViews: codolioData.profileViews || 0,
        },
        development: {
            activeDays: devData.activeDays,
            contributions: devData.contributions,
            totalRepos: devData.totalRepos || 0,
            githubUsername: codolioData.userDetails?.githubProfile || GITHUB_USERNAME,
            languages: devData.languages,
        },
        problemSolving: {
            questionsSolved: totalQuestionsSolved,
            activeDays: totalPSActiveDays,
            platforms: psPlatforms,
            tags: [...allTags].slice(0, 8),
        },
    };
}

/**
 * Main function: Fetches data, transforms it, saves to codolio.json.
 * Called by cron job (4 times/day) and manual trigger endpoint.
 */
const updateCodolioStats = async () => {
    log('🔄 Starting Codolio Update (REST API - V2)...');

    try {
        // 1. Fetch data from both APIs concurrently
        const [codolioData, githubStats] = await Promise.all([
            fetchCodolioProfile(),
            fetchGithubStats(),
        ]);

        log(`✅ Codolio API: Got profile for ${codolioData.profileName}`);
        log(`✅ GitHub API: ${githubStats ? `${githubStats.contributions} contributions, ${githubStats.activeDays} active days` : 'Using fallback'}`);

        // 2. Transform data
        const transformedData = transformData(codolioData, githubStats);

        // 3. Save to JSON file
        fs.writeFileSync(CODOLIO_JSON_PATH, JSON.stringify(transformedData, null, 2));
        log(`✅ Saved codolio.json (${JSON.stringify(transformedData).length} bytes)`);

        // 4. Git commit (handled by server.js performGitCommit)
        // The server.js already handles git push via performGitCommit()
        // We just need to ensure codolio.json is in the commit

        log('🔄 Codolio Update Complete!');
        return transformedData;

    } catch (err) {
        log(`❌ CRITICAL ERROR in Codolio Service: ${err.message}`);
        console.error(err);

        // Graceful degradation: if JSON file exists, it serves as fallback
        if (fs.existsSync(CODOLIO_JSON_PATH)) {
            log('ℹ️ Existing codolio.json will be used as fallback.');
        }
    }

    log('🔄 Finished Codolio Update.');
};

module.exports = { updateCodolioStats };
