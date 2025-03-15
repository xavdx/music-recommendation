const express = require('express');
const Playlist = require('../models/Playlist');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    const { name } = req.body;
    try {
        if (!name) return res.status(400).json({ message: 'Playlist name is required' });
        const playlist = new Playlist({ name, user: req.user.id, songs: [] });
        await playlist.save();
        res.json(playlist);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/:playlistId/add-song', authMiddleware, async (req, res) => {
    const { songId } = req.body;
    try {
        const playlist = await Playlist.findById(req.params.playlistId);
        if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
        if (playlist.user.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        playlist.songs.push(songId);
        await playlist.save();
        res.json(playlist);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const playlists = await Playlist.find({ user: req.user.id }).populate('songs');
        res.json(playlists);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;