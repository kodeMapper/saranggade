const mongoose = require('mongoose');

const pendingUpdateSchema = new mongoose.Schema({
    type: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    receivedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PendingUpdate', pendingUpdateSchema);
