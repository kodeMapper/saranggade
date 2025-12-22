const PendingUpdate = require('../models/PendingUpdate');

const getPendingUpdates = async () => {
    try {
        return await PendingUpdate.find({}).lean();
    } catch (error) {
        console.error("Error fetching pending updates:", error);
        return [];
    }
};

const adddPendingUpdate = async (type, data) => {
    try {
        // Prevent duplicates
        const exists = await PendingUpdate.findOne({
            type,
            $or: [{ 'data.id': data.id }, { 'data.name': data.name }]
        });
        if (exists) return { ...exists.toObject(), id: exists._id.toString() };

        const newUpdate = new PendingUpdate({ type, data });
        await newUpdate.save();
        return {
            id: newUpdate._id.toString(),
            type: newUpdate.type,
            data: newUpdate.data,
            receivedAt: newUpdate.receivedAt
        };
    } catch (error) {
        console.error("Error adding pending update:", error);
        return null;
    }
};

const getUpdateById = async (id) => {
    try {
        return await PendingUpdate.findById(id).lean();
    } catch (error) {
        return null; // Invalid ID or not found
    }
};

const removeUpdate = async (id) => {
    try {
        await PendingUpdate.findByIdAndDelete(id);
    } catch (error) {
        console.error("Error removing pending update:", error);
    }
};

module.exports = { getPendingUpdates, adddPendingUpdate, getUpdateById, removeUpdate };
