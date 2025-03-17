const express = require('express');
const Song = require('C:/Anshav Desai/SEM 6 Project/music-recommendation/backend/models/Song');
const authMiddleware = require('../middleware/authMiddleware');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const router = express.Router();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
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
    try {
        const response = await axios.get(`http://localhost:5001/recommend?song=${encodeURIComponent(req.params.songTitle)}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recommendations', error: error.message });
    }
});

module.exports = router;