const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Resource = require('../models/Resource');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

const isMentor = (req, res, next) => {
    if (req.session.role === 'mentor') next();
    else res.status(403).json({ error: 'Access denied: Mentors only' });
};

router.post('/upload', isMentor, upload.single('file'), async (req, res) => {
    const { title, type, link } = req.body;
    let fileLink = '';

    if (type === 'pdf' || type === 'video') {
        if (!req.file) return res.status(400).json({ error: 'File is required' });
        fileLink = '/uploads/' + req.file.filename;
    } else if (type === 'link') {
        if (!link) return res.status(400).json({ error: 'Link is required' });
        fileLink = link;
    }

    try {
        const newResource = new Resource({
            title, type, file_link: fileLink, uploaded_by: req.session.userId
        });
        await newResource.save();
        res.status(201).json({ message: 'Resource uploaded successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during upload' });
    }
});

router.get('/', async (req, res) => {
    try {
        const resources = await Resource.find()
            .populate('uploaded_by', 'name')
            .sort({ created_at: -1 })
            .lean();
        
        // Map to match frontend expectations (adding mentor_name)
        const mapped = resources.map(r => ({
            ...r,
            mentor_name: r.uploaded_by ? r.uploaded_by.name : 'Unknown'
        }));
        res.json(mapped);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching resources' });
    }
});

module.exports = router;
