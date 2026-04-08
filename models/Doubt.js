const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
    question: { type: String, required: true },
    asked_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Doubt', doubtSchema);
