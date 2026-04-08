const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../database');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup Multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Middleware to check if user is mentor
const isMentor = (req, res, next) => {
    if (req.session.role === 'mentor') next();
    else res.status(403).json({ error: 'Access denied: Mentors only' });
};

// Upload a resource (Mentor only)
router.post('/upload', isMentor, upload.single('file'), async (req, res) => {
    const { title, type, link } = req.body;
    const uploadedBy = req.session.userId;
    let fileLink = '';

    if (type === 'pdf' || type === 'video') {
        if (!req.file) {
            return res.status(400).json({ error: 'File is required for type PDF/Video' });
        }
        fileLink = '/uploads/' + req.file.filename;
    } else if (type === 'link') {
        if (!link) {
            return res.status(400).json({ error: 'Link is required for type Link' });
        }
        fileLink = link;
    }

    try {
        await db.query(
            'INSERT INTO resources (title, type, file_link, uploaded_by) VALUES (?, ?, ?, ?)',
            [title, type, fileLink, uploadedBy]
        );
        res.status(201).json({ message: 'Resource uploaded successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during upload' });
    }
});

// Get all resources
router.get('/', async (req, res) => {
    try {
        const [resources] = await db.query(`
            SELECT r.*, u.name as mentor_name 
            FROM resources r 
            JOIN users u ON r.uploaded_by = u.id 
            ORDER BY r.created_at DESC
        `);
        res.json(resources);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching resources' });
    }
});

module.exports = router;
