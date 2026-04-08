const express = require('express');
const router = express.Router();
const Doubt = require('../models/Doubt');
const Reply = require('../models/Reply');

const isAuth = (req, res, next) => {
    if (req.session.userId) next();
    else res.status(401).json({ error: 'Please login first' });
};

router.post('/', isAuth, async (req, res) => {
    if (req.session.role !== 'student') return res.status(403).json({ error: 'Only students can ask doubts' });
    
    try {
        const newDoubt = new Doubt({ question: req.body.question, asked_by: req.session.userId });
        await newDoubt.save();
        res.status(201).json({ message: 'Doubt posted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to post doubt' });
    }
});

router.post('/:id/reply', isAuth, async (req, res) => {
    if (req.session.role !== 'mentor') return res.status(403).json({ error: 'Only mentors can reply' });

    try {
        const newReply = new Reply({
            doubt_id: req.params.id,
            mentor_id: req.session.userId,
            reply: req.body.reply
        });
        await newReply.save();
        res.status(201).json({ message: 'Reply posted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to post reply' });
    }
});

router.get('/', isAuth, async (req, res) => {
    try {
        const doubts = await Doubt.find().populate('asked_by', 'name').sort({ created_at: -1 }).lean();
        
        for (let doubt of doubts) {
            doubt.student_name = doubt.asked_by ? doubt.asked_by.name : 'Unknown';
            doubt.id = doubt._id; // Front-end matching
            
            const replies = await Reply.find({ doubt_id: doubt._id }).populate('mentor_id', 'name').sort({ created_at: 1 }).lean();
            doubt.replies = replies.map(r => ({
                ...r,
                mentor_name: r.mentor_id ? r.mentor_id.name : 'Unknown'
            }));
        }
        res.json(doubts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch doubts' });
    }
});

module.exports = router;
