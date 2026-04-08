const express = require('express');
const router = express.Router();
const db = require('../database');

// Middleware to check authentication
const isAuth = (req, res, next) => {
    if (req.session.userId) next();
    else res.status(401).json({ error: 'Please login first' });
};

// Post a new doubt (Student only)
router.post('/', isAuth, async (req, res) => {
    if (req.session.role !== 'student') {
        return res.status(403).json({ error: 'Only students can ask doubts' });
    }

    const { question } = req.body;
    try {
        await db.query(
            'INSERT INTO doubts (question, asked_by) VALUES (?, ?)',
            [question, req.session.userId]
        );
        res.status(201).json({ message: 'Doubt posted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to post doubt' });
    }
});

// Post a reply (Mentor only)
router.post('/:id/reply', isAuth, async (req, res) => {
    if (req.session.role !== 'mentor') {
        return res.status(403).json({ error: 'Only mentors can reply' });
    }

    const doubtId = req.params.id;
    const { reply } = req.body;

    try {
        await db.query(
            'INSERT INTO replies (doubt_id, mentor_id, reply) VALUES (?, ?, ?)',
            [doubtId, req.session.userId, reply]
        );
        res.status(201).json({ message: 'Reply posted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to post reply' });
    }
});

// Get all doubts with their replies
router.get('/', isAuth, async (req, res) => {
    try {
        const [doubts] = await db.query(`
            SELECT d.*, u.name as student_name 
            FROM doubts d 
            JOIN users u ON d.asked_by = u.id 
            ORDER BY d.created_at DESC
        `);

        // Get replies for each doubt
        for (let doubt of doubts) {
            const [replies] = await db.query(`
                SELECT r.*, u.name as mentor_name 
                FROM replies r 
                JOIN users u ON r.mentor_id = u.id 
                WHERE r.doubt_id = ?
                ORDER BY r.created_at ASC
            `, [doubt.id]);
            doubt.replies = replies;
        }

        res.json(doubts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch doubts' });
    }
});

module.exports = router;
