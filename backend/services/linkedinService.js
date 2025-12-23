/**
 * LinkedIn Service - Manual Updates Only
 * 
 * Puppeteer-based automation has been REMOVED to reduce memory usage on Render.
 * LinkedIn updates are now handled MANUALLY through the admin panel.
 * 
 * This file only exports the markItemAsSeen function for the approval flow.
 */

const { getState, saveState } = require('./stateManager');

/**
 * Mark a LinkedIn item as seen (used when approving/rejecting pending updates)
 * @param {string} identifier - Unique identifier for the item (e.g., "EXP:Title:Company", "SKILL:SkillName")
 */
const markItemAsSeen = async (identifier) => {
    const state = await getState();
    if (!state.seenLinkedinItems) state.seenLinkedinItems = [];
    if (!state.seenLinkedinItems.includes(identifier)) {
        state.seenLinkedinItems.push(identifier);
        await saveState(state);
    }
};

module.exports = { markItemAsSeen };
