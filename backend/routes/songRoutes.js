const express = require('express');
const Song = require('../models/Song');
const authMiddleware = require('../middleware/authMiddleware');
const { S3Client } = require('@aws-sdk/client-s3'); // Use v3 S3 client
const multer = require('multer');
const multerS3 = require('multer-s3');
const router = express.Router();
const axios = require('axios');

// Initialize S3Client with v3
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
});

const upload = multer({
    storage: multerS3({
        s3: s3Client, // Pass the v3 S3Client instance
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read', // Note: ACL might need adjustment (see below)
        key: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    })
});

router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        const { title, artist, genre } = req.body;
        if (!title || !artist || !genre || !req.file) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const fileUrl = req.file.location;
        const song = new Song({ title, artist, genre, fileUrl });
        await song.save();

        res.json({ message: 'Song uploaded successfully', song });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/recommend/:songTitle', async (req, res) => {
    console.log('Received request for song:', req.params.songTitle);
    try {
        const response = await axios.get(`http://localhost:5001/recommend?song=${encodeURIComponent(req.params.songTitle)}`);
        console.log('Flask response:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching from Flask:', error.message);
        res.status(500).json({ message: 'Error fetching recommendations', error: error.message });
    }
});

module.exports = router;