const axios = require('axios');
const { getState, saveState } = require('./stateManager');

const USERNAME = process.env.GITHUB_USERNAME || 'kodeMapper';

const checkGithubUpdates = async () => {
    console.log("🔍 [GitHub Check] Starting...");
    try {
        const response = await axios.get(`https://api.github.com/users/${USERNAME}/repos?sort=created&direction=desc`, {
            headers: {
                'User-Agent': 'Portfolio-Automation-App',
                'Authorization': process.env.GITHUB_TOKEN ? `token ${process.env.GITHUB_TOKEN}` : undefined
            }
        });
        const repos = response.data;
        console.log(`🔍 [GitHub Check] Fetched ${repos.length} repos from API.`);

        const state = await getState();
        const knownRepos = state.knownRepos || [];
        console.log(`🔍 [GitHub Check] Found ${knownRepos.length} known repos in DB.`);

        const newRepos = [];

        for (const repo of repos) {
            if (!knownRepos.includes(repo.id)) {
                console.log(`✨ [GitHub Check] New repo found: ${repo.name} (ID: ${repo.id})`);
                // Fetch README content
                try {
                    const readmeRes = await axios.get(`https://raw.githubusercontent.com/${USERNAME}/${repo.name}/main/README.md`);
                    repo.readmeContent = readmeRes.data;
                } catch (err) {
                    // Try master branch if main fails
                    try {
                        const readmeRes = await axios.get(`https://raw.githubusercontent.com/${USERNAME}/${repo.name}/master/README.md`);
                        repo.readmeContent = readmeRes.data;
                    } catch (e) {
                        repo.readmeContent = null; // No README found
                    }
                }
                newRepos.push(repo);
            }
        }

        if (newRepos.length === 0) {
            console.log("✅ [GitHub Check] No new repositories found.");
        }

        return newRepos;

    } catch (error) {
        console.error('❌ [GitHub Check] Error:', error.message);
        return null;
    }
};

const markRepoAsSeen = async (repoId) => {
    const state = await getState();
    if (!state.knownRepos) state.knownRepos = [];
    state.knownRepos.push(repoId);
    await saveState(state);
};

module.exports = { checkGithubUpdates, markRepoAsSeen };
