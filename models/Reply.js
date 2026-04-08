const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    doubt_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Doubt', required: true },
    mentor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reply: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reply', replySchema);
