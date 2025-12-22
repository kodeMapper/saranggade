const mongoose = require('mongoose');

const botStateSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed }
});

module.exports = mongoose.model('BotState', botStateSchema);
