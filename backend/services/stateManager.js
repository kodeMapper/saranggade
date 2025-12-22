const BotState = require('../models/BotState');

const getState = async () => {
    try {
        const doc = await BotState.findOne({ key: 'main' });
        if (!doc) {
            return {
                knownRepos: [],
                seenLinkedinItems: [],
                codolioStats: {},
                lastGithubCheck: null,
                lastCodolioCheck: null
            };
        }
        return doc.value;
    } catch (error) {
        console.error("Error getting state from MongoDB:", error);
        return { knownRepos: [], seenLinkedinItems: [], codolioStats: {} };
    }
};

const saveState = async (state) => {
    try {
        await BotState.findOneAndUpdate(
            { key: 'main' },
            { value: state },
            { upsert: true, new: true }
        );
    } catch (error) {
        console.error("Error saving state to MongoDB:", error);
    }
};

module.exports = { getState, saveState };
