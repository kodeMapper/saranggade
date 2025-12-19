const fs = require('fs');
const path = require('path');

const STATE_FILE = path.join(__dirname, '../state.json');

const getState = () => {
    if (!fs.existsSync(STATE_FILE)) {
        return {
            lastGithubCheck: null,
            lastCodolioCheck: null,
            knownRepos: [], // List of repo IDs
            codolioStats: {} // Last known stats
        };
    }
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
};

const saveState = (state) => {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
};

module.exports = { getState, saveState };
