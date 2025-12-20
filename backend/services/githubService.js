const axios = require('axios');
const { getState, saveState } = require('./stateManager');

const USERNAME = process.env.GITHUB_USERNAME || 'kodeMapper';

const checkGithubUpdates = async () => {
    try {
        const response = await axios.get(`https://api.github.com/users/${USERNAME}/repos?sort=created&direction=desc`, {
            headers: {
                'User-Agent': 'Portfolio-Automation-App',
                'Authorization': process.env.GITHUB_TOKEN ? `token ${process.env.GITHUB_TOKEN}` : undefined
            }
        });
        const repos = response.data;

        const state = getState();
        const knownRepos = state.knownRepos || [];
        const newRepos = [];

        for (const repo of repos) {
            if (!knownRepos.includes(repo.id)) {
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

        return newRepos;

    } catch (error) {
        console.error('Error checking GitHub:', error.message);
        return null;
    }
};

const markRepoAsSeen = (repoId) => {
    const state = getState();
    if (!state.knownRepos) state.knownRepos = [];
    state.knownRepos.push(repoId);
    saveState(state);
};

module.exports = { checkGithubUpdates, markRepoAsSeen };
