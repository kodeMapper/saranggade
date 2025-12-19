const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Need to install uuid or just use simpler ID

const PENDING_FILE = path.join(__dirname, '../pending_updates.json');

const getPendingUpdates = () => {
    if (!fs.existsSync(PENDING_FILE)) return [];
    return JSON.parse(fs.readFileSync(PENDING_FILE, 'utf-8'));
};

const savePendingUpdates = (updates) => {
    fs.writeFileSync(PENDING_FILE, JSON.stringify(updates, null, 2));
};

const adddPendingUpdate = (type, data) => {
    const updates = getPendingUpdates();
    // Check if already pending
    const exists = updates.find(u => u.type === type && (u.data.id === data.id || u.data.name === data.name));
    if (exists) return exists;

    const newUpdate = {
        id: Date.now().toString(), // Simple ID
        type,
        data,
        receivedAt: new Date().toISOString()
    };
    updates.push(newUpdate);
    savePendingUpdates(updates);
    return newUpdate;
};

const getUpdateById = (id) => {
    const updates = getPendingUpdates();
    return updates.find(u => u.id === id);
};

const removeUpdate = (id) => {
    let updates = getPendingUpdates();
    updates = updates.filter(u => u.id !== id);
    savePendingUpdates(updates);
};

module.exports = { getPendingUpdates, adddPendingUpdate, getUpdateById, removeUpdate };
