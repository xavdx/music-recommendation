const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    genre: { type: String, required: true },
    fileUrl: { type: String, required: true }
});

module.exports = mongoose.model('Song', SongSchema);