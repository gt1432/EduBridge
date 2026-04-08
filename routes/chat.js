const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

const isAuth = (req, res, next) => {
    if (req.session.userId) next();
    else res.status(401).json({ error: 'Please login first' });
};

router.post('/send', isAuth, async (req, res) => {
    try {
        const newMsg = new Message({
            sender_id: req.session.userId,
            receiver_id: req.body.receiver_id,
            message: req.body.message
        });
        await newMsg.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

router.get('/history/:userId', isAuth, async (req, res) => {
    const otherUserId = req.params.userId;
    const myId = req.session.userId;
    try {
        const messages = await Message.find({
            $or: [
                { sender_id: myId, receiver_id: otherUserId },
                { sender_id: otherUserId, receiver_id: myId }
            ]
        }).sort({ created_at: 1 }).lean();
        
        // Add sender_id normalization for frontend check
        res.json(messages.map(m => ({ ...m, sender_id: m.sender_id.toString() })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load conversation' });
    }
});

router.get('/users', isAuth, async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.session.userId } }, 'name role').lean();
        res.json(users.map(u => ({ id: u._id, name: u.name, role: u.role })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

module.exports = router;
