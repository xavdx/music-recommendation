import React, { useState } from 'react';
import axios from 'axios';
import Auth from './Auth';

const Recommendations = () => {
    const [song, setSong] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    const fetchRecommendations = async () => {
        try {
            const res = await axios.get(`https://music-recommendation-1-566r.onrender.com/recommend?song=${encodeURIComponent(song)}`, {
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
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
            <div className="flex space-x-4 mb-6">
                <input
                    value={song}
                    onChange={(e) => setSong(e.target.value)}
                    placeholder="Enter song name"
                    className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    onClick={fetchRecommendations}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
                >
                    Get Recommendations
                </button>
            </div>
            {recommendations.length > 0 ? (
                <ul className="space-y-4">
                    {recommendations.map((rec, index) => (
                        <li
                            key={index}
                            className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition duration-200"
                        >
                            <p className="text-lg font-medium text-gray-800">
                                <b>{rec.title}</b> by {rec.artists}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-600">No recommendations found.</p>
            )}
        </div>
    );
};
export default Recommendations;