const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const songRoutes = require('./routes/songRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();

connectDB();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));