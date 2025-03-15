import React, { useState } from 'react';
import axios from 'axios';

const Recommendations = () => {
    const [song, setSong] = useState('');
    const [recommendations, setRecommendations] = useState([]);

    const fetchRecommendations = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/songs/recommend/${encodeURIComponent(song)}`);
            setRecommendations(res.data.recommendations || []);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            setRecommendations([]);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={song}
                onChange={(e) => setSong(e.target.value)}
                placeholder="Enter song name"
            />
            <button onClick={fetchRecommendations}>Get Recommendations</button>
            {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                    <div key={index}>
                        <p>
                            <b>{rec.title}</b> by {rec.artists}
                        </p>
                    </div>
                ))
            ) : (
                <p>No recommendations found.</p>
            )}
        </div>
    );
};

export default Recommendations;