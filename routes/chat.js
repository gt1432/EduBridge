const express = require('express');
const router = express.Router();
const db = require('../database');

// Middleware to check authentication
const isAuth = (req, res, next) => {
    if (req.session.userId) next();
    else res.status(401).json({ error: 'Please login first' });
};

// Send a message
router.post('/send', isAuth, async (req, res) => {
    const { receiver_id, message } = req.body;
    try {
        await db.query(
            'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
            [req.session.userId, receiver_id, message]
        );
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Get conversation with a specific user
router.get('/history/:userId', isAuth, async (req, res) => {
    const otherUserId = req.params.userId;
    const myId = req.session.userId;
    try {
        const [messages] = await db.query(`
            SELECT * FROM messages 
            WHERE (sender_id = ? AND receiver_id = ?) 
               OR (sender_id = ? AND receiver_id = ?)
            ORDER BY created_at ASC
        `, [myId, otherUserId, otherUserId, myId]);
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load conversation' });
    }
});

// Get list of all users to chat with
router.get('/users', isAuth, async (req, res) => {
    try {
        const [users] = await db.query(`
            SELECT id, name, role FROM users WHERE id != ?
        `, [req.session.userId]);
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

module.exports = router;
