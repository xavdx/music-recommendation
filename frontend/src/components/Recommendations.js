import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Auth from './Auth';

const Recommendations = () => {
    const [song, setSong] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    const fetchRecommendations = async () => {
        try {
            const res = await axios.get(`https://music-recommendation-1-566r.onrender.com/api/songs/recommend/${encodeURIComponent(song)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecommendations(res.data.recommendations || []);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            setRecommendations([]);
        }
    };

    if (!token) return <Auth setToken={setToken} />;

    return (
        <div>
            <input value={song} onChange={(e) => setSong(e.target.value)} placeholder="Enter song name" />
            <button onClick={fetchRecommendations}>Get Recommendations</button>
            {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                    <div key={index}><p><b>{rec.title}</b> by {rec.artists}</p></div>
                ))
            ) : (
                <p>No recommendations found.</p>
            )}
        </div>
    );
};

export default Recommendations;