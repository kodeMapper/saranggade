const PendingUpdate = require('../models/PendingUpdate');

const getPendingUpdates = async () => {
    try {
        // Only fetch pending items for the active queue
        return await PendingUpdate.find({ status: 'pending' }).lean();
    } catch (error) {
        console.error("Error fetching pending updates:", error);
        return [];
    }
};

const adddPendingUpdate = async (type, data) => {
    try {
        // Prevent duplicates (Check active OR recently approved/rejected if strict prevention is needed?)
        // User wants to re-add things, so we should ONLY check 'pending' status for duplicates.
        // If an 'approved' one exists, we CAN add a new 'pending' one if it's found again.
        const exists = await PendingUpdate.findOne({
            type,
            status: 'pending',
            $or: [{ 'data.id': data.id }, { 'data.name': data.name }]
        });
        if (exists) return { ...exists.toObject(), id: exists._id.toString() };

        const newUpdate = new PendingUpdate({ type, data, status: 'pending' });
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

// Replaces removeUpdate
const resolveUpdate = async (id, status) => {
    try {
        await PendingUpdate.findByIdAndUpdate(id, { status: status });
    } catch (error) {
        console.error("Error resolving pending update:", error);
    }
};

module.exports = { getPendingUpdates, adddPendingUpdate, getUpdateById, resolveUpdate };
